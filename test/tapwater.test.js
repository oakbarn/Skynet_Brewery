// Tap water valves (Fritz, 2026-10-20): my_Valve.tapwater reads and sets the valve's tap water setting in a Process
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store, attrsOf } from '../lib/store.js';
import { Engine } from '../lib/engine.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'tapwater'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'VGC_Tap', type: 'digitalOut', subtype: 'valve', tapwater: true },
  { name: 'VGC_HLT_Out', type: 'digitalOut', subtype: 'valve' },
  { name: 'Pump_Red', type: 'digitalOut', subtype: 'pump' },
  { name: 'Done', type: 'vKonstant', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
assert.equal(store.getProp('VGC_Tap', 'tapwater'), true, 'starts from the valve setting');
assert.equal(store.getProp('VGC_HLT_Out', 'tapwater'), false);
assert.ok(attrsOf(store.get('VGC_Tap')).includes('tapwater'), 'autofill offers .tapwater on valves');
assert.ok(!attrsOf(store.get('Pump_Red')).includes('tapwater'), 'but not on pumps');
assert.throws(() => store.getProp('Pump_Red', 'tapwater'), /no property "tapwater"/);
assert.throws(() => store.setProp('Pump_Red', 'tapwater', true), /only valves/);

const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
eng.write('fill', 'VGC_HLT_Out.tapwater = true\nif VGC_Tap.tapwater == true\n  VGC_Tap = true\nendif\nVGC_Tap.tapwater = false\nDone = 1\n');
eng.start('fill');
assert.ok(await until(() => store.getProp('Done', 'value') === 1), 'the Process runs to the end');
assert.equal(store.getProp('VGC_HLT_Out', 'tapwater'), true);
assert.equal(store.getProp('VGC_Tap', 'state'), true);
assert.equal(store.getProp('VGC_Tap', 'tapwater'), false);
assert.equal(store.snapshotOne('VGC_HLT_Out').tapwater, true, 'screens get the change');

// saving the layout puts the valve's own setting back
store.saveLayout({ elements: JSON.parse(fs.readFileSync(cfg, 'utf8')).elements });
assert.equal(store.getProp('VGC_Tap', 'tapwater'), true);
assert.equal(store.getProp('VGC_Tap', 'state'), true, 'the valve stays open');
clearTimeout(store._persistTimer);
console.log('tap water valve tests passed');
process.exit(0);
