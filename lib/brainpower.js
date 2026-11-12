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
//    Skynet stopped, what was On and where each Process was. Everything starts Off (OakBarn Brewery picks what comes back).
// 4. Windows has an update waiting to restart the computer: a notice on every screen, so the brewer restarts before brewing.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { writeSafely, isManualValve } from './store.js';
import { lostLinkSec, connOf } from '../public/links.js';

// The clock jumped this much between two 1 s ticks: the Brain was asleep (or frozen) at least as long as a board's lost link
// delay (Rule 6.3), so that board has turned its outputs Off by itself. Never less than 3 s (the shortest lost link delay).
export function wakeGapMs(devices = []) {
  const secs = devices.filter(d => d && d.enabled !== false && connOf(d) !== 'simulator').map(d => lostLinkSec(d));
  return Math.max(3, secs.length ? Math.min(...secs) : 10) * 1000;
}
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
export const runningProcesses = scripts => scripts.filter(s => s.state === 'running' || s.state === 'waiting')
  .map(s => ({ name: s.name, line: s.line ?? null, step: s.step ?? null }));

const when = ms => new Date(ms).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' });
const procText = p => p.name + (p.step ? ` (step "${p.step}", line ${p.line})` : p.line ? ` (line ${p.line})` : '');

// The notice shown after Skynet stopped during a brew. rec = what was written down, now = the time it started again.
export function stoppedNotice(rec, now = Date.now()) {
  if (!rec || !rec.brewing) return null;
  const why = rec.reason === 'closed' ? 'Skynet was closed'
    : rec.reason === 'system' ? 'The computer closed Skynet (a shutdown, a restart such as a Windows Update, a sign out, or its window was closed)'
      : 'Skynet stopped without closing (a power cut, a crash, or the computer was turned off)';
  const lines = [`${why} during a brew, ${when(rec.stoppedAt ?? rec.at)}. Back at ${when(now)}. Everything is Off. Check your vessels before you turn anything back On.`];
  if (rec.on?.length) lines.push('Was On: ' + rec.on.join(', ') + '.');
  if (rec.processes?.length) lines.push('Processes that were running: ' + rec.processes.map(procText).join(', ') + '.');
  return { id: 'stopped', kind: 'stopped', text: lines.join('\n'), at: now };
}
export function wokeNotice(slept, woke, rec) {
  const lines = [`The computer was asleep from ${when(slept)} to ${when(woke)} during a brew. The boards turned everything Off by themselves, so Skynet turned it Off too and stopped every Process. Check your vessels before you turn anything back On.`];
  if (rec?.on?.length) lines.push('Was On: ' + rec.on.join(', ') + '.');
  if (rec?.processes?.length) lines.push('Processes that were running: ' + rec.processes.map(procText).join(', ') + '.');
  return { id: 'woke', kind: 'woke', text: lines.join('\n'), at: woke };
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
    const on = whatIsOn(list, get), processes = runningProcesses(this.engine.list());
    return { brewing: on.length > 0 || processes.length > 0, on, processes };
  }

  tick() {
    const t = this.now(), gap = t - (this.tickAt ?? t);
    this.tickAt = t;
    if (gap >= wakeGapMs(this.store.config?.devices) && this.rec?.brewing) return this.woke(t - gap, t);
    const s = this.status();
    this.stayAwake(s.brewing);
    if (s.brewing || this.rec?.brewing) this.record(s, t);
  }

  // Asleep (or frozen) during a brew: the boards are already Off (lost link). Off on the screen too, every Process stopped,
  // so when a board talks again nothing it is sent turns anything back On.
  woke(slept, t) {
    const rec = this.rec;
    this.engine.stopAll();
    this.hw.allOff?.('wake');
    const n = wokeNotice(slept, t, rec);
    this._setNotice(n); this.log(n.text);
    this.record(this.status(), t, true);
  }

  // what is On and which Process is where, written at most every RECORD_MS (and at once when brewing starts or ends)
  record(s, t, force = false) {
    const rec = { brewing: s.brewing, at: t, on: s.on, processes: s.processes };
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
    if (s.brewing) this._write({ brewing: true, at: t, stoppedAt: t, reason, on: s.on, processes: s.processes });
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
