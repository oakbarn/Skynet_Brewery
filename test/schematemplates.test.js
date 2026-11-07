// Schema Templates (Fritz, 2026-11-07, Rule 16.6): the five Brewhouse Tab Templates (1 Vessel, 1 Vessel + 1 Pump, 2 Vessel + 1 Pump,
// 2 Vessel + 2 Pumps, 3 Vessel), the OakBarn Template, and the Fermentor Template on its own. Each makes a plan whose Devices sit on
// free Ports, whose Brew Process jobs are all filled, and whose Process Templates (made for 1, 2 or 3 vessels) build and compile.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { startAnswers, planSchema, NS_DEFAULTS } from '../public/schemabuild.js';
import { ProcessTemplates, MAJOR_STEPS, brewSetup, buildBrewDay } from '../lib/brewprocess.js';
import { compile } from '../lib/engine.js';

const ROOT = path.join(import.meta.dirname, '..');
const dir = path.join(ROOT, 'templates', 'schema');
const ST = Object.fromEntries(fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => [f.slice(0, -5), { name: f.slice(0, -5), ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }]));
assert.deepEqual(Object.keys(ST).sort(), ['Skynet_1_Vessel', 'Skynet_1_Vessel_1_Pump', 'Skynet_2_Vessel_1_Pump', 'Skynet_2_Vessel_2_Pumps', 'Skynet_3_Vessel', 'Skynet_Fermentor', 'Skynet_OakBarn'].sort());
assert.ok(ST[NS_DEFAULTS.ns_template], 'the default Template is one of them');
const pt = new ProcessTemplates(path.join(ROOT, 'templates', 'process'), fs.mkdtempSync(path.join(os.tmpdir(), 'st')));
const want = { Skynet_1_Vessel: [1, 0], Skynet_1_Vessel_1_Pump: [1, 1], Skynet_2_Vessel_1_Pump: [2, 1], Skynet_2_Vessel_2_Pumps: [2, 2], Skynet_3_Vessel: [3, 2], Skynet_OakBarn: [7, 5] };
for (const st of Object.values(ST)) {
  const a = { ...startAnswers(st, {}), name: 'Test ' + st.name };
  const plan = planSchema(a, {});
  const hotV = plan.vessels.filter(v => !v.tab), pumps = plan.elements.filter(e => e.subtype === 'pump');
  if (want[st.name]) {
    assert.deepEqual([hotV.length, pumps.length], want[st.name], st.name + ': its vessels and pumps');
    for (const t of Object.values(st.process ?? {})) assert.ok(pt.list().some(x => x.name === t), `${st.name}: the Process Template ${t} is there`);
  } else {
    assert.equal(hotV.length, 0, 'the Fermentor Template has no hot side'); assert.equal(plan.tab, 'Fermentor');
    assert.equal(plan.vessels.length, 1); assert.ok(plan.fields.Ferment_Probe && plan.fields.Ferment_Heater, 'the Ferment step has its jobs');
  }
  // every Device on its own Port, every name its own
  const ports = plan.elements.filter(e => e.channel !== undefined && e.channel !== '').map(e => e.channel);
  assert.equal(new Set(ports).size, ports.length, st.name + ': each Device on its own Port');
  assert.equal(new Set(plan.elements.map(e => e.name.toLowerCase())).size, plan.elements.length, st.name + ': each name its own');
  for (const n of Object.values(plan.fields)) assert.ok(plan.elements.some(e => e.name === n), `${st.name}: job item ${n} is made`);
  // the Brew Day builds and compiles
  const setup = { ...brewSetup({}), templates: { ...brewSetup({}).templates, ...plan.templates }, fields: plan.fields };
  const out = buildBrewDay(setup, pt, plan.elements);
  for (const x of out) assert.deepEqual(compile(x.text).errors, [], `${st.name}: ${x.name} compiles`);
  if (st.name === 'Skynet_Fermentor') assert.deepEqual(out.map(x => x.name), ['Brew_1_Ferment'], 'a Fermentor on its own only ferments');
}
// the 1 and 2 Vessel models use their own Process Templates; the 3 Vessel uses the Skynet ones
assert.equal(planSchema({ ...startAnswers(ST.Skynet_1_Vessel_1_Pump, {}), name: 'x' }).templates.Strike, 'Skynet_Strike_1_Vessel');
assert.equal(planSchema({ ...startAnswers(ST.Skynet_2_Vessel_2_Pumps, {}), name: 'x' }).templates.Mash, 'Skynet_Mash_2_Vessel');
assert.equal(planSchema({ ...startAnswers(ST.Skynet_3_Vessel, {}), name: 'x' }).templates.Mash, undefined);
// OakBarn: its own names, the Blue pump mashes and the Red pump does the kettle side, six fermentors on the Fermentor Tab
const oak = planSchema({ ...startAnswers(ST.Skynet_OakBarn, {}), name: 'OakBarn' });
const lbl = n => oak.elements.find(e => e.name === n)?.label;
assert.equal(lbl(oak.fields.Mash_Pump), 'Blue pump'); assert.equal(lbl(oak.fields.Transfer_Pump), 'Red pump');
assert.deepEqual(oak.vessels.filter(v => !v.tab).map(v => v.label), ['Radiator', 'Big Mac', 'Mash Tun', 'Brew Kettle', 'Little Mac', 'Brewzilla', 'DigiBoil']);
assert.equal(oak.vessels.filter(v => v.tab === 'Fermentor').length, 6); assert.ok(oak.fields.Chill_Water && oak.fields.Wort_Probe);
assert.equal(oak.templates.Whirlpool_and_Chill, 'Skynet_Whirlpool_and_Chill');
// the Default settings: the number of fermentors on a hot side Template
assert.equal(startAnswers(ST.Skynet_3_Vessel, { ns_fermentors: '3' }).fermentors, 3);
assert.equal(startAnswers(ST.Skynet_3_Vessel, { ns_fermentors: '0' }).fermentors, 0);
// every Skynet Process Template compiles with every job picked and with none
const els = [{ name: 'H', type: 'pid' }, { name: 'T', type: 'temperature' }, { name: 'tm', type: 'timer' }, { name: 'P', type: 'digitalOut', subtype: 'pump' }, { name: 'V', type: 'digitalOut', subtype: 'valve' }];
const allF = { HLT_Heater: 'H', HLT_Probe: 'T', Mash_Heater: 'H', Mash_Probe: 'T', Mash_Pump: 'P', Mash_Timer: 'tm', Boil_Heater: 'H', Boil_Probe: 'T', Boil_Timer: 'tm', Chill_Pump: 'P', Wort_Probe: 'T',
  Chill_Water: 'V', Hop_Infuser_Valve: 'V', Whirlpool_Pump: 'P', Transfer_Pump: 'P', Clean_Pump: 'P', Ferment_Heater: 'H', Ferment_Probe: 'T' };
for (const t of pt.list().filter(x => x.cls === 'skynet')) for (const fields of [{}, allF]) {
  const templates = Object.fromEntries(MAJOR_STEPS.map(s => [s.key, s.key === t.step ? t.name : '']));
  for (const x of buildBrewDay({ templates, fields }, pt, els)) assert.deepEqual(compile(x.text).errors, [], `${t.name} compiles`);
}
console.log('schema template tests passed');
process.exit(0);
