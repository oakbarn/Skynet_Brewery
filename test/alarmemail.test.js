// Alarm Email Notification (OakBarn Brewery, 2026-11-09, Rule 7.17): an Alarm going off sends one email through the mail server the
// user picked (Settings > Sending codes); at most one a minute; typed addresses or every user's own; the Importer keeps the switch.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { alarmRecipients, alarmSubject, watchAlarmEmails } from '../lib/alarmemail.js';
import { importBruControl } from '../lib/bruimport.js';

const users = [{ contact: { email: 'brewer@gmail.com' } }, { contact: { email: '' } }, { contact: { email: 'brewer@gmail.com' } }];
assert.deepEqual(alarmRecipients({ emailTo: 'a@b.com; c@d.org, not-an-address' }, users), ['a@b.com', 'c@d.org']);
assert.deepEqual(alarmRecipients({ emailTo: '' }, users), ['brewer@gmail.com'], 'empty = every user with an email, once each');
assert.equal(alarmSubject({ name: 'alm_Boil', label: 'Boil over' }, 'Skynet'), 'Skynet alarm: Boil over');

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'almmail'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [], elements: [
  { name: 'alm_Boil', type: 'alarm', label: 'Boil over', emailNotify: true, emailTo: 'me@gmail.com' },
  { name: 'alm_Quiet', type: 'alarm' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const sent = [], logs = []; let t = 0;
watchAlarmEmails(store, { send: async (to, subject) => { sent.push([to, subject]); }, users: () => users, title: () => 'Skynet', log: x => logs.push(x), now: () => t });
const tick = () => new Promise(r => setTimeout(r, 5));
store.setProp('alm_Boil', 'active', true); await tick();
assert.deepEqual(sent, [['me@gmail.com', 'Skynet alarm: Boil over']]);
store.setProp('alm_Boil', 'active', false); store.setProp('alm_Boil', 'active', true); await tick();
assert.equal(sent.length, 1, 'at most one a minute');
t += 61000; store.setProp('alm_Boil', 'active', false); store.setProp('alm_Boil', 'active', true); await tick();
assert.equal(sent.length, 2);
store.setProp('alm_Quiet', 'active', true); await tick();
assert.equal(sent.length, 2, 'Email Notification off: no email');
store.setProp('alm_Quiet', 'active', false); store.setProp('alm_Quiet', 'email', true); store.setProp('alm_Quiet', 'active', true); await tick();
assert.deepEqual(sent[2], ['brewer@gmail.com', 'Skynet alarm: alm_Quiet'], 'a Process turned it on: every user with an email');
assert.ok(logs.some(l => l.includes('email sent to me@gmail.com')));

// the Importer keeps BruControl's EmailNotification switch
const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><Devices/>
<Workspaces><Workspace><Name>Brew House</Name><Elements>
 <Element i:type="AlarmElement"><ID>a1</ID><Name>Boil Alarm</Name><X>0</X><Y>0</Y><Width>50</Width><Height>50</Height><EmailNotification>true</EmailNotification><DigitalOutputID>00000000-0000-0000-0000-000000000000</DigitalOutputID></Element>
 <Element i:type="AlarmElement"><ID>a2</ID><Name>Other Alarm</Name><X>100</X><Y>0</Y><Width>50</Width><Height>50</Height><EmailNotification>false</EmailNotification></Element>
</Elements></Workspace></Workspaces><Processes/></Configuration>`;
const r = importBruControl(xml), els = r.conv.elements;
assert.equal(els.find(e => e.bru?.name === 'Boil Alarm').emailNotify, true);
assert.equal(els.find(e => e.bru?.name === 'Other Alarm').emailNotify, undefined);
assert.ok(JSON.stringify(r).includes('Email Notification on'), 'the Import notes list it');
clearTimeout(store._persistTimer);
console.log('alarm email tests passed');
