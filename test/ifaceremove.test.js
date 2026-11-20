// Removing an Interface safely (Panel Updates entry 29, Rule 2.63), checked on the 3 Vessel 1 Pump sample
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ifaceUse, useNames, inUse, moveIface, pinsShown, removeTip } from '../public/ifaceremove.js';
import { processesUsing } from '../public/copytab.js';
import { compileFrench, frenchOf } from '../public/hoverhelp.js';

const dir = new URL('../samples/configs/three-vessel-one-pump/', import.meta.url);
const c = JSON.parse(fs.readFileSync(new URL('config.json', dir)));
const texts = fs.readdirSync(new URL('processes/', dir)).map(f => [f.replace(/\.txt$/, ''), fs.readFileSync(new URL('processes/' + f, dir), 'utf8')]);
const BM = 'Brewery Mega';

// what uses it: every Device on it, with its Port; Widgets and pictures tied to them; the Processes that use them
const use = ifaceUse(c, BM);
assert.equal(use.devices.length, c.elements.filter(e => e.device === BM).length, 'every Device on the Interface is listed');
assert.ok(use.devices.length >= 10, 'the sample has its Devices on Brewery Mega');
// a Clone of a Device, and a Widget that names a Device in a setting, are tied to it (the sample's pipes are not: they only end on it)
{ const d = use.devices[0], cc = { ...c, graphics: [...c.graphics, { kind: 'clone', name: d.name + '_C1', of: d.name }], elements: [...c.elements, { type: 'hysteresis', name: 'wgt_X', output: d.name }] };
  const w = ifaceUse(cc, BM).widgets.map(x => x.name); assert.ok(w.includes(d.name + '_C1') && w.includes('wgt_X'), 'Clones and Widgets tied to its Devices are listed');
  assert.ok(!use.widgets.some(g => g.kind === 'pipe'), 'a pipe that ends on a Device is not a Widget'); }
assert.ok(use.devices.some(e => pinsShown(e).length), 'Devices show their Port');
const procs = processesUsing(texts, useNames(use, BM));
assert.ok(procs.length > 0, 'the sample Processes use its Devices');
assert.ok(inUse(use, procs));
// an Interface nothing uses
const empty = { ...c, devices: [...c.devices, { name: 'Spare Mega', id: 'SM', board: 'mega' }] };
const u2 = ifaceUse(empty, 'Spare Mega');
assert.ok(!inUse(u2, processesUsing(texts, useNames(u2, 'Spare Mega'))), 'a new Interface is not in use');

// Move them: every Device goes to the new Interface, keeps its name and settings
const r = moveIface(empty, BM, 'Spare Mega');
assert.equal(r.stay.length, 0, 'nothing on an empty Mega clashes');
assert.equal(r.moved.length, use.devices.length);
for (const e of r.elements.filter(x => r.moved.includes(x.name))) {
  const was = c.elements.find(x => x.name === e.name);
  assert.equal(e.device, 'Spare Mega');
  assert.deepEqual({ ...e, device: BM }, was, 'only its Interface changed');
}
assert.equal(c.elements.filter(e => e.device === BM).length, use.devices.length, 'the config given is not changed');
assert.ok(!inUse(ifaceUse({ ...empty, elements: r.elements, graphics: r.graphics, probes: r.probes }, BM), []), 'after the move, nothing uses Brewery Mega');

// a Port already taken on the new Interface: that Device stays and is listed with the reason
const one = use.devices.find(e => pinsShown(e).length && !/^1w/.test(pinsShown(e)[0]));
const taken = { ...empty, elements: [...c.elements, { ...one, name: 'SM_taken', device: 'Spare Mega' }] };
const r2 = moveIface(taken, BM, 'Spare Mega');
assert.ok(r2.stay.some(s => s.name === one.name && /is taken on Spare Mega/.test(s.why)), 'the clash is listed');
assert.equal(r2.elements.find(e => e.name === one.name).device, BM, 'the clashing Device stays');
assert.throws(() => moveIface(c, BM, 'Nope'), /no Interface called Nope/);

// the large warning on Remove, and its French (Rule 11.11)
const t = removeTip('BM', BM, { devices: 23, widgets: 31, procs: 6 });
assert.match(t, /^⚠ Removing an Interface can break your whole brewery\nBM: Brewery Mega is in use by: Devices 23, Widgets 31, Processes 6\./);
assert.match(removeTip('SM', 'Spare Mega', { devices: 0, widgets: 0, procs: 0 }), /Nothing uses this Interface/);
const fr = compileFrench(JSON.parse(fs.readFileSync(new URL('../public/hoverhelp-fr.json', import.meta.url))));
for (const x of [t, removeTip('SM', 'Spare Mega', { devices: 0, widgets: 0, procs: 0 })]) {
  const f = frenchOf(x, fr);
  for (const line of f.split('\n')) assert.ok(!/\b(the|is|Nothing|Interface can)\b/.test(line.replace(/BM: Brewery Mega|Spare Mega/g, '')), 'French for: ' + line);
}
console.log('ifaceremove: all checks passed');
