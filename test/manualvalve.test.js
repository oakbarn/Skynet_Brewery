// Manual valves (Valve type Manual, Fritz 2026-10-20): a Process that opens or closes one waits for Done; its pin is left alone
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mvalve'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'VGC_Kettle_Out', type: 'digitalOut', subtype: 'valve', valveType: 'manual', displayName: 'Kettle outlet' },
  { name: 'VGC_HLT_Out', type: 'digitalOut', subtype: 'valve' },
  { name: 'Done', type: 'vKonstant', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const asks = []; eng.on('valves', v => asks.push(v));
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };

eng.write('brew', 'VGC_HLT_Out = true\nVGC_Kettle_Out = true\nDone = 1\nVGC_Kettle_Out.state = true\nDone = 2\nVGC_Kettle_Out.state = false\nDone = 3\n');
eng.start('brew');
assert.ok(await until(() => eng.valveList().length === 1), 'asks for the manual valve');
assert.equal(store.getProp('VGC_HLT_Out', 'state'), true, 'an Electro_Mechanical valve is switched at once');
assert.deepEqual(eng.valveList().map(a => [a.name, a.label, a.open, a.process]), [['VGC_Kettle_Out', 'Kettle outlet', true, 'brew']]);
await new Promise(r => setTimeout(r, 200));
assert.equal(store.getProp('Done', 'value'), 0, 'the Process waits');
assert.equal(store.getProp('VGC_Kettle_Out', 'state'), false);
eng.confirmValve('VGC_Kettle_Out');
assert.ok(await until(() => store.getProp('Done', 'value') === 2), 'Done lets it go on; already open needs no second ask');
assert.equal(store.getProp('VGC_Kettle_Out', 'state'), true);
assert.ok(await until(() => eng.valveList().length === 1 && eng.valveList()[0].open === false), 'closing asks too');
eng.stop('brew');
assert.ok(await until(() => eng.valveList().length === 0), 'stopping the Process takes the pop-up away');
assert.throws(() => eng.confirmValve('VGC_Kettle_Out'), /Nothing is waiting/);
assert.ok(asks.length >= 3);

// the board pin of a manual valve is never driven
const { Hardware } = await import('../lib/hardware.js');
const hw = new Hardware(store);
assert.equal(hw._outLine(store.get('VGC_Kettle_Out')), null);
assert.match(hw._outLine(store.get('VGC_HLT_Out')) ?? '', /^DO /);
clearTimeout(store._persistTimer);
console.log('manual valve tests passed');
process.exit(0);
