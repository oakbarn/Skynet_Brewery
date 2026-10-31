// node --no-warnings test/displayname.test.js
// label (BruControl's displayname) works the same on every element type (BruControl could not set it on a Global String), plus
// file paths that are not on the Brain, and the old picture folder name oakbarn/ still finding Images/
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Store, ELEMENT_TYPES, G_KINDS } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpdn'));
fs.mkdirSync(path.join(d, 'config')); fs.mkdirSync(path.join(d, 'scripts'));
fs.mkdirSync(path.join(d, 'media', 'Images'), { recursive: true }); fs.mkdirSync(path.join(d, 'media', 'sounds'));
fs.writeFileSync(path.join(d, 'media', 'Images', 'Pump.png'), 'x'); fs.writeFileSync(path.join(d, 'media', 'sounds', 'Bell.wav'), 'x');
const els = [];
for (const t of ELEMENT_TYPES) {
  const kinds = t === 'gGlobal' ? Object.keys(G_KINDS) : t === 'shared' ? ['value', 'string', 'time', 'bool'] : [null];
  for (const k of kinds) els.push(k === null ? { name: `x_${t}`, type: t } : t === 'shared' ? { name: `x_${t}_${k}`, type: t, dataType: k } : { name: `x_${t}_${k}`, type: t, kind: k });
}
const cfg = path.join(d, 'config', 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ mediaRoots: ['./media'], elements: els }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const errors = []; eng.on('error', e => errors.push(e));
const lines = [...store.els.keys()].map(n => `"${n}" displayname = "Shown ${n}"`).join('\n') + '\n';
fs.writeFileSync(path.join(d, 'scripts', 'dn.txt'), lines);
assert.deepEqual(eng.check(lines).errors, []);
eng.start('dn');
await new Promise(r => setTimeout(r, 300));
for (const n of store.els.keys()) assert.equal(store.getProp(n, 'displayname'), `Shown ${n}`, `displayname on ${n}`);
assert.equal(errors.length, 0, JSON.stringify(errors));
assert.ok(store.els.size >= ELEMENT_TYPES.length + 10);

// paths that are not on the Brain
const text = `//"C:\\BruControl\\Media\\ignored.wav" in a comment
"x_alarm" sound = "C:\\BruControl\\Media\\wave\\Hops.wav"
"x_picture" image = "Images/Pump.png"
"x_picture" image = "oakbarn/Pump.png"
"x_alarm" sound = "sounds/Missing.wav"
"x_alarm" sound = "sounds/bell.WAV"
"x_alarm" sound = "/etc/hosts.txt"
"x_gKonstant_string" = "a/b is not a file"
`;
const off = eng.check(text).offBrain;
assert.deepEqual(off.map(x => [x.line, x.path]), [[2, 'C:\\BruControl\\Media\\wave\\Hops.wav'], [5, 'sounds/Missing.wav'], [7, '/etc/hosts.txt']]);
assert.match(off[0].why, /another computer/);
// old folder name still finds the renamed one, and the other way round
assert.equal(store.findMedia('oakbarn/Pump.png'), path.join(d, 'media', 'Images', 'Pump.png'));
fs.renameSync(path.join(d, 'media', 'Images'), path.join(d, 'media', 'oakbarn'));
assert.equal(store.findMedia('Images/Pump.png'), path.join(d, 'media', 'oakbarn', 'Pump.png'));
// a Label cleared in Properties (Fritz, 2026-10-22): the Tab shows the Name again, not the old Label
const heat = { name: 'MB_25_ElM_HLT_BH', type: 'digitalOut', label: 'HLT' };
store.saveLayout({ elements: [...store.config.elements, { ...heat }] });
assert.equal(store.getProp(heat.name, 'label'), 'HLT');
assert.equal(store.getProp(heat.name, 'displayname'), 'HLT', 'BruControl\'s displayname still reads the Label');
const { label, ...cleared } = heat;
store.saveLayout({ elements: [...store.config.elements.filter(e => e.name !== heat.name), cleared] });
assert.equal(store.getProp(heat.name, 'label'), heat.name);
store.saveLayout({ elements: [...store.config.elements.filter(e => e.name !== heat.name), { ...heat, label: '' }] });
assert.equal(store.getProp(heat.name, 'label'), heat.name, 'an empty Label shows the Name');
// displayname became label (Fritz, 2026-10-27): an old config moves over on load, and a Process may use either word
const old = { name: 'Old_Pump', type: 'digitalOut', displayName: 'Red pump' };
store.saveLayout({ elements: [...store.config.elements, old] });
const moved = store.config.elements.find(e => e.name === 'Old_Pump');
assert.equal(moved.label, 'Red pump'); assert.ok(!('displayName' in moved), 'displayName is gone from the config');
store.setProp('Old_Pump', 'label', 'Blue pump'); assert.equal(store.getProp('Old_Pump', 'displayname'), 'Blue pump');
store.setProp('Old_Pump', 'displayname', 'Green pump'); assert.equal(store.getProp('Old_Pump', 'label'), 'Green pump');
console.log('label (displayname) and path tests: all passed');
process.exit(0);
