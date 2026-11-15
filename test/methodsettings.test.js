// Method Settings (OakBarn Brewery, 2026-11-15, Rule 6.19, Help 150): each heating method has its own dialog (⬢) with a Use Method
// switch. Use Method No hides that method's settings. Only methods in use can be picked in the Current Method list, by a balloon, a
// Method Clone or a Process (name.method = "X" and the short name.DutyC alike), and the Process editor shows the error before brewing.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');

// ---- the Properties: Method Settings, one ⬢ per method; the Current Method list holds only the methods in use
const heat = app.slice(app.indexOf('function heatFields('), app.indexOf('// Flame Out safety for gas burners'));
assert.match(heat, /\['_msHead', 'Method Settings', 'head'/);
assert.match(heat, /\['_msets', '', 'msets', HEAT_METHODS\.map/);
assert.match(heat, /const on = HEAT_METHODS\.filter\(\(\[k\]\) => allowedMethods\(it\)\.includes\(k\)\);/);
assert.match(heat, /\['heatMethod', 'Current Method', 'sel', on\.map/, 'the Current Method list (the dropdown) only the methods in use');
assert.ok(!/'menabled'|'Enabled', 'head'/.test(heat), 'no Enabled row any more: ON/OFF, never Enabled');
// ---- each method's dialog
const fields = heat.slice(heat.indexOf('function methodSetFields('), heat.indexOf('async function methodEntry('));
assert.match(fields, /\['methodSpot_' \+ k, 'Use Method', 'bool', null, true/, 'Use Method is a switch that redraws the dialog');
assert.match(fields, /\['_useLock', 'Use Method', 'bool', null, false, false, \{ tip: T\.useMethod, disabled: true \}\]/, 'Direct and the Current Method: always On, greyed');
assert.match(fields, /if \(!use\) return \[head\];/, 'Use Method No: every other setting hidden');
assert.match(fields, /k === 'hysteresis' \? \[\s*\['_dir', 'Direction'/, 'Hysteresis keeps its Integrate_4 rows');
const entry = heat.slice(heat.indexOf('async function methodEntry('));
assert.match(entry, /layerDialog\(`\$\{heatMethodWord\(k\)\} Settings`[\s\S]*\{ model: true \}\)/, 'frozen top with Keep (Rule 2.51)');
assert.match(entry, /\$\('#dlgBody'\)\._rebuild\?\.\(\)/, 'the Properties redraw after Keep');
assert.match(app, /const model = asModel \|\| onModelDialog\(\);/);
assert.match(app, /build\(\); body\._rebuild = build;/);
assert.match(app, /if \(t\.dataset\.k === 'heatMethod' && isHeatElem\(obj\) && was && was !== obj\.heatMethod[^\n]*obj\['methodSpot_' \+ heatMethodKey\(was\)\] = true;/, 'a new Current Method keeps the one before in use');
// the Heating Element Properties are frozen too, no bottom row (Rule 2.51)
assert.match(css, /dialog#dlg:has\(#dlgBody \.mSet\) \.dlgHead \{/);
assert.match(css, /dialog#dlg:has\(#dlgBody \.mSet\) \.dlgBottomBar \{ display: none; \}/);

// ---- what each method's dialog shows (methodSetFields run with the Panel's helpers stubbed)
{
  const hm = await import('../public/heatmethod.js');
  const src = fields.replace(/^function methodSetFields/, 'return function methodSetFields');
  const T = { useMethod: 'u', eHeatProbe: 'p', eDirection: 'd' };
  const make = new Function('DEVICE_TIPS', 'startMethod', 'NEEDS_PROBE', 'HEAT_SETTINGS', 'PERCENT_METHODS', 'draft', 'S', 'elemTip', 'offsetChoices', 'PREDICTIVE_FIELD', 'probeStep', 'ELEM_PREDICTIVE_TIP', 'heatDefault', src);
  const f = make(T, hm.startMethod, hm.NEEDS_PROBE, hm.HEAT_SETTINGS, hm.PERCENT_METHODS, null, { config: { elements: [{ name: 'Temp', type: 'temperature' }] } }, () => null, () => [], x => ['predictive', 'Predictive', 'bool', true, false, false, x], () => null, 'tip', hm.heatDefault);
  const withs = w => !w ? [] : Array.isArray(w[0]) ? w : [w];
  const keys = (k, it) => f(k, it).flatMap(x => [x[0], ...withs(x[6]?.with).map(y => y[0])]);
  const el = { type: 'digitalOut', subtype: 'element', heatMethod: 'hysteresis', methodSpot_dutyCycle: true, input: 'Temp' };
  assert.deepEqual(keys('pid', el), ['methodSpot_pid'], 'PID not in use: only its Use Method');
  assert.deepEqual(keys('dutyCycle', el), ['methodSpot_dutyCycle', 'dutyCycle', 'interval']);
  assert.deepEqual(keys('hysteresis', el), ['_useLock', 'input', 'target', '_dir', 'onOffset', '_waveO', 'predictive', 'onDelay', '_waveD'], 'the Current Method');
  assert.deepEqual(keys('onoff', el), ['_useLock', '_doNote'], 'Direct: always used, nothing to set');
  assert.deepEqual(keys('pid', { ...el, methodSpot_pid: true }), ['methodSpot_pid', 'input', 'target', 'kp', 'ki', 'kd', 'maxOutput', 'maxIntegral', 'calcTime', 'outTime', 'reversed', 'pwm']);
  assert.deepEqual(f('pid', { ...el, methodSpot_pid: true }).filter(x => x[6]?.def !== undefined).map(x => [x[0], x[6].def]), [['kp', 10], ['ki', 0.1], ['kd', 0], ['maxOutput', 100], ['maxIntegral', 100], ['calcTime', 1], ['outTime', 1]], 'each box shows its Skynet start (Rule 18.36)');
}

// ---- a Process: only methods in use
{
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'methodset'));
  const cfg = path.join(d, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
    { name: 'Temp', type: 'temperature', sensor: 'simulated' },
    { name: 'hE_1', type: 'digitalOut', subtype: 'element', device: 'MB', channel: 8, input: 'Temp', heatMethod: 'hysteresis', target: 150, onOffset: -1, methodSpot_dutyCycle: true },
  ] }));
  const store = new Store(cfg, path.join(d, 'data')); store.load();
  const eng = new Engine(store, path.join(d, 'p'), { logNow() { } });
  const errs = t => eng.check(t).errors.map(e => e.msg);
  assert.deepEqual(errs('hE_1.method = "Duty Cycle"\nhE_1.DutyC\nhE_1.DO\nhE_1.HYS\n'), [], 'Direct, Hysteresis (the Current Method) and Duty Cycle (Use Method On)');
  assert.deepEqual(errs('hE_1.method = "PID"\n'), ['hE_1 may only use Direct, Duty Cycle, Hysteresis: the Use Method of PID is Off (its Properties, Method Settings, ⬢ PID, Rule 6.19)']);
  assert.equal(errs('hE_1.DeadB\n').length, 1, 'the short way too');
  assert.throws(() => store.setProp('hE_1', 'method', 'PID'), /switch its Use Method On/, 'and the Brain refuses it when it runs');
  store.setProp('hE_1', 'method', 'Duty Cycle');
  assert.equal(store.getProp('hE_1', 'method'), 'Duty Cycle');
  assert.equal(store.getProp('hE_1', 'state'), false, 'picking a method never turns it On');
}
console.log('method settings tests passed');
