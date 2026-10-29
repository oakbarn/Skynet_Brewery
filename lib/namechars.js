// Device names can't have < > : " / \ | ? * in them any more (Fritz, 2026-10-29), the same as file names (public/names.js).
// Everything is brought up to the latest standard (Skynet Rule 15.2): an older name with one of them gets a ~ for each,
// the same as a Suggested Device name does with its Label (Hot/Cold -> Hot~Cold; a taken name gets _2, _3 ...).
// Devices, Widgets, the named things on a Tab (Texts, pipes, vessels ...), Interfaces and Tabs are changed (every name is
// treated the same: Fritz, 2026-10-29, Skynet Rule 3.11; Template names are only for picking a Template and are left alone). The item keeps its
// hidden key, so it is the same item, and the screen still shows the old name as its Label. Everything that points to the old
// name follows: settings of other items, pictures and pipes, the BeerXML mapping, saved values, the brew database and every
// Process (where such a name could only be written in quotes: "Hot/Cold".visible -> "Hot~Cold".visible).
import fs from 'node:fs';
import path from 'node:path';
import { BAD_NAME_CHARS } from '../public/names.js';
import { renameElementRefs, renameGraphicRefs } from './renames.js';
import { renameState, renameInDatabase } from './gstandard.js';

const BAD_ALL = new RegExp(BAD_NAME_CHARS.source, 'g');
export const safeName = n => String(n ?? '').replace(BAD_ALL, '~');

// "old name" in quotes -> "new name" in a Process (a name with one of these characters only ever works in quotes)
export function renameQuoted(text, map) {
  if (!map.size) return text;
  return text.replace(/"([^"\n]*)"/g, (m, n) => map.has(n) ? `"${map.get(n)}"` : m);
}

// Changes one Schema (or configuration) in place. Returns the renames, old name -> new name.
export function toSafeNames(c) {
  const map = new Map();
  const els = Array.isArray(c?.elements) ? c.elements : [];
  const gfx = (Array.isArray(c?.graphics) ? c.graphics : []).filter(g => g && typeof g === 'object');
  const ifaces = (Array.isArray(c?.devices) ? c.devices : []).filter(d => d && typeof d === 'object');
  const tabs = (Array.isArray(c?.workspaces) ? c.workspaces : []).filter(w => w && typeof w === 'object');
  const items = [...els, ...gfx.filter(g => !g.of)];       // a Clone's name follows its parent by itself (lib/clones.js)
  const taken = new Set([...items, ...ifaces].map(x => String(x?.name ?? '')));
  const fix = list => {
    const out = new Map();
    for (const x of list) {
      const n = String(x?.name ?? '');
      if (!n || !BAD_NAME_CHARS.test(n) || out.has(n)) continue;
      const base = safeName(n);
      let to = base, k = 2;
      while (taken.has(to)) to = `${base}_${k++}`;
      taken.add(to); out.set(n, to);
    }
    return out;
  };
  const named = fix(items), iface = fix(ifaces);
  const tabTaken = new Set(tabs.map(w => String(w.name ?? '')));
  const tab = new Map();
  for (const w of tabs) {
    const n = String(w.name ?? '');
    if (!n || !BAD_NAME_CHARS.test(n) || tab.has(n)) continue;
    let to = safeName(n), k = 2;
    while (tabTaken.has(to)) to = `${safeName(n)}_${k++}`;
    tabTaken.add(to); tab.set(n, to);
  }
  // a Tab is pointed to by name from everything on it (.workspace)
  for (const w of tabs) if (tab.has(w.name)) w.name = tab.get(w.name);
  for (const x of [...els, ...gfx]) if (typeof x.workspace === 'string' && tab.has(x.workspace)) x.workspace = tab.get(x.workspace);
  for (const [a, b] of tab) map.set(a, b);
  if (!named.size && !iface.size) return map;
  for (const x of items) if (named.has(x.name)) { if (x.kind !== 'text' && (x.label == null || x.label === '')) x.label = x.name; x.name = named.get(x.name); }
  for (const d of ifaces) if (iface.has(d.name)) d.name = iface.get(d.name);
  // an Interface is pointed to by name from its Devices (el.device)
  for (const el of els) if (typeof el?.device === 'string' && iface.has(el.device)) el.device = iface.get(el.device);
  for (const [a, b] of named) map.set(a, b);
  if (named.size) {
    for (const el of els) renameElementRefs(el, named);
    for (const g of gfx) { renameGraphicRefs(g, named); renameElementRefs(g, named); }
    if (Array.isArray(c.logSets)) c.logSets = c.logSets.map(s => renameElementRefs(s, named));
    if (c.beerxml) c.beerxml = renameElementRefs(c.beerxml, named, false);
    if (Array.isArray(c.autostart)) c.autostart = c.autostart.map(n => named.get(n) ?? n);
  }
  return map;
}

// Every Process in the scripts folder (shared by every Schema); the old file is kept as .before-safe-names.bak
export function renameQuotedOnDisk(scriptsDir, map) {
  const changed = [];
  if (!map.size || !fs.existsSync(scriptsDir)) return changed;
  for (const f of fs.readdirSync(scriptsDir).filter(f => f.endsWith('.txt'))) {
    const full = path.join(scriptsDir, f), text = fs.readFileSync(full, 'utf8'), out = renameQuoted(text, map);
    if (out !== text) { fs.copyFileSync(full, full + '.before-safe-names.bak'); fs.writeFileSync(full, out); changed.push(f.slice(0, -4)); }
  }
  return changed;
}

// Start-up, once: the configuration, every Schema in config/schemas, their saved values, the brew database and the Processes.
// The old files are backed up first. Returns plain-English lines for the start-up note, or null when nothing needed it.
export function safeNamesOnDisk({ configPath, scriptsDir, dataDir }) {
  const files = [configPath];
  const sdir = path.join(path.dirname(configPath), 'schemas');
  if (fs.existsSync(sdir)) for (const f of fs.readdirSync(sdir)) if (f.endsWith('.json') && !f.endsWith('.state.json')) files.push(path.join(sdir, f));
  const all = new Map();
  let n = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let c; try { c = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { continue; }
    const before = JSON.stringify(c), map = toSafeNames(c);
    if (JSON.stringify(c) === before) continue;
    fs.copyFileSync(file, file.replace(/\.json$/, '') + '.before-safe-names.bak');
    fs.writeFileSync(file, JSON.stringify(c, null, 2));
    n++;
    if (file === configPath) renameState(path.join(dataDir, 'state.json'), map);
    else renameState(file.replace(/\.json$/, '.state.json'), map);
    for (const [a, b] of map) if (!all.has(a)) all.set(a, b);
  }
  if (!n) return null;
  renameInDatabase(path.join(dataDir, 'brewlog.db'), all);
  const changed = renameQuotedOnDisk(scriptsDir, all);
  const lines = [`Names can't have < > : " / \\ | ? * any more: each one became a ~ (${n} Schema file(s) updated; the screen still shows the old name).`];
  if (all.size) lines.push(`Renamed: ${[...all].slice(0, 6).map(([a, b]) => `${a} -> ${b}`).join(', ')}${all.size > 6 ? ' ...' : ''}`);
  if (changed.length) lines.push(`Processes updated for the new names: ${changed.join(', ')} (old copies saved as .before-safe-names.bak).`);
  return { map: all, lines };
}
