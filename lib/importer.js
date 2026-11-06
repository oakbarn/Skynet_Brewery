// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Skynet BruControl Importer (Rule 15.4, Fritz 2026-11-06): the parts that find BruControl config files.
// The Importer runs on Windows, on the same computer as BruControl. It starts in the Documents\BruControl folder, or a
// folder the person picks, and lists every BruControl config file (.brucfg) there. It only ever READS BruControl's files.
import fs from 'node:fs';
import path from 'node:path';
import { parseXml } from './brucontrol.js';

export const CONFIG_EXT = '.brucfg';
const win = path.win32;

// Where BruControl keeps its config files, best first. Fritz: "\Documents\BruControl\". Documents can be moved to OneDrive,
// so the real Documents folder Windows reports (documents) comes first, then the usual places. Older BruControl copies used
// C:\BruControl. Each folder is listed once.
export function defaultFolders(env = process.env, documents = '') {
  const list = [];
  const add = p => { if (p && !list.some(q => q.toLowerCase() === p.toLowerCase())) list.push(p); };
  if (documents) add(win.join(documents, 'BruControl'));
  if (env.USERPROFILE) add(win.join(env.USERPROFILE, 'Documents', 'BruControl'));
  for (const od of [env.OneDrive, env.OneDriveConsumer, env.OneDriveCommercial]) if (od) add(win.join(od, 'Documents', 'BruControl'));
  add(win.join((env.SystemDrive || 'C:') + '\\', 'BruControl'));
  return list;
}

// The first of the default folders that is there; if none is, the first one (shown as "not found, pick your folder")
export function startFolder(candidates, exists = p => { try { return fs.statSync(p).isDirectory(); } catch { return false; } }) {
  return candidates.find(p => exists(p)) ?? candidates[0] ?? '';
}

// ISO 8601 to the minute, local time (Rule 3: dates are YYYY-MM-DD)
export function isoLocal(ms) {
  const d = new Date(ms), p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// Every .brucfg file in the folder and in its subfolders (two levels down, so a "Backups" folder is found too).
// Newest first. Folders that cannot be read are skipped. Returns { folder, exists, files: [{ name, sub, path, size, modified }] }
export function findConfigs(folder, { depth = 2, max = 500, fsys = fs, join = path.join } = {}) {
  const out = { folder, exists: false, files: [] };
  try { if (!folder || !fsys.statSync(folder).isDirectory()) return out; } catch { return out; }
  out.exists = true;
  const walk = (dir, sub, left) => {
    let ents;
    try { ents = fsys.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (out.files.length >= max) return;
      const full = join(dir, e.name);
      if (e.isDirectory()) { if (left > 0 && !e.name.startsWith('.')) walk(full, sub ? `${sub}\\${e.name}` : e.name, left - 1); continue; }
      if (!e.isFile() || !e.name.toLowerCase().endsWith(CONFIG_EXT)) continue;
      try { const st = fsys.statSync(full); out.files.push({ name: e.name, sub, path: full, size: st.size, mtime: st.mtimeMs, modified: isoLocal(st.mtimeMs) }); } catch { /* gone */ }
    }
  };
  walk(folder, '', depth);
  out.files.sort((a, b) => b.mtime - a.mtime || a.name.localeCompare(b.name));
  for (const f of out.files) delete f.mtime;
  return out;
}

// A quick look inside a config file before it is picked: its boards (BruControl "Devices" are Skynet Interfaces), its
// workspaces (Skynet Tabs), how many elements (Skynet Devices and Widgets) and scripts (Skynet Processes) it has.
export function summarize(xml) {
  const doc = parseXml(String(xml).replace(/^\uFEFF/, ''));
  const cfg = doc.children.find(c => c.tag === 'Configuration');
  if (!cfg) throw new Error('This is not a BruControl config file (it has no <Configuration>).');
  const kid = (n, t) => n?.children.find(c => c.tag === t);
  const kids = (n, t) => n?.children.filter(c => c.tag === t) ?? [];
  const txt = (n, t) => { const k = kid(n, t); return k && !k.nil ? k.text.trim() : ''; };
  const interfaces = kids(kid(cfg, 'Devices'), 'Device').map(d => ({
    name: txt(d, 'Name') || '(no name)', link: txt(d, 'Interface'), enabled: txt(d, 'Enabled').toLowerCase() !== 'false',
    ports: kids(kid(d, 'Ports'), 'DevicePort').length,
  }));
  const tabs = kids(kid(cfg, 'Workspaces'), 'Workspace').map(w => ({ name: txt(w, 'Name') || '(no name)', items: kids(kid(w, 'Elements'), 'Element').length }));
  return {
    interfaces, tabs,
    items: tabs.reduce((s, t) => s + t.items, 0),
    processes: kids(kid(cfg, 'Processes'), 'Process').length,
    globals: kids(kid(cfg, 'Globals'), 'Global').length,
  };
}

// The Importer's own small settings file (the last folder and file picked). It holds no Schemas (Rule 1.7).
export function settingsFile(env = process.env, platform = process.platform) {
  if (platform === 'win32') {
    const base = env.LOCALAPPDATA || (env.USERPROFILE ? win.join(env.USERPROFILE, 'AppData', 'Local') : '');
    return base ? win.join(base, 'SkynetBrewer', 'Importer', 'settings.json') : '';
  }
  return env.HOME ? path.join(env.HOME, '.skynet-importer', 'settings.json') : '';
}
export function loadSettings(file, fsys = fs) {
  try { const s = JSON.parse(fsys.readFileSync(file, 'utf8')); return s && typeof s === 'object' ? s : {}; } catch { return {}; }
}
export function saveSettings(file, s, fsys = fs) {
  if (!file) return;
  fsys.mkdirSync(path.dirname(file), { recursive: true });
  fsys.writeFileSync(file, JSON.stringify(s, null, 2));
}

// Windows' own "Browse For Folder" box, on top of the Importer window. Returns the PowerShell command.
export function pickFolderScript(start = '') {
  const s = String(start).replace(/'/g, "''");
  return "Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.FolderBrowserDialog; " +
    "$f.Description = 'Pick the folder that holds your BruControl config file (.brucfg)'; $f.ShowNewFolderButton = $false; " +
    `if ('${s}' -and (Test-Path -LiteralPath '${s}')) { $f.SelectedPath = '${s}' }; ` +
    "$o = New-Object System.Windows.Forms.Form; $o.TopMost = $true; " +
    "if ($f.ShowDialog($o) -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($f.SelectedPath) }";
}
