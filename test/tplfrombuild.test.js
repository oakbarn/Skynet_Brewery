// Rule 4.10 (OakBarn Brewery, 2026-11-24): the Template Menu tabs open from the 🔨 Build Tab (📁 Templates on the Edit layout bar)
// without leaving Edit layout, and B or Insert on a Template's icon puts a copy on the Build Tab while you stay on the Templates.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
const help = n => fs.readFileSync(new URL(`../help/${n}`, import.meta.url), 'utf8');

assert.match(app, /const TPL_MENU_TABS = \['vtemplates', 'etemplates', 'ftemplates', 'buildtemplate'\];/, 'the four Template Menu tabs');
assert.match(app, /if \(editing && !TPL_MENU_TABS\.includes\(k\)\) return toast\('Save or exit Edit layout first', true\);/, 'only the Template Menu tabs open in Build mode');
assert.match(html, /<select id="tplOpen"[^>]*><option value="">📁 Templates<\/option><option value="vtemplates">Vessel Templates<\/option><option value="etemplates">Equipment Templates<\/option><option value="ftemplates">Fitting Templates<\/option><option value="buildtemplate">Build Template<\/option><\/select>/, '📁 Templates on the Edit layout bar');
assert.match(app, /s\.onchange = \(\) => \{ const k = s\.value; s\.value = ''; if \(k\) openMenuTab\(k\); \}/, 'picking one opens it');
assert.match(css, /body\.menuOverBuild #editBar \{ display: none; \}/, 'the Edit layout bar steps aside over a Template Menu tab');
assert.match(app, /if \(!editing \|\| menuTab \|\| !\(ev\.ctrlKey/, 'Ctrl+Z does nothing over a Menu tab');
assert.match(app, /if \(!editing \|\| menuTab \|\| ev\.ctrlKey \|\| ev\.metaKey \|\| ev\.altKey \|\| ev\.repeat \|\| ev\.key\.toLowerCase\(\) !== 'z'\)/, 'Z does nothing over a Menu tab');
assert.match(app, /\(ev\.key === 'Insert' \|\| ev\.key\.toLowerCase\(\) === 'b'\) && !ev\.ctrlKey && !ev\.shiftKey && !ev\.altKey && !ev\.metaKey && can\('admin'\)\) \{ ev\.preventDefault\(\); tplInsert\(kind, t\); \}/, 'B or Insert on the icon');
const ins = app.slice(app.indexOf('function tplInsert('), app.indexOf('function placeTabVessel('));
assert.match(ins, /\{ stay: !!menuTab \}/, 'you stay on the Templates');
assert.match(ins, /x\.dataset\.tpl === full\.name\)\?\.focus\(\)/, 'the same Template keeps the focus');
assert.match(app, /if \(menuTab && !stay\) leaveMenuTab\(\);/, 'Add to Tab and Clone still go to the Build Tab');
assert.match(rules, /^4\.10 \*\*The Templates open from the 🔨 Build Tab, and B or Insert puts a copy on it\*\*/m, 'Rule 4.10');
for (const f of ['55-build-tab.md', 'fr/55-build-tab.md', '50-vessel-and-fitting-templates.md', 'fr/50-vessel-and-fitting-templates.md']) assert.match(help(f), /4\.10\)/, `Help ${f}`);
console.log('tplfrombuild ok');
