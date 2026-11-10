// Calibrations on every reading (OakBarn Brewery, 2026-11-09, Rule 6.24) and a PWM / Analog output's Measured volts
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { applyCalibrations, calSummary, pairsFrom, pairsText, pwmVolts, pwmForVolts, lookup } from '../public/calibrations.js';
import { calibrate } from '../lib/control.js';
import { Store } from '../lib/store.js';
import { Hardware } from '../lib/hardware.js';
import { importBruControl } from '../lib/bruimport.js';

// layered, in order, a switched-off one skipped
assert.equal(applyCalibrations([{ type: 'multiplier', multiplier: 2 }, { type: 'offset', offset: 1 }], 10), 21);
assert.equal(applyCalibrations([{ type: 'offset', offset: 1 }, { type: 'multiplier', multiplier: 2 }], 10), 22);
assert.equal(applyCalibrations([{ type: 'offset', offset: 5, enabled: false }], 10), 10);
assert.equal(applyCalibrations([{ type: 'divider', divider: 4 }], 10), 2.5);
assert.equal(applyCalibrations([{ type: 'floor', floor: 0 }, { type: 'ceiling', ceiling: 100 }], 140), 100);
assert.equal(Math.round(applyCalibrations([{ type: 'fahrenheitToKelvin' }], 32) * 100) / 100, 273.15);
assert.equal(applyCalibrations([{ type: 'lookupTable', rows: [[0, 0], [10, 100]] }], 5), 50);
// Fritz's own thermistor: Steinhart-Hart then Kelvin to Fahrenheit, from the raw Analog In reading
const th = [{ type: 'steinhartHart', a: 0.001137155, b: 0.00023259496, c: 0.0000000954, resistor: 9960 }, { type: 'kelvinToFahrenheit' }];
const f = calibrate({ calibrations: th }, 512);
assert.ok(f > 60 && f < 90, `about room temperature at mid scale (${f})`);
assert.equal(calSummary(th), 'Thermistor: Pad resistor 9960, A 0.001137155, B 0.00023259496, C 9.54e-8 → Kelvin to Fahrenheit');
assert.equal(calSummary([]), 'none');
assert.deepEqual(pairsFrom('0, 0\n50 4.6\n\n100,9.4'), [[0, 0], [50, 4.6], [100, 9.4]]);
assert.equal(pairsText([[0, 0], [50, 4.6]]), '0, 0\n50, 4.6');
assert.throws(() => pairsFrom('50'), /two numbers/);
assert.equal(lookup([], 3), null);

// Measured volts on a DAC that only reaches 9.4 V
const dac = { type: 'pwmOut', voltTable: [[0, 0], [50, 4.6], [100, 9.4]] };
assert.equal(pwmVolts(dac, 75), 7);
assert.equal(pwmForVolts(dac, 7), 75);
assert.equal(pwmForVolts(dac, 12), 100, 'never above 100 %');
assert.equal(pwmVolts({ type: 'pwmOut' }, 50), null);

// the Brain: a probe and a flow meter run their calibrations after their own reading; .volts reads and sets
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'cal'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
  { name: 'Probe', type: 'temperature', sensor: 'ds18b20', probeIndex: 1, calibrations: [{ type: 'offset', offset: -1.5 }] },
  { name: 'DAC', type: 'pwmOut', device: 'MB', channel: 9, ...dac },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const hw = new Hardware(store);
hw._temp(store.get('Probe'), 'T', '20');
assert.ok(Math.abs(store.getProp('Probe', 'value') - (68 - 1.5)) < 0.2 || Math.abs(store.getProp('Probe', 'value') - 18.5) < 0.2, `offset applied after the probe's own reading (${store.getProp('Probe', 'value')})`);
store.setProp('DAC', 'volts', 7);
assert.equal(store.getProp('DAC', 'value'), 75);
assert.equal(store.getProp('DAC', 'volts'), 7);
assert.throws(() => { store.get('DAC').voltTable = undefined; store.setProp('DAC', 'volts', 3); }, /Measured volts/);
clearTimeout(store._persistTimer);

// the Importer keeps the calibrations and their Text Format (both programs)
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
<Devices><Device><Name>Main Brewery</Name><Interface>Serial</Interface><SerialPort>5</SerialPort><TypeName>Mega 2560</TypeName><Enabled>true</Enabled>
 <Ports><DevicePort i:type="AnalogInPort"><ID>p1</ID><Number>57</Number><CalValue><Calibrations>
   <Calibration i:type="SteinhartHartCalibration"><Enabled>true</Enabled><A>0.001137155</A><B>0.00023259496</B><C>0.000000095400</C><Resistor>9960</Resistor></Calibration>
   <Calibration i:type="KelvinToFahrenheitCalibration"><Enabled>true</Enabled></Calibration></Calibrations><Precision>1</Precision><Prefix></Prefix><Suffix>°F</Suffix></CalValue></DevicePort>
  <DevicePort i:type="AnalogInPort"><ID>p2</ID><Number>62</Number><CalValue><Calibrations>
   <Calibration i:type="LookupTableCalibration"><Enabled>true</Enabled><Rows><Row><X>8.9</X><Y>29</Y></Row><Row><X>200</X><Y>175</Y></Row></Rows></Calibration></Calibrations><Precision>1</Precision></CalValue></DevicePort>
  <DevicePort i:type="PWMOutPort"><ID>p3</ID><Number>7</Number><CalValue><Calibrations><Calibration i:type="MultiplierCalibration"><Enabled>true</Enabled><Multiplier>0.392</Multiplier></Calibration></Calibrations></CalValue></DevicePort></Ports></Device></Devices>
<Workspaces><Workspace><Name>Brew House</Name><Elements>
 <Element i:type="DeviceElement"><ID>e1</ID><Name>HLT Temp</Name><PortID>p1</PortID><X>0</X><Y>0</Y><Width>50</Width><Height>50</Height></Element>
 <Element i:type="DeviceElement"><ID>e2</ID><Name>Level</Name><PortID>p2</PortID><X>100</X><Y>0</Y><Width>50</Width><Height>50</Height></Element>
 <Element i:type="DeviceElement"><ID>e3</ID><Name>Fan PWM</Name><PortID>p3</PortID><X>200</X><Y>0</Y><Width>50</Width><Height>50</Height></Element>
</Elements></Workspace></Workspaces><Processes/></Configuration>`;
const r = importBruControl(xml), els = r.conv.elements, by = n => els.find(e => e.bru?.name === n);
assert.deepEqual(by('HLT Temp').calibrations.map(c => c.type), ['steinhartHart', 'kelvinToFahrenheit']);
assert.equal(by('HLT Temp').calibrations[0].resistor, 9960);
assert.deepEqual([by('HLT Temp').precision, by('HLT Temp').units], [1, '°F']);
assert.deepEqual(by('Level').calibrations[0].rows, [[8.9, 29], [200, 175]]);
assert.equal(by('Fan PWM').calibrations, undefined, 'a PWM output (0-255) is not copied');
assert.ok(JSON.stringify(r).includes('kept their BruControl calibrations') && JSON.stringify(r).includes('0-255'));
console.log('calibration tests passed');
await import('./smoothing.test.js');      // Smoothing (Rule 6.24); keeps package.json untouched
process.exit(0);
