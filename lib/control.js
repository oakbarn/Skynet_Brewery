// Software control elements (as in BruControl): duty cycle, hysteresis, PID and deadband outputs, one-shot outputs,
// and the calibration chain for analog inputs.
import { clock } from './simclock.js';
import { isHeatElem, isMethodDevice, heatMethodKey } from '../public/heatmethod.js';

// raw reading -> engineering value. Each calibration runs in order on the result of the one before.
export function calibrate(el, raw) {
  const cals = el.calibrations;
  if (!cals?.length) return raw * (el.scale ?? 1) + (el.offset ?? 0);
  let x = raw;
  for (const c of cals) {
    if (c.enabled === false) continue;
    switch (c.type) {
      case 'steinhartHart': {               // thermistor to ground, series resistor to Vcc, 10-bit ADC
        if (x <= 0 || x >= 1023) return NaN;
        const r = (c.resistor ?? 10000) * x / (1023 - x), ln = Math.log(r);
        x = 1 / ((c.a ?? 0) + (c.b ?? 0) * ln + (c.c ?? 0) * ln ** 3);   // Kelvin
        break;
      }
      case 'kelvinToFahrenheit': x = (x - 273.15) * 9 / 5 + 32; break;
      case 'kelvinToCelsius': x = x - 273.15; break;
      case 'celsiusToFahrenheit': x = x * 9 / 5 + 32; break;
      case 'fahrenheitToCelsius': x = (x - 32) * 5 / 9; break;
      case 'multiplier': x *= c.multiplier ?? 1; break;
      case 'offset': x += c.offset ?? 0; break;
      case 'floor': x = Math.max(x, c.floor ?? c.value ?? -Infinity); break;
      case 'ceiling': x = Math.min(x, c.ceiling ?? c.value ?? Infinity); break;
      case 'lookupTable': x = lookup(c.rows ?? [], x); break;
      default: break;                       // stored, not applied
    }
  }
  return x;
}

function lookup(rows, x) {
  const r = [...rows].sort((a, b) => a[0] - b[0]);
  if (!r.length) return x;
  if (x <= r[0][0]) return r[0][1];
  for (let i = 1; i < r.length; i++) {
    if (x <= r[i][0]) { const [x0, y0] = r[i - 1], [x1, y1] = r[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0 || 1); }
  }
  return r[r.length - 1][1];
}

export class Control {
  constructor(store) {
    this.store = store;
    this.pid = new Map();          // name -> {integral, lastPv, lastCalc}
    this.hys = new Map();          // name -> time the "turn on" condition started
    this.pred = new Map();         // Predictive Hysteresis (Rule 6.23): name -> { coast, watching, offE, peak }
    this.dband = new Map();        // name -> {lastCalc}
    this.prec = new Map();         // name -> Precise: {pv (smoothed), lastPv, lastRaw, integral, lastCalc, lastTick, win, onMs, carry}
    this.shots = new Map();        // one-shot timers
    store.on('change', (name, prop, v, source) => this._onChange(name, prop, v, source));
  }

  start() { this.timer = setInterval(() => this.tick(clock.now()), 100); }   // clock: faster in simulation mode
  stop() { clearInterval(this.timer); for (const t of this.shots.values()) clearTimeout(t); this.shots.clear(); }

  _get(name, prop) { try { return this.store.getProp(name, prop); } catch { return undefined; } }
  _set(name, prop, v) { this.store.setProp(name, prop, v, 'control'); }

  // One-shot: the output turns itself back after oneShot ms (oneShotDirection false = an ON pulse)
  _onChange(name, prop, v, source) {
    if (prop === 'method') { this.pid.delete(name); this.hys.delete(name); this.pred.delete(name); this.dband.delete(name); this.prec.delete(name); return; }    // a new heating method starts afresh
    if (prop !== 'state' || source === 'control') return;
    const el = this.store.get(name);
    if (el?.type !== 'digitalOut' || !(el.oneShot > 0)) return;
    clearTimeout(this.shots.get(name));
    const rest = !!el.oneShotDirection;
    if (!!v === rest) return;
    this.shots.set(name, setTimeout(() => { this.shots.delete(name); this._set(name, 'state', rest); }, el.oneShot));
  }

  tick(now) {
    for (const el of this.store.list()) {
      switch (el.type) {
        case 'dutyCycle': this._duty(el, now); break;
        case 'hysteresis': this._hysteresis(el, now); break;
        case 'pid': this._pid(el, now); break;
        case 'deadband': this._deadband(el, now); break;
        case 'digitalOut': if (isMethodDevice(el)) this._heat(el, now); break;
      }
    }
  }

  // One Heating Element, the heating method picked (Rule 6.19): its .method runs here and switches its pin (.output).
  // On/Off needs nothing: its .state is the pin.
  _heat(el, now) {
    switch (heatMethodKey(this._get(el.name, 'method'))) {
      case 'dutyCycle': this._duty(el, now, 'output'); break;
      case 'hysteresis': this._hysteresis(el, now, 'output'); break;
      case 'pid': this._pid(el, now, 'output'); break;
      case 'deadband': this._deadband(el, now, 'output'); break;
      case 'precise': this._precise(el, now, 'output'); break;
    }
  }

  _duty(el, now, out = 'state') {
    const on = this._get(el.name, 'enabled') && (() => {
      const iv = Math.max(100, this._get(el.name, 'interval') || 1000), dc = this._get(el.name, 'dutycycle') || 0;
      return (now % iv) < iv * dc / 100;
    })();
    if (this._get(el.name, out) !== on) this._set(el.name, out, on);
  }

  // Positive ON offset (heating): on at target - offset, off at target.
  // Negative ON offset (cooling): on at target + |offset|, off at target.
  // Predictive Hysteresis (OakBarn Brewery, 2026-11-09, Rule 6.23: "smoothing the overshoot ... all the Hysteresis Predictive unless that
  // could hurt a compressor"): after the output turns off, the heat (or cold) already on its way keeps the reading going past where it
  // turned off. Skynet watches how far it coasts each time and next time turns off that much before the Target, so it settles at the
  // Target instead of overshooting. The ON point moves by the same amount, so the swing between ON and OFF (and how often it starts)
  // stays the same: a compressor or a pump is never started more often, and its On delay still holds. The early OFF is at most half
  // the On offset.
  // On for every Hysteresis unless its Predictive switch is off (.predictive = false).
  _coast(el, e, on, was) {
    if (el.predictive === false) { this.pred.delete(el.name); return 0; }
    const st = this.pred.get(el.name) ?? { coast: 0, watching: false, offE: 0, peak: 0 };
    this.pred.set(el.name, st);
    if (was && !on) { st.watching = true; st.offE = e; st.peak = e; }        // just turned off: watch how far it coasts
    else if (st.watching) {
      if (on) st.watching = false;                                            // on again before it turned back: keep what was learned
      else if (e > st.peak) st.peak = e;
      else if (st.peak - e >= Math.max(0.1, Math.abs(Number(this._get(el.name, 'onoffset')) || 0) * 0.1)) {     // it turned back: learned
        const c = Math.max(0, st.peak - st.offE);
        st.coast = st.coast ? (st.coast + c) / 2 : c; st.watching = false;
      }
    }
    return st.coast;
  }

  _hysteresis(el, now, out = 'state') {
    let on = false;
    const pv = Number(this._get(el.input, 'value'));
    if (this._get(el.name, 'enabled') && el.input && Number.isFinite(pv)) {
      const sp = this._get(el.name, 'target'), off = this._get(el.name, 'onoffset'), was = this._get(el.name, out);
      const heat = off >= 0, e = heat ? pv - sp : sp - pv;            // how far past the Target, in the direction it drives
      const early = Math.min(this.pred.get(el.name)?.coast ?? 0, Math.abs(off) / 2) * (el.predictive === false ? 0 : 1);
      // both points move down together by the same amount, so the swing (and how often it switches) stays the same
      const wantOn = e <= -Math.abs(off) - early;
      const wantOff = e >= -early;
      if (was) on = !wantOff;
      else if (wantOn) {
        if (!this.hys.has(el.name)) this.hys.set(el.name, now);
        on = now - this.hys.get(el.name) >= (this._get(el.name, 'ondelay') || 0) * 1000;
      }
      if (!wantOn) this.hys.delete(el.name);
    } else this.hys.delete(el.name);
    if (on) this.hys.delete(el.name);
    if (Number.isFinite(pv) && el.input) { const sp = this._get(el.name, 'target'), heat = this._get(el.name, 'onoffset') >= 0; this._coast(el, heat ? pv - sp : sp - pv, on, !!this._get(el.name, out)); }
    else this.pred.delete(el.name);
    if (this._get(el.name, out) !== on) this._set(el.name, out, on);
  }

  _pid(el, now, out = 'state') {
    const g = k => Number(this._get(el.name, k)) || 0;
    const pv = Number(this._get(el.input, 'value'));
    let st = this.pid.get(el.name);
    if (!this._get(el.name, 'enabled') || !el.input || !Number.isFinite(pv)) {
      this.pid.delete(el.name);
      if (this._get(el.name, 'value') !== 0) this._set(el.name, 'value', 0);
      if (this._get(el.name, out)) this._set(el.name, out, false);
      return;
    }
    if (!st) { st = { integral: 0, lastPv: pv, lastCalc: 0 }; this.pid.set(el.name, st); }
    const calcMs = Math.max(100, g('calctime') * 1000);
    if (now - st.lastCalc >= calcMs) {
      const dt = st.lastCalc ? (now - st.lastCalc) / 1000 : calcMs / 1000;
      const err = el.reversed ? pv - g('target') : g('target') - pv;
      const maxI = g('maxintegral') || 100, maxO = g('maxoutput') || 100;
      st.integral = Math.max(-maxI, Math.min(maxI, st.integral + g('ki') * err * dt));
      const d = (el.reversed ? 1 : -1) * (pv - st.lastPv) / dt;
      const out = Math.max(0, Math.min(maxO, g('kp') * err + st.integral + g('kd') * d));
      st.lastPv = pv; st.lastCalc = now;
      this._set(el.name, 'value', Math.round(out * 10) / 10);
    }
    this._timeProportion(el, now, out);
  }

  // A PID or Deadband with no PWM pin: on for its output % of every Out Time window (a Duty Cycle Output)
  _timeProportion(el, now, out = 'state') {
    if (el.pwm) return;
    const win = Math.max(100, (Number(this._get(el.name, 'outtime')) || 0) * 1000);
    const on = (now % win) < win * (Number(this._get(el.name, 'value')) || 0) / 100;
    if (this._get(el.name, out) !== on) this._set(el.name, out, on);
  }

  // Deadband Output (as in BruControl, Fritz 2026-11-05, Rule 6.17). Every Calc Time the output % steps toward the Target:
  // inside the Deadband (Target ± Deadband Offset) it is left alone; inside the Inner Band (Target ± Inner Band Offset) it
  // moves by the Inner Band Drive; further out by the Outer Band Drive. Below the Target it goes up (heating), above it goes
  // down; Reversed (cooling) turns that round. It starts at the Initial Output when Enabled.
  _deadband(el, now, out = 'state') {
    const g = k => Number(this._get(el.name, k)) || 0;
    const pv = Number(this._get(el.input, 'value'));
    let st = this.dband.get(el.name);
    if (!this._get(el.name, 'enabled') || !el.input || !Number.isFinite(pv)) {
      if (!this._get(el.name, 'enabled')) this.dband.delete(el.name);
      if (this._get(el.name, 'value') !== 0) this._set(el.name, 'value', 0);
      if (this._get(el.name, out)) this._set(el.name, out, false);
      return;
    }
    const maxO = Math.min(100, g('maxoutput') || 100), clamp = x => Math.round(Math.max(0, Math.min(maxO, x)) * 10) / 10;
    if (!st) { st = { lastCalc: now }; this.dband.set(el.name, st); this._set(el.name, 'value', clamp(g('initialoutput'))); }
    if (now - st.lastCalc >= Math.max(100, g('calctime') * 1000)) {
      st.lastCalc = now;
      const err = el.reversed ? pv - g('target') : g('target') - pv;     // > 0: needs more output
      const dead = Math.abs(g('deadbandoffset')), inner = Math.max(dead, Math.abs(g('innerbandoffset')));
      if (Math.abs(err) > dead) {
        const step = Math.abs(err) <= inner ? g('innerbanddrive') : g('outerbanddrive');
        const out = clamp(g('value') + Math.sign(err) * Math.abs(step));
        if (out !== this._get(el.name, 'value')) this._set(el.name, 'value', out);
      }
    }
    this._timeProportion(el, now, out);
  }

  // Precise (Fritz, 2026-11-07: "a method of precise control built if possible using offsets to get to .1 F or .1 C", Rule 6.19):
  // a PID made calm enough to hold a still's column or a water bath to 0.1 degree. What it does that the plain PID does not:
  // 1. Smoothing: it averages the probe over Smoothing seconds, so the probe's tiny steps (a DS18B20 jumps 0.11 °F at a time) do
  //    not make the heater twitch. The smoothed reading is its .pv.
  // 2. Hold output: the % it needs just to stay at the Target. It starts there, so the I part only makes up the difference.
  // 3. No wind-up: while the output is pinned at 0 or at Max output, or the reading is already on its way to the Target, the I
  //    part does not grow, so after a warm-up it overshoots less. The D part works on the smoothed reading, not the error, so a Target change gives no kick.
  // 4. Exact power: the part of an Output window too short to switch (the control looks every 0.1 s) is carried to the next
  //    window, so over a minute the element gets exactly the % asked for, even 12.34 %.
  _precise(el, now, out = 'state') {
    const g = k => Number(this._get(el.name, k)) || 0;
    const raw = Number(this._get(el.input, 'value'));
    let st = this.prec.get(el.name);
    if (!this._get(el.name, 'enabled') || !el.input || !Number.isFinite(raw)) {
      this.prec.delete(el.name);
      if (this._get(el.name, 'value') !== 0) this._set(el.name, 'value', 0);
      if (this._get(el.name, out)) this._set(el.name, out, false);
      return;
    }
    const maxO = Math.max(0, Math.min(100, g('maxoutput') || 100)), hold = Math.max(0, Math.min(maxO, g('holdoutput')));
    if (!st) { st = { pv: raw, lastPv: raw, integral: 0, lastCalc: 0, lastTick: now, win: -1, onMs: 0, carry: 0 }; this.prec.set(el.name, st); }
    // smoothing: an average that forgets over Smoothing seconds (0 = none)
    const tau = Math.max(0, g('smoothing')), dtTick = Math.max(0, (now - st.lastTick) / 1000);
    st.pv = tau > 0 ? st.pv + (raw - st.pv) * Math.min(1, dtTick / tau) : raw;
    st.lastTick = now;
    const calcMs = Math.max(100, g('calctime') * 1000);
    if (now - st.lastCalc >= calcMs) {
      const dt = st.lastCalc ? (now - st.lastCalc) / 1000 : calcMs / 1000;
      const pv = st.pv, err = el.reversed ? pv - g('target') : g('target') - pv;
      const d = (el.reversed ? 1 : -1) * (pv - st.lastPv) / dt;
      const p = g('kp') * err, dd = g('kd') * d;
      const free = hold + p + st.integral + dd;
      // no wind-up: the I part only grows when that does not push an output that is already pinned further out, and not
      // while the reading is already heading for the Target fast enough to get there within a minute (that is what overshoots)
      const step = g('ki') * err * dt, rate = (el.reversed ? -1 : 1) * (pv - st.lastPv) / dt;    // > 0: moving toward a higher Target
      const arriving = err !== 0 && Math.sign(rate) === Math.sign(err) && Math.abs(err) / Math.abs(rate) < 60;
      if (!arriving && !((free >= maxO && step > 0) || (free <= 0 && step < 0))) st.integral += step;
      st.integral = Math.max(-hold, Math.min(maxO - hold, st.integral));
      const o = Math.max(0, Math.min(maxO, hold + p + st.integral + dd));
      st.lastPv = pv; st.lastCalc = now;
      this._set(el.name, 'value', Math.round(o * 100) / 100);
      const shown = Math.round(pv * 1000) / 1000;
      if (this._get(el.name, 'pv') !== shown) this._set(el.name, 'pv', shown);
    }
    if (el.pwm) return;
    // exact power: each Output window is on for its % plus what the last window could not use (the control looks every 0.1 s)
    const winMs = Math.max(100, g('outtime') * 1000), w = Math.floor(now / winMs);
    if (w !== st.win) {
      const want = winMs * (Number(this._get(el.name, 'value')) || 0) / 100 + st.carry;
      st.onMs = Math.max(0, Math.min(winMs, Math.round(want / 100) * 100));
      st.carry = Math.max(-winMs, Math.min(winMs, want - st.onMs));
      st.win = w;
    }
    const on = (now - w * winMs) < st.onMs;
    if (this._get(el.name, out) !== on) this._set(el.name, out, on);
  }
}
