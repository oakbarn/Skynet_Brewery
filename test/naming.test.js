// Interface IDs, Tab IDs and suggested Device names (public/naming.js)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { suggestName, defaultInterfaceId, cleanInterfaceId, defaultTabId, cleanTabId, assignIds, checkIds, defaultCode, typeCodes, portClash, namePart } from '../public/naming.js';
import { Store } from '../lib/store.js';

// Fritz's example: a PWM proportional valve "Fly Sparge" on port 25 of Interface MB, on the Sparge tab (SP)
assert.equal(suggestName({ iface: 'MB', port: 25, code: 'PWM_VlV', displayName: 'Fly Sparge', tab: 'SP' }), 'MB_25_PWM_VlV_Fly_Sparge_SP');
assert.equal(namePart('  Hot  Liquor-Tank '), 'Hot_Liquor_Tank', 'no spaces in Device names');
assert.equal(suggestName({ iface: 'MB', port: 'A5', code: 'TmP', displayName: '', tab: 'BR' }), 'MB_A5_TmP_BR', 'an empty part is left out');

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
const c = { devices: [{ name: 'Main Brewery Mega USB' }, { name: 'Main Brewery Mega Ethernet' }, { name: 'X', id: 'bad id' }], workspaces: [{ name: 'Brewery' }, { name: 'Batch Hops' }, { name: 'Boil', id: 'BR' }] };
assert.equal(assignIds(c), true);
assert.deepEqual(c.devices.map(d => d.id), ['MB', 'MB_2', 'X']);
assert.deepEqual(c.workspaces.map(w => w.id), ['BR', 'BH', 'BO'], 'a second BR gets a new ID');
assert.equal(assignIds(c), false, 'nothing changes the second time');
assert.throws(() => checkIds([{ name: 'A', id: 'MB' }, { name: 'B', id: 'mb' }], 'interface'), /used twice/);
assert.deepEqual(checkIds([{ name: 'Sparge' }, { name: 'S', id: 'sp' }], 'tab').map(w => w.id), ['SA', 'SP'], 'a typed ID wins, the missing one is given');

// type codes
assert.equal(defaultCode({ type: 'digitalOut', subtype: 'valve' }), 'VlV');
assert.equal(defaultCode({ type: 'digitalOut', subtype: 'pump' }), 'PmP');
assert.equal(defaultCode({ type: 'digitalOut' }), 'DO');
assert.equal(defaultCode({ type: 'pwmOut' }), 'PWM');
assert.equal(defaultCode({ type: 'analogOut', subtype: 'propValve' }), 'AO_VlV');
assert.equal(defaultCode({ type: 'digitalIn' }, 'Float'), 'FlT');
assert.equal(defaultCode({ type: 'hysteresis' }), 'HyS');
assert.ok(typeCodes({ type: 'pwmOut' }).some(([k]) => k === 'PWM_VlV'));
assert.deepEqual(typeCodes({ type: 'timer' }), [], 'Widgets have no type code');

// one Device per Interface port (A5 and 59 are the same Mega pin)
const els = [{ name: 'MB_25_VlV_Fly_Sparge_SP', type: 'digitalOut', device: 'MEGA', channel: 25 }, { name: 'MB_59_AI_Level_SP', type: 'analogIn', device: 'MEGA', channel: 59 },
  { name: 'Probe1', type: 'temperature', device: 'MEGA', probeIndex: 1 }];
assert.equal(portClash({ name: 'New', type: 'pwmOut', device: 'MEGA', channel: '25' }, els).other, 'MB_25_VlV_Fly_Sparge_SP');
assert.equal(portClash({ name: 'New', type: 'analogIn', device: 'MEGA', channel: 'A5' }, els).other, 'MB_59_AI_Level_SP');
assert.equal(portClash({ name: 'New', type: 'pwmOut', device: 'MEGA2', channel: 25 }, els), null, 'same port on another Interface is fine');
assert.equal(portClash({ name: 'Probe2', type: 'temperature', device: 'MEGA', probeIndex: 2 }, els), null, 'DS18B20 probes share one wire');
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
