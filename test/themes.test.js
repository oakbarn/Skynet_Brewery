// Panel Looks (themes), Rule 2.39
import assert from 'node:assert/strict';
import { THEMES, DEFAULT_THEME, themeOf, themeVars, bruThemeToLook, findBruTheme, newTabLook, forceLookOnTabs, restoreTabs, rememberTheme } from '../public/themes.js';
import { SKYNET_STYLES } from '../public/styles.js';
import { findBruControlTheme, buildSchemaFile } from '../lib/importer.js';
import { SCHEMA_KEYS } from '../lib/schemas.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// a few Looks, Office Black the default
assert.equal(DEFAULT_THEME, 'officeBlack');
assert.deepEqual(THEMES.map(t => t.name), ['Office Black', 'Dark Gray', 'White', 'Skynet Night']);
assert.equal(themeOf('').key, 'officeBlack');
assert.equal(themeOf('dark gray').key, 'darkGray');
assert.equal(themeOf('nonsense').key, 'officeBlack');
// White boxes are White, RGB 250 250 250 (Rule 2.7)
assert.equal(themeOf('white').colors.panel, '#FAFAFA');
for (const t of THEMES) {
  for (const v of Object.values(themeVars(t.key))) assert.match(v, /^#[0-9A-F]{6}$/i, t.key);
  if (t.tabStyle) assert.ok(SKYNET_STYLES.tab.some(s => s.id === t.tabStyle), t.tabStyle);
}
// the BruControl theme to the closest Look
assert.equal(bruThemeToLook('Office2019Black'), 'officeBlack');
assert.equal(bruThemeToLook('Office 2019 Dark Gray'), 'darkGray');
assert.equal(bruThemeToLook('Office2019White'), 'white');
assert.equal(bruThemeToLook('Office2019Colorful'), 'white');
assert.equal(bruThemeToLook('Office2019HighContrast'), 'officeBlack');
assert.equal(bruThemeToLook('VS2017Light'), 'white');
assert.equal(bruThemeToLook('Win11Dark'), 'officeBlack');
assert.equal(bruThemeToLook(''), 'officeBlack');
assert.equal(findBruTheme('<setting name="ThemeName"><value>Office2019DarkGray</value></setting>'), 'Office2019DarkGray');
assert.equal(findBruTheme('nothing here'), '');

// new Tabs, force and put back
assert.deepEqual(newTabLook('officeBlack'), { color: '#262626', style: 'sky_tab_officeBlack' });
assert.deepEqual(newTabLook('skynetNight'), {});
const cfg = { workspaces: [{ name: 'A', color: '#123456', style: 'sky_tab_tennyson', background: 'x.png' }, { name: 'B' }] };
assert.equal(forceLookOnTabs(cfg, 'white', 'now'), 2);
assert.equal(cfg.workspaces[0].color, '#FAFAFA'); assert.equal(cfg.workspaces[0].style, 'sky_tab_white'); assert.equal(cfg.workspaces[0].background, 'x.png');
assert.equal(cfg.workspaces[1].style, 'sky_tab_white');
assert.equal(restoreTabs(cfg), 2);
assert.deepEqual(cfg.workspaces, [{ name: 'A', color: '#123456', style: 'sky_tab_tennyson', background: 'x.png' }, { name: 'B' }]);
assert.equal(cfg.lookUndo, undefined);
assert.equal(restoreTabs(cfg), 0);
// the Look and its undo travel with the Schema
assert.ok(SCHEMA_KEYS.includes('theme') && SCHEMA_KEYS.includes('lookUndo'));

// remembered in the browser for the next page
const mem = new Map(), store = { setItem: (k, v) => mem.set(k, v) };
rememberTheme('darkGray', store);
assert.equal(JSON.parse(mem.get('skynet.look')).vars['--bg'], '#383838');

// the Importer finds the BruControl theme in a settings file and puts the Look in the Schema file
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skytheme-'));
const bru = path.join(dir, 'Documents', 'BruControl'), app = path.join(dir, 'Local', 'BruControl_Url_abc', '1.0.0.0');
fs.mkdirSync(bru, { recursive: true }); fs.mkdirSync(app, { recursive: true });
fs.writeFileSync(path.join(bru, 'tartan.brucfg'), '<Configuration>Office2019White</Configuration>');     // config files are not read for it
assert.equal(findBruControlTheme([bru], { LOCALAPPDATA: path.join(dir, 'Local') }), null);
fs.writeFileSync(path.join(app, 'user.config'), '<setting name="Theme" serializeAs="String"><value>Office2019DarkGray</value></setting>');
assert.equal(findBruControlTheme([bru], { LOCALAPPDATA: path.join(dir, 'Local') }).theme, 'Office2019DarkGray');
fs.rmSync(dir, { recursive: true, force: true });
assert.equal(buildSchemaFile({ theme: 'darkGray' }, { name: 'T' }).schema.theme, 'darkGray');
assert.equal(buildSchemaFile({}, { name: 'T' }).schema.theme, 'officeBlack');
console.log('themes tests passed');
