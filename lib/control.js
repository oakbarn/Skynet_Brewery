// Software control elements (as in BruControl): duty cycle, hysteresis and PID outputs, one-shot outputs,
// and the calibration chain for analog inputs.

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
    this.shots = new Map();        // one-shot timers
    store.on('change', (name, prop, v, source) => this._onChange(name, prop, v, source));
  }

  start() { this.timer = setInterval(() => this.tick(Date.now()), 100); }
  stop() { clearInterval(this.timer); for (const t of this.shots.values()) clearTimeout(t); this.shots.clear(); }

  _get(name, prop) { try { return this.store.getProp(name, prop); } catch { return undefined; } }
  _set(name, prop, v) { this.store.setProp(name, prop, v, 'control'); }

  // One-shot: the output turns itself back after oneShot ms (oneShotDirection false = an ON pulse)
  _onChange(name, prop, v, source) {
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
      }
    }
  }

  _duty(el, now) {
    const on = this._get(el.name, 'enabled') && (() => {
      const iv = Math.max(100, this._get(el.name, 'interval') || 1000), dc = this._get(el.name, 'dutycycle') || 0;
      return (now % iv) < iv * dc / 100;
    })();
    if (this._get(el.name, 'state') !== on) this._set(el.name, 'state', on);
  }

  // Positive ON offset (heating): on at target - offset, off at target.
  // Negative ON offset (cooling): on at target + |offset|, off at target.
  _hysteresis(el, now) {
    let on = false;
    const pv = Number(this._get(el.input, 'value'));
    if (this._get(el.name, 'enabled') && el.input && Number.isFinite(pv)) {
      const sp = this._get(el.name, 'target'), off = this._get(el.name, 'onoffset'), was = this._get(el.name, 'state');
      const heat = off >= 0;
      const wantOn = heat ? pv <= sp - off : pv >= sp - off;
      const wantOff = heat ? pv >= sp : pv <= sp;
      if (was) on = !wantOff;
      else if (wantOn) {
        if (!this.hys.has(el.name)) this.hys.set(el.name, now);
        on = now - this.hys.get(el.name) >= (this._get(el.name, 'ondelay') || 0) * 1000;
      }
      if (!wantOn) this.hys.delete(el.name);
    } else this.hys.delete(el.name);
    if (on) this.hys.delete(el.name);
    if (this._get(el.name, 'state') !== on) this._set(el.name, 'state', on);
  }

  _pid(el, now) {
    const g = k => Number(this._get(el.name, k)) || 0;
    const pv = Number(this._get(el.input, 'value'));
    let st = this.pid.get(el.name);
    if (!this._get(el.name, 'enabled') || !el.input || !Number.isFinite(pv)) {
      this.pid.delete(el.name);
      if (this._get(el.name, 'value') !== 0) this._set(el.name, 'value', 0);
      if (this._get(el.name, 'state')) this._set(el.name, 'state', false);
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
    if (!el.pwm) {                               // time-proportioned on/off output over outTime seconds
      const win = Math.max(100, g('outtime') * 1000);
      const on = (now % win) < win * g('value') / 100;
      if (this._get(el.name, 'state') !== on) this._set(el.name, 'state', on);
    }
  }
}
