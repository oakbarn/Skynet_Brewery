// Settings > Pictures: PNG / JPG pictures get a sharp SVG copy (made on the server by lib/vectorize.js).
// Shows each picture next to its SVG so you can pick which one the panel uses.
const $ = s => document.querySelector(s);
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); }
  e.append(...kids.filter(k => k != null)); return e;
};
const src = (p, as) => `/media?path=${encodeURIComponent(p)}&as=${as}&t=${Date.now()}`;
async function call(method, url, body) {
  const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  const d = await r.json(); if (!r.ok || d.ok === false) throw new Error(d.error || r.statusText); return d;
}
const say = (m, bad) => { const t = $('#toast'); t.textContent = m; t.className = 'show' + (bad ? ' bad' : ''); clearTimeout(t._t); t._t = setTimeout(() => t.className = '', 2500); };
const MODE_TEXT = { auto: 'Automatic: use the SVG for drawing-like pictures, keep the original for photo-like ones', all: 'Use the SVG for every picture', off: 'Off: always use the original PNG / JPG' };

let timer = null;
async function render() {
  const box = $('#picBox'); if (!box) return;
  let st; try { st = await call('GET', '/ui/pictures'); } catch (e) { box.textContent = e.message; return; }
  $('#picMode').replaceChildren(...st.modes.map(m => el('option', { value: m, selected: m === st.mode }, MODE_TEXT[m])));
  const n = st.pictures.length, made = st.pictures.filter(p => p.svg).length, used = st.pictures.filter(p => p.usingSvg).length;
  $('#picSummary').textContent = `${n} pictures, ${made} have an SVG copy, ${used} shown as SVG.` + (st.working ? ` Converting ${st.working} (${st.waiting} waiting)...` : '');
  const filter = $('#picFilter').value.toLowerCase();
  box.replaceChildren(...st.pictures.filter(p => !filter || p.path.toLowerCase().includes(filter)).map(p => {
    const kind = p.handMade ? 'your own SVG' : p.score == null ? '' : p.score >= st.drawingScore ? 'drawing-like' : 'photo-like';
    const pick = el('select', { onchange: async e => { try { await call('PUT', '/ui/pictures/choice', { path: p.path, use: e.target.value }); render(); } catch (err) { say(err.message, true); } } },
      ...[['auto', 'Automatic'], ['svg', 'Use SVG'], ['original', 'Use original']].map(([v, t]) => el('option', { value: v, selected: v === p.choice }, t)));
    return el('div', { class: 'pic' + (p.usingSvg ? ' svg' : '') },
      el('div', { class: 'picName' }, p.path),
      el('div', { class: 'picPair' },
        el('figure', {}, el('img', { src: src(p.path, 'original'), loading: 'lazy', alt: '' }), el('figcaption', {}, 'Original')),
        el('figure', {}, p.svg ? el('img', { src: src(p.path, 'svg'), loading: 'lazy', alt: '' }) : el('div', { class: 'picNone' }, p.problem || (p.waiting ? 'Converting...' : 'No SVG yet')), el('figcaption', {}, 'SVG ' + (kind ? `(${kind})` : '')))),
      el('div', { class: 'picBar' }, pick, el('span', { class: 'muted' }, p.usingSvg ? 'Showing SVG' : 'Showing original')));
  }));
  clearTimeout(timer);
  if (st.working || st.waiting) timer = setTimeout(render, 2000);
}

$('#picMode').onchange = async e => { try { await call('PUT', '/ui/pictures/mode', { mode: e.target.value }); render(); } catch (err) { say(err.message, true); } };
$('#picConvert').onclick = async () => { try { const r = await call('POST', '/ui/pictures/convert', { force: false }); say(`Checking ${r.queued} pictures`); render(); } catch (e) { say(e.message, true); } };
$('#picRedo').onclick = async () => { if (!confirm('Make every SVG copy again? Your own hand-made SVGs are kept.')) return; try { const r = await call('POST', '/ui/pictures/convert', { force: true }); say(`Re-making ${r.queued} pictures`); render(); } catch (e) { say(e.message, true); } };
$('#picFilter').oninput = () => render();
document.querySelector('#views button[data-view="settings"]')?.addEventListener('click', render);
