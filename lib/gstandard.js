// gGlobal (Fritz, 2026-10-30): the variable classes were vKonstant and vAPI (names vK..._ / vA..._), then gKonstant and gAPI
// (names gK..._ / gA..._, 2026-10-28). Now there is one class, gGlobal, with names gG..._. Everything is brought up to the
// latest standard, nothing old is kept working (Skynet Rule 15.2):
//   type vKonstant / vAPI / gKonstant / gAPI -> gGlobal
//   a gGlobal named vK..._ / vA..._ / gK..._ / gA..._ -> gG..._ (gKV_Strike -> gGV_Strike, gAS_Note -> gGS_Note; a taken name gets _2, _3 ...)
//   a gAPI's database trigger (log) becomes its .database setting, and it gets .API = Get and Put, so it keeps doing what it did
//   any other item's log setting becomes .database too
// The item keeps its hidden key, so it is the same item. Everything that points to the old name follows: settings of other
// items, pictures and pipes, the BeerXML mapping, saved values, the brew database and every Process.
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { renameInProcess, renameElementRefs, renameGraphicRefs } from './renames.js';

export const OLD_TYPES = { vKonstant: 'gGlobal', vAPI: 'gGlobal', gKonstant: 'gGlobal', gAPI: 'gGlobal' };
// only the kind prefixes (a name like gAmount_1 is left alone): '' graphic, S, L, V, T, DT, B, SW, PB, MB, List, Step
const OLD_NAME = /^[vg][AK](|S|L|V|T|DT|B|SW|PB|MB|List|Step)_/;
const newName = n => n.replace(OLD_NAME, 'gG$1_');
// a log setting { mode, script ... } -> a database setting { frequency, process ... }
export function toDatabase(lg) {
  if (!lg || typeof lg !== 'object') return undefined;
  const { mode, script, ...rest } = lg;
  if (!mode || mode === 'none') return undefined;
  return { frequency: mode === 'script' ? 'process' : mode, ...(script ? { process: script } : {}), ...rest };
}

// Changes one Schema (or configuration) in place. Returns the renames, old name -> new name.
export function toGStandard(c) {
  const map = new Map();
  const els = Array.isArray(c?.elements) ? c.elements : [];
  for (const el of els) {
    if (!el || typeof el !== 'object') continue;
    const was = el.type;
    if (OLD_TYPES[was]) el.type = OLD_TYPES[was];
    if ('log' in el) { const d = toDatabase(el.log); delete el.log; if (d && !el.database && was !== 'gKonstant' && was !== 'vKonstant') el.database = d; }
    if ((was === 'gAPI' || was === 'vAPI') && !el.api) el.api = 'getput';    // outside programs could read and change a gAPI
  }
  const taken = new Set(els.map(el => String(el?.name ?? '')));
  for (const el of els) {
    const n = String(el?.name ?? '');
    if (el?.type !== 'gGlobal' || !OLD_NAME.test(n)) continue;
    const base = newName(n);
    let to = base, k = 2;
    while (taken.has(to)) to = `${base}_${k++}`;
    taken.add(to); map.set(n, to);
  }
  if (!map.size) return map;
  for (const el of els) {
    if (map.has(el.name)) { if (el.label === el.name) el.label = map.get(el.name); el.name = map.get(el.name); }
    renameElementRefs(el, map);
  }
  for (const g of c.graphics ?? []) { renameGraphicRefs(g, map); renameElementRefs(g, map); }
  if (Array.isArray(c.logSets)) c.logSets = c.logSets.map(s => renameElementRefs(s, map));
  // the BeerXML mapping has exact names and name patterns like "gA_v_Hop{n}_Oz"
  if (c.beerxml) c.beerxml = JSON.parse(JSON.stringify(c.beerxml, (k, v) => typeof v === 'string' ? (map.get(v) ?? (OLD_NAME.test(v) ? newName(v) : v)) : v));
  return map;
}

// The Process line "log Name" is "send_db Name" now (Fritz, 2026-10-30): it sends the reading to the database at once
export const LOG_LINE = /^(\s*)log(?=[ \t])/gim;
export const toSendDb = text => text.replace(LOG_LINE, '$1send_db');

// Saved values (state.json, config/schemas/<id>.state.json) follow the new names
export function renameState(file, map) {
  if (!map.size || !fs.existsSync(file)) return;
  try {
    const v = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [from, to] of map) if (from in v) { v[to] = v[from]; delete v[from]; }
    fs.writeFileSync(file, JSON.stringify(v));
  } catch { /* values start fresh */ }
}

// The brew database keeps its history under the new name
export function renameInDatabase(dbFile, map) {
  if (!map.size || !fs.existsSync(dbFile)) return;
  const db = new DatabaseSync(dbFile);
  try {
    const up = db.prepare('UPDATE samples SET name = ? WHERE name = ?');
    for (const [from, to] of map) up.run(to, from);
  } catch { /* no samples table yet */ } finally { db.close(); }
}

// Every Process in the scripts folder (shared by every Schema), names and log lines; the old file is kept as .before-gglobal.bak
const BAK = '.before-gglobal.bak';
export function renameScriptsOnDisk(scriptsDir, map) {
  const changed = [];
  if (!fs.existsSync(scriptsDir)) return changed;
  for (const f of fs.readdirSync(scriptsDir).filter(f => f.endsWith('.txt'))) {
    const full = path.join(scriptsDir, f), text = fs.readFileSync(full, 'utf8'), out = toSendDb(map.size ? renameInProcess(text, map) : text);
    if (out !== text) { fs.copyFileSync(full, full + BAK); fs.writeFileSync(full, out); changed.push(f.slice(0, -4)); }
  }
  return changed;
}

// Start-up, once: the configuration, every Schema in config/schemas, their saved values, the brew database and the Processes.
// The old files are backed up first. Returns plain-English lines for the start-up note, or null when nothing was old.
export function gStandardOnDisk({ configPath, scriptsDir, dataDir }) {
  const files = [configPath];
  const sdir = path.join(path.dirname(configPath), 'schemas');
  if (fs.existsSync(sdir)) for (const f of fs.readdirSync(sdir)) if (f.endsWith('.json') && !f.endsWith('.state.json')) files.push(path.join(sdir, f));
  const all = new Map();
  let typed = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let c; try { c = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { continue; }
    const before = JSON.stringify(c), map = toGStandard(c);
    if (JSON.stringify(c) === before) continue;
    fs.copyFileSync(file, file.replace(/\.json$/, '') + BAK);
    fs.writeFileSync(file, JSON.stringify(c, null, 2));
    typed++;
    if (file === configPath) renameState(path.join(dataDir, 'state.json'), map);
    else renameState(file.replace(/\.json$/, '.state.json'), map);
    for (const [a, b] of map) if (!all.has(a)) all.set(a, b);
  }
  const changed = renameScriptsOnDisk(scriptsDir, all);      // log lines become send_db even when no Schema was old
  if (!typed && !changed.length) return null;
  renameInDatabase(path.join(dataDir, 'brewlog.db'), all);
  const lines = typed ? [`gKonstant and gAPI are now one class, gGlobal (${typed} Schema file(s) updated).`] : [];
  if (all.size) lines.push(`Renamed to the gG names: ${[...all].slice(0, 6).map(([a, b]) => `${a} -> ${b}`).join(', ')}${all.size > 6 ? ' ...' : ''}`);
  if (changed.length) lines.push(`Processes updated for the new names and send_db: ${changed.join(', ')} (old copies saved as ${BAK}).`);
  return { map: all, lines };
}
