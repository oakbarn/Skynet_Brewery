// Every dialog follows the Blichmann Model (OakBarn Brewery, 2026-11-18: "Start checking ALL Dialogs to conform to the Blickmann Model";
// "I prefer the do not enter icon to the Hover Read on greyed fields"; "Keep Dialogs Clean"; Rule 18.44, Help 148).
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
// every Properties and Add box: frozen top, no bottom row, as wide as the Pump's
assert.match(css, /dialog#dlg \{ width: min\(680px, 94vw\); padding-top: 0;/, 'every Properties box is as wide as the Pump\'s');
assert.match(css, /dialog#dlg \.dlgHead \{ position: sticky; top: 0;/, 'its top is frozen');
assert.match(css, /dialog#dlg \.dlgBottomBar \{ display: none; \}/, 'no bottom row');
// every pop-up: frozen, Keep when opened from a dialog
assert.match(app, /const onModelDialog = \(\) => !!document\.querySelector\('dialog#dlg\[open\]'\);/);
const lay = app.slice(app.indexOf('function layerDialog('), app.indexOf('async function pickCoverColor('));
assert.match(lay, /else d\.append\(h\('div', \{ class: 'miniHead' \}, h\('h3', \{\}, title\), bar\(\)\), body\);/, 'every pop-up builds the frozen head');
assert.ok(!/\.\.\.\(bottom \? \[bar\(\)\] : \[\]\)/.test(lay), 'no bottom row on any pop-up');
assert.match(css, /\.miniDlg \.miniHead \{ position: sticky; top: 0;/);
// any other dialog with the same buttons at the top and the bottom
const fz = app.slice(app.indexOf('function freezeDupBars('), app.indexOf('function freezeDialogTop('));
assert.match(fz, /words\(top\) !== words\(last\)/, 'only a true copy of the top row is hidden');
assert.match(fz, /last\.classList\.add\('dupBottom'\); d\.classList\.add\('frozenDlg'\)/);
assert.match(app, /if \(d\.id !== 'dlg'\) return freezeDupBars\(d\);/);
assert.match(css, /dialog \.dupBottom \{ display: none; \}/);
// ⛔ on a greyed box, no hover read
assert.match(css, /dialog :is\(input, select, textarea\):disabled:not\(\[type="checkbox"\][^)]*\):not\(fieldset:disabled \*\)/, 'the Do Not Enter sign on greyed boxes in dialogs');
assert.match(css, /#menuPane :is\(input, select, textarea\):disabled/, 'and on the ☰ Menu tabs');
assert.ok(css.includes("fill='%23d62828'"), 'a red sign');
assert.ok(!app.includes("title: 'Not editable'") && !app.includes("title: 'Read only'"), 'no "Read only" hover read');
assert.ok(!app.includes("i.title = 'Set when it was added: the board and pin it is wired to'"), 'no "Set when it was added" hover read');
assert.ok(app.includes("const SET_WIRE_TIP = 'The Interface and Port combination is saved"), 'OakBarn Brewery\'s own Hover Help on the greyed Interface stays (Rule 18.40)');
// short names, X Y Width Height on one line (cleanFields, so every dialog)
const cf = app.slice(app.indexOf('function cleanFields('), app.indexOf('function bindForm('));
assert.match(cf, /\[\^\(\)\]\{14,\}/, 'a ( ) explanation of 14 letters or more goes into the Hover Help');
assert.match(cf, /'x,y,w,h'/, 'X, Y, Width and Height merged');
assert.match(cf, /pairCls: 'xywh', with: \[short\(four\[1\], 'Y \(Vertical\)'\), short\(four\[2\], 'Width'\), short\(four\[3\], 'Height'\)\]/);
assert.match(app, /if \(x\.pairCls === 'xywh' && autoSized\(obj\)\)/, 'Autosize to pipe still greys Width and Height');
// the Rule and the Help
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
assert.match(rules, /^18\.44 \*\*Every dialog follows the Blichmann Model\*\*/m);
const help = fs.readFileSync(new URL('../help/148-every-device-dialog.md', import.meta.url), 'utf8');
assert.match(help, /## Every dialog, the same way/);
assert.match(help, /⛔ = can not be changed here/);
console.log('dialogmodel tests passed');
// every box has Hover Help (Rules 18.42, 18.44): the boxes that had none get FIELD_TIPS, greyed parts go by their name
assert.match(app, /const FIELD_TIPS = \{/);
for (const k of ['name', 'workspace', 'locked', 'backpath', 'foreColor', 'kind', 'sound', 'precision', 'onText', 'volume', 'deadspace', 'flowColor', 'size', 'imageOverlay'])
  assert.match(app, new RegExp(`\\n  ${k}: '`), 'Hover Help for ' + k);
assert.match(cf, /const t = \(f\[2\] === 'ro' \|\| f\[2\] === 'info' \? labelTipOf\(f\[1\]\) : ''\) \|\| fieldTipOf\(f\[0\]\)/, 'only a box with no Hover Help of its own gets one');
assert.match(app, /'data-help': RGB_ROW_TIP/, 'the Color (RGB) row');
assert.ok(app.includes('⟪img:help_pictures/Label_Visible_Switch.png⟫On: its Label shows on the Tab.'), 'with pictures');
const fr = JSON.parse(fs.readFileSync(new URL('../public/hoverhelp-fr.json', import.meta.url), 'utf8'));
assert.ok(fr['The color of all its text.'], 'and in French');
assert.ok(fs.existsSync(new URL('../media/help_pictures/Greyed_Do_Not_Enter.png', import.meta.url)), 'the ⛔ picture in Help 148');
console.log('dialog hover help tests passed');
