// restart command and "Restart if it fails", with the guard against endless restarts (Fritz, 2026-10-05)
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'restart'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'Count', type: 'vKonstant', kind: 'value' }, { name: 'alm_Stuck', type: 'alarm' },
], restartLimit: 3, restartAlarm: 'alm_Stuck' }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const prints = [], alerts = []; eng.on('print', p => prints.push(`${p.script}: ${p.text}`)); eng.on('alert', a => alerts.push(a));
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
const ok = (name, text) => { eng.write(name, text); assert.deepEqual(eng.check(text).errors, [], name); };

// ---- the words compile, and check names a missing Process
assert.deepEqual(compile('restart').errors, []);
assert.equal(compile('restart').stmts[0].op, 'restart');
assert.equal(compile('restart Looper_Temps').stmts[0].expr.k, 'strvar');
assert.equal(compile('restart = 5').stmts[0].op, 'assign', 'an element called restart can still be set');
assert.match(eng.check('restart Nope').errors[0].msg, /no process named "Nope"/);

// ---- restart another Process: it stops, its memory is cleared, it starts again from the top
ok('worker', 'new value n\nn += 1\nprint "n is " + n\nCount += 1\n[Loop]\nsleep 50\ngoto Loop\n');
ok('boss', 'sleep 100\nrestart worker\nprint "boss done"\n');
store.setProp('Count', 'value', 0);
eng.start('worker');
eng.start('boss');
assert.ok(await until(() => prints.includes('boss: boss done')));
assert.ok(eng.running.has('worker'), 'worker runs again');
assert.equal(store.getProp('Count', 'value'), 2, 'started twice');
assert.equal(prints.filter(p => p === 'worker: n is 1').length, 2, 'its variable started from scratch both times');
eng.stop('worker'); await until(() => !eng.running.has('worker'));

// ---- restart pressed by a person (also starts a stopped Process) is never counted
for (let i = 0; i < 5; i++) assert.equal((await eng.restart('worker', 'user')).ok, true);
assert.ok(eng.running.has('worker'));
eng.stop('worker'); await until(() => !eng.running.has('worker'));

// ---- restart on its own: the Process restarts itself; past the limit it stays stopped and the alarm sounds
store.setProp('Count', 'value', 0);
ok('selfie', 'Count += 1\nsleep 20\nrestart\n');
eng.start('selfie');
assert.ok(await until(() => eng.status.get('selfie')?.gaveUp));
assert.equal(store.getProp('Count', 'value'), 4, 'first run + 3 restarts');
assert.equal(eng.status.get('selfie').state, 'error');
assert.match(eng.status.get('selfie').error, /restarted 3 times in one minute/);
assert.equal(alerts.length, 1); assert.equal(alerts[0].process, 'selfie');
assert.equal(store.getProp('alm_Stuck', 'active'), true, 'the alarm from Settings sounds');
assert.equal(eng.running.has('selfie'), false);
store.setProp('alm_Stuck', 'active', false);

// starting it by hand begins a new count
store.setProp('Count', 'value', 0);
eng.start('selfie', 'user');
assert.ok(await until(() => eng.status.get('selfie')?.gaveUp && !eng.running.has('selfie')));
assert.equal(store.getProp('Count', 'value'), 4);

// ---- Restart if it fails: an error starts it again, 2 seconds later
store.setProp('Count', 'value', 0);
ok('flaky', 'Count += 1\nif Count < 2\n  Count = 1 / 0\nendif\nprint "made it"\n[Loop]\nsleep 50\ngoto Loop\n');
eng.setAutoRestart('flaky', true);
assert.equal(eng.list().find(p => p.name === 'flaky').autorestart, true);
assert.deepEqual(JSON.parse(fs.readFileSync(cfg, 'utf8')).autorestart, ['flaky'], 'saved in the config');
eng.start('flaky');
assert.ok(await until(() => eng.status.get('flaky')?.state === 'error'));
assert.ok(prints.some(p => p.startsWith('flaky: Restarting in 2 seconds')));
assert.ok(await until(() => prints.includes('flaky: made it')));
assert.equal(store.getProp('Count', 'value'), 2);

// pressing Stop is not a failure: no restart
eng.stop('flaky'); await until(() => !eng.running.has('flaky'));
await new Promise(r => setTimeout(r, 300));
assert.equal(eng.running.has('flaky'), false);
assert.equal(eng.status.get('flaky').state, 'stopped');

// Stop during the 2 seconds before a restart cancels it
store.setProp('Count', 'value', 0);
eng.start('flaky');
assert.ok(await until(() => eng.pending.has('flaky')));
assert.equal(eng.stop('flaky'), true);
await new Promise(r => setTimeout(r, 2300));
assert.equal(eng.running.has('flaky'), false, 'the waiting restart was cancelled');

// a Process that always fails gives up after the limit, without waiting forever
ok('broken', 'Count = 1 / 0\n');
eng.setAutoRestart('broken', true);
const t0 = Date.now(); alerts.length = 0;
eng.start('broken');
assert.ok(await until(() => eng.status.get('broken')?.gaveUp, 12000));
assert.ok(Date.now() - t0 >= 5500, '3 restarts, 2 seconds apart');
assert.equal(alerts.length, 1);
assert.match(eng.status.get('broken').error, /^line 1: .*Not restarted again/);

// renaming or deleting keeps the setting right
eng.rename('broken', 'broken2');
assert.equal(eng.autoRestart('broken2'), true); assert.equal(eng.autoRestart('broken'), false);
eng.remove('broken2');
assert.deepEqual(store.config.autorestart, ['flaky']);

console.log('restart tests passed');
process.exit(0);
