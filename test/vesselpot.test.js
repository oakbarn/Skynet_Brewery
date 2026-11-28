// The Stainless Pot Vessel Builder (OakBarn Brewery, 2026-11-27, Rule 19.13, Help 166): every vessel is built from one plain stainless
// pot drawn to its Height and Diameter; each part's IP is at its measured height off the bottom; Left and Right as you face it.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { POT_TEMPLATE, POT_IN, POT_PROBE, POT_TANGENTIAL, POT_GAS_WARNING, POT_TEMP, POT_FLOAT_LOC, POT_FLOAT_NC, potStart, potBox, potSpots, potProblems,
  potSvg, potSummary, potFreePlaces, potHermsKeys, potHasTemp, potFalseBottom } from '../public/vesselpot.js';

assert.ok(fs.existsSync(`templates/vessel/${POT_TEMPLATE}.json`), 'its Template is there');
const tpl = JSON.parse(fs.readFileSync(`templates/vessel/${POT_TEMPLATE}.json`, 'utf8'));
assert.ok(fs.existsSync('media/' + tpl.image), 'its picture is there');
// the first choices: Center above the Outlet, Left Low (Fritz: "make that first choice")
assert.equal(POT_PROBE[0][0], 'centerOut'); assert.equal(POT_TANGENTIAL[0][0], 'left');
const w = potStart({ label: 'HLT', vheight: 27, diameter: 22 });
assert.deepEqual(potProblems(w), []);
assert.deepEqual(potProblems(potStart({ label: 'HLT' })).length, 1, 'Height and Diameter come first');
assert.ok(potProblems({ ...w, label: ' ' }).some(t => /Label/.test(t)));
// the box: rim above, handles each side; heights in inches off the inside bottom
const b = potBox(w); assert.equal(b.T, 27 + POT_IN.rim); assert.equal(b.W, 22 + 2 * POT_IN.handle);
const spot = (ws, k) => potSpots(ws).find(p => p.key === k);
const yAt = inches => +((b.rim + b.H - inches) / b.T).toFixed(4);
assert.equal(spot(w, 'outlet').y, yAt(2), 'Outlet 2 in off the bottom'); assert.equal(spot(w, 'outlet').x, 0.5);
assert.equal(spot(w, 'probe').y, yAt(5.5), 'probe 5.5 in, above the Outlet'); assert.equal(spot(w, 'probe').x, 0.5);
assert.ok(spot(w, 'tangential').x < 0.3, 'Tangential on the Left as you face it'); assert.equal(spot(w, 'tangential').y, yAt(1.5));
// a Center Bottom Drain: a 6 in skirt, the drain centered in it
const bd = { ...w, outlet: 'bottom' }; assert.equal(potBox(bd).skirt, 6); { const bb = potBox(bd); assert.ok(spot(bd, 'outlet').y > (bb.rim + bb.H) / bb.T, 'below the pot, in the skirt'); }
// the Sight Gauge: 1 in off the bottom, 1 in off the top, directly above
const sg = { ...w, sight: 'left' }; assert.equal(spot(sg, 'sightBottom').x, spot(sg, 'sightTop').x); assert.equal(spot(sg, 'sightTop').y, yAt(26));
// Metric: the same heights in cm
const m = potStart({ label: 'M', vheight: 60, diameter: 50, units: 'Metric' }); assert.equal(spot(m, 'outlet').y, +((2.54 + 60 - 5.08) / (2.54 + 60)).toFixed(4));
// Heaters: Back, 2 in TC, at their typed height; both on one side is wrong
const el = { ...w, heat: 'element', heater: 'backRight', heaterHt: 6, heater2: 'backLeft', heater2Ht: 6 };
assert.equal(spot(el, 'element1').std, 'TC 2'); assert.ok(spot(el, 'element1').back); assert.ok(spot(el, 'element1').x > spot(el, 'element2').x);
assert.ok(potProblems({ ...el, heater2: 'backRight' }).length);
// Temperature: Analog Gauge or Electronic, Thermowell or Direct
assert.deepEqual(POT_TEMP.map(([k]) => k), ['electronic', 'analog', 'none']);
assert.equal(spot({ ...w, tempKind: 'analog' }, 'probe').part, 'gauge'); assert.equal(spot({ ...w, tempMount: 'direct' }, 'probe').mount, 'direct');
assert.ok(!potHasTemp({ ...w, tempKind: 'none' })); assert.equal(spot({ ...w, tempKind: 'none' }, 'probe'), undefined);
assert.ok(potProblems({ ...w, tempKind: 'analog', fctl: 'heatcool' }).length, 'a Fermentor Control needs an Electronic probe');
// Level or Float 1 and 2
assert.deepEqual(POT_FLOAT_LOC.map(([k]) => k), ['none', 'left', 'right', 'front', 'back']); assert.deepEqual(POT_FLOAT_NC.map(([k]) => k), ['nc', 'no']);
const fl = { ...w, float1: 'right', float1Ht: 20, float2: 'back', float2Ht: 4, float2Nc: 'no' };
assert.equal(spot(fl, 'float1').y, yAt(20)); assert.ok(spot(fl, 'float1').x > 0.7); assert.ok(spot(fl, 'float2').back); assert.equal(spot(fl, 'float2').nc, false);
assert.ok(potProblems({ ...fl, float1Ht: '' }).length && potProblems({ ...fl, float1Ht: 30 }).length);
// a Mash Tun's False Bottom: drawn, never moves the Outlet
const mt = { ...w, vtype: 'Mash Tun', falseBottom: 3 };
assert.equal(potFalseBottom(mt), 3); assert.equal(potFalseBottom({ ...mt, vtype: 'HLT' }), 0); assert.equal(spot(mt, 'outlet').y, yAt(2));
assert.ok(/stroke-dasharray/.test(potSvg(mt)) && !/stroke-dasharray/.test(potSvg(w)));
// HERMS: the coil's IPs; on one side the Inlet is High or Low
assert.deepEqual(potHermsKeys('lr'), ['lPotHermsIn', 'rPotHermsOut']);
const hl = { ...w, herms: 'll', hermsIn: 'low' }; assert.ok(spot(hl, 'lPotHermsIn').y > spot(hl, 'lPotHermsOut').y, 'Inlet Low');
// Gas: the warning, word for word
assert.ok(POT_GAS_WARNING.startsWith('⚠ Gas can kill or cause a fire.') && /Licensed Electrician, Plumber or HVAC professional\.$/.test(POT_GAS_WARNING));
// Additional IPs only on free places
assert.ok(!potFreePlaces(w).some(([k]) => k === 'flc'), 'the Outlet takes Front Low Center');
assert.equal(spot({ ...w, extras: { bhl: 'TC 1.5' } }, 'xbhl').std, 'TC 1.5');
// the picture: no pure white (Rule 2.7), drawn to its box
assert.ok(!/#fff\b|#ffffff/i.test(potSvg(w))); assert.ok(potSvg(w).includes('preserveAspectRatio="none"'));
assert.ok(potSummary(fl).some(t => /Level or Float 2: Back, 4 in from the bottom, Normally Open/.test(t)));
console.log('vesselpot ok');
