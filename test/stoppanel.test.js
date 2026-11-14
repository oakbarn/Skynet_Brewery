// Rule 9.19: the Setup and the uninstall stop only Skynet, with the key the panel wrote at start (lib/stoppanel.js)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { writeStopKey, removeStopKey, stopAllowed, panelPort, stopSkynet, STOP_KEY_FILE } from '../lib/stoppanel.js';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skynet-stop-'));
const data = path.join(root, 'data');
const key = writeStopKey(data);
assert.equal(fs.readFileSync(path.join(data, STOP_KEY_FILE), 'utf8'), key);
assert.equal(key.length, 48);

// only this computer, only the right key
assert.ok(stopAllowed('127.0.0.1', { 'x-stop-key': key }, key));
assert.ok(stopAllowed('::ffff:127.0.0.1', { 'x-stop-key': key }, key));
assert.ok(!stopAllowed('192.168.1.20', { 'x-stop-key': key }, key), 'another computer');
assert.ok(!stopAllowed('127.0.0.1', { 'x-stop-key': key, 'x-forwarded-for': '1.2.3.4' }, key), 'through a proxy');
assert.ok(!stopAllowed('127.0.0.1', { 'x-stop-key': 'x'.repeat(48) }, key), 'wrong key');
assert.ok(!stopAllowed('127.0.0.1', {}, key), 'no key');
assert.ok(!stopAllowed('127.0.0.1', { 'x-stop-key': '' }, ''), 'panel without a key');

assert.equal(panelPort(root), 8080);

// a stand-in panel on a free port: stops only when asked with its key
const fake = http.createServer((req, res) => {
  if (req.url === '/ui/localstop' && req.method === 'POST' && stopAllowed(req.socket.remoteAddress, req.headers, key)) { res.end('{}'); setTimeout(() => fake.close(), 50); return; }
  res.writeHead(403); res.end();
});
await new Promise(r => fake.listen(0, '127.0.0.1', r));
const port = fake.address().port;
fs.mkdirSync(path.join(root, 'config'), { recursive: true });
fs.writeFileSync(path.join(root, 'config', 'brewery.json'), JSON.stringify({ port }));
assert.equal(panelPort(root), port);

// a wrong key on disk: nothing is stopped, and it says so (the Setup then asks the user)
fs.writeFileSync(path.join(data, STOP_KEY_FILE), 'f'.repeat(48));
let r = await stopSkynet(root, { wait: 1200, log: () => {} });
assert.equal(r.stopped, false); assert.ok(r.still.includes(port));

fs.writeFileSync(path.join(data, STOP_KEY_FILE), key);
r = await stopSkynet(root, { wait: 5000, log: () => {} });
assert.equal(r.stopped, true);

removeStopKey(data, key);
assert.ok(!fs.existsSync(path.join(data, STOP_KEY_FILE)));

// the panel answers the call and the Windows Setup and uninstall make it
const server = fs.readFileSync(new URL('../server.js', import.meta.url), 'utf8');
assert.match(server, /p === '\/ui\/localstop'/);
assert.ok(server.indexOf("'/ui/localstop'") < server.indexOf('const me = IMPORT_BUILD'), 'before sign-in: the Setup has no user');
const nsi = fs.readFileSync(new URL('../install/windows/SkynetBrewer.nsi', import.meta.url), 'utf8');
assert.match(nsi, /stoppanel\.mjs/);
assert.match(nsi, /Call un\.WaitForPanelStopped/);
assert.ok(!/taskkill/i.test(nsi), 'nothing is killed: another Node.js program is never touched');
fs.rmSync(root, { recursive: true, force: true });
console.log('stop panel tests passed');
