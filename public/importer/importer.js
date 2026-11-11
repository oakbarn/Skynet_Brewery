// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Skynet BruControl Importer, in the window (Rule 15.4): 1 Welcome, 2 BruControl and Skynet, 3 pick the config file, 4 Names,
// 5 Boards and Tabs (the Import Copy is converted), 6 Connect your brewery (public/importer/connectpage.js), 8 Save the Schema.
import { startConnect, connectState, resetConnect } from './connectpage.js';
import { PART_PAGES, METHOD_COLS, NOT_RECOMMENDED, onePower, methodName } from './connect.js';
import { parseLabel, widgetTypeId } from '../naming.js';
import { vbFromImport } from '../vesselbuilder.js';
import { BOOL_STYLES } from '../semi.js';
import { PROCESS_WIDGET_WORD } from '../processwidget.js';
import { glossBold, GLOSSARY } from './glossary.js';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// The Importer runs in the black "Skynet BruControl Importer" window. If that window is closed, nothing on this page can work
// (Fritz, 2026-11-07: the buttons "do not work"), so the page says so plainly at the top instead of doing nothing.
const STOPPED = 'The Importer has stopped, so the buttons cannot work. Its black window (Skynet BruControl Importer) was closed. ' +
  'Close this window and start Skynet BruControl Importer again from its shortcut.';
function stopped(on) { const b = document.querySelector('#stopped'); if (b) { b.textContent = STOPPED; b.classList.toggle('hidden', !on); } }
async function api(method, url, data, { wait = 30000 } = {}) {
  const ctl = new AbortController(), timer = wait ? setTimeout(() => ctl.abort(), wait) : 0;
  let r;
  try { r = await fetch(url, { method, signal: ctl.signal, headers: { 'X-Skynet-Importer': '1', ...(data ? { 'Content-Type': 'application/json' } : {}) }, body: data ? JSON.stringify(data) : undefined }); }
  catch (e) {
    if (e.name === 'AbortError') throw new Error('The Importer did not answer in time. Try again; if it keeps happening, close this window and start the Importer again.');
    stopped(true); throw new Error(STOPPED);
  } finally { clearTimeout(timer); }
  stopped(false);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Error ${r.status}`);
  return j;
}
// every few seconds: is the Importer still running?
setInterval(() => { fetch('/api/ping', { headers: { 'X-Skynet-Importer': '1' } }).then(r => stopped(!r.ok)).catch(() => stopped(true)); }, 5000);
// a message next to the folder buttons (the toast at the bottom is easy to miss)
function folderMsg(msg) { const n = $('#folderNote'); n.textContent = msg; n.classList.toggle('note', !!msg); }
let toastTimer;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add('hidden'), 5000); }

const state = { start: null, folder: '', files: [], sel: '' };

function show(n) {
  state.page = n;
  state.reached = Math.max(state.reached ?? 1, n);
  document.body.classList.remove('wideStep');
  for (const s of document.querySelectorAll('.step')) s.classList.toggle('hidden', s.id !== 'step' + n);
  for (const li of document.querySelectorAll('#steps li')) {
    const k = Number(li.dataset.step);
    li.classList.toggle('now', k === n); li.classList.toggle('done', k < n);
    li.classList.toggle('jump', k !== n && canJump(k));
    li.title = k !== n && canJump(k) ? `Go to ${li.textContent}` : '';
  }
  pageTools();
  window.scrollTo(0, 0);
}
// The major topics at the top can be clicked to jump there (OakBarn Brewery, 2026-11-08: "Have the major topic at the top where you can
// jump there"): any topic already reached; Boards and Tabs and the ones after it once the config file is converted
const canJump = k => !document.querySelector(`#steps li[data-step="${k}"]`)?.classList.contains('later') && k <= (state.reached ?? 1) && (k < 5 || state.converted);
$('#steps').onclick = e => {
  const k = Number(e.target.closest('li')?.dataset.step);
  if (!k || k === state.page || !canJump(k)) return;
  if (k === 5) { show(5); sub5(steps().some(([x]) => x === state.sub5) ? state.sub5 : 'if'); return; }
  show(k);
};

const sizeText = b => b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';

function setNext() { for (const b of [$('#next3'), $('#next3a')]) b.disabled = !state.sel; }

function render(list) {
  state.folder = list.folder; state.files = list.files;
  $('#folder').value = list.folder;
  const home = state.start?.defaultFolder ?? '';
  $('#folderNote').classList.remove('note');
  $('#folderNote').textContent = !list.exists ? '' : list.folder.toLowerCase() === home.toLowerCase() ? 'This is BruControl\'s usual folder.' : '';
  const tb = $('#files tbody');
  // two lists in one table (Fritz, 2026-11-08): BruControl's backups (.bak) first, then the config files (.brucfg)
  const head = (f, i) => i && f.isBackup === list.files[i - 1].isBackup ? '' : `<tr class="group"><th colspan="4">${f.isBackup
    ? 'BruControl backups (.bak), from the Config Backup folder' : 'BruControl config files (.brucfg)'}</th></tr>`;
  tb.innerHTML = list.files.map((f, i) => head(f, i) + `<tr data-i="${i}" class="${f.path === state.sel ? 'sel' : ''}">
    <td><input type="radio" name="cfg" ${f.path === state.sel ? 'checked' : ''} aria-label="Pick ${esc(f.name)}"></td>
    <td>${f.sub ? `<span class="muted">${esc(f.sub)}\\</span>` : ''}${esc(f.name)}${f.isDefault ? ' <span class="muted">(BruControl default)</span>' : ''}${f.isBackup ? ` <span class="muted" title="A backup BruControl made of a config file. It is the same config file inside and imports the same way.">(backup${f.backupDate ? ` of ${esc(f.backupDate)}` : ''})</span>` : ''}</td><td>${esc(f.modified)}</td><td>${sizeText(f.size)}</td></tr>`).join('');
  $('#files').classList.toggle('hidden', !list.files.length);
  // No config of the brewer's own here (none, or only BruControl's default one): ask them to point to their folder
  const empty = $('#empty'), own = list.files.filter(f => !f.isDefault).length;
  if (!list.exists) {
    empty.innerHTML = `The folder <code>${esc(list.folder || '(none)')}</code> is not on this computer. Click <b>📁 Change folder…</b> and point to the folder that holds your BruControl config file.`;
  } else if (!list.files.length) {
    empty.innerHTML = `Your BruControl config file is not in this folder. Click <b>📁 Change folder…</b> and point to the folder that holds it.`;
  } else if (!own) {
    empty.innerHTML = `Only BruControl's default config is in this folder. If your own config file is somewhere else, click <b>📁 Change folder…</b> and point to its folder.`;
  }
  empty.classList.toggle('hidden', list.exists && own > 0);
  $('#pickBtn').classList.toggle('primary', !list.exists || !own);
  if (state.sel && !list.files.some(f => f.path === state.sel)) { state.sel = ''; $('#peek').classList.add('hidden'); }
  setNext();
}

async function look(folder, remember = true) {
  const btn = $('#lookBtn'); btn.disabled = true; btn.textContent = 'Looking…';
  try { render(remember ? await api('POST', '/api/folder', { folder }) : await api('GET', '/api/configs?folder=' + encodeURIComponent(folder))); }
  catch (e) { folderMsg(e.message); toast(e.message); }
  finally { btn.disabled = false; btn.textContent = 'Look'; }
}

async function select(i) {
  const f = state.files[i]; if (!f) return;
  state.sel = f.path;
  for (const tr of document.querySelectorAll('#files tbody tr[data-i]')) { const on = Number(tr.dataset.i) === i; tr.classList.toggle('sel', on); tr.querySelector('input').checked = on; }
  setNext();
  const box = $('#peek'); box.classList.remove('hidden');
  $('#peekName').textContent = f.name;
  $('#peekBody').innerHTML = '<p class="muted">Looking inside…</p>';
  try {
    const s = await api('GET', '/api/peek?file=' + encodeURIComponent(f.path));
    if (state.sel !== f.path) return;
    $('#peekBody').innerHTML = `<div class="counts">
        <span><b>${s.interfaces.length}</b> Interfaces (boards)</span><span><b>${s.tabs.length}</b> Tabs (workspaces)</span>
        <span><b>${s.items}</b> Devices and Widgets (elements)</span><span><b>${s.processes}</b> Processes (scripts)</span>
        <span><b>${s.globals}</b> gGlobals</span></div>
      <table><tr><th>Interface</th><th>Link</th><th>Ports</th><th>On</th></tr>${s.interfaces.map(d =>
        `<tr><td>${esc(d.name)}</td><td>${esc(d.link)}</td><td>${d.ports}</td><td>${d.enabled ? 'Yes' : 'No (turned off)'}</td></tr>`).join('')}</table>
      <p class="muted small">Tabs: ${s.tabs.map(t => esc(t.name)).join(', ') || '(none)'}</p>`;
  } catch (e) {
    if (state.sel !== f.path) return;
    $('#peekBody').innerHTML = `<p class="note">${esc(e.message)}</p>`;
  }
}

async function next() {
  if (!state.sel) return;
  try {
    await api('POST', '/api/choose', { file: state.sel });
    state.converted = false; state.reached = Math.min(state.reached ?? 1, 4); state.max5 = 0;
    $('#chosen').textContent = state.files.find(f => f.path === state.sel)?.name ?? state.sel;
    // Units (OakBarn Brewery, 2026-11-08): asked at the start; when BruControl's probes show what it used, the question confirms it
    $('#unitsNote').textContent = '';
    try {
      const u = (await api('GET', '/api/peek?file=' + encodeURIComponent(state.sel))).units ?? {};
      const pu = state.panel?.units;      // the Panel's Units on this computer, when BruControl does not say (no need to type it twice)
      state.unitsGuess = u.guess || pu || '';      // what Clear Page goes back to
      if (u.guess || pu) document.querySelector(`input[name=units][value=${u.guess || pu}]`).checked = true;
      $('#unitsNote').textContent = u.guess ? `Your BruControl probes use ${u.guess === 'US' ? '°F (Fahrenheit)' : '°C (Celsius)'}, so ${u.guess} is picked. Please confirm it, or change it.`
        : pu ? `Your BruControl file does not say which units it used, so the Skynet Panel's Units on this computer (${pu}) are picked. Please confirm it, or change it.`
        : 'Your BruControl file does not say which units it used. Please pick one.';
    } catch { /* the question still stands */ }
    // answers kept from last time for this file: offered on top of the page (come back later)
    state.resume = null; $('#resume').classList.add('hidden');
    try {
      const pr = await api('GET', '/api/progress?file=' + encodeURIComponent(state.sel));
      if (pr?.data) {
        state.resume = pr.data;
        $('#resumeWhen').textContent = pr.saved ? `(last saved ${new Date(pr.saved).toLocaleString()})` : '';
        $('#resume').classList.remove('hidden');
        if (pr.data.units) document.querySelector(`input[name=units][value=${pr.data.units === 'Metric' ? 'Metric' : 'US'}]`).checked = true;
      }
    } catch { /* nothing kept */ }
    show(4);
  } catch (e) { toast(e.message); }
}
$('#resumeYes').onclick = () => { const d = state.resume; if (d) convert({ restore: d }); };
$('#resumeNo').onclick = async () => {
  if (!await ask('Start again?', '<p>Your answers kept for this file are cleared, and the Import starts again from its first guesses.</p>', 'Yes, start again', 'No, keep them')) return;
  state.resume = null; $('#resume').classList.add('hidden');
  api('POST', '/api/progress', { file: state.sel, clear: true }).catch(e => toast(e.message));
};

async function init() {
  try {
    state.start = await api('GET', '/api/start');
    $('#ver').textContent = state.start.version ? 'Panel version ' + state.start.version : '';
    state.sel = state.start.file || '';
    state.panel = await api('GET', '/api/panel-defaults').catch(() => ({}));      // the Panel's own Default settings on this computer
    if (!state.start.windows) $('#pickBtn').title = 'Change folder works on Windows. Type the folder in the box instead.';
  } catch (e) { toast(e.message); }
  show(1);
}

$('#next1').onclick = () => show(2);
for (const id of ['#back2', '#back2a']) $(id).onclick = () => show(1);
$('#startBtn').onclick = $('#startBtnTop').onclick = async () => { show(3); await look(state.start?.folder ?? '', false); if (state.sel) { const i = state.files.findIndex(f => f.path === state.sel); if (i >= 0) select(i); } };
for (const id of ['#back3', '#back3a']) $(id).onclick = () => show(2);
for (const id of ['#next3', '#next3a']) $(id).onclick = next;
$('#lookBtn').onclick = () => look($('#folder').value);
$('#folder').onkeydown = e => { if (e.key === 'Enter') look($('#folder').value); };
$('#homeBtn').onclick = () => look(state.start?.defaultFolder ?? '');
$('#pickBtn').onclick = async () => {
  try {
    folderMsg('The Browse For Folder box is open. If you do not see it, look on the taskbar.');
    const r = await api('POST', '/api/pick-folder', { start: state.start?.lastFolder || state.folder }, { wait: 0 });
    folderMsg('');
    if (r.busy) return folderMsg('A Windows box is already open. Look for it on the taskbar, pick there or click Cancel.');
    if (r.none) return toast('Change folder works on Windows. Type the folder in the box and press Enter.');
    if (r.picked) look(r.picked);
  } catch (e) { folderMsg(e.message); toast(e.message); }
};
// Browse for the config file with Windows' Open box (in Documents\BruControl); its folder is listed and the file picked
$('#browseBtn').onclick = async () => {
  try {
    folderMsg('The Open box is open. If you do not see it, look on the taskbar.');
    const r = await api('POST', '/api/pick-file', { start: state.folder || state.start?.defaultFolder || '' }, { wait: 0 });
    folderMsg('');
    if (r.busy) return folderMsg('A Windows box is already open. Look for it on the taskbar, pick there or click Cancel.');
    if (r.none) return toast('Browse works on Windows. Type the folder in the box and press Enter.');
    if (!r.picked) return;
    const dir = r.picked.replace(/[\\/][^\\/]*$/, '');
    await look(dir);
    const i = state.files.findIndex(f => f.path.toLowerCase() === r.picked.toLowerCase());
    if (i >= 0) select(i); else toast('That is not a BruControl config file (.brucfg) or backup (.bak).');
  } catch (e) { folderMsg(e.message); toast(e.message); }
};
$('#files tbody').onclick = e => { const tr = e.target.closest('tr[data-i]'); if (tr) select(Number(tr.dataset.i)); };
$('#files tbody').ondblclick = async e => { const tr = e.target.closest('tr[data-i]'); if (!tr) return; await select(Number(tr.dataset.i)); next(); };
for (const id of ['#back4', '#back4a']) $(id).onclick = () => show(3);

// a question box whose No is the default (Enter or Esc = No), like Start Fresh (Rule 9.8)
function ask(title, html, yes, no) {
  return new Promise(ok => {
    const d = $('#ask'); $('#askTitle').textContent = title; $('#askText').innerHTML = html;
    $('#askYes').textContent = yes; $('#askNo').textContent = no ?? '';
    $('#askNo').classList.toggle('hidden', no == null);      // no No: a pop-up that only tells (OK)
    $('#askYes').onclick = () => d.close('yes'); $('#askNo').onclick = () => d.close('no');
    d.onclose = () => ok(d.returnValue === 'yes');
    d.returnValue = ''; d.showModal(); (no == null ? $('#askYes') : $('#askNo')).focus();
  });
}
// Rule 15.1: keeping the BruControl names takes two warnings; No (use the Skynet names) is the default both times
async function namesChoice() {
  const pick = document.querySelector('input[name=names]:checked')?.value ?? 'skynet';
  if (pick !== 'bru') return 'skynet';
  const back = () => { document.querySelector('input[name=names][value=skynet]').checked = true; toast('Good choice: your items get Skynet names.'); return 'skynet'; };
  if (!await ask('Do you really want to keep your BruControl names?', `<p>The Skynet way is better in the end:</p><ul>
      <li>A Skynet name tells you the Interface, Port, Type, Label and Tab at a glance.</li>
      <li>Skynet renames an item everywhere, Processes too, so nothing is lost by changing.</li>
      <li>New Devices get Skynet names, so a kept BruControl name mixes two styles on the same Tab.</li>
      <li>Help, samples and Templates all use the Skynet way.</li></ul>`, 'Yes, keep my names', 'No, use the Skynet names')) return back();
  if (!await ask('Last chance: keep the BruControl names?', '<p>You can still change each name later in its Properties, but the Skynet names are the better choice.</p>',
    'Yes, keep my BruControl names', 'No, back out and use the Skynet names')) return back();
  return 'bru';
}
// Page 5 is a drill-down (OakBarn Brewery, 2026-11-08: "Steer the Importer to a Drill Down type question where the User Confirms what
// is imported in small steps"): 5a the Interfaces found (read only), 5b the new ID column (the IDs can be changed, then Accept),
// 5c the rest (Tabs, Look, Pictures and Sounds, the notes). Changed IDs convert the Import Copy again with them.
const row = (cells, cls = []) => '<tr>' + cells.map((c, i) => `<td${cls[i] ? ` class="${cls[i]}"` : ''}>${c}</td>`).join('') + '</tr>';
// again: the names are made again ({ to: the step to land on }) with state.ids and state.labels; none: a fresh convert
async function convert(again = null) {
  const d = again?.restore;      // the answers kept from last time (come back later)
  const names = d ? (d.names === 'bru' ? 'bru' : 'skynet') : again ? state.names : await namesChoice();
  state.names = names;
  if (!again || d) {
    Object.assign(state, { keepIfs: null, keepTabs: null, ids: null, itemPicks: null, parts: null, kindOf: null, partPage: 0, wPage: 0, max5: 0, savedConnect: null });
    if (d) Object.assign(state, { keepIfs: Array.isArray(d.keepIfs) ? new Set(d.keepIfs) : null, keepTabs: Array.isArray(d.keepTabs) ? new Set(d.keepTabs) : null,
      ids: d.ids ?? null, itemPicks: d.itemPicks ?? null, parts: d.parts ?? null, kindOf: d.kindOf ?? null, partPage: d.partPage ?? 0, wPage: d.wPage ?? 0, max5: Number(d.max5) || 0, savedConnect: d.connect ?? null });
  }
  show(5);
  const box = $('#convBody'); box.innerHTML = '<p class="muted">Making the Import Copy and converting it…</p>';
  sub5('busy');
  try {
    state.units = document.querySelector('input[name=units]:checked')?.value === 'Metric' ? 'Metric' : 'US';
    const sent = picksSent();
    const r = await api('POST', '/api/convert', { file: state.sel, names, units: state.units, copyMedia: true, ...(state.ids ? { ids: state.ids } : {}), ...sent });
    state.sentSig = JSON.stringify(sent);
    state.converted = true;
    // the Vessels step answers are kept when the names are made again (and when coming back later)
    const oldVessels = d?.vessels ?? (again ? state.connect?.parts?.vessels : null);
    state.firstVessels = structuredClone(r.connect?.parts?.vessels ?? []);      // the first guesses, for Clear Page on the Vessels step
    if (Array.isArray(oldVessels) && r.connect?.parts) r.connect.parts.vessels = oldVessels;
    state.connect = r.connect;
    state.r = r; exampleName();
    const to = d ? (steps().some(([x]) => x === d.sub5) ? d.sub5 : 'if') : again?.to ?? 'if';
    sub5(to);
  } catch (e) { state.converted = false; box.innerHTML = `<p class="note">${esc(e.message)}</p>`; }
}
// The answers so far are kept by the Importer (OakBarn Brewery, 2026-11-08: "Make the user's answers and settings persistent, so they
// can close and come back later"): a moment after each change, in Brewing\Import\progress.json, by config file
let saveTimer;
function saveProgress() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (!state.sel || !state.r || state.sub5 === 'busy') return;
    const data = { names: state.names, units: state.units, ids: state.ids, keepIfs: state.keepIfs ? [...state.keepIfs] : null, keepTabs: state.keepTabs ? [...state.keepTabs] : null,
      itemPicks: state.itemPicks, parts: state.parts, kindOf: state.kindOf, sub5: state.sub5, partPage: state.partPage, wPage: state.wPage, max5: state.max5,
      vessels: state.connect?.parts?.vessels ?? null, connect: connectState() ?? state.savedConnect ?? null, page: state.page, buildPage: state.buildPage };
    api('POST', '/api/progress', { file: state.sel, data }).catch(() => { /* kept next time */ });
  }, 800);
}
setInterval(() => { if (state.page === 6) saveProgress(); }, 15000);      // Connect your brewery changes are kept too
// The Tabs step (OakBarn Brewery, 2026-11-08: "Layout the Tab ... different Place Holder type ... a Check box and accept Button"): one row
// per Tab with its Items and a column for each kind of Placeholder found (Timers, Globals ...), and an Import box. A Tab with items is
// always imported (its box is ticked and cannot be cleared); an empty one is imported only when ticked. Accept goes on.
const KIND_NAMES = { Timer: 'Timers', GlobalVariable: 'Globals', Alarm: 'Alarms', Label: 'Labels', Image: 'Pictures', Picture: 'Pictures', Chart: 'Graphs',
  Script: 'Scripts', Button: 'Buttons', Switch: 'Switches', Text: 'Text', Gauge: 'Gauges' };
const kindName = k => KIND_NAMES[k] ?? (/^Device \((.+)\)$/.test(k) ? k.replace(/^Device \((.+)\)$/, (m, x) => x === 'CounterPort' ? 'Counter Devices' : x + ' Devices') : k);
function tabsHtml(r) {
  const kinds = Object.keys(r.byKind ?? {}).sort((a, b) => (r.byKind[b] - r.byKind[a]) || a.localeCompare(b));
  const keep = state.keepTabs ?? new Set(r.tabs.filter(t => t.always).map(t => t.name));      // Tabs with items start ticked, empty ones unticked
  return `<div class="card"><p>These are your BruControl Workspaces, which are <b>Tabs</b> in Skynet. <b>Items</b> are the Devices and Widgets
      that come in now; the other columns count the <b>Placeholders</b> of each kind (grey boxes that keep their place until a later step brings
      them in). Every Tab has an <b>Import Tab</b> box: a Tab with items starts <b>ticked</b>, an empty Tab starts <b>unticked</b>. You can tick or untick
      any of them; an unticked Tab is not imported, with everything on it. A Tab with nothing on it is a good one to leave out. Then <b>Accept</b>.</p>
    <table class="tabTable"><tr><th>Tab</th><th>ID</th><th>Items</th>${kinds.map(k => `<th title="${esc(k)}">${esc(kindName(k))}</th>`).join('')}<th>Import Tab</th></tr>
    ${r.tabs.map(t => row([esc(t.name), esc(t.id), t.items, ...kinds.map(k => t.kinds?.[k] ?? 0),
        `<input type="checkbox" class="keepTab" data-name="${esc(t.name)}"${keep.has(t.name) ? ' checked' : ''} title="${t.always ? 'Ticked: this Tab is imported with its items and Placeholders. Untick it to leave the whole Tab out.' : 'This Tab has no items. Tick it to import it with its Placeholders; unticked, it is not imported.'}" aria-label="Import the Tab ${esc(t.name)}">`],
        ['', '', 'n', ...kinds.map(() => 'n'), 'c'])).join('')}</table>
    ${r.globals?.length ? `<p class="small">Your <b>${r.globals.length}</b> BruControl Globals are not on this list: they are only listed (on the summary), and dealt with in a later step.</p>` : ''}</div>`;
}
// The Vessels step (OakBarn Brewery, 2026-11-08): each vessel found, with what the import could tell about it in columns, and a Manual
// Valves column the import cannot know (None to start). The answers go with the vessel into the Schema file.
// 🔨 Build (OakBarn Brewery, 2026-11-09: "go ahead and create it in the Importer"): each vessel is built with the Panel's own Vessel
// Device Builder on the Build page, starting from these answers; its pickers list the imported Heating Elements and Probes.
const SPARGE = [['none', 'None'], ['left', 'Upper Left'], ['right', 'Upper Right']];
const OUTLET = [['none', 'None'], ['low', 'Center Low'], ['bottom', 'Bottom Drain']];
const MANUAL = [['none', 'None'], ['ball', 'Manual Ball Valve'], ['butterfly', 'Manual Butterfly Valve']];
const HERMS = [['none', 'None'], ['left', 'Left'], ['right', 'Right'], ['outLeftInRight', 'Outlet Left & Inlet Right'], ['outRightInLeft', 'Outlet Right & Inlet Left']];
const hermsOf = v => HERMS.some(([k]) => k === v.details?.herms) ? v.details.herms : 'none';      // an old yes / no is None
function vesselsHtml() {
  const vs = state.connect?.parts?.vessels ?? [];
  const add = '<div class="buttons"><button type="button" id="vAdd" title="Add a vessel the Importer missed">➕ Add a vessel</button></div>';
  if (!vs.length) return `<div class="card"><p>No vessels were found in your names or Scripts. Add each one of yours.</p>${add}</div>`;
  const yn = (v, k) => `<select class="vd" data-v="${esc(v.key)}" data-k="${k}" title="${v.details?.found?.[k] ? 'Found in your names or Scripts (a guess): change it if it is wrong' : 'Not found in your names or Scripts: change it if your vessel has one'}">
    <option value="no"${v.details?.[k] !== 'yes' ? ' selected' : ''}>No</option><option value="yes"${v.details?.[k] === 'yes' ? ' selected' : ''}>Yes${v.details?.found?.[k] ? ' (found)' : ''}</option></select>`;
  return `<div class="card"><p>These are the vessels the Importer found in your BruControl names and Scripts, with what it could tell about each one.
      Type each vessel's <b>Volume</b>, and measure its <b>Height</b> and <b>Diameter</b> (in ${state.units === 'Metric' ? 'Liters and centimeters' : 'Gallons and inches'}).
      Everything is shown by its <b>BruControl name</b> for now. <b>(found)</b> means a name or a Script points to it; it is a guess, so change anything that is wrong. <b>Manual valves</b> are not in
      BruControl at all (nothing controls them), so pick the kind on each vessel, or leave it at None.</p>
    <p><b>🔨 Build</b> on a vessel opens the Skynet Panel's own <b>Vessel Device Builder</b> on the Build page, starting from that row's
      answers. Its Heating Element and Probe pickers list the ones imported from your BruControl file (the row's own are picked first).
      Build each vessel there, press <b>Save layout</b>, then come back and <b>Accept</b>. <span id="vbNote" class="small muted"></span></p>
    <div class="vesWrap"><table class="vesTable"><tr><th>Vessel</th><th>Side</th><th></th><th>Vessel Device Builder</th><th>Volume (${state.units === 'Metric' ? 'L' : 'gal'})</th><th>Height (${state.units === 'Metric' ? 'cm' : 'in'})</th><th>Diameter (${state.units === 'Metric' ? 'cm' : 'in'})</th><th>Heater Element</th><th>Thermowell with Probe</th><th>Outlet</th><th>Tangential Inlet</th><th>Sparge Arm / Steam Slayer</th><th>HERMS Coil</th><th>Motorized Ball Valve</th><th>Manual Valves</th></tr>
    ${vs.map(v => row([
      // the start of this page is the old Your vessels table (OakBarn Brewery, 2026-11-08): rename, Side, remove, Add a vessel
      `<input class="vd vName" data-v="${esc(v.key)}" data-k="name" value="${esc(v.name)}" maxlength="40" title="The vessel's name" aria-label="Vessel name">`,
      `<select class="vd" data-v="${esc(v.key)}" data-k="side" title="Hot Side vessels are joined on Connect your brewery; a Fermenter (Cold Side) has its own questions"><option value="hot"${v.side !== 'cold' ? ' selected' : ''}>Hot Side</option><option value="cold"${v.side === 'cold' ? ' selected' : ''}>Cold Side (Fermenter)</option></select>`,
      `<button type="button" class="vDel" data-v="${esc(v.key)}" title="Remove this vessel (the guess was wrong)" aria-label="Remove ${esc(v.name)}">✖</button>`,
      `<button type="button" class="vBuild primary" data-v="${esc(v.key)}" title="Build ${esc(v.name)} in the Vessel Device Builder on the Build page, starting from this row's answers">🔨 Build</button>`,
      // the vessel's size (OakBarn Brewery, 2026-11-08): its Volume, and its Height and Diameter measured, in the units picked at the start
      ...[['volume', 'How much it holds'], ['vheight', 'Its height, measured'], ['diameter', 'Its diameter (across), measured']].map(([k, tip]) =>
        `<input type="number" class="vd num" data-v="${esc(v.key)}" data-k="${k}" min="0" step="any" value="${esc(v.details?.[k] ?? '')}" title="${tip}, in ${k === 'volume' ? (state.units === 'Metric' ? 'Liters' : 'Gallons') : (state.units === 'Metric' ? 'centimeters' : 'inches')}" aria-label="${esc(v.name)} ${k === 'vheight' ? 'height' : k}">`),
      // Heater: a dropdown of every BruControl heating element found (OakBarn Brewery, 2026-11-08)
      `<select class="vd" data-v="${esc(v.key)}" data-k="heater" title="The BruControl heating element in this vessel${v.details?.found?.heater ? ' (the guess is the one named for this vessel)' : ''}"><option value="">None</option>${(state.connect?.heaters ?? []).map(x => `<option value="${esc(x.id)}"${v.details?.heater?.id === x.id ? ' selected' : ''}>${esc(x.label)}${v.details?.heater?.id === x.id && v.details?.found?.heater ? ' (found)' : ''}</option>`).join('')}</select>`,
      // Thermowell: a dropdown of every BruControl probe found (OakBarn Brewery, 2026-11-08)
      `<select class="vd" data-v="${esc(v.key)}" data-k="probe" title="The BruControl probe in this vessel's thermowell${v.details?.found?.probe ? ' (the guess is the one named for this vessel)' : ''}"><option value="">None</option>${(state.connect?.probes ?? []).map(x => `<option value="${esc(x.id)}"${v.details?.probe?.id === x.id ? ' selected' : ''}>${esc(x.label)}${v.details?.probe?.id === x.id && v.details?.found?.probe ? ' (found)' : ''}</option>`).join('')}</select>`,
      `<select class="vd" data-v="${esc(v.key)}" data-k="outlet" title="Where the vessel's outlet is: Center Low (above the bottom) or a Bottom Drain">${OUTLET.map(([k, n]) => `<option value="${k}"${(v.details?.outlet || 'none') === k ? ' selected' : ''}>${n}</option>`).join('')}</select>`,
      // Tangential: a tick box; Sparge Arm or Steam Slayer: one answer, where it sits (OakBarn Brewery, 2026-11-08)
      `<input type="checkbox" class="vd" data-v="${esc(v.key)}" data-k="tangential"${v.details?.tangential === 'yes' ? ' checked' : ''} title="${v.details?.found?.tangential ? 'Found in your names or Scripts (a guess): untick it if it is wrong' : 'Tick it if this vessel has a tangential inlet'}" aria-label="${esc(v.name)} has a tangential inlet">${v.details?.found?.tangential ? ' <span class="small muted">found</span>' : ''}`,
      `<select class="vd" data-v="${esc(v.key)}" data-k="sparge" title="A Sparge Arm or a Steam Slayer, and where it sits">${SPARGE.map(([k, n]) => `<option value="${k}"${(v.details?.sparge || 'none') === k ? ' selected' : ''}>${n}${(v.details?.sparge || 'none') === k && v.details?.found?.sparge ? ' (found)' : ''}</option>`).join('')}</select>`,
      // HERMS Coil: the Panel's own choices, None to start (OakBarn Brewery, 2026-11-08)
      `<select class="vd" data-v="${esc(v.key)}" data-k="herms" title="Where this vessel's HERMS coil joins it, as in the Panel${v.details?.found?.herms ? ' (a Script mentions HERMS)' : ''}" aria-label="${esc(v.name)} HERMS coil">${HERMS.map(([k, n]) => `<option value="${k}"${hermsOf(v) === k ? ' selected' : ''}>${n}</option>`).join('')}</select>${v.details?.found?.herms ? ' <span class="small muted">in a Script</span>' : ''}`,
      `<select class="vd" data-v="${esc(v.key)}" data-k="motorValve" title="The motorized ball valve on this vessel, from every motorized valve found${v.details?.found?.motorValve ? ' (the guess is the one named for this vessel)' : ''}"><option value="">None</option>${(state.connect?.parts?.valves ?? []).map(x => `<option value="${esc(x.id)}"${v.details?.motorValve === x.id ? ' selected' : ''}>${esc(x.label)}${v.details?.motorValve === x.id && v.details?.found?.motorValve ? ' (found)' : ''}</option>`).join('')}</select>`,
      `<select class="vd" data-v="${esc(v.key)}" data-k="manualValve" title="Manual valves are not in BruControl: pick the kind this vessel has">${MANUAL.map(([k, n]) => `<option value="${k}"${(v.details?.manualValve || 'none') === k ? ' selected' : ''}>${n}</option>`).join('')}</select>`])).join('')}</table></div>${add}</div>`;
}
// open the Build page with the Vessel Device Builder for one vessel (its answers ride in the address, #vb=)
async function buildVessel(v, b) {
  if (!v) return;
  const note = $('#vbNote'); b.disabled = true; if (note) note.textContent = 'Starting the Build page…';
  try {
    const r = await api('POST', '/api/build/open', { keepTabs: [...(state.keepTabs ?? [])], tabsPicked: !!state.keepTabs });
    const w = window.open(`${r.url}&vb=${encodeURIComponent(JSON.stringify(vbFromImport(v, state.units)))}`, 'skynetBuild');
    if (note) note.textContent = w ? `${v.name}: the Vessel Device Builder is open in its own window.` : 'Your browser blocked the window: allow pop-ups for the Importer, then click again.';
  } catch (e) { if (note) note.textContent = e.message; } finally { b.disabled = false; }
}
// The items on each Interface (OakBarn Brewery, 2026-11-08: "Insert a New Page after the Tab Page for the Elements associated with an
// Interface are all Listed"): one table per Interface (board), each item by its port, with its BruControl name, what it becomes in
// Skynet, its Skynet names and its Tab. An item on a Tab left out on the Tabs step is marked so.
const TYPE_TEXT = { digitalOut: 'Digital Output', digitalIn: 'Digital Input', pwmOut: 'PWM Output', analogIn: 'Analog Input', analogOut: 'Analog Output',
  temperature: 'Temperature Probe', hysteresis: 'Hysteresis', pid: 'PID', dutyCycle: 'Duty Cycle', deadband: 'Deadband', flowMeter: 'Flow Meter',
  scale: 'Scale', stepper: 'Stepper', switch: 'Switch', chart: 'Graph' };
const typeText = e => e.subtype === 'pump' ? (/_CPMP_/.test(e.name) ? 'Cool / Warm Pump' : 'Pump') : e.subtype === 'element' ? 'Heating Element' : TYPE_TEXT[e.type] ?? e.type;
const itemKey = e => e.bruId || `${e.device}|${e.port}|${e.bru}`;
const shownName = e => e.noDisplay ? e.bru : (e.display || e.bru);      // what the Display Name column shows, and what the tick copies
// The name column (first asked as two columns, OakBarn Brewery, 2026-11-08: "Skynet Name should read Skynet Name with DisplayName and a new Column Skynet Name
// with Label that is updated every time a Label is populated (and updated if change)"): the suggested name with the Label part made
// from the Display Name, and with the Label typed (a space becomes ~, public/naming.js parseLabel, the Panel's own rule)
// a Boolean Widget's kind letters follow the Style picked on its page (SW, PB, PL, LED, Rule 3.14)
const preOf = e => { const st = 'style' in e && pickOf(e)?.style, s = st && BOOL_STYLES.find(x => x[0] === st); return s ? 'wgt_' + widgetTypeId({ type: s[2], boolStyle: st }) : e.pre; };
const nameWith = (e, label) => e.pre && e.tabId && state.names !== 'bru' ? `${preOf(e)}_${parseLabel(label) || '…'}_${e.tabId}` : e.name;
const pickOf = e => state.itemPicks?.[itemKey(e)];
const showOf = e => pickOf(e)?.show ?? e.show !== false;
// One Skynet Name column (OakBarn Brewery, 2026-11-08: "Update the SkyNet Name After the label is filled so always use just the label
// name. Update the skynet name if the label is updated"): once a Label is typed the name is made with the Label only, and changes as the
// Label changes; until then it is made with the Display Name, greyed
const nmLabel = (e, label) => label?.trim() ? esc(nameWith(e, label)) : `<span class="muted" title="Made with the Display Name until you type a Label">${esc(nameWith(e, shownName(e)))}</span>`;
// The cells every item line has (OakBarn Brewery, 2026-11-08: "Pumps (and all items) get the Display Name / tick / Label (and Show)
// treatment"): Display Name, the tick box that copies it, the Label box (blank to start), and Show (ticked as it was in BruControl)
function pickCells(e, out = false) {
  const k = esc(itemKey(e)), pick = pickOf(e);
  return [e.noDisplay ? `<span class="noDisplay" title="No Display Name in BruControl: the BruControl name is shown greyed instead">${esc(e.bru)}</span>` : esc(shownName(e)),
    `<input type="checkbox" class="itemTick" data-item="${k}" data-copy="${esc(shownName(e))}"${pick?.tick ? ' checked' : ''} title="Copy the Display Name into the Label box" aria-label="Copy the Display Name of ${esc(e.bru)}">`,
    `<input type="text" class="itemLabel" data-item="${k}"${out ? ' data-out="1"' : ''} maxlength="40" value="${esc(pick?.label ?? '')}" title="${out ? 'This item is on a Tab you left out, so it is not imported' : 'Your Label for this item: the words you use for it'}" aria-label="Label of ${esc(e.bru)}">`,
    `<input type="checkbox" class="itemShow" data-item="${k}"${showOf(e) ? ' checked' : ''} title="Ticked: the Label is shown with it on the Tab (it starts as BruControl showed the name)" aria-label="Show the Label of ${esc(e.bru)}">`];
}
const pickHeads = '<th>Display Name</th><th title="Tick to copy the Display Name into the Label box">✔</th><th>Label</th><th title="Ticked: the Label is shown on the Tab, as BruControl showed the name">Show</th>';
const nameCell = e => `<code class="nmLabel" data-item="${esc(itemKey(e))}">${nmLabel(e, pickOf(e)?.label)}</code>`;
const nameHeads = '<th title="The suggested Skynet name, made with your Label (it changes as you type). Until a Label is typed it is made with the Display Name, greyed.">Skynet Name</th>';
// every item and Widget by its key, for the live name column
const allItems = () => [...(state.r?.portItems ?? []), ...(state.r?.appItems ?? [])];
// the tick box, the Label box and the Show box, the same on every page
function pickInput(ev) {
  const t = ev.target, k = t.dataset?.item;
  if (!k || !t.matches?.('.itemTick, .itemLabel, .itemShow, .itemStyle, .itemLink')) return false;
  state.itemPicks ??= {};
  const e = allItems().find(x => itemKey(x) === k);
  const p = state.itemPicks[k] ??= { tick: false, label: '' };
  if (t.classList.contains('itemTick')) {
    p.tick = t.checked;
    // ticking copies the Display Name into the Label box (OakBarn Brewery, 2026-11-08)
    if (t.checked) { const l = t.closest('tr').querySelector('.itemLabel'); l.value = p.label = t.dataset.copy; l.classList.remove('blankLabel'); }
  }
  if (t.classList.contains('itemLabel')) { p.label = t.value; if (t.value.trim()) t.classList.remove('blankLabel'); }
  if (t.classList.contains('itemShow')) p.show = t.checked;
  if (t.classList.contains('itemStyle')) p.style = t.value;      // the name column follows its kind letters
  if (t.classList.contains('itemLink')) p.link = t.value;
  if (e) for (const n of document.querySelectorAll(`.nmLabel[data-item="${CSS.escape(k)}"]`)) n.innerHTML = nmLabel(e, p.label);
  saveProgress();
  return true;
}
// the Labels and Show boxes as the convert gets them (by BruControl element ID)
const picksSent = () => {
  const labels = {}, shows = {}, styles = {}, links = {};
  for (const [k, p] of Object.entries(state.itemPicks ?? {})) {
    if (p.label?.trim()) labels[k] = p.label.trim(); if (typeof p.show === 'boolean') shows[k] = p.show;
    if (p.style) styles[k] = p.style; if (p.link) links[k] = p.link;
  }
  return { labels, shows, styles, links };
};
// A Boolean Widget's Style and Linked Device (Rule 1.20, OakBarn Brewery 2026-11-09: "Think of it like a clone in the action but a
// Switch, slider or Led in appearance"): the same choices as its Properties in the Panel (public/semi.js)
const BOOL_HEADS = '<th title="Which Boolean Widget it becomes: how it looks and how a tap works. It can\'t be changed after the import.">Becomes</th><th title="It acts like a Clone of this Device: the two turn ON and OFF together. None: it only shows its own ON / OFF.">Linked Device</th>';
function boolCells(e) {
  const k = esc(itemKey(e)), pick = pickOf(e), st = pick?.style || e.style || 'switch', ln = pick?.link ?? e.link ?? '';
  const devs = (state.r?.linkable ?? []).map(d => [d.key, `${d.label || d.bru} (${d.tab})`]).sort((a, b) => a[1].localeCompare(b[1]));
  return [`<select class="itemStyle" data-item="${k}" aria-label="What ${esc(e.bru)} becomes">${BOOL_STYLES.map(([key, word, , tip]) => `<option value="${esc(key)}" title="${esc(tip)}"${key === st ? ' selected' : ''}>${esc(word)}</option>`).join('')}</select>`,
    `<select class="itemLink" data-item="${k}" aria-label="Linked Device of ${esc(e.bru)}"><option value="">None</option>${devs.map(([key, word]) => `<option value="${esc(key)}"${key === ln ? ' selected' : ''}>${esc(word)}</option>`).join('')}</select>`];
}
// No box may be blank (OakBarn Brewery, 2026-11-08: "Fields cannot be blank"): the blank ones are marked red and named in a message
async function noBlanks(box) {
  const labels = [...box.querySelectorAll('.itemLabel:not([data-out])')].filter(b => !b.value.trim());
  const fields = [...box.querySelectorAll('.pf:not(.pName):not([data-optional]), .pfUser, .pName')].filter(b => !b.disabled && !String(b.value).trim());
  for (const b of box.querySelectorAll('.itemLabel, .pf, .pfUser')) b.classList.remove('blankLabel', 'blankField');
  labels.forEach(b => b.classList.add('blankLabel')); fields.forEach(b => b.classList.add('blankField'));
  if (!labels.length && !fields.length) return true;
  await tell('Some boxes are blank', `<p>${labels.length ? `${labels.length} Label${labels.length === 1 ? ' is' : 's are'} blank. Every item needs a Label, because it is part of its suggested Skynet name: type one, or tick the box to copy the Display Name.` : ''}
    ${fields.length ? `${fields.length} other box${fields.length === 1 ? ' is' : 'es are'} blank or still say <b>Pick one…</b>. These answers must be filled in: if none fits, pick <b>User defined</b> and type your own words. A box marked <i>(optional)</i> may stay blank.` : ''}</p>
    <p>The blank boxes are marked in red.</p>`);
  (labels[0] ?? fields[0]).focus();
  return false;
}
function itemsHtml(r) {
  const keep = state.keepTabs ?? new Set(r.tabs.map(t => t.name));
  const all = r.portItems ?? [];
  const ex = r.labelExamples ?? [];
  // the Labels text (OakBarn Brewery, 2026-11-08)
  return `<div class="card"><p>Every item wired to a port of an Interface (board), listed by Interface and port, with its <b>BruControl name</b>,
      its <b>Display Name</b> (a greyed one means there was no Display Name, so the BruControl name is shown), the <b>Skynet type</b>, the
      suggested <b>Skynet name</b> made with your Label (greyed and made with the Display Name until you type one), and its <b>Tab</b>. An item on a Tab you left out on the Tabs step is not imported.</p>
      <h3>Labels</h3>
      <p>In BruControl each item had a <b>Display Name</b>, the words shown with it on the screen. The Importer brings over the Display Name
      settings and puts them in the item's <b>Label</b> in Skynet. The Label can be shown on the Tab just like the Display Name was in BruControl
      (the <b>Show</b> box, ticked as BruControl showed it), and it is also the <b>Label part of the suggested Skynet name</b>.</p>
      <p>Give every item a Label using <b>the words you use when you describe your brewery</b> to someone, like HLT, Mash Tun or Boil Kettle.
      Tick an item's box to copy its Display Name into its Label box, then change it if you like. The <b>Skynet Name</b> column
      is made with your Label and changes as you type.</p>
      <p><b>Why there is no "tick them all" box:</b> each item must be looked at on its own. A BruControl name is often a code only its
      builder knows, like <code>M_6_B_1</code>, while the Label should say what it is in your brewery, like <i>HLT</i> or <i>HLT Outlet Valve</i>.
      Copying every Display Name at once would carry those codes into every Skynet name.</p>
      <ul>
        <li>A Label can have <b>spaces</b>. In the suggested Skynet name a space becomes <code>~</code>, so <i>Mash Tun</i> is <code>Mash~Tun</code>.</li>
        <li>A Label <b>does not have to be different</b> from the others. A Heater, a Temperature Probe and a Valve can all have the Label
        <b>HLT</b>. The Label is only one part of the suggested name, so the three names are still all different:
        <ul>${ex.map(x => `<li>${esc(x.what)}: <code>${esc(x.name)}</code> <span class="small muted">${x.sample ? '(a made-up sample)' : `(made from your ${esc(x.from)})`}</span></li>`).join('')}</ul></li>
        <li><b>Skynet names are the preferred way to name things in Skynet</b>: each one tells you the board, the port, the kind of item,
        the Label and the Tab at a glance.</li>
        <li><b>No Label may be blank.</b> When every Label is filled in, press <b>Accept</b> at the bottom of the page. The suggested Skynet
        names are then made again with your Labels.</li>
      </ul></div>
    ${r.interfaces.filter(d => ifOn(d.name)).map(d => {
      const list = all.filter(e => e.device === d.name).sort((a, b) => String(a.port).localeCompare(String(b.port), undefined, { numeric: true }));
      return `<div class="card"><h3>${esc(d.name)} <span class="muted small">(ID ${esc(d.id)}, ${list.length} item${list.length === 1 ? '' : 's'})</span></h3>
        ${list.length ? `<div class="vesWrap"><table class="itemTable"><tr><th>Port</th><th>BruControl name</th>${pickHeads}<th>Skynet type</th>${nameHeads}<th>Tab</th></tr>
        ${list.map(e => { const out = !keep.has(e.tab);
          return row([esc(e.port), esc(e.bru), ...pickCells(e, out), esc(typeText(e)), nameCell(e), out ? `${esc(e.tab)} <span class="note small">left out</span>` : esc(e.tab)], ['n']); }).join('')}</table></div>`
          : '<p class="small muted">No items on this Interface.</p>'}</div>`;
    }).join('')}`;
}
// a message box with one OK button (an error the user must fix first)
function tell(title, html) {
  return new Promise(ok => {
    const d = $('#ask'); $('#askTitle').textContent = title; $('#askText').innerHTML = html;
    $('#askYes').classList.add('hidden'); $('#askNo').textContent = 'OK'; $('#askNo').onclick = () => d.close('ok');
    d.onclose = () => { $('#askYes').classList.remove('hidden'); ok(); };
    d.returnValue = ''; d.showModal(); $('#askNo').focus();
  });
}
// ---- The Widget pages (OakBarn Brewery, 2026-11-08: "After Your Tabs, add pages for all Widgets, with a category for each Skynet Widget
// type. Import all BruControl Application Elements ... as Skynet equivalent Widgets"): first every Skynet Widget type and what came in
// as one, then a page for each kind found, with the same Display Name, tick, Label and Show columns as the items.
const SKYNET_WIDGETS = [['Timer Widget', 'Timer'], ['Alarm Widget', 'Alarm'], ['Boolean Widget', 'Toggle Switch'], [PROCESS_WIDGET_WORD, 'Script'], ['Value Widget', ''],
  ['Graph Widget', 'Chart'], ['Time Widget', ''], ['DateTime Widget', ''],
  ['Code Value Widget', ''], ['Text Widget', ''], ['Label Widget', ''], ['Picture Widget', ''], ['Sound Player Widget', ''], ['Manual Valve Widget', ''],
  ['Manual Pump Widget', ''], ['Override button Widget', '']];
const widgetKeep = e => (state.keepTabs ?? new Set(state.r.tabs.map(t => t.name))).has(e.tab);
// only the kinds with a Widget on a Tab being imported get a page, so "(1 of 1)" when there is only one kind (OakBarn Brewery, 2026-11-08:
// "Your Widget Timers (1of 2) should be Your Widget Timers (1of 1) as there is only 1")
const widgetPages = () => [...new Set((state.r?.appItems ?? []).filter(widgetKeep).map(e => e.page))];
function widgetsPage(box) {
  const pages = widgetPages(), all = state.r.appItems ?? [];
  if ((state.wPage ?? 0) > pages.length) state.wPage = 0;      // a Tab was left out since: that kind has no page now
  const i = state.wPage ?? 0;
  if (i === 0) {
    const count = w => all.filter(e => e.widget === w && widgetKeep(e)).length;
    box.innerHTML = `<div class="card"><p>BruControl's <b>Application Elements</b> are the things on a Workspace that are not wired to an
        Interface (board): Timers, Alarms, Toggle Switches, Scripts, Charts and so on. Each one comes into Skynet as the Skynet <b>Widget</b>
        that does the same job. This list has every kind of Skynet Widget, and how many of yours become one. The next
        page${pages.length === 1 ? '' : 's'} give${pages.length === 1 ? 's' : ''} each kind found its Labels, the same way as the items on your boards.</p>
      <table class="itemTable"><tr><th>Skynet Widget</th><th>BruControl Element it comes from</th><th>How many of yours</th></tr>
      ${SKYNET_WIDGETS.map(([w, b]) => row([`<b>${esc(w)}</b>`, b ? esc(b) : '<span class="muted">none in BruControl</span>', count(w) || '<span class="muted">0</span>'], ['', '', 'n'])).join('')}</table>
      ${(state.r.appHolders ?? []).length ? `<p class="small">These have <b>no Skynet Widget</b> (for example a BruControl <b>Inspector</b>), so they stay a grey <b>Placeholder</b> on their Tab:
        ${state.r.appHolders.map(h => `${esc(h.bru)} <span class="muted">(${esc(h.kind)}, ${esc(h.tab)})</span>`).join(', ')}.</p>` : ''}
      ${state.r.globals?.length ? `<p class="small">Your ${state.r.globals.length} BruControl <b>Globals</b> are only listed (on the summary) and dealt with later.</p>` : ''}
      ${pages.length ? '' : '<p>No Application Elements were found on the Tabs you are importing, so there are no Widget pages. Press <b>Accept</b>.</p>'}</div>`;
    state.accept = forward;
    return;
  }
  const page = pages[i - 1], list = all.filter(e => e.page === page && widgetKeep(e)), bool = list.some(e => 'style' in e);
  box.innerHTML = `<div class="card"><p>Your BruControl <b>${esc(page)}</b>, each now a Skynet <b>${esc(list[0]?.widget ?? 'Widget')}</b>. Give each one a
      <b>Label</b> (tick the box to copy its Display Name), and keep <b>Show</b> ticked to show the Label on the Tab. A Widget's suggested
      Skynet name is <code>wgt_</code>, its kind, the Label and the Tab ID (Rule 3.14). No Label may be blank. Then <b>Accept</b>.</p>
      ${bool ? `<p>Each one becomes a Skynet <b>Boolean Widget</b> (Rule 1.20). Pick <b>Becomes</b>: which Boolean Widget it is (Switch, Slider, Checkbox,
      Lighted Button, Push Button, Pulse Button or LED). Each is its own Widget, so once imported a Slider stays a Slider. Pick a <b>Linked
      Device</b> to make it act like a Clone of that Device: turn one ON and the other turns ON too, on any Tab, with no Process. Only your
      imported Devices with an ON / OFF state are listed. The Linked Device can be changed later in its Properties.</p>` : ''}</div>
    <div class="card"><div class="vesWrap"><table class="itemTable"><tr><th>#</th><th>BruControl name</th>${pickHeads}<th>Skynet Widget</th>${bool ? BOOL_HEADS : ''}${nameHeads}<th>Tab</th></tr>
    ${list.map((e, n) => row([`${n + 1}`, esc(e.bru), ...pickCells(e), esc(e.widget), ...(bool ? boolCells(e) : []), nameCell(e), esc(e.tab)], ['n'])).join('')}</table></div></div>`;
  box.oninput = box.onchange = pickInput;
  state.accept = async () => { if (await noBlanks(box)) forward(); };
}
// ---- The item pages (OakBarn Brewery, 2026-11-08: "before the Vessels getting the Details of all The Elements that are an Interface
// Element and divide them in to pages: Pumps, Heaters, Probes, Valves, Flow ... Always begin with How Many and if you found 3, and the
// User Says 5, add two empty slots with the Name Pump 4, Pump 5"). One page per kind; each starts with How many; the details are first
// guesses the brewer can change. Answers are kept per kind while you move between the pages, and saved in the Schema (itemDetails).
// An item can be moved to the page it belongs on (Belongs on), and an empty line can be filled with an item no page has taken yet
// (OakBarn Brewery, 2026-11-08: "a dropdown of other (unassigned) Elements to fill a line ... the same dropdown ... on every page").
const ifOn = d => !state.keepIfs || state.keepIfs.has(d);      // an Interface left unticked on the first step: its items are left out
const kindOfItem = e => state.kindOf?.[itemKey(e)] ?? e.kind;
const pageItems = kind => { const keep = state.keepTabs ?? new Set(state.r.tabs.map(t => t.name)); return (state.r.portItems ?? []).filter(e => kindOfItem(e) === kind && keep.has(e.tab) && ifOn(e.device)); };
function partState(page) {
  state.parts ??= {};
  const found = pageItems(page.kind);
  const p = state.parts[page.kind] ??= { items: {}, extras: [] };
  for (const e of found) p.items[itemKey(e)] ??= structuredClone(e.kind === page.kind ? e.guess ?? {} : {});
  if (page.methods) for (const e of found) { const d = p.items[itemKey(e)]; d.methods ??= ['onoff']; d.primary ??= 'onoff'; }
  // a valve with no Size starts at the Panel's Default pipe size, when one is set on this computer (Rule 2.42: not typed twice)
  if (page.kind === 'valve' && state.panel?.pipeSize && page.fields.find(f => f.k === 'size').list.some(([k]) => k === state.panel.pipeSize)) {
    p.setAll ??= { size: state.panel.pipeSize };
    for (const e of found) { const d = p.items[itemKey(e)]; if (!d.size) d.size = state.panel.pipeSize; }
  }
  return { p, found };
}
function fieldHtml(f, v, attrs, d = {}) {
  // a box mandatory for some types only (Rule 18.33: Pulses, Highest pressure, Most it reads, a Tilt's Color, a Hardware ID): mandatory
  // where need() is true, greyed where false
  const need = f.need?.(d ?? {});
  if (need === true) f = { ...f, optional: false };
  if (need === false) attrs += ` disabled title="${esc(f.notUsed ?? 'Not used by this type')}"`;
  if (f.blank && need === true) attrs += ` data-blank="${esc(f.blank)}"`;
  const help = f.help && need !== false ? ` title="${esc(f.help)}"` : '';
  if (f.number) return `<input type="number" class="pf num" min="0" step="any" ${attrs} data-f="${f.k}"${f.optional ? ' data-optional="1" placeholder="(optional)"' : ''} value="${esc(v ?? '')}" aria-label="${esc(f.name)}"${help}>`;
  if (f.text) return `<input type="text" class="pf" maxlength="60" ${attrs} data-f="${f.k}"${f.optional ? ' data-optional="1" placeholder="(optional)"' : ''} value="${esc(v ?? '')}" aria-label="${esc(f.name)}"${help}>`;      // a Hydrometer's Hardware ID (Rule 6.25)
  // a box OakBarn Brewery has not made mandatory may stay at Pick one… (Rule 18.33)
  return `<select class="pf" ${attrs} data-f="${f.k}"${f.optional ? ' data-optional="1"' : ''} aria-label="${esc(f.name)}"${help}>${f.list.map(([k, n]) => `<option value="${esc(k)}"${(v ?? '') === k ? ' selected' : ''}>${esc(!k && f.optional ? 'Pick one… (optional)' : n)}</option>`).join('')}</select>` +
    (v === 'user' ? ` <input type="text" class="pfUser" ${attrs} data-f="${f.k}User" maxlength="60" value="${esc(d[f.k + 'User'] ?? '')}" placeholder="Your words" aria-label="${esc(f.name)}: your own words">` : '');
}
// the Control Type columns (OakBarn Brewery, 2026-11-08: "Speed becomes Control Type"): a tick box per method, then the Primary by number
// A Heating Element's first column is Direct Only (OakBarn Brewery, 2026-11-08; Direct was On/Off until 2026-11-09): ticked, it is run by a click on it and nothing else,
// so the other methods on its line are greyed; untick it to pick them. A pump's On/Off is always ticked and greyed.
const onoffOnly = (d, kind) => kind === 'heater' && (d.onoffOnly ?? (d.methods ?? ['onoff']).length === 1);
function methodCells(d, attrs, kind) {
  const ms = d.methods ?? ['onoff'], only = onoffOnly(d, kind);
  const box = (k, n) => {
    const w = methodName(kind, k);
    if (k === 'onoff') return kind === 'heater'
      ? `<input type="checkbox" class="pm" ${attrs} data-m="onoff"${only ? ' checked' : ''} title="1. Direct Only: it is turned on and off by a click on it (or a Process) and nothing else. Untick it to pick another method" aria-label="${esc(w)}">`
      : `<input type="checkbox" class="pm" ${attrs} data-m="onoff" checked disabled title="On/Off is always allowed (Rule 6.19)" aria-label="${esc(w)}">`;
    return `<input type="checkbox" class="pm" ${attrs} data-m="${k}"${ms.includes(k) && !only ? ' checked' : ''}${only ? ' disabled' : ''} title="${n + 1}. ${esc(w)}: ${only ? 'untick Direct Only first' : 'tick it to allow this method'}" aria-label="${esc(w)}">`;
  };
  return [...METHOD_COLS.map(([k], n) => box(k, n)),
    `<select class="pmPrimary" ${attrs} title="The method it starts with: pick its column number" aria-label="Primary method"${only ? ' disabled' : ''}>${METHOD_COLS.map(([k], n) => ms.includes(k) && (!only || k === 'onoff') ? `<option value="${k}"${d.primary === k ? ' selected' : ''}>${n + 1}. ${esc(methodName(kind, k))}</option>` : '').join('')}</select>`];
}
const methodHeads = kind => METHOD_COLS.map(([k], n) => `<th class="mCol">${n + 1}<br>${esc(methodName(kind, k))}</th>`).join('') + '<th>Primary (column #)</th>';
function partsPage(box) {
  const page = PART_PAGES[state.partPage ?? 0];
  const ifName = n => state.r.interfaces.find(d => d.name === n);
  const belongs = e => `<select class="pBelongs" data-i="${esc(itemKey(e))}" title="The page this item belongs on: pick another to move it there" aria-label="Belongs on">${PART_PAGES.map(pg => `<option value="${pg.kind}"${pg.kind === page.kind ? ' selected' : ''}>${esc(pg.title)}</option>`).join('')}</select>`;
  const draw = () => {
    const { p, found } = partState(page);
    const free = pageItems('other').filter(e => page.kind !== 'other');
    const fill = i => free.length ? `<select class="pFill" data-x="${i}" title="Fill this line with an item no page has taken yet (from Other items)" aria-label="Fill with an item"><option value="">Fill with an item…</option>${free.map(e => `<option value="${esc(itemKey(e))}">${esc(e.bru)}</option>`).join('')}</select>` : '<span class="small muted">no free items</span>';
    const extraRows = p.extras.map((x, i) => row([`${found.length + i + 1}`,
      `<input class="pf pName" data-x="${i}" data-f="name" maxlength="40" value="${esc(x.name)}" aria-label="Name">`, '<span class="small muted">new, not wired yet</span>', '', '', '', fill(i), '',
      ...page.fields.map(f => fieldHtml(f, x[f.k], `data-x="${i}"`, x)), ...(page.methods ? methodCells(x, `data-x="${i}"`, page.kind) : [])], ['n']));
    box.innerHTML = `<div class="card"><p>Every <b>${esc(page.one)}</b> found on the ports of your Interfaces (boards), on the Tabs you are importing.
        Check each line: give it a <b>Label</b> (or tick to copy its Display Name), and pick every detail. The ones filled in are guesses from
        the names, so change any that are wrong. Only a box marked <i>(optional)</i> may stay at <b>Pick one…</b>: for the others, if no choice fits, pick <b>User defined</b> and type
        your own words. An item on the wrong page can be moved with <b>Belongs on</b>. Then <b>Accept</b>.</p>
      ${page.methods ? `<p><b>Control Type:</b> each numbered column is a way to control it; tick every one it may use${page.kind === 'heater'
        ? ' (every Heating Element is turned on and off by a click on it; tick <b>Direct Only</b> when nothing else controls it, and the other columns are greyed)'
        : ' (On/Off is always allowed)'}, then pick the <b>Primary</b> one, the method it starts with, by its column number. A method that is not recommended for
        a ${esc(page.one)} unticks itself and says why.</p>` : ''}
      ${page.kind === 'valve' ? `<p>Only <b>Connection Type</b> and <b>Size</b> must be filled in: they change how the valve is drawn. Use
        <b>Set every Valve</b> to give every line the same Connection Type, Size and Voltage at once, then change any line that differs.</p>
        <p><b>Connection Type</b> is how the valve is built into your manifold, not the thread on the valve itself. For
        example, a BSP valve with a BSP to NPT adapter and a female TC on each end is a <b>TC</b> valve, because it joins the manifold with
        Tri-Clamps. <b>Size</b> is the pipe size it joins (any size up to 4 inch, in inches or millimeters, whatever units you picked).</p>` : ''}
      ${page.setAll ? `<p class="setAll"><b>Set every ${esc(page.one)}:</b> ${page.setAll.map(k => { const f = page.fields.find(x => x.k === k);
        return `<label>${esc(f.name)} <select class="setAllPick" data-f="${k}" aria-label="${esc(f.name)} for every ${esc(page.one)}">${f.list.filter(([v]) => v !== 'user').map(([v, n]) => `<option value="${esc(v)}"${(p.setAll?.[k] ?? '') === v ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select></label>`; }).join(' ')}
        <span class="small muted">Every line follows a change here; any line can then be set differently.</span></p>` : ''}
      <p class="howMany"><label><b>How many ${esc(page.title)} do you have?</b> <input type="number" id="howMany" min="${found.length}" max="${found.length + 100}" step="1" value="${found.length + p.extras.length}"></label>
        <span class="small muted">We found ${found.length}. If you have more, type how many: an empty line is added for each one${found.length ? ', named ' + esc(page.one) + ' ' + (found.length + 1) + ' and so on' : ''}. An empty line can be filled with an item from Other items.</span></p></div>
      <div class="card">${found.length || p.extras.length ? `<div class="vesWrap"><table class="itemTable partTable"><tr><th>#</th><th>BruControl name</th>${pickHeads}<th>Belongs on</th><th>Interface and Port</th>${page.fields.map(f => `<th${f.help ? ` title="${esc(f.help)}"` : ''}>${esc(f.name)}</th>`).join('')}${page.methods ? methodHeads(page.kind) : ''}${nameHeads}</tr>
        ${found.map((e, i) => { const d = p.items[itemKey(e)], a = `data-i="${esc(itemKey(e))}"`;
          return row([`${i + 1}`, esc(e.bru), ...pickCells(e), belongs(e), `${esc(ifName(e.device)?.id ?? e.device)} port ${esc(e.port)}`,
            ...page.fields.map(f => fieldHtml(f, d?.[f.k], a, d)), ...(page.methods ? methodCells(d, a, page.kind) : []), nameCell(e)], ['n']); }).join('')}
        ${extraRows.join('')}</table></div>` : `<p class="small muted">No ${esc(page.title)} found. If you have some, type how many above.</p>`}</div>`;
    return p;
  };
  let p = draw();
  const target = t => t.dataset.x != null ? p.extras[Number(t.dataset.x)] : p.items[t.dataset.i];
  box.oninput = box.onchange = async ev => {
    if (pickInput(ev)) return;
    const t = ev.target;
    if (t.id === 'howMany') {
      if (ev.type !== 'change') return;
      const found = pageItems(page.kind).length, n = Math.max(found, Math.min(found + 100, Math.floor(Number(t.value) || 0)));
      while (found + p.extras.length < n) p.extras.push({ name: `${page.one} ${found + p.extras.length + 1}` });
      p.extras.length = n - found; p = draw(); saveProgress(); return;
    }
    if (ev.type !== 'change' && !t.matches('input[type=text], input[type=number]')) return;
    // move an item to the page it belongs on, or fill an empty line with a free item
    // Set every valve (OakBarn Brewery, 2026-11-09: "Anytime the top is changed, all the entries follow, but then can individually be different")
    if (t.classList.contains('setAllPick')) {
      if (ev.type !== 'change') return;
      (p.setAll ??= {})[t.dataset.f] = t.value;
      for (const d of [...Object.values(p.items), ...p.extras]) { d[t.dataset.f] = t.value; delete d[t.dataset.f + 'User']; }
      p = draw(); saveProgress(); return;
    }
    if (t.classList.contains('pBelongs')) { (state.kindOf ??= {})[t.dataset.i] = t.value; p = draw(); saveProgress(); return; }
    if (t.classList.contains('pFill')) { if (!t.value) return; (state.kindOf ??= {})[t.value] = page.kind; p.extras.splice(Number(t.dataset.x), 1); p = draw(); saveProgress(); return; }
    const d = target(t); if (!d) return;
    if (t.classList.contains('pm') && t.dataset.m === 'onoff' && page.kind === 'heater') {
      // Direct Only: ticked, the other methods go; unticked, they can be picked
      d.onoffOnly = t.checked;
      if (t.checked) { d.methods = ['onoff']; d.primary = 'onoff'; d.override = []; }
      p = draw(); saveProgress(); return;
    }
    if (t.classList.contains('pm')) {
      const k = t.dataset.m, why = NOT_RECOMMENDED[page.kind]?.[k], ms = new Set(d.methods ?? ['onoff']);
      if (t.checked) {
        if (why && !(d.override ?? []).includes(k)) {
          t.checked = false;      // a method not recommended unticks itself and says why, with a button to use it anyway (OakBarn Brewery, 2026-11-08)
          if (!await ask(`${METHOD_COLS.find(m => m[0] === k)[1]} is not recommended for a ${page.one}`, `<p>${esc(why)}</p><p>You can still use it if you know your ${esc(page.one)} needs it.</p>`, 'Use it anyway', 'OK, leave it off')) return;
          (d.override ??= []).push(k);
        }
        ms.add(k);
      } else { ms.delete(k); if (d.override) d.override = d.override.filter(x => x !== k); }
      ms.add('onoff');
      d.methods = METHOD_COLS.map(m => m[0]).filter(x => ms.has(x));
      if (!d.methods.includes(d.primary)) d.primary = 'onoff';
      p = draw(); saveProgress(); return;
    }
    if (t.classList.contains('pmPrimary')) { d.primary = t.value; saveProgress(); return; }
    const f = t.dataset?.f; if (!f) return;
    d[f] = t.value;
    // a pump model made for one voltage fills in its Power
    if (page.kind === 'pump' && f === 'model' && onePower(t.value)) { d.power = onePower(t.value); p = draw(); saveProgress(); return; }
    // a type that needs a box (Rule 18.33) makes it mandatory, one that does not greys it; the line goes straight to the first
    // blank box it now needs (a Tilt to its Color, a Hall effect meter to its Pulses)
    const needs = page.fields.filter(x => x.need);
    if (needs.length && !needs.some(x => x.k === f)) {
      const key = t.dataset.x != null ? `[data-x="${t.dataset.x}"]` : `[data-i="${CSS.escape(t.dataset.i)}"]`;
      p = draw(); saveProgress();
      const c = needs.map(x => box.querySelector(`[data-f="${x.k}"]${key}`)).find(c => c && !c.disabled && c.dataset.blank && !String(c.value).trim());
      if (c) c.focus();
      return;
    }
    if (t.tagName === 'SELECT' && (t.value === 'user' || t.nextElementSibling?.classList.contains('pfUser'))) p = draw();      // User defined: its words box
    saveProgress();
  };
  // leaving a mandatory box blank (a Tilt's Color, the Pulses of a Hall effect meter ..., Rule 18.33): a pop-up says so, then back to that box
  box.onfocusout = async ev => {
    const t = ev.target;
    if (!t?.dataset?.blank || !t.isConnected || t.disabled || String(t.value).trim() || $('#ask').open || !document.hasFocus()) return;      // not when the window itself loses the focus
    await ask(t.dataset.f === 'color' ? 'Pick a Color' : 'This box is needed', `<p>${esc(t.dataset.blank)}</p><p>Fill it in, or leave the page with Back.</p>`, 'OK', null);
    if (t.isConnected) t.focus();
  };
  state.accept = async () => { if (await noBlanks(box)) forward(); };
}
// what the item pages send to the Schema: per kind, each found item by its Skynet name with its details, and the empty slots
function partsToSave() {
  if (!state.parts || !state.r) return {};
  const out = {};
  for (const page of PART_PAGES) {
    const p = state.parts[page.kind]; if (!p) continue;
    const items = pageItems(page.kind).map(e => ({ name: e.name, ...p.items[itemKey(e)] }));
    out[page.kind] = { count: items.length + p.extras.length, items, extras: p.extras };
  }
  return out;
}
// ---- The order of the small steps on page 5 (OakBarn Brewery, 2026-11-08): the Interfaces, the IDs, the Tabs, the Widget pages,
// the items on each Interface, the item pages, the Vessels and the summary. Back and Next (Accept) walk them.
function steps() {
  const w = state.r ? widgetPages().length + 1 : 1;
  return [['if'], ['id'], ['tabs'], ...Array.from({ length: w }, (_, i) => ['widgets', i]), ['items'], ...PART_PAGES.map((_, i) => ['parts', i]), ['vessels'], ['sum']];
}
const stepAt = () => steps().findIndex(([s, i]) => s === state.sub5 && (i == null || i === (s === 'parts' ? state.partPage ?? 0 : state.wPage ?? 0)));
// go to a step; when a Label or a Show box changed since the last convert, the names are made again first
function goStep(n) {
  const l = steps(); if (n < 0) return show(4);
  const [s, i] = l[Math.min(l.length - 1, n)];
  if (s === 'parts') state.partPage = i;
  if (s === 'widgets') state.wPage = i;
  const sig = JSON.stringify(picksSent());
  if (sig !== state.sentSig && ['items', 'parts', 'vessels', 'sum'].includes(s)) return convert({ to: s });
  sub5(s);
}
const forward = () => goStep(stepAt() + 1);
// The small steps of Boards and Tabs, at the top of the page, to jump to (OakBarn Brewery, 2026-11-08): any step already reached
const stepName = ([s, i]) => s === 'if' ? 'Interfaces' : s === 'id' ? 'IDs' : s === 'tabs' ? 'Tabs' : s === 'widgets' ? (i ? widgetPages()[i - 1] : 'Widgets')
  : s === 'items' ? 'Items' : s === 'parts' ? PART_PAGES[i].title : s === 'vessels' ? 'Vessels' : 'Summary';
function drawJump5() {
  const nav = $('#jump5'); if (!nav) return;
  if (state.sub5 === 'busy' || !state.r) { nav.innerHTML = ''; return; }
  const at = stepAt(); state.max5 = Math.max(state.max5 ?? 0, at);
  nav.innerHTML = steps().map((st, n) => n === at ? `<b class="now">${esc(stepName(st))}</b>`
    : n <= state.max5 ? `<a href="#" data-n="${n}">${esc(stepName(st))}</a>` : `<span class="muted">${esc(stepName(st))}</span>`).join('');
}
$('#jump5').onclick = e => { const a = e.target.closest('a[data-n]'); if (!a) return; e.preventDefault(); goStep(Number(a.dataset.n)); };
const stepTitle = which => which === 'if' ? 'The Interfaces (boards) we found' : which === 'id' ? 'The ID column: new in Skynet' : which === 'tabs' ? 'Your Tabs (workspaces)'
  : which === 'widgets' ? ((state.wPage ?? 0) ? `Your Widgets: ${widgetPages()[state.wPage - 1]} (${state.wPage} of ${widgetPages().length})` : 'Your Widgets (BruControl Application Elements)')
  : which === 'vessels' ? 'Your vessels' : which === 'items' ? 'The items on each Interface'
  : which === 'parts' ? `Your ${PART_PAGES[state.partPage ?? 0].title} (${(state.partPage ?? 0) + 1} of ${PART_PAGES.length})` : 'Boards and Tabs';
function sub5(which) {
  $('#convBody').oninput = null; $('#convBody').onchange = null;
  state.sub5 = which;
  document.body.classList.toggle('wideStep', ['vessels', 'parts', 'items', 'widgets'].includes(which));      // the wide tables get the whole window
  // the page's own Back and Next walk the small steps; on the ID step Next is Accept
  for (const id of ['#next5', '#next5a']) { $(id).classList.toggle('hidden', which === 'busy'); $(id).textContent = ACCEPTS.includes(which) ? 'Accept ▶' : 'Next ▶'; }
  $('#next5a').classList.toggle('hidden', which === 'busy' || which === 'items');      // the items page: Accept at the bottom, after the Labels
  $('#step5 h1').textContent = stepTitle(which);
  drawJump5(); pageTools();
  if (which === 'busy') return;
  saveProgress();
  const r = state.r, box = $('#convBody');
  if (which === 'if') {
    // the Import box (OakBarn Brewery, 2026-11-08): an Interface with items starts ticked, an empty one unticked; any can be changed.
    // The Interfaces are all settled here, at the start (the summary no longer asks about them).
    state.keepIfs ??= new Set(r.interfaces.filter(d => d.items).map(d => d.name));
    box.innerHTML = `<div class="card"><p>These are the Interfaces (boards) in your BruControl config file. An Interface with items starts
      <b>ticked</b> to import; an empty one starts unticked. You can tick or untick any of them: an unticked Interface is not imported,
      with its items. The <b>ID</b> column is new in Skynet and is explained on the next page.</p>
      <table class="ifTable"><tr><th>Interface</th><th>ID</th><th>Items</th><th>Interface Type</th><th>Interface Connection</th><th>Enabled</th><th>Import</th></tr>
      ${r.interfaces.map(d => row([esc(d.name), `<span class="greyId">${esc(d.id)}</span>`, d.items, esc(d.typeName || ''), esc(d.connection || ''), d.enabled ? '✓' : '✗',
        `<input type="checkbox" class="keepIf" data-name="${esc(d.name)}"${state.keepIfs.has(d.name) ? ' checked' : ''} title="Ticked: this Interface (board) is imported with its items. Unticked: it is left out." aria-label="Import ${esc(d.name)}">`], ['', '', 'n', '', '', 'c', 'c'])).join('')}</table></div>`;
    box.onchange = e => { if (e.target.classList.contains('keepIf')) { if (e.target.checked) state.keepIfs.add(e.target.dataset.name); else state.keepIfs.delete(e.target.dataset.name); saveProgress(); } };
    return;
  }
  if (which === 'id') {
    const ex = r.renames.find(x => /_\d+_/.test(x.to))?.to || 'MP_45_DO_M~HLT~Pump_MD';
    box.innerHTML = `<div class="cards two"><div class="card"><table class="ifTable"><tr><th>Interface</th><th>ID</th></tr>
      ${r.interfaces.filter(d => ifOn(d.name)).map(d => row([esc(d.name), `<input class="ifId" data-name="${esc(d.name)}" value="${esc(d.id)}" maxlength="4" size="5" spellcheck="false" title="Up to 4 letters (A to Z); 2 is best" aria-label="ID for ${esc(d.name)}">`])).join('')}</table>
      <p class="small" id="idNote"></p></div>
      <div class="card idHelp"><p><b>The ID column is something new in Skynet.</b> Skynet gives every Interface (board) a short <b>ID</b> of up to
        four letters. The ID becomes the first part of the <b>suggested Skynet name</b> of every Device on that board, so you can tell at a
        glance which board a Device is wired to.</p>
        <p>The suggested Skynet name is always unique, and it is built from five parts, with one <code>_</code> between them:</p>
        <ol><li><b>Interface ID</b>: the board, for example <code>MP</code> for Main Panel.</li>
          <li><b>Port</b>: the pin it is wired to, for example <code>45</code> or <code>A0</code>.</li>
          <li><b>Type ID</b>: what kind of Device it is, for example <code>DO</code> (a digital output), <code>HE</code> (a Heating Element), <code>10KNTC</code> (a probe).</li>
          <li><b>Label</b>: your own name for it, the BruControl DisplayName. A space becomes <code>~</code>, so <i>Mash Tun</i> is <code>Mash~Tun</code>.</li>
          <li><b>Tab ID</b>: the two letters of the Tab (old Workspace) it is on.</li></ol>
        <p>For example <code>${esc(ex)}</code>. Because of the <b>One Port, One Device</b> Rule, two suggested names can never come out the same.</p>
        <p><b>The Importer chose these IDs for you.</b> You may change them: up to 4 letters, but <b>2 are preferred</b>, because a short ID keeps every
        name short. Each ID must be different. Accept them, or change them and then Accept, before going on. After this, an ID is best left as it is,
        because it is part of every Device name on that board.</p></div></div>
`;
    const check = () => {
      const vals = [...box.querySelectorAll('.ifId')].map(i => i.value.trim().toUpperCase());
      const bad = vals.some(v => !/^[A-Z]{1,4}$/.test(v)), dup = new Set(vals).size !== vals.length, long = vals.some(v => v.length > 2);
      $('#idNote').innerHTML = bad ? '<span class="note">Use 1 to 4 letters (A to Z), no numbers or spaces.</span>' : dup ? '<span class="note">Each ID must be different.</span>'
        : long ? 'An ID longer than 2 letters is allowed; 2 letters keep the names shorter.' : '';
      for (const id of ['#next5', '#next5a']) $(id).disabled = bad || dup;
    };
    box.oninput = e => { if (e.target.classList.contains('ifId')) { e.target.value = e.target.value.toUpperCase(); check(); } };
    check();
    state.accept = () => {
      const ids = {}; let changed = false;
      for (const i of box.querySelectorAll('.ifId')) { const v = i.value.trim().toUpperCase(); ids[i.dataset.name] = v; if (v !== r.interfaces.find(d => d.name === i.dataset.name)?.id) changed = true; }
      if (changed) { state.ids = ids; convert({ to: 'tabs' }); } else sub5('tabs');
    };
    return;
  }
  if (which === 'tabs') {
    box.innerHTML = tabsHtml(r);
    box.onchange = () => { state.keepTabs = new Set([...box.querySelectorAll('.keepTab:checked')].map(c => c.dataset.name)); saveProgress(); };
    state.accept = () => { state.keepTabs = new Set([...box.querySelectorAll('.keepTab:checked')].map(c => c.dataset.name)); state.wPage = 0; forward(); };
    return;
  }
  if (which === 'items') {
    box.innerHTML = itemsHtml(r);
    state.itemPicks ??= {};
    box.oninput = box.onchange = pickInput;
    // Accept: no Label may be blank (on the Tabs being imported); then the names are made again with the Labels
    state.accept = async () => { if (await noBlanks(box)) forward(); };
    return;
  }
  if (which === 'widgets') { widgetsPage(box); return; }
  if (which === 'parts') { partsPage(box); return; }
  if (which === 'vessels') {
    box.innerHTML = vesselsHtml();
    box.onchange = e => {
      const t = e.target; if (!t.classList.contains('vd')) return;
      const v = state.connect.parts.vessels.find(x => x.key === t.dataset.v); if (!v) return;
      state.connect.vv = (state.connect.vv ?? 0) + 1;          // the Connect page picks up the change
      if (t.dataset.k === 'name') { v.name = t.value.trim() || v.name; return; }
      if (t.dataset.k === 'side') { v.side = t.value === 'cold' ? 'cold' : 'hot'; return; }
      const val = t.type === 'checkbox' ? (t.checked ? 'yes' : 'no') : t.dataset.k === 'probe' ? (state.connect.probes ?? []).find(x => x.id === t.value) ?? null
        : t.dataset.k === 'heater' ? (state.connect.heaters ?? []).find(x => x.id === t.value) ?? null : t.value;
      v.details = { ...(v.details ?? {}), [t.dataset.k]: val };
    };
    box.onclick = e => {
      const vs = state.connect.parts.vessels;
      const vb = e.target.closest('.vBuild');
      if (vb) { buildVessel(vs.find(v => v.key === vb.dataset.v), vb); return; }
      if (e.target.closest('#vAdd')) {
        let n = vs.length + 1; while (vs.some(v => v.key === 'V' + n)) n++;
        vs.push({ key: 'V' + n, name: 'Vessel ' + n, side: 'hot', details: { outlet: 'bottom', sparge: 'none', tangential: 'no', herms: 'none', manualValve: 'none', motorValve: '', heater: null, probe: null, found: {} } });
      } else if (e.target.closest('.vDel')) {
        const i = vs.findIndex(v => v.key === e.target.closest('.vDel').dataset.v); if (i >= 0) vs.splice(i, 1);
      } else return;
      state.connect.vv = (state.connect.vv ?? 0) + 1;
      box.innerHTML = vesselsHtml();
    };
    state.accept = () => { box.onchange = null; box.onclick = null; forward(); };
    return;
  }
  for (const id of ['#next5', '#next5a']) $(id).disabled = false;
  {
    box.innerHTML = `<div class="card"><p>Import Copy: <code>${esc(r.copy)}</code></p>
        <p>Names: <b>${r.names === 'bru' ? 'your BruControl names (kept after two warnings)' : 'Skynet names'}</b>.
        <b>${r.items}</b> items on a board port come in. <b>${r.placeholders}</b> other items are a <b>Placeholder</b> on their Tab, where
        BruControl had them, until the next steps bring them in. Tab backgrounds are left out for now.</p>
        ${r.charts ? `<p><b>${r.charts}</b> BruControl Chart(s) are now Skynet <b>Graph Widgets</b>, with the same span, refresh, grid lines, colors and channels.</p>` : ''}</div>
      <div class="cards two"><div><h3>Interfaces (boards)</h3><table><tr><th>Interface</th><th>ID</th><th>Items</th><th>Import</th></tr>
        ${r.interfaces.map(d => row([esc(d.name), esc(d.id), d.items, state.keepIfs?.has(d.name) ? '✓' : '✗'], ['', '', 'n', 'c'])).join('')}</table>
        <p class="small">✓ is imported, ✗ is left out: you chose this on the first step (The Interfaces we found).</p></div>
      <div><h3>Placeholders</h3><table><tr><th>BruControl kind</th><th>How many</th></tr>
        ${Object.entries(r.byKind).map(([k, n]) => row([esc(k), n], ['', 'n'])).join('') || row(['(none)', ''])}</table></div></div>
      ${r.globals?.length ? `<div class="card"><h3>Your BruControl Globals (${r.globals.length}): listed only</h3><p class="small">Globals will be dealt
        with in a later step. For now they are only listed here: they are not imported and nothing is asked about them.</p>
        <details><summary>Show the list</summary><table><tr><th>Global</th><th>Tab</th></tr>${r.globals.map(g => row([esc(g.name), esc(g.tab)])).join('')}</table></details></div>` : ''}
      ${r.look ? `<p>Look (theme): <b>Skynet ${esc(r.look.name)}</b> was chosen as it most closely matched ${r.look.bru ? `the <b>${esc(r.look.bru)}</b> theme set in BruControl` : 'BruControl\'s own Office 2019 theme (your BruControl theme was not found)'}.
        BruControl themes do not work in browsers, so Skynet has its own small set of Skynet Themes. You can also build your own User Theme
        in Skynet if none of ours do what you want. A new Skynet Theme for a Tab (old Workspace) can be chosen at any time, and that screen
        will use that theme.</p>` : ''}
      <p>Tabs: <b>${r.tabs.filter(t => state.keepTabs?.has(t.name)).length}</b> of ${r.tabs.length} are imported (picked on the Tabs step).</p>
      ${r.media.pictures + r.media.sounds ? `<h3>Pictures and Sounds</h3><p><b>${r.media.pictures}</b> pictures and <b>${r.media.sounds}</b> sounds are imported by their path.
        ${r.media.copy ? 'They were <b>copied</b> to <code>media\\Images\\User</code> and <code>media\\sounds\\User</code>; the originals stay where they were.'
          : 'The files stay where they were, so BruControl keeps working.'}${r.media.missing.length ? ` <b>${r.media.missing.length}</b> are not on this computer; their path is kept.` : ''}</p>
        ${r.media.missing.length ? `<details><summary>Not on this computer (${r.media.missing.length})</summary><table><tr><th>Kind</th><th>Path</th></tr>
        ${r.media.missing.map(x => row([x.kind === 'sound' ? 'Sound' : 'Picture', esc(x.from)])).join('')}</table></details>` : ''}` : ''}
      ${r.renames.length ? `<details><summary>New names (${r.renames.length})</summary><table><tr><th>BruControl</th><th>Skynet</th></tr>
        ${r.renames.map(x => row([esc(x.from), esc(x.to)])).join('')}</table></details>` : ''}
      ${r.warnings.length ? `<h3>Notes for the report</h3><ul>${r.warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}`;
  }
}
// Next with answers kept from last time never wipes them out by itself (OakBarn Brewery, 2026-11-08: "insure that a fresh Start does not
// wipe out the ... saved data"): it asks whether to carry on, and starting again asks once more before the kept answers are cleared
for (const id of ['#next4', '#next4a']) $(id).onclick = async () => {
  if (state.resume) {
    if (await ask('Carry on where you left off?', '<p>Your answers for this file were kept from last time. Carry on with them, or start again from the first guesses?</p>', '▶ Carry on', 'Start again')) return convert({ restore: state.resume });
    if (!await ask('Start again?', '<p>Your answers kept for this file are cleared, and the Import starts again from its first guesses.</p>', 'Yes, start again', 'No, keep them')) return;
    state.resume = null; $('#resume').classList.add('hidden');
    await api('POST', '/api/progress', { file: state.sel, clear: true }).catch(e => toast(e.message));
  }
  convert();
};
const ACCEPTS = ['id', 'tabs', 'widgets', 'items', 'parts', 'vessels'];
for (const id of ['#back5', '#back5a']) $(id).onclick = () => state.sub5 === 'if' || state.sub5 === 'busy' ? show(4) : goStep(stepAt() - 1);
for (const id of ['#next5', '#next5a']) $(id).onclick = () => {
  if (state.sub5 === 'if') return forward();
  if (ACCEPTS.includes(state.sub5)) return state.accept();
  if (!state.converted) return toast('The config file is not converted yet. Go back to Names and click Next.');
  startConnect(state.connect, { toast, saved: state.savedConnect }); state.buildPage = state.savedConnect ? state.buildPage ?? 0 : 0; state.savedConnect = null; drawBuildPages();
  show(6);
};
for (const id of ['#back6', '#back6a']) $(id).onclick = () => show(5);
for (const id of ['#next6', '#next6a']) $(id).onclick = () => {
  const f = state.files.find(x => x.path === state.sel);
  $('#schemaName').value = (f?.base || f?.name || 'Imported_Schema').replace(/\.(brucfg|config)$/i, '').replace(/\s+/g, '_');
  $('#importDir').textContent = state.start?.importFolder ?? '';
  $('#saveResult').classList.add('hidden');
  show(8);
};
for (const id of ['#back8', '#back8a']) $(id).onclick = () => show(6);
// the Vessels step answers ride with each vessel (by its key) into the Schema file
function withDetails(c) {
  if (!c) return c;
  const d = new Map((state.connect?.parts?.vessels ?? []).map(v => [v.key, v.details]));
  return { ...c, vessels: c.vessels.map(v => (d.get(v.key) ? { ...v, details: d.get(v.key) } : v)) };
}
$('#saveBtn').onclick = async () => {
  const b = $('#saveBtn'); b.disabled = true; b.textContent = 'Saving…';
  try {
    const r = await api('POST', '/api/save', { file: state.sel, name: $('#schemaName').value, connect: withDetails(connectState()),
      keepIfs: [...(state.keepIfs ?? new Set(state.r.interfaces.filter(d => d.items).map(d => d.name)))],
      keepTabs: [...(state.keepTabs ?? [])], tabsPicked: !!state.keepTabs, parts: partsToSave() });
    const box = $('#saveResult');
    box.innerHTML = `<p>✅ Saved <b>${esc(r.file)}</b> in <code>${esc(r.folder)}</code>.</p>
      <p>${r.interfaces} Interfaces, ${r.tabs} Tabs, ${r.items} items on a board port, ${r.placeholders} Placeholders${r.warnings ? `, ${r.warnings} notes for the report` : ''}.</p>
      <p>Connect your brewery: ${r.links} connection(s) kept${r.loose ? `, ${r.loose} pump(s) or valve(s) not joined yet` : ''}. The pipes and hoses are drawn when the Vessels are built (a later Import step).</p>
      <p>Next: in the Skynet Panel, open <b>Schema.json</b> and click <b>Open a Schema file</b>.</p>
      ${state.start?.windows ? '<button id="openDir">📂 Open the Import folder</button>' : ''}`;
    box.classList.remove('hidden');
    const o = $('#openDir'); if (o) o.onclick = () => api('POST', '/api/open-import').catch(e => toast(e.message));
  } catch (e) { toast(e.message); }
  finally { b.disabled = false; b.textContent = '💾 Save the Schema'; }
};
$('#closeBtn').onclick = async () => {
  if (!confirm('Close the Importer? Nothing has been changed.')) return;
  try { await api('POST', '/api/close'); } catch { /* it is closing */ }
  document.body.innerHTML = '<main><h1>The Importer is closed.</h1><p>You can close this window.</p></main>';
};
// ---- Clear Page and Restart Fresh, at the top of every page (OakBarn Brewery, 2026-11-09: "At the Top of the Every Page in the Importer
// Program a Clear Page that will reset all the answers on that page only and a Restart Fresh that will take you back to the Intro Page
// and clear all data. A second Chance with both before doing it."). Each asks first; No changes nothing.
const NOTHING = 'There are no answers on this page to clear';
function pageClearable() {
  const n = state.page;
  if (n === 3) return !!state.sel;
  if (n === 4 || n === 8) return true;
  if (n === 5) return !!state.r && !['busy', 'sum'].includes(state.sub5);
  if (n === 6) return !!state.connect;
  return false;
}
function pageTools() {
  const b = $('#clearPage'); if (!b) return;
  b.disabled = !pageClearable();
  b.title = b.disabled ? NOTHING : 'Puts every answer on this page back to how it started. The other pages keep theirs.';
}
// the items and Widgets shown on this step, by their key (their Label, tick and Show are answers on this page)
function keysOnStep() {
  const s = state.sub5, r = state.r;
  if (s === 'items') return (r.portItems ?? []).filter(e => ifOn(e.device)).map(itemKey);
  if (s === 'widgets') { const page = widgetPages()[(state.wPage ?? 1) - 1]; return (r.appItems ?? []).filter(e => e.page === page).map(itemKey); }
  if (s === 'parts') return pageItems(PART_PAGES[state.partPage ?? 0].kind).map(itemKey);
  return [];
}
async function clearPage() {
  if (!pageClearable()) return;
  const title = state.page === 5 ? stepTitle(state.sub5) : document.querySelector(`#steps li[data-step="${state.page}"]`)?.textContent ?? 'this page';
  if (!await ask('Clear this page?', `<p>Every answer on <b>${esc(title)}</b> goes back to how it started. The answers on the other pages are kept.</p>`, 'Yes, clear this page', 'No, keep my answers')) return;
  const n = state.page;
  if (n === 3) { state.sel = ''; $('#peek').classList.add('hidden'); for (const tr of document.querySelectorAll('#files tbody tr[data-i]')) { tr.classList.remove('sel'); tr.querySelector('input').checked = false; } setNext(); }
  if (n === 4) {
    for (const r of document.querySelectorAll('input[name=units]')) r.checked = r.value === state.unitsGuess;
    for (const r of document.querySelectorAll('input[name=names]')) r.checked = r.value === 'skynet';
  }
  if (n === 8) { const f = state.files.find(x => x.path === state.sel); $('#schemaName').value = (f?.base || f?.name || 'Imported_Schema').replace(/\.(brucfg|config)$/i, '').replace(/\s+/g, '_'); }
  if (n === 6) { resetConnect(state.connect, { toast }); state.buildPage = 0; drawBuildPages(); }
  if (n === 5) {
    const s = state.sub5;
    for (const k of keysOnStep()) delete state.itemPicks?.[k];
    if (s === 'if') state.keepIfs = null;
    if (s === 'tabs') state.keepTabs = null;
    if (s === 'parts') {
      const kind = PART_PAGES[state.partPage ?? 0].kind;
      delete state.parts?.[kind];
      for (const [k, v] of Object.entries(state.kindOf ?? {})) if (v === kind) delete state.kindOf[k];      // moved here with Belongs on: back to its own page
    }
    if (s === 'vessels' && state.connect?.parts) { state.connect.parts.vessels = structuredClone(state.firstVessels ?? []); state.connect.vv = (state.connect.vv ?? 0) + 1; }
    if (s === 'id' && state.ids) { state.ids = null; saveProgress(); return convert({ to: 'id' }); }
    sub5(s);
  }
  saveProgress();
  toast('This page is cleared.');
}
async function restartFresh() {
  if (!await ask('Restart Fresh?', '<p>Every answer you gave for this config file, on every page, is cleared, and you go back to the first page (Welcome). Your BruControl config file, the answers kept for your other config files and any Schema you saved are not touched.</p>', 'Yes, restart fresh', 'No, keep my answers')) return;
  clearTimeout(saveTimer);
  // only the config file being worked on (OakBarn Brewery, 2026-11-09: "Clear and Start Fresh, Only on the one you are working On")
  if (state.sel) await api('POST', '/api/progress', { file: state.sel, clear: true }).catch(e => toast(e.message));
  Object.assign(state, { sel: '', resume: null, r: null, connect: null, converted: false, keepIfs: null, keepTabs: null, ids: null, itemPicks: null, parts: null, kindOf: null,
    partPage: 0, wPage: 0, max5: 0, sub5: null, savedConnect: null, sentSig: null, buildPage: 0, reached: 1, firstVessels: null });
  resetConnect(null);
  $('#resume').classList.add('hidden'); $('#peek').classList.add('hidden'); $('#saveResult').classList.add('hidden');
  for (const r of document.querySelectorAll('input[name=names]')) r.checked = r.value === 'skynet';
  $('#convBody').innerHTML = '';
  show(1);
  toast('Every answer is cleared. The Import starts fresh.');
}
$('#clearPage').onclick = clearPage;
$('#restartFresh').onclick = restartFresh;
init();

// The Build Tab pages (OakBarn Brewery, 2026-11-08: "Build Page is actually a Build Tab Page. So we would need to build for every
// Workspace (Tab), in order as they are in BruControl ... Only ones that are Ticked to Import"; "a good explanation ... about the choices
// on a Build Tab first for the user to read and then a Popup that shows Hover Help. Also about Adding the Manual things into a
// Manifold"). One page per ticked Tab, in BruControl order; each opens the Panel's Build Tab on that Tab.
const buildTabs = () => { const keep = state.keepTabs; return (state.r?.tabs ?? []).filter(t => !keep || keep.has(t.name)); };
function drawBuildPages() {
  const tabs = buildTabs(), box = $('#buildPages'); if (!box) return;
  if (!tabs.length) { box.innerHTML = '<p class="small muted">No Tabs are ticked to import, so there is nothing to build.</p>'; return; }
  state.buildPage = Math.min(state.buildPage ?? 0, tabs.length - 1);
  const t = tabs[state.buildPage];
  box.innerHTML = `<div class="cnPager"><button id="bpPrev"${state.buildPage ? '' : ' disabled'}>◀ Previous Tab</button>
      <b>Build Tab page ${state.buildPage + 1} of ${tabs.length}: ${esc(t.name)} (${esc(t.id)})</b>
      <button id="bpNext"${state.buildPage < tabs.length - 1 ? '' : ' disabled'}>Next Tab ▶</button></div>
    <h3>Before you build: the choices on a Build Tab</h3>
    <p>Press the yellow <b>Edit layout</b> button (next to Menu) to see them. The top row <b>adds things</b>: <b>Add Device</b> and its
      shortcuts (<b>Pumps</b>, <b>Valves</b>, <b>Probe</b>, <b>Heating Element</b>, <b>PWM</b>) for things wired to a board, a <b>Vessel</b>,
      a <b>Clone</b> of a Device on another Tab, and <b>Add Widget</b>, <b>Picture</b>, <b>Text</b>, <b>Manual Valve</b>, <b>Value</b>,
      <b>Time</b> and more for things on the screen only. The second row <b>joins and arranges</b>: <b>Draw pipe</b>, <b>Draw hose</b>,
      <b>Draw QD hose</b>, <b>Elbows, Tees ...</b>, <b>Add equipment</b> (chillers, coils, RIMS tube), <b>Put back</b>, <b>Lock</b>, and
      <b>Tab settings</b>. A new thing is made on the 🔨 <b>Build Tab</b> first; <b>Save Build</b> puts it on this Tab. <b>Save layout</b>
      keeps your work. Double-click anything for its Properties.</p>
    <p><button id="bpHover">❓ Show every Build Tab choice and its hover help</button></p>
    <h3>Build your manifold as it really is</h3>
    <p>BruControl only had the parts wired to a board. <b>You can (and should) build your manifold the way it is in your brewery</b>,
      and add the parts you turn or move by hand:</p>
    <ul><li><b>Manual valves</b>: <b>Manual Valve ➕</b> (a ball or butterfly valve you turn by hand).</li>
      <li><b>Tees and elbows</b>: <b>Elbows, Tees ...</b>, then join them with <b>Draw pipe</b> or <b>Draw hose</b>.</li>
      <li><b>Quick Disconnect hoses</b>: <b>Draw QD hose</b>; the free end is moved to a vessel or another QD.</li>
      <li><b>Manual pumps</b> and other things done by hand: these become <b>Confirmation Widgets</b> (Skynet Rule 1.28, Help 162): Skynet
        asks you to do it by hand and confirm. They are coming in the Panel; for now add the pump with <b>Pumps</b> and leave its board
        port empty.</li></ul>
    <p class="small muted">Your Vessels and the items on this Tab will be placed for you once the Vessel Templates are built (the Vessel
      Device Builder, the next Importer step). For now this Tab shows its items where they were in BruControl.</p>
    <p><button class="primary" id="openBuild">🔨 Open the Build Tab for ${esc(t.name)}</button> <span id="buildNote" class="small muted"></span></p>`;
  $('#bpPrev').onclick = () => { state.buildPage--; drawBuildPages(); };
  $('#bpNext').onclick = () => { state.buildPage++; drawBuildPages(); };
  $('#bpHover').onclick = async () => {
    let list = []; try { list = await api('GET', '/api/build/buttons'); } catch { /* shown empty */ }
    tell('The Build Tab choices', `<p class="small">This is the hover help each one shows in the Panel (rest the mouse on it).</p>
      <table class="hoverList">${list.map(x => `<tr><th>${esc(x.label)}</th><td>${esc(x.help)}</td></tr>`).join('')}</table>`);
  };
  $('#openBuild').onclick = async () => {
    const b = $('#openBuild'); b.disabled = true; $('#buildNote').textContent = 'Starting the Build Tab…';
    try {
      const r = await api('POST', '/api/build/open', { keepTabs: [...(state.keepTabs ?? [])], tabsPicked: !!state.keepTabs });
      const w = window.open(`${r.url}&tab=${encodeURIComponent(t.name)}`, 'skynetBuild');
      $('#buildNote').textContent = w ? 'Open in its own window. Close it when you are done; your work is kept.' : 'Your browser blocked the window: allow pop-ups for the Importer, then click again.';
    } catch (e) { $('#buildNote').textContent = e.message; } finally { b.disabled = false; }
  };
}

// hover help on every bold word in the list (OakBarn Brewery, 2026-11-08: "Hover Help on Bold"), now and on every page drawn later
glossBold(document.body);
new MutationObserver(list => { for (const m of list) for (const n of m.addedNodes) if (n.nodeType === 1) glossBold(n.parentElement ?? n); })
  .observe(document.body, { childList: true, subtree: true });
// the example name on the differences page: made up until a config file is converted, then one of your own Heating Elements
// (an HLT one first) (OakBarn Brewery, 2026-11-08: "pull the Element names of the associated HLT items if they were available")
function exampleName() {
  const items = state.r?.portItems ?? [], hlt = e => /(^|[^a-z])hlt([^a-z]|$)/i.test(`${e.bru} ${e.label}`);
  const heaters = items.filter(e => e.kind === 'heater' || e.subtype === 'element');
  const e = heaters.find(hlt) ?? heaters[0];
  const ifc = e ? state.r.interfaces.find(d => d.name === e.device)?.id : '';
  const tab = e ? state.r.tabs.find(t => t.name === e.tab)?.id : '';
  const parts = e && e.name.split('_');
  const x = parts && parts.length >= 5 ? { name: e.name, ifc: ifc || parts[0], port: parts[1], label: parts.slice(3, -1).join(' ').replace(/~/g, ' '), tab: tab || parts.at(-1) }
    : { name: 'MB_42_DO@HE_HLT~Heat_BH', ifc: 'MB', port: '42', label: 'HLT Heat', tab: 'BH' };
  for (const n of document.querySelectorAll('.exName')) { n.textContent = n.dataset.ex === 'method' ? x.name + '.PID' : x.name; n.dataset.help = GLOSSARY['suggested skynet names']; n.classList.add('gloss'); }
  const put = (sel, v, help) => { for (const n of document.querySelectorAll(sel)) { n.textContent = v; n.dataset.help = help; n.classList.add('gloss'); } };
  put('.exIf', x.ifc, `${x.ifc}: the ID of the Interface (board) this Device is on (the first part of its name).`);
  put('.exPort', x.port, `${x.port}: the Port (Pin) on that Interface (the second part of its name).`);
  put('.exLabel', x.label, `${x.label}: its Label (BruControl DisplayName), the fourth part of its name, with ~ for each space.`);
  put('.exTab', x.tab, `${x.tab}: the ID of the Tab (BruControl Workspace) it is on (the last part of its name).`);
}
exampleName();

// A box or dropdown never shows hover help over itself (Rule 2.38, OakBarn Brewery, 2026-11-08: "The Hover Help for Connection covers
// the DDLB so no Choice can be made"), so a table column whose heading has no help of its own takes the help of the boxes under it
function headHelp(root) {
  for (const table of root.querySelectorAll('table')) {
    const heads = table.querySelector('tr')?.children ?? [];
    [...heads].forEach((th, n) => {
      if (th.tagName !== 'TH' || th.title) return;
      for (const tr of [...table.querySelectorAll('tr')].slice(1)) {
        const f = tr.children[n]?.querySelector('select[title], input[title]:not([type=checkbox])');
        if (f) { th.title = f.title.replace(/: tick it.*$/, ''); break; }
      }
    });
  }
}
new MutationObserver(() => headHelp($('#convBody'))).observe($('#convBody'), { childList: true, subtree: true });
