// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The words in the Help pictures in French (Rule 7.25): which words in media/help_pictures/*.svg still need their French in
// help/fr/_pictures.json, and which French is no longer used.
//   node tools/helppics-french.js            lists the words with no French (and the picture each is in), and the French no picture uses
//   node tools/helppics-french.js --missing  writes the words with no French as JSON (English → ""), to fill in and add
//   node tools/helppics-french.js --prune    takes out the French no picture uses
// A word printed on a real item (a pin name, a board's name, a model) keeps its English: write it as its own French.
// A test (test/helppicfrench.test.js) fails while a word has no French, so a picture and its French go in the same PR.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pictureWords, PICTURE_WORDS } from '../lib/helppictext.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PICS = path.join(root, 'media', 'help_pictures'), FILE = path.join(root, 'help', 'fr', PICTURE_WORDS);
const fr = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : {};
const en = new Map();
for (const f of fs.readdirSync(PICS).filter(f => f.endsWith('.svg')).sort())
  for (const w of pictureWords(fs.readFileSync(path.join(PICS, f), 'utf8'))) if (!en.has(w)) en.set(w, f);
const missing = [...en.keys()].filter(t => !(t in fr)), gone = Object.keys(fr).filter(t => !en.has(t));
const arg = process.argv[2];
const save = d => fs.writeFileSync(FILE, JSON.stringify(Object.fromEntries(Object.entries(d).sort(([a], [b]) => (a < b ? -1 : a > b))), null, 1) + '\n');

if (arg === '--missing') process.stdout.write(JSON.stringify(Object.fromEntries(missing.map(t => [t, ''])), null, 1) + '\n');
else if (arg === '--prune') { for (const t of gone) delete fr[t]; save(fr); console.log(`took out ${gone.length} French words no longer used`); }
else {
  for (const t of missing) console.log('no French    ', en.get(t), JSON.stringify(t));
  for (const t of gone) console.log('not used     ', JSON.stringify(t));
  console.log(`${en.size - missing.length} of ${en.size} picture words have their French`);
  process.exit(missing.length ? 1 : 0);
}
