// node --no-warnings test/gpersist.test.js
// Rule 1.22 (Fritz, 2026-11-03): every gGlobal is non-volatile. Its value is on the Brain's disk soon after it changes,
// comes back when the Brain or the panel restarts, and is never cleared when a Process starts.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Store, readState } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpgp'));
const cfg = path.join(d, 'c.json'), data = path.join(d, 'data'), state = path.join(data, 'state.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'gV_Strike', type: 'gGlobal', kind: 'value', initial: 150 },
  { name: 'gS_Note', type: 'gGlobal', kind: 'string', initial: 'start', retain: false },     // an old "don't keep" switch is ignored
  { name: 'gB_Added', type: 'gGlobal', kind: 'bool' },
  { name: 'gT_Rest', type: 'gGlobal', kind: 'time', initial: '00:10:00' },
  { name: 'gGMB_Go', type: 'gGlobal', kind: 'momentary' }] }));
const wait = ms => new Promise(r => setTimeout(r, ms));

// 1. a change is saved without the panel being stopped (a power cut 1 second later keeps it)
let s = new Store(cfg, data); s.load();
assert.equal(s.getProp('gV_Strike', 'value'), 150);
s.setProp('gV_Strike', 'value', 163); s.setProp('gS_Note', 'value', 'yeast in'); s.setProp('gB_Added', 'value', true);
s.setProp('gT_Rest', 'value', '01:00:00');
await wait(1100);
const saved = JSON.parse(fs.readFileSync(state, 'utf8'));
assert.equal(saved.gV_Strike, 163); assert.equal(saved.gS_Note, 'yeast in'); assert.equal(saved.gB_Added, true);
assert.ok(!('gGMB_Go' in saved));                       // a button always starts let go
assert.ok(!fs.existsSync(state + '.tmp'));

// 2. a busy Process changing a value all the time still gets it written within a second
const t0 = Date.now(); let n = 0;
while (Date.now() - t0 < 1300) { s.setProp('gV_Strike', 'value', ++n); await wait(50); }
assert.ok(JSON.parse(fs.readFileSync(state, 'utf8')).gV_Strike >= n - 25, 'saved while still changing');
s.setProp('gV_Strike', 'value', 163); s.persistNow();

// 3. restart: every value comes back (no Keep value switch)
s = new Store(cfg, data); s.load();
assert.equal(s.getProp('gV_Strike', 'value'), 163); assert.equal(s.getProp('gS_Note', 'value'), 'yeast in');
assert.equal(s.getProp('gB_Added', 'value'), true); assert.equal(s.getProp('gT_Rest', 'value').toString(), '01:00:00');
assert.ok(!('retain' in s.els.get('gS_Note')));

// 4. starting a Process does not clear them; only the Process's own variables start empty
const eng = new Engine(s, path.join(d, 'scripts'), { logNow() {} });
fs.mkdirSync(path.join(d, 'scripts'), { recursive: true }); eng.write('Brew', 'new value vLocal\nvLocal = gV_Strike + 1\ngV_Strike = vLocal\n');
eng.start('Brew'); await wait(300);
assert.equal(s.getProp('gV_Strike', 'value'), 164);
eng.start('Brew'); await wait(300);
assert.equal(s.getProp('gV_Strike', 'value'), 165, 'the second start began from 164, not from 150');
s.persistNow();

// 5. a state.json broken by a power cut: the last good copy (state.json.bak) is used
s.setProp('gV_Strike', 'value', 170); s.persistNow();
fs.writeFileSync(state, '{"gV_Str');
assert.equal(readState(state).gV_Strike, 165);
s = new Store(cfg, data); s.load();
assert.equal(s.getProp('gV_Strike', 'value'), 165);
clearTimeout(s._persistTimer); eng.stopAll?.();
console.log('gGlobal non-volatile test: all passed');
process.exit(0);
