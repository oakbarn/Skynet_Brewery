// Panel Update 10 (OakBarn Brewery, 2026-11-23): the Menu Bar's one order and the Sound icon (Rule 2.69), the Process Editor top in
// icons (Rule 2.70), the Brewery Name Patron perk (Rule 12.4) and the New Process class picked once (Rule 16.13).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const html = read('public/index.html'), app = read('public/app.js'), css = read('public/style.css');

// item 3: one order on the Menu Bar: Simulator balloon, Build, Sound, Emergency Off, ?, ☰ Menu
const ids = ['barSim', 'barEdit', 'barSound', 'eOffBar', 'barHelp', 'menuBtn'].map(id => html.indexOf(`id="${id}"`));
assert.ok(ids.every(i => i > 0) && ids.every((v, i) => !i || v > ids[i - 1]), 'Menu Bar order (Rule 2.69)');
assert.ok(!/id="soundBtn"|id="soundNag"|id="eOff"\s/.test(html), 'no copies of Sound or Emergency Off (item 3)');
assert.ok(!/function askSound|'🔊 Turn sound on\?'/.test(app), 'the sound pop-up is gone (item 2)');
assert.match(css, /button\.barSim\.keepSpace, button\.barEdit\.keepSpace \{ visibility: hidden; \}/, 'a hidden icon keeps its space');
assert.match(css, /button\.barSound\.off img\.dne \{ display: block; \}/, 'Do Not Enter while sound is off');
// item 1: the Process Editor icons and Go To
for (const [id, icon] of [['delScript', 'Trash'], ['binBtn', 'Recycle'], ['checkScript', 'Green_Check'], ['startScript', 'Start_Red'], ['stopScript', 'Stop'],
  ['restartScript', 'Restart'], ['saveScriptIcon', 'Save'], ['findBtn', 'Find'], ['goLine', 'Go_To'], ['editUndo', 'Undo'], ['colorKey', 'Key_Green']]) {
  assert.match(html, new RegExp(`id="${id}"[^>]*><img src="icons/${icon}\\.png"`), id + ' is an icon');
  assert.ok(fs.existsSync(new URL(`../public/icons/${icon}.png`, import.meta.url)), icon + '.png is there');
}
for (const f of fs.readdirSync(new URL('../public/icons/', import.meta.url))) assert.ok(fs.statSync(new URL('../public/icons/' + f, import.meta.url)).size < 40000, f + ' is small (Setup exe)');
assert.match(html, /<select id="goKind"[^>]*><option value="line">Line<\/option><option value="section">Section<\/option><\/select>/);
const sectionLine = new Function('text', 'want', app.match(/function sectionLine\(text, want\) \{([\s\S]*?)\n\}/)[1]);
const proc = 'a = 1\nstep 1.00000 "Mash in"\nb = 2\n[Sparge]\nc = 3\nstep "Boil"';
assert.equal(sectionLine(proc, 'sparge'), 4); assert.equal(sectionLine(proc, 'Mash'), 2); assert.equal(sectionLine(proc, 'boil'), 6); assert.equal(sectionLine(proc, 'nope'), 0);
assert.match(app, /si\.src = on \? 'icons\/Start_Green\.png' : 'icons\/Start_Red\.png'/, 'Start green while running, red while stopped');
assert.match(app, /function procEditorMenu\(list, item\)/, 'everything also on the ☰ Menu');
// item 4: Brewery Name for a Patron, Skynet Panel for everyone else
assert.match(app, /const breweryName = \(\) => S\.patron\?\.brewery \? \(S\.config\?\.brewDefaults\?\.breweryName \|\| S\.patron\.name \|\| BREWERY_NAME\) : NOT_PATRON_NAME;/);
assert.match(app, /const NOT_PATRON_NAME = 'Skynet Panel';/);
const { PATRON_LEVELS } = await import('../lib/patron.js');
assert.ok(PATRON_LEVELS[0].perks.some(p => p.key === 'breweryname' && p.state === 'done'));
// item 5: the class is set once (a rename and a Recycle Bin restore keep it)
const { Store } = await import('../lib/store.js');
const { Engine } = await import('../lib/engine.js');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pu10-'));
const cfg = path.join(dir, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [] }));
const store = new Store(cfg, path.join(dir, 'data')); store.load();
const eng = new Engine(store, path.join(dir, 'scripts'), { logNow() { } });
eng.write('My_New_Brew_Process', '//My New Brew Process\n');
eng.setClass('My_New_Brew_Process', 'looper');
assert.equal(eng.classOf('My_New_Brew_Process'), 'looper');
assert.throws(() => eng.setClass('My_New_Brew_Process', 'flow'), /can not be changed/);
eng.setClass('My_New_Brew_Process', 'looper');      // the same class again is fine
assert.match(app, /'\/\/MIT License Granted for all Scripts and Configurations',\n\s*`\/\/Copyright © \$\{patron \? who \+ ' ' : ''\}\$\{now\.getFullYear\(\)\}`/, 'Copyright with no name for a non-Patron');
assert.match(app, /\.\.\.\(patron \? \[`\/\/ Created by \$\{who\} : \$\{stamp\}`\] : \[\]\)/, 'Created by above the MIT line, Patron only');
console.log('panelupdate10 ok');
process.exit(0);
