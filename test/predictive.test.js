// Predictive Hysteresis (OakBarn Brewery, 2026-11-09, Rule 6.23: "smoothing the overshoot"): Skynet learns how far the reading
// coasts past where the output turned off, and turns off that much early, never by more than half the On offset. The ON point moves
// down by the same amount, so the swing and the number of starts stay the same (safe for a compressor); the On delay is kept. On unless .predictive = false.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Control } from '../lib/control.js';

function run(predictive, cool = false) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'predictive'));
  const cfg = path.join(d, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
    { name: 'Temp', type: 'temperature', sensor: 'simulated' },
    { name: 'Hys', type: 'hysteresis', device: 'MB', channel: 5, input: 'Temp', target: cool ? 34 : 150, onOffset: cool ? -4 : 4, ...(predictive === undefined ? {} : { predictive }) },
  ] }));
  const store = new Store(cfg, path.join(d, 'data')); store.load();
  const ctl = new Control(store);
  store.setProp('Hys', 'enabled', true);
  // a heater (or a fridge) with lag: what it gives goes into its element first, then into the liquid
  let T = cool ? 40 : 140, H = 0, t = 0, ons = 0, was = false, peaks = [], peak = null;
  for (let s = 0; s < 6 * 3600; s++) {
    store.setProp('Temp', 'value', Math.round(T * 100) / 100); t += 1000; ctl.tick(t);
    const on = !!store.getProp('Hys', 'state');
    if (on && !was) { ons++; if (peak !== null) peaks.push(peak); peak = null; }
    if (!on && was) peak = T;
    if (!on && peak !== null) peak = cool ? Math.min(peak, T) : Math.max(peak, T);
    was = on;
    H += (on ? 1 : 0) - 0.05 * H;                  // the element heats up and passes its heat on slowly
    T += (cool ? -1 : 1) * 0.02 * H + 0.0004 * ((cool ? 60 : 70) - T);      // and the room warms or cools it back
  }
  clearTimeout(store._persistTimer);
  const last = peaks.slice(-5), over = last.reduce((a, p) => a + (cool ? 34 - p : p - 150), 0) / last.length;
  return { over, ons };
}
const plain = run(false), pred = run(undefined);
assert.ok(plain.over > 1, `without Predictive it overshoots (${plain.over.toFixed(2)})`);
assert.ok(pred.over < plain.over / 2, `Predictive (on by default) settles near the Target (${pred.over.toFixed(2)} vs ${plain.over.toFixed(2)})`);
assert.ok(pred.ons <= plain.ons + 1, `never switches more often (${pred.ons} vs ${plain.ons} starts): safe for a compressor`);
const cplain = run(false, true), cpred = run(true, true);
assert.ok(cpred.over < cplain.over * 0.6, `cooling too (${cpred.over.toFixed(2)} vs ${cplain.over.toFixed(2)})`);
assert.ok(cpred.ons <= cplain.ons + 1, 'cooling: never more starts');
console.log(`predictive: overshoot ${plain.over.toFixed(2)} -> ${pred.over.toFixed(2)}, cycles ${plain.ons} -> ${pred.ons}; cooling ${cplain.over.toFixed(2)} -> ${cpred.over.toFixed(2)}, cycles ${cplain.ons} -> ${cpred.ons}`);
console.log('predictive hysteresis tests passed');
process.exit(0);
