// .database and .API on every Device and Widget (Fritz, 2026-10-30).
//   .database: when its readings go to the brew database (lib/logger.js), { frequency, every, interval, at, process, attribute }
//   .API:      off (default), get (outside programs may read it) or getput (they may read and change it)
// The web API for outside programs (Home Assistant, a spreadsheet, a phone app ...):
//   GET  /api/items                 every item whose .API is on, with its main value
//   GET  /api/items/<name>          one item: its main value and every attribute
//   GET  /api/items/<name>/<attr>   one attribute
//   PUT  /api/items/<name>          its main value (or { "attr": value, ... }), only when .API is Get and Put
//   PUT  /api/items/<name>/<attr>   one attribute, only when .API is Get and Put
//   POST /api/items                 { name: value, ... } several main values at once
// Readings that come from a board (a probe's temperature, an input) and a Manual Valve Widget (only a click turns it,
// Rule 5.15) are never changed from outside. The name, Tab, Interface and port are settings, not attributes, so they never are.
import { plain } from './values.js';
import { cleanName, API_MODES, apiOf, mainProp, attrsOf, INPUT_PROPS } from './store.js';
import { LOG_MODES } from './logger.js';

// Only the known settings are kept, so nothing else can ride in with a layout save
export function cleanDatabase(el) {
  if (!el || typeof el !== 'object') return el;
  if (!API_MODES.includes(el.api) || el.api === 'off') delete el.api;
  const d = el.database;
  if (!d || typeof d !== 'object' || !LOG_MODES.includes(d.frequency) || d.frequency === 'none') { delete el.database; return el; }
  const out = { frequency: d.frequency };
  const every = Math.round(Number(d.every));
  if (Number.isFinite(every) && every >= 1) out.every = every;
  for (const k of ['interval', 'at', 'process']) if (typeof d[k] === 'string' && d[k].trim()) out[k] = d[k].trim().slice(0, 200);
  if (typeof d.attribute === 'string' && /^[A-Za-z_][A-Za-z0-9_]*$/.test(d.attribute.trim())) out.attribute = d.attribute.trim().toLowerCase();
  el.database = out;
  return el;
}

// Too many wrong API keys from one address in 10 minutes: that address is shut out for 15 minutes
export class ApiGuard {
  constructor({ tries = 10, windowMs = 600_000, blockMs = 900_000 } = {}) { this.o = { tries, windowMs, blockMs }; this.bad = new Map(); }
  wrong(ip, now = Date.now()) {
    const b = this.bad.get(ip) ?? { n: 0, since: now, until: 0 };
    if (now - b.since > this.o.windowMs) { b.n = 0; b.since = now; }
    if (++b.n >= this.o.tries) b.until = now + this.o.blockMs;
    this.bad.set(ip, b);
  }
  blocked(ip, now = Date.now()) {
    const b = this.bad.get(ip);
    if (!b) return false;
    if (b.until && now < b.until) return true;
    if (b.until || now - b.since > this.o.windowMs) this.bad.delete(ip);
    return false;
  }
}

const err = (status, msg) => Object.assign(new Error(msg), { status });
const reach = (store, name) => { const el = store.get(cleanName(name)); return el && apiOf(el) !== 'off' ? el : null; };
const mainOf = (store, el) => { const a = mainProp(el); if (!a) return undefined; try { return plain(store.getProp(el.name, a)); } catch { return undefined; } };

export const apiList = store => store.list().filter(e => apiOf(e) !== 'off').map(e => ({
  name: e.name, type: e.type, ...(e.kind ? { kind: e.kind } : {}), api: apiOf(e), value: mainOf(store, e), units: e.units ?? '',
}));

// One item (or one attribute of it), or null when outside programs may not read it
export function apiItem(store, name, attr) {
  const el = reach(store, name); if (!el) return null;
  if (attr) {
    try { return { name: el.name, attribute: attr, value: plain(store.getProp(el.name, attr)) }; } catch (e) { throw err(404, e.message); }
  }
  return { name: el.name, type: el.type, ...(el.kind ? { kind: el.kind } : {}), api: apiOf(el), value: mainOf(store, el), units: el.units ?? '', attributes: store.snapshotOne(el.name) };
}

// What an outside program may change: the main value and the item's own attributes, never a reading from a board or a picture path
function canSet(el, attr) {
  const a = String(attr).toLowerCase();
  if ((INPUT_PROPS[el.type] ?? []).includes(a) || (a === 'value' && (INPUT_PROPS[el.type] ?? []).includes(mainProp(el)))) return false;
  if (/^image|^imagepath_|^background$/.test(a)) return false;
  return a === 'value' || a === mainProp(el) || attrsOf(el).map(x => x.toLowerCase()).includes(a);
}

// Change it (value: one value, or { attr: value ... } when no attribute is named). Returns what it is now.
export function apiPut(store, name, attr, value) {
  const el = store.get(cleanName(name));
  if (!el || apiOf(el) === 'off') throw err(404, `No item named "${cleanName(name)}" that outside programs may reach`);
  if (apiOf(el) !== 'getput') throw err(403, `"${el.name}" is Get only: outside programs may read it but not change it (its .API setting)`);
  const pairs = !attr && value && typeof value === 'object' && !Array.isArray(value) ? Object.entries(value) : [[attr || mainProp(el) || 'value', value]];
  for (const [a] of pairs) if (!canSet(el, a)) throw err(403, `"${el.name}".${a} can't be changed from outside`);
  const out = {};
  for (const [a, v] of pairs) { store.setProp(el.name, a, v, 'api'); out[a] = plain(store.getProp(el.name, a)); }
  return { name: el.name, ...(pairs.length === 1 ? { attribute: pairs[0][0], value: Object.values(out)[0] } : { set: out }) };
}
