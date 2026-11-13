// Database Groups (Fritz, 2026-11-05, rewritten 2026-11-06, Rule 6.14): an item keeps its own Send to the database setting and may be
// in more than one Group; while it is in a Group it is sent only while one of its Groups is started (start_db_group / stop_db_group).
// On demand (send_db) always works; send_db_group sends the Group once. Older Once / In a Group items become On demand in their Group.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { Store } from '../lib/store.js';
import { Logger, LOG_MODES } from '../lib/logger.js';
import { Engine } from '../lib/engine.js';
import { cleanDatabase } from '../lib/itemapi.js';
import { addGroup, checkGroupName, renameGroupInText, groupByName } from '../lib/dbgroups.js';

const wait = ms => new Promise(res => setTimeout(res, ms));
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dbgroup'));
fs.mkdirSync(path.join(d, 'scripts'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ dbGroups: [{ id: 'grp_o1', name: 'Once' }, { id: 'grp_a1', name: 'Readings' }, { id: 'grp_m1', name: 'Mash' }, { id: 'grp_b1', name: 'Boil' }], elements: [
  { name: 'gGV_Strike', type: 'gGlobal', kind: 'value', initial: 7.5, database: { frequency: 'ondemand', groups: ['grp_a1'] } },
  { name: 'gGV_pH', type: 'gGlobal', kind: 'value', initial: 5.4, database: { frequency: 'ondemand', groups: ['grp_a1'] } },
  { name: 'gGV_Other', type: 'gGlobal', kind: 'value', initial: 1 },
  { name: 'gGV_Old', type: 'gGlobal', kind: 'value', initial: 3, database: { frequency: 'ondemand', groups: ['grp_o1'] } },
  // Fritz's Mash probe: every N (here 100 ms so the test is quick), in the Groups Mash and Boil
  { name: 'gGV_MashTemp', type: 'gGlobal', kind: 'value', initial: 152, database: { frequency: 'ms', every: 100, groups: ['grp_m1', 'grp_b1'] } },
  { name: 'gGV_Free', type: 'gGlobal', kind: 'value', initial: 2, database: { frequency: 'ms', every: 100 } },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const logger = new Logger(store, path.join(d, 'data', 'brewlog.db'));
const count = name => logger.query({ name }).length;

assert.ok(!LOG_MODES.includes('once') && !LOG_MODES.includes('group'));

// ---- an item in a Group is not sent while none of its Groups is started; one in no Group is
await wait(350);
assert.equal(count('gGV_MashTemp'), 0, 'its Groups are stopped: nothing sent');
assert.equal(count('gGV_Strike'), 0, 'On demand waits for send_db');
assert.ok(count('gGV_Free') >= 2, 'not in a Group: sent by its own setting all the time');

// ---- start_db_group Mash: sent at its own rate until stop_db_group Mash
fs.writeFileSync(path.join(d, 'scripts', 'MashOn.txt'), 'start_db_group Mash\n');
fs.writeFileSync(path.join(d, 'scripts', 'MashOff.txt'), 'stop_db_group "Mash"\n');
const engine = new Engine(store, path.join(d, 'scripts'), logger);
for (const l of ['start_db_group Mash', 'stop_db_group Mash', 'send_db_group Readings']) assert.deepEqual(engine.check(l).errors, [], l);
assert.match(engine.check('start_db_group Nope').errors[0].msg, /start_db_group: no Group named "Nope"/);
engine.start('MashOn'); await wait(380);
const during = count('gGV_MashTemp');
assert.ok(during >= 3, `sent while Mash is started (${during})`);
assert.deepEqual(logger.liveGroups(), ['Mash']);
engine.start('MashOff'); await wait(100); const stopped = count('gGV_MashTemp'); await wait(300);
assert.equal(count('gGV_MashTemp'), stopped, 'nothing more after stop_db_group');
// ---- more than one Group: either one started lets it be sent
logger.startGroup('Boil'); await wait(250); assert.ok(count('gGV_MashTemp') > stopped, 'Boil is started: sent');
logger.stopGroup('Boil'); const afterBoil = count('gGV_MashTemp');
// ---- On demand always works, started or not
logger.logNow('gGV_MashTemp'); assert.equal(count('gGV_MashTemp'), afterBoil + 1, 'send_db works when its Groups are stopped');
logger.logNow('gGV_Other'); assert.equal(count('gGV_Other'), 1, 'send_db works even when Off');

// ---- send_db_group sends every item of the Group once, now
fs.writeFileSync(path.join(d, 'scripts', 'End.txt'), 'send_db_group Readings\nsend_db_group "Once"\n');
engine.start('End'); await wait(300);
assert.equal(count('gGV_Strike'), 1); assert.equal(logger.query({ name: 'gGV_Strike' })[0].reason, 'group:Readings');
assert.equal(count('gGV_pH'), 1); assert.equal(count('gGV_Old'), 1);
engine.start('End'); await wait(300);
assert.equal(count('gGV_Strike'), 2, 'sent again each time it runs');
assert.throws(() => logger.sendGroup('Nope'), /no Group named/);

// ---- names, and Update All on a rename (all three commands)
assert.throws(() => checkGroupName(store.config, 'readings'), /already a Group/);
assert.throws(() => checkGroupName(store.config, 'Brew Day'), /no spaces/);
assert.equal(checkGroupName(store.config, 'Readings', 'grp_a1'), 'Readings', 'its own Name is fine');
const g = addGroup(store.config, 'Brew_Day_End'); assert.equal(groupByName(store.config, 'brew_day_end'), g);
assert.equal(renameGroupInText('send_db_group Readings\n  SEND_DB_GROUP "Readings"\nsend_db_group Readings_2\nstart_db_group Readings\nstop_db_group "Readings"\nprint "Readings"\n', 'Readings', 'Report'),
  'send_db_group Report\n  SEND_DB_GROUP "Report"\nsend_db_group Readings_2\nstart_db_group Report\nstop_db_group "Report"\nprint "Readings"\n');

// ---- the Database box settings keep the Groups (more than one)
assert.deepEqual(cleanDatabase({ database: { frequency: 'minutes', every: 1, groups: ['grp_m1', 'grp_b1', 'grp_m1', 'bad key'] } }).database, { frequency: 'minutes', groups: ['grp_m1', 'grp_b1'], every: 1 });

// ---- Name.Attribute DBSend (OakBarn Brewery, 2026-11-13): one attribute now; Name DBSend = send_db Name
for (const l of ['gGV_Other DBSend', 'gGV_Other.visible DBSend', '"gGV_Other".visible dbsend', 'send_db gGV_Other']) assert.deepEqual(engine.check(l).errors, [], l);
assert.match(engine.check('gGV_Nope.visible DBSend').errors[0].msg, /gGV_Nope/);
const before = count('gGV_Other');
fs.writeFileSync(path.join(d, 'scripts', 'Dbs.txt'), 'gGV_Other DBSend\ngGV_Other.visible DBSend\n');
engine.start('Dbs'); await wait(300);
assert.equal(count('gGV_Other'), before + 2, 'DBSend sent twice');
const rows = logger.db.prepare('SELECT attr, value FROM samples WHERE name = ? ORDER BY id DESC LIMIT 2').all('gGV_Other');
assert.equal(rows[0].attr, 'visible', 'Name.Attribute DBSend sends that attribute'); assert.notEqual(rows[1].attr, 'visible');
assert.throws(() => logger.logNow('gGV_Other', 'script', 'nosuchthing'), /no \.nosuchthing|nosuchthing/);

logger.close(); clearTimeout(store._persistTimer);
console.log('database groups ok');
