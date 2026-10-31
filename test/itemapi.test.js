// .database and .API on every Device and Widget (Fritz, 2026-10-30): node test/itemapi.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { Store } from '../lib/store.js';
import { Logger, dateTimeMs } from '../lib/logger.js';
import { cleanDatabase, ApiGuard, apiList, apiItem, apiPut } from '../lib/itemapi.js';
import { Engine } from '../lib/engine.js';
import { KEY } from '../lib/keys.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'itemapi'));
fs.mkdirSync(path.join(d, 'scripts'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'HLT_Temp', type: 'temperature', device: 'SIM', api: 'getput', database: { frequency: 'change' } },
  { name: 'Pump_1', type: 'digitalOut', device: 'SIM', api: 'getput' },
  { name: 'HLT_PID', type: 'pid', device: 'SIM', api: 'getput', database: { frequency: 'ondemand', attribute: 'target' } },
  { name: 'gGV_Ph', type: 'gGlobal', kind: 'value', api: 'get' },
  { name: 'gGV_Hidden', type: 'gGlobal', kind: 'value' },
  { name: 'tm_Boil', type: 'timer', database: { frequency: 'datetime', at: '2000-01-01T06:00' } },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const logger = new Logger(store, path.join(d, 'data', 'brewlog.db'));

// ---- cleanDatabase: only known settings, Off is left out
const el = cleanDatabase({ name: 'x', api: 'everything', database: { frequency: 'minutes', every: '5', at: ' 12 AM ', junk: 1, attribute: 'Target' } });
assert.equal(el.api, undefined); assert.deepEqual(el.database, { frequency: 'minutes', every: 5, at: '12 AM', attribute: 'target' });
assert.equal(cleanDatabase({ database: { frequency: 'none' }, api: 'off' }).database, undefined);
assert.equal(cleanDatabase({ database: { frequency: 'bogus' } }).database, undefined);
assert.equal(dateTimeMs('2026-11-01T06:00'), new Date(2026, 10, 1, 6, 0).getTime()); assert.equal(dateTimeMs('soon'), null);

// ---- the API: only items with .API on, Put only with Get and Put
assert.deepEqual(apiList(store).map(x => x.name), ['HLT_Temp', 'Pump_1', 'HLT_PID', 'gGV_Ph']);
assert.equal(apiItem(store, 'gGV_Hidden'), null, '.API Off is not reachable');
assert.equal(apiItem(store, 'Pump_1').value, false); assert.equal(apiItem(store, 'HLT_PID', 'target').value, 0);
assert.ok('target' in apiItem(store, 'HLT_PID').attributes);
assert.deepEqual(apiPut(store, 'Pump_1', null, true), { name: 'Pump_1', attribute: 'state', value: true });
assert.equal(store.getProp('Pump_1', 'state'), true);
assert.deepEqual(apiPut(store, 'HLT_PID', null, { target: 152, kp: 3 }).set, { target: 152, kp: 3 });
assert.throws(() => apiPut(store, 'gGV_Ph', null, 7), e => e.status === 403, 'Get only');
assert.throws(() => apiPut(store, 'gGV_Hidden', null, 7), e => e.status === 404, 'Off');
assert.throws(() => apiPut(store, 'HLT_Temp', 'value', 200), /can't be changed from outside/, 'a board reading');
assert.throws(() => apiPut(store, 'Pump_1', 'image', 'x.png'), /can't be changed from outside/, 'a picture');
// ---- the guard: ten wrong keys shut an address out for a while
const g = new ApiGuard();
for (let i = 0; i < 9; i++) g.wrong('1.2.3.4', 1000);
assert.equal(g.blocked('1.2.3.4', 1000), false); g.wrong('1.2.3.4', 1000);
assert.equal(g.blocked('1.2.3.4', 2000), true); assert.equal(g.blocked('5.6.7.8', 2000), false);
assert.equal(g.blocked('1.2.3.4', 1000 + 900_001), false, 'let in again after 15 minutes');

// ---- the database: any item, with its hidden key; send_db in a Process
fs.writeFileSync(path.join(d, 'scripts', 'Send.txt'), 'send_db HLT_PID\nsend_db "Pump_1"\n');
const engine = new Engine(store, path.join(d, 'scripts'), logger);
assert.match(engine.check('log HLT_PID').errors[0].msg, /send_db/, 'log is send_db now');
assert.deepEqual(engine.check('send_db HLT_PID').errors, []);
engine.start('Send'); await new Promise(res => setTimeout(res, 300));
let rows = logger.query({ name: 'HLT_PID' });
assert.equal(rows.length, 1); assert.equal(rows[0].value, '152'); assert.equal(rows[0].reason, 'script'); assert.equal(rows[0].key, undefined, 'the key stays on the Brain');
assert.equal(logger.query({ name: 'Pump_1' })[0].value, 'true');
// On value change: one write per change, at most every 100 ms, the last one never lost
store.setProp('HLT_Temp', 'value', 150, 'hw'); store.setProp('HLT_Temp', 'value', 151, 'hw'); store.setProp('HLT_Temp', 'value', 152, 'hw');
await new Promise(res => setTimeout(res, 250));
assert.deepEqual(logger.query({ name: 'HLT_Temp' }).map(r => r.value).reverse(), ['150', '152']);
// a date and time already past when the Brain started is not written
await new Promise(res => setTimeout(res, 120));
assert.equal(logger.query({ name: 'tm_Boil' }).length, 0);
// a renamed item keeps its readings: today's name finds them (by key), and lists and CSVs show today's name
const key = store.get('HLT_PID')[KEY];
logger.db.prepare('INSERT INTO samples (ts, name, value, num, reason, key, attr) VALUES (?, ?, ?, ?, ?, ?, ?)').run(1, 'Old_PID_Name', '140', 140, 'interval', key, 'target');
assert.equal(logger.query({ name: 'HLT_PID' }).length, 2);
assert.ok(logger.query({ name: 'HLT_PID' }).every(r => r.name === 'HLT_PID'));
assert.equal(logger.names().find(n => n.name === 'HLT_PID').count, 2); assert.ok(!logger.names().some(n => n.name === 'Old_PID_Name'));
assert.equal(logger.exportRows({ names: ['HLT_PID'] }).length, 2);
// readings written before keys were kept get their key by name
logger.db.prepare('INSERT INTO samples (ts, name, value, num, reason) VALUES (?, ?, ?, ?, ?)').run(2, 'gGV_Ph', '5.4', 5.4, 'interval');
logger.giveKeys();
assert.equal(logger.db.prepare('SELECT key FROM samples WHERE name = ?').get('gGV_Ph').key, store.get('gGV_Ph')[KEY]);

logger.close(); clearTimeout(store._persistTimer);
console.log('item API and database tests passed');
process.exit(0);
