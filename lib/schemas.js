// Schemas (Fritz, 2026-10-20): a Schema is one whole brewery setup: its tabs, devices, elements, pipes, probes, autostart
// list and which Equipment Profile it uses. Each one is kept in config/schemas/<id>.json and picked from the Schema dropdown
// at the top of the panel. The loaded Schema is the one in config/brewery.json; every save there is copied to its own file,
// so a Schema file always matches what you last saw. Panel settings (logins, MQTT, media folders, simulation, the lists
// behind the dropdowns) belong to the panel, not to a Schema, and stay as they are when another Schema is loaded.
// Processes (the scripts/ folder) are shared by every Schema.
// The Equipment Profile is not copied into a Schema: it is where the equipment and its piping are stored (Fritz, 2026-10-20).
// So when a Schema uses a profile, the vessels, IPs, pipes and hoses on its tabs are saved into the profile file, and its own
// file keeps the rest (devices, elements, pictures, text). Loading the Schema puts the profile's drawing back on its tabs, so a
// shared profile shows the same equipment and piping in every Schema that uses it.
import fs from 'node:fs';
import path from 'node:path';
import { slug, isEquipGraphic, lockedMsg } from './equipment.js';

export const SCHEMA_KEYS = ['title', 'devices', 'workspaces', 'elements', 'graphics', 'probes', 'autostart', 'beerxml', 'equipmentProfile', 'sample'];
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const text = (v, max = 80) => String(v ?? '').trim().slice(0, max);

export class Schemas {
  constructor(store, { engine, hw, profiles }) {
    this.store = store; this.engine = engine; this.hw = hw; this.profiles = profiles;
    this.dir = path.join(path.dirname(store.configPath), 'schemas');
    store.on('written', () => this.mirror());
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
        return { id, name: s.name || id, equipmentProfile: s.equipmentProfile ?? null, updated: s.updated, tabs: (s.workspaces || []).length, active: id === act };
      } catch { return null; }
    }).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
  }

  // copy the loaded Schema into its own file (after every save of config/brewery.json)
  mirror() {
    const c = this.store.config, s = c?.schema;
    if (!s?.id) return;
    const out = { name: s.name, updated: new Date().toISOString() };
    for (const k of SCHEMA_KEYS) if (c[k] !== undefined) out[k] = c[k];
    if (this.profiles.has(c.equipmentProfile)) {        // equipment and piping go to the profile
      const eq = (c.graphics || []).filter(isEquipGraphic);
      out.graphics = (c.graphics || []).filter(g => !isEquipGraphic(g));
      this.profiles.setDrawing(c.equipmentProfile, eq, tabsOf(c.workspaces, eq));
    }
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(s.id), JSON.stringify(out, null, 2));
  }
  // the loaded Schema's profile, if it is locked (the layout and imports check this before changing equipment or pipes)
  lockedProfile() {
    const pid = this.store.config.equipmentProfile;
    if (!this.profiles.has(pid)) return null;
    const p = this.profiles.get(pid); return p.locked ? p : null;
  }
  checkLayout(graphics) {
    const p = this.lockedProfile(); if (!p || !graphics) return;
    const now = JSON.stringify((this.store.config.graphics || []).filter(isEquipGraphic)), next = JSON.stringify(graphics.filter(isEquipGraphic));
    if (now !== next) throw new Error(lockedMsg(p) + ' (Equipment, IPs, pipes and hoses belong to it.)');
  }
  // lock_Equipment / unlock_Equipment in a Process, or the Lock switch on the Brewing page
  lock(on, by) {
    const pid = this.store.config.equipmentProfile;
    if (!this.profiles.has(pid)) throw new Error(`The Schema "${this.active?.name}" has no Equipment Profile to ${on ? 'lock' : 'unlock'}`);
    if (on) this.mirror();                               // what is on screen now is what gets locked
    const p = this.profiles.setLock(pid, on, by);
    this.store.emit('config');
    return `Equipment Profile "${p.name}" ${on ? 'locked' : 'unlocked'}`;
  }

  // Load: stop the Processes, keep the values of the one being left, put the new Schema in config/brewery.json and
  // read it in again (with every check a normal start does), then restart the boards and its autostart Processes.
  // Each Schema keeps its own saved values (vKonstants, vAPI ...) in config/schemas/<id>.state.json.
  load(id) {
    const s = readJson(this.file(id)), store = this.store, c = store.config;
    this.engine.stopAll();
    this.mirror();                                     // the one being left is saved as it is
    this.backup();
    store.persistNow();
    const old = this.active?.id;
    if (old) fs.copyFileSync(store.statePath, this.statePath(old));
    if (fs.existsSync(this.statePath(id))) fs.copyFileSync(this.statePath(id), store.statePath); else fs.writeFileSync(store.statePath, '{}');
    const next = { ...c };
    for (const k of SCHEMA_KEYS) delete next[k];
    for (const k of SCHEMA_KEYS) if (s[k] !== undefined) next[k] = s[k];
    next.schema = { id, name: s.name || id };
    next.workspaces ??= [{ name: 'Main' }];
    next.elements ??= []; next.graphics ??= []; next.devices ??= []; next.autostart ??= []; next.probes ??= [];
    if (next.equipmentProfile && !this.profiles.has(next.equipmentProfile)) delete next.equipmentProfile;
    if (next.equipmentProfile) withDrawing(next, this.profiles.get(next.equipmentProfile));
    next.chooseSample = false;
    fs.writeFileSync(store.configPath, JSON.stringify(next, null, 2));
    try { store.load(); } catch (e) {        // a broken Schema file: go back to the one we had
      fs.writeFileSync(store.configPath, JSON.stringify(c, null, 2)); store.load();
      throw new Error(`Schema "${s.name || id}" could not be loaded: ${e.message}`);
    }
    store.writeConfig();
    store.emit('config');
    this.hw.restart();
    for (const n of store.config.autostart) { try { this.engine.start(n, 'autostart'); } catch { /* shown on the Processes page */ } }
    return { ok: true, schema: store.config.schema };
  }
  statePath(id) { return path.join(this.dir, id + '.state.json'); }

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

  // A sample brewery comes in as a Schema of its own, so loading one never writes over the Schema you have
  startNew(name) {
    this.mirror();
    const c = this.store.config;
    if (c.schema?.id) { this.store.persistNow(); fs.copyFileSync(this.store.statePath, this.statePath(c.schema.id)); }
    const n = this.freeName(text(name) || 'Sample');
    c.schema = { id: this.freeId(n), name: n };
    delete c.equipmentProfile;
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

  // Pick the loaded Schema's Equipment Profile. The equipment and piping on its tabs are first saved into the profile it had.
  // A profile with a drawing puts its equipment and piping on the tabs instead; a new profile with none takes what is there.
  setProfile(pid) {
    const c = this.store.config, old = c.equipmentProfile;
    if (pid && !this.profiles.has(pid)) throw new Error('No such Equipment Profile');
    if ((pid || null) === (old || null)) return { changed: false };
    const locked = this.lockedProfile();
    if (locked) throw new Error(lockedMsg(locked));
    this.mirror();
    this.backup();
    let took = false;
    if (pid) {
      const p = this.profiles.get(pid);
      if (p.locked && !Array.isArray(p.graphics)) throw new Error(lockedMsg(p) + ' It has no equipment drawn yet.');
      c.equipmentProfile = pid;
      if (Array.isArray(p.graphics)) withDrawing(c, p);        // its drawing replaces the one on the tabs
      else took = true;                                        // mirror() below moves the tabs' equipment into it
    } else delete c.equipmentProfile;                          // no profile: the drawing stays on the tabs, in the Schema
    this.store.writeConfig(); this.store.emit('config');
    return { changed: true, took };
  }
  // which Schemas use each profile (one = unique to that Schema, more = shared)
  usedBy(pid) { return this.list().filter(s => s.equipmentProfile === pid).map(s => s.name); }
  // a deleted profile is taken off every Schema that used it; each keeps a copy of its drawing, so nothing vanishes
  dropProfile(pid, graphics = []) {
    for (const s of this.list().filter(s => s.equipmentProfile === pid)) {
      if (s.active) { delete this.store.config.equipmentProfile; this.store.writeConfig(); this.store.emit('config'); continue; }
      const f = this.file(s.id), d = readJson(f);
      delete d.equipmentProfile;
      d.graphics = [...(d.graphics || []).filter(g => !isEquipGraphic(g)), ...graphics];
      fs.writeFileSync(f, JSON.stringify(d, null, 2));
    }
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
    const dir = this.backupsDir(id);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(x => x.endsWith('.json') && !x.endsWith('.state.json')).sort().reverse()
      .map(file => ({ file, daily: file.includes('-daily-'), when: fs.statSync(path.join(dir, file)).mtime.toISOString() }));
  }
  // put a backup back: the Schema as it is now is backed up first, so a restore can be undone
  restore(id, file) {
    if (!/^[\w.-]+\.json$/.test(file ?? '') || file.endsWith('.state.json')) throw new Error('Bad backup file name');
    const src = path.join(this.backupsDir(id), file);
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
// the tabs a drawing sits on (kept with the profile, so a Schema without that tab gets it)
const tabsOf = (workspaces = [], eq) => workspaces.filter(w => eq.some(g => g.workspace === w.name));
// put a profile's drawing on a Schema: its own equipment and piping are replaced, and missing tabs are added
function withDrawing(c, p) {
  if (!Array.isArray(p.graphics)) return;
  c.graphics = [...(c.graphics || []).filter(g => !isEquipGraphic(g)), ...structuredClone(p.graphics)];
  c.workspaces ??= [];
  for (const w of p.tabs || []) if (!c.workspaces.some(x => x.name === w.name)) c.workspaces.push(structuredClone(w));
}
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const stamp = () => new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
