// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// French Help (Rule 11.11): which French pages are missing or out of date, and marking a French page as brought up to date.
//   node tools/help-french.js                 lists the English pages with no French page, and the French pages whose English page changed
//   node tools/help-french.js --stamp NAME…   after updating those French pages: gives each French heading the id of its English heading
//                                            ({#id}, so links to a part work in both languages) and marks the page as made from the
//                                            English page as it is now ('all' = every French page)
// A test (test/helpfrench.test.js) fails while a page is missing or out of date, so an English change and its French change go in the
// same PR.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { Help, headingId } from '../lib/help.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const en = new Help(path.join(root, 'help')), fr = en.translation('fr');
const args = process.argv.slice(2);

if (args[0] === '--stamp') {
  let names = args.slice(1).map(n => path.basename(n).replace(/\.md$/, ''));
  if (names[0] === 'all') names = fr.list().filter(p => !p.missing).map(p => p.name);
  if (!names.length) { console.error('Give the page names to stamp, e.g. 01-getting-started'); process.exit(1); }
  let bad = 0;
  for (const n of names) {
    const f = fr.file(n);
    if (!fs.existsSync(f)) { console.error('no French page', n); bad++; continue; }
    const heads = t => t.replace(/```[\s\S]*?```/g, m => m.replace(/^#/gm, '\u0000')).split('\n');
    const enHeads = heads(en.read(n)).filter(l => /^#{1,6}\s/.test(l));
    const lines = fs.readFileSync(f, 'utf8').replace(/\r/g, '').split('\n');
    let inCode = false, k = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('```')) inCode = !inCode;
      if (inCode || !/^#{1,6}\s/.test(lines[i])) continue;
      const want = enHeads[k++];
      if (want === undefined) break;
      const id = headingId(want);
      if (headingId(lines[i]) !== id) lines[i] = lines[i].replace(/\s*\{#[\w-]+\}\s*$/, '').replace(/\s+$/, '') + ` {#${id}}`;
    }
    const frCount = lines.join('\n').replace(/```[\s\S]*?```/g, '').split('\n').filter(l => /^#{1,6}\s/.test(l)).length;
    if (frCount !== enHeads.length) { console.error(`${n}: ${frCount} headings in French, ${enHeads.length} in English; not stamped`); bad++; continue; }
    fs.writeFileSync(f, lines.join('\n'));
    fr.stamp(n); console.log('stamped', n);
  }
  process.exit(bad ? 1 : 0);
} else {
  const list = fr.list(), missing = list.filter(p => p.missing), stale = list.filter(p => p.stale);
  for (const p of missing) console.log('missing      ', p.name);
  for (const p of stale) console.log('out of date  ', p.name);
  console.log(`${list.length - missing.length - stale.length} of ${list.length} French pages up to date`);
  process.exit(missing.length || stale.length ? 1 : 0);
}
