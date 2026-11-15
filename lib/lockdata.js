// The Brain's data folder (logins, the lock key, messaging settings, the brew log) can be opened only by the computer account that
// runs the Brain (OakBarn Brewery, 2026-11-14: "Make it as safe as you can and prevent non admin from accessing brain", Rule 8.5).
// Windows: the folder stops taking its permissions from C:\Brewing and gives Full control only to this account, the computer's
// Administrators and the system (by their fixed IDs, so it works in every Windows language). Pi, Linux, Mac: owner only (700).
// Run once at each Brain start; a failure is only logged (the Brain still starts).
import fs from 'node:fs';
import os from 'node:os';
import { execFile } from 'node:child_process';

export function lockDataFolder(dir, log = console.log) {
  try { fs.mkdirSync(dir, { recursive: true }); } catch {}
  if (process.platform !== 'win32') {
    try { fs.chmodSync(dir, 0o700); } catch (e) { log(`Could not lock the data folder: ${e.message}`); }
    return;
  }
  const me = process.env.USERDOMAIN && process.env.USERNAME ? `${process.env.USERDOMAIN}\\${process.env.USERNAME}` : os.userInfo().username;
  // *S-1-5-18 = the system, *S-1-5-32-544 = the computer's Administrators
  const args = [dir, '/inheritance:r', '/grant:r', `${me}:(OI)(CI)F`, '*S-1-5-18:(OI)(CI)F', '*S-1-5-32-544:(OI)(CI)F', '/Q'];
  execFile('icacls', args, { windowsHide: true, timeout: 20000 }, err => { if (err) log(`Could not lock the data folder: ${err.message}`); });
}
