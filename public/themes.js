// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Panel Looks (themes), Skynet Rule 2.39 (Fritz, 2026-11-07): "We only need a few, and choose one that best matches the
// DevExpress ones". BruControl's Settings > Environment > Theme uses paid DevExpress themes, so Skynet has its own few
// Looks, made only of Skynet's own colors (no DevExpress files). Fritz: "We could also just set the Back color and the fore
// and Back of texts and labels to almost do the same thing", so a Look is just a few color picks:
//   back      the page behind everything         panel   the Tabs, menus and boxes
//   box       buttons and typing boxes           line    the thin lines around them
//   text      the words                          labels  the quieter words (names, hints)
//   accent    the picked button, Tab and headings  accentText  the words on an accent button
// Each Look also has Tab colors (Fritz, 2026-11-07: "add some defaults for any new tab Built and a means to force all tabs in a
// Schema to the defaults but a way to restore if the user did not like the new forced look"):
//   tabBack   a new Tab's back color        tabStyle  a new Tab's Tab Style (public/styles.js): its Label and text colors
// The default is Office Black, the closest to BruControl's default (Office 2019 Black, palette Default).
// Used by the Panel, its Help and sign-in pages, and the BruControl Importer (which picks the Look closest to the BruControl
// theme). No imports, so the Brain, the browser and the Importer all read the same list.

export const THEMES = [
  { key: 'officeBlack', name: 'Office Black', light: false, like: 'Office 2019 Black', tabBack: '#262626', tabStyle: 'sky_tab_officeBlack',
    colors: { back: '#1F1F1F', panel: '#262626', box: '#363636', line: '#4A4A4A', text: '#F0F0F0', labels: '#ABABAB', accent: '#3A86D4', accentText: '#FAFAFA' } },
  { key: 'darkGray', name: 'Dark Gray', light: false, like: 'Office 2019 Dark Gray', tabBack: '#444444', tabStyle: 'sky_tab_darkGray',
    colors: { back: '#383838', panel: '#444444', box: '#545454', line: '#696969', text: '#F4F4F4', labels: '#C8C8C8', accent: '#5FA8F0', accentText: '#101010' } },
  { key: 'white', name: 'White', light: true, like: 'Office 2019 White or Colorful', tabBack: '#FAFAFA', tabStyle: 'sky_tab_white',
    colors: { back: '#EBEBEB', panel: '#FAFAFA', box: '#F0F0F0', line: '#C6C6C6', text: '#262626', labels: '#5E5E5E', accent: '#2B579A', accentText: '#FAFAFA' } },
  { key: 'skynetNight', name: 'Skynet Night', light: false, like: 'the first Skynet look (blue gray with orange)', tabBack: '', tabStyle: 'sky_tab_default',
    colors: { back: '#12161C', panel: '#1B2129', box: '#232B35', line: '#34404D', text: '#E6EBF0', labels: '#8D9AA8', accent: '#E8A33A', accentText: '#1B1305' } },
];
export const DEFAULT_THEME = 'officeBlack';
export const THEME_KEYS = THEMES.map(t => t.key);
// the plain words for each color pick, in the order shown
export const THEME_PARTS = [
  ['back', 'Back color (behind everything)'], ['panel', 'Tabs and boxes'], ['box', 'Buttons and typing boxes'], ['line', 'Lines around them'],
  ['text', 'Text'], ['labels', 'Labels and hints'], ['accent', 'Picked button, Tab and headings'], ['accentText', 'Text on a picked button'],
];

const squash = s => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
// a key, a name ("Dark Gray", "dark gray") or nothing -> a Look (the default when it is none of them)
export function themeOf(v) {
  const s = squash(v);
  return THEMES.find(t => squash(t.key) === s || squash(t.name) === s) ?? THEMES.find(t => t.key === DEFAULT_THEME);
}

// The CSS colors (style.css custom properties) a Look sets on the page
export function themeVars(v) {
  const t = themeOf(v), c = t.colors;
  return { '--bg': c.back, '--panel': c.panel, '--panel2': c.box, '--line': c.line, '--text': c.text, '--muted': c.labels,
    '--accent': c.accent, '--on-accent': c.accentText };
}

// Put a Look on a page: the colors, and data-theme="light" or "dark" so the Process editor colors and the like follow it
export function applyTheme(doc, v) {
  const t = themeOf(v), root = doc.documentElement;
  for (const [k, val] of Object.entries(themeVars(t.key))) root.style.setProperty(k, val);
  root.dataset.theme = t.light ? 'light' : 'dark';
  root.dataset.look = t.key;
  root.style.colorScheme = t.light ? 'light' : 'dark';
  return t;
}

// The BruControl theme (a DevExpress theme name such as Office2019Black, "Office 2019 Dark Gray", VS2017Light, Win11Dark)
// -> the closest Skynet Look. Anything not known becomes the default, Office Black (BruControl's own default).
export function bruThemeToLook(name) {
  const s = squash(name);
  if (!s) return DEFAULT_THEME;
  if (/darkgr[ae]y|mediumgr[ae]y/.test(s)) return 'darkGray';
  if (/black|dark|night|highcontrast/.test(s)) return 'officeBlack';
  if (/white|light|colorful|blue|seven|aero|classic|silver|lilac|touchline|metropolis|office20(07|10|13|16)/.test(s)) return 'white';
  return DEFAULT_THEME;
}
// A DevExpress theme name found in text (a BruControl settings file), or '' when there is none. A line that says Theme wins.
const BRU_THEME = /\b(Office20(?:07|10|13|16|19)[A-Za-z]+|VS20(?:10|17|19|22)[A-Za-z]+|Win1[01][A-Za-z]+|DeepBlue|MetropolisDark|MetropolisLight|TouchlineDark)\b/;
export function findBruTheme(text) {
  const lines = String(text ?? '').split(/\r?\n/);
  for (const l of lines) if (/theme/i.test(l) && BRU_THEME.test(l)) return l.match(BRU_THEME)[1];
  return String(text ?? '').match(BRU_THEME)?.[1] ?? '';
}

// Remember the Look in this browser, so the next page (sign-in, Help) starts in it (public/themeboot.js)
export function rememberTheme(v, store = globalThis.localStorage) {
  const t = themeOf(v);
  try { store?.setItem('skynet.look', JSON.stringify({ key: t.key, light: t.light, vars: themeVars(t.key) })); } catch { }
  return t;
}

// ---- the Tabs and the Look
// What a new Tab starts with: the Look's Tab back color and Tab Style
export function newTabLook(v) {
  const t = themeOf(v);
  return { ...(t.tabBack ? { color: t.tabBack } : {}), ...(t.tabStyle && t.tabStyle !== 'sky_tab_default' ? { style: t.tabStyle } : {}) };
}
// "Use this Look on every Tab": each Tab's own back color and Tab Style are first kept (config.lookUndo), then set to the
// Look's. Pictures, sizes and everything on the Tabs stay as they are. Returns how many Tabs changed.
export function forceLookOnTabs(config, v, when = new Date().toISOString()) {
  const t = themeOf(v), look = newTabLook(t.key), tabs = config.workspaces ?? [];
  config.lookUndo = { look: t.key, when, tabs: tabs.map(w => ({ name: w.name, color: w.color ?? null, style: w.style ?? null })) };
  for (const w of tabs) {
    if (look.color) w.color = look.color; else delete w.color;
    if (look.style) w.style = look.style; else delete w.style;
  }
  return tabs.length;
}
// "Put the Tabs back": every Tab gets the back color and Tab Style it had before, then the kept copy is gone
export function restoreTabs(config) {
  const u = config.lookUndo;
  if (!u?.tabs) return 0;
  let n = 0;
  for (const k of u.tabs) {
    const w = (config.workspaces ?? []).find(x => x.name === k.name);
    if (!w) continue;
    if (k.color === null) delete w.color; else w.color = k.color;
    if (k.style === null) delete w.style; else w.style = k.style;
    n++;
  }
  delete config.lookUndo;
  return n;
}
