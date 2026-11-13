// Fresh Start and Modified Fresh Start (Rule 9.8, OakBarn Brewery 2026-11-13). Every installer (Windows Setup, Mac, Linux,
// Raspberry Pi) runs this file when the user picks one of them, so all of them do exactly the same thing:
//
//   node lib/freshstart.js fresh    <panel folder> <Import folder>
//   node lib/freshstart.js modified <panel folder> <Import folder>
//
// fresh     A real Fresh Start, nothing saved ("A fresh start should be a real Fresh Start with nothing saved" ... "and the
//           Import"): config, data, processes, backups and everything in the Import
//           folder are deleted for good, and so is the whole media folder, Skynet pictures and sounds too (OakBarn Brewery,
//           2026-11-13: "the Fresh Install should also delete the Media files"). Only the program stays: run the Media Setup next.
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

const rm = (p, failed) => { try { fs.rmSync(p, { recursive: true, force: true }); } catch { failed.push(p); } };

export function freshStart(kind, root, importDir) {
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
    // the media folder too, Skynet pictures and sounds as well (OakBarn Brewery, 2026-11-13: "the Fresh Install should also delete the
    // Media files"): run the Media Setup after it. The panel puts its 3 fallback sounds back on its next start (lib/seed.js).
    for (const d of ['config', 'data', 'processes', 'scripts', 'backups', 'media']) rm(path.join(root, d), failed);
    done.push('everything deleted, the pictures and sounds too: run the Media Setup next');
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
