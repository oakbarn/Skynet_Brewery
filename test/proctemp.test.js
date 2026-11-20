// Processes work in °C (Rule 2.59, Panel Updates Sandbox entry 9): a Process reads and sets every temperature in °C, a probe kept in
// °F is turned where the Process reads or sets it, and 152°F typed with its degree sign is 66.6667 °C (an Offset: a difference)
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, compile, tokenize } from '../lib/engine.js';
import { procTemp, tempKind, unitsOnSave, unitsOnShow } from '../lib/proctemp.js';

const near = (a, b, m) => assert.ok(Math.abs(a - b) < 1e-3, `${m}: ${a} vs ${b}`);
// the degree sign
near(tokenize('152°F', 1)[0].v, 66.6667, '152°F'); near(tokenize('66.7 °C', 1)[0].v, 66.7, '66.7 °C');
assert.equal(tokenize('152', 1)[0].v, 152, 'plain number unchanged');
assert.equal(tokenize('X_°F.value', 1)[0].t, 'id', 'a name with ° is still a name');
assert.deepEqual(compile('a = 152°F\n').errors, []);

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'proctemp'));
const cfg = path.join(d, 'c.json');
const els = [
  { name: 'TF', type: 'temperature', sensor: 'simulated', units: '°F' },       // an older probe kept in °F
  { name: 'TC', type: 'temperature', sensor: 'simulated', units: '°C' },       // the 3 Vessel Sample's: °C
  { name: 'HF', type: 'digitalOut', subtype: 'element', device: 'MB', channel: 40, input: 'TF', heatMethod: 'hysteresis', target: 150, onOffset: -1 },
  { name: 'HC', type: 'digitalOut', subtype: 'element', device: 'MB', channel: 41, input: 'TC', heatMethod: 'hysteresis', target: 65.5556, onOffset: -0.5556 },
];
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: els }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const get = n => store.get(n);
assert.deepEqual(procTemp(get('HF'), 'setpoint', get), { kind: 'abs', own: '°F' });
assert.deepEqual(procTemp(get('HF'), 'onoffset', get), { kind: 'diff', own: '°F' });
assert.equal(procTemp(get('HC'), 'setpoint', get), null, 'kept in °C: nothing to turn');
assert.equal(tempKind(get('HC'), 'onoffset'), 'diff'); assert.equal(tempKind(get('HC'), 'state'), null);

const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 3000) => { const t = Date.now(); while (Date.now() - t < ms) { if (f()) return true; await new Promise(r => setTimeout(r, 20)); } return false; };
const run = async (name, text) => { eng.write(name, text); eng.start(name); assert.ok(await until(() => !eng.running.has(name)), `${name} ends`); };
// in °C on a °F probe: kept as °F
await run('a', 'HF.setpoint = 66.6667\nHF.onoffset = -1°F\nHC.setpoint = 152°F\nHC.onoffset = -1°F\n');
near(store.getProp('HF', 'target'), 152, '66.6667 °C on a °F probe is kept as 152 °F');
near(store.getProp('HF', 'onoffset'), -1, '-1°F Offset on a °F probe');
near(store.getProp('HC', 'target'), 66.6667, '152°F on a °C probe is kept as 66.6667 °C');
near(store.getProp('HC', 'onoffset'), -0.5556, '-1°F Offset is -0.5556 °C (no 32)');
// a Process reads °C from a °F probe
await run('b', 'new value v\nv = HF.setpoint\nHC.setpoint = v\n');
near(store.getProp('HC', 'target'), 66.6667, 'read from a °F probe as °C');
// one warning for a plain number hotter than boiling
const w = eng.check('HC.setpoint = 152\n').warnings;
assert.equal(w.length, 1); assert.match(w[0].msg, /write 152°F/);
assert.equal(eng.check('HC.setpoint = 152°F\nHC.setpoint = 66\n').warnings.length, 0);

// a plain 152 typed in the Units (OakBarn Brewery, 2026-11-19: "we need the use to be able to type 152"): kept in °C when saved,
// shown back in the Units when opened; an Offset or += is a difference; a number in a formula with a temperature gets one warning
const typed = 'HC.setpoint = 152\nHC.onoffset = -1\nwait TC >= 150\nif 150 < TC.value\nendif\nHC.setpoint = 152°F\nHC.setpoint += 2\nnew value g\nHC.setpoint = g + 2\n';
const kept = unitsOnSave(typed, 'US', get, tokenize);
assert.deepEqual(kept.text.split('\n').slice(0, 7), ['HC.setpoint = 66.6667°C', 'HC.onoffset = -0.5556°C', 'wait TC >= 65.5556°C', 'if 65.5556°C < TC.value', 'endif', 'HC.setpoint = 152°F', 'HC.setpoint += 1.1111°C']);
assert.deepEqual(kept.unsure, [9], 'g + 2: one warning, left as typed');
assert.equal(unitsOnShow(kept.text, 'US', get, tokenize), typed, 'opened in US: exactly what was typed');
assert.equal(unitsOnSave(unitsOnShow(kept.text, 'US', get, tokenize), 'US', get, tokenize).text, kept.text, 'open and save: no drift');
assert.match(unitsOnShow(kept.text, 'Metric', get, tokenize), /HC.setpoint = 66.6667\nHC.onoffset = -0.5556\n/, 'switched to Metric: the same °C');
assert.equal(unitsOnSave('HC.setpoint = 66.7\n', 'Metric', get, tokenize).text, 'HC.setpoint = 66.7°C\n');
assert.equal(unitsOnShow('HC.setpoint = 101.7\n', 'US', get, tokenize), 'HC.setpoint = 215.06\n', 'a Sample\'s plain number is °C');
// it runs as typed: 152 in US is 66.6667 °C on the °C probe and 152 on the °F probe
await run('c', unitsOnSave('HC.setpoint = 152\nHF.setpoint = 152\n', 'US', get, tokenize).text);
near(store.getProp('HC', 'target'), 66.6667, 'US 152 on a °C probe'); near(store.getProp('HF', 'target'), 152, 'US 152 on a °F probe');
console.log('proctemp: OK');
