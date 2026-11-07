// The Standard Skynet Brew Process (Fritz, 2026-10-30; the step list 2026-11-07): Process Templates for the major steps, rcp_ Recipe values,
// ask "...", the Close all / Open all valve lists (a tap water valve is always on Close all, never on Open all)
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store, onCloseAll, onOpenAll, fixValveLists } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';
import { ProcessTemplates, MAJOR_STEPS, expand, usedFields, recipeValues, recipeValue, isKnownRecipeName, strikeTemp, brewSetup, buildBrewDay, brewNames, usedSteps } from '../lib/brewprocess.js';

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
const shown = v({ tapwater: true, _tapClose: true, _tapOpen: false }); fixValveLists(shown);
assert.ok(!('_tapClose' in shown) && !('_tapOpen' in shown), 'the greyed out switches of a tap water valve are never kept');
assert.match(fs.readFileSync('templates/process/Clean/Skynet_Clean.txt', 'utf8').trim(), /open_all_valves\nprint [^\n]*$/, 'Clean ends by opening all valves (the Open List)');

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

// ---- the Skynet Process Templates build into Flow Processes that compile (one for each step used)
const root = path.resolve('templates/process');
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'brewproc'));
const pt = new ProcessTemplates(root, path.join(d, 'user'));
const all = pt.list();
for (const s of MAJOR_STEPS) assert.ok(all.some(t => t.step === s.key && t.cls === 'skynet' && t.name === 'Skynet_' + s.key), 'a Skynet Process Template for ' + s.key);
const elements = [
  { name: 'PID_HLT', type: 'pid' }, { name: 'T_HLT', type: 'temperature' }, { name: 'T_Mash', type: 'temperature' }, { name: 'tm_Boil', type: 'timer' },
  { name: 'Pump_Chill', type: 'digitalOut', subtype: 'pump' }, { name: 'V_Tap', ...v({ tapwater: true }) }, { name: 'V_HLT_Out', ...v() },
];
const allOn = { ...brewSetup({}), templates: Object.fromEntries(MAJOR_STEPS.map(s => [s.key, 'Skynet_' + s.key])) };
for (const fields of [{}, { HLT_Heater: 'PID_HLT', HLT_Probe: 'T_HLT', Mash_Probe: 'T_Mash', Mash_Heater: 'PID_HLT', Mash_Timer: 'tm_Boil', Boil_Timer: 'tm_Boil', Chill_Pump: 'Pump_Chill', Wort_Probe: 'T_Mash',
  Whirlpool_Pump: 'Pump_Chill', Transfer_Pump: 'Pump_Chill', Clean_Pump: 'Pump_Chill', Chill_Water: 'V_HLT_Out', Hop_Infuser_Valve: 'V_HLT_Out' }]) {
  for (const setup of [{ ...brewSetup({}), fields }, { ...allOn, fields }]) {
    const out = buildBrewDay(setup, pt, elements), names = brewNames(setup);
    assert.deepEqual(out.map(x => x.name), names);
    out.forEach((x, i) => {
      const c = compile(x.text);
      assert.deepEqual(c.errors, [], `${x.name} compiles`);
      if (i < out.length - 1) assert.match(x.text, new RegExp(`start ${names[i + 1]}\\n$`), 'each starts the next');
      else assert.doesNotMatch(x.text, /^start /m, 'the last starts nothing');
    });
  }
}
// the hop stand (Fritz, 2026-11-07): Whirlpool hops stop the chill at their temperature, cooling water off for their time;
// Hop Rocket ones go through the Hop Infuser; with none, the Default settings
rv = recipeValues({ brewDefaults: { units: 'US' }, recipe: { name: 'x', boilTime: 60, ingredients: { hops: [{ use: 'whirlpool', time: 30, wpTempC: 80, hopRocket: true }], fermentables: [] }, mash: { steps: [] } } }, {});
assert.equal(rv.rcp_Hop_Stand, true); assert.equal(rv.rcp_Hop_Stand_Temp, 176); assert.equal(rv.rcp_Hop_Stand_Minutes, 30); assert.equal(rv.rcp_Hop_Infuser, true);
rv = recipeValues({ brewDefaults: { units: 'Metric', hopStandTempC: 75, hopStandMinutes: 15 }, recipe: { name: 'x', boilTime: 60, ingredients: { hops: [{ use: 'whirlpool' }], fermentables: [] }, mash: { steps: [] } } }, {});
assert.equal(rv.rcp_Hop_Stand_Temp, 75); assert.equal(rv.rcp_Hop_Stand_Minutes, 15); assert.equal(rv.rcp_Hop_Infuser, false);
assert.equal(recipeValues({ brewDefaults: {} }, {}).rcp_Hop_Stand, false, 'no Recipe: no hop stand');
for (const t of ['Chill', 'Whirlpool_and_Chill']) assert.match(pt.find(t, 'Skynet_' + t).text, /wait \{\{Wort_Probe\}\} <= rcp_Hop_Stand_Temp[\s\S]*sleep rcp_Hop_Stand_Minutes \* 60000[\s\S]*wait \{\{Wort_Probe\}\} <= rcp_Ferment_Temp/, t + ': chill to the hop stand, hold, then chill');
// the premade list (Rule 16.1): Clean is last; Whirlpool and Chill is skipped to start (a Brew Day uses it or Chill)
assert.deepEqual(MAJOR_STEPS.map(s => s.key), ['PreBrew', 'Heat_Strike', 'Strike', 'Mash', 'Boil', 'Whirlpool_and_Chill', 'Chill', 'Transfer_to_Fermentor', 'Ferment', 'Clean']);
assert.deepEqual(brewNames(brewSetup({})), ['Brew_1_PreBrew', 'Brew_2_Heat_Strike', 'Brew_3_Strike', 'Brew_4_Mash', 'Brew_5_Boil', 'Brew_6_Chill', 'Brew_7_Transfer_to_Fermentor', 'Brew_8_Ferment', 'Brew_9_Clean']);
const wp = brewSetup({ brewProcess: { templates: { Whirlpool_and_Chill: 'Skynet_Whirlpool_and_Chill', Chill: '' } } });
assert.equal(brewNames(wp)[5], 'Brew_6_Whirlpool_and_Chill'); assert.equal(usedSteps(wp).length, 9);
assert.throws(() => buildBrewDay({ templates: Object.fromEntries(MAJOR_STEPS.map(s => [s.key, ''])), fields: {} }, pt, elements), /Every step is skipped/);
// a Brew Process saved before the new list: Add Grain is Strike, Cool is Chill; a User Cool also did the transfer
let old = brewSetup({ brewProcess: { templates: { Add_Grain: 'Skynet_Add_Grain', Cool: 'Skynet_Cool' } } });
assert.equal(old.templates.Strike, 'Skynet_Strike'); assert.equal(old.templates.Chill, 'Skynet_Chill'); assert.equal(old.templates.Transfer_to_Fermentor, 'Skynet_Transfer_to_Fermentor');
old = brewSetup({ brewProcess: { templates: { Cool: 'My_Cool' } } });
assert.equal(old.templates.Chill, 'My_Cool'); assert.equal(old.templates.Transfer_to_Fermentor, '');
const ud = path.join(d, 'olduser'); fs.mkdirSync(path.join(ud, 'Cool'), { recursive: true }); fs.writeFileSync(path.join(ud, 'Cool', 'My_Cool.txt'), 'ask "x"\n');
assert.ok(new ProcessTemplates(root, ud).find('Chill', 'My_Cool'), 'a User Cool Template moves to Chill'); assert.ok(!fs.existsSync(path.join(ud, 'Cool')));
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
// the Hops tab's Skynet_Fields can be read in a Process; a hop line past rcp_Hop_Count reads as empty
assert.ok(isKnownRecipeName('rcp_Hop_3_IBU') && isKnownRecipeName('rcp_hop_count') && !isKnownRecipeName('rcp_Hop_3_Color'));
const hv = recipeValues({ recipe: { name: 'H', boilTime: 60, ingredients: { hops: [{ name: 'Magnum', use: 'boil', time: 60, kg: 0.028, alpha: 12, alphaActual: 12 }] } }, brewDefaults: { units: 'US' } });
assert.equal(recipeValue(hv, 'rcp_Hop_1_Name'), 'Magnum'); assert.equal(recipeValue(hv, 'rcp_Hop_Count'), 1);
assert.equal(recipeValue(hv, 'rcp_Hop_5_Name'), ''); assert.ok(isKnownRecipeName('rcp_Grain_2_SRM') && isKnownRecipeName('rcp_Fermentable_Count'));
assert.equal(recipeValue(hv, 'rcp_Grain_3_Name'), ''); assert.equal(recipeValue(hv, 'rcp_Fermentable_1_After_Boil'), false); assert.equal(recipeValue(hv, 'rcp_Grain_Count'), 0); assert.equal(recipeValue(hv, 'rcp_Adjunct_2_Name'), ''); assert.ok(isKnownRecipeName('rcp_Adjunct_1_Time_Unit')); assert.equal(recipeValue(hv, 'rcp_Hop_5_Amount'), 0);
console.log('brew process tests passed');
process.exit(0);
