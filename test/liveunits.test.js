// Live readings in the Units (Rule 2.59 live side): a Pressure transducer, Level, Flow meter or Scale keeps its numbers in
// the units its sensor is calibrated in; it shows in Settings > Units; a Process reads and sets it in metric (bar, L, L/min, kg);
// a plain number in a Process is typed in the Units and kept in metric with its sign; a message shows it in the Units.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, tokenize } from '../lib/engine.js';
import { procTemp, unitsOnSave, unitsOnShow, degreeLiterals } from '../lib/proctemp.js';
import { qShow, qBack, qUnitShown, qNeedsTurn, qtyOwn, qSignFor, qBoxShow, qBoxBack } from '../public/qtyshow.js';
import { skynetConstant as K } from '../public/skconst.js';

const near = (a, b, m, e = 1e-3) => assert.ok(Math.abs(a - b) < e, `${m}: ${a} vs ${b}`);

// ---- showing (public/qtyshow.js): the factors are Skynet Constants
near(qShow(30, 'psi', 'Metric'), 30 * K('skn_const_Bar_p_PSI'), '30 psi in bar'); assert.equal(qUnitShown('psi', 'Metric'), 'bar');
near(qShow(2, 'bar', 'US'), 2 * K('skn_const_PSI_p_Bar'), '2 bar in psi'); assert.equal(qUnitShown('bar', 'US'), 'psi');
near(qShow(100, 'kPa', 'US'), 100 * K('skn_const_PSI_p_kPa'), '100 kPa in psi');
near(qShow(10, 'L', 'US'), 10 * K('skn_const_Gal_p_L'), '10 L in gal');
near(qShow(5, 'gal/min', 'Metric'), 5 * K('skn_const_LPM_p_GPM'), 'a flow rate'); assert.equal(qUnitShown('gal/min', 'Metric'), 'L/min');
near(qShow(10, 'lb', 'Metric'), 10 * K('skn_const_Kg_p_Lb'), '10 lb in kg');
assert.equal(qShow(12, 'psi', 'US'), 12, 'already in the Units'); assert.equal(qShow(50, 'kPa', 'Metric'), 50, 'kPa is metric: shown as it is');
assert.equal(qShow(7, 'pH', 'US'), 7); assert.equal(qShow(50, '%', 'Metric'), 50); assert.ok(!qNeedsTurn('°F', 'Metric'), 'temperatures are tempshow.js');
near(qBack(qShow(30, 'psi', 'Metric'), 'psi', 'Metric'), 30, 'typed back in the sensor\'s units');
// a box left as shown saves the kept number exactly (no drift)
const sh = qBoxShow(30, 'psi', 'Metric'); assert.equal(sh, 2.07); assert.equal(qBoxBack(2.07, sh, 30, 'psi', 'Metric'), 30);
// which attribute keeps which units
assert.equal(qtyOwn({ type: 'analogIn', units: 'psi' }, 'value'), 'psi');
assert.equal(qtyOwn({ type: 'analogIn', units: 'pH' }, 'value'), null, 'pH never turns');
assert.equal(qtyOwn({ type: 'flowMeter' }, 'rate'), 'gal/min', 'an older Flow meter with no units: gal');
assert.equal(qtyOwn({ type: 'flowMeter', units: 'L' }, 'total'), 'L');
assert.equal(qtyOwn({ type: 'flowMeter', units: 'L', display: 'total' }, 'value'), 'L', 'its Value is its Total when Total is picked');
assert.equal(qtyOwn({ type: 'scale' }, 'value'), 'lb'); assert.equal(qtyOwn({ type: 'scale', volumeUnits: 'L' }, 'volume'), 'L');
assert.equal(qtyOwn({ type: 'scale' }, 'calibrate'), null, 'a calibration weight stays in the sensor\'s own units');
assert.equal(qSignFor('gal/min'), 'gpm'); assert.equal(qSignFor('psi'), 'psi'); assert.equal(qSignFor('qt'), '');

// ---- the typed sign
near(tokenize('12psi', 1)[0].v, 12 * K('skn_const_Bar_p_PSI'), '12psi is in bar');
near(tokenize('5gal', 1)[0].v, 5 * K('skn_const_L_p_Gal'), '5gal is in L'); assert.equal(tokenize('5L', 1)[0].v, 5);
near(tokenize('10lb', 1)[0].v, 10 * K('skn_const_Kg_p_Lb'), '10lb is in kg'); near(tokenize('2gpm', 1)[0].v, 2 * K('skn_const_LPM_p_GPM'), '2gpm');
assert.equal(tokenize('5Liters', 1).length, 2, 'a longer word is not a sign');

// ---- a Process
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'liveunits'));
const cfg = path.join(d, 'c.json');
const els = [
  { name: 'KegP', type: 'analogIn', device: 'MB', channel: 'A1', signal: '0.5-4.5V', rangeLow: 0, rangeHigh: 30, units: 'psi', initial: 12 },
  { name: 'BarP', type: 'analogIn', device: 'MB', channel: 'A2', units: 'bar', initial: 1 },
  { name: 'Lvl', type: 'analogIn', device: 'MB', channel: 'A3', units: 'gal', initial: 5 },
  { name: 'PH', type: 'analogIn', device: 'MB', channel: 'A4', units: 'pH', initial: 5.2 },
  { name: 'TP', type: 'temperature', sensor: 'simulated', units: '°C' },
  { name: 'VW', type: 'valueWidget', units: 'gal' },      // a Value Widget is not a sensor: never turned
];
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: els, brewDefaults: { units: 'US' } }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const get = n => store.get(n);
assert.deepEqual(procTemp(get('KegP'), 'value', get), { kind: 'q', own: 'psi' }, 'a psi sensor turns for a Process');
assert.equal(procTemp(get('BarP'), 'value', get), null, 'a bar sensor already is metric');
assert.equal(procTemp(get('PH'), 'value', get), null);

const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const printed = []; eng.print = (n, t) => printed.push(String(t));
const until = async (f, ms = 3000) => { const t = Date.now(); while (Date.now() - t < ms) { if (f()) return true; await new Promise(r => setTimeout(r, 20)); } return false; };
const run = async (name, text) => { eng.write(name, text); eng.start(name); assert.ok(await until(() => !eng.running.has(name)), `${name} ends`); };
// it reads 12 psi as bar and sets a gal widget from liters
await run('a', 'new value p\np = KegP\nVW.value = 18.9271\nprint "Keg " + KegP + " psi"\nprint "Tank " + Lvl\nprint "pH " + PH\n');
assert.equal(store.getProp('VW', 'value'), 18.9271, 'a Value Widget keeps what the Process wrote');
assert.deepEqual(printed, ['Keg 12 psi', 'Tank 5', 'pH 5.2'], 'a message shows the reading in the Units');

// a plain number typed in the Units (US): kept in metric with its sign, shown back as typed
const typed = 'wait KegP >= 12\nVW.value = 5\nif 3 < Lvl\nendif\nwait KegP >= 1bar\nwait PH < 5.4\n';
const kept = unitsOnSave(typed, 'US', get, tokenize);
assert.deepEqual(kept.text.split('\n').slice(0, 6), ['wait KegP >= 0.8274bar', 'VW.value = 5', 'if 11.3562L < Lvl', 'endif', 'wait KegP >= 1bar', 'wait PH < 5.4']);
assert.equal(unitsOnShow(kept.text, 'US', get, tokenize), typed.replace('1bar', '14.5'), 'opened in US: in psi and gal (a bar sign shows in psi too)');
assert.equal(unitsOnSave(unitsOnShow(kept.text, 'US', get, tokenize), 'US', get, tokenize).text, kept.text.replace('>= 1bar', '>= 0.9997bar'), 'open and save again: kept');
assert.equal(unitsOnSave('wait KegP >= 12psi\n', 'US', get, tokenize).text, 'wait KegP >= 12psi\n', 'a number typed with its sign stays as typed');
assert.equal(unitsOnShow('wait KegP >= 12psi\n', 'Metric', get, tokenize), 'wait KegP >= 12psi\n');
assert.equal(unitsOnSave('wait KegP >= 0.8\n', 'Metric', get, tokenize).text, 'wait KegP >= 0.8bar\n', 'Metric: typed in bar');
// a BruControl script on a psi sensor gets its sign, so it means the same
assert.equal(degreeLiterals('wait KegP >= 12\nwait BarP >= 1\n', get, tokenize).text, 'wait KegP >= 12psi\nwait BarP >= 1\n');
// it runs as typed: 12 psi
store.setProp('KegP', 'value', 12.5, 'test');
await run('b', kept.text.split('\n')[0] + '\nprint "ok"\n');
assert.equal(printed.at(-1), 'ok', 'wait KegP >= 0.8274bar is met by 12.5 psi');

// ---- Metric: a message shows metric
store.config.brewDefaults.units = 'Metric';
await run('c', 'print "Keg " + KegP\n');
assert.equal(printed.at(-1), 'Keg 0.8618', 'in bar');
console.log('liveunits ok');
process.exit(0);
