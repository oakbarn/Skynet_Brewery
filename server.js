// OakBarn Brew Panel - server
// Run:  node --no-warnings server.js   then open http://<this computer>:8080 in any browser
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Store, cleanName, ELEMENT_TYPES, VK_KINDS, VAPI_KINDS, isApiVar } from './lib/store.js';
import { Engine } from './lib/engine.js';
import { Logger, LOG_MODES } from './lib/logger.js';
import { Hardware } from './lib/hardware.js';
import { importBeerXml } from './lib/beerxml.js';
import { convertBruControl, applyBruControl } from './lib/brucontrol.js';
import { Control } from './lib/control.js';
import { plain, toStr } from './lib/values.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CONFIG = path.resolve(process.env.BREWPANEL_CONFIG ?? path.join(ROOT, 'config', 'brewery.json'));
const DATA = path.resolve(process.env.BREWPANEL_DATA ?? path.join(ROOT, 'data'));
const SCRIPTS = path.resolve(process.env.BREWPANEL_SCRIPTS ?? path.join(ROOT, 'scripts'));
const PUBLIC = path.join(ROOT, 'public');

const store = new Store(CONFIG, DATA);
store.load();
const logger = new Logger(store, path.join(DATA, 'brewlog.db'));
const engine = new Engine(store, SCRIPTS, logger);
const hw = new Hardware(store);
hw.start();
const control = new Control(store);
control.start();
setInterval(() => store.tickTimers(0.1), 100);
setInterval(() => store.pollFiles(), 1000);            // Long String vKonstants follow their text files
store.on('warn', m => engine.print('system', m));
engine.on('started', n => logger.scriptStarted(n));

// ---------------- live updates to browsers (Server-Sent Events) ----------------
const clients = new Set();
let pending = {};
function broadcast(type, data) {
  const msg = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) res.write(msg);
}
function flush() { if (Object.keys(pending).length) { broadcast('values', pending); pending = {}; } }
store.on('change', (name, prop, v) => {
  // a Momentary button's short "true" is sent at once so every screen sees the flash
  if (v === false && pending[name]?.[prop] === true) flush();
  (pending[name] ??= {})[prop] = plain(v);
});
setInterval(flush, 150);

// Push Buttons (vKonstant) are on only while a finger or mouse holds them. The browser repeats "down"
// every 0.5 s while held; if it goes quiet (closed tab, lost WiFi) the button lets go by itself.
const holds = new Map();
function hold(name, down) {
  clearTimeout(holds.get(name)); holds.delete(name);
  if (down) holds.set(name, setTimeout(() => { holds.delete(name); store.setProp(name, 'value', false, 'ui'); }, 1500));
  store.setProp(name, 'value', !!down, 'ui');
}
engine.on('scripts', () => { clearTimeout(engine._bt); engine._bt = setTimeout(() => broadcast('scripts', engine.list()), 100); });
engine.on('print', e => broadcast('print', e));
engine.on('show', ws => broadcast('show', ws));
store.on('config', () => broadcast('config', {}));
store.on('devices', () => broadcast('devices', hw.list()));
setInterval(() => { for (const res of clients) res.write(': ping\n\n'); }, 20000);

// ---------------- helpers ----------------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.bmp': 'image/bmp', '.ico': 'image/x-icon',
  '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4',
};
function send(res, code, body, type = 'application/json') {
  const data = type === 'application/json' ? JSON.stringify(body) : body;
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
  res.end(data);
}
const ok = (res, body = { ok: true }) => send(res, 200, body);
const fail = (res, code, msg) => send(res, code, { ok: false, error: msg });
function readBody(req, limit = 10 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { reject(new Error('Body too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
async function jsonBody(req) { const t = await readBody(req); return t ? JSON.parse(t) : {}; }

function sendFile(req, res, file) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return fail(res, 404, 'File not found: ' + file);
    const type = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
    const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');      // Safari needs ranges for audio
    if (range) {
      const start = range[1] ? +range[1] : 0, end = range[2] ? Math.min(+range[2], st.size - 1) : st.size - 1;
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
      fs.createReadStream(file).pipe(res);
    }
  });
}

// Images, sounds and text files are given by PATH. Only files inside the folders listed in config "mediaRoots" are served.
const resolveMedia = p => store.resolveMedia(p);

// BruControl ran on Windows, where file names ignore upper/lower case. Find "Wave/X.WAV" as "wave/x.wav" too.
function findMedia(p) {
  const full = resolveMedia(p);
  if (!full || fs.existsSync(full)) return full;
  const root = mediaRoots().find(r => full.startsWith(r + path.sep));
  if (!root) return full;
  let cur = root;
  for (const part of path.relative(root, full).split(path.sep)) {
    let names; try { names = fs.readdirSync(cur); } catch { return full; }
    const hit = names.find(n => n === part) ?? names.find(n => n.toLowerCase() === part.toLowerCase());
    if (!hit) return full;
    cur = path.join(cur, hit);
  }
  return cur;
}

function apiAllowed(req, url) {
  const key = store.config.apiKey;
  if (!key || req.method === 'GET') return true;
  return req.headers['x-api-key'] === key || url.searchParams.get('key') === key;
}

// The API has Globals and vAPI variables only (never Shared or vKonstant)
const apiVars = () => store.list().filter(isApiVar).map(e => ({ name: e.name, type: e.dataType, class: e.type, value: plain(store.getProp(e.name, 'value')), units: e.units ?? '' }));

function csv(rows) {
  const q = s => `"${String(s ?? '').replaceAll('"', '""')}"`;
  return 'time,name,value,reason\n' + rows.map(r => [new Date(r.ts).toISOString(), q(r.name), q(r.value), r.reason].join(',')).join('\n');
}

// ---------------- routes ----------------
async function route(req, res) {
  const url = new URL(req.url, 'http://x');
  const p = decodeURIComponent(url.pathname);
  const m = req.method;
  if (m === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE', 'Access-Control-Allow-Headers': 'Content-Type,X-API-Key' }); return res.end(); }

  // ===== Public API: Globals and vAPI only (Shared and vKonstant variables are never exposed) =====
  if (p.startsWith('/api/')) {
    if (!apiAllowed(req, url)) return fail(res, 401, 'Missing or wrong X-API-Key');
    if ((p === '/api/globals' || p === '/api/vapi') && m === 'GET') return ok(res, apiVars());
    if ((p === '/api/globals' || p === '/api/vapi') && (m === 'POST' || m === 'PUT')) {
      const body = await jsonBody(req); const done = [], errors = [];
      for (const [n, v] of Object.entries(body)) {
        const el = store.get(n);
        if (!isApiVar(el)) { errors.push(`${n}: not a Global or vAPI`); continue; }
        try { store.setProp(n, 'value', v, 'api'); done.push(n); } catch (e) { errors.push(`${n}: ${e.message}`); }
      }
      return ok(res, { ok: !errors.length, set: done, errors });
    }
    let g = /^\/api\/(?:globals|vapi)\/(.+)$/.exec(p);
    if (g) {
      const n = cleanName(g[1]), el = store.get(n);
      if (!isApiVar(el)) return fail(res, 404, `No Global or vAPI named "${n}"`);
      if (m === 'GET') return ok(res, { name: n, type: el.dataType, class: el.type, value: plain(store.getProp(n, 'value')) });
      if (m === 'PUT' || m === 'POST') {
        const t = await readBody(req); let v = t;
        try { const j = JSON.parse(t); v = (j && typeof j === 'object' && 'value' in j) ? j.value : j; } catch { }
        store.setProp(n, 'value', v, 'api');
        return ok(res, { name: n, value: plain(store.getProp(n, 'value')) });
      }
    }
    g = /^\/api\/log\/(.+)$/.exec(p);
    if (g && m === 'POST') { logger.logNow(g[1], 'api'); return ok(res); }
    if ((p === '/api/log' || p === '/api/log.csv') && m === 'GET') {
      const rows = logger.query(Object.fromEntries(url.searchParams));
      return p.endsWith('.csv') ? send(res, 200, csv(rows), 'text/csv; charset=utf-8') : ok(res, rows);
    }
    if (p === '/api/import/beerxml' && m === 'POST') {
      const xml = await readBody(req);
      return ok(res, { ok: true, ...importBeerXml(xml, store, store.config.beerxml) });
    }
    return fail(res, 404, 'Unknown API route');
  }

  // ===== Browser UI =====
  if (p === '/ui/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 2000\n\n');
    clients.add(res); req.on('close', () => clients.delete(res));
    return;
  }
  if (p === '/ui/state' && m === 'GET') {
    return ok(res, { config: store.config, values: store.snapshot(), scripts: engine.list(), devices: hw.list(), types: ELEMENT_TYPES, vkKinds: VK_KINDS, vapiKinds: VAPI_KINDS, logModes: LOG_MODES, console: engine.console.slice(-300) });
  }
  if (p === '/ui/set' && m === 'POST') {
    const { name, prop, value } = await jsonBody(req);
    const el = store.get(name);
    if (!el) return fail(res, 404, `No element "${name}"`);
    if (['digitalIn', 'temperature', 'analogIn'].includes(el.type) && el.device && hw.devices.get(el.device)?.type !== 'simulator') return fail(res, 400, `"${name}" is a hardware input`);
    store.setProp(name, prop, value, 'ui');
    return ok(res);
  }
  if (p === '/ui/hold' && m === 'POST') {
    const { name, down } = await jsonBody(req);
    const el = store.get(name);
    if (!el || el.type !== 'vKonstant' || el.kind !== 'pushbutton') return fail(res, 400, `"${name}" is not a Push Button`);
    hold(el.name, down);
    return ok(res);
  }
  if (p === '/ui/layout' && m === 'PUT') {
    const body = await jsonBody(req);
    store.saveLayout(body);
    if (body.devices) { store.config.devices = body.devices; store.writeConfig(); hw.restart(); }
    return ok(res);
  }
  if (p === '/ui/settings' && m === 'PUT') {
    const body = await jsonBody(req);
    for (const k of ['mediaRoots', 'apiKey', 'autostart', 'beerxml', 'title']) if (k in body) store.config[k] = body[k];
    store.writeConfig(); broadcast('config', {});
    return ok(res);
  }
  if (p === '/ui/import/beerxml' && m === 'POST') return ok(res, { ok: true, ...importBeerXml(await readBody(req), store, store.config.beerxml) });
  if (p === '/ui/import/brucontrol' && m === 'POST') {
    const q = url.searchParams;
    const conv = convertBruControl(await readBody(req, 64 * 1024 * 1024), { mediaFolder: q.get('media') ?? 'oakbarn', simulate: q.get('simulate') !== '0' });
    const missingMedia = conv.media.filter(f => { const full = findMedia(f); return !full || !fs.existsSync(full); });
    const out = { summary: conv.summary, warnings: conv.warnings, missingMedia, mediaCount: conv.media.length, autostart: conv.autostart };
    if (q.get('preview') === '1') return ok(res, { ok: true, preview: true, ...out });
    const applied = applyBruControl(conv, { store, engine, mode: q.get('mode') === 'merge' ? 'merge' : 'replace', overwriteScripts: q.get('overwrite') !== '0' });
    hw.restart();
    return ok(res, { ok: true, ...out, ...applied });
  }
  if (p === '/ui/ports' && m === 'GET') return ok(res, await hw.listPorts());
  if (p === '/ui/log/names' && m === 'GET') return ok(res, logger.names());
  let s = /^\/ui\/log\/(once|now)\/(.+)$/.exec(p);
  if (s && m === 'POST') { if (s[1] === 'once') logger.arm(s[2]); else logger.logNow(s[2], 'ondemand'); return ok(res); }

  // scripts
  if (p === '/ui/scripts' && m === 'GET') return ok(res, engine.list());
  if (p === '/ui/scripts/check' && m === 'POST') return ok(res, engine.check(await readBody(req)));
  s = /^\/ui\/scripts\/([^/]+)(?:\/(start|stop|rename))?$/.exec(p);
  if (s) {
    const name = s[1], act = s[2];
    if (act === 'start' && m === 'POST') return ok(res, engine.start(name, 'user'));
    if (act === 'stop' && m === 'POST') return ok(res, { ok: engine.stop(name) });
    if (act === 'rename' && m === 'POST') { const { to } = await jsonBody(req); engine.rename(name, to); return ok(res); }
    if (!act && m === 'GET') { if (!engine.exists(name)) return fail(res, 404, 'No script ' + name); return send(res, 200, engine.read(name), 'text/plain; charset=utf-8'); }
    if (!act && m === 'PUT') { const text = await readBody(req); engine.write(name, text); return ok(res, engine.check(text)); }
    if (!act && m === 'DELETE') { engine.remove(name); return ok(res); }
  }
  if (p === '/ui/stopall' && m === 'POST') { engine.stopAll(); return ok(res); }

  // media files by path
  if (p === '/media' && m === 'GET') {
    const f = findMedia(url.searchParams.get('path') ?? '');
    if (!f) return fail(res, 403, 'That path is not inside a media folder (see Settings > Media folders)');
    return sendFile(req, res, f);
  }

  // static UI
  if (m === 'GET') {
    const f = path.join(PUBLIC, p === '/' ? 'index.html' : path.normalize(p).replace(/^([\\/])+/, ''));
    if (!f.startsWith(PUBLIC)) return fail(res, 403, 'Forbidden');
    return sendFile(req, res, f);
  }
  fail(res, 404, 'Not found');
}

const server = http.createServer((req, res) => {
  route(req, res).catch(e => { if (!res.headersSent) fail(res, 400, e.message); });
});
const PORT = Number(process.env.PORT ?? store.config.port ?? 8080);
server.listen(PORT, () => {
  console.log(`Brew Panel running:  http://localhost:${PORT}`);
  console.log(`Config:  ${CONFIG}\nScripts: ${SCRIPTS}\nData:    ${DATA}`);
  for (const n of store.config.autostart ?? []) { try { engine.start(n, 'autostart'); } catch (e) { console.error(e.message); } }
});

function shutdown() { console.log('Stopping...'); engine.stopAll(); control.stop(); store.persistNow(); hw.stop(); logger.close(); process.exit(0); }
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
