// Interface IDs, Tab IDs and suggested Device names (public/naming.js)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { suggestName, uniqueName, hydroPort, oneWirePort, parseLabel, upgradeCode, TYPE_CODES, TYPE_NAMES, defaultInterfaceId, cleanInterfaceId, defaultTabId, cleanTabId, assignIds, checkIds, defaultCode, typeCodes, portClash } from '../public/naming.js';
import { tokenize } from '../lib/engine.js';
import { temperatureFrom } from '../lib/sensors.js';
import { Store } from '../lib/store.js';

// Fritz, 2026-10-23: InterfaceID_Port_DeviceTypeID_ParsedLabel__TabID (the port always in it, the type third)
assert.equal(suggestName({ iface: 'MB', port: 25, code: 'P_L_Vlv', label: 'Fly Sparge', tab: 'SP' }), 'MB_25_P_L_Vlv_Fly_Sparge__SP');
assert.equal(suggestName({ iface: 'MB', port: 'A0', code: '10KNTC', label: 'Mash/Tun', tab: 'SP' }), 'MB_A0_10KNTC_Mash~Tun__SP');
assert.equal(parseLabel('  Hot  Liquor Tank '), 'Hot_Liquor_Tank', 'spaces at the ends go, spaces inside become _');
assert.equal(parseLabel('a<b>c:d"e/f\\g|h?i*j.k,l'), 'a~b~c~d~e~f~g~h~i~j~k~l', 'each of < > : " / \\ | ? * . , becomes ~');
assert.equal(parseLabel('.Kettle'), '~Kettle', 'a leading dot becomes ~ too');
assert.equal(parseLabel('Mash 🍺 Tun\u0007'), 'Mash_Tun', 'emoji and control characters are dropped');
assert.equal(parseLabel('Mash 👨‍👩‍👧 Tun © 2'), 'Mash_Tun_©_2', 'joined emoji go, © stays (as the name rules count it)');
assert.equal(parseLabel('Kettle #2 (Boil)'), 'Kettle_#2_(Boil)', 'other characters stay');
assert.equal(suggestName({ iface: 'MB', port: '700', code: '1W', label: '', tab: 'BR' }), 'MB_700_1W__BR', 'an empty Label is left out');
assert.equal(suggestName({ iface: 'MB', code: 'Pump', label: 'Wort' }), 'MB_Pump_Wort', 'no tab: no __');
const used = new Set(['MB_Pump_Wort__BR', 'MB_Pump_Wort_2__BR']);
assert.equal(uniqueName('MB_Pump_Wort__BR', n => used.has(n)), 'MB_Pump_Wort_3__BR', 'a name already used gets a number after the Label');
assert.equal(uniqueName('MB_Pump_Mash__BR', n => used.has(n)), 'MB_Pump_Mash__BR');
const toks = tokenize('if MB_E_L_Vlv_Fly~Sparge__SP == true', 1);
assert.equal(toks[1].v, 'MB_E_L_Vlv_Fly~Sparge__SP', 'a name with ~ works bare in a Process');

// Device Type IDs: unique (any capitals), Fritz's own up to 7 characters, the added ones 6 or fewer
const ids = Object.keys(TYPE_NAMES);
assert.equal(new Set(ids.map(i => i.toLowerCase())).size, ids.length, 'every Device Type ID is unique');
const fritz7 = ['M_L_Vlv', 'E_L_Vlv', 'M_H_Vlv', 'E_H_Vlv', 'P_L_Vlv', 'P_H_Vlv'];
for (const i of ids) assert.ok(i.length <= 6 || fritz7.includes(i), `${i} is longer than 6 characters`);
for (const [type, list] of Object.entries(TYPE_CODES)) for (const [c, l] of list) assert.ok(l, `${type} ${c} has a description`);

// Interface IDs
assert.equal(defaultInterfaceId('Main Brewery Mega USB', []), 'MB');
assert.equal(defaultInterfaceId('Main Brewery Mega Ethernet', ['MB']), 'MB_2', 'a second MB is MB_2');
assert.equal(defaultInterfaceId('Main Brewery Mega WiFi', ['MB', 'MB_2']), 'MB_3');
assert.equal(defaultInterfaceId('MEGA1', []), 'ME', 'one word: its first two letters');
assert.equal(cleanInterfaceId('mbub'), 'MBUB');
assert.equal(cleanInterfaceId('MB_'), 'MB', 'the underscore after the ID is not part of it');
assert.throws(() => cleanInterfaceId('MBUSB'), /1 to 4 letters/);
assert.throws(() => cleanInterfaceId('M1'), /1 to 4 letters/);

// Tab IDs
assert.equal(defaultTabId('Sparge', []), 'SP');
assert.equal(defaultTabId('Batch Hops', []), 'BH');
assert.equal(defaultTabId('Sparge 2', ['SP']), 'SA', 'still 2 letters when SP is taken');
assert.equal(cleanTabId('sp'), 'SP');
assert.throws(() => cleanTabId('S'), /exactly 2 letters/);
assert.throws(() => cleanTabId('SPA'), /exactly 2 letters/);

// IDs given to older Schemas, and checked when saved
const c = { devices: [{ name: 'Main Brewery Mega USB' }, { name: 'Main Brewery Mega Ethernet' }, { name: 'X', id: 'bad id' }], workspaces: [{ name: 'Brewery' }, { name: 'Batch Hops' }, { name: 'Boil', id: 'BR' }],
  elements: [{ name: 'MB_25_PmP_Wort_BR', type: 'digitalOut', subtype: 'pump', typeCode: 'PmP' }] };
assert.equal(assignIds(c), true);
assert.equal(c.elements[0].typeCode, 'Pump', 'an old type code is updated');
assert.equal(c.elements[0].name, 'MB_25_PmP_Wort_BR', 'the Device keeps its name');
assert.deepEqual(c.devices.map(d => d.id), ['MB', 'MB_2', 'X']);
assert.deepEqual(c.workspaces.map(w => w.id), ['BR', 'BH', 'BO'], 'a second BR gets a new ID');
assert.equal(assignIds(c), false, 'nothing changes the second time');
assert.throws(() => checkIds([{ name: 'A', id: 'MB' }, { name: 'B', id: 'mb' }], 'interface'), /used twice/);
assert.deepEqual(checkIds([{ name: 'Sparge' }, { name: 'S', id: 'sp' }], 'tab').map(w => w.id), ['SA', 'SP'], 'a typed ID wins, the missing one is given');

assert.equal(hydroPort(1), '200', 'the first hydrometer is virtual port 200, as in BruControl');
assert.equal(hydroPort(3), '202');
assert.equal(oneWirePort(1), '700', 'OneWire probe 1 is virtual port 700');
assert.equal(oneWirePort(100), '799');
assert.equal(oneWirePort(''), '', 'no probe picked yet');

// Device Type IDs a new Device starts with
assert.equal(defaultCode({ type: 'digitalOut', subtype: 'valve' }), 'E_L_Vlv');
assert.equal(defaultCode({ type: 'digitalOut', subtype: 'valve', valveType: 'manual' }), 'M_L_Vlv');
assert.equal(defaultCode({ type: 'digitalOut', subtype: 'pump' }), 'Pump');
assert.equal(defaultCode({ type: 'digitalOut' }), 'DO');
assert.equal(defaultCode({ type: 'pwmOut' }), 'PWM');
assert.equal(defaultCode({ type: 'pwmOut', subtype: 'element' }), 'H_PWM');
assert.equal(defaultCode({ type: 'analogOut', subtype: 'propValve' }), 'P_L_Vlv');
assert.equal(defaultCode({ type: 'digitalIn' }, 'Float'), 'Float');
assert.equal(defaultCode({ type: 'digitalIn' }, 'Pulse'), 'DIN');
assert.equal(defaultCode({ type: 'hysteresis' }), 'Hys');
assert.equal(defaultCode({ type: 'analogIn' }, 'pH'), 'PH_Met');
assert.equal(defaultCode({ type: 'pid' }), 'PID');
assert.equal(defaultCode({ type: 'temperature' }), '1W', 'DS18B20 when no probe type is set');
assert.equal(defaultCode({ type: 'temperature', sensor: 'ntc', r0: 10000 }), '10KNTC');
assert.equal(defaultCode({ type: 'temperature', sensor: 'ntc', r0: 100000 }), '100KNT');
assert.equal(defaultCode({ type: 'temperature', sensor: 'ntc', r0: 2252 }), 'NTC');
assert.equal(defaultCode({ type: 'temperature', sensor: 'pt100' }), 'RTD');
assert.equal(defaultCode({ type: 'temperature', sensor: 'lm35' }), 'LM35');
assert.ok(typeCodes({ type: 'pwmOut' }).some(([k]) => k === 'P_H_Vlv'));
assert.deepEqual(typeCodes({ type: 'timer' }), [], 'Widgets have no Device Type');
// PR #61 codes are brought up to date
assert.equal(upgradeCode({ type: 'digitalOut', typeCode: 'PmP' }), 'Pump');
assert.equal(upgradeCode({ type: 'pwmOut', typeCode: 'PWM_VlV' }), 'P_L_Vlv');
assert.equal(upgradeCode({ type: 'temperature', sensor: 'ntc', r0: 10000, typeCode: 'TmP' }), '10KNTC');
assert.equal(upgradeCode({ type: 'digitalIn', typeCode: 'DIN' }), 'DIN', 'a new ID stays');
// LM35 and TMP36: 10 mV per degree C
assert.equal(Math.round(temperatureFrom({ sensor: 'lm35', units: '°C' }, 'A', 1023 * 0.25 / 5) * 10) / 10, 25);
assert.equal(Math.round(temperatureFrom({ sensor: 'tmp36', units: '°F' }, 'A', 1023 * 0.75 / 5)), 77);

// one Device per Interface port (A5 and 59 are the same Mega pin)
const els = [{ name: 'MB_25_VlV_Fly_Sparge_SP', type: 'digitalOut', device: 'MEGA', channel: 25 }, { name: 'MB_59_AI_Level_SP', type: 'analogIn', device: 'MEGA', channel: 59 },
  { name: 'Probe1', type: 'temperature', device: 'MEGA', probeIndex: 1 }];
assert.equal(portClash({ name: 'New', type: 'pwmOut', device: 'MEGA', channel: '25' }, els).other, 'MB_25_VlV_Fly_Sparge_SP');
assert.equal(portClash({ name: 'New', type: 'analogIn', device: 'MEGA', channel: 'A5' }, els).other, 'MB_59_AI_Level_SP');
assert.equal(portClash({ name: 'New', type: 'pwmOut', device: 'MEGA2', channel: 25 }, els), null, 'same port on another Interface is fine');
assert.equal(portClash({ name: 'Probe2', type: 'temperature', device: 'MEGA', probeIndex: 2 }, els), null, 'DS18B20 probes share one wire');
assert.equal(portClash({ name: 'Probe1b', type: 'temperature', probeIndex: 1 }, els).other, 'Probe1', 'one Device per OneWire probe number');
assert.equal(portClash({ name: 'Step', type: 'stepper', device: 'MEGA', channel: 30, dirPin: 25 }, els).other, 'MB_25_VlV_Fly_Sparge_SP', 'every stepper pin counts');

// the server gives IDs when a Schema loads, and refuses a Tab ID used twice
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'naming-'));
const cfg = path.join(dir, 'brewery.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'Main Brewery Mega USB', type: 'simulator' }], workspaces: [{ name: 'Sparge' }], elements: [] }));
const store = new Store(cfg, dir); store.load();
assert.equal(store.config.devices[0].id, 'MB');
assert.deepEqual(store.config.workspaces.map(w => w.id), ['SP', 'EQ'], 'the Equipment tab gets EQ');
assert.throws(() => store.saveLayout({ workspaces: [{ name: 'Sparge', id: 'SP' }, { name: 'Spare', id: 'sp' }] }), /used twice/);
store.saveLayout({ workspaces: [{ name: 'Sparge', id: 'SP' }, { name: 'Boil' }] });
assert.equal(store.config.workspaces[1].id, 'BO', 'a tab saved without an ID gets one');
fs.rmSync(dir, { recursive: true, force: true });

console.log('naming tests passed');
