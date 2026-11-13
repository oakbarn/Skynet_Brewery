// The printable list of Skynet Picture ID numbers (Rule 7.22): /ui/media/skynet-ids, with each picture, a search and a group pick.
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const groupWord = g => g === 'Lights_LEDs' ? 'Lights / LEDs' : g.replace(/_/g, ' ');
let rows = [];
function show() {
  const f = $('#piFilter').value.trim().toLowerCase().replace(/^#/, ''), g = $('#piGroup').value;
  const list = rows.filter(r => !r.retired && (!g || r.file.split('/')[0] === g) && (!f || String(r.id) === f || r.file.toLowerCase().includes(f)));
  $('#piBody').innerHTML = list.map(r => {
    const parts = r.file.split('/'), grp = parts[0], name = parts.slice(1).join('/');
    return `<tr><td class="piNum">${r.id}</td><td><img loading="lazy" alt="" src="/media?path=${encodeURIComponent(r.path)}"></td><td>${esc(name)}</td><td>${esc(groupWord(grp))}</td></tr>`;
  }).join('');
  $('#piCount').textContent = `${list.length} of ${rows.filter(r => !r.retired).length} Skynet pictures.`;
}
async function start() {
  const r = await fetch('/ui/media/skynet-ids'); const d = await r.json();
  if (!r.ok || d.ok === false) { $('#piCount').textContent = d.error || 'Could not read the list'; return; }
  rows = d.rows || [];
  for (const g of [...new Set(rows.map(r => r.file.split('/')[0]))].sort()) $('#piGroup').append(Object.assign(document.createElement('option'), { value: g, textContent: groupWord(g) }));
  show();
}
$('#piFilter').oninput = show; $('#piGroup').onchange = show;
$('#piPrint').onclick = () => print();
start();
