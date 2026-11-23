// Panel Update 12 (OakBarn Brewery, 2026-11-23): 1a the window's title line (Rule 2.71), 1b the 400 px Emergency Off after 2 seconds
// (Rule 6.41), 2a-f the top of the ☰ Menu (Rule 2.72), 3 line 2 of every Process is his risk line (Rule 16.13).
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const app = read('public/app.js'), css = read('public/style.css');
const RISK = '// Use at YOUR own Risk! Follow Your Own Safety Guidelines. You are Responsible.';

// 1a: the title line: Schema, ✅/❌ and the version, the time now, Update available only when GitHub has a newer one
assert.match(app, /mark = st === 'official' \? '✅ ' : officialBad\(\) \? '❌ ' : '';/);
assert.match(app, /parts\.push\(mark \+ \(S\.panelVersion\?\.version \|\| 'Not stamped'\), createdStamp\(\)\);/);
assert.match(app, /if \(updateState === 'old'\) parts\.push\('⬆ Update available'\);/);
assert.match(app, /setInterval\(windowTitle, 15 \* 1000\);/, 'kept up to the minute');
assert.match(app, /setInterval\(checkUpdate, 10 \* 60 \* 1000\);/);
assert.doesNotMatch(app, /document\.title = S\.config\.title \|\| 'Skynet Brew Panel';/, 'load() uses windowTitle()');

// 1b: 2 seconds on Emergency Off pops up a 400 px one that does the same, on top (Rule 18.53)
assert.match(app, /const EOFF_WAIT = 2000, EOFF_BIG = 400;/);
assert.match(app, /onclick: emergencyOff \}, h\('img', \{ src: 'icons\/Emergency_Stop_400\.png'/);
assert.match(app, /for \(const id of \['#eOffBar'\]\) \$\(id\)\.onclick = emergencyOff;/);
assert.ok(fs.existsSync(new URL('../public/icons/Emergency_Stop_400.png', import.meta.url)));
const { ON_TOP } = await import('../public/ontop.js');
assert.ok(ON_TOP.includes('#eOffBig'));
assert.match(css, /#eOffBig \{ position: fixed; inset: auto; margin: 0; width: 400px; height: 400px;/);

// 2: the top of the ☰ Menu
const menu = app.slice(app.indexOf('function menuItems(list, go) {'), app.indexOf("list.append(h('div', { class: 'menuNote muted' }, 'Menu tabs'));"));
assert.ok(menu.length > 100);
assert.match(menu, /menuHelpLang\(list, go\);/, '2a Help language boxes');
assert.match(app, /'➕ Add a Language'\)\);/);
assert.match(app, /class: 'menuLang' \+ \(on \? ' on' : ''\) \+ \(o\.value === 'user' \? ' userLang' : ''\)/);
assert.match(css, /\.menuList \.menuLang\.userLang \{ font-family: var\(--font\), var\(--helpLangFonts, sans-serif\); \}/, 'the User Language in its font');
assert.doesNotMatch(menu, /Edit layout'/, '2b Edit layout is the Build icon');
assert.match(menu, /const sel = schemaSelect\(\)/, '2c the Schema dropdown');
for (const gone of ['➕ New Schema…', '🔌 Interfaces (boards)', '➕ Add Interface…', '🔌 Switch to Real boards']) assert.ok(!menu.includes(`'${gone}'`), '2d ' + gone);
assert.match(menu, /if \(can\('admin'\) && !S\.sim\?\.on\) list\.append\(item\('🧪 Switch to Simulator'/, 'Switch to Simulator kept (Design Rule 1)');
assert.match(menu, /item\('🐞 Report a Bug', \(\) => reportDialog\(\{\}\)/, '2e Report a Bug for everyone');
assert.ok(menu.indexOf('🐞 Report a Bug') < menu.indexOf('⭐ Request a Feature'));
assert.match(menu, /queueMicrotask\(\(\) => menuLastFill\(list, lastSpot\)\);/, '2f Last picked');
assert.match(app, /onclick: fn \? go\(\(\) => \{ menuLastSet\(key\); fn\(\); \}\) : null/);
assert.match(app, /copy\.onclick = ev => \{ ev\.stopPropagation\(\); orig\.click\(\); \};/);

// 3: line 2 of every new Process, every sample Process, every Skynet Process Template and every built Brew Day Process
assert.ok(app.includes(`const PROCESS_RISK_LINE = '${RISK}';`));
assert.match(app, /return \[`\/\/\$\{typed\}`,\n(?:\s*\/\/.*\n)*\s*PROCESS_RISK_LINE,\n\s*`\/\/Created on/);
const dirs = ['processes', 'samples/configs/three-vessel-one-pump/processes', ...fs.readdirSync(new URL('../templates/process', import.meta.url)).map(d => 'templates/process/' + d)];
let n = 0;
for (const d of dirs) for (const f of fs.readdirSync(new URL('../' + d, import.meta.url)).filter(f => f.endsWith('.txt'))) {
  const lines = read(`${d}/${f}`).split('\n'); n++;
  assert.ok(lines[0].startsWith('//'), `${d}/${f} line 1 is its name`);
  assert.equal(lines[1], RISK, `${d}/${f} line 2`);
}
assert.ok(n >= 46, 'every sample Process ' + n);
const { RISK_LINE } = await import('../lib/brewprocess.js');
assert.equal(RISK_LINE, RISK);
assert.match(read('lib/brewprocess.js'), /const head = `\/\/\$\{names\[i\]\}\\n\$\{RISK_LINE\}\\n\/\/Made by/);
console.log('Panel Update 12 ok');
