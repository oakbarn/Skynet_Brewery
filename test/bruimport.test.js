// The NEW BruControl import function (lib/bruimport.js, Rule 15.4), step 1: Interfaces, Tabs, items on a board port,
// Placeholders, the names choice (Rule 15.1), and the Import Copy
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { importBruControl, PLACEHOLDER_MARK, pictureNamer } from '../lib/bruimport.js';
import { makeImportCopy } from '../lib/importer.js';

const xml = `\uFEFF<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="arr">
<Devices><Device><Name>Main Brewery</Name><Interface>Serial</Interface><SerialPort>5</SerialPort><TypeName>Mega 2560</TypeName><Enabled>true</Enabled>
 <Ports><DevicePort i:type="DigitalOutPort"><ID>p1</ID><Number>28</Number><Enabled>true</Enabled></DevicePort>
  <DevicePort i:type="AnalogInPort"><ID>p2</ID><Number>61</Number></DevicePort>
  <DevicePort i:type="CounterInPort"><ID>p3</ID><Number>2</Number></DevicePort></Ports></Device></Devices>
<Workspaces><Workspace><Name>Brew House</Name><BackgroundImagePath>C:\\BruControl\\Media\\back.png</BackgroundImagePath><Elements>
 <Element i:type="DeviceElement"><ID>e1</ID><Name>Lamp Red</Name><DisplayName>Red Lamp</DisplayName><Appearance><BackgroundImageIndex>2</BackgroundImageIndex><BackgroundImages><d:string>C:\\BruControl\\Media\\pump_off.png</d:string><d:string>E:\\Other\\pump_on.png</d:string><d:string i:nil="true"/></BackgroundImages></Appearance><PortID>p1</PortID><X>10</X><Y>20</Y><Width>100</Width><Height>60</Height></Element>
 <Element i:type="DeviceElement"><ID>e2</ID><Name>MB_61_Wort</Name><DisplayName i:nil="true"/><PortID>p2</PortID><X>200</X><Y>20</Y><Width>100</Width><Height>60</Height></Element>
 <Element i:type="DeviceElement"><ID>e3</ID><Name>Flow</Name><PortID>p3</PortID><X>0</X><Y>900</Y><Width>50</Width><Height>20</Height></Element>
 <Element i:type="TimerElement"><ID>e4</ID><Name>tm_Mash</Name><X>400</X><Y>100</Y><Width>120</Width><Height>50</Height></Element>
 <Element i:type="AlarmElement"><ID>e6</ID><Name>alm_Hops</Name><SoundFile>C:\\BruControl\\Media\\hops.wav</SoundFile><X>600</X><Y>10</Y><Width>80</Width><Height>40</Height></Element>
 <Element i:type="LabelElement"><ID>e5</ID><Name>gblV_x</Name><Appearance><BackgroundImageIndex>1</BackgroundImageIndex><BackgroundImages><d:string>D:\\My Pictures\\Brew\\hops.png</d:string></BackgroundImages><Visibility>Hidden</Visibility></Appearance><X>5</X><Y>5</Y><Width>10</Width><Height>10</Height></Element>
</Elements></Workspace></Workspaces>
<Processes><Process><Name>scrMash</Name><Script>sleep 1</Script></Process></Processes></Configuration>`;

const r = importBruControl(xml);
// Layer Order (Rule 1.29): BruControl's Z Order is the order of a Workspace's Elements list, the first one on top (1)
{ const ls = r.conv.elements.map(e => [e.name, e.layer]);
  assert.ok(ls.every(([, l]) => Number.isInteger(l) && l >= 1), 'every item gets a Layer Order');
  const lamp = r.conv.elements.find(e => /Lamp/i.test(e.name)), wort = r.conv.elements.find(e => /Wort/.test(e.name));
  assert.equal(lamp.layer, 1, 'the first Element in the file is on top'); assert.equal(wort.layer, 2); }
const c = r.conv;
assert.equal(c.devices.length, 1); assert.equal(c.devices[0].port, 'COM5'); assert.equal(c.devices[0].board, 'mega'); assert.equal(c.devices[0].id, 'MB');
assert.deepEqual(c.workspaces.map(w => [w.name, w.id]), [['Brew House', 'BH']]);
assert.equal(c.workspaces[0].background, undefined, 'no Tab backgrounds for now');
// only the items with an Interface and a Port that this step knows
assert.deepEqual(c.elements.filter(e => e.device).map(e => e.bru.name), ['Lamp Red', 'MB_61_Wort']);
// BruControl Application Elements become Skynet Widgets (OakBarn Brewery, 2026-11-08), named the Skynet way (Rule 3.14)
{ const tmw = c.elements.find(e => e.bru.name === 'tm_Mash'), alm = c.elements.find(e => e.bru.name === 'alm_Hops');
  assert.deepEqual([tmw.type, tmw.name, tmw.workspace, tmw.x, tmw.y, tmw.w, tmw.h], ['timer', 'wgt_TMR_tm_Mash_BH', 'Brew House', 400, 100, 120, 50]);
  assert.equal(tmw.hideName, true, 'no DisplayName: the Label is not shown');
  assert.equal(alm.type, 'alarm'); assert.equal(alm.sound, 'C:\\BruControl\\Media\\hops.wav');
  assert.deepEqual(r.report.appItems.map(x => [x.page, x.widget]), [['Timers', 'Timer Widget'], ['Alarms', 'Alarm Widget']]);
  const q = importBruControl(xml, { labels: { e4: 'Mash Timer' }, shows: { e4: true } });
  const t2 = q.conv.elements.find(e => e.bru.name === 'tm_Mash');
  assert.equal(t2.name, 'wgt_TMR_Mash~Timer_BH', 'the Label from the Widget page'); assert.equal(t2.hideName, undefined, 'Show ticked'); }
const [pump, wort] = c.elements.filter(e => e.device);
assert.equal(pump.type, 'digitalOut'); assert.equal(pump.device, 'Main Brewery'); assert.equal(pump.channel, 28);
assert.equal(pump.label, 'Red Lamp'); assert.equal(pump.hideName, undefined);
assert.equal(pump.name, 'MB_28_DO_Red~Lamp_BH', 'Skynet name, Rule 3.1');
// the brewer's own Interface ID from the ID page (OakBarn Brewery, 2026-11-08) goes into every name on that board
{ const q = importBruControl(xml, { ids: { 'Main Brewery': 'mz' } });
  assert.equal(q.conv.devices[0].id, 'MZ'); assert.equal(q.conv.elements[0].name, 'MZ_28_DO_Red~Lamp_BH');
  assert.ok(q.report.tabs.every(t => t.kinds && typeof t.kinds === 'object'), 'each Tab counts its Placeholders by kind');
  assert.equal(q.report.interfaces[0].id, 'MZ');
  assert.ok(q.report.portItems.every(e => e.device && e.name && 'port' in e), 'every item on a port is listed for its Interface'); assert.match(q.report.interfaces[0].connection, /^Serial: COM5/); }
// the user's own Labels from the items page (OakBarn Brewery, 2026-11-08), by BruControl element ID, make the names again
{ const id = pump.bru.id, q = importBruControl(xml, { labels: { [id]: 'Hot Liquor' } });
  assert.equal(q.conv.elements[0].label, 'Hot Liquor'); assert.equal(q.conv.elements[0].name, 'MB_28_DO_Hot~Liquor_BH');
  const it = q.report.portItems.find(e => e.bruId === id); assert.equal(it.display, 'Red Lamp', 'the Display Name is still shown');
  assert.equal(q.report.labelExamples.length, 3, 'a Heater, a Probe and a Valve');
  assert.ok(q.report.labelExamples.every(x => /_HLT_/.test(x.name)), 'every example uses HLT as its Label');
  assert.equal(new Set(q.report.labelExamples.map(x => x.name)).size, 3, '... and the three names are all different'); }
assert.equal(wort.label, 'MB_61_Wort', 'a blank DisplayName: Label = Name'); assert.equal(wort.hideName, true, '... not shown on the Tab');
assert.equal(wort.name, 'MB_61_AI_MB~61~Wort_BH'.replace(/~/g, '_'));
assert.equal(c.scripts.length, 0, 'Processes come later');
// a Placeholder for everything else, where BruControl had it; a hidden one stays hidden
assert.equal(c.graphics.length, 2);
const tm = c.graphics.find(g => g.placeholder.bruName === 'gblV_x');
assert.deepEqual([tm.kind, tm.workspace, tm.x, tm.y, tm.w, tm.h], ['text', 'Brew House', 5, 5, 60, 30]);
assert.ok(tm.text.startsWith(PLACEHOLDER_MARK) && tm.text.includes('gblV_x'));
assert.equal(c.graphics.find(g => g.placeholder.bruName === 'gblV_x').visible, false);
assert.equal(c.graphics.find(g => g.placeholder.bruName === 'Flow').placeholder.why, 'CounterInPort pins come later');
assert.equal(c.workspaces[0].height, 940, 'the Tab fits its items');
assert.equal(r.report.items, 2); assert.equal(r.report.widgets, 2); assert.equal(r.report.placeholders, 2);
assert.deepEqual(r.report.renames.map(x => x.from), ['Lamp Red', 'MB_61_Wort', 'tm_Mash', 'alm_Hops']);

// pictures and sounds (Fritz, 2026-11-06): their paths are imported and the files stay where they were (any folder) ...
assert.equal(pump.backpath, 'C:\\BruControl\\Media\\pump_off.png'); assert.equal(pump.backpath_2, 'E:\\Other\\pump_on.png'); assert.equal(pump.background, 2);
assert.deepEqual(c.graphics.find(g => g.placeholder.bruName === 'gblV_x').placeholder.pictures, ['D:\\My Pictures\\Brew\\hops.png'], 'a Placeholder with a picture on another path');
assert.deepEqual(c.elements.find(e => e.bru.name === 'alm_Hops').sounds, ['C:\\BruControl\\Media\\hops.wav', '', ''], 'the Alarm Widget keeps its sound');
// ... checked, never copied, unless asked
const asked = [];
const p1 = importBruControl(xml, { media: (from, to) => { asked.push([from, to]); return !from.startsWith('E:'); } });
assert.ok(asked.every(([, to]) => to === null), 'nothing copied by default');
assert.deepEqual(p1.report.media, { copy: false, pictures: 3, sounds: 1, found: 3, missing: [{ kind: 'picture', from: 'E:\\Other\\pump_on.png', path: 'E:\\Other\\pump_on.png' }] });
// the option: copies in media/Images/User and media/sounds/User, and the items point to the copies
const copied = [];
const p2 = importBruControl(xml, { copy: true, media: (from, to) => { copied.push([from, to]); return true; } });
assert.deepEqual(copied, [['C:\\BruControl\\Media\\pump_off.png', 'Images/User/pump_off.png'], ['E:\\Other\\pump_on.png', 'Images/User/pump_on.png'],
  ['D:\\My Pictures\\Brew\\hops.png', 'Images/User/hops.png'], ['C:\\BruControl\\Media\\hops.wav', 'sounds/User/hops.wav']]);
assert.equal(p2.conv.elements[0].backpath, 'Images/User/pump_off.png');
const nm = pictureNamer();
assert.equal(nm('C:\\A\\x.png'), 'Images/User/x.png'); assert.equal(nm('D:\\B\\x.png'), 'Images/User/x_2.png', 'same file name, other folder');
assert.equal(nm('c:\\a\\X.PNG'), 'Images/User/x.png', 'the same picture once');

// keep the BruControl names (Rule 15.1): spaces and characters a name may not have still change
const k = importBruControl(xml, { names: 'bru' });
assert.deepEqual(k.conv.elements.map(e => e.name), ['Lamp_Red', 'MB_61_Wort', 'tm_Mash', 'alm_Hops']);
assert.ok(k.conv.warnings.some(w => /kept your BruControl names/.test(w)));
assert.throws(() => importBruControl('<x/>'), /not a BruControl config file/);

// the Import Copy: BruControl's file is copied into Import\BruControl and only the copy is read
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bruimp-'));
const src = path.join(tmp, 'My Brewery.brucfg'); fs.writeFileSync(src, xml);
const copy = makeImportCopy(src, path.join(tmp, 'Import'), { ms: new Date(2026, 10, 6, 18, 5, 9).getTime() });
assert.equal(copy, path.join(tmp, 'Import', 'BruControl', 'My_Brewery_2026-11-06T180509.brucfg'));
assert.equal(fs.readFileSync(copy, 'utf8'), xml);
fs.rmSync(tmp, { recursive: true, force: true });
console.log('bruimport tests passed');

// the newest standard (OakBarn Brewery, 2026-11-08): a pump is a Skynet Pump Device (Rule 5.27), a control keeps its settings and
// its probe (.input, for the SetPoint click, Rule 2.43), "not user controlled" means a click does nothing (Rule 2.44)
{
  const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><Devices><Device><Name>Main</Name><Interface>Serial</Interface><Ports>
<DevicePort i:type="DigitalOutPort"><ID>d1</ID><Number>45</Number></DevicePort><DevicePort i:type="AnalogInPort"><ID>t1</ID><Number>54</Number></DevicePort>
<DevicePort i:type="PIDPort"><ID>p1</ID><Number>42</Number><InputPortID>t1</InputPortID><Kp>30</Kp><Ki>1</Ki><Target>170</Target><MaxOutput>100</MaxOutput></DevicePort>
<DevicePort i:type="DigitalOutPort"><ID>d2</ID><Number>43</Number></DevicePort></Ports></Device></Devices>
<Workspaces><Workspace><Name>Brew</Name><Elements>
<Element i:type="DeviceElement"><DisplayName>HLT Pump</DisplayName><ID>e1</ID><Name>M_HLT Pump</Name><UserControl>true</UserControl><Width>100</Width><Height>60</Height><X>0</X><Y>0</Y><PortID>d1</PortID></Element>
<Element i:type="DeviceElement"><DisplayName>HLT Temp</DisplayName><ID>e2</ID><Name>M_HLT Temp</Name><UserControl>false</UserControl><Width>100</Width><Height>60</Height><X>0</X><Y>100</Y><PortID>t1</PortID></Element>
<Element i:type="DeviceElement"><DisplayName>HLT PID</DisplayName><ID>e3</ID><Name>HLT PID</Name><UserControl>true</UserControl><Width>100</Width><Height>60</Height><X>0</X><Y>200</Y><PortID>p1</PortID></Element>
<Element i:type="DeviceElement"><DisplayName>Priority</DisplayName><ID>e4</ID><Name>Priority</Name><UserControl>false</UserControl><Width>100</Width><Height>60</Height><X>0</X><Y>300</Y><PortID>d2</PortID></Element>
</Elements></Workspace></Workspaces></Configuration>`;
  const r = importBruControl(xml, { names: 'skynet' }), by = n => r.conv.elements.find(e => e.bru.name === n);
  const pump = by('M_HLT Pump');
  assert.equal(pump.subtype, 'pump'); assert.equal(pump.w, 150); assert.equal(pump.h, 150);
  assert.match(pump.imageOff, /^Images\/Skynet\/Pumps\//); assert.equal(pump.tap, 'toggle');
  const pid = by('HLT PID');
  assert.equal(pid.input, by('M_HLT Temp').name, 'the probe by its Skynet name');
  assert.equal(pid.kp, 30); assert.equal(pid.target, 170); assert.equal(pid.maxOutput, 100);
  assert.equal(by('Priority').tap, 'none', 'not user controlled: a click does nothing');
  assert.equal(by('M_HLT Temp').tap, undefined, 'a probe keeps its SetPoint click');
  console.log('bruimport newest standard tests passed');
}
// Globals are only listed for now (OakBarn Brewery, 2026-11-08): no Placeholder, listed with their Tab
{ const x = xml.replace('</Elements>', '<Element i:type="GlobalVariableElement"><ID>g1</ID><Name>gMashTemp</Name></Element></Elements>');
  const q = importBruControl(x);
  assert.ok(q.report.globals.some(g => g.name === 'gMashTemp'), 'the Global is listed');
  assert.ok(!q.conv.graphics.some(g => g.placeholder?.bruName === 'gMashTemp'), '... and gets no Placeholder'); }
