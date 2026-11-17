// Ctrl + Click (⌘ + Click on a Mac) opens a Heating Element method's Settings on a running Tab, and Properties in Edit layout
// (OakBarn Brewery, 2026-11-16 / 2026-11-17, Rules 6.19 and 2.9, Help 150). A plain click acts at once; double-click still opens
// Properties and finishes a hose in Edit layout. Save saves at once (admins only) and sends a new Setpoint at once.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const fr = JSON.parse(fs.readFileSync(new URL('../public/hoverhelp-fr.json', import.meta.url), 'utf8'));
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
const help = fs.readFileSync(new URL('../help/150-heating-method.md', import.meta.url), 'utf8');
const helpFr = fs.readFileSync(new URL('../help/fr/150-heating-method.md', import.meta.url), 'utf8');

const part = app.slice(app.indexOf('// Ctrl + Click opens settings (OakBarn Brewery'), app.indexOf('function updateEl(name) {'));
assert.ok(part.length > 500, 'the double-click / Ctrl + Click code is there');
// a Mac's Ctrl + Click is the right-click (Help, Rule 2.11): ⌘ there
assert.match(part, /const modClick = ev => !ev\.shiftKey && !ev\.altKey && \(IS_MAC \? ev\.metaKey : ev\.ctrlKey\);/);
// one list of what answers it on a running Tab, so other Devices can be added later
assert.match(part, /const CTRL_CLICK = \[/);
assert.match(part, /target\.closest\('\.hmBtn'\)/, 'a method button');
assert.match(part, /isMethodClone\(g\)/, 'a Method Clone opens its own method');
assert.match(part, /e\?\.type === 'picture' && e\.follow/, 'a Picture Widget that follows a Heating Element');
assert.match(part, /\.vpPart\.vp-element\[data-dev\]/, 'a Heating Element built into a Vessel Device');
// 2026-11-17 (OakBarn Brewery picked A): no double-click Settings and no click wait on a running Tab
assert.ok(!/DBL_WAIT_MS|ev\.detail >= 2|replayed/.test(app), 'a plain click acts at once again');
assert.match(part, /document\.addEventListener\('click', ev => \{/);
assert.match(part, /document\.addEventListener\('pointerdown'[\s\S]*?ev\.stopPropagation\(\); ev\.preventDefault\(\);/, 'a Ctrl + Click never presses a Push Button');
// Edit layout: Ctrl + Click = double-click = Properties; never while a pipe or hose is drawn (double-click finishes a hose, kept)
assert.match(part, /if \(editing\) \{[\s\S]*?if \(drawPts\) return;[\s\S]*?new MouseEvent\('dblclick'/);
assert.match(app, /if \(drawPts\) \{ if \(drawHose\) finishPipe\(\); else drawStraight\(ev\); return; \}/, 'double-click still finishes a hose');
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
assert.match(app, /Ctrl \+ Click \(⌘ \+ Click on a Mac\): the \$\{word\} Settings of/);
assert.ok(fr['One click: {0} heats by {1}. Ctrl + Click (⌘ + Click on a Mac): the {2} Settings of {3}, nothing turned On or Off (admins)']);
// Rules and Help
assert.match(rules, /\*\*Ctrl \+ Click opens a method's Settings on a running Tab\*\*/);
assert.match(rules, /\*\*Ctrl \+ Click\*\* \(⌘ \+ Click on a Mac\) opens Properties too, in Edit layout/);
assert.match(help, /## Ctrl \+ Click for a method's Settings/);
assert.ok(!/waits about a third of a second/.test(help));
assert.match(helpFr, /\{#ctrl-click-for-a-method-s-settings\}/);
// the hose double-click (OakBarn Brewery, 2026-11-17: "Double click to add hose is broken still brings up Brew House Tab Properties"):
// the second half of a double-click that finished a hose opens nothing more; a double-click on its start point only starts it
assert.match(app, /if \(Date\.now\(\) - pipeDoneAt < 700\) return;/);
assert.match(app, /if \(drawPts && drawHose && new Set\(drawPts\.map\(q => q\.join\(\)\)\)\.size < 2\) return;/);
assert.match(app, /function finishPipe\(to\) \{\n  pipeDoneAt = Date\.now\(\);/);
console.log('dblsettings ok');
