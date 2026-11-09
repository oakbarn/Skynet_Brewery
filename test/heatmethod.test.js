// One Heating Element, the heating method picked (Fritz, 2026-11-07: "ONE device, but a to select the heating method via
// process or on the Device when clicked", Rule 6.19): .method is On/Off, Duty Cycle, Hysteresis, PID or Deadband; .state is ON;
// .output is the pin. Old Devices merged into it (BruControl's Duty Cycle + PID on one port) still answer to their names.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Control } from '../lib/control.js';
import { Hardware } from '../lib/hardware.js';
import { heatMethodKey, heatMethodWord, isHeatElem } from '../public/heatmethod.js';

assert.equal(heatMethodKey('PID'), 'pid');
assert.equal(heatMethodKey('duty cycle'), 'dutyCycle');
assert.equal(heatMethodKey('DutyC'), 'dutyCycle');
assert.equal(heatMethodKey('HYS'), 'hysteresis');
assert.equal(heatMethodKey('On/Off'), 'onoff');
assert.equal(heatMethodKey('DeadB'), 'deadband');
assert.equal(heatMethodKey('bogus'), null);
assert.equal(heatMethodWord('dutyCycle'), 'Duty Cycle');

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'heatmethod'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }], elements: [
  { name: 'Temp', type: 'temperature', sensor: 'simulated' },
  { name: 'hE_PID_1', type: 'digitalOut', subtype: 'element', device: 'MB', channel: 42, input: 'Temp', heatMethod: 'pid', target: 152, kp: 20, ki: 0, kd: 0, methodSpot_dutyCycle: true, methodSpot_hysteresis: true, methodSpot_onoff: true,
    heatControls: [{ name: 'HLT_PID', method: 'PID' }, { name: 'M_HLT_Heat', method: 'Duty Cycle' }] },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const ctl = new Control(store);
const hw = new Hardware(store), sent = [];
hw.devices.set('MB', { name: 'MB', send: l => sent.push(l) });
const g = p => store.getProp('hE_PID_1', p);
assert.ok(isHeatElem(store.get('hE_PID_1')));
assert.equal(g('method'), 'PID', 'starts with the method in its Properties');
assert.equal(g('target'), 152);
assert.equal(g('state'), false);

// PID: ON, the output % is worked out and the pin (.output) follows it; .state stays ON
store.setProp('Temp', 'value', 140);
store.setProp('hE_PID_1', 'state', true);
assert.equal(g('enabled'), true, '.enabled is the same as ON');
let t = 0; for (let i = 0; i < 5; i++) ctl.tick(t += 1000);
assert.ok(g('value') > 0, 'PID works out an output %');
assert.equal(g('state'), true);
assert.throws(() => store.setProp('hE_PID_1', 'output', true), /pin right now/, 'a Process cannot set the pin');

// Duty Cycle by a Process, while running: carries on in the new method
store.setProp('hE_PID_1', 'method', 'Duty Cycle');
store.setProp('hE_PID_1', 'dutycycle', 50);
assert.equal(g('method'), 'Duty Cycle');
assert.equal(g('state'), true, 'still ON');
let on = 0; for (let i = 0; i < 10; i++) { ctl.tick(i * 100); on += g('output') ? 1 : 0; }
assert.equal(on, 5, '50 % of each 1 s cycle');
sent.length = 0; ctl.tick(0); ctl.tick(600);
assert.ok(sent.some(l => l === 'DO 42 0') || sent.some(l => l === 'DO 42 1'), 'the pin follows .output');

// Hysteresis: on below Target - offset, off at the Target
store.setProp('hE_PID_1', 'method', 'HYS');
store.setProp('hE_PID_1', 'onoffset', 2);
store.setProp('Temp', 'value', 149); ctl.tick(t += 1000);
assert.equal(g('output'), true, 'below 150: on');
store.setProp('Temp', 'value', 152.5); ctl.tick(t += 1000);
assert.equal(g('output'), false, 'at the Target: off');

// back to On/Off: turned OFF first, never full on by itself
store.setProp('hE_PID_1', 'method', 'On/Off');
assert.equal(g('state'), false, 'switching to On/Off turns it off');
assert.equal(g('output'), false);
sent.length = 0;
store.setProp('hE_PID_1', 'state', true);
assert.deepEqual(sent, ['DO 42 1'], 'On/Off: the pin is .state');
store.setProp('hE_PID_1', 'state', false);
assert.throws(() => store.setProp('hE_PID_1', 'method', 'Steam'), /On\/Off, Duty Cycle, Hysteresis, PID, Deadband/);
assert.throws(() => store.setProp('hE_PID_1', 'method', 'Deadband'), /may only use On\/Off, Duty Cycle, Hysteresis, PID \(tick Deadband/, 'Deadband is not ticked');

// the old names merged into it (Rule 6.19): HLT_PID = true switches it to PID and turns it ON
assert.ok(store.has('HLT_PID'));
store.setProp('HLT_PID', 'enabled', true);
assert.equal(g('method'), 'PID'); assert.equal(g('state'), true);
assert.equal(store.getProp('HLT_PID', 'enabled'), true);
assert.equal(store.getProp('M_HLT_Heat', 'enabled'), false, 'the Duty Cycle name is not ON: it is in PID');
store.setProp('M_HLT_Heat', 'dutycycle', 70);
assert.equal(g('dutycycle'), 70, 'settings go to the one Element');
store.setProp('M_HLT_Heat', 'state', true);
assert.equal(g('method'), 'Duty Cycle', 'M_HLT_Heat = true: Duty Cycle');
store.setProp('HLT_PID', 'enabled', false);
assert.equal(g('state'), true, 'turning off the name not in use leaves it alone');
store.setProp('M_HLT_Heat', 'state', false);
assert.equal(g('state'), false);

// Schema switch: everything off
store.setProp('hE_PID_1', 'state', true);
hw.allOff();
assert.equal(g('state'), false);
console.log('heatmethod tests passed');

// The BruControl Importer (Rule 6.19): a Duty Cycle and a PID on one port (Tartan.brucfg port 42) are ONE Heating Element
{
  const { importBruControl } = await import('../lib/bruimport.js');
  const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
<Devices><Device><Name>Main Panel</Name><Interface>Serial</Interface><SerialPort>3</SerialPort><TypeName>Mega 2560</TypeName>
 <Ports><DevicePort i:type="DutyCyclePort"><ID>p1</ID><Number>42</Number></DevicePort><DevicePort i:type="PIDPort"><ID>p2</ID><Number>42</Number></DevicePort>
  <DevicePort i:type="DigitalOutPort"><ID>p3</ID><Number>28</Number></DevicePort><DevicePort i:type="PIDPort"><ID>p4</ID><Number>30</Number></DevicePort></Ports></Device></Devices>
<Workspaces><Workspace><Name>Brew House</Name><Elements>
 <Element i:type="DeviceElement"><ID>e1</ID><Name>M_HLT Heat</Name><DisplayName>HLT Heat</DisplayName><PortID>p1</PortID><X>10</X><Y>20</Y><Width>100</Width><Height>60</Height></Element>
 <Element i:type="DeviceElement"><ID>e2</ID><Name>HLT PID</Name><DisplayName>HLT PID</DisplayName><PortID>p2</PortID><X>300</X><Y>20</Y><Width>100</Width><Height>60</Height></Element>
 <Element i:type="DeviceElement"><ID>e3</ID><Name>Pump</Name><PortID>p3</PortID><X>10</X><Y>200</Y><Width>100</Width><Height>60</Height></Element>
 <Element i:type="DeviceElement"><ID>e4</ID><Name>Mash PID</Name><PortID>p4</PortID><X>10</X><Y>300</Y><Width>100</Width><Height>60</Height></Element>
</Elements></Workspace></Workspaces></Configuration>`;
  const { conv, report } = importBruControl(xml);
  const heat = conv.elements.filter(e => e.channel === 42);
  assert.equal(heat.length, 1, 'one Device on port 42');
  const [h] = heat;
  assert.deepEqual([h.type, h.subtype, h.heatMethod], ['digitalOut', 'element', 'dutyCycle'], 'a Heating Element starting in the first one\'s method');
  assert.deepEqual(h.heatControls.map(c => [c.name, c.bruName, c.method]), [['M_HLT_Heat', 'M_HLT Heat', 'Duty Cycle'], ['HLT_PID', 'HLT PID', 'PID']]);
  assert.equal(h.name, 'MP_42_HE_HLT~Heat_BH', 'a Heating Element is HE (Rule 3.1)');
  assert.ok(h.methodSpot_dutyCycle && h.methodSpot_pid, 'a one-click spot for Duty Cycle and for PID');
  const cl = conv.graphics.find(g => g.kind === 'clone');
  assert.deepEqual([cl.of, cl.x, cl.y], [h.name, 300, 20], 'the second placing is a Clone of it');
  assert.deepEqual([cl.method, cl.label], ['PID', 'HLT PID'], 'a Method Clone standing for PID, with its BruControl Label (Rule 4.4)');
  assert.equal(conv.elements.find(e => e.channel === 30).type, 'pid', 'a PID alone on its port stays as it is');
  assert.equal(report.heaters.length, 1);
  assert.equal(report.placeholders, 0, 'a Clone is not a Placeholder');
  assert.ok(conv.warnings.some(w => /ONE Heating Element/.test(w) && /M_HLT Heat \(Duty Cycle\) or HLT PID \(PID\)/.test(w)));
  assert.deepEqual(report.renames.filter(r => r.to === h.name).map(r => r.from), ['M_HLT Heat', 'HLT PID'], 'both BruControl names lead to it');
}
console.log('heatmethod import tests passed');

// The Process editor offers the methods of control after ".method =" (Fritz, 2026-11-07: "add something in the Process method for
// things that have more than on method of control to chhose the one you want to use")
{
  const { suggest } = await import('../public/autofill.js');
  const { controlMethods } = await import('../public/heatmethod.js');
  const { attrsOf } = await import('../lib/store.js');
  const el = { type: 'digitalOut', subtype: 'element', name: 'hE_HLT_1', heatMethod: 'dutyCycle', methodSpot_onoff: true, methodSpot_hysteresis: true, methodSpot_pid: true, methodSpot_deadband: true };
  assert.deepEqual(controlMethods(el), ['On/Off', 'Duty Cycle', 'Hysteresis', 'PID', 'Deadband']);
  // only the main method and the ticked ones are allowed (Fritz, 2026-11-07: "Only Checked Methods are allowed")
  assert.deepEqual(controlMethods({ type: 'digitalOut', subtype: 'element', heatMethod: 'pid', methodSpot_dutyCycle: true }), ['On/Off', 'Duty Cycle', 'PID']);
  assert.deepEqual(controlMethods({ type: 'digitalOut', subtype: 'element', heatMethod: 'pid' }), ['On/Off', 'PID'], 'On/Off is always allowed, not a choice (Fritz, 2026-11-08)');
  assert.equal(controlMethods({ type: 'digitalOut', subtype: 'element' }), null, 'On/Off only: one way of control');
  assert.equal(controlMethods({ type: 'digitalOut', subtype: 'pump' }), null, 'a Pump has one way of control');
  assert.ok(attrsOf(el).includes('method'));
  const words = { elements: [{ name: 'hE_HLT_1', type: 'digitalOut', main: 'state', attrs: attrsOf(el), bools: [''], methods: controlMethods(el) }], processes: [], tabs: [] };
  const list = suggest('hE_HLT_1.method = ', words, 'hE_HLT_1.method = ', 'hE_HLT_1.method = ', false)?.list.map(i => i.text);
  assert.deepEqual(list, ['"On/Off"', '"Duty Cycle"', '"Hysteresis"', '"PID"', '"Deadband"']);
  const m = suggest('hE_HLT_1 ', words, 'hE_HLT_1 ', 'hE_HLT_1 ', true)?.list.find(i => i.text === '.method = ');
  assert.ok(m, '.method = is offered after the name'); assert.match(m.hint, /how it is controlled: On\/Off, Duty Cycle/);
}
console.log('heatmethod Process editor tests passed');

// One Interface Port, one Device (Fritz, 2026-11-07, Rule 6.1): a new Device is never offered a port in use, of any Device Type
{
  const { freePins, portClash } = await import('../public/naming.js');
  const devices = [{ name: 'MB', type: 'serial', board: 'mega' }];
  const els = [{ name: 'hE_PID_1', type: 'digitalOut', subtype: 'element', device: 'MB', channel: 42 }];
  assert.ok(!freePins({ type: 'pid', device: 'MB', name: '\0new' }, els, devices).map(String).includes('42'), 'port 42 is not offered to a new PID');
  assert.ok(portClash({ type: 'pid', device: 'MB', channel: 42, name: '\0new' }, els), 'a new Device on a used port clashes');
  assert.equal(portClash({ type: 'pid', device: 'MB', channel: 42, name: 'Old_PID' }, els), null, 'two that shared in an older Schema keep working');
}
console.log('one port one Device tests passed');

// One-click method spots (Rule 6.19): the Import ticks the joined methods; the Panel shows them only with two or more
{
  const app = (await import('node:fs')).readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /return l\.length > 1 \? l : \[\];/, 'spots only when more than one method is ticked');
  assert.match(app, /\n  setProp\(name, 'method', heatMethodWord\(k\)\);\n\}, true\);/, 'one click switches the method, nothing more');
  assert.match(app, /if \(k === 'off'\) return setProp\(name, 'state', false\);/, 'the Turn Off spot turns it Off');
  assert.doesNotMatch(app, /wasOn && e\)[^\n]*heatDialog/, 'a spot clicked while Off does not open a pop-up or turn it ON (Rule 6.19)');
  assert.match(app, /const isMethodClone = \(g, p = [^\n]+controlMethods\(p\)/, 'Method Clones only for Devices with more than one Control Method');
  assert.match(app, /state: !!v0\.state && heatMethodKey\(v0\.method\) === e0\.cloneMethod/, 'a Method Clone is ON only in its method');
}
console.log('method spots tests passed');

// the short way to switch the method (Fritz, 2026-11-07: "MB_25_HE_HLT_BR.HYS or MB_25_HE_HLT_BR.DutyC")
{
  const { compile } = await import('../lib/engine.js');
  const st = compile('MB_25_HE_HLT_BR.HYS\nMB_25_HE_HLT_BR.DutyC\n"MB_25_HE_HLT_BR".PID\nMB_25_HE_HLT_BR.Deadband\nMB_25_HE_HLT_BR.DO').stmts.filter(s => s.op === 'assign');
  assert.deepEqual(st.map(s => [s.target.name, s.target.prop, s.expr.v]), [['MB_25_HE_HLT_BR', 'method', 'Hysteresis'], ['MB_25_HE_HLT_BR', 'method', 'Duty Cycle'],
    ['MB_25_HE_HLT_BR', 'method', 'PID'], ['MB_25_HE_HLT_BR', 'method', 'Deadband'], ['MB_25_HE_HLT_BR', 'method', 'On/Off']]);
  assert.match(compile('MB_25_HE_HLT_BR.Steam').errors[0].msg, /Do not understand/);
}

// A built in Element that is still an old control Device becomes one Heating Element on load (Fritz, 2026-11-07: "The only thing
// that seems to be missing is the Element Method Field and the Hotspots")
{
  const { assignIds } = await import('../public/naming.js');
  const { controlMethods } = await import('../public/heatmethod.js');
  const c = { devices: [], workspaces: [], elements: [
    { name: 'HLT_Heat', type: 'hysteresis', target: 150, onOffset: 1, integratedIn: 'v_HLT', integratedAs: 'ip:rElement', vpKind: 'element' },
    { name: 'RIMS_Heat', type: 'pid', kp: 9, integratedIn: 'r1', integratedAs: 'heat' },
    { name: 'Own_PID', type: 'pid' }] };
  assignIds(c);
  assert.deepEqual([c.elements[0].type, c.elements[0].subtype, c.elements[0].heatMethod, c.elements[0].target, c.elements[0].name], ['digitalOut', 'element', 'hysteresis', 150, 'HLT_Heat']);
  assert.equal(c.elements[1].heatMethod, 'pid'); assert.equal(c.elements[1].kp, 9);
  assert.equal(c.elements[2].type, 'pid', 'a PID of its own (not built in) stays as it is');
  const { readFileSync } = await import('node:fs');
  const s = JSON.parse(readFileSync(new URL('../samples/configs/three-vessel-one-pump/config.json', import.meta.url), 'utf8').replaceAll('BM_8_HE_HLT~element_BR', 'HLT_Heat'));   // its Skynet name (Rule 3.1) read as the old one here
  const hlt = s.elements.find(e => e.name === 'HLT_Heat');
  assert.deepEqual(controlMethods(hlt), ['On/Off', 'Duty Cycle', 'Hysteresis', 'PID'], 'the Three Vessel sample HLT: Hysteresis, with Duty Cycle and PID ticked, so it has spots');
}
console.log('built in Element upgrade tests passed');

// The Cool / Warm Pump (OakBarn Brewery, 2026-11-08, Rule 6.21): one Pump with a Method, On/Off or Hysteresis; a minus On offset cools
{
  const { isCoolPump, allowedMethods } = await import('../public/heatmethod.js');
  const { defaultCode } = await import('../public/naming.js');
  const d2 = fs.mkdtempSync(path.join(os.tmpdir(), 'coolpump'));
  const cfg2 = path.join(d2, 'c.json');
  fs.writeFileSync(cfg2, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }], elements: [
    { name: 'Ferm_Temp', type: 'temperature', sensor: 'simulated' },
    { name: 'MB_5_CPMP_Cool~Pump_FR', type: 'digitalOut', subtype: 'pump', device: 'MB', channel: 5, input: 'Ferm_Temp', heatMethod: 'hysteresis', target: 66, onOffset: -1 }] }));
  const s2 = new Store(cfg2, path.join(d2, 'data')); s2.load();
  const c2 = new Control(s2);
  const pumpEl = s2.get('MB_5_CPMP_Cool~Pump_FR'), gp = p => s2.getProp('MB_5_CPMP_Cool~Pump_FR', p);
  assert.ok(isCoolPump(pumpEl)); assert.ok(!isHeatElem(pumpEl), 'it is a Pump, not a Heating Element');
  assert.equal(defaultCode(pumpEl), 'CPMP'); assert.equal(defaultCode({ type: 'digitalOut', subtype: 'pump' }), 'Pump', 'a plain pump stays Pump');
  assert.deepEqual(allowedMethods(pumpEl), ['onoff', 'hysteresis']);
  assert.equal(gp('method'), 'Hysteresis');
  s2.setProp('MB_5_CPMP_Cool~Pump_FR', 'state', true);
  let t2 = 0;
  s2.setProp('Ferm_Temp', 'value', 68); c2.tick(t2 += 1000);
  assert.equal(gp('output'), true, 'warmer than the Target: the glycol pump runs');
  s2.setProp('Ferm_Temp', 'value', 65.5); c2.tick(t2 += 1000);
  assert.equal(gp('output'), false, 'at the Target: it stops');
  assert.throws(() => s2.setProp('MB_5_CPMP_Cool~Pump_FR', 'method', 'PID'), /may only use/, 'a pump is never run by PID');
  console.log('cool / warm pump ok');
}

// .setpoint and .target, the one Setpoint (Rule 6.19, 2026-11-09)
await import('./setpoint.test.js');
