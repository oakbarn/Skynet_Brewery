// 🐞 Report a problem (Rule 2.61): the Panel fills GitHub's issue forms from the address, so the box ids it fills must stay in the forms.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { reportUrl, reportMail, browserName, REPORT_REPO, SUPPORT_EMAIL } from '../public/report.js';
const form = f => readFileSync(new URL('../.github/ISSUE_TEMPLATE/' + f, import.meta.url), 'utf8');
const ids = t => new Set([...t.matchAll(/^\s+id:\s*(\S+)/gm)].map(m => m[1]));
const bug = form('bug_report.yml'), fr = form('french_translation.yml');
for (const id of ['version', 'where', 'browser']) assert.ok(ids(bug).has(id), `bug_report.yml has the box ${id}`);
for (const id of ['version', 'page', 'browser']) assert.ok(ids(fr).has(id), `french_translation.yml has the box ${id}`);
assert.match(fr, /Français/); assert.match(fr, /restent en anglais/);
assert.equal(REPORT_REPO, JSON.parse(readFileSync(new URL('../version.json', import.meta.url), 'utf8')).repo);
const u = new URL(reportUrl('bug', { version: 'V1', where: 'Brew House', browser: 'Windows, Edge' }));
assert.equal(u.pathname, `/${REPORT_REPO}/issues/new`);
assert.equal(u.searchParams.get('template'), 'bug_report.yml');
assert.equal(u.searchParams.get('version'), 'V1'); assert.equal(u.searchParams.get('where'), 'Brew House');
const f = new URL(reportUrl('fr', { page: '104-brew-pumps' }));
assert.equal(f.searchParams.get('template'), 'french_translation.yml'); assert.equal(f.searchParams.get('page'), '104-brew-pumps');
assert.ok(!f.searchParams.has('version'), 'an empty box is left out');
assert.ok(reportMail('bug', { version: 'V1' }).startsWith(`mailto:${SUPPORT_EMAIL}?subject=`));
assert.match(decodeURIComponent(reportMail('bug', { version: 'V1' })), /Skynet version: V1/);
assert.equal(browserName('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'), 'iPhone, Safari');
assert.equal(browserName('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36 Edg/120'), 'Windows, Edge');
// the buttons are there
for (const p of ['public/help.html', 'public/index.html']) assert.match(readFileSync(new URL('../' + p, import.meta.url), 'utf8'), /id="hpReport"/, p);
assert.match(readFileSync(new URL('../public/app.js', import.meta.url), 'utf8'), /🐞 Report a problem/);
console.log('report tests passed');
