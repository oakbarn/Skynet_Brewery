// Move to a new Brain (Fritz, 2026-11-03, Rule 9.9): someone who starts with a Windows, Linux or Mac computer as the Brain
// can move everything to a Raspberry Pi later (or to another computer). It is two steps, both on ☰ Menu > Move Brain:
//   1. On the old Brain: "Make a Brain Move file" downloads one file (Skynet_Brain_Move_<date>.skynetmove) with everything that is yours: config (every Schema,
//      Equipment Profile, Recipe, Template, panel setting and each Schema's saved gGlobal values), data (logins, the recovery
//      code, saved values, the brew log database, messaging settings, the hidden-key secret), scripts (Processes) and media
//      (pictures and sounds). It also lists the USB ports the old Brain sees, with each board's serial number.
//      The file is locked with a Move password typed on both Brains (AES-256-GCM): it holds the hidden keys, which nobody
//      may see (Rule 3.10), the password hashes and the API key, so a copy left on a USB stick is no use to anyone.
//   2. On the new Brain (a fresh install): "Bring in a Brain Move file" checks the file, then the panel stops and, as it
//      starts again, moves its own config, data, scripts and media into backups/before_brain_move_<date> (nothing is
//      deleted) and puts the old Brain's in their place.
// Then "USB ports" on the same Menu tab changes each Interface's old port (COM3) to the new Brain's one (/dev/ttyACM0) in
// every Schema at once. A board whose serial number the old Brain saw is matched for you.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileStamp } from './filedate.js';
import { connOf, realConnOf } from '../public/links.js';

export const MOVE_MANIFEST = 'brain-move.json';
export const MOVE_DIRS = ['config', 'data', 'scripts', 'media'];
export const MAX_MOVE = 1024 * 1024 * 1024;       // 1 GB: far more than any panel so far (pictures are the big part)
// the Move file never carries these: sign-ins belong to the old Brain's browsers, the brew log goes as a clean copy
// (see brewlogCopy), and half-written temporary files are not real files
const SKIP = [/^data\/sessions\.json$/i, /^data\/brewlog\.db(-wal|-shm|-journal)?$/i, /(^|\/)\.[^/]*\.tmp$/i, /\.tmp$/i, /(^|\/)node_modules(\/|$)/i, /(^|\/)\.filemove-/];

// ---------------- a small .zip writer and reader (store and deflate, no ZIP64: up to 4 GB) ----------------
const dosTime = d => ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xffff;
const dosDate = d => (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff;

export function makeZip(entries) {
  const parts = [], central = []; let off = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name, 'utf8'), data = e.data, when = e.mtime ?? new Date();
    const packed = zlib.deflateRawSync(data), useDeflate = packed.length < data.length;
    const body = useDeflate ? packed : data, crc = zlib.crc32(data) >>> 0;
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6);   // UTF-8 names
    head.writeUInt16LE(useDeflate ? 8 : 0, 8); head.writeUInt16LE(dosTime(when), 10); head.writeUInt16LE(dosDate(when), 12);
    head.writeUInt32LE(crc, 14); head.writeUInt32LE(body.length, 18); head.writeUInt32LE(data.length, 22);
    head.writeUInt16LE(name.length, 26); head.writeUInt16LE(0, 28);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt16LE(useDeflate ? 8 : 0, 10); cen.writeUInt16LE(dosTime(when), 12); cen.writeUInt16LE(dosDate(when), 14);
    cen.writeUInt32LE(crc, 16); cen.writeUInt32LE(body.length, 20); cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(name.length, 28); cen.writeUInt32LE(off, 42);
    parts.push(head, name, body); central.push(cen, name);
    off += head.length + name.length + body.length;
    if (off > 0xffffffff) throw new Error('The Brain Move file would be larger than 4 GB');
  }
  const cdir = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cdir.length, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat([...parts, cdir, end]);
}

export function readZip(buf) {
  let e = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (buf.readUInt32LE(i) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error('This is not a .zip file');
  const count = buf.readUInt16LE(e + 10); let p = buf.readUInt32LE(e + 16);
  const out = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('The .zip file is damaged');
    const method = buf.readUInt16LE(p + 10), crc = buf.readUInt32LE(p + 16), size = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), at = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nlen);
    p += 46 + nlen + xlen + clen;
    if (name.endsWith('/')) continue;                        // a folder entry
    const start = at + 30 + buf.readUInt16LE(at + 26) + buf.readUInt16LE(at + 28), raw = buf.subarray(start, start + size);
    const data = method === 0 ? Buffer.from(raw) : method === 8 ? zlib.inflateRawSync(raw) : null;
    if (!data) throw new Error(`The .zip file packs "${name}" in a way Skynet can't open`);
    if ((zlib.crc32(data) >>> 0) !== crc) throw new Error(`The .zip file is damaged ("${name}")`);
    out.push({ name: name.replace(/\\/g, '/'), data });
  }
  return out;
}

// ---------------- the Move password lock ----------------
const MAGIC = Buffer.from('SKYNET-BRAIN-MOVE-1\n');
export const MOVE_EXT = '.skynetmove';
export const MIN_MOVE_PASSWORD = 6;
const keyFor = (password, salt) => crypto.scryptSync(String(password), salt, 32, { N: 16384, r: 8, p: 1 });
export function lock(zip, password) {
  if (String(password ?? '').length < MIN_MOVE_PASSWORD) throw new Error(`The Move password needs at least ${MIN_MOVE_PASSWORD} characters`);
  const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', keyFor(password, salt), iv);
  const body = Buffer.concat([c.update(zip), c.final()]);
  return Buffer.concat([MAGIC, salt, iv, c.getAuthTag(), body]);
}
export function unlock(buf, password) {
  if (buf.length < MAGIC.length + 44 || !buf.subarray(0, MAGIC.length).equals(MAGIC)) throw new Error('This is not a Skynet Brain Move file (made with ☰ Menu > Move Brain > Make a Brain Move file)');
  let at = MAGIC.length;
  const salt = buf.subarray(at, at += 16), iv = buf.subarray(at, at += 12), tag = buf.subarray(at, at += 16);
  const d = crypto.createDecipheriv('aes-256-gcm', keyFor(password, salt), iv); d.setAuthTag(tag);
  try { return Buffer.concat([d.update(buf.subarray(at)), d.final()]); }
  catch { throw new Error('Wrong Move password (or the file is damaged). Type the password used when the file was made.'); }
}

// ---------------- the USB Interfaces in a configuration ----------------
// a board on USB: connection serial (or a serial board switched to the simulator, which keeps its real connection in realConnection)
export const isUsbInterface = d => !!d && typeof d.port === 'string' && d.port.trim() !== '' && (connOf(d) === 'serial' || realConnOf(d) === 'serial');

// every USB Interface in the loaded configuration and in every Schema file: [{schema, interface, port}]
export function usbInterfaces(configDir, loaded = null) {
  const out = [], seen = new Set();
  const add = (cfg, schema) => { for (const d of cfg?.devices ?? []) if (isUsbInterface(d)) out.push({ schema, interface: d.name, port: d.port.trim() }); };
  const live = loaded ?? readJson(path.join(configDir, 'brewery.json'));
  if (live) { add(live, live.schema?.name || 'Loaded Schema'); if (live.schema?.id) seen.add(live.schema.id); }
  for (const f of schemaFiles(configDir)) {
    const id = path.basename(f, '.json'); if (seen.has(id)) continue;
    const s = readJson(f); if (s) add(s, s.name || id);
  }
  return out;
}
const readJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const schemaFiles = configDir => {
  const dir = path.join(configDir, 'schemas');
  try { return fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.endsWith('.state.json')).map(f => path.join(dir, f)); } catch { return []; }
};

// changes ports in one configuration object (map: old port -> new port). Returns how many Interfaces changed.
export function remapConfig(cfg, map) {
  let n = 0;
  for (const d of cfg?.devices ?? []) {
    if (!isUsbInterface(d)) continue;
    const to = map[d.port.trim()];
    if (to && to !== d.port) { d.port = to; n++; }
  }
  return n;
}
// changes ports in every Schema file except the loaded one (skipId), which the panel changes in memory and saves itself
export function remapSchemaFiles(configDir, map, skipId = null) {
  let n = 0;
  for (const f of schemaFiles(configDir)) {
    if (skipId && path.basename(f, '.json') === skipId) continue;
    const s = readJson(f); if (!s) continue;
    const c = remapConfig(s, map);
    if (c) { fs.writeFileSync(f, JSON.stringify(s, null, 2)); n += c; }
  }
  return n;
}

// a guess for each old port: the same port is still here, the same board by its serial number, or the only free port left
export function suggestPorts(oldPorts, oldSeen = [], nowPorts = []) {
  const here = new Set(nowPorts.map(p => p.path)), used = new Set(), out = {};
  const serialOf = p => oldSeen.find(x => x.path === p)?.serialNumber || '';
  for (const p of oldPorts) if (here.has(p)) { out[p] = p; used.add(p); }
  for (const p of oldPorts) {
    if (out[p]) continue;
    const sn = serialOf(p), m = sn && nowPorts.find(x => x.serialNumber === sn && !used.has(x.path));
    if (m) { out[p] = m.path; used.add(m.path); }
  }
  const left = oldPorts.filter(p => !out[p]), free = nowPorts.filter(x => !used.has(x.path));
  if (left.length === 1 && free.length === 1) out[left[0]] = free[0].path;
  for (const p of oldPorts) out[p] ??= '';
  return out;
}

// ---------------- step 1: the Move file, on the old Brain ----------------
function walk(dir, rel, out) {
  let list; try { list = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of list) {
    const full = path.join(dir, e.name), r = rel + '/' + e.name;
    if (SKIP.some(x => x.test(r))) continue;
    if (e.isDirectory()) walk(full, r, out);
    else if (e.isFile()) out.push({ full, name: r });
  }
}
// dirs: {config, data, scripts, media} folders on this Brain. brewlogCopy: a clean copy of the brew log database (or null).
export function makeMoveFile({ dirs, password, brewlogCopy = null, ports = [], version = '', from = '', mediaRoots = [] }) {
  const files = [];
  for (const k of MOVE_DIRS) if (dirs[k]) walk(dirs[k], k, files);
  const entries = files.map(f => { const st = fs.statSync(f.full); return { name: f.name, data: fs.readFileSync(f.full), mtime: st.mtime }; });
  if (brewlogCopy && fs.existsSync(brewlogCopy)) entries.push({ name: 'data/brewlog.db', data: fs.readFileSync(brewlogCopy) });
  const cfg = readJson(path.join(dirs.config, 'brewery.json'));
  const manifest = {
    skynetBrainMove: 1, made: new Date().toISOString(), from, platform: process.platform, version,
    usbPorts: ports,                                        // what the old Brain saw on its USB: path, maker, serial number
    interfaces: usbInterfaces(dirs.config, cfg),
    notMoved: mediaRoots.slice(1),                          // other media folders (Settings > Media folders) are not in the file
    files: entries.length, bytes: entries.reduce((a, e) => a + e.data.length, 0),
  };
  entries.unshift({ name: MOVE_MANIFEST, data: Buffer.from(JSON.stringify(manifest, null, 2)) });
  return { file: lock(makeZip(entries), password), manifest, fileName: `Skynet_Brain_Move_${fileStamp()}${MOVE_EXT}` };
}

// ---------------- step 2: bring it in, on the new Brain ----------------
const safeName = n => !n.startsWith('/') && !/^[a-z]:/i.test(n) && !n.split('/').some(x => x === '..' || x === '');
// reads and checks an unlocked Move file (the .zip inside). Returns {manifest, entries} or throws with a plain reason.
export function checkMoveFile(buf) {
  const entries = readZip(buf);
  const m = entries.find(e => e.name === MOVE_MANIFEST);
  if (!m) throw new Error('This is not a Skynet Brain Move file (made with ☰ Menu > Move Brain > Make a Brain Move file)');
  let manifest; try { manifest = JSON.parse(m.data.toString('utf8')); } catch { throw new Error('The Brain Move file is damaged'); }
  if (manifest.skynetBrainMove !== 1) throw new Error('This Brain Move file was made by a newer Skynet. Update this Brain first.');
  const files = entries.filter(e => e !== m);
  for (const e of files) {
    if (!safeName(e.name) || !MOVE_DIRS.includes(e.name.split('/')[0])) throw new Error(`The Brain Move file has a file Skynet won't copy: "${e.name}"`);
  }
  if (!files.some(e => e.name === 'config/brewery.json')) throw new Error('The Brain Move file has no config/brewery.json');
  return { manifest, entries: files };
}

// a checked Move file waits in brain_move/ (unlocked: it is on the Brain now) until the panel starts again
export const checkedFile = root => path.join(root, 'brain_move', 'checked.zip');
export const pendingFile = root => path.join(root, 'brain_move', 'pending.zip');
export function saveChecked(root, zip) {
  const got = checkMoveFile(zip), f = checkedFile(root);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f + '.part', zip); fs.renameSync(f + '.part', f);
  return got.manifest;
}
// "Move in now": the checked file is put in place the next time the panel starts
export function stageMove(root) {
  const f = checkedFile(root);
  if (!fs.existsSync(f)) throw new Error('Bring in a Brain Move file first');
  fs.renameSync(f, pendingFile(root));
}

// At start-up, before anything is read: puts a waiting Move file in place. dirs: {config, data, scripts, media}.
// Returns null (none waiting) or {lines, backup, manifest}. A damaged file is set aside and nothing is changed.
export function applyPendingMove(root, dirs) {
  const f = pendingFile(root);
  if (!fs.existsSync(f)) return null;
  const stamp = fileStamp(), lines = [];
  let got;
  try { got = checkMoveFile(fs.readFileSync(f)); }
  catch (e) {
    const bad = path.join(path.dirname(f), `damaged_${stamp}.zip`); fs.renameSync(f, bad);
    return { lines: [`Brain Move not done: ${e.message}. Nothing was changed (the file is kept as ${path.relative(root, bad)}).`], failed: true };
  }
  const backup = path.join(root, 'backups', `before_brain_move_${stamp}`);
  fs.mkdirSync(backup, { recursive: true });
  for (const k of MOVE_DIRS) {                                // this Brain's own folders are kept, never deleted
    if (fs.existsSync(dirs[k])) fs.renameSync(dirs[k], path.join(backup, k));
  }
  for (const e of got.entries) {
    const [top, ...rest] = e.name.split('/'), to = path.join(dirs[top], ...rest);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, e.data);
  }
  // media folders: the moved pictures are in this Brain's media folder; other folders the old Brain listed that are not
  // here are taken off the list (copy them over with File Move and add them again in Settings > Media folders)
  const cfgFile = path.join(dirs.config, 'brewery.json'), cfg = readJson(cfgFile);
  if (cfg) {
    const roots = (cfg.mediaRoots ?? ['./media']).slice(1).filter(r => { try { return fs.existsSync(path.resolve(dirs.config, '..', r)); } catch { return false; } });
    const gone = (cfg.mediaRoots ?? []).slice(1).filter(r => !roots.includes(r));
    cfg.mediaRoots = ['./media', ...roots];
    fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2));
    if (gone.length) lines.push(`Media folders not on this Brain were taken off Settings > Media folders: ${gone.join(', ')}. Copy them over with File Move if you need them.`);
  }
  const done = { ...got.manifest, movedIn: new Date().toISOString(), backup: path.relative(root, backup) };
  fs.writeFileSync(path.join(dirs.data, 'brain-move.json'), JSON.stringify(done, null, 2));
  fs.renameSync(f, path.join(backup, 'Brain_Move_file.zip'));
  lines.unshift(`Brain Move done: everything from ${got.manifest.from || 'the old Brain'} (${got.manifest.files} files) is now on this Brain. This Brain's own files are in ${path.relative(root, backup)}.`);
  if (got.manifest.interfaces?.length) lines.push('Check the USB ports: ☰ Menu > Move Brain > USB ports.');
  return { lines, backup, manifest: got.manifest };
}

// the last Move brought in (for the USB ports part), or null
export const lastMove = dataDir => readJson(path.join(dataDir, 'brain-move.json'));
