// Stop Skynet before files are deleted (Rule 9.19, OakBarn Brewery 2026-11-13: "To get rid of the DB you need to be sure node js
// is stopped"). Windows can't delete a file a program has open, like the brew log (data\brewlog.db). The Windows Setup (update,
// Start Fresh, Modified Fresh Start) and the uninstall run this file first:
//
//   node stoppanel.js <panel folder>
//
// It stops only Skynet, never another Node.js program: the panel is asked to stop with the key it wrote in data\stop.key when it
// started (a program that doesn't know the key can't stop it), and the BruControl Importer with its own close button's call.
// Each one stops the normal way, every output turned Off first (Rule 6.31). Nothing is ever killed. Exit 0 = Skynet is stopped
// (or was not running); exit 2 = still running, and the Setup then asks the user to close it.
// Self-contained (only node: modules), because the Setup runs the new version's copy before the program files are in place.
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import http from 'node:http';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const STOP_KEY_FILE = 'stop.key';
export const IMPORTER_PORTS = [8095, 8096];

// The panel, as it starts: a new key each start, readable only on this computer's disk.
export function writeStopKey(dataDir) {
  const key = crypto.randomBytes(24).toString('hex');
  try { fs.mkdirSync(dataDir, { recursive: true }); fs.writeFileSync(path.join(dataDir, STOP_KEY_FILE), key); } catch (e) { console.log('Stop key not written: ' + e.message); }
  return key;
}
export function removeStopKey(dataDir, key) {
  try { const f = path.join(dataDir, STOP_KEY_FILE); if (fs.readFileSync(f, 'utf8') === key) fs.rmSync(f, { force: true }); } catch { /* already gone */ }
}
// The panel's check of a stop call: this computer only, and the right key (compared in constant time)
export function stopAllowed(ip, headers, key) {
  const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ip) && !headers['x-forwarded-for'];
  const k = String(headers['x-stop-key'] ?? '');
  return !!(local && key && k.length === key.length && crypto.timingSafeEqual(Buffer.from(k), Buffer.from(key)));
}

// The panel's port: config\brewery.json "port", or 8080
export function panelPort(root) {
  try { const p = Number(JSON.parse(fs.readFileSync(path.join(root, 'config', 'brewery.json'), 'utf8')).port); if (p > 0) return p; } catch { }
  return 8080;
}

const listening = port => new Promise(done => {
  const s = net.connect({ host: '127.0.0.1', port });
  s.setTimeout(1000, () => { s.destroy(); done(false); });
  s.once('connect', () => { s.destroy(); done(true); });
  s.once('error', () => done(false));
});
const post = (port, p, headers) => new Promise(done => {
  const req = http.request({ host: '127.0.0.1', port, path: p, method: 'POST', headers: { 'Content-Length': 0, ...headers }, timeout: 3000 }, res => { res.resume(); done(res.statusCode); });
  req.on('error', () => done(0)); req.on('timeout', () => { req.destroy(); done(0); }); req.end();
});

export async function stopSkynet(root, { wait = 15000, log = console.log } = {}) {
  const port = panelPort(root);
  if (await listening(port)) {
    let key = ''; try { key = fs.readFileSync(path.join(root, 'data', STOP_KEY_FILE), 'utf8').trim(); } catch { }
    if (key) { log('Stopping Skynet Brewer (every output turned Off first)...'); await post(port, '/ui/localstop', { 'X-Stop-Key': key }); }
  }
  for (const ip of IMPORTER_PORTS) if (await listening(ip)) { log('Closing the BruControl Importer...'); await post(ip, '/api/close', { 'X-Skynet-Importer': '1', Host: `localhost:${ip}` }); }
  const ports = [port, ...IMPORTER_PORTS], end = Date.now() + wait;
  for (;;) {
    const still = []; for (const p of ports) if (await listening(p)) still.push(p);
    if (!still.length) return { stopped: true, still };
    if (Date.now() > end) return { stopped: false, still };
    await new Promise(r => setTimeout(r, 500));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv[2] ?? '.');
  stopSkynet(root).then(r => {
    if (r.stopped) { console.log('Skynet is stopped.'); process.exit(0); }
    console.log(`Still running on port ${r.still.join(', ')}.`); process.exit(2);
  });
}
