// French Help (Rule 11.11, OakBarn Brewery, 2026-11-13: "French Help Only forever"): every English Help page has a French page in
// help/fr/, made from the English page as it is now. When an English page changes, its French page changes in the same PR; until
// then this test fails and names the page (node tools/help-french.js lists them, --stamp marks one done).
// A French page keeps everything that is not words: the same parts (each heading keeps its English id), links, pictures, code and
// names, and the red electrical warning.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Help, sourceStamp, titleOf, langOf, headingId } from '../lib/help.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---- the French Help folder works (a made-up manual)
{
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'helpfr-'));
  fs.writeFileSync(path.join(d, '01-start.md'), '# Start\n\n## Getting going\nHi');
  fs.writeFileSync(path.join(d, '02-tabs.md'), '# Tabs\nTabs');
  const en = new Help(d), fr = en.translation('fr');
  assert.equal(en.translation('en'), en); assert.equal(en.translation('xx'), en, 'an unknown language is English');
  assert.equal(langOf('fr'), 'fr'); assert.equal(langOf('../x'), 'en');
  assert.deepEqual(en.list().map(p => p.name), ['01-start', '02-tabs'], 'the fr folder is not an English page');
  let l = fr.list();
  assert.ok(l.every(p => p.missing && p.lang === 'en'), 'nothing translated yet: the English pages');
  assert.equal(fr.read('02-tabs'), '# Tabs\nTabs', 'a page not translated reads in English');
  fr.write('01-start', '# Départ\n\n## En route {#getting-going}\nSalut');
  l = fr.list();
  assert.equal(l[0].title, 'Départ'); assert.equal(l[0].lang, 'fr'); assert.equal(l[0].stale, true, 'not stamped yet');
  fr.stamp('01-start');
  assert.equal(fr.list()[0].stale, false, 'stamped: up to date');
  assert.equal(JSON.parse(fs.readFileSync(path.join(d, 'fr', '_source.json'), 'utf8'))['01-start'], sourceStamp('# Start\n\n## Getting going\nHi'));
  en.write('01-start', '# Start\n\n## Getting going\nHello');
  assert.equal(fr.list()[0].stale, true, 'the English page changed: the French page is out of date');
  assert.throws(() => fr.stamp('02-tabs'), /No Français page/);
  assert.equal(titleOf('# Pour commencer {#getting-started}\n'), 'Pour commencer', 'the English id is not part of the title');
  assert.equal(sourceStamp('a\r\nb'), sourceStamp('a\nb'), 'Windows line ends make no difference');
  fs.rmSync(d, { recursive: true, force: true });
}

// ---- the shipped French Help
// what a page keeps whatever its language
const outside = t => t.replace(/```[\s\S]*?```/g, '');
function keeps(text) {
  const t = text.replace(/\r/g, '');
  return {
    parts: t.replace(/```[\s\S]*?```/g, '').split('\n').filter(l => /^#{1,6}\s/.test(l))
      .map(l => l.match(/^#+/)[0] + headingId(l)),
    links: [...outside(t).matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)\)/g)].map(m => m[1]).sort(),
    pictures: [...outside(t).matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map(m => m[1]).sort(),
    code: [...outside(t).matchAll(/`([^`\n]+)`/g)].map(m => m[1]).sort(),
    blocks: [...t.matchAll(/```[\s\S]*?```/g)].map(m => m[0]),
    warnings: (t.match(/⚠\s*(\*\*)?\s*(Electricity can kill|L'électricité peut tuer)/g) || []).length,
  };
}
const en = new Help(path.join(root, 'help')), fr = en.translation('fr');
const list = fr.list(), problems = [];
for (const p of list) {
  if (p.missing) { problems.push(`${p.name}: no French page yet (help/fr/${p.name}.md)`); continue; }
  if (p.stale) { problems.push(`${p.name}: the English page changed; update help/fr/${p.name}.md, then node tools/help-french.js --stamp ${p.name}`); continue; }
  let e; try { e = en.read(p.name); } catch { continue; }      // a page only in French
  const a = keeps(e), b = keeps(p.text);
  for (const k of Object.keys(a)) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) {
    const diff = Array.isArray(a[k]) ? [a[k].filter(x => !b[k].includes(x)).slice(0, 3), b[k].filter(x => !a[k].includes(x)).slice(0, 3)] : [a[k], b[k]];
    problems.push(`${p.name}: the French page has other ${k} than the English page ${JSON.stringify(diff)}`);
  }
  if (/Fritz/.test(p.text.replace(/Buy Fritz a beer/g, ''))) problems.push(`${p.name}: names a person (Rule 11.5)`);
  if (!p.title || p.title === p.name) problems.push(`${p.name}: no # title`);
}
assert.deepEqual(problems, [], '\n' + problems.join('\n'));
// _source.json names only pages that are there
for (const n of Object.keys(fr.sources())) assert.ok(fs.existsSync(path.join(root, 'help', 'fr', n + '.md')), `_source.json names a missing French page ${n}`);
console.log(`French Help ok (${list.length} pages)`);
