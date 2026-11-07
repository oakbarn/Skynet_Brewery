// Shared Variables are gGlobals (Rule 1.25, Fritz 2026-11-07): node --no-warnings test/sharedvar.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { sharedToGGlobal } from '../lib/gstandard.js';
import { Store, ELEMENT_TYPES } from '../lib/store.js';

assert.ok(!ELEMENT_TYPES.includes('shared'), 'no Shared Variable class');
const c = { elements: [
  { name: 'shr_N', type: 'shared', dataType: 'value', initial: '5', units: '%', workspace: 'Main', _key: 'k1' },
  { name: 'shr_S', type: 'shared', dataType: 'string' }, { name: 'shr_B', type: 'shared', dataType: 'bool' },
  { name: 'shr_T', type: 'shared', dataType: 'time' }, { name: 'shr_D', type: 'shared', dataType: 'datetime' },
  { name: 'shr_Old', type: 'shared' }, { name: 'gV_X', type: 'gGlobal', kind: 'value', api: 'get' }] };
assert.deepEqual(sharedToGGlobal(c), ['shr_N', 'shr_S', 'shr_B', 'shr_T', 'shr_D', 'shr_Old']);
assert.deepEqual(c.elements.map(e => e.kind), ['value', 'string', 'bool', 'time', 'datetime', 'value', 'value']);
const n = c.elements[0];
assert.equal(n.type, 'gGlobal'); assert.equal(n.api, 'off'); assert.equal(n.workspace, undefined); assert.equal(n.dataType, undefined);
assert.equal(n.name, 'shr_N'); assert.equal(n._key, 'k1'); assert.equal(n.initial, '5'); assert.equal(n.units, '%');
assert.equal(c.elements[6].api, 'get', 'a real gGlobal is left alone');

// a whole Schema on disk: it loads, the value comes back by the same Name, and the saved file has no Shared Variable left
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'shr-'));
fs.writeFileSync(path.join(d, 'brewery.json'), JSON.stringify({ title: 'x', elements: [{ name: 'shr_Hop', type: 'shared', dataType: 'value', initial: '2' }] }));
fs.mkdirSync(path.join(d, 'data'));
fs.writeFileSync(path.join(d, 'data', 'state.json'), JSON.stringify({ shr_Hop: 7 }));
const s = new Store(path.join(d, 'brewery.json'), path.join(d, 'data')); s.load();
const el = s.get('shr_Hop');
assert.equal(el.type, 'gGlobal'); assert.equal(el.kind, 'value');
assert.equal(s.getProp('shr_Hop', 'value'), 7);
fs.rmSync(d, { recursive: true, force: true });
console.log('shared variables become gGlobals: all passed');
