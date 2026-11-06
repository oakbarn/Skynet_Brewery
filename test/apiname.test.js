// API_Name (Fritz, 2026-11-06, Rule 6.18): what a Voice Command says, Unique, may be blank: node test/apiname.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { cleanApiName, apiNameKey, apiNameProblem, apiNameOwner, apiNameListError } from '../public/apiname.js';
import { Store } from '../lib/store.js';
import { cleanDatabase, apiList, apiItem, apiPut, byApiName } from '../lib/itemapi.js';

// cleaning and comparing: capitals and extra spaces don't count
assert.equal(cleanApiName('  Mash   Temp '), 'Mash Temp');
assert.equal(apiNameKey('Mash Temp'), apiNameKey('mash  TEMP'));
assert.equal(apiNameProblem(''), '', 'blank is allowed');
assert.equal(apiNameProblem('Boil Kettle'), '');
assert.match(apiNameProblem('HLT/Temp'), /not allowed/);
assert.match(apiNameProblem('x'.repeat(61)), /at most 60/);

// Unique: another item with the same API_Name is found; the item itself is not
const a = { name: 'HLT_Temp', apiName: 'Hot Liquor', _ref: 'r1' }, b = { name: 'Pump_1', apiName: 'Wort Pump', _ref: 'r2' };
const list = [a, b, { name: 'gGV_X' }];
assert.equal(apiNameOwner(list, 'hot  liquor', b), a);
assert.equal(apiNameOwner(list, 'Hot Liquor', a), null, 'never clashes with itself');
assert.equal(apiNameOwner(list, 'Hot Liquor', { ...a }), null, 'the same item by its stand-in key');
assert.equal(apiNameOwner(list, '', b), null, 'blank never clashes');
assert.equal(apiNameListError(list), '');
assert.match(apiNameListError([...list, { name: 'Pump_2', apiName: 'WORT PUMP' }]), /used by both Pump_1 and Pump_2/);
assert.equal(apiNameListError([{ name: 'a' }, { name: 'b', apiName: '' }]), '', 'many blanks are fine');

// cleanDatabase keeps it tidy, and drops a blank one
assert.equal(cleanDatabase({ name: 'x', apiName: '  Mash  Tun ' }).apiName, 'Mash Tun');
assert.equal('apiName' in cleanDatabase({ name: 'x', apiName: '   ' }), false);

// the web API finds an item by its API_Name too
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'apiname'));
fs.mkdirSync(path.join(d, 'scripts'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'Pump_1', type: 'digitalOut', device: 'SIM', api: 'getput', apiName: 'Wort Pump' },
  { name: 'gGV_Ph', type: 'gGlobal', kind: 'value', api: 'get' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
assert.equal(byApiName(store, 'wort pump')?.name, 'Pump_1');
assert.equal(byApiName(store, 'Wort_Pump')?.name, 'Pump_1', 'an _ in a web address stands for a space');
assert.equal(byApiName(store, 'gGV_Ph')?.name, 'gGV_Ph', 'the Name still works');
assert.equal(apiList(store).find(x => x.name === 'Pump_1').apiName, 'Wort Pump');
assert.equal('apiName' in apiList(store).find(x => x.name === 'gGV_Ph'), false);
assert.equal(apiItem(store, 'Wort Pump').name, 'Pump_1');
assert.equal(apiPut(store, 'Wort Pump', null, true).name, 'Pump_1');
assert.equal(store.getProp('Pump_1', 'state'), true);
console.log('apiname tests passed');
process.exit(0);
