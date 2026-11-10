// Software control elements (as in BruControl): duty cycle, hysteresis, PID and deadband outputs, one-shot outputs,
// and the calibration chain for analog inputs.
import { clock } from './simclock.js';
import { applyCalibrations } from '../public/calibrations.js';
import { isHeatElem, isMethodDevice, heatMethodKey, heatHysRange } from '../public/heatmethod.js';
import { FERM_TYPE, FERM_DOING, fermModeKey } from '../public/fermentor.js';

// raw reading -> engineering value (an Analog In). With calibrations each one runs in order on the result of the one before
// (Rule 6.24, public/calibrations.js); without, its Scale and Offset
export function calibrate(el, raw) {
  const cals = el.calibrations;
  if (!cals?.length) return raw * (el.scale ?? 1) + (el.offset ?? 0);
  return applyCalibrations(cals, raw);
}

export class Control {
  constructor(store) {
    this.store = store;
    this.pid = new Map();          // name -> {integral, lastPv, lastCalc}
    this.hys = new Map();          // name -> time the "turn on" condition started
    this.pred = new Map();         // Predictive Hysteresis (Rule 6.23): name -> { coast, watching, offE, peak }
    this.dband = new Map();        // name -> {lastCalc}
    this.prec = new Map();         // name -> Precise: {pv (smoothed), lastPv, lastRaw, integral, lastCalc, lastTick, win, onMs, carry}
    this.ferm = new Map();         // the Fermentor Control (Rule 6.30): name -> { on, h, c, hOn, hOff, cOn, cOff }
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
        case FERM_TYPE: this._fermentor(el, now); break;
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

  // The Fermentor Control (OakBarn Brewery, 2026-11-10, Rule 6.30, public/fermentor.js): one Setpoint, Hysteresis on both sides.
  // Heat comes on the Heat On offset below the Setpoint, Cooling the Cool On offset above; both stop at the Setpoint (a little before
  // it with Predictive, Rule 6.23). Heat and Cooling are never On together: one must have been Off for the Changeover wait before the
  // other may start. Each side keeps its On delay (shortest time Off) and its Shortest run (shortest time On). A heater keeps to the range
  // of what switches it (Rule 6.29). While it is ON it alone switches its Heat and Cooling; turned OFF it turns both off once.
  _fermentor(el, now) {
    const g = k => Number(this._get(el.name, k)) || 0, isOut = n => !!n && !!this.store.get(n);
    const heat = isOut(el.heat) ? el.heat : '', cool = isOut(el.cool) ? el.cool : '';
    const doing = d => { if (this._get(el.name, 'doing') !== d) this._set(el.name, 'doing', d); };
    let st = this.ferm.get(el.name);
    const sw = (n, v) => {
      if (!n) return;
      if (!!this._get(n, 'state') !== v) this._set(n, 'state', v);
      const side = n === heat ? 'h' : 'c';
      if (st[side] !== v) { st[side] = v; st[side + (v ? 'On' : 'Off')] = now; }
    };
    if (!this._get(el.name, 'state')) {
      if (st?.on) { sw(heat, false); sw(cool, false); }
      if (st) st.on = false;
      return doing(FERM_DOING.off);
    }
    if (!st || !st.on) {
      // turned ON: each side counts as just Off, so the first start waits its On delay (a compressor is never started at once);
      // the Changeover wait counts only after the other side has really run
      st = { on: true, h: false, c: false, hOn: -Infinity, hOff: now, cOn: -Infinity, cOff: now };
      this.ferm.set(el.name, st);
      for (const n of [heat, cool]) if (n && isMethodDevice(this.store.get(n)) && heatMethodKey(this._get(n, 'method')) !== 'onoff') this._set(n, 'method', 'Direct');
      sw(heat, false); sw(cool, false);
    }
    const pv = Number(this._get(el.input, 'value'));
    if (!el.input || !Number.isFinite(pv)) { sw(heat, false); sw(cool, false); return doing(FERM_DOING.noReading); }
    const mode = fermModeKey(this._get(el.name, 'mode')) ?? 'auto', sp = g('target');
    let ho = Math.abs(g('heatoffset')), hd = Math.max(0, g('heatdelay'));
    const co = Math.abs(g('cooloffset')), cd = Math.max(0, g('cooldelay'));
    const heatEl = heat && this.store.get(heat);
    if (isHeatElem(heatEl)) { const r = heatHysRange(heatEl, this.store.get(el.input)); ho = Math.min(r.max, Math.max(r.min, ho)); hd = Math.max(hd, r.delay); }
    // Predictive (Rule 6.23), learned for each side apart
    const pred = el.predictive === false ? null : side => this._coast({ name: `${el.name}:${side}`, predictive: true }, side === 'h' ? pv - sp : sp - pv, !!st[side], !!st['_' + side]);
    const hEarly = pred ? Math.min(pred('h'), ho / 2) : 0, cEarly = pred ? Math.min(pred('c'), co / 2) : 0;
    st._h = st.h; st._c = st.c;
    const canStop = side => now - st[side + 'On'] >= Math.max(0, g(side === 'h' ? 'heatminrun' : 'coolminrun')) * 1000;
    const okHeat = heat && mode !== 'cool', okCool = cool && mode !== 'heat';
    // a side that may not run (Mode) stops at once; one that has reached the Setpoint stops after its Shortest run
    if (st.h && (!okHeat || (pv >= sp - hEarly && canStop('h')))) sw(heat, false);
    if (st.c && (!okCool || (pv <= sp + cEarly && canStop('c')))) sw(cool, false);
    const changeover = Math.max(0, g('changeover')) * 1000;
    let d = st.h ? FERM_DOING.heating : st.c ? FERM_DOING.cooling : FERM_DOING.idle;
    if (!st.h && !st.c) {
      if (okHeat && pv <= sp - ho - hEarly) {
        if (now - st.hOff >= hd * 1000 && (st.cOn === -Infinity || now - st.cOff >= changeover)) { sw(heat, true); d = FERM_DOING.heating; } else d = FERM_DOING.waitHeat;
      } else if (okCool && pv >= sp + co + cEarly) {
        if (now - st.cOff >= cd * 1000 && (st.hOn === -Infinity || now - st.hOff >= changeover)) { sw(cool, true); d = FERM_DOING.cooling; } else d = FERM_DOING.waitCool;
      }
    }
    doing(d);
  }

  _hysteresis(el, now, out = 'state') {
    let on = false;
    const pv = Number(this._get(el.input, 'value'));
    if (this._get(el.name, 'enabled') && el.input && Number.isFinite(pv)) {
      const sp = this._get(el.name, 'target'), was = this._get(el.name, out);
      let off = Number(this._get(el.name, 'onoffset')) || 0, delay = Number(this._get(el.name, 'ondelay')) || 0;
      // Heat Hysteresis by what switches it (Rule 6.29): a heating element's Hysteresis never runs outside its range, whatever was saved
      if (isHeatElem(el) && off <= 0) { const r = heatHysRange(el, this.store.get(el.input)); off = -Math.min(r.max, Math.max(r.min, -off)); delay = Math.max(delay, r.delay); }
      // the Offset says where it turns On, Setpoint + Offset (Rule 6.19): a minus (or 0) Offset heats, a plus one cools
      const heat = off <= 0, e = heat ? pv - sp : sp - pv;            // how far past the Target, in the direction it drives
      const early = Math.min(this.pred.get(el.name)?.coast ?? 0, Math.abs(off) / 2) * (el.predictive === false ? 0 : 1);
      // both points move down together by the same amount, so the swing (and how often it switches) stays the same
      const wantOn = e <= -Math.abs(off) - early;
      const wantOff = e >= -early;
      if (was) on = !wantOff;
      else if (wantOn) {
        if (!this.hys.has(el.name)) this.hys.set(el.name, now);
        on = now - this.hys.get(el.name) >= delay * 1000;
      }
      if (!wantOn) this.hys.delete(el.name);
    } else this.hys.delete(el.name);
    if (on) this.hys.delete(el.name);
    if (Number.isFinite(pv) && el.input) { const sp = this._get(el.name, 'target'), heat = this._get(el.name, 'onoffset') <= 0; this._coast(el, heat ? pv - sp : sp - pv, on, !!this._get(el.name, out)); }
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
