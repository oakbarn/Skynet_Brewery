// Smoothing (OakBarn Brewery, 2026-11-09, Rule 6.24): BruControl's Avg Weight on every reading (probes, Analog In, flow meter rate,
// scale, a Counter's new Rate); a thermistor probe starts at 25 %; the Importer keeps AvgWeight.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Hardware } from '../lib/hardware.js';
import { smoothWeight, smoothStep, samplingPeriod } from '../public/calibrations.js';
import { importBruControl } from '../lib/bruimport.js';

assert.equal(smoothWeight({ type: 'temperature', sensor: 'ntc' }), 25, 'a thermistor starts at 25 %');
assert.equal(smoothWeight({ type: 'temperature', sensor: 'ds18b20' }), 100);
assert.equal(smoothWeight({ type: 'flowMeter' }), 100, 'nothing else is smoothed until asked');
assert.equal(smoothWeight({ type: 'temperature', sensor: 'ntc', avgWeight: 100 }), 100, 'its own number wins');
assert.equal(smoothWeight({ type: 'scale', avgWeight: 0 }), 1, 'never below 1 %');
assert.equal(smoothStep(100, 120, 25), 105);
assert.equal(smoothStep(NaN, 120, 25), 120);
assert.deepEqual([samplingPeriod({}), samplingPeriod({ samplingPeriod: 30 }), samplingPeriod({ samplingPeriod: 5 })], [1, 10, 5]);

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'smooth'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }], elements: [
  { name: 'NTC', type: 'temperature', sensor: 'ntc', device: 'MB', channel: 'A0', units: '°F' },
  { name: 'DS', type: 'temperature', device: 'MB', probe: 'x', units: '°F' },
  { name: 'Flow', type: 'flowMeter', device: 'MB', channel: 2, pulsesPerUnit: 60, avgWeight: 50 },
  { name: 'Cnt', type: 'digitalIn', mode: 'counter', device: 'MB', channel: 30, samplingPeriod: 2 },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const hw = new Hardware(store);
const el = n => store.config.elements.find(e => e.name === n);

// a thermistor: the first reading as it is, then a jump of 20 shows as 5 (25 %); .raw keeps the jump
hw._smooth(el('NTC'), 'value', NaN);
store.setProp('NTC', 'value', 150, 'hw'); hw._seen.add('NTC|value');
assert.equal(hw._smooth(el('NTC'), 'value', 170), 155);
hw._temp(el('DS'), 'T', 150); hw._temp(el('DS'), 'T', 170);
assert.equal(store.getProp('DS', 'value'), 170, 'a DS18B20 is not smoothed unless asked');
hw._temp(el('NTC'), 'A', 512);
const raw = store.getProp('NTC', 'raw'), shown = store.getProp('NTC', 'value');
assert.ok(Number.isFinite(raw) && Math.abs(shown - (150 + (raw - 150) * 0.25)) < 1e-9, `${raw} ${shown}`);

// a flow meter's rate is smoothed, its Total never is
const t0 = 1_000_000;
hw._flow(el('Flow'), 0, t0); hw._flow(el('Flow'), 60, t0 + 60000);      // 1 per minute, the first rate as it is
const r1 = store.getProp('Flow', 'rate');
hw._flow(el('Flow'), 240, t0 + 120000);                                  // 3 per minute: halfway (50 %)
assert.equal(store.getProp('Flow', 'rate'), r1 + (store.getProp('Flow', 'raw') - r1) / 2);
assert.equal(store.getProp('Flow', 'total'), 4, 'the Total counts every pulse');

// a Counter's Rate: counts per second over its Sampling Period
store.setProp('Cnt', 'count', 0, 'hw');
hw._counterRates(0);
store.setProp('Cnt', 'count', 10, 'hw'); hw._counterRates(1000);
assert.equal(store.getProp('Cnt', 'rate'), 0, 'not yet: the window is 2 seconds');
hw._counterRates(2000);
assert.equal(store.getProp('Cnt', 'rate'), 5);
store.setProp('Cnt', 'count', 0, 'hw'); hw._counterRates(4000);          // reset: a new window, no minus rate
assert.equal(store.getProp('Cnt', 'rate'), 5);
hw.stop();

// the Importer keeps BruControl's AvgWeight
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
<Devices><Device><Name>Main Brewery</Name><Interface>Serial</Interface><SerialPort>5</SerialPort><TypeName>Mega 2560</TypeName><Enabled>true</Enabled>
 <Ports><DevicePort i:type="AnalogInPort"><ID>p1</ID><Number>54</Number><AvgWeight>25</AvgWeight><PollRate>500</PollRate></DevicePort></Ports></Device></Devices>
<Workspaces><Workspace><Name>Brew House</Name><Elements>
 <Element i:type="DeviceElement"><ID>e1</ID><Name>HLT Temp</Name><PortID>p1</PortID><X>0</X><Y>0</Y><Width>50</Width><Height>50</Height></Element>
</Elements></Workspace></Workspaces><Processes/></Configuration>`;
const r = importBruControl(xml), a = r.conv.elements.find(e => e.bru?.name === 'HLT Temp');
assert.equal(a.avgWeight, 25);
assert.ok(JSON.stringify(r).includes('Avg Weight'), 'the Import notes list it');
clearTimeout(store._persistTimer);
console.log('smoothing tests passed');
await import('./datadisplay.test.js');      // Data Display (Rule 6.26); keeps package.json untouched
process.exit(0);
