// Code Value Widget (OakBarn Brewery, 2026-11-08, Rule 1.27, Help 161): run from test/datawidget.test.js (node test/datawidget.test.js)
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { Store, mainProp, isDataWidget, ELEMENT_TYPES } from '../lib/store.js';
import { Engine } from '../lib/engine.js';
import { elementTopic } from '../public/helpmap.js';
import { widgetTypeId } from '../public/naming.js';
import { codeWithValue, widgetCodeText, cvDataType, hasCode } from '../public/codevalue.js';

// {value} becomes the Widget's Name.value, but not inside "quoted text"
assert.equal(codeWithValue('MB_23_10KNTC_Brew~Kettle_BR.setpoint = {value}', 'wgt_CV_Set_BR.value'), 'MB_23_10KNTC_Brew~Kettle_BR.setpoint = wgt_CV_Set_BR.value');
assert.equal(codeWithValue('x = { Value } + 1\nprint "{value}"', 'w.value'), 'x = w.value + 1\nprint "{value}"');
assert.equal(widgetCodeText({ name: 'w', code: 'a = {value}' }), 'a = w.value');
assert.equal(cvDataType({ format: 'time' }), 'time'); assert.equal(cvDataType({}), 'value'); assert.equal(cvDataType({ format: 'junk' }), 'value');
assert.equal(hasCode({ type: 'codeValueWidget', code: '  ' }), false);
assert.ok(ELEMENT_TYPES.includes('codeValueWidget'));
assert.equal(widgetTypeId({ type: 'codeValueWidget' }), 'CV');
assert.equal(elementTopic({ type: 'codeValueWidget' })[0], 'code-value-widget');

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'codev'));
fs.mkdirSync(path.join(d, 'scripts'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'gV_Kettle_SP', type: 'gGlobal', kind: 'value', initial: '0' },
  { name: 'wgt_CV_Kettle~SP_BR', type: 'codeValueWidget', label: 'Kettle SP', precision: 1, initial: 150, code: 'gV_Kettle_SP = {value}\nprint "set to " + {value}' },
  { name: 'wgt_CV_Mash_BR', type: 'codeValueWidget', label: 'Mash', format: 'time', initial: '00:10:00', code: 'gV_Kettle_SP = 1' },
  { name: 'wgt_CV_Bad_BR', type: 'codeValueWidget', label: 'Bad', code: 'No_Such_Thing = {value}' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const cv = store.get('wgt_CV_Kettle~SP_BR');
assert.ok(isDataWidget(cv)); assert.equal(mainProp(cv), 'value'); assert.equal(cv.dataType, 'value');
assert.equal(store.get('wgt_CV_Mash_BR').dataType, 'time', 'its Format');
assert.equal(String(store.getProp('wgt_CV_Mash_BR', 'value')), '00:10:00');
const engine = new Engine(store, path.join(d, 'scripts'), null);

// a person sets the Value: the Code runs once with {value} = the Value
store.setProp(cv.name, 'value', 152.34, 'ui');
const r = engine.runWidgetCode(cv.name); assert.ok(r.ok); await r.done;
assert.equal(store.getProp('gV_Kettle_SP', 'value'), 152.3, 'Decimals 1, then the code copied it');
assert.ok(engine.console.some(c => c.script === 'wgt_CV_Kettle~SP_BR (code)' && c.text === 'set to 152.3'));
assert.ok(!engine.list().some(p => p.name.includes('(code)')), 'not on the Processes list');
assert.equal(engine.running.size, 0);

// a problem in the Code: not run, the Console says why
const bad = engine.runWidgetCode('wgt_CV_Bad_BR');
assert.equal(bad.ok, false); assert.ok(engine.console.some(c => c.text.startsWith('NOT RUN - line 1')));
assert.equal(engine.runWidgetCode('gV_Kettle_SP').ok, false, 'not a Code Value Widget');

// a Process setting the Value does not run the Code (only a person does, by the panel or the .API)
store.setProp(cv.name, 'value', 160, 'script');
await new Promise(res => setTimeout(res, 50));
assert.equal(store.getProp('gV_Kettle_SP', 'value'), 152.3);
// a sleep in the Code: a new Value stops the old run; Stop All stops it
store.get('wgt_CV_Mash_BR').code = 'sleep 5000\ngV_Kettle_SP = 99';
const r1 = engine.runWidgetCode('wgt_CV_Mash_BR'), r2 = engine.runWidgetCode('wgt_CV_Mash_BR');
await r1.done; assert.equal(engine.running.size, 1, 'the new run goes on');
engine.stopAll(); await r2.done;
assert.equal(engine.running.size, 0); assert.equal(store.getProp('gV_Kettle_SP', 'value'), 152.3, 'stopped before the last line');
clearTimeout(store._persistTimer);
console.log('code value widget ok');
