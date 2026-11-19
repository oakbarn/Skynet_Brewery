// Skynet Constants (Fritz, 2026-10-30): fixed conversion numbers a Process can use, never changed, skc_ names kept for them.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { SKYNET_CONSTANTS, SKYNET_CONSTANT_WORDS, skynetConstant, isSkynetConstantName, isReservedConstantWord, reservedClashes, shortNameOf, showConstant } from '../public/skconst.js';
import { Store } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
import { elementNameError } from '../public/names.js';
import { suggest } from '../public/autofill.js';
import { classify, CLASSES, notepadPlusPlus } from '../public/colorize.js';

const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)), `${msg}: ${a} vs ${b}`);
near(skynetConstant('skc_Kg_To_Lb'), 2.20462262, 'kg to lb');
near(skynetConstant('SKC_LB_TO_KG'), 0.45359237, 'any case');
near(skynetConstant('skc_Oz_To_G'), 28.3495231, 'oz to g');
near(skynetConstant('skc_Gal_To_L'), 3.785411784, 'gal to L');
near(skynetConstant('skc_PSI_To_kPa'), 6.89475729, 'psi to kPa');
near(skynetConstant('skc_Atm_inHg'), 29.921252, 'sea level inHg');
near(skynetConstant('skc_QtLb_To_LKg'), 2.08635, 'mash thickness');
assert.equal(skynetConstant('skc_Nope'), undefined);
assert.equal(showConstant(1 / 0.45359237), '2.20462');
// every name is unique (any case), starts skc_, and every From_To_X has its reverse value when both are listed
const names = SKYNET_CONSTANTS.map(c => c[0].toLowerCase());
assert.equal(new Set(names).size, names.length, 'no name twice');
assert.ok(SKYNET_CONSTANTS.every(([n, v]) => isSkynetConstantName(n) && Number.isFinite(v) && /^skc_[A-Za-z0-9_]+$/.test(n)));
for (const [n, v] of SKYNET_CONSTANTS) {
  const m = /^skc_(.+)_To_(.+)$/.exec(n); if (!m) continue;
  const back = skynetConstant(`skc_${m[2]}_To_${m[1]}`);
  if (back !== undefined) near(v * back, 1, `${n} and its reverse`);
}

// the Help page lists every one
const help = fs.readFileSync(new URL('../help/94-skynet-constants.md', import.meta.url), 'utf8');
for (const [n] of SKYNET_CONSTANTS) assert.ok(help.includes('`' + n + '`'), `Help lists ${n}`);

// Processes: read them, never change them, no skc_ variables, a wrong skc_ name is found by the check
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'skc'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [{ name: 'gGV_N', type: 'gGlobal', kind: 'value' }] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() {} });
assert.deepEqual(eng.check('new value a = 5 * skc_Kg_To_Lb\ngGV_N = a * SKC_LB_TO_KG\nif gGV_N > skc_C_Boil\nendif').errors, []);
const errs = eng.check('skc_Kg_To_Lb = 2\nnew value skc_Mine\nprint skc_Kg_To_Lb.value\nprint skc_Kg_To_Pb').errors;
assert.deepEqual(errs.map(e => e.line), [1, 2, 3, 4], 'one error on each line');
assert.match(errs[0].msg, /Skynet Constant: it can't be changed/);
assert.match(errs[1].msg, /kept for Skynet Constants/);
assert.match(errs[2].msg, /has no \.value/);
assert.match(errs[3].msg, /no Skynet Constant by that name/);
fs.writeFileSync(path.join(d, 'scripts', 'T.txt'), 'new value a = 5 * skc_Kg_To_Lb\ngGV_N = (212 - skc_F_Freeze) * skc_C_Per_F');
eng.start('T');
await new Promise(r => setTimeout(r, 300));
near(store.getProp('gGV_N', 'value'), 100, '212 °F is 100 °C');

// names, editor colors and predictive text
assert.match(elementNameError('skc_Pump'), /kept for Skynet Constants/);
assert.equal(elementNameError('Pump_skc_1'), '');
assert.equal(CLASSES[classify('a = skc_Kg_To_Lb', {})[6]], 'cmd', 'blue like true and now');
assert.ok(notepadPlusPlus(null).includes('skc_Kg_To_Lb'), 'Notepad++ colors them too');
const picks = suggest('gGV_N = 2 * Kg', { elements: [] }).list.map(p => p.text);
assert.ok(picks.includes('skc_Kg_To_Lb') && picks.includes('skc_Lb_To_Kg'), 'typing a unit finds its constants');
assert.ok(!suggest('skc', { elements: [] }), 'never at the start of a line');

// ---- Panel Updates Sandbox entry 28 (OakBarn Brewery, 2026-11-17, built 2026-11-19): short names, Imperial, fl oz, toF / toC, reserved words
assert.equal(shortNameOf('skc_Gal_To_L'), 'L_p_Gal'); assert.equal(shortNameOf('skc_ImGal_To_L'), 'L_p_ImGal');
assert.equal(shortNameOf('skc_Oz_To_G'), 'g_p_Oz'); assert.equal(shortNameOf('skc_Kg_To_Lb'), 'Lb_p_Kg'); assert.equal(shortNameOf('skc_In_To_Cm'), 'Cm_p_In');
assert.equal(shortNameOf('skc_F_Per_C'), 'F_p_C'); assert.equal(shortNameOf('skc_Atm_PSI'), 'PSI_p_Atm'); assert.equal(shortNameOf('skc_F_Freeze'), '');
near(skynetConstant('L_p_Gal'), 3.785411784, 'L in a US gallon'); near(skynetConstant('l_P_gAL'), 3.785411784, 'capitals mean nothing');
near(skynetConstant('L_p_ImGal'), 4.54609, 'L in an Imperial gallon'); near(skynetConstant('mL_p_FlOz'), 29.5735295625, 'mL in a US fl oz');
near(skynetConstant('mL_p_ImFlOz'), 28.4130625, 'mL in an Imperial fl oz'); near(skynetConstant('mL_p_ImPt'), 568.26125, 'Imperial pint');
near(skynetConstant('Ppm_p_GGal'), 264.172052, 'water salts g/gal to ppm'); near(skynetConstant('Frac_p_Pct'), 0.01, 'percent');
near(skynetConstant('Ms_p_Min'), 60000, 'minutes to ms for sleep'); near(skynetConstant('mg_p_g'), 1000, 'mg in a g');
for (const [n, v, , , short] of SKYNET_CONSTANTS) if (short) assert.equal(skynetConstant(short), v, `${short} is ${n}`);
const words = SKYNET_CONSTANT_WORDS.map(w => w.toLowerCase());
assert.equal(new Set(words).size, words.length, 'no two names (long, short, toF, toC) differ only by capitals');
assert.ok(SKYNET_CONSTANTS.every(c => !c[4] || /^[A-Za-z]+_p_[A-Za-z]+$/.test(c[4])), 'every short name has the _p_ shape');
for (const [n] of SKYNET_CONSTANTS) {
  const m = /^skc_(.+)_To_(.+)$/.exec(n); if (!m) continue;
  for (const [n2] of SKYNET_CONSTANTS) if (n2 === `skc_${m[2]}_To_${m[1]}`) near(skynetConstant(n) * skynetConstant(n2), 1, `${n} and its reverse`);
}
for (const [n, , , , short] of SKYNET_CONSTANTS) if (short) assert.ok(help.includes('`' + short + '`'), `Help lists ${short}`);
const helpFr = fs.readFileSync(new URL('../help/fr/94-skynet-constants.md', import.meta.url), 'utf8');
for (const [n, , , , short] of SKYNET_CONSTANTS) assert.ok(helpFr.includes('`' + n + '`') && (!short || helpFr.includes('`' + short + '`')), `French Help lists ${n}`);
// reserved words: no item or new variable can take one, any capitals
assert.ok(isReservedConstantWord('L_p_Gal') && isReservedConstantWord('l_p_gal') && isReservedConstantWord('TOF') && isReservedConstantWord('toC'));
assert.ok(!isReservedConstantWord('skc_Gal_To_L') && !isReservedConstantWord('Pump_Red') && !isReservedConstantWord('L_p_Gal_1'));
assert.match(elementNameError('L_p_Gal'), /reserved word.*skc_Gal_To_L.*L_p_Gal_1/);
assert.match(elementNameError('tof'), /reserved word/);
assert.equal(elementNameError('L_p_Gal_1'), '');
assert.deepEqual(reservedClashes(['Pump', 'L_p_Gal', 'toF', 'Pump']), ['L_p_Gal', 'toF']);
// Processes: short names and toF / toC
{
  const d2 = fs.mkdtempSync(path.join(os.tmpdir(), 'skc2'));
  fs.writeFileSync(path.join(d2, 'c.json'), JSON.stringify({ elements: [{ name: 'gGV_A', type: 'gGlobal', kind: 'value' }, { name: 'gGV_B', type: 'gGlobal', kind: 'value' },
    { name: 'gGV_C', type: 'gGlobal', kind: 'value' }, { name: 'G_p_Kg', type: 'gGlobal', kind: 'value' }] }));
  const st = new Store(path.join(d2, 'c.json'), path.join(d2, 'data')); st.load();
  const e2 = new Engine(st, path.join(d2, 'scripts'), { logNow() {} });
  assert.deepEqual(e2.check('gGV_A = 5 * L_p_Gal\ngGV_B = toF(100)\ngGV_C = TOC(gGV_B) + toF(toC(212))').errors, []);
  const bad = e2.check('L_p_Gal = 2\nnew value toC\nnew value l_p_gal\ngGV_A = toF\ngGV_A = toF(1').errors;
  assert.deepEqual(bad.map(x => x.line), [1, 2, 3, 4, 5], 'one error on each line: ' + JSON.stringify(bad));
  assert.match(bad[0].msg, /can't be changed/); assert.match(bad[1].msg, /reserved word/); assert.match(bad[2].msg, /reserved word/);
  assert.match(bad[3].msg, /needs a value in \( \)/);
  // an item named like a short constant (made before the constant was added): the bare read warns, .value reads the item
  const w = e2.check('gGV_A = 2 * G_p_Kg\ngGV_A = G_p_Kg.value');
  assert.deepEqual(w.errors, []);
  assert.deepEqual(w.warnings.map(x => x.line), [1]); assert.match(w.warnings[0].msg, /reserved word.*G_p_Kg\.value/);
  assert.deepEqual(e2.check('new value G_p_Kg2 = 1\ngGV_A = L_p_Gal').warnings, [], 'no item called L_p_Gal: no warning');
  st.setProp('G_p_Kg', 'value', 7);
  fs.writeFileSync(path.join(d2, 'scripts', 'T.txt'), 'gGV_A = 2 * L_p_Gal\ngGV_B = toF(100)\ngGV_C = toC(212) + G_p_Kg.value');
  e2.start('T');
  await new Promise(r => setTimeout(r, 300));
  near(st.getProp('gGV_A', 'value'), 7.570823568, '2 gal in L'); near(st.getProp('gGV_B', 'value'), 212, '100 °C is 212 °F');
  near(st.getProp('gGV_C', 'value'), 107, '212 °F is 100 °C, plus the item read with .value');
}
// editor colors and predictive text know them
assert.equal(CLASSES[classify('a = L_p_Gal', {})[6]], 'cmd', 'short names blue like true and now');
assert.ok(notepadPlusPlus(null).includes('L_p_ImGal') && notepadPlusPlus(null).includes('toF'), 'Notepad++ colors them too');
const picks2 = suggest('gGV_N = 2 * Gal', { elements: [] }).list.map(p => p.text);
assert.ok(picks2.includes('L_p_Gal') && picks2.includes('skc_Gal_To_L'), 'typing a unit finds the short names too');
assert.ok(suggest('gGV_N = to', { elements: [] }).list.some(p => p.text === 'toF('), 'toF( is offered');
// the list in the Process editor (📐 Constants), and its French balloon
const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8'), app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
assert.ok(html.includes('id="constList"') && html.includes('id="constDlg"') && app.includes("$('#constList').onclick"), 'the 📐 Constants list');
console.log('skconst tests passed');
// the Skynet internal Globals (skn_Boil_Temp ...) run from here, so the npm test list is unchanged (no conflict with open PRs)
await import('./boiltemp.test.js');
