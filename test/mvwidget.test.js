// Manual Valve Widget (Fritz, 2026-10-28): its .state changes only with a click on its Tab. A Process that sets it shows
// "open it by hand" and waits until the valve shows what it asked for; it never changes the valve itself.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mvw'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'Done', type: 'gGlobal', kind: 'value' }],
  graphics: [{ id: 'g1', kind: 'ip', fitting: 'manualValve', label: 'Kettle drain', workspace: 'Brew', x: 10, y: 10, w: 30, h: 30, confirmation: false },
    { id: 'g2', kind: 'ip', fitting: 'tee', workspace: 'Brew' }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };

// it gets a fixed name and a state; a tee is not a Manual Valve
assert.equal(store.config.graphics[0].name, 'ManualValve_1');
assert.ok(store.has('ManualValve_1'));
assert.equal(store.getProp('ManualValve_1', 'state'), false);
assert.equal(store.manualValves().length, 1);

// only a click (source ui) changes it, and it is kept in the layout
assert.throws(() => store.setProp('ManualValve_1', 'state', true, 'script'), /only a click/);
assert.throws(() => store.setProp('ManualValve_1', 'state', true, 'api'), /only a click/);
store.setProp('ManualValve_1', 'state', true, 'ui');
assert.equal(store.getProp('ManualValve_1', 'state'), true);
assert.equal(JSON.parse(fs.readFileSync(cfg, 'utf8')).graphics[0].open, true, 'saved in the layout');
store.setProp('ManualValve_1', 'state', false, 'ui');

// a Process asks for it and waits; Done is not how it goes on
eng.write('brew', 'Done = 1\nManualValve_1.state = true\nDone = 2\nManualValve_1 = false\nDone = 3\n');
eng.start('brew');
assert.ok(await until(() => eng.valveList().length === 1), 'asks for the Manual Valve');
assert.deepEqual(eng.valveList()[0], { ...eng.valveList()[0], name: 'ManualValve_1', label: 'Kettle drain', open: true, process: 'brew', widget: true, tab: 'Brew' });
await new Promise(r => setTimeout(r, 200));
assert.equal(store.getProp('Done', 'value'), 1, 'the Process waits');
assert.equal(store.getProp('ManualValve_1', 'state'), false, 'the Process does not open it');
assert.throws(() => eng.confirmValve('ManualValve_1'), /click it on its Tab/);
store.setProp('ManualValve_1', 'state', true, 'ui');          // someone clicks it open on the Tab
assert.ok(await until(() => eng.valveList().length === 1 && eng.valveList()[0].open === false), 'goes on, then asks to close it');
assert.equal(store.getProp('Done', 'value'), 2);
store.setProp('ManualValve_1', 'state', false, 'ui');
assert.ok(await until(() => store.getProp('Done', 'value') === 3), 'closed by a click: the Process finishes');
assert.equal(eng.valveList().length, 0);

// already the way the Process wants it: no ask
eng.write('again', 'ManualValve_1 = false\nDone = 4\n');
eng.start('again');
assert.ok(await until(() => store.getProp('Done', 'value') === 4));
clearTimeout(store._persistTimer);

// Confirmation Widgets (Rule 1.28, 2026-11-08): a Manual Valve Widget, a Manual valve Device and a Manual Pump Widget have
// .confirmation on to start; a Switch only when ticked. A Process line shows the pop-up with Done and waits; Done changes it.
{
  const d2 = fs.mkdtempSync(path.join(os.tmpdir(), 'cnf')), cfg2 = path.join(d2, 'c.json');
  fs.writeFileSync(cfg2, JSON.stringify({ elements: [{ name: 'Step', type: 'gGlobal', kind: 'value' },
    { name: 'wgt_MP_Pump_1_BR', type: 'manualPump', subtype: 'pump', label: 'Pump 1', workspace: 'Brew' },
    { name: 'wgt_SW_Stir_BR', type: 'switch', label: 'Stir', workspace: 'Brew', confirmation: true },
    { name: 'wgt_SW_Plain_BR', type: 'switch', label: 'Plain', workspace: 'Brew' },
    { name: 'MV_Dev', type: 'digitalOut', subtype: 'valve', valveType: 'manual', label: 'Drain', workspace: 'Brew' }],
  graphics: [{ id: 'g1', kind: 'ip', fitting: 'manualValve', label: 'Kettle drain', workspace: 'Brew', x: 10, y: 10, w: 30, h: 30 }] }));
  const s2 = new Store(cfg2, path.join(d2, 'data')); s2.load();
  const e2 = new Engine(s2, path.join(d2, 'scripts'), { logNow() { } });
  // once per Schema: every Manual Valve is ticked (OakBarn Brewery: "Update all the Manual Valve Widgets ... to the .confirmation true")
  assert.equal(s2.config.graphics[0].confirmation, true);
  assert.equal(s2.config.elements.find(e => e.name === 'MV_Dev').confirmation, true);
  assert.equal(s2.config.elements.find(e => e.name === 'wgt_MP_Pump_1_BR').confirmation, true);
  assert.equal(s2.config.elements.find(e => e.name === 'wgt_SW_Plain_BR').confirmation, undefined, 'a Switch is not ticked to start');
  assert.equal(s2.getProp('wgt_MP_Pump_1_BR', 'state'), false);
  // the Manual Pump: TURN ON ... by hand, the Process waits, Done turns it on
  e2.write('p', 'Step = 1\nwgt_MP_Pump_1_BR.state = true\nStep = 2\nManualValve_1 = true\nStep = 3\nwgt_SW_Stir_BR = true\nStep = 4\nwgt_SW_Plain_BR = true\nStep = 5\n');
  e2.start('p');
  assert.ok(await until(() => e2.valveList().length === 1));
  assert.deepEqual(e2.valveList()[0], { ...e2.valveList()[0], name: 'wgt_MP_Pump_1_BR', open: true, confirm: true, say: 'TURN ON', is: 'on', tab: 'Brew' });
  await new Promise(r => setTimeout(r, 200));
  assert.equal(s2.getProp('Step', 'value'), 1, 'waits for Done');
  assert.equal(s2.getProp('wgt_MP_Pump_1_BR', 'state'), false, 'not on until Done');
  e2.confirmValve('wgt_MP_Pump_1_BR');
  assert.ok(await until(() => s2.getProp('Step', 'value') === 2));
  assert.equal(s2.getProp('wgt_MP_Pump_1_BR', 'state'), true, 'Done turned it on');
  // the Manual Valve Widget: a pop-up with Done (not the click bar), Done opens it
  assert.ok(await until(() => e2.valveList().length === 1 && e2.valveList()[0].name === 'ManualValve_1'));
  assert.equal(e2.valveList()[0].widget, undefined);
  assert.equal(e2.valveList()[0].say, 'OPEN');
  e2.confirmValve('ManualValve_1');
  assert.ok(await until(() => s2.getProp('Step', 'value') === 3));
  assert.equal(s2.getProp('ManualValve_1', 'state'), true);
  // a click on its Tab (after the screen's own Done) also lets the Process go on: a ticked Switch
  assert.ok(await until(() => e2.valveList()[0]?.name === 'wgt_SW_Stir_BR'));
  assert.equal(e2.valveList()[0].say, 'TURN ON');
  s2.setProp('wgt_SW_Stir_BR', 'state', true, 'ui');
  assert.ok(await until(() => s2.getProp('Step', 'value') === 5), 'a Switch without .confirmation is set at once');
  assert.equal(s2.getProp('wgt_SW_Plain_BR', 'state'), true);
  // unticked, a Manual Pump is just set
  s2.config.elements.find(e => e.name === 'wgt_MP_Pump_1_BR').confirmation = false;
  e2.write('q', 'wgt_MP_Pump_1_BR = false\nStep = 6\n'); e2.start('q');
  assert.ok(await until(() => s2.getProp('Step', 'value') === 6));
  assert.equal(s2.getProp('wgt_MP_Pump_1_BR', 'state'), false);
  clearTimeout(s2._persistTimer);
  const { widgetTypeId } = await import('../public/naming.js');
  assert.equal(widgetTypeId({ type: 'manualPump' }), 'MP', 'a Manual Pump Widget is named wgt_MP_ (Rule 3.14)');
}
console.log('manual valve widget tests passed');
process.exit(0);
