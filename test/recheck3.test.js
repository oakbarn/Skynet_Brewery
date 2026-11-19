// Every dialog uses the Model's rows, in the Model's places (OakBarn Brewery, 2026-11-19, Rule 18.51, Help 148): "Same Layout, same
// fields for the same things"; "We redo it and make the Model Work"
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const cut = (a, b) => { const i = app.indexOf(a); assert.ok(i > 0, a); return app.slice(i, app.indexOf(b, i + a.length)); };
const fn = cut('function deviceModel(', '\n}\n');
// the Model's order in the dialog it builds
const ret = fn.slice(fn.indexOf('return [...title'));
const order = ['...title', 'state', 'label', 'lv', 'ifaceRow', 'tab', 'layer', 'name', '...chg', 'sug', '...prof', 'graphic', '...look', '...orient', 'hose', 'cover', 'ovl', 'model', '...fits', '...own', 'xy', 'typeRow'];
let at = -1;
for (const k of order) { const i = ret.indexOf(k, at + 1); assert.ok(i > at, 'Model order: ' + k); at = i; }
// every Device but the Pump (the Model), its Add box, and every Widget but the Picture and Alarm Widgets
assert.match(app, /if \(kind === 'el' && isDevice\(item\) && !isPumpDev\(item\) && fields\) fields = deviceModelOf\(fields, item\);/);
assert.match(app, /else if \(kind === 'el' && !isDevice\(item\) && !isPicW\(item\) && !\(item\.type === 'alarm' && item\.alarmClass\) && fields\) fields = deviceModelOf\(fields, item\);/);
assert.match(app, /isPumpDev\(e\) \? fields : deviceModel\(e, e, fields\)/, 'the Add box too');
// a Graphic on every one, picture Paths in its ⬢, the Toggle in the Cover's place, Database and .API on the Overlay line
assert.match(fn, /\['_spv', 'Graphic', ownPic \? 'devpic' : 'semipic'/);
assert.match(fn, /title: 'Pictures'/);
assert.match(fn, /x\[0\] === 'tap'/);
assert.match(fn, /'_dbHead', 'Database and \.API', 'attrhead'/);
// nothing taken away: the rows not in the Model are kept as its own settings
assert.match(fn, /const own = list\.filter\(f => !isF\(f\) \|\| !used\.has\(f\)\);/);
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /^18\.51 \*\*Every dialog uses the Model's rows/m);
console.log('recheck part 3 (the Model\'s rows in the Model\'s places) ok');
