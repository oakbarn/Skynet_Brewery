// Alarm Digital Outputs (Rule 7.19): up to 2 Devices go ON with their Alarm and OFF when it stops; blank does nothing; the Importer.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Store } from '../lib/store.js';
import { watchAlarmOutputs, alarmOutputs } from '../lib/alarmoutputs.js';
import { importBruControl } from '../lib/bruimport.js';

assert.deepEqual(alarmOutputs({}), [], 'blank slots do nothing');
assert.deepEqual(alarmOutputs({ digitalOutput1: 'Horn', digitalOutput2: 'None' }), ['Horn']);
assert.deepEqual(alarmOutputs({ output: 'Light' }), ['Light'], 'an Alarm imported before keeps its one output in slot 1');

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'almout'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [], elements: [
  { name: 'Horn', type: 'digitalOut', channel: 30 }, { name: 'Light', type: 'digitalOut', channel: 31 }, { name: 'Probe', type: 'temperature' },
  { name: 'alm_Boil', type: 'alarm', digitalOutput1: 'Horn', digitalOutput2: 'Light' },
  { name: 'alm_Odd', type: 'alarm', digitalOutput1: 'Probe' },
  { name: 'alm_Quiet', type: 'alarm' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const logs = []; watchAlarmOutputs(store, { log: x => logs.push(x) });
store.setProp('alm_Boil', 'active', true);
assert.equal(store.getProp('Horn', 'state'), true); assert.equal(store.getProp('Light', 'state'), true);
store.setProp('alm_Boil', 'active', false);
assert.equal(store.getProp('Horn', 'state'), false); assert.equal(store.getProp('Light', 'state'), false);
store.setProp('alm_Odd', 'active', true);
assert.ok(logs.some(l => /Probe.*not a Device with an ON \/ OFF state/.test(l)));
store.setProp('alm_Quiet', 'active', true);
assert.equal(store.getProp('Horn', 'state'), false, 'an Alarm with no outputs switches nothing');
clearTimeout(store._persistTimer);

// the Importer: BruControl's one Digital Output goes in slot 1
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><Devices><Device><Name>Mega</Name><Ports>
<DevicePort i:type="DigitalOutPort"><ID>p1</ID><Number>30</Number></DevicePort></Ports></Device></Devices>
<Workspaces><Workspace><Name>Brew House</Name><Elements>
 <Element i:type="DeviceElement"><Name>Horn</Name><PortID>p1</PortID><X>0</X><Y>0</Y><Width>50</Width><Height>50</Height></Element>
 <Element i:type="AlarmElement"><ID>a1</ID><Name>Boil Alarm</Name><X>100</X><Y>0</Y><Width>50</Width><Height>50</Height><DigitalOutputID>p1</DigitalOutputID></Element>
</Elements></Workspace></Workspaces><Processes/></Configuration>`;
const r = importBruControl(xml, { names: 'bru' }), els = r.conv.elements;
const alm = els.find(e => e.type === 'alarm'), horn = els.find(e => e.bru?.portId === 'p1');
assert.ok(horn, 'the port came in'); assert.equal(alm.digitalOutput1, horn.name); assert.equal(alm.digitalOutput2, undefined);
console.log('alarm output tests passed');
