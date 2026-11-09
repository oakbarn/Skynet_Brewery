// Boolean Widgets (OakBarn Brewery, 2026-11-09, Rule 1.20): Switch, Slider, Checkbox, Lighted Button, Push Button, Pulse Button and
// LED, each its own sub-Widget with a fixed look; a Linked Device makes it act like a Clone of that Device; the BruControl Import
// turns a Toggle Switch into the Boolean Widget picked, with its Linked Device
import assert from 'node:assert/strict';
import { BOOL_STYLES, boolStyleOf, setBoolStyle, SWITCH_LOOKS, hasDeviceControlled } from '../public/semi.js';
import { widgetTypeId, WIDGET_TYPE_IDS } from '../public/naming.js';
import { importBruControl } from '../lib/bruimport.js';

assert.deepEqual(BOOL_STYLES.map(s => s[1]), ['Switch', 'Slider', 'Checkbox', 'Lighted Button', 'Push Button', 'Pulse Button', 'LED']);
for (const k of SWITCH_LOOKS) {
  const el = setBoolStyle({ name: 'x' }, k);
  assert.equal(el.type, 'switch', `${k} taps like a Switch`); assert.equal(el.boolStyle, k);
  assert.ok(hasDeviceControlled(el), `${k} has a Linked Device`); assert.equal(boolStyleOf(el), k);
}
assert.deepEqual(['slider', 'checkbox', 'lighted'].map(k => widgetTypeId(setBoolStyle({}, k))), ['SLD', 'CHK', 'LTB'], 'own name letters (Rule 3.14)');
assert.equal(widgetTypeId({ type: 'switch' }), 'SW'); assert.equal(widgetTypeId({ type: 'switch', boolStyle: 'nonsense' }), 'SW');
assert.equal(boolStyleOf({ type: 'led' }), 'led'); assert.equal(boolStyleOf({ type: 'digitalOut' }), '');
assert.equal(setBoolStyle({}, 'led').look, 'indicator');
assert.ok(!Object.keys(WIDGET_TYPE_IDS).includes('slider'), 'the Widget Type list itself is unchanged');

// the Importer: a Toggle Switch becomes the Boolean Widget picked, linked to an imported Device
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="arr">
<Devices><Device><Name>Main Brewery</Name><Interface>Serial</Interface><SerialPort>5</SerialPort><TypeName>Mega 2560</TypeName><Enabled>true</Enabled>
 <Ports><DevicePort i:type="DigitalOutPort"><ID>p1</ID><Number>28</Number><Enabled>true</Enabled></DevicePort>
  <DevicePort i:type="AnalogInPort"><ID>p2</ID><Number>61</Number></DevicePort></Ports></Device></Devices>
<Workspaces><Workspace><Name>Brew House</Name><Elements>
 <Element i:type="DeviceElement"><ID>e1</ID><Name>Mash Pump</Name><DisplayName>Mash Pump</DisplayName><PortID>p1</PortID><X>10</X><Y>20</Y><Width>100</Width><Height>60</Height></Element>
 <Element i:type="DeviceElement"><ID>e2</ID><Name>Probe</Name><PortID>p2</PortID><X>200</X><Y>20</Y><Width>100</Width><Height>60</Height></Element>
 <Element i:type="ToggleSwitchElement"><ID>e9</ID><Name>Stir</Name><DisplayName>Stir</DisplayName><X>400</X><Y>100</Y><Width>80</Width><Height>40</Height></Element>
</Elements></Workspace></Workspaces><Processes/></Configuration>`;
{ const r = importBruControl(xml), sw = r.conv.elements.find(e => e.bru?.name === 'Stir');
  assert.equal(sw.type, 'switch'); assert.equal(sw.boolStyle, undefined); assert.equal(sw.deviceControlled, undefined);
  assert.equal(sw.name, 'wgt_SW_Stir_BH');
  const it = r.report.appItems.find(x => x.bruId === 'e9');
  assert.deepEqual([it.widget, it.style, it.link], ['Boolean Widget', 'switch', '']);
  assert.deepEqual(r.report.linkable.map(d => d.key), ['e1'], 'only Devices with an ON / OFF state may be linked'); }
{ const r = importBruControl(xml, { styles: { e9: 'slider' }, links: { e9: 'e1' } }), sw = r.conv.elements.find(e => e.bru?.name === 'Stir');
  const pump = r.conv.elements.find(e => e.bru?.id === 'e1');
  assert.deepEqual([sw.type, sw.boolStyle, sw.deviceControlled, sw.name], ['switch', 'slider', pump.name, 'wgt_SLD_Stir_BH']);
  assert.equal(r.report.appItems.find(x => x.bruId === 'e9').pre, 'wgt_SLD'); }
{ const r = importBruControl(xml, { styles: { e9: 'led' }, links: { e9: 'e2' } }), sw = r.conv.elements.find(e => e.bru?.name === 'Stir');
  assert.deepEqual([sw.type, sw.look, sw.deviceControlled, sw.name], ['led', 'indicator', undefined, 'wgt_LED_Stir_BH'], 'a probe can not be linked'); }
console.log('boolwidget tests passed');
