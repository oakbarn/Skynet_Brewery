// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Skynet BruControl Importer (Rule 15.4, Fritz 2026-11-06). The second door of the same Skynet program: it uses the Panel's
// own code, Templates, pictures and Rules, so what it makes matches the Panel exactly. It runs on Windows, on the computer
// that has BruControl, opens in its own clean window and needs no Brain, boards or sign-in.
// Step 1 Welcome, step 2 pick the BruControl config file. The import steps come next.
// It only READS BruControl's files and never changes them. It listens on this computer only (127.0.0.1).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { defaultFolders, findConfigs, summarize, settingsFile, loadSettings, saveSettings, pickFolderScript, pickFileScript, isConfigName, importFolder, importFileName, buildSchemaFile, safeName, makeImportCopy } from './lib/importer.js';
import { openAppWindow, closeAppWindow, importerProfileDir } from './lib/appwindow.js';
import { readVersion } from './lib/version.js';
import { importBruControl } from './lib/bruimport.js';     // the NEW import function, built step by step (Fritz, 2026-11-06)

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, 'public');
const PORT = Number(process.env.IMPORTER_PORT ?? 8095);
const WIN = process.platform === 'win32';
const SETTINGS = settingsFile();
const MAX_CONFIG = 100 * 1024 * 1024;
const IMPORT_DIR = importFolder(ROOT);     // C:\Brewing\Import (Fritz, 2026-11-06)
const MEDIA_DIR = process.env.SKYNET_MEDIA_DIR || path.join(ROOT, 'media');     // the Panel's media folder (pictures go to Images\User)

// Windows' real Documents folder (it may have been moved to OneDrive or another drive)
function documentsFolder() {
  if (!WIN) return '';
  try {
    const r = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', "[Console]::Out.Write([Environment]::GetFolderPath('MyDocuments'))"], { encoding: 'utf8', timeout: 8000, windowsHide: true });
    return r.status === 0 ? r.stdout.trim() : '';
  } catch { return ''; }
}
const CANDIDATES = defaultFolders(process.env, documentsFolder());
const settings = loadSettings(SETTINGS);
let converted = null;      // the last converted Import Copy: { file, copy, conv, report }

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png' };
function sendFile(res, file) {
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(buf);
  });
}
const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
const body = req => new Promise((ok, bad) => {
  let s = ''; req.on('data', d => { s += d; if (s.length > 1e6) { bad(new Error('Too much')); req.destroy(); } });
  req.on('end', () => { try { ok(s ? JSON.parse(s) : {}); } catch { bad(new Error('Bad request')); } });
});
const isConfig = p => typeof p === 'string' && path.isAbsolute(p) && isConfigName(path.basename(p));

// the Windows Open box for the config file itself (Fritz, 2026-11-06)
function pickFile(start) {
  return new Promise(ok => {
    if (!WIN) return ok({ picked: '', none: true });
    const ps = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-STA', '-Command', pickFileScript(start)], { windowsHide: true });
    let out = ''; ps.stdout.on('data', d => { out += d; });
    ps.on('error', () => ok({ picked: '', none: true }));
    ps.on('close', () => ok({ picked: out.trim() }));
  });
}
function pickFolder(start) {
  return new Promise(ok => {
    if (!WIN) return ok({ picked: '', none: true });
    const ps = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-STA', '-Command', pickFolderScript(start)], { windowsHide: true });
    let out = ''; ps.stdout.on('data', d => { out += d; });
    ps.on('error', () => ok({ picked: '', none: true }));
    ps.on('close', () => ok({ picked: out.trim() }));
  });
}

async function api(req, res, p, q) {
  const m = req.method;
  if (p === '/api/start' && m === 'GET') {
    // Always Documents\BruControl first (Fritz, 2026-11-06); the person points elsewhere when their config is not there
    const home = CANDIDATES[0] ?? '';
    return json(res, 200, { version: readVersion(ROOT).version || '', windows: WIN, importFolder: IMPORT_DIR, defaultFolder: home, folder: home, lastFolder: settings.folder ?? '', file: settings.file ?? '' });
  }
  if (p === '/api/configs' && m === 'GET') return json(res, 200, findConfigs(q.get('folder') ?? ''));
  if (p === '/api/folder' && m === 'POST') {
    const { folder } = await body(req);
    if (typeof folder !== 'string' || !folder.trim()) return json(res, 400, { error: 'No folder given.' });
    settings.folder = folder.trim(); saveSettings(SETTINGS, settings);
    return json(res, 200, findConfigs(settings.folder));
  }
  if (p === '/api/pick-file' && m === 'POST') { const { start } = await body(req); return json(res, 200, await pickFile(start || CANDIDATES[0] || '')); }
  if (p === '/api/pick-folder' && m === 'POST') { const { start } = await body(req); return json(res, 200, await pickFolder(start ?? '')); }
  if (p === '/api/peek' && m === 'GET') {
    const file = q.get('file') ?? '';
    if (!isConfig(file)) return json(res, 400, { error: 'That is not a BruControl config file (.brucfg).' });
    try {
      const st = fs.statSync(file);
      if (st.size > MAX_CONFIG) return json(res, 400, { error: 'That file is too big to be a BruControl config file.' });
      return json(res, 200, summarize(fs.readFileSync(file, 'utf8')));
    } catch (e) { return json(res, 400, { error: e.code === 'ENOENT' ? 'That file is not there any more.' : e.message }); }
  }
  if (p === '/api/choose' && m === 'POST') {
    const { file } = await body(req);
    if (!isConfig(file) || !fs.existsSync(file)) return json(res, 400, { error: 'Pick a BruControl config file (.brucfg) from the list.' });
    settings.file = file; saveSettings(SETTINGS, settings);
    return json(res, 200, { ok: true, file });
  }
  // Make the Import Copy of the config file and convert the copy (Fritz, 2026-11-06). The first pass brings in the items on a
  // board port and the Tabs; everything else is a Placeholder on its Tab. names: 'skynet' (default) or 'bru' (Rule 15.1).
  if (p === '/api/convert' && m === 'POST') {
    const { file, names } = await body(req);
    if (!isConfig(file) || !fs.existsSync(file)) return json(res, 400, { error: 'Pick a BruControl config file (.brucfg) first.' });
    if (fs.statSync(file).size > MAX_CONFIG) return json(res, 400, { error: 'That file is too big to be a BruControl config file.' });
    const copy = makeImportCopy(file, IMPORT_DIR);
    // Pictures: read from the path BruControl saved, wherever it is, and COPIED to media\Images\User; nothing is moved
    // (Fritz, 2026-11-06). A picture already in Images\User (an earlier import) is kept, never written over.
    const picture = (from, to) => {
      try {
        if (!fs.statSync(from).isFile()) return false;
        const dest = path.join(MEDIA_DIR, ...to.split('/'));
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        if (!fs.existsSync(dest)) fs.copyFileSync(from, dest, fs.constants.COPYFILE_EXCL);
        return true;
      } catch { return false; }
    };
    const r = importBruControl(fs.readFileSync(copy, 'utf8'), { names: names === 'bru' ? 'bru' : 'skynet', picture });
    converted = { file, copy, ...r };
    return json(res, 200, { copy, ...r.report, warnings: r.conv.warnings });
  }
  // Save the Schema into Brewing\Import, for the Panel to open (Schema.json > Open a Schema file)
  if (p === '/api/save' && m === 'POST') {
    const { file, name } = await body(req);
    if (!converted || converted.file !== file) return json(res, 400, { error: 'Go back to Names and click Next first, so the config file is converted.' });
    const out = buildSchemaFile(converted.conv, { name: name || path.basename(file), source: path.basename(file), draft: true, version: readVersion(ROOT).version || '' });
    out.importCopy = path.basename(converted.copy);
    out.importReport = { stage: 'new import, step 1: Interfaces, Tabs, items on a board port and Placeholders', names: converted.report.names, renames: converted.report.renames };
    fs.mkdirSync(IMPORT_DIR, { recursive: true });
    const fname = importFileName(out.schema.name);
    fs.writeFileSync(path.join(IMPORT_DIR, fname), JSON.stringify(out, null, 2));
    return json(res, 200, { folder: IMPORT_DIR, file: fname, name: out.schema.name, tabs: out.schema.workspaces.length, items: out.schema.elements.length,
      interfaces: out.schema.devices.length, placeholders: out.schema.graphics.length, warnings: out.warnings.length });
  }
  if (p === '/api/open-import' && m === 'POST') {
    if (!WIN) return json(res, 200, { ok: false });
    fs.mkdirSync(IMPORT_DIR, { recursive: true });
    spawn('explorer.exe', [IMPORT_DIR], { detached: true, stdio: 'ignore' }).on('error', () => {}).unref();
    return json(res, 200, { ok: true });
  }
  if (p === '/api/close' && m === 'POST') {
    json(res, 200, { ok: true });
    setTimeout(() => { closeAppWindow({ profile: importerProfileDir() }); process.exit(0); }, 300);
    return;
  }
  json(res, 404, { error: 'Not found' });
}

const server = http.createServer(async (req, res) => {
  // This computer only, and only this window: another web page cannot use it (the custom header needs our own page)
  const host = String(req.headers.host ?? '').replace(/:\d+$/, '');
  if (!['localhost', '127.0.0.1', '[::1]'].includes(host)) { res.writeHead(403); return res.end('Forbidden'); }
  const u = new URL(req.url, 'http://localhost');
  const p = decodeURIComponent(u.pathname);
  try {
    if (p.startsWith('/api/')) {
      if (req.headers['x-skynet-importer'] !== '1') return json(res, 403, { error: 'Forbidden' });
      return await api(req, res, p, u.searchParams);
    }
    if (p === '/' || p === '/index.html') return sendFile(res, path.join(PUBLIC, 'importer', 'index.html'));
    if (p.startsWith('/importer/') && /^[\w./-]+$/.test(p) && !p.includes('..')) return sendFile(res, path.join(PUBLIC, p));
    // the Panel's own look and icon (one source, Rule 15.4)
    if (['/style.css', '/favicon.svg', '/favicon.ico'].includes(p)) return sendFile(res, path.join(PUBLIC, p.slice(1)));
    res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found');
  } catch (e) { json(res, 500, { error: e.message }); }
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Skynet BruControl Importer running:  ${url}`);
  const how = openAppWindow(url, { port: PORT, profile: importerProfileDir() });
  if (how === 'app') console.log('Opened the Importer in its own window.');
  else if (how === 'browser') console.log('Opened the Importer in your browser (no Edge or Chrome found).');
  else console.log(`Open ${url} in a browser.`);
});
server.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.log(`The Importer is already running on port ${PORT}. Opening its window again.`);
    openAppWindow(`http://localhost:${PORT}`, { port: PORT, profile: importerProfileDir(), list: () => [] });
    setTimeout(() => process.exit(0), 1500);
  } else { console.error(e.message); process.exit(1); }
});
