// Data Display (OakBarn Brewery, 2026-11-09, Rule 6.26: "Just have a DataDisplay and able to pick which one"): a Device with more than
// one value picks which one shows; a Process changes it; a flow meter's .value (BruControl's Primary Value) follows it; the Importer
// turns Show Secondary Value off into the pick.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { displayChoices, displayKey, displayWord } from '../public/datadisplay.js';
import { importBruControl } from '../lib/bruimport.js';

assert.equal(displayChoices({ type: 'temperature' }), null, 'a probe has one value');
assert.equal(displayChoices({ type: 'pwmOut' }), null, 'a PWM output without Measured volts has one value');
assert.ok(displayChoices({ type: 'pwmOut', voltTable: [[0, 0], [100, 9.6]] }));
assert.equal(displayKey({ type: 'flowMeter' }, 'Total'), 'total');
assert.equal(displayKey({ type: 'pid' }, 'output %'), 'output');
assert.equal(displayKey({ type: 'pid' }, 'Reading'), 'reading', 'the words without the ( ) part work');
assert.throws(() => displayKey({ type: 'flowMeter', name: 'F' }, 'Volts'), /Rate and Total, Rate, Total/);
assert.equal(displayWord({ type: 'scale' }, 'weight'), 'Weight');

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ddisp'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
  { name: 'Flow', type: 'flowMeter', device: 'MB', channel: 2 },
  { name: 'Flow2', type: 'flowMeter', device: 'MB', channel: 3, display: 'total' },
  { name: 'Probe', type: 'temperature', device: 'MB', channel: 'A0', sensor: 'ntc' },
  { name: 'PID', type: 'pid', device: 'MB', channel: 9, input: 'Probe' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
store.setProp('Flow', 'rate', 2, 'hw'); store.setProp('Flow', 'total', 30, 'hw');
store.setProp('Flow2', 'rate', 1, 'hw'); store.setProp('Flow2', 'total', 7, 'hw');
assert.equal(store.getProp('Flow', 'display'), 'both');
assert.equal(store.getProp('Flow', 'value'), 2, 'its value is its rate, as before');
assert.equal(store.getProp('Flow2', 'value'), 7, 'Total picked: its value is its Total (BruControl Primary Value)');
store.setProp('Flow', 'display', 'Total');
assert.equal(store.getProp('Flow', 'display'), 'total');
assert.equal(store.getProp('Flow', 'value'), 30, 'a Process picks Total: its value follows');
store.setProp('Flow', 'display', '');
assert.equal(store.getProp('Flow', 'value'), 2, '"" puts back its Properties pick');
assert.throws(() => store.setProp('Flow', 'display', 'Volts'), /display must be one of/);
assert.throws(() => store.setProp('Probe', 'display', 'Total'), /only one value/);
store.setProp('PID', 'display', 'Target');      // the old word still works
assert.equal(store.getProp('PID', 'display'), 'setpoint');

// the Importer: Show Secondary Value off -> only the Primary Value
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
<Devices><Device><Name>Main Brewery</Name><Interface>Serial</Interface><SerialPort>5</SerialPort><TypeName>Mega 2560</TypeName><Enabled>true</Enabled>
 <Ports><DevicePort i:type="PWMOutPort"><ID>p1</ID><Number>9</Number></DevicePort><DevicePort i:type="PWMOutPort"><ID>p2</ID><Number>10</Number></DevicePort></Ports></Device></Devices>
<Workspaces><Workspace><Name>Brew House</Name><Elements>
 <Element i:type="DeviceElement"><ID>e1</ID><Name>Fan</Name><PortID>p1</PortID><X>0</X><Y>0</Y><Width>50</Width><Height>50</Height><Appearance><ShowSecondaryValue>false</ShowSecondaryValue></Appearance></Element>
 <Element i:type="DeviceElement"><ID>e2</ID><Name>Fan2</Name><PortID>p2</PortID><X>100</X><Y>0</Y><Width>50</Width><Height>50</Height><Appearance><ShowSecondaryValue>true</ShowSecondaryValue></Appearance></Element>
</Elements></Workspace></Workspaces><Processes/></Configuration>`;
const r = importBruControl(xml), els = r.conv.elements;
assert.equal(els.find(e => e.bru?.name === 'Fan').display, 'value');
assert.equal(els.find(e => e.bru?.name === 'Fan2').display, undefined, 'Show Secondary Value on = show both (the default)');
assert.ok(JSON.stringify(r).includes('Show Secondary Value off'), 'the Import notes list it');
clearTimeout(store._persistTimer);
console.log('data display tests passed');
await import('./alarmemail.test.js');
