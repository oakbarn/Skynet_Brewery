// Skynet Constants (Fritz, 2026-10-30; names and Labels 2026-11-19, Panel Updates Sandbox entry 28, Rules 1.17 and 3.20):
// fixed conversion numbers a Process can use, never changed, named skn_const_ + a short code (skn_const_L_p_Gal) with a plain Label.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { SKYNET_CONSTANTS, SKYNET_CONSTANT_WORDS, skynetConstant, isSkynetConstantName, constantLabel, showConstant } from '../public/skconst.js';
import { Store } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
import { elementNameError } from '../public/names.js';
import { suggest } from '../public/autofill.js';
import { classify, CLASSES, notepadPlusPlus } from '../public/colorize.js';

const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)), `${msg}: ${a} vs ${b}`);
near(skynetConstant('skn_const_L_p_Gal'), 3.785411784, 'L in a US gallon');
assert.equal(constantLabel('skn_const_L_p_Gal'), 'Liters per Gallon', 'its Label');
near(skynetConstant('SKN_CONST_L_P_GAL'), 3.785411784, 'any case');
near(skynetConstant('skn_const_Lb_p_Kg'), 2.20462262, 'lb in a kg');
near(skynetConstant('skn_const_Kg_p_Lb'), 0.45359237, 'kg in a lb');
near(skynetConstant('skn_const_g_p_Oz'), 28.3495231, 'g in an oz');
near(skynetConstant('skn_const_kPa_p_PSI'), 6.89475729, 'kPa in a psi');
near(skynetConstant('skn_const_inHg_p_Atm'), 29.921252, 'sea level inHg');
near(skynetConstant('skn_const_LKg_p_QtLb'), 2.08635, 'mash thickness');
near(skynetConstant('skn_const_L_p_ImGal'), 4.54609, 'L in an Imperial gallon');
near(skynetConstant('skn_const_mL_p_FlOz'), 29.5735295625, 'mL in a US fl oz');
near(skynetConstant('skn_const_mL_p_ImFlOz'), 28.4130625, 'mL in an Imperial fl oz');
near(skynetConstant('skn_const_mL_p_ImPt'), 568.26125, 'Imperial pint');
near(skynetConstant('skn_const_Ppm_p_GGal'), 264.172052, 'water salts g/gal to ppm');
near(skynetConstant('skn_const_Frac_p_Pct'), 0.01, 'percent');
near(skynetConstant('skn_const_Ms_p_Min'), 60000, 'minutes to ms for sleep');
near(skynetConstant('skn_const_F_p_C'), 1.8, 'a temperature change');
assert.equal(skynetConstant('skn_const_Nope'), undefined);
assert.equal(skynetConstant('skc_Kg_To_Lb'), undefined, 'the old skc_ names are gone (before the first Public Production)');
assert.equal(showConstant(1 / 0.45359237), '2.20462');
// every name is unique in any case, starts skn_const_, has the _p_ shape (or is a fixed point), and has a Label
const words = SKYNET_CONSTANT_WORDS.map(w => w.toLowerCase());
assert.equal(new Set(words).size, words.length, 'no two names differ only by capitals');
for (const [n, v, , , label] of SKYNET_CONSTANTS) {
  assert.ok(isSkynetConstantName(n) && /^skn_const_[A-Za-z]+_(p_[A-Za-z]+|Freeze|Boil)$/.test(n), `${n}: a Skynet name`);
  assert.ok(Number.isFinite(v) && label && /^[A-Z°]/.test(label), `${n}: a value and a Label`);
}
assert.ok(SKYNET_CONSTANTS.every(c => !/_p_G$/i.test(c[0]) || c[0].endsWith('_p_g')), 'a gallon is Gal: _p_G is only a gram');
for (const [n] of SKYNET_CONSTANTS) {
  const m = /^skn_const_(.+)_p_(.+)$/.exec(n); if (!m) continue;
  const back = skynetConstant(`skn_const_${m[2]}_p_${m[1]}`);
  if (back !== undefined) near(skynetConstant(n) * back, 1, `${n} and its reverse`);
}

// the Help page lists every one, with its Label; so does the French page
const help = fs.readFileSync(new URL('../help/94-skynet-constants.md', import.meta.url), 'utf8');
const helpFr = fs.readFileSync(new URL('../help/fr/94-skynet-constants.md', import.meta.url), 'utf8');
for (const [n, , , , label] of SKYNET_CONSTANTS) {
  assert.ok(help.includes(`| ${label} | \`${n}\` |`), `Help lists ${n} with its Label`);
  assert.ok(helpFr.includes('`' + n + '`'), `French Help lists ${n}`);
}

// Processes: read them, never change them, no skn_const_ variables, a wrong skn_const_ name is found by the check
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'skc'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [{ name: 'gGV_N', type: 'gGlobal', kind: 'value' }, { name: 'gGV_B', type: 'gGlobal', kind: 'value' },
  { name: 'gGV_C', type: 'gGlobal', kind: 'value' }, { name: 'toF', type: 'gGlobal', kind: 'value' }] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() {} });
assert.deepEqual(eng.check('new value a = 5 * skn_const_Lb_p_Kg\ngGV_N = a * SKN_CONST_KG_P_LB\nif gGV_N > skn_const_C_Boil\nendif\ngGV_B = toF(100)\ngGV_C = TOC(gGV_B) + toF(toC(212))').errors, []);
const errs = eng.check('skn_const_L_p_Gal = 2\nnew value skn_const_Mine\nprint skn_const_L_p_Gal.value\nprint skn_const_L_p_Pb\ngGV_N = toF(1').errors;
assert.deepEqual(errs.map(e => e.line), [1, 2, 3, 4, 5], 'one error on each line: ' + JSON.stringify(errs));
assert.match(errs[0].msg, /Skynet Constant: it can't be changed/);
assert.match(errs[1].msg, /kept for Skynet Constants/);
assert.match(errs[2].msg, /has no \.value/);
assert.match(errs[3].msg, /no Skynet Constant by that name/);
// toF and toC only with ( ): an item called toF is still read by its name, with no warning
{ const c = eng.check('gGV_N = toF + 1\ngGV_N = toF(gGV_N)'); assert.deepEqual([c.errors, c.warnings], [[], []]); }
{
  const e2 = new Engine(store, path.join(d, 'scripts2'), { logNow() {} });
  assert.match(e2.check('gGV_N = toC').errors[0]?.msg ?? '', /no variable made with new, and no Device or Widget|needs a value/);
}
store.setProp('toF', 'value', 7);
fs.writeFileSync(path.join(d, 'scripts', 'T.txt'), 'new value a = 5 * skn_const_Lb_p_Kg\ngGV_N = (212 - skn_const_F_Freeze) * skn_const_C_p_F\ngGV_B = toF(100) + toF\ngGV_C = 2 * skn_const_L_p_Gal');
eng.start('T');
await new Promise(r => setTimeout(r, 300));
near(store.getProp('gGV_N', 'value'), 100, '212 °F is 100 °C');
near(store.getProp('gGV_B', 'value'), 219, '100 °C is 212 °F, plus the item called toF');
near(store.getProp('gGV_C', 'value'), 7.570823568, '2 gal in L');

// names, editor colors and predictive text
assert.match(elementNameError('skn_const_Pump'), /kept for Skynet Constants/);
assert.match(elementNameError('SKN_CONST_X'), /kept for Skynet Constants/, 'any case');
assert.equal(elementNameError('Pump_skn_const_1'), '');
assert.equal(elementNameError('L_p_Gal'), '', 'a short code alone is no Skynet name: not refused');
assert.equal(elementNameError('toF'), '', 'toF is not refused (it is a function only with ( ))');
assert.equal(CLASSES[classify('a = skn_const_L_p_Gal', {})[6]], 'cmd', 'blue like true and now');
assert.ok(notepadPlusPlus(null).includes('skn_const_L_p_ImGal') && notepadPlusPlus(null).includes('toF'), 'Notepad++ colors them too');
const picks = suggest('gGV_N = 2 * Gal', { elements: [] }).list;
assert.ok(picks.some(p => p.text === 'skn_const_L_p_Gal' && /Liters per Gallon/.test(p.hint)), 'typing a unit finds its constants, with the Label');
assert.ok(suggest('gGV_N = to', { elements: [] }).list.some(p => p.text === 'toF('), 'toF( is offered');
assert.ok(!suggest('skn', { elements: [] }), 'never at the start of a line');
// the list in the Process editor (📐 Constants)
const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8'), app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
assert.ok(html.includes('id="constList"') && html.includes('id="constDlg"') && app.includes("$('#constList').onclick"), 'the 📐 Constants list');
console.log('skconst tests passed');
// the Skynet internal Globals (skn_Boil_Temp ...) run from here, so the npm test list is unchanged (no conflict with open PRs)
await import('./boiltemp.test.js');
