// Step by Step guides (OakBarn Brewery, 2026-11-11, Rule 11.9): a section of Help listed first, guides titled "Step by Step: ...",
// a picture of the real screen at each step. The first guide is Add a Schema (Help 188), with ☰ Menu > ➕ New Schema… to begin.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');

const page = read('help/188-step-by-step-add-a-schema.md');
assert.match(page, /^# Step by Step: Add a Schema\n/, 'the title puts it in the Step by Step section');
const pics = [...page.matchAll(/!\[[^\]]*\]\((help_pictures\/[^)]+)\)/g)].map(m => m[1]);
assert.ok(pics.length >= 8, 'a picture at each step');
for (const p of pics) assert.ok(fs.existsSync(new URL('../media/' + p, import.meta.url)), p + ' is there');
for (const l of [...page.matchAll(/\]\((\d+-[\w-]+)\)/g)].map(m => m[1])) assert.ok(fs.existsSync(new URL(`../help/${l}.md`, import.meta.url)), 'link ' + l);
assert.doesNotMatch(page, /Fritz|BruControl/, 'Rules 11.3 and 11.5');

const help = read('public/help.js');
assert.match(help, /export const isStep = p => \/\^step by step\\s\*:\/i/, 'a Step by Step guide is found by its title');
assert.match(help, /'👣 Step by Step'/, 'the section heading in the page list');
assert.match(help, /optgroup', \{ label: 'Step by Step' \}/, 'and in the page dropdown on a phone');

const app = read('public/app.js');
assert.match(app, /item\('➕ New Schema…', guard\(addNewSchema\)/, '☰ Menu > New Schema');
assert.match(app, /'➕ New Schema'\),/, 'the New Schema button on the Schema tab');
assert.match(app, /if \(v === '__new'\) return addNewSchema\(\);/, 'the Schema dropdown opens the same box');
assert.match(app, /openHelp\(\['step-by-step-add-a-schema'\]\)/, 'Step by step opens the guide');
console.log('stepbystep ok');
