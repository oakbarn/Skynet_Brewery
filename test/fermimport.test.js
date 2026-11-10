// The BruControl Import of a fermentor (OakBarn Brewery, 2026-11-10, Rule 6.30): a heating and a cooling Hysteresis on the same probe
// become ONE Fermentor Control that runs both outputs, and the two outputs keep their names and Ports
import assert from 'node:assert/strict';
import { importBruControl } from '../lib/bruimport.js';
import { FERM_TYPE, fermProblems } from '../public/fermentor.js';

const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="arr">
<Devices><Device><Name>Cellar</Name><Interface>Serial</Interface><SerialPort>4</SerialPort><TypeName>Mega 2560</TypeName><Enabled>true</Enabled>
 <Ports><DevicePort i:type="OWTempPort"><ID>t1</ID><Number>2</Number><SensorIndex>0</SensorIndex></DevicePort>
  <DevicePort i:type="HysteresisPort"><ID>h1</ID><Number>30</Number><InputPortID>t1</InputPortID><Target>64</Target><OnOffset>1.5</OnOffset><OnDelay>0</OnDelay></DevicePort>
  <DevicePort i:type="HysteresisPort"><ID>c1</ID><Number>31</Number><InputPortID>t1</InputPortID><Target>64</Target><OnOffset>-2</OnOffset><OnDelay>600</OnDelay></DevicePort>
 </Ports></Device></Devices>
<Workspaces><Workspace><Name>Ferm Room</Name><Elements>
 <Element i:type="DeviceElement"><ID>e1</ID><Name>FV1 Temp</Name><DisplayName>FV1</DisplayName><PortID>t1</PortID><X>10</X><Y>10</Y><Width>100</Width><Height>60</Height></Element>
 <Element i:type="DeviceElement"><ID>e2</ID><Name>FV1 Lamp</Name><PortID>h1</PortID><X>10</X><Y>100</Y><Width>100</Width><Height>60</Height></Element>
 <Element i:type="DeviceElement"><ID>e3</ID><Name>FV1 Freezer</Name><PortID>c1</PortID><X>200</X><Y>100</Y><Width>100</Width><Height>60</Height></Element>
</Elements></Workspace></Workspaces><Processes/></Configuration>`;

const r = importBruControl(xml), els = r.conv.elements;
const ferm = els.filter(e => e.type === FERM_TYPE);
assert.equal(ferm.length, 1, 'one Fermentor Control for the two Hysteresis controls on one probe');
const f = ferm[0], by = n => els.find(e => e.name === n);
const probe = els.find(e => e.bru?.name === 'FV1 Temp'), heat = by(f.heat), cool = by(f.cool);
assert.equal(f.input, probe.name, 'it reads the same probe');
assert.equal(heat.bru.name, 'FV1 Lamp'); assert.equal(cool.bru.name, 'FV1 Freezer');
assert.deepEqual([heat.type, heat.subtype, heat.heatMethod, heat.channel], ['digitalOut', 'element', 'onoff', 30], 'the heater is a Heating Element in Direct on its Port');
assert.deepEqual([cool.type, cool.subtype, cool.channel], ['digitalOut', undefined, 31], 'the cooling is a plain output on its Port');
assert.deepEqual([f.target, f.heatOffset, f.coolOffset, f.mode], [64, 1.5, 2, 'auto'], 'the Setpoint and both offsets come over');
assert.equal(f.coolDelay, 600, 'a longer BruControl On delay is kept');
assert.equal(f.heatDelay, 60, 'a shorter one gets the safe start');
assert.deepEqual(fermProblems(f, n => !!by(n)), [], 'it can be saved as it is');
assert.ok(r.conv.warnings.some(n => /Fermentor Control \(Rule 6\.30\)/.test(n)), 'it is listed in the Import notes');

// one Hysteresis alone stays as it was
const one = importBruControl(xml.replace(/<DevicePort i:type="HysteresisPort"><ID>c1<\/ID>.*?<\/DevicePort>/s, '').replace(/<Element i:type="DeviceElement"><ID>e3<\/ID>.*?<\/Element>/s, ''));
assert.equal(one.conv.elements.filter(e => e.type === FERM_TYPE).length, 0, 'a heater alone is not a fermentor');
console.log('fermimport tests passed');
