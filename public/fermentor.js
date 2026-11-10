// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Fermentor Control (OakBarn Brewery, 2026-11-10: "an integrated Fermentor control that heats and Cools with Hysteresis"; "Has three
// integrated devices 1. Heater 2. Cooling 3. Temperature Probe", Rule 6.30, Help 182). It is built into a Fermentor Vessel Device with its
// Heat (a heat mat, heat wrap, ceramic heat emitter or lamp), its Cooling (a freezer or fridge, a glycol pump or a glycol valve) and the
// Temperature Probe that reads the beer. One Setpoint holds the beer with Hysteresis on both sides:
// - Heat comes on when the beer is the Heat On offset below the Setpoint, Cooling when it is the Cool On offset above; both stop at the
//   Setpoint (a little before it with Predictive Hysteresis, Rule 6.23).
// - Heat and Cooling are NEVER On together, and one must have been Off for the Changeover wait before the other may start, so they
//   never fight ("flashing a Light Bulb is not good either"; a freezer must not short cycle).
// - Each side has an On delay (the shortest time Off before it may start again) and a Shortest run (once on, it stays on at least this long).
// - Fermentation makes heat at the start and needs heat at the end (OakBarn Brewery, 2026-11-10: "Only in the beginning"): both sides are equal.
// Used by the Brain (lib/control.js, lib/store.js), the Panel and the BruControl Importer, so all three mean the same thing.

export const FERM_TYPE = 'fermentor';
export const isFermentor = el => el?.type === FERM_TYPE;
// [key, the word shown and read back]
export const FERM_MODES = [['auto', 'Heat & Cool'], ['heat', 'Heat only'], ['cool', 'Cool only']];
const squash = s => String(s ?? '').toLowerCase().replace(/[\s_&/\-]+/g, '').replace(/and/g, '');
export function fermModeKey(v) {
  const s = squash(v);
  if (!s) return null;
  for (const [k, w] of FERM_MODES) if (squash(k) === s || squash(w) === s) return k;
  return { heatcool: 'auto', both: 'auto', heatonly: 'heat', coolonly: 'cool', cooling: 'cool', heating: 'heat' }[s] ?? null;
}
export const fermModeWord = k => FERM_MODES.find(m => m[0] === k)?.[1] ?? FERM_MODES[0][1];
export const fermModeWords = () => FERM_MODES.map(m => m[1]).join(', ');

// [runtime name (a Process reads and sets it), Properties key, label, starting value]. Times are in seconds.
export const FERM_SETTINGS = [
  ['target', 'target', 'Setpoint', 66],
  ['heatoffset', 'heatOffset', 'Heat Offset (-)', 1],
  ['cooloffset', 'coolOffset', 'Cool Offset (+)', 1],
  ['changeover', 'changeover', 'Changeover wait (s): one side Off this long before the other may start', 300],
  ['heatdelay', 'heatDelay', 'Heat On delay (s): the shortest time Off before it starts again', 60],
  ['heatminrun', 'heatMinRun', 'Heat shortest run (s): once on, it stays on at least this long', 60],
  ['cooldelay', 'coolDelay', 'Cool On delay (s): protects a compressor from short starts', 300],
  ['coolminrun', 'coolMinRun', 'Cool shortest run (s): once on, it stays on at least this long', 120],
];
export const fermDefault = p => FERM_SETTINGS.find(s => s[0] === p)?.[3] ?? 0;
// what it is doing now (.doing, read only)
export const FERM_DOING = { off: 'Off', idle: 'Idle', heating: 'Heating', cooling: 'Cooling', waitHeat: 'Waiting to heat', waitCool: 'Waiting to cool', noReading: 'No reading' };

// The Heat may be a Heating Element (it is run in Direct: the Fermentor turns it on and off), a Light or a plain Digital Out;
// the Cooling a plain Digital Out (a freezer or fridge on a relay), a Pump (a glycol pump) or a Motorized valve (a glycol valve).
export const fermHeatFits = e => e?.type === 'digitalOut' && !['pump', 'valve'].includes(e.subtype);
export const fermCoolFits = e => e?.type === 'digitalOut' && e.subtype !== 'element' && !(e.subtype === 'valve' && e.valveType === 'manual');

// the plain problems with a Fermentor Control's settings, or [] when it can be saved
export function fermProblems(el, has = () => true) {
  const out = [], n = k => Number(el?.[k] ?? fermDefault(FERM_SETTINGS.find(s => s[1] === k)?.[0]));
  if (!el?.input) out.push('Pick its Temperature Probe (the one that reads the beer).');
  if (!el?.heat && !el?.cool) out.push('Pick its Heat, its Cooling, or both.');
  if (el?.heat && el.heat === el.cool) out.push('The Heat and the Cooling must be two different Devices.');
  for (const k of ['heat', 'cool', 'input']) if (el?.[k] && !has(el[k])) out.push(`${el[k]} is not a Device in this Schema.`);
  if (el?.heat && !(n('heatOffset') > 0)) out.push('The Heat Offset (-) must be below 0 (for example -1).');
  if (el?.cool && !(n('coolOffset') > 0)) out.push('The Cool Offset (+) must be more than 0.');
  for (const [, k, label] of FERM_SETTINGS.slice(3)) if (!(n(k) >= 0)) out.push(`${label.replace(/ \(.*/, '')} must be 0 or more.`);
  return out;
}
