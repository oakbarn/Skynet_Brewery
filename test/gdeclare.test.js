// node --no-warnings test/gdeclare.test.js
// Rule 1.24 (Fritz, 2026-11-06): a gGlobal can be made in a Process. new gGlobalValue gV_X = 10, new gV gV_X = 10 and
// new value gV_X = 10 all make the same gGlobal; declare is the same word as new; a name whose start does not fit is an error.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Store, attrsOf } from '../lib/store.js'; import { Engine, compile } from '../lib/engine.js';
import { declareCheck, prefixKind, kindValueError } from '../public/gkinds.js';
import { TimeVal } from '../lib/values.js';
import { suggest } from '../public/autofill.js';

// 1. the words and the name starts
assert.deepEqual(declareCheck('gGlobalValue', 'gV_Strike'), { kind: 'value', global: true });
assert.deepEqual(declareCheck('gV', 'gV_Strike'), { kind: 'value', global: true });
assert.deepEqual(declareCheck('value', 'gV_Strike'), { kind: 'value', global: true });
assert.deepEqual(declareCheck('value', 'vStrike'), { kind: 'value', global: false });
assert.deepEqual(declareCheck('gGlobalString', 'gS_Note'), { kind: 'string', global: true });
assert.deepEqual(declareCheck('gT', 'gT_Rest'), { kind: 'time', global: true });
assert.deepEqual(declareCheck('gGlobalDateTime', 'gD_Start'), { kind: 'datetime', global: true });
assert.deepEqual(declareCheck('gB', 'gB_Added'), { kind: 'bool', global: true });
assert.deepEqual(declareCheck('bool', 'gB_Added'), { kind: 'bool', global: true });
assert.match(declareCheck('value', 'gS_Note').error, /gS_ is for a String/);
assert.match(declareCheck('gGlobalValue', 'Strike').error, /starts gV_, for example gV_Strike/);
assert.match(declareCheck('gV', 'gB_Added').error, /gB_ is for a Boolean/);
assert.match(declareCheck('value', 'gG_Picture').error, /Variables screen/);
assert.equal(declareCheck('pump', 'x'), null);
assert.equal(prefixKind('gravity'), null); assert.equal(prefixKind('gGV_Old'), null);

// 2. the compiler: a gGlobal is not a Process variable, declare = new, errors on the line
let c = compile('new gGlobalValue gV_A = 10\ndeclare gV gV_B\nnew value gV_C = gV_A + 1\nnew value vLocal = 3\ndeclare string sNote\ngV_A = gV_B + vLocal\n');
assert.deepEqual(c.errors, []);
assert.deepEqual(c.globals.map(g => [g.name, g.kind]), [['gV_A', 'value'], ['gV_B', 'value'], ['gV_C', 'value']]);
assert.equal(c.stmts.filter(s => s.op === 'assign').length, 2, 'new value vLocal = 3 is two lines; a gGlobal\'s = is its first value');
assert.ok(c.refs.some(r => r.name === 'gV_A' && r.write), 'gV_A = ... sets the gGlobal, not a variable');
c = compile('new value gS_Note\nnew gGlobalTime Rest\n');
assert.equal(c.errors.length, 2); assert.equal(c.errors[0].line, 1); assert.equal(c.errors[1].line, 2);

// 3. running it makes the gGlobal once, in the Schema, and its saved value wins after that (Rule 1.22)
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpgd'));
const cfg = path.join(d, 'c.json'), data = path.join(d, 'data'), scripts = path.join(d, 'scripts');
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'Pump_1', type: 'digitalOut' }, { name: 'gS_Old', type: 'gGlobal', kind: 'string' }] }));
const wait = ms => new Promise(r => setTimeout(r, ms));
let s = new Store(cfg, data); s.load();
const eng = new Engine(s, scripts, { logNow() {} });
eng.write('Make', 'new gGlobalValue gV_Strike = 152\nnew gS gS_Note = "Mash in"\nnew bool gB_Added\nnew gT gT_Rest = 00:10:00\nnew gGlobalDateTime gD_Start\ngV_Strike = gV_Strike + 1\n');
assert.deepEqual(eng.check(eng.read('Make')).errors, []);
eng.start('Make'); await wait(300);
assert.equal(s.getProp('gV_Strike', 'value'), 153);
assert.equal(s.getProp('gS_Note', 'value'), 'Mash in');
assert.equal(s.getProp('gB_Added', 'value'), false);
assert.equal(s.getProp('gT_Rest', 'value').toString(), '00:10:00');
const saved = JSON.parse(fs.readFileSync(cfg, 'utf8')).elements;
const strike = saved.find(e => e.name === 'gV_Strike');
assert.equal(strike.type, 'gGlobal'); assert.equal(strike.kind, 'value'); assert.equal(strike.initial, 152); assert.ok(strike._key);
assert.ok(!saved.some(e => e.name === 'gD_Start' && e.tab), 'never on a Tab');
eng.start('Make'); await wait(300);
assert.equal(s.getProp('gV_Strike', 'value'), 154, 'made only once: the second run keeps 153, not 152');
assert.equal(JSON.parse(fs.readFileSync(cfg, 'utf8')).elements.filter(e => e.name === 'gV_Strike').length, 1);
s.persistNow();
s = new Store(cfg, data); s.load();
assert.equal(s.getProp('gV_Strike', 'value'), 154, 'it is in the Schema and keeps its value after a restart');

// 4. a name already used by a Device, or by a gGlobal of another Kind, is an error in the Check and when it runs
const e2 = new Engine(s, scripts, { logNow() {} });
assert.equal(e2.check('new gV gV_Strike\n').errors.length, 0, 'already this Kind: fine');
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'gV_Pump', type: 'digitalOut' }, { name: 'gS_Old', type: 'gGlobal', kind: 'string' }] }));
s = new Store(cfg, data); s.load();
const e3 = new Engine(s, scripts, { logNow() {} });
assert.match(e3.check('new gV gV_Pump\n').errors[0].msg, /Device or Widget/);
assert.equal(e3.check('new gS gS_Old\n').errors.length, 0);
s.config.elements.find(e => e.name === 'gS_Old').kind = 'value';   // pretend an old one has another Kind
s.els.get('gS_Old').kind = 'value';
assert.match(e3.check('new gS gS_Old\n').errors[0].msg, /Kind can't be changed/);
// a line using the new gGlobal before it exists is fine in the Check (it is made when its new line runs)
assert.deepEqual(e3.check('new gV gV_New = 5\nif gV_New > 3\nprint "big"\nendif\n').errors, []);

// 5. predictive text: picking the long word fills in gV_, and the short ones are offered after new
const at = (line) => (suggest(line, { elements: [] }, '', '', true)?.list ?? []).map(i => i.text);
assert.ok(at('new').includes('new gGlobalValue gV_')); assert.ok(at('new gG').includes('gGlobalValue gV_'));
assert.ok(at('new ').includes('gGlobalValue gV_')); assert.ok(at('new ').includes('gV gV_'));
assert.ok(at('declare ').includes('gB gB_'));
assert.deepEqual(at('new gGlobalString '), ['gS_']);
assert.deepEqual(at('new gT '), ['gT_']);

// 6. a gGlobal takes only its own Kind of value (OakBarn Brewery, 2026-11-09, Rule 1.30)
assert.equal(kindValueError('gT_HopDrop_1', 'time', new TimeVal(900)), '');
assert.match(kindValueError('gT_HopDrop_1', 'time', 'My Hop Drop'), /gT_HopDrop_1 is a Time gGlobal: it only takes a time, such as 00:15:00. It was not changed, because "My Hop Drop" is text/);
assert.match(kindValueError('gT_HopDrop_1', 'time', 15), /15 is a number.*times 00:01:00/);
assert.match(kindValueError('gV_X', 'value', 'abc'), /Value gGlobal/); assert.match(kindValueError('gV_X', 'value', true), /true is a true or false/);
assert.match(kindValueError('gB_X', 'bool', 1), /Boolean gGlobal/); assert.match(kindValueError('gS_X', 'string', 5), /String gGlobal.*"" \+/);
assert.equal(kindValueError('gD_X', 'datetime', '11/09/2026 07:00:00'), ''); assert.match(kindValueError('gD_X', 'datetime', 'soon'), /Date Time gGlobal/);
assert.equal(kindValueError('gV_X', 'value', -3), ''); assert.equal(kindValueError('gS_X', 'string', ''), ''); assert.equal(kindValueError('gB_X', 'bool', false), '');
// the Check finds a value typed on the line, before the Process runs
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'gS_Note', type: 'gGlobal', kind: 'string' }, { name: 'gT_Rest', type: 'gGlobal', kind: 'time' },
  { name: 'gB_Added', type: 'gGlobal', kind: 'bool' }, { name: 'gV_Strike', type: 'gGlobal', kind: 'value' }] }));
clearTimeout(s._persistTimer); s = new Store(cfg, path.join(d, 'data6')); s.load();
const e6 = new Engine(s, path.join(d, 'scripts6'), { logNow() {} });
c = compile('new gT gT_HopDrop_1 = 00:15:00\ngT_HopDrop_1 = 00:20:00\ngT_HopDrop_1 = "My Hop Drop"\nnew gT gT_HopDrop_2 = "My Hop Drop"\n');
assert.deepEqual(c.errors.map(e => e.line), [3, 4]); assert.match(c.errors[0].msg, /Time gGlobal/);
assert.deepEqual(e6.check('gS_Note = "Mashing"\ngS_Note = 5\ngT_Rest = -5\ngB_Added = true\ngB_Added = "yes"\ngV_Strike = 150\n').errors.map(e => e.line), [2, 3, 5]);
// and the Process stops with the error when it runs (the value comes from somewhere else)
e6.write('Wrong', 'new value vText = "My Hop Drop"\ngT_Rest = 00:15:00\ngT_Rest = vText\nprint "not here"\n');
assert.deepEqual(e6.check(e6.read('Wrong')).errors, []);
e6.start('Wrong'); await wait(300);
assert.equal(s.getProp('gT_Rest', 'value').toString(), '00:15:00', 'the wrong value was not put in');
assert.match(e6.status.get('Wrong').error ?? '', /gT_Rest is a Time gGlobal/);
e6.write('Wrong2', 'new value vNum = 7\nnew gS gS_Fresh = vNum\n');
e6.start('Wrong2'); await wait(300);
assert.equal(s.has('gS_Fresh'), false, 'a gGlobal is not made with the wrong first value');
assert.match(e6.status.get('Wrong2').error ?? '', /gS_Fresh is a String gGlobal/);

// a Time gGlobal's .minute and .seconds: a whole number becomes the whole time, rolling over into minutes and hours
e6.write('Parts', 'gT_Rest.minute = 5\nprint gT_Rest\n');
e6.start('Parts'); await wait(300);
assert.equal(s.getProp('gT_Rest', 'value').toString(), '00:05:00');
for (const [n, t] of [[45, '00:00:45'], [126, '00:02:06'], [3726, '01:02:06']]) { s.setProp('gT_Rest', 'seconds', n); assert.equal(s.getProp('gT_Rest', 'value').toString(), t); }
s.setProp('gT_Rest', 'minute', 90); assert.equal(s.getProp('gT_Rest', 'value').toString(), '01:30:00');
assert.equal(s.getProp('gT_Rest', 'minute'), 90); assert.equal(s.getProp('gT_Rest', 'seconds'), 5400);
assert.throws(() => s.setProp('gT_Rest', 'minute', 2.5), /only takes a whole number of minutes.*2.5 is not a whole number/);
assert.throws(() => s.setProp('gT_Rest', 'seconds', '12'), /whole number of seconds.*"12" is text/);
assert.equal(s.getProp('gT_Rest', 'value').toString(), '01:30:00', 'not changed');
assert.deepEqual(e6.check('gT_Rest.minute = 5\ngT_Rest.seconds = 126\ngT_Rest.minute = 1.5\ngT_Rest.seconds = "a"\ngT_Rest.minute += 1\n').errors.map(e => e.line), [3, 4]);
assert.deepEqual(compile('new gT gT_H = 00:00:00\ngT_H.minute = 5\ngT_H.minute = "five"\n').errors.map(e => e.line), [3]);
e6.write('Parts2', 'gT_Rest.minute = 10\ngT_Rest.minute += 5\n');
e6.start('Parts2'); await wait(300);
assert.equal(s.getProp('gT_Rest', 'value').toString(), '00:15:00');
assert.ok(attrsOf(s.get('gT_Rest')).includes('minute') && attrsOf(s.get('gT_Rest')).includes('seconds'));
assert.ok(!attrsOf(s.get('gV_Strike')).includes('minute'));

clearTimeout(s._persistTimer);
console.log('gGlobal declare in a Process test: all passed');
process.exit(0);
