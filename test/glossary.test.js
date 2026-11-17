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
// the wiring and hardware words (OakBarn Brewery, 2026-11-17: "something Technical like 12C needs explanation (Link to Glossary)";
// "0-10V Controller"): one ### heading each, so each has its own link; the same words and links in French
const slugOf = h => h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');      // as public/help.js slug and GitHub
const wiring = (page, fr) => {
  const part = page.split(fr ? '\n## Mots du câblage et du matériel {#wiring-and-hardware-words}' : '\n## Wiring and hardware words')[1];
  assert.ok(part, (fr ? 'fr' : 'en') + ': a wiring words section');
  assert.match(part, fr ? /L'électricité peut tuer/ : /⚠ Electricity can kill/, 'the electrical warning (Rule 6.20)');
  return [...part.matchAll(/^### (.+?)(?: \{#([\w-]+)\})?$/gm)].map(m => ({ name: m[1], id: m[2] || slugOf(m[1]) }));
};
const wEn = wiring(read('help/13-glossary.md')), wFr = wiring(read('help/fr/13-glossary.md'), true);
assert.ok(wEn.length >= 40, 'the wiring words are there');
assert.deepEqual(wFr.map(w => w.id), wEn.map(w => w.id), 'French has the same words and links');
assert.deepEqual(wEn.map(w => w.name), [...wEn.map(w => w.name)].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())), 'wiring words A to Z');
for (const id of ['0-10v-controller', 'i2c', 'dac', 'ssr', 'gfci', 'pwm-port', 'contactor', '4-20-ma', 'thermowell'])
  assert.ok(wEn.some(w => w.id === id), 'wiring word link #' + id);
assert.match(read('help/13-glossary.md'), /\[🔌 Wiring words\]\(#wiring-and-hardware-words\)/, 'jump to the wiring words');
assert.doesNotMatch(read('help/13-glossary.md').split('## Wiring and hardware words')[1], /https?:/, 'no store links yet (Rule 11.10)');

const en = read('help/13-glossary.md');
for (const w of ['Brain', 'Build Tab (🔨)', 'Hysteresis', 'Setpoint', 'Offset', 'Port', 'Hover Help', 'Clone', 'Edit layout'])
  assert.ok(en.includes(`**${w}**`), 'Glossary has ' + w);

const help = read('public/help.js');
assert.match(help, /export const isGlossary = p => bare\(p\.name \|\| ''\) === 'glossary';/, 'the Glossary page is found by its name');
assert.match(help, /'📖 Glossary'/, 'pinned in the page list');
assert.match(help, /optgroup', \{ label: 'Glossary' \}/, 'and in the page dropdown on a phone');
console.log('glossary ok');
