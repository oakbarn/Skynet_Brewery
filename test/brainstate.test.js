// The Brain in the Background and Standby (Rule 6.32, lib/brainstate.js, lib/startbrain.js)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readStandby, writeStandby, clearStandby, onBrainComputer, deviceKind, otherScreens, startAgain } from '../lib/brainstate.js';
import { startBrain, brainJob, lastLines, IMPORTER_PORT } from '../lib/startbrain.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skynet-standby-'));
// Standby is written down, so it stays after a restart until an Admin starts the Brain
assert.equal(readStandby(dir), null);
writeStandby(dir, 'Dana', 1000);
assert.deepEqual(readStandby(dir), { by: 'Dana', at: 1000 });
clearStandby(dir); clearStandby(dir);
assert.equal(readStandby(dir), null);
fs.writeFileSync(path.join(dir, 'standby.json'), 'not json');
assert.equal(readStandby(dir), null);

// Close Skynet Panel and the Brain: only on the Brain's own computer, never through a proxy
assert.ok(onBrainComputer('127.0.0.1', {}));
assert.ok(onBrainComputer('::1', {}));
assert.ok(onBrainComputer('::ffff:127.0.0.1'));
assert.ok(!onBrainComputer('192.168.1.20', {}));
assert.ok(!onBrainComputer('100.101.102.103', {}));          // Tailscale
assert.ok(!onBrainComputer('127.0.0.1', { 'x-forwarded-for': '100.1.2.3' }));   // tailscale serve on this computer

// Who else has the panel open
const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', win = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/120';
assert.equal(deviceKind(iphone), 'iPhone');
assert.equal(deviceKind('Mozilla/5.0 (Linux; Android 14; Pixel) Mobile'), 'Android phone');
assert.equal(deviceKind('Mozilla/5.0 (Linux; Android 14; Tab)'), 'Android tablet');
assert.equal(deviceKind(win), 'Windows computer');
assert.equal(deviceKind(''), 'browser');
const screens = [
  { token: 'me', name: 'Admin', ua: win, ip: '127.0.0.1' },
  { token: 'me', name: 'Admin', ua: win, ip: '127.0.0.1' },        // my own second page: not "another screen"
  { token: 't2', name: 'Dana', ua: iphone, ip: '100.64.0.9' },
  { token: 't3', name: 'Dana', ua: iphone, ip: '100.64.0.9' },     // the same phone twice: listed once
  { token: 't4', name: 'Shop', ua: win, ip: '127.0.0.1' },
];
assert.deepEqual(otherScreens(screens, 'me'), [
  { name: 'Dana', device: 'iPhone', here: false },
  { name: 'Shop', device: 'the Brain\'s own computer', here: true },
]);
assert.deepEqual(otherScreens([], 'me'), []);

// Starting again: a Pi service starts again by itself; otherwise a new hidden Brain is started
assert.equal(startAgain({ env: { INVOCATION_ID: 'x' }, dataDir: dir, spawnFn: () => assert.fail('no spawn on a service') }), 'service');
let call = null;
const fake = (exe, args, opt) => { call = { exe, args, opt }; return { on() {}, unref() {} }; };
assert.equal(startAgain({ env: { PATH: 'p' }, platform: 'win32', dataDir: dir, spawnFn: fake, argv: ['node', 'server.js'], execPath: 'node.exe', execArgv: ['--no-warnings'], cwd: dir }), 'started');
assert.deepEqual(call.args, ['--no-warnings', 'server.js']);
assert.equal(call.opt.env.SKYNET_RESTARTED, '1');
assert.equal(call.opt.windowsHide, true);
assert.equal(call.opt.detached, false, 'Windows: its own hidden window, so it still hears a shut down');
startAgain({ env: {}, platform: 'linux', dataDir: dir, spawnFn: fake, argv: ['node', 'server.js'], execPath: 'node', execArgv: [], cwd: dir });
assert.equal(call.opt.detached, true);
assert.ok(fs.existsSync(path.join(dir, 'brain.log')));

// lib/startbrain.js: the Skynet_Brewer.bat starts the Brain in the Background and waits until it answers
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skynet-start-'));
fs.mkdirSync(path.join(root, 'config')); fs.writeFileSync(path.join(root, 'config', 'brewery.json'), JSON.stringify({ port: 8123 }));
assert.equal(brainJob(root).port, 8123);
assert.equal(brainJob(root, 'importer').port, IMPORTER_PORT);
assert.match(brainJob(root, 'importer').log, /importer\.log$/);
assert.equal(lastLines('a\n\nb\r\nc', 2), 'b\nc');
const said = [];
let up = false, spawned = null;
const child = { on() {}, unref() {} };
const opened = [], open = (url, o) => { opened.push({ url, o }); return 'app'; };
let code = await startBrain(root, { log: t => said.push(t), wait: 5000, open, env: { PATH: 'p' }, isListening: async () => up, spawnFn: (e, a, o) => { spawned = { a, o }; setTimeout(() => { up = true; }, 50); return child; } });
assert.equal(code, 0);
assert.ok(spawned.a.at(-1).endsWith('server.js'));
assert.equal(spawned.o.windowsHide, true);
// the Brain in the Background never opens the window; the program that was double-clicked does, once the Brain answers
// (OakBarn Brewery, 2026-11-14: "Full installer only starts the Brain")
assert.equal(spawned.o.env.SKYNET_WINDOW, 'none');
assert.deepEqual(opened.map(x => x.url), ['http://localhost:8123']);
assert.match(said.at(-1), /running in the Background/);
// already running (Skynet Panel, or Skynet Brewer double-clicked again): no second Brain, only its window opens
said.length = 0; opened.length = 0;
code = await startBrain(root, { log: t => said.push(t), open, isListening: async () => true, spawnFn: () => assert.fail('no second Brain') });
assert.equal(code, 0); assert.match(said[0], /already running/); assert.equal(opened.length, 1);
// the Importer's window uses its own profile
opened.length = 0;
await startBrain(root, { kind: 'importer', log: () => {}, open, isListening: async () => true });
assert.equal(opened[0].url, `http://localhost:${IMPORTER_PORT}`); assert.match(String(opened[0].o.profile ?? ''), /ImporterWindow|^$/);
// no Edge or Chrome and no browser (not Windows): the address to type is shown
said.length = 0;
await startBrain(root, { log: t => said.push(t), open: () => 'none', isListening: async () => true });
assert.ok(said.some(t => /Open http:\/\/localhost:8123 in a browser/.test(t)));
// did not start: the last lines of its log are shown and the .bat keeps its window open
said.length = 0;
const dies = { on(ev, f) { if (ev === 'exit') setTimeout(() => f(1), 20); }, unref() {} };
opened.length = 0;
code = await startBrain(root, { log: t => said.push(t), wait: 3000, open, isListening: async () => false, spawnFn: () => { fs.appendFileSync(path.join(root, 'data', 'brain.log'), 'Error: port in use\n'); return dies; } });
assert.equal(code, 1);
assert.ok(said.some(t => /did not start/.test(t)));
assert.ok(said.some(t => /port in use/.test(t)));
assert.equal(opened.length, 0, 'no window when the Brain did not start');
fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(root, { recursive: true, force: true });
console.log('brainstate tests passed');
