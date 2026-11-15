// Rule 4.7 (OakBarn Brewery, 2026-11-15): a double-click that opens other Properties never loses the Build. An Add box steps aside
// and comes back with everything kept; other Properties open again; a Tab bar double-click from the Build Tab comes back to it.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
const help = fs.readFileSync(new URL('../help/55-build-tab.md', import.meta.url), 'utf8');
const fr = fs.readFileSync(new URL('../help/fr/55-build-tab.md', import.meta.url), 'utf8');

const pick = app.slice(app.indexOf('function pickerOpen('), app.indexOf('function pickerDbl('));
assert.match(pick, /String\(v\)\.startsWith\('\\0'\)/, '➕ Add new Tab… and 📁 Templates open nothing');
assert.match(pick, /if \(inDlg && d\._detour\) \{ d\._detourGo = \(\) => go\(v\); d\.close\('detour'\); return; \}/, 'an Add box steps aside, never Cancelled');
assert.ok(pick.indexOf("d.close('detour')") < pick.indexOf('confirm('), 'the Add box is not asked to be thrown away');
assert.match(pick, /comeBack\(\(\) => go\(v\), back\)/, 'other Properties: back to the Tab and the Properties you came from');
assert.match(app, /d\._back = dlgBack; d\._detour = dlgDetour; dlgBack = null; dlgDetour = false;/, 'dialog() takes the come-back hooks');
assert.match(app, /dlgBack = \(\) => \{ if \(findItem\(kind, id\)\) \{ sel = \{ kind, id \}; renderWs\(\); editItem\(kind, id\); \} \};/, 'Properties open again');
assert.match(app, /return editItem\(kind, id\);\n\}/, 'openProps waits for its dialog');
assert.match(app, /sel = null; renderTabs\(\); renderWs\(\); return editWorkspace\(\);\n\}/, 'openTabProps waits for Tab settings');

// every Add box that loops handles the detour and comes back
const dev = app.slice(app.indexOf('async function newDeviceDialog('), app.indexOf('async function newPictureDialog('));
const pic = app.slice(app.indexOf('async function newPictureDialog('), app.indexOf('async function newPictureDialog(') + 9000);
for (const [n, s] of [['Add Device', dev], ['Picture Widget', pic]]) {
  assert.match(s, /dlgDetour = true;/, `${n}: marked as an Add box`);
  assert.match(s, /if \(r === 'detour'\) \{[\s\S]*?readFields\(work, body\)[\s\S]*?await detourAndBack\(\$\('#dlg'\)\._detourGo\);[\s\S]*?continue;/, `${n}: keeps what is typed and comes back`);
}
const mf = app.slice(app.indexOf("const shown = dialog(I.what, it => mfDrillFields(it, null, true)") - 200, app.indexOf("const shown = dialog(I.what, it => mfDrillFields(it, null, true)") + 4000);
assert.match(mf, /dlgDetour = true;[\s\S]*if \(r === 'detour'\) \{[\s\S]*?await detourAndBack/, 'Manifold Add box too');
const back = app.slice(app.indexOf('async function detourAndBack('), app.indexOf('async function comeBack('));
assert.match(back, /const keep = wsName;[\s\S]*wsName = keep/, 'the Add box comes back on the Tab you were on');

// the Tab bar
assert.match(app, /onclick: \(\) => \{ if \(w\.name !== wsName\) tabLeft = \{ from: wsName, at: Date\.now\(\) \};/, 'the first click remembers the Tab it left');
const dbl = app.slice(app.indexOf('function tabDblClick('), app.indexOf('function renderTabs('));
assert.match(dbl, /\.build/, 'only from the Build Tab');
assert.match(dbl, /editWorkspace\(\)\.finally\(/, 'back after Tab settings close');

assert.match(rules, /^4\.7 \*\*A double-click never loses the Build: you always come back to it\*\*/m, 'Rule 4.7');
assert.match(help, /## Leave for a moment, come back to the Build/, 'Help 55');
assert.match(fr, /\{#leave-for-a-moment-come-back-to-the-build\}/, 'French Help 55');
console.log('buildcomeback ok');
