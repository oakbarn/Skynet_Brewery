// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Recipe values in a Process are metric; a message shows them in the Units (Rule 2.59; OakBarn Brewery, 2026-11-20: "Metric inside,
// Units in messages ... it follows the Rule"). Recipe items in their own unit (hops, adjuncts such as Irish Moss) are never turned.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';
import { recipeValues, recipeValue, recipeShow, recipeUnitKind } from '../lib/brewprocess.js';

const recipe = { name: 'IPA', boilTime: 60, strikeTempC: 74, strikeLiters: 15, grainKg: 5, pitchTempC: 19, volumes: { batchLiters: 20, boilLiters: 25 },
  ingredients: { fermentables: [{ type: 'grain', kg: 5 }], hops: [{ name: 'Magnum', use: 'boil', time: 60, kg: 0.028, alpha: 12, alphaActual: 12 }],
    miscs: [{ name: 'Irish Moss', amount: 5, unit: 'g', use: 'boil', time: 15 }], yeasts: [{ name: 'US-05' }] }, mash: { steps: [] } };
const us = { brewDefaults: { units: 'US' }, recipe };
// what the Brew Process page shows: the Units
const shown = recipeValues(us);
assert.equal(shown.skn_rcp_Strike_Temp, 165.2); assert.equal(shown.skn_rcp_Batch_Volume, 5.28);
// what a Process reads: metric, the words still the Units
const kept = recipeValues(us, {}, { kept: true });
assert.equal(kept.skn_rcp_Strike_Temp, 74); assert.equal(kept.skn_rcp_Strike_Volume, 15); assert.equal(kept.skn_rcp_Batch_Volume, 20);
assert.equal(kept.skn_rcp_Total_Grain_Weight, 5); assert.equal(kept.skn_rcp_Ferment_Temp, 19);
assert.equal(kept.skn_rcp_Temp_Units, '°F'); assert.equal(kept.skn_rcp_Volume_Units, 'gal'); assert.equal(kept.skn_rcp_Weight_Units, 'lb');
// recipe items keep their own unit: the hop line reads as on the Recipe tab, the adjunct is never turned
assert.equal(recipeValue(kept, 'skn_rcp_Hop_1_Measurement'), shown.skn_rcp_Hop_1_Measurement);
assert.equal(recipeValue(kept, 'skn_rcp_Hop_1_Amount'), shown.skn_rcp_Hop_1_Amount);
assert.equal(recipeValue(kept, 'skn_rcp_Adjunct_1_Amount'), 5); assert.equal(recipeValue(kept, 'skn_rcp_Adjunct_1_Measurement'), 'g');
assert.equal(recipeUnitKind('skn_rcp_Adjunct_1_Amount'), null); assert.equal(recipeUnitKind('skn_rcp_Hop_1_Amount'), null);
// Metric Units: the same numbers either way
assert.equal(recipeValues({ ...us, brewDefaults: { units: 'Metric' } }, {}, { kept: true }).skn_rcp_Temp_Units, '°C');
// shown in the Units
assert.equal(recipeShow('skn_rcp_Strike_Temp', 74, 'US'), 165.2); assert.equal(recipeShow('skn_rcp_Strike_Temp', 74, 'Metric'), 74);
assert.equal(recipeShow('skn_rcp_Mash_Step_2_Temp', 66.6667, 'US'), 152);
assert.equal(recipeShow('skn_rcp_Batch_Volume', 20, 'US'), 5.28); assert.equal(recipeShow('skn_rcp_Total_Grain_Weight', 5, 'US'), 11.02);
assert.equal(recipeShow('skn_rcp_Name', 'IPA', 'US'), 'IPA');

// in a running Process (US): the setpoint is °C, the message is °F
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'rcpm-')), cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ ...us, elements: [{ name: 'T', type: 'gGlobal', kind: 'value', dataType: 'number' }, { name: 'Out', type: 'gGlobal', kind: 'string', dataType: 'string' },
  { name: 'Out2', type: 'gGlobal', kind: 'string', dataType: 'string' },
  { name: 'B', type: 'gGlobal', kind: 'value', dataType: 'number' }, { name: 'Out3', type: 'gGlobal', kind: 'string', dataType: 'string' }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
eng.write('m', 'T = skn_rcp_Strike_Temp\nOut = "Heat to " + skn_rcp_Strike_Temp + skn_rcp_Temp_Units\nOut2 = "Fill " + skn_rcp_Strike_Volume + " " + skn_rcp_Volume_Units\nB = skn_Boil_Temp\nOut3 = "Boils at " + skn_Boil_Temp\n');
eng.start('m');
assert.ok(await until(() => store.getProp('Out2', 'value') === 'Fill 3.96 gal'), 'a volume in a message is in the Units');
assert.equal(+store.getProp('T', 'value'), 74, 'a Process works in °C');
assert.equal(store.getProp('Out', 'value'), 'Heat to 165.2°F', 'a temperature in a message is in the Units');
// skn_Boil_Temp the same way (Rule 1.18): °C in the Process, the Units in a message
assert.ok(await until(() => store.getProp('Out3', 'value') === 'Boils at 212'));
assert.equal(+store.getProp('B', 'value'), 100);
clearTimeout(store._persistTimer);
console.log('rcp metric tests passed');
process.exit(0);
