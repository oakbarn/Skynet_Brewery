// Mash Profiles and Boil Profiles (Menu tabs): one file each, 4 mash steps, sparge, boil time and boil off
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ProfileStore } from '../lib/profiles.js';
import { brewVolumes, heatKindsFor, VESSEL_TYPES } from '../public/brewcalc.js';
import { cleanProfile } from '../lib/equipment.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'profiles-'));
const mash = new ProfileStore(path.join(dir, 'mash'), 'mash'), boil = new ProfileStore(path.join(dir, 'boil'), 'boil');

// a new Mash Profile starts with one step, kept in °C (Rule 2.59: every number is kept in metric, Units only for showing)
const m1 = mash.create('Single infusion');
assert.deepEqual(m1.steps, [{ name: 'Saccharification', temp: 67, time: 60 }]); assert.equal(m1.units, 'Metric');
assert.equal(m1.sparge, 'batch'); assert.equal(m1.batchRest, 10);
assert.equal(mash.create('Metric one', { units: 'Metric' }).steps[0].temp, 67);
assert.ok(fs.existsSync(path.join(dir, 'mash', 'single-infusion.json')), 'own file');
assert.throws(() => mash.create('single infusion'), /already/);

// up to 4 steps, empty ones dropped; a rest time only for batch sparge
const m2 = mash.save(m1.id, { ...m1, sparge: 'fly', steps: [{ name: 'Protein', temp: 122, time: 15 }, { name: '', temp: '', time: '' }, { name: 'Sacch', temp: '152', time: '45' }, { name: 'Out', temp: 168, time: 10 }, { name: 'Fifth', temp: 170, time: 5 }] });
assert.deepEqual(m2.steps.map(s => s.name), ['Protein', 'Sacch', 'Out', 'Fifth'], 'empty steps are dropped');
assert.equal(mash.save(m1.id, { ...m1, steps: Array.from({ length: 6 }, (_, i) => ({ name: 'S' + i, temp: 150, time: 10 })) }).steps.length, 4, 'no more than 4 steps');
assert.equal(m2.steps[1].temp, 152, 'numbers are kept as numbers');
assert.equal(m2.batchRest, undefined, 'fly sparge has no rest time');
assert.throws(() => mash.save(m1.id, { ...m1, steps: [] }), /at least one step/);
assert.throws(() => mash.save(m1.id, { ...m1, steps: [{ name: 'x', temp: -5, time: 10 }] }), /0 or more/);
assert.equal(mash.create('Copy', { from: m1.id }).steps.length, 4, 'a copy of another');

// a profile sent in US units is kept in metric; an older US file is turned into metric once, the old file kept beside it (Rule 2.59)
{ const us = mash.save(m1.id, { ...m1, units: 'US', steps: [{ name: 'Sacch', temp: 152, time: 60 }], spargeTemp: 168, mashOutTemp: 170 });
  assert.equal(us.units, 'Metric'); assert.equal(us.steps[0].temp, 66.6667); assert.equal(us.spargeTemp, 75.5556);
  const f = path.join(dir, 'mash', m1.id + '.json');
  fs.writeFileSync(f, JSON.stringify({ ...JSON.parse(fs.readFileSync(f, 'utf8')), units: 'US', steps: [{ name: 'Sacch', temp: 212, time: 60 }] }));
  assert.equal(mash.keepMetric(), 1); assert.equal(mash.get(m1.id).steps[0].temp, 100); assert.equal(mash.keepMetric(), 0, 'only once');
  assert.ok(fs.existsSync(f + '.before_metric'), 'the old file is kept');
  assert.ok(mash.list().filter(p => p.skynet).every(p => p.units === 'Metric'), 'Skynet Mash Profiles are kept in °C');
  assert.equal(mash.get('skynet-single-batch').steps[0].temp, 66.6667); }

// Boil Profile: total time, its own boil off (empty = the Equipment Profile's), the volume questions and the three Hop Stands
const b1 = boil.create('60 minute');
assert.equal(b1.boilTime, 60); assert.equal(b1.boilOffRate, undefined, 'no boil off of its own'); assert.equal(b1.askVolumes, true);
assert.throws(() => boil.save(b1.id, { ...b1, boilTime: '' }), /boil time/);
const b2 = boil.save(b1.id, { ...b1, boilTime: 90, boilOffRate: 1.25, hsMiddleTemp: 150, hsMiddleMin: 25 });
assert.equal(b2.boilTime, 90); assert.equal(b2.boilOffRate, 1.25); assert.equal(b2.hsMiddleTemp, 150); assert.equal(b2.hsMiddleMin, 25); assert.equal(b2.hsHighTemp, undefined);
assert.equal(boil.save(b1.id, { ...b2, boilTime: 0 }).boilTime, 0, '0 = No Boil');
assert.equal(boil.save(b1.id, { ...b2, units: 'US', boilOffRate: 1, hsMiddleTemp: 154 }).boilOffRate, 3.7854, 'US gallons kept as liters');
boil.remove(b1.id);
// the Skynet Boil Profiles (OakBarn Brewery, 2026-11-13): read only, every one asks the volumes, no boil off of their own
assert.deepEqual(boil.list().map(p => [p.name, p.boilTime]), [['Skynet 60 Minute Boil', 60], ['Skynet 90 Minute Boil', 90], ['Skynet 30 Minute Boil', 30], ['Skynet No Boil', 0]]);
assert.ok(boil.list().every(p => p.skynet && p.askVolumes && p.boilOffRate === undefined && p.notes));
assert.throws(() => boil.save('skynet-boil-60', { name: 'x', boilTime: 5 }), /cannot be changed/);

// the volume check takes the batch from the Recipe, the boil from the Boil Profile, the fermenter trub loss from the fermenter
const v = brewVolumes({ batchSize: 5, boilTime: 60, boilOffRate: 1.25, trubChillerLoss: 0.5, coolingShrinkage: 4, fermenterLoss: 0.5 });
assert.equal(v.boilOff, 1.25); assert.equal(v.bottling, 4.5);

// vessels: heat sources by type; fermenter attributes
assert.deepEqual(heatKindsFor('Mash Tun'), ['gas', 'electric', 'rims', 'herms', 'other', 'unheated']);
assert.deepEqual(heatKindsFor('Fermenter'), []);
assert.ok(VESSEL_TYPES.Other.includes('unheated'));
const p = cleanProfile({ name: 'Rig', equipment: [
  { vesselType: 'vessel', name: 'Kettle', vtype: 'Brew Kettle', volume: '15', heatKind: 'gas', heatDevice: 'Burner_Valve', probe: 'BK_Temp' },
  { vesselType: 'vessel', name: 'Conical', vtype: 'Fermenter', maxVolume: 14, minVolume: 3, extraTrub: 0.5, reportEvery: 30, reportUnit: 'min', probe: 'FV_Temp' },
  { vesselType: 'vessel', name: 'Old', vtype: 'MLT', heat: 'Gas burner' },
  { vesselType: 'vessel', name: 'Odd', vtype: 'Other', otherType: 'Grant', heatKind: 'nope', reportUnit: 'weeks' }] });
assert.equal(p.equipment[0].volume, 15); assert.equal(p.equipment[0].heatDevice, 'Burner_Valve');
assert.deepEqual([p.equipment[1].maxVolume, p.equipment[1].minVolume, p.equipment[1].reportEvery, p.equipment[1].reportUnit], [14, 3, 30, 'min']);
assert.equal(p.equipment[2].heatKind, 'gas', 'older free text heat is read');
assert.equal(p.equipment[3].heatKind, undefined); assert.equal(p.equipment[3].reportUnit, undefined); assert.equal(p.equipment[3].otherType, 'Grant');
assert.equal(p.batchSize, undefined, 'batch size belongs to the Recipe');

// Tab Background Profile and Valve Profile (no units)
const tabs = new ProfileStore(path.join(dir, 'tab'), 'tab'), valves = new ProfileStore(path.join(dir, 'valve'), 'valve');
const t1 = tabs.create('Dark panel');
assert.equal(t1.units, undefined); assert.equal(t1.valueType, 'text');
const t2 = tabs.save(t1.id, { ...t1, bgColor: 'Black', nameColor: 'White', nameAlign: 'TopCenter', valueAlign: 'Sideways', valueType: 'gauge', digits: 4, precision: 1, ledMode: 'momentary' });
assert.deepEqual([t2.bgColor, t2.nameAlign, t2.valueAlign, t2.digits, t2.precision, t2.ledMode], ['Black', 'TopCenter', undefined, 4, 1, undefined]);
assert.equal(tabs.save(t1.id, { ...t2, valueType: 'led', ledMode: 'momentary' }).ledMode, 'momentary');
assert.throws(() => tabs.save(t1.id, { ...t2, digits: 20 }), /1 to 12/);
// a new Tab's pipe and hose pixels and size live in the Tab Profile (OakBarn Brewery, 2026-11-17: "Tab Profile")
{ const t9 = tabs.create('Big Tabs'); const sv = tabs.save(t9.id, { ...t9, newTabPipe: 12, newTabHose: '8', newTabWidth: 1600, newTabHeight: '' });
  assert.equal(sv.newTabPipe, 12); assert.equal(sv.newTabHose, 8); assert.equal(sv.newTabWidth, 1600); assert.equal(sv.newTabHeight, undefined, 'empty: the screen');
  assert.throws(() => tabs.save(t9.id, { ...t9, newTabPipe: 1 }), /2 to 100/); assert.throws(() => tabs.save(t9.id, { ...t9, newTabWidth: 50 }), /200 to 20000/); tabs.remove(t9.id); }
const v1 = valves.create('Ball H');
assert.equal(v1.orientation, 'v'); assert.equal(v1.imageOpen, undefined, 'no Open picture: the On overlay shows open (2026-11-05)'); assert.match(v1.imageClosed, /Motorized_TC15_Ball_Valve_Vertical\.svg$/, 'the 3 Vessel valve picture first (2026-11-18, Rule 18.43)');
assert.equal(valves.save(v1.id, { ...v1, orientation: 'l45' }).orientation, 'l45');
assert.equal(valves.save(v1.id, { ...v1, orientation: 'sideways' }).orientation, 'v');
// the Valve Profile's Overlay (OakBarn Brewery, 2026-11-17: Valve Overlay "On Valve Profile", off Default settings)
valves.seed = () => ({ imageOverlay: 'Images/Skynet/On_Off/Overlay_Bolt_Flash.svg' });
valves.fillOverlay();
assert.match(valves.get(v1.id).imageOverlay, /Overlay_Bolt_Flash/, 'a Valve Profile with no Overlay gets the old Default settings one');
assert.equal(valves.save(v1.id, { ...valves.get(v1.id), imageOverlay: '' }).imageOverlay, 'none', 'no Overlay is None');
assert.match(valves.create('Ball V').imageOverlay, /Overlay_Bolt_Flash/, 'a new Valve Profile starts with the seed Overlay');

// the Default Pump Profile (Dialog 2 #3, 2026-11-16): always one marked Default, Right, no Cover, Hose, the Green Glow Ring Overlay
const pumps = new ProfileStore(path.join(dir, 'pump'), 'pump');
pumps.seed = () => ({ imageOverlay: 'Images/Skynet/On_Off/Overlay_Glow_Ring.svg' });
const pd = pumps.ensureDefault();
assert.equal(pd.name, 'Default Pump Profile'); assert.equal(pd.isDefault, true); assert.equal(pd.flip, 'right'); assert.equal(pd.cover, 'None');
assert.equal(pd.pumpLink, undefined, 'Hose'); assert.match(pd.imageOverlay, /Overlay_Glow_Ring/);
assert.equal(pumps.ensureDefault().id, pd.id, 'made once'); assert.equal(pumps.own().length, 1);
assert.throws(() => pumps.save(pd.id, { ...pd, isDefault: false }), /stays the Default/);
assert.throws(() => pumps.remove(pd.id), /can not be deleted/);
pumps.seed = () => ({ imageOverlay: 'tint:red' });
const p2 = pumps.create('Left pump');
assert.equal(p2.imageOverlay, 'tint:red', 'a new Pump Profile starts with the seed Overlay (the Default Pump Profile\'s)'); assert.equal(p2.isDefault, undefined);
assert.equal(pumps.save(p2.id, { ...p2, imageOverlay: '' }).imageOverlay, 'none', 'no Overlay is None');
pumps.save(p2.id, { ...p2, isDefault: true });
assert.equal(pumps.marked().id, p2.id); pumps.remove(pd.id); assert.equal(pumps.own().length, 1, 'no longer the Default: it can go');

console.log('profiles tests passed');
