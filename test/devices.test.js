// Devices: sensor conversions and the hardware protocol, without hardware.  Run: node test/devices.test.js
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { analogFrom, analogOutLevel, ntcCelsius, pwmDuty, rtdCelsius, scaleFrom, temperatureFrom, pinNumber, analogIndex } from '../lib/sensors.js';
import { Store } from '../lib/store.js';
import { Hardware } from '../lib/hardware.js';

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} is not ${b} ±${tol}`);

// PT100 at 0 °C = 100 ohm, at 100 °C = 138.51 ohm (MAX31865 raw = R / Rref * 32768)
near(rtdCelsius(100 / 430 * 32768, 100, 430), 0, 0.05, 'PT100 0C');
near(rtdCelsius(138.51 / 430 * 32768, 100, 430), 100, 0.05, 'PT100 100C');
near(rtdCelsius(1385.1 / 4300 * 32768, 1000, 4300), 100, 0.05, 'PT1000 100C');
near(temperatureFrom({ sensor: 'pt100', units: '°F' }, 'RTD', 138.51 / 430 * 32768), 212, 0.1, 'PT100 in F');
// NTC 10k beta 3950 with 10k series resistor reads half scale at 25 °C
near(ntcCelsius(511.5), 25, 0.01, 'NTC 25C');
assert.ok(Number.isNaN(ntcCelsius(0)), 'NTC shorted');
near(temperatureFrom({ sensor: 'thermocouple', units: '°C', offset: -0.5 }, 'TC', 66.5), 66, 1e-9, 'TC offset');
assert.ok(Number.isNaN(temperatureFrom({ sensor: 'thermocouple' }, 'TC', 'NAN')), 'TC open');
near(temperatureFrom({ offset: 1 }, 'T', 150), 151, 1e-9, 'DS18B20');

// Analog inputs
assert.equal(analogFrom({ scale: 0.1, offset: 2 }, 100).value, 12, 'raw scale/offset unchanged');
near(analogFrom({ signal: '4-20mA', rangeLow: 0, rangeHigh: 100 }, 1023 * 12 / 20).value, 50, 0.01, '12 mA = 50 %');
assert.equal(analogFrom({ signal: '4-20mA' }, 10).fault, true, 'broken 4-20 mA wire');
near(analogFrom({ signal: '0.5-4.5V', rangeLow: 0, rangeHigh: 30 }, 1023 * 2.5 / 5).value, 15, 0.01, 'pressure 2.5 V');
near(analogFrom({ signal: '0-10V', rangeLow: 0, rangeHigh: 200 }, 1023 / 2).value, 100, 0.01, '5 V of 10 V through a 2:1 divider');
near(analogFrom({ adc: 'ads1115', signal: '0-5V', rangeLow: 0, rangeHigh: 100 }, 32767 * 2.5 / 6.144).value, 50, 0.01, 'ADS1115 2.5 V');
near(analogFrom({ signal: 'twoPoint', cal1Raw: 400, cal1Value: 7, cal2Raw: 600, cal2Value: 4 }, 500).value, 5.5, 1e-9, 'pH two-point');

// Scales: weight to volume
near(scaleFrom({ countsPerUnit: 1000 }, 83454).volume, 10, 1e-3, '83.454 lb of water = 10 gal');
near(scaleFrom({ countsPerUnit: 1000 }, 83454, 1.05).volume, 10 / 1.05, 1e-3, 'wort at 1.050');
near(scaleFrom({ countsPerUnit: 100, weightUnits: 'kg', volumeUnits: 'L', tareRaw: 500 }, 1498.2).volume, 10, 1e-3, '9.982 kg = 10 L');
near(scaleFrom({ countsPerUnit: 1000 }, 83454, 0).volume, 10, 1e-3, 'unset gravity falls back to water');

// Mega pin names: A0-A15 and BruControl's 54-69 are the same pins
assert.equal(pinNumber('A5'), 59); assert.equal(pinNumber('a15'), 69); assert.equal(pinNumber('D22'), 22); assert.equal(pinNumber(22), 22); assert.ok(Number.isNaN(pinNumber('GPIO5')));
assert.equal(analogIndex('A3'), 3); assert.equal(analogIndex(57), 3); assert.equal(analogIndex('3'), 3);

// Outputs
assert.equal(pwmDuty(50), 128); assert.equal(pwmDuty(150), 255);
assert.equal(analogOutLevel({ rangeLow: 0, rangeHigh: 60 }, 30), 500, 'VFD 30 of 60 Hz');

// Protocol: lines out to the device and readings in
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpdev'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({
  devices: [], probes: [{ index: 1, name: 'HLT probe', rom: '28AA000000000001' }], elements: [
    { name: 'HLT_T', type: 'temperature', probeIndex: 1 },
    { name: 'Old_T', type: 'temperature', probe: '28bb000000000009' },
    { name: 'Relay', type: 'digitalOut', device: 'M', channel: 5, activeLow: true },
    { name: 'Pump_Speed', type: 'pwmOut', device: 'M', channel: 44 },
    { name: 'VFD', type: 'analogOut', device: 'M', channel: 45, rangeLow: 0, rangeHigh: 60 },
    { name: 'Float', type: 'digitalIn', device: 'M', channel: 30, activeLow: true },
    { name: 'Press', type: 'analogIn', device: 'M', channel: 1, signal: '4-20mA', rangeLow: 0, rangeHigh: 30, units: 'psi' },
    { name: 'NTC', type: 'temperature', sensor: 'ntc', device: 'M', channel: 2, units: '°C' },
    { name: 'RTD', type: 'temperature', sensor: 'pt100', device: 'M', channel: 49, units: '°C', wires: 4 },
    { name: 'TC', type: 'temperature', sensor: 'thermocouple', tcType: 'J', device: 'M', channel: 48, units: '°F' },
    { name: 'AdsPH', type: 'analogIn', adc: 'ads1115', device: 'M', channel: 1, signal: '0-5V', rangeLow: 0, rangeHigh: 14 },
    { name: 'Kettle', type: 'scale', device: 'M', channel: '26, 28', countsPerUnit: 1000, tareRaw: 0, autoTareSeconds: 10 },
    { name: 'Flow', type: 'flowMeter', device: 'M', channel: 18, pulsesPerUnit: 100 },
  ],
}));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const hw = new Hardware(store);
const sent = [], dev = { name: 'M', send: l => sent.push(l), status: 'connected' };
hw.devices.set('M', dev); hw.probesSeen.set('M', {});

hw._resendOutputs(dev);
assert.deepEqual(sent, ['DO 5 1', 'PWM 44 0', 'AO 45 0', 'CFG DI 30 PULLUP', 'CFG RTD 49 4', 'CFG TC 48 J']);
sent.length = 0;
store.setProp('Relay', 'state', true); store.setProp('Pump_Speed', 'value', 50); store.setProp('VFD', 'value', 45);
assert.deepEqual(sent, ['DO 5 0', 'PWM 44 128', 'AO 45 750']);
sent.length = 0;
store.setProp('Pump_Speed', 'enabled', false);
assert.deepEqual(sent, ['PWM 44 0'], 'disabled PWM output goes to 0');

hw._onLine(dev, 'DI 30 1'); assert.equal(store.getProp('Float', 'state'), false, 'inverted input');
hw._onLine(dev, `A 1 ${1023 * 12 / 20}`); near(store.getProp('Press', 'value'), 15, 0.01, 'pressure'); assert.equal(store.getProp('Press', 'fault'), false);
hw._onLine(dev, 'A 1 3'); assert.equal(store.getProp('Press', 'fault'), true, 'pressure fault');
{ const before = store.getProp('Press', 'value'); hw._onLine(dev, `ADS 1 ${32767 * 2.5 / 6.144}`); near(store.getProp('AdsPH', 'value'), 7, 0.01, 'ADS1115 element'); assert.equal(store.getProp('Press', 'value'), before, 'ADS line leaves board pin 1 alone'); }
hw._onLine(dev, 'A 2 511.5'); near(store.getProp('NTC', 'value'), 25, 0.01, 'NTC element');
hw._onLine(dev, `RTD 49 ${Math.round(138.51 / 430 * 32768)}`); near(store.getProp('RTD', 'value'), 100, 0.1, 'RTD element');
hw._onLine(dev, 'TC 48 100'); near(store.getProp('TC', 'value'), 212, 1e-9, 'TC element');
hw._onLine(dev, 'TC 48 NAN'); assert.equal(store.getProp('TC', 'fault'), true, 'TC open'); near(store.getProp('TC', 'value'), 212, 1e-9, 'keeps last good value');
hw._flow(store.get('Flow'), 1000, 0); hw._flow(store.get('Flow'), 1200, 60000);
near(store.getProp('Flow', 'rate'), 2, 1e-9, 'flow rate per minute'); near(store.getProp('Flow', 'total'), 2, 1e-9, 'flow total');
assert.throws(() => store.setProp('Press', 'value', 1), /cannot be set by a script/);
store.setProp('Flow', 'total', 0); assert.equal(store.getProp('Flow', 'total'), 0, 'scripts can reset the flow total');

// The same pin by either name
assert.match(hw._outLine({ name: 'Relay', type: 'digitalOut', channel: 'A5' }), /^DO 59 [01]$/, 'A5 is sent as pin 59');
{ const before = store.getProp('Press', 'value'); hw._onLine(dev, `A 1 ${1023 * 12 / 20}`);
  store.get('Press').channel = 55; hw._onLine(dev, `A 1 ${1023 * 16 / 20}`); near(store.getProp('Press', 'value'), 22.5, 0.01, 'BruControl 55 = A1');
  store.get('Press').channel = 'A1'; hw._onLine(dev, `A 1 ${1023 * 12 / 20}`); near(store.getProp('Press', 'value'), 15, 0.01, 'A1'); void before; }

// OneWire probe index: elements use the number; replacing a probe = new ROM id on the slot
assert.equal(store.get('Old_T').probeIndex, 2, 'old ROM-on-element config gets a probe number'); assert.equal(store.config.probes[1].rom, '28BB000000000009');
hw._onLine(dev, 'T 28AA000000000001 150.5'); assert.equal(store.getProp('HLT_T', 'value'), 150.5);
hw._onLine(dev, 'T 28BB000000000009 66'); assert.equal(store.getProp('Old_T', 'value'), 66);
store.saveLayout({ probes: [{ index: 1, name: 'HLT probe', rom: '28aa0000000000ff' }, store.config.probes[1]] });
hw._onLine(dev, 'T 28AA000000000001 99'); assert.equal(store.getProp('HLT_T', 'value'), 150.5, 'old probe no longer feeds slot 1');
hw._onLine(dev, 'T 28AA0000000000FF 152'); assert.equal(store.getProp('HLT_T', 'value'), 152, 'new probe feeds slot 1');
assert.throws(() => store.saveLayout({ probes: [{ index: 1, rom: '28AA0000000000FF' }, { index: 2, rom: '28AA0000000000FF' }] }), /two OneWire slots/);
assert.throws(() => store.saveLayout({ probes: [{ index: 1, rom: 'xyz' }] }), /16 hex digits/);

// Scale with two HX711 boards: summed, tared, calibrated, auto tared
hw._onLine(dev, 'W 26 40000'); assert.equal(store.getProp('Kettle', 'volume'), 0, 'waits for both boards');
hw._onLine(dev, 'W 28 43454'); near(store.getProp('Kettle', 'volume'), 10, 1e-3, 'kettle volume'); near(store.getProp('Kettle', 'value'), 83.454, 1e-9, 'kettle weight');
store.setProp('Kettle', 'tare', true);
assert.equal(store.get('Kettle').tareRaw, 83454, 'tare kept in config'); assert.equal(store.getProp('Kettle', 'volume'), 0); assert.equal(store.getProp('Kettle', 'tare'), false, 'tare button resets');
hw._onLine(dev, 'W 26 50000'); near(store.getProp('Kettle', 'value'), 10, 1e-9, '10 lb added');
store.setProp('Kettle', 'calibrate', 5); assert.equal(store.get('Kettle').countsPerUnit, 2000, 'calibrated with a 5 lb weight');
store.setProp('Kettle', 'volume', 0); assert.equal(store.get('Kettle').tareRaw, 93454, 'setting volume to 0 tares');
const k = store.get('Kettle');
hw._scale(k, 93454 + 100, 0); hw._scale(k, 93454 + 100, 5000); assert.equal(k.tareRaw, 93454, 'no auto tare before 10 s');
hw._scale(k, 93454 + 100, 10500); assert.equal(k.tareRaw, 93554, 'auto tare when empty and steady');
hw._scale(k, 93554 + 20000, 11000); hw._scale(k, 93554 + 20000, 30000); assert.equal(k.tareRaw, 93554, 'no auto tare with liquid in it');
assert.throws(() => store.setProp('Kettle', 'value', 1), /cannot be set by a script/);

// A board on Ethernet: the panel connects over TCP, says HELLO, sends settings, and reads its inputs
{
  const net = await import('node:net');
  const got = [];
  const board = net.createServer(sock => {
    sock.on('data', d => { got.push(...d.toString().trim().split('\n')); if (got.includes('HELLO')) sock.write('HELLO ETH1 0.2\nDI 30 0\n'); });
  });
  await new Promise(r => board.listen(0, '127.0.0.1', r));
  const hw2 = new Hardware(store);
  hw2.add({ name: 'M', type: 'ethernet', host: '127.0.0.1', port: board.address().port });
  hw.devices.delete('M');
  await new Promise(r => setTimeout(r, 400));
  assert.ok(got.includes('HELLO') && got.includes('CFG RTD 49 4'), 'ethernet board got HELLO and settings: ' + got.join(','));
  assert.equal(hw2.devices.get('M').status, 'connected'); assert.equal(hw2.devices.get('M').info, 'ETH1 0.2');
  assert.equal(store.getProp('Float', 'state'), true, 'input read over ethernet (inverted)');
  hw2.stop(); board.close();
}
console.log('devices test: all passed');
