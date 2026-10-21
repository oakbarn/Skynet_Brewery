// File Move page: copy files from the computer you are sitting at (Windows, Mac, Linux, phone) to the Brain (the Pi),
// whole folders at once. Each kind of file has one home on the Brain, so nothing lands in the wrong place:
//   pictures  -> media/Images/<folders kept>     sounds -> media/sounds/<name>
//   processes -> scripts/<name>.txt               help   -> help/<name>.md
// A file already on the Brain is skipped unless "Replace" is ticked.
import fs from 'node:fs';
import path from 'node:path';
import { PICTURE, SOUND, MAX_UPLOAD, isKeptPicture, KEPT_MSG } from './mediafiles.js';

export const KINDS = {
  pictures: { label: 'Pictures (media/Images)', test: PICTURE, keepFolders: true },
  sounds: { label: 'Sounds (media/sounds)', test: SOUND },
  processes: { label: 'Processes (scripts)', test: /\.txt$/i },
  help: { label: 'Help pages (help)', test: /\.md$/i },
};
// Which kind a file is, from its name ending (pictures and sounds only; .txt and .md are picked by hand)
export const kindOf = name => PICTURE.test(name) ? 'pictures' : SOUND.test(name) ? 'sounds' : null;

export class FileMove {
  // dirs(): { root, media, scripts, help } absolute folders on the Brain (root: the panel folder, for showing paths)
  constructor(dirs) { this.dirs = dirs; }

  base(kind) {
    const d = this.dirs();
    return { pictures: path.join(d.media, 'Images'), sounds: path.join(d.media, 'sounds'), processes: d.scripts, help: d.help }[kind];
  }

  // Where a file goes on the Brain, and the path to use for it in the panel. Throws for a bad kind, name or path.
  target(kind, rel) {
    const k = KINDS[kind];
    if (!k) throw new Error('Pick where the files go');
    const parts = String(rel ?? '').replace(/\\/g, '/').split('/').filter(p => p && p !== '.');
    if (!parts.length) throw new Error('No file name');
    if (parts.some(p => p === '..' || p.startsWith('.'))) throw new Error(`${rel}: names cannot start with a dot`);
    const name = parts.at(-1);
    if (!k.test.test(name)) throw new Error(`${name} is not one of the ${k.label}`);
    if (kind === 'help' && !/^[a-z0-9][a-z0-9_-]{0,79}\.md$/i.test(name)) throw new Error(`${name}: a help page name may use letters, numbers, - and _ only`);
    if (kind === 'processes' && /[\\/:*?"<>|]/.test(name)) throw new Error(`${name}: not a good Process name`);
    const keep = k.keepFolders ? parts : [name];
    const base = this.base(kind), full = path.join(base, ...keep);
    if (!full.startsWith(base + path.sep)) throw new Error(`${rel} is outside the folder`);
    const use = kind === 'pictures' ? 'Images/' + keep.join('/') : kind === 'sounds' ? 'sounds/' + name : name.replace(/\.(txt|md)$/i, '');
    return { full, use, folder: path.relative(this.dirs().root, full).replace(/\\/g, '/') };
  }

  // For the list before copying: is each file already on the Brain, and is it the same size?
  check(items) {
    return (items || []).slice(0, 5000).map(({ kind, path: rel, size }) => {
      try {
        const t = this.target(kind, rel);
        const st = fs.existsSync(t.full) ? fs.statSync(t.full) : null;
        return { ok: true, to: t.folder, use: t.use, exists: !!st, same: !!st && st.size === Number(size) };
      } catch (e) { return { ok: false, error: e.message }; }
    });
  }

  // Saves one uploaded file (stream). Written to a temporary name first, so a broken copy never replaces a good file.
  async save(req, kind, rel, overwrite) {
    let t; try { t = this.target(kind, rel); } catch (e) { req.resume(); throw e; }
    if (isKeptPicture(t.full) && fs.existsSync(t.full)) { req.resume(); throw new Error(`${t.folder}: ${KEPT_MSG}`); }
    if (!overwrite && fs.existsSync(t.full)) { req.resume(); const e = new Error(`${t.folder} is already on the Brain`); e.code = 409; throw e; }
    fs.mkdirSync(path.dirname(t.full), { recursive: true });
    const tmp = path.join(path.dirname(t.full), `.filemove-${process.pid}-${Date.now()}`);
    try {
      await new Promise((resolve, reject) => {
        let size = 0; const out = fs.createWriteStream(tmp);
        req.on('data', c => { size += c.length; if (size > MAX_UPLOAD) { reject(new Error('File is larger than 300 MB')); req.destroy(); } });
        req.on('error', reject); out.on('error', reject); out.on('finish', resolve);
        req.pipe(out);
      });
      fs.renameSync(tmp, t.full);
      return { saved: t.folder, use: t.use, full: t.full };
    } finally { fs.rmSync(tmp, { force: true }); }
  }
}

// Pictures and sounds the loaded Schema uses that are not on the Brain (so you know what to copy over).
export function missingMedia(config, findMedia) {
  const found = new Set();
  const walk = v => {
    if (typeof v === 'string') { if ((PICTURE.test(v) || SOUND.test(v)) && !/^(https?:|data:)/i.test(v)) found.add(v.trim()); }
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'bru' && k !== 'vesselLists') walk(x);
  };
  walk({ workspaces: config?.workspaces, elements: config?.elements, graphics: config?.graphics });
  return [...found].filter(p => { const f = findMedia(p); return !f || !fs.existsSync(f); })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map(p => ({ path: p, name: p.replace(/\\/g, '/').split('/').pop(), kind: SOUND.test(p) ? 'sounds' : 'pictures' }));
}
