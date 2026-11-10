// The Fermentor Control (OakBarn Brewery, 2026-11-10, Rule 6.30): one Setpoint, Heat below and Cooling above it with Hysteresis, never both
// On, a Changeover wait between them, On delays and Shortest runs on each side, a heater kept to its Switched by range (Rule 6.29).
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Control } from '../lib/control.js';
import { fermModeKey, fermProblems } from '../public/fermentor.js';

assert.equal(fermModeKey('Heat & Cool'), 'auto'); assert.equal(fermModeKey('heat only'), 'heat'); assert.equal(fermModeKey('Cool_Only'), 'cool'); assert.equal(fermModeKey('x'), null);
assert.deepEqual(fermProblems({ input: 'T', heat: 'H', cool: 'C' }), []);
assert.ok(fermProblems({ heat: 'H', cool: 'H' }).length === 2, 'no probe, same Device twice');

function make(extra = {}) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ferm'));
  const cfg = path.join(d, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }], elements: [
    { name: 'T', type: 'temperature', sensor: 'simulated', units: '°F' },
    { name: 'Mat', type: 'digitalOut', subtype: 'element', heatMethod: 'hysteresis', device: 'MB', channel: 5, input: 'T', target: 150, onOffset: 1 },
    { name: 'Freezer', type: 'digitalOut', device: 'MB', channel: 6 },
    { name: 'FV1', type: 'fermentor', input: 'T', heat: 'Mat', cool: 'Freezer', target: 66, heatOffset: 1, coolOffset: 1, changeover: 300, heatDelay: 60, heatMinRun: 60, coolDelay: 300, coolMinRun: 120, predictive: false, ...extra },
  ] }));
  const store = new Store(cfg, path.join(d, 'data')); store.load();
  return { store, ctl: new Control(store) };
}
{
  const { store, ctl } = make();
  const at = (s, temp) => { if (temp !== undefined) store.setProp('T', 'value', temp); ctl.tick(s * 1000); };
  const on = n => !!store.getProp(n, 'state');
  assert.equal(store.getProp('FV1', 'setpoint'), 66, '.setpoint is the Setpoint');
  at(1, 70); assert.equal(store.getProp('FV1', 'doing'), 'Off', 'Off until turned On');
  store.setProp('FV1', 'state', true);
  at(2, 70); assert.equal(on('Freezer'), false, 'the freezer waits its Cool On delay after the Fermentor is turned On');
  assert.equal(store.getProp('FV1', 'doing'), 'Waiting to cool');
  at(303, 70); assert.equal(on('Freezer'), true, 'then cools'); assert.equal(store.getProp('FV1', 'doing'), 'Cooling');
  at(310, 65.5); assert.equal(on('Freezer'), true, 'Shortest run: stays on 120 s even past the Setpoint');
  at(424, 65.5); assert.equal(on('Freezer'), false, 'then stops');
  at(430, 64.5); assert.equal(on('Mat'), false, 'Heat waits the Changeover wait after cooling');
  assert.equal(store.getProp('FV1', 'doing'), 'Waiting to heat');
  at(725, 64.5); assert.equal(on('Mat'), true, 'then heats'); assert.equal(on('Freezer'), false, 'never both');
  assert.equal(store.getProp('Mat', 'method'), 'Direct', 'its heater is run in Direct');
  store.setProp('FV1', 'mode', 'Cool only'); at(726, 64.5); assert.equal(on('Mat'), false, 'Cool only stops the heat at once');
  assert.throws(() => store.setProp('FV1', 'mode', 'Sideways'), /Heat & Cool, Heat only, Cool only/);
  assert.throws(() => store.setProp('FV1', 'doing', 'Heating'), /read only/);
  store.setProp('FV1', 'mode', 'Heat & Cool'); at(800, 64.5); assert.equal(on('Mat'), true);
  store.setProp('FV1', 'state', false); at(801, 64.5); assert.equal(on('Mat'), false, 'turned Off: both Off'); assert.equal(store.getProp('FV1', 'doing'), 'Off');
  clearTimeout(store._persistTimer);
}
{
  // a heater on a Contactor keeps its range (Rule 6.29): Heat On offset 0.2 runs as 1 °F, its On delay at least 10 s
  const { store, ctl } = make({ heatOffset: 0.2, heatDelay: 0, changeover: 0 });
  const d = store.get('Mat'); d.switchedBy = 'contactor';
  store.setProp('FV1', 'state', true);
  store.setProp('T', 'value', 65.5); ctl.tick(1000); ctl.tick(70000);
  assert.equal(!!store.getProp('Mat', 'state'), false, '0.5 °F below is not enough for a Contactor (1 to 5 °F)');
  store.setProp('T', 'value', 64.9); ctl.tick(71000);
  assert.equal(!!store.getProp('Mat', 'state'), true, '1 °F below heats');
  clearTimeout(store._persistTimer);
}
{
  // just turned On, nothing has run: only the side's own On delay counts, not the Changeover wait
  const { store, ctl } = make({ heatDelay: 0 });
  store.setProp('FV1', 'state', true); store.setProp('T', 'value', 64); ctl.tick(1000); ctl.tick(1100);
  assert.equal(!!store.getProp('Mat', 'state'), true, 'a cold start heats at once when its Heat On delay is 0');
  clearTimeout(store._persistTimer);
}
console.log('fermentor tests passed');
