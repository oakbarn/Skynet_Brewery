// Board settings and Board Talk (Rule 6.27): plain words for every line, sending a typed line, Pause, Answer wait, logging, Importer.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { explainLine, cleanTalkLine, BOARD_COMMANDS, answerSec } from '../public/boardtalk.js';
import { Store } from '../lib/store.js';
import { Hardware } from '../lib/hardware.js';
import { importBruControl } from '../lib/bruimport.js';

assert.equal(explainLine('DO 22 1', 'out'), 'Pin 22 ON.');
assert.equal(explainLine('DO 22 0', 'in'), 'Pin 22 OFF (the board says it is done).');
assert.equal(explainLine('PWM 9 128'), 'Pin 9 power 50 % (128 of 255).');
assert.equal(explainLine('A 3 512'), 'Analog input A3 reads 512 of 1023 (about 2.50 V).');
assert.equal(explainLine('T 28FF0A1B2C3D4E5F 152.4'), 'OneWire probe 28FF0A1B2C3D4E5F: 152.4 °F.');
assert.equal(explainLine('CFG WD 10 S', 'out'), 'Lost link delay: all outputs OFF after 10 seconds without the Brain.');
assert.match(explainLine('RTD 49 NAN'), /FAULT/);
assert.match(explainLine('HELLO MegaBrew v12'), /MegaBrew v12/);
assert.match(explainLine('XYZ 1'), /do not use this line/);
for (const [w, , , words] of BOARD_COMMANDS) { assert.ok(w && words.length > 10, `${w} has plain words`); assert.ok(!/Fritz/.test(words)); }
assert.equal(cleanTalkLine('  HELLO \n'), 'HELLO');
assert.throws(() => cleanTalkLine(''), /Type a line/);
assert.throws(() => cleanTalkLine('x'.repeat(121)), /120/);
assert.equal(answerSec({}), 10); assert.equal(answerSec({ answerSec: 3 }), 3); assert.equal(answerSec({ answerSec: 1 }), 10, 'out of range = the default');

// the Brain keeps every line both ways; Pause holds what the panel sends (but not PING, nor a typed line)
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'btalk'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator', logging: true }], elements: [{ name: 'Pump', type: 'digitalOut', device: 'MB', channel: 22 }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const hw = new Hardware(store); hw.logDir = path.join(d, 'logs');
hw.add(store.config.devices[0]);
const dev = hw.devices.get('MB');
assert.deepEqual(hw.talkSince('MB').lines.map(l => l.line), ['CFG WD 10 S', 'DO 22 0'], 'on connect: the Lost link delay, then every output');
const start = hw.talkSince('MB').seq;
dev.send('DO 22 1'); dev.emit('line', 'DO 22 1');
let t = hw.talkSince('MB', start);
assert.deepEqual(t.lines.map(l => [l.dir, l.line]), [['out', 'DO 22 1'], ['in', 'DO 22 1']]);
assert.equal(store.getProp('Pump', 'state'), true, 'not paused: the board\'s line is used');
hw.pause('MB', true);
dev.send('DO 22 0'); dev.send('PING'); dev.emit('line', 'DO 22 0');
t = hw.talkSince('MB', t.seq);
assert.deepEqual(t.lines.map(l => l.dir), ['note', 'held', 'out', 'in']);
assert.equal(t.paused, true);
assert.equal(store.getProp('Pump', 'state'), true, 'paused: what the board says is shown, not used');
hw.talkSend('MB', 'HELLO');
assert.equal(hw.talkSince('MB').lines.at(-1).line, 'HELLO', 'a typed line is sent even while paused');
hw.pause('MB', false);
assert.ok(hw.talkSince('MB').lines.some(l => l.dir === 'out' && l.line === 'DO 22 1'), 'talking again sends every output so the board matches');
assert.throws(() => hw.talkSince('Nope'), /no Interface called Nope/);
await new Promise(r => setTimeout(r, 50));
const logs = fs.readdirSync(hw.logDir);
assert.equal(logs.length, 1); assert.match(fs.readFileSync(path.join(hw.logDir, logs[0]), 'utf8'), /-> DO 22 1 {4}Pin 22 ON\./);

// Answer wait: a connected board that says nothing is "no answer", and the next line brings it back
const fake = { name: 'X', cfg: { answerSec: 3 }, status: 'connected', connectedAt: 1000, lastRx: 1000, info: '' };
hw._answerCheck(fake, 3500); assert.equal(fake.status, 'connected');
hw._answerCheck(fake, 4500); assert.equal(fake.status, 'no answer'); assert.match(fake.info, /3 s/);
clearTimeout(store._persistTimer);

// the Importer: Response Timeout becomes the Answer wait; Logging is listed, not turned on
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
<Devices><Device><Name>Brewery</Name><Interface>Serial</Interface><SerialPort>3</SerialPort><BaudRate>57600</BaudRate><TypeName>Arduino MEGA</TypeName><Enabled>true</Enabled>
 <LoggingEnabled>true</LoggingEnabled><ReceiveTimeout>3000</ReceiveTimeout><RefreshInterval>1000</RefreshInterval><Ports/></Device></Devices>
<Workspaces/><Processes/></Configuration>`;
const r = importBruControl(xml), b = r.conv.devices[0];
assert.equal(b.answerSec, 3); assert.equal(b.baud, 57600); assert.equal(b.logging, undefined);
assert.ok(JSON.stringify(r).includes('BruControl logging was on for Brewery'));
console.log('board talk tests passed');
