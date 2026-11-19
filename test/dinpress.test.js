// On Press (OakBarn Brewery, 2026-11-19, Rule 6.38): a physical DIN push button does one thing: Run a Process (as a Process Widget's
// Start; a press while it runs is ignored), Advance (an Override set to Any or one Process, only when it is held in a wait or sleep;
// otherwise ignored) or Cancel all alarms. None does nothing more.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';
import { watchDinPresses, followPressRename } from '../lib/dinpress.js';
import { ON_PRESS, onPressOf } from '../public/onpress.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dinpress'));
const cfg = path.join(d, 'c.json');
const din = (name, onPress, pressProcess = '') => ({ name, type: 'digitalIn', mode: 'momentary', pulse: 100, lockout: 3000, onPress, pressProcess });
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'Step', type: 'gGlobal', kind: 'value' }, { name: 'Hose', type: 'gGlobal', kind: 'value' }, { name: 'Temp', type: 'gGlobal', kind: 'value' },
  din('Yellow', 'process', 'Fire_Hose'), din('Blue', 'advance', ''), din('BlueBrew', 'advance', 'Brew'), din('Red', 'alarms'), din('Green', ''),
  { name: 'HopAlarm', type: 'alarm' }, { name: 'StepAlarm', type: 'alarm' },
], graphics: [] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const said = [];
watchDinPresses(store, eng, { log: t => said.push(t) });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
const pause = ms => new Promise(r => setTimeout(r, ms));
const val = n => store.getProp(n, 'value');
const press = n => store.setProp(n, 'count', (store.getProp(n, 'count') || 0) + 1, 'hw');      // what the board's press does (lib/hardware.js)

assert.deepEqual(ON_PRESS.map(x => x[0]), ['', 'process', 'advance', 'alarms']);
assert.equal(onPressOf({ type: 'digitalIn', onPress: 'nonsense' }), '');
assert.equal(onPressOf({ type: 'digitalOut', onPress: 'process' }), '', 'only a Digital Input');

// Run a Process: the yellow 20 second Fire Hose (shortened here). A press while it runs is ignored; it is never stopped by a press.
eng.write('Fire_Hose', 'Hose = 1\nsleep 400\nHose = 2\n');
press('Yellow');
assert.ok(await until(() => val('Hose') === 1), 'the press started Fire_Hose');
assert.equal(eng.running.get('Fire_Hose')?.by, 'Yellow', 'started by the button');
press('Yellow');
assert.ok(eng.running.has('Fire_Hose'), 'a second press does not stop it');
assert.match(said.at(-1), /already running/);
assert.ok(await until(() => val('Hose') === 2 && !eng.running.has('Fire_Hose')), 'it ran to its end');
// a Process setting the count, or a count reset to 0, is not a press
store.setProp('Yellow', 'count', 99, 'process');
store.setProp('Yellow', 'count', 0, 'hw');
await pause(100);
assert.ok(!eng.running.has('Fire_Hose'));

// Advance: ignored when nothing is waiting
eng.write('Brew', 'Step = 1\nStep = 2\nwait Temp > 150\nStep = 3\nwait Temp > 160\nStep = 4\n');
eng.write('Other', 'sleep 600000\n');
press('Blue');
assert.match(said.at(-1), /ignored/, 'nothing running: ignored');
eng.start('Brew'); eng.start('Other');
assert.ok(await until(() => val('Step') === 2 && eng.running.get('Brew')?.held));
press('BlueBrew');
assert.ok(await until(() => val('Step') === 3), 'Advance set to Brew passed its wait');
assert.ok(eng.running.has('Other'), 'Other kept sleeping: only Brew moved on');
await pause(300);
assert.equal(val('Step'), 3, 'the next wait runs as normal');
press('Blue');      // Any: Brew and Other both held
assert.ok(await until(() => val('Step') === 4 && !eng.running.has('Other')), 'Any moved every waiting Process on');
assert.ok(eng.hasOverrideButton('Brew'), 'a DIN set to Advance counts as an Override button: no automatic pop-up');

// Cancel all alarms
store.setProp('HopAlarm', 'active', true, 'process'); store.setProp('StepAlarm', 'active', true, 'process');
press('Red');
assert.equal(store.getProp('HopAlarm', 'active'), false); assert.equal(store.getProp('StepAlarm', 'active'), false);
assert.match(said.at(-1), /HopAlarm, StepAlarm/);

// None: nothing more than the input's own State
const n0 = said.length; press('Green'); await pause(50);
assert.equal(said.length, n0);

// a Process renamed: Run and Advance follow it
const els = [din('A', 'process', 'Fire_Hose'), din('B', 'advance', 'Fire_Hose'), din('C', 'alarms', 'Fire_Hose')];
assert.equal(followPressRename(els, 'Fire_Hose', 'Hose_20s'), 2);
assert.deepEqual(els.map(e => e.pressProcess), ['Hose_20s', 'Hose_20s', 'Fire_Hose']);

for (const n of [...eng.running.keys()]) eng.stop(n);
clearTimeout(store._persistTimer);
console.log('DIN button On Press tests passed');
