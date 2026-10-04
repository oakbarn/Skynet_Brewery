// Stepper motors (Devices on a board's pins): unit conversions, protocol lines, and a simulated board.
// The board runs the motor itself (step timing, acceleration, home switch); the panel sends where to go.
// Protocol: docs/DEVICE_PROTOCOL.md, "Stepper motors".
import { pinOf } from './sensors.js';

// Driver boards Fritz can pick (the list can be added to on screen). Picking one fills in these settings.
export const STEPPER_DRIVERS = {
  'A4988': { wiring: 'stepDir', pulseUs: 1, enableLevel: 'low', microsteps: 16 },
  'DRV8825': { wiring: 'stepDir', pulseUs: 2, enableLevel: 'low', microsteps: 32 },
  'TMC2208': { wiring: 'stepDir', pulseUs: 1, enableLevel: 'low', microsteps: 8 },
  'TMC2209': { wiring: 'stepDir', pulseUs: 1, enableLevel: 'low', microsteps: 8 },
  'TB6600': { wiring: 'stepDir', pulseUs: 5, enableLevel: 'low', microsteps: 8 },
  'DM542': { wiring: 'stepDir', pulseUs: 3, enableLevel: 'low', microsteps: 8 },
  'ULN2003 + 28BYJ-48': { wiring: 'fourWire', microsteps: 2, stepsPerRev: 2048 },
  'L298N': { wiring: 'fourWire', microsteps: 1, stepsPerRev: 200 },
};

const num = (v, d) => { const n = Number(v); return v === '' || v === null || v === undefined || !Number.isFinite(n) ? d : n; };
export const isFourWire = el => (el.wiring ?? STEPPER_DRIVERS[el.driver]?.wiring) === 'fourWire';

// Motor steps for one unit of position: full steps per turn x microsteps x gear ratio / units per output turn
export function stepsPerUnit(el) {
  if (el.units === 'steps') return 1;
  const perRev = num(el.unitsPerRev, el.units === 'deg' ? 360 : el.units === '%' ? 100 : 1);
  const spu = num(el.stepsPerRev, 200) * num(el.microsteps, 1) * num(el.gearRatio, 1) / (perRev || 1);
  return spu > 0 ? spu : 1;
}
export const toSteps = (el, units) => Math.round(Number(units) * stepsPerUnit(el));
export const fromSteps = (el, steps) => Number(steps) / stepsPerUnit(el);

// Keep a target inside the soft limits (minPos / maxPos, empty = no limit)
export function clampPosition(el, v) {
  const lo = num(el.minPos, -Infinity), hi = num(el.maxPos, Infinity);
  return Math.min(hi, Math.max(lo, Number(v) || 0));
}

const speedSteps = (el, unitsPerSec) => Math.max(1, Math.round(Math.abs(num(unitsPerSec, 1)) * stepsPerUnit(el)));
export const topSpeed = el => num(el.maxSpeed, 1);
export const homeSpeed = el => num(el.homeSpeed, topSpeed(el) / 4);

// Lines that set up the stepper on the board (sent after every connect). The STEP pin (or IN1) names the motor.
export function stepperCfgLines(el) {
  const fw = isFourWire(el), drv = STEPPER_DRIVERS[el.driver] ?? {};
  const flags = (el.invertDir ? 1 : 0) | ((el.enableLevel ?? drv.enableLevel) === 'high' ? 2 : 0) | (el.holdWhenIdle === false ? 0 : 4) | (fw && num(el.microsteps, 1) >= 2 ? 8 : 0)
    | (fw && /ULN2003|28BYJ/i.test(el.driver ?? '') ? 16 : 0);       // a 28BYJ-48 on a ULN2003 board steps its coils IN1, IN3, IN2, IN4
  const maxS = speedSteps(el, topSpeed(el)), acc = speedSteps(el, num(el.accel, topSpeed(el) * 2));
  const pin = p => (p === undefined || p === null || p === '') ? '-1' : pinOf(p);
  const lines = [fw
    ? `CFG STEP4 ${pin(el.channel)} ${pin(el.pin2)} ${pin(el.pin3)} ${pin(el.pin4)} ${flags} ${maxS} ${acc}`
    : `CFG STEP ${pin(el.channel)} ${pin(el.dirPin)} ${pin(el.enablePin)} ${flags} ${maxS} ${acc} ${Math.max(1, Math.round(num(el.pulseUs, drv.pulseUs ?? 2)))}`];
  if (el.homePin !== undefined && el.homePin !== '') lines.push(`CFG HOME ${pin(el.channel)} ${pin(el.homePin)} ${(el.homeSwitch === 'nc' ? 1 : 0) | (el.homeDir === 'plus' ? 2 : 0)}`);
  return lines;
}

// How far homing may travel before it gives up: homeTravel, or twice the soft-limit range, or 10 output turns
export function homeTravelSteps(el) {
  const t = num(el.homeTravel, NaN);
  if (t > 0) return toSteps(el, t);
  const lo = num(el.minPos, NaN), hi = num(el.maxPos, NaN);
  if (Number.isFinite(lo) && Number.isFinite(hi) && hi > lo) return toSteps(el, 2 * (hi - lo));
  return Math.round(num(el.stepsPerRev, 200) * num(el.microsteps, 1) * num(el.gearRatio, 1) * 10);
}

// Motion commands (positions and speeds in the element's units; the board gets steps and steps per second)
export const goLine = (el, target, speed) => `GO ${pinOf(el.channel)} ${toSteps(el, target)} ${speedSteps(el, speed ?? topSpeed(el))}`;
export const runLine = (el, speed) => `RUN ${pinOf(el.channel)} ${Math.sign(Number(speed) || 0) * (Number(speed) ? speedSteps(el, speed) : 0)}`;
export const stopLine = el => `STOP ${pinOf(el.channel)}`;
export const zeroLine = (el, pos) => `ZERO ${pinOf(el.channel)} ${toSteps(el, pos)}`;
export const enableLine = (el, on) => `EN ${pinOf(el.channel)} ${on ? 1 : 0}`;
export function homeLine(el) {
  const v = speedSteps(el, homeSpeed(el)) * (el.homeDir === 'plus' ? 1 : -1);
  return `HOME ${pinOf(el.channel)} ${v} ${homeTravelSteps(el)} ${toSteps(el, num(el.homePosition, 0))}`;
}

// ---- simulated board: answers the same lines a real board would, so the panel works without hardware ----
// switchFor(stepPin) -> {start, switchAt} in steps (where the motor starts and where its home switch is)
export class StepperSim {
  constructor(emit, switchFor = () => ({})) { this.emit = emit; this.switchFor = switchFor; this.m = new Map(); }

  line(text) {
    const [cmd, ...a] = text.trim().split(/\s+/);
    const op = cmd === 'CFG' ? 'CFG ' + a.shift() : cmd;
    const m = this.m.get(a[0]);
    switch (op) {
      case 'CFG STEP': case 'CFG STEP4': {
        const four = op === 'CFG STEP4', flags = +a[four ? 4 : 3];
        const s = this.switchFor(a[0]);
        const old = this.m.get(a[0]);
        this.m.set(a[0], { pos: old?.pos ?? s.start ?? 0, v: 0, target: old?.pos ?? s.start ?? 0, mode: 'idle', homed: old?.homed ?? false, on: old?.on ?? true,
          max: +a[four ? 5 : 4], accel: +a[four ? 6 : 5], hold: !!(flags & 4), switchAt: s.switchAt, homeDir: old?.homeDir ?? -1 });
        this._report(a[0]);
        return true;
      }
      case 'CFG HOME': if (m) { m.homeDir = (+a[2] & 2) ? 1 : -1; m.hasSwitch = true; } return true;
      case 'GO': if (!this._ok(m, a[0])) return true; m.mode = 'go'; m.target = +a[1]; m.speed = +a[2] || m.max; return true;
      case 'RUN': if (!this._ok(m, a[0])) return true; if (+a[1] === 0) { m.mode = 'stop'; return true; } m.mode = 'run'; m.speed = Math.abs(+a[1]); m.dir = Math.sign(+a[1]); return true;
      case 'STOP': if (m && m.mode !== 'idle') m.mode = 'stop'; return true;
      case 'ZERO': if (m) { m.pos = m.target = +a[1]; m.v = 0; m.mode = 'idle'; m.homed = true; this._report(a[0]); } return true;
      case 'EN': if (m) { m.on = a[1] === '1'; if (!m.on) { m.v = 0; m.mode = 'idle'; this._report(a[0]); } } return true;
      case 'HOME': {
        if (!this._ok(m, a[0])) return true;
        if (!m.hasSwitch) { this.emit(`ERR stepper ${a[0]}: no home switch set`); this.emit(`SH ${a[0]} 0`); return true; }
        Object.assign(m, { mode: 'home', speed: Math.abs(+a[1]), dir: Math.sign(+a[1]) || -1, travel: 0, maxTravel: +a[2], homePos: +a[3], homed: false });
        return true;
      }
    }
    return false;
  }

  _ok(m, pin) {
    if (!m) { this.emit(`ERR stepper ${pin} not set up (no CFG STEP)`); return false; }
    if (!m.on) { this.emit(`ERR stepper ${pin} is turned off`); return false; }
    return true;
  }

  // Move every motor on by dt seconds (trapezoid speed: speed up, cruise, slow down to stop on the target)
  tick(dt) {
    for (const [pin, m] of this.m) {
      if (m.mode === 'idle') { if ((m.quiet = (m.quiet ?? 0) + dt) >= 1) { m.quiet = 0; this._report(pin); } continue; }   // like a board: a report every second
      const before = m.pos;
      let want;                                    // the speed (signed steps/s) the motor heads for
      if (m.mode === 'go') {
        const dist = m.target - m.pos, stopDist = m.v * m.v / (2 * m.accel || 1);
        want = Math.abs(dist) <= stopDist + 0.5 && Math.sign(m.v) === Math.sign(dist) ? 0 : Math.sign(dist) * Math.min(m.speed, m.max);
        if (dist === 0 || (Math.abs(dist) < 1 && Math.abs(m.v) < m.accel * dt)) { m.pos = m.target; m.v = 0; m.mode = 'idle'; this._report(pin); continue; }
      } else if (m.mode === 'run' || m.mode === 'home') want = m.dir * Math.min(m.speed, m.max);
      else want = 0;                              // stop: slow down
      const dv = m.accel * dt;
      m.v = Math.abs(want - m.v) <= dv ? want : m.v + Math.sign(want - m.v) * dv;
      m.pos += m.v * dt;
      if (m.mode === 'go' && Math.sign(m.target - before) !== Math.sign(m.target - m.pos)) m.pos = m.target;   // never overshoot
      m.pos = Math.round(m.pos * 1000) / 1000;
      if (m.mode === 'home') {
        m.travel += Math.abs(m.pos - before);
        const at = m.switchAt ?? Infinity * m.dir;
        if ((m.dir < 0 && m.pos <= at) || (m.dir > 0 && m.pos >= at)) { m.pos = m.target = m.homePos; m.v = 0; m.mode = 'idle'; m.homed = true; this.emit(`SH ${pin} 1`); }
        else if (m.travel >= m.maxTravel) { m.v = 0; m.mode = 'idle'; m.target = m.pos; this.emit(`ERR stepper ${pin}: home switch not found`); this.emit(`SH ${pin} 0`); }
      }
      if ((m.mode === 'stop') && m.v === 0) { m.mode = 'idle'; m.target = m.pos; }
      this._report(pin);
    }
  }

  _report(pin) { const m = this.m.get(pin); this.emit(`SP ${pin} ${Math.round(m.pos)} ${m.mode === 'idle' ? 0 : 1} ${m.homed ? 1 : 0}`); }
  stopAll() { for (const [pin, m] of this.m) if (m.mode !== 'idle') { m.v = 0; m.mode = 'idle'; m.target = m.pos; this._report(pin); } }
}
