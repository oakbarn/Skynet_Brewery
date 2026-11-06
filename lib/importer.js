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

// Where BruControl keeps its config files. Fritz (2026-11-06): look ONLY in Documents\BruControl first; if no config file is
// there, the person points to the folder. Documents can be moved (to OneDrive or another drive), so the real Documents folder
// Windows reports (documents) is used; without it, the usual one in the user's folder.
export function defaultFolders(env = process.env, documents = '') {
  if (documents) return [win.join(documents, 'BruControl')];
  if (env.USERPROFILE) return [win.join(env.USERPROFILE, 'Documents', 'BruControl')];
  return [];
}

// BruControl may keep a default config there too (Fritz: "it may have a default.config"). It is listed, marked Default, and
// does not count as the brewer's own config: with only a default one there, the person is asked to point to their folder.
export const isDefaultConfig = name => /^default\b/i.test(name);
export const isConfigName = name => { const n = name.toLowerCase(); return n.endsWith(CONFIG_EXT) || (isDefaultConfig(name) && n.endsWith('.config')); };

// The first of the default folders that is there; if none is, the first one (shown as "not found, pick your folder")
export function startFolder(candidates, exists = p => { try { return fs.statSync(p).isDirectory(); } catch { return false; } }) {
  return candidates.find(p => exists(p)) ?? candidates[0] ?? '';
}

// ISO 8601 to the minute, local time (Rule 3: dates are YYYY-MM-DD)
export function isoLocal(ms) {
  const d = new Date(ms), p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// Every config file in the folder (only that folder; depth goes into subfolders when asked). Newest first, a default config
// last. Returns { folder, exists, own (how many are not a default config), files: [{ name, sub, path, size, modified, isDefault }] }
export function findConfigs(folder, { depth = 0, max = 500, fsys = fs, join = path.join } = {}) {
  const out = { folder, exists: false, own: 0, files: [] };
  try { if (!folder || !fsys.statSync(folder).isDirectory()) return out; } catch { return out; }
  out.exists = true;
  const walk = (dir, sub, left) => {
    let ents;
    try { ents = fsys.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (out.files.length >= max) return;
      const full = join(dir, e.name);
      if (e.isDirectory()) { if (left > 0 && !e.name.startsWith('.')) walk(full, sub ? `${sub}\\${e.name}` : e.name, left - 1); continue; }
      if (!e.isFile() || !isConfigName(e.name)) continue;
      try { const st = fsys.statSync(full); out.files.push({ name: e.name, sub, path: full, size: st.size, mtime: st.mtimeMs, modified: isoLocal(st.mtimeMs), isDefault: isDefaultConfig(e.name) }); } catch { /* gone */ }
    }
  };
  walk(folder, '', depth);
  out.files.sort((a, b) => a.isDefault - b.isDefault || b.mtime - a.mtime || a.name.localeCompare(b.name));
  for (const f of out.files) delete f.mtime;
  out.own = out.files.filter(f => !f.isDefault).length;
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
