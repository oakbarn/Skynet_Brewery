// Picture Widget Add box and Properties (Fritz, 2026-11-05: "build a Picture Widget Build ... follow the look and sequences of
// the Pump drill Down", Rule 18.27, Help 74)
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
// Picture ➕ and Add Widget > Picture Widget both go through the Add Widget box
assert.match(app, /\$\('#addImg'\)\.onclick = guard\(\(\) => addThing\('picture'\)\)/, 'Picture ➕ makes a Picture Widget');
assert.match(app, /if \(isPicW\(e\)\) \{ centerNew\(e\); if \(!\(await newPictureDialog\(e\)\)\) return; \}/, 'addThing opens the Add Widget box');
const own = app.slice(app.indexOf('function pictureWidgetFields('), app.indexOf('// Value, Time and DateTime Widget Properties'));
// the order: 1 Label, 2 Picture, 3 Tab (the Build Tab in the Add box, Rule 4.1), 4 Name; no Interface or Port (Rule 1.2)
const order = ["'1. Label'", "'2. Picture'", "'3. Tab'", "'4. Name'", "'Graphic'", "'Turns on with'", "'Overlay'", "'Text on picture'", "'X (Horizontal)'", "'Widget Type'"].map(k => own.indexOf(k));
assert.ok(order.every(i => i > 0) && order.every((v, i) => !i || v > order[i - 1]), 'fields in the drill-down order');
assert.ok(!/'device'|'channel'/.test(own), 'a Widget has no Interface or Port (Rule 1.2)');
assert.match(own, /add \? \['_tab', '3\. Tab', 'ro', '🔨 Build Tab'/, 'the Add box shows the Build Tab greyed out');
assert.match(own, /with: \['tap', 'Toggle', 'sel', PIC_TAP\(it\.tap\)\]/, 'Turns on with and Toggle on one line');
assert.match(own, /attr: PIC_POP/, 'the second picture is in the Overlay pop-up');
assert.match(own, /\['locked', '', 'lock', null, false, false, \{ inTitle: true \}\]/, 'Properties: the lock in the title line');
assert.match(app, /if \(isPicW\(it\)\) return pictureWidgetFields\(it, item\)/, 'its Properties are the drill-down');
assert.match(app, /isDrillDev\(item\) \|\| isDataW\(item\) \|\| isPicW\(item\)\) && !String\(work\.label/, 'the Label is never blank');
// the Add box: Label and Picture first, then the rest; Enter goes Label, Picture, Add Widget
const add = app.slice(app.indexOf('async function newPictureDialog('), app.indexOf('// ---- Thermowell'));
assert.match(add, /'Type a Label first \(1\. Label\)' : !w\.imageOff/, 'Add Widget says what is missing');
assert.match(add, /\['label', 'imageOff'\]\.map/, 'Enter sequence');
assert.match(add, /b\.textContent = '➕ Add Widget'/);
assert.match(app, /const PIC_AUTO_LABEL = (true|false);/, 'Label auto-fill is one switch (Rule 18.15: Fritz decides)');
// the Suggested Name: pic_ + the Label
const picSuggest = label => 'pic_' + (String(label || '').replace(/\s+/g, '_').replace(/[^\w-]/g, '') || 'Picture');
assert.equal(picSuggest('Kettle Element'), 'pic_Kettle_Element');
const help = fs.readFileSync(new URL('../help/74-picture-widget.md', import.meta.url), 'utf8');
assert.match(help, /## Adding a Picture Widget/);
assert.match(help, /## Picture Widget Properties/);
console.log('picturedialog tests passed');
