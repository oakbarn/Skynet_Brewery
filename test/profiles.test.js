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

// a new Mash Profile starts with one step; Metric starts in °C
const m1 = mash.create('Single infusion');
assert.deepEqual(m1.steps, [{ name: 'Saccharification', temp: 152, time: 60 }]);
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

// Boil Profile: total time and boil off
const b1 = boil.create('60 minute');
assert.equal(b1.boilTime, 60); assert.equal(b1.boilOffRate, 1);
assert.throws(() => boil.save(b1.id, { ...b1, boilTime: '' }), /boil time/);
assert.equal(boil.save(b1.id, { ...b1, boilTime: 90, boilOffRate: 1.25 }).boilTime, 90);
boil.remove(b1.id); assert.equal(boil.list().length, 0);

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
const v1 = valves.create('Ball H');
assert.equal(v1.orientation, 'v'); assert.match(v1.imageOpen, /Valve_Ball_Open/);
assert.equal(valves.save(v1.id, { ...v1, orientation: 'l45' }).orientation, 'l45');
assert.equal(valves.save(v1.id, { ...v1, orientation: 'sideways' }).orientation, 'v');

console.log('profiles tests passed');
