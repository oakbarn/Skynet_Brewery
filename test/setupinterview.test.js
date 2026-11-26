// The Setup Interview (Rule 2.75, OakBarn Brewery, 2026-11-26): a new installation is asked one question at a time; US or Metric
// and the Brewer Level must be answered, every other question has Skip; the questions are data (order, must) in one list
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SETUP_QUESTIONS, BREWER_LEVELS, BREWER_LEVEL_DEFAULT, nsiLevelOf, setupNeeded, shownQuestions, startAnswers, answerWords, answerError, setupSave, asDropdown, choicesOf } from '../public/setupinterview.js';

const ctx = (more = {}) => ({ defaults: {}, boil: null, patron: false, helpLang: null, brewerTypes: [['cankit', 'Extract Can Kit'], ['allgrain', 'All Grain']], brewerTypeDefault: 'allgrain',
  pipeSizes: [['0.5', '1/2"'], ['1', '1"']], hoseSizes: [['0.5', '1/2"']], ...more });

// question 1 is US or Metric and cannot be skipped; the Brewer Level is mandatory too ("A and Mandatory"); the rest have Skip
assert.equal(SETUP_QUESTIONS[0].id, 'units');
assert.equal(SETUP_QUESTIONS[0].must, true);
assert.deepEqual(SETUP_QUESTIONS.filter(q => q.must).map(q => q.id), ['units', 'brewerLevel']);
assert.deepEqual(choicesOf(SETUP_QUESTIONS[0], ctx()).map(c => c[0]), ['US', 'Metric']);
// the one big warning, on the first page only (one warning, Rule 6.20 look)
assert.match(SETUP_QUESTIONS[0].note, /computer, not on a phone or tablet/);
assert.equal(SETUP_QUESTIONS.filter(q => q.note).length, 1);
// ids are unique, every row has what the screen needs
assert.equal(new Set(SETUP_QUESTIONS.map(q => q.id)).size, SETUP_QUESTIONS.length);
for (const q of SETUP_QUESTIONS) { assert.ok(q.step && q.ask && q.why && q.kind && typeof q.start === 'function' && q.save, q.id); }

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

// Skynet's answers to start: US, English, Level 7, All Grain, no Yeast Starter, 1/2" pipe and hose
const a = startAnswers(ctx());
assert.deepEqual([a.units, a.helpLang, a.brewerLevel, a.brewerType, a.yeastStarter, a.defPipeSize, a.defHoseSize], ['US', 'en', '7', 'allgrain', false, '0.5', '0.5']);
assert.equal(answerWords(SETUP_QUESTIONS.find(q => q.id === 'brewerLevel'), '3', ctx()), '3 Stove Top with Pump');

// Finish: every answer is a default (Rule 2.42), merged into what was there; the Elevation is kept in meters (Rule 2.59)
let out = setupSave({ ...a, units: 'US', elevation: 663, airport: 'kdfw', brewerLevel: '3', yeastStarter: true }, ctx({ defaults: { batchL: 20 } }));
assert.deepEqual(out.brewDefaults, { batchL: 20, units: 'US', brewerLevel: '3', brewerType: 'allgrain', yeastStarter: true, defPipeSize: '0.5', defHoseSize: '0.5', setupDone: true });
assert.deepEqual(out.boil, { airport: 'KDFW', elevationM: 202.1, pressure: null });
assert.equal(out.helpLang, 'en');
out = setupSave({ ...a, units: 'Metric', elevation: '202' }, ctx());
assert.equal(out.boil.elevationM, 202);
assert.equal(setupSave(a, ctx()).boil, null, 'nothing typed for the boil place: nothing sent');

// bad typing
assert.ok(answerError(SETUP_QUESTIONS.find(q => q.id === 'elevation'), 'high'));
assert.ok(answerError(SETUP_QUESTIONS.find(q => q.id === 'airport'), 'Dallas airport'));
assert.equal(answerError(SETUP_QUESTIONS.find(q => q.id === 'airport'), ''), null);

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
