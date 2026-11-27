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
//         step   which of the 6 steps (SETUP_STEPS) the row is in: the word lit in the steps strip at the top
//         ask    the question, plain English; why  the explanation under it
//         kind   'pick' (one click, a dropdown when there are more than 6 choices, Rule 2.6) · 'text' · 'num' · 'yesno' ·
//                'branch' (the first page of a branch: it says what the branch asks; its Skip skips the whole branch)
//         choices  [[value, words, explanation?], ...] or ctx => that list
//         start  ctx => Skynet's own answer (what Skip keeps, and what the box starts on)
//         save   'defaults' (☰ Menu > Default settings) · 'boil' (the boil temperature place) · 'browser' (this browser only) · 'none'
//         must   true: no Skip button (it must be answered)
//         show   (answers, ctx) => false leaves the question out (optional)
//         when   { answerId: value, ... }: the question shows only when each of those answers is that value (optional; OakBarn Brewery,
//                2026-11-26: "I might add small item like the Piped Manifold as further questions will branch on it"). For example
//                when: { pipedManifold: true } asks it only of a brewery with a Piped Manifold. A value may be a list: any of them.
//         note   a warning shown on that page (optional);  more  ctx => a plain line under the answers (optional)
//         byUnits  true: its start is worked out again when US or Metric is picked

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
// Brewery Vessels (OakBarn Brewery, 2026-11-26, Default settings markup: Brewer Level "New Section of Brewery Vessels and with be
// questions not a DDLB"): a few plain questions about the vessels work out the Brewer Level, kept as brewerLevel as before
export const VESSEL_COUNTS = [['1', 'One vessel', 'One pot, or one All In One'], ['2', 'Two vessels', 'A Mash Tun (it may be a cooler) and a Kettle'], ['3', 'Three or more vessels', 'HLT, Mash Tun and Kettle']];
export const PUMP_COUNTS = [['1', 'One pump (or none)'], ['2', 'Two pumps']];
// Number of Hot Side vessels (OakBarn Brewery, 2026-11-27: "Number of Hot Side vessels needs to be a Box and you can enter a number.
// The number can be from 1 - 10"; "Then Branch depending on the number entered"): a whole number 1 to 10 (null: not a good one).
// The branches: 1, 2, and 3 or more (VESSELS_3UP)
export const VESSELS_MIN = 1, VESSELS_MAX = 10;
export const vesselCountOf = v => { const n = Number(String(v ?? '').trim()); return String(v ?? '').trim() !== '' && Number.isInteger(n) && n >= VESSELS_MIN && n <= VESSELS_MAX ? n : null; };
export const VESSELS_3UP = Array.from({ length: VESSELS_MAX - 2 }, (_, i) => String(i + 3));
export const VESSEL_KEYS = ['vesselCount', 'allInOne', 'kettleOutlet', 'kettlePump', 'pumpCount', 'recirculate', 'allGrainPlus'];
// the Brewer Level (1 to 9) from the answers
export function brewerLevelOf(v) {
  const c = vesselCountOf(v?.vesselCount), n = c == null ? '' : c >= 3 ? '3' : String(c);
  if (n === '1') return v.allInOne ? '4' : v.kettlePump ? '3' : v.kettleOutlet ? '2' : '1';
  if (n === '2') return String(v.pumpCount) === '2' ? '6' : '5';
  if (n === '3') return v.allGrainPlus ? '9' : v.recirculate ? '8' : '7';
  return null;
}
// the answers that give a Brewer Level (a saved Level from before the questions, or Skynet's 7)
export function vesselAnswersOf(level) {
  const l = +level || +BREWER_LEVEL_DEFAULT;
  const a = { vesselCount: l <= 4 ? '1' : l <= 6 ? '2' : '3', allInOne: l === 4, kettleOutlet: l === 2 || l === 3, kettlePump: l === 3, pumpCount: l === 6 ? '2' : '1', recirculate: l >= 8, allGrainPlus: l === 9 };
  return a;
}
// the saved answers, or the ones from the saved Brewer Level
export const vesselStart = (d, k) => d?.[k] !== undefined ? d[k] : vesselAnswersOf(d?.brewerLevel)[k];
// the Level the New Schema Interview starts a Brewing Tab on (Rule 2.58), from the Brewer Level and the Brewer Type, when no Tab
// Level was picked before
export function nsiLevelOf(brewerLevel, brewerType) {
  const n = +brewerLevel || 0, grain = GRAIN_TYPES.includes(brewerType);
  if (!n) return null;
  if (n <= 4) return grain ? 'biab' : brewerType === 'partial' ? 'partial' : 'stove';
  return n <= 6 ? 'two' : 'mashtun';
}

const US_FT = 0.3048;      // feet to metres (the same factor the boil temperature place uses)

// the 6 steps of the strip (Panel Update 17, OakBarn Brewery, 2026-11-26: "1. Units 2. Help language 3. Brewer Type 4. Brewery
// 5. Recipes 6. Other Defaults"; "Skip Button Appears Not Available Before"; "These only pertain to the Skynet Panel Settings Defaults").
// (Before 2026-11-27: steps 1 to 3 must be answered.) Steps 3 to 5 are branches: each opens on a page that says what it asks; Skip there skips the whole
// branch, and inside it each question has its own Skip.
// The order and the mandatory steps changed (OakBarn Brewery, 2026-11-27, his picture of the first screen, picked "A": "1. Units 2. Brewer
// Type 3. Brewery 4. Other Defaults 5. Recipe Defaults 6. Help Language"; "Only the first two simple questions are mandatory"; "Skip will
// get the Do Not Enter on the mandatory questions"): steps 1 and 2 must be answered; 3 to 5 are branches; 6 is one question with a Skip.
export const SETUP_STEPS = ['Units', 'Brewer Type', 'Brewery', 'Other Defaults', 'Recipe Defaults', 'Help Language'];
// the Brewer Types question 2 offers; All Grain Mill own Grain is All Grain (own Grain Mill)
const MILL = 'allgrainmill', GRAIN = 'allgrain', BIAB = 'biab', AIO = 'allinone';
// the Brewer Types that mash their own grain (they get the Mash Profile question)
export const GRAIN_TYPES = [BIAB, AIO, GRAIN, MILL];
// question 2's Tick Boxes, in Fritz's words (2026-11-27), each a Brewer Type (public/recipecalc.js BREWER_TYPES)
// (2026-11-27 later: "Add All in One Brewer and BIAB to brewer types")
export const BREWER_TICKS = [['cankit', 'Extract Kit'], ['partial', 'Extract Brewer add Own Hops'], [BIAB, 'BIAB (Brew in a Bag)'], [AIO, 'All In One Brewer'], [GRAIN, 'All Grain'], [MILL, 'All Grain Mill own Grain']];
const L_PER_GAL = 3.785411784;
const round2 = n => Math.round(n * 100) / 100;

// the Welcome page: the first page of the interview, before question 1 (OakBarn Brewery, 2026-11-27, his picture of the first screen,
// spelling and grammar corrected). The blue box is the one phone and small screen note (it replaces the warning that was on question 1)
export const SETUP_WELCOME = {
  note: 'While Skynet can do many things, it cannot make a physical screen any larger. It can fill a screen, but a phone\'s screen is not very big for precise work. Skynet is much easier to design and manipulate on a computer. Skynet may be controlled from almost any device with a browser and internet connection, but finer details are hard to see on a small screen.',
  paras: [
    'This is an interview with questions to aid you in setting up YOUR Brewery. And don\'t worry, nothing is written in stone. Any answers you give now will guide you into setting up Skynet the first time, but any of these can easily be changed at any time by accessing the Default settings from the ☰ Menu. You can even redo this interview if you want to. As you go into more complex brewing or buy that shiny new stainless pot, Skynet can grow with you. If you need to take a break or call it a night, Skynet will keep your answers and even store them if you shut down your computer.',
    'Only the first two simple questions are mandatory. All other questions can be answered in any order. The longest (and most important) is your Brewery, where the physical brewery is duplicated on the Skynet screen as best it can. Skynet believes that a pump should look like a pump and not some odd icon. If your Brewery is simple, the questions are easy, but if you are an expert Brewer with a 3 Vessel piped Brewery, the questions take longer.',
  ],
  proceed: 'Click to proceed:',
};

// Screen 2, the button guide (OakBarn Brewery, 2026-11-27, "Screen Interview 2", his picture, spelling and grammar corrected): after the
// Welcome page. Each row: the buttons as they look (no: true = with the ⛔ Do Not Enter sign) and what they do
export const SETUP_GUIDE = {
  intro: 'The Setup Interview has a button selection at the top of every screen.',
  rows: [
    [[['? Help']], 'Brings up the Help for the question. If you do not understand that, I cannot help!'],
    [[['◀ Back']], 'Returns to the previous screen.'],
    [[['Skip']], 'Allows you to skip the question. You can return later. Next will also work.'],
    [[['Skip', true], 'and', ['Next ▶', true]], 'are not available on 1. Units or 2. Brewer Type until the questions are answered.'],
    [[['Next ▶', 'primary']], 'goes to the next question. Skip and Next do very similar actions.'],
    [[['✖ Close'], ['✕']], 'Closes the interview.'],
    [[['✖ Close', true], ['✕', true]], 'are not available until 1. Units and 2. Brewer Type are answered.'],
  ],
};

// Screen 3, how to answer (OakBarn Brewery, 2026-11-27, "Screen 3", his picture, spelling and grammar corrected): the first method is a
// Tick Box, shown before and after a click
export const SETUP_TICK = {
  intro: 'Questions are answered in two methods. The first method is to check a Tick Box:',
  ask: 'Are you a morning person?',
  boxes: ['Yes', 'If 11:59 = morning', 'No'],
  ticked: 1,
};

// Screen 4, how to answer (OakBarn Brewery, 2026-11-27, "next screen", his picture, spelling and grammar corrected): the second method is
// a Drop Down list, shown closed, open and with Chocolate picked (the first one can be tried)
export const SETUP_DROP = {
  intro: ['The second method is a Drop Down list box that limits your choices. Sometimes there might be an Other choice that allows you to use something not on the list, but if it is not there, you need to choose the best or closest answer.',
    'In the Ice Cream Question below, the Other is not available as the Skynet Shop only has these flavors available today.'],
  ask: 'Favorite Ice Cream?',
  choices: ['Vanilla', 'Chocolate', 'Strawberry', 'Mint', 'Cookie', 'Orange Sherbet'],
  arrow: 'Click the little down arrow to see your choices:',
  pick: 'Click to make your choice. Since my favorite is not available, I am choosing Chocolate.',
  picked: 1,
  done: 'Chocolate was selected.',
};

// Screen 5, Hot Spots (OakBarn Brewery, 2026-11-27, his picture, spelling and grammar corrected): the steps strip can be clicked to
// go to a step; the sample strip on the page can be tried (it shows below how that step's page looks)
export const SETUP_HOTSPOTS = {
  intro: 'We are almost ready to start the interview, but one last option is available on some screens.',
  spots: 'These are all Hot Spots. You can click them to navigate.',
  sample: 'Other Defaults',
  click: 'Click 4. Other Defaults and you are taken to the Setup Interview: Other Defaults',
};

// Screen 6, the last one before question 1 (OakBarn Brewery, 2026-11-27, his picture, spelling and grammar corrected)
export const SETUP_START = {
  paras: [
    'We are now going to start the interview with two easy questions.',
    'Answer the questions to the best of your knowledge; there are no bad answers. You will not be graded. These are only an aid to you, and if you do not know the answer or it just doesn\'t matter... Try to use the best answer or just take your best guess. But the more accurate you are, the more the Brewery will match your existing Brewery. Skynet wants its screens to look like YOUR Brewery as much as the limitations of this program allow.',
    'Skynet has some "canned" Processes that allow for the flow of the Brew Day to help you brew. It can be as simple as Step by Step coaching, or an automated Brewery that controls Pumps and delivers hop warnings to the Brewer. It can be as simple or complicated as you want to make it.',
    'Unfortunately, there is some coding involved that has a learning curve. Hopefully, with the way it was designed, the "canned" samples, the error handling and the predictive text, the learning curve is a ladder and not a mountain.',
  ],
  proceed: 'Let\'s get to the Interview:',
};
// the screens before question 1, in Fritz's order (at -6 is the first)
export const SETUP_INTRO = ['welcome', 'guide', 'tick', 'drop', 'hot', 'start'];

export const SETUP_QUESTIONS = [
  // ---- 1 and 2: must be answered (Skip shows 🚫 Not allowed)
  // Question 1 (OakBarn Brewery, 2026-11-27, his picture, spelling and grammar corrected; "Have all the Next Do Not Enter until a tick
  // is made"): the words before the question (lead), then the question as Tick Boxes (tick: true); every Next ▶ has the ⛔ until one
  // is ticked
  { id: 'units', step: 'Units', kind: 'pick', tick: true, save: 'defaults', must: true,
    lead: ['What Units do you prefer to work in? There are only two choices: US or Metric. This is only how your data and entries are handled. One is not more precise than the other, as the limitations of precision are more based on the physical nature of the hardware, like a Temperature Probe.',
      'All calculations and stored data are always kept as metric, and this choice only affects what you see or enter on the screen. There are a lot of things that go on behind the scenes that you cannot see or influence.',
      'Two Examples:',
      'newSec is a command that can change a time into seconds. That is needed to get an elapsed time into a seconds format for calculations. You do not need to see it or affect it other than providing the time (although in some cases Skynet has already decided what timer to use).',
      'Skynet can import an XML file from BeerSmith (and others). All you need to do is supply the files, and Skynet does the rest. You can take a break and get a snack while things go on behind the screens, but be fast as it does not take much time.'],
    head: 'And now for that 1st Question:',
    ask: 'US or Metric Units? Choose One.',
    why: '',
    choices: [['US', 'US', 'gallons, pounds, °F'], ['Metric', 'Metric', 'liters, kilograms, °C']],
    start: ctx => ctx.defaults?.units === 'Metric' ? 'Metric' : 'US' },
  // Question 2 (OakBarn Brewery, 2026-11-27, his picture, spelling and grammar corrected; "All on one screen so get rid of reference to
  // any follow-up question above as there are none. So it does become two simple questions"): the four Brewer Types as Tick Boxes, in
  // his words; All Grain, Mill own Grain is All Grain (own Grain Mill). (Before: a follow-up "Do you grind your own grain?" after All Grain.)
  { id: 'brewerType', step: 'Brewer Type', kind: 'pick', tick: true, save: 'defaults', must: true,
    lead: ['What type of Brewer are you now? Skynet can grow as you do when you step up to more complex brewing, and can aid you in doing that, but even a novice brewer could build a complicated automated system on Skynet, as tools are not restricted by brewer type. This is simply an aid to get the Skynet Panel to look like YOUR Brewery as much as possible. This will help steer the interview.',
      'Again, there is no wrong answer. Choose the one you think best fits you (or choose the next level if you are ready and want Skynet to be at that level).'],
    ask: 'What type of Brewer are you now?',
    why: '',
    choices: ctx => BREWER_TICKS.filter(([k]) => ctx.brewerTypes.some(([t]) => t === k)),
    start: ctx => { const t = ctx.defaults?.brewerType; return ctx.brewerTypes.some(([k]) => k === t) ? t : ctx.brewerTypeDefault; } },

  // ---- 3 Brewery: the Brewery Equipment Interview (Panel Update 17, items 5, 8, 9: "Equipment in the Brewery you have or Building
  // and we will expand this to several questions"; "Can skip"; Pipe size and Hose size "Under the Equipment Branch")
  { id: '_brewery', step: 'Brewery', kind: 'branch', save: 'none',
    ask: 'The Brewery Equipment Interview',
    why: 'A few questions about the equipment in the brewery you have, or the one you are building. Next ▶ starts it. Skip keeps Skynet\'s own answers for all of them; you can change each one any time on ☰ Menu > Default settings.' },
  // Brewery Vessels: the questions that work out the Brewer Level (from one pot on the stove, 1, to All Grain Plus, 9). Skynet uses the
  // Level to pick the Schema Template, the Level of a new Brewing Tab and the Brew Day steps that fit
  // the first Brewery question, for every Brewer Type (OakBarn Brewery, 2026-11-27: "Create the first brewery question which will be
  // for all brewers regardless of type. Number of Vessels"): Tick Boxes, like questions 1 and 2
  // (2026-11-27 later: a box to type a number in, 1 to 10, and the interview branches on it)
  { id: 'vesselCount', step: 'Brewery', kind: 'num', save: 'defaults', min: VESSELS_MIN, max: VESSELS_MAX,
    head: 'Number of Hot Side Vessels',
    ask: 'How many Hot Side vessels do you have (or are you building)? Type a number from 1 to 10.',
    why: 'For every Brewer Type. Count the Kettles, Mash Tuns and Hot Liquor Tanks (HLT), not the fermentors. The next questions depend on the number.',
    start: ctx => String(vesselStart(ctx.defaults, 'vesselCount')) },
  { id: 'allInOne', step: 'Brewery', held: true, kind: 'yesno', save: 'defaults', when: { vesselCount: '1' },
    ask: 'Is it an All In One?',
    why: 'One electric vessel with a basket and a pump built in (BrewZilla, Grainfather, Foundry ...).',
    start: ctx => vesselStart(ctx.defaults, 'allInOne') },
  { id: 'kettleOutlet', step: 'Brewery', held: true, kind: 'yesno', save: 'defaults', when: { vesselCount: '1', allInOne: false },
    ask: 'Does your kettle have an outlet (a ball valve low on the side)?',
    why: 'No: you pour or siphon.',
    start: ctx => vesselStart(ctx.defaults, 'kettleOutlet') },
  { id: 'kettlePump', step: 'Brewery', held: true, kind: 'yesno', save: 'defaults', when: { vesselCount: '1', allInOne: false },
    ask: 'Do you have a pump (whirlpool, transfer or chiller)?',
    why: 'A pump with your stove top kettle.',
    start: ctx => vesselStart(ctx.defaults, 'kettlePump') },
  { id: 'pumpCount', step: 'Brewery', held: true, kind: 'pick', save: 'defaults', when: { vesselCount: '2' },
    ask: 'How many pumps?', why: 'The pumps that move your wort and water between the two vessels.',
    choices: PUMP_COUNTS, start: ctx => String(vesselStart(ctx.defaults, 'pumpCount')) },
  { id: 'recirculate', step: 'Brewery', held: true, kind: 'yesno', save: 'defaults', when: { vesselCount: VESSELS_3UP },
    ask: 'Do you recirculate the mash (HERMS or RIMS) with two pumps and motorized valves?',
    why: 'No: HLT, Mash Tun and Kettle with one pump, like the 3 Vessel sample.',
    start: ctx => vesselStart(ctx.defaults, 'recirculate') },
  { id: 'allGrainPlus', step: 'Brewery', held: true, kind: 'yesno', save: 'defaults', when: { vesselCount: VESSELS_3UP },
    ask: 'Do you also have controlled fermentors, motorized valves and a tap water Supply Manifold?',
    why: 'Yes: All Grain Plus, the top Brewer Level.',
    start: ctx => vesselStart(ctx.defaults, 'allGrainPlus') },
  // Piped Manifold (OakBarn Brewery, 2026-11-26: "add a settings default Piped Manifold as a boolean"): Yes goes to the Branch Manifold: Pipe size and Hose size (Default settings markup, 2026-11-26: "Add Piped Manifold Question If Yes go to Branch Manifold")
  { id: 'pipedManifold', step: 'Brewery', held: true, kind: 'yesno', save: 'defaults',
    ask: 'Is your brewery a Piped Manifold?',
    why: 'Yes: your vessels and pumps are joined by fixed pipes and valves (a manifold), like the 3 Vessel sample. No: you move hoses by hand. Yes: Skynet asks about your pipes and hoses next.',
    start: ctx => ctx.defaults?.pipedManifold === true },

  { id: 'defPipeSize', step: 'Brewery', held: true, kind: 'pick', save: 'defaults', when: { pipedManifold: true },
    ask: 'What size are most of your pipes?',
    why: 'A new pipe on a Tab starts at this size. You can change any pipe later.',
    choices: ctx => ctx.pipeSizes,
    start: ctx => ctx.defaults?.defPipeSize || '0.5' },
  { id: 'defHoseSize', step: 'Brewery', held: true, kind: 'pick', save: 'defaults', when: { pipedManifold: true },
    ask: 'What size are most of your hoses?',
    why: 'A new hose on a Tab starts at this size. You can change any hose later.',
    choices: ctx => ctx.hoseSizes,
    start: ctx => ctx.defaults?.defHoseSize || '0.5' },

  // ---- 4 Other Defaults: the catch all (Panel Update 17: "Opens a catch all"; items 3 and 4, Airport and Elevation: "Needs to be later
  // as you can Skip")
  { id: '_other', step: 'Other Defaults', kind: 'branch', save: 'none',
    ask: 'Other Defaults',
    why: 'The rest of the Skynet settings this interview asks about. Next ▶ starts them. Skip keeps Skynet\'s own answers for all of them; every one is on ☰ Menu > Default settings.' },
  { id: 'breweryName', step: 'Other Defaults', kind: 'text', save: 'defaults',
    ask: 'What is your brewery called?',
    why: 'It shows at the top of every Tab. A Patron perk (Rule 12.4).',
    show: (a, ctx) => !!ctx.patron,
    start: ctx => ctx.defaults?.breweryName || '' },
  { id: 'airport', step: 'Other Defaults', kind: 'text', save: 'boil',
    ask: 'Your nearest airport (its ICAO code, for example KDFW)?',
    why: 'Skynet reads the air pressure from the airport\'s weather report to work out the temperature water boils at for you (skn_Boil_Temp). Leave it empty and Skynet uses standard air at your Elevation.',
    start: ctx => ctx.boil?.airport || '' },
  { id: 'elevation', step: 'Other Defaults', kind: 'num', save: 'boil', byUnits: true,
    ask: a => `How high is your brewery above sea level (${a.units === 'Metric' ? 'meters' : 'feet'})?`,
    why: 'Water boils at a lower temperature up high. Skynet keeps it in meters inside and shows it in your Units.',
    start: (ctx, a) => ctx.boil?.elevationM == null ? '' : Math.round(a?.units === 'Metric' ? ctx.boil.elevationM : ctx.boil.elevationM / US_FT) },

  // ---- 5 Recipe Defaults: the Recipe Default Interview (Panel Update 17: "Opens the Recipe Default Interview"; item 7: "Yeast Starter goes to
  // Recipe Interview"). The defaults of a new User Recipe (☰ Menu > Default settings > New User Recipes). The Recipe Interview of a
  // Brew Day (Rule 17.22) is another interview.
  { id: '_recipes', step: 'Recipe Defaults', kind: 'branch', save: 'none',
    ask: 'The Recipe Default Interview',
    why: 'What a new Recipe starts with. You can change each one in the Recipe. Next ▶ starts it. Skip keeps Skynet\'s own answers for all of them. (A Brew Day asks about its own Recipe in the Recipe Interview.)' },
  { id: 'yeastStarter', step: 'Recipe Defaults', kind: 'yesno', tick: true, save: 'defaults',
    ask: 'Do you usually make a Yeast Starter?',
    why: 'Information only: PreBrew reminds you a day or two ahead when it is Yes. It changes nothing else.',
    start: ctx => ctx.defaults?.yeastStarter === true },
  { id: 'batch', step: 'Recipe Defaults', kind: 'num', save: 'defaults', byUnits: true,
    ask: a => `How much beer do you usually make, into the fermenter (${a.units === 'Metric' ? 'liters' : 'gallons'})?`,
    why: 'The Batch Size a new Recipe starts with. Skynet keeps it in liters inside and shows it in your Units.',
    start: (ctx, a) => { const l = ctx.defaults?.batchL ?? ctx.batchLDefault; return l == null ? '' : round2(a?.units === 'Metric' ? l : l / L_PER_GAL); } },
  { id: 'mashProfile', step: 'Recipe Defaults', kind: 'pick', tick: true, save: 'defaults',
    ask: 'Which Mash Profile does a new Recipe start with?',
    why: 'The mash steps (temperatures and times) of a new All Grain Recipe. ☰ Menu > Mash Profile adds and changes them.',
    show: a => GRAIN_TYPES.includes(a.brewerType),
    choices: ctx => ctx.mashProfiles || [],
    start: ctx => (ctx.mashProfiles || []).some(([k]) => k === (ctx.defaults?.mashProfile ?? ctx.mashDefault)) ? (ctx.defaults?.mashProfile ?? ctx.mashDefault) : '' },
  { id: 'boilProfile', step: 'Recipe Defaults', kind: 'pick', tick: true, save: 'defaults',
    ask: 'Which Boil Profile does a new Recipe start with?',
    why: 'How long the boil is, and its boil off. ☰ Menu > Boil Profile adds and changes them.',
    choices: ctx => ctx.boilProfiles || [],
    start: ctx => (ctx.boilProfiles || []).some(([k]) => k === (ctx.defaults?.boilProfile ?? ctx.boilDefault)) ? (ctx.defaults?.boilProfile ?? ctx.boilDefault) : '' },

  // ---- 6 Help Language (OakBarn Brewery, 2026-11-27: his picture of the first screen moves it to the last step; not mandatory, it has
  // a Skip that keeps English)
  // the additional language (Panel Update 17, item 2: "But additional Language?"): the User Language too, once it is on this Brain (Rule 11.16)
  { id: 'helpLang', step: 'Help Language', kind: 'pick', tick: true, save: 'browser',
    ask: 'Which language for the Help?',
    why: 'The Help pages and the balloons can be English or French, or the User Language once one is on this Brain. The screens, buttons and labels stay English. It is kept in this browser; the ? Help window can change it any time.',
    more: ctx => ctx.helpLangs?.some(([k]) => k === 'user') ? '' : 'Another language: after the interview, an Admin adds one on the ? Help window > 🌐 Languages (Help by AI translation). It then shows here and on ☰ Menu.',
    choices: ctx => ctx.helpLangs?.length ? ctx.helpLangs : [['en', 'English'], ['fr', 'Français']],
    start: ctx => (ctx.helpLangs?.length ? ctx.helpLangs : [['en'], ['fr']]).some(([k]) => k === ctx.helpLang) ? ctx.helpLang : 'en' },
];

// Rule 2.6: more than 6 choices MUST be a dropdown; 6 or fewer are one-click boxes
export const asDropdown = choices => (choices?.length || 0) > 6;
// a Tick Box question (OakBarn Brewery, 2026-11-27: "Rebuild all the Interview Dialogs in Order After the Brewery interview using check
// boxes if the choice is less than six instead of a DDLB if they can fit on a line. You can expand the label to up to 4 Lines for a check
// Box if needed"): a row with tick, Yes/No or up to TICK_MAX (8) choices, is Tick Boxes; more is a Drop Down list
export const TICK_MAX = 8;
export const tickChoices = (q, ctx) => q.kind === 'yesno' ? [[true, 'Yes'], [false, 'No']] : choicesOf(q, ctx);
// (up to 8 Tick Boxes, OakBarn Brewery, 2026-11-27: "That will be a change that you can have up to 8 Tick Boxes"; Rule 2.6; a row
// may set its own tickMax)
export const asTicks = (q, ctx) => !!q.tick && tickChoices(q, ctx).length <= (q.tickMax ?? TICK_MAX);
// a new installation: no Skynet settings saved yet (and the Setup Interview not finished before)
// (2026-11-27: every answer is saved as soon as it is given, so a first run left before steps 1 and 2 were answered has a green list
// but no setupDone: the interview opens again)
export const setupNeeded = config => !config?.brewDefaults?.setupDone && (!Object.keys(config?.brewDefaults ?? {}).length || Array.isArray(config?.brewDefaults?.setupAnswered));
export const choicesOf = (q, ctx) => typeof q.choices === 'function' ? q.choices(ctx) : (q.choices || []);
export const askOf = (q, a) => typeof q.ask === 'function' ? q.ask(a) : q.ask;
// the questions shown, in order, for the answers so far
// (a number answer, such as Number of Hot Side Vessels, matches its words: 3 is '3')
const sameAns = (x, y) => typeof y === 'boolean' ? x === y : x != null && String(x) === String(y);
export const whenOk = (q, a) => !q.when || Object.entries(q.when).every(([k, v]) => Array.isArray(v) ? v.some(y => sameAns(a?.[k], y)) : sameAns(a?.[k], v));
// held: a question kept out of the interview for now (OakBarn Brewery, 2026-11-27: "Leave the brewery interview to the one question for
// now"); it stays on Default settings, and comes back when its held is taken off
export const shownQuestions = (a, ctx, list = SETUP_QUESTIONS) => list.filter(q => !q.held && whenOk(q, a) && (!q.show || q.show(a, ctx)));
// Skynet's own answers to start (what Next, Next, Next, or Skip, keeps)
export function startAnswers(ctx, list = SETUP_QUESTIONS) {
  const a = {};
  for (const q of list) if (q.start) a[q.id] = q.start(ctx, a);
  return a;
}
// the words of an answer, for the summary page
export function answerWords(q, v, ctx) {
  if (q.kind === 'branch') return '';
  if (q.kind === 'yesno') return v ? 'Yes' : 'No';
  if (q.kind === 'pick') return choicesOf(q, ctx).find(([k]) => String(k) === String(v))?.[1] ?? String(v ?? '');
  return v === '' || v == null ? '(empty)' : String(v);
}
// a typed answer that is no good (null: fine)
export function answerError(q, v) {
  if (q.id === 'elevation' && v !== '' && v != null && !(Number.isFinite(+v) && +v >= -500 && +v <= 30000)) return 'Elevation must be a number (or empty).';
  if (q.id === 'vesselCount' && vesselCountOf(v) == null) return `Type a whole number from ${VESSELS_MIN} to ${VESSELS_MAX}.`;
  if (q.id === 'batch' && v !== '' && v != null && !(Number.isFinite(+v) && +v > 0)) return 'The Batch Size must be more than 0 (or empty).';
  if (q.id === 'airport' && v && !/^[A-Za-z0-9]{3,4}$/.test(String(v).trim())) return 'An airport code is 4 letters, for example KDFW (or leave it empty).';
  if (q.kind === 'pick' && q.must && (v === '' || v == null)) return 'This one must be answered.';
  return null;
}
// what Finish saves: the Default settings (merged into the ones there), the boil temperature place (in meters), and this browser's
// Help language. A question left out (show false) saves nothing.
// onlyAnswered (OakBarn Brewery, 2026-11-27: "We have to save these like a gGlobal as they need to be persistent. No implicit save. Even
// if a computer is shut, these stay."): each answer is saved the moment it is given; only the answered (green) questions are written,
// the others keep what was saved before. setupDone is set only once the must questions (steps 1 and 2) are answered.
export function setupSave(a, ctx, list = SETUP_QUESTIONS, answered = null, onlyAnswered = false) {
  const brewDefaults = { ...(ctx.defaults || {}) }, out = { brewDefaults, boil: null, helpLang: null };
  const did = id => !onlyAnswered || !!answered?.has(id);
  for (const q of shownQuestions(a, ctx, list)) {
    const v = a[q.id];
    if (!did(q.id)) continue;
    if (q.save === 'defaults') {
      if (q.id === 'breweryName') { const t = String(v ?? '').trim(); if (t) brewDefaults.breweryName = t; else delete brewDefaults.breweryName; }
      else if (q.id === 'brewerType') brewDefaults.brewerType = v;
      else if (q.id === 'vesselCount') brewDefaults.vesselCount = String(vesselCountOf(v));
      // kept in liters (Rule 2.59), typed in gallons or liters
      else if (q.id === 'batch') brewDefaults.batchL = v === '' || v == null ? null : Math.round((a.units === 'Metric' ? +v : +v * L_PER_GAL) * 1000) / 1000;
      else brewDefaults[q.id] = q.kind === 'yesno' ? !!v : v;
    } else if (q.save === 'browser' && q.id === 'helpLang') out.helpLang = v;
  }
  const ap = did('airport') ? String(a.airport ?? '').trim().toUpperCase() : (ctx.boil?.airport || ''), el = a.elevation;
  const metric = a.units === 'Metric';
  const elevationM = !did('elevation') ? (ctx.boil?.elevationM ?? null) : el === '' || el == null ? null : Math.round((metric ? +el : +el * US_FT) * 10) / 10;
  if (ap !== (ctx.boil?.airport || '') || elevationM !== (ctx.boil?.elevationM ?? null))
    out.boil = { airport: ap, elevationM, pressure: ctx.boil?.pressureHpa ?? null };
  // the Brewer Level from the Brewery Vessels answers (when they were asked)
  if (shownQuestions(a, ctx, list).some(q => q.id === 'vesselCount') && did('vesselCount')) { const l = brewerLevelOf(a); if (l) brewDefaults.brewerLevel = l; }
  if (!onlyAnswered || !mustMissing(shownQuestions(a, ctx, list), answered || new Set()).length) brewDefaults.setupDone = true;
  if (answered) brewDefaults.setupAnswered = list.filter(q => q.kind !== 'branch' && answered.has(q.id)).map(q => q.id);
  return out;
}

// ---- green (answered) questions (OakBarn Brewery, 2026-11-26: "Complete do not get focus on Open. Focus in Numeric Order."). A question
// is green once Next was pressed on it (Skip leaves it not green). The green ones are kept in brewDefaults.setupAnswered, so the
// interview opens again on the first question that is not green, and Next goes on to the next one that is not green. A branch's
// first page is green when every question of the branch is.
export function answeredAtStart(ctx, list = SETUP_QUESTIONS) {
  const bd = ctx.defaults || {};
  if (Array.isArray(bd.setupAnswered)) return new Set(bd.setupAnswered.filter(id => list.some(q => q.id === id)));
  // an interview finished before the green list was kept: what it saved counts as answered
  if (!bd.setupDone) return new Set();
  return new Set(list.filter(q => q.save === 'defaults' ? bd[q.id] !== undefined || (q.id === 'batch' && bd.batchL !== undefined)
    : q.id === 'airport' ? !!ctx.boil?.airport : q.id === 'elevation' ? ctx.boil?.elevationM != null : q.id === 'helpLang' ? !!ctx.helpLang : false).map(q => q.id));
}
export function isGreen(q, qs, answered) {
  if (q.kind !== 'branch') return answered.has(q.id);
  return qs.filter(x => x.step === q.step && x.kind !== 'branch').every(x => answered.has(x.id));
}
// the place of the first question at or after `from` that is not green (qs.length: the Done page)
export function nextOpen(qs, answered, from = 0) {
  for (let i = Math.max(0, from); i < qs.length; i++) if (!isGreen(qs[i], qs, answered)) return i;
  return qs.length;
}
// a step of the strip is green when every question in it is
export const stepGreen = (step, qs, answered) => qs.filter(q => q.step === step).every(q => isGreen(q, qs, answered));
// the must questions (steps 1 and 2) that are not green yet
export const mustMissing = (qs, answered) => qs.filter(q => q.must && !answered.has(q.id));
// Close (OakBarn Brewery, 2026-11-26, typos fixed): "Close Button 1 - 3: Red Popup that 1 - 3 must be completed first. After that if all
// not green, Blue Pop up advising they do need completing and setting up Skynet depends on the answers to many of these questions to
// make it their own but it will work with just the first 3 questions."
export function setupMustMsg(qs) {
  const g = SETUP_STEPS.filter(x => qs.some(q => q.must && q.step === x)), n = g.map(x => SETUP_STEPS.indexOf(x) + 1);
  return `${n.length > 2 ? `Steps ${n[0]} to ${n[n.length - 1]}` : n.length === 2 ? `Steps ${n[0]} and ${n[1]}` : `Step ${n[0]}`} (${g.join(', ')}) must be completed first.`;
}
// (2026-11-27: "the first 2" now, since only steps 1 and 2 are mandatory)
export const SETUP_OPEN_MSG = 'The questions that are not green do need completing. Setting up Skynet depends on the answers to many of these questions to make it your own, but it will work with just the first 2 questions.';
