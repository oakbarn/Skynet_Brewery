// The Vessel Device Builder (OakBarn Brewery, 2026-11-08, Rule 19.5, Help 166): the answers of its pages become the Vessel Device's
// Placed IPs and built in parts, and each page says plainly what is still missing.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { VB_STEPS, VB_TEMPLATE, vbStart, vbParts, vbPlaced, vbProblems, vbSummary, vbHeaters } from '../public/vesselbuilder.js';

assert.deepEqual(VB_STEPS.map(([k]) => k), ['name', 'size', 'outlet', 'inlets', 'heat', 'temp', 'herms', 'check']);
assert.ok(fs.existsSync(`templates/vessel/${VB_TEMPLATE}.json`), 'it builds from the Vessel Widget Main Template');

// the start: like the Three Vessel sample's HLT, a bottom drain, an Element on the Right Element and a Thermowell on the Left Element
const w = vbStart({ label: 'HLT', vpIface: 'Brewery Mega', heat1Pin: '8', ptk: 'ds18b20', probeIdx: 1 });
assert.equal(w.volume, 10, '10 gallons to start (Rule 19.1)');
assert.deepEqual(vbPlaced(w).sort(), ['cBottomOutlet', 'lElement', 'rElement']);
const vp = vbParts(w);
assert.equal(vp.rElement_part, 'element'); assert.equal(vp.rElement_pin, '8');
assert.equal(vp.lElement_part, 'thermowell'); assert.equal(vp.lElement_ptk, 'ds18b20'); assert.equal(vp.lElement_pidx, 1);
assert.equal(vp.cBottomOutlet_part, undefined, 'no valve: the outlet is an open IP');
assert.deepEqual(vbProblems(w, 'check', { oneWire: k => k === 'ds18b20' }), []);

// the label can't be blank; the Diameter method needs both numbers
assert.match(vbProblems({ ...w, label: ' ' }, 'name')[0], /Label can not be blank/);
assert.match(vbProblems({ ...w, sizeMethod: 'diameter', diameter: 14 }, 'size')[0], /Diameter and a Height/);
assert.match(vbProblems({ ...w, volume: 0, units: 'Metric' }, 'size')[0], /Liters/);

// a Motorized Ball Valve is built into the outlet; a Manual Valve is a Widget of its own (Rule 5.15), so the outlet stays an open IP
const m = { ...w, outlet: 'cOutlet', outValve: 'motor', outPin: '' };
assert.match(vbProblems(m, 'outlet')[0], /Port of the Motorized Ball Valve/);
assert.equal(vbParts({ ...m, outPin: '30' }).cOutlet_part, 'valve');
assert.equal(vbParts({ ...w, outValve: 'manualBall' }).cBottomOutlet_part, undefined);
assert.match(vbSummary({ ...w, outValve: 'manualButterfly' }).join('\n'), /Manual Butterfly Valve Widget on it/);

// inlets and the HERMS coil Place their IPs
const i = { ...w, tangential: 'left', sparge: 'right', herms: 'left' };
assert.deepEqual(vbPlaced(i).filter(k => /Tang|Sparge|Herms/.test(k)).sort(), ['lHermsIn', 'lHermsOut', 'lTangential', 'rSparge']);
assert.equal(vbParts(i).vHerms, 'left');

// more than one Heating Element (OakBarn Brewery runs several on different circuits); two on one spot or one Port is wrong
const two = { ...w, heaters: '2', heat2Spot: 'rElement', heat2Pin: '8' };
assert.equal(vbHeaters(two), 2);
const p2 = vbProblems(two, 'heat');
assert.ok(p2.some(t => /both on the Right Element/.test(t)) && p2.some(t => /same Port/.test(t)));
assert.deepEqual(vbProblems({ ...two, heat2Spot: 'lBackElement', heat2Pin: '9' }, 'heat'), []);
assert.match(vbProblems({ ...w, vpIface: '' }, 'heat')[0], /Interface/);
assert.equal(vbHeaters({ heaters: '9' }), 4);

// the Thermowell can't share a spot with a Heating Element; a Front probe is on the Center Probe spot
assert.match(vbProblems({ ...w, probeSpot: 'rElement' }, 'temp', { oneWire: () => true })[0], /Put the Thermowell on another spot/);
const f = { ...w, probe: 'front', ptk: 'pt100', probePin: 'A0', probeIdx: '' };
assert.equal(vbParts(f).cProbe_part, 'probe'); assert.ok(vbPlaced(f).includes('cProbe')); assert.ok(!vbPlaced(f).includes('lElement'));
assert.match(vbProblems({ ...f, probePin: '' }, 'temp')[0], /Port of the Temperature probe/);
assert.deepEqual(vbPlaced({ ...w, probe: 'none', heaters: '0', outlet: 'none' }), []);

console.log('vesselbuilder tests passed');
