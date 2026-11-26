// The Recipe Interview (Rule 17.22, Plans section 5.3): Import, Extract Kit, All Grain or Other Brews, then Ferment, Package and Brew
// Day; every amount, time and temperature asked, typed in Units and kept metric; the rows are data
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { RECIPE_QUESTIONS, RECIPE_START, questionById, recipePath, interviewRecipe, toMetric, unitOf, OTHER_BREWS } from '../public/recipeinterview.js';
import { cleanRecipe, cleanInterview } from '../lib/recipe.js';

// the rows: unique numbers; every next points to a row (or done / import); his first question is the IMPORT one
assert.equal(new Set(RECIPE_QUESTIONS.map(q => q.id)).size, RECIPE_QUESTIONS.length);
assert.equal(RECIPE_START, 'R1');
assert.match(questionById('R1').ask, /IMPORT/);
for (const q of RECIPE_QUESTIONS) {
  assert.ok(q.ask && q.branch && (q.boxes || q.list), q.id);
  if (typeof q.next === 'string') assert.ok(q.next === 'done' || questionById(q.next), `${q.id} -> ${q.next}`);
}
// "No: Kombucha, Ginger Beer ... in a DDLB": more than 6, so a dropdown (Rule 2.6)
assert.ok(OTHER_BREWS.length > 6 && OTHER_BREWS.some(([, t]) => t === 'Kombucha') && OTHER_BREWS.some(([, t]) => t === 'Ginger Beer'));

// the branches
const ids = a => recipePath(a, {}).rows.map(q => q.id);
assert.equal(recipePath({ R1: true }, {}).end, 'import');
assert.deepEqual(ids({ R1: false, R2: true, E2_kind: '2' }).slice(0, 5), ['R1', 'R2', 'E1', 'E2', 'E3']);
assert.ok(!ids({ R1: false, R2: true, E2_kind: '2' }).includes('E8'), 'steeping grains only for Level 3 kits');
assert.ok(ids({ R1: false, R2: true, E2_kind: '3' }).includes('E9'));
assert.ok(!ids({ R1: false, R2: true, E2_kind: '1' }).includes('E13'), 'a Can Kit has no hops to add');
assert.ok(ids({ R1: false, R2: false, R3: true }).includes('A6'));
assert.ok(!ids({ R1: false, R2: false, R3: true }).includes('A3'), 'grain milled? only with own Grain Mill');
assert.ok(recipePath({ R1: false, R2: false, R3: true }, { brewerType: 'allgrainmill' }).rows.some(q => q.id === 'A3'));
assert.ok(ids({ R1: false, R2: false, R3: false, brewKind: 'mead' }).includes('O7'));
assert.ok(!ids({ R1: false, R2: false, R3: false, brewKind: 'cider' }).includes('O7'));
for (const a of [{ R1: false, R2: true }, { R1: false, R2: false, R3: true }, { R1: false, R2: false, R3: false }]) {
  const p = ids(a); assert.ok(p.includes('F1') && p.includes('F10') && p.includes('B1'), 'every branch ends with Ferment, Package and Brew Day');
  assert.equal(recipePath(a, {}).end, 'done');
}

// Units: typed in US or Metric, kept metric (Rule 2.59)
assert.equal(unitOf('temp', false), '°F'); assert.equal(unitOf('vol', true), 'L'); assert.equal(unitOf('hopwt', false), 'oz');
assert.equal(toMetric('temp', 212, false), 100);
assert.equal(toMetric('vol', 10, true), 10);
assert.equal(toMetric('hopwt', 1, false), 0.02835);

// the Hefeweizen sheet (Plans 5.2): the Recipe it makes
const hef = { R1: false, R2: true, name: 'Bavarian Hefeweizen', style: 'Weizen', E2_kind: '2', batch: 5, og: 1.049, ibu: 15.8, abv: 5.1,
  extracts: [{ name: 'Wheat malt syrup', form: 'extract', amt: 6, when: 'start' }, { name: 'Wheat DME', form: 'dry extract', amt: 1, when: 'late', min: 15 }],
  boilVol: 2.5, extractAddTemp: 212, offHeat: true, boilMin: 60, hops: [{ name: 'Tettnang', amt: 1, aa: 4.5, use: 'boil', min: 60 }], chillTemp: 68, chillHow: 'ice', prefillVol: 2,
  yeasts: [{ name: 'Weizen', form: 'Dry', amount: 1 }], pitchTemp: 70, package: 'bottle', primingSugar: 'Corn sugar', hopsActual: { Tettnang: 4.2 } };
const r = interviewRecipe(hef, { metric: false, base: { boilTime: 60, mashProfile: 'skynet-single-batch' } });
assert.equal(r.level, 2); assert.equal(r.name, 'Bavarian Hefeweizen'); assert.equal(r.mashProfile, 'skynet-single-batch');
assert.equal(r.volumes.batchLiters, 18.927059); assert.equal(r.volumes.boilLiters, 9.463529);
assert.deepEqual(r.ingredients.fermentables.map(f => [f.name, f.type, f.kg]), [['Wheat malt syrup', 'extract', 2.721554], ['Wheat DME', 'dry extract', 0.453592]]);
assert.deepEqual(r.ingredients.hops.map(h => [h.name, h.kg, h.alpha, h.alphaActual, h.use, h.time]), [['Tettnang', 0.02835, 4.5, 4.2, 'boil', 60]]);
assert.equal(r.boilTime, 60); assert.equal(Math.round(r.pitchTempC * 10) / 10, 21.1);
// the answers with no Recipe box yet are kept, in metric
assert.deepEqual(r.interview.fermentableAdditions, [{ name: 'Wheat malt syrup', when: 'start', min: null }, { name: 'Wheat DME', when: 'late', min: 15 }]);
assert.equal(r.interview.extractAddTempC, 100); assert.equal(r.interview.chillTempC, 20); assert.equal(r.interview.offHeatToStir, true);
assert.equal(r.interview.abvPct, 5.1); assert.equal(r.interview.package, 'bottle');
// and they survive the Brain's cleaning (never dropped)
const c = cleanRecipe(r);
assert.deepEqual(c.interview, r.interview);
assert.equal(cleanInterview({ 'bad key': 1 }), undefined);
assert.equal(cleanRecipe({ name: 'x' }).interview, undefined);

// a No Boil Can Kit: Boil 0, no Boil Profile, the water boiled and cooled for sanitation
const can = interviewRecipe({ R1: false, R2: true, E2_kind: '1', boilMin: 0, waterBoilMin: 5, waterCoolTemp: 20 }, { metric: true, base: { boilProfile: 'skynet-boil-60' } });
assert.equal(can.level, 1); assert.equal(can.boilTime, 0); assert.equal(can.boilProfile, '');
assert.equal(can.interview.waterBoilMinutes, 5); assert.equal(can.interview.waterCoolTempC, 20);

// All Grain: grain, mash steps (+ mash out), sparge
const ag = interviewRecipe({ R1: false, R2: false, R3: true, name: 'Pale', grains: [{ name: '2-Row', amt: 10, color: 2, yield: 80 }],
  mashSteps: [{ name: 'Sacch', temp: 152, min: 60, how: 'infusion' }], mashOut: true, mashOutTemp: 168, mashOutMin: 10, spargeType: 'fly', spargeVol: 4, spargeTemp: 168 }, { metric: false });
assert.equal(ag.level, 4);
assert.deepEqual(ag.ingredients.fermentables[0], { name: '2-Row', type: 'grain', kg: 4.535924, color: 2, yieldPct: 80 });
assert.deepEqual(ag.mash.steps.map(s => [s.name, Math.round(s.tempC * 10) / 10, s.min]), [['Sacch', 66.7, 60], ['Mash Out', 75.6, 10]]);
assert.equal(ag.spargeType, 'fly');

// Other Brews: a Ginger Beer at Level 1, the style from the dropdown
const gb = interviewRecipe({ R1: false, R2: false, R3: false, brewKind: 'ginger', boilMin: 0, adds: [{ name: 'Ginger', amount: 200, unit: 'g' }] }, { metric: true });
assert.equal(gb.level, 1); assert.equal(gb.style, 'Ginger Beer'); assert.deepEqual(gb.ingredients.miscs[0], { name: 'Ginger', use: 'primary', amount: 200, unit: 'g', time: 0 });

// the panel: 🧭 INTERVIEW on the Recipe tab and on No Recipe Found; Help 249 in English and French
const app = fs.readFileSync('public/app.js', 'utf8');
assert.match(app, /'🧭 INTERVIEW'/);
assert.match(app, /'🧭 Recipe Interview'/);
for (const f of ['help/249-recipe-interview.md', 'help/fr/249-recipe-interview.md']) assert.ok(fs.existsSync(f), f);
console.log('recipeinterview tests passed');
