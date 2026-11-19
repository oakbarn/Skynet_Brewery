// Override per Process and the Override pop-up (OakBarn Brewery, 2026-11-19, Rule 2.26): Processes run side by side; a button set to one
// Process moves only that one on; a Process held in a wait or sleep outside a loop with no button set to it (or Any) gets a pop-up
// after 3 seconds; a wait inside a loop never pops up by itself; show_Override / hide_Override bring it up and take it away.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, OVERRIDE_POP_MS, inLoop, compile, KEYWORDS } from '../lib/engine.js';
import { PROCESS_WORDS } from '../public/names.js';
import { COMMANDS } from '../public/colorize.js';
import { followProcessRename } from '../public/processwidget.js';
import { ON_TOP } from '../public/ontop.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ovrpop'));
const cfg = path.join(d, 'c.json');
const graphics = [];
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'Step', type: 'gGlobal', kind: 'value' }, { name: 'Hose', type: 'gGlobal', kind: 'value' }, { name: 'Temp', type: 'gGlobal', kind: 'value' }], graphics }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 6000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
const pause = ms => new Promise(r => setTimeout(r, ms));
const val = n => store.getProp(n, 'value');
const pops = () => eng.overrideList().map(a => `${a.process}:${a.how}`).sort();

// the new words are known everywhere
for (const w of ['show_override', 'hide_override']) {
  assert.ok(KEYWORDS.has(w) && PROCESS_WORDS.has(w) && COMMANDS.includes(w), w);
}
assert.ok(ON_TOP.includes('#ovrPop'), 'the pop-up is on top (Rule 18.53)');
assert.equal(OVERRIDE_POP_MS, 3000);

// inLoop: a goto further down that jumps back above the line
{
  const p = compile('Step = 1\n[A]\nwait Temp > 1\nif Temp < 5\n  goto A\nendif\nsleep 10\n');
  const at = op => p.stmts.findIndex(s => s.op === op);
  assert.equal(inLoop(p, at('wait')), true, 'the wait sits in a loop');
  assert.equal(inLoop(p, at('sleep')), false, 'the sleep after the loop does not');
}

// two Processes side by side: a button set to one moves only that one on
eng.write('Brew', 'Step = 1\nwait Temp > 150\nStep = 2\n');
eng.write('Fire_Hose', 'Hose = 1\nsleep 600000\nHose = 2\n');
eng.start('Brew'); eng.start('Fire_Hose');
assert.ok(await until(() => val('Step') === 1 && val('Hose') === 1));
assert.deepEqual(eng.override('Fritz', 'Fire_Hose'), ['Fire_Hose'], 'only the Process picked');
assert.ok(await until(() => val('Hose') === 2));
await pause(300);
assert.equal(val('Step'), 1, 'the Brew still waits');
assert.deepEqual(eng.override('Fritz', 'Nope'), [], 'a Process that is not running: nothing moves');

// no button set to Brew: after 3 s it gets the pop-up by itself
assert.deepEqual(pops(), []);
assert.ok(await until(() => pops().includes('Brew:auto')), 'the pop-up comes by itself');
// a button set to Any takes its place
store.config.graphics.push({ id: 'b1', kind: 'override', workspace: 'Brew House', label: 'Override', process: '' });
assert.ok(await until(() => !pops().length), 'an Any button: no pop-up');
assert.equal(eng.hasOverrideButton('Brew'), true);
store.config.graphics[0].process = 'Fire_Hose';
assert.equal(eng.hasOverrideButton('Brew'), false, 'a button set to another Process is not Brew\'s');
assert.ok(await until(() => pops().includes('Brew:auto')));
// pressing it (the pop-up sends the Process) moves Brew on and takes the pop-up away
eng.override('Fritz', 'Brew');
assert.ok(await until(() => val('Step') === 2));
assert.deepEqual(pops(), []);
store.config.graphics.length = 0;

// a wait inside a loop never pops up by itself
eng.write('Valve_Loop', 'Step = 10\n[Check]\nwait Temp > 150\nif Temp < 200\n  goto Check\nendif\nStep = 11\n');
eng.start('Valve_Loop');
assert.ok(await until(() => val('Step') === 10));
await pause(OVERRIDE_POP_MS + 600);
assert.deepEqual(pops(), [], 'no pop-up inside a loop');
eng.stop('Valve_Loop');

// show_Override / hide_Override on demand, with the text after it
eng.write('Boil', 'Step = 20\nshow_Override "Press when the boil is rolling"\nsleep 400\nhide_Override\nStep = 21\nshow_Override\nwait Temp > 500\nStep = 22\n');
eng.start('Boil');
assert.ok(await until(() => val('Step') === 20));
assert.deepEqual(eng.overrideList().map(a => [a.process, a.text, a.how]), [['Boil', 'Press when the boil is rolling', 'cmd']]);
assert.ok(await until(() => val('Step') === 21), 'hide_Override then goes on');
assert.ok(await until(() => pops().includes('Boil:cmd')), 'shown again');
eng.stop('Boil');
assert.ok(await until(() => !pops().length), 'it goes with the Process');

// a rename of the Process: its Override buttons follow it
{
  const g = [{ kind: 'override', process: 'Brew' }, { kind: 'override', process: '' }, { kind: 'text', process: 'Brew' }];
  assert.equal(followProcessRename(g, 'Brew', 'Brew_Day'), 1);
  assert.deepEqual(g.map(x => x.process), ['Brew_Day', '', 'Brew']);
}

for (const n of [...eng.running.keys()]) eng.stop(n);
clearTimeout(store._persistTimer);
console.log('override pop-up tests passed');
process.exit(0);
