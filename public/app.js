import { addEyes } from './eye.js';
import { attachAutofill } from './autofill.js';
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
const PALETTE = { '0': '', '1': '#e8833a', '2': '#3fa34d', '3': '#a8c64a', '4': '#c94040', '5': '#3a7be8', '6': '#8a5cd6', '7': '#e8c33a', '8': '#777f88' };
const bg = v => (v === '' || v === null || v === undefined) ? '' : (PALETTE[String(v)] ?? String(v));

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
function toast(msg, bad) { const t = $('#toast'); t.textContent = msg; t.className = 'show' + (bad ? ' bad' : ''); clearTimeout(t._t); t._t = setTimeout(() => t.className = '', bad ? 5000 : 2200); }
const RANK = { viewer: 0, operator: 1, admin: 2 };
const can = need => RANK[S?.me?.role] >= RANK[need];
const guard = fn => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message, true); } };

// ---------------------------------------------------------------- load + live
async function load() {
  S = await api('GET', '/ui/state');
  document.body.classList.remove('role-viewer', 'role-operator', 'role-admin');
  document.body.classList.add('role-' + S.me.role);
  $('#whoName').textContent = `${S.me.name} (${S.me.role})`;
  $('#code').readOnly = !can('admin');
  $('#title').textContent = S.config.title || 'Skynet Brew Panel';
  document.title = S.config.title || 'Skynet Brew Panel';
  if (!wsName || !S.config.workspaces.some(w => w.name === wsName)) wsName = S.config.workspaces[0]?.name;
  fillAddType();
  renderAll();
}
function renderAll() { renderTabs(); renderWs(); renderScripts(); renderGlobals(); renderDevices(); renderSettings(); renderMqtt(); renderConsole(); renderSimBar(); }

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
  if (v === 'workspace') fitZoom();
  if (v === 'log') loadLogNames();
  if (v === 'settings') { $('#recShow').classList.add('hidden'); renderUsers().then(renderRecovery).then(renderMessaging).then(() => renderContact(S.me.name)).catch(e => toast(e.message, true)); }
}

// ---------------------------------------------------------------- workspaces
const L = () => editing ? draft : S.config;          // layout being shown
const curWs = () => L().workspaces.find(w => w.name === wsName) || L().workspaces[0];

function renderTabs() {
  const t = $('#wsTabs'); t.innerHTML = '';
  for (const w of L().workspaces) t.append(h('button', { class: w.name === wsName ? 'active' : '', onclick: () => { wsName = w.name; sel = null; renderTabs(); renderWs(); } }, w.name));
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
  ws.style.backgroundColor = w.color || '';
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
  for (const g of L().graphics.filter(g => g.workspace === w.name && g.kind === 'ip')) ws.append(buildIp(g));
  for (const e of L().elements.filter(e => e.workspace === w.name && hasIps(e))) for (const q of devIps(e)) ws.append(buildDevIp(e, q));
  for (const g of L().graphics.filter(g => g.workspace === w.name && eqPorts(g).length)) for (const q of eqPorts(g)) ws.append(buildEqIp(g, q));
  renderPipes(); fitZoom(); updLockBtn();
}

function place(node, o) { node.style.left = (o.x || 0) + 'px'; node.style.top = (o.y || 0) + 'px'; node.style.width = (o.w || 120) + 'px'; node.style.height = (o.h || 60) + 'px'; }

// Edit layout: a resize corner, or a padlock when the item is locked in place
function editDeco(n, o) {
  if (o.locked) { n.classList.add('locked'); n.append(h('div', { class: 'lock', title: 'Locked in place' }, '🔒')); }
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
  vessel: { title: 'Vessel', types: ['Brew Kettle', 'HLT', 'MLT', 'Mash Tun', 'Whirlpool'], image: 'samples/kettle.svg', size: [220, 270], tab: 'Equipment',
    ports: {
      outlet: pt('Outlet', [['Center Bottom', 0.5, 1], ['Bottom Drain', 0.9, 0.92]], { on: true }),
      tangential: pt('Tangential', [['Bottom Left', 0, 0.8], ['Bottom Right', 1, 0.8], ['Center', 0.5, 0.8], ['Back', 0.65, 0.75]]),
      thermowell: pt('Thermowell', [['Center Low', 0.5, 0.75], ['Left Low', 0, 0.75], ['Right Low', 1, 0.75], ['Back Low', 0.7, 0.7]], { ip: false }),
      steamSlayer: pt('Steam Slayer', V_HIGH), sparge: pt('Sparge', V_HIGH), cip: pt('CIP', [['Lid', 0.5, 0], ...V_HIGH]),
    } },
  pchiller: { title: 'Plate chiller', types: ['Brazed plate 20', 'Brazed plate 30', 'Brazed plate 40', 'Counterflow'], image: 'samples/plate_chiller.svg', size: [110, 200], tab: 'Equipment',
    ports: {
      wortIn: pt('Wort In', CORNERS, { on: true, def: 'Top Left', circuit: 'wort' }), wortOut: pt('Wort Out', CORNERS, { on: true, def: 'Bottom Right', circuit: 'wort' }),
      waterIn: pt('Water In', CORNERS, { on: true, def: 'Bottom Left', circuit: 'water' }), waterOut: pt('Water Out', CORNERS, { on: true, def: 'Top Right', circuit: 'water' }),
      thermowell: pt('Thermowell', [['Wort Out', 0.85, 0.75], ['Water Out', 0.85, 0.25]], { ip: false }),
    } },
  ccoil: { title: 'Chilling coil', types: ['Immersion coil', 'Jacketed (glycol)'], image: 'samples/chill_coil.svg', size: [180, 180], tab: 'Equipment',
    ports: { in: pt('In', CORNERS.slice(0, 2).concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Left', circuit: 'a' }), out: pt('Out', CORNERS.slice(0, 2).concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Right', circuit: 'a' }) } },
  herms: { title: 'HERMS coil', types: ['Stainless 25 ft', 'Stainless 50 ft', 'Copper'], image: 'samples/herms_coil.svg', size: [180, 180], tab: 'Equipment',
    ports: { wortIn: pt('Wort In', CORNERS.concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Left', circuit: 'a' }), wortOut: pt('Wort Out', CORNERS.concat(SIDE4.slice(0, 2)), { on: true, def: 'Top Right', circuit: 'a' }) } },
  trub: { title: 'Trub filter', types: ['Inline filter', 'Hop rocket', 'Hop spider'], image: 'samples/trub_filter.svg', size: [100, 170], tab: 'Equipment',
    ports: { inlet: pt('Inlet', SIDE4.concat(CORNERS), { on: true, def: 'Top', circuit: 'a' }), outlet: pt('Outlet', SIDE4.concat(CORNERS), { on: true, def: 'Bottom', circuit: 'a' }) } },
  eqTee: { title: 'Pipe tee', types: ['Equal tee', 'Reducing tee'], image: 'samples/pipe_tee.svg', size: [90, 90],
    ports: { a: pt('Run A', SIDE4, { on: true, def: 'Left', circuit: 'a' }), b: pt('Run B', SIDE4, { on: true, def: 'Right', circuit: 'a' }), c: pt('Branch', SIDE4, { on: true, def: 'Bottom', circuit: 'a' }) } },
  eqElbow90: { title: 'Pipe 90° elbow', types: ['Short radius', 'Long radius'], image: 'samples/pipe_elbow90.svg', size: [90, 90],
    ports: { a: pt('End A', SIDE4, { on: true, def: 'Left', circuit: 'a' }), b: pt('End B', SIDE4, { on: true, def: 'Bottom', circuit: 'a' }) } },
  eqElbow45: { title: 'Pipe 45° elbow', types: ['Short radius', 'Long radius'], image: 'samples/pipe_elbow45.svg', size: [90, 90],
    ports: { a: pt('End A', SIDE4.concat([['Bottom Right', 1, 1], ['Top Right', 1, 0], ['Bottom Left', 0, 1], ['Top Left', 0, 0]]), { on: true, def: 'Left', circuit: 'a' }),
      b: pt('End B', SIDE4.concat([['Bottom Right', 1, 1], ['Top Right', 1, 0], ['Bottom Left', 0, 1], ['Top Left', 0, 0]]), { on: true, def: 'Bottom Right', circuit: 'a' }) } },
  eqCross: { title: 'Pipe cross', types: ['Equal cross', 'Reducing cross'], image: 'samples/pipe_cross.svg', size: [90, 90],
    ports: { a: pt('End A', SIDE4, { on: true, def: 'Left', circuit: 'a' }), b: pt('End B', SIDE4, { on: true, def: 'Right', circuit: 'a' }),
      c: pt('End C', SIDE4, { on: true, def: 'Top', circuit: 'a' }), d: pt('End D', SIDE4, { on: true, def: 'Bottom', circuit: 'a' }) } },
};
// on / off pictures offered for Digital Outputs; users add their own (any picture path in the media folders)
const ONOFF_GRAPHICS = [['LED green', 'samples/led_green.svg'], ['LED red', 'samples/led_red.svg'], ['LED off (grey)', 'samples/led_off.svg'],
  ['Lightning bolt on', 'samples/bolt_on.svg'], ['Lightning bolt off', 'samples/bolt_off.svg'],
  ['Ball valve open (horizontal)', 'Images/Valve_Ball_OpenH_1.png'], ['Ball valve closed (horizontal)', 'Images/Valve_Ball_ClosedH_1.png'],
  ['Ball valve open (vertical)', 'Images/Valve_Ball_OpenV-1x1.png'], ['Ball valve closed (vertical)', 'Images/Valve_Ball_ClosedV-1x1.png']];
// lists behind the dropdowns. Every list can be added to ("Add new ..."); additions are kept in the settings (vesselLists).
const UNITS = ['°F', '°C', '%', 'psi', 'bar', 'kPa', 'gal', 'L', 'qt', 'oz', 'lb', 'kg', 'g', 'SG', '°P', 'pH', 'gal/min', 'L/min', 'V', 'mA', 's', 'min'];
const IMG_RE = /\.(png|jpe?g|gif|svg|webp|bmp)$/i, SND_RE = /\.(wav|mp3|ogg|m4a)$/i;
// pictures and sounds already used anywhere in the layout
function usedPaths(re) {
  const c = draft || S.config;
  return [...new Set([...c.elements, ...c.graphics, ...c.workspaces].flatMap(o => [o.imageOn, o.imageOff, o.image, o.background, o.sound, ...(o.images || []), ...(o.sounds || [])])
    .filter(p => typeof p === 'string' && re.test(p)))].sort();
}
const EQ_STANDARDS = ['TC 1.5', 'NPT 1/2 FPT', 'BSP 1/2', 'MM', 'TC 2', 'NPT 3/4 FPT', 'NPT 1/2 MPT'];
const eqClass = g => g?.kind === 'vessel' ? EQ[g.vesselType] : null;
// list keys: "standard" (shared), "<class>.types", "<class>.<port>"
function vList(key) {
  const [c, p] = key.split('.');
  const base = key === 'standard' ? EQ_STANDARDS : key === 'onoff' ? ONOFF_GRAPHICS.map(g => g[1]) : key === 'units' ? UNITS : key === 'colors' ? [] :
    key === 'pictures' ? [...ONOFF_GRAPHICS.map(g => g[1]), ...Object.values(EQ).map(c => c.image), ...usedPaths(IMG_RE)] : key === 'sounds' ? usedPaths(SND_RE) : p === 'types' ? EQ[c]?.types : EQ[c]?.ports[p]?.pos.map(q => q[0]);
  return [...new Set([...(base || []), ...(S.config.vesselLists?.[key] || [])])];
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
const COLORS = [['Default', ''], ['Red', '#e74c3c'], ['Green', '#3fbf6a'], ['Blue', '#4fb3ff'], ['Yellow', '#f1c40f'], ['Orange', '#e8a33a'], ['Purple', '#a87ee8'],
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
  else { n.textContent = g.text || ''; n.style.fontSize = (g.fontSize || 16) + 'px'; n.style.color = g.color || ''; n.style.fontWeight = g.bold ? '700' : ''; }
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
const FITTINGS = { point: 'IP point', pipe: 'Pipe (straight)', tee: 'Pipe tee', elbow90: '90° elbow', elbow45: '45° elbow', cross: 'Pipe cross', manualValve: 'Manual valve', cap: 'Pipe cap (no IP: dead end)' };
const isFitting = g => g && g.kind === 'ip' && g.fitting && g.fitting !== 'point';
const FIT_SVG = {
  pipe: '<path d="M0 15H30"/>', cap: '<path d="M0 15H17M20 5V25"/>',
  tee: '<path d="M0 15H30M15 15V30"/>', cross: '<path d="M0 15H30M15 0V30"/>',
  elbow90: '<path d="M0 15H15V30"/>', elbow45: '<path d="M0 15H15L27 27"/>',
  manualValve: '<path d="M15 15V3M9 3H21"/><path class="body" d="M2 7L15 15L2 23ZM28 7L15 15L28 23Z"/>',
};
// One pipe size per tab: every pipe and every fitting (tee, elbows, cross, straight pipe, cap, manual valve) is drawn from it,
// so fittings always match the pipes. A fitting is 5 x the pipe size, which makes its drawn arms exactly as thick as a pipe.
const pipeSize = wsn => +(L().workspaces.find(w => w.name === wsn)?.pipeSize) || 10;
function sizeFitting(g) {
  const S = 5 * pipeSize(g.workspace), [cx, cy] = ipCenter(g);
  g.w = g.h = S; g.x = cx - S / 2; g.y = cy - S / 2;
}
function buildIp(g) {
  const fit = isFitting(g) ? g.fitting : null;
  if (fit) sizeFitting(g);
  const n = h('div', { class: 'gfx ip' + (fit ? ' fit' : '') + (g.hideRun ? ' hide-run' : ''), 'data-gid': g.id, 'data-fit': fit || '', title: (g.label || FITTINGS[fit] || 'IP') + (fit === 'manualValve' ? (g.open ? ' (open)' : ' (closed)') : '') });
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
function sidePt(e, side) {
  const gm = elGeom(e), x = gm.x || 0, y = gm.y || 0, w = gm.w || 120, hh = gm.h || 60;
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
  const wide = (e.w || 120) >= (e.h || 60);
  return [{ id: `dev:${e.name}:in`, label: `${e.name} end`, text: '', c: sidePt(e, e.ipIn || (wide ? 'left' : 'top')) },
    { id: `dev:${e.name}:out`, label: `${e.name} end`, text: '', c: sidePt(e, e.ipOut || (wide ? 'right' : 'bottom')) }];
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
  if (typeof v === 'number' && e.precision !== undefined && e.precision !== null && e.precision !== '') return v.toFixed(+e.precision);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}

function fillEl(n, e) {
  const v = S.values[e.name] || {};
  const nm = n.querySelector('.nm'), vl = n.querySelector('.vl');
  nm.textContent = v.displayname ?? e.name;
  let on = false, img = v.image || '', text = '';
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
      img = (on ? v.imageon : v.imageoff) || v.image || ''; break;
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
      img = (v.active ? v.imageon : v.imageoff) || v.image || ''; n.classList.toggle('img-alarm', !!(v.imageon || v.image)); break;
    case 'soundPlayer': on = !!v.active; text = `${v.playing ? 'Playing' : v.active ? 'Paused for an alarm' : 'Stopped'}: ${String(v.path || '(no sound file)').split('/').pop()}`; break;
    case 'label': text = v.displayname ?? e.name; nm.classList.add('hidden'); break;
    case 'manual': fillManual(n, e, v); on = !!v.heat || !!v.pump; text = v.message || ''; break;
    case 'picture':
      // A screen picture: static image, or it follows another element (on image / off image)
      if (e.follow) { on = isOn(e.follow); img = (on ? v.imageon : v.imageoff) || v.image || ''; }
      text = e.text ?? ''; break;
  }
  // BruControl-style background images: "background" = 1, 2 or 3 picks one of the element's images
  if (!img && e.images?.length && /^\d+$/.test(String(v.background ?? ''))) img = e.images[Math.max(1, +v.background) - 1] || '';
  if (isPropValve(e)) {                              // show percent open, and the open / closed picture
    const pct = propPct(e); on = pct > 0;
    text = `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
    img = (on ? (v.imageon || e.imageOn) : (v.imageoff || e.imageOff)) || v.image || '';
  }
  if (e.type === 'label') n.classList.add('text');
  for (const k of ['led', 'lcd', 'dark', 'button', 'indicator']) n.classList.toggle('look-' + k, e.look === k);
  if (e.look === 'indicator') n.style.setProperty('--ind', on || v.active ? (e.onColor || 'green') : (e.offColor && e.offColor !== 'off' ? e.offColor : 'transparent'));
  vl.textContent = e.hideValue ? '' : text;
  n.classList.toggle('on', on && e.type !== 'picture');
  n.classList.toggle('vhidden', v.visibility === 'hidden');
  n.classList.toggle('fault', !!v.fault);
  n.style.backgroundColor = img ? '' : (e.images ? '' : bg(v.background));
  n.style.backgroundImage = img ? `url("${media(img)}")` : '';
  n.classList.toggle('has-img', !!img);
  if (e.fontSize) vl.style.fontSize = e.fontSize + 'px';
  n.classList.toggle('stretch', !!e.images);
  n.classList.toggle('clickable', !editing && tapAction(e) !== 'none');
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
  if (editing) return;
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
    d.append(h('div', { class: 'vdTitle' }, title),
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
let drawPts = null, drawCursor = null, drawFrom = null;
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
  return [...L().graphics.filter(g => g.kind === 'ip' && g.workspace === ws).map(g => ({ id: g.id, label: (g.port ? vn(g.attachTo) : '') + (g.label || g.id) })),
    ...L().elements.filter(e => hasIps(e) && e.workspace === ws).flatMap(e => devIps(e)),
    ...L().graphics.filter(g => g.workspace === ws).flatMap(eqPorts)];
}
// ---- flow through the pipe network
// Pipes join IPs. Each IP belongs to a node:
//  - a running pump: OUT pushes flow out, IN pulls flow in
//  - a pump that is off, an open valve, a fitting or an open manual valve: flow passes straight through, either way
//  - a cooling coil or plate chiller circuit: passes flow through (the chiller's wort and water circuits stay separate)
//  - a closed valve, closed manual valve or pipe cap: blocks every pipe on it
//  - a plain IP point: an end of the line (a vessel port, an outlet), where flow can come from or go to
// Flow is traced from each running pump out to the IP points it reaches, and from each IP point into each running pump's IN.
// The direction of each pipe comes from that trace, so a pipe can show flow backwards through a pump that is off.
// A pipe between two plain IP points with a "Flow when" list keeps the old rule: it flows, as drawn, while all of those are on.
const pipeJoined = p => !!(ipPoint(p.from, p.workspace) && ipPoint(p.to, p.workspace));
function ipNode(id, ws) {
  const q = eqOfIp(id) !== null && eqPort(id, ws);
  if (q) return { key: `eq:${eqOfIp(id)}:${q.circuit}`, pass: true };
  const dn = devOfIp(id);
  if (dn !== null) {
    const e = L().elements.find(x => x.name === dn), on = isOn(dn), end = id.slice(id.lastIndexOf(':') + 1);
    if (e.subtype === 'valve') return on ? { key: 'dev:' + dn, pass: true } : { closed: true };
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
// Keep pipe ends on their IPs. The bend next to the end follows, so square corners stay square.
function snapEnd(pts, i, j, c) {
  const old = pts[i], nb = pts[j];
  if (nb && j !== undefined) { if (nb[1] === old[1]) nb[1] = c[1]; else if (nb[0] === old[0]) nb[0] = c[0]; }
  pts[i] = [c[0], c[1]];
}
function syncPipeEnds(p) {
  const pts = p.points; if (!pts || pts.length < 2) return;
  const a = ipPoint(p.from, p.workspace), b = ipPoint(p.to, p.workspace), n = pts.length;
  if (a) snapEnd(pts, 0, n > 2 ? 1 : undefined, a);
  if (b) snapEnd(pts, n - 1, n > 2 ? n - 2 : undefined, b);
}
function renderPipes() {
  const svg = $('#pipes'); const w = curWs(); if (!w) return;
  const NS = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';
  const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e; };
  const liveIps = new Set();
  const pipes = L().graphics.filter(g => g.kind === 'pipe' && g.workspace === w.name);
  pipes.forEach(syncPipeEnds);
  const flow = computeFlow(w.name);
  for (const p of pipes) {
    const pts = (p.points || []).map(q => q.join(',')).join(' ');
    const flowing = flow.has(p.id), backwards = flow.get(p.id) === -1;
    if (flowing) { if (p.from) liveIps.add(p.from); if (p.to) liveIps.add(p.to); }
    const width = pipeSize(w.name);
    const g = mk('g', { 'data-gid': p.id });
    if (p.baseVisible !== false || editing) g.append(mk('polyline', { class: 'pipe', points: pts, stroke: p.color || '#8a8f96', 'stroke-width': width, opacity: p.baseVisible === false ? 0.35 : 1 }));
    g.append(mk('polyline', { class: 'flow' + (flowing ? '' : ' off') + (!!p.reverse !== backwards ? ' rev' : ''), points: pts, stroke: p.flowColor || '#4fb3ff', 'stroke-width': Math.max(3, width * 0.55) }));
    const hit = mk('polyline', { class: 'hit', points: pts }); g.append(hit);
    if (editing && (p.points || []).length > 1) {   // a red ring marks a pipe end that is not on an IP (no flow until it is)
      if (!ipPoint(p.from, p.workspace)) g.append(mk('circle', { class: 'loose', cx: p.points[0][0], cy: p.points[0][1], r: 9 }));
      if (!ipPoint(p.to, p.workspace)) { const q = p.points[p.points.length - 1]; g.append(mk('circle', { class: 'loose', cx: q[0], cy: q[1], r: 9 })); }
    }
    if (editing) {
      if (sel?.kind === 'gfx' && sel.id === p.id) g.append(mk('polyline', { points: pts, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-dasharray': '4 3' }));
      if (!p.locked) (p.points || []).forEach((q, i) => { const c = mk('circle', { class: 'handle', cx: q[0], cy: q[1], r: 6, 'data-gid': p.id, 'data-pi': i }); g.append(c); });
    }
    svg.append(g);
  }
  if (drawPts) {
    const all = drawCursor ? [...drawPts, drawCursor] : drawPts;
    svg.append(mk('polyline', { class: 'drawing', points: all.map(q => q.join(',')).join(' ') }));
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
  editing = on; sel = null; drawPts = null;
  draft = on ? clone(S.config) : null;
  $('#editMode').checked = on;
  $('#editBar').classList.toggle('hidden', !on);
  $('#editHint').textContent = on ? 'Drag to move, corner to resize, double-click (or hold a finger) for properties. 🔒 items are locked in place.' : '';
  renderTabs(); renderWs();
}

let drag = null, lastPipeTap = null;
$('#ws').addEventListener('pointerdown', ev => {
  if (!editing) return;
  const p = canvasPt(ev);
  if (drawPts) {                                   // drawing a pipe
    const ipNode = ev.target.closest('.gfx.ip'), ipId = ipNode && (ipNode.dataset.ipid || ipNode.dataset.gid), c = ipId && ipPoint(ipId, wsName);
    const last = drawPts[drawPts.length - 1];
    if (c) {                                       // a pipe starts on the first IP clicked and ends on the next one
      if (!last) { drawFrom = ipId; drawPts.push(c); renderPipes(); ev.preventDefault(); return; }
      if (ipId === drawFrom) { ev.preventDefault(); return; }
      if (last[0] !== c[0] && last[1] !== c[1]) drawPts.push(Math.abs(c[0] - last[0]) > Math.abs(c[1] - last[1]) ? [c[0], last[1]] : [last[0], c[1]]);
      drawPts.push(c); finishPipe(ipId); ev.preventDefault(); return;
    }
    let q = [snap(p[0]), snap(p[1])];
    if (last && !ev.shiftKey) { if (Math.abs(q[0] - last[0]) > Math.abs(q[1] - last[1])) q[1] = last[1]; else q[0] = last[0]; }
    if (ev.detail >= 2) { finishPipe(); return; }  // double-click finishes the pipe
    drawPts.push(q); renderPipes(); return;
  }
  const handle = ev.target.closest('circle.handle');
  if (handle) { sel = { kind: 'gfx', id: handle.dataset.gid }; drag = { mode: 'point', item: findItem('gfx', sel.id), i: +handle.dataset.pi }; ev.preventDefault(); return; }
  const hit = ev.target.closest('#pipes g');
  const pip = ev.target.closest('.devip');
  const node = pip ? (pip.dataset.eq ? $(`#ws .gfx[data-gid="${CSS.escape(pip.dataset.eq)}"]`) : $(`#ws .el[data-name="${CSS.escape(pip.dataset.dev)}"]`)) : ev.target.closest('.el,.gfx');
  if (hit && !node) {
    // the pipe is redrawn on press, so the browser never sends a double-click for it: count two quick presses instead
    const now = Date.now(), again = lastPipeTap && lastPipeTap.id === hit.dataset.gid && now - lastPipeTap.t < 450;
    lastPipeTap = again ? null : { id: hit.dataset.gid, t: now };
    if (again) { sel = { kind: 'gfx', id: hit.dataset.gid }; renderWs(); editItem('gfx', sel.id); return; }
    startLongPress(ev, 'gfx', hit.dataset.gid); sel = { kind: 'gfx', id: hit.dataset.gid };
    const pipe = findItem('gfx', sel.id);
    drag = pipe.locked ? null : { mode: 'pipe', item: pipe, start: p, orig: clone(pipe.points) };
    renderWs(); return;
  }
  if (!node) { sel = null; renderWs(); return; }
  sel = node.dataset.name ? { kind: 'el', id: node.dataset.name } : { kind: 'gfx', id: node.dataset.gid };
  const item = findItem(sel.kind, sel.id);
  startLongPress(ev, sel.kind, sel.id);
  $$('#ws .sel').forEach(n => n.classList.remove('sel')); node.classList.add('sel'); updLockBtn();
  if (item.locked) { drag = null; ev.preventDefault(); return; }   // locked: select only, no move or resize
  drag = { mode: !pip && ev.target.classList.contains('rs') ? 'resize' : 'move', item, node, start: p, orig: { x: item.x || 0, y: item.y || 0, w: item.w || 120, h: item.h || 60 } };
  if (item.kind === 'vessel') drag.ports = draft.graphics.filter(g => g.kind === 'ip' && g.attachTo === item.id).map(g => ({ g, x: g.x || 0, y: g.y || 0 }));
  node.setPointerCapture?.(ev.pointerId);
  ev.preventDefault();
});
$('#ws').addEventListener('pointermove', ev => {
  if (lp && Math.hypot(ev.clientX - lp.x, ev.clientY - lp.y) > 8) cancelLongPress();
  if (drawPts) {
    let q = canvasPt(ev).map(snap); const last = drawPts[drawPts.length - 1];
    if (last && !ev.shiftKey) { if (Math.abs(q[0] - last[0]) > Math.abs(q[1] - last[1])) q[1] = last[1]; else q[0] = last[0]; }
    drawCursor = q; renderPipes(); return;
  }
  if (!drag) return;
  const p = canvasPt(ev), dx = p[0] - drag.start?.[0], dy = p[1] - drag.start?.[1];
  if (drag.mode === 'move' && drag.ports) {   // a vessel carries its ports (IPs) with it
    const mx = snap(drag.orig.x + dx) - drag.orig.x, my = snap(drag.orig.y + dy) - drag.orig.y;
    for (const q of drag.ports) { q.g.x = q.x + mx; q.g.y = q.y + my; const pn = $(`#ws .gfx.ip[data-gid="${CSS.escape(q.g.id)}"]`); if (pn) place(pn, q.g); }
    placeEqIps(drag.item);
    renderPipes();
  }
  if (drag.mode === 'move') { drag.item.x = snap(drag.orig.x + dx); drag.item.y = snap(drag.orig.y + dy); place(drag.node, drag.item.kind ? drag.item : elGeom(drag.item)); if (hasIps(drag.item)) placeDevIps(drag.item); if (drag.item.kind === 'ip' || hasIps(drag.item)) renderPipes(); }
  else if (drag.mode === 'resize') {
    const k = !drag.item.kind && hasIps(drag.item) ? pipeSize(drag.item.workspace) / 10 : 1;   // dragging the corner of a scaled device: store its size at pipe size 10
    drag.item.w = Math.max(drag.item.kind === 'ip' ? 10 : 20, snap(drag.orig.w + dx / k)); drag.item.h = Math.max(drag.item.kind === 'ip' ? 10 : 16, snap(drag.orig.h + dy / k)); place(drag.node, drag.item.kind ? drag.item : elGeom(drag.item)); if (hasIps(drag.item)) placeDevIps(drag.item); placeEqIps(drag.item); if (drag.item.kind === 'ip' || hasIps(drag.item) || eqPorts(drag.item).length) renderPipes(); }
  else if (drag.mode === 'point') { drag.item.points[drag.i] = [snap(p[0]), snap(p[1])]; renderPipes(); }
  else if (drag.mode === 'pipe') { drag.item.points = drag.orig.map(q => [snap(q[0] + dx), snap(q[1] + dy)]); renderPipes(); }
});
window.addEventListener('pointerup', () => {
  cancelLongPress();
  if (drag?.mode === 'move' && drag.item.kind === 'ip' && !isFitting(drag.item)) attachIp(drag.item);
  if (drag?.mode === 'point' || drag?.mode === 'pipe') renderWs();
  drag = null;
});
$('#ws').addEventListener('dblclick', ev => {
  if (!editing) return;
  if (drawPts) return finishPipe();
  const pip = ev.target.closest('.devip');
  const node = ev.target.closest('.el,.gfx');
  const pipe = ev.target.closest('#pipes g');
  if (pip) pip.dataset.eq ? editItem('gfx', pip.dataset.eq) : editItem('el', pip.dataset.dev);
  else if (node) editItem(node.dataset.name ? 'el' : 'gfx', node.dataset.name || node.dataset.gid);
  else if (pipe) editItem('gfx', pipe.dataset.gid);
});
document.addEventListener('keydown', ev => {
  if (!drawPts) return;
  if (ev.key === 'Enter') { ev.preventDefault(); finishPipe(); }   // without preventDefault the same Enter press hits the properties dialog and presses Delete
  if (ev.key === 'Escape') { drawPts = null; drawCursor = null; drawFrom = null; renderPipes(); $('#editHint').textContent = ''; $('#finishPipe').classList.add('hidden'); }
});
// Touch screens have no double-click: hold a finger on an item for 0.6 s to open its properties
let lp = null;
function startLongPress(ev, kind, id) {
  cancelLongPress();
  lp = { x: ev.clientX, y: ev.clientY, t: setTimeout(() => { lp = null; if (drag) { drag = null; renderWs(); } editItem(kind, id); }, 600) };
}
function cancelLongPress() { if (lp) { clearTimeout(lp.t); lp = null; } }

function finishPipe(to) {
  $('#finishPipe').classList.add('hidden');
  const pts = drawPts, from = drawFrom; drawPts = null; drawCursor = null; drawFrom = null;
  if (!pts || pts.length < 2) { renderPipes(); return; }
  const g = { id: newId(), kind: 'pipe', workspace: wsName, points: pts, color: '#8a8f96', flowColor: '#4fb3ff', flowWhen: [], baseVisible: true };
  if (from) g.from = from;
  if (typeof to === 'string') g.to = to;
  draft.graphics.push(g); sel = { kind: 'gfx', id: g.id }; renderWs(); editItem('gfx', g.id);
  $('#editHint').textContent = '';
}

// Leaving Edit layout with changes: Save, or Exit without Saving (Fritz: OK / Cancel was confusing). Esc or "Keep editing" stays in Edit layout.
const layoutChanged = () => editing && JSON.stringify(draft) !== JSON.stringify(S.config);
function leaveLayoutDialog() {
  return new Promise(res => {
    const d = $('#valDlg'); d.innerHTML = '';
    const close = v => { d.oncancel = null; d.close(); res(v); };
    d.append(h('div', { class: 'vdTitle' }, 'Leave Edit layout?'),
      h('p', {}, 'You have changes to this layout that are not saved yet.'),
      h('div', { class: 'vdBtns' },
        h('button', { type: 'button', class: 'big primary', onclick: () => close('save') }, 'Save'),
        h('button', { type: 'button', class: 'big danger', onclick: () => close('discard') }, 'Exit without Saving')),
      h('div', { class: 'vdBtns' }, h('button', { type: 'button', class: 'big', onclick: () => close(undefined) }, 'Keep editing')));
    d.oncancel = () => res(undefined);
    d.showModal();
  });
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
    ['Momentary push button (one short ON per press)', 'digitalIn', 'PB', { mode: 'momentary', pulse: 100, lockout: 3000 }],
    ['Push button that toggles (press on, press off)', 'digitalIn', 'DI', { mode: 'toggle' }],
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
$('#addEl').onclick = () => {
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
  draft.elements.push(e); sel = { kind: 'el', id: e.name }; renderWs(); editItem('el', e.name);
};
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
$('#drawPipe').onclick = () => { $('#finishPipe').classList.remove('hidden'); drawPts = []; drawFrom = null; $('#editHint').textContent = 'Click the start IP (or any point), click the bends, then click the end IP. Shift = any angle. Double-click or Enter to finish, Esc to cancel.'; };
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
  const fit = $('#addIpType').value, base = { point: 'IP', pipe: 'Pipe', cap: 'Cap' }[fit] || FITTINGS[fit];
  let i = 1; while (draft.graphics.some(g => g.kind === 'ip' && g.label === base + ' ' + i)) i++;
  const g = { id: newId(), kind: 'ip', workspace: wsName, x: 60, y: 60, w: 30, h: 30, label: base + ' ' + i, color: fit === 'point' ? '#e8a33a' : '#8a8f96' };
  if (fit !== 'point') g.fitting = fit;
  draft.graphics.push(g); sel = { kind: 'gfx', id: g.id }; renderWs(); editItem('gfx', g.id);
};
$('#addWs').onclick = () => {
  const n = prompt('New tab name'); if (!n) return;
  if (draft.workspaces.some(w => w.name === n)) return toast('That name is used', true);
  draft.workspaces.push({ name: n, width: 1600, height: 900 }); wsName = n; renderTabs(); renderWs();
};
$('#wsProps').onclick = () => editWorkspace();
const saveLayout = guard(async () => {
  await api('PUT', '/ui/layout', { workspaces: draft.workspaces, elements: draft.elements, graphics: draft.graphics });
  toast('Layout saved'); editing = false; await load(); setEditing(false);
});
$('#saveLayout').onclick = saveLayout;
$('#cancelLayout').onclick = () => leaveLayout();
$('#zoom').value = zoom;
$('#zoom').onchange = e => { zoom = e.target.value; try { localStorage.setItem('bp.zoom', zoom); } catch { } fitZoom(); };
let fitTimer;
const refit = () => { clearTimeout(fitTimer); fitTimer = setTimeout(() => { if (view === 'workspace') fitZoom(); }, 100); };
{ const ro = new ResizeObserver(refit); for (const s of ['#top', '#view-workspace > .bar', '#editBar']) ro.observe($(s)); }   // a menu or the tab buttons wrapped onto another line
window.addEventListener('resize', refit);
// in full screen the top menu is hidden too, so the tab gets every pixel (Esc or Exit full screen brings it back)
document.addEventListener('fullscreenchange', () => {
  const on = !!document.fullscreenElement;
  $('#fullScreen').textContent = on ? 'Exit full screen' : 'Full screen';
  document.body.classList.toggle('fullscreen', on);
  refit();
});
// Full screen hides the browser's own bars (phones without it, like iPhones, just do not show the button)
if (!document.documentElement.requestFullscreen) $('#fullScreen').classList.add('hidden');
$('#fullScreen').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => { });
window.addEventListener('resize', () => { if (view === 'workspace') fitZoom(); });

// ---------------------------------------------------------------- properties dialog
// field: [key, label, kind, options]
const F = {
  common: [['name', 'Name', 'text'], ['displayName', 'Display name', 'text'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'bool'],
    ['background', 'Background (1-8 or color)', 'text'], ['image', 'Image path', 'path'], ['visibility', 'Visibility', 'sel', ['visible', 'hidden']], ['hideName', 'Hide name', 'bool'], ['hideValue', 'Hide value / text', 'bool'], ['look', 'Look', 'sel', ['normal', 'led', 'lcd', 'dark', 'button']], ['fontSize', 'Value font size', 'num'],
    ['tap', 'When tapped', 'sel', ['default', 'none', 'toggle', 'dialog', ['script', 'process'], ['workspace', 'tab']]], ['tapTarget', 'Tap target (element, process or tab; empty = itself)', 'text'], ['confirm', 'Ask before changing (ON / OFF buttons)', 'bool'],
    ['images', 'Background images 1-3 (JSON list; "background" = 1, 2 or 3 picks one)', 'json'], ['nameColor', 'Name color', 'color'], ['nameBg', 'Name background color', 'color'], ['valueColor', 'Value color', 'color'], ['valueBg', 'Value background color', 'color'],
    ['nameFont', 'Name font (JSON, e.g. {"size":14,"bold":true})', 'json'], ['valueFont', 'Value font (JSON)', 'json'], ['nameAlign', 'Name alignment', 'sel', [['', '(default)'], 'TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight']], ['valueAlign', 'Value alignment', 'sel', [['', '(default)'], 'TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight']], ['border', 'Border', 'sel', ['default', 'hidden', 'visible']]],
  shared: [['dataType', 'Data type', 'sel', ['value', 'string', 'bool', 'time', 'datetime']], ['initial', 'Initial value', 'text'], ['precision', 'Decimals', 'num'], ['units', 'Units', 'gpick', 'units'], ['step', '+ / - step', 'num'], ['min', 'Lowest allowed', 'num'], ['max', 'Highest allowed', 'num'], ['readOnly', 'Read only on screen', 'bool'], ['retain', 'Keep value on restart', 'bool', true]],
  digitalOut: [['subtype', 'Kind (pumps and valves have IPs for pipes)', 'sel', ['plain', 'pump', 'valve']], ['device', 'Device', 'dev'], ['channel', 'Pin (e.g. 22, or A5 = 59)', 'pin', 'digital'], ['activeLow', 'Invert (pin LOW = on)', 'bool'], ['oneShot', 'One-shot time in ms (0 = off)', 'num'], ['oneShotDirection', 'One-shot pulses OFF (off = pulses ON)', 'bool'], ['imageOn', 'Graphic when on', 'gpick'], ['imageOff', 'Graphic when off', 'gpick'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  switch: [['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  digitalIn: [['inline', 'Inline in a pipe, e.g. a flow switch (gets IN and OUT IPs)', 'bool'], ['device', 'Device', 'dev'], ['channel', 'Pin (e.g. 30, or A8 = 62)', 'pin', 'digital'],
    ['mode', 'Input type', 'sel', ['switch', 'momentary', 'toggle', 'latch', 'counter']],
    ['pulse', 'Momentary: ON time per press (ms, empty = 100)', 'num'], ['lockout', 'Momentary: lockout before the next press counts (ms, 3000 = 3 seconds; empty = 3000)', 'num'],
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
    ['image', 'Background picture path (empty = drawn shape)', 'path'], ['text', 'Text on marker', 'text'], ['color', 'Color', 'color'], ['hideRun', 'Show only while editing the layout', 'yn'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num', ['locked', 'Lock position (no drag or resize)', 'yn']]],
  pipe: [['label', 'Label', 'text'], ['from', 'Starts at IP (flow comes from here)', 'ip'], ['to', 'Ends at IP (flow goes to here)', 'ip'], ['flowWhen', 'Only when ALL of these are on (optional; pumps and valves on the pipe count by themselves; Ctrl or Cmd-click to pick several)', 'multi'], ['reverse', 'Reverse flow direction', 'yn'], ['color', 'Pipe color', 'color'], ['flowColor', 'Flow color', 'color'], ['baseVisible', 'Show pipe when not flowing (off = background already shows pipes)', 'yn', true], ['workspace', 'Tab', 'ws', ['locked', 'Lock position (no drag or resize)', 'yn']]],
};
// the Vessel widget's settings: Position and Standard show once a port is set to Installed
F.vesselNew = it => [['name', 'Name', 'text'], ['vtype', 'Type', 'vlist', it.vesselType + '.types'], ['label', 'Label (empty = the Type)', 'text'], ['image', 'Graphic (picture path)', 'path'],
  ...Object.entries(EQ[it.vesselType].ports).flatMap(([k, d]) => [['_' + k, d.name + (d.ip ? ' (IP)' : ' (not an IP)'), 'note'], [k + '_on', d.name + ' installed', 'yn', false, true],
    ...(it[k + '_on'] ? [[k + '_pos', d.name + ' position', 'vlist', it.vesselType + '.' + k], [k + '_std', d.name + ' standard', 'vlist', 'standard']] : [])]),
  ['_look', 'Label and place', 'note'], ['labelVisible', 'Show label', 'yn', true], ['labelAlign', 'Label position', 'sel', LABEL_POS], ['labelColor', 'Label color', 'color'], ['labelSize', 'Label size', 'num'],
  ['workspace', 'Tab (pipes only join IPs on the same tab)', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'yn']];
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
const kindFields = (type, obj) => { const f = F[type]; return (typeof f === 'function' ? f() : f || []).filter(x => !Array.isArray(x[4]) || x[4].includes(obj.kind || 'value')); };

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
  if (kind === 'yn') {        // a true / false setting as a Yes / No dropdown
    const on = !!(v ?? opts);
    return [h('label', {}, label), h('select', { 'data-k': key, 'data-kind': kind }, h('option', { value: 'yes', ...(on ? { selected: true } : {}) }, 'Yes'), h('option', { value: 'no', ...(on ? {} : { selected: true }) }, 'No'))];
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
    const sw = h('span', { class: 'cswatch' + (cur ? '' : ' none') }); sw.style.background = cur;
    const pick = h('input', { type: 'color', class: known ? 'hidden' : '', value: /^#[0-9a-f]{6}$/.test(cur) ? cur : '#888888' });
    const set = c => { val.value = c; sw.style.background = c; sw.classList.toggle('none', !c); };
    const s = h('select', {}, ...cols.map(([n, c]) => h('option', { value: c, ...(known && known[1] === c ? { selected: true } : {}), ...(c ? { style: `background:${c};color:${['#ffffff', '#f1c40f', '#c9ced3'].includes(c) ? '#000' : '#fff'}` } : {}) }, n)),
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
    const list = opts || 'onoff', pic = list === 'onoff' || list === 'pictures';
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

function readFields(obj) {
  for (const inp of $$('#dlgBody [data-k]')) {
    const k = inp.dataset.k, kind = inp.dataset.kind;
    let v;
    if (kind === 'bool') v = inp.checked;
    else if (kind === 'vkitems') {
      v = [...inp.querySelectorAll('.vkrow')].map(tr => ({ value: tr.querySelector('.vkv').value.trim(), text: tr.querySelector('.vkt').value.trim() })).filter(r => r.value !== '' || r.text);
      for (const r of v) { if (r.value === '' || !Number.isFinite(+r.value)) throw new Error(`Choice "${r.text}": its Value must be a number`); r.value = +r.value; }
      if (new Set(v.map(r => r.value)).size !== v.length) throw new Error('Two choices have the same Value');
    }
    else if (kind === 'num') v = inp.value === '' ? undefined : +inp.value;
    else if (kind === 'pin') { const t = inp.value.trim().toUpperCase(); v = t === '' ? undefined : /^\d+$/.test(t) ? +t : t; }
    else if (kind === 'yn') v = inp.value === 'yes';
    else if (kind === 'stpick') v = inp.value === '' || inp.value === '__add__' ? undefined : inp.dataset.num ? +inp.value : inp.value;
    else if (kind === 'multi') v = [...inp.selectedOptions].map(o => o.value);
    else if (kind === 'json') { if (inp.value.trim() === '') v = undefined; else { try { v = JSON.parse(inp.value); } catch { throw new Error(`${k}: not valid JSON`); } } }
    else v = inp.value === '' ? undefined : inp.value;
    if (v === undefined) delete obj[k]; else obj[k] = v;
  }
}

// fields: a list, or a function of the item (the list changes when a [.., true] select changes, e.g. probe type)
function dialog(title, fields, obj, canDelete) {
  return new Promise(res => {
    $('#dlgTitle').textContent = title;
    const body = $('#dlgBody');
    const build = () => { body.innerHTML = ''; for (const f of (typeof fields === 'function' ? fields(obj) : fields)) body.append(...field(f, obj)); };
    build();
    body.onchange = ev => {
      const t = ev.target;
      if ((t.dataset?.kind === 'vlist' || t.dataset?.kind === 'gpick') && t.value === '__add__') {
        const k = t.dataset.k, prev = obj[k], text = (prompt({ units: 'New unit (for example psi)', sounds: 'Sound file path in your media folders (for example sounds/bell.wav)' }[t.dataset.list] || (t.dataset.kind === 'gpick' ? 'Picture path in your media folders (for example Images/MyValve_On.png)' : 'Add to this list')) || '').trim();
        try { readFields(obj); } catch { }
        obj[k] = text || prev;
        if (text && !vList(t.dataset.list).includes(text)) {
          const lists = S.config.vesselLists = { ...(S.config.vesselLists || {}) };
          lists[t.dataset.list] = [...(lists[t.dataset.list] || []), text];
          api('PUT', '/ui/settings', { vesselLists: lists }).catch(e => toast(e.message, true));
        }
        if (obj[k] === undefined) delete obj[k];
        build();
      } else if (t.dataset?.rerender) { try { readFields(obj); } catch { } build(); }
    };
    for (const b of $$('#dlg .dlgDelete')) b.classList.toggle('hidden', !canDelete);
    const d = $('#dlg');
    // Delete and Cancel are plain buttons so Enter in a field always means Save
    for (const b of $$('#dlg [data-close]')) b.onclick = () => d.close(b.dataset.close);
    d.onclose = () => res(d.returnValue);
    d.returnValue = 'cancel'; d.showModal();
  });
}

async function editItem(kind, id) {
  const item = findItem(kind, id); if (!item) return;
  const type = kind === 'el' ? item.type : item.kind;
  const fields = kind === 'el' ? it => {
    const f = [...F.common.slice(0, 3), ...fieldsFor(it), ...(isPropValve(it) ? F.propValve : []), ...(isInline(it) ? F.inlineSides : []), ...F.common.slice(3)];
    if (prefixOf(it)) f.splice(1, 0, ['_hint', `Suggested name prefix: ${prefixOf(it)}  (a hint, not required)`, 'note']);
    return f;
  } : eqClass(item) ? F.vesselNew : F[type];
  const work = clone(item);
  const isV = !!eqClass(item);
  if (isV) for (const k of Object.keys(eqClass(item).ports)) { const p = item.ports?.[k] || {}; work[k + '_on'] = !!p.installed; work[k + '_pos'] = p.position; work[k + '_std'] = p.standard; }
  const r = await dialog(kind === 'el' ? `${type} element` : type === 'ip' ? 'IP widget (Initial Point)' : isV ? eqClass(item).title : type === 'vessel' ? 'Vessel / equipment widget' : type, fields, work, true);
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
    const before = isV ? clone(item) : null;
    Object.keys(item).forEach(k => delete item[k]); Object.assign(item, work);
    if (isV) {
      const placed = syncVesselPorts(item, before.isNew ? null : before);
      if (placed.length || before.isNew) vesselPopup(item, placed);
      delete item.isNew;
    }
    if (type === 'ip' && !isFitting(item) && !pickedPort) attachIp(item);   // typed a new X / Y: re-check which vessel it sits on
    if (kind === 'el') sel = { kind, id: item.name };
    renderTabs(); renderWs();
    if (kindChanged) editItem(kind, item.name);          // show the settings for the new kind
  } catch (e) { toast(e.message, true); }
}

async function editWorkspace() {
  const w = curWs(); const work = clone(w);
  const r = await dialog('Tab', [['name', 'Name', 'text'], ['background', 'Background image path', 'path'], ['color', 'Background color', 'color'], ['width', 'Width', 'num'], ['height', 'Height', 'num'],
    ['pipeSize', 'Pipe size: thickness of every pipe and fitting on this tab (default 10)', 'num'], ['bgX', 'Image left (empty = fill)', 'num'], ['bgY', 'Image top', 'num'], ['bgW', 'Image width', 'num'], ['bgH', 'Image height', 'num']], work, draft.workspaces.length > 1);
  if (r === 'delete') {
    if (!confirm(`Delete tab "${w.name}" and everything on it?`)) return;
    draft.workspaces = draft.workspaces.filter(x => x !== w);
    draft.elements = draft.elements.filter(e => e.workspace !== w.name);
    draft.graphics = draft.graphics.filter(g => g.workspace !== w.name);
    wsName = draft.workspaces[0].name;
  } else if (r === 'ok') {
    try { readFields(work); } catch (e) { return toast(e.message, true); }
    if (work.name !== w.name) { for (const x of [...draft.elements, ...draft.graphics]) if (x.workspace === w.name) x.workspace = work.name; wsName = work.name; }
    Object.assign(w, work);
  }
  renderTabs(); renderWs();
}

// ---------------------------------------------------------------- alarms / sound
$('#soundBtn').onclick = () => {
  soundOn = !soundOn;
  $('#soundBtn').textContent = soundOn ? 'Sound on' : 'Enable sound';
  if (soundOn) for (const e of S.config.elements.filter(isSoundEl)) { const a = getAudio(e); if (a) { a.muted = true; a.play().then(() => { a.pause(); a.muted = false; }).catch(() => { a.muted = false; }); } }
  updateAlarms();
};
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
function renderScriptList() {
  const ul = $('#scriptList'); ul.innerHTML = '';
  for (const [c, d] of Object.entries(S.processClasses || { sub: { label: 'Processes' } })) {
    const list = S.scripts.filter(s => (s.cls || 'sub') === c);
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
      ul.append(h('li', { class: s.name === curScript ? 'active' : '', title: s.error || s.state, onclick: () => openScript(s.name) }, h('span', { class: 'st ' + st }), s.name, s.modified ? ' *' : ''));
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
  api('GET', '/ui/scripts/words').then(w => { S.words = w; }).catch(() => { });
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
function gotoLine(l) {
  const ta = $('#code'), lines = ta.value.split('\n');
  const start = lines.slice(0, l - 1).reduce((a, s) => a + s.length + 1, 0);
  ta.focus(); ta.setSelectionRange(start, start + (lines[l - 1] || '').length);
  ta.scrollTop = Math.max(0, (l - 5) * 19.5);
}
$('#code').addEventListener('input', () => { dirty = true; updateGutter(); $('#scriptName').textContent = curScript + ' (not saved)'; });
$('#code').addEventListener('scroll', () => { $('#gutter').scrollTop = $('#code').scrollTop; });
attachAutofill($('#code'), $('#autofill'), () => S?.words);
$('#code').addEventListener('keydown', ev => {
  if (ev.key === 'Tab') { ev.preventDefault(); document.execCommand('insertText', false, '\t'); }
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); saveScript(); }
});
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
  dirty = false; $('#scriptName').textContent = curScript; problems = r.errors; renderProblems(); updateGutter();
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
  ta.value = t.text; dirty = true; updateGutter(); $('#scriptName').textContent = curScript + ' (not saved)';
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
  if (!curScript || !confirm(`Delete process "${curScript}"?`)) return;
  await api('DELETE', '/ui/scripts/' + encodeURIComponent(curScript));
  curScript = null; dirty = false; $('#code').value = ''; $('#scriptName').textContent = '-'; S.scripts = await api('GET', '/ui/scripts'); renderScriptList();
});
function renderConsole() {
  const all = $('#consoleAll').checked;
  const rows = S.console.filter(c => all || !curScript || c.script === curScript).slice(-400);
  const pad = n => String(n).padStart(2, '0');
  $('#console').textContent = rows.map(c => { const d = new Date(c.ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${all ? '[' + c.script + '] ' : ''}${c.text}`; }).join('\n');
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
  ], work, false);
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

// BruControl configuration (.brucfg)
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
  const msg = $('#bruMode').value === 'replace' ? 'Replace your tabs, elements and devices with the ones in this BruControl file? Running processes are stopped. (config/brewery.json.bak keeps the old setup.)' : 'Add this BruControl file to your setup? Running processes are stopped.';
  if (!confirm(msg)) return;
  const r = await bruSend(false);
  $('#bruResult').textContent = bruReport(r);
  await load(); toast('BruControl configuration imported');
});

// ---------------------------------------------------------------- settings
// ---- sample setups: on first start, and under Settings
let samples = null;
async function sampleCards(box, after) {
  samples ??= await api('GET', '/ui/samples');
  box.innerHTML = '';
  for (const sm of samples) box.append(h('div', { class: 'sampleCard' + (S.config.sample === sm.id ? ' cur' : '') },
    h('div', { class: 'sampleName' }, sm.name), h('div', { class: 'muted' }, sm.description || ''),
    sm.needs ? h('div', { class: 'sampleNeeds' }, sm.needs) : '',
    h('button', { class: 'primary', onclick: guard(async () => {
      if (!confirm(`Load the sample "${sm.name}"?\n\nIt replaces your tabs, elements, pipes and devices and stops running processes. Your current setup is saved in config/backups first.`)) return;
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
}
// ---- accounts
addEyes();
$('#signOut').onclick = guard(async () => { await api('POST', '/auth/logout'); location.replace('/login.html'); });
$('#pwSave').onclick = guard(async () => {
  if ($('#pwNew').value !== $('#pwNew2').value) throw new Error('The two new passwords are not the same');
  await api('POST', '/auth/password', { current: $('#pwCur').value, password: $('#pwNew').value });
  for (const i of ['#pwCur', '#pwNew', '#pwNew2']) $(i).value = '';
  toast('Password changed. Other phones and computers signed in as you are signed out.');
});
async function renderUsers() {
  if (!can('admin')) return;
  const users = await api('GET', '/auth/users');
  const tb = $('#userBody'); tb.innerHTML = '';
  for (const u of users) {
    const role = h('select', { onchange: guard(async ev => { try { await api('PUT', '/auth/users/' + encodeURIComponent(u.name), { role: ev.target.value }); toast(`${u.name} is now ${ev.target.value}`); } finally { if (u.name === S.me.name) location.reload(); else renderUsers(); } }) },
      ...S.roles.map(r => h('option', { value: r, ...(r === u.role ? { selected: true } : {}) }, r[0].toUpperCase() + r.slice(1))));
    tb.append(h('tr', {}, h('td', {}, u.name + (u.name === S.me.name ? ' (you)' : '')), h('td', {}, role), h('td', {},
      h('button', { onclick: guard(async () => { const pw = prompt(`New password for ${u.name} (at least 8 characters)`); if (!pw) return; await api('PUT', '/auth/users/' + encodeURIComponent(u.name), { password: pw }); toast('Password set'); }) }, 'Set password'), ' ',
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
  $('#ctEmail').value = c.email; $('#ctPhone').value = c.phone;
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

// ---------------------------------------------------------------- start
$$('#views button').forEach(b => b.onclick = () => setView(b.dataset.view));
window.addEventListener('beforeunload', e => { if (dirty || (editing && JSON.stringify(draft) !== JSON.stringify(S.config))) { e.preventDefault(); e.returnValue = ''; } });
load().then(() => { connect(); setView('workspace'); firstRunSamples(); }).catch(e => toast('Cannot reach the server: ' + e.message, true));
