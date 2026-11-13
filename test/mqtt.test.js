// Safety rules for MQTT and voice (no broker needed):  node test/mqtt.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert';
import { EventEmitter } from 'node:events';
import { Store } from '../lib/store.js'; import { MqttBridge, cleanItems } from '../lib/mqtt.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpm'));
// .API is the one switch for the web API, MQTT and voice (Rule 6.18, OakBarn Brewery 2026-11-13); a gGlobal is never shared (Rule 1.33)
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [
  { name: 'gGV_Boil', type: 'gGlobal', kind: 'value', api: 'getput' },
  { name: 'HLT_Element', type: 'digitalOut', device: 'SIM' },                       // .API Off: not shared
  { name: 'Pump', type: 'digitalOut', device: 'SIM', api: 'getput', apiName: 'Wort Pump' },
  { name: 'Valve', type: 'digitalOut', device: 'SIM', api: 'get' },
  { name: 'HLT_Temp', type: 'temperature', device: 'SIM', units: '°F', api: 'getput' },
  { name: 'alm', type: 'alarm', api: 'get' }, { name: 'tm', type: 'timer', api: 'getput' },
  { name: 'vw_Boil', type: 'valueWidget', api: 'getput', units: 'min' }], mqtt: { items: { HLT_Element: { voice: true, control: true } } } }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const engine = Object.assign(new EventEmitter(), { running: new Map(), print() { }, exists: () => true, stopAll() { }, start() { } });
const b = new MqttBridge(store, engine);

assert.notEqual(b.setFromMqtt('gGV_Boil', '75'), '');               // a gGlobal: never
assert.notEqual(b.setFromMqtt('HLT_Element', 'ON'), '');            // .API Off: an older tick no longer counts
assert.equal(store.getProp('HLT_Element', 'state'), false);
assert.equal(b.setFromMqtt('Pump', 'ON'), ''); assert.equal(store.getProp('Pump', 'state'), true);   // Read & Control
assert.notEqual(b.setFromMqtt('Valve', 'ON'), ''); assert.equal(store.getProp('Valve', 'state'), false);   // Read Only
assert.notEqual(b.setFromMqtt('HLT_Temp', '200'), '');              // hardware input, even with Read & Control
assert.equal(b.setFromMqtt('vw_Boil', '60'), ''); assert.equal(store.getProp('vw_Boil', 'value'), 60);   // a Widget too
store.setProp('alm', 'active', true, 'ui');
assert.equal(b.setFromMqtt('alm', 'OFF'), ''); assert.equal(store.getProp('alm', 'active'), false);  // silence always allowed
assert.notEqual(b.setFromMqtt('alm', 'ON'), '');

const kinds = Object.fromEntries(b.discoveryConfigs().map(([c, x]) => [x.unique_id, c]));
const names = Object.fromEntries(b.discoveryConfigs().map(([, x]) => [x.unique_id, x.name]));
assert.equal(kinds.brewpanel_HLT_Element, undefined); assert.equal(kinds.brewpanel_gGV_Boil, undefined);
assert.equal(kinds.brewpanel_Pump, 'switch'); assert.equal(names.brewpanel_Pump, 'Wort Pump', 'API_Name is what voice says');
assert.equal(kinds.brewpanel_Valve, 'binary_sensor'); assert.equal(kinds.brewpanel_HLT_Temp, 'sensor');
assert.equal(kinds.brewpanel_vw_Boil, 'number');
assert.equal(kinds.brewpanel_stop_all_scripts, 'button');
assert.deepEqual(cleanItems(store, { Pump: { voice: true, control: true } }), {}, 'no separate ticks any more');
console.log('mqtt safety tests passed');
