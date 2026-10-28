// Vessel Templates and Bundled Fitting Templates (Fritz, 2026-10-21). Each Template is one small JSON file named by its
// Template Name. Two classes:
//   Skynet Templates: made by Skynet. The finished ones ship with the panel in templates/<kind>/ (an update replaces them).
//     While Skynet is still building them (SKYNET_LOCKED false), they can be made and changed in the app; those are kept in
//     config/templates/skynet/<kind>/ (never touched by an update) until they are sent in and put in templates/ on GitHub.
//     Once locked they are read only: no change, no delete, only Clone.
//   User Templates: config/templates/user/<kind>/, made, changed and deleted by Admins.
// The checks are made here on the Brain, so a Skynet Template can't be changed by any request once it is locked.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { newKey } from './keys.js';
import { TEMPLATE_KINDS, nameProblem, cleanVessel, cleanFitting, copyName, vesselBase } from '../public/templates.js';

// Skynet is still building its Templates (Fritz, 2026-10-21). Set to true, through GitHub, when they are finished:
// from then on Skynet Templates are read only and every new Template or clone is a User Template.
export const SKYNET_LOCKED = false;

const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const CLEAN = { vessel: cleanVessel, fitting: cleanFitting };

export class Templates {
  // shipped = the panel's templates/ folder, own = config/templates
  constructor(shipped, own, { locked = SKYNET_LOCKED } = {}) {
    this.locked = locked;
    this.dirs = { shipped, skynet: path.join(own, 'skynet'), user: path.join(own, 'user') };
  }
  kindOk(kind) { if (!TEMPLATE_KINDS[kind]) throw new Error('Unknown kind of Template "' + kind + '"'); }
  dir(where, kind) { return path.join(this.dirs[where], kind); }
  read(where, kind) {
    const d = this.dir(where, kind);
    if (!fs.existsSync(d)) return [];
    return fs.readdirSync(d).filter(f => f.endsWith('.json')).map(f => {
      // a shipped Template is read only: its hidden key comes from where it is and its name, which never change (lib/keys.js)
      try { const t = readJson(path.join(d, f)); return { ...t, name: f.slice(0, -5), where, _key: t._key || 't' + crypto.createHash('sha256').update(`${where}/${kind}/${f}`).digest('hex').slice(0, 16) }; } catch { return null; }
    }).filter(Boolean);
  }
  // every Template of a kind: Skynet ones first (one being built replaces a shipped one with the same name), then User ones
  list(kind) {
    this.kindOk(kind);
    const sky = new Map();
    for (const t of [...this.read('shipped', kind), ...this.read('skynet', kind)]) sky.set(t.name.toLowerCase(), t);
    const out = [...sky.values()].map(t => ({ ...t, cls: 'skynet' })).sort((a, b) => a.name.localeCompare(b.name));
    const user = this.read('user', kind).filter(t => !sky.has(t.name.toLowerCase())).map(t => ({ ...t, cls: 'user' })).sort((a, b) => a.name.localeCompare(b.name));
    return [...out, ...user].map(t => ({ ...t, editable: this.canEdit(t), deletable: this.canDelete(t) }));
  }
  find(kind, name) { return this.list(kind).find(t => t.name.toLowerCase() === String(name ?? '').toLowerCase()) || null; }
  get(kind, name) { const t = this.find(kind, name); if (!t) throw new Error(`No ${TEMPLATE_KINDS[kind]} "${name}"`); return t; }
  canEdit(t) { return t.cls === 'user' || !this.locked; }
  // a shipped Skynet Template can be changed while Skynet is building (the change is kept as its own copy), but never deleted
  canDelete(t) { return t.cls === 'user' || (!this.locked && t.where === 'skynet'); }

  // a new Template, a blank one or a clone of another. While Skynet is building, it is a Skynet Template unless asked otherwise.
  create(kind, name, { from, skynet } = {}) {
    this.kindOk(kind);
    name = String(name ?? '').trim();
    const bad = nameProblem(name); if (bad) throw new Error(bad);
    if (this.find(kind, name)) throw new Error(`There is already a ${TEMPLATE_KINDS[kind]} called "${name}"`);
    const base = from ? this.get(kind, from) : {};
    const where = !this.locked && skynet !== false ? 'skynet' : 'user';
    // a clone of a Skynet Vessel Widget (or of a Template built on one) is built on that Widget too
    const on = kind === 'vessel' && from ? vesselBase(base, this.list('vessel')) : undefined;
    return this.write(where, kind, name, { ...base, base: on, created: undefined, clonedFrom: from ? base.name : undefined, _key: newKey() });
  }
  // save changes; a new name renames it (and the Vessel Templates that use a renamed Bundled Fitting follow it)
  save(kind, name, body) {
    const t = this.get(kind, name);
    if (!this.canEdit(t)) throw new Error(`"${t.name}" is a Skynet Template: it can't be changed. Clone it to make your own.`);
    const to = String(body.name ?? t.name).trim();
    const bad = nameProblem(to); if (bad) throw new Error(bad);
    const other = this.find(kind, to);
    if (other && other.name.toLowerCase() !== t.name.toLowerCase()) throw new Error(`There is already a ${TEMPLATE_KINDS[kind]} called "${to}"`);
    const where = t.cls === 'user' ? 'user' : 'skynet';
    const saved = this.write(where, kind, to, { ...body, created: t.created, clonedFrom: t.clonedFrom, _key: t._key || newKey() });
    if (to !== t.name) {
      if (t.where !== 'shipped') fs.rmSync(this.file(t.where, kind, t.name), { force: true });
      if (kind === 'fitting') this.renameFittingUse(t.name, to);
    }
    return saved;
  }
  remove(kind, name) {
    const t = this.get(kind, name);
    if (!this.canDelete(t)) throw new Error(t.cls === 'skynet' ? `"${t.name}" is a Skynet Template: Skynet Templates can't be deleted.` : `"${t.name}" can't be deleted`);
    if (kind === 'fitting') {
      const users = this.list('vessel').filter(v => Object.values(v.ports || {}).some(p => p.fitting?.toLowerCase() === t.name.toLowerCase()));
      if (users.length) throw new Error(`"${t.name}" is on ${users.map(v => v.name).join(', ')}. Take it off ${users.length > 1 ? 'those Vessel Templates' : 'that Vessel Template'} first.`);
    }
    fs.rmSync(this.file(t.where, kind, t.name), { force: true });
  }
  renameFittingUse(from, to) {
    for (const v of this.list('vessel')) {
      if (!this.canEdit(v)) continue;
      let changed = false;
      for (const p of Object.values(v.ports || {})) if (p.fitting?.toLowerCase() === from.toLowerCase()) { p.fitting = to; changed = true; }
      if (changed) this.write(v.cls === 'user' ? 'user' : 'skynet', 'vessel', v.name, v);   // keeps its _key
    }
  }
  file(where, kind, name) { return path.join(this.dir(where, kind), name + '.json'); }
  write(where, kind, name, body) {
    // _key: the Template's hidden key (lib/keys.js), kept through renames; a clone gets its own
    const out = { ...CLEAN[kind](body), clonedFrom: body.clonedFrom || undefined, created: body.created || new Date().toISOString(), updated: new Date().toISOString(), _key: body._key || undefined };
    for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
    fs.mkdirSync(this.dir(where, kind), { recursive: true });
    fs.writeFileSync(this.file(where, kind, name), JSON.stringify(out, null, 2));
    return this.get(kind, name);
  }
  // what the panes show: both lists, and whether Skynet is still building
  view() { return { locked: this.locked, vessel: this.list('vessel'), fitting: this.list('fitting') }; }
  freeCopyName(kind, name) { return copyName(name, this.list(kind).map(t => t.name)); }
}
