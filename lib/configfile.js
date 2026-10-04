// Config Editor (Settings > Config, admin only): the config file as text.
// Opening the editor copies the file to config/backups/ first. Saving checks the text, then loads it like a restart would.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Store } from './store.js';

const backupDir = store => path.join(path.dirname(store.configPath), 'backups');
const NAME = /^[\w.-]+\.json$/;

// Copy the config file as it is on disk. No new copy when the newest backup is already the same.
export function backupConfigFile(store, label = 'editor') {
  const dir = backupDir(store), text = fs.readFileSync(store.configPath, 'utf8');
  fs.mkdirSync(dir, { recursive: true });
  const newest = listBackups(store)[0];
  if (newest && fs.readFileSync(path.join(dir, newest.name), 'utf8') === text) return { name: newest.name, made: false };
  const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
  let name = `brewery-${stamp}-${label}.json`;
  for (let i = 2; fs.existsSync(path.join(dir, name)); i++) name = `brewery-${stamp}-${label}-${i}.json`;
  fs.writeFileSync(path.join(dir, name), text);
  return { name, made: true };
}

export function listBackups(store) {
  const dir = backupDir(store);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => NAME.test(f)).map(f => { const st = fs.statSync(path.join(dir, f)); return { name: f, size: st.size, time: st.mtimeMs }; })
    .sort((a, b) => b.time - a.time || b.name.localeCompare(a.name));
}

export function readBackup(store, name) {
  if (!NAME.test(name)) throw new Error('Bad backup name');
  const f = path.join(backupDir(store), name);
  if (!fs.existsSync(f)) throw new Error(`No backup "${name}"`);
  return fs.readFileSync(f, 'utf8');
}

// Problems with the text: { line, col, msg } or null when it is fine
export function checkConfigText(text, dataDir) {
  let cfg;
  try { cfg = JSON.parse(text); } catch (e) { return { ...jsonPlace(text, e.message), msg: 'Not valid JSON: ' + e.message.replace(/\s*\(line \d+ column \d+\)|\s*at position \d+.*$/, '') }; }
  if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) return { line: 1, col: 1, msg: 'The file must be one { ... } object' };
  for (const k of ['workspaces', 'elements', 'graphics', 'devices', 'autostart', 'mediaRoots', 'probes']) if (k in cfg && !Array.isArray(cfg[k])) return { ...keyPlace(text, k), msg: `"${k}" must be a list [ ... ]` };
  // load it the way the panel does at start-up, from a temporary copy
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'brewcfg-')), 'brewery.json');
  try {
    fs.writeFileSync(tmp, text);
    new Store(tmp, dataDir).load();
  } catch (e) {
    const name = /"([^"]+)"/.exec(e.message)?.[1];
    return { ...(name ? keyPlace(text, name, true) : { line: 1, col: 1 }), msg: e.message };
  } finally { fs.rmSync(path.dirname(tmp), { recursive: true, force: true }); }
  return null;
}

function lineCol(text, pos) { const before = text.slice(0, pos); return { line: before.split('\n').length, col: pos - before.lastIndexOf('\n') }; }
function jsonPlace(text, msg) {
  let m = /line (\d+) column (\d+)/.exec(msg); if (m) return { line: +m[1], col: +m[2] };
  m = /position (\d+)/.exec(msg); if (m) return lineCol(text, +m[1]);
  return { line: text.split('\n').length, col: 1 };      // "Unexpected end of JSON input"
}
function keyPlace(text, word, asValue) { const i = text.indexOf(asValue ? `"${word}"` : `"${word}":`); return i < 0 ? { line: 1, col: 1 } : lineCol(text, i); }

// Save new text as the config file and load it. Running scripts are stopped (their elements may have changed).
export function applyConfigText(text, { store, engine, hw, pictures, dataDir }) {
  const bad = checkConfigText(text, dataDir);
  if (bad) { const e = new Error(`Line ${bad.line}: ${bad.msg}`); e.problem = bad; throw e; }
  store.persistNow();                       // keep current values: load() reads them back
  engine.stopAll();
  const before = backupConfigFile(store, 'before-save');
  fs.writeFileSync(store.configPath, text);
  store.load();
  store.emit('config');
  hw.restart();
  pictures?.start();
  return { backup: before.name };
}
