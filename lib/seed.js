// A release keeps its sample layout, pictures, sounds and processes in defaults/ (defaults/config, defaults/media,
// defaults/scripts), not in the real folders. So unzipping a new version over a panel can never replace yours.
// On start, a folder that does not exist yet (a first install, or one you moved away) gets a copy of the samples.
// An existing folder is never touched, except that a missing config/brewery.json is filled in, and the sample pictures
// and sounds a media folder is missing are added (a file you already have is never replaced). One exception: an SVG the
// panel traced by itself (Settings > Pictures) is swapped for the hand-drawn Skynet SVG of the same name, since nobody made it.
import fs from 'node:fs';
import path from 'node:path';
import { tracedFrom } from './vectorize.js';

export function seedDefaults(root, defaultsDir = path.join(root, 'defaults')) {
  const made = [];
  if (!fs.existsSync(defaultsDir)) return made;
  for (const e of fs.readdirSync(defaultsDir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const src = path.join(defaultsDir, e.name), dest = path.join(root, e.name);
    if (!fs.existsSync(dest)) {
      fs.cpSync(src, dest, { recursive: true });
      made.push(e.name);
    } else if (e.name === 'config') {
      const f = 'brewery.json';
      if (!fs.existsSync(path.join(dest, f)) && fs.existsSync(path.join(src, f))) {
        fs.copyFileSync(path.join(src, f), path.join(dest, f));
        made.push(`config/${f}`);
      }
    } else if (e.name === 'media') {
      const n = addMissing(src, dest);
      if (n) made.push(`media (${n} sample file${n === 1 ? '' : 's'})`);
    }
  }
  return made;
}

// Copies files from src that dest does not have yet (any letter case counts as having it). Returns how many.
function addMissing(src, dest) {
  let n = 0;
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, e.name);
    let have = null; try { have = fs.readdirSync(dest).find(x => x.toLowerCase() === e.name.toLowerCase()); } catch { }
    const to = path.join(dest, have ?? e.name);
    if (e.isDirectory()) { fs.mkdirSync(to, { recursive: true }); n += addMissing(from, to); }
    else if (e.isFile() && !have) { fs.copyFileSync(from, to); n++; }
    else if (e.isFile() && /\.svg$/i.test(e.name) && tracedFrom(to) && !tracedFrom(from)) { fs.copyFileSync(from, to); n++; }
  }
  return n;
}
