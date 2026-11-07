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
  tb.innerHTML = list.files.map((f, i) => `<tr data-i="${i}" class="${f.path === state.sel ? 'sel' : ''}">
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
  for (const tr of document.querySelectorAll('#files tbody tr')) { const on = Number(tr.dataset.i) === i; tr.classList.toggle('sel', on); tr.querySelector('input').checked = on; }
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
$('#files tbody').onclick = e => { const tr = e.target.closest('tr'); if (tr) select(Number(tr.dataset.i)); };
$('#files tbody').ondblclick = async e => { const tr = e.target.closest('tr'); if (!tr) return; await select(Number(tr.dataset.i)); next(); };
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
async function convert() {
  const names = await namesChoice();
  show(5);
  const box = $('#convBody'); box.innerHTML = '<p class="muted">Making the Import Copy and converting it…</p>';
  try {
    const r = await api('POST', '/api/convert', { file: state.sel, names, copyMedia: $('#copyMedia').checked });
    state.converted = true;
    state.connect = r.connect;
    const row = (cells, cls = []) => '<tr>' + cells.map((c, i) => `<td${cls[i] ? ` class="${cls[i]}"` : ''}>${c}</td>`).join('') + '</tr>';
    box.innerHTML = `<div class="card"><p>Import Copy: <code>${esc(r.copy)}</code></p>
        <p>Names: <b>${r.names === 'bru' ? 'your BruControl names (kept after two warnings)' : 'Skynet names'}</b>.
        <b>${r.items}</b> items on a board port come in. <b>${r.placeholders}</b> other items are a <b>Placeholder</b> on their Tab, where
        BruControl had them, until the next steps bring them in. Tab backgrounds are left out for now.</p></div>
      <div class="cards two"><div><h3>Interfaces (boards)</h3><table><tr><th>Interface</th><th>ID</th><th>Items</th></tr>
        ${r.interfaces.map(d => row([esc(d.name), esc(d.id), d.items], ['', '', 'n'])).join('')}</table></div>
      <div><h3>Placeholders</h3><table><tr><th>BruControl kind</th><th>How many</th></tr>
        ${Object.entries(r.byKind).map(([k, n]) => row([esc(k), n], ['', 'n'])).join('') || row(['(none)', ''])}</table></div></div>
      ${r.look ? `<p>Look (theme): <b>${esc(r.look.name)}</b>, ${r.look.bru ? `the closest to your BruControl theme <b>${esc(r.look.bru)}</b>` : 'the closest to BruControl\'s own Office 2019 Black (your BruControl theme was not found)'}. Change it in the Panel under Settings &gt; Panel settings &gt; Look.</p>` : ''}
      <h3>Tabs (workspaces)</h3><table><tr><th>Tab</th><th>ID</th><th>Items</th><th>Placeholders</th></tr>
        ${r.tabs.map(t => row([esc(t.name), esc(t.id), t.items, t.placeholders], ['', '', 'n', 'n'])).join('')}</table>
      ${r.media.pictures + r.media.sounds ? `<h3>Pictures and Sounds</h3><p><b>${r.media.pictures}</b> pictures and <b>${r.media.sounds}</b> sounds are imported by their path.
        ${r.media.copy ? 'They were <b>copied</b> to <code>media\\Images\\User</code> and <code>media\\sounds\\User</code>; the originals stay where they were.'
          : 'The files stay where they were, so BruControl keeps working.'}${r.media.missing.length ? ` <b>${r.media.missing.length}</b> are not on this computer; their path is kept.` : ''}</p>
        ${r.media.missing.length ? `<details><summary>Not on this computer (${r.media.missing.length})</summary><table><tr><th>Kind</th><th>Path</th></tr>
        ${r.media.missing.map(x => row([x.kind === 'sound' ? 'Sound' : 'Picture', esc(x.from)])).join('')}</table></details>` : ''}` : ''}
      ${r.renames.length ? `<details><summary>New names (${r.renames.length})</summary><table><tr><th>BruControl</th><th>Skynet</th></tr>
        ${r.renames.map(x => row([esc(x.from), esc(x.to)])).join('')}</table></details>` : ''}
      ${r.warnings.length ? `<h3>Notes for the report</h3><ul>${r.warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}`;
  } catch (e) { state.converted = false; box.innerHTML = `<p class="note">${esc(e.message)}</p>`; }
}
for (const id of ['#next4', '#next4a']) $(id).onclick = convert;
for (const id of ['#back5', '#back5a']) $(id).onclick = () => show(4);
for (const id of ['#next5', '#next5a']) $(id).onclick = () => {
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
$('#saveBtn').onclick = async () => {
  const b = $('#saveBtn'); b.disabled = true; b.textContent = 'Saving…';
  try {
    const r = await api('POST', '/api/save', { file: state.sel, name: $('#schemaName').value, connect: connectState() });
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
