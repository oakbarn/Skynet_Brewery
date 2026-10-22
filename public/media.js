// Media page: add pictures and sounds to the Brew Panel computer (Raspberry Pi) from any browser.
// Looks and works like Windows File Explorer: folder tree on the left, files on the right, address bar, drag to move.
// PNG / JPG files get their SVG copy automatically (see Settings > Pictures).
const $ = s => document.querySelector(s);
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); }
  e.append(...kids.filter(k => k != null)); return e;
};
const say = (m, bad) => { const t = $('#toast'); t.textContent = m; t.className = 'show' + (bad ? ' bad' : ''); clearTimeout(t._t); t._t = setTimeout(() => t.className = '', bad ? 5000 : 2500); };
async function call(method, url, body) {
  const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  const d = await r.json(); if (!r.ok || d.ok === false) throw new Error(d.error || r.statusText); return d;
}
const size = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
const when = t => new Date(t).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
const join = (a, b) => a ? `${a}/${b}` : b;
const parent = p => p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '';
const DRAG = 'application/x-brewpanel-media';
let root = 0, dir = '', busy = false, roots = [], trees = [], kept = [], shown = [];
const selected = new Set();                   // paths picked: click, Ctrl+click adds one, Shift+click a run (or Select many on a phone)
let many = false, anchor = null, readOnly = false;      // readOnly: inside Images/Skynet
const open = new Set(['0:']);                 // expanded tree nodes "root:path"
let mode = 'icons'; try { mode = localStorage.getItem('mdView') || 'icons'; } catch { }

// ---- left: folder tree (each media folder is a top entry, like drives in Explorer) ----
async function renderTree() {
  trees = await Promise.all(roots.map(r => r.exists ? call('GET', `/ui/media/tree?root=${r.index}`) : { root: r.index, name: r.name + ' (missing)', folders: [] }));
  for (let i = 1, parts = dir.split('/'); i <= parts.length; i++) open.add(`${root}:${parts.slice(0, i - 1).join('/')}`);
  const node = (r, p, name, kids, top) => {
    const key = `${r}:${p}`, isOpen = open.has(key), here = r === root && p === dir;
    const row = el('div', { class: 'mdNode' + (here ? ' here' : ''), title: name, onclick: () => go(r, p) },
      el('span', { class: 'mdTwisty', onclick: e => { e.stopPropagation(); if (isOpen) open.delete(key); else open.add(key); renderTree(); } }, kids.length ? (isOpen ? '▾' : '▸') : ''),
      (top ? '🗂 ' : (isOpen || here ? '📂 ' : '📁 ')) + name);
    dropTarget(row, r, p);
    return el('li', {}, row, kids.length && isOpen ? el('ul', {}, ...kids.map(k => node(r, join(p, k.name), k.name, k.folders))) : null);
  };
  $('#mdTree').replaceChildren(el('ul', {}, ...trees.map(t => node(t.root, '', t.name, t.folders, true))));
}

// ---- right: the open folder ----
async function render(withTree = true) {
  let st; try { st = await call('GET', `/ui/media/list?root=${root}&dir=${encodeURIComponent(dir)}`); } catch (e) { say(e.message, true); if (dir) { dir = ''; return render(); } return; }
  roots = st.roots;
  if (withTree) renderTree().catch(e => say(e.message, true));
  const parts = dir ? dir.split('/') : [];
  $('#mdCrumbs').replaceChildren(...[roots[root]?.name ?? 'Media', ...parts].map((p, i) => {
    const target = parts.slice(0, i).join('/'), b = el('button', { onclick: () => go(root, target) }, i ? p : '🗂 ' + p);
    dropTarget(b, root, target); return b;
  }));
  $('#mdUp').disabled = !dir;
  const filter = $('#mdFilter').value.toLowerCase(), match = n => !filter || n.toLowerCase().includes(filter);
  const folders = st.folders.filter(match), files = st.files.filter(f => match(f.name));
  const box = $('#mdFiles'); box.className = 'mdFiles ' + mode;
  box.replaceChildren(
    ...folders.map(f => {
      const p = join(dir, f), lock = st.kept?.includes(f), group = /^images$/i.test(dir) && root === 0, sky = group && /^skynet$/i.test(f);
      const item = el('div', { class: 'mdItem' + (selected.has(p) ? ' sel' : ''), 'data-p': p, draggable: lock ? false : 'true', title: (st.readOnly || sky ? '🔒 Skynet pictures: read only. ' : lock ? '🔒 Standard folder: can\'t be deleted, renamed or moved. ' : '') + 'Open ' + f, ondblclick: () => go(root, p) },
        el('div', { class: 'mdIcon', onclick: () => go(root, p) }, '📁'),
        el('div', { class: 'mdName', onclick: e => { e.stopPropagation(); select(e, p); } }, (lock ? '🔒 ' : '') + f), el('div', { class: 'muted mdMeta' }, sky ? 'Skynet pictures (read only)' : st.readOnly ? 'Skynet group (read only)' : group ? (lock ? 'Standard picture group' : 'Your picture group') : 'Folder'),
        el('div', { class: 'mdBtns' }, el('button', { class: 'small', onclick: () => go(root, p) }, 'Open'), ...(lock || st.readOnly ? [] : actions(p, f))));
      item.addEventListener('click', e => { if (e.target === item) select(e, p); });
      if (!lock && !st.readOnly) dragSource(item, p); if (!st.readOnly && !sky) dropTarget(item, root, p); return item;
    }),
    ...files.map(f => {
      const item = el('div', { class: 'mdItem' + (selected.has(f.path) ? ' sel' : ''), 'data-p': f.path, draggable: st.readOnly ? false : 'true', title: f.name, onclick: e => select(e, f.path) },
        f.kind === 'sound' ? el('div', { class: 'mdIcon' }, '🔊') : el('img', { class: 'mdThumb', loading: 'lazy', alt: '', src: `/media?path=${encodeURIComponent(f.use)}&as=original&t=${f.modified}` }),
        el('div', { class: 'mdName' }, f.name),
        el('div', { class: 'muted mdMeta' }, `${size(f.size)} · ${when(f.modified)}`),
        f.kind === 'sound' ? el('audio', { controls: true, preload: 'none', src: `/media?path=${encodeURIComponent(f.use)}`, onclick: e => e.stopPropagation() }) : null,
        el('div', { class: 'mdUse muted' }, 'Path to use: ', el('code', {}, f.use)),
        el('div', { class: 'mdBtns' }, el('button', { class: 'small', onclick: e => { e.stopPropagation(); copy(f.use); } }, 'Copy path'), ...(st.readOnly ? [] : actions(f.path, f.name))));
      if (!st.readOnly) dragSource(item, f.path); return item;
    }));
  kept = st.kept || []; shown = st.readOnly ? [] : [...folders.filter(f => !kept.includes(f)).map(f => join(dir, f)), ...files.map(f => f.path)];
  readOnly = !!st.readOnly;
  $('#mdNew').disabled = $('#mdPick').disabled = readOnly;
  $('#mdPick').closest('label').classList.toggle('off', readOnly);
  $('#mdReadOnly').hidden = !readOnly;
  for (const p of [...selected]) if (!shown.includes(p)) selected.delete(p);
  showSelection();
  $('#mdNew').textContent = root === 0 && /^images$/i.test(dir) ? '📁 New picture group' : '📁 New folder';
  $('#mdEmpty').hidden = !!(st.files.length || st.folders.length);
  $('#mdCount').textContent = `${st.folders.length + st.files.length} items` + (filter ? `, ${folders.length + files.length} shown` : '');
}
function actions(p, name) {
  const stop = fn => e => { e.stopPropagation(); fn(); };
  return [el('button', { class: 'small', onclick: stop(() => rename(p, name)) }, 'Rename'),
    el('button', { class: 'small', onclick: stop(() => moveTo(p)) }, 'Move'),
    el('button', { class: 'small danger', onclick: stop(() => remove(p, name)) }, 'Delete')];
}
// Like Explorer: a click picks one, Ctrl (Cmd on a Mac) + click adds or takes away one, Shift + click picks a run.
// On a phone, Select many makes every tap add or take away one.
function select(e, p) {
  if (!shown.includes(p)) return;
  if (e.shiftKey && anchor && shown.includes(anchor)) {
    const [a, b] = [shown.indexOf(anchor), shown.indexOf(p)].sort((x, y) => x - y);
    if (!(e.ctrlKey || e.metaKey)) selected.clear();
    for (const q of shown.slice(a, b + 1)) selected.add(q);
  } else if (e.ctrlKey || e.metaKey || many) { if (selected.has(p)) selected.delete(p); else selected.add(p); anchor = p; }
  else { const only = selected.size === 1 && selected.has(p); selected.clear(); if (!only) selected.add(p); anchor = p; }
  for (const i of document.querySelectorAll('#mdFiles .mdItem')) i.classList.toggle('sel', selected.has(i.dataset.p));
  showSelection();
}
function showSelection() {
  const n = selected.size;
  $('#mdSelInfo').textContent = n ? `${n} picked` : '';
  $('#mdMoveSel').disabled = $('#mdDelSel').disabled = !n;
}
function go(r, d) { root = r; dir = d; selected.clear(); anchor = null; $('#mdFilter').value = ''; render(); }

// ---- drag a file or folder onto a folder (tree, address bar or folder icon) to move it ----
function dragSource(item, p) {
  item.addEventListener('dragstart', e => {
    const paths = selected.has(p) ? [...selected] : [p];
    e.dataTransfer.setData(DRAG, JSON.stringify({ root, paths })); e.dataTransfer.effectAllowed = 'move';
  });
}
function dropTarget(node, r, p) {
  node.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); node.classList.add('drop'); });
  node.addEventListener('dragleave', () => node.classList.remove('drop'));
  node.addEventListener('drop', e => {
    e.preventDefault(); e.stopPropagation(); node.classList.remove('drop');
    const m = e.dataTransfer.getData(DRAG);
    if (r === 0 && /^images\/skynet(\/|$)/i.test(p)) return say('Images/Skynet is read only: put your pictures in the groups in Images', true);
    if (m) { const s = JSON.parse(m); moveMany(s.root, s.paths ?? [s.path], r, p); }
    else if (e.dataTransfer.files.length) { root = r; dir = p; upload(e.dataTransfer.files); }
  });
}
// Moves files and folders into toDir. A picture moved straight from Images into a picture group keeps working by its old path.
async function moveMany(fromRoot, paths, toRoot, toDir) {
  if (fromRoot !== toRoot) return say('Moving between different media folders is not possible; download and add the file there', true);
  paths = paths.filter(f => parent(f) !== toDir && f !== toDir && !toDir.startsWith(f + '/'));
  if (!paths.length) return;
  const errors = []; let done = 0;
  for (const from of paths) {
    try { await call('POST', '/ui/media/rename', { root: fromRoot, from, to: join(toDir, from.split('/').pop()) }); done++; }
    catch (e) { errors.push(`${from.split('/').pop()}: ${e.message}`); }
  }
  selected.clear(); render();
  if (errors.length) say(`Moved ${done}. ${errors[0]}${errors.length > 1 ? ` (and ${errors.length - 1} more)` : ''}`, true);
  else say(done === 1 ? `Moved ${paths[0].split('/').pop()}.` : `Moved ${done} items.`);
}
const move = (fromRoot, from, toRoot, toDir) => moveMany(fromRoot, [from], toRoot, toDir);
function moveTo(p) {   // phones cannot drag: pick the folder from a list (p: one path, or a list of the picked ones)
  const list = Array.isArray(p) ? p : [p]; p = list[0];
  const all = [''], walk = (base, fs) => { for (const f of fs) { all.push(join(base, f.name)); walk(join(base, f.name), f.folders); } };
  walk('', trees.find(t => t.root === root)?.folders ?? []);
  const sel = el('select', {}, ...all.filter(f => !list.some(q => f === q || f.startsWith(q + '/'))).map(f => el('option', { value: f, selected: f === parent(p) }, (roots[root]?.name ?? 'Media') + (f ? ' › ' + f.replaceAll('/', ' › ') : ''))));
  const dlg = el('dialog', {}, el('form', { method: 'dialog' }, el('h3', {}, 'Move ' + (list.length > 1 ? `${list.length} items` : p.split('/').pop()) + ' to'), sel,
    el('div', { class: 'bar' }, el('span', { class: 'spacer' }), el('button', { value: 'cancel' }, 'Cancel'), el('button', { value: 'ok', class: 'primary' }, 'Move'))));
  dlg.addEventListener('close', () => { if (dlg.returnValue === 'ok') moveMany(root, list, root, sel.value); dlg.remove(); });
  document.body.append(dlg); dlg.showModal();
}
async function copy(t) { try { await navigator.clipboard.writeText(t); say('Copied: ' + t); } catch { prompt('Copy this path', t); } }
async function rename(p, name) {
  const to = prompt('New name', name); if (!to || to === name) return;
  try { await call('POST', '/ui/media/rename', { root, from: p, to: join(parent(p), to) }); render(); say('Renamed. Elements that used the old name need the new path.'); } catch (e) { say(e.message, true); }
}
async function removeMany(paths) {
  if (!paths.length || !confirm(`Delete these ${paths.length} items from the Brew Panel computer?\n${paths.map(f => f.split('/').pop()).slice(0, 15).join('\n')}${paths.length > 15 ? '\n...' : ''}`)) return;
  const errors = []; let done = 0;
  for (const p of paths) { try { await call('POST', '/ui/media/delete', { root, path: p }); done++; } catch (e) { errors.push(`${p.split('/').pop()}: ${e.message}`); } }
  selected.clear(); render();
  if (errors.length) say(`Deleted ${done}. ${errors[0]}${errors.length > 1 ? ` (and ${errors.length - 1} more)` : ''}`, true); else say(`Deleted ${done} items`);
}
async function remove(p, name) {
  if (!confirm(`Delete ${name} from the Brew Panel computer?`)) return;
  try { await call('POST', '/ui/media/delete', { root, path: p }); render(); say('Deleted ' + name); } catch (e) { say(e.message, true); }
}

// ---- add files (pick, or drag from the PC onto the page or onto a folder) ----
async function send(file, overwrite) {
  const r = await fetch(`/ui/media/upload?root=${root}&dir=${encodeURIComponent(dir)}&name=${encodeURIComponent(file.name)}&overwrite=${overwrite ? 1 : 0}`, { method: 'PUT', body: file });
  const d = await r.json().catch(() => ({ ok: false, error: r.statusText }));
  return { status: r.status, ...d };
}
async function upload(files) {
  files = [...files]; if (!files.length || busy) return;
  if (readOnly) return say('Images/Skynet is read only: open one of the groups in Images to add your pictures', true);
  busy = true; const replace = $('#mdReplace').checked, saved = [], skipped = [], exists = [], errors = [];
  try {
    for (const [i, f] of files.entries()) {
      $('#mdProgress').textContent = `Adding ${i + 1} of ${files.length}: ${f.name}` + (/\.zip$/i.test(f.name) ? ' (unpacking)' : '');
      const r = await send(f, replace);
      if (r.status === 409) exists.push(f); else if (r.ok === false) errors.push(r.error); else { saved.push(...r.saved); skipped.push(...r.skipped); }
    }
    if (exists.length && confirm(`${exists.length} file(s) are already there:\n${exists.map(f => f.name).slice(0, 15).join('\n')}\n\nReplace them?`)) {
      for (const f of exists) { const r = await send(f, true); if (r.ok === false) errors.push(r.error); else saved.push(...r.saved); }
    }
  } catch (e) { errors.push(e.message); }
  busy = false;
  $('#mdProgress').textContent = [`Added ${saved.length} file(s).`, skipped.length ? `Skipped ${skipped.length}: ${skipped.slice(0, 10).join(', ')}${skipped.length > 10 ? '...' : ''}` : '', ...errors].filter(Boolean).join('  ');
  if (errors.length) say(errors[0], true); else say(`Added ${saved.length} file(s)`);
  render();
}

$('#mdView').value = mode;
$('#mdView').onchange = e => { mode = e.target.value; try { localStorage.setItem('mdView', mode); } catch { } render(false); };
$('#mdFilter').oninput = () => render(false);
$('#mdUp').onclick = () => go(root, parent(dir));
$('#mdPick').onchange = e => { upload(e.target.files); e.target.value = ''; };
$('#mdMoveSel').onclick = () => selected.size && moveTo([...selected]);
$('#mdDelSel').onclick = () => removeMany([...selected]);
$('#mdMany').onchange = e => { many = e.target.checked; };
$('#mdNew').onclick = async () => {
  const grp = root === 0 && /^images$/i.test(dir);
  const n = prompt(grp ? 'Name of your new picture group (for example Fermenters)' : 'New folder name', grp ? '' : 'New folder'); if (!n) return;
  try { await call('POST', '/ui/media/folder', { root, path: join(dir, n) }); go(root, join(dir, n)); } catch (e) { say(e.message, true); }
};
const page = $('#view-media');
page.addEventListener('dragover', e => { if ([...e.dataTransfer.types].includes('Files')) { e.preventDefault(); page.classList.add('dropping'); } });
page.addEventListener('dragleave', e => { if (!page.contains(e.relatedTarget)) page.classList.remove('dropping'); });
page.addEventListener('drop', e => { page.classList.remove('dropping'); if (e.dataTransfer.files.length) { e.preventDefault(); upload(e.dataTransfer.files); } });
document.querySelector('#views button[data-view="media"]')?.addEventListener('click', () => render());
