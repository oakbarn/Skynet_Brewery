// The Skynet Recipe: BeerSmith .bsmx and BeerXML import, the Recipe tab sums, hop order and merged alerts, Skynet_Fields
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readRecipeFile, readBsmx, cleanRecipe, RecipeStore, HopAlerts } from '../lib/recipe.js';
import { hopSchedule, calculateRecipe, recipeFieldValues, RECIPE_FIELDS, hopKgToUse, toKg, KG_OZ, sortHops, hopActualProblems, recipeField, HOP_FIELDS, gravityPoints, expectedGravity } from '../public/recipecalc.js';
import { ProfileStore } from '../lib/profiles.js';

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
assert.equal(recipeFieldValues({ ingredients: { fermentables: [{ name: 'DME', type: 'dry extract', kg: 0.45359237, unit: 'oz' }] } }, { units: 'US' }).rcp_Fermentable_1_Amount, 16, 'the amount shows in its own Measurement');
assert.equal(recipeFieldValues({ ingredients: { fermentables: [{ name: 'DME', type: 'dry extract', kg: 1 }] } }, { units: 'US' }).rcp_Fermentable_1_Measurement, 'lb');
assert.equal(cleanRecipe({ ingredients: { fermentables: [{ name: 'x', unit: 'stone' }, { name: 'y', unit: 'g' }] } }).ingredients.fermentables.map(f => f.unit).join(), ',g');
const av = recipeFieldValues({ ingredients: { miscs: [{ name: 'Whirlfloc', type: 'Fining', use: 'boil', amount: 1, unit: 'items', time: 15, timeUnit: 'min' }] } });
assert.equal(av.rcp_Adjunct_Count, 1); assert.equal(av.rcp_Adjunct_1_Name, 'Whirlfloc'); assert.equal(av.rcp_Adjunct_1_Time, 15); assert.equal(av.rcp_Adjunct_1_Measurement, 'items');
assert.equal(recipeField('rcp_Adjunct_4_Use')[1], 'Adjunct 4: Boil, Mash, Primary, Secondary or Bottling');
assert.equal(gf.rcp_Grain_Count, 2); assert.equal(gf.rcp_Fermentable_Count, 2);
assert.equal(gf.rcp_Grain_1_Amount, 10); assert.equal(gf.rcp_Grain_1_Potential, 80); assert.equal(gf.rcp_Grain_2_Name, 'Munich');
assert.equal(gf.rcp_Fermentable_1_Type, 'sugar'); assert.equal(gf.rcp_Fermentable_1_After_Boil, true); assert.equal(gf.rcp_Fermentable_2_After_Boil, false, 'an adjunct is not added after the boil');
// gravity points (PPG>SG) and the Expected Gravity: 10 lb at 80% Potential, 72% efficiency, 5 gal = 53.2 points; 1 lb of honey (75%, not mashed) = 6.9
const gr = { efficiency: 72, volumes: { batchLiters: 5 / 0.264172052 }, ingredients: { fermentables: [{ type: 'grain', kg: 4.5359237, yieldPct: 80 }, { type: 'sugar', kg: 0.45359237, yieldPct: 75 }] } };
assert.equal(Math.round(gravityPoints(gr.ingredients.fermentables[0], gr) * 10) / 10, 53.2); assert.equal(Math.round(gravityPoints(gr.ingredients.fermentables[1], gr) * 10) / 10, 6.9);
assert.equal(expectedGravity(gr), 1.06); assert.equal(calculateRecipe(gr).expectedSG, 1.06); assert.equal(recipeFieldValues({ ...gr, expectedSG: 1.06 }).rcp_Expected_Gravity, 1.06);
assert.equal(recipeFieldValues(gr).rcp_Grain_1_PPG_SG, 53.24); assert.equal(expectedGravity({ ingredients: { fermentables: [{ kg: 1, yieldPct: 80 }] } }), null, 'no Brew Length, no gravity');
assert.equal(recipeField('rcp_Fermentable_7_SRM')[1], 'Fermentable 7: color in SRM');
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
assert.equal(f.rcp_Name, 'Test IPA'); assert.equal(f.rcp_Batch_Volume, 5.5); assert.equal(f.rcp_Total_Grain_Weight, 11); assert.equal(f.rcp_Pitch_Temp, 66);
assert.equal(new Set(RECIPE_FIELDS.map(x => x[0])).size, RECIPE_FIELDS.length, 'every Skynet_Field name is used once');
assert.ok(RECIPE_FIELDS.every(([k]) => /^rcp_[A-Z][A-Za-z_]+$/.test(k)));

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
assert.equal(hf.rcp_Hop_Count, 8);
assert.equal(hf.rcp_Hop_1_Name, 'Magnum'); assert.equal(hf.rcp_Hop_1_AA_Actual, 11.7); assert.equal(hf.rcp_Hop_1_Calc_Amount, 1.01); assert.equal(hf.rcp_Hop_1_Boil_Group, 1); assert.equal(hf.rcp_Hop_1_Drop, 0);
assert.equal(hf.rcp_Hop_3_Drop, 55); assert.ok(hf.rcp_Hop_1_IBU > hf.rcp_Hop_3_IBU && hf.rcp_Hop_3_IBU > 0);
assert.equal(hf.rcp_Hop_4_Boil_Group, 0, 'a Mash hop is not a Boil Hop'); assert.equal(hf.rcp_Hop_4_IBU, 0);
assert.equal(hf.rcp_Hop_6_Use, 'secondary'); assert.equal(hf.rcp_Hop_6_Days, 7); assert.equal(hf.rcp_Hop_7_Date, '2026-11-05');
assert.equal(hf.rcp_Hop_8_Whirlpool_Temp, 176); assert.equal(hf.rcp_Hop_8_Hop_Rocket, true); assert.equal(hf.rcp_Hop_8_Min, 20); assert.equal(hf.rcp_Hop_8_Boil_Group, 4);
assert.equal(recipeField('rcp_Hop_12_IBU')[1], 'Hop 12 IBU', 'any hop line number is a Skynet_Field'); assert.equal(recipeField('rcp_Hop_1_Nope'), undefined);
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
assert.throws(() => mash.save('skynet-single-medium', { name: 'x' }), /Skynet Template/);
const mine = mash.create('My Mash', { from: 'skynet-step-protein' });
assert.equal(mine.steps.length, 2); assert.equal(mine.skynet, undefined);
const water = new ProfileStore(path.join(dir, 'water'), 'water');
const half = water.create('Half distilled', { from: 'skynet-balanced' });
assert.equal(water.save(half.id, { ...half, distilledPct: 50 }).distilledPct, 50);
assert.throws(() => water.save(half.id, { ...half, distilledPct: 150 }), /percent/);
console.log('recipe tests passed');
