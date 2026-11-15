// Flame Out safety for gas burners (OakBarn Brewery, 2026-11-14, Rule 6.33, Help 197): while the gas is really open, the temperature
// (smoothed, wild readings thrown away) must not fall 1 °F and must rise 1 °F in 5 minutes of burning (not near the boil); a pause;
// a trip shuts the gas and the igniter, sets .flameout_tripped and tells every screen; nothing turns back on by itself.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { FlameWatcher, flameSettings, flameWord, isGasBurner, GAS_WARNING, TRIP_TEXT } from '../public/flameout.js';
import { Store } from '../lib/store.js';
import { FlameWatch, gasOpen } from '../lib/flamewatch.js';

// ---- the words and the numbers
assert.match(GAS_WARNING, /^⚠ Gas can explode or kill\. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts\. Consult a Licensed Electrician, Plumber or HVAC professional\.$/);
assert.equal(TRIP_TEXT, 'Burner may be out: check the flame. Gas is turned off.');
assert.deepEqual(flameWord('On'), { on: true }); assert.deepEqual(flameWord(false), { on: false });
assert.deepEqual(flameWord('pause 10'), { pause: 10 }); assert.deepEqual(flameWord('Pause', 7), { pause: 7 }); assert.equal(flameWord('maybe'), null);
assert.ok(isGasBurner({ type: 'digitalOut', subtype: 'element', gasBurner: true }));
assert.ok(!isGasBurner({ type: 'digitalOut', subtype: 'element' }), 'an electric element is not');
assert.ok(isGasBurner({ type: 'digitalOut', typeCode: 'Valve_Sgas' }), 'a Solenoid Gas Valve is');
{
  const f = flameSettings({}), c = flameSettings({}, '°C');
  assert.deepEqual([f.flameMinutes, f.flameRise, f.flameDrop, f.flamePause, f.flameSmooth, f.flameBoil, f.on, f.safety], [5, 1, 1, 10, 30, 212, true, 'none'], 'the starting numbers (OakBarn Brewery, 2026-11-14)');
  assert.deepEqual([c.flameRise, c.flameDrop, c.flameBoil], [0.5, 0.5, 100]);
  assert.equal(flameSettings({ flameOut: 'off' }).on, false);
  assert.equal(flameSettings({ flameSafety: 'thermocouple' }).safety, 'thermocouple');
  assert.equal(flameSettings({ flameSafety: 'cutoff' }).safety, 'cutoff');
}

// ---- the watch itself (one reading a second)
const S = flameSettings({});
function run(w, from, secs, temp, open = true, on = true) { let hit = null; for (let i = 0; i < secs && !hit; i++) { const t = (from + i) * 1000; hit = w.step(t, typeof temp === 'function' ? temp(from + i) : temp, open, on, S); } return hit; }
{ // heating well: 1 °F a minute, no trip in an hour
  const w = new FlameWatcher();
  assert.equal(run(w, 0, 3600, t => 60 + t / 60), null);
}
{ // the flame goes out at 20 minutes: the pot cools 0.5 °F a minute -> the Drop trips within a few minutes
  const w = new FlameWatcher();
  const temp = t => t < 1200 ? 60 + t / 60 : 80 - (t - 1200) / 120;
  const hit = run(w, 0, 3600, temp);
  assert.equal(hit?.trip, 'drop');
}
{ // a flame that never lit: the pot stays at 60 °F -> No rise after 5 minutes of burning
  const w = new FlameWatcher();
  assert.equal(run(w, 0, 299, 60), null, 'not before 5 minutes');
  assert.equal(run(w, 299, 10, 60)?.trip, 'norise');
}
{ // burning time counts only while the valve is open: 4 minutes open, 10 closed, 4 open (still no rise) -> trips in the second burn
  const w = new FlameWatcher();
  assert.equal(run(w, 0, 240, 60, true), null);
  assert.equal(run(w, 240, 600, 60, false), null, 'closed: not counted');
  assert.equal(run(w, 840, 240, 60, true)?.trip, 'norise');
}
{ // a rolling boil holds at 211 °F: No rise rests near the Boil point
  const w = new FlameWatcher();
  assert.equal(run(w, 0, 1800, 211), null);
}
{ // a noisy probe (±0.3 °F) on a pot rising slowly does not trip, and one wild reading (a jump of 40 °F) is thrown away
  const w = new FlameWatcher();
  assert.equal(run(w, 0, 1200, t => 100 + t / 120 + (t % 2 ? 0.3 : -0.3) + (t === 600 ? -40 : 0)), null);
}
{ // Hysteresis: the valve opens at Setpoint - 1 while the pot is still cooling a little; that lag is not a Drop
  const w = new FlameWatcher();
  assert.equal(run(w, 0, 60, t => 150 - t * 0.005, false), null);
  assert.equal(run(w, 60, 600, t => t < 120 ? 149.7 - (t - 60) * 0.008 : 149.22 + (t - 120) / 60), null);
}
{ // turned Off: everything starts again
  const w = new FlameWatcher();
  run(w, 0, 200, 60); run(w, 200, 5, 60, false, false);
  assert.equal(run(w, 205, 200, 60), null, 'a fresh 5 minutes after it is turned On again');
}

// ---- the Brain: a burner, its probe and its igniter
function make(extra = {}) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'flame'));
  const cfg = path.join(d, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
    { name: 'BK_Temp', type: 'temperature', sensor: 'simulated', units: '°F' },
    { name: 'BK_Burner', label: 'Kettle burner', type: 'digitalOut', subtype: 'element', gasBurner: true, heatMethod: 'onoff', device: 'MB', channel: 5, input: 'BK_Temp', flameIgniter: 'BK_Spark', ...extra },
    { name: 'BK_Spark', type: 'digitalOut', typeCode: 'Ignit', device: 'MB', channel: 6 },
    { name: 'HLT_Gas', type: 'digitalOut', typeCode: 'Valve_Sgas', device: 'MB', channel: 7, input: 'BK_Temp', flameOut: 'off' },
  ] }));
  const store = new Store(cfg, path.join(d, 'data')); store.load();
  const notices = [], logs = [];
  return { store, fw: new FlameWatch({ store, notify: l => notices.push(l), log: t => logs.push(t) }), notices, logs };
}
{
  const { store, fw, notices } = make();
  assert.equal(store.getProp('BK_Burner', 'flameout'), 'On', 'On to start');
  assert.equal(store.getProp('HLT_Gas', 'flameout'), 'Off', 'switched Off in its Properties');
  assert.equal(gasOpen(store.get('BK_Burner'), p => store.getProp('BK_Burner', p)), false);
  store.setProp('BK_Temp', 'value', 60);
  store.setProp('BK_Burner', 'state', true); store.setProp('BK_Spark', 'state', true);
  for (let s = 0; s < 310; s++) fw.tick(s * 1000);
  assert.equal(store.getProp('BK_Burner', 'state'), false, 'the gas is shut');
  assert.equal(store.getProp('BK_Spark', 'state'), false, 'and the igniter');
  assert.equal(store.getProp('BK_Burner', 'flameout_tripped'), true);
  assert.equal(notices.at(-1)[0].text, 'Kettle burner: Burner may be out: check the flame. Gas is turned off.');
  assert.throws(() => store.setProp('BK_Burner', 'flameout_tripped', false), /read only/);
  for (let s = 310; s < 400; s++) fw.tick(s * 1000);
  assert.equal(store.getProp('BK_Burner', 'state'), false, 'nothing turns back on by itself');
  store.setProp('BK_Burner', 'state', true);
  assert.equal(store.getProp('BK_Burner', 'flameout_tripped'), false, 'turned back On by the brewer: cleared');
  fw.close(notices.at(-1)[0].id); assert.equal(fw.list().length, 0);
}
{ // the pause: = pause 10 rests the watch 10 minutes, then it watches again by itself
  const { store, fw } = make();
  store.setProp('BK_Temp', 'value', 60); store.setProp('BK_Burner', 'state', true);
  fw.tick(0);
  store.setProp('BK_Burner', 'flameout', 'pause 10');
  assert.equal(store.getProp('BK_Burner', 'flameout'), 'On', 'still On, only paused');
  for (let s = 1; s < 600; s++) fw.tick(s * 1000);
  assert.equal(store.getProp('BK_Burner', 'state'), true, 'paused: no trip in 10 minutes');
  assert.ok(store.getProp('BK_Burner', 'flameout_paused') >= 1);
  for (let s = 600; s < 1000; s++) fw.tick(s * 1000);
  assert.equal(store.getProp('BK_Burner', 'flameout_paused'), 0);
  assert.equal(store.getProp('BK_Burner', 'state'), false, 'watching again after the pause, and the pot never warmed');
  assert.throws(() => store.setProp('BK_Burner', 'flameout', 'sometimes'), /On, Off or pause/);
  store.setProp('BK_Burner', 'flameout', 'Off'); assert.equal(store.getProp('BK_Burner', 'flameout'), 'Off');
}
console.log('flameout tests passed');

// ---- a Process writes the words: = On / Off, = "pause 10", and reads .flameout_tripped
{
  const { Engine } = await import('../lib/engine.js');
  const { store } = make();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'flameproc'));
  const eng = new Engine(store, dir, { logNow() { } });
  const out = []; eng.on('print', p => out.push(String(p.text)));
  fs.writeFileSync(path.join(dir, 'g.txt'), 'BK_Burner.flameout = Off\nprint BK_Burner.flameout\nBK_Burner.flameout = On\nBK_Burner.flameout = "pause 10"\nprint BK_Burner.flameout_paused\nif BK_Burner.flameout_tripped == false\nprint "lit"\nendif\n');
  assert.deepEqual(eng.check(fs.readFileSync(path.join(dir, 'g.txt'), 'utf8')).filter?.(e => e) ?? [], []);
  eng.start('g');
  await new Promise(r => setTimeout(r, 800));
  assert.deepEqual(out.filter(t => !/^Process/.test(t)), ['Off', '10', 'lit'], out.join(' | '));
  eng.stopAll?.();
}

// ---- the two Process snippets in Help 197 compile with real names
{
  const { Engine } = await import('../lib/engine.js');
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'flamesnip'));
  const cfg = path.join(d, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
    { name: 'Kettle_temp', type: 'temperature', sensor: 'simulated', units: '°F' },
    { name: 'Kettle_burner', type: 'digitalOut', subtype: 'element', gasBurner: true, heatMethod: 'onoff', device: 'MB', channel: 5, input: 'Kettle_temp' },
    { name: 'alm_Flame_Out', type: 'alarm' },
    { name: 'Kettle_bypass', type: 'digitalOut', device: 'MB', channel: 6 },
    { name: 'Kettle_spark', type: 'digitalOut', typeCode: 'Ignit', device: 'MB', channel: 7 },
    { name: 'Kettle_flame', type: 'digitalIn', device: 'MB', channel: 8 },
  ] }));
  const store = new Store(cfg, path.join(d, 'data')); store.load();
  const eng = new Engine(store, path.join(d, 'p'), { logNow() { } });
  const page = fs.readFileSync(new URL('../help/197-flame-out-safety.md', import.meta.url), 'utf8');
  const snips = [...page.matchAll(/```\n(\/\/Gas_[\s\S]*?)```/g)].map(m => m[1]);
  assert.equal(snips.length, 3, 'three snippets');
  fs.mkdirSync(path.join(d, 'p'), { recursive: true });
  for (const t of snips) fs.writeFileSync(path.join(d, 'p', t.split('\n')[0].slice(2) + '.txt'), t);
  for (const t of snips) {
    assert.ok(t.includes(GAS_WARNING.slice(2)), 'each snippet carries the gas warning');
    const errs = eng.check(t);
    assert.deepEqual(Array.isArray(errs) ? errs : errs?.errors ?? [], [], t.split('\n')[0]);
  }
}
console.log('flameout Process words passed');
process.exit(0);
