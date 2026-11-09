// The Process Widget (OakBarn Brewery, 2026-11-09, Rule 1.31, Help 173): shows one Process with its state and Start / Stop, and the
// BruControl Import makes each Script element one. Run from test/bruimport.test.js (or: node --no-warnings test/processwidget.test.js).
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { Store, mainProp, ELEMENT_TYPES } from '../lib/store.js';
import { Engine } from '../lib/engine.js';
import { processState, processButton, followProcessRename, PROCESS_WIDGET_TYPE, PROCESS_WIDGET_WORD } from '../public/processwidget.js';
import { widgetTypeId, suggestWidgetName, WIDGET_TYPE_IDS } from '../public/naming.js';
import { elementTopic } from '../public/helpmap.js';
import { importBruControl, APP_WIDGETS } from '../lib/bruimport.js';

// what it shows, in plain words
assert.equal(processState('', null).word, 'No Process picked');
assert.equal(processState('Mash', null).word, 'No such Process');
assert.deepEqual(processState('Mash', { state: 'stopped' }), { word: 'Stopped', running: false });
assert.equal(processState('Mash', { state: 'running' }).word, 'Running');
assert.equal(processState('Mash', { state: 'running', waiting: true }).word, 'Waiting');
assert.equal(processState('Mash', { state: 'error', error: 'x' }).word, 'Stopped on an error');
assert.equal(processButton(processState('Mash', { state: 'running' })), '■ Stop');
assert.equal(processButton(processState('Mash', { state: 'stopped' })), '▶ Start');

// its name: wgt_PRC_Label_TabID (Rule 3.14); the Widget Type list the other changes count stays as it is
assert.equal(widgetTypeId({ type: PROCESS_WIDGET_TYPE }), 'PRC');
assert.equal(suggestWidgetName({ code: widgetTypeId({ type: PROCESS_WIDGET_TYPE }), label: 'Mash~Steps', tab: 'BR' }), 'wgt_PRC_Mash~Steps_BR');
assert.ok(!Object.keys(WIDGET_TYPE_IDS).includes(PROCESS_WIDGET_TYPE));
assert.deepEqual(elementTopic({ type: PROCESS_WIDGET_TYPE }), ['process-widget'], 'right-click Help: Help 173');

// a Process renamed with Change name: its Process Widgets follow
const els = [{ type: PROCESS_WIDGET_TYPE, process: 'Mash' }, { type: PROCESS_WIDGET_TYPE, process: 'Boil' }, { type: 'valueWidget', process: 'Mash' }];
assert.equal(followProcessRename(els, 'Mash', 'Mash_Steps'), 1);
assert.deepEqual(els.map(e => e.process), ['Mash_Steps', 'Boil', 'Mash']);

// the Brain keeps it: a Widget with no value of its own
assert.ok(ELEMENT_TYPES.includes(PROCESS_WIDGET_TYPE));
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'scrw'));
fs.mkdirSync(path.join(d, 'scripts'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'wgt_PRC_Mash_BR', type: PROCESS_WIDGET_TYPE, label: 'Mash', process: 'Mash' }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
assert.equal(store.get('wgt_PRC_Mash_BR').type, PROCESS_WIDGET_TYPE);
assert.equal(mainProp(store.get('wgt_PRC_Mash_BR')), null, 'it has no value of its own');
// what its click does: the Brain's start and stop, and the state it shows comes from the Processes list
fs.writeFileSync(path.join(d, 'scripts', 'Mash.txt'), 'sleep 30\n');
const engine = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const stateOf = () => processState('Mash', engine.list().find(x => x.name === 'Mash'));
assert.equal(stateOf().word, 'Stopped');
assert.ok(engine.start('Mash').ok);
assert.equal(stateOf().word, 'Running');
engine.stop('Mash');
await new Promise(r => setTimeout(r, 300));
assert.equal(stateOf().word, 'Stopped');

// the new BruControl Import: a Script element is a Process Widget that shows its Script (a Process of the same name later)
assert.deepEqual(APP_WIDGETS.ScriptElement, [PROCESS_WIDGET_TYPE, 'Scripts', PROCESS_WIDGET_WORD]);
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
<Devices/><Workspaces><Workspace><Name>Brew House</Name><Elements>
 <Element i:type="ScriptElement"><ID>s1</ID><Name>insp_Mash</Name><DisplayName>Mash Steps</DisplayName><UserControl>true</UserControl><ProcessID>proc-1</ProcessID><VariableName>vV</VariableName><X>10</X><Y>20</Y><Width>120</Width><Height>60</Height></Element>
 <Element i:type="ScriptElement"><ID>s2</ID><Name>insp_Boil</Name><UserControl>false</UserControl><ProcessID>proc-9</ProcessID><X>200</X><Y>20</Y><Width>120</Width><Height>60</Height></Element>
</Elements></Workspace></Workspaces>
<Processes><Process><ID>proc-1</ID><Name>scrMash</Name><Script>sleep 1</Script></Process></Processes></Configuration>`;
const r = importBruControl(xml);
const mash = r.conv.elements.find(e => e.bru?.id === 's1'), boil = r.conv.elements.find(e => e.bru?.id === 's2');
assert.equal(mash.type, PROCESS_WIDGET_TYPE); assert.equal(mash.process, 'scrMash'); assert.equal(mash.label, 'Mash Steps');
assert.match(mash.name, /^wgt_PRC_Mash~Steps_/, 'named the Skynet way (Rule 3.14)');
assert.equal(mash.bru.variable, 'vV', "BruControl's variable is kept");
assert.equal(mash.tap, undefined, 'user controlled: one click starts or stops it');
assert.equal(boil.process, '', 'a Script that is not in the file: no Process yet');
assert.equal(boil.tap, 'none', 'not user controlled in BruControl: a click does nothing (Rule 2.44)');
console.log('processwidget tests passed');
