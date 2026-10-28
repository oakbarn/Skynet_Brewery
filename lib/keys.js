// Hidden keys (Fritz, 2026-10-27). Every item with a name (Device, Widget, variable, Text, IP, pipe, vessel, fitting, Tab,
// Interface, Process, Template) gets a meaningless key when it is first built. The key never changes, is never shown on
// any screen, can't be typed in a Process, and never leaves the Brain:
//   - the Schema files on the Brain keep it as _key;
//   - the browser gets a stand-in (_ref) made from the key with a secret only the Brain knows. The stand-in is no use
//     anywhere else: it is only how the browser says "this is the same item" when the layout is saved;
//   - a key or stand-in sent in by a browser or an API call is thrown away, so nobody can pick or fake a key.
// Names are what people see and type. The key is how the panel knows an item was renamed (not deleted and made again),
// so every Process follows the new name (lib/renames.js), and how a clone knows which item it was cloned from (_from).
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const KEY = '_key';
export const REF = '_ref';
export const FROM = '_from';
export const OF = '_of';           // a Cloned Device's parent's key (lib/clones.js)
// the lists of a Schema whose items have names
export const KEYED = ['elements', 'graphics', 'devices', 'workspaces'];

export const newKey = () => 'k' + crypto.randomBytes(8).toString('hex');

let secret = crypto.randomBytes(32);
// The stand-in secret is kept in data/, so a browser that was open when the panel restarted still saves cleanly.
export function useKeySecret(dataDir) {
  const f = path.join(dataDir, 'key-secret');
  try { const s = fs.readFileSync(f); if (s.length >= 32) { secret = s; return; } } catch { /* first start */ }
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(f, secret, { mode: 0o600 });
}
export const refOf = key => crypto.createHmac('sha256', secret).update(String(key)).digest('base64url').slice(0, 16);

// Every named item without a key (an old Schema, a new item, a copy that brought another item's key along) gets one.
// Returns how many were added.
export function addKeys(c) {
  if (!c || typeof c !== 'object') return 0;
  let added = 0;
  const seen = new Set();
  for (const list of KEYED) for (const it of Array.isArray(c[list]) ? c[list] : []) {
    if (!it || typeof it !== 'object') continue;
    if (typeof it[KEY] !== 'string' || !it[KEY] || seen.has(it[KEY])) { it[KEY] = newKey(); added++; }
    seen.add(it[KEY]);
  }
  return added;
}

// JSON.stringify replacer for everything the Brain sends out: _key becomes its stand-in, _from is left out
export function keyReplacer(k, v) {
  if (v && typeof v === 'object' && !Array.isArray(v) && (KEY in v || FROM in v || OF in v)) {
    const { [KEY]: key, [FROM]: from, [OF]: of, ...rest } = v;
    return typeof key === 'string' ? { ...rest, [REF]: refOf(key) } : rest;
  }
  return v;
}

// Takes every _key and _from (and _ref, unless keepRefs) out of what came in from outside
export function dropKeys(o, keepRefs = false) {
  if (Array.isArray(o)) { for (const x of o) dropKeys(x, keepRefs); return o; }
  if (o && typeof o === 'object') {
    delete o[KEY]; delete o[FROM]; delete o[OF]; if (!keepRefs) delete o[REF];
    for (const v of Object.values(o)) if (v && typeof v === 'object') dropKeys(v, keepRefs);
  }
  return o;
}

// The key text out of a Schema file shown in the Config Editor (and back in when it is saved: same list, same name)
export const stripKeysText = text => JSON.stringify(JSON.parse(text), (k, v) => (k === KEY || k === FROM || k === OF ? undefined : v), 2);
export function keepKeysByName(cfg, current) {
  for (const list of KEYED) {
    const was = new Map((current?.[list] ?? []).filter(x => x?.[KEY] && x.name).map(x => [x.name, x]));
    for (const it of Array.isArray(cfg?.[list]) ? cfg[list] : []) {
      const old = it && was.get(it.name);
      if (old) { it[KEY] = old[KEY]; if (old[FROM]) it[FROM] = old[FROM]; if (old[OF]) it[OF] = old[OF]; was.delete(it.name); }
    }
  }
  return cfg;
}

// A list sent back by the browser (items carry _ref) gets the keys of the items they stand for. When two items carry the
// same stand-in (one was copied), the one that still has the item's name keeps the key, else the first one; the other is
// a clone: it gets a new key and remembers where it came from (_from). Items with no stand-in are new and get new keys.
export function claimKeys(incoming, current) {
  if (!Array.isArray(incoming)) return incoming;
  const byRef = new Map((current ?? []).filter(x => x?.[KEY]).map(x => [refOf(x[KEY]), x]));
  const claimed = new Set();
  for (const sameName of [true, false]) for (const it of incoming) {
    if (!it || typeof it !== 'object' || it[KEY]) continue;
    const old = byRef.get(it[REF]);
    if (!old || claimed.has(old[KEY]) || (sameName && it.name !== old.name)) continue;
    it[KEY] = old[KEY]; claimed.add(old[KEY]);
    if (old[FROM]) it[FROM] = old[FROM];
    if (old[OF]) it[OF] = old[OF];
  }
  for (const it of incoming) {
    if (!it || typeof it !== 'object') continue;
    if (!it[KEY]) { const src = byRef.get(it[REF]); it[KEY] = newKey(); if (src) it[FROM] = src[KEY]; }
    delete it[REF];
  }
  return incoming;
}

// old name -> new name for every item whose key is in both lists under another name
export function keyRenames(before, after) {
  const was = new Map((before ?? []).filter(x => x?.[KEY]).map(x => [x[KEY], x.name]));
  const out = new Map();
  for (const it of after ?? []) {
    const old = it?.[KEY] && was.get(it[KEY]);
    if (old && it.name && old !== it.name) out.set(old, it.name);
  }
  return out;
}

// Clones follow their first item (Fritz, 2026-10-27): when an item is renamed, every clone of it whose name holds the old
// name gets the new name in that place (Pump_A_copy -> Pump_Main_copy). A clone renamed in the same save, or whose new
// name is taken, is left alone. Returns the clone renames (old -> new); the items are changed in place.
export function followClones(items, renames, taken = new Set()) {
  const out = new Map(), byKey = new Map(items.filter(x => x?.[KEY]).map(x => [x[KEY], x]));
  const names = new Set([...taken, ...items.map(x => x?.name).filter(Boolean)]);
  const renamedTo = new Set(renames.values());
  for (const it of items) {
    const src = it?.[FROM] && byKey.get(it[FROM]);
    if (!src || !it.name || renamedTo.has(it.name)) continue;
    const old = [...renames].find(([, to]) => to === src.name)?.[0];
    if (!old || !it.name.includes(old)) continue;
    const name = it.name.replace(old, src.name);
    if (name === it.name || names.has(name)) continue;
    names.delete(it.name); names.add(name);
    out.set(it.name, name); it.name = name;
  }
  return out;
}
