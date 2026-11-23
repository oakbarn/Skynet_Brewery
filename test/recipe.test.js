// The Skynet Recipe: BeerSmith .bsmx and BeerXML import, the Recipe tab sums, hop order and merged alerts, Skynet_Fields
import { hopStands, nearestStand, standOf, standByTemp } from '../public/brewcalc.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readRecipeFile, readBsmx, cleanRecipe, RecipeStore, HopAlerts, defaultBrewOn, brewOnEfficiency, recipeForBrowser, brewOnFromBrowser } from '../lib/recipe.js';
import { hopUnitOf, yeastUnitOf, yeastAmountText, hopSchedule, calculateRecipe, recipeFieldValues, RECIPE_FIELDS, hopKgToUse, toKg, KG_OZ, sortHops, hopActualProblems, recipeField, HOP_FIELDS, gravityPoints, expectedGravity, RECIPE_LEVELS, recipeLevel, levelShowsTab, levelShowsBox, levelFermTypes, blankRecipe, RECIPE_DEFAULTS, measuredEfficiency, averageEfficiency, EFF_AVERAGE_OF } from '../public/recipecalc.js';
import { ProfileStore } from '../lib/profiles.js';
import { recipeValues } from '../lib/brewprocess.js';
import { SCHEMA_KEYS } from '../lib/schemas.js';
import './strikeoffset.test.js';      // Strike Offset (Panel Updates entry 14), run with the recipe tests

// a small .bsmx as BeerSmith writes it: ounces, fluid ounces, °F; a folder of two recipes
const hop = (n, oz, use, t, alpha = 10) => `<Hops><F_H_NAME>${n}</F_H_NAME><F_H_ALPHA>${alpha}</F_H_ALPHA><F_H_AMOUNT>${oz}</F_H_AMOUNT><F_H_BOIL_TIME>${t}</F_H_BOIL_TIME><F_H_DRY_HOP_TIME>4</F_H_DRY_HOP_TIME><F_H_USE>${use}</F_H_USE><F_H_FORM>0</F_H_FORM><F_H_IN_RECIPE>1</F_H_IN_RECIPE></Hops>`;
const bsmx = `<Recipe><Name>Recipe</Name><Data><Table><Name>Brew Log</Name><Data>
<Recipe><F_R_NAME>Other Beer</F_R_NAME><F_R_EQUIPMENT><F_E_BATCH_VOL>640</F_E_BATCH_VOL></F_R_EQUIPMENT></Recipe>
<Recipe><F_R_NAME>Test IPA</F_R_NAME><F_R_BREWER>Fritz</F_R_BREWER><F_R_ASST_BREWER>Skynet</F_R_ASST_BREWER><F_R_TYPE>2</F_R_TYPE><F_R_DESIRED_OG>1.060</F_R_DESIRED_OG>
<F_R_STYLE><F_S_NAME>American IPA</F_S_NAME></F_R_STYLE>
<F_R_EQUIPMENT><F_E_BATCH_VOL>704</F_E_BATCH_VOL><F_E_BOIL_VOL>896</F_E_BOIL_VOL><F_E_BOIL_TIME>60</F_E_BOIL_TIME></F_R_EQUIPMENT>
<F_R_AGE><F_A_PRIM_TEMP>66</F_A_PRIM_TEMP></F_R_AGE>
<F_R_MASH><F_MH_NAME>Single</F_MH_NAME><F_MH_GRAIN_TEMP>68</F_MH_GRAIN_TEMP><F_MH_SPARGE_TEMP>168</F_MH_SPARGE_TEMP><F_MH_BATCH>1</F_MH_BATCH>
<steps><Data><MashStep><F_MS_NAME>Sacch</F_MS_NAME><F_MS_STEP_TEMP>152</F_MS_STEP_TEMP><F_MS_STEP_TIME>60</F_MS_STEP_TIME></MashStep></Data></steps></F_R_MASH>
<Ingredients><Data>
<Grain><F_G_NAME>Pale 2-Row</F_G_NAME><F_G_TYPE>0</F_G_TYPE><F_G_AMOUNT>160</F_G_AMOUNT><F_G_COLOR>2</F_G_COLOR><F_G_IN_RECIPE>1</F_G_IN_RECIPE></Grain>
<Grain><F_G_NAME>Crystal 40</F_G_NAME><F_G_TYPE>0</F_G_TYPE><F_G_AMOUNT>16</F_G_AMOUNT><F_G_IN_RECIPE>1</F_G_IN_RECIPE></Grain>
<Grain><F_G_NAME>Corn Sugar</F_G_NAME><F_G_TYPE>2</F_G_TYPE><F_G_AMOUNT>8</F_G_AMOUNT><F_G_IN_RECIPE>1</F_G_IN_RECIPE></Grain>
${hop('Magnum', 1, 0, 60, 12)}${hop('Cascade A', 1, 0, 20)}${hop('Cascade B', 1, 0, 10)}${hop('Citra', 2, 4, 20)}${hop('Mosaic', 2, 1, 0)}${hop('Simcoe', 0.5, 0, 9.5)}
${hop('H1', 1, 0, 50)}${hop('H2', 1, 0, 45)}${hop('H3', 1, 0, 40)}
<Misc><F_M_NAME>Whirlfloc</F_M_NAME><F_M_UNITS>13</F_M_UNITS><F_M_AMOUNT>1</F_M_AMOUNT><F_M_USE>0</F_M_USE><F_M_TIME>15</F_M_TIME><F_M_IN_RECIPE>1</F_M_IN_RECIPE></Misc>
<Misc><F_M_NAME>Gypsum</F_M_NAME><F_M_UNITS>1</F_M_UNITS><F_M_AMOUNT>5</F_M_AMOUNT><F_M_USE>1</F_M_USE><F_M_IN_RECIPE>1</F_M_IN_RECIPE></Misc>
<Yeast><F_Y_NAME>American Ale</F_Y_NAME><F_Y_LAB>Wyeast</F_Y_LAB><F_Y_PRODUCT_ID>1056</F_Y_PRODUCT_ID><F_Y_AMOUNT>2</F_Y_AMOUNT><F_Y_IN_RECIPE>1</F_Y_IN_RECIPE></Yeast>
<Water><F_W_NAME>Tap</F_W_NAME><F_W_AMOUNT>320</F_W_AMOUNT><F_W_CALCIUM>50</F_W_CALCIUM><F_W_IN_RECIPE>1</F_W_IN_RECIPE></Water>
</Data></Ingredients></Recipe></Data></Table></Data></Recipe>`;

let got = readRecipeFile(Buffer.from(bsmx, 'latin1'), 'Test.bsmx', 'Test IPA');
assert.deepEqual(got.names, ['Other Beer', 'Test IPA'], 'every recipe in a folder file is listed');
let r = got.recipe;
assert.equal(r.sourceFormat, 'bsmx'); assert.equal(r.name, 'Test IPA'); assert.equal(r.brewer, 'Fritz'); assert.equal(r.style, 'American IPA');
assert.ok(Math.abs(r.volumes.batchLiters - 20.82) < 0.01, '704 fl oz is 5.5 gal = 20.82 L');
assert.equal(r.ingredients.hops.length, 9, 'no limit of 8 hops');
assert.equal(r.ingredients.fermentables.length, 3); assert.equal(r.ingredients.yeasts[0].amount, 2); assert.equal(r.ingredients.waters[0].ca, 50);
assert.ok(Math.abs(r.ingredients.fermentables[0].kg - 160 / KG_OZ) < 1e-4, 'grain ounces to kg');
assert.equal(r.ingredients.miscs[0].unit, 'items'); assert.equal(r.ingredients.miscs[1].unit, 'g'); assert.equal(r.ingredients.miscs[0].use, 'boil');
const byName = n => r.ingredients.hops.find(h => h.name === n);
assert.equal(byName('Citra').use, 'whirlpool'); assert.equal(byName('Mosaic').use, 'dry hop'); assert.equal(byName('Mosaic').dryDays, 4);
assert.equal(r.mash.steps[0].tempC, 66.67, '152 °F'); assert.equal(r.spargeType, 'batch'); assert.equal(r.pitchTempC, 18.89);
// the boxes start filled in, as Calculate does
assert.ok(Math.abs(r.grainKg - 176 / KG_OZ) < 0.001, 'Grain Wt.: grains only, not the sugar');
assert.equal(r.firstMashC, 66.7); assert.ok(r.ibuCalc > 100 && r.ibuCalc < 200, 'IBU worked out: ' + r.ibuCalc); assert.ok(r.strikeTempC > 72 && r.strikeTempC < 76);
assert.equal(r.whirlpoolMinutes, 20); assert.equal(r.spargeTempC, 75.6);
// Three Hop Stands, no Defaults (2026-11-19): a whirlpool hop with no temperature gets no stand; its questions are asked in the Recipe
assert.equal(byName('Citra').stand, undefined); assert.deepEqual(r.hopStands ?? {}, {});
// a BeerSmith Whirlpool ("Aroma") hop's own F_H_WHIRLPOOL_TEMP (°F) gives it its stand; a Boil hop's is not read (OakBarn Brewery hop test, 2026-11-23)
{
  const wp = (n, use, t, f) => `<Hops><F_H_NAME>${n}</F_H_NAME><F_H_ALPHA>5</F_H_ALPHA><F_H_AMOUNT>1</F_H_AMOUNT><F_H_BOIL_TIME>${t}</F_H_BOIL_TIME><F_H_WHIRLPOOL_TEMP>${f}</F_H_WHIRLPOOL_TEMP><F_H_USE>${use}</F_H_USE><F_H_IN_RECIPE>1</F_H_IN_RECIPE></Hops>`;
  const f = `<Recipe><F_R_NAME>WP</F_R_NAME><F_R_EQUIPMENT><F_E_BOIL_TIME>90</F_E_BOIL_TIME></F_R_EQUIPMENT><Ingredients><Data>${wp('Boil', 0, 60, 194.44064)}${wp('Naga', 4, 60, 154.4)}${wp('Banner', 4, 10, 174.4)}</Data></Ingredients></Recipe>`;
  const w = readRecipeFile(Buffer.from(f, 'latin1'), 'WP.bsmx').recipe, hn = n => w.ingredients.hops.find(h => h.name === n);
  assert.equal(hn('Boil').wpTempC, undefined, 'a Boil hop keeps no whirlpool temperature');
  assert.equal(hn('Naga').wpTempC, 68); assert.equal(hn('Naga').stand, 'Middle'); assert.equal(hn('Banner').stand, 'High');
  assert.deepEqual(w.hopStands, { Middle: { tempC: 68, min: 60 }, High: { tempC: 79.11, min: 10 } });
}
assert.throws(() => readBsmx('<Recipe></Recipe>'), /No recipe/);

// BeerXML brings every ingredient too
const xml = `<?xml version="1.0"?><RECIPES><RECIPE><NAME>XML Ale</NAME><BATCH_SIZE>20</BATCH_SIZE><BOIL_SIZE>25</BOIL_SIZE><BOIL_TIME>90</BOIL_TIME><STYLE><NAME>Bitter</NAME></STYLE>
<HOPS><HOP><NAME>EKG</NAME><ALPHA>5</ALPHA><AMOUNT>0.03</AMOUNT><USE>Boil</USE><TIME>90</TIME></HOP><HOP><NAME>Dry</NAME><AMOUNT>0.02</AMOUNT><USE>Dry Hop</USE><TIME>4320</TIME></HOP></HOPS>
<FERMENTABLES><FERMENTABLE><NAME>Maris Otter</NAME><TYPE>Grain</TYPE><AMOUNT>4</AMOUNT></FERMENTABLE></FERMENTABLES>
<MISCS><MISC><NAME>Irish Moss</NAME><USE>Boil</USE><TIME>15</TIME><AMOUNT>0.005</AMOUNT><AMOUNT_IS_WEIGHT>TRUE</AMOUNT_IS_WEIGHT><DISPLAY_AMOUNT>1.00 tsp</DISPLAY_AMOUNT></MISC></MISCS>
<YEASTS><YEAST><NAME>S-04</NAME></YEAST></YEASTS><MASH><MASH_STEPS><MASH_STEP><NAME>Sacch</NAME><STEP_TEMP>66</STEP_TEMP><STEP_TIME>60</STEP_TIME></MASH_STEP></MASH_STEPS></MASH></RECIPE></RECIPES>`;
const x = readRecipeFile(xml, 'a.xml').recipe;
assert.equal(x.sourceFormat, 'beerxml'); assert.equal(x.boilTime, 90); assert.equal(x.ingredients.hops[1].dryDays, 3); assert.equal(x.ingredients.miscs[0].unit, 'tsp');
assert.equal(x.grainKg, 4); assert.equal(x.firstMashC, 66);

// Fritz's FERMENTABLE sample (2026-10-31): every field comes in, and a misspelled closing tag (</DISASTATIC_POWER>) loses nothing
const fx = readRecipeFile(`<RECIPES><RECIPE><NAME>F</NAME><FERMENTABLES><FERMENTABLE><NAME>Barley, Flaked</NAME><VERSION>1</VERSION><AMOUNT>0.91</AMOUNT><TYPE>Grain</TYPE>
<YIELD>70.0</YIELD><COLOR>2.0</COLOR><ORIGIN>United Kingdom</ORIGIN><SUPPLIER>Fussybrewer Malting</SUPPLIER><NOTES>Adds body to porters and stouts, must be mashed</NOTES>
<COARSE_FINE_DIFF>1.5</COARSE_FINE_DIFF><MOISTURE>9.0</MOISTURE><DIASTATIC_POWER>0.0</DISASTATIC_POWER><PROTEIN>13.2</PROTEIN><MAX_IN_BATCH>20.0</MAX_IN_BATCH>
<RECOMMEND_MASH>TRUE</RECOMMEND_MASH></FERMENTABLE><FERMENTABLE><NAME>Pale</NAME><AMOUNT>4</AMOUNT><TYPE>Grain</TYPE></FERMENTABLE></FERMENTABLES></RECIPE></RECIPES>`, 'f.xml').recipe;
assert.equal(fx.ingredients.fermentables.length, 2, 'the grain after the typo is still there');
assert.deepEqual(['protein', 'maxInBatch', 'moisture', 'coarseFineDiff', 'diastaticPower', 'recommendMash'].map(k => fx.ingredients.fermentables[0][k]), [13.2, 20, 9, 1.5, 0, true]);
const gf = recipeFieldValues({ ingredients: { fermentables: [{ name: 'Pale', type: 'grain', kg: 4.5359237, yieldPct: 80, color: 2 }, { name: 'Honey', type: 'sugar', kg: 0.45359237, yieldPct: 75, color: 1, addAfterBoil: true },
  { name: 'Flaked', type: 'adjunct', kg: 0.5, addAfterBoil: true }, { name: 'Munich', type: 'grain', kg: 1 }] } }, { units: 'US' });
assert.equal(recipeFieldValues({ ingredients: { fermentables: [{ name: 'DME', type: 'dry extract', kg: 0.45359237, unit: 'oz' }] } }, { units: 'US' }).skn_rcp_Fermentable_1_Amount, 16, 'the amount shows in its own Measurement');
assert.equal(recipeFieldValues({ ingredients: { fermentables: [{ name: 'DME', type: 'dry extract', kg: 1 }] } }, { units: 'US' }).skn_rcp_Fermentable_1_Measurement, 'lb');
assert.equal(cleanRecipe({ ingredients: { fermentables: [{ name: 'x', unit: 'stone' }, { name: 'y', unit: 'g' }] } }).ingredients.fermentables.map(f => f.unit).join(), ',g');
const av = recipeFieldValues({ ingredients: { miscs: [{ name: 'Whirlfloc', type: 'Fining', use: 'boil', amount: 1, unit: 'items', time: 15, timeUnit: 'min' }] } });
assert.equal(av.skn_rcp_Adjunct_Count, 1); assert.equal(av.skn_rcp_Adjunct_1_Name, 'Whirlfloc'); assert.equal(av.skn_rcp_Adjunct_1_Time, 15); assert.equal(av.skn_rcp_Adjunct_1_Measurement, 'items');
assert.equal(recipeField('skn_rcp_Adjunct_4_Use')[1], 'Adjunct 4: Boil, Mash, Primary, Secondary or Bottling');
assert.equal(gf.skn_rcp_Grain_Count, 2); assert.equal(gf.skn_rcp_Fermentable_Count, 2);
assert.equal(gf.skn_rcp_Grain_1_Amount, 10); assert.equal(gf.skn_rcp_Grain_1_Potential, 80); assert.equal(gf.skn_rcp_Grain_2_Name, 'Munich');
assert.equal(gf.skn_rcp_Fermentable_1_Type, 'sugar'); assert.equal(gf.skn_rcp_Fermentable_1_After_Boil, true); assert.equal(gf.skn_rcp_Fermentable_2_After_Boil, false, 'an adjunct is not added after the boil');
// gravity points (PPG>SG) and the Expected Gravity: 10 lb at 80% Potential, 72% efficiency, 5 gal = 53.2 points; 1 lb of honey (75%, not mashed) = 6.9
// The efficiency is only the Brew on Tab's Equipment Profile's (Rule 17.13): it is passed in, never kept on the Recipe or a default
const gr = { volumes: { batchLiters: 5 / 0.264172052 }, ingredients: { fermentables: [{ type: 'grain', kg: 4.5359237, yieldPct: 80 }, { type: 'sugar', kg: 0.45359237, yieldPct: 75 }] } };
assert.equal(Math.round(gravityPoints(gr.ingredients.fermentables[0], gr, 72) * 10) / 10, 53.2); assert.equal(Math.round(gravityPoints(gr.ingredients.fermentables[1], gr, 72) * 10) / 10, 6.9);
assert.equal(expectedGravity(gr, 72), 1.06); assert.equal(calculateRecipe(gr, {}, null, 1.0, 72).expectedSG, 1.06); assert.equal(recipeFieldValues({ ...gr, expectedSG: 1.06 }).skn_rcp_Expected_Gravity, 1.06);
assert.equal(recipeFieldValues(gr, { eff: 72 }).skn_rcp_Grain_1_PPG_SG, 53.24); assert.equal(expectedGravity({ ingredients: { fermentables: [{ kg: 1, yieldPct: 80 }] } }, 72), null, 'no Brew Length, no gravity');
assert.equal(gravityPoints(gr.ingredients.fermentables[0], gr), null, 'no Efficiency: a grain has no gravity points (no hidden 72 %)');
assert.equal(Math.round(gravityPoints(gr.ingredients.fermentables[1], gr) * 10) / 10, 6.9, 'a sugar needs no Efficiency');
assert.equal(expectedGravity(gr), null, 'no Efficiency, no Expected Gravity'); assert.equal(calculateRecipe(gr).expectedSG, null);
// the real Efficiency of a brew, back from its OG and the volume into the fermenter (Rule 17.13): 1.060 in 5 gal = 71.8 % (the honey is not mashed; 72 % gives 1.0598, shown as 1.060)
assert.equal(measuredEfficiency(gr, 1.06, 5 / 0.264172052), 71.8); assert.equal(measuredEfficiency(gr, 1.06, 0), null, 'no volume');
assert.equal(measuredEfficiency(gr, 0.99, 19), null, 'not a gravity'); assert.equal(measuredEfficiency({ ingredients: { fermentables: [{ type: 'sugar', kg: 1, yieldPct: 75 }] } }, 1.05, 19), null, 'nothing mashed');
// the average of the last 10 brews on this Tab (Rule 2.62), kept in the Schema (effLog is a Schema key, so each Schema has its own list)
{
  const log = Array.from({ length: 12 }, (_, k) => ({ tab: { _key: 'p1' }, eff: k < 2 ? 50 : 75 })).concat([{ tab: { _key: 'p2' }, eff: 60 }]);
  assert.equal(EFF_AVERAGE_OF, 10); assert.deepEqual({ ...averageEfficiency(log, 'p1'), last: undefined }, { avg: 75, count: 10, last: undefined }, 'only the last 10');
  assert.equal(averageEfficiency(log, 'p2').avg, 60); assert.equal(averageEfficiency(log, 'p3'), null); assert.equal(averageEfficiency([], 'p1'), null);
  assert.ok(SCHEMA_KEYS.includes('effLog'));
}
assert.equal(expectedGravity({ volumes: gr.volumes, ingredients: { fermentables: [gr.ingredients.fermentables[1]] } }), 1.007, 'sugars only: no Efficiency needed');
assert.equal(RECIPE_DEFAULTS.efficiency, undefined, 'no overall Efficiency default'); assert.equal('efficiency' in blankRecipe(), false);
// the Brew on Tab: kept by the Tab's hidden key; the default is the Tab whose own Equipment numbers (copied from a profile, Rule 2.62) list a Mash Tun or All In One
{
  const prof = { hot: { brewhouseEfficiency: 75, equipment: [{ vtype: 'HLT' }, { vtype: 'Mash Tun' }] }, cold: { brewhouseEfficiency: 60, equipment: [{ vtype: 'Fermenter' }] } };
  const P = { has: () => false, get: () => null };      // no profile is read: the numbers are the Tab's own
  const cfg = { workspaces: [{ name: 'Cellar', _key: 'k00000000000000a1', equip: prof.cold }, { name: 'Brew House', _key: 'k00000000000000b2', equip: prof.hot }, { name: 'Notes', _key: 'k00000000000000c3' }] };
  const on = defaultBrewOn(cfg, P);
  assert.equal(on._key, 'k00000000000000b2', 'the Tab with a Mash Tun');
  assert.equal(brewOnEfficiency(cfg, P, { brewOn: on }), 75);
  assert.equal(brewOnEfficiency(cfg, P, { brewOn: { _key: 'k00000000000000a1' } }), 60);
  assert.equal(brewOnEfficiency(cfg, P, { brewOn: null }), null);
  const out = recipeForBrowser({ name: 'X', brewOn: on }, cfg, P);
  assert.equal('brewOn' in out, false, 'the key never goes to the browser'); assert.ok(out.brewOnRef && !out.brewOnRef.startsWith('k0')); assert.equal(out.brewOnEff, 75);
  assert.deepEqual(brewOnFromBrowser(out.brewOnRef, cfg), on, 'the stand-in comes back as the key');
  assert.equal(brewOnFromBrowser('nope', cfg), null);
  assert.deepEqual(cleanRecipe({ brewOn: { _key: 'k00000000000000b2' } }).brewOn, { _key: 'k00000000000000b2' });
  assert.equal(cleanRecipe({ brewOn: { _key: 'name' } }).brewOn, null);
  assert.equal(defaultBrewOn({ workspaces: [cfg.workspaces[2]] }, P), null, 'no Tab with Equipment numbers');
}
assert.equal(recipeField('skn_rcp_Fermentable_7_SRM')[1], 'Fermentable 7: color in SRM');
assert.equal(readRecipeFile('<RECIPES><RECIPE><NAME>A</NAME><FERMENTABLES><FERMENTABLE><NAME>DME</NAME><TYPE>Dry Extract</TYPE><AMOUNT>1</AMOUNT><ADD_AFTER_BOIL>TRUE</ADD_AFTER_BOIL></FERMENTABLE></FERMENTABLES></RECIPE></RECIPES>', 'a.xml').recipe.ingredients.fermentables[0].addAfterBoil, true);
assert.equal(fx.ingredients.fermentables[0].notes, 'Adds body to porters and stouts, must be mashed'); assert.equal(fx.grainKg, 4.91);

// Actual AAU: the same alpha acid units, so a stronger hop means less of it
assert.equal(hopKgToUse({ kg: 0.1, alpha: 10, alphaActual: 12.5 }), 0.08);

// the hop order and the alerts: groups by time, 10 minute warnings, alerts at the same minute become one
const s = hopSchedule(r, { units: 'US' });
assert.deepEqual(s.groups.map(g => g.label), ['Start of Boil', '50 min (Bitter)', '45 min (Bitter)', '40 min (Bitter)', '20 min (Flavor)', '15 min (Flavor)', '10 min (Flavor)', '9.5 min (Aroma)', 'Whirlpool', 'Dry Hop (4 days)']);
const at = m => s.alerts.find(a => a.at === m);
assert.ok(at(10).parts.length === 2 && at(10).kind === 'drop', 'Hop Group 2 drops at 10 min, Hop Group 4 warns at 10 min: one alert with both');
assert.ok(/^Add Hop Group 2 now/.test(at(10).text) && /warning: get Hop Group 4 ready/.test(at(10).text));
assert.ok(/^Add the Start of Boil hops now/.test(at(0).text), 'Start of Boil (Hop Group 1) at 0');
assert.ok(/^Add Hop Group 7 now.*\nAdd Hop Group 8 now/.test(at(50).text), 'drops come first in a merged alert');
assert.ok(s.alerts.some(a => /Whirlfloc/.test(a.text)), 'a Boil Misc item gets its alerts');
assert.ok(at(50).parts.length >= 2, 'the 10 min drop and the 9.5 min hop land within a minute of each other');
assert.ok(s.conflicts.length >= 3);
assert.ok(s.alerts.every(a => /^Audio\/Hops\/Hop_Alert_\d{3}min_\w+\.mp3$/.test(a.audio)), 'each alert has an audio path');
const noWarn = hopSchedule(r, { hopWarnMinutes: 0 });
assert.ok(noWarn.alerts.every(a => a.kind === 'drop'), 'warning 0 = no warnings');

// Calculate, and the Skynet_Fields in the units picked
const c = calculateRecipe({ ...r, spargeTempC: null }, {}, { units: 'US', steps: [{ name: 'Sacch', temp: 154, time: 60 }], spargeTemp: 170, sparge: 'fly' });
assert.equal(c.firstMashC, 67.8, 'the Mash Profile picked wins (154 °F)'); assert.equal(c.spargeTempC, 76.7); assert.equal(c.spargeType, 'batch', 'the recipe keeps its own sparge type');
const f = recipeFieldValues(r, { units: 'US' });
assert.equal(f.skn_rcp_Name, 'Test IPA'); assert.equal(f.skn_rcp_Batch_Volume, 5.5); assert.equal(f.skn_rcp_Total_Grain_Weight, 11); assert.equal(f.skn_rcp_Pitch_Temp, 66);
assert.equal(new Set(RECIPE_FIELDS.map(x => x[0])).size, RECIPE_FIELDS.length, 'every Skynet_Field name is used once');
assert.ok(RECIPE_FIELDS.every(([k]) => /^skn_rcp_[A-Z][A-Za-z_]+$/.test(k)));

// the Hops tab: an import leaves the Actual AAU empty, Calculate needs it above zero, every hop line has its Skynet_Fields
assert.equal(x.ingredients.hops[0].alphaActual, 0, 'the Actual AAU starts at 0: the AAU on the package is typed in');
assert.deepEqual(hopActualProblems(x).map(p => p.line), [1, 2]);
assert.deepEqual(hopActualProblems({ ingredients: { hops: [{ alphaActual: 5 }, { name: 'B', alphaActual: 0 }] } }), [{ line: 2, name: 'B', aa: 0 }]);
const hs = { boilTime: 60, volumes: { batchLiters: 20 }, ingredients: { hops: [
  { name: 'WP', use: 'whirlpool', time: 20, wpTempC: 80, hopRocket: true, kg: 0.028, alpha: 5, alphaActual: 5 },
  { name: 'Dry', use: 'dry hop', dryDays: 4, date: '2026-11-05', kg: 0.028, alpha: 5, alphaActual: 5 },
  { name: 'Late', use: 'boil', time: 5, kg: 0.028, alpha: 5, alphaActual: 5 },
  { name: 'Sec', use: 'secondary', dryDays: 7, kg: 0.028, alpha: 5, alphaActual: 5 },
  { name: 'Magnum', use: 'boil', time: 60, kg: 0.028, alpha: 12, alphaActual: 11.7 },
  { name: 'Mash', use: 'mash', kg: 0.028, alpha: 5, alphaActual: 5 },
  { name: 'FW', use: 'first wort', kg: 0.028, alpha: 5, alphaActual: 5 },
  { name: 'Mid', use: 'boil', time: 30, kg: 0.028, alpha: 5, alphaActual: 5 } ] } };
sortHops(hs);
assert.deepEqual(hs.ingredients.hops.map(h => h.name), ['Magnum', 'Mid', 'Late', 'Mash', 'FW', 'Sec', 'Dry', 'WP'], 'Start of Boil first, by minutes, then Mash, 1st Wort, Secondary, Dry, Whirlpool');
const hf = recipeFieldValues(hs, { units: 'US' });
assert.equal(hf.skn_rcp_Hop_Count, 8);
assert.equal(hf.skn_rcp_Hop_1_Name, 'Magnum'); assert.equal(hf.skn_rcp_Hop_1_AA_Actual, 11.7); assert.equal(hf.skn_rcp_Hop_1_Calc_Amount, 1.01); assert.equal(hf.skn_rcp_Hop_1_Boil_Group, 1); assert.equal(hf.skn_rcp_Hop_1_Drop, 0);
assert.equal(hf.skn_rcp_Hop_3_Drop, 55); assert.ok(hf.skn_rcp_Hop_1_IBU > hf.skn_rcp_Hop_3_IBU && hf.skn_rcp_Hop_3_IBU > 0);
assert.equal(hf.skn_rcp_Hop_4_Boil_Group, 0, 'a Mash hop is not a Boil Hop'); assert.equal(hf.skn_rcp_Hop_4_IBU, 0);
assert.equal(hf.skn_rcp_Hop_6_Use, 'secondary'); assert.equal(hf.skn_rcp_Hop_6_Days, 7); assert.equal(hf.skn_rcp_Hop_7_Date, '2026-11-05');
assert.equal(hf.skn_rcp_Hop_8_Hop_Stand, 'High', '80 °C fits Hop Stand High'); assert.equal(hf.skn_rcp_Hop_8_Whirlpool_Temp, 0, 'its Hop Stand has no temperature yet (no Defaults)');
assert.equal(recipeFieldValues({ ...hs, hopStands: { High: { tempC: 82.22, min: 10 } } }, { units: 'US' }).skn_rcp_Hop_8_Whirlpool_Temp, 180, 'its Hop Stand\'s temperature'); assert.equal(hf.skn_rcp_Hop_8_Hop_Rocket, true); assert.equal(hf.skn_rcp_Hop_8_Min, 20); assert.equal(hf.skn_rcp_Hop_8_Boil_Group, 4);
assert.equal(recipeField('skn_rcp_Hop_12_IBU')[1], 'Hop 12 IBU', 'any hop line number is a Skynet_Field'); assert.equal(recipeField('skn_rcp_Hop_1_Nope'), undefined);
assert.ok(HOP_FIELDS.every(([k]) => /^[A-Z][A-Za-z_]+$/.test(k)));
assert.ok(hopSchedule(hs, { units: 'US' }).groups.some(g => g.label === 'Secondary (7 days)'));
assert.equal(cleanRecipe({ ingredients: { hops: [{ name: 'n' }] } }).ingredients.hops[0].alphaActual, 0, 'a new hop starts at 0');
const cs = cleanRecipe({ ingredients: { hops: [{ name: 'a', use: 'dry hop', time: 0, date: 'bad' }, { name: 'b', use: 'boil', time: 60, hopRocket: 'yes', wpTempC: '80' }] } });
assert.deepEqual(cs.ingredients.hops.map(h => h.name), ['b', 'a'], 'Save puts the hop lines in order'); assert.equal(cs.ingredients.hops[1].date, ''); assert.equal(cs.ingredients.hops[0].hopRocket, false);

// clean keeps numbers and lists, and the library saves by name
const cl = cleanRecipe({ name: 'X', boilTime: '75', ingredients: { hops: Array.from({ length: 30 }, (_, i) => ({ name: 'h' + i, kg: '0.01' })) } });
assert.equal(cl.boilTime, 75); assert.equal(cl.ingredients.hops.length, 30); assert.equal(cl.ingredients.hops[0].kg, 0.01);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'recipes'));
const lib = new RecipeStore(dir);
const sv = lib.save(r); assert.equal(sv.id, 'test-ipa'); assert.equal(lib.list()[0].name, 'Test IPA'); assert.equal(lib.get('test-ipa').ingredients.hops.length, 9);
assert.throws(() => lib.save({ name: '' }), /name/);
// an imported Recipe with a name already saved: Overwrite keeps the old copy in backups/recipes; Add new is "Name #2"
assert.equal(lib.byName('test ipa').id, 'test-ipa'); assert.equal(lib.freeName('Test IPA'), 'Test IPA #2');
const bk = lib.backup('test-ipa'); assert.ok(fs.existsSync(bk) && bk.includes(path.join('backups', 'recipes')));
lib.save({ ...r, name: 'Test IPA #2' }); assert.equal(lib.freeName('Test IPA'), 'Test IPA #3'); assert.equal(lib.freeName('Test IPA #2'), 'Test IPA #3');

// hop alerts follow a countdown timer: 60 min boil, 45 min left = 15 min in
let left = 3600, sent = [];
const store = { has: n => n === 'Boil_Timer', getProp: (n, p) => p === 'countdown' ? true : { s: left } };
const ha = new HopAlerts({ store, send: a => sent.push(a), recipe: () => r, defaults: () => ({}) });
ha.start('Boil_Timer'); assert.equal(sent.length, 1, 'only the Start of Boil alert at 0 min');
left = 2700; ha.check(); assert.ok(sent.length > 1 && sent.every(a => a.at <= 15)); ha.stop();
assert.throws(() => new HopAlerts({ store, send: () => { }, recipe: () => null }).start(), /no Recipe/);

// Skynet Mash and Water Profiles are read only and listed with the user's own
const mash = new ProfileStore(path.join(dir, 'mash'), 'mash');
assert.ok(mash.list().some(p => p.id === 'skynet-single-medium' && p.skynet));
// Fritz's two Mash Profile Templates (2026-10-31): Single Step Batch Sparge, and 3 Mash Steps with Fly Sparge
const sb = mash.get('skynet-single-batch'), tf = mash.get('skynet-three-step-fly');
assert.equal(sb.steps.length, 1); assert.equal(sb.sparge, 'batch'); assert.equal(sb.batchRest, 10);
assert.equal(tf.steps.length, 3); assert.equal(tf.sparge, 'fly'); assert.equal(tf.batchRest, undefined);
assert.equal(mash.create('My Fly', { from: 'skynet-three-step-fly' }).sparge ?? mash.get('my-fly').sparge, 'fly', 'a copy keeps the fly sparge');
assert.throws(() => mash.save('skynet-single-medium', { name: 'x' }), /Skynet Template/);
const mine = mash.create('My Mash', { from: 'skynet-step-protein' });
assert.equal(mine.steps.length, 2); assert.equal(mine.skynet, undefined);
const water = new ProfileStore(path.join(dir, 'water'), 'water');
const half = water.create('Half distilled', { from: 'skynet-balanced' });
assert.equal(water.save(half.id, { ...half, distilledPct: 50 }).distilledPct, 50);
assert.throws(() => water.save(half.id, { ...half, distilledPct: 150 }), /percent/);
// The four Recipe Levels (Rule 17.11): the user picks one; an imported file's type gives it; each Level shows its own tabs and boxes
assert.deepEqual(RECIPE_LEVELS.map(x => x.name), ['1 Can Kit', '2 Extract', '3 Partial Grain', '4 All Grain']);
assert.equal(new Set(RECIPE_LEVELS.map(x => x.name[0])).size, 4, 'each Level choice starts with its own letter (type to pick)');
assert.equal(blankRecipe().level, 4, 'a NEW Recipe starts at Level 4 until the user picks');
assert.equal(recipeLevel({ type: 'Extract' }), 2); assert.equal(recipeLevel({ type: 'Partial Mash' }), 3); assert.equal(recipeLevel({ type: 'All Grain' }), 4);
assert.equal(recipeLevel({ level: 1, type: 'Extract' }), 1, 'the Level the user picked wins');
const k1 = cleanRecipe({ name: 'Kit', level: 1 });
assert.equal(k1.level, 1); assert.equal(k1.type, 'Extract', 'a Can Kit is an Extract recipe in BeerXML words');
assert.equal(cleanRecipe({ name: 'P', level: 3 }).type, 'Partial Mash');
assert.equal(cleanRecipe({ name: 'Old', type: 'Partial Mash' }).level, 3);
assert.equal(levelShowsTab(k1, 'hops'), false); assert.equal(levelShowsTab(k1, 'fermentables'), true); assert.equal(levelShowsTab(k1, 'grain'), false);
assert.equal(levelShowsTab({ level: 2 }, 'hops'), true); assert.equal(levelShowsTab({ level: 2 }, 'mash'), false);
assert.equal(levelShowsBox({ level: 2 }, 'skn_rcp_Strike_Temp'), false); assert.equal(levelShowsBox({ level: 2 }, 'skn_rcp_IBU'), true);
assert.equal(levelShowsBox(k1, 'skn_rcp_IBU'), false); assert.equal(levelShowsBox({ level: 3 }, 'skn_rcp_Strike_Temp'), true);
for (const L of RECIPE_LEVELS) for (const f of L.hide) assert.ok(recipeField(f), `${f} is a Skynet_Field`);
assert.equal(recipeFieldValues({ level: 1 }).skn_rcp_Level, 1); assert.equal(recipeFieldValues({ type: 'Extract' }).skn_rcp_Level, 2);
for (const l of [1, 2, 3, 4]) assert.ok(levelShowsTab({ level: l }, 'waters') && levelShowsTab({ level: l }, 'fermentables'), `Level ${l} has Waters and Fermentables`);
assert.deepEqual(levelFermTypes({ level: 1 }), ['extract', 'dry extract'], 'Levels 1 and 2: Extracts only'); assert.deepEqual(levelFermTypes({ level: 2 }), ['extract', 'dry extract']);
assert.ok(levelFermTypes({ level: 3 }).includes('sugar'));
// Tap Water (Rule 17.12): always one, never deleted, keeps its flag, the water used when none is picked
const tapStore = new ProfileStore(path.join(dir, 'tapwater'), 'water');
const tap = tapStore.ensureTap(); assert.equal(tap.name, 'Tap Water'); assert.equal(tapStore.ensureTap().id, tap.id, 'only one Tap Water');
assert.throws(() => tapStore.remove(tap.id), /always kept/);
const tap2 = tapStore.save(tap.id, { ...tap, ca: 40, hco3: 122, tested: '2026-11-11', chlorine: 'ammonia', source: 'kit' });
assert.equal(tap2.tap, true); assert.equal(tap2.chlorine, 'ammonia'); assert.equal(tap2.source, 'kit');
assert.throws(() => tapStore.save(tap.id, { ...tap, tested: '11/11/2026' }), /yyyy-mm-dd/);
const tv = recipeValues({ recipe: { ...blankRecipe(), waterProfile: '' } }, { water: tapStore.list() });
assert.equal(tv.skn_rcp_Water_Ca, 40, 'no Water Profile picked: Tap Water');
// a whirlpool temperature goes to the stand it fits: High 170 °F and above, Middle from 140 °F, Low below (no Defaults, 2026-11-19)
{
  const st = hopStands({ pitchTempC: 20 });
  assert.equal(nearestStand(67.5, st), 'Middle'); assert.equal(nearestStand(85, st), 'High'); assert.equal(nearestStand(25, st), 'Low');
  assert.equal(standOf({ stand: 'Low', wpTempC: 80 }, st), 'Low', 'its own pick first'); assert.equal(standOf({ wpTempC: 66 }, st), 'Middle'); assert.equal(standOf({}, st), '', 'no stand picked: none (no Defaults)');
  assert.ok(st.every(x => x.tempC === null && x.min === null), 'no Skynet numbers filled in');
  assert.equal(standByTemp(76.7), 'High'); assert.equal(standByTemp(76.6), 'Middle'); assert.equal(standByTemp(60), 'Middle'); assert.equal(standByTemp(59.9), 'Low');
  assert.equal(hopStands({}, { hsHighTempC: 85, hsHighMin: 5 })[0].tempC, null, 'Default settings Hop Stands are not read');
}
// Rule 17.18: each hop line and yeast line keeps its own unit, whatever Units says
{
  assert.equal(r.ingredients.hops[0].unit, 'oz', 'a .bsmx hop is in ounces'); assert.equal(r.ingredients.yeasts[0].unit, 'Packs', 'a .bsmx yeast is a count of Packs');
  assert.equal(x.ingredients.hops[0].unit, 'g', 'a BeerXML hop with no DISPLAY_AMOUNT is in grams'); assert.deepEqual([x.ingredients.yeasts[0].amount, x.ingredients.yeasts[0].unit], [1, 'Packs'], 'no AMOUNT: 1 Pack');
  const yx = readRecipeFile(`<RECIPES><RECIPE><NAME>Y</NAME><HOPS><HOP><NAME>Oz hop</NAME><AMOUNT>0.0283495</AMOUNT><USE>Boil</USE><TIME>60</TIME><DISPLAY_AMOUNT>1.00 oz</DISPLAY_AMOUNT></HOP></HOPS>
<YEASTS><YEAST><NAME>Dry</NAME><AMOUNT>0.0115</AMOUNT><AMOUNT_IS_WEIGHT>TRUE</AMOUNT_IS_WEIGHT></YEAST><YEAST><NAME>Liquid</NAME><AMOUNT>0.125</AMOUNT></YEAST>
<YEAST><NAME>Pack</NAME><AMOUNT>0.0236</AMOUNT><DISPLAY_AMOUNT>2 pkg</DISPLAY_AMOUNT></YEAST><YEAST><NAME>Shown g</NAME><AMOUNT>0.011</AMOUNT><DISPLAY_AMOUNT>11.5 g</DISPLAY_AMOUNT></YEAST></YEASTS></RECIPE></RECIPES>`, 'y.xml').recipe;
  assert.equal(yx.ingredients.hops[0].unit, 'oz', 'DISPLAY_AMOUNT oz gives the hop line oz'); assert.equal(yx.ingredients.hops[0].kg, 0.0283495, 'the amount is still kept in kg');
  assert.deepEqual(yx.ingredients.yeasts.map(y => [y.amount, y.unit]), [[11.5, 'g'], [125, 'ml'], [2, 'Packs'], [11.5, 'g']], 'BeerXML yeast: kg to g, liters to ml, DISPLAY_AMOUNT wins');
  // a hop line with a unit shows in it on a Metric panel; one saved before with none follows Units
  const ru = { boilTime: 60, ingredients: { hops: [{ name: 'A', kg: 0.0283495, unit: 'oz', alpha: 5, alphaActual: 5, use: 'boil', time: 60 }, { name: 'B', kg: 0.028, alpha: 5, alphaActual: 5, use: 'boil', time: 10 }],
    yeasts: [{ name: 'US-05', amount: 2, unit: 'Packs' }, { name: 'K-97', amount: 11.5, unit: 'g' }] } };
  const fv = recipeFieldValues(ru, { units: 'Metric' });
  assert.equal(fv.skn_rcp_Hop_1_Amount, 1); assert.equal(fv.skn_rcp_Hop_1_Measurement, 'oz'); assert.equal(fv.skn_rcp_Hop_2_Amount, 28); assert.equal(fv.skn_rcp_Hop_2_Measurement, 'g');
  assert.equal(fv.skn_rcp_Yeast_Count, 2); assert.equal(fv.skn_rcp_Yeast_2_Amount, 11.5); assert.equal(fv.skn_rcp_Yeast_2_Measurement, 'g'); assert.equal(fv.skn_rcp_Yeast_1_Name, 'US-05');
  assert.equal(recipeField('skn_rcp_Yeast_3_Measurement')[1], 'Yeast 3: Packs, g, oz or ml');
  assert.ok(/^Add the Start of Boil hops now: 1 oz A/.test(hopSchedule(ru, { units: 'Metric' }).alerts.find(a => a.at === 0).text), 'the alert says the hop in its own unit');
  // oz to g: only the unit changes, the kg is kept
  ru.ingredients.hops[0].unit = 'g'; assert.equal(recipeFieldValues(ru, { units: 'US' }).skn_rcp_Hop_1_Amount, 28.35);
  assert.equal(hopUnitOf({}, { hopUnit: 'g' }), 'g'); assert.equal(yeastUnitOf({ unit: 'cups' }), 'Packs'); assert.equal(yeastAmountText({ amount: 1 }), '1 Pack');
  const cy = cleanRecipe({ ingredients: { hops: [{ name: 'a', unit: 'lb' }, { name: 'b', unit: 'g' }], yeasts: [{ name: 'y', amount: 5, unit: 'ml' }, { name: 'z' }] } });
  assert.equal(cy.ingredients.hops.find(h => h.name === 'a').unit, undefined, 'a hop unit not oz or g is not kept: the line follows Units'); assert.equal(cy.ingredients.hops.find(h => h.name === 'b').unit, 'g');
  assert.deepEqual(cy.ingredients.yeasts.map(y => [y.amount, y.unit]), [[5, 'ml'], [1, 'Packs']]);
  // the Yeast tab (OakBarn Brewery's layout 2026-11-19): every box is a Skynet_Field; temperatures and the starter follow Units
  const yt = { ingredients: { yeasts: [{ name: 'US-05', form: 'Dry', amount: 1, unit: 'Packs', attenuation: 81, minTempC: 15, maxTempC: 24, lab: 'Fermentis', productId: 'US-05', type: 'Ale', flocculation: 'Medium', starter: true, starterL: 1.892706, timesCultured: 2, mfgDate: '2026-10-01', notes: 'clean' }] } };
  const yv = recipeFieldValues(yt, { units: 'US' });
  assert.deepEqual([yv.skn_rcp_Yeast_1_Form, yv.skn_rcp_Yeast_1_Attenuation, yv.skn_rcp_Yeast_1_Min_Temp, yv.skn_rcp_Yeast_1_Max_Temp, yv.skn_rcp_Yeast_1_Lab, yv.skn_rcp_Yeast_1_Product_ID, yv.skn_rcp_Yeast_1_Type, yv.skn_rcp_Yeast_1_Flocculation, yv.skn_rcp_Yeast_1_Starter, yv.skn_rcp_Yeast_1_Starter_Size, yv.skn_rcp_Yeast_1_Times_Cultured, yv.skn_rcp_Yeast_1_Mfg_Date, yv.skn_rcp_Yeast_1_Notes],
    ['Dry', 81, 59, 75.2, 'Fermentis', 'US-05', 'Ale', 'Medium', true, 0.5, 2, '2026-10-01', 'clean']);
  const yc = cleanRecipe(yt).ingredients.yeasts[0]; assert.deepEqual([yc.flocculation, yc.timesCultured, yc.mfgDate, yc.notes, yc.starter], ['Medium', 2, '2026-10-01', 'clean', true], 'Save keeps every Yeast box');
  assert.equal(cleanRecipe({ ingredients: { yeasts: [{ name: 'old', starterL: 1 }] } }).ingredients.yeasts[0].starter, true, 'an older save with a starter size has Starter on');
  assert.equal(recipeValues({ recipe: { ...blankRecipe(), name: 'n' } }, {}).skn_rcp_Yeast_Count ?? 0, 0);
}
console.log('recipe tests passed');
