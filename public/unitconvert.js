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
const CONV = { t: convTemp, v: convVol, l: convLen, a: convAbs };
// one number into the Units "to". o: the kept metric number it was shown from (a box's _shown copy, see forShow): when the shown
// number was not changed, the kept one comes back exactly, so showing and saving never moves a number (Rule 2.59)
function one(kind, v, to, P, o) {
  if (to === 'Metric' && o !== undefined && isNum(o) && isNum(v) && +v === CONV[kind](o, 'US', SHOW[kind])) return +o;
  return CONV[kind](v, to, P[kind]);
}
const at = (o, k) => o && typeof o === 'object' ? o[k] : undefined;

// each one gives the same thing in the Units "to", or null when it already is. o: the kept copy it was shown from, if any.
function mash(p, to, P, o) {
  if (!needs(p, to)) return null;
  return { ...p, units: to, steps: (p.steps || []).map((s, i) => ({ ...s, temp: one('t', s.temp, to, P, at(at(at(o, 'steps'), i), 'temp')) })),
    mashOutTemp: one('t', p.mashOutTemp, to, P, at(o, 'mashOutTemp')), spargeTemp: one('t', p.spargeTemp, to, P, at(o, 'spargeTemp')) };
}
function boil(p, to, P, o) {
  if (!needs(p, to)) return null;
  const out = { ...p, units: to, boilOffRate: one('v', p.boilOffRate, to, P, at(o, 'boilOffRate')) };
  for (const [k] of HOP_STANDS) if (out[`hs${k}Temp`] !== undefined) out[`hs${k}Temp`] = one('t', out[`hs${k}Temp`], to, P, at(o, `hs${k}Temp`));
  return out;
}
// a Water Profile holds ppm and pH only: just its tag changes
const water = (p, to) => needs(p, to) ? { ...p, units: to } : null;
const VOLS = ['volume', 'maxVolume', 'minVolume', 'deadspace', 'safeVolume', 'extraTrub'], LENS = ['diameter', 'vheight'];
function sizes(g, to, P, o) {
  const out = { ...g };
  for (const k of VOLS) if (out[k] !== undefined) out[k] = one('v', out[k], to, P, at(o, k));
  for (const k of LENS) if (out[k] !== undefined) out[k] = one('l', out[k], to, P, at(o, k));
  return out;
}
// a Vessel (or a Fermenter, a Vessel Template): its size numbers. One with no units tag was made in US numbers.
function vessel(g, to, P, o) {
  if (!needs(g, to) || !VOLS.concat(LENS).some(k => g[k] !== undefined)) return null;
  return { ...sizes(g, to, P, o), units: to };
}
// an Equipment Profile: its numbers, its Equipment list (in the profile's units) and the Vessels in its drawing (each with its own tag)
function equipment(p, to, P, o) {
  const own = needs(p, to);
  const out = own ? { ...p, units: to, trubChillerLoss: one('v', p.trubChillerLoss, to, P, at(o, 'trubChillerLoss')), grainAbsorption: one('a', p.grainAbsorption, to, P, at(o, 'grainAbsorption')) } : { ...p };
  if (own && Array.isArray(p.equipment)) out.equipment = p.equipment.map((e, i) => sizes(e, to, P, at(at(o, 'equipment'), i)));
  let changed = own;
  if (Array.isArray(p.graphics)) out.graphics = p.graphics.map(g => {
    if (g?.kind !== 'vessel') return g;
    const v = P === KEEP ? toMetric.vessel(g) : (forShow.vessel(g, to) !== g ? forShow.vessel(g, to) : null);
    if (v) changed = true; return v || g;
  });
  return changed ? out : null;
}
const KINDS = { mash, boil, water, vessel, equipment };
// a shown copy remembers what it was shown from (_shown: its Units and the kept copy); it never goes back to the Brain
const SHOWN = '_shown';
function keep(kind, p) {
  if (!p || typeof p !== 'object') return null;
  const sh = p[SHOWN], body = sh ? (({ [SHOWN]: _, ...rest }) => rest)(p) : p;
  const o = sh && sh.units === unitsOf(body) ? sh.was : undefined;
  return KINDS[kind](body, 'Metric', KEEP, o) || (sh ? body : null);
}

// the kept (metric) copy, or null when it already is metric
export const toMetric = Object.fromEntries(Object.keys(KINDS).map(k => [k, p => keep(k, p)]));
// the copy a box shows, in the Units (US or Metric); always a copy, and it remembers the kept one it came from
export const forShow = Object.fromEntries(Object.keys(KINDS).map(k => [k, (p, to) => {
  if (!p || typeof p !== 'object') return p;
  const s = KINDS[k](p, to, SHOW);
  if (!s) return p;
  const was = { ...p }; delete was.graphics;      // the Vessels of a drawing remember their own
  return { ...s, [SHOWN]: { units: to, was } };
}]));
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
