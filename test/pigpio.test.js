// Raspberry Pi GPIO program (firmware/Pi_GPIO) and the panel's Pi pin rules (public/naming.js, public/links.js)
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { busCheck, freePins, pinLabel, pinTag, portClash } from '../public/naming.js';
import { rating, heatingLinkWarning, BOARDS } from '../public/links.js';
import { pinOf } from '../lib/sensors.js';

// ---- panel side
const devices = [{ name: 'Brain Pins', type: 'ethernet', host: '127.0.0.1', board: 'pi' }, { name: 'Stand Pi', type: 'esp32', host: '192.168.1.70', board: 'pi' }, { name: 'MEGA', type: 'serial', board: 'mega' }];
assert.ok(BOARDS.some(([v]) => v === 'pi'), 'Raspberry Pi is a board choice');
assert.equal(rating(devices[0]).level, 'best', 'the Brain\'s own pins: best');
assert.equal(rating({ ...devices[0], host: '192.168.1.71' }).level, 'good', 'a Pi on Ethernet: good');
assert.equal(rating(devices[1]).level, 'ok', 'a Pi on WiFi: OK');
assert.equal(rating(devices[1], true).level, 'poor', 'heating on a WiFi Pi: poor');
const heater = { name: 'E', type: 'pwmOut', subtype: 'element', device: 'Brain Pins', channel: '18' };
assert.equal(heatingLinkWarning(heater, devices), '', 'no network warning for the Brain\'s own pins');
assert.match(heatingLinkWarning({ ...heater, device: 'Stand Pi' }, devices), /WiFi/);

assert.equal(pinOf('GPIO17'), '17');
assert.equal(pinLabel('17', 'pi'), 'GPIO17');
assert.equal(pinLabel('9', 'pi'), 'GPIO9  (SPI, for RTD boards)');
assert.equal(pinLabel('5', 'mega'), 'D5  (PWM)', 'Mega labels unchanged');
assert.equal(pinTag('4', 'pi'), 'OneWire probes');
const relay = { name: 'R', type: 'digitalOut', device: 'Brain Pins', channel: '17' };
assert.equal(busCheck(relay, [], devices), null, 'a relay on GPIO17 is fine (no PWM / counter pins kept on a Pi)');
assert.match(busCheck({ ...relay, channel: '30' }, [], devices).error, /GPIO 2 to GPIO 27/);
assert.match(busCheck({ ...relay, channel: 'GPIO1' }, [], devices).error, /GPIO 2 to GPIO 27/);
assert.match(busCheck({ name: 'S', type: 'stepper', device: 'Brain Pins', channel: '20' }, [], devices).error, /stepper/);
assert.match(busCheck({ name: 'A', type: 'analogIn', device: 'Brain Pins', channel: 'A0' }, [], devices).error, /no analog pins/);
assert.equal(busCheck({ name: 'A', type: 'analogIn', adc: 'ads1115', device: 'Brain Pins', channel: 0 }, [], devices), null, 'ADS1115 on a Pi is fine');
const rtd = { name: 'T', type: 'temperature', sensor: 'pt100', device: 'Brain Pins', channel: '25' };
assert.equal(busCheck(rtd, [], devices), null, 'RTD chip-select on any free GPIO (Rule 6.9 is Mega only)');
assert.match(busCheck({ ...rtd, channel: '10' }, [], devices).error, /SPI bus \(7, 8, 9, 10, 11\)/);
assert.match(busCheck({ ...relay, channel: '9' }, [rtd], devices).error, /blocked/, 'an RTD on the Pi blocks GPIO 7-11');
assert.match(busCheck({ ...relay, channel: '4' }, [], devices).warn, /OneWire/, 'GPIO4 is the probes\' pin: heads-up');
const free = freePins({ name: '\0new', type: 'digitalOut', device: 'Brain Pins' }, [relay], devices, false);
assert.ok(free.length && free.every(p => +p >= 2 && +p <= 27) && !free.includes('17'), 'free Pi pins: GPIO 2-27 not used');
assert.ok(free.indexOf('5') < free.indexOf('9') && free.indexOf('5') < free.indexOf('2'), 'plain pins before bus pins');
assert.deepEqual(freePins({ name: '\0new', type: 'analogIn', device: 'Brain Pins' }, [], devices, true), [], 'no analog pins on a Pi');
assert.equal(portClash({ ...relay, name: 'R2', type: 'digitalIn', channel: 'GPIO17' }, [relay])?.other, 'R', 'GPIO17 and 17 are the same pin');

// ---- the Pi program itself, without hardware (--fake)
const py = spawnSync('python3', ['--version']);
if (py.status !== 0) { console.log('pigpio tests passed (python3 not found: Pi program not run)'); process.exit(0); }
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pigpio-')), inputs = path.join(dir, 'inputs.json');
fs.writeFileSync(inputs, JSON.stringify({ 22: 1 }));
const script = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'firmware', 'Pi_GPIO', 'skynet_pi_gpio.py');
const port = 43000 + Math.floor(Math.random() * 1000);
const proc = spawn('python3', ['-I', script, '--fake', '--listen', '127.0.0.1', '--port', String(port), '--fake-inputs', inputs, '--settings', path.join(dir, 'none.json')]);
let err = '', got = [];
proc.stderr.on('data', d => { err += d; });
const until = async (test, ms = 4000) => { const t = Date.now(); while (Date.now() - t < ms) { if (test()) return true; await new Promise(r => setTimeout(r, 20)); } return false; };
try {
  assert.ok(await until(() => /listening/.test(err)), 'Pi program starts: ' + err);
  const sock = net.createConnection({ host: '127.0.0.1', port });
  await new Promise((res, rej) => { sock.once('connect', res); sock.once('error', rej); });
  let buf = '';
  sock.on('data', d => { buf += d; const l = buf.split('\n'); buf = l.pop(); got.push(...l); });
  const ask = async (line, re) => { got = []; sock.write(line + '\n'); assert.ok(await until(() => got.some(l => re.test(l))), `${line} -> ${re}, got ${JSON.stringify(got)}`); };
  await ask('HELLO', /^HELLO \S+ pi-0\.1$/);
  await ask('DO 17 1', /^DO 17 1$/);
  assert.match(err, /pin 17 = 0/, 'relay boards switch ON with LOW');
  await ask('PWM 18 128', /^PWM 18 128$/);
  await ask('AO 19 500', /^AO 19 500$/);
  await ask('PWM 17 10', /^ERR pin 17 is already an output$/);
  await ask('DO 30 1', /^ERR pin 30 is not a Raspberry Pi GPIO pin/);
  await ask('CFG STEP 20 21 -1 0 800 400 2', /^ERR stepper motors/);
  await ask('CFG TEST 1 2', /^ERR CFG TEST/);
  await ask('CFG DI 22 PULLUP 0', /^$|.*/);
  fs.writeFileSync(inputs, JSON.stringify({ 22: 0 }));
  got = [];
  assert.ok(await until(() => got.includes('DI 22 1')), 'an input pulled to GND reports 1');
  await ask('CFG FLOW 23 S', /^$|.*/);
  assert.ok(await until(() => got.includes('P 23 0'), 2500), 'a flow meter reports its count every second');
  sock.write('CFG WD 3 S\n');
  err = '';
  assert.ok(await until(() => /lost link/.test(err), 5000), 'quiet for 3 s: lost link');
  assert.match(err, /pin 17 = 1/, 'lost link: the relay goes OFF');
  assert.match(err, /pin 18 pwm 0%/, 'lost link: PWM goes to 0');
  await ask('PING', /^ERR watchdog cleared$/);
  sock.destroy();
} finally {
  proc.kill();
  fs.rmSync(dir, { recursive: true, force: true });
}
console.log('pigpio tests passed');
