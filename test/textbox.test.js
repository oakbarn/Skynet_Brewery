// Text box attributes (Fritz, 2026-10-21): the Defaults, and what a Process can read and change.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { tbAlign, tbPixels, textDefaults, firstSet, placeWith } from '../public/textbox.js';
import { Store, attrsOf } from '../lib/store.js';

assert.equal(tbAlign('left justified'), 'Left');
assert.equal(tbAlign('Centered'), 'Center');
assert.equal(tbAlign('RIGHT'), 'Right');
assert.equal(tbAlign(''), '');
assert.equal(tbAlign('up'), null);
assert.equal(tbPixels('12.4'), 12);
assert.equal(tbPixels('x'), null);

const d0 = textDefaults({});
assert.deepEqual([d0.visible, d0.wrap, d0.width, d0.height, d0.x, d0.y, d0.foreColor, d0.nameFontSize], [true, true, 220, 40, 40, 40, '', 0]);
const d1 = textDefaults({ textVisible: false, textWrap: false, textX: 0, textWidth: 300, textAlign: 'Right', nameFontSize: 14 });
assert.deepEqual([d1.visible, d1.wrap, d1.x, d1.width, d1.align, d1.nameFontSize], [false, false, 0, 300, 'Right', 14]);
assert.equal(firstSet('', undefined, 'Red', 'Blue'), 'Red');
assert.equal(firstSet('', null), '');
const g = { x: 1, y: 2, w: 3, h: 4 };
assert.equal(placeWith(g, { xposition: '' }), g, 'nothing set by a Process: the same object');
assert.deepEqual(placeWith(g, { xposition: 50, height: 9 }), { x: 50, y: 2, w: 3, h: 9 });

// a Store with one pump and two Texts (one with no name yet)
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'textbox-'));
const cfg = path.join(dir, 'brewery.json');
fs.writeFileSync(cfg, JSON.stringify({
  elements: [{ name: 'Pump_1', type: 'digitalOut', x: 10, y: 20, w: 100, h: 50 }, { name: 'Text_1', type: 'label' }],
  graphics: [{ id: 'a', kind: 'text', text: 'Hello', x: 5, y: 6, w: 220, h: 40 }, { id: 'b', kind: 'text', name: 'Text_9', text: 'Hidden', visible: false }],
}));
const s = new Store(cfg, dir); s.load();
assert.equal(s.config.graphics[0].name, 'Text_2', 'a Text gets a name no Device has');
assert.ok(s.has('Text_2') && s.has('Text_9'));
assert.equal(s.getProp('Text_2', 'value'), 'Hello');
assert.equal(s.getProp('Text_9', 'visible'), false);
assert.equal(s.getProp('Text_2', 'width'), 220, 'an empty width reads as the one in its properties');
assert.equal(s.getProp('Pump_1', 'xposition'), 10);
const seen = [];
s.on('change', (n, p, v) => seen.push([n, p, v]));
s.setProp('Text_2', 'visible', false);
s.setProp('Text_2', 'ForeColor'.toLowerCase(), 'Red');
s.setProp('Text_2', 'value', 'Mashing');
s.setProp('Text_2', 'xposition', 300);
s.setProp('Pump_1', 'alignment', 'left justified');
s.setProp('Pump_1', 'backcolor', 'Black');
assert.equal(s.getProp('Text_2', 'visible'), false);
assert.equal(s.getProp('Text_2', 'text'), 'Mashing');
assert.equal(s.getProp('Text_2', 'xposition'), 300);
assert.equal(s.getProp('Pump_1', 'alignment'), 'Left');
assert.deepEqual(seen.map(x => x[1]), ['visibility', 'forecolor', 'text', 'xposition', 'alignment', 'backcolor']);
assert.equal(s.snapshot().Text_2.forecolor, 'Red', 'the screens get the Texts too');
assert.throws(() => s.setProp('Text_2', 'state', true), /is a Text/);
assert.throws(() => s.setProp('Pump_1', 'width', 0), /pixels above 0/);
assert.throws(() => s.setProp('Pump_1', 'alignment', 'Up'), /Left, Center or Right/);
s.setProp('Pump_1', 'xposition', '');
assert.equal(s.getProp('Pump_1', 'xposition'), 10, '"" puts back its properties');
for (const a of ['visible', 'forecolor', 'backcolor', 'alignment', 'width', 'height', 'x_hPosition', 'y_vPosition']) assert.ok(attrsOf(s.get('Pump_1')).includes(a), a);
// x_hPosition / y_vPosition are the names now (Fritz, 2026-10-28); xposition / yposition still work
assert.ok(!attrsOf(s.get('Pump_1')).includes('xposition'), 'only the new name is offered');
s.setProp('Pump_1', 'x_hposition', 400);
assert.equal(s.getProp('Pump_1', 'xposition'), 400);
assert.equal(s.getProp('Pump_1', 'X_hPosition'), 400);
s.setProp('Text_2', 'y_vposition', 77);
assert.equal(s.getProp('Text_2', 'yposition'), 77);
assert.deepEqual(attrsOf(s.get('Text_2')), ['alignment', 'backcolor', 'forecolor', 'height', 'hidden', 'text', 'visible', 'width', 'x_hPosition', 'y_vPosition']);
// a layout save names a new Text and starts the Texts over from their properties
s.saveLayout({ graphics: [...s.config.graphics, { id: 'c', kind: 'text', text: 'New' }] });
assert.equal(s.config.graphics[2].name, 'Text_3');
assert.equal(s.getProp('Text_2', 'text'), 'Hello');
fs.rmSync(dir, { recursive: true, force: true });
console.log('textbox tests passed');
