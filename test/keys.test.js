// Hidden keys (Fritz, 2026-10-27): every named item has a fixed key nobody sees; renames are found by it,
// Processes follow, a running Process keeps working, clones follow the item they were cloned from.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';
import { renameInProcesses, renameGraphicRefs } from '../lib/renames.js';
import { addKeys, refOf, keyReplacer, dropKeys, claimKeys, keyRenames, followClones, stripKeysText, keepKeysByName, useKeySecret } from '../lib/keys.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'keys'));
useKeySecret(path.join(d, 'data'));
assert.ok(fs.existsSync(path.join(d, 'data', 'key-secret')), 'the stand-in secret is kept in data/');

// ---- an old Schema gets keys on load and they are written; they stay the same on the next load
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'Mega' }], workspaces: [{ name: 'Main' }], graphics: [{ id: 'g1', kind: 'text', name: 'Text_1', workspace: 'Main' }],
  elements: [{ name: 'Pump_A', type: 'digitalOut' }, { name: 'Temp', type: 'vKonstant', kind: 'value' }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const onDisk = JSON.parse(fs.readFileSync(cfg, 'utf8'));
for (const list of ['devices', 'workspaces', 'graphics', 'elements']) for (const it of onDisk[list]) assert.match(it._key, /^k[0-9a-f]{16}$/, `${list} ${it.name} has a key`);
const keyA = store.get('Pump_A')._key;
store.load();
assert.equal(store.get('Pump_A')._key, keyA, 'a key never changes');

// ---- doubled keys (a copy brought one along): the first keeps it, the copy gets its own
const c2 = { elements: [{ name: 'A', _key: 'k1' }, { name: 'B', _key: 'k1' }] };
assert.equal(addKeys(c2), 1);
assert.equal(c2.elements[0]._key, 'k1'); assert.notEqual(c2.elements[1]._key, 'k1');

// ---- what goes out has stand-ins, never keys; what comes in loses any key it brings
const out = JSON.parse(JSON.stringify({ config: store.config }, keyReplacer));
assert.ok(!JSON.stringify(out).includes(keyA), 'the key never leaves the Brain');
assert.equal(out.config.elements[0]._ref, refOf(keyA));
assert.notEqual(refOf(keyA), keyA);
const fake = dropKeys({ elements: [{ name: 'X', _key: keyA, _from: 'k2', _ref: 'r' }] });
assert.deepEqual(fake.elements[0], { name: 'X' }, 'a key sent in is thrown away');
assert.equal(dropKeys({ a: { _ref: 'r' } }, true).a._ref, 'r', 'Save layout may send its stand-ins');

// ---- claim: same stand-in = same item; the one with the old name keeps it, the other is a clone (_from)
const cur = [{ name: 'Pump_A', _key: 'kA' }, { name: 'Pump_B', _key: 'kB' }];
const inc = [{ name: 'Pump_A_copy', _ref: refOf('kA') }, { name: 'Pump_A', _ref: refOf('kA') }, { name: 'Pump_Z', _ref: refOf('kB') }, { name: 'New', _ref: 'nonsense' }];
claimKeys(inc, cur);
assert.equal(inc[1]._key, 'kA'); assert.equal(inc[0]._from, 'kA'); assert.notEqual(inc[0]._key, 'kA');
assert.equal(inc[2]._key, 'kB'); assert.ok(inc[3]._key && !inc[3]._from, 'an unknown stand-in is a new item');
assert.ok(inc.every(x => !('_ref' in x)));
assert.deepEqual([...keyRenames(cur, inc)], [['Pump_B', 'Pump_Z']], 'the rename is found by the key');
// a clone keeps remembering its first item through later saves (the browser never sees _from)
const later = [{ name: 'Pump_A', _ref: refOf('kA') }, { name: 'Pump_A_copy', _ref: refOf(inc[0]._key) }];
claimKeys(later, inc);
assert.equal(later[1]._from, 'kA');

// ---- clones follow: renaming Pump_A to Pump_Main makes Pump_A_copy Pump_Main_copy
const items = [{ name: 'Pump_Main', _key: 'kA' }, { name: 'Pump_A_copy', _key: 'kC', _from: 'kA' }, { name: 'Other_copy', _key: 'kD', _from: 'kA' }];
const cl = followClones(items, new Map([['Pump_A', 'Pump_Main']]));
assert.deepEqual([...cl], [['Pump_A_copy', 'Pump_Main_copy']]);
assert.equal(items[1].name, 'Pump_Main_copy'); assert.equal(items[2].name, 'Other_copy', 'a clone without the old name is left alone');
const taken = [{ name: 'B', _key: 'k1' }, { name: 'A_copy', _key: 'k2', _from: 'k1' }, { name: 'B_copy', _key: 'k3' }];
assert.equal(followClones(taken, new Map([['A', 'B']])).size, 0, 'a taken name is not used');
assert.deepEqual(renameGraphicRefs({ heater: 'H', flowWhen: ['H', 'X'], from: 'dev:H:in', to: 'ip_1' }, new Map([['H', 'H2']])), { heater: 'H2', flowWhen: ['H2', 'X'], from: 'dev:H2:in', to: 'ip_1' });

// ---- the Config Editor: no keys shown; on Save each item gets its key back by its name
const text = stripKeysText(fs.readFileSync(cfg, 'utf8'));
assert.ok(!text.includes('_key'));
const back = keepKeysByName(JSON.parse(text), store.config);
assert.equal(back.elements.find(e => e.name === 'Pump_A')._key, keyA);

// ---- a rename found by key: the Processes follow, a running Process keeps working by the old name
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
eng.write('Uses_It', 'Pump_A = true\n');
assert.match(eng.keyOf('Uses_It'), /^k/, 'a Process has a key');
const els = JSON.parse(JSON.stringify(store.config.elements, keyReplacer));
els[0].name = 'Pump_Main';
dropKeys(els, true); claimKeys(els, store.config.elements);
const renames = keyRenames(store.config.elements, els);
assert.deepEqual([...renames], [['Pump_A', 'Pump_Main']]);
store.saveLayout({ elements: els, renames });
assert.equal(store.get('Pump_Main')._key, keyA, 'the key stays with the item');
assert.equal(store.has('Pump_A'), false, 'the old name is not a name any more (a new Process must use the new one)');
store.setProp('Pump_A', 'state', true);               // what a Process that was running says
assert.equal(store.getProp('Pump_Main', 'state'), true, 'found through the hidden key');
renameInProcesses(eng, renames);
assert.equal(eng.read('Uses_It'), 'Pump_Main = true\n');
// a Process keeps its key through a rename and the Recycle Bin
const pk = eng.keyOf('Uses_It');
eng.rename('Uses_It', 'Uses_Pump');
assert.equal(eng.keyOf('Uses_Pump'), pk);
eng.remove('Uses_Pump');
eng.binRestore(eng.binList()[0].id);
assert.equal(eng.keyOf('Uses_Pump'), pk);
assert.ok(!eng.names().includes('.keys'), 'the key file is not a Process');

fs.rmSync(d, { recursive: true, force: true });
console.log('keys ok');
