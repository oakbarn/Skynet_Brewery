// Panel Update 13 (OakBarn Brewery, 2026-11-23), the Process Editor (Rule 2.70): 1 Rename and Stop all gone from above the Process list,
// Stop all is the Stop Sign at the left of row 2; 2 the problems and the Output to the right of the code; 3 Current Process / All
// Processes dropdown (Rule 2.6); 4 Reset every Start clears a Process's old Output lines when it starts.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const html = read('public/index.html'), app = read('public/app.js'), css = read('public/style.css'), server = read('server.js');

// 1: nothing above the list; the Stop Sign is the first thing on row 2; Rename waits hidden for the ☰ Menu
assert.ok(!/<aside class="scriptList">\s*<div class="bar">/.test(html), 'no bar above the Process list');
const row2 = html.indexOf('<div class="bar procRow2 editTools">');
assert.ok(row2 > 0 && html.indexOf('id="stopAll"', row2) < html.indexOf('id="findBtn"', row2), 'Stop all before Find on row 2');
assert.match(html, /<button id="stopAll" type="button" class="icoBtn stopSign op-only"[^>]*><img src="icons\/Stop_Sign\.png" alt=""><\/button>/);
assert.ok(fs.existsSync(new URL('../public/icons/Stop_Sign.png', import.meta.url)));
assert.ok(html.indexOf('id="renScript"') > html.indexOf('<span id="procExtras"'), 'Rename is in the hidden extras (☰ Menu)');
assert.match(app, /\['#renScript', 'Rename'\]/);
assert.ok(!/\$\('#stopAll'\)\.textContent/.test(app), 'the safety word never wipes the Stop Sign picture');

// 2: the column right of the code
assert.match(html, /<aside class="outCol">\s*<div class="outTop"><ul id="problems"><\/ul><button id="clearConsole"/);
assert.match(css, /#view-scripts \.editorPane \{ display: grid; grid-template-columns: minmax\(0, 1fr\) minmax\(240px, 22%\);/);
assert.match(css, /#view-scripts \.outCol \{ grid-column: 2; grid-row: 1 \/ span 2;/);

// 3: Current Process (its own lines only) or All Variables (its variables while it runs, then every gGlobal)
assert.match(html, /<select id="outPick"[^>]*><option value="process">Current Process<\/option><option value="vars">All Variables<\/option><\/select>/);
assert.ok(!html.includes('consoleAll'), 'no all processes slider');
assert.match(app, /const rows = S\.console\.filter\(c => !curScript \|\| c\.script === curScript\)/);
assert.match(app, /api\('GET', `\/ui\/scripts\/\$\{encodeURIComponent\(curScript\)\}\/vars`\)/);
assert.match(server, /if \(act === 'vars' && m === 'GET'\) return ok\(res, engine\.varsOf\(name\)\);/);
{
  const { Engine } = await import('../lib/engine.js');
  const e = Object.create(Engine.prototype);
  e.running = new Map([['Mash', { vars: new Map([['vT', { type: 'value', val: 152 }], ['vS', { type: 'string', val: 'Hi' }]]) }]]);
  assert.deepEqual(e.varsOf('Mash'), [{ name: 'vT', type: 'value', value: 152 }, { name: 'vS', type: 'string', value: 'Hi' }]);
  assert.deepEqual(e.varsOf('Boil'), [], 'not running: none');
}

// 4: Reset every Start, off to start, on the Brain's started event
assert.match(html, /<input type="checkbox" id="consoleReset">/);
assert.match(server, /engine\.on\('started', n => broadcast\('started', \{ script: n \}\)\);/);
assert.match(app, /es\.addEventListener\('started', e => outResetOnStart\(JSON\.parse\(e\.data\)\.script\)\);/);
{
  const S = { console: [{ script: 'A', text: 'old' }, { script: 'B', text: 'keep' }] };
  let on = true; const $ = () => ({ checked: on }); const renderConsole = () => { };
  const src = app.slice(app.indexOf('function outResetOnStart'), app.indexOf('\n}\n', app.indexOf('function outResetOnStart')) + 3);
  const f = new Function('S', '$', 'renderConsole', src + 'return outResetOnStart;')(S, $, renderConsole);
  f('A'); assert.deepEqual(S.console.map(c => c.text), ['keep']);
  on = false; S.console.push({ script: 'B', text: 'two' }); f('B'); assert.equal(S.console.length, 2, 'off: nothing cleared');
}
console.log('Panel Update 13 ok');
// the five command buttons show a small gray down triangle (they open a list, like a dropdown)
assert.match(css, /button\.insCat::after \{ content: '▾'; color: #9a9a9a;/);
// follow-up: the running Processes are in the Output dropdown; picking one opens it; Start and Restart here take precedence
assert.match(app, /h\('optgroup', \{ label: 'Running' \}, \.\.\.run\.map\(n => h\('option', \{ value: 'run:' \+ n \}, n\)\)\)/);
assert.match(app, /if \(name !== curScript\) await openScript\(name\);/);
assert.equal((app.match(/  outFollowStart\(\);\n  const r = await api\('POST', `\/ui\/scripts\/\$\{encodeURIComponent\(curScript\)\}\/(start|restart)`\);/g) || []).length, 2);
assert.match(app, /es\.addEventListener\('scripts', e => \{ S\.scripts = JSON\.parse\(e\.data\); fillOutPick\(\);/);
