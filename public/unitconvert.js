// Units are for showing only (Panel Updates Sandbox entry 9; OakBarn Brewery, 2026-11-17: "switching units only affects display, not the
// data which is always metric"; Rule 2.59). Skynet keeps every number in metric: °C, liters, kilograms, cm. ☰ Menu > Settings > Units
// (US or Metric) only changes what a box shows and what you type in it.
// Part 1: Mash, Boil and Water Profiles, Equipment Profiles, Vessels (on a Tab, in a Vessel Template, in an Equipment Profile drawing)
// and the Default settings. Recipes were already kept this way. Part 2 (later): temperature probes, setpoints, PID, alarms, Processes.
// Older saves kept some of these in US numbers, each with its own units tag: the server turns them into metric once (toMetric*),
// and a box that edits one turns it into the shown Units first (forShow*) and back to metric when saved.
import { HOP_STANDS } from './brewcalc.js';

const r = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
const isNum = v => v !== '' && v !== null && v !== undefined && Number.isFinite(+v);
const GAL_L = 3.785411784, IN_CM = 2.54, GALLB_LKG = GAL_L / 0.45359237;      // 1 gal/lb = 8.345 L/kg
// kept: 4 decimals (so 152 °F comes back as 152 °F); shown: a temperature 1 decimal (decided 2026-11-15), a volume 2, a length 1
const KEEP = { t: 4, v: 4, l: 4, a: 4 }, SHOW = { t: 1, v: 2, l: 1, a: 3 };

export const convTemp = (v, to, d = SHOW.t) => !isNum(v) ? v : r(to === 'Metric' ? (+v - 32) * 5 / 9 : +v * 9 / 5 + 32, d);
export const convVol = (v, to, d = SHOW.v) => !isNum(v) ? v : r(to === 'Metric' ? +v * GAL_L : +v / GAL_L, d);
export const convLen = (v, to, d = SHOW.l) => !isNum(v) ? v : r(to === 'Metric' ? +v * IN_CM : +v / IN_CM, d);
const convAbs = (v, to, d = SHOW.a) => !isNum(v) ? v : r(to === 'Metric' ? +v * GALLB_LKG : +v / GALLB_LKG, d);

const unitsOf = p => p?.units === 'Metric' ? 'Metric' : 'US';
const needs = (p, to) => !!p && unitsOf(p) !== to;

// each one gives the same thing in the Units "to", or null when it already is
function mash(p, to, P) {
  if (!needs(p, to)) return null;
  return { ...p, units: to, steps: (p.steps || []).map(s => ({ ...s, temp: convTemp(s.temp, to, P.t) })), mashOutTemp: convTemp(p.mashOutTemp, to, P.t), spargeTemp: convTemp(p.spargeTemp, to, P.t) };
}
function boil(p, to, P) {
  if (!needs(p, to)) return null;
  const out = { ...p, units: to, boilOffRate: convVol(p.boilOffRate, to, P.v) };
  for (const [k] of HOP_STANDS) if (out[`hs${k}Temp`] !== undefined) out[`hs${k}Temp`] = convTemp(out[`hs${k}Temp`], to, P.t);
  return out;
}
// a Water Profile holds ppm and pH only: just its tag changes
const water = (p, to) => needs(p, to) ? { ...p, units: to } : null;
const VOLS = ['volume', 'maxVolume', 'minVolume', 'deadspace', 'safeVolume', 'extraTrub'], LENS = ['diameter', 'vheight'];
function sizes(g, to, P) {
  const out = { ...g };
  for (const k of VOLS) if (out[k] !== undefined) out[k] = convVol(out[k], to, P.v);
  for (const k of LENS) if (out[k] !== undefined) out[k] = convLen(out[k], to, P.l);
  return out;
}
// a Vessel (or a Fermenter, a Vessel Template): its size numbers. One with no units tag was made in US numbers.
function vessel(g, to, P) {
  if (!needs(g, to) || !VOLS.concat(LENS).some(k => g[k] !== undefined)) return null;
  return { ...sizes(g, to, P), units: to };
}
// an Equipment Profile: its numbers, its Equipment list (in the profile's units) and the Vessels in its drawing (each with its own tag)
function equipment(p, to, P) {
  const out = needs(p, to) ? { ...p, units: to, trubChillerLoss: convVol(p.trubChillerLoss, to, P.v), grainAbsorption: convAbs(p.grainAbsorption, to, P.a) } : { ...p };
  if (needs(p, to) && Array.isArray(p.equipment)) out.equipment = p.equipment.map(e => sizes(e, to, P));
  let changed = needs(p, to);
  for (const k of ['graphics']) if (Array.isArray(p[k])) out[k] = p[k].map(g => { const v = g?.kind === 'vessel' ? vessel(g, to, P) : null; if (v) changed = true; return v || g; });
  return changed ? out : null;
}

// the kept (metric) copy, or null when it already is metric
export const toMetric = {
  mash: p => mash(p, 'Metric', KEEP), boil: p => boil(p, 'Metric', KEEP), water: p => water(p, 'Metric'),
  vessel: g => vessel(g, 'Metric', KEEP), equipment: p => equipment(p, 'Metric', KEEP),
};
// the copy a box shows, in the Units (US or Metric); always a copy
export const forShow = {
  mash: (p, to) => mash(p, to, SHOW) || p, boil: (p, to) => boil(p, to, SHOW) || p, water: (p, to) => water(p, to) || p,
  vessel: (g, to) => vessel(g, to, SHOW) || g, equipment: (p, to) => equipment(p, to, SHOW) || p,
};
export const VESSEL_SIZE_KEYS = VOLS.concat(LENS);

// The Default settings: Boil Start and Ferment temperatures of older saves were in the Units; now in °C (boilStartTempC, fermentTempC)
export function defaultsToMetric(d) {
  if (!d) return null;
  let out = null;
  for (const k of ['boilStartTemp', 'fermentTemp']) if (k in d) {
    out = out || { ...d };
    if (isNum(d[k])) out[k + 'C'] = d.units === 'Metric' ? +d[k] : convTemp(d[k], 'Metric', KEEP.t);
    delete out[k];
  }
  return out;
}
