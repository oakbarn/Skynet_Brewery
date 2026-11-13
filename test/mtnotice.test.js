// Rule 11.14: every Help language other than English has the machine translation notice, in that language.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MT_NOTICE, MT_BUTTON, showMachineNotice } from '../public/mtnotice.js';

const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8') + fs.readFileSync(new URL('../public/help.html', import.meta.url), 'utf8');
const langs = new Set([...html.matchAll(/<select id="hpLang"[^>]*>(.*?)<\/select>/gs)].flatMap(m => [...m[1].matchAll(/value="(\w+)"/g)].map(x => x[1])));
assert.ok(langs.has('en') && langs.has('fr'));
for (const l of langs) {
  assert.ok(MT_NOTICE[l]?.title && MT_NOTICE[l]?.text, `the notice in ${l}`);
  if (l !== 'en') assert.notEqual(MT_NOTICE[l].text, MT_NOTICE.en.text);
}
assert.match(MT_NOTICE.en.text, /machine, not by a person/);
assert.equal(MT_BUTTON, 'Acknowledge');
assert.equal(await showMachineNotice('en', null), false, 'English: no notice');
console.log('machine translation notice tests passed');
