// Schemas (own file each, load, add, backups, restore) and Equipment Profiles (shared / unique, volumes)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Store } from '../lib/store.js';
import { Schemas, versionName, versionFile } from '../lib/schemas.js';
import { copyTabProfile, unlinkTabProfile } from '../public/tabprofile.js';
import { EquipmentProfiles } from '../lib/equipment.js';
import { brewVolumes } from '../public/brewcalc.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'schemas-'));
const cfgPath = path.join(dir, 'config', 'brewery.json');
fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
fs.writeFileSync(cfgPath, JSON.stringify({ title: 'Oak Barn', mqtt: { host: 'x' }, workspaces: [{ name: 'Main' }],
  elements: [{ name: 'gGV_Setpoint', type: 'gGlobal', kind: 'value', initial: 150 }], graphics: [], devices: [{ name: 'Sim', connection: 'simulator' }] }));
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
store.setProp('gGV_Setpoint', 'value', 160, 'ui');
store.config.workspaces.push({ name: 'Mash' }); store.writeConfig();
assert.equal(JSON.parse(fs.readFileSync(schemas.file(first))).workspaces.length, store.config.workspaces.length);
assert.equal(JSON.parse(fs.readFileSync(schemas.file(first))).mqtt, undefined, 'panel settings are not part of a Schema');

// an empty new Schema is loaded; panel settings stay
schemas.create('BrewZilla', { empty: true });
assert.equal(store.config.schema.name, 'BrewZilla');
assert.equal(store.config.title, 'BrewZilla');
assert.equal(store.get('gGV_Setpoint'), undefined, 'its own elements');
assert.ok(store.get('SoundPlayer'), 'the built-in Sound Player is added');
assert.equal(store.config.mqtt.host, 'x', 'panel settings stay');
assert.deepEqual(store.config.devices, [], 'a new empty Schema starts with no Interface (OakBarn Brewery, 2026-11-14)');
assert.throws(() => schemas.create('brewzilla'), /already a Schema/);

// back to the first one: its elements and its saved values come back
schemas.load(first);
assert.equal(store.config.schema.name, 'Oak Barn');
assert.equal(store.getProp('gGV_Setpoint', 'value'), 160, 'values kept per Schema');
assert.equal(store.config.devices[0].name, 'Sim');
assert.throws(() => schemas.remove(first), /loaded/);

// Equipment Profiles: shared and unique
const p = profiles.create('10 gallon');
assert.equal(p.trubChillerLoss, 2); assert.equal(p.units, 'Metric', 'a new profile is kept in metric (Rule 2.59)');
assert.equal(p.batchSize, undefined, 'batch size belongs to the Recipe now');
// a profile is only copied onto a Tab to start a build: the Tab keeps no link to it (Rule 2.62)
schemas.setProfile('Main', p.id);
const mainTab = () => store.config.workspaces.find(w => w.name === 'Main');
assert.equal(mainTab().equipmentProfile, undefined, 'no link to the profile (Rule 2.62)');
assert.equal(mainTab().equip.brewhouseEfficiency, p.brewhouseEfficiency, 'the numbers are copied onto the Tab');
schemas.setTabEquip('Main', { brewhouseEfficiency: 81 });
assert.equal(mainTab().equip.brewhouseEfficiency, 81, 'changed on the Tab');
assert.equal(profiles.get(p.id).brewhouseEfficiency, p.brewhouseEfficiency, 'the profile is not changed by the Tab');
profiles.save(p.id, { ...profiles.get(p.id), brewhouseEfficiency: 60 });
assert.equal(mainTab().equip.brewhouseEfficiency, 81, 'the Tab is not changed by the profile');
schemas.setProfile('Mash', p.id);
assert.equal(store.config.workspaces.find(w => w.name === 'Mash').equip.brewhouseEfficiency, 60, 'any number of Tabs can start from one profile');
const bz = schemas.list().find(s => s.name === 'BrewZilla').id;
schemas.load(bz); schemas.setProfile('Equipment', p.id);
assert.deepEqual(schemas.usedBy(p.id), [], 'no Schema is linked to a profile');
const own = profiles.create('10 gallon (BrewZilla)', p.id);
assert.throws(() => profiles.create('10 Gallon'), /already/);
profiles.save(own.id, { ...own, equipment: [{ vesselType: 'vessel', name: 'Kettle', volume: 15, ports: { outlet: { installed: true, position: 'Center Bottom', standard: 'TC 1.5' } } }] });
assert.equal(profiles.get(own.id).equipment[0].bundled, true, 'bundled unless switched off');
assert.throws(() => profiles.save(own.id, { ...own, equipment: [{ vesselType: 'rocket' }] }), /unknown kind/);
profiles.remove(own.id); schemas.dropProfile(own.id);
assert.ok(store.config.workspaces.find(w => w.name === 'Equipment').equip, 'a deleted profile leaves the Tab its numbers');

// backups (Rule 9.17): <Schema name>_yyyymmddThhmm.BacUp, never overwritten (a second one in the same minute gets _2), no daily ones;
// restore puts it back (and backs up first)
schemas.load(first);
assert.equal(typeof schemas.dailyBackups, 'undefined', 'no daily backup');
const b1 = schemas.backupSchema(first), b2 = schemas.backupSchema(first);
assert.match(b1, /^[\w.-]+_\d{8}T\d{4}\.BacUp$/); assert.notEqual(b1, b2); assert.match(b2, /_2\.BacUp$/);
store.config.workspaces.push({ name: 'Boil' }); store.writeConfig();
const tabs = store.config.workspaces.length;
const n0 = schemas.listBackups(first).length;
schemas.restore(first, b1);
assert.equal(store.config.workspaces.length, tabs - 1, 'restored');
assert.equal(store.config.schema.id, first);
assert.equal(schemas.listBackups(first).length, n0 + 1, 'the Schema was backed up before the restore');
assert.ok(schemas.listBackups(first).every(b => !b.file.includes('.state.')), 'saved values are not listed as backups');
assert.throws(() => schemas.restore(first, '../brewery.json'), /Bad backup/);

// delete moves it aside; renaming
schemas.rename(bz, 'Zilla');
assert.ok(schemas.list().some(s => s.name === 'Zilla'));
schemas.remove(bz);
assert.equal(schemas.list().length, 1);
assert.equal(fs.readdirSync(path.join(dir, 'config', 'schemas', 'deleted')).length, 1);

// 💾 Save as a profile: the Tab's drawing is copied into the profile, one direction only; the Tab keeps it and no link (Rule 2.62)
const kettle = { id: 'g1', kind: 'vessel', vesselType: 'vessel', workspace: 'Equipment', name: 'Kettle' };
const pipe = { id: 'g2', kind: 'pipe', workspace: 'Equipment', points: [[0, 0], [10, 0]] };
const pic = { id: 'g3', kind: 'image', workspace: 'Main', src: 'x.png' };
store.saveLayout({ graphics: [kettle, pipe, pic] });
const shared = profiles.create('Shared rig');
schemas.saveTabAsProfile('Equipment', shared.id);
assert.deepEqual(profiles.get(shared.id).graphics.map(g => g.id), ['g1', 'g2'], 'equipment and pipes copied into the profile');
assert.deepEqual(JSON.parse(fs.readFileSync(schemas.file(first))).graphics.map(g => g.id).sort(), ['g1', 'g2', 'g3'], 'the Tab keeps its drawing');
store.saveLayout({ graphics: [...store.config.graphics, { id: 'g4', kind: 'pipe', workspace: 'Equipment' }] });
assert.deepEqual(profiles.get(shared.id).graphics.map(g => g.id), ['g1', 'g2'], 'a later change on the Tab never goes into the profile');
schemas.create('Second', { empty: true });
assert.equal(store.config.devices.length, 0, 'a new empty Schema: no Interface');
schemas.setProfile('Equipment', shared.id);
assert.deepEqual(store.config.graphics.map(g => g.id).sort(), ['g1', 'g2'], 'a copy of the profile goes on the Tab');
store.saveLayout({ graphics: [...store.config.graphics, { id: 'g5', kind: 'pipe', workspace: 'Equipment' }] });
const sec = schemas.list().find(s => s.name === 'Second').id;
schemas.load(first);
assert.deepEqual(store.config.graphics.map(g => g.id).sort(), ['g1', 'g2', 'g3', 'g4'], 'a pipe added in one Schema never shows in another');
assert.deepEqual(profiles.get(shared.id).graphics.map(g => g.id), ['g1', 'g2'], 'nor in the profile');

// locks are on the Tab: lock_Equipment (every Tab with equipment) or 🔒 on one Tab; a profile's own lock only keeps the profile
assert.match(schemas.lock(true, 'Process Brew_Day'), /locked/);
assert.throws(() => schemas.checkLayout(store.config.graphics.filter(g => g.id !== 'g4')), /locked/);
schemas.checkLayout(store.config.graphics.map(g => g.id === 'g3' ? { ...g, x: 50 } : g));   // a picture may still move
assert.throws(() => schemas.setProfile('Equipment', shared.id), /locked/);
profiles.save(shared.id, { ...profiles.get(shared.id), notes: 'free' });                     // the profile is not frozen by a Tab
schemas.lock(false, 'fritz');
schemas.checkLayout([]);
schemas.lockTab('Equipment', true, 'fritz');
assert.throws(() => schemas.checkLayout(store.config.graphics.filter(g => g.id !== 'g4')), /"Equipment" is locked/);
const kept = schemas.keepTabProfiles(store.config.workspaces.map(w => ({ name: w.name, equipmentProfile: 'x', layoutFromProfile: false })));
assert.ok(kept.find(w => w.name === 'Equipment').equipLocked && kept.every(w => w.equipmentProfile === undefined && w.layoutFromProfile === undefined), 'a layout save keeps the lock and never a link');
schemas.lockTab('Equipment', false, 'fritz');
schemas.checkLayout([]);
schemas.lockProfile(shared.id, true, 'fritz');
assert.throws(() => profiles.save(shared.id, { ...profiles.get(shared.id), notes: 'x' }), /locked/);
schemas.checkLayout(store.config.graphics.filter(g => g.id !== 'g4'));                          // ... and never a Tab
schemas.lockProfile(shared.id, false, 'fritz');
schemas.dropProfile(shared.id, profiles.get(shared.id).graphics); profiles.remove(shared.id);
assert.deepEqual(JSON.parse(fs.readFileSync(schemas.file(sec))).graphics.map(g => g.id).sort(), ['g1', 'g2', 'g5'], 'a deleted profile changes no Schema');

// ☰ Menu > Default Layout: save a Tab into a profile, or put a profile's copy on a Tab
const rigC = profiles.create('Rig C'); profiles.setDrawing(rigC.id, [{ id: 'c2', kind: 'vessel', workspace: 'Equipment' }], 'Equipment');
schemas.layoutAction('Equipment', 'use', rigC.id);
assert.deepEqual(store.config.graphics.map(g => g.id).sort(), ['c2', 'g3'], 'use: a copy of the drawing goes on the Tab, pictures stay');
assert.throws(() => schemas.layoutAction('Equipment', 'nope', rigC.id), /Unknown/);
const rigD = profiles.create('Rig D');
schemas.layoutAction('Equipment', 'save', rigD.id);
assert.deepEqual(profiles.get(rigD.id).graphics.map(g => g.id), ['c2'], 'save: the Tab goes into the profile');

// the same profile on a Tab of another Schema whose names are taken: the copy gets new ids and names, nothing clashes
store.config.workspaces.push({ name: 'Fermentation' }); store.writeConfig();
const ferm = profiles.create('Fermentation room');
store.saveLayout({ graphics: [...store.config.graphics, { id: 'f1', kind: 'vessel', vesselType: 'vessel', workspace: 'Fermentation', name: 'FV1' }, { id: 'f2', kind: 'ip', workspace: 'Fermentation', attachTo: 'f1', port: 'outlet' }] });
schemas.saveTabAsProfile('Fermentation', ferm.id);
assert.deepEqual(profiles.get(ferm.id).graphics.map(g => g.id), ['f1', 'f2'], 'only the Fermentation Tab is in its profile');
const third = schemas.create('Third', { empty: true });
store.saveLayout({ graphics: [{ id: 'f1', kind: 'vessel', vesselType: 'vessel', workspace: 'Main', name: 'FV1' }] });
schemas.setProfile('Equipment', ferm.id);
const put = store.config.graphics.filter(g => g.workspace === 'Equipment');
assert.equal(put.length, 2); assert.ok(put.every(g => g.id !== 'f1') && put[0].name === 'FV1_2', 'new id and name');
assert.equal(put.find(g => g.kind === 'ip').attachTo, put.find(g => g.kind === 'vessel').id, 'its IP still points at it');
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
assert.equal(store.getProp('gGV_Setpoint', 'value'), 160, 'with the values of the one it was cloned from');

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
  const bh = st2.config.workspaces.find(w => w.name === 'Brewhouse');
  assert.equal(bh.equipmentProfile, undefined, 'no link left (Rule 2.62)');
  assert.ok(bh.equip, 'the Tab with the most equipment takes a copy of the numbers');
  assert.deepEqual(st2.config.graphics.map(g => g.id).sort(), ['c', 'h', 'k'], 'every Tab keeps its equipment');
  sc2.load('other');
  assert.deepEqual(st2.config.graphics.map(g => g.id).sort(), ['c', 'h', 'k'], 'a Schema that was not loaded keeps every piece it showed');
  assert.ok(!st2.config.workspaces.some(w => w.equipmentProfile), 'and loses its link when loaded');
  clearTimeout(st2._persistTimer);
}

// Rule 2.62 #9 ("NO LINK NO Connect Nada 100% Links gone"): a Tab Profile is copied onto a Tab, never linked
{
  const P = { id: 'blue', name: 'Blue', bgColor: '#123456', nameColor: 'white', valueType: 'gauge', digits: 4 };
  const w = copyTabProfile({ name: 'BH', color: '#000000', tabProfile: 'blue' }, P);
  assert.equal(w.color, '#123456', 'picked now: its color copied in');
  assert.deepEqual(w.startLook, { nameColor: 'white', valueType: 'gauge', digits: 4 }, 'and its look');
  assert.equal(w.tabProfile, undefined, 'no link kept');
  P.bgColor = '#ffffff'; P.nameColor = 'red';
  assert.equal(w.color, '#123456'); assert.equal(w.startLook.nameColor, 'white', 'a changed profile changes no Tab');
  assert.equal(copyTabProfile({ name: 'X', color: '#abcdef' }, { name: 'No color' }).color, '#abcdef', 'a profile with no color keeps the Tab\'s');
  // a Tab saved before: copied once as it showed (its own Color won), then the link goes
  const find = id => id === 'blue' ? { ...P, bgColor: '#123456' } : null;
  const old1 = { name: 'A', tabProfile: 'blue' }, old2 = { name: 'B', color: '#00ff00', tabProfile: 'blue' }, old3 = { name: 'C', tabProfile: 'gone' };
  assert.ok(unlinkTabProfile(old1, find)); assert.equal(old1.color, '#123456'); assert.equal(old1.tabProfile, undefined); assert.equal(old1.startLook.nameColor, 'red');
  unlinkTabProfile(old2, find); assert.equal(old2.color, '#00ff00', 'its own Color still wins');
  unlinkTabProfile(old3, find); assert.equal(old3.tabProfile, undefined, 'a deleted profile: the link just goes');
  assert.equal(unlinkTabProfile({ name: 'D' }, find), false, 'nothing to do');
  // a layout save never brings a link back, and a Schema loaded unlinks its Tabs
  schemas.tabLooks = { has: id => id === 'blue', get: () => ({ id: 'blue', bgColor: '#123456', nameColor: 'white' }) };
  const sent = schemas.keepTabProfiles([{ name: 'Main', tabProfile: 'blue' }]);
  assert.equal(sent[0].tabProfile, undefined); assert.equal(sent[0].color, '#123456');
  const c = { workspaces: [{ name: 'T', tabProfile: 'blue' }] };
  schemas.drawTabs(c);
  assert.equal(c.workspaces[0].tabProfile, undefined); assert.deepEqual(c.workspaces[0].startLook, { nameColor: 'white' });
  delete schemas.tabLooks;
}

// volumes as in BeerSmith
const v = brewVolumes({ batchSize: 5.5, boilTime: 60, boilOffRate: 1, trubChillerLoss: 0.5, coolingShrinkage: 4, kettleVolume: 7 });
assert.equal(v.postBoil, 6.25); assert.equal(v.preBoil, 7.25);
assert.match(v.warnings[0], /more than the kettle holds/);

clearTimeout(store._persistTimer);
console.log('schemas tests passed');
