// Heating Element Add dialog (Fritz, 2026-11-05: "Same with Heating Element but instead of the Electric Kettle, Basic have Vessel
// Device Template and Choose then Build", Rule 18.24, Help 137).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { elementTopic } from '../public/helpmap.js';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
assert.match(app, /\['heat', 'Heating Element', \[ELEMENT,[\s\S]{0,200}am\('RIMS tube'\), VESSEL_ELEMENT\]\]/, 'Vessel Device Template in place of the Electric kettle, basic');
assert.match(app, /const VESSEL_ELEMENT = \['Vessel Device Template[^']*', 'vesselElement', 'DO'\]/);
assert.match(app, /const ELEM_MODELS = \[\['Skynet Heating Element', 'sky'[^\]]*\], \['User Defined Heating Element/, 'step 2 picks the element');
assert.match(app, /if \(pick === 'vesselElement'\) \{[\s\S]{0,200}pickElemVessel\(\)/, 'choose the Vessel first');
assert.match(app, /if \(elemVessel\) return elemVesselBuild\(elemVessel, e\);/, 'then Build');
const build = app.slice(app.indexOf('function elemVesselBuild('), app.indexOf('// ---- Skynet Device Templates'));
assert.match(build, /addTemplateToTab\('vessel', t,/, 'the Vessel copy goes on the Build Tab (Rule 4.1)');
assert.match(build, /installed: true \};\s*g\.heater = e\.name/, 'its Element Placed and linked');
const add = app.slice(app.indexOf('async function newDeviceDialog('), app.indexOf('// ---- Thermowell'));
assert.match(add, /elem = isElemDev\(e\)/);
assert.match(add, /\.\.\.\(elem \? \[\.\.\.ELEM_GRAPHIC_FIELDS\(e, after\), \.\.\.ELEM_OVERLAY\(e, after\)/);
const own = app.slice(app.indexOf('const ELEM_GRAPHIC_FIELDS'), app.indexOf('function elemDeviceFields'));
assert.ok(!/cover/i.test(own.replace(/\/\/.*$/gm, '')), 'no Cover on a Heating Element');
assert.match(own, /'orient', null, false, false, \{ tip: T\.eOrient, with: tog/, 'Orientation and Toggle on one line');
assert.match(own, /dbPop: true/, 'Overlay with Database and .API');
assert.match(app, /const isDrillDev = e => isPumpDev\(e\) \|\| isMbvDev\(e\)[^\n]* \|\| isElemDev\(e\)[^\n]*;/);
assert.match(app, /const isElemDev = e => e\?\.type === 'digitalOut' && e\.subtype === 'element' && !e\.kind && !e\.template && !e\.integratedIn;/, 'not a RIMS or Integrated kettle element (Rule 18.10)');
assert.match(app, /if \(isElemDev\(it\)\) return \[\.\.\.elemDeviceFields\(it, item\), \['typeCode', 'Device Type', 'ro'/);
assert.deepEqual(elementTopic({ type: 'digitalOut', subtype: 'element' }), ['heating-element-device-properties']);
assert.deepEqual(elementTopic({ type: 'digitalOut', subtype: 'element', integratedIn: 'x' }), ['skynet-integrated-devices']);
assert.ok(fs.existsSync(new URL('../help/137-heating-element-device-properties.md', import.meta.url)));
console.log('elemdialog tests passed');
// Fritz, 2026-11-05: Heating Element Labels fill in by control mode
{
  const HEAT_MODES = { pid: 'PID', hysteresis: 'HYS', dutyCycle: 'DutyC', deadband: 'DeadB' };
  const src = app.match(/const heatMode = (e => .*);/)[1];
  const heatMode = eval(src);
  assert.equal(heatMode({ type: 'pid' }), 'PID'); assert.equal(heatMode({ type: 'hysteresis' }), 'HYS');
  assert.equal(heatMode({ type: 'dutyCycle' }), 'DutyC'); assert.equal(heatMode({ type: 'deadband' }), 'DeadB');
  assert.equal(heatMode({ type: 'digitalOut', subtype: 'element' }), 'DO'); assert.equal(heatMode({ type: 'pwmOut', subtype: 'element' }), 'PWM');
  assert.equal(heatMode({ type: 'digitalOut', subtype: 'pump' }), null); assert.equal(heatMode({ type: 'pid', integratedIn: 'x' }), null);
  assert.match(app, /work\.label = autoLabel\('hE_' \+ hm\)/);
  assert.match(app, /'pwmOut', 'PWM', \{ units: '%', subtype: 'element' \}/, 'the Heating Element list PWM row is a heating PWM');
  console.log('heating labels tests passed');
}
