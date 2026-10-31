// Override button (Fritz, 2026-10-30): one press lets each running Process move on 100 ms later: a wait or sleep ends,
// and the loop it sits in (a goto back up) is passed. The next wait runs as normal.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, OVERRIDE_MS } from '../lib/engine.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'override'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'Step', type: 'gKonstant', kind: 'value' }, { name: 'Temp', type: 'gKonstant', kind: 'value' }, { name: 'Count', type: 'gKonstant', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
const pause = ms => new Promise(r => setTimeout(r, ms));
const val = n => store.getProp(n, 'value');

assert.equal(OVERRIDE_MS, 100);
assert.deepEqual(eng.override(), [], 'nothing running: nothing to move on');

// a wait: passed 100 ms after the press; the next wait runs as normal
eng.write('waits', 'Step = 1\nwait Temp > 150\nStep = 2\nwait Temp > 160\nStep = 3\n');
eng.start('waits');
assert.ok(await until(() => val('Step') === 1));
await pause(150);
assert.equal(val('Step'), 1, 'held by the wait');
const t0 = Date.now();
assert.deepEqual(eng.override(), ['waits']);
assert.ok(await until(() => val('Step') === 2), 'the wait was passed');
assert.ok(Date.now() - t0 >= OVERRIDE_MS - 5, 'not before 100 ms');
await pause(400);
assert.equal(val('Step'), 2, 'the next wait runs as normal');
eng.override();
assert.ok(await until(() => val('Step') === 3));
assert.ok(await until(() => !eng.running.has('waits')));

// a sleep
eng.write('sleeps', 'Step = 10\nsleep 600000\nStep = 11\n');
eng.start('sleeps');
assert.ok(await until(() => val('Step') === 10));
eng.override();
assert.ok(await until(() => val('Step') === 11), 'a sleep is passed');

// a loop with a sleep inside an if: the sleep ends and the goto back up is passed
eng.write('loop', 'Step = 20\n[Heat]\nCount += 1\nif Temp < 150\n  sleep 60000\n  goto Heat\nendif\nStep = 21\nsleep 60000\nStep = 22\n');
eng.start('loop');
assert.ok(await until(() => val('Step') === 20 && val('Count') === 1));
eng.override();
assert.ok(await until(() => val('Step') === 21), 'the loop is left');
assert.equal(val('Count'), 1, 'it did not go round again');
await pause(300);
assert.equal(val('Step'), 21, 'the sleep after the loop runs as normal');
eng.stop('loop');

// a tight loop with no wait at all
eng.write('tight', 'Step = 30\n[Spin]\nif Temp < 150\n  goto Spin\nendif\nStep = 31\n');
eng.start('tight');
assert.ok(await until(() => val('Step') === 30));
await pause(150);
assert.equal(val('Step'), 30);
eng.override();
assert.ok(await until(() => val('Step') === 31), 'a tight loop is left');

// a Looper Process runs in the background on its own: Override leaves it alone
eng.write('looper_Log', 'Count = 0\n[Loop]\nCount += 1\nsleep 50\ngoto Loop\n');
eng.start('looper_Log');
assert.equal(eng.classOf('looper_Log'), 'looper');
assert.ok(await until(() => val('Count') >= 2));
assert.deepEqual(eng.override(), [], 'a Looper is not moved on');
await pause(400);
assert.ok(eng.running.has('looper_Log'), 'it keeps looping');
eng.stop('looper_Log');

// a press nothing uses is dropped after a second, so a later wait is not skipped
eng.write('late', 'Step = 40\nwait Temp > 150\nStep = 41\n');
eng.start('late');
assert.ok(await until(() => val('Step') === 40));
eng.running.get('late').override = { at: Date.now() - 1500, used: false };
await pause(300);
assert.equal(val('Step'), 40, 'an old press is dropped');
assert.equal(eng.running.get('late').override, undefined);
eng.stop('late');

for (const n of [...eng.running.keys()]) eng.stop(n);
clearTimeout(store._persistTimer);
console.log('override tests passed');
process.exit(0);
