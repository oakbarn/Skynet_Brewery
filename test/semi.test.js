// Semi_Widgets_Devices (Fritz, 2026-11-02, Rule 1.20): Switch, Push Button, Pulse Button and LED with device_controlled
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';
import { apiPut } from '../lib/itemapi.js';
import { SEMI_TYPES, canControl, controllableNames, checkControlled, isSemi } from '../public/semi.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'semi'));
const cfg = path.join(d, 'c.json');
const elements = [
  { name: 'Pump_1', type: 'digitalOut', subtype: 'pump', device: 'sim', channel: 6, api: 'getput' },
  { name: 'Pump_2', type: 'digitalOut', subtype: 'pump', device: 'sim', channel: 7 },
  { name: 'VGC_Manual', type: 'digitalOut', subtype: 'valve', valveType: 'manual' },
  { name: 'HLT_PID', type: 'pid', device: 'sim', channel: 8 },
  { name: 'Float', type: 'digitalIn', device: 'sim', channel: 30 },
  { name: 'sw_Pump', type: 'switch', deviceControlled: 'Pump_1', api: 'getput' },
  { name: 'sw_Pump_Too', type: 'switch', deviceControlled: 'Pump_1' },
  { name: 'pb_Jog', type: 'pushButton', deviceControlled: 'Pump_2' },
  { name: 'pl_Ping', type: 'pulseButton' },
  { name: 'pl_Pump2', type: 'pulseButton', deviceControlled: 'Pump_2', api: 'getput' },
  { name: 'led_HLT', type: 'led', deviceControlled: 'HLT_PID' },
  { name: 'led_Plain', type: 'led' },
  { name: 'sw_None', type: 'switch' },
];
fs.writeFileSync(cfg, JSON.stringify({ elements }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const wait = ms => new Promise(r => setTimeout(r, ms));
const st = n => store.getProp(n, 'state');

// the class
assert.deepEqual(SEMI_TYPES, ['switch', 'pushButton', 'pulseButton', 'led', 'manualValve']);
assert.ok(isSemi({ type: 'manualValve' }) && isSemi({ type: 'led' }) && !isSemi({ type: 'digitalOut' }));
// only Devices with an ON / OFF state can be picked: not a Manual valve Device, not an input, not another Widget
assert.deepEqual(controllableNames(elements), ['HLT_PID', 'Pump_1', 'Pump_2']);
assert.ok(!canControl(elements.find(e => e.name === 'VGC_Manual')) && !canControl(elements.find(e => e.name === 'Float')));

// device_controlled reads as the Device's name, or None; it is read only in a Process
assert.equal(store.getProp('sw_Pump', 'device_controlled'), 'Pump_1');
assert.equal(store.getProp('sw_None', 'device_controlled'), 'None');
assert.throws(() => store.setProp('sw_Pump', 'device_controlled', 'Pump_2'), /read only/);

// Switch slid ON -> its Device ON, and every other Switch on that Device follows
store.setProp('sw_Pump', 'state', true, 'ui');
assert.equal(st('Pump_1'), true);
assert.equal(st('sw_Pump_Too'), true);
// the Device turned OFF on its own (a Process, its own Tab) -> the Switches slide OFF
store.setProp('Pump_1', 'state', false, 'script');
assert.equal(st('sw_Pump'), false); assert.equal(st('sw_Pump_Too'), false);
// the name alone in a Process means .state
store.setProp('sw_Pump', 'value', true, 'script');
assert.equal(st('Pump_1'), true);
store.setProp('Pump_1', 'state', false, 'script');

// a Push Button: Device ON while held
store.setProp('pb_Jog', 'state', true, 'ui'); assert.equal(st('Pump_2'), true);
store.setProp('pb_Jog', 'state', false, 'ui'); assert.equal(st('Pump_2'), false);

// a Pulse Button: one 100 ms ON, and the Device gets the same pulse
store.setProp('pl_Pump2', 'state', true, 'ui');
assert.equal(st('Pump_2'), true); assert.equal(st('pb_Jog'), true, 'the Push Button on the same Device shows it too');
await wait(250);
assert.equal(st('pl_Pump2'), false); assert.equal(st('Pump_2'), false, 'the pulse is over');
// ... but when it only follows its Device, it shows ON as long as the Device is ON and never turns it off itself
store.setProp('Pump_2', 'state', true, 'script');
await wait(250);
assert.equal(st('Pump_2'), true); assert.equal(st('pl_Pump2'), true);
store.setProp('Pump_2', 'state', false, 'script');
assert.equal(st('pl_Pump2'), false);
// a Pulse Button with no Device
store.setProp('pl_Ping', 'state', true, 'ui'); assert.equal(st('pl_Ping'), true);
await wait(250); assert.equal(st('pl_Ping'), false);

// an LED on a heater: ON while the heater is Enabled (Rule 7.9), and setting the LED enables / disables it
store.setProp('HLT_PID', 'enabled', true, 'script'); assert.equal(st('led_HLT'), true);
store.setProp('led_HLT', 'state', false, 'script'); assert.equal(store.getProp('HLT_PID', 'enabled'), false);
store.setProp('led_Plain', 'state', true, 'script'); assert.equal(st('led_Plain'), true);

// a Process uses them like any Device or Widget
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
eng.write('p', 'sw_Pump = true\nwait Pump_1 == true\nled_Plain = false\n');
eng.start('p');
for (let i = 0; i < 100 && eng.running.has('p'); i++) await wait(20);
assert.equal(st('Pump_1'), true); assert.equal(st('led_Plain'), false);
store.setProp('Pump_1', 'state', false, 'script');

// outside programs (.API, Rule 6.14): only when the Device controlled may be changed from outside too
apiPut(store, 'sw_Pump', null, true); assert.equal(st('Pump_1'), true);
store.setProp('Pump_1', 'state', false, 'script');
assert.throws(() => apiPut(store, 'pl_Pump2', null, true), /switches the Device "Pump_2"/);
assert.throws(() => apiPut(store, 'sw_Pump', 'device_controlled', 'Pump_2'), /can't be changed from outside/);

// the layout check: a Device with no ON / OFF state is refused; a Device deleted since goes back to None
const lay = [...elements.map(e => ({ ...e })), { name: 'sw_Bad', type: 'switch', deviceControlled: 'Float' }];
assert.match(checkControlled(lay).errors[0], /sw_Bad.*Float/);
const lay2 = [{ name: 'sw_Gone', type: 'switch', deviceControlled: 'Pump_9' }, { name: 'sw_N', type: 'switch', deviceControlled: 'None' }];
assert.deepEqual(checkControlled(lay2), { errors: [], cleared: [['sw_Gone', 'Pump_9']] });
assert.ok(!('deviceControlled' in lay2[0]) && !('deviceControlled' in lay2[1]));

// after a layout save (and at start) a Switch shows what its Device is now
store.setProp('Pump_1', 'state', true, 'script');
store.saveLayout({ elements: elements.map(e => ({ ...e })) });
assert.equal(st('sw_Pump'), true);
store.setProp('Pump_1', 'state', false, 'script');

// a rename of the Device follows into device_controlled
const { renameElementRefs } = await import('../lib/renames.js');
const sw = renameElementRefs({ name: 'sw_Pump', type: 'switch', deviceControlled: 'Pump_1' }, new Map([['Pump_1', 'Pump_Wort']]));
assert.equal(sw.deviceControlled, 'Pump_Wort');

eng.stopAll?.();
console.log('semi ok');
// the Boolean Widgets (Rule 1.20, 2026-11-09) run here, so package.json's one-line test list is left alone beside other open changes
await import('./boolwidget.test.js');
process.exit(0);
