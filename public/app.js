import { addEyes } from './eye.js';
import { elementTopic, graphicTopic, barTopic, menuTopic, TAB_SPOT, DB_TRIGGER } from './helpmap.js';
import { attachAutofill } from './autofill.js';
import { classify, toHtml, processXml, notepadPlusPlus, LEGEND } from './colorize.js';
import { setRich } from './richtext.js';
import { EQUIP_FIELDS, UNIT_SYSTEMS, VESSEL_TYPES, HEAT_KINDS, heatKindsFor, REPORT_UNITS, VALVE_SERVICE, SPARGE, MASH_STEPS, brewVolumes, volUnit, tempUnit, firstOfType } from './brewcalc.js';
// Brew Panel browser app (plain JavaScript, works in Chrome, Edge, Safari, Firefox, DuckDuckGo)
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v; else if (k === 'style') e.style.cssText = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== undefined && v !== null && v !== false) e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k !== null && k !== undefined) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
};
const media = p => '/media?path=' + encodeURIComponent(p);
const noSpaces = n => String(n ?? '').trim().replace(/_*\s+_*/g, '_');
const clone = o => JSON.parse(JSON.stringify(o));
// a background that is not a number is a color ("red", "#3fa34d"); a number only ever picks a picture
const bg = v => (v === '' || v === null || v === undefined || /^\s*-?\d+\s*$/.test(String(v))) ? '' : String(v);
// Picture paths (as in BruControl): "background" = 1, 2 or 3 shows imagePath_1, _2 or _3, any other whole number shows
// no picture. Empty (or a color) shows imagePath_1. name.image = "path" in a Process sets imagePath_1 and background = 1.
const IMG_SLOT = /^imagePath_(\d+)$/;
const slotsOf = e => Object.keys(e).filter(k => IMG_SLOT.test(k) && e[k]).map(k => +IMG_SLOT.exec(k)[1]).sort((a, b) => a - b);
function slotImage(e, v) {
  const b = String(v.background ?? '').trim(), n = /^-?\d+$/.test(b) ? +b : 1;
  return n >= 1 ? (v['imagepath_' + n] ?? e['imagePath_' + n] ?? '') : '';
}
const hasPictures = (e, v) => !!(slotsOf(e).length || v.imagepath_1 || v.imagepath_2 || v.imagepath_3);

let S = null;                 // server state
let view = 'workspace', wsName = null, zoom = 'fit';
try { zoom = localStorage.getItem('bp.zoom') || 'fit'; } catch { /* private window: default */ }
if (zoom === 'page') zoom = 'fit';         // "Whole tab" is now "Fit screen"

let knownPaths = new Set();   // file paths in the open process that were already warned about (not on the Brain)
let editing = false, draft = null, sel = null;   // sel = {kind:'el'|'gfx', id}
let soundOn = false;
const audios = new Map();

async function api(method, url, body, raw) {
  const opt = { method, headers: {} };
  if (body !== undefined) { if (raw) { opt.body = body; opt.headers['Content-Type'] = 'text/plain'; } else { opt.body = JSON.stringify(body); opt.headers['Content-Type'] = 'application/json'; } }
  const r = await fetch(url, opt);
  if (r.status === 401) { location.replace('/login.html'); throw new Error('Please sign in'); }
  const ct = r.headers.get('content-type') || '';
  const data = ct.includes('json') ? await r.json() : await r.text();
  if (!r.ok || (data && data.ok === false && data.error)) throw new Error(data.error || r.statusText);
  return data;
}
// A message that stays until it is closed: a Process that kept failing and was not restarted again
function alertBar(text) {
  const bar = h('div', { class: 'alertBar', role: 'alert' }, h('span', {}, '⚠ ' + text), h('button', { title: 'Close', onclick: () => bar.remove() }, '✕'));
  document.body.append(bar);
}
// Manual valves (Valve type Manual): a Process asked for one to be opened or closed by hand and waits for Done
function renderValves(list = []) {
  let d = $('#valveDlg');
  if (!list.length) { if (d?.open) d.close(); return; }
  if (!d) { d = h('dialog', { id: 'valveDlg', class: 'valveDlg' }); d.addEventListener('cancel', e => e.preventDefault()); document.body.append(d); }
  d.innerHTML = '';
  d.append(h('h3', {}, '✋ Manual valve'), ...list.map(a => h('div', { class: 'valveAsk' },
    h('div', { class: 'valveDo' }, `${a.open ? 'OPEN' : 'CLOSE'} ${a.label} by hand`),
    h('div', { class: 'muted' }, `The Process ${a.process} waits until you press Done.`),
    h('div', { class: 'bar' }, h('span', { class: 'spacer' }), can('operator')
      ? h('button', { class: 'primary', onclick: guard(() => api('POST', '/ui/valve/confirm', { name: a.name })) }, `Done: it is ${a.open ? 'open' : 'closed'}`)
      : h('span', { class: 'muted' }, 'An operator or admin must press Done.')))));
  if (!d.open) d.showModal();
}
function toast(msg, bad) { const t = $('#toast'); t.textContent = msg; t.className = 'show' + (bad ? ' bad' : ''); clearTimeout(t._t); t._t = setTimeout(() => t.className = '', bad ? 5000 : 2200); }
const RANK = { viewer: 0, operator: 1, admin: 2 };
const can = need => RANK[S?.me?.role] >= RANK[need];
const guard = fn => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message, true); } };

// ---------------------------------------------------------------- load + live
// the size of \L large text in strings (☰ Menu > Default), always bigger than the text around it (style.css .rt-L)
const TEXT_NORMAL = 18, TEXT_LARGE = 28;
const setTextLarge = () => document.documentElement.style.setProperty('--textLarge', (+S.config.brewDefaults?.textLarge || TEXT_LARGE) + 'px');
async function load() {
  S = await api('GET', '/ui/state');
  document.body.classList.remove('role-viewer', 'role-operator', 'role-admin');
  document.body.classList.add('role-' + S.me.role);
  $('#code').readOnly = !can('admin');
  $('#title').textContent = S.config.title || 'Skynet Brew Panel';
  document.title = S.config.title || 'Skynet Brew Panel';
  setTextLarge();
  if (!wsName || !S.config.workspaces.some(w => w.name === wsName)) wsName = S.config.workspaces[0]?.name;
  [S.schemas, S.profiles, S.mashProfiles, S.boilProfiles, S.tabProfiles, S.valveProfiles] = await Promise.all([api('GET', '/ui/schemas'), api('GET', '/ui/equipment'),
    ...['mash', 'boil', 'tab', 'valve'].map(k => api('GET', '/ui/profiles/' + k))]);
  fillAddType();
  document.body.classList.toggle('hideMenuBar', menuBarHides());
  renderAll();
  startupView();
}
function renderAll() { renderValves(S.valves); renderSchemaPick(); renderTabs(); renderMenu(); renderWs(); renderScripts(); renderGlobals(); renderDevices(); renderSettings(); renderMqtt(); renderConsole(); renderSimBar(); }

function connect() {
  const es = new EventSource('/ui/events');
  es.onopen = () => $('#conn').classList.add('on');
  es.onerror = () => {
    $('#conn').classList.remove('on');
    // signed out elsewhere, password changed or account removed: back to the sign-in page
    fetch('/auth/status').then(r => r.json()).then(st => { if (!st.user) { es.close(); location.replace('/login.html'); } }).catch(() => { });
  };
  es.addEventListener('values', e => {
    const ch = JSON.parse(e.data);
    for (const [n, props] of Object.entries(ch)) { S.values[n] = { ...(S.values[n] || {}), ...props }; updateEl(n); }
    renderPipes(); updateAlarms(); if (view === 'globals') refreshGlobalValues(ch);
  });
  es.addEventListener('scripts', e => { S.scripts = JSON.parse(e.data); renderScriptList(); updateScriptState(); });
  es.addEventListener('print', e => { S.console.push(JSON.parse(e.data)); if (S.console.length > 1500) S.console.splice(0, 300); renderConsole(); });
  es.addEventListener('alert', e => alertBar(JSON.parse(e.data).text));
  es.addEventListener('valves', e => { S.valves = JSON.parse(e.data); renderValves(S.valves); });
  es.addEventListener('show', e => { const n = JSON.parse(e.data); if (S.config.workspaces.some(w => w.name === n)) { wsName = n; setView('workspace'); renderTabs(); renderWs(); } });
  es.addEventListener('config', () => { if (!editing) load(); });
  es.addEventListener('devices', e => { S.devices = JSON.parse(e.data); renderDevices(); });
  es.addEventListener('sim', e => { S.sim = JSON.parse(e.data); renderSimBar(); });
  es.addEventListener('mqtt', e => { S.mqtt = { ...(S.mqtt || {}), status: JSON.parse(e.data) }; renderMqttStatus(); });
}

function setView(v) {
  view = v;
  $$('#views button').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  $$('.view').forEach(s => s.classList.toggle('active', s.id === 'view-' + v));
  // the Menu Bar is hidden on the Tabs page; coming back to Tabs hides it again
  document.body.classList.toggle('onTabs', v === 'workspace');
  showMenuBar(false);
  if (v === 'workspace') fitZoom();
  if (v === 'log') loadLogNames();
  if (v === 'settings') { $('#recShow').classList.add('hidden'); renderUsers().then(renderRecovery).then(renderMessaging).then(() => renderContact(S.me.name)).catch(e => toast(e.message, true)); }
  if (v === 'scripts' || v === 'config') placeFind();
  if (v === 'config') openConfig();
}

// ---------------------------------------------------------------- workspaces
const L = () => editing ? draft : S.config;          // layout being shown
const curWs = () => L().workspaces.find(w => w.name === wsName) || L().workspaces[0];

function renderTabs() {
  const t = $('#wsTabs'); t.innerHTML = '';
  for (const w of L().workspaces) t.append(h('button', { class: w.name === wsName && !menuTab ? 'active' : '', onclick: () => { wsName = w.name; sel = null; leaveMenuTab(); renderTabs(); renderWs(); },
    ondblclick: () => { if (editing) editWorkspace(); }, ...(editing ? { title: 'Double-click for Tab settings' } : {}) }, w.name));
}

// Fit screen (default): the whole tab fits in the space left under the header and tab buttons, so nothing scrolls.
// Fit width: the tab fills the width of the window and scrolls up / down when it is taller than the space left.
// The tab area always ends at the bottom of the window, so the page itself never scrolls.
function fitZoom(again = true) {
  const w = curWs(); if (!w) return;
  const box = $('#wsScroll'), tw = w.width || 1600, th = w.height || 900, before = box.clientWidth;
  const top = box.getBoundingClientRect().top + window.scrollY;
  const pad = parseFloat(getComputedStyle($('main')).paddingBottom) || 0;
  box.style.height = box.style.maxHeight = Math.max(200, Math.floor(window.innerHeight - top - pad)) + 'px';
  const byWidth = (box.clientWidth - 2) / tw, byHeight = (box.clientHeight - 2) / th;
  const z = zoom === 'fit' ? Math.min(3, byWidth, byHeight) : zoom === 'width' ? Math.min(3, byWidth) : +zoom;
  const ws = $('#ws');
  ws.style.transform = `scale(${z})`; ws.dataset.z = z;
  $('#wsSizer').style.width = tw * z + 'px';
  $('#wsSizer').style.height = th * z + 'px';
  if (again && (zoom === 'fit' || zoom === 'width') && box.clientWidth !== before) fitZoom(false);   // a scroll bar came or went: fit to the new width
}
const Z = () => +$('#ws').dataset.z || 1;

function renderWs() {
  const w = curWs(); const ws = $('#ws');
  if (!w) return;
  ws.querySelectorAll('.el,.gfx').forEach(n => n.remove());
  ws.style.width = (w.width || 1600) + 'px'; ws.style.height = (w.height || 900) + 'px';
  ws.style.backgroundColor = w.color || tabProfileOf(w)?.bgColor || '';      // its own color, else its Tab Background Profile's
  // background image fills the workspace, or sits at bgX/bgY with size bgW x bgH (leaves room for side panels)
  const placed = w.bgW && w.bgH;
  const bgSize = placed ? `${w.bgW}px ${w.bgH}px` : '100% 100%', bgPos = placed ? `${w.bgX || 0}px ${w.bgY || 0}px` : '0 0';
  const grid = 'linear-gradient(rgba(128,128,128,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,.25) 1px, transparent 1px)';
  const imgs = [], sizes = [], poss = [];
  if (w.background) { imgs.push(`url("${media(w.background)}")`); sizes.push(bgSize); poss.push(bgPos); }
  if (editing) { imgs.push(grid); sizes.push('20px 20px, 20px 20px'); poss.push('0 0, 0 0'); }
  ws.style.backgroundImage = imgs.join(', '); ws.style.backgroundSize = sizes.join(', '); ws.style.backgroundPosition = poss.join(', '); ws.style.backgroundRepeat = 'no-repeat' + (editing ? ', repeat, repeat' : '');
  ws.classList.toggle('editing', editing);
  const isEqFit = g => eqClass(g) && !eqClass(g).tab;     // pipe fittings sit above the elements, vessels below them
  for (const g of L().graphics.filter(g => g.workspace === w.name && g.kind === 'vessel' && !isEqFit(g))) ws.append(buildVessel(g));
  for (const g of L().graphics.filter(g => g.workspace === w.name && !['pipe', 'ip', 'vessel'].includes(g.kind))) ws.append(buildGfx(g));
  for (const e of L().elements.filter(e => e.workspace === w.name)) ws.append(buildEl(e));
  for (const g of L().graphics.filter(g => g.workspace === w.name && isEqFit(g))) ws.append(buildVessel(g));
  if (editing) for (const g of draft.graphics.filter(g => g.workspace === w.name && g.autoFit)) autoFit(g);
  for (const g of L().graphics.filter(g => g.workspace === w.name && g.kind === 'ip')) ws.append(buildIp(g));
  for (const e of L().elements.filter(e => e.workspace === w.name && hasIps(e))) for (const q of devIps(e)) ws.append(buildDevIp(e, q));
  for (const g of L().graphics.filter(g => g.workspace === w.name && eqPorts(g).length)) for (const q of eqPorts(g)) ws.append(buildEqIp(g, q));
  renderPipes(); fitZoom(); updLockBtn();
}

const tabProfileOf = w => w?.tabProfile ? (S.tabProfiles || []).find(p => p.id === w.tabProfile) : null;
function place(node, o) { node.style.left = (o.x || 0) + 'px'; node.style.top = (o.y || 0) + 'px'; node.style.width = (o.w || 120) + 'px'; node.style.height = (o.h || 60) + 'px'; }

// Bundle (Fritz): a vessel and the IPs attached to it move as one unit and can't be edited until it is un-bundled
const bundleOf = g => g?.kind === 'ip' && g.attachTo ? draft.graphics.find(v => v.id === g.attachTo && v.kind === 'vessel' && v.bundled) : null;
const bundledIps = v => draft.graphics.filter(g => g.kind === 'ip' && g.attachTo === v.id);

// Edit layout: a resize corner, or a padlock when the item is locked in place
function editDeco(n, o) {
  if (o.locked) { n.classList.add('locked'); n.append(h('div', { class: 'lock', title: 'Locked in place' }, '🔒')); }
  else if (o.bundled) n.append(h('div', { class: 'lock', title: 'Bundled with its IPs: moves as one, no editing' }, '📦'));
  else n.append(h('div', { class: 'rs' }));
}

// Vessel widgets (app-only): electrically heated, gas heated, or an unheated mash tun. A background picture by path,
// a label (alignment, color, size, show / hide), and IPs placed on them become its ports and move with it.
const VESSELS = { vessel: 'Vessel (kettle, HLT, MLT ...)', pchiller: 'Plate chiller', ccoil: 'Chilling coil', herms: 'HERMS coil', trub: 'Trub filter',
  eqTee: 'Pipe tee', eqElbow90: 'Pipe 90° elbow', eqElbow45: 'Pipe 45° elbow', eqCross: 'Pipe cross',
  electric: 'Electric heated vessel (older)', gas: 'Gas heated vessel (older)', mashTun: 'Unheated mash tun (older)', coil: 'Cooling coil (older)', plateChiller: 'Plate chiller (older)' };
// Equipment widgets (Fritz's spec): a picture with a Name, a Type, a Label and ports. Every port except a thermowell is an IP:
// it is created on screen near its Position when installed, and stays attached to the widget. Each list (types, positions,
// standards) can be added to; the additions are kept in the settings (vesselLists). Fritz will refine the choices later.
// A port's positions are [name, x, y]: where it sits on the picture as a fraction of its width and height (added ones start in
// the middle). Ports with the same `circuit` pass flow between them (a chiller's wort side, a fitting); a vessel's ports are
// ends, where flow starts or stops.
const V_HIGH = [['Center High', 0.5, 0.1], ['Left High', 0, 0.15], ['Right High', 1, 0.15], ['Back High', 0.7, 0.12]];
const SIDE4 = [['Left', 0, 0.5], ['Right', 1, 0.5], ['Top', 0.5, 0], ['Bottom', 0.5, 1]];
const CORNERS = [['Top Left', 0, 0.15], ['Top Right', 1, 0.15], ['Bottom Left', 0, 0.85], ['Bottom Right', 1, 0.85]];
const pt = (name, pos, o = {}) => ({ name, ip: true, pos, ...o });
const EQ = {
  vessel: { title: 'Vessel', types: Object.keys(VESSEL_TYPES), image: 'Images/samples/kettle.svg', size: [220, 270], tab: 'Equipment',
    ports: {
      outlet: pt('Outlet', [['Center Bottom', 0.5, 1], ['Bottom Drain', 0.9, 0.92]], { on: true }),
      tangential: pt('Tangential', [['Bottom Left', 0, 0.8], ['Bottom Right', 1, 0.8], ['Center', 0.5, 0.8], ['Back', 0.65, 0.75]]),
      thermowell: pt('Thermowell', [['Center Low', 0.5, 0.75], ['Left Low', 0, 0.75], ['Right Low', 1, 0.75], ['Back Low', 0.7, 0.7]], { ip: false }),
      steamSlayer: pt('Steam Slayer', V_HIGH), sparge: pt('Sparge', V_HIGH), cip: pt('CIP', [['Lid', 0.5, 0], ...V_HIGH]),
    } },
  pchiller: { title: 'Plate chiller', types: ['Brazed plate 20', 'Brazed plate 30', 'Brazed plate 40', 'Counterflow'], image: 'Images/samples/plate_chiller.svg', size: [110, 200], tab: 'Equipment',
    ports: {
      wortIn: pt('Wort In', CORNERS, { on: true, def: 'Top Left', circuit: 'wort' }), wortOut: pt('Wort Out', CORNERS, { on: true, def: 'Bottom Right', circuit: 'wort' }),
      waterIn: pt('Water In', CORNERS, { on: true, def: 'Bottom Left', circuit: 'water' }), waterOut: pt('Water Out', CORNERS, { on: true, def: 'Top Right', circuit: 'water' }),
      thermowell: pt('Thermowell', [['Wort Out', 0.85, 0.75], ['Water Out', 0.85, 0.25]], { ip: false }),
    } },
  ccoil: { title: 'Chilling coil', types: ['Immersion coil', 'Jacketed (glycol)'], image: 'Images/samples/chill_coil.svg', size: [180, 180], tab: 'Equipment',
    ports: { in: pt('In', CORNERS.slice(0, 2).concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Left', circuit: 'a' }), out: pt('Out', CORNERS.slice(0, 2).concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Right', circuit: 'a' }) } },
  herms: { title: 'HERMS coil', types: ['Stainless 25 ft', 'Stainless 50 ft', 'Copper'], image: 'Images/samples/herms_coil.svg', size: [180, 180], tab: 'Equipment',
    ports: { wortIn: pt('Wort In', CORNERS.concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Left', circuit: 'a' }), wortOut: pt('Wort Out', CORNERS.concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Right', circuit: 'a' }) } },
  trub: { title: 'Trub filter', types: ['Inline filter', 'Hop rocket', 'Hop spider'], image: 'Images/samples/trub_filter.svg', size: [100, 170], tab: 'Equipment',
    ports: { inlet: pt('Inlet', SIDE4.concat(CORNERS), { on: true, def: 'Top', circuit: 'a' }), outlet: pt('Outlet', SIDE4.concat(CORNERS), { on: true, def: 'Bottom', circuit: 'a' }) } },
  eqTee: { title: 'Pipe tee', types: ['Equal tee', 'Reducing tee'], image: 'Images/samples/pipe_tee.svg', size: [90, 90],
    ports: { a: pt('Run A', SIDE4, { on: true, def: 'Left', circuit: 'a' }), b: pt('Run B', SIDE4, { on: true, def: 'Right', circuit: 'a' }), c: pt('Branch', SIDE4, { on: true, def: 'Bottom', circuit: 'a' }) } },
  eqElbow90: { title: 'Pipe 90° elbow', types: ['Short radius', 'Long radius'], image: 'Images/samples/pipe_elbow90.svg', size: [90, 90],
    ports: { a: pt('End A', SIDE4, { on: true, def: 'Left', circuit: 'a' }), b: pt('End B', SIDE4, { on: true, def: 'Bottom', circuit: 'a' }) } },
  eqElbow45: { title: 'Pipe 45° elbow', types: ['Short radius', 'Long radius'], image: 'Images/samples/pipe_elbow45.svg', size: [90, 90],
    ports: { a: pt('End A', SIDE4.concat([['Bottom Right', 1, 1], ['Top Right', 1, 0], ['Bottom Left', 0, 1], ['Top Left', 0, 0]]), { on: true, def: 'Left', circuit: 'a' }),
      b: pt('End B', SIDE4.concat([['Bottom Right', 1, 1], ['Top Right', 1, 0], ['Bottom Left', 0, 1], ['Top Left', 0, 0]]), { on: true, def: 'Bottom Right', circuit: 'a' }) } },
  eqCross: { title: 'Pipe cross', types: ['Equal cross', 'Reducing cross'], image: 'Images/samples/pipe_cross.svg', size: [90, 90],
    ports: { a: pt('End A', SIDE4, { on: true, def: 'Left', circuit: 'a' }), b: pt('End B', SIDE4, { on: true, def: 'Right', circuit: 'a' }),
      c: pt('End C', SIDE4, { on: true, def: 'Top', circuit: 'a' }), d: pt('End D', SIDE4, { on: true, def: 'Bottom', circuit: 'a' }) } },
};
// on / off pictures offered for Digital Outputs; users add their own (any picture path in the media folders)
const ONOFF_GRAPHICS = [['LED green', 'Images/samples/led_green.svg'], ['LED red', 'Images/samples/led_red.svg'], ['LED off (grey)', 'Images/samples/led_off.svg'],
  ['Lightning bolt on', 'Images/samples/bolt_on.svg'], ['Lightning bolt off', 'Images/samples/bolt_off.svg'],
  ['Ball valve open (horizontal)', 'Images/Valve_Ball_OpenH_1.png'], ['Ball valve closed (horizontal)', 'Images/Valve_Ball_ClosedH_1.png'],
  ['Ball valve open (vertical)', 'Images/Valve_Ball_OpenV-1x1.png'], ['Ball valve closed (vertical)', 'Images/Valve_Ball_ClosedV-1x1.png']];
// lists behind the dropdowns. Every list can be added to ("Add new ..."); additions are kept in the settings (vesselLists).
const UNITS = ['°F', '°C', '%', 'psi', 'bar', 'kPa', 'gal', 'L', 'qt', 'oz', 'lb', 'kg', 'g', 'SG', '°P', 'pH', 'gal/min', 'L/min', 'V', 'mA', 's', 'min'];
const IMG_RE = /\.(png|jpe?g|gif|svg|webp|bmp)$/i, SND_RE = /\.(wav|mp3|ogg|m4a)$/i;
// pictures and sounds already used anywhere in the layout
function usedPaths(re) {
  const c = draft || S.config;
  return [...new Set([...c.elements, ...c.graphics, ...c.workspaces].flatMap(o => [o.imageOn, o.imageOff, o.image, o.background, o.sound, ...slotsOf(o).map(n => o['imagePath_' + n]), ...(o.sounds || [])])
    .filter(p => typeof p === 'string' && re.test(p)))].sort();
}
const HEAT_SOURCES = ['None', 'Electric element', 'Gas burner', 'Induction', 'Steam jacket', 'HERMS coil'];
const EQ_STANDARDS = ['TC 1.5', 'NPT 1/2 FPT', 'BSP 1/2', 'MM', 'TC 2', 'NPT 3/4 FPT', 'NPT 1/2 MPT'];
const eqClass = g => g?.kind === 'vessel' ? EQ[g.vesselType] : null;
// list keys: "standard" (shared), "<class>.types", "<class>.<port>"
function vList(key) {
  const [c, p] = key.split('.');
  const base = key === 'standard' ? EQ_STANDARDS : key === 'onoff' ? ONOFF_GRAPHICS.map(g => g[1]) : key === 'units' ? UNITS : key === 'colors' ? [] :
    key === 'pictures' ? inImages([...ONOFF_GRAPHICS.map(g => g[1]), ...Object.values(EQ).map(c => c.image), ...usedPaths(IMG_RE), ...mediaPics]) :
    key === 'backgrounds' ? inImages([...mediaPics, ...(draft || S.config).workspaces.map(w => w.background).filter(Boolean)]).sort() : key === 'sounds' ? [...new Set([...mediaSounds, ...usedPaths(SND_RE)])].sort() : key === 'heat' ? HEAT_SOURCES : p === 'types' ? EQ[c]?.types : EQ[c]?.ports[p]?.pos.map(q => q[0]);
  return [...new Set([...(base || []), ...(S.config.vesselLists?.[key] || [])])];
}
// Picture lists only offer pictures in media/Images (and its folders); sound lists add what is in media/sounds.
// Fetched when a dialog needs them.
let mediaPics = [], mediaSounds = [];
// a picture typed by hand always lands in media/Images: "pump.png", "/images/pump.png" and "media\Images\pump.png" -> "Images/pump.png"
const imagesPath = p => 'Images/' + p.replace(/\\/g, '/').replace(/^\/+/, '').replace(/^media\//i, '').replace(/^images\//i, '');
const inImages = list => [...new Set(list)].filter(p => /^Images\//i.test(p));
async function loadMediaPictures() {
  const [pics, snds] = await Promise.all(['Images', 'sounds'].map(dir => api('GET', `/ui/media/all?root=0&dir=${dir}`).catch(() => null)));
  mediaPics = (pics?.files || []).filter(f => f.kind === 'picture').map(f => f.use);
  mediaSounds = (snds?.files || []).filter(f => f.kind === 'sound').map(f => f.use);
}
const portDefPos = d => d.def || d.pos[0][0];
function vPortXY(g, k, pos) {
  const q = eqClass(g).ports[k].pos.find(q => q[0] === pos) || [pos, 0.5, 0.5];
  return [(g.x || 0) + q[1] * (g.w || 200), (g.y || 0) + q[2] * (g.h || 200)];
}
const vPortLabel = (g, k, p) => `${eqClass(g).ports[k].name}${p.standard ? ` (${p.standard})` : ''}`;
// the starting port settings of a new widget
const eqDefaultPorts = c => Object.fromEntries(Object.entries(EQ[c].ports).filter(([, d]) => d.on).map(([k, d]) => [k, { installed: true, position: portDefPos(d), standard: EQ_STANDARDS[0] }]));
// Create, move or remove a widget's port IPs to match its settings. Returns the ports that were placed or moved.
function syncVesselPorts(g, old) {
  const moved = [];
  for (const [k, def] of Object.entries(eqClass(g).ports)) {
    if (!def.ip) continue;
    const p = g.ports?.[k] || {}, was = old?.ports?.[k] || {};
    let ip = draft.graphics.find(x => x.kind === 'ip' && x.attachTo === g.id && x.port === k);
    if (!p.installed) {
      if (ip) { draft.graphics = draft.graphics.filter(x => x !== ip); for (const x of draft.graphics) { if (x.from === ip.id) delete x.from; if (x.to === ip.id) delete x.to; } }
      continue;
    }
    if (!ip) {
      ip = { id: newId(), kind: 'ip', workspace: g.workspace, w: 30, h: 30, color: '#e8a33a', attachTo: g.id, port: k, labelVisible: true, labelAlign: 'below', labelSize: 12 };
      draft.graphics.push(ip);
    } else if (was.position === p.position && ip.workspace === g.workspace) { ip.label = vPortLabel(g, k, p); continue; }
    const [cx, cy] = vPortXY(g, k, p.position);
    Object.assign(ip, { workspace: g.workspace, x: Math.round(cx - 15), y: Math.round(cy - 15), label: vPortLabel(g, k, p) });
    moved.push(k);
  }
  return moved;
}
// a small pop-up after ports are placed: where they went and how to move them. It can be dragged out of the way.
function vesselPopup(g, placed) {
  $('#vpop')?.remove();
  const rows = Object.entries(eqClass(g).ports).filter(([k]) => g.ports?.[k]?.installed).map(([k, d]) => h('li', {}, `${vPortLabel(g, k, g.ports[k])}: ${g.ports[k].position || 'middle'}${d.ip ? (placed.includes(k) ? '' : ' (not moved)') : ' (not an IP, shown as a mark on the picture)'}`));
  const head = h('div', { class: 'vpop-head' }, `${g.label || g.name}: ports placed`);
  const close = h('button', { class: 'primary' }, 'OK, close');
  const box = h('div', { id: 'vpop', class: 'vpop' }, head,
    h('ul', {}, ...(rows.length ? rows : [h('li', {}, 'No ports installed.')])),
    h('p', {}, 'Check each IP sits on the right opening of the picture. To move one, drag it: it stays a port of this widget and moves with it. To add, remove or change ports, double-click the widget.'),
    h('p', { class: 'muted' }, 'Drag this box by its title to move it out of the way.'), close);
  close.onclick = () => box.remove();
  head.onpointerdown = ev => {
    const r = box.getBoundingClientRect(), dx = ev.clientX - r.left, dy = ev.clientY - r.top;
    const mv = e => { box.style.left = Math.max(0, e.clientX - dx) + 'px'; box.style.top = Math.max(0, e.clientY - dy) + 'px'; box.style.right = 'auto'; };
    const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); ev.preventDefault();
  };
  document.body.append(box);
}
// Cooling coils and plate chillers have IPs built in. Flow passes through each circuit: the coil has one (in -> out),
// the plate chiller has two that never mix (wort in -> wort out, water in -> water out).
function eqPorts(g) {
  if (g.kind !== 'vessel') return [];
  const x = g.x || 0, y = g.y || 0, w = g.w || 200, hh = g.h || 260, L_ = g.label || VESSELS[g.vesselType];
  const port = (k, text, circuit, cx, cy) => ({ id: `eq:${g.id}:${k}`, label: `${L_} ${text.toLowerCase()}`, text, circuit, c: [Math.round(cx), Math.round(cy)] });
  if (g.vesselType === 'coil') return [port('in', 'IN', 'a', x, y + hh * 0.25), port('out', 'OUT', 'a', x, y + hh * 0.75)];
  if (g.vesselType === 'plateChiller') return [port('wortIn', 'WORT IN', 'wort', x, y + hh * 0.2), port('wortOut', 'WORT OUT', 'wort', x + w, y + hh * 0.8),
    port('waterIn', 'WATER IN', 'water', x + w, y + hh * 0.2), port('waterOut', 'WATER OUT', 'water', x, y + hh * 0.8)];
  return [];
}
function buildEqIp(g, q) {
  const n = h('div', { class: 'gfx ip devip eqip', 'data-ipid': q.id, 'data-eq': g.id, title: q.label }, h('span', {}, q.text.replace('WORT ', 'W').replace('WATER ', 'C')));
  place(n, { x: q.c[0] - 11, y: q.c[1] - 11, w: 22, h: 22 });
  n.style.setProperty('--ipc', q.circuit === 'water' ? '#4fb3ff' : '#e8a33a');
  return n;
}
function placeEqIps(g) { for (const q of eqPorts(g)) { const n = $(`#ws .devip[data-ipid="${CSS.escape(q.id)}"]`); if (n) place(n, { x: q.c[0] - 11, y: q.c[1] - 11, w: 22, h: 22 }); } }
// label shared by vessels, equipment and IP widgets: position, color, size, show / hide
function widgetLabel(g, defPos) {
  const lb = h('div', { class: 'vlabel at-' + (LABEL_POS.includes(g.labelAlign) ? g.labelAlign : defPos) }, g.label);
  lb.style.color = g.labelColor || ''; lb.style.fontSize = (g.labelSize || 16) + 'px';
  return lb;
}
// standard colors for the flow widgets' color dropdowns ('' = the default color)
// Default = the item's normal color, None = no color at all (see-through)
const COLORS = [['Default', ''], ['None', 'transparent'], ['Red', '#e74c3c'], ['Green', '#3fbf6a'], ['Blue', '#4fb3ff'], ['Yellow', '#f1c40f'], ['Orange', '#e8a33a'], ['Purple', '#a87ee8'],
  ['Copper', '#d98a4a'], ['Brown', '#8b5a2b'], ['Steel grey', '#8a8f96'], ['Light grey', '#c9ced3'], ['White', '#ffffff'], ['Black', '#000000']];
const LABEL_POS = ['top', 'top-left', 'top-right', 'center', 'bottom', 'bottom-left', 'bottom-right', 'above', 'below'];
function buildVessel(g) {
  const t = VESSELS[g.vesselType] ? g.vesselType : 'mashTun';
  const n = h('div', { class: `gfx vessel v-${t}` + (g.image ? ' has-img' : ''), 'data-gid': g.id, 'data-heater': g.heater || '', title: (EQ[t] && g.name ? g.name + ': ' : '') + (g.label || VESSELS[t]) });
  place(n, g);
  if (g.image) n.style.backgroundImage = `url("${media(g.image)}")`;
  if (t === 'electric' || t === 'gas') n.append(h('div', { class: 'heat' }));
  for (const [k, d] of Object.entries(eqClass(g)?.ports || {})) {    // ports that are not IPs (thermowells) show as a mark
    const p = g.ports?.[k]; if (d.ip || !p?.installed) continue;
    const q = d.pos.find(q => q[0] === p.position) || [0, 0.5, 0.5];
    n.append(h('div', { class: 'twell', title: vPortLabel(g, k, p), style: `left:${q[1] * 100}%;top:${q[2] * 100}%` }, 'T'));
  }
  if (g.labelVisible !== false && g.label) n.append(widgetLabel(g, 'top'));
  if (editing) { editDeco(n, g); if (sel?.kind === 'gfx' && sel.id === g.id) n.classList.add('sel'); }
  return n;
}
// an IP dropped on a vessel becomes one of its ports
function attachIp(ip) {
  if (ip.port && draft.graphics.some(g => g.id === ip.attachTo)) return;   // a vessel's own port stays its port wherever it is dragged
  const [cx, cy] = ipCenter(ip);
  const v = [...draft.graphics].reverse().find(g => g.kind === 'vessel' && g.workspace === ip.workspace && cx >= g.x && cx <= g.x + g.w && cy >= g.y && cy <= g.y + g.h);
  if (v) ip.attachTo = v.id; else delete ip.attachTo;
}

function buildGfx(g) {
  const n = h('div', { class: 'gfx' + (g.kind === 'text' ? ' txt' : ''), 'data-gid': g.id });
  place(n, g);
  if (g.kind === 'image') n.style.backgroundImage = g.image ? `url("${media(g.image)}")` : '';
  else { setRich(n, g.text || ''); n.style.fontSize = (g.fontSize || 16) + 'px'; n.style.color = g.color || ''; n.style.fontWeight = g.bold ? '700' : ''; }
  if (editing) { editDeco(n, g); if (sel?.kind === 'gfx' && sel.id === g.id) n.classList.add('sel'); }
  return n;
}

// variable classes: shared, vKonstant, vAPI (the old Global class is retired: lib/globals.js)
const isVarEl = e => ['shared', 'vKonstant', 'vAPI'].includes(e?.type);
const isApiEl = e => e?.type === 'vAPI';
const vkKind = e => e?.type === 'vKonstant' ? (e.kind || 'value') : null;
const kindsOf = type => type === 'vKonstant' ? S.vkKinds : type === 'vAPI' ? S.vapiKinds : null;
const prefixOf = e => kindsOf(e.type)?.[e.kind || 'value']?.prefix;

// IP (Initial Point) widget: app-only, not tied to any PLC or device port. A small marker where a flow starts or ends, e.g. at a pump outlet, a vessel port or a drain
// IP widget types. "point" is a plain start / end point; the others are pipe fittings that join pipes and pass flow through.
const FITTINGS = { point: 'IP point', pipe: 'Pipe (straight)', tee: 'Pipe tee', elbow90: '90° elbow', elbow45: '45° elbow', cross: 'Pipe cross', manualValve: 'Manual valve', coupling: 'Coupling / hose end', cap: 'Pipe cap (no IP: dead end)' };
const isFitting = g => g && g.kind === 'ip' && g.fitting && g.fitting !== 'point';
const FIT_SVG = {
  pipe: '<path d="M0 15H30"/>', cap: '<path d="M0 15H17M20 5V25"/>',
  tee: '<path d="M0 15H30M15 15V30"/>', cross: '<path d="M0 15H30M15 0V30"/>',
  elbow90: '<path d="M0 15H15V30"/>', elbow45: '<path d="M0 15H15L27 27"/>',
  manualValve: '<path d="M15 15V3M9 3H21"/><path class="body" d="M2 7L15 15L2 23ZM28 7L15 15L28 23Z"/>',
  coupling: '<path class="collar" d="M15 9.5V20.5"/>',
};
// Each tab has a Pipe size: how thick a 1/2" pipe is drawn on that tab (default 10). Every pipe and hose has its own size
// (1/2" when not set), drawn in proportion: a 1" pipe is twice as thick as a 1/2" one. Sizes are kept in inches; the metric
// choices are the common mm sizes that match them (pipe: DN sizes, hose: inside diameter).
const pipeSize = wsn => +(L().workspaces.find(w => w.name === wsn)?.pipeSize) || 10;
const PIPE_SIZES = [['0.5', '1/2"  (most common)', '15 mm (DN15)'], ['1', '1"', '25 mm (DN25)'], ['0.75', '3/4"', '20 mm (DN20)'], ['0.25', '1/4"', '8 mm (DN8)'],
  ['2', '2"', '50 mm (DN50)'], ['3', '3"', '80 mm (DN80)'], ['4', '4"', '100 mm (DN100)'], ['5', '5"', '125 mm (DN125)'], ['6', '6"', '150 mm (DN150)']];
const HOSE_SIZES = [['0.5', '1/2"  (most common)', '13 mm'], ['1', '1"', '25 mm'], ['0.75', '3/4"', '19 mm'], ['0.25', '1/4"', '6 mm'], ['2', '2"', '50 mm']];
const sizeChoices = p => [...(p.hose ? HOSE_SIZES : PIPE_SIZES).map(([v, inch, mm]) => [v, p.sizeUnits === 'mm' ? mm : inch]), ['custom', 'Custom']];
function sizeInches(p) {
  if (p.size === 'custom') { const c = +p.sizeCustom; return c > 0 ? (p.sizeUnits === 'mm' ? c / 25.4 : c) : 0.5; }
  return +p.size > 0 ? +p.size : 0.5;
}
const pipeWidth = p => pipeSize(p.workspace) * sizeInches(p) / 0.5;
const sizeText = p => p.size === 'custom' ? (+p.sizeCustom > 0 ? p.sizeCustom + (p.sizeUnits === 'mm' ? ' mm' : '"') : '1/2"')
  : (sizeChoices(p).find(c => c[0] === String(p.size || '0.5'))?.[1] || '1/2"').replace(/ +\(most common\)/, '');
const pipesOn = (ipId, ws) => L().graphics.filter(p => p.kind === 'pipe' && p.workspace === ws && (p.from === ipId || p.to === ipId));
// A fitting takes the size of the largest pipe or hose joined to it (the tab's 1/2" size when nothing is joined yet).
// It is 5 x that pipe thickness, which makes its drawn arms exactly as thick as the pipe.
function sizeFitting(g) {
  const S = 5 * Math.max(0, ...pipesOn(g.id, g.workspace).map(pipeWidth)) || 5 * pipeSize(g.workspace), [cx, cy] = ipCenter(g);
  g.w = g.h = S; g.x = cx - S / 2; g.y = cy - S / 2;
}
// Skynet gives every pipe, hose, fitting and IP widget a fixed name (Fritz: Pipe_1, Pipe_2, Elbow_1 ...). It is shown in
// its settings and in the IP lists but cannot be typed over; the Label stays free text. Vessels keep the names users give them.
const NAME_PREFIX = { point: 'IP', pipe: 'Straight', tee: 'Tee', elbow90: 'Elbow', elbow45: 'Elbow45', cross: 'Cross', manualValve: 'ManualValve', coupling: 'Coupling', cap: 'Cap' };
const autoPrefix = g => g.kind === 'pipe' ? (g.hose ? 'Hose' : 'Pipe') : g.kind === 'ip' && !g.port ? NAME_PREFIX[g.fitting || 'point'] || 'IP' : null;
function giveName(g, all) {
  const p = autoPrefix(g); if (!p || (g.name && g.name.startsWith(p + '_'))) return;
  const used = new Set(all.map(x => x.name)); let n = 1; while (used.has(p + '_' + n)) n++;
  g.name = p + '_' + n;
}
const nameAll = gs => { for (const g of gs || []) giveName(g, gs); };
const ipName = g => g.name ? (g.label && g.label !== g.name ? `${g.name} (${g.label})` : g.name) : (g.label || g.id);

function buildIp(g) {
  const fit = isFitting(g) ? g.fitting : null;
  if (fit) sizeFitting(g);
  // a coupling on just one pipe end is an open end: it shows in Edit layout only; joining two pipes it shows as a collar
  const lonely = fit === 'coupling' && pipesOn(g.id, g.workspace).length < 2;
  const n = h('div', { class: 'gfx ip' + (fit ? ' fit' : '') + (lonely ? ' lonely' : '') + (g.hideRun ? ' hide-run' : ''), 'data-gid': g.id, 'data-fit': fit || '', title: (g.name ? ipName(g) : g.label || FITTINGS[fit] || 'IP') + (fit === 'manualValve' ? (g.open ? ' (open)' : ' (closed)') : '') });
  if (g.image) { n.classList.add('has-img'); n.style.backgroundImage = `url("${media(g.image)}")`; if (+g.rotate) n.style.transform = `rotate(${+g.rotate}deg)`; }
  else if (fit) {
    n.innerHTML = `<svg viewBox="0 0 30 30" style="transform:rotate(${+g.rotate || 0}deg)"><g class="edge">${FIT_SVG[fit]}</g><g class="core">${FIT_SVG[fit]}</g></svg>`;
    if (fit === 'manualValve') n.classList.add(g.open ? 'open' : 'closed');
  } else n.append(h('span', {}, g.text ?? 'IP'));
  place(n, g);
  n.style.setProperty('--ipc', g.color || '#e8a33a');
  if (g.labelVisible && g.label) n.append(widgetLabel(g, 'below'));
  if (editing) { if (!fit) n.append(h('div', { class: 'rs' })); if (g.label && !g.labelVisible) n.append(h('div', { class: 'iplbl' }, g.label)); if (sel?.kind === 'gfx' && sel.id === g.id) n.classList.add('sel'); }
  return n;
}

// Pumps and valves are Digital Output devices of kind "pump" or "valve". Each comes with two built-in IPs on the sides of its box:
// a pump has an inlet and an outlet, a valve has one at each end (flow can go either way through it).
const hasIps = e => e && ((e.type === 'digitalOut' && (e.subtype === 'pump' || e.subtype === 'valve')) || isPropValve(e) || isInline(e));
// Inline sensors sit in a pipe and always let flow through: a flow meter (from the PLC device library), or any input marked
// "Inline in a pipe" (for example a flow switch). They get IN and OUT IPs.
const isInline = e => e && (e.type === 'flowMeter' || (e.inline === true && ['digitalIn', 'analogIn'].includes(e.type)));
// Devices with IPs (pumps, valves, proportional valves, inline sensors) are drawn in proportion to the tab's pipe size.
// Their width / height are the size at pipe size 10; at any other pipe size they grow or shrink about their centre.
function elGeom(e) {
  const k = hasIps(e) ? pipeSize(e.workspace) / 10 : 1, w = e.w || 120, hh = e.h || 60;
  if (k === 1) return e;
  const cx = (e.x || 0) + w / 2, cy = (e.y || 0) + hh / 2;
  return { x: cx - w * k / 2, y: cy - hh * k / 2, w: w * k, h: hh * k };
}
// A proportional valve opens 0-100 %. It is an analog output (0-10 V / 4-20 mA) or a PWM output; until those output types exist
// it can also be a vKonstant value holding the percent. It passes flow whenever it is above 0 % open.
const PROP_TYPES = ['analogOut', 'pwmOut', 'vKonstant', 'vAPI', 'shared'];
const isPropValve = e => e && e.subtype === 'propValve' && PROP_TYPES.includes(e.type);
function propPct(e) {
  const v = Number(S.values[e.name]?.value) || 0;
  if (e.type !== 'analogOut') return v;
  const lo = Number(e.rangeLow ?? 0), hi = Number(e.rangeHigh ?? 100);
  return hi === lo ? 0 : (v - lo) / (hi - lo) * 100;
}
const SIDES = ['left', 'right', 'top', 'bottom'];
const VALVE_ENDS = { h: ['left', 'right'], v: ['top', 'bottom'], l45: ['topleft', 'bottomright'], r45: ['topright', 'bottomleft'] };
function sidePt(e, side) {
  const gm = elGeom(e), x = gm.x || 0, y = gm.y || 0, w = gm.w || 120, hh = gm.h || 60;
  if (side === 'topleft') return [x, y]; if (side === 'topright') return [x + w, y];
  if (side === 'bottomleft') return [x, y + hh]; if (side === 'bottomright') return [x + w, y + hh];
  return side === 'right' ? [x + w, y + hh / 2] : side === 'top' ? [x + w / 2, y] : side === 'bottom' ? [x + w / 2, y + hh] : [x, y + hh / 2];
}
// A valve has no inlet or outlet: its two IPs are plain ends and flow goes either way while it is open. They sit on the long
// sides of its picture (left and right if it is wider than tall, else top and bottom). A pump keeps IN and OUT: a running pump
// pushes from IN to OUT, and its head orientation is fixed, so the picture shows it rather than a setting.
// (Older layouts may still carry ipIn / ipOut sides; those are honoured.)
const devIps = e => {
  const v = !isInline(e) && (e.subtype === 'valve' || e.subtype === 'propValve');
  if (!v) return [{ id: `dev:${e.name}:in`, label: `${e.name} inlet`, text: 'IN', c: sidePt(e, e.ipIn || 'left') },
    { id: `dev:${e.name}:out`, label: `${e.name} outlet`, text: 'OUT', c: sidePt(e, e.ipOut || 'right') }];
  const wide = (e.w || 120) >= (e.h || 60), o = VALVE_ENDS[e.orientation];       // a Valve Profile's orientation sets the two ends
  return [{ id: `dev:${e.name}:in`, label: `${e.name} end`, text: '', c: sidePt(e, o?.[0] || e.ipIn || (wide ? 'left' : 'top')) },
    { id: `dev:${e.name}:out`, label: `${e.name} end`, text: '', c: sidePt(e, o?.[1] || e.ipOut || (wide ? 'right' : 'bottom')) }];
};
function buildDevIp(e, q) {
  const n = h('div', { class: 'gfx ip devip', 'data-ipid': q.id, 'data-dev': e.name, title: q.label }, h('span', {}, q.text));
  place(n, { x: q.c[0] - 11, y: q.c[1] - 11, w: 22, h: 22 });
  n.style.setProperty('--ipc', isInline(e) ? '#a87ee8' : e.subtype === 'pump' ? '#3fbf6a' : '#4fb3ff');
  return n;
}
function placeDevIps(e) {
  for (const q of devIps(e)) { const n = $(`#ws .devip[data-ipid="${CSS.escape(q.id)}"]`); if (n) place(n, { x: q.c[0] - 11, y: q.c[1] - 11, w: 22, h: 22 }); }
}

function buildEl(e) {
  const n = h('div', { class: 'el ' + e.type + (vkKind(e) ? ' k-' + vkKind(e) : ''), 'data-name': e.name }, h('div', { class: 'nm' }), h('div', { class: 'vl' }));
  if (vkKind(e) === 'switch') n.append(h('div', { class: 'slider' }, h('div', { class: 'knob' })));
  if (vkKind(e) === 'pushbutton' || vkKind(e) === 'momentary') n.append(h('div', { class: 'ledbtn' }));
  if (vkKind(e) === 'list') {        // vKonstant List: pick the Text, the element gets that choice's Value
    const s = h('select', { class: 'vksel', ...(editing || e.readOnly ? { disabled: true } : {}) }, ...(e.items || []).map(i => h('option', { value: String(i.value) }, i.text || String(i.value))));
    s.addEventListener('click', ev => ev.stopPropagation());
    s.onchange = () => { const it = (e.items || []).find(i => String(i.value) === s.value); if (it) setProp(e.name, 'value', it.value); };
    n.append(s);
  }
  if (e.type === 'manual') n.append(h('div', { class: 'mv' }, h('div', { class: 'mvPic' }), h('div', { class: 'mvRows' })));
  place(n, elGeom(e));
  if (e.hideName) n.querySelector('.nm').classList.add('hidden');
  styleEl(n, e);
  if (e.type === 'timer') n.append(h('div', { class: 'btns' },
    h('button', { title: 'Start', onclick: ev => { ev.stopPropagation(); setProp(e.name, 'running', true); } }, '▶'),
    h('button', { title: 'Stop', onclick: ev => { ev.stopPropagation(); setProp(e.name, 'running', false); } }, '■'),
    h('button', { title: 'Reset', onclick: ev => { ev.stopPropagation(); setProp(e.name, 'value', '00:00:00'); } }, '↺'),
    h('button', { class: 'tmSet', title: 'Set the time (hh:mm:ss)', onclick: ev => { ev.stopPropagation(); timerSetDialog(e); } }, 'Set')));
  if (editing) { editDeco(n, e); if (sel?.kind === 'el' && sel.id === e.name) n.classList.add('sel'); }
  fillEl(n, e);
  return n;
}

// Colors, fonts, alignment and border (imported from BruControl or set in the properties dialog)
const ALIGN = { Top: 'flex-start', Middle: 'center', Bottom: 'flex-end', Left: 'flex-start', Center: 'center', Right: 'flex-end' };
function fontCss(node, f) {
  if (!f) return;
  if (f.size) node.style.fontSize = (f.size * 4 / 3).toFixed(1) + 'px';
  if (f.bold) node.style.fontWeight = '700';
  if (f.italic) node.style.fontStyle = 'italic';
  if (f.family) node.style.fontFamily = `"${f.family}", var(--font)`;
}
function styleEl(n, e) {
  const nm = n.querySelector('.nm'), vl = n.querySelector('.vl');
  if (e.nameColor) nm.style.color = e.nameColor;
  if (e.nameBg) nm.style.backgroundColor = e.nameBg;
  if (e.valueColor) { vl.style.color = e.valueColor; vl.style.textShadow = 'none'; }
  if (e.valueBg) vl.style.backgroundColor = e.valueBg;
  fontCss(nm, e.nameFont); fontCss(vl, e.valueFont);
  if (e.valueEnlarge && !e.valueFont?.size) vl.style.fontSize = `calc(18px * ${1 + e.valueEnlarge / 100})`;
  const a = /^(Top|Middle|Bottom)(Left|Center|Right)$/;
  let m = a.exec(e.nameAlign ?? ''); if (m) nm.style.textAlign = m[2].toLowerCase();
  m = a.exec(e.valueAlign ?? ''); if (m) { vl.style.alignItems = ALIGN[m[1]]; vl.style.justifyContent = ALIGN[m[2]]; vl.style.textAlign = m[2].toLowerCase(); }
  if (e.border === 'hidden') n.classList.add('no-border');
  if (e.border === 'visible') n.classList.add('show-border');
}

function fmtVal(e, v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'number' && +e.digits > 0) {          // a Gauge: the whole number part padded to its digits (with figure spaces)
    const t = e.precision !== undefined && e.precision !== null && e.precision !== '' ? v.toFixed(+e.precision) : String(v), [i, f] = t.split('.');
    return i.padStart(+e.digits, '\u2007') + (f !== undefined ? '.' + f : '');
  }
  if (typeof v === 'number' && e.precision !== undefined && e.precision !== null && e.precision !== '') return v.toFixed(+e.precision);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}

// a Process can change the look while running (Pump_1.valueColor = "Red"); "" puts back the look from its properties
const LOOK_KEYS = { namecolor: 'nameColor', namebg: 'nameBg', valuecolor: 'valueColor', valuebg: 'valueBg', namealign: 'nameAlign', valuealign: 'valueAlign', digits: 'digits' };
function withLook(e, v) {
  if (!Object.keys(LOOK_KEYS).some(k => v[k] !== undefined) && v.valuetype === undefined) return e;
  const o = { ...e };
  for (const [k, K] of Object.entries(LOOK_KEYS)) if (v[k] !== undefined && v[k] !== '') o[K] = v[k];
  if (v.valuetype) o.look = lookFor(v.valuetype, e);
  return o;
}
function fillEl(n, e0) {
  const v = S.values[e0.name] || {}, e = withLook(e0, v);
  const nm = n.querySelector('.nm'), vl = n.querySelector('.vl');
  if (e !== e0 || n._looked) {             // re-apply the colors and placement (they may have been changed back)
    n._looked = e !== e0;
    for (const x of [nm, vl]) { x.style.color = x.style.backgroundColor = x.style.textAlign = x.style.textShadow = ''; }
    vl.style.alignItems = vl.style.justifyContent = '';
    styleEl(n, e);
  }
  setRich(nm, v.displayname ?? e.name);
  const pic = slotImage(e, v);
  let on = false, img = pic, text = '';
  switch (e.type) {
    case 'shared': case 'vAPI':
      if (e.dataType === 'bool' || e.kind === 'bool') { on = !!v.value; text = on ? (e.onText ?? 'TRUE') : (e.offText ?? 'FALSE'); break; }
      text = fmtVal(e, v.value) + (e.units ? ' ' + e.units : ''); break;
    case 'vKonstant':
      switch (vkKind(e)) {
        case 'graphic': img = v.value || img; text = ''; break;            // the value IS the picture path
        case 'list': {
          const s = n.querySelector('.vksel'), it = (e.items || []).find(i => String(i.value) === String(v.value));
          if (s && document.activeElement !== s) s.value = it ? String(it.value) : '';
          text = s ? '' : it ? it.text : fmtVal(e, v.value); break;
        }
        case 'switch': case 'pushbutton': case 'momentary': case 'bool':
          on = !!v.value; text = on ? (e.onText ?? 'ON') : (e.offText ?? 'OFF'); break;
        default: text = fmtVal(e, v.value) + (e.units ? ' ' + e.units : '');
      }
      n.classList.toggle('longtext', vkKind(e) === 'longstring');
      break;
    case 'digitalOut': case 'switch': case 'digitalIn':
      on = !!v.state; text = on ? (e.onText ?? 'ON') : (e.offText ?? 'OFF');
      if (e.type === 'digitalIn' && e.mode === 'counter') text = `${v.count ?? 0}${e.units ? ' ' + e.units : ''}`;
      img = (on ? v.imageon : v.imageoff) || pic; break;
    case 'temperature': case 'analogIn': text = v.fault ? 'FAULT' : (e.prefix ?? '') + fmtVal(e, v.value) + (e.units ? ' ' + e.units : ''); break;
    case 'pwmOut': on = !!v.enabled && v.value > 0; text = v.enabled ? fmtVal(e, v.value) + ' %' : (e.offText ?? 'OFF'); break;
    case 'analogOut': text = fmtVal(e, v.value) + (e.units ? ' ' + e.units : ''); on = v.enabled !== false && v.value > (e.rangeLow ?? 0); break;
    case 'scale': text = `${fmtVal(e, v.volume)} ${e.volumeUnits || 'gal'} · ${fmtVal(e, v.value)} ${e.weightUnits || 'lb'}`; break;
    case 'flowMeter': text = `${fmtVal(e, v.rate)} ${e.units || 'gal'}/min · ${fmtVal(e, v.total)} ${e.units || 'gal'}`; on = v.rate > 0; break;
    case 'stepper': {     // where it is, where it is going, and a warning while it has a home switch but has not found it
      const u = STEP_UNITS[e.units]?.[0] ?? e.units ?? '';
      text = v.enabled === false ? (e.offText ?? 'OFF') : `${fmtVal(e, v.position)} ${u}${v.moving && v.run === 0 ? `  ▸ ${fmtVal(e, v.target)}` : v.run ? `  ${v.run > 0 ? '▶' : '◀'}` : ''}${e.homePin !== undefined && e.homePin !== '' && !v.homed ? '  (not homed)' : ''}`;
      on = !!v.moving; break;
    }
    case 'dutyCycle': on = !!v.state; text = v.enabled ? `${fmtVal({}, v.dutycycle)} %` : (e.offText ?? 'OFF'); break;
    case 'hysteresis': on = !!v.state; text = v.enabled ? `${on ? (e.onText ?? 'ON') : (e.offText ?? 'OFF')}  ▸ ${fmtVal({}, v.target)}` : (e.offText ?? 'OFF'); break;
    case 'pid': on = !!v.enabled && v.value > 0; text = v.enabled ? `${fmtVal({ precision: 0 }, v.value)} %  ▸ ${fmtVal({}, v.target)}` : (e.offText ?? 'OFF'); break;
    case 'timer': text = v.value ?? '00:00:00'; on = !!v.running; break;
    case 'alarm': text = v.active ? (e.activeText ?? 'ALARM') + (v.playing || !hasSoundNow(e, v) ? '' : '  (waiting)') : (e.idleText ?? ''); n.classList.toggle('active', !!v.active);
      img = (v.active ? v.imageon : v.imageoff) || pic; n.classList.toggle('img-alarm', !!(v.imageon || pic)); break;
    case 'soundPlayer': on = !!v.active; text = `${v.playing ? 'Playing' : v.active ? 'Paused for an alarm' : 'Stopped'}: ${String(v.path || '(no sound file)').split('/').pop()}`; break;
    case 'label': text = v.displayname ?? e.name; nm.classList.add('hidden'); break;
    case 'manual': fillManual(n, e, v); on = !!v.heat || !!v.pump; text = v.message || ''; break;
    case 'picture':
      // A screen picture: static image, or it follows another element (on image / off image)
      if (e.follow) { on = isOn(e.follow); img = (on ? v.imageon : v.imageoff) || pic; }
      text = e.text ?? ''; break;
  }
  if (isPropValve(e)) {                              // show percent open, and the open / closed picture
    const pct = propPct(e); on = pct > 0;
    text = `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
    img = (on ? (v.imageon || e.imageOn) : (v.imageoff || e.imageOff)) || pic;
  }
  if (e.type === 'label') n.classList.add('text');
  for (const k of ['led', 'lcd', 'dark', 'button', 'indicator']) n.classList.toggle('look-' + k, e.look === k);
  if (e.look === 'indicator') n.style.setProperty('--ind', on || v.active ? (e.onColor || 'green') : (e.offColor && e.offColor !== 'off' ? e.offColor : 'transparent'));
  setRich(vl, e.hideValue ? '' : text);
  n.classList.toggle('on', on && e.type !== 'picture');
  n.classList.toggle('vhidden', v.visibility === 'hidden');
  n.classList.toggle('fault', !!v.fault);
  // a picture that is not in the media folders (BruControl pictures not copied yet) would leave a see-through
  // button with white text: show the plain gray button with black text instead
  const isButton = e.type === 'switch' || ['switch', 'pushbutton', 'momentary'].includes(vkKind(e)) || e.look === 'button';
  const missing = img && isButton && imgMissing(media(img), n);
  if (missing) img = '';
  n.classList.toggle('img-missing', !!missing);
  const stretch = !!e.imagePathsLocked && hasPictures(e, v);
  n.style.backgroundColor = img || missing ? '' : bg(v.background);
  // a valve at 45 degrees (Fritz: on a 45 degree elbow) shows its vertical picture turned left or right
  const turn = img && e.subtype === 'valve' ? { l45: -45, r45: 45 }[e.orientation] : 0;
  n.classList.toggle('turned', !!turn);
  if (turn) { n.style.backgroundImage = ''; n.style.setProperty('--pic', `url("${media(img)}")`); n.style.setProperty('--turn', turn + 'deg'); }
  else n.style.backgroundImage = img ? `url("${media(img)}")` : '';
  n.classList.toggle('has-img', !!img);
  if (e.fontSize) vl.style.fontSize = e.fontSize + 'px';
  n.classList.toggle('stretch', stretch);    // imported BruControl pictures fill the item
  n.classList.toggle('clickable', !editing && tapAction(e) !== 'none');
}
// pictures that failed to load: true = missing, false = fine, a Set = still loading (nodes to refresh when known)
const imgState = new Map();
function imgMissing(url, node) {
  const st = imgState.get(url);
  if (st === true || st === false) return st;
  if (st) { st.add(node); return false; }
  const wait = new Set([node]); imgState.set(url, wait);
  const im = new Image();
  const done = bad => { imgState.set(url, bad); if (bad) for (const n of wait) { const e = n.isConnected && L().elements.find(x => x.name === n.dataset.name); if (e) fillEl(n, e); } };
  im.onload = () => done(false); im.onerror = () => done(true);
  im.src = url;
  return false;
}
const simDev = d => !d || S.devices.find(x => x.name === d)?.type === 'simulator';

function updateEl(name) {
  const n = $(`#ws .el[data-name="${CSS.escape(name)}"]`);
  const e = L().elements.find(x => x.name === name);
  if (n && e) fillEl(n, e);
  for (const p of L().elements) if (p.type === 'picture' && p.follow === name) { const pn = $(`#ws .el[data-name="${CSS.escape(p.name)}"]`); if (pn) fillEl(pn, p); }
}

async function setProp(name, prop, value) { try { await api('POST', '/ui/set', { name, prop, value }); } catch (e) { toast(e.message, true); } }

// ---- tap / click actions (mouse or touch screen) ----
// tap: default | none | toggle | dialog | script | workspace (shown as "tab"),   tapTarget: element / script / tab (default = itself)
function tapAction(e) {
  if (e.tap && e.tap !== 'default') return e.tap;
  switch (e.type) {
    case 'digitalOut': case 'switch': return 'toggle';
    case 'digitalIn': return ['latch', 'toggle', 'counter'].includes(e.mode) || (e.mode === 'momentary' && simDev(e.device)) ? 'dialog' : simDev(e.device) ? 'toggle' : 'none';
    case 'pwmOut': case 'analogOut': case 'scale': case 'stepper': return 'dialog';
    case 'analogIn': case 'temperature': return simDev(e.device) && !e.sim ? 'dialog' : 'none';
    case 'alarm': return 'acknowledge';
    case 'soundPlayer': return 'toggle';
    case 'shared': case 'vAPI': return e.readOnly ? 'none' : 'dialog';
    case 'vKonstant':
      if (e.readOnly) return 'none';
      return { switch: 'toggle', pushbutton: 'hold', momentary: 'pulse' }[vkKind(e)] || 'dialog';
    case 'picture': return e.follow ? 'toggle' : 'none';
    case 'manual': return 'manual';
    case 'pwmOut': case 'dutyCycle': case 'hysteresis': case 'pid': return 'dialog';
    default: return 'none';
  }
}
const elByName = n => S.config.elements.find(x => x.name === n);
const boolProp = t => t.type === 'alarm' || t.type === 'soundPlayer' ? 'active' : t.type === 'digitalIn' ? 'raw' : isVarEl(t) ? 'value' : 'state';
const isBoolEl = t => ['digitalOut', 'switch', 'digitalIn', 'alarm', 'soundPlayer'].includes(t.type) || (isVarEl(t) && t.dataType === 'bool');

async function doTap(e) {
  const act = tapAction(e);
  if (!['none', 'workspace'].includes(act) && !can('operator')) return toast('Your account is view only', true);
  const targetName = e.tapTarget || (e.type === 'picture' ? e.follow : e.name);
  if (act === 'none' || act === 'hold') return;          // push and hold buttons work on press / release (below)
  if (act === 'pulse') { const t = elByName(targetName); if (t && isBoolEl(t)) setProp(t.name, boolProp(t), true); return; }
  if (act === 'acknowledge') { if (S.values[e.name]?.active) setProp(e.name, 'active', false); return; }
  if (act === 'manual') return manualDialog(elByName(targetName) || e);
  if (act === 'workspace') { if (S.config.workspaces.some(w => w.name === targetName)) { wsName = targetName; renderTabs(); renderWs(); } return; }
  if (act === 'script') {
    if (e.confirm && !(await choose(`Start process ${targetName}?`, [['Start', true]]))) return;
    try { const r = await api('POST', `/ui/scripts/${encodeURIComponent(targetName)}/start`); if (!r.ok) toast(r.msg, true); else toast(`Started ${targetName}`); } catch (x) { toast(x.message, true); }
    return;
  }
  const t = elByName(targetName); if (!t) return toast(`No element "${targetName}"`, true);
  if (act === 'toggle' && isBoolEl(t)) {
    const cur = t.type === 'digitalIn' ? !!S.values[t.name]?.raw : isOn(t.name);     // simulator: the tap is the switch itself
    if (e.confirm) { const r = await choose(`${S.values[t.name]?.displayname ?? t.name}`, [['ON', true], ['OFF', false]], cur); if (r === undefined) return; return setProp(t.name, boolProp(t), r); }
    return setProp(t.name, boolProp(t), !cur);
  }
  return valueDialog(t);
}

// Push Button (vKonstant): ON while pressed, OFF when released. "down" repeats every 0.5 s so the server
// lets go by itself if this screen disappears while the button is held.
let held = null;
function release() {
  if (!held) return;
  clearInterval(held.t); held.n.classList.remove('pressed');
  api('POST', '/ui/hold', { name: held.name, down: false }).catch(x => toast(x.message, true));
  held = null;
}
$('#ws').addEventListener('pointerdown', ev => {
  if (editing || ev.button !== 0) return;     // the right button is for Help, it never presses a push button
  const n = ev.target.closest('.el'); const e = n && elByName(n.dataset.name);
  if (!e || tapAction(e) !== 'hold') return;
  ev.preventDefault(); release();
  const name = e.tapTarget || e.name;
  const send = () => api('POST', '/ui/hold', { name, down: true }).catch(x => { toast(x.message, true); release(); });
  held = { name, n, t: setInterval(send, 500) }; n.classList.add('pressed'); send();
  n.setPointerCapture?.(ev.pointerId);
});
for (const t of ['pointerup', 'pointercancel', 'blur']) window.addEventListener(t, release);
document.addEventListener('visibilitychange', () => { if (document.hidden) release(); });
$('#ws').addEventListener('contextmenu', ev => { if (!editing && ev.target.closest('.el.k-pushbutton')) ev.preventDefault(); });

$('#ws').addEventListener('click', ev => {
  if (editing) return;
  const mv = ev.target.closest('.gfx.ip[data-fit="manualValve"]');
  if (mv) return toggleManualValve(mv.dataset.gid);
  const n = ev.target.closest('.el'); if (!n || ev.target.closest('.btns')) return;
  const e = elByName(n.dataset.name); if (e) doTap(e);
});

// A manual valve is app-only (no PLC): tapping it asks Open / Closed and saves that in the layout so every screen sees it
const toggleManualValve = guard(async id => {
  const g = S.config.graphics.find(x => x.id === id); if (!g) return;
  const r = await choose(g.label || 'Manual valve', [['Open', true], ['Closed', false]], !!g.open);
  if (r === undefined || r === !!g.open) return;
  const graphics = clone(S.config.graphics); graphics.find(x => x.id === id).open = r;
  await api('PUT', '/ui/layout', { graphics });
  g.open = r; renderWs();
});

// Big touch-friendly dialogs
function choose(title, buttons, current) {
  return new Promise(res => {
    const d = $('#valDlg'); d.innerHTML = '';
    const close = v => { d.close(); res(v); };
    const tt = h('div', { class: 'vdTitle' }); setRich(tt, title);
    d.append(tt,
      h('div', { class: 'vdBtns' }, ...buttons.map(([label, val]) => h('button', { type: 'button', class: 'big' + (val === current ? ' cur' : '') + (val === true ? ' onb' : val === false ? ' offb' : ''), onclick: () => close(val) }, label))),
      h('div', { class: 'vdBtns' }, h('button', { type: 'button', class: 'big', onclick: () => close(undefined) }, 'Cancel')));
    d.oncancel = () => res(undefined);
    d.showModal();
  });
}

// main setting of each control element, shown with an Enabled switch in its dialog
const CONTROL_MAIN = { pwmOut: ['value', 'Output %'], dutyCycle: ['dutycycle', 'Duty cycle %'], hysteresis: ['target', 'Target'], pid: ['target', 'Target'] };
function controlDialog(t) {
  const v = S.values[t.name] || {};
  const [prop, label] = CONTROL_MAIN[t.type];
  const d = $('#valDlg'); d.innerHTML = '';
  const inp = h('input', { class: 'vdInput', value: fmtVal({}, v[prop]), inputmode: 'decimal' });
  const bump = k => { inp.value = String(+((parseFloat(inp.value) || 0) + k).toFixed(4)); };
  const done = async en => {
    const x = parseFloat(inp.value);
    if (!Number.isFinite(x)) return toast('Enter a number', true);
    d.close();
    await setProp(t.name, prop, x);
    if (en !== undefined) await setProp(t.name, 'enabled', en);
  };
  d.append(h('div', { class: 'vdTitle' }, `${v.displayname ?? t.name} - ${label}` + (t.type === 'pid' ? ` (output ${fmtVal({ precision: 1 }, v.value)} %)` : '')),
    h('div', { class: 'vdRow' }, h('button', { type: 'button', class: 'big', onclick: () => bump(-1) }, '−'), inp, h('button', { type: 'button', class: 'big', onclick: () => bump(1) }, '+')),
    h('div', { class: 'vdBtns' },
      h('button', { type: 'button', class: 'big onb' + (v.enabled ? ' cur' : ''), onclick: () => done(true) }, 'Set + ON'),
      h('button', { type: 'button', class: 'big offb' + (!v.enabled ? ' cur' : ''), onclick: () => done(false) }, 'OFF'),
      h('button', { type: 'button', class: 'big primary', onclick: () => done() }, 'Set')),
    h('div', { class: 'vdBtns' }, h('button', { type: 'button', class: 'big', onclick: () => d.close() }, 'Cancel')));
  d.showModal(); setTimeout(() => { inp.focus(); inp.select(); }, 50);
}

// Manual vessel widget (BrewZilla, DigiBoil and other appliances with their own controller): no board pin.
// A script says what to set by hand (setpoint, heat, pump, timer, message) and waits for the brewer to confirm here.
function fillManual(n, e, v) {
  const u = e.units || '°F', rows = n.querySelector('.mvRows'), pic = n.querySelector('.mvPic');
  const img = (v.heat ? (e.imageOn || e.image) : (e.imageOff || e.image)) || '';
  pic.style.backgroundImage = img ? `url("${media(img)}")` : '';
  pic.classList.toggle('hidden', !img);
  const row = (k, val, cls = '') => h('div', { class: 'mvRow ' + cls }, h('span', {}, k), h('b', {}, val));
  rows.innerHTML = '';
  rows.append(row('Set to', `${fmtVal({ precision: e.precision ?? 0 }, v.setpoint)} ${u}`),
    row('Heat', v.heat ? 'ON' : 'OFF', v.heat ? 'hot' : ''),
    ...(e.noPump ? [] : [row('Pump', v.pump ? 'ON' : 'OFF', v.pump ? 'run' : '')]),
    ...(v.timer && v.timer !== '00:00:00' ? [row('Timer', v.timer)] : []),
    ...(v.reading ? [row('Reads', `${fmtVal({ precision: 1 }, v.reading)} ${u}`)] : []),
    ...(v.volume ? [row('Volume', `${fmtVal({ precision: 2 }, v.volume)} ${e.volumeUnits || 'gal'}`)] : []));
  n.classList.toggle('waiting', !!v.waiting);
}
async function manualDialog(t) {
  const v = S.values[t.name] || {}, title = v.displayname ?? t.name;
  const r = await choose(v.waiting ? `${title}: ${v.message || 'confirm when done'}` : title,
    [...(v.waiting ? [['Done ✓', 'ok']] : []), ['Enter the temperature it shows', 'reading'], ['Enter the volume in it', 'volume']]);
  if (r === 'ok') { await setProp(t.name, 'confirmed', true); return setProp(t.name, 'waiting', false); }
  if (r === 'reading' || r === 'volume') {
    const x = parseFloat(prompt(r === 'reading' ? `Temperature on the ${title} display (${t.units || '°F'}):` : `Volume in the ${title} (${t.volumeUnits || 'gal'}):`, '') || '');
    if (Number.isFinite(x)) setProp(t.name, r, x);
  }
}

function valueDialog(t) {
  if (CONTROL_MAIN[t.type]) return controlDialog(t);
  const v = S.values[t.name] || {};
  const title = v.displayname ?? t.name;
  if (t.type === 'scale') return scaleDialog(t, title);
  if (t.type === 'stepper') return stepperDialog(t, title);
  if (t.type === 'digitalIn') {   // latch / toggle: reset to off; counter: count back to 0
    const sim = !simDev(t.device) ? [] : t.mode === 'momentary' ? [['Simulate: press', 'press']] : [['Simulate: input ON', 'on'], ['Simulate: input OFF', 'off']];
    return choose(title, [...sim, ['counter', 'momentary'].includes(t.mode) ? ['Reset count to 0', 'count'] : ['Reset (off)', 'reset']])
      .then(async r => r === 'press' ? (await setProp(t.name, 'raw', true), setProp(t.name, 'raw', false)) : r === 'count' ? setProp(t.name, 'count', 0) : r === 'reset' ? setProp(t.name, 'reset', true) : r ? setProp(t.name, 'raw', r === 'on') : undefined);
  }
  if (isBoolEl(t)) return choose(title, [['ON', true], ['OFF', false]], isOn(t.name)).then(r => r !== undefined && setProp(t.name, boolProp(t), r));
  const numDev = ['pwmOut', 'analogOut', 'analogIn', 'temperature'].includes(t.type);
  if (!(isVarEl(t) || numDev) || t.readOnly) return;
  if (numDev) t = { ...t, dataType: 'value', units: t.type === 'pwmOut' ? '%' : t.units,
    min: t.type === 'pwmOut' ? 0 : t.type === 'analogOut' ? (t.rangeLow ?? 0) : t.min, max: t.type === 'pwmOut' ? 100 : t.type === 'analogOut' ? (t.rangeHigh ?? 100) : t.max };
  const d = $('#valDlg'); d.innerHTML = '';
  const num = t.dataType === 'value', k = vkKind(t);
  const inp = t.dataType === 'string' && k !== 'graphic'
    ? h('textarea', { class: 'vdInput', rows: k === 'longstring' ? 12 : 3 }, v.value ?? '')
    : h('input', { class: 'vdInput', value: num ? fmtVal(t, v.value) : (v.value ?? ''), inputmode: num ? 'decimal' : 'text', placeholder: { time: 'hh:mm:ss', datetime: 'mm/dd/yyyy hh:mm:ss' }[t.dataType] ?? (k === 'graphic' ? 'image path, e.g. Images/BurnerFlame.png' : '') });
  const step = +t.step || 1;
  const bump = k => { const x = (parseFloat(inp.value) || 0) + k * step; inp.value = t.precision !== undefined && t.precision !== '' ? x.toFixed(+t.precision) : String(+x.toFixed(6)); };
  const done = ok => {
    if (ok) {
      let val = inp.value;
      if (num) { const x = parseFloat(val); if (!Number.isFinite(x)) return toast('Enter a number', true); if (t.min !== undefined && x < t.min) return toast(`Lowest is ${t.min}`, true); if (t.max !== undefined && x > t.max) return toast(`Highest is ${t.max}`, true); val = x; }
      setProp(t.name, 'value', val);
    }
    d.close();
  };
  d.append(h('div', { class: 'vdTitle' }, title + (t.units ? ` (${t.units})` : '')),
    k === 'longstring' && v.file ? h('div', { class: 'muted' }, 'Saved to ' + v.file) : '',
    num ? h('div', { class: 'vdRow' }, h('button', { type: 'button', class: 'big', onclick: () => bump(-1) }, '−'), inp, h('button', { type: 'button', class: 'big', onclick: () => bump(1) }, '+')) : inp,
    h('div', { class: 'vdBtns' }, h('button', { type: 'button', class: 'big', onclick: () => done(false) }, 'Cancel'), h('button', { type: 'button', class: 'big primary', onclick: () => done(true) }, 'Set')));
  inp.addEventListener('keydown', ke => { if (ke.key === 'Enter' && inp.tagName === 'INPUT') { ke.preventDefault(); done(true); } });
  d.showModal(); setTimeout(() => { inp.focus(); inp.select?.(); }, 50);
}

// Timer: Set button. Hours : minutes : seconds in three boxes (00:00:00), keeps running or stopped as it was
function timerSetDialog(t) {
  const v = S.values[t.name] || {};
  const cur = String(v.value ?? '00:00:00').split(':').map(x => parseInt(x, 10) || 0);
  while (cur.length < 3) cur.unshift(0);
  const d = $('#valDlg'); d.innerHTML = '';
  const box = (val, label) => h('label', { class: 'tmBox' }, h('input', { class: 'vdInput', value: String(val).padStart(2, '0'), inputmode: 'numeric', 'aria-label': label,
    onfocus: ev => ev.target.select() }), h('span', { class: 'muted' }, label));
  const hh = box(cur[0], 'hours'), mm = box(cur[1], 'minutes'), ss = box(cur[2], 'seconds');
  const ins = [hh, mm, ss].map(b => b.querySelector('input'));
  const done = ok => {
    if (ok) {
      const [H, M, Sx] = ins.map(i => i.value.trim() === '' ? 0 : Number(i.value.trim()));
      if (![H, M, Sx].every(x => Number.isInteger(x) && x >= 0)) return toast('Use whole numbers, for example 01:30:00', true);
      if (M > 59 || Sx > 59) return toast('Minutes and seconds go up to 59', true);
      setProp(t.name, 'value', [H, M, Sx].map(x => String(x).padStart(2, '0')).join(':'));
    }
    d.close();
  };
  // typing or pasting a whole time like 1:30:00 into any box fills all three
  for (const i of ins) i.addEventListener('input', () => {
    const m = /^(\d+):(\d{1,2})(?::(\d{1,2}))?$/.exec(i.value.trim());
    if (m) { const parts = m[3] === undefined ? [0, m[1], m[2]] : [m[1], m[2], m[3]]; ins.forEach((x, k) => { x.value = String(parts[k]).padStart(2, '0'); }); }
  });
  for (const i of ins) i.addEventListener('keydown', ke => { if (ke.key === 'Enter') { ke.preventDefault(); done(true); } });
  d.append(h('div', { class: 'vdTitle' }, `${v.displayname ?? t.name} - set time`),
    h('div', { class: 'vdRow tmRow' }, hh, h('b', {}, ':'), mm, h('b', {}, ':'), ss),
    h('div', { class: 'muted' }, v.running ? 'It keeps running from the new time.' : ((v.type ?? t.timerType) === 'countdown' ? 'Counts down from this time when started.' : 'Counts up from this time when started.')),
    h('div', { class: 'vdBtns' }, h('button', { type: 'button', class: 'big', onclick: () => done(false) }, 'Cancel'), h('button', { type: 'button', class: 'big primary', onclick: () => done(true) }, 'Set')));
  d.showModal(); setTimeout(() => { ins[0].focus(); ins[0].select(); }, 50);
}

// Scale: Tare (zero it now) or calibrate with a known weight
async function scaleDialog(t, title) {
  const r = await choose(title, [['Tare (zero)', 'tare'], ['Calibrate…', 'cal']]);
  if (r === 'tare') return setProp(t.name, 'tare', true);
  if (r === 'cal') {
    const w = parseFloat(prompt(`1. Tare the empty scale first.\n2. Put a known weight on it.\n3. Enter that weight in ${t.weightUnits || 'lb'}:`) || '');
    if (w > 0) { await setProp(t.name, 'calibrate', w); toast('Scale calibrated'); }
  }
}

// Stepper: move it from the screen (the same properties a Process sets)
async function stepperDialog(t, title) {
  const v = S.values[t.name] || {}, u = STEP_UNITS[t.units]?.[0] ?? t.units ?? '', lim = [t.minPos, t.maxPos].some(x => x !== undefined && x !== '') ? `  (allowed ${t.minPos ?? '…'} to ${t.maxPos ?? '…'})` : '';
  const hasHome = t.homePin !== undefined && t.homePin !== '';
  const r = await choose(`${title}: at ${fmtVal(t, v.position)} ${u}`, [
    ['Move to …', 'target'], ['Move by …', 'move'], ['Turn at a speed …', 'run'], ['Stop', 'stop'],
    ...(hasHome ? [['Home (find the switch)', 'home']] : []), ['Call this position home', 'reset'],
    v.enabled === false ? ['Turn the motor on', 'on'] : ['Turn the motor off (free to turn by hand)', 'off']]);
  if (!r) return;
  if (['stop', 'home', 'reset'].includes(r)) return setProp(t.name, r, true);
  if (r === 'on' || r === 'off') return setProp(t.name, 'enabled', r === 'on');
  const ask = { target: `Go to which position (${u})?${lim}`, move: `Move by how much (${u}, minus = backward)?`, run: `Turn at how many ${u} per second (minus = backward, 0 = stop)?` }[r];
  const x = parseFloat(prompt(ask, r === 'target' ? fmtVal(t, v.target) : '') ?? '');
  if (Number.isFinite(x)) setProp(t.name, r, x);
}

// ---- pipes: drawn lines that show flow when all of their "flow when" elements are on
function isOn(name) {
  const v = S.values[name]; if (!v) return false;
  if ('state' in v) return !!v.state;
  if ('active' in v) return !!v.active;
  if ('running' in v) return !!v.running;
  return !!v.value && v.value !== '0' && v.value !== 'false';
}
let drawPts = null, drawCursor = null, drawFrom = null, drawHose = false, drawOnIp = null;
const ipCenter = g => [(g.x || 0) + (g.w || 30) / 2, (g.y || 0) + (g.h || 30) / 2];
// An IP id is either an IP widget's id, or "dev:<name>:in" / "dev:<name>:out" for the built-in IPs of a pump or valve
const devOfIp = id => (typeof id === 'string' && id.startsWith('dev:')) ? id.slice(4, id.lastIndexOf(':')) : null;
const eqOfIp = id => (typeof id === 'string' && id.startsWith('eq:')) ? id.slice(3, id.lastIndexOf(':')) : null;
const eqPort = (id, ws) => { const gid = eqOfIp(id); const g = gid && L().graphics.find(x => x.id === gid && (!ws || x.workspace === ws)); return g ? eqPorts(g).find(q => q.id === id) : null; };
function ipPoint(id, ws) {
  if (!id) return null;
  if (eqOfIp(id) !== null) return eqPort(id, ws)?.c || null;
  const pn = devOfIp(id);
  if (pn !== null) { const e = L().elements.find(x => x.name === pn); if (!hasIps(e) || (ws && e.workspace !== ws)) return null; return devIps(e).find(q => q.id === id)?.c || null; }
  const g = L().graphics.find(g => g.kind === 'ip' && g.id === id && (!ws || g.workspace === ws));
  return g ? ipCenter(g) : null;
}
function allIps(ws) {
  const vn = id => { const v = L().graphics.find(x => x.id === id); return v ? (v.name || v.label || '') + ' ' : ''; };
  return [...L().graphics.filter(g => g.kind === 'ip' && g.workspace === ws).map(g => ({ id: g.id, label: (g.port ? vn(g.attachTo) + (g.label || g.id) : ipName(g)) })),
    ...L().elements.filter(e => hasIps(e) && e.workspace === ws).flatMap(e => devIps(e)),
    ...L().graphics.filter(g => g.workspace === ws).flatMap(eqPorts)];
}
// ---- flow through the pipe network
// Pipes join IPs. Each IP belongs to a node:
//  - a running pump: OUT pushes flow out, IN pulls flow in
//  - an open tap water valve: tap pressure pushes flow out, no pump needed
//  - a pump that is off, an open valve, a fitting or an open manual valve: flow passes straight through, either way
//  - a cooling coil or plate chiller circuit: passes flow through (the chiller's wort and water circuits stay separate)
//  - a closed valve, closed manual valve or pipe cap: blocks every pipe on it
//  - a plain IP point: an end of the line (a vessel port, an outlet), where flow can come from or go to
// Flow is traced from each running pump (and each open tap water valve) out to the IP points it reaches, and from each IP point into each running pump's IN.
// The direction of each pipe comes from that trace, so a pipe can show flow backwards through a pump that is off.
// A pipe between two plain IP points with a "Flow when" list keeps the old rule: it flows, as drawn, while all of those are on.
// my_Valve.tapwater set by a Process wins over the valve's setting until the valve is saved again or the panel restarts
const tapWater = e => !!(editing ? e.tapwater : S.values[e.name]?.tapwater ?? e.tapwater);
const pipeJoined = p => !!(ipPoint(p.from, p.workspace) && ipPoint(p.to, p.workspace));
function ipNode(id, ws) {
  const q = eqOfIp(id) !== null && eqPort(id, ws);
  if (q) return { key: `eq:${eqOfIp(id)}:${q.circuit}`, pass: true };
  const dn = devOfIp(id);
  if (dn !== null) {
    const e = L().elements.find(x => x.name === dn), on = isOn(dn), end = id.slice(id.lastIndexOf(':') + 1);
    // a tap water valve that is open is a source: water pushes out of both of its ends (only the pipe side shows flow)
    if (e.subtype === 'valve') return !on ? { closed: true } : tapWater(e) ? { key: id, push: true } : { key: 'dev:' + dn, pass: true };
    if (isInline(e)) return { key: 'dev:' + dn, pass: true };
    if (e.subtype === 'propValve') return propPct(e) > 0 ? { key: 'dev:' + dn, pass: true } : { closed: true };
    return on ? { key: id, push: end === 'out', pull: end === 'in' } : { key: 'dev:' + dn, pass: true };
  }
  const g = L().graphics.find(g => g.id === id && g.workspace === ws);
  if (g?.port) {      // a port of an equipment widget: ports on the same circuit pass flow (chiller side, coil, filter, fitting)
    const v = L().graphics.find(x => x.id === g.attachTo), c = eqClass(v)?.ports[g.port]?.circuit;
    if (c) return { key: `eq:${v.id}:${c}`, pass: true };
  }
  if ((g?.fitting === 'manualValve' && !g.open) || g?.fitting === 'cap') return { closed: true };
  // a coupling joining two or more pipes / hoses passes flow; a hose end with nothing else on it is an open end (flow pours out)
  if (g?.fitting === 'coupling' && pipesOn(id, ws).length < 2) return { key: id, end: true };
  return isFitting(g) ? { key: id, pass: true } : { key: id, end: true };
}
function computeFlow(ws) {
  const dir = new Map();                         // pipe id -> 1 (as drawn) or -1 (backwards)
  const nodes = new Map(), adj = new Map();
  const node = id => { const n = ipNode(id, ws); if (n.key && !nodes.has(n.key)) nodes.set(n.key, n); return n; };
  for (const p of L().graphics.filter(g => g.kind === 'pipe' && g.workspace === ws && pipeJoined(g))) {
    if (!(p.flowWhen || []).every(isOn)) continue;
    const a = node(p.from), b = node(p.to);
    if (a.closed || b.closed || a.key === b.key) continue;
    if (a.end && b.end) { if ((p.flowWhen || []).length) dir.set(p.id, 1); continue; }
    for (const [u, v, d] of [[a.key, b.key, 1], [b.key, a.key, -1]]) { if (!adj.has(u)) adj.set(u, []); adj.get(u).push({ v, p, d }); }
  }
  // breadth-first trace from a pump to every plain IP point (or other running pump) it reaches; mark the pipes on each route
  const trace = (start, outward) => {
    const prev = new Map([[start, null]]), queue = [start];
    while (queue.length) {
      const u = queue.shift();
      if (u !== start && !nodes.get(u).pass) {            // reached an end of the line: mark the route back to the start
        const n = nodes.get(u);
        if (n.end || (outward ? n.pull : n.push)) for (let k = u; prev.get(k); k = prev.get(k).from) { const st = prev.get(k); dir.set(st.p.id, outward ? st.d : -st.d); }
        continue;
      }
      for (const { v, p, d } of adj.get(u) || []) if (!prev.has(v)) { prev.set(v, { from: u, p, d }); queue.push(v); }
    }
  };
  for (const [k, n] of nodes) { if (n.push) trace(k, true); if (n.pull) trace(k, false); }
  return dir;
}
// Keep pipe ends on their IPs. The bend next to the end follows, so square corners stay square (a hose just bends).
function snapEnd(pts, i, j, c) {
  const old = pts[i], nb = pts[j];
  if (nb && j !== undefined) { if (nb[1] === old[1]) nb[1] = c[1]; else if (nb[0] === old[0]) nb[0] = c[0]; }
  pts[i] = [c[0], c[1]];
}
function syncPipeEnds(p) {
  const pts = p.points; if (!pts || pts.length < 2) return;
  const a = ipPoint(p.from, p.workspace), b = ipPoint(p.to, p.workspace), n = pts.length;
  if (a) snapEnd(pts, 0, n > 2 && !p.hose ? 1 : undefined, a);
  if (b) snapEnd(pts, n - 1, n > 2 && !p.hose ? n - 2 : undefined, b);
}
// A hose is a pipe that bends: a smooth curve through its points (Catmull-Rom spline drawn as Bezier curves)
function hoseD(pts) {
  if (!pts.length) return '';
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
// Where pipes or hoses of different sizes meet on one IP, a reducer joins them: a cone from the bigger size down to the
// smaller one, drawn on the smaller pipe just outside the fitting (or from the IP itself when there is no fitting).
function reducers(pipes, ws) {
  const ends = new Map();
  for (const p of pipes) {
    const pts = p.points || []; if (pts.length < 2) continue;
    for (const [id, a, b] of [[p.from, pts[0], pts[1]], [p.to, pts[pts.length - 1], pts[pts.length - 2]]]) {
      if (!id || !ipPoint(id, ws)) continue;
      if (!ends.has(id)) ends.set(id, []);
      ends.get(id).push({ p, a, b, w: pipeWidth(p) });
    }
  }
  const out = [];
  for (const [id, list] of ends) {
    const big = Math.max(...list.map(e => e.w)); if (list.length < 2) continue;
    const g = L().graphics.find(x => x.id === id && x.kind === 'ip');
    const start = !isFitting(g) || g.fitting === 'cap' ? 0 : g.fitting === 'coupling' ? big / 2 : 2.5 * big;
    for (const e of list) {
      if (e.w >= big - 0.5) continue;
      const len = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1]); if (!len) continue;
      const ux = (e.b[0] - e.a[0]) / len, uy = (e.b[1] - e.a[1]) / len, nx = -uy, ny = ux;
      const c0 = [e.a[0] + ux * start, e.a[1] + uy * start], c1 = [c0[0] + ux * 1.5 * big, c0[1] + uy * 1.5 * big];
      out.push({ p: e.p, pts: [[c0[0] + nx * big / 2, c0[1] + ny * big / 2], [c1[0] + nx * e.w / 2, c1[1] + ny * e.w / 2], [c1[0] - nx * e.w / 2, c1[1] - ny * e.w / 2], [c0[0] - nx * big / 2, c0[1] - ny * big / 2]] });
    }
  }
  return out;
}
function renderPipes() {
  const svg = $('#pipes'); const w = curWs(); if (!w) return;
  const NS = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';
  const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e; };
  const line = (p, attrs) => p.hose ? mk('path', { d: hoseD(p.points || []), ...attrs }) : mk('polyline', { points: (p.points || []).map(q => q.join(',')).join(' '), ...attrs });
  const liveIps = new Set();
  const pipes = L().graphics.filter(g => g.kind === 'pipe' && g.workspace === w.name);
  pipes.forEach(syncPipeEnds);
  const flow = computeFlow(w.name), cones = reducers(pipes, w.name);
  for (const p of pipes) {
    const flowing = flow.has(p.id), backwards = flow.get(p.id) === -1;
    if (flowing) { if (p.from) liveIps.add(p.from); if (p.to) liveIps.add(p.to); }
    const width = pipeWidth(p), color = p.color || (p.hose ? '#c9ced3' : '#8a8f96');
    const g = mk('g', { 'data-gid': p.id });
    if (p.baseVisible !== false || editing) {
      const op = p.baseVisible === false ? 0.35 : 1;
      for (const r of cones.filter(r => r.p === p)) g.append(mk('polygon', { class: 'reducer', points: r.pts.map(q => q.join(',')).join(' '), fill: color, opacity: op }));
      g.append(line(p, { class: 'pipe' + (p.hose ? ' hose' : ''), stroke: color, 'stroke-width': width, opacity: op }));
    }
    g.append(line(p, { class: 'flow' + (flowing ? '' : ' off') + (!!p.reverse !== backwards ? ' rev' : ''), stroke: p.flowColor || '#4fb3ff', 'stroke-width': Math.max(3, width * 0.55) }));
    g.append(line(p, { class: 'hit' }));
    if (editing && (p.points || []).length > 1) {   // a red ring marks a pipe end that is not on an IP (no flow until it is)
      if (!ipPoint(p.from, p.workspace)) g.append(mk('circle', { class: 'loose', cx: p.points[0][0], cy: p.points[0][1], r: 9 }));
      if (!ipPoint(p.to, p.workspace)) { const q = p.points[p.points.length - 1]; g.append(mk('circle', { class: 'loose', cx: q[0], cy: q[1], r: 9 })); }
    }
    if (editing) {
      if (sel?.kind === 'gfx' && sel.id === p.id) g.append(line(p, { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-dasharray': '4 3' }));
      if (!p.locked && !p.straight) (p.points || []).forEach((q, i) => { const c = mk('circle', { class: 'handle', cx: q[0], cy: q[1], r: 6, 'data-gid': p.id, 'data-pi': i }); g.append(c); });
    }
    svg.append(g);
  }
  if (drawPts) {
    const all = drawCursor ? [...drawPts, drawCursor] : drawPts;
    if (all.length > 1) svg.append(line({ hose: drawHose, points: all }, { class: 'drawing' }));
    for (const q of drawPts) svg.append(mk('circle', { class: 'drawmark set', cx: q[0], cy: q[1], r: 9 }));
    // a big marker under the pointer, green when it is on an IP the pipe will join
    if (drawCursor) {
      const [x, y] = drawCursor, on = !!drawOnIp, g = mk('g', { class: 'drawmark' + (on ? ' on' : '') });
      const d = `M${x - 24} ${y}H${x - 7}M${x + 7} ${y}H${x + 24}M${x} ${y - 24}V${y - 7}M${x} ${y + 7}V${y + 24}`, r = on ? 16 : 12;
      for (const cls of ['bk', 'wh']) g.append(mk('circle', { class: cls, cx: x, cy: y, r }), mk('path', { class: cls, d }));
      svg.append(g);
    }
  }
  // an IP glows while a pipe that starts or ends on it is flowing
  $$('#ws .gfx.ip').forEach(n => n.classList.toggle('live', liveIps.has(n.dataset.ipid || n.dataset.gid)));
  $$('#ws .gfx.vessel').forEach(n => n.classList.toggle('heating', !!n.dataset.heater && isOn(n.dataset.heater)));
}

// ---------------------------------------------------------------- edit mode
const snap = v => Math.round(v / 5) * 5;
function canvasPt(ev) { const r = $('#ws').getBoundingClientRect(); return [(ev.clientX - r.left) / Z(), (ev.clientY - r.top) / Z()]; }
function findItem(kind, id) { return kind === 'el' ? draft.elements.find(e => e.name === id) : draft.graphics.find(g => g.id === id); }
const newId = () => 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

function setEditing(on) {
  if (on && menuTab) leaveMenuTab();         // Edit layout works on the screen tabs
  editing = on; sel = null; drawPts = null; drawCursor = null; drawFrom = null;
  if (on) nameAll(S.config.graphics);       // older pipes and fittings get their Skynet names (saved with the next layout save)
  draft = on ? clone(S.config) : null;
  $('#ws').classList.remove('drawing');
  $('#editMode').checked = on;
  $('#editBar').classList.toggle('hidden', !on);
  const lockedEq = S.profiles?.find(p => p.id === S.config.equipmentProfile && p.locked);
  $('#editHint').textContent = !on ? '' : (lockedEq ? `🔒 Equipment Profile "${lockedEq.name}" is locked: equipment, IPs and pipes can't be changed. ` : '') + 'Drag to move, corner to resize, double-click (or hold a finger) for properties. Double-click an empty spot for Tab settings (background color and picture). 🔒 items are locked in place.';
  renderTabs(); renderWs();
}

let drag = null, lastPipeTap = null;
$('#ws').addEventListener('pointerdown', ev => {
  if (!editing) return;
  const p = canvasPt(ev);
  if (drawPts) {                                   // drawing a pipe or hose
    ev.preventDefault();
    if (!drawHose) { if (ev.pointerType !== 'mouse') drawStraight(ev); return; }   // a mouse sets pipe ends by double-click (see dblclick); a finger by tapping
    const { c, id: ipId } = drawSnap(ev), last = drawPts[drawPts.length - 1];
    if (ipId) {                                    // a hose starts on the first IP clicked and ends on the next one
      if (!last) { drawFrom = ipId; drawPts.push(c); renderPipes(); return; }
      if (ipId === drawFrom) return;
      drawPts.push(c); finishPipe(ipId); return;
    }
    drawPts.push(c); renderPipes(); return;
  }
  const handle = ev.target.closest('circle.handle');
  if (handle) { sel = { kind: 'gfx', id: handle.dataset.gid }; drag = { mode: 'point', item: findItem('gfx', sel.id), i: +handle.dataset.pi }; ev.preventDefault(); return; }
  const hit = ev.target.closest('#pipes g');
  const pip = ev.target.closest('.devip');
  let node = pip ? (pip.dataset.eq ? $(`#ws .gfx[data-gid="${CSS.escape(pip.dataset.eq)}"]`) : $(`#ws .el[data-name="${CSS.escape(pip.dataset.dev)}"]`)) : ev.target.closest('.el,.gfx');
  if (hit && !node) {
    // the pipe is redrawn on press, so the browser never sends a double-click for it: count two quick presses instead
    const now = Date.now(), again = lastPipeTap && lastPipeTap.id === hit.dataset.gid && now - lastPipeTap.t < 450;
    lastPipeTap = again ? null : { id: hit.dataset.gid, t: now };
    if (again) { sel = { kind: 'gfx', id: hit.dataset.gid }; renderWs(); editItem('gfx', sel.id); return; }
    startLongPress(ev, 'gfx', hit.dataset.gid); sel = { kind: 'gfx', id: hit.dataset.gid };
    const pipe = findItem('gfx', sel.id);
    drag = pipe.locked ? null : startPipeMove(pipe, p);
    renderWs(); return;
  }
  if (!node) { sel = null; renderWs(); startLongPress(ev, 'tab'); return; }   // empty spot: hold a finger for Tab settings
  sel = node.dataset.name ? { kind: 'el', id: node.dataset.name } : { kind: 'gfx', id: node.dataset.gid };
  let item = findItem(sel.kind, sel.id);
  const bundle = bundleOf(item);
  if (bundle) { item = bundle; sel = { kind: 'gfx', id: bundle.id }; node = $(`#ws .gfx[data-gid="${CSS.escape(bundle.id)}"]`) || node; }
  startLongPress(ev, sel.kind, sel.id);
  $$('#ws .sel').forEach(n => n.classList.remove('sel')); node.classList.add('sel'); updLockBtn();
  if (item.locked) { drag = null; ev.preventDefault(); return; }   // locked: select only, no move or resize
  if (item.fitting === 'coupling') {     // the open end of one straight pipe: dragging it moves that whole pipe
    const ps = pipesOn(item.id, item.workspace);
    if (ps.length === 1 && ps[0].straight && !ps[0].locked) { drag = startPipeMove(ps[0], p); ev.preventDefault(); return; }
  }
  drag = { mode: !pip && !bundle && !item.bundled && ev.target.classList.contains('rs') ? 'resize' : 'move', item, node, start: p, orig: { x: item.x || 0, y: item.y || 0, w: item.w || 120, h: item.h || 60 } };
  if (item.kind === 'vessel') drag.ports = draft.graphics.filter(g => g.kind === 'ip' && g.attachTo === item.id).map(g => ({ g, x: g.x || 0, y: g.y || 0 }));
  // a fitting carries the straight pipes that hang off it with an open end: they keep their length and move along
  if (item.kind === 'ip') drag.stubs = pipesOn(item.id, item.workspace).filter(pp => pp.straight).map(pp => ({ p: pp, pts: clone(pp.points), end: ownCoupling(pp.from === item.id ? pp.to : pp.from, pp) })).filter(q => q.end).map(q => ({ ...q, ex: q.end.x, ey: q.end.y }));
  node.setPointerCapture?.(ev.pointerId);
  ev.preventDefault();
});
$('#ws').addEventListener('pointermove', ev => {
  if (lp && Math.hypot(ev.clientX - lp.x, ev.clientY - lp.y) > 8) cancelLongPress();
  if (drawPts) {
    const { c, id } = drawSnap(ev), last = drawPts[drawPts.length - 1];
    drawCursor = !drawHose && last ? straightEnd(last, c, id).c : c; drawOnIp = id && (!last || drawHose || straightEnd(last, c, id).id) ? id : null;
    renderPipes(); return;
  }
  if (!drag) return;
  drag.moved = true;
  const p = canvasPt(ev), dx = p[0] - drag.start?.[0], dy = p[1] - drag.start?.[1];
  if (drag.mode === 'move' && drag.ports) {   // a vessel carries its ports (IPs) with it
    const mx = snap(drag.orig.x + dx) - drag.orig.x, my = snap(drag.orig.y + dy) - drag.orig.y;
    for (const q of drag.ports) { q.g.x = q.x + mx; q.g.y = q.y + my; const pn = $(`#ws .gfx.ip[data-gid="${CSS.escape(q.g.id)}"]`); if (pn) place(pn, q.g); }
    placeEqIps(drag.item);
    renderPipes();
  }
  if (drag.mode === 'move' && drag.stubs?.length) {
    const mx = snap(drag.orig.x + dx) - drag.orig.x, my = snap(drag.orig.y + dy) - drag.orig.y;
    for (const q of drag.stubs) { q.p.points = q.pts.map(c => [c[0] + mx, c[1] + my]); q.end.x = q.ex + mx; q.end.y = q.ey + my; const n = $(`#ws .gfx.ip[data-gid="${CSS.escape(q.end.id)}"]`); if (n) place(n, q.end); }
  }
  if (drag.mode === 'move') { drag.item.x = snap(drag.orig.x + dx); drag.item.y = snap(drag.orig.y + dy); place(drag.node, drag.item.kind ? drag.item : elGeom(drag.item)); if (hasIps(drag.item)) placeDevIps(drag.item); if (drag.item.kind === 'ip' || hasIps(drag.item)) renderPipes(); }
  else if (drag.mode === 'resize') {
    const k = !drag.item.kind && hasIps(drag.item) ? pipeSize(drag.item.workspace) / 10 : 1;   // dragging the corner of a scaled device: store its size at pipe size 10
    drag.item.w = Math.max(drag.item.kind === 'ip' ? 10 : 20, snap(drag.orig.w + dx / k)); drag.item.h = Math.max(drag.item.kind === 'ip' ? 10 : 16, snap(drag.orig.h + dy / k)); place(drag.node, drag.item.kind ? drag.item : elGeom(drag.item)); if (hasIps(drag.item)) placeDevIps(drag.item); placeEqIps(drag.item); if (drag.item.kind === 'ip' || hasIps(drag.item) || eqPorts(drag.item).length) renderPipes(); }
  else if (drag.mode === 'point') { drag.item.points[drag.i] = [snap(p[0]), snap(p[1])]; renderPipes(); }
  else if (drag.mode === 'pipe') { movePipe(drag, dx, dy); for (const q of drag.carry) { const n = $(`#ws .gfx.ip[data-gid="${CSS.escape(q.g.id)}"]`); if (n) place(n, q.g); } renderPipes(); }
});
window.addEventListener('pointerup', () => {
  cancelLongPress();
  if (drag?.mode === 'move' && drag.item.kind === 'ip' && !isFitting(drag.item)) attachIp(drag.item);
  if (drag?.mode === 'pipe' && drag.moved) dropPipe(drag);
  if (drag?.mode === 'point' || drag?.mode === 'pipe') renderWs();
  drag = null;
});
$('#ws').addEventListener('dblclick', ev => {
  if (!editing) return;
  if (drawPts) { if (drawHose) finishPipe(); else drawStraight(ev); return; }
  const pip = ev.target.closest('.devip');
  const node = ev.target.closest('.el,.gfx');
  const pipe = ev.target.closest('#pipes g');
  if (pip) pip.dataset.eq ? editItem('gfx', pip.dataset.eq) : editItem('el', pip.dataset.dev);
  else if (node) editItem(node.dataset.name ? 'el' : 'gfx', node.dataset.name || node.dataset.gid);
  else if (pipe) editItem('gfx', pipe.dataset.gid);
  else editWorkspace();      // an empty spot on the tab: Tab settings (name, background color and picture, size)
});
document.addEventListener('keydown', ev => {
  if (!drawPts) return;
  if (ev.key === 'Enter' && drawHose) { ev.preventDefault(); finishPipe(); }   // without preventDefault the same Enter press hits the properties dialog and presses Delete
  if (ev.key === 'Escape') stopDrawing();
});
// Touch screens have no double-click: hold a finger on an item for 0.6 s to open its properties
let lp = null;
function startLongPress(ev, kind, id) {
  cancelLongPress();
  lp = { x: ev.clientX, y: ev.clientY, t: setTimeout(() => { lp = null; if (drag) { drag = null; renderWs(); } kind === 'tab' ? editWorkspace() : editItem(kind, id); }, 600) };
}
function cancelLongPress() { if (lp) { clearTimeout(lp.t); lp = null; } }

// Right-click Help (Fritz): a right-click on anything that can't be moved opens Help at the part that explains it:
// any item when the layout is not being edited, a 🔒 locked item in Edit layout, an empty spot on a tab, the Menu Bar.
// An unlocked item in Edit layout keeps the right button for dragging. Shift + right-click gives the browser's own menu.
// Phones have no right-click: holding a finger on an item for 0.7 s does the same, but only outside Edit layout,
// where holding a finger already opens Properties.
const openHelp = topic => window.dispatchEvent(new CustomEvent('skynet-help', { detail: topic }));
// the yellow ? Help icon (Fritz): on the ☰ Menu tabs and in Properties dialogs, never on a tab itself.
// `leave` runs first and may say no (a dialog with changes asks before it closes).
const helpIcon = (topic, leave) => h('button', { type: 'button', class: 'helpIcon', title: 'Help on this', 'aria-label': 'Help on this',
  onclick: ev => { ev.preventDefault(); ev.stopPropagation(); if (!leave || leave() !== false) openHelp(topic); } }, '?');
function tabItemAt(target) {
  const pip = target.closest('.devip'), node = target.closest('.el,.gfx'), pipe = target.closest('#pipes g');
  const kind = pip ? (pip.dataset.eq ? 'gfx' : 'el') : node ? (node.dataset.name ? 'el' : 'gfx') : pipe ? 'gfx' : null;
  const id = pip ? pip.dataset.eq || pip.dataset.dev : node ? node.dataset.name || node.dataset.gid : pipe?.dataset.gid;
  const item = kind === 'el' ? L().elements.find(e => e.name === id) : kind ? L().graphics.find(g => g.id === id) : null;
  return item && { kind, item };
}
function rightClickTopic(target) {
  if (target.closest('#ws') && !menuTab) {
    const hit = tabItemAt(target);
    if (!hit) return TAB_SPOT;
    const mover = editing ? bundleOf(hit.item) || hit.item : null;
    if (mover && !mover.locked) return null;              // it can move: the right button drags it
    return hit.kind === 'el' ? elementTopic(hit.item) : graphicTopic(hit.item);
  }
  return barTopic(target);
}
let pointerKind = 'mouse';
document.addEventListener('pointerdown', ev => { pointerKind = ev.pointerType; }, true);
document.addEventListener('contextmenu', ev => {
  if (ev.shiftKey || pointerKind !== 'mouse') return;     // a finger: see the long press below
  const topic = rightClickTopic(ev.target);
  if (topic) { ev.preventDefault(); openHelp(topic); }
});
let helpPress = null, helpShownAt = 0;
$('#ws').addEventListener('pointerdown', ev => {
  if (editing || ev.pointerType === 'mouse' || ev.target.closest('.btns, select, button, input')) return;
  const hit = tabItemAt(ev.target);
  if (!hit || (hit.kind === 'el' && tapAction(hit.item) === 'hold')) return;     // a push button is held on purpose
  clearTimeout(helpPress?.t);
  helpPress = { x: ev.clientX, y: ev.clientY, t: setTimeout(() => { helpPress = null; helpShownAt = Date.now(); openHelp(hit.kind === 'el' ? elementTopic(hit.item) : graphicTopic(hit.item)); }, 700) };
});
const dropHelpPress = () => { if (helpPress) { clearTimeout(helpPress.t); helpPress = null; } };
$('#ws').addEventListener('pointermove', ev => { if (helpPress && Math.hypot(ev.clientX - helpPress.x, ev.clientY - helpPress.y) > 8) dropHelpPress(); });
for (const t of ['pointerup', 'pointercancel']) window.addEventListener(t, dropHelpPress);
// the finger lifting after Help opened must not also switch the item
document.addEventListener('click', ev => { if (Date.now() - helpShownAt < 1500 && ev.target.closest('#ws')) { ev.stopPropagation(); ev.preventDefault(); helpShownAt = 0; } }, true);
$('#ws').addEventListener('contextmenu', ev => { if (!editing && pointerKind !== 'mouse' && tabItemAt(ev.target)) ev.preventDefault(); });   // Android's own long-press menu

// The joint Skynet put at a pipe end turns into the fitting the pipes on it need: one or two in line = coupling,
// a corner = 90° elbow, three = tee, four = cross, each turned the right way. A joint with a hose on it stays a coupling.
const ARMS = { coupling: null, elbow90: { W: 1, S: 1 }, tee: { W: 1, E: 1, S: 1 }, cross: { W: 1, E: 1, N: 1, S: 1 } };
const turnArm = (d, k) => { const o = 'NESW'; return o[(o.indexOf(d) + k) % 4]; };
function autoFit(g) {
  const ps = pipesOn(g.id, g.workspace), c = ipCenter(g);
  let fit = 'coupling', rot = g.rotate || '0';
  if (ps.length >= 2 && ps.every(p => p.straight)) {
    const dirs = new Set(ps.map(p => {
      const pts = p.points, far = p.from === g.id ? pts[1] : pts[pts.length - 2], dx = far[0] - c[0], dy = far[1] - c[1];
      return Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'E' : 'W') : (dy > 0 ? 'S' : 'N');
    }));
    const want = [...dirs].sort().join('');
    fit = dirs.size === 2 && (want === 'EW' || want === 'NS') ? 'coupling' : dirs.size === 2 ? 'elbow90' : dirs.size === 3 ? 'tee' : dirs.size === 4 ? 'cross' : 'coupling';
    if (fit === 'coupling') rot = want === 'NS' ? '90' : '0';
    else for (const k of [0, 1, 2, 3]) if (Object.keys(ARMS[fit]).map(d => turnArm(d, k)).sort().join('') === want) { rot = String(k * 90); break; }
  }
  if (g.fitting !== fit || String(g.rotate) !== rot) { g.fitting = fit; g.rotate = rot; giveName(g, draft.graphics); }
}
// Drawing: the pointer snaps onto an IP when it is close to one, else to the 5 px grid
function drawSnap(ev) {
  const p = canvasPt(ev), r = 16 / Z();
  let best = null;
  for (const q of allIps(wsName)) { const c = ipPoint(q.id, wsName); if (c) { const d = Math.hypot(c[0] - p[0], c[1] - p[1]); if (d <= r && (!best || d < best.d)) best = { d, c, id: q.id }; } }
  return best ? { c: [...best.c], id: best.id } : { c: [snap(p[0]), snap(p[1])], id: null };
}
// A straight pipe runs only across or up-and-down from its start. It ends on the IP picked only when that IP is in line with
// the start; anywhere else the end goes on the line, level with the pointer.
function straightEnd(a, c, id) {
  const across = Math.abs(c[0] - a[0]) >= Math.abs(c[1] - a[1]), off = across ? Math.abs(c[1] - a[1]) : Math.abs(c[0] - a[0]);
  if (id && off <= 2) return { c: across ? [c[0], a[1]] : [a[0], c[1]], id };
  return { c: across ? [c[0], a[1]] : [a[0], c[1]], id: null };
}
// Fritz: double-click the start, move to the length wanted, double-click the end. The pipe is then one straight piece of fixed
// length; turns are made with elbows and tees.
function drawStraight(ev) {
  const { c, id } = drawSnap(ev);
  if (!drawPts.length) { drawPts.push(c); drawFrom = id; $('#editHint').textContent = 'Start set. Move to the length you want and double-click (or tap) the end. Esc cancels.'; renderPipes(); return; }
  const a = drawPts[0], e = straightEnd(a, c, id);
  if (e.c[0] === a[0] && e.c[1] === a[1]) return;
  if (e.id && e.id === drawFrom) return;
  drawPts.push(e.c); finishPipe(e.id || undefined);
}
function stopDrawing() {
  drawPts = null; drawCursor = null; drawFrom = null; drawHose = false; drawOnIp = null;
  $('#ws').classList.remove('drawing'); $('#editHint').textContent = ''; $('#finishPipe').classList.add('hidden'); renderPipes();
}
// a loose pipe or hose end gets a coupling, so every pipe has an IP at both ends; another pipe can join it there later
function endCoupling(pts, i, j) {
  const c = pts[i], n = pts[j], ang = Math.round(Math.atan2(n[1] - c[1], n[0] - c[0]) * 180 / Math.PI / 45) * 45;
  const ip = { id: newId(), kind: 'ip', fitting: 'coupling', autoFit: true, workspace: wsName, x: c[0] - 15, y: c[1] - 15, w: 30, h: 30, label: '', color: '#9aa0a6', rotate: String((ang + 360) % 180) };
  draft.graphics.push(ip); giveName(ip, draft.graphics); return ip.id;
}
function finishPipe(to) {
  const pts = (drawPts || []).filter((q, i, all) => !i || q[0] !== all[i - 1][0] || q[1] !== all[i - 1][1]), from = drawFrom, hose = drawHose;   // a double-click adds its point twice
  stopDrawing();
  if (pts.length < 2) return;
  const g = { id: newId(), kind: 'pipe', workspace: wsName, points: pts, color: hose ? '#c9ced3' : '#8a8f96', flowColor: '#4fb3ff', flowWhen: [], baseVisible: true, size: '0.5' };
  if (hose) g.hose = true; else g.straight = true;
  g.from = from || endCoupling(pts, 0, 1);
  g.to = typeof to === 'string' ? to : endCoupling(pts, pts.length - 1, pts.length - 2);
  giveName(g, draft.graphics);
  draft.graphics.push(g); sel = { kind: 'gfx', id: g.id }; renderWs(); editItem('gfx', g.id);
}
// Moving a straight pipe: it keeps its length and moves as one piece. Its own open-end couplings go with it; an end that was on
// a shared IP (a fitting, pump, valve or vessel port) lets go. Dropped with an end on another IP, it joins that IP.
const ownCoupling = (id, pipe) => { const g = draft.graphics.find(x => x.id === id && x.fitting === 'coupling'); return g && pipesOn(id, pipe.workspace).every(p => p === pipe) ? g : null; };
function startPipeMove(pipe, p) {
  const d = { mode: 'pipe', item: pipe, start: p, orig: clone(pipe.points), carry: [] };
  if (!pipe.straight) return d;
  for (const k of ['from', 'to']) {
    const own = ownCoupling(pipe[k], pipe);
    if (own) d.carry.push({ g: own, x: own.x, y: own.y });
    else if (pipe[k]) d.loose = [...(d.loose || []), k];
  }
  return d;
}
function movePipe(d, dx, dy) {
  const mx = snap(dx), my = snap(dy);
  d.item.points = d.orig.map(q => [q[0] + mx, q[1] + my]);
  if (d.loose) { for (const k of d.loose) delete d.item[k]; d.loose = null; }     // let go of shared IPs on the first move
  for (const q of d.carry) { q.g.x = q.x + mx; q.g.y = q.y + my; }
}
function dropPipe(d) {
  const pipe = d.item; if (!pipe.straight) return;
  const pts = pipe.points, ends = [['from', 0, 1], ['to', pts.length - 1, pts.length - 2]];
  for (const [k, i, j] of ends) {
    const mine = pipe[k] && ownCoupling(pipe[k], pipe);
    if (pipe[k] && !mine) continue;
    const near = allIps(pipe.workspace).filter(q => q.id !== pipe.from && q.id !== pipe.to).map(q => ({ id: q.id, c: ipPoint(q.id, pipe.workspace) }))
      .filter(q => q.c && Math.hypot(q.c[0] - pts[i][0], q.c[1] - pts[i][1]) <= 14).sort((a, b) => Math.hypot(a.c[0] - pts[i][0], a.c[1] - pts[i][1]) - Math.hypot(b.c[0] - pts[i][0], b.c[1] - pts[i][1]))[0];
    if (near) {
      const mx = near.c[0] - pts[i][0], my = near.c[1] - pts[i][1];
      pipe.points = pts.map(q => [q[0] + mx, q[1] + my]);
      for (const q of d.carry) if (q.g !== mine) { q.g.x += mx; q.g.y += my; }
      if (mine) draft.graphics = draft.graphics.filter(g => g !== mine);
      pipe[k] = near.id;
      return dropPipe({ ...d, carry: d.carry.filter(q => q.g !== mine) });   // the other end may now sit on an IP too
    }
    if (!pipe[k]) pipe[k] = endCoupling(pipe.points, i, j);
  }
}

// Leaving Edit layout with changes: Save, or Exit without Saving (Fritz: OK / Cancel was confusing). Esc or "Keep editing" stays in Edit layout.
const layoutChanged = () => editing && JSON.stringify(draft) !== JSON.stringify(S.config);
function leaveLayoutDialog() {
  return new Promise(res => {
    const d = $('#valDlg'); d.innerHTML = '';
    const close = v => { d.oncancel = null; d.close(); res(v); };
    d.append(h('div', { class: 'vdTitle' }, 'Leave Edit layout?'),
      h('p', {}, 'You have changes to this layout that are not saved yet.'),
      versionSwitch(),
      h('div', { class: 'vdBtns' },
        h('button', { type: 'button', class: 'big primary', onclick: () => close('save') }, 'Save'),
        h('button', { type: 'button', class: 'big danger', onclick: () => close('discard') }, 'Exit without Saving')),
      h('div', { class: 'vdBtns' }, h('button', { type: 'button', class: 'big', onclick: () => close(undefined) }, 'Keep editing')));
    d.oncancel = () => res(undefined);
    d.showModal();
  });
}
// a copy of the Update Version switch next to Save layout (both stay the same)
function versionSwitch() {
  const box = h('input', { type: 'checkbox', ...($('#updateVersion').checked ? { checked: true } : {}) });
  box.onchange = () => { $('#updateVersion').checked = box.checked; $('#updateVersion').dispatchEvent(new Event('change')); };
  return h('label', { class: 'toggle', title: $('#updateVersion').closest('label').title }, h('span', { class: 'sw' }, box, h('span', { class: 'swk' })), ' Update Version');
}
async function leaveLayout() {
  if (!layoutChanged()) return setEditing(false);
  const r = await leaveLayoutDialog();
  if (r === 'save') return saveLayout();
  if (r === 'discard') return setEditing(false);
  $('#editMode').checked = true;
}
$('#editMode').addEventListener('change', e => {
  if (!e.target.checked && editing) { e.target.checked = true; return leaveLayout(); }
  setEditing(e.target.checked);
});
// Ready-made Device Outputs: a Digital Output with its kind, IPs, pictures and tap behaviour already set (all can be changed after)
const PRESETS = {
  pump: { type: 'digitalOut', subtype: 'pump', ipIn: 'left', ipOut: 'right', w: 140, h: 110, imageOn: 'Images/Pump_Red_Rip_On.png', imageOff: 'Images/Pump_Red_Rip_Off.png', hideValue: true, tap: 'toggle', confirm: true, onText: 'ON', offText: 'OFF' },
  // analogOut when that output type is installed (its fields exist), otherwise a vKonstant value holding 0-100 %
  get propValve() {
    const look = { subtype: 'propValve', ipIn: 'left', ipOut: 'right', w: 90, h: 70, hideName: true, imageOn: 'Images/Valve_Ball_OpenH_1.png', imageOff: 'Images/Valve_Ball_ClosedH_1.png' };
    return F.analogOut ? { type: 'analogOut', signal: '0-10V', rangeLow: 0, rangeHigh: 100, units: '%', precision: 0, ...look }
      : { type: 'vKonstant', kind: 'value', initial: '0', min: 0, max: 100, step: 5, units: '%', precision: 0, retain: true, ...look };
  },
  valve: { type: 'digitalOut', subtype: 'valve', ipIn: 'top', ipOut: 'bottom', w: 64, h: 55, imageOn: 'Images/Valve_Ball_OpenV-1x1.png', imageOff: 'Images/Valve_Ball_ClosedV-1x1.png', hideName: true, hideValue: true, tap: 'toggle', onText: 'OPEN', offText: 'CLOSED' },
};
// Arduino Mega 2560 pin lists for the pin picker. Analog pins are shown as A0-A15 with BruControl's number (54-69); either can be typed.
(() => {
  const an = [...Array(16).keys()].map(i => [`A${i}`, `A${i} = pin ${54 + i} (BruControl)`]);
  const dig = [...Array(54).keys()].map(i => [String(i), `D${i}`]);
  const lists = { analog: an, digital: [...dig, ...an], pwm: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 44, 45, 46].map(i => [String(i), `D${i} (PWM)`]), interrupt: [2, 3, 18, 19, 20, 21].map(i => [String(i), `D${i} (interrupt)`]) };
  for (const [k, opts] of Object.entries(lists)) document.body.append(h('datalist', { id: 'pins-' + k }, ...opts.map(([v, t]) => h('option', { value: v, label: t }, t))));
})();

// What can be added. Devices sit on a pin of a hobby board (Arduino, ESP32, Raspberry Pi); Widgets live only in the app.
const ADD_MENU = [
  ['Devices: outputs (board pin)', [
    ['Relay module / SSR / contactor (on-off)', 'digitalOut', 'DO'],
    ['PWM output: MOSFET module, pump speed, element %', 'pwmOut', 'PWM'],
    ['Analog output 0-10 V (PWM-to-0-10V module, VFD speed)', 'analogOut', 'AO', { signal: '0-10V', rangeLow: 0, rangeHigh: 100, units: '%' }],
    ['Analog output 4-20 mA (PWM-to-4-20mA module)', 'analogOut', 'AO', { signal: '4-20mA', rangeLow: 0, rangeHigh: 100, units: '%' }],
    ['Pump (relay output with inlet and outlet IPs for pipes)', 'pump', 'Pump'],
    ['Valve (relay output with an IP at each end)', 'valve', 'Valve'],
    ['Proportional valve 0-100 % (analog output)', 'propValve', 'PropValve'],
  ]],
  ['Devices: control outputs (switch a pin by themselves)', [
    ['Duty cycle (on for a % of each cycle)', 'dutyCycle', 'Duty'],
    ['Hysteresis (on / off around a target)', 'hysteresis', 'Hyst'],
    ['PID (holds a target temperature)', 'pid', 'PID'],
  ]],
  ['Devices: digital inputs (board pin)', [
    ['Switch (on while closed)', 'digitalIn', 'DI', { mode: 'switch' }],
    ['Push button (ON only while held, OFF when released)', 'digitalIn', 'PB', { mode: 'switch' }],
    ['Toggle button (press once: ON, press again: OFF)', 'digitalIn', 'Toggle', { mode: 'toggle' }],
    ['Pulse button (one short ON per press, even if held)', 'digitalIn', 'Pulse', { mode: 'momentary', pulse: 100, lockout: 3000 }],
    ['Latching input (stays on until reset: leak, E-stop, alarm)', 'digitalIn', 'DI', { mode: 'latch', onText: 'TRIPPED', offText: 'OK' }],
    ['Pulse counter (counts presses or pulses)', 'digitalIn', 'Count', { mode: 'counter' }],
    ['Float / level switch', 'digitalIn', 'Float', { mode: 'switch', onText: 'FULL', offText: 'LOW', onDelay: 2, offDelay: 2 }],
    ['Flow switch', 'digitalIn', 'FlowSw', { mode: 'switch', onText: 'FLOW', offText: 'NO FLOW', offDelay: 3 }],
    ['Door / lid / safety interlock', 'digitalIn', 'Interlock', { mode: 'switch', onText: 'CLOSED', offText: 'OPEN' }],
  ]],
  ['Devices: temperature probes', [
    ['DS18B20 (OneWire, waterproof probe)', 'temperature', 'Temp', { sensor: 'ds18b20' }],
    ['PT100 RTD (MAX31865 board)', 'temperature', 'Temp', { sensor: 'pt100', wires: 3 }],
    ['PT1000 RTD (MAX31865 board)', 'temperature', 'Temp', { sensor: 'pt1000', wires: 3 }],
    ['Thermocouple type K (MAX31855 board)', 'temperature', 'Temp', { sensor: 'thermocouple', tcType: 'K' }],
    ['Thermocouple K / J / T and others (MAX31856 board)', 'temperature', 'Temp', { sensor: 'thermocouple', tcType: 'J' }],
    ['NTC thermistor 10k (analog pin)', 'temperature', 'Temp', { sensor: 'ntc', r0: 10000, beta: 3950, series: 10000 }],
  ]],
  ['Devices: analog sensors (board analog pin or ADS1115)', [
    ['Analog input 0-5 V', 'analogIn', 'AI', { signal: '0-5V', rangeLow: 0, rangeHigh: 100 }],
    ['Analog input 0-10 V (with voltage divider)', 'analogIn', 'AI', { signal: '0-10V', rangeLow: 0, rangeHigh: 100 }],
    ['Analog input 4-20 mA (250 ohm resistor or current-to-voltage module)', 'analogIn', 'AI', { signal: '4-20mA', rangeLow: 0, rangeHigh: 100 }],
    ['Analog input on an ADS1115 board (16-bit)', 'analogIn', 'AI', { adc: 'ads1115', signal: '0-5V', rangeLow: 0, rangeHigh: 100 }],
    ['Analog input, raw reading (scale / offset)', 'analogIn', 'AI', { signal: 'raw' }],
    ['Pressure transducer 0.5-4.5 V (5 V hobby type)', 'analogIn', 'Pressure', { signal: '0.5-4.5V', rangeLow: 0, rangeHigh: 30, units: 'psi', precision: 1 }],
    ['Level transmitter 4-20 mA', 'analogIn', 'Level', { signal: '4-20mA', rangeLow: 0, rangeHigh: 30, units: 'gal', precision: 1 }],
    ['pH probe board (two-point calibration)', 'analogIn', 'pH', { signal: 'twoPoint', cal1Raw: 410, cal1Value: 7, cal2Raw: 560, cal2Value: 4, units: 'pH', precision: 2 }],
    ['Flow meter (hall sensor, e.g. YF-S201)', 'flowMeter', 'Flow', { pulsesPerUnit: 1703, units: 'gal', precision: 2 }],
  ]],
  ['Devices: motors (board pins)', [
    ['Stepper motor on a STEP / DIR driver (A4988, DRV8825, TMC2209, TB6600, DM542)', 'stepper', 'Stepper', { driver: 'A4988', wiring: 'stepDir', stepsPerRev: 200, microsteps: 16, units: 'rev', maxSpeed: 2, accel: 4, precision: 2 }],
    ['Stepper motor 28BYJ-48 on a ULN2003 board (4 pins)', 'stepper', 'Stepper', { driver: 'ULN2003 + 28BYJ-48', wiring: 'fourWire', stepsPerRev: 2048, microsteps: 2, units: 'deg', maxSpeed: 60, accel: 120, precision: 1 }],
  ]],
  ['Devices: weight', [
    ['Vessel scale: load cells on an HX711 board (weight and volume)', 'scale', 'Scale', { weightUnits: 'lb', volumeUnits: 'gal', specificGravity: 1, autoTare: true, precision: 2 }],
  ]],
  ['Widgets (app only, no board pin)', [
    ['Picture', 'picture'], ['Shared variable', 'shared'], ['Switch (on screen only)', 'switch'],
    ['Timer', 'timer'], ['Alarm', 'alarm', '', { kind: 'general' }], ['Sound Player (plays one sound file; pauses for alarms)', 'soundPlayer', 'SoundPlayer', { w: 220 }], ['Label', 'label'],
    ['Manual vessel (BrewZilla, DigiBoil: you set it by hand, the panel tells you what)', 'manual', 'Manual', { w: 230, h: 190, units: '°F', volumeUnits: 'gal' }],
  ]],
];
function fillAddType() {
  const vars = (type, ks) => [`${type} variables (app only)`, Object.entries(ks).map(([k, d]) => [`${d.label}  (${d.prefix})`, type, '', { kind: k }])];
  if (!ADD_MENU.some(([g]) => g.startsWith('vKonstant'))) ADD_MENU.push(vars('vKonstant', S.vkKinds), vars('vAPI', S.vapiKinds));
  $('#addType').innerHTML = '';
  $('#addType').append(...ADD_MENU.map(([group, items], gi) => h('optgroup', { label: group }, ...items.map((it, ii) => h('option', { value: gi + ':' + ii }, it[0])))));
}
$('#addEl').onclick = guard(async () => {
  const [gi, ii] = $('#addType').value.split(':').map(Number);
  const [, pick, prefix, extra] = ADD_MENU[gi][1][ii], preset = PRESETS[pick], type = preset ? preset.type : pick, kind = extra?.kind;
  const e0 = { type, kind }; let i = 1, base = prefixOf(e0) ? prefixOf(e0) + 'New' : (prefix || type) + '_';
  while (draft.elements.some(e => e.name === base + i)) i++;
  const e = { name: base + i, type, workspace: wsName, x: 40, y: 40, w: type === 'label' ? 200 : type === 'flowMeter' || type === 'stepper' ? 190 : 130, h: type === 'timer' ? 80 : 60, ...clone(preset || {}), ...clone(extra || {}) };
  if (type === 'shared') e.dataType = 'value';
  if (kind) e.kind = kind;
  if (kind === 'switch') { e.w = 110; e.h = 70; }
  if (kind === 'pushbutton' || kind === 'momentary') { e.w = 100; e.h = 100; }
  if (kind === 'longstring') { e.w = 360; e.h = 200; }
  if (kind === 'graphic') { e.hideName = true; e.w = 140; e.h = 120; }
  if (kind === 'list') { e.w = 200; e.h = 70; e.items = [{ value: 1, text: '' }, { value: 2, text: '' }, { value: 3, text: '' }]; e.initial = '1'; }
  if (type === 'temperature') { e.units = '°F'; e.precision = 1; }
  if (type === 'picture') { e.hideName = true; e.w = 140; e.h = 120; }
  // Fritz: anything new with on / off pictures starts with green for on and red for off (pumps and valves bring their own)
  if (['digitalOut', 'digitalIn', 'switch', 'picture'].includes(type) && !e.imageOn && !e.imageOff) { e.imageOn = 'Images/samples/led_green.svg'; e.imageOff = 'Images/samples/led_red.svg'; }
  if (pick === 'valve' && S.valveProfiles?.length && !(await useValveProfile(e))) return;
  useTabProfile(e);
  draft.elements.push(e); sel = { kind: 'el', id: e.name }; renderWs(); editItem('el', e.name);
});
// Fritz, 2026-10-20: a new valve starts from the Valve Profile picked now (only now; after that it is changed in its properties)
async function useValveProfile(e) {
  const def = S.config.brewDefaults?.valveProfile;
  const id = await choose('Valve Profile for the new valve', [...S.valveProfiles.map(p => [`${p.name}  (${ORIENTATIONS[p.orientation] || ''})`, p.id]), ['No profile (a plain vertical valve)', '']], def);
  if (id === undefined) return false;
  const p = S.valveProfiles.find(x => x.id === id); if (!p) return true;
  if (p.imageOpen) e.imageOn = p.imageOpen;
  if (p.imageClosed) e.imageOff = p.imageClosed;
  e.orientation = p.orientation; delete e.ipIn; delete e.ipOut;
  if (p.orientation === 'h') [e.w, e.h] = [e.h, e.w];
  if (p.orientation === 'l45' || p.orientation === 'r45') e.w = e.h = Math.max(e.w, e.h);   // the vertical picture is turned 45 degrees in a square
  return true;
}
// Fritz, 2026-10-20: a new device or widget takes the look of its tab's Tab Background Profile (only when it is made).
// Something with an ON / OFF state can be an LED or Text; something with a value also a Gauge; with neither, only the colors.
const hasStateEl = e => isBoolEl(e) || (['vKonstant'].includes(e.type) && ['switch', 'pushbutton', 'momentary', 'bool'].includes(e.kind));
const hasValueEl = e => !hasStateEl(e) && !['picture', 'label', 'manual'].includes(e.type) && !(e.type === 'vKonstant' && ['graphic', 'list', 'longstring'].includes(e.kind));
function useTabProfile(e) {
  const p = tabProfileOf(draft.workspaces.find(w => w.name === e.workspace)); if (!p) return;
  for (const k of ['nameColor', 'nameBg', 'nameAlign', 'valueColor', 'valueBg', 'valueAlign']) if (p[k]) e[k] = p[k];
  if (!p.valueType || hasIps(e) || isPropValve(e) || (!hasStateEl(e) && !hasValueEl(e))) return;    // pumps and valves show their pictures
  const type = p.valueType === 'gauge' && hasStateEl(e) ? 'text' : p.valueType;
  e.look = lookFor(type, e);
  if (type === 'led' && hasStateEl(e) && ['digitalOut', 'switch'].includes(e.type)) e.tap = p.ledMode === 'momentary' ? 'hold' : 'toggle';
  if (type === 'gauge') { if (p.digits) e.digits = p.digits; if (p.precision !== undefined) e.precision = p.precision; }
}
// LED: a lit dot for something ON / OFF, red LED digits for a value; Text: plain; Gauge: LCD digits
const lookFor = (type, e) => type === 'led' ? (hasStateEl(e) ? 'indicator' : 'led') : type === 'gauge' ? 'lcd' : 'normal';
$('#addImg').onclick = () => { const g = { id: newId(), kind: 'image', workspace: wsName, x: 40, y: 40, w: 200, h: 200, image: '' }; draft.graphics.push(g); renderWs(); editItem('gfx', g.id); };
$('#addText').onclick = () => { const g = { id: newId(), kind: 'text', workspace: wsName, x: 40, y: 40, w: 220, h: 40, text: 'Text', fontSize: 18 }; draft.graphics.push(g); renderWs(); editItem('gfx', g.id); };
$('#finishPipe').onclick = () => finishPipe();
// Lock / Unlock the selected item so it cannot be dragged or resized by accident
function updLockBtn() {
  const b = $('#lockItem'); if (!b) return;
  const item = editing && sel ? findItem(sel.kind, sel.id) : null;
  b.disabled = !item; b.textContent = item?.locked ? '🔓 Unlock' : '🔒 Lock';
}
$('#lockItem').onclick = () => {
  const item = sel && findItem(sel.kind, sel.id); if (!item) return toast('Select an item first', true);
  if (item.locked) delete item.locked; else item.locked = true;
  toast(item.locked ? 'Locked in place' : 'Unlocked'); renderWs();
};
$('#drawPipe').onclick = () => { stopDrawing(); drawPts = []; $('#ws').classList.add('drawing'); $('#editHint').textContent = 'Double-click (or tap) where the pipe starts: on an IP, or anywhere. Pipes run straight across or up and down. Esc cancels.'; renderPipes(); };
$('#drawHose').onclick = () => { stopDrawing(); $('#finishPipe').classList.remove('hidden'); drawPts = []; drawHose = true; $('#ws').classList.add('drawing'); $('#editHint').textContent = 'Click the start IP (or any point), click a few points for the hose to bend through, then click the end IP. Double-click or Enter to finish, Esc to cancel. Loose ends get a coupling.'; renderPipes(); };
$('#addIpType').append(...Object.entries(FITTINGS).map(([k, t]) => h('option', { value: k }, t)));
$('#addVesselType').append(...Object.entries(VESSELS).map(([k, t]) => h('option', { value: k }, t)));
// a new equipment widget: vessels, chillers, coils and filters go on the Equipment tab (made if it is missing), fittings on this tab
function addVesselWidget(c) {
  const C = EQ[c], tab = C.tab || wsName;
  if (!draft.workspaces.some(w => w.name === tab)) draft.workspaces.push({ name: tab, width: 1600, height: 900 });
  wsName = tab;
  let i = 1; while (draft.graphics.some(g => g.kind === 'vessel' && g.name === C.title + ' ' + i)) i++;
  const n = draft.graphics.filter(g => eqClass(g) && g.workspace === tab).length;
  const g = { id: newId(), kind: 'vessel', vesselType: c, workspace: tab, x: 60 + (n % 5) * 280, y: 60 + Math.floor(n / 5) * 340, w: C.size[0], h: C.size[1],
    name: C.title + ' ' + i, vtype: C.types[0], label: C.types[0], image: C.image, labelAlign: 'above', labelSize: 16, labelVisible: true, ports: eqDefaultPorts(c), isNew: true };
  draft.graphics.push(g); sel = { kind: 'gfx', id: g.id }; renderTabs(); renderWs(); editItem('gfx', g.id);
}
$('#addVessel').onclick = () => {
  if (EQ[$('#addVesselType').value]) return addVesselWidget($('#addVesselType').value);
  const t = $('#addVesselType').value, base = { electric: 'Electric vessel', gas: 'Gas vessel', mashTun: 'Mash tun', coil: 'Cooling coil', plateChiller: 'Plate chiller' }[t];
  let i = 1; while (draft.graphics.some(g => g.kind === 'vessel' && g.label === base + ' ' + i)) i++;
  const size = { coil: [160, 160], plateChiller: [90, 160] }[t] || [200, 260];
  const g = { id: newId(), kind: 'vessel', vesselType: t, workspace: wsName, x: 60, y: 60, w: size[0], h: size[1], image: '', label: base + ' ' + i, labelAlign: 'top', labelColor: '#ffffff', labelSize: 16, labelVisible: true };
  draft.graphics.push(g); sel = { kind: 'gfx', id: g.id }; renderWs(); editItem('gfx', g.id);
};
$('#addIp').onclick = () => {
  const fit = $('#addIpType').value, base = { point: 'IP', pipe: 'Pipe', cap: 'Cap', coupling: 'Coupling' }[fit] || FITTINGS[fit];
  let i = 1; while (draft.graphics.some(g => g.kind === 'ip' && g.label === base + ' ' + i)) i++;
  const g = { id: newId(), kind: 'ip', workspace: wsName, x: 60, y: 60, w: 30, h: 30, label: base + ' ' + i, color: fit === 'point' ? '#e8a33a' : '#8a8f96' };
  if (fit !== 'point') g.fitting = fit;
  draft.graphics.push(g); sel = { kind: 'gfx', id: g.id }; renderWs(); editItem('gfx', g.id);
};
$('#addWs').onclick = () => {
  const n = prompt('New tab name'); if (!n) return;
  if (draft.workspaces.some(w => w.name === n)) return toast('That name is used', true);
  const tp = S.config.brewDefaults?.tabProfile;
  draft.workspaces.push({ name: n, width: 1600, height: 900, ...(tp && tabProfileOf({ tabProfile: tp }) ? { tabProfile: tp } : {}) }); wsName = n; renderTabs(); renderWs();
};
$('#wsProps').onclick = () => editWorkspace();
const saveLayout = guard(async () => {
  const r = await api('PUT', '/ui/layout', { workspaces: draft.workspaces, elements: draft.elements, graphics: draft.graphics, updateVersion: $('#updateVersion').checked });
  toast(r?.version ? `Layout saved. New Schema version: ${r.version}` : 'Layout saved'); editing = false; await load(); setEditing(false);
});
// the Update Version switch is remembered on this browser
try { $('#updateVersion').checked = localStorage.getItem('bp.updateVersion') === '1'; } catch { }
$('#updateVersion').onchange = e => { try { localStorage.setItem('bp.updateVersion', e.target.checked ? '1' : '0'); } catch { } };
$('#saveLayout').onclick = saveLayout;
$('#cancelLayout').onclick = () => leaveLayout();
// Zoom and Full screen live on the Zoom Menu tab (Fritz, 2026-10-21); the Default tab picks what the panel starts with
const ZOOMS = [['fit', 'Fit screen'], ['width', 'Fit width'], ['0.5', '50%'], ['0.75', '75%'], ['1', '100%'], ['1.25', '125%'], ['1.5', '150%']];
function setZoom(z) { zoom = z; try { localStorage.setItem('bp.zoom', zoom); } catch { } fitZoom(); }
let fitTimer;
const refit = () => { clearTimeout(fitTimer); fitTimer = setTimeout(() => { if (view === 'workspace') fitZoom(); }, 100); };
{ const ro = new ResizeObserver(refit); for (const s of ['#top', '#view-workspace > .bar', '#editBar']) ro.observe($(s)); }   // a menu or the tab buttons wrapped onto another line
window.addEventListener('resize', refit);
// in full screen the top menu is hidden too, so the tab gets every pixel (Esc or Exit full screen brings it back)
document.addEventListener('fullscreenchange', () => {
  document.body.classList.toggle('fullscreen', !!document.fullscreenElement);
  if (menuTab === 'zoom') renderMenuPane();
  refit();
});
// the Menu Bar is hidden on the Tabs page (Default tab: "Hide the Menu Bar on Tabs", on unless switched off);
// ☰ Menu > Show Menu Bar brings it back until you hide it again or leave the Tabs page
const menuBarHides = () => S?.config?.brewDefaults?.hideMenuBar !== false;
const menuBarHidden = () => view === 'workspace' && menuBarHides() && !document.body.classList.contains('menuBarOn');
function showMenuBar(on) {
  document.body.classList.toggle('hideMenuBar', menuBarHides());
  document.body.classList.toggle('menuBarOn', on);
  refit();
}
// Full screen hides the browser's own bars (phones without it, like iPhones, can't: the Zoom tab says so)
const canFullScreen = !!document.documentElement.requestFullscreen;
const setFullScreen = on => on ? document.documentElement.requestFullscreen().catch(() => { }) : document.fullscreenElement && document.exitFullscreen();
// on startup: the Default tab's zoom (if one is picked), and Full screen. Browsers only allow Full screen after a click or tap,
// so it starts with the first click or tap on the page.
let started = false;
function startupView() {
  if (started) return; started = true;
  const d = S.config.brewDefaults || {};
  if (d.startZoom && ZOOMS.some(z => z[0] === d.startZoom)) setZoom(d.startZoom);
  if (d.startFullScreen && canFullScreen && !document.fullscreenElement) {
    const go = () => { document.removeEventListener('pointerup', go, true); setFullScreen(true); };
    document.addEventListener('pointerup', go, true);
  }
}
window.addEventListener('resize', () => { if (view === 'workspace') fitZoom(); });

// ---------------------------------------------------------------- properties dialog
// field: [key, label, kind, options]
const F = {
  common: [['name', 'Name', 'text'], ['displayName', 'Display name', 'text'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'bool'],
    ['background', 'Background picture (BruControl: background = 1, 2 or 3)', 'bgsel'], ['imagePath_1', 'imagePath_1 (a Process changes it: name.image = "path")', 'imgpath', 1],
    ['imagePath_2', 'imagePath_2', 'imgpath', 2], ['imagePath_3', 'imagePath_3', 'imgpath', 3], ['visibility', 'Visibility', 'sel', ['visible', 'hidden']], ['hideName', 'Hide name', 'bool'], ['hideValue', 'Hide value / text', 'bool'], ['look', 'Look', 'sel', ['normal', 'led', 'lcd', 'dark', 'button', 'indicator']], ['digits', 'Digits shown (a Gauge; empty = as many as needed)', 'num'], ['fontSize', 'Value font size', 'num'],
    ['tap', 'When tapped', 'sel', ['default', 'none', 'toggle', ['hold', 'push button (ON only while held; outputs and switches)'], 'dialog', ['script', 'process'], ['workspace', 'tab']]], ['tapTarget', 'Tap target (element, process or tab; empty = itself)', 'text'], ['confirm', 'Ask before changing (ON / OFF buttons)', 'bool'],
    ['nameColor', 'Name color', 'color'], ['nameBg', 'Name background color', 'color'], ['valueColor', 'Value color', 'color'], ['valueBg', 'Value background color', 'color'],
    ['nameFont', 'Name font (JSON, e.g. {"size":14,"bold":true})', 'json'], ['valueFont', 'Value font (JSON)', 'json'], ['nameAlign', 'Name alignment', 'sel', [['', '(default)'], 'TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight']], ['valueAlign', 'Value alignment', 'sel', [['', '(default)'], 'TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight']], ['border', 'Border', 'sel', ['default', 'hidden', 'visible']]],
  shared: [['dataType', 'Data type', 'sel', ['value', 'string', 'bool', 'time', 'datetime']], ['initial', 'Initial value', 'text'], ['precision', 'Decimals', 'num'], ['units', 'Units', 'gpick', 'units'], ['step', '+ / - step', 'num'], ['min', 'Lowest allowed', 'num'], ['max', 'Highest allowed', 'num'], ['readOnly', 'Read only on screen', 'bool'], ['retain', 'Keep value on restart', 'bool', true]],
  digitalOut: it => [['subtype', 'Kind (pumps and valves have IPs for pipes)', 'sel', [['plain', 'plain'], ['pump', 'pump'], ['valve', 'valve'], ['element', 'element (electric heating element)']], true], ...(it.subtype === 'valve' ? [['valveType', 'Valve type', 'sel', [['electric', 'Electro_Mechanical (switched by its pin)'], ['manual', 'Manual (turned by hand: a Process shows a pop-up and waits for Done)']]],
    ['orientation', 'Orientation (where its two pipe ends are)', 'sel', [['', '(by its shape)'], ['h', 'Horizontal'], ['v', 'Vertical'], ['l45', '45 degrees Left'], ['r45', '45 degrees Right']]],
    ['service', 'Service (what flows through it; a Gas valve can heat a vessel)', 'sel', [['', '(not set)'], ...Object.entries(VALVE_SERVICE)]], ['tapwater', 'Tap water valve (open = tap water flows, no pump needed)', 'bool']] : []), ['device', 'Device', 'dev'], ['channel', 'Pin (e.g. 22, or A5 = 59)', 'pin', 'digital'], ['activeLow', 'Invert (pin LOW = on)', 'bool'], ['oneShot', 'One-shot time in ms (0 = off)', 'num'], ['oneShotDirection', 'One-shot pulses OFF (off = pulses ON)', 'bool'], ['imageOn', 'Graphic when on', 'gpick'], ['imageOff', 'Graphic when off', 'gpick'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  switch: [['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  digitalIn: [['inline', 'Inline in a pipe, e.g. a flow switch (gets IN and OUT IPs)', 'bool'], ['device', 'Device', 'dev'], ['channel', 'Pin (e.g. 30, or A8 = 62)', 'pin', 'digital'],
    ['mode', 'Input type', 'sel', [['switch', 'Switch / push button (ON while closed or held)'], ['toggle', 'Toggle (press once: ON, press again: OFF)'], ['momentary', 'Pulse (one short ON per press)'], ['latch', 'Latch (ON until reset)'], ['counter', 'Counter (counts presses)']]],
    ['pulse', 'Pulse: ON time per press (ms, empty = 100)', 'num'], ['lockout', 'Pulse: lockout before the next press counts (ms, 3000 = 3 seconds; empty = 3000)', 'num'],
    ['activeLow', 'Invert / active low (normally-closed contact)', 'bool'], ['pullup', 'Use the board\'s pull-up (switch wired to GND)', 'bool', true],
    ['debounce', 'Debounce on the board (ms, empty = 20)', 'num'], ['onDelay', 'On delay (seconds the input must stay on)', 'num'], ['offDelay', 'Off delay (seconds the input must stay off)', 'num'],
    ['units', 'Counter units (e.g. presses, gal)', 'gpick', 'units'], ['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  timer: [['timerType', 'Type', 'sel', ['countup', 'countdown']], ['resetValue', 'Reset value (hh:mm:ss)', 'text'], ['initial', 'Start value (hh:mm:ss)', 'text'], ['initRunning', 'Running when the server starts', 'bool']],
  soundPlayer: [['path', 'Sound file (a Process can change it: SoundPlayer path = "...")', 'gpick', 'sounds'], ['loop', 'Repeat sound', 'bool'],
    ['_snote', 'Only one sound plays at a time. A Sound Player has the lowest priority (5): it pauses while any alarm sounds and goes on by itself after. In a Process: play SoundPlayer, stop SoundPlayer.', 'note']],
  alarm: [['sound', 'Sound file path (.wav / .mp3)', 'path'], ['sounds', 'Sound files 1-3 (JSON list; "fileindex" picks one)', 'json'], ['fileIndex', 'Sound file number', 'num'], ['soundMode', 'Sound', 'sel', ['custom', 'default', 'none']], ['loop', 'Repeat sound', 'bool'], ['activeText', 'Text when sounding', 'text'], ['imageOn', 'Image when sounding', 'path'], ['imageOff', 'Image when quiet', 'path']],
  manual: [['units', 'Temperature units', 'sel', ['°F', '°C']], ['volumeUnits', 'Volume units', 'sel', ['gal', 'L']], ['precision', 'Set point decimals', 'num'], ['setpoint', 'Set point at start', 'num'],
    ['noPump', 'Has no pump', 'bool'], ['imageOn', 'Picture when heating', 'path'], ['imageOff', 'Picture when not heating', 'path'],
    ['_mnote', 'Processes set: setpoint, heat, pump, timer, message, waiting. The brewer taps it to confirm (confirmed = true) or to enter what it reads (reading, volume).', 'note']],
  pwmOut: [['device', 'Device', 'dev'], ['channel', 'PWM pin (Mega: 2-13, 44-46)', 'pin', 'pwm'], ['initial', 'Start value (%)', 'num'], ['precision', 'Decimals', 'num']],
  analogOut: [['device', 'Device', 'dev'], ['channel', 'PWM pin feeding the 0-10 V / 4-20 mA module', 'pin', 'pwm'], ['signal', 'Signal', 'sel', ['0-10V', '4-20mA', '0-5V']],
    ['rangeLow', 'Value at lowest signal (0 V / 4 mA)', 'num'], ['rangeHigh', 'Value at highest signal (10 V / 20 mA)', 'num'], ['units', 'Units', 'gpick', 'units'], ['precision', 'Decimals', 'num']],
  scale: [['device', 'Device', 'dev'], ['channel', 'HX711 DT pin(s), comma between several boards on one vessel (e.g. 26, 28)', 'text'],
    ['countsPerUnit', 'Calibration: counts per lb / kg (tap the scale > Calibrate to measure it)', 'num'],
    ['weightUnits', 'Weight units', 'sel', ['lb', 'kg']], ['volumeUnits', 'Volume units', 'sel', ['gal', 'L']],
    ['specificGravity', 'Liquid specific gravity (water = 1.000, wort e.g. 1.050)', 'num'], ['sgFrom', 'Or take the gravity from (e.g. a variable with the OG)', 'elem'],
    ['offset', 'Weight offset (added after tare)', 'num'],
    ['autoTare', 'Auto tare: zero itself when the volume reads empty and steady', 'bool', true], ['autoTareBand', 'Counts as empty below (gal / L; empty = 0.05 gal or 0.2 L)', 'num'], ['autoTareSeconds', 'Steady for (seconds, empty = 10)', 'num'],
    ['precision', 'Decimals', 'num'], ['sim', 'Simulator settings (JSON), e.g. {"fillWhen":"Pump_1","drainWhen":"Valve_2","rate":20}', 'json'], ['info', 'Raw reading now', 'info']],
  flowMeter: [['device', 'Device', 'dev'], ['channel', 'Pulse pin (Mega: 2, 3, 18, 19, 20 or 21)', 'pin', 'interrupt'], ['pulsesPerUnit', 'Pulses per unit (from the meter\'s data sheet)', 'num'], ['units', 'Units (gal, L …)', 'gpick', 'units'], ['precision', 'Decimals', 'num'], ['sim', 'Simulator settings (JSON), e.g. {"rate":2,"when":"Pump_1"}', 'json']],
  dutyCycle: [['device', 'Device', 'dev'], ['channel', 'Pin', 'num'], ['activeLow', 'Active low', 'bool'], ['enabled', 'Enabled at start', 'bool'], ['dutyCycle', 'Duty cycle %', 'num'], ['interval', 'Cycle time (ms)', 'num']],
  hysteresis: [['device', 'Device', 'dev'], ['channel', 'Pin', 'num'], ['activeLow', 'Active low', 'bool'], ['enabled', 'Enabled at start', 'bool'], ['input', 'Input (sensor element)', 'elem'], ['target', 'Target', 'num'], ['onOffset', 'ON offset (positive = heat: on below target - offset; negative = cool)', 'num'], ['onDelay', 'ON delay (seconds)', 'num']],
  pid: [['device', 'Device', 'dev'], ['channel', 'Pin', 'num'], ['activeLow', 'Active low', 'bool'], ['enabled', 'Enabled at start', 'bool'], ['input', 'Input (sensor element)', 'elem'], ['target', 'Target', 'num'], ['kp', 'Kp', 'num'], ['ki', 'Ki', 'num'], ['kd', 'Kd', 'num'], ['maxOutput', 'Max output %', 'num'], ['maxIntegral', 'Max integral %', 'num'], ['calcTime', 'Calculation time (s)', 'num'], ['outTime', 'Output window (s)', 'num'], ['reversed', 'Reversed (cooling)', 'bool'], ['pwm', 'PWM output (off = time-proportioned on/off)', 'bool']],
  picture: [['follow', 'Follow element (on/off image follows it; empty = static)', 'elem'], ['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['text', 'Text on picture', 'text']],
  label: [],
  image: [['image', 'Image path', 'path'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'bool']],
  text: [['text', 'Text', 'area'], ['fontSize', 'Font size', 'num'], ['color', 'Color', 'color'], ['bold', 'Bold', 'bool'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'bool']],
  inlineSides: [['ipIn', 'IN IP side', 'sel', SIDES], ['ipOut', 'OUT IP side', 'sel', ['right', 'left', 'top', 'bottom']]],
  propValve: [['imageOn', 'Image when open (above 0 %)', 'path'], ['imageOff', 'Image when closed (0 %)', 'path']],
  vessel: [['vesselType', 'Kind', 'sel', Object.keys(VESSELS).filter(k => !EQ[k])], ['image', 'Background picture path (empty = plain drawn vessel)', 'path'], ['label', 'Label', 'text'], ['labelVisible', 'Show label', 'yn', true], ['labelAlign', 'Label position', 'sel', LABEL_POS], ['labelColor', 'Label color', 'color'], ['labelSize', 'Label size', 'num'],
    ['heater', 'Heater (element or burner output; glows when on)', 'elem'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num', ['locked', 'Lock position (no drag or resize)', 'yn']]],
  ip: [['fitting', 'Type', 'fit'], ['rotate', 'Turn (degrees)', 'sel', ['0', '45', '90', '135', '180', '225', '270', '315']], ['open', 'Manual valve is open', 'yn'], ['attachTo', 'Port on vessel (moves with it; set by dropping the IP on a vessel)', 'vessel'], ['label', 'Name / label (e.g. Red pump out, MLT in, Drain)', 'text'], ['labelVisible', 'Show label on screen', 'yn'], ['labelAlign', 'Label position', 'sel', ['below', 'above', 'top', 'center', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right']], ['labelColor', 'Label color', 'color'], ['labelSize', 'Label size', 'num'],
    ['image', 'Background picture path (empty = drawn shape)', 'path'], ['text', 'Text on marker', 'text'], ['color', 'Color', 'color'], ['hideRun', 'Hide its label and picture too when not editing (the IP marker itself only shows in Edit layout)', 'yn'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num', ['locked', 'Lock position (no drag or resize)', 'yn']]],
  pipe: it => [['_about', 'In Skynet Brewery you can easily add interactive Pipes, Hoses, Pumps and Valves. If they are electro-mechanical (a pump or a powered valve), turning them on makes flow run from a source, through the inlet side of a pump, and out into the Pipe or Hose on its outlet side.', 'note'],
    ['label', 'Label', 'text'], ['from', 'Starts at IP (flow comes from here)', 'ip'], ['to', 'Ends at IP (flow goes to here)', 'ip'],
    ['sizeUnits', 'Size units', 'sel', [['in', 'Inch (SAE)'], ['mm', 'Metric (mm)']], true], ['size', it.hose ? 'Hose size' : 'Pipe size', 'sel', sizeChoices(it), true],
    ...(it.size === 'custom' ? [['sizeCustom', `Custom size (${it.sizeUnits === 'mm' ? 'mm' : 'inches, e.g. 1.5'})`, 'num']] : []),
    ['flowWhen', 'Only when ALL of these are on (optional; pumps and valves on the pipe count by themselves; Ctrl or Cmd-click to pick several)', 'multi'], ['reverse', 'Reverse flow direction', 'bool'],
    ['color', it.hose ? 'Hose color' : 'Pipe color', 'color'], ['flowColor', 'Flow color', 'color'],
    ['baseVisible', 'Show when nothing flows (off: the tab picture already shows it, so only the moving flow appears)', 'bool', true],
    ['workspace', 'Tab', 'ws'], ['locked', 'Lock position (no drag or resize)', 'bool']],
};
// the Vessel widget's settings: Position and Standard show once a port is set to Installed
F.vesselNew = it => [['name', 'Name', 'text'], ['vtype', 'Type', 'vlist', it.vesselType + '.types'], ['label', 'Label (empty = the Type)', 'text'], ['image', 'Graphic (picture path)', 'path'],
  ...Object.entries(EQ[it.vesselType].ports).flatMap(([k, d]) => [['_' + k, d.name + (d.ip ? ' (IP)' : ' (not an IP)'), 'note'], [k + '_on', d.name + ' installed', 'yn', false, true],
    ...(it[k + '_on'] ? [[k + '_pos', d.name + ' position', 'vlist', it.vesselType + '.' + k], [k + '_std', d.name + ' standard', 'vlist', 'standard']] : [])]),
  ['_look', 'Label and place', 'note'], ['labelVisible', 'Show label', 'yn', true], ['labelAlign', 'Label position', 'sel', LABEL_POS], ['labelColor', 'Label color', 'color'], ['labelSize', 'Label size', 'num'],
  ['workspace', 'Tab (pipes only join IPs on the same tab)', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'yn'],
  ['bundled', 'Bundled with its IPs (move as one unit; no editing until switched off)', 'bool']];
F.global = F.shared;   // the few Globals kept until Fritz decides use the same settings
// field [key, label, kind, opts, onlyForKinds]
const NUMK = ['value'], BOOLK = ['bool', 'switch', 'pushbutton', 'momentary'], PLAINK = ['string', 'value', 'time', 'datetime', 'bool', 'switch'];
F.vKonstant = () => [['kind', 'Kind (OK and reopen to see its settings)', 'sel', Object.entries(S.vkKinds).map(([k, d]) => [k, `${d.label}  (${d.prefix})`])],
  ['items', 'Choices: Value (what Processes see and trigger on) and Text (what the dropdown shows)', 'vkitems', null, ['list']],
  ['initial', 'Starting choice (its Value)', 'text', null, ['list']],
  ['initial', 'Image path (inside a media folder)', 'path', null, ['graphic']],
  ['file', 'Text file path (inside a media folder, a network drive works if it is added there)', 'path', null, ['longstring']],
  ['initial', 'Initial value', 'text', null, PLAINK], ['precision', 'Decimals', 'num', null, NUMK], ['units', 'Units', 'gpick', 'units', [...NUMK, 'string']],
  ['step', '+ / - step', 'num', null, NUMK], ['min', 'Lowest allowed', 'num', null, NUMK], ['max', 'Highest allowed', 'num', null, NUMK],
  ['onText', 'Text when on', 'text', null, BOOLK], ['offText', 'Text when off', 'text', null, BOOLK],
  ['pulseMs', 'On time in ms (default 100)', 'num', null, ['momentary']],
  ['stepClass', 'Shows the steps of', 'sel', [['flow', 'Flow Processes'], ['sub', 'Sub Processes'], ['repeat', 'Repeat Processes'], ['looper', 'Looper Processes'], ['any', 'Any Process']], ['step']],
  ['readOnly', 'Read only on screen', 'bool', null, ['graphic', 'longstring', 'list', ...PLAINK]], ['retain', 'Keep value on restart', 'bool', true, ['graphic', 'longstring', 'list', ...PLAINK]]];
F.vAPI = () => [['kind', 'Kind (OK and reopen to see its settings)', 'sel', Object.entries(S.vapiKinds).map(([k, d]) => [k, `${d.label}  (${d.prefix})`])],
  ['initial', 'Initial value', 'text'], ['precision', 'Decimals', 'num', null, NUMK], ['units', 'Units', 'gpick', 'units'], ['step', '+ / - step', 'num', null, NUMK],
  ['min', 'Lowest allowed', 'num', null, NUMK], ['max', 'Highest allowed', 'num', null, NUMK], ['readOnly', 'Read only on screen', 'bool'], ['retain', 'Keep value on restart', 'bool', true],
  ['_logNote', 'Database trigger: set it on the Variables page', 'note']];
const kindFields = (type, obj) => { const f = F[type]; return (typeof f === 'function' ? f(obj) : f || []).filter(x => !Array.isArray(x[4]) || x[4].includes(obj.kind || 'value')); };

// Temperature and analog inputs: the settings depend on the sensor / signal picked
const TEMP_COMMON = [['offset', 'Calibration offset (added to the reading)', 'num'], ['units', 'Units (°F or °C)', 'gpick', 'units'], ['precision', 'Decimals', 'num'], ['sim', 'Simulator settings (JSON)', 'json']];
const SENSOR_FIELDS = {
  ds18b20: [['probeIndex', 'OneWire probe number (Devices page > OneWire probe index)', 'probe'], ['device', 'Device (empty = any)', 'dev']],
  pt100: [['device', 'Device', 'dev'], ['channel', 'MAX31865 chip-select (CS) pin', 'pin', 'digital'], ['wires', 'Probe wires', 'sel', ['2', '3', '4']], ['rref', 'Board reference resistor (ohm, empty = 430)', 'num']],
  pt1000: [['device', 'Device', 'dev'], ['channel', 'MAX31865 chip-select (CS) pin', 'pin', 'digital'], ['wires', 'Probe wires', 'sel', ['2', '3', '4']], ['rref', 'Board reference resistor (ohm, empty = 4300)', 'num']],
  thermocouple: [['device', 'Device', 'dev'], ['channel', 'MAX31855 / MAX31856 board chip-select (CS) pin', 'pin', 'digital'], ['tcType', 'Thermocouple type (MAX31855 boards are K only)', 'sel', ['K', 'J', 'T', 'N', 'E', 'R', 'S', 'B']]],
  ntc: [['device', 'Device', 'dev'], ['channel', 'Analog pin (A0-A15, or BruControl 54-69)', 'pin', 'analog'], ['r0', 'Thermistor ohm at 25 °C', 'num'], ['beta', 'Beta value (data sheet, often 3950)', 'num'], ['series', 'Series resistor (ohm)', 'num'], ['wiring', 'Wiring', 'sel', ['toGround', 'toVcc']]],
};
const SIGNAL_FIELDS = {
  raw: [['scale', 'Scale (multiplies the raw 0-1023 reading)', 'num'], ['offset', 'Offset', 'num']],
  twoPoint: [['cal1Raw', 'Point 1: raw reading', 'num'], ['cal1Value', 'Point 1: real value (e.g. pH 7)', 'num'], ['cal2Raw', 'Point 2: raw reading', 'num'], ['cal2Value', 'Point 2: real value (e.g. pH 4)', 'num'], ['offset', 'Extra offset', 'num']],
  range: [['rangeLow', 'Value at lowest signal', 'num'], ['rangeHigh', 'Value at highest signal', 'num'], ['offset', 'Calibration offset', 'num']],
};
// Stepper motors: the lists can be added to ("Add new ..."); a driver picked from the list fills in its usual settings
// unit -> [shown on the tab, shown in the list]
const STEP_UNITS = { rev: ['turns', 'rev (turns)'], deg: ['°', 'deg (degrees)'], mm: ['mm', 'mm'], in: ['in', 'in (inches)'], mL: ['mL', 'mL'], L: ['L', 'L'], gal: ['gal', 'gal'], '%': ['%', '% (how far open, e.g. a valve)'], steps: ['steps', 'steps (no conversion)'] };
const STEP_LISTS = {
  driver: ['A4988', 'DRV8825', 'TMC2208', 'TMC2209', 'TB6600', 'DM542', 'ULN2003 + 28BYJ-48', 'L298N'].map(x => [x, x]),
  stepsPerRev: [[200, '200 (1.8° per step: most NEMA 17 / 23 motors)'], [400, '400 (0.9° per step)'], [2048, '2048 (28BYJ-48)'], [4096, '4096 (28BYJ-48, counted in half steps)']],
  microsteps: [1, 2, 4, 8, 16, 32, 64, 128, 256].map(n => [n, n === 1 ? '1 (full steps)' : n === 2 ? '2 (half steps)' : `1/${n} steps`]),
  units: Object.entries(STEP_UNITS).map(([k, [, l]]) => [k, l]),
};
const STEP_DRIVERS = {
  'A4988': { wiring: 'stepDir', pulseUs: 1, enableLevel: 'low', microsteps: 16 }, 'DRV8825': { wiring: 'stepDir', pulseUs: 2, enableLevel: 'low', microsteps: 32 },
  'TMC2208': { wiring: 'stepDir', pulseUs: 1, enableLevel: 'low', microsteps: 8 }, 'TMC2209': { wiring: 'stepDir', pulseUs: 1, enableLevel: 'low', microsteps: 8 },
  'TB6600': { wiring: 'stepDir', pulseUs: 5, enableLevel: 'low', microsteps: 8 }, 'DM542': { wiring: 'stepDir', pulseUs: 3, enableLevel: 'low', microsteps: 8 },
  'ULN2003 + 28BYJ-48': { wiring: 'fourWire', microsteps: 2, stepsPerRev: 2048 }, 'L298N': { wiring: 'fourWire', microsteps: 1, stepsPerRev: 200 },
};
function stepperFields(it) {
  const four = it.wiring === 'fourWire';
  return [['device', 'Device (board)', 'dev'],
    ['driver', 'Driver board (picking one fills in its usual settings)', 'stpick', 'driver'],
    ['wiring', 'Wired with', 'sel', [['stepDir', 'STEP and DIR pins (A4988, DRV8825, TMC, TB6600, DM542)'], ['fourWire', '4 coil pins (ULN2003 board, L298N)']], true],
    ...(four ? [['channel', 'IN1 pin', 'pin', 'digital'], ['pin2', 'IN2 pin', 'pin', 'digital'], ['pin3', 'IN3 pin', 'pin', 'digital'], ['pin4', 'IN4 pin', 'pin', 'digital']]
      : [['channel', 'STEP pin', 'pin', 'digital'], ['dirPin', 'DIR (direction) pin', 'pin', 'digital'],
        ['enablePin', 'ENABLE pin (empty = not wired, driver always on)', 'pin', 'digital'],
        ['enableLevel', 'The driver is ON when the ENABLE pin is', 'sel', [['low', 'LOW (A4988, DRV8825, TMC, and TB6600 / DM542 with ENA- to GND)'], ['high', 'HIGH']]],
        ['pulseUs', 'Shortest STEP pulse in microseconds (empty = what the driver needs)', 'num']]),
    ['invertDir', 'Reverse the direction', 'yn'],
    ['stepsPerRev', 'Motor steps per turn (motor label or data sheet)', 'stpick', 'stepsPerRev'],
    ['microsteps', four ? 'Stepping' : 'Microstepping (set on the driver with its MS pins or switches; must match)', 'stpick', 'microsteps'],
    ['gearRatio', 'Gearbox: motor turns per output turn (empty = 1, no gearbox)', 'num'],
    ['units', 'Position units', 'stpick', 'units'],
    ['unitsPerRev', 'Units per output turn (empty = 1 turn, 360°, 100 %; lead screw = its pitch in mm; dosing pump = mL per turn)', 'num'],
    ['maxSpeed', 'Top speed (units per second)', 'num'], ['accel', 'Speeds up and slows down by (units per second, each second; empty = 2 x top speed)', 'num'],
    ['holdWhenIdle', 'Keep the motor powered when stopped (holds its place, runs warm)', 'yn', true],
    ['minPos', 'Lowest position allowed (empty = no limit)', 'num'], ['maxPos', 'Highest position allowed (empty = no limit)', 'num'],
    ['homePin', 'Home switch pin on the same board (empty = no switch)', 'pin', 'digital'],
    ['homeSwitch', 'Home switch', 'sel', [['no', 'Normally open, closes to GND when hit'], ['nc', 'Normally closed to GND, opens when hit']]],
    ['homeDir', 'Home switch is at the', 'sel', [['minus', 'low end (homing turns backward)'], ['plus', 'high end (homing turns forward)']]],
    ['homeSpeed', 'Homing speed (units per second, empty = 1/4 of top speed)', 'num'], ['homePosition', 'Position at the home switch (empty = 0)', 'num'],
    ['homeTravel', 'Stop homing if the switch is not found within (units, empty = 2 x the allowed range, or 10 turns)', 'num'],
    ['homeOnConnect', 'Home by itself each time the board connects', 'yn'],
    ['precision', 'Decimals', 'num'], ['offText', 'Text when turned off', 'text'],
    ['sim', 'Simulator settings (JSON): where it starts and where its home switch is, in its units, e.g. {"start":40,"switchAt":-5}', 'json'], ['info', 'Position now', 'info']];
}

// Alarm kind first: a Hop Alarm can sound by itself on a timer, a Pre-Hop Alarm a set time before its Hop Alarm
const ALARM_KIND_LIST = [['hop', 'Hop Alarm (priority 1: beats every other sound)'], ['brewflow', 'Brew Flow Alarm (2: end of mash, start of boil)'], ['prehop', 'Pre-Hop Alarm (3: a set time before its Hop Alarm)'], ['general', 'General Alarm (4)'], ['sound', 'Sound only (5: music, beeps; pauses for any alarm)']];
function alarmFields(item) {
  const k = item.kind ??= 'general';
  return [['kind', 'Kind of alarm', 'sel', ALARM_KIND_LIST, true],
    ...(k === 'hop' ? [['timer', 'Sound by itself on this timer (empty = only from a Process)', 'elem'], ['at', 'At this time on the timer (hh:mm:ss)', 'text']] : []),
    ...(k === 'prehop' ? [['hopAlarm', 'Goes with this Hop Alarm', 'elem'], ['before', 'How long before it (hh:mm:ss, empty = 00:10:00)', 'text']] : []),
    ...kindFields('alarm', item)];
}

function fieldsFor(item) {
  if (item.type === 'stepper') return stepperFields(item);
  if (item.type === 'alarm') return alarmFields(item);
  if (item.type === 'temperature') {
    const s = item.sensor || 'ds18b20';
    return [['sensor', 'Probe type', 'sel', ['ds18b20', 'pt100', 'pt1000', 'thermocouple', 'ntc'], true], ...SENSOR_FIELDS[s] ?? [], ...TEMP_COMMON, ['info', 'Reading now', 'info']];
  }
  if (item.type === 'analogIn') {
    const sig = item.signal || 'raw';
    return [['inline', 'Inline in a pipe, e.g. a flow sensor (gets IN and OUT IPs)', 'bool'], ['device', 'Device', 'dev'], ['adc', 'Read by', 'sel', ['board', 'ads1115'], true], item.adc === 'ads1115' ? ['channel', 'ADS1115 channel (0-3)', 'num'] : ['channel', 'Analog pin (A0-A15, or BruControl 54-69)', 'pin', 'analog'], ['signal', 'Sensor signal', 'sel', ['raw', '0-5V', '0.5-4.5V', '1-5V', '0-10V', '4-20mA', '0-20mA', 'twoPoint'], true],
      ...SIGNAL_FIELDS[sig] ?? SIGNAL_FIELDS.range,
      ...(sig === '0-10V' ? [['divider', 'Input divider (10 V -> 5 V = 2)', 'num']] : []), ...(sig.endsWith('mA') ? [['shunt', 'Resistor across the input (ohm, usually 250)', 'num']] : []),
      ['calibrations', 'BruControl calibrations (JSON list, used instead of the settings above)', 'json'], ['avgWeight', 'Smoothing weight % (100 = none)', 'num'], ['prefix', 'Prefix', 'text'],
      ['units', 'Units', 'gpick', 'units'], ['precision', 'Decimals', 'num'], ['sim', 'Simulator settings (JSON), e.g. {"value":12,"noise":0.2}', 'json'], ['info', 'Raw reading now', 'info']];
  }
  return kindFields(item.type, item);
}

function field([key, label, kind, opts, rerender], obj) {
  if (kind === 'path') { opts = /sound/i.test(key) ? 'sounds' : 'pictures'; kind = 'gpick'; }   // every picture / sound path is a dropdown with Add new
  const v = obj[key];
  let input;
  if (kind === 'imgpath') {    // imagePath_1, _2, _3: after a BruControl import only imagePath_1 can be changed (the Skynet way)
    if (opts === 1 || !obj.imagePathsLocked) return field([key, label, 'gpick', 'pictures'], obj);
    input = h('input', { 'data-k': key, 'data-kind': 'text', type: 'text', value: v ?? '', readonly: true, class: 'lockedPath', placeholder: '(empty)', title: 'Locked after the BruControl import. Click to see why.', onclick: lockedPathHelp });
    return [h('label', {}, label + ' 🔒'), input];
  }
  if (kind === 'bgsel') {      // which picture shows: 1-3 (and more on folded items), or none
    const n = [1, 2, 3, ...slotsOf(obj).filter(x => x > 3)];
    const os = [['', '(default) imagePath_1'], ...n.map(x => [String(x), `${x} = imagePath_${x}`]), ['0', 'None (0 or any number other than ' + n.join(', ') + ')']];
    const cur = v === undefined || v === null ? '' : String(v);
    if (!os.some(o => o[0] === cur)) os.push([cur, /^-?\d+$/.test(cur) ? `${cur} = None (no picture)` : `${cur} (color, shown when there is no picture)`]);
    input = h('select', { 'data-k': key, 'data-kind': kind }, ...os.map(([o, l]) => h('option', { value: o, ...(o === cur ? { selected: true } : {}) }, l)));
    return [h('label', {}, label), input];
  }
  if (kind === 'info') {     // live reading, to help with calibration
    const r = S.values[obj.name] || {};
    const spu = obj.type === 'stepper' ? (obj.units === 'steps' ? 1 : (+obj.stepsPerRev || 200) * (+obj.microsteps || 1) * (+obj.gearRatio || 1) / (+obj.unitsPerRev || (obj.units === 'deg' ? 360 : obj.units === '%' ? 100 : 1))) : 0;
    if (spu) return [h('label', {}, label), h('span', { class: 'info' }, `${fmtVal(obj, r.position)} ${obj.units || ''} = ${r.steps ?? 0} steps${r.moving ? ', moving' : ''}${r.homed ? ', homed' : ''}.  ${+spu.toFixed(3)} steps per ${obj.units || 'unit'} (from the settings above, after Save)`)];
    const txt = obj.type === 'scale' ? `${r.raw ?? '-'}  (tare ${obj.tareRaw ?? 'not set'})` : obj.type === 'analogIn' ? `${r.raw ?? '-'}${r.fault ? '  (signal out of range: check wiring)' : ''}` : r.fault ? 'FAULT: check the probe and its wiring' : `${fmtVal(obj, r.value)} ${obj.units || ''}`;
    return [h('label', {}, label), h('span', { class: 'info' }, txt)];
  }
  if (kind === 'pin') {      // free text with a list of Mega 2560 pins: A0-A15 and their BruControl numbers 54-69 mean the same pin
    input = h('input', { 'data-k': key, 'data-kind': kind, type: 'text', value: v ?? '', list: 'pins-' + opts, autocomplete: 'off', placeholder: opts === 'analog' ? 'A0' : '22' });
    return [h('label', {}, label), input];
  }
  if (kind === 'stpick') return [h('label', {}, label), stepperPick(key, opts, v)];
  if (kind === 'probe') input = h('select', { 'data-k': key, 'data-kind': 'num' }, h('option', { value: '' }, '(none)'),
    ...(S.config.probes || []).map(p => h('option', { value: p.index, ...(Number(v) === p.index ? { selected: true } : {}) }, `#${p.index} ${p.name || ''}${p.rom ? '  ' + p.rom : '  (no probe yet)'}`)));
  else if (kind === 'bool' || kind === 'yn') {     // a simple true / false is a switch (Fritz); choices with more options are dropdowns
    input = h('label', { class: 'sw' }, h('input', { type: 'checkbox', 'data-k': key, 'data-kind': 'bool', ...(v ?? opts ? { checked: true } : {}), ...(rerender === true ? { 'data-rerender': '1' } : {}) }), h('span', { class: 'swk' }));
  }
  else if (kind === 'vkitems') {   // two columns: Value | Text, with rows to add and remove
    const tb = h('tbody');
    const row = (it = {}) => {
      const tr = h('tr', { class: 'vkrow' }, h('td', {}, h('input', { class: 'vkv', type: 'number', step: 'any', value: it.value ?? '' })), h('td', {}, h('input', { class: 'vkt', type: 'text', value: it.text ?? '', placeholder: 'e.g. Mash' })),
        h('td', {}, h('button', { type: 'button', title: 'Remove this row', onclick: () => tr.remove() }, '✕')));
      tb.append(tr);
    };
    (v || []).forEach(row);
    const add = h('button', { type: 'button', onclick: () => { const vs = [...tb.querySelectorAll('.vkv')].map(i => +i.value).filter(Number.isFinite); row({ value: vs.length ? Math.max(...vs) + 1 : 1 }); tb.lastChild.querySelector('.vkt').focus(); } }, '+ Add row');
    input = h('div', { class: 'vkitems', 'data-k': key, 'data-kind': kind }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Value'), h('th', {}, 'Text'), h('th'))), tb), add);
    return [h('label', { class: 'full' }, label), h('div', { class: 'full' }, input)];
  }
  else if (kind === 'color') {     // standard colors by name with a swatch, or Custom with a color picker
    const cols = [...COLORS, ...vList('colors').filter(c => !COLORS.some(k => k[1] === c)).map(c => [c, c])];
    const cur = String(v || '').toLowerCase(), known = cols.find(c => c[1] === cur);
    const val = h('input', { type: 'hidden', 'data-k': key, 'data-kind': kind, value: cur });
    const sw = h('span', { class: 'cswatch' + (cur ? '' : ' dflt') + (cur === 'transparent' ? ' none' : '') }); sw.style.background = cur;
    const pick = h('input', { type: 'color', class: known ? 'hidden' : '', value: /^#[0-9a-f]{6}$/.test(cur) ? cur : '#888888' });
    const set = c => { val.value = c; sw.style.background = c; sw.classList.toggle('dflt', !c); sw.classList.toggle('none', c === 'transparent'); };
    const s = h('select', {}, ...cols.map(([n, c]) => h('option', { value: c, ...(known && known[1] === c ? { selected: true } : {}), ...(c && c !== 'transparent' ? { style: `background:${c};color:${['#ffffff', '#f1c40f', '#c9ced3'].includes(c) ? '#000' : '#fff'}` } : {}) }, n)),
      h('option', { value: 'custom', ...(known ? {} : { selected: true }) }, 'Custom (add new) ...'));
    s.onchange = () => { pick.classList.toggle('hidden', s.value !== 'custom'); set(s.value === 'custom' ? pick.value : s.value); };
    pick.oninput = () => set(pick.value);
    pick.onchange = () => {      // a custom color joins the list for next time
      const c = pick.value.toLowerCase(); if (vList('colors').includes(c) || COLORS.some(k => k[1] === c)) return;
      const lists = S.config.vesselLists = { ...(S.config.vesselLists || {}) }; lists.colors = [...(lists.colors || []), c];
      api('PUT', '/ui/settings', { vesselLists: lists }).catch(e => toast(e.message, true));
    };
    input = h('div', { class: 'cpick' }, sw, s, pick, val);
  }
  else if (kind === 'gpick') {     // a picture from the on / off list, with a preview; Add new ... takes any media path
    const list = opts || 'onoff', pic = ['onoff', 'pictures', 'backgrounds'].includes(list);
    const named = new Map(ONOFF_GRAPHICS.map(([n, p]) => [p, n])), os = vList(list); if (v && !os.includes(v)) os.push(v);
    const pv = h('img', { class: 'gprev' + (v && pic ? '' : ' hidden'), ...(v && pic ? { src: media(v) } : {}), alt: '' });
    const s = h('select', { 'data-k': key, 'data-kind': kind, 'data-list': list }, h('option', { value: '' }, '(none)'),
      ...os.map(p => h('option', { value: p, ...(p === v ? { selected: true } : {}) }, named.get(p) || p)), h('option', { value: '__add__' }, 'Add new ...'));
    s.addEventListener('change', () => { if (pic && s.value !== '__add__') { pv.classList.toggle('hidden', !s.value); if (s.value) pv.src = media(s.value); } });
    input = h('div', { class: 'gpick' }, s, pv);
  }
  else if (kind === 'vlist') {     // a vessel list the user can add to
    const os = vList(opts); if (v && !os.includes(v)) os.push(v);
    input = h('select', { 'data-k': key, 'data-kind': kind, 'data-list': opts }, ...os.map(o => h('option', { value: o, ...(o === (v ?? os[0]) ? { selected: true } : {}) }, o)), h('option', { value: '__add__' }, 'Add new ...'));
  }
  else if (kind === 'sel') { const os = opts.map(o => Array.isArray(o) ? o : [o, o]); input = h('select', { 'data-k': key, 'data-kind': kind, ...(rerender === true ? { 'data-rerender': '1' } : {}) }, ...os.map(([o, l]) => h('option', { value: o, ...(String(v ?? os[0][0]) === o ? { selected: true } : {}) }, l))); }
  else if (kind === 'note') return [h('div', { class: 'full muted' }, label)];
  else if (kind === 'head') return [h('div', { class: 'full dlgHead' }, label)];      // a section heading inside a dialog
  else if (kind === 'ws') input = h('select', { 'data-k': key, 'data-kind': kind }, ...draft.workspaces.map(w => h('option', { value: w.name, ...(w.name === v ? { selected: true } : {}) }, w.name)));
  else if (kind === 'dev') input = h('select', { 'data-k': key, 'data-kind': kind }, h('option', { value: '' }, '(none)'), ...(S.config.devices || []).map(d => h('option', { value: d.name, ...(d.name === v ? { selected: true } : {}) }, d.name)));
  else if (kind === 'elem') input = h('select', { 'data-k': key, 'data-kind': kind }, h('option', { value: '' }, key === 'follow' ? '(none - static picture)' : '(none)'), ...(draft || S.config).elements.filter(e => e.type !== 'picture').map(e => e.name).sort().map(n => h('option', { value: n, ...(n === v ? { selected: true } : {}) }, n)));
  else if (kind === 'vessel') input = h('select', { 'data-k': key, 'data-kind': kind }, h('option', { value: '' }, '(none)'), ...draft.graphics.filter(g => g.kind === 'vessel' && g.workspace === (obj.workspace || wsName)).map(g => h('option', { value: g.id, ...(g.id === v ? { selected: true } : {}) }, g.label || g.id)));
  else if (kind === 'fit') input = h('select', { 'data-k': key, 'data-kind': kind }, ...Object.entries(FITTINGS).map(([k, t]) => h('option', { value: k, ...((v || 'point') === k ? { selected: true } : {}) }, t)));
  else if (kind === 'ip') input = h('select', { 'data-k': key, 'data-kind': kind }, h('option', { value: '' }, '(none - free end)'), ...allIps(obj.workspace || wsName).map(q => h('option', { value: q.id, ...(q.id === v ? { selected: true } : {}) }, q.label)));
  else if (kind === 'area' || kind === 'json') input = h('textarea', { 'data-k': key, 'data-kind': kind, spellcheck: 'false' }, kind === 'json' ? (v ? JSON.stringify(v) : '') : (v ?? ''));
  else if (kind === 'multi') {
    const names = draft.elements.filter(e => ['digitalOut', 'switch', 'digitalIn', 'alarm'].includes(e.type) || isVarEl(e)).map(e => e.name).sort();
    input = h('select', { 'data-k': key, 'data-kind': kind, multiple: true, size: 8 }, ...names.map(n => h('option', { value: n, ...((v || []).includes(n) ? { selected: true } : {}) }, n)));
  } else input = h('input', { 'data-k': key, 'data-kind': kind, type: kind === 'num' ? 'number' : 'text', value: v ?? '', ...(kind === 'path' ? { placeholder: 'e.g. valves/valve_open.png' } : {}) });
  const full = kind === 'multi' || kind === 'area';
  return full ? [h('label', { class: 'full' }, label), h('div', { class: 'full' }, input)] : [h('label', {}, label), input];
}

// Stepper dropdowns: the built-in list, anything already used on another stepper, and "Add new ..."
function stepperPick(key, list, v) {
  const num = list !== 'driver' && list !== 'units', items = [...STEP_LISTS[list]];
  for (const e of (draft || S.config).elements) if (e.type === 'stepper' && e[key] !== undefined && e[key] !== '' && !items.some(([x]) => String(x) === String(e[key]))) items.push([e[key], String(e[key])]);
  if (v !== undefined && v !== '' && !items.some(([x]) => String(x) === String(v))) items.push([v, String(v)]);
  const s = h('select', { 'data-k': key, 'data-kind': 'stpick', ...(num ? { 'data-num': '1' } : {}) }, h('option', { value: '' }, '(pick one)'),
    ...items.map(([x, l]) => h('option', { value: x, ...(String(x) === String(v ?? '') ? { selected: true } : {}) }, l)), h('option', { value: '__add__' }, 'Add new ...'));
  let prev = s.value;
  s.addEventListener('change', () => {
    if (s.value === '__add__') {
      const t = (prompt({ driver: 'Driver board name (for example TMC5160)', stepsPerRev: 'Motor steps per turn (a number, for example 100)', microsteps: 'Microsteps (a number, for example 10)', units: 'Unit name (for example oz)' }[list]) || '').trim();
      if (!t || (num && !(+t > 0))) { s.value = prev; if (t) toast('Enter a number above 0', true); return; }
      if (![...s.options].some(o => o.value === t)) s.insertBefore(h('option', { value: t }, t), s.lastChild);
      s.value = t;
    }
    prev = s.value;
    const d = list === 'driver' && STEP_DRIVERS[s.value];
    if (d) for (const [k, x] of Object.entries(d)) {      // fill in that driver's usual settings
      const f = $(`#dlgBody [data-k="${k}"]`); if (!f) continue;
      if (f.tagName === 'SELECT' && ![...f.options].some(o => o.value === String(x))) f.insertBefore(h('option', { value: x }, String(x)), f.lastChild);
      f.value = String(x); if (k === 'wiring') f.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  return s;
}

// A locked imagePath_2 / _3 was clicked: explain how pictures change in Skynet
let lockedShown = 0;
function lockedPathHelp(ev) {
  ev?.target?.blur?.();
  if (Date.now() - lockedShown < 800) return;       // click and focus fire together
  lockedShown = Date.now();
  let d = $('#lockedPathDlg');
  if (!d) {
    d = h('dialog', { id: 'lockedPathDlg' }, h('h3', {}, '🔒 imagePath_2 and imagePath_3 are locked'),
      h('p', {}, 'This item came from a BruControl import. BruControl kept 3 background pictures and a Process picked one with background = 1, 2 or 3. Those pictures were kept, so your imported Processes still work, but imagePath_2 and imagePath_3 can no longer be changed here.'),
      h('p', {}, h('b', {}, 'The Skynet way:'), ' use one picture, imagePath_1, and let a Process change it:'),
      h('pre', { class: 'mono' }, 'my_widget.image = "Images/RedPump.png"'),
      h('p', {}, 'That puts the new path in imagePath_1 and sets background = 1 by itself, so the picture shows at once. You can also change imagePath_1 right here in this dialog.'),
      h('p', {}, 'Still works as in BruControl: my_widget.background = 1, 2 or 3 shows that picture; any other number (for example 4) shows no picture.'),
      h('p', { class: 'muted' }, 'More in Help > Pictures on items.'),
      h('div', { class: 'bar' }, h('span', { class: 'spacer' }), h('button', { class: 'primary', onclick: () => d.close() }, 'OK')));
    document.body.append(d);
  }
  d.showModal();
}

function readFields(obj, root = $('#dlgBody')) {
  for (const inp of root.querySelectorAll('[data-k]')) {
    const k = inp.dataset.k, kind = inp.dataset.kind;
    let v;
    if (kind === 'bool') v = inp.checked;
    else if (kind === 'vkitems') {
      v = [...inp.querySelectorAll('.vkrow')].map(tr => ({ value: tr.querySelector('.vkv').value.trim(), text: tr.querySelector('.vkt').value.trim() })).filter(r => r.value !== '' || r.text);
      for (const r of v) { if (r.value === '' || !Number.isFinite(+r.value)) throw new Error(`Choice "${r.text}": its Value must be a number`); r.value = +r.value; }
      if (new Set(v.map(r => r.value)).size !== v.length) throw new Error('Two choices have the same Value');
    }
    else if (kind === 'num') v = inp.value === '' ? undefined : +inp.value;
    else if (kind === 'bgsel') v = inp.value === '' ? undefined : /^-?\d+$/.test(inp.value) ? +inp.value : inp.value;
    else if (kind === 'pin') { const t = inp.value.trim().toUpperCase(); v = t === '' ? undefined : /^\d+$/.test(t) ? +t : t; }
    else if (kind === 'yn') v = inp.value === 'yes';
    else if (kind === 'stpick') v = inp.value === '' || inp.value === '__add__' ? undefined : inp.dataset.num ? +inp.value : inp.value;
    else if (kind === 'multi') v = [...inp.selectedOptions].map(o => o.value);
    else if (kind === 'json') { if (inp.value.trim() === '') v = undefined; else { try { v = JSON.parse(inp.value); } catch { throw new Error(`${k}: not valid JSON`); } } }
    else v = inp.value === '' ? undefined : inp.value;
    if (v === undefined) delete obj[k]; else obj[k] = v;
  }
}

// A form of fields in a box (a dialog, or a Menu tab): "Add new ..." in a list and selects that change the fields are handled here.
// onChange runs after any change. Returns build(), which draws the fields again.
function bindForm(body, fields, obj, onChange) {
  const build = () => { body.innerHTML = ''; for (const f of (typeof fields === 'function' ? fields(obj) : fields)) body.append(...field(f, obj)); menuHelpIcons(body); };
  build();
  body.onchange = ev => {
    const t = ev.target;
    if ((t.dataset?.kind === 'vlist' || t.dataset?.kind === 'gpick') && t.value === '__add__') {
      const k = t.dataset.k, prev = obj[k];
      let text = (prompt({ units: 'New unit (for example psi)', sounds: 'Sound file path in your media folders (for example sounds/bell.wav)' }[t.dataset.list] || (t.dataset.kind === 'gpick' ? 'Picture in media/Images (for example MyValve_On.png or Valves/MyValve_On.png)' : 'Add to this list')) || '').trim();
      if (text && ['onoff', 'pictures', 'backgrounds'].includes(t.dataset.list)) text = imagesPath(text);
      try { readFields(obj, body); } catch { }
      obj[k] = text || prev;
      if (text && !vList(t.dataset.list).includes(text)) {
        const lists = S.config.vesselLists = { ...(S.config.vesselLists || {}) };
        lists[t.dataset.list] = [...(lists[t.dataset.list] || []), text];
        api('PUT', '/ui/settings', { vesselLists: lists }).catch(e => toast(e.message, true));
      }
      if (obj[k] === undefined) delete obj[k];
      build();
    } else if (t.dataset?.rerender) { try { readFields(obj, body); } catch { } build(); }
    onChange?.(ev);
  };
  if (onChange) body.oninput = onChange;
  return build;
}

// fields: a list, or a function of the item (the list changes when a [.., true] select changes, e.g. probe type)
function dialog(title, fields, obj, canDelete, topic) {
  return new Promise(res => {
    $('#dlgTitle').textContent = title;
    bindForm($('#dlgBody'), fields, obj);
    if (topic) {      // the ? beside the title: closes the dialog (asking first when something was changed) and opens Help
      const d = $('#dlg'), before = formSnap();
      $('#dlgTitle').append(' ', helpIcon(topic, () => {
        if (formSnap() !== before && !confirm('Leave these Properties without saving your changes, and open Help?')) return false;
        d.close('cancel');
      }));
    }
    for (const b of $$('#dlg .dlgDelete')) b.classList.toggle('hidden', !canDelete);
    const d = $('#dlg');
    // Delete and Cancel are plain buttons so Enter in a field always means Save
    for (const b of $$('#dlg [data-close]')) b.onclick = () => d.close(b.dataset.close);
    d.onclose = () => res(d.returnValue);
    d.returnValue = 'cancel'; d.showModal();
  });
}

const formSnap = () => JSON.stringify([...$$('#dlgBody input, #dlgBody select, #dlgBody textarea')].map(i => i.type === 'checkbox' ? i.checked : i.value));

// a bundled vessel: only Bundled and Tab can change; the whole bundle moves to the new tab as is
async function editBundle(v) {
  const work = { bundled: true, workspace: v.workspace };
  const r = await dialog(`${v.label || v.name} (bundled)`, [['_b', 'This vessel and its IPs are bundled: they move as one and can\'t be edited. Switch off Bundled to edit, move or delete them.', 'note'],
    ['bundled', 'Bundled with its IPs', 'bool'], ['workspace', 'Tab (the whole bundle moves)', 'ws']], work, false, graphicTopic(v));
  if (r !== 'ok') return;
  readFields(work);
  if (work.workspace && work.workspace !== v.workspace) {
    const old = v.workspace;
    for (const g of [v, ...bundledIps(v)]) g.workspace = work.workspace;
    const ids = [...bundledIps(v).map(g => g.id), ...eqPorts(v).map(q => q.id)];
    const piped = draft.graphics.some(p => p.kind === 'pipe' && p.workspace === old && (ids.includes(p.from) || ids.includes(p.to)));
    wsName = v.workspace;
    toast(`Moved the bundle to the ${v.workspace} tab.` + (piped ? ` Its pipes stayed on ${old}; draw new ones here.` : ''));
  }
  if (!work.bundled) { delete v.bundled; toast('Un-bundled: the vessel and its IPs can be edited again'); }
  sel = { kind: 'gfx', id: v.id }; renderTabs(); renderWs();
}
async function editItem(kind, id) {
  const item = findItem(kind, id); if (!item) return;
  const bundle = bundleOf(item);
  if (bundle) return toast(`This IP is bundled with ${bundle.label || bundle.name}. Open the vessel and switch off Bundled to edit, move or delete it.`, true);
  if (item.kind === 'vessel' && item.bundled) return editBundle(item);
  await loadMediaPictures();
  const type = kind === 'el' ? item.type : item.kind;
  const fields = kind === 'el' ? it => {
    const f = [...F.common.slice(0, 3), ...fieldsFor(it), ...(isPropValve(it) ? F.propValve : []), ...(isInline(it) ? F.inlineSides : []), ...F.common.slice(3)];
    const more = slotsOf(it).filter(n => n > 3);     // items folded from stacked BruControl copies have imagePath_4, _5 ...
    if (more.length) f.splice(f.findIndex(x => x[0] === 'imagePath_3') + 1, 0, ...more.map(n => ['imagePath_' + n, 'imagePath_' + n, 'imgpath', n]));
    if (prefixOf(it)) f.splice(1, 0, ['_hint', `Suggested name prefix: ${prefixOf(it)}  (a hint, not required)`, 'note']);
    return f;
  } : eqClass(item) ? F.vesselNew : autoPrefix(item) ? it => [['_nm', `Name: ${item.name} (given by Skynet, cannot be changed)`, 'note'], ...(typeof F[type] === 'function' ? F[type](it) : F[type])] : F[type];
  const work = clone(item), before0 = item.fitting;
  const isV = !!eqClass(item);
  if (isV) for (const k of Object.keys(eqClass(item).ports)) { const p = item.ports?.[k] || {}; work[k + '_on'] = !!p.installed; work[k + '_pos'] = p.position; work[k + '_std'] = p.standard; }
  const r = await dialog(kind === 'el' ? `${type} element` : type === 'ip' ? 'IP widget (Initial Point)' : isV ? eqClass(item).title : type === 'vessel' ? 'Vessel / equipment widget' : type === 'pipe' ? (item.hose ? 'Hose' : 'Pipe') : type, fields, work, true, kind === 'el' ? elementTopic(item) : graphicTopic(item));
  try {
    if (r === 'delete') {
      if (!confirm('Delete this item?')) return;
      if (kind === 'el') draft.elements = draft.elements.filter(e => e !== item); else draft.graphics = draft.graphics.filter(g => g !== item);
      const gone = type === 'ip' ? [item.id] : hasIps(item) ? devIps(item).map(q => q.id) : eqPorts(item).map(q => q.id);
      if (type === 'vessel') {       // its own port IPs go with it; IPs that were only dropped on it stay
        for (const g of draft.graphics) if (g.attachTo === item.id && g.port) gone.push(g.id);
        draft.graphics = draft.graphics.filter(g => !(g.attachTo === item.id && g.port));
        for (const g of draft.graphics) if (g.attachTo === item.id) delete g.attachTo;
      }
      for (const g of draft.graphics) { if (gone.includes(g.from)) delete g.from; if (gone.includes(g.to)) delete g.to; }
      sel = null; renderWs(); return;
    }
    if (r !== 'ok') {      // a new vessel closed with Cancel still gets its default ports
      if (isV && item.isNew) { delete item.isNew; vesselPopup(item, syncVesselPorts(item, null)); renderWs(); }
      return;
    }
    readFields(work);
    if (isV) {
      work.ports = {};
      for (const [k, d] of Object.entries(eqClass(item).ports)) {
        work.ports[k] = { installed: !!work[k + '_on'], position: work[k + '_pos'] || portDefPos(d), standard: work[k + '_std'] || EQ_STANDARDS[0] };
        delete work[k + '_on']; delete work[k + '_pos']; delete work[k + '_std'];
      }
      work.name = (work.name || '').trim() || item.name;
      if (!work.label || work.label === item.vtype) work.label = work.vtype;   // the label follows the Type until it is changed
    }
    if (type === 'pipe') {
      if (work.from && work.from === work.to) throw new Error('A pipe needs two different IPs');
      // an IP picked in the dialog: if it sits at the far end of the drawn line, turn the line around so flow runs from -> to
      const pts = work.points || [], d = (q, c) => Math.hypot(q[0] - c[0], q[1] - c[1]);
      const a = ipPoint(work.from, work.workspace), b = ipPoint(work.to, work.workspace);
      if (pts.length > 1 && (work.from !== item.from || work.to !== item.to)) {
        const first = pts[0], last = pts[pts.length - 1];
        const keep = (a ? d(first, a) : 0) + (b ? d(last, b) : 0), flip = (a ? d(last, a) : 0) + (b ? d(first, b) : 0);
        if (flip < keep) pts.reverse();
      }
    }
    if (kind === 'el') {
      work.name = noSpaces(work.name || '');            // no spaces in names: "Test Timer" -> Test_Timer
      if (!work.name) throw new Error('Name is required');
      if (work.name !== item.name && draft.elements.some(e => e.name === work.name)) throw new Error('That name is already used');
      if (work.name !== item.name) for (const g of draft.graphics) {
        if (g.flowWhen) g.flowWhen = g.flowWhen.map(n => n === item.name ? work.name : n);
        if (g.heater === item.name) g.heater = work.name;
        for (const k of ['from', 'to']) if (devOfIp(g[k]) === item.name) g[k] = g[k].replace(`dev:${item.name}:`, `dev:${work.name}:`);
      }
      if (hasIps(item) && !hasIps(work)) for (const g of draft.graphics) for (const k of ['from', 'to']) if (devOfIp(g[k]) === item.name) delete g[k];
    }
    const kindChanged = kind === 'el' && work.kind !== item.kind;
    const pickedPort = work.attachTo !== item.attachTo;
    const before = isV ? clone(item) : null, oldTab = item.workspace;
    Object.keys(item).forEach(k => delete item[k]); Object.assign(item, work);
    if (item.workspace && item.workspace !== oldTab) {   // moved to another tab: go there with it, so it does not seem to vanish
      for (const g of draft.graphics) if (g.attachTo === (item.id ?? item.name) && !g.port && g.kind === 'ip') g.workspace = item.workspace;   // IPs dropped on it go along
      wsName = item.workspace;
      const ips = type === 'ip' ? [item.id] : hasIps(item) ? devIps(item).map(q => q.id) : eqPorts(item).map(q => q.id);
      const piped = draft.graphics.some(p => p.kind === 'pipe' && p.workspace === oldTab && (ips.includes(p.from) || ips.includes(p.to)));
      toast(`Moved to the ${item.workspace} tab.` + (piped ? ` Its pipes stayed on ${oldTab}; draw new ones here.` : ''));
    }
    if (isV) {
      const placed = syncVesselPorts(item, before.isNew ? null : before);
      if (placed.length || before.isNew) vesselPopup(item, placed);
      delete item.isNew;
    }
    if (type === 'vessel' && !item.bundled && bundledIps(item).length &&
      confirm(`Bundle ${item.label || item.name} with its ${bundledIps(item).length === 1 ? 'IP' : bundledIps(item).length + ' IPs'}?\n\nThey will move as one unit, and the vessel and its IPs can't be edited until you switch Bundled off.\n\nPress Cancel if you still need to drag its IPs into place.`)) {
      item.bundled = true; $('#vpop')?.remove(); toast('Bundled');
    }
    if (type === 'ip' && !isFitting(item) && !pickedPort) attachIp(item);   // typed a new X / Y: re-check which vessel it sits on
    if (type === 'ip' && before0 !== item.fitting) delete item.autoFit;   // a type picked by hand is kept
    giveName(item, draft.graphics);         // a new fitting type gets a matching name (IP_2 turned into a tee becomes Tee_1)
    if (kind === 'el') sel = { kind, id: item.name };
    renderTabs(); renderWs();
    if (kindChanged) editItem(kind, item.name);          // show the settings for the new kind
  } catch (e) { toast(e.message, true); }
}

async function editWorkspace() {
  if (!editing) return;
  const w = curWs(); const work = clone(w);
  await loadMediaPictures();
  const r = await dialog('Tab settings', [['name', 'Name', 'text'],
    ['_bgHead', 'Background', 'head'],
    ['tabProfile', 'Tab Background Profile (its background color, and the look new devices and widgets here start with)', 'sel', [['', '(none)'], ...(S.tabProfiles || []).map(p => [p.id, p.name])]],
    ['color', 'Background color (Default = the Tab Background Profile\'s)', 'color'],
    ['background', 'Background picture', 'gpick', 'backgrounds'],
    ['_bgPlace', 'The list shows the pictures in media/Images and its folders (Add new ... takes another picture name there; the File Move page copies pictures from your computer). The color shows wherever the picture does not cover. Leave the four boxes below empty to stretch the picture over the whole tab; fill them in to place it at a spot and size.', 'note'],
    ['bgX', 'Picture left', 'num'], ['bgY', 'Picture top', 'num'], ['bgW', 'Picture width', 'num'], ['bgH', 'Picture height', 'num'],
    ['_sizeHead', 'Size', 'head'],
    ['width', 'Tab width (default 1600)', 'num'], ['height', 'Tab height (default 900)', 'num'],
    ['pipeSize', 'Pipe size: how thick a 1/2" pipe is drawn on this tab (default 10). Other pipe and hose sizes, reducers and fittings scale from it', 'num']], work, draft.workspaces.length > 1, TAB_SPOT);
  if (r === 'delete') {
    if (!confirm(`Delete tab "${w.name}" and everything on it?`)) return;
    draft.workspaces = draft.workspaces.filter(x => x !== w);
    draft.elements = draft.elements.filter(e => e.workspace !== w.name);
    draft.graphics = draft.graphics.filter(g => g.workspace !== w.name);
    wsName = draft.workspaces[0].name;
  } else if (r === 'ok') {
    try { readFields(work); } catch (e) { return toast(e.message, true); }
    if (work.name !== w.name) { for (const x of [...draft.elements, ...draft.graphics]) if (x.workspace === w.name) x.workspace = work.name; wsName = work.name; }
    Object.keys(w).forEach(k => delete w[k]); Object.assign(w, work);     // a cleared box (picture "(none)", color Default) must remove the old value
  }
  renderTabs(); renderWs();
}

// ---------------------------------------------------------------- alarms / sound
// Browsers play nothing until this screen is tapped or clicked once, so a sound turned on before that waits for the first tap.
const tappedYet = () => navigator.userActivation ? navigator.userActivation.hasBeenActive : soundTapped;
let soundTapped = false;
function showSound() {
  $('#soundBtn').textContent = !soundOn ? 'Enable sound' : tappedYet() ? 'Sound on' : 'Sound on (tap anywhere)';
  document.querySelectorAll('.soundNowSw').forEach(x => { x.checked = soundOn; });
}
function setSound(on) {
  soundOn = on; showSound();
  if (soundOn && tappedYet()) for (const e of S.config.elements.filter(isSoundEl)) { const a = getAudio(e); if (a) { a.muted = true; a.play().then(() => { a.pause(); a.muted = false; }).catch(() => { a.muted = false; }); } }
  updateAlarms();
}
$('#soundBtn').onclick = () => setSound(!soundOn);
// the first tap or click anywhere: a sound that is already on can play now (an alarm that tried before starts again)
const firstTap = () => {
  soundTapped = true;
  document.removeEventListener('pointerdown', firstTap, true); document.removeEventListener('keydown', firstTap, true);
  setTimeout(() => { for (const a of audios.values()) if (a.paused) a._playing = false; if (soundOn) setSound(true); else showSound(); });
};
document.addEventListener('pointerdown', firstTap, true); document.addEventListener('keydown', firstTap, true);
// Default tab: "Turn Sound On when starting" turns sound on when the panel opens and when a Schema is loaded
const soundOnStart = () => { if (S.config.brewDefaults?.soundOnStart && !soundOn) setSound(true); };
const isSoundEl = e => e.type === 'alarm' || e.type === 'soundPlayer';
// the sound file an alarm / sound player plays now (Default = the panel's beep)
function soundSrc(e, v) {
  if (e.type === 'soundPlayer') return v.path || '';
  const mode = v.soundmode || (e.sounds ? 'custom' : 'default');
  if (mode === 'none') return '';
  return mode === 'default' && e.sounds ? 'sounds/alarm_beep.wav' : (e.sounds?.[(v.fileindex || 1) - 1] || v.sound || e.sound || (mode === 'default' ? 'sounds/alarm_beep.wav' : ''));
}
const hasSoundNow = (e, v) => !!soundSrc(e, v);
function getAudio(e) {
  const src = soundSrc(e, S.values[e.name] || {});
  if (!src) return null;
  let a = audios.get(e.name);
  if (!a || a._src !== src) { a = new Audio(media(src)); a._src = src; audios.set(e.name, a); }
  return a;
}
// Only one sound at a time: the panel marks the one that plays ("playing"); the others are quiet.
// Music (Sound Player, Sound only alarms) pauses and goes on where it was; an alarm that had to wait starts from the beginning.
function updateAlarms() {
  for (const e of S.config.elements.filter(isSoundEl)) {
    const v = S.values[e.name] || {}; const a = getAudio(e); if (!a) continue;
    a.loop = !!v.loop;
    const music = e.type === 'soundPlayer' || e.kind === 'sound';
    if (v.playing && soundOn) {
      if (a.paused && !a._playing) { a._playing = true; if (!(music && a._held && !a.ended)) a.currentTime = 0; a._held = false; a.play().catch(() => { }); }
    } else {
      if (a._playing && v.active) a._held = true;            // paused for a higher sound: goes on later
      if (!v.active) a._held = false;
      a._playing = false; if (!a.paused) a.pause();
    }
  }
}

// ---------------------------------------------------------------- scripts
let curScript = null, dirty = false, problems = [];
function renderScripts() { renderScriptList(); }
// grouped by class: Flow, Sub, Repeat, Looper (lib/scaffold.js); a group can be folded
let foldedClasses = new Set();
try { foldedClasses = new Set(JSON.parse(localStorage.getItem('bp.foldedClasses') || '[]')); } catch { /* private window */ }
function renderScriptList(force) {
  const ul = $('#scriptList');
  if (!force && ul.contains(document.activeElement) && document.activeElement.tagName === 'INPUT') return;   // someone is typing an Order number
  ul.innerHTML = '';
  for (const [c, d] of Object.entries(S.processClasses || { sub: { label: 'Processes' } })) {
    const list = S.scripts.filter(s => (s.cls || 'sub') === c).sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9));
    if (!list.length) continue;
    const folded = foldedClasses.has(c);
    ul.append(h('li', { class: 'clsHead', title: d.about || '', onclick: () => {
      folded ? foldedClasses.delete(c) : foldedClasses.add(c);
      try { localStorage.setItem('bp.foldedClasses', JSON.stringify([...foldedClasses])); } catch { /* ignore */ }
      renderScriptList();
    } }, (folded ? '▸ ' : '▾ ') + d.label, h('span', { class: 'muted' }, ` (${list.length})`)));
    if (folded) continue;
    for (const s of list) {
      const st = s.state === 'running' ? (s.waiting ? 'waiting' : 'running') : s.state === 'error' ? 'error' : '';
      // Order: type a new number and the others in the group are numbered again around it (like the Menu Order)
      const n = h('input', { type: 'number', min: 1, max: list.length, step: 1, value: s.order ?? '', class: 'orderNum', title: 'Order in this list. Type a new number to move this Process there.', onclick: ev => ev.stopPropagation(), ...(can('admin') ? {} : { disabled: true }) });
      n.onchange = guard(async () => { await api('POST', `/ui/scripts/${encodeURIComponent(s.name)}/order`, { n: +n.value }); S.scripts = await api('GET', '/ui/scripts'); renderScriptList(true); });
      n.onblur = () => setTimeout(() => renderScriptList(), 0);
      ul.append(h('li', { class: s.name === curScript ? 'active' : '', title: s.error || s.state, onclick: () => openScript(s.name) }, n, h('span', { class: 'st ' + st }), s.name, s.modified ? ' *' : ''));
    }
  }
}
async function openScript(name) {
  if (dirty && !confirm('Discard unsaved changes?')) return;
  curScript = name; dirty = false; problems = [];
  $('#code').value = await api('GET', '/ui/scripts/' + encodeURIComponent(name));
  $('#scriptName').textContent = name;
  knownPaths = new Set();       // paths already in the process are not warned about again, only ones added now
  if (can('admin')) api('POST', '/ui/scripts/check', $('#code').value, true).then(r => { for (const x of r.offBrain ?? []) knownPaths.add(x.path); }).catch(() => { });
  renderScriptList(); updateGutter(); updateScriptState(); renderProblems(); renderConsole();
  api('GET', '/ui/scripts/words').then(w => { S.words = w; paintFind(); }).catch(() => { });
  fIdx = -1; refreshFind(false);
}
function updateScriptState() {
  const s = S.scripts.find(x => x.name === curScript);
  const st = $('#scriptState');
  const sel = $('#scriptClass');
  sel.disabled = !s || !can('admin');
  if (s && document.activeElement !== sel) sel.value = s.cls || 'sub';
  const ar = $('#scriptAutoRestart');
  ar.disabled = !s || !can('admin'); ar.checked = !!s?.autorestart;
  if (!s) { st.textContent = ''; updateGutter(); return; }
  let t = s.state;
  if (s.state === 'running') t = (s.waiting ? 'waiting' : 'running') + ` (line ${s.line}${s.step ? `, step ${[s.step.num, s.step.name].filter(Boolean).join(' ')}` : ''})` + (s.modified ? ' - edited since start, stop and start to apply' : '');
  if (s.state === 'error') t = s.error;
  st.textContent = t; st.style.color = s.state === 'error' ? 'var(--bad)' : s.state === 'running' ? 'var(--ok)' : '';
  updateGutter();
}
function updateGutter() {
  const n = $('#code').value.split('\n').length;
  const s = S.scripts.find(x => x.name === curScript);
  const cur = s?.state === 'running' ? s.line : 0;
  const errs = new Set(problems.map(p => p.line)); if (s?.state === 'error' && s.line) errs.add(s.line);
  $('#gutter').innerHTML = Array.from({ length: n }, (_, i) => { const l = i + 1; return errs.has(l) ? `<span class="err">${l}</span>` : l === cur ? `<span class="cur">${l}</span>` : l; }).join('\n');
  $('#gutter').scrollTop = $('#code').scrollTop;
}
function renderProblems() {
  const ul = $('#problems'); ul.innerHTML = '';
  if (problems === null) return;
  if (!problems.length) { if (curScript) ul.append(h('li', { class: 'ok' }, 'No problems found')); return; }
  for (const p of problems) ul.append(h('li', { onclick: () => gotoLine(p.line) }, `Line ${p.line}: ${p.msg}`));
}
function gotoLine(l, ta = $('#code')) {
  const lines = ta.value.split('\n');
  l = Math.min(Math.max(1, l), lines.length);
  const start = lines.slice(0, l - 1).reduce((a, s) => a + s.length + 1, 0);
  ta.focus(); ta.setSelectionRange(start, start + (lines[l - 1] || '').length);
  const lh = parseFloat(getComputedStyle(ta).lineHeight) || 19.5;
  ta.scrollTop = Math.max(0, 8 + (l - 1) * lh - ta.clientHeight / 3); ta.scrollLeft = 0;
  syncHl(); fGutter().scrollTop = ta.scrollTop;
}
// Go to line (Ctrl+G or the button), in the Process editor or the Config Editor
function askLine() {
  const ta = fTa(), n = ta.value.split('\n').length, here = ta.value.slice(0, ta.selectionStart).split('\n').length;
  const a = prompt(`Go to line (1 to ${n})`, here); if (a === null) return;
  const l = parseInt(a, 10);
  if (!Number.isFinite(l) || l < 1 || l > n) return toast(`Pick a line from 1 to ${n}`, true);
  gotoLine(l, ta);
}
$('#goLine').onclick = askLine;
$('#code').addEventListener('input', () => { dirty = true; updateGutter(); $('#scriptName').textContent = curScript + ' (not saved)'; refreshFind(false); });
$('#code').addEventListener('scroll', () => { $('#gutter').scrollTop = $('#code').scrollTop; syncHl(); });
attachAutofill($('#code'), $('#autofill'), () => S?.words);
$('#code').addEventListener('keydown', ev => {
  if (ev.key === 'Tab') { ev.preventDefault(); document.execCommand('insertText', false, '\t'); }
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); saveScript(); }
});
// ---------------------------------------------------------------- find and replace
// In the open script or the Config Editor (the bar moves to whichever page is open): Ctrl+F (find), Ctrl+H (replace), or the Find button (phones). Matches are painted on a layer behind the editor.
// Across every script: the All scripts button lists each match first; only the ticked ones are replaced.
const escHtml = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
function findRe(text, matchCase, word) {
  if (!text) return null;
  const esc = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(word ? `(?<![A-Za-z0-9_])${esc}(?![A-Za-z0-9_])` : esc, 'g' + (matchCase ? '' : 'i'));
}
const findMatches = (str, re) => re ? [...str.matchAll(re)].map(m => [m.index, m.index + m[0].length]) : [];
let fMatches = [], fIdx = -1;
const fTa = () => view === 'config' ? $('#cfgCode') : $('#code');
const fHl = () => view === 'config' ? $('#cfgCodeHl') : $('#codeHl');
const fGutter = () => view === 'config' ? $('#cfgGutter') : $('#gutter');
// put the find bar above the editor of the page being shown
function placeFind() {
  const ed = fTa().closest('.editor');
  if (ed.previousElementSibling !== $('#findBar')) { $('#codeHl').innerHTML = $('#cfgCodeHl').innerHTML = ''; ed.before($('#findBar')); }
  refreshFind(false);
}
const findOpen = () => !$('#findBar').classList.contains('hidden');
const curRe = () => findRe($('#findText').value, $('#findCase').checked, $('#findWord').checked);
function showFind(replace) {
  const ta = fTa(), selText = ta.value.slice(ta.selectionStart, ta.selectionEnd);
  if (selText && !selText.includes('\n')) $('#findText').value = selText;
  $('#findBar').classList.remove('hidden');
  const box = replace && can('admin') ? $('#replText') : $('#findText');
  box.focus(); box.select();
  refreshFind(true);
}
function hideFind() {
  $('#findBar').classList.add('hidden'); paintFind();
  const ta = fTa(), m = fMatches[fIdx];
  ta.focus(); if (m) ta.setSelectionRange(m[0], m[1]);
}
// recount the matches; `jump` moves to the first match at or after the cursor
function refreshFind(jump) {
  if (!findOpen()) { fMatches = []; fIdx = -1; paintFind(); return; }
  const ta = fTa(), at = fMatches[fIdx]?.[0] ?? ta.selectionStart;
  fMatches = findMatches(ta.value, curRe());
  fIdx = fMatches.length ? Math.max(0, fMatches.findIndex(m => m[0] >= at)) : -1;
  if (fIdx === -1 && fMatches.length) fIdx = 0;
  paintFind(); if (jump) showMatch();
}
function paintFind() {
  const t = $('#findText').value, n = fMatches.length;
  $('#findCount').textContent = !findOpen() || !t ? '' : n ? `${fIdx + 1} of ${n}` : 'No matches';
  $('#findCount').style.color = findOpen() && t && !n ? 'var(--bad)' : '';
  for (const b of ['#findPrev', '#findNext', '#replOne', '#replAll']) $(b).disabled = !n;
  const v = fTa().value;
  // the Process editor in color: every word painted by what it does, find matches on top (public/colorize.js)
  if (fTa() === $('#code') && colorsOn()) { fHl().innerHTML = toHtml(v, classify(v, S?.words), 0, v.length, findOpen() ? fMatches : [], fIdx) + '\n '; syncHl(); return; }
  if (!findOpen() || !n) { fHl().innerHTML = ''; return; }
  let out = '', last = 0;
  fMatches.forEach(([s, e], i) => { out += escHtml(v.slice(last, s)) + `<mark${i === fIdx ? ' class="cur"' : ''}>${escHtml(v.slice(s, e))}</mark>`; last = e; });
  fHl().innerHTML = out + escHtml(v.slice(last)) + '\n ';
  syncHl();
}
const syncHl = () => { const ta = fTa(); fHl().style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`; };
let charW = 0;
function showMatch() {
  const ta = fTa(), m = fMatches[fIdx]; if (!m) return;
  ta.setSelectionRange(m[0], m[1]);
  const before = ta.value.slice(0, m[0]), line = before.split('\n').length - 1, col = m[0] - before.lastIndexOf('\n') - 1;
  if (!charW) { const c = document.createElement('canvas').getContext('2d'); c.font = getComputedStyle(ta).font; charW = c.measureText('MMMMMMMMMM').width / 10 || 7.8; }
  const lh = parseFloat(getComputedStyle(ta).lineHeight) || 19.5, y = 8 + line * lh, x = 8 + col * charW;
  if (y < ta.scrollTop || y + lh > ta.scrollTop + ta.clientHeight) ta.scrollTop = y - ta.clientHeight / 3;
  if (x < ta.scrollLeft || x + (m[1] - m[0]) * charW > ta.scrollLeft + ta.clientWidth) ta.scrollLeft = Math.max(0, x - ta.clientWidth / 3);
  syncHl(); fGutter().scrollTop = ta.scrollTop;
}
function stepFind(d) { if (!fMatches.length) return; fIdx = (fIdx + d + fMatches.length) % fMatches.length; paintFind(); showMatch(); }
// type into the editor through the browser so Ctrl+Z can undo it, then give the focus back
function editCode(start, end, text, back) {
  const ta = fTa();
  ta.focus(); ta.setSelectionRange(start, end);
  if (!document.execCommand('insertText', false, text)) { ta.setRangeText(text, start, end, 'end'); ta.dispatchEvent(new Event('input')); }
  back?.focus();
}
$('#findBtn').onclick = () => findOpen() ? hideFind() : showFind();
$('#findClose').onclick = hideFind;
$('#findPrev').onclick = () => stepFind(-1);
$('#findNext').onclick = () => stepFind(1);
$('#findText').addEventListener('input', () => { fIdx = -1; refreshFind(true); });
for (const id of ['#findCase', '#findWord']) $(id).addEventListener('change', () => refreshFind(true));
for (const id of ['#findText', '#replText']) $(id).addEventListener('keydown', ev => {
  if (ev.key === 'Enter') { ev.preventDefault(); if (id === '#replText' && !ev.shiftKey) $('#replOne').click(); else stepFind(ev.shiftKey ? -1 : 1); }
  if (ev.key === 'Escape') { ev.preventDefault(); hideFind(); }
});
$('#replOne').onclick = () => {
  const m = fMatches[fIdx]; if (!m || !can('admin')) return;
  const at = m[0] + $('#replText').value.length;
  editCode(m[0], m[1], $('#replText').value, $('#replText'));
  fIdx = -1; fTa().setSelectionRange(at, at); refreshFind(true);
};
$('#replAll').onclick = () => {
  if (!fMatches.length || !can('admin')) return;
  const n = fMatches.length, ta = fTa();
  editCode(0, ta.value.length, ta.value.replace(curRe(), () => $('#replText').value), $('#replText'));
  refreshFind(false); toast(`Replaced ${n} match${n === 1 ? '' : 'es'} - press Save to keep the change`);
};
document.addEventListener('keydown', ev => {
  if (!['scripts', 'config'].includes(view) || document.querySelector('dialog[open]')) return;
  const k = ev.key.toLowerCase(), mod = ev.ctrlKey || ev.metaKey;
  if (mod && k === 'f') { ev.preventDefault(); showFind(false); }
  else if (ev.ctrlKey && k === 'h') { ev.preventDefault(); showFind(true); }
  else if (mod && k === 'g') { ev.preventDefault(); askLine(); }
  else if (findOpen() && k === 'f3') { ev.preventDefault(); stepFind(ev.shiftKey ? -1 : 1); }
  else if (k === 'escape' && findOpen() && ev.target === fTa()) hideFind();
});

// ---- across all scripts
let faRes = [];
const faRe = () => findRe($('#faText').value, $('#faCase').checked, $('#faWord').checked);
$('#findAllBtn').onclick = () => {
  if (findOpen()) { $('#faText').value = $('#findText').value; $('#faCase').checked = $('#findCase').checked; $('#faWord').checked = $('#findWord').checked; $('#faRepl').value = $('#replText').value; }
  faRes = []; renderFindAll(); $('#findAllDlg').showModal(); $('#faText').focus(); if ($('#faText').value) $('#faSearch').click();
};
$('#faSearch').onclick = guard(async () => {
  const re = faRe(); if (!re) return toast('Type something to find', true);
  $('#faSummary').textContent = 'Searching...';
  const texts = await Promise.all(S.scripts.map(s => api('GET', '/ui/scripts/' + encodeURIComponent(s.name))));
  faRes = S.scripts.map((s, i) => {
    const text = texts[i], lines = text.split('\n'), starts = [];
    lines.reduce((a, l) => (starts.push(a), a + l.length + 1), 0);
    const matches = findMatches(text, re).map(([a, b]) => { let ln = 0; while (ln + 1 < starts.length && starts[ln + 1] <= a) ln++; return { a, b, line: ln + 1, ls: starts[ln], lt: lines[ln], on: true }; });
    return { name: s.name, text, matches };
  }).filter(r => r.matches.length);
  $('#faTickAll').checked = true; renderFindAll();
});
for (const id of ['#faText', '#faRepl']) $(id).addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); $('#faSearch').click(); } });
for (const id of ['#faCase', '#faWord']) $(id).addEventListener('change', () => { if (faRes.length || $('#faText').value) $('#faSearch').click(); });
$('#faRepl').addEventListener('input', () => renderFindAll());
$('#faTickAll').addEventListener('change', ev => { for (const r of faRes) for (const m of r.matches) m.on = ev.target.checked; renderFindAll(); });
function renderFindAll() {
  const list = $('#faList'); list.innerHTML = '';
  const total = faRes.reduce((a, r) => a + r.matches.length, 0), ticked = faRes.reduce((a, r) => a + r.matches.filter(m => m.on).length, 0);
  const admin = can('admin'), repl = $('#faRepl').value;
  $('#faSummary').textContent = !$('#faText').value ? 'Type what to find, then press Search.' : !total ? 'No matches in any Process.' : `${total} match${total === 1 ? '' : 'es'} in ${faRes.length} Process${faRes.length === 1 ? '' : 'es'}` + (admin ? `, ${ticked} ticked` : '') + '. Tap a line to open it.';
  $('#faReplace').disabled = !ticked;
  for (const r of faRes) {
    const run = S.scripts.find(s => s.name === r.name)?.state === 'running';
    list.append(h('div', { class: 'faScript' }, r.name, run ? h('span', { class: 'muted' }, '  (running: restart it to use the change)') : null));
    for (const m of r.matches) {
      const s = m.a - m.ls, e = m.b - m.ls;
      const old = h('div', { class: 'faLine' }, m.lt.slice(0, s).trimStart(), h('mark', {}, m.lt.slice(s, e)), m.lt.slice(e));
      const neu = admin && m.on ? h('div', { class: 'faLine faNew' }, m.lt.slice(0, s).trimStart(), h('mark', {}, repl), m.lt.slice(e)) : null;
      list.append(h('div', { class: 'faRow' },
        admin ? h('input', { type: 'checkbox', checked: m.on, onchange: ev => { m.on = ev.target.checked; renderFindAll(); } }) : null,
        h('span', { class: 'faNo muted' }, m.line),
        h('div', { class: 'faText', onclick: () => openFindHit(r.name, m.a) }, old, neu)));
    }
  }
}
const openFindHit = guard(async (name, at) => {
  if (curScript !== name) { await openScript(name); if (curScript !== name) return; }
  $('#findAllDlg').close();
  $('#findText').value = $('#faText').value; $('#findCase').checked = $('#faCase').checked; $('#findWord').checked = $('#faWord').checked; $('#replText').value = $('#faRepl').value;
  $('#findBar').classList.remove('hidden');
  fMatches = findMatches($('#code').value, curRe()); fIdx = Math.max(0, fMatches.findIndex(m => m[0] === at));
  paintFind(); showMatch();
});
$('#faReplace').onclick = guard(async () => {
  const todo = faRes.map(r => ({ ...r, hits: r.matches.filter(m => m.on) })).filter(r => r.hits.length);
  const n = todo.reduce((a, r) => a + r.hits.length, 0), repl = $('#faRepl').value;
  if (!n) return;
  if (dirty && todo.some(r => r.name === curScript)) throw new Error(`"${curScript}" has unsaved changes. Save it first, then search again.`);
  if (!confirm(`Replace ${n} match${n === 1 ? '' : 'es'} in ${todo.length} Process${todo.length === 1 ? '' : 'es'} with "${repl}"?\n\nEach Process is saved straight away.`)) return;
  const done = [], changed = [], bad = [];
  for (const r of todo) {
    if (await api('GET', '/ui/scripts/' + encodeURIComponent(r.name)) !== r.text) { changed.push(r.name); continue; }   // edited since the search: leave it alone
    let t = r.text;
    for (const m of [...r.hits].sort((x, y) => y.a - x.a)) t = t.slice(0, m.a) + repl + t.slice(m.b);
    const res = await api('PUT', '/ui/scripts/' + encodeURIComponent(r.name), t, true);
    done.push(r.name); if (res.errors?.length) bad.push(`${r.name} (${res.errors.length})`);
  }
  S.scripts = await api('GET', '/ui/scripts'); renderScriptList();
  if (done.includes(curScript)) { dirty = false; await openScript(curScript); }
  const msg = `Replaced in ${done.length} Process${done.length === 1 ? '' : 'es'}.` + (changed.length ? ` Skipped (changed since the search): ${changed.join(', ')}.` : '') + (bad.length ? ` Now has problems: ${bad.join(', ')}.` : '');
  toast(msg, !!(changed.length || bad.length));
  $('#faSearch').click();
});

// ---------------------------------------------------------------- colors, files and the Recycle Bin (Fritz, 2026-10-19)
// Colors: each viewer turns them on or off for themselves (kept in this browser only)
const COLORS_KEY = 'skynet.processColors';
function colorsOn() { return $('#colorsOn').checked; }
try { $('#colorsOn').checked = localStorage.getItem(COLORS_KEY) !== 'off'; } catch { }
function applyColors() { $('#code').closest('.codeWrap').classList.toggle('colored', colorsOn()); paintFind(); }
$('#colorsOn').onchange = () => { try { localStorage.setItem(COLORS_KEY, colorsOn() ? 'on' : 'off'); } catch { } applyColors(); };
applyColors();
const KEY_SAMPLES = { cmd: 'if  wait  start  true', dev: 'Pump_Red  HLT_Temp', wid: 'tm_Mash  alm_Hops', vk: 'vKV_Strike', vapi: 'vAV_Mash_Temp', var: 'new value x', proc: 'start sub_Fill',
  op: '=  +  -  <  and', str: '"Mash in"', num: '185.5  00:10:00', com: '// note  # note  /* note */', lab: '[Mash]  goto Mash', attr: 'tm_Mash.visible' };
const KEY_WORDS = { elements: [{ name: 'Pump_Red', type: 'digitalOut' }, { name: 'HLT_Temp', type: 'temperature' }, { name: 'tm_Mash', type: 'timer' }, { name: 'alm_Hops', type: 'alarm' },
  { name: 'vKV_Strike', type: 'vKonstant' }, { name: 'vAV_Mash_Temp', type: 'vAPI' }], processes: ['sub_Fill'] };
$('#colorKey').onclick = () => {
  const box = $('#keyList'); box.innerHTML = '';
  for (const [c, label] of LEGEND) {
    const t = KEY_SAMPLES[c], code = h('code', { class: 'keyCode' });
    code.innerHTML = toHtml(t, classify(t, KEY_WORDS));
    box.append(h('div', { class: 'keyRow' }, h('span', { class: 'keyName' }, label), code));
  }
  $('#keyDlg').showModal();
};

// Save to file: the whole Process or the highlighted part, as text or as XML in color; and the Notepad++ colors file
let lastSel = [0, 0];
for (const ev of ['select', 'keyup', 'mouseup', 'touchend']) $('#code').addEventListener(ev, () => { const ta = $('#code'); lastSel = [ta.selectionStart, ta.selectionEnd]; });
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = h('a', { href: url, download: name }); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
const fileName = n => String(n).replace(/[\\/:*?"<>|\s]+/g, '_');
$('#saveAs').onchange = guard(async ev => {
  const what = ev.target.value; ev.target.value = '';
  if (!what) return;
  if (what === 'npp') {
    const words = await api('GET', '/ui/scripts/words');
    const texts = await Promise.all(S.scripts.map(s => api('GET', '/ui/scripts/' + encodeURIComponent(s.name)).catch(() => '')));
    download('Skynet_Process_Notepad++.xml', notepadPlusPlus(words, texts), 'application/xml');
    toast('Saved. In Notepad++: Language > User Defined Language > Define your language > Import (see Help)');
    return;
  }
  if (!curScript) throw new Error('Open a Process first');
  const ta = $('#code'), text = ta.value;
  let [a, b] = ta.selectionEnd > ta.selectionStart ? [ta.selectionStart, ta.selectionEnd] : lastSel;
  if (what.startsWith('all')) [a, b] = [0, text.length];
  else if (b <= a) throw new Error('Highlight some lines of the Process first, then pick this again');
  const first = text.slice(0, a).split('\n').length, last = first + text.slice(a, b).split('\n').length - 1;
  const base = fileName(curScript) + (what.startsWith('sel') ? `_lines_${first}-${last}` : '');
  if (what.endsWith('txt')) download(base + '.txt', text.slice(a, b), 'text/plain;charset=utf-8');
  else download(base + '.xml', processXml(curScript, text, S.words, a, b), 'application/xml');
  if (dirty) toast('Saved what is in the editor now (the Process itself is not saved yet)');
});

// Recycle Bin: Delete moves a Process here; putting one back or erasing it for good always asks first
$('#binBtn').onclick = guard(async () => { await renderBin(); $('#binView').classList.add('hidden'); $('#binDlg').showModal(); });
async function renderBin() {
  const list = await api('GET', '/ui/recycle'), box = $('#binList'); box.innerHTML = '';
  if (!list.length) box.append(h('div', { class: 'faRow muted' }, 'The Recycle Bin is empty.'));
  const admin = can('admin');
  for (const b of list) box.append(h('div', { class: 'faRow binRow' },
    h('div', { class: 'faText' }, h('div', {}, h('strong', {}, b.name)), h('div', { class: 'muted faLine' }, `Deleted ${new Date(b.deletedAt).toLocaleString()}, ${b.lines} line${b.lines === 1 ? '' : 's'}`)),
    h('button', { type: 'button', title: 'Show what is in it', onclick: guard(async () => {
      const t = await api('GET', '/ui/recycle/' + encodeURIComponent(b.id)), v = $('#binView');
      v.innerHTML = toHtml(t, classify(t, S.words)); v.classList.remove('hidden');
    }) }, 'Look'),
    admin ? h('button', { type: 'button', class: 'primary', onclick: guard(() => restoreFromBin(b)) }, 'Restore') : null,
    admin ? h('button', { type: 'button', class: 'danger', onclick: guard(async () => {
      if (!confirm(`Delete "${b.name}" for good?\n\nIt cannot be brought back after this.`)) return;
      await api('DELETE', '/ui/recycle/' + encodeURIComponent(b.id)); toast(`"${b.name}" deleted for good`); $('#binView').classList.add('hidden'); await renderBin();
    }) }, 'Delete for good') : null));
}
async function restoreFromBin(b) {
  if (!confirm(`Restore the Process "${b.name}"?\n\nIt goes back in the Process list (it was deleted ${new Date(b.deletedAt).toLocaleString()}).`)) return;
  let as = b.name, r;
  for (;;) {
    r = await api('POST', `/ui/recycle/${encodeURIComponent(b.id)}/restore`, { as });
    if (r.ok) break;
    as = prompt(`${r.msg}\n\nRestore it as:`, as + '_restored'); if (!as) return;
    as = noSpaces(as);
  }
  S.scripts = await api('GET', '/ui/scripts'); renderScriptList();
  $('#binDlg').close(); toast(`"${r.name}" is back`);
  if (!dirty) openScript(r.name);
}

const saveScript = guard(async () => {
  if (!curScript) return;
  const r = await api('PUT', '/ui/scripts/' + encodeURIComponent(curScript), $('#code').value, true);
  // the server writes it in the new style and renumbers the steps: show what was saved, keeping the place
  const ta = $('#code');
  if (typeof r.text === 'string' && r.text !== ta.value) {
    const line = ta.value.slice(0, ta.selectionStart).split('\n').length, top = ta.scrollTop;
    ta.value = r.text;
    const pos = r.text.split('\n').slice(0, line - 1).reduce((a, l) => a + l.length + 1, 0);
    ta.setSelectionRange(pos, pos); ta.scrollTop = top;
  }
  dirty = false; $('#scriptName').textContent = curScript; problems = r.errors; renderProblems(); updateGutter(); refreshFind(false);
  const note = r.modernized ? ` (${r.modernized} line(s) changed to the new style)` : '';
  toast((problems.length ? `Saved with ${problems.length} problem(s)` : 'Saved') + note, !!problems.length);
  const added = (r.offBrain ?? []).filter(x => !knownPaths.has(x.path));
  for (const x of added) knownPaths.add(x.path);
  if (added.length && S.config.warnOffBrainPaths !== false) offBrainDialog(added);
});
// A path in a process that is not on the Brain (the Pi): files there cannot be reached from a phone or another computer
function offBrainDialog(list) {
  const d = $('#valDlg'); d.innerHTML = '';
  const off = h('input', { type: 'checkbox' });
  const close = guard(async () => {
    d.close();
    if (off.checked) { await api('PUT', '/ui/settings', { warnOffBrainPaths: false }); S.config.warnOffBrainPaths = false; toast('Path warnings are off. Turn them back on in Settings > Panel settings.'); }
  });
  d.append(h('div', { class: 'vdTitle' }, '⚠ File not on the Brain'),
    h('p', {}, list.length === 1 ? 'This process uses a file that is not on the Brain (the Raspberry Pi):' : 'This process uses files that are not on the Brain (the Raspberry Pi):'),
    h('ul', {}, ...list.map(x => h('li', {}, h('code', {}, x.path), ` (line ${x.line}) ${x.why}.`))),
    h('p', {}, 'Files that are not on the Brain cannot be reached remotely, from your phone or another computer. Put the file in a media folder with the Media screen and use its path there, for example ', h('code', {}, 'sounds/bell.wav'), '.'),
    h('label', { class: 'check' }, off, ' Do not show this warning again'),
    h('div', { class: 'vdBtns' }, h('button', { type: 'button', class: 'big primary', onclick: close }, 'OK')));
  d.oncancel = () => { d.oncancel = null; close(); };
  d.showModal();
}
$('#saveScript').onclick = saveScript;
$('#scriptClass').onchange = guard(async ev => { if (curScript) await api('POST', `/ui/scripts/${encodeURIComponent(curScript)}/class`, { cls: ev.target.value }); });
$('#addSteps').onclick = guard(async () => {
  if (!curScript) return;
  const ta = $('#code'), t = await api('POST', '/ui/scripts/addsteps', ta.value, true);
  if (t.text === ta.value) { toast('Every [label] already has a step'); return; }
  ta.value = t.text; dirty = true; updateGutter(); refreshFind(false); $('#scriptName').textContent = curScript + ' (not saved)';
  toast('Steps added: Save to number them');
});
$('#checkScript').onclick = guard(async () => { const r = await api('POST', '/ui/scripts/check', $('#code').value, true); problems = r.errors; renderProblems(); updateGutter(); });
$('#startScript').onclick = guard(async () => {
  if (!curScript) return;
  if (dirty) await saveScript();
  const r = await api('POST', `/ui/scripts/${encodeURIComponent(curScript)}/start`);
  if (!r.ok) toast(r.line ? `Not started - line ${r.line}: ${r.msg}` : r.msg, true);
});
$('#stopScript').onclick = guard(() => api('POST', `/ui/scripts/${encodeURIComponent(curScript)}/stop`));
$('#restartScript').onclick = guard(async () => {
  if (!curScript) return;
  if (dirty) await saveScript();
  const r = await api('POST', `/ui/scripts/${encodeURIComponent(curScript)}/restart`);
  if (!r.ok) toast(r.line ? `Not started - line ${r.line}: ${r.msg}` : r.msg, true);
  else toast('Restarted');
});
$('#scriptAutoRestart').onchange = guard(async ev => {
  if (!curScript) return;
  await api('POST', `/ui/scripts/${encodeURIComponent(curScript)}/autorestart`, { on: ev.target.checked });
  toast(ev.target.checked ? `${curScript} will restart by itself if it stops on an error` : `${curScript} will not restart by itself`);
});
$('#stopAll').onclick = guard(() => api('POST', '/ui/stopall'));
$('#newScript').onclick = guard(async () => {
  let n = prompt('New process name'); if (!n) return;
  n = noSpaces(n);
  if (S.scripts.some(s => s.name === n)) throw new Error('That name is used');
  await api('PUT', '/ui/scripts/' + encodeURIComponent(n), '//' + n + '\n', true);
  S.scripts = await api('GET', '/ui/scripts'); dirty = false; openScript(n);
});
$('#renScript').onclick = guard(async () => {
  if (!curScript) return; let n = prompt('Rename to', curScript); if (!n) return;
  n = noSpaces(n); if (n === curScript) return;
  await api('POST', `/ui/scripts/${encodeURIComponent(curScript)}/rename`, { to: n });
  curScript = n; S.scripts = await api('GET', '/ui/scripts'); renderScriptList(); $('#scriptName').textContent = curScript;
});
$('#delScript').onclick = guard(async () => {
  if (!curScript || !confirm(`Delete the Process "${curScript}"?\n\nIt goes to the Recycle Bin, where you can restore it.` + (dirty ? '\n\nYour unsaved changes are lost.' : ''))) return;
  await api('DELETE', '/ui/scripts/' + encodeURIComponent(curScript));
  toast(`"${curScript}" moved to the Recycle Bin`);
  curScript = null; dirty = false; $('#code').value = ''; $('#scriptName').textContent = '-'; S.scripts = await api('GET', '/ui/scripts'); renderScriptList(); updateGutter(); refreshFind(false);
});
function renderConsole() {
  const all = $('#consoleAll').checked;
  const rows = S.console.filter(c => all || !curScript || c.script === curScript).slice(-400);
  const pad = n => String(n).padStart(2, '0');
  $('#console').replaceChildren(...rows.map(c => {
    const d = new Date(c.ts), row = h('div');
    setRich(row, `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${all ? '[' + c.script + '] ' : ''}${c.text}`);
    return row;
  }));
  $('#console').scrollTop = 1e9;
}
$('#consoleAll').onchange = renderConsole;
$('#clearConsole').onclick = () => { S.console = []; renderConsole(); };

// ---------------------------------------------------------------- variables page: vAPI, vKonstant, shared
const LOG_LABEL = { none: 'Off', ondemand: 'Manual (log line / Log now)', script: 'On demand only (when a process starts)', once: 'Once',
  ms: 'Every N milliseconds', seconds: 'Every N seconds', minutes: 'Every N minutes', hours: 'Every N hours', days: 'Every N days', hms: 'Every 00:00:00' };
const TIME_MODES = ['ms', 'seconds', 'minutes', 'hours', 'days', 'hms'];
function logSummary(lg) {
  lg = lg || { mode: 'none' };
  if (lg.mode === 'script') return lg.script ? `When "${lg.script}" starts` : 'On demand only (no process picked)';
  if (!TIME_MODES.includes(lg.mode)) return LOG_LABEL[lg.mode] || lg.mode;
  const every = lg.mode === 'hms' ? `Every ${lg.interval || '?'}` : `Every ${lg.every ?? 1} ${{ ms: 'ms', seconds: 'sec', minutes: 'min', hours: 'h', days: 'day(s)' }[lg.mode]}`;
  return every + (lg.at ? ` at ${lg.at}` : '');
}
function varRow(e, withLog) {
  const v = S.values[e.name] || {}, k = vkKind(e);
  let val;
  if (k === 'pushbutton' || k === 'momentary') val = h('span', { 'data-g': e.name, class: 'muted' }, v.value ? 'ON' : 'OFF');
  else if (k === 'longstring') val = h('span', {}, h('button', { onclick: () => valueDialog(e) }, 'Edit text…'), ' ', h('span', { class: 'muted' }, v.file || '(no file: kept in memory)'));
  else val = h('input', { class: 'val', 'data-g': e.name, value: fmtVal(e, v.value), onchange: ev => setProp(e.name, 'value', ev.target.value) });
  const kindText = e.type === 'vKonstant' || e.type === 'vAPI' ? kindsOf(e.type)[e.kind || 'value']?.label : e.dataType;
  const cells = [h('td', {}, e.name), h('td', {}, kindText), h('td', {}, val)];
  if (withLog) {
    const lg = e.log || { mode: 'none' };
    cells.push(h('td', {}, logSummary(lg), ' ', h('button', { onclick: () => editLog(e) }, 'Change…')),
      h('td', {}, h('button', { onclick: guard(async () => { await api('POST', '/ui/log/now/' + encodeURIComponent(e.name)); toast('Logged'); }) }, 'Log now'),
        lg.mode === 'once' ? h('button', { title: 'Write one more time', onclick: guard(async () => { await api('POST', '/ui/log/once/' + encodeURIComponent(e.name)); toast('Armed'); }) }, 'Once again') : ''));
  }
  return h('tr', {}, ...cells);
}
function renderGlobals() {
  const of = t => S.config.elements.filter(e => e.type === t).sort((a, b) => a.name.localeCompare(b.name));
  for (const [id, type, withLog] of [['#vapiBody', 'vAPI', true], ['#vkBody', 'vKonstant', false], ['#sharedBody', 'shared', false]]) {
    const tb = $(id); tb.innerHTML = '';
    tb.append(...of(type).map(e => varRow(e, withLog)));
    tb.closest('table').classList.toggle('empty', !of(type).length);
  }
  // database triggers are part of the layout (admin); values and "Log now" need an operator
  if (!can('admin')) $$('#view-globals select, #view-globals input[type=number]:not(.val)').forEach(i => i.disabled = true);
  if (!can('operator')) { $$('#view-globals input.val').forEach(i => i.disabled = true); $$('#view-globals button').forEach(b => b.disabled = true); }
}
function refreshGlobalValues(ch) {
  for (const n of Object.keys(ch)) {
    const inp = $(`#view-globals [data-g="${CSS.escape(n)}"]`); if (!inp || document.activeElement === inp) continue;
    const e = S.config.elements.find(e => e.name === n) || {};
    if (inp.tagName === 'INPUT') inp.value = fmtVal(e, S.values[n].value); else inp.textContent = S.values[n].value ? 'ON' : 'OFF';
  }
}
async function editLog(e) {
  const work = clone(e.log || { mode: 'none' });
  const r = await dialog(`Database trigger: ${e.name}`, [
    ['mode', 'Write to the database', 'sel', S.logModes.map(m => [m, LOG_LABEL[m] || m])],
    ['script', 'Process (for "On demand only")', 'sel', [['', '(pick a process)'], ...S.scripts.map(x => [x.name, x.name])]],
    ['every', 'N (whole number, for "Every N …")', 'num'],
    ['interval', 'Interval 00:00:00 (for "Every 00:00:00")', 'text'],
    ['at', 'At clock time (optional, for the "Every" choices), e.g. 12 AM, 6:30 PM or 18:30', 'text'],
    ['_n', '"Every 1 days at 12 AM" writes at midnight every day. "Every 6 hours at 1 AM" writes at 1 AM, 7 AM, 1 PM and 7 PM. Without a clock time it counts from when the server starts. Fastest is 100 ms.', 'note'],
  ], work, false, DB_TRIGGER);
  if (r !== 'ok') return;
  try { readFields(work); } catch (x) { return toast(x.message, true); }
  if (work.mode === 'script' && !work.script) return toast('Pick the process that writes this value', true);
  if (work.mode === 'hms' && !/^\d+:\d{1,2}(:\d{1,2})?$/.test(work.interval || '')) return toast('Interval must look like 00:05:00', true);
  if (TIME_MODES.includes(work.mode) && work.every !== undefined && !(Number.isInteger(work.every) && work.every >= 1)) return toast('N must be a whole number, 1 or more', true);
  if (work.at && !validClock(work.at)) return toast('Clock time not understood. Use e.g. 12 AM, 6:30 PM or 18:30', true);
  for (const k of ['script', 'every', 'interval', 'at']) {
    const keep = { script: work.mode === 'script', every: TIME_MODES.includes(work.mode) && work.mode !== 'hms', interval: work.mode === 'hms', at: TIME_MODES.includes(work.mode) }[k];
    if (!keep) delete work[k];
  }
  saveLog(e.name, work);
}
// same rules as the server's parseClock
function validClock(t) {
  const m = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*([ap])?\.?\s*m?\.?$/i.exec(String(t).trim()); if (!m) return false;
  const hh = +m[1]; if (m[4]) return hh >= 1 && hh <= 12 && +(m[2] ?? 0) < 60 && +(m[3] ?? 0) < 60;
  return m[2] !== undefined && hh < 24 && +m[2] < 60 && +(m[3] ?? 0) < 60;
}
const saveLog = guard(async (name, log) => {
  const els = clone(S.config.elements); els.find(e => e.name === name).log = log;
  await api('PUT', '/ui/layout', { elements: els });
  S.config.elements = els; renderGlobals(); toast('Saved');
});

// ---------------------------------------------------------------- log
async function loadLogNames() {
  const names = await api('GET', '/ui/log/names'); const sel = $('#logName'); const cur = sel.value;
  sel.innerHTML = ''; sel.append(h('option', { value: '' }, '(all)'), ...names.map(n => h('option', { value: n.name, ...(n.name === cur ? { selected: true } : {}) }, `${n.name} (${n.count})`)));
}
function logQuery() {
  const q = new URLSearchParams(); const n = $('#logName').value;
  if (n) q.set('name', n);
  if ($('#logFrom').value) q.set('from', new Date($('#logFrom').value).getTime());
  if ($('#logTo').value) q.set('to', new Date($('#logTo').value).getTime());
  q.set('limit', $('#logLimit').value || 500); return q;
}
$('#logLoad').onclick = guard(async () => {
  const rows = await api('GET', '/api/log?' + logQuery());
  const tb = $('#logBody'); tb.innerHTML = '';
  for (const r of rows) tb.append(h('tr', {}, h('td', {}, new Date(r.ts).toLocaleString()), h('td', {}, r.name), h('td', {}, r.value), h('td', {}, r.reason)));
  $('#logCsv').href = '/api/log.csv?' + logQuery();
});

// ---------------------------------------------------------------- devices
function renderDevices() {
  const tb = $('#devBody'); tb.innerHTML = '';
  for (const d of S.devices) {
    const TYPES = { serial: 'USB', ethernet: 'Ethernet', esp32: 'ESP32 (WiFi)', simulator: 'Simulator' };
    const real = d.type === 'simulator' && d.realType && !d.simMode ? h('button', { title: `Use the real ${TYPES[d.realType]} at ${d.port || d.host}`, onclick: guard(async () => {
      if (!confirm(`Switch ${d.name} from the simulator to the real ${TYPES[d.realType]} (${d.port || d.host})?`)) return;
      await api('PUT', '/ui/layout', { devices: S.config.devices.map(x => x.name === d.name ? (({ realType, ...rest }) => ({ ...rest, type: realType }))(x) : x) }); await load();
    }) }, 'Use real hardware') : '';
    tb.append(h('tr', {}, h('td', {}, d.name), h('td', {}, (TYPES[d.type] || d.type) + (d.simMode ? ` (simulation mode, real: ${TYPES[d.realType]})` : d.type === 'simulator' && d.realType ? ` (for ${TYPES[d.realType]})` : '')), h('td', {}, d.host ? `${d.host}:${d.port ?? 4100}` : d.port || ''),
      h('td', { style: `color:${d.status === 'connected' ? 'var(--ok)' : 'var(--bad)'}` }, d.status), h('td', {}, d.info || ''),
      h('td', {}, real, ' ', h('button', { class: 'danger admin-only', onclick: guard(async () => { if (!confirm(`Remove device ${d.name}?`)) return; await api('PUT', '/ui/layout', { devices: S.config.devices.filter(x => x.name !== d.name) }); await load(); }) }, 'Remove'))));
  }
  renderProbes();
}

// ---- OneWire probe index: numbered slots; elements use the number, the slot holds the probe's ROM id
const seenRoms = () => { const m = new Map(); for (const d of S.devices) for (const [rom, t] of Object.entries(d.probes || {})) m.set(rom, { dev: d.name, t }); return m; };
function renderProbes() {
  const slots = S.config.probes || [], seen = seenRoms();
  const usedBy = i => S.config.elements.filter(e => e.type === 'temperature' && Number(e.probeIndex) === i).map(e => e.name).join(', ');
  const sb = $('#slotBody'); sb.innerHTML = '';
  for (const p of slots) {
    const roms = [...new Set([p.rom, ...seen.keys()].filter(Boolean))];
    sb.append(h('tr', {}, h('td', {}, String(p.index)),
      h('td', {}, h('input', { disabled: !can('admin'), value: p.name || '', placeholder: 'e.g. HLT probe', onchange: ev => saveProbes(l => { l.find(x => x.index === p.index).name = ev.target.value; }) })),
      h('td', {}, h('select', { disabled: !can('admin'), onchange: ev => setSlotRom(p.index, ev.target.value) }, h('option', { value: '' }, '(no probe)'),
        ...roms.map(r => h('option', { value: r, ...(r === p.rom ? { selected: true } : {}) }, r + (seen.has(r) ? '' : '  (not seen now)') + (slots.some(x => x.rom === r && x.index !== p.index) ? `  (in #${slots.find(x => x.rom === r).index})` : ''))))),
      h('td', {}, seen.has(p.rom) ? String(seen.get(p.rom).t) : p.rom ? 'not seen' : ''),
      h('td', {}, usedBy(p.index)),
      h('td', {}, h('button', { class: 'danger admin-only', onclick: () => { if (usedBy(p.index) && !confirm(`Probe #${p.index} is used by ${usedBy(p.index)}. Remove it anyway?`)) return; saveProbes(l => l.splice(l.findIndex(x => x.index === p.index), 1)); } }, 'Remove'))));
  }
  const pb = $('#probeBody'); pb.innerHTML = '';
  for (const [rom, { dev, t }] of seen) {
    const slot = slots.find(x => x.rom === rom);
    pb.append(h('tr', {}, h('td', {}, dev), h('td', {}, h('code', {}, rom)), h('td', {}, String(t)),
      h('td', {}, h('select', { disabled: !can('admin'), onchange: ev => ev.target.value === 'new' ? newSlot(rom) : setSlotRom(+ev.target.value, rom, !ev.target.value) },
        h('option', { value: '' }, '(no number)'), h('option', { value: 'new' }, '+ new number'),
        ...slots.map(x => h('option', { value: x.index, ...(slot === x ? { selected: true } : {}) }, `#${x.index} ${x.name || ''}`))))));
  }
}
const saveProbes = guard(async change => {
  const list = clone(S.config.probes || []); change(list);
  await api('PUT', '/ui/layout', { probes: list }); S.config.probes = list; renderProbes(); toast('Probe index saved');
});
// put a ROM id on a slot (taking it off any other slot); clear = take this ROM off every slot
const setSlotRom = (index, rom, clear) => saveProbes(l => { for (const x of l) if (x.rom === rom) x.rom = ''; if (!clear) { const s = l.find(x => x.index === index); if (s) s.rom = rom; } });
const newSlot = rom => saveProbes(l => { for (const x of l) if (x.rom === rom) x.rom = ''; l.push({ index: Math.max(0, ...l.map(x => x.index)) + 1, name: '', rom: rom || '' }); });
$('#addSlot').onclick = () => newSlot('');
$('#scanPorts').onclick = guard(async () => {
  const r = await api('GET', '/ui/ports');
  if (!r.installed) throw new Error('USB support is not installed on the server. Run:  npm install serialport');
  $('#portList').innerHTML = ''; $('#portList').append(...r.ports.map(p => h('option', { value: p.path }, `${p.path} ${p.manufacturer}`)));
  toast(r.ports.length ? `${r.ports.length} port(s): ${r.ports.map(p => p.path).join(', ')}` : 'No USB serial ports found');
});
$('#addDev').onclick = guard(async () => {
  const name = $('#devName').value.trim(), type = $('#devType').value;
  if (!name) throw new Error('Device name is required');
  if (S.config.devices.some(d => d.name === name)) throw new Error('That device name is used');
  const d = { name, type };
  if (type === 'serial') { d.port = $('#devPort').value.trim(); d.baud = 115200; if (!d.port) throw new Error('USB port is required'); }
  if (type === 'esp32' || type === 'ethernet') { d.host = $('#devHost').value.trim(); d.port = 4100; if (!d.host) throw new Error('Network address is required'); }
  await api('PUT', '/ui/layout', { devices: [...S.config.devices, d] }); await load(); toast('Device added');
});

// ---------------------------------------------------------------- import
$('#importBtn').onclick = guard(async () => {
  const f = $('#xmlFile').files[0]; if (!f) throw new Error('Choose a BeerXML file first');
  const r = await api('POST', '/ui/import/beerxml', await f.text(), true);
  $('#importResult').textContent = `Recipe: ${r.recipe}\nHops in recipe: ${r.hops}\nVariables set: ${r.set}` +
    (r.missing.length ? `\n\nThese variables do not exist (create them or change the mapping in Settings):\n  ${r.missing.join('\n  ')}` : '') +
    (r.warnings.length ? `\n\n${r.warnings.join('\n')}` : '');
});

// BruControl Schema (.brucfg configuration file)
function bruReport(r) {
  const t = r.summary.byType;
  const lines = [`${r.preview ? 'In this file' : 'Imported'}: ${r.summary.devices} devices, ${r.summary.workspaces} workspaces, ${r.summary.elements} elements, ${r.summary.scripts} processes`,
    '  ' + Object.entries(t).map(([k, n]) => `${k} ${n}`).join(', ')];
  if (r.autostart.length) lines.push(`Processes started with the server: ${r.autostart.join(', ')}`);
  lines.push(r.missingMedia.length ? `\n${r.missingMedia.length} of ${r.mediaCount} pictures and sounds are not in your media folder yet. Copy them from C:\\BruControl\\Media:\n  ${r.missingMedia.join('\n  ')}` : `All ${r.mediaCount} pictures and sounds were found.`);
  if (r.warnings.length) lines.push('\nNotes:\n  ' + r.warnings.join('\n  '));
  if (r.scripts) {
    lines.push(`\nProcesses written: ${r.scripts.written.length}` + (r.scripts.backedUp.length ? `, ${r.scripts.backedUp.length} older copies kept as .bak` : '') + (r.scripts.skipped.length ? `\nProcesses not replaced: ${r.scripts.skipped.join(', ')}` : ''));
    lines.push(r.problems.length ? `${r.problems.length} processes have problems (they will not start until fixed):\n` + r.problems.map(p => `  ${p.script}: ` + p.errors.map(e => `line ${e.line}: ${e.msg}`).join('; ') + (p.more ? ` (+${p.more} more)` : '')).join('\n') : 'Every process checks OK.');
  }
  return lines.join('\n');
}
async function bruSend(preview) {
  const f = $('#bruFile').files[0]; if (!f) throw new Error('Choose a BruControl .brucfg file first');
  const q = new URLSearchParams({ mode: $('#bruMode').value, simulate: $('#bruSim').checked ? '1' : '0', overwrite: $('#bruOverwrite').checked ? '1' : '0', media: $('#bruMedia').value.trim(), preview: preview ? '1' : '0' });
  $('#bruResult').textContent = preview ? 'Reading…' : 'Importing…';
  try { return await api('POST', '/ui/import/brucontrol?' + q, await f.text(), true); } catch (e) { $('#bruResult').textContent = ''; throw e; }
}
$('#bruPreview').onclick = guard(async () => { $('#bruResult').textContent = bruReport(await bruSend(true)); });
$('#bruImport').onclick = guard(async () => {
  const msg = $('#bruMode').value === 'replace' ? 'Replace your tabs, elements and devices with the ones in this BruControl file? Running processes are stopped. (config/brewery.json.bak keeps the old Schema.)' : 'Add this BruControl file to your Schema? Running processes are stopped.';
  if (!confirm(msg)) return;
  const r = await bruSend(false);
  $('#bruResult').textContent = bruReport(r);
  await load(); toast('BruControl Schema imported');
});

// ---------------------------------------------------------------- settings
// ---- sample Schemas: on first start, and under Settings
let samples = null;
async function sampleCards(box, after) {
  samples ??= await api('GET', '/ui/samples');
  box.innerHTML = '';
  for (const sm of samples) box.append(h('div', { class: 'sampleCard' + (S.config.sample === sm.id ? ' cur' : '') },
    h('div', { class: 'sampleName' }, sm.name), h('div', { class: 'muted' }, sm.description || ''),
    sm.needs ? h('div', { class: 'sampleNeeds' }, sm.needs) : '',
    h('button', { class: 'primary', onclick: guard(async () => {
      if (!confirm(`Load the sample "${sm.name}"?\n\nIt replaces your tabs, elements, pipes and devices and stops running processes. Your current Schema is saved in config/backups first.`)) return;
      const r = await api('POST', `/ui/samples/${sm.id}/load`);
      after?.(); wsName = null; await load(); setView('workspace');
      const bad = (r.problems || []).length;
      toast(`Loaded "${r.sample}"` + (bad ? `. ${bad} process(es) need a look on the Processes page` : ''), bad > 0);
    }) }, S.config.sample === sm.id ? 'Load again' : 'Load this one')));
}
async function firstRunSamples() {
  if (!S.config.chooseSample || !can('admin')) return;
  const d = $('#sampleDlg');
  await sampleCards($('#sampleDlgList'), () => d.close());
  $('#sampleKeep').onclick = guard(async () => { d.close(); await api('PUT', '/ui/settings', { chooseSample: false }); S.config.chooseSample = false; });
  d.showModal();
}

function renderSettings() {
  const c = S.config;
  sampleCards($('#sampleList')).catch(e => toast(e.message, true));
  $('#setTitle').value = c.title || '';
  $('#setWarnPaths').checked = c.warnOffBrainPaths !== false;
  $('#setMedia').value = (c.mediaRoots || []).join('\n');
  $('#setKey').value = c.apiKey || '';
  $('#setBeer').value = JSON.stringify(c.beerxml || {}, null, 2);
  const box = $('#setAuto'); box.innerHTML = '';
  for (const s of S.scripts) box.append(h('label', {}, h('input', { type: 'checkbox', value: s.name, ...((c.autostart || []).includes(s.name) ? { checked: true } : {}) }), s.name));
  $('#setRestartLimit').value = c.restartLimit || 5;
  const alarms = (c.elements || []).filter(e => e.type === 'alarm');
  $('#setRestartAlarm').replaceChildren(h('option', { value: '' }, 'None'), ...alarms.map(e => h('option', { value: e.name }, e.name)));
  $('#setRestartAlarm').value = alarms.some(e => e.name === c.restartAlarm) ? c.restartAlarm : '';
  renderDonate();
  renderSimSettings();
  renderPasswordRules();
}
// ---- accounts
addEyes();
const signOut = guard(async () => { await api('POST', '/auth/logout'); location.replace('/login.html'); });
$('#pwSave').onclick = guard(async () => {
  if ($('#pwNew').value !== $('#pwNew2').value) throw new Error('The two new passwords are not the same');
  await api('POST', '/auth/password', { current: $('#pwCur').value, password: $('#pwNew').value });
  for (const i of ['#pwCur', '#pwNew', '#pwNew2']) $(i).value = '';
  toast('Password changed. Other phones and computers signed in as you are signed out.');
});
// ---- password rules: shown next to every new-password box; admins change them in Settings > Password rules
function renderPasswordRules() {
  const r = S.passwordRules;
  for (const p of $$('.pwRulesText')) p.textContent = r.text;
  for (const i of ['#pwNew', '#pwNew2', '#nuPass']) $(i).maxLength = r.max;
  if (!can('admin')) return;
  $('#prAllowed').replaceChildren(...Object.entries(r.choices).map(([k, t]) => h('option', { value: k }, t)));
  $('#prAllowed').value = r.allowed;
  $('#prCustom').value = r.custom;
  $('#prCustomRow').classList.toggle('hidden', r.allowed !== 'custom');
  $('#prMin').value = r.min; $('#prMax').value = r.max;
  for (const i of ['#prMin', '#prMax']) { $(i).min = r.limits.min; $(i).max = r.limits.max; }
}
$('#prAllowed').onchange = () => $('#prCustomRow').classList.toggle('hidden', $('#prAllowed').value !== 'custom');
$('#prSave').onclick = guard(async () => {
  const min = Number($('#prMin').value), max = Number($('#prMax').value), { limits } = S.passwordRules;
  if (!(min >= limits.min && min <= limits.max)) throw new Error(`Min length must be ${limits.min} to ${limits.max}`);
  if (!(max >= min && max <= limits.max)) throw new Error(`Max length must be from the min length (${min}) up to ${limits.max}`);
  await api('PUT', '/ui/settings', { passwordRules: { allowed: $('#prAllowed').value, custom: $('#prCustom').value, min, max } });
  await load(); toast('Password rules saved');
});
async function renderUsers() {
  if (!can('admin')) return;
  const users = await api('GET', '/auth/users');
  const tb = $('#userBody'); tb.innerHTML = '';
  for (const u of users) {
    const role = h('select', { onchange: guard(async ev => { try { await api('PUT', '/auth/users/' + encodeURIComponent(u.name), { role: ev.target.value }); toast(`${u.name} is now ${ev.target.value}`); } finally { if (u.name === S.me.name) location.reload(); else renderUsers(); } }) },
      ...S.roles.map(r => h('option', { value: r, ...(r === u.role ? { selected: true } : {}) }, r[0].toUpperCase() + r.slice(1))));
    tb.append(h('tr', {}, h('td', {}, u.name + (u.name === S.me.name ? ' (you)' : '')), h('td', {}, role), h('td', {},
      h('button', { onclick: guard(async () => { const pw = prompt(`New password for ${u.name}\n${S.passwordRules.text}`); if (!pw) return; await api('PUT', '/auth/users/' + encodeURIComponent(u.name), { password: pw }); toast('Password set'); }) }, 'Set password'), ' ',
      h('button', { class: 'danger', onclick: guard(async () => { if (!confirm(`Remove user ${u.name}?`)) return; await api('DELETE', '/auth/users/' + encodeURIComponent(u.name)); renderUsers(); }) }, 'Remove'))));
  }
}
async function renderRecovery() {
  if (!can('admin')) return;
  $('#setFresh').checked = S.config.resetLoginsOnUpdate !== false;
  const r = await api('GET', '/auth/recovery');
  $('#recInfo').textContent = r.exists ? `Made ${new Date(r.created).toLocaleString()}.` : 'There is no recovery code yet.';
  $('#recNew').textContent = r.exists ? 'Make a new recovery code' : 'Make a recovery code';
}
// ---- sign-in codes: where they go (each user) and how they are sent (admin)
async function renderContact(who) {
  who = who || $('#ctUser').value || S.me.name;
  if (can('admin')) {
    const users = await api('GET', '/auth/users');
    $('#ctUser').innerHTML = ''; for (const u of users) $('#ctUser').append(h('option', { value: u.name, ...(u.name === who ? { selected: true } : {}) }, u.name));
  }
  const c = await api('GET', '/auth/contact?user=' + encodeURIComponent(who));
  $('#ctEmail').value = c.email || ''; $('#ctPhone').value = c.phone || '';
  $('#ctVia').innerHTML = '';
  $('#ctVia').append(h('option', { value: '' }, '(no texts)'), ...Object.entries(c.carriers).map(([k, n]) => h('option', { value: k }, n)), h('option', { value: 'twilio' }, 'Twilio'));
  $('#ctVia').value = c.textVia;
  $('#ctNote').textContent = !c.email && !c.twilio ? 'Codes cannot be sent yet: an admin has to fill in "Sending codes" in Settings first.' : '';
}
$('#ctUser').onchange = guard(() => renderContact($('#ctUser').value));
$('#ctSave').onclick = guard(async () => {
  const who = can('admin') ? $('#ctUser').value : S.me.name;
  await api('PUT', '/auth/contact?user=' + encodeURIComponent(who), { email: $('#ctEmail').value, phone: $('#ctPhone').value, textVia: $('#ctVia').value });
  toast('Saved');
});
async function renderMessaging() {
  if (!can('admin')) return;
  const c = await api('GET', '/auth/messaging');
  $('#msHost').value = c.smtpHost || ''; $('#msPort').value = c.smtpPort || ''; $('#msSec').value = c.smtpSecurity || 'ssl';
  $('#msUser').value = c.smtpUser || ''; $('#msPass').value = c.smtpPass || ''; $('#msFrom').value = c.smtpFrom || '';
  $('#msSid').value = c.twilioSid || ''; $('#msToken').value = c.twilioToken || ''; $('#msTwFrom').value = c.twilioFrom || '';
}
const preset = (host, port, sec) => () => { $('#msHost').value = host; $('#msPort').value = port; $('#msSec').value = sec; if (!$('#msFrom').value) $('#msFrom').value = $('#msUser').value; };
$('#msGmail').onclick = preset('smtp.gmail.com', 465, 'ssl');
$('#msOutlook').onclick = preset('smtp-mail.outlook.com', 587, 'starttls');
$('#msUser').onchange = () => { if (!$('#msFrom').value) $('#msFrom').value = $('#msUser').value; };
const saveMessaging = () => api('PUT', '/auth/messaging', {
  smtpHost: $('#msHost').value, smtpPort: +$('#msPort').value || '', smtpSecurity: $('#msSec').value, smtpUser: $('#msUser').value, smtpPass: $('#msPass').value,
  smtpFrom: $('#msFrom').value, twilioSid: $('#msSid').value, twilioToken: $('#msToken').value, twilioFrom: $('#msTwFrom').value,
});
$('#msSave').onclick = guard(async () => { await saveMessaging(); await renderMessaging(); renderContact(); toast('Sending settings saved'); });
$('#msTest').onclick = guard(async () => {
  await saveMessaging();
  $('#msResult').textContent = 'Sending...';
  try { const r = await api('POST', '/auth/messaging/test'); $('#msResult').textContent = 'Sent: ' + r.sent.join(', '); }
  catch (e) { $('#msResult').textContent = e.message.includes('No email or text') ? 'Put your own email or mobile number under "Sign-in codes" in My account first.' : e.message; throw e; }
});

$('#setWarnPaths').onchange = guard(async ev => {
  await api('PUT', '/ui/settings', { warnOffBrainPaths: ev.target.checked });
  S.config.warnOffBrainPaths = ev.target.checked;
  toast(ev.target.checked ? 'You will be warned about files that are not on the Brain' : 'Path warnings are off');
});
$('#setFresh').onchange = guard(async ev => {
  await api('PUT', '/ui/settings', { resetLoginsOnUpdate: ev.target.checked });
  S.config.resetLoginsOnUpdate = ev.target.checked;
  toast(ev.target.checked ? 'Logins will start fresh after each update' : 'Logins are kept after updates');
});
$('#recNew').onclick = guard(async () => {
  if ($('#recInfo').textContent.startsWith('Made') && !confirm('Make a new recovery code? The old one stops working.')) return;
  const r = await api('POST', '/auth/recovery');
  $('#recCode').textContent = r.code; $('#recShow').classList.remove('hidden');
  renderRecovery();
});
$('#nuAdd').onclick = guard(async () => {
  await api('POST', '/auth/users', { name: $('#nuName').value.trim(), password: $('#nuPass').value, role: $('#nuRole').value });
  $('#nuName').value = ''; $('#nuPass').value = ''; toast('User added'); renderUsers();
});

$('#saveSettings').onclick = guard(async () => {
  let beer; try { beer = JSON.parse($('#setBeer').value || '{}'); } catch { throw new Error('BeerXML mapping is not valid JSON'); }
  await api('PUT', '/ui/settings', {
    title: $('#setTitle').value, mediaRoots: $('#setMedia').value.split('\n').map(s => s.trim()).filter(Boolean),
    apiKey: $('#setKey').value.trim(), beerxml: beer, autostart: $$('#setAuto input:checked').map(i => i.value),
    restartLimit: Math.min(60, Math.max(1, Math.round(Number($('#setRestartLimit').value)) || 5)), restartAlarm: $('#setRestartAlarm').value,
  });
  await load(); toast('Settings saved');
});

// ---------------------------------------------------------------- beer money pop-up
// Each browser remembers when to ask next (localStorage). A first visit waits one full interval,
// so new users are not asked straight away. Admins can preview it under Settings.
const DONATE_KEY = 'brewpanel.donateNext', DAY = 86400000;
const DONATE_MSG = 'Enjoying the Brew Panel? It is free and built in spare time between brew days. If it has made brewing a bit easier for you, a few dollars of beer money for Fritz is always appreciated. Cheers!';
const donation = () => ({ enabled: true, message: '', button: '', everyDays: 30, donatedDays: 180, ...(S.config.donation || {}), link: S.donateLink });   // the link is fixed on the server (lib/donation.js)
const donateGet = () => { try { return Number(localStorage.getItem(DONATE_KEY)) || 0; } catch { return -1; } };
const donateSnooze = days => { try { localStorage.setItem(DONATE_KEY, String(Date.now() + days * DAY)); } catch { } };
// a brew is under way if any Process is running other than the ones that start with the server (loggers and the like)
const brewing = () => (S.scripts || []).some(s => s.state === 'running' && !(S.config.autostart || []).includes(s.name));
function showDonate(preview) {
  const d = donation(), dlg = $('#donateDlg');
  $('#donateText').textContent = d.message.trim() || DONATE_MSG;
  $('#donateGo').textContent = d.button.trim() || 'Buy Fritz a beer';
  const close = days => { if (!preview) donateSnooze(days); dlg.close(); };
  $('#donateGo').onclick = () => { window.open(d.link, '_blank', 'noopener'); close(d.everyDays); };
  $('#donateLater').onclick = () => close(d.everyDays);
  $('#donateDone').onclick = () => { close(d.donatedDays); toast('Thank you, cheers! 🍺'); };
  dlg.oncancel = e => { e.preventDefault(); close(d.everyDays); };   // Esc counts as "Maybe later"
  dlg.showModal();
}
function maybeDonate() {
  const d = donation(), next = donateGet();
  if (!d.enabled || next < 0) return;                                    // turned off, or this browser cannot remember
  if (!next) return donateSnooze(d.everyDays);                           // first visit: start the clock
  if (Date.now() < next) return;
  if (brewing() || editing || document.hidden || $('dialog[open]')) return;   // try again at the next check
  showDonate(false);
}
setTimeout(() => { if (S) { maybeDonate(); setInterval(maybeDonate, 5 * 60000); } }, 30000);

function renderDonate() {
  const d = donation();
  $('#donOn').checked = d.enabled; $('#donMsg').value = d.message;
  $('#donBtn').value = d.button; $('#donEvery').value = d.everyDays; $('#donDone').value = d.donatedDays;
  $('#donMsg').placeholder = DONATE_MSG;
}
$('#donSave').onclick = guard(async () => {
  await api('PUT', '/ui/settings', { donation: { enabled: $('#donOn').checked, message: $('#donMsg').value,
    button: $('#donBtn').value, everyDays: $('#donEvery').value, donatedDays: $('#donDone').value } });
  await load(); toast('Pop-up settings saved');
});
$('#donPreview').onclick = () => showDonate(true);

// ---------------------------------------------------------------- MQTT and voice
const TYPE_WORD = { vAPI: 'vAPI', global: 'Global', digitalOut: 'Output', switch: 'Switch', digitalIn: 'Input', temperature: 'Temperature', analogIn: 'Analog input', timer: 'Timer', alarm: 'Alarm', soundPlayer: 'Sound player' };
function renderMqttStatus() {
  const st = S.mqtt?.status ?? { state: 'off', text: 'MQTT is off' };
  const box = $('#mqttStatus'); box.className = 'mqtt-status ' + st.state; box.textContent = st.text;
}
function renderMqtt() {
  const c = S.config.mqtt || {};
  $('#mqEnabled').checked = !!c.enabled; $('#mqTls').checked = !!c.tls;
  $('#mqHost').value = c.host || ''; $('#mqPort').value = c.port || ''; $('#mqUser').value = c.username || '';
  $('#mqPass').value = ''; $('#mqPass').placeholder = c.hasPassword ? 'saved (type to change)' : '';
  $('#mqBase').value = c.baseTopic || 'brewpanel';
  $('#mqHa').checked = c.homeAssistant?.enabled !== false;
  const body = $('#mqItems'); body.innerHTML = '';
  for (const it of S.mqtt?.items || []) {
    const box = (k, dis) => h('input', { type: 'checkbox', 'data-name': it.name, 'data-k': k, ...(it[k] ? { checked: true } : {}), ...(dis ? { disabled: true, title: 'Inputs from hardware are read only' } : {}) });
    body.append(h('tr', {}, h('td', {}, it.displayName ? `${it.displayName} (${it.name})` : it.name), h('td', {}, TYPE_WORD[it.type] || it.type), h('td', {}, box('voice')), h('td', {}, box('control', it.fixed))));
  }
  const sb = $('#mqScripts'); sb.innerHTML = '';
  for (const s of S.scripts) sb.append(h('label', {}, h('input', { type: 'checkbox', value: s.name, ...((c.scripts || []).includes(s.name) ? { checked: true } : {}) }), s.name));
  renderMqttStatus();
}
$('#saveMqtt').onclick = guard(async () => {
  const items = {};
  for (const i of $$('#mqItems input')) (items[i.dataset.name] ??= {})[i.dataset.k] = i.checked;
  const body = {
    enabled: $('#mqEnabled').checked, tls: $('#mqTls').checked, host: $('#mqHost').value.trim(), port: +$('#mqPort').value || 0,
    username: $('#mqUser').value.trim(), baseTopic: $('#mqBase').value.trim(), homeAssistant: { enabled: $('#mqHa').checked },
    scripts: $$('#mqScripts input:checked').map(i => i.value), items,
  };
  if ($('#mqPass').value) body.password = $('#mqPass').value;
  if (body.enabled && !body.host) throw new Error('Enter the broker address (localhost when Mosquitto runs on this Pi)');
  await api('PUT', '/ui/mqtt', body);
  await load(); toast('MQTT and voice saved');
});

// ---------------------------------------------------------------- simulation mode
// The striped bar under the menu (everyone sees it; admins get the speed and skip buttons),
// and Settings > Simulation (switch, speed, Time jumps table, Process timeline).
const fmtT = s => { s = Math.max(0, Math.round(s)); const p = n => String(n).padStart(2, '0'); return `${p(Math.floor(s / 3600))}:${p(Math.floor(s % 3600 / 60))}:${p(s % 60)}`; };
const speedOpts = sel => { const cur = S.sim?.speed ?? 1; sel.innerHTML = ''; for (const x of S.simSpeeds || [1]) sel.append(h('option', { value: x, ...(x === cur ? { selected: true } : {}) }, x === 1 ? 'Normal (1×)' : x + '× faster')); if (!(S.simSpeeds || []).includes(cur)) sel.append(h('option', { value: cur, selected: true }, cur + '× faster')); };
let simPoll = null;
function renderSimBar() {
  const on = !!S.sim?.on, bar = $('#simBar'), was = !bar.classList.contains('hidden');
  bar.classList.toggle('hidden', !on);
  if (on !== was && view === 'workspace') fitZoom();
  if (!on) { clearInterval(simPoll); simPoll = null; $('#simNextInfo').textContent = ''; return; }
  $('#simInfo').textContent = `Clock ${S.sim.speed === 1 ? 'at normal speed' : S.sim.speed + '× faster'}` + (S.sim.skipped ? `, ${fmtT(S.sim.skipped / 1000)} skipped` : '');
  if (document.activeElement !== $('#simSpeed')) speedOpts($('#simSpeed'));
  $('#simAutoBar').checked = !!S.sim.autoSkip;
  if (!simPoll) { simPoll = setInterval(simNextInfo, 2000); simNextInfo(); }
}
async function simNextInfo() {
  try {
    const r = await api('GET', '/ui/sim');
    const n = r.upcoming?.[0];
    $('#simNextInfo').textContent = n ? `Next: ${n.what} in ${fmtT(n.in)}` : 'Nothing counting down';
  } catch { /* offline: the connection dot shows it */ }
}
$('#simAutoBar').onchange = guard(async ev => { S.sim = await api('PUT', '/ui/sim', { autoSkip: ev.target.checked }); renderSimBar(); if ($('#simAuto')) $('#simAuto').checked = ev.target.checked; toast(ev.target.checked ? 'Auto skip on: each step runs a few seconds, then time skips to just before the next one' : 'Auto skip off'); });
$('#simSpeed').onchange = guard(async ev => { S.sim = await api('PUT', '/ui/sim', { speed: +ev.target.value }); renderSimBar(); if ($('#simSpeedSet')) $('#simSpeedSet').value = ev.target.value; });
for (const b of $$('#simBar [data-skip]')) b.onclick = guard(async () => { await api('POST', '/ui/sim/skip', { seconds: +b.dataset.skip }); toast(`Skipped ahead ${fmtT(+b.dataset.skip)}`); simNextInfo(); });
$('#simNext').onclick = guard(async () => { const r = await api('POST', '/ui/sim/skip', { next: true }); toast(`Skipped ${fmtT(r.skipped / 1000)}, to just before ${r.next}`); simNextInfo(); });

let simDraft = null, simDirty = false, tlRows = null;
const simCfg = () => ({ on: false, speed: 1, lead: 5, autoSkip: false, watch: 5, jumps: [], ...(S.config.simulation || {}) });
function renderSimSettings() {
  if (!can('admin')) return;
  const c = simCfg();
  $('#simOn').checked = !!c.on;
  speedOpts($('#simSpeedSet')); $('#simSpeedSet').value = c.speed;
  if (!simDirty) { simDraft = clone(c.jumps); $('#simLead').value = c.lead; $('#simAuto').checked = !!c.autoSkip; $('#simWatch').value = c.watch; renderSimJumps(); }
  const pick = $('#tlPick'), cur = pick.value; pick.innerHTML = '';
  for (const sc of S.scripts) pick.append(h('option', { value: sc.name, ...(sc.name === cur ? { selected: true } : {}) }, sc.name));
}
function renderSimJumps() {
  const tb = $('#simJumps'); tb.innerHTML = '';
  const names = when => when === 'timer' ? S.config.elements.filter(e => e.type === 'timer').map(e => e.name).sort() : S.scripts.map(x => x.name);
  const dirty = () => { simDirty = true; };
  simDraft.forEach((j, i) => {
    const nameSel = h('select', { onchange: ev => { j.name = ev.target.value; dirty(); } }, ...[...new Set([...names(j.when), j.name].filter(Boolean))].map(n => h('option', { value: n, ...(n === j.name ? { selected: true } : {}) }, n)));
    if (!j.name) j.name = nameSel.value;
    tb.append(h('tr', {},
      h('td', {}, h('label', { class: 'sw' }, h('input', { type: 'checkbox', ...(j.on !== false ? { checked: true } : {}), onchange: ev => { j.on = ev.target.checked; dirty(); } }), h('span', { class: 'swk' }))),
      h('td', {}, h('select', { onchange: ev => { j.when = ev.target.value; j.name = ''; dirty(); renderSimJumps(); } }, ...Object.entries(S.jumpWhen || {}).map(([k, t]) => h('option', { value: k, ...(k === j.when ? { selected: true } : {}) }, t)))),
      h('td', {}, nameSel),
      h('td', {}, h('input', { class: 'num', type: 'number', min: 0, max: 3600, value: j.after ?? 5, onchange: ev => { j.after = +ev.target.value; dirty(); } })),
      h('td', {}, h('input', { class: 'tm', value: j.jump || '00:00:00', placeholder: '00:50:00', onchange: ev => { j.jump = ev.target.value.trim(); dirty(); } })),
      h('td', {}, h('input', { value: j.note || '', onchange: ev => { j.note = ev.target.value; dirty(); } })),
      h('td', {}, h('button', { class: 'danger', onclick: () => { simDraft.splice(i, 1); dirty(); renderSimJumps(); } }, 'Delete'))));
  });
  if (!simDraft.length) tb.append(h('tr', {}, h('td', { colspan: 7, class: 'muted' }, 'No time jumps yet.')));
}
for (const id of ['#simAuto', '#simWatch', '#simLead']) $(id).addEventListener('change', () => { simDirty = true; });
$('#simAddJump').onclick = () => { simDraft.push({ on: true, when: 'timer', name: '', after: 5, jump: '00:50:00', note: '' }); simDirty = true; renderSimJumps(); };
$('#simSave').onclick = guard(async () => {
  for (const j of simDraft) if (!/^\d+:\d{1,2}(:\d{1,2})?$/.test(j.jump || '')) throw new Error(`"${j.jump}" is not a time. Write it as hh:mm:ss, for example 00:50:00`);
  S.sim = await api('PUT', '/ui/sim', { speed: +$('#simSpeedSet').value, lead: +$('#simLead').value, autoSkip: $('#simAuto').checked, watch: +$('#simWatch').value, jumps: simDraft });
  simDirty = false; await load(); toast('Simulation settings saved');
});
$('#simOn').onchange = guard(async ev => {
  const on = ev.target.checked;
  if (!confirm(on ? 'Turn on simulation mode?\n\nEvery process stops and every output turns off. Then the real boards are let go and the simulator takes their place, so nothing real is switched until you turn it off again.'
    : 'Turn off simulation mode?\n\nEvery process stops and every output turns off, then the real boards are used again.')) { ev.target.checked = !on; return; }
  S.sim = await api('PUT', '/ui/sim', { on });
  await load(); toast(on ? 'Simulation mode is on: no real hardware is switched' : 'Simulation mode is off: real hardware is used');
});

$('#tlShow').onclick = guard(async () => {
  const name = $('#tlPick').value; if (!name) throw new Error('There are no Processes yet');
  const r = await api('GET', '/ui/sim/timeline/' + encodeURIComponent(name));
  tlRows = { name, rows: r.rows };
  const tb = $('#tlBody'); tb.innerHTML = '';
  for (const x of r.rows) {
    const when = (x.after ? `${fmtT(x.at)} after line ${x.after}` : fmtT(x.at)) + (x.maybe ? ' (if)' : '');
    const what = x.what === 'wait' ? (x.unknown ? 'waits (how long is not known ahead)' : `waits ${fmtT(x.secs)}`) : x.what === 'sleep' ? `sleeps ${fmtT(x.secs)}` : '';
    tb.append(h('tr', { class: x.what === 'wait' || x.what === 'sleep' ? 'wait' : '' }, h('td', { class: x.maybe ? 'maybe' : '' }, when), h('td', {}, String(x.line)), h('td', {}, h('code', {}, x.text), what ? ' ' : '', what ? h('span', { class: 'muted' }, what) : '')));
  }
  $('.tlTable').classList.toggle('hidden', !r.rows.length);
  $('#tlNote').textContent = (r.rows.length ? `About ${fmtT(r.end.at)}${r.end.after ? ` after line ${r.end.after}` : ''} from start to finish. Steps marked (if) only happen when that "if" is true. ` : 'Nothing to show. ') + (r.note || '');
  $('#tlMake').disabled = !r.rows.some(x => !x.after && x.at > 0);
});
// Time jumps that, after the Process starts, skip to a few seconds before each timed step (chained one after the other)
$('#tlMake').onclick = () => {
  if (!tlRows) return;
  const lead = +$('#simLead').value || 5, speed = +$('#simSpeedSet').value || 1;
  const times = [...new Set(tlRows.rows.filter(x => !x.after && x.at > 0 && x.what !== 'sleep' && x.what !== 'wait').map(x => x.at))].sort((a, b) => a - b);
  simDraft = simDraft.filter(j => !(j.when === 'process' && j.name === tlRows.name));
  let real = 5, jumped = 0, made = 0;
  for (const at of times) {
    const jump = Math.round(at - lead - real * speed - jumped);
    if (jump < 10) continue;                         // so close it is not worth a jump
    const step = tlRows.rows.find(x => x.at === at && !x.after);
    simDraft.push({ on: true, when: 'process', name: tlRows.name, after: real, jump: fmtT(jump), note: `to ${fmtT(at - lead)}: line ${step.line}` });
    jumped += jump; made++;
    real += Math.ceil(lead / speed) + 5;             // time to watch that step happen
  }
  simDirty = true; renderSimJumps();
  toast(made ? `${made} time jump${made > 1 ? 's' : ''} added. Check them, then Save simulation settings.` : 'Every step is only seconds apart: no jumps needed');
};

// ---------------------------------------------------------------- Schemas (the dropdown at the top)
// Each Schema is a whole brewery setup in its own file (config/schemas). Picking one loads it; the one you leave is kept as is.
function renderSchemaPick() {
  const s = $('#schemaPick'), sc = S.schemas || { list: [] }, act = sc.active?.id;
  s.innerHTML = '';
  s.append(...sc.list.map(x => h('option', { value: x.id, ...(x.id === act ? { selected: true } : {}) }, x.name)));
  if (can('admin')) s.append(h('optgroup', { label: '──────────' },
    h('option', { value: '__new' }, 'Add new Schema ...'), h('option', { value: '__ren' }, 'Rename this Schema ...'),
    h('option', { value: '__ver' }, 'Save a new version now'),
    h('option', { value: '__bak' }, 'Back up this Schema now'), h('option', { value: '__res' }, 'Restore a backup or version ...'),
    h('option', { value: '__del' }, 'Delete a Schema ...')));
  s.disabled = !can('admin') && sc.list.length < 2;
  s.title = can('admin') ? 'Pick a Schema to load it' : 'Only an admin can load another Schema';
}
$('#schemaPick').onchange = guard(async ev => {
  const v = ev.target.value, act = S.schemas.active, back = () => renderSchemaPick();
  try {
    if (!can('admin')) return toast('Only an admin can load another Schema', true);
    if (editing) return toast('Save or exit Edit layout first', true);
    if (v === '__new') {
      const w = { name: '', start: 'copy' };
      if (await dialog('Add new Schema', [['name', 'Name of the new Schema', 'text'],
        ['start', 'Start from', 'sel', [['copy', `A copy of "${act?.name}"`], ['empty', 'An empty Schema (a Main tab and the Equipment tab)']]],
        ['_n', `The new Schema is loaded at once. "${act?.name}" is kept just as it is and stays in this list.`, 'note']], w) !== 'ok') return;
      readFields(w);
      await api('POST', '/ui/schemas', { name: w.name, empty: w.start === 'empty' });
      wsName = null; await load(); return toast(`Schema "${w.name}" made and loaded`);
    }
    if (v === '__ren') {
      const n = (prompt('New name for this Schema', act?.name) || '').trim(); if (!n || n === act?.name) return;
      await api('PUT', `/ui/schemas/${act.id}`, { name: n }); await load(); return toast('Schema renamed');
    }
    if (v === '__bak') { const r = await api('POST', `/ui/schemas/${act.id}/backup`); return toast(`Backed up: config/schemas/backups/${act.id}/${r.file}`); }
    if (v === '__res') return restoreSchema();
    if (v === '__ver') { const r = await api('POST', `/ui/schemas/${act.id}/version`); await load(); return toast(`New Schema version: ${r.version}`); }
    if (v === '__del') {
      const others = S.schemas.list.filter(x => !x.active);
      if (!others.length) return toast('This is your only Schema. Add another before deleting one.', true);
      const w = { id: others[0].id };
      if (await dialog('Delete a Schema', [['id', 'Schema to delete', 'sel', others.map(x => [x.id, x.name])],
        ['_n', 'The loaded Schema cannot be deleted. A deleted Schema is moved to config/schemas/deleted, so it can be got back.', 'note']], w) !== 'ok') return;
      readFields(w);
      const name = others.find(x => x.id === w.id)?.name;
      if (!confirm(`Delete the Schema "${name}"?`)) return;
      await api('DELETE', `/ui/schemas/${w.id}`); await load(); return toast(`Schema "${name}" deleted`);
    }
    if (v === act?.id) return;
    const to = S.schemas.list.find(x => x.id === v);
    if (!confirm(`Load the Schema "${to.name}"?\n\nRunning Processes stop, and its tabs, devices, elements and Equipment Profile take the place of "${act?.name}".\n\n"${act?.name}" is kept just as it is. Pick it in this list to go back to it.`)) return;
    await api('POST', `/ui/schemas/${v}/load`);
    wsName = null; eqWork = null; vesselWork = null; vesselDirty = eqDirty = false; leaveMenuTab(); await load(); soundOnStart(); setView('workspace'); toast(`Schema "${to.name}" loaded`);
  } finally { back(); }
});
async function restoreSchema() {
  const act = S.schemas.active, list = await api('GET', `/ui/schemas/${act.id}/backups`);
  if (!list.length) return toast('This Schema has no backups or versions yet', true);
  const key = b => (b.version ? 'v:' : 'b:') + b.file;
  const w = { file: key(list[0]) };
  if (await dialog(`Restore a backup or version of "${act.name}"`, [['file', 'Backup or version', 'sel', list.map(b => [key(b), b.version ? `Version ${b.file.slice(0, -5)}` : `${new Date(b.when).toLocaleString()}${b.daily ? '  (daily)' : '  (made by hand)'}`])],
    ['_n', 'The Schema as it is now is backed up first, so you can undo this by restoring that backup. Running Processes stop.', 'note']], w) !== 'ok') return;
  readFields(w);
  await api('POST', `/ui/schemas/${act.id}/restore`, { file: w.file.slice(2), version: w.file.startsWith('v:') });
  wsName = null; eqWork = null; vesselWork = null; vesselDirty = eqDirty = false; await load(); toast('Backup restored');
}

// ---------------------------------------------------------------- ☰ Menu and Menu tabs (Fritz, 2026-10-20)
// The ☰ Menu button sits where the Edit layout checkbox was. Edit layout is its first choice; the rest open Menu tabs, which
// show next to the screen tabs only once picked (each has a ✕ to close it). Each Menu tab has an Order number (Default tab).
let eqWork = null, eqDirty = false;           // the Equipment Profile open on the Equipment Profile tab, and whether it has unsaved changes
let vesselWork = null, vesselDirty = false;   // the piece of equipment open on the Vessel tab
const profWork = { mash: null, boil: null, tab: null, valve: null }, profDirty = { mash: false, boil: false, tab: false, valve: false };   // the profile open on each profile tab
let menuTab = null;                           // the Menu tab showing now (null: the screen tabs)
const menuOpen = [];                          // Menu tabs picked and not closed yet
const EQ_KINDS = ['vessel', 'pchiller', 'ccoil', 'herms', 'trub'];
const profileName = id => S.profiles.find(p => p.id === id)?.name;
const unitOf = (f, units) => units === 'Metric' ? f[3] : f[2];
const MENU = [
  { key: 'zoom', title: 'Zoom', tip: 'How big the tabs show, and Full screen', render: renderZoomTab },
  { key: 'default', title: 'Default', tip: 'What new Recipes start with, and the order of the Menu', render: renderDefaultTab },
  { key: 'equipment', title: 'Equipment Profile', tip: 'The equipment, its losses and its piping', render: renderEquipTab },
  { key: 'vessel', title: 'Vessel', tip: 'One vessel (or chiller, coil, filter): size, heat, probe, ports', render: renderVesselTab },
  { key: 'layout', title: 'Default Layout', tip: 'The vessels and pipes a Schema gets with its Equipment Profile', render: renderLayoutTab },
  { key: 'mash', title: 'Mash Profile', tip: 'Up to 4 mash steps and the sparge', render: renderBrewProfileTab('mash') },
  { key: 'boil', title: 'Boil Profile', tip: 'Total boil time and boil off', render: renderBrewProfileTab('boil') },
  { key: 'tab', title: 'Tab Background Profile', tip: 'A tab\'s background color, and the look new devices and widgets on it start with', render: renderBrewProfileTab('tab') },
  { key: 'valve', title: 'Valve Profile', tip: 'The pictures and orientation a new valve starts with', render: renderBrewProfileTab('valve') },
  { key: 'recipe', title: 'Recipe', coming: 'Coming in the next stage (BeerSmith import, scaling, SRM and IBU)' },
  { key: 'fermentation', title: 'Fermentation', coming: 'Coming in a later stage (gravity, ABV, CO2, dates)' },
  { key: 'filemove', title: 'File Move Utility', tip: 'Copy files and whole folders from this computer to the Brain (opens the File Move page)', view: 'filemove', admin: true },
  { key: 'about', title: 'About', tip: 'Who is signed in, Sign out, and the Schema and its version', render: renderAboutTab },
];
// the Menu tabs in their order: numbered ones first, then the rest as listed above (new Menu tabs land at the end,
// except Zoom, which is number 1 until the order is changed)
function menuSorted() {
  const o = S.config.menuOrder || {}, at = m => Number.isFinite(+o[m.key]) ? +o[m.key] : m.key === 'zoom' ? 0 : 1e6 + MENU.indexOf(m);
  return [...MENU].sort((a, b) => at(a) - at(b) || MENU.indexOf(a) - MENU.indexOf(b));
}
// move one Menu tab to place n; the others are numbered again 1, 2, 3 ... around it
async function setMenuOrder(key, n) {
  const list = menuSorted().map(m => m.key).filter(k => k !== key);
  list.splice(Math.min(Math.max(Math.round(n) || 1, 1), list.length + 1) - 1, 0, key);
  const menuOrder = Object.fromEntries(list.map((k, i) => [k, i + 1]));
  await api('PUT', '/ui/settings', { menuOrder });
  S.config.menuOrder = menuOrder; renderMenu();
}
const paneDirty = () => menuTab === 'equipment' ? eqDirty : menuTab === 'vessel' ? vesselDirty : profDirty[menuTab];

function renderMenu() {
  if (!S?.profiles) return;
  const list = $('#menuList'); list.innerHTML = '';
  if (view === 'workspace' && menuBarHides()) list.append(h('button', { role: 'menuitem', class: 'menuItem', title: 'The top line: Schema, Processes, Variables, Log, Settings, Help, Enable sound, Sign out', onclick: () => { closeMenuList(); showMenuBar(menuBarHidden()); } }, menuBarHidden() ? '▼ Show Menu Bar' : '▲ Hide Menu Bar'));
  if (can('admin')) list.append(h('button', { role: 'menuitem', class: 'menuItem', onclick: guard(menuEditLayout) }, editing ? '✎ Exit Edit layout' : '✎ Edit layout'));
  list.append(h('hr'));
  for (const m of menuSorted().filter(m => !m.admin || can('admin'))) list.append(h('button', { role: 'menuitem', class: 'menuItem', title: m.coming || m.tip, ...(m.coming ? { disabled: true } : {}), onclick: () => { closeMenuList(); if (m.view) setView(m.view); else openMenuTab(m.key); } },
    m.title, m.coming ? h('span', { class: 'muted' }, ' (coming)') : ''));
  const tabs = $('#menuTabs'); tabs.innerHTML = '';
  for (const k of menuSorted().map(m => m.key).filter(k => menuOpen.includes(k))) {
    const m = MENU.find(x => x.key === k);
    tabs.append(h('button', { class: 'menuTab' + (k === menuTab ? ' active' : ''), title: m.tip, onclick: ev => { if (ev.target.closest('.mtX')) return; openMenuTab(k); } },
      '☰ ' + m.title, h('span', { class: 'mtX', title: 'Close this Menu tab', onclick: () => closeMenuTab(k) }, '✕')));
  }
  if (menuTab && !paneDirty()) renderMenuPane();
}
const closeMenuList = () => { $('#menuList').classList.add('hidden'); $('#menuBtn').setAttribute('aria-expanded', 'false'); };
$('#menuBtn').onclick = ev => { ev.stopPropagation(); const l = $('#menuList'), show = l.classList.contains('hidden'); renderMenu(); l.classList.toggle('hidden', !show); $('#menuBtn').setAttribute('aria-expanded', String(show)); };
document.addEventListener('click', ev => { if (!ev.target.closest('.menuWrap')) closeMenuList(); });
async function menuEditLayout() {
  closeMenuList();
  if (editing) return leaveLayout();
  if (menuTab) leaveMenuTab();
  setView('workspace'); setEditing(true);
}
function openMenuTab(k) {
  if (editing) return toast('Save or exit Edit layout first', true);
  if (menuTab && menuTab !== k && paneDirty() && !confirm('This Menu tab has changes that are not saved. Leave them?')) return;
  if (menuTab && menuTab !== k) dropDirty(menuTab);
  if (!menuOpen.includes(k)) menuOpen.push(k);
  menuTab = k;
  setView('workspace');
  $('#wsScroll').classList.add('hidden'); $('#menuPane').classList.remove('hidden'); $('#view-workspace').classList.add('menuMode');
  renderTabs(); renderMenu(); renderMenuPane();
}
function leaveMenuTab() {
  if (!menuTab) return;
  dropDirty(menuTab);
  menuTab = null;
  $('#menuPane').classList.add('hidden'); $('#wsScroll').classList.remove('hidden'); $('#view-workspace').classList.remove('menuMode');
  renderMenu(); renderTabs(); fitZoom();
}
function closeMenuTab(k) {
  if (k === menuTab && paneDirty() && !confirm('This Menu tab has changes that are not saved. Close it anyway?')) return;
  menuOpen.splice(menuOpen.indexOf(k), 1);
  if (k !== menuTab) return renderMenu();
  dropDirty(k);
  const next = menuSorted().map(m => m.key).find(x => menuOpen.includes(x));
  if (next) openMenuTab(next); else leaveMenuTab();
}
// unsaved changes are let go (after the question above): the tab shows the saved copy next time
function dropDirty(k) {
  if (k === 'equipment' && eqDirty) { eqWork = null; eqDirty = false; }
  if (k === 'vessel' && vesselDirty) { vesselWork = null; vesselDirty = false; }
  if (profDirty[k]) { profWork[k] = null; profDirty[k] = false; }
}
function renderMenuPane() {
  const box = $('#menuPane'); box.innerHTML = '';
  const m = MENU.find(x => x.key === menuTab); if (!m) return;
  m.render(box);
  menuHelpIcons(box);
}
// a ? beside each heading of the Menu tab showing (again after a form redraws itself)
function menuHelpIcons(box) {
  if (!menuTab || !box.closest('#menuPane')) return;
  for (const hd of box.querySelectorAll('h3, .dlgHead')) {
    const topic = !hd.querySelector('.helpIcon') && menuTopic(menuTab, hd.textContent, hd.tagName === 'H3');
    if (topic) hd.append(' ', helpIcon(topic));
  }
}
window.addEventListener('beforeunload', e => { if (eqDirty || vesselDirty || Object.values(profDirty).some(Boolean)) { e.preventDefault(); e.returnValue = ''; } });

// a form for a Menu tab: the same fields as the properties dialogs; read only (greyed) when you can't change it
function paneForm(fields, obj, onChange, ro) {
  const body = h('div', { class: 'menuForm' });
  const build = bindForm(body, fields, obj, onChange);
  return { box: h('fieldset', { class: 'menuSet', ...(ro ? { disabled: true } : {}) }, body), body, build, read: () => readFields(obj, body) };
}
const saveBar = (...items) => h('div', { class: 'bar' }, ...items);

// ---- Default tab: what new Recipes start with, and the order of the Menu
function renderDefaultTab(box) {
  const admin = can('admin'), d = { units: 'US', hideMenuBar: true, ...(S.config.brewDefaults || {}) };
  const pick = (list, none) => [['', none], ...list.map(x => [x.id, x.name])];
  const fields = w => [['_d', 'Every default is set here. A new Recipe starts with the first ones, and you can change each one in the Recipe.', 'note'],
    ['units', 'Units', 'sel', Object.entries(UNIT_SYSTEMS), true],
    ['batchSize', `Batch size (${volUnit(w.units)}, into the fermenter)`, 'num'],
    ['equipmentProfile', 'Equipment Profile', 'sel', pick(S.profiles, '(the Schema\'s own)')],
    ['mashProfile', 'Mash Profile', 'sel', pick(S.mashProfiles, '(none)')],
    ['boilProfile', 'Boil Profile', 'sel', pick(S.boilProfiles, '(none)')],
    ['_t', 'New tabs and valves', 'head'],
    ['tabProfile', 'Tab Background Profile for a new tab', 'sel', pick(S.tabProfiles, '(none)')],
    ['valveProfile', 'Valve Profile picked first for a new valve', 'sel', pick(S.valveProfiles, '(none)')],
    ['_m', 'Menu Bar', 'head'],
    ['hideMenuBar', 'Hide the Menu Bar on Tabs (☰ Menu > Show Menu Bar brings it back)', 'bool'],
    ['_s', 'Sound', 'head'],
    ['soundOnStart', 'Turn Sound On when starting (when the panel opens or a Schema is loaded)', 'bool'],
    ['_sn', 'Browsers (Chrome, Edge, Safari, iPhone, Android) play no sound until the screen is tapped or clicked once. So with this on, the button at the top says "Sound on (tap anywhere)" until your first tap or click, and the sound is on from then.', 'note'],
    ['_z', 'On startup', 'head'],
    ['startZoom', 'Zoom', 'sel', [['', '(the last one used on this browser)'], ...ZOOMS]],
    ['startFullScreen', 'Full screen (starts with your first click or tap; not on iPhones)', 'bool'],
    ['_x', 'Text', 'head'],
    ['textLarge', `Large text size (px) for \\L in Process text. Bigger than normal text (${TEXT_NORMAL} px); empty = ${TEXT_LARGE}`, 'num']];
  const f = paneForm(fields, d, () => { }, !admin);
  // Sound on: the same as the button at the top. It works at once on this screen and is not saved.
  const now = h('input', { type: 'checkbox', class: 'soundNowSw', ...(soundOn ? { checked: true } : {}) });
  now.onchange = () => setSound(now.checked);
  const soundNow = h('div', { class: 'menuForm' }, h('label', {}, 'Sound on (this screen, right now; the same as the button at the top)'), h('label', { class: 'sw' }, now, h('span', { class: 'swk' })));
  const save = guard(async () => {
    f.read();
    if (d.textLarge === '' || d.textLarge === null) delete d.textLarge;
    if (d.textLarge !== undefined && !(+d.textLarge > TEXT_NORMAL && +d.textLarge <= 200)) throw new Error(`Large text size must be more than ${TEXT_NORMAL} (normal text) and at most 200`);
    await api('PUT', '/ui/settings', { brewDefaults: d }); S.config.brewDefaults = d; showMenuBar(document.body.classList.contains('menuBarOn')); setTextLarge(); toast('Defaults saved'); });
  const order = h('table', { class: 'grid menuOrder' }, h('thead', {}, h('tr', {}, h('th', {}, 'Order'), h('th', {}, 'Menu tab'), h('th', {}, ''))),
    h('tbody', {}, ...menuSorted().map((m, i) => {
      const n = h('input', { type: 'number', min: 1, max: MENU.length, step: 1, value: i + 1, class: 'orderNum', ...(admin ? {} : { disabled: true }) });
      n.onchange = guard(() => setMenuOrder(m.key, +n.value));
      return h('tr', {}, h('td', {}, n), h('td', {}, m.title), h('td', { class: 'muted' }, m.coming || m.tip));
    })));
  box.append(h('h3', {}, 'Default'), h('div', { class: 'menuNarrow' }, soundNow, f.box, admin ? saveBar(h('span', { class: 'spacer' }), h('button', { class: 'primary', onclick: save }, 'Save')) : ''),
    h('h3', {}, 'Order of the Menu'), h('p', { class: 'muted' }, 'Type a new number to move a Menu tab there. The others are numbered again to make room, and the Menu sorts itself.'), order);
}

// ---- Zoom tab: how big the tabs show, and Full screen. Picking one goes back to the tab, so you see it at once.
function renderZoomTab(box) {
  const back = () => closeMenuTab('zoom');
  const fs = !!document.fullscreenElement;
  box.append(h('h3', {}, 'Zoom'),
    h('div', { class: 'zoomPick' }, ...ZOOMS.map(([v, t]) => h('button', { class: v === zoom ? 'active' : '', onclick: () => { setZoom(v); back(); } }, t))),
    h('h3', {}, 'Full screen'),
    canFullScreen
      ? h('div', { class: 'zoomPick' }, h('button', { class: 'primary', onclick: () => { setFullScreen(!fs); back(); } }, fs ? 'Exit full screen' : 'Full screen'))
      : h('p', { class: 'muted' }, 'This browser cannot go full screen (iPhones cannot). On an iPhone, Share > Add to Home Screen opens the panel without the browser bars.'),
    h('p', { class: 'muted' }, 'Full screen hides the browser\'s own bars and the Menu Bar. Esc, or Full screen here again, brings them back. ' +
      'The Default Menu tab sets the zoom and Full screen the panel starts with.'));
}

// ---- About tab: who is signed in, Sign out, and the loaded Schema with its version
function renderAboutTab(box) {
  const act = S.schemas?.active || S.config.schema || {}, row = S.schemas?.list.find(x => x.id === act.id);
  const item = (k, v) => [h('dt', {}, k), h('dd', {}, v)];
  box.append(h('h3', {}, 'About'), h('div', { class: 'menuNarrow' },
    h('dl', { class: 'aboutGrid' },
      ...item('Panel', S.config.title || 'Skynet Brew Panel'),
      ...item('Signed in as', `${S.me.name} (${S.me.role})`),
      ...item('Schema', act.name || '(none)'),
      ...item('Schema version', act.version || 'No version yet'),
      ...(row?.updated ? item('Last saved', new Date(row.updated).toLocaleString()) : [])),
    act.version ? '' : h('p', { class: 'muted' }, 'Turn on "Update Version" next to Save layout (or pick "Save a new version now" in the Schema list) to give the Schema a version.'),
    saveBar(h('span', { class: 'spacer' }), h('button', { class: 'primary', onclick: signOut }, 'Sign out'))));
}

// ---- Equipment Profile tab
function renderEquipTab(box) {
  const pid = S.config.equipmentProfile;
  const fresh = eqWork && S.profiles.find(x => x.id === eqWork.id);       // locked or unlocked elsewhere (a Process, another screen)
  if (eqWork && !fresh) { eqWork = null; eqDirty = false; }
  else if (fresh) { if (!eqDirty) eqWork = clone(fresh); else Object.assign(eqWork, { locked: fresh.locked, lockedBy: fresh.lockedBy, lockedAt: fresh.lockedAt, usedBy: fresh.usedBy, drawn: fresh.drawn, pipes: fresh.pipes }); }
  if (!eqWork && pid && S.profiles.some(x => x.id === pid)) eqWork = clone(S.profiles.find(x => x.id === pid));
  box.append(h('h3', {}, 'Equipment Profile'), schemaProfileBox());
  const admin = can('admin');
  const pick = h('select', {}, h('option', { value: '' }, S.profiles.length ? 'Pick one to open ...' : '(none yet)'),
    ...S.profiles.map(x => h('option', { value: x.id, ...(x.id === eqWork?.id ? { selected: true } : {}) }, x.name + (x.id === pid ? '  (this Schema)' : ''))),
    ...(admin ? [h('option', { value: '__add__' }, 'Add new ...')] : []));
  pick.onchange = guard(async () => {
    if (pick.value === '__add__') { pick.value = eqWork?.id || ''; return newProfile(); }
    if (pick.value) openProfile(pick.value);
  });
  box.append(h('div', { class: 'bar menuPick' }, h('span', {}, 'Open'), pick));
  box.append(eqEditor());
}
// the loaded Schema and its profile: pick one (and say what happens to the drawing), lock it, see whether it is shared
function schemaProfileBox() {
  const c = S.config, pid = c.equipmentProfile, p = S.profiles.find(x => x.id === pid), admin = can('admin');
  const pick = h('select', { id: 'bsProfile', ...(admin ? {} : { disabled: true }) }, h('option', { value: '' }, '(none yet)'),
    ...S.profiles.map(x => h('option', { value: x.id, ...(x.id === pid ? { selected: true } : {}) }, x.name)), ...(admin ? [h('option', { value: '__add__' }, 'Add new ...')] : []));
  if (p?.locked) pick.disabled = true;
  pick.onchange = guard(async () => {
    const back = () => { pick.value = pid || ''; };
    if (pick.value === '__add__') { back(); return newProfile(); }
    const to = S.profiles.find(x => x.id === pick.value), here = c.graphics.filter(g => g.kind === 'vessel').length;
    let layout = 'use';
    if (!to) { if (!confirm('Take the Equipment Profile off this Schema?\n\nThe equipment and pipes stay on its tabs, kept in the Schema itself.')) return back(); }
    else if (to.hasDrawing) {
      // Fritz: the tabs are only changed when you say so
      layout = await choose(`Use "${to.name}" for this Schema. What goes on its tabs?`, [[`Use its Default Layout (${to.drawn} equipment, ${to.pipes} pipes)`, 'use'], ['Keep this Schema\'s layout as it is', 'keep']]);
      if (!layout) return back();
    } else if (!confirm(`Use "${to.name}" for this Schema?\n\n"${to.name}" has no Default Layout yet, so the ${here} piece${here === 1 ? '' : 's'} of equipment and the pipes on this Schema's tabs become its Default Layout.`)) return back();
    if (eqDirty && !confirm('The open Equipment Profile has changes that are not saved. Leave them?')) return back();
    eqDirty = false; eqWork = null;
    await api('PUT', '/ui/schema/profile', { id: pick.value, layout }); await load();
    toast(!pick.value ? 'This Schema has no Equipment Profile now' : layout === 'keep' ? `This Schema uses "${profileName(pick.value)}" and keeps its own layout` : `This Schema uses "${profileName(pick.value)}"`);
  });
  const lock = p ? h('label', { class: 'toggle op-only', title: 'A locked Equipment Profile (its numbers, equipment and pipes) cannot be changed until it is unlocked. A Process can do the same with lock_Equipment and unlock_Equipment.' },
    h('span', { class: 'sw' }, h('input', { type: 'checkbox', ...(p.locked ? { checked: true } : {}), onchange: guard(async ev => {
      const on = ev.target.checked;
      if (!on && !confirm(`Unlock "${p.name}"?${p.lockedBy ? `\n\nIt was locked by ${p.lockedBy}.` : ''}`)) { ev.target.checked = true; return; }
      await api('PUT', `/ui/equipment/${p.id}/lock`, { locked: on }); await load(); toast(on ? '🔒 Equipment Profile locked' : 'Equipment Profile unlocked');
    }) }), h('span', { class: 'swk' })), ' 🔒 Locked') : '';
  const others = p ? p.usedBy.filter(n => n !== S.schemas.active?.name) : [];
  const share = !p ? 'Pick one, or Add new to make one.' : others.length ? `Shared: also used by ${others.join(', ')}. A change to it changes every one of them.` : 'Unique: only this Schema uses it.';
  const own = p && c.layoutFromProfile === false ? ' This Schema keeps its own layout (see the Default Layout tab).' : p ? ` Its tabs show the profile's Default Layout (${p.drawn} equipment, ${p.pipes} pipes).` : '';
  return h('div', { class: 'schemaBox' }, h('div', { class: 'bar' }, h('span', {}, 'Schema ', h('b', {}, S.schemas.active?.name || ''), ' uses'), pick, lock,
    p && others.length && admin ? h('button', { class: 'admin-only', title: 'Copy the profile and use the copy for this Schema only', onclick: guard(makeUnique) }, 'Make it unique to this Schema') : ''),
    h('div', { class: 'muted' }, share, own),
    p?.locked ? h('div', { class: 'eqWarn' }, `🔒 Locked${p.lockedBy ? ' by ' + p.lockedBy : ''}${p.lockedAt ? ', ' + new Date(p.lockedAt).toLocaleString() : ''}. Its numbers, equipment and pipes can't be changed until it is unlocked.`) : '');
}
async function makeUnique() {
  const p = S.profiles.find(x => x.id === S.config.equipmentProfile), sch = S.schemas.active?.name;
  let name = `${p.name} (${sch})`; for (let i = 2; S.profiles.some(x => x.name.toLowerCase() === name.toLowerCase()); i++) name = `${p.name} (${sch} ${i})`;
  if (!confirm(`Make a copy of "${p.name}" called "${name}" and use it for this Schema only?\n\nThe other Schemas keep using "${p.name}".`)) return;
  const r = await api('POST', '/ui/equipment', { name, from: p.id, assign: true });
  eqDirty = false; await load(); openProfile(r.made); toast(`"${name}" is now this Schema's own profile`);
}
async function newProfile() {
  if (eqDirty && !confirm('The open Equipment Profile has changes that are not saved. Leave them?')) return;
  const w = { name: '', from: '', units: 'US', use: !S.config.equipmentProfile };
  if (await dialog('New Equipment Profile', [['name', 'Name (for example "Oak Barn 10 gallon")', 'text'],
    ['from', 'Start from', 'sel', [['', 'The usual numbers (change them after)'], ...S.profiles.map(p => [p.id, `A copy of "${p.name}"`])]],
    ['units', 'Units', 'sel', Object.entries(UNIT_SYSTEMS)], ['use', `Use it for the Schema "${S.schemas.active?.name}"`, 'bool']], w) !== 'ok') return;
  readFields(w);
  const r = await api('POST', '/ui/equipment', { name: w.name, from: w.from || undefined, assign: w.use });
  if (!w.from && w.units === 'Metric') {     // a blank metric profile starts with the metric numbers
    const p = r.list.find(x => x.id === r.made);
    await api('PUT', `/ui/equipment/${r.made}`, { ...p, units: 'Metric', ...Object.fromEntries(EQUIP_FIELDS.map(f => [f[0], f[5]])) });
  }
  eqDirty = false; await load(); openProfile(r.made); toast(`Equipment Profile "${w.name}" made`);
}
function openProfile(id) {
  if (eqWork?.id !== id && eqDirty && !confirm('The open Equipment Profile has changes that are not saved. Leave them?')) return;
  const p = S.profiles.find(x => x.id === id); if (!p) return toast('That profile is gone', true);
  if (eqWork?.id !== id) { vesselWork = null; vesselDirty = false; }
  eqWork = clone(p); eqDirty = false;
  if (menuTab === 'equipment') renderMenuPane(); else openMenuTab('equipment');
}
async function deleteProfile(id) {
  const p = S.profiles.find(x => x.id === id); if (!p) return;
  const used = p.usedBy.length ? `\n\nIt is used by: ${p.usedBy.join(', ')}. Those Schemas will have no Equipment Profile. Their tabs and drawings stay as they are.` : '';
  if (!confirm(`Delete the Equipment Profile "${p.name}"?${used}`)) return;
  await api('DELETE', `/ui/equipment/${id}`);
  if (eqWork?.id === id) { eqWork = null; eqDirty = false; vesselWork = null; vesselDirty = false; }
  await load(); toast(`"${p.name}" deleted`);
}
async function saveProfile() {
  const r = await api('PUT', `/ui/equipment/${eqWork.id}`, eqWork);
  eqWork = clone(r.saved); eqDirty = false; S.profiles = r.list; renderMenu(); toast('Equipment Profile saved');
}

function eqEditor() {
  const box = h('div', { class: 'eqEditor' });
  if (!eqWork) { box.append(h('p', { class: 'muted' }, 'Pick an Equipment Profile above to open it, or Add new to make one.')); return box; }
  const p = eqWork, admin = can('admin') && !p.locked;
  const changed = () => { eqDirty = true; calc(); $('#eqSaveState').textContent = 'Not saved yet'; };
  const buttons = () => h('div', { class: 'bar' }, admin ? h('button', { class: 'danger', onclick: guard(() => deleteProfile(p.id)) }, 'Delete') : '', h('span', { class: 'spacer' }),
    admin ? h('button', { onclick: () => { if (eqDirty && !confirm('Leave the changes that are not saved?')) return; eqWork = null; eqDirty = false; renderMenuPane(); } }, 'Cancel') : '',
    admin ? h('button', { class: 'primary', onclick: guard(async () => { f.read(); await saveProfile(); }) }, 'Save') : '');
  const fields = w => [['name', 'Name', 'text'], ['units', 'Units', 'sel', Object.entries(UNIT_SYSTEMS), true],
    ...EQUIP_FIELDS.map(x => [x[0], `${x[1]} (${unitOf(x, w.units)})`, 'num']), ['notes', 'Notes', 'area'],
    ['_m', 'Batch size and top up water are set in the Recipe, boil time and boil off in the Boil Profile, and each vessel\'s size, dead space and trub loss on the Vessel tab.', 'note']];
  const f = paneForm(fields, p, () => { try { f.read(); } catch { } changed(); }, !admin);
  // a volume check: a batch size and a Boil Profile (the Recipe gives these from the next stage)
  const chk = { batchSize: S.config.brewDefaults?.batchSize ?? (p.units === 'Metric' ? 20 : 5), boil: S.config.brewDefaults?.boilProfile || S.boilProfiles[0]?.id || '' };
  const out = h('div', { class: 'eqCalc' });
  const calc = () => {
    const u = volUnit(p.units), bp = S.boilProfiles.find(x => x.id === chk.boil), kettle = firstOfType(p, 'Brew Kettle'), ferm = firstOfType(p, 'Fermenter');
    const v = brewVolumes({ ...p, batchSize: chk.batchSize, boilTime: bp?.boilTime, boilOffRate: bp?.boilOffRate, kettleVolume: kettle?.volume, fermenterVolume: ferm?.maxVolume ?? ferm?.volume, fermenterLoss: ferm?.extraTrub });
    const bs = h('input', { type: 'number', step: 'any', min: 0, value: chk.batchSize, class: 'orderNum' }); bs.onchange = () => { chk.batchSize = +bs.value; calc(); };
    const bsel = h('select', {}, h('option', { value: '' }, '(no Boil Profile)'), ...S.boilProfiles.map(x => h('option', { value: x.id, ...(x.id === chk.boil ? { selected: true } : {}) }, x.name)));
    bsel.onchange = () => { chk.boil = bsel.value; calc(); };
    out.innerHTML = '';
    out.append(h('div', { class: 'dlgHead' }, 'Check the volumes'),
      h('div', { class: 'eqRow' }, h('span', {}, `Batch size (${u})`), bs), h('div', { class: 'eqRow' }, h('span', {}, 'Boil Profile'), bsel),
      ...[['Pre-boil volume (in the kettle at the start of the boil)', v.preBoil], ['Boiled off', v.boilOff], ['Post-boil volume (hot)', v.postBoil], ['Into the fermenter', v.intoFermenter], ['Left to bottle or keg', v.bottling]]
        .map(([t, x]) => h('div', { class: 'eqRow' }, h('span', {}, t), h('b', {}, `${x} ${u}`))),
      h('div', { class: 'muted' }, kettle ? `Kettle: ${kettle.name}${kettle.volume ? ', ' + kettle.volume + ' ' + u : ' (no size yet)'}` : 'No Brew Kettle in this profile yet', ' · ',
        ferm ? `Fermenter: ${ferm.name}${ferm.extraTrub ? ', trub loss ' + ferm.extraTrub + ' ' + u : ''}` : 'No Fermenter yet'),
      ...v.warnings.map(w => h('div', { class: 'eqWarn' }, '⚠ ' + w)));
  };
  calc();
  box.append(h('h3', {}, `${p.locked ? '🔒 ' : ''}${p.name}`),
    p.locked ? h('div', { class: 'eqWarn' }, `Locked${p.lockedBy ? ' by ' + p.lockedBy : ''}. Unlock it to change it (the 🔒 Locked switch above when this Schema uses it, or unlock_Equipment in a Process).`) : '',
    h('div', { class: 'muted' }, p.usedBy?.length ? `Used by: ${p.usedBy.join(', ')}` : 'Not used by any Schema yet', ' · ', h('span', { id: 'eqSaveState' }, eqDirty ? 'Not saved yet' : 'Saved')),
    buttons(), h('div', { class: 'eqTop' }, f.box, out), eqPane(p), buttons());
  return box;
}

// the vessels and other equipment this profile is built from; each one opens on the Vessel tab
function eqPane(p) {
  const admin = can('admin') && !p.locked, onTab = it => S.config.graphics.find(g => g.kind === 'vessel' && g.profileItem === it.id);
  const u = volUnit(p.units);
  const rows = (p.equipment || []).map(it => h('tr', {},
    h('td', {}, it.name), h('td', {}, `${EQ[it.vesselType]?.title || it.vesselType}${it.vtype ? ': ' + (it.vtype === 'Other' && it.otherType ? it.otherType : it.vtype) : ''}`),
    h('td', {}, it.volume !== undefined ? `${it.volume} ${u}` : ''), h('td', {}, it.heatKind ? HEAT_KINDS[it.heatKind] + (it.heatDevice ? ': ' + it.heatDevice : '') : ''),
    h('td', {}, it.bundled ? '📦 Bundled' : 'Loose'), h('td', {}, onTab(it) ? '✓ on ' + onTab(it).workspace : h('span', { class: 'muted' }, 'not on a tab')),
    h('td', {}, h('button', { onclick: guard(() => openVessel(it.id)) }, admin ? 'Open in Vessel tab' : 'View'),
      admin ? h('button', { title: 'Put it on the Equipment tab of this Schema (or bring the drawing there up to date), with its ports as IPs', onclick: guard(() => placeEqItems(p, [it])) }, onTab(it) ? 'Update on tab' : 'Put on Equipment tab') : '')));
  const kind = h('select', {}, ...EQ_KINDS.map(k => h('option', { value: k }, EQ[k].title)));
  const loose = S.config.graphics.filter(g => g.kind === 'vessel' && EQ_KINDS.includes(g.vesselType) && !(p.equipment || []).some(it => it.id === g.profileItem));
  return h('div', { class: 'eqPane' }, h('h3', {}, 'Vessels and equipment in this profile'),
    h('p', { class: 'muted' }, 'Add as many as you need. Each one opens on the Vessel tab: its type, size, heat, probe and ports. Bundled equipment goes on the Equipment tab as one unit with its IPs.'),
    rows.length ? h('table', { class: 'grid' }, h('thead', {}, h('tr', {}, ...['Name', 'Kind', 'Size', 'Heat', 'Bundle', 'This Schema', ''].map(t => h('th', {}, t)))), h('tbody', {}, ...rows))
      : h('p', {}, 'No equipment yet.'),
    admin ? h('div', { class: 'bar' }, kind, h('button', { onclick: guard(() => newVessel(kind.value)) }, 'Add'),
      p.equipment?.length ? h('button', { onclick: guard(() => placeEqItems(p, p.equipment)) }, 'Put all on Equipment tab') : '',
      loose.length ? h('button', { title: 'Copy the vessels, chillers, coils and filters already drawn on this Schema\'s tabs into this profile', onclick: guard(() => bringInEq(p, loose)) }, `Bring in ${loose.length} from the tabs`) : '') : '');
}

// ---- Vessel tab: one vessel (or chiller, coil, filter) of the open Equipment Profile
// Fritz, 2026-10-20: size, dead space, graphic, extra trub loss, type (Other has its own name); the heat source its type allows
// and the device that heats it; the temperature probe on the same board as that device; a fermenter's largest and smallest
// batch, trub loss, probe and how often its temperature is reported; the ports, as on the Equipment tab.
function vesselProfile() {
  if (!eqWork) { const pid = S.config.equipmentProfile; if (pid && S.profiles.some(x => x.id === pid)) eqWork = clone(S.profiles.find(x => x.id === pid)); }
  return eqWork;
}
function openVessel(id) {
  if (vesselDirty && vesselWork?.item.id !== id && !confirm('The open vessel has changes that are not saved. Leave them?')) return;
  const it = eqWork?.equipment?.find(x => x.id === id); if (!it) return;
  vesselWork = { item: toPortFields(clone(it)), isNew: false }; vesselDirty = false;
  if (menuTab === 'vessel') renderMenuPane(); else openMenuTab('vessel');
}
function newVessel(kind = 'vessel') {
  if (vesselDirty && !confirm('The open vessel has changes that are not saved. Leave them?')) return;
  const p = vesselProfile(); if (!p) return toast('Open an Equipment Profile first', true);
  const n = (p.equipment || []).filter(x => x.vesselType === kind).length + 1;
  vesselWork = { isNew: true, item: toPortFields({ id: 'e' + Date.now().toString(36), vesselType: kind, name: (kind === 'vessel' ? 'Vessel' : EQ[kind].title) + ' ' + n, vtype: EQ[kind].types[0], image: EQ[kind].image, bundled: true, ports: eqDefaultPorts(kind) }) };
  vesselDirty = true;
  if (menuTab === 'vessel') renderMenuPane(); else openMenuTab('vessel');
}
// the port settings as flat fields for the form (and back)
function toPortFields(w) {
  for (const k of Object.keys(EQ[w.vesselType].ports)) { const q = w.ports?.[k] || {}; w[k + '_on'] = !!q.installed; w[k + '_pos'] = q.position; w[k + '_std'] = q.standard; }
  return w;
}
function fromPortFields(w) {
  const C = EQ[w.vesselType];
  w.ports = {};
  for (const [k, d] of Object.entries(C.ports)) {
    w.ports[k] = { installed: !!w[k + '_on'], position: w[k + '_pos'] || portDefPos(d), standard: w[k + '_std'] || EQ_STANDARDS[0] };
    delete w[k + '_on']; delete w[k + '_pos']; delete w[k + '_std'];
  }
  return w;
}
const ELECTRIC_TYPES = ['pid', 'hysteresis', 'dutyCycle', 'pwmOut'];
// the devices that can heat a vessel: gas valves (a valve whose Service is Gas) or electric elements (an output of kind
// element, or a PID, hysteresis, duty cycle or PWM output); RIMS and HERMS: the profile's RIMS tubes or HERMS vessels
function heatDevices(kind, p) {
  const els = S.config.elements;
  if (kind === 'gas') return els.filter(e => e.type === 'digitalOut' && e.subtype === 'valve' && e.service === 'gas').map(e => [e.name, e.name + (e.device ? ` (${e.device})` : '')]);
  if (kind === 'electric') return els.filter(e => (e.type === 'digitalOut' && e.subtype === 'element') || ELECTRIC_TYPES.includes(e.type)).map(e => [e.name, e.name + (e.device ? ` (${e.device})` : '')]);
  if (kind === 'rims' || kind === 'herms') return (p.equipment || []).filter(x => x.vtype === (kind === 'rims' ? 'RIMS' : 'HERMS')).map(x => [x.name, x.name]);
  return [];
}
// temperature probes: those on the same board (interface) as the heat device; any probe when there is none (unheated)
function probesFor(w) {
  const dev = ['gas', 'electric'].includes(w.heatKind) && S.config.elements.find(e => e.name === w.heatDevice)?.device;
  const all = S.config.elements.filter(e => e.type === 'temperature');
  return (dev ? all.filter(e => !e.device || e.device === dev) : all).map(e => [e.name, e.name + (e.device ? ` (${e.device})` : '')]);
}
function vesselFields(p) {
  return w => {
    const C = EQ[w.vesselType], u = volUnit(p.units), isV = w.vesselType === 'vessel', ferm = isV && w.vtype === 'Fermenter';
    const types = isV ? Object.keys(VESSEL_TYPES).filter(t => !['MLT', 'Whirlpool'].includes(t) || t === w.vtype) : null;
    const f = F.vesselNew(w), ports = f.slice(4, f.findIndex(x => x[0] === '_look'));
    const heat = isV && !ferm ? heatKindsFor(w.vtype) : [];
    if (heat.length && !heat.includes(w.heatKind)) w.heatKind = heat[0];
    if (!heat.length) { delete w.heatKind; delete w.heatDevice; delete w.otherHeat; }
    const devs = heat.length ? heatDevices(w.heatKind, p) : [];
    const probes = probesFor(ferm ? {} : w);
    return [['name', 'Name', 'text'],
      isV ? ['vtype', 'Type', 'sel', types, true] : ['vtype', 'Type', 'vlist', w.vesselType + '.types'],
      ...(isV && w.vtype === 'Other' ? [['otherType', 'Other Type (what it is)', 'text']] : []),
      ['label', 'Label (empty = the Type)', 'text'], ['image', 'Graphic (picture path)', 'path'],
      ['_s', 'Size', 'head'],
      ...(ferm ? [['maxVolume', `Largest batch (${u})`, 'num'], ['minVolume', `Smallest batch (${u})`, 'num'], ['extraTrub', `Trub loss, left in the fermenter (${u})`, 'num']]
        : [['volume', `Size (${u})`, 'num'], ['deadspace', `Dead space, left in the bottom (${u})`, 'num'], ...(isV ? [['extraTrub', `Extra trub loss (${u})`, 'num']] : [])]),
      ...(heat.length ? [['_h', 'Heat', 'head'], ['heatKind', 'Heat Source', 'sel', heat.map(k => [k, HEAT_KINDS[k]]), true],
        ...(['gas', 'electric', 'rims', 'herms'].includes(w.heatKind) ? [['heatDevice', { gas: 'Gas valve (a valve with Service: Gas)', electric: 'Electric element', rims: 'RIMS tube (in this profile)', herms: 'HERMS vessel (in this profile)' }[w.heatKind], 'sel', [['', devs.length ? '(pick one)' : '(none set up yet)'], ...devs], true]] : []),
        ...(w.heatKind === 'other' ? [['otherHeat', 'Other heat source (what it is)', 'text']] : [])] : []),
      ...(isV ? [['_t', 'Temperature', 'head'], ['probe', ferm || !['gas', 'electric'].includes(w.heatKind) ? 'Temperature Probe' : 'Temperature Probe (on the same board as the heat device)', 'sel', [['', probes.length ? '(none)' : '(no probes set up yet)'], ...probes]]] : []),
      ...(ferm ? [['reportEvery', 'Report the temperature every', 'num'], ['reportUnit', 'Minutes, hours or days', 'sel', Object.entries(REPORT_UNITS)]] : []),
      ['_p', 'Ports', 'head'], ...ports,
      ['_b', 'Build', 'head'], ['bundled', 'Bundled (goes on the tab as one unit with its IPs)', 'bool'], ['notes', 'Notes', 'area']];
  };
}
function renderVesselTab(box) {
  const p = vesselProfile();
  box.append(h('h3', {}, 'Vessel'));
  if (!p) return box.append(h('p', { class: 'muted' }, 'This Schema has no Equipment Profile yet. Make or pick one on the Equipment Profile tab first.'));
  const admin = can('admin') && !p.locked;
  if (vesselWork && !vesselWork.isNew && !(p.equipment || []).some(x => x.id === vesselWork.item.id)) { vesselWork = null; vesselDirty = false; }
  const pick = h('select', {}, h('option', { value: '' }, 'Pick one to open ...'),
    ...(p.equipment || []).map(x => h('option', { value: x.id, ...(x.id === vesselWork?.item.id ? { selected: true } : {}) }, `${x.name} (${EQ[x.vesselType]?.title}${x.vtype ? ': ' + x.vtype : ''})`)),
    ...(admin ? EQ_KINDS.map(k => h('option', { value: '__new:' + k }, `Add new ${k === 'vessel' ? 'vessel' : EQ[k].title.toLowerCase()} ...`)) : []));
  pick.onchange = () => { const v = pick.value; if (v.startsWith('__new:')) newVessel(v.slice(6)); else if (v) openVessel(v); };
  box.append(h('div', { class: 'bar menuPick' }, h('span', {}, `In "${p.name}":`), pick, h('span', { class: 'muted' }, p.locked ? '🔒 The profile is locked' : '')));
  if (!vesselWork) return box.append(h('p', { class: 'muted' }, 'Pick a vessel above, or Add new.'));
  const w = vesselWork.item, state = h('span', { class: 'muted' }, vesselDirty ? 'Not saved yet' : 'Saved');
  const f = paneForm(vesselFields(p), w, () => { vesselDirty = true; state.textContent = 'Not saved yet'; }, !admin);
  const save = async () => {
    f.read();
    const it = fromPortFields(clone(w));
    it.name = (it.name || '').trim() || EQ[it.vesselType].title;
    if (!it.label) it.label = it.vtype === 'Other' && it.otherType ? it.otherType : it.vtype;
    p.equipment ??= [];
    const i = p.equipment.findIndex(x => x.id === it.id);
    if (i < 0) p.equipment.push(it); else p.equipment[i] = it;
    await saveProfile();
    vesselWork = { item: toPortFields(clone(eqWork.equipment.find(x => x.id === it.id))), isNew: false }; vesselDirty = false;
    renderMenuPane();
    return eqWork.equipment.find(x => x.id === it.id);
  };
  const del = guard(async () => {
    if (!confirm(`Take "${w.name}" out of "${p.name}"?\n\nIf it is drawn on a tab, the drawing stays there.`)) return;
    p.equipment = (p.equipment || []).filter(x => x.id !== w.id);
    vesselWork = null; vesselDirty = false;
    await saveProfile(); renderMenuPane();
  });
  const onTab = S.config.graphics.find(g => g.kind === 'vessel' && g.profileItem === w.id);
  const buttons = () => saveBar(admin && !vesselWork.isNew ? h('button', { class: 'danger', onclick: del }, 'Delete') : '', h('span', { class: 'spacer' }),
    admin ? h('button', { onclick: () => { if (vesselDirty && !confirm('Leave the changes that are not saved?')) return; vesselWork = null; vesselDirty = false; renderMenuPane(); } }, 'Cancel') : '',
    admin ? h('button', { title: 'Save it, then put it on the Equipment tab of this Schema with its ports as IPs (or bring the drawing there up to date)', onclick: guard(async () => { const it = await save(); await placeEqItems(eqWork, [it]); }) }, onTab ? 'Save and update on tab' : 'Save and put on Equipment tab') : '',
    admin ? h('button', { class: 'primary', onclick: guard(save) }, 'Save') : '');
  box.append(h('div', { class: 'muted' }, `${EQ[w.vesselType].title} · `, state), buttons(), f.box, buttons());
}

// draw profile equipment on the loaded Schema's Equipment tab (a fresh drawing, or the old one brought up to date)
async function placeEqItems(p, items) {
  if (editing) return toast('Save or exit Edit layout first', true);
  if (eqDirty) await saveProfile();
  setEditing(true);
  let made = 0, updated = 0;
  for (const it of items) {
    const C = EQ[it.vesselType], tab = C.tab || 'Equipment';
    if (!draft.workspaces.some(w => w.name === tab)) draft.workspaces.push({ name: tab, width: 1600, height: 900 });
    let g = draft.graphics.find(x => x.kind === 'vessel' && x.profileItem === it.id);
    const old = g ? clone(g) : null;
    if (g && g.vesselType !== it.vesselType) {      // a different kind now: its old port IPs go
      draft.graphics = draft.graphics.filter(x => !(x.kind === 'ip' && x.attachTo === g.id && x.port)); old.ports = {};
    }
    if (!g) {
      const n = draft.graphics.filter(x => eqClass(x) && x.workspace === tab).length;
      g = { id: newId(), kind: 'vessel', workspace: tab, x: 60 + (n % 5) * 280, y: 60 + Math.floor(n / 5) * 340, w: C.size[0], h: C.size[1], labelAlign: 'above', labelSize: 16, labelVisible: true, profileItem: it.id };
      draft.graphics.push(g); made++;
    } else updated++;
    Object.assign(g, { vesselType: it.vesselType, name: it.name, vtype: it.vtype, label: it.label || it.vtype, image: it.image || C.image, ports: clone(it.ports || {}) });
    syncVesselPorts(g, old);
    if (it.bundled) g.bundled = true; else delete g.bundled;
    wsName = g.workspace;
  }
  await saveLayout();
  if (editing) return;                            // the save failed: Edit layout stays open with the message
  setView('workspace'); renderTabs(); renderWs();
  toast(`${made ? made + ' put on the tab' : ''}${made && updated ? ', ' : ''}${updated ? updated + ' brought up to date' : ''}. Drag the IPs onto the picture if they need it (switch Bundled off first).`);
}
// equipment already drawn on this Schema's tabs becomes part of the profile (and stays linked to its drawing)
async function bringInEq(p, loose) {
  if (editing) return toast('Save or exit Edit layout first', true);
  if (!confirm(`Copy ${loose.length} piece${loose.length > 1 ? 's' : ''} of equipment from this Schema's tabs into "${p.name}"?\n\n${loose.map(g => '• ' + (g.name || g.label)).join('\n')}`)) return;
  p.equipment ??= [];
  const links = [];
  for (const g of loose) {
    const id = 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    p.equipment.push({ id, vesselType: g.vesselType, name: g.name || g.label || EQ[g.vesselType].title, vtype: g.vtype || '', label: g.label || '', image: g.image || '', bundled: !!g.bundled, ports: clone(g.ports || {}) });
    links.push([g.id, id]);
  }
  await saveProfile();
  setEditing(true);
  for (const [gid, id] of links) { const g = draft.graphics.find(x => x.id === gid); if (g) g.profileItem = id; }
  await saveLayout();
  if (!editing) { openMenuTab('equipment'); toast(`${links.length} brought into "${p.name}"`); }
}

// ---- Default Layout tab: the vessels and pipes that go on a Schema's tabs with its Equipment Profile
// A Schema follows its profile's Default Layout (changes on its tabs go into the profile, and every Schema following it shows
// them), or keeps its own layout (Fritz: picking another profile never replaces the tabs unless you choose it).
function renderLayoutTab(box) {
  const c = S.config, p = S.profiles.find(x => x.id === c.equipmentProfile), admin = can('admin');
  box.append(h('h3', {}, 'Default Layout'));
  if (!p) return box.append(h('p', { class: 'muted' }, 'This Schema has no Equipment Profile yet. Pick or make one on the Equipment Profile tab.'));
  const follows = c.layoutFromProfile !== false, ro = !admin || p.locked;
  const act = (action, ask, done) => guard(async () => { if (!confirm(ask)) return; await api('POST', '/ui/schema/layout', { action }); await load(); toast(done); });
  const others = p.usedBy.filter(n => n !== S.schemas.active?.name);
  box.append(h('p', {}, `The Default Layout of "${p.name}": `, p.hasDrawing ? h('b', {}, `${p.drawn} equipment and ${p.pipes} pipes on the ${p.layoutTabs.join(', ') || 'Equipment'} tab${p.layoutTabs.length === 1 ? '' : 's'}`) : h('b', {}, 'none yet')),
    h('p', {}, follows ? `This Schema follows it: what you draw on its tabs (vessels, IPs, pipes and hoses) is saved as the Default Layout${others.length ? `, and ${others.join(', ')} show${others.length === 1 ? 's' : ''} it too when they follow it` : ''}.`
      : 'This Schema keeps its own layout. Its tabs are not changed by the profile, and its drawing does not change the profile.'),
    p.locked ? h('div', { class: 'eqWarn' }, '🔒 The Equipment Profile is locked, so its Default Layout can\'t be changed.') : '',
    ro ? '' : h('div', { class: 'bar wrap' },
      h('button', { title: 'Open Edit layout on the tabs', onclick: guard(async () => { leaveMenuTab(); const t = p.layoutTabs[0]; if (t && c.workspaces.some(w => w.name === t)) wsName = t; setEditing(true); if (!follows) toast('This Schema keeps its own layout: the changes stay in this Schema'); }) }, follows ? 'Edit it' : 'Edit this Schema\'s layout'),
      p.hasDrawing ? h('button', { onclick: act('use', `Put the Default Layout of "${p.name}" on this Schema's tabs?\n\nThe equipment, IPs and pipes on its tabs now are replaced. A backup of this Schema is made first.`, 'This Schema now shows the Default Layout') }, follows ? 'Load it on this Schema again' : 'Use it on this Schema') : '',
      h('button', { onclick: act('save', `Make the equipment and pipes on this Schema's tabs the Default Layout of "${p.name}"?${others.length ? `\n\n${others.join(', ')} use this profile too and get this layout when they follow it.` : ''}`, 'Saved as the Default Layout') }, 'Save this Schema\'s layout as the Default Layout'),
      follows ? h('button', { onclick: act('keep', 'Keep this Schema\'s own layout from now on?\n\nIts tabs stay as they are, and changes to them no longer change the profile\'s Default Layout.', 'This Schema keeps its own layout') }, 'Keep this Schema\'s own layout') : ''));
}

// ---- Mash Profile and Boil Profile tabs (a Recipe picks one of each from a dropdown)
const PK = { mash: { title: 'Mash Profile', list: () => S.mashProfiles, start: 'One step at 152 °F (67 °C) for 60 minutes',
    about: 'Up to 4 mash steps, each with its temperature and time, then the sparge. A Recipe picks its Mash Profile from a dropdown.' },
  boil: { title: 'Boil Profile', list: () => S.boilProfiles, start: 'A 60 minute boil',
    about: 'The total boil time and how much boils off each hour. A Recipe picks its Boil Profile from a dropdown, and the volume check on the Equipment Profile tab uses it.' },
  tab: { title: 'Tab Background Profile', list: () => S.tabProfiles, start: 'Default colors, values as Text', noUnits: true,
    about: 'The background color of the tabs that use it, and the look a new device or widget on those tabs starts with. The look is copied only when the device or widget is made; after that, change it in its properties (or from a Process, for example Pump_1.valueColor = "Red").' },
  valve: { title: 'Valve Profile', list: () => S.valveProfiles, start: 'The vertical ball valve pictures', noUnits: true,
    about: 'The pictures and orientation a new valve starts with. You pick the Valve Profile only when you make a new valve; after that, change the valve in its properties.' } };
const ALIGN_LIST = [['', '(default)'], 'TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight'];
const VALUE_TYPES = { text: 'Text', led: 'LED (push button)', gauge: 'Gauge (digits)' };
const LED_MODES = { locking: 'Locking (press: ON, press again: OFF)', momentary: 'Momentary (ON only while held)' };
const ORIENTATIONS = { h: 'Horizontal', v: 'Vertical', l45: '45 degrees Left', r45: '45 degrees Right' };
function profFields(kind) {
  return w => {
    const t = tempUnit(w.units), u = volUnit(w.units);
    if (kind === 'tab') return [['name', 'Name', 'text'], ['bgColor', 'Background color of the tab', 'color'],
      ['_n', 'Name', 'head'], ['nameColor', 'Name text color', 'color'], ['nameBg', 'Name background color', 'color'], ['nameAlign', 'Name placement', 'sel', ALIGN_LIST],
      ['_v', 'Value', 'head'], ['valueColor', 'Value text color', 'color'], ['valueBg', 'Value background color', 'color'], ['valueAlign', 'Value placement', 'sel', ALIGN_LIST],
      ['valueType', 'Value type', 'sel', Object.entries(VALUE_TYPES), true],
      ...(w.valueType === 'led' ? [['ledMode', 'LED push button', 'sel', Object.entries(LED_MODES)]] : []),
      ...(w.valueType === 'gauge' ? [['digits', 'Digits (how many)', 'num'], ['precision', 'Precision (decimals)', 'num']] : []),
      ['_s', 'A device with an ON / OFF state (a pump, valve, switch) can only be an LED or Text; a Gauge shows it as Text. A picture or label has no value, so it takes only the colors.', 'note'],
      ['notes', 'Notes', 'area']];
    if (kind === 'valve') return [['name', 'Name', 'text'], ['imageOpen', 'Graphic when open', 'gpick'], ['imageClosed', 'Graphic when closed', 'gpick'],
      ['orientation', 'Orientation', 'sel', Object.entries(ORIENTATIONS)],
      ['_o', 'Horizontal puts the pipe ends left and right, Vertical top and bottom, and 45 degrees on the corners. For Horizontal and Vertical pick graphics drawn that way; for the 45s pick the vertical graphics and the panel turns them 45 degrees (for a valve on a 45 degree elbow).', 'note'], ['notes', 'Notes', 'area']];
    if (kind === 'boil') return [['name', 'Name', 'text'], ['units', 'Units', 'sel', Object.entries(UNIT_SYSTEMS), true],
      ['boilTime', 'Total boil time (minutes)', 'num'], ['boilOffRate', `Boil off (${u} per hour)`, 'num'], ['notes', 'Notes', 'area']];
    return [['name', 'Name', 'text'], ['units', 'Units', 'sel', Object.entries(UNIT_SYSTEMS), true],
      ...Array.from({ length: MASH_STEPS }, (_, i) => [['_s' + i, `Step ${i + 1}${i ? ' (leave empty if not used)' : ''}`, 'head'],
        ['s' + i + '_name', 'Name', 'text'], ['s' + i + '_temp', `Temperature (${t})`, 'num'], ['s' + i + '_time', 'Time (minutes)', 'num']]).flat(),
      ['_o', 'Mash out and sparge', 'head'], ['mashOutTemp', `Mash out temperature (${t}, empty = none)`, 'num'],
      ['sparge', 'Sparge', 'sel', Object.entries(SPARGE), true], ...(w.sparge === 'none' ? [] : [['spargeTemp', `Sparge water temperature (${t})`, 'num']]),
      ...(w.sparge === 'batch' ? [['batchRest', 'Batch sparge rest time (minutes)', 'num']] : []), ['notes', 'Notes', 'area']];
  };
}
// the steps as flat fields for the form (and back)
const stepsToFields = p => { (p.steps || []).forEach((s, i) => { p['s' + i + '_name'] = s.name; p['s' + i + '_temp'] = s.temp; p['s' + i + '_time'] = s.time; }); return p; };
const fieldsToSteps = p => { const out = { ...p, steps: [] }; for (let i = 0; i < MASH_STEPS; i++) { out.steps.push({ name: p['s' + i + '_name'], temp: p['s' + i + '_temp'], time: p['s' + i + '_time'] }); delete out['s' + i + '_name']; delete out['s' + i + '_temp']; delete out['s' + i + '_time']; } return out; };
function renderBrewProfileTab(kind) {
  return box => {
    const K = PK[kind], list = K.list(), admin = can('admin');
    if (profWork[kind] && !list.some(x => x.id === profWork[kind].id)) { profWork[kind] = null; profDirty[kind] = false; }
    if (!profWork[kind] && list.length) { const d = S.config.brewDefaults?.[kind + 'Profile']; profWork[kind] = stepsToFields(clone(list.find(x => x.id === d) || list[0])); }
    const pick = h('select', {}, ...(list.length ? [] : [h('option', { value: '' }, '(none yet)')]), ...list.map(x => h('option', { value: x.id, ...(x.id === profWork[kind]?.id ? { selected: true } : {}) }, x.name)),
      ...(admin ? [h('option', { value: '__add__' }, 'Add new ...')] : []));
    pick.onchange = guard(async () => {
      if (profDirty[kind] && !confirm(`The open ${K.title} has changes that are not saved. Leave them?`)) { pick.value = profWork[kind]?.id || ''; return; }
      if (pick.value === '__add__') { pick.value = profWork[kind]?.id || ''; return newBrewProfile(kind); }
      profWork[kind] = stepsToFields(clone(list.find(x => x.id === pick.value))); profDirty[kind] = false; renderMenuPane();
    });
    box.append(h('h3', {}, K.title), h('p', { class: 'muted' }, K.about), h('div', { class: 'bar menuPick' }, h('span', {}, 'Open'), pick));
    const w = profWork[kind];
    if (!w) return box.append(h('p', { class: 'muted' }, admin ? 'Pick Add new ... to make one.' : 'None made yet.'));
    const state = h('span', { class: 'muted' }, profDirty[kind] ? 'Not saved yet' : 'Saved');
    const f = paneForm(profFields(kind), w, () => { profDirty[kind] = true; state.textContent = 'Not saved yet'; }, !admin);
    const save = guard(async () => {
      f.read();
      const r = await api('PUT', `/ui/profiles/${kind}/${w.id}`, kind === 'mash' ? fieldsToSteps(w) : w);
      S[kind + 'Profiles'] = r.list; profWork[kind] = stepsToFields(clone(r.saved)); profDirty[kind] = false; renderMenuPane(); toast(`${K.title} saved`);
    });
    const del = guard(async () => {
      if (!confirm(`Delete the ${K.title} "${w.name}"?`)) return;
      const r = await api('DELETE', `/ui/profiles/${kind}/${w.id}`);
      S[kind + 'Profiles'] = r.list; profWork[kind] = null; profDirty[kind] = false; renderMenuPane(); toast(`"${w.name}" deleted`);
    });
    const buttons = () => admin ? saveBar(h('button', { class: 'danger', onclick: del }, 'Delete'), h('span', { class: 'spacer' }),
      h('button', { onclick: () => { if (profDirty[kind] && !confirm('Leave the changes that are not saved?')) return; profWork[kind] = null; profDirty[kind] = false; renderMenuPane(); } }, 'Cancel'),
      h('button', { class: 'primary', onclick: save }, 'Save')) : '';
    box.append(h('div', {}, state), buttons(), f.box, buttons());
    if (kind === 'tab') box.append(tabsUsing(w, admin));
  };
}
// which of this Schema's tabs use a Tab Background Profile
function tabsUsing(p, admin) {
  const rows = S.config.workspaces.map(ws => {
    const s = h('select', admin ? {} : { disabled: true }, h('option', { value: '' }, '(none)'),
      ...S.tabProfiles.map(x => h('option', { value: x.id, ...(x.id === ws.tabProfile ? { selected: true } : {}) }, x.name)));
    s.onchange = guard(async () => {
      const workspaces = clone(S.config.workspaces), t = workspaces.find(x => x.name === ws.name);
      if (s.value) t.tabProfile = s.value; else delete t.tabProfile;
      await api('PUT', '/ui/layout', { workspaces }); S.config.workspaces = workspaces;
      toast(s.value ? `The ${ws.name} tab uses "${S.tabProfiles.find(x => x.id === s.value).name}"` : `The ${ws.name} tab has no Tab Background Profile now`);
    });
    return h('tr', {}, h('td', {}, ws.name), h('td', {}, s), h('td', { class: 'muted' }, ws.color ? 'Has its own background color (Tab settings)' : ''));
  });
  return h('div', { class: 'eqPane' }, h('h3', {}, `Tabs of the Schema "${S.schemas.active?.name}"`),
    h('p', { class: 'muted' }, 'Pick the Tab Background Profile of each tab. A tab with its own background color in Tab settings keeps that color.'),
    h('table', { class: 'grid' }, h('thead', {}, h('tr', {}, h('th', {}, 'Tab'), h('th', {}, 'Tab Background Profile'), h('th', {}, ''))), h('tbody', {}, ...rows)));
}
async function newBrewProfile(kind) {
  const K = PK[kind], list = K.list(), w = { name: '', from: '', units: S.config.brewDefaults?.units || 'US' };
  if (await dialog(`New ${K.title}`, [['name', 'Name', 'text'], ['from', 'Start from', 'sel', [['', K.start], ...list.map(p => [p.id, `A copy of "${p.name}"`])]],
    ...(K.noUnits ? [] : [['units', 'Units', 'sel', Object.entries(UNIT_SYSTEMS)]])], w) !== 'ok') return;
  readFields(w);
  const r = await api('POST', `/ui/profiles/${kind}`, { name: w.name, from: w.from || undefined, units: w.units });
  S[kind + 'Profiles'] = r.list; profWork[kind] = stepsToFields(clone(r.list.find(x => x.id === r.made))); profDirty[kind] = false;
  renderMenuPane(); toast(`${K.title} "${w.name}" made`);
}

// ---------------------------------------------------------------- start
$$('#views button').forEach(b => b.onclick = () => setView(b.dataset.view));
window.addEventListener('beforeunload', e => { if (dirty || (editing && JSON.stringify(draft) !== JSON.stringify(S.config))) { e.preventDefault(); e.returnValue = ''; } });
// ---------------------------------------------------------------- Config Editor (admin only)
// Opening it makes a backup copy of the config file first (config/backups). Save checks the JSON before anything is written.
let cfgDirty = false, cfgProblem = null;
const openConfig = guard(async () => {
  if (cfgDirty) return;                       // keep unsaved work when coming back to the page
  const r = await api('POST', '/ui/config/open');
  setCfgText(r.text);
  $('#cfgFile').textContent = r.file;
  $('#cfgBackupNote').textContent = (r.made ? 'Backup copy made: ' : 'Backup copy already up to date: ') + 'config/backups/' + r.backup;
});
function setCfgText(t) { $('#cfgCode').value = t; cfgDirty = false; cfgProblem = null; $('#cfgState').textContent = ''; renderCfgProblems(); fIdx = -1; refreshFind(false); }
function updateCfgGutter() {
  const n = $('#cfgCode').value.split('\n').length, bad = cfgProblem?.line;
  $('#cfgGutter').innerHTML = Array.from({ length: n }, (_, i) => i + 1 === bad ? `<span class="err">${i + 1}</span>` : i + 1).join('\n');
  $('#cfgGutter').scrollTop = $('#cfgCode').scrollTop;
}
function renderCfgProblems(checked) {
  const ul = $('#cfgProblems'); ul.innerHTML = '';
  if (cfgProblem) ul.append(h('li', { onclick: () => cfgGoto(cfgProblem) }, `Line ${cfgProblem.line}: ${cfgProblem.msg}`));
  else if (checked) ul.append(h('li', { class: 'ok' }, 'No problems found'));
  updateCfgGutter();
}
function cfgGoto({ line, col }) {
  const ta = $('#cfgCode'), lines = ta.value.split('\n');
  const at = lines.slice(0, line - 1).reduce((a, s) => a + s.length + 1, 0) + Math.max(0, (col || 1) - 1);
  ta.focus(); ta.setSelectionRange(at, Math.min(at + 1, ta.value.length));
  ta.scrollTop = Math.max(0, (line - 5) * 19.5); ta.scrollLeft = 0;
}
$('#cfgCode').addEventListener('input', () => { cfgDirty = true; $('#cfgState').textContent = '(not saved)'; updateCfgGutter(); refreshFind(false); });
$('#cfgCode').addEventListener('scroll', () => { $('#cfgGutter').scrollTop = $('#cfgCode').scrollTop; syncHl(); });
$('#cfgCode').addEventListener('keydown', ev => {
  if (ev.key === 'Tab') { ev.preventDefault(); document.execCommand('insertText', false, '  '); }
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); $('#cfgSave').click(); }
});
$('#cfgFind').onclick = () => findOpen() ? hideFind() : showFind();
$('#cfgCheck').onclick = guard(async () => {
  cfgProblem = (await api('POST', '/ui/config/check', $('#cfgCode').value, true)).problem; renderCfgProblems(true);
  if (cfgProblem) cfgGoto(cfgProblem);
});
$('#cfgSave').onclick = guard(async () => {
  const c = await api('POST', '/ui/config/check', $('#cfgCode').value, true);
  if (c.problem) { cfgProblem = c.problem; renderCfgProblems(); cfgGoto(cfgProblem); throw new Error('Not saved: line ' + c.problem.line + ': ' + c.problem.msg); }
  if (!confirm('Save the config file?\n\nRunning Processes are stopped and the boards reconnect. The old file is kept in config/backups.')) return;
  const r = await api('PUT', '/ui/config', $('#cfgCode').value, true);
  if (!r.ok) { cfgProblem = r.problem; renderCfgProblems(); cfgGoto(cfgProblem); throw new Error('Not saved: line ' + r.problem.line + ': ' + r.problem.msg); }
  cfgDirty = false; cfgProblem = null; $('#cfgState').textContent = ''; renderCfgProblems(true);
  $('#cfgBackupNote').textContent = 'Saved. The old file was copied to config/backups/' + r.backup;
  toast('Config saved');
});
$('#cfgReload').onclick = () => { if (cfgDirty && !confirm('Throw away your unsaved changes?')) return; cfgDirty = false; openConfig(); };
$('#cfgBackups').onclick = guard(async () => {
  const list = await api('GET', '/ui/config/backups'), box = $('#cfgBackupList'); box.innerHTML = '';
  if (!list.length) box.append(h('div', { class: 'faRow muted' }, 'No backups yet.'));
  for (const b of list) box.append(h('div', { class: 'faRow cfgBk' },
    h('div', { class: 'faText' }, h('div', {}, new Date(b.time).toLocaleString()), h('div', { class: 'muted faLine' }, `${b.name}  (${Math.round(b.size / 1024)} KB)`)),
    h('button', { title: 'Show this backup in the editor; nothing changes until you press Save', onclick: guard(async ev => {
      ev.preventDefault();
      if (cfgDirty && !confirm('Throw away your unsaved changes?')) return;
      setCfgText(await api('GET', '/ui/config/backups/' + encodeURIComponent(b.name)));
      cfgDirty = true; $('#cfgState').textContent = `(showing backup ${b.name}, not saved)`; $('#cfgBackupDlg').close();
    }) }, 'Open'),
    h('button', { class: 'primary', onclick: guard(async ev => {
      ev.preventDefault();
      if (!confirm(`Put back the config from ${new Date(b.time).toLocaleString()}?\n\nRunning Processes are stopped and the boards reconnect. The current file is copied to config/backups first.`)) return;
      const r = await api('POST', `/ui/config/backups/${encodeURIComponent(b.name)}/restore`);
      setCfgText(r.text); $('#cfgBackupDlg').close();
      $('#cfgBackupNote').textContent = `Restored ${b.name}. The file it replaced was copied to config/backups/${r.backup}`;
      toast('Config restored');
    }) }, 'Restore')));
  $('#cfgBackupDlg').showModal();
});
window.addEventListener('beforeunload', ev => { if (cfgDirty || dirty) { ev.preventDefault(); ev.returnValue = ''; } });

load().then(() => { soundOnStart(); connect(); setView('workspace'); firstRunSamples(); }).catch(e => toast('Cannot reach the server: ' + e.message, true));
