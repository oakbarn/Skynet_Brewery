// Safety rules for MQTT and voice (no broker needed):  node test/mqtt.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert';
import { EventEmitter } from 'node:events';
import { Store } from '../lib/store.js'; import { MqttBridge, cleanItems } from '../lib/mqtt.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpm'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [
  { name: 'gGV_Boil', type: 'gGlobal', kind: 'value', api: 'getput' }, { name: 'gGS_Status', type: 'gGlobal', kind: 'string', readOnly: true, api: 'getput' },
  { name: 'gGV_Read', type: 'gGlobal', kind: 'value', api: 'get' }, { name: 'gGV_Off', type: 'gGlobal', kind: 'value' },
  { name: 'HLT_Element', type: 'digitalOut', device: 'SIM' }, { name: 'Pump', type: 'digitalOut', device: 'SIM' },
  { name: 'HLT_Temp', type: 'temperature', device: 'SIM', units: '°F' }, { name: 'alm', type: 'alarm' }, { name: 'tm', type: 'timer' },
  { name: 'shr', type: 'shared', dataType: 'value' }], mqtt: { items: { Pump: { control: true } } } }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const engine = Object.assign(new EventEmitter(), { running: new Map(), print() { }, exists: () => true, stopAll() { }, start() { } });
const b = new MqttBridge(store, engine);

assert.equal(b.setFromMqtt('gGV_Boil', '75'), ''); assert.equal(store.getProp('gGV_Boil', 'value'), 75);
assert.notEqual(b.setFromMqtt('gGS_Status', 'x'), '');            // read-only gGlobal
assert.notEqual(b.setFromMqtt('gGV_Read', '1'), '');             // .API Get only: read, never changed
assert.notEqual(b.setFromMqtt('gGV_Off', '1'), '');              // .API Off: not shared at all
assert.notEqual(b.setFromMqtt('HLT_Element', 'ON'), '');           // heat is off by default
assert.equal(store.getProp('HLT_Element', 'state'), false);
assert.equal(b.setFromMqtt('Pump', 'ON'), ''); assert.equal(store.getProp('Pump', 'state'), true);   // ticked
assert.notEqual(b.setFromMqtt('HLT_Temp', '200'), '');             // hardware input
assert.notEqual(b.setFromMqtt('shr', '1'), '');                    // Shared never
store.setProp('alm', 'active', true, 'ui');
assert.equal(b.setFromMqtt('alm', 'OFF'), ''); assert.equal(store.getProp('alm', 'active'), false);  // silence always allowed
assert.notEqual(b.setFromMqtt('alm', 'ON'), '');

const kinds = Object.fromEntries(b.discoveryConfigs().map(([c, x]) => [x.unique_id, c]));
assert.equal(kinds.brewpanel_HLT_Element, 'binary_sensor'); assert.equal(kinds.brewpanel_Pump, 'switch');
assert.equal(kinds.brewpanel_HLT_Temp, 'sensor'); assert.equal(kinds.brewpanel_gGS_Status, 'sensor'); assert.equal(kinds.brewpanel_gGV_Read, 'sensor'); assert.equal(kinds.brewpanel_gGV_Off, undefined);
assert.equal(kinds.brewpanel_gGV_Boil, undefined); assert.equal(kinds.brewpanel_shr, undefined);
assert.equal(kinds.brewpanel_stop_all_scripts, 'button');
assert.deepEqual(cleanItems(store, { Pump: { voice: true, control: true }, HLT_Temp: { voice: false, control: false } }), { Pump: { control: true }, HLT_Temp: { voice: false } });
console.log('mqtt safety tests passed');
