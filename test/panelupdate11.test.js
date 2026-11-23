// Panel Update 11 (OakBarn Brewery, 2026-11-23): the Process Editor top. Item 1a the Simulator bar is off there, 1c the second row
// (Find, Find in All Processes, Go To, Insert Line After and the five command buttons, then Undo, Save, Close), 1d //Created on, and
// every icon on 250,250,250 white (Rule 2.70, 10.7, 16.13).
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const html = read('public/index.html'), app = read('public/app.js'), css = read('public/style.css');
const { CONDITIONALS, SKYNET_SPECIAL, COMMON, CATEGORY_LISTS, commandText, lineAfter, lineOf } = await import('../public/procinsert.js');
const { COMMANDS } = await import('../public/autofill.js');

// 1c: the second row in his order, then Undo, Save and Close at the right (1e)
const row2 = html.slice(html.indexOf('<div class="bar procRow2'), html.indexOf('<div id="insBar"'));
const order = ['findBtn', 'findAllBtn', 'goLine', 'goKind', 'goWhere', 'insAfter', 'data-cat="cond"', 'data-cat="skn"', 'data-cat="dev"', 'data-cat="wgt"', 'data-cat="com"', 'editUndo', 'saveScript"', 'procClose']
  .map(k => row2.indexOf(k.startsWith('data-') ? k : `id="${k}`));
assert.ok(order.every(i => i > 0) && order.every((v, i) => !i || v > order[i - 1]), 'second row order ' + order);
assert.match(row2, />Insert Line After</);
assert.match(row2, /id="findAllBtn"[^>]*class="icoBtn findAll"[^>]*><img src="icons\/Find_All\.png"/, 'Find in All Processes is an icon');
assert.ok(fs.existsSync(new URL('../public/icons/Find_All.png', import.meta.url)));
// the other buttons left the row but stay for the ☰ Menu
const extras = row2.slice(row2.indexOf('id="procExtras"'));
for (const id of ['scriptName', 'updVersion', 'addSteps', 'scriptAutoRestart', 'suggestBtn', 'picPick', 'saveAs', 'colorsOn']) assert.ok(extras.includes(`id="${id}"`), id + ' kept hidden for the ☰ Menu');
assert.match(css, /\.procExtras \{ display: none !important; \}/);
assert.match(app, /const procShown = b => b\.closest\('#procExtras'\)/, 'the ☰ Menu still lists them');
// the rows span the page, above the Process list
assert.ok(html.indexOf('<div class="procHead">') < html.indexOf('<aside class="scriptList">'));

// the command lists: every command is in exactly one list (else if = elseif)
const all = [...CONDITIONALS, ...SKYNET_SPECIAL, ...COMMON];
assert.equal(new Set(all).size, all.length, 'no command in two lists');
for (const [c] of COMMANDS) assert.ok(all.includes(c) || c === 'else if', c + ' is on a button');
assert.deepEqual(Object.keys(CATEGORY_LISTS), ['cond', 'skn', 'com']);
assert.ok(COMMON.includes('sleep') && COMMON.includes('print') && !COMMON.includes('if'));
assert.equal(commandText('endif'), 'endif'); assert.equal(commandText('if'), 'if '); assert.equal(commandText('new gGlobalValue'), 'new gGlobalValue gV_');

// Insert Line After: a new line after line n, with its indent; 0 = the top; past the end = the end
const code = 'a = 1\n  b = 2\nc = 3';
let r = lineAfter(code, 2, 'sleep 1');
assert.equal(code.slice(0, r.at) + r.text + code.slice(r.at), 'a = 1\n  b = 2\n  sleep 1\nc = 3'); assert.equal(r.line, 3);
r = lineAfter(code, 0, 'if ');
assert.equal(code.slice(0, r.at) + r.text + code.slice(r.at), 'if \na = 1\n  b = 2\nc = 3'); assert.equal(r.caret, 3);
r = lineAfter(code, 99, 'endif');
assert.equal(code.slice(0, r.at) + r.text + code.slice(r.at), code + '\nendif'); assert.equal(r.line, 4);
assert.equal(lineOf(code, code.indexOf('c')), 3);

// 1a: the yellow Simulator bar is off in the Process Editor
assert.match(css, /body\.onProcEditor:not\(\.simOnEditor\) #simBar \{ display: none !important; \}/);
assert.match(app, /const simBarHidden = \(\) => \$\('#simBar'\)\.classList\.contains\('collapsed'\) \|\| simOffHere\(\);/);

// 1d: //Created on YYMMDD HHh MMM on line 2
const stamp = new Function(app.match(/const createdStamp = (\(now = new Date\(\)\) => \{[\s\S]*?\};)/)[1].replace(/^/, 'return ').replace(/;$/, ''))();
assert.equal(stamp(new Date(2026, 10, 2, 14, 23)), '261102 14h 23M');
assert.match(app, /`\/\/Created on \$\{createdStamp\(now\)\}`,\n.*\n    '\/\/This Process was written by its user, not by Skynet',/, 'the not-by-Skynet line for everyone');
// the owner lines only for a Patron: no Created by, MIT License or Copyright for anyone else (Skynet is not named as the owner)
assert.match(app, /\.\.\.\(patron \? \[`\/\/Created by \$\{who\}`, '\/\/MIT License Granted for all Scripts and Configurations', `\/\/Copyright © \$\{who\} \$\{now\.getFullYear\(\)\}`\] : \[\]\),/);

// every icon on 250,250,250 white; white words are 250,250,250
assert.match(css, /button\.icoBtn \{[^}]*background: #fafafa;/);
assert.doesNotMatch(css, /(^|[^-])color: ?#fff\b/m, 'no #fff words');
console.log('Panel Update 11 ok');
await import('./panelupdate12.test.js');      // Panel Update 12 (run with this one, so package.json is not changed)
