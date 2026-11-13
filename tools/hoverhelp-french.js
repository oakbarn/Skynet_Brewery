// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// French balloons (Hover Help) (Rule 11.11): which balloon texts still need their French, and which French is no longer used.
//   node tools/hoverhelp-french.js            lists the English balloon texts with no French in public/hoverhelp-fr.json (and where
//                                             each one is), and the French whose English text is gone
//   node tools/hoverhelp-french.js --missing  writes the texts with no French as a JSON list (English → ""), to fill in and add
//   node tools/hoverhelp-french.js --prune    takes out the French whose English text is gone
// A test (test/hoverfrench.test.js) fails while a balloon has no French, so a balloon change and its French go in the same PR.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { balloonTexts } from '../lib/hoverstrings.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(root, 'public', 'hoverhelp-fr.json');
const fr = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : {};
const en = balloonTexts(root);
const missing = [...en.keys()].filter(t => !(t in fr)), gone = Object.keys(fr).filter(t => !en.has(t));
const arg = process.argv[2];

if (arg === '--missing') {
  process.stdout.write(JSON.stringify(Object.fromEntries(missing.map(t => [t, ''])), null, 1) + '\n');
} else if (arg === '--prune') {
  for (const t of gone) delete fr[t];
  fs.writeFileSync(FILE, JSON.stringify(fr, null, 1) + '\n');
  console.log(`took out ${gone.length} French texts no longer used`);
} else {
  for (const t of missing) console.log('no French    ', en.get(t)[0], JSON.stringify(t).slice(0, 100));
  for (const t of gone) console.log('not used     ', JSON.stringify(t).slice(0, 100));
  console.log(`${en.size - missing.length} of ${en.size} balloon texts have their French`);
  process.exit(missing.length || gone.length ? 1 : 0);
}
