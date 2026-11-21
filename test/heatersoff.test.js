// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// all_heaters_off (OakBarn Brewery, 2026-11-21: "new command heaters_off and turn off all heaters"; "yes match" = named like
// all_pumps_off; Rule 6.15, Help 100): every heater off, the same list as step 1 of Emergency Off (Rule 6.41, lib/heatersoff.js).
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, KEYWORDS, compile } from '../lib/engine.js';
import { isHeater, heatersOff } from '../lib/heatersoff.js';
import { suggest } from '../public/autofill.js';

const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
assert.ok(KEYWORDS.has('all_heaters_off'));

const els = [
  { name: 'HLT_HE', label: 'HLT Element', type: 'digitalOut', subtype: 'element', heatMethod: 'pid' },
  { name: 'BK_HE', type: 'digitalOut', subtype: 'element', heatMethod: 'hysteresis' },
  { name: 'Old_PID', type: 'pid' },
  { name: 'Burner_Gas', type: 'digitalOut', typeCode: 'Valve_Sgas', flameIgniter: 'Igniter_1' },
  { name: 'Igniter_1', type: 'digitalOut' },
  { name: 'Pump_1', type: 'digitalOut', subtype: 'pump' },
  { name: 'V_1', type: 'digitalOut', subtype: 'valve' },
];
assert.deepEqual(els.filter(isHeater).map(e => e.name), ['HLT_HE', 'BK_HE', 'Old_PID', 'Burner_Gas']);

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'hoff-')), cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [...els, { name: 'Out', type: 'gGlobal', kind: 'string', dataType: 'string' }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
for (const n of ['HLT_HE', 'BK_HE', 'Burner_Gas', 'Igniter_1', 'Pump_1', 'V_1']) store.setProp(n, 'state', true);
store.setProp('Old_PID', 'enabled', true);
const printed = []; eng.on('print', (...a) => printed.push(a.join(' ')));
eng.write('p', 'all_heaters_off\nOut = "done"\n');
eng.start('p');
assert.ok(await until(() => store.getProp('Out', 'value') === 'done'), 'no reminder: the Process goes straight on');
for (const n of ['HLT_HE', 'BK_HE', 'Burner_Gas', 'Igniter_1']) assert.equal(store.getProp(n, 'state'), false, n + ' off');
assert.equal(store.getProp('Old_PID', 'enabled'), false, 'older PID disabled');
assert.equal(store.getProp('Pump_1', 'state'), true, 'pumps left alone');
assert.equal(store.getProp('V_1', 'state'), true, 'valves left alone');
assert.equal(eng.valveList().length, 0, 'no pop-up');

// nothing after it, like all_pumps_off
assert.match(compile('all_heaters_off HLT_HE').errors[0].msg, /all_heaters_off takes nothing after it/);
// predictive text offers it
assert.ok(JSON.stringify(suggest('all_hea')).includes('all_heaters_off'), 'predictive text offers it');
// the shared list reports what it switched
assert.deepEqual(heatersOff(els, () => { }).map(e => e.name), ['HLT_HE', 'BK_HE', 'Old_PID', 'Burner_Gas', 'Igniter_1']);
eng.stopAll?.();
console.log('heatersoff.test: all passed');
process.exit(0);
