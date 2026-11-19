// "Recheck dialogs" pass, part 2 (OakBarn Brewery, 2026-11-18/19, Rules 18.47, 18.50, Help 148): every other dialog in Skynet follows
// the Model ("change the existing dialogs in 3 vessel and any templates and other things in skynet so we have a consistent look and flow")
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
const cut = (a, b) => { const i = app.indexOf(a); assert.ok(i > 0, a); return app.slice(i, app.indexOf(b, i + a.length)); };
const inOrder = (src, keys, what) => { const at = keys.map(k => src.indexOf(k)); assert.ok(at.every((x, i) => x >= 0 && (i === 0 || x > at[i - 1])), what + ': ' + keys[at.findIndex((x, i) => x < 0 || (i && x <= at[i - 1]))]); };

// the Switch family (#5): State, Graphic, Picture, Overlay (Database and .API in its ⬢), Linked Device, place, Widget Type
const semi = cut('const semiWidgetFields = ', '\n};');
inOrder(semi, ["['_state', 'State', 'state'", "['_spv', 'Graphic', 'semipic'", "['imageOff', 'Picture'", "['imageOverlay', 'Overlay', 'gpick'", "['deviceControlled', 'Linked Device'", '...wgtPlace()', 'wgtType('], 'Switch family order');
assert.match(semi, /'imageOverlay', 'Overlay', 'gpick', 'overlays', false, false, \{ tip: SEMI_OVERLAY_TIP, dbPop: true \}/, 'Database and .API on the Overlay line');
assert.match(app, /function semiGraphic\(/, 'the Graphic of a Switch is drawn as on its Tab');

// no Graphic Widgets (#2): Background (Show / None), Fore color, Back color on their own lines
const look = cut('const NOGFX_LOOK = ', '\n//');
inOrder(look, ["['panelBg', 'Background', 'sel'", '[fore, ', "['backColor', 'Back color', 'color'"], 'Background, Fore color, Back color');
assert.ok((app.match(/\.\.\.NOGFX_LOOK\(/g) || []).length >= 8, 'every no Graphic Widget has the look lines');
assert.match(app, /classList\.toggle\('noPanel', e\.panelBg === 'none'\)/, 'Background None draws no panel');
assert.match(css, /\.el\.noPanel/, 'the noPanel look');

// the older Widgets and the drawn things: the title line, 1. Label, Label Visible, 2. Tab, Layer Order, 3. Name, ..., Type last
const old = cut('function oldWidgetModel(', '\n}\n');
inOrder(old, ["'1. Label'", "'Label Visible'", "'2. Tab'", "'3. Name'", 'wgtPlace()', 'wgtType('], 'older Widgets order');
assert.match(app, /return isDevice\(it\) \? all : oldWidgetModel\(it, all\);/, 'the generic dialog uses the Model');
const gfx = cut('function gfxModel(', '\n}\n');
inOrder(gfx, ["'1. Label'", "'Label Visible'", "'2. Tab'", '...(layer ? [layer] : [])', "'3. Name'", '...own, ...place', "'Device Type'", "'Widget Type'"], 'drawn things order');
assert.match(app, /gfxModelOf\(fields, item\)/, 'every drawn thing goes through the Model');

// Integrated Devices: the Add box is 1. Label, Label Visible, 2. Interface; ➕ Add Device; no clashing numbers in its Properties
const intAdd = cut('async function newIntegratedDevice(', '\n}\n');
inOrder(intAdd, ["['label', '1. Label'", "['labelVisible', 'Label Visible'", 'rimsFields(o, true)'], 'Integrated Add box order');
assert.ok(!intAdd.includes("'Create'"), 'the Add box says ➕ Add Device');
const rims = cut('function rimsFields(', '\n}\n');
assert.match(rims, /add \? '2\. Interface' : 'Interface'/);
assert.ok(!/'3\. (Available|OneWire)/.test(rims), 'no 3. on its Ports');

// the Picture Widget (#3): 2. Tab, 3. Name, Graphic, Picture, Background with its 3 paths in its ⬢
const pic = cut('function pictureWidgetFields(', '\n}\n');
assert.match(pic, /\['background', 'Background', 'sel'/);
assert.match(app, /const PIC_BG_POP = \{ title: 'Backgrounds', fields: \[\['backpath'.*\['backpath_2'.*\['backpath_3'/);

// nothing taken away (Design Rule 1): the boxes that moved into a ⬢ are still there
for (const k of ['DATAW_LOOK_POP', 'TEXT_LOOK_POP', 'LBL_LOOK_POP', 'SEMI_PIC_POP', 'SEMI_TEXT_POP', "'bgColor'", "'backpath_2'", "'backpath_3'"]) assert.ok(app.includes(k), k);

const help = fs.readFileSync(new URL('../help/148-every-device-dialog.md', import.meta.url), 'utf8');
assert.match(help, /\*\*Every other dialog\*\* \(the "Recheck dialogs" pass, part 2\)/);
console.log('recheck part 2 (every other dialog) ok');
