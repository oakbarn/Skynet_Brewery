// Flow colors for Pipes and Hoses (Fritz, 2026-11-03, Rule 5.21, Help 116).
// Shared by the Brain (lib/engine.js, lib/store.js) and the browser (public/app.js).
//
// What colors the flow in a pipe or hose, first match wins:
//  1. flow that began at a Vessel whose Out flow color is not None: that color (it overrides all else)
//  2. flow from a Tap Water Valve: always Blue
//  3. the Tab's Flow Color (tab.flow_Color) when it is Tap, Strike, a plain color or RGB
//  4. the pipe's own Flow color (.flow_Color) when it is not None
//  5. the Tab's Flow Color when it is Mash, Boil, Whirlpool or Ferment (a pipe's own color overrides these)
//  6. everything None: the standard flow color (light blue), as before
// Each setting is stored as '' (None), one of the keys below, or '#rrggbb' (RGB, a color of your own).

// [key, name shown in the lists, color, a pipe's own color overrides it]
export const FLOW_COLORS = [
  ['tap', 'Tap (Blue)', '#2f80ed', false],
  ['strike', 'Strike (Red)', '#e0362c', false],
  ['mash', 'Mash (Brown)', '#8b5a2b', true],
  ['boil', 'Boil (Reddish Brown)', '#a0452a', true],
  ['whirlpool', 'Whirlpool (Brown)', '#8b5a2b', true],
  ['ferment', 'Ferment (Golden)', '#e5a823', true],
  ['red', 'Red', '#e0362c', false],
  ['yellow', 'Yellow', '#f4d03f', false],
  ['blue', 'Blue', '#2f80ed', false],
  ['green', 'Green', '#27ae60', false],
  ['brown', 'Brown', '#8b5a2b', false],
  ['orange', 'Orange', '#f39c12', false],
  ['purple', 'Purple', '#8e44ad', false],
  ['reddishbrown', 'Reddish Brown', '#a0452a', false],
  ['golden', 'Golden', '#e5a823', false],
];
export const FLOW_DEFAULT = '#4fb3ff';       // the standard flow color when every setting is None (the old default)
export const TAP_BLUE = '#2f80ed';            // flow from a Tap Water Valve (Fritz: always Blue)
const BY_KEY = new Map(FLOW_COLORS.map(c => [c[0], c]));
const hex2 = n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');

// Anything a person or a Process may write -> '' (None), a key, or '#rrggbb'. null when it is not a flow color.
// "Mash", "mash", "Mash (Brown)", "Reddish Brown", "Reddish_Brown", "None", "#a0452a", "RGB 160 69 42", "rgb(160,69,42)", "160,69,42".
export function flowKey(v) {
  if (v === undefined || v === null) return '';
  const s = String(v).trim();
  if (!s || /^none$/i.test(s)) return '';
  if (/^#[0-9a-f]{6}$/i.test(s)) return s.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(s)) return ('#' + [...s.slice(1)].map(c => c + c).join('')).toLowerCase();
  const rgb = /^(?:rgb)?\s*\(?\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)?$/i.exec(s);
  if (rgb) return '#' + rgb.slice(1).map(Number).map(hex2).join('');
  const k = s.replace(/\(.*\)/, '').replace(/[\s_-]+/g, '').toLowerCase();
  return BY_KEY.has(k) ? k : null;
}
// '' -> null (None); a key -> its color; '#rrggbb' -> itself
export function flowHex(k) {
  if (!k) return null;
  if (String(k).startsWith('#')) return k;
  return BY_KEY.get(k)?.[2] ?? null;
}
// what a Process reads back: None, Mash, Reddish Brown, or #a0452a for an RGB color
export function flowName(k) {
  if (!k) return 'None';
  if (String(k).startsWith('#')) return k;
  return (BY_KEY.get(k)?.[1] ?? k).replace(/\s*\(.*\)$/, '');
}
// does a pipe's own Flow color win over this Tab Flow Color? (None, Mash, Boil, Whirlpool, Ferment: yes)
export const pipeWins = tabKey => !tabKey || !!BY_KEY.get(tabKey)?.[3];

// The color a flowing pipe shows (the order at the top of this file)
export function pipeFlowColor({ vessel = '', tap = false, tab = '', pipe = '' }) {
  if (vessel) return flowHex(vessel);
  if (tap) return TAP_BLUE;
  if (tab && !pipeWins(tab)) return flowHex(tab);
  if (pipe) return flowHex(pipe);
  if (tab) return flowHex(tab);
  return FLOW_DEFAULT;
}

// Older Schemas (Rule 15.2): a pipe or hose's Flow color was '#4fb3ff' to start (it is None now) and could be any color.
// The old start color becomes None; any other color is kept as an RGB color. Returns how many were changed.
export function flowStandard(graphics = []) {
  let n = 0;
  for (const g of graphics) {
    if (g?.kind !== 'pipe' || !('flowColor' in g)) continue;
    const k = String(g.flowColor ?? '').toLowerCase() === FLOW_DEFAULT ? '' : flowKey(g.flowColor);
    if (k === g.flowColor) continue;
    if (k) g.flowColor = k; else delete g.flowColor;
    n++;
  }
  return n;
}
