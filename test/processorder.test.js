// Order numbers in the Processes list (Fritz, 2026-10-21): each class group counts 1, 2, 3 ... and renumbers itself
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'porder'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const order = cls => eng.list().filter(s => s.cls === cls).sort((a, b) => a.order - b.order).map(s => `${s.order}:${s.name}`);

for (const n of ['sub_A', 'sub_B', 'sub_C', 'sub_D', 'scrMash']) eng.write(n, 'print "hi"\n');
assert.deepEqual(order('sub'), ['1:sub_A', '2:sub_B', '3:sub_C', '4:sub_D'], 'no numbers yet: by name');
assert.deepEqual(order('flow'), ['1:scrMash'], 'each group counts on its own');

eng.setOrder('sub_D', 1);
assert.deepEqual(order('sub'), ['1:sub_D', '2:sub_A', '3:sub_B', '4:sub_C'], 'the others move down');
eng.setOrder('sub_D', 3);
assert.deepEqual(order('sub'), ['1:sub_A', '2:sub_B', '3:sub_D', '4:sub_C']);
eng.setOrder('sub_A', 99);
assert.deepEqual(order('sub'), ['1:sub_B', '2:sub_D', '3:sub_C', '4:sub_A'], 'too big goes last');
eng.setOrder('sub_A', 0);
assert.deepEqual(order('sub'), ['1:sub_A', '2:sub_B', '3:sub_D', '4:sub_C'], 'too small goes first');
assert.deepEqual(store.config.processOrder, { sub_A: 1, sub_B: 2, sub_D: 3, sub_C: 4 }, 'saved in the config');

eng.write('sub_E', 'print "new"\n');
assert.equal(order('sub').at(-1), '5:sub_E', 'a new Process lands at the end');

eng.rename('sub_D', 'sub_Dx');
assert.deepEqual(order('sub'), ['1:sub_A', '2:sub_B', '3:sub_Dx', '4:sub_C', '5:sub_E'], 'a rename keeps its place');

eng.remove('sub_B');
assert.deepEqual(order('sub'), ['1:sub_A', '2:sub_Dx', '3:sub_C', '4:sub_E'], 'a delete closes the gap');
assert.ok(!('sub_B' in store.config.processOrder));

eng.setClass('sub_A', 'flow');
assert.deepEqual(order('flow'), ['1:scrMash', '2:sub_A'], 'a class change goes to the end of the new group');
assert.deepEqual(order('sub'), ['1:sub_Dx', '2:sub_C', '3:sub_E']);

assert.throws(() => eng.setOrder('nope', 1), /not found/);
console.log('processorder ok');
