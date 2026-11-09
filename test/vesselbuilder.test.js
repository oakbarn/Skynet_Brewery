// The Vessel Device Builder (OakBarn Brewery, 2026-11-08, Rule 19.5, Help 166): the Question Dialog's answers become the Vessel
// Device's Placed IPs and the Heating Elements and Thermowell still to be picked; plain words say what is wrong.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { VB_TEMPLATE, VB_GENERAL, vbUserType, vbStart, vbWant, vbPlaced, vbProblems, vbSummary, vbSizeMethod, vbSpotIp } from '../public/vesselbuilder.js';

assert.ok(fs.existsSync(`templates/vessel/${VB_TEMPLATE}.json`), 'it builds from the Vessel Widget Main Template');
assert.ok(VB_GENERAL.includes('HLT') && VB_GENERAL.includes('Fermentor'));
assert.equal(vbUserType('Hop Pot Strainer'), 'USER: Hop Pot Strainer', 'Other: the General Type the user types');
assert.equal(vbUserType('user:  Grant'), 'USER: Grant');
assert.equal(vbUserType('  '), '');

const w = vbStart({ label: 'HLT' });
assert.equal(w.volume, 10, '10 gallons to start (Rule 19.1)');
assert.deepEqual(vbPlaced(w), ['cBottomOutlet']);
assert.deepEqual(vbProblems(w), []);
assert.equal(vbSizeMethod(w), 'proportional');
assert.equal(vbSizeMethod({ ...w, vheight: 20, diameter: 16 }), 'diameter');
assert.match(vbProblems({ ...w, vheight: 20 })[0], /both the Height and the Diameter/);
assert.match(vbProblems({ ...w, label: '' })[0], /Label can not be blank/);
assert.match(vbProblems({ ...w, volume: 0, units: 'Metric' })[0], /Liters/);

// the Thermowell / Probe and the Heating Elements make no IP of their own: they sit on a spot and close it
const full = { ...w, probe: 'left', heater: 'right', heater2: 'backLeft', tangential: 'right', sparge: 'left', herms: 'left', drain: 'cOutlet' };
assert.deepEqual(vbWant(full), { lElement: 'thermowell', rElement: 'element', lBackElement: 'element' });
assert.deepEqual(vbPlaced(full).sort(), ['cOutlet', 'lBackElement', 'lElement', 'lHermsIn', 'lHermsOut', 'lSparge', 'rElement', 'rTangential'].sort());
assert.deepEqual(vbWant({ ...w, probe: 'center' }), { cProbe: 'probe' }, 'Center is a Front probe');
assert.equal(vbSpotIp('backRight'), 'rBackElement');
assert.equal(vbSpotIp('backCenter'), 'cBackElement', 'Back Center (2026-11-09)');
assert.deepEqual(vbWant({ ...w, heater: 'backCenter', probe: 'backCenter' }), { cBackElement: 'thermowell' });
assert.match(vbProblems({ ...w, heater: 'backCenter', probe: 'backCenter' })[0], /both on the Back Center/);
assert.deepEqual(vbProblems(full), []);

// two things on one spot
assert.match(vbProblems({ ...w, probe: 'right', heater: 'right' })[0], /both on the Right/);
assert.match(vbProblems({ ...w, heater: 'left', heater2: 'left' })[0], /Both Heating Elements/);
assert.match(vbProblems({ ...w, heater2: 'left' })[0], /first Heating Element/);

const lines = vbSummary(full).join('\n');
assert.match(lines, /Thermowell: Left/); assert.match(lines, /Heating Element: Back Left/); assert.match(lines, /Sparge Arm \/ Steam Slayer: Left \(High\)/);
// Pick (Rule 5.31 changed 2026-11-09, only during the initial build): a picked spot is 'ip:<key>', a preset IP or a User IP
const pk = { ...w, drain: 'ip:u1', tangential: 'ip:lTangential', probe: 'ip:u2', heater: 'right', userIps: [{ key: 'u1', name: 'Picked Drain', x: 0.3, y: 0.95 }, { key: 'u2', name: 'Picked Probe spot', x: 0.6, y: 0.5 }] };
assert.deepEqual(vbPlaced(pk).sort(), ['lTangential', 'rElement', 'u1', 'u2']);
assert.deepEqual(vbWant(pk), { u2: 'thermowell', rElement: 'element' });
assert.deepEqual(vbProblems(pk), []);
assert.match(vbProblems({ ...w, drain: 'pick' }).join(' '), /Double-click the spot/);
assert.match(vbProblems({ ...w, drain: 'ip:rTangential', tangential: 'right' }).join(' '), /same spot/);
assert.match(vbSummary(pk).join('\n'), /Drain: a picked spot/);
// crossed HERMS coils (Rule 5.31 changed 2026-11-09): in on one side, out the other
assert.deepEqual(vbPlaced({ ...w, drain: 'none', herms: 'crossRL' }).sort(), ['lHermsIn', 'rHermsOut']);
assert.deepEqual(vbPlaced({ ...w, drain: 'none', herms: 'crossLR' }).sort(), ['lHermsOut', 'rHermsIn']);
assert.match(vbSummary({ ...w, herms: 'crossRL' }).join('\n'), /HERMS Coil: Outlet Right & Inlet Left/);
// the Priming Tee (2026-11-09): an Instrument Tee with a Manual Valve always up, openings at the run ends only
const pt = JSON.parse(fs.readFileSync('templates/fitting/Priming_Tee.json', 'utf8'));
assert.equal(pt.upright, true); assert.deepEqual(Object.keys(pt.ipPos), ['start', 'end']); assert.ok(fs.existsSync('media/' + pt.image));
console.log('vesselbuilder tests passed');
