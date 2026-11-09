// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Skynet BruControl Importer (Rule 15.4, Fritz 2026-11-06). The second door of the same Skynet program: it uses the Panel's
// own code, Templates, pictures and Rules, so what it makes matches the Panel exactly. It runs on Windows, on the computer
// that has BruControl, opens in its own clean window and needs no Brain, boards or sign-in.
// Step 1 Welcome, step 2 pick the BruControl config file. The import steps come next.
// It only READS BruControl's files and never changes them. It listens on this computer only (127.0.0.1).
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { defaultFolders, findConfigs, summarize, settingsFile, loadSettings, saveSettings, pickFolderScript, pickFileScript, isConfigName, isBackupName, resolveFolder, configBase, importFolder, importFileName, buildSchemaFile, safeName, makeImportCopy, findBruControlTheme, readClues, dropEmptyInterfaces, dropEmptyTabs } from './lib/importer.js';
import { findParts, itemKind, guessPartDetails, cleanPartDetails, PART_PAGES, findVesselDetails, findProbes, findHeaters, guessFermenters, guessChains, connectReport, OPENINGS, COOLING, HEATING, AI_SITES } from './public/importer/connect.js';
import { bruThemeToLook, themeOf, newTabLook } from './public/themes.js';
import { openAppWindow, closeAppWindow, importerProfileDir } from './lib/appwindow.js';
import { readVersion } from './lib/version.js';
import { importBruControl } from './lib/bruimport.js';     // the NEW import function, built step by step (Fritz, 2026-11-06)
import { isHeatElem, isCoolPump, HEAT_KEYS, PUMP_METHOD_KEYS } from './public/heatmethod.js';
import { HYDRO_MODELS } from './public/hydrometer.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, 'public');
const PORT = Number(process.env.IMPORTER_PORT ?? 8095);
const WIN = process.platform === 'win32';
const SETTINGS = settingsFile();
const MAX_CONFIG = 100 * 1024 * 1024;
const IMPORT_DIR = importFolder(ROOT);     // C:\Brewing\Import (Fritz, 2026-11-06)
const MEDIA_DIR = process.env.SKYNET_MEDIA_DIR || path.join(ROOT, 'media');     // the Panel's media folder (copies go to Images\User, sounds\User)

// ---- The Build page (OakBarn Brewery, 2026-11-08: "Connect to your Brewery will use the same Build page as in Skynet Panel"; "The
// Only thing I see is the Process Icon needs to be greyed Out"). The Importer starts the Skynet Panel itself (server.js) on its own
// port and its own folder, Brewing\Import\build, with SKYNET_IMPORT_BUILD=1: no board is connected and Processes are greyed out. The
// imported Tabs, Devices and Widgets are put in that folder first; what is built there comes back into the Schema when it is saved.
const BUILD_PORT = Number(process.env.IMPORTER_BUILD_PORT ?? PORT + 1);
const BUILD_DIR = path.join(IMPORT_DIR, 'build');
const PROGRESS = path.join(IMPORT_DIR, 'progress.json');      // the answers so far, by config file (come back later)
function readProgress() { try { const j = JSON.parse(fs.readFileSync(PROGRESS, 'utf8')); return j && typeof j === 'object' ? j : {}; } catch { return {}; } }
const BUILD_CONFIG = path.join(BUILD_DIR, 'config', 'brewery.json');
const build = { child: null, key: '' };
const SCHEMA_KEYS = ['devices', 'workspaces', 'elements', 'graphics', 'probes', 'autostart'];
function readBuild(copy) {
  try { const c = JSON.parse(fs.readFileSync(BUILD_CONFIG, 'utf8')); return c.importFor === copy ? c : null; } catch { return null; }
}
function writeBuild(conv, copy) {
  fs.mkdirSync(path.dirname(BUILD_CONFIG), { recursive: true });
  const c = { title: 'BruControl Importer: Build page', port: BUILD_PORT, mediaRoots: [MEDIA_DIR], theme: conv.theme, units: conv.units, importFor: copy };
  for (const k of SCHEMA_KEYS) c[k] = conv[k] ?? [];
  fs.writeFileSync(BUILD_CONFIG, JSON.stringify(c, null, 2));
}
const buildUp = () => new Promise(ok => { const r = http.get({ host: '127.0.0.1', port: BUILD_PORT, path: '/login.html', timeout: 1000 }, x => { x.resume(); ok(true); }); r.on('error', () => ok(false)); r.on('timeout', () => { r.destroy(); ok(false); }); });
async function startBuild() {
  if (build.child && build.child.exitCode === null && await buildUp()) return;
  build.key = crypto.randomBytes(32).toString('hex');
  build.child = spawn(process.execPath, ['--no-warnings', path.join(ROOT, 'server.js')], { cwd: ROOT, stdio: 'ignore', windowsHide: true,
    env: { ...process.env, SKYNET_IMPORT_BUILD: '1', SKYNET_IMPORT_KEY: build.key, PORT: String(BUILD_PORT), SKYNET_WINDOW: 'none', SKYNET_MINIMIZE: '',
      BREWPANEL_CONFIG: BUILD_CONFIG, BREWPANEL_DATA: path.join(BUILD_DIR, 'data'), BREWPANEL_SCRIPTS: path.join(BUILD_DIR, 'scripts') } });
  build.child.on('error', () => {});
  for (let i = 0; i < 60; i++) { if (await buildUp()) return; await new Promise(r => setTimeout(r, 250)); }
  throw new Error('The Build page did not start. Close the Importer and try again.');
}
// the Edit layout bar of the Panel's Build Tab, each choice with its own hover help (the Panel's text, so they always match)
const BAR_NAMES = { devKind: 'Select Device Type', devAdd: 'Add Device', vesselPick: 'Vessel', cloneDev: '⧉ Clone Device', wgtKind: 'Select Widget Type',
  wgtAdd: 'Add Widget', addBoolean: 'Boolean ➕', addIpType: 'Elbows, Tees ...', addVesselType: 'Add equipment ➕' };
function buildButtons() {
  let html = ''; try { html = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8'); } catch { return []; }
  const a = html.indexOf('id="editBar"'), b = html.indexOf('id="editInfo"', a);
  if (a < 0 || b < 0) return [];
  const out = [], seg = html.slice(a, b), re = /<(button|select)\b([^>]*)>([\s\S]*?)<\/\1>/g, attr = (s, k) => (new RegExp(`\\b${k}="([^"]*)"`).exec(s) ?? [])[1] ?? '';
  for (let x; (x = re.exec(seg));) {
    const at = x[2], title = attr(at, 'title'); if (!title) continue;
    const id = attr(at, 'id'), head = attr(at, 'data-head');
    const label = BAR_NAMES[id] || head || x[3].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (label) out.push({ label, help: title.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<') });
  }
  return out;
}
const stopBuild = () => { try { build.child?.kill(); } catch { /* already gone */ } build.child = null; };
process.on('exit', stopBuild);

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
let boxOpen = false;      // a Windows Open or Browse For Folder box is showing
let converted = null;      // the last converted Import Copy: { file, copy, conv, report }

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.bmp': 'image/bmp', '.webp': 'image/webp', '.mp3': 'audio/mpeg' };
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

// The brewer's Connect your brewery answers, checked against the parts this import found: only known vessels, pumps and valves,
// only the known end kinds; anything else is dropped (a missing answer leaves the item loose, never a wrong pipe)
// the Vessels page answers (OakBarn Brewery, 2026-11-08): yes or no for each part, a manual valve kind, the heaters and probe found
function vesselDetails(d) {
  const yn = x => (x === 'yes' ? 'yes' : 'no'), id = x => (x && typeof x.id === 'string' ? { id: x.id.slice(0, 120), label: String(x.label ?? x.id).slice(0, 80) } : null);
  const size = x => { const n = Number(x); return Number.isFinite(n) && n > 0 && n < 100000 ? Math.round(n * 1000) / 1000 : undefined; };
  return { volume: size(d.volume), vheight: size(d.vheight), diameter: size(d.diameter), tangential: yn(d.tangential), outlet: ['low', 'bottom'].includes(d.outlet) ? d.outlet : 'none', sparge: ['left', 'right'].includes(d.sparge) ? d.sparge : 'none', herms: ['left', 'right', 'outLeftInRight', 'outRightInLeft'].includes(d.herms) ? d.herms : 'none',
    manualValve: ['ball', 'butterfly'].includes(d.manualValve) ? d.manualValve : 'none',
    motorValve: typeof d.motorValve === 'string' ? d.motorValve.slice(0, 120) : '',
    heaters: (Array.isArray(d.heaters) ? d.heaters : []).map(id).filter(Boolean).slice(0, 8), heater: id(d.heater), probe: id(d.probe) };
}
function connectAnswers(sent, found) {
  const parts = found?.parts ?? { vessels: [], pumps: [], valves: [] };
  if (!sent || typeof sent !== 'object') return { parts, chains: found?.chains ?? [], fermenters: found?.fermenters ?? [], places: {} };
  const vessels = Array.isArray(sent.vessels) ? sent.vessels.filter(v => v && /^[\w ~#-]{1,40}$/.test(v.key) && typeof v.name === 'string')
    .map(v => ({ key: v.key, name: v.name.slice(0, 40), side: v.side === 'cold' ? 'cold' : 'hot',
      ...(typeof v.template === 'string' && /^[\w-]{1,80}$/.test(v.template) ? { template: v.template } : {}),
      ...(v.details && typeof v.details === 'object' ? { details: vesselDetails(v.details) } : {}) })) : parts.vessels;
  const p2 = { ...parts, vessels };
  const ids = new Set([...parts.pumps, ...parts.valves].map(i => i.id)), keys = new Set(vessels.map(v => v.key)), ats = new Set(OPENINGS.map(([k]) => k));
  const end = e => {
    if (!e || typeof e !== 'object') return null;
    if (e.kind === 'vessel') return keys.has(e.key) && ats.has(e.at) ? { kind: 'vessel', key: e.key, at: e.at } : null;
    if (e.kind === 'pump') return ids.has(e.id) ? { kind: 'pump', id: e.id, side: e.side === 'in' ? 'in' : 'out' } : null;
    if (e.kind === 'valve') return ids.has(e.id) ? { kind: 'valve', id: e.id } : null;
    if (e.kind === 'qd') return { kind: 'qd', sex: e.sex === 'female' ? 'female' : 'male', shut: !!e.shut, n: Math.max(1, Math.min(99, Number(e.n) || 1)) };
    if (e.kind === 'manifold') return { kind: 'manifold', n: Math.max(1, Math.min(99, Number(e.n) || 1)) };
    if (e.kind === 'tee') return { kind: 'tee', n: Math.max(1, Math.min(999, Number(e.n) || 1)) };
    return ['tap', 'drain', 'none'].includes(e.kind) ? { kind: e.kind } : null;
  };
  const src = s => ['name', 'script', 'picture', 'ai', 'you', 'guess'].includes(s) ? s : 'you';
  const chains = (Array.isArray(sent.chains) ? sent.chains : []).map(c => ({ start: end(c?.start),
    steps: (Array.isArray(c?.steps) ? c.steps : []).map(s => ({ to: end(s?.to), by: s?.by === 'hose' ? 'hose' : 'pipe', source: src(s?.source), ...(s?.ok ? { ok: true } : {}),
      ...(s?.by !== 'hose' && (s?.dir === 'left' || s?.dir === 'right') ? { dir: s.dir } : {}), ...(s?.fit === 'elbow' || s?.fit === 'tee' ? { fit: s.fit } : {}) })).filter(s => s.to) }))
    .filter(c => c.start && c.steps.length);
  const one = v => (typeof v === 'string' && v.length < 200 ? v : '');
  const fermenters = (Array.isArray(sent.fermenters) ? sent.fermenters : []).filter(f => keys.has(f?.vessel)).map(f => ({ vessel: f.vessel,
    cooling: one(f.cooling), heating: one(f.heating), feed: one(f.feed), ret: one(f.ret), coolPump: one(f.coolPump), warmPump: one(f.warmPump),
    probe: one(f.probe), pressure: one(f.pressure), source: f.source === 'you' ? 'you' : 'guess' }));
  const places = {};
  for (const [k, v] of Object.entries(sent.places && typeof sent.places === 'object' ? sent.places : {})) if (Number.isFinite(v?.x) && Number.isFinite(v?.y)) places[String(k).slice(0, 120)] = { x: Math.round(v.x * 1000) / 1000, y: Math.round(v.y * 1000) / 1000 };
  return { parts: p2, chains, fermenters, places };
}

// the item pages' answers, kept only when they make sense (OakBarn Brewery, 2026-11-08)
function partsAnswers(parts, conv) {
  const names = new Set((conv.elements ?? []).map(e => e.name)), out = {};
  for (const page of PART_PAGES) {
    const a = parts?.[page.kind]; if (!a || typeof a !== 'object') continue;
    const items = (Array.isArray(a.items) ? a.items : []).filter(i => names.has(i?.name)).slice(0, 500).map(i => ({ name: i.name, ...cleanPartDetails(page.kind, i) }));
    const extras = (Array.isArray(a.extras) ? a.extras : []).slice(0, 100).map((x, n) => ({ name: String(x?.name ?? '').trim().slice(0, 40) || `${page.one} ${items.length + n + 1}`, ...cleanPartDetails(page.kind, x) }));
    out[page.kind] = { count: items.length + extras.length, items, extras };
  }
  return out;
}
// the Control Type columns (OakBarn Brewery, 2026-11-08): a Heating Element (Rule 6.19) or a Cool / Warm Pump (Rule 6.21) starts with
// its Primary method, and every other method ticked gets its one-click spot; the rest are kept in itemDetails for the record
function applyMethods(elements, details) {
  const by = new Map((elements ?? []).map(e => [e.name, e]));
  for (const kind of ['heater', 'pump']) for (const it of details?.[kind]?.items ?? []) {
    const el = by.get(it.name); if (!el || !Array.isArray(it.methods)) continue;
    const keys = isHeatElem(el) ? HEAT_KEYS : isCoolPump(el) ? PUMP_METHOD_KEYS : null; if (!keys) continue;
    if (keys.includes(it.primary)) el.heatMethod = it.primary;
    for (const k of keys) if (k !== 'onoff') { if (it.methods.includes(k)) el['methodSpot_' + k] = true; else delete el['methodSpot_' + k]; }
  }
}
// the Hydrometers page (Rule 6.25): a BruControl Hydrometer Input is a Skynet Hydrometer Device; the Template, Tilt Color and Hardware
// ID picked on the page go onto it (the Panel's Properties show the same three)
function applyHydros(elements, details) {
  const by = new Map((elements ?? []).map(e => [e.name, e]));
  for (const it of details?.hydro?.items ?? []) {
    const el = by.get(it.name); if (el?.type !== 'hydrometer') continue;
    if (HYDRO_MODELS[it.hydro]) { el.model = it.hydro; el.connection = HYDRO_MODELS[it.hydro].conns[0]; el.precision = HYDRO_MODELS[it.hydro].decimals; }
    if (it.color) el.color = it.color;
    if (it.hwId) el.hwId = it.hwId;
  }
}
async function api(req, res, p, q) {
  const m = req.method;
  if (p === '/api/ping' && m === 'GET') return json(res, 200, { ok: true });     // the window checks the Importer is still running
  if (p === '/api/start' && m === 'GET') {
    // Always Documents\BruControl first (Fritz, 2026-11-06); the person points elsewhere when their config is not there
    const home = CANDIDATES[0] ?? '';
    return json(res, 200, { version: readVersion(ROOT).version || '', windows: WIN, importFolder: IMPORT_DIR, defaultFolder: home, folder: home, lastFolder: settings.folder ?? '', file: settings.file ?? '' });
  }
  if (p === '/api/configs' && m === 'GET') return json(res, 200, findConfigs(resolveFolder(q.get('folder') ?? '')));
  if (p === '/api/folder' && m === 'POST') {
    const { folder } = await body(req);
    if (typeof folder !== 'string' || !folder.trim()) return json(res, 400, { error: 'No folder given.' });
    const list = findConfigs(resolveFolder(folder));
    // only a folder that is there is remembered; a settings file that cannot be written never stops the Look
    if (list.exists) { settings.folder = list.folder; try { saveSettings(SETTINGS, settings); } catch { /* not remembered */ } }
    return json(res, 200, list);
  }
  // One Windows box at a time: a second click while one is open says so, instead of opening another one behind it
  if ((p === '/api/pick-file' || p === '/api/pick-folder') && m === 'POST') {
    const { start } = await body(req);
    if (boxOpen) return json(res, 200, { picked: '', busy: true });
    boxOpen = true;
    try { return json(res, 200, p === '/api/pick-file' ? await pickFile(resolveFolder(start) || CANDIDATES[0] || '') : await pickFolder(resolveFolder(start ?? ''))); }
    finally { boxOpen = false; }
  }
  if (p === '/api/peek' && m === 'GET') {
    const file = q.get('file') ?? '';
    if (!isConfig(file)) return json(res, 400, { error: 'That is not a BruControl config file (.brucfg) or backup (.bak).' });
    try {
      const st = fs.statSync(file);
      if (st.size > MAX_CONFIG) return json(res, 400, { error: 'That file is too big to be a BruControl config file.' });
      return json(res, 200, summarize(fs.readFileSync(file, 'utf8')));
    } catch (e) { return json(res, 400, { error: e.code === 'ENOENT' ? 'That file is not there any more.' : e.message }); }
  }
  if (p === '/api/choose' && m === 'POST') {
    const { file } = await body(req);
    if (!isConfig(file) || !fs.existsSync(file)) return json(res, 400, { error: 'Pick a BruControl config file (.brucfg) or backup (.bak) from the list.' });
    settings.file = file; saveSettings(SETTINGS, settings);
    return json(res, 200, { ok: true, file });
  }
  // Make the Import Copy of the config file and convert the copy (Fritz, 2026-11-06). The first pass brings in the items on a
  // board port and the Tabs; everything else is a Placeholder on its Tab. names: 'skynet' (default) or 'bru' (Rule 15.1).
  if (p === '/api/convert' && m === 'POST') {
    const { file, names, copyMedia, ids, units, labels, shows, styles, links } = await body(req);
    if (!isConfig(file) || !fs.existsSync(file)) return json(res, 400, { error: 'Pick a BruControl config file (.brucfg) or backup (.bak) first.' });
    if (fs.statSync(file).size > MAX_CONFIG) return json(res, 400, { error: 'That file is too big to be a BruControl config file.' });
    // any .bak can be picked, so check it really is a BruControl config file inside before the Import Copy is made
    if (isBackupName(file) && !/<Configuration[\s>]/.test(fs.readFileSync(file, 'utf8').slice(0, 4096))) return json(res, 400, { error: 'That backup (.bak) is not a BruControl config file inside.' });
    const copy = makeImportCopy(file, IMPORT_DIR);
    // Pictures and sounds (Fritz, 2026-11-06): their paths are imported and the files stay where they were, so BruControl keeps
    // working. Each one is also COPIED, never moved (always, OakBarn Brewery 2026-11-08: "just make the copies"), to media\Images\User or media\sounds\User, for a
    // move to a Pi or another computer. A copy already there is kept, never written over.
    const media = (from, to) => {
      try {
        if (!fs.statSync(from).isFile()) return false;
        if (!to) return true;
        const dest = path.join(MEDIA_DIR, ...to.split('/'));
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        if (!fs.existsSync(dest)) fs.copyFileSync(from, dest, fs.constants.COPYFILE_EXCL);
        return true;
      } catch { return false; }
    };
    const r = importBruControl(fs.readFileSync(copy, 'utf8'), { names: names === 'bru' ? 'bru' : 'skynet', copy: copyMedia !== false, media,
      ids: ids && typeof ids === 'object' ? Object.fromEntries(Object.entries(ids).filter(([k, v]) => typeof v === 'string' && /^[A-Za-z]{1,4}$/.test(v.trim())).slice(0, 50)) : {},
      // the user's own Labels from the items page, by BruControl element ID (OakBarn Brewery, 2026-11-08)
      labels: labels && typeof labels === 'object' ? Object.fromEntries(Object.entries(labels).filter(([k, v]) => /^[\w-]{1,64}$/.test(k) && typeof v === 'string' && v.trim()).map(([k, v]) => [k, v.trim().slice(0, 40)]).slice(0, 2000)) : {},
      // the Show boxes (OakBarn Brewery, 2026-11-08): ticked = the Label is shown on the Tab, by BruControl element ID
      shows: shows && typeof shows === 'object' ? Object.fromEntries(Object.entries(shows).filter(([k, v]) => /^[\w-]{1,64}$/.test(k) && typeof v === 'boolean').slice(0, 2000)) : {},
      // a Boolean Widget's Style and Linked Device from the Switches page (Rule 1.20), by BruControl element ID
      styles: styles && typeof styles === 'object' ? Object.fromEntries(Object.entries(styles).filter(([k, v]) => /^[\w-]{1,64}$/.test(k) && typeof v === 'string' && /^\w{1,20}$/.test(v)).slice(0, 2000)) : {},
      links: links && typeof links === 'object' ? Object.fromEntries(Object.entries(links).filter(([k, v]) => /^[\w-]{1,64}$/.test(k) && typeof v === 'string' && /^[\w-]{1,64}$/.test(v)).slice(0, 2000)) : {} });
    // the Look (Rule 2.39): the Skynet Look closest to the BruControl theme, Office Black when it is not found
    const bt = findBruControlTheme([...CANDIDATES, path.dirname(file)]);
    const look = themeOf(bruThemeToLook(bt?.theme));
    r.conv.theme = look.key;
    for (const w of r.conv.workspaces ?? []) if (!w.color && !w.style) Object.assign(w, newTabLook(look.key));     // each Tab is new: the Look's Tab colors
    // the item pages (Pumps, Heaters, Probes, Valves, Flow Meters, Other): each item's kind and first guesses (OakBarn Brewery, 2026-11-08)
    { const byName = new Map((r.conv.elements ?? []).map(e => [e.name, e]));
      for (const it of r.report.portItems ?? []) { const el = byName.get(it.name); it.kind = itemKind(el); it.guess = guessPartDetails(el ?? {}, it.kind); } }
    r.conv.units = units === 'Metric' ? 'Metric' : 'US';      // asked at the start (OakBarn Brewery, 2026-11-08)
    r.report.units = r.conv.units;
    r.report.look = { bru: bt?.theme || '', file: bt?.file || '', key: look.key, name: look.name };
    // Connect your brewery (Fritz, 2026-11-07): the parts, and the first guesses from the names, the Scripts and the pictures
    const clues = readClues(fs.readFileSync(copy, 'utf8'));
    const parts = findParts(r.conv, clues.scripts);
    const details = findVesselDetails(r.conv, clues.scripts, parts.vessels);
    for (const v of parts.vessels) v.details = details[v.key];
    const fermenters = guessFermenters(parts, r.conv, clues.scripts);
    const pics = Object.fromEntries(Object.entries(clues.backgrounds).filter(([, b]) => { try { return fs.statSync(b.path).isFile(); } catch { return false; } }));
    const chains = guessChains(parts, { backgrounds: pics, fermenters });
    const connect = { parts, probes: findProbes(r.conv), heaters: findHeaters(r.conv), fermenters, chains, pictures: Object.fromEntries(Object.entries(pics).map(([t, b]) => [t, { w: b.w, h: b.h }])),
      tabs: (r.conv.workspaces ?? []).map(w => ({ name: w.name, width: w.width, height: w.height })), openings: OPENINGS, cooling: COOLING, heating: HEATING, aiSites: AI_SITES };
    converted = { file, copy, ...r, clues: { ...clues, backgrounds: pics }, connect };
    return json(res, 200, { copy, ...r.report, warnings: r.conv.warnings, connect });
  }
  // The answers so far (OakBarn Brewery, 2026-11-08: "Make the user's answers and settings persistent, so they can close and come back
  // later"): kept in Brewing\Import\progress.json by config file, and offered again when that file is picked
  // The Panel's own settings on this computer (OakBarn Brewery, 2026-11-09: "both the Installer and the Skynet Panel will be on the same
  // Windows Machine, they can share some of the files so we don't need to duplicate entries"): its Default settings (Rule 2.42) give the
  // units and the Default pipe size, read only, so the brewer does not type them twice. Nothing of the Panel's is changed.
  if (p === '/api/panel-defaults' && m === 'GET') {
    let d = {};
    try { d = JSON.parse(fs.readFileSync(process.env.BREWPANEL_CONFIG ?? path.join(ROOT, 'config', 'brewery.json'), 'utf8')).brewDefaults ?? {}; } catch { /* no Panel settings yet */ }
    return json(res, 200, { units: d.units === 'Metric' || d.units === 'US' ? d.units : '', pipeSize: /^\d+(\.\d+)?$/.test(String(d.defPipeSize ?? '')) ? String(d.defPipeSize) : '' });
  }
  if (p === '/api/progress' && m === 'GET') {
    const all = readProgress(), f = q.get('file') ?? '';
    return json(res, 200, all[f.toLowerCase()] ?? {});
  }
  if (p === '/api/progress' && m === 'POST') {
    const { file, data, clear } = await body(req);
    if (typeof file !== 'string' || !isConfig(file)) return json(res, 400, { error: 'No config file given.' });
    const all = readProgress(), key = file.toLowerCase();
    if (clear) delete all[key];
    else if (data && typeof data === 'object') all[key] = { saved: new Date().toISOString(), data };
    // only the 20 newest are kept
    const keep = Object.entries(all).sort((a, b) => String(b[1].saved).localeCompare(String(a[1].saved))).slice(0, 20);
    const text = JSON.stringify(Object.fromEntries(keep));
    if (text.length > 8e6) return json(res, 400, { error: 'The answers are too big to keep.' });
    fs.mkdirSync(IMPORT_DIR, { recursive: true });
    fs.writeFileSync(PROGRESS, text);
    return json(res, 200, { ok: true });
  }
  // Every Skynet vessel format (the Vessel Templates), for "which template matches your vessel the best" (OakBarn Brewery, 2026-11-08)
  if (p === '/api/vessel-templates' && m === 'GET') {
    const dir = path.join(ROOT, 'templates', 'vessel'), out = [];
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json')).sort()) {
      try {
        const t = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        if ((t.vesselType || 'vessel') !== 'vessel') continue;             // vessels only, not chillers, coils or filters
        out.push({ id: f.slice(0, -5), name: f.slice(0, -5).replace(/_/g, ' '), image: t.image ? '/media/' + t.image : '', vtype: t.vtype || '',
          electric: /electric/i.test(f) || !!t.integrated, integrated: !!t.integrated, widget: !!t.vwidget });
      } catch { /* a broken Template is left out */ }
    }
    return json(res, 200, out);
  }
  // The guide picture for Connect your brewery: the background picture BruControl had on that workspace (it stays where it is)
  if (p === '/api/picture' && m === 'GET') {
    const b = converted?.clues?.backgrounds?.[q.get('tab') ?? ''];
    if (!b) return json(res, 404, { error: 'That Tab had no background picture.' });
    return sendFile(res, b.path);
  }
  // Save the Schema into Brewing\Import, for the Panel to open (Schema.json > Open a Schema file)
  if (p === '/api/save' && m === 'POST') {
    const { file, name, connect, keepEmpty, keepTabs, tabsPicked, parts, keepIfs } = await body(req);
    if (!converted || converted.file !== file) return json(res, 400, { error: 'Go back to Names and click Next first, so the config file is converted.' });
    // an Interface (board) with no items comes in only when its tick box was ticked (Fritz, 2026-11-08)
    // what was built on the Build page comes back in (its Tabs, Devices and Widgets), when it was made from this same Import Copy
    const built = readBuild(converted.copy);
    const base = built ? { ...converted.conv, ...Object.fromEntries(SCHEMA_KEYS.map(k => [k, built[k] ?? []])) } : converted.conv;
    const { conv: conv1, dropped } = Array.isArray(keepIfs) ? dropEmptyInterfaces(base, keepIfs, { all: true }) : dropEmptyInterfaces(base, keepEmpty);
    // a Tab with no items comes in only when ticked; its Placeholders stay out with it (Fritz, 2026-11-08)
    // and since 2026-11-08 every Tab has an Import Tab box (empty ones start unticked), so an unticked Tab with items stays out too
    const { conv, dropped: tabsOut, holdersDropped, itemsDropped } = dropEmptyTabs(conv1, keepTabs, { all: tabsPicked === true });
    const out = buildSchemaFile(conv, { name: name || path.basename(file), source: path.basename(file), draft: true, version: readVersion(ROOT).version || '' });
    out.importCopy = path.basename(converted.copy);
    out.importReport = { stage: 'new import, step 1: Interfaces, Tabs, items on a board port and Placeholders', names: converted.report.names, renames: converted.report.renames };
    // Connect your brewery: what is connected to what, kept in the file for the step that builds the Vessels and draws the pipes
    const cn = connectAnswers(connect, converted.connect);
    out.connect = connectReport(cn);
    out.connect.units = converted.conv.units || 'US';
    // the item pages' answers (OakBarn Brewery, 2026-11-08): per kind, how many, each found item's details, and the empty slots added
    out.itemDetails = partsAnswers(parts, conv);      // US or Metric, asked at the start: the vessels' sizes use it
    applyMethods(out.schema.elements, out.itemDetails);
    applyHydros(out.schema.elements, out.itemDetails);
    const nLinks = out.connect.links.length, nLoose = out.connect.loose.length;
    if (tabsOut.length) out.warnings = [...out.warnings, `${tabsOut.length} Tab(s) were left unticked and not imported${itemsDropped ? `, with their ${itemsDropped} item(s)` : ''}${holdersDropped ? `${itemsDropped ? ' and' : ', with their'} ${holdersDropped} Placeholder(s)` : ''}: ${tabsOut.join(', ')}.`];
    if (dropped.length) out.warnings = [...out.warnings, `${dropped.length} Interface(s) (board(s)) with no items were not imported: ${dropped.join(', ')}.`];
    out.warnings = [...out.warnings, `Connect your brewery: ${nLinks} connection(s) between ${cn.parts.vessels.length} vessel(s), pumps and valves are kept in this file${nLoose ? `; ${nLoose} pump(s) or valve(s) are not joined yet` : ''}. The pipes and hoses are drawn when the Vessels are built (a later Import step).`];
    fs.mkdirSync(IMPORT_DIR, { recursive: true });
    const fname = importFileName(out.schema.name);
    fs.writeFileSync(path.join(IMPORT_DIR, fname), JSON.stringify(out, null, 2));
    return json(res, 200, { folder: IMPORT_DIR, file: fname, name: out.schema.name, tabs: out.schema.workspaces.length, items: out.schema.elements.length,
      interfaces: out.schema.devices.length, placeholders: out.schema.graphics.length, warnings: out.warnings.length, links: out.connect.links.length, loose: out.connect.loose.length });
  }
  if (p === '/api/open-import' && m === 'POST') {
    if (!WIN) return json(res, 200, { ok: false });
    fs.mkdirSync(IMPORT_DIR, { recursive: true });
    spawn('explorer.exe', [IMPORT_DIR], { detached: true, stdio: 'ignore' }).on('error', () => {}).unref();
    return json(res, 200, { ok: true });
  }
  // open the Build page: the imported Tabs, Devices and Widgets in the Skynet Panel's own Build page (kept while the same file is imported)
  if (p === '/api/build/open' && m === 'POST') {
    if (!converted) return json(res, 400, { error: 'Go back to Names and click Next first, so the config file is converted.' });
    const { keepTabs, tabsPicked } = await body(req);
    if (!readBuild(converted.copy)) {
      const { conv } = dropEmptyTabs(converted.conv, keepTabs, { all: tabsPicked === true });
      stopBuild(); writeBuild(conv, converted.copy);
    }
    await startBuild();
    return json(res, 200, { url: `http://localhost:${BUILD_PORT}/import-build?key=${build.key}` });
  }
  // the Build Tab buttons and their hover help, read from the Panel's own page (public/index.html), for the pop-up on each Build Tab page
  if (p === '/api/build/buttons' && m === 'GET') return json(res, 200, buildButtons());
  if (p === '/api/close' && m === 'POST') {
    json(res, 200, { ok: true });
    setTimeout(() => { stopBuild(); closeAppWindow({ profile: importerProfileDir() }); process.exit(0); }, 300);
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
    // the Panel's own look, icon and hover help (one source, Rules 15.4 and 2.38)
    // the Connect your brewery song and rhyme (Fritz's own files, free to use) from the Panel's media\sounds\Skynet
    // the Skynet drawings of a vessel, a pump and a valve for the picture screen (read only, Skynet's own pictures)
    if (/^\/media\/Images\/Skynet\/[\w-]+\/[\w.-]+\.(svg|png)$/.test(p)) return sendFile(res, path.join(ROOT, ...p.slice(1).split('/')));
    if (/^\/sounds\/Skynet\/[\w.-]+\.mp3$/.test(p)) return sendFile(res, path.join(ROOT, 'media', ...p.slice(1).split('/')));
    if (['/style.css', '/favicon.svg', '/favicon.ico', '/hoverhelp.js', '/naming.js', '/semi.js', '/vesselbuilder.js', '/links.js', '/heatmethod.js', '/hydrometer.js', '/themes.js', '/themeboot.js'].includes(p)) return sendFile(res, path.join(PUBLIC, p.slice(1)));
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
