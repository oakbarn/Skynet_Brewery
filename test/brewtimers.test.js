// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Panel Update 9 items 10d and 31 (OakBarn Brewery, 2026-11-22): the Boil Probe switch and wait_boil (Rule 1.18), the Skynet Brew Timers
// skn_Boil_Timer, skn_Mash_Timer and skn_Whirlpool_Timer (Rule 2.68), and the hop alerts on the Boil Timer.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, KEYWORDS } from '../lib/engine.js';
import { BrewTimers, brewTimerText, isBrewTimer } from '../lib/brewtimers.js';
import { HopAlerts } from '../lib/recipe.js';
import { PROCESS_WORDS } from '../public/names.js';
import { COMMANDS } from '../public/colorize.js';
import { suggest } from '../public/autofill.js';

const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };

// hh:mm until 5 minutes are left, then hh:mm:ss
assert.equal(brewTimerText(3600), '01:00');
assert.equal(brewTimerText(5400), '01:30');
assert.equal(brewTimerText(301), '00:06');
assert.equal(brewTimerText(300), '00:05:00');
assert.equal(brewTimerText(61), '00:01:01');
assert.equal(brewTimerText(0), '00:00:00');
assert.ok(isBrewTimer('skn_boil_timer') && isBrewTimer('"skn_Mash_Timer"') && isBrewTimer('skn_Whirlpool_Timer') && !isBrewTimer('Boil_Timer'));

// the timers count down on the clock they are given, start from the Brew Day value, and stop at 0
let now = 0;
const seen = [];
const bt = new BrewTimers({ clock: () => now, brewDay: n => ({ skn_Boil_Timer: 3600, skn_Mash_Timer: 900, skn_Whirlpool_Timer: 600 })[n], emit: v => seen.push(v) });
bt.start('skn_Boil_Timer');
assert.equal(bt.running('skn_Boil_Timer'), true);
now = 1000 * 60 * 30; assert.equal(bt.value('skn_Boil_Timer').s, 1800);
bt.stop('skn_Boil_Timer'); now += 60000; assert.equal(bt.value('skn_Boil_Timer').s, 1800, 'stopped: it holds');
bt.start('skn_Boil_Timer'); now += 1800 * 1000 + 5; assert.equal(bt.value('skn_Boil_Timer').s, 0); assert.equal(bt.running('skn_Boil_Timer'), false, 'over: it stops at 0');
assert.ok(!bt.view().find(t => t.name === 'skn_Boil_Timer').running, 'and hides');
bt.set('skn_Mash_Timer', 120); bt.start('skn_Mash_Timer'); assert.equal(bt.value('skn_Mash_Timer').s, 120, 'a time the Process set first wins');
bt.reset('skn_Mash_Timer'); bt.start('skn_Mash_Timer'); assert.equal(bt.value('skn_Mash_Timer').s, 900, 'after reset: the Brew Day value');
bt.resetAll();
assert.ok(seen.length > 0);
assert.deepEqual(bt.view().map(t => t.label), ['Boil Timer', 'Mash Timer', 'Whirlpool / Chilling Timer']);

// the words
assert.ok(KEYWORDS.has('wait_boil') && PROCESS_WORDS.has('wait_boil') && COMMANDS.includes('wait_boil'));
assert.ok(JSON.stringify(suggest('wait_bo')).includes('wait_boil'), 'predictive text offers wait_boil');

// a Process: wait_boil -1 with US Units waits until the Boil Probe is 1 °F (0.56 °C) under skn_Boil_Temp
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'btim-')), cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ brewDefaults: { units: 'US', boilTimerLabel: 'Boil' }, elements: [
  { name: 'HLT_Temp', type: 'temperature', units: 'C' },
  { name: 'BK_Temp', type: 'temperature', units: 'C', boilProbe: true },
  { name: 'Out', type: 'gGlobal', kind: 'string', dataType: 'string' },
  { name: 'Left', type: 'gGlobal', kind: 'time', dataType: 'time' }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
store.skn = { boilC: 99.5 };
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
eng.recipe = () => ({ skn_rcp_Boil_Time: { s: 3600 }, skn_rcp_Mash_Steps: 2, skn_rcp_Mash_Step_1_Time: { s: 1800 }, skn_rcp_Mash_Step_2_Time: { s: 600 }, skn_rcp_Whirlpool_Minutes: 20 });
assert.equal(eng.boilProbe().name, 'BK_Temp');
store.setProp('BK_Temp', 'value', 98.5);
const B = 'wait_boil -1\nOut = "boiling"\nstart skn_Boil_Timer\nwait skn_Boil_Timer <= 01:00:00\nLeft = skn_Boil_Timer\nOut = "timer " + skn_Boil_Timer.running\n';
eng.write('b', B);
assert.deepEqual(eng.check(B).errors, []);
eng.start('b');
await new Promise(r => setTimeout(r, 300));
assert.equal(store.getProp('Out', 'value'), '', '98.5 °C is more than 0.56 °C under 99.5 °C: still waiting');
store.setProp('BK_Temp', 'value', 99.0);
assert.ok(await until(() => String(store.getProp('Out', 'value')).startsWith('timer')), 'within 1 °F: it goes on, and the Boil Timer starts from the boil time');
assert.equal(store.getProp('Out', 'value'), 'timer true');
assert.ok(eng.brewTimers.value('skn_Boil_Timer').s <= 3600 && eng.brewTimers.value('skn_Boil_Timer').s > 3590);
assert.equal(eng.brewTimers.view()[0].label, 'Boil', 'its Label from Default settings');

// a Process sets the Mash Timer, the Mash steps add up when it does not
eng.write('m', 'skn_Mash_Timer = 00:20:00\nstart skn_Mash_Timer\nLeft = skn_Mash_Timer\nstop skn_Mash_Timer\nreset skn_Mash_Timer\nstart skn_Mash_Timer\nOut = "mash"\n');
eng.start('m');
assert.ok(await until(() => store.getProp('Out', 'value') === 'mash'));
assert.ok(eng.brewTimers.value('skn_Mash_Timer').s > 2390, 'after reset: 30 + 10 minutes of mash steps');
assert.ok(store.getProp('Left', 'value').s > 1190 && store.getProp('Left', 'value').s <= 1200);
// .running is read only; no other attribute
assert.match(eng.check('skn_Boil_Timer.running = true\n').errors[0].msg, /read only/);
assert.match(eng.check('Out = skn_Boil_Timer.label\n').errors[0].msg, /Skynet Brew Timer/);
// whirlpool from the Recipe's Whirlpool Minutes
eng.write('w', 'start skn_Whirlpool_Timer\nOut = "wp"\n'); eng.start('w');
assert.ok(await until(() => store.getProp('Out', 'value') === 'wp'));
assert.ok(eng.brewTimers.value('skn_Whirlpool_Timer').s > 1190);

// no Boil Probe: one warning in the editor, an error when it runs
store.config.elements.find(e => e.name === 'BK_Temp').boilProbe = false;
assert.match(eng.check('wait_boil\n').warnings.map(w => w.msg).join(), /Boil Probe/);

// item 31: start_hop_alerts with no timer follows the running Boil Timer
const ha = new HopAlerts({ store, timers: eng.brewTimers, clock: () => Date.now(), send: () => { }, recipe: () => ({ name: 'IPA', ingredients: { hops: [{ name: 'Magnum', amountKg: 0.02, time: 60, use: 'boil' }] }, boilTime: 60 }) });
assert.match(ha.start(), /following the timer skn_Boil_Timer/);
assert.ok(ha.elapsed() >= 0 && ha.elapsed() < 1);
ha.stop();
eng.brewTimers.resetAll();
for (const n of ['b', 'm', 'w']) eng.stop?.(n);
console.log('brewtimers.test: all passed');
process.exit(0);
