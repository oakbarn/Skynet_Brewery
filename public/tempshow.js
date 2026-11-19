// Tab temperatures in the Units (Rule 2.59, Panel Updates Sandbox entry 9; OakBarn Brewery, 2026-11-19: "Fix the Dispalys as the
// Skynet Setting for US Metric, US would not understand C and Europeans not F"; "Keep backend data metric, display to user by choice in
// Skynet Settings"). A probe keeps its numbers in its own units (its "Kept in" box: °C for a new probe, °F for an older one); what a
// person sees and types follows ☰ Menu > Settings > Units. Showing never changes a saved number.
// A temperature (a reading, a Setpoint, a Boil point) turns with the full °F / °C formula; a temperature DIFFERENCE (an Offset, a band,
// a Rise or Drop) only by 9/5 or 5/9, with no 32 (1 °C step = 1.8 °F step).
const isNum = v => v !== '' && v !== null && v !== undefined && typeof v !== 'boolean' && Number.isFinite(+v);
const r = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
const KEEP = 4;      // a typed number is saved to 4 decimals (as the rest of Rule 2.59)

export const isTempUnit = u => /^\s*°?\s*[CF]\s*$/i.test(String(u ?? ''));
export const unitIsC = u => /c/i.test(String(u ?? '')) && !/f/i.test(String(u ?? ''));
export const showLetter = to => to === 'Metric' ? '°C' : '°F';
// does a number kept in "own" show differently in the Units "to" (US or Metric)?
export const needsTurn = (own, to) => isTempUnit(own) && unitIsC(own) !== (to === 'Metric');
// the units word shown after the number: a °F / °C follows the Units, anything else (%, gal, pH) stays
export const unitShown = (own, to) => isTempUnit(own) ? showLetter(to) : own;

// kept (in "own") to shown (in "to"), full precision: the caller rounds what it shows
export function tShow(v, own, to) {
  if (!needsTurn(own, to) || !isNum(v)) return v;
  return to === 'Metric' ? (+v - 32) * 5 / 9 : +v * 9 / 5 + 32;
}
export function dShow(v, own, to) {
  if (!needsTurn(own, to) || !isNum(v)) return v;
  return to === 'Metric' ? +v * 5 / 9 : +v * 9 / 5;
}
// shown (typed in "to") back to kept (in "own")
export function tBack(x, own, to) {
  if (!needsTurn(own, to) || !isNum(x)) return x;
  return r(to === 'Metric' ? +x * 9 / 5 + 32 : (+x - 32) * 5 / 9, KEEP);
}
export function dBack(x, own, to) {
  if (!needsTurn(own, to) || !isNum(x)) return x;
  return r(to === 'Metric' ? +x * 9 / 5 : +x * 5 / 9, KEEP);
}
export const showOf = (kind, v, own, to) => kind === 'diff' ? dShow(v, own, to) : tShow(v, own, to);
export const backOf = (kind, x, own, to) => kind === 'diff' ? dBack(x, own, to) : tBack(x, own, to);

// A box in a Properties dialog that holds a temperature: the number it shows (1 decimal when turned, so 65.5556 °C shows 150 °F), and
// what is saved from what was typed. A box left as it was shown saves the kept number exactly (no drift, Rule 2.59).
export function boxShow(kind, v, own, to) {
  if (!needsTurn(own, to) || !isNum(v)) return v;
  return r(showOf(kind, v, own, to), 1);
}
export function boxBack(kind, typed, shown, kept, own, to) {
  if (!needsTurn(own, to) || !isNum(typed)) return typed;
  if (isNum(kept) && isNum(shown) && +typed === +shown) return +kept;
  return backOf(kind, typed, own, to);
}
