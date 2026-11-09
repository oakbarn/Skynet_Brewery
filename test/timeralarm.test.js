// The Timer Alarm Chain in the BruControl Import (Rule 7.16): a Timer's 2 TimerAlarms are joined to their Alarms.
import assert from 'node:assert/strict';
import { importBruControl } from '../lib/bruimport.js';

const ta = (id, on, at) => `<TimerAlarm><AlarmID>${id}</AlarmID><Enabled>${on}</Enabled><Threshold>${at}</Threshold></TimerAlarm>`;
const timer = (id, name, alarms) => `<Element i:type="TimerElement"><ID>${id}</ID><Name>${name}</Name><X>0</X><Y>0</Y><Width>50</Width><Height>50</Height><Type>CountDown</Type><Alarms>${alarms}</Alarms></Element>`;
const alarm = (id, name) => `<Element i:type="AlarmElement"><ID>${id}</ID><Name>${name}</Name><X>100</X><Y>0</Y><Width>50</Width><Height>50</Height></Element>`;
const Z = '00000000-0000-0000-0000-000000000000';
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><Devices/>
<Workspaces><Workspace><Name>Brew House</Name><Elements>
 ${timer('t1', 'Boil Timer', ta('a1', true, 'PT1H') + ta('a1', true, 'PT15M'))}
 ${timer('t2', 'Mash Timer', ta('a2', true, 'PT0S') + ta(Z, false, 'PT0S'))}
 ${timer('t3', 'Spare Timer', ta('a3', false, 'PT5M') + ta('a1', true, 'PT2M'))}
 ${alarm('a1', 'Hop Drop')}${alarm('a2', 'Mash Done')}${alarm('a3', 'Unused')}
</Elements></Workspace></Workspaces><Processes/></Configuration>`;
const r = importBruControl(xml, { names: 'bru' }), els = r.conv.elements;
const by = n => els.find(e => e.bru?.name === n);
const hop = by('Hop Drop'), mash = by('Mash Done'), unused = by('Unused');
assert.equal(hop.kind, 'hop'); assert.equal(hop.timer, by('Boil Timer').name);
assert.equal(hop.at, '01:00:00', 'the first time is the Alarm\'s own time');
assert.deepEqual(hop.chain, [{ label: 'At 00:15:00', at: '00:15:00' }], 'the second time is a step on its Alarm Chain');
assert.equal(mash.timer, by('Mash Timer').name); assert.equal(mash.at, '00:00:00'); assert.equal(mash.chain, undefined);
assert.equal(unused.timer, undefined, 'a TimerAlarm that is off is not joined');
const notes = JSON.stringify(r);
assert.ok(notes.includes('Timer alarm(s) joined'), 'the notes list what was joined');
assert.ok(notes.includes('already on'), 'an Alarm already on another Timer is listed to join by hand');
console.log('timer alarm tests passed');
