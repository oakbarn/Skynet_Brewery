// vKonstant / vAPI / gKonstant / gAPI -> gGlobal, vK_ / vA_ / gK_ / gA_ names -> gG_, log -> .database and send_db
// (Fritz, 2026-10-28 and 2026-10-30): node test/gstandard.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { toGStandard, gStandardOnDisk, toSendDb } from '../lib/gstandard.js';
import { Store } from '../lib/store.js';

// one Schema in memory
const c = {
  elements: [
    { name: 'vKV_Strike', type: 'vKonstant', kind: 'value' },
    { name: 'vAV_Mash', type: 'vAPI', kind: 'value', label: 'vAV_Mash', log: { mode: 'minutes', every: 5 } },
    { name: 'gGV_Taken', type: 'gGlobal', kind: 'value' },
    { name: 'gKV_Taken', type: 'gKonstant', kind: 'value' },
    { name: 'gAS_Note', type: 'gAPI', kind: 'string', log: { mode: 'script', script: 'Brew' } },
    { name: 'gKList_Style', type: 'gKonstant', kind: 'list' },
    { name: 'gAmount', type: 'gKonstant', kind: 'value' },                  // not a kind prefix: left alone
    { name: 'vK_Pic_Pump', type: 'digitalOut', follow: 'vKV_Strike' },     // not a variable: its name stays, what it points to follows
  ],
  graphics: [{ kind: 'pipe', flowWhen: ['vAV_Mash'] }],
  beerxml: { hops: 'gA_v_Hop{n}_Oz', strike: 'vKV_Strike' },
};
const map = toGStandard(c);
assert.deepEqual([...map], [['vKV_Strike', 'gGV_Strike'], ['vAV_Mash', 'gGV_Mash'], ['gKV_Taken', 'gGV_Taken_2'], ['gAS_Note', 'gGS_Note'], ['gKList_Style', 'gGList_Style']]);
assert.deepEqual(c.elements.map(e => e.type), ['gGlobal', 'gGlobal', 'gGlobal', 'gGlobal', 'gGlobal', 'gGlobal', 'gGlobal', 'digitalOut']);
assert.equal(c.elements[1].label, 'gGV_Mash');
// a gAPI keeps going to the database and stays reachable from outside; a gKonstant does not get either
assert.deepEqual(c.elements[1].database, { frequency: 'minutes', every: 5 }); assert.equal(c.elements[1].api, 'getput'); assert.equal(c.elements[1].log, undefined);
assert.deepEqual(c.elements[4].database, { frequency: 'process', process: 'Brew' });
assert.equal(c.elements[0].api, undefined); assert.equal(c.elements[0].database, undefined);
assert.equal(c.elements[6].name, 'gAmount');
assert.equal(c.elements[7].name, 'vK_Pic_Pump'); assert.equal(c.elements[7].follow, 'gGV_Strike');
assert.deepEqual(c.graphics[0].flowWhen, ['gGV_Mash']);
assert.deepEqual(c.beerxml, { hops: 'gG_v_Hop{n}_Oz', strike: 'gGV_Strike' });
assert.equal(toGStandard(c).size, 0, 'a second pass changes nothing');

// log lines are send_db lines now
assert.equal(toSendDb('log "gGV_A"\n  log gGV_B\nlogx = 1\n// log this\nprint "log x"'), 'send_db "gGV_A"\n  send_db gGV_B\nlogx = 1\n// log this\nprint "log x"');

// on disk: the configuration, another Schema, saved values and the Processes
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'gstd'));
for (const s of ['config/schemas', 'scripts', 'data']) fs.mkdirSync(path.join(d, s), { recursive: true });
const cfg = path.join(d, 'config', 'brewery.json');
fs.writeFileSync(cfg, JSON.stringify({ title: 't', elements: [{ name: 'gKB_Go', type: 'gKonstant', kind: 'bool' }] }));
fs.writeFileSync(path.join(d, 'config/schemas/other.json'), JSON.stringify({ name: 'Other', elements: [{ name: 'gAV_HLT', type: 'gAPI', kind: 'value' }] }));
fs.writeFileSync(path.join(d, 'config/schemas/other.state.json'), JSON.stringify({ gAV_HLT: 150 }));
fs.writeFileSync(path.join(d, 'data/state.json'), JSON.stringify({ gKB_Go: true }));
fs.writeFileSync(path.join(d, 'scripts/Run.txt'), 'wait gKB_Go == true\ngAV_HLT = 152\nlog gAV_HLT\nprint "gKB_Go.x"\nmy_gKB_Go = 1\n');
fs.writeFileSync(path.join(d, 'scripts/Plain.txt'), 'print "hi"\n');
const r = gStandardOnDisk({ configPath: cfg, scriptsDir: path.join(d, 'scripts'), dataDir: path.join(d, 'data') });
assert.deepEqual([...r.map], [['gKB_Go', 'gGB_Go'], ['gAV_HLT', 'gGV_HLT']]);
assert.equal(fs.readFileSync(path.join(d, 'scripts/Run.txt'), 'utf8').split('\n').slice(0, 3).join('\n'), 'wait gGB_Go == true\ngGV_HLT = 152\nsend_db gGV_HLT');
assert.ok(fs.readFileSync(path.join(d, 'scripts/Run.txt'), 'utf8').includes('my_gKB_Go = 1'), 'whole names only');
assert.ok(fs.existsSync(path.join(d, 'scripts/Run.txt.before-gglobal.bak')));
assert.ok(!fs.existsSync(path.join(d, 'scripts/Plain.txt.before-gglobal.bak')));
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(d, 'config/schemas/other.state.json'), 'utf8')), { gGV_HLT: 150 });
const other = JSON.parse(fs.readFileSync(path.join(d, 'config/schemas/other.json'), 'utf8')).elements[0];
assert.equal(other.type, 'gGlobal'); assert.equal(other.api, 'getput');
assert.equal(gStandardOnDisk({ configPath: cfg, scriptsDir: path.join(d, 'scripts'), dataDir: path.join(d, 'data') }), null, 'only once');
// a log line in a Process alone (every Schema already up to date) is still changed
fs.writeFileSync(path.join(d, 'scripts/Late.txt'), 'log gGB_Go\n');
const r2 = gStandardOnDisk({ configPath: cfg, scriptsDir: path.join(d, 'scripts'), dataDir: path.join(d, 'data') });
assert.equal(fs.readFileSync(path.join(d, 'scripts/Late.txt'), 'utf8'), 'send_db gGB_Go\n'); assert.ok(r2.lines.some(l => l.includes('Late')));

// a Schema with the old words loaded later: the store changes it and tells the server which names changed
fs.writeFileSync(cfg, JSON.stringify({ title: 't', elements: [{ name: 'vKV_Late', type: 'vKonstant', kind: 'value' }] }));
fs.writeFileSync(path.join(d, 'data/state.json'), JSON.stringify({ vKV_Late: 7 }));
const store = new Store(cfg, path.join(d, 'data'));
let told = null; store.on('gRenamed', m => { told = m; });
store.load();
assert.ok(store.has('gGV_Late')); assert.ok(!store.has('vKV_Late'));
assert.equal(store.get('gGV_Late').type, 'gGlobal');
assert.equal(store.getProp('gGV_Late', 'value'), 7, 'saved value kept');
assert.deepEqual([...told], [['vKV_Late', 'gGV_Late']]);
console.log('gstandard tests passed');
