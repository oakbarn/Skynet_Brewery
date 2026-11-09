// Every Device looks like the Pump's drill-down (Fritz, 2026-11-07: "All dialogs for devices should follow the Pump Drill down
// sample", Rule 18.31, Help 148).
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const gen = app.slice(app.indexOf('function genDeviceFields('), app.indexOf('function fieldsFor(item)'));
const order = ["'1. Label'", "'2. Interface (board)'", "'3. Tab'", "'4. Name'", "'Graphic'", "'Overlay'", "'Text attributes'", "'X (Horizontal)'", 'typeF];'].map(k => gen.indexOf(k));
assert.ok(order.every(i => i > 0) && order.every((v, i) => !i || v > order[i - 1]), 'fields in the Pump drill-down order');
assert.match(gen, /\['locked', '', 'lock', null, false, false, \{ inTitle: true \}\]/, 'the lock in the title line');
assert.match(gen, /\{ set: true, tip:/, 'Interface and Port greyed out for good (Rule 18.13)');
assert.match(gen, /'3\. Built into', 'ro'/, 'a built in Device shows what it is built into');
assert.match(gen, /dbPop: true/, 'Database and .API on the Overlay line');
assert.match(app, /if \(isBuiltIn\(it\) && isGenDrill\(it\)\) return genDeviceFields/, 'built in parts use it before the other dialogs');
assert.match(app, /if \(isGenDrill\(it\)\) return genDeviceFields\(it, item, oldF\(\)\)/, 'every other Device uses it');
assert.match(app, /const vpart = vpPartAt\(ev\);[\s\S]{0,200}if \(vpart\) return vpPartOpen\(vpart\)\(\);/, 'double-click a Vessel Device part opens it');
assert.ok(app.includes("const vpPartOpen = vp => () => { if (vp.dev) return editItem('el', vp.dev);"), 'its own Properties');
assert.match(fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8'), /\.vwPart\.vpPart \{ pointer-events: auto/);
assert.ok(fs.existsSync(new URL('../help/148-every-device-dialog.md', import.meta.url)), 'Help 148');
console.log('devicedrill ok');
