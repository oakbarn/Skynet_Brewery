// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Skynet BruControl Importer, in the window (Rule 15.4): 1 Welcome, 2 BruControl and Skynet, 3 pick the config file, 4 Names,
// 5 Boards and Tabs (the Import Copy is converted), 6 Connect your brewery (public/importer/connectpage.js), 8 Save the Schema.
import { startConnect, connectState } from './connectpage.js';
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
  document.body.classList.remove('wideStep');
  for (const s of document.querySelectorAll('.step')) s.classList.toggle('hidden', s.id !== 'step' + n);
  for (const li of document.querySelectorAll('#steps li')) {
    const k = Number(li.dataset.step);
    li.classList.toggle('now', k === n); li.classList.toggle('done', k < n);
  }
  window.scrollTo(0, 0);
}

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
    state.converted = false;
    $('#chosen').textContent = state.files.find(f => f.path === state.sel)?.name ?? state.sel;
    // Units (OakBarn Brewery, 2026-11-08): asked at the start; when BruControl's probes show what it used, the question confirms it
    $('#unitsNote').textContent = '';
    try {
      const u = (await api('GET', '/api/peek?file=' + encodeURIComponent(state.sel))).units ?? {};
      if (u.guess) document.querySelector(`input[name=units][value=${u.guess}]`).checked = true;
      $('#unitsNote').textContent = u.guess ? `Your BruControl probes use ${u.guess === 'US' ? '°F (Fahrenheit)' : '°C (Celsius)'}, so ${u.guess} is picked. Please confirm it, or change it.`
        : 'Your BruControl file does not say which units it used. Please pick one.';
    } catch { /* the question still stands */ }
    show(4);
  } catch (e) { toast(e.message); }
}

async function init() {
  try {
    state.start = await api('GET', '/api/start');
    $('#ver').textContent = state.start.version ? 'Panel version ' + state.start.version : '';
    state.sel = state.start.file || '';
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
    $('#askYes').textContent = yes; $('#askNo').textContent = no;
    $('#askYes').onclick = () => d.close('yes'); $('#askNo').onclick = () => d.close('no');
    d.onclose = () => ok(d.returnValue === 'yes');
    d.returnValue = ''; d.showModal(); $('#askNo').focus();
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
async function convert(ids = null) {
  const names = ids ? state.names : await namesChoice();
  state.names = names;
  if (!ids) state.keepTabs = null;
  show(5);
  const box = $('#convBody'); box.innerHTML = '<p class="muted">Making the Import Copy and converting it…</p>';
  sub5('busy');
  try {
    state.units = document.querySelector('input[name=units]:checked')?.value === 'Metric' ? 'Metric' : 'US';
    const r = await api('POST', '/api/convert', { file: state.sel, names, units: state.units, copyMedia: true, ...(ids ? { ids } : {}) });
    state.converted = true;
    state.connect = r.connect;
    state.r = r;
    sub5(ids ? 'tabs' : 'if');
  } catch (e) { state.converted = false; box.innerHTML = `<p class="note">${esc(e.message)}</p>`; }
}
// The Tabs step (OakBarn Brewery, 2026-11-08: "Layout the Tab ... different Place Holder type ... a Check box and accept Button"): one row
// per Tab with its Items and a column for each kind of Placeholder found (Timers, Globals ...), and an Import box. A Tab with items is
// always imported (its box is ticked and cannot be cleared); an empty one is imported only when ticked. Accept goes on.
const KIND_NAMES = { Timer: 'Timers', GlobalVariable: 'Globals', Alarm: 'Alarms', Label: 'Labels', Image: 'Pictures', Picture: 'Pictures', Chart: 'Charts',
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
        ['', '', 'n', ...kinds.map(() => 'n'), 'c'])
      + (t.globalsOnly && !t.always ? `<tr class="ask"><td colspan="${kinds.length + 4}"><p class="small">Every Placeholder on <b>${esc(t.name)}</b> is a BruControl Global.
            <b>Are these Globals used to import a Beer.xml recipe (for example with Node-RED)?</b> Skynet imports a Beer.xml or BeerSmith file
            with no Globals, so then leave this Tab unticked: the Tab and those Globals are not imported. If they are used for something else
            (for example sending readings to the Database), tick it: they are imported and dealt with when the Globals are imported.</p>
            <button type="button" class="askNo" data-name="${esc(t.name)}">Yes, a recipe import: leave it out</button>
            <button type="button" class="askYes" data-name="${esc(t.name)}">No, something else: import it</button></td></tr>` : '')).join('')}</table></div>`;
}
// The Vessels step (OakBarn Brewery, 2026-11-08): each vessel found, with what the import could tell about it in columns, and a Manual
// Valves column the import cannot know (None to start). The answers go with the vessel into the Schema file.
const SPARGE = [['none', 'None'], ['left', 'Upper Left'], ['right', 'Upper Right']];
const OUTLET = [['none', 'None'], ['low', 'Center Low'], ['bottom', 'Bottom Drain']];
const MANUAL = [['none', 'None'], ['ball', 'Manual Ball Valve'], ['butterfly', 'Manual Butterfly Valve']];
function vesselsHtml() {
  const vs = state.connect?.parts?.vessels ?? [];
  if (!vs.length) return '<div class="card"><p>No vessels were found in your names or Scripts. You can add them on the Connect your brewery page.</p></div>';
  const yn = (v, k) => `<select class="vd" data-v="${esc(v.key)}" data-k="${k}" title="${v.details?.found?.[k] ? 'Found in your names or Scripts (a guess): change it if it is wrong' : 'Not found in your names or Scripts: change it if your vessel has one'}">
    <option value="no"${v.details?.[k] !== 'yes' ? ' selected' : ''}>No</option><option value="yes"${v.details?.[k] === 'yes' ? ' selected' : ''}>Yes${v.details?.found?.[k] ? ' (found)' : ''}</option></select>`;
  return `<div class="card"><p>These are the vessels the Importer found in your BruControl names and Scripts, with what it could tell about each one.
      Type each vessel's <b>Volume</b>, and measure its <b>Height</b> and <b>Diameter</b> (in ${state.units === 'Metric' ? 'Liters and centimeters' : 'Gallons and inches'}).
      Everything is shown by its <b>BruControl name</b> for now. <b>(found)</b> means a name or a Script points to it; it is a guess, so change anything that is wrong. <b>Manual valves</b> are not in
      BruControl at all (nothing controls them), so pick the kind on each vessel, or leave it at None. Then <b>Accept</b>.</p>
    <div class="vesWrap"><table class="vesTable"><tr><th>Vessel</th><th>Side</th><th>Volume (${state.units === 'Metric' ? 'L' : 'gal'})</th><th>Height (${state.units === 'Metric' ? 'cm' : 'in'})</th><th>Diameter (${state.units === 'Metric' ? 'cm' : 'in'})</th><th>Heater</th><th>Thermowell with Probe</th><th>Outlet</th><th>Tangential Inlet</th><th>Sparge Arm / Steam Slayer</th><th>HERMS Coil</th><th>Motorized Ball Valve</th><th>Manual Valves</th></tr>
    ${vs.map(v => row([`<b>${esc(v.name)}</b>`, v.side === 'cold' ? 'Cold Side' : 'Hot Side',
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
      // HERMS Coil: a tick box, unticked to start (OakBarn Brewery, 2026-11-08)
      `<input type="checkbox" class="vd" data-v="${esc(v.key)}" data-k="herms"${v.details?.herms === 'yes' ? ' checked' : ''} title="Tick it if this vessel has a HERMS coil inside${v.details?.found?.herms ? ' (a Script mentions HERMS)' : ''}" aria-label="${esc(v.name)} has a HERMS coil">${v.details?.found?.herms ? ' <span class="small muted">in a Script</span>' : ''}`,
      `<select class="vd" data-v="${esc(v.key)}" data-k="motorValve" title="The motorized ball valve on this vessel, from every motorized valve found${v.details?.found?.motorValve ? ' (the guess is the one named for this vessel)' : ''}"><option value="">None</option>${(state.connect?.parts?.valves ?? []).map(x => `<option value="${esc(x.id)}"${v.details?.motorValve === x.id ? ' selected' : ''}>${esc(x.label)}${v.details?.motorValve === x.id && v.details?.found?.motorValve ? ' (found)' : ''}</option>`).join('')}</select>`,
      `<select class="vd" data-v="${esc(v.key)}" data-k="manualValve" title="Manual valves are not in BruControl: pick the kind this vessel has">${MANUAL.map(([k, n]) => `<option value="${k}"${(v.details?.manualValve || 'none') === k ? ' selected' : ''}>${n}</option>`).join('')}</select>`])).join('')}</table></div></div>`;
}
function sub5(which) {
  state.sub5 = which;
  document.body.classList.toggle('wideStep', which === 'vessels');      // the wide Vessels table gets the whole window
  // the page's own Back and Next walk the small steps; on the ID step Next is Accept
  for (const id of ['#next5', '#next5a']) { $(id).classList.toggle('hidden', which === 'busy'); $(id).textContent = ['id', 'tabs', 'vessels'].includes(which) ? 'Accept ▶' : 'Next ▶'; }
  $('#step5 h1').textContent = which === 'if' ? 'The Interfaces (boards) we found' : which === 'id' ? 'The ID column: new in Skynet' : which === 'tabs' ? 'Your Tabs (workspaces)' : which === 'vessels' ? 'Your vessels' : 'Boards and Tabs';
  if (which === 'busy') return;
  const r = state.r, box = $('#convBody');
  if (which === 'if') {
    box.innerHTML = `<div class="card"><p>These are the Interfaces (boards) in your BruControl config file. Nothing can be changed on this page;
      it only shows what was found. The <b>ID</b> column is new in Skynet and is explained on the next page.</p>
      <table class="ifTable"><tr><th>Interface</th><th>ID</th><th>Items</th><th>Interface Type</th><th>Interface Connection</th><th>Enabled</th></tr>
      ${r.interfaces.map(d => row([esc(d.name), `<span class="greyId">${esc(d.id)}</span>`, d.items, esc(d.typeName || ''), esc(d.connection || ''), d.enabled ? '✓' : '✗'], ['', '', 'n', '', '', 'c'])).join('')}</table></div>`;
    return;
  }
  if (which === 'id') {
    const ex = r.renames.find(x => /_\d+_/.test(x.to))?.to || 'MP_45_DO_M~HLT~Pump_MD';
    box.innerHTML = `<div class="cards two"><div class="card"><table class="ifTable"><tr><th>Interface</th><th>ID</th></tr>
      ${r.interfaces.map(d => row([esc(d.name), `<input class="ifId" data-name="${esc(d.name)}" value="${esc(d.id)}" maxlength="4" size="5" spellcheck="false" title="Up to 4 letters (A to Z); 2 is best" aria-label="ID for ${esc(d.name)}">`])).join('')}</table>
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
        <p>For example <code>${esc(ex)}</code>. If two names would come out the same, the second gets <code>_2</code> before its Tab ID, so no two are ever alike.</p>
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
      if (changed) convert(ids); else sub5('tabs');
    };
    return;
  }
  if (which === 'tabs') {
    box.innerHTML = tabsHtml(r);
    state.accept = () => { state.keepTabs = new Set([...box.querySelectorAll('.keepTab:checked')].map(c => c.dataset.name)); sub5('vessels'); };
    return;
  }
  if (which === 'vessels') {
    box.innerHTML = vesselsHtml();
    box.onchange = e => {
      const t = e.target; if (!t.classList.contains('vd')) return;
      const v = state.connect.parts.vessels.find(x => x.key === t.dataset.v); if (!v) return;
      const val = t.type === 'checkbox' ? (t.checked ? 'yes' : 'no') : t.dataset.k === 'probe' ? (state.connect.probes ?? []).find(x => x.id === t.value) ?? null
        : t.dataset.k === 'heater' ? (state.connect.heaters ?? []).find(x => x.id === t.value) ?? null : t.value;
      v.details = { ...(v.details ?? {}), [t.dataset.k]: val };
    };
    state.accept = () => { box.onchange = null; sub5('sum'); };
    return;
  }
  for (const id of ['#next5', '#next5a']) $(id).disabled = false;
  {
    box.innerHTML = `<div class="card"><p>Import Copy: <code>${esc(r.copy)}</code></p>
        <p>Names: <b>${r.names === 'bru' ? 'your BruControl names (kept after two warnings)' : 'Skynet names'}</b>.
        <b>${r.items}</b> items on a board port come in. <b>${r.placeholders}</b> other items are a <b>Placeholder</b> on their Tab, where
        BruControl had them, until the next steps bring them in. Tab backgrounds are left out for now.</p>
        ${r.charts ? `<p><b>${r.charts}</b> BruControl Chart(s) are now Skynet <b>Chart Widgets</b>, with the same span, refresh, grid lines, colors and channels.</p>` : ''}</div>
      <div class="cards two"><div><h3>Interfaces (boards)</h3><table><tr><th>Interface</th><th>ID</th><th>Items</th><th>Import</th></tr>
        ${r.interfaces.map(d => row([esc(d.name), esc(d.id), d.items, d.items ? '✓' : `<input type="checkbox" class="keepEmpty" data-name="${esc(d.name)}" title="This Interface (board) has no items. Tick it to import it anyway; unticked, it is not imported." aria-label="Import ${esc(d.name)} anyway">`], ['', '', 'n', 'c'])).join('')}</table>
        ${r.interfaces.some(d => !d.items) ? '<p class="small">An Interface with no items (0) is <b>not</b> imported. Tick its box and it <b>will</b> be imported.</p>' : ''}</div>
      <div><h3>Placeholders</h3><table><tr><th>BruControl kind</th><th>How many</th></tr>
        ${Object.entries(r.byKind).map(([k, n]) => row([esc(k), n], ['', 'n'])).join('') || row(['(none)', ''])}</table></div></div>
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
for (const id of ['#next4', '#next4a']) $(id).onclick = () => convert();
// the Globals-only Tab question (Fritz, 2026-11-08): Yes (a recipe import) leaves it unticked, No ticks it
$('#convBody').addEventListener('click', e => {
  const b = e.target.closest('.askYes, .askNo'); if (!b) return;
  const box = [...document.querySelectorAll('#convBody .keepTab')].find(c => c.dataset.name === b.dataset.name);
  if (box) box.checked = b.classList.contains('askYes');
  for (const x of b.parentElement.querySelectorAll('button')) x.classList.toggle('primary', x === b);
});
for (const id of ['#back5', '#back5a']) $(id).onclick = () => state.sub5 === 'sum' ? sub5('vessels') : state.sub5 === 'vessels' ? sub5('tabs') : state.sub5 === 'tabs' ? sub5('id') : state.sub5 === 'id' ? sub5('if') : show(4);
for (const id of ['#next5', '#next5a']) $(id).onclick = () => {
  if (state.sub5 === 'if') return sub5('id');
  if (['id', 'tabs', 'vessels'].includes(state.sub5)) return state.accept();
  if (!state.converted) return toast('The config file is not converted yet. Go back to Names and click Next.');
  startConnect(state.connect, { toast });
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
      keepEmpty: [...document.querySelectorAll('#convBody .keepEmpty:checked')].map(c => c.dataset.name),
      keepTabs: [...(state.keepTabs ?? [])], tabsPicked: !!state.keepTabs });
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
init();
