// vKonstant / vAPI -> gKonstant / gAPI, vK_ / vA_ names -> gK_ / gA_ (Fritz, 2026-10-28): node test/gstandard.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { toGStandard, gStandardOnDisk } from '../lib/gstandard.js';
import { Store } from '../lib/store.js';

// one Schema in memory
const c = {
  elements: [
    { name: 'vKV_Strike', type: 'vKonstant', kind: 'value' },
    { name: 'vAV_Mash', type: 'vAPI', kind: 'value', label: 'vAV_Mash' },
    { name: 'gKV_Taken', type: 'gKonstant', kind: 'value' },
    { name: 'vKV_Taken', type: 'vKonstant', kind: 'value' },
    { name: 'vK_Pic_Pump', type: 'digitalOut', follow: 'vKV_Strike' },     // not a variable: its name stays, what it points to follows
  ],
  graphics: [{ kind: 'pipe', flowWhen: ['vAV_Mash'] }],
  beerxml: { hops: 'vA_v_Hop{n}_Oz', strike: 'vKV_Strike' },
};
const map = toGStandard(c);
assert.deepEqual([...map], [['vKV_Strike', 'gKV_Strike'], ['vAV_Mash', 'gAV_Mash'], ['vKV_Taken', 'gKV_Taken_2']]);
assert.deepEqual(c.elements.map(e => e.type), ['gKonstant', 'gAPI', 'gKonstant', 'gKonstant', 'digitalOut']);
assert.equal(c.elements[1].label, 'gAV_Mash');
assert.equal(c.elements[4].name, 'vK_Pic_Pump'); assert.equal(c.elements[4].follow, 'gKV_Strike');
assert.deepEqual(c.graphics[0].flowWhen, ['gAV_Mash']);
assert.deepEqual(c.beerxml, { hops: 'gA_v_Hop{n}_Oz', strike: 'gKV_Strike' });
assert.equal(toGStandard(c).size, 0, 'a second pass changes nothing');

// on disk: the configuration, another Schema, saved values and the Processes
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'gstd'));
for (const s of ['config/schemas', 'scripts', 'data']) fs.mkdirSync(path.join(d, s), { recursive: true });
const cfg = path.join(d, 'config', 'brewery.json');
fs.writeFileSync(cfg, JSON.stringify({ title: 't', elements: [{ name: 'vKB_Go', type: 'vKonstant', kind: 'bool' }] }));
fs.writeFileSync(path.join(d, 'config/schemas/other.json'), JSON.stringify({ name: 'Other', elements: [{ name: 'vAV_HLT', type: 'vAPI', kind: 'value' }] }));
fs.writeFileSync(path.join(d, 'config/schemas/other.state.json'), JSON.stringify({ vAV_HLT: 150 }));
fs.writeFileSync(path.join(d, 'data/state.json'), JSON.stringify({ vKB_Go: true }));
fs.writeFileSync(path.join(d, 'scripts/Run.txt'), 'wait vKB_Go == true\nvAV_HLT = 152\nprint "vKB_Go.x"\nmy_vKB_Go = 1\n');
const r = gStandardOnDisk({ configPath: cfg, scriptsDir: path.join(d, 'scripts'), dataDir: path.join(d, 'data') });
assert.deepEqual([...r.map], [['vKB_Go', 'gKB_Go'], ['vAV_HLT', 'gAV_HLT']]);
assert.equal(fs.readFileSync(path.join(d, 'scripts/Run.txt'), 'utf8').split('\n').slice(0, 2).join('\n'), 'wait gKB_Go == true\ngAV_HLT = 152');
assert.ok(fs.readFileSync(path.join(d, 'scripts/Run.txt'), 'utf8').includes('my_vKB_Go = 1'), 'whole names only');
assert.ok(fs.existsSync(path.join(d, 'scripts/Run.txt.before-gnames.bak')));
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(d, 'config/schemas/other.state.json'), 'utf8')), { gAV_HLT: 150 });
assert.equal(JSON.parse(fs.readFileSync(path.join(d, 'config/schemas/other.json'), 'utf8')).elements[0].type, 'gAPI');
assert.equal(gStandardOnDisk({ configPath: cfg, scriptsDir: path.join(d, 'scripts'), dataDir: path.join(d, 'data') }), null, 'only once');

// a Schema with the old words loaded later: the store changes it and tells the server which names changed
fs.writeFileSync(cfg, JSON.stringify({ title: 't', elements: [{ name: 'vKV_Late', type: 'vKonstant', kind: 'value' }] }));
fs.writeFileSync(path.join(d, 'data/state.json'), JSON.stringify({ vKV_Late: 7 }));
const store = new Store(cfg, path.join(d, 'data'));
let told = null; store.on('gRenamed', m => { told = m; });
store.load();
assert.ok(store.has('gKV_Late')); assert.ok(!store.has('vKV_Late'));
assert.equal(store.get('gKV_Late').type, 'gKonstant');
assert.equal(store.getProp('gKV_Late', 'value'), 7, 'saved value kept');
assert.deepEqual([...told], [['vKV_Late', 'gKV_Late']]);
console.log('gstandard tests passed');
