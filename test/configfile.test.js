// Config Editor: node test/configfile.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { Store } from '../lib/store.js';
import { backupConfigFile, listBackups, readBackup, checkConfigText, applyConfigText } from '../lib/configfile.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpc'));
fs.mkdirSync(path.join(d, 'config'));
const file = path.join(d, 'config', 'brewery.json'), data = path.join(d, 'data');
const first = JSON.stringify({ title: 'one', elements: [{ name: 'vA_A', type: 'vAPI' }] }, null, 2);
fs.writeFileSync(file, first);
const store = new Store(file, data); store.load();
const loaded = fs.readFileSync(file, 'utf8');      // the first load gives every named item its hidden key (lib/keys.js) and writes it
assert.match(loaded, /"_key": "k[0-9a-f]{16}"/);

// opening makes one copy; opening again with no change does not make another
const b1 = backupConfigFile(store);
assert.equal(b1.made, true);
assert.equal(backupConfigFile(store).made, false);
assert.equal(listBackups(store).length, 1);
assert.equal(readBackup(store, b1.name), loaded);
assert.throws(() => readBackup(store, '../brewery.json'));

// problems are found with a line number
assert.equal(checkConfigText(first, data), null);
const p1 = checkConfigText('{\n  "title": "x",\n  "elements": [\n}', data);
assert.ok(p1 && p1.line >= 3 && /JSON/.test(p1.msg), JSON.stringify(p1));
const p2 = checkConfigText('{\n  "elements": [\n    { "name": "Bad", "type": "nonsense" }\n  ]\n}', data);
assert.equal(p2.line, 3); assert.match(p2.msg, /unknown type/);
assert.equal(checkConfigText('[1]', data).line, 1);
assert.match(checkConfigText('{ "elements": {} }', data).msg, /must be a list/);

// a bad save changes nothing; a good save is loaded straight away and the old file is kept
const ctx = { store, engine: { stopAll() { } }, hw: { restart() { } }, dataDir: data };
assert.throws(() => applyConfigText('{ nope', ctx));
assert.equal(fs.readFileSync(file, 'utf8'), loaded);
const second = JSON.stringify({ title: 'two', elements: [{ name: 'vA_A', type: 'vAPI' }, { name: 'vA_B', type: 'vAPI' }] }, null, 2);
const r = applyConfigText(second, ctx);
assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')).elements.map(e => e.name), ['vA_A', 'vA_B', 'SoundPlayer']);
assert.equal(store.config.title, 'two'); assert.ok(store.els.has('vA_B'));
assert.equal(readBackup(store, r.backup), loaded);
fs.rmSync(d, { recursive: true, force: true });
console.log('config editor tests passed');
