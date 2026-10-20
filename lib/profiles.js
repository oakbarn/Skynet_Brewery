// Mash Profiles and Boil Profiles (Fritz, 2026-10-20), picked from the Menu. Each is a small file in config/profiles/<kind>/<id>.json,
// shared by every Schema. A Recipe picks one of each from a dropdown (stage B); the Menu's Default tab says which a new
// Recipe starts with.
import fs from 'node:fs';
import path from 'node:path';
import { slug } from './equipment.js';
import { SPARGE, MASH_STEPS, UNIT_SYSTEMS } from '../public/brewcalc.js';

const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const text = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const num = (v, what) => {
  if (v === '' || v === null || v === undefined) return undefined;
  if (!Number.isFinite(+v) || +v < 0) throw new Error(`${what} must be a number, 0 or more`);
  return +v;
};

// Tab Background Profile (Fritz, 2026-10-20): the tab's background color, and the look a new device or widget on that tab starts
// with (name and value colors and place, and how the value shows). Valve Profile: the pictures and orientation a new valve starts with.
export const ALIGNS = ['TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight'];
export const VALUE_TYPES = { led: 'LED (push button)', text: 'Text', gauge: 'Gauge (digits)' };
export const LED_MODES = { locking: 'Locking (press: ON, press again: OFF)', momentary: 'Momentary (ON only while held)' };
export const ORIENTATIONS = { h: 'Horizontal', v: 'Vertical', l45: '45 degrees Left', r45: '45 degrees Right' };

export const PROFILE_KINDS = {
  mash: { title: 'Mash Profile', blank: units => ({ units, steps: [{ name: 'Saccharification', temp: units === 'Metric' ? 67 : 152, time: 60 }], mashOutTemp: undefined, sparge: 'batch', spargeTemp: units === 'Metric' ? 77 : 170, batchRest: 10 }), clean: cleanMash },
  boil: { title: 'Boil Profile', blank: units => ({ units, boilTime: 60, boilOffRate: units === 'Metric' ? 4 : 1 }), clean: cleanBoil },
  tab: { title: 'Tab Background Profile', noUnits: true, blank: () => ({ valueType: 'text', ledMode: 'locking' }), clean: cleanTab },
  valve: { title: 'Valve Profile', noUnits: true, blank: () => ({ imageOpen: 'Images/Valve_Ball_OpenV-1x1.png', imageClosed: 'Images/Valve_Ball_ClosedV-1x1.png', orientation: 'v' }), clean: cleanValve },
};

function cleanMash(b) {
  const steps = (Array.isArray(b.steps) ? b.steps : []).filter(s => s && (text(s.name) || s.temp !== undefined && s.temp !== '' || s.time !== undefined && s.time !== ''))
    .slice(0, MASH_STEPS).map((s, i) => ({ name: text(s.name, 60) || `Step ${i + 1}`, temp: num(s.temp, `Step ${i + 1} temperature`), time: num(s.time, `Step ${i + 1} time`) }));
  if (!steps.length) throw new Error('A Mash Profile needs at least one step');
  const sparge = SPARGE[b.sparge] ? b.sparge : 'batch';
  return { steps, sparge, spargeTemp: num(b.spargeTemp, 'Sparge water temperature'), batchRest: sparge === 'batch' ? num(b.batchRest, 'Batch sparge rest time') : undefined, mashOutTemp: num(b.mashOutTemp, 'Mash out temperature') };
}
function cleanBoil(b) {
  const boilTime = num(b.boilTime, 'Total boil time'); if (!boilTime) throw new Error('Give the total boil time in minutes');
  return { boilTime, boilOffRate: num(b.boilOffRate, 'Boil off per hour') ?? 0 };
}

function cleanTab(b) {
  const color = k => text(b[k], 40) || undefined, align = k => ALIGNS.includes(b[k]) ? b[k] : undefined;
  const valueType = VALUE_TYPES[b.valueType] ? b.valueType : undefined;
  const digits = num(b.digits, 'Digits'), precision = num(b.precision, 'Decimals');
  if (digits !== undefined && (digits < 1 || digits > 12)) throw new Error('Digits must be 1 to 12');
  if (precision !== undefined && precision > 6) throw new Error('Decimals must be 0 to 6');
  return { bgColor: color('bgColor'), nameColor: color('nameColor'), nameBg: color('nameBg'), nameAlign: align('nameAlign'),
    valueColor: color('valueColor'), valueBg: color('valueBg'), valueAlign: align('valueAlign'), valueType,
    ledMode: valueType === 'led' ? (LED_MODES[b.ledMode] ? b.ledMode : 'locking') : undefined,
    digits: valueType === 'gauge' ? digits : undefined, precision: valueType === 'gauge' ? precision : undefined };
}
function cleanValve(b) {
  return { imageOpen: text(b.imageOpen, 300) || undefined, imageClosed: text(b.imageClosed, 300) || undefined, orientation: ORIENTATIONS[b.orientation] ? b.orientation : 'v' };
}

export class ProfileStore {
  constructor(dir, kind) { this.dir = dir; this.kind = kind; this.K = PROFILE_KINDS[kind]; }
  file(id) { if (!/^[a-z0-9-]+$/.test(id ?? '')) throw new Error('Bad profile id'); return path.join(this.dir, id + '.json'); }
  has(id) { try { return !!id && fs.existsSync(this.file(id)); } catch { return false; } }
  list() {
    if (!fs.existsSync(this.dir)) return [];
    return fs.readdirSync(this.dir).filter(f => f.endsWith('.json')).map(f => { try { return { ...readJson(path.join(this.dir, f)), id: f.slice(0, -5) }; } catch { return null; } })
      .filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
  }
  get(id) { if (!this.has(id)) throw new Error(`No ${this.K.title} "${id}"`); return { ...readJson(this.file(id)), id }; }
  clean(b) {
    const name = text(b.name, 80); if (!name) throw new Error(`Give the ${this.K.title} a name`);
    const units = this.K.noUnits ? undefined : UNIT_SYSTEMS[b.units] ? b.units : 'US';
    const out = { name, notes: text(b.notes, 4000), units, ...this.K.clean(b) };
    for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
    return out;
  }
  create(name, { from, units } = {}) {
    const base = from ? this.get(from) : this.K.blank(UNIT_SYSTEMS[units] ? units : 'US');
    const id = this.free(slug(name));
    return this.save(id, { ...base, name, created: undefined }, true);
  }
  save(id, body, isNew = false) {
    const p = this.clean(body);
    if (this.list().some(o => o.id !== id && o.name.toLowerCase() === p.name.toLowerCase())) throw new Error(`There is already a ${this.K.title} called "${p.name}"`);
    if (!isNew && !this.has(id)) throw new Error(`No ${this.K.title} "${id}"`);
    const created = this.has(id) ? readJson(this.file(id)).created : new Date().toISOString();
    const out = { ...p, created, updated: new Date().toISOString() };
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(id), JSON.stringify(out, null, 2));
    return { ...out, id };
  }
  remove(id) { fs.rmSync(this.file(id), { force: true }); }
  free(b) { let id = b, i = 2; while (this.has(id)) id = `${b}-${i++}`; return id; }
}
