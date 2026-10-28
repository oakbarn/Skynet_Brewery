// Vessel and Bundled Fitting Templates: Skynet ones (shipped, read only once locked) and User ones (editable, deletable)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Templates } from '../lib/templates.js';
import { nameProblem, copyName, bundleName, fittingEnds, cleanFitting, cleanVessel, stdText, fittingPortStd, isCapOnly, cleanDevice, applyDeviceTemplate, deviceFixed } from '../public/templates.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'templates-'));
const shipped = path.join(dir, 'shipped');
fs.mkdirSync(path.join(shipped, 'fitting'), { recursive: true });
fs.writeFileSync(path.join(shipped, 'fitting', 'Valve_90.json'), JSON.stringify({ fittings: [{ kind: 'valve' }, { kind: 'elbow90' }] }));

// names: no spaces, unique, letters digits _ -
assert.match(nameProblem('My Kettle'), /spaces/);
assert.match(nameProblem('Kettle#1'), /only have/);
assert.equal(nameProblem('My_Kettle-2'), '');
assert.equal(copyName('HLT', ['Copy1_HLT']), 'Copy2_HLT');
assert.equal(bundleName('HLT', 'T01', ['bndl1_HLT_T01']), 'bndl2_HLT_T01');

// while Skynet is building, new Templates are Skynet ones, kept in config/templates/skynet, and can be changed
const b = new Templates(shipped, path.join(dir, 'own'), { locked: false });
assert.equal(b.list('fitting')[0].cls, 'skynet');
assert.equal(b.list('fitting')[0].editable, true, 'editable while building');
const v = b.create('vessel', 'HLT');
assert.equal(v.cls, 'skynet'); assert.ok(fs.existsSync(path.join(dir, 'own', 'skynet', 'vessel', 'HLT.json')));
assert.throws(() => b.create('vessel', 'hlt'), /already/, 'unique, any letter case');
assert.equal(b.create('vessel', 'Mine', { skynet: false }).cls, 'user');
b.save('vessel', 'HLT', { vtype: 'HLT', volume: '15', std: { type: 'TC', size: '1.5' }, ports: { outlet: { installed: true, position: 'Center Bottom', fitting: 'Valve_90' } } });
assert.equal(b.get('vessel', 'HLT').volume, 15);
assert.deepEqual(b.get('vessel', 'HLT').std, { type: 'TC', size: 1.5 });
// a shipped Skynet one is changed into its own copy, and can't be deleted
b.save('fitting', 'Valve_90', { fittings: [{ kind: 'valve' }, { kind: 'elbow45' }] });
assert.equal(b.get('fitting', 'Valve_90').fittings[1].kind, 'elbow45');
assert.equal(JSON.parse(fs.readFileSync(path.join(shipped, 'fitting', 'Valve_90.json'))).fittings[1].kind, 'elbow90', 'the shipped file is not touched');
// renaming a Bundled Fitting: the Vessel Templates that use it follow
b.create('fitting', 'Out_A');
b.save('vessel', 'Mine', { ports: { outlet: { installed: true, fitting: 'Out_A' } } });
b.save('fitting', 'Out_A', { name: 'Out_B', fittings: [] });
assert.equal(b.get('vessel', 'Mine').ports.outlet.fitting, 'Out_B');
assert.throws(() => b.remove('fitting', 'Out_B'), /on Mine/, 'in use on a vessel');
// a clone is a copy under the new name
const c = b.create('vessel', 'Copy1_HLT', { from: 'HLT', skynet: false });
assert.equal(c.volume, 15); assert.equal(c.clonedFrom, 'HLT'); assert.equal(c.cls, 'user');

// once locked: Skynet Templates can't be changed or deleted, new ones and clones are User Templates
const L = new Templates(shipped, path.join(dir, 'own'), { locked: true });
assert.equal(L.get('vessel', 'HLT').editable, false);
assert.throws(() => L.save('vessel', 'HLT', { volume: 20 }), /Skynet Template/);
assert.throws(() => L.remove('vessel', 'HLT'), /can't be deleted/);
assert.throws(() => L.remove('fitting', 'Valve_90'), /can't be deleted/);
assert.equal(L.create('vessel', 'Copy2_HLT', { from: 'HLT' }).cls, 'user', 'a clone of a Skynet one is a User Template');
L.save('vessel', 'Copy2_HLT', { volume: 20 }); assert.equal(L.get('vessel', 'Copy2_HLT').volume, 20);
L.remove('vessel', 'Copy2_HLT'); assert.equal(L.find('vessel', 'Copy2_HLT'), null);

// a Bundled Fitting: four slots; a tee's thermowell stops flow, so only an open tee gets a branch IP
const f = cleanFitting({ fittings: [{ kind: 'valve' }, { kind: 'tee', thermowell: true, thermowellPos: 'long' }, { kind: 'tee' }, { kind: 'bogus' }] });
assert.equal(f.fittings.length, 4); assert.equal(f.fittings[3].kind, 'none');
assert.equal(f.fittings[1].thermowellPos, 'long');
assert.deepEqual(fittingEnds(f).map(e => e.key), ['end', 'branch3']);
assert.throws(() => cleanVessel({ std: { type: 'XX' } }), /unknown standard/);
assert.equal(cleanVessel({ std: { type: 'DIN', size: 'DN25' } }).std.size, 'DN25', 'DIN sizes are text');
assert.equal(stdText({ type: 'TC', size: 1.5 }), 'TC (Tri-Clamp) 1.5');

// the Skynet Templates shipped with the panel are all valid, and every Bundled Fitting they name exists
const S = new Templates(path.join(ROOT, 'templates'), path.join(dir, 'none'), { locked: true });
for (const kind of ['vessel', 'fitting']) for (const t of S.list(kind)) { assert.equal(nameProblem(t.name), '', t.name); (kind === 'vessel' ? cleanVessel : cleanFitting)(t); }
for (const t of S.list('vessel')) for (const p of Object.values(t.ports || {})) if (p.fitting) assert.ok(S.find('fitting', p.fitting), `${t.name}: no Bundled Fitting "${p.fitting}"`);
assert.ok(S.list('vessel').length >= 5 && S.list('fitting').length >= 4);
assert.equal(S.get('vessel', 'Chillzilla').liquidPorts, 4, 'a Chillzilla coil has 4 liquid ports');
assert.equal(cleanVessel({ vesselType: 'herms', liquidPorts: '7' }).liquidPorts, 2, '2 or 4 only');
assert.equal(cleanVessel({ vesselType: 'vessel', liquidPorts: 4 }).liquidPorts, undefined, 'only coils have the choice');


// the standard piping fittings (Fritz, 2026-10-22): one fitting each, a Skynet SVG picture, and where its IPs sit on it
for (const [n, k, ip] of [['Elbow_90', 'elbow90', { start: 'Bottom', end: 'Right' }], ['Elbow_45', 'elbow45', { start: 'Left', end: 'Top Right 45' }], ['Tee', 'tee', { start: 'Left', end: 'Right', branch1: 'Top' }], ['Reducer', 'reducer', { start: 'Left', end: 'Right' }]]) {
  const t = S.get('fitting', n);
  assert.equal(t.fittings[0].kind, k); assert.deepEqual(t.ipPos, ip, n);
  assert.match(t.image, /^Images\/Skynet\/Other_Equipment\/(Fitting|Skynet_TC15)_.+\.svg$/);
  assert.ok(fs.existsSync(path.join(ROOT, 'media', t.image)), `${n}: picture ${t.image} is missing`);
  assert.deepEqual(fittingEnds(t).map(e => e.key), k === 'tee' ? ['end', 'branch1'] : ['end']);
}
assert.equal(S.get('vessel', 'RIMS_Tube').vesselType, 'rims');
assert.deepEqual(S.get('vessel', 'Kettle_Big_Fatty').size, [250, 248], 'a Template can keep its picture\'s shape');
assert.equal(cleanVessel({ size: [5, 100] }).size, undefined);
const bv = S.get('fitting', 'Butterfly_Valve_1in');
assert.deepEqual([fittingPortStd(bv, 'start'), fittingPortStd(bv, 'end')], [{ type: 'TC', size: 1.5 }, { type: 'TC', size: 1.5 }], 'down to 1 inch and back up');
const red = S.get('fitting', 'Reducer');
assert.equal(red.fittings[0].toSize, '1.5');
assert.deepEqual(fittingPortStd(red, 'start'), { type: 'TC', size: 2 }, 'the big end');
assert.deepEqual(fittingPortStd(red, 'end'), { type: 'TC', size: 1.5 }, 'the small end');
assert.deepEqual(fittingPortStd({ std: { type: 'TC', size: 2 }, fittings: [{ kind: 'tee' }, { kind: 'reducer', toSize: '1' }, { kind: 'tee' }] }, 'branch3'), { type: 'TC', size: 1 }, 'a tee past the reducer is the small size');
assert.deepEqual(fittingPortStd({ std: { type: 'TC', size: 2 }, fittings: [{ kind: 'tee' }, { kind: 'reducer', toSize: '1' }] }, 'branch1'), { type: 'TC', size: 2 });
assert.deepEqual(cleanFitting({ ipPos: { end: 'Right', 'bad key': 'x', start: '' } }).ipPos, { end: 'Right' });
assert.equal(cleanFitting({}).ipPos, undefined);
// End Cap (Fritz, 2026-10-22): a cap at the end of a chain closes it, so there is no End IP; a cap by itself has no IP at all
assert.equal(cleanFitting({ fittings: [{ kind: 'cap' }] }).fittings[0].kind, 'cap');
assert.deepEqual(fittingEnds({ fittings: [{ kind: 'cap' }, { kind: 'none' }] }), []);
assert.deepEqual(fittingEnds({ fittings: [{ kind: 'tee' }, { kind: 'cap' }] }).map(e => e.key), ['branch1']);
assert.ok(isCapOnly({ fittings: [{ kind: 'cap' }, { kind: 'none' }] }) && !isCapOnly({ fittings: [{ kind: 'tee' }, { kind: 'cap' }] }));
for (const n of ['End_Cap', 'U_Bend']) {          // the new Skynet fittings ship with an SVG picture
  const t = JSON.parse(fs.readFileSync(path.join(ROOT, 'templates', 'fitting', n + '.json'), 'utf8'));
  assert.ok(t.image.endsWith('.svg') && fs.existsSync(path.join(ROOT, 'media', t.image)), n + ' picture');
}
fs.rmSync(dir, { recursive: true, force: true });
// Fritz's TC 1.5 drawings (2026-10-23): the fittings use them; the Instrument_Tee is not square; the RIMS tube is a Skynet_Integrated_Device
for (const [n, pic] of [['Elbow_90', 'Skynet_TC15_90'], ['Elbow_45', 'Skynet_TC15_45'], ['Tee', 'Skynet_TC15_EqualTee'], ['End_Cap', 'Skynet_TC15_EndCap'], ['Instrument_Tee', 'Skynet_TC15_InstrumentTee']])
  assert.equal(S.get('fitting', n).image, `Images/Skynet/Other_Equipment/${pic}.svg`, n);
assert.deepEqual(S.get('fitting', 'Instrument_Tee').size, [90, 50]);
assert.deepEqual(cleanFitting({ size: [90, 50] }).size, [90, 50], 'a fitting keeps its size');
assert.equal(cleanFitting({ size: [5, 50] }).size, undefined, 'too small');
const rims = S.get('vessel', 'RIMS_Tube');
assert.equal(rims.integrated, 'device');
assert.equal(rims.image, 'Images/Skynet/Other_Equipment/Skynet_TC1_2_Rims_Device.svg');
assert.equal(cleanVessel(rims).integrated, 'device', 'kept when saved');
assert.equal(cleanVessel({ integrated: 'gizmo' }).integrated, undefined);
for (const f of ['Thermowell_Short', 'Thermowell_Medium', 'Thermowell_Long']) assert.ok(fs.existsSync(path.join(ROOT, 'media/Images/Skynet/Other_Equipment', `Skynet_TC15_${f}.svg`)), f);
// the Basic electric kettle (Fritz, 2026-10-23): a Skynet_Integrated_Device, the base of every Integrated Electric Kettle
const ek = S.get('vessel', 'Integrated_Electric_Kettle_Basic');
assert.equal(ek.integrated, 'device'); assert.equal(ek.cls, 'skynet');
assert.ok(fs.existsSync(path.join(ROOT, 'media', ek.image)), 'kettle picture');
assert.deepEqual(Object.keys(ek.ports).sort(), ['element', 'outlet', 'thermowell']);
console.log('templates ok');

// Add a Vessel (Fritz, 2026-10-23): Skynet Vessel Widgets, Integrated Vessels, and User Bundled Templates built on a Widget
{
  const { isVesselWidget, isIntegratedVessel, vesselBase, isUserBundledVessel } = await import('../public/templates.js');
  const d2 = fs.mkdtempSync(path.join(os.tmpdir(), 'vbase-'));
  fs.mkdirSync(path.join(d2, 'shipped', 'vessel'), { recursive: true });
  fs.writeFileSync(path.join(d2, 'shipped', 'vessel', 'Kettle_W.json'), JSON.stringify({ vesselType: 'vessel', ports: {} }));
  fs.writeFileSync(path.join(d2, 'shipped', 'vessel', 'Kettle_I.json'), JSON.stringify({ vesselType: 'vessel', integrated: 'device', ports: {} }));
  fs.writeFileSync(path.join(d2, 'shipped', 'vessel', 'Chiller.json'), JSON.stringify({ vesselType: 'pchiller', ports: {} }));
  const T = new Templates(path.join(d2, 'shipped'), path.join(d2, 'own'), { locked: true });
  const all = () => T.list('vessel');
  const W = T.get('vessel', 'Kettle_W'), I = T.get('vessel', 'Kettle_I'), C = T.get('vessel', 'Chiller');
  assert.ok(isVesselWidget(W) && !isVesselWidget(I) && !isVesselWidget(C), 'a Widget: a Skynet vessel, not Integrated');
  assert.ok(isIntegratedVessel(I) && !isIntegratedVessel(W));
  assert.equal(vesselBase(W, all()), 'Kettle_W');
  assert.equal(vesselBase(I, all()), undefined, 'an Integrated one is not a Widget');
  const u = T.create('vessel', 'My_Kettle', { from: 'Kettle_W' });
  assert.equal(u.base, 'Kettle_W', 'a clone of a Widget is built on it');
  assert.ok(isUserBundledVessel(u, all()));
  assert.equal(T.create('vessel', 'My_Kettle_2', { from: 'My_Kettle' }).base, 'Kettle_W', 'and a clone of that too');
  assert.equal(T.create('vessel', 'My_Int', { from: 'Kettle_I' }).base, undefined);
  assert.ok(!isUserBundledVessel(T.get('vessel', 'My_Int'), all()));
  assert.equal(cleanVessel({ base: 'Bad Name!' }).base, undefined);
  T.save('vessel', 'My_Kettle', { ...u, notes: 'x' });
  assert.equal(T.get('vessel', 'My_Kettle').base, 'Kettle_W', 'kept on save');
}

// Skynet Device Templates (Rules 5.16, 5.17): the Motorized Ball Valve Master H and its Daughters VL and VR ship in templates/device
{
  const T = new Templates(path.join(ROOT, 'templates'), path.join(dir, 'own3'), { locked: false });
  const ds = T.list('device'), H = ds.find(t => t.name === 'Skynet_Motorized_Ball_Valve_H'), VL = ds.find(t => t.name === 'Skynet_Motorized_Ball_Valve_VL'), VR = ds.find(t => t.name === 'Skynet_Motorized_Ball_Valve_VR');
  assert.ok(H && VL && VR, 'Master H and Daughters VL, VR ship');
  assert.ok(ds.every(t => t.cls === 'skynet'));
  assert.equal(VL.props.subtype, 'valve', 'a Daughter inherits from its Master');
  assert.equal(VL.props.orientation, 'v'); assert.equal(VR.props.flipH, true); assert.equal(H.props.flipH, undefined);
  assert.deepEqual(VR.userFields, H.userFields);
  assert.ok(T.view().device.length >= 3);
  // fixed: Kind, Valve type, Service, pictures, look, tap; user settable: orientation, flips, Tap water, Text On/Off
  const fx = deviceFixed(H);
  for (const k of ['subtype', 'valveType', 'service', 'imageOn', 'imageOff', 'look', 'tap', 'confirm', 'background', 'imagePath_2']) assert.ok(fx.has(k), k + ' fixed');
  for (const k of ['orientation', 'flipH', 'tapwater', 'showOnOffText', 'name', 'w']) assert.ok(!fx.has(k), k + ' user settable');
  // a User version sent with changed fixed attributes is put back; its picture follows its orientation
  const el = applyDeviceTemplate({ name: 'V1', template: VL.name, templateCls: 'skynet', subtype: 'pump', service: 'gas', imageOn: 'x.png', look: 'led', background: 2, orientation: 'h', w: 50 }, VL);
  assert.equal(el.subtype, 'valve'); assert.equal(el.service, 'room'); assert.equal(el.look, 'normal'); assert.equal(el.background, undefined);
  assert.equal(el.orientation, 'h', 'orientation is the user\'s'); assert.equal(el.w, 50);
  assert.match(el.imageOn, /Valve_Motor_Ball_OpenH\.svg$/);
  assert.match(applyDeviceTemplate({ orientation: 'v' }, VL).imageOff, /ClosedV_LC\.svg$/);
  // Tap water: off by default; the source end sets which end the water leaves by; unset = Needs setting (no tap flow)
  assert.equal(H.props.tapwater, false);
  assert.equal(applyDeviceTemplate({ tapwater: true, tapSource: 'in' }, H).tapwaterOut, 'out');
  assert.equal(applyDeviceTemplate({ tapwater: true, tapSource: 'out' }, H).tapwaterOut, 'in');
  assert.equal(applyDeviceTemplate({ tapwater: true }, H).tapwaterOut, 'none');
  assert.equal(applyDeviceTemplate({ tapwater: false, tapSource: 'in', tapwaterOut: 'in' }, H).tapwaterOut, undefined);
  // a Template can't make a fixed attribute user settable
  assert.ok(!cleanDevice({ userFields: ['service', 'flipH'] }).userFields.includes('service'));
}
