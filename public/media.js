// Media page: add pictures and sounds to the Brew Panel computer (Raspberry Pi) from any browser.
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
let root = 0, dir = '', busy = false;

async function render() {
  let st; try { st = await call('GET', `/ui/media/list?root=${root}&dir=${encodeURIComponent(dir)}`); } catch (e) { say(e.message, true); if (dir) { dir = ''; render(); } return; }
  $('#mdRoot').replaceChildren(...st.roots.map(r => el('option', { value: r.index, selected: r.index === root }, r.path + (r.exists ? '' : '  (missing)'))));
  const parts = dir ? dir.split('/') : [];
  $('#mdCrumbs').replaceChildren(el('button', { onclick: () => go('') }, 'Media folder'),
    ...parts.map((p, i) => el('button', { onclick: () => go(parts.slice(0, i + 1).join('/')) }, p)));
  $('#mdFolders').replaceChildren(...st.folders.map(f => el('div', { class: 'mdFolder' },
    el('button', { onclick: () => go(dir ? `${dir}/${f}` : f) }, '📁 ' + f),
    el('button', { class: 'small', title: 'Rename folder', onclick: () => rename(dir ? `${dir}/${f}` : f, f) }, '✎'),
    el('button', { class: 'small danger', title: 'Delete empty folder', onclick: () => remove(dir ? `${dir}/${f}` : f, f) }, '✕'))));
  const filter = $('#mdFilter').value.toLowerCase();
  const files = st.files.filter(f => !filter || f.name.toLowerCase().includes(filter));
  $('#mdCount').textContent = `${st.files.length} files` + (filter ? `, ${files.length} shown` : '');
  $('#mdFiles').replaceChildren(...files.map(f => el('div', { class: 'mdFile' },
    f.kind === 'sound' ? el('audio', { controls: true, preload: 'none', src: `/media?path=${encodeURIComponent(f.use)}` })
      : el('img', { loading: 'lazy', alt: '', src: `/media?path=${encodeURIComponent(f.use)}&as=original&t=${f.modified}` }),
    el('div', { class: 'mdName', title: f.name }, f.name),
    el('div', { class: 'muted mdMeta' }, size(f.size)),
    el('div', { class: 'mdUse' }, el('code', { title: 'Type this path into a picture or sound field' }, f.use)),
    el('div', { class: 'mdBtns' },
      el('button', { class: 'small', onclick: () => copy(f.use) }, 'Copy path'),
      el('button', { class: 'small', onclick: () => rename(f.path, f.name) }, 'Rename'),
      el('button', { class: 'small danger', onclick: () => remove(f.path, f.name) }, 'Delete')))));
  $('#mdEmpty').hidden = !!(st.files.length || st.folders.length);
}
function go(d) { dir = d; render(); }
async function copy(t) { try { await navigator.clipboard.writeText(t); say('Copied: ' + t); } catch { prompt('Copy this path', t); } }
async function rename(from, name) {
  const to = prompt('New name', name); if (!to || to === name) return;
  try { await call('POST', '/ui/media/rename', { root, from, to: from.slice(0, from.length - name.length) + to }); render(); say('Renamed. Elements that used the old name need the new path.'); } catch (e) { say(e.message, true); }
}
async function remove(p, name) {
  if (!confirm(`Delete ${name} from the Brew Panel computer?`)) return;
  try { await call('POST', '/ui/media/delete', { root, path: p }); render(); say('Deleted ' + name); } catch (e) { say(e.message, true); }
}

async function send(file, overwrite) {
  const r = await fetch(`/ui/media/upload?root=${root}&dir=${encodeURIComponent(dir)}&name=${encodeURIComponent(file.name)}&overwrite=${overwrite ? 1 : 0}`, { method: 'PUT', body: file });
  const d = await r.json().catch(() => ({ ok: false, error: r.statusText }));
  return { status: r.status, ...d };
}
async function upload(files) {
  files = [...files]; if (!files.length || busy) return;
  busy = true; const replace = $('#mdReplace').checked, saved = [], skipped = [], exists = [], errors = [];
  try {
    for (const [i, f] of files.entries()) {
      $('#mdProgress').textContent = `Sending ${i + 1} of ${files.length}: ${f.name}` + (/\.zip$/i.test(f.name) ? ' (unpacking)' : '');
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

$('#mdRoot').onchange = e => { root = Number(e.target.value); dir = ''; render(); };
$('#mdFilter').oninput = () => render();
$('#mdPick').onchange = e => { upload(e.target.files); e.target.value = ''; };
$('#mdNew').onclick = async () => {
  const n = prompt('New folder name'); if (!n) return;
  try { await call('POST', '/ui/media/folder', { root, path: dir ? `${dir}/${n}` : n }); go(dir ? `${dir}/${n}` : n); } catch (e) { say(e.message, true); }
};
const drop = $('#view-media');
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dropping'); });
drop.addEventListener('dragleave', e => { if (e.target === drop) drop.classList.remove('dropping'); });
drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dropping'); upload(e.dataTransfer.files); });
document.querySelector('#views button[data-view="media"]')?.addEventListener('click', render);
