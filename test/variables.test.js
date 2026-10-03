// node --no-warnings test/variables.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Store } from '../lib/store.js'; import { nextAt, intervalMs } from '../lib/logger.js'; import { parseClock } from '../lib/values.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpv'));
fs.mkdirSync(path.join(d, 'media')); fs.writeFileSync(path.join(d, 'media', 'n.txt'), 'hello');
fs.mkdirSync(path.join(d, 'config')); const cfg = path.join(d, 'config', 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ mediaRoots: ['./media'], elements: [
  { name: 'vKMB_Go', type: 'vKonstant', kind: 'momentary' }, { name: 'vKL_N', type: 'vKonstant', kind: 'longstring', file: 'n.txt' },
  { name: 'vKSW_X', type: 'vKonstant', kind: 'switch' }, { name: 'vAV_T', type: 'vAPI', kind: 'value', initial: 5 }] }));
const s = new Store(cfg, path.join(d, 'data')); s.load();
assert.equal(s.getProp('vKL_N', 'value'), 'hello');
s.setProp('vKL_N', 'value', 'bye'); assert.equal(fs.readFileSync(path.join(d, 'media', 'n.txt'), 'utf8'), 'bye');
assert.throws(() => s.setProp('vKL_N', 'file', '/etc/passwd') && s.setProp('vKL_N', 'value', 'x'));
assert.equal(s.getProp('vAV_T', 'value'), 5);
s.setProp('vKSW_X', 'state', true); assert.equal(s.getProp('vKSW_X', 'value'), true);
s.setProp('vKMB_Go', 'value', true); assert.equal(s.getProp('vKMB_Go', 'value'), true);
assert.equal(parseClock('12 AM'), 0); assert.equal(parseClock('6:30 PM'), 66600); assert.equal(parseClock('7'), null);
const now = new Date(2026, 9, 3, 14, 20).getTime();
assert.equal(nextAt({ mode: 'days', every: 1, at: '12 AM' }, now), new Date(2026, 9, 4, 0, 0).getTime());
assert.equal(nextAt({ mode: 'hours', every: 6, at: '1 AM' }, now), new Date(2026, 9, 3, 19, 0).getTime());
assert.equal(intervalMs({ mode: 'hms', interval: '00:01:30' }), 90000); assert.equal(intervalMs({ mode: 'ms', every: 5 }), 100);
setTimeout(() => { assert.equal(s.getProp('vKMB_Go', 'value'), false); clearTimeout(s._persistTimer); console.log('variables test: all passed'); }, 200);
