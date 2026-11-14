// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Skynet opens in its own clean window on Windows (Rule 2.36, Fritz 2026-11-04): no address bar, no bookmarks bar, no tabs.
// It is Microsoft Edge (or Google Chrome) in "app" mode, using its own small browser profile kept in
// %LOCALAPPDATA%\SkynetBrewer\AppWindow. The person's normal browser, its bookmarks bar and its settings are never changed,
// so it looks exactly as before once Skynet closes. No Edge or Chrome: the normal browser opens the panel as before.
// ☰ Menu > Close Skynet Panel and the Brain closes this window too (Rule 2.25). Closing the window with its X never stops the panel.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

// Where Edge and Chrome are put by their installers, Edge first (it is on every Windows 10 and 11)
export function browserPaths(env = process.env) {
  const roots = [env['ProgramFiles(x86)'], env.ProgramFiles, env.LOCALAPPDATA].filter(Boolean);
  return [
    ...roots.map(r => path.win32.join(r, 'Microsoft', 'Edge', 'Application', 'msedge.exe')),
    ...roots.map(r => path.win32.join(r, 'Google', 'Chrome', 'Application', 'chrome.exe')),
  ];
}
export function findBrowser({ env = process.env, exists = fs.existsSync } = {}) {
  return browserPaths(env).find(p => { try { return exists(p); } catch { return false; } }) ?? null;
}
// Skynet's own browser profile: the person's normal one is never used, so nothing in it changes
export function profileDir(env = process.env) {
  const base = env.LOCALAPPDATA || (env.USERPROFILE ? path.win32.join(env.USERPROFILE, 'AppData', 'Local') : null);
  return base ? path.win32.join(base, 'SkynetBrewer', 'AppWindow') : null;
}
// The BruControl Importer's window has its own profile, so closing one window never closes the other (Rule 15.4)
export function importerProfileDir(env = process.env) {
  const d = profileDir(env);
  return d ? path.win32.join(path.win32.dirname(d), 'ImporterWindow') : null;
}
// --disable-sync: Edge signs a new profile in to the Windows Microsoft account by itself and syncs its saved passwords in,
// which filled the old user name and password into a fresh Admin setup (Fritz, 2026-11-05). This window never syncs, so a
// password saved in it stays in Skynet's own profile only, still fills in on Sign in, and goes with Start Fresh (Rule 9.8).
export function appArgs(url, dir) {
  return [`--app=${url}`, `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check', '--start-maximized', '--disable-sync'];
}

// Older .bat files (an old Skynet_Brewer.bat copied to C:\Brewing) open the normal browser a few seconds after the panel
// starts, with a waiting  cmd /c "timeout ... & start "" http://localhost:8080". It is ended so only the clean window opens.
export function waitingOpeners(procs, port) {
  const re = new RegExp(`timeout\\b.*start\\b.*https?://(localhost|127\\.0\\.0\\.1):${port}\\b`, 'i');
  return procs.filter(p => String(p.name ?? '').toLowerCase() === 'cmd.exe' && re.test(String(p.cmd ?? ''))).map(p => Number(p.pid));
}

function powershell(cmd, timeout = 8000) {
  return spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', cmd], { encoding: 'utf8', timeout, windowsHide: true });
}
function listWithCommandLines() {
  const r = powershell('Get-CimInstance Win32_Process -Filter "Name=\'cmd.exe\'" | ForEach-Object { "$($_.ProcessId)`t$($_.Name)`t$($_.CommandLine)" }');
  if (r.status !== 0 || !r.stdout) return [];
  return r.stdout.split(/\r?\n/).map(l => l.split('\t')).filter(a => a.length >= 3).map(([pid, name, ...cmd]) => ({ pid, name, cmd: cmd.join('\t') }));
}

// Opens the panel in its clean window. Returns what it did: 'app' (Edge or Chrome app window), 'browser' (the normal
// browser, no Edge or Chrome found), or 'none' (not Windows, or turned off with SKYNET_WINDOW=none). Never throws.
export function openAppWindow(url, { platform = process.platform, env = process.env, port = 8080,
  find = () => findBrowser({ env }), run = (exe, args) => spawn(exe, args, { detached: true, stdio: 'ignore', windowsHide: false }).on('error', () => {}).unref(),
  list = listWithCommandLines, kill = pid => process.kill(pid), profile = profileDir(env) } = {}) {
  if (platform !== 'win32' || String(env.SKYNET_WINDOW ?? '').toLowerCase() === 'none') return 'none';
  try { for (const pid of waitingOpeners(list(), port)) { try { kill(pid); } catch { /* already gone */ } } } catch { /* the old .bat may open a tab too */ }
  try {
    const exe = String(env.SKYNET_WINDOW ?? '').toLowerCase() === 'browser' ? null : find(), dir = profile;
    if (exe && dir) { run(exe, appArgs(url, dir)); return 'app'; }
    run('explorer.exe', [url]); return 'browser';   // Explorer hands a web address to the normal browser
  } catch { return 'none'; }
}

// An outside web link (a Help link, Versions on GitHub, Buy a beer ...) opens in the person's own default browser, never in
// Skynet's clean window (OakBarn Brewery, 2026-11-12: "The link in the Help ... used Edge to open the Wikipedia Page and not my default
// browser"). The clean window IS Edge (or Chrome), so a link it opens itself stays in Edge; the panel asks the Brain instead, and
// Explorer hands the address to the default browser, the same way the panel opens when no Edge or Chrome is found.
// Only http and https addresses. Returns true when it was handed over; false (not Windows, or not a web address) means the page
// opens it itself.
export const isWebLink = u => { try { const x = new URL(String(u)); return (x.protocol === 'http:' || x.protocol === 'https:') && !x.username && !x.password; } catch { return false; } };
export function openInDefaultBrowser(url, { platform = process.platform,
  run = (exe, args) => spawn(exe, args, { detached: true, stdio: 'ignore', windowsHide: true }).on('error', () => {}).unref() } = {}) {
  if (platform !== 'win32' || !isWebLink(url)) return false;
  try { run('explorer.exe', [new URL(url).href]); return true; } catch { return false; }
}

// Closes Skynet's clean window (only the browser using Skynet's own profile; the person's normal browser is left alone).
// It is asked to close first, like clicking its X, so the browser does not say it "didn't shut down correctly" next time.
export function closeScript(dir) {
  const d = dir.replace(/'/g, "''");
  return `$d='${d}'; $m={ Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and $_.CommandLine.Contains($d) } };` +
    ' foreach ($p in & $m) { try { [void](Get-Process -Id $p.ProcessId -ErrorAction Stop).CloseMainWindow() } catch {} };' +
    ' for ($i=0; $i -lt 20 -and @(& $m).Count; $i++) { Start-Sleep -Milliseconds 200 };' +
    ' foreach ($p in & $m) { Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue }';
}
export function closeAppWindow({ platform = process.platform, env = process.env, run = s => powershell(s, 10000), profile = profileDir(env) } = {}) {
  if (platform !== 'win32') return false;
  const dir = profile;
  if (!dir) return false;
  try { run(closeScript(dir)); return true; } catch { return false; }
}
