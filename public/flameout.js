// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Flame Out safety for gas burners (OakBarn Brewery, 2026-11-13/14, Rule 6.33; Help 197). A gas burner can go out while the gas keeps
// flowing (wind, a boil over, a low tank). A lit burner makes the pot get hotter. So while a burner's gas valve is really open, the
// Brain watches the temperature of the pot it heats: if it falls (Drop), or does not rise (No rise) after some minutes of burning,
// the flame is probably out, so the Brain shuts the gas, turns the burner's igniter off, and calls the brewer on every screen.
// Nothing turns itself back on (as Rule 6.31). It does not see the flame: it is a software backup, never the flame safety itself
// (OakBarn Brewery, 2026-11-14: "Also in Skynet have the software backup of decreasing Temp (with smoothing for false feedback)";
// a UL or CSA listed thermocouple gas valve is the real flame safety). Shared by the Brain (lib/flamewatch.js), the Panel and the
// BruControl Importer, so all three mean the same thing.

// The gas warning (Rule 6.20, the gas half; OakBarn Brewery, 2026-11-14: "Text is good"): shown first, in red bold under the red triangle, wherever Skynet talks about gas.
export const GAS_WARNING = '⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.';
// The honest line under it: what the Flame Out safety is not
export const HELPER_NOTE = 'The Flame Out safety is a helper, not a flame safety device. It can take minutes to notice a flame out. Use a burner with its own flame safety (a UL or CSA listed thermocouple gas valve, or a flame sensor). Never brew with gas indoors without fresh air, and never leave a lit burner alone.';
export const BACKUP_NOTE = 'Your listed thermocouple gas valve is the flame safety. Skynet\'s Flame Out is a backup.';
// a flame-out cutoff made from parts: For Information Only, not listed, not recommended (OakBarn Brewery, 2026-11-14: "Big Caveat with this one.
// For Information Only. One Way some Home Brewers do it with high pressure and then recommend the UL Way.")
export const CUTOFF_NOTE = '⚠ A flame-out cutoff made from parts (a K-type thermocouple and a temperature controller) is not a listed flame safety and is not recommended (Help 197: For Information Only). Use a UL or CSA listed flame safety. Skynet\'s Flame Out is a backup.';
// What every screen shows when it trips
export const TRIP_TEXT = 'Burner may be out: check the flame. Gas is turned off.';

// Flame safety: what shuts the gas if the flame goes out (the brewer picks it; Skynet cannot check it)
export const FLAME_SAFETY = [['none', 'None (plain solenoid valve)'], ['thermocouple', 'Thermocouple gas valve (UL or CSA listed)'], ['cutoff', 'Flame-out cutoff (K-type thermocouple and controller, not listed)']];

// A gas burner: a Heating Element with Gas burner switched on, or a Solenoid Gas Valve (DO@Valve_Sgas)
export const isSgasValve = el => el?.type === 'digitalOut' && el.typeCode === 'Valve_Sgas';
export const isGasBurner = el => (el?.type === 'digitalOut' && el.subtype === 'element' && el.gasBurner === true) || isSgasValve(el);

// The starting numbers (OakBarn Brewery, 2026-11-14: "Yes"): in °F; with a °C probe the degrees are the same amount of heat in °C
export const FLAME_DEFAULTS_F = { flameMinutes: 5, flameRise: 1, flameDrop: 1, flamePause: 10, flameSmooth: 30, flameBoil: 212 };
export const FLAME_DEFAULTS_C = { flameMinutes: 5, flameRise: 0.5, flameDrop: 0.5, flamePause: 10, flameSmooth: 30, flameBoil: 100 };
// close to the boil the No rise test rests (a rolling boil stops rising); a wild reading (a jump this big in one second) is thrown away
export const BOIL_BAND = { F: 3, C: 1.5 };
export const WILD = { F: 5, C: 2.8 };
export const WILD_ACCEPT_MS = 10000;      // a "wild" reading that stays for 10 seconds is real (the probe was moved): the average starts again there

const isC = units => /c/i.test(String(units ?? '°F'));
// a burner's Flame Out numbers, from its Properties or the starting numbers for its probe's units
export function flameSettings(el, units) {
  const d = isC(units) ? FLAME_DEFAULTS_C : FLAME_DEFAULTS_F, s = {};
  for (const k of Object.keys(d)) { const v = Number(el?.[k]); s[k] = el?.[k] === '' || el?.[k] == null || !Number.isFinite(v) || v < 0 ? d[k] : v; }
  s.safety = ['thermocouple', 'cutoff'].includes(el?.flameSafety) ? el.flameSafety : 'none';
  s.on = !(el?.flameOut === false || /^off$/i.test(String(el?.flameOut ?? '')));      // On to start for every gas burner
  s.c = isC(units);
  return s;
}

// The plain words a Process writes: name.flameout = On / Off / pause 10. Returns { on } or { pause: minutes } or null.
export function flameWord(v, defaultPause = 10) {
  if (v === true) return { on: true };
  if (v === false) return { on: false };
  const t = String(v ?? '').trim().toLowerCase();
  if (/^(on|true|yes|1)$/.test(t)) return { on: true };
  if (/^(off|false|no|0)$/.test(t)) return { on: false };
  const m = /^pause(?:\s+(\d+(?:\.\d+)?))?$/.exec(t);
  if (m) return { pause: m[1] ? Number(m[1]) : defaultPause };
  return null;
}

// One burner's watch. step() is called about once a second with the time, the reading, whether the gas is really open and whether
// the burner is On. It returns null, or { trip: 'drop' | 'norise', text } when the flame is probably out.
// - Smoothing: the reading is averaged over the last flameSmooth seconds. A single wild reading (a jump of more than 5 °F in one second,
//   or a probe error) is thrown away; one that stays 10 seconds is real, and the average starts again from it.
// - No rise: burning time counts only while the gas valve is really open (Hysteresis and Duty Cycle open and close it by themselves).
//   After flameMinutes of burning, the average must be flameRise above where the count started; when it is, the count starts again.
//   It rests within 3 °F of the Boil point (a rolling boil holds steady with the flame on).
// - Drop: once the pot has started to warm after the valve opened (the reading is past its lowest by a little), the average must not
//   fall flameDrop below its highest since then. Warm-up after opening (the heat still on its way) is not a drop.
export class FlameWatcher {
  constructor() { this.reset(); this.samples = []; this.lastRaw = null; this.wildSince = 0; }
  // a new burn: forget the counts (kept: the smoothing samples)
  reset() { this.burnMs = 0; this.base = null; this.low = null; this.peak = null; this.armed = false; this.wasOpen = false; this.lastT = null; }
  avg() { return this.samples.length ? this.samples.reduce((a, s) => a + s[1], 0) / this.samples.length : null; }
  // add one reading to the average (false = thrown away)
  _sample(t, v, s) {
    if (!Number.isFinite(v)) return false;
    const wild = s.c ? WILD.C : WILD.F, a = this.avg();
    if (a !== null && Math.abs(v - (this.lastRaw ?? a)) > wild && Math.abs(v - a) > wild) {
      if (!this.wildSince) this.wildSince = t;
      if (t - this.wildSince < WILD_ACCEPT_MS) return false;
      this.samples = []; this.reset();          // it stayed: the probe really moved; start again from here
    }
    this.wildSince = 0; this.lastRaw = v;
    this.samples.push([t, v]);
    const keep = Math.max(1, s.flameSmooth) * 1000;
    while (this.samples.length > 1 && t - this.samples[0][0] > keep) this.samples.shift();
    return true;
  }
  step(t, reading, open, on, s) {
    const dt = this.lastT === null ? 0 : Math.max(0, Math.min(120000, t - this.lastT));
    this.lastT = t;
    this._sample(t, reading, s);
    if (!on) { this.reset(); this.lastT = t; return null; }
    const a = this.avg();
    if (a === null) return null;
    if (!open) { if (this.wasOpen) { this.low = null; this.peak = null; this.armed = false; } this.wasOpen = false; return null; }
    if (!this.wasOpen) { this.low = a; this.peak = null; this.armed = false; this.wasOpen = true; }
    if (this.base === null) this.base = a;
    this.burnMs += dt;
    const deg = s.c ? 0.1 : 0.2;                    // "started to warm": past its lowest by this much
    // Drop
    if (!this.armed) { this.low = Math.min(this.low, a); if (a >= this.low + deg) { this.armed = true; this.peak = a; } }
    else {
      this.peak = Math.max(this.peak, a);
      if (s.flameDrop > 0 && a <= this.peak - s.flameDrop - 1e-9) return { trip: 'drop', text: `The temperature fell ${round1(this.peak - a)} ${s.c ? '°C' : '°F'} while the gas was on.` };
    }
    // No rise
    if (a >= this.base + s.flameRise - 1e-9) { this.base = a; this.burnMs = 0; }
    const nearBoil = a >= s.flameBoil - (s.c ? BOIL_BAND.C : BOIL_BAND.F);
    if (nearBoil) { this.burnMs = 0; this.base = a; }
    if (s.flameMinutes > 0 && this.burnMs >= s.flameMinutes * 60000) return { trip: 'norise', text: `The temperature did not rise ${s.flameRise} ${s.c ? '°C' : '°F'} in ${s.flameMinutes} minutes of burning.` };
    return null;
  }
}
const round1 = x => Math.round(x * 10) / 10;
