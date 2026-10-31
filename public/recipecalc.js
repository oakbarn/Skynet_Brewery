// Recipe sums shared by the browser and the Brain (lib/recipe.js imports this file too).
// A Recipe is always kept in kilograms, liters and °C (as BeerXML does). The Default tab says how each amount is shown
// (Fritz, 2026-10-30): the user only sees the results in their own units.

export const KG_LB = 2.20462262, KG_OZ = 35.27396195, L_GAL = 0.264172052, L_QT = 1.05668821, L_FLOZ = 33.8140227;
export const cToF = c => c * 9 / 5 + 32, fToC = f => (f - 32) * 5 / 9;
const n = v => Number.isFinite(+v) ? +v : 0;
const round = (v, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

// how each amount shows: [key, label, choices]. The first choice of each is the US one, the second the Metric one.
export const DISPLAY_UNITS = [
  ['grainUnit', 'Grains and other fermentables', { lb: 'pounds (lb)', kg: 'kilograms (kg)', oz: 'ounces (oz)', g: 'grams (g)' }],
  ['hopUnit', 'Hops', { oz: 'ounces (oz)', g: 'grams (g)' }],
  ['volumeUnit', 'Volumes (batch, boil, strike and sparge water)', { gal: 'gallons (gal)', L: 'liters (L)', qt: 'quarts (qt)' }],
  ['tempUnit', 'Temperatures', { F: '°F', C: '°C' }],
  ['ratioUnit', 'Water to grain ratio', { 'qt/lb': 'quarts per pound (qt/lb)', 'L/kg': 'liters per kilogram (L/kg)' }],
  ['miscUnit', 'Misc ingredients', { recipe: 'as the recipe gives them (tsp, g, oz ...)', metric: 'grams and milliliters', us: 'ounces and fluid ounces' }],
];
export function displayUnits(d = {}) {
  const metric = d.units === 'Metric', out = {};
  for (const [k, , ch] of DISPLAY_UNITS) { const keys = Object.keys(ch); out[k] = ch[d[k]] ? d[k] : k === 'miscUnit' ? 'recipe' : keys[metric ? 1 : 0]; }
  return out;
}
// recipe defaults a new Recipe starts with (Fritz: "We will provide the first defaults but can be edited by a User on the Default tab")
export const RECIPE_DEFAULTS = { boilTime: 60, waterToGrain: 2.6, grainTempC: 20, hopWarnMinutes: 10, alertMergeMinutes: 1, efficiency: 72, strikeOffsetC: 0 };

const W = { kg: 1, lb: 1 / KG_LB, oz: 1 / KG_OZ, g: 0.001 }, V = { L: 1, gal: 1 / L_GAL, qt: 1 / L_QT };
export const kgTo = (kg, u) => kg === null || kg === undefined || kg === '' ? null : n(kg) / W[u];
export const toKg = (v, u) => v === null || v === undefined || v === '' ? null : n(v) * W[u];
export const lTo = (l, u) => l === null || l === undefined || l === '' ? null : n(l) / V[u];
export const toL = (v, u) => v === null || v === undefined || v === '' ? null : n(v) * V[u];
export const cTo = (c, u) => c === null || c === undefined || c === '' ? null : u === 'F' ? cToF(n(c)) : n(c);
export const toC = (v, u) => v === null || v === undefined || v === '' ? null : u === 'F' ? fToC(n(v)) : n(v);
// water to grain: kept as L/kg; 1 qt/lb = 2.0864 L/kg
export const QTLB_LKG = L_QT === 0 ? 0 : (1 / L_QT) * KG_LB;
export const ratioTo = (r, u) => r === null || r === undefined || r === '' ? null : u === 'qt/lb' ? n(r) / QTLB_LKG : n(r);
export const toRatio = (v, u) => v === null || v === undefined || v === '' ? null : u === 'qt/lb' ? n(v) * QTLB_LKG : n(v);

// Misc ingredient units, as BeerSmith numbers them (F_M_UNITS) and how they turn into grams / milliliters
export const MISC_UNITS = ['mg', 'g', 'oz', 'lb', 'kg', 'ml', 'tsp', 'tbsp', 'cup', 'pt', 'qt', 'l', 'gal', 'items'];
const MISC_G = { mg: 0.001, g: 1, oz: 28.3495, lb: 453.592, kg: 1000 }, MISC_ML = { ml: 1, tsp: 4.92892, tbsp: 14.7868, cup: 236.588, pt: 473.176, qt: 946.353, l: 1000, gal: 3785.41 };
export function miscShow(amount, unit, how = 'recipe') {
  const u = String(unit || '').toLowerCase();
  if (how === 'recipe' || (!MISC_G[u] && !MISC_ML[u])) return [round(n(amount), 3), unit || ''];
  if (MISC_G[u]) return how === 'metric' ? [round(n(amount) * MISC_G[u], 2), 'g'] : [round(n(amount) * MISC_G[u] / 28.3495, 3), 'oz'];
  return how === 'metric' ? [round(n(amount) * MISC_ML[u], 1), 'ml'] : [round(n(amount) * MISC_ML[u] / 29.5735, 2), 'fl oz'];
}

// What a hop is for, in the order the hops go in on brew day (Fritz's OakBarn Hop Grouping order):
// Top of Mash, 1st Wort, Start of Boil, Bitter, Flavor, Aroma (during the boil), Whirlpool, Dry Hop
export const HOP_USES = { mash: 'Top of Mash', 'first wort': '1st Wort', boil: 'Boil', whirlpool: 'Whirlpool / Aroma', secondary: 'Secondary', 'dry hop': 'Dry Hop' };
// The order of the hop lines on the Hops tab (Fritz's Hops tab, 2026-10-31): Boil hops grouped by drop time, a Start of Boil
// hop (Min = Boil Time) first, then by Minutes; then the hops that are not Boil Hops: Mash, 1st Wort, Secondary, Dry, Whirlpool.
const HOP_LINE_ORDER = { boil: 0, mash: 1, 'first wort': 2, secondary: 3, 'dry hop': 4, whirlpool: 5 };
export function sortHops(r) {
  const hops = r?.ingredients?.hops; if (!Array.isArray(hops)) return r;
  const boil = n(r.boilTime) || RECIPE_DEFAULTS.boilTime, use = h => HOP_LINE_ORDER[h.use] ?? 0;
  hops.sort((a, b) => use(a) - use(b) || (use(a) ? 0 : Math.min(n(b.time), boil) - Math.min(n(a.time), boil)));     // sort is stable: same time keeps its order
  return r;
}
// the hops whose Actual AAU is not above zero (Hop lines numbered from 1). Calculate stops and warns while there are any.
export const hopActualProblems = r => (r?.ingredients?.hops || []).map((h, i) => ({ line: i + 1, name: h.name || '(no name)', aa: h.alphaActual })).filter(x => !(n(x.aa) > 0));
export const FERMENTABLE_TYPES = { grain: 'Grain', adjunct: 'Adjunct', extract: 'Extract', 'dry extract': 'Dry Extract', sugar: 'Sugar', fruit: 'Fruit', juice: 'Juice', other: 'Other' };
// The Grain tab holds the fermentables of Type Grain; the Fermentable tab holds every other Type (Fritz, 2026-10-31).
// After Boil is shown only for the Types a brewer adds during or after the boil.
export const isGrain = f => !f.type || f.type === 'grain';
export const AFTER_BOIL_TYPES = ['extract', 'dry extract', 'sugar', 'fruit', 'juice'];
// The Fermentable tab's dropdowns, select from the list only (Fritz's Fermentable tab, 2026-10-31): the BeerXML standard's
// Types (Grain is on the Grain tab) and weights. Each line keeps its own Measurement; the amount is still kept in kg.
export const BEERXML_FERM_TYPES = ['adjunct', 'extract', 'dry extract', 'sugar'];
export const FERM_MEASURES = { lb: 'Pounds (lb)', oz: 'Ounces (oz)', kg: 'Kilograms (kg)', g: 'Grams (g)' };
// Gravity points (the PPG>SG box, Fritz's Grain tab 2026-10-31): Potential (yield %) x 46.214 (the points of 1 lb of pure
// sugar in 1 gallon) = PPG; points = PPG x pounds x efficiency / gallons in the batch. Grains and adjuncts are mashed, so the
// brewhouse efficiency counts; extracts, sugars, fruit and juice give all their sugar (100%). Expected Gravity = 1 + all points / 1000.
export const PPG_SUGAR = 46.214;
export function gravityPoints(f, r) {
  const gal = n(r?.volumes?.batchLiters) * L_GAL; if (!gal || f?.yieldPct === null || f?.yieldPct === undefined || f?.yieldPct === '') return null;
  const mashed = isGrain(f) || f.type === 'adjunct', eff = mashed ? (n(r?.efficiency) || RECIPE_DEFAULTS.efficiency) / 100 : 1;
  return n(f.yieldPct) / 100 * PPG_SUGAR * n(f.kg) * KG_LB * eff / gal;
}
export function expectedGravity(r) {
  const fs = r?.ingredients?.fermentables || []; if (!(n(r?.volumes?.batchLiters) > 0) || !fs.length) return null;
  return round(1 + fs.reduce((a, f) => a + (gravityPoints(f, r) || 0), 0) / 1000, 3);
}
export const MISC_USES = { boil: 'Boil', mash: 'Mash', primary: 'Primary', secondary: 'Secondary', bottling: 'Bottling', other: 'Other' };
export const boilKind = min => min >= 30 ? 'Bitter' : min >= 10 ? 'Flavor' : 'Aroma';

export function blankRecipe(d = {}) {
  const D = { ...RECIPE_DEFAULTS, ...pickNums(d) };
  return {
    sourceFormat: 'manual', sourceVersion: null, sourceFile: null, name: '', type: 'All Grain', style: '', brewer: '', assistantBrewer: '', notes: '',
    volumes: { batchLiters: d.batchSize ? toL(d.batchSize, d.units === 'Metric' ? 'L' : 'gal') : null, boilLiters: null },
    boilTime: D.boilTime, efficiency: D.efficiency, og: null, fg: null, ibu: null, color: null,
    waterToGrain: D.waterToGrain, grainTempC: D.grainTempC,
    // the boxes on the Recipe tab (Fritz's layout, 2026-10-31). Calculate fills grainKg, firstMashC, ibuCalc, strike and sparge.
    grainKg: null, firstMashC: null, ibuCalc: null, expectedSG: null, strikeLiters: null, strikeTempC: null,
    spargeType: 'batch', spargeLiters: null, spargeMinutes: null, spargeTempC: null, whirlpoolMinutes: null, pitchTempC: null,
    mashProfile: d.mashProfile || '', boilProfile: d.boilProfile || '', waterProfile: d.waterProfile || '',
    ingredients: { fermentables: [], hops: [], yeasts: [], miscs: [], waters: [] },
    mash: { profileName: null, grainTempC: null, spargeTempC: null, steps: [] },
  };
}
function pickNums(d) {
  const out = {};
  for (const k of Object.keys(RECIPE_DEFAULTS)) if (d[k] !== undefined && d[k] !== '' && Number.isFinite(+d[k])) out[k] = +d[k];
  return out;
}

// Grain weight, strike water and its temperature (Palmer: Tw = (0.41 / r)(T2 - T1) + T2 with r in L/kg and °C)
// the first mash step: from the Mash Profile picked (its own units), else the recipe file's mash
export function firstMashStep(r, mp) {
  const s = mp?.steps?.find(x => x.temp !== null && x.temp !== undefined && x.temp !== '');
  if (s) return { name: s.name, tempC: mp.units === 'Metric' ? n(s.temp) : fToC(n(s.temp)), min: n(s.time) };
  return r?.mash?.steps?.find(x => x.tempC !== null && x.tempC !== undefined) ?? null;
}
// IBU by Tinseth, from each hop's Actual alpha and the amount to use (the same alpha acid units as the recipe)
export function tinsethIbu(r) {
  const liters = n(r?.volumes?.batchLiters); if (!liters) return null;
  const og = n(r?.og) > 1 ? n(r.og) : 1.05, boil = n(r?.boilTime) || 60, big = 1.65 * Math.pow(0.000125, og - 1);
  let ibu = 0;
  for (const h of r?.ingredients?.hops || []) ibu += hopIbu(r, h, liters, boil, big);
  return round(ibu, 1);
}
// one hop's IBU (the Hop N IBU box on the Hops tab)
export function hopIbu(r, h, liters = n(r?.volumes?.batchLiters), boil = n(r?.boilTime) || 60, big = 1.65 * Math.pow(0.000125, (n(r?.og) > 1 ? n(r.og) : 1.05) - 1)) {
  const t = h.use === 'boil' || !HOP_USES[h.use] ? Math.min(n(h.time), boil) : h.use === 'first wort' ? boil : 0;
  if (!t || !liters) return 0;
  const aa = n(h.alphaActual) || n(h.alpha), mg = hopKgToUse(h) * 1e6;
  return big * (1 - Math.exp(-0.04 * t)) / 4.15 * (aa / 100) * mg / liters;
}
// The Calculate button: Total Grain Weight, 1st Mash temperature, IBU, Strike Volume and Temperature and the Sparge Volume.
// Grain absorption 1.0 L/kg (0.12 gal/lb) unless the Equipment Profile gives one (absorbLkg).
export function calculateRecipe(r, d = {}, mp = null, absorbLkg = 1.0) {
  const tt = recipeTotals(r, d, mp), first = firstMashStep(r, mp);
  const pre = n(r?.volumes?.boilLiters);
  const spargeL = pre && tt.strikeL ? Math.max(0, pre - (tt.strikeL - tt.grainKg * absorbLkg)) : null;
  const spargeC = r?.spargeTempC ?? (mp?.spargeTemp !== undefined ? (mp.units === 'Metric' ? n(mp.spargeTemp) : fToC(n(mp.spargeTemp))) : r?.mash?.spargeTempC ?? null);
  return { expectedSG: expectedGravity(r), grainKg: tt.grainKg, firstMashC: first ? round(n(first.tempC), 1) : null, ibuCalc: tinsethIbu(r), strikeLiters: tt.strikeL || null, strikeTempC: tt.strikeC,
    spargeLiters: spargeL === null ? null : round(spargeL, 2), spargeTempC: spargeC === null ? null : round(spargeC, 1), spargeType: r?.spargeType || mp?.sparge || 'batch',
    spargeMinutes: r?.spargeMinutes ?? (mp?.batchRest ?? null) };
}
export function recipeTotals(r, d = {}, mp = null) {
  const D = { ...RECIPE_DEFAULTS, ...pickNums(d) };
  const f = r?.ingredients?.fermentables || [];
  const grainKg = f.filter(x => !x.type || x.type === 'grain' || x.type === 'adjunct').reduce((a, x) => a + n(x.kg), 0);
  const allKg = f.reduce((a, x) => a + n(x.kg), 0);
  const hopKg = (r?.ingredients?.hops || []).reduce((a, x) => a + n(x.kg), 0);
  const ratio = n(r?.waterToGrain) || D.waterToGrain, grainT = r?.grainTempC ?? D.grainTempC;
  const first = firstMashStep(r, mp);
  const strikeL = grainKg * ratio;
  const strikeC = first && grainKg ? (0.41 / ratio) * (n(first.tempC) - n(grainT)) + n(first.tempC) + n(D.strikeOffsetC) : null;
  return { grainKg: round(grainKg, 3), fermentableKg: round(allKg, 3), hopKg: round(hopKg, 4), strikeL: round(strikeL, 2), strikeC: strikeC === null ? null : round(strikeC, 1),
    hops: (r?.ingredients?.hops || []).length, yeasts: (r?.ingredients?.yeasts || []).length, miscs: (r?.ingredients?.miscs || []).length };
}

// The hop amount to use when the hops on hand have a different alpha acid than the recipe (Fritz's Batch Tab "Hop OZ" from
// "AAU (Recipe)" and "AAU (Actual)"): the same alpha acid units, so kg x recipe alpha / actual alpha.
export const hopKgToUse = h => n(h.alphaActual) > 0 && n(h.alpha) > 0 ? n(h.kg) * n(h.alpha) / n(h.alphaActual) : n(h.kg);

// ---- The hop schedule and its alerts (Fritz's OakBarn Hop Warnings, done by Skynet with no limit on the hops).
// Hops that go in at the same time make one Hop Group. Each boil group gets a warning (default 10 minutes before) and a
// drop alert. When two alerts land at the same time (within alertMergeMinutes), Skynet makes one alert that has both,
// for example a drop and the next group's warning. Boil Misc items (Irish Moss, Whirlfloc, yeast nutrient) get their
// own warning and drop, and are merged the same way.
// at = minutes from the start of the boil. Mash and 1st Wort hops come before the boil (no time), Dry Hops after.
export function hopSchedule(r, d = {}) {
  const D = { ...RECIPE_DEFAULTS, ...pickNums(d) }, u = displayUnits(d);
  const boil = n(r?.boilTime) || D.boilTime, warn = Math.max(0, D.hopWarnMinutes), merge = Math.max(0, D.alertMergeMinutes);
  const hopText = h => `${fmtW(hopKgToUse(h), u.hopUnit)} ${h.name || 'hop'}`;
  const groups = new Map(), hopKey = [];
  const add = (key, g, what) => { if (!groups.has(key)) groups.set(key, { ...g, items: [] }); groups.get(key).items.push(what); if (what.kind === 'hop') hopKey.push(key); };
  for (const h of r?.ingredients?.hops || []) {
    const use = HOP_USES[h.use] ? h.use : 'boil', t = n(h.time);
    if (use === 'mash') add('mash', { phase: 'mash', order: 1, label: 'Top of Mash' }, { kind: 'hop', text: hopText(h) });
    else if (use === 'first wort') add('fw', { phase: 'first wort', order: 2, label: '1st Wort' }, { kind: 'hop', text: hopText(h) });
    else if (use === 'whirlpool') add('wp', { phase: 'whirlpool', order: 7, label: 'Whirlpool', at: boil, min: 0 }, { kind: 'hop', text: hopText(h) + (t ? ` (${t} min whirlpool${h.wpTempC != null && h.wpTempC !== '' ? ` at ${round(cTo(h.wpTempC, u.tempUnit), 0)} °${u.tempUnit}` : ''}${h.hopRocket ? ', Hop Rocket' : ''})` : h.hopRocket ? ' (Hop Rocket)' : '') });
    else if (use === 'secondary') add('sec' + n(h.dryDays), { phase: 'secondary', order: 8, label: `Secondary${n(h.dryDays) ? ` (${n(h.dryDays)} days)` : ''}`, days: n(h.dryDays) }, { kind: 'hop', text: hopText(h) });
    else if (use === 'dry hop') add('dry' + n(h.dryDays), { phase: 'dry hop', order: 9, label: `Dry Hop${n(h.dryDays) ? ` (${n(h.dryDays)} days)` : ''}`, days: n(h.dryDays) }, { kind: 'hop', text: hopText(h) });
    else {
      const min = Math.min(t, boil), sob = min >= boil;
      add('b' + min, { phase: 'boil', order: sob ? 3 : 4, label: sob ? 'Start of Boil' : `${min} min (${boilKind(min)})`, at: boil - min, min }, { kind: 'hop', text: hopText(h) });
    }
  }
  for (const m of r?.ingredients?.miscs || []) {
    if (m.use !== 'boil') continue;
    const min = Math.min(n(m.time), boil), [a, un] = miscShow(m.amount, m.unit, u.miscUnit);
    add('b' + min, { phase: 'boil', order: min >= boil ? 3 : 4, label: min >= boil ? 'Start of Boil' : `${min} min (${boilKind(min)})`, at: boil - min, min }, { kind: 'misc', text: `${a} ${un} ${m.name}`.trim() });
  }
  const list = [...groups.values()].sort((a, b) => a.order - b.order || (a.at ?? 0) - (b.at ?? 0) || (a.days ?? 0) - (b.days ?? 0));
  let gn = 0;
  for (const g of list) { if (g.phase === 'boil' || g.phase === 'whirlpool') g.group = ++gn; g.what = g.items.map(i => i.text).join(', '); }
  // the alerts in time order, then merged
  const raw = [];
  for (const g of list.filter(g => g.at !== undefined)) {
    const name = g.phase === 'whirlpool' ? 'the Whirlpool hops' : g.order === 3 ? 'the Start of Boil hops' : `Hop Group ${g.group}`;
    if (warn && g.at > 0) raw.push({ at: Math.max(0, g.at - warn), kind: 'warn', group: g.group, text: `${warn} minute warning: get ${name} ready: ${g.what}` });
    raw.push({ at: g.at, kind: 'drop', group: g.group, text: g.phase === 'whirlpool' ? `Flame out. Add the Whirlpool hops now: ${g.what}` : `Add ${name} now: ${g.what}` });
  }
  raw.sort((a, b) => a.at - b.at || (a.kind === 'drop' ? -1 : 1));
  const alerts = [], conflicts = [];
  for (const a of raw) {
    const last = alerts[alerts.length - 1];
    if (last && a.at - last.at <= merge) {
      last.parts.push(a); last.kind = last.parts.some(p => p.kind === 'drop') ? 'drop' : 'warn';
      conflicts.push({ at: last.at, text: `${a.kind === 'drop' ? 'Drop' : 'Warning'} for ${a.group ? 'Hop Group ' + a.group : 'hops'} at ${round(a.at, 1)} min lands with ${last.parts.length > 2 ? 'other alerts' : (last.parts[0].kind === 'drop' ? 'a drop' : 'a warning')} at ${round(last.at, 1)} min: one alert has both` });
    } else alerts.push({ at: a.at, kind: a.kind, parts: [a] });
  }
  for (const a of alerts) {
    a.parts.sort((x, y) => (x.kind === 'drop' ? 0 : 1) - (y.kind === 'drop' ? 0 : 1));     // what goes in now first, then what to get ready
    a.text = a.parts.map(p => p.text).join('\n'); a.speak = a.parts.map(p => p.text).join('. Also, ').replace(/\n/g, '. '); a.left = boil - a.at;
    a.audio = `Audio/Hops/${audioName(a.at, a.speak)}`;     // a voice file of its own words, when one is put there (media/Audio/Hops)
  }
  // each hop line's Boil Group (the Hop N Boil Group box): its group number, or null when it is not a Boil or Whirlpool hop
  const hopGroups = hopKey.map(k => groups.get(k).group ?? null);
  return { boilTime: boil, warnMinutes: warn, groups: list, alerts, conflicts, hopGroups };
}
// the voice file name of an alert: its minute and a short code of its words, so a changed alert needs a new file
export function audioName(at, text) {
  let h = 5381; for (const c of String(text)) h = (h * 33 + c.codePointAt(0)) >>> 0;
  return `Hop_Alert_${String(Math.round(at)).padStart(3, '0')}min_${h.toString(36)}.mp3`;
}
export function fmtW(kg, unit) {
  const v = kgTo(kg, unit);
  return `${round(v, unit === 'g' ? 0 : unit === 'oz' ? 2 : 3)} ${unit}`;
}

// ---- Water Profile (lib/profiles.js keeps them): the minerals in ppm
export const WATER_IONS = [['ca', 'Calcium (Ca)'], ['mg', 'Magnesium (Mg)'], ['na', 'Sodium (Na)'], ['so4', 'Sulfate (SO4)'], ['cl', 'Chloride (Cl)'], ['hco3', 'Bicarbonate (HCO3)']];
// the water after cutting it with distilled water: every mineral goes down by the same share
export function blendWater(w = {}) {
  const keep = 1 - Math.min(Math.max(+w.distilledPct || 0, 0), 100) / 100, out = {};
  for (const [k] of WATER_IONS) out[k] = Math.round((+w[k] || 0) * keep * 10) / 10;
  out.so4cl = out.cl ? Math.round(out.so4 / out.cl * 100) / 100 : null;
  return out;
}


// ---- Skynet_Fields (Fritz, 2026-10-31: "all fields on a Recipe Tab or Daughter Tab is a Skynet_Field"). Each box on the
// Recipe tab has a fixed Skynet name (rcp_), the same names the Brew Process reads (lib/brewprocess.js). A Skynet name is
// never changed by the user (Rule 3.11). [name, what it is, how to read it from a Recipe in the panel's display units]
export const RECIPE_FIELDS = [
  ['rcp_Name', 'Beer Name', r => r.name ?? ''],
  ['rcp_Style', 'Style', r => r.style ?? ''],
  ['rcp_Batch_Volume', 'Brew Length (batch size into the fermenter)', (r, u) => lTo(r.volumes?.batchLiters, u.volumeUnit)],
  ['rcp_Total_Grain_Weight', 'Grain Wt. (calculated)', (r, u) => kgTo(r.grainKg, u.grainUnit)],
  ['rcp_First_Mash_Temp', '1st Mash (calculated)', (r, u) => cTo(r.firstMashC, u.tempUnit)],
  ['rcp_IBU', 'IBU (calculated)', r => r.ibuCalc],
  ['rcp_Expected_Gravity', 'Expected Gravity (calculated: 1 + the gravity points of every grain and fermentable / 1000)', r => r.expectedSG],
  ['rcp_Strike_Volume', 'Strike Volume', (r, u) => lTo(r.strikeLiters, u.volumeUnit)],
  ['rcp_Strike_Temp', 'Strike Temperature', (r, u) => cTo(r.strikeTempC, u.tempUnit)],
  ['rcp_Grain_Temp', 'Grain Temperature', (r, u) => cTo(r.grainTempC, u.tempUnit)],
  ['rcp_Sparge_Volume', 'Sparge Volume', (r, u) => lTo(r.spargeLiters, u.volumeUnit)],
  ['rcp_Sparge_Type', 'Sparge Type (batch, fly, none)', r => r.spargeType ?? ''],
  ['rcp_Sparge_Minutes', 'Sparge Minutes', r => r.spargeMinutes],
  ['rcp_Sparge_Temp', 'Sparge Temperature', (r, u) => cTo(r.spargeTempC, u.tempUnit)],
  ['rcp_Boil_Volume', 'PreBoil Volume', (r, u) => lTo(r.volumes?.boilLiters, u.volumeUnit)],
  ['rcp_Boil_Minutes', 'Boil Minutes', r => r.boilTime],
  ['rcp_Whirlpool_Minutes', 'Whirlpool Minutes', r => r.whirlpoolMinutes],
  ['rcp_Pitch_Temp', 'Pitch At', (r, u) => cTo(r.pitchTempC, u.tempUnit)],
  ['rcp_Grain_Ratio', 'Grain Ratio', (r, u) => ratioTo(r.waterToGrain, u.ratioUnit)],
  // Daughter Tabs (their own fields come when Fritz sends each layout)
  ['rcp_Water_Profile', 'Waters: the Water Profile (its id)', r => r.waterProfile ?? ''],
  ['rcp_Mash_Profile', 'MASH: the Mash Profile (its id; empty = the mash from the recipe file)', r => r.mashProfile ?? ''],
];
// The Hops tab: one set of Skynet_Fields for each hop line, N = the line number (rcp_Hop_1_Name, rcp_Hop_2_Name ...), so there
// is no limit on the hops. [the end of the name, what it is, how to read it (r, hop, display units, the hop schedule, line index)]
export const HOP_FIELDS = [
  ['Name', 'Hop N: the hop', (r, h) => h.name ?? ''],
  ['Amount', 'Hop N: the amount in the recipe (oz or g)', (r, h, u) => kgTo(h.kg, u.hopUnit)],
  ['AA_Recipe', 'Hop N: AAU % of the recipe', (r, h) => h.alpha],
  ['AA_Actual', 'Hop N: AAU % Actual, of the hops on hand (must be above 0)', (r, h) => h.alphaActual],
  ['Calc_Amount', 'Hop N: Calc oz, the amount to use with the Actual AAU', (r, h, u) => kgTo(hopKgToUse(h), u.hopUnit)],
  ['Use', 'Hop N: Boil, Mash, 1st Wort, Secondary, Dry Hop or Whirlpool', (r, h) => HOP_USES[h.use] ? h.use : 'boil'],
  ['Min', 'Hop N Min: boil minutes (Whirlpool: whirlpool minutes)', (r, h) => h.use === 'boil' || h.use === 'whirlpool' || !HOP_USES[h.use] ? n(h.time) : 0],
  ['Drop', 'Hop N Drop: minutes into the boil when it goes in', (r, h) => h.use === 'boil' || !HOP_USES[h.use] ? Math.max(0, (n(r.boilTime) || RECIPE_DEFAULTS.boilTime) - Math.min(n(h.time), n(r.boilTime) || RECIPE_DEFAULTS.boilTime)) : 0],
  ['IBU', 'Hop N IBU', (r, h) => hopIbu(r, h)],
  ['Boil_Group', 'Hop N Boil Group (0 = not a Boil Hop)', (r, h, u, sch, i) => sch.hopGroups[i] ?? 0],
  ['Days', 'Hop N: Secondary or Dry Hop days', (r, h) => h.use === 'secondary' || h.use === 'dry hop' ? n(h.dryDays) : 0],
  ['Date', 'Hop N: Secondary or Dry Hop date (YYYY-MM-DD)', (r, h) => h.use === 'secondary' || h.use === 'dry hop' ? h.date ?? '' : ''],
  ['Whirlpool_Temp', 'Hop N: Whirlpool temperature', (r, h, u) => h.use === 'whirlpool' && h.wpTempC != null && h.wpTempC !== '' ? cTo(h.wpTempC, u.tempUnit) : 0],
  ['Hop_Rocket', 'Hop N: Whirlpool through the Hop Rocket (true or false)', (r, h) => h.use === 'whirlpool' && !!h.hopRocket],
];
export const HOP_FIELD = /^rcp_Hop_(\d+)_([A-Za-z_]+)$/;
// The Grain tab and the Fermentable tab: rcp_Grain_N_... and rcp_Fermentable_N_..., N = the line number on that tab
export const GRAIN_FIELDS = [
  ['Name', 'Grain N: the grain', f => f.name ?? ''],
  ['Amount', 'Grain N: the amount (lb or kg)', (f, u) => kgTo(f.kg, u.grainUnit)],
  ['Potential', 'Grain N: Potential (yield %)', f => f.yieldPct],
  ['SRM', 'Grain N: color in SRM', f => f.color],
  ['PPG_SG', 'Grain N: PPG>SG, its gravity points', (f, u, r) => gravityPoints(f, r)],
];
export const FERMENTABLE_FIELDS = [
  ['Name', 'Fermentable N: the fermentable', f => f.name ?? ''],
  ['Type', 'Fermentable N: Adjunct, Extract, Dry Extract, Sugar, Fruit, Juice or Other', f => f.type || 'other'],
  ['Amount', 'Fermentable N: the amount, in its Measurement', (f, u) => kgTo(f.kg, FERM_MEASURES[f.unit] ? f.unit : u.grainUnit)],
  ['Measurement', 'Fermentable N: lb, oz, kg or g', (f, u) => FERM_MEASURES[f.unit] ? f.unit : u.grainUnit],
  ['Potential', 'Fermentable N: Potential (yield %)', f => f.yieldPct],
  ['SRM', 'Fermentable N: color in SRM', f => f.color],
  ['PPG_SG', 'Fermentable N: PPG>SG, its gravity points', (f, u, r) => gravityPoints(f, r)],
  ['After_Boil', 'Fermentable N: added after the boil (true or false)', f => AFTER_BOIL_TYPES.includes(f.type) && !!f.addAfterBoil],
];
const LINE_FIELD = /^rcp_(Grain|Fermentable)_(\d+)_([A-Za-z_]+)$/;
const GRAIN_COUNT = ['rcp_Grain_Count', 'Grain tab: how many grain lines', r => (r.ingredients?.fermentables || []).filter(isGrain).length];
// a line field (any case) of the Hops, Grain or Fermentable tab: its empty value (a line past the Count reads as this), else undefined
export function lineFieldEmpty(name) {
  const s = String(name), h = new RegExp(HOP_FIELD.source, 'i').exec(s), g = new RegExp(LINE_FIELD.source, 'i').exec(s);
  const end = h ? HOP_FIELDS.find(x => x[0].toLowerCase() === h[2].toLowerCase())?.[0]
    : g ? (g[1].toLowerCase() === 'grain' ? GRAIN_FIELDS : FERMENTABLE_FIELDS).find(x => x[0].toLowerCase() === g[3].toLowerCase())?.[0] : undefined;
  if (!end) return /^rcp_(Hop|Grain|Fermentable)_Count$/i.test(s) ? 0 : undefined;
  return ['Name', 'Use', 'Date', 'Type', 'Measurement'].includes(end) ? '' : ['Hop_Rocket', 'After_Boil'].includes(end) ? false : 0;
}
const FERM_COUNT = ['rcp_Fermentable_Count', 'Fermentable tab: how many lines', r => (r.ingredients?.fermentables || []).filter(f => !isGrain(f)).length];
export const hopFieldName = (line, end) => `rcp_Hop_${line}_${end}`;
const HOP_COUNT = ['rcp_Hop_Count', 'Hops tab: how many hop lines', r => (r.ingredients?.hops || []).length];
// a Skynet_Field by its name: the Recipe tab's, rcp_Hop_Count, or one of a hop line (any line number)
export const recipeField = name => {
  for (const c of [HOP_COUNT, GRAIN_COUNT, FERM_COUNT]) if (name === c[0]) return c;
  const g = LINE_FIELD.exec(name), gf = g && (g[1] === 'Grain' ? GRAIN_FIELDS : FERMENTABLE_FIELDS).find(x => x[0] === g[3]);
  if (gf) return [name, gf[1].replace(`${g[1]} N`, `${g[1]} ${g[2]}`), gf[2]];
  const m = HOP_FIELD.exec(name), f = m && HOP_FIELDS.find(x => x[0] === m[2]);
  return f ? [name, f[1].replace('Hop N', `Hop ${m[1]}`), f[2]] : RECIPE_FIELDS.find(x => x[0] === name);
};
// every Skynet_Field of a Recipe, in the units picked on the Default tab (numbers rounded to 2 decimals)
export function recipeFieldValues(r, d = {}) {
  const u = displayUnits(d), out = {};
  const put = (k, v) => { out[k] = typeof v === 'number' ? round(v, 2) : v ?? null; };
  for (const [k, , get] of RECIPE_FIELDS) put(k, r ? get(r, u) : null);
  put(HOP_COUNT[0], r ? HOP_COUNT[2](r) : 0);
  const hops = r?.ingredients?.hops || [], sch = hops.length ? hopSchedule(r, d) : null;
  hops.forEach((h, i) => { for (const [end, , get] of HOP_FIELDS) put(hopFieldName(i + 1, end), get(r, h, u, sch, i) ?? (end === 'Name' || end === 'Date' ? '' : 0)); });
  const ferms = r?.ingredients?.fermentables || [];
  put(GRAIN_COUNT[0], r ? GRAIN_COUNT[2](r) : 0); put(FERM_COUNT[0], r ? FERM_COUNT[2](r) : 0);
  ferms.filter(isGrain).forEach((f, i) => { for (const [end, , get] of GRAIN_FIELDS) put(`rcp_Grain_${i + 1}_${end}`, get(f, u, r) ?? (end === 'Name' ? '' : 0)); });
  ferms.filter(f => !isGrain(f)).forEach((f, i) => { for (const [end, , get] of FERMENTABLE_FIELDS) put(`rcp_Fermentable_${i + 1}_${end}`, get(f, u, r) ?? (end === 'Name' ? '' : 0)); });
  return out;
}
