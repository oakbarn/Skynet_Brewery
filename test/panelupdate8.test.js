// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Panel Update 8 (OakBarn Brewery, 2026-11-20): an open Quick Disconnect sprays (Rule 5.28), the Methods hotspot and steady widths
// (Rule 6.19), a smooth temperature on the screen (Rule 6.24), Timer Format and Timer Clones (Rules 2.40, 4.4), Value Widget Formats
// (Rule 1.23), the Audio Widget and one path (Rule 7.26), Hide while running (Rule 1.31), the Switch's Slider on top (Rule 1.20),
// Emergency Off (Rule 6.41) and no Graphic gGlobal (Rule 1.19).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatNumber, numFormatKey, NUM_FORMATS } from '../public/numformat.js';
import { hideWhileRunning } from '../public/processwidget.js';
import { VAR_KINDS, SAMPLE_GLOBALS, declareCheck } from '../public/gkinds.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const app = read('public/app.js'), css = read('public/style.css'), html = read('public/index.html'), server = read('server.js'), hw = read('lib/hardware.js');

// ---- item 7: Value Widget Formats ----
assert.equal(NUM_FORMATS.length, 8);
assert.equal(formatNumber(1000.12, 'fixed', ''), '1000.1', 'Fixed starts with 1 Decimal');
assert.equal(formatNumber(1000.12, 'number', 2), '1,000.12');
assert.equal(formatNumber(10.12, 'percent', 2), '10.12%');
assert.equal(formatNumber(1000.12, 'scientific', 2), '1.00E+03');
assert.equal(formatNumber(0.00123, 'scientific', 2), '1.23E-03');
assert.equal(formatNumber(-1000.12, 'accounting', 2), '$ (1,000.12)');
assert.equal(formatNumber(1000.12, 'accounting', 2), '$ 1,000.12');
assert.equal(formatNumber(-1000.12, 'financial', 2), '(1,000.12)');
assert.equal(formatNumber(1000.12, 'currency', 2), '$1,000.12');
assert.equal(formatNumber(-1000.12, 'currency', 2, '€'), '-€1,000.12');
assert.equal(formatNumber(1000.12, 'currencyRounded', 2), '$1,000');
assert.equal(formatNumber(2.5, '', 2), '2.50', 'no Format: as before, its Decimals');
assert.equal(formatNumber('abc', 'number', 2), 'abc');
assert.equal(numFormatKey('Currency rounded'), 'currencyRounded');
assert.equal(numFormatKey('bogus'), null);
{
  const { Store } = await import('../lib/store.js');
  const os = await import('node:os'), d = fs.mkdtempSync(path.join(os.tmpdir(), 'pu8-'));
  fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [{ name: 'wgt_VAL_Cost_BH', type: 'valueWidget', numFormat: 'fixed', precision: 1 },
    { name: 'wgt_TMR_Boil_BH', type: 'timer', timerFormat: 'hm' }, { name: 'wgt_AUD_Music_BH', type: 'soundPlayer', path: 'sounds/a.mp3', pathImage: 'Images/x.svg' }] }));
  const s = new Store(path.join(d, 'c.json'), path.join(d, 'data')); s.load();
  assert.equal(s.getProp('wgt_VAL_Cost_BH', 'format'), 'fixed', '.format reads its Properties pick');
  s.setProp('wgt_VAL_Cost_BH', 'format', 'Currency');
  assert.equal(s.getProp('wgt_VAL_Cost_BH', 'format'), 'currency');
  assert.throws(() => s.setProp('wgt_VAL_Cost_BH', 'format', 'Roman'), /must be one of/);
  // item 6: a Timer's .format is its .showas
  assert.equal(s.getProp('wgt_TMR_Boil_BH', 'format'), 'hm');
  s.setProp('wgt_TMR_Boil_BH', 'format', 'mm:ss');
  assert.equal(s.getProp('wgt_TMR_Boil_BH', 'showas'), 'mm:ss');
  // item 8: the Audio Widget's .path_audio and .path_image
  assert.equal(s.getProp('wgt_AUD_Music_BH', 'path_audio'), 'sounds/a.mp3');
  assert.equal(s.getProp('wgt_AUD_Music_BH', 'path_image'), 'Images/x.svg');
  s.setProp('wgt_AUD_Music_BH', 'path_image', 'Images/y.svg');
  assert.equal(s.getProp('wgt_AUD_Music_BH', 'path_image'), 'Images/y.svg');
}

// ---- item 21: Hide while running ----
{
  const els = [{ name: 'wgt_PSW_Start_BH', type: 'processWidget', process: 'BrewDay_Flow', hideRunning: true },
    { name: 'wgt_PSW_Float_BH', type: 'processWidget', process: 'Float' }], hid = new Set();
  assert.deepEqual(hideWhileRunning(els, [{ name: 'BrewDay_Flow', state: 'running' }, { name: 'Float', state: 'running' }], hid), [{ name: 'wgt_PSW_Start_BH', visible: false }]);
  assert.deepEqual(hideWhileRunning(els, [{ name: 'BrewDay_Flow', state: 'running' }], hid), [], 'nothing again while it still runs');
  assert.deepEqual(hideWhileRunning(els, [{ name: 'BrewDay_Flow', state: 'stopped' }], hid), [{ name: 'wgt_PSW_Start_BH', visible: true }]);
  assert.deepEqual(hideWhileRunning(els, [], hid), [], 'shown only once');
}
assert.match(server, /hideWhileRunning\(store\.config\.elements, engine\.list\(\), hidRunning\)/);
for (const f of ['samples/configs/three-vessel-one-pump/config.json', 'config/brewery.json']) {
  const c = JSON.parse(read(f)), by = n => c.elements.find(e => e.name === n);
  assert.deepEqual([by('wgt_PSW_Start~Brew~Day_BH')?.type, by('wgt_PSW_Start~Brew~Day_BH')?.process, by('wgt_PSW_Start~Brew~Day_BH')?.hideRunning], ['processWidget', 'BrewDay_Flow', true], `${f}: Start Brew Day`);
  assert.equal(by('wgt_PSW_Start~Brew~Day_BH').confirm, undefined, `${f}: no pop-up (item 9)`);
  assert.deepEqual([by('wgt_PSW_Stop~all~off_BH')?.type, by('wgt_PSW_Stop~all~off_BH')?.process, !!by('wgt_PSW_Stop~all~off_BH')?.hideRunning], ['processWidget', 'BrewDay_Stop', false], `${f}: Stop (all off)`);
  assert.ok(!c.elements.some(e => /^wgt_LBL_St(art|op)/.test(e.name)), `${f}: the old Label buttons are gone`);
  assert.equal(by('wgt_SW_Testing_BH').sliderLayer, true, `${f}: the Testing Switch has the Slider on top (item 18)`);
}

// ---- item 1: an open Quick Disconnect sprays ----
assert.match(app, /return n >= \(g\.qdOn \? 1 : 2\) \? \{ key: id, pass: true \} : \{ key: id, end: true, qdOpen: true \};/);
assert.match(app, /if \(n\?\.qdOpen\) return true;/, 'an open QD is an open end');
assert.match(app, /class: 'qdSpout'/, 'a QD on an IP with nothing on it draws the splash');

// ---- items 2, 3, 4, 5 ----
assert.match(app, /const METHODS_SHOWN_KEY = 'skn_methodsShown';/);
assert.match(app, /if \(!methodsShown\.has\(e\.name\)\) continue;/, 'method buttons start hidden');
assert.match(app, /const METHODS_HOT_MIN = 25;/, 'Methods hotspot at least 25 px (2026-11-21)');
assert.match(app, /const plate = right \? l \+ pw : l/, 'Methods hotspot starts at the end plate');
assert.match(css, /#ws \.hmHot \{ position: absolute;/);
assert.match(app, /const pidPct = n =>/);
assert.match(app, /svStatWidth\(e, sv\)/);
assert.match(css, /\.el \.vl \.svStat\.steady \{/);
assert.match(app, /const SMOOTH_MS = 5000, SMOOTH_SIM_MS = 15000, SMOOTH_JUMP = 2;/);
assert.match(app, /smoothTemp\(e\.name, v\.value, simDev\(e\.device\)\)/);

// ---- items 6, 13 ----
assert.match(app, /\['timerFormat', 'Format', 'sel', TIMER_FORMATS/);
assert.match(app, /\['Timers', e => e\.type === 'timer'\]/);
assert.match(app, /\(isDevice\(e\) \|\| e\.type === 'timer'\) && realTab\(e\.workspace\)/);

// ---- item 8 ----
assert.match(read('public/naming.js'), /soundPlayer: 'AUD'/);
assert.match(app, /\['pathImage', 'Picture \(\.path_image\)', 'path'/);
assert.match(app, /type === 'soundPlayer'\) e\.visibility = 'hidden';/, 'a new Audio Widget starts hidden');

// ---- item 18 ----
assert.match(app, /\['sliderLayer', 'Slider on top \(Layer 1\)', 'bool'/);

// ---- Emergency Off ----
assert.match(html, /<button id="eOffBar" class="eOff"/);   // the one Emergency Off, on the Menu Bar (Panel Update 10, item 3)
assert.ok(!/<text\b/.test(html.slice(html.indexOf('id="eOffBar"'), html.indexOf('</button>', html.indexOf('id="eOffBar"')))), 'no words in the picture (Rule 7.25)');
assert.match(server, /if \(p === '\/ui\/emergencyoff' && m === 'POST'\) \{\n    engine\.stopAll\(\);/);
assert.match(server, /p === '\/ui\/emergencyoff' \|\|/, 'brewers and admins');
assert.ok(fs.existsSync(path.join(ROOT, 'media/Images/Skynet/On_Off/Skynet_Emergency_Off.svg')));
{
  const { Hardware } = await import('../lib/hardware.js');
  const order = [], vals = new Map([['Pump', true], ['Elem', true], ['Valve', true], ['MValve', true], ['PWM', 50]]);
  const els = [{ name: 'Valve', type: 'digitalOut', subtype: 'valve' }, { name: 'MValve', type: 'digitalOut', subtype: 'valve', valveType: 'manual' },
    { name: 'Pump', type: 'digitalOut', subtype: 'pump' }, { name: 'PWM', type: 'pwmOut' }, { name: 'Elem', type: 'digitalOut', subtype: 'element' }];
  const store = { list: () => els, getProp: (n) => vals.get(n), setProp: (n, p, v) => { order.push(n); vals.set(n, v); } };
  const n = Hardware.prototype.emergencyOff.call({ store });
  assert.deepEqual(order, ['Elem', 'Pump', 'PWM', 'Valve'], 'heaters, then pumps, then other outputs, then valves; a manual valve stays');
  assert.equal(n, 4);
}
assert.match(hw, /emergencyOff\(source = 'emergency'\)/);

// ---- no Graphic gGlobal ----
assert.ok(!('graphic' in VAR_KINDS));
assert.ok(!SAMPLE_GLOBALS.some(s => s.kind === 'graphic'));
assert.match(declareCheck('new', 'gG_Pic')?.error ?? declareCheck('gblV', 'gG_Pic')?.error ?? '', /no Graphic gGlobal/);

console.log('panelupdate8 ok');
