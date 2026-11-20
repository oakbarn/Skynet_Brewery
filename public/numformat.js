// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Value Widget Formats (OakBarn Brewery, 2026-11-20, Panel Update 8, item 7: "On Value Widgets, add Fixed which brings up a spaces field
// with 1 as default plus these": Number, Percent, Scientific, Accounting, Financial, Currency, Currency rounded; Rule 1.23, Help 244).
// How a Value Widget shows its number. The Decimals ("spaces") work for every Format except Currency rounded, which has none.
// A Process picks one with .format (wgt_VAL_Strike_BH.format = "Currency"); "" puts back its Properties' pick.
// Shared by the Brain (lib/store.js) and the panel (public/app.js).

export const NUM_FORMATS = [
  ['fixed', 'Fixed'], ['number', 'Number'], ['percent', 'Percent'], ['scientific', 'Scientific'],
  ['accounting', 'Accounting'], ['financial', 'Financial'], ['currency', 'Currency'], ['currencyRounded', 'Currency rounded'],
];
export const NUM_FORMAT_DEFAULT = 'fixed';
export const FIXED_PLACES_DEFAULT = 1;          // "with 1 as default"
export const CURRENCY_SIGN_DEFAULT = '$';

// its key from a key or its words, any case ("Currency rounded", "currencyrounded"); '' stays ''; null = not a Format
export function numFormatKey(v) {
  const t = String(v ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');
  if (!t) return '';
  const hit = NUM_FORMATS.find(([k, w]) => k.toLowerCase() === t || w.toLowerCase().replace(/\s+/g, '') === t);
  return hit ? hit[0] : null;
}
export const numFormatWord = k => NUM_FORMATS.find(([x]) => x === k)?.[1] ?? '';

const places = p => {
  const n = p === '' || p === null || p === undefined ? NaN : Math.round(Number(p));
  return Number.isFinite(n) ? Math.min(12, Math.max(0, n)) : null;
};
// 1234.5 with 2 places -> "1,234.50"
const grouped = (x, d) => x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: true });

// The number as its Format shows it. fmt: a key from NUM_FORMATS ('' = the older plain way: its Decimals when set, else as it is);
// p: its Decimals; sign: the Currency sign ($ to start).
export function formatNumber(v, fmt, p, sign = CURRENCY_SIGN_DEFAULT) {
  const x = typeof v === 'number' ? v : Number(v);
  if (v === null || v === undefined || v === '' || !Number.isFinite(x)) return v === null || v === undefined ? '' : String(v);
  const k = numFormatKey(fmt), pd = places(p), cs = String(sign ?? CURRENCY_SIGN_DEFAULT);
  if (!k) return pd === null ? String(x) : x.toFixed(pd);
  const d = pd ?? FIXED_PLACES_DEFAULT, a = Math.abs(x), neg = x < 0 && Number(a.toFixed(k === 'currencyRounded' ? 0 : d)) !== 0;
  switch (k) {
    case 'fixed': return x.toFixed(d);
    case 'number': return (neg ? '-' : '') + grouped(a, d);
    case 'percent': return x.toFixed(d) + '%';         // the number as it is, with a % (a Duty cycle of 10.12 shows 10.12%)
    case 'scientific': { const [m, e] = x.toExponential(d).toUpperCase().split('E'); const n = Number(e); return `${m}E${n < 0 ? '-' : '+'}${String(Math.abs(n)).padStart(2, '0')}`; }
    case 'accounting': return `${cs} ${neg ? `(${grouped(a, d)})` : grouped(a, d)}`;
    case 'financial': return neg ? `(${grouped(a, d)})` : grouped(a, d);
    case 'currency': return (neg ? '-' : '') + cs + grouped(a, d);
    case 'currencyRounded': return (neg ? '-' : '') + cs + grouped(Math.round(a), 0);
  }
  return String(x);
}
