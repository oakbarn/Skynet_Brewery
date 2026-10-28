// 🔍 Check (lib/checkrun.js): a Process is run on a scratch copy with no waiting; problems come back with a suggested fix
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Store } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
import { checkRun, closest } from '../lib/checkrun.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpcheck'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ workspaces: [{ name: 'Brewhouse' }], elements: [
  { name: 'Pump_Wort', type: 'digitalOut' }, { name: 'tm_Mash', type: 'timer', timerType: 'countdown' },
  { name: 'Mash_Temp', type: 'temperature', device: 'mega' }, { name: 'vV_Strike', type: 'vKonstant', kind: 'value' },
  { name: 'btn_Go', type: 'vKonstant', kind: 'bool' }] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
let changes = 0; store.on('change', () => changes++);
eng.write('Other', 'print "hi"\n');

// a good Process: three hours of brew checked at once, nothing on the real panel changes
const good = `Pump_Wort = true
tm_Mash = 01:00:00
start tm_Mash
wait tm_Mash <= 00:00:00
sleep 7200000
wait Mash_Temp >= 152
wait btn_Go == true
print "done " + vV_Strike
start Other
Pump_Wort = false`;
let t0 = Date.now(), r = await checkRun(eng, 'Good', good);
assert.ok(Date.now() - t0 < 2000, 'quick');
assert.deepEqual(r.problems, [], JSON.stringify(r.problems));
assert.equal(r.time, 3 * 3600);
assert.deepEqual(r.printed, ['done 0']);
assert.ok(r.notes.some(n => n.line === 6 && /reading/.test(n.text)));
assert.ok(r.notes.some(n => n.line === 7 && /button/.test(n.text)));
assert.ok(r.notes.some(n => n.line === 9 && /Other/.test(n.text)));
assert.equal(changes, 0, 'the real panel was not touched');
assert.equal(store.getProp('Pump_Wort', 'state'), false);
assert.equal(store.getProp('tm_Mash', 'running'), false);
assert.equal(eng.running.size, 0);

// spelling: a typo in a name gets the right name, the line is rewritten
r = await checkRun(eng, 'Bad', 'Pump_Wrot = true\nsleeep 1000\nif vV_Strike > 3\n  print "x"');
assert.equal(r.ran, false);
const typo = r.problems.find(p => p.line === 1);
assert.equal(typo.fix.code, 'Pump_Wort = true');
assert.equal(r.problems.find(p => p.line === 2).fix.code, 'sleep 1000');
const endif = r.problems.find(p => /endif/.test(p.msg));
assert.equal(endif.fix.mode, 'insert'); assert.equal(endif.fix.code, 'endif');

// running: an input can't be set; a wait on a stopped timer; the run goes on after a problem
r = await checkRun(eng, 'Run', 'Mash_Temp = 5\ntm_Mash = 00:10:00\nwait tm_Mash <= 00:00:00\nnew value x\nx = 1 / 0\nprint "end"');
assert.equal(r.ran, true);
assert.ok(r.problems.find(p => p.line === 1 && /input/.test(p.msg)).fix.code === '');
const w = r.problems.find(p => p.line === 3);
assert.equal(w.kind, 'warning'); assert.equal(w.fix.code, 'start tm_Mash'); assert.equal(w.fix.mode, 'insert');
assert.ok(r.problems.some(p => p.line === 5), JSON.stringify(r.problems));
assert.deepEqual(r.printed, ['end']);

// a loop is followed a few times round, then the check stops by itself
r = await checkRun(eng, 'Loop', '[top]\nsleep 1000\ngoto top');
assert.deepEqual(r.problems, []); assert.match(r.stopped, /again and again/);

// a branch not taken is listed as not reached; curly quotes are fixed
r = await checkRun(eng, 'Branch', 'if vV_Strike > 100\n  print "big"\nendif');
assert.deepEqual(r.unreached, [2]);
r = await checkRun(eng, 'Quotes', 'print “hello”');
assert.equal(r.problems[0].fix.code, 'print "hello"');
assert.equal(closest('Pmp_Wort', ['Pump_Wort', 'tm_Mash']), 'Pump_Wort');
assert.equal(closest('zzz', ['Pump_Wort']), null);
console.log('checkrun tests passed');
