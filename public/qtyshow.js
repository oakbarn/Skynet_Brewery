// Live readings in the Units (Rule 2.59 "live side", Panel Updates Sandbox entry 9; OakBarn Brewery, 2026-11-19: "Keep backend data
// metric, display to user by choice in Skynet Settings"). The pressure of a Pressure transducer, the volume of a Level transmitter, the
// rate and total of a Flow meter and the weight and volume of a Scale each keep their numbers in the units
// of their own Units box ("Kept in": the units the sensor is calibrated in, never changed by this). What a person sees follows
// ☰ Menu > Settings > Units, and a Process works in metric. Showing never changes a kept number.
// Pressure is shown and worked in bar (Metric) or psi (US), a volume in L or gal, a flow rate in L/min or gal/min, a weight in kg or lb.
// A unit that already is in the Units (kPa in Metric, qt in US) is shown as it is. Every factor is a Skynet Constant (public/skconst.js).
// Anything else (%, pH, SG, V, a temperature: public/tempshow.js) is never turned here.
import { skynetConstant } from './skconst.js';

const K = n => skynetConstant(n);
const isNum = v => v !== '' && v !== null && v !== undefined && typeof v !== 'boolean' && Number.isFinite(+v);
const r = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
const KEEP = 4;

// family: [metric unit, US unit]; each unit: [family, how many of the family's metric unit in one, 'US' or 'Metric']
export const QTY_FAMILIES = { press: ['bar', 'psi'], vol: ['L', 'gal'], rate: ['L/min', 'gal/min'], wt: ['kg', 'lb'] };
const UNIT = {
  psi: ['press', K('skn_const_Bar_p_PSI'), 'US'], bar: ['press', 1, 'Metric'], kpa: ['press', K('skn_const_Bar_p_kPa'), 'Metric'],
  hpa: ['press', K('skn_const_Bar_p_hPa'), 'Metric'], mbar: ['press', K('skn_const_Bar_p_hPa'), 'Metric'],
  gal: ['vol', K('skn_const_L_p_Gal'), 'US'], qt: ['vol', K('skn_const_L_p_Qt'), 'US'], l: ['vol', 1, 'Metric'], ml: ['vol', K('skn_const_L_p_mL'), 'Metric'],
  'gal/min': ['rate', K('skn_const_LPM_p_GPM'), 'US'], gpm: ['rate', K('skn_const_LPM_p_GPM'), 'US'],
  'l/min': ['rate', 1, 'Metric'], lpm: ['rate', 1, 'Metric'],
  lb: ['wt', K('skn_const_Kg_p_Lb'), 'US'], oz: ['wt', K('skn_const_Kg_p_Oz'), 'US'], kg: ['wt', 1, 'Metric'], g: ['wt', K('skn_const_Kg_p_g'), 'Metric'],
};
const unitOf = u => UNIT[String(u ?? '').trim().toLowerCase()] ?? null;
// 'press', 'vol', 'rate', 'wt' or null
export const qtyFamily = u => unitOf(u)?.[0] ?? null;
export const isQtyUnit = u => !!unitOf(u);
// does a number kept in "own" show differently in the Units "to" (US or Metric)?
export const qNeedsTurn = (own, to) => { const u = unitOf(own); return !!u && u[2] !== (to === 'Metric' ? 'Metric' : 'US'); };
// the unit word shown after the number
export const qUnitShown = (own, to) => qNeedsTurn(own, to) ? QTY_FAMILIES[unitOf(own)[0]][to === 'Metric' ? 0 : 1] : own;
// the metric unit a Process works in for this unit (bar, L, L/min, kg)
export const qMetricUnit = own => unitOf(own) ? QTY_FAMILIES[unitOf(own)[0]][0] : own;

// kept (in "own") to metric (bar, L, L/min, kg) and back, full precision
export const qToMetric = (v, own) => { const u = unitOf(own); return u && isNum(v) ? +v * u[1] : v; };
export const qFromMetric = (v, own) => { const u = unitOf(own); return u && isNum(v) ? +v / u[1] : v; };
// metric to the Units' unit of the same family (bar to psi in US)
const usOne = fam => UNIT[QTY_FAMILIES[fam][1].toLowerCase()][1];
// kept (in "own") to shown (in "to"), full precision: the caller rounds what it shows
export function qShow(v, own, to) {
  if (!qNeedsTurn(own, to) || !isNum(v)) return v;
  const m = qToMetric(v, own);
  return to === 'Metric' ? m : m / usOne(unitOf(own)[0]);
}
// shown (typed in "to") back to kept (in "own")
export function qBack(x, own, to) {
  if (!qNeedsTurn(own, to) || !isNum(x)) return x;
  const m = to === 'Metric' ? +x : +x * usOne(unitOf(own)[0]);
  return r(qFromMetric(m, own), KEEP);
}
// a number in the metric unit of a family to the Units (a Process message: 2 bar shows 29.01 psi in US)
export function qMetricShow(v, fam, to) {
  if (!QTY_FAMILIES[fam] || to === 'Metric' || !isNum(v)) return v;
  return +v / usOne(fam);
}
// typed in the Units (a plain number in a Process, read in Settings > Units) to metric
export function qUnitsToMetric(v, fam, to) {
  if (!QTY_FAMILIES[fam] || to === 'Metric' || !isNum(v)) return v;
  return +v * usOne(fam);
}
// a typed sign after a number in a Process (12psi, 0.8bar, 5gal, 18.9L, 10lb, 4.5kg, 2gpm, 7.5Lpm): [family, number in metric]
export const QTY_SIGNS = ['psi', 'bar', 'kPa', 'gal', 'L', 'lb', 'kg', 'gpm', 'Lpm'];
export function qSign(raw, sign) { const u = unitOf(sign); return u ? [u[0], +raw * u[1]] : null; }
// the sign a number kept in "own" is written with in a Process (gal/min is gpm), or '' when it has none (qt, oz, mL, g, hPa)
export function qSignFor(own) {
  const o = String(own ?? '').trim().toLowerCase(), alias = { 'gal/min': 'gpm', 'l/min': 'Lpm' };
  return alias[o] ?? QTY_SIGNS.find(x => x.toLowerCase() === o) ?? '';
}
// the sign a Process keeps a metric number with (bar, L, Lpm, kg)
export const qMetricSign = fam => ({ press: 'bar', vol: 'L', rate: 'Lpm', wt: 'kg' })[fam] ?? '';

// a Properties box of a quantity (a Dial's Lowest and Highest): the number it shows (2 decimals when turned) and what is saved
export function qBoxShow(v, own, to) {
  if (!qNeedsTurn(own, to) || !isNum(v)) return v;
  return r(qShow(v, own, to), 2);
}
export function qBoxBack(typed, shown, kept, own, to) {
  if (!qNeedsTurn(own, to) || !isNum(typed)) return typed;
  if (isNum(kept) && isNum(shown) && +typed === +shown) return +kept;
  return qBack(typed, own, to);
}

// The units an attribute of an item keeps its number in, when it is a quantity that turns (else null).
// A Flow meter keeps its volume in its Units box (gal or L): its rate is that per minute. Its .value is its rate, or its total
// while its Data Display is Total (Rule 6.26). A Scale: its weight (.value) in its Weight units, its .volume in its Volume units.
export function qtyOwn(el, prop) {
  if (!el) return null;
  const p = String(prop ?? 'value').toLowerCase();
  let own = null;
  if (el.type === 'analogIn' && p === 'value') own = el.units;
  else if (el.type === 'flowMeter') {
    const v = el.units || 'gal', total = p === 'total' || (p === 'value' && el.display === 'total');
    own = total ? v : (p === 'rate' || p === 'value') ? `${v}/min` : null;
  } else if (el.type === 'scale') own = p === 'value' ? (el.weightUnits || 'lb') : p === 'volume' ? (el.volumeUnits || 'gal') : null;
  return own && isQtyUnit(own) ? own : null;
}
