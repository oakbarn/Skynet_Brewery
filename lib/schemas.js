// Schemas (Fritz, 2026-10-20): a Schema is one whole brewery setup: its tabs, devices, elements, pipes, probes, autostart
// list and the Equipment Profile each of its Tabs uses. Each one is kept in config/schemas/<id>.json and picked from the Schema dropdown
// at the top of the panel. The loaded Schema is the one in config/brewery.json; every save there is copied to its own file,
// so a Schema file always matches what you last saw. Panel settings (logins, MQTT, media folders, simulation, the lists
// behind the dropdowns) belong to the panel, not to a Schema, and stay as they are when another Schema is loaded.
// Processes (the processes/ folder) are shared by every Schema.
// The Equipment Profile is not copied into a Schema: it is where the equipment and its piping are stored (Fritz, 2026-10-20).
// It belongs to a Tab, not to the whole Schema (Fritz, 2026-10-21): each Tab can have its own (workspace.equipmentProfile),
// usually one Tab for the Hot Side and one for Fermentation. The vessels, fittings, IPs, pipes and hoses on a Tab with a profile
// are saved into that profile file, and the Schema's own file keeps the rest (devices, elements, pictures, text, and the drawing
// on Tabs without a profile). Loading the Schema puts each profile's drawing back on its Tab, so a shared profile shows the same
// equipment and piping in every Schema that uses it. A Schema uses a profile on one Tab only.
import fs from 'node:fs';
import path from 'node:path';
import { slug, isEquipGraphic, lockedMsg, isProfileDevice, SLOT_REF, slotLook, SLOT_FOLLOW, cleanProfile } from './equipment.js';
import { newKey, KEY, REF, FROM, OF } from './keys.js';
import { fileMinute, fileStamp } from './filedate.js';
import { fixValveLists } from './store.js';
import { connOf, realConnOf } from '../public/links.js';

export const SCHEMA_KEYS = ['title', 'devices', 'workspaces', 'elements', 'graphics', 'probes', 'autostart', 'beerxml', 'equipmentProfile', 'layoutFromProfile', 'sample', 'logSets', 'theme', 'lookUndo', 'effLog'];   // effLog: each brew's real Efficiency, kept by Schema (Rule 17.13)
// equipmentProfile and layoutFromProfile were Schema settings before the profile moved to the Tabs; an older Schema file that
// still has them is moved over when it is read (toTabs below), so they stay in this list
// workspace.layoutFromProfile false: this Tab keeps its own layout instead of the profile's Default Layout (Fritz, 2026-10-20)
const followsLayout = w => w.layoutFromProfile !== false;
// the Tabs that have an Equipment Profile
const profiled = c => (c.workspaces || []).filter(w => w.equipmentProfile);
const onTab = (g, tab) => isEquipGraphic(g) && g.workspace === tab;
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const text = (v, max = 80) => String(v ?? '').trim().slice(0, max);

export class Schemas {
  constructor(store, { engine, hw, profiles }) {
    this.store = store; this.engine = engine; this.hw = hw; this.profiles = profiles;
    this.dir = path.join(path.dirname(store.configPath), 'schemas');
    store.on('written', () => this.mirror());
  }
  // a Tab of the loaded Schema, by its name (or its Tab ID); no name: the Tab of the old Schema-wide profile, or the first one
  tab(name) {
    const ws = this.store.config.workspaces || [];
    const w = name ? ws.find(x => x.name === name) || ws.find(x => x.id === name) : ws.find(x => x.equip) || ws.find(x => x.name === 'Equipment') || ws[0];
    if (!w) throw new Error(name ? `There is no Tab "${name}"` : 'This Schema has no Tabs');
    return w;
  }
  tabUsing(pid) { return profiled(this.store.config).find(w => w.equipmentProfile === pid) ?? null; }
  // a layout save sends the Tabs back as the page had them; which profile each Tab uses is changed only on the ☰ Menu
  keepTabProfiles(list) {
    const old = this.store.config.workspaces || [];
    for (const w of list || []) {
      const o = (w.id && old.find(x => x.id === w.id)) || old.find(x => x.name === w.name);
      delete w.equipmentProfile; delete w.layoutFromProfile; delete w.equipLocked;      // no Profile link ever comes back (Rule 2.62)
      if (o?.equipLocked) w.equipLocked = o.equipLocked;                               // only lock_Equipment / unlock_Equipment change it
    }
    return list;
  }
  get active() { return this.store.config.schema ?? null; }
  file(id) { if (!/^[a-z0-9-]+$/.test(id ?? '')) throw new Error('Bad Schema id'); return path.join(this.dir, id + '.json'); }
  has(id) { try { return fs.existsSync(this.file(id)); } catch { return false; } }
  freeId(name) { const b = slug(name); let id = b, i = 2; while (this.has(id)) id = `${b}-${i++}`; return id; }
  freeName(name) {
    const taken = new Set(this.list().map(s => s.name.toLowerCase()));
    let n = name, i = 2; while (taken.has(n.toLowerCase())) n = `${name} #${i++}`; return n;      // Name #2 (Rules 9.13, 9.17)
  }

  // the first start after this update: the setup you have becomes your first Schema
  ensure() {
    this.migrate();
    const c = this.store.config;
    if (unlinkTabs(c, this.profiles)) this.store.writeConfig();       // its drawing is on its Tabs already (Rule 2.62)
    if (c.schema?.id && this.has(c.schema.id)) return false;
    const name = text(c.schema?.name) || text(c.title) || 'My Brewery';
    c.schema = { id: c.schema?.id && /^[a-z0-9-]+$/.test(c.schema.id) ? c.schema.id : this.freeId(name), name };
    this.store.writeConfig();          // mirror() writes the Schema file
    return true;
  }

  list() {
    if (!fs.existsSync(this.dir)) return [];
    const act = this.active?.id;
    return fs.readdirSync(this.dir).filter(f => f.endsWith('.json') && !f.endsWith('.state.json')).map(f => {
      try {
        const s = readJson(path.join(this.dir, f)), id = f.slice(0, -5);
        const tabProfiles = profiled(s).map(w => ({ tab: w.name, id: w.equipmentProfile }));
        if (s.equipmentProfile) tabProfiles.push({ tab: null, id: s.equipmentProfile });    // an older file, not moved over yet
        return { id, name: s.name || id, about: s.about || '', tabProfiles, updated: s.updated, tabs: (s.workspaces || []).length, active: id === act };
      } catch { return null; }
    }).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
  }

  // the other Schemas that still have a Device or Widget by one of these names: [{schema, name}] (renamed ones, lib/renames.js)
  usingNames(names, exceptId = this.active?.id) {
    const want = new Set(names), out = [];
    for (const s of this.list()) {
      if (s.id === exceptId) continue;
      try { for (const el of readJson(this.file(s.id)).elements || []) if (want.has(el.name)) out.push({ schema: s.name, name: el.name }); } catch { }
    }
    return out;
  }

  // copy the loaded Schema into its own file (after every save of config/brewery.json)
  mirror() {
    const c = this.store.config, s = c?.schema;
    if (!s?.id) return;
    const out = { name: s.name, ...(s.about ? { about: s.about } : {}), ...(s.version ? { version: s.version } : {}), updated: new Date().toISOString() };
    for (const k of SCHEMA_KEYS) if (c[k] !== undefined) out[k] = c[k];
    // nothing on a Tab goes back into an Equipment Profile (Rule 2.62): the Schema file keeps every Tab's drawing
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(s.id), JSON.stringify(out, null, 2));
  }
  // lock_Equipment / unlock_Equipment (a Brew Day locks the equipment while it runs): the lock is on the Tabs themselves now, never on
  // an Equipment Profile (Rule 2.62). A Tab with equipLocked keeps its equipment, IPs, pipes and hoses as they are until unlocked.
  // lockedProfile(tab): the lock of that Tab (or of any Tab), as { name, lockedBy } for the message
  lockedProfile(tab) {
    const w = (this.store.config.workspaces || []).find(x => x.equipLocked && (!tab || x.name === tab));
    return w ? { name: w.name, lockedBy: w.equipLocked.by || '', tabLock: true } : null;
  }
  checkLayout(graphics) {
    if (!graphics) return;
    for (const w of (this.store.config.workspaces || []).filter(x => x.equipLocked)) {
      const now = JSON.stringify((this.store.config.graphics || []).filter(g => onTab(g, w.name))), next = JSON.stringify(graphics.filter(g => onTab(g, w.name)));
      if (now !== next) throw new Error(tabLockedMsg(w));
    }
  }
  lock(on, by) {
    const c = this.store.config, tabs = (c.workspaces || []).filter(w => !w.build && (c.graphics || []).some(g => onTab(g, w.name) && g.kind === 'vessel'));
    if (!tabs.length) throw new Error(`No Tab of the Schema "${this.active?.name}" has equipment to ${on ? 'lock' : 'unlock'}`);
    for (const w of tabs) { if (on) w.equipLocked = { by: text(by, 80), at: new Date().toISOString() }; else delete w.equipLocked; }
    this.store.writeConfig(); this.store.emit('config');
    return `The equipment on ${tabs.map(w => `"${w.name}"`).join(', ')} ${on ? 'locked' : 'unlocked'}`;
  }
  // 🔒 Locked on a Tab's row of ☰ Menu > Equipment Profile: that Tab only (Rule 2.62)
  lockTab(tab, on, by) {
    const w = this.tab(tab);
    if (on) w.equipLocked = { by: text(by, 80), at: new Date().toISOString() }; else delete w.equipLocked;
    this.store.writeConfig(); this.store.emit('config');
    return `The equipment on "${w.name}" ${on ? 'locked' : 'unlocked'}`;
  }
  // the 🔒 Locked switch on the Equipment Profile tab locks that profile only (its numbers and drawing); it never touches a Tab
  lockProfile(pid, on, by) {
    const p = this.profiles.setLock(pid, on, by);
    this.store.emit('config');
    return p;
  }

  // Load: stop the Processes, keep the values of the one being left, put the new Schema in config/brewery.json and
  // read it in again (with every check a normal start does), then restart the boards and its autostart Processes.
  // Each Schema keeps its own saved values (gGlobals ...) in config/schemas/<id>.state.json.
  // Every output is switched off first (Fritz, 2026-10-21), and again once the new Schema is in, so it starts with
  // everything off whatever its saved start values say.
  load(id) {
    const s = readJson(this.file(id)), store = this.store, c = store.config;
    this.engine.stopAll();
    this.engine.resetFlow?.();                         // flow colors a Process set (Rule 5.21) start again at None
    this.hw.allOff?.();
    this.mirror();                                     // the one being left is saved as it is
    this.backup();
    store.persistNow();
    const old = this.active?.id;
    if (old) fs.copyFileSync(store.statePath, this.statePath(old));
    if (fs.existsSync(this.statePath(id))) fs.copyFileSync(this.statePath(id), store.statePath); else fs.writeFileSync(store.statePath, '{}');
    const next = { ...c };
    for (const k of SCHEMA_KEYS) delete next[k];
    for (const k of SCHEMA_KEYS) if (s[k] !== undefined) next[k] = s[k];
    next.schema = { id, name: s.name || id, ...(s.about ? { about: s.about } : {}), ...(s.version ? { version: s.version } : {}) };
    next.workspaces ??= [{ name: 'Main' }];
    next.elements ??= []; next.graphics ??= []; next.devices ??= []; next.autostart ??= []; next.probes ??= [];
    toTabs(next, this.profiles);
    this.drawTabs(next);
    next.chooseSample = false;
    fs.writeFileSync(store.configPath, JSON.stringify(next, null, 2));
    try { store.load(); } catch (e) {        // a broken Schema file: go back to the one we had
      fs.writeFileSync(store.configPath, JSON.stringify(c, null, 2)); store.load();
      throw new Error(`Schema "${s.name || id}" could not be loaded: ${e.message}`);
    }
    this.hw.allOff?.();
    store.writeConfig();
    store.emit('config');
    this.hw.restart();
    for (const n of store.config.autostart) { try { this.engine.start(n, 'autostart'); } catch { /* shown on the Processes page */ } }
    return { ok: true, schema: store.config.schema };
  }
  statePath(id) { return path.join(this.dir, id + '.state.json'); }

  // Schema.json (Fritz, 2026-10-21): save a Schema as one .json file on your own computer. It holds the Schema only (tabs,
  // devices, elements, pictures, pipes, probes, autostart list, Equipment Profile name), never the panel settings (logins,
  // MQTT, media folders). The equipment and piping kept in its Equipment Profile are put back in, so the file is complete.
  // The file is named after the Schema version (<Name>_yyyymmddThhmm) when it has one, otherwise after the time now.
  exportSchema(id) {
    if (id === this.active?.id) this.mirror();           // the loaded one as it is on screen now
    const s = readJson(this.file(id)), c = {};
    for (const k of SCHEMA_KEYS) if (s[k] !== undefined) c[k] = structuredClone(s[k]);
    c.workspaces ??= []; c.graphics ??= [];
    toTabs(c, this.profiles);
    this.drawTabs(c);
    const version = (id === this.active?.id && this.active.version) || s.version || versionName(s.name || id);
    return { file: versionFile(version), version, schema: { name: s.name || id, version, saved: new Date().toISOString(), ...c } };
  }

  // Open a Schema file (Fritz, 2026-11-06): a Schema saved by the BruControl Importer (in the Brewing folder's Import subfolder)
  // or by "Save as .json file" becomes a new Schema here. Its name is kept, with #2, #3 ... when that name is taken: an import
  // never writes over a Schema (OakBarn Brewery, 2026-11-13: "Use the Rule, just cannot overwrite a file", Rules 9.13, 9.17). It is not
  // loaded unless asked: loading it switches the panel to it. Processes are written by the caller (they are shared by all Schemas).
  addFromFile(schema, { from = '' } = {}) {
    let base = text(schema.name) || 'Imported_Schema', name = base, n = 2;
    const taken = nm => this.list().some(s => s.name.toLowerCase() === nm.toLowerCase());
    while (taken(name)) name = `${base} #${n++}`;
    const id = this.freeId(name);
    const out = { name, created: new Date().toISOString(), ...(from ? { importedFrom: from } : {}) };
    for (const k of SCHEMA_KEYS) if (schema[k] !== undefined) out[k] = structuredClone(schema[k]);
    out.workspaces ??= []; out.elements ??= []; out.graphics ??= []; out.devices ??= [];
    for (const el of out.elements) fixValveLists(el);       // a Tap water valve from the BruControl Import: Close List only, never Open (Rule 6.15)
    if (!out.title || out.title === schema.name) out.title = name;
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(id), JSON.stringify(out, null, 2));
    return { id, name };
  }

  // Add new Schema: a copy of the loaded one, or an empty one (a Main tab and the Equipment tab). It is loaded at once.
  create(name, { empty = false } = {}) {
    name = text(name); if (!name) throw new Error('Give the Schema a name');
    if (this.list().some(s => s.name.toLowerCase() === name.toLowerCase())) throw new Error(`There is already a Schema called "${name}"`);
    this.mirror();
    const id = this.freeId(name), c = this.store.config;
    const out = { name, created: new Date().toISOString() };
    // a new empty Schema starts with no Interface (OakBarn Brewery, 2026-11-14: "A Schema does not need an interface default. Users
    // can add devices. Those devices have the Interface on them"); ➕ Add new Interface… in an Add box makes the first one
    if (empty) Object.assign(out, { title: name, workspaces: [{ name: 'Main' }, { name: 'Equipment', width: 1600, height: 900 }], elements: [], graphics: [],
      devices: [], probes: [], autostart: [], ...(c.brewDefaults?.newSchemaLook ? { theme: c.brewDefaults.newSchemaLook } : {}) });      // Look of a New Schema (Default settings)
    else for (const k of SCHEMA_KEYS) if (c[k] !== undefined) out[k] = structuredClone(c[k]);
    if (!empty && c.title === c.schema?.name) out.title = name;
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(id), JSON.stringify(out, null, 2));
    if (!empty) { this.store.persistNow(); fs.copyFileSync(this.store.statePath, this.statePath(id)); }   // a copy starts with the same values
    return this.load(id);
  }

  // New Schema from an Equipment Profile (Rule 19.6 #2, OakBarn Brewery, 2026-11-17: "The reason to \"import\" and equipment Profiles is
  // to create a new Schema with its own Text Widgets, and Processes."; the Keg Cleaning Schema: "It would need to use the already wired
  // Arduino and assigned Ports and Pins"). The new Schema has one Tab, the profile's, which uses the profile (so its numbers and drawing
  // come too), with every board and every Device of the profile: their Names, Properties, Interfaces and Ports. No Processes, Text
  // Widgets, Timers or other Widgets come: the new Schema gets its own. It is loaded at once. A profile with no hardware kept yet (made
  // before this) brings its drawing only; its pumps and valves wait for their Ports, as before.
  fromProfile(name, pid) {
    name = text(name); if (!name) throw new Error('Give the Schema a name');
    if (this.list().some(s => s.name.toLowerCase() === name.toLowerCase())) throw new Error(`There is already a Schema called "${name}"`);
    if (!this.profiles.has(pid)) throw new Error('No such Equipment Profile');
    this.mirror();
    const p = this.profiles.get(pid), hw = structuredClone(p.hardware || {}), c = this.store.config;
    const tab = { name: text(p.tab) || 'Equipment', equip: equipCopy(p), width: hw.width || 1920, height: hw.height || 1040, ...(hw.tabId ? { id: hw.tabId } : {}) };
    const elements = (hw.elements || []).map(e => ({ ...e, workspace: tab.name }));
    tab.eqSlots = elements.map(e => e.eqSlot).filter(Boolean);
    const id = this.freeId(name);
    const out = { name, title: name, created: new Date().toISOString(), workspaces: [tab], elements, graphics: [], devices: hw.boards || [], probes: [], autostart: [],
      ...(c.brewDefaults?.newSchemaLook ? { theme: c.brewDefaults.newSchemaLook } : {}) };
    withDrawing(out, tab.name, p);      // its drawing is copied on; nothing links back to the profile (Rule 2.62)
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(id), JSON.stringify(out, null, 2));
    return this.load(id);
  }
  // every real Interface (USB, Ethernet, WiFi) in any Schema, once each by name: the ones a Schema Template can use (Fritz, 2026-11-07:
  // "Interfaces and Ports should be real ones that the User has"). One in Simulator mode keeps its real connection as realConnection.
  realInterfaces() {
    const out = new Map(), real = d => d && d.name && ((connOf(d) && connOf(d) !== 'simulator') || (realConnOf(d) && realConnOf(d) !== 'simulator'));
    const look = (devs, schema) => { for (const d of devs || []) if (real(d) && !out.has(d.name)) out.set(d.name, { ...structuredClone(d), schema }); };
    look(this.store.config.devices, this.active?.name);
    for (const s of this.list()) { try { look(readJson(this.file(s.id)).devices, s.name); } catch { } }
    return [...out.values()];
  }
  // a new empty Schema whose Interface is a copy of a real one (realInterfaces), not the pretend Mega
  useInterface(d) {
    if (!d) return;
    const { schema, ...copy } = structuredClone(d);
    this.store.config.devices = [copy]; this.store.writeConfig();
  }
  // Clone a Schema (Fritz, 2026-10-21): a copy of any Schema, loaded or not, with its saved values, under a new name.
  // The copy is only loaded when you ask for that; otherwise the loaded Schema stays as it is.
  clone(id, name, { load = false } = {}) {
    name = text(name); if (!name) throw new Error('Give the clone a name');
    if (this.list().some(s => s.name.toLowerCase() === name.toLowerCase())) throw new Error(`There is already a Schema called "${name}"`);
    const active = id === this.active?.id;
    if (active) { this.mirror(); this.store.persistNow(); }
    const src = readJson(this.file(id)), nid = this.freeId(name);
    const out = { ...src, name, created: new Date().toISOString(), clonedFrom: src.name || id };
    delete out.version; delete out.updated;              // a clone starts without a version of its own
    if (out.title === (src.name || id)) out.title = name;
    fs.writeFileSync(this.file(nid), JSON.stringify(out, null, 2));
    const st = active ? this.store.statePath : this.statePath(id);
    if (fs.existsSync(st)) fs.copyFileSync(st, this.statePath(nid));
    if (load) this.load(nid);
    return { id: nid, name };
  }

  // A sample brewery comes in as a Schema of its own, so loading one never writes over the Schema you have
  startNew(name) {
    this.mirror();
    const c = this.store.config;
    if (c.schema?.id) { this.store.persistNow(); fs.copyFileSync(this.store.statePath, this.statePath(c.schema.id)); }
    const n = this.freeName(text(name) || 'Sample');
    c.schema = { id: this.freeId(n), name: n };
    delete c.equipmentProfile; delete c.layoutFromProfile;
    for (const w of c.workspaces || []) { delete w.equipmentProfile; delete w.layoutFromProfile; }
    return c.schema;
  }

  // about: the one line "What is it for?" of the New Schema Interview (Rule 2.58); left out, it is not changed
  rename(id, name, about) {
    name = text(name); if (!name) throw new Error('Give the Schema a name');
    if (this.list().some(s => s.id !== id && s.name.toLowerCase() === name.toLowerCase())) throw new Error(`There is already a Schema called "${name}"`);
    const set = o => { o.name = name; if (about !== undefined) { const a = text(about, 200); if (a) o.about = a; else delete o.about; } };
    if (id === this.active?.id) { set(this.store.config.schema); this.store.writeConfig(); this.store.emit('config'); return; }
    const s = readJson(this.file(id)); set(s); fs.writeFileSync(this.file(id), JSON.stringify(s, null, 2));
  }

  remove(id) {
    if (id === this.active?.id) throw new Error('This Schema is loaded. Load another Schema first, then delete this one.');
    const f = this.file(id); if (!fs.existsSync(f)) throw new Error('No such Schema');
    const bdir = path.join(this.dir, 'deleted'); fs.mkdirSync(bdir, { recursive: true });
    fs.renameSync(f, path.join(bdir, `${id}-${stamp()}.json`));      // kept, in case it was a mistake
  }

  // put each Tab's profile drawing on a Schema (a profile that is gone is taken off its Tab)
  drawTabs(c) { return unlinkTabs(c, this.profiles, { draw: true }); }

  // Import an Equipment Profile onto a Tab of the loaded Schema (Rule 2.62, OakBarn Brewery, 2026-11-19: "A profile is only to import to
  // start a build. Nothing more."). only 'all' (the default): its Default Layout replaces the equipment and piping on the Tab; 'vessels'
  // or 'manifold' (Panel Update 5 #3): just that part is added to what the Tab has. Its numbers (Brewhouse Efficiency, losses, dead
  // space ...) are copied onto the Tab as the Tab's own defaults (equip), changed on the Tab from then on. Nothing links back: the Tab
  // does not even keep where it came from, and changing the profile later never changes the Tab.
  setProfile(tab, pid, { only = 'all' } = {}) {
    const c = this.store.config, w = this.tab(tab);
    if (!pid) return { changed: false, tab: w.name };
    if (!this.profiles.has(pid)) throw new Error('No such Equipment Profile');
    if (w.equipLocked) throw new Error(tabLockedMsg(w));
    const p = this.profiles.get(pid);
    this.mirror(); this.backup();
    if (Array.isArray(p.graphics)) {
      if (only === 'vessels' || only === 'manifold' || only === 'add') {      // 'add': all of it, beside what the Tab has
        const keep = c.graphics || [];
        c.graphics = [...keep, ...fresh(structuredClone(drawingPart(p.graphics, only)).map(g => ({ ...g, workspace: w.name })), keep, c.elements || [])];
      } else withDrawing(c, w.name, p);
    } else if (only !== 'all') throw new Error(`"${p.name}" has no Default Layout yet, so it has no ${only === 'vessels' ? 'vessels' : 'manifold'} to bring in.`);
    w.equip = equipCopy(p);
    // the profile's pumps and valves this Schema has not got yet: the Tab keeps its own copy of them until each gets its Port (Rule 19.6)
    const wait = only === 'vessels' ? [] : structuredClone((p.devices || []).filter(d => d?.slot && !(c.elements || []).some(e => e.eqSlot === d.slot)));
    if (wait.length) w.waitSlots = wait; else delete w.waitSlots;
    delete w.equipmentProfile; delete w.layoutFromProfile;
    this.store.writeConfig(); this.store.emit('config');
    return { changed: true, tab: w.name, waiting: wait.length };
  }
  // the Tab's own Equipment numbers (Brewhouse Efficiency, losses ...), changed on the Tab (Rule 2.62); they are only the Tab's
  setTabEquip(tab, body) {
    const w = this.tab(tab), was = w.equip || {};
    w.equip = { ...equipCopy({ ...was, ...body, equipment: body?.equipment ?? was.equipment }) };
    this.store.writeConfig(); this.store.emit('config');
    return w.equip;
  }
  // 💾 Save a Tab as an Equipment Profile: the Tab's equipment, piping and hardware, and the Tab's numbers, are copied into the profile
  // (Tab to Profile only, OakBarn Brewery, 2026-11-19: "Maybe a save of a Tab to Equiment Profile but that direction only"). The Tab
  // keeps no link to it.
  saveTabAsProfile(tab, pid) {
    const c = this.store.config, w = this.tab(tab);
    if (!this.profiles.has(pid)) throw new Error('No such Equipment Profile');
    const p = this.profiles.get(pid); if (p.locked) throw new Error(lockedMsg(p));
    const { graphics, devices } = toSlots(c, w.name, []);
    this.profiles.setDrawing(pid, structuredClone(graphics), w.name, devices, hardwareOf(c, w));
    if (w.equip) this.profiles.save(pid, { ...this.profiles.get(pid), ...w.equip, name: p.name });
    this.store.writeConfig();
    return { ok: true };
  }
  layoutAction(tab, action, pid) {
    if (action === 'save') return this.saveTabAsProfile(tab, pid);
    if (action === 'use') return this.setProfile(tab, pid);
    throw new Error('Unknown layout action');
  }
  // which Schemas use each profile (one = unique, more = shared), and on which Tab
  usedOn(pid) { return this.list().flatMap(s => s.tabProfiles.filter(t => t.id === pid).map(t => ({ schema: s.name, tab: t.tab, active: s.active }))); }
  usedBy(pid) { return [...new Set(this.usedOn(pid).map(u => u.schema))]; }
  // a deleted profile is taken off every Tab that used it; each keeps a copy of its drawing, so nothing vanishes
  dropProfile(pid, graphics = []) {
    for (const s of this.list().filter(s => s.tabProfiles.some(t => t.id === pid))) {
      if (s.active) {
        for (const w of profiled(this.store.config)) if (w.equipmentProfile === pid) { delete w.equipmentProfile; delete w.layoutFromProfile; }
        this.store.writeConfig(); this.store.emit('config'); continue;
      }
      const f = this.file(s.id), d = readJson(f);
      d.graphics ??= [];
      toTabs(d, this.profiles);
      for (const w of profiled(d)) {
        if (w.equipmentProfile !== pid) continue;
        if (followsLayout(w)) withDrawing(d, w.name, { graphics });
        delete w.equipmentProfile; delete w.layoutFromProfile;
      }
      fs.writeFileSync(f, JSON.stringify(d, null, 2));
    }
  }

  // Equipment Profiles moved from the Schema to its Tabs (Fritz, 2026-10-21). On the first start after that update every Schema
  // file is moved over while the profiles still hold their old drawings (so a Schema keeps every piece it showed), then each
  // profile keeps the drawing of one Tab: the Equipment Tab, or the Tab with the most equipment.
  migrate() {
    const c = this.store.config;
    const old = this.profiles.list().filter(p => Array.isArray(p.tabs) && !p.tab);
    const schemaWide = !!c.equipmentProfile || this.list().some(s => s.tabProfiles.some(t => t.tab === null));
    if (!old.length && !schemaWide) return false;
    for (const s of this.list()) {
      if (s.active || !s.tabProfiles.some(t => t.tab === null)) continue;
      const f = this.file(s.id), d = readJson(f);
      d.workspaces ??= []; d.graphics ??= [];
      toTabs(d, this.profiles);
      fs.writeFileSync(f, JSON.stringify(d, null, 2));
    }
    if (c.equipmentProfile) toTabs(c, this.profiles, { drawn: true });   // the loaded Schema already shows its drawing
    for (const p of old) {
      const tab = mainTab(p.graphics || [], (p.tabs || []).map(t => t.name));
      this.profiles.write(p.id, { ...Object.fromEntries(Object.entries(p).filter(([k]) => k !== 'tabs' && k !== 'id')), tab, graphics: (p.graphics || []).filter(g => g.workspace === tab) });
    }
    if (c.schema?.id) this.store.writeConfig();
    return true;
  }

  // Schema backups (OakBarn Brewery, 2026-11-13, Rule 9.17: "If we save a Back up every time a change is made and saved, the daily
  // backup is not needed"): the Schema as it was before each saved change (Edit layout > Save Changes, a Schema.json save, a restore),
  // and one whenever you press "Back up now". Named after the Schema, <Schema name>_yyyymmddThhmm.BacUp, in
  // config/schemas/backups/<id>/; a backup never overwrites another (a second one in the same minute gets _2). None is ever removed.
  backupsDir(id) { this.file(id); return path.join(this.dir, 'backups', id); }
  backupSchema(id) {
    if (id === this.active?.id) this.mirror();
    const dir = this.backupsDir(id), base = backupBase(readJson(this.file(id)).name || id);
    fs.mkdirSync(dir, { recursive: true });
    let f = path.join(dir, base + BACKUP_EXT);
    for (let i = 2; fs.existsSync(f); i++) f = path.join(dir, `${base}_${i}${BACKUP_EXT}`);
    fs.copyFileSync(this.file(id), f);
    const st = stateOf(f);
    if (id === this.active?.id) { this.store.persistNow(); fs.copyFileSync(this.store.statePath, st); }
    else if (fs.existsSync(this.statePath(id))) fs.copyFileSync(this.statePath(id), st);
    return path.basename(f);
  }
  listBackups(id) {
    const list = (dir, version) => !fs.existsSync(dir) ? [] : fs.readdirSync(dir).filter(x => isBackupFile(x))
      .map(file => ({ file, ...(version ? { version: true } : {}), when: fs.statSync(path.join(dir, file)).mtime.toISOString() }));
    return [...list(this.backupsDir(id)), ...list(this.versionsDir(id), true)].sort((a, b) => b.when.localeCompare(a.when));
  }

  // Schema versions (Fritz, 2026-10-21): "Update Version" when a Schema is saved gives it the version <Schema name>_yyyymmddThhmm
  // (the Brain's clock) and keeps a copy under that file name in config/schemas/versions/<id>/. Old versions are never removed.
  // The working file stays config/schemas/<id>.json, so loading, backups and restore work as before.
  versionsDir(id) { this.file(id); return path.join(this.dir, 'versions', id); }
  newVersion(id = this.active?.id) {
    if (!id || id !== this.active?.id) throw new Error('Only the loaded Schema can get a new version');
    const c = this.store.config, version = versionName(c.schema.name);
    c.schema.version = version;
    this.store.writeConfig();                            // mirror() writes the version into config/schemas/<id>.json
    const dir = this.versionsDir(id), f = path.join(dir, versionFile(version));
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(this.file(id), f);
    this.store.persistNow(); fs.copyFileSync(this.store.statePath, f.replace(/\.json$/, '.state.json'));
    this.store.emit('config');
    return { version, file: path.basename(f) };
  }

  // put a backup (or a saved version) back: the Schema as it is now is backed up first, so a restore can be undone
  restore(id, file, { version = false } = {}) {
    if (!/^[\w.-]+$/.test(file ?? '') || !isBackupFile(file)) throw new Error('Bad backup file name');
    const src = path.join(version ? this.versionsDir(id) : this.backupsDir(id), file);
    if (!fs.existsSync(src)) throw new Error('No such backup');
    this.backupSchema(id);
    const keep = readJson(this.file(id)).name;
    const d = readJson(src); d.name = keep;              // a renamed Schema keeps its new name
    fs.writeFileSync(this.file(id), JSON.stringify(d, null, 2));
    if (id === this.active?.id) {
      const st = stateOf(src);
      this.store.persistNow();
      fs.copyFileSync(fs.existsSync(st) ? st : this.store.statePath, this.statePath(id));
      this.engine.stopAll();
      const was = this.store.config.schema;
      this.store.config.schema = null;                  // so load() does not save the current one over the restored file
      try { return this.load(id); } catch (e) { this.store.config.schema = was; this.store.writeConfig(); throw e; }
    }
  }

  backup() {
    const dir = path.join(path.dirname(this.store.configPath), 'backups');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `brewery-${stamp()}.json`), JSON.stringify(this.store.config, null, 2));
  }
}
const BACKUP_EXT = '.BacUp';
const backupBase = name => `${String(name).replace(/[^\w.-]+/g, '_')}_${fileMinute()}`;
// a backup or a saved version (not its saved values); older backups end in .json
const isBackupFile = x => (x.endsWith(BACKUP_EXT) && !x.endsWith('.state' + BACKUP_EXT)) || (x.endsWith('.json') && !x.endsWith('.state.json'));
const stateOf = f => f.endsWith(BACKUP_EXT) ? f.slice(0, -BACKUP_EXT.length) + '.state' + BACKUP_EXT : f.replace(/\.json$/, '.state.json');
// put a profile's drawing on one Tab of a Schema: the equipment and piping on that Tab are replaced, the other Tabs are not
// touched. A piece whose id or name is already used on another Tab gets a new one, so two profiles never clash.
// a part of a Default Layout (Panel Update 5 #3): 'vessels' is every vessel and piece of equipment with what is joined to it (its IPs
// and the fittings on its ports); 'manifold' is the rest (valves, valve tees, supply manifolds, IPs, fittings). A pipe or hose comes
// only when every piece it is joined to comes too.
export function drawingPart(graphics, only) {
  if (only !== 'vessels' && only !== 'manifold') return graphics;
  const ids = new Set(graphics.map(g => g.id)), vs = new Set(graphics.filter(g => g.kind === 'vessel' && g.vesselType !== 'bfit').map(g => g.id));
  for (let grew = true; grew;) {
    grew = false;
    for (const g of graphics) { const up = g.attachTo ?? g.onVessel; if (g.kind !== 'pipe' && !vs.has(g.id) && up && vs.has(up)) { vs.add(g.id); grew = true; } }
  }
  const take = new Set(graphics.filter(g => g.kind !== 'pipe' && (only === 'vessels') === vs.has(g.id)).map(g => g.id));
  const pipeOk = g => REFS.every(k => { const v = String(g[k] ?? ''); if (!v) return true; if (v.startsWith('dev:')) return only === 'manifold';
    const hit = v.split(':').filter(x => ids.has(x)); return hit.every(x => take.has(x)); });
  return graphics.filter(g => g.kind === 'pipe' ? pipeOk(g) : take.has(g.id));
}
// Rule 2.62 (OakBarn Brewery, 2026-11-19: "Templates are only for a Placement on a Tab for Building and nothing else associated with a Tab
// or any of its chilcren"; "I want ZERO connection after placed on Tab"): a Tab keeps no link to an Equipment Profile. A Tab that still
// has one (a Schema saved before) gets the profile's drawing (when it followed it) and its numbers copied on, then the link goes.
export const equipCopy = p => { const { name, ...rest } = cleanProfile({ ...p, name: p.name || 'Equipment' }); return rest; };
export function unlinkTabs(c, profiles, { draw = false } = {}) {
  let n = 0;
  for (const w of profiled(c)) {
    const p = profiles?.has(w.equipmentProfile) ? profiles.get(w.equipmentProfile) : null;
    if (p) {
      if (draw && followsLayout(w)) withDrawing(c, w.name, p);
      if (!w.equip) w.equip = equipCopy(p);
      const wait = followsLayout(w) ? (p.devices || []).filter(d => d?.slot && !(c.elements || []).some(e => e.eqSlot === d.slot)) : [];
      if (wait.length) w.waitSlots = structuredClone(wait);
    }
    delete w.equipmentProfile; delete w.layoutFromProfile; n++;
  }
  return n;
}
export const tabLockedMsg = w => `The equipment on the Tab "${w.name}" is locked${w.equipLocked?.by ? ' (by ' + w.equipLocked.by + ')' : ''}. A Brew Day locks it while it runs; unlock_Equipment in a Process unlocks it.`;
function withDrawing(c, tab, p) {
  if (!Array.isArray(p.graphics)) return;
  const keep = (c.graphics || []).filter(g => !onTab(g, tab));
  c.graphics = [...keep, ...fresh(structuredClone(p.graphics).map(g => ({ ...g, workspace: tab })), keep, c.elements || [])];
  fromSlots(c, tab, p);
}
// The pumps and valves on a profile's Tab become the profile's slots (Rule 19.6): each Device gets a slot key once (a meaningless key,
// Design Rule 2), and the pipes on the Tab point at the slot instead of the Device's name, which has this Schema's Interface and Port.
// A slot of the profile this Schema has not got yet (no Port given here) stays in the profile (Design Rule 1: never take away); a slot this
// Schema had and its Device was deleted goes. The Tab remembers the slots it has had (eqSlots) to tell the two apart.
export function toSlots(c, tab, prev = []) {
  const els = (c.elements || []).filter(e => e.workspace === tab && isProfileDevice(e));
  let made = 0;
  for (const e of els) if (!e.eqSlot) { e.eqSlot = newKey(); made++; }
  const w = (c.workspaces || []).find(x => x.name === tab), had = new Set(w?.eqSlots || []), now = new Set(els.map(e => e.eqSlot));
  const kept = (prev || []).filter(d => d?.slot && !now.has(d.slot) && !had.has(d.slot));
  if (w && [...now].some(k => !had.has(k))) { w.eqSlots = [...had, ...[...now].filter(k => !had.has(k))]; made++; }
  const slotOf = new Map(els.map(e => [e.name, e.eqSlot]));
  const ref = v => { const m = /^dev:(.+):(\w+)$/.exec(v ?? ''); return m && slotOf.has(m[1]) ? `dev:@${slotOf.get(m[1])}:${m[2]}` : v; };
  const graphics = (c.graphics || []).filter(g => onTab(g, tab)).map(g => g.kind === 'pipe' && (String(g.from).startsWith('dev:') || String(g.to).startsWith('dev:')) ? { ...g, from: ref(g.from), to: ref(g.to) } : g);
  return { graphics, devices: [...els.map(e => ({ slot: e.eqSlot, look: slotLook(e) })), ...kept], made };
}
// All the physical hardware of a profile's Tab (Rule 19.6 #2, OakBarn Brewery, 2026-11-17: "An equipment profile would be all the
// Brewery Hardware, including the Interfaces, Ports and Wiring"; "Yes all the Properties would come"): every Device on a board on the
// Tab (pumps, valves, heaters, probes ...) with all its Properties, its Name, its Interface and Port, and the Interfaces (boards) they
// are on. Kept in the profile so it can be pasted onto a Tab or start a new Schema. Hidden keys never go into it (a paste gets its own).
const NO_KEYS = [KEY, REF, FROM, OF, 'buildTo', '_old'];
const noKeys = x => JSON.parse(JSON.stringify(x, (k, v) => NO_KEYS.includes(k) ? undefined : v));
// A Widget with IPs is real world hardware too, even with no board (OakBarn Brewery, 2026-11-17: "Equipment Profile only includes real
// world things (like Widgets with IPs) and no other Widgets like Text Boxes or such.  No Switches."; "any widget with an IP Can be added.
// Text Widgets and Like CANNOT be added"): a manual pump, a pump or valve not
// wired yet, a proportional valve, an inline sensor or flow meter, a probe tee or thermowell. Never a Text Box, Switch, Timer or Process.
const withIps = e => e.type === 'manualPump' || ['pump', 'valve', 'propValve', 'probeTee', 'thermowell'].includes(e.subtype) || e.type === 'flowMeter' || e.inline === true;
const isHardware = e => (e.device !== undefined && e.device !== '') || withIps(e);
export function hardwareOf(c, w) {
  const elements = (c.elements || []).filter(e => e.workspace === w.name && isHardware(e)).map(noKeys);
  const used = new Set(elements.map(e => e.device));
  const boards = (c.devices || []).filter(d => used.has(d.name)).map(noKeys);
  return { tabId: w.id, width: w.width, height: w.height, boards, elements };
}
// and back: a slot this Schema has (a Device with that slot key) takes the profile's place and pictures, and its pipes point at it
// again. A slot this Schema has not got yet keeps its "dev:@slot" ends until its Port is given (Equipment Profile tab, Rule 19.6).
export function fromSlots(c, tab, p) {
  const byslot = new Map((c.elements || []).filter(e => e.eqSlot).map(e => [e.eqSlot, e]));
  for (const d of p.devices || []) {
    const e = byslot.get(d.slot); if (!e) continue;
    for (const k of SLOT_FOLLOW) if (d.look[k] !== undefined) e[k] = d.look[k]; else if (k !== 'x' && k !== 'y') delete e[k];
    e.workspace = tab;
  }
  for (const g of c.graphics || []) if (g.kind === 'pipe' && g.workspace === tab) for (const k of ['from', 'to']) {
    const m = SLOT_REF.exec(g[k] ?? ''); if (m && byslot.has(m[1])) g[k] = `dev:${byslot.get(m[1]).name}:${m[2]}`;
  }
}
const REFS = ['attachTo', 'from', 'to', 'onVessel', 'capOn', 'qdOn', 'chillerOn'];      // the fields that point at another piece of the drawing
function fresh(add, keep, elements) {
  const ids = new Set(keep.map(g => g.id)), names = new Set([...keep, ...elements].map(x => x.name).filter(Boolean).map(n => n.toLowerCase())), map = {};
  for (const g of add) if (ids.has(g.id)) { let n; do n = 'g' + Math.random().toString(36).slice(2, 10); while (ids.has(n)); map[g.id] = n; g.id = n; }
  for (const g of add) {
    for (const k of REFS) if (map[g[k]]) g[k] = map[g[k]];
    if (g.name && names.has(g.name.toLowerCase())) { const b = g.name; let i = 2; while (names.has(`${b}_${i}`.toLowerCase())) i++; g.name = `${b}_${i}`; }
    if (g.name) names.add(g.name.toLowerCase());
    ids.add(g.id);
  }
  return add;
}
// an older Schema file (or the loaded Schema) with one profile for the whole Schema: the profile goes on one Tab. Unless the
// drawing is already on the Tabs, the profile's old drawing is put back first, so every piece it showed stays in the Schema.
function toTabs(c, profiles, { drawn = false } = {}) {
  const pid = c.equipmentProfile, follows = c.layoutFromProfile !== false;
  delete c.equipmentProfile; delete c.layoutFromProfile;
  if (!pid || !profiles.has(pid)) return;
  const p = profiles.get(pid);
  c.workspaces ??= []; c.graphics ??= [];
  if (follows && !drawn && Array.isArray(p.graphics)) {
    c.graphics = [...c.graphics.filter(g => !isEquipGraphic(g)), ...structuredClone(p.graphics)];
    for (const t of p.tabs || []) if (!c.workspaces.some(x => x.name === t.name)) c.workspaces.push(structuredClone(t));
  }
  const names = c.workspaces.map(w => w.name);
  let tab = p.tab && names.includes(p.tab) ? p.tab : mainTab(p.graphics || [], (p.tabs || []).map(t => t.name).filter(n => names.includes(n)));
  if (!names.includes(tab)) tab = mainTab(c.graphics, names);
  if (profiled(c).some(w => w.equipmentProfile === pid)) return;
  let w = c.workspaces.find(x => x.name === tab);
  if (!w) { w = { name: tab || 'Equipment' }; c.workspaces.push(w); }
  w.equipmentProfile = pid; if (!follows) w.layoutFromProfile = false;
}
// the Tab that holds a drawing: the Equipment Tab when it has equipment, else the one with the most, else the first one named
function mainTab(graphics, names = []) {
  const count = {};
  for (const g of graphics) if (g.kind === 'vessel') count[g.workspace] = (count[g.workspace] || 0) + 1;
  if (count.Equipment) return 'Equipment';
  const best = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
  return best?.[0] ?? (names.includes('Equipment') ? 'Equipment' : names[0] ?? 'Equipment');
}
// <Schema name>_yyyymmddThhmm (ISO 8601) on the Brain's clock; the file name swaps anything a file name can't hold for _
// Versions saved before 2026-10-23 are called <Schema name>_yyyymmdd_hh_mm and keep that name.
export const versionName = (name, d = new Date()) => `${name}_${fileMinute(d)}`;
export const versionFile = v => String(v).replace(/[^\w.-]+/g, '_') + '.json';
const stamp = () => fileStamp();
