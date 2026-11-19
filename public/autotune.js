// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// PID Auto-tune (OakBarn Brewery, 2026-11-16, Panel Updates Sandbox entry 25: "And you can set up Autotune for the Precise?"; Rule 6.39,
// Help 237). The usual "relay" auto-tune: with water in the vessel and the probe in it, Skynet switches the element up and down around the
// Setpoint for a few swings, measures how long each swing takes and how far it goes, and works out Kp, Ki and Kd. PID and Precise share
// those numbers (Rule 6.19), so one tune serves both, and it also gives Precise's Hold output %.
//
// How it works (the technical side):
// - Relay with a bias: the output is bias + d while heating and bias - d while not. It starts at bias = d = Max output / 2, so the first
//   push is full power and the first rest is 0 %. A heater heats faster than a pot cools, so after each swing the bias moves until the
//   heating and the resting halves take about as long (the same way 3D printer firmware tunes a hot end). The bias it ends on is about
//   the % the element needs to just hold the Setpoint: that is the Hold output % offered for Precise.
// - Noise band: it turns down only above Setpoint + band and up only below Setpoint - band, so a probe's small steps do not make it chatter.
// - Each full swing gives the ultimate gain Ku = 4 d / (pi * sqrt(a^2 - band^2)) (a = half the swing from highest to lowest) and the
//   period Tu (seconds). The first swing is the warm-up and is not used; the last 3 are averaged.
// - Tyreus-Luyben rules (calmer than Ziegler-Nichols, less overshoot, which a mash and a 0.1 degree Precise want):
//   Kp = Ku / 2.2, Ti = 2.2 Tu, Td = Tu / 6.3, so Ki = Kp / Ti (per second) and Kd = Kp * Td (seconds), the units lib/control.js uses.
// - Safety: it stops (and the Brain turns the element Off) when the probe reads above the Highest temperature, when the probe is lost
//   for 30 seconds, or after the time limit. The brewer can Stop it any time.

export const TUNE_SWINGS = 5;                 // full swings it makes (the first is the warm-up and is not used)
export const TUNE_MAX_MIN = 180;              // minutes before it gives up (a kettle can take 30 to 90 minutes, a RIMS tube a few)
export const TUNE_LOST_S = 30;                // seconds without a probe reading before it stops
// the noise band in the probe's own units: 0.5 °F, or 0.3 °C
export const tuneBand = celsius => celsius ? 0.3 : 0.5;
// the Highest temperature it starts with: the Setpoint plus 10 °F (5 °C)
export const tuneHighestDefault = (setpoint, celsius) => Math.round((Number(setpoint) + (celsius ? 5 : 10)) * 10) / 10;

// The read-only results a Heating Element shows while and after it is tuned (also readable in a Process, e.g. hE_1.autotune_kp)
export const TUNE_PROPS = { autotune: 'string', autotune_kp: 'value', autotune_ki: 'value', autotune_kd: 'value', autotune_hold: 'value' };

const r = (x, n) => { const p = 10 ** n; return Math.round(x * p) / p; };
// Kp, Ki, Kd from Ku and Tu (Tyreus-Luyben)
export function tuneGains(ku, tu) {
  const kp = ku / 2.2, ti = 2.2 * tu, td = tu / 6.3;
  return { kp: r(kp, 2), ki: r(kp / ti, 4), kd: r(kp * td, 1) };
}

export class RelayTune {
  // setpoint, highest (probe units), maxOut (%), band (probe units), now (ms)
  constructor({ setpoint, highest, maxOut = 100, band = 0.5, swings = TUNE_SWINGS, maxMin = TUNE_MAX_MIN, now = 0 }) {
    this.sp = Number(setpoint); this.highest = Number(highest); this.maxOut = Math.max(1, Math.min(100, Number(maxOut) || 100));
    this.band = Math.max(0, Number(band) || 0); this.swings = swings; this.maxMs = maxMin * 60000; this.t0 = now;
    this.bias = this.d = this.maxOut / 2;
    this.heating = true; this.tUp = now; this.tDown = null; this.tHigh = 0; this.tLow = 0; this.upFromSwitch = false;
    this.hi = -Infinity; this.lo = Infinity; this.cycles = 0; this.got = []; this.lastSeen = now;
    this.done = false; this.fail = null; this.result = null;
  }
  get out() { return this.done ? 0 : r(this.heating ? this.bias + this.d : this.bias - this.d, 1); }
  // what it is doing, in plain words
  get text() {
    if (this.fail) return 'Stopped: ' + this.fail;
    if (this.done) return 'Done';
    if (this.cycles === 0) return 'Warming up to the Setpoint';
    return `Swing ${Math.min(this.cycles, this.swings)} of ${this.swings}`;
  }
  _stop(why) { this.fail = why; this.done = true; return this; }

  // one reading (pv may be NaN when the probe is lost); returns this
  step(now, pv) {
    if (this.done) return this;
    if (now - this.t0 > this.maxMs) return this._stop(`it took longer than ${Math.round(this.maxMs / 60000)} minutes. Check the probe is in the water and the element heats.`);
    if (!Number.isFinite(pv)) return now - this.lastSeen > TUNE_LOST_S * 1000 ? this._stop('the Temperature Probe gave no reading.') : this;
    this.lastSeen = now;
    if (Number.isFinite(this.highest) && pv > this.highest) return this._stop(`the probe read ${r(pv, 1)}, above the Highest temperature ${this.highest}.`);
    this.hi = Math.max(this.hi, pv); this.lo = Math.min(this.lo, pv);
    if (this.heating && pv > this.sp + this.band) {                      // turn down
      this.heating = false; this.tDown = now; this.tHigh = now - this.tUp;
    } else if (!this.heating && pv < this.sp - this.band) {             // turn up: one full swing
      this.heating = true; this.tLow = now - this.tDown;
      if (this.upFromSwitch && this.tHigh + this.tLow > 0) {
        // even out the heating and resting halves
        const lim = this.maxOut * 0.2;
        this.bias = Math.max(lim, Math.min(this.maxOut - lim, this.bias + this.d * (this.tHigh - this.tLow) / (this.tHigh + this.tLow)));
        this.d = this.bias > this.maxOut / 2 ? this.maxOut - this.bias : this.bias;
        const a = (this.hi - this.lo) / 2, amp = a > this.band ? Math.sqrt(a * a - this.band * this.band) : a;
        if (amp > 0) this.got.push({ ku: 4 * this.d / (Math.PI * amp), tu: (this.tHigh + this.tLow) / 1000, hold: this.bias });
      }
      this.upFromSwitch = true; this.tUp = now; this.hi = -Infinity; this.lo = Infinity; this.cycles++;
      if (this.cycles >= this.swings) {
        const last = this.got.slice(-3);
        if (!last.length) return this._stop('the temperature did not swing. Check the probe is in the water.');
        const avg = k => last.reduce((s, x) => s + x[k], 0) / last.length;
        const ku = avg('ku'), tu = avg('tu');
        this.result = { ...tuneGains(ku, tu), hold: r(avg('hold'), 1), ku: r(ku, 2), tu: r(tu, 1) };
        this.done = true;
      }
    }
    return this;
  }
}
