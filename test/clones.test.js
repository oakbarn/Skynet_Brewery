// Cloned Devices (Fritz, 2026-10-27): the same Device on more than one Tab. A clone has its own name, .visible, .hidden and
// place (.x / .y); everything else is its parent's, so turning a clone on turns the parent and every other clone on.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Hardware } from '../lib/hardware.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'clones'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }],
  workspaces: [{ name: 'Hot Side', id: 'HS' }, { name: 'Cellar', id: 'CE' }],
  elements: [{ name: 'MB_06_Pump_Wort__HS', type: 'digitalOut', typeCode: 'Pump', device: 'MB', channel: 6, workspace: 'Hot Side', x: 10, y: 20 }],
  graphics: [
    { id: 'c1', kind: 'clone', name: 'MB_06_Pump_Wort_C1__CE', of: 'MB_06_Pump_Wort__HS', workspace: 'Cellar', x: 300, y: 40 },
    { id: 'c2', kind: 'clone', name: 'Lost_C1__CE', of: 'No_Such_Device', workspace: 'Cellar', x: 0, y: 0 },
  ] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const P = 'MB_06_Pump_Wort__HS', C = 'MB_06_Pump_Wort_C1__CE';

assert.ok(store.has(C), 'a clone is a name Processes can use');
assert.ok(!store.has('Lost_C1__CE'), 'a clone whose parent is gone is left out');
assert.equal(store.get(C).type, 'digitalOut', 'a clone answers with its parent\'s settings');
assert.deepEqual(store.clonesOf(P), [C]);

// a Boolean set on the clone is set on the parent (and so on every clone), and the other way round
store.setProp(C, 'state', true);
assert.equal(store.getProp(P, 'state'), true);
store.setProp(P, 'state', false);
assert.equal(store.getProp(C, 'state'), false);

// its own .visible, .hidden and place
store.setProp(C, 'visible', false);
assert.equal(store.getProp(C, 'visible'), false);
assert.equal(store.getProp(P, 'visible'), true, 'hiding the clone leaves the parent showing');
store.setProp(P, 'visible', false);
assert.equal(store.getProp(C, 'visible'), false);
store.setProp(C, 'visible', true);
assert.equal(store.getProp(C, 'visible'), true, 'and the parent hidden leaves the clone as it was');
assert.equal(store.getProp(C, 'x'), 300, '.x is where it sits on its Tab');
assert.equal(store.getProp(C, 'xPosition'), 300);
store.setProp(C, 'x', 500);
assert.equal(store.getProp(C, 'xposition'), 500);
assert.equal(store.getProp(P, 'xposition'), 10, 'moving the clone leaves the parent where it is');
store.setProp(C, 'hidden', true);
assert.equal(store.getProp(C, 'hidden'), true);
assert.throws(() => store.setProp(C, 'hidden', 'maybe'));

// the snapshot sent to the browsers: the parent's values with the clone's own .visible and place
store.setProp(P, 'state', true);
const s = store.snapshot();
assert.equal(s[C].state, true);
assert.equal(s[C].visibility, 'visible');
assert.equal(s[C].xposition, 500);
assert.equal(s[P].visibility, 'hidden');

// a clone never reaches the board on its own: one line for the pump, not two
const hw = new Hardware(store), sent = [];
hw.devices.set('MB', { name: 'MB', send: l => sent.push(l) });
store.setProp(C, 'state', false);
store.setProp(C, 'visible', false);
assert.deepEqual(sent, ['DO 6 0']);

// Save layout keeps the clones (and drops one whose parent was deleted)
store.saveLayout({ elements: [], graphics: store.config.graphics });
assert.ok(!store.has(C), 'parent deleted: its clone goes too');
console.log('clones: all tests passed');
