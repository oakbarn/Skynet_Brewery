// The Standard Skynet Brew Process (Fritz, 2026-10-30): a brew day in seven major steps, PreBrew, Heat Strike, Add Grain,
// Mash, Boil, Cool and Ferment. Each major step uses one Process Template:
//  - Skynet Process Templates come with Skynet (templates/process/<Step>/Skynet_*.txt) and are never changed by a user.
//  - User Process Templates are a user's own (config/process_templates/<Step>/<Name>.txt), most often a copy of a Skynet one.
// "Build the Brew Day" turns the picked Templates into seven Flow Processes, Brew_1_PreBrew ... Brew_7_Ferment, each one
// starting the next. The brewer only picks which Device does each job (the Template's fields); nobody has to write code.
//
// A Template is a Process with a few build lines that never reach the Process:
//   {{HLT_Heater}}            the Device picked for that field on ☰ Menu > Brew Process
//   @if HLT_Heater ... @else ... @end      lines used only when that field has a Device picked (or not)
//   @each_mash_step ... @end  the lines once per possible mash step, {{n}} = 1, 2, 3 ...
// Recipe values (rcp_Strike_Temp, rcp_Boil_Time ...) are read when the Process runs, so a new Recipe needs no new build.
import fs from 'node:fs';
import path from 'node:path';
import { TimeVal } from './values.js';
import { RECIPE_FIELDS as SKYNET_FIELDS, HOP_FIELDS, GRAIN_FIELDS, FERMENTABLE_FIELDS, ADJUNCT_FIELDS, lineFieldEmpty, recipeFieldValues, recipeTotals, firstMashStep, lTo, kgTo, cTo, ratioTo, fToC } from '../public/recipecalc.js';

export const MAJOR_STEPS = [
  { key: 'PreBrew', title: 'PreBrew', about: 'Load or check the Recipe, pumps off and every valve closed, the equipment checked and locked' },
  { key: 'Heat_Strike', title: 'Heat Strike', about: 'Fill the Hot Liquor Tank and heat the strike water' },
  { key: 'Add_Grain', title: 'Add Grain', about: 'Strike water into the mash tun, then the grain (dough in)' },
  { key: 'Mash', title: 'Mash', about: 'Every mash step of the Recipe, the mash out and the sparge' },
  { key: 'Boil', title: 'Boil', about: 'Up to the boil, then the boil timer for the Recipe\'s boil time' },
  { key: 'Cool', title: 'Cool', about: 'Chill the wort to pitching temperature and move it to the fermenter' },
  { key: 'Ferment', title: 'Ferment', about: 'Pitch the yeast and hold the fermentation temperature' },
];
export const processName = (i) => `Brew_${i + 1}_${MAJOR_STEPS[i].key}`;
export const MAX_MASH_STEPS = 8;

// The jobs a Template can ask a Device for. Only Devices and Widgets of the listed types can be picked for a field.
const HEATERS = ['pid', 'hysteresis', 'dutyCycle'];
export const FIELDS = {
  HLT_Heater: { title: 'Hot Liquor Tank heater', types: HEATERS },
  HLT_Probe: { title: 'Hot Liquor Tank temperature probe', types: ['temperature'] },
  Mash_Heater: { title: 'Mash heater (RIMS, HERMS or direct fire)', types: HEATERS },
  Mash_Probe: { title: 'Mash temperature probe', types: ['temperature'] },
  Mash_Pump: { title: 'Mash recirculation pump', types: ['digitalOut'], subtype: 'pump' },
  Mash_Timer: { title: 'Mash timer', types: ['timer'] },
  Boil_Heater: { title: 'Boil kettle heater', types: HEATERS },
  Boil_Probe: { title: 'Boil kettle temperature probe', types: ['temperature'] },
  Boil_Timer: { title: 'Boil timer (hop alerts run on it)', types: ['timer'] },
  Chill_Pump: { title: 'Pump through the chiller', types: ['digitalOut'], subtype: 'pump' },
  Wort_Probe: { title: 'Chilled wort temperature probe', types: ['temperature'] },
  Ferment_Heater: { title: 'Fermenter temperature control', types: HEATERS },
  Ferment_Probe: { title: 'Fermenter temperature probe', types: ['temperature'] },
};
export const fieldFits = (f, el) => !!el && FIELDS[f]?.types.includes(el.type) && (!FIELDS[f].subtype || el.subtype === FIELDS[f].subtype);

// ---- Recipe values in a Process: rcp_ names, read only. They come from the loaded Recipe (config.recipe, the Recipe
// Tab), and while none is loaded from the ☰ Menu > Default tab: its Mash Profile, Boil Profile and brewing defaults.
export const RECIPE_FIELDS = {
  rcp_Loaded: 'true when a Recipe is loaded',
  rcp_Name: 'the Recipe name',
  rcp_Batch_Volume: 'batch size into the fermenter',
  rcp_Boil_Volume: 'volume at the start of the boil',
  rcp_Total_Grain_Weight: 'all the grain together',
  rcp_Strike_Temp: 'strike water temperature',
  rcp_Strike_Volume: 'strike water volume',
  rcp_Mash_Steps: 'how many mash steps',
  rcp_Mash_Out_Temp: 'mash out temperature (0 = no mash out)',
  rcp_Sparge_Temp: 'sparge water temperature',
  rcp_Boil_Time: 'boil time (hh:mm:ss)',
  rcp_Boil_Start_Temp: 'temperature the boil counts as started',
  rcp_Ferment_Temp: 'fermentation (and pitching) temperature',
  rcp_Yeast_Name: 'the yeast',
  rcp_Temp_Units: '°F or °C (the panel\'s units)',
  rcp_Volume_Units: 'gal or L',
  rcp_Weight_Units: 'lb or kg',
  // every Skynet_Field on the Recipe tab can be read too (public/recipecalc.js)
  ...Object.fromEntries(SKYNET_FIELDS.filter(([k]) => !/^rcp_(Name|Batch_Volume|Boil_Volume|Total_Grain_Weight|Strike_Temp|Strike_Volume|Sparge_Temp)$/.test(k)).map(([k, what]) => [k, what])),
};
const MASH_STEP_FIELD = /^rcp_Mash_Step_(\d+)_(Name|Temp|Time)$/i;
export const isRecipeName = n => /^rcp_/i.test(String(n));
const recipeKey = n => Object.keys(RECIPE_FIELDS).find(k => k.toLowerCase() === String(n).toLowerCase());
// the lines of the Hops, Grain, Fermentable and Adjuncts tabs: rcp_Hop_Count, rcp_Hop_1_Name, rcp_Grain_1_Name ... (no limit)
export const isKnownRecipeName = n => !!recipeKey(n) || MASH_STEP_FIELD.test(String(n)) || lineFieldEmpty(n) !== undefined;
export const recipeNames = () => [...Object.keys(RECIPE_FIELDS), ...['Name', 'Temp', 'Time'].map(k => `rcp_Mash_Step_1_${k}`),
  'rcp_Hop_Count', ...HOP_FIELDS.map(([k]) => `rcp_Hop_1_${k}`), 'rcp_Grain_Count', ...GRAIN_FIELDS.map(([k]) => `rcp_Grain_1_${k}`),
  'rcp_Fermentable_Count', ...FERMENTABLE_FIELDS.map(([k]) => `rcp_Fermentable_1_${k}`), 'rcp_Adjunct_Count', ...ADJUNCT_FIELDS.map(([k]) => `rcp_Adjunct_1_${k}`)];

const num = v => Number.isFinite(+v) && v !== '' && v !== null ? +v : null;
const minutes = m => new TimeVal((num(m) ?? 0) * 60);
// Strike water temperature (Palmer): T = (k / R) x (mash temperature - grain temperature) + mash temperature,
// k = 0.2 with R in quarts per pound (°F), 0.41 with R in liters per kilogram (°C)
export function strikeTemp(mashTemp, grainTemp, ratio, metric) {
  if (num(mashTemp) === null || !(num(ratio) > 0)) return null;
  const t = ((metric ? 0.41 : 0.2) / ratio) * (mashTemp - (num(grainTemp) ?? (metric ? 20 : 68))) + +mashTemp;
  return Math.round(t * 10) / 10;
}

// every rcp_ value, in the panel's units. profiles = { mash: [...], boil: [...] } (lib/profiles.js lists)
// The Recipe is the Skynet Recipe (lib/recipe.js: kg, L and °C); with none loaded, the Default tab's profiles and defaults.
export function recipeValues(config = {}, profiles = {}) {
  const d = config.brewDefaults || {}, metric = d.units === 'Metric';
  const r = config.recipe && typeof config.recipe === 'object' ? config.recipe : null;
  const u = { volumeUnit: metric ? 'L' : 'gal', grainUnit: metric ? 'kg' : 'lb', tempUnit: metric ? 'C' : 'F', ratioUnit: metric ? 'L/kg' : 'qt/lb' };
  const pick = (list, id) => (list || []).find(x => x.id === id) || null;
  const r2 = v => v === null || v === undefined ? null : Math.round(v * 100) / 100;
  // a Mash Profile keeps its own units: its temperatures turn into the panel's
  const profTemp = (p, v) => num(v) === null ? null : p.units === 'Metric' ? r2(cTo(+v, u.tempUnit)) : r2(cTo(fToC(+v), u.tempUnit));
  const mp = pick(profiles.mash, r ? r.mashProfile : d.mashProfile);
  const steps = (mp ? mp.steps.map(s => ({ name: s.name, temp: profTemp(mp, s.temp), time: num(s.time) }))
    : (r?.mash?.steps || []).filter(s => !/mash ?out/i.test(s.name)).map(s => ({ name: s.name, temp: r2(cTo(s.tempC, u.tempUnit)), time: num(s.min) })))
    .filter(s => s.temp !== null).slice(0, MAX_MASH_STEPS);
  const out_ = (r?.mash?.steps || []).find(s => /mash ?out/i.test(s.name));
  const boil = r ? { boilTime: r.boilTime } : pick(profiles.boil, d.boilProfile) || {};
  const tt = r ? recipeTotals(r, d, mp) : null;
  const ratio = ratioTo(r ? r.waterToGrain : num(d.waterToGrain) ?? 2.6, u.ratioUnit);     // the Default tab keeps it in L/kg
  const grain = r ? r2(kgTo(r.grainKg ?? tt.grainKg, u.grainUnit)) : 0;
  const out = {
    ...(r ? recipeFieldValues(r, { units: d.units }) : {}),
    rcp_Loaded: !!r,
    rcp_Name: String(r?.name ?? ''),
    rcp_Batch_Volume: r ? r2(lTo(r.volumes?.batchLiters, u.volumeUnit)) ?? 0 : num(d.batchSize) ?? 0,
    rcp_Boil_Volume: r2(lTo(r?.volumes?.boilLiters, u.volumeUnit)) ?? 0,
    rcp_Total_Grain_Weight: grain || 0,
    rcp_Strike_Temp: r2(cTo(r?.strikeTempC ?? tt?.strikeC, u.tempUnit)) ?? strikeTemp(steps[0]?.temp, r2(cTo(r ? r.grainTempC : num(d.grainTempC) ?? 20, u.tempUnit)), ratio, metric) ?? 0,
    rcp_Strike_Volume: r2(lTo(r?.strikeLiters ?? tt?.strikeL, u.volumeUnit)) ?? 0,
    rcp_Mash_Steps: steps.length,
    rcp_Mash_Out_Temp: mp ? profTemp(mp, mp.mashOutTemp) ?? 0 : r2(cTo(out_?.tempC, u.tempUnit)) ?? 0,
    rcp_Sparge_Temp: r?.spargeTempC !== null && r?.spargeTempC !== undefined ? r2(cTo(r.spargeTempC, u.tempUnit)) : mp ? profTemp(mp, mp.spargeTemp) ?? 0 : 0,
    rcp_Boil_Time: minutes(boil.boilTime ?? 60),
    rcp_Boil_Start_Temp: num(d.boilStartTemp) ?? (metric ? 99 : 210),
    rcp_Ferment_Temp: r2(cTo(r?.pitchTempC, u.tempUnit)) ?? num(d.fermentTemp) ?? (metric ? 19 : 66),
    rcp_Yeast_Name: String(r?.ingredients?.yeasts?.[0]?.name ?? ''),
    rcp_Temp_Units: metric ? '°C' : '°F', rcp_Volume_Units: metric ? 'L' : 'gal', rcp_Weight_Units: metric ? 'kg' : 'lb',
  };
  for (const [k, v] of Object.entries(out)) if (v === null || v === undefined) out[k] = typeof SKYNET_FIELDS.find(f => f[0] === k)?.[2]({}, u) === 'string' ? '' : 0;
  for (let i = 1; i <= MAX_MASH_STEPS; i++) {
    const s = steps[i - 1];
    out[`rcp_Mash_Step_${i}_Name`] = String(s?.name ?? '');
    out[`rcp_Mash_Step_${i}_Temp`] = num(s?.temp) ?? 0;
    out[`rcp_Mash_Step_${i}_Time`] = minutes(s?.time ?? 0);
  }
  return out;
}
export function recipeValue(values, name) {
  const k = recipeKey(name) ?? Object.keys(values).find(x => x.toLowerCase() === String(name).toLowerCase());
  // a Hops, Grain or Fermentable line the Recipe does not have (past its Count) reads as empty
  if ((!k || !(k in values)) && lineFieldEmpty(name) !== undefined) return lineFieldEmpty(name);
  if (!k || !(k in values)) throw new Error(`${name} is not a Recipe value (they are: ${Object.keys(RECIPE_FIELDS).join(', ')}, rcp_Mash_Step_1_Temp ..., rcp_Hop_1_Name ..., rcp_Grain_1_Name ..., rcp_Fermentable_1_Name ...)`);
  return values[k];
}

// ---- Templates: the build lines
// fields = { HLT_Heater: 'MB_A1_PID_HLT__HS', ... }. Returns the Process text, or throws on a broken Template.
export function expand(text, fields = {}) {
  const lines = String(text).split(/\r?\n/), out = [];
  const has = f => !!String(fields[f] ?? '').trim();
  let i = 0;
  const block = (vars, keep, stopAt) => {
    while (i < lines.length) {
      const ln = lines[i], t = ln.trim(), at = t.match(/^@(\w+)\s*(\w*)\s*$/);
      if (at) {
        const [, cmd, arg] = at, line = i + 1;
        if (stopAt.includes(cmd.toLowerCase())) return cmd.toLowerCase();
        i++;
        if (cmd.toLowerCase() === 'if') {
          if (!FIELDS[arg]) throw new Error(`Line ${line}: @if needs a field name (${Object.keys(FIELDS).join(', ')})`);
          const end = block(vars, keep && has(arg), ['else', 'end']);
          if (end === 'else') { i++; if (block(vars, keep && !has(arg), ['end']) !== 'end') throw new Error(`Line ${line}: @if has no @end`); }
          else if (end !== 'end') throw new Error(`Line ${line}: @if has no @end`);
          i++;
        } else if (cmd.toLowerCase() === 'each_mash_step') {
          const from = i;
          for (let n = 1; n <= MAX_MASH_STEPS; n++) { i = from; if (block({ ...vars, n }, keep, ['end']) !== 'end') throw new Error(`Line ${line}: @each_mash_step has no @end`); }
          i++;
        } else throw new Error(`Line ${line}: unknown build line @${cmd}`);
        continue;
      }
      if (keep) {
        out.push(ln.replace(/\{\{(\w+)\}\}/g, (m, k) => {
          if (k in vars) return String(vars[k]);
          if (!FIELDS[k]) throw new Error(`Line ${i + 1}: {{${k}}} is not a field (${Object.keys(FIELDS).join(', ')})`);
          if (!has(k)) throw new Error(`Line ${i + 1}: {{${k}}} is used, but no ${FIELDS[k].title} is picked (put the line inside @if ${k})`);
          return fields[k];
        }));
      }
      i++;
    }
    return null;
  };
  const end = block({}, true, []);
  if (end) throw new Error(`@${end} without @if`);
  return out.join('\n');
}
// the fields a Template uses (so ☰ Menu > Brew Process only asks for those)
export function usedFields(text) {
  const s = new Set();
  for (const m of String(text).matchAll(/\{\{(\w+)\}\}|^\s*@if\s+(\w+)/gm)) { const f = m[1] || m[2]; if (FIELDS[f]) s.add(f); }
  return [...s];
}

// ---- where the Templates are kept
const SAFE = /^[A-Za-z][A-Za-z0-9_-]{0,59}$/;
export class ProcessTemplates {
  constructor(skynetDir, userDir) { this.skynetDir = skynetDir; this.userDir = userDir; }
  _read(dir, step, cls) {
    const d = path.join(dir, step);
    if (!fs.existsSync(d)) return [];
    return fs.readdirSync(d).filter(f => f.endsWith('.txt')).sort().map(f => ({ name: f.slice(0, -4), step, cls, file: path.join(d, f) }));
  }
  list() {
    return MAJOR_STEPS.flatMap(s => [...this._read(this.skynetDir, s.key, 'skynet'), ...this._read(this.userDir, s.key, 'user')])
      .map(({ file, ...t }) => { const text = fs.readFileSync(file, 'utf8'); return { ...t, about: (text.match(/^\/\/\s*About:\s*(.*)$/m) || [])[1] || '', fields: usedFields(text) }; });
  }
  find(step, name) {
    for (const [dir, cls] of [[this.skynetDir, 'skynet'], [this.userDir, 'user']]) {
      const f = path.join(dir, step, name + '.txt');
      if (SAFE.test(name) && MAJOR_STEPS.some(s => s.key === step) && fs.existsSync(f)) return { name, step, cls, text: fs.readFileSync(f, 'utf8') };
    }
    return null;
  }
  // a User Process Template: never a Skynet name, and never over a Skynet one (Rule 5.16)
  saveUser(step, name, text) {
    if (!MAJOR_STEPS.some(s => s.key === step)) throw new Error(`No major step "${step}"`);
    if (!SAFE.test(name)) throw new Error('A Template name starts with a letter and has only letters, digits, _ and - (no spaces), up to 60');
    if (/^skynet/i.test(name)) throw new Error('Names starting with Skynet are kept for Skynet Process Templates');
    expand(text, Object.fromEntries(Object.keys(FIELDS).map(k => [k, k])));     // a broken build line is caught now
    fs.mkdirSync(path.join(this.userDir, step), { recursive: true });
    fs.writeFileSync(path.join(this.userDir, step, name + '.txt'), String(text));
  }
  deleteUser(step, name) {
    const f = path.join(this.userDir, step, name + '.txt');
    if (!SAFE.test(name) || !fs.existsSync(f)) throw new Error(`No User Process Template "${name}"`);
    fs.unlinkSync(f);
  }
}

// The Brew Process of the loaded Schema: config.brewProcess = { templates: { PreBrew: 'Skynet_PreBrew', ... }, fields: { HLT_Heater: ... } }
export const DEFAULT_TEMPLATE = step => `Skynet_${step}`;
export function brewSetup(config) {
  const b = config.brewProcess || {};
  return { templates: Object.fromEntries(MAJOR_STEPS.map(s => [s.key, b.templates?.[s.key] || DEFAULT_TEMPLATE(s.key)])), fields: { ...(b.fields || {}) } };
}
// The seven Processes' text. elements = the Schema's Devices and Widgets (to check each field's pick).
export function buildBrewDay(setup, templates, elements) {
  const byName = new Map(elements.map(e => [e.name, e]));
  const fields = {};
  for (const [f, n] of Object.entries(setup.fields)) {
    if (!n) continue;
    if (!FIELDS[f]) continue;
    if (!fieldFits(f, byName.get(n))) throw new Error(`${FIELDS[f].title}: "${n}" is not a ${FIELDS[f].types.join(' or ')}${FIELDS[f].subtype ? ' ' + FIELDS[f].subtype : ''} in this Schema`);
    fields[f] = n;
  }
  return MAJOR_STEPS.map((s, i) => {
    const t = templates.find(s.key, setup.templates[s.key]);
    if (!t) throw new Error(`${s.title}: no Process Template "${setup.templates[s.key]}"`);
    let text;
    try { text = expand(t.text, fields); } catch (e) { throw new Error(`${s.title} (${t.name}): ${e.message}`); }
    const head = `//${processName(i)}\n//Made by ☰ Menu > Brew Process from the ${t.cls === 'skynet' ? 'Skynet' : 'User'} Process Template ${t.name}. Build the Brew Day again after changing a pick.\n`;
    const next = i + 1 < MAJOR_STEPS.length ? `\nstart ${processName(i + 1)}\n` : '\n';
    return { name: processName(i), text: head + text.replace(/\s+$/, '') + '\n' + next };
  });
}
