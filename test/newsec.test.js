// newSec (OakBarn Brewery, 2026-11-26, Rule 1.34): newSec vV_Seconds = a Timer, a Time Widget or a time in any format. It makes the
// Process variable and puts the seconds in it, by the back house converter (lib/timesec.js).
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js'; import { Engine, compile, KEYWORDS } from '../lib/engine.js';
import { toSeconds } from '../lib/timesec.js';
import { TimeVal, DateVal } from '../lib/values.js';
import { PROCESS_WORDS } from '../public/names.js';
import { COMMANDS } from '../public/colorize.js';
import { SKYNET_SPECIAL } from '../public/procinsert.js';

// the converter: any format
const C = { '01:02:03': 3723, '1:02:03': 3723, '-00:00:10': -10, '00:01:30.5': 90.5, '02:03': 123, '1d 02:03:04': 93784, '2 days': 172800,
  '1h 30m 15s': 5415, '90 s': 90, '2 min': 120, '1.5 hours': 5400, '45 sec': 45, '1h and 30m': 5400, '7:30 PM': 70200, '12:00 am': 0, '90': 90 };
for (const [t, s] of Object.entries(C)) assert.equal(toSeconds(t), s, t);
assert.equal(toSeconds(new TimeVal(126)), 126, 'a Time value');
assert.equal(toSeconds(3726), 3726, 'a number is seconds');
assert.equal(toSeconds(new DateVal(new Date(2026, 10, 26, 7, 30, 15).getTime())), 27015, 'a Date Time: its time of day');
for (const bad of ['hello', '', '5 parsecs', null, true, '25:00 pm']) assert.equal(toSeconds(bad), null, String(bad));

// the command
assert.ok(KEYWORDS.has('newsec') && PROCESS_WORDS.has('newsec') && COMMANDS.includes('newsec') && SKYNET_SPECIAL.includes('newSec'), 'a Skynet Special command');
assert.match(compile('newSec vV_S').errors[0]?.msg ?? '', /newSec needs a name, an = and a time/);
assert.match(compile('newSec gblV_S = 00:01:00').errors[0]?.msg ?? '', /makes a Process variable/);
assert.equal(compile('newSec vV_S = 00:01:00').errors.length, 0);

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'sks-'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ workspaces: [{ id: 'BH', name: 'Brew House' }], elements: [
  { name: 'wgt_TMR_Boil_BH', type: 'timer', workspace: 'Brew House', timerType: 'countdown' },
  { name: 'wgt_TM_Elapsed_BH', type: 'timeWidget', workspace: 'Brew House', initial: '00:02:06' },
  { name: 'wgt_TM_Show_BH', type: 'timeWidget', workspace: 'Brew House', initial: '00:00:00' },
  { name: 'gblV_Seconds', type: 'gGlobal', kind: 'value', initial: 0 },
] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() {} });
fs.mkdirSync(path.join(d, 'scripts'), { recursive: true });
const out = [];
eng.on('print', p => out.push(String(p.text)));
fs.writeFileSync(path.join(d, 'scripts', 'ns.txt'), [
  'wgt_TMR_Boil_BH = 01:00:00',
  'newSec vV_Timer = wgt_TMR_Boil_BH', 'print "timer " + vV_Timer',
  'newSec vV_Widget = wgt_TM_Elapsed_BH', 'print "widget " + vV_Widget',
  'newSec vV_Text = "1h 30m"', 'print "text " + vV_Text',
  'gblV_Seconds = vV_Widget',
  'wgt_TM_Show_BH = vV_Timer',
  'print "done"', ''].join('\n'));
eng.start('ns');
setTimeout(() => {
  assert.deepEqual(out, ['timer 3600', 'widget 126', 'text 5400', 'done'], JSON.stringify(out));
  assert.equal(store.getProp('gblV_Seconds', 'value'), 126, 'kept in a gGlobal that already exists');
  assert.equal(String(store.getProp('wgt_TM_Show_BH', 'value')), '01:00:00', 'a Time Widget shows the seconds as a time');
  // a value that is not a time stops the Process with a plain error
  const errs = []; eng.on('error', e => errs.push(String(e.msg ?? e.message ?? e)));
  fs.writeFileSync(path.join(d, 'scripts', 'bad.txt'), 'newSec vV_X = "soon"\nprint "not here"\n');
  out.length = 0; eng.start('bad');
  setTimeout(() => {
    assert.ok(!out.includes('not here'), 'the Process stopped');
    console.log('newSec tests passed');
    process.exit(0);
  }, 500);
}, 800);
