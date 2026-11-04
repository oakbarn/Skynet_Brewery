// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Close Skynet Brewer closes its Command Prompt window too (Rule 2.25, Fritz 2026-10-30 and 2026-11-04).
// Whatever .bat started the panel (the Skynet_Brewer.bat, an older one in C:\Brewing, or "npm start" typed in a Command
// Prompt), the window is the Command Prompt that the panel runs under. When the panel is closed from ☰ Menu it ends that
// Command Prompt (and npm in between) itself, so the black window closes. Nothing above the Command Prompt is touched
// (Explorer, Windows Terminal, a service), and an error or Ctrl + C never closes it this way.
import { spawnSync } from 'node:child_process';

// Programs that sit between the window and the panel: cmd.exe (the .bat, and npm's own), node.exe (npm), npm's shims
const BETWEEN = new Set(['cmd.exe', 'node.exe', 'npm.exe', 'npx.exe', 'conhost.exe']);

// procs: [{ pid, ppid, name }]. Returns the PIDs above the panel, nearest first, up to and including the top Command Prompt.
// Empty when the panel was not started from a Command Prompt.
export function launcherChain(procs, self) {
  const byPid = new Map(procs.map(p => [Number(p.pid), { pid: Number(p.pid), ppid: Number(p.ppid), name: String(p.name ?? '').toLowerCase() }]));
  const chain = [], seen = new Set([self]);
  let cur = byPid.get(self);
  while (cur && !seen.has(cur.ppid)) {
    const up = byPid.get(cur.ppid);
    if (!up || !BETWEEN.has(up.name) || up.name === 'conhost.exe') break;
    seen.add(up.pid); chain.push(up); cur = up;
  }
  // stop at the highest Command Prompt: anything above it (npm alone, with no Command Prompt) is not a window to close
  let top = -1;
  chain.forEach((p, i) => { if (p.name === 'cmd.exe') top = i; });
  return chain.slice(0, top + 1).map(p => p.pid);
}

// Windows only: the processes on this computer, from PowerShell
function listProcesses() {
  const ps = 'Get-CimInstance Win32_Process | ForEach-Object { "$($_.ProcessId) $($_.ParentProcessId) $($_.Name)" }';
  const r = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', ps], { encoding: 'utf8', timeout: 8000, windowsHide: true });
  if (r.status !== 0 || !r.stdout) return [];
  return r.stdout.split(/\r?\n/).map(l => l.trim().match(/^(\d+)\s+(\d+)\s+(.+)$/)).filter(Boolean).map(m => ({ pid: m[1], ppid: m[2], name: m[3] }));
}

// Ends the Command Prompt the panel runs under. Call it just before the panel exits; it never throws.
export function closeLauncherWindow({ platform = process.platform, self = process.pid, list = listProcesses, kill = (pid) => process.kill(pid) } = {}) {
  if (platform !== 'win32') return [];
  try {
    const pids = launcherChain(list(), self);
    // the top Command Prompt first, so it cannot run the rest of its .bat (a "pause") once npm is gone
    for (const pid of [...pids].reverse()) { try { kill(pid); } catch { /* already gone */ } }
    return pids;
  } catch { return []; }
}
