// Rule 4.1 (OakBarn Brewery, 2026-11-12): every new Device and Widget starts on the 🔨 Build Tab and Save Build ... moves it to the Tab
// picked in its Add box; its spot there is its spot on that Tab; the Watermark; the red glow until clicked; 📁 Templates in the Tab list.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
const help = fs.readFileSync(new URL('../help/55-build-tab.md', import.meta.url), 'utf8');

assert.doesNotMatch(app, /if \(e\.workspace && e\.workspace !== wsName\) \{ wsName = e\.workspace; renderTabs\(\); \}/, 'no new Device goes straight on its Tab any more');
const add = app.slice(app.indexOf('async function addThing('), app.indexOf('function elemVesselBuild('));
assert.match(add, /useTabProfile\(e\);[^\n]*\n\s*keepOnBuild\(e\);/, 'addThing keeps it on the Build Tab, after taking its Tab\'s look');
assert.equal((app.match(/useTabProfile\(e\); keepOnBuild\(e\);/g) || []).length, 2, 'Thermowell and Probe Tee too');
assert.match(app, /draft\.graphics\.filter\(q => q\.attachTo === g\.id\)\]\) keepOnBuild\(x\);/, 'a Valve Tee with its valves and IPs too');
const keep = app.slice(app.indexOf('function keepOnBuild('), app.indexOf('function keepOnBuild(') + 700);
assert.match(keep, /x\.buildTo = to\.name/, 'the picked Tab is remembered');
assert.match(keep, /b\.width = Math\.max/, 'the Build Tab is at least as big as that Tab');
assert.match(app, /tab: tabIdOf\(nameTab\(e\)\)/, 'its Suggested Name keeps the picked Tab\'s ID');
const mv = app.slice(app.indexOf('function moveBuildTo('), app.indexOf('function centerOn('));
assert.match(mv, /if \(!list\.some\(x => buildToOf\(host\(x\) \|\| x\) === to\.name\)\) centerOn\(list, to\);/, 'its spot is kept on the Tab picked for it');
assert.match(mv, /delete x\.buildTo/, 'buildTo goes when it is moved');
assert.match(mv, /freshMoved\.add\(freshKey\(x\)\)/, 'it glows once moved');
assert.match(app, /for \(const x of \[\.\.\.draft\.elements, \.\.\.draft\.graphics\]\) delete x\.buildTo;/, 'buildTo is never saved');
assert.match(app, /const first = picked\.length === 1 \? picked\[0\] : b\.from;/, 'Save Build offers the picked Tab first');
assert.match(html, /<button id="buildMark" class="hidden"/, 'the Watermark switch on the Edit layout bar');
assert.match(app, /localStorage\.setItem\('bp\.buildMark'/, 'the switch is remembered');
assert.match(css, /#ws \.buildMark \{[^}]*pointer-events: none/, 'the watermark can\'t be clicked');
assert.match(css, /@keyframes freshPulse/, 'a slow red pulse');
assert.match(css, /#ws \.freshMoved \{ animation: freshPulse 2\.4s/, 'slow');
assert.match(app, /const n = ev\.target\.closest\('\.freshMoved'\); if \(!n\) return;\s*freshMoved\.delete/, 'a click ends the glow');
assert.match(app, /'📁 Templates \(Save Build \.\.\. saves it as a Template\)'/, '📁 Templates in the Tab list');
assert.match(app, /const tplOk = onBuildTab\(item\) && item\.kind === 'vessel'/, 'only for what can be a Template');
assert.match(rules, /4\.1 \*\*Every new Device, Widget or copy of a Template starts on the 🔨 Build Tab, never on a regular Tab\*\*/, 'Rule 4.1');
assert.match(help, /## Where it goes/, 'Help 55');
assert.match(help, /### The Watermark/, 'Help 55 Watermark');
console.log('buildfirst ok');
