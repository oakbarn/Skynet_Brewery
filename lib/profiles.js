// Mash Profiles and Boil Profiles (Fritz, 2026-10-20), picked from the Menu. Each is a small file in config/profiles/<kind>/<id>.json,
// shared by every Schema. A Recipe picks one of each from a dropdown (stage B); the Menu's Default tab says which a new
// Recipe starts with.
import fs from 'node:fs';
import path from 'node:path';
import { slug } from './equipment.js';
import { SPARGE, MASH_STEPS, UNIT_SYSTEMS } from '../public/brewcalc.js';
import { WATER_IONS } from '../public/recipecalc.js';
import { newKey } from './keys.js';

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
  water: { title: 'Water Profile', blank: units => ({ units, ...WATER_BLANK }), clean: cleanWater },
  valve: { title: 'Valve Profile', noUnits: true, blank: () => ({ imageOpen: 'Images/Skynet/Valves/Valve_Motor_Ball_OpenV_RC.svg', imageClosed: 'Images/Skynet/Valves/Valve_Motor_Ball_ClosedV_RC.svg', orientation: 'v' }), clean: cleanValve },
};

function cleanMash(b) {
  const steps = (Array.isArray(b.steps) ? b.steps : []).filter(s => s && (text(s.name) || s.temp !== undefined && s.temp !== '' || s.time !== undefined && s.time !== ''))
    .slice(0, MASH_STEPS).map((s, i) => ({ name: text(s.name, 60) || `Step ${i + 1}`, temp: num(s.temp, `Step ${i + 1} temperature`), time: num(s.time, `Step ${i + 1} time`) }));
  if (!steps.length) throw new Error('A Mash Profile needs at least one step');
  const sparge = SPARGE[b.sparge] ? b.sparge : 'batch';
  return { steps, sparge, spargeTemp: num(b.spargeTemp, 'Sparge water temperature'), batchRest: sparge === 'batch' ? num(b.batchRest, 'Batch sparge rest time') : undefined, mashOutTemp: num(b.mashOutTemp, 'Mash out temperature') };
}
// Water Profile (Fritz, 2026-10-30: "Skynet would need a better Water Profile as I only have half distilled"): the source
// water's minerals (ppm), how much of it is cut with distilled or RO water, and the salts added. The result is worked
// out by blendWater (public/recipecalc.js shows it the same way).
const WATER_BLANK = { ca: 0, mg: 0, na: 0, so4: 0, cl: 0, hco3: 0, ph: 7, distilledPct: 0 };
function cleanWater(b) {
  const out = {};
  for (const [k, t] of WATER_IONS) out[k] = num(b[k], t + ' (ppm)') ?? 0;
  out.ph = num(b.ph, 'pH'); if (out.ph !== undefined && out.ph > 14) throw new Error('pH must be 0 to 14');
  out.distilledPct = num(b.distilledPct, 'Distilled / RO water (%)') ?? 0;
  if (out.distilledPct > 100) throw new Error('Distilled / RO water is a percent: 0 to 100');
  return out;
}
// Skynet Templates (Fritz, 2026-10-30: "User would need to select a Mash Profile from a Skynet Template or a User Template").
// They are built in, read only (like the Skynet Styles), and listed with the user's own. "Add new ..." can copy one to change it.
const F = f => Math.round(f * 10) / 10;
const mashT = (id, name, steps, mashOut, notes) => ({ id: 'skynet-' + id, name: 'Skynet ' + name, skynet: true, units: 'US', notes,
  steps: steps.map(([n, f, min]) => ({ name: n, temp: F(f), time: min })), mashOutTemp: mashOut, sparge: 'batch', spargeTemp: 168, batchRest: 10 });
export const SKYNET_PROFILES = {
  mash: [
    mashT('single-light', 'Single Infusion, Light Body', [['Saccharification', 148, 75]], 168, 'A dry, crisp beer: a long, low rest.'),
    mashT('single-medium', 'Single Infusion, Medium Body', [['Saccharification', 152, 60]], 168, 'Most ales.'),
    mashT('single-full', 'Single Infusion, Full Body', [['Saccharification', 156, 45]], 168, 'A sweet, full beer: stouts, Scottish ales.'),
    mashT('single-no-mashout', 'Single Infusion, No Mash Out', [['Saccharification', 152, 60]], undefined, 'Medium body, straight to the sparge.'),
    mashT('step-protein', 'Step Mash, Protein Rest', [['Protein Rest', 122, 20], ['Saccharification', 152, 45]], 168, 'Wheat beers and under-modified malts.'),
    mashT('step-two-rest', 'Step Mash, Beta and Alpha', [['Beta Amylase', 146, 30], ['Alpha Amylase', 158, 30]], 168, 'Lagers and Belgian ales: dry, with good head.'),
    mashT('step-hochkurz', 'Hochkurz', [['Maltose Rest', 145, 35], ['Dextrin Rest', 162, 25]], 172, 'The German two step.'),
    mashT('biab', 'BIAB, Full Volume', [['Saccharification', 152, 60]], 168, 'Brew in a bag: no sparge.'),
  ],
  water: [
    ['distilled', 'Distilled or RO', 0, 0, 0, 0, 0, 0, 'Nothing in it: the base to build any water from.'],
    ['balanced', 'Balanced', 60, 10, 15, 75, 75, 40, 'Even sulfate and chloride: most beers.'],
    ['hoppy', 'Pale Ale, Hoppy', 110, 18, 15, 250, 50, 40, 'High sulfate: crisp, dry bitterness (IPA, Pale Ale).'],
    ['malty', 'Malty', 60, 10, 25, 50, 100, 60, 'More chloride: round, full malt (Brown, Scottish, NEIPA).'],
    ['pilsen', 'Pilsen', 7, 2, 2, 5, 5, 15, 'Very soft: Pilsner and pale lagers.'],
    ['burton', 'Burton on Trent', 295, 45, 55, 725, 25, 300, 'Very hard: English pale ales.'],
    ['dublin', 'Dublin', 118, 4, 12, 55, 19, 160, 'Hard with bicarbonate: stouts and porters.'],
    ['munich', 'Munich', 76, 18, 2, 6, 2, 152, 'Bicarbonate: dark lagers, Dunkel, Bock.'],
    ['london', 'London', 52, 32, 86, 32, 34, 104, 'Bitters, porters, milds.'],
  ].map(([id, name, ca, mg, na, so4, cl, hco3, notes]) => ({ id: 'skynet-' + id, name: 'Skynet ' + name, skynet: true, units: 'US', ca, mg, na, so4, cl, hco3, ph: 7, distilledPct: 0, notes })),
};

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
  has(id) { try { return !!id && (!!this.skynet(id) || fs.existsSync(this.file(id))); } catch { return false; } }
  list() {
    return [...this.own(), ...(SKYNET_PROFILES[this.kind] || []).map(p => ({ ...p }))];
  }
  skynet(id) { return (SKYNET_PROFILES[this.kind] || []).find(p => p.id === id); }
  own() {
    if (!fs.existsSync(this.dir)) return [];
    return fs.readdirSync(this.dir).filter(f => f.endsWith('.json')).map(f => { try { return { ...readJson(path.join(this.dir, f)), id: f.slice(0, -5) }; } catch { return null; } })
      .filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
  }
  get(id) { const sk = this.skynet(id); if (sk) return { ...sk }; if (!this.has(id)) throw new Error(`No ${this.K.title} "${id}"`); return { ...readJson(this.file(id)), id }; }
  clean(b) {
    const name = text(b.name, 80); if (!name) throw new Error(`Give the ${this.K.title} a name`);
    const units = this.K.noUnits ? undefined : UNIT_SYSTEMS[b.units] ? b.units : 'US';
    const out = { name, notes: text(b.notes, 4000), units, ...this.K.clean(b) };
    for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
    return out;
  }
  create(name, { from, units } = {}) {
    const base = from ? { ...this.get(from), skynet: undefined } : this.K.blank(UNIT_SYSTEMS[units] ? units : 'US');
    const id = this.free(slug(name));
    return this.save(id, { ...base, name, created: undefined }, true);
  }
  save(id, body, isNew = false) {
    if (this.skynet(id)) throw new Error(`"${this.skynet(id).name}" is a Skynet Template and cannot be changed. Use Add new ... and start from a copy of it`);
    const p = this.clean(body);
    if (this.list().some(o => o.id !== id && o.name.toLowerCase() === p.name.toLowerCase())) throw new Error(`There is already a ${this.K.title} called "${p.name}"`);
    if (!isNew && !this.has(id)) throw new Error(`No ${this.K.title} "${id}"`);
    const was = fs.existsSync(this.file(id)) ? readJson(this.file(id)) : {}, created = was.created ?? new Date().toISOString();
    const out = { ...p, created, updated: new Date().toISOString(), _key: was._key || newKey() };     // its hidden key (lib/keys.js)
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(id), JSON.stringify(out, null, 2));
    return { ...out, id };
  }
  remove(id) { if (this.skynet(id)) throw new Error('A Skynet Template cannot be deleted'); fs.rmSync(this.file(id), { force: true }); }
  free(b) { let id = b, i = 2; while (this.has(id)) id = `${b}-${i++}`; return id; }
}
