// Integrated Instances (OakBarn Brewery, 2026-11-09: "It is not a Clone but an Instance ... An Integrated Device Inherits its Properties
// ... and then becomes independent"; "change the Rule to allow an Integrated Instance"; "last one on or off Rules", Rule 6.1 exception).
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Hardware } from '../lib/hardware.js';
import { Engine, compile, tokenize } from '../lib/engine.js';
import { portClash, instanceFamily, isInstance } from '../public/naming.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'instances'));
const cfg = path.join(d, 'c.json');
const hE = { name: 'hE_1', type: 'digitalOut', subtype: 'element', device: 'MB', channel: 42, label: 'Element', heatMethod: 'onoff' };
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }], elements: [
  { name: 'Temp', type: 'temperature', sensor: 'simulated' },
  hE,
  { ...hE, name: 'HLT_Vessel.hE_1', instanceOf: 'hE_1', integratedIn: 'v1', integratedAs: 'ip:rElement', vpKind: 'element', input: 'Temp', heatMethod: 'hysteresis', target: 150 },
  { ...hE, name: 'BK_Vessel.hE_1', instanceOf: 'hE_1', integratedIn: 'v2', integratedAs: 'ip:rElement', vpKind: 'element', hidden: true },
  { name: 'Pump_1', type: 'digitalOut', subtype: 'pump', device: 'MB', channel: 43 },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const hw = new Hardware(store), sent = [];
hw.devices.set('MB', { name: 'MB', send: l => sent.push(l) });
const st = n => store.getProp(n, 'state');

// Rule 6.1: Instances share their Device's Port; anything else on it still clashes
const els = store.config.elements;
assert.ok(isInstance(els[2]) && !isInstance(els[1]));
assert.ok(instanceFamily(els[1], els[2]) && instanceFamily(els[2], els[3]));
assert.equal(portClash(els[2], els), null, 'an Instance may share its Device\'s Port');
assert.ok(portClash({ name: 'P', type: 'digitalOut', subtype: 'pump', device: 'MB', channel: 42 }, els), 'a Pump on that Port still clashes');

// each is independent: its own method and Setpoint
assert.equal(store.getProp('HLT_Vessel.hE_1', 'method'), 'Hysteresis');
assert.equal(store.getProp('hE_1', 'method'), 'Direct');

// the last one turned On takes the Port; the others go Off
store.setProp('hE_1', 'state', true);
assert.equal(st('hE_1'), true);
store.setProp('BK_Vessel.hE_1', 'state', true);
assert.deepEqual([st('hE_1'), st('BK_Vessel.hE_1'), st('HLT_Vessel.hE_1')], [false, true, false], 'last one On has the Port');
assert.equal(sent.at(-1), 'DO 42 1', 'the pin stays on for the one that has it');
// the last one turned Off turns the Port Off: every one on it is Off
store.setProp('hE_1', 'state', true);
store.setProp('BK_Vessel.hE_1', 'state', false);
assert.deepEqual([st('hE_1'), st('BK_Vessel.hE_1'), st('HLT_Vessel.hE_1')], [false, false, false], 'last one Off turns them all Off');
assert.equal(sent.at(-1), 'DO 42 0');

// a Process: VesselName.DeviceName = on, VesselName.DeviceName.setpoint (any capitals)
const t = tokenize('HLT_Vessel.hE_1.setpoint = 152', 1);
assert.equal(t[0].v, 'HLT_Vessel.hE_1', 'the first two words are one name');
assert.deepEqual(compile('HLT_Vessel.hE_1 = on\nHLT_Vessel.hE_1.setpoint = 152\nif hlt_vessel.HE_1 == on\nendif\nHLT_Vessel.hE_1.PID').errors, []);
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
assert.deepEqual(eng.check('HLT_Vessel.hE_1 = on\nHLT_Vessel.hE_1.setpoint = 152\nhE_1 = off').errors, []);
assert.ok(eng.check('Mash_Vessel.hE_1 = on').errors.length, 'no such Instance');
store.setProp('HLT_Vessel', 'hE_1', true, 'script');
assert.equal(st('HLT_Vessel.hE_1'), true, 'HLT_Vessel.hE_1 = on turns the Instance On');
assert.equal(store.getProp('hlt_vessel', 'HE_1'), true, 'read back, any capitals');
store.setProp('HLT_Vessel.hE_1', 'setpoint', 152, 'script');
assert.equal(store.getProp('HLT_Vessel.hE_1', 'setpoint'), 152);
assert.equal(store.getProp('hE_1', 'setpoint'), 0, 'the Device on the Tab keeps its own');

// Rule 2.47: no Hidden Lock on an Integrated Item; an old setting is ignored, and so is a Process's .hidden = true
assert.equal(store.getProp('BK_Vessel.hE_1', 'hidden'), false, 'the old Hidden Locked is ignored');
store.setProp('BK_Vessel.hE_1', 'hidden', true, 'script');
assert.equal(store.getProp('BK_Vessel.hE_1', 'hidden'), false, 'name.hidden = true does nothing to it');
store.setProp('hE_1', 'hidden', true, 'script');
assert.equal(store.getProp('hE_1', 'hidden'), true, 'the one on its Tab still has it');
clearTimeout(store._persistTimer);
console.log('integrated instance tests passed');
