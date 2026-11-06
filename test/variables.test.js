// node --no-warnings test/variables.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Store, clockTimeOnly } from '../lib/store.js'; import { nextAt, intervalMs } from '../lib/logger.js'; import { parseClock } from '../lib/values.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpv'));
fs.mkdirSync(path.join(d, 'media')); fs.writeFileSync(path.join(d, 'media', 'n.txt'), 'hello');
fs.mkdirSync(path.join(d, 'config')); const cfg = path.join(d, 'config', 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ mediaRoots: ['./media'], elements: [
  { name: 'gGMB_Go', type: 'gGlobal', kind: 'momentary' }, { name: 'gGL_N', type: 'gGlobal', kind: 'longstring', file: 'n.txt' },
  { name: 'gGSW_X', type: 'gGlobal', kind: 'switch' }, { name: 'gGV_T', type: 'gGlobal', kind: 'value', initial: 5 }] }));
const s = new Store(cfg, path.join(d, 'data')); s.load();
assert.equal(s.getProp('gGL_N', 'value'), 'hello');
s.setProp('gGL_N', 'value', 'bye'); assert.equal(fs.readFileSync(path.join(d, 'media', 'n.txt'), 'utf8'), 'bye');
assert.throws(() => s.setProp('gGL_N', 'file', '/etc/passwd') && s.setProp('gGL_N', 'value', 'x'));
assert.equal(s.getProp('gGV_T', 'value'), 5);
s.setProp('gGSW_X', 'state', true); assert.equal(s.getProp('gGSW_X', 'value'), true);
s.setProp('gGMB_Go', 'value', true); assert.equal(s.getProp('gGMB_Go', 'value'), true);
assert.equal(parseClock('12 AM'), 0); assert.equal(parseClock('6:30 PM'), 66600); assert.equal(parseClock('7'), null);
const now = new Date(2026, 9, 3, 14, 20).getTime();
assert.equal(nextAt({ frequency: 'days', every: 1, at: '12 AM' }, now), new Date(2026, 9, 4, 0, 0).getTime());
assert.equal(nextAt({ frequency: 'hours', every: 6, at: '1 AM' }, now), new Date(2026, 9, 3, 19, 0).getTime());
// At clock time (Fritz, 2026-11-04): every day at that time; the Every choices have no clock time
assert.equal(nextAt({ frequency: 'clock', at: '6:30 PM' }, now), new Date(2026, 9, 3, 18, 30).getTime());
assert.equal(nextAt({ frequency: 'clock', at: '1 AM' }, now), new Date(2026, 9, 4, 1, 0).getTime());
// the shortcuts (Fritz, 2026-11-06): Every second / minute / hour, and Every day (at Midnight)
assert.equal(intervalMs({ frequency: 'second' }), 1000); assert.equal(intervalMs({ frequency: 'minute' }), 60_000); assert.equal(intervalMs({ frequency: 'hour' }), 3600_000);
assert.equal(nextAt({ frequency: 'midnight' }, now), new Date(2026, 9, 4, 0, 0).getTime());
assert.deepEqual(clockTimeOnly({ frequency: 'days', every: 1, at: '12 AM' }), { frequency: 'clock', at: '12 AM' });
assert.deepEqual(clockTimeOnly({ frequency: 'hours', every: 6, at: '1 AM' }), { frequency: 'hours', every: 6 });
assert.deepEqual(clockTimeOnly({ frequency: 'datetime', at: '2026-11-01T06:00' }), { frequency: 'datetime', at: '2026-11-01T06:00' });
assert.equal(intervalMs({ frequency: 'hms', interval: '00:01:30' }), 90000); assert.equal(intervalMs({ frequency: 'ms', every: 5 }), 100);
setTimeout(() => { assert.equal(s.getProp('gGMB_Go', 'value'), false); clearTimeout(s._persistTimer); console.log('variables test: all passed'); }, 200);
