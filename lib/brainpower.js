// Brain power: sleep, Windows Update restarts and restarts (OakBarn Brewery, 2026-11-12, Rule 6.31, Help 190).
// Most new brewers start with a Windows PC as the Brain (Rule 1.7), and a PC sleeps, restarts for updates, and gets restarted.
//
// 1. Keep the Brain awake while brewing: while a Process runs or any output is On, the Brain is asked not to sleep
//    (Windows: SetThreadExecutionState, held by a small PowerShell helper; Mac: caffeinate; Linux: systemd-inhibit).
//    The screen may still go dark. Nothing is asked when nothing is brewing.
// 2. Woke up from sleep anyway (a laptop lid, a power button): the boards turned their outputs Off by themselves (lost link,
//    Rule 6.3), so everything is set Off on the screen too and every Process is stopped. Nothing comes back On by itself.
// 3. A stop during a brew (the window closed, Windows shut down or restarted, power lost): what was On and which Process was on
//    which line is written down every few seconds while brewing, so after the restart a notice on every screen says when
//    Skynet stopped, what was On and where each Process was. Everything starts Off.
// 5. The Resume button (OakBarn Brewery, 2026-11-12: "Resume Button"): on that notice, within RESUME_MS of the stop, one click
//    turns back On what was On (outputs, PWM, controls, running timers) and starts each Process again at its step (or the line it
//    was on when it has no step) with its saved variables. After RESUME_MS the button is gone: start things by hand.
// 4. Windows has an update waiting to restart the computer: a notice on every screen, so the brewer restarts before brewing.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { writeSafely, isManualValve } from './store.js';
import { plain } from './values.js';
import { lostLinkSec, connOf } from '../public/links.js';

// The clock jumped this much between two 1 s ticks: the Brain was asleep (or frozen) at least as long as a board's lost link
// delay (Rule 6.3), so that board has turned its outputs Off by itself. Never less than 3 s (the shortest lost link delay).
export function wakeGapMs(devices = []) {
  const secs = devices.filter(d => d && d.enabled !== false && connOf(d) !== 'simulator').map(d => lostLinkSec(d));
  return Math.max(3, secs.length ? Math.min(...secs) : 10) * 1000;
}
export const RESUME_MS = 15 * 60 * 1000;       // the Resume button works only this long after Skynet stopped
export const RECORD_MS = 3000;                // while brewing, what is On is written down at most this often
export const UPDATE_CHECK_MS = 30 * 60 * 1000;   // Windows: is an update waiting to restart the computer? (every 30 minutes)
const FILE = 'brewing_now.json';

// Everything that is really On (the same things Everything off turns off, Rule 6.x allOff), as plain labels
export function whatIsOn(list, get) {
  const on = [];
  for (const el of list) {
    let yes = false;
    switch (el.type) {
      case 'digitalOut': yes = !isManualValve(el) && !!get(el.name, 'state'); break;
      case 'pwmOut': case 'analogOut': yes = Number(get(el.name, 'value')) > 0; break;
      case 'dutyCycle': case 'hysteresis': case 'pid': case 'deadband': yes = get(el.name, 'enabled') === true; break;
      case 'stepper': yes = !!get(el.name, 'moving'); break;
    }
    if (yes) on.push(el.label && el.label !== el.name ? `${el.label} (${el.name})` : el.name);
  }
  return on;
}
// What the Resume button turns back On: [{ name, set: { prop: value } }]. A Stepper never starts moving again by itself.
export function onItems(list, get) {
  const out = [];
  for (const el of list) {
    let set = null;
    switch (el.type) {
      case 'digitalOut': if (!isManualValve(el) && get(el.name, 'state')) set = { state: true }; break;
      case 'pwmOut': case 'analogOut': { const v = Number(get(el.name, 'value')); if (v > 0) set = { value: v }; break; }
      case 'dutyCycle': case 'hysteresis': case 'pid': case 'deadband': if (get(el.name, 'enabled') === true) set = { enabled: true }; break;
      case 'timer': if (get(el.name, 'running')) set = { value: plain(get(el.name, 'value')), running: true }; break;
    }
    if (set) out.push({ name: el.name, set });
  }
  return out;
}
export const runningProcesses = scripts => scripts.filter(s => s.state === 'running' || s.state === 'waiting')
  .map(s => ({ name: s.name, line: s.line ?? null, step: s.step ?? null }));

const when = ms => new Date(ms).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' });
const stepName = st => (st && typeof st === 'object' ? st.name : st) || '';
const procText = p => p.name + (stepName(p.step) ? ` (step "${stepName(p.step)}", line ${p.line})` : p.line ? ` (line ${p.line})` : '');
const clock = ms => new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
// the Resume button's part of a notice: there is something to resume and the stop was less than RESUME_MS ago
function withResume(n, rec, stopped, now) {
  if (!(rec?.items?.length || rec?.processes?.length) || now - stopped >= RESUME_MS) return n;
  const until = stopped + RESUME_MS;
  n.resume = { until, items: rec.items ?? [], processes: rec.processes ?? [] };
  n.text += `\nResume turns back On what was On and starts each Process again at its step. It works until ${clock(until)} (15 minutes after the stop).`;
  return n;
}

// The notice shown after Skynet stopped during a brew. rec = what was written down, now = the time it started again.
export function stoppedNotice(rec, now = Date.now()) {
  if (!rec || !rec.brewing) return null;
  const why = rec.reason === 'closed' ? 'Skynet was closed'
    : rec.reason === 'system' ? 'The computer closed Skynet (a shutdown, a restart such as a Windows Update, a sign out, or its window was closed)'
      : 'Skynet stopped without closing (a power cut, a crash, or the computer was turned off)';
  const lines = [`${why} during a brew, ${when(rec.stoppedAt ?? rec.at)}. Back at ${when(now)}. Everything is Off. Check your vessels before you turn anything back On.`];
  if (rec.on?.length) lines.push('Was On: ' + rec.on.join(', ') + '.');
  if (rec.processes?.length) lines.push('Processes that were running: ' + rec.processes.map(procText).join(', ') + '.');
  return withResume({ id: 'stopped', kind: 'stopped', text: lines.join('\n'), at: now }, rec, rec.stoppedAt ?? rec.at, now);
}
export function wokeNotice(slept, woke, rec) {
  const lines = [`The computer was asleep from ${when(slept)} to ${when(woke)} during a brew. The boards turned everything Off by themselves, so Skynet turned it Off too and stopped every Process. Check your vessels before you turn anything back On.`];
  if (rec?.on?.length) lines.push('Was On: ' + rec.on.join(', ') + '.');
  if (rec?.processes?.length) lines.push('Processes that were running: ' + rec.processes.map(procText).join(', ') + '.');
  return withResume({ id: 'woke', kind: 'woke', text: lines.join('\n'), at: woke }, rec, slept, woke);
}
export const UPDATE_NOTICE = { id: 'update', kind: 'update', text: 'Windows has an update waiting to restart this computer. Restart it before you brew, so Windows does not restart it during a brew. (Help: Sleep, Windows Update and restarts)' };

// The command that keeps this computer awake while it runs, or null (a Pi running as a service does not sleep)
export function stayAwakeCommand(platform = process.platform) {
  if (platform === 'win32') {
    // ES_CONTINUOUS | ES_SYSTEM_REQUIRED: no sleep while this helper lives (the screen may still go dark). It reads its input
    // and ends when Skynet ends or lets it go, so Windows can sleep again.
    const ps = "Add-Type -Name P -Namespace S -MemberDefinition '[DllImport(\"kernel32.dll\")] public static extern uint SetThreadExecutionState(uint f);'; " +
      '[void][S.P]::SetThreadExecutionState([uint32]2147483649); [void][Console]::In.ReadToEnd()';
    return ['powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', ps]];
  }
  if (platform === 'darwin') return ['caffeinate', ['-i', '-w', String(process.pid)]];
  if (platform === 'linux') return ['systemd-inhibit', ['--what=sleep:idle', '--who=Skynet Brewer', '--why=Brewing', '--mode=block', 'cat']];
  return null;
}

export class BrainPower {
  // store, engine, hw: the panel's own. notify(list): the notices changed (sent to every screen).
  constructor({ store, engine, hw, dataDir, notify = () => {}, log = () => {}, platform = process.platform, spawnFn = spawn, now = () => Date.now(), checkUpdate }) {
    Object.assign(this, { store, engine, hw, notify, log, platform, spawnFn, now });
    this.file = path.join(dataDir, FILE);
    this.notices = [];
    this.awake = null;          // the stay awake helper while brewing
    this.last = null;           // what was written down last (text), so the same thing is not written again
    this.checkUpdate = checkUpdate ?? (this.platform === 'win32' ? windowsRestartPending : null);
  }

  // At start: a brew that was running when Skynet stopped gets its notice
  start() {
    let rec = null;
    try { rec = JSON.parse(fs.readFileSync(this.file, 'utf8')); } catch { /* nothing written: not brewing */ }
    const n = stoppedNotice(rec, this.now());
    if (n) { this.notices.push(n); this.log(n.text); }
    this._write({ brewing: false, at: this.now() });
    this.tickAt = this.now();
    this.timer = setInterval(() => this.tick(), 1000);
    if (this.checkUpdate) { this._checkUpdate(); this.updateTimer = setInterval(() => this._checkUpdate(), UPDATE_CHECK_MS); }
  }

  status() {
    const list = this.store.list(), get = (n, p) => this.store.getProp(n, p);
    const on = whatIsOn(list, get), processes = this.engine.snapshot?.() ?? runningProcesses(this.engine.list());
    return { brewing: on.length > 0 || processes.length > 0, on, processes, items: onItems(list, get) };
  }

  tick() {
    const t = this.now(), gap = t - (this.tickAt ?? t);
    this.tickAt = t;
    if (gap >= wakeGapMs(this.store.config?.devices) && this.rec?.brewing) return this.woke(t - gap, t);
    // the Resume button's 15 minutes are over: the notice stays, the button goes
    for (const n of this.notices) if (n.resume && t >= n.resume.until) { delete n.resume; n.text = n.text.split('\n').filter(l => !l.startsWith('Resume turns')).join('\n'); this.notify(this.notices); }
    const s = this.status();
    this.stayAwake(s.brewing);
    if (s.brewing || this.rec?.brewing) this.record(s, t);
  }

  // Asleep (or frozen) during a brew: the boards are already Off (lost link). Off on the screen too, every Process stopped,
  // so when a board talks again nothing it is sent turns anything back On.
  woke(slept, t) {
    const s = this.status(), rec = { ...s, at: t };      // the screen still shows what was On before the sleep
    this.engine.stopAll();
    this.hw.allOff?.('wake');
    const n = wokeNotice(slept, t, rec);
    this._setNotice(n); this.log(n.text);
    this.record(this.status(), t, true);
  }

  // what is On and which Process is where, written at most every RECORD_MS (and at once when brewing starts or ends)
  record(s, t, force = false) {
    const rec = { brewing: s.brewing, at: t, on: s.on, items: s.items, processes: s.processes };
    const text = JSON.stringify({ ...rec, at: 0 });
    // the same as last time, or changed again within RECORD_MS: wait (a change of brewing / not brewing is written at once)
    if (!force && this.rec && this.rec.brewing === s.brewing && (text === this.last || t - this.rec.at < RECORD_MS)) return;
    this.last = text; this.rec = rec;
    this._write(rec);
  }

  // Skynet is closing (reason 'closed' from ☰ Menu or Ctrl+C, 'system' when the computer closes it or its window). Everything goes Off first.
  closing(reason = 'closed') {
    clearInterval(this.timer); clearInterval(this.updateTimer);
    const s = this.status(), t = this.now();
    if (s.brewing) this._write({ brewing: true, at: t, stoppedAt: t, reason, on: s.on, items: s.items, processes: s.processes });
    else this._write({ brewing: false, at: t });
    this.engine.stopAll();
    this.hw.allOff?.('shutdown');
    this.stayAwake(false);
  }

  stayAwake(on) {
    if (!on) { if (this.awake) { try { this.awake.stdin?.end(); this.awake.kill(); } catch { /* gone */ } this.awake = null; this.log('Brewing stopped: this computer may sleep again.'); } return; }
    if (this.awake) return;
    const cmd = stayAwakeCommand(this.platform);
    if (!cmd) return;
    try {
      const p = this.spawnFn(cmd[0], cmd[1], { stdio: ['pipe', 'ignore', 'ignore'], windowsHide: true });
      p.on?.('error', () => { if (this.awake === p) this.awake = null; });
      p.on?.('exit', () => { if (this.awake === p) this.awake = null; });
      this.awake = p;
      this.log('Brewing: this computer is kept awake (the screen may still go dark).');
    } catch { /* this computer can't be kept awake from here: Help says how to set it by hand */ }
  }

  // The Resume button (Rule 6.31): turns back On what was On and starts each Process again at its step. Returns what it did.
  resume(id, who = '') {
    const by = 'resume';
    const n = this.notices.find(x => x.id === id);
    if (!n?.resume) throw new Error('There is nothing to resume.');
    if (this.now() >= n.resume.until) { this.tick(); throw new Error('Too late to resume: it works only for 15 minutes after the stop. Turn things on by hand.'); }
    const done = [], failed = [];
    for (const it of n.resume.items) {
      if (!this.store.has?.(it.name) && !this.store.list().some(e => e.name === it.name)) { failed.push(`${it.name} (not in this Schema)`); continue; }
      try { for (const [p, v] of Object.entries(it.set)) this.store.setProp(it.name, p, v, by); done.push(it.name); } catch (e) { failed.push(`${it.name} (${e.message})`); }
    }
    for (const p of n.resume.processes) {
      try { const r = this.engine.start(p.name, by, { step: p.step && typeof p.step === 'object' ? p.step : null, line: p.line, vars: p.vars }); if (r?.ok) done.push(p.name); else failed.push(`${p.name} (${r?.msg ?? 'not started'})`); } catch (e) { failed.push(`${p.name} (${e.message})`); }
    }
    this.dismiss(id);
    const text = `Resumed${who ? ' by ' + who : ''}: ${done.join(', ') || 'nothing'}` + (failed.length ? `. Not resumed: ${failed.join(', ')}` : '');
    this.log(text);
    return { done, failed };
  }

  dismiss(id) { const n = this.notices.length; this.notices = this.notices.filter(x => x.id !== id); if (this.notices.length !== n) this.notify(this.notices); }
  _setNotice(n) { this.notices = [...this.notices.filter(x => x.id !== n.id), n]; this.notify(this.notices); }

  async _checkUpdate() {
    let waiting = false;
    try { waiting = await this.checkUpdate(); } catch { /* can't tell */ }
    const has = this.notices.some(x => x.id === 'update');
    if (waiting && !has) this._setNotice({ ...UPDATE_NOTICE, at: this.now() });
    if (!waiting && has) this.dismiss('update');
  }

  _write(rec) { try { writeSafely(this.file, JSON.stringify(rec)); } catch (e) { this.log('Could not write ' + FILE + ': ' + e.message); } }
}

// Windows writes this key when an installed update needs a restart. Reading it needs no admin rights.
export function windowsRestartPending() {
  const keys = ['HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\WindowsUpdate\\Auto Update\\RebootRequired',
    'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Component Based Servicing\\RebootPending'];
  return Promise.all(keys.map(k => new Promise(res => execFile('reg.exe', ['query', k], { windowsHide: true }, err => res(!err)))))
    .then(r => r.some(Boolean));
}
