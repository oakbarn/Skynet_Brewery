// Skynet Constants (Fritz, 2026-10-30): fixed conversion numbers a Process can use, never changed, skc_ names kept for them.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { SKYNET_CONSTANTS, skynetConstant, isSkynetConstantName, showConstant } from '../public/skconst.js';
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
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [{ name: 'gKV_N', type: 'gKonstant', kind: 'value' }] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() {} });
assert.deepEqual(eng.check('new value a = 5 * skc_Kg_To_Lb\ngKV_N = a * SKC_LB_TO_KG\nif gKV_N > skc_C_Boil\nendif').errors, []);
const errs = eng.check('skc_Kg_To_Lb = 2\nnew value skc_Mine\nprint skc_Kg_To_Lb.value\nprint skc_Kg_To_Pb').errors;
assert.deepEqual(errs.map(e => e.line), [1, 2, 3, 4], 'one error on each line');
assert.match(errs[0].msg, /Skynet Constant: it can't be changed/);
assert.match(errs[1].msg, /kept for Skynet Constants/);
assert.match(errs[2].msg, /has no \.value/);
assert.match(errs[3].msg, /no Skynet Constant by that name/);
fs.writeFileSync(path.join(d, 'scripts', 'T.txt'), 'new value a = 5 * skc_Kg_To_Lb\ngKV_N = (212 - skc_F_Freeze) * skc_C_Per_F');
eng.start('T');
await new Promise(r => setTimeout(r, 300));
near(store.getProp('gKV_N', 'value'), 100, '212 °F is 100 °C');

// names, editor colors and predictive text
assert.match(elementNameError('skc_Pump'), /kept for Skynet Constants/);
assert.equal(elementNameError('Pump_skc_1'), '');
assert.equal(CLASSES[classify('a = skc_Kg_To_Lb', {})[6]], 'cmd', 'blue like true and now');
assert.ok(notepadPlusPlus(null).includes('skc_Kg_To_Lb'), 'Notepad++ colors them too');
const picks = suggest('gKV_N = 2 * Kg', { elements: [] }).list.map(p => p.text);
assert.ok(picks.includes('skc_Kg_To_Lb') && picks.includes('skc_Lb_To_Kg'), 'typing a unit finds its constants');
assert.ok(!suggest('skc', { elements: [] }), 'never at the start of a line');
console.log('skconst tests passed');
process.exit(0);
