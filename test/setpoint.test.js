// .setpoint is the preferred name of the Setpoint, .target the older one (OakBarn Brewery, 2026-11-09: ".target for backward
// Compatibilty but .setpoint is perferred. Both do exactly the same.", Rule 6.19). Both read and set the one Setpoint.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store, attrsOf } from '../lib/store.js';
import { modernize } from '../lib/modernize.js';
import { HEAT_MAIN } from '../public/heatmethod.js';

const he = { name: 'hE_1', type: 'digitalOut', subtype: 'element', device: 'MB', channel: 40, input: 'Temp', heatMethod: 'pid', target: 150 };
const pid = { name: 'HLT_PID', type: 'pid', device: 'MB', channel: 41, input: 'Temp', target: 140 };
const step = { name: 'Step_1', type: 'stepper', device: 'MB', channel: 42 };
const man = { name: 'Zilla', type: 'manual' };
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'setpoint'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }], elements: [{ name: 'Temp', type: 'temperature', sensor: 'simulated' }, he, pid, step, man] }));
const s = new Store(cfg, path.join(d, 'data')); s.load();

assert.equal(s.getProp('hE_1', 'setpoint'), 150);
s.setProp('hE_1', 'setpoint', 155); assert.equal(s.getProp('hE_1', 'target'), 155);
s.setProp('hE_1', 'target', 160); assert.equal(s.getProp('hE_1', 'SetPoint'), 160);
s.setProp('HLT_PID', 'setpoint', 152); assert.equal(s.getProp('HLT_PID', 'target'), 152);
assert.equal(s.snapshotOne('hE_1').setpoint, 160);
// offered as .setpoint only; a stepper's .target (where it moves to) is not a Setpoint
assert.ok(attrsOf(he).includes('setpoint') && !attrsOf(he).includes('target'));
assert.ok(attrsOf(pid).includes('setpoint') && !attrsOf(pid).includes('target'));
assert.ok(attrsOf(step).includes('target') && !attrsOf(step).includes('setpoint'));
// a manual vessel widget keeps its own .setpoint
s.setProp('Zilla', 'setpoint', 148); assert.equal(s.getProp('Zilla', 'setpoint'), 148);
// dialogs say Setpoint
assert.equal(HEAT_MAIN.pid[1], 'Setpoint');
// the Importer writes a BruControl script's target as .setpoint
assert.equal(modernize('"HLT_PID" target = 152', n => n === 'HLT_PID' ? pid : undefined).text.trim(), 'HLT_PID.setpoint = 152');
assert.equal(modernize('"Step_1" target = 5', n => n === 'Step_1' ? step : undefined).text.trim(), 'Step_1.target = 5');
console.log('setpoint tests passed');
