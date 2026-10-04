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
const clone = o => JSON.parse(JSON.stringify(o));
const PALETTE = { '0': '', '1': '#e8833a', '2': '#3fa34d', '3': '#a8c64a', '4': '#c94040', '5': '#3a7be8', '6': '#8a5cd6', '7': '#e8c33a', '8': '#777f88' };
const bg = v => (v === '' || v === null || v === undefined) ? '' : (PALETTE[String(v)] ?? String(v));

let S = null;                 // server state
let view = 'workspace', wsName = null, zoom = 'fit';
let editing = false, draft = null, sel = null;   // sel = {kind:'el'|'gfx', id}
let soundOn = false;
const audios = new Map();

async function api(method, url, body, raw) {
  const opt = { method, headers: {} };
  if (body !== undefined) { if (raw) { opt.body = body; opt.headers['Content-Type'] = 'text/plain'; } else { opt.body = JSON.stringify(body); opt.headers['Content-Type'] = 'application/json'; } }
  const r = await fetch(url, opt);
  const ct = r.headers.get('content-type') || '';
  const data = ct.includes('json') ? await r.json() : await r.text();
  if (!r.ok || (data && data.ok === false && data.error)) throw new Error(data.error || r.statusText);
  return data;
}
function toast(msg, bad) { const t = $('#toast'); t.textContent = msg; t.className = 'show' + (bad ? ' bad' : ''); clearTimeout(t._t); t._t = setTimeout(() => t.className = '', bad ? 5000 : 2200); }
const guard = fn => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message, true); } };

// ---------------------------------------------------------------- load + live
async function load() {
  S = await api('GET', '/ui/state');
  $('#title').textContent = S.config.title || 'Brew Panel';
  document.title = S.config.title || 'Brew Panel';
  if (!wsName || !S.config.workspaces.some(w => w.name === wsName)) wsName = S.config.workspaces[0]?.name;
  renderAll();
}
function renderAll() { renderTabs(); renderWs(); renderScripts(); renderGlobals(); renderDevices(); renderSettings(); renderConsole(); }

function connect() {
  const es = new EventSource('/ui/events');
  es.onopen = () => $('#conn').classList.add('on');
  es.onerror = () => $('#conn').classList.remove('on');
  es.addEventListener('values', e => {
    const ch = JSON.parse(e.data);
    for (const [n, props] of Object.entries(ch)) { S.values[n] = { ...(S.values[n] || {}), ...props }; updateEl(n); }
    renderPipes(); updateAlarms(); if (view === 'globals') refreshGlobalValues(ch);
  });
  es.addEventListener('scripts', e => { S.scripts = JSON.parse(e.data); renderScriptList(); updateScriptState(); });
  es.addEventListener('print', e => { S.console.push(JSON.parse(e.data)); if (S.console.length > 1500) S.console.splice(0, 300); renderConsole(); });
  es.addEventListener('show', e => { const n = JSON.parse(e.data); if (S.config.workspaces.some(w => w.name === n)) { wsName = n; setView('workspace'); renderTabs(); renderWs(); } });
  es.addEventListener('config', () => { if (!editing) load(); });
  es.addEventListener('devices', e => { S.devices = JSON.parse(e.data); renderDevices(); });
}

function setView(v) {
  view = v;
  $$('#views button').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  $$('.view').forEach(s => s.classList.toggle('active', s.id === 'view-' + v));
  if (v === 'workspace') fitZoom();
  if (v === 'log') loadLogNames();
}

// ---------------------------------------------------------------- workspaces
const L = () => editing ? draft : S.config;          // layout being shown
const curWs = () => L().workspaces.find(w => w.name === wsName) || L().workspaces[0];

function renderTabs() {
  const t = $('#wsTabs'); t.innerHTML = '';
  for (const w of L().workspaces) t.append(h('button', { class: w.name === wsName ? 'active' : '', onclick: () => { wsName = w.name; sel = null; renderTabs(); renderWs(); } }, w.name));
}

function fitZoom() {
  const w = curWs(); if (!w) return;
  const z = zoom === 'fit' ? Math.min(1, ($('#wsScroll').clientWidth - 4) / (w.width || 1600)) : +zoom;
  const ws = $('#ws');
  ws.style.transform = `scale(${z})`; ws.dataset.z = z;
  $('#wsSizer').style.width = (w.width || 1600) * z + 'px';
  $('#wsSizer').style.height = (w.height || 900) * z + 'px';
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
  for (const g of L().graphics.filter(g => g.workspace === w.name && g.kind !== 'pipe')) ws.append(buildGfx(g));
  for (const e of L().elements.filter(e => e.workspace === w.name)) ws.append(buildEl(e));
  renderPipes(); fitZoom();
}

function place(node, o) { node.style.left = (o.x || 0) + 'px'; node.style.top = (o.y || 0) + 'px'; node.style.width = (o.w || 120) + 'px'; node.style.height = (o.h || 60) + 'px'; }

function buildGfx(g) {
  const n = h('div', { class: 'gfx' + (g.kind === 'text' ? ' txt' : ''), 'data-gid': g.id });
  place(n, g);
  if (g.kind === 'image') n.style.backgroundImage = g.image ? `url("${media(g.image)}")` : '';
  else { n.textContent = g.text || ''; n.style.fontSize = (g.fontSize || 16) + 'px'; n.style.color = g.color || ''; n.style.fontWeight = g.bold ? '700' : ''; }
  if (editing) { n.append(h('div', { class: 'rs' })); if (sel?.kind === 'gfx' && sel.id === g.id) n.classList.add('sel'); }
  return n;
}

function buildEl(e) {
  const n = h('div', { class: 'el ' + e.type, 'data-name': e.name }, h('div', { class: 'nm' }), h('div', { class: 'vl' }));
  place(n, e);
  if (e.hideName) n.querySelector('.nm').classList.add('hidden');
  if (e.type === 'timer') n.append(h('div', { class: 'btns' },
    h('button', { title: 'Start', onclick: ev => { ev.stopPropagation(); setProp(e.name, 'running', true); } }, '▶'),
    h('button', { title: 'Stop', onclick: ev => { ev.stopPropagation(); setProp(e.name, 'running', false); } }, '■'),
    h('button', { title: 'Reset', onclick: ev => { ev.stopPropagation(); setProp(e.name, 'value', '00:00:00'); } }, '↺')));
  if (editing) { n.append(h('div', { class: 'rs' })); if (sel?.kind === 'el' && sel.id === e.name) n.classList.add('sel'); }
  fillEl(n, e);
  return n;
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
    case 'global': case 'shared': text = fmtVal(e, v.value) + (e.units ? ' ' + e.units : ''); break;
    case 'digitalOut': case 'switch': case 'digitalIn':
      on = !!v.state; text = on ? (e.onText ?? 'ON') : (e.offText ?? 'OFF');
      if (e.type === 'digitalIn' && e.mode === 'counter') text = `${v.count ?? 0}${e.units ? ' ' + e.units : ''}`;
      img = (on ? v.imageon : v.imageoff) || v.image || ''; break;
    case 'temperature': case 'analogIn': text = v.fault ? 'FAULT' : fmtVal(e, v.value) + (e.units ? ' ' + e.units : ''); break;
    case 'pwmOut': text = fmtVal(e, v.value) + ' %'; on = v.enabled !== false && v.value > 0; break;
    case 'analogOut': text = fmtVal(e, v.value) + (e.units ? ' ' + e.units : ''); on = v.enabled !== false && v.value > (e.rangeLow ?? 0); break;
    case 'scale': text = `${fmtVal(e, v.volume)} ${e.volumeUnits || 'gal'} · ${fmtVal(e, v.value)} ${e.weightUnits || 'lb'}`; break;
    case 'flowMeter': text = `${fmtVal(e, v.rate)} ${e.units || 'gal'}/min · ${fmtVal(e, v.total)} ${e.units || 'gal'}`; on = v.rate > 0; break;
    case 'timer': text = v.value ?? '00:00:00'; on = !!v.running; break;
    case 'alarm': text = v.active ? (e.activeText ?? 'ALARM') : (e.idleText ?? ''); n.classList.toggle('active', !!v.active);
      img = (v.active ? v.imageon : v.imageoff) || v.image || ''; n.classList.toggle('img-alarm', !!(v.imageon || v.image)); break;
    case 'label': text = v.displayname ?? e.name; nm.classList.add('hidden'); break;
    case 'picture':
      // A screen picture: static image, or it follows another element (on image / off image)
      if (e.follow) { on = isOn(e.follow); img = (on ? v.imageon : v.imageoff) || v.image || ''; }
      text = e.text ?? ''; break;
  }
  if (e.type === 'label') n.classList.add('text');
  for (const k of ['led', 'lcd', 'dark', 'button']) n.classList.toggle('look-' + k, e.look === k);
  vl.textContent = e.hideValue ? '' : text;
  n.classList.toggle('on', on && e.type !== 'picture');
  n.classList.toggle('vhidden', v.visibility === 'hidden');
  n.classList.toggle('fault', !!v.fault);
  n.style.backgroundColor = img ? '' : bg(v.background);
  n.style.backgroundImage = img ? `url("${media(img)}")` : '';
  n.classList.toggle('has-img', !!img);
  if (e.fontSize) vl.style.fontSize = e.fontSize + 'px';
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
// tap: default | none | toggle | dialog | script | workspace,   tapTarget: element / script / workspace (default = itself)
function tapAction(e) {
  if (e.tap && e.tap !== 'default') return e.tap;
  switch (e.type) {
    case 'digitalOut': case 'switch': return 'toggle';
    case 'digitalIn': return ['latch', 'toggle', 'counter'].includes(e.mode) ? 'dialog' : simDev(e.device) ? 'toggle' : 'none';
    case 'pwmOut': case 'analogOut': case 'scale': return 'dialog';
    case 'analogIn': case 'temperature': return simDev(e.device) && !e.sim ? 'dialog' : 'none';
    case 'alarm': return 'acknowledge';
    case 'global': case 'shared': return e.readOnly ? 'none' : 'dialog';
    case 'picture': return e.follow ? 'toggle' : 'none';
    default: return 'none';
  }
}
const elByName = n => S.config.elements.find(x => x.name === n);
const boolProp = t => t.type === 'alarm' ? 'active' : t.type === 'digitalIn' ? 'raw' : (t.type === 'global' || t.type === 'shared') ? 'value' : 'state';
const isBoolEl = t => ['digitalOut', 'switch', 'digitalIn', 'alarm'].includes(t.type) || ((t.type === 'global' || t.type === 'shared') && t.dataType === 'bool');

async function doTap(e) {
  const act = tapAction(e);
  const targetName = e.tapTarget || (e.type === 'picture' ? e.follow : e.name);
  if (act === 'none') return;
  if (act === 'acknowledge') { if (S.values[e.name]?.active) setProp(e.name, 'active', false); return; }
  if (act === 'workspace') { if (S.config.workspaces.some(w => w.name === targetName)) { wsName = targetName; renderTabs(); renderWs(); } return; }
  if (act === 'script') {
    if (e.confirm && !(await choose(`Start script ${targetName}?`, [['Start', true]]))) return;
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

$('#ws').addEventListener('click', ev => {
  if (editing) return;
  const n = ev.target.closest('.el'); if (!n || ev.target.closest('.btns')) return;
  const e = elByName(n.dataset.name); if (e) doTap(e);
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

function valueDialog(t) {
  const v = S.values[t.name] || {};
  const title = v.displayname ?? t.name;
  if (t.type === 'scale') return scaleDialog(t, title);
  if (t.type === 'digitalIn') {   // latch / toggle: reset to off; counter: count back to 0
    const sim = simDev(t.device) ? [['Simulate: input ON', 'on'], ['Simulate: input OFF', 'off']] : [];
    return choose(title, [...sim, t.mode === 'counter' ? ['Reset count to 0', 'count'] : ['Reset (off)', 'reset']])
      .then(r => r === 'count' ? setProp(t.name, 'count', 0) : r === 'reset' ? setProp(t.name, 'reset', true) : r ? setProp(t.name, 'raw', r === 'on') : undefined);
  }
  if (isBoolEl(t)) return choose(title, [['ON', true], ['OFF', false]], isOn(t.name)).then(r => r !== undefined && setProp(t.name, boolProp(t), r));
  const numDev = ['pwmOut', 'analogOut', 'analogIn', 'temperature'].includes(t.type);
  if (!(t.type === 'global' || t.type === 'shared' || numDev) || t.readOnly) return;
  if (numDev) t = { ...t, dataType: 'value', units: t.type === 'pwmOut' ? '%' : t.units,
    min: t.type === 'pwmOut' ? 0 : t.type === 'analogOut' ? (t.rangeLow ?? 0) : t.min, max: t.type === 'pwmOut' ? 100 : t.type === 'analogOut' ? (t.rangeHigh ?? 100) : t.max };
  const d = $('#valDlg'); d.innerHTML = '';
  const num = t.dataType === 'value';
  const inp = t.dataType === 'string'
    ? h('textarea', { class: 'vdInput', rows: 3 }, v.value ?? '')
    : h('input', { class: 'vdInput', value: num ? fmtVal(t, v.value) : (v.value ?? ''), inputmode: num ? 'decimal' : 'text', placeholder: t.dataType === 'time' ? 'hh:mm:ss' : '' });
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
    num ? h('div', { class: 'vdRow' }, h('button', { type: 'button', class: 'big', onclick: () => bump(-1) }, '−'), inp, h('button', { type: 'button', class: 'big', onclick: () => bump(1) }, '+')) : inp,
    h('div', { class: 'vdBtns' }, h('button', { type: 'button', class: 'big', onclick: () => done(false) }, 'Cancel'), h('button', { type: 'button', class: 'big primary', onclick: () => done(true) }, 'Set')));
  inp.addEventListener('keydown', k => { if (k.key === 'Enter' && t.dataType !== 'string') { k.preventDefault(); done(true); } });
  d.showModal(); setTimeout(() => { inp.focus(); inp.select?.(); }, 50);
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

// ---- pipes: drawn lines that show flow when all of their "flow when" elements are on
function isOn(name) {
  const v = S.values[name]; if (!v) return false;
  if ('state' in v) return !!v.state;
  if ('active' in v) return !!v.active;
  if ('running' in v) return !!v.running;
  return !!v.value && v.value !== '0' && v.value !== 'false';
}
let drawPts = null, drawCursor = null;
function renderPipes() {
  const svg = $('#pipes'); const w = curWs(); if (!w) return;
  const NS = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';
  const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e; };
  for (const p of L().graphics.filter(g => g.kind === 'pipe' && g.workspace === w.name)) {
    const pts = (p.points || []).map(q => q.join(',')).join(' ');
    const flowing = (p.flowWhen || []).length > 0 && p.flowWhen.every(isOn);
    const width = +p.width || 8;
    const g = mk('g', { 'data-gid': p.id });
    if (p.baseVisible !== false || editing) g.append(mk('polyline', { class: 'pipe', points: pts, stroke: p.color || '#8a8f96', 'stroke-width': width, opacity: p.baseVisible === false ? 0.35 : 1 }));
    g.append(mk('polyline', { class: 'flow' + (flowing ? '' : ' off') + (p.reverse ? ' rev' : ''), points: pts, stroke: p.flowColor || '#4fb3ff', 'stroke-width': Math.max(3, width * 0.55) }));
    const hit = mk('polyline', { class: 'hit', points: pts }); g.append(hit);
    if (editing) {
      if (sel?.kind === 'gfx' && sel.id === p.id) g.append(mk('polyline', { points: pts, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-dasharray': '4 3' }));
      (p.points || []).forEach((q, i) => { const c = mk('circle', { class: 'handle', cx: q[0], cy: q[1], r: 6, 'data-gid': p.id, 'data-pi': i }); g.append(c); });
    }
    svg.append(g);
  }
  if (drawPts) {
    const all = drawCursor ? [...drawPts, drawCursor] : drawPts;
    svg.append(mk('polyline', { class: 'drawing', points: all.map(q => q.join(',')).join(' ') }));
  }
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
  $('#editHint').textContent = on ? 'Drag to move, corner to resize, double-click (or hold a finger) for properties.' : '';
  renderTabs(); renderWs();
}

let drag = null;
$('#ws').addEventListener('pointerdown', ev => {
  if (!editing) return;
  const p = canvasPt(ev);
  if (drawPts) {                                   // drawing a pipe
    let q = [snap(p[0]), snap(p[1])];
    const last = drawPts[drawPts.length - 1];
    if (last && !ev.shiftKey) { if (Math.abs(q[0] - last[0]) > Math.abs(q[1] - last[1])) q[1] = last[1]; else q[0] = last[0]; }
    if (ev.detail >= 2) { finishPipe(); return; }  // double-click finishes the pipe
    drawPts.push(q); renderPipes(); return;
  }
  const handle = ev.target.closest('circle.handle');
  if (handle) { sel = { kind: 'gfx', id: handle.dataset.gid }; drag = { mode: 'point', item: findItem('gfx', sel.id), i: +handle.dataset.pi }; ev.preventDefault(); return; }
  const hit = ev.target.closest('#pipes g');
  const node = ev.target.closest('.el,.gfx');
  if (hit && !node) { startLongPress(ev, 'gfx', hit.dataset.gid); sel = { kind: 'gfx', id: hit.dataset.gid }; drag = { mode: 'pipe', item: findItem('gfx', sel.id), start: p, orig: clone(findItem('gfx', sel.id).points) }; renderWs(); return; }
  if (!node) { sel = null; renderWs(); return; }
  sel = node.dataset.name ? { kind: 'el', id: node.dataset.name } : { kind: 'gfx', id: node.dataset.gid };
  const item = findItem(sel.kind, sel.id);
  startLongPress(ev, sel.kind, sel.id);
  drag = { mode: ev.target.classList.contains('rs') ? 'resize' : 'move', item, node, start: p, orig: { x: item.x || 0, y: item.y || 0, w: item.w || 120, h: item.h || 60 } };
  $$('#ws .sel').forEach(n => n.classList.remove('sel')); node.classList.add('sel');
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
  if (drag.mode === 'move') { drag.item.x = snap(drag.orig.x + dx); drag.item.y = snap(drag.orig.y + dy); place(drag.node, drag.item); }
  else if (drag.mode === 'resize') { drag.item.w = Math.max(20, snap(drag.orig.w + dx)); drag.item.h = Math.max(16, snap(drag.orig.h + dy)); place(drag.node, drag.item); }
  else if (drag.mode === 'point') { drag.item.points[drag.i] = [snap(p[0]), snap(p[1])]; renderPipes(); }
  else if (drag.mode === 'pipe') { drag.item.points = drag.orig.map(q => [snap(q[0] + dx), snap(q[1] + dy)]); renderPipes(); }
});
window.addEventListener('pointerup', () => { cancelLongPress(); if (drag?.mode === 'point' || drag?.mode === 'pipe') renderWs(); drag = null; });
$('#ws').addEventListener('dblclick', ev => {
  if (!editing) return;
  if (drawPts) return finishPipe();
  const node = ev.target.closest('.el,.gfx');
  const pipe = ev.target.closest('#pipes g');
  if (node) editItem(node.dataset.name ? 'el' : 'gfx', node.dataset.name || node.dataset.gid);
  else if (pipe) editItem('gfx', pipe.dataset.gid);
});
document.addEventListener('keydown', ev => {
  if (!drawPts) return;
  if (ev.key === 'Enter') finishPipe();
  if (ev.key === 'Escape') { drawPts = null; drawCursor = null; renderPipes(); $('#editHint').textContent = ''; $('#finishPipe').classList.add('hidden'); }
});
// Touch screens have no double-click: hold a finger on an item for 0.6 s to open its properties
let lp = null;
function startLongPress(ev, kind, id) {
  cancelLongPress();
  lp = { x: ev.clientX, y: ev.clientY, t: setTimeout(() => { lp = null; if (drag) { drag = null; renderWs(); } editItem(kind, id); }, 600) };
}
function cancelLongPress() { if (lp) { clearTimeout(lp.t); lp = null; } }

function finishPipe() {
  $('#finishPipe').classList.add('hidden');
  const pts = drawPts; drawPts = null; drawCursor = null;
  if (!pts || pts.length < 2) { renderPipes(); return; }
  const g = { id: newId(), kind: 'pipe', workspace: wsName, points: pts, width: 10, color: '#8a8f96', flowColor: '#4fb3ff', flowWhen: [], baseVisible: true };
  draft.graphics.push(g); sel = { kind: 'gfx', id: g.id }; renderWs(); editItem('gfx', g.id);
  $('#editHint').textContent = '';
}

$('#editMode').addEventListener('change', e => {
  if (!e.target.checked && editing && JSON.stringify(draft) !== JSON.stringify(S.config) && !confirm('Discard layout changes?')) { e.target.checked = true; return; }
  setEditing(e.target.checked);
});
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
  ]],
  ['Devices: digital inputs (board pin)', [
    ['Switch (on while closed)', 'digitalIn', 'DI', { mode: 'switch' }],
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
  ['Devices: weight', [
    ['Vessel scale: load cells on an HX711 board (weight and volume)', 'scale', 'Scale', { weightUnits: 'lb', volumeUnits: 'gal', specificGravity: 1, autoTare: true, precision: 2 }],
  ]],
  ['Widgets (app only, no board pin)', [
    ['Picture', 'picture'], ['Global', 'global'], ['Shared variable', 'shared'], ['Switch (on screen only)', 'switch'],
    ['Timer', 'timer'], ['Alarm', 'alarm'], ['Label', 'label'],
  ]],
];
$('#addType').append(...ADD_MENU.map(([group, items], gi) => h('optgroup', { label: group }, ...items.map((it, ii) => h('option', { value: gi + ':' + ii }, it[0])))));
$('#addEl').onclick = () => {
  const [gi, ii] = $('#addType').value.split(':').map(Number);
  const [, type, prefix, preset] = ADD_MENU[gi][1][ii];
  let i = 1, base = (prefix || type) + '_';
  while (draft.elements.some(e => e.name === base + i)) i++;
  const e = { name: base + i, type, workspace: wsName, x: 40, y: 40, w: type === 'label' ? 200 : type === 'flowMeter' ? 190 : 130, h: type === 'timer' ? 80 : 60, ...clone(preset || {}) };
  if (type === 'global' || type === 'shared') e.dataType = 'value';
  if (type === 'temperature') { e.units = '°F'; e.precision = 1; }
  if (type === 'picture') { e.hideName = true; e.w = 140; e.h = 120; }
  draft.elements.push(e); sel = { kind: 'el', id: e.name }; renderWs(); editItem('el', e.name);
};
$('#addImg').onclick = () => { const g = { id: newId(), kind: 'image', workspace: wsName, x: 40, y: 40, w: 200, h: 200, image: '' }; draft.graphics.push(g); renderWs(); editItem('gfx', g.id); };
$('#addText').onclick = () => { const g = { id: newId(), kind: 'text', workspace: wsName, x: 40, y: 40, w: 220, h: 40, text: 'Text', fontSize: 18 }; draft.graphics.push(g); renderWs(); editItem('gfx', g.id); };
$('#finishPipe').onclick = () => finishPipe();
$('#drawPipe').onclick = () => { $('#finishPipe').classList.remove('hidden'); drawPts = []; $('#editHint').textContent = 'Click points (Shift = any angle). Double-click or Enter to finish, Esc to cancel.'; };
$('#addWs').onclick = () => {
  const n = prompt('New workspace name'); if (!n) return;
  if (draft.workspaces.some(w => w.name === n)) return toast('That name is used', true);
  draft.workspaces.push({ name: n, width: 1600, height: 900 }); wsName = n; renderTabs(); renderWs();
};
$('#wsProps').onclick = () => editWorkspace();
$('#saveLayout').onclick = guard(async () => {
  await api('PUT', '/ui/layout', { workspaces: draft.workspaces, elements: draft.elements, graphics: draft.graphics });
  toast('Layout saved'); editing = false; await load(); setEditing(false);
});
$('#cancelLayout').onclick = () => setEditing(false);
$('#zoom').onchange = e => { zoom = e.target.value; fitZoom(); };
window.addEventListener('resize', () => { if (view === 'workspace') fitZoom(); });

// ---------------------------------------------------------------- properties dialog
// field: [key, label, kind, options]
const F = {
  common: [['name', 'Name', 'text'], ['displayName', 'Display name', 'text'], ['workspace', 'Workspace', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'],
    ['background', 'Background (1-8 or color)', 'text'], ['image', 'Image path', 'path'], ['visibility', 'Visibility', 'sel', ['visible', 'hidden']], ['hideName', 'Hide name', 'bool'], ['hideValue', 'Hide value / text', 'bool'], ['look', 'Look', 'sel', ['normal', 'led', 'lcd', 'dark', 'button']], ['fontSize', 'Value font size', 'num'],
    ['tap', 'When tapped', 'sel', ['default', 'none', 'toggle', 'dialog', 'script', 'workspace']], ['tapTarget', 'Tap target (element, script or workspace; empty = itself)', 'text'], ['confirm', 'Ask before changing (ON / OFF buttons)', 'bool']],
  global: [['dataType', 'Data type', 'sel', ['value', 'string', 'bool', 'time', 'datetime']], ['initial', 'Initial value', 'text'], ['precision', 'Decimals', 'num'], ['units', 'Units', 'text'], ['step', '+ / - step', 'num'], ['min', 'Lowest allowed', 'num'], ['max', 'Highest allowed', 'num'], ['readOnly', 'Read only on screen', 'bool'], ['retain', 'Keep value on restart', 'bool', true]],
  digitalOut: [['device', 'Device', 'dev'], ['channel', 'Pin (e.g. 22, or A5 = 59)', 'pin', 'digital'], ['activeLow', 'Invert (pin LOW = on)', 'bool'], ['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  switch: [['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  digitalIn: [['device', 'Device', 'dev'], ['channel', 'Pin (e.g. 30, or A8 = 62)', 'pin', 'digital'],
    ['mode', 'Input type', 'sel', ['switch', 'toggle', 'latch', 'counter']],
    ['activeLow', 'Invert / active low (normally-closed contact)', 'bool'], ['pullup', 'Use the board\'s pull-up (switch wired to GND)', 'bool', true],
    ['debounce', 'Debounce on the board (ms, empty = 20)', 'num'], ['onDelay', 'On delay (seconds the input must stay on)', 'num'], ['offDelay', 'Off delay (seconds the input must stay off)', 'num'],
    ['units', 'Counter units (e.g. presses, gal)', 'text'], ['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  pwmOut: [['device', 'Device', 'dev'], ['channel', 'PWM pin (Mega: 2-13, 44-46)', 'pin', 'pwm'], ['initial', 'Start value (%)', 'num'], ['precision', 'Decimals', 'num']],
  analogOut: [['device', 'Device', 'dev'], ['channel', 'PWM pin feeding the 0-10 V / 4-20 mA module', 'pin', 'pwm'], ['signal', 'Signal', 'sel', ['0-10V', '4-20mA', '0-5V']],
    ['rangeLow', 'Value at lowest signal (0 V / 4 mA)', 'num'], ['rangeHigh', 'Value at highest signal (10 V / 20 mA)', 'num'], ['units', 'Units', 'text'], ['precision', 'Decimals', 'num']],
  scale: [['device', 'Device', 'dev'], ['channel', 'HX711 DT pin(s), comma between several boards on one vessel (e.g. 26, 28)', 'text'],
    ['countsPerUnit', 'Calibration: counts per lb / kg (tap the scale > Calibrate to measure it)', 'num'],
    ['weightUnits', 'Weight units', 'sel', ['lb', 'kg']], ['volumeUnits', 'Volume units', 'sel', ['gal', 'L']],
    ['specificGravity', 'Liquid specific gravity (water = 1.000, wort e.g. 1.050)', 'num'], ['sgFrom', 'Or take the gravity from (e.g. a Global with the OG)', 'elem'],
    ['offset', 'Weight offset (added after tare)', 'num'],
    ['autoTare', 'Auto tare: zero itself when the volume reads empty and steady', 'bool', true], ['autoTareBand', 'Counts as empty below (gal / L; empty = 0.05 gal or 0.2 L)', 'num'], ['autoTareSeconds', 'Steady for (seconds, empty = 10)', 'num'],
    ['precision', 'Decimals', 'num'], ['sim', 'Simulator settings (JSON), e.g. {"fillWhen":"Pump_1","drainWhen":"Valve_2","rate":20}', 'json'], ['info', 'Raw reading now', 'info']],
  flowMeter: [['device', 'Device', 'dev'], ['channel', 'Pulse pin (Mega: 2, 3, 18, 19, 20 or 21)', 'pin', 'interrupt'], ['pulsesPerUnit', 'Pulses per unit (from the meter\'s data sheet)', 'num'], ['units', 'Units (gal, L …)', 'text'], ['precision', 'Decimals', 'num'], ['sim', 'Simulator settings (JSON), e.g. {"rate":2,"when":"Pump_1"}', 'json']],
  timer: [['timerType', 'Type', 'sel', ['countup', 'countdown']]],
  alarm: [['sound', 'Sound file path (.wav / .mp3)', 'path'], ['loop', 'Repeat sound', 'bool'], ['activeText', 'Text when sounding', 'text'], ['imageOn', 'Image when sounding', 'path'], ['imageOff', 'Image when quiet', 'path']],
  picture: [['follow', 'Follow element (on/off image follows it; empty = static)', 'elem'], ['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['text', 'Text on picture', 'text']],
  label: [],
  image: [['image', 'Image path', 'path'], ['workspace', 'Workspace', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num']],
  text: [['text', 'Text', 'area'], ['fontSize', 'Font size', 'num'], ['color', 'Color', 'text'], ['bold', 'Bold', 'bool'], ['workspace', 'Workspace', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num']],
  pipe: [['label', 'Label', 'text'], ['flowWhen', 'Flow when ALL of these are on (Ctrl or Cmd-click to pick several)', 'multi'], ['reverse', 'Reverse flow direction', 'bool'], ['width', 'Width', 'num'], ['color', 'Pipe color', 'text'], ['flowColor', 'Flow color', 'text'], ['baseVisible', 'Show pipe when not flowing (off = background already shows pipes)', 'bool', true], ['workspace', 'Workspace', 'ws']],
};
F.shared = F.global.filter(f => f[0] !== 'retain').concat([['retain', 'Keep value on restart', 'bool', true]]);

// Temperature and analog inputs: the settings depend on the sensor / signal picked
const TEMP_COMMON = [['offset', 'Calibration offset (added to the reading)', 'num'], ['units', 'Units (°F or °C)', 'text'], ['precision', 'Decimals', 'num'], ['sim', 'Simulator settings (JSON)', 'json']];
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
function fieldsFor(item) {
  if (item.type === 'temperature') {
    const s = item.sensor || 'ds18b20';
    return [['sensor', 'Probe type', 'sel', ['ds18b20', 'pt100', 'pt1000', 'thermocouple', 'ntc'], true], ...SENSOR_FIELDS[s] ?? [], ...TEMP_COMMON, ['info', 'Reading now', 'info']];
  }
  if (item.type === 'analogIn') {
    const sig = item.signal || 'raw';
    return [['device', 'Device', 'dev'], ['adc', 'Read by', 'sel', ['board', 'ads1115'], true], item.adc === 'ads1115' ? ['channel', 'ADS1115 channel (0-3)', 'num'] : ['channel', 'Analog pin (A0-A15, or BruControl 54-69)', 'pin', 'analog'], ['signal', 'Sensor signal', 'sel', ['raw', '0-5V', '0.5-4.5V', '1-5V', '0-10V', '4-20mA', '0-20mA', 'twoPoint'], true],
      ...SIGNAL_FIELDS[sig] ?? SIGNAL_FIELDS.range,
      ...(sig === '0-10V' ? [['divider', 'Input divider (10 V -> 5 V = 2)', 'num']] : []), ...(sig.endsWith('mA') ? [['shunt', 'Resistor across the input (ohm, usually 250)', 'num']] : []),
      ['units', 'Units', 'text'], ['precision', 'Decimals', 'num'], ['sim', 'Simulator settings (JSON), e.g. {"value":12,"noise":0.2}', 'json'], ['info', 'Raw reading now', 'info']];
  }
  return F[item.type] || [];
}

function field([key, label, kind, opts, rerender], obj) {
  const v = obj[key];
  let input;
  if (kind === 'info') {     // live reading, to help with calibration
    const r = S.values[obj.name] || {};
    const txt = obj.type === 'scale' ? `${r.raw ?? '-'}  (tare ${obj.tareRaw ?? 'not set'})` : obj.type === 'analogIn' ? `${r.raw ?? '-'}${r.fault ? '  (signal out of range: check wiring)' : ''}` : r.fault ? 'FAULT: check the probe and its wiring' : `${fmtVal(obj, r.value)} ${obj.units || ''}`;
    return [h('label', {}, label), h('span', { class: 'info' }, txt)];
  }
  if (kind === 'pin') {      // free text with a list of Mega 2560 pins: A0-A15 and their BruControl numbers 54-69 mean the same pin
    input = h('input', { 'data-k': key, 'data-kind': kind, type: 'text', value: v ?? '', list: 'pins-' + opts, autocomplete: 'off', placeholder: opts === 'analog' ? 'A0' : '22' });
    return [h('label', {}, label), input];
  }
  if (kind === 'probe') input = h('select', { 'data-k': key, 'data-kind': 'num' }, h('option', { value: '' }, '(none)'),
    ...(S.config.probes || []).map(p => h('option', { value: p.index, ...(Number(v) === p.index ? { selected: true } : {}) }, `#${p.index} ${p.name || ''}${p.rom ? '  ' + p.rom : '  (no probe yet)'}`)));
  else if (kind === 'bool') input = h('input', { type: 'checkbox', 'data-k': key, 'data-kind': kind, ...(v ?? opts ? { checked: true } : {}) });
  else if (kind === 'sel') input = h('select', { 'data-k': key, 'data-kind': kind, ...(rerender ? { 'data-rerender': '1' } : {}) }, ...opts.map(o => h('option', { value: o, ...(String(v ?? opts[0]) === o ? { selected: true } : {}) }, o)));
  else if (kind === 'ws') input = h('select', { 'data-k': key, 'data-kind': kind }, ...draft.workspaces.map(w => h('option', { value: w.name, ...(w.name === v ? { selected: true } : {}) }, w.name)));
  else if (kind === 'dev') input = h('select', { 'data-k': key, 'data-kind': kind }, h('option', { value: '' }, '(none)'), ...(S.config.devices || []).map(d => h('option', { value: d.name, ...(d.name === v ? { selected: true } : {}) }, d.name)));
  else if (kind === 'elem') input = h('select', { 'data-k': key, 'data-kind': kind }, h('option', { value: '' }, key === 'follow' ? '(none - static picture)' : '(none)'), ...draft.elements.filter(e => e.type !== 'picture').map(e => e.name).sort().map(n => h('option', { value: n, ...(n === v ? { selected: true } : {}) }, n)));
  else if (kind === 'area' || kind === 'json') input = h('textarea', { 'data-k': key, 'data-kind': kind, spellcheck: 'false' }, kind === 'json' ? (v ? JSON.stringify(v) : '') : (v ?? ''));
  else if (kind === 'multi') {
    const names = draft.elements.filter(e => ['digitalOut', 'switch', 'digitalIn', 'alarm', 'global', 'shared'].includes(e.type)).map(e => e.name).sort();
    input = h('select', { 'data-k': key, 'data-kind': kind, multiple: true, size: 8 }, ...names.map(n => h('option', { value: n, ...((v || []).includes(n) ? { selected: true } : {}) }, n)));
  } else input = h('input', { 'data-k': key, 'data-kind': kind, type: kind === 'num' ? 'number' : 'text', value: v ?? '', ...(kind === 'path' ? { placeholder: 'e.g. valves/valve_open.png' } : {}) });
  const full = kind === 'multi' || kind === 'area';
  return full ? [h('label', { class: 'full' }, label), h('div', { class: 'full' }, input)] : [h('label', {}, label), input];
}

function readFields(obj) {
  for (const inp of $$('#dlgBody [data-k]')) {
    const k = inp.dataset.k, kind = inp.dataset.kind;
    let v;
    if (kind === 'bool') v = inp.checked;
    else if (kind === 'num') v = inp.value === '' ? undefined : +inp.value;
    else if (kind === 'pin') { const t = inp.value.trim().toUpperCase(); v = t === '' ? undefined : /^\d+$/.test(t) ? +t : t; }
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
    body.onchange = ev => { if (ev.target.dataset?.rerender) { try { readFields(obj); } catch { } build(); } };
    $('#dlgDelete').classList.toggle('hidden', !canDelete);
    const d = $('#dlg');
    d.onclose = () => res(d.returnValue);
    d.returnValue = 'cancel'; d.showModal();
  });
}

async function editItem(kind, id) {
  const item = findItem(kind, id); if (!item) return;
  const type = kind === 'el' ? item.type : item.kind;
  const fields = kind === 'el' ? it => [...F.common.slice(0, 3), ...fieldsFor(it), ...F.common.slice(3)] : F[type];
  const work = clone(item);
  const r = await dialog(kind === 'el' ? `${type} element` : type, fields, work, true);
  try {
    if (r === 'delete') {
      if (!confirm('Delete this item?')) return;
      if (kind === 'el') draft.elements = draft.elements.filter(e => e !== item); else draft.graphics = draft.graphics.filter(g => g !== item);
      sel = null; renderWs(); return;
    }
    if (r !== 'ok') return;
    readFields(work);
    if (kind === 'el') {
      work.name = (work.name || '').trim();
      if (!work.name) throw new Error('Name is required');
      if (work.name !== item.name && draft.elements.some(e => e.name === work.name)) throw new Error('That name is already used');
      if (work.name !== item.name) for (const g of draft.graphics) if (g.flowWhen) g.flowWhen = g.flowWhen.map(n => n === item.name ? work.name : n);
    }
    Object.keys(item).forEach(k => delete item[k]); Object.assign(item, work);
    if (kind === 'el') sel = { kind, id: item.name };
    renderTabs(); renderWs();
  } catch (e) { toast(e.message, true); }
}

async function editWorkspace() {
  const w = curWs(); const work = clone(w);
  const r = await dialog('Workspace', [['name', 'Name', 'text'], ['background', 'Background image path', 'path'], ['color', 'Background color', 'text'], ['width', 'Width', 'num'], ['height', 'Height', 'num'],
    ['bgX', 'Image left (empty = fill)', 'num'], ['bgY', 'Image top', 'num'], ['bgW', 'Image width', 'num'], ['bgH', 'Image height', 'num']], work, draft.workspaces.length > 1);
  if (r === 'delete') {
    if (!confirm(`Delete workspace "${w.name}" and everything on it?`)) return;
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
  if (soundOn) for (const e of S.config.elements.filter(e => e.type === 'alarm')) { const a = getAudio(e); if (a) { a.muted = true; a.play().then(() => { a.pause(); a.muted = false; }).catch(() => { a.muted = false; }); } }
  updateAlarms();
};
function getAudio(e) {
  const v = S.values[e.name] || {}; const src = v.sound || e.sound; if (!src) return null;
  let a = audios.get(e.name);
  if (!a || a._src !== src) { a = new Audio(media(src)); a._src = src; audios.set(e.name, a); }
  return a;
}
function updateAlarms() {
  for (const e of S.config.elements.filter(e => e.type === 'alarm')) {
    const v = S.values[e.name] || {}; const a = getAudio(e); if (!a) continue;
    a.loop = !!v.loop;
    if (v.active && soundOn) { if (a.paused && !a._playing) { a._playing = true; a.currentTime = 0; a.play().catch(() => { }); } }
    else { a._playing = false; if (!a.paused) a.pause(); }
  }
}

// ---------------------------------------------------------------- scripts
let curScript = null, dirty = false, problems = [];
function renderScripts() { renderScriptList(); }
function renderScriptList() {
  const ul = $('#scriptList'); ul.innerHTML = '';
  for (const s of S.scripts) {
    const cls = s.state === 'running' ? (s.waiting ? 'waiting' : 'running') : s.state === 'error' ? 'error' : '';
    ul.append(h('li', { class: s.name === curScript ? 'active' : '', title: s.error || s.state, onclick: () => openScript(s.name) }, h('span', { class: 'st ' + cls }), s.name, s.modified ? ' *' : ''));
  }
}
async function openScript(name) {
  if (dirty && !confirm('Discard unsaved changes?')) return;
  curScript = name; dirty = false; problems = [];
  $('#code').value = await api('GET', '/ui/scripts/' + encodeURIComponent(name));
  $('#scriptName').textContent = name;
  renderScriptList(); updateGutter(); updateScriptState(); renderProblems(); renderConsole();
}
function updateScriptState() {
  const s = S.scripts.find(x => x.name === curScript);
  const st = $('#scriptState');
  if (!s) { st.textContent = ''; updateGutter(); return; }
  let t = s.state;
  if (s.state === 'running') t = (s.waiting ? 'waiting' : 'running') + ` (line ${s.line})` + (s.modified ? ' - edited since start, stop and start to apply' : '');
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
$('#code').addEventListener('keydown', ev => {
  if (ev.key === 'Tab') { ev.preventDefault(); document.execCommand('insertText', false, '\t'); }
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); saveScript(); }
});
const saveScript = guard(async () => {
  if (!curScript) return;
  const r = await api('PUT', '/ui/scripts/' + encodeURIComponent(curScript), $('#code').value, true);
  dirty = false; $('#scriptName').textContent = curScript; problems = r.errors; renderProblems(); updateGutter();
  toast(problems.length ? `Saved with ${problems.length} problem(s)` : 'Saved', !!problems.length);
});
$('#saveScript').onclick = saveScript;
$('#checkScript').onclick = guard(async () => { const r = await api('POST', '/ui/scripts/check', $('#code').value, true); problems = r.errors; renderProblems(); updateGutter(); });
$('#startScript').onclick = guard(async () => {
  if (!curScript) return;
  if (dirty) await saveScript();
  const r = await api('POST', `/ui/scripts/${encodeURIComponent(curScript)}/start`);
  if (!r.ok) toast(r.line ? `Not started - line ${r.line}: ${r.msg}` : r.msg, true);
});
$('#stopScript').onclick = guard(() => api('POST', `/ui/scripts/${encodeURIComponent(curScript)}/stop`));
$('#stopAll').onclick = guard(() => api('POST', '/ui/stopall'));
$('#newScript').onclick = guard(async () => {
  const n = prompt('New script name'); if (!n) return;
  if (S.scripts.some(s => s.name === n.trim())) throw new Error('That name is used');
  await api('PUT', '/ui/scripts/' + encodeURIComponent(n.trim()), '//' + n.trim() + '\n', true);
  S.scripts = await api('GET', '/ui/scripts'); dirty = false; openScript(n.trim());
});
$('#renScript').onclick = guard(async () => {
  if (!curScript) return; const n = prompt('Rename to', curScript); if (!n || n === curScript) return;
  await api('POST', `/ui/scripts/${encodeURIComponent(curScript)}/rename`, { to: n.trim() });
  curScript = n.trim(); S.scripts = await api('GET', '/ui/scripts'); renderScriptList(); $('#scriptName').textContent = curScript;
});
$('#delScript').onclick = guard(async () => {
  if (!curScript || !confirm(`Delete script "${curScript}"?`)) return;
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

// ---------------------------------------------------------------- globals
function renderGlobals() {
  const tb = $('#globalsBody'); tb.innerHTML = '';
  for (const e of S.config.elements.filter(e => e.type === 'global').sort((a, b) => a.name.localeCompare(b.name))) {
    const v = S.values[e.name] || {}; const lg = e.log || { mode: 'none' };
    const val = h('input', { class: 'val', 'data-g': e.name, value: fmtVal(e, v.value), onchange: ev => setProp(e.name, 'value', ev.target.value) });
    const mode = h('select', { onchange: ev => saveLog(e.name, { ...(e.log || {}), mode: ev.target.value }) }, ...S.logModes.map(m => h('option', { value: m, ...(m === lg.mode ? { selected: true } : {}) }, { none: 'Off', ondemand: 'On demand', once: 'Once', seconds: 'Every N seconds', hours: 'Every N hours', days: 'Every N days' }[m])));
    const every = h('input', { type: 'number', min: 1, style: 'width:5em', value: lg.every ?? 1, title: 'N', onchange: ev => saveLog(e.name, { ...(e.log || { mode: 'seconds' }), every: +ev.target.value }) });
    tb.append(h('tr', {}, h('td', {}, e.name), h('td', {}, e.dataType), h('td', {}, val),
      h('td', {}, mode, ' ', ['seconds', 'hours', 'days'].includes(lg.mode) ? every : ''),
      h('td', {}, h('button', { onclick: guard(async () => { await api('POST', '/ui/log/now/' + encodeURIComponent(e.name)); toast('Logged'); }) }, 'Log now'),
        lg.mode === 'once' ? h('button', { title: 'Write one more time', onclick: guard(async () => { await api('POST', '/ui/log/once/' + encodeURIComponent(e.name)); toast('Armed'); }) }, 'Once again') : '')));
  }
  const sb = $('#sharedBody'); sb.innerHTML = '';
  for (const e of S.config.elements.filter(e => e.type === 'shared').sort((a, b) => a.name.localeCompare(b.name))) {
    sb.append(h('tr', {}, h('td', {}, e.name), h('td', {}, e.dataType), h('td', {}, h('input', { class: 'val', 'data-g': e.name, value: fmtVal(e, S.values[e.name]?.value), onchange: ev => setProp(e.name, 'value', ev.target.value) }))));
  }
}
function refreshGlobalValues(ch) {
  for (const n of Object.keys(ch)) { const inp = $(`input[data-g="${CSS.escape(n)}"]`); if (inp && document.activeElement !== inp) inp.value = fmtVal(S.config.elements.find(e => e.name === n) || {}, S.values[n].value); }
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
    tb.append(h('tr', {}, h('td', {}, d.name), h('td', {}, { serial: 'USB', ethernet: 'Ethernet', esp32: 'ESP32 (WiFi)', simulator: 'Simulator' }[d.type] || d.type), h('td', {}, d.host ? `${d.host}:${d.port ?? 4100}` : d.port || ''),
      h('td', { style: `color:${d.status === 'connected' ? 'var(--ok)' : 'var(--bad)'}` }, d.status), h('td', {}, d.info || ''),
      h('td', {}, h('button', { class: 'danger', onclick: guard(async () => { if (!confirm(`Remove device ${d.name}?`)) return; await api('PUT', '/ui/layout', { devices: S.config.devices.filter(x => x.name !== d.name) }); await load(); }) }, 'Remove'))));
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
      h('td', {}, h('input', { value: p.name || '', placeholder: 'e.g. HLT probe', onchange: ev => saveProbes(l => { l.find(x => x.index === p.index).name = ev.target.value; }) })),
      h('td', {}, h('select', { onchange: ev => setSlotRom(p.index, ev.target.value) }, h('option', { value: '' }, '(no probe)'),
        ...roms.map(r => h('option', { value: r, ...(r === p.rom ? { selected: true } : {}) }, r + (seen.has(r) ? '' : '  (not seen now)') + (slots.some(x => x.rom === r && x.index !== p.index) ? `  (in #${slots.find(x => x.rom === r).index})` : ''))))),
      h('td', {}, seen.has(p.rom) ? String(seen.get(p.rom).t) : p.rom ? 'not seen' : ''),
      h('td', {}, usedBy(p.index)),
      h('td', {}, h('button', { class: 'danger', onclick: () => { if (usedBy(p.index) && !confirm(`Probe #${p.index} is used by ${usedBy(p.index)}. Remove it anyway?`)) return; saveProbes(l => l.splice(l.findIndex(x => x.index === p.index), 1)); } }, 'Remove'))));
  }
  const pb = $('#probeBody'); pb.innerHTML = '';
  for (const [rom, { dev, t }] of seen) {
    const slot = slots.find(x => x.rom === rom);
    pb.append(h('tr', {}, h('td', {}, dev), h('td', {}, h('code', {}, rom)), h('td', {}, String(t)),
      h('td', {}, h('select', { onchange: ev => ev.target.value === 'new' ? newSlot(rom) : setSlotRom(+ev.target.value, rom, !ev.target.value) },
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
  $('#importResult').textContent = `Recipe: ${r.recipe}\nHops in recipe: ${r.hops}\nGlobals set: ${r.set}` +
    (r.missing.length ? `\n\nThese Globals do not exist (create them or change the mapping in Settings):\n  ${r.missing.join('\n  ')}` : '') +
    (r.warnings.length ? `\n\n${r.warnings.join('\n')}` : '');
});

// ---------------------------------------------------------------- settings
function renderSettings() {
  const c = S.config;
  $('#setTitle').value = c.title || '';
  $('#setMedia').value = (c.mediaRoots || []).join('\n');
  $('#setKey').value = c.apiKey || '';
  $('#setBeer').value = JSON.stringify(c.beerxml || {}, null, 2);
  const box = $('#setAuto'); box.innerHTML = '';
  for (const s of S.scripts) box.append(h('label', {}, h('input', { type: 'checkbox', value: s.name, ...((c.autostart || []).includes(s.name) ? { checked: true } : {}) }), s.name));
}
$('#saveSettings').onclick = guard(async () => {
  let beer; try { beer = JSON.parse($('#setBeer').value || '{}'); } catch { throw new Error('BeerXML mapping is not valid JSON'); }
  await api('PUT', '/ui/settings', {
    title: $('#setTitle').value, mediaRoots: $('#setMedia').value.split('\n').map(s => s.trim()).filter(Boolean),
    apiKey: $('#setKey').value.trim(), beerxml: beer, autostart: $$('#setAuto input:checked').map(i => i.value),
  });
  await load(); toast('Settings saved');
});

// ---------------------------------------------------------------- start
$$('#views button').forEach(b => b.onclick = () => setView(b.dataset.view));
window.addEventListener('beforeunload', e => { if (dirty || (editing && JSON.stringify(draft) !== JSON.stringify(S.config))) { e.preventDefault(); e.returnValue = ''; } });
load().then(() => { connect(); setView('workspace'); }).catch(e => toast('Cannot reach the server: ' + e.message, true));
