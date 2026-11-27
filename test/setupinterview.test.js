// The Setup Interview (Rule 2.75, OakBarn Brewery, 2026-11-26): a new installation is asked one question at a time; US or Metric,
// Help language and Brewer Type must be answered (Panel Update 17), every other question has Skip; the questions are data in one list
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sizeVolume, sizeSafe, sizeIn, sizeClean, sizeFieldsOf, breweryBuildOf, headOf, STOVE_ELECTRIC_VESSELS, ONE_VESSEL_PICKS, VESSEL_HEATS, addsNote, brewerLevelOf, vesselAnswersOf, VESSEL_KEYS, VESSELS_3UP } from '../public/setupinterview.js';
import { answeredAtStart, isGreen, nextOpen, stepGreen, mustMissing, setupMustMsg, SETUP_OPEN_MSG } from '../public/setupinterview.js';
import { SETUP_QUESTIONS, SETUP_STEPS, SETUP_WELCOME, SETUP_GUIDE, SETUP_TICK, SETUP_DROP, SETUP_HOTSPOTS, SETUP_START, SETUP_INTRO, BREWER_LEVELS, BREWER_LEVEL_DEFAULT, nsiLevelOf, setupNeeded, shownQuestions, startAnswers, answerWords, answerError, setupSave, asDropdown, choicesOf, asTicks, tickChoices } from '../public/setupinterview.js';

const ctx = (more = {}) => ({ defaults: {}, boil: null, patron: false, helpLang: null, brewerTypes: [['cankit', 'Extract Can Kit'], ['allgrain', 'All Grain'], ['allgrainmill', 'All Grain (own Grain Mill)']], brewerTypeDefault: 'allgrain',
  pipeSizes: [['0.5', '1/2"'], ['1', '1"']], hoseSizes: [['0.5', '1/2"']], helpLangs: [['en', 'English'], ['fr', 'Français']],
  batchLDefault: 18.927, mashDefault: 'skynet-single-batch', boilDefault: 'skynet-boil-60',
  mashProfiles: [['', '(none)'], ['skynet-single-batch', 'Single Step, Batch Sparge']], boilProfiles: [['', '(none)'], ['skynet-boil-60', '60 Minute Boil']], ...more });

// Panel Update 17: 6 steps; question 1 is US or Metric. 2026-11-27 (his picture, "A"): the new order, and only steps 1 and 2 must be
// answered; Brewery, Other Defaults and Recipe Defaults are branches that open on their own page; the rows are in step order
assert.deepEqual(SETUP_STEPS, ['Units', 'Brewer Type', 'Brewery', 'Other Defaults', 'Recipe Defaults', 'Help Language']);
assert.equal(SETUP_QUESTIONS[0].id, 'units');
assert.equal(SETUP_QUESTIONS[0].must, true);
assert.deepEqual(SETUP_QUESTIONS.filter(q => q.must).map(q => q.id), ['units', 'brewerType']);
for (const q of SETUP_QUESTIONS) assert.equal(!!q.must, SETUP_STEPS.indexOf(q.step) < 2, q.id);
assert.deepEqual(SETUP_QUESTIONS.map(q => SETUP_STEPS.indexOf(q.step)), SETUP_QUESTIONS.map(q => SETUP_STEPS.indexOf(q.step)).sort((x, y) => x - y));
assert.deepEqual(SETUP_QUESTIONS.filter(q => q.kind === 'branch').map(q => q.step), ['Brewery', 'Other Defaults', 'Recipe Defaults']);
assert.equal(SETUP_QUESTIONS.find(q => q.step === 'Help Language').id, 'helpLang');
for (const st of ['Brewery', 'Other Defaults', 'Recipe Defaults']) assert.equal(SETUP_QUESTIONS.find(q => q.step === st).kind, 'branch', st);
const stepOf = id => SETUP_QUESTIONS.find(q => q.id === id).step;
assert.deepEqual(['vesselCount', 'pipedManifold', 'defPipeSize', 'defHoseSize'].map(stepOf), ['Brewery', 'Brewery', 'Brewery', 'Brewery']);
assert.deepEqual(['yeastStarter', 'batch', 'mashProfile', 'boilProfile'].map(stepOf), ['Recipe Defaults', 'Recipe Defaults', 'Recipe Defaults', 'Recipe Defaults']);
assert.deepEqual(['breweryName', 'airport', 'elevation'].map(stepOf), ['Other Defaults', 'Other Defaults', 'Other Defaults']);
assert.deepEqual(choicesOf(SETUP_QUESTIONS[0], ctx()).map(c => c[0]), ['US', 'Metric']);
// the one big warning, on the first page only (one warning, Rule 6.20 look)
// the one phone note is on the Welcome page now (OakBarn Brewery, 2026-11-27), not on a question
assert.match(SETUP_WELCOME.note, /cannot make a physical screen any larger/);
assert.equal(SETUP_QUESTIONS.filter(q => q.note).length, 0);
assert.equal(SETUP_WELCOME.paras.length, 2);
assert.doesNotMatch(JSON.stringify(SETUP_WELCOME), /scrren|controoled|breower|intreview|amswered/);
// ids are unique, every row has what the screen needs
assert.equal(new Set(SETUP_QUESTIONS.map(q => q.id)).size, SETUP_QUESTIONS.length);
for (const q of SETUP_QUESTIONS) { assert.ok(SETUP_STEPS.includes(q.step) && q.ask && (q.why || q.lead) && q.kind && (q.kind === 'branch' || typeof q.start === 'function') && q.save, q.id); }

// Brewer Type (2026-11-27): one screen, four Tick Boxes in Fritz's words, no follow-up question
const bt = SETUP_QUESTIONS.find(q => q.id === 'brewerType');
assert.ok(bt.tick && !SETUP_QUESTIONS.some(q => q.id === 'grindOwn'));
assert.deepEqual(choicesOf(bt, ctx({ brewerTypes: [['cankit'], ['partial'], ['biab'], ['allinone'], ['allgrain'], ['allgrainmill']] })).map(c => c[1]), ['Extract Kit', 'Extract Brewer add Own Hops', 'BIAB (Brew in a Bag)', 'All In One Brewer', 'All Grain', 'All Grain Mill own Grain']);
// six Tick Boxes on question 2 (up to 8 allowed), the Mash Profile question for every grain type, BIAB's Tab Level
assert.ok(asTicks(bt, ctx({ brewerTypes: [['cankit'], ['partial'], ['biab'], ['allinone'], ['allgrain'], ['allgrainmill']] })));
for (const t of ['biab', 'allinone']) assert.ok(shownQuestions({ brewerType: t }, ctx()).some(q => q.id === 'mashProfile'), t);
assert.equal(nsiLevelOf('4', 'allinone'), 'biab');
assert.equal(bt.start(ctx({ defaults: { brewerType: 'allgrainmill' } })), 'allgrainmill');
assert.ok(shownQuestions({ brewerType: 'allgrainmill' }, ctx()).some(q => q.id === 'mashProfile'));
// the Mash Profile only for All Grain
assert.ok(!shownQuestions({ brewerType: 'cankit' }, ctx()).some(q => q.id === 'mashProfile'));
// Help language: the User Language once it is on this Brain
const hlq = SETUP_QUESTIONS.find(q => q.id === 'helpLang');
assert.deepEqual(choicesOf(hlq, ctx({ helpLangs: [['en', 'English'], ['fr', 'Français'], ['user', 'Deutsch']] })).map(c => c[0]), ['en', 'fr', 'user']);
assert.equal(hlq.start(ctx({ helpLang: 'user', helpLangs: [['en', 'English'], ['fr', 'Français'], ['user', 'Deutsch']] })), 'user');
assert.equal(hlq.start(ctx({ helpLang: 'user' })), 'en', 'no User Language on this Brain: English');
assert.ok(hlq.more(ctx()) && !hlq.more(ctx({ helpLangs: [['en', 'English'], ['user', 'Deutsch']] })));

// the 9 Brewer Levels: a dropdown (Rule 2.6: more than 6 choices); the 2 Units choices are one-click boxes
assert.equal(BREWER_LEVELS.length, 9);
assert.ok(asDropdown(BREWER_LEVELS) && !asDropdown(choicesOf(SETUP_QUESTIONS[0], ctx())));
assert.equal(BREWER_LEVEL_DEFAULT, '7');

// only a new installation (no Skynet settings yet) starts it by itself
assert.equal(setupNeeded({}), true);
assert.equal(setupNeeded({ brewDefaults: {} }), true);
assert.equal(setupNeeded({ brewDefaults: { units: 'US' } }), false);
assert.equal(setupNeeded({ brewDefaults: { setupDone: true } }), false);

// Brewery Name only for a Patron
assert.ok(!shownQuestions({}, ctx()).some(q => q.id === 'breweryName'));
assert.ok(shownQuestions({}, ctx({ patron: true })).some(q => q.id === 'breweryName'));

// Skynet's answers to start: US, English, Level 7, All Grain (not milled), no Yeast Starter, 1/2" pipe and hose, 5 gallons
const a = startAnswers(ctx());
assert.deepEqual([a.units, a.helpLang, brewerLevelOf(a), a.brewerType, a.yeastStarter, a.defPipeSize, a.defHoseSize, a.batch, a.mashProfile, a.boilProfile],
  ['US', 'en', '7', 'allgrain', false, '0.5', '0.5', 5, 'skynet-single-batch', 'skynet-boil-60']);
assert.equal(startAnswers(ctx({ defaults: { units: 'Metric' } })).batch, 18.93);
assert.equal(answerWords(SETUP_QUESTIONS.find(q => q.kind === 'branch'), undefined, ctx()), '');
assert.equal(answerWords(SETUP_QUESTIONS.find(q => q.id === 'vesselCount'), '2', ctx()), '2');
// Number of Hot Side Vessels (2026-11-27): a box, a whole number 1 to 10, and the questions branch on it: 1, 2, 3 or more
{ const vc = SETUP_QUESTIONS.find(q => q.id === 'vesselCount');
  assert.ok(vc.kind === 'num' && vc.min === 1 && vc.max === 6 && vc.head === 'Number of Hot Side Vessels');
  for (const v of ['1', '6', 5, ' 3 ']) assert.equal(answerError(vc, v), null, String(v));
  for (const v of ['', '0', '7', '10', '2.5', 'x', null]) assert.match(answerError(vc, v), /whole number from 1 to 6/, String(v));
  assert.deepEqual(VESSELS_3UP, ['3', '4', '5', '6']);      // "limit Hot Side to 6"
  assert.equal(setupSave({ ...startAnswers(ctx()), vesselCount: ' 6 ' }, ctx(), undefined, new Set(['vesselCount'])).brewDefaults.vesselCount, '6');
  for (const n of ['3', '5', 6]) assert.equal(brewerLevelOf({ vesselCount: n, recirculate: true }), '8');
  assert.equal(brewerLevelOf({ vesselCount: 2, pumpCount: '2' }), '6'); assert.equal(brewerLevelOf({ vesselCount: '7' }), null); }
// held (2026-11-27: "Leave the brewery interview to the one question for now"): Brewery asks only Number of Vessels; ALL is the list with
// nothing held, for the branching tests below
const ALL = SETUP_QUESTIONS.map(q => ({ ...q, held: false }));
assert.deepEqual(shownQuestions({ ...a, vesselCount: '3', pipedManifold: true }, ctx()).filter(q => q.step === 'Brewery').map(q => q.id), ['_brewery', 'vesselCount']);
// Number of Vessels: the first Brewery question (after the branch page), for every Brewer Type, as Tick Boxes (2026-11-27)
{ const vc = SETUP_QUESTIONS.find(q => q.id === 'vesselCount'), firstB = SETUP_QUESTIONS.find(q => q.step === 'Brewery' && q.kind !== 'branch');
  assert.ok(firstB === vc && !vc.show && !vc.when);
  for (const t of ['cankit', 'partial', 'allgrain', 'allgrainmill']) assert.ok(shownQuestions({ ...a, brewerType: t }, ctx()).includes(vc)); }
// Brewery Vessels: the questions give the Brewer Level, and a saved Level gives the answers back
for (let l = 1; l <= 9; l++) assert.equal(brewerLevelOf(vesselAnswersOf(String(l))), String(l), 'level ' + l);
assert.deepEqual(shownQuestions({ ...a, vesselCount: '1', allInOne: false }, ctx(), ALL).filter(q => VESSEL_KEYS.includes(q.id)).map(q => q.id), ['vesselCount', 'allInOne', 'kettleOutlet', 'kettlePump']);
assert.deepEqual(shownQuestions({ ...a, vesselCount: '1', allInOne: true }, ctx(), ALL).filter(q => VESSEL_KEYS.includes(q.id)).map(q => q.id), ['vesselCount', 'allInOne']);
assert.deepEqual(shownQuestions({ ...a, vesselCount: '2' }, ctx(), ALL).filter(q => VESSEL_KEYS.includes(q.id)).map(q => q.id), ['vesselCount', 'pumpCount']);
assert.equal(startAnswers(ctx({ defaults: { brewerLevel: '3' } })).vesselCount, '1');
// Pipe and Hose size only after Piped Manifold Yes (the Branch Manifold)
assert.ok(!shownQuestions({ ...a, pipedManifold: false }, ctx(), ALL).some(q => q.id === 'defPipeSize'));
assert.ok(shownQuestions({ ...a, pipedManifold: true }, ctx(), ALL).some(q => q.id === 'defHoseSize'));

// Finish: every answer is a default (Rule 2.42), merged into what was there; the Elevation is kept in meters (Rule 2.59)
let out = setupSave({ ...a, units: 'US', elevation: 663, airport: 'kdfw', vesselCount: '1', allInOne: false, kettlePump: true, pipedManifold: true, yeastStarter: true, batch: 10 }, ctx({ defaults: { tabStyle: 'x' } }), ALL);
assert.deepEqual(out.brewDefaults, { tabStyle: 'x', units: 'US', brewerType: 'allgrain', vesselCount: '1', allInOne: false, kettleOutlet: false, kettlePump: true, pipedManifold: true, defPipeSize: '0.5', defHoseSize: '0.5',
  yeastStarter: true, batchL: 37.854, mashProfile: 'skynet-single-batch', boilProfile: 'skynet-boil-60', brewerLevel: '3',
  breweryBuild: { vesselCount: 1, allInOne: false, kettleOutlet: false, kettlePump: true, pipedManifold: true, defPipeSize: '0.5', defHoseSize: '0.5', brewerLevel: '3' }, setupDone: true });
assert.ok(!('_brewery' in out.brewDefaults));
assert.equal(setupSave({ ...a, brewerType: 'allgrainmill' }, ctx()).brewDefaults.brewerType, 'allgrainmill');
assert.equal(setupSave({ ...a, units: 'Metric', batch: '20' }, ctx()).brewDefaults.batchL, 20);
assert.deepEqual(out.boil, { airport: 'KDFW', elevationM: 202.1, pressure: null });
assert.equal(out.helpLang, 'en');
assert.equal(a.pipedManifold, false);
assert.equal(setupSave({ ...a, pipedManifold: true }, ctx(), ALL).brewDefaults.pipedManifold, true);
out = setupSave({ ...a, units: 'Metric', elevation: '202' }, ctx());
assert.equal(out.boil.elevationM, 202);
assert.equal(setupSave(a, ctx()).boil, null, 'nothing typed for the boil place: nothing sent');

// branching on an answer (when:): a row shows only when the answers match
const extra = [...ALL, { id: 'xManifoldValves', step: 'Brewery', kind: 'yesno', save: 'defaults', when: { pipedManifold: true }, ask: 'x', why: 'x', start: () => false },
  { id: 'xAny', step: 'Brewery', kind: 'yesno', save: 'defaults', when: { vesselCount: ['2', '3'] }, ask: 'x', why: 'x', start: () => false }];
assert.ok(!shownQuestions({ ...a, pipedManifold: false }, ctx(), extra).some(q => q.id === 'xManifoldValves'));
assert.ok(shownQuestions({ ...a, pipedManifold: true }, ctx(), extra).some(q => q.id === 'xManifoldValves'));
assert.ok(shownQuestions({ ...a, vesselCount: '3' }, ctx(), extra).some(q => q.id === 'xAny'));
assert.ok(!shownQuestions({ ...a, vesselCount: '1' }, ctx(), extra).some(q => q.id === 'xAny'));

// green and focus ("Complete do not get focus on Open. Focus in Numeric Order.")
const qs0 = shownQuestions(a, ctx(), ALL);
assert.equal(answeredAtStart(ctx()).size, 0);
assert.equal(nextOpen(qs0, new Set()), 0);
const g3 = new Set(['units', 'brewerType']);
assert.equal(qs0[nextOpen(qs0, g3)].id, '_brewery', 'steps 1 and 2 green: it opens on the Brewery branch page');
assert.ok(stepGreen('Units', qs0, g3) && !stepGreen('Brewery', qs0, g3));
const gB = new Set([...g3, 'vesselCount', 'recirculate', 'allGrainPlus', 'pipedManifold']);
assert.ok(isGreen(qs0.find(q => q.id === '_brewery'), qs0, gB) && stepGreen('Brewery', qs0, gB));
assert.equal(qs0[nextOpen(qs0, gB)].id, '_other');
assert.equal(nextOpen(qs0, new Set(qs0.map(q => q.id))), qs0.length, 'all green: Done');
// saved and read back; an older finished install counts what it saved
const saved = setupSave(a, ctx(), ALL, gB).brewDefaults;
assert.deepEqual(saved.setupAnswered, ['units', 'brewerType', 'vesselCount', 'recirculate', 'allGrainPlus', 'pipedManifold']);
assert.deepEqual([...answeredAtStart(ctx({ defaults: saved }))], saved.setupAnswered);
assert.ok(answeredAtStart(ctx({ defaults: { setupDone: true, units: 'US', brewerType: 'allgrain', batchL: 20 } })).has('batch'));
// Close: red until steps 1 and 2 are green, then the blue words
assert.deepEqual(mustMissing(qs0, new Set(['units'])).map(q => q.id), ['brewerType']);
assert.equal(mustMissing(qs0, g3).length, 0);
assert.equal(setupMustMsg(qs0), 'Steps 1 and 2 (Units, Brewer Type) must be completed first.');
assert.match(SETUP_OPEN_MSG, /work with just the first 2 questions/);

// bad typing
assert.ok(answerError(SETUP_QUESTIONS.find(q => q.id === 'elevation'), 'high'));
assert.ok(answerError(SETUP_QUESTIONS.find(q => q.id === 'airport'), 'Dallas airport'));
assert.equal(answerError(SETUP_QUESTIONS.find(q => q.id === 'airport'), ''), null);
assert.ok(answerError(SETUP_QUESTIONS.find(q => q.id === 'batch'), '0'));

// the New Schema Interview's Tab Level from the Brewer Level (Rule 2.58)
assert.equal(nsiLevelOf('1', 'cankit'), 'stove');
assert.equal(nsiLevelOf('2', 'partial'), 'partial');
assert.equal(nsiLevelOf('4', 'allgrain'), 'biab');
assert.equal(nsiLevelOf('5', 'allgrain'), 'two');
assert.equal(nsiLevelOf('9', 'allgrainmill'), 'mashtun');
assert.equal(nsiLevelOf(undefined, 'allgrain'), null);

// the panel: first run asks it before the Welcome sample picker; ☰ Menu runs it again; Brewer Level and Yeast Starter on Default settings
const app = fs.readFileSync('public/app.js', 'utf8');
assert.match(app, /if \(setupNeeded\(S\.config\)\) await setupInterview\(\{ first: true \}\);/);
assert.match(app, /item\('🧭 Setup Interview'/);
assert.match(app, /\['vesselCount', 'Number of Hot Side vessels \(1 to 6\)', 'num'/);
assert.match(app, /\['_ub', 'Mandatory', 'head'\]/);
assert.match(app, /\['_yb', 'Your Brewery', 'head'\]/);
assert.match(app, /\['_nbh', 'New Build', 'head'\]/);
assert.match(app, /\['_bv', 'Brewery Vessels', 'head'\]/);
assert.match(app, /\['yeastStarter', 'Yeast Starter usually', 'bool'/);
assert.match(app, /\['pipedManifold', 'Piped Manifold', 'bool'/);
assert.match(app, /setupPop\('red', setupMustMsg\(qs\)/);
assert.match(app, /setupPop\('blue', SETUP_OPEN_MSG/);
// Help 248 in English and French
for (const f of ['help/248-setup-interview.md', 'help/fr/248-setup-interview.md']) assert.ok(fs.existsSync(f), f);
console.log('setupinterview tests passed');

// every answer saved the moment it is given (OakBarn Brewery, 2026-11-27: "save these like a gGlobal ... Even if a computer is shut,
// these stay"): only the answered ones are written; setupDone only once steps 1 and 2 are answered; a first run left early opens again
{
  const c = ctx({ defaults: {} }), a1 = startAnswers(c); a1.units = 'Metric';
  const o1 = setupSave(a1, c, undefined, new Set(['units']), true).brewDefaults;
  assert.equal(o1.units, 'Metric');
  assert.equal(o1.brewerType, undefined, 'not answered yet: not written');
  assert.equal(o1.setupDone, undefined);
  assert.deepEqual(o1.setupAnswered, ['units']);
  assert.equal(setupNeeded({ brewDefaults: o1 }), true, 'left before step 2: the interview opens again');
  const o2 = setupSave({ ...a1, brewerType: 'cankit' }, ctx({ defaults: o1 }), undefined, new Set(['units', 'brewerType']), true);
  assert.equal(o2.brewDefaults.brewerType, 'cankit');
  assert.equal(o2.brewDefaults.setupDone, true);
  assert.equal(o2.boil, null, 'Airport and Elevation not answered: the boil place is not touched');
  assert.equal(setupNeeded({ brewDefaults: o2.brewDefaults }), false);
}

// screens 2 and 3 (OakBarn Brewery, 2026-11-27): the button guide and the Tick Box, spelling fixed; Close and ✕ ⛔ until 1 and 2
assert.equal(SETUP_GUIDE.rows.length, 7);
assert.ok(SETUP_GUIDE.rows.some(([b, t]) => b.some(x => Array.isArray(x) && x[0] === '✖ Close' && x[1] === true) && /until 1\. Units and 2\. Brewer Type are answered/.test(t)));
assert.deepEqual(SETUP_TICK.boxes, ['Yes', 'If 11:59 = morning', 'No']);
assert.doesNotMatch(JSON.stringify([SETUP_GUIDE, SETUP_TICK]), /aswered|avaiable|avialable|retun|unitl/);
{
  const appSrc = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(appSrc, /const closeBtns = qs => mustMissing\(qs, answered\)\.length/);
  assert.match(appSrc, /let at = -SETUP_INTRO\.length, skipped = new Set\(\);/);
}
// screen 4: the Drop Down list (Orange Sherbet, not "Sherbert"; no Other)
assert.deepEqual(SETUP_DROP.choices, ['Vanilla', 'Chocolate', 'Strawberry', 'Mint', 'Cookie', 'Orange Sherbet']);
assert.equal(SETUP_DROP.choices[SETUP_DROP.picked], 'Chocolate');
assert.doesNotMatch(JSON.stringify(SETUP_DROP), /Some times|avaiable|Sherbert/);
// screen 5: Hot Spots (spelling fixed: available, navigate, taken)
assert.ok(SETUP_STEPS.includes(SETUP_HOTSPOTS.sample));
assert.doesNotMatch(JSON.stringify(SETUP_HOTSPOTS), /avaiable|Navigate|jumped/);
// screen 6: the start page, the last before question 1 (spelling fixed)
assert.deepEqual(SETUP_INTRO, ['welcome', 'guide', 'tick', 'drop', 'hot', 'start']);
assert.equal(SETUP_START.paras.length, 4);
assert.doesNotMatch(JSON.stringify(SETUP_START), /Answser|knowlege|Brewerey|Unfornately|take you best/);
// question 1 (2026-11-27): words before it, Tick Boxes, Next ⛔ until ticked; every strip step ⛔ until 1 and 2 are answered
{
  const u = SETUP_QUESTIONS.find(q => q.id === 'units');
  assert.ok(u.tick && u.lead.length === 5 && u.head === 'And now for that 1st Question:' && u.ask === 'US or Metric Units? Choose One.');
  assert.doesNotMatch(JSON.stringify(u.lead), /perfer|limitaions|Temperatue|seances|eleasphed|caculations|a xml|thing go/);
  const appSrc = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(appSrc, /const stepShut = \(st, qs\) => mustMissing\(qs, answered\)\.length > 0;/);
  assert.match(appSrc, /\(asTicks\(q, ctx\) \? tickedOf\(q\) == null : q\.kind === 'vessel' \? !tickedOf\(q\) : q\.must && !answered\.has\(q\.id\)\)/);
  // after Brewery: Yes/No and up to 8 choices are Tick Boxes; more than 8 a Drop Down list (2026-11-27, Rule 2.6 changed)
  for (const id of ['yeastStarter', 'mashProfile', 'boilProfile', 'helpLang']) assert.ok(SETUP_QUESTIONS.find(q => q.id === id).tick, id);
  { const ys = SETUP_QUESTIONS.find(q => q.id === 'yeastStarter'), mp = SETUP_QUESTIONS.find(q => q.id === 'mashProfile');
    assert.deepEqual(tickChoices(ys, ctx()), [[true, 'Yes'], [false, 'No']]); assert.ok(asTicks(ys, ctx()));
    assert.ok(asTicks(mp, ctx({ mashProfiles: [['', '(none)'], ['a', 'A']] })));
    assert.ok(asTicks(mp, ctx({ mashProfiles: [1, 2, 3, 4, 5, 6, 7, 8].map(n => [String(n), 'P' + n]) })), '8: Tick Boxes');
    assert.ok(!asTicks(mp, ctx({ mashProfiles: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => [String(n), 'P' + n]) })), '9: Drop Down list'); }
}
// screen 3: the CLICK pointer's tip is inside the box it points at (2026-11-27: "Click arrow needs to be in the box")
{ const src = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(src, /i === SETUP_TICK\.ticked \? h\('span', \{ class: 'setupTickAt' \}, b, clickPointer\(\)\)/); }
// screens 4 and 5: the pointer is on the ▾, on Chocolate, and on the sample step; no loose "↖ CLICK" text is left
{ const src = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.ok(!src.includes("'↖ CLICK'"));
  assert.match(src, /setupDropHi setupAt' \}, c, clickPointer\(/);
  assert.match(src, /st === HS\.sample \? clickPointer\(/); }
// one vessel: How is the vessel heated? (2026-11-27): his seven Tick Boxes, only after 1 vessel, saved to Default settings
{ const vh = SETUP_QUESTIONS.find(q => q.id === 'vesselHeat');
  assert.ok(vh && vh.tick && !vh.held && vh.step === 'Brewery' && asTicks(vh, ctx()));
  assert.deepEqual(choicesOf(vh, ctx()).map(c => c[1]), ['No Boil Brewer', 'Electric Stove Top', 'Gas Stove Top', 'Hot Plate', 'Turkey Fryer', 'Brewery Gas Burner', 'Internal Electric Element']);
  const brew = v => shownQuestions({ ...startAnswers(ctx()), vesselCount: v }, ctx()).filter(q => q.step === 'Brewery').map(q => q.id);
  assert.deepEqual(brew('1'), ['_brewery', 'vesselCount', 'vesselHeat']); assert.deepEqual(brew('2').slice(0, 3), ['_brewery', 'vesselCount', 'v1Heat']); assert.ok(!brew('2').includes('vesselHeat')); assert.deepEqual(brew(1), ['_brewery', 'vesselCount', 'vesselHeat']);
  assert.equal(setupSave({ ...startAnswers(ctx()), vesselCount: '1', vesselHeat: 'turkeyfryer' }, ctx(), undefined, new Set(['vesselCount', 'vesselHeat'])).brewDefaults.vesselHeat, 'turkeyfryer');
  const src = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(src, /\['vesselHeat', 'How is the vessel heated\? \(one vessel\)', 'sel'/); }
// No Boil Brewer, one vessel: Single Vessel Brewer, his three Skynet Vessel Templates with his words (2026-11-27)
{ const vt = SETUP_QUESTIONS.find(q => q.id === 'vesselTemplate');
  assert.ok(vt && vt.kind === 'vessel' && headOf(vt, { vesselHeat: 'noboil' }) === 'Single Vessel Brewer' && vt.ask === 'Choose the Vessel that matches yours:' && vt.otherBtn === 'Other Skynet Template');
  assert.deepEqual(choicesOf(vt, ctx()).map(c => c[1]), ['Plain Pot', 'Pot with 1.5 TC Outlet', 'Pot with NPT Outlet']);
  for (const [n] of choicesOf(vt, ctx())) assert.ok(fs.existsSync(new URL(`../templates/vessel/${n}.json`, import.meta.url)), n);
  const brew = (heat) => shownQuestions({ ...startAnswers(ctx()), vesselCount: '1', vesselHeat: heat }, ctx()).map(q => q.id);
  assert.ok(brew('noboil').includes('vesselTemplate')); assert.ok(!shownQuestions({ ...startAnswers(ctx()), vesselCount: '2' }, ctx()).some(q => q.id === 'vesselTemplate'), 'only one vessel');
  // Electric Stove Top (2026-11-27): its own heading and its kettle-on-a-stove Templates
  assert.ok(brew('electricstove').includes('vesselTemplate'));
  assert.equal(headOf(vt, { vesselHeat: 'electricstove' }), 'Electric Stove Top Brewer');
  assert.deepEqual(choicesOf(vt, ctx(), { vesselHeat: 'electricstove' }), STOVE_ELECTRIC_VESSELS);
  for (const [n] of STOVE_ELECTRIC_VESSELS) assert.ok(fs.existsSync(new URL(`../templates/vessel/${n}.json`, import.meta.url)), n);
  assert.equal(answerWords(vt, 'Kettle_5_Gal_Electric_Stove_Low_Drain', ctx()), 'Kettle with a Ball Valve on an Electric Stove');
  assert.equal(answerWords(vt, 'Brew_Vessel_Low_TC_Output_Widget', ctx()), 'Pot with 1.5 TC Outlet');
  assert.equal(setupSave({ ...startAnswers(ctx()), vesselCount: '1', vesselHeat: 'noboil', vesselTemplate: 'Generic_Brew_Vessel_Widget' }, ctx(), undefined, new Set(['vesselCount', 'vesselHeat', 'vesselTemplate'])).brewDefaults.vesselTemplate, 'Generic_Brew_Vessel_Widget'); }

// ---- the Brewery Build (2026-11-27: "we have to store the answer on the Brewery Build"): the Brewery answers kept together
{
  const out = setupSave({ ...startAnswers(ctx()), vesselCount: '1', vesselHeat: 'noboil', vesselTemplate: 'Generic_Brew_Vessel_Widget' }, ctx(), undefined, new Set(['vesselCount', 'vesselHeat', 'vesselTemplate']), true);
  const bb = out.brewDefaults.breweryBuild;
  assert.equal(bb.vesselCount, 1); assert.equal(bb.vesselHeat, 'noboil'); assert.equal(bb.vesselTemplate, 'Generic_Brew_Vessel_Widget');
  assert.ok(bb.brewerLevel, 'with the Brewer Level the answers give');
  // an answer that no longer fits (three vessels) drops out: How is it heated is only for one vessel
  const b3 = breweryBuildOf({ vesselCount: '3', vesselHeat: 'noboil', vesselTemplate: 'x', recirculate: true });
  assert.equal(b3.vesselCount, 3); assert.equal(b3.vesselHeat, undefined); assert.equal(b3.vesselTemplate, undefined); assert.equal(b3.recirculate, true);
  assert.match(fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8'), /d\.breweryBuild = breweryBuildOf\(d\)/, 'Default settings keeps the same Brewery Build');
}

// ---- every way to heat one vessel has its own branch (2026-11-27: "Create all the branches for a 1 vessel system, Pot on Gas Stove
// top, all the way to Internal Electric element")
{
  const vt = SETUP_QUESTIONS.find(q => q.id === 'vesselTemplate');
  for (const [heat] of VESSEL_HEATS) {
    assert.ok(ONE_VESSEL_PICKS[heat], `${heat} has its vessel choices`);
    assert.ok(ONE_VESSEL_PICKS[heat].choices.length <= 6, `${heat}: 6 or fewer pictures; more under Other Skynet Template`);
    assert.ok(shownQuestions({ ...startAnswers(ctx()), vesselCount: '1', vesselHeat: heat }, ctx()).some(q => q.id === 'vesselTemplate'), heat);
    for (const [n] of choicesOf(vt, ctx(), { vesselHeat: heat })) assert.ok(fs.existsSync(new URL(`../templates/vessel/${n}.json`, import.meta.url)), n);
  }
  // Internal Electric Element: only Templates with an element and a probe (a Thermowell)
  for (const [n] of ONE_VESSEL_PICKS.element.choices) {
    const t = JSON.parse(fs.readFileSync(new URL(`../templates/vessel/${n}.json`, import.meta.url), 'utf8'));
    assert.ok(t.ports?.element && t.ports.element.installed !== false && t.ports?.thermowell && t.ports.thermowell.installed !== false, n);
  }
  // the burner and ignition, or the element and probe, go to the end build
  assert.deepEqual(breweryBuildOf({ vesselCount: '1', vesselHeat: 'gasburner' }).adds, ['burner', 'igniter']);
  assert.deepEqual(breweryBuildOf({ vesselCount: '1', vesselHeat: 'element' }).adds, ['element', 'probe']);
  assert.equal(breweryBuildOf({ vesselCount: '1', vesselHeat: 'gasstove' }).adds, undefined);
  assert.equal(addsNote({ vesselHeat: 'gasburner' }), 'Your build also gets: Gas Burner and Burner Igniter.');
}

// ---- Size of your Vessel (2026-11-27: "ask the Height and Diameter of a Vessel so the brewery could be drawn inside Skynet"; "also
// ask the Purported Volume and the Dead Space if Known. And in an electric vessel save Volume height so the element is submerged";
// "Apply this to all the previous ones as well")
{
  const sz = SETUP_QUESTIONS.find(q => q.id === 'vesselSize');
  for (const [heat] of VESSEL_HEATS) {
    const ids = shownQuestions({ ...startAnswers(ctx()), vesselCount: '1', vesselHeat: heat }, ctx()).map(q => q.id);
    assert.ok(ids.indexOf('vesselSize') === ids.indexOf('vesselTemplate') + 1, `${heat}: the size right after the vessel`);
  }
  assert.ok(!sizeFieldsOf({ vesselHeat: 'gasstove' }).some(([k]) => k === 'elementDepth'));
  assert.ok(sizeFieldsOf({ vesselHeat: 'element' }).some(([k]) => k === 'elementDepth'), 'down to the top of the element: only an electric vessel');
  // "Height from Top to Top of Element so we can calculate the safe volume"; "and add 1 in to give a buffer": 12 in high, element top
  // 9 in down = 3 in up, plus 1 in = 4 in of liquid in 12 in across: 2.0 gal
  assert.equal(sizeSafe({ diameter: 12, vheight: 12, elementDepth: 9 }, 'US'), 2);
  assert.equal(sizeSafe({ diameter: 30.48, vheight: 30.48, elementDepth: 22.86 }, 'Metric'), 7.4, 'the same in cm and liters');
  assert.equal(sizeSafe({ diameter: 12, vheight: 12 }, 'US'), 0, 'no element depth: none');
  assert.match(answerError(sz, { diameter: 12, vheight: 12, elementDepth: 12 }), /lower than the Inside Height/);
  assert.equal(sizeVolume({ diameter: 12, vheight: 12 }, 'US'), 5.9);      // 12 x 12 in: 5.9 gal
  assert.equal(sizeVolume({ diameter: 30, vheight: 30 }, 'Metric'), 21.2);  // 30 x 30 cm: 21.2 L
  assert.deepEqual(sizeIn({ units: 'US', diameter: 10, volume: 5 }, 'Metric'), { units: 'Metric', diameter: 25.4, volume: 18.93 });
  assert.equal(answerError(sz, { diameter: 12 }), 'Type both the Inside Diameter and the Inside Height, or leave both empty.');
  assert.match(answerError(sz, { diameter: -1, vheight: 2 }), /Inside Diameter/);
  assert.equal(answerError(sz, { diameter: 12, vheight: 12, deadspace: 0 }), null);
  const out = setupSave({ ...startAnswers(ctx()), vesselCount: '1', vesselHeat: 'element', vesselSize: { diameter: '12', vheight: '12', volume: '5', deadspace: '0.5', elementDepth: '9' } }, ctx(), undefined, new Set(['vesselCount', 'vesselHeat', 'vesselSize']), true);
  assert.deepEqual(out.brewDefaults.vesselSize, { units: 'US', diameter: 12, vheight: 12, volume: 5, deadspace: 0.5, elementDepth: 9, calcVolume: 5.9, safeVolume: 2 });
  assert.deepEqual(out.brewDefaults.breweryBuild.vesselSize, out.brewDefaults.vesselSize, 'in the Brewery Build');
  assert.equal(sizeClean({ diameter: '' }, 'US'), null, 'nothing typed: nothing kept');
  assert.equal(answerWords(sz, out.brewDefaults.vesselSize, ctx()), '12 in across, 12 in high, ≈ 5.9 gal, sold as 5 gal, Dead Space 0.5 gal, element covered (plus 1 in) at 2 gal');
}

// ---- Two vessels (2026-11-27: "start the two Vessel, First Vessel with How Heated. No Boil only for a 1 vessel system"; "ask what the
// vessel is used for. BK, HLT, BK & HLT, MLT"; "ask Tangential, Steam Slayer or Sparge Arm, and Sight Glass"; "If you do in Tick Box
// format they can pick more than 1 and ask where on vessel"; his 13 places)
{
  const m = await import('../public/setupinterview.js');
  const a0 = { ...startAnswers(ctx()), vesselCount: '2' };
  const ids = shownQuestions(a0, ctx()).filter(q => q.step === 'Brewery').map(q => q.id);
  assert.deepEqual(ids, ['_brewery', 'vesselCount', 'v1Heat', 'v1Use', 'v1Parts', 'v1Template', 'v1Size', 'v2Heat', 'v2Use', 'v2Parts', 'v2Template', 'v2Size']);
  for (const n of ['1', '3']) assert.ok(!shownQuestions({ ...a0, vesselCount: n }, ctx()).some(q => q.id.startsWith('v1')), `${n} vessels: not the two vessel rows`);
  const heat = SETUP_QUESTIONS.find(q => q.id === 'v1Heat');
  assert.ok(!choicesOf(heat, ctx()).some(([k]) => k === 'noboil'), 'No Boil only for one vessel');
  assert.equal(choicesOf(heat, ctx()).length, 7);
  assert.deepEqual(choicesOf(heat, ctx()).at(-1), ['noheat', 'No Heat'], 'a cooler Mash Tun');
  assert.ok(asTicks(heat, ctx()), 'still Tick Boxes (up to 8)');
  assert.deepEqual(choicesOf(SETUP_QUESTIONS.find(q => q.id === 'v2Template'), ctx(), { v2Use: 'mlt', v2Heat: 'noheat' }).map(([k]) => k), ['Mash_Tun', 'OakBarn_MLT']);
  assert.deepEqual(m.VESSEL_USES.map(([, w]) => w), ['Boil Kettle (BK)', 'Hot Liquor Tank (HLT)', 'BK and HLT', 'Mash Tun (MLT)']);
  assert.deepEqual(m.VESSEL_PARTS.map(([, w]) => w), ['Tangential Inlet', 'Steam Slayer', 'Sparge Arm', 'Sight Glass']);
  // his Vessel Layout picture: the same 10 places on the Front and the Back; "Sight Glass left or Right only"
  assert.deepEqual(m.LAYOUT_PLACES.map(([, w]) => w), ['High Right', 'High Left', 'Middle Right', 'Middle Left', 'Mid Low Right', 'Mid Low Center', 'Mid Low Left', 'Low Right', 'Low Center', 'Low Left']);
  assert.equal(m.VESSEL_SPOTS.length, 20);
  assert.deepEqual([m.VESSEL_SPOTS[0][1], m.VESSEL_SPOTS[10][1]], ['Front High Right', 'Back High Right']);
  assert.deepEqual(m.spotsOf('sight').map(([, w]) => w), ['Right', 'Left']);
  // the Vessel Layout sample: the places ticked are filled in
  const svg = m.vesselLayoutSvg({ sparge: 'fhl', sight: 'left' });
  assert.match(svg, /^<svg /); assert.match(svg, /High Left: Sparge Arm/); assert.equal((svg.match(/<circle/g) || []).length, 24);
  assert.ok(!/#fff\b|white/i.test(svg), 'no pure white (Rule 2.7)');
  const parts = SETUP_QUESTIONS.find(q => q.id === 'v1Parts');
  assert.equal(parts.kind, 'multi');
  assert.equal(answerWords(parts, { sparge: 'fhr', sight: 'left' }, ctx()), 'Sparge Arm (Front High Right), Sight Glass (Left)');
  assert.equal(answerWords(parts, {}, ctx()), 'None of these');
  assert.deepEqual(m.partsClean({ sparge: 'bmlc', bogus: 'x', sight: 'fhl', tangential: 'left' }), { sparge: 'bmlc' }, 'a Sight Glass only Left or Right; the rest only Front or Back places');
  // the vessels: what fits the use, the heat and the parts, the best match first, at most 6
  const tpl = SETUP_QUESTIONS.find(q => q.id === 'v1Template');
  assert.equal(choicesOf(tpl, ctx(), { v1Use: 'bk', v1Heat: 'gasburner', v1Parts: { steamSlayer: 'fhr' } })[0][0], 'Kettle_Tangential_Steam_Slayer');
  assert.equal(choicesOf(tpl, ctx(), { v1Use: 'hlt', v1Heat: 'element', v1Parts: { sight: 'left' } })[0][0], 'OakBarn_Big_MAC_HLT');
  assert.ok(choicesOf(tpl, ctx(), { v1Use: 'bk', v1Heat: 'element' }).every(([k]) => m.VESSEL_POOL.find(p => p[0] === k)[4] === 'element'), 'electric: only Templates with an element');
  assert.ok(choicesOf(tpl, ctx(), { v1Use: 'mlt', v1Heat: 'gasburner' }).every(([k]) => m.VESSEL_POOL.find(p => p[0] === k)[2].includes('mlt')));
  for (const [h] of m.MULTI_HEATS) for (const [u] of m.VESSEL_USES) {
    const c = choicesOf(tpl, ctx(), { v1Use: u, v1Heat: h });
    assert.ok(c.length >= 1 && c.length <= 6, `${h} ${u}: 1 to 6 vessels`);
  }
  for (const [k] of m.VESSEL_POOL) assert.ok(fs.existsSync(`templates/vessel/${k}.json`), k);
  // the parts each pool vessel says it has are on its Template
  for (const [k, , , has] of m.VESSEL_POOL) { const p = JSON.parse(fs.readFileSync(`templates/vessel/${k}.json`, 'utf8')).ports || {};
    for (const x of has) assert.ok(p[x === 'sight' ? 'sightTop' : x], `${k} has ${x}`); }
  // the size of each: the element row only for an electric one
  assert.ok(sizeFieldsOf({ v2Heat: 'element' }, 'v2Heat').some(([k]) => k === 'elementDepth'));
  assert.ok(!sizeFieldsOf({ v2Heat: 'gasburner' }, 'v2Heat').some(([k]) => k === 'elementDepth'));
  // saved, and kept together in the Brewery Build
  const a = { ...a0, v1Heat: 'element', v1Use: 'hlt', v1Parts: { sparge: 'fhl' }, v1Template: 'HLT', v1Size: { diameter: '16', vheight: '18', elementDepth: '12' },
    v2Heat: 'gasburner', v2Use: 'bk', v2Parts: {}, v2Template: 'Kettle_Basic' };
  const out = setupSave(a, ctx(), undefined, new Set(shownQuestions(a, ctx()).map(q => q.id)), true).brewDefaults;
  assert.deepEqual(out.v1Parts, { sparge: 'fhl' });
  assert.equal(out.v1Size.safeVolume, 6.1);
  assert.deepEqual(out.breweryBuild.vessels.map(v => [v.n, v.use, v.template, v.adds]), [[1, 'hlt', 'HLT', ['element', 'probe']], [2, 'bk', 'Kettle_Basic', ['burner', 'igniter']]]);
  assert.equal(out.breweryBuild.adds, undefined, 'the one vessel adds: only for one vessel');
  assert.equal(addsNote(a, 'v2Heat'), 'Your build also gets: Gas Burner and Burner Igniter.');
  assert.equal(breweryBuildOf({ vesselCount: '1', vesselHeat: 'gasstove' }).vessels, undefined);
}
