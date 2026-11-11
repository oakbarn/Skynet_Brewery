// node --no-warnings test/null.test.js
// NULL (OakBarn Brewery, 2026-11-11, Rule 1.32): the empty value. X = NULL empties a Process variable, a gGlobal or a Value Widget
// (its box shows blank); if X == NULL asks if it is empty; math or < > on NULL stops the Process with a plain message.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Store } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
import { toStr } from '../lib/values.js';
import { suggest } from '../public/autofill.js';
import { kindValueError } from '../public/gkinds.js';
import { PROCESS_WORDS, elementNameError } from '../public/names.js';
import { KEYWORDS, LOGIC_WORDS, CONST_WORDS, VAR_TYPES } from '../lib/engine.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpnull'));
const cfg = path.join(d, 'c.json'), data = path.join(d, 'data'), scripts = path.join(d, 'scripts');
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'Pump_1', type: 'digitalOut', label: 'Red~Pump® @ HLT' },
  { name: 'gV_Strike', type: 'gGlobal', kind: 'value', initial: 152 }, { name: 'gS_Note', type: 'gGlobal', kind: 'string', initial: 'Mash' },
  { name: 'gT_Rest', type: 'gGlobal', kind: 'time', initial: '00:10:00' }, { name: 'gB_Added', type: 'gGlobal', kind: 'bool', initial: true },
  { name: 'wgt_VAL_Strike_BH', type: 'valueWidget', dataType: 'value', initial: 5 }] }));
const wait = ms => new Promise(r => setTimeout(r, ms));
let s = new Store(cfg, data); s.load();
assert.equal(s.get('Pump_1').label, 'Red Pump HLT', 'a Label loses © ® ™, and @ ~ become a space (Rule 3.4)');
const eng = new Engine(s, scripts, { logNow() {} });
const run = async (name, src) => { eng.write(name, src); eng.start(name); await wait(250); return eng.running.get(name) ?? null; };

// 1. = NULL empties every Kind, == NULL / != NULL ask, NULL is any case
assert.deepEqual(eng.check('gV_Strike = NULL\nif gV_Strike == null\nprint "empty"\nendif\n').errors, []);
await run('Empty', 'gV_Strike = NULL\ngS_Note = Null\ngT_Rest = NULL\ngB_Added = NULL\nwgt_VAL_Strike_BH = NULL\n' +
  'new value vX = 3\nvX = NULL\nif vX == NULL\ngS_Note = "was empty"\nendif\nif gV_Strike != NULL\ngS_Note = "wrong"\nendif\n');
assert.equal(s.getProp('gV_Strike', 'value'), null); assert.equal(s.getProp('gT_Rest', 'value'), null);
assert.equal(s.getProp('gB_Added', 'value'), null); assert.equal(s.getProp('wgt_VAL_Strike_BH', 'value'), null);
assert.equal(s.getProp('gS_Note', 'value'), 'was empty');
assert.equal(toStr(null), '', 'an empty value shows blank');
assert.equal(kindValueError('gT_X', 'time', null), '', 'NULL fits every Kind');

// 2. it stays empty after a restart, and setting it again fills it
s.persistNow();
s = new Store(cfg, data); s.load();
assert.equal(s.getProp('gV_Strike', 'value'), null, 'a saved NULL stays empty');
const e2 = new Engine(s, scripts, { logNow() {} });
e2.write('Fill', 'gV_Strike = 150\n'); e2.start('Fill'); await wait(250);
assert.equal(s.getProp('gV_Strike', 'value'), 150);

// 3. math, += and < > on NULL stop the Process with a plain message
for (const src of ['gV_Strike = NULL\ngV_Strike = gV_Strike + 5\n', 'gV_Strike = NULL\ngV_Strike += 1\n', 'gV_Strike = NULL\nif gV_Strike > 3\nprint "x"\nendif\n',
  'new value vY\nvY = NULL\nvY = vY * 2\n', 'gV_Strike = 5 - NULL\n']) {
  e2.write('Bad', src); e2.start('Bad'); await wait(250);
  assert.match(e2.status.get('Bad').error ?? '', /is NULL \(empty\)/, src);
}

// 4. a Device can't be empty
e2.write('Dev', 'Pump_1 = NULL\n'); e2.start('Dev'); await wait(250);
assert.equal(s.getProp('Pump_1', 'state'), false);
assert.match(e2.status.get('Dev').error, /can't be NULL/);

// 5. the editor knows NULL
const at = line => (suggest(line, { elements: [] }, '', '', true)?.list ?? []).map(i => i.text);
assert.ok(at('gV_Strike = NU').some(t => /NULL/.test(t)), 'Predictive Text offers NULL');

// 6. the reserved words (Help 22) are the engine's words, and none can be a name
assert.deepEqual([...PROCESS_WORDS].sort(), [...new Set([...KEYWORDS, ...LOGIC_WORDS, ...Object.keys(CONST_WORDS), ...VAR_TYPES, 'now', 'true', 'false', 'tab', 'workspace'])].sort());
assert.match(elementNameError('NULL'), /word of the Process language/); assert.match(elementNameError('wait', 'gGlobal'), /can't be a gGlobal name/);
assert.equal(elementNameError('Null_1'), '');
console.log('null tests ok');
