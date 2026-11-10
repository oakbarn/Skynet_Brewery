// < > : " / \ | ? * are not allowed in names any more; older names get a ~ for each (Fritz, 2026-10-29): node test/namechars.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { toSafeNames, safeNamesOnDisk, renameQuoted } from '../lib/namechars.js';
import { Store } from '../lib/store.js';

// one Schema in memory
const c = {
  devices: [{ name: 'Mega/USB', id: 'MU' }],
  elements: [
    { name: 'Hot/Cold', type: 'digitalOut', device: 'Mega/USB' },
    { name: 'Hot~Cold', type: 'digitalOut', label: 'Taken' },
    { name: 'Pump:1', type: 'digitalOut', label: 'Main pump' },
    { name: 'Alarm', type: 'alarm', follow: 'Pump:1' },
  ],
  graphics: [{ kind: 'pipe', flowWhen: ['Pump:1'], from: 'dev:Hot/Cold:out' }, { kind: 'text', name: 'Note?' }],
  beerxml: { strike: 'Hot/Cold' },
  autostart: [],
};
const map = toSafeNames(c);
assert.deepEqual([...map], [['Hot/Cold', 'Hot~Cold_2'], ['Pump:1', 'Pump~1'], ['Note?', 'Note~']]);
assert.equal(c.elements[0].label, 'Hot/Cold', 'the screen still shows the old name');
assert.equal(c.elements[2].label, 'Main pump', 'a Label stays as it was');
assert.equal(c.devices[0].name, 'Mega~USB'); assert.equal(c.elements[0].device, 'Mega~USB', 'Devices follow their Interface');
assert.equal(c.elements[3].follow, 'Pump~1');
assert.deepEqual(c.graphics[0].flowWhen, ['Pump~1']); assert.equal(c.graphics[0].from, 'dev:Hot~Cold_2:out');
assert.deepEqual(c.beerxml, { strike: 'Hot~Cold_2' });
assert.equal(toSafeNames(c).size, 0, 'a second pass changes nothing');
assert.equal(renameQuoted('"Pump:1".visible = false\nprint "Pump:1 is on"', new Map([['Pump:1', 'Pump~1']])), '"Pump~1".visible = false\nprint "Pump:1 is on"', 'only a whole quoted name');

// on disk: the configuration, another Schema, saved values and the Processes
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'safen'));
for (const s of ['config/schemas', 'scripts', 'data']) fs.mkdirSync(path.join(d, s), { recursive: true });
const cfg = path.join(d, 'config', 'brewery.json');
fs.writeFileSync(cfg, JSON.stringify({ title: 't', elements: [{ name: 'HLT<Temp>', type: 'temperature' }] }));
fs.writeFileSync(path.join(d, 'config/schemas/other.json'), JSON.stringify({ name: 'Other', elements: [{ name: 'a|b', type: 'gKonstant', kind: 'value' }] }));
fs.writeFileSync(path.join(d, 'config/schemas/other.state.json'), JSON.stringify({ 'a|b': 3 }));
fs.writeFileSync(path.join(d, 'scripts/Run.txt'), 'wait "HLT<Temp>" > 150\n"a|b" = 4\n');
const r = safeNamesOnDisk({ configPath: cfg, scriptsDir: path.join(d, 'scripts'), dataDir: path.join(d, 'data') });
assert.deepEqual([...r.map], [['HLT<Temp>', 'HLT~Temp~'], ['a|b', 'a~b']]);
assert.equal(fs.readFileSync(path.join(d, 'scripts/Run.txt'), 'utf8'), 'wait "HLT~Temp~" > 150\n"a~b" = 4\n');
assert.ok(fs.existsSync(path.join(d, 'scripts/Run.txt.before-safe-names.bak')));
assert.ok(fs.existsSync(path.join(d, 'config/brewery.before-safe-names.bak')));
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(d, 'config/schemas/other.state.json'), 'utf8')), { 'a~b': 3 });
assert.equal(safeNamesOnDisk({ configPath: cfg, scriptsDir: path.join(d, 'scripts'), dataDir: path.join(d, 'data') }), null, 'only once');

// a Schema with an old name loaded later: the store changes it and tells the server
fs.writeFileSync(cfg, JSON.stringify({ title: 't', elements: [{ name: 'Late*', type: 'gKonstant', kind: 'value' }] }));
fs.writeFileSync(path.join(d, 'data/state.json'), JSON.stringify({ 'Late*': 7 }));
const store = new Store(cfg, path.join(d, 'data'));
let told = null; store.on('safeRenamed', m => { told = m; });
store.load();
assert.ok(store.has('Late~')); assert.ok(!store.has('Late*'));
assert.equal(store.getProp('Late~', 'value'), 7, 'saved value kept');
assert.deepEqual([...told], [['Late*', 'Late~']]);
// Tabs too (every name is treated the same, Rule 3.14): what is on the Tab follows
const t = { workspaces: [{ name: 'Hot/Side' }, { name: 'Cold' }], elements: [{ name: 'P1', type: 'digitalOut', workspace: 'Hot/Side' }], graphics: [{ kind: 'pipe', workspace: 'Hot/Side' }] };
assert.deepEqual([...toSafeNames(t)], [['Hot/Side', 'Hot~Side']]);
assert.equal(t.elements[0].workspace, 'Hot~Side'); assert.equal(t.graphics[0].workspace, 'Hot~Side');
console.log('namechars tests passed');
