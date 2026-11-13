// Writes lib/skynet_media.json: every Skynet picture and sound in media/ (the files in git). A Fresh Start (lib/freshstart.js)
// keeps these and deletes the user's own. Run it after adding a Skynet picture or sound: node tools/skynet-media-list.js
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const listSkynetMedia = () => execFileSync('git', ['ls-files', 'media'], { cwd: root, encoding: 'utf8' })
  .split('\n').filter(f => f && !f.endsWith('.gitkeep') && !f.startsWith('media/notes/')).map(f => f.slice('media/'.length)).sort();
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = listSkynetMedia();
  fs.writeFileSync(path.join(root, 'lib', 'skynet_media.json'), JSON.stringify({ about: 'The Skynet pictures and sounds in media/ (Rule 9.8: a Fresh Start keeps these; notes are yours). Made by node tools/skynet-media-list.js', files }, null, 1) + '\n');
  console.log(`${files.length} Skynet pictures and sounds listed in lib/skynet_media.json`);
}
