// node --no-warnings test/gdeclare.test.js
// Rule 1.24 (Fritz, 2026-11-06): a gGlobal can be made in a Process. new gGlobalValue gblV_X = 10, new gblV gblV_X = 10 and
// new value gblV_X = 10 all make the same gGlobal; declare is the same word as new; a name whose start does not fit is an error.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Store, attrsOf } from '../lib/store.js'; import { Engine, compile } from '../lib/engine.js';
import { declareCheck, prefixKind, kindValueError } from '../public/gkinds.js';
import { TimeVal } from '../lib/values.js';
import { suggest } from '../public/autofill.js';

// 1. the words and the name starts
assert.deepEqual(declareCheck('gGlobalValue', 'gblV_Strike'), { kind: 'value', global: true });
assert.deepEqual(declareCheck('gblV', 'gblV_Strike'), { kind: 'value', global: true });
assert.deepEqual(declareCheck('value', 'gblV_Strike'), { kind: 'value', global: true });
assert.deepEqual(declareCheck('value', 'vStrike'), { kind: 'value', global: false });
assert.deepEqual(declareCheck('gGlobalString', 'gblS_Note'), { kind: 'string', global: true });
assert.deepEqual(declareCheck('gblT', 'gblT_Rest'), { kind: 'time', global: true });
assert.deepEqual(declareCheck('gGlobalDateTime', 'gblDT_Start'), { kind: 'datetime', global: true });
assert.deepEqual(declareCheck('gblB', 'gblB_Added'), { kind: 'bool', global: true });
assert.deepEqual(declareCheck('bool', 'gblB_Added'), { kind: 'bool', global: true });
assert.match(declareCheck('value', 'gblS_Note').error, /gblS_ is for a String/);
assert.match(declareCheck('gGlobalValue', 'Strike').error, /starts gblV_, for example gblV_Strike/);
assert.match(declareCheck('gblV', 'gblB_Added').error, /gblB_ is for a Boolean/);
assert.match(declareCheck('value', 'gG_Picture').error, /there is no Graphic gGlobal/);
assert.equal(declareCheck('pump', 'x'), null);
assert.equal(prefixKind('gravity'), null); assert.equal(prefixKind('gGV_Old'), null);

// 2. the compiler: a gGlobal is not a Process variable, declare = new, errors on the line
let c = compile('new gGlobalValue gblV_A = 10\ndeclare gblV gblV_B\nnew value gblV_C = gblV_A + 1\nnew value vLocal = 3\ndeclare string sNote\ngblV_A = gblV_B + vLocal\n');
assert.deepEqual(c.errors, []);
assert.deepEqual(c.globals.map(g => [g.name, g.kind]), [['gblV_A', 'value'], ['gblV_B', 'value'], ['gblV_C', 'value']]);
assert.equal(c.stmts.filter(s => s.op === 'assign').length, 2, 'new value vLocal = 3 is two lines; a gGlobal\'s = is its first value');
assert.ok(c.refs.some(r => r.name === 'gblV_A' && r.write), 'gblV_A = ... sets the gGlobal, not a variable');
c = compile('new value gblS_Note\nnew gGlobalTime Rest\n');
assert.equal(c.errors.length, 2); assert.equal(c.errors[0].line, 1); assert.equal(c.errors[1].line, 2);

// 3. running it makes the gGlobal once, in the Schema, and its saved value wins after that (Rule 1.22)
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpgd'));
const cfg = path.join(d, 'c.json'), data = path.join(d, 'data'), scripts = path.join(d, 'scripts');
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'Pump_1', type: 'digitalOut' }, { name: 'gblS_Old', type: 'gGlobal', kind: 'string' }] }));
const wait = ms => new Promise(r => setTimeout(r, ms));
let s = new Store(cfg, data); s.load();
const eng = new Engine(s, scripts, { logNow() {} });
eng.write('Make', 'new gGlobalValue gblV_Strike = 152\nnew gblS gblS_Note = "Mash in"\nnew bool gblB_Added\nnew gblT gblT_Rest = 00:10:00\nnew gGlobalDateTime gblDT_Start\ngblV_Strike = gblV_Strike + 1\n');
assert.deepEqual(eng.check(eng.read('Make')).errors, []);
eng.start('Make'); await wait(300);
assert.equal(s.getProp('gblV_Strike', 'value'), 153);
assert.equal(s.getProp('gblS_Note', 'value'), 'Mash in');
assert.equal(s.getProp('gblB_Added', 'value'), false);
assert.equal(s.getProp('gblT_Rest', 'value').toString(), '00:10:00');
const saved = JSON.parse(fs.readFileSync(cfg, 'utf8')).elements;
const strike = saved.find(e => e.name === 'gblV_Strike');
assert.equal(strike.type, 'gGlobal'); assert.equal(strike.kind, 'value'); assert.equal(strike.initial, 152); assert.ok(strike._key);
assert.ok(!saved.some(e => e.name === 'gblDT_Start' && e.tab), 'never on a Tab');
eng.start('Make'); await wait(300);
assert.equal(s.getProp('gblV_Strike', 'value'), 154, 'made only once: the second run keeps 153, not 152');
assert.equal(JSON.parse(fs.readFileSync(cfg, 'utf8')).elements.filter(e => e.name === 'gblV_Strike').length, 1);
s.persistNow();
s = new Store(cfg, data); s.load();
assert.equal(s.getProp('gblV_Strike', 'value'), 154, 'it is in the Schema and keeps its value after a restart');

// 4. a name already used by a Device, or by a gGlobal of another Kind, is an error in the Check and when it runs
const e2 = new Engine(s, scripts, { logNow() {} });
assert.equal(e2.check('new gblV gblV_Strike\n').errors.length, 0, 'already this Kind: fine');
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'gblV_Pump', type: 'digitalOut' }, { name: 'gblS_Old', type: 'gGlobal', kind: 'string' }] }));
s = new Store(cfg, data); s.load();
const e3 = new Engine(s, scripts, { logNow() {} });
assert.match(e3.check('new gblV gblV_Pump\n').errors[0].msg, /Device or Widget/);
assert.equal(e3.check('new gblS gblS_Old\n').errors.length, 0);
s.config.elements.find(e => e.name === 'gblS_Old').kind = 'value';   // pretend an old one has another Kind
s.els.get('gblS_Old').kind = 'value';
assert.match(e3.check('new gblS gblS_Old\n').errors[0].msg, /Kind can't be changed/);
// a line using the new gGlobal before it exists is fine in the Check (it is made when its new line runs)
assert.deepEqual(e3.check('new gblV gblV_New = 5\nif gblV_New > 3\nprint "big"\nendif\n').errors, []);

// 5. predictive text: picking the long word fills in gblV_, and the short ones are offered after new
const at = (line) => (suggest(line, { elements: [] }, '', '', true)?.list ?? []).map(i => i.text);
assert.ok(at('new').includes('new gGlobalValue gblV_')); assert.ok(at('new gG').includes('gGlobalValue gblV_'));
assert.ok(at('new ').includes('gGlobalValue gblV_')); assert.ok(at('new ').includes('gblV gblV_'));
assert.ok(at('declare ').includes('gblB gblB_'));
assert.deepEqual(at('new gGlobalString '), ['gblS_']);
assert.deepEqual(at('new gblT '), ['gblT_']);

// 6. a gGlobal takes only its own Kind of value (OakBarn Brewery, 2026-11-09, Rule 1.30)
assert.equal(kindValueError('gblT_HopDrop_1', 'time', new TimeVal(900)), '');
assert.match(kindValueError('gblT_HopDrop_1', 'time', 'My Hop Drop'), /gblT_HopDrop_1 is a Time gGlobal: it only takes a time, such as 00:15:00. It was not changed, because "My Hop Drop" is text/);
assert.match(kindValueError('gblT_HopDrop_1', 'time', 15), /15 is a number.*times 00:01:00/);
assert.match(kindValueError('gblV_X', 'value', 'abc'), /Value gGlobal/); assert.match(kindValueError('gblV_X', 'value', true), /true is a true or false/);
assert.match(kindValueError('gblB_X', 'bool', 1), /Boolean gGlobal/); assert.match(kindValueError('gblS_X', 'string', 5), /String gGlobal.*"" \+/);
assert.equal(kindValueError('gblDT_X', 'datetime', '11/09/2026 07:00:00'), ''); assert.match(kindValueError('gblDT_X', 'datetime', 'soon'), /Date Time gGlobal/);
assert.equal(kindValueError('gblV_X', 'value', -3), ''); assert.equal(kindValueError('gblS_X', 'string', ''), ''); assert.equal(kindValueError('gblB_X', 'bool', false), '');
// the Check finds a value typed on the line, before the Process runs
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'gblS_Note', type: 'gGlobal', kind: 'string' }, { name: 'gblT_Rest', type: 'gGlobal', kind: 'time' },
  { name: 'gblB_Added', type: 'gGlobal', kind: 'bool' }, { name: 'gblV_Strike', type: 'gGlobal', kind: 'value' }] }));
clearTimeout(s._persistTimer); s = new Store(cfg, path.join(d, 'data6')); s.load();
const e6 = new Engine(s, path.join(d, 'scripts6'), { logNow() {} });
c = compile('new gblT gblT_HopDrop_1 = 00:15:00\ngblT_HopDrop_1 = 00:20:00\ngblT_HopDrop_1 = "My Hop Drop"\nnew gblT gblT_HopDrop_2 = "My Hop Drop"\n');
assert.deepEqual(c.errors.map(e => e.line), [3, 4]); assert.match(c.errors[0].msg, /Time gGlobal/);
assert.deepEqual(e6.check('gblS_Note = "Mashing"\ngblS_Note = 5\ngblT_Rest = -5\ngblB_Added = true\ngblB_Added = "yes"\ngblV_Strike = 150\n').errors.map(e => e.line), [2, 3, 5]);
// and the Process stops with the error when it runs (the value comes from somewhere else)
e6.write('Wrong', 'new value vText = "My Hop Drop"\ngblT_Rest = 00:15:00\ngblT_Rest = vText\nprint "not here"\n');
assert.deepEqual(e6.check(e6.read('Wrong')).errors, []);
e6.start('Wrong'); await wait(300);
assert.equal(s.getProp('gblT_Rest', 'value').toString(), '00:15:00', 'the wrong value was not put in');
assert.match(e6.status.get('Wrong').error ?? '', /gblT_Rest is a Time gGlobal/);
e6.write('Wrong2', 'new value vNum = 7\nnew gblS gblS_Fresh = vNum\n');
e6.start('Wrong2'); await wait(300);
assert.equal(s.has('gblS_Fresh'), false, 'a gGlobal is not made with the wrong first value');
assert.match(e6.status.get('Wrong2').error ?? '', /gblS_Fresh is a String gGlobal/);

// a Time gGlobal's .minute and .seconds: a whole number becomes the whole time, rolling over into minutes and hours
e6.write('Parts', 'gblT_Rest.minute = 5\nprint gblT_Rest\n');
e6.start('Parts'); await wait(300);
assert.equal(s.getProp('gblT_Rest', 'value').toString(), '00:05:00');
for (const [n, t] of [[45, '00:00:45'], [126, '00:02:06'], [3726, '01:02:06']]) { s.setProp('gblT_Rest', 'seconds', n); assert.equal(s.getProp('gblT_Rest', 'value').toString(), t); }
s.setProp('gblT_Rest', 'minute', 90); assert.equal(s.getProp('gblT_Rest', 'value').toString(), '01:30:00');
assert.equal(s.getProp('gblT_Rest', 'minute'), 90); assert.equal(s.getProp('gblT_Rest', 'seconds'), 5400);
assert.throws(() => s.setProp('gblT_Rest', 'minute', 2.5), /only takes a whole number of minutes.*2.5 is not a whole number/);
assert.throws(() => s.setProp('gblT_Rest', 'seconds', '12'), /whole number of seconds.*"12" is text/);
assert.equal(s.getProp('gblT_Rest', 'value').toString(), '01:30:00', 'not changed');
assert.deepEqual(e6.check('gblT_Rest.minute = 5\ngblT_Rest.seconds = 126\ngblT_Rest.minute = 1.5\ngblT_Rest.seconds = "a"\ngblT_Rest.minute += 1\n').errors.map(e => e.line), [3, 4]);
assert.deepEqual(compile('new gblT gblT_H = 00:00:00\ngblT_H.minute = 5\ngblT_H.minute = "five"\n').errors.map(e => e.line), [3]);
e6.write('Parts2', 'gblT_Rest.minute = 10\ngblT_Rest.minute += 5\n');
e6.start('Parts2'); await wait(300);
assert.equal(s.getProp('gblT_Rest', 'value').toString(), '00:15:00');
assert.ok(attrsOf(s.get('gblT_Rest')).includes('minute') && attrsOf(s.get('gblT_Rest')).includes('seconds'));
assert.ok(!attrsOf(s.get('gblV_Strike')).includes('minute'));

clearTimeout(s._persistTimer);
console.log('gGlobal declare in a Process test: all passed');
process.exit(0);
