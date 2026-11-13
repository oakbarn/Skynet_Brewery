// Rule 2.52 (OakBarn Brewery, 2026-11-13, PDF "Blickmann Rip Tide Mode"): in Build mode (Edit layout) the ☰ Menu is greyed out,
// dialogs have no ☰ and never two, the Edit layout bar is greyed out while a dialog is open, and Label Attributes shows the defaults
// that are set, with Cancel and Save at the top only.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');

const menu = app.slice(app.indexOf('function addDialogMenu('), app.indexOf('function freezeDialogTop('));
assert.match(menu, /:scope > \.dlgHead > \.dlgMenu/, 'a ☰ already in the frozen top counts, so a dialog shown again never gets two');
assert.match(menu, /if \(editing\) \{ for \(const m of mine\) m\.remove\(\); return; \}/, 'no ☰ on a dialog in Build mode');
assert.match(app, /\$\('#menuBtn'\)\.onclick = ev => \{ ev\.stopPropagation\(\); if \(editing\)/, 'the Menu Bar ☰ does nothing in Build mode');
assert.match(app.slice(app.indexOf('function menuButton('), app.indexOf('function addDialogMenu(')), /if \(editing\) \{ closeMenuList\(\); closeMenuCopies\(\); return toast\(MENU_BUILD_MSG\)/, 'the Tabs bar ☰ too');
assert.match(app, /document\.body\.classList\.toggle\('buildMode', on\)/, 'Edit layout sets Build mode');
assert.match(css, /body\.buildMode \.menuBtn \{ opacity: \.35/, '☰ greyed out');
assert.match(css, /body\.buildMode:has\(dialog\[open\]\) #editBar \{[^}]*pointer-events: none/, 'Edit layout bar greyed out while a dialog is open');
const pop = app.slice(app.indexOf('const LABEL_POP = '), app.indexOf('const LABEL_POP = ') + 400);
assert.match(pop, /noBottom: true/, 'Label Attributes: Cancel and Save at the top only');
assert.match(pop, /labelDefaultLook\(o\)/, 'Label Attributes fills Font and colors from the defaults');
const look = app.slice(app.indexOf('const labelDefaultLook = '), app.indexOf('const labelDefaultAlign = '));
assert.match(look, /firstSet\(T\.labelFont, D\.nameFont\)/, 'the Font the Tab draws with');
assert.match(look, /firstSet\(o\.foreColor, T\.labelFore, D\.foreColor\)/, 'the Fore Color the Tab draws with');
assert.match(look, /firstSet\(o\.backColor, T\.labelBack, D\.backColor\)/, 'the Back Color the Tab draws with');
assert.match(app, /d\.append\(h\('h3', \{\}, title\), bar\(\), body, \.\.\.\(bottom \? \[bar\(\)\] : \[\]\)\)/, 'a layer dialog can leave out its bottom row');
assert.match(rules, /^2\.52 \*\*Build mode: only what works while building\*\*/m, 'Rule 2.52');
console.log('buildmode ok');
