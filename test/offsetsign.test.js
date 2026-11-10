// The Offset's sign in a Process (OakBarn Brewery, 2026-11-10, Rule 6.19): the same as the dialogs, On at Setpoint + Offset.
// HLT.onoffset = -1 heats; a Heating Element given a plus is a plain error; the saved number keeps its old sign (plus heats).
// The predictive text offers (-) Heat and (+) Cool; the BruControl Import turns BruControl's sign around.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';
import { offsetSigns, processOffset, fromProcessOffset } from '../public/heatmethod.js';
import { suggest } from '../public/autofill.js';
import { flipOffsetSigns } from '../lib/brucontrol.js';

const he = { name: 'hE', type: 'digitalOut', subtype: 'element', heatMethod: 'hysteresis', input: 'T', onOffset: 1 };
const pump = { name: 'cP', type: 'digitalOut', subtype: 'pump', typeCode: 'CPMP', heatMethod: 'hysteresis', input: 'T', onOffset: -2 };
const fv = { name: 'FV', type: 'fermentor', heatOffset: 1, coolOffset: 1 };
assert.deepEqual(offsetSigns(he), { onoffset: ['-'] });
assert.deepEqual(offsetSigns(pump), { onoffset: ['-', '+'] });
assert.deepEqual(offsetSigns(fv), { heatoffset: ['-'], cooloffset: ['+'] });
assert.equal(offsetSigns({ type: 'digitalOut', subtype: 'valve' }), null);
assert.equal(processOffset(he, 'onoffset', 1), -1, 'saved 1 (heats) reads -1');
assert.equal(processOffset(pump, 'onoffset', -2), 2, 'saved -2 (cools) reads 2');
assert.equal(processOffset(fv, 'heatoffset', 1), -1);
assert.equal(processOffset(fv, 'cooloffset', 1), 1, 'the Cool Offset is plus already');
assert.equal(fromProcessOffset(he, 'onoffset', -2), 2);
assert.throws(() => fromProcessOffset(he, 'onoffset', 2), /heats, so its \.onoffset has a minus/);
assert.equal(fromProcessOffset(pump, 'onoffset', 1.5), -1.5, 'a plus cools');
assert.throws(() => fromProcessOffset(fv, 'heatoffset', 1), /minus/);

// a plus sign before a number
assert.deepEqual(compile('new value x\nx = +1\n').errors, []);

// a Process
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'offsign'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
  { name: 'T', type: 'temperature', sensor: 'simulated', units: '°F' },
  { ...he, device: 'MB', channel: 5, target: 150 },
  { name: 'Step', type: 'gGlobal', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
eng.write('p', 'hE.onoffset = -2\nif hE.onoffset == -2\nStep = 1\nendif\n');
eng.start('p');
assert.ok(await until(() => store.getProp('Step', 'value') === 1), 'the Process reads back -2');
assert.equal(store.getProp('hE', 'onoffset'), 2, 'saved plus, as the Brain uses it');

// predictive text
const words = { elements: [{ name: 'hE', type: 'digitalOut', attrs: ['onoffset'], bools: [], signs: offsetSigns(he) }, { name: 'cP', type: 'digitalOut', attrs: ['onoffset'], bools: [], signs: offsetSigns(pump) }] };
assert.deepEqual(suggest('hE.onoffset = ', words).list.map(i => [i.text, i.label]), [['-', '(-) Heat']]);
assert.deepEqual(suggest('cP.onoffset = ', words).list.map(i => i.label), ['(-) Heat', '(+) Cool']);

// the BruControl Import
const out = { n: 0, left: [] };
assert.equal(flipOffsetSigns('hE.onoffset = 2\nif hE.onoffset > 1.5\nhE.onoffset += 1\nhE.onoffset = y * 2', out, 'P'), 'hE.onoffset = -2\nif hE.onoffset < -1.5\nhE.onoffset -= 1\nhE.onoffset = y * 2');
assert.equal(out.n, 3); assert.equal(out.left.length, 1);
console.log('offsetsign ok');
process.exit(0);
