// Schemas (Fritz, 2026-10-20): a Schema is one whole brewery setup: its tabs, devices, elements, pipes, probes, autostart
// list and the Equipment Profile each of its Tabs uses. Each one is kept in config/schemas/<id>.json and picked from the Schema dropdown
// at the top of the panel. The loaded Schema is the one in config/brewery.json; every save there is copied to its own file,
// so a Schema file always matches what you last saw. Panel settings (logins, MQTT, media folders, simulation, the lists
// behind the dropdowns) belong to the panel, not to a Schema, and stay as they are when another Schema is loaded.
// Processes (the scripts/ folder) are shared by every Schema.
// The Equipment Profile is not copied into a Schema: it is where the equipment and its piping are stored (Fritz, 2026-10-20).
// It belongs to a Tab, not to the whole Schema (Fritz, 2026-10-21): each Tab can have its own (workspace.equipmentProfile),
// usually one Tab for the Hot Side and one for Fermentation. The vessels, fittings, IPs, pipes and hoses on a Tab with a profile
// are saved into that profile file, and the Schema's own file keeps the rest (devices, elements, pictures, text, and the drawing
// on Tabs without a profile). Loading the Schema puts each profile's drawing back on its Tab, so a shared profile shows the same
// equipment and piping in every Schema that uses it. A Schema uses a profile on one Tab only.
import fs from 'node:fs';
import path from 'node:path';
import { slug, isEquipGraphic, lockedMsg } from './equipment.js';

export const SCHEMA_KEYS = ['title', 'devices', 'workspaces', 'elements', 'graphics', 'probes', 'autostart', 'beerxml', 'equipmentProfile', 'layoutFromProfile', 'sample', 'logSets'];
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
    const w = name ? ws.find(x => x.name === name) || ws.find(x => x.id === name) : ws.find(x => x.equipmentProfile) || ws.find(x => x.name === 'Equipment') || ws[0];
    if (!w) throw new Error(name ? `There is no Tab "${name}"` : 'This Schema has no Tabs');
    return w;
  }
  tabUsing(pid) { return profiled(this.store.config).find(w => w.equipmentProfile === pid) ?? null; }
  // a layout save sends the Tabs back as the page had them; which profile each Tab uses is changed only on the ☰ Menu
  keepTabProfiles(list) {
    const old = this.store.config.workspaces || [];
    for (const w of list || []) {
      const o = (w.id && old.find(x => x.id === w.id)) || old.find(x => x.name === w.name);
      delete w.equipmentProfile; delete w.layoutFromProfile;
      if (o?.equipmentProfile) { w.equipmentProfile = o.equipmentProfile; if (o.layoutFromProfile === false) w.layoutFromProfile = false; }
    }
    return list;
  }
  get active() { return this.store.config.schema ?? null; }
  file(id) { if (!/^[a-z0-9-]+$/.test(id ?? '')) throw new Error('Bad Schema id'); return path.join(this.dir, id + '.json'); }
  has(id) { try { return fs.existsSync(this.file(id)); } catch { return false; } }
  freeId(name) { const b = slug(name); let id = b, i = 2; while (this.has(id)) id = `${b}-${i++}`; return id; }
  freeName(name) {
    const taken = new Set(this.list().map(s => s.name.toLowerCase()));
    let n = name, i = 2; while (taken.has(n.toLowerCase())) n = `${name} ${i++}`; return n;
  }

  // the first start after this update: the setup you have becomes your first Schema
  ensure() {
    this.migrate();
    const c = this.store.config;
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
        return { id, name: s.name || id, tabProfiles, updated: s.updated, tabs: (s.workspaces || []).length, active: id === act };
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
    const out = { name: s.name, ...(s.version ? { version: s.version } : {}), updated: new Date().toISOString() };
    for (const k of SCHEMA_KEYS) if (c[k] !== undefined) out[k] = c[k];
    for (const w of profiled(c)) {                   // each Tab's equipment and piping go to its profile's Default Layout
      if (!this.profiles.has(w.equipmentProfile) || !followsLayout(w)) continue;
      out.graphics = (out.graphics || []).filter(g => !onTab(g, w.name));
      this.profiles.setDrawing(w.equipmentProfile, (c.graphics || []).filter(g => onTab(g, w.name)), w.name);
    }
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(s.id), JSON.stringify(out, null, 2));
  }
  // a locked profile on a Tab of the loaded Schema (that Tab, or any Tab); the layout and imports check this first
  lockedProfile(tab) {
    for (const w of profiled(this.store.config)) {
      if (tab && w.name !== tab) continue;
      if (!this.profiles.has(w.equipmentProfile)) continue;
      const p = this.profiles.get(w.equipmentProfile); if (p.locked) return p;
    }
    return null;
  }
  checkLayout(graphics) {
    if (!graphics) return;
    for (const w of profiled(this.store.config)) {
      const p = followsLayout(w) && this.lockedProfile(w.name); if (!p) continue;
      const now = JSON.stringify((this.store.config.graphics || []).filter(g => onTab(g, w.name))), next = JSON.stringify(graphics.filter(g => onTab(g, w.name)));
      if (now !== next) throw new Error(lockedMsg(p) + ` (Equipment, IPs, pipes and hoses on the Tab "${w.name}" belong to it.)`);
    }
  }
  // lock_Equipment / unlock_Equipment in a Process: every Equipment Profile on the loaded Schema's Tabs (a Brew Day locks them all)
  lock(on, by) {
    const ids = [...new Set(profiled(this.store.config).map(w => w.equipmentProfile).filter(id => this.profiles.has(id)))];
    if (!ids.length) throw new Error(`No Tab of the Schema "${this.active?.name}" has an Equipment Profile to ${on ? 'lock' : 'unlock'}`);
    if (on) this.mirror();                               // what is on screen now is what gets locked
    const names = ids.map(id => this.profiles.setLock(id, on, by).name);
    this.store.emit('config');
    return `Equipment Profile${names.length > 1 ? 's' : ''} ${names.map(n => `"${n}"`).join(', ')} ${on ? 'locked' : 'unlocked'}`;
  }
  // the 🔒 Locked switch on the Equipment Profile tab: one profile
  lockProfile(pid, on, by) {
    if (on && this.tabUsing(pid)) this.mirror();
    const p = this.profiles.setLock(pid, on, by);
    this.store.emit('config');
    return p;
  }

  // Load: stop the Processes, keep the values of the one being left, put the new Schema in config/brewery.json and
  // read it in again (with every check a normal start does), then restart the boards and its autostart Processes.
  // Each Schema keeps its own saved values (vKonstants, vAPI ...) in config/schemas/<id>.state.json.
  // Every output is switched off first (Fritz, 2026-10-21), and again once the new Schema is in, so it starts with
  // everything off whatever its saved start values say.
  load(id) {
    const s = readJson(this.file(id)), store = this.store, c = store.config;
    this.engine.stopAll();
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
    next.schema = { id, name: s.name || id, ...(s.version ? { version: s.version } : {}) };
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
  // The file is named after the Schema version (<Name>_yyyymmdd_hh_mm) when it has one, otherwise after the time now.
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

  // Add new Schema: a copy of the loaded one, or an empty one (a Main tab and the Equipment tab). It is loaded at once.
  create(name, { empty = false } = {}) {
    name = text(name); if (!name) throw new Error('Give the Schema a name');
    if (this.list().some(s => s.name.toLowerCase() === name.toLowerCase())) throw new Error(`There is already a Schema called "${name}"`);
    this.mirror();
    const id = this.freeId(name), c = this.store.config;
    const out = { name, created: new Date().toISOString() };
    if (empty) Object.assign(out, { title: name, workspaces: [{ name: 'Main' }, { name: 'Equipment', width: 1600, height: 900 }], elements: [], graphics: [], devices: [], probes: [], autostart: [] });
    else for (const k of SCHEMA_KEYS) if (c[k] !== undefined) out[k] = structuredClone(c[k]);
    if (!empty && c.title === c.schema?.name) out.title = name;
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(id), JSON.stringify(out, null, 2));
    if (!empty) { this.store.persistNow(); fs.copyFileSync(this.store.statePath, this.statePath(id)); }   // a copy starts with the same values
    return this.load(id);
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

  rename(id, name) {
    name = text(name); if (!name) throw new Error('Give the Schema a name');
    if (this.list().some(s => s.id !== id && s.name.toLowerCase() === name.toLowerCase())) throw new Error(`There is already a Schema called "${name}"`);
    if (id === this.active?.id) { this.store.config.schema.name = name; this.store.writeConfig(); this.store.emit('config'); return; }
    const s = readJson(this.file(id)); s.name = name; fs.writeFileSync(this.file(id), JSON.stringify(s, null, 2));
  }

  remove(id) {
    if (id === this.active?.id) throw new Error('This Schema is loaded. Load another Schema first, then delete this one.');
    const f = this.file(id); if (!fs.existsSync(f)) throw new Error('No such Schema');
    const bdir = path.join(this.dir, 'deleted'); fs.mkdirSync(bdir, { recursive: true });
    fs.renameSync(f, path.join(bdir, `${id}-${stamp()}.json`));      // kept, in case it was a mistake
  }

  // put each Tab's profile drawing on a Schema (a profile that is gone is taken off its Tab)
  drawTabs(c) {
    for (const w of profiled(c)) {
      if (!this.profiles.has(w.equipmentProfile)) { delete w.equipmentProfile; delete w.layoutFromProfile; continue; }
      if (followsLayout(w)) withDrawing(c, w.name, this.profiles.get(w.equipmentProfile));
    }
  }

  // Pick the Equipment Profile of one Tab of the loaded Schema. The equipment and piping on that Tab are first saved into the
  // profile it had. layout 'use' (the default): the profile's Default Layout goes on the Tab (a new profile with none takes
  // what is there). layout 'keep': the Tab stays exactly as it is, kept in this Schema, and the profile is not touched.
  setProfile(tab, pid, { layout = 'use' } = {}) {
    const c = this.store.config, w = this.tab(tab), old = w.equipmentProfile;
    if (pid && !this.profiles.has(pid)) throw new Error('No such Equipment Profile');
    if ((pid || null) === (old || null)) return { changed: false, tab: w.name };
    const twin = pid && profiled(c).find(x => x !== w && x.equipmentProfile === pid);
    if (twin) throw new Error(`"${this.profiles.get(pid).name}" is already used on the Tab "${twin.name}" of this Schema. A Schema uses an Equipment Profile on one Tab only. Add new can make a copy of it for this Tab.`);
    const locked = this.lockedProfile(w.name);
    if (locked) throw new Error(lockedMsg(locked));
    this.mirror();
    this.backup();
    let took = false;
    if (pid) {
      const p = this.profiles.get(pid);
      w.equipmentProfile = pid;
      if (layout === 'keep') w.layoutFromProfile = false;
      else {
        if (p.locked && !Array.isArray(p.graphics)) throw new Error(lockedMsg(p) + ' It has no Default Layout yet.');
        delete w.layoutFromProfile;
        if (Array.isArray(p.graphics)) withDrawing(c, w.name, p);   // its Default Layout replaces the one on the Tab
        else took = true;                                          // mirror() below makes the Tab's equipment its Default Layout
      }
    } else { delete w.equipmentProfile; delete w.layoutFromProfile; }   // no profile: the drawing stays on the Tab, in the Schema
    this.store.writeConfig(); this.store.emit('config');
    return { changed: true, took, tab: w.name };
  }
  // Default Layout tab, for one Tab: 'use' puts the profile's Default Layout on the Tab (and keeps them in step from now on);
  // 'save' makes the Tab's equipment and pipes the profile's Default Layout (other Schemas following it get them on load)
  layoutAction(tab, action) {
    const c = this.store.config, w = this.tab(tab), pid = w.equipmentProfile;
    if (!this.profiles.has(pid)) throw new Error(`The Tab "${w.name}" has no Equipment Profile`);
    const p = this.profiles.get(pid);
    if (p.locked) throw new Error(lockedMsg(p));
    this.backup();
    if (action === 'use') {
      if (!Array.isArray(p.graphics)) throw new Error(`"${p.name}" has no Default Layout yet. Use "Save this Tab's layout as the Default Layout" first.`);
      delete w.layoutFromProfile; withDrawing(c, w.name, p);
    } else if (action === 'save') delete w.layoutFromProfile;   // mirror() writes the Tab's equipment and pipes into the profile
    else if (action === 'keep') w.layoutFromProfile = false;
    else throw new Error('Unknown layout action');
    this.store.writeConfig(); this.store.emit('config');
    return { ok: true };
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

  // Schema backups (Fritz, 2026-10-20): one a day for every Schema, and one whenever you press "Back up now".
  // They go in config/schemas/backups/<id>/; the last KEEP_DAILY daily ones are kept, the ones made by hand are never removed.
  backupsDir(id) { this.file(id); return path.join(this.dir, 'backups', id); }
  backupSchema(id, why = 'manual') {
    if (id === this.active?.id) this.mirror();
    const dir = this.backupsDir(id), f = path.join(dir, why === 'daily' ? `${id}-daily-${today()}.json` : `${id}-${stamp()}.json`);
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(this.file(id), f);
    const st = f.replace(/\.json$/, '.state.json');
    if (id === this.active?.id) { this.store.persistNow(); fs.copyFileSync(this.store.statePath, st); }
    else if (fs.existsSync(this.statePath(id))) fs.copyFileSync(this.statePath(id), st);
    if (why === 'daily') {
      const old = fs.readdirSync(dir).filter(x => x.includes('-daily-') && !x.endsWith('.state.json')).sort().slice(0, -KEEP_DAILY);
      for (const x of old) { fs.rmSync(path.join(dir, x), { force: true }); fs.rmSync(path.join(dir, x.replace(/\.json$/, '.state.json')), { force: true }); }
    }
    return path.basename(f);
  }
  // run at start and every hour: any Schema without today's backup gets one
  dailyBackups() {
    const made = [];
    for (const s of this.list()) {
      const dir = this.backupsDir(s.id);
      if (fs.existsSync(path.join(dir, `${s.id}-daily-${today()}.json`))) continue;
      try { made.push(this.backupSchema(s.id, 'daily')); } catch { /* tried again next hour */ }
    }
    return made;
  }
  listBackups(id) {
    const list = (dir, version) => !fs.existsSync(dir) ? [] : fs.readdirSync(dir).filter(x => x.endsWith('.json') && !x.endsWith('.state.json'))
      .map(file => ({ file, daily: file.includes('-daily-'), ...(version ? { version: true } : {}), when: fs.statSync(path.join(dir, file)).mtime.toISOString() }));
    return [...list(this.backupsDir(id)), ...list(this.versionsDir(id), true)].sort((a, b) => b.when.localeCompare(a.when));
  }

  // Schema versions (Fritz, 2026-10-21): "Update Version" when a Schema is saved gives it the version <Schema name>_yyyymmdd_hh_mm
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
    if (!/^[\w.-]+\.json$/.test(file ?? '') || file.endsWith('.state.json')) throw new Error('Bad backup file name');
    const src = path.join(version ? this.versionsDir(id) : this.backupsDir(id), file);
    if (!fs.existsSync(src)) throw new Error('No such backup');
    this.backupSchema(id);
    const keep = readJson(this.file(id)).name;
    const d = readJson(src); d.name = keep;              // a renamed Schema keeps its new name
    fs.writeFileSync(this.file(id), JSON.stringify(d, null, 2));
    if (id === this.active?.id) {
      const st = src.replace(/\.json$/, '.state.json');
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
const KEEP_DAILY = 30;
// put a profile's drawing on one Tab of a Schema: the equipment and piping on that Tab are replaced, the other Tabs are not
// touched. A piece whose id or name is already used on another Tab gets a new one, so two profiles never clash.
function withDrawing(c, tab, p) {
  if (!Array.isArray(p.graphics)) return;
  const keep = (c.graphics || []).filter(g => !onTab(g, tab));
  c.graphics = [...keep, ...fresh(structuredClone(p.graphics).map(g => ({ ...g, workspace: tab })), keep, c.elements || [])];
}
const REFS = ['attachTo', 'from', 'to', 'onVessel'];      // the fields that point at another piece of the drawing
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
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
// <Schema name>_yyyymmdd_hh_mm on the Brain's clock; the file name swaps anything a file name can't hold for _
const two = n => String(n).padStart(2, '0');
export const versionName = (name, d = new Date()) => `${name}_${d.getFullYear()}${two(d.getMonth() + 1)}${two(d.getDate())}_${two(d.getHours())}_${two(d.getMinutes())}`;
export const versionFile = v => String(v).replace(/[^\w.-]+/g, '_') + '.json';
const stamp = () => new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
