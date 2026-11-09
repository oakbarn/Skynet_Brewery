// Time and DateTime formats (Rule 2.45): Time / DateTime Widgets and Timers pick how their time shows; BruControl Formats carry over.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { formatTime, formatDateTime, bruTimeFormat, formatChoices, TIME_FORMATS } from '../public/timeformat.js';
import { timerDigits } from '../public/styles.js';
import { Store } from '../lib/store.js';
import { importBruControl } from '../lib/bruimport.js';

assert.equal(formatTime('01:30:05', ''), '01:30:05', 'empty = the standard look');
assert.equal(formatTime('01:30:05', 'hh:mm'), '01:30');
assert.equal(formatTime('01:30:05', 'h:mm:ss'), '1:30:05');
assert.equal(formatTime('01:30:05', 'mm:ss'), '90:05', 'the biggest unit holds the whole time');
assert.equal(formatTime('01:30:05', 'mm'), '90');
assert.equal(formatTime('01:30:05', 'ss'), '5405');
assert.equal(formatTime('26:00:00', 'd.hh:mm:ss'), '1.02:00:00');
assert.equal(formatTime('-00:01:30', 'mm:ss'), '-01:30');
assert.equal(formatTime('00:10:00', "mm' min'"), '10 min', 'quoted text shows as typed');
assert.equal(formatDateTime('11/09/2026 14:30:05', ''), '11/09/2026 14:30:05');
assert.equal(formatDateTime('11/09/2026 14:30:05', 'ddd h:mm tt'), 'Mon 2:30 PM');
assert.equal(formatDateTime('11/09/2026 00:05:00', 'h:mm tt'), '12:05 AM');
assert.equal(formatDateTime('11/09/2026 14:30:05', 'dddd, MMMM d, yyyy'), 'Monday, November 9, 2026');
assert.equal(formatDateTime('11/09/2026 14:30:05', 'yyyy-MM-dd HH:mm'), '2026-11-09 14:30');
assert.equal(bruTimeFormat('hh\\:mm\\:ss'), 'hh:mm:ss', "BruControl's \\ before a sign is dropped");
assert.equal(formatChoices(TIME_FORMATS, 'm:ss').at(-1)[0], 'm:ss', 'a typed or imported format joins the list');
assert.equal(timerDigits('00:45:10', { format: 'mm:ss' }), '45:10', 'a Timer takes the same formats');
assert.equal(timerDigits('00:45:10', { format: 'hm' }), '00:45', 'the old hh:mm pick still works');

// a Process sets any format with .showas; "" puts back the Properties' pick
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'tmfmt'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [], elements: [
  { name: 'wgt_TM_Boil_BR', type: 'timeWidget', dataType: 'time', showAs: 'mm:ss' },
  { name: 'tm_Boil', type: 'timer', timerFormat: 'hm' },
  { name: 'wgt_VAL_Gal_BR', type: 'valueWidget', dataType: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
assert.equal(store.getProp('wgt_TM_Boil_BR', 'showas'), 'mm:ss');
store.setProp('wgt_TM_Boil_BR', 'showas', 'h:mm:ss'); assert.equal(store.getProp('wgt_TM_Boil_BR', 'showas'), 'h:mm:ss');
store.setProp('wgt_TM_Boil_BR', 'showas', ''); assert.equal(store.getProp('wgt_TM_Boil_BR', 'showas'), 'mm:ss');
assert.equal(store.getProp('tm_Boil', 'showas'), 'hm');
assert.throws(() => store.setProp('wgt_VAL_Gal_BR', 'showas', 'mm'), /shows no time/);
clearTimeout(store._persistTimer);

// the Importer: a Timer's Format, and a time Global's Format rides along in the Globals list
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><Devices/>
<Workspaces><Workspace><Name>Brew House</Name><Elements>
 <Element i:type="TimerElement"><ID>t1</ID><Name>Boil Timer</Name><X>0</X><Y>0</Y><Width>50</Width><Height>50</Height><Format>mm\\:ss</Format><Type>CountDown</Type></Element>
 <Element i:type="TimerElement"><ID>t2</ID><Name>Mash Timer</Name><X>0</X><Y>60</Y><Width>50</Width><Height>50</Height><Format></Format><Type>CountUp</Type></Element>
 <Element i:type="GlobalVariableElement"><ID>g1</ID><Name>gblT_Left</Name><X>100</X><Y>0</Y><Width>50</Width><Height>50</Height><Format>mm</Format><VariableType>TimeSpan</VariableType></Element>
 <Element i:type="GlobalVariableElement"><ID>g2</ID><Name>Clock</Name><X>100</X><Y>60</Y><Width>50</Width><Height>50</Height><Format></Format><VariableType>DateTime</VariableType></Element>
</Elements></Workspace></Workspaces><Processes/></Configuration>`;
const r = importBruControl(xml, { names: 'bru' }), els = r.conv.elements;
assert.equal(els.find(e => e.bru?.name === 'Boil Timer').timerFormat, 'mm:ss');
assert.equal(els.find(e => e.bru?.name === 'Mash Timer').timerFormat, undefined, 'an empty Format keeps the standard look');
const find = o => (o && typeof o === 'object') ? (Array.isArray(o.globals) ? o.globals : Object.values(o).map(find).find(Boolean)) : undefined;
const g = Object.fromEntries(find(r).map(x => [x.name, x]));
assert.deepEqual([g.gblT_Left.widget, g.gblT_Left.showAs], ['timeWidget', 'mm'], 'a Time Global will be a Time Widget with its Format');
assert.deepEqual([g.Clock.widget, g.Clock.showAs], ['dateTimeWidget', undefined]);
console.log('time format tests passed');
await import('./gaugesettings.test.js');
