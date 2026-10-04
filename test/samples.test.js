// Sample setups: node --no-warnings test/samples.test.js
// Loads each sample into a scratch folder, checks its pipes, pictures and scripts, then runs each brew day
// in Testing mode with a pretend brewer who clicks the advance switch and taps the alarms.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Store } from '../lib/store.js'; import { Engine } from '../lib/engine.js'; import { Hardware } from '../lib/hardware.js'; import { Control } from '../lib/control.js';
import { listSamples, loadSample } from '../lib/samples.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAMPLES = path.join(ROOT, 'samples', 'configs');
const list = listSamples(SAMPLES);
assert.deepEqual(list.map(s => s.id), ['oakbarn-brucontrol', 'two-vessel-one-pump', 'three-vessel-one-pump', 'brewzilla-brew-day']);

function scratch() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bps'));
  fs.mkdirSync(path.join(d, 'config')); fs.mkdirSync(path.join(d, 'scripts'));
  fs.writeFileSync(path.join(d, 'config', 'brewery.json'), JSON.stringify({ title: 'x', mediaRoots: [path.join(ROOT, 'media')], chooseSample: true, elements: [{ name: 'Old', type: 'global' }] }));
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
  if (sm.brucontrol) { assert.equal(c.elements.length, 911); assert.ok(c.devices.every(x => x.type === 'simulator')); continue; }
  assert.deepEqual(r.problems, [], `${sm.id}: script errors ${JSON.stringify(r.problems)}`);
  // every pipe joins two IPs, every picture exists
  const ips = new Set(c.graphics.filter(g => g.kind === 'ip').map(g => g.id));
  for (const e of c.elements) if (e.subtype === 'pump' || e.subtype === 'valve') { ips.add(`dev:${e.name}:in`); ips.add(`dev:${e.name}:out`); }
  for (const p of c.graphics.filter(g => g.kind === 'pipe')) {
    assert.ok(ips.has(p.from) && ips.has(p.to), `${sm.id}: pipe ${p.id} ends ${p.from} -> ${p.to}`);
    for (const n of p.flowWhen ?? []) assert.ok(store.has(n));
  }
  const pics = [...c.elements.flatMap(e => [e.image, e.imageOn, e.imageOff, e.sound]), ...c.graphics.map(g => g.image)].filter(Boolean);
  for (const f of pics) assert.ok(fs.existsSync(path.join(ROOT, 'media', f)), `${sm.id}: missing media ${f}`);
  for (const e of c.elements) if (e.input) assert.ok(store.has(e.input));
}

// ---- run each brew day, fast
async function brewDay(id, tweak) {
  const { store, engine, hw } = scratch();
  loadSample(SAMPLES, id, { store, engine, hw });
  const control = new Control(store); control.start();
  const tick = setInterval(() => store.tickTimers(0.05), 50);
  const sim = setInterval(() => hw._simulate(), 50);
  tweak(store);
  store.setProp('sw_Status_Testing', 'state', true);
  const seen = [];
  const brewer = setInterval(() => {                       // clicks whatever the panel asks for
    const st = store.getProp('gblV_Brew_Status', 'value');
    if (!seen.includes(st)) seen.push(st);
    if (store.getProp('sw_Advance_BrewStatus', 'visibility') === 'visible' && !store.getProp('sw_Advance_BrewStatus', 'state')) store.setProp('sw_Advance_BrewStatus', 'state', true, 'ui');
    for (const a of ['alm_Hops', 'alm_Step', 'alm_Warning']) if (store.getProp(a, 'active')) store.setProp(a, 'active', false, 'ui');
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
  seen.push(999);
  control.stop(); engine.stopAll(); hw.stop(); clearTimeout(store._persistTimer);
  const hops = [1, 2, 3, 4, 5, 6, 7, 8].filter(n => store.getProp(`gblB_Hop${n}_Added`, 'value'));
  return { seen, hops, secs: (Date.now() - t0) / 1000 };
}
const fast = store => {   // short recipe; heaters very quick
  store.setProp('gblVBoilTime_Minutes', 'value', 12); store.setProp('gblT_1_Mash_Time_R1', 'value', '00:02:00');
  store.setProp('gblT_MashOut_Time', 'value', '00:01:00'); store.setProp('gblV_Whirlpool_Min', 'value', 1);
  store.setProp('gblV_TimeHop1_Min_R1', 'value', 12); store.setProp('gblV_TimeHop2_Min_R1', 'value', 6); store.setProp('gblV_TimeHop3_Min_R1', 'value', 1);
  for (const e of store.list('temperature')) if (e.sim) { e.sim.heatRate = 40; e.sim.coolRate = 200; e.sim.followRate = 0.9; }
};
for (const id of ['brewzilla-brew-day', 'two-vessel-one-pump', 'three-vessel-one-pump']) {
  const r = await brewDay(id, fast);
  for (const st of [100, 150, 400, 500, 600, 700, 999]) assert.ok(r.seen.includes(st), `${id}: never reached step ${st} (${r.seen})`);
  assert.deepEqual(r.hops, [1, 2, 3, 4, 5], `${id}: hops marked added`);
  console.log(`${id}: brew day ran in ${r.secs.toFixed(1)} s through ${r.seen.length} steps`);
}
console.log('samples tests passed');
process.exit(0);
