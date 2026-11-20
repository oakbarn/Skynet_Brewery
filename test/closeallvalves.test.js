// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Close all valves (OakBarn Brewery, 2026-11-20: "Close all Valve command that closes every valve that has the close toogle set. Tap
// water are always close with this command. Followed by Nanny 'Have you closed all Manual Valves'"; Rule 6.15, Help 100).
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, MANUAL_VALVES_ASK, MANUAL_VALVES_OPEN_ASK } from '../lib/engine.js';

const v = (name, o = {}) => ({ name, type: 'digitalOut', subtype: 'valve', ...o });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
assert.equal(MANUAL_VALVES_ASK, 'Have you closed all Manual Valves?');

async function run(elements, line = 'close_all_valves', start = true) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'cav-')), cfg = path.join(d, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({ elements: [...elements, { name: 'Out', type: 'gGlobal', kind: 'string', dataType: 'string' }] }));
  const store = new Store(cfg, path.join(d, 'data')); store.load();
  const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
  for (const e of elements) if (e.valveType !== 'manual') store.setProp(e.name, 'state', start);
  eng.write('p', line + '\nOut = "done"\n');
  eng.start('p');
  return { store, eng };
}

// with a Manual valve: the list closes (tap water always, a valve off the list stays), then one reminder that waits for Done
{
  const { store, eng } = await run([v('V_In'), v('V_Tap', { tapwater: true, closeAll: false }), v('V_Keep', { closeAll: false }), v('V_Hand', { valveType: 'manual' })]);
  assert.ok(await until(() => eng.valveList().some(a => a.ask)), 'the reminder shows');
  assert.equal(eng.valveList().filter(a => a.ask).length, 1, 'one reminder only');
  assert.equal(eng.valveList()[0].label, MANUAL_VALVES_ASK);
  assert.equal(store.getProp('V_In', 'state'), false, 'on the Close list: closed');
  assert.equal(store.getProp('V_Tap', 'state'), false, 'tap water: always closed');
  assert.equal(store.getProp('V_Keep', 'state'), true, 'its close switch off: left alone');
  assert.notEqual(store.getProp('Out', 'value'), 'done', 'the Process waits');
  eng.confirmValve(eng.valveList()[0].name);
  assert.ok(await until(() => store.getProp('Out', 'value') === 'done'), 'goes on after Done');
  clearTimeout(store._persistTimer);
}
// no Manual valve in the Schema: nothing to remind, it goes straight on
{
  const { store, eng } = await run([v('V_In')]);
  assert.ok(await until(() => store.getProp('Out', 'value') === 'done'), 'no reminder');
  assert.equal(store.getProp('V_In', 'state'), false);
  assert.ok(!eng.valveList().length);
  clearTimeout(store._persistTimer);
}
// open_all_valves: every valve On Open List, never tap water, then "Have you opened all Manual Valves?"
{
  const { store, eng } = await run([v('V_In'), v('V_Tap', { tapwater: true }), v('V_Shut', { openAll: false }), v('V_Hand', { valveType: 'manual' })], 'open_all_valves', false);
  assert.ok(await until(() => eng.valveList().some(a => a.ask)));
  assert.equal(eng.valveList()[0].label, MANUAL_VALVES_OPEN_ASK);
  assert.equal(MANUAL_VALVES_OPEN_ASK, 'Have you opened all Manual Valves?');
  assert.equal(store.getProp('V_In', 'state'), true, 'opened');
  assert.equal(store.getProp('V_Tap', 'state'), false, 'tap water never opens');
  assert.equal(store.getProp('V_Shut', 'state'), false, 'On Open List off: left alone');
  eng.confirmValve(eng.valveList()[0].name);
  assert.ok(await until(() => store.getProp('Out', 'value') === 'done'));
  clearTimeout(store._persistTimer);
}
console.log('close all valves tests passed');
