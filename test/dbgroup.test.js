// Database Groups (Fritz, 2026-11-05, Rule 6.14): "In a Group" + send_db_group Group_Name; Once items become the Group Once
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { Store } from '../lib/store.js';
import { Logger, LOG_MODES } from '../lib/logger.js';
import { Engine } from '../lib/engine.js';
import { cleanDatabase } from '../lib/itemapi.js';
import { addGroup, checkGroupName, renameGroupInText, groupByName } from '../lib/dbgroups.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dbgroup'));
fs.mkdirSync(path.join(d, 'scripts'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ dbGroups: [{ id: 'grp_a1', name: 'Readings' }], elements: [
  { name: 'gGV_Strike', type: 'gGlobal', kind: 'value', initial: 7.5, database: { frequency: 'group', group: 'grp_a1' } },
  { name: 'gGV_pH', type: 'gGlobal', kind: 'value', initial: 5.4, database: { frequency: 'group', group: 'grp_a1' } },
  { name: 'gGV_Other', type: 'gGlobal', kind: 'value', initial: 1 },
  { name: 'gGV_Old', type: 'gGlobal', kind: 'value', initial: 3, database: { frequency: 'once' } },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const logger = new Logger(store, path.join(d, 'data', 'brewlog.db'));

// ---- Once is gone: its items are In the Group named Once (Rule 15.2), and the Schema file says so
assert.ok(!LOG_MODES.includes('once') && LOG_MODES.includes('group'));
const once = groupByName(store.config, 'once');
assert.ok(once && /^grp_[0-9a-f]{12}$/.test(once.id), 'the Group Once is made, with a meaningless key');
assert.deepEqual(store.config.elements.find(e => e.name === 'gGV_Old').database, { frequency: 'group', group: once.id });
assert.equal(JSON.parse(fs.readFileSync(cfg, 'utf8')).elements.find(e => e.name === 'gGV_Old').database.frequency, 'group');

// ---- nothing is sent by itself, even after a while
await new Promise(res => setTimeout(res, 200));
assert.equal(logger.query({}).length, 0, 'a Group waits for send_db_group');

// ---- send_db_group sends every item in the Group, each time
fs.writeFileSync(path.join(d, 'scripts', 'End.txt'), 'send_db_group Readings\nsend_db_group "Once"\n');
const engine = new Engine(store, path.join(d, 'scripts'), logger);
assert.deepEqual(engine.check('send_db_group Readings').errors, []);
assert.match(engine.check('send_db_group Nope').errors[0].msg, /no Group named "Nope"/);
engine.start('End'); await new Promise(res => setTimeout(res, 300));
assert.equal(logger.query({ name: 'gGV_Strike' }).length, 1);
assert.equal(logger.query({ name: 'gGV_Strike' })[0].reason, 'group:Readings');
assert.equal(logger.query({ name: 'gGV_pH' }).length, 1);
assert.equal(logger.query({ name: 'gGV_Old' }).length, 1);
assert.equal(logger.query({ name: 'gGV_Other' }).length, 0, 'not in a Group: not sent');
engine.start('End'); await new Promise(res => setTimeout(res, 300));
assert.equal(logger.query({ name: 'gGV_Strike' }).length, 2, 'sent again each time it runs');
assert.throws(() => logger.sendGroup('Nope'), /no Group named/);
logger.logNow('gGV_Other'); assert.equal(logger.query({ name: 'gGV_Other' }).length, 1, 'send_db works even when Off');

// ---- names, and Update All on a rename
assert.throws(() => checkGroupName(store.config, 'readings'), /already a Group/);
assert.throws(() => checkGroupName(store.config, 'Brew Day'), /no spaces/);
assert.equal(checkGroupName(store.config, 'Readings', 'grp_a1'), 'Readings', 'its own Name is fine');
const g = addGroup(store.config, 'Brew_Day_End'); assert.equal(groupByName(store.config, 'brew_day_end'), g);
assert.equal(renameGroupInText('send_db_group Readings\n  SEND_DB_GROUP "Readings"\nsend_db_group Readings_2\nprint "Readings"\n', 'Readings', 'Report'),
  'send_db_group Report\n  SEND_DB_GROUP "Report"\nsend_db_group Readings_2\nprint "Readings"\n');

// ---- the Database box settings keep the Group
assert.deepEqual(cleanDatabase({ database: { frequency: 'group', group: 'grp_a1', every: 'x' } }).database, { frequency: 'group', group: 'grp_a1' });

logger.close(); clearTimeout(store._persistTimer);
console.log('database groups ok');
