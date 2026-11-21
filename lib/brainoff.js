// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Shut down the Brain's computer (Rule 6.40, OakBarn Brewery, 2026-11-20, Panel Update 7: "We need a method to shut down a Brain when
// you exit but reserved only for admin users"; "a Skynet Setting to avoid option until set to Shut Down Brain Option is True").
// ☰ Menu > Shut down the Brain's computer: only an Admin, only when ☰ Menu > Default settings > Shut Down Brain Option is On.
// Every output goes Off and every Process stops first (the normal stop, Rule 6.31), then the computer itself is turned off:
//   Windows       shutdown.exe /s /t 10 (no admin rights needed; 10 s so the Brain stops first)
//   Raspberry Pi  sudo -n systemctl poweroff (the Pi and Linux installers allow only this one command without a password)
//   Linux         the same
//   Mac           System Events "shut down" (macOS may ask once to let Skynet control System Events)
// A browser can't tell the Brain that a tab or window was closed (it may be a phone that lost WiFi), so the shut down is never
// asked on closing the browser: it is a ☰ Menu choice.
import fs from 'node:fs';
import { execFile, spawn } from 'node:child_process';

export const WINDOWS_DELAY_S = 10;
export const SUDOERS_FILE = '/etc/sudoers.d/skynet-brewer-poweroff';

// where systemctl is (the sudoers line names the exact path)
export function systemctlPath(exists = p => fs.existsSync(p)) {
  return ['/usr/bin/systemctl', '/bin/systemctl'].find(p => exists(p)) ?? 'systemctl';
}

// What turns this computer off. check: run first, before anything stops; it must succeed (exit 0), or the Admin is told why and
// nothing stops. now: run before the Brain stops (Windows waits WINDOWS_DELAY_S itself). last: run as the Brain stops.
export function powerOffPlan(platform = process.platform, exists) {
  if (platform === 'win32') return { now: ['shutdown.exe', ['/s', '/t', String(WINDOWS_DELAY_S), '/c', 'Skynet: an Admin shut down the Brain. Every output is Off.']] };
  if (platform === 'linux') {
    const sc = systemctlPath(exists);
    return { check: ['sudo', ['-n', '-l', sc, 'poweroff']], last: ['sudo', ['-n', sc, 'poweroff']] };
  }
  if (platform === 'darwin') return { last: ['osascript', ['-e', 'tell application "System Events" to shut down']] };
  return null;
}

// The plain words an Admin sees when this computer can't be shut down from Skynet
export function cannotWhy(platform = process.platform) {
  if (platform === 'linux') return 'This computer does not let Skynet turn it off. Run the Skynet installer again (it allows only the shut down command), or turn it off from its own desktop.';
  if (platform === 'win32') return 'Windows did not accept the shut down. Turn the computer off from its Start menu.';
  return 'Skynet can\'t turn this kind of computer off. Turn it off by hand.';
}

const run = (cmd, args) => new Promise(done => execFile(cmd, args, { windowsHide: true, timeout: 10000 }, err => done(!err)));

// 1. before anything stops: can it be done, and on Windows start the countdown. false: nothing stopped, tell the Admin why.
export async function startPowerOff(platform = process.platform, { exec = run, exists } = {}) {
  const plan = powerOffPlan(platform, exists);
  if (!plan) return false;
  if (plan.check && !(await exec(...plan.check))) return false;
  if (plan.now && !(await exec(...plan.now))) return false;
  return true;
}
// 2. as the Brain stops (every output already Off): turn the computer off. It runs on by itself after the Brain has ended.
export function finishPowerOff(platform = process.platform, { exists, start = spawn } = {}) {
  const plan = powerOffPlan(platform, exists);
  if (!plan?.last) return;
  try { const c = start(plan.last[0], plan.last[1], { detached: true, stdio: 'ignore', windowsHide: true }); c.on?.('error', () => { }); c.unref?.(); }
  catch { /* the Brain still stops */ }
}
