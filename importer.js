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
import { defaultFolders, startFolder, findConfigs, summarize, settingsFile, loadSettings, saveSettings, pickFolderScript, CONFIG_EXT } from './lib/importer.js';
import { openAppWindow, closeAppWindow, importerProfileDir } from './lib/appwindow.js';
import { readVersion } from './lib/version.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, 'public');
const PORT = Number(process.env.IMPORTER_PORT ?? 8095);
const WIN = process.platform === 'win32';
const SETTINGS = settingsFile();
const MAX_CONFIG = 100 * 1024 * 1024;

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
const isDir = p => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };

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
const isConfig = p => typeof p === 'string' && path.isAbsolute(p) && p.toLowerCase().endsWith(CONFIG_EXT);

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
    const folder = settings.folder && isDir(settings.folder) ? settings.folder : startFolder(CANDIDATES);
    return json(res, 200, { version: readVersion(ROOT).version || '', windows: WIN, candidates: CANDIDATES, defaultFolder: startFolder(CANDIDATES), folder, file: settings.file ?? '' });
  }
  if (p === '/api/configs' && m === 'GET') return json(res, 200, findConfigs(q.get('folder') ?? ''));
  if (p === '/api/folder' && m === 'POST') {
    const { folder } = await body(req);
    if (typeof folder !== 'string' || !folder.trim()) return json(res, 400, { error: 'No folder given.' });
    settings.folder = folder.trim(); saveSettings(SETTINGS, settings);
    return json(res, 200, findConfigs(settings.folder));
  }
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
