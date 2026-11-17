// Double-click or Ctrl + Click opens a method's Settings on a running Tab (OakBarn Brewery, 2026-11-16, Rule 6.19, Help 150):
// "single click turn on, double click brings up property dialog (turns nothing on or off". On a Heating Element's method buttons and
// its picture a single click waits DBL_WAIT_MS, then acts as always; a second click (or Ctrl / ⌘ + Click) opens the Settings and
// turns nothing On or Off. Save saves at once (admins only) and sends a new Setpoint at once.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const fr = JSON.parse(fs.readFileSync(new URL('../public/hoverhelp-fr.json', import.meta.url), 'utf8'));
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
const help = fs.readFileSync(new URL('../help/150-heating-method.md', import.meta.url), 'utf8');
const helpFr = fs.readFileSync(new URL('../help/fr/150-heating-method.md', import.meta.url), 'utf8');

const part = app.slice(app.indexOf('// Ctrl + Left Click opens settings on a running Tab'), app.indexOf('function updateEl(name) {'));
assert.ok(part.length > 500, 'the double-click / Ctrl + Click code is there');
// a Mac's Ctrl + Click is the right-click (Help, Rule 2.11): ⌘ there
assert.match(part, /const ctrlClick = ev => !editing && !ev\.shiftKey && !ev\.altKey && \(IS_MAC \? ev\.metaKey : ev\.ctrlKey\);/);
// one list of what answers it, so other Devices can be added later
assert.match(part, /const CTRL_CLICK = \[/);
assert.match(part, /isMethodClone\(g\)/, 'a Method Clone opens its own method');
assert.match(part, /e\?\.type === 'picture' && e\.follow/, 'a Picture Widget that follows a Heating Element');
assert.match(part, /\.vpPart\.vp-element\[data-dev\]/, 'a Heating Element built into a Vessel Device');
// caught on the document before the Tab's own clicks; a single click waits, then is played again
assert.match(part, /const DBL_WAIT_MS = 350;/);
assert.match(part, /document\.addEventListener\('click', ev => \{/);
assert.match(part, /if \(ctrlClick\(ev\) \|\| ev\.detail >= 2\)/, 'Ctrl + Click or the second click opens the Settings');
assert.match(part, /replayed\.add\(again\); target\.isConnected && target\.dispatchEvent\(again\);/, 'no second click: the single click acts as always');
assert.match(part, /document\.addEventListener\('pointerdown'[\s\S]*?ev\.stopPropagation\(\); ev\.preventDefault\(\);/, 'a Ctrl + Click never presses a Push Button');
// the Settings: admins only, frozen top with Save, saved at once, a new Setpoint sent at once
const now = part.slice(part.indexOf('async function methodSettingsNow('));
assert.match(now, /if \(!can\('admin'\)\) return toast\(/);
assert.match(now, /\{ model: true, saveNow: true \}/);
assert.match(now, /for \(const key of methodSetKeys\(k\)\)/, 'only that method\'s settings change');
assert.match(now, /await saveElements\(/);
assert.match(now, /setProp\(name, 'target', sp\)/);
assert.ok(!/setProp\(name, 'state'|setProp\(name, 'method'/.test(now), 'nothing turned On or Off, the method never switched');
assert.match(app, /model && !saveNow \? '💾 Keep' : '💾 Save'/);
// the method buttons' balloon says so, with its French
assert.match(app, /Double-click \(or Ctrl \+ Click, ⌘ \+ Click on a Mac\): the \$\{word\} Settings of/);
assert.ok(fr['One click: {0} heats by {1}. Double-click (or Ctrl + Click, ⌘ + Click on a Mac): the {2} Settings of {3}, nothing turned On or Off (admins)']);
// Rules and Help
assert.match(rules, /\*\*Double-click or Ctrl \+ Click on a running Tab opens a method's Settings\*\*/);
assert.match(help, /## Double-click for a method's Settings/);
assert.match(help, /waits about a third of a second/);
assert.match(helpFr, /\{#double-click-for-a-method-s-settings\}/);
console.log('dblsettings ok');
