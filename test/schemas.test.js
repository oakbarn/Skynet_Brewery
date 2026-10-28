// Schemas (own file each, load, add, backups, restore) and Equipment Profiles (shared / unique, volumes)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Store } from '../lib/store.js';
import { Schemas, versionName, versionFile } from '../lib/schemas.js';
import { EquipmentProfiles } from '../lib/equipment.js';
import { equipVolumes } from '../public/brewcalc.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'schemas-'));
const cfgPath = path.join(dir, 'config', 'brewery.json');
fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
fs.writeFileSync(cfgPath, JSON.stringify({ title: 'Oak Barn', mqtt: { host: 'x' }, workspaces: [{ name: 'Main' }],
  elements: [{ name: 'gKV_Setpoint', type: 'gKonstant', kind: 'value', initial: 150 }], graphics: [], devices: [{ name: 'Sim', type: 'simulator' }] }));
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
store.setProp('gKV_Setpoint', 'value', 160, 'ui');
store.config.workspaces.push({ name: 'Mash' }); store.writeConfig();
assert.equal(JSON.parse(fs.readFileSync(schemas.file(first))).workspaces.length, store.config.workspaces.length);
assert.equal(JSON.parse(fs.readFileSync(schemas.file(first))).mqtt, undefined, 'panel settings are not part of a Schema');

// an empty new Schema is loaded; panel settings stay
schemas.create('BrewZilla', { empty: true });
assert.equal(store.config.schema.name, 'BrewZilla');
assert.equal(store.config.title, 'BrewZilla');
assert.equal(store.get('gKV_Setpoint'), undefined, 'its own elements');
assert.ok(store.get('SoundPlayer'), 'the built-in Sound Player is added');
assert.equal(store.config.mqtt.host, 'x', 'panel settings stay');
assert.deepEqual(store.config.devices.map(({ _key, ...d }) => d), [{ name: 'New_Mega_2560_1', id: 'NM', type: 'simulator', board: 'mega' }], 'a new empty Schema starts with a pretend Mega (Fritz, 2026-10-27)');
assert.throws(() => schemas.create('brewzilla'), /already a Schema/);

// back to the first one: its elements and its saved values come back
schemas.load(first);
assert.equal(store.config.schema.name, 'Oak Barn');
assert.equal(store.getProp('gKV_Setpoint', 'value'), 160, 'values kept per Schema');
assert.equal(store.config.devices[0].name, 'Sim');
assert.throws(() => schemas.remove(first), /loaded/);

// Equipment Profiles: shared and unique
const p = profiles.create('10 gallon');
assert.equal(p.trubChillerLoss, 0.5);
assert.equal(p.batchSize, undefined, 'batch size belongs to the Recipe now');
schemas.setProfile('Main', p.id);
assert.equal(store.config.workspaces.find(w => w.name === 'Main').equipmentProfile, p.id, 'the profile belongs to a Tab');
const bz = schemas.list().find(s => s.name === 'BrewZilla').id;
schemas.load(bz); schemas.setProfile('Equipment', p.id);
assert.deepEqual(schemas.usedBy(p.id).sort(), ['BrewZilla', 'Oak Barn'], 'shared by two Schemas');
assert.deepEqual(schemas.usedOn(p.id).map(u => u.schema + '/' + u.tab).sort(), ['BrewZilla/Equipment', 'Oak Barn/Main']);
assert.throws(() => schemas.setProfile('Main', p.id), /already used on the Tab "Equipment"/, 'one Tab per Schema');
const own = profiles.create('10 gallon (BrewZilla)', p.id); schemas.setProfile('Equipment', own.id);
assert.deepEqual(schemas.usedBy(p.id), ['Oak Barn']);
assert.deepEqual(schemas.usedBy(own.id), ['BrewZilla'], 'unique copy');
assert.throws(() => profiles.create('10 Gallon'), /already/);
profiles.save(own.id, { ...own, equipment: [{ vesselType: 'vessel', name: 'Kettle', volume: 15, ports: { outlet: { installed: true, position: 'Center Bottom', standard: 'TC 1.5' } } }] });
assert.equal(profiles.get(own.id).equipment[0].bundled, true, 'bundled unless switched off');
assert.throws(() => profiles.save(own.id, { ...own, equipment: [{ vesselType: 'rocket' }] }), /unknown kind/);
profiles.remove(own.id); schemas.dropProfile(own.id);
assert.ok(!store.config.workspaces.some(w => w.equipmentProfile === own.id), 'a deleted profile is taken off its Tabs');

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

// the Equipment Profile stores the equipment and piping; every Schema using it shows the same drawing
const kettle = { id: 'g1', kind: 'vessel', vesselType: 'vessel', workspace: 'Equipment', name: 'Kettle' };
const pipe = { id: 'g2', kind: 'pipe', workspace: 'Equipment', points: [[0, 0], [10, 0]] };
const pic = { id: 'g3', kind: 'image', workspace: 'Main', src: 'x.png' };
store.saveLayout({ graphics: [kettle, pipe, pic] });
const shared = profiles.create('Shared rig');
let r = schemas.setProfile('Equipment', shared.id);
assert.equal(r.took, true, 'a profile with no drawing takes what is on the tabs');
assert.deepEqual(profiles.get(shared.id).graphics.map(g => g.id), ['g1', 'g2'], 'equipment and pipes in the profile');
assert.deepEqual(JSON.parse(fs.readFileSync(schemas.file(first))).graphics.map(g => g.id), ['g3'], 'the Schema file keeps the rest');
schemas.create('Second', { empty: true });
assert.equal(store.config.devices[0].name, 'New_Mega_2560_1', 'the BrewZilla Schema (and its New_Mega_2560_1) was deleted, so 1 is free again');
schemas.setProfile('Equipment', shared.id);
assert.deepEqual(store.config.graphics.map(g => g.id).sort(), ['g1', 'g2'], 'a second Schema shows the shared drawing');
assert.ok(store.config.workspaces.some(w => w.name === 'Equipment'));
store.saveLayout({ graphics: [...store.config.graphics, { id: 'g4', kind: 'pipe', workspace: 'Equipment' }] });
schemas.load(first);
assert.deepEqual(store.config.graphics.map(g => g.id).sort(), ['g1', 'g2', 'g3', 'g4'], 'a pipe added in one Schema shows in the other');

// locks: by hand or lock_Equipment in a Process; layout changes to equipment / pipes are refused while locked
assert.match(schemas.lock(true, 'Process Brew_Day'), /locked/);
assert.throws(() => schemas.checkLayout(store.config.graphics.filter(g => g.id !== 'g4')), /locked/);
schemas.checkLayout(store.config.graphics.map(g => g.id === 'g3' ? { ...g, x: 50 } : g));   // a picture may still move
assert.throws(() => profiles.save(shared.id, { ...profiles.get(shared.id), batchSize: 10 }), /locked/);
assert.throws(() => schemas.setProfile('Equipment', null), /locked/);
schemas.lock(false, 'fritz');
schemas.checkLayout([]);
const sec = schemas.list().find(s => s.name === 'Second').id;
schemas.dropProfile(shared.id, profiles.get(shared.id).graphics); profiles.remove(shared.id);
assert.deepEqual(JSON.parse(fs.readFileSync(schemas.file(sec))).graphics.map(g => g.id).sort(), ['g1', 'g2', 'g4'], 'a deleted profile leaves its drawing in each Schema');
assert.ok(!store.config.workspaces.some(w => w.equipmentProfile === shared.id));

// Default Layout: a Schema follows its profile's layout, or keeps its own (Fritz: the tabs change only when you choose)
const rigB = profiles.create('Rig B');
schemas.setProfile('Equipment', rigB.id);
assert.deepEqual(profiles.get(rigB.id).graphics.map(g => g.id).sort(), ['g1', 'g2', 'g4'], 'a new profile takes the tabs as its Default Layout');
const rigC = profiles.create('Rig C'); profiles.setDrawing(rigC.id, [{ id: 'c1', kind: 'vessel', workspace: 'Equipment' }], 'Equipment');
r = schemas.setProfile('Equipment', null); r = schemas.setProfile('Equipment', rigC.id, { layout: 'keep' });
const eqTab = () => store.config.workspaces.find(w => w.name === 'Equipment');
assert.equal(eqTab().layoutFromProfile, false);
assert.deepEqual(store.config.graphics.map(g => g.id).sort(), ['g1', 'g2', 'g3', 'g4'], 'keep: the tabs stay as they are');
store.saveLayout({ graphics: [...store.config.graphics, { id: 'g5', kind: 'pipe', workspace: 'Equipment' }] });
assert.deepEqual(profiles.get(rigC.id).graphics.map(g => g.id), ['c1'], 'keep: the profile\'s Default Layout is not touched');
assert.ok(JSON.parse(fs.readFileSync(schemas.file(first))).graphics.some(g => g.id === 'g5'), 'keep: the drawing stays in the Schema file');
schemas.load(sec); schemas.load(first);
assert.ok(store.config.graphics.some(g => g.id === 'g5') && !store.config.graphics.some(g => g.id === 'c1'), 'keep survives a reload');
schemas.layoutAction('Equipment', 'save');
assert.deepEqual(profiles.get(rigC.id).graphics.map(g => g.id).sort(), ['g1', 'g2', 'g4', 'g5'], 'save: the tabs become the Default Layout');
assert.equal(eqTab().layoutFromProfile, undefined);
profiles.setDrawing(rigC.id, [{ id: 'c2', kind: 'vessel', workspace: 'Equipment' }], 'Equipment');
schemas.layoutAction('Equipment', 'use');
assert.deepEqual(store.config.graphics.map(g => g.id).sort(), ['c2', 'g3'], 'use: the Default Layout goes on the tabs, pictures stay');
schemas.layoutAction('Equipment', 'keep'); assert.equal(eqTab().layoutFromProfile, false);
assert.throws(() => schemas.layoutAction('Equipment', 'nope'), /Unknown/);
schemas.layoutAction('Equipment', 'save');

// one Equipment Profile per Tab (Fritz, 2026-10-21): a Hot Side Tab and a Fermentation Tab, each with its own list
store.config.workspaces.push({ name: 'Fermentation' }); store.writeConfig();
const ferm = profiles.create('Fermentation room');
store.saveLayout({ graphics: [...store.config.graphics, { id: 'f1', kind: 'vessel', vesselType: 'vessel', workspace: 'Fermentation', name: 'FV1' }, { id: 'f2', kind: 'ip', workspace: 'Fermentation', attachTo: 'f1', port: 'outlet' }] });
schemas.setProfile('Fermentation', ferm.id);
assert.deepEqual(profiles.get(ferm.id).graphics.map(g => g.id), ['f1', 'f2'], 'only the Fermentation Tab is in its profile');
assert.ok(!profiles.get(rigC.id).graphics.some(g => g.workspace === 'Fermentation'), 'the Hot Side profile keeps its own Tab');
assert.equal(profiles.get(ferm.id).tab, 'Fermentation');
assert.ok(!JSON.parse(fs.readFileSync(schemas.file(store.config.schema.id))).graphics.some(g => ['f1', 'f2', 'c2'].includes(g.id)), 'both drawings live in their profiles');
schemas.load(sec); schemas.load(first);
assert.ok(['c2', 'f1', 'f2'].every(id => store.config.graphics.some(g => g.id === id)), 'both come back on load');
// a lock on one Tab's profile leaves the other Tab free; lock_Equipment locks them all
schemas.lockProfile(ferm.id, true, 'fritz');
assert.throws(() => schemas.checkLayout(store.config.graphics.filter(g => g.id !== 'f2')), /Fermentation/);
schemas.checkLayout(store.config.graphics.filter(g => g.id !== 'c2'));
assert.match(schemas.lock(true, 'Process Brew_Day'), /"Rig C", "Fermentation room" locked|"Fermentation room", "Rig C" locked/);
schemas.lock(false, 'fritz');
// the same profile on a Tab of another Schema whose names are taken: the copy gets new ids and names, nothing clashes
const third = schemas.create('Third', { empty: true });
assert.equal(store.config.devices[0].name, 'New_Mega_2560_2', 'Second has New_Mega_2560_1, so the next number');
store.saveLayout({ graphics: [{ id: 'f1', kind: 'vessel', vesselType: 'vessel', workspace: 'Main', name: 'FV1' }] });
schemas.setProfile('Equipment', ferm.id);
const put = store.config.graphics.filter(g => g.workspace === 'Equipment');
assert.equal(put.length, 2); assert.ok(put.every(g => g.id !== 'f1') && put[0].name === 'FV1_2', 'new id and name');
assert.equal(put.find(g => g.kind === 'ip').attachTo, put.find(g => g.kind === 'vessel').id, 'its IP still points at it');
// the layout save keeps each Tab's profile (it is changed on the ☰ Menu only)
store.saveLayout({ workspaces: schemas.keepTabProfiles(store.config.workspaces.map(w => ({ name: w.name, id: w.id }))) });
assert.equal(store.config.workspaces.find(w => w.name === 'Equipment').equipmentProfile, ferm.id);
schemas.load(first);

// Schema versions: <name>_yyyymmdd_hh_mm, kept under that file name; the version survives a reload and can be restored
assert.equal(versionName('Oak Barn', new Date(2026, 9, 21, 9, 5)), 'Oak Barn_20261021T0905');
assert.equal(versionFile('Oak Barn_20261021_09_05'), 'Oak_Barn_20261021_09_05.json');
const act = store.config.schema.id;
const nv = schemas.newVersion();
assert.match(nv.version, new RegExp(`^${store.config.schema.name}_\\d{8}T\\d{4}$`));
assert.equal(store.config.schema.version, nv.version);
assert.equal(JSON.parse(fs.readFileSync(schemas.file(act))).version, nv.version, 'the Schema file has its version');
assert.ok(fs.existsSync(path.join(schemas.versionsDir(act), nv.file)), 'a copy under the version file name');
assert.ok(schemas.listBackups(act).some(b => b.version && b.file === nv.file), 'versions are listed with the backups');
assert.throws(() => schemas.newVersion(sec === act ? first : sec), /Only the loaded Schema/);
const other = sec === act ? first : sec;
schemas.load(other); assert.equal(store.config.schema.version, undefined, 'another Schema has its own (no) version');
schemas.load(act); assert.equal(store.config.schema.version, nv.version, 'the version comes back on load');
store.config.workspaces.push({ name: 'After version' }); store.writeConfig();
schemas.restore(act, nv.file, { version: true });
assert.ok(!store.config.workspaces.some(w => w.name === 'After version'), 'restoring a version puts it back');
assert.equal(store.config.schema.version, nv.version);

// Schema.json: Save as .json file holds the Schema with its profile drawing, never the panel settings
const ex = schemas.exportSchema(store.config.schema.id);
assert.match(ex.file, /^[\w.-]+_\d{8}T\d{4}\.json$/, 'named Name_yyyymmddThhmm');
assert.equal(ex.schema.name, store.config.schema.name);
assert.equal(ex.schema.mqtt, undefined, 'no panel settings');
assert.equal(ex.schema.users, undefined, 'no logins');
assert.deepEqual(ex.schema.graphics.map(g => g.id).sort(), store.config.graphics.map(g => g.id).sort(), 'the equipment drawing is put back in');
const notLoaded = schemas.list().find(x => !x.active);
if (notLoaded) assert.equal(schemas.exportSchema(notLoaded.id).schema.name, notLoaded.name, 'a Schema that is not loaded');
const keepVersion = store.config.schema.version;
assert.equal(schemas.exportSchema(store.config.schema.id).version, keepVersion, 'the Schema version is used for the file name');
store.config.schema.version = 'My Rig_20261021_14_05';
assert.equal(schemas.exportSchema(store.config.schema.id).file, 'My_Rig_20261021_14_05.json', 'the version name when there is one');
store.config.schema.version = keepVersion;

// Clone a Schema: a copy with its saved values; the loaded one stays loaded unless asked
const loadedNow = store.config.schema.id, src = schemas.list().find(x => x.name === 'Oak Barn');
const made = schemas.clone(src.id, 'Oak Barn Test');
assert.equal(store.config.schema.id, loadedNow, 'cloning does not load the copy');
const cl = JSON.parse(fs.readFileSync(schemas.file(made.id)));
assert.equal(cl.name, 'Oak Barn Test'); assert.equal(cl.clonedFrom, 'Oak Barn'); assert.equal(cl.version, undefined, 'no version of its own yet');
assert.ok(fs.existsSync(schemas.statePath(made.id)), 'its saved values come too');
assert.throws(() => schemas.clone(src.id, 'oak barn test'), /already a Schema/);
schemas.clone(made.id, 'Oak Barn Test 2', { load: true });
assert.equal(store.config.schema.name, 'Oak Barn Test 2', 'loaded when asked');
assert.equal(store.getProp('gKV_Setpoint', 'value'), 160, 'with the values of the one it was cloned from');

// loading a Schema switches everything off first, and again once the new one is in
let offs = 0; hw.allOff = () => { offs++; };
schemas.load(loadedNow);
assert.equal(offs, 2, 'all off before and after the switch');
delete hw.allOff;

// an older setup with one profile for the whole Schema is moved to the Tab that holds its equipment
{
  const d2 = fs.mkdtempSync(path.join(os.tmpdir(), 'schemas-old-')), cfg2 = path.join(d2, 'config', 'brewery.json');
  fs.mkdirSync(path.join(d2, 'config', 'schemas'), { recursive: true });
  const prof2 = new EquipmentProfiles(path.join(d2, 'config', 'equipment'));
  const old = prof2.create('Old rig');
  prof2.write(old.id, { ...prof2.get(old.id), tabs: [{ name: 'Brewhouse' }, { name: 'Cellar' }],
    graphics: [{ id: 'k', kind: 'vessel', workspace: 'Brewhouse' }, { id: 'h', kind: 'vessel', workspace: 'Brewhouse' }, { id: 'c', kind: 'vessel', workspace: 'Cellar' }] });
  fs.writeFileSync(path.join(d2, 'config', 'schemas', 'other.json'), JSON.stringify({ name: 'Other', workspaces: [{ name: 'Main' }], graphics: [], equipmentProfile: old.id }));
  fs.writeFileSync(cfg2, JSON.stringify({ schema: { id: 'mine', name: 'Mine' }, workspaces: [{ name: 'Brewhouse' }, { name: 'Cellar' }], equipmentProfile: old.id,
    graphics: [{ id: 'k', kind: 'vessel', workspace: 'Brewhouse' }, { id: 'h', kind: 'vessel', workspace: 'Brewhouse' }, { id: 'c', kind: 'vessel', workspace: 'Cellar' }], elements: [], devices: [] }));
  const st2 = new Store(cfg2, path.join(d2, 'data')); st2.load();
  const sc2 = new Schemas(st2, { engine, hw, profiles: prof2 });
  sc2.ensure();
  assert.equal(st2.config.equipmentProfile, undefined, 'no Schema-wide profile any more');
  assert.equal(st2.config.workspaces.find(w => w.name === 'Brewhouse').equipmentProfile, old.id, 'it goes on the Tab with the most equipment');
  assert.deepEqual(prof2.get(old.id).graphics.map(g => g.id), ['k', 'h'], 'the profile keeps the drawing of that Tab');
  assert.equal(prof2.get(old.id).tabs, undefined);
  const mine = JSON.parse(fs.readFileSync(sc2.file('mine')));
  assert.deepEqual(mine.graphics.map(g => g.id), ['c'], 'the Cellar Tab keeps its equipment, in the Schema itself');
  const oth = JSON.parse(fs.readFileSync(sc2.file('other')));
  assert.equal(oth.equipmentProfile, undefined);
  assert.deepEqual(oth.graphics.map(g => g.id).sort(), ['c', 'h', 'k'], 'a Schema that is not loaded keeps every piece it showed');
  assert.equal(oth.workspaces.find(w => w.name === 'Brewhouse').equipmentProfile, old.id);
  clearTimeout(st2._persistTimer);
}

// volumes as in BeerSmith
const v = equipVolumes({ batchSize: 5.5, boilTime: 60, boilOffRate: 1, trubChillerLoss: 0.5, coolingShrinkage: 4, kettleVolume: 7 });
assert.equal(v.postBoil, 6.25); assert.equal(v.preBoil, 7.25);
assert.match(v.warnings[0], /more than the kettle holds/);

clearTimeout(store._persistTimer);
console.log('schemas tests passed');
