// Rule 2.59: data is always metric, Units are for showing only (Panel Updates Sandbox entry 9)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { toMetric, forShow, defaultsToMetric } from '../public/unitconvert.js';
import { keepMetric } from '../lib/store.js';

// a US Vessel (no tag = US) is kept in liters and cm; once metric it is left alone
const v = toMetric.vessel({ kind: 'vessel', volume: 10, deadspace: 0.5, diameter: 16, vheight: 17 });
assert.deepEqual([v.units, v.volume, v.deadspace, v.diameter, v.vheight], ['Metric', 37.8541, 1.8927, 40.64, 43.18]);
assert.equal(toMetric.vessel(v), null, 'only once');
assert.equal(toMetric.vessel({ kind: 'vessel', label: 'a fitting' }), null, 'nothing to size');
// shown in US and back: no drift
assert.equal(forShow.vessel(v, 'US').volume, 10); assert.equal(forShow.vessel(v, 'US').diameter, 16);
const m = toMetric.mash({ units: 'US', steps: [{ name: 'Sacch', temp: 152, time: 60 }], spargeTemp: 168 });
assert.equal(forShow.mash(m, 'US').steps[0].temp, 152, '152 °F comes back as 152 °F');
for (let i = 0, x = m; i < 5; i++) { x = toMetric.mash(forShow.mash(x, 'US')); assert.equal(x.steps[0].temp, 66.6667, 'switching back and forth never drifts'); }
// an Equipment Profile: its numbers, its Equipment list (in its own units) and the Vessels in its drawing
const e = toMetric.equipment({ units: 'US', trubChillerLoss: 0.5, grainAbsorption: 0.12, brewhouseEfficiency: 72, equipment: [{ volume: 15 }], graphics: [{ kind: 'vessel', volume: 10 }, { kind: 'pipe' }] });
assert.deepEqual([e.trubChillerLoss, e.grainAbsorption, e.brewhouseEfficiency, e.equipment[0].volume, e.graphics[0].volume, e.graphics[0].units], [1.8927, 1.0014, 72, 56.7812, 37.8541, 'Metric']);
assert.equal(toMetric.equipment(e), null);

// the Default settings: an older Boil Start and Ferment temperature in the Units become °C
assert.deepEqual(defaultsToMetric({ units: 'US', boilStartTemp: 212, fermentTemp: 68, batchL: 20 }), { units: 'US', boilStartTempC: 100, fermentTempC: 20, batchL: 20 });
assert.deepEqual(defaultsToMetric({ units: 'Metric', fermentTemp: 19 }), { units: 'Metric', fermentTempC: 19 });
assert.equal(defaultsToMetric({ units: 'US', batchL: 20 }), null);

// a Schema: its Vessels and Defaults, kept in metric when loaded and when saved
const c = { graphics: [{ kind: 'vessel', volume: 10 }, { kind: 'pipe', size: '0.5' }], brewDefaults: { units: 'US', fermentTemp: 68 } };
assert.equal(keepMetric(c), true); assert.equal(c.graphics[0].volume, 37.8541); assert.equal(c.brewDefaults.fermentTempC, 20);
assert.equal(keepMetric(c), false, 'only once');

// the 3 Vessel Sample and the starting Schema are all metric (OakBarn Brewery: "3 Vessel Schema ALL Metric Data")
for (const f of ['samples/configs/three-vessel-one-pump/config.json', 'config/brewery.json']) {
  const s = JSON.parse(fs.readFileSync(f, 'utf8'));
  assert.ok(!s.elements.some(x => ['°F', 'gal', 'oz', 'lb'].includes(x.units)), `${f}: no US units`);
  assert.ok(s.elements.filter(x => x.type === 'temperature').every(x => x.units === '°C'), `${f}: probes in °C`);
  assert.ok(s.graphics.filter(g => g.kind === 'vessel' && g.volume !== undefined).every(g => g.units === 'Metric'), `${f}: Vessels in liters`);
  assert.equal(s.beerxml.units, 'Metric'); assert.equal(s.beerxml.mash.units, 'C');
}
for (const f of ['samples/configs/three-vessel-one-pump/processes/BrewDay_Flow.txt', 'processes/BrewDay_Flow.txt'])
  assert.ok(!/°F| oz /.test(fs.readFileSync(f, 'utf8')), `${f}: the Process speaks °C and grams`);
// the shipped Vessel Templates are metric
for (const f of fs.readdirSync('templates/vessel')) assert.equal(toMetric.vessel(JSON.parse(fs.readFileSync('templates/vessel/' + f, 'utf8'))), null, f);
console.log('unitconvert tests passed');

// BeerXML into a metric Schema: liters and grams (a map with units Metric); gallons and ounces otherwise (BruControl Schemas)
{
  const { importBeerXml } = await import('../lib/beerxml.js');
  const xml = fs.readFileSync('samples/sample_recipe.xml', 'utf8');
  const fake = () => { const vals = new Map(); return { vals, has: () => true, get: n => ({ name: n }), setProp: (n, p, v) => vals.set(n, v) }; };
  const map = JSON.parse(fs.readFileSync('samples/configs/three-vessel-one-pump/config.json', 'utf8')).beerxml;
  const met = fake(), us = fake();
  importBeerXml(xml, met, map); importBeerXml(xml, us, { ...map, units: undefined });
  const b = met.vals.get('gblV_BatchSize_Gal'), bu = us.vals.get('gblV_BatchSize_Gal');
  assert.ok(Math.abs(b / bu - 3.785) < 0.01, `batch in liters (${b} L, ${bu} gal)`);
  const h = met.vals.get('gblV_Hop1_Oz_R1'), hu = us.vals.get('gblV_Hop1_Oz_R1');
  assert.ok(Math.abs(h / hu - 28.35) < 0.5, `hops in grams (${h} g, ${hu} oz)`);
  console.log('BeerXML metric ok');
}
