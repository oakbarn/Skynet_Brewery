// Hand-set appliances (Fritz, 2026-11-07, Rule 5.39): the DigiBoil and the 65 L Brewzilla. A Process sets their switches, set point
// and Run spot, a pop-up asks a person to do it by hand (a set point in °F is given in °C too) and the Process waits for Done.
// open_valve / close_valve work any valve: a Manual one asks and waits, a motorized one is switched.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';
import { APPLIANCES, handAsk, setpointWords, isHandProp, fToC } from '../public/appliance.js';
import { cleanVessel } from '../public/templates.js';
import { startAnswers, planSchema } from '../public/schemabuild.js';

// the words
assert.equal(setpointWords(152, '°F'), '152 °F (that is 66.7 °C)');
assert.equal(setpointWords(66.7, '°C'), '66.7 °C');
assert.match(handAsk('digiboil', 'DigiBoil', 'setpoint', 212, '°F'), /212 °F \(that is 100 °C\)[\s\S]*back to °C every time it is turned off/);
assert.doesNotMatch(handAsk('digiboil', 'DigiBoil', 'setpoint', 100, '°C'), /back to °C/);
assert.equal(handAsk('digiboil', 'DigiBoil', 'heat', true), 'Turn the DigiBoil Heater switch ON.');
assert.equal(handAsk('brewzilla65', 'Brewzilla', 'heat3', false), 'Turn the Brewzilla Heater 3 switch OFF.');
assert.equal(handAsk('brewzilla65', 'Brewzilla', 'power', true), 'Turn the Brewzilla screen On/Off button ON.');
assert.equal(handAsk('brewzilla65', 'Brewzilla', 'run', true), 'Press Run on the Brewzilla screen.');
assert.ok(isHandProp('brewzilla65', 'run') && !isHandProp('digiboil', 'run') && !isHandProp('digiboil', 'pump') && isHandProp('digiboil', 'Power'));
assert.equal(Math.round(fToC(152) * 10) / 10, 66.7);
assert.deepEqual(APPLIANCES.brewzilla65.switches.map(s => s[0]), ['pump', 'heat', 'heat2', 'heat3'], 'the Brewzilla 65 L: 4 switches');
assert.deepEqual(APPLIANCES.brewzilla65.valves.map(s => s[0]), ['spigot', 'pumpOut'], 'two Manual valves');
assert.deepEqual(APPLIANCES.digiboil.switches.map(s => s[0]), ['power', 'heat'], 'the DigiBoil: Power and Heater');

// the Vessel Templates keep their appliance
const tdir = path.join(import.meta.dirname, '..', 'templates', 'vessel');
for (const [f, k] of [['Kettle_DigiBoil', 'digiboil'], ['Kettle_Brewzilla_65L', 'brewzilla65']]) {
  const t = cleanVessel(JSON.parse(fs.readFileSync(path.join(tdir, f + '.json'), 'utf8')));
  assert.equal(t.appliance, k, f); assert.ok(t.ports.outlet.installed, f + ': its spigot outlet');
}
assert.equal(cleanVessel({ appliance: 'toaster' }).appliance, undefined);

// a Schema Template vessel with its own heat: no probe or heater of Skynet's
const plan = planSchema({ ...startAnswers({ vessels: [{ role: 'Brew Kettle', template: 'Kettle_DigiBoil', label: 'DigiBoil', heat: 'own' }] }, {}), name: 'x' });
assert.equal(plan.elements.filter(e => e.place?.at === 'v' && e.place.i === 0).length, 0, 'no probe or heater under it');

// the engine
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'appl'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'DigiBoil_Controls', type: 'manual', appliance: 'digiboil', label: 'DigiBoil', units: '°F', integratedIn: 'g1', integratedAs: 'av:controls' },
  { name: 'DigiBoil_Spigot', type: 'digitalOut', subtype: 'valve', valveType: 'manual', label: 'DigiBoil Spigot', integratedIn: 'g1', integratedAs: 'av:spigot' },
  { name: 'Old_Manual', type: 'manual', label: 'Old' },
  { name: 'Moto', type: 'digitalOut', subtype: 'valve' },
  { name: 'Step', type: 'gKonstant', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
const ask = () => eng.valveList().find(a => a.ask);

const text = 'DigiBoil_Controls.setpoint = 152\nStep = 1\nDigiBoil_Controls.heat = on\nStep = 2\nDigiBoil_Controls.heat = on\nopen_valve DigiBoil_Spigot\nStep = 3\nopen_valve Moto\nclose_valve Moto\nOld_Manual.setpoint = 150\nStep = 4\n';
assert.deepEqual(compile(text).errors, []);
assert.ok(compile('open_valve\n').errors.length, 'open_valve needs a name');
eng.write('brew', text);
eng.start('brew');
assert.ok(await until(() => ask()), 'the set point asks');
assert.match(ask().label, /152 °F \(that is 66.7 °C\)/);
assert.equal(store.getProp('DigiBoil_Controls', 'setpoint'), 152, 'its Widget shows what was asked');
await new Promise(r => setTimeout(r, 150));
assert.equal(store.getProp('Step', 'value'), 0, 'the Process waits');
eng.confirmValve(ask().name);
assert.ok(await until(() => ask() && /Heater switch ON/.test(ask().label)), 'then the Heater switch');
eng.confirmValve(ask().name);
assert.ok(await until(() => eng.valveList().some(a => a.name === 'DigiBoil_Spigot')), 'heat already on asks nothing; open_valve asks for the Spigot');
assert.equal(store.getProp('Step', 'value'), 2);
eng.confirmValve('DigiBoil_Spigot');
assert.ok(await until(() => store.getProp('Step', 'value') === 4), 'a motorized valve is switched; an older Manual vessel Widget asks nothing');
assert.equal(store.getProp('DigiBoil_Spigot', 'state'), true);
assert.equal(store.getProp('Moto', 'state'), false);
assert.equal(store.getProp('Old_Manual', 'setpoint'), 150);
clearTimeout(store._persistTimer);
console.log('appliance tests passed');
process.exit(0);
