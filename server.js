// OakBarn Brew Panel - server
// Run:  node --no-warnings server.js   then open http://<this computer>:8080 in any browser
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Store, cleanName, ELEMENT_TYPES } from './lib/store.js';
import { Engine } from './lib/engine.js';
import { Logger, LOG_MODES } from './lib/logger.js';
import { Hardware } from './lib/hardware.js';
import { importBeerXml } from './lib/beerxml.js';
import { plain, toStr } from './lib/values.js';
import { Auth, COOKIE, ROLES, ROLE_INFO, roleAtLeast, isPrivateAddress, parseCookies } from './lib/auth.js';

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
const auth = new Auth(DATA);
hw.start();
setInterval(() => store.tickTimers(0.1), 100);
store.on('warn', m => engine.print('system', m));

// ---------------- live updates to browsers (Server-Sent Events) ----------------
const clients = new Map();       // response -> session token (closed when the session ends)
let pending = {};
function broadcast(type, data) {
  const msg = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients.keys()) res.write(msg);
}
store.on('change', (name, prop, v) => { (pending[name] ??= {})[prop] = plain(v); });
setInterval(() => { if (Object.keys(pending).length) { broadcast('values', pending); pending = {}; } }, 150);
engine.on('scripts', () => { clearTimeout(engine._bt); engine._bt = setTimeout(() => broadcast('scripts', engine.list()), 100); });
engine.on('print', e => broadcast('print', e));
engine.on('show', ws => broadcast('show', ws));
store.on('config', () => broadcast('config', {}));
store.on('devices', () => broadcast('devices', hw.list()));
function dropEndedSessions() { for (const [res, token] of clients) if (!auth.check(token)) { res.end(); clients.delete(res); } }
setInterval(() => { dropEndedSessions(); for (const res of clients.keys()) res.write(': ping\n\n'); }, 20000);

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

// Images and sounds are given by PATH. Only files inside the folders listed in config "mediaRoots" are served.
function mediaRoots() { return (store.config.mediaRoots ?? ['./media']).map(r => path.resolve(path.dirname(CONFIG), '..', r)); }
function resolveMedia(p) {
  const roots = mediaRoots();
  const full = path.isAbsolute(p) ? path.resolve(p) : path.resolve(roots[0], p);
  const norm = s => process.platform === 'win32' ? s.toLowerCase() : s;
  if (!roots.some(r => norm(full).startsWith(norm(r + path.sep)) || norm(full) === norm(r))) return null;
  return full;
}

function apiKeyOk(req, url) {
  const key = store.config.apiKey;
  return !!key && (req.headers['x-api-key'] === key || url.searchParams.get('key') === key);
}

// ---------------- login ----------------
// Who may do what. viewer < operator < admin. New routes default to viewer for GET and admin for changes.
function needRole(p, m) {
  if (p === '/ui/set' || p === '/ui/stopall' || p === '/ui/import/beerxml' || /^\/ui\/log\/(once|now)\//.test(p) || /^\/ui\/scripts\/[^/]+\/(start|stop)$/.test(p)) return 'operator';
  if (p === '/ui/ports') return 'admin';
  return m === 'GET' ? 'viewer' : 'admin';
}
const PUBLIC_FILES = new Set(['/login.html', '/login.js', '/style.css', '/favicon.ico']);
const clientIp = req => req.socket.remoteAddress ?? '';
// HTTPS through a proxy on this computer (for example "tailscale serve")
const viaHttps = req => req.headers['x-forwarded-proto'] === 'https' && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(clientIp(req));
// Changes must come from a page served by this panel, not from another web site (stops cross-site tricks)
function sameOrigin(req) {
  const o = req.headers.origin;
  if (!o || o === 'null') return !o;
  try { const h = new URL(o).host; return h === req.headers.host || h === req.headers['x-forwarded-host']; } catch { return false; }
}

const globalsOnly = () => store.list('global').map(e => ({ name: e.name, type: e.dataType, value: plain(store.getProp(e.name, 'value')), units: e.units ?? '' }));

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

  const token = parseCookies(req.headers.cookie)[COOKIE];
  const me = auth.check(token);
  const ip = clientIp(req);

  // ===== Sign in / out, first-time setup, users =====
  if (p.startsWith('/auth/')) {
    if (m !== 'GET' && !sameOrigin(req)) return fail(res, 403, 'Request came from another web site');
    const login = (tok, code = 200) => { res.setHeader('Set-Cookie', auth.cookie(tok, viaHttps(req))); return send(res, code, { ok: true }); };
    if (p === '/auth/status' && m === 'GET') return ok(res, { ok: true, user: me, setup: auth.needsSetup(), setupAllowed: isPrivateAddress(ip), roles: ROLE_INFO, title: store.config.title || 'Brew Panel' });
    if (p === '/auth/setup' && m === 'POST') {
      if (!auth.needsSetup()) return fail(res, 400, 'Setup is already done. Sign in instead.');
      if (!isPrivateAddress(ip)) return fail(res, 403, 'First-time setup only works from your own network');
      const { name, password } = await jsonBody(req);
      auth.addUser(name, password, 'admin');
      return login(auth.newSession(auth.findUser(name).name));
    }
    if (p === '/auth/login' && m === 'POST') { const { name, password } = await jsonBody(req); return login(auth.login(name, password, ip)); }
    if (p === '/auth/logout' && m === 'POST') { auth.logout(token); dropEndedSessions(); res.setHeader('Set-Cookie', auth.clearCookie()); return ok(res); }
    if (!me) return fail(res, 401, 'Please sign in');
    if (p === '/auth/password' && m === 'POST') {
      const { current, password } = await jsonBody(req);
      try { auth.login(me.name, current, ip); } catch { return fail(res, 400, 'Your current password is wrong'); }
      auth.setPassword(me.name, password); auth.endSessionsFor(me.name); dropEndedSessions();
      return login(auth.newSession(me.name));
    }
    if (me.role !== 'admin') return fail(res, 403, 'Only an admin can manage users');
    if (p === '/auth/users' && m === 'GET') return ok(res, auth.listUsers());
    if (p === '/auth/users' && m === 'POST') { const { name, password, role } = await jsonBody(req); auth.addUser(name, password, role); return ok(res); }
    const u = /^\/auth\/users\/(.+)$/.exec(p);
    if (u && m === 'PUT') {
      const { role, password } = await jsonBody(req);
      if (role) auth.setRole(u[1], role);
      if (password) auth.setPassword(u[1], password);
      auth.endSessionsFor(u[1]); dropEndedSessions();      // they sign in again with the new role / password
      if (u[1].toLowerCase() === me.name.toLowerCase()) return login(auth.newSession(me.name));
      return ok(res);
    }
    if (u && m === 'DELETE') { auth.removeUser(u[1]); dropEndedSessions(); return ok(res); }
    return fail(res, 404, 'Unknown route');
  }

  // ===== Public API: Globals only (Shared variables are never exposed) =====
  // Allowed with the API key, or when signed in. Reading without either only works from your own network.
  if (p.startsWith('/api/')) {
    if (!apiKeyOk(req, url)) {
      if (me) {
        if (m !== 'GET' && !sameOrigin(req)) return fail(res, 403, 'Request came from another web site');
        if (!roleAtLeast(me.role, m === 'GET' ? 'viewer' : 'operator')) return fail(res, 403, 'Your account is view only');
      } else if (!(m === 'GET' && isPrivateAddress(ip))) return fail(res, 401, 'Missing or wrong X-API-Key');
    }
    if (p === '/api/globals' && m === 'GET') return ok(res, globalsOnly());
    if (p === '/api/globals' && (m === 'POST' || m === 'PUT')) {
      const body = await jsonBody(req); const done = [], errors = [];
      for (const [n, v] of Object.entries(body)) {
        const el = store.get(n);
        if (!el || el.type !== 'global') { errors.push(`${n}: not a Global`); continue; }
        try { store.setProp(n, 'value', v, 'api'); done.push(n); } catch (e) { errors.push(`${n}: ${e.message}`); }
      }
      return ok(res, { ok: !errors.length, set: done, errors });
    }
    let g = /^\/api\/globals\/(.+)$/.exec(p);
    if (g) {
      const n = cleanName(g[1]), el = store.get(n);
      if (!el || el.type !== 'global') return fail(res, 404, `No Global named "${n}"`);
      if (m === 'GET') return ok(res, { name: n, type: el.dataType, value: plain(store.getProp(n, 'value')) });
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

  // ===== Everything below needs a signed-in user =====
  if (m === 'GET' && PUBLIC_FILES.has(p)) return sendFile(req, res, path.join(PUBLIC, p));
  if (!me) {
    if (m === 'GET' && (p === '/' || p === '/index.html')) { res.writeHead(302, { Location: '/login.html' }); return res.end(); }
    return fail(res, 401, 'Please sign in');
  }
  const need = needRole(p, m);
  if (!roleAtLeast(me.role, need)) return fail(res, 403, need === 'admin' ? 'Only an admin can do that' : 'Your account is view only');
  if (m !== 'GET' && !sameOrigin(req)) return fail(res, 403, 'Request came from another web site');

  // ===== Browser UI =====
  if (p === '/ui/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 2000\n\n');
    clients.set(res, token); req.on('close', () => clients.delete(res));
    return;
  }
  if (p === '/ui/state' && m === 'GET') {
    const config = me.role === 'admin' ? store.config : { ...store.config, apiKey: undefined };
    return ok(res, { me, roles: ROLES, config, values: store.snapshot(), scripts: engine.list(), devices: hw.list(), types: ELEMENT_TYPES, logModes: LOG_MODES, console: engine.console.slice(-300) });
  }
  if (p === '/ui/set' && m === 'POST') {
    const { name, prop, value } = await jsonBody(req);
    const el = store.get(name);
    if (!el) return fail(res, 404, `No element "${name}"`);
    if (['digitalIn', 'temperature', 'analogIn'].includes(el.type) && el.device && hw.devices.get(el.device)?.type !== 'simulator') return fail(res, 400, `"${name}" is a hardware input`);
    store.setProp(name, prop, value, 'ui');
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
    const f = resolveMedia(url.searchParams.get('path') ?? '');
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
  res.setHeader('X-Frame-Options', 'DENY');               // the panel cannot be hidden inside another site's page
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  route(req, res).catch(e => { if (!res.headersSent) fail(res, 400, e.message); });
});
const PORT = Number(process.env.PORT ?? store.config.port ?? 8080);
server.listen(PORT, () => {
  console.log(`Brew Panel running:  http://localhost:${PORT}`);
  console.log(`Config:  ${CONFIG}\nScripts: ${SCRIPTS}\nData:    ${DATA}`);
  if (auth.needsSetup()) console.log('No users yet: open the panel from a computer or phone on your home network to create the admin account.');
  for (const n of store.config.autostart ?? []) { try { engine.start(n, 'autostart'); } catch (e) { console.error(e.message); } }
});

function shutdown() { console.log('Stopping...'); auth.flush(); engine.stopAll(); store.persistNow(); hw.stop(); logger.close(); process.exit(0); }
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
