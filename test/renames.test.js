// Renamed Devices and Widgets: the Processes follow (Fritz, 2026-10-22)
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';
import { renameMap, renameInProcess, renameInProcesses, renameElementRefs } from '../lib/renames.js';

// ---- whole names only, name.attribute too, never a name after a dot
const m = renameMap([{ from: 'HLT_Temp', to: 'MB_OW1_TmP_HLT_HS' }, { from: 'x', to: 'x' }, { from: '', to: 'y' }]);
assert.equal(m.size, 1);
assert.equal(renameInProcess('HLT_Temp = 168\nif HLT_Temp.visible == true\nendif', m), 'MB_OW1_TmP_HLT_HS = 168\nif MB_OW1_TmP_HLT_HS.visible == true\nendif');
assert.equal(renameInProcess('HLT_Temp_2 = Old_HLT_Temp + hlt_temp', m), 'HLT_Temp_2 = Old_HLT_Temp + hlt_temp', 'other names and other case stay');
assert.equal(renameInProcess('"HLT_Temp" value = 3 // HLT_Temp', m), '"MB_OW1_TmP_HLT_HS" value = 3 // MB_OW1_TmP_HLT_HS');
assert.equal(renameInProcess('Pump.HLT_Temp = 1', m), 'Pump.HLT_Temp = 1', 'an attribute is not a Device');
// a swap in one pass; longer names first
const swap = renameMap({ A: 'B', B: 'A', Pump: 'P1', Pump_2: 'P2' });
assert.equal(renameInProcess('A = B\nPump = Pump_2', swap), 'B = A\nP1 = P2');

// ---- settings that point at it follow, its own name and display text don't
const el = renameElementRefs({ name: 'Copy', displayName: 'HLT_Temp', follow: 'HLT_Temp', list: ['HLT_Temp', 'Z'] }, m);
assert.deepEqual(el, { name: 'Copy', displayName: 'HLT_Temp', follow: 'MB_OW1_TmP_HLT_HS', list: ['MB_OW1_TmP_HLT_HS', 'Z'] });

// ---- the scripts folder: changed Processes listed, backup kept, running ones flagged; the value stays with the renamed one
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'renames'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'Strike', type: 'gKonstant', kind: 'value' }, { name: 'Other', type: 'gKonstant', kind: 'value' }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
store.rt.get('Strike').value = 165;
eng.write('Uses_It', 'Strike = 170\nOther = Strike\n');
eng.write('Does_Not', 'Other = 1\n');
const r = renameMap({ Strike: 'Strike_Temp' });
store.saveLayout({ elements: [{ name: 'Strike_Temp', type: 'gKonstant', kind: 'value' }, { name: 'Other', type: 'gKonstant', kind: 'value' }], renames: r });
assert.equal(store.rt.get('Strike_Temp').value, 165, 'the value stays with the renamed one');
const changed = renameInProcesses(eng, r);
assert.deepEqual(changed, [{ name: 'Uses_It', lines: 2, running: false }]);
assert.equal(eng.read('Uses_It'), 'Strike_Temp = 170\nOther = Strike_Temp\n');
assert.equal(fs.readFileSync(path.join(d, 'scripts', 'Uses_It.txt.bak'), 'utf8'), 'Strike = 170\nOther = Strike\n');
assert.equal(eng.read('Does_Not'), 'Other = 1\n');
console.log('renames tests passed');
