// File Move page: copy files and whole folders from the computer you are using (Windows, Mac, Linux) to the Brain (the Pi).
// Nothing to install: the browser sends the files to the panel, and the panel puts each kind in its one home on the Brain
// (pictures in media/Images, sounds in media/sounds, Processes in scripts, help pages in help). See lib/filemove.js.
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
const PICTURE = /\.(png|jpe?g|gif|svg|webp|bmp|ico)$/i, SOUND = /\.(wav|mp3|ogg|m4a)$/i;
const TEST = { pictures: PICTURE, sounds: SOUND, processes: /\.txt$/i, help: /\.md$/i };
const kindOf = name => PICTURE.test(name) ? 'pictures' : SOUND.test(name) ? 'sounds' : null;

let rows = [], missing = [], busy = false;     // rows: { file, rel, kind, check }

// ---- what the loaded Schema uses but the Brain does not have ----
async function loadMissing() {
  try { missing = (await call('GET', '/ui/filemove/missing')).missing; } catch { missing = []; }
  const pics = missing.filter(m => m.kind === 'pictures').length, snds = missing.length - pics;
  const box = $('#fmMissing'); box.innerHTML = '';
  if (!missing.length) { box.append(el('p', { class: 'muted' }, '✔ Every picture and sound the loaded Schema uses is on the Brain.')); $('#fmOnlyMissing').disabled = true; return; }
  $('#fmOnlyMissing').disabled = false;
  box.append(el('p', {}, el('b', {}, `The loaded Schema uses ${pics} picture(s) and ${snds} sound(s) that are not on the Brain yet. `),
    'If it came from BruControl, pick your BruControl Media folder (usually C:\\BruControl\\Media) below and tick "Only the ones this Schema is missing".'),
  el('details', {}, el('summary', {}, 'Show the list'), el('ul', { class: 'fmMissList' }, ...missing.map(m => el('li', {}, m.path)))));
}
const missingNames = () => new Set(missing.map(m => `${m.kind}:${m.name.toLowerCase()}`));

// ---- files picked or dropped ----
// rel = the path inside the picked folder (the picked folder's own name left off), so C:\BruControl\Media\Pumps\a.png -> Pumps/a.png
const kindFor = name => { const want = $('#fmKind').value; return want === 'auto' ? kindOf(name) : (TEST[want].test(name) ? want : null); };
async function addFiles(list) {
  if (busy) return;
  for (const { file, rel } of list) {
    if (rows.some(r => r.rel === rel && r.file.size === file.size)) continue;
    rows.push({ file, rel, kind: kindFor(file.name) });
  }
  await check();
}
const fromInput = files => [...files].map(f => ({ file: f, rel: (f.webkitRelativePath || f.name).split('/').slice(f.webkitRelativePath ? 1 : 0).join('/') }));
// Dragged folders are walked with the browser's file system entries (Chrome, Edge, Firefox, Safari)
async function fromDrop(dt) {
  const out = [], read = e => new Promise((ok, bad) => e.file(ok, bad));
  const walk = async (entry, prefix) => {
    if (entry.isFile) { out.push({ file: await read(entry), rel: prefix + entry.name }); return; }
    const r = entry.createReader();
    for (;;) {
      const batch = await new Promise((ok, bad) => r.readEntries(ok, bad)); if (!batch.length) break;
      for (const c of batch) await walk(c, prefix + (entry._top ? '' : entry.name + '/'));
    }
  };
  const entries = [...dt.items].map(i => i.webkitGetAsEntry?.()).filter(Boolean);
  if (!entries.length) return fromInput(dt.files);
  for (const e of entries) { if (e.isDirectory) e._top = true; await walk(e, ''); }
  return out;
}

async function check() {
  const todo = rows.filter(r => r.kind && !r.check);
  for (let i = 0; i < todo.length; i += 500) {
    const part = todo.slice(i, i + 500);
    try {
      const { items } = await call('POST', '/ui/filemove/check', { items: part.map(r => ({ kind: r.kind, path: r.rel, size: r.file.size })) });
      part.forEach((r, j) => r.check = items[j]);
    } catch (e) { say(e.message, true); break; }
  }
  render();
}

// What will happen to a row when Copy is pressed
function plan(r) {
  if (!r.kind) return ['skip', $('#fmKind').value === 'auto' ? 'Not a picture or sound (pick Processes or Help pages above for .txt / .md)' : 'Not that kind of file'];
  if (!r.check) return ['wait', 'Checking...'];
  if (!r.check.ok) return ['skip', r.check.error];
  if (r.done) return [r.done === 'copied' ? 'done' : 'skip', r.done === 'copied' ? 'Copied ✔' : r.done];
  if ($('#fmOnlyMissing').checked && !missingNames().has(`${r.kind}:${r.file.name.toLowerCase()}`)) return ['skip', 'The Schema does not use it'];
  if (r.check.exists && !$('#fmReplace').checked) return ['skip', r.check.same ? 'Already on the Brain (same size)' : 'Already on the Brain (different, tick Replace to copy over it)'];
  return ['copy', r.check.exists ? 'Will replace the one on the Brain' : 'New'];
}

function render() {
  const body = $('#fmRows'); body.innerHTML = '';
  let copy = 0, bytes = 0;
  const shown = rows.slice(0, 2000);
  for (const r of rows) { const [what] = plan(r); if (what === 'copy') { copy++; bytes += r.file.size; } }
  for (const r of shown) {
    const [what, why] = plan(r);
    body.append(el('tr', { class: 'fm-' + what }, el('td', {}, r.rel), el('td', { class: 'num' }, size(r.file.size)),
      el('td', {}, r.check?.to || ''), el('td', {}, why)));
  }
  $('#fmTable').hidden = !rows.length;
  $('#fmMore').textContent = rows.length > shown.length ? `... and ${rows.length - shown.length} more` : '';
  $('#fmGo').disabled = busy || !copy;
  $('#fmGo').textContent = copy ? `Copy ${copy} file(s) to the Brain (${size(bytes)})` : 'Copy to the Brain';
  $('#fmClear').disabled = busy || !rows.length;
  $('#fmCount').textContent = rows.length ? `${rows.length} file(s) picked, ${copy} to copy` : '';
}

async function go() {
  if (busy) return;
  const todo = rows.filter(r => plan(r)[0] === 'copy');
  if (!todo.length) return;
  busy = true; render();
  const replace = $('#fmReplace').checked; let copied = 0, problems = 0;
  for (const [i, r] of todo.entries()) {
    $('#fmProgress').textContent = `Copying ${i + 1} of ${todo.length}: ${r.rel}`;
    try {
      const res = await fetch(`/ui/filemove/upload?kind=${r.kind}&path=${encodeURIComponent(r.rel)}&overwrite=${replace ? 1 : 0}`, { method: 'PUT', body: r.file });
      const d = await res.json().catch(() => ({ ok: false, error: res.statusText }));
      if (!res.ok || d.ok === false) { r.done = d.error || 'Not copied'; problems++; } else { r.done = 'copied'; copied++; }
    } catch (e) { r.done = e.message; problems++; }
    if (i % 10 === 0) render();
  }
  busy = false;
  $('#fmProgress').textContent = `Copied ${copied} file(s) to the Brain.` + (problems ? ` ${problems} were not copied (see the list).` : '');
  say(problems ? `${problems} file(s) were not copied` : `Copied ${copied} file(s)`, !!problems);
  await loadMissing(); render();
}

$('#fmPickFolder').onchange = e => { addFiles(fromInput(e.target.files)); e.target.value = ''; };
$('#fmPickFiles').onchange = e => { addFiles(fromInput(e.target.files)); e.target.value = ''; };
$('#fmKind').onchange = () => { if (busy) return; for (const r of rows) Object.assign(r, { kind: kindFor(r.file.name), check: undefined, done: undefined }); check(); };
$('#fmReplace').onchange = render;
$('#fmOnlyMissing').onchange = render;
$('#fmGo').onclick = go;
$('#fmClear').onclick = () => { rows = []; $('#fmProgress').textContent = ''; render(); };
const drop = $('#fmDrop');
drop.addEventListener('dragover', e => { if ([...e.dataTransfer.types].includes('Files')) { e.preventDefault(); drop.classList.add('dropping'); } });
drop.addEventListener('dragleave', e => { if (!drop.contains(e.relatedTarget)) drop.classList.remove('dropping'); });
drop.addEventListener('drop', async e => { drop.classList.remove('dropping'); if (!e.dataTransfer.files.length) return; e.preventDefault(); addFiles(await fromDrop(e.dataTransfer)); });
document.querySelector('#views button[data-view="filemove"]')?.addEventListener('click', () => { loadMissing(); render(); });
