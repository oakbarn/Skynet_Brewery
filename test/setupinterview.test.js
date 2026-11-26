// The Setup Interview (Rule 2.75, OakBarn Brewery, 2026-11-26): a new installation is asked one question at a time; US or Metric,
// Help language and Brewer Type must be answered (Panel Update 17), every other question has Skip; the questions are data in one list
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SETUP_QUESTIONS, SETUP_STEPS, BREWER_LEVELS, BREWER_LEVEL_DEFAULT, nsiLevelOf, setupNeeded, shownQuestions, startAnswers, answerWords, answerError, setupSave, asDropdown, choicesOf } from '../public/setupinterview.js';

const ctx = (more = {}) => ({ defaults: {}, boil: null, patron: false, helpLang: null, brewerTypes: [['cankit', 'Extract Can Kit'], ['allgrain', 'All Grain'], ['allgrainmill', 'All Grain (own Grain Mill)']], brewerTypeDefault: 'allgrain',
  pipeSizes: [['0.5', '1/2"'], ['1', '1"']], hoseSizes: [['0.5', '1/2"']], helpLangs: [['en', 'English'], ['fr', 'Français']],
  batchLDefault: 18.927, mashDefault: 'skynet-single-batch', boilDefault: 'skynet-boil-60',
  mashProfiles: [['', '(none)'], ['skynet-single-batch', 'Single Step, Batch Sparge']], boilProfiles: [['', '(none)'], ['skynet-boil-60', '60 Minute Boil']], ...more });

// Panel Update 17: 6 steps; question 1 is US or Metric; steps 1 to 3 must be answered ("Skip Button Appears Not Available Before");
// Brewery, Recipes and Other Defaults are branches that open on their own page; the rows are in step order
assert.deepEqual(SETUP_STEPS, ['Units', 'Help language', 'Brewer Type', 'Brewery', 'Recipes', 'Other Defaults']);
assert.equal(SETUP_QUESTIONS[0].id, 'units');
assert.equal(SETUP_QUESTIONS[0].must, true);
assert.deepEqual(SETUP_QUESTIONS.filter(q => q.must).map(q => q.id), ['units', 'helpLang', 'brewerType', 'grindOwn']);
for (const q of SETUP_QUESTIONS) assert.equal(!!q.must, SETUP_STEPS.indexOf(q.step) < 3, q.id);
assert.deepEqual(SETUP_QUESTIONS.map(q => SETUP_STEPS.indexOf(q.step)), SETUP_QUESTIONS.map(q => SETUP_STEPS.indexOf(q.step)).sort((x, y) => x - y));
assert.deepEqual(SETUP_QUESTIONS.filter(q => q.kind === 'branch').map(q => q.step), ['Brewery', 'Recipes', 'Other Defaults']);
for (const st of ['Brewery', 'Recipes', 'Other Defaults']) assert.equal(SETUP_QUESTIONS.find(q => q.step === st).kind, 'branch', st);
const stepOf = id => SETUP_QUESTIONS.find(q => q.id === id).step;
assert.deepEqual(['brewerLevel', 'defPipeSize', 'defHoseSize'].map(stepOf), ['Brewery', 'Brewery', 'Brewery']);
assert.deepEqual(['yeastStarter', 'batch', 'mashProfile', 'boilProfile'].map(stepOf), ['Recipes', 'Recipes', 'Recipes', 'Recipes']);
assert.deepEqual(['breweryName', 'airport', 'elevation'].map(stepOf), ['Other Defaults', 'Other Defaults', 'Other Defaults']);
assert.deepEqual(choicesOf(SETUP_QUESTIONS[0], ctx()).map(c => c[0]), ['US', 'Metric']);
// the one big warning, on the first page only (one warning, Rule 6.20 look)
assert.match(SETUP_QUESTIONS[0].note, /computer, not on a phone or tablet/);
assert.equal(SETUP_QUESTIONS.filter(q => q.note).length, 1);
// ids are unique, every row has what the screen needs
assert.equal(new Set(SETUP_QUESTIONS.map(q => q.id)).size, SETUP_QUESTIONS.length);
for (const q of SETUP_QUESTIONS) { assert.ok(SETUP_STEPS.includes(q.step) && q.ask && q.why && q.kind && (q.kind === 'branch' || typeof q.start === 'function') && q.save, q.id); }

// Brewer Type: the All Grain (own Grain Mill) choice is the follow up "Do you grind your own grain?", only after All Grain
const bt = SETUP_QUESTIONS.find(q => q.id === 'brewerType');
assert.deepEqual(choicesOf(bt, ctx()).map(c => c[0]), ['cankit', 'allgrain']);
assert.ok(shownQuestions({ brewerType: 'allgrain' }, ctx()).some(q => q.id === 'grindOwn'));
assert.ok(!shownQuestions({ brewerType: 'cankit' }, ctx()).some(q => q.id === 'grindOwn'));
assert.equal(bt.start(ctx({ defaults: { brewerType: 'allgrainmill' } })), 'allgrain');
assert.equal(startAnswers(ctx({ defaults: { brewerType: 'allgrainmill' } })).grindOwn, true);
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
assert.deepEqual([a.units, a.helpLang, a.brewerLevel, a.brewerType, a.grindOwn, a.yeastStarter, a.defPipeSize, a.defHoseSize, a.batch, a.mashProfile, a.boilProfile],
  ['US', 'en', '7', 'allgrain', false, false, '0.5', '0.5', 5, 'skynet-single-batch', 'skynet-boil-60']);
assert.equal(startAnswers(ctx({ defaults: { units: 'Metric' } })).batch, 18.93);
assert.equal(answerWords(SETUP_QUESTIONS.find(q => q.kind === 'branch'), undefined, ctx()), '');
assert.equal(answerWords(SETUP_QUESTIONS.find(q => q.id === 'brewerLevel'), '3', ctx()), '3 Stove Top with Pump');

// Finish: every answer is a default (Rule 2.42), merged into what was there; the Elevation is kept in meters (Rule 2.59)
let out = setupSave({ ...a, units: 'US', elevation: 663, airport: 'kdfw', brewerLevel: '3', yeastStarter: true, batch: 10 }, ctx({ defaults: { tabStyle: 'x' } }));
assert.deepEqual(out.brewDefaults, { tabStyle: 'x', units: 'US', brewerType: 'allgrain', brewerLevel: '3', defPipeSize: '0.5', defHoseSize: '0.5', yeastStarter: true, batchL: 37.854,
  mashProfile: 'skynet-single-batch', boilProfile: 'skynet-boil-60', setupDone: true });
assert.ok(!('grindOwn' in out.brewDefaults) && !('_brewery' in out.brewDefaults));
assert.equal(setupSave({ ...a, grindOwn: true }, ctx()).brewDefaults.brewerType, 'allgrainmill');
assert.equal(setupSave({ ...a, brewerType: 'cankit', grindOwn: true }, ctx()).brewDefaults.brewerType, 'cankit');
assert.equal(setupSave({ ...a, units: 'Metric', batch: '20' }, ctx()).brewDefaults.batchL, 20);
assert.deepEqual(out.boil, { airport: 'KDFW', elevationM: 202.1, pressure: null });
assert.equal(out.helpLang, 'en');
out = setupSave({ ...a, units: 'Metric', elevation: '202' }, ctx());
assert.equal(out.boil.elevationM, 202);
assert.equal(setupSave(a, ctx()).boil, null, 'nothing typed for the boil place: nothing sent');

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
assert.match(app, /\['brewerLevel', 'Brewer Level', 'sel'/);
assert.match(app, /\['yeastStarter', 'Yeast Starter usually', 'bool'/);
// Help 248 in English and French
for (const f of ['help/248-setup-interview.md', 'help/fr/248-setup-interview.md']) assert.ok(fs.existsSync(f), f);
console.log('setupinterview tests passed');
