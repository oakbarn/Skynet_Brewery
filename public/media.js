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
let root = 0, dir = '', busy = false, selected = null, roots = [], trees = [];
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
      const p = join(dir, f), item = el('div', { class: 'mdItem', draggable: 'true', title: 'Open ' + f, ondblclick: () => go(root, p) },
        el('div', { class: 'mdIcon', onclick: () => go(root, p) }, '📁'),
        el('div', { class: 'mdName', onclick: () => select(item, p) }, f), el('div', { class: 'muted mdMeta' }, 'Folder'),
        el('div', { class: 'mdBtns' }, el('button', { class: 'small', onclick: () => go(root, p) }, 'Open'), ...actions(p, f)));
      item.addEventListener('click', e => { if (e.target === item) select(item, p); });
      dragSource(item, p); dropTarget(item, root, p); return item;
    }),
    ...files.map(f => {
      const item = el('div', { class: 'mdItem' + (selected === f.path ? ' sel' : ''), draggable: 'true', title: f.name, onclick: () => select(item, f.path) },
        f.kind === 'sound' ? el('div', { class: 'mdIcon' }, '🔊') : el('img', { class: 'mdThumb', loading: 'lazy', alt: '', src: `/media?path=${encodeURIComponent(f.use)}&as=original&t=${f.modified}` }),
        el('div', { class: 'mdName' }, f.name),
        el('div', { class: 'muted mdMeta' }, `${size(f.size)} · ${when(f.modified)}`),
        f.kind === 'sound' ? el('audio', { controls: true, preload: 'none', src: `/media?path=${encodeURIComponent(f.use)}`, onclick: e => e.stopPropagation() }) : null,
        el('div', { class: 'mdUse muted' }, 'Path to use: ', el('code', {}, f.use)),
        el('div', { class: 'mdBtns' }, el('button', { class: 'small', onclick: e => { e.stopPropagation(); copy(f.use); } }, 'Copy path'), ...actions(f.path, f.name)));
      dragSource(item, f.path); return item;
    }));
  $('#mdEmpty').hidden = !!(st.files.length || st.folders.length);
  $('#mdCount').textContent = `${st.folders.length + st.files.length} items` + (filter ? `, ${folders.length + files.length} shown` : '');
}
function actions(p, name) {
  const stop = fn => e => { e.stopPropagation(); fn(); };
  return [el('button', { class: 'small', onclick: stop(() => rename(p, name)) }, 'Rename'),
    el('button', { class: 'small', onclick: stop(() => moveTo(p)) }, 'Move'),
    el('button', { class: 'small danger', onclick: stop(() => remove(p, name)) }, 'Delete')];
}
function select(item, p) {
  selected = selected === p ? null : p;
  for (const i of document.querySelectorAll('.mdItem.sel')) i.classList.remove('sel');
  if (selected) item.classList.add('sel');
}
function go(r, d) { root = r; dir = d; selected = null; $('#mdFilter').value = ''; render(); }

// ---- drag a file or folder onto a folder (tree, address bar or folder icon) to move it ----
function dragSource(item, p) { item.addEventListener('dragstart', e => { e.dataTransfer.setData(DRAG, JSON.stringify({ root, path: p })); e.dataTransfer.effectAllowed = 'move'; }); }
function dropTarget(node, r, p) {
  node.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); node.classList.add('drop'); });
  node.addEventListener('dragleave', () => node.classList.remove('drop'));
  node.addEventListener('drop', e => {
    e.preventDefault(); e.stopPropagation(); node.classList.remove('drop');
    const m = e.dataTransfer.getData(DRAG);
    if (m) { const s = JSON.parse(m); move(s.root, s.path, r, p); }
    else if (e.dataTransfer.files.length) { root = r; dir = p; upload(e.dataTransfer.files); }
  });
}
async function move(fromRoot, from, toRoot, toDir) {
  const name = from.split('/').pop();
  if (fromRoot !== toRoot) return say('Moving between different media folders is not possible; download and add the file there', true);
  if (parent(from) === toDir) return;
  try { await call('POST', '/ui/media/rename', { root: fromRoot, from, to: join(toDir, name) }); say(`Moved ${name}. Elements that used the old path need the new one.`); render(); }
  catch (e) { say(e.message, true); }
}
function moveTo(p) {   // phones cannot drag: pick the folder from a list
  const all = [''], walk = (base, fs) => { for (const f of fs) { all.push(join(base, f.name)); walk(join(base, f.name), f.folders); } };
  walk('', trees.find(t => t.root === root)?.folders ?? []);
  const sel = el('select', {}, ...all.filter(f => f !== p && !f.startsWith(p + '/')).map(f => el('option', { value: f, selected: f === parent(p) }, (roots[root]?.name ?? 'Media') + (f ? ' › ' + f.replaceAll('/', ' › ') : ''))));
  const dlg = el('dialog', {}, el('form', { method: 'dialog' }, el('h3', {}, 'Move ' + p.split('/').pop() + ' to'), sel,
    el('div', { class: 'bar' }, el('span', { class: 'spacer' }), el('button', { value: 'cancel' }, 'Cancel'), el('button', { value: 'ok', class: 'primary' }, 'Move'))));
  dlg.addEventListener('close', () => { if (dlg.returnValue === 'ok') move(root, p, root, sel.value); dlg.remove(); });
  document.body.append(dlg); dlg.showModal();
}
async function copy(t) { try { await navigator.clipboard.writeText(t); say('Copied: ' + t); } catch { prompt('Copy this path', t); } }
async function rename(p, name) {
  const to = prompt('New name', name); if (!to || to === name) return;
  try { await call('POST', '/ui/media/rename', { root, from: p, to: join(parent(p), to) }); render(); say('Renamed. Elements that used the old name need the new path.'); } catch (e) { say(e.message, true); }
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
  busy = true; const replace = $('#mdReplace').value === 'yes', saved = [], skipped = [], exists = [], errors = [];
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
$('#mdNew').onclick = async () => {
  const n = prompt('New folder name', 'New folder'); if (!n) return;
  try { await call('POST', '/ui/media/folder', { root, path: join(dir, n) }); go(root, join(dir, n)); } catch (e) { say(e.message, true); }
};
const page = $('#view-media');
page.addEventListener('dragover', e => { if ([...e.dataTransfer.types].includes('Files')) { e.preventDefault(); page.classList.add('dropping'); } });
page.addEventListener('dragleave', e => { if (!page.contains(e.relatedTarget)) page.classList.remove('dropping'); });
page.addEventListener('drop', e => { page.classList.remove('dropping'); if (e.dataTransfer.files.length) { e.preventDefault(); upload(e.dataTransfer.files); } });
document.querySelector('#views button[data-view="media"]')?.addEventListener('click', () => render());
