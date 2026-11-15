// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Brain in the Background and Standby (Rule 6.32, OakBarn Brewery 2026-11-14).
// "Maybe Change that the Brain is in the Back ground and somewhat separate on a Computer ... the Skynet Panel acts like a remote
// Browser Connection at all times." "If Pi is Powered, Admin Only can restart." "Only Admin User can put Brain in standby or remove
// that status."
//
// Standby: an Admin on any screen puts the Brain in Standby. Every output is turned Off, every Process stops and the boards are let
// go. The Brain starts again in Standby: no board is connected, no Process runs, and every screen shows only "The Brain is in
// Standby". An Admin (from anywhere) clicks Start and the Brain starts again the normal way. Standby is written in data\standby.json,
// so it stays in Standby after a restart or a power cut until an Admin starts it.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

export const STANDBY_FILE = 'standby.json';
export const BRAIN_LOG = 'brain.log';

export function readStandby(dataDir) {
  try { const s = JSON.parse(fs.readFileSync(path.join(dataDir, STANDBY_FILE), 'utf8')); return s && typeof s === 'object' ? { by: String(s.by ?? ''), at: Number(s.at) || 0 } : null; }
  catch { return null; }
}
export function writeStandby(dataDir, by, at = Date.now()) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, STANDBY_FILE), JSON.stringify({ by: String(by ?? ''), at }));
}
export function clearStandby(dataDir) { try { fs.rmSync(path.join(dataDir, STANDBY_FILE), { force: true }); } catch { /* already gone */ } }

// The page is open on the Brain's own computer (not a phone, not another computer, not through a proxy)
export function onBrainComputer(ip, headers = {}) {
  return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(String(ip ?? '')) && !headers['x-forwarded-for'];
}

// A plain name for the kind of screen, from the browser's own description of itself
export function deviceKind(ua = '') {
  const u = String(ua);
  if (/iPhone/i.test(u)) return 'iPhone';
  if (/iPad/i.test(u)) return 'iPad';
  if (/Android/i.test(u)) return /Mobile/i.test(u) ? 'Android phone' : 'Android tablet';
  if (/CrOS/i.test(u)) return 'Chromebook';
  if (/Windows/i.test(u)) return 'Windows computer';
  if (/Macintosh|Mac OS X/i.test(u)) return 'Mac';
  if (/Linux/i.test(u)) return 'Linux computer';
  return 'browser';
}

// The other screens with the panel open now: [{ name, device, here }]. screens: [{ token, name, ua, ip }] (one per open page);
// mine: the asking page's own sign-in, left out. The same person on the same kind of screen is listed once.
export function otherScreens(screens, mine) {
  const seen = new Set(), out = [];
  for (const s of screens) {
    if (!s || (mine && s.token === mine)) continue;
    const device = deviceKind(s.ua), here = onBrainComputer(s.ip, {}), key = `${s.name}|${device}|${here}`;
    if (seen.has(key)) continue;
    seen.add(key); out.push({ name: s.name || 'Someone', device: here ? 'the Brain\'s own computer' : device, here });
  }
  return out;
}

// Starts a program in the Background that keeps running after the program that started it ends (Rule 6.32).
// Windows: Node puts every program it starts in a group (a "job") that Windows ends the moment Node ends, unless it is started
// "detached", and a detached program has no window at all, so Windows can't tell it the computer is shutting down (Rule 6.31). So it
// is started by cmd's "start /b": cmd ends at once, and what cmd starts is outside the group, keeps cmd's own hidden window, and runs
// on. (OakBarn Brewery, 2026-11-14: the panel window opened, then "Failed to fetch": the Brain had ended with the program that started
// it, a second and a half later.) The script is given from cwd (relative), so no folder name ever passes through cmd.
export function spawnInBackground({ execPath = process.execPath, args = [], cwd, env = process.env, out = 'ignore', platform = process.platform, spawnFn = spawn } = {}) {
  const stdio = ['ignore', out, out];
  if (platform !== 'win32') return spawnFn(execPath, args, { cwd, env, stdio, windowsHide: true, detached: true });
  const line = `/d /s /c "start "" /b ${[execPath, ...args].map(a => `"${a}"`).join(' ')}"`;
  return spawnFn(env.ComSpec || env.COMSPEC || 'cmd.exe', [line], { cwd, env, stdio, windowsHide: true, windowsVerbatimArguments: true });
}

// A path given from cwd when it is inside it (see spawnInBackground)
export const fromCwd = (cwd, p) => { const r = path.relative(cwd, p); return r && !r.startsWith('..') && !path.isAbsolute(r) ? r : p; };

// Starts this Brain again (Standby, Start). Run as a service (a Pi, systemd INVOCATION_ID): the service starts it again by itself
// once it stops. Otherwise a new Brain is started in the Background, with no window (Windows: its own hidden window, so Windows
// still tells it when the computer shuts down), writing to data\brain.log, and this one stops. Returns 'service' or 'started'.
export function startAgain({ env = process.env, platform = process.platform, dataDir, spawnFn = spawn, argv = process.argv, execPath = process.execPath, execArgv = process.execArgv, cwd = process.cwd() } = {}) {
  if (env.INVOCATION_ID) return 'service';
  let out = 'ignore';
  try { fs.mkdirSync(dataDir, { recursive: true }); out = fs.openSync(path.join(dataDir, BRAIN_LOG), 'a'); } catch { /* no log: still starts */ }
  const [script, ...rest] = argv.slice(1);
  const child = spawnInBackground({ execPath, args: [...execArgv, fromCwd(cwd, path.resolve(cwd, script)), ...rest], cwd, env: { ...env, SKYNET_RESTARTED: '1' }, out, platform, spawnFn });
  child.on?.('error', () => {});
  child.unref?.();
  if (typeof out === 'number') try { fs.closeSync(out); } catch { /* closed */ }
  return 'started';
}
