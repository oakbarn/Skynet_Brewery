// Dual Throw (OakBarn Brewery, 2026-11-09, Rule 6.22, as BruControl's Dual Throw output): a Digital Out drives a second Port as its
// opposite (a valve's Open and Close wires). ON = own Port on, second off; OFF = own Port off, second on; never both on.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Hardware } from '../lib/hardware.js';
import { portKeys, portClash, hasDualThrow, freePins } from '../public/naming.js';
import { importBruControl } from '../lib/bruimport.js';

// the second Port is taken (Rule 6.1)
const valve = { name: 'MB_22_MBV_Valve', type: 'digitalOut', subtype: 'valve', device: 'MB', channel: 22, dualThrowChannel: 23, dualThrowDelay: 50 };
assert.deepEqual(portKeys(valve), ['MB|22', 'MB|23']);
assert.equal(hasDualThrow(valve), true);
assert.equal(hasDualThrow({ ...valve, dualThrowChannel: '' }), false, 'empty = None');
assert.equal(hasDualThrow({ ...valve, subtype: 'element' }), false, 'never on a Heating Element');
assert.equal(portClash({ name: 'Other', type: 'digitalOut', device: 'MB', channel: 23 }, [valve])?.other, 'MB_22_MBV_Valve');
const devs = [{ name: 'MB', type: 'serial', board: 'mega' }];
assert.ok(!freePins({ name: '\0new', type: 'digitalOut', device: 'MB' }, [valve], devs).map(String).includes('23'), 'the second Port drops off the Available Ports');

// the Brain switches both Ports, the one going off first and the other after the delay
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dualthrow'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }], elements: [valve, { name: 'MB_30_Inv', type: 'digitalOut', device: 'MB', channel: 30, activeLow: true, dualThrowChannel: 31 }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const hw = new Hardware(store), sent = [];
hw.devices.set('MB', { name: 'MB', send: l => sent.push(l) });
const wait = ms => new Promise(r => setTimeout(r, ms));

store.setProp('MB_22_MBV_Valve', 'state', true);
assert.deepEqual(sent, ['DO 23 0'], 'ON: the Close wire goes off first');
await wait(80);
assert.deepEqual(sent, ['DO 23 0', 'DO 22 1'], 'then, after the delay, the Open wire comes on');
sent.length = 0;
store.setProp('MB_22_MBV_Valve', 'state', false);
assert.deepEqual(sent, ['DO 22 0']);
store.setProp('MB_22_MBV_Valve', 'state', true);       // changed its mind before the delay: the waiting Close never comes on
await wait(80);
assert.deepEqual(sent, ['DO 22 0', 'DO 23 0', 'DO 22 1']);
sent.length = 0;
// no delay: both at once, still in break-before-make order; Active Low inverts both Ports
store.setProp('MB_30_Inv', 'state', true);
assert.deepEqual(sent, ['DO 31 1', 'DO 30 0']);
// a board that connects gets both Ports
sent.length = 0;
hw._resendOutputs({ name: 'MB', cfg: {}, send: l => sent.push(l) });
await wait(80);
assert.ok(sent.includes('DO 23 0') && sent.includes('DO 22 1') && sent.includes('DO 31 1') && sent.includes('DO 30 0'), sent.join(', '));
hw.devices.clear(); hw.stop();

// the Importer keeps BruControl's DualThrowPortNum and DualThrowDelay (both programs)
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
<Devices><Device><Name>Main Brewery</Name><Interface>Serial</Interface><SerialPort>5</SerialPort><TypeName>Mega 2560</TypeName><Enabled>true</Enabled>
 <Ports><DevicePort i:type="DigitalOutPort"><ID>p1</ID><Number>28</Number><DualThrowDelay>500</DualThrowDelay><DualThrowPortNum>29</DualThrowPortNum></DevicePort>
  <DevicePort i:type="DigitalOutPort"><ID>p2</ID><Number>30</Number><DualThrowDelay>0</DualThrowDelay><DualThrowPortNum>-1</DualThrowPortNum></DevicePort></Ports></Device></Devices>
<Workspaces><Workspace><Name>Brew House</Name><Elements>
 <Element i:type="DeviceElement"><ID>e1</ID><Name>Valve One</Name><PortID>p1</PortID><X>0</X><Y>0</Y><Width>50</Width><Height>50</Height></Element>
 <Element i:type="DeviceElement"><ID>e2</ID><Name>Lamp</Name><PortID>p2</PortID><X>100</X><Y>0</Y><Width>50</Width><Height>50</Height></Element>
</Elements></Workspace></Workspaces><Processes/></Configuration>`;
const r = importBruControl(xml), els = r.conv.elements;
const v = els.find(e => e.bru?.name === 'Valve One'), l = els.find(e => e.bru?.name === 'Lamp');
assert.deepEqual([v.channel, v.dualThrowChannel, v.dualThrowDelay], [28, 29, 500]);
assert.equal(l.dualThrowChannel, undefined, '-1 = no second Port');
assert.ok(JSON.stringify(r).includes('Dual Throw'), 'the Import notes list it');
clearTimeout(store._persistTimer);
console.log('dual throw tests passed');
process.exit(0);
