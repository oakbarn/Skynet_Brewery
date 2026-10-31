// The Standard Skynet Brew Process (Fritz, 2026-10-30): Process Templates for the seven major steps, rcp_ Recipe values,
// ask "...", the Close all / Open all valve lists (a tap water valve is always on Close all, never on Open all)
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store, onCloseAll, onOpenAll, fixValveLists } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';
import { ProcessTemplates, MAJOR_STEPS, expand, usedFields, recipeValues, strikeTemp, brewSetup, buildBrewDay, processName } from '../lib/brewprocess.js';

// ---- the valve lists
const v = (o = {}) => ({ type: 'digitalOut', subtype: 'valve', ...o });
assert.ok(onCloseAll(v()) && onOpenAll(v()), 'a valve is on both lists by default');
assert.ok(!onCloseAll(v({ closeAll: false })) && !onOpenAll(v({ openAll: false })), 'each list has its switch');
assert.ok(onCloseAll(v({ tapwater: true, closeAll: false })), 'a tap water valve is always on Close all');
assert.ok(!onOpenAll(v({ tapwater: true, openAll: true })), 'and never on Open all');
assert.ok(!onCloseAll(v({ valveType: 'manual' })) && !onOpenAll(v({ valveType: 'manual' })), 'a Manual valve is on neither');
assert.ok(!onCloseAll({ type: 'digitalOut', subtype: 'pump' }), 'pumps are not valves');
const tap = v({ tapwater: true, closeAll: false, openAll: true }); fixValveLists(tap);
assert.ok(!('closeAll' in tap) && !('openAll' in tap), 'a saved tap water valve keeps no list switches');

// ---- the build lines
const F = { HLT_Heater: 'PID_HLT', HLT_Probe: '' };
assert.equal(expand('a\n@if HLT_Heater\n{{HLT_Heater}}.enabled = true\n@else\nask "x"\n@end\nb', F), 'a\nPID_HLT.enabled = true\nb');
assert.equal(expand('@if HLT_Probe\nwait {{HLT_Probe}} >= 1\n@else\nask "by hand"\n@end', F), 'ask "by hand"');
assert.equal(expand('@each_mash_step\nx{{n}}\n@end', {}).split('\n').length, 8, 'one block per possible mash step');
assert.throws(() => expand('{{HLT_Probe}} = 1', F), /no Hot Liquor Tank temperature probe is picked/);
assert.throws(() => expand('@if Nope\n@end', {}), /needs a field name/);
assert.throws(() => expand('@if HLT_Heater\nx', {}), /no @end/);
assert.deepEqual(usedFields('@if HLT_Probe\n{{HLT_Heater}}\n@end').sort(), ['HLT_Heater', 'HLT_Probe']);

// ---- Recipe values
assert.equal(strikeTemp(152, 68, 1.5, false), 163.2, 'Palmer, US');
assert.equal(strikeTemp(67, 20, 3.1, true), 73.2, 'Palmer, metric');
const prof = { mash: [{ id: 'm1', name: 'Two step', steps: [{ name: 'Protein', temp: 122, time: 15 }, { name: 'Sacch', temp: 152, time: 60 }], mashOutTemp: 168, spargeTemp: 170 }], boil: [{ id: 'b1', boilTime: 90 }] };
let rv = recipeValues({ brewDefaults: { units: 'US', mashProfile: 'm1', boilProfile: 'b1' } }, prof);
assert.equal(rv.rcp_Loaded, false); assert.equal(rv.rcp_Mash_Steps, 2); assert.equal(rv.rcp_Mash_Step_2_Temp, 152);
assert.equal(rv.rcp_Boil_Time.s, 5400, 'boil time is a time'); assert.equal(rv.rcp_Mash_Step_1_Time.s, 900);
// the Skynet Recipe (lib/recipe.js) is kept in kg, L and °C; Processes read it in the panel's units
rv = recipeValues({ brewDefaults: { units: 'US' }, recipe: { name: 'IPA', grainKg: 12 / 2.20462262, waterToGrain: 1.5 * 2.0864, ingredients: { fermentables: [{ type: 'grain', kg: 12 / 2.20462262 }], hops: [], yeasts: [{ name: 'US-05' }] },
  mash: { steps: [{ name: 'Sacch', tempC: (152 - 32) * 5 / 9, min: 60 }] }, boilTime: 60, spargeType: 'fly', whirlpoolMinutes: 20 } }, prof);
assert.equal(rv.rcp_Loaded, true); assert.equal(rv.rcp_Total_Grain_Weight, 12); assert.equal(rv.rcp_Strike_Volume, 4.5, '12 lb x 1.5 qt/lb = 4.5 gal');
assert.equal(rv.rcp_Mash_Steps, 1); assert.equal(rv.rcp_Mash_Step_1_Temp, 152); assert.equal(rv.rcp_Yeast_Name, 'US-05');
assert.equal(rv.rcp_Sparge_Type, 'fly', 'every Skynet_Field can be read'); assert.equal(rv.rcp_Whirlpool_Minutes, 20);
rv = recipeValues({ brewDefaults: { units: 'US' }, recipe: { name: 'IPA', mashProfile: 'm1', boilTime: 60, ingredients: { fermentables: [] }, mash: { steps: [] } } }, prof);
assert.equal(rv.rcp_Mash_Steps, 2, 'the Mash Profile picked on the Recipe wins'); assert.equal(rv.rcp_Mash_Out_Temp, 168);

// ---- the Skynet Process Templates build into seven Flow Processes that compile
const root = path.resolve('templates/process');
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'brewproc'));
const pt = new ProcessTemplates(root, path.join(d, 'user'));
const all = pt.list();
for (const s of MAJOR_STEPS) assert.ok(all.some(t => t.step === s.key && t.cls === 'skynet' && t.name === 'Skynet_' + s.key), 'a Skynet Process Template for ' + s.key);
const elements = [
  { name: 'PID_HLT', type: 'pid' }, { name: 'T_HLT', type: 'temperature' }, { name: 'T_Mash', type: 'temperature' }, { name: 'tm_Boil', type: 'timer' },
  { name: 'Pump_Chill', type: 'digitalOut', subtype: 'pump' }, { name: 'V_Tap', ...v({ tapwater: true }) }, { name: 'V_HLT_Out', ...v() },
];
for (const fields of [{}, { HLT_Heater: 'PID_HLT', HLT_Probe: 'T_HLT', Mash_Probe: 'T_Mash', Mash_Heater: 'PID_HLT', Mash_Timer: 'tm_Boil', Boil_Timer: 'tm_Boil', Chill_Pump: 'Pump_Chill', Wort_Probe: 'T_Mash' }]) {
  const out = buildBrewDay({ ...brewSetup({}), fields }, pt, elements);
  assert.deepEqual(out.map(x => x.name), MAJOR_STEPS.map((_, i) => processName(i)));
  out.forEach((x, i) => {
    const c = compile(x.text);
    assert.deepEqual(c.errors, [], `${x.name} compiles`);
    if (i < 6) assert.match(x.text, new RegExp(`start ${processName(i + 1)}\\n$`), 'each starts the next');
  });
}
assert.throws(() => buildBrewDay({ ...brewSetup({}), fields: { HLT_Probe: 'PID_HLT' } }, pt, elements), /not a temperature/);
// User Process Templates
pt.saveUser('Mash', 'My_Mash', '//About: mine\nask "stir"\n');
assert.ok(pt.list().some(t => t.cls === 'user' && t.name === 'My_Mash' && t.about === 'mine'));
assert.throws(() => pt.saveUser('Mash', 'Skynet_Mine', 'x'), /kept for Skynet/);
assert.throws(() => pt.saveUser('Mash', 'Bad', '@if Nope\n@end'), /field name/);
pt.deleteUser('Mash', 'My_Mash');
assert.throws(() => pt.deleteUser('Mash', 'Skynet_Mash'), /No User Process Template/, 'a Skynet one is never deleted');

// ---- in a running Process: rcp_ values, ask, close_all_valves, open_all_valves, all_pumps_off
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ brewDefaults: { units: 'US' }, recipe: { name: 'IPA', boilTime: 60 }, elements: [
  ...elements.filter(e => e.type === 'digitalOut'), { name: 'V_Off_List', ...v({ closeAll: false, openAll: false }) }, { name: 'Out', type: 'gKonstant', kind: 'string', dataType: 'string' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
assert.deepEqual(eng.check('x = rcp_Boil_Time').errors.length, 1, 'x is unknown');
assert.match(eng.check('rcp_Boil_Time = 5').errors[0].msg, /read only/);
assert.match(eng.check('Out = rcp_Nope').errors[0].msg, /not a Recipe value/);
assert.deepEqual(eng.check('Out = rcp_Name + rcp_Mash_Step_3_Temp').errors, []);
store.setProp('V_HLT_Out', 'state', true); store.setProp('V_Off_List', 'state', true); store.setProp('Pump_Chill', 'state', true);
eng.write('day', 'all_pumps_off\nclose_all_valves\nask "Add the \\bgrain\\b"\nOut = rcp_Name + " " + rcp_Boil_Time\nopen_all_valves\n');
eng.start('day');
assert.ok(await until(() => eng.valveList().some(a => a.ask)), 'ask shows a pop-up');
assert.equal(store.getProp('Pump_Chill', 'state'), false, 'pumps off');
assert.equal(store.getProp('V_HLT_Out', 'state'), false, 'closed');
assert.equal(store.getProp('V_Off_List', 'state'), true, 'not on the Close all list: left alone');
assert.equal(eng.valveList()[0].label, 'Add the \\bgrain\\b');
eng.confirmValve(eng.valveList()[0].name);
assert.ok(await until(() => store.getProp('Out', 'value') === 'IPA 01:00:00'), 'goes on after Done, and reads the Recipe');
assert.ok(await until(() => store.getProp('V_HLT_Out', 'state') === true), 'open all');
assert.equal(store.getProp('V_Tap', 'state'), false, 'the tap water valve never opens with open_all_valves');
clearTimeout(store._persistTimer);
console.log('brew process tests passed');
process.exit(0);
