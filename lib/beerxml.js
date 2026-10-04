// BeerXML import (BeerSmith: File > Export > BeerXML).
// Recipe values are written into the variables named in config.beerxml (see README).

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const decode = s => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : (ENT[e.toLowerCase()] ?? m));

// Minimal XML -> tree. Attributes are ignored (BeerXML does not use them).
export function parseXml(xml) {
  const root = { tag: '#root', children: [], text: '' };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[([\s\S]*?)\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<\/\s*([\w:.-]+)\s*>|<\s*([\w:.-]+)([^>]*?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(xml))) {
    const top = stack[stack.length - 1];
    if (m[1] !== undefined) top.text += m[1];
    else if (m[2]) {
      const tag = m[2].toUpperCase();
      while (stack.length > 1 && stack[stack.length - 1].tag !== tag) stack.pop();   // tolerate sloppy files
      if (stack.length > 1) stack.pop();
    } else if (m[3]) {
      const node = { tag: m[3].toUpperCase(), children: [], text: '' };
      top.children.push(node);
      if (!m[5]) stack.push(node);
    } else if (m[6]) top.text += decode(m[6]);
  }
  return root;
}

const kid = (n, tag) => n?.children.find(c => c.tag === tag);
const kids = (n, tag) => n?.children.filter(c => c.tag === tag) ?? [];
const txt = (n, tag) => (kid(n, tag)?.text ?? '').trim();
const num = (n, tag) => { const v = parseFloat(txt(n, tag)); return Number.isFinite(v) ? v : null; };

export const DEFAULT_MAP = {
  recipe: {
    name: 'gblS_BeerName_R1', style: 'gblS_Style_R1', boilTime: 'gblVBoilTime_Minutes',
    batchSize: 'gblV_BatchSize_Gal', boilSize: 'gblV_BoilSize_Gal', og: 'gblV_OG_R1', fg: 'gblV_FG_R1', ibu: 'gblV_IBU_Recipe_R1',
  },
  hops: {
    count: 8,
    name: 'gblS_Hop{n}_R1', oz: 'gblV_Hop{n}_Oz_R1', alpha: 'gblV_Hop{n}_Recipe_AAU_R1',
    time: 'gblV_TimeHop{n}_Min_R1', group: 'gblV_Hop{n}_Group_R1',
  },
  // gblV_HopN_Group_R1 codes (OakBarn scheme)
  groupCodes: { 'mash': -333, 'first wort': -444, 'start of boil': -888, 'boil': 919, 'aroma': -999, 'whirlpool': -999, 'dry hop': -111, 'unused': 0 },
};

const KG_TO_OZ = 35.27396195, L_TO_GAL = 0.264172052;

export function readBeerXml(xml) {
  const root = parseXml(xml);
  const recipes = kid(root, 'RECIPES') ?? root;
  const r = kid(recipes, 'RECIPE');
  if (!r) throw new Error('No <RECIPE> found. In BeerSmith use File > Export > BeerXML (.xml).');
  const boil = num(r, 'BOIL_TIME') ?? 60;
  const hops = kids(kid(r, 'HOPS'), 'HOP').map(h => ({
    name: txt(h, 'NAME'), alpha: num(h, 'ALPHA') ?? 0, kg: num(h, 'AMOUNT') ?? 0,
    use: txt(h, 'USE'), time: num(h, 'TIME') ?? 0, form: txt(h, 'FORM'),
  }));
  return {
    name: txt(r, 'NAME'), style: txt(kid(r, 'STYLE'), 'NAME'),
    boilTime: boil, batchL: num(r, 'BATCH_SIZE'), boilL: num(r, 'BOIL_SIZE'),
    og: num(r, 'OG') ?? num(r, 'EST_OG'), fg: num(r, 'FG') ?? num(r, 'EST_FG'), ibu: num(r, 'IBU'),
    hops, mash: readMash(kid(r, 'MASH')),
  };
}

// Mash steps: BeerXML gives °C and minutes. BeerSmith also writes INFUSE_TEMP as text, e.g. "163.6 F"
const C_TO_F = c => c * 9 / 5 + 32;
function readMash(m) {
  if (!m) return null;
  const steps = kids(kid(m, 'MASH_STEPS'), 'MASH_STEP').map(s => ({ name: txt(s, 'NAME'), type: txt(s, 'TYPE'), tempC: num(s, 'STEP_TEMP'), min: num(s, 'STEP_TIME') ?? 0, infuse: txt(s, 'INFUSE_TEMP') }));
  return { name: txt(m, 'NAME'), steps };
}
function infuseF(text) {
  const x = /(-?[\d.]+)\s*(F|C)?/i.exec(text || '');
  if (!x) return null;
  return /c/i.test(x[2] || 'F') ? C_TO_F(+x[1]) : +x[1];
}

export function hopGroupCode(hop, boilTime, codes) {
  const use = hop.use.toLowerCase();
  if (use === 'mash') return codes['mash'];
  if (use === 'first wort') return codes['first wort'];
  if (use === 'aroma' || use === 'whirlpool') return codes['aroma'];
  if (use === 'dry hop') return codes['dry hop'];
  // Boil: a hop whose time equals the boil time is Start of Boil
  return hop.time >= boilTime ? codes['start of boil'] : codes['boil'];
}

// Applies a recipe to the store. Returns a report.
export function importBeerXml(xml, store, map = DEFAULT_MAP) {
  const rec = readBeerXml(xml);
  const m = { recipe: { ...DEFAULT_MAP.recipe, ...(map.recipe ?? {}) }, hops: { ...DEFAULT_MAP.hops, ...(map.hops ?? {}) }, groupCodes: { ...DEFAULT_MAP.groupCodes, ...(map.groupCodes ?? {}) } };
  const set = [], missing = [], warnings = [];
  const put = (name, value) => {
    if (!name) return;
    if (!store.has(name)) { missing.push(name); return; }
    store.setProp(name, 'value', value, 'import'); set.push({ name, value });
  };
  put(m.recipe.name, rec.name);
  put(m.recipe.style, rec.style);
  put(m.recipe.boilTime, rec.boilTime);
  if (rec.batchL !== null) put(m.recipe.batchSize, +(rec.batchL * L_TO_GAL).toFixed(2));
  if (rec.boilL !== null) put(m.recipe.boilSize, +(rec.boilL * L_TO_GAL).toFixed(2));
  if (rec.og !== null) put(m.recipe.og, rec.og);
  if (rec.fg !== null) put(m.recipe.fg, rec.fg);
  if (rec.ibu !== null) put(m.recipe.ibu, rec.ibu);

  const count = m.hops.count ?? 8;
  if (rec.hops.length > count) warnings.push(`Recipe has ${rec.hops.length} hops; only the first ${count} were imported`);
  for (let n = 1; n <= count; n++) {
    const h = rec.hops[n - 1];
    const f = k => m.hops[k]?.replaceAll('{n}', n);
    if (h) {
      const use = h.use.toLowerCase();
      const time = use === 'dry hop' ? +(h.time / 1440).toFixed(1) : h.time;   // BeerXML dry hop time is minutes -> days
      put(f('name'), h.name);
      put(f('oz'), +(h.kg * KG_TO_OZ).toFixed(2));
      put(f('alpha'), h.alpha);
      put(f('time'), time);
      put(f('group'), hopGroupCode(h, rec.boilTime, m.groupCodes));
    } else {
      put(f('name'), ''); put(f('oz'), 0); put(f('alpha'), 0); put(f('time'), 0); put(f('group'), m.groupCodes['unused']);
    }
  }
  // Mash steps, only when the config names Globals for them (config.beerxml.mash). A mash-out step goes to its own Globals when named.
  // Times go in as minutes, or as hh:mm:ss when the Global is a time.
  const mm = map.mash;
  if (mm && rec.mash) {
    const toF = c => c === null ? null : +(mm.units === 'C' ? c : C_TO_F(c)).toFixed(1);
    const putTime = (name, min) => { if (!name) return; const el = store.has(name) ? store.get(name) : null; put(name, el?.dataType === 'time' ? min * 60 : min); };
    const steps = rec.mash.steps.filter(s => !/mash ?out/i.test(s.name));
    const out = rec.mash.steps.find(s => /mash ?out/i.test(s.name));
    const n = mm.count ?? 3;
    if (steps.length > n) warnings.push(`Recipe has ${steps.length} mash steps; only the first ${n} were imported`);
    for (let i = 1; i <= n; i++) {
      const st = steps[i - 1], f = k => mm[k]?.replaceAll('{n}', i);
      put(f('name'), st ? st.name : '');
      put(f('temp'), st ? toF(st.tempC) : 0);
      putTime(f('time'), st ? st.min : 0);
    }
    if (out) { put(mm.outTemp, toF(out.tempC)); putTime(mm.outTime, out.min); }
    const strike = infuseF(steps[0]?.infuse);
    if (strike !== null && mm.strike) put(mm.strike, mm.units === 'C' ? +((strike - 32) * 5 / 9).toFixed(1) : +strike.toFixed(1));
  }
  return { recipe: rec.name, hops: rec.hops.length, set: set.length, missing: [...new Set(missing)], warnings };
}
