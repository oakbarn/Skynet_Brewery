// Manual Valve Widget (Fritz, 2026-10-28): its .state changes only with a click on its Tab. A Process that sets it shows
// "open it by hand" and waits until the valve shows what it asked for; it never changes the valve itself.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mvw'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'Done', type: 'gKonstant', kind: 'value' }],
  graphics: [{ id: 'g1', kind: 'ip', fitting: 'manualValve', label: 'Kettle drain', workspace: 'Brew', x: 10, y: 10, w: 30, h: 30 },
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
console.log('manual valve widget tests passed');
process.exit(0);
