// Sample setups: node --no-warnings test/samples.test.js
// Loads each sample into a scratch folder, checks its pipes, pictures and scripts, then runs each brew day
// in Testing mode with a pretend brewer who clicks the advance switch and taps the alarms.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Store } from '../lib/store.js'; import { Engine } from '../lib/engine.js'; import { Hardware } from '../lib/hardware.js'; import { Control } from '../lib/control.js';
import { listSamples, loadSample, simulated } from '../lib/samples.js';
import { HopAlerts } from '../lib/recipe.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAMPLES = path.join(ROOT, 'samples', 'configs');
const list = listSamples(SAMPLES);
// only the 3 Vessel 1 Pump sample (the test bed) ships; the others wait in Sandbox/ (Fritz, 2026-11-08, Rule 16.8)
assert.deepEqual(list.map(s => s.id), ['three-vessel-one-pump']);

// Rule 9.13: the extra Sample Schemas (sample_schemas/, from the Sample Schemas Setup) are listed after the panel's own, and a name
// the panel already has wins. The repo's sample_schemas/ holds no Schemas yet, only its ReadMe.
assert.deepEqual(listSamples([SAMPLES, path.join(ROOT, 'sample_schemas')]).map(s => s.id), ['three-vessel-one-pump']);
assert.ok(fs.existsSync(path.join(ROOT, 'sample_schemas', 'ReadMe.txt')));
{
  const extra = fs.mkdtempSync(path.join(os.tmpdir(), 'bpx'));
  fs.mkdirSync(path.join(extra, 'from-a-brewer')); fs.writeFileSync(path.join(extra, 'from-a-brewer', 'sample.json'), JSON.stringify({ name: 'A brewer', order: 9 }));
  fs.mkdirSync(path.join(extra, 'three-vessel-one-pump')); fs.writeFileSync(path.join(extra, 'three-vessel-one-pump', 'sample.json'), JSON.stringify({ name: 'Not this one' }));
  fs.mkdirSync(path.join(extra, 'broken')); fs.writeFileSync(path.join(extra, 'broken', 'sample.json'), '{ not json');
  const both = listSamples([SAMPLES, extra]);
  assert.deepEqual(both.map(s => s.id), ['three-vessel-one-pump', 'from-a-brewer']);
  assert.equal(both[0].name, list[0].name);
  fs.rmSync(extra, { recursive: true, force: true });
}

// a sample's Interfaces always come in on the simulator, keeping the real connection to switch to later (Fritz, 2026-10-28)
assert.deepEqual(simulated([{ name: 'M', connection: 'serial', port: 'COM3' }, { name: 'S', connection: 'simulator', realConnection: 'tcp' }]),
  [{ name: 'M', connection: 'simulator', realConnection: 'serial', port: 'COM3' }, { name: 'S', connection: 'simulator', realConnection: 'tcp' }]);

function scratch() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bps'));
  fs.mkdirSync(path.join(d, 'config')); fs.mkdirSync(path.join(d, 'scripts'));
  fs.writeFileSync(path.join(d, 'config', 'brewery.json'), JSON.stringify({ title: 'x', mediaRoots: [path.join(ROOT, 'media')], chooseSample: true, elements: [{ name: 'Old', type: 'gGlobal', kind: 'value' }] }));
  const store = new Store(path.join(d, 'config', 'brewery.json'), path.join(d, 'data')); store.load();
  const engine = new Engine(store, path.join(d, 'scripts'), { logNow() { }, scriptStarted() { } });
  const hw = new Hardware(store);
  return { d, store, engine, hw };
}

for (const sm of list) {
  const { d, store, engine, hw } = scratch();
  const r = loadSample(SAMPLES, sm.id, { store, engine, hw });
  hw.stop();
  const c = store.config;
  assert.equal(c.sample, sm.id); assert.equal(c.chooseSample, false);
  assert.ok(fs.existsSync(path.join(d, r.backup)), 'old config backed up');
  assert.ok(!store.has('Old'));
  assert.ok(c.devices.every(x => x.connection === 'simulator'), 'nothing real is switched by a sample');
  // 897 imported, 2 x 3 stacked look-alikes folded into 2, plus the built-in SoundPlayer and the Start Brew Day button
  if (sm.brucontrol) {
    // the brew day starts from a button; scrStart0_0's call to a Process BruControl never had is now a comment
    assert.equal(store.get('btn_Start_Brew_Day')?.tapTarget, 'scrStart0_0');
    assert.deepEqual(engine.check(engine.read('scrStart0_0')).errors, []);
    assert.match(engine.read('scrStart0_0'), /\/\/ skipped, no such Process in BruControl either: start "strt_scrEndAllscripts"/);
  }
  if (sm.brucontrol) { assert.equal(c.elements.length, 895); assert.ok(!c.elements.some(e => e.type === 'global')); assert.ok(c.devices.every(x => x.connection === 'simulator')); continue; }
  assert.deepEqual(r.problems, [], `${sm.id}: script errors ${JSON.stringify(r.problems)}`);
  // every pipe joins two IPs, every picture exists
  const ips = new Set(c.graphics.filter(g => g.kind === 'ip').map(g => g.id));
  for (const e of c.elements) if (e.subtype === 'pump' || e.subtype === 'valve') { ips.add(`dev:${e.name}:in`); ips.add(`dev:${e.name}:out`); }
  // a Clone of a pump or valve has its own IPs on its own Tab (Rule 4.4)
  for (const g of c.graphics) if (g.kind === 'clone' && c.elements.some(e => e.name === g.of && (e.subtype === 'pump' || e.subtype === 'valve'))) { ips.add(`dev:${g.name}:in`); ips.add(`dev:${g.name}:out`); }
  // a Manual Valve Widget's own IPs (a Tap Water Valve has only its hose outlet, Rule 5.33)
  for (const g of c.graphics) if (g.kind === 'ip' && g.fitting === 'manualValve') { ips.add(`eq:${g.id}:in`); ips.add(`eq:${g.id}:out`); }
  for (const p of c.graphics.filter(g => g.kind === 'pipe')) {
    assert.ok(ips.has(p.from) && ips.has(p.to), `${sm.id}: pipe ${p.id} ends ${p.from} -> ${p.to}`);
    assert.ok(!('flowWhen' in p), `${sm.id}: pipe ${p.id} still has the old Only when list`);
  }
  const pics = [...c.elements.flatMap(e => [e.image, e.imageOn, e.imageOff, e.sound]), ...c.graphics.map(g => g.image)].filter(Boolean);
  for (const f of pics) assert.ok(fs.existsSync(path.join(ROOT, 'media', f)), `${sm.id}: missing media ${f}`);
  for (const e of c.elements) if (e.input) assert.ok(store.has(e.input));
}

// The Three Vessel sample is the test bed and follows the latest standard (Fritz, 2026-11-08): Device names
// InterfaceID_Port_TypeID_Label_TabID (Rule 3.1), Widget names wgt_Type_Label_TabID (Rule 3.14), a space in the Label is ~.
// gGlobals keep their names (the Rule 1.16 prefix change is on hold). The Recipe and its hops are the skn_rcp_ values, never gGlobals
// (OakBarn Brewery, 2026-11-21: "Those should be back house skynet variables", "if the gGlobals are no longer needed, trash").
{
  const c3 = JSON.parse(fs.readFileSync(path.join(SAMPLES, 'three-vessel-one-pump', 'config.json'), 'utf8'));
  for (const e of c3.elements) {
    if (e.type === 'gGlobal') continue;
    const dev = ['temperature', 'digitalOut', 'digitalIn'].includes(e.type);      // the Water Tab (WA): Process Sample 1, 2026-11-20
    assert.match(e.name, dev ? /^(BM1w1_\d+|BM_\d+_(DO@H_Element|DO@Pump|DO@Chill|DO@Valve_E|DI@Float))_[A-Za-z0-9~]+_(BH|WA)$/ : /^wgt_[A-Z]+_[A-Za-z0-9~]+_(BH|RE|RP|WA)$/, `three-vessel-one-pump: ${e.name} has a Skynet name`);
  }
  assert.ok(!c3.elements.some(e => /^gbl[A-Z]?_?(Hop|TimeHop|BeerName|Style|OG|FG|IBU|BatchSize|BoilSize|Desired|Sparge|Pitch|Whirlpool|Mash|MashOut)|^gblVBoilTime|^gblT_\d_Mash/.test(e.name)), 'no Recipe gGlobals in the sample');
  assert.ok(!c3.beerxml && !c3.elements.some(e => e.workspace === 'Recipe'), 'no BeerXML mapping and nothing on the Recipe Tab: the Recipe is on ☰ Menu > Recipe');
  const flow = fs.readFileSync(path.join(SAMPLES, 'three-vessel-one-pump', 'processes', 'BrewDay_Flow.txt'), 'utf8');
  assert.match(flow, /start_hop_alerts "wgt_TMR_Step~timer_BH", vVScale/);
  assert.doesNotMatch(flow, /gbl[SVBT]_?(Hop|TimeHop|BeerName|Desired|Sparge|Pitch|Whirlpool|Mash_\d)|gblVBoilTime|gblT_\d_Mash/);
  for (const g of c3.graphics.filter(g => g.kind === 'text')) assert.match(g.name ?? '', /^wgt_TXT_[A-Za-z0-9~]+_(BH|RE|RP|WA)$/, `three-vessel-one-pump: Text ${g.id} has a Skynet name`);
}

// ---- run each brew day, fast
const OLD_NAMES = { testing: 'sw_Status_Testing', advance: 'sw_Advance_BrewStatus', alarms: ['alm_Hops', 'alm_Step', 'alm_Warning'] };
const NAMES = { 'three-vessel-one-pump': { testing: 'wgt_SW_Testing_BH', advance: 'wgt_SW_Advance_BH', alarms: ['wgt_ALM_Step~alarm_BH', 'wgt_ALM_Warning_BH'] } };
async function brewDay(id, tweak) {
  const { store, engine, hw } = scratch();
  loadSample(SAMPLES, id, { store, engine, hw });
  const control = new Control(store); control.start();
  const alerts = [], hops = new HopAlerts({ store, send: a => alerts.push(a), recipe: () => store.config.recipe ?? null });
  engine.onRecipe = (cmd, args) => cmd === 'start' ? hops.start(args[0], 'test', args[1]) : cmd === 'stop' ? (hops.stop(), 'stopped') : '';
  const tick = setInterval(() => store.tickTimers(0.05), 50);
  const sim = setInterval(() => hw._simulate(), 50);
  tweak(store);
  // the Three Vessel sample has the Skynet names (Rule 3.14, Fritz 2026-11-08: "bring anything on 3 Vessel up to latest standard")
  const n = NAMES[id] ?? OLD_NAMES;
  store.setProp(n.testing, 'state', true);
  const seen = [], labels = [];
  const brewer = setInterval(() => {                       // clicks whatever the panel asks for
    const st = store.getProp('gblV_Brew_Status', 'value');
    if (!seen.includes(st)) seen.push(st);
    const lb = store.getProp('wgt_TMR_Step~timer_BH', 'label'); if (!labels.includes(lb)) labels.push(lb);
    if (store.getProp(n.advance, 'visibility') === 'visible' && !store.getProp(n.advance, 'state')) store.setProp(n.advance, 'state', true, 'ui');
    for (const a of n.alarms) if (store.getProp(a, 'active')) store.setProp(a, 'active', false, 'ui');
  }, 120);
  engine.start('BrewDay_Flow', 'user');
  const t0 = Date.now();
  while (store.getProp('gblV_Brew_Status', 'value') !== 999) {
    const s = engine.list().find(x => x.name === 'BrewDay_Flow');
    if (s.state === 'error') throw new Error(`${id}: ${s.error}`);
    if (Date.now() - t0 > 120000) throw new Error(`${id}: stuck at status ${store.getProp('gblV_Brew_Status', 'value')}`);
    await new Promise(r => setTimeout(r, 100));
  }
  for (const t of [brewer, tick, sim]) clearInterval(t);
  hops.stop();
  seen.push(999);
  control.stop(); engine.stopAll(); hw.stop(); clearTimeout(store._persistTimer);
  return { seen, labels, alerts, secs: (Date.now() - t0) / 1000 };
}
const hop = (name, use, time, extra = {}) => ({ name, kg: 0.028, alpha: 8, use, time, ...extra });
const fast = store => {   // short recipe (the Skynet Recipe, read as skn_rcp_ values); heaters very quick
  store.config.recipe = { name: 'Sample Pale Ale', boilTime: 12, strikeTempC: 72, spargeTempC: 76, pitchTempC: 20,
    mash: { steps: [{ name: 'Saccharification', tempC: 66, min: 2 }] },
    ingredients: { fermentables: [], yeasts: [], miscs: [], hops: [hop('Magnum', 'mash', 0), hop('Cascade', 'first wort', 0), hop('Centennial', 'boil', 12),
      hop('Citra', 'boil', 6), hop('Mosaic', 'boil', 1), hop('Amarillo', 'whirlpool', 10), hop('Galaxy', 'dry hop', 0, { dryDays: 4 })] } };
  for (const e of store.list('temperature')) if (e.sim) { e.sim.heatRate = 40; e.sim.coolRate = 200; e.sim.followRate = 0.9; }
};
for (const id of ['three-vessel-one-pump']) {
  const r = await brewDay(id, fast);
  for (const st of [100, 150, 400, 500, 600, 700, 999]) assert.ok(r.seen.includes(st), `${id}: never reached step ${st} (${r.seen})`);
  // the Step timer says what the brew is doing (OakBarn Brewery, 2026-11-25: "Change the label of the Step time to say what it is doing
  // i.e. Transferring 1st Run"); the Schema keeps its own Label
  for (const l of ['Transferring Strike Water', 'Mashing Step 1', 'Transferring 1st Run', 'Transferring 2nd Run', 'Boiling', 'Transferring to the Fermenter']) assert.ok(r.labels.includes(l), `${id}: Step timer never said "${l}" (${r.labels})`);
  // Skynet's hop alerts followed the sped-up boil timer: a drop for each boil hop and the Whirlpool, in order
  const drops = r.alerts.filter(a => a.kind === 'drop').map(a => a.text).join(' | ');
  for (const h of ['Centennial', 'Citra', 'Mosaic', 'Amarillo']) assert.match(drops, new RegExp(h), `${id}: no drop alert for ${h} (${drops})`);
  assert.ok(drops.indexOf('Centennial') < drops.indexOf('Citra') && drops.indexOf('Citra') < drops.indexOf('Mosaic'), `${id}: drops in boil order (${drops})`);
  console.log(`${id}: brew day ran in ${r.secs.toFixed(1)} s through ${r.seen.length} steps`);
}
console.log('samples tests passed');
process.exit(0);

// the 3 Vessel sample and the default Schema carry the same Schema version, set by OakBarn Brewery
{
  const meta = JSON.parse(fs.readFileSync(new URL('../samples/configs/three-vessel-one-pump/sample.json', import.meta.url), 'utf8'));
  const def = JSON.parse(fs.readFileSync(new URL('../config/brewery.json', import.meta.url), 'utf8'));
  assert.match(meta.version, /^Three_Vessel_Brewery_\d{8}T\d{4}$/);
  assert.equal(def.schema.version, meta.version);
}
