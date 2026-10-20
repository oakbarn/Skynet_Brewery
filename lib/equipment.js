// Equipment Profiles (Fritz, 2026-10-20): the sizes and losses of a brewery (BeerSmith style) plus the equipment it is
// built from (vessels, chillers, coils, filters, with their ports). They live on their own, in config/equipment/<id>.json,
// so any Schema can use any profile: one Schema alone (unique) or several Schemas (shared).
// The profile is also where the drawing of the equipment and its piping is kept (graphics: vessels, IPs, pipes and hoses, and
// the tabs they sit on). A Schema that uses the profile shows that drawing; it is not copied into the Schema (lib/schemas.js).
// A locked profile (by hand on the Brewing page, or lock_Equipment in a Process) can't be changed until it is unlocked.
import fs from 'node:fs';
import path from 'node:path';
import { EQUIP_FIELDS, UNIT_SYSTEMS, HEAT_KINDS, REPORT_UNITS } from '../public/brewcalc.js';

export const EQUIP_KINDS = ['vessel', 'pchiller', 'ccoil', 'herms', 'trub'];     // the equipment widgets a profile can hold
// the parts of a tab drawing that belong to the Equipment Profile: equipment and fittings, IPs, pipes and hoses
export const isEquipGraphic = g => ['vessel', 'ip', 'pipe'].includes(g?.kind);
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
export const slug = s => String(s ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'item';
const text = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const num = v => v === '' || v === null || v === undefined || !Number.isFinite(+v) ? undefined : +v;

export class EquipmentProfiles {
  constructor(dir) { this.dir = dir; }
  file(id) { if (!/^[a-z0-9-]+$/.test(id)) throw new Error('Bad profile id'); return path.join(this.dir, id + '.json'); }
  list() {
    if (!fs.existsSync(this.dir)) return [];
    return fs.readdirSync(this.dir).filter(f => f.endsWith('.json')).map(f => { try { return { ...readJson(path.join(this.dir, f)), id: f.slice(0, -5) }; } catch { return null; } })
      .filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
  }
  get(id) { const f = this.file(id); if (!fs.existsSync(f)) throw new Error('No Equipment Profile "' + id + '"'); return { ...readJson(f), id }; }
  has(id) { try { return !!id && fs.existsSync(this.file(id)); } catch { return false; } }
  freeId(name) { const b = slug(name); let id = b, i = 2; while (this.has(id)) id = `${b}-${i++}`; return id; }

  // a new profile: a blank one with the usual numbers, or a copy of another
  create(name, from) {
    name = text(name, 80); if (!name) throw new Error('Give the Equipment Profile a name');
    if (this.list().some(p => p.name.toLowerCase() === name.toLowerCase())) throw new Error(`There is already an Equipment Profile called "${name}"`);
    const base = from ? this.get(from) : blankProfile();
    const p = { ...structuredClone(base), name, created: new Date().toISOString() };
    delete p.locked; delete p.lockedBy; delete p.lockedAt;           // a copy starts unlocked
    return this.write(this.freeId(name), { ...cleanProfile(p), graphics: p.graphics, tabs: p.tabs, created: p.created });
  }

  // the settings and equipment list from the Brewing page; the drawing and the lock are kept as they are
  save(id, body) {
    const p = cleanProfile(body);
    if (this.list().some(o => o.id !== id && o.name.toLowerCase() === p.name.toLowerCase())) throw new Error(`There is already an Equipment Profile called "${p.name}"`);
    const old = this.has(id) ? this.get(id) : {};
    if (old.locked) throw new Error(lockedMsg(old));
    return this.write(id, { ...p, graphics: old.graphics, tabs: old.tabs, created: old.created });
  }
  write(id, p) {
    const out = { ...p, created: p.created ?? new Date().toISOString(), updated: new Date().toISOString() };
    delete out.id;
    for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(id), JSON.stringify(out, null, 2));
    return { ...out, id };
  }
  // the drawing of the equipment and piping (from the tabs of a Schema that uses this profile); written only when it changed
  setDrawing(id, graphics, tabs) {
    const p = this.get(id);
    if (p.locked) return false;
    if (JSON.stringify(p.graphics ?? []) === JSON.stringify(graphics) && JSON.stringify(p.tabs ?? []) === JSON.stringify(tabs)) return false;
    this.write(id, { ...p, graphics, tabs });
    return true;
  }
  setLock(id, on, by = '') {
    const p = this.get(id);
    if (!!p.locked === !!on) return p;
    if (on) Object.assign(p, { locked: true, lockedBy: text(by, 80), lockedAt: new Date().toISOString() });
    else { delete p.locked; delete p.lockedBy; delete p.lockedAt; }
    return this.write(id, p);
  }
  remove(id) { fs.rmSync(this.file(id), { force: true }); }
}

export function blankProfile(units = 'US') {
  const col = units === 'Metric' ? 5 : 4;
  return { name: '', notes: '', units, ...Object.fromEntries(EQUIP_FIELDS.map(f => [f[0], f[col]])), equipment: [] };
}
export const newItemId = () => 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function cleanProfile(b = {}) {
  const name = text(b.name, 80); if (!name) throw new Error('Give the Equipment Profile a name');
  const p = { name, notes: text(b.notes, 4000), units: UNIT_SYSTEMS[b.units] ? b.units : 'US' };
  for (const [k] of EQUIP_FIELDS) { const v = num(b[k]); if (v !== undefined) { if (v < 0) throw new Error(`${k} can't be below 0`); p[k] = v; } }
  const ids = new Set();
  p.equipment = (Array.isArray(b.equipment) ? b.equipment : []).map(e => {
    if (!EQUIP_KINDS.includes(e.vesselType)) throw new Error(`Equipment "${e.name}": unknown kind "${e.vesselType}"`);
    let id = /^[\w-]{1,40}$/.test(e.id ?? '') ? e.id : newItemId(); if (ids.has(id)) id = newItemId(); ids.add(id);
    const it = { id, vesselType: e.vesselType, name: text(e.name, 80) || 'Equipment', vtype: text(e.vtype, 80), label: text(e.label, 80), image: text(e.image, 300),
      bundled: e.bundled !== false, notes: text(e.notes, 2000), ports: {} };
    // Vessel tab (Fritz, 2026-10-20): size, dead space, extra trub loss; heat source and its device; the probe on the same board;
    // Other type; and for a fermenter its largest and smallest batch and how often its temperature is reported
    for (const k of ['volume', 'deadspace', 'extraTrub', 'maxVolume', 'minVolume', 'reportEvery']) { const v = num(e[k]); if (v !== undefined) { if (v < 0) throw new Error(`${it.name}: ${k} can't be below 0`); it[k] = v; } }
    let heatKind = e.heatKind;
    if (!heatKind && e.heat) heatKind = /gas/i.test(e.heat) ? 'gas' : /electric|element|induction/i.test(e.heat) ? 'electric' : /none/i.test(e.heat) ? 'unheated' : 'other';   // older free text
    if (HEAT_KINDS[heatKind]) it.heatKind = heatKind;
    for (const k of ['heatDevice', 'probe', 'otherHeat', 'otherType']) if (text(e[k], 80)) it[k] = text(e[k], 80);
    if (REPORT_UNITS[e.reportUnit]) it.reportUnit = e.reportUnit;
    for (const [k, q] of Object.entries(e.ports && typeof e.ports === 'object' ? e.ports : {})) {
      if (!/^\w{1,30}$/.test(k)) continue;
      it.ports[k] = { installed: !!q?.installed, position: text(q?.position, 60), standard: text(q?.standard, 60) };
    }
    return it;
  });
  return p;
}

export const lockedMsg = p => `The Equipment Profile "${p.name}" is locked${p.lockedBy ? ' (by ' + p.lockedBy + ')' : ''}. Unlock it on the Brewing page, or with unlock_Equipment in a Process, to change it.`;
// what the Brewing page shows for each profile (the drawing itself stays on the Brain; the page gets its size)
export function withVolumes(p) {
  const { graphics, tabs, ...rest } = p;
  return { ...rest, layoutTabs: (tabs || []).map(t => t.name), drawn: (graphics || []).filter(g => g.kind === 'vessel').length, pipes: (graphics || []).filter(g => g.kind === 'pipe').length, hasDrawing: Array.isArray(graphics) };
}
