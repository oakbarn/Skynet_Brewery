// Value, Time and DateTime Widgets (Fritz, 2026-11-05, Rule 1.23) and "When Clicked" (Rule 6.14): node test/datawidget.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { Store, mainProp, isDataWidget } from '../lib/store.js';
import { Logger, LOG_MODES } from '../lib/logger.js';
import { Engine } from '../lib/engine.js';
import { elementTopic } from '../public/helpmap.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dataw'));
fs.mkdirSync(path.join(d, 'scripts'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'w_Strike', type: 'valueWidget', label: 'Strike volume', units: 'gal', precision: 2, initial: 7, database: { frequency: 'clicked' } },
  { name: 'w_Time_1', type: 'timeWidget', label: 'Time_1', initial: '00:10:00' },
  { name: 'w_DateTime_1', type: 'dateTimeWidget', label: 'DateTime_1' },
] }));
let store = new Store(cfg, path.join(d, 'data')); store.load();
assert.ok(isDataWidget(store.get('w_Strike')) && mainProp(store.get('w_Strike')) === 'value');
assert.equal(store.get('w_Strike').dataType, 'value'); assert.equal(store.get('w_Time_1').dataType, 'time');
assert.equal(store.getProp('w_Strike', 'value'), 7);
assert.deepEqual(elementTopic({ type: 'timeWidget' }), ['value-time-and-datetime-widgets']);

// a Process sets it by its Name
fs.writeFileSync(path.join(d, 'scripts', 'Set.txt'), 'w_Strike = 7.456\n');
const logger = new Logger(store, path.join(d, 'data', 'brewlog.db'));
const engine = new Engine(store, path.join(d, 'scripts'), logger);
assert.deepEqual(engine.check('w_Strike = 7.456\nif w_Strike > 5\nendif').errors, []);
engine.start('Set'); await new Promise(res => setTimeout(res, 300));
assert.equal(store.getProp('w_Strike', 'value'), 7.46, 'Decimals 2');

// When Clicked: sent when set on its Tab, each time (even the same value); a Process setting it does not send it
assert.ok(LOG_MODES.includes('clicked'));
assert.equal(logger.query({ name: 'w_Strike' }).length, 0, 'a Process set it: not sent');
store.setProp('w_Strike', 'value', 8, 'ui'); assert.equal(logger.clicked('w_Strike', 'value'), true);
store.setProp('w_Strike', 'value', 8, 'ui'); logger.clicked('w_Strike', 'value');
const rows = logger.query({ name: 'w_Strike' });
assert.equal(rows.length, 2); assert.equal(rows[0].reason, 'clicked'); assert.equal(rows[0].value, '8');
assert.equal(logger.clicked('w_Time_1', 'value'), false, 'not set to When Clicked');

// it keeps its value when the Brain restarts
store.persistNow(); logger.close(); clearTimeout(store._persistTimer);
store = new Store(cfg, path.join(d, 'data')); store.load();
assert.equal(store.getProp('w_Strike', 'value'), 8);
clearTimeout(store._persistTimer);
console.log('value widgets ok');
