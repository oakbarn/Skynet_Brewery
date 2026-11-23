// The Process Error Log, the Fix before next Brew Day list and its 🧪 Check (Rule 10.13; OakBarn Brewery, 2026-11-23: "an error log
// with the line # of the error, what the error was and a way to fix it if evident"; "Log it, and if it was fixed, the fix.  and the
// Check button could be used to check it in a simulation mode just for the checking"; "use the Pop up Override to run from just above
// the error"). Run with panelupdate12.test.js, so package.json is not changed.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { Store } from '../lib/store.js';
import { Engine, CHECK_STOPS } from '../lib/engine.js';
import { ErrorLog, lineNow, KEEP_FIXED_DAYS } from '../lib/errorlog.js';
import { runCheck, checkFrom } from '../lib/checkrun.js';
import { compile } from '../lib/engine.js';
import { fixHint } from '../public/errorfix.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'errlog'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [{ name: 'gV_Temp', type: 'gGlobal', kind: 'value', value: 10 }] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const dir = path.join(d, 'processes');
const engine = new Engine(store, dir, { logNow() { } });
const log = new ErrorLog(path.join(d, 'data'));
engine.on('procError', e => log.addError(e));
engine.on('written', (n, t) => log.saved(n, t));
const settle = ms => new Promise(r => setTimeout(r, ms));

// 1. a runtime error is logged by itself: Process, exact line, its text, what, how to fix, and the variables then
engine.write('Mash', ['// Mash', '', 'new value X = 1', 'new value Y = NULL', '/* two', 'lines */', 'X = X + 1; gV_Temp = 20', 'X = Y + 1', 'wait X > 100', 'print "after"'].join('\r\n'));
engine.start('Mash');
await settle(100);
let e = log.list()[0];
assert.equal(e.process, 'Mash'); assert.equal(e.line, 8, 'the exact line, counting comments and blank lines');
assert.equal(e.lineText, 'X = Y + 1'); assert.match(e.msg, /Y is NULL/);
assert.equal(e.fix, '', 'the error says how itself (Test it first)');
assert.deepEqual(e.vars.find(v => v[0] === 'X')[1].val, 2, 'the variables when it happened');
assert.equal(store.getProp('gV_Temp', 'value'), 20, 'the real run did set it');
// the same error again is one entry with a count
engine.start('Mash'); await settle(100);
assert.equal(log.list().length, 1); assert.equal(log.list()[0].count, 2);

// 2. a Process that does not start is logged with its line
engine.write('Boil', ['// Boil', 'if (1 > 0) {', 'print "x"'].join('\n'));
assert.equal(engine.start('Boil').ok, false);
const nb = log.list().find(x => x.process === 'Boil');
assert.ok(nb.notStarted); assert.equal(nb.line, 2); assert.match(nb.fix, /endif/);

// 3. saving the Process keeps the changed line as the fix
store.setProp('gV_Temp', 'value', 10, 'script');
engine.write('Mash', ['// Mash', '', 'new value X = 1', 'new value Y = NULL', '/* two', 'lines */', 'X = X + 1; gV_Temp = 20', 'X = X + 1 + gV_Temp', 'gV_Temp = 99', 'wait X > 100', 'print "after"', 'X = Y * 2'].join('\n'));
e = log.get(e.id);
assert.deepEqual([e.change.before, e.change.after], ['X = Y + 1', 'X = X + 1 + gV_Temp'], 'the line as it was and as it is now');
assert.equal(lineNow(fs.readFileSync(path.join(dir, 'Mash.txt'), 'utf8').split('\n'), 8, 'X = Y + 1'), 8, 'no line with the same text: the same line');
assert.equal(lineNow(['a', 'b', 'X = 1'], 2, 'X = 1'), 3, 'a line moved down: found by its text');

// 4. 🧪 Check: from just above the error to the next wait, in a check-only copy; nothing real is set or saved
const cfgBefore = fs.readFileSync(path.join(d, 'c.json'), 'utf8');
let r = await runCheck({ store, dir, name: 'Mash', line: 8, lineText: 'X = Y + 1', vars: log.get(e.id).vars });
assert.equal(r.ok, true, JSON.stringify(r)); assert.equal(r.from, 7, 'just above the error line'); assert.deepEqual(r.reached, { line: 10, op: 'wait' });
assert.ok(r.sets.some(s => s.name === 'gV_Temp' && s.value === 99), 'what it would have set');
assert.equal(store.getProp('gV_Temp', 'value'), 10, 'the real gGlobal is not touched by a Check');
assert.equal(fs.readFileSync(path.join(d, 'c.json'), 'utf8'), cfgBefore, 'nothing saved');
// ▶ Override goes on past the wait, with the variables the last Check ended with, and finds the next error
r = await runCheck({ store, dir, name: 'Mash', line: r.reached.line, vars: r.vars, after: true });
assert.equal(r.ok, false); assert.equal(r.error.line, 12); assert.match(r.error.msg, /Y is NULL/);
assert.ok(r.prints.some(p => /after/.test(p)));
// a Process that does not compile: the Check says so at its line
engine.write('Boil', ['// Boil', 'if (1 > 0) {', 'print "x"'].join('\n'));
r = await runCheck({ store, dir, name: 'Boil', line: 2 });
assert.equal(r.ok, false); assert.equal(r.error.line, 2);
// a loop with no wait stops after 5000 statements
engine.write('Loop', ['new value N = 0', '[top]', 'N = N + 1', 'goto top'].join('\n'));
r = await runCheck({ store, dir, name: 'Loop', line: 3 });
assert.equal(r.ok, true); assert.equal(r.reached.op, 'limit');
// the start line: the statement before the error, unless it is a wait, step or label
const st = compile(['new value A = 1', 'wait A > 0', 'A = B', 'A = 2', 'A = C'].join('\n')).stmts;
assert.equal(st[checkFrom(st, 3)].line, 3); assert.equal(st[checkFrom(st, 5)].line, 4);
assert.ok(['wait', 'sleep', 'step', 'ask'].every(o => CHECK_STOPS.has(o)));

// 5. fixed, open again, a person's own issue, delete; kept on the Brain
const f = log.fixed(e.id, { by: 'admin', note: 'made Y' });
assert.equal(f.status, 'fixed'); assert.equal(log.openCount(), 1);
log.reopen(e.id); assert.equal(log.get(e.id).status, 'open');
const iss = log.addIssue({ text: 'HLT valve sticks', by: 'admin', tab: 'Brew House' });
assert.equal(iss.kind, 'issue'); assert.throws(() => log.addIssue({ text: '  ' }));
assert.equal(new ErrorLog(path.join(d, 'data')).list().length, 3, 'kept in data/errorlog.json');
assert.ok(log.remove(iss.id)); assert.equal(log.list().length, 2);
// fixed entries are kept 90 days
let t = 0; const old = new ErrorLog(null, () => t);
const x = old.addError({ process: 'P', line: 1, msg: 'm' }); old.fixed(x.id); t = (KEEP_FIXED_DAYS + 1) * 86400000; old.addIssue({ text: 'y' });
assert.equal(old.list().length, 1);

// 6. how to fix: only when evident
assert.equal(fixHint('delay needs a number of seconds: delay 7'), '', 'its own words show how');
assert.match(fixHint('Variable X used before "new"'), /Move the "new ... X" line above/);
assert.match(fixHint('goto: no label [Mash_In]'), /\[Mash_In\]/);
assert.match(fixHint('start: no process or element named "Pump_1"'), /spelling of "Pump_1"/);
assert.equal(fixHint('something new'), '');

// 7. the screen and the Rules
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8'), server = fs.readFileSync(new URL('../server.js', import.meta.url), 'utf8');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
assert.match(app, /item\(\['🔧 Fix before next Brew Day'/);
assert.match(app, /'🧪 Check'\) : null/); assert.match(app, /'▶ Override'\)/); assert.match(app, /'➕ Add an issue'\)/);
assert.match(server, /p\.startsWith\('\/ui\/errorlog'\)\) return 'operator';/);
assert.match(rules, /10\.13 \*\*The Process Error Log/);
engine.stopAll();
console.log('errorlog ok');
