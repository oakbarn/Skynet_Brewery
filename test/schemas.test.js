// Schemas (own file each, load, add, backups, restore) and Equipment Profiles (shared / unique, volumes)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Store } from '../lib/store.js';
import { Schemas } from '../lib/schemas.js';
import { EquipmentProfiles } from '../lib/equipment.js';
import { equipVolumes } from '../public/brewcalc.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'schemas-'));
const cfgPath = path.join(dir, 'config', 'brewery.json');
fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
fs.writeFileSync(cfgPath, JSON.stringify({ title: 'Oak Barn', mqtt: { host: 'x' }, workspaces: [{ name: 'Main' }],
  elements: [{ name: 'vKV_Setpoint', type: 'vKonstant', kind: 'value', initial: 150 }], graphics: [], devices: [{ name: 'Sim', type: 'simulator' }] }));
const store = new Store(cfgPath, path.join(dir, 'data'));
store.load();
let started = [], restarts = 0;
const engine = { stopAll() { }, start(n) { started.push(n); } }, hw = { restart() { restarts++; } };
const profiles = new EquipmentProfiles(path.join(dir, 'config', 'equipment'));
const schemas = new Schemas(store, { engine, hw, profiles });

assert.equal(schemas.ensure(), true, 'the setup you have becomes the first Schema');
assert.equal(schemas.ensure(), false);
assert.deepEqual(schemas.list().map(s => s.name), ['Oak Barn']);
const first = store.config.schema.id;
assert.ok(fs.existsSync(path.join(dir, 'config', 'schemas', first + '.json')), 'own file');

// every save is copied to the Schema's file
store.setProp('vKV_Setpoint', 'value', 160, 'ui');
store.config.workspaces.push({ name: 'Mash' }); store.writeConfig();
assert.equal(JSON.parse(fs.readFileSync(schemas.file(first))).workspaces.length, store.config.workspaces.length);
assert.equal(JSON.parse(fs.readFileSync(schemas.file(first))).mqtt, undefined, 'panel settings are not part of a Schema');

// an empty new Schema is loaded; panel settings stay
schemas.create('BrewZilla', { empty: true });
assert.equal(store.config.schema.name, 'BrewZilla');
assert.equal(store.config.title, 'BrewZilla');
assert.equal(store.get('vKV_Setpoint'), undefined, 'its own elements');
assert.ok(store.get('SoundPlayer'), 'the built-in Sound Player is added');
assert.equal(store.config.mqtt.host, 'x', 'panel settings stay');
assert.equal(store.config.devices.length, 0);
assert.throws(() => schemas.create('brewzilla'), /already a Schema/);

// back to the first one: its elements and its saved values come back
schemas.load(first);
assert.equal(store.config.schema.name, 'Oak Barn');
assert.equal(store.getProp('vKV_Setpoint', 'value'), 160, 'values kept per Schema');
assert.equal(store.config.devices[0].name, 'Sim');
assert.throws(() => schemas.remove(first), /loaded/);

// Equipment Profiles: shared and unique
const p = profiles.create('10 gallon');
assert.equal(p.batchSize, 5.5);
schemas.setProfile(p.id);
const bz = schemas.list().find(s => s.name === 'BrewZilla').id;
schemas.load(bz); schemas.setProfile(p.id);
assert.deepEqual(schemas.usedBy(p.id).sort(), ['BrewZilla', 'Oak Barn'], 'shared by two Schemas');
const own = profiles.create('10 gallon (BrewZilla)', p.id); schemas.setProfile(own.id);
assert.deepEqual(schemas.usedBy(p.id), ['Oak Barn']);
assert.deepEqual(schemas.usedBy(own.id), ['BrewZilla'], 'unique copy');
assert.throws(() => profiles.create('10 Gallon'), /already/);
profiles.save(own.id, { ...own, equipment: [{ vesselType: 'vessel', name: 'Kettle', volume: 15, ports: { outlet: { installed: true, position: 'Center Bottom', standard: 'TC 1.5' } } }] });
assert.equal(profiles.get(own.id).equipment[0].bundled, true, 'bundled unless switched off');
assert.throws(() => profiles.save(own.id, { ...own, equipment: [{ vesselType: 'rocket' }] }), /unknown kind/);
profiles.remove(own.id); schemas.dropProfile(own.id);
assert.equal(store.config.equipmentProfile, undefined, 'a deleted profile is taken off its Schemas');

// backups: daily once a day, by hand any time, restore puts it back (and backs up first)
schemas.load(first);
assert.equal(schemas.dailyBackups().length, 2);
assert.equal(schemas.dailyBackups().length, 0, 'one a day');
store.config.workspaces.push({ name: 'Boil' }); store.writeConfig();
const tabs = store.config.workspaces.length;
const daily = schemas.listBackups(first).find(b => b.daily).file;
schemas.restore(first, daily);
assert.equal(store.config.workspaces.length, tabs - 1, 'restored');
assert.equal(store.config.schema.id, first);
assert.ok(schemas.listBackups(first).some(b => !b.daily), 'the Schema was backed up before the restore');
assert.throws(() => schemas.restore(first, '../brewery.json'), /Bad backup/);

// delete moves it aside; renaming
schemas.rename(bz, 'Zilla');
assert.ok(schemas.list().some(s => s.name === 'Zilla'));
schemas.remove(bz);
assert.equal(schemas.list().length, 1);
assert.equal(fs.readdirSync(path.join(dir, 'config', 'schemas', 'deleted')).length, 1);

// volumes as in BeerSmith
const v = equipVolumes({ batchSize: 5.5, boilTime: 60, boilOffRate: 1, trubChillerLoss: 0.5, coolingShrinkage: 4, kettleVolume: 7 });
assert.equal(v.postBoil, 6.25); assert.equal(v.preBoil, 7.25);
assert.match(v.warnings[0], /more than the kettle holds/);

clearTimeout(store._persistTimer);
console.log('schemas tests passed');
