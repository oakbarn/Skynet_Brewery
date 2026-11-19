// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Panel Updates 41: every Temperature Probe's display shows PV (its reading) over a green SV box (its Setpoint), like a panel controller.
// One Setpoint, never two: a probe a Heating Element holds shows and sets that Element's Setpoint; a probe nothing holds keeps its own
// (.setpoint, its Properties' Setpoint to start). One click on the SV box types a new one in place (no pop-up, Rule 2.44).
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Store, attrsOf } from '../lib/store.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(ROOT, 'public/app.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'public/style.css'), 'utf8');
const fn = name => { const i = app.indexOf(`function ${name}(`); assert.ok(i >= 0, name); return app.slice(i, app.indexOf('\n}\n', i)); };

// ---- the Brain: one Setpoint (the 3 Vessel 1 Pump sample: HLT and Kettle probes have a Heating Element, Mash has none)
{
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'probesv'));
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples/configs/three-vessel-one-pump/config.json'), 'utf8'));
  cfg.elements.find(e => e.name === 'BM1w1_2_Mash_BH').setpoint = 66;
  fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify(cfg));
  const s = new Store(path.join(d, 'c.json'), path.join(d, 'data')); s.load();
  const HLT = 'BM1w1_1_HLT_BH', EL = 'BM_8_DO@H_Element_HLT~element_BH', MASH = 'BM1w1_2_Mash_BH';
  assert.equal(s.getProp(HLT, 'setpoint'), s.getProp(EL, 'setpoint'), 'a held probe reads its Heating Element\'s Setpoint');
  s.setProp(HLT, 'setpoint', 70);
  assert.equal(s.getProp(EL, 'setpoint'), 70, 'HLT_probe.setpoint = 70 sets the Heating Element\'s Setpoint (one Setpoint)');
  s.setProp(EL, 'setpoint', 75);
  assert.equal(s.getProp(HLT, 'setpoint'), 75, 'and the other way');
  assert.equal(s.getProp(MASH, 'setpoint'), 66, 'a probe nothing holds starts with its Properties\' Setpoint');
  s.setProp(MASH, 'setpoint', 67.5);
  assert.equal(s.getProp(MASH, 'setpoint'), 67.5, 'and keeps its own');
  assert.ok(attrsOf(s.get(MASH)).includes('setpoint'), 'the Process editor offers .setpoint on a probe');
}

// ---- the Tab
const ps = fn('probeSv');
assert.match(ps, /if \(editing \|\| e\.look === 'dial' \|\| e\.look === 'bar'/, 'not in Edit layout, not on the Dial or Bar');
assert.match(ps, /t = probeHolder\(p\)/, 'what holds the probe gives the Setpoint');
assert.match(ps, /prop: t \? 'target' : 'setpoint', tgt: t \? t\.name : p\.name/, 'typing sets the holder\'s Setpoint, or the probe\'s own');
assert.match(fn('probeHolder'), /hs\.find\(on\) \|\| hs\[0\]/, 'two or more: the one that is ON, else the first');
assert.match(fn('fillPvSv'), /class: 'pvsv' \}, pv, box/, 'PV over SV inside the display');
assert.doesNotMatch(app, /pvsvVisible|showSV/, 'no Visible option: it is part of the display');
assert.match(app, /if \(e\.type === 'temperature'\) sv = probeSv\(e0, e, v\)/, 'every Temperature Probe');
assert.match(fn('svEdit'), /await setProp\(tgt, prop, x\)/, 'the box sets what it shows');
assert.match(app, /if \(ip\?\.type === 'temperature'\) for \(const pn of/, 'a Heating Element\'s new Setpoint shows on its probe at once');
assert.match(css, /\.pvsv \.pvRow \{[^}]*white-space: nowrap/, 'PV digits and °F / °C on one line');
assert.match(css, /\.svBox \{[^}]*white-space: nowrap/, 'SV digits and °F / °C on one line');
assert.match(app, /\['setpoint', 'Setpoint', 'num', null, false, false, \{ tip: DEVICE_TIPS\.pSetpoint/, 'a Setpoint row in the probe\'s Properties');
const pc = fn('probePvColor');
assert.match(pc, /return !on \? 'grey' : cools \? 'blue' : 'red'/, 'Duty Cycle, Direct: Red (heating) or Blue (cooling) while ON, Grey while OFF');
assert.match(pc, /if \(r >= lo && r <= hi\) return 'green'/, 'at the Setpoint (in its band): Green');
assert.match(pc, /\(cold \? 'blue' : 'red'\)/, 'below: Blue, above: Red');
assert.match(pc, /k === 'hysteresis' \? Math\.abs\(off\)/, 'Hysteresis: its Offset is the band');
assert.match(pc, /k === 'deadband' \? Math\.abs\(Number\(x\.deadbandoffset/, 'Deadband: its Deadband is the band');
assert.match(pc, /if \(!t\) return ''/, 'nothing uses the probe: its own Display color');
assert.match(fn('fillPvSv'), /pv\.classList\.add\('pv-' \+ sv\.color\)/, 'PV takes the color');
for (const [c, hex] of [['red', '#ff3b30'], ['blue', '#3fa9ff'], ['green', '#3ddc5a'], ['grey', '#9aa0a6']]) assert.ok(css.includes(`.pvRow.pv-${c} { color: ${hex}`), c);
console.log('probesv.test.js passed');
