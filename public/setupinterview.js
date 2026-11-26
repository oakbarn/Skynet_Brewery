// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Setup Interview (Rule 2.75, OakBarn Brewery, 2026-11-26: "Start the no Skynet settings interview first so that the Skynet
// settings can be set with a skip button. First question (that cannot be skipped) US or Metric"; Skynet_Private Plans
// 2026-11-23_Brewer_Levels_and_PreBrew_Interview.md section 1A). On a new installation (no Skynet settings saved yet) an Admin is asked
// one question at a time. Every question but the ones marked `must` has a Skip button: Skip keeps Skynet's own answer (no reminder
// later). Every answer is saved on ☰ Menu > Default settings too (Rule 2.42). Data stays metric; Units only change what shows (Rule 2.59).
//
// THE QUESTIONS ARE DATA (OakBarn Brewery, 2026-11-26: "We may change the order and have other mandatory but I have to see in practice
// and what we need for the program to work"): to change the order, move a row; to make one mandatory, set must: true; to add one, add
// a row. Nothing else needs to change. public/app.js only shows them; test/setupinterview.test.js checks them.
//
// A row:  id     the answer's name (and the saved default's name when `save` is 'defaults')
//         step   the word in the steps strip at the top
//         ask    the question, plain English; why  the explanation under it
//         kind   'pick' (one click, a dropdown when there are more than 6 choices, Rule 2.6) · 'text' · 'num' · 'yesno'
//         choices  [[value, words, explanation?], ...] or ctx => that list
//         start  ctx => Skynet's own answer (what Skip keeps, and what the box starts on)
//         save   'defaults' (☰ Menu > Default settings) · 'boil' (the boil temperature place) · 'browser' (this browser only)
//         must   true: no Skip button (it must be answered)
//         show   (answers, ctx) => false leaves the question out (optional)
//         note   a warning shown on that page (optional)

// the Brewer Levels (Plans section 1): what you brew ON, from the simplest stove top to All Grain Plus. Each level has everything the
// one below has, and a brewer may always pick a lower one (OakBarn Brewery, 2026-11-17)
export const BREWER_LEVELS = [
  ['1', '1 Stove Top, One Pot, No Outlet', 'One kettle on the stove. You pour or siphon. No pump.'],
  ['2', '2 Stove Top, One Pot, Manual Outlet', 'One kettle on the stove, with a ball valve low on the side.'],
  ['3', '3 Stove Top with Pump', 'A stove top kettle with one pump (whirlpool, transfer or chiller).'],
  ['4', '4 All In One', 'One electric vessel with a basket and a pump built in (BrewZilla, Grainfather, Foundry ...).'],
  ['5', '5 Two Vessel, One Pump', 'A Mash Tun (it may be a cooler) and a Kettle, one pump.'],
  ['6', '6 Two Vessel, Two Pumps', 'A Mash Tun and a Kettle, two pumps.'],
  ['7', '7 Three Vessel', 'HLT, Mash Tun and Kettle, one pump (like the 3 Vessel 1 Pump sample).'],
  ['8', '8 Three Vessel, Recirculating', 'HLT, Mash Tun and Kettle, HERMS or RIMS, two pumps, motorized valves.'],
  ['9', '9 All Grain Plus', 'Three or more vessels, controlled fermentors, motorized valves, a tap water Supply Manifold.'],
];
export const BREWER_LEVEL_DEFAULT = '7';
// the Level the New Schema Interview starts a Brewing Tab on (Rule 2.58), from the Brewer Level and the Brewer Type, when no Tab
// Level was picked before
export function nsiLevelOf(brewerLevel, brewerType) {
  const n = +brewerLevel || 0, grain = brewerType === 'allgrain' || brewerType === 'allgrainmill';
  if (!n) return null;
  if (n <= 4) return grain ? 'biab' : brewerType === 'partial' ? 'partial' : 'stove';
  return n <= 6 ? 'two' : 'mashtun';
}

const US_FT = 0.3048;      // feet to metres (the same factor the boil temperature place uses)

export const SETUP_QUESTIONS = [
  { id: 'units', step: 'Units', kind: 'pick', save: 'defaults', must: true,
    ask: 'US or Metric?',
    why: 'Every amount, temperature and Recipe on every screen shows in this. Skynet keeps every number in metric inside, so you can change it any time on ☰ Menu > Default settings and nothing you saved changes.',
    note: 'Design your brewery on a computer, not on a phone or tablet: the screen is too small. A phone or tablet is fine for watching and running a brew day.',
    choices: [['US', 'US', 'gallons, pounds, °F'], ['Metric', 'Metric', 'liters, kilograms, °C']],
    start: ctx => ctx.defaults?.units === 'Metric' ? 'Metric' : 'US' },
  { id: 'helpLang', step: 'Help language', kind: 'pick', save: 'browser',
    ask: 'Which language for the Help?',
    why: 'The Help pages and the balloons can be English or French. The screens, buttons and labels stay English. It is kept in this browser; the ? Help window can change it any time.',
    choices: [['en', 'English'], ['fr', 'Français']],
    start: ctx => ctx.helpLang === 'fr' ? 'fr' : 'en' },
  { id: 'breweryName', step: 'Brewery Name', kind: 'text', save: 'defaults',
    ask: 'What is your brewery called?',
    why: 'It shows at the top of every Tab. A Patron perk (Rule 12.4).',
    show: (a, ctx) => !!ctx.patron,
    start: ctx => ctx.defaults?.breweryName || '' },
  { id: 'airport', step: 'Airport', kind: 'text', save: 'boil',
    ask: 'Your nearest airport (its ICAO code, for example KDFW)?',
    why: 'Skynet reads the air pressure from the airport\'s weather report to work out the temperature water boils at for you (skn_Boil_Temp). Leave it empty and Skynet uses standard air at your Elevation.',
    start: ctx => ctx.boil?.airport || '' },
  { id: 'elevation', step: 'Elevation', kind: 'num', save: 'boil',
    ask: a => `How high is your brewery above sea level (${a.units === 'Metric' ? 'meters' : 'feet'})?`,
    why: 'Water boils at a lower temperature up high. Skynet keeps it in meters inside and shows it in your Units.',
    start: (ctx, a) => ctx.boil?.elevationM == null ? '' : Math.round(a?.units === 'Metric' ? ctx.boil.elevationM : ctx.boil.elevationM / US_FT) },
  // Mandatory (OakBarn Brewery, 2026-11-26: "A and Mandatory": the 9 level ladder, no Skip)
  { id: 'brewerLevel', step: 'Brewer Level', kind: 'pick', save: 'defaults', must: true,
    ask: 'What do you brew on?',
    why: 'Your Brewer Level: your equipment, from one pot on the stove to All Grain Plus. Skynet uses it to pick the Schema Template, the Level of a new Brewing Tab and the Brew Day steps that fit. You can always pick a lower level.',
    choices: BREWER_LEVELS,
    start: ctx => BREWER_LEVELS.some(([k]) => k === String(ctx.defaults?.brewerLevel)) ? String(ctx.defaults.brewerLevel) : BREWER_LEVEL_DEFAULT },
  { id: 'brewerType', step: 'Brewer Type', kind: 'pick', save: 'defaults',
    ask: 'What do you usually brew?',
    why: 'Your Brewer Type. The No Recipe Found pop-up of a Brew Day starts on it (Rule 16.14), and you can pick another there any brew day.',
    choices: ctx => ctx.brewerTypes,
    start: ctx => ctx.brewerTypes.some(([k]) => k === ctx.defaults?.brewerType) ? ctx.defaults.brewerType : ctx.brewerTypeDefault },
  { id: 'yeastStarter', step: 'Yeast Starter', kind: 'yesno', save: 'defaults',
    ask: 'Do you usually make a Yeast Starter?',
    why: 'Information only: PreBrew reminds you a day or two ahead when it is Yes. It changes nothing else.',
    start: ctx => ctx.defaults?.yeastStarter === true },
  { id: 'defPipeSize', step: 'Pipe size', kind: 'pick', save: 'defaults',
    ask: 'What size are most of your pipes?',
    why: 'A new pipe on a Tab starts at this size. You can change any pipe later.',
    choices: ctx => ctx.pipeSizes,
    start: ctx => ctx.defaults?.defPipeSize || '0.5' },
  { id: 'defHoseSize', step: 'Hose size', kind: 'pick', save: 'defaults',
    ask: 'What size are most of your hoses?',
    why: 'A new hose on a Tab starts at this size. You can change any hose later.',
    choices: ctx => ctx.hoseSizes,
    start: ctx => ctx.defaults?.defHoseSize || '0.5' },
];

// Rule 2.6: more than 6 choices MUST be a dropdown; 6 or fewer are one-click boxes
export const asDropdown = choices => (choices?.length || 0) > 6;
// a new installation: no Skynet settings saved yet (and the Setup Interview not finished before)
export const setupNeeded = config => !config?.brewDefaults?.setupDone && !Object.keys(config?.brewDefaults ?? {}).length;
export const choicesOf = (q, ctx) => typeof q.choices === 'function' ? q.choices(ctx) : (q.choices || []);
export const askOf = (q, a) => typeof q.ask === 'function' ? q.ask(a) : q.ask;
// the questions shown, in order, for the answers so far
export const shownQuestions = (a, ctx, list = SETUP_QUESTIONS) => list.filter(q => !q.show || q.show(a, ctx));
// Skynet's own answers to start (what Next, Next, Next, or Skip, keeps)
export function startAnswers(ctx, list = SETUP_QUESTIONS) {
  const a = {};
  for (const q of list) a[q.id] = q.start(ctx, a);
  return a;
}
// the words of an answer, for the summary page
export function answerWords(q, v, ctx) {
  if (q.kind === 'yesno') return v ? 'Yes' : 'No';
  if (q.kind === 'pick') return choicesOf(q, ctx).find(([k]) => String(k) === String(v))?.[1] ?? String(v ?? '');
  return v === '' || v == null ? '(empty)' : String(v);
}
// a typed answer that is no good (null: fine)
export function answerError(q, v) {
  if (q.id === 'elevation' && v !== '' && v != null && !(Number.isFinite(+v) && +v >= -500 && +v <= 30000)) return 'Elevation must be a number (or empty).';
  if (q.id === 'airport' && v && !/^[A-Za-z0-9]{3,4}$/.test(String(v).trim())) return 'An airport code is 4 letters, for example KDFW (or leave it empty).';
  if (q.kind === 'pick' && q.must && (v === '' || v == null)) return 'This one must be answered.';
  return null;
}
// what Finish saves: the Default settings (merged into the ones there), the boil temperature place (in meters), and this browser's
// Help language. A question left out (show false) saves nothing.
export function setupSave(a, ctx, list = SETUP_QUESTIONS) {
  const brewDefaults = { ...(ctx.defaults || {}) }, out = { brewDefaults, boil: null, helpLang: null };
  for (const q of shownQuestions(a, ctx, list)) {
    const v = a[q.id];
    if (q.save === 'defaults') {
      if (q.id === 'breweryName') { const t = String(v ?? '').trim(); if (t) brewDefaults.breweryName = t; else delete brewDefaults.breweryName; }
      else brewDefaults[q.id] = q.kind === 'yesno' ? !!v : v;
    } else if (q.save === 'browser' && q.id === 'helpLang') out.helpLang = v;
  }
  const ap = String(a.airport ?? '').trim().toUpperCase(), el = a.elevation;
  const metric = a.units === 'Metric';
  const elevationM = el === '' || el == null ? null : Math.round((metric ? +el : +el * US_FT) * 10) / 10;
  if (ap !== (ctx.boil?.airport || '') || elevationM !== (ctx.boil?.elevationM ?? null))
    out.boil = { airport: ap, elevationM, pressure: ctx.boil?.pressureHpa ?? null };
  brewDefaults.setupDone = true;
  return out;
}
