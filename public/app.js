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
  fillAddType();
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
  for (const g of L().graphics.filter(g => g.workspace === w.name && g.kind !== 'pipe' && g.kind !== 'ip')) ws.append(buildGfx(g));
  for (const e of L().elements.filter(e => e.workspace === w.name)) ws.append(buildEl(e));
  for (const g of L().graphics.filter(g => g.workspace === w.name && g.kind === 'ip')) ws.append(buildIp(g));
  for (const e of L().elements.filter(e => e.workspace === w.name && hasIps(e))) for (const q of devIps(e)) ws.append(buildDevIp(e, q));
  renderPipes(); fitZoom(); updLockBtn();
}

function place(node, o) { node.style.left = (o.x || 0) + 'px'; node.style.top = (o.y || 0) + 'px'; node.style.width = (o.w || 120) + 'px'; node.style.height = (o.h || 60) + 'px'; }

// Edit layout: a resize corner, or a padlock when the item is locked in place
function editDeco(n, o) {
  if (o.locked) { n.classList.add('locked'); n.append(h('div', { class: 'lock', title: 'Locked in place' }, '🔒')); }
  else n.append(h('div', { class: 'rs' }));
}

function buildGfx(g) {
  const n = h('div', { class: 'gfx' + (g.kind === 'text' ? ' txt' : ''), 'data-gid': g.id });
  place(n, g);
  if (g.kind === 'image') n.style.backgroundImage = g.image ? `url("${media(g.image)}")` : '';
  else { n.textContent = g.text || ''; n.style.fontSize = (g.fontSize || 16) + 'px'; n.style.color = g.color || ''; n.style.fontWeight = g.bold ? '700' : ''; }
  if (editing) { editDeco(n, g); if (sel?.kind === 'gfx' && sel.id === g.id) n.classList.add('sel'); }
  return n;
}

// variable classes: global, shared, vKonstant, vAPI
const isVarEl = e => ['global', 'shared', 'vKonstant', 'vAPI'].includes(e?.type);
const isApiEl = e => e?.type === 'global' || e?.type === 'vAPI';
const vkKind = e => e?.type === 'vKonstant' ? (e.kind || 'value') : null;
const kindsOf = type => type === 'vKonstant' ? S.vkKinds : type === 'vAPI' ? S.vapiKinds : null;
const prefixOf = e => kindsOf(e.type)?.[e.kind || 'value']?.prefix;

// IP (Initial Point) widget: app-only, not tied to any PLC or device port. A small marker where a flow starts or ends, e.g. at a pump outlet, a vessel port or a drain
// IP widget types. "point" is a plain start / end point; the others are pipe fittings that join pipes and pass flow through.
const FITTINGS = { point: 'IP point', tee: 'Tee', elbow90: '90° elbow', elbow45: '45° elbow', cross: 'Cross tee', manualValve: 'Manual valve' };
const isFitting = g => g && g.kind === 'ip' && g.fitting && g.fitting !== 'point';
const FIT_SVG = {
  tee: '<path d="M0 15H30M15 15V30"/>', cross: '<path d="M0 15H30M15 0V30"/>',
  elbow90: '<path d="M0 15H15V30"/>', elbow45: '<path d="M0 15H15L27 27"/>',
  manualValve: '<path d="M15 15V3M9 3H21"/><path class="body" d="M2 7L15 15L2 23ZM28 7L15 15L28 23Z"/>',
};
function buildIp(g) {
  const fit = isFitting(g) ? g.fitting : null;
  const n = h('div', { class: 'gfx ip' + (fit ? ' fit' : '') + (g.hideRun ? ' hide-run' : ''), 'data-gid': g.id, 'data-fit': fit || '', title: (g.label || FITTINGS[fit] || 'IP') + (fit === 'manualValve' ? (g.open ? ' (open)' : ' (closed)') : '') });
  if (fit) {
    n.innerHTML = `<svg viewBox="0 0 30 30" style="transform:rotate(${+g.rotate || 0}deg)"><g class="edge">${FIT_SVG[fit]}</g><g class="core">${FIT_SVG[fit]}</g></svg>`;
    if (fit === 'manualValve') n.classList.add(g.open ? 'open' : 'closed');
  } else n.append(h('span', {}, g.text ?? 'IP'));
  place(n, g);
  n.style.setProperty('--ipc', g.color || '#e8a33a');
  if (editing) { n.append(h('div', { class: 'rs' })); if (g.label) n.append(h('div', { class: 'iplbl' }, g.label)); if (sel?.kind === 'gfx' && sel.id === g.id) n.classList.add('sel'); }
  return n;
}

// Pumps and valves are Digital Output devices of kind "pump" or "valve". Each comes with two built-in IPs on the sides of its box:
// a pump has an inlet and an outlet, a valve has one at each end (flow can go either way through it).
const hasIps = e => e && ((e.type === 'digitalOut' && (e.subtype === 'pump' || e.subtype === 'valve')) || isPropValve(e));
// A proportional valve opens 0-100 %. It is an analog output (0-10 V / 4-20 mA) or a PWM output; until those output types exist
// it can also be a Global holding the percent. It passes flow whenever it is above 0 % open.
const PROP_TYPES = ['analogOut', 'pwmOut', 'global', 'shared'];
const isPropValve = e => e && e.subtype === 'propValve' && PROP_TYPES.includes(e.type);
function propPct(e) {
  const v = Number(S.values[e.name]?.value) || 0;
  if (e.type !== 'analogOut') return v;
  const lo = Number(e.rangeLow ?? 0), hi = Number(e.rangeHigh ?? 100);
  return hi === lo ? 0 : (v - lo) / (hi - lo) * 100;
}
const SIDES = ['left', 'right', 'top', 'bottom'];
function sidePt(e, side) {
  const x = e.x || 0, y = e.y || 0, w = e.w || 120, hh = e.h || 60;
  return side === 'right' ? [x + w, y + hh / 2] : side === 'top' ? [x + w / 2, y] : side === 'bottom' ? [x + w / 2, y + hh] : [x, y + hh / 2];
}
const devIps = e => {
  const v = e.subtype === 'valve' || e.subtype === 'propValve';
  return [{ id: `dev:${e.name}:in`, label: `${e.name} ${v ? 'end A' : 'inlet'}`, text: v ? 'A' : 'IN', c: sidePt(e, e.ipIn || 'left') },
    { id: `dev:${e.name}:out`, label: `${e.name} ${v ? 'end B' : 'outlet'}`, text: v ? 'B' : 'OUT', c: sidePt(e, e.ipOut || 'right') }];
};
function buildDevIp(e, q) {
  const n = h('div', { class: 'gfx ip devip', 'data-ipid': q.id, 'data-dev': e.name, title: q.label }, h('span', {}, q.text));
  place(n, { x: q.c[0] - 11, y: q.c[1] - 11, w: 22, h: 22 });
  n.style.setProperty('--ipc', e.subtype === 'pump' ? '#3fbf6a' : '#4fb3ff');
  return n;
}
function placeDevIps(e) {
  for (const q of devIps(e)) { const n = $(`#ws .devip[data-ipid="${CSS.escape(q.id)}"]`); if (n) place(n, { x: q.c[0] - 11, y: q.c[1] - 11, w: 22, h: 22 }); }
}

function buildEl(e) {
  const n = h('div', { class: 'el ' + e.type + (vkKind(e) ? ' k-' + vkKind(e) : ''), 'data-name': e.name }, h('div', { class: 'nm' }), h('div', { class: 'vl' }));
  if (vkKind(e) === 'switch') n.append(h('div', { class: 'slider' }, h('div', { class: 'knob' })));
  if (vkKind(e) === 'pushbutton' || vkKind(e) === 'momentary') n.append(h('div', { class: 'ledbtn' }));
  if (e.type === 'manual') n.append(h('div', { class: 'mv' }, h('div', { class: 'mvPic' }), h('div', { class: 'mvRows' })));
  place(n, e);
  if (e.hideName) n.querySelector('.nm').classList.add('hidden');
  styleEl(n, e);
  if (e.type === 'timer') n.append(h('div', { class: 'btns' },
    h('button', { title: 'Start', onclick: ev => { ev.stopPropagation(); setProp(e.name, 'running', true); } }, '▶'),
    h('button', { title: 'Stop', onclick: ev => { ev.stopPropagation(); setProp(e.name, 'running', false); } }, '■'),
    h('button', { title: 'Reset', onclick: ev => { ev.stopPropagation(); setProp(e.name, 'value', '00:00:00'); } }, '↺')));
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
    case 'global': case 'shared': case 'vAPI':
      if (e.dataType === 'bool' || e.kind === 'bool') { on = !!v.value; text = on ? (e.onText ?? 'TRUE') : (e.offText ?? 'FALSE'); break; }
      text = fmtVal(e, v.value) + (e.units ? ' ' + e.units : ''); break;
    case 'vKonstant':
      switch (vkKind(e)) {
        case 'graphic': img = v.value || img; text = ''; break;            // the value IS the picture path
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
    case 'dutyCycle': on = !!v.state; text = v.enabled ? `${fmtVal({}, v.dutycycle)} %` : (e.offText ?? 'OFF'); break;
    case 'hysteresis': on = !!v.state; text = v.enabled ? `${on ? (e.onText ?? 'ON') : (e.offText ?? 'OFF')}  ▸ ${fmtVal({}, v.target)}` : (e.offText ?? 'OFF'); break;
    case 'pid': on = !!v.enabled && v.value > 0; text = v.enabled ? `${fmtVal({ precision: 0 }, v.value)} %  ▸ ${fmtVal({}, v.target)}` : (e.offText ?? 'OFF'); break;
    case 'timer': text = v.value ?? '00:00:00'; on = !!v.running; break;
    case 'alarm': text = v.active ? (e.activeText ?? 'ALARM') : (e.idleText ?? ''); n.classList.toggle('active', !!v.active);
      img = (v.active ? v.imageon : v.imageoff) || v.image || ''; n.classList.toggle('img-alarm', !!(v.imageon || v.image)); break;
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
    case 'digitalIn': return ['latch', 'toggle', 'counter'].includes(e.mode) ? 'dialog' : simDev(e.device) ? 'toggle' : 'none';
    case 'pwmOut': case 'analogOut': case 'scale': return 'dialog';
    case 'analogIn': case 'temperature': return simDev(e.device) && !e.sim ? 'dialog' : 'none';
    case 'alarm': return 'acknowledge';
    case 'global': case 'shared': case 'vAPI': return e.readOnly ? 'none' : 'dialog';
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
const boolProp = t => t.type === 'alarm' ? 'active' : t.type === 'digitalIn' ? 'raw' : isVarEl(t) ? 'value' : 'state';
const isBoolEl = t => ['digitalOut', 'switch', 'digitalIn', 'alarm'].includes(t.type) || (isVarEl(t) && t.dataType === 'bool');

async function doTap(e) {
  const act = tapAction(e);
  const targetName = e.tapTarget || (e.type === 'picture' ? e.follow : e.name);
  if (act === 'none' || act === 'hold') return;          // push and hold buttons work on press / release (below)
  if (act === 'pulse') { const t = elByName(targetName); if (t && isBoolEl(t)) setProp(t.name, boolProp(t), true); return; }
  if (act === 'acknowledge') { if (S.values[e.name]?.active) setProp(e.name, 'active', false); return; }
  if (act === 'manual') return manualDialog(elByName(targetName) || e);
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
  if (t.type === 'digitalIn') {   // latch / toggle: reset to off; counter: count back to 0
    const sim = simDev(t.device) ? [['Simulate: input ON', 'on'], ['Simulate: input OFF', 'off']] : [];
    return choose(title, [...sim, t.mode === 'counter' ? ['Reset count to 0', 'count'] : ['Reset (off)', 'reset']])
      .then(r => r === 'count' ? setProp(t.name, 'count', 0) : r === 'reset' ? setProp(t.name, 'reset', true) : r ? setProp(t.name, 'raw', r === 'on') : undefined);
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
    : h('input', { class: 'vdInput', value: num ? fmtVal(t, v.value) : (v.value ?? ''), inputmode: num ? 'decimal' : 'text', placeholder: { time: 'hh:mm:ss', datetime: 'mm/dd/yyyy hh:mm:ss' }[t.dataType] ?? (k === 'graphic' ? 'image path, e.g. oakbarn/BurnerFlame.png' : '') });
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
let drawPts = null, drawCursor = null, drawFrom = null;
const ipCenter = g => [(g.x || 0) + (g.w || 30) / 2, (g.y || 0) + (g.h || 30) / 2];
// An IP id is either an IP widget's id, or "dev:<name>:in" / "dev:<name>:out" for the built-in IPs of a pump or valve
const devOfIp = id => (typeof id === 'string' && id.startsWith('dev:')) ? id.slice(4, id.lastIndexOf(':')) : null;
function ipPoint(id, ws) {
  if (!id) return null;
  const pn = devOfIp(id);
  if (pn !== null) { const e = L().elements.find(x => x.name === pn); if (!hasIps(e) || (ws && e.workspace !== ws)) return null; return devIps(e).find(q => q.id === id)?.c || null; }
  const g = L().graphics.find(g => g.kind === 'ip' && g.id === id && (!ws || g.workspace === ws));
  return g ? ipCenter(g) : null;
}
function allIps(ws) {
  return [...L().graphics.filter(g => g.kind === 'ip' && g.workspace === ws).map(g => ({ id: g.id, label: g.label || g.id })),
    ...L().elements.filter(e => hasIps(e) && e.workspace === ws).flatMap(e => devIps(e))];
}
// ---- flow through the pipe network
// Pipes join IPs. Each IP belongs to a node:
//  - a running pump: OUT pushes flow out, IN pulls flow in
//  - a pump that is off, an open valve, a fitting or an open manual valve: flow passes straight through, either way
//  - a closed valve or closed manual valve: blocks every pipe on it
//  - a plain IP point: an end of the line (a vessel port, an outlet), where flow can come from or go to
// Flow is traced from each running pump out to the IP points it reaches, and from each IP point into each running pump's IN.
// The direction of each pipe comes from that trace, so a pipe can show flow backwards through a pump that is off.
// A pipe between two plain IP points with a "Flow when" list keeps the old rule: it flows, as drawn, while all of those are on.
const pipeJoined = p => !!(ipPoint(p.from, p.workspace) && ipPoint(p.to, p.workspace));
function ipNode(id, ws) {
  const dn = devOfIp(id);
  if (dn !== null) {
    const e = L().elements.find(x => x.name === dn), on = isOn(dn), end = id.slice(id.lastIndexOf(':') + 1);
    if (e.subtype === 'valve') return on ? { key: 'dev:' + dn, pass: true } : { closed: true };
    if (e.subtype === 'propValve') return propPct(e) > 0 ? { key: 'dev:' + dn, pass: true } : { closed: true };
    return on ? { key: id, push: end === 'out', pull: end === 'in' } : { key: 'dev:' + dn, pass: true };
  }
  const g = L().graphics.find(g => g.id === id && g.workspace === ws);
  if (g?.fitting === 'manualValve' && !g.open) return { closed: true };
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
    const width = +p.width || 8;
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
  const node = pip ? $(`#ws .el[data-name="${CSS.escape(pip.dataset.dev)}"]`) : ev.target.closest('.el,.gfx');
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
  if (drag.mode === 'move') { drag.item.x = snap(drag.orig.x + dx); drag.item.y = snap(drag.orig.y + dy); place(drag.node, drag.item); if (hasIps(drag.item)) placeDevIps(drag.item); if (drag.item.kind === 'ip' || hasIps(drag.item)) renderPipes(); }
  else if (drag.mode === 'resize') { drag.item.w = Math.max(drag.item.kind === 'ip' ? 10 : 20, snap(drag.orig.w + dx)); drag.item.h = Math.max(drag.item.kind === 'ip' ? 10 : 16, snap(drag.orig.h + dy)); place(drag.node, drag.item); if (hasIps(drag.item)) placeDevIps(drag.item); if (drag.item.kind === 'ip' || hasIps(drag.item)) renderPipes(); }
  else if (drag.mode === 'point') { drag.item.points[drag.i] = [snap(p[0]), snap(p[1])]; renderPipes(); }
  else if (drag.mode === 'pipe') { drag.item.points = drag.orig.map(q => [snap(q[0] + dx), snap(q[1] + dy)]); renderPipes(); }
});
window.addEventListener('pointerup', () => { cancelLongPress(); if (drag?.mode === 'point' || drag?.mode === 'pipe') renderWs(); drag = null; });
$('#ws').addEventListener('dblclick', ev => {
  if (!editing) return;
  if (drawPts) return finishPipe();
  const pip = ev.target.closest('.devip');
  const node = ev.target.closest('.el,.gfx');
  const pipe = ev.target.closest('#pipes g');
  if (pip) editItem('el', pip.dataset.dev);
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
  const g = { id: newId(), kind: 'pipe', workspace: wsName, points: pts, width: 10, color: '#8a8f96', flowColor: '#4fb3ff', flowWhen: [], baseVisible: true };
  if (from) g.from = from;
  if (typeof to === 'string') g.to = to;
  draft.graphics.push(g); sel = { kind: 'gfx', id: g.id }; renderWs(); editItem('gfx', g.id);
  $('#editHint').textContent = '';
}

$('#editMode').addEventListener('change', e => {
  if (!e.target.checked && editing && JSON.stringify(draft) !== JSON.stringify(S.config) && !confirm('Discard layout changes?')) { e.target.checked = true; return; }
  setEditing(e.target.checked);
});
// Ready-made Device Outputs: a Digital Output with its kind, IPs, pictures and tap behaviour already set (all can be changed after)
const PRESETS = {
  pump: { type: 'digitalOut', subtype: 'pump', ipIn: 'left', ipOut: 'right', w: 140, h: 110, imageOn: 'oakbarn/Pump_Red_Rip_On.png', imageOff: 'oakbarn/Pump_Red_Rip_Off.png', hideValue: true, tap: 'toggle', confirm: true, onText: 'ON', offText: 'OFF' },
  // analogOut when that output type is installed (its fields exist), otherwise a Global holding 0-100 %
  get propValve() {
    const look = { subtype: 'propValve', ipIn: 'left', ipOut: 'right', w: 90, h: 70, hideName: true, imageOn: 'oakbarn/Valve_Ball_OpenH_1.png', imageOff: 'oakbarn/Valve_Ball_ClosedH_1.png' };
    return F.analogOut ? { type: 'analogOut', signal: '0-10V', rangeLow: 0, rangeHigh: 100, units: '%', precision: 0, ...look }
      : { type: 'global', dataType: 'value', initial: '0', min: 0, max: 100, step: 5, units: '%', precision: 0, retain: true, ...look };
  },
  valve: { type: 'digitalOut', subtype: 'valve', ipIn: 'top', ipOut: 'bottom', w: 64, h: 55, imageOn: 'oakbarn/Valve_Ball_OpenV-1x1.png', imageOff: 'oakbarn/Valve_Ball_ClosedV-1x1.png', hideName: true, hideValue: true, tap: 'toggle', onText: 'OPEN', offText: 'CLOSED' },
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
  const e = { name: base + i, type, workspace: wsName, x: 40, y: 40, w: type === 'label' ? 200 : type === 'flowMeter' ? 190 : 130, h: type === 'timer' ? 80 : 60, ...clone(preset || {}), ...clone(extra || {}) };
  if (type === 'global' || type === 'shared') e.dataType = 'value';
  if (kind) e.kind = kind;
  if (kind === 'switch') { e.w = 110; e.h = 70; }
  if (kind === 'pushbutton' || kind === 'momentary') { e.w = 100; e.h = 100; }
  if (kind === 'longstring') { e.w = 360; e.h = 200; }
  if (kind === 'graphic') { e.hideName = true; e.w = 140; e.h = 120; }
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
$('#addIp').onclick = () => {
  const fit = $('#addIpType').value, base = fit === 'point' ? 'IP' : FITTINGS[fit];
  let i = 1; while (draft.graphics.some(g => g.kind === 'ip' && g.label === base + ' ' + i)) i++;
  const g = { id: newId(), kind: 'ip', workspace: wsName, x: 60, y: 60, w: 30, h: 30, label: base + ' ' + i, color: fit === 'point' ? '#e8a33a' : '#c0c6cc' };
  if (fit !== 'point') g.fitting = fit;
  draft.graphics.push(g); sel = { kind: 'gfx', id: g.id }; renderWs(); editItem('gfx', g.id);
};
$('#addWs').onclick = () => {
  const n = prompt('New tab name'); if (!n) return;
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
  common: [['name', 'Name', 'text'], ['displayName', 'Display name', 'text'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'bool'],
    ['background', 'Background (1-8 or color)', 'text'], ['image', 'Image path', 'path'], ['visibility', 'Visibility', 'sel', ['visible', 'hidden']], ['hideName', 'Hide name', 'bool'], ['hideValue', 'Hide value / text', 'bool'], ['look', 'Look', 'sel', ['normal', 'led', 'lcd', 'dark', 'button']], ['fontSize', 'Value font size', 'num'],
    ['tap', 'When tapped', 'sel', ['default', 'none', 'toggle', 'dialog', 'script', ['workspace', 'tab']]], ['tapTarget', 'Tap target (element, script or tab; empty = itself)', 'text'], ['confirm', 'Ask before changing (ON / OFF buttons)', 'bool'],
    ['images', 'Background images 1-3 (JSON list; "background" = 1, 2 or 3 picks one)', 'json'], ['nameColor', 'Name color', 'text'], ['nameBg', 'Name background color', 'text'], ['valueColor', 'Value color', 'text'], ['valueBg', 'Value background color', 'text'],
    ['nameFont', 'Name font (JSON, e.g. {"size":14,"bold":true})', 'json'], ['valueFont', 'Value font (JSON)', 'json'], ['nameAlign', 'Name alignment (e.g. TopCenter)', 'text'], ['valueAlign', 'Value alignment (e.g. MiddleCenter)', 'text'], ['border', 'Border', 'sel', ['default', 'hidden', 'visible']]],
  global: [['dataType', 'Data type', 'sel', ['value', 'string', 'bool', 'time', 'datetime']], ['initial', 'Initial value', 'text'], ['precision', 'Decimals', 'num'], ['units', 'Units', 'text'], ['step', '+ / - step', 'num'], ['min', 'Lowest allowed', 'num'], ['max', 'Highest allowed', 'num'], ['readOnly', 'Read only on screen', 'bool'], ['retain', 'Keep value on restart', 'bool', true]],
  digitalOut: [['subtype', 'Kind (pumps and valves have IPs for pipes)', 'sel', ['plain', 'pump', 'valve']], ['ipIn', 'Pump inlet / valve end A: IP side', 'sel', SIDES], ['ipOut', 'Pump outlet / valve end B: IP side', 'sel', ['right', 'left', 'top', 'bottom']], ['device', 'Device', 'dev'], ['channel', 'Pin (e.g. 22, or A5 = 59)', 'pin', 'digital'], ['activeLow', 'Invert (pin LOW = on)', 'bool'], ['oneShot', 'One-shot time in ms (0 = off)', 'num'], ['oneShotDirection', 'One-shot pulses OFF (unticked = pulses ON)', 'bool'], ['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  switch: [['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  digitalIn: [['device', 'Device', 'dev'], ['channel', 'Pin (e.g. 30, or A8 = 62)', 'pin', 'digital'],
    ['mode', 'Input type', 'sel', ['switch', 'toggle', 'latch', 'counter']],
    ['activeLow', 'Invert / active low (normally-closed contact)', 'bool'], ['pullup', 'Use the board\'s pull-up (switch wired to GND)', 'bool', true],
    ['debounce', 'Debounce on the board (ms, empty = 20)', 'num'], ['onDelay', 'On delay (seconds the input must stay on)', 'num'], ['offDelay', 'Off delay (seconds the input must stay off)', 'num'],
    ['units', 'Counter units (e.g. presses, gal)', 'text'], ['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['onText', 'Text when on', 'text'], ['offText', 'Text when off', 'text']],
  timer: [['timerType', 'Type', 'sel', ['countup', 'countdown']], ['resetValue', 'Reset value (hh:mm:ss)', 'text'], ['initial', 'Start value (hh:mm:ss)', 'text'], ['initRunning', 'Running when the server starts', 'bool']],
  alarm: [['sound', 'Sound file path (.wav / .mp3)', 'path'], ['sounds', 'Sound files 1-3 (JSON list; "fileindex" picks one)', 'json'], ['fileIndex', 'Sound file number', 'num'], ['soundMode', 'Sound', 'sel', ['custom', 'default', 'none']], ['loop', 'Repeat sound', 'bool'], ['activeText', 'Text when sounding', 'text'], ['imageOn', 'Image when sounding', 'path'], ['imageOff', 'Image when quiet', 'path']],
  manual: [['units', 'Temperature units', 'sel', ['°F', '°C']], ['volumeUnits', 'Volume units', 'sel', ['gal', 'L']], ['precision', 'Set point decimals', 'num'], ['setpoint', 'Set point at start', 'num'],
    ['noPump', 'Has no pump', 'bool'], ['imageOn', 'Picture when heating', 'path'], ['imageOff', 'Picture when not heating', 'path'],
    ['_mnote', 'Scripts set: setpoint, heat, pump, timer, message, waiting. The brewer taps it to confirm (confirmed = true) or to enter what it reads (reading, volume).', 'note']],
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
  dutyCycle: [['device', 'Device', 'dev'], ['channel', 'Pin', 'num'], ['activeLow', 'Active low', 'bool'], ['enabled', 'Enabled at start', 'bool'], ['dutyCycle', 'Duty cycle %', 'num'], ['interval', 'Cycle time (ms)', 'num']],
  hysteresis: [['device', 'Device', 'dev'], ['channel', 'Pin', 'num'], ['activeLow', 'Active low', 'bool'], ['enabled', 'Enabled at start', 'bool'], ['input', 'Input (sensor element)', 'elem'], ['target', 'Target', 'num'], ['onOffset', 'ON offset (positive = heat: on below target - offset; negative = cool)', 'num'], ['onDelay', 'ON delay (seconds)', 'num']],
  pid: [['device', 'Device', 'dev'], ['channel', 'Pin', 'num'], ['activeLow', 'Active low', 'bool'], ['enabled', 'Enabled at start', 'bool'], ['input', 'Input (sensor element)', 'elem'], ['target', 'Target', 'num'], ['kp', 'Kp', 'num'], ['ki', 'Ki', 'num'], ['kd', 'Kd', 'num'], ['maxOutput', 'Max output %', 'num'], ['maxIntegral', 'Max integral %', 'num'], ['calcTime', 'Calculation time (s)', 'num'], ['outTime', 'Output window (s)', 'num'], ['reversed', 'Reversed (cooling)', 'bool'], ['pwm', 'PWM output (unticked = time-proportioned on/off)', 'bool']],
  picture: [['follow', 'Follow element (on/off image follows it; empty = static)', 'elem'], ['imageOn', 'Image when on', 'path'], ['imageOff', 'Image when off', 'path'], ['text', 'Text on picture', 'text']],
  label: [],
  image: [['image', 'Image path', 'path'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'bool']],
  text: [['text', 'Text', 'area'], ['fontSize', 'Font size', 'num'], ['color', 'Color', 'text'], ['bold', 'Bold', 'bool'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'bool']],
  propValve: [['ipIn', 'Valve end A: IP side', 'sel', SIDES], ['ipOut', 'Valve end B: IP side', 'sel', ['right', 'left', 'top', 'bottom']], ['imageOn', 'Image when open (above 0 %)', 'path'], ['imageOff', 'Image when closed (0 %)', 'path']],
  ip: [['fitting', 'Type', 'fit'], ['rotate', 'Turn (degrees)', 'sel', ['0', '45', '90', '135', '180', '225', '270', '315']], ['open', 'Manual valve is open', 'bool'], ['label', 'Name (e.g. Red pump out, MLT in, Drain)', 'text'], ['text', 'Text on marker', 'text'], ['color', 'Color', 'text'], ['hideRun', 'Show only while editing the layout', 'bool'], ['workspace', 'Tab', 'ws'], ['x', 'X', 'num'], ['y', 'Y', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num'], ['locked', 'Lock position (no drag or resize)', 'bool']],
  pipe: [['label', 'Label', 'text'], ['from', 'Starts at IP (flow comes from here)', 'ip'], ['to', 'Ends at IP (flow goes to here)', 'ip'], ['flowWhen', 'Only when ALL of these are on (optional; pumps and valves on the pipe count by themselves; Ctrl or Cmd-click to pick several)', 'multi'], ['reverse', 'Reverse flow direction', 'bool'], ['width', 'Width', 'num'], ['color', 'Pipe color', 'text'], ['flowColor', 'Flow color', 'text'], ['baseVisible', 'Show pipe when not flowing (off = background already shows pipes)', 'bool', true], ['workspace', 'Tab', 'ws'], ['locked', 'Lock position (no drag or resize)', 'bool']],
};
F.shared = F.global.filter(f => f[0] !== 'retain').concat([['retain', 'Keep value on restart', 'bool', true]]);
// field [key, label, kind, opts, onlyForKinds]
const NUMK = ['value'], BOOLK = ['bool', 'switch', 'pushbutton', 'momentary'], PLAINK = ['string', 'value', 'time', 'datetime', 'bool', 'switch'];
F.vKonstant = () => [['kind', 'Kind (OK and reopen to see its settings)', 'sel', Object.entries(S.vkKinds).map(([k, d]) => [k, `${d.label}  (${d.prefix})`])],
  ['initial', 'Image path (inside a media folder)', 'path', null, ['graphic']],
  ['file', 'Text file path (inside a media folder, a network drive works if it is added there)', 'path', null, ['longstring']],
  ['initial', 'Initial value', 'text', null, PLAINK], ['precision', 'Decimals', 'num', null, NUMK], ['units', 'Units', 'text', null, [...NUMK, 'string']],
  ['step', '+ / - step', 'num', null, NUMK], ['min', 'Lowest allowed', 'num', null, NUMK], ['max', 'Highest allowed', 'num', null, NUMK],
  ['onText', 'Text when on', 'text', null, BOOLK], ['offText', 'Text when off', 'text', null, BOOLK],
  ['pulseMs', 'On time in ms (default 100)', 'num', null, ['momentary']],
  ['readOnly', 'Read only on screen', 'bool', null, ['graphic', 'longstring', ...PLAINK]], ['retain', 'Keep value on restart', 'bool', true, ['graphic', 'longstring', ...PLAINK]]];
F.vAPI = () => [['kind', 'Kind (OK and reopen to see its settings)', 'sel', Object.entries(S.vapiKinds).map(([k, d]) => [k, `${d.label}  (${d.prefix})`])],
  ['initial', 'Initial value', 'text'], ['precision', 'Decimals', 'num', null, NUMK], ['units', 'Units', 'text'], ['step', '+ / - step', 'num', null, NUMK],
  ['min', 'Lowest allowed', 'num', null, NUMK], ['max', 'Highest allowed', 'num', null, NUMK], ['readOnly', 'Read only on screen', 'bool'], ['retain', 'Keep value on restart', 'bool', true],
  ['_logNote', 'Database trigger: set it on the Globals page', 'note']];
const kindFields = (type, obj) => { const f = F[type]; return (typeof f === 'function' ? f() : f || []).filter(x => !Array.isArray(x[4]) || x[4].includes(obj.kind || 'value')); };

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
      ['calibrations', 'BruControl calibrations (JSON list, used instead of the settings above)', 'json'], ['avgWeight', 'Smoothing weight % (100 = none)', 'num'], ['prefix', 'Prefix', 'text'],
      ['units', 'Units', 'text'], ['precision', 'Decimals', 'num'], ['sim', 'Simulator settings (JSON), e.g. {"value":12,"noise":0.2}', 'json'], ['info', 'Raw reading now', 'info']];
  }
  return kindFields(item.type, item);
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
  else if (kind === 'sel') { const os = opts.map(o => Array.isArray(o) ? o : [o, o]); input = h('select', { 'data-k': key, 'data-kind': kind, ...(rerender === true ? { 'data-rerender': '1' } : {}) }, ...os.map(([o, l]) => h('option', { value: o, ...(String(v ?? os[0][0]) === o ? { selected: true } : {}) }, l))); }
  else if (kind === 'note') return [h('div', { class: 'full muted' }, label)];
  else if (kind === 'ws') input = h('select', { 'data-k': key, 'data-kind': kind }, ...draft.workspaces.map(w => h('option', { value: w.name, ...(w.name === v ? { selected: true } : {}) }, w.name)));
  else if (kind === 'dev') input = h('select', { 'data-k': key, 'data-kind': kind }, h('option', { value: '' }, '(none)'), ...(S.config.devices || []).map(d => h('option', { value: d.name, ...(d.name === v ? { selected: true } : {}) }, d.name)));
  else if (kind === 'elem') input = h('select', { 'data-k': key, 'data-kind': kind }, h('option', { value: '' }, key === 'follow' ? '(none - static picture)' : '(none)'), ...(draft || S.config).elements.filter(e => e.type !== 'picture').map(e => e.name).sort().map(n => h('option', { value: n, ...(n === v ? { selected: true } : {}) }, n)));
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
  const fields = kind === 'el' ? it => {
    const f = [...F.common.slice(0, 3), ...fieldsFor(it), ...(isPropValve(it) ? F.propValve : []), ...F.common.slice(3)];
    if (prefixOf(it)) f.splice(1, 0, ['_hint', `Suggested name prefix: ${prefixOf(it)}  (a hint, not required)`, 'note']);
    return f;
  } : F[type];
  const work = clone(item);
  const r = await dialog(kind === 'el' ? `${type} element` : type === 'ip' ? 'IP widget (Initial Point)' : type, fields, work, true);
  try {
    if (r === 'delete') {
      if (!confirm('Delete this item?')) return;
      if (kind === 'el') draft.elements = draft.elements.filter(e => e !== item); else draft.graphics = draft.graphics.filter(g => g !== item);
      const gone = type === 'ip' ? [item.id] : hasIps(item) ? devIps(item).map(q => q.id) : [];
      for (const g of draft.graphics) { if (gone.includes(g.from)) delete g.from; if (gone.includes(g.to)) delete g.to; }
      sel = null; renderWs(); return;
    }
    if (r !== 'ok') return;
    readFields(work);
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
      work.name = (work.name || '').trim();
      if (!work.name) throw new Error('Name is required');
      if (work.name !== item.name && draft.elements.some(e => e.name === work.name)) throw new Error('That name is already used');
      if (work.name !== item.name) for (const g of draft.graphics) {
        if (g.flowWhen) g.flowWhen = g.flowWhen.map(n => n === item.name ? work.name : n);
        for (const k of ['from', 'to']) if (devOfIp(g[k]) === item.name) g[k] = g[k].replace(`dev:${item.name}:`, `dev:${work.name}:`);
      }
      if (hasIps(item) && !hasIps(work)) for (const g of draft.graphics) for (const k of ['from', 'to']) if (devOfIp(g[k]) === item.name) delete g[k];
    }
    const kindChanged = kind === 'el' && work.kind !== item.kind;
    Object.keys(item).forEach(k => delete item[k]); Object.assign(item, work);
    if (kind === 'el') sel = { kind, id: item.name };
    renderTabs(); renderWs();
    if (kindChanged) editItem(kind, item.name);          // show the settings for the new kind
  } catch (e) { toast(e.message, true); }
}

async function editWorkspace() {
  const w = curWs(); const work = clone(w);
  const r = await dialog('Tab', [['name', 'Name', 'text'], ['background', 'Background image path', 'path'], ['color', 'Background color', 'text'], ['width', 'Width', 'num'], ['height', 'Height', 'num'],
    ['bgX', 'Image left (empty = fill)', 'num'], ['bgY', 'Image top', 'num'], ['bgW', 'Image width', 'num'], ['bgH', 'Image height', 'num']], work, draft.workspaces.length > 1);
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
  if (soundOn) for (const e of S.config.elements.filter(e => e.type === 'alarm')) { const a = getAudio(e); if (a) { a.muted = true; a.play().then(() => { a.pause(); a.muted = false; }).catch(() => { a.muted = false; }); } }
  updateAlarms();
};
function getAudio(e) {
  const v = S.values[e.name] || {};
  const mode = v.soundmode || (e.sounds ? 'custom' : 'default');
  if (mode === 'none') return null;
  const src = mode === 'default' && e.sounds ? 'sounds/alarm_beep.wav' : (e.sounds?.[(v.fileindex || 1) - 1] || v.sound || e.sound);
  if (!src) return null;
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

// ---------------------------------------------------------------- globals, vAPI, vKonstant, shared
const LOG_LABEL = { none: 'Off', ondemand: 'Manual (log line / Log now)', script: 'On demand only (when a script starts)', once: 'Once',
  ms: 'Every N milliseconds', seconds: 'Every N seconds', minutes: 'Every N minutes', hours: 'Every N hours', days: 'Every N days', hms: 'Every 00:00:00' };
const TIME_MODES = ['ms', 'seconds', 'minutes', 'hours', 'days', 'hms'];
function logSummary(lg) {
  lg = lg || { mode: 'none' };
  if (lg.mode === 'script') return lg.script ? `When "${lg.script}" starts` : 'On demand only (no script picked)';
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
  for (const [id, type, withLog] of [['#vapiBody', 'vAPI', true], ['#globalsBody', 'global', true], ['#vkBody', 'vKonstant', false], ['#sharedBody', 'shared', false]]) {
    const tb = $(id); tb.innerHTML = '';
    tb.append(...of(type).map(e => varRow(e, withLog)));
    tb.closest('table').classList.toggle('empty', !of(type).length);
  }
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
    ['script', 'Script (for "On demand only")', 'sel', [['', '(pick a script)'], ...S.scripts.map(x => [x.name, x.name])]],
    ['every', 'N (whole number, for "Every N …")', 'num'],
    ['interval', 'Interval 00:00:00 (for "Every 00:00:00")', 'text'],
    ['at', 'At clock time (optional, for the "Every" choices), e.g. 12 AM, 6:30 PM or 18:30', 'text'],
    ['_n', '"Every 1 days at 12 AM" writes at midnight every day. "Every 6 hours at 1 AM" writes at 1 AM, 7 AM, 1 PM and 7 PM. Without a clock time it counts from when the server starts. Fastest is 100 ms.', 'note'],
  ], work, false);
  if (r !== 'ok') return;
  try { readFields(work); } catch (x) { return toast(x.message, true); }
  if (work.mode === 'script' && !work.script) return toast('Pick the script that writes this value', true);
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
    const real = d.type === 'simulator' && d.realType ? h('button', { title: `Use the real ${TYPES[d.realType]} at ${d.port || d.host}`, onclick: guard(async () => {
      if (!confirm(`Switch ${d.name} from the simulator to the real ${TYPES[d.realType]} (${d.port || d.host})?`)) return;
      await api('PUT', '/ui/layout', { devices: S.config.devices.map(x => x.name === d.name ? (({ realType, ...rest }) => ({ ...rest, type: realType }))(x) : x) }); await load();
    }) }, 'Use real hardware') : '';
    tb.append(h('tr', {}, h('td', {}, d.name), h('td', {}, (TYPES[d.type] || d.type) + (d.type === 'simulator' && d.realType ? ` (for ${TYPES[d.realType]})` : '')), h('td', {}, d.host ? `${d.host}:${d.port ?? 4100}` : d.port || ''),
      h('td', { style: `color:${d.status === 'connected' ? 'var(--ok)' : 'var(--bad)'}` }, d.status), h('td', {}, d.info || ''),
      h('td', {}, real, ' ', h('button', { class: 'danger', onclick: guard(async () => { if (!confirm(`Remove device ${d.name}?`)) return; await api('PUT', '/ui/layout', { devices: S.config.devices.filter(x => x.name !== d.name) }); await load(); }) }, 'Remove'))));
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

// BruControl configuration (.brucfg)
function bruReport(r) {
  const t = r.summary.byType;
  const lines = [`${r.preview ? 'In this file' : 'Imported'}: ${r.summary.devices} devices, ${r.summary.workspaces} workspaces, ${r.summary.elements} elements, ${r.summary.scripts} scripts`,
    '  ' + Object.entries(t).map(([k, n]) => `${k} ${n}`).join(', ')];
  if (r.autostart.length) lines.push(`Scripts started with the server: ${r.autostart.join(', ')}`);
  lines.push(r.missingMedia.length ? `\n${r.missingMedia.length} of ${r.mediaCount} pictures and sounds are not in your media folder yet. Copy them from C:\\BruControl\\Media:\n  ${r.missingMedia.join('\n  ')}` : `All ${r.mediaCount} pictures and sounds were found.`);
  if (r.warnings.length) lines.push('\nNotes:\n  ' + r.warnings.join('\n  '));
  if (r.scripts) {
    lines.push(`\nScripts written: ${r.scripts.written.length}` + (r.scripts.backedUp.length ? `, ${r.scripts.backedUp.length} older copies kept as .bak` : '') + (r.scripts.skipped.length ? `\nScripts not replaced: ${r.scripts.skipped.join(', ')}` : ''));
    lines.push(r.problems.length ? `${r.problems.length} scripts have problems (they will not start until fixed):\n` + r.problems.map(p => `  ${p.script}: ` + p.errors.map(e => `line ${e.line}: ${e.msg}`).join('; ') + (p.more ? ` (+${p.more} more)` : '')).join('\n') : 'Every script checks OK.');
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
  const msg = $('#bruMode').value === 'replace' ? 'Replace your tabs, elements and devices with the ones in this BruControl file? Running scripts are stopped. (config/brewery.json.bak keeps the old setup.)' : 'Add this BruControl file to your setup? Running scripts are stopped.';
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
      if (!confirm(`Load the sample "${sm.name}"?\n\nIt replaces your tabs, elements, pipes and devices and stops running scripts. Your current setup is saved in config/backups first.`)) return;
      const r = await api('POST', `/ui/samples/${sm.id}/load`);
      after?.(); wsName = null; await load(); setView('workspace');
      const bad = (r.problems || []).length;
      toast(`Loaded "${r.sample}"` + (bad ? `. ${bad} script(s) need a look on the Scripts page` : ''), bad > 0);
    }) }, S.config.sample === sm.id ? 'Load again' : 'Load this one')));
}
async function firstRunSamples() {
  if (!S.config.chooseSample) return;
  const d = $('#sampleDlg');
  await sampleCards($('#sampleDlgList'), () => d.close());
  $('#sampleKeep').onclick = guard(async () => { d.close(); await api('PUT', '/ui/settings', { chooseSample: false }); S.config.chooseSample = false; });
  d.showModal();
}

function renderSettings() {
  const c = S.config;
  sampleCards($('#sampleList')).catch(e => toast(e.message, true));
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
load().then(() => { connect(); setView('workspace'); firstRunSamples(); }).catch(e => toast('Cannot reach the server: ' + e.message, true));
