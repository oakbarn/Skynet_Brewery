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
assert.ok(!app.includes('SET_WIRE_TIP'), 'the Rule 18.40 greyed Interface line is gone (Rule 18.46)');
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

// Dialog Sandbox cleanup (OakBarn Brewery, 2026-11-18)
// 1. Rule 2.54 on every dialog: Delete · Save · Close · ✕ together at the right of the frozen top; Cancel is called Close
const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const dlg = html.slice(html.indexOf('<dialog id="dlg">'), html.indexOf('</dialog>', html.indexOf('<dialog id="dlg">')));
const grp = dlg.slice(dlg.indexOf('dlgBtnGroup'), dlg.indexOf('</span>', dlg.indexOf('dlgBtnGroup')));
const order = ['dlgDelete', 'value="ok"', 'dlgClose', 'dlgX'].map(k => grp.indexOf(k));
assert.ok(order.every((v, i) => v > 0 && (i === 0 || v > order[i - 1])), 'Properties: Delete · Save · Close · ✕ in that order');
assert.ok(!/>Cancel</.test(dlg), 'no Cancel on the Properties box');
assert.match(app, /cancels = \$\$\('#dlg \.dlgClose'\)/, 'the Add box renames Close only, never the ✕');
assert.ok(!app.includes("b.textContent = '✖ Cancel'"), 'the Add box says Close');
const ob = app.slice(app.indexOf('function orderDialogButtons('), app.indexOf('const showModalPlain'));
assert.match(ob, /\[del, save, undo, close\]\.filter\(Boolean\), x\)/, 'every other dialog: Delete · Save · Undo · Close · ✕');
assert.match(ob, /close\.textContent = 'Close'/);
assert.match(ob, /class: 'frozenHead'/, 'buttons only at the bottom go up into a frozen top row');
assert.match(app, /try \{ orderDialogButtons\(this\); \}/, 'run on every dialog when it opens');
assert.match(css, /\.dlgBtnGroup \{ display: inline-flex;/);
const { isCancelButton } = await import('../public/labelguard.js');
assert.ok(isCancelButton({ dataset: {}, textContent: 'Close' }) && isCancelButton({ dataset: {}, textContent: '✕', classList: { contains: c => c === 'boxX' } }), 'Close and ✕ let the user out (Rule 18.28)');
// 2 + 3. Rule 18.46: a greyed box shows only the ⛔, no Hover Help and no "how to unlock" text
const hh = await import('../public/hoverhelp.js');
const box = (disabled, extra = {}) => ({ matches: q => q === hh.GREY_FIELD || (q === ':disabled' && disabled), closest: () => null, dataset: {}, ...extra });
const nameOf = b => ({ nextElementSibling: b, matches: q => /label/.test(q), classList: { contains: () => false } });
assert.ok(hh.greyedName(nameOf(box(true))), 'the name of a greyed box: no balloon');
assert.ok(!hh.greyedName(nameOf(box(false))), 'the name of an open box keeps its balloon');
assert.ok(!hh.greyedName(nameOf(box(true, { closest: () => ({}) }))), 'a form shown to look at only keeps its Hover Help');
assert.ok(!hh.greyedName(nameOf(box(true, { dataset: { greyHelp: '1' } }))), 'a box named as a text dialog keeps its text');
for (const t of ['Autosize to pipe is on: switch it off', 'Pick what it turns on with first', 'CONFIRMED_WIRE_TIP', "out[0].title = x.grey"]) assert.ok(!app.includes(t), 'gone: ' + t);
assert.match(app, /if \(ev\.target === out\[0\] && !greyedName\(out\[0\]\)\)/, 'no tap pop-up on a greyed name either');
// 4. Rule 18.47: Layer Order under the Tab on a dialog in the Blichmann numbered order
const wl = app.slice(app.indexOf('function withLayer('), app.indexOf('function fieldsFor('));
assert.match(wl, /\/\^\\d\+\\\. Tab\$\//, 'a numbered Tab (2. Tab, 3. Tab)');
assert.match(rules, /^18\.46 \*\*A greyed out box shows only the ⛔, and only on hover\*\*/m);
assert.match(rules, /^18\.47 \*\*A dialog brought to the Blichmann Model keeps the Model's layout and order\*\*/m);
assert.match(help, /Delete · Save · Undo · Close · ✕/);
console.log('dialog sandbox cleanup tests passed');
