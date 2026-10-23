import { addEyes } from './eye.js';
import { elementTopic, graphicTopic, barTopic, menuTopic, viewTopic, TAB_SPOT, DB_TRIGGER } from './helpmap.js';
import { attachAutofill } from './autofill.js';
import { classify, toHtml, processXml, notepadPlusPlus, LEGEND } from './colorize.js';
import { setRich } from './richtext.js';
import { FONTS, TB_ALIGNS, textDefaults, firstSet, placeWith } from './textbox.js';
import { isDevice, typeCodes, defaultCode, suggestName, uniqueName, oneWirePort, cleanInterfaceId, defaultInterfaceId, cleanTabId, defaultTabId, portClash, portKeys, busCheck, freePins, pinTag } from './naming.js';
import { elementNameError, fileNameError } from './names.js';
import { CONNECTION_STANDARDS, textSize, stdShort, FITTING_KINDS, FITTING_SLOTS, THERMOWELL_POS, FITTING_PORTS, TEMPLATE_KINDS, VESSEL_KINDS, nameProblem, copyName, bundleName, fittingEnds, fittingPortStd, isCapOnly } from './templates.js';
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
let helpFrom = 'workspace';                 // the page Help was opened from (its Close button goes back there)
try { zoom = localStorage.getItem('bp.zoom') || 'fit'; } catch { /* private window: default */ }
if (zoom === 'page') zoom = 'fit';         // "Whole tab" is now "Fit screen"

let knownPaths = new Set();   // file paths in the open process that were already warned about (not on the Brain)
let editing = false, draft = null, sel = null;
// renamed Devices and Widgets in this Edit layout: first saved name -> name now; sent with Save so the Processes follow (lib/renames.js)
let draftRenames = new Map();   // sel = {kind:'el'|'gfx', id}
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
  if (!d) { d = h('dialog', { id: 'valveDlg', class: 'valveDlg', 'data-nomenu': true }); d.addEventListener('cancel', e => e.preventDefault()); document.body.append(d); }
  d.innerHTML = '';
  d.append(h('h3', {}, '✋ Manual valve'), ...list.map(a => h('div', { class: 'valveAsk' },
    h('div', { class: 'valveDo' }, `${a.open ? 'OPEN' : 'CLOSE'} ${a.label} by hand`),
    h('div', { class: 'muted' }, `The Process ${a.process} waits until you press Done.`),
    h('div', { class: 'bar' }, h('span', { class: 'spacer' }), can('operator')
      ? h('button', { class: 'primary', onclick: guard(() => api('POST', '/ui/valve/confirm', { name: a.name })) }, `Done: it is ${a.open ? 'open' : 'closed'}`)
      : h('span', { class: 'muted' }, 'An operator or admin must press Done.')))));
  if (!d.open) d.showModal();
}
function toast(msg, bad, ms) { const t = $('#toast'); t.textContent = msg; t.className = 'show' + (bad ? ' bad' : ''); clearTimeout(t._t); t._t = setTimeout(() => t.className = '', ms || (bad ? 5000 : 2200)); }
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
  $('#panelVer').textContent = panelVersionName();
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
    renderPipes(); updateMeters(); updateAlarms(); if (view === 'globals') refreshGlobalValues(ch);
  });
  es.addEventListener('scripts', e => { S.scripts = JSON.parse(e.data); renderScriptList(); updateScriptState(); if (menuTab === 'schema') renderMenuPane(); });
  es.addEventListener('print', e => { S.console.push(JSON.parse(e.data)); if (S.console.length > 1500) S.console.splice(0, 300); renderConsole(); });
  es.addEventListener('alert', e => alertBar(JSON.parse(e.data).text));
  es.addEventListener('valves', e => { S.valves = JSON.parse(e.data); renderValves(S.valves); });
  es.addEventListener('show', e => { const n = JSON.parse(e.data); if (S.config.workspaces.some(w => w.name === n)) { wsName = n; setView('workspace'); renderTabs(); renderWs(); } });
  es.addEventListener('config', () => { if (!editing) load(); });
  es.addEventListener('devices', e => { S.devices = JSON.parse(e.data); renderDevices(); });
  es.addEventListener('sim', e => { S.sim = JSON.parse(e.data); renderSimBar(); });
  es.addEventListener('mqtt', e => { S.mqtt = { ...(S.mqtt || {}), status: JSON.parse(e.data) }; renderMqttStatus(); });
}

function setView(v, here = false) {
  if (v === 'help' && !here) return openHelp(pageTopic());      // Help opens in its own window (see openHelp)
  const prev = view;
  view = v;
  $$('#views button').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  $$('.view').forEach(s => s.classList.toggle('active', s.id === 'view-' + v));
  // the Menu Bar is hidden on the Tabs page; coming back to Tabs hides it again
  if (v === 'help' && helpFrom !== 'help') helpFrom = prev;
  markOnTabs();
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
  for (const w of L().workspaces) t.append(h('button', { class: (w.name === wsName && !menuTab ? 'active' : '') + (w.build ? ' buildTab' : ''), onclick: () => { wsName = w.name; sel = null; leaveMenuTab(); renderTabs(); renderWs(); },
    ondblclick: () => { if (editing) editWorkspace(); }, ...(editing ? { title: w.build ? 'Build Tab: build the new thing here, then press Save Build ...' : `Tab ID ${w.id || '(given when saved)'}. Double-click for Tab settings` } : {}) }, w.build ? '🔨 ' + w.name : w.name));
  $('#saveBuild').classList.toggle('hidden', !buildWs());
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
  ws.classList.toggle('editing', editing); ws.classList.toggle('nomove', noMove());
  const isEqFit = g => eqClass(g) && !eqClass(g).tab;     // pipe fittings sit above the elements, vessels below them
  for (const g of L().graphics.filter(g => g.workspace === w.name && g.kind === 'vessel' && !isEqFit(g))) ws.append(buildVessel(g));
  for (const g of L().graphics.filter(g => g.workspace === w.name && !['pipe', 'ip', 'vessel'].includes(g.kind))) ws.append(buildGfx(g));
  for (const e of L().elements.filter(e => e.workspace === w.name)) ws.append(buildEl(e));
  for (const g of L().graphics.filter(g => g.workspace === w.name && isEqFit(g))) ws.append(buildVessel(g));
  if (editing) for (const g of draft.graphics.filter(g => g.workspace === w.name && g.autoFit)) autoFit(g);
  const capped = cappedIps();          // an opening closed by an End Cap shows the cap, not its IP
  for (const g of L().graphics.filter(g => g.workspace === w.name && g.kind === 'ip' && !capped.has(g.id))) ws.append(buildIp(g));
  for (const e of L().elements.filter(e => e.workspace === w.name && hasIps(e))) for (const q of devIps(e)) ws.append(buildDevIp(e, q));
  for (const g of L().graphics.filter(g => g.workspace === w.name && eqPorts(g).length)) for (const q of eqPorts(g)) ws.append(buildEqIp(g, q));
  renderPipes(); fitZoom(); updLockBtn();
}

// Phones and tablets (Fritz): in Edit layout a finger only picks things, so nothing is moved or resized by accident.
// A finger screen has no pointer that hovers; an iPad can say it is a Mac, so its touch points count too.
const touchOnly = () => matchMedia('(hover: none) and (pointer: coarse)').matches || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
const noMove = () => editing && touchOnly() && !S.config.brewDefaults?.touchMove;   // the Default tab switch lets them move again

const tabProfileOf = w => w?.tabProfile ? (S.tabProfiles || []).find(p => p.id === w.tabProfile) : null;
function place(node, o) { node.style.left = (o.x || 0) + 'px'; node.style.top = (o.y || 0) + 'px'; node.style.width = (o.w || 120) + 'px'; node.style.height = (o.h || 60) + 'px'; }

// Bundle (Fritz): a vessel and the IPs attached to it move as one unit and can't be edited until it is un-bundled
// A Tab_Fitting joined to a vessel port is part of that vessel's bundle too.
function bundleOf(g) {
  if (!g) return null;
  let v = g.kind === 'ip' && g.attachTo ? draft.graphics.find(x => x.id === g.attachTo && x.kind === 'vessel') : isBfit(g) && g.onVessel ? g : null;
  if (isBfit(v) && v.onVessel) v = draft.graphics.find(x => x.id === v.onVessel && x.kind === 'vessel') || v;
  if ((v?.bundled || isSkyV(v)) && v !== g) return v;        // a Skynet vessel is always one bundle with its IPs and fittings
  const u = g.kind === 'ip' && g.attachTo ? draft.graphics.find(x => x.id === g.attachTo) : null;
  return isUnit(u) ? u : null;          // the IPs of a Skynet Fitting are part of it: they never move on their own
}
const bundledIps = v => draft.graphics.filter(g => g.kind === 'ip' && g.attachTo === v.id);

// Edit layout: a resize corner, or a padlock when the item is locked in place
function editDeco(n, o) {
  if (o.locked) { n.classList.add('locked'); n.append(h('div', { class: 'lock', title: 'Locked in place' }, '🔒')); }
  else if (o.bundled && !isUnit(o) && !isSkyV(o)) n.append(h('div', { class: 'lock', title: 'Bundled with its IPs: moves as one, no editing' }, '📦'));
  else n.append(h('div', { class: 'rs' }));
}

// Vessel widgets (app-only): electrically heated, gas heated, or an unheated mash tun. A background picture by path,
// a label (alignment, color, size, show / hide), and IPs placed on them become its ports and move with it.
const VESSELS = { vessel: 'Vessel (kettle, HLT, MLT ...)', pchiller: 'Plate chiller', ccoil: 'Chilling coil', herms: 'HERMS coil', trub: 'Trub filter', rims: 'RIMS tube',
  bfit: 'Tab_Fitting (Bundled Fitting)', eqTee: 'Pipe tee', eqElbow90: 'Pipe 90° elbow', eqElbow45: 'Pipe 45° elbow', eqCross: 'Pipe cross',
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
const RIMS_POS = [['Top Left', 0.22, 0], ['Top Right', 0.78, 0], ['Bottom Left', 0.22, 1], ['Bottom Right', 0.78, 1]];
const pt = (name, pos, o = {}) => ({ name, ip: true, pos, ...o });
const EQ = {
  // Fritz, 2026-10-21: a vessel is a plain gray tank with no text on it: the Display Name is its only text
  vessel: { title: 'Vessel', types: Object.keys(VESSEL_TYPES), image: 'Images/Skynet/Vessels/vessel_gray.svg', size: [220, 270], tab: 'Equipment',
    ports: {
      outlet: pt('Outlet', [['Center Bottom', 0.5, 1], ['Bottom Drain', 0.9, 0.92], ['Front Low', 0.5, 0.86]], { on: true }),
      // a second drain, for example above the element so it always stays under water (Fritz's Big Fatty, 2026-10-22)
      outlet2: pt('Second Outlet', [['Front Middle', 0.5, 0.75], ['Front Low', 0.5, 0.86], ['Bottom Drain', 0.9, 0.92]]),
      tangential: pt('Tangential', [['Bottom Left', 0, 0.8], ['Bottom Right', 1, 0.8], ['Center', 0.5, 0.8], ['Back', 0.65, 0.75]]),
      thermowell: pt('Thermowell', [['Center Low', 0.5, 0.75], ['Left Low', 0, 0.75], ['Right Low', 1, 0.75], ['Back Low', 0.7, 0.7]], { ip: false }),
      steamSlayer: pt('Steam Slayer', V_HIGH), sparge: pt('Sparge', V_HIGH), cip: pt('CIP', [['Lid', 0.5, 0], ...V_HIGH]),
      // where the heating element goes in (Fritz, 2026-10-22): a mark, not an IP; its Device is picked on the Tab_Vessel
      element: pt('Heating element', [['Right Low', 1, 0.88], ['Left Low', 0, 0.88], ['Center Low', 0.5, 0.92], ['Back Low', 0.3, 0.88]], { ip: false }),
    } },
  pchiller: { title: 'Plate chiller', types: ['Brazed plate 20', 'Brazed plate 30', 'Brazed plate 40', 'Counterflow'], image: 'Images/Skynet/Chillers/plate_chiller.svg', size: [110, 200], tab: 'Equipment',
    ports: {
      wortIn: pt('Wort In', CORNERS, { on: true, def: 'Top Left', circuit: 'wort' }), wortOut: pt('Wort Out', CORNERS, { on: true, def: 'Bottom Right', circuit: 'wort' }),
      waterIn: pt('Water In', CORNERS, { on: true, def: 'Bottom Left', circuit: 'water' }), waterOut: pt('Water Out', CORNERS, { on: true, def: 'Top Right', circuit: 'water' }),
      thermowell: pt('Thermowell', [['Wort Out', 0.85, 0.75], ['Water Out', 0.85, 0.25]], { ip: false }),
    } },
  ccoil: { title: 'Chilling coil', types: ['Immersion coil', 'Jacketed (glycol)'], image: 'Images/Skynet/Chillers/chill_coil.svg', size: [180, 180], tab: 'Equipment',
    ports: { in: pt('In', CORNERS.slice(0, 2).concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Left', circuit: 'a' }), out: pt('Out', CORNERS.slice(0, 2).concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Right', circuit: 'a' }),
      // a 4 port coil (Chillzilla): a second circuit that never mixes with the first (Fritz, 2026-10-21: 2 ins, 2 outs)
      in2: pt('In 2', CORNERS.concat(SIDE4), { def: 'Bottom Left', circuit: 'b' }), out2: pt('Out 2', CORNERS.concat(SIDE4), { def: 'Bottom Right', circuit: 'b' }) } },
  herms: { title: 'HERMS coil', types: ['Stainless 25 ft', 'Stainless 50 ft', 'Copper'], image: 'Images/Skynet/Other_Equipment/herms_coil.svg', size: [180, 180], tab: 'Equipment',
    ports: { wortIn: pt('Wort In', CORNERS.concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Left', circuit: 'a' }), wortOut: pt('Wort Out', CORNERS.concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Right', circuit: 'a' }),
      in2: pt('In 2', CORNERS.concat(SIDE4), { def: 'Bottom Left', circuit: 'b' }), out2: pt('Out 2', CORNERS.concat(SIDE4), { def: 'Bottom Right', circuit: 'b' }) } },
  trub: { title: 'Trub filter', types: ['Inline filter', 'Hop rocket', 'Hop spider'], image: 'Images/Skynet/Other_Equipment/trub_filter.svg', size: [100, 170], tab: 'Equipment',
    ports: { inlet: pt('Inlet', SIDE4.concat(CORNERS), { on: true, def: 'Top', circuit: 'a' }), outlet: pt('Outlet', SIDE4.concat(CORNERS), { on: true, def: 'Bottom', circuit: 'a' }) } },
  // RIMS tube (Fritz, 2026-10-22): wort in at the top of one end, out at the bottom of the other; the probe goes in one end and
  // the element in the other (both picked on the Tab_Vessel; neither is an IP, so no flow there)
  rims: { title: 'RIMS tube', types: ['RIMS'], image: 'Images/Skynet/Other_Equipment/Equipment_RIMS.svg', size: [200, 100], tab: 'Equipment',
    ports: { inlet: pt('Wort In', RIMS_POS, { on: true, def: 'Top Left', circuit: 'a' }), outlet: pt('Wort Out', RIMS_POS, { on: true, def: 'Bottom Right', circuit: 'a' }),
      thermowell: pt('Thermowell (probe)', [['Left End', 0, 0.5], ['Right End', 1, 0.5]], { ip: false, on: true, def: 'Left End' }),
      element: pt('Heating element', [['Right End', 1, 0.5], ['Left End', 0, 0.5]], { ip: false, on: true, def: 'Right End' }) } },
  eqTee: { title: 'Pipe tee', types: ['Equal tee', 'Reducing tee'], image: 'Images/Skynet/Other_Equipment/pipe_tee.svg', size: [90, 90],
    ports: { a: pt('Run A', SIDE4, { on: true, def: 'Left', circuit: 'a' }), b: pt('Run B', SIDE4, { on: true, def: 'Right', circuit: 'a' }), c: pt('Branch', SIDE4, { on: true, def: 'Bottom', circuit: 'a' }) } },
  eqElbow90: { title: 'Pipe 90° elbow', types: ['Short radius', 'Long radius'], image: 'Images/Skynet/Other_Equipment/pipe_elbow90.svg', size: [90, 90],
    ports: { a: pt('End A', SIDE4, { on: true, def: 'Left', circuit: 'a' }), b: pt('End B', SIDE4, { on: true, def: 'Bottom', circuit: 'a' }) } },
  eqElbow45: { title: 'Pipe 45° elbow', types: ['Short radius', 'Long radius'], image: 'Images/Skynet/Other_Equipment/pipe_elbow45.svg', size: [90, 90],
    ports: { a: pt('End A', SIDE4.concat([['Bottom Right', 1, 1], ['Top Right', 1, 0], ['Bottom Left', 0, 1], ['Top Left', 0, 0]]), { on: true, def: 'Left', circuit: 'a' }),
      b: pt('End B', SIDE4.concat([['Bottom Right', 1, 1], ['Top Right', 1, 0], ['Bottom Left', 0, 1], ['Top Left', 0, 0]]), { on: true, def: 'Bottom Right', circuit: 'a' }) } },
  eqCross: { title: 'Pipe cross', types: ['Equal cross', 'Reducing cross'], image: 'Images/Skynet/Other_Equipment/pipe_cross.svg', size: [90, 90],
    ports: { a: pt('End A', SIDE4, { on: true, def: 'Left', circuit: 'a' }), b: pt('End B', SIDE4, { on: true, def: 'Right', circuit: 'a' }),
      c: pt('End C', SIDE4, { on: true, def: 'Top', circuit: 'a' }), d: pt('End D', SIDE4, { on: true, def: 'Bottom', circuit: 'a' }) } },
};
// on / off pictures offered for Digital Outputs; users add their own (any picture path in the media folders)
const ONOFF_GRAPHICS = [['LED green', 'Images/Skynet/Lights_LEDs/led_green.svg'], ['LED red', 'Images/Skynet/Lights_LEDs/led_red.svg'], ['LED off (grey)', 'Images/Skynet/Lights_LEDs/led_off.svg'],
  ['Lightning bolt on', 'Images/Skynet/Lights_LEDs/bolt_on.svg'], ['Lightning bolt off', 'Images/Skynet/Lights_LEDs/bolt_off.svg'],
  ['Motorized ball valve open (horizontal)', 'Images/Skynet/Valves/Valve_Motor_Ball_OpenH.svg'], ['Motorized ball valve closed (horizontal)', 'Images/Skynet/Valves/Valve_Motor_Ball_ClosedH.svg'],
  ['Motorized ball valve open (vertical, motor right)', 'Images/Skynet/Valves/Valve_Motor_Ball_OpenV_RC.svg'], ['Motorized ball valve closed (vertical, motor right)', 'Images/Skynet/Valves/Valve_Motor_Ball_ClosedV_RC.svg'],
  ['Motorized ball valve open (vertical, motor left)', 'Images/Skynet/Valves/Valve_Motor_Ball_OpenV_LC.svg'], ['Motorized ball valve closed (vertical, motor left)', 'Images/Skynet/Valves/Valve_Motor_Ball_ClosedV_LC.svg'],
  ['Manual ball valve open (horizontal)', 'Images/Skynet/Valves/Valve_Manual_OpenH.svg'], ['Manual ball valve closed (horizontal)', 'Images/Skynet/Valves/Valve_Manual_ClosedH.svg'],
  ['Manual ball valve open (vertical, handle right)', 'Images/Skynet/Valves/Valve_Manual_OpenV_R.svg'], ['Manual ball valve closed (vertical, handle right)', 'Images/Skynet/Valves/Valve_Manual_ClosedV_R.svg'],
  ['Manual ball valve open (vertical, handle left)', 'Images/Skynet/Valves/Valve_Manual_OpenV_L.svg'], ['Manual ball valve closed (vertical, handle left)', 'Images/Skynet/Valves/Valve_Manual_ClosedV_L.svg'],
  ['Manual butterfly valve open (horizontal)', 'Images/Skynet/Valves/Valve_Manual_Butterfly_OpenH.svg'], ['Manual butterfly valve closed (horizontal)', 'Images/Skynet/Valves/Valve_Manual_Butterfly_ClosedH.svg'],
  ['Manual butterfly valve open (vertical, handle right)', 'Images/Skynet/Valves/Valve_Manual_Butterfly_OpenV_R.svg'], ['Manual butterfly valve closed (vertical, handle right)', 'Images/Skynet/Valves/Valve_Manual_Butterfly_ClosedV_R.svg'],
  ['Manual butterfly valve open (vertical, handle left)', 'Images/Skynet/Valves/Valve_Manual_Butterfly_OpenV_L.svg'], ['Manual butterfly valve closed (vertical, handle left)', 'Images/Skynet/Valves/Valve_Manual_Butterfly_ClosedV_L.svg'],
  ['Solenoid gas valve open (horizontal)', 'Images/Skynet/Valves/Valve_Gas_Solenoid_OpenH.svg'], ['Solenoid gas valve closed (horizontal)', 'Images/Skynet/Valves/Valve_Gas_Solenoid_ClosedH.svg'],
  ['Solenoid gas valve open (vertical, coil right)', 'Images/Skynet/Valves/Valve_Gas_Solenoid_OpenV_R.svg'], ['Solenoid gas valve closed (vertical, coil right)', 'Images/Skynet/Valves/Valve_Gas_Solenoid_ClosedV_R.svg'],
  ['Solenoid gas valve open (vertical, coil left)', 'Images/Skynet/Valves/Valve_Gas_Solenoid_OpenV_L.svg'], ['Solenoid gas valve closed (vertical, coil left)', 'Images/Skynet/Valves/Valve_Gas_Solenoid_ClosedV_L.svg'],
  ['Submersible sump pump on', 'Images/Skynet/Pumps/Pump_Sump_On.svg'], ['Submersible sump pump off', 'Images/Skynet/Pumps/Pump_Sump_Off.svg'],
  ['Ball valve open (horizontal)', 'Images/Skynet/Valves/Valve_Ball_OpenH_1.png'], ['Ball valve closed (horizontal)', 'Images/Skynet/Valves/Valve_Ball_ClosedH_1.png'],
  ['Ball valve open (vertical)', 'Images/Skynet/Valves/Valve_Ball_OpenV-1x1.png'], ['Ball valve closed (vertical)', 'Images/Skynet/Valves/Valve_Ball_ClosedV-1x1.png']];
// On overlay pictures (Fritz, 2026-10-22): drawn on top of the item's picture while it is on, the picture below stays visible.
// They have see-through backgrounds and live in the On_Off picture group (Fritz: its own folder): Skynet's in Images/Skynet/On_Off,
// your own in Images/On_Off. The list shows that group first, then every other picture; Add new takes any picture in media/Images.
// "tint:red" is not a file: it colors the picture underneath itself (Fritz: a heating element in a vessel glows red when on).
// Only the drawn part is colored, so it works best on pictures with a see-through background (SVG or PNG).
const TINTS = { red: ['Glow red (colors the picture itself; heating elements)', 'rgb(255,30,0)'], orange: ['Glow orange (colors the picture itself)', 'rgb(255,140,0)'],
  blue: ['Glow blue (colors the picture itself; cooling)', 'rgb(0,120,255)'] };
const isTint = p => /^tint:/.test(p || '');
const onOffPic = p => /^Images\/(Skynet\/)?On_Off\//i.test(p);
const OVERLAY_GRAPHICS = [['Lightning bolt (corner badge)', 'Images/Skynet/On_Off/Overlay_Bolt_Corner.svg'], ['Lightning bolt (big, see-through)', 'Images/Skynet/On_Off/Overlay_Bolt_Center.svg'],
  ['Green glow ring', 'Images/Skynet/On_Off/Overlay_Glow_Ring.svg'], ...Object.entries(TINTS).map(([k, t]) => [t[0], 'tint:' + k])];
// lists behind the dropdowns. Every list can be added to ("Add new ..."); additions are kept in the settings (vesselLists).
const UNITS = ['°F', '°C', '%', 'psi', 'bar', 'kPa', 'gal', 'L', 'qt', 'oz', 'lb', 'kg', 'g', 'SG', '°P', 'pH', 'gal/min', 'L/min', 'V', 'mA', 's', 'min'];
const IMG_RE = /\.(png|jpe?g|gif|svg|webp|bmp)$/i, SND_RE = /\.(wav|mp3|ogg|m4a)$/i;
// pictures and sounds already used anywhere in the layout
function usedPaths(re) {
  const c = draft || S.config;
  return [...new Set([...c.elements, ...c.graphics, ...c.workspaces].flatMap(o => [o.imageOn, o.imageOff, o.imageOverlay, o.image, o.background, o.sound, ...slotsOf(o).map(n => o['imagePath_' + n]), ...(o.sounds || [])])
    .filter(p => typeof p === 'string' && re.test(p)))].sort();
}
const HEAT_SOURCES = ['None', 'Electric element', 'Gas burner', 'Induction', 'Steam jacket', 'HERMS coil'];
const EQ_STANDARDS = ['TC 1.5', 'NPT 1/2 FPT', 'BSP 1/2', 'MM', 'TC 2', 'NPT 3/4 FPT', 'NPT 1/2 MPT'];
const eqClass = g => g?.kind === 'vessel' ? (g.vesselType === 'bfit' ? bfitClass(g) : EQ[g.vesselType]) : null;
// list keys: "standard" (shared), "<class>.types", "<class>.<port>"
function vList(key) {
  const [c, p] = key.split('.');
  const base = key === 'standard' ? EQ_STANDARDS : key === 'onoff' ? ONOFF_GRAPHICS.map(g => g[1]) : key === 'overlays' ? [...OVERLAY_GRAPHICS.map(g => g[1]), ...mediaPics.filter(onOffPic).sort(), ...inImages(mediaPics).filter(p => !onOffPic(p)).sort()] : key === 'units' ? UNITS : key === 'colors' ? [] :
    key === 'pictures' ? inImages([...ONOFF_GRAPHICS.map(g => g[1]), ...Object.values(EQ).map(c => c.image), ...usedPaths(IMG_RE), ...mediaPics]) :
    key === 'backgrounds' ? inImages([...mediaPics, ...(draft || S.config).workspaces.map(w => w.background).filter(Boolean)]).sort() : key === 'sounds' ? [...new Set([...mediaSounds, ...usedPaths(SND_RE)])].sort() : key === 'heat' ? HEAT_SOURCES : p === 'types' ? EQ[c]?.types : EQ[c]?.ports[p]?.pos.map(q => q[0]);
  return [...new Set([...(base || []), ...(S.config.vesselLists?.[key] || [])])];
}
// Picture lists only offer pictures in media/Images (and its folders); sound lists add what is in media/sounds.
// Fetched when a dialog needs them.
let mediaPics = [], mediaSounds = [], picGroups = [];
// a picture typed by hand always lands in media/Images: "pump.png", "/images/pump.png" and "media\Images\pump.png" -> "Images/pump.png"
const imagesPath = p => 'Images/' + p.replace(/\\/g, '/').replace(/^\/+/, '').replace(/^media\//i, '').replace(/^images\//i, '');
const inImages = list => [...new Set(list)].filter(p => /^Images\//i.test(p));
async function loadMediaPictures() {
  const [pics, snds, grp] = await Promise.all([...['Images', 'sounds'].map(dir => api('GET', `/ui/media/all?root=0&dir=${dir}`).catch(() => null)), api('GET', '/ui/media/groups').catch(() => null)]);
  picGroups = grp?.groups || picGroups;
  mediaPics = (pics?.files || []).filter(f => f.kind === 'picture').map(f => f.use);
  mediaSounds = (snds?.files || []).filter(f => f.kind === 'sound').map(f => f.use);
}
// Picture groups (Help > Picture groups): every picture list can show one group (a folder in media/Images, or in media/sounds
// for sounds) or All. The pick is remembered on this computer or phone.
// Skynet pictures are in Images/Skynet/<group>, yours in Images/<group>; the Show list picks Skynet, Mine or Both.
const groupOf = p => { const m = /^(?:Images\/(?:Skynet\/(?=[^/]+\/))?|sounds\/)([^/]+)\//i.exec(p || ''); return m ? m[1] : ''; };
const isSkynetPic = p => /^Images\/Skynet\//i.test(p || '');
const inSource = (p, src) => src === 'both' || !/^Images\//i.test(p || '') || (src === 'mine') !== isSkynetPic(p);
const SOURCES = [['skynet', 'Skynet pictures'], ['mine', 'My pictures'], ['both', 'Both']];
function groupChoices(sound, paths) {
  const top = sound ? 'sounds' : 'Images', seen = new Set(paths.map(groupOf).filter(Boolean));
  const out = sound ? [] : picGroups.map(g => [g.name, g.label + (g.standard ? '' : ' (yours)')]);
  for (const g of [...seen].sort()) if (!out.some(([n]) => n.toLowerCase() === g.toLowerCase())) out.push([g, g]);
  if (paths.some(p => p && !groupOf(p))) out.push(['-', `Not in a group (loose in ${top})`]);
  return out;
}
const inGroup = (p, g) => !g || (g === '-' ? !groupOf(p) : groupOf(p).toLowerCase() === g.toLowerCase());
let lastGroup = {}; try { lastGroup = JSON.parse(localStorage.getItem('picGroup') || '{}'); } catch { }
const srcPick = () => SOURCES.some(([k]) => k === lastGroup.src) ? lastGroup.src : 'skynet';      // most people only use the Skynet ones
const keepGroup = (kind, g) => { lastGroup[kind] = g; try { localStorage.setItem('picGroup', JSON.stringify(lastGroup)); } catch { } };
const portDefPos = d => d.def || d.pos[0][0];
function vPortXY(g, k, pos) {
  if (isUnit(g)) { const d = eqClass(g).ports[k], q = d.pos.find(q => q[0] === portDefPos(d)) || [0, 0.5, 0.5]; return unitPoint(g, q[1], q[2]); }
  const q = eqClass(g).ports[k].pos.find(q => q[0] === pos) || [pos, 0.5, 0.5];
  if (isSkyV(g)) return unitPoint(g, q[1], q[2]);           // a Skynet vessel: flipped and rotated with its picture
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
// It is a text box (public/textbox.js): what is not set here comes from the ☰ Menu > Default tab, and the text codes (\b \L \n) work.
function widgetLabel(g, defPos) {
  const D = TD(), lb = h('div', { class: 'vlabel at-' + (LABEL_POS.includes(g.labelAlign) ? g.labelAlign : defPos) });
  setRich(lb, g.label);
  lb.style.color = firstSet(g.labelColor, D.foreColor); lb.style.backgroundColor = firstSet(g.labelBg, D.backColor);
  lb.style.fontSize = (g.labelSize || D.nameFontSize || 16) + 'px'; lb.style.fontFamily = D.nameFont;
  lb.style.textAlign = (D.align || '').toLowerCase();
  if (g.labelBg || D.backColor) lb.style.textShadow = 'none';
  return lb;
}
// the Default tab's text box settings (colors, alignment, name font ...): public/textbox.js
const TD = () => textDefaults(S.config.brewDefaults);
// standard colors for the flow widgets' color dropdowns ('' = the default color)
// Default = the item's normal color, None = no color at all (see-through)
const COLORS = [['Default', ''], ['None', 'transparent'], ['Red', '#e74c3c'], ['Green', '#3fbf6a'], ['Blue', '#4fb3ff'], ['Yellow', '#f1c40f'], ['Orange', '#e8a33a'], ['Purple', '#a87ee8'],
  ['Copper', '#d98a4a'], ['Brown', '#8b5a2b'], ['Steel grey', '#8a8f96'], ['Light grey', '#c9ced3'], ['White', '#ffffff'], ['Black', '#000000']];
const LABEL_POS = ['top', 'top-left', 'top-right', 'center', 'bottom', 'bottom-left', 'bottom-right', 'above', 'below'];
function buildVessel(g) {
  const t = VESSELS[g.vesselType] ? g.vesselType : 'mashTun';
  const n = h('div', { class: `gfx vessel v-${t}` + (g.image ? ' has-img' : ''), 'data-gid': g.id, 'data-heater': g.heater || '', title: (eqClass(g) && g.name ? g.name + ': ' : '') + (g.label || (g.template ? (t === 'bfit' ? 'Tab_Fitting' : 'Tab_Vessel') + ' from ' + g.template : VESSELS[t])) });
  place(n, g);
  if (g.image && isUnit(g)) n.append(h('div', { class: 'bfImg', style: `background-image:url("${media(g.image)}");transform:${unitTransform(g)}` }));   // a Skynet Fitting: flipped and rotated
  else if (g.image && isSkyV(g) && (g.flipH || g.flipV || unitRot(g))) {     // a Skynet vessel flipped or rotated
    const [pw, ph] = picWH(g);
    n.append(h('div', { class: 'bfImg', style: `background-image:url("${media(g.image)}");transform:${unitTransform(g)};inset:auto;width:${pw}px;height:${ph}px;left:${((g.w || 90) - pw) / 2}px;top:${((g.h || 90) - ph) / 2}px` }));
  }
  else if (g.image && t === 'bfit' && +g.turn) n.append(h('div', { class: 'bfImg', style: `background-image:url("${media(g.image)}");transform:rotate(${+g.turn}deg)` }));   // a turned Tab_Fitting
  else if (g.image) n.style.backgroundImage = `url("${media(g.image)}")`;
  if (t === 'electric' || t === 'gas') n.append(h('div', { class: 'heat' }));
  for (const [k, d] of Object.entries(eqClass(g)?.ports || {})) {    // ports that are not IPs (thermowells) show as a mark
    const p = g.ports?.[k]; if (d.ip || !p?.installed) continue;
    let q = d.pos.find(q => q[0] === (isUnit(g) ? portDefPos(d) : p.position)) || [0, 0.5, 0.5];
    if (isUnit(g) || isSkyV(g)) { const [px, py] = unitPoint({ ...g, x: 0, y: 0 }, q[1], q[2]); q = [0, px / (g.w || 90), py / (g.h || 90)]; }
    const el = k === 'element';      // the heating element's spot: E, and it glows while its Device is on
    n.append(h('div', { class: 'twell' + (el ? ' elmark' : ''), title: vPortLabel(g, k, p) + (el && g.heater ? ': ' + g.heater : !el && g.probe ? ': ' + g.probe : ''), style: `left:${q[1] * 100}%;top:${q[2] * 100}%` }, el ? 'E' : 'T'));
  }
  if (t === 'bfit' && (g.fittings || []).some(f => METERS.includes(f.kind) && f.meter)) n.append(h('div', { class: 'fmRead', 'data-gid': g.id }, meterText(g)));
  const lbl = g.label || (g.template ? g.name : '');       // a Tab_Vessel or Tab_Fitting: empty Label = its Name
  if (g.labelVisible !== false && lbl) n.append(widgetLabel({ ...g, label: lbl }, 'top'));
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
  const n = h('div', { class: 'gfx' + (g.kind === 'text' ? ' txt' : ''), 'data-gid': g.id, ...(g.name ? { 'data-tname': g.name } : {}) });
  if (g.kind === 'image') { place(n, g); n.style.backgroundImage = g.image ? `url("${media(g.image)}")` : ''; }
  else fillText(n, g);
  if (editing) { editDeco(n, g); if (sel?.kind === 'gfx' && sel.id === g.id) n.classList.add('sel'); }
  return n;
}
// A Text ("+ Text" in Edit layout) is a text box: a Process can change it (Text_1.visible = false, Text_1.foreColor = "Red",
// Text_1 = "Mashing"). What a Process set comes first, then its own settings, then the ☰ Menu > Default tab.
function fillText(n, g) {
  const D = TD(), v = (!editing && g.name && S.values[g.name]) || {};
  place(n, editing ? g : placeWith(g, v));
  setRich(n, v.text ?? g.text ?? '');
  n.style.fontSize = (g.fontSize || 16) + 'px'; n.style.fontWeight = g.bold ? '700' : '';
  n.style.fontFamily = firstSet(g.font, D.nameFont);
  n.style.color = firstSet(v.forecolor, g.color, D.foreColor);
  n.style.backgroundColor = firstSet(v.backcolor, g.backColor, D.backColor);
  const al = firstSet(v.alignment, g.align, D.align);
  n.style.textAlign = al.toLowerCase();
  n.style.whiteSpace = g.wrap === false ? 'pre' : '';
  n.style.overflow = g.wrap === false ? 'hidden' : '';
  n.classList.toggle('vhidden', (v.visibility ?? (g.visible === false ? 'hidden' : 'visible')) === 'hidden' || (v.hidden ?? g.hidden) === true);
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
const NAME_PREFIX = { text: 'Text', point: 'IP', pipe: 'Straight', tee: 'Tee', elbow90: 'Elbow', elbow45: 'Elbow45', cross: 'Cross', manualValve: 'ManualValve', coupling: 'Coupling', cap: 'Cap' };
const autoPrefix = g => g.kind === 'pipe' ? (g.hose ? 'Hose' : 'Pipe') : g.kind === 'ip' && !g.port ? NAME_PREFIX[g.fitting || 'point'] || 'IP' : g.kind === 'text' ? 'Text' : null;
function giveName(g, all) {
  const p = autoPrefix(g); if (!p || (g.name && g.name.startsWith(p + '_'))) return;
  // a Text's name is used by Processes (Text_1.visible = false), so it can't be a Device's name either
  const used = new Set([...all.map(x => x.name), ...(g.kind === 'text' ? (draft || S.config).elements.map(e => e.name) : [])]); let n = 1; while (used.has(p + '_' + n)) n++;
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
  if (editing) { if (g.locked) { n.classList.add('locked'); n.append(h('div', { class: 'lock', title: 'Locked in place' }, '🔒')); } else if (!fit) n.append(h('div', { class: 'rs' })); if (g.label && !g.labelVisible) n.append(h('div', { class: 'iplbl' }, g.label)); if (sel?.kind === 'gfx' && sel.id === g.id) n.classList.add('sel'); }
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
// Every Device or Widget with an on / off state has .imageOn and .imageOff; the Tab swaps them by itself (Fritz, 2026-10-22)
const STATE_PICS = new Set(['pwmOut', 'analogOut', 'dutyCycle', 'hysteresis', 'pid', 'timer', 'stepper', 'flowMeter', 'soundPlayer']);
const ONOFF_PICS = [['imageOn', 'Picture when on', 'gpick'], ['imageOff', 'Picture when off', 'gpick']];
// One picture plus an On overlay instead of two pictures (Fritz, 2026-10-22): .imageOverlay is drawn on top while the item is on
const OVERLAY_PIC = ['imageOverlay', 'On overlay (on top while on)', 'gpick', 'overlays'];
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
  const tap = e.subtype === 'valve' && e.tapwater && tapOut(e) !== 'both' ? tapOut(e) : null;     // a one-way tap water valve: TAP and OUT ends
  const t = end => !tap ? '' : end === tap ? 'OUT' : 'TAP', l = end => `${e.name} ${!tap ? 'end' : end === tap ? 'tap water out' : 'tap side'}`;
  return [{ id: `dev:${e.name}:in`, label: l('in'), text: t('in'), c: sidePt(e, o?.[0] || e.ipIn || (wide ? 'left' : 'top')) },
    { id: `dev:${e.name}:out`, label: l('out'), text: t('out'), c: sidePt(e, o?.[1] || e.ipOut || (wide ? 'right' : 'bottom')) }];
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
// Its Name and its Value are text boxes (public/textbox.js): Name color / Value color win, then Fore color (all its text),
// then the ☰ Menu > Default tab. The Default fore color leaves the LED and Gauge digits their own colors.
const OWN_DIGITS = ['led', 'lcd', 'indicator'];
function styleEl(n, e) {
  const nm = n.querySelector('.nm'), vl = n.querySelector('.vl'), D = TD();
  const nc = firstSet(e.nameColor, e.foreColor, D.foreColor), vc = firstSet(e.valueColor, e.foreColor, OWN_DIGITS.includes(e.look) ? '' : D.foreColor);
  const nb = firstSet(e.nameBg, e.backColor, D.backColor), vb = firstSet(e.valueBg, e.backColor, D.backColor);
  if (nc) nm.style.color = nc;
  if (nb) nm.style.backgroundColor = nb;
  if (vc) { vl.style.color = vc; vl.style.textShadow = 'none'; }
  if (vb) vl.style.backgroundColor = vb;
  fontCss(nm, e.nameFont); fontCss(vl, e.valueFont);
  // Name font and Name font size: its own, else the Default tab's (px; an imported BruControl font keeps its size)
  const fam = firstSet(e.nameFontFamily, e.nameFont?.family ? '' : D.nameFont), size = +e.nameFontSize || (e.nameFont?.size ? 0 : D.nameFontSize);
  if (fam) nm.style.fontFamily = fam;
  if (size) nm.style.fontSize = size + 'px';
  if (e.valueEnlarge && !e.valueFont?.size) vl.style.fontSize = `calc(18px * ${1 + e.valueEnlarge / 100})`;
  const a = /^(Top|Middle|Bottom)(Left|Center|Right)$/, al = firstSet(e.align, D.align);
  let m = a.exec(e.nameAlign ?? ''); if (m) nm.style.textAlign = m[2].toLowerCase(); else if (al) nm.style.textAlign = al.toLowerCase();
  m = a.exec(e.valueAlign ?? ''); if (m) { vl.style.alignItems = ALIGN[m[1]]; vl.style.justifyContent = ALIGN[m[2]]; vl.style.textAlign = m[2].toLowerCase(); }
  else if (al) { vl.style.justifyContent = ALIGN[al]; vl.style.textAlign = al.toLowerCase(); }
  // Word wrap on: a long name goes onto more lines (off: one line, cut off with ...). Values always wrap.
  if (e.wrap) nm.style.whiteSpace = 'normal';
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
  if (![...Object.keys(LOOK_KEYS), 'forecolor', 'backcolor', 'alignment'].some(k => v[k] !== undefined && v[k] !== '') && !v.valuetype) return e;
  const o = { ...e };
  // Pump_1.foreColor / backColor / alignment: all its text, over what its properties say
  if (v.forecolor) { o.foreColor = v.forecolor; o.nameColor = o.valueColor = ''; }
  if (v.backcolor) { o.backColor = v.backcolor; o.nameBg = o.valueBg = ''; }
  if (v.alignment) { o.align = v.alignment; o.nameAlign = o.valueAlign = ''; }
  for (const [k, K] of Object.entries(LOOK_KEYS)) if (v[k] !== undefined && v[k] !== '') o[K] = v[k];
  if (v.valuetype) o.look = lookFor(v.valuetype, e);
  return o;
}
// The name shown on a Device or Widget: its Display name, or its Name when the Display name is empty. In Edit layout it follows
// the Properties you just changed (the live value from the Brain only catches up after Save).
const shownName = (e, v) => editing ? (e.displayName || e.name) : (v.displayname || e.name);
function fillEl(n, e0) {
  const v = S.values[e0.name] || {}, e = withLook(e0, v);
  const nm = n.querySelector('.nm'), vl = n.querySelector('.vl');
  if (e !== e0 || n._looked) {             // re-apply the colors and placement (they may have been changed back)
    n._looked = e !== e0;
    for (const x of [nm, vl]) { x.style.color = x.style.backgroundColor = x.style.textAlign = x.style.textShadow = x.style.whiteSpace = ''; }
    vl.style.alignItems = vl.style.justifyContent = '';
    styleEl(n, e);
  }
  // Pump_1.xPosition / yPosition / width / height from a Process move and size it (not in Edit layout, where you drag it)
  const at = editing ? e0 : placeWith(e0, v);
  if (at !== e0 || n._moved) { n._moved = at !== e0; place(n, elGeom(at)); if (hasIps(e0)) placeDevIps(at); }
  setRich(nm, shownName(e0, v));
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
    case 'label': text = shownName(e0, v); nm.classList.add('hidden'); break;
    case 'manual': fillManual(n, e, v); on = !!v.heat || !!v.pump; text = v.message || ''; break;
    case 'picture':
      // A screen picture: static image, or it follows another element (on image / off image)
      if (e.follow) { on = isOn(e.follow); img = (on ? v.imageon : v.imageoff) || pic; }
      text = e.text ?? ''; break;
  }
  // outputs on while running above 0, timers while running, steppers while moving, flow meters while flowing, sound players while playing
  if (STATE_PICS.has(e.type) && (e.imageOn || e.imageOff || v.imageon || v.imageoff)) img = (on ? (v.imageon || e.imageOn) : (v.imageoff || e.imageOff)) || pic;
  if (isPropValve(e)) {                              // show percent open, and the open / closed picture
    const pct = propPct(e); on = pct > 0;
    text = `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
    img = (on ? (v.imageon || e.imageOn) : (v.imageoff || e.imageOff)) || pic;
  }
  // On overlay: drawn on top while on. With no "Picture when on" the off picture stays underneath.
  const lit = on || (e.type === 'alarm' && !!v.active), ovl = lit && (v.imageoverlay || e.imageOverlay);
  if (ovl && img === pic) img = (e.type === 'alarm' ? v.imageoff : (v.imageoff || e.imageOff)) || pic;
  let ov = n.querySelector(':scope > .onov');
  if (ovl && !ov) n.append(ov = h('div', { class: 'onov' }));
  if (ov) {
    const tint = isTint(ovl) && img && TINTS[ovl.slice(5)];
    ov.style.backgroundImage = ovl && !isTint(ovl) ? `url("${media(ovl)}")` : '';
    ov.style.backgroundColor = tint ? tint[1] : '';
    ov.style.webkitMaskImage = ov.style.maskImage = tint ? `url("${media(img)}")` : '';
    ov.classList.toggle('tint', !!tint);
    ov.classList.toggle('hidden', !ovl || (isTint(ovl) && !tint));
    if (ovl) fitOverlay(n, ov, img, stretchPic(e, v));
  }
  if (e.type === 'label') n.classList.add('text');
  for (const k of ['led', 'lcd', 'dark', 'button', 'indicator']) n.classList.toggle('look-' + k, e.look === k);
  if (e.look === 'indicator') n.style.setProperty('--ind', on || v.active ? (e.onColor || 'green') : (e.offColor && e.offColor !== 'off' ? e.offColor : 'transparent'));
  setRich(vl, e.hideValue ? '' : text);
  n.classList.toggle('on', on && e.type !== 'picture');
  n.classList.toggle('vhidden', v.visibility === 'hidden' || v.hidden === true);   // .hidden = true wins over .visible = true
  n.classList.toggle('fault', !!v.fault);
  // a picture that is not in the media folders (BruControl pictures not copied yet) would leave a see-through
  // button with white text: show the plain gray button with black text instead
  const isButton = e.type === 'switch' || ['switch', 'pushbutton', 'momentary'].includes(vkKind(e)) || e.look === 'button';
  const missing = img && isButton && imgMissing(media(img), n);
  if (missing) img = '';
  n.classList.toggle('img-missing', !!missing);
  const stretch = stretchPic(e, v);
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
// The On overlay covers just the picture underneath (Fritz: sized to the picture), not the empty sides of a wide or tall item.
// The picture is drawn "contain" in the item, so its box comes from the picture's own width and height (loaded once).
const picSize = new Map();
function fitOverlay(n, ov, img, stretch) {
  const full = () => { ov.style.inset = '0'; ov.style.width = ov.style.height = ''; };
  if (!img || stretch) return full();
  const url = media(img), sz = picSize.get(url);
  if (!sz) {
    full();
    if (!picSize.has(url)) { picSize.set(url, null); const im = new Image(); im.onload = () => { picSize.set(url, [im.naturalWidth, im.naturalHeight]); if (n.isConnected) fitOverlay(n, ov, img, stretch); }; im.src = url; }
    return;
  }
  const W = n.clientWidth, H = n.clientHeight, k = Math.min(W / (sz[0] || 1), H / (sz[1] || 1)), w = sz[0] * k, hh = sz[1] * k;
  if (!W || !H || !w || !hh) return full();
  Object.assign(ov.style, { inset: 'auto', left: (W - w) / 2 + 'px', top: (H - hh) / 2 + 'px', width: w + 'px', height: hh + 'px' });
}
const stretchPic = (e, v) => !!e.imagePathsLocked && hasPictures(e, v);     // imported BruControl pictures fill the item
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
  const tn = !e && $(`#ws .gfx.txt[data-tname="${CSS.escape(name)}"]`), t = tn && L().graphics.find(g => g.kind === 'text' && g.name === name);
  if (t) fillText(tn, t);
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
    : h('input', { class: 'vdInput', value: num ? fmtVal(t, v.value) : (v.value ?? ''), inputmode: num ? 'decimal' : 'text', placeholder: { time: 'hh:mm:ss', datetime: 'mm/dd/yyyy hh:mm:ss' }[t.dataType] ?? (k === 'graphic' ? 'image path, e.g. Images/Skynet/Other_Equipment/BurnerFlame.png' : '') });
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
  const capped = cappedIps();
  return [...L().graphics.filter(g => g.kind === 'ip' && g.workspace === ws && !capped.has(g.id)).map(g => ({ id: g.id, label: (g.port ? vn(g.attachTo) + (g.label || g.id) : ipName(g)) })),
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
// which end tap water leaves by: 'out' (the second end, right or bottom), 'in' (the first end, left or top) or 'both'
const TAP_OUT = [['out', 'The second end (right or bottom), one way'], ['in', 'The first end (left or top), one way'], ['both', 'Both ends']];
const tapOut = e => TAP_OUT.some(([k]) => k === e.tapwaterOut) ? e.tapwaterOut : 'out';
const pipeJoined = p => !!(ipPoint(p.from, p.workspace) && ipPoint(p.to, p.workspace));
function ipNode(id, ws) {
  const q = eqOfIp(id) !== null && eqPort(id, ws);
  if (q) return { key: `eq:${eqOfIp(id)}:${q.circuit}`, pass: true };
  const dn = devOfIp(id);
  if (dn !== null) {
    const e = L().elements.find(x => x.name === dn), on = isOn(dn), end = id.slice(id.lastIndexOf(':') + 1);
    // a tap water valve that is open is a source: water pushes out of its out end only (Fritz, 2026-10-21: one way; the tap end
    // takes nothing in), or out of both ends when it is set to Both
    if (e.subtype === 'valve') return !on ? { closed: true } : tapWater(e) ? (tapOut(e) === 'both' || tapOut(e) === end ? { key: id, push: true } : { closed: true }) : { key: 'dev:' + dn, pass: true };
    if (isInline(e)) return { key: 'dev:' + dn, pass: true };
    if (e.subtype === 'propValve') return propPct(e) > 0 ? { key: 'dev:' + dn, pass: true } : { closed: true };
    return on ? { key: id, push: end === 'out', pull: end === 'in' } : { key: 'dev:' + dn, pass: true };
  }
  const g = L().graphics.find(g => g.id === id && g.workspace === ws);
  if (g?.port) {      // a port of an equipment widget: ports on the same circuit pass flow (chiller side, coil, filter, fitting)
    const v = L().graphics.find(x => x.id === g.attachTo), c = eqClass(v)?.ports[g.port]?.circuit;
    if (isBfit(v) && bfitClosed(v)) return { closed: true };       // a closed valve in a Tab_Fitting
    if (c) return { key: `eq:${v.id}:${c}`, pass: true };
  }
  if ((g?.fitting === 'manualValve' && !g.open) || g?.fitting === 'cap' || cappedIps().has(id)) return { closed: true };
  // a coupling joining two or more pipes / hoses passes flow; a hose end with nothing else on it is an open end (flow pours out)
  if (g?.fitting === 'coupling' && pipesOn(id, ws).length < 2) return { key: id, end: true };
  return isFitting(g) ? { key: id, pass: true } : { key: id, end: true };
}
function computeFlow(ws) {
  const dir = new Map();                         // pipe id -> 1 (as drawn) or -1 (backwards)
  const nodes = new Map(), adj = new Map(), radj = new Map();    // adj: the way flow can go; radj: back against it (a pump's IN pulls)
  const link = (a, b, p, oneWay) => {
    const add = (m, u, v, d) => { if (!m.has(u)) m.set(u, []); m.get(u).push({ v, p, d }); };
    add(adj, a, b, 1); add(radj, b, a, -1);
    if (!oneWay) { add(adj, b, a, -1); add(radj, a, b, 1); }
  };
  const node = id => { const n = ipNode(id, ws); if (n.key && !nodes.has(n.key)) nodes.set(n.key, n); return n; };
  for (const p of L().graphics.filter(g => g.kind === 'pipe' && g.workspace === ws && pipeJoined(g))) {
    if (!(p.flowWhen || []).every(isOn)) continue;
    const a = node(p.from), b = node(p.to);
    if (a.closed || b.closed || a.key === b.key) continue;
    if (a.end && b.end) { if ((p.flowWhen || []).length) dir.set(p.id, 1); continue; }
    link(a.key, b.key, p);
  }
  // a Tab_Fitting joined to a vessel port passes flow to and from that port (no pipe between them), unless a valve in it is closed
  for (const f of L().graphics.filter(g => isBfit(g) && g.onVessel && g.workspace === ws)) {
    const ip = L().graphics.find(x => x.kind === 'ip' && x.attachTo === f.onVessel && x.port === f.onPort);
    if (!ip || bfitClosed(f)) continue;
    const a = node(ip.id), key = `eq:${f.id}:${hasCheck(f) ? 'ci' : 'a'}`;
    if (!nodes.has(key)) nodes.set(key, { key, pass: true });
    if (a.closed || a.key === key) continue;
    link(a.key, key, { id: 'join:' + f.id });
  }
  // a check valve (Fritz, 2026-10-22) lets flow through one way only: from its Start (in) side to its other openings
  for (const f of L().graphics.filter(g => isBfit(g) && g.workspace === ws && hasCheck(g) && !bfitClosed(g))) {
    const ci = `eq:${f.id}:ci`, co = `eq:${f.id}:co`;
    for (const k of [ci, co]) if (!nodes.has(k)) nodes.set(k, { key: k, pass: true });
    link(ci, co, { id: 'check:' + f.id }, true);
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
      for (const { v, p, d } of (outward ? adj : radj).get(u) || []) if (!prev.has(v)) { prev.set(v, { from: u, p, d }); queue.push(v); }
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
  draft = on ? clone(S.config) : null; draftRenames = new Map();
  $('#ws').classList.remove('drawing');
  $('#editMode').checked = on;
  $('#editBar').classList.toggle('hidden', !on);
  $('#barEdit').classList.toggle('on', on); $('#barEdit').setAttribute('aria-pressed', String(on));
  $('#barEdit').title = on ? 'Leave Edit layout (asks to Save if something changed)' : 'Edit layout (admins): move, add and change things on the Tabs. Press again to leave it';
  const lockedEq = S.profiles?.find(p => p.id === S.config.workspaces.find(w => w.name === wsName)?.equipmentProfile && p.locked);
  $('#editHint').textContent = !on ? '' : (lockedEq ? `🔒 Equipment Profile "${lockedEq.name}" of this Tab is locked: its equipment, IPs and pipes can't be changed. ` : '') + (noMove() ? '📱 Phone or tablet: moving and resizing is off here, so nothing moves by accident (switch it on in ☰ Menu, Default). Tap to pick, hold a finger for properties. ' : 'Drag to move, corner to resize, double-click (or hold a finger) for properties. ') + ' Double-click an empty spot for Tab settings (background color and picture). 🔒 items are locked in place: only unlocked items move (🔒 Lock All, 🔓 Unlock All).';
  renderTabs(); renderWs();
}

let drag = null, lastPipeTap = null, hitUnit = null;
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
  if (handle) { sel = { kind: 'gfx', id: handle.dataset.gid }; drag = noMove() ? null : { mode: 'point', item: findItem('gfx', sel.id), i: +handle.dataset.pi }; ev.preventDefault(); return; }
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
    drag = noMove() ? null : pipe.locked ? lockedDrag(pipe, p) : startPipeMove(pipe, p);
    renderWs(); return;
  }
  if (!node) { sel = null; renderWs(); startLongPress(ev, 'tab'); return; }   // empty spot: hold a finger for Tab settings
  sel = node.dataset.name ? { kind: 'el', id: node.dataset.name } : { kind: 'gfx', id: node.dataset.gid };
  let item = findItem(sel.kind, sel.id);
  const bundle = bundleOf(item);
  const own = item?.kind === 'ip' && item.attachTo ? draft.graphics.find(x => x.id === item.attachTo) : null;
  hitUnit = isUnit(item) ? item.id : isUnit(own) ? own.id : null;        // a Skynet Fitting on a bundled vessel: the drag moves the vessel, a double-click opens the fitting
  if (bundle) { item = bundle; sel = { kind: 'gfx', id: bundle.id }; node = $(`#ws .gfx[data-gid="${CSS.escape(bundle.id)}"]`) || node; }
  startLongPress(ev, sel.kind, hitUnit || sel.id);
  $$('#ws .sel').forEach(n => n.classList.remove('sel')); node.classList.add('sel'); updLockBtn();
  if (noMove()) { drag = null; ev.preventDefault(); return; }   // a phone or tablet: select only, no move or resize
  if (item.locked) { drag = lockedDrag(item, p); ev.preventDefault(); return; }   // locked: select only, a try to drag says why
  if (item.fitting === 'coupling') {     // the open end of one straight pipe: dragging it moves that whole pipe
    const ps = pipesOn(item.id, item.workspace);
    if (ps.length === 1 && ps[0].straight && !ps[0].locked) { drag = startPipeMove(ps[0], p); ev.preventDefault(); return; }
  }
  const riders = lockedRiders(item);
  if (riders.length) { drag = lockedDrag(item, p, riders); ev.preventDefault(); return; }
  drag = { mode: !pip && !bundle && (!item.bundled || isUnit(item) || isSkyV(item)) && ev.target.classList.contains('rs') ? 'resize' : 'move', item, node, start: p, orig: { x: item.x || 0, y: item.y || 0, w: item.w || 120, h: item.h || 60 } };
  if (item.kind === 'vessel') drag.ports = bundleParts(item).map(g => ({ g, x: g.x || 0, y: g.y || 0 }));
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
  if (drag.mode === 'locked') {        // a locked item (or one that would carry a locked one) was dragged: say why it stays
    const q = canvasPt(ev);
    if (Math.hypot(q[0] - drag.start[0], q[1] - drag.start[1]) > 5) { toast(drag.why, true); drag = null; }
    return;
  }
  drag.moved = true;
  const p = canvasPt(ev), dx = p[0] - drag.start?.[0], dy = p[1] - drag.start?.[1];
  if (drag.mode === 'move' && drag.ports) {   // a vessel carries its ports (IPs) with it
    const mx = snap(drag.orig.x + dx) - drag.orig.x, my = snap(drag.orig.y + dy) - drag.orig.y;
    for (const q of drag.ports) { q.g.x = q.x + mx; q.g.y = q.y + my; const pn = $(`#ws .gfx[data-gid="${CSS.escape(q.g.id)}"]`); if (pn) place(pn, q.g); }
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
    drag.item.w = Math.max(drag.item.kind === 'ip' ? 10 : 20, snap(drag.orig.w + dx / k)); drag.item.h = Math.max(drag.item.kind === 'ip' ? 10 : 16, snap(drag.orig.h + dy / k)); place(drag.node, drag.item.kind ? drag.item : elGeom(drag.item)); if (hasIps(drag.item)) placeDevIps(drag.item); placeEqIps(drag.item); if (isUnit(drag.item) || isSkyV(drag.item)) placeUnitParts(drag.item); if (drag.item.kind === 'ip' || hasIps(drag.item) || eqPorts(drag.item).length || isUnit(drag.item) || isSkyV(drag.item)) renderPipes(); }
  else if (drag.mode === 'point') { drag.item.points[drag.i] = [snap(p[0]), snap(p[1])]; renderPipes(); }
  else if (drag.mode === 'pipe') { movePipe(drag, dx, dy); for (const q of drag.carry) { const n = $(`#ws .gfx.ip[data-gid="${CSS.escape(q.g.id)}"]`); if (n) place(n, q.g); } renderPipes(); }
});
window.addEventListener('pointerup', () => {
  cancelLongPress();
  if (drag?.mode === 'move' && drag.item.kind === 'ip' && !isFitting(drag.item)) attachIp(drag.item);
  if (drag?.mode === 'move' && drag.moved) {      // a free Tab_Fitting (or its Start IP) dropped on a vessel port joins it
    const f = isBfit(drag.item) ? drag.item : drag.item.kind === 'ip' && drag.item.port === 'start' ? draft.graphics.find(x => x.id === drag.item.attachTo && isBfit(x)) : null;
    if (isUnit(f) && f.onVessel && drag.item === f) unjoinUnit(f);      // a Skynet Fitting dragged off its vessel port comes off it (dropped back on, it joins again)
    if (f && !f.onVessel && !isCapOnly(f)) { joinFitting(f); renderWs(); }
    if (isCap(drag.item)) { snapCap(drag.item); renderWs(); }
  }
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
  const unit = hitUnit && findItem('gfx', hitUnit);
  if (pip) pip.dataset.eq ? editItem('gfx', pip.dataset.eq) : editItem('el', pip.dataset.dev);
  else if (node && unit && [unit.id, bundleOf(unit)?.id].includes(node.dataset.gid)) editItem('gfx', unit.id);   // the pointer was caught by its vessel
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
// Fritz, 2026-10-22: Help opens in a window of its own, so it can sit beside the panel while you follow it.
// There is one Help window: asking again shows the new page in it. Only when the browser blocks the window does Help show
// on the panel's own Help page (`quiet`: without saying so, for a phone's long press, which browsers never let open a window).
const HELP_WIN = 'skynetHelp';
let helpBlockedSaid = false;
function helpWindow([page, section] = []) {
  const url = (trail = []) => '/help.html' + (page ? '?page=' + encodeURIComponent(page) + (section ? '&section=' + encodeURIComponent(section) : '') : '')
    + (trail.length ? (page ? '&' : '?') + 'trail=' + encodeURIComponent(trail.join(',')) : '');
  const sw = screen.availWidth || 1200, sh = screen.availHeight || 800, w = Math.min(900, Math.max(480, Math.round(sw * 0.42)));
  const where = (p = { w, h: sh - 60, x: (screen.availLeft || 0) + sw - w, y: screen.availTop || 0 }) => `width=${p.w},height=${p.h},left=${p.x},top=${p.y}`;
  let win = null;
  try { win = window.open('', HELP_WIN, where()); } catch { }      // the Help window if it is open, else a new empty one
  if (!win) return false;
  let keep = null;
  try { keep = win.skynetHelpKeep?.(); } catch { }
  if (keep?.busy) { win.skynetHelp(page, section); win.focus(); return true; }      // a page being edited is never closed
  if (keep) {
    // Fritz, 2026-10-22: clicking the panel puts it in front of the Help window, and browsers won't bring that window back
    // (focus() is ignored). So the open Help window is closed and opened again, on top, where it was, with its ◀ Back list.
    win.close();
    try { win = window.open(url(keep.trail), HELP_WIN, where(keep.place)); } catch { win = null; }
    return !!win;
  }
  win.location.href = url(); win.focus();      // a new window (or one still loading)
  return true;
}
function openHelp(topic, quiet = false) {
  if (!quiet && helpWindow(topic || undefined)) return;
  if (!quiet && !helpBlockedSaid) { helpBlockedSaid = true; toast('The browser blocked the Help window, so Help is shown here. Allow pop-ups for the panel to read Help beside it.', true); }
  setView('help', true);
  window.dispatchEvent(new CustomEvent('skynet-help', { detail: topic }));
}
// Help for what is showing: the Menu tab that is open, else the page you are on
const pageTopic = () => view === 'workspace' && menuTab ? menuTopic(menuTab, '') || ['menu'] : viewTopic(view);
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
  helpPress = { x: ev.clientX, y: ev.clientY, t: setTimeout(() => { helpPress = null; helpShownAt = Date.now(); openHelp(hit.kind === 'el' ? elementTopic(hit.item) : graphicTopic(hit.item), true); }, 700) };
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
  const riders = lockedRiders(pipe); if (riders.length) return lockedDrag(pipe, p, riders);
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
  pump: { type: 'digitalOut', subtype: 'pump', ipIn: 'left', ipOut: 'right', w: 140, h: 110, imageOn: 'Images/Skynet/Pumps/Pump_Red_Rip_On.png', imageOff: 'Images/Skynet/Pumps/Pump_Red_Rip_Off.png', hideValue: true, tap: 'toggle', confirm: true, onText: 'ON', offText: 'OFF' },
  // analogOut when that output type is installed (its fields exist), otherwise a vKonstant value holding 0-100 %
  get propValve() {
    const look = { subtype: 'propValve', ipIn: 'left', ipOut: 'right', w: 90, h: 70, hideName: true, imageOn: 'Images/Skynet/Valves/Valve_Motor_Ball_OpenH.svg', imageOff: 'Images/Skynet/Valves/Valve_Motor_Ball_ClosedH.svg' };
    return F.analogOut ? { type: 'analogOut', signal: '0-10V', rangeLow: 0, rangeHigh: 100, units: '%', precision: 0, ...look }
      : { type: 'vKonstant', kind: 'value', initial: '0', min: 0, max: 100, step: 5, units: '%', precision: 0, retain: true, ...look };
  },
  valve: { type: 'digitalOut', subtype: 'valve', ipIn: 'top', ipOut: 'bottom', w: 64, h: 55, imageOn: 'Images/Skynet/Valves/Valve_Motor_Ball_OpenV_RC.svg', imageOff: 'Images/Skynet/Valves/Valve_Motor_Ball_ClosedV_RC.svg', hideName: true, hideValue: true, tap: 'toggle', onText: 'OPEN', offText: 'CLOSED' },
};
// Arduino Mega 2560 pin lists for the pin picker. Analog pins are shown as A0-A15 with BruControl's number (54-69); either can be typed.
(() => {
  const an = [...Array(16).keys()].map(i => [`A${i}`, `A${i} = pin ${54 + i} (BruControl)`]);
  const tagged = i => [String(i), `D${i}` + (pinTag(i) ? `  (${pinTag(i)})` : '')];      // D5 (PWM), D2 (PWM + Counter), D18 (Counter)
  const dig = [...Array(54).keys()].map(tagged);
  const lists = { analog: an, digital: [...dig, ...an], pwm: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 44, 45, 46].map(tagged), interrupt: [2, 3, 18, 19, 20, 21].map(tagged) };
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
    ['DIN / Pulse button (one short ON per press, even if held; 3 s lockout)', 'digitalIn', 'Pulse', { mode: 'momentary', pulse: 100, lockout: 3000 }],
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
    ['NTC thermistor 10K, Beta 3950 (analog pin)', 'temperature', 'Temp', { sensor: 'ntc', r0: 10000, beta: 3950, series: 10000 }],
    ['NTC thermistor 10K, BCS-462 / BruControl type, Beta 3977 (analog pin)', 'temperature', 'Temp', { sensor: 'ntc', r0: 10000, beta: 3977, series: 10000 }],
    ['NTC thermistor 50K, Beta 3950 (analog pin)', 'temperature', 'Temp', { sensor: 'ntc', r0: 50000, beta: 3950, series: 50000 }],
    ['NTC thermistor 100K, Beta 3950, 3D printer type (analog pin)', 'temperature', 'Temp', { sensor: 'ntc', r0: 100000, beta: 3950, series: 100000 }],
    ['LM35 analog temperature sensor (10 mV per °C)', 'temperature', 'Temp', { sensor: 'lm35' }],
    ['TMP36 analog temperature sensor (10 mV per °C, 0.5 V at 0 °C)', 'temperature', 'Temp', { sensor: 'tmp36' }],
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
  toBuild();          // Fritz, 2026-10-22: new things are made on the clean Build Tab first
  const [gi, ii] = $('#addType').value.split(':').map(Number);
  const [, pick, prefix, extra] = ADD_MENU[gi][1][ii], preset = PRESETS[pick], type = preset ? preset.type : pick, kind = extra?.kind;
  const e0 = { type, kind }; let i = 1, base = prefixOf(e0) ? prefixOf(e0) + 'New' : (prefix || type) + '_';
  while (draft.elements.some(e => e.name === base + i)) i++;
  const D = TD();      // the Default tab: where new things go, and a Label's size (it is a text box)
  const e = { name: base + i, type, workspace: wsName, x: D.x, y: D.y, w: type === 'label' ? D.width : type === 'flowMeter' || type === 'stepper' ? 190 : 130, h: type === 'timer' ? 80 : type === 'label' ? D.height : 60, ...clone(preset || {}), ...clone(extra || {}) };
  if (!D.visible) e.visibility = 'hidden';
  if (D.wrap) e.wrap = true;
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
  if (['digitalOut', 'digitalIn', 'switch', 'picture'].includes(type) && !e.imageOn && !e.imageOff) { e.imageOn = 'Images/Skynet/Lights_LEDs/led_green.svg'; e.imageOff = 'Images/Skynet/Lights_LEDs/led_red.svg'; }
  if (isDevice(e) && !(await newDeviceDialog(e, prefix))) return;
  if (pick === 'valve' && S.valveProfiles?.length && !(await useValveProfile(e))) return;
  useTabProfile(e);
  stackNew(e);
  draft.elements.push(e); sel = { kind: 'el', id: e.name }; renderWs(); editItem('el', e.name);
});
// Fritz, 2026-10-23: a new Device is made as in BruControl: 1 Interface, 2 Port, 3 Device Type (more than one type may share a port),
// then its Label; Create puts it on the Build Tab (always, Fritz: the same as a new Widget or Template) and opens its Properties.
// 💾 Save Build puts it on a Tab, and its name gets that Tab's ID then. Its name is suggested from them: InterfaceID_Port_DeviceTypeID_ParsedLabel__TabID, e.g. MB_25_P_L_Vlv_Fly_Sparge__SP (public/naming.js). An Admin may
// type another name; it must be unique and has no spaces. Only one Device per port of an Interface, except outputs of different Device Types (the last one turned on wins).
const ifaceIdOf = dev => (S.config.devices || []).find(d => d.name === dev)?.id || '';
const tabIdOf = tab => L().workspaces.find(w => w.name === tab)?.id || '';
const ANALOG_TEMP = ['ntc', 'lm35', 'tmp36'];      // temperature sensors on an analog pin
const isOneWire = e => e.type === 'temperature' && (!e.sensor || e.sensor === 'ds18b20');
// the port as written in the name (Fritz: always in it): the pin, OW3 for OneWire probe 3, ADS0 for ADS1115 channel 0, the first DT pin of a scale
function portForName(e) {
  if (isOneWire(e)) return oneWirePort(e.probeIndex);      // virtual port 700-799 (Fritz, 2026-10-23)
  if (e.type === 'analogIn' && e.adc === 'ads1115') return e.channel === undefined || e.channel === '' ? '' : 'ADS' + e.channel;
  const pin = String(e.channel ?? '').split(',')[0].trim(), a = /^A(\d{1,2})$/i.exec(pin);
  return a && +a[1] <= 15 ? String(54 + +a[1]) : pin;      // analog pins as BruControl numbers them: A5 = 59 (Fritz, 2026-10-23)
}
// a name still used by something else (an older Device, a Widget) gets _2, _3 ... after the Label
const deviceSuggestion = (e, self = e) => uniqueName(suggestName({ iface: ifaceIdOf(e.device), port: portForName(e), code: e.typeCode, label: e.displayName, tab: tabIdOf(e.workspace) }), n => nameTaken(n, self));
const autoNamed = new WeakSet();      // new Devices whose name still follows the suggestion (until the layout is saved)
const PIN_LIST = { pwmOut: 'pwm', analogOut: 'pwm', analogIn: 'analog', flowMeter: 'interrupt' };
// a name used by another Device or Widget (any capitals)
const nameTaken = (n, self) => (draft || S.config).elements.some(x => x !== self && x.name.toLowerCase() === n.toLowerCase());
const pinsOf = e => portKeys(e).map(k => k.split('|')[1]);
function portError(e, self) {
  const els = (draft || S.config).elements.filter(x => x !== self), c = portClash(e, els);
  if (c) return `Port ${c.pin} on ${ifaceIdOf(c.device) ? ifaceIdOf(c.device) + '_ ' : ''}${c.device} is already used by ${c.other}. Only outputs of different Device Types can share a port.`;
  const b = busCheck(e, els, S.config.devices);      // RTD / thermocouple SPI pins, the OneWire data pin, few PWM and counter pins (Fritz, 2026-10-23)
  if (b?.error) return b.error;
  const pin = pinsOf(e).find(Boolean);
  if (b?.warn && !confirm(b.warn + `\n\nOK = use pin ${pin} anyway.  Cancel = go back and pick another pin.`)) return b.pin ? `Pick another pin, for example pin ${b.pin}.` : 'Pick another pin.';
  return null;
}
async function newDeviceDialog(e, hint) {
  const devs = S.config.devices || [];
  const work = { displayName: '', device: e.device ?? (devs.length === 1 ? devs[0].name : undefined), channel: e.channel, probeIndex: e.probeIndex, typeCode: e.typeCode || defaultCode(e, hint), workspace: e.workspace, type: e.type, sensor: e.sensor, adc: e.adc };
  const port = isOneWire(e) ? ['probeIndex', 'OneWire probe number (Devices page > OneWire probe index)', 'probe']
    : e.type === 'analogIn' && e.adc === 'ads1115' ? ['channel', 'ADS1115 channel (0-3)', 'num']
      : e.type === 'scale' ? ['channel', 'HX711 DT pin(s), comma between several boards (e.g. 26, 28)', 'text']
        : ['channel', e.type === 'stepper' ? 'STEP pin (the other pins are set in its properties)' : 'Port (pin, e.g. 25 or A5)', 'pin', PIN_LIST[e.type] || (ANALOG_TEMP.includes(e.sensor) ? 'analog' : 'digital')];
  const fields = [['device', '1. Interface (board)', 'dev'],
    ['typeCode', '2. Device Type', 'sel', typeCodes(e).map(([c, l]) => [c, `${c}   ${l}`])],
    [port[0], '3. ' + (port[2] === 'pin' && e.type !== 'stepper' ? 'Available Ports / Pins' : port[1]), ...port.slice(2, 3), ...(port[2] === 'pin' ? ['free'] : port.slice(3))],
    ['displayName', 'Label (Display name shown on the tab, e.g. Fly Sparge)', 'text'],
    ['name', 'Suggested Name (you may type your own)', 'text']];
  const body = $('#dlgBody'), oks = $$('#dlg button[value="ok"]');
  for (const b of oks) b.textContent = 'Create';
  try {
    for (;;) {
      let last = deviceSuggestion(work), touched = !!work.name && work.name !== last;
      const shown = dialog('New Device', fields, work, false);
      const nameBox = body.querySelector('[data-k="name"]');
      if (!touched) nameBox.value = last;
      // the Port list: only the free pins on this Interface that fit this Device Type, best first (Fritz, 2026-10-23)
      const free = h('datalist', { id: 'pins-free' }); body.append(free);
      const fillFree = w => free.replaceChildren(...(w.device ? freePins({ ...e, ...w, name: '\0new' }, (draft || S.config).elements.filter(x => x !== e), S.config.devices, port[3] === 'analog') : []).map(p => { const t = /^A/.test(p) ? `A${p.slice(1)} = pin ${54 + +p.slice(1)} (BruControl)` : `D${p}` + (pinTag(p) ? `  (${pinTag(p)})` : ''); return h('option', { value: p, label: t }, t); }));
      fillFree(work);
      body.oninput = body.onchange = ev => {
        if (ev.target === nameBox) { touched = nameBox.value.trim() !== '' && nameBox.value !== last; return; }
        const w = { ...work }; try { readFields(w, body); } catch { }
        fillFree(w);
        last = deviceSuggestion(w); if (!touched) nameBox.value = last;
      };
      if (await shown !== 'ok') return false;
      try {
        readFields(work, body);
        const sug = deviceSuggestion(work), name = noSpaces(work.name || sug);
        if (!name) throw new Error('Type a Label (or a Name)');
        const bad = elementNameError(name, 'Device'); if (bad) throw new Error(bad);
        if (nameTaken(name, e)) throw new Error(`The name ${name} is already used. Device names must be unique.`);
        const err = portError({ ...e, ...work, name }, e); if (err) throw new Error(err);
        for (const k of ['displayName', 'device', 'channel', 'probeIndex', 'typeCode']) if (work[k] === undefined || work[k] === '') delete e[k]; else e[k] = work[k];
        e.name = name;
        if (name === sug) autoNamed.add(e);
        // Fritz, 2026-10-23: a DIN push button gives one trigger per press, however long it is held, and a second press within 3 s does nothing
        if (e.type === 'digitalIn' && work.typeCode === 'DIN') { e.mode = 'momentary'; e.pulse ??= 100; e.lockout ??= 3000; }
        if (e.type === 'digitalIn' && work.typeCode === 'Float') e.mode = 'switch';       // true while the float is made, false when not
        return true;
      } catch (err) { toast(err.message, true); work.name = noSpaces(work.name || ''); }
    }
  } finally { body.oninput = body.onchange = null; for (const b of oks) b.textContent = 'Save'; }
}
// Fritz, 2026-10-23: as in BruControl, several new things made at the same spot stack down and to the right instead of hiding each other
function stackNew(e) {
  const at = (x, y) => draft.elements.some(o => o.workspace === e.workspace && o.x === x && o.y === y);
  for (let n = 0; n < 50 && at(e.x, e.y); n++) { e.x += 20; e.y += 20; }
}
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
// a new Text starts with the Default tab's size, place, Visible and Word wrap (copied now; colors and alignment follow the Default)
$('#addText').onclick = () => {
  const D = TD(), g = { id: newId(), kind: 'text', workspace: wsName, x: D.x, y: D.y, w: D.width, h: D.height, text: 'Text', fontSize: 18, ...(D.visible ? {} : { visible: false }), ...(D.wrap ? {} : { wrap: false }) };
  draft.graphics.push(g); giveName(g, draft.graphics); renderWs(); editItem('gfx', g.id);
};
$('#finishPipe').onclick = () => finishPipe();
// Lock / Unlock the selected item so it cannot be dragged or resized by accident
function updLockBtn() {
  const b = $('#lockItem'); if (!b) return;
  const item = editing && sel ? findItem(sel.kind, sel.id) : null;
  b.disabled = !item; b.textContent = item?.locked ? '🔓 Unlock' : '🔒 Lock';
}
// Lock holds in Edit layout too (Fritz, 2026-10-22): only unlocked items move. An unlocked item also stays put when moving it
// would carry or bend a 🔒 locked one: a vessel's ports and joined fittings, a straight pipe's own end couplings, a pipe or hose joined to it.
const lockName = o => o.name || o.label || (o.kind === 'pipe' ? (o.hose ? 'a hose' : 'a pipe') : o.kind === 'ip' ? 'an IP' : 'an item');
function lockedRiders(item) {
  const out = [], add = g => { if (g?.locked && g !== item && !out.includes(g)) out.push(g); };
  if (item.kind === 'pipe') { if (item.straight) for (const k of ['from', 'to']) add(ownCoupling(item[k], item)); return out; }
  const parts = item.kind === 'vessel' ? bundleParts(item) : [];
  parts.forEach(add);
  const ids = item.kind ? [item.id, ...eqPorts(item).map(q => q.id), ...parts.map(g => g.id)] : hasIps(item) ? devIps(item).map(q => q.id) : [];
  for (const id of ids) for (const pp of pipesOn(id, item.workspace)) { add(pp); if (pp.straight) add(ownCoupling(pp.from === id ? pp.to : pp.from, pp)); }
  return out;
}
function lockedDrag(item, p, riders) {
  const names = riders?.slice(0, 3).map(lockName).join(', ') + (riders?.length > 3 ? ` and ${riders.length - 3} more` : '');
  const why = riders ? `🔒 ${lockName(item)} can't move: ${names} ${riders.length > 1 ? 'are' : 'is'} locked and would move with it. Unlock ${riders.length > 1 ? 'them' : 'it'} first (🔓 Unlock, or 🔓 Unlock All).`
    : `🔒 ${lockName(item)} is locked in place. Press 🔓 Unlock (or 🔓 Unlock All) to move it.`;
  return { mode: 'locked', item, start: p, why };
}
// an Equipment Profile that is locked owns the equipment, IPs and pipes on its Tab: their lock can't change either
function profileFrozen(o) {
  if (!['vessel', 'ip', 'pipe'].includes(o?.kind)) return null;
  const w = draft.workspaces.find(x => x.name === o.workspace);
  return w && w.layoutFromProfile !== false ? S.profiles?.find(p => p.id === w.equipmentProfile && p.locked) : null;
}
const setLock = (o, on) => { if (on) o.locked = true; else delete o.locked; };
$('#lockItem').onclick = () => {
  const item = sel && findItem(sel.kind, sel.id); if (!item) return toast('Select an item first', true);
  const frozen = profileFrozen(item); if (frozen) return toast(`🔒 The Equipment Profile "${frozen.name}" of this Tab is locked, so its equipment, IPs and pipes can't change.`, true);
  const on = !item.locked;
  for (const g of [item, ...(item.kind === 'vessel' ? bundleParts(item) : [])]) setLock(g, on);   // a vessel's ports and joined fittings go with it
  toast(on ? 'Locked in place' : 'Unlocked'); renderWs(); updLockBtn();
};
// 🔒 Lock All / 🔓 Unlock All (Fritz, 2026-10-22): actions, not a switch. Every item on this Tab is locked (or unlocked) once;
// after that each one can still be unlocked (or locked) by itself with the 🔒 Lock button.
function lockTab(on) {
  const mine = o => o.workspace === wsName;
  let n = 0, kept = 0;
  for (const o of [...draft.elements.filter(mine), ...draft.graphics.filter(mine)]) {
    if (!!o.locked === on) continue;
    if (profileFrozen(o)) { kept++; continue; }
    setLock(o, on); n++;
  }
  toast((n ? `${on ? '🔒 Locked' : '🔓 Unlocked'} ${n} item${n === 1 ? '' : 's'} on "${wsName}". Save layout keeps it.` : `Everything on "${wsName}" was already ${on ? 'locked' : 'unlocked'}.`)
    + (kept ? ` ${kept} item${kept === 1 ? '' : 's'} of the locked Equipment Profile stayed as ${kept === 1 ? 'it was' : 'they were'}.` : ''));
  renderWs(); updLockBtn();
}
$('#lockAll').onclick = () => lockTab(true);
$('#unlockAll').onclick = () => lockTab(false);
$('#drawPipe').onclick = () => { stopDrawing(); drawPts = []; $('#ws').classList.add('drawing'); $('#editHint').textContent = 'Double-click (or tap) where the pipe starts: on an IP, or anywhere. Pipes run straight across or up and down. Esc cancels.'; renderPipes(); };
$('#drawHose').onclick = () => { stopDrawing(); $('#finishPipe').classList.remove('hidden'); drawPts = []; drawHose = true; $('#ws').classList.add('drawing'); $('#editHint').textContent = 'Click the start IP (or any point), click a few points for the hose to bend through, then click the end IP. Double-click or Enter to finish, Esc to cancel. Loose ends get a coupling.'; renderPipes(); };
$('#addIpType').append(...Object.entries(FITTINGS).map(([k, t]) => h('option', { value: k }, t)));
$('#addVesselType').append(...Object.entries(VESSELS).map(([k, t]) => h('option', { value: k }, t)));
// a new equipment widget: made on the Build Tab, then Save Build ... puts it on a Tab (pipe fittings go on the Tab you are on)
function addVesselWidget(c) {
  const C = EQ[c];
  if (C.tab) toBuild();
  const tab = wsName;
  let i = 1; while (draft.graphics.some(g => g.kind === 'vessel' && g.name === C.title + ' ' + i)) i++;
  const n = draft.graphics.filter(g => eqClass(g) && g.workspace === tab).length;
  const g = { id: newId(), kind: 'vessel', vesselType: c, workspace: tab, x: 60 + (n % 5) * 280, y: 60 + Math.floor(n / 5) * 340, w: C.size[0], h: C.size[1],
    name: C.title + ' ' + i, vtype: C.types[0], label: C.types[0], image: C.image, labelAlign: 'above', labelSize: 16, labelVisible: true, ports: eqDefaultPorts(c), isNew: true };
  draft.graphics.push(g); sel = { kind: 'gfx', id: g.id }; renderTabs(); renderWs(); editItem('gfx', g.id);
}
$('#addVessel').onclick = () => {
  if (EQ[$('#addVesselType').value]) return addVesselWidget($('#addVesselType').value);
  toBuild();
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
  const id = defaultTabId(n, draft.workspaces.map(w => w.id));       // 2 letters, unique; changed in Tab settings
  draft.workspaces.push({ name: n, id, width: 1600, height: 900, ...(tp && tabProfileOf({ tabProfile: tp }) ? { tabProfile: tp } : {}) }); wsName = n; renderTabs(); renderWs();
  toast(`Tab ${n} added, Tab ID ${id} (change it in Tab settings)`);
};
$('#wsProps').onclick = () => editWorkspace();

// ---- Build Tab (Fritz, 2026-10-22): something new is made first on a clean Tab, not on a busy one. The Build Tab is only in
// the Edit layout draft (never saved) and shows only while you build. New Devices, Widgets and equipment go on it (Add element,
// Add equipment, a Template's Add to Tab > Build Tab). Save Build ... then puts it on a Tab, or saves it as a Template.
const buildWs = () => draft?.workspaces.find(w => w.build);
const buildItems = b => b ? [...draft.elements.filter(e => e.workspace === b.name), ...draft.graphics.filter(g => g.workspace === b.name)] : [];
// open the Build Tab (made if it is not there yet), the size of the Tab you came from
function toBuild() {
  if (!editing) return;
  let b = buildWs();
  if (!b) {
    const from = curWs(); let n = 'Build Tab', i = 2;
    while (draft.workspaces.some(w => w.name === n)) n = 'Build Tab ' + i++;
    b = { name: n, build: true, width: from?.width || 1600, height: from?.height || 900, from: from?.name };
    draft.workspaces.push(b);
  }
  if (wsName === b.name) return b;
  if (!curWs()?.build) b.from = wsName;           // Save Build ... offers this Tab first
  wsName = b.name; sel = null;
  $('#editHint').textContent = '🔨 Build Tab: build the new thing here (Add element, Add equipment, IPs, pipes), then press 💾 Save Build ... to put it on a Tab or save it as a Template.';
  renderTabs(); renderWs();
  return b;
}
$('#buildTab').onclick = () => toBuild();
$('#saveBuild').onclick = guard(saveBuild);
function dropBuild() {
  const b = buildWs(); if (!b) return;
  const gone = new Set(buildItems(b));
  draft.elements = draft.elements.filter(e => !gone.has(e)); draft.graphics = draft.graphics.filter(g => !gone.has(g));
  draft.workspaces = draft.workspaces.filter(w => w !== b);
  if (wsName === b.name) wsName = draft.workspaces.some(w => w.name === b.from) ? b.from : draft.workspaces[0]?.name;
  sel = null;
}
// a string value anywhere in these items that is exactly the old name gets the new one (pipes that flow when it is on, ...)
function swapName(items, from, to) {
  const walk = o => { for (const k of Object.keys(o)) { if (o[k] === from) o[k] = to; else if (o[k] && typeof o[k] === 'object') walk(o[k]); } };
  items.forEach(walk);
}
// To a Tab: everything moves there as it is (same size, same spots to each other), in the dead center of the Tab (Fritz, 2026-10-22)
function moveBuildTo(tab) {
  const b = buildWs(), to = draft.workspaces.find(w => w.name === tab && !w.build);
  if (!to) throw new Error(`There is no Tab "${tab}"`);
  const items = buildItems(b);
  centerOn(items, to);
  for (const x of items) x.workspace = to.name;
  for (const v of items.filter(x => x.buildFrom)) rebundle(v);
  // a new Device still named by the suggestion gets the Tab ID of its Tab at the end (MB_25_P_L_Vlv_Fly_Sparge__SP)
  for (const e of draft.elements.filter(e => items.includes(e) && autoNamed.has(e))) {
    const n = deviceSuggestion(e);
    if (n && n !== e.name && !nameTaken(n, e)) { swapName(items.filter(x => x !== e), e.name, n); e.name = n; }
  }
  draft.workspaces = draft.workspaces.filter(w => w !== b);
  wsName = to.name; sel = null;
  return items.length;
}
// shift these items as one so the box around them sits in the middle of the Tab (never off its top or left edge)
function centerOn(items, to) {
  const bx = [];
  for (const x of items) {
    if (x.kind === 'pipe') { for (const c of x.points || []) bx.push([c[0], c[1], c[0], c[1]]); continue; }
    const g = x.kind ? x : elGeom(x), X = g.x || 0, Y = g.y || 0;
    bx.push([X, Y, X + (g.w || 120), Y + (g.h || 60)]);
  }
  if (!bx.length) return;
  const x0 = Math.min(...bx.map(q => q[0])), y0 = Math.min(...bx.map(q => q[1])), x1 = Math.max(...bx.map(q => q[2])), y1 = Math.max(...bx.map(q => q[3]));
  const dx = Math.round(Math.max(0, ((to.width || 1600) - (x1 - x0)) / 2) - x0), dy = Math.round(Math.max(0, ((to.height || 900) - (y1 - y0)) / 2) - y0);
  for (const x of items) {
    if (x.kind === 'pipe') x.points = (x.points || []).map(c => [c[0] + dx, c[1] + dy]);
    else { x.x = (x.x || 0) + dx; x.y = (x.y || 0) + dy; }
  }
}
// what on the Build Tab can be a Template: one vessel (with the Bundled Fittings on its ports) or one Bundled Fitting
function buildTemplate(b) {
  const gs = draft.graphics.filter(g => g.workspace === b.name), els = draft.elements.filter(e => e.workspace === b.name);
  const vessels = gs.filter(g => g.kind === 'vessel' && !isBfit(g)), fits = gs.filter(isBfit);
  const owned = g => g.kind === 'ip' && g.attachTo && gs.some(v => v.id === g.attachTo && v.kind === 'vessel');
  const rest = gs.filter(g => g.kind !== 'vessel' && !owned(g));
  const one = 'A Template is one vessel (with the fittings on its ports) or one Bundled Fitting.';
  if (els.length || rest.length) return { why: `${one} Devices, Widgets, IPs, pipes, pictures and text can't go in a Template: save to a Tab, or delete them from the Build Tab first.` };
  if (vessels.length === 1 && VESSEL_KINDS[vessels[0].vesselType] && fits.every(f => f.onVessel === vessels[0].id)) return { kind: 'vessel', g: vessels[0], fits };
  if (!vessels.length && fits.length === 1) return { kind: 'fitting', g: fits[0] };
  return { why: vessels.length === 1 ? `A ${eqClass(vessels[0])?.title || 'pipe fitting'} can't be a Template. ${one}` : one };
}
// a Template Name from a name on a Tab: no spaces, only letters, digits, _ and -, and not taken
function tplNameFrom(n, kind) {
  const base = String(n || '').trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 60) || (kind === 'vessel' ? 'My_Vessel' : 'My_Fitting');
  return tplOf(kind, base) ? copyName(base, tplNames(kind)) : base;
}
const fitBody = f => ({ std: f.std, fittings: clone(f.fittings || []), image: f.image, ipPos: f.ipPos });
const sameFit = (f, t) => JSON.stringify(cleanFit(fitBody(f))) === JSON.stringify(cleanFit(fitBody(t)));
const cleanFit = b => ({ std: b.std || null, fittings: (b.fittings || []).map(x => ({ ...x })), image: b.image || '', ipPos: b.ipPos || null });
async function makeTemplate(kind, name, skynet, body) {
  await api('POST', `/ui/templates/${kind}`, { name, skynet: TPL.locked ? false : !!skynet });
  const r = await api('PUT', `/ui/templates/${kind}/${name}`, { ...body, name });
  setTPL(r);
  return r;
}
// As a Template: a Tab_Vessel becomes a Vessel Template. A Bundled Fitting on one of its ports that is still the same as its
// Template is used as it is; one that was changed on the Build Tab is saved as a Bundled Fitting Template of its own first.
async function saveBuildTemplate({ name, skynet }) {
  const b = buildWs(), w = buildTemplate(b);
  if (!w.kind) throw new Error(w.why);
  name = String(name || '').trim();
  const bad = nameProblem(name); if (bad) throw new Error(bad);
  if (tplOf(w.kind, name)) throw new Error(`There is already a ${TEMPLATE_KINDS[w.kind]} called "${name}"`);
  const made = [];
  if (w.kind === 'fitting') { await makeTemplate('fitting', name, skynet, fitBody(w.g)); made.push(name); }
  else {
    const g = w.g, t = { vesselType: g.vesselType, image: g.image, size: [Math.round(g.w), Math.round(g.h)], ports: {} };
    for (const k of ['vtype', 'otherType', 'units', 'volume', 'deadspace', 'extraTrub', 'maxVolume', 'minVolume', 'heatKind', 'otherHeat', 'std', 'notes']) if (g[k] !== undefined && g[k] !== '') t[k] = clone(g[k]);
    if (EQ[g.vesselType]?.ports.in2) t.liquidPorts = g.ports?.in2?.installed ? 4 : 2;
    for (const [k, p] of Object.entries(g.ports || {})) t.ports[k] = { installed: !!p.installed, position: p.position };
    for (const f of w.fits) {
      const q = t.ports[f.onPort]; if (!q || !FITTING_PORTS[f.onPort]) continue;
      let ft = tplOf('fitting', f.template);
      if (!ft || !sameFit(f, ft)) {
        const fn = tplNameFrom(f.name, 'fitting');
        await makeTemplate('fitting', fn, skynet, fitBody(f)); made.push(fn); ft = tplOf('fitting', fn);
      }
      Object.assign(q, { installed: true, fitting: ft.name, bundleName: f.name });
    }
    await makeTemplate('vessel', name, skynet, t); made.unshift(name);
  }
  dropBuild();
  return made;
}
// Save Build ...: where does it go? To a Tab, as a Template, thrown away, or keep building. True when the Build Tab is done.
async function saveBuild() {
  const b = buildWs(); if (!b) return true;
  // an item un-bundled to the Build Tab: back where it came from (same Tab, spot and size), or saved like a new build
  for (const v of draft.graphics.filter(g => g.workspace === b.name && g.buildFrom)) {
    const to = draft.workspaces.find(w => w.name === v.buildFrom.tab && !w.build);
    if (to && confirm(`Put ${v.label || v.name} back where it came from?\n\nOK = Yes: back on the ${to.name} tab, in the same spot and at the same size, bundled again.\nCancel = No: save it like a new build. Pick a Tab and it goes there at the size it is now, in the middle of the Tab.`)) {
      putBack(v, to); wsName = to.name;
      toast(`${v.label || v.name} is back on the ${to.name} tab, bundled. Press Save layout to keep it.`, false, 8000);
    }
  }
  if (!buildItems(b).length) { const back = wsName; dropBuild(); if (draft.workspaces.some(w => w.name === back)) wsName = back; renderTabs(); renderWs(); return true; }
  if (!TPL) await loadTemplates();
  const r = await saveBuildDialog(b); if (!r) return false;
  if (r.to === 'trash') {
    const came = draft.graphics.filter(g => g.workspace === b.name && g.buildFrom).map(g => `${g.label || g.name} (from the ${g.buildFrom.tab} tab)`);
    if (!confirm('Throw away everything on the Build Tab?' + (came.length ? `\n\nThis also deletes ${came.join(', ')}.` : ''))) return false;
    dropBuild(); toast('The Build Tab was thrown away');
  } else if (r.to === 'tab') {
    const n = moveBuildTo(r.tab);
    toast(`${n} item${n === 1 ? '' : 's'} moved to the middle of the ${r.tab} tab. Drag ${n === 1 ? 'it' : 'them'} to ${n === 1 ? 'its' : 'their'} place, then press Save layout.`, false, 8000);
  } else {
    const made = await saveBuildTemplate(r);
    toast(`Saved as ${made.length > 1 ? 'Templates' : 'a Template'}: ${made.join(', ')}. ☰ Menu > ${r.kind === 'fitting' ? 'Fitting' : 'Vessel or Equipment'} Templates, Add to Tab puts it on a Tab.`, false, 9000);
  }
  renderTabs(); renderWs();
  return true;
}
function saveBuildDialog(b) {
  return new Promise(res => {
    const tabs = draft.workspaces.filter(w => !w.build), tk = buildTemplate(b);
    const d = h('dialog', { class: 'tplMini buildDlg' });
    const close = v => { d.close(); d.remove(); res(v); };
    const tabSel = h('select', {}, ...tabs.map(w => h('option', { value: w.name, ...(w.name === b.from ? { selected: true } : {}) }, w.name)));
    const tplBox = h('div', { class: 'buildOpt' }, h('b', {}, 'As a Template'));
    if (tk.kind) {
      const nm = h('input', { type: 'text', value: tplNameFrom(tk.g.name || tk.g.label, tk.kind) }), sky = h('input', { type: 'checkbox', checked: true });
      tplBox.append(h('p', { class: 'muted' }, `A ${tk.kind === 'vessel' ? (tk.g.vesselType === 'vessel' ? 'Vessel' : 'Equipment') + ' Template' : 'Bundled Fitting Template'}, in ☰ Menu. Name: no spaces (use _ instead), and it must be unique.`),
        h('label', {}, 'Template Name ', nm),
        TPL.locked ? '' : h('label', { class: 'toggle' }, h('span', { class: 'sw' }, sky, h('span', { class: 'swk' })), ' Skynet Template (off = a User Template)'),
        h('div', { class: 'bar' }, h('button', { class: 'primary', onclick: () => close({ to: 'template', kind: tk.kind, name: nm.value, skynet: sky.checked }) }, 'Save as Template')));
    } else tplBox.append(h('p', { class: 'muted' }, tk.why));
    d.append(h('h3', {}, 'Save Build: where should it go?'),
      h('div', { class: 'buildOpt' }, h('b', {}, 'To a Tab'),
        h('p', { class: 'muted' }, 'Everything on the Build Tab moves to the middle of this Tab, at the size it is now. Drag it to its place, then press Save layout.'),
        h('div', { class: 'bar' }, tabSel, h('button', { class: 'primary', onclick: () => close({ to: 'tab', tab: tabSel.value }) }, 'Save to Tab'))),
      tplBox,
      h('div', { class: 'bar' }, h('button', { class: 'danger', onclick: () => close({ to: 'trash' }) }, 'Throw it away'), h('span', { class: 'spacer' }), h('button', { onclick: () => close(null) }, 'Keep building')));
    d.oncancel = ev => { ev.preventDefault(); close(null); };
    document.body.append(d); d.showModal();
  });
}
// a rename on top of a rename (A -> B -> C) is one rename A -> C; back to the first name is no rename
function noteRename(from, to) {
  const first = [...draftRenames].find(([, now]) => now === from)?.[0] ?? from;
  if (!S.config.elements.some(e => e.name === first)) return;     // added in this Edit layout: nothing uses it yet
  if (first === to) draftRenames.delete(first); else draftRenames.set(first, to);
}
// what Save tells you about the Processes that follow a renamed Device or Widget
function renameNote(r) {
  if (!r?.renamed?.length) return '';
  const ps = r.processes || [], run = ps.filter(p => p.running).map(p => p.name);
  let t = ps.length ? ` Renamed in ${ps.length} Process${ps.length > 1 ? 'es' : ''}: ${ps.map(p => p.name).join(', ')}.` : ' No Process used the old name.';
  if (run.length) t += ` Restart ${run.join(', ')} to use the new name.`;
  if (r.otherSchemas?.length) t += ` Note: ${r.otherSchemas.map(o => `Schema ${o.schema} still has ${o.name}`).join('; ')}.`;
  return t;
}
const saveLayout = guard(async () => {
  if (!(await saveBuild())) return;           // the Build Tab is never saved: what is on it goes to a Tab or a Template first
  const renames = [...draftRenames].map(([from, to]) => ({ from, to }));
  const r = await api('PUT', '/ui/layout', { workspaces: draft.workspaces, elements: draft.elements, graphics: draft.graphics, renames, updateVersion: $('#updateVersion').checked });
  const note = renameNote(r);
  toast((r?.version ? `Layout saved. New Schema version: ${r.version}` : 'Layout saved') + note, false, note ? 9000 : 0); editing = false; await load(); setEditing(false);
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
const menuBarHidden = () => view === 'workspace' && !menuTab && menuBarHides() && !document.body.classList.contains('menuBarOn');
// Fritz, 2026-10-21: only the Tabs themselves lose the Menu Bar; every Menu tab (Zoom, Default, About ...) and every other page keeps it
function markOnTabs() { document.body.classList.toggle('onTabs', view === 'workspace' && !menuTab); document.body.classList.toggle('onWorkspace', view === 'workspace'); }
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
const TB_ALIGN_CHOICES = [['', 'Default'], ...TB_ALIGNS.map(a => [a, a + (a === 'Center' ? 'ed' : '') + ' justified'])];
// field: [key, label, kind, options]
const F = {
  common: [['name', 'Name', 'text'], ['displayName', 'Display name', 'text'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'lock'],
    ['background', 'Background picture (BruControl: background = 1, 2 or 3)', 'bgsel'], ['imagePath_1', 'imagePath_1 (a Process changes it: name.image = "path")', 'imgpath', 1],
    ['imagePath_2', 'imagePath_2', 'imgpath', 2], ['imagePath_3', 'imagePath_3', 'imgpath', 3], ['visibility', 'Visible (off = hidden on the Tab; a Process: name.visible = true)', 'vis'], ['hidden', 'Hidden, locked (on = stays hidden even when Visible is on; a Process: name.hidden = true)', 'bool'], ['hideName', 'Hide name', 'bool'], ['hideValue', 'Hide value / text', 'bool'], ['look', 'Look', 'sel', ['normal', 'led', 'lcd', 'dark', 'button', 'indicator']], ['digits', 'Digits shown (a Gauge; empty = as many as needed)', 'num'], ['fontSize', 'Value font size', 'num'],
    ['tap', 'When tapped', 'sel', ['default', 'none', 'toggle', ['hold', 'push button (ON only while held; outputs and switches)'], 'dialog', ['script', 'process'], ['workspace', 'tab']]], ['tapTarget', 'Tap target (element, process or tab; empty = itself)', 'text'], ['confirm', 'Ask before changing (ON / OFF buttons)', 'bool'],
    ['_tb', 'Text boxes (its Name and its Value). Default = the ☰ Menu > Default tab.', 'head'],
    ['foreColor', 'Fore color (all its text)', 'color'], ['backColor', 'Back color (behind all its text)', 'color'], ['align', 'Alignment (all its text)', 'sel', TB_ALIGN_CHOICES],
    ['wrap', 'Word wrap as needed (a long name goes onto more lines; off = one line, cut off with ...)', 'bool'],
    ['nameFontFamily', 'Name font', 'sel', FONTS], ['nameFontSize', 'Name font size (px; empty = Default)', 'num'],
    ['nameColor', 'Name color (over Fore color)', 'color'], ['nameBg', 'Name background color', 'color'], ['valueColor', 'Value color (over Fore color)', 'color'], ['valueBg', 'Value background color', 'color'],
    ['nameFont', 'Name font, more (JSON, e.g. {"bold":true,"italic":true})', 'json'], ['valueFont', 'Value font (JSON)', 'json'], ['nameAlign', 'Name alignment', 'sel', [['', '(default)'], 'TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight']], ['valueAlign', 'Value alignment', 'sel', [['', '(default)'], 'TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight']], ['border', 'Border', 'sel', ['default', 'hidden', 'visible']]],
  shared: [['dataType', 'Data type', 'sel', ['value', 'string', 'bool', 'time', 'datetime']], ['initial', 'Initial value', 'text'], ['precision', 'Decimals', 'num'], ['units', 'Units', 'gpick', 'units'], ['step', '+ / - step', 'num'], ['min', 'Lowest allowed', 'num'], ['max', 'Highest allowed', 'num'], ['readOnly', 'Read only on screen', 'bool'], ['retain', 'Keep value on restart', 'bool', true]],
  digitalOut: it => [['subtype', 'Kind (pumps and valves have IPs for pipes)', 'sel', [['plain', 'plain'], ['pump', 'pump'], ['valve', 'valve'], ['element', 'element (electric heating element)']], true], ...(it.subtype === 'valve' ? [['valveType', 'Valve type', 'sel', [['electric', 'Electro_Mechanical (switched by its pin)'], ['manual', 'Manual (turned by hand: a Process shows a pop-up and waits for Done)']]],
    ['orientation', 'Orientation (where its two pipe ends are)', 'sel', [['', '(by its shape)'], ['h', 'Horizontal'], ['v', 'Vertical'], ['l45', '45 degrees Left'], ['r45', '45 degrees Right']]],
    ['service', 'Service (what flows through it; a Gas valve can heat a vessel)', 'sel', [['', '(not set)'], ...Object.entries(VALVE_SERVICE)]], ['tapwater', 'Tap water valve (open = tap water flows, no pump needed)', 'bool'], ['tapwaterOut', 'Tap water flows out of (a tap water valve only; the other end is the tap)', 'sel', TAP_OUT]] : []), ['device', 'Device', 'dev'], ['channel', 'Pin (e.g. 22, or A5 = 59)', 'pin', 'digital'], ['activeLow', 'Invert (pin LOW = on)', 'bool'], ['oneShot', 'One-shot time in ms (0 = off)', 'num'], ['oneShotDirection', 'One-shot pulses OFF (off = pulses ON)', 'bool'], ['imageOn', 'Picture when on', 'gpick'], ['imageOff', 'Picture when off', 'gpick'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
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
  image: [['image', 'Image path', 'path'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'lock']],
  text: [['text', 'Text (codes like \\b bold, \\L large, \\n new line work here)', 'area'], ['visible', 'Visible', 'bool', true], ['hidden', 'Hidden, locked (on = stays hidden even when Visible is on)', 'bool'], ['fontSize', 'Font size', 'num'], ['font', 'Font', 'sel', FONTS], ['bold', 'Bold', 'bool'],
    ['color', 'Fore color', 'color'], ['backColor', 'Back color', 'color'], ['align', 'Alignment', 'sel', TB_ALIGN_CHOICES], ['wrap', 'Word wrap as needed (off = one line, cut off at the edge)', 'bool', true], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'lock']],
  inlineSides: [['ipIn', 'IN IP side', 'sel', SIDES], ['ipOut', 'OUT IP side', 'sel', ['right', 'left', 'top', 'bottom']]],
  propValve: [['imageOn', 'Image when open (above 0 %)', 'path'], ['imageOff', 'Image when closed (0 %)', 'path']],
  vessel: [['vesselType', 'Kind', 'sel', Object.keys(VESSELS).filter(k => !EQ[k])], ['image', 'Background picture path (empty = plain drawn vessel)', 'path'], ['label', 'Label', 'text'], ['labelVisible', 'Show label', 'yn', true], ['labelAlign', 'Label position', 'sel', LABEL_POS], ['labelColor', 'Label color', 'color'], ['labelBg', 'Label back color', 'color'], ['labelSize', 'Label size', 'num'],
    ['heater', 'Heater (element or burner output; glows when on)', 'elem'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'lock']],
  ip: [['fitting', 'Type', 'fit'], ['rotate', 'Turn (degrees)', 'sel', ['0', '45', '90', '135', '180', '225', '270', '315']], ['open', 'Manual valve is open', 'yn'], ['attachTo', 'Port on vessel (moves with it; set by dropping the IP on a vessel)', 'vessel'], ['label', 'Name / label (e.g. Red pump out, MLT in, Drain)', 'text'], ['labelVisible', 'Show label on screen', 'yn'], ['labelAlign', 'Label position', 'sel', ['below', 'above', 'top', 'center', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right']], ['labelColor', 'Label color', 'color'], ['labelBg', 'Label back color', 'color'], ['labelSize', 'Label size', 'num'],
    ['image', 'Background picture path (empty = drawn shape)', 'path'], ['text', 'Text on marker', 'text'], ['color', 'Color', 'color'], ['hideRun', 'Hide its label and picture too when not editing (the IP marker itself only shows in Edit layout)', 'yn'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'lock']],
  pipe: it => [['_about', 'In Skynet Brewery you can easily add interactive Pipes, Hoses, Pumps and Valves. If they are electro-mechanical (a pump or a powered valve), turning them on makes flow run from a source, through the inlet side of a pump, and out into the Pipe or Hose on its outlet side.', 'note'],
    ['label', 'Label', 'text'], ['from', 'Starts at IP (flow comes from here)', 'ip'], ['to', 'Ends at IP (flow goes to here)', 'ip'],
    ['sizeUnits', 'Size units', 'sel', [['in', 'Inch (SAE)'], ['mm', 'Metric (mm)']], true], ['size', it.hose ? 'Hose size' : 'Pipe size', 'sel', sizeChoices(it), true],
    ...(it.size === 'custom' ? [['sizeCustom', `Custom size (${it.sizeUnits === 'mm' ? 'mm' : 'inches, e.g. 1.5'})`, 'num']] : []),
    ['flowWhen', 'Only when ALL of these are on (optional; pumps and valves on the pipe count by themselves; Ctrl or Cmd-click to pick several)', 'multi'], ['reverse', 'Reverse flow direction', 'bool'],
    ['color', it.hose ? 'Hose color' : 'Pipe color', 'color'], ['flowColor', 'Flow color', 'color'],
    ['baseVisible', 'Show when nothing flows (off: the tab picture already shows it, so only the moving flow appears)', 'bool', true],
    ['workspace', 'Tab', 'ws'], ['locked', 'Lock position (no drag or resize)', 'lock']],
};
// the Vessel widget's settings: Position and Standard show once a port is set to Installed
F.vesselNew = it => [...(it.template ? [['_t', `Tab_Vessel, made from the Vessel Template ${it.template}. Changing it here does not change the Template.`, 'note']] : []), ['name', 'Name', 'text'], ['vtype', 'Type', 'vlist', it.vesselType + '.types'], ['label', 'Display Name (the only text on it; empty = the Type)', 'text'], ['image', 'Graphic (picture path)', 'path'],
  ...Object.entries(EQ[it.vesselType].ports).flatMap(([k, d]) => [['_' + k, d.name + (d.ip ? ' (IP)' : ' (not an IP)'), 'note'], [k + '_on', d.name + ' installed', 'yn', false, true],
    ...(it[k + '_on'] ? [[k + '_pos', d.name + ' position', 'vlist', it.vesselType + '.' + k], [k + '_std', d.name + ' Connection Standard', 'vlist', 'standard']] : [])]),
  ['_look', 'Display Name and place', 'note'], ['labelVisible', 'Show the Display Name', 'yn', true], ['labelAlign', 'Display Name position', 'sel', LABEL_POS], ['labelColor', 'Display Name color', 'color'], ['labelBg', 'Display Name back color', 'color'], ['labelSize', 'Display Name size (px; empty = the Name font size on the Default tab)', 'num'],
  ['workspace', 'Tab (pipes only join IPs on the same tab)', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'lock'],
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
  lm35: [['device', 'Device', 'dev'], ['channel', 'Analog pin (A0-A15, or BruControl 54-69)', 'pin', 'analog'], ['vref', 'Board voltage (5 for a Mega, 3.3 for an ESP32; empty = 5)', 'num']],
  tmp36: [['device', 'Device', 'dev'], ['channel', 'Analog pin (A0-A15, or BruControl 54-69)', 'pin', 'analog'], ['vref', 'Board voltage (5 for a Mega, 3.3 for an ESP32; empty = 5)', 'num']],
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
  let fs = fieldsOf(item);
  if (STATE_PICS.has(item.type) && !fs.some(f => f[0] === 'imageOn')) fs = [...fs, ...ONOFF_PICS];
  // every item with on / off pictures can also have an On overlay, offered right below them (not the Manual vessel widget)
  const at = fs.findIndex(f => f[0] === 'imageOff');
  return at < 0 || item.type === 'manual' ? fs : [...fs.slice(0, at + 1), OVERLAY_PIC, ...fs.slice(at + 1)];
}

function fieldsOf(item) {
  if (item.type === 'stepper') return stepperFields(item);
  if (item.type === 'alarm') return alarmFields(item);
  if (item.type === 'temperature') {
    const s = item.sensor || 'ds18b20';
    return [['sensor', 'Probe type', 'sel', ['ds18b20', 'pt100', 'pt1000', 'thermocouple', 'ntc', 'lm35', 'tmp36'], true], ...SENSOR_FIELDS[s] ?? [], ...TEMP_COMMON, ['info', 'Reading now', 'info']];
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
  else if (kind === 'vis') {      // Visible as a switch, kept as BruControl's visibility = visible / hidden
    input = h('label', { class: 'sw' }, h('input', { type: 'checkbox', 'data-k': key, 'data-kind': 'vis', ...(v === 'hidden' ? {} : { checked: true }) }), h('span', { class: 'swk' }));
  }
  else if (kind === 'lock') {      // Lock position: a small lock / unlock icon that toggles (Fritz), saved as true / false like any switch
    const cb = h('input', { type: 'checkbox', 'data-k': key, 'data-kind': 'bool', ...(v ? { checked: true } : {}) });
    const ic = h('span', { class: 'lkic' });
    const show = () => { ic.textContent = cb.checked ? '🔒' : '🔓'; tg.title = cb.checked ? 'Locked in place: click to unlock' : 'Unlocked: click to lock in place'; tg.classList.toggle('on', cb.checked); };
    const tg = h('label', { class: 'lktog' }, cb, ic);
    cb.addEventListener('change', show); show();
    input = tg;
  }
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
    const list = opts || 'onoff', pic = ['onoff', 'pictures', 'backgrounds', 'overlays'].includes(list);
    const named = new Map([...ONOFF_GRAPHICS, ...OVERLAY_GRAPHICS].map(([n, p]) => [p, n])), os = vList(list); if (v && !os.includes(v)) os.push(v);
    const pv = h('img', { class: 'gprev' + (v && pic && !isTint(v) ? '' : ' hidden'), ...(v && pic && !isTint(v) ? { src: media(v) } : {}), alt: '' });
    const s = h('select', { 'data-k': key, 'data-kind': kind, 'data-list': list });
    // the Group list beside it shows one picture group or All (it has no data-k, so it is never saved)
    const gk = list === 'sounds' ? 'sounds' : 'pictures', groups = groupChoices(gk === 'sounds', os);
    let g = lastGroup[gk] || ''; if (!groups.some(([n]) => n === g)) g = '';
    let src = gk === 'sounds' ? 'both' : srcPick();
    const fill = () => {
      const cur = s.value || v || '';
      s.replaceChildren(h('option', { value: '' }, '(none)'),
        ...os.filter(p => p === cur || isTint(p) || (inGroup(p, g) && inSource(p, src))).map(p => h('option', { value: p, ...(p === cur ? { selected: true } : {}) }, named.get(p) || p)), h('option', { value: '__add__' }, 'Add new ...'));
      s.value = cur;
    };
    fill();
    const gs = groups.length ? h('select', { class: 'gpickGroup', title: 'Show the pictures of one group, or All', onchange: ev => { ev.stopPropagation(); g = gs.value; keepGroup(gk, g); fill(); } },
      h('option', { value: '' }, 'All groups'), ...groups.map(([n, l]) => h('option', { value: n, ...(n === g ? { selected: true } : {}) }, l))) : null;
    s.addEventListener('change', () => { if (pic && s.value !== '__add__') { pv.classList.toggle('hidden', !s.value || isTint(s.value)); if (s.value && !isTint(s.value)) pv.src = media(s.value); } });
    const ss = gk === 'sounds' ? null : h('select', { class: 'gpickGroup', title: 'Show the Skynet pictures, your own, or both', onchange: ev => { ev.stopPropagation(); src = ss.value; keepGroup('src', src); fill(); } },
      ...SOURCES.map(([k, l]) => h('option', { value: k, ...(k === src ? { selected: true } : {}) }, l)));
    const ib = list === 'onoff' || pic || list === 'sounds' ? h('button', { type: 'button', class: 'gpickIcons', title: 'Pick from icons, like in Explorer', onclick: ev => { ev.preventDefault(); pickForSelect(s); } }, '🖼') : null;
    input = h('div', { class: 'gpick' }, ss, gs, s, ib, pv);
  }
  else if (kind === 'vlist') {     // a vessel list the user can add to
    const os = vList(opts); if (v && !os.includes(v)) os.push(v);
    input = h('select', { 'data-k': key, 'data-kind': kind, 'data-list': opts }, ...os.map(o => h('option', { value: o, ...(o === (v ?? os[0]) ? { selected: true } : {}) }, o)), h('option', { value: '__add__' }, 'Add new ...'));
  }
  else if (kind === 'sel') { const os = opts.map(o => Array.isArray(o) ? o : [o, o]); input = h('select', { 'data-k': key, 'data-kind': kind, ...(rerender === true ? { 'data-rerender': '1' } : {}) }, ...os.map(([o, l]) => h('option', { value: o, ...(String(v ?? os[0][0]) === o ? { selected: true } : {}) }, l))); }
  else if (kind === 'note') return [h('div', { class: 'full muted' }, label)];
  else if (kind === 'head') return [h('div', { class: 'full dlgHead' }, label)];      // a section heading inside a dialog
  else if (kind === 'ws') input = h('select', { 'data-k': key, 'data-kind': kind }, ...draft.workspaces.map(w => h('option', { value: w.name, ...(w.name === v ? { selected: true } : {}) }, w.name)));
  else if (kind === 'dev') input = h('select', { 'data-k': key, 'data-kind': kind }, h('option', { value: '' }, '(none)'), ...(S.config.devices || []).map(d => h('option', { value: d.name, ...(d.name === v ? { selected: true } : {}) }, d.id ? `${d.name}   (ID ${d.id}_)` : d.name)));      // Fritz: the full Interface name first
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
    else if (kind === 'vis') v = inp.checked ? undefined : 'hidden';
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
// Open / closed (on / off) pictures come in pairs (Fritz, 2026-10-22): picking one fills in its partner when a picture with the
// matching name exists, e.g. Valve_Manual_ClosedV_R.svg -> Valve_Manual_OpenV_R.svg. The orientation is the user's pick.
const PIC_PAIR = { imageOff: 'imageOn', imageOn: 'imageOff', imageClosed: 'imageOpen', imageOpen: 'imageClosed' };
const picPartner = p => { const swap = { Closed: 'Open', Open: 'Closed', closed: 'open', open: 'closed', Off: 'On', On: 'Off', off: 'on', on: 'off' };
  const file = p.split('/').pop(), m = file.match(/(Closed|Open|Off|On|(?<![A-Za-z])(?:closed|open|off|on))(?=[^a-z]|$)/);
  return m ? p.slice(0, p.length - file.length) + file.slice(0, m.index) + swap[m[1]] + file.slice(m.index + m[1].length) : null; };
function fillPicPair(body, sel) {
  const other = body.querySelector(`select[data-k="${PIC_PAIR[sel.dataset.k]}"][data-kind="gpick"]`), p = picPartner(sel.value);
  if (!other || !p || p === sel.value || !vList(other.dataset.list || 'onoff').concat(mediaPics).includes(p)) return;
  if (![...other.options].some(o => o.value === p)) other.insertBefore(h('option', { value: p }, p), other.lastChild);
  other.value = p; other.dispatchEvent(new Event('change'));      // shows its preview (does not bubble back here)
}
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
    else if (t.dataset?.kind === 'gpick' && PIC_PAIR[t.dataset.k] && t.value) fillPicPair(body, t);
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

const formSnap = () => JSON.stringify([...$$('#dlgBody input, #dlgBody select:not(.gpickGroup), #dlgBody textarea')].map(i => i.type === 'checkbox' ? i.checked : i.value));

// a bundled vessel: only Bundled and Tab can change; the whole bundle moves to the new tab as is
async function editBundle(v) {
  const work = { bundled: true, workspace: v.workspace, clone: false, locked: !!v.locked };
  const what = isBfit(v) ? 'Tab_Fitting' : v.template ? 'Tab_Vessel' : 'vessel';
  const r = await dialog(`${v.label || v.name} (bundled)`, [['_b', `This ${what} and its IPs are bundled: they move as one and can't be edited. Switch off Bundled to edit, move or delete them.`, 'note'],
    ['bundled', 'Bundled with its IPs', 'bool'], ['locked', 'Lock position (no drag or resize)', 'lock'], ['workspace', 'Tab (the whole bundle moves)', 'ws'],
    ['clone', `Clone: put a copy of this ${what} and its IPs next to it`, 'bool']], work, false, graphicTopic(v));
  if (r !== 'ok') return;
  readFields(work);
  if (work.clone) return cloneBundle(v);
  if (work.locked !== !!v.locked) {       // the same as the 🔒 Lock button: its ports and joined fittings go with it
    const frozen = profileFrozen(v);
    if (frozen) toast(`🔒 The Equipment Profile "${frozen.name}" of this Tab is locked, so its equipment, IPs and pipes can't change.`, true);
    else for (const g of [v, ...bundleParts(v)]) setLock(g, work.locked);
  }
  if (work.workspace && work.workspace !== v.workspace) {
    const old = v.workspace;
    for (const g of [v, ...bundleParts(v)]) g.workspace = work.workspace;
    const ids = [...bundleParts(v).map(g => g.id), ...eqPorts(v).map(q => q.id)];
    const piped = draft.graphics.some(p => p.kind === 'pipe' && p.workspace === old && (ids.includes(p.from) || ids.includes(p.to)));
    wsName = v.workspace;
    toast(`Moved the bundle to the ${v.workspace} tab.` + (piped ? ` Its pipes stayed on ${old}; draw new ones here.` : ''));
  }
  if (!work.bundled) {
    delete v.bundled;
    // Fritz (2026-10-22): before un-bundling, offer to take it to the Build Tab; its Tab, spot and size are remembered for Save Build ...
    if (!draft.workspaces.find(w => w.name === v.workspace)?.build && confirm(`Move ${v.label || v.name} to the 🔨 Build Tab to work on it?\n\nIts Tab, spot and size are remembered, so Save Build ... can put it back in the same place.\n\nOK = Yes, move it to the Build Tab.\nCancel = No, un-bundle it here.`))
      return unbundleToBuild(v);
    toast('Un-bundled: the vessel and its IPs can be edited again');
  }
  sel = { kind: 'gfx', id: v.id }; renderTabs(); renderWs();
}
// an un-bundled item goes to the Build Tab with its parts, in the same spot; buildFrom remembers where it came from
function unbundleToBuild(v) {
  const old = v.workspace;
  v.buildFrom = { tab: old, x: v.x || 0, y: v.y || 0, w: v.w || 200, h: v.h || 260 };
  wsName = old;                                    // the Build Tab is the size of this Tab and offers it first
  const b = toBuild(); if (!b) return;
  const parts = bundleParts(v), ids = [...parts.map(g => g.id), ...eqPorts(v).map(q => q.id)];
  for (const g of [v, ...parts]) g.workspace = b.name;
  const piped = draft.graphics.some(p => p.kind === 'pipe' && p.workspace === old && (ids.includes(p.from) || ids.includes(p.to)));
  sel = { kind: 'gfx', id: v.id }; renderTabs(); renderWs();
  toast(`${v.label || v.name} is on the Build Tab, un-bundled.` + (piped ? ` Its pipes stayed on ${old}.` : '') + ' Change it, then press 💾 Save Build ... to put it back.', false, 8000);
}
// Save Build ... > Yes: back on the Tab it came from, in the same spot and at the same size, bundled again.
// Its IPs keep their place on the picture; pipes drawn on the Build Tab between its own IPs go along.
function putBack(v, to) {
  const f = v.buildFrom, ox = v.x || 0, oy = v.y || 0, sx = f.w / (v.w || f.w), sy = f.h / (v.h || f.h);
  const parts = bundleParts(v), ids = new Set([...parts.map(g => g.id), ...eqPorts(v).map(q => q.id)]);
  for (const p of parts) {
    const cw = (p.w || 22) / 2, ch = (p.h || 22) / 2;
    p.x = Math.round(f.x + ((p.x || 0) + cw - ox) * sx - cw); p.y = Math.round(f.y + ((p.y || 0) + ch - oy) * sy - ch);
    p.workspace = to.name;
  }
  for (const p of draft.graphics.filter(p => p.kind === 'pipe' && p.workspace === v.workspace && ids.has(p.from) && ids.has(p.to))) {
    p.points = p.points.map(c => [Math.round(f.x + (c[0] - ox) * sx), Math.round(f.y + (c[1] - oy) * sy)]); p.workspace = to.name;
  }
  Object.assign(v, { x: f.x, y: f.y, w: f.w, h: f.h, workspace: to.name });
  rebundle(v);
}
// Save (re-bundle): an item that came from a Tab is bundled again when it leaves the Build Tab
function rebundle(v) {
  delete v.buildFrom;
  if (bundleParts(v).length) v.bundled = true;
}
// Clone a Bundled item (Fritz, 2026-10-21): the vessel and every IP bundled with it, copied side by side under a new name.
// Pipes are not copied (they belong where they are drawn); on a Tab with an Equipment Profile the copy joins its Equipment list when the layout is saved.
function cloneBundle(v) {
  const names = new Set(draft.graphics.filter(g => g.kind === 'vessel').map(g => String(g.name || g.label || '').toLowerCase()));
  const base = v.name || v.label || VESSELS[v.vesselType] || 'Vessel';
  let name = `${base} copy`; for (let i = 2; names.has(name.toLowerCase()); i++) name = `${base} copy ${i}`;
  const dx = (v.w || 200) + 40, g = { ...clone(v), id: newId(), name, x: (v.x || 0) + dx };
  if (v.label) g.label = v.label === v.name ? name : `${v.label} copy`;
  delete g.profileItem; delete g.locked;
  draft.graphics.push(g);
  // every bundled part (port IPs, joined Tab_Fittings and their IPs) gets a new id; links follow the copies
  const parts = bundleParts(v), ids = new Map([[v.id, g.id], ...parts.map(p => [p.id, newId()])]);
  const copies = parts.map(p => {
    const c = { ...clone(p), id: ids.get(p.id), x: (p.x || 0) + dx };
    if (c.attachTo) c.attachTo = ids.get(c.attachTo) || c.attachTo;
    if (c.onVessel) c.onVessel = ids.get(c.onVessel) || c.onVessel;
    if (c.capOn) c.capOn = ids.get(c.capOn) || c.capOn;
    if (c.kind === 'ip' && c.attachTo === g.id && c.port && g.ports?.[c.port]) c.label = vPortLabel(g, c.port, g.ports[c.port]);
    delete c.locked; delete c.profileItem;
    return c;
  });
  draft.graphics.push(...copies);
  const ips = copies.filter(c => c.kind === 'ip');
  sel = { kind: 'gfx', id: g.id }; wsName = g.workspace; renderTabs(); renderWs();
  toast(`Cloned: "${name}" with ${ips.length} IP${ips.length === 1 ? '' : 's'}, bundled, next to the first one. Pipes are not copied. Save layout to keep it.`);
}
async function editItem(kind, id) {
  const item = findItem(kind, id); if (!item) return;
  const unitOf = item.kind === 'ip' && item.attachTo ? draft.graphics.find(x => x.id === item.attachTo && (isUnit(x) || isSkyV(x))) : null;
  if (unitOf) return editItem('gfx', unitOf.id);        // an IP of a Skynet Fitting or vessel: open it, its IPs have no settings of their own
  const bundle = isUnit(item) || isSkyV(item) ? null : bundleOf(item);   // a Skynet Fitting opens its Properties even when it sits on a bundled vessel
  if (bundle) return toast(`This ${item.kind === 'ip' ? 'IP' : 'Tab_Fitting'} is bundled with ${bundle.label || bundle.name}. Open the vessel and switch off Bundled to edit, move or delete it.`, true);
  if (item.kind === 'vessel' && item.bundled && !isUnit(item) && !isSkyV(item)) return editBundle(item);
  await loadMediaPictures();
  const type = kind === 'el' ? item.type : item.kind;
  const fields = kind === 'el' ? it => {
    const f = [...F.common.slice(0, 3), ...fieldsFor(it), ...(isPropValve(it) ? F.propValve : []), ...(isInline(it) ? F.inlineSides : []), ...F.common.slice(3)];
    const more = slotsOf(it).filter(n => n > 3);     // items folded from stacked BruControl copies have imagePath_4, _5 ...
    if (more.length) f.splice(f.findIndex(x => x[0] === 'imagePath_3') + 1, 0, ...more.map(n => ['imagePath_' + n, 'imagePath_' + n, 'imgpath', n]));
    if (prefixOf(it)) f.splice(1, 0, ['_hint', `Suggested name prefix: ${prefixOf(it)}  (a hint, not required)`, 'note']);
    if (isDevice(it)) f.splice(1, 0, ['_sug', `Suggested name: ${deviceSuggestion(it, item) || '(type a Label and pick the Interface and port)'}` + (autoNamed.has(item) ? '  (this new Device follows it until you type a name of your own)' : ''), 'note'],
      ['typeCode', 'Device Type (for the suggested name)', 'sel', [['', '(none)'], ...typeCodes(it).map(([c, l]) => [c, `${c}   ${l}`])]]);
    return f;
  } : isUnit(item) ? F.skynetFitting : isSkyV(item) ? F.skynetVessel : isBfit(item) ? F.tabFitting : eqClass(item) ? F.vesselNew : autoPrefix(item) ? it => [['_nm', `Name: ${item.name} (given by Skynet, cannot be changed)` + (type === 'text' ? `. A Process uses it: ${item.name}.visible = false` : ''), 'note'], ...(typeof F[type] === 'function' ? F[type](it) : F[type])] : F[type];
  const work = clone(item), before0 = item.fitting;
  const isV = !!eqClass(item), bf = isBfit(item);
  if (bf) { fitToFields(work); work.joined = !!item.onVessel; }
  if (isUnit(item) || isSkyV(item)) { work.rot = String(unitRot(item)); delete work.turn; }
  if (isV) for (const k of Object.keys(eqClass(item).ports)) { const p = item.ports?.[k] || {}; work[k + '_on'] = !!p.installed; work[k + '_pos'] = p.position; work[k + '_std'] = p.standard; }
  const r = await dialog(kind === 'el' ? `${type} element` : type === 'ip' ? 'IP widget (Initial Point)' : bf ? 'Tab_Fitting' : isV && item.template ? 'Tab_Vessel' : isV ? eqClass(item).title : type === 'vessel' ? 'Vessel / equipment widget' : type === 'pipe' ? (item.hose ? 'Hose' : 'Pipe') : type === 'text' ? 'Text' : type, fields, work, true, kind === 'el' ? elementTopic(item) : graphicTopic(item));
  try {
    if (r === 'delete') {
      if (!confirm('Delete this item?')) return;
      if (kind === 'el') draft.elements = draft.elements.filter(e => e !== item); else draft.graphics = draft.graphics.filter(g => g !== item);
      const gone = type === 'ip' ? [item.id] : hasIps(item) ? devIps(item).map(q => q.id) : eqPorts(item).map(q => q.id);
      if (type === 'vessel') {       // its own port IPs go with it; IPs that were only dropped on it stay
        for (const f of draft.graphics.filter(g => isBfit(g) && g.onVessel === item.id)) {     // and the Tab_Fittings joined to it
          for (const g of draft.graphics) if (g.attachTo === f.id && g.port) gone.push(g.id);
          draft.graphics = draft.graphics.filter(g => g !== f && !(g.attachTo === f.id && g.port));
        }
        for (const g of draft.graphics) if (g.attachTo === item.id && g.port) gone.push(g.id);
        draft.graphics = draft.graphics.filter(g => !(g.attachTo === item.id && g.port));
        for (const g of draft.graphics) if (g.attachTo === item.id) delete g.attachTo;
      }
      draft.graphics = draft.graphics.filter(g => !(isCap(g) && gone.includes(g.capOn)));     // an End Cap on an opening that is gone goes too
      for (const g of draft.graphics) { if (gone.includes(g.from)) delete g.from; if (gone.includes(g.to)) delete g.to; }
      sel = null; renderWs(); return;
    }
    if (r !== 'ok') {      // a new vessel closed with Cancel still gets its default ports
      if (isV && item.isNew) { delete item.isNew; vesselPopup(item, syncVesselPorts(item, null)); renderWs(); }
      return;
    }
    readFields(work);
    if (bf) {           // a Tab_Fitting: its fittings, then its IPs (which come from the fittings)
      fitFromFields(work);
      if (item.onVessel && !work.joined && !isUnit(item)) { delete work.onVessel; delete work.onPort; }
      delete work.joined;
      if (isUnit(item)) {          // a Skynet Fitting: its IPs sit on its openings, wherever it is flipped or rotated
        work.rot = +work.rot || 0; if (!work.rot) delete work.rot;
        for (const k of ['flipH', 'flipV']) if (!work[k]) delete work[k];
        if (!work.onVessel) work.bundled = true;
      }
      const pos = Object.fromEntries(Object.keys(work).filter(k => k.endsWith('_pos')).map(k => [k.slice(0, -4), work[k]]));
      if ((+work.turn || 0) !== (+item.turn || 0)) for (const k of Object.keys(pos)) pos[k] = turnPos(pos[k], (+work.turn || 0) - (+item.turn || 0));   // the IPs turn with the picture
      if (!+work.turn) delete work.turn;
      work.ports = {};
      for (const [k, d] of Object.entries(bfitClass(work).ports)) work.ports[k] = { installed: true, position: (isUnit(item) ? '' : pos[k] || item.ports?.[k]?.position) || portDefPos(d), standard: d.ip ? stdShort(fittingPortStd(work, k)) : '' };
      for (const k of Object.keys(work)) if (/_(on|pos|std)$/.test(k)) delete work[k];
      work.name = noSpaces(work.name || '') || item.name;
    } else if (isSkyV(item)) {        // a Skynet vessel: its ports come from its Template and don't change here
      for (const k of Object.keys(work)) if (/_(on|pos|std)$/.test(k)) delete work[k];
      work.ports = clone(item.ports || {}); work.bundled = true;
      work.rot = +work.rot || 0; if (!work.rot) delete work.rot;
      for (const k of ['flipH', 'flipV']) if (!work[k]) delete work[k];
      if (sideways({ ...work, kind: 'vessel' }) !== sideways(item)) {      // turned onto its side or back up: the box turns too, about its middle
        const w = +work.w || item.w || 200, hh = +work.h || item.h || 200;
        Object.assign(work, { w: hh, h: w, x: Math.round((+work.x || 0) + (w - hh) / 2), y: Math.round((+work.y || 0) + (hh - w) / 2) });
      }
      work.name = (work.name || '').trim() || item.name;
    } else if (isV) {
      work.ports = {};
      for (const [k, d] of Object.entries(eqClass(item).ports)) {
        work.ports[k] = { installed: !!work[k + '_on'], position: work[k + '_pos'] || portDefPos(d), standard: work[k + '_std'] || EQ_STANDARDS[0] };
        delete work[k + '_on']; delete work[k + '_pos']; delete work[k + '_std'];
      }
      work.name = (work.name || '').trim() || item.name;
      if (!item.template && (!work.label || work.label === item.vtype)) work.label = work.vtype;   // the label follows the Type until it is changed (a Tab_Vessel's empty label shows its Name)
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
      // a new Device keeps following the suggested name (Display name, Interface, port, type, tab) until a name of its own is typed
      const follow = autoNamed.has(item) && work.name === item.name && isDevice(work);
      if (follow) work.name = deviceSuggestion(work, item) || work.name; else autoNamed.delete(item);
      if (!work.name) throw new Error('Name is required');
      if (work.name !== item.name) { const bad = elementNameError(work.name, isDevice(work) ? 'Device' : 'Widget'); if (bad) throw new Error(bad); }   // public/names.js
      if (isDevice(work) && work.name.toLowerCase() !== item.name.toLowerCase() && nameTaken(work.name, item)) throw new Error(`The name ${work.name} is already used. Device names must be unique.`);
      const isNew = !S.config.elements.some(x => x.name === item.name);
      if (isDevice(work) && (isNew || String(portKeys(work)) !== String(portKeys(item)) || work.sensor !== item.sensor || work.device !== item.device)) { const err = portError(work, item); if (err) throw new Error(err); }
      if (work.name !== item.name && draft.elements.some(e => e.name === work.name)) throw new Error('That name is already used');
      if (work.name !== item.name) noteRename(item.name, work.name);
      if (work.name !== item.name) for (const g of draft.graphics) {
        if (g.flowWhen) g.flowWhen = g.flowWhen.map(n => n === item.name ? work.name : n);
        if (g.heater === item.name) g.heater = work.name;
        for (const k of ['from', 'to']) if (devOfIp(g[k]) === item.name) g[k] = g[k].replace(`dev:${item.name}:`, `dev:${work.name}:`);
      }
      if (hasIps(item) && !hasIps(work)) for (const g of draft.graphics) for (const k of ['from', 'to']) if (devOfIp(g[k]) === item.name) delete g[k];
    }
    const kindChanged = kind === 'el' && work.kind !== item.kind;
    const pickedPort = work.attachTo !== item.attachTo;
    const before = isV ? clone(item) : null, oldTab = item.workspace, lockWas = !!item.locked;
    Object.keys(item).forEach(k => delete item[k]); Object.assign(item, work);
    if (!!item.locked !== lockWas) {      // the 🔓 / 🔒 icon works like the 🔒 Lock button: a vessel's ports and joined fittings go with it
      const frozen = profileFrozen(item);
      if (frozen) { setLock(item, lockWas); toast(`🔒 The Equipment Profile "${frozen.name}" of this Tab is locked, so its equipment, IPs and pipes can't change.`, true); }
      else if (item.kind === 'vessel') for (const g of bundleParts(item)) setLock(g, !!item.locked);
    }
    if (!item.locked) delete item.locked;
    if (item.workspace && item.workspace !== oldTab) {   // moved to another tab: go there with it, so it does not seem to vanish
      for (const g of draft.graphics) if (g.attachTo === (item.id ?? item.name) && !g.port && g.kind === 'ip') g.workspace = item.workspace;   // IPs dropped on it go along
      wsName = item.workspace;
      const ips = type === 'ip' ? [item.id] : hasIps(item) ? devIps(item).map(q => q.id) : eqPorts(item).map(q => q.id);
      const piped = draft.graphics.some(p => p.kind === 'pipe' && p.workspace === oldTab && (ips.includes(p.from) || ips.includes(p.to)));
      toast(`Moved to the ${item.workspace} tab.` + (piped ? ` Its pipes stayed on ${oldTab}; draw new ones here.` : ''));
    }
    if (isV) {
      if (bf) {         // IPs of fittings that are gone go too (and the Start IP once it is joined)
        const gone = draft.graphics.filter(g => g.kind === 'ip' && g.attachTo === item.id && g.port && !eqClass(item).ports[g.port]).map(g => g.id);
        draft.graphics = draft.graphics.filter(g => !gone.includes(g.id));
        for (const g of draft.graphics) { if (gone.includes(g.from)) delete g.from; if (gone.includes(g.to)) delete g.to; }
      }
      const placed = syncVesselPorts(item, before.isNew ? null : before);
      if (isSkyV(item)) turnVesselParts(item, before);         // flipped or rotated: its IPs and fittings turn with it
      placeUnitParts(item);
      if (!bf && !isSkyV(item) && (placed.length || before.isNew)) vesselPopup(item, placed);
      delete item.isNew;
    }
    if (type === 'vessel' && !item.bundled && !item.onVessel && !isUnit(item) && bundledIps(item).length &&
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
    ['id', 'Tab ID (exactly 2 letters, unique; it ends the suggested name of each new Device on this tab, e.g. ..._Fly_Sparge_SP)', 'text'],
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
    try {
      readFields(work);
      const others = draft.workspaces.filter(x => x !== w);
      if (!work.name?.trim()) throw new Error('The tab needs a name');
      if (others.some(x => x.name === work.name)) throw new Error('That tab name is used');
      work.id = work.id ? cleanTabId(work.id) : defaultTabId(work.name, others.map(x => x.id));
      if (others.some(x => String(x.id).toUpperCase() === work.id)) throw new Error(`Tab ID ${work.id} is used by the ${others.find(x => String(x.id).toUpperCase() === work.id).name} tab`);
    } catch (e) { return toast(e.message, true); }
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
  if (ev.altKey && !ev.ctrlKey && !ev.metaKey && ev.code === 'KeyP' && can('admin')) { ev.preventDefault(); openPicPicker(); }   // Option+P types π on a Mac: the key's place counts
});
// ---------------------------------------------------------------- picture picker (Alt+P, Option+P on a Mac, or the Picture button)
// Shows the pictures in media/Images as icons, like Explorer (or the sounds in media/sounds), Skynet / Mine / Both and one
// group or All. From the Process editor it types the path picked at the cursor: in quotes, unless the cursor is already
// just after a quote. From the 🖼 button beside a picture list in Properties it picks that list's picture.
let ppAt = null, ppFor = null, ppVal = '', ppShown = [];
async function openPicPicker() {
  const ta = $('#code'); if (!curScript || ta.readOnly) return;
  ppAt = [ta.selectionStart, ta.selectionEnd]; ppFor = null;
  await ppOpen(lastGroup.ppKind === 'sounds' ? 'sounds' : 'pictures', '');
}
// the 🖼 button of a picture or sound list (a gpick select)
async function pickForSelect(sel) {
  ppFor = sel; ppAt = null;
  await ppOpen(sel.dataset.list === 'sounds' ? 'sounds' : 'pictures', sel.value === '__add__' ? '' : sel.value);
}
async function ppOpen(kind, cur) {
  await loadMediaPictures();
  $('#ppKind').value = kind; $('#ppKind').disabled = !!ppFor; $('#ppFilter').value = ''; $('#ppSrc').value = srcPick();
  $('#ppTitle').textContent = ppFor ? (kind === 'sounds' ? 'Pick a sound' : 'Pick a picture') : 'Insert a picture or sound path';
  $('#ppInsert').textContent = ppFor ? 'Use this one' : 'Insert';
  $('#ppHint').textContent = ppFor ? 'Click a picture, then Use this one (or double-click it). Arrow keys move, Enter picks.' : 'Double-click a file, or press Enter, to put its path where the cursor is. Arrow keys move through the icons.';
  ppVal = cur || '';
  ppGroups(); ppFill();
  $('#picPickDlg').showModal(); $('#ppGrid').focus();
  $('#ppGrid .ppTile.sel')?.scrollIntoView({ block: 'nearest' });
}
const ppPaths = () => $('#ppKind').value === 'sounds' ? mediaSounds : mediaPics;
function ppGroups() {
  const kind = $('#ppKind').value, groups = groupChoices(kind === 'sounds', ppPaths()), g = lastGroup[kind] || '';
  $('#ppGroup').replaceChildren(h('option', { value: '' }, 'All groups'), ...groups.map(([n, l]) => h('option', { value: n }, l)));
  $('#ppGroup').value = groups.some(([n]) => n === g) ? g : '';
}
function ppFill() {
  const g = $('#ppGroup').value, f = $('#ppFilter').value.toLowerCase(), snd = $('#ppKind').value === 'sounds';
  const src = snd ? 'both' : $('#ppSrc').value;
  $('#ppSrc').hidden = snd;
  ppShown = ppPaths().filter(p => inGroup(p, g) && inSource(p, src) && (!f || p.toLowerCase().includes(f)));
  if (!ppShown.includes(ppVal)) ppVal = ppShown[0] ?? '';
  $('#ppGrid').replaceChildren(...ppShown.map(p => {
    const name = p.split('/').pop();
    return h('div', { class: 'ppTile' + (p === ppVal ? ' sel' : ''), 'data-p': p, title: p, onclick: () => ppSelect(p), ondblclick: () => { ppSelect(p); ppInsert(); } },
      snd ? h('div', { class: 'ppSnd' }, '🔊') : h('img', { loading: 'lazy', alt: '', src: media(p) }), h('div', { class: 'ppName' }, name));
  }));
  $('#ppEmpty').hidden = !!ppShown.length;
  ppShow();
}
function ppSelect(p) {
  ppVal = p;
  for (const t of $$('#ppGrid .ppTile')) t.classList.toggle('sel', t.dataset.p === p);
  $('#ppGrid .ppTile.sel')?.scrollIntoView({ block: 'nearest' });
  ppShow();
}
function ppShow() {
  const p = ppVal, snd = $('#ppKind').value === 'sounds';
  $('#ppPath').textContent = p || 'Nothing here: add pictures on the Media page';
  $('#ppAudio').hidden = !snd || !p; if (p && snd) $('#ppAudio').src = media(p);
  $('#ppInsert').disabled = !p;
}
// arrow keys move through the icons like in Explorer: left / right one, up / down one row
function ppKey(ev) {
  const i = ppShown.indexOf(ppVal), tiles = $$('#ppGrid .ppTile');
  if (ev.key === 'Enter') { ev.preventDefault(); return ppInsert(); }
  const top = tiles[0]?.offsetTop, cols = Math.max(1, tiles.findIndex(t => t.offsetTop !== top) === -1 ? tiles.length : tiles.findIndex(t => t.offsetTop !== top));
  const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols, Home: -1e9, End: 1e9 }[ev.key];
  if (step === undefined || !ppShown.length) return;
  ev.preventDefault();
  ppSelect(ppShown[Math.min(ppShown.length - 1, Math.max(0, (i < 0 ? 0 : i) + step))]);
}
function ppInsert() {
  const p = ppVal; if (!p) return;
  $('#picPickDlg').close('ok');
  if (ppFor) {         // a picture list in Properties: pick it there (and let the list show its preview)
    const sel = ppFor; ppFor = null;
    if (![...sel.options].some(o => o.value === p)) sel.insertBefore(h('option', { value: p }, p), sel.querySelector('option[value="__add__"]'));
    sel.value = p; sel.dispatchEvent(new Event('change', { bubbles: true })); sel.focus();
    return;
  }
  if (!ppAt) return;
  const ta = $('#code'), [a, b] = ppAt, before = ta.value[a - 1], after = ta.value[b];
  const text = before === '"' ? p + (after === '"' ? '' : '"') : `"${p}"`;
  editCode(a, b, text); const end = a + text.length + (before === '"' && after === '"' ? 1 : 0); ta.setSelectionRange(end, end);
}
$('#picPick').onclick = openPicPicker;
$('#ppKind').onchange = () => { keepGroup('ppKind', $('#ppKind').value); ppGroups(); ppFill(); };
$('#ppSrc').onchange = () => { keepGroup('src', $('#ppSrc').value); ppFill(); };
$('#ppGroup').onchange = () => { keepGroup($('#ppKind').value, $('#ppGroup').value); ppFill(); };
$('#ppFilter').oninput = ppFill;
$('#ppGrid').addEventListener('keydown', ppKey);
$('#ppFilter').addEventListener('keydown', ev => { if (ev.key === 'ArrowDown') { ev.preventDefault(); $('#ppGrid').focus(); } else if (ev.key === 'Enter') { ev.preventDefault(); ppInsert(); } });
$('#ppInsert').onclick = ev => { ev.preventDefault(); ppInsert(); };
$('#picPickDlg').addEventListener('close', () => {
  if ($('#picPickDlg').returnValue === 'ok') return;
  if (ppFor) { ppFor.focus(); ppFor = null; return; }
  const ta = $('#code'); ta.focus(); if (ppAt) ta.setSelectionRange(...ppAt);
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
    const bad = fileNameError(as, { ext: false, what: 'Process' }); if (bad) { toast(bad, true); as = b.name; }
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
  const off = h('input', { type: 'checkbox', class: 'swc' });
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
  const bad = fileNameError(n, { ext: false, what: 'Process' }); if (bad) throw new Error(bad);   // a Process is the file scripts/<name>.txt
  if (S.scripts.some(s => s.name === n)) throw new Error('That name is used');
  await api('PUT', '/ui/scripts/' + encodeURIComponent(n), '//' + n + '\n', true);
  S.scripts = await api('GET', '/ui/scripts'); dirty = false; openScript(n);
});
$('#renScript').onclick = guard(async () => {
  if (!curScript) return; let n = prompt('Rename to', curScript); if (!n) return;
  n = noSpaces(n); if (n === curScript) return;
  const bad = fileNameError(n, { ext: false, what: 'Process' }); if (bad) throw new Error(bad);
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
  renderCsvBox(names);
}

// Download CSV: tick values (or pick a saved CSV set like Mash Profile), a time span and a layout
let csvNames = [];
function renderCsvBox(names = csvNames) {
  csvNames = names;
  const sets = S.config.logSets || [], picked = $('#csvSet').value, ticked = new Set($$('#csvNames input:checked').map(c => c.value));
  $('#csvSet').innerHTML = '';
  $('#csvSet').append(h('option', { value: '' }, '(the ticked values)'), ...sets.map(s => h('option', { value: s.name, ...(s.name === picked ? { selected: true } : {}) }, s.name)));
  const set = sets.find(s => s.name === $('#csvSet').value);
  const all = [...new Set([...names.map(n => n.name), ...(set?.names || [])])];
  const count = Object.fromEntries(names.map(n => [n.name, n.count]));
  $('#csvNames').innerHTML = '';
  $('#csvNames').append(...all.map(n => h('label', { class: 'toggle' }, h('input', { type: 'checkbox', value: n, ...((set ? set.names.includes(n) : ticked.has(n)) ? { checked: true } : {}) }), `${n} (${count[n] ?? 0})`)));
  if (!all.length) $('#csvNames').append(h('span', { class: 'muted' }, 'Nothing has been written to the brew database yet. Give a vAPI variable a database trigger (Variables page).'));
  $('#csvDelSet').disabled = !set;
}
const csvTicked = () => $$('#csvNames input:checked').map(c => c.value);
$('#csvSet').onchange = () => renderCsvBox();
$('#csvAll').onclick = () => $$('#csvNames input').forEach(c => c.checked = true);
$('#csvNone').onclick = () => { $$('#csvNames input').forEach(c => c.checked = false); $('#csvSet').value = ''; $('#csvDelSet').disabled = true; };
$('#csvNames').onchange = () => { $('#csvSet').value = ''; $('#csvDelSet').disabled = true; };
$('#csvRange').onchange = () => $('#csvCustom').classList.toggle('hidden', $('#csvRange').value !== 'custom');
const saveCsvSets = async sets => { await api('PUT', '/ui/log/sets', { sets }); S.config.logSets = sets; };
$('#csvSaveSet').onclick = guard(async () => {
  const names = csvTicked(); if (!names.length) throw new Error('Tick at least one value first');
  const name = (prompt('Name for this CSV set (like Mash Profile or Fermentor Profile):', $('#csvSet').value) || '').trim(); if (!name) return;
  const sets = (S.config.logSets || []).filter(s => s.name.toLowerCase() !== name.toLowerCase());
  await saveCsvSets([...sets, { name, names }].sort((a, b) => a.name.localeCompare(b.name)));
  renderCsvBox(); $('#csvSet').value = name; renderCsvBox(); toast('Saved');
});
$('#csvDelSet').onclick = guard(async () => {
  const name = $('#csvSet').value; if (!name || !confirm(`Delete the CSV set "${name}"? The readings stay in the brew database.`)) return;
  await saveCsvSets((S.config.logSets || []).filter(s => s.name !== name)); $('#csvSet').value = ''; renderCsvBox();
});
function csvSpan() {
  const r = $('#csvRange').value, now = Date.now(), H = 3600_000;
  if (r === 'all') return {};
  if (r === 'today') { const d = new Date(); d.setHours(0, 0, 0, 0); return { from: d.getTime() }; }
  if (r === 'custom') {
    const from = $('#csvFrom').value ? new Date($('#csvFrom').value).getTime() : null, to = $('#csvTo').value ? new Date($('#csvTo').value).getTime() : null;
    if (from && to && to < from) throw new Error('"To" is before "From"');
    return { from, to };
  }
  return { from: now - { '1h': 1, '4h': 4, '12h': 12, '24h': 24, '7d': 168, '30d': 720 }[r] * H };
}
$('#csvGo').onclick = guard(async () => {
  const names = csvTicked(); if (!names.length) throw new Error('Tick at least one value (or pick a CSV set)');
  const { from, to } = csvSpan(), q = new URLSearchParams({ names: names.join(','), layout: $('#csvLayout').value, tz: new Date().getTimezoneOffset() });
  if (from) q.set('from', from); if (to) q.set('to', to);
  if ($('#csvSet').value) q.set('label', $('#csvSet').value);
  const a = h('a', { href: '/ui/log/export.csv?' + q, download: '' }); document.body.append(a); a.click(); a.remove();
});
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
    const cfg = S.config.devices.find(x => x.name === d.name);
    const idBox = h('input', { class: 'ifaceId', value: cfg?.id ?? '', size: 6, maxlength: 7, disabled: !can('admin'), title: 'Interface ID: 1 to 4 letters, unique. It starts the suggested name of each Device on this Interface (MB_25_...)',
      onchange: guard(async ev => {
        const id = cleanInterfaceId(ev.target.value);
        if (S.config.devices.some(x => x.name !== d.name && String(x.id).toUpperCase() === id)) { ev.target.value = cfg?.id ?? ''; throw new Error(`Interface ID ${id} is used by another Interface`); }
        await api('PUT', '/ui/layout', { devices: S.config.devices.map(x => x.name === d.name ? { ...x, id } : x) }); await load(); toast(`Interface ID is now ${id}_ (Devices made before keep their names)`);
      }) });
    tb.append(h('tr', {}, h('td', {}, idBox, '_'), h('td', {}, d.name), h('td', {}, (TYPES[d.type] || d.type) + (d.simMode ? ` (simulation mode, real: ${TYPES[d.realType]})` : d.type === 'simulator' && d.realType ? ` (for ${TYPES[d.realType]})` : '')), h('td', {}, d.host ? `${d.host}:${d.port ?? 4100}` : d.port || ''),
      h('td', { style: `color:${d.status === 'connected' ? 'var(--ok)' : 'var(--bad)'}` }, d.status), h('td', {}, d.info || ''),
      h('td', {}, real, ' ', h('button', { class: 'danger admin-only', onclick: guard(async () => { if (!confirm(`Remove Interface ${d.name}?`)) return; await api('PUT', '/ui/layout', { devices: S.config.devices.filter(x => x.name !== d.name) }); await load(); }) }, 'Remove'))));
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
  if (S.config.devices.some(d => d.name === name)) throw new Error('That Interface name is used');
  const taken = S.config.devices.map(x => x.id), typed = $('#devId').value.trim();
  const id = typed ? cleanInterfaceId(typed) : defaultInterfaceId(name, taken);
  if (taken.some(t => String(t).toUpperCase() === id)) throw new Error(`Interface ID ${id} is used by another Interface. Leave the box empty for one that is free.`);
  const d = { name, id, type };
  if (type === 'serial') { d.port = $('#devPort').value.trim(); d.baud = 115200; if (!d.port) throw new Error('USB port is required'); }
  if (type === 'esp32' || type === 'ethernet') { d.host = $('#devHost').value.trim(); d.port = 4100; if (!d.host) throw new Error('Network address is required'); }
  await api('PUT', '/ui/layout', { devices: [...S.config.devices, d] }); await load(); toast(`Interface ${name} added, ID ${id}_`);
  $('#devName').value = ''; $('#devId').value = ''; $('#devId').placeholder = 'MB';
});
// the Interface ID box shows the ID a name would get (first letters of its first two words), until one is typed
$('#devName').addEventListener('input', () => { $('#devId').placeholder = defaultInterfaceId($('#devName').value, S.config.devices.map(x => x.id)) || 'MB'; });

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
// The same dropdown is on the Menu Bar, the ☰ Menu Schema tab and the About tab (Fritz, 2026-10-21): every one of them is filled here.
function renderSchemaPick() { for (const s of $$('select.schemaSel')) fillSchemaSelect(s); }
function fillSchemaSelect(s) {
  const sc = S.schemas || { list: [] }, act = sc.active?.id;
  s.innerHTML = '';
  s.append(...sc.list.map(x => h('option', { value: x.id, ...(x.id === act ? { selected: true } : {}) }, x.name)));
  if (can('admin')) s.append(h('optgroup', { label: '──────────' },
    h('option', { value: '__new' }, 'Add new Schema ...'), h('option', { value: '__clone' }, 'Clone a Schema ...'), h('option', { value: '__ren' }, 'Rename this Schema ...'),
    h('option', { value: '__ver' }, 'Save a new version now'),
    h('option', { value: '__bak' }, 'Back up this Schema now'), h('option', { value: '__res' }, 'Restore a backup or version ...'),
    h('option', { value: '__del' }, 'Delete a Schema ...')));
  s.disabled = !can('admin') && sc.list.length < 2;
  s.title = can('admin') ? 'Pick a Schema to load it' : 'Only an admin can load another Schema';
  s.onchange = schemaPicked;
}
// Processes running now: switching the Schema stops them, so you are warned first (Fritz, 2026-10-21)
const runningProcs = () => (S.scripts || []).filter(x => x.state === 'running');
function okToSwitch(toName, what = 'Loading') {
  const act = S.schemas.active?.name, run = runningProcs();
  const off = 'Every output is switched off first: digital outs and valves, PWM and analog outs, duty cycle, hysteresis and PID controls, motors, timers and alarms.';
  if (run.length) return confirm(`⚠ The Schema "${act}" is active: ${run.length} Process${run.length > 1 ? 'es are' : ' is'} running:\n${run.slice(0, 12).map(x => '• ' + x.name).join('\n')}${run.length > 12 ? '\n• ...' : ''}\n\n` +
    `${what} "${toName}" stops ${run.length > 1 ? 'them' : 'it'}. ${off}\n\nIs it OK to proceed?`);
  return confirm(`${what} "${toName}"?\n\n${off}\n\nIts tabs, devices, elements and Equipment Profile take the place of "${act}". "${act}" is kept just as it is: pick it in the Schema list to go back to it.`);
}
// after another Schema is loaded: start fresh on its first tab
async function afterSchemaSwitch(msg) {
  wsName = null; eqWork = null; vesselWork = null; vesselDirty = eqDirty = false;
  const keep = menuTab;                                  // picked on the Schema or About Menu tab: stay there
  if (!['schema', 'about'].includes(keep)) leaveMenuTab();
  await load(); soundOnStart();
  if (['schema', 'about'].includes(keep)) openMenuTab(keep); else setView('workspace');
  toast(msg + '. Every output was switched off.');
}
const schemaPicked = guard(async ev => {
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
      if (!okToSwitch(w.name, 'Making and loading')) return;
      await api('POST', '/ui/schemas', { name: w.name, empty: w.start === 'empty' });
      return afterSchemaSwitch(`Schema "${w.name}" made and loaded`);
    }
    if (v === '__clone') return cloneSchema(act.id);
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
    if (!okToSwitch(to.name)) return;
    await api('POST', `/ui/schemas/${v}/load`);
    await afterSchemaSwitch(`Schema "${to.name}" loaded`);
  } finally { back(); }
});
// Clone a Schema (Fritz, 2026-10-21): a copy of any Schema, loaded or not, with its saved values. It is only loaded if you say so.
async function cloneSchema(id) {
  if (!can('admin')) return toast('Only an admin can clone a Schema', true);
  if (editing) return toast('Save or exit Edit layout first', true);
  const list = S.schemas.list, src = list.find(x => x.id === id) || list.find(x => x.active);
  const w = { id: src.id, name: '', load: false };
  if (await dialog('Clone a Schema', [['id', 'Schema to clone', 'sel', list.map(x => [x.id, x.name + (x.active ? '  (loaded)' : '')])],
    ['name', 'Name of the clone (empty: "<name> copy")', 'text'], ['load', 'Load the clone now', 'bool'],
    ['_n', 'The clone gets everything in the Schema: its tabs, devices, elements, pictures, pipes, probes, autostart list, Equipment Profile and saved values. It starts without a version of its own. The Schema you clone is not changed.', 'note']], w) !== 'ok') return;
  readFields(w);
  const from = list.find(x => x.id === w.id);
  let name = String(w.name || '').trim();
  if (!name) { name = `${from.name} copy`; for (let i = 2; list.some(x => x.name.toLowerCase() === name.toLowerCase()); i++) name = `${from.name} copy ${i}`; }
  if (w.load && !okToSwitch(name, 'Loading the clone')) return;
  await api('POST', `/ui/schemas/${w.id}/clone`, { name, load: !!w.load });
  if (w.load) return afterSchemaSwitch(`Clone "${name}" made and loaded`);
  S.schemas = await api('GET', '/ui/schemas'); renderSchemaPick(); if (['schema', 'about'].includes(menuTab)) renderMenuPane();
  toast(`Clone "${name}" made. Pick it in the Schema list to load it.`);
}
async function restoreSchema() {
  const act = S.schemas.active, list = await api('GET', `/ui/schemas/${act.id}/backups`);
  if (!list.length) return toast('This Schema has no backups or versions yet', true);
  const key = b => (b.version ? 'v:' : 'b:') + b.file;
  const w = { file: key(list[0]) };
  if (await dialog(`Restore a backup or version of "${act.name}"`, [['file', 'Backup or version', 'sel', list.map(b => [key(b), b.version ? `Version ${b.file.slice(0, -5)}` : `${new Date(b.when).toLocaleString()}${b.daily ? '  (daily)' : '  (made by hand)'}`])],
    ['_n', 'The Schema as it is now is backed up first, so you can undo this by restoring that backup. Running Processes stop.', 'note']], w) !== 'ok') return;
  readFields(w);
  if (!okToSwitch(act.name, 'Restoring and loading again')) return;
  await api('POST', `/ui/schemas/${act.id}/restore`, { file: w.file.slice(2), version: w.file.startsWith('v:') });
  await afterSchemaSwitch('Backup restored');
}

// ---------------------------------------------------------------- ☰ Menu and Menu tabs (Fritz, 2026-10-20)
// The ☰ Menu button sits where the Edit layout checkbox was. Edit layout is its first choice; the rest open Menu tabs, which
// show next to the screen tabs only once picked (each has a ✕ to close it). Each Menu tab has an Order number (Default tab).
let eqWork = null, eqDirty = false;           // the Equipment Profile open on the Equipment Profile tab, and whether it has unsaved changes
let eqTabName = null;                          // the Tab the Equipment Profile and Default Layout tabs are about
// Equipment Profiles belong to Tabs (Fritz, 2026-10-21): each Tab of a Schema can have its own, usually a Hot Side Tab and a
// Fermentation Tab. A Schema uses a profile on one Tab only.
const tabOfProfile = pid => pid ? S.config.workspaces.find(w => w.equipmentProfile === pid) ?? null : null;
const eqTab = () => { const ws = S.config.workspaces, by = n => ws.find(w => w.name === n);
  return by(eqTabName) || (by(wsName)?.equipmentProfile ? by(wsName) : null) || ws.find(w => w.equipmentProfile) || by(wsName) || ws[0]; };
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const usedOnText = p => (p.usedOn || []).map(u => `${u.schema} (Tab ${u.tab ?? '?'})`).join(', ');
let vesselWork = null, vesselDirty = false;   // the piece of equipment open on the Vessel tab
const profWork = { mash: null, boil: null, tab: null, valve: null }, profDirty = { mash: false, boil: false, tab: false, valve: false };   // the profile open on each profile tab
let menuTab = null;                           // the Menu tab showing now (null: the screen tabs)
const menuOpen = [];                          // Menu tabs picked and not closed yet
const EQ_KINDS = ['vessel', 'pchiller', 'ccoil', 'herms', 'trub', 'rims'];
const profileName = id => S.profiles.find(p => p.id === id)?.name;
const unitOf = (f, units) => units === 'Metric' ? f[3] : f[2];
const MENU = [
  { key: 'zoom', title: 'Zoom', tip: 'How big the tabs show, and Full screen', render: renderZoomTab },
  { key: 'default', title: 'Default', tip: 'What new Recipes start with, and the order of the Menu', render: renderDefaultTab },
  { key: 'equipment', title: 'Equipment Profile', tip: 'Each Tab\'s equipment, its losses and its piping', render: renderEquipTab },
  { key: 'vessel', title: 'Vessel', tip: 'One vessel (or chiller, coil, filter): size, heat, probe, ports', render: renderVesselTab },
  { key: 'vtemplates', title: 'Vessel Templates', tip: 'Ready-made vessels (Skynet and your own): small icons, double-click for the settings, Add to Tab', render: renderTemplatesTab('vessel', 'vessel') },
  { key: 'etemplates', title: 'Equipment Templates', tip: 'Ready-made chillers, coils, trub filters and RIMS tubes (2 or 4 liquid ports)', render: renderTemplatesTab('vessel', 'equip') },
  { key: 'ftemplates', title: 'Fitting Templates', tip: 'Ready-made Bundled Fittings (valve, tee, elbows ...) for vessel ports or a Tab', render: renderTemplatesTab('fitting') },
  { key: 'layout', title: 'Default Layout', tip: 'The vessels and pipes a Tab gets with its Equipment Profile', render: renderLayoutTab },
  { key: 'mash', title: 'Mash Profile', tip: 'Up to 4 mash steps and the sparge', render: renderBrewProfileTab('mash') },
  { key: 'boil', title: 'Boil Profile', tip: 'Total boil time and boil off', render: renderBrewProfileTab('boil') },
  { key: 'tab', title: 'Tab Background Profile', tip: 'A tab\'s background color, and the look new devices and widgets on it start with', render: renderBrewProfileTab('tab') },
  { key: 'valve', title: 'Valve Profile', tip: 'The pictures and orientation a new valve starts with', render: renderBrewProfileTab('valve') },
  { key: 'recipe', title: 'Recipe', coming: 'Coming in the next stage (BeerSmith import, scaling, SRM and IBU)' },
  { key: 'fermentation', title: 'Fermentation', coming: 'Coming in a later stage (gravity, ABV, CO2, dates)' },
  { key: 'skynetpics', title: 'Get Skynet pictures', tip: 'Copy new and changed Skynet pictures from GitHub onto the Brain (into media/Images/Skynet)', render: renderSkynetPicsTab, admin: true },
  { key: 'filemove', title: 'File Move Utility', tip: 'Copy files and whole folders from this computer to the Brain (opens the File Move page)', view: 'filemove', admin: true },
  { key: 'schema', title: 'Schema', tip: 'Pick the Schema to load, and clone, add, rename, back up or restore one', render: renderSchemaTab },
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
  if (view === 'workspace' && !menuTab && menuBarHides()) list.append(h('button', { role: 'menuitem', class: 'menuItem', title: 'The top line: Schema, Processes, Variables, Log, Settings, Help, Enable sound, Sign out', onclick: () => { closeMenuList(); showMenuBar(menuBarHidden()); } }, menuBarHidden() ? '▼ Show Menu Bar' : '▲ Hide Menu Bar'));
  menuItems(list, fn => () => { closeMenuList(); fn(); });
  const tabs = $('#menuTabs'); tabs.innerHTML = '';
  for (const k of menuSorted().map(m => m.key).filter(k => menuOpen.includes(k))) {
    const m = MENU.find(x => x.key === k);
    tabs.append(h('button', { class: 'menuTab' + (k === menuTab ? ' active' : ''), title: m.tip, onclick: ev => { if (ev.target.closest('.mtX')) return; openMenuTab(k); } },
      '☰ ' + m.title, h('span', { class: 'mtX', title: 'Close this Menu tab', onclick: () => closeMenuTab(k) }, '✕')));
  }
  if (menuTab && !paneDirty()) renderMenuPane();
}
// the ☰ Menu choices: Edit layout, then the Menu tabs in their order. `go` wraps each choice (it closes the list first,
// and in a dialog it closes the dialog). `pages` adds the Menu Bar pages too, for a ☰ that sits where the Menu Bar can't be reached.
function menuItems(list, go, pages = false) {
  const item = (label, fn, attrs = {}) => h('button', { type: 'button', role: 'menuitem', class: 'menuItem', ...attrs, onclick: fn ? go(fn) : null }, ...[label].flat());
  if (can('admin')) list.append(item(editing ? '✎ Exit Edit layout' : '✎ Edit layout', guard(menuEditLayout)));
  list.append(h('hr'));
  if (editing) list.append(h('div', { class: 'menuNote muted' }, 'Save or exit Edit layout to open a Menu tab'));
  for (const m of menuSorted().filter(m => !m.admin || can('admin'))) {
    const off = m.coming || (editing && !m.view);
    list.append(item([m.title, m.coming ? h('span', { class: 'muted' }, ' (coming)') : ''], () => { if (m.view) setView(m.view); else openMenuTab(m.key); },
      { title: m.coming || m.tip, ...(off ? { disabled: true } : {}) }));
  }
  if (!pages) return;
  list.append(h('hr'), h('div', { class: 'menuNote muted' }, 'Pages'));
  for (const b of $$('#views button')) {
    if (b.classList.contains('admin-only') && !can('admin') || b.classList.contains('op-only') && !can('operator')) continue;
    const v = b.dataset.view;
    list.append(item(b.textContent, () => { if (v === 'workspace' && menuTab) leaveMenuTab(); setView(v); }, { title: b.title || '', ...(v === view && !(v === 'workspace' && menuTab) ? { class: 'menuItem cur' } : {}) }));
  }
}
const closeMenuList = () => { $('#menuList').classList.add('hidden'); $('#menuBtn').setAttribute('aria-expanded', 'false'); };
$('#barEdit').onclick = guard(menuEditLayout);      // the red button (crossed hammers over a square) beside ☰ Menu: Edit layout on and off (Fritz, 2026-10-22)
$('#barHelp').onclick = () => openHelp(pageTopic());      // the ? beside ☰ Menu on the Tabs bar (Fritz, 2026-10-22)
$('#menuBtn').onclick = ev => { ev.stopPropagation(); const l = $('#menuList'), show = l.classList.contains('hidden'); renderMenu(); l.classList.toggle('hidden', !show); $('#menuBtn').setAttribute('aria-expanded', String(show)); };
document.addEventListener('click', ev => { if (!ev.target.closest('.menuWrap')) { closeMenuList(); closeMenuCopies(); } });

// Fritz, 2026-10-21: the ☰ Menu is on almost every dialog and on the Menu Bar of every page, as a way to get around.
// A copy of the button opens its own list (fixed to the window, so a small dialog can't cut it off). `leave` runs before
// a choice and may say no; in a dialog it asks about unsaved changes and closes the dialog.
const MENU_SVG = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 4h14M3 8h14M3 12h14M3 16h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const closeMenuCopies = () => { for (const l of $$('.menuCopy .menuList')) l.classList.add('hidden'); for (const b of $$('.menuCopy .menuBtn')) b.setAttribute('aria-expanded', 'false'); };
function menuButton(leave, label = ' Menu') {
  const list = h('div', { class: 'menuList menuFixed hidden', role: 'menu' });
  const btn = h('button', { type: 'button', class: 'menuBtn', title: 'Menu: Edit layout, the Menu tabs and the pages', 'aria-haspopup': 'true', 'aria-expanded': 'false' });
  btn.innerHTML = MENU_SVG + label;
  btn.onclick = ev => {
    ev.preventDefault(); ev.stopPropagation();
    const show = list.classList.contains('hidden');
    closeMenuList(); closeMenuCopies();
    if (!show) return;
    list.innerHTML = '';
    menuItems(list, fn => () => { list.classList.add('hidden'); if (!leave || leave() !== false) fn(); }, true);
    list.classList.remove('hidden'); btn.setAttribute('aria-expanded', 'true');
    const r = btn.getBoundingClientRect();
    // right edge under the button, but never off either side of a phone screen
    list.style.top = Math.round(r.bottom + 4) + 'px';
    list.style.maxHeight = Math.max(160, innerHeight - r.bottom - 16) + 'px';
    list.style.left = Math.round(Math.max(8, Math.min(r.right - list.offsetWidth, innerWidth - list.offsetWidth - 8))) + 'px';
  };
  return h('div', { class: 'menuWrap menuCopy' }, btn, list);
}
// every dialog gets the ☰ in its top right corner when it opens, except the ones that must be answered first
// (a manual valve a Process waits on, the recovery code, the first-run sample pick, beer money): those carry data-nomenu
const dlgSnap = d => JSON.stringify([...d.querySelectorAll('input, select, textarea')].map(i => i.type === 'checkbox' || i.type === 'radio' ? i.checked : i.value));
function addDialogMenu(d) {
  if ('nomenu' in d.dataset) return;
  d._menuSnap = dlgSnap(d);
  const host = d.querySelector(':scope > form') || d;
  if (host.querySelector(':scope > .dlgMenu')) return;
  const wrap = menuButton(() => {
    if (dlgSnap(d) !== d._menuSnap && !confirm('This window has changes that are not saved. Leave them?')) return false;
    // the dialog's own Cancel / Esc runs first, so whatever waits on it hears "cancel"
    const ev = new Event('cancel', { cancelable: true });
    d.dispatchEvent(ev);
    if (d.open && !ev.defaultPrevented) d.close('cancel');
  }, '');
  wrap.classList.add('dlgMenu');
  host.prepend(wrap);
}
const showModalPlain = HTMLDialogElement.prototype.showModal;
HTMLDialogElement.prototype.showModal = function () { try { addDialogMenu(this); } catch (e) { console.error(e); } return showModalPlain.call(this); };
// the Menu Bar's own ☰, for every page but the Tabs (the Tabs have theirs on the tab line)
$('#top .right').prepend(menuButton());
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
  markOnTabs(); refit();
  renderTabs(); renderMenu(); renderMenuPane();
}
function leaveMenuTab() {
  if (!menuTab) return;
  dropDirty(menuTab);
  menuTab = null;
  $('#menuPane').classList.add('hidden'); $('#wsScroll').classList.remove('hidden'); $('#view-workspace').classList.remove('menuMode');
  markOnTabs(); showMenuBar(false);
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
  const k = menuTab;
  box.append(paneClose(() => closeMenuTab(k)));
  m.render(box);
  menuHelpIcons(box);
}
// Fritz, 2026-10-21: every Menu tab, File Move and Help has a Close button and a boxed ✕ in its top right corner; both close it
function paneClose(close) {
  return h('div', { class: 'paneClose' }, h('button', { onclick: close, title: 'Close' }, 'Close'), h('button', { class: 'boxX', onclick: close, title: 'Close', 'aria-label': 'Close' }, '✕'));
}
// Help and File Move are pages of their own: closing them goes back to where you were (the Tabs, or the Menu tab you came from)
const closePage = () => setView(view === 'help' && helpFrom && helpFrom !== 'help' ? helpFrom : 'workspace');
$('#hpTools').append(paneClose(closePage));
$('#fmClose').append(paneClose(closePage));
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
  const admin = can('admin'), d = { units: 'US', hideMenuBar: true, textVisible: true, textWrap: true, ...(S.config.brewDefaults || {}) };
  const pick = (list, none) => [['', none], ...list.map(x => [x.id, x.name])];
  const fields = w => [['_d', 'Every default is set here. A new Recipe starts with the first ones, and you can change each one in the Recipe.', 'note'],
    ['units', 'Units', 'sel', Object.entries(UNIT_SYSTEMS), true],
    ['batchSize', `Batch size (${volUnit(w.units)}, into the fermenter)`, 'num'],
    ['equipmentProfile', 'Equipment Profile', 'sel', pick(S.profiles, '(the Tab\'s own)')],
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
    ['_tbn', 'Every text box (the Name and Value of each Device and Widget, a Label, a Text, the Display Name on a vessel) starts from these. ' +
      'An item left on Default follows the colors, alignment and name font here, so changing one here changes them all. ' +
      'Visible, Word wrap, the size and the place are copied into each new item when it is made.', 'note'],
    ['textVisible', 'Visible (new Devices, Widgets and Texts start shown)', 'bool'],
    ['textForeColor', 'Fore color (the color of the text)', 'color'],
    ['textBackColor', 'Back color (behind the text)', 'color'],
    ['textAlign', 'Alignment', 'sel', [['', 'Default (as each kind of item has it)'], ...TB_ALIGN_CHOICES.slice(1)]],
    ['textWrap', 'Word wrap as needed', 'bool'],
    ['nameFont', 'Name font (names, Display Names and Texts)', 'sel', FONTS.map(([v, t]) => [v, v ? t : 'Default (the panel\'s normal font)'])],
    ['nameFontSize', 'Name font size (px; empty = the panel\'s normal size)', 'num'],
    ['textWidth', 'Width of a new Text or Label (px; empty = 220)', 'num'],
    ['textHeight', 'Height of a new Text or Label (px; empty = 40)', 'num'],
    ['textX', 'X position of new items (px from the left of the Tab; empty = 40)', 'num'],
    ['textY', 'Y position of new items (px from the top of the Tab; empty = 40)', 'num'],
    ['textLarge', `Large text size (px) for \\L in Process text. Bigger than normal text (${TEXT_NORMAL} px); empty = ${TEXT_LARGE}`, 'num'],
    ['_p', 'Phones and tablets', 'head'],
    ['touchMove', 'Phones and tablets can move and resize things in Edit layout (off: a finger only picks them, so nothing moves by accident)', 'bool'],
    ['_pn', `This screen counts as ${touchOnly() ? 'a phone or tablet' : 'a computer (mouse)'}. Computers can always move things.`, 'note']];
  const f = paneForm(fields, d, () => { }, !admin);
  // Sound on: the same as the button at the top. It works at once on this screen and is not saved.
  const now = h('input', { type: 'checkbox', class: 'soundNowSw', ...(soundOn ? { checked: true } : {}) });
  now.onchange = () => setSound(now.checked);
  const soundNow = h('div', { class: 'menuForm' }, h('label', {}, 'Sound on (this screen, right now; the same as the button at the top)'), h('label', { class: 'sw' }, now, h('span', { class: 'swk' })));
  const save = guard(async () => {
    f.read();
    if (d.textLarge === '' || d.textLarge === null) delete d.textLarge;
    if (d.textLarge !== undefined && !(+d.textLarge > TEXT_NORMAL && +d.textLarge <= 200)) throw new Error(`Large text size must be more than ${TEXT_NORMAL} (normal text) and at most 200`);
    for (const [k, t, min] of [['nameFontSize', 'Name font size', 6], ['textWidth', 'Width', 10], ['textHeight', 'Height', 10], ['textX', 'X position', 0], ['textY', 'Y position', 0]])
      if (d[k] !== undefined && !(+d[k] >= min && +d[k] <= 5000)) throw new Error(`${t} must be from ${min} to 5000 pixels (or empty)`);
    await api('PUT', '/ui/settings', { brewDefaults: d }); S.config.brewDefaults = d; showMenuBar(document.body.classList.contains('menuBarOn')); setTextLarge(); renderWs(); toast('Defaults saved'); });
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

// a Schema dropdown for a Menu tab: the same list and choices as the one on the Menu Bar
function schemaSelect() { const s = h('select', { class: 'schemaSel' }); fillSchemaSelect(s); return s; }

// ---- Schema tab (Fritz, 2026-10-21): the Schema dropdown, and every Schema with Load and Clone
function renderSchemaTab(box) {
  const admin = can('admin'), list = S.schemas?.list || [], act = S.schemas?.active, run = runningProcs();
  const when = x => x.updated ? new Date(x.updated).toLocaleString() : '';
  const rows = list.map(x => h('tr', { class: x.active ? 'active' : '' },
    h('td', {}, x.active ? h('b', {}, x.name) : x.name, x.active ? h('span', { class: 'muted' }, '  (loaded)') : ''),
    h('td', {}, String(x.tabs)), h('td', {}, (x.tabProfiles || []).map(t => (t.tab ? t.tab + ': ' : '') + profileName(t.id)).join(', ') || h('span', { class: 'muted' }, 'none')), h('td', {}, when(x)),
    h('td', {}, admin && !x.active ? h('button', { onclick: guard(async () => {
      if (editing) return toast('Save or exit Edit layout first', true);
      if (!okToSwitch(x.name)) return;
      await api('POST', `/ui/schemas/${x.id}/load`); await afterSchemaSwitch(`Schema "${x.name}" loaded`);
    }) }, 'Load') : '',
      admin ? h('button', { title: 'Make a copy of this Schema under a new name', onclick: guard(() => cloneSchema(x.id)) }, 'Clone') : '')));
  box.append(h('h3', {}, 'Schema'), h('div', { class: 'schemaPane' },
    h('div', { class: 'bar menuPick' }, h('span', {}, 'Loaded Schema'), schemaSelect(),
      act?.version ? h('span', { class: 'muted' }, 'Version ' + act.version) : ''),
    run.length ? h('div', { class: 'eqWarn' }, `⚠ ${run.length} Process${run.length > 1 ? 'es are' : ' is'} running (${run.map(x => x.name).join(', ')}). Loading another Schema stops ${run.length > 1 ? 'them' : 'it'}; you are asked first.`) : '',
    h('p', { class: 'muted' }, 'Loading another Schema switches every output off first (digital outs and valves, PWM and analog outs, duty cycle, hysteresis and PID controls, motors, timers and alarms), then its tabs, devices and Equipment Profiles take the place of the loaded one. The one you leave is kept as it is.'),
    h('h3', {}, 'Schemas on this Brain'),
    h('table', { class: 'grid' }, h('thead', {}, h('tr', {}, ...['Name', 'Tabs', 'Equipment Profiles (Tab: profile)', 'Last saved', ''].map(t => h('th', {}, t)))), h('tbody', {}, ...rows)),
    admin ? '' : h('p', { class: 'muted' }, 'Only an admin can load, clone or change a Schema.')));
}

// ---- About tab: who is signed in, Sign out, and the loaded Schema with its version
// Get Skynet pictures (Fritz, 2026-10-22): ask GitHub which Skynet pictures this Brain is missing, show them, copy them over.
// The Brain does the downloading, so it works the same on a Pi, Windows, Mac or Linux; no GitHub account is needed.
function renderSkynetPicsTab(box) {
  const out = h('div', { class: 'spOut' }), go = h('button', { class: 'primary', disabled: true }, 'Get them');
  const check = h('button', {}, 'Check GitHub');
  let found = null;
  const kb = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
  const show = r => {
    found = r; const all = [...r.add.map(x => ({ ...x, what: 'New' })), ...r.update.map(x => ({ ...x, what: 'Newer on GitHub' }))];
    go.disabled = !all.length; go.textContent = all.length ? `Get ${all.length} picture${all.length === 1 ? '' : 's'} (${kb(all.reduce((a, x) => a + x.size, 0))})` : 'Get them';
    out.replaceChildren(h('p', {}, all.length ? `GitHub has ${r.total} Skynet pictures: ${r.add.length} new and ${r.update.length} changed for this Brain, ${r.same} already here.` : `All ${r.total} Skynet pictures on GitHub are already on this Brain. Nothing to get.`),
      all.length ? h('table', { class: 'spTable' }, h('thead', {}, h('tr', {}, h('th', {}, ''), h('th', {}, 'Picture'), h('th', {}, 'Size'), h('th', {}, ''))),
        h('tbody', {}, ...all.map(x => h('tr', {}, h('td', {}, h('img', { class: 'spThumb', loading: 'lazy', alt: '', src: `https://raw.githubusercontent.com/${r.repo}/${r.commit}/media/Images/Skynet/${x.path.split('/').map(encodeURIComponent).join('/')}`, onerror: ev => ev.target.remove() })),
          h('td', {}, 'Skynet/' + x.path), h('td', { class: 'num' }, kb(x.size)), h('td', { class: 'muted' }, x.what))))) : '');
  };
  check.onclick = guard(async () => {
    check.disabled = go.disabled = true; out.replaceChildren(h('p', { class: 'muted' }, 'Asking GitHub ...'));
    try { show(await api('GET', '/ui/skynetpics/check')); } catch (e) { out.replaceChildren(h('p', { class: 'bad' }, e.message)); } finally { check.disabled = false; }
  });
  go.onclick = guard(async () => {
    if (!found) return;
    check.disabled = go.disabled = true; go.textContent = 'Copying ...';
    try {
      const r = await api('POST', '/ui/skynetpics/get', { paths: [...found.add, ...found.update].map(x => x.path) });
      await loadMediaPictures();
      out.replaceChildren(h('p', { class: r.failed.length ? 'bad' : '' }, `Copied ${r.saved.length} picture${r.saved.length === 1 ? '' : 's'} into media/Images/Skynet.` + (r.failed.length ? ` ${r.failed.length} could not be copied:` : ' They are in every picture list now.')),
        r.failed.length ? h('ul', {}, ...r.failed.map(f => h('li', {}, f))) : '');
      toast(`Copied ${r.saved.length} Skynet picture(s)`, !!r.failed.length);
    } catch (e) { out.replaceChildren(h('p', { class: 'bad' }, e.message)); }
    finally { check.disabled = false; go.disabled = true; go.textContent = 'Get them'; found = null; }
  });
  box.append(h('h3', {}, 'Get Skynet pictures'), h('div', { class: 'menuNarrow' },
    h('p', {}, 'Skynet adds new pictures to GitHub from time to time. This copies the new and changed ones onto this Brain, into ', h('b', {}, 'media/Images/Skynet'), '. Your own pictures are never touched, and nothing is deleted. No GitHub account is needed; the Brain must be on the internet.'),
    saveBar(check, go), out));
  check.click();
}

function renderAboutTab(box) {
  const act = S.schemas?.active || S.config.schema || {}, row = S.schemas?.list.find(x => x.id === act.id);
  const item = (k, v) => [h('dt', {}, k), h('dd', {}, v)];
  box.append(h('h3', {}, 'About'), h('div', { class: 'menuNarrow' },
    h('dl', { class: 'aboutGrid' },
      ...item('Panel', S.config.title || 'Skynet Brew Panel'),
      ...item('Panel version', panelVersionBox()),
      ...item('Signed in as', `${S.me.name} (${S.me.role})`),
      ...item('Schema', schemaSelect()),
      ...item('Schema version', act.version || 'No version yet'),
      ...(row?.updated ? item('Last saved', new Date(row.updated).toLocaleString()) : [])),
    act.version ? '' : h('p', { class: 'muted' }, 'Turn on "Update Version" next to Save layout (or pick "Save a new version now" in the Schema list) to give the Schema a version.'),
    saveBar(h('span', { class: 'spacer' }), h('button', { class: 'primary', onclick: signOut }, 'Sign out'))));
}

const panelVersionName = () => { const v = S.panelVersion || {}; return v.version ? v.version + (v.changed ? ' + changes' : '') : '(not stamped)'; };
// Panel version (version.json, stamped by GitHub on every merge) and whether GitHub has a newer one
function panelVersionBox() {
  const v = S.panelVersion || {}, note = h('div', { class: 'muted' }, v.version ? 'Checking GitHub ...' : '');
  if (!v.version) note.textContent = 'Not stamped: this copy did not come from a GitHub merge.';
  else {
    api('GET', '/ui/version/latest').then(r => {
      note.replaceChildren(h('span', { class: 'verState ver-' + r.state }, r.text));
      if (v.repo) note.append(' ', h('a', { href: `https://github.com/${v.repo}/releases`, target: '_blank', rel: 'noopener' }, 'Versions on GitHub'));
    }).catch(e => { note.textContent = 'Could not check GitHub: ' + e.message; });
  }
  return h('div', {}, h('b', {}, panelVersionName()),
    v.merged ? h('div', { class: 'muted' }, `Merged ${new Date(v.merged).toLocaleString()}` + (v.commit ? ` (code ${v.commit})` : '')) : '', note);
}

// ---- Equipment Profile tab
function renderEquipTab(box) {
  const pid = eqTab()?.equipmentProfile;
  const fresh = eqWork && S.profiles.find(x => x.id === eqWork.id);       // locked or unlocked elsewhere (a Process, another screen)
  if (eqWork && !fresh) { eqWork = null; eqDirty = false; }
  else if (fresh) { if (!eqDirty) eqWork = clone(fresh); else Object.assign(eqWork, { locked: fresh.locked, lockedBy: fresh.lockedBy, lockedAt: fresh.lockedAt, usedBy: fresh.usedBy, usedOn: fresh.usedOn, items: fresh.items, fittings: fresh.fittings, drawn: fresh.drawn, pipes: fresh.pipes }); }
  if (!eqWork && pid && S.profiles.some(x => x.id === pid)) eqWork = clone(S.profiles.find(x => x.id === pid));
  box.append(h('h3', {}, 'Equipment Profile'), schemaProfileBox());
  const admin = can('admin');
  const pick = h('select', {}, h('option', { value: '' }, S.profiles.length ? 'Pick one to open ...' : '(none yet)'),
    ...S.profiles.map(x => h('option', { value: x.id, ...(x.id === eqWork?.id ? { selected: true } : {}) }, x.name + (tabOfProfile(x.id) ? `  (Tab ${tabOfProfile(x.id).name})` : ''))),
    ...(admin ? [h('option', { value: '__add__' }, 'Add new ...')] : []));
  pick.onchange = guard(async () => {
    if (pick.value === '__add__') { pick.value = eqWork?.id || ''; return newProfile(); }
    if (pick.value) openProfile(pick.value);
  });
  box.append(h('div', { class: 'bar menuPick' }, h('span', {}, 'Open'), pick));
  box.append(eqEditor());
}
// each Tab of the loaded Schema and its profile: pick one (and say what happens to the Tab's drawing), lock it, shared or unique
function schemaProfileBox() {
  return h('div', { class: 'schemaBox' },
    h('div', { class: 'muted' }, 'Each Tab of the Schema ', h('b', {}, S.schemas.active?.name || ''), ' can have its own Equipment Profile, for example one for the Hot Side and one for Fermentation. ',
      'A profile\'s equipment list is the Tab_Vessels and Tab_Fittings on its Tab.'),
    ...S.config.workspaces.map(tabProfileRow));
}
function tabProfileRow(w) {
  const pid = w.equipmentProfile, p = S.profiles.find(x => x.id === pid), admin = can('admin');
  const elsewhere = id => S.config.workspaces.find(x => x !== w && x.equipmentProfile === id);
  const pick = h('select', { 'data-tab': w.name, ...(admin ? {} : { disabled: true }) }, h('option', { value: '' }, '(none)'),
    ...S.profiles.map(x => h('option', { value: x.id, ...(x.id === pid ? { selected: true } : {}), ...(elsewhere(x.id) ? { disabled: true } : {}) }, x.name + (elsewhere(x.id) ? `  (on Tab ${elsewhere(x.id).name})` : ''))),
    ...(admin ? [h('option', { value: '__add__' }, 'Add new ...')] : []));
  if (p?.locked) pick.disabled = true;
  pick.onchange = guard(async () => {
    const back = () => { pick.value = pid || ''; };
    if (pick.value === '__add__') { back(); return newProfile(w.name); }
    const to = S.profiles.find(x => x.id === pick.value), here = S.config.graphics.filter(g => g.kind === 'vessel' && g.workspace === w.name).length;
    let layout = 'use';
    if (!to) { if (!confirm(`Take the Equipment Profile off the Tab "${w.name}"?\n\nThe equipment and pipes stay on the Tab, kept in the Schema itself.`)) return back(); }
    else if (to.hasDrawing) {
      // Fritz: the tabs are only changed when you say so
      layout = await choose(`Use "${to.name}" on the Tab "${w.name}". What goes on the Tab?`, [[`Use its Default Layout (${to.drawn} equipment, ${to.fittings || 0} fittings, ${to.pipes} pipes)`, 'use'], ['Keep this Tab\'s layout as it is', 'keep']]);
      if (!layout) return back();
    } else if (!confirm(`Use "${to.name}" on the Tab "${w.name}"?\n\n"${to.name}" has no Default Layout yet, so the ${here} piece${here === 1 ? '' : 's'} of equipment and the pipes on this Tab become its Default Layout.`)) return back();
    if (eqDirty && !confirm('The open Equipment Profile has changes that are not saved. Leave them?')) return back();
    eqDirty = false; eqWork = null; eqTabName = w.name;
    await api('PUT', '/ui/schema/profile', { tab: w.name, id: pick.value, layout }); await load();
    toast(!pick.value ? `The Tab "${w.name}" has no Equipment Profile now` : layout === 'keep' ? `The Tab "${w.name}" uses "${profileName(pick.value)}" and keeps its own layout` : `The Tab "${w.name}" uses "${profileName(pick.value)}"`);
  });
  const lock = p ? h('label', { class: 'toggle op-only', title: 'A locked Equipment Profile (its numbers, equipment and pipes) cannot be changed until it is unlocked. A Process can do the same with lock_Equipment and unlock_Equipment (they lock or unlock every Tab\'s profile).' },
    h('span', { class: 'sw' }, h('input', { type: 'checkbox', ...(p.locked ? { checked: true } : {}), onchange: guard(async ev => {
      const on = ev.target.checked;
      if (!on && !confirm(`Unlock "${p.name}"?${p.lockedBy ? `\n\nIt was locked by ${p.lockedBy}.` : ''}`)) { ev.target.checked = true; return; }
      await api('PUT', `/ui/equipment/${p.id}/lock`, { locked: on }); await load(); toast(on ? '🔒 Equipment Profile locked' : 'Equipment Profile unlocked');
    }) }), h('span', { class: 'swk' })), ' 🔒 Locked') : '';
  const others = p ? (p.usedOn || []).filter(u => !u.active) : [];
  const share = !p ? '' : others.length ? `Shared: also used by ${others.map(u => `${u.schema} (Tab ${u.tab ?? '?'})`).join(', ')}. A change to it changes every one of them.` : 'Unique: only this Tab uses it.';
  const own = p && w.layoutFromProfile === false ? ' This Tab keeps its own layout (see the Default Layout tab).' : p ? ` The Tab shows its Default Layout (${p.drawn} equipment, ${plural(p.fittings || 0, 'fitting')}, ${plural(p.pipes, 'pipe')}).` : '';
  return h('div', { class: 'tabProfile' }, h('div', { class: 'bar wrap' }, h('span', {}, 'Tab ', h('b', {}, w.name), ' uses'), pick, lock,
    p ? h('button', { onclick: () => { eqTabName = w.name; openProfile(p.id); } }, 'Open') : '',
    p && others.length && admin ? h('button', { class: 'admin-only', title: 'Copy the profile and use the copy on this Tab only', onclick: guard(() => makeUnique(w.name)) }, 'Make it unique to this Tab') : ''),
    h('div', { class: 'muted' }, share, own),
    p?.locked ? h('div', { class: 'eqWarn' }, `🔒 Locked${p.lockedBy ? ' by ' + p.lockedBy : ''}${p.lockedAt ? ', ' + new Date(p.lockedAt).toLocaleString() : ''}. Its numbers, equipment and pipes can't be changed until it is unlocked.`) : '');
}
async function makeUnique(tab) {
  const w = S.config.workspaces.find(x => x.name === tab), p = S.profiles.find(x => x.id === w?.equipmentProfile), sch = S.schemas.active?.name;
  if (!p) return;
  let name = `${p.name} (${sch} ${tab})`; for (let i = 2; S.profiles.some(x => x.name.toLowerCase() === name.toLowerCase()); i++) name = `${p.name} (${sch} ${tab} ${i})`;
  if (!confirm(`Make a copy of "${p.name}" called "${name}" and use it on the Tab "${tab}" only?\n\nThe others keep using "${p.name}".`)) return;
  const r = await api('POST', '/ui/equipment', { name, from: p.id, assign: true, tab, layout: w.layoutFromProfile === false ? 'keep' : 'use' });
  eqDirty = false; eqTabName = tab; await load(); openProfile(r.made); toast(`"${name}" is now the Tab's own profile`);
}
async function newProfile(tab) {
  if (eqDirty && !confirm('The open Equipment Profile has changes that are not saved. Leave them?')) return;
  const free = S.config.workspaces.filter(x => !x.equipmentProfile).map(x => x.name);
  if (tab && !free.includes(tab)) free.unshift(tab);
  const w = { name: '', from: '', units: 'US', tab: tab ?? free[0] ?? '' };
  if (await dialog('New Equipment Profile', [['name', 'Name (for example "Oak Barn Hot Side" or "Fermentation room")', 'text'],
    ['from', 'Start from', 'sel', [['', 'The usual numbers (change them after)'], ...S.profiles.map(p => [p.id, `A copy of "${p.name}"`])]],
    ['units', 'Units', 'sel', Object.entries(UNIT_SYSTEMS)],
    ['tab', `Use it on a Tab of the Schema "${S.schemas.active?.name}"`, 'sel', [['', '(not now)'], ...free.map(n => [n, 'Tab ' + n + (S.config.workspaces.find(x => x.name === n)?.equipmentProfile ? ' (instead of its profile now)' : '')])]]], w) !== 'ok') return;
  readFields(w);
  // a new blank profile takes the equipment on its Tab as its Default Layout; a copy keeps a Tab that already has equipment as it is
  const drawn = S.config.graphics.some(g => g.kind === 'vessel' && g.workspace === w.tab);
  const r = await api('POST', '/ui/equipment', { name: w.name, from: w.from || undefined, assign: !!w.tab, tab: w.tab || undefined, layout: w.from && drawn ? 'keep' : 'use' });
  if (w.tab) eqTabName = w.tab;
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
  const used = p.usedOn?.length ? `\n\nIt is used by: ${usedOnText(p)}. Those Tabs will have no Equipment Profile. Their equipment and pipes stay on them.` : '';
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
    const all = { equipment: [...eqItems(p), ...(p.equipment || [])] };
    const u = volUnit(p.units), bp = S.boilProfiles.find(x => x.id === chk.boil), kettle = firstOfType(all, 'Brew Kettle'), ferm = firstOfType(all, 'Fermenter');
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
    p.locked ? h('div', { class: 'eqWarn' }, `Locked${p.lockedBy ? ' by ' + p.lockedBy : ''}. Unlock it to change it (the 🔒 Locked switch above when a Tab of this Schema uses it, or unlock_Equipment in a Process).`) : '',
    h('div', { class: 'muted' }, p.usedOn?.length ? `Used by: ${usedOnText(p)}` : 'Not used on any Tab yet', ' · ', h('span', { id: 'eqSaveState' }, eqDirty ? 'Not saved yet' : 'Saved')),
    buttons(), h('div', { class: 'eqTop' }, f.box, out), eqPane(p), buttons());
  return box;
}

// the profile's Equipment list: the Tab_Vessels, Tab_Fittings and other equipment on its Tab (Fritz, 2026-10-21). On the Tab of
// this Schema that uses it they come from the Tab itself, otherwise from the profile's Default Layout.
function eqItems(p) {
  const w = tabOfProfile(p.id);
  if (!w || w.layoutFromProfile === false) return p.items || [];
  return S.config.graphics.filter(g => g.kind === 'vessel' && g.workspace === w.name);
}
function eqPane(p) {
  const admin = can('admin') && !p.locked, w = tabOfProfile(p.id), items = eqItems(p);
  const nameOf = id => items.find(x => x.id === id)?.name || '';
  const kindOf = it => it.vesselType === 'bfit' ? 'Tab_Fitting' : (it.template ? 'Tab_Vessel' : EQ[it.vesselType]?.title || it.vesselType) + (it.vtype ? ': ' + (it.vtype === 'Other' && it.otherType ? it.otherType : it.vtype) : '');
  const size = it => it.maxVolume ?? it.volume;
  const rows = items.map(it => h('tr', {}, h('td', {}, it.name || ''), h('td', {}, kindOf(it)),
    h('td', {}, size(it) !== undefined ? `${size(it)} ${volUnit(it.units || p.units)}` : ''),
    h('td', {}, it.template ? `${it.template}${it.templateCls ? ' (' + (it.templateCls === 'skynet' ? 'Skynet' : 'User') + ')' : ''}` : ''),
    h('td', {}, it.onVessel ? 'on ' + nameOf(it.onVessel) : '')));
  const goTab = () => { if (!w) return; leaveMenuTab(); wsName = w.name; sel = null; setView('workspace'); renderTabs(); renderWs(); };
  const own = w && w.layoutFromProfile === false;
  const out = h('div', { class: 'eqPane' }, h('h3', {}, 'Equipment list'),
    h('p', { class: 'muted' }, w ? (own ? `The Tab "${w.name}" uses this profile but keeps its own layout, so this list is the profile's Default Layout. ` : `The Tab_Vessels and Tab_Fittings on the Tab "${w.name}". `) : 'The Tab_Vessels and Tab_Fittings in this profile\'s Default Layout. ',
      'Put them on the Tab from the Vessel Templates and Fitting Templates tabs (Add to Tab), and change each one in its properties on the Tab.'),
    rows.length ? h('table', { class: 'grid' }, h('thead', {}, h('tr', {}, ...['Name', 'Kind', 'Size', 'Template', 'Joined'].map(t => h('th', {}, t)))), h('tbody', {}, ...rows))
      : h('p', {}, 'No equipment on the Tab yet.'),
    h('div', { class: 'bar wrap' }, w ? h('button', { onclick: goTab }, `Go to the Tab "${w.name}"`) : '',
      admin ? h('button', { onclick: () => openMenuTab('vtemplates') }, 'Vessel Templates ...') : '',
      admin ? h('button', { onclick: () => openMenuTab('ftemplates') }, 'Fitting Templates ...') : ''));
  if (p.equipment?.length) out.append(oldEqList(p, w));
  return out;
}
// the older list made on the Vessel tab (before Templates); each one opens on the Vessel tab
function oldEqList(p, w) {
  const admin = can('admin') && !p.locked, onTab = it => S.config.graphics.find(g => g.kind === 'vessel' && g.profileItem === it.id);
  const u = volUnit(p.units), tab = w?.name || 'Equipment';
  const rows = (p.equipment || []).map(it => h('tr', {},
    h('td', {}, it.name), h('td', {}, `${EQ[it.vesselType]?.title || it.vesselType}${it.vtype ? ': ' + (it.vtype === 'Other' && it.otherType ? it.otherType : it.vtype) : ''}`),
    h('td', {}, it.volume !== undefined ? `${it.volume} ${u}` : ''), h('td', {}, it.heatKind ? HEAT_KINDS[it.heatKind] + (it.heatDevice ? ': ' + it.heatDevice : '') : ''),
    h('td', {}, it.bundled ? '📦 Bundled' : 'Loose'), h('td', {}, onTab(it) ? '✓ on ' + onTab(it).workspace : h('span', { class: 'muted' }, 'not on a tab')),
    h('td', {}, h('button', { onclick: guard(() => openVessel(it.id)) }, admin ? 'Open in Vessel tab' : 'View'),
      admin ? h('button', { title: `Put it on the Tab "${tab}" (or bring the drawing there up to date), with its ports as IPs`, onclick: guard(() => placeEqItems(p, [it])) }, onTab(it) ? 'Update on tab' : `Put on Tab ${tab}`) : '',
      admin ? h('button', { title: 'Make a copy of it (size, heat, probe, ports, bundle) that opens on the Vessel tab to be saved', onclick: guard(() => cloneVessel(it.id)) }, 'Clone') : '')));
  const kind = h('select', {}, ...EQ_KINDS.map(k => h('option', { value: k }, EQ[k].title)));
  return h('div', {}, h('h3', {}, 'Made on the Vessel tab'),
    h('p', { class: 'muted' }, 'Vessels made on the Vessel tab, before Templates. They go on the Tab with "Put on Tab".'),
    h('table', { class: 'grid' }, h('thead', {}, h('tr', {}, ...['Name', 'Kind', 'Size', 'Heat', 'Bundle', 'This Schema', ''].map(t => h('th', {}, t)))), h('tbody', {}, ...rows)),
    admin ? h('div', { class: 'bar' }, kind, h('button', { onclick: guard(() => newVessel(kind.value)) }, 'Add'),
      h('button', { onclick: guard(() => placeEqItems(p, p.equipment)) }, `Put all on Tab ${tab}`)) : '');
}

// ---- Vessel tab: one vessel (or chiller, coil, filter) of the open Equipment Profile
// Fritz, 2026-10-20: size, dead space, graphic, extra trub loss, type (Other has its own name); the heat source its type allows
// and the device that heats it; the temperature probe on the same board as that device; a fermenter's largest and smallest
// batch, trub loss, probe and how often its temperature is reported; the ports, as on the Equipment tab.
function vesselProfile() {
  if (!eqWork) { const pid = eqTab()?.equipmentProfile; if (pid && S.profiles.some(x => x.id === pid)) eqWork = clone(S.profiles.find(x => x.id === pid)); }
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
// Clone a piece of equipment of the open profile: the copy opens on the Vessel tab as a new one, saved with Save there
function cloneVessel(id) {
  if (vesselDirty && !confirm('The open vessel has changes that are not saved. Leave them?')) return;
  const p = vesselProfile(), it = p?.equipment?.find(x => x.id === id); if (!it) return;
  const names = new Set(p.equipment.map(x => String(x.name).toLowerCase()));
  let name = `${it.name} copy`; for (let i = 2; names.has(name.toLowerCase()); i++) name = `${it.name} copy ${i}`;
  vesselWork = { isNew: true, item: toPortFields({ ...clone(it), id: 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name }) };
  vesselDirty = true;
  if (menuTab === 'vessel') renderMenuPane(); else openMenuTab('vessel');
  toast(`"${name}" is a copy of "${it.name}". Change what you need, then Save.`);
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

// ---- Vessel Templates and Bundled Fitting Templates (Fritz, 2026-10-21)
// Two Menu tabs show the Templates as small icons with their names (there will be many, so they take little room); a
// double-click opens a pop-up with the settings. Skynet Templates come first. Once Skynet locks them (SKYNET_LOCKED in
// lib/templates.js) they can only be cloned; until then Skynet is still building them and they can be changed here.
// User Templates are changed and deleted by Admins. Add to Tab puts a copy on a Tab: a Tab_Vessel (with a Tab_Fitting on
// each port that has a Bundled Fitting) or a Tab_Fitting. The copy is fully editable; the Template does not change.
let TPL = null;           // { locked, vessel: [...], fitting: [...] } from the Brain
const loadTemplates = async () => { const r = await api('GET', '/ui/templates'); TPL = { locked: r.locked, vessel: r.vessel, fitting: r.fitting }; return TPL; };
const setTPL = r => { TPL = { locked: r.locked, vessel: r.vessel, fitting: r.fitting }; };
const tplOf = (kind, name) => TPL?.[kind].find(t => t.name.toLowerCase() === String(name || '').toLowerCase());
const tplNames = kind => TPL?.[kind].map(t => t.name) || [];
// the Skynet pictures a Skynet Bundled Fitting can have (a User one can have any picture)
const SKYNET_FIT_PICS = ['Images/Skynet/Valves/Valve_Check.svg', 'Images/Skynet/Other_Equipment/Fitting_Flow_Meter.svg', 'Images/Skynet/Other_Equipment/Fitting_Flow_Meter_Temp.svg', 'Images/Skynet/Other_Equipment/Fitting_Elbow90.svg', 'Images/Skynet/Other_Equipment/Fitting_U.svg', 'Images/Skynet/Other_Equipment/Fitting_End_Cap.svg', 'Images/Skynet/Other_Equipment/Fitting_Elbow45.svg', 'Images/Skynet/Other_Equipment/Fitting_Tee.svg', 'Images/Skynet/Other_Equipment/Fitting_Reducer.svg', 'Images/Skynet/Other_Equipment/pipe_elbow90.svg', 'Images/Skynet/Other_Equipment/pipe_elbow45.svg', 'Images/Skynet/Other_Equipment/pipe_tee.svg', 'Images/Skynet/Other_Equipment/pipe_cross.svg',
  'Images/Skynet/Valves/Valve_Motor_Ball_OpenV_RC.svg', 'Images/Skynet/Valves/Valve_Motor_Ball_OpenV_LC.svg', 'Images/Skynet/Valves/Valve_Motor_Ball_OpenH.svg', 'Images/Skynet/Valves/Valve_Manual_OpenH.svg', 'Images/Skynet/Valves/Valve_Manual_Butterfly_OpenH.svg', 'Images/Skynet/Valves/Valve_Ball_OpenV-1x1.png', 'Images/Skynet/Valves/Valve_Ball_OpenH_1.png'];
const fitImage = t => { const k = (t.fittings || []).map(f => f.kind).filter(k => !['none', 'valve', 'cipBallValve'].includes(k)).pop();
  return { check: 'Images/Skynet/Valves/Valve_Check.svg', flowMeter: 'Images/Skynet/Other_Equipment/Fitting_Flow_Meter.svg', flowMeterTemp: 'Images/Skynet/Other_Equipment/Fitting_Flow_Meter_Temp.svg', tee: 'Images/Skynet/Other_Equipment/Fitting_Tee.svg', u: 'Images/Skynet/Other_Equipment/Fitting_U.svg', cap: 'Images/Skynet/Other_Equipment/Fitting_End_Cap.svg', reducer: 'Images/Skynet/Other_Equipment/Fitting_Reducer.svg', elbow45: 'Images/Skynet/Other_Equipment/Fitting_Elbow45.svg' }[k] || (k ? 'Images/Skynet/Other_Equipment/Fitting_Elbow90.svg' : 'Images/Skynet/Valves/Valve_Motor_Ball_OpenV_RC.svg'); };
const tplIcon = (kind, t) => t.image || (kind === 'fitting' ? fitImage(t) : EQ[t.vesselType]?.image) || 'Images/Skynet/Vessels/kettle.svg';
const tplClassNote = t => t.cls === 'skynet'
  ? (t.editable ? 'Skynet Template. Skynet is still building its Templates, so it can be changed for now. Once they are locked it can only be cloned.' : 'Skynet Template: it can\'t be changed or deleted. Clone it to make your own.')
  : 'User Template: Admins can change and delete it.';

// A Tab_Fitting is drawn like equipment (kind vessel, vesselType bfit), but its ports come from its fittings: a Start (where it
// joins a vessel port; none while it is joined), the End of the chain, the open side of each tee, and a thermowell mark on a tee
// that has one (a thermowell stops flow, so that side has no IP). All its IPs are one circuit: flow passes through, unless a valve
// in it is closed.
// The 45 positions sit where a 45 degree opening meets the corner of a square picture (Fitting_Elbow45.svg).
const BF_POS = SIDE4.concat(CORNERS, [['Top Right 45', 0.84, 0.16], ['Top Left 45', 0.16, 0.16], ['Bottom Right 45', 0.84, 0.84], ['Bottom Left 45', 0.16, 0.84],
  ['Bottom Left Quarter', 0.25, 1], ['Bottom Right Quarter', 0.75, 1]]);        // the two legs of a U (Fitting_U.svg)
// Turn (Fritz, 2026-10-22): a Tab_Fitting's picture can be turned 90, 180 or 270 degrees clockwise; its IP positions turn with it
const TURN_STEP = { Left: 'Top', Top: 'Right', Right: 'Bottom', Bottom: 'Left', 'Top Left': 'Top Right', 'Top Right': 'Bottom Right', 'Bottom Right': 'Bottom Left', 'Bottom Left': 'Top Left',
  'Top Left 45': 'Top Right 45', 'Top Right 45': 'Bottom Right 45', 'Bottom Right 45': 'Bottom Left 45', 'Bottom Left 45': 'Top Left 45' };
const TURNS = [['0', 'Not turned'], ['90', '90 degrees clockwise'], ['180', '180 degrees'], ['270', '270 degrees clockwise (90 counter-clockwise)']];
function turnPos(pos, deg) { for (let i = 0; i < (((+deg || 0) / 90) % 4 + 4) % 4; i++) pos = TURN_STEP[pos] || pos; return pos; }
function bfitClass(g) {
  const ports = {}, flat = g.flat;            // flat: the fitting runs left or right from its vessel port
  const at = (k, def) => turnPos(g.ipPos?.[k] && BF_POS.some(q => q[0] === g.ipPos[k]) ? g.ipPos[k] : def, isUnit(g) ? 0 : g.turn);   // a Template can say where its openings are on its picture
  const chk = hasCheck(g);         // with a check valve in it, the Start side and the far side are two circuits, joined one way
  if (!g.onVessel && !isCapOnly(g)) ports.start = pt(chk ? 'Start (flow goes in here)' : 'Start (vessel side)', BF_POS, { on: true, def: at('start', flat ? 'Left' : 'Top'), circuit: chk ? 'ci' : 'a' });
  fittingEnds(g).forEach((e, i) => ports[e.key] = pt(e.name, BF_POS, { on: true, def: at(e.key, e.key === 'end' ? (flat ? 'Right' : 'Bottom') : flat ? (i % 2 ? 'Top' : 'Bottom') : (i % 2 ? 'Left' : 'Right')), circuit: chk ? 'co' : 'a' }));
  (g.fittings || []).forEach((f, i) => { if (f.kind === 'tee' && f.thermowell) ports['tw' + (i + 1)] = pt(`Thermowell ${i + 1} (${THERMOWELL_POS[f.thermowellPos] || 'Short'})`, BF_POS, { ip: false, def: flat ? 'Top' : 'Right' }); });
  return { title: 'Tab_Fitting', types: [], image: fitImage(g), size: [90, 90], ports };
}
const isBfit = g => g?.kind === 'vessel' && g.vesselType === 'bfit';
const hasCheck = g => (g?.fittings || []).some(f => f.kind === 'check');
// Flow meters (Fritz, 2026-10-22): liquid passes either way. One shows its Flow meter Device (rate and total), the other a
// Temperature Probe as well. The reading shows above the picture.
const METERS = ['flowMeter', 'flowMeterTemp'];
function meterText(g) {
  const out = [];
  for (const f of (g.fittings || []).filter(f => METERS.includes(f.kind))) {
    const e = f.meter && L().elements.find(x => x.name === f.meter), v = e ? S.values[e.name] || {} : null;
    if (e) out.push(`${fmtVal(e, v.rate ?? 0)} ${e.units || 'gal'}/min · ${fmtVal(e, v.total ?? 0)} ${e.units || 'gal'}`);
    const t = f.kind === 'flowMeterTemp' && f.probe && L().elements.find(x => x.name === f.probe);
    if (t) { const tv = S.values[t.name]?.value; out.push(tv === undefined || tv === null ? '--' : `${fmtVal(t, tv)} ${t.units || '°F'}`); }
  }
  return out.join(' · ');
}
function updateMeters() { for (const n of $$('#ws .fmRead')) { const g = L().graphics.find(x => x.id === n.dataset.gid); if (g) n.textContent = meterText(g); } }
// Skynet Fittings (Fritz, 2026-10-22): a Tab_Fitting made from a Skynet Template is one unit. Every opening has a two-way IP
// built in, sitting on the opening of the picture: it can't be moved, unbundled or set. Its Properties have Flip Horizontal,
// Flip Vertical and Rotate (in steps of 45 degrees) instead, and the picture and its IPs follow. Fittings built from a
// User Template keep their own IP settings.
function isUnit(g) { return isBfit(g) && g.templateCls === 'skynet'; }
// Skynet vessels (Fritz, 2026-10-22): a Tab_Vessel made from a Skynet Vessel Template is one unit too. Each opening has its IP
// built in where the Template puts it; they can't be moved, set or unbundled. It has Flip Horizontal, Flip Vertical and Rotate
// like a Skynet Fitting (Fritz, 2026-10-23). Vessels made from a User Template keep their port settings.
function isSkyV(g) { return g?.kind === 'vessel' && !isBfit(g) && !!g.template && g.templateCls === 'skynet'; }
const ROTATE = [0, 45, 90, 135, 180, 225, 270, 315].map(d => [String(d), d ? d + ' degrees clockwise' : 'Not rotated']);
function unitRot(g) { return ((Math.round((+(g.rot ?? g.turn) || 0) / 45) * 45) % 360 + 360) % 360; }    // an older Turn counts as a Rotate
const unitTransform = g => `rotate(${unitRot(g)}deg) scale(${g.flipH ? -1 : 1},${g.flipV ? -1 : 1})`;
// a point of the picture as drawn in its file (fractions of its width and height) -> where it is on the Tab: flipped, then
// rotated about the middle, the same way the picture is (unitTransform)
function unitPoint(g, fx, fy) {
  const [w, hh] = picWH(g), a = unitRot(g) * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
  const dx = (fx - 0.5) * w * (g.flipH ? -1 : 1), dy = (fy - 0.5) * hh * (g.flipV ? -1 : 1);
  return [(g.x || 0) + (g.w || 90) / 2 + dx * c - dy * sn, (g.y || 0) + (g.h || 90) / 2 + dx * sn + dy * c];
}
// a Skynet vessel standing on its side (rotated 90 or 270): its box is wide where its picture is tall, so the picture keeps its shape
const sideways = g => isSkyV(g) && unitRot(g) % 180 === 90;
const picWH = g => sideways(g) ? [g.h || 90, g.w || 90] : [g.w || 90, g.h || 90];
// put a Skynet Fitting's IPs back on its openings (after a resize, a flip or a rotate), and the End Caps on them
function placeUnitParts(g) {
  if (isSkyV(g)) return placeVesselParts(g);
  if (!isUnit(g)) return;
  const caps = draft.graphics.filter(isCap);
  for (const ip of draft.graphics.filter(x => x.kind === 'ip' && x.attachTo === g.id && x.port && eqClass(g).ports[x.port])) {
    const [cx, cy] = vPortXY(g, ip.port);
    Object.assign(ip, { workspace: g.workspace, x: Math.round(cx - (ip.w || 30) / 2), y: Math.round(cy - (ip.h || 30) / 2), labelVisible: false });   // no IP names on the Tab: the fitting is the unit
    const n = $(`#ws .gfx[data-gid="${CSS.escape(ip.id)}"]`); if (n) place(n, ip);
    for (const c of caps.filter(c => c.capOn === ip.id)) { capOnto(c, ip); const cn = $(`#ws .gfx[data-gid="${CSS.escape(c.id)}"]`); if (cn) place(cn, c); }
  }
}
// orientation as a 2x2 matrix [a, b, c, d] (flip first, then rotate, as unitTransform), and back
function orientM(g) { const r = unitRot(g) * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), x = g.flipH ? -1 : 1, y = g.flipV ? -1 : 1; return [c * x, -s * y, s * x, c * y]; }
const mMul = (m, n) => [m[0] * n[0] + m[1] * n[2], m[0] * n[1] + m[1] * n[3], m[2] * n[0] + m[3] * n[2], m[2] * n[1] + m[3] * n[3]];
const mT = m => [m[0], m[2], m[1], m[3]];          // the inverse of a turn or flip
function setOrient(g, m) {        // any turn and flip is a rotation, or Flip Horizontal then a rotation
  const flip = m[0] * m[3] - m[1] * m[2] < 0, rot = Math.round((flip ? Math.atan2(-m[2], -m[0]) : Math.atan2(m[2], m[0])) * 180 / Math.PI / 45) * 45;
  delete g.flipV; delete g.turn; if (flip) g.flipH = true; else delete g.flipH;
  const r = (rot % 360 + 360) % 360; if (r) g.rot = r; else delete g.rot;
}
// a Skynet vessel flipped or rotated in its Properties: its port IPs, the fittings on its ports (with their IPs and End Caps)
// turn about its middle the same way, and a Skynet Fitting on it turns its picture too
function turnVesselParts(v, before) {
  const M = mMul(orientM(v), mT(orientM(before)));
  if (Math.abs(M[0] - 1) < 1e-9 && Math.abs(M[3] - 1) < 1e-9) return;
  const bc = [(before.x || 0) + (before.w || 200) / 2, (before.y || 0) + (before.h || 200) / 2], nc = [(v.x || 0) + (v.w || 200) / 2, (v.y || 0) + (v.h || 200) / 2];
  const fits = draft.graphics.filter(g => isBfit(g) && g.onVessel === v.id), ips = new Set([v, ...fits].flatMap(o => draft.graphics.filter(g => g.kind === 'ip' && g.attachTo === o.id).map(g => g.id)));
  for (const g of [...fits, ...draft.graphics.filter(g => ips.has(g.id) || (isCap(g) && ips.has(g.capOn)))]) {
    const w = g.w || 30, hh = g.h || 30, dx = (g.x || 0) + w / 2 - bc[0], dy = (g.y || 0) + hh / 2 - bc[1];
    g.x = Math.round(nc[0] + M[0] * dx + M[1] * dy - w / 2); g.y = Math.round(nc[1] + M[2] * dx + M[3] * dy - hh / 2);
  }
  for (const f of fits.filter(isUnit)) setOrient(f, mMul(M, orientM(f)));
}
// a Skynet vessel's port IPs back on their spots (after a resize or a flip); the fittings joined to a port go along
function placeVesselParts(v) {
  for (const ip of draft.graphics.filter(x => x.kind === 'ip' && x.attachTo === v.id && x.port && v.ports?.[x.port])) {
    const [ox, oy] = ipCenter(ip), [cx, cy] = vPortXY(v, ip.port, v.ports[ip.port].position), dx = Math.round(cx - ox), dy = Math.round(cy - oy);
    Object.assign(ip, { workspace: v.workspace, x: (ip.x || 0) + dx, y: (ip.y || 0) + dy, labelVisible: false });
    const n = $(`#ws .gfx[data-gid="${CSS.escape(ip.id)}"]`); if (n) place(n, ip);
    for (const f of draft.graphics.filter(g => isBfit(g) && g.onVessel === v.id && g.onPort === ip.port)) {
      const ids = new Set(draft.graphics.filter(g => g.kind === 'ip' && g.attachTo === f.id).map(g => g.id));
      for (const g of [f, ...draft.graphics.filter(g => ids.has(g.id) || (isCap(g) && ids.has(g.capOn)))]) {
        Object.assign(g, { workspace: v.workspace, x: (g.x || 0) + dx, y: (g.y || 0) + dy });
        const gn = $(`#ws .gfx[data-gid="${CSS.escape(g.id)}"]`); if (gn) place(gn, g);
      }
      placeUnitParts(f);
    }
  }
  for (const c of draft.graphics.filter(c => isCap(c) && c.capOn)) { const ip = draft.graphics.find(x => x.id === c.capOn && x.attachTo === v.id); if (ip) capOnto(c, ip); }
}
// End Cap (Fritz, 2026-10-22): a Skynet fitting with no IP. Dropped on an opening (an IP with no pipe on it) it closes it:
// that IP is hidden, no pipe can join it and no flow passes. It then moves with what it caps; drag it off to take it away.
function isCap(g) { return isUnit(g) && isCapOnly(g); }
function cappedIps() { return new Set(L().graphics.filter(g => isCap(g) && g.capOn).map(g => g.capOn)); }
function capOnto(c, ip) { const [cx, cy] = ipCenter(ip); Object.assign(c, { capOn: ip.id, labelVisible: false, workspace: ip.workspace, x: Math.round(cx - (c.w || 40) / 2), y: Math.round(cy - (c.h || 40) / 2) }); }
function snapCap(c) {
  const [cx, cy] = [(c.x || 0) + (c.w || 40) / 2, (c.y || 0) + (c.h || 40) / 2], taken = new Set(draft.graphics.filter(g => isCap(g) && g !== c && g.capOn).map(g => g.capOn));
  let best = null;
  for (const ip of draft.graphics.filter(g => g.kind === 'ip' && g.workspace === c.workspace && !taken.has(g.id) && !pipesOn(g.id, g.workspace).length)) {
    const [x, y] = ipCenter(ip), d = Math.hypot(x - cx, y - cy);
    if (d < 30 && (!best || d < best.d)) best = { d, ip };
  }
  if (best) { capOnto(c, best.ip); toast(`End Cap on ${best.ip.label || best.ip.name || 'the opening'}: it is closed`); }
  else if (c.capOn) { delete c.capOn; toast('End Cap taken off: the opening is open again'); }
}
// a valve in a Tab_Fitting: a valve Device (closed while off) or a manual valve IP widget (closed until opened)
function valveShut(name) {
  const e = L().elements.find(x => x.name === name);
  if (e) return e.subtype === 'propValve' ? !(propPct(e) > 0) : !isOn(name);
  const g = L().graphics.find(x => x.id === name && x.kind === 'ip');
  return !!g && g.fitting === 'manualValve' && !g.open;
}
const bfitClosed = f => (f.fittings || []).some(x => x.kind === 'valve' && x.valve && valveShut(x.valve));
// every part that moves with a vessel: its port IPs, the Tab_Fittings joined to it and their IPs
function bundleParts(v) {
  const out = draft.graphics.filter(g => g.kind === 'ip' && g.attachTo === v.id);
  for (const f of draft.graphics.filter(g => isBfit(g) && g.onVessel === v.id)) out.push(f, ...draft.graphics.filter(g => g.kind === 'ip' && g.attachTo === f.id));
  const ips = new Set(out.filter(g => g.kind === 'ip').map(g => g.id));
  out.push(...draft.graphics.filter(g => isCap(g) && ips.has(g.capOn)));       // and the End Caps on any of those IPs
  return out;
}
// a free Tab_Fitting dropped with its Start on a vessel port joins that vessel: the Start IP goes, flow passes between them
function joinFitting(f) {
  const st = draft.graphics.find(g => g.kind === 'ip' && g.attachTo === f.id && g.port === 'start'); if (!st) return;
  const [cx, cy] = ipCenter(st);
  const ip = draft.graphics.find(g => g.kind === 'ip' && g.port && g.workspace === f.workspace && g.attachTo !== f.id && !isBfit(draft.graphics.find(v => v.id === g.attachTo)) &&
    Math.hypot(ipCenter(g)[0] - cx, ipCenter(g)[1] - cy) < 24);
  const v = ip && draft.graphics.find(x => x.id === ip.attachTo && x.kind === 'vessel'); if (!v) return;
  Object.assign(f, { onVessel: v.id, onPort: ip.port });
  delete f.ports?.start;
  const [px, py] = ipCenter(ip), dx = Math.round(px - cx), dy = Math.round(py - cy);     // it snaps onto the port
  for (const g of [f, ...draft.graphics.filter(g => g.kind === 'ip' && g.attachTo === f.id)]) { g.x = (g.x || 0) + dx; g.y = (g.y || 0) + dy; }
  draft.graphics = draft.graphics.filter(g => g !== st);
  for (const g of draft.graphics) { if (g.from === st.id) delete g.from; if (g.to === st.id) delete g.to; }
  toast(`${f.name} joined ${v.name || v.label} at its ${eqClass(v).ports[ip.port]?.name || ip.port}`);
}

// a Skynet Fitting taken off its vessel port: it gets its Start IP back and is a bundle of its own
function unjoinUnit(f) {
  delete f.onVessel; delete f.onPort; f.bundled = true; f.labelVisible = true;
  const d = bfitClass(f).ports.start; if (!d) return;
  f.ports = { ...f.ports, start: { installed: true, position: portDefPos(d), standard: stdShort(fittingPortStd(f, 'start')) } };
  syncVesselPorts(f, null); placeUnitParts(f);
}
// the settings as flat fields for the forms, and back
function stdToFields(w) { w.std_type = w.std?.type; w.std_size = w.std?.size; return w; }
function stdFromFields(w) {
  w.std = w.std_type ? { type: w.std_type, ...(w.std_size !== undefined && w.std_size !== '' ? { size: textSize(w.std_type) ? String(w.std_size) : +w.std_size } : {}) } : undefined;
  delete w.std_type; delete w.std_size; if (!w.std) delete w.std;
  return w;
}
const stdFields = (w, what = 'Connection Standard') => [['std_type', what, 'sel', [['', '(none)'], ...Object.entries(CONNECTION_STANDARDS)], true],
  ...(w.std_type ? [['std_size', textSize(w.std_type) ? 'Size (text, for example DN25)' : 'Size (for example 1.5)', textSize(w.std_type) ? 'text' : 'num']] : [])];
function fitToFields(w) {
  (w.fittings || []).forEach((f, i) => { w['f' + i] = f.kind; w['tw' + i] = !!f.thermowell; w['twp' + i] = f.thermowellPos; w['fv' + i] = f.valve; w['fp' + i] = f.probe; w['fm' + i] = f.meter; w['rs' + i] = f.toSize; });
  return stdToFields(w);
}
function fitFromFields(w) {
  w.fittings = FITTING_SLOTS.map((_, i) => {
    const f = { kind: w['f' + i] || 'none' };
    if (f.kind === 'tee' && w['tw' + i]) { f.thermowell = true; f.thermowellPos = w['twp' + i] || 'short'; if (w['fp' + i]) f.probe = w['fp' + i]; }
    if (f.kind === 'valve' && w['fv' + i]) f.valve = w['fv' + i];
    if (f.kind === 'reducer' && w['rs' + i]) f.toSize = String(w['rs' + i]);
    if (METERS.includes(f.kind) && w['fm' + i]) f.meter = w['fm' + i];          // a flow meter: its Flow meter Device (and probe), picked on the Tab
    if (f.kind === 'flowMeterTemp' && w['fp' + i]) f.probe = w['fp' + i];
    for (const k of ['f', 'tw', 'twp', 'fv', 'fp', 'fm', 'rs']) delete w[k + i];
    return f;
  });
  return stdFromFields(w);
}
// the fittings, one dropdown each; on a Tab the valve and the probe are picked too
function fittingSlotFields(w, onTab) {
  const valves = onTab ? [['', 'None'], ...L().elements.filter(e => e.subtype === 'valve' || e.subtype === 'propValve').map(e => [e.name, e.name + ' (Device)']),
    ...L().graphics.filter(g => g.kind === 'ip' && g.fitting === 'manualValve' && g.workspace === w.workspace).map(g => [g.id, (g.name || g.label || g.id) + ' (manual valve Widget)'])] : null;
  const probes = onTab ? [['', 'None'], ...L().elements.filter(e => e.type === 'temperature').map(e => [e.name, e.name])] : null;
  const meters = onTab ? [['', 'None'], ...L().elements.filter(e => e.type === 'flowMeter').map(e => [e.name, e.name])] : null;
  return FITTING_SLOTS.flatMap((label, i) => {
    const k = w['f' + i] || 'none';
    return [['f' + i, label, 'sel', Object.entries(FITTING_KINDS), true],
      ...(k === 'valve' ? [onTab ? ['fv' + i, 'Valve: Select Device, Widget or None', 'sel', valves] : ['_v' + i, 'Valve: Select Device, Widget or None (picked when it is on a Tab)', 'note']] : []),
      ...(METERS.includes(k) ? [onTab ? ['fm' + i, 'Flow Meter: Select Flow meter Device or None', 'sel', meters] : ['_m' + i, 'Flow Meter: Select Flow meter Device or None (picked when it is on a Tab)', 'note']] : []),
      ...(k === 'flowMeterTemp' ? [onTab ? ['fp' + i, 'Temperature: Select Temperature Probe or None', 'sel', probes] : ['_t' + i, 'Temperature: Select Temperature Probe or None (picked when it is on a Tab)', 'note']] : []),
      ...(k === 'reducer' ? [['rs' + i, 'Other end size (it goes from the size before it to this size, up or down)', 'text']] : []),
      ...(k === 'tee' ? [['tw' + i, 'Thermowell in this tee (it stops flow: that side has no IP)', 'yn', false, true],
        ...(w['tw' + i] ? [['twp' + i, 'Position of Thermowell', 'sel', Object.entries(THERMOWELL_POS)],
          onTab ? ['fp' + i, 'Temperature Probe: Select Temperature Probe or None', 'sel', probes] : ['_p' + i, 'Temperature Probe: Select Temperature Probe or None (picked when it is on a Tab)', 'note']] : [])] : [])];
  });
}
// Vessel Template ports: switched on, a port with a fitting place picks its Bundled Fitting (Skynet, User, New or Clone)
function vesselTplToFields(t) {
  const C = EQ[t.vesselType] || EQ.vessel;
  if (C.ports.in2) t.liquidPorts = String(t.liquidPorts || (t.ports?.in2?.installed ? 4 : 2));
  for (const [k, d] of Object.entries(C.ports)) { const q = t.ports?.[k]; t[k + '_on'] = q ? !!q.installed : !!d.on; t[k + '_pos'] = q?.position; t[k + '_fit'] = q?.fitting || ''; }
  return stdToFields(t);
}
function vesselTplFromFields(w, old) {
  const C = EQ[w.vesselType] || EQ.vessel;
  w.ports = {};
  for (const [k, d] of Object.entries(C.ports)) {
    const p = { installed: !!w[k + '_on'], position: w[k + '_pos'] || portDefPos(d) };
    if ((k === 'in2' || k === 'out2') && C.ports.in2) p.installed = String(w.liquidPorts) === '4';     // 2 or 4 liquid ports
    const fit = FITTING_PORTS[k] && p.installed && w[k + '_fit'] && !w[k + '_fit'].startsWith('__') ? w[k + '_fit'] : '';
    if (fit) { p.fitting = fit; const was = old?.ports?.[k]; if (was?.fitting === fit && was.bundleName) p.bundleName = was.bundleName; }
    w.ports[k] = p;
  }
  for (const k of Object.keys(w)) if (/_(on|pos|fit)$/.test(k)) delete w[k];
  return stdFromFields(w);
}
const portTitle = (k, d) => FITTING_PORTS[k] || d.name;
function vesselTplFields(w) {
  const C = EQ[w.vesselType] || EQ.vessel, isV = w.vesselType === 'vessel', ferm = isV && w.vtype === 'Fermenter', u = volUnit(w.units);
  const types = isV ? Object.keys(VESSEL_TYPES).filter(t => !['MLT', 'Whirlpool'].includes(t) || t === w.vtype) : C.types;
  const heat = isV && !ferm ? heatKindsFor(w.vtype || types[0]) : [];
  if (heat.length && !heat.includes(w.heatKind)) w.heatKind = heat[0];
  const equip = w.vesselType !== 'vessel', twoOrFour = C.ports.in2 && C.ports.out2;
  const fits = [['', '(none)'], ...(TPL?.fitting || []).map(f => [f.name, f.name + (f.cls === 'skynet' ? ' (Skynet)' : ' (User)')]), ['__new', 'New ...'], ['__clone', 'Clone ...']];
  return [['_c', tplClassNote(w), 'note'], ['name', 'Template Name (no spaces)', 'text'],
    ['vesselType', 'Kind', 'sel', Object.entries(VESSEL_KINDS).filter(([k]) => equip === (k !== 'vessel')), true],
    ...(twoOrFour ? [['liquidPorts', 'Liquid ports', 'sel', [['2', '2 (1 in, 1 out)'], ['4', '4 (2 ins, 2 outs: two circuits that never mix)']], true]]
      : equip ? [['_lp', `Liquid ports: ${Object.values(C.ports).filter(d => d.ip).length} (${w.vesselType === 'pchiller' ? '2 ins, 2 outs: wort and water never mix' : '1 in, 1 out'})`, 'note']] : []),
    ['vtype', 'Type', 'sel', types, true],
    ...(isV && w.vtype === 'Other' ? [['otherType', 'Other Type (what it is)', 'text']] : []),
    ['image', 'Graphic (picture path)', 'path'],
    ['_s', 'Size', 'head'], ['units', 'Units', 'sel', Object.entries(UNIT_SYSTEMS)],
    ...(ferm ? [['maxVolume', `Largest batch (${u})`, 'num'], ['minVolume', `Smallest batch (${u})`, 'num'], ['extraTrub', `Trub loss, left in the fermenter (${u})`, 'num']]
      : [['volume', `Size (${u})`, 'num'], ['deadspace', `Dead space, left in the bottom (${u})`, 'num'], ...(isV ? [['extraTrub', `Extra trub loss (${u})`, 'num']] : [])]),
    ...(heat.length ? [['_h', 'Heat', 'head'], ['heatKind', 'Heat Source', 'sel', heat.map(k => [k, HEAT_KINDS[k]]), true],
      ...(w.heatKind === 'other' ? [['otherHeat', 'Other heat source (what it is)', 'text']] : []),
      ['_hd', 'The Device that heats it, and its probe, are picked on the Tab_Vessel.', 'note']] : []),
    ['_cs', 'Connection Standard', 'head'], ...stdFields(w, 'Connection Standard (the default for every port and Bundled Fitting)'),
    ['_cn', 'It goes on the Equipment list and sets the default size of the pictures. A Bundled Fitting can have its own.', 'note'],
    ['_p', 'Ports', 'head'],
    ...Object.entries(C.ports).filter(([k]) => !(twoOrFour && (k === 'in2' || k === 'out2') && String(w.liquidPorts) !== '4')).flatMap(([k, d]) => [[k + '_on', portTitle(k, d) + ' installed' + (d.ip ? '' : ' (not an IP)'), 'yn', false, true],
      ...(w[k + '_on'] ? [[k + '_pos', portTitle(k, d) + ' position', 'sel', d.pos.map(q => q[0])],
        ...(FITTING_PORTS[k] ? [[k + '_fit', `Bundled Fitting on the ${portTitle(k, d)}`, 'sel', fits]] : [])] : [])]),
    ['notes', 'Notes', 'area']];
}
function fittingTplFields(w) {
  return [['_c', tplClassNote(w), 'note'], ['name', 'Template Name (no spaces)', 'text'],
    ['_cs', 'Connection Standard', 'head'], ...stdFields(w, 'Connection Standard (empty = the vessel\'s)'),
    ['_f', 'Fittings (from the vessel port outward)', 'head'], ...fittingSlotFields(w, false),
    ['_g', 'Graphic', 'head'],
    w.cls === 'skynet' ? ['image', 'Graphic (a Skynet picture)', 'sel', [['', '(the one that matches the fittings)'], ...SKYNET_FIT_PICS.map(p => [p, p.split('/').pop()])]] : ['image', 'Graphic (picture path)', 'path'],
    ['notes', 'Notes', 'area']];
}

// a small pop-up with a few fields (a name, a Tab ...). Resolves true when its button is pressed.
function miniDialog(title, fields, obj, okText = 'Save') {
  return new Promise(res => {
    const body = h('div', { class: 'menuForm' });
    bindForm(body, fields, obj);
    const d = h('dialog', { class: 'tplMini' }, h('h3', {}, title), body);
    const done = ok => {
      if (ok) { try { readFields(obj, body); } catch (e) { return toast(e.message, true); } }
      d.close(); d.remove(); res(ok);
    };
    d.append(h('div', { class: 'bar' }, h('span', { class: 'spacer' }), h('button', { onclick: () => done(false) }, 'Cancel'), h('button', { class: 'primary', onclick: () => done(true) }, okText)));
    d.oncancel = ev => { ev.preventDefault(); done(false); };
    document.body.append(d); d.showModal();
  });
}
const skynetField = () => TPL?.locked ? [] : [['skynet', 'Skynet Template (Skynet is still building them; off = a User Template)', 'bool']];
// a new Template, blank or a copy of another. Returns its name.
async function newTemplate(kind, { from, body, std, init, what = TEMPLATE_KINDS[kind] } = {}) {
  const w = { name: from ? copyName(from, tplNames(kind)) : kind === 'vessel' ? 'My_Vessel' : 'My_Fitting', skynet: true };
  if (init?.vesselType) w.name = 'My_Equipment';
  if (!from && tplOf(kind, w.name)) w.name = copyName(w.name, tplNames(kind));
  const ok = await miniDialog(from ? `Clone ${from}` : `New ${what}`, [['_n', 'Change the name to what you want. No spaces (use _ instead), and it must be unique.', 'note'],
    ['name', 'Template Name', 'text'], ...skynetField()], w, 'Save');
  if (!ok) return null;
  const name = (w.name || '').trim(), bad = nameProblem(name); if (bad) throw new Error(bad);
  let r = await api('POST', `/ui/templates/${kind}`, { name, from, skynet: TPL.locked ? false : !!w.skynet });
  if (body || std || init) r = await api('PUT', `/ui/templates/${kind}/${name}`, { ...(init || {}), ...(body || {}), ...(std && !body ? { std } : {}), name });   // a clone gets the settings showing in the pop-up
  setTPL(r);
  toast(`${what} "${name}" made`);
  return name;
}

// the pop-up of one Template: its settings, and Close ✕, Clone, Add to Tab, (Add to Vessel), Save, Delete, Cancel
function openTemplate(kind, name) {
  return new Promise(async done => {
    await loadMediaPictures();
    const t = tplOf(kind, name); if (!t) return done();
    const admin = can('admin'), ed = admin && t.editable;
    const work = kind === 'vessel' ? vesselTplToFields(clone(t)) : fitToFields(clone(t));
    let dirty = false;
    const body = h('div', { class: 'menuForm' });
    const build = bindForm(body, kind === 'vessel' ? vesselTplFields : fittingTplFields, work, ev => { dirty = true; portFitPicked(ev); });
    const d = h('dialog', { class: 'tplDlg' });
    const finish = () => { d.close(); d.remove(); if (menuTab === 'vtemplates' || menuTab === 'ftemplates') renderMenuPane(); done(); };
    const close = () => { if (ed && dirty && !confirm('Close without saving your changes?')) return; finish(); };
    // what the form holds now, as a Template
    const current = () => { readFields(work, body); const w = clone(work); return kind === 'vessel' ? vesselTplFromFields(w, t) : fitFromFields(w); };
    // New ... or Clone ... picked as a port's Bundled Fitting
    async function portFitPicked(ev) {
      const k = ev?.target?.dataset?.k; if (!k?.endsWith('_fit') || !ev.target.value.startsWith('__')) return;
      const port = k.slice(0, -4), how = ev.target.value;
      try {
        let made = null;
        if (how === '__new') made = await newTemplate('fitting', { std: current().std });
        else {
          const c = { from: TPL.fitting[0]?.name };
          if (!await miniDialog('Clone a Bundled Fitting', [['from', 'Bundled Fitting to clone (Skynet or User)', 'sel', TPL.fitting.map(f => [f.name, f.name + (f.cls === 'skynet' ? ' (Skynet)' : ' (User)')])]], c, 'Next')) made = null;
          else if (c.from) made = await newTemplate('fitting', { from: c.from });
        }
        readFields(work, body);
        work[port + '_fit'] = made || '';
        build();
        if (made && how === '__new') { await openTemplate('fitting', made); build(); }    // design the new one, then back here
      } catch (e) { toast(e.message, true); work[port + '_fit'] = ''; build(); }
    }
    const save = guard(async () => {
      const b = current(), bad = nameProblem((b.name || '').trim()); if (bad) throw new Error(bad);
      const r = await api('PUT', `/ui/templates/${kind}/${t.name}`, b);
      setTPL(r); dirty = false; toast(`Saved ${r.saved.name}`); finish();
    });
    const del = guard(async () => {
      if (!confirm(`Delete the ${TEMPLATE_KINDS[kind]} "${t.name}"?\n\nTab items made from it stay on their Tabs.`)) return;
      setTPL(await api('DELETE', `/ui/templates/${kind}/${t.name}`)); toast(`Deleted ${t.name}`); finish();
    });
    const cloneIt = guard(async () => { const made = await newTemplate(kind, { from: t.name, body: { ...current(), name: undefined } }); if (made) { dirty = false; finish(); } });
    const toTab = guard(async () => {
      const tabs = S.config.workspaces, eq = tabs.find(x => x.name === 'Equipment');
      const first = kind === 'vessel' && eq ? eq : tabs.find(x => x.name === wsName) || tabs[0];
      const taken = [...S.config.graphics.map(g => g.name), ...S.config.elements.map(e => e.name)];
      // the Build Tab is a clean Tab to work on it first; its name ends with the ID of the Tab you are on
      const idOf = tab => (tab === BUILD ? tabs.find(x => x.name === wsName) || tabs[0] : tabs.find(x => x.name === tab))?.id || tab;
      const w = { tab: first.name }, def = tab => bundleName(t.name, idOf(tab), taken);
      w.name = def(w.tab);
      const ok = await miniDialog('Add to Tab', [['tab', 'Tab', 'sel', [[BUILD, '🔨 Build Tab (a clean Tab to work on it first)'], ...tabs.map(x => [x.name, x.name])]], ['name', 'Name (change it to what you want)', 'text'],
        ['_n', 'It goes on the Tab Bundled, in Edit layout: drag it to its place, then press Save layout. On the Build Tab, press Save Build ... when it is ready.', 'note']], w, 'Add');
      if (!ok) return;
      if (w.name === def(first.name) && w.tab !== first.name) w.name = def(w.tab);    // the name follows the Tab until it is typed
      const b = current(); finish();
      addTemplateToTab(kind, { ...t, ...b, name: t.name, cls: t.cls }, w.tab, noSpaces(w.name || def(w.tab)));
    });
    const toVessel = guard(async () => {
      const vs = TPL.vessel.filter(v => v.editable && can('admin'));
      if (!vs.length) throw new Error('There is no Vessel Template that can be changed. Clone one first.');
      const w = { vessel: vs[0].name, port: 'outlet' }, def = () => bundleName(t.name, w.vessel, []);
      const ok = await miniDialog('Add to Vessel Template', [['vessel', 'Vessel Template', 'sel', vs.map(v => v.name)], ['port', 'On its', 'sel', Object.entries(FITTING_PORTS)],
        ['name', 'Name (empty = bndl#_FittingName_VesselName; change it to what you want)', 'text']], w, 'Add');
      if (!ok) return;
      const v = tplOf('vessel', w.vessel), ports = clone(v.ports || {});
      const d0 = (EQ[v.vesselType] || EQ.vessel).ports[w.port]; if (!d0) throw new Error(`A ${VESSEL_KINDS[v.vesselType]} has no ${FITTING_PORTS[w.port]}`);
      ports[w.port] = { ...(ports[w.port] || {}), installed: true, position: ports[w.port]?.position || portDefPos(d0), fitting: t.name, bundleName: noSpaces(w.name || '') || def() };
      setTPL(await api('PUT', `/ui/templates/vessel/${v.name}`, { ...v, ports }));
      toast(`${t.name} is now on the ${FITTING_PORTS[w.port]} of ${v.name}`);
    });
    const btns = () => h('div', { class: 'bar' },
      t.deletable && admin ? h('button', { class: 'danger', onclick: del }, 'Delete') : '',
      admin ? h('button', { title: 'A copy under a new name', onclick: cloneIt }, 'Clone') : '',
      admin ? h('button', { title: 'Put a copy on a Tab', onclick: toTab }, 'Add to Tab') : '',
      admin && kind === 'fitting' ? h('button', { title: 'Put it on a port of a Vessel Template', onclick: toVessel }, 'Add to Vessel') : '',
      h('span', { class: 'spacer' }), h('button', { onclick: close }, 'Cancel'), ed ? h('button', { class: 'primary', onclick: save }, 'Save') : '');
    d.append(h('div', { class: 'tplHead' }, h('h3', {}, `${TEMPLATE_KINDS[kind]}: ${t.name} `, h('span', { class: 'tplBadge ' + t.cls }, t.cls === 'skynet' ? 'Skynet' : 'User'),
      ' ', helpIcon(['vessel-and-fitting-templates', kind === 'vessel' ? 'vessel-template-settings' : 'bundled-fitting-template-settings'], () => { finish(); })),
      h('button', { class: 'tplX', title: 'Close', onclick: close }, '✕')),
      btns(), h('fieldset', { class: 'menuSet', ...(ed ? {} : { disabled: true }) }, body), btns());
    d.oncancel = ev => { ev.preventDefault(); close(); };
    document.body.append(d); d.showModal();
  });
}

// the Vessel Templates and Fitting Templates Menu tabs: small icons with names, double-click for the pop-up
function renderTemplatesTab(kind, group) { return box => {
  const title = group === 'equip' ? 'Equipment Templates' : kind === 'vessel' ? 'Vessel Templates' : 'Fitting Templates', what = group === 'equip' ? 'Equipment Template' : TEMPLATE_KINDS[kind];
  box.append(h('h3', {}, title));
  if (!TPL) { box.append(h('p', { class: 'muted' }, 'Loading ...')); loadTemplates().then(() => renderMenuPane()).catch(e => toast(e.message, true)); return; }
  if (!TPL.locked) box.append(h('p', { class: 'muted' }, 'Skynet is still building its Templates: for now Skynet Templates can be changed here. Once they are locked they can only be cloned.'));
  if (can('admin')) box.append(h('div', { class: 'bar' }, h('button', { onclick: guard(async () => { const n = await newTemplate(kind, { init: group === 'equip' ? { vesselType: 'pchiller', vtype: EQ.pchiller.types[0], liquidPorts: 4 } : null, what }); if (n) { renderMenuPane(); openTemplate(kind, n); } }) }, `New ${what} ...`),
    h('span', { class: 'muted' }, 'Double-click a Template for its settings.')));
  const grid = h('div', { class: 'tplGrid' });
  const list = TPL[kind].filter(t => !group || (group === 'equip') === (t.vesselType && t.vesselType !== 'vessel'));
  for (const t of list) {
    const open = () => openTemplate(kind, t.name);
    grid.append(h('button', { class: 'tplIcon ' + t.cls, title: `${t.name} (${t.cls === 'skynet' ? 'Skynet' : 'User'} Template). Double-click for its settings.`, ondblclick: open, onkeydown: ev => { if (ev.key === 'Enter') open(); } },
      h('img', { src: media(tplIcon(kind, t)), alt: '' }), h('span', { class: 'tplName' }, t.name), t.cls === 'skynet' ? h('span', { class: 'tplBadge skynet' }, 'Skynet') : ''));
  }
  if (!list.length) grid.append(h('p', { class: 'muted' }, 'No Templates yet.'));
  box.append(grid);
}; }

// Add to Tab: the copy goes on the Tab in Edit layout, Bundled, so it can be dragged to its place before Save layout
const BUILD = '__build';
function addTemplateToTab(kind, t, tab, name) {
  if (editing) return toast('Save or exit Edit layout first', true);
  setEditing(true);
  if (tab === BUILD) tab = toBuild().name;
  if (!draft.workspaces.some(w => w.name === tab)) return toast(`There is no Tab "${tab}"`, true);
  wsName = tab;
  const g = kind === 'vessel' ? placeTabVessel(t, tab, name) : placeTabFitting(t, tab, name, null);
  sel = { kind: 'gfx', id: g.id };
  renderTabs(); renderWs();
  toast(buildWs()?.name === tab ? `${name} is on the Build Tab. Change it there, then press Save Build ... to put it on a Tab or save it as a Template.` : `${name} is on the ${tab} tab. Drag it to its place, then press Save layout.`);
}
function placeTabVessel(t, tab, name) {
  const C = EQ[t.vesselType] || EQ.vessel, n = draft.graphics.filter(x => eqClass(x) && x.workspace === tab).length;
  const g = { id: newId(), kind: 'vessel', vesselType: EQ[t.vesselType] ? t.vesselType : 'vessel', workspace: tab, x: 60 + (n % 5) * 280, y: 60 + Math.floor(n / 5) * 340, w: (t.size || C.size)[0], h: (t.size || C.size)[1],
    labelAlign: 'above', labelSize: 16, labelVisible: true, name, template: t.name, templateCls: t.cls, image: t.image || C.image, bundled: true, ports: {} };
  for (const k of ['vtype', 'otherType', 'units', 'volume', 'deadspace', 'extraTrub', 'maxVolume', 'minVolume', 'heatKind', 'otherHeat', 'std', 'notes']) if (t[k] !== undefined) g[k] = clone(t[k]);
  for (const [k, d] of Object.entries(C.ports)) {
    const q = t.ports?.[k]; if (!q?.installed) continue;
    g.ports[k] = { installed: true, position: q.position || portDefPos(d), standard: stdShort(q.std || t.std) };
  }
  draft.graphics.push(g); syncVesselPorts(g, null);
  const taken = () => [...draft.graphics.map(x => x.name), ...draft.elements.map(e => e.name)];
  for (const k of Object.keys(FITTING_PORTS)) {
    const q = t.ports?.[k], ft = q?.installed && q.fitting && tplOf('fitting', q.fitting); if (!ft) continue;
    placeTabFitting({ ...ft, std: ft.std || t.std }, tab, q.bundleName && !taken().includes(q.bundleName) ? q.bundleName : bundleName(ft.name, t.name, taken()), { vessel: g, port: k });
  }
  placeUnitParts(g);
  return g;
}
// a Tab_Fitting, alone on a Tab or joined to a port of a Tab_Vessel (it then runs out from that port, away from the vessel)
function placeTabFitting(ft, tab, name, on) {
  const cap = isCapOnly(ft), f = { id: newId(), kind: 'vessel', vesselType: 'bfit', workspace: tab, w: cap ? 40 : 90, h: cap ? 40 : 90, name, template: ft.name, templateCls: ft.cls, fittings: clone(ft.fittings || []),
    image: ft.image || fitImage(ft), labelAlign: 'below', labelSize: 12, labelVisible: !on, ports: {} };     // joined to a vessel: its name shows on hover, not on the Tab
  if (ft.std) f.std = clone(ft.std);
  if (ft.ipPos) f.ipPos = clone(ft.ipPos);
  let dir = 'down';
  if (on) {
    const ip = draft.graphics.find(x => x.kind === 'ip' && x.attachTo === on.vessel.id && x.port === on.port);
    const [cx, cy] = ip ? ipCenter(ip) : vPortXY(on.vessel, on.port, on.vessel.ports[on.port].position);
    const fx = (cx - on.vessel.x) / on.vessel.w, fy = (cy - on.vessel.y) / on.vessel.h;
    dir = fy >= 0.9 ? 'down' : fy <= 0.12 ? 'up' : fx <= 0.1 ? 'left' : fx >= 0.9 ? 'right' : 'down';
    Object.assign(f, { onVessel: on.vessel.id, onPort: on.port, x: Math.round({ down: cx - 45, up: cx - 45, left: cx - 100, right: cx + 10 }[dir]), y: Math.round({ down: cy + 10, up: cy - 100, left: cy - 45, right: cy - 45 }[dir]) });
  } else {
    const n = draft.graphics.filter(x => isBfit(x) && x.workspace === tab).length;
    Object.assign(f, { x: 60 + (n % 8) * 130, y: 60 + Math.floor(n / 8) * 140, bundled: true });
  }
  if (dir === 'left' || dir === 'right') f.flat = true;
  if (isUnit(f) && !f.ipPos && dir === 'up') f.flipV = true;         // a Skynet Fitting is flipped so its far end points away from the vessel
  if (isUnit(f) && !f.ipPos && dir === 'left') f.flipH = true;
  if (isUnit(f) && !on) f.bundled = true;
  const C = bfitClass(f), flip = { Bottom: 'Top', Top: 'Bottom', Left: 'Right', Right: 'Left' };
  for (const [k, d] of Object.entries(C.ports)) {
    let pos = portDefPos(d);
    if ((dir === 'up' || dir === 'left') && !f.ipPos?.[k] && !isUnit(f)) pos = flip[pos] || pos;          // the far end points away from the vessel
    f.ports[k] = { installed: true, position: pos, standard: d.ip ? stdShort(fittingPortStd(f, k)) : '' };
  }
  draft.graphics.push(f); syncVesselPorts(f, null); placeUnitParts(f);
  return f;
}
// the Properties of a Tab_Fitting on a Tab: everything, fully editable (even one from a Skynet Template)
F.tabFitting = it => [['_t', `Tab_Fitting, made from the Bundled Fitting Template ${it.template || '(none)'}. Changing it here does not change the Template.`, 'note'],
  ['name', 'Name', 'text'], ['label', 'Label (empty = the Name)', 'text'], ['image', 'Graphic (picture path)', 'path'],
  ['turn', 'Turn (the picture and its IPs)', 'sel', TURNS],
  ...stdFields(it), ['_f', 'Fittings (from the vessel port outward)', 'head'], ...fittingSlotFields(it, true),
  ['_p', 'IPs', 'head'], ...Object.entries(bfitClass(it).ports).map(([k, d]) => [k + '_pos', d.name + ' position', 'sel', d.pos.map(q => q[0])]),
  ...(it.onVessel ? [['joined', 'Joined to its vessel port (flow passes between them; off = it gets a Start IP of its own)', 'bool']] : []),
  ['_look', 'Label and place', 'head'], ['labelVisible', 'Show label', 'yn', true], ['labelAlign', 'Label position', 'sel', LABEL_POS], ['labelColor', 'Label color', 'color'], ['labelSize', 'Label size', 'num'],
  ['workspace', 'Tab (pipes only join IPs on the same tab)', 'ws'], ['x', 'X (pixels from the left)', 'num'], ['y', 'Y (pixels from the top)', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'lock'],
  ['bundled', 'Bundled with its IPs (move as one unit; no editing until switched off)', 'bool']];
// the Properties of a Skynet Fitting: no IP settings (every opening has its IP built in), and Flip / Rotate for its orientation
F.skynetFitting = it => {
  const made = (it.fittings || []).filter(f => f.kind !== 'none').map(f => FITTING_KINDS[f.kind] + (f.thermowell ? ' with a thermowell' : '')).join(', ');
  const picks = fittingSlotFields(it, true).filter(f => /^f[vpm]\d$/.test(f[0]));       // only the valve and probe it uses are picked here
  return [['_t', isCapOnly(it) ? `Skynet End Cap. Drag it onto an opening to close it; drag it off to open it again.${it.capOn ? ' It is on an opening now.' : ''}` :
      `Skynet Fitting ${it.template || ''}: ${made}. Every opening has a two-way IP built in, so there is nothing to set for them.`, 'note'],
    ['name', 'Name', 'text'], ['label', 'Label (empty = the Name)', 'text'], ...stdFields(it), ...picks,
    ...(isCapOnly(it) ? [] : [['_o', 'Orientation (the picture and its IPs follow)', 'head'], ['flipH', 'Flip Horizontal', 'bool'], ['flipV', 'Flip Vertical', 'bool'], ['rot', 'Rotate', 'sel', ROTATE]]),
    ['_look', 'Label and place', 'head'], ['labelVisible', 'Show label', 'yn', true], ['labelAlign', 'Label position', 'sel', LABEL_POS], ['labelColor', 'Label color', 'color'], ['labelSize', 'Label size', 'num'],
    ...(it.onVessel ? [['_j', 'It sits on a port of its vessel and moves with it.', 'note']] : [['workspace', 'Tab (pipes only join IPs on the same tab)', 'ws'], ['x', 'X (pixels from the left)', 'num'], ['y', 'Y (pixels from the top)', 'num'],
      ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'lock']])];
};

// the Properties of a Skynet vessel: no port or IP settings (its openings have their IPs built in), Flip Horizontal, and the
// Devices that belong to a Schema: its heating element and its Temperature Probe
F.skynetVessel = it => {
  const ports = Object.entries(eqClass(it).ports).filter(([k]) => it.ports?.[k]?.installed).map(([, d]) => d.name).join(', ');
  const elems = [['', 'None'], ...L().elements.filter(e => ['digitalOut', 'pwmOut', 'dutyCycle', 'pid', 'hysteresis'].includes(e.type) && e.subtype !== 'valve' && e.subtype !== 'pump').map(e => [e.name, e.name])];
  const probes = [['', 'None'], ...L().elements.filter(e => e.type === 'temperature').map(e => [e.name, e.name])];
  const electric = it.heatKind === 'electric' || it.ports?.element?.installed, well = it.ports?.thermowell?.installed;
  return [['_t', `Skynet vessel ${it.template}. Its openings (${ports || 'none'}) have their IPs built in, so there is nothing to set for them.`, 'note'],
    ['name', 'Name', 'text'], ['vtype', 'Type', 'vlist', it.vesselType + '.types'], ['label', 'Display Name (the only text on it; empty = the Name)', 'text'],
    ...(electric || well ? [['_d', 'Devices', 'head']] : []),
    ...(electric ? [['heater', 'Heating Element: Select Device or None (it glows while on)', 'sel', elems]] : []),
    ...(well ? [['probe', 'Temperature Probe: Select Temperature Probe or None', 'sel', probes]] : []),
    ['_o', 'Orientation (the picture, its IPs and its fittings follow)', 'head'], ['flipH', 'Flip Horizontal', 'bool'], ['flipV', 'Flip Vertical', 'bool'], ['rot', 'Rotate', 'sel', ROTATE],
    ['_look', 'Display Name and place', 'head'], ['labelVisible', 'Show the Display Name', 'yn', true], ['labelAlign', 'Display Name position', 'sel', LABEL_POS], ['labelColor', 'Display Name color', 'color'], ['labelBg', 'Display Name back color', 'color'], ['labelSize', 'Display Name size (px; empty = the Name font size on the Default tab)', 'num'],
    ['workspace', 'Tab (pipes only join IPs on the same tab)', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'lock']];
};

// draw profile equipment on the loaded Schema's Equipment tab (a fresh drawing, or the old one brought up to date)
async function placeEqItems(p, items) {
  if (editing) return toast('Save or exit Edit layout first', true);
  if (eqDirty) await saveProfile();
  setEditing(true);
  let made = 0, updated = 0;
  for (const it of items) {
    const C = EQ[it.vesselType], tab = tabOfProfile(p.id)?.name || C.tab || 'Equipment';
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
// ---- Default Layout tab: the vessels and pipes that go on a Tab with its Equipment Profile
// A Tab follows its profile's Default Layout (changes on the Tab go into the profile, and every Tab following it shows them),
// or keeps its own layout (Fritz: picking another profile never replaces a Tab's drawing unless you choose it).
function renderLayoutTab(box) {
  const c = S.config, admin = can('admin'), w = eqTab();
  box.append(h('h3', {}, 'Default Layout'));
  const withP = c.workspaces.filter(x => x.equipmentProfile);
  if (!withP.length) return box.append(h('p', { class: 'muted' }, 'No Tab of this Schema has an Equipment Profile yet. Pick or make one on the Equipment Profile tab.'));
  const tabSel = h('select', {}, ...c.workspaces.map(x => h('option', { value: x.name, ...(x === w ? { selected: true } : {}) }, x.name + (x.equipmentProfile ? `  (${profileName(x.equipmentProfile)})` : '  (no profile)'))));
  tabSel.onchange = () => { eqTabName = tabSel.value; renderMenuPane(); };
  box.append(h('div', { class: 'bar menuPick' }, h('span', {}, 'Tab'), tabSel));
  const p = S.profiles.find(x => x.id === w?.equipmentProfile);
  if (!p) return box.append(h('p', { class: 'muted' }, `The Tab "${w?.name}" has no Equipment Profile. Pick or make one on the Equipment Profile tab.`));
  const follows = w.layoutFromProfile !== false, ro = !admin || p.locked;
  const act = (action, ask, done) => guard(async () => { if (!confirm(ask)) return; await api('POST', '/ui/schema/layout', { tab: w.name, action }); await load(); toast(done); });
  const others = (p.usedOn || []).filter(u => !u.active).map(u => `${u.schema} (Tab ${u.tab ?? '?'})`);
  box.append(h('p', {}, `The Default Layout of "${p.name}": `, p.hasDrawing ? h('b', {}, `${p.drawn} equipment, ${p.fittings || 0} fittings and ${p.pipes} pipes${p.layoutTab ? `, drawn on the Tab "${p.layoutTab}"` : ''}`) : h('b', {}, 'none yet')),
    h('p', {}, follows ? `The Tab "${w.name}" follows it: what you draw on it (vessels, fittings, IPs, pipes and hoses) is saved as the Default Layout${others.length ? `, and ${others.join(', ')} show${others.length === 1 ? 's' : ''} it too when they follow it` : ''}.`
      : `The Tab "${w.name}" keeps its own layout. It is not changed by the profile, and its drawing does not change the profile.`),
    p.locked ? h('div', { class: 'eqWarn' }, '🔒 The Equipment Profile is locked, so its Default Layout can\'t be changed.') : '',
    ro ? '' : h('div', { class: 'bar wrap' },
      h('button', { title: 'Open Edit layout on the Tab', onclick: guard(async () => { leaveMenuTab(); wsName = w.name; setEditing(true); if (!follows) toast('This Tab keeps its own layout: the changes stay in this Schema'); }) }, follows ? 'Edit it' : 'Edit this Tab\'s layout'),
      p.hasDrawing ? h('button', { onclick: act('use', `Put the Default Layout of "${p.name}" on the Tab "${w.name}"?\n\nThe equipment, IPs and pipes on this Tab now are replaced. The other Tabs are not touched. A backup of this Schema is made first.`, 'The Tab now shows the Default Layout') }, follows ? 'Load it on this Tab again' : 'Use it on this Tab') : '',
      h('button', { onclick: act('save', `Make the equipment and pipes on the Tab "${w.name}" the Default Layout of "${p.name}"?${others.length ? `\n\n${others.join(', ')} use this profile too and get this layout when they follow it.` : ''}`, 'Saved as the Default Layout') }, 'Save this Tab\'s layout as the Default Layout'),
      follows ? h('button', { onclick: act('keep', `Keep the Tab "${w.name}"'s own layout from now on?\n\nIt stays as it is, and changes to it no longer change the profile's Default Layout.`, 'This Tab keeps its own layout') }, 'Keep this Tab\'s own layout') : ''));
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
  toast('Schema.json saved');
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
// Schema.json: Save as .json file. The file is named after the Schema version (Name_yyyymmddThhmm, ISO 8601) when it has one.
$('#cfgExport').onclick = guard(async () => {
  const sc = S.schemas || { list: [] }, act = sc.active?.id, list = [...sc.list].sort((a, b) => (b.id === act) - (a.id === act));
  if (!list.length) throw new Error('There is no Schema to save yet');
  const w = { id: act || list[0].id };
  const fields = [['id', 'Schema', 'sel', list.map(x => [x.id, x.id === act ? `${x.name}  (loaded)` : x.name])],
    ['_n', 'The file goes to the Downloads folder of this computer. It holds the Schema only (tabs, devices, widgets, pictures, pipes and its Equipment Profile drawing), not logins or panel settings.', 'note']];
  if (cfgDirty) fields.push(['_d', 'The changes in the editor are not saved yet, so they are not in the file. Press Save first to include them.', 'note']);
  if (await dialog('Save a Schema as a .json file', fields, w) !== 'ok') return;
  readFields(w);
  const r = await api('GET', `/ui/schemas/${encodeURIComponent(w.id)}/export`);
  download(r.file, JSON.stringify(r.schema, null, 2), 'application/json');
  toast(`Saved ${r.file}`);
});
window.addEventListener('beforeunload', ev => { if (cfgDirty || dirty) { ev.preventDefault(); ev.returnValue = ''; } });

load().then(() => { soundOnStart(); connect(); setView('workspace'); firstRunSamples(); }).catch(e => toast('Cannot reach the server: ' + e.message, true));
