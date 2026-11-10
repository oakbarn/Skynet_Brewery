// Heat Hysteresis by what switches it (OakBarn Brewery, 2026-11-10, Rule 6.29): Optical SSR 0.5 to 3 °F; Contactor and Mechanical relay
// 2 to 5 °F with an On delay of at least 60 s (°C converted). Properties Save, a Process and the .API are refused outside it; the Brain
// never runs outside it; the BruControl Import starts heaters as Optical SSR and brings an offset into range.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Control } from '../lib/control.js';
import { heatHysProblem, heatHysRange, switchedBy } from '../public/heatmethod.js';

const he = (x = {}) => ({ name: 'hE', type: 'digitalOut', subtype: 'element', heatMethod: 'hysteresis', input: 'T', onOffset: 1, ...x });
assert.equal(switchedBy(he()), 'ssr', 'an Optical SSR to start');
assert.equal(heatHysProblem(he(), { units: '°F' }), null);
assert.match(heatHysProblem(he({ onOffset: 0.2 })), /0\.5 to 3 °F/);
assert.match(heatHysProblem(he({ onOffset: 4 })), /Rule 6\.29/);
assert.equal(heatHysProblem(he({ onOffset: -6 })), null, 'cooling has no range here');
assert.match(heatHysProblem(he({ switchedBy: 'contactor', onOffset: 1, onDelay: 60 })), /2 to 5 °F/);
assert.match(heatHysProblem(he({ switchedBy: 'contactor', onOffset: 3, onDelay: 10 })), /60 seconds/);
assert.match(heatHysProblem(he({ switchedBy: 'relay', onOffset: 3, onDelay: 10 })), /at least 60 seconds/);
assert.equal(heatHysProblem(he({ switchedBy: 'contactor', onOffset: 3, onDelay: 60 })), null);
assert.deepEqual([heatHysRange(he(), { units: '°C' }).min, heatHysRange(he(), { units: '°C' }).max], [0.3, 1.7], '°C converted');
assert.equal(heatHysProblem(he({ heatMethod: 'pid', onOffset: 9 })), null, 'Hysteresis not allowed: nothing to check');
assert.match(heatHysProblem(he({ heatMethod: 'pid', methodSpot_hysteresis: true, onOffset: 9 })), /0\.5 to 3/, 'ticked Hysteresis is checked');

// the Brain: a Process is refused; the control never runs outside the range
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'heathys'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }], elements: [
  { name: 'T', type: 'temperature', sensor: 'simulated', units: '°F' },
  he({ device: 'MB', channel: 5, target: 150, onOffset: 1 }),
  he({ name: 'hC', device: 'MB', channel: 6, input: 'T', target: 150, onOffset: 0.1, switchedBy: 'contactor' }),
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
assert.throws(() => store.setProp('hE', 'onoffset', 6), /0\.5 to 3 °F/, 'a Process may not set 6 on an SSR');
store.setProp('hE', 'onoffset', 2.5); assert.equal(store.getProp('hE', 'onoffset'), 2.5);
assert.throws(() => store.setProp('hC', 'ondelay', 5), /Rule 6\.29/);
const ctl = new Control(store);
store.setProp('hC', 'state', true);
store.setProp('T', 'value', 149.5); ctl.tick(1000);
assert.equal(store.getProp('hC', 'output'), false, 'a Contactor saved at 0.1 runs at 2 °F: 149.5 is not low enough');
store.setProp('T', 'value', 147.9); ctl.tick(2000); ctl.tick(30000);
assert.equal(store.getProp('hC', 'output'), false, 'and waits its 60 s On delay');
ctl.tick(63000);
assert.equal(store.getProp('hC', 'output'), true, 'then heats');
clearTimeout(store._persistTimer);
console.log('heat hysteresis range tests passed');
