// Rule 2.6 Add new goes first (OakBarn Brewery, 2026-11-23: "I think change the Rule. Add New goes first on every DDLB where
// appropriate") and Rule 10.12 no Switch to Simulator while brewing ("We want to be able to switch to a simulator except on a Brew
// Day and Actively brewing").
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const app = read('public/app.js'), rules = read('docs/Skynet_Rules.md');

// addNewFirst, run on a small pretend <select>
const src = app.slice(app.indexOf('const ADD_NEW_WORDS'), app.indexOf('return sel;\n}', app.indexOf('function addNewFirst')) + 13);
const addNewFirst = new Function(src + '\nreturn addNewFirst;')();
function sel(opts, pick) {
  const s = { tagName: 'SELECT', kids: [] };
  const link = () => s.kids.forEach((o, i) => { o.nextSibling = s.kids[i + 1] || null; });
  Object.defineProperties(s, {
    firstChild: { get: () => s.kids[0] || null }, firstElementChild: { get: () => s.kids[0] || null },
    options: { get: () => s.kids },
    selectedIndex: { get: () => s.kids.findIndex(o => o.selected), set: v => s.kids.forEach((o, i) => { o.selected = i === v; }) },
  });
  s.querySelectorAll = () => [...s.kids];
  s.insertBefore = (a, at) => { s.kids.splice(s.kids.indexOf(a), 1); const i = at ? s.kids.indexOf(at) : s.kids.length; s.kids.splice(i, 0, a); link(); };
  s.kids = opts.map(([value, textContent]) => ({ tagName: 'OPTION', value, textContent, selected: false }));
  link(); if (pick != null) s.kids[pick].selected = true;
  return s;
}
const words = s => s.kids.map(o => o.textContent);
let s = addNewFirst(sel([['a', 'Schema A'], ['b', 'Schema B'], ['__add__', 'Add new Schema ...'], ['__x', '📋 Clone this Schema']], 1));
assert.deepEqual(words(s), ['Add new Schema ...', 'Schema A', 'Schema B', '📋 Clone this Schema']);
assert.equal(s.kids[s.selectedIndex].value, 'b', 'the picked one stays picked, never Add new');
s = addNewFirst(sel([['', '(pick a Style)'], ['x', 'Skynet Gold'], ['__add__', '➕ Add new User Style…']], 0));
assert.deepEqual(words(s), ['(pick a Style)', '➕ Add new User Style…', 'Skynet Gold'], 'after a (pick ...) line');
assert.equal(s.selectedIndex, 0);
s = addNewFirst(sel([['F', '°F'], ['C', '°C'], ['o', 'Other (type…)']], 0));
assert.deepEqual(words(s), ['°F', '°C', 'Other (type…)'], 'a fixed list is not changed');
s = addNewFirst(sel([['1', 'Tab 1'], ['__add__', '➕ Add new Tab…']]));
assert.equal(words(s)[0], '➕ Add new Tab…'); assert.equal(s.selectedIndex, -1, 'nothing picked stays nothing picked');
assert.match(app, /addNewFirst\(input\);[^\n]*\n\s*if \(tb && input\) \{/, 'every field() dropdown');
assert.match(app, /s\.value = s\.dataset\.was \?\? \[\.\.\.s\.options\]\.find\(o => o\.value !== '__add__'\)\?\.value \?\? '';/);
assert.ok((app.match(/addNewFirst\(/g) || []).length >= 10);
assert.match(rules, /\*\*Add new goes first\*\* \(OakBarn Brewery, 2026-11-23/);
assert.doesNotMatch(rules, /the card is open/);

// Rule 10.12: grayed in the Menu, refused anywhere else; Loopers do not count; back to Real boards always works
assert.match(app, /const brewing = \(S\.scripts \|\| \[\]\)\.filter\(x => x\.state === 'running' && x\.cls !== 'looper'\)/);
assert.match(app, /\? \{ disabled: true, title: `Not while brewing\. Running now: /);
assert.match(app, /if \(on && \(S\.scripts \|\| \[\]\)\.some\(x => x\.state === 'running' && x\.cls !== 'looper'\)\) return toast\(/);
assert.match(rules, /10\.12 \*\*No Switch to Simulator while brewing\*\*/);
console.log('Rule 2.6 Add new first + Rule 10.12 ok');
