// The Glossary (OakBarn Brewery, 2026-11-17: "We also need a Glossary in the Help"): Help 13, every special word A to Z with a letter
// to jump to, pinned under the Step by Step guides in the Help page list. English and French stay in step (Rule 11.11).
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');

for (const [file, lang] of [['help/13-glossary.md', 'en'], ['help/fr/13-glossary.md', 'fr']]) {
  const page = read(file);
  const terms = [...page.matchAll(/^\*\*(.+?)\*\*/gm)].map(m => m[1]);
  assert.ok(terms.length >= 80, `${lang}: the Glossary has every word (${terms.length})`);
  // each letter heading has a jump link at the top, and every letter jumped to has a heading
  const heads = [...page.matchAll(/^## ([A-Z])(?: \{#([a-z])\})?$/gm)].map(m => m[1]);
  const jumps = [...page.split('\n## ')[0].matchAll(/\[([A-Z])\]\(#([a-z])\)/g)].map(m => m[1]);
  assert.deepEqual(jumps, heads, `${lang}: a jump link for each letter`);
  assert.deepEqual([...heads].sort(), heads, `${lang}: letters A to Z`);
  // each word sits under its own letter, A to Z (☰ and a dot are skipped; French sorts without accents)
  const key = t => t.replace(/^[☰.\s]+/, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  for (const block of page.split('\n## ').slice(1)) {
    const letter = block[0].toLowerCase();
    const words = [...block.matchAll(/^\*\*(.+?)\*\*/gm)].map(m => key(m[1]));
    for (const w of words) assert.equal(w[0], letter, `${lang}: "${w}" is under ${letter.toUpperCase()}`);
    if (lang === 'en') assert.deepEqual([...words].sort((a, b) => a.localeCompare(b)), words, `${lang}: A to Z under ${letter.toUpperCase()}`);
  }
  assert.equal(terms.filter(t => t === 'Schema').length, 1, `${lang}: Schema once`);
  for (const l of [...page.matchAll(/\]\((\d+-[\w-]+)\)/g)].map(m => m[1])) assert.ok(fs.existsSync(new URL(`../help/${l}.md`, import.meta.url)), `${lang}: link ${l}`);
  assert.doesNotMatch(page, /Fritz|BruControl/, 'Rules 11.3 and 11.5');
}
const en = read('help/13-glossary.md');
for (const w of ['Brain', 'Build Tab (🔨)', 'Hysteresis', 'Setpoint', 'Offset', 'Port', 'Hover Help', 'Clone', 'Edit layout'])
  assert.ok(en.includes(`**${w}**`), 'Glossary has ' + w);

const help = read('public/help.js');
assert.match(help, /export const isGlossary = p => bare\(p\.name \|\| ''\) === 'glossary';/, 'the Glossary page is found by its name');
assert.match(help, /'📖 Glossary'/, 'pinned in the page list');
assert.match(help, /optgroup', \{ label: 'Glossary' \}/, 'and in the page dropdown on a phone');
console.log('glossary ok');
