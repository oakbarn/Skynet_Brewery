// Sleep, Windows Update restarts and restarts (Rule 6.31, lib/brainpower.js)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { BrainPower, whatIsOn, runningProcesses, stoppedNotice, wakeGapMs, stayAwakeCommand, onItems, RESUME_MS } from '../lib/brainpower.js';
import { compile, resumeAt } from '../lib/engine.js';

// a tiny Brain: some outputs, a Process list, and Everything off
function brain() {
  const els = [
    { name: 'Port_DO_H_Element_HLT~Heater_Main', label: 'HLT Heater', type: 'digitalOut' },
    { name: 'Pump1', type: 'digitalOut', subtype: 'pump' },
    { name: 'MV1', type: 'digitalOut', subtype: 'valve', valveType: 'manual' },
    { name: 'PWM1', type: 'pwmOut' },
    { name: 'HLT_Hys', type: 'hysteresis' },
    { name: 'gX', type: 'gGlobal' },
  ];
  const vals = { MV1: { state: true }, PWM1: { value: 0 }, HLT_Hys: { enabled: false } };
  const store = { config: { devices: [{ name: 'Mega', connection: 'serial', lostLinkSec: 10 }] }, list: () => els, getProp: (n, p) => vals[n]?.[p], setProp: (n, p, v) => { (vals[n] ??= {})[p] = v; } };
  const scripts = [];
  const engine = { list: () => scripts, stopAll: () => { for (const s of scripts) s.state = 'stopped'; } };
  const hw = { allOff: () => { for (const e of els) if (e.type === 'digitalOut' && e.name !== 'MV1') store.setProp(e.name, 'state', false); store.setProp('PWM1', 'value', 0); store.setProp('HLT_Hys', 'enabled', false); } };
  return { els, vals, store, engine, scripts, hw };
}
function fakeSpawn(calls) {
  return (cmd, args) => { const p = new EventEmitter(); p.stdin = { end: () => calls.push('end') }; p.kill = () => { calls.push('kill'); p.emit('exit'); }; calls.push(cmd); return p; };
}
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'brainpower-'));
const file = path.join(dir, 'brewing_now.json');

// what counts as On: outputs, PWM over 0, a control turned on; never a Manual Valve (turned by hand) or a gGlobal
{
  const b = brain();
  assert.deepEqual(whatIsOn(b.els, b.store.getProp), []);
  b.vals['Port_DO_H_Element_HLT~Heater_Main'] = { state: true }; b.vals.PWM1.value = 40; b.vals.HLT_Hys.enabled = true;
  assert.deepEqual(whatIsOn(b.els, b.store.getProp), ['HLT Heater (Port_DO_H_Element_HLT~Heater_Main)', 'PWM1', 'HLT_Hys']);
  assert.deepEqual(runningProcesses([{ name: 'Mash', state: 'running', line: 12, step: 'Mash In' }, { name: 'Old', state: 'stopped' }]), [{ name: 'Mash', line: 12, step: 'Mash In' }]);
}

// the sleep check follows the boards' lost link delay (Rule 6.3), never under 3 s; simulator boards don't count
assert.equal(wakeGapMs([]), 10000);
assert.equal(wakeGapMs([{ connection: 'serial', lostLinkSec: 30 }, { connection: "ethernet", lostLinkSec: 5 }, { connection: "simulator", lostLinkSec: 3 }]), 5000);

// stay awake commands: Windows, Mac, Linux; nothing elsewhere
assert.equal(stayAwakeCommand('win32')[0], 'powershell.exe');
assert.match(stayAwakeCommand('win32')[1].at(-1), /SetThreadExecutionState\(\[uint32\]2147483649\)/);      // ES_CONTINUOUS | ES_SYSTEM_REQUIRED
assert.equal(stayAwakeCommand('darwin')[0], 'caffeinate');
assert.equal(stayAwakeCommand('linux')[0], 'systemd-inhibit');
assert.equal(stayAwakeCommand('freebsd'), null);

// kept awake only while brewing; what was On written down; let go when brewing ends
{
  const b = brain(), calls = []; let t = 1_000_000;
  const p = new BrainPower({ ...b, dataDir: dir, platform: 'win32', spawnFn: fakeSpawn(calls), now: () => t, checkUpdate: async () => false });
  p.start(); clearInterval(p.timer); clearInterval(p.updateTimer);
  assert.deepEqual(p.notices, []);
  p.tick(); assert.equal(p.awake, null); assert.deepEqual(calls, []);
  b.vals.Pump1 = { state: true }; b.scripts.push({ name: 'Mash', state: 'running', line: 7, step: 'Mash In' });
  t += 1000; p.tick();
  assert.deepEqual(calls, ['powershell.exe']);
  const rec = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(rec.brewing, true); assert.deepEqual(rec.on, ['Pump1']); assert.deepEqual(rec.processes, [{ name: 'Mash', line: 7, step: 'Mash In' }]);
  t += 1000; p.tick(); assert.deepEqual(calls, ['powershell.exe']);       // asked once
  b.vals.Pump1.state = false; b.scripts[0].state = 'stopped';
  t += 1000; p.tick();
  assert.deepEqual(calls, ['powershell.exe', 'end', 'kill']);
  assert.equal(JSON.parse(fs.readFileSync(file, 'utf8')).brewing, false);
}

// asleep during a brew: every Process stopped, everything Off, a notice; nothing comes back On
{
  const b = brain(), notes = []; let t = 2_000_000;
  const p = new BrainPower({ ...b, dataDir: dir, platform: 'freebsd', now: () => t, notify: l => notes.push(l), checkUpdate: async () => false });
  p.start(); clearInterval(p.timer); clearInterval(p.updateTimer);
  b.vals['Port_DO_H_Element_HLT~Heater_Main'] = { state: true }; b.scripts.push({ name: 'Boil', state: 'running', line: 3 });
  t += 1000; p.tick();
  t += 4000; p.tick();                                     // a slow moment, under the lost link delay: nothing happens
  assert.equal(b.vals['Port_DO_H_Element_HLT~Heater_Main'].state, true);
  t += 3 * 60 * 1000; p.tick();                            // three minutes asleep
  assert.equal(b.vals['Port_DO_H_Element_HLT~Heater_Main'].state, false);
  assert.equal(b.scripts[0].state, 'stopped');
  assert.equal(p.notices.length, 1); assert.equal(p.notices[0].kind, 'woke');
  assert.match(p.notices[0].text, /asleep/); assert.match(p.notices[0].text, /HLT Heater/); assert.match(p.notices[0].text, /Boil \(line 3\)/);
  assert.equal(notes.length, 1);
  p.dismiss('woke'); assert.deepEqual(p.notices, []);
}

// asleep while not brewing: nothing to do
{
  const b = brain(); let t = 3_000_000;
  const p = new BrainPower({ ...b, dataDir: dir, platform: 'freebsd', now: () => t, checkUpdate: async () => false });
  p.start(); clearInterval(p.timer); clearInterval(p.updateTimer);
  t += 3600_000; p.tick(); assert.deepEqual(p.notices, []);
}

// closed during a brew: Off first, then the notice at the next start; closed with nothing On: no notice
{
  const b = brain(); let t = 4_000_000;
  const p = new BrainPower({ ...b, dataDir: dir, platform: 'freebsd', now: () => t, checkUpdate: async () => false });
  p.start(); clearInterval(p.timer); clearInterval(p.updateTimer);
  b.vals.Pump1 = { state: true }; b.vals.HLT_Hys.enabled = true; b.scripts.push({ name: 'Mash', state: 'running', line: 20, step: 'Rest' });
  t += 1000; p.tick();
  p.closing('system');
  assert.equal(b.vals.Pump1.state, false); assert.equal(b.vals.HLT_Hys.enabled, false); assert.equal(b.scripts[0].state, 'stopped');
  t += 120_000;
  const b2 = brain();
  const p2 = new BrainPower({ ...b2, dataDir: dir, platform: 'freebsd', now: () => t, checkUpdate: async () => false });
  p2.start(); clearInterval(p2.timer); clearInterval(p2.updateTimer);
  assert.equal(p2.notices.length, 1);
  assert.match(p2.notices[0].text, /The computer closed Skynet/); assert.match(p2.notices[0].text, /Everything is Off/);
  assert.match(p2.notices[0].text, /Pump1, HLT_Hys/); assert.match(p2.notices[0].text, /Mash \(step "Rest", line 20\)/);
  // the notice is shown once: the next start has nothing
  p2.closing('closed');
  const p3 = new BrainPower({ ...brain(), dataDir: dir, platform: 'freebsd', now: () => t, checkUpdate: async () => false });
  p3.start(); clearInterval(p3.timer); clearInterval(p3.updateTimer);
  assert.deepEqual(p3.notices, []);
}

// a power cut (no close at all): the last thing written down says brewing
assert.match(stoppedNotice({ brewing: true, at: 5_000_000, on: ['Pump1'], processes: [] }, 5_100_000).text, /power cut/);
assert.equal(stoppedNotice({ brewing: false }), null);
assert.equal(stoppedNotice(null), null);

// Windows has an update waiting to restart: a notice, gone again once it is not waiting
{
  let waiting = true, t = 6_000_000;
  const p = new BrainPower({ ...brain(), dataDir: dir, platform: 'freebsd', now: () => t, checkUpdate: async () => waiting });
  await p._checkUpdate();
  assert.equal(p.notices[0]?.kind, 'update');
  await p._checkUpdate(); assert.equal(p.notices.length, 1);
  waiting = false; await p._checkUpdate(); assert.deepEqual(p.notices, []);
}

// the Resume button (OakBarn Brewery, 2026-11-12: "Resume Button"): within 15 minutes of the stop, one click turns back On what
// was On and starts each Process again at its step with its variables; after that the button is gone
{
  const b = brain(); let t = 7_000_000;
  b.store.has = n => b.els.some(e => e.name === n);
  const started = [];
  b.engine.start = (name, by, resume) => { started.push({ name, by, resume }); return { ok: true }; };
  const p = new BrainPower({ ...b, dataDir: dir, platform: 'freebsd', now: () => t, checkUpdate: async () => false });
  p.start(); clearInterval(p.timer); clearInterval(p.updateTimer);
  b.vals['Port_DO_H_Element_HLT~Heater_Main'] = { state: true }; b.vals.PWM1.value = 55; b.vals.HLT_Hys.enabled = true; b.vals.MV1.state = true;
  b.engine.snapshot = () => [{ name: 'Mash', line: 9, step: { num: '2', name: 'Rest' }, vars: [['x', { type: 'value', val: 152, precision: null }]] }];
  assert.deepEqual(onItems(b.els, b.store.getProp), [{ name: 'Port_DO_H_Element_HLT~Heater_Main', set: { state: true } }, { name: 'PWM1', set: { value: 55 } }, { name: 'HLT_Hys', set: { enabled: true } }]);
  t += 1000; p.tick();
  p.closing('system');
  b.engine.snapshot = () => [];
  assert.equal(b.vals.PWM1.value, 0);
  t += 5 * 60 * 1000;                                      // back 5 minutes later
  const p2 = new BrainPower({ ...b, dataDir: dir, platform: 'freebsd', now: () => t, checkUpdate: async () => false });
  p2.start(); clearInterval(p2.timer); clearInterval(p2.updateTimer);
  assert.ok(p2.notices[0].resume, 'a Resume button');
  assert.match(p2.notices[0].text, /Resume turns back On/);
  assert.match(p2.notices[0].text, /Mash \(step "Rest", line 9\)/);
  const r = p2.resume('stopped', 'Brewer');
  assert.deepEqual(r.failed, []);
  assert.equal(b.vals['Port_DO_H_Element_HLT~Heater_Main'].state, true); assert.equal(b.vals.PWM1.value, 55); assert.equal(b.vals.HLT_Hys.enabled, true);
  assert.deepEqual(started, [{ name: 'Mash', by: 'resume', resume: { step: { num: '2', name: 'Rest' }, line: 9, vars: [['x', { type: 'value', val: 152, precision: null }]] } }]);
  assert.deepEqual(p2.notices, [], 'the notice goes once resumed');
  assert.throws(() => p2.resume('stopped'), /nothing to resume/);
}
{
  // too late: the button goes after 15 minutes, and a click after that does nothing
  const b = brain(); let t = 8_000_000;
  const p = new BrainPower({ ...b, dataDir: dir, platform: 'freebsd', now: () => t, checkUpdate: async () => false });
  p.start(); clearInterval(p.timer); clearInterval(p.updateTimer);
  b.vals.Pump1 = { state: true }; t += 1000; p.tick(); p.closing('closed');
  t += 10 * 60 * 1000;
  const p2 = new BrainPower({ ...b, dataDir: dir, platform: 'freebsd', now: () => t, checkUpdate: async () => false });
  p2.start(); clearInterval(p2.timer); clearInterval(p2.updateTimer);
  assert.ok(p2.notices[0].resume);
  t += 6 * 60 * 1000;
  assert.throws(() => p2.resume('stopped'), /Too late/);
  assert.equal(b.vals.Pump1.state, false);
  assert.equal(p2.notices[0].resume, undefined); assert.doesNotMatch(p2.notices[0].text, /Resume turns/);
  // down longer than 15 minutes: no button at all
  assert.equal(stoppedNotice({ brewing: true, at: 0, stoppedAt: 0, on: ['Pump1'], items: [{ name: 'Pump1', set: { state: true } }] }, RESUME_MS + 1).resume, undefined);
  assert.ok(stoppedNotice({ brewing: true, at: 0, stoppedAt: 0, on: ['Pump1'], items: [{ name: 'Pump1', set: { state: true } }] }, RESUME_MS - 1).resume);
}

// where a resumed Process starts: its step by number and name, else the line it was on; a step that is gone: not resumed
{
  const prog = compile('step 1.00001 "Heat"\nsleep 1000\nstep 1.00002 "Rest"\nsleep 2000\nsleep 3000');
  const at = resumeAt(prog.stmts, { step: { num: '1.00002', name: 'Rest' } });
  assert.equal(prog.stmts[at].op, 'step'); assert.equal(prog.stmts[at].name, 'Rest');
  assert.equal(prog.stmts[resumeAt(prog.stmts, { line: 5 })].line, 5);
  assert.equal(resumeAt(prog.stmts, { step: { num: '1.00003', name: 'Boil' } }), -1);
  assert.equal(resumeAt(prog.stmts, {}), -1);
}

// a real Process: snapshot, stopped, then resumed at its step with its variable
{
  const { Store } = await import('../lib/store.js');
  const { Engine } = await import('../lib/engine.js');
  const cfg = path.join(dir, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'Seen', type: 'gGlobal', kind: 'value' }] }));
  const store = new Store(cfg, path.join(dir, 'data')); store.load();
  const eng = new Engine(store, path.join(dir, 'scripts'), { logNow() { } });
  const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
  eng.write('Brew', 'new value x\nx = 1\nSeen = 1\nstep 1.00001 "Heat"\nx = x + 10\nsleep 60000\nstep 1.00002 "Rest"\nSeen = x + 100\nsleep 60000');
  eng.start('Brew');
  assert.ok(await until(() => eng.snapshot()[0]?.step?.name === 'Heat'));
  const snap = eng.snapshot()[0];
  assert.deepEqual(snap.vars, [['x', { type: 'value', val: 11, precision: null }]]);
  eng.stopAll(); assert.ok(await until(() => !eng.running.size));
  // a later step is where it resumes; the lines before it do not run again (Seen would be 1)
  store.setProp('Seen', 'value', 0);
  assert.equal(eng.start('Brew', 'resume', { step: { num: '1.00002', name: 'Rest' }, line: 9, vars: snap.vars }).ok, true);
  assert.ok(await until(() => store.getProp('Seen', 'value') === 111));
  eng.stopAll(); assert.ok(await until(() => !eng.running.size));
  assert.equal(eng.start('Brew', 'resume', { step: { num: '9.00009', name: 'Gone' } }).ok, false);
}

fs.rmSync(dir, { recursive: true, force: true });
console.log('brainpower tests passed');
