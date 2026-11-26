// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Recipe Interview (Rule 17.22; Skynet_Private Plans 2026-11-23_Brewer_Levels_and_PreBrew_Interview.md section 5.3). OakBarn
// Brewery, 2026-11-26, word for word: "The recipe from northern brewer recipe needs to be turned into an generic interview with the
// questions answered to set up the recipe and Brew Day. I will likely add some questions that are not there." Then: "how much water and
// for how long. Any temperatures. Like the stuff you might get from Beer smith recipe, but have to ask about every thing with an
// interview ... The first question should be do you have a Recipe XML you want to Import. 2 Branches Yes 1: Go to the Import 2 No: Go
// to Interview for Manual Recipe. The question like Is this an Extract Kit: Branch again if Yes for question Pertaining only to and
// Extract Kit>No, All Grain Yes All Grain Interview No: Kombucha, Ginger Beer ... in a DDLB and so on".
//
// THE QUESTIONS ARE DATA: one row per page in RECIPE_QUESTIONS, in the plan's numbers (R1, E1 ... A17, O1 ... F10, B1 ...). To add a
// question, add a row with the next free number of its branch, or a letter (E7a), and point the row before it at it (`next`). Numbers
// are only names and never need renumbering. public/app.js only shows the rows; test/recipeinterview.test.js checks them.
//
// A row:  id      its number;  branch  the words in the steps strip;  ask  the question;  why  the explanation (optional)
//         boxes   [{ k, label, kind, choices?, show? }]: the answers on that page
//         list    { k, cols: [{ k, label, kind, choices? }] }: a table of rows (each extract, each hop ...), ➕ Add another
//         next    the next row's id, or (answers) => id; 'done' ends the interview
//         show    (answers, ctx) => false skips the row (it goes on to its `next`)
// Box kinds: text · num · sg (gravity) · pct · temp (°F / °C) · vol (gal / L) · wt (lb / kg) · hopwt (oz / g) · min · days · yesno · pick
// (6 or fewer choices are one-click boxes, more a dropdown, Rule 2.6). Amounts are typed in the brewer's Units and kept metric (Rule
// 2.59). A box whose Recipe field does not exist yet is kept in the Recipe's `interview` part, so no answer is ever lost.
import { toC, toL, toKg, toRatio } from './recipecalc.js';

export const OTHER_BREWS = [['kombucha', 'Kombucha'], ['ginger', 'Ginger Beer'], ['cider', 'Cider'], ['mead', 'Mead'], ['seltzer', 'Hard Seltzer'], ['wine', 'Wine Kit'], ['other', 'Other ...']];
const KIT_KINDS = [['1', 'Can Kit (no hops to add)'], ['2', 'Extract with Hops'], ['3', 'Extract with Steeping Grains and Hops']];
const WHEN_IN = [['start', 'Start of the boil'], ['late', 'Minutes before the end'], ['after', 'After the boil (flame-out)'], ['fermenter', 'Straight into the fermenter (no boil)']];
const HOP_USE = [['boil', 'Boil'], ['first wort', '1st Wort'], ['mash', 'Mash'], ['whirlpool', 'Whirlpool / Aroma'], ['dry hop', 'Dry Hop']];
const CHILL_HOW = [['chiller', 'Chiller (immersion, counterflow or plate)'], ['ice', 'Ice bath'], ['topoff', 'Cold water top off only'], ['none', 'No chill']];
const SPARGE = [['batch', 'Batch'], ['fly', 'Fly'], ['none', 'None']];
const FORMS = [['Dry', 'Dry'], ['Liquid', 'Liquid'], ['Culture', 'SCOBY or culture']];
const AERATE = [['rock', 'Seal and rock'], ['stone', 'Air stone'], ['oxygen', 'Pure oxygen'], ['none', 'None']];
const PACKAGE = [['bottle', 'Bottles'], ['keg', 'Keg']];
const EXTRACT_KIND = [['extract', 'Liquid'], ['dry extract', 'Dry']];

const isKit = a => a.R2 === true, isGrain = a => a.R2 === false && a.R3 === true, isOther = a => a.R2 === false && a.R3 === false;
const kitLevel = a => +a.E2_kind || 2;

export const RECIPE_QUESTIONS = [
  // ---- the start: Import, or which interview
  { id: 'R1', branch: 'Start', ask: 'Do you have a Recipe file (BeerXML or BeerSmith) to IMPORT?', why: 'Yes: the Recipe tab opens at IMPORT, which reads the whole Recipe from the file. No: Skynet asks about everything, one page at a time.',
    boxes: [{ k: 'R1', kind: 'yesno' }], next: a => a.R1 ? 'import' : 'R2' },
  { id: 'R2', branch: 'Start', ask: 'Is this an Extract Kit?', why: 'A kit of malt extract (liquid or dry), with or without hops or steeping grains.',
    boxes: [{ k: 'R2', kind: 'yesno' }], next: a => a.R2 ? 'E1' : 'R3' },
  { id: 'R3', branch: 'Start', ask: 'Is this All Grain?', why: 'All the sugar comes from mashed grain.', boxes: [{ k: 'R3', kind: 'yesno' }], next: a => a.R3 ? 'A1' : 'O1' },

  // ---- Branch E: the Extract Kit Interview
  { id: 'E1', branch: 'Extract Kit', ask: 'The kit\'s name and style?', boxes: [{ k: 'name', label: 'Name', kind: 'text' }, { k: 'style', label: 'Style', kind: 'text' }], next: 'E2' },
  { id: 'E2', branch: 'Extract Kit', ask: 'What kind of kit?', why: 'It sets the Recipe Level: 1 Can Kit, 2 Extract, 3 Partial Grain (Rule 17.11).', boxes: [{ k: 'E2_kind', kind: 'pick', choices: KIT_KINDS }], next: 'E3' },
  { id: 'E3', branch: 'Extract Kit', ask: 'How much beer does it make (into the fermenter)?', boxes: [{ k: 'batch', label: 'Batch', kind: 'vol' }], next: 'E4' },
  { id: 'E4', branch: 'Extract Kit', ask: 'The sheet\'s targets?', why: 'Compared with what you measure on Brew Day. Leave empty what the sheet does not say.',
    boxes: [{ k: 'og', label: 'OG', kind: 'sg' }, { k: 'fg', label: 'FG', kind: 'sg' }, { k: 'ibu', label: 'IBU', kind: 'num' }, { k: 'abv', label: 'ABV %', kind: 'pct' }], next: 'E5' },
  { id: 'E5', branch: 'Extract Kit', ask: 'Each extract: name, liquid or dry, amount, and when it goes in?', why: 'Some kits add part of the extract late, a number of minutes before the end of the boil.',
    list: { k: 'extracts', cols: [{ k: 'name', label: 'Name', kind: 'text' }, { k: 'form', label: 'Liquid or dry', kind: 'pick', choices: EXTRACT_KIND }, { k: 'amt', label: 'Amount', kind: 'wt' },
      { k: 'when', label: 'When', kind: 'pick', choices: WHEN_IN }, { k: 'min', label: 'Minutes before the end', kind: 'min' }] }, next: 'E7' },
  { id: 'E7', branch: 'Extract Kit', ask: 'Does the kit need sugar you buy? Which, and how much?', why: 'For example 1 kg of Dextrose (corn sugar). It goes on the PreBrew shopping list.',
    list: { k: 'sugars', cols: [{ k: 'name', label: 'Sugar', kind: 'text' }, { k: 'amt', label: 'Amount', kind: 'wt' }] }, next: 'E8' },
  { id: 'E8', branch: 'Extract Kit', ask: 'Each steeping grain and its amount?', show: a => kitLevel(a) === 3,
    list: { k: 'steepGrains', cols: [{ k: 'name', label: 'Grain', kind: 'text' }, { k: 'amt', label: 'Amount', kind: 'wt' }] }, next: 'E9' },
  { id: 'E9', branch: 'Extract Kit', ask: 'The steep: how much water, how hot, how long? The bag rinsed with how much water, how hot?', show: a => kitLevel(a) === 3,
    boxes: [{ k: 'steepVol', label: 'Steep water', kind: 'vol' }, { k: 'steepTemp', label: 'Steep at', kind: 'temp' }, { k: 'steepMin', label: 'Steep for', kind: 'min' },
      { k: 'rinseVol', label: 'Rinse water', kind: 'vol' }, { k: 'rinseTemp', label: 'Rinse at', kind: 'temp' }], next: 'E10' },
  { id: 'E10', branch: 'Extract Kit', ask: 'Water to start the boil: how much water goes in the kettle?', boxes: [{ k: 'boilVol', label: 'Kettle water', kind: 'vol' }], next: 'E11' },
  { id: 'E11', branch: 'Extract Kit', ask: 'Heat it to what temperature before the extract goes in? Off the heat while stirring it in?', why: 'Extract stirred into boiling water on the heat can scorch on the bottom.',
    boxes: [{ k: 'extractAddTemp', label: 'Heat to', kind: 'temp' }, { k: 'offHeat', label: 'Off the heat to stir in', kind: 'yesno' }], next: 'E12' },
  { id: 'E12', branch: 'Extract Kit', ask: 'Boil: how many minutes? (0 = No Boil)', why: 'With No Boil the water is still boiled and cooled for sanitation: for how many minutes, and cooled to what temperature?',
    boxes: [{ k: 'boilMin', label: 'Boil', kind: 'min' }, { k: 'waterBoilMin', label: 'No Boil: boil the water for', kind: 'min', show: a => a.boilMin === 0 }, { k: 'waterCoolTemp', label: 'No Boil: cool the water to', kind: 'temp', show: a => a.boilMin === 0 }],
    next: a => kitLevel(a) === 1 ? 'E15' : 'E13' },
  { id: 'E13', branch: 'Extract Kit', ask: 'Each hop: name, amount, AAU % on the sheet, use and minutes before the end?', show: a => kitLevel(a) > 1, next: 'E14',
    list: { k: 'hops', cols: [{ k: 'name', label: 'Hop', kind: 'text' }, { k: 'amt', label: 'Amount', kind: 'hopwt' }, { k: 'aa', label: 'AAU %', kind: 'pct' }, { k: 'use', label: 'Use', kind: 'pick', choices: HOP_USE }, { k: 'min', label: 'Minutes', kind: 'min' }] } },
  { id: 'E14', branch: 'Extract Kit', ask: 'Flame-out or whirlpool hops: at what temperature, for how many minutes?', show: a => kitLevel(a) > 1,
    boxes: [{ k: 'wpTemp', label: 'Whirlpool at', kind: 'temp' }, { k: 'wpMin', label: 'For', kind: 'min' }], next: 'E15' },
  { id: 'E15', branch: 'Extract Kit', ask: 'Anything else in the boil (Whirlfloc, nutrient, spices)? How much, how many minutes before the end?',
    list: { k: 'adds', cols: [{ k: 'name', label: 'Name', kind: 'text' }, { k: 'amount', label: 'Amount', kind: 'num' }, { k: 'unit', label: 'Unit (g, tsp, tablet ...)', kind: 'text' }, { k: 'min', label: 'Minutes', kind: 'min' }] }, next: 'E16' },
  { id: 'E16', branch: 'Extract Kit', ask: 'Chill: to what temperature, and how?', boxes: [{ k: 'chillTemp', label: 'Chill to', kind: 'temp' }, { k: 'chillHow', label: 'How', kind: 'pick', choices: CHILL_HOW }], next: 'E17' },
  { id: 'E17', branch: 'Extract Kit', ask: 'Fermenter: how much cold water goes in first, and how cold is the top off water?', why: 'Skynet tops off to the batch size.',
    boxes: [{ k: 'prefillVol', label: 'Water in first', kind: 'vol' }, { k: 'topoffTemp', label: 'Top off water at', kind: 'temp' }], next: 'F1' },

  // ---- Branch A: the All Grain Interview (the boxes a BeerSmith file carries)
  { id: 'A1', branch: 'All Grain', ask: 'Name and style?', boxes: [{ k: 'name', label: 'Name', kind: 'text' }, { k: 'style', label: 'Style', kind: 'text' }], next: 'A2' },
  { id: 'A2', branch: 'All Grain', ask: 'Batch size into the fermenter, and the targets?',
    boxes: [{ k: 'batch', label: 'Batch', kind: 'vol' }, { k: 'og', label: 'OG', kind: 'sg' }, { k: 'fg', label: 'FG', kind: 'sg' }, { k: 'ibu', label: 'IBU', kind: 'num' }, { k: 'color', label: 'Color (SRM)', kind: 'num' }], next: 'A3' },
  { id: 'A3', branch: 'All Grain', ask: 'Is the grain milled already, or milled on Brew Day?', show: (a, ctx) => ctx?.brewerType === 'allgrainmill',
    boxes: [{ k: 'grainMilled', kind: 'pick', choices: [['yes', 'Milled already'], ['brewday', 'Milled on Brew Day']] }], next: 'A4' },
  { id: 'A4', branch: 'All Grain', ask: 'Each grain: name, weight, color, potential?',
    list: { k: 'grains', cols: [{ k: 'name', label: 'Grain', kind: 'text' }, { k: 'amt', label: 'Weight', kind: 'wt' }, { k: 'color', label: 'Color (SRM)', kind: 'num' }, { k: 'yield', label: 'Potential (yield %)', kind: 'pct' }] }, next: 'A5' },
  { id: 'A5', branch: 'All Grain', ask: 'The grain\'s temperature (the room it sits in)?', boxes: [{ k: 'grainTemp', label: 'Grain at', kind: 'temp' }], next: 'A6' },
  { id: 'A6', branch: 'All Grain', ask: 'Mash: each step, its temperature and minutes?', why: 'One row for a single infusion; one row per rest for a step mash.',
    list: { k: 'mashSteps', cols: [{ k: 'name', label: 'Step', kind: 'text' }, { k: 'temp', label: 'At', kind: 'temp' }, { k: 'min', label: 'Minutes', kind: 'min' }, { k: 'how', label: 'How', kind: 'pick', choices: [['infusion', 'Infusion'], ['direct', 'Direct heat'], ['recirc', 'Recirculation']] }] }, next: 'A7' },
  { id: 'A7', branch: 'All Grain', ask: 'Water to grain ratio?', boxes: [{ k: 'w2g', label: 'Ratio', kind: 'ratio' }], next: 'A8' },
  { id: 'A8', branch: 'All Grain', ask: 'Strike: how much water, at what temperature?', why: 'Leave them empty and Calculate on the Recipe tab works them out from the grain, its temperature and the ratio.',
    boxes: [{ k: 'strikeVol', label: 'Strike water', kind: 'vol' }, { k: 'strikeTemp', label: 'Strike at', kind: 'temp' }], next: 'A9' },
  { id: 'A9', branch: 'All Grain', ask: 'Mash out: yes or no; at what temperature, for how long?',
    boxes: [{ k: 'mashOut', label: 'Mash out', kind: 'yesno' }, { k: 'mashOutTemp', label: 'At', kind: 'temp', show: a => a.mashOut === true }, { k: 'mashOutMin', label: 'For', kind: 'min', show: a => a.mashOut === true }], next: 'A10' },
  { id: 'A10', branch: 'All Grain', ask: 'Sparge: batch, fly or none? How much water, at what temperature, for how long?',
    boxes: [{ k: 'spargeType', label: 'Sparge', kind: 'pick', choices: SPARGE }, { k: 'spargeVol', label: 'Sparge water', kind: 'vol' }, { k: 'spargeTemp', label: 'At', kind: 'temp' }, { k: 'spargeMin', label: 'For', kind: 'min' }], next: 'A11' },
  { id: 'A11', branch: 'All Grain', ask: 'Pre-boil volume, boil minutes and boil-off per hour?',
    boxes: [{ k: 'boilVol', label: 'Pre-boil volume', kind: 'vol' }, { k: 'boilMin', label: 'Boil', kind: 'min' }, { k: 'boilOff', label: 'Boil-off per hour', kind: 'vol' }], next: 'A12' },
  { id: 'A12', branch: 'All Grain', ask: 'Each hop: name, amount, AAU %, use and minutes?',
    list: { k: 'hops', cols: [{ k: 'name', label: 'Hop', kind: 'text' }, { k: 'amt', label: 'Amount', kind: 'hopwt' }, { k: 'aa', label: 'AAU %', kind: 'pct' }, { k: 'use', label: 'Use', kind: 'pick', choices: HOP_USE }, { k: 'min', label: 'Minutes', kind: 'min' }] }, next: 'A13' },
  { id: 'A13', branch: 'All Grain', ask: 'Whirlpool or Hop Stand: at what temperature, for how many minutes?', boxes: [{ k: 'wpTemp', label: 'Whirlpool at', kind: 'temp' }, { k: 'wpMin', label: 'For', kind: 'min' }], next: 'A14' },
  { id: 'A14', branch: 'All Grain', ask: 'Other fermentables (sugar, extract, fruit): amount and when?',
    list: { k: 'otherFerm', cols: [{ k: 'name', label: 'Name', kind: 'text' }, { k: 'amt', label: 'Amount', kind: 'wt' }, { k: 'when', label: 'When', kind: 'pick', choices: WHEN_IN }, { k: 'min', label: 'Minutes before the end', kind: 'min' }] }, next: 'A15' },
  { id: 'A15', branch: 'All Grain', ask: 'Adjuncts and finings: amount and minutes?',
    list: { k: 'adds', cols: [{ k: 'name', label: 'Name', kind: 'text' }, { k: 'amount', label: 'Amount', kind: 'num' }, { k: 'unit', label: 'Unit (g, tsp, tablet ...)', kind: 'text' }, { k: 'min', label: 'Minutes', kind: 'min' }] }, next: 'A16' },
  { id: 'A16', branch: 'All Grain', ask: 'Water: Tap Water or a Water Profile? Any distilled or RO? Target pH?',
    boxes: [{ k: 'waterProfile', label: 'Water', kind: 'pick', choices: ctx => ctx?.waterProfiles ?? [] }, { k: 'distilledPct', label: 'Distilled or RO %', kind: 'pct' }, { k: 'ph', label: 'Target pH', kind: 'num' }, { k: 'salts', label: 'Salts (each, grams, mash or sparge)', kind: 'text' }], next: 'A17' },
  { id: 'A17', branch: 'All Grain', ask: 'Chill to what temperature?', boxes: [{ k: 'chillTemp', label: 'Chill to', kind: 'temp' }], next: 'F1' },

  // ---- Branch O: Other Brews (OakBarn Brewery to add the questions for each)
  { id: 'O1', branch: 'Other Brews', ask: 'What are you making?', boxes: [{ k: 'brewKind', kind: 'pick', choices: OTHER_BREWS }, { k: 'name', label: 'Name', kind: 'text' }], next: 'O2' },
  { id: 'O2', branch: 'Other Brews', ask: 'Batch size?', boxes: [{ k: 'batch', label: 'Batch', kind: 'vol' }], next: 'O3' },
  { id: 'O3', branch: 'Other Brews', ask: 'Each ingredient (ginger, tea, honey, juice, sugar, fruit, acid, nutrient) and its amount?',
    list: { k: 'adds', cols: [{ k: 'name', label: 'Ingredient', kind: 'text' }, { k: 'amount', label: 'Amount', kind: 'num' }, { k: 'unit', label: 'Unit (g, cup, lb ...)', kind: 'text' }] }, next: 'O4' },
  { id: 'O4', branch: 'Other Brews', ask: 'Infuse or steep (ginger, tea, spices): how much water, how hot, how long?',
    boxes: [{ k: 'steepVol', label: 'Water', kind: 'vol' }, { k: 'steepTemp', label: 'At', kind: 'temp' }, { k: 'steepMin', label: 'For', kind: 'min' }], next: 'O5' },
  { id: 'O5', branch: 'Other Brews', ask: 'Heat or boil anything? For how many minutes? (0 = no boil)', boxes: [{ k: 'boilMin', label: 'Boil', kind: 'min' }], next: 'O6' },
  { id: 'O6', branch: 'Other Brews', ask: 'Cool to what temperature before the yeast (or SCOBY) goes in?', boxes: [{ k: 'pitchTemp', label: 'Cool to', kind: 'temp' }], next: 'O7' },
  { id: 'O7', branch: 'Other Brews', ask: 'Mead: the nutrient schedule (when, how much)?', show: a => a.brewKind === 'mead', boxes: [{ k: 'nutrients', label: 'Schedule', kind: 'text' }], next: 'O8' },
  { id: 'O8', branch: 'Other Brews', ask: 'Kombucha: first ferment days, second ferment days and its flavoring?', show: a => a.brewKind === 'kombucha',
    boxes: [{ k: 'f1Days', label: 'First ferment', kind: 'days' }, { k: 'f2Days', label: 'Second ferment', kind: 'days' }, { k: 'f2Flavor', label: 'Flavoring', kind: 'text' }], next: 'F1' },

  // ---- Branch F: Fermentation and Packaging (every branch)
  { id: 'F1', branch: 'Ferment', ask: 'Which yeast (or SCOBY)? Dry or liquid? How much?',
    list: { k: 'yeasts', cols: [{ k: 'name', label: 'Yeast', kind: 'text' }, { k: 'form', label: 'Form', kind: 'pick', choices: FORMS }, { k: 'amount', label: 'Packs', kind: 'num' }] }, next: 'F2' },
  { id: 'F2', branch: 'Ferment', ask: 'A yeast starter? Rehydrate dry yeast: how much water, how warm?', why: 'The starter is a reminder a day or two ahead.',
    boxes: [{ k: 'starter', label: 'Yeast starter', kind: 'yesno' }, { k: 'starterHours', label: 'Hours ahead', kind: 'num', show: a => a.starter === true }, { k: 'rehydrateVol', label: 'Rehydrate in', kind: 'vol' }, { k: 'rehydrateTemp', label: 'At', kind: 'temp' }], next: 'F3' },
  { id: 'F3', branch: 'Ferment', ask: 'Aerate: how, and for how many minutes?', boxes: [{ k: 'aerateHow', label: 'How', kind: 'pick', choices: AERATE }, { k: 'aerateMin', label: 'For', kind: 'min' }], next: 'F4' },
  { id: 'F4', branch: 'Ferment', ask: 'Pitch at or below what temperature?', boxes: [{ k: 'pitchTemp', label: 'Pitch at', kind: 'temp' }], next: 'F5' },
  { id: 'F5', branch: 'Ferment', ask: 'Primary: at what temperature, for how many days?', boxes: [{ k: 'primaryTemp', label: 'At', kind: 'temp' }, { k: 'primaryDays', label: 'For', kind: 'days' }], next: 'F6' },
  { id: 'F6', branch: 'Ferment', ask: 'Secondary: yes or no; at what temperature, for how many days?',
    boxes: [{ k: 'secondary', label: 'Secondary', kind: 'yesno' }, { k: 'secondaryTemp', label: 'At', kind: 'temp', show: a => a.secondary === true }, { k: 'secondaryDays', label: 'For', kind: 'days', show: a => a.secondary === true }], next: 'F7' },
  { id: 'F7', branch: 'Ferment', ask: 'Dry hops: which, how much, on which day, for how many days?', show: a => !isOther(a) && !(isKit(a) && kitLevel(a) === 1),
    list: { k: 'dryHops', cols: [{ k: 'name', label: 'Hop', kind: 'text' }, { k: 'amt', label: 'Amount', kind: 'hopwt' }, { k: 'day', label: 'On day', kind: 'days' }, { k: 'days', label: 'For days', kind: 'days' }] }, next: 'F8' },
  { id: 'F8', branch: 'Ferment', ask: 'Cold crash: at what temperature, for how many days?', boxes: [{ k: 'crashTemp', label: 'At', kind: 'temp' }, { k: 'crashDays', label: 'For', kind: 'days' }], next: 'F9' },
  { id: 'F9', branch: 'Package', ask: 'Bottles or keg?', why: 'Bottles: the priming sugar, how much, in how much water (boiled). Keg: the pressure and temperature.',
    boxes: [{ k: 'package', kind: 'pick', choices: PACKAGE }, { k: 'primingSugar', label: 'Priming sugar', kind: 'text', show: a => a.package === 'bottle' }, { k: 'primingAmt', label: 'How much', kind: 'wt', show: a => a.package === 'bottle' },
      { k: 'primingWater', label: 'In water', kind: 'vol', show: a => a.package === 'bottle' }, { k: 'kegPsi', label: 'Keg pressure (psi)', kind: 'num', show: a => a.package === 'keg' }, { k: 'kegTemp', label: 'Keg at', kind: 'temp', show: a => a.package === 'keg' }], next: 'F10' },
  { id: 'F10', branch: 'Package', ask: 'Condition: at what temperature, for how many days?', boxes: [{ k: 'condTemp', label: 'At', kind: 'temp' }, { k: 'condDays', label: 'For', kind: 'days' }], next: 'B1' },

  // ---- Branch B: Brew Day (what the Recipe cannot know; the OG, the volume and the FG are asked on the Brew Day itself)
  { id: 'B1', branch: 'Brew Day', ask: 'Brew Day date and start time?', boxes: [{ k: 'brewDate', label: 'Date and time', kind: 'datetime' }], next: 'B2' },
  { id: 'B2', branch: 'Brew Day', ask: 'The Actual AAU % of each hop (from its package)?', why: 'Calculate needs it above 0. A Recipe saved to the library keeps it at 0 for next time (Rule 17.21).',
    show: a => (a.hops || []).some(h => h?.name), boxes: [{ k: 'hopsActual', kind: 'hopsActual' }], next: 'B3' },
  { id: 'B3', branch: 'Brew Day', ask: 'Everything in hand?', why: 'The list from your answers. PreBrew asks it again on Brew Day.', boxes: [{ k: 'inHand', kind: 'yesno' }], next: 'done' },
];

export const RECIPE_START = 'R1';
export const questionById = id => RECIPE_QUESTIONS.find(q => q.id === id);
const nextOf = (q, a) => typeof q.next === 'function' ? q.next(a) : q.next;
// the path through the questions for the answers so far: the rows shown, in order (a row whose show is false is passed over)
export function recipePath(a, ctx, upTo = 200) {
  const out = []; let id = RECIPE_START;
  while (id && id !== 'done' && id !== 'import' && out.length < upTo) {
    const q = questionById(id); if (!q) throw new Error(`Recipe Interview: no question ${id}`);
    if (!q.show || q.show(a, ctx)) out.push(q);
    id = nextOf(q, a);
  }
  return { rows: out, end: id };
}
export const choicesOf = (b, ctx) => typeof b.choices === 'function' ? b.choices(ctx) : (b.choices || []);
// the words of each kind's unit, by Units (Rule 2.59)
export function unitOf(kind, metric) {
  return { temp: metric ? '°C' : '°F', vol: metric ? 'L' : 'gal', wt: metric ? 'kg' : 'lb', hopwt: metric ? 'g' : 'oz', min: 'min', days: 'days', pct: '%', ratio: metric ? 'L/kg' : 'qt/lb' }[kind] ?? '';
}
const num = v => v === '' || v === null || v === undefined || !Number.isFinite(+v) ? null : +v;
const r3 = v => v === null ? null : Math.round(v * 1e6) / 1e6;      // 6 places: 1 oz of hops is 0.028350 kg
// to metric, from what was typed in Units
export function toMetric(kind, v, metric) {
  const x = num(v); if (x === null) return null;
  if (kind === 'temp') return r3(toC(x, metric ? 'C' : 'F'));
  if (kind === 'vol') return r3(toL(x, metric ? 'L' : 'gal'));
  if (kind === 'wt') return r3(toKg(x, metric ? 'kg' : 'lb'));
  if (kind === 'hopwt') return r3(toKg(x, metric ? 'g' : 'oz'));
  if (kind === 'ratio') return r3(toRatio(x, metric ? 'L/kg' : 'qt/lb'));
  return x;
}

// The Recipe the answers make. base: a NEW Recipe (its profiles and defaults); metric: the Units the answers were typed in.
// Every answer with a Recipe box goes in that box; every other answer goes in recipe.interview, kept in metric.
export function interviewRecipe(a, { metric = false, base = {}, ctx = {} } = {}) {
  const shown = new Set(recipePath(a, ctx).rows.flatMap(q => [...(q.boxes || []).filter(b => !b.show || b.show(a)).map(b => b.k), ...(q.list ? [q.list.k] : [])]));
  const has = k => shown.has(k), m = (kind, k) => has(k) ? toMetric(kind, a[k], metric) : null, t = k => has(k) ? String(a[k] ?? '').trim() : '';
  const rows = k => has(k) ? (a[k] || []).filter(x => String(x?.name ?? '').trim()) : [];
  const level = isKit(a) ? kitLevel(a) : isGrain(a) ? 4 : 1;
  const iv = {};
  const keep = (k, v) => { if (v !== null && v !== undefined && v !== '') iv[k] = v; };
  const ferms = [];
  for (const x of rows('extracts')) { ferms.push({ name: x.name, type: x.form === 'dry extract' ? 'dry extract' : 'extract', kg: toMetric('wt', x.amt, metric), addAfterBoil: x.when === 'after' || x.when === 'fermenter' }); }
  for (const x of rows('sugars')) ferms.push({ name: x.name, type: 'sugar', kg: toMetric('wt', x.amt, metric) });
  for (const x of rows('steepGrains')) ferms.push({ name: x.name, type: 'grain', kg: toMetric('wt', x.amt, metric) });
  for (const x of rows('grains')) ferms.push({ name: x.name, type: 'grain', kg: toMetric('wt', x.amt, metric), color: num(x.color), yieldPct: num(x.yield) });
  for (const x of rows('otherFerm')) ferms.push({ name: x.name, type: 'sugar', kg: toMetric('wt', x.amt, metric), addAfterBoil: x.when === 'after' || x.when === 'fermenter' });
  // when each fermentable goes in (NEW: no Recipe box yet for the minutes)
  const adds = [...rows('extracts'), ...rows('otherFerm')].filter(x => x.when).map(x => ({ name: x.name, when: x.when, min: x.when === 'late' ? num(x.min) : null }));
  if (adds.length) iv.fermentableAdditions = adds;
  const boilMin = has('boilMin') ? num(a.boilMin) : null;
  const hops = [...rows('hops').map(x => ({ name: x.name, kg: toMetric('hopwt', x.amt, metric), alpha: num(x.aa), use: x.use || 'boil', time: num(x.min) ?? (x.use === 'boil' || !x.use ? boilMin ?? 60 : 0) })),
    ...rows('dryHops').map(x => ({ name: x.name, kg: toMetric('hopwt', x.amt, metric), alpha: null, use: 'dry hop', time: 0, dryDays: num(x.days), ...(num(x.day) !== null ? { _day: num(x.day) } : {}) }))];
  const actual = has('hopsActual') ? a.hopsActual || {} : {};
  for (const h of hops) { const v = num(actual[h.name]); if (v !== null) h.alphaActual = v; }
  const dryDays = hops.filter(h => h._day !== undefined).map(h => ({ name: h.name, day: h._day })); if (dryDays.length) iv.dryHopDays = dryDays;
  for (const h of hops) delete h._day;
  const miscs = rows('adds').map(x => ({ name: x.name, use: isOther(a) ? 'primary' : 'boil', amount: num(x.amount) ?? 0, unit: String(x.unit ?? '').trim(), time: num(x.min) ?? 0 }));
  const yeasts = rows('yeasts').map(x => ({ name: x.name, form: x.form || 'Dry', amount: num(x.amount) ?? 1, unit: 'Packs', starter: a.starter === true && has('starter') }));
  const steps = rows('mashSteps').map(x => ({ name: x.name, type: x.how === 'direct' ? 'Temperature' : x.how === 'recirc' ? 'Temperature' : 'Infusion', tempC: toMetric('temp', x.temp, metric), min: num(x.min) ?? 0 }));
  if (has('mashOut') && a.mashOut === true) steps.push({ name: 'Mash Out', type: 'Temperature', tempC: m('temp', 'mashOutTemp'), min: num(a.mashOutMin) ?? 10 });
  const r = {
    ...base, sourceFormat: 'manual', name: t('name') || base.name || '', style: t('style') || (isOther(a) ? (OTHER_BREWS.find(([k]) => k === a.brewKind)?.[1] ?? '') : base.style || ''),
    level, volumes: { batchLiters: m('vol', 'batch') ?? base.volumes?.batchLiters ?? null, boilLiters: m('vol', 'boilVol') },
    og: has('og') ? num(a.og) : null, fg: has('fg') ? num(a.fg) : null, ibu: has('ibu') ? num(a.ibu) : null, color: has('color') ? num(a.color) : null,
    boilTime: boilMin ?? (level === 1 ? 0 : base.boilTime ?? 60), ...(boilMin === 0 ? { boilProfile: '' } : {}),
    pitchTempC: m('temp', 'pitchTemp') ?? m('temp', 'chillTemp') ?? base.pitchTempC ?? null,
    whirlpoolMinutes: has('wpMin') ? num(a.wpMin) : null,
    ingredients: { fermentables: ferms, hops, yeasts, miscs, waters: [] },
  };
  if (has('grainTemp') && m('temp', 'grainTemp') !== null) r.grainTempC = m('temp', 'grainTemp');
  if (has('w2g') && m('ratio', 'w2g') !== null) r.waterToGrain = m('ratio', 'w2g');
  if (has('strikeVol')) r.strikeLiters = m('vol', 'strikeVol');
  if (has('strikeTemp')) r.strikeTempC = m('temp', 'strikeTemp');
  if (has('spargeType') && a.spargeType) r.spargeType = a.spargeType;
  if (has('spargeVol')) r.spargeLiters = m('vol', 'spargeVol');
  if (has('spargeTemp')) r.spargeTempC = m('temp', 'spargeTemp');
  if (has('spargeMin')) r.spargeMinutes = num(a.spargeMin);
  if (has('boilOff')) r.boilOffRate = m('vol', 'boilOff');
  if (has('waterProfile') && a.waterProfile) r.waterProfile = a.waterProfile;
  if (steps.length) r.mash = { profileName: 'Recipe Interview', grainTempC: r.grainTempC ?? null, spargeTempC: r.spargeTempC ?? null, steps };
  // the answers with no Recipe box yet (plan 5.3 "New Recipe fields"), kept in metric
  keep('abvPct', has('abv') ? num(a.abv) : null);
  for (const [k, kind, key] of [['steepVol', 'vol', 'steepL'], ['steepTemp', 'temp', 'steepTempC'], ['rinseVol', 'vol', 'rinseL'], ['rinseTemp', 'temp', 'rinseTempC'], ['extractAddTemp', 'temp', 'extractAddTempC'],
    ['waterCoolTemp', 'temp', 'waterCoolTempC'], ['wpTemp', 'temp', 'whirlpoolTempC'], ['chillTemp', 'temp', 'chillTempC'], ['prefillVol', 'vol', 'prefillL'], ['topoffTemp', 'temp', 'topoffTempC'],
    ['mashOutTemp', 'temp', 'mashOutTempC'], ['rehydrateVol', 'vol', 'rehydrateL'], ['rehydrateTemp', 'temp', 'rehydrateTempC'], ['primaryTemp', 'temp', 'primaryTempC'], ['secondaryTemp', 'temp', 'secondaryTempC'],
    ['crashTemp', 'temp', 'coldCrashTempC'], ['primingAmt', 'wt', 'primingKg'], ['primingWater', 'vol', 'primingWaterL'], ['kegTemp', 'temp', 'kegTempC'], ['condTemp', 'temp', 'conditionTempC']])
    keep(key, m(kind, k));
  for (const [k, key] of [['steepMin', 'steepMinutes'], ['waterBoilMin', 'waterBoilMinutes'], ['aerateMin', 'aerateMinutes'], ['primaryDays', 'primaryDays'], ['secondaryDays', 'secondaryDays'], ['crashDays', 'coldCrashDays'],
    ['condDays', 'conditionDays'], ['kegPsi', 'kegPsi'], ['starterHours', 'starterHoursAhead'], ['distilledPct', 'distilledPct'], ['ph', 'targetPh'], ['f1Days', 'firstFermentDays'], ['f2Days', 'secondFermentDays']])
    keep(key, has(k) ? num(a[k]) : null);
  for (const [k, key] of [['offHeat', 'offHeatToStir'], ['mashOut', 'mashOut'], ['secondary', 'secondary'], ['starter', 'yeastStarter'], ['inHand', 'everythingInHand']])
    if (has(k) && typeof a[k] === 'boolean') iv[key] = a[k];
  for (const [k, key] of [['chillHow', 'chillMethod'], ['grainMilled', 'grainMilled'], ['salts', 'salts'], ['brewKind', 'brewKind'], ['nutrients', 'nutrientSchedule'], ['f2Flavor', 'secondFermentFlavor'],
    ['aerateHow', 'aerateMethod'], ['package', 'package'], ['primingSugar', 'primingSugar'], ['brewDate', 'brewDate']])
    keep(key, t(k));
  r.interview = iv;
  return r;
}
