// Media page: add, list, rename and delete picture and sound files in the media folders from any browser.
// Every path is checked to stay inside one of the media folders (Settings > Media folders).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { tracedFrom } from './vectorize.js';

export const PICTURE = /\.(png|jpe?g|gif|svg|webp|bmp|ico)$/i;
export const SOUND = /\.(wav|mp3|ogg|m4a)$/i;
const ALLOWED = f => PICTURE.test(f) || SOUND.test(f);
export const MAX_UPLOAD = 300 * 1024 * 1024;

export class MediaFiles {
  constructor(roots) { this.roots = roots; }     // roots(): absolute media folders

  // Absolute path for (root number, path inside it); throws if it would leave the folder.
  resolve(root, rel = '') {
    const r = this.roots()[Number(root) || 0];
    if (!r) throw new Error('No such media folder');
    const parts = String(rel).replace(/\\/g, '/').split('/').filter(p => p && p !== '.');
    if (parts.some(p => p === '..' || p.startsWith('.'))) throw new Error('Names cannot start with a dot');
    const full = path.join(r, ...parts);
    if (full !== r && !full.startsWith(r + path.sep)) throw new Error('That path is outside the media folder');
    return full;
  }
  // The path to type into an element's picture / sound field.
  usePath(root, rel) { return Number(root) ? path.join(this.roots()[root], rel) : rel.replace(/\\/g, '/'); }

  list(root, dir) {
    const full = this.resolve(root, dir);
    const roots = this.roots().map((r, i) => ({ index: i, path: r, exists: fs.existsSync(r) }));
    if (!fs.existsSync(full)) return { roots, root: Number(root) || 0, dir, folders: [], files: [] };
    const folders = [], files = [];
    for (const e of fs.readdirSync(full, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      if (e.isDirectory()) { folders.push(e.name); continue; }
      if (!e.isFile() || !ALLOWED(e.name)) continue;
      if (/\.svg$/i.test(e.name) && tracedFrom(path.join(full, e.name))) continue;   // automatic SVG copies are shown in Settings > Pictures
      const st = fs.statSync(path.join(full, e.name)), rel = dir ? `${dir}/${e.name}` : e.name;
      files.push({ name: e.name, path: rel, use: this.usePath(root, rel), size: st.size, modified: st.mtimeMs, kind: SOUND.test(e.name) ? 'sound' : 'picture' });
    }
    const sort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    return { roots, root: Number(root) || 0, dir, folders: folders.sort(sort), files: files.sort((a, b) => sort(a.name, b.name)) };
  }

  // Saves one uploaded file (stream) into root/dir. Zip files are unpacked (pictures and sounds only).
  async upload(req, root, dir, name, overwrite) {
    name = path.basename(String(name).replace(/\\/g, '/'));
    const isZip = /\.zip$/i.test(name);
    if (!isZip && !ALLOWED(name)) throw new Error(`${name}: only pictures (png, jpg, gif, svg, webp, bmp, ico), sounds (wav, mp3, ogg, m4a) or a .zip of them`);
    const folder = this.resolve(root, dir), target = this.resolve(root, dir ? `${dir}/${name}` : name);
    if (!isZip && !overwrite && fs.existsSync(target)) { req.resume(); const e = new Error(`${name} is already there`); e.code = 409; throw e; }
    fs.mkdirSync(folder, { recursive: true });
    const tmp = path.join(folder, `.upload-${process.pid}-${Date.now()}`);
    try {
      await new Promise((resolve, reject) => {
        let size = 0; const out = fs.createWriteStream(tmp);
        req.on('data', c => { size += c.length; if (size > MAX_UPLOAD) { reject(new Error('File is larger than 300 MB')); req.destroy(); } });
        req.on('error', reject); out.on('error', reject); out.on('finish', resolve);
        req.pipe(out);
      });
      if (!isZip) { fs.renameSync(tmp, target); return { saved: [this.usePath(root, dir ? `${dir}/${name}` : name)], skipped: [] }; }
      return this.unzip(fs.readFileSync(tmp), root, dir, overwrite);
    } finally { fs.rmSync(tmp, { force: true }); }
  }

  unzip(buf, root, dir, overwrite) {
    const saved = [], skipped = [];
    for (const z of readZip(buf)) {
      if (z.name.endsWith('/') || /(^|\/)(__MACOSX|\.)/.test(z.name)) continue;
      if (!ALLOWED(z.name)) { skipped.push(`${z.name} (not a picture or sound)`); continue; }
      const rel = (dir ? `${dir}/` : '') + z.name;
      let full; try { full = this.resolve(root, rel); } catch (e) { skipped.push(`${z.name} (${e.message})`); continue; }
      if (!overwrite && fs.existsSync(full)) { skipped.push(`${z.name} (already there)`); continue; }
      try { const data = z.data(); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, data); }
      catch (e) { skipped.push(`${z.name} (${e.message})`); continue; }
      saved.push(this.usePath(root, rel));
    }
    return { saved, skipped };
  }

  mkdir(root, rel) { fs.mkdirSync(this.resolve(root, rel), { recursive: true }); }
  rename(root, from, to) {
    const a = this.resolve(root, from), b = this.resolve(root, to);
    if (!fs.existsSync(a)) throw new Error('Not found: ' + from);
    if (fs.existsSync(b)) throw new Error('There is already a file called ' + to);
    if (fs.statSync(a).isFile() && !ALLOWED(b)) throw new Error('Keep a picture or sound file ending (.png, .wav ...)');
    fs.mkdirSync(path.dirname(b), { recursive: true });
    fs.renameSync(a, b);
  }
  remove(root, rel) {
    const f = this.resolve(root, rel);
    if (f === this.resolve(root, '')) throw new Error('The media folder itself cannot be deleted');
    const st = fs.statSync(f);
    if (st.isDirectory()) { if (fs.readdirSync(f).length) throw new Error('Empty the folder first'); fs.rmdirSync(f); }
    else fs.unlinkSync(f);
  }
}

// Minimal zip reader (stored and deflated entries; what Windows, macOS and phones make).
export function readZip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('This is not a zip file (or it is damaged)');
  const count = buf.readUInt16LE(eocd + 10); let p = buf.readUInt32LE(eocd + 16);
  if (count === 0xffff || p === 0xffffffff) throw new Error('This zip is too large (ZIP64); split it into smaller zips');
  const out = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('This zip is damaged');
    const flags = buf.readUInt16LE(p + 8), method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), local = buf.readUInt32LE(p + 42);
    const name = buf.subarray(p + 46, p + 46 + nlen).toString(flags & 0x800 ? 'utf8' : 'latin1').replace(/\\/g, '/');
    p += 46 + nlen + xlen + clen;
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28), raw = buf.subarray(start, start + csize);
    out.push({ name, data: () => {
      if (flags & 1) throw new Error(name + ' is password protected');
      if (method === 0) return raw;
      if (method === 8) return zlib.inflateRawSync(raw);
      throw new Error(`${name}: unsupported zip compression`);
    } });
  }
  return out;
}
