// my_Process.running: true while a Process runs, read only (Fritz, 2026-10-21)
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';
import { classify, CLASSES } from '../public/colorize.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'running'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'tm_Mash', type: 'timer' }, { name: 'Seen', type: 'vKonstant', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const prints = []; eng.on('print', p => prints.push(`${p.script}: ${p.text}`));
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
const ok = (name, text) => { eng.write(name, text); assert.deepEqual(eng.check(text).errors, [], name); };

// ---- every spelling compiles; a single = in a condition asks, like ==
for (const t of [
  'if my_Process_Mash.running = true\n  stop my_Process_Mash\nendif',
  'if my_Process_Mash.running == true\n  stop my_Process_Mash\nendif',
  'if (my_Process_Mash.running) { stop my_Process_Mash; }',
  'if (my_Process_Mash.running = true) stop my_Process_Mash;',
  'if (!my_Process_Mash.running) start my_Process_Mash;',
  'wait my_Process_Mash.running == false',
]) assert.deepEqual(compile(t).errors, [], t);
assert.equal(compile('if X = 3\nendif').stmts[0].expr.op, '==');
assert.equal(compile('if (X = 3) Y = 4').stmts[1].op, 'assign', 'the = after the condition still sets');

ok('my_Process_Mash', '[Loop]\nsleep 20\ngoto Loop\n');
// ---- check knows the name is a Process; writing to .running is an error
ok('boss', 'if my_Process_Mash.running = true\n  print "was running"\n  stop my_Process_Mash\nelse\n  print "was stopped"\nendif\n');
assert.deepEqual(eng.check('print "my_Process_Mash".running').errors, []);
assert.match(eng.check('my_Process_Mash.running = false').errors[0].msg, /my_Process_Mash\.running is read only: use start my_Process_Mash or stop my_Process_Mash/);
assert.match(eng.check('if Nope.running\nendif').errors[0].msg, /Nope/, 'an unknown name is still an error');

// ---- the value follows the Process
eng.start('boss');
assert.ok(await until(() => !eng.running.has('boss')));
assert.ok(prints.includes('boss: was stopped'));
eng.start('my_Process_Mash');
eng.start('boss');
assert.ok(await until(() => !eng.running.has('boss')));
assert.ok(prints.includes('boss: was running'));
assert.ok(await until(() => !eng.running.has('my_Process_Mash')), 'boss stopped it');

// ---- a Process that writes to it stops with the clear error
eng.write('writer', 'my_Process_Mash.running = true\n');
eng.start('writer');
assert.ok(await until(() => eng.status.get('writer')?.state === 'error' || eng.status.get('writer')?.error));
assert.match(eng.status.get('writer').error, /read only/);
assert.equal(eng.running.has('my_Process_Mash'), false);

// ---- a timer's .running is its own and can still be set
ok('timers', 'tm_Mash.running = true\nif tm_Mash.running = true\n  Seen = 1\nendif\n');
eng.start('timers');
assert.ok(await until(() => store.getProp('Seen', 'value') === 1));
assert.equal(store.getProp('tm_Mash', 'running'), true);

// ---- editor colors: Process name olive, running gray
const text = 'if my_Process_Mash.running = true', cls = classify(text, { processes: ['my_Process_Mash'], elements: [] });
assert.equal(CLASSES[cls[3]], 'proc');
assert.equal(CLASSES[cls[text.indexOf('running')]], 'attr');

console.log('running tests passed');
process.exit(0);
