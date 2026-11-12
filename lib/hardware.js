// Hardware devices: a board over USB ("serial"), a board on wired Ethernet ("ethernet"), ESP32 over WiFi ("esp32"), or "simulator".
// Mega and ESP32 speak the same line protocol (docs/DEVICE_PROTOCOL.md).
import { lostLinkSec, boardOf, connOf, realConnOf } from '../public/links.js';
import net from 'node:net';
import { EventEmitter } from 'node:events';
import { PIN_OUTPUTS, isManualValve } from './store.js';
import { portSharers, rtdPinError, canPseudoPwm, pseudoPwmOn, canTruePwm, hasDualThrow, dualThrowDelay } from '../public/naming.js';
import { isMethodDevice, heatMethodKey, PERCENT_METHODS } from '../public/heatmethod.js';
import { isPwmPump, pumpSpeed } from '../public/pumps.js';
import { calibrate } from './control.js';
import { applyCalibrations } from '../public/calibrations.js';
import { hydroReadings, hydroModel, simReport } from '../public/hydrometer.js';
import { ANALOG_TEMP, analogFrom, analogIndex, analogOutLevel, flowFrom, pinOf, pwmDuty, scaleCalibration, scaleFrom, temperatureFrom } from './sensors.js';
import { clock } from './simclock.js';
import { smoothWeight, smoothStep, samplingPeriod } from '../public/calibrations.js';      // Smoothing (Rule 6.24)
import { explainLine, answerSec } from '../public/boardtalk.js';      // Board settings and Board Talk (Rule 6.27)
import fs from 'node:fs';
import path from 'node:path';
import { StepperSim, clampPosition, enableLine, fromSteps, goLine, homeLine, runLine, stepperCfgLines, stopLine, toSteps, zeroLine } from './steppers.js';

const sleep = ms => new Promise(r => setTimeout(r, ms));

class LineDevice extends EventEmitter {
  constructor(cfg) {
    super();
    this.cfg = cfg; this.name = cfg.name; this.connection = connOf(cfg);
    this.status = 'connecting'; this.info = ''; this.lastRx = 0;
    this.buf = ''; this.closed = false; this.conn = null;
  }
  async open() {
    while (!this.closed) {
      try {
        await this._connect();
        this.status = 'connected'; this.emit('status');
        this.send('HELLO');
        this.emit('connected');
        await new Promise(res => { this._onClose = res; });
      } catch (e) { this.info = e.message; }
      if (this.closed) break;
      this.status = 'disconnected'; this.emit('status');
      await sleep(5000);
    }
  }
  _data(chunk) {
    this.buf += chunk.toString();
    let i;
    while ((i = this.buf.indexOf('\n')) >= 0) {
      const line = this.buf.slice(0, i).trim(); this.buf = this.buf.slice(i + 1);
      if (line) { this.lastRx = Date.now(); this.emit('line', line); }
    }
    // a board that sends without ever ending a line (wrong baud rate, noise on the wire) must not fill the Brain's memory:
    // keep only the last 4 KB (no Skynet line is that long)
    if (this.buf.length > 64 * 1024) this.buf = this.buf.slice(-4096);
  }
  _ended() { this.conn = null; this.buf = ''; this._onClose?.(); }
  close() { this.closed = true; try { this.conn?.destroy?.(); this.conn?.close?.(); } catch { } this._onClose?.(); }
}

class TcpDevice extends LineDevice {          // ESP32 over WiFi, or any board on Ethernet (TCP port 4100)
  _connect() {
    return new Promise((res, rej) => {
      const s = net.createConnection({ host: this.cfg.host, port: this.cfg.port ?? 4100 }, () => { this.conn = s; s.setKeepAlive(true, 5000); res(); });
      s.setTimeout(8000, () => s.destroy(new Error('timeout')));
      s.on('data', d => this._data(d));
      s.on('error', e => { this.info = e.message; if (!this.conn) rej(e); });
      s.on('close', () => this._ended());
    });
  }
  send(line) { if (this.conn) this.conn.write(line + '\n'); }
}

let serialMod = null;
export async function loadSerial() {
  if (serialMod !== null) return serialMod;
  try { serialMod = await import('serialport'); } catch { serialMod = false; }
  return serialMod;
}

class SerialDevice extends LineDevice {       // Arduino Mega over USB
  async _connect() {
    const sp = await loadSerial();
    if (!sp) throw new Error('USB serial support not installed: run  npm install serialport');
    await new Promise((res, rej) => {
      const p = new sp.SerialPort({ path: this.cfg.port, baudRate: this.cfg.baud ?? 115200 }, err => err ? rej(err) : res());
      p.on('data', d => this._data(d));
      p.on('close', () => this._ended());
      p.on('error', e => { this.info = e.message; });
      this.conn = p;
    });
    await sleep(2000);                         // a Mega resets when the port opens
  }
  send(line) { if (this.conn?.isOpen) this.conn.write(line + '\n'); }
}

class OffDevice extends EventEmitter {        // device switched off in its settings (enabled: false)
  constructor(cfg) { super(); this.cfg = cfg; this.name = cfg.name; this.connection = connOf(cfg); this.status = 'disabled'; this.info = 'disabled in settings'; }
  open() { }
  send() { }
  close() { }
}

class SimDevice extends EventEmitter {        // no hardware: outputs echo, temperatures move with heaters/coolers, steppers turn
  constructor(cfg, hw) {
    super(); this.cfg = cfg; this.name = cfg.name; this.connection = 'simulator'; this.status = 'connected'; this.info = 'simulator';
    if (connOf(cfg) !== 'simulator') { this.standIn = true; this.info = `simulation mode (the real ${connOf(cfg) === 'serial' ? 'USB board' : 'board'} is not used)`; }
    this.steppers = new StepperSim(l => this.emit('line', l), pin => hw?._stepperSim(this.name, pin) ?? {});
  }
  open() { this.emit('connected'); }
  send(line) { this.steppers.line(line); }
  close() { }
}

export class Hardware {
  constructor(store, { off = false } = {}) {
    this.off = off;      // off: no board is ever opened (the Importer's Build page)
    this.store = store; this.devices = new Map(); this.probesSeen = new Map(); // device -> {rom: temp}
    this.pulses = new Map();   // flow meter name -> last {count, t}
    this.cells = new Map();    // scale name -> {DT pin: raw} for each of its load-cell boards
    this.settle = new Map();   // scale name -> {t, volume} while it reads empty (for auto tare)
    this.simWeight = new Map();
    this.dinLevel = new Map();  // digital input name -> level after on/off delays
    this.dinTimers = new Map();
    this.dinPress = new Map();  // momentary button name -> time of the last press that counted
    this.dinPulse = new Map();
    this.homing = new Set();    // steppers looking for their home switch
    this.stepSent = new Map();  // stepper name -> time of the last command sent to its board
    this.stepQuietMs = 500;     // a "not moving" report this soon after a command left before the board got it
    store.on('change', (name, prop, v, source) => this._onChange(name, prop, v, source));
  }

  start() {
    for (const d of this.store.config.devices ?? []) this.add(d);
    // The simulator moves one step per second of clock time: faster in simulation mode, and all the
    // missed steps after a skip ahead (with the controls run between them, so a heater still stops at its target)
    const simDt = clock.stepper(); let acc = 0;
    this.simTimer = setInterval(() => {
      acc += simDt() / 1000;
      const n = Math.min(Math.floor(acc), 3600); acc = n < 3600 ? acc - n : 0;
      const end = clock.now();
      for (let i = n - 1; i >= 0; i--) { if (i < n - 1) this.onSimStep?.(end - i * 1000); this._simulate(); }
    }, 250);
    this.pingTimer = setInterval(() => { for (const d of this.devices.values()) { if (d.status === 'connected' || d.status === 'no answer') d.send?.('PING'); this._answerCheck(d); } }, 2000);
    this.stepTimer = setInterval(() => { for (const d of this.devices.values()) d.steppers?.tick(0.1 * clock.speed); }, 100);
    this.pseudoTimer = setInterval(() => this._pseudoTick(), 50);
    this.hydroTimer = setInterval(() => this.hydroLost(clock.now()), 5000);      // Hydrometers: Lost signal (Rule 6.25)
  }

  add(cfg) {
    let D = cfg.enabled === false ? OffDevice : { serial: SerialDevice, esp32: TcpDevice, ethernet: TcpDevice, simulator: SimDevice }[connOf(cfg)];
    if (D && D !== OffDevice && clock.active) D = SimDevice;       // simulation mode: never open a real board
    if (this.off && D) D = OffDevice;
    if (!D) { console.error(`Device "${cfg.name}": unknown Connection "${connOf(cfg)}"`); return; }
    const dev = new D(cfg, this);
    this.devices.set(cfg.name, dev);
    this.probesSeen.set(cfg.name, {});
    // Board Talk (Rule 6.27): every line both ways is kept for the Board Talk window (and the board's log file when Diagnostic
    // logging is on). Paused: nothing is sent but PING (so the board keeps its outputs) and what a person types in Board Talk, and
    // what the board says is shown but not used.
    const raw = dev.send?.bind(dev);
    dev.paused = cfg.paused === true; dev.rawSend = raw;
    if (raw) dev.send = line => { if (dev.paused && !/^PING\b/i.test(line)) return this._talk(dev, 'held', line); this._talk(dev, 'out', line); raw(line); };
    dev.on('line', l => {
      this._talk(dev, 'in', l);
      if (dev.status === 'no answer') { dev.status = 'connected'; dev.info = ''; this.store.emit('devices'); }
      if (!dev.paused) this._onLine(dev, l);
    });
    dev.on('connected', () => { dev.connectedAt = Date.now(); this._resendOutputs(dev); });
    dev.on('status', () => this.store.emit('devices'));
    dev.open();
  }

  // ---- Board settings and Board Talk (OakBarn Brewery, 2026-11-09, Rule 6.27)
  // Answer wait (BruControl's Response Timeout): a connected board that has said nothing this long is shown as "no answer"
  _answerCheck(d, now = Date.now()) {
    if (d.status !== 'connected' || d.paused || !d.connectedAt || d.lastRx === undefined) return;
    const sec = answerSec(d.cfg);
    if (now - Math.max(d.lastRx, d.connectedAt) <= sec * 1000) return;
    d.status = 'no answer'; d.info = `No answer from the board for ${sec} s (its Answer wait). Check its cable, its power and its program.`;
    this._talk(d, 'note', d.info); this.store.emit('devices');
  }
  _talk(dev, dir, line) {
    const all = (this.talk ??= new Map());
    let b = all.get(dev.name); if (!b) all.set(dev.name, b = { seq: 0, lines: [] });
    const t = Date.now(); b.lines.push({ seq: ++b.seq, t, dir, line }); if (b.lines.length > 500) b.lines.splice(0, b.lines.length - 500);
    if (dev.cfg?.logging && this.logDir) this._log(dev.name, t, dir, line);
  }
  // Diagnostic logging: one file a day for each board, in the data folder's logs/boards
  _log(name, t, dir, line) {
    const d = new Date(t), p2 = n => String(n).padStart(2, '0'), day = `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
    const file = path.join(this.logDir, `${String(name).replace(/[^\w.-]+/g, '_')}-${day}.log`);
    const arrow = { out: '->', in: '<-', held: '-| (paused, not sent)', note: '!!' }[dir] ?? dir;
    const text = `${day} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0')}  ${arrow} ${line}${dir === 'note' ? '' : '    ' + explainLine(line, dir === 'in' ? 'in' : 'out')}\n`;
    try { if (!this._logMade) { fs.mkdirSync(this.logDir, { recursive: true }); this._logMade = true; } fs.appendFile(file, text, () => { }); } catch { }
  }
  // the lines since seq `after`, for the Board Talk window
  talkSince(name, after = 0) {
    const dev = this.devices.get(name);
    if (!dev && !this.talk?.has(name)) throw new Error(`There is no Interface called ${name}`);
    const b = this.talk?.get(name) ?? { seq: 0, lines: [] };
    return { seq: b.seq, lines: b.lines.filter(l => l.seq > after), paused: !!dev?.paused, status: dev?.status ?? 'disabled', info: dev?.info ?? '', logging: !!dev?.cfg?.logging };
  }
  // a line a person typed in Board Talk: sent even while paused
  talkSend(name, line) {
    const dev = this.devices.get(name);
    if (!dev || !dev.rawSend || dev.status === 'disabled') throw new Error(`${name} is Off, so nothing can be sent to it (turn it On in its Interface settings)`);
    if (dev.status !== 'connected' && dev.status !== 'no answer') throw new Error(`${name} is not connected (${dev.status}), so the line cannot be sent`);
    this._talk(dev, 'out', line); dev.rawSend(line);
  }
  // Pause communications: kept in the Interface's settings; going on again sends every setting and output so the board matches
  pause(name, on) {
    const dev = this.devices.get(name); if (!dev) throw new Error(`There is no Interface called ${name}`);
    dev.paused = !!on; if (dev.cfg) dev.cfg.paused = !!on;
    this._talk(dev, 'note', on ? 'Paused: nothing is sent but PING, and what the board says is not used.' : 'Talking again: every setting and output is sent so the board matches the screen.');
    if (!on && (dev.status === 'connected' || dev.status === 'no answer')) this._resendOutputs(dev);
    this.store.emit('devices');
  }

  // A Counter's Rate (Rule 6.24, as BruControl's Counter Input): the counts per second over its Sampling Period (1 to 10 s), then
  // smoothed. Its Count is never smoothed. A Count that goes down (reset) starts a new window.
  _counterRates(now) {
    const win = (this.counterWin ??= new Map());
    for (const el of this.store.list('digitalIn')) {
      if (el.mode !== 'counter') { win.delete(el.name); continue; }
      const count = Number(this.store.getProp(el.name, 'count')) || 0, w = win.get(el.name);
      if (!w || count < w.count) { win.set(el.name, { t: now, count }); continue; }
      const secs = (now - w.t) / 1000;
      if (secs < samplingPeriod(el)) continue;
      this.store.setProp(el.name, 'rate', this._smooth(el, 'rate', (count - w.count) / secs), 'hw');
      win.set(el.name, { t: now, count });
    }
  }

  // Pseudo PWM (Fritz, 2026-11-05): a PWM Device on a plain pin is turned fully on for its % of every second, and off for the rest
  _pseudoTick(now = Date.now()) {
    this.pseudo ??= new Map();
    if (now - (this.counterAt ?? 0) >= 250) { this.counterAt = now; this._counterRates(now); }      // Counter Rates (Rule 6.24)
    for (const el of this.store.list()) {
      if (!el.pseudoPwm || !canPseudoPwm(el) || !el.device) continue;
      const l = this._outLine(el, now); if (!l || this.pseudo.get(el.name) === l) continue;
      this.pseudo.set(el.name, l); this.devices.get(el.device)?.send?.(l);
    }
  }

  // Dual Throw (OakBarn Brewery, 2026-11-09, Rule 6.22): an on / off output that drives a second Port as its opposite. Is it one now?
  _dual(el) { return hasDualThrow(el) && !isManualValve(el) && !isMethodDevice(el) && !(isPwmPump(el) && canTruePwm(el, this.store.config.devices)); }
  // the second Port's line: on while the Device is OFF (Active Low inverts both Ports)
  _dualLine(el, on) { return `DO ${pinOf(el.dualThrowChannel)} ${(!on !== !!el.activeLow) ? 1 : 0}`; }
  // switch a Dual Throw Device: the Port that goes off goes off first, and after the Dual Throw delay the other one comes on, so the two
  // are never on together. A newer switch before the delay is over cancels the waiting one.
  _dualSend(el, dev) {
    this.dualTimers ??= new Map();
    clearTimeout(this.dualTimers.get(el.name)); this.dualTimers.delete(el.name);
    const on = !!this.store.getProp(el.name, 'state'), own = `DO ${pinOf(el.channel)} ${(on !== !!el.activeLow) ? 1 : 0}`, other = this._dualLine(el, on);
    const offLine = on ? other : own, onLine = on ? own : other, wait = dualThrowDelay(el);
    dev.send?.(offLine);
    if (!wait) { dev.send?.(onLine); return; }
    this.dualTimers.set(el.name, setTimeout(() => {
      this.dualTimers.delete(el.name);
      if (!!this.store.getProp(el.name, 'state') === on) this.devices.get(el.device)?.send?.(onLine);
    }, wait));
  }

  stop() { for (const t of this.dualTimers?.values() ?? []) clearTimeout(t); this.dualTimers?.clear(); clearInterval(this.simTimer); clearInterval(this.pingTimer); clearInterval(this.stepTimer); clearInterval(this.pseudoTimer); clearInterval(this.hydroTimer); for (const d of this.devices.values()) d.close(); this.devices.clear(); }
  restart() { for (const t of [...this.dinTimers.values(), ...this.dinPulse.values()]) clearTimeout(t); this.dinTimers.clear(); this.dinPress.clear(); this.dinLevel.clear(); this.stop(); this.pulses.clear(); this.cells.clear(); this.settle.clear(); this.start(); }

  // Everything off (Fritz, 2026-10-21): when another Schema is loaded every output is switched off first, so nothing the old
  // Schema left on (a pump, a burner, an element) keeps running: digital outs and valves closed, PWM and analog outs at 0,
  // duty cycle, hysteresis and PID controls disabled, motors stopped, timers, alarms and sounds stopped. Manual valves are
  // turned by hand, so they are left as they are. Returns how many things were switched off.
  allOff(source = 'schema') {
    let n = 0;
    const set = (el, prop, v) => { if (this.store.getProp(el.name, prop) !== v) { this.store.setProp(el.name, prop, v, source); n++; } };
    for (const el of this.store.list()) {
      switch (el.type) {
        case 'digitalOut': if (!isManualValve(el)) set(el, 'state', false); break;
        case 'switch': case 'pushButton': case 'pulseButton': case 'led': set(el, 'state', false); break;     // Semi_Widgets_Devices
        case 'pwmOut': case 'analogOut': set(el, 'value', 0); break;
        case 'dutyCycle': case 'hysteresis': case 'pid': case 'deadband': set(el, 'enabled', false); break;
        case 'stepper': if (this.store.getProp(el.name, 'moving')) { this.store.setProp(el.name, 'stop', true, source); n++; } break;
        case 'timer': set(el, 'running', false); break;
        case 'alarm': case 'soundPlayer': set(el, 'active', false); break;
      }
    }
    return n;
  }

  list() {
    return [...this.devices.values()].map(d => ({
      name: d.name, connection: d.connection, realConnection: realConnOf(d.cfg) || (d.standIn ? connOf(d.cfg) : undefined), simMode: !!d.standIn, status: d.status, info: d.info, sdCard: !!d.sdCard,
      port: d.cfg.port, host: d.cfg.host, probes: this.probesSeen.get(d.name), paused: !!d.paused, logging: !!d.cfg?.logging,
    }));
  }

  async listPorts() {
    const sp = await loadSerial();
    if (!sp) return { installed: false, ports: [] };
    const ports = await sp.SerialPort.list();
    return { installed: true, ports: ports.map(p => ({ path: p.path, manufacturer: p.manufacturer ?? '', serialNumber: p.serialNumber ?? '' })) };
  }

  _elementsOn(devName) { return this.store.list().filter(e => e.device === devName); }

  // What an output pin should be set to right now, as a protocol line (null = not an output)
  _outLine(el, now = Date.now()) {
    if (isManualValve(el)) return null;            // turned by hand: its pin is left alone
    const get = p => this.store.getProp(el.name, p);
    if (el.pseudoPwm && canPseudoPwm(el)) return `DO ${pinOf(el.channel)} ${!!(get("enabled") && pseudoPwmOn(get("value"), now)) !== !!el.activeLow ? 1 : 0}`;      // Pseudo PWM: a plain pin
    // a Heating Element (Rule 6.19): On/Off drives its pin from .state; a control method from .output, or a PWM pin from its %
    if (isMethodDevice(el)) {
      const m = heatMethodKey(get('method')) ?? 'onoff';
      if (m !== 'onoff') {
        if (el.pwm && PERCENT_METHODS.includes(m)) return `PWM ${pinOf(el.channel)} ${get('state') ? pwmDuty(get('value')) : 0}`;
        return `DO ${pinOf(el.channel)} ${(!!get('output') !== !!el.activeLow) ? 1 : 0}`;
      }
    }
    // a Pump with Speed control PWM (Fritz, 2026-11-08): on runs it at its Speed %, off is 0. On a Port that cannot do true PWM it
    // is a plain On/Off pin (full speed), never a half-made PWM
    if (isPwmPump(el) && canTruePwm(el, this.store.config.devices)) return `PWM ${pinOf(el.channel)} ${get('state') ? pwmDuty(pumpSpeed(get('speed'))) : 0}`;
    switch (el.type) {
      case 'pwmOut': return `PWM ${pinOf(el.channel)} ${get('enabled') ? pwmDuty(get('value')) : 0}`;
      case 'analogOut': return `AO ${pinOf(el.channel)} ${get('enabled') ? analogOutLevel(el, get('value')) : 0}`;
      case 'pid': case 'deadband': if (el.pwm) return `PWM ${pinOf(el.channel)} ${get('enabled') ? pwmDuty(get('value')) : 0}`;
    }
    if (PIN_OUTPUTS.includes(el.type)) return `DO ${pinOf(el.channel)} ${(!!get('state') !== !!el.activeLow) ? 1 : 0}`;
    return null;
  }

  // Settings the device needs to read a sensor (thermocouple type, RTD wiring, input pull-up)
  _cfgLine(el) {
    if (el.type === 'temperature' && el.sensor === 'thermocouple') return `CFG TC ${pinOf(el.channel)} ${String(el.tcType || 'K').toUpperCase()}`;
    if (el.type === 'temperature' && (el.sensor === 'pt100' || el.sensor === 'pt1000')) {
      const bad = rtdPinError(el, this.store.config.devices);      // Skynet Rule 6.9: never set up an RTD on a Mega pin outside the list
      if (bad) { console.error(bad); return null; }
    }
    if (el.type === 'temperature' && (el.sensor === 'pt100' || el.sensor === 'pt1000')) return `CFG RTD ${pinOf(el.channel)} ${el.wires || 3}`;
    if (el.type === 'digitalIn') return `CFG DI ${pinOf(el.channel)} ${el.pullup === false ? 'NOPULL' : 'PULLUP'} ${Math.max(0, Math.round(Number(el.debounce ?? 20)) || 0)}`;
    // the Raspberry Pi program has no fixed pin lists, so it is told which pins count flow meter pulses (a Mega has FLOW_PINS)
    if (el.type === 'flowMeter' && boardOf(this.store.config.devices?.find(d => d.name === el.device)) === 'pi') return `CFG FLOW ${pinOf(el.channel)} S`;
    return null;
  }

  _resendOutputs(dev) {
    dev.send?.(`CFG WD ${lostLinkSec(dev.cfg)} S`);   // lost link delay: no word from the Brain this many seconds -> all outputs OFF
    for (const el of this._elementsOn(dev.name)) {
      if (el.type === 'stepper') {       // set up the motor; never restart a move by itself (only homing, when asked to)
        for (const l of stepperCfgLines(el)) dev.send?.(l);
        if (this.store.getProp(el.name, 'enabled') === false) dev.send?.(enableLine(el, false));
        else if (el.homeOnConnect && el.homePin !== undefined && el.homePin !== '') dev.send?.(homeLine(el));
        continue;
      }
      const c = this._cfgLine(el); if (c) dev.send?.(c);
      if (this._dual(el)) { this._dualSend(el, dev); continue; }      // Dual Throw (Rule 6.22): both its Ports, never both on
      const l = this._outLine(el); if (l) dev.send?.(l);
    }
  }

  _onChange(name, prop, v, source) {
    if (source === 'hw') return;
    const el = this.store.get(name);
    if (el?.type === 'digitalIn') {      // "Leak" reset = true clears a latched or toggled input; the simulator's tap sets raw
      if (prop === 'reset' && v) { if (['latch', 'toggle'].includes(el.mode)) this.store.setProp(name, 'state', false, 'hw'); this.store.setProp(name, 'reset', false, 'hw'); }
      if (prop === 'raw' && (this.devices.get(el.device)?.connection ?? 'simulator') === 'simulator') { if (!this.dinLevel.has(name)) this.dinLevel.set(name, false); this._din(el, !!v, true); }
      return;
    }
    if (el?.type === 'stepper') { this._stepper(el, prop, v); return; }
    if (el?.type === 'scale') {           // "Scale" tare = true, "Scale" volume = 0, "Scale" calibrate = <known weight>
      if ((prop === 'tare' && v) || (prop === 'volume' && v === 0)) this.tare(el);
      if (prop === 'calibrate' && v > 0) this.calibrate(el, v);
      return;
    }
    if (!['state', 'value', 'enabled', 'output', 'method', 'speed'].includes(prop)) return;
    if (!el || !el.device) return;
    if (isMethodDevice(el)) {           // Rule 6.19: whichever of its props drives the pin now
      const m = heatMethodKey(this.store.getProp(name, 'method')) ?? 'onoff', pwmPin = !!el.pwm && PERCENT_METHODS.includes(m);
      const drives = prop === 'method' || (m === 'onoff' ? prop === 'state' : pwmPin ? ['state', 'value'].includes(prop) : prop === 'output');
      if (!drives) return;
    } else if (isPwmPump(el) && canTruePwm(el, this.store.config.devices)) {
      if (prop !== 'state' && prop !== 'speed') return;
    } else {
      if (prop === 'output' || prop === 'method' || prop === 'speed') return;
      const pwm = ['pwmOut', 'analogOut'].includes(el.type) || (['pid', 'deadband'].includes(el.type) && el.pwm);
      if (pwm ? prop === 'state' : prop !== 'state') return;
    }
    const dev = this.devices.get(el.device);
    if (dev && this._dual(el)) { this._dualSend(el, dev); return; }      // Dual Throw (Rule 6.22)
    // a port shared with another output (Fritz, 2026-10-23): turning this one off must not turn off the one now driving the pin
    const winner = !this._isOn(el) && portSharers(el, this.store.list()).find(o => this._isOn(o) && this._outLine(o));
    const l = this._outLine(winner || el);
    if (dev && l) dev.send?.(l);
  }

  // The simulator: is this heater (or pump ...) giving heat right now? A Heating Element run by a control method heats while its
  // pin (.output) is on; anything else while its .state is
  _heatsNow(n) {
    const el = this.store.get(n);
    if (isMethodDevice(el) && this.store.has(el.name) && (heatMethodKey(this.store.getProp(el.name, 'method')) ?? 'onoff') !== 'onoff') return this._isOn(el);
    return !!this.store.getProp(n, 'state');
  }

  // Is this output driving its pin right now?
  _isOn(el) {
    const get = p => { try { return this.store.getProp(el.name, p); } catch { return undefined; } };
    if (['pwmOut', 'analogOut'].includes(el.type) || (['pid', 'deadband'].includes(el.type) && el.pwm)) return !!get('enabled') && Number(get('value')) > 0;
    if (isMethodDevice(el) && (heatMethodKey(get('method')) ?? 'onoff') !== 'onoff') return !!get('state') && (el.pwm && PERCENT_METHODS.includes(heatMethodKey(get('method'))) ? Number(get('value')) > 0 : !!get('output'));
    if (isPwmPump(el) && canTruePwm(el, this.store.config.devices)) return !!get('state') && pumpSpeed(get('speed')) > 0;
    return PIN_OUTPUTS.includes(el.type) && !!get('state');
  }

  _onLine(dev, line) {
    const [cmd, a, b] = line.split(/\s+/);
    const set = (match, prop, val) => {
      for (const el of this.store.list()) if (match(el)) this.store.setProp(el.name, prop, typeof val === 'function' ? val(el) : val, 'hw');
    };
    switch ((cmd || '').toUpperCase()) {
      case 'DI': for (const e of this.store.list()) if (e.type === 'digitalIn' && e.device === dev.name && pinOf(e.channel) === a) this._din(e, (b === '1') !== !!e.activeLow); break;
      case 'DO':        // a Heating Element run by a control method (Rule 6.19): the board's echo is its pin (.output), not its ON
        for (const e of this.store.list()) if (e.type === 'digitalOut' && e.device === dev.name && pinOf(e.channel) === a) {
          const prop = isMethodDevice(e) && (heatMethodKey(this.store.getProp(e.name, 'method')) ?? 'onoff') !== 'onoff' ? 'output' : 'state';
          this.store.setProp(e.name, prop, (b === '1') !== !!e.activeLow, 'hw');
        }
        break;
      case 'A': case 'ADS': {     // board analog pin, or ADS1115 channel
        const ads = cmd.toUpperCase() === 'ADS';
        const on = e => e.device === dev.name && String(analogIndex(e.channel)) === a;
        for (const e of this.store.list()) {
          if (e.type === 'analogIn' && on(e) && (e.adc === 'ads1115') === ads) {
            this.store.setProp(e.name, 'raw', +b, 'hw');
            if (e.calibrations?.length) { this.store.setProp(e.name, 'value', this._analog(e, +b), 'hw'); continue; }   // imported from BruControl
            const r = analogFrom(e, +b);
            this.store.setProp(e.name, 'fault', r.fault, 'hw');
            if (Number.isFinite(r.value)) this.store.setProp(e.name, 'value', r.value, 'hw');
          } else if (e.type === 'temperature' && ANALOG_TEMP.includes(e.sensor) && !ads && on(e)) this._temp(e, 'A', b);
        }
        break;
      }
      case 'RTD': case 'TC':      // PT100/PT1000 (MAX31865) and thermocouple (MAX31855/31856) boards, by chip-select pin
        for (const e of this.store.list()) {
          const want = cmd.toUpperCase() === 'TC' ? e.sensor === 'thermocouple' : (e.sensor === 'pt100' || e.sensor === 'pt1000');
          if (e.type === 'temperature' && want && e.device === dev.name && pinOf(e.channel) === a) this._temp(e, cmd.toUpperCase(), b);
        }
        break;
      case 'W':                   // HX711 load-cell board: raw count, by its DT pin
        for (const e of this.store.list()) {
          if (e.type !== 'scale' || e.device !== dev.name) continue;
          const pins = scalePins(e);
          if (!pins.includes(a)) continue;
          const c = this.cells.get(e.name) ?? {}; c[a] = +b; this.cells.set(e.name, c);
          if (pins.every(p => p in c)) this._scale(e, pins.reduce((t, p) => t + c[p], 0), Date.now());
        }
        break;
      case 'P':                   // pulse flow meter: running pulse count on pin a
        for (const e of this.store.list()) if (e.type === 'flowMeter' && e.device === dev.name && pinOf(e.channel) === a) this._flow(e, +b, Date.now());
        break;
      case 'T': {   // OneWire probe by ROM id - not by bus index, so probes can be swapped or moved
        const rom = (a || '').toUpperCase(), t = parseFloat(b);
        this.probesSeen.get(dev.name)[rom] = t;
        const slot = (this.store.config.probes ?? []).find(p => p.rom === rom && (!p.device || p.device === dev.name));
        for (const e of this.store.list()) {
          if (e.type !== 'temperature' || (e.sensor || 'ds18b20') !== 'ds18b20' || (e.device && e.device !== dev.name)) continue;
          if (e.probeIndex ? slot && Number(e.probeIndex) === slot.index : String(e.probe || '').toUpperCase() === rom) this._temp(e, 'T', t);
        }
        break;
      }
      case 'SP': {                // stepper: SP <step pin> <position in steps> <moving 0|1> <homed 0|1>
        const [, , steps, moving, homed] = line.split(/\s+/);
        for (const e of this.store.list()) {
          if (e.type !== 'stepper' || e.device !== dev.name || pinOf(e.channel) !== a) continue;
          const pos = +fromSteps(e, +steps).toFixed(6), was = this.store.getProp(e.name, 'moving');
          this.store.setProp(e.name, 'steps', +steps, 'hw');
          this.store.setProp(e.name, 'position', pos, 'hw');
          this.store.setProp(e.name, 'homed', homed === '1', 'hw');
          // A report sent before the board got the last command still says "not moving": wait for the next one
          if (moving !== '1' && Date.now() - (this.stepSent.get(e.name) ?? 0) < this.stepQuietMs) continue;
          this.store.setProp(e.name, 'moving', moving === '1', 'hw');
          if (moving !== '1' && (was || toSteps(e, this.store.getProp(e.name, 'target')) !== +steps) && !this.homing.has(e.name)) {   // stopped: the target is where it ended up
            this.store.setProp(e.name, 'target', pos, 'hw'); this.store.setProp(e.name, 'run', 0, 'hw');
          }
        }
        break;
      }
      case 'SH':                  // stepper homing finished: SH <step pin> <1 = found the switch | 0 = gave up>
        for (const e of this.store.list()) {
          if (e.type !== 'stepper' || e.device !== dev.name || pinOf(e.channel) !== a) continue;
          this.homing.delete(e.name);
          this.store.setProp(e.name, 'homed', b === '1', 'hw');
          if (b === '1') this.store.setProp(e.name, 'target', this.store.getProp(e.name, 'position'), 'hw');
          else this.store.emit('warn', `"${e.name}": homing stopped, the home switch was not found (check the switch, its pin and "Home switch is at")`);
        }
        break;
      case 'HELLO': dev.info = line.slice(6); this.store.emit('devices'); break;
      case 'ERR': dev.info = line; this.store.emit('devices'); break;
      case 'SD': {                // Ethernet Mega: 1 = an SD card is in the shield's slot. Not supported (Skynet Rule 6.11)
        const was = dev.sdCard; dev.sdCard = a === '1'; this.store.emit('devices');
        if (dev.sdCard && !was) this.store.emit('sdcard', `${dev.name}: SD Card Not Supported. An SD card is in the Ethernet shield's slot. Remove the SD Card!`);
        break;
      }
    }
  }

  // Stepper: a script or the screen set a property, so tell the board what to do
  _stepper(el, prop, v) {
    const dev = this.devices.get(el.device), send = l => { this.stepSent.set(el.name, Date.now()); dev?.send?.(l); };
    const get = p => this.store.getProp(el.name, p), set = (p, x) => this.store.setProp(el.name, p, x, 'hw');
    const hasHome = el.homePin !== undefined && el.homePin !== '';
    if (['target', 'move', 'run', 'home'].includes(prop) && v && get('enabled') === false) {
      this.store.emit('warn', `"${el.name}" is turned off (enabled = false), so it cannot move`); return;
    }
    switch (prop) {
      case 'target': {               // go to a position (kept inside the lowest / highest allowed)
        const t = clampPosition(el, v);
        if (t !== v) set('target', t);
        this.homing.delete(el.name); set('run', 0);
        send(goLine(el, t, get('speed'))); set('moving', true);     // so "wait ... moving == false" waits for this move
        break;
      }
      case 'move':                   // go this far from where it is heading now
        if (!v) break;
        set('move', 0);
        this.store.setProp(el.name, 'target', clampPosition(el, Number(get('target')) + Number(v)), 'move');
        break;
      case 'speed':                  // a new speed also applies to the move under way
        if (get('moving') && !get('run') && !this.homing.has(el.name)) send(goLine(el, get('target'), v));
        break;
      case 'run': {                  // keep turning at this speed (- = backward); 0 = slow down and stop. Stops at the limits.
        this.homing.delete(el.name);
        const n = Number(v) || 0, lim = n > 0 ? el.maxPos : el.minPos;
        if (n !== 0 && lim !== undefined && lim !== '' && Number.isFinite(Number(lim))) send(goLine(el, Number(lim), Math.abs(n)));
        else send(runLine(el, n));
        if (n !== 0) set('moving', true);
        break;
      }
      case 'stop': if (v) { set('stop', false); set('run', 0); this.homing.delete(el.name); send(stopLine(el)); } break;
      case 'home':
        if (!v) break;
        set('home', false);
        if (!hasHome) { this.store.emit('warn', `"${el.name}": no home switch pin is set, so it cannot home (use reset to call this position home)`); break; }
        this.homing.add(el.name); set('homed', false); send(homeLine(el)); set('moving', true); set('target', Number(el.homePosition) || 0);   // heading home
        break;
      case 'reset': if (v) { set('reset', false); this.homing.delete(el.name); send(zeroLine(el, Number(el.homePosition) || 0)); } break;
      case 'enabled': send(enableLine(el, !!v)); break;
    }
  }

  // Simulator: where a simulated stepper starts and where its home switch is (sim: {start, switchAt} in its units)
  _stepperSim(devName, pin) {
    const el = this.store.list('stepper').find(e => e.device === devName && pinOf(e.channel) === pin);
    if (!el) return {};
    const s = el.sim ?? {}, home = Number(el.homePosition) || 0, dir = el.homeDir === 'plus' ? 1 : -1;
    return { start: toSteps(el, s.start ?? home), switchAt: toSteps(el, s.switchAt ?? home + dir * 5) };
  }

  // calibrated value, smoothed by avgWeight % (100 = no smoothing), rounded to the element's decimals
  _analog(el, raw) {
    let v = calibrate(el, raw);
    if (!Number.isFinite(v)) return this.store.getProp(el.name, 'value');
    v = this._smooth(el, 'value', v);
    return el.precision !== undefined && el.precision !== null ? +v.toFixed(el.precision) : v;
  }

  // Smoothing (Rule 6.24): the reading moves smoothWeight % of the way from the value shown to the new one (100 = none). The first
  // reading after a start is taken as it is.
  _smooth(el, prop, v) {
    const k = el.name + '|' + prop, seen = (this._seen ??= new Set()), old = this.store.getProp(el.name, prop);
    const out = seen.has(k) ? smoothStep(Number(old), v, smoothWeight(el)) : v;
    if (Number.isFinite(v)) seen.add(k);
    return out;
  }

  // more calibrations (Rule 6.24) after a reading's own conversion: a probe after its type's formula and its offsets, a flow meter's rate
  _layers(el, v) { return el.calibrations?.length && Number.isFinite(v) ? applyCalibrations(el.calibrations, v) : v; }

  _temp(el, kind, reading) {
    const t = this._layers(el, temperatureFrom(el, kind, reading)), fault = !Number.isFinite(t);
    this.store.setProp(el.name, 'fault', fault, 'hw');
    if (!fault) { this.store.setProp(el.name, 'raw', t, 'hw'); this.store.setProp(el.name, 'value', this._smooth(el, 'value', t), 'hw'); }
  }

  // Digital input (as BruControl's DIN): raw level -> on / off delays -> mode.
  // mode: switch (follows the input), toggle (each press flips it), latch (on until reset), counter (counts presses),
  //       momentary (shown as "Pulse": one short ON per press; holding it or a bump within the lockout is not another press).
  // A plain push button (ON only while held) uses switch; a toggle stays ON or OFF until pressed again.
  _din(el, raw, alreadySet) {
    if (!alreadySet) this.store.setProp(el.name, 'raw', raw, 'hw');
    clearTimeout(this.dinTimers.get(el.name));
    const delay = Number(raw ? el.onDelay : el.offDelay) || 0;
    if (delay > 0 && this.dinLevel.has(el.name)) this.dinTimers.set(el.name, setTimeout(() => this._dinApply(el, raw), delay * 1000));
    else this._dinApply(el, raw);
  }
  _dinApply(el, level) {
    const first = !this.dinLevel.has(el.name), rising = level && !first && !this.dinLevel.get(el.name);
    this.dinLevel.set(el.name, level);
    if (el.mode === 'momentary') {
      const now = Date.now(), lockout = Number(el.lockout ?? 3000), pulse = Math.max(10, Number(el.pulse ?? 100));
      if (!rising || now - (this.dinPress.get(el.name) ?? -Infinity) < lockout) return;
      this.dinPress.set(el.name, now);
      this.store.setProp(el.name, 'count', this.store.getProp(el.name, 'count') + 1, 'hw');
      this.store.setProp(el.name, 'state', true, 'hw');
      clearTimeout(this.dinPulse.get(el.name));
      this.dinPulse.set(el.name, setTimeout(() => this.store.setProp(el.name, 'state', false, 'hw'), pulse));
      return;
    }
    if (rising) this.store.setProp(el.name, 'count', this.store.getProp(el.name, 'count') + 1, 'hw');
    switch (el.mode) {
      case 'toggle': if (rising) this.store.setProp(el.name, 'state', !this.store.getProp(el.name, 'state'), 'hw'); break;
      case 'latch': if (level) this.store.setProp(el.name, 'state', true, 'hw'); break;
      default: this.store.setProp(el.name, 'state', level, 'hw');
    }
  }

  // Weight and volume from the summed load cells; auto tare when the vessel reads empty and steady
  _scale(el, sum, now) {
    this.store.setProp(el.name, 'raw', sum, 'hw');
    const sg = el.sgFrom && this.store.has(el.sgFrom) ? Number(this.store.getProp(el.sgFrom, 'value')) : Number(el.specificGravity) || 1;
    const { weight, volume } = scaleFrom(el, sum, sg);
    this.store.setProp(el.name, 'value', this._smooth(el, 'value', weight), 'hw');
    this.store.setProp(el.name, 'volume', this._smooth(el, 'volume', volume), 'hw');
    if (el.autoTare === false || !(Number(el.countsPerUnit) > 0)) return;
    const band = Number(el.autoTareBand) || (el.volumeUnits === 'L' ? 0.2 : 0.05);   // "empty" = within this much of 0
    const s = this.settle.get(el.name);
    if (Math.abs(volume) >= band || (s && Math.abs(volume - s.volume) > band / 2)) { this.settle.delete(el.name); if (Math.abs(volume) < band) this.settle.set(el.name, { t: now, volume }); return; }
    if (!s) { this.settle.set(el.name, { t: now, volume }); return; }
    if (now - s.t >= (Number(el.autoTareSeconds) || 10) * 1000 && Math.abs(volume) > band / 20) { this.tare(el); this.settle.delete(el.name); }
  }

  // Zero the scale at its present reading (kept in the config so it survives a restart)
  tare(el) {
    const raw = Number(this.store.getProp(el.name, 'raw'));
    if (!this.cells.has(el.name) && !raw) return;
    el.tareRaw = raw;
    this.store.setProp(el.name, 'value', Number(el.offset) || 0, 'hw');
    this.store.setProp(el.name, 'volume', 0, 'hw');
    this.store.setProp(el.name, 'tare', false, 'hw');
    this.store.writeConfig(); this.store.emit('config');
  }

  calibrate(el, knownWeight) {
    const cpu = scaleCalibration(el, Number(this.store.getProp(el.name, 'raw')), knownWeight);
    this.store.setProp(el.name, 'calibrate', 0, 'hw');
    if (!cpu) return;
    el.countsPerUnit = Math.round(cpu * 1000) / 1000;
    this.store.writeConfig(); this.store.emit('config');
  }

  _flow(el, count, now) {
    const prev = this.pulses.get(el.name), f = flowFrom(el, count, prev, now);
    this.pulses.set(el.name, { count, t: now });
    if (!prev) return;
    const rate = this._layers(el, f.rate);
    this.store.setProp(el.name, 'raw', rate, 'hw');
    this.store.setProp(el.name, 'rate', this._smooth(el, 'rate', rate), 'hw');
    if (f.delta) this.store.setProp(el.name, 'total', this.store.getProp(el.name, 'total') + f.delta, 'hw');
  }

  _simulate() {
    for (const dev of this.devices.values()) {
      if (dev.connection !== 'simulator') continue;
      const amb = dev.cfg.ambient ?? 68;
      for (const el of this._elementsOn(dev.name)) {
        const s = el.sim ?? {};
        const on = n => n && this.store.has(n) && this._heatsNow(n);
        if (el.type === 'analogIn' || el.type === 'flowMeter') { this._simInput(el, s, on); continue; }
        if (el.type === 'scale') { this._simScale(el, s, on); continue; }
        if (el.type === 'hydrometer') { this._simHydro(el); continue; }
        if (el.type !== 'temperature') continue;
        let t = this.store.getProp(el.name, 'value');
        if (!t) t = s.start ?? (dev.standIn ? amb : t);   // a real board in simulation mode starts at room temperature
        const follow = s.follow && this.store.has(s.follow) && [].concat(s.followWhen ?? []).every(on);
        if (on(s.heater)) t = Math.min(t + (s.heatRate ?? 1), s.maxTemp ?? 212);
        else if (follow) t += (Number(this.store.getProp(s.follow, 'value')) - (s.followLoss ?? 2) - t) * (s.followRate ?? 0.08);   // hot liquid pumped in from another vessel
        else if (on(s.cooler)) t -= (s.coolRate ?? 1) * Math.max(0.1, (t - (s.coolTo ?? 55)) / 100);
        else t += ((s.ambient ?? amb) - t) * (s.loss ?? 0.002);          // loss: how fast it cools to the room (an insulated mash tun is slow)
        this.store.setProp(el.name, 'value', Math.round(t * 10) / 10, 'hw');
      }
    }
  }

  // ---- Hydrometers (OakBarn Brewery, 2026-11-09, Rule 6.25, public/hydrometer.js) ----
  // One report from a hydrometer ({ sg, tempF, battery, rssi, angle }, from Wi-Fi, Bluetooth, the cloud or the Simulator): its readings
  // in its own units, the time it was heard and Lost signal off.
  hydroReport(el, rep, now = clock.now(), real = false) {
    if (real) (this.hydroReal ??= new Map()).set(el.name, now);      // a real reading: the Simulator stops pretending for it
    const get = p => this.store.getProp(el.name, p), r = hydroReadings(el, rep, { value: get('value') || '', temperature: get('lost') ? '' : get('temperature') });
    for (const [k, v] of Object.entries(r)) this.store.setProp(el.name, k, v, 'hw');
    this.store.setProp(el.name, 'lastseen', new Date(now).toISOString(), 'hw');
    if (get('lost')) this.store.setProp(el.name, 'lost', false, 'hw');
    return r;
  }
  // Heard, not claimed (OakBarn Brewery, 2026-11-09): a hydrometer that sent a reading no Hydrometer Device has as its Hardware ID yet.
  // The Properties offer these, so nobody has to look an ID up. Kept while the Brain runs, the newest 50.
  hydroHeardAdd(rep, conn, now = Date.now()) {
    if (!this.hydroHeard) this.hydroHeard = new Map();
    for (const id of [rep?.name, rep?.id].filter(Boolean).map(String)) {
      this.hydroHeard.delete(id.toLowerCase());
      this.hydroHeard.set(id.toLowerCase(), { id, other: [rep.name, rep.id].filter(x => x && String(x) !== id).join(''), conn, at: new Date(now).toISOString(), sg: rep.sg });
    }
    while (this.hydroHeard.size > 50) this.hydroHeard.delete(this.hydroHeard.keys().next().value);
  }
  hydroHeardList() {
    const taken = new Set(this.store.list('hydrometer').map(e => String(e.hwId ?? '').trim().toLowerCase()).filter(Boolean));
    return [...(this.hydroHeard?.values() ?? [])].filter(h => !taken.has(h.id.toLowerCase())).reverse();
  }
  // Lost signal: nothing heard for its "Lost signal after" minutes (empty = its Template's)
  hydroLost(now) {
    for (const el of this.store.list()) {
      if (el.type !== 'hydrometer' || this.store.getProp(el.name, 'lost')) continue;
      const seen = Date.parse(this.store.getProp(el.name, 'lastseen') || ''), min = Number(el.lostMinutes) > 0 ? Number(el.lostMinutes) : hydroModel(el).lostMin;
      if (!Number.isFinite(seen) || now - seen > min * 60000) this.store.setProp(el.name, 'lost', true, 'hw');
    }
  }
  // Simulated hydrometer: a pretend fermentation from its Original Gravity down (public/hydrometer.js simReport)
  _simHydro(el) {
    const now = clock.now();
    if (now - (this.hydroReal?.get(el.name) ?? -Infinity) < 10 * 60000) return;      // a real one was heard in the last 10 minutes
    if (!this.hydroStart) this.hydroStart = new Map();
    if (!this.hydroStart.has(el.name)) this.hydroStart.set(el.name, now);
    this.hydroReport(el, simReport(el, (now - this.hydroStart.get(el.name)) / 3600000), now);
  }

  // Simulated scale. sim: {start, fillWhen, drainWhen, rate (weight units per minute), emptyRaw, noise}
  _simScale(el, s, on) {
    const cpu = Number(el.countsPerUnit) || 1000;
    let w = this.simWeight.get(el.name) ?? s.start ?? 0;
    if (on(s.fillWhen)) w += (s.rate ?? 20) / 60;
    if (on(s.drainWhen)) w = Math.max(0, w - (s.rate ?? 20) / 60);
    this.simWeight.set(el.name, w);
    const raw = Math.round((s.emptyRaw ?? 84000) + w * cpu + (s.noise ?? 0) * cpu * (Math.random() - 0.5));
    this.cells.set(el.name, { sim: raw });
    if (el.tareRaw === undefined) el.tareRaw = s.emptyRaw ?? 84000;
    this._scale(el, raw, Date.now());
  }

  // Simulated analog inputs and flow meters. sim: {value, onValue, when, noise} or for flow meters {rate, when}
  _simInput(el, s, on) {
    const active = s.when ? on(s.when) : true;
    if (el.type === 'flowMeter') {
      const rate = active ? (s.rate ?? 2) : 0;
      this.store.setProp(el.name, 'rate', rate, 'hw');
      if (rate) this.store.setProp(el.name, 'total', this.store.getProp(el.name, 'total') + rate / 60, 'hw');
      return;
    }
    const target = active && s.onValue !== undefined && s.when ? s.onValue : s.value;
    if (target === undefined) return;
    const v = Number(this.store.getProp(el.name, 'value')) || 0;
    const nv = v + (target - v) * 0.2 + (s.noise ?? 0) * (Math.random() - 0.5);
    this.store.setProp(el.name, 'value', Math.round(nv * 100) / 100, 'hw');
  }
}

const clamp255 = v => Math.max(0, Math.min(255, Math.round(Number(v) || 0)));

const scalePins = el => String(el.channel ?? '').split(/[\s,]+/).filter(Boolean).map(pinOf);
