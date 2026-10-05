// A release keeps its sample layout, pictures, sounds and processes in defaults/ (defaults/config, defaults/media,
// defaults/scripts), not in the real folders. So unzipping a new version over a panel can never replace yours.
// On start, a folder that does not exist yet (a first install, or one you moved away) gets a copy of the samples.
// An existing folder is never touched, except that a missing config/brewery.json is filled in.
import fs from 'node:fs';
import path from 'node:path';

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
    }
  }
  return made;
}
