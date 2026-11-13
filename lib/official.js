// Official Skynet (OakBarn Brewery, 2026-11-12: "can we set something so that the skynet code on ones sent from Skynet Official
// updates cannot be modified once on a Brain?", "WE still want it open source but maybe once on a user computer core code cannot be
// accessed", "Warn the end user is a good idea for non official updates"; Rule 9.14, Help 191).
//
// Every merge, GitHub writes skynet_files.json next to version.json (.github/workflows/panel-version.yml, tools/make-file-list.js):
// the fingerprint (SHA-256) of every core program file. On every start the panel:
//   1. fingerprints its own core files and compares them with that list: changed, missing and added files are named;
//   2. asks OakBarn Brewery's own GitHub (always oakbarn/Skynet_Brewery, never the repository version.json names) for the list of
//      that same version, so an edited list can't pass either. Without the internet it uses the list that came with it, and says so;
//   3. Official and unchanged: makes the core files Read-only, so an editor can't save over them by accident.
// Repair puts back the official file for every changed or missing one, straight from OakBarn Brewery's GitHub, checked against the
// official list first. The file it replaces and any added file are MOVED to backups/changed_files_<date>, never deleted (Rule #1).
// Your Schemas, settings, users, brew data, pictures, sounds, Processes and Help pages are not core files and are never checked or touched.
// Honest limit: Skynet is open source (MIT). Whoever is the administrator of a computer can change any file on it, this one too.
// This finds and reports changes; it can't make them impossible.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileStamp } from './filedate.js';

export const OFFICIAL_REPO = 'oakbarn/Skynet_Brewery';
export const LIST_FILE = 'skynet_files.json';
// The core: the program itself. help/ is not in it (Admins edit Help pages in the panel), nor are config, data, media, scripts,
// sample_schemas (the add-only Setups) or node_modules (made on the Brain by npm).
export const CORE = ['server.js', 'importer.js', 'package.json', 'lib', 'public', 'templates', 'firmware', 'install', 'samples'];
const SKIP_DIR = new Set(['node_modules', 'backups', '.git']);
const SKIP_FILE = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);
const RAW = 'https://raw.githubusercontent.com';

// A file's fingerprint. Text files are read without carriage returns, so a copy with Windows line ends still matches.
export function fingerprint(buf) {
  const text = !buf.subarray(0, 8000).includes(0);
  return crypto.createHash('sha256').update(text ? Buffer.from(buf.toString('latin1').replace(/\r/g, ''), 'latin1') : buf).digest('hex');
}

// every core file under root, as forward-slash paths
export function coreFiles(root) {
  const out = [];
  const walk = rel => {
    const full = path.join(root, rel);
    let st; try { st = fs.statSync(full); } catch { return; }
    if (st.isFile()) { if (!SKIP_FILE.has(path.basename(rel))) out.push(rel.split(path.sep).join('/')); return; }
    if (!st.isDirectory()) return;
    for (const e of fs.readdirSync(full)) if (!SKIP_DIR.has(e)) walk(path.join(rel, e));
  };
  for (const c of CORE) walk(c);
  return out.sort();
}

// { path: fingerprint } of the core files, for the list GitHub writes. files: only these (the files git knows), else all found.
export function makeList(root, files = coreFiles(root)) {
  const list = {};
  for (const f of files) {
    if (!CORE.some(c => f === c || f.startsWith(c + '/'))) continue;
    try { list[f] = fingerprint(fs.readFileSync(path.join(root, f))); } catch { /* not there */ }
  }
  return list;
}

const readJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const SAFE_VERSION = /^[\w.-]+$/;
const rawUrl = (version, file) => `${RAW}/${OFFICIAL_REPO}/${encodeURIComponent(version)}/${file.split('/').map(encodeURIComponent).join('/')}`;
const isOakBarn = v => String(v.owner ?? '').toLowerCase() === 'oakbarn' && String(v.repo ?? '').toLowerCase() === OFFICIAL_REPO.toLowerCase();

// the official list of this version from OakBarn Brewery's GitHub: { files } or { error }
async function onlineList(version, fetcher) {
  try {
    const res = await fetcher(rawUrl(version, LIST_FILE), { signal: AbortSignal.timeout(8000), cache: 'no-store' });
    if (res.status === 404) return { error: 'OakBarn Brewery\'s GitHub has no file list for this version' };
    if (!res.ok) return { error: `GitHub answered ${res.status}` };
    const j = JSON.parse(await res.text());
    return j?.files && typeof j.files === 'object' ? { files: j.files } : { error: 'the list on GitHub could not be read' };
  } catch (e) { return { error: e.name === 'TimeoutError' ? 'no answer from GitHub' : e.message }; }
}

// compare the files on the Brain with a list
export function compare(root, files) {
  const changed = [], missing = [];
  for (const [f, want] of Object.entries(files)) {
    let buf; try { buf = fs.readFileSync(path.join(root, f)); } catch { missing.push(f); continue; }
    if (fingerprint(buf) !== want) changed.push(f);
  }
  const added = coreFiles(root).filter(f => !(f in files));
  return { changed, missing, added };
}

// What this copy is. state: official (unchanged), changed (official version, files changed), unofficial (not an OakBarn Brewery
// update: someone else's copy, a pull request not merged yet, or copied by hand), unknown (no file list to check against).
// confirmed: the list came from OakBarn Brewery's GitHub this time (not only the one on the Brain).
export async function checkOfficial(root, { fetcher = globalThis.fetch, online = true } = {}) {
  const v = readJson(path.join(root, 'version.json')) ?? {};
  const version = SAFE_VERSION.test(v.version ?? '') ? v.version : '';
  const local = readJson(path.join(root, LIST_FILE))?.files ?? null;
  const base = { version, checked: new Date().toISOString(), changed: [], missing: [], added: [], confirmed: false };
  if (!version) return { ...base, state: 'unofficial', text: 'Not an Official Skynet update: this copy has no Panel version (it did not come from an OakBarn Brewery release).' };
  if (!isOakBarn(v)) return { ...base, state: 'unofficial', owner: String(v.owner ?? ''), text: `Not an Official Skynet update: this is ${v.owner ? v.owner + '\'s' : 'someone else\'s'} copy of Skynet, not one from OakBarn Brewery.` };
  let list = local, note = '';
  if (online && fetcher) {
    const r = await onlineList(version, fetcher);
    if (r.files) { list = r.files; base.confirmed = true; }
    else note = ` (Could not ask OakBarn Brewery's GitHub: ${r.error}. Checked against the list that came with it.)`;
  }
  if (!list) return { ...base, state: 'unknown', text: 'Can\'t tell if this is Official Skynet: it has no list of its files' + (note || ' and GitHub could not be asked.') };
  const diff = compare(root, list);
  const n = diff.changed.length + diff.missing.length + diff.added.length;
  if (!n) return { ...base, ...diff, state: 'official', text: `Official Skynet: every program file is the one OakBarn Brewery sent in ${version}.` + note };
  const parts = [diff.changed.length && `${diff.changed.length} changed`, diff.missing.length && `${diff.missing.length} missing`, diff.added.length && `${diff.added.length} added`].filter(Boolean).join(', ');
  return { ...base, ...diff, state: 'changed', text: `Changed: ${parts} program file${n === 1 ? '' : 's'} not the way OakBarn Brewery sent them in ${version}. This is not Official Skynet until it is repaired.` + note };
}

// Read-only core files (Rule 9.14). Not in a developer's copy (a .git folder): git and editors must be able to write there.
export const canLock = root => !fs.existsSync(path.join(root, '.git')) && process.env.SKYNET_NO_LOCK !== '1';
export function setReadOnly(root, files, on = true) {
  let n = 0;
  for (const f of files) {
    const full = path.join(root, f);
    try { const m = fs.statSync(full).mode & 0o777; fs.chmodSync(full, on ? m & ~0o222 : m | 0o200); n++; } catch { /* gone */ }
  }
  return n;
}

// Repair: the official file for every changed or missing one, the added ones moved aside. Needs the internet.
export async function repair(root, { fetcher = globalThis.fetch } = {}) {
  const v = readJson(path.join(root, 'version.json')) ?? {};
  if (!SAFE_VERSION.test(v.version ?? '') || !isOakBarn(v)) throw new Error('Only an Official Skynet version can be repaired. Install the latest Official Skynet from OakBarn Brewery\'s Releases page instead.');
  const r = await onlineList(v.version, fetcher);
  if (!r.files) throw new Error(`Repair needs OakBarn Brewery's GitHub (${r.error}). Or run the Setup (or installer) of this version again.`);
  const diff = compare(root, r.files);
  const backup = path.join('backups', `changed_files_${fileStamp()}`);
  const moveAside = f => {
    const to = path.join(root, backup, f);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    setReadOnly(root, [f], false);
    fs.renameSync(path.join(root, f), to);
  };
  const fixed = [], failed = [];
  for (const f of [...diff.changed, ...diff.missing]) {
    try {
      const res = await fetcher(rawUrl(v.version, f), { signal: AbortSignal.timeout(20000), cache: 'no-store' });
      if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (fingerprint(buf) !== r.files[f]) throw new Error('the download did not match the official list');
      if (fs.existsSync(path.join(root, f))) moveAside(f);
      fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true });
      fs.writeFileSync(path.join(root, f), buf);
      fixed.push(f);
    } catch (e) { failed.push(`${f}: ${e.message}`); }
  }
  const moved = [];
  for (const f of diff.added) { try { moveAside(f); moved.push(f); } catch (e) { failed.push(`${f}: ${e.message}`); } }
  if (canLock(root)) setReadOnly(root, Object.keys(r.files));
  return { fixed, moved, failed, backup: fixed.length || moved.length ? backup.split(path.sep).join('/') : '' };
}
