// Fresh Start and Modified Fresh Start (Rule 9.8, OakBarn Brewery 2026-11-13). Every installer (Windows Setup, Mac, Linux,
// Raspberry Pi) runs this file when the user picks one of them, so all of them do exactly the same thing:
//
//   node lib/freshstart.js fresh    <panel folder> <Import folder>
//   node lib/freshstart.js modified <panel folder> <Import folder>
//
// fresh     A real Fresh Start, nothing saved ("A fresh start should be a real Fresh Start with nothing saved" ... "and the
//           Import"): config, data, processes, backups, the user's own pictures and sounds, and everything in the Import
//           folder are deleted for good. Only the program and the Skynet pictures and sounds stay (they are OakBarn Brewery's).
// modified  Deletes the Schemas, Processes, users and brew log. Kept: the Default settings (brewDefaults), the user's own
//           Mash / Boil / Water Profiles, Equipment Profiles and saved Recipes, the user's own pictures and sounds, the backups
//           folders and the Import folder.
//
// The Default settings live inside config/brewery.json, which goes. So they are written to config/kept_settings.json and the
// panel puts them into the new brewery.json on its next start (applyKeptSettings), then deletes that file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const KEPT_FILE = 'kept_settings.json';
// what a Modified Fresh Start keeps in config (the folders by name; brewery.json only for its Default settings)
export const MODIFIED_KEEP = ['profiles', 'recipes', 'equipment', 'backups'];

// The Skynet pictures and sounds, as paths inside media/ (lib/skynet_media.json, made by tools/skynet-media-list.js).
export function skynetMedia(file = path.join(HERE, 'skynet_media.json')) {
  try { return new Set(JSON.parse(fs.readFileSync(file, 'utf8')).files.map(f => f.toLowerCase())); } catch { return new Set(); }
}

const rm = (p, failed) => { try { fs.rmSync(p, { recursive: true, force: true }); } catch { failed.push(p); } };

// Deletes every file in media/ that is not a Skynet one, and the folders left empty that are not Skynet folders.
function removeUserMedia(mediaDir, skynet, failed, rel = '') {
  let n = 0, entries = [];
  try { entries = fs.readdirSync(path.join(mediaDir, rel), { withFileTypes: true }); } catch { return 0; }
  for (const e of entries) {
    const r = rel ? `${rel}/${e.name}` : e.name, full = path.join(mediaDir, r);
    if (e.isDirectory()) {
      n += removeUserMedia(mediaDir, skynet, failed, r);
      const isSkynetDir = [...skynet].some(f => f.startsWith(r.toLowerCase() + '/'));
      if (!isSkynetDir) { try { if (!fs.readdirSync(full).length) fs.rmdirSync(full); } catch { } }
    } else if (!skynet.has(r.toLowerCase())) { rm(full, failed); n++; }
  }
  return n;
}

export function freshStart(kind, root, importDir, { media = skynetMedia() } = {}) {
  if (kind !== 'fresh' && kind !== 'modified') throw new Error('Pick fresh or modified');
  const failed = [], done = [];
  const config = path.join(root, 'config');
  if (kind === 'modified') {
    // the Default settings out of brewery.json first
    let kept = null;
    try { const c = JSON.parse(fs.readFileSync(path.join(config, 'brewery.json'), 'utf8')); if (c.brewDefaults) kept = { brewDefaults: c.brewDefaults }; } catch { }
    let entries = []; try { entries = fs.readdirSync(config); } catch { }
    for (const name of entries) if (!MODIFIED_KEEP.includes(name) && name !== KEPT_FILE) rm(path.join(config, name), failed);
    if (kept) { fs.mkdirSync(config, { recursive: true }); fs.writeFileSync(path.join(config, KEPT_FILE), JSON.stringify(kept, null, 1)); done.push('Default settings kept'); }
    for (const d of ['data', 'processes', 'scripts']) rm(path.join(root, d), failed);
    done.push('Schemas, Processes, users and brew log deleted');
  } else {
    for (const d of ['config', 'data', 'processes', 'scripts', 'backups']) rm(path.join(root, d), failed);
    const n = removeUserMedia(path.join(root, 'media'), media, failed);
    done.push(`everything deleted (${n} of your own pictures and sounds)`);
    if (importDir && fs.existsSync(importDir)) {
      for (const name of fs.readdirSync(importDir)) rm(path.join(importDir, name), failed);
      done.push('Import folder emptied');
    }
  }
  return { done, failed };
}

// On start, after the sample layout is put in: the Default settings a Modified Fresh Start kept go back in. Returns true when it did.
export function applyKeptSettings(store) {
  const file = path.join(path.dirname(store.configPath), KEPT_FILE);
  if (!fs.existsSync(file)) return false;
  try {
    const kept = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (kept.brewDefaults) { store.config.brewDefaults = { ...(store.config.brewDefaults ?? {}), ...kept.brewDefaults }; store.writeConfig(); }
    fs.rmSync(file, { force: true });
    return true;
  } catch (e) { console.log('Kept Default settings: ' + e.message); return false; }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [kind, root, importDir] = process.argv.slice(2);
  try {
    const r = freshStart(kind, path.resolve(root), importDir ? path.resolve(importDir) : null);
    for (const d of r.done) console.log((kind === 'fresh' ? 'Start Fresh: ' : 'Modified Fresh Start: ') + d);
    if (r.failed.length) { console.log(`Could not delete (a program still has them open): ${r.failed.join(', ')}`); process.exit(2); }
  } catch (e) { console.log(e.message); process.exit(1); }
}
