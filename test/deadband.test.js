// Deadband Device (as in BruControl, Fritz 2026-11-05, Rule 6.17): every Calc Time the output % steps toward the Target,
// by the Inner Band Drive close in and the Outer Band Drive further out, and is left alone inside the Deadband
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Control } from '../lib/control.js';
import { elementTopic } from '../public/helpmap.js';
import { isHeating } from '../public/links.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'deadband'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
  { name: 'Temp', type: 'temperature', sensor: 'simulated' },
  { name: 'DBand_HLT', type: 'deadband', typeCode: 'DBand', device: 'MB', channel: 5, input: 'Temp', target: 152,
    deadbandOffset: 0.5, innerBandOffset: 2, initialOutput: 40, innerBandDrive: 1, outerBandDrive: 5, calcTime: 10, outTime: 2 },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const ctl = new Control(store);
const val = () => store.getProp('DBand_HLT', 'value');
assert.equal(store.getProp('DBand_HLT', 'deadbandoffset'), 0.5, 'its settings load from the Schema');

let t = 0;
const run = (pv, calcs = 1) => { store.setProp('Temp', 'value', pv); for (let i = 0; i < calcs * 10; i++) { t += 1000; ctl.tick(t); } return val(); };
store.setProp('Temp', 'value', 140); ctl.tick(t);
assert.equal(val(), 0, 'off until Enabled');
store.setProp('DBand_HLT', 'enabled', true); ctl.tick(t);
assert.equal(val(), 40, 'starts at the Initial Output');
assert.equal(run(140), 45, 'outer band: up by the Outer Band Drive');
assert.equal(run(151), 46, 'inner band: up by the Inner Band Drive');
assert.equal(run(151.8, 3), 46, 'inside the Deadband: left alone');
assert.equal(run(152.4, 3), 46, 'also just above the Target');
assert.equal(run(153), 45, 'above: down by the Inner Band Drive');
assert.equal(run(160), 40, 'far above: down by the Outer Band Drive');
assert.equal(run(170, 20), 0, 'never below 0 %');
assert.equal(run(100, 30), 100, 'never above 100 %');

// on / off pin: on for its output % of each Out Time window (2 s)
store.setProp('DBand_HLT', 'value', 50);
let on = 0; for (let i = 0; i < 20; i++) { ctl._timeProportion(store.get('DBand_HLT'), i * 100); on += store.getProp('DBand_HLT', 'state') ? 1 : 0; }
assert.equal(on, 10, '50 % = on half of each window');

store.setProp('DBand_HLT', 'enabled', false); ctl.tick(t += 1000);
assert.equal(val(), 0, 'Disabled: output 0');
assert.equal(store.getProp('DBand_HLT', 'state'), false);

// Reversed (cooling): too warm makes the output go up
const cool = { name: 'DBand_Cool', type: 'deadband', reversed: true };
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
  { name: 'Temp', type: 'temperature', sensor: 'simulated' }, { ...cool, device: 'MB', channel: 6, input: 'Temp', target: 68, calcTime: 1, outerBandDrive: 10 }] }));
const s2 = new Store(cfg, path.join(d, 'data2')); s2.load();
const c2 = new Control(s2);
s2.setProp('Temp', 'value', 80); s2.setProp('DBand_Cool', 'enabled', true);
for (let i = 1; i <= 3; i++) c2.tick(i * 1000);
assert.ok(s2.getProp('DBand_Cool', 'value') >= 20, 'Reversed: too warm, the output goes up');

assert.deepEqual(elementTopic({ type: 'deadband' }), ['deadband-device'], 'right-click Help opens its page');
assert.ok(isHeating({ type: 'deadband' }), 'a Deadband counts as a heater');
console.log('deadband tests passed');
