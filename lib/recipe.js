// The Skynet Recipe (Fritz, 2026-10-30): read from a BeerSmith .bsmx file (BeerSmith 3 and 4) or a BeerXML .xml file
// (BeerSmith, Brewfather, Brewer's Friend ...), or filled in by hand on the ☰ Menu > Recipe tab. No limit on hops,
// grains, yeasts or misc items. The Recipe in use is kept in config.recipe; saved Recipes are files in config/recipes/.
// Skynet orders the hops and makes the hop alerts from it (public/recipecalc.js); the user only sees the results.
import fs from 'node:fs';
import path from 'node:path';
import { parseXml } from './beerxml.js';
import { HOP_STANDS, standByTemp } from '../public/brewcalc.js';
import { slug } from './equipment.js';
import { newKey, KEY, refOf } from './keys.js';
import { KG_OZ, L_FLOZ, fToC, blankRecipe, recipeLevel, RECIPE_LEVELS, hopSchedule, recipeTotals, calculateRecipe, sortHops, MISC_UNITS, expectedGravity, HOP_MEASURES, YEAST_UNITS } from '../public/recipecalc.js';

const kid = (n, tag) => n?.children.find(c => c.tag === tag);
const kids = (n, tag) => n?.children.filter(c => c.tag === tag) ?? [];
const txt = (n, tag) => (kid(n, tag)?.text ?? '').trim();
const num = (n, tag) => { const v = parseFloat(txt(n, tag)); return Number.isFinite(v) ? v : null; };
const r = (v, d = 4) => v === null ? null : Math.round(v * 10 ** d) / 10 ** d;
// every node with this tag, at any depth (BeerSmith nests Recipes in folders: <Recipe><Data><Table><Data><Recipe>)
function deep(n, tag, out = []) { for (const c of n?.children ?? []) { if (c.tag === tag) out.push(c); deep(c, tag, out); } return out; }

// A .bsmx file may be saved by Windows in an old code page: read it as UTF-8 when it is valid, else as Latin-1
export function decodeText(buf) {
  if (typeof buf === 'string') return buf;
  const t = new TextDecoder('utf-8', { fatal: false }).decode(buf);
  return t.includes('�') ? Buffer.from(buf).toString('latin1') : t;
}

// ---- BeerSmith .bsmx. BeerSmith keeps its own US units inside the file: weights in ounces, volumes in fluid ounces,
// temperatures in °F, times in minutes (dry hop in days). A Misc item's amount is in its own unit (F_M_UNITS).
const HOP_USE = { 0: 'boil', 1: 'dry hop', 2: 'mash', 3: 'first wort', 4: 'whirlpool' };
const HOP_FORM = { 0: 'Pellet', 1: 'Plug', 2: 'Leaf' };
const HOP_TYPE = { 0: 'Bittering', 1: 'Aroma', 2: 'Both' };
const GRAIN_TYPE = { 0: 'grain', 1: 'extract', 2: 'sugar', 3: 'adjunct', 4: 'dry extract', 5: 'fruit', 6: 'juice' };
const MISC_USE = { 0: 'boil', 1: 'mash', 2: 'primary', 3: 'secondary', 4: 'bottling' };
const MISC_TYPE = { 0: 'Spice', 1: 'Fining', 2: 'Herb', 3: 'Flavor', 4: 'Other', 5: 'Water Agent' };
const MISC_TIME = { 0: 'min', 1: 'hr', 2: 'day', 3: 'week' };
const YEAST_TYPE = { 0: 'Ale', 1: 'Lager', 2: 'Wine', 3: 'Champagne', 4: 'Wheat' };
const YEAST_FORM = { 0: 'Liquid', 1: 'Dry', 2: 'Slant', 3: 'Culture' };
const YEAST_FLOC = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Very High' };
const RECIPE_TYPE = { 0: 'Extract', 1: 'Partial Mash', 2: 'All Grain' };
const oz = v => v === null ? null : r(v / KG_OZ, 5), floz = v => v === null ? null : r(v / L_FLOZ, 3), fc = v => v === null ? null : r(fToC(v), 2);

// A yeast line's amount and its own unit (Rule 17.18): Packs, g, oz or ml. A unit written in the file wins ("pkg", "g", "ml" ...).
const YEAST_WORDS = { pkg: 'Packs', pkgs: 'Packs', pack: 'Packs', packs: 'Packs', packet: 'Packs', packets: 'Packs', vial: 'Packs', vials: 'Packs', each: 'Packs', items: 'Packs', item: 'Packs',
  g: 'g', gram: 'g', grams: 'g', oz: 'oz', ml: 'ml', l: 'ml' };
export function yeastUnitWord(w) { return YEAST_WORDS[String(w || '').trim().toLowerCase()] ?? null; }
// BeerSmith: F_Y_AMOUNT is how many packs, unless the file names a unit
function bsmxYeastAmount(y) {
  const unit = yeastUnitWord(txt(y, 'F_Y_UNITS') || txt(y, 'AMOUNT_UNITS')) ?? 'Packs';
  return { amount: num(y, 'F_Y_AMOUNT') ?? 1, unit };
}
// BeerXML: AMOUNT is liters, or kg when AMOUNT_IS_WEIGHT is true. BeerSmith also writes DISPLAY_AMOUNT ("1 pkg", "11.5 g"), which wins.
function beerXmlYeastAmount(y) {
  const shown = /^\s*([\d.]+)\s*([a-zA-Z]+)\s*$/.exec(txt(y, 'DISPLAY_AMOUNT')), su = shown && yeastUnitWord(shown[2]);
  if (su) return { amount: shown[2].toLowerCase() === 'l' ? r(+shown[1] * 1000, 1) : +shown[1], unit: su };
  const a = num(y, 'AMOUNT');
  if (a === null || a <= 0) return { amount: 1, unit: 'Packs' };
  return /true/i.test(txt(y, 'AMOUNT_IS_WEIGHT')) ? { amount: r(a * 1000, 1), unit: 'g' } : { amount: r(a * 1000, 1), unit: 'ml' };
}
// BeerSmith 3 or 4: BeerSmith 4 writes its version in the file; null when the file does not say
export function bsmxVersion(text) {
  const m = /BeerSmith[ _-]?(\d)/i.exec(text.slice(0, 4000)) || /<F_(?:VERSION|BS_VERSION)>\s*(\d)/i.exec(text);
  return m && ['2', '3', '4'].includes(m[1]) ? +m[1] : null;
}
export function readBsmx(text, pick) {
  const all = deep(parseXml(text), 'RECIPE').filter(x => kid(x, 'F_R_NAME'));
  if (!all.length) throw new Error('No recipe in this .bsmx file. In BeerSmith, open the recipe and use File > Save As (.bsmx), or export it.');
  const rec = (pick !== undefined && pick !== null && pick !== '' ? all.find(x => txt(x, 'F_R_NAME') === pick) ?? all[+pick] : null) ?? all[0];
  const eq = kid(rec, 'F_R_EQUIPMENT'), style = kid(rec, 'F_R_STYLE'), mash = kid(rec, 'F_R_MASH');
  const data = kid(kid(rec, 'INGREDIENTS'), 'DATA') ?? kid(rec, 'INGREDIENTS');
  const items = tag => kids(data, tag).filter(x => txt(x, tag === 'HOPS' ? 'F_H_IN_RECIPE' : `F_${tag[0]}_IN_RECIPE`) !== '0');
  const out = blankRecipe();
  Object.assign(out, {
    sourceFormat: 'bsmx', sourceVersion: bsmxVersion(text), name: txt(rec, 'F_R_NAME'), type: RECIPE_TYPE[txt(rec, 'F_R_TYPE')] ?? 'All Grain',
    style: txt(style, 'F_S_NAME'), brewer: txt(rec, 'F_R_BREWER'), assistantBrewer: txt(rec, 'F_R_ASST_BREWER'), notes: txt(rec, 'F_R_NOTES'),
    volumes: { batchLiters: floz(num(eq, 'F_E_BATCH_VOL')), boilLiters: floz(num(eq, 'F_E_BOIL_VOL')) },
    boilTime: num(eq, 'F_E_BOIL_TIME') ?? 60, fileEfficiency: num(eq, 'F_E_EFFICIENCY'),
    og: num(rec, 'F_R_DESIRED_OG'), ibu: num(rec, 'F_R_DESIRED_IBU'), color: num(rec, 'F_R_DESIRED_COLOR'),
  });
  out.ingredients.fermentables = items('GRAIN').map(g => ({ name: txt(g, 'F_G_NAME'), type: GRAIN_TYPE[txt(g, 'F_G_TYPE')] ?? 'grain', kg: oz(num(g, 'F_G_AMOUNT')),
    color: num(g, 'F_G_COLOR'), yieldPct: num(g, 'F_G_YIELD'), origin: txt(g, 'F_G_ORIGIN'), supplier: txt(g, 'F_G_SUPPLIER'),
    notes: txt(g, 'F_G_NOTES'), coarseFineDiff: num(g, 'F_G_COARSE_FINE_DIFF'), moisture: num(g, 'F_G_MOISTURE'), diastaticPower: num(g, 'F_G_DIASTATIC_POWER'),
    protein: num(g, 'F_G_PROTEIN'), maxInBatch: num(g, 'F_G_MAX_IN_BATCH'), recommendMash: txt(g, 'F_G_RECOMMEND_MASH') === '1', addAfterBoil: txt(g, 'F_G_ADD_AFTER_BOIL') === '1' }));
  out.ingredients.hops = items('HOPS').map(h => {
    const use = HOP_USE[txt(h, 'F_H_USE')] ?? 'boil', alpha = num(h, 'F_H_ALPHA');
    return { name: txt(h, 'F_H_NAME'), alpha, alphaActual: 0, kg: oz(num(h, 'F_H_AMOUNT')), unit: 'oz', use, time: use === 'dry hop' ? 0 : num(h, 'F_H_BOIL_TIME') ?? 0,
      dryDays: use === 'dry hop' ? num(h, 'F_H_DRY_HOP_TIME') ?? 0 : null, form: HOP_FORM[txt(h, 'F_H_FORM')] ?? '', type: HOP_TYPE[txt(h, 'F_H_TYPE')] ?? '' };
  });
  out.ingredients.yeasts = items('YEAST').map(y => ({ name: txt(y, 'F_Y_NAME'), lab: txt(y, 'F_Y_LAB'), productId: txt(y, 'F_Y_PRODUCT_ID'),
    type: YEAST_TYPE[txt(y, 'F_Y_TYPE')] ?? '', form: YEAST_FORM[txt(y, 'F_Y_FORM')] ?? '', ...bsmxYeastAmount(y),
    starter: txt(y, 'F_Y_USE_STARTER') === '1', starterL: txt(y, 'F_Y_USE_STARTER') === '1' ? floz(num(y, 'F_Y_STARTER_SIZE')) : null,
    flocculation: YEAST_FLOC[txt(y, 'F_Y_FLOCCULATION')] ?? '', timesCultured: num(y, 'F_Y_TIMES_CULTURED'), notes: txt(y, 'F_Y_NOTES'),
    attenuation: num(y, 'F_Y_MIN_ATTENUATION') !== null && num(y, 'F_Y_MAX_ATTENUATION') !== null ? r((num(y, 'F_Y_MIN_ATTENUATION') + num(y, 'F_Y_MAX_ATTENUATION')) / 2, 1) : null,
    minTempC: fc(num(y, 'F_Y_MIN_TEMP')), maxTempC: fc(num(y, 'F_Y_MAX_TEMP')) }));
  out.ingredients.miscs = items('MISC').map(m => {
    // some files (and BeerXML from BeerSmith) carry the unit as text, others as BeerSmith's number
    const ut = txt(m, 'AMOUNT_UNITS') || txt(m, 'F_M_AMOUNT_UNITS'), code = num(m, 'F_M_UNITS');
    return { name: txt(m, 'F_M_NAME'), type: MISC_TYPE[txt(m, 'F_M_TYPE')] ?? '', use: MISC_USE[txt(m, 'F_M_USE')] ?? 'other',
      amount: num(m, 'F_M_AMOUNT') ?? num(m, 'AMOUNT') ?? 0, unit: ut || (code !== null ? MISC_UNITS[code] ?? '' : ''), time: num(m, 'F_M_TIME') ?? 0, timeUnit: MISC_TIME[txt(m, 'F_M_TIME_UNITS')] ?? 'min' };
  });
  out.ingredients.waters = items('WATER').map(w => ({ name: txt(w, 'F_W_NAME'), liters: floz(num(w, 'F_W_AMOUNT')), ca: num(w, 'F_W_CALCIUM'), mg: num(w, 'F_W_MAGNESIUM'),
    na: num(w, 'F_W_SODIUM'), so4: num(w, 'F_W_SULFATE'), cl: num(w, 'F_W_CHLORIDE'), hco3: num(w, 'F_W_BICARB'), ph: num(w, 'F_W_PH') }));
  const steps = kid(kid(mash, 'STEPS'), 'DATA') ?? kid(mash, 'STEPS');
  out.mash = { profileName: txt(mash, 'F_MH_NAME') || null, grainTempC: fc(num(mash, 'F_MH_GRAIN_TEMP')), spargeTempC: fc(num(mash, 'F_MH_SPARGE_TEMP')),
    steps: kids(steps, 'MASHSTEP').map(s => ({ name: txt(s, 'F_MS_NAME'), type: { 0: 'Infusion', 1: 'Decoction', 2: 'Temperature' }[txt(s, 'F_MS_TYPE')] ?? 'Infusion',
      tempC: fc(num(s, 'F_MS_STEP_TEMP')), min: num(s, 'F_MS_STEP_TIME') ?? 0, infuseL: floz(num(s, 'F_MS_INFUSION')), infuseTempC: fc(num(s, 'F_MS_INFUSION_TEMP')) })) };
  if (out.mash.grainTempC !== null) out.grainTempC = out.mash.grainTempC;
  const age = kid(rec, 'F_R_AGE');
  out.pitchTempC = fc(num(age, 'F_A_PRIM_TEMP'));
  out.spargeType = txt(mash, 'F_MH_BIAB') === '1' ? 'none' : txt(mash, 'F_MH_BATCH') === '0' ? 'fly' : 'batch';
  out.level = recipeLevel({ type: out.type });     // the file's Extract, Partial Mash or All Grain gives the Level (2, 3 or 4)
  return { recipe: out, names: all.map(x => txt(x, 'F_R_NAME')) };
}

// ---- BeerXML 1.0 (kg, L, °C, minutes; dry hop TIME in minutes). Every ingredient comes in, with no limit.
const lc = s => s.toLowerCase();
export function readBeerXmlRecipe(xml, pick) {
  const root = parseXml(xml), all = deep(root, 'RECIPE');
  if (!all.length) throw new Error('No <RECIPE> found. In BeerSmith use File > Export > BeerXML (.xml), or pick the .bsmx file.');
  const rec = (pick !== undefined && pick !== null && pick !== '' ? all.find(x => txt(x, 'NAME') === pick) ?? all[+pick] : null) ?? all[0];
  const out = blankRecipe(), mash = kid(rec, 'MASH');
  Object.assign(out, {
    sourceFormat: 'beerxml', sourceVersion: null, name: txt(rec, 'NAME'), type: txt(rec, 'TYPE') || 'All Grain', style: txt(kid(rec, 'STYLE'), 'NAME'),
    brewer: txt(rec, 'BREWER'), assistantBrewer: txt(rec, 'ASST_BREWER'), notes: txt(rec, 'NOTES'),
    volumes: { batchLiters: num(rec, 'BATCH_SIZE'), boilLiters: num(rec, 'BOIL_SIZE') }, boilTime: num(rec, 'BOIL_TIME') ?? 60, fileEfficiency: num(rec, 'EFFICIENCY'),
    og: num(rec, 'OG') ?? num(rec, 'EST_OG'), fg: num(rec, 'FG') ?? num(rec, 'EST_FG'), ibu: num(rec, 'IBU'), color: num(rec, 'EST_COLOR'),
  });
  const ftype = t => ({ grain: 'grain', adjunct: 'adjunct', extract: 'extract', 'dry extract': 'dry extract', sugar: 'sugar', fruit: 'fruit', juice: 'juice' }[lc(t)] ?? 'grain');
  out.ingredients.fermentables = kids(kid(rec, 'FERMENTABLES'), 'FERMENTABLE').map(f => ({ name: txt(f, 'NAME'), type: ftype(txt(f, 'TYPE')), kg: num(f, 'AMOUNT'),
    color: num(f, 'COLOR'), yieldPct: num(f, 'YIELD'), origin: txt(f, 'ORIGIN'), supplier: txt(f, 'SUPPLIER'),
    notes: txt(f, 'NOTES'), coarseFineDiff: num(f, 'COARSE_FINE_DIFF'), moisture: num(f, 'MOISTURE'), diastaticPower: num(f, 'DIASTATIC_POWER'),
    protein: num(f, 'PROTEIN'), maxInBatch: num(f, 'MAX_IN_BATCH'), recommendMash: /^true$/i.test(txt(f, 'RECOMMEND_MASH')), addAfterBoil: /^true$/i.test(txt(f, 'ADD_AFTER_BOIL')) }));
  const huse = u => ({ mash: 'mash', 'first wort': 'first wort', boil: 'boil', aroma: 'whirlpool', whirlpool: 'whirlpool', 'dry hop': 'dry hop' }[lc(u)] ?? 'boil');
  out.ingredients.hops = kids(kid(rec, 'HOPS'), 'HOP').map(h => {
    const use = huse(txt(h, 'USE')), t = num(h, 'TIME') ?? 0;
    // BeerXML keeps hops in kg; BeerSmith also writes DISPLAY_AMOUNT ("1.00 oz"), which gives the line its unit. None: grams.
    const du = (/^\s*[\d.]+\s*([a-zA-Z]+)\s*$/.exec(txt(h, 'DISPLAY_AMOUNT'))?.[1] || '').toLowerCase();
    return { name: txt(h, 'NAME'), alpha: num(h, 'ALPHA'), alphaActual: 0, kg: num(h, 'AMOUNT'), unit: HOP_MEASURES[du] ? du : 'g', use, time: use === 'dry hop' ? 0 : t,
      dryDays: use === 'dry hop' ? r(t / 1440, 1) : null, form: txt(h, 'FORM'), type: txt(h, 'TYPE') };
  });
  out.ingredients.yeasts = kids(kid(rec, 'YEASTS'), 'YEAST').map(y => ({ name: txt(y, 'NAME'), lab: txt(y, 'LABORATORY'), productId: txt(y, 'PRODUCT_ID'),
    type: txt(y, 'TYPE'), form: txt(y, 'FORM'), ...beerXmlYeastAmount(y), starter: false, starterL: null, attenuation: num(y, 'ATTENUATION'), minTempC: num(y, 'MIN_TEMPERATURE'), maxTempC: num(y, 'MAX_TEMPERATURE'),
    flocculation: txt(y, 'FLOCCULATION'), timesCultured: num(y, 'TIMES_CULTURED'), notes: txt(y, 'NOTES') }));
  out.ingredients.miscs = kids(kid(rec, 'MISCS'), 'MISC').map(m => {
    // BeerXML keeps a weight in kg (or a volume in L); BeerSmith also writes DISPLAY_AMOUNT ("0.50 oz") or AMOUNT_UNITS
    const shown = /^\s*([\d.]+)\s*([a-zA-Z ]+)\s*$/.exec(txt(m, 'DISPLAY_AMOUNT')), units = txt(m, 'AMOUNT_UNITS'), isW = /true/i.test(txt(m, 'AMOUNT_IS_WEIGHT'));
    const amount = shown ? +shown[1] : num(m, 'AMOUNT') ?? 0, unit = shown ? shown[2].trim() : units || (isW ? 'kg' : 'l');
    return { name: txt(m, 'NAME'), type: txt(m, 'TYPE'), use: { boil: 'boil', mash: 'mash', primary: 'primary', secondary: 'secondary', bottling: 'bottling' }[lc(txt(m, 'USE'))] ?? 'other',
      amount: units && !shown ? num(m, 'AMOUNT') : amount, unit, time: num(m, 'TIME') ?? 0, timeUnit: 'min' };
  });
  out.ingredients.waters = kids(kid(rec, 'WATERS'), 'WATER').map(w => ({ name: txt(w, 'NAME'), liters: num(w, 'AMOUNT'), ca: num(w, 'CALCIUM'), mg: num(w, 'MAGNESIUM'),
    na: num(w, 'SODIUM'), so4: num(w, 'SULFATE'), cl: num(w, 'CHLORIDE'), hco3: num(w, 'BICARBONATE'), ph: num(w, 'PH') }));
  out.mash = { profileName: txt(mash, 'NAME') || null, grainTempC: num(mash, 'GRAIN_TEMP'), spargeTempC: num(mash, 'SPARGE_TEMP'),
    steps: kids(kid(mash, 'MASH_STEPS'), 'MASH_STEP').map(s => ({ name: txt(s, 'NAME'), type: txt(s, 'TYPE') || 'Infusion', tempC: num(s, 'STEP_TEMP'), min: num(s, 'STEP_TIME') ?? 0,
      infuseL: num(s, 'INFUSE_AMOUNT'), infuseTempC: null })) };
  if (out.mash.grainTempC !== null) out.grainTempC = out.mash.grainTempC;
  out.pitchTempC = num(rec, 'PRIMARY_TEMP');
  out.level = recipeLevel({ type: out.type });
  return { recipe: out, names: all.map(x => txt(x, 'NAME')) };
}

// any recipe file: .bsmx or BeerXML, by its name or by what is inside
export function readRecipeFile(text, file = '', pick) {
  const t = decodeText(text), isBsmx = /\.bsmx$/i.test(file) || (!/\.xml$/i.test(file) && /<F_R_NAME>/i.test(t));
  const got = isBsmx ? readBsmx(t, pick) : readBeerXmlRecipe(t, pick);
  got.recipe.sourceFile = path.basename(String(file || '')) || null;
  got.recipe.importedAt = new Date().toISOString();
  // the boxes on the Recipe tab start filled in: whirlpool minutes from the whirlpool hops, then what Calculate works out
  const rc = got.recipe, wp = rc.ingredients.hops.filter(h => h.use === 'whirlpool').map(h => +h.time || 0);
  rc.whirlpoolMinutes = wp.length ? Math.max(...wp) : null;
  // Three Hop Stands (OakBarn Brewery, 2026-11-13: "AND AN XML FILE MAY HAVE INFO AS AN IMPORT"): a whirlpool hop's own temperature
  // and time from the file go into the stand that temperature fits (High 170 °F and above, Middle from 140 °F, Low below; no
  // Defaults, 2026-11-19), and the hop is set to that stand. A whirlpool hop with no temperature gets no stand: its Whirlpool
  // questions are asked when the hop is opened (Panel Updates entry 13).
  for (const h of rc.ingredients.hops.filter(x => x.use === 'whirlpool')) {
    const t = Number.isFinite(+h.wpTempC) && h.wpTempC !== null && h.wpTempC !== '' ? +h.wpTempC : null;
    if (t === null) continue;
    const key = standByTemp(t);
    h.stand = key;
    const was = rc.hopStands?.[key] || {};
    rc.hopStands = { ...rc.hopStands, [key]: { tempC: t, min: +h.time > 0 ? +h.time : was.min ?? null } };
  }
  rc.spargeTempC = rc.mash.spargeTempC;
  // the Actual AAU of each hop starts at 0: the AAU on the package of the hops on hand is typed in on the Hops tab before Calculate (Fritz, 2026-10-31)
  sortHops(rc);
  Object.assign(rc, calculateRecipe(rc));
  return got;
}

// ---- The Recipe's Brew on Tab (Rule 17.13, OakBarn Brewery, 2026-11-17: "Yes and That becomes the Tab for the Brew"): the Tab the
// Recipe is brewed on, kept by the Tab's hidden key (Design Rule 2), so a renamed Tab is still found. Its Equipment Profile's Brewhouse
// Efficiency is the only efficiency the Recipe uses ("Never an Overall Effincy defauly only on an Equipment profile").
// profiles: the EquipmentProfiles store (lib/equipment.js), or any { has(id), get(id) }.
// The Tab's own Equipment numbers (w.equip, copied on when a profile was imported, changed on the Tab; Rule 2.62): no profile is read.
const tabsWithProfile = config => (config?.workspaces || []).filter(w => !w.build && w[KEY] && w.equip);
export const brewOnTab = (config, rc = config?.recipe) => (config?.workspaces || []).find(w => !w.build && w[KEY] && w[KEY] === rc?.brewOn?.[KEY]) || null;
// a Recipe with no Brew on Tab (or one this Schema has not got) starts on the Tab whose profile has a Mash Tun or an All In One,
// else the first Tab with an Equipment Profile, else none
const MASHES = /^(mash tun|mlt|all in one)$/i;
export function defaultBrewOn(config, profiles) {
  const tabs = tabsWithProfile(config);
  const mash = tabs.find(w => (w.equip.equipment || []).some(e => MASHES.test(e.vtype || '')));
  const w = mash || tabs[0];
  return w ? { [KEY]: w[KEY] } : null;
}
export function brewOnEfficiency(config, profiles, rc = config?.recipe) {
  const w = brewOnTab(config, rc); if (!w?.equip) return null;
  const v = +w.equip.brewhouseEfficiency;
  return Number.isFinite(v) && v > 0 ? v : null;
}
// what the browser gets: the Brew on Tab as the Tab's stand-in (a key never leaves the Brain), and its profile's Efficiency
export function recipeForBrowser(rc, config, profiles) {
  if (!rc) return rc;
  const w = brewOnTab(config, rc), { brewOn, ...rest } = rc, eff = brewOnEfficiency(config, profiles, rc);
  // the Expected Gravity always with the profile's Efficiency as it is now (it may have changed since the Recipe was saved)
  return { ...rest, brewOnRef: w ? refOf(w[KEY]) : '', brewOnEff: eff, expectedSG: expectedGravity(rc, eff) };
}
// and back: the stand-in the Recipe tab sent becomes the Tab's key again (anything else sent for it is thrown away)
export function brewOnFromBrowser(ref, config) {
  const w = ref && (config?.workspaces || []).find(x => !x.build && x[KEY] && refOf(x[KEY]) === ref);
  return w ? { [KEY]: w[KEY] } : null;
}

// ---- Cleaning a Recipe sent from the Recipe tab: numbers stay numbers, text stays short, lists stay lists (no limit)
const s = (v, max = 200) => String(v ?? '').slice(0, max);
const nn = v => v === '' || v === null || v === undefined || !Number.isFinite(+v) ? null : +v;
const pickOf = (v, list, d) => list.includes(v) ? v : d;
export function cleanRecipe(b = {}) {
  const base = blankRecipe(), i = b.ingredients || {}, arr = v => Array.isArray(v) ? v : [];
  return sortHops({
    ...base, sourceFormat: pickOf(b.sourceFormat, ['manual', 'bsmx', 'beerxml'], 'manual'), sourceVersion: nn(b.sourceVersion), sourceFile: b.sourceFile ? s(b.sourceFile, 200) : null,
    importedAt: b.importedAt ? s(b.importedAt, 40) : undefined, name: s(b.name, 120), level: recipeLevel(b), type: RECIPE_LEVELS.find(x => x.level === recipeLevel(b)).type, style: s(b.style, 120), brewer: s(b.brewer, 120), assistantBrewer: s(b.assistantBrewer, 120),
    notes: s(b.notes, 20000), volumes: { batchLiters: nn(b.volumes?.batchLiters), boilLiters: nn(b.volumes?.boilLiters) }, boilTime: nn(b.boilTime) ?? 60,
    fileEfficiency: nn(b.fileEfficiency), brewOn: typeof b.brewOn?._key === 'string' && /^k[0-9a-f]{16}$/.test(b.brewOn._key) ? { _key: b.brewOn._key } : null, og: nn(b.og), fg: nn(b.fg), ibu: nn(b.ibu), color: nn(b.color), waterToGrain: nn(b.waterToGrain) ?? base.waterToGrain, grainTempC: nn(b.grainTempC) ?? base.grainTempC,
    expectedSG: nn(b.expectedSG), grainKg: nn(b.grainKg), firstMashC: nn(b.firstMashC), ibuCalc: nn(b.ibuCalc), strikeLiters: nn(b.strikeLiters), strikeTempC: nn(b.strikeTempC),
    spargeType: pickOf(b.spargeType, ['batch', 'fly', 'none'], 'batch'), spargeLiters: nn(b.spargeLiters), spargeMinutes: nn(b.spargeMinutes), spargeTempC: nn(b.spargeTempC),
    whirlpoolMinutes: nn(b.whirlpoolMinutes), pitchTempC: nn(b.pitchTempC), boilOffRate: nn(b.boilOffRate),
    hopStands: Object.fromEntries(HOP_STANDS.map(([k]) => [k, b.hopStands?.[k]]).filter(([, x]) => x && (nn(x.tempC) !== null || nn(x.min) !== null)).map(([k, x]) => [k, { tempC: nn(x.tempC), min: nn(x.min) }])),
    mashProfile: s(b.mashProfile, 80), boilProfile: s(b.boilProfile, 80), waterProfile: s(b.waterProfile, 80),
    ingredients: {
      fermentables: arr(i.fermentables).map(f => ({ name: s(f.name, 120), type: s(f.type, 20) || 'grain', kg: nn(f.kg), color: nn(f.color), yieldPct: nn(f.yieldPct), origin: s(f.origin, 80), supplier: s(f.supplier, 80),
        notes: s(f.notes, 2000), coarseFineDiff: nn(f.coarseFineDiff), moisture: nn(f.moisture), diastaticPower: nn(f.diastaticPower), protein: nn(f.protein), maxInBatch: nn(f.maxInBatch), recommendMash: f.recommendMash === true, addAfterBoil: f.addAfterBoil === true, unit: pickOf(f.unit, ['lb', 'oz', 'kg', 'g'], '') })),
      hops: arr(i.hops).map(h => ({ name: s(h.name, 120), alpha: nn(h.alpha), alphaActual: nn(h.alphaActual) ?? 0, kg: nn(h.kg), use: s(h.use, 20) || 'boil', time: nn(h.time) ?? 0, dryDays: nn(h.dryDays),
        date: /^\d{4}-\d{2}-\d{2}$/.test(h.date) ? h.date : '', wpTempC: nn(h.wpTempC), ...(HOP_MEASURES[h.unit] ? { unit: h.unit } : {}), stand: HOP_STANDS.some(([k]) => k === h.stand) ? h.stand : undefined, hopRocket: h.hopRocket === true, form: s(h.form, 20), type: s(h.type, 20) })),
      yeasts: arr(i.yeasts).map(y => ({ name: s(y.name, 120), lab: s(y.lab, 80), productId: s(y.productId, 40), type: s(y.type, 20), form: s(y.form, 20), amount: nn(y.amount) ?? 1, unit: YEAST_UNITS[y.unit] ? y.unit : 'Packs', starter: y.starter === true || (y.starter === undefined && nn(y.starterL) !== null), starterL: nn(y.starterL),
        flocculation: s(y.flocculation, 20), timesCultured: nn(y.timesCultured), mfgDate: /^\d{4}-\d{2}-\d{2}$/.test(y.mfgDate) ? y.mfgDate : '', notes: s(y.notes, 2000), attenuation: nn(y.attenuation), minTempC: nn(y.minTempC), maxTempC: nn(y.maxTempC) })),
      miscs: arr(i.miscs).map(m => ({ name: s(m.name, 120), type: s(m.type, 30), use: s(m.use, 20) || 'boil', amount: nn(m.amount) ?? 0, unit: s(m.unit, 20), time: nn(m.time) ?? 0, timeUnit: s(m.timeUnit, 10) || 'min' })),
      waters: arr(i.waters).map(w => ({ name: s(w.name, 120), liters: nn(w.liters), ca: nn(w.ca), mg: nn(w.mg), na: nn(w.na), so4: nn(w.so4), cl: nn(w.cl), hco3: nn(w.hco3), ph: nn(w.ph) })),
    },
    mash: { profileName: b.mash?.profileName ? s(b.mash.profileName, 120) : null, grainTempC: nn(b.mash?.grainTempC), spargeTempC: nn(b.mash?.spargeTempC),
      steps: arr(b.mash?.steps).map(x => ({ name: s(x.name, 80), type: s(x.type, 20), tempC: nn(x.tempC), min: nn(x.min) ?? 0, infuseL: nn(x.infuseL), infuseTempC: nn(x.infuseTempC) })) },
  });
}

// Saved Recipes: config/recipes/<id>.json, shared by every Schema
export class RecipeStore {
  constructor(dir) { this.dir = dir; }
  file(id) { if (!/^[a-z0-9-]+$/.test(id ?? '')) throw new Error('Bad recipe id'); return path.join(this.dir, id + '.json'); }
  has(id) { try { return !!id && fs.existsSync(this.file(id)); } catch { return false; } }
  list() {
    if (!fs.existsSync(this.dir)) return [];
    return fs.readdirSync(this.dir).filter(f => f.endsWith('.json')).map(f => { try { const x = JSON.parse(fs.readFileSync(path.join(this.dir, f), 'utf8')); return { id: f.slice(0, -5), name: x.name, updated: x.updated, sourceFormat: x.sourceFormat }; } catch { return null; } })
      .filter(Boolean).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }
  get(id) { if (!this.has(id)) throw new Error(`No saved Recipe "${id}"`); return { ...JSON.parse(fs.readFileSync(this.file(id), 'utf8')), id }; }
  save(recipe, id) {
    const rc = cleanRecipe(recipe);
    if (!rc.name.trim()) throw new Error('Give the Recipe a name first');
    if (!id) { id = slug(rc.name) || 'recipe'; let n = 2; const b = id; while (this.has(id) && this.get(id).name !== rc.name) id = `${b}-${n++}`; }
    const was = this.has(id) ? this.get(id) : {};
    const out = { ...rc, created: was.created ?? new Date().toISOString(), updated: new Date().toISOString(), _key: was._key || newKey() };
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(this.file(id), JSON.stringify(out, null, 2));
    return { ...out, id };
  }
  remove(id) { fs.rmSync(this.file(id), { force: true }); }
  // An imported Recipe (OakBarn Brewery, 2026-11-13: "saved when user says yes, and then the overwrite question comes up In this
  // case Overwrite or add new"). The saved Recipe with the same name, if any; the next free "Name #2", "Name #3" ...
  byName(name) { return this.list().find(x => String(x.name).toLowerCase() === String(name).toLowerCase()) ?? null; }
  freeName(name) { const base = String(name).replace(/ #\d+$/, ''); let n = 2; while (this.byName(`${base} #${n}`)) n++; return `${base} #${n}`; }
  // Overwrite keeps the old copy in config/backups/recipes (Rule #1: nothing is lost)
  backup(id) {
    if (!this.has(id)) return null;
    const dir = path.join(this.dir, '..', 'backups', 'recipes'), d = new Date(), p2 = v => String(v).padStart(2, '0');
    const f = path.join(dir, `${id}_${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}T${p2(d.getHours())}${p2(d.getMinutes())}${p2(d.getSeconds())}.json`);
    fs.mkdirSync(dir, { recursive: true }); fs.copyFileSync(this.file(id), f);
    return f;
  }
}

// ---- Hop alerts on brew day: a background method. It starts with start_hop_alerts in a Process (or the Recipe tab):
// either on its own clock from that moment, or following a countdown timer (start_hop_alerts "Boil_Timer"), so the
// Simulator's time skips and a paused timer are followed too. Each alert is sent to every screen once.
// A timer that counts faster than real time (a Testing switch that runs each minute as one second) is followed too:
// start_hop_alerts "Boil_Timer", 1 = 1 timer second for each minute of the boil (60 to start, real time).
export class HopAlerts {
  constructor({ store, clock = () => Date.now(), send, defaults = () => ({}), recipe = () => null }) { Object.assign(this, { store, clock, send, defaults, recipe }); this.run = null; this.tick = null; }
  start(timer, by = 'Recipe tab', perMinute = 60) {
    const rc = this.recipe();
    if (!rc || !rc.name && !(rc.ingredients?.hops || []).length) throw new Error('There is no Recipe to run hop alerts for. Import or make one on ☰ Menu > Recipe first');
    if (timer && !this.store.has(timer)) throw new Error(`start_hop_alerts: no timer named "${timer}"`);
    const spm = perMinute === undefined || perMinute === null || perMinute === '' ? 60 : +perMinute;
    if (!(spm > 0)) throw new Error('start_hop_alerts: the timer seconds for each boil minute must be more than 0 (60 = real time)');
    const sch = hopSchedule(rc, this.defaults());
    this.stop();
    this.run = { timer: timer || null, spm, t0: this.clock(), sch, sent: new Set(), by, recipe: rc.name };
    this.tick = setInterval(() => this.check(), 1000); this.tick.unref?.();
    this.check();
    return `Hop alerts started for "${rc.name || 'the Recipe'}": ${sch.alerts.length} alert${sch.alerts.length === 1 ? '' : 's'} over a ${sch.boilTime} minute boil${timer ? `, following the timer ${timer}${spm !== 60 ? ` (${spm} timer second${spm === 1 ? '' : 's'} a minute)` : ''}` : ''}`;
  }
  stop() { if (this.tick) clearInterval(this.tick); this.tick = null; const was = !!this.run; this.run = null; return was; }
  // minutes into the boil: from the timer (boil time less what is left on a countdown, or what an up timer shows), or the clock
  elapsed() {
    const R = this.run; if (!R) return null;
    if (R.timer) {
      const v = this.store.getProp(R.timer, 'value'), sec = typeof v === 'object' && v !== null && 's' in v ? v.s : +v || 0;
      const down = this.store.getProp(R.timer, 'countdown');
      return down === false ? sec / R.spm : R.sch.boilTime - sec / R.spm;
    }
    return (this.clock() - R.t0) / 60000;
  }
  check() {
    const R = this.run; if (!R) return;
    const at = this.elapsed();
    R.sch.alerts.forEach((a, i) => { if (!R.sent.has(i) && at >= a.at - 1 / 120) { R.sent.add(i); this.send({ ...a, recipe: R.recipe, index: i, of: R.sch.alerts.length }); } });
    if (R.sent.size >= R.sch.alerts.length) this.stop();
  }
  status() { const R = this.run; return R ? { running: true, timer: R.timer, by: R.by, minutes: this.elapsed(), sent: R.sent.size, of: R.sch.alerts.length } : { running: false }; }
}

export const recipeView = (rc, d) => ({ recipe: rc, totals: recipeTotals(rc, d), schedule: hopSchedule(rc, d) });
