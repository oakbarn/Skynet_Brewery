// The Help format Rules (11.3 to 11.7, OakBarn Brewery 2026-11-10): node test/helpformat.test.js
// - Skynet Panel Help names no BruControl differences (only the Import pages may), and never names a person;
// - the Heater Properties hover help uses the HLT element of the 3 Vessel 1 Pump sample as its example, and that example is true.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const IMPORT_PAGES = new Set(['08-import.md', '143-brucontrol-importer.md', '165-importer-item-and-widget-pages.md']);
// pages that only name the Import screen or the BruControl Import program, with no differences (Rule 11.3)
const NAMES_THE_IMPORT = new Set(['01-getting-started.md', '44-schema-json.md', '67-every-screen-in-the-menu.md']);
for (const f of fs.readdirSync('help').filter(f => f.endsWith('.md'))) {
  const t = fs.readFileSync(`help/${f}`, 'utf8');
  assert.ok(!/fritz/i.test(t), `help/${f} names a person (Rule 11.5)`);
  if (IMPORT_PAGES.has(f)) continue;
  const lines = t.split('\n').filter(l => /brucontrol/i.test(l));
  if (NAMES_THE_IMPORT.has(f)) {
    for (const l of lines) assert.match(l, /BruControl (Schema|Importer)/, `help/${f}: only the Import may be named (Rule 11.3): ${l}`);
    continue;
  }
  assert.deepEqual(lines, [], `help/${f} has BruControl text; it belongs in the Importer Help (Rule 11.3)`);
}
assert.ok(fs.existsSync('Sandbox/help/BruControl_Help_Extract.md'), 'the text taken out of the Help is kept in the Sandbox (Rule 11.3)');

// the hover help of the Panel's dialogs: no BruControl comparisons, no person
const app = fs.readFileSync('public/app.js', 'utf8');
for (const [k, re] of [['CAL_TIP', /const CAL_TIP = '([^\n]*)';/], ['SMOOTH_TIP', /const SMOOTH_TIP = '([^\n]*)';/], ['LAYER_TIP', /const LAYER_TIP = '([^\n]*)';/], ['DISPLAY_TIP', /const DISPLAY_TIP = '([^\n]*)';/]]) {
  const m = app.match(re); assert.ok(m, k);
  assert.ok(!/brucontrol|fritz/i.test(m[1]), `${k} names BruControl or a person`);
}

// Rule 11.7: the Heater Properties examples are the sample's HLT element, and they must stay true to the sample
const cfg = JSON.parse(fs.readFileSync('samples/configs/three-vessel-one-pump/config.json', 'utf8'));
const he = cfg.elements.find(e => e.name === 'BM_8_HE_HLT~element_BH');
assert.ok(he, 'the sample has the HLT element');
const vessel = cfg.graphics.find(g => g.id === he.integratedIn);
assert.equal(vessel?.name, 'HLT_Vessel', 'built into HLT_Vessel');
assert.deepEqual([he.label, he.device, he.channel, he.workspace, he.heatMethod, he.target, he.onOffset, he.input],
  ['HLT element', 'Brewery Mega', 8, 'Brew House', 'hysteresis', 150, -1, 'BM_700_1W_HLT_BH'], 'the HLT element the hover help describes');
assert.ok(he.methodSpot_pid && he.methodSpot_dutyCycle, 'Duty Cycle and PID enabled too (four balloons)');
assert.equal(cfg.elements.find(e => e.name === he.input)?.integratedIn, he.integratedIn, 'its probe is built into the same vessel');

const tips = app.slice(app.indexOf('const DEVICE_TIPS = {'), app.indexOf('function fieldOne('));
for (const k of ['heatMethod', 'eHeatProbe', 'switchedBy', 'eMethodShort', 'eMethodSpot', 'eLabel', 'eIface', 'ePort', 'eTab', 'eName', 'eType', 'eVisible', 'eToggle']) {
  const line = tips.split('\n').find(l => l.startsWith(`  ${k}: `));
  assert.ok(line, `DEVICE_TIPS.${k}`);
  assert.match(line, /HLT/, `DEVICE_TIPS.${k} uses the HLT element as its example`);
  assert.ok(!/fritz|brucontrol|OakBarn Brewery, 20/i.test(line), `DEVICE_TIPS.${k}: no person, no BruControl, no dated OakBarn entry`);
}
const heatTips = app.slice(app.indexOf('const ELEM_HEAT_TIPS = {'), app.indexOf('const liveSeen'));
for (const k of ['target', 'onOffset', 'onDelay']) assert.match(heatTips, new RegExp(`  ${k}: '[^\\n]*HLT`), `ELEM_HEAT_TIPS.${k}`);
assert.match(heatTips, /ELEM_PREDICTIVE_TIP = '[^\n]*HLT/); assert.match(heatTips, /ELEM_DISPLAY_TIP = '[^\n]*HLT_Vessel\.BM_8_HE_HLT~element_BH/);
console.log('help format tests passed');

// Rule 6.20 in Help (OakBarn Brewery, 2026-11-10): every "⚠ Electricity can kill" shows in red under the red triangle, as in the balloons
{
  const src = fs.readFileSync('public/help.js', 'utf8');
  const fn = src.slice(src.indexOf('export function warnText'), src.indexOf('export function markdown'));
  const warnText = new Function(`${fn.replace('export ', '')}; return warnText;`)();
  assert.equal(warnText('> **⚠ Electricity can kill. Consult a Licensed Electrician.** (Rule 6.20)'.slice(2)), 'Electricity can kill. Consult a Licensed Electrician. (Rule 6.20)');
  assert.equal(warnText('⚠ Electricity can kill. Consult a Licensed Electrician.'), 'Electricity can kill. Consult a Licensed Electrician.');
  assert.equal(warnText('⚠ The Label cannot be blank.'), '', 'only the electrical warning');
  assert.match(src, /<div class="helpWarn"><span class="hhTri"><\/span>/);
  assert.match(fs.readFileSync('public/style.css', 'utf8'), /\.helpWarn \{ color: #d01818; font-weight: 700/);
  for (const f of fs.readdirSync('help').filter(f => f.endsWith('.md')))
    for (const l of fs.readFileSync(`help/${f}`, 'utf8').split('\n').filter(l => /Electricity can kill/.test(l)))
      assert.ok(warnText(l.replace(/^>\s?/, '')), `help/${f}: the electrical warning starts its own paragraph with ⚠`);
  console.log('electrical warning tests passed');
}

// Rule 11.8 point 7 (OakBarn Brewery, 2026-11-10): the Hysteresis Help is the model. Its Hover Help (Current Method while Hysteresis)
// and Help 150 say the same plain words with the HLT element's values, and Help 150 then adds the technical side.
{
  const app = fs.readFileSync('public/app.js', 'utf8');
  const tip = /const HYS_HOVER_TIP = '([^\n]*)';/.exec(app)?.[1];
  assert.ok(tip, 'HYS_HOVER_TIP');
  assert.match(app, /tip: m === 'hysteresis' \? HYS_HOVER_TIP : T\.heatMethod/, 'the Current Method balloon shows it while Hysteresis');
  assert.ok(tip.startsWith('⚠ Electricity can kill'), 'the electrical warning first (Rule 6.20)');
  const h150 = fs.readFileSync('help/150-heating-method.md', 'utf8').replace(/\*\*/g, '').replace(/\n(?![-\n#⚠])/g, ' ');
  const lines = tip.split('\\n').slice(1).map(l => l.replace(/^• /, ''));
  for (const l of lines) assert.ok(h150.includes(l), `Help 150 has the Hover Help words (Rule 11.4): ${l}`);
  assert.match(tip, /Setpoint 150 °F, Direction Heating, Offset \(−\) −1/);
  assert.match(h150, /### The technical side/);
  console.log('hysteresis help tests passed');
}
