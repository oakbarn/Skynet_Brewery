// Hardware devices: a board over USB ("serial"), a board on wired Ethernet ("ethernet"), ESP32 over WiFi ("esp32"), or "simulator".
// Mega and ESP32 speak the same line protocol (docs/DEVICE_PROTOCOL.md).
import net from 'node:net';
import { EventEmitter } from 'node:events';
import { analogFrom, analogOutLevel, flowFrom, pwmDuty, scaleCalibration, scaleFrom, temperatureFrom } from './sensors.js';

const sleep = ms => new Promise(r => setTimeout(r, ms));

class LineDevice extends EventEmitter {
  constructor(cfg) {
    super();
    this.cfg = cfg; this.name = cfg.name; this.type = cfg.type;
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
  }
  _ended() { this.conn = null; this._onClose?.(); }
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

class SimDevice extends EventEmitter {        // no hardware: outputs echo, temperatures move with heaters/coolers
  constructor(cfg) { super(); this.cfg = cfg; this.name = cfg.name; this.type = 'simulator'; this.status = 'connected'; this.info = 'simulator'; }
  open() { this.emit('connected'); }
  send() { }
  close() { }
}

export class Hardware {
  constructor(store) {
    this.store = store; this.devices = new Map(); this.probesSeen = new Map(); // device -> {rom: temp}
    this.pulses = new Map();   // flow meter name -> last {count, t}
    this.cells = new Map();    // scale name -> {DT pin: raw} for each of its load-cell boards
    this.settle = new Map();   // scale name -> {t, volume} while it reads empty (for auto tare)
    this.simWeight = new Map();
    store.on('change', (name, prop, v, source) => this._onChange(name, prop, v, source));
  }

  start() {
    for (const d of this.store.config.devices ?? []) this.add(d);
    this.simTimer = setInterval(() => this._simulate(), 1000);
    this.pingTimer = setInterval(() => { for (const d of this.devices.values()) if (d.status === 'connected') d.send?.('PING'); }, 2000);
  }

  add(cfg) {
    const D = { serial: SerialDevice, esp32: TcpDevice, ethernet: TcpDevice, simulator: SimDevice }[cfg.type];
    if (!D) { console.error(`Device "${cfg.name}": unknown type "${cfg.type}"`); return; }
    const dev = new D(cfg);
    this.devices.set(cfg.name, dev);
    this.probesSeen.set(cfg.name, {});
    dev.on('line', l => this._onLine(dev, l));
    dev.on('connected', () => this._resendOutputs(dev));
    dev.on('status', () => this.store.emit('devices'));
    dev.open();
  }

  stop() { clearInterval(this.simTimer); clearInterval(this.pingTimer); for (const d of this.devices.values()) d.close(); this.devices.clear(); }
  restart() { this.stop(); this.pulses.clear(); this.cells.clear(); this.settle.clear(); this.start(); }

  list() {
    return [...this.devices.values()].map(d => ({
      name: d.name, type: d.type, status: d.status, info: d.info,
      port: d.cfg.port, host: d.cfg.host, probes: this.probesSeen.get(d.name),
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
  _outLine(el) {
    const get = p => this.store.getProp(el.name, p);
    switch (el.type) {
      case 'digitalOut': return `DO ${el.channel} ${(!!get('state') !== !!el.activeLow) ? 1 : 0}`;
      case 'pwmOut': return `PWM ${el.channel} ${get('enabled') ? pwmDuty(get('value')) : 0}`;
      case 'analogOut': return `AO ${el.channel} ${get('enabled') ? analogOutLevel(el, get('value')) : 0}`;
      default: return null;
    }
  }

  // Settings the device needs to read a sensor (thermocouple type, RTD wiring, input pull-up)
  _cfgLine(el) {
    if (el.type === 'temperature' && el.sensor === 'thermocouple') return `CFG TC ${el.channel} ${String(el.tcType || 'K').toUpperCase()}`;
    if (el.type === 'temperature' && (el.sensor === 'pt100' || el.sensor === 'pt1000')) return `CFG RTD ${el.channel} ${el.wires || 3}`;
    if (el.type === 'digitalIn') return `CFG DI ${el.channel} ${el.pullup === false ? 'NOPULL' : 'PULLUP'}`;
    return null;
  }

  _resendOutputs(dev) {
    for (const el of this._elementsOn(dev.name)) {
      const c = this._cfgLine(el); if (c) dev.send?.(c);
      const l = this._outLine(el); if (l) dev.send?.(l);
    }
  }

  _onChange(name, prop, v, source) {
    if (source === 'hw') return;
    const el = this.store.get(name);
    if (el?.type === 'scale') {           // "Scale" tare = true, "Scale" volume = 0, "Scale" calibrate = <known weight>
      if ((prop === 'tare' && v) || (prop === 'volume' && v === 0)) this.tare(el);
      if (prop === 'calibrate' && v > 0) this.calibrate(el, v);
      return;
    }
    if (!['state', 'value', 'enabled'].includes(prop)) return;
    if (!el || !el.device) return;
    if (el.type === 'digitalOut' ? prop !== 'state' : prop === 'state') return;
    const dev = this.devices.get(el.device), l = this._outLine(el);
    if (dev && l) dev.send?.(l);
  }

  _onLine(dev, line) {
    const [cmd, a, b] = line.split(/\s+/);
    const set = (match, prop, val) => {
      for (const el of this.store.list()) if (match(el)) this.store.setProp(el.name, prop, typeof val === 'function' ? val(el) : val, 'hw');
    };
    switch ((cmd || '').toUpperCase()) {
      case 'DI': set(e => e.type === 'digitalIn' && e.device === dev.name && String(e.channel) === a, 'state', e => (b === '1') !== !!e.activeLow); break;
      case 'DO': set(e => e.type === 'digitalOut' && e.device === dev.name && String(e.channel) === a, 'state', e => (b === '1') !== !!e.activeLow); break;
      case 'A': case 'ADS': {     // board analog pin, or ADS1115 channel
        const ads = cmd.toUpperCase() === 'ADS';
        const on = e => e.device === dev.name && String(e.channel) === a;
        for (const e of this.store.list()) {
          if (e.type === 'analogIn' && on(e) && (e.adc === 'ads1115') === ads) {
            const r = analogFrom(e, +b);
            this.store.setProp(e.name, 'raw', +b, 'hw'); this.store.setProp(e.name, 'fault', r.fault, 'hw');
            if (Number.isFinite(r.value)) this.store.setProp(e.name, 'value', r.value, 'hw');
          } else if (e.type === 'temperature' && e.sensor === 'ntc' && !ads && on(e)) this._temp(e, 'A', b);
        }
        break;
      }
      case 'RTD': case 'TC':      // PT100/PT1000 (MAX31865) and thermocouple (MAX31855/31856) boards, by chip-select pin
        for (const e of this.store.list()) {
          const want = cmd.toUpperCase() === 'TC' ? e.sensor === 'thermocouple' : (e.sensor === 'pt100' || e.sensor === 'pt1000');
          if (e.type === 'temperature' && want && e.device === dev.name && String(e.channel) === a) this._temp(e, cmd.toUpperCase(), b);
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
        for (const e of this.store.list()) if (e.type === 'flowMeter' && e.device === dev.name && String(e.channel) === a) this._flow(e, +b, Date.now());
        break;
      case 'T': {   // OneWire probe by ROM id - not by bus index, so probes can be swapped or moved
        const rom = (a || '').toUpperCase(), t = parseFloat(b);
        this.probesSeen.get(dev.name)[rom] = t;
        for (const e of this.store.list()) {
          if (e.type === 'temperature' && (e.sensor || 'ds18b20') === 'ds18b20' && String(e.probe || '').toUpperCase() === rom && (!e.device || e.device === dev.name)) this._temp(e, 'T', t);
        }
        break;
      }
      case 'HELLO': dev.info = line.slice(6); this.store.emit('devices'); break;
      case 'ERR': dev.info = line; this.store.emit('devices'); break;
    }
  }

  _temp(el, kind, reading) {
    const t = temperatureFrom(el, kind, reading), fault = !Number.isFinite(t);
    this.store.setProp(el.name, 'fault', fault, 'hw');
    if (!fault) this.store.setProp(el.name, 'value', t, 'hw');
  }

  // Weight and volume from the summed load cells; auto tare when the vessel reads empty and steady
  _scale(el, sum, now) {
    this.store.setProp(el.name, 'raw', sum, 'hw');
    const sg = el.sgFrom && this.store.has(el.sgFrom) ? Number(this.store.getProp(el.sgFrom, 'value')) : Number(el.specificGravity) || 1;
    const { weight, volume } = scaleFrom(el, sum, sg);
    this.store.setProp(el.name, 'value', weight, 'hw');
    this.store.setProp(el.name, 'volume', volume, 'hw');
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
    this.store.setProp(el.name, 'rate', f.rate, 'hw');
    if (f.delta) this.store.setProp(el.name, 'total', this.store.getProp(el.name, 'total') + f.delta, 'hw');
  }

  _simulate() {
    for (const dev of this.devices.values()) {
      if (dev.type !== 'simulator') continue;
      const amb = dev.cfg.ambient ?? 68;
      for (const el of this._elementsOn(dev.name)) {
        const s = el.sim ?? {};
        const on = n => n && this.store.has(n) && !!this.store.getProp(n, 'state');
        if (el.type === 'analogIn' || el.type === 'flowMeter') { this._simInput(el, s, on); continue; }
        if (el.type === 'scale') { this._simScale(el, s, on); continue; }
        if (el.type !== 'temperature') continue;
        let t = this.store.getProp(el.name, 'value');
        if (!t && s.start !== undefined) t = s.start;
        if (on(s.heater)) t += s.heatRate ?? 1;
        else if (on(s.cooler)) t -= (s.coolRate ?? 1) * Math.max(0.1, (t - (s.coolTo ?? 55)) / 100);
        else t += ((s.ambient ?? amb) - t) * 0.002;
        this.store.setProp(el.name, 'value', Math.round(t * 10) / 10, 'hw');
      }
    }
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

const scalePins = el => String(el.channel ?? '').split(/[\s,]+/).filter(Boolean);
