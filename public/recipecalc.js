// Recipe sums shared by the browser and the Brain (lib/recipe.js imports this file too).
// A Recipe is always kept in kilograms, liters and °C (as BeerXML does). The Default tab says how each amount is shown
// (Fritz, 2026-10-30): the user only sees the results in their own units.

import { hopStands, standOf, standReady, HOP_STANDS } from './brewcalc.js';
export const KG_LB = 2.20462262, KG_OZ = 35.27396195, L_GAL = 0.264172052, L_QT = 1.05668821, L_FLOZ = 33.8140227;
export const cToF = c => c * 9 / 5 + 32, fToC = f => (f - 32) * 5 / 9;
const n = v => Number.isFinite(+v) ? +v : 0;
const round = (v, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

// how each amount shows: [key, label, choices]. The first choice of each is the US one, the second the Metric one (no longer picked:
// Units decides).
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
  // every amount follows Units, US or Metric (OakBarn Brewery, 2026-11-13: "Come From US or Metric so not needed"); a Misc
  // ingredient shows in its own unit, picked on its line
  for (const [k, , ch] of DISPLAY_UNITS) { const keys = Object.keys(ch); out[k] = k === 'miscUnit' ? 'recipe' : keys[metric ? 1 : 0]; }
  return out;
}
// recipe defaults a new Recipe starts with (Fritz: "We will provide the first defaults but can be edited by a User on the Default tab")
export const RECIPE_DEFAULTS = { boilTime: 60, waterToGrain: 2.6, grainTempC: 22.222, hopWarnMinutes: 10, alertMergeMinutes: 1, strikeOffsetC: 0 };

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
// the units a Misc line can pick (OakBarn Brewery, 2026-11-13: "Each its own DDLB Include Tablet, Pack"); MISC_UNITS keeps BeerSmith's order
export const MISC_LINE_UNITS = [...MISC_UNITS, 'tablet', 'pack'];
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
// A line with a Recipe AAU of 0 is not a real hop (a Naga Pepper put in as a hop, Panel Update 9, item 26): it is never asked about, and
// the import gives it an Actual AAU of 0.01, which adds no IBU
const zeroRecipe = h => h.alpha !== null && h.alpha !== undefined && h.alpha !== '' && n(h.alpha) === 0;
export const hopActualProblems = r => (r?.ingredients?.hops || []).map((h, i) => [h, { line: i + 1, name: h.name || '(no name)', aa: h.alphaActual }]).filter(([h, x]) => !(n(x.aa) > 0) && !zeroRecipe(h)).map(([, x]) => x);
// the Actual AAU an imported hop starts with: 0 (to be typed from the package), or 0.01 when its Recipe AAU is 0 (Panel Update 9, item 26)
export const importedActual = alpha => alpha !== null && alpha !== undefined && n(alpha) === 0 ? 0.01 : 0;
// Hop Groups by boil minutes (OakBarn Brewery, 2026-11-21, Panel Update 9, item 24a): Bitter above 20, Flavor above 5 up to 20, Aroma 5 or less
export const hopGroupOf = min => { const m = n(min); return m > 20 ? 'bitter' : m > 5 ? 'flavor' : 'aroma'; };
export const HOP_GROUPS = { bitter: { title: 'Bitter Hops', color: '#f28c28' }, flavor: { title: 'Flavor Hops', color: '#f2d22e' }, aroma: { title: 'Aroma Hops', color: '#3cb043' } };
// 75 -> "01:15:00" (Panel Update 9, item 24d)
export const minutesHms = m => { if (m === null || m === undefined || m === '' || !Number.isFinite(+m)) return ''; const t = Math.round(+m * 60), p = x => String(x).padStart(2, '0'); return `${p(Math.floor(t / 3600))}:${p(Math.floor(t / 60) % 60)}:${p(t % 60)}`; };
// a Dry Hop (or Secondary) Pull Date: its date plus its Days, "YYYY-MM-DD" (Panel Update 9, item 25d); '' when either is missing
export const pullDate = (date, days) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date ?? '')) || !(n(days) >= 0) || days === null || days === '') return ''; const d = new Date(date + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + Math.round(n(days))); return d.toISOString().slice(0, 10); };
export const FERMENTABLE_TYPES = { grain: 'Grain', adjunct: 'Adjunct', extract: 'Extract', 'dry extract': 'Dry Extract', sugar: 'Sugar', fruit: 'Fruit', juice: 'Juice', other: 'Other' };
// The Grain tab holds the fermentables of Type Grain; the Fermentable tab holds every other Type (Fritz, 2026-10-31).
// After Boil is shown only for the Types a brewer adds during or after the boil.
export const isGrain = f => !f.type || f.type === 'grain';
export const AFTER_BOIL_TYPES = ['extract', 'dry extract', 'sugar', 'fruit', 'juice'];
// The Fermentable tab's dropdowns, select from the list only (Fritz's Fermentable tab, 2026-10-31): the BeerXML standard's
// Types (Grain is on the Grain tab) and weights. Each line keeps its own Measurement; the amount is still kept in kg.
export const BEERXML_FERM_TYPES = ['adjunct', 'extract', 'dry extract', 'sugar'];
// The Adjuncts tab (BeerSmith and BeerXML call them Misc): select-only lists from the BeerXML standard
export const MISC_TYPES = ['Spice', 'Fining', 'Water Agent', 'Herb', 'Flavor', 'Other'];
// The Adjunct + dropdown (Panel Update 9, item 28: "add Whirlfloc, Irish Moss, Yeast Nutrients and other common adjuncts and click a
// selection to add. Have an Other Category as a catch all"). A pick adds a line with its name, Type, Use, Measurement and Time filled
// in; the Amount is left for the brewer. Other adds an empty line. Every box can still be changed.
export const COMMON_ADJUNCTS = [
  { name: 'Whirlfloc', type: 'Fining', use: 'boil', unit: 'tablet', time: 15, timeUnit: 'min' },
  { name: 'Irish Moss', type: 'Fining', use: 'boil', unit: 'tsp', time: 15, timeUnit: 'min' },
  { name: 'Yeast Nutrient', type: 'Other', use: 'boil', unit: 'tsp', time: 10, timeUnit: 'min' },
  { name: 'Gypsum', type: 'Water Agent', use: 'mash', unit: 'g', time: 60, timeUnit: 'min' },
  { name: 'Calcium Chloride', type: 'Water Agent', use: 'mash', unit: 'g', time: 60, timeUnit: 'min' },
  { name: 'Epsom Salt', type: 'Water Agent', use: 'mash', unit: 'g', time: 60, timeUnit: 'min' },
  { name: 'Lactic Acid', type: 'Water Agent', use: 'mash', unit: 'ml', time: 60, timeUnit: 'min' },
  { name: 'Campden Tablet', type: 'Water Agent', use: 'mash', unit: 'tablet', time: 60, timeUnit: 'min' },
  { name: 'Gelatin', type: 'Fining', use: 'secondary', unit: 'tsp', time: 3, timeUnit: 'day' },
  { name: 'Coriander Seed', type: 'Spice', use: 'boil', unit: 'oz', time: 5, timeUnit: 'min' },
  { name: 'Orange Peel', type: 'Spice', use: 'boil', unit: 'oz', time: 5, timeUnit: 'min' },
  { name: 'Priming Sugar', type: 'Other', use: 'bottling', unit: 'oz', time: 0, timeUnit: 'min' },
];
export const OTHER_ADJUNCT = { name: '', type: 'Other', use: 'boil', unit: 'items', time: 15, timeUnit: 'min' };
export const MISC_TIME_UNITS = { min: 'Minutes', hr: 'Hours', day: 'Days', week: 'Weeks' };
export const FERM_MEASURES = { lb: 'Pounds (lb)', oz: 'Ounces (oz)', kg: 'Kilograms (kg)', g: 'Grams (g)' };
// Each hop line and yeast line keeps its own unit, whatever Units says (Rule 2.59 exception, Rule 17.18; OakBarn Brewery, 2026-11-19:
// "some Yeasts come as Grams rather than Oz, although most are Packs"; "Hops may be the same. I have always used OZ. But you could
// use grams as more accurate"). A hop's amount is still kept in kg; its unit is how it shows and is typed. A hop line with no unit
// (saved before) follows Units. A yeast amount is kept in its own unit, like an Adjunct (Misc) line.
export const HOP_MEASURES = { oz: 'oz', g: 'g' };
export const hopUnitOf = (h, u = {}) => HOP_MEASURES[h?.unit] ? h.unit : u.hopUnit || 'oz';
export const YEAST_UNITS = { Packs: 'Packs', g: 'g', oz: 'oz', ml: 'ml' };
export const yeastUnitOf = y => YEAST_UNITS[y?.unit] ? y.unit : 'Packs';
// The Yeast tab's select-only lists (OakBarn Brewery's Yeast layout, 2026-11-19). A line from a file with another word keeps it in its list.
export const YEAST_FORMS = ['Dry', 'Liquid', 'Slurry', 'Culture'];
export const YEAST_TYPES = ['Ale', 'Lager', 'Wheat', 'Wine', 'Champagne'];
export const YEAST_FLOCS = ['Low', 'Medium', 'High', 'Very High'];
// "1 Pack", "2 Packs", "11.5 g"
export function yeastAmountText(y) {
  const a = y?.amount ?? 1, un = yeastUnitOf(y);
  return `${round(n(a), 2)} ${un === 'Packs' && n(a) === 1 ? 'Pack' : un}`;
}
// Gravity points (the PPG>SG box, Fritz's Grain tab 2026-10-31): Potential (yield %) x 46.214 (the points of 1 lb of pure
// sugar in 1 gallon) = PPG; points = PPG x pounds x efficiency / gallons in the batch. Grains and adjuncts are mashed, so the
// brewhouse efficiency counts; extracts, sugars, fruit and juice give all their sugar (100%). Expected Gravity = 1 + all points / 1000.
// The efficiency (eff, a %) is only ever the Brewhouse Efficiency of the Equipment Profile of the Recipe's Brew on Tab (Rule 17.13,
// OakBarn Brewery, 2026-11-17: "Never an Overall Effincy defauly only on an Equipment profile"). There is no other number: without
// it, a grain or adjunct has no gravity points (null) and the Expected Gravity is not worked out.
export const PPG_SUGAR = 46.214;
export const mashedFerm = f => isGrain(f) || f?.type === 'adjunct';
export function gravityPoints(f, r, eff) {
  const gal = n(r?.volumes?.batchLiters) * L_GAL; if (!gal || f?.yieldPct === null || f?.yieldPct === undefined || f?.yieldPct === '') return null;
  if (mashedFerm(f) && !(n(eff) > 0)) return null;
  return n(f.yieldPct) / 100 * PPG_SUGAR * n(f.kg) * KG_LB * (mashedFerm(f) ? n(eff) / 100 : 1) / gal;
}
export function expectedGravity(r, eff) {
  const fs = r?.ingredients?.fermentables || []; if (!(n(r?.volumes?.batchLiters) > 0) || !fs.length) return null;
  if (!(n(eff) > 0) && fs.some(mashedFerm)) return null;
  return round(1 + fs.reduce((a, f) => a + (gravityPoints(f, r, eff) || 0), 0) / 1000, 3);
}
// The real Brewhouse Efficiency of one brew (OakBarn Brewery, 2026-11-17: "Things that affect Efficiency: Grain Grind, Mash Conversion,
// Sparge and maybe others. Hard to keep track of all those variables, but easy to track the Efficiency We should do that."): the gravity
// points measured in the fermenter (OG and the volume into it), less what the sugars and extracts gave (100 %), over the most the grains
// and adjuncts could give. og: a specific gravity (1.052); liters: into the fermenter. A % with 1 decimal, or null.
export function measuredEfficiency(r, og, liters) {
  const gal = n(liters) * L_GAL, g = n(og);
  if (!(gal > 0) || !(g > 1) || g > 1.2) return null;
  const pts = f => n(f.yieldPct) / 100 * PPG_SUGAR * n(f.kg) * KG_LB;
  const fs = (r?.ingredients?.fermentables || []).filter(f => n(f.kg) > 0 && n(f.yieldPct) > 0);
  const most = fs.filter(mashedFerm).reduce((a, f) => a + pts(f), 0), sugar = fs.filter(f => !mashedFerm(f)).reduce((a, f) => a + pts(f), 0);
  if (!(most > 0)) return null;
  const eff = ((g - 1) * 1000 * gal - sugar) / most * 100;
  return eff > 0 && eff < 150 ? Math.round(eff * 10) / 10 : null;
}
// the average Efficiency of the last brews (OakBarn Brewery, 2026-11-17: "Average over 10 brews with same schema"; "Track by schema")
export const EFF_AVERAGE_OF = 10;
// by Tab (its hidden key on the Brain, its stand-in in the browser): a Tab keeps its own Equipment numbers (Rule 2.62)
export function averageEfficiency(log = [], tabKey) {
  const last = log.filter(x => x && (!tabKey || Object.values(x.tab || {})[0] === tabKey) && n(x.eff) > 0).slice(-EFF_AVERAGE_OF);
  return last.length ? { avg: Math.round(last.reduce((a, x) => a + n(x.eff), 0) / last.length * 10) / 10, count: last.length, last } : null;
}
export const MISC_USES = { boil: 'Boil', mash: 'Mash', primary: 'Primary', secondary: 'Secondary', bottling: 'Bottling', other: 'Other' };
export const boilKind = min => min >= 30 ? 'Bitter' : min >= 10 ? 'Flavor' : 'Aroma';

// The four Recipe Levels (OakBarn Brewery, 2026-11-11: "WE need 4 Recipes Level"; "Separate so a User Chooses the level").
// The user picks the Level; the Recipe tab then shows only the boxes and Daughter Tabs that Level uses. Nothing is deleted when
// the Level changes: a box that is not shown keeps its value. type is the BeerXML word for the same thing (Extract, Partial
// Mash, All Grain), so a BeerXML or BeerSmith file brings its Level in and a saved Recipe says the same thing both ways.
//   tabs: the Daughter Tabs shown (Waters on every Level, default Tap Water). hide: the Recipe tab boxes (their Skynet_Field) not shown.
//   fermTypes: the Types the Fermentable tab offers (OakBarn Brewery, 2026-11-11: "on the Level 1 and 2 only Extracts").
const MASH_BOXES = ['skn_rcp_Total_Grain_Weight', 'skn_rcp_First_Mash_Temp', 'skn_rcp_Strike_Volume', 'skn_rcp_Strike_Temp', 'skn_rcp_Grain_Temp', 'skn_rcp_Sparge_Volume',
  'skn_rcp_Sparge_Type', 'skn_rcp_Sparge_Minutes', 'skn_rcp_Sparge_Temp', 'skn_rcp_Grain_Ratio'];
export const RECIPE_LEVELS = [
  { level: 1, name: '1 Can Kit', title: 'Level 1: Extract Can Kit', type: 'Extract', about: 'For a beginner brewer: a can of hopped malt extract, often with sugar or dry malt extract, then the yeast. No grain and no hops to add.',
    tabs: ['fermentables', 'yeast', 'adjuncts', 'waters'], hide: [...MASH_BOXES, 'skn_rcp_IBU', 'skn_rcp_Whirlpool_Minutes'], fermTypes: ['extract', 'dry extract'] },
  { level: 2, name: '2 Extract', title: 'Level 2: Extract', type: 'Extract', about: 'Malt extract (liquid or dry) boiled with your own hops. No grain.',
    tabs: ['hops', 'posthops', 'drops', 'fermentables', 'yeast', 'adjuncts', 'waters'], hide: MASH_BOXES, fermTypes: ['extract', 'dry extract'] },
  { level: 3, name: '3 Partial Grain', title: 'Level 3: Extract with Partial Grain and Hops', type: 'Partial Mash', about: 'Malt extract plus some grain mashed or steeped in a small amount of water, and your own hops.',
    tabs: ['hops', 'posthops', 'drops', 'grain', 'fermentables', 'yeast', 'adjuncts', 'waters', 'mash'], hide: [], fermTypes: BEERXML_FERM_TYPES },
  { level: 4, name: '4 All Grain', title: 'Level 4: All Grain', type: 'All Grain', about: 'All the sugar comes from mashed grain, then the sparge, the boil and your own hops.',
    tabs: ['hops', 'posthops', 'drops', 'grain', 'fermentables', 'yeast', 'adjuncts', 'waters', 'mash'], hide: [], fermTypes: BEERXML_FERM_TYPES },
];
// Brewer Type (OakBarn Brewery, 2026-11-25, "No Recipe Found": "Choice default is set by brewer Type from Skynet Settings"): what this
// brewery usually brews, on ☰ Menu > Default settings (Rule 2.42). It picks the first choice of the No Recipe Found pop-up (Rule 16.14),
// whose choices are his list, word for word: a Saved Recipe, then the four kinds of brewer, each a NEW Recipe at its Level (Rule 17.11).
// All Grain (own Grain Mill) is a Level 4 Recipe too; the mill is the brewery's (the "Is the grain milled?" question waits for PreBrew).
export const BREWER_TYPES = [
  { key: 'cankit', name: 'Extract Can Kit', level: 1 },
  { key: 'partial', name: 'Extract Partial Grain and Hops', level: 3 },
  // OakBarn Brewery, 2026-11-27: "Add All in One Brewer and BIAB to brewer types": both mash their own grain (All Grain recipes)
  { key: 'biab', name: 'BIAB (Brew in a Bag)', level: 4 },
  { key: 'allinone', name: 'All In One Brewer', level: 4 },
  { key: 'allgrain', name: 'All Grain', level: 4 },
  { key: 'allgrainmill', name: 'All Grain (own Grain Mill)', level: 4 },
];
export const BREWER_TYPE_DEFAULT = 'allgrain';
export const brewerTypeOf = d => BREWER_TYPES.find(x => x.key === d?.brewerType) ?? BREWER_TYPES.find(x => x.key === BREWER_TYPE_DEFAULT);
// a Recipe's Level: the one picked, else from its BeerXML type (an imported file), else 4 All Grain
export function recipeLevel(r) {
  const l = +r?.level; if (RECIPE_LEVELS.some(x => x.level === l)) return l;
  const t = String(r?.type || '').toLowerCase();
  return t === 'extract' ? 2 : t === 'partial mash' ? 3 : 4;
}
export const levelOf = r => RECIPE_LEVELS.find(x => x.level === recipeLevel(r));
export const levelShowsTab = (r, tab) => levelOf(r).tabs.includes(tab);
export const levelFermTypes = r => levelOf(r).fermTypes;
export const levelShowsBox = (r, field) => !levelOf(r).hide.includes(field);

// A new User Recipe (NEW on the Recipe tab): the Default settings Tab's New User Recipes, else NEW_RECIPE; its Boil Time comes from
// its Boil Profile (boil = the Boil Profiles, lib/profiles.js)
export function newUserRecipe(d = {}, boil = []) {
  const r = blankRecipe({ ...NEW_RECIPE, ...d });
  const bp = boil.find(x => x.id === r.boilProfile);
  if (bp && Number.isFinite(+bp.boilTime)) r.boilTime = +bp.boilTime;
  return r;
}
export function blankRecipe(d = {}) {
  const D = { ...RECIPE_DEFAULTS, ...pickNums(d) };
  return {
    sourceFormat: 'manual', sourceVersion: null, sourceFile: null, name: '', level: 4, type: 'All Grain', style: '', brewer: '', assistantBrewer: '', notes: '',
    volumes: { batchLiters: +d.batchL > 0 ? +d.batchL : null, boilLiters: null },
    boilTime: D.boilTime, fileEfficiency: null, brewOn: null, og: null, fg: null, ibu: null, color: null,
    waterToGrain: D.waterToGrain, grainTempC: D.grainTempC,
    // the boxes on the Recipe tab (Fritz's layout, 2026-10-31). Calculate fills grainKg, firstMashC, ibuCalc, strike and sparge.
    grainKg: null, firstMashC: null, ibuCalc: null, expectedSG: null, strikeLiters: null, strikeTempC: null,
    spargeType: 'batch', spargeLiters: null, spargeMinutes: null, spargeTempC: null, whirlpoolMinutes: null, pitchTempC: null,
    mashProfile: d.mashProfile || '', boilProfile: d.boilProfile || '', waterProfile: d.waterProfile || '',
    ingredients: { fermentables: [], hops: [], yeasts: [], miscs: [], waters: [] },
    mash: { profileName: null, grainTempC: null, spargeTempC: null, steps: [] },
  };
}
// What a new User Recipe starts with (OakBarn Brewery, 2026-11-16, Default Tab 3: "set all the defaults for a 5 gal Batch, 60 min Boil,
// 60 Minute Mash"): 5 gallons kept as liters, Skynet Single Step, Batch Sparge (152 °F for 60 minutes), Skynet 60 Minute Boil.
// Grain at 72 °F for planning ("Remove but use 72 for planning"). The Brewhouse Efficiency is not here: it is only on an Equipment
// Profile (Rule 17.13; a new Equipment Profile starts at 72 %).
export const NEW_RECIPE = { batchL: 18.927, mashProfile: 'skynet-single-batch', boilProfile: 'skynet-boil-60' };
// not on the Default settings Tab any more (Default Tab 3): Brewhouse Efficiency and Strike Offset belong to the Equipment Profile,
// the Grain Temperature is 72 °F for planning, and the Boil Time comes from the Boil Profile
const NOT_A_DEFAULT = ['grainTempC', 'strikeOffsetC', 'boilTime'];
function pickNums(d) {
  const out = {};
  for (const k of Object.keys(RECIPE_DEFAULTS)) if (!NOT_A_DEFAULT.includes(k) && d[k] !== undefined && d[k] !== '' && Number.isFinite(+d[k])) out[k] = +d[k];
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
// strikeOffC: the Brew on Tab's Strike offset in °C (Panel Updates entry 14), added to the Strike Temperature; none is 0
export function calculateRecipe(r, d = {}, mp = null, absorbLkg = 1.0, eff = null, strikeOffC = 0) {
  const tt = recipeTotals(r, d, mp, strikeOffC), first = firstMashStep(r, mp);
  const pre = n(r?.volumes?.boilLiters);
  const spargeL = pre && tt.strikeL ? Math.max(0, pre - (tt.strikeL - tt.grainKg * absorbLkg)) : null;
  const spargeC = r?.spargeTempC ?? (mp?.spargeTemp !== undefined ? (mp.units === 'Metric' ? n(mp.spargeTemp) : fToC(n(mp.spargeTemp))) : r?.mash?.spargeTempC ?? null);
  return { expectedSG: expectedGravity(r, eff), grainKg: tt.grainKg, firstMashC: first ? round(n(first.tempC), 1) : null, ibuCalc: tinsethIbu(r), strikeLiters: tt.strikeL || null, strikeTempC: tt.strikeC,
    spargeLiters: spargeL === null ? null : round(spargeL, 2), spargeTempC: spargeC === null ? null : round(spargeC, 1), spargeType: r?.spargeType || mp?.sparge || 'batch',
    spargeMinutes: r?.spargeMinutes ?? (mp?.batchRest ?? null) };
}
export function recipeTotals(r, d = {}, mp = null, strikeOffC = 0) {
  const D = { ...RECIPE_DEFAULTS, ...pickNums(d) };
  const f = r?.ingredients?.fermentables || [];
  const grainKg = f.filter(x => !x.type || x.type === 'grain' || x.type === 'adjunct').reduce((a, x) => a + n(x.kg), 0);
  const allKg = f.reduce((a, x) => a + n(x.kg), 0);
  const hopKg = (r?.ingredients?.hops || []).reduce((a, x) => a + n(x.kg), 0);
  const ratio = n(r?.waterToGrain) || D.waterToGrain, grainT = r?.grainTempC ?? D.grainTempC;
  const first = firstMashStep(r, mp);
  const strikeL = grainKg * ratio;
  const strikeC = first && grainKg ? (0.41 / ratio) * (n(first.tempC) - n(grainT)) + n(first.tempC) + n(D.strikeOffsetC) + n(strikeOffC) : null;
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
// The Post Boil hops (OakBarn Brewery, 2026-11-23: "there needs to be a Pre Warning that includes ALL of the Post Boil Hops. That
// needs to be a 10 minutes remaining in the Boil. Hop stands get own Drop Alert based on Whirlpool/Chiller Timer and Temperatures.
// Post Boil In Fermenter get alert after all Fermenters are filled to basically set a reminder on their Phone"; Rule 17.20):
// - one Pre Warning 10 minutes before the end of the boil lists every Whirlpool, Hop Stand, Secondary and Dry Hop hop;
// - a Whirlpool hop whose Hop Stand has its temperature and time is in that stand's group, with no timed alert: its drop alert
//   is sent by the Process when the wort reaches the stand's temperature (hop_alert "Hop Stand High"); a Whirlpool hop with no
//   ready stand keeps its drop at flame out;
// - the Secondary and Dry Hop hops make one Fermenter reminder (hop_alert "Fermenter"), sent when every Fermenter is filled.
// The Pre Boil hops (OakBarn Brewery, 2026-11-23: "Pre Boil Hops need a Pre Warning when Strike Water Reaches Strike. Mash Hops need
// Drop Warning just after Mash Timer Begins"; "If the go in before 1st Run, thats when the Drop Alert Should be"): hop_alert "Pre Boil",
// hop_alert "Mash", hop_alert "1st Wort", each sent by the Process at that moment (processAlerts below) All Grain Recipes only ("These will only be for all grain
// Brewers as the other lower levels have none").
// bp: the Recipe's Boil Profile (its Hop Stand boxes), as the Process reads them (lib/brewprocess.js).
export const POST_BOIL_WARN_MINUTES = 10;
export function hopSchedule(r, d = {}, bp = null) {
  const D = { ...RECIPE_DEFAULTS, ...pickNums(d) }, u = displayUnits(d);
  const boil = n(r?.boilTime) || D.boilTime, warn = Math.max(0, D.hopWarnMinutes), merge = Math.max(0, D.alertMergeMinutes);
  const hopText = h => `${fmtW(hopKgToUse(h), hopUnitOf(h, u))} ${h.name || 'hop'}`;
  const groups = new Map(), hopKey = [];
  const stands = hopStands(r, null, bp), readyStand = h => { const s = stands.find(x => x.key === standOf(h, stands)); return standReady(s) ? s : null; };
  const tU = `°${u.tempUnit}`, standTemp = s => `${round(cTo(s.tempC, u.tempUnit), 0)} ${tU}`;
  const add = (key, g, what) => { if (!groups.has(key)) groups.set(key, { ...g, items: [] }); groups.get(key).items.push(what); if (what.kind === 'hop') hopKey.push(key); };
  for (const h of r?.ingredients?.hops || []) {
    const use = HOP_USES[h.use] ? h.use : 'boil', t = n(h.time);
    if (use === 'mash') add('mash', { phase: 'mash', order: 1, label: 'Top of Mash' }, { kind: 'hop', text: hopText(h) });
    else if (use === 'first wort') add('fw', { phase: 'first wort', order: 2, label: '1st Wort' }, { kind: 'hop', text: hopText(h) });
    else if (use === 'whirlpool' && readyStand(h)) {
      const s = readyStand(h), si = HOP_STANDS.findIndex(([k]) => k === s.key);
      add('hs' + s.key, { phase: 'whirlpool', order: 7.1 + si / 10, label: `Hop Stand ${s.label} (${standTemp(s)}, ${s.min} min)`, stand: s.key, standLabel: s.label, tempC: s.tempC, standMin: s.min },
        { kind: 'hop', text: hopText(h) + (h.hopRocket ? ' (Hop Rocket)' : '') });
    }
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
    if (warn && g.at > 0 && g.phase !== 'whirlpool') raw.push({ at: Math.max(0, g.at - warn), kind: 'warn', group: g.group, text: `${warn} minute warning: get ${name} ready: ${g.what}` });
    raw.push({ at: g.at, kind: 'drop', group: g.group, text: g.phase === 'whirlpool' ? `Flame out. Add the Whirlpool hops now: ${g.what}` : `Add ${name} now: ${g.what}` });
  }
  // the Post Boil Pre Warning: every hop that goes in after the boil, 10 minutes before its end
  const post = list.filter(g => ['whirlpool', 'secondary', 'dry hop'].includes(g.phase)), named = g => `${g.label === 'Whirlpool' ? 'Whirlpool (flame out)' : g.label}: ${g.what}`;
  if (post.length) raw.push({ at: Math.max(0, boil - POST_BOIL_WARN_MINUTES), kind: 'warn', group: null, post: true,
    text: `${POST_BOIL_WARN_MINUTES} minutes left in the boil: get the Post Boil hops ready: ${post.map(named).join('; ')}` });
  raw.sort((a, b) => a.at - b.at || (a.kind === 'drop' ? -1 : 1));
  const alerts = [], conflicts = [];
  for (const a of raw) {
    const last = alerts[alerts.length - 1];
    if (last && a.at - last.at <= merge) {
      last.parts.push(a); last.kind = last.parts.some(p => p.kind === 'drop') ? 'drop' : 'warn';
      conflicts.push({ at: last.at, text: `${a.kind === 'drop' ? 'Drop' : 'Warning'} for ${a.group ? 'Hop Group ' + a.group : a.post ? 'the Post Boil hops' : 'hops'} at ${round(a.at, 1)} min lands with ${last.parts.length > 2 ? 'other alerts' : (last.parts[0].kind === 'drop' ? 'a drop' : 'a warning')} at ${round(last.at, 1)} min: one alert has both` });
    } else alerts.push({ at: a.at, kind: a.kind, parts: [a] });
  }
  for (const a of alerts) {
    a.parts.sort((x, y) => (x.kind === 'drop' ? 0 : 1) - (y.kind === 'drop' ? 0 : 1));     // what goes in now first, then what to get ready
    a.text = a.parts.map(p => p.text).join('\n'); a.speak = a.parts.map(p => p.text).join('. Also, ').replace(/\n/g, '. '); a.left = boil - a.at;
    a.audio = `Audio/Hops/${audioName(a.at, a.speak)}`;     // a voice file of its own words, when one is put there (media/Audio/Hops)
  }
  // each hop line's Boil Group (the Hop N Boil Group box): its group number, or null when it is not a Boil or Whirlpool hop
  const hopGroups = hopKey.map(k => groups.get(k).group ?? null);
  // the alerts a Process sends with hop_alert "<which>" (Rule 17.20), when the brew gets there: they have no boil minute
  const sent = (which, kind, text, extra) => ({ which, kind, at: null, left: null, text, speak: text, audio: `Audio/Hops/${audioName(0, which + ' ' + text)}`, ...extra });
  // the Pre Boil alerts are for All Grain (Level 4) only (OakBarn Brewery, 2026-11-23: "These will only be for all grain Brewers as the
  // other lower levels have none")
  const of = (...phases) => list.filter(g => phases.includes(g.phase)), allGrain = recipeLevel(r) === 4, pre = allGrain ? of('mash', 'first wort') : [];
  const processAlerts = [
    ...(pre.length ? [sent('Pre Boil', 'warn', `The Strike Water is at Strike. Get the Pre Boil hops ready: ${pre.map(g => `${g.label}: ${g.what}`).join('; ')}`)] : []),
    ...(allGrain ? of('mash') : []).map(g => sent('Mash', 'drop', `The Mash Timer has started. Add the Top of Mash hops now: ${g.what}`)),
    ...(allGrain ? of('first wort') : []).map(g => sent('1st Wort', 'drop', `The First Run is about to start. Add the 1st Wort hops to the kettle now: ${g.what}`)),
    ...list.filter(g => g.stand).map(g => sent(`Hop Stand ${g.standLabel}`, 'drop',
      `Hop Stand ${g.standLabel}: the wort is at ${standTemp({ tempC: g.tempC })}. Add the Hop Stand ${g.standLabel} hops now: ${g.what}. Cooling water off for ${g.standMin} minutes.`, { stand: g.stand, group: g.group })),
    ...(of('secondary', 'dry hop').length ? [sent('Fermenter', 'drop', `The Fermenters are filled. Set a reminder on your phone for the Fermenter hops: ${of('secondary', 'dry hop').map(g => `${g.label}: ${g.what}`).join('; ')}.`)] : []),
  ];
  return { boilTime: boil, warnMinutes: warn, groups: list, alerts, conflicts, hopGroups, processAlerts };
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
// Recipe tab has a fixed Skynet name (skn_rcp_), the same names the Brew Process reads (lib/brewprocess.js). A Skynet name is
// never changed by the user (Rule 3.11). [name, what it is, how to read it from a Recipe in the panel's display units]
export const RECIPE_FIELDS = [
  ['skn_rcp_Name', 'Beer Name', r => r.name ?? ''],
  ['skn_rcp_Style', 'Style', r => r.style ?? ''],
  ['skn_rcp_Level', 'Recipe Level: 1 Can Kit, 2 Extract, 3 Partial Grain, 4 All Grain', r => recipeLevel(r)],
  ['skn_rcp_Batch_Volume', 'Brew Length (batch size into the fermenter)', (r, u) => lTo(r.volumes?.batchLiters, u.volumeUnit)],
  ['skn_rcp_Total_Grain_Weight', 'Grain Wt. (calculated)', (r, u) => kgTo(r.grainKg, u.grainUnit)],
  ['skn_rcp_First_Mash_Temp', '1st Mash (calculated)', (r, u) => cTo(r.firstMashC, u.tempUnit)],
  ['skn_rcp_IBU', 'IBU (calculated)', r => r.ibuCalc],
  ['skn_rcp_Expected_Gravity', 'Expected Gravity (calculated: 1 + the gravity points of every grain and fermentable / 1000)', r => r.expectedSG],
  ['skn_rcp_Strike_Volume', 'Strike Volume', (r, u) => lTo(r.strikeLiters, u.volumeUnit)],
  ['skn_rcp_Strike_Temp', 'Strike Temperature', (r, u) => cTo(r.strikeTempC, u.tempUnit)],
  ['skn_rcp_Grain_Temp', 'Grain Temperature', (r, u) => cTo(r.grainTempC, u.tempUnit)],
  ['skn_rcp_Sparge_Volume', 'Sparge Volume', (r, u) => lTo(r.spargeLiters, u.volumeUnit)],
  ['skn_rcp_Sparge_Type', 'Sparge Type (batch, fly, none)', r => r.spargeType ?? ''],
  ['skn_rcp_Sparge_Minutes', 'Sparge Minutes', r => r.spargeMinutes],
  ['skn_rcp_Sparge_Temp', 'Sparge Temperature', (r, u) => cTo(r.spargeTempC, u.tempUnit)],
  ['skn_rcp_Boil_Volume', 'PreBoil Volume', (r, u) => lTo(r.volumes?.boilLiters, u.volumeUnit)],
  ['skn_rcp_Boil_Minutes', 'Boil Minutes', r => r.boilTime],
  ['skn_rcp_Whirlpool_Minutes', 'Whirlpool Minutes', r => r.whirlpoolMinutes],
  ['skn_rcp_Boil_Profile', 'Boil Profile (its id)', r => r.boilProfile ?? ''],
  // the three Hop Stands: the Recipe's own numbers here (the Brain fills in the rest from the Boil Profile and Default settings)
  ...[['High', 'High'], ['Middle', 'Middle'], ['Low', 'Low']].flatMap(([k, l]) => [[`skn_rcp_Hop_Stand_${k}_Temp`, `Hop Stand ${l} temperature`, (r, u) => cTo(r.hopStands?.[k]?.tempC, u.tempUnit)],
    [`skn_rcp_Hop_Stand_${k}_Minutes`, `Hop Stand ${l} minutes`, r => r.hopStands?.[k]?.min]]),
  ['skn_rcp_Pitch_Temp', 'Pitch At', (r, u) => cTo(r.pitchTempC, u.tempUnit)],
  ['skn_rcp_Grain_Ratio', 'Grain Ratio', (r, u) => ratioTo(r.waterToGrain, u.ratioUnit)],
  // Daughter Tabs (their own fields come when Fritz sends each layout)
  ['skn_rcp_Water_Profile', 'Waters: the Water Profile (its id)', r => r.waterProfile ?? ''],
  ['skn_rcp_Mash_Profile', 'MASH: the Mash Profile (its id; empty = the mash from the recipe file)', r => r.mashProfile ?? ''],
];
// Waters tab: the Water Profile's minerals after the distilled cut (ppm). The Brew Process fills them from the profile
// (lib/brewprocess.js recipeValues); a Recipe alone does not hold them.
export const WATER_FIELDS = [...WATER_IONS.map(([k, t]) => [`skn_rcp_Water_${k === 'so4' ? 'SO4' : k === 'hco3' ? 'HCO3' : k[0].toUpperCase() + k.slice(1)}`, `Waters: ${t}, ppm after the distilled cut`, k]),
  ['skn_rcp_Water_Distilled_Pct', 'Waters: % distilled or RO water', 'distilledPct'], ['skn_rcp_Water_SO4_Cl', 'Waters: sulfate to chloride ratio', 'so4cl'], ['skn_rcp_Water_PH', 'Waters: pH', 'ph']];
// the values of WATER_FIELDS from a Water Profile (null: none picked)
export function waterFieldValues(wp) {
  const b = wp ? { ...blendWater(wp), distilledPct: +wp.distilledPct || 0, ph: wp.ph ?? null } : {};
  return Object.fromEntries(WATER_FIELDS.map(([k, , key]) => [k, wp ? b[key] ?? 0 : 0]));
}
// MASH tab lines: skn_rcp_Mash_Step_N_Name, _Temp, _Time (filled by the Brew Process from the Mash Profile or the recipe's mash)
const MASH_STEP_FIELD = /^skn_rcp_Mash_Step_(\d+)_(Name|Temp|Time)$/;
// The Hops tab: one set of Skynet_Fields for each hop line, N = the line number (skn_rcp_Hop_1_Name, skn_rcp_Hop_2_Name ...), so there
// is no limit on the hops. [the end of the name, what it is, how to read it (r, hop, display units, the hop schedule, line index)]
function r_h_stand(r, h) { return h.use === 'whirlpool' ? standOf(h, hopStands(r)) : ''; }
export const HOP_FIELDS = [
  ['Name', 'Hop N: the hop', (r, h) => h.name ?? ''],
  ['Amount', 'Hop N: the amount in the recipe, in its Measurement (oz or g)', (r, h, u) => kgTo(h.kg, hopUnitOf(h, u))],
  ['Measurement', 'Hop N: oz or g, the hop line\'s own unit', (r, h, u) => hopUnitOf(h, u)],
  ['AA_Recipe', 'Hop N: AAU % of the recipe', (r, h) => h.alpha],
  ['AA_Actual', 'Hop N: AAU % Actual, of the hops on hand (must be above 0)', (r, h) => h.alphaActual],
  ['Calc_Amount', 'Hop N: Calc oz (or g), the amount to use with the Actual AAU, in its Measurement', (r, h, u) => kgTo(hopKgToUse(h), hopUnitOf(h, u))],
  ['Use', 'Hop N: Boil, Mash, 1st Wort, Secondary, Dry Hop or Whirlpool', (r, h) => HOP_USES[h.use] ? h.use : 'boil'],
  ['Min', 'Hop N Min: boil minutes (Whirlpool: whirlpool minutes)', (r, h) => h.use === 'boil' || h.use === 'whirlpool' || !HOP_USES[h.use] ? n(h.time) : 0],
  ['Drop', 'Hop N Drop: minutes into the boil when it goes in', (r, h) => h.use === 'boil' || !HOP_USES[h.use] ? Math.max(0, (n(r.boilTime) || RECIPE_DEFAULTS.boilTime) - Math.min(n(h.time), n(r.boilTime) || RECIPE_DEFAULTS.boilTime)) : 0],
  ['IBU', 'Hop N IBU', (r, h) => hopIbu(r, h)],
  ['Boil_Group', 'Hop N Boil Group (0 = not a Boil Hop)', (r, h, u, sch, i) => sch.hopGroups[i] ?? 0],
  ['Days', 'Hop N: Secondary or Dry Hop days', (r, h) => h.use === 'secondary' || h.use === 'dry hop' ? n(h.dryDays) : 0],
  ['Date', 'Hop N: Secondary or Dry Hop date (YYYY-MM-DD)', (r, h) => h.use === 'secondary' || h.use === 'dry hop' ? h.date ?? '' : ''],
  ['Hop_Stand', 'Hop N: its Hop Stand (High, Middle or Low; empty = not a Whirlpool hop, or no stand picked yet)', r_h_stand],
  ['Whirlpool_Temp', 'Hop N: Whirlpool temperature (its Hop Stand\'s)', (r, h, u) => { const st = h.use === 'whirlpool' ? hopStands(r).find(s => s.key === r_h_stand(r, h)) : null; return st && st.tempC !== null ? cTo(st.tempC, u.tempUnit) : 0; }],
  ['Hop_Rocket', 'Hop N: Whirlpool through the Hop Rocket (true or false)', (r, h) => h.use === 'whirlpool' && !!h.hopRocket],
];
export const HOP_FIELD = /^skn_rcp_Hop_(\d+)_([A-Za-z_]+)$/;
// The Grain tab and the Fermentable tab: skn_rcp_Grain_N_... and skn_rcp_Fermentable_N_..., N = the line number on that tab
export const GRAIN_FIELDS = [
  ['Name', 'Grain N: the grain', f => f.name ?? ''],
  ['Amount', 'Grain N: the amount (lb or kg)', (f, u) => kgTo(f.kg, u.grainUnit)],
  ['Potential', 'Grain N: Potential (yield %)', f => f.yieldPct],
  ['SRM', 'Grain N: color in SRM', f => f.color],
  ['PPG_SG', 'Grain N: PPG>SG, its gravity points', (f, u, r, eff) => gravityPoints(f, r, eff)],
];
export const FERMENTABLE_FIELDS = [
  ['Name', 'Fermentable N: the fermentable', f => f.name ?? ''],
  ['Type', 'Fermentable N: Adjunct, Extract, Dry Extract, Sugar, Fruit, Juice or Other', f => f.type || 'other'],
  ['Amount', 'Fermentable N: the amount, in its Measurement', (f, u) => kgTo(f.kg, FERM_MEASURES[f.unit] ? f.unit : u.grainUnit)],
  ['Measurement', 'Fermentable N: lb, oz, kg or g', (f, u) => FERM_MEASURES[f.unit] ? f.unit : u.grainUnit],
  ['Potential', 'Fermentable N: Potential (yield %)', f => f.yieldPct],
  ['SRM', 'Fermentable N: color in SRM', f => f.color],
  ['PPG_SG', 'Fermentable N: PPG>SG, its gravity points', (f, u, r, eff) => gravityPoints(f, r, eff)],
  ['After_Boil', 'Fermentable N: added after the boil (true or false)', f => AFTER_BOIL_TYPES.includes(f.type) && !!f.addAfterBoil],
];
export const ADJUNCT_FIELDS = [
  ['Name', 'Adjunct N: the adjunct (Whirlfloc, yeast nutrient, gypsum ...)', m => m.name ?? ''],
  ['Amount', 'Adjunct N: the amount, in its Measurement', m => m.amount],
  ['Measurement', 'Adjunct N: g, oz, tsp, items ...', m => m.unit ?? ''],
  ['Type', 'Adjunct N: Spice, Fining, Water Agent, Herb, Flavor or Other', m => m.type ?? ''],
  ['Use', 'Adjunct N: Boil, Mash, Primary, Secondary or Bottling', m => m.use ?? ''],
  ['Time', 'Adjunct N: how long (Boil: minutes left in the boil when it goes in)', m => m.time],
  ['Time_Unit', 'Adjunct N: min, hr, day or week', m => m.timeUnit || 'min'],
];
// The Yeast lines (Rule 17.18): skn_rcp_Yeast_N_Name, _Amount, _Measurement (Packs, g, oz or ml). skn_rcp_Yeast_Name stays the first yeast.
export const YEAST_FIELDS = [
  ['Name', 'Yeast N: the yeast', y => y.name ?? ''],
  ['Form', 'Yeast N: Dry, Liquid, Slurry or Culture', y => y.form ?? ''],
  ['Amount', 'Yeast N: the amount, in its Measurement', y => n(y.amount ?? 1)],
  ['Measurement', 'Yeast N: Packs, g, oz or ml', y => yeastUnitOf(y)],
  ['Attenuation', 'Yeast N: Attenuation %', y => y.attenuation ?? 0],
  ['Min_Temp', 'Yeast N: lowest fermenting temperature', (y, u) => cTo(y.minTempC, u.tempUnit) ?? 0],
  ['Max_Temp', 'Yeast N: highest fermenting temperature', (y, u) => cTo(y.maxTempC, u.tempUnit) ?? 0],
  ['Lab', 'Yeast N: the lab (Fermentis, Wyeast ...)', y => y.lab ?? ''],
  ['Product_ID', 'Yeast N: the lab\'s Product ID (US-05, 1056 ...)', y => y.productId ?? ''],
  ['Type', 'Yeast N: Ale, Lager, Wheat, Wine or Champagne', y => y.type ?? ''],
  ['Flocculation', 'Yeast N: Low, Medium, High or Very High', y => y.flocculation ?? ''],
  ['Starter', 'Yeast N: a yeast starter (true or false)', y => !!y.starter],
  ['Starter_Size', 'Yeast N: the starter size (gal or L)', (y, u) => y.starter ? lTo(y.starterL, u.volumeUnit) ?? 0 : 0],
  ['Times_Cultured', 'Yeast N: times cultured', y => y.timesCultured ?? 0],
  ['Mfg_Date', 'Yeast N: manufacture date (YYYY-MM-DD)', y => y.mfgDate ?? ''],
  ['Notes', 'Yeast N: notes', y => y.notes ?? ''],
];
const LINE_FIELD = /^skn_rcp_(Grain|Fermentable|Adjunct|Yeast)_(\d+)_([A-Za-z_]+)$/;
const LINE_LISTS = { grain: () => GRAIN_FIELDS, fermentable: () => FERMENTABLE_FIELDS, adjunct: () => ADJUNCT_FIELDS, yeast: () => YEAST_FIELDS };
const GRAIN_COUNT = ['skn_rcp_Grain_Count', 'Grain tab: how many grain lines', r => (r.ingredients?.fermentables || []).filter(isGrain).length];
// a line field (any case) of the Hops, Grain or Fermentable tab: its empty value (a line past the Count reads as this), else undefined
export function lineFieldEmpty(name) {
  const s = String(name), h = new RegExp(HOP_FIELD.source, 'i').exec(s), g = new RegExp(LINE_FIELD.source, 'i').exec(s);
  const end = h ? HOP_FIELDS.find(x => x[0].toLowerCase() === h[2].toLowerCase())?.[0]
    : g ? LINE_LISTS[g[1].toLowerCase()]().find(x => x[0].toLowerCase() === g[3].toLowerCase())?.[0] : undefined;
  if (!end) return /^skn_rcp_(Hop|Grain|Fermentable|Adjunct|Yeast)_Count$/i.test(s) ? 0 : undefined;
  return ['Name', 'Use', 'Date', 'Type', 'Measurement', 'Time_Unit', 'Form', 'Lab', 'Product_ID', 'Flocculation', 'Mfg_Date', 'Notes'].includes(end) ? '' : ['Hop_Rocket', 'After_Boil', 'Starter'].includes(end) ? false : 0;
}
const FERM_COUNT = ['skn_rcp_Fermentable_Count', 'Fermentable tab: how many lines', r => (r.ingredients?.fermentables || []).filter(f => !isGrain(f)).length];
const ADJ_COUNT = ['skn_rcp_Adjunct_Count', 'Adjuncts tab: how many lines', r => (r.ingredients?.miscs || []).length];
const YEAST_COUNT = ['skn_rcp_Yeast_Count', 'Yeast tab: how many yeast lines', r => (r.ingredients?.yeasts || []).length];
export const hopFieldName = (line, end) => `skn_rcp_Hop_${line}_${end}`;
const HOP_COUNT = ['skn_rcp_Hop_Count', 'Hops tab: how many hop lines', r => (r.ingredients?.hops || []).length];
// a Skynet_Field by its name: the Recipe tab's, skn_rcp_Hop_Count, or one of a hop line (any line number)
export const recipeField = name => {
  const ms = MASH_STEP_FIELD.exec(name); if (ms) return [name, `MASH: step ${ms[1]} ${ms[2].toLowerCase()}`, () => null];
  const wf = WATER_FIELDS.find(x => x[0] === name); if (wf) return [name, wf[1], () => null];
  for (const c of [HOP_COUNT, GRAIN_COUNT, FERM_COUNT, ADJ_COUNT, YEAST_COUNT]) if (name === c[0]) return c;
  const g = LINE_FIELD.exec(name), gf = g && LINE_LISTS[g[1].toLowerCase()]().find(x => x[0] === g[3]);
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
  ferms.filter(isGrain).forEach((f, i) => { for (const [end, , get] of GRAIN_FIELDS) put(`skn_rcp_Grain_${i + 1}_${end}`, get(f, u, r, d.eff) ?? (end === 'Name' ? '' : 0)); });
  ferms.filter(f => !isGrain(f)).forEach((f, i) => { for (const [end, , get] of FERMENTABLE_FIELDS) put(`skn_rcp_Fermentable_${i + 1}_${end}`, get(f, u, r, d.eff) ?? (end === 'Name' ? '' : 0)); });
  put(ADJ_COUNT[0], r ? ADJ_COUNT[2](r) : 0);
  (r?.ingredients?.miscs || []).forEach((m, i) => { for (const [end, , get] of ADJUNCT_FIELDS) put(`skn_rcp_Adjunct_${i + 1}_${end}`, get(m) ?? 0); });
  put(YEAST_COUNT[0], r ? YEAST_COUNT[2](r) : 0);
  (r?.ingredients?.yeasts || []).forEach((y, i) => { for (const [end, , get] of YEAST_FIELDS) put(`skn_rcp_Yeast_${i + 1}_${end}`, get(y, u) ?? 0); });
  return out;
}
