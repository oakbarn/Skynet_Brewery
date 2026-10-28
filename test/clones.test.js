// Cloned Devices (Fritz, 2026-10-27): the same Device on more than one Tab. Clone names, and a parent rename on Save.
import assert from 'node:assert/strict';
import { cloneName, cloneNumber } from '../public/naming.js';

const used = new Set(['MB_06_Pump__HS_Clone_1']);
const taken = n => used.has(n);
assert.equal(cloneName('MB_06_Pump__HS', taken), 'MB_06_Pump__HS_Clone_2', 'the lowest free number');
assert.equal(cloneName('MB_06_Pump__CE', taken), 'MB_06_Pump__CE_Clone_1');
assert.equal(cloneName('MB_06_Pump_Mash__HS', taken, 3), 'MB_06_Pump_Mash__HS_Clone_3', 'a parent rename keeps the number');
assert.equal(cloneName('MB_06_Pump__HS', taken, 1), 'MB_06_Pump__HS_Clone_2', '... unless that name is taken');
assert.equal(cloneNumber('MB_06_Pump__HS_Clone_12'), 12);
assert.equal(cloneNumber('MB_06_Pump__HS'), undefined);
console.log('clones: all tests passed');

// Linked by the parent's hidden key (lib/clones.js): a parent renamed by any route takes its Clones with it
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { linkClones, OF } from '../lib/clones.js';
import { keyReplacer, dropKeys, claimKeys, useKeySecret } from '../lib/keys.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'clones'));
useKeySecret(path.join(d, 'data'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }], workspaces: [{ name: 'Hot Side' }, { name: 'Cellar' }],
  elements: [{ name: 'MB_06_Pump__HS', type: 'digitalOut', device: 'MB', channel: 6, workspace: 'Hot Side' }],
  graphics: [{ kind: 'clone', name: 'MB_06_Pump__HS_Clone_2', of: 'MB_06_Pump__HS', workspace: 'Cellar', x: 1, y: 2 },
    { kind: 'clone', name: 'Lost_Clone_1', of: 'No_Such', workspace: 'Cellar' }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const c0 = store.config.graphics.find(g => g.kind === 'clone');
assert.equal(store.config.graphics.length, 1, 'a Clone whose parent is gone is dropped');
assert.equal(c0[OF], store.config.elements[0]._key, 'the Clone holds its parent\'s key');
assert.ok(!JSON.stringify(store.config, keyReplacer).includes(c0[OF]), 'the parent\'s key never leaves the Brain');

// the browser renames the parent and sends the layout back (stand-ins only); the Clone comes back with its old name
const sent = dropKeys(JSON.parse(JSON.stringify({ elements: store.config.elements, graphics: store.config.graphics }, keyReplacer)), true);
sent.elements[0].name = 'MB_06_Pump_Wort__HS';
for (const list of ['elements', 'graphics']) claimKeys(sent[list], store.config[list]);
store.saveLayout(sent);
const c1 = store.config.graphics.find(g => g.kind === 'clone');
assert.equal(c1.of, 'MB_06_Pump_Wort__HS');
assert.equal(c1.name, 'MB_06_Pump_Wort__HS_Clone_2', 'the name follows, keeping its number');
assert.equal(c1.x, 1);

// a parent deleted: its Clone goes
store.saveLayout({ elements: [], graphics: store.config.graphics });
assert.ok(!store.config.graphics.some(g => g.kind === 'clone'));
const pipes = linkClones([{ kind: 'clone', name: 'X_Clone_1', of: 'Y' }, { kind: 'pipe', from: 'dev:X_Clone_1:out', to: 'ip1' }], [{ name: 'Y' }]);
assert.equal(pipes[1].from, 'dev:Y_Clone_1:out', 'a pipe on the Clone\'s IP follows its new name');
assert.deepEqual(linkClones([{ kind: 'clone', name: 'X_Clone_1', of: 'X' }], [{ name: 'X' }]).length, 1, 'a parent with no key yet links by name');
console.log('clones (keys): all tests passed');
