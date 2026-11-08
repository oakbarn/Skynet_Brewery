// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Importer's page 6, Connect your brewery (Rule 15.4, Fritz 2026-11-07). The rules of the chains, the guesses and reading an
// AI's answer are in connect.js (shared with the Importer's server); this file only draws the page and keeps the brewer's answers.
import { OPENINGS, COOLING, HEATING, AI_SITES, endKey, endText, isFinal, addLink, guessBy, usedIds, looseItems, aiQuestion, readAiAnswer, removeLink } from './connect.js';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let S = null, say = () => {}, picked = null, picSrc = '', lineSel = null;      // lineSel: [chain, step] of the clicked line

// What the page sends to Save: the vessels, the chains, the Fermenter answers and where each piece sits on the guide picture
export function connectState() {
  return S ? { vessels: S.parts.vessels, chains: S.chains, fermenters: S.fermenters, places: S.places } : null;
}

export function startConnect(data, { toast } = {}) {
  say = toast || say;
  if (!data) return;
  // a new conversion starts again from its guesses; Back and Next keep the brewer's answers
  if (!S || S.from !== data) S = { from: data, parts: structuredClone(data.parts), chains: structuredClone(data.chains), fermenters: structuredClone(data.fermenters), places: {}, pictures: data.pictures ?? {}, tabs: data.tabs ?? [] };
  wire();
  pictureChoices();
  renderAll();
}

function renderAll() { renderVessels(); renderChains(); renderFerm(); renderPicture(); }

// ---- the vessels
function renderVessels() {
  $('#cnVessels').innerHTML = `<table class="cnTable"><tr><th>Vessel</th><th>Side</th><th></th></tr>${S.parts.vessels.map((v, i) => `<tr>
    <td><input data-v="${i}" data-f="name" value="${esc(v.name)}" maxlength="40" title="The vessel's name"></td>
    <td><select data-v="${i}" data-f="side" title="Hot Side vessels are joined here; a Fermenter (Cold Side) has its own questions">
      <option value="hot"${v.side === 'hot' ? ' selected' : ''}>Hot Side</option><option value="cold"${v.side === 'cold' ? ' selected' : ''}>Cold Side (Fermenter)</option></select></td>
    <td><button data-vdel="${i}" title="Remove this vessel (the guess was wrong)">✖</button></td></tr>`).join('')}</table>`;
}
function vesselEdit(e) {
  const i = e.target.dataset.v; if (i === undefined) return;
  const v = S.parts.vessels[i], f = e.target.dataset.f;
  if (f === 'name') v.name = e.target.value.trim() || v.name;
  else { v.side = e.target.value; syncFerm(); }
  renderChains(); renderFerm(); renderPicture();
}
function syncFerm() {
  const cold = S.parts.vessels.filter(v => v.side === 'cold').map(v => v.key);
  S.fermenters = S.fermenters.filter(f => cold.includes(f.vessel));
  for (const k of cold) if (!S.fermenters.some(f => f.vessel === k)) S.fermenters.push({ vessel: k, cooling: 'none', heating: 'none', feed: '', ret: '', coolPump: '', warmPump: '', probe: '', pressure: '', source: 'you' });
}

// ---- the chains
const items = () => [...S.parts.pumps, ...S.parts.valves];
// every end there is, for the drop-down lists: value = endKey (QD and Supply Manifold get their extra answers next to it)
function endOptions(sel, { start = false } = {}) {
  const used = usedIds(S.chains, S.fermenters), key = endKey(sel);
  const opt = (e, text) => { const k = endKey(e); return `<option value="${esc(k)}"${k === key ? ' selected' : ''}>${esc(text)}</option>`; };
  const mark = i => (used.has(i.id) && !(sel && sel.id === i.id) ? ' (used)' : '');
  const v = S.parts.vessels.filter(x => x.side === 'hot').map(x => `<optgroup label="${esc(x.name)}">${OPENINGS.map(([k, n]) => opt({ kind: 'vessel', key: x.key, at: k }, `${x.name} ${n}`)).join('')}</optgroup>`).join('');
  const p = `<optgroup label="Pumps">${S.parts.pumps.map(i => opt({ kind: 'pump', id: i.id }, `${i.label} ${start ? 'Out' : 'In'}${mark(i)}`)).join('')}</optgroup>`;
  const va = `<optgroup label="Valves">${S.parts.valves.map(i => opt({ kind: 'valve', id: i.id }, i.label + mark(i))).join('')}</optgroup>`;
  const qd = sel?.kind === 'qd' ? sel : { kind: 'qd' }, mf = sel?.kind === 'manifold' ? sel : { kind: 'manifold' };
  const ends = `<optgroup label="Ends">${opt({ kind: 'tap' }, 'Tap Water')}${opt({ kind: 'drain' }, 'Drain')}${opt(qd, 'Quick Disconnect (QD)')}${opt(mf, 'Supply Manifold')}${start ? '' : opt({ kind: 'none' }, 'Not connected')}</optgroup>`;
  return v + p + va + ends;
}
function endFromKey(k, old) {
  const [kind, a, b] = k.split(':');
  if (kind === 'vessel') return { kind, key: a, at: b };
  if (kind === 'pump') return { kind, id: k.slice(5), side: old?.side };
  if (kind === 'valve') return { kind, id: k.slice(6) };
  if (kind === 'qd') return { kind, sex: old?.kind === 'qd' ? old.sex : 'male', shut: old?.kind === 'qd' ? old.shut : false, n: old?.kind === 'qd' ? old.n : nextN('qd') };
  if (kind === 'manifold') return { kind, n: old?.kind === 'manifold' ? old.n : nextN('manifold') };
  return { kind };
}
function nextN(kind) { const ns = S.chains.flatMap(c => [c.start, ...c.steps.map(s => s.to)]).filter(e => e?.kind === kind).map(e => e.n || 1); return ns.length ? Math.max(...ns) + 1 : 1; }
// the extra answers a QD or a Supply Manifold needs
function extras(e, path) {
  if (e?.kind === 'qd') return `<select data-x="${path}" data-f="sex" title="Male or Female: it mates with the other kind, on the hose or the manifold"><option value="male"${e.sex !== 'female' ? ' selected' : ''}>Male</option><option value="female"${e.sex === 'female' ? ' selected' : ''}>Female</option></select>
    <select data-x="${path}" data-f="shut" title="Open: flow passes whether or not its mate is on. Shut-off: flow passes only while its mate is connected (Rule 5.28)"><option value="open"${!e.shut ? ' selected' : ''}>Open</option><option value="shut"${e.shut ? ' selected' : ''}>Shut-off</option></select>
    <input data-x="${path}" data-f="n" type="number" min="1" max="99" value="${e.n || 1}" title="Which QD (the same number is the same QD)" class="num">`;
  if (e?.kind === 'manifold') return `<input data-x="${path}" data-f="n" type="number" min="1" max="99" value="${e.n || 1}" title="Which Supply Manifold (the same number is the same one, Rule 5.35)" class="num">`;
  return '';
}
const SOURCE = { name: 'guess from the names', script: 'guess from the Scripts', picture: 'guess from the BruControl picture', ai: 'from the AI, check it', guess: 'guess' };
function renderChains() {
  const box = $('#cnChains');
  if (!S.chains.length) box.innerHTML = '<p class="muted">Nothing is joined yet. Start a new chain, join pieces on the picture, or read an AI answer.</p>';
  else box.innerHTML = S.chains.map((c, ci) => {
    const rows = c.steps.map((s, si) => {
      const prev = si ? c.steps[si - 1].to : c.start;
      const lead = prev?.kind === 'pump' ? `<span class="muted small">${esc(endText({ ...prev, side: 'out' }, S.parts))}</span> ` : '';
      const tag = s.source && s.source !== 'you' && !s.ok ? `<span class="cnTag" title="Click ✓ when it is right">${esc(SOURCE[s.source] ?? 'guess')}</span><button data-ok="${ci}:${si}" title="It is right">✓</button>` : '';
      return `<div class="cnStep">${lead}<span class="cnArrow">connected to</span>
        <select data-to="${ci}:${si}" title="What the piece above is connected to">${endOptions(s.to)}</select>${extras(s.to, `${ci}:${si}`)}
        <select data-by="${ci}:${si}" title="Joined by a Hose or a Pipe (asked for each connection)"><option value="pipe"${s.by !== 'hose' ? ' selected' : ''}>by Pipe</option><option value="hose"${s.by === 'hose' ? ' selected' : ''}>by Hose</option></select>
        ${tag}<button data-del="${ci}:${si}" title="Remove this piece and the ones after it">✖</button></div>`;
    }).join('');
    const last = c.steps.at(-1)?.to ?? c.start;
    return `<div class="cnChain"><div class="cnStep"><b>Start</b> <select data-start="${ci}" title="Where this chain starts">${endOptions(c.start, { start: true })}</select>${extras(c.start, `${ci}:s`)}</div>${rows}
      ${isFinal(last) ? `<p class="small muted">Ends at ${esc(endText(last, S.parts))}.</p>` : `<button data-more="${ci}" title="Add the next piece">➕ What is connected to that?</button>`}</div>`;
  }).join('');
  const loose = looseItems(S.parts, S.chains, S.fermenters);
  $('#cnLoose').innerHTML = loose.length ? `<h3>Not joined yet (${loose.length})</h3><p class="small muted">Each one left gets its own chain. A missing answer leaves it loose, never a wrong pipe.</p>
    <div class="cnLooseList">${loose.map(i => `<button data-loose="${esc(i.id)}" title="Start a chain at ${esc(i.label)}">${i.kind === 'pump' ? '⚙' : '⧓'} ${esc(i.label)}</button>`).join('')}</div>` : '<p class="small">✅ Every pump and valve is joined.</p>';
  drawLines();
}
const at = v => v.split(':').map(x => (x === 's' ? 's' : Number(x)));
function chainChange(e) {
  const t = e.target, d = t.dataset;
  if (d.start !== undefined) { const c = S.chains[d.start]; c.start = endFromKey(t.value, c.start); if (c.start.kind === 'pump') c.start.side = 'out'; }
  else if (d.to) { const [ci, si] = at(d.to), s = S.chains[ci].steps[si]; s.to = endFromKey(t.value, s.to); if (s.to.kind === 'pump') s.to.side = 'in'; s.source = 'you'; s.by = s.to.kind === 'qd' ? 'hose' : s.by;
    if (isFinal(s.to)) S.chains[ci].steps.splice(si + 1); }
  else if (d.by) { const [ci, si] = at(d.by), s = S.chains[ci].steps[si]; s.by = t.value; s.source = 'you'; }
  else if (d.x) {
    const [ci, si] = at(d.x), c = S.chains[ci], end = si === 's' ? c.start : c.steps[si].to;
    if (d.f === 'sex') end.sex = t.value; else if (d.f === 'shut') end.shut = t.value === 'shut'; else end.n = Math.max(1, Math.min(99, Number(t.value) || 1));
  } else return;
  renderChains(); renderPicture();
}
function chainClick(e) {
  const d = e.target.dataset;
  if (d.more !== undefined) { const c = S.chains[d.more], last = c.steps.at(-1)?.to ?? c.start; c.steps.push({ to: { kind: 'none' }, by: guessBy(last, null), source: 'you' }); }
  else if (d.del) { const [ci, si] = at(d.del); S.chains[ci].steps.splice(si); if (!S.chains[ci].steps.length) S.chains.splice(ci, 1); }
  else if (d.ok) { const [ci, si] = at(d.ok); S.chains[ci].steps[si].ok = true; }
  else if (d.loose) { const i = items().find(x => x.id === d.loose); S.chains.push({ start: i.kind === 'pump' ? { kind: 'pump', id: i.id, side: 'out' } : { kind: 'valve', id: i.id }, steps: [{ to: { kind: 'none' }, by: 'pipe', source: 'you' }] }); }
  else return;
  renderChains(); renderPicture();
}

// ---- the Fermenters
function renderFerm() {
  syncFerm();
  const card = $('#cnFermCard'); card.classList.toggle('hidden', !S.fermenters.length);
  const pick = (list, val, f, i, none, title) => `<select data-fm="${i}" data-f="${f}" title="${esc(title)}"><option value="">${none}</option>${list.map(x => `<option value="${esc(x.id ?? x.name)}"${(x.id ?? x.name) === val ? ' selected' : ''}>${esc(x.label)}</option>`).join('')}</select>`;
  const pairs = (list, val, f, i, title) => `<select data-fm="${i}" data-f="${f}" title="${esc(title)}">${list.map(([k, n]) => `<option value="${k}"${k === val ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
  $('#cnFerm').innerHTML = S.fermenters.map((f, i) => {
    const v = S.parts.vessels.find(x => x.key === f.vessel);
    return `<h3>${esc(v?.name ?? f.vessel)}${f.source !== 'you' ? ' <span class="cnTag">guess from the names and Scripts</span>' : ''}</h3><table class="cnTable">
      <tr><th>How is it cooled?</th><td>${pairs(COOLING, f.cooling, 'cooling', i, 'Glycol coil, jacket, chamber, wrap or not cooled')}</td></tr>
      <tr><th>How is it warmed?</th><td>${pairs(HEATING, f.heating, 'heating', i, 'How the fermenter is warmed')}</td></tr>
      <tr><th>Valve that feeds the glycol</th><td>${pick(S.parts.valves, f.feed, 'feed', i, 'None', 'The valve that sends the cold glycol in')}</td></tr>
      <tr><th>Valve that returns the glycol</th><td>${pick(S.parts.valves, f.ret, 'ret', i, 'None', 'The valve the glycol goes back through')}</td></tr>
      <tr><th>Cooling pump (glycol chiller)</th><td>${pick(S.parts.pumps, f.coolPump, 'coolPump', i, 'None', 'The pump that moves the cold glycol')}</td></tr>
      <tr><th>Warming pump (warm tank)</th><td>${pick(S.parts.pumps, f.warmPump, 'warmPump', i, 'None', 'The pump that moves the warm water')}</td></tr>
      <tr><th>Its temperature probe</th><td>${esc(f.probe || 'None found')}</td></tr><tr><th>Its pressure sensor</th><td>${esc(f.pressure || 'None found')}</td></tr>
    </table>`;
  }).join('');
}
function fermChange(e) {
  const d = e.target.dataset; if (d.fm === undefined) return;
  const f = S.fermenters[d.fm]; f[d.f] = e.target.value; f.source = 'you';
  renderChains(); renderFerm(); renderPicture();
}

// ---- the guide picture: the BruControl Tab's background picture, or a photo or drawing from this computer (it stays here)
function pictureChoices() {
  const sel = $('#cnPicPick'), tabs = Object.keys(S.pictures);
  sel.innerHTML = `<option value="">No picture (just the pieces)</option>${tabs.map(t => `<option value="tab:${esc(t)}">BruControl Tab "${esc(t)}" background</option>`).join('')}${picSrc.startsWith('data:') ? '<option value="file">My photo or drawing</option>' : ''}`;
  if (!sel.dataset.done) { sel.value = tabs[0] ? `tab:${tabs[0]}` : ''; sel.dataset.done = '1'; usePicture(sel.value); }
}
function usePicture(v) {
  if (v.startsWith('tab:')) picSrc = '/api/picture?tab=' + encodeURIComponent(v.slice(4));
  else if (v !== 'file') picSrc = '';
  S.picTab = v.startsWith('tab:') ? v.slice(4) : '';
  renderPicture();
}
// where a piece sits: what the brewer dragged, or where BruControl had it on that Tab's picture, or a tidy row
function placeOf(key, i, n, row, item) {
  if (S.places[key]) return S.places[key];
  const tab = S.tabs.find(t => t.name === S.picTab), pic = S.pictures[S.picTab];
  if (item && tab && item.tab === S.picTab) { const W = pic?.w || tab.width, H = pic?.h || tab.height; return { x: Math.min(0.97, (item.x + item.w / 2) / W), y: Math.min(0.97, (item.y + item.h / 2) / H) }; }
  const per = Math.max(1, Math.ceil(n / (row === 0 ? 1 : 2)));
  const r = row === 0 ? 0 : row + Math.floor(i / per) * 0.5;
  return { x: 0.06 + 0.88 * ((i % per) + 0.5) / per, y: 0.1 + 0.27 * r };
}
function pieces() {
  const hot = S.parts.vessels.filter(v => v.side === 'hot');
  const ferm = new Set(S.fermenters.flatMap(f => [f.feed, f.ret, f.coolPump, f.warmPump]));
  const pumps = S.parts.pumps.filter(i => !ferm.has(i.id)), valves = S.parts.valves.filter(i => !ferm.has(i.id));
  return [...hot.map((v, i) => ({ key: 'vessel:' + v.key, kind: 'vessel', label: v.name, end: { kind: 'vessel', key: v.key }, at: placeOf('vessel:' + v.key, i, hot.length, 0) })),
    ...pumps.map((p, i) => ({ key: p.id, kind: 'pump', label: p.label, end: { kind: 'pump', id: p.id }, at: placeOf(p.id, i, pumps.length, 1, p) })),
    ...valves.map((p, i) => ({ key: p.id, kind: 'valve', label: p.label, end: { kind: 'valve', id: p.id }, at: placeOf(p.id, i, valves.length, 2, p) }))];
}
function renderPicture() {
  const img = $('#cnPicImg'), box = $('#cnPic');
  if (picSrc) { if (img.getAttribute('src') !== picSrc) img.src = picSrc; img.classList.remove('hidden'); box.classList.add('hasPic'); }
  else { img.removeAttribute('src'); img.classList.add('hidden'); box.classList.remove('hasPic'); }
  const used = usedIds(S.chains, S.fermenters);
  $('#cnChips').innerHTML = pieces().map(p => `<div class="cnChip ${p.kind}${picked === p.key ? ' picked' : ''}${p.kind !== 'vessel' && !used.has(p.key) ? ' loose' : ''}" data-chip="${esc(p.key)}"
    style="left:${(p.at.x * 100).toFixed(2)}%;top:${(p.at.y * 100).toFixed(2)}%" title="${esc(p.label)}: drag it to its place; click it, then click another piece to join them">${p.kind === 'vessel' ? '🛢' : p.kind === 'pump' ? '⚙' : '⧓'} ${esc(p.label)}</div>`).join('');
  drawLines();
}
// a line for each connection between two pieces on the picture
function drawLines() {
  const svg = $('#cnLines'); if (!svg || !S) return;
  const pos = new Map(pieces().map(p => [p.key, p.at]));
  const key = e => e?.kind === 'vessel' ? 'vessel:' + e.key : e?.id;
  const lines = [];
  // blue = a Pipe (and its fittings), yellow = a Hose (Fritz, 2026-11-08); each has a wide see-through line on top to click
  S.chains.forEach((c, ci) => { let a = c.start; c.steps.forEach((s, si) => {
    const p = pos.get(key(a)), q = pos.get(key(s.to));
    if (p && q) {
      const xy = `x1="${p.x * 100}%" y1="${p.y * 100}%" x2="${q.x * 100}%" y2="${q.y * 100}%"`, on = lineSel?.[0] === ci && lineSel?.[1] === si;
      lines.push(`<line ${xy} class="${s.by === 'hose' ? 'hose' : 'pipe'}${on ? ' sel' : ''}"/><line ${xy} class="hit" data-ci="${ci}" data-si="${si}"><title>${s.by === 'hose' ? 'Hose' : 'Pipe'}: click to pick it (Delete removes it); right-click turns a Pipe into a Hose and back</title></line>`);
    }
    a = s.to;
  }); });
  svg.innerHTML = lines.join('');
}
// a line on the picture (Fritz, 2026-11-08): a click picks it, the Delete key removes it, a right-click turns a Pipe into a Hose
// and back. Removing a link in the middle of a chain splits it in two.
function lineAt(e) { const l = e.target.closest?.('line.hit'); return l ? [Number(l.dataset.ci), Number(l.dataset.si)] : null; }
function lineClick(e) {
  const at = lineAt(e); if (!at) return;
  lineSel = lineSel && lineSel[0] === at[0] && lineSel[1] === at[1] ? null : at; picked = null;
  if (lineSel) { const c = S.chains[at[0]], a = at[1] ? c.steps[at[1] - 1].to : c.start; say(`Picked: ${endText(a, S.parts)} to ${endText(c.steps[at[1]].to, S.parts)}. Press Delete to remove it.`); }
  renderPicture();
}
function lineRight(e) {
  const at = lineAt(e); if (!at) return;
  e.preventDefault();
  const s = S.chains[at[0]].steps[at[1]]; s.by = s.by === 'hose' ? 'pipe' : 'hose'; s.source = 'you';
  say(`That connection is now a ${s.by === 'hose' ? 'Hose' : 'Pipe'}.`);
  renderChains();
}
function lineKey(e) {
  if (!lineSel || !['Delete', 'Backspace'].includes(e.key) || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName ?? '')) return;
  if ($('#cnPic')?.offsetParent === null) return;          // only while this page shows
  e.preventDefault();
  removeLink(S.chains, ...lineSel); lineSel = null;
  say('That connection is removed.');
  renderChains();
}
// click one piece, then another: they are joined (the first is connected to the second). A vessel is left from its Center Bottom
// Outlet and entered at its Right Sparge, the usual spots; change the opening in the list when it is another one.
function join(aKey, bKey) {
  const ps = pieces(), a = ps.find(p => p.key === aKey), b = ps.find(p => p.key === bKey);
  if (!a || !b) return;
  const from = a.kind === 'vessel' ? { ...a.end, at: 'cBottomOutlet' } : a.kind === 'pump' ? { ...a.end, side: 'out' } : a.end;
  const to = b.kind === 'vessel' ? { ...b.end, at: 'rSparge' } : b.kind === 'pump' ? { ...b.end, side: 'in' } : b.end;
  addLink(S.chains, { from, to, by: guessBy(from, to), source: 'you' });
  say(`Joined: ${endText(from, S.parts)} is connected to ${endText(to, S.parts)} by ${guessBy(from, to) === 'hose' ? 'Hose' : 'Pipe'}. Change it in the list if needed.`);
  renderChains();
}
let drag = null;
function chipDown(e) {
  const chip = e.target.closest('.cnChip'); if (!chip) return;
  const r = $('#cnPic').getBoundingClientRect();
  drag = { key: chip.dataset.chip, chip, r, x0: e.clientX, y0: e.clientY, moved: false };
  chip.setPointerCapture(e.pointerId);
}
function chipMove(e) {
  if (!drag) return;
  if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 4) drag.moved = true;
  if (!drag.moved) return;
  const x = Math.max(0, Math.min(1, (e.clientX - drag.r.left) / drag.r.width)), y = Math.max(0, Math.min(1, (e.clientY - drag.r.top) / drag.r.height));
  S.places[drag.key] = { x, y };
  drag.chip.style.left = x * 100 + '%'; drag.chip.style.top = y * 100 + '%';
  drawLines();
}
function chipUp() {
  if (!drag) return;
  const d = drag; drag = null;
  if (d.moved) return;
  lineSel = null;
  if (!picked) picked = d.key;
  else if (picked === d.key) picked = null;
  else { join(picked, d.key); picked = null; }
  renderPicture();
}

// ---- Ask an AI (outside the Importer)
async function askAi() {
  const q = aiQuestion({ ...S.parts, vessels: S.parts.vessels });
  try { await navigator.clipboard.writeText(q); } catch { $('#cnAiText').value = q; say('Copy the question from the box below (it could not be copied by itself).'); }
  window.open($('#cnAiSite').value, '_blank', 'noopener');
  $('#cnAiNote').textContent = 'The question is copied. On the AI site, add your picture, paste the question, then copy its answer back into the box.';
}
function readAi() {
  const r = readAiAnswer($('#cnAiText').value, S.parts);
  for (const l of r.links) addLink(S.chains, l);
  const hot = S.parts.vessels.filter(v => v.side === 'hot').length;
  $('#cnAiNote').innerHTML = `${r.links.length} connection(s) read and marked <b>from the AI, check it</b>.` +
    (r.vessels !== null && r.vessels !== hot ? ` The AI counted <b>${r.vessels}</b> Hot Side vessels; the list above has ${hot}. Add or remove one if needed.` : '') +
    (r.unread.length ? `<br>Lines that could not be read (nothing was guessed for them):<br>${r.unread.map(l => `<code>${esc(l)}</code>`).join('<br>')}` : '');
  renderChains(); renderPicture();
}

// ---- the song (Fritz's own, made with Treblo, free to use) and the old song's lines in Fritz's comic voice clip: they never play by themselves
function playToggle(id, other) {
  const a = $(id), o = $(other);
  if (!a.paused) { a.pause(); a.currentTime = 0; return; }
  if (!o.paused) { o.pause(); o.currentTime = 0; }
  a.play().catch(() => say('The sound could not be played on this computer.'));
}
function soundButtons() {
  const set = () => {
    $('#songBtn').textContent = $('#song').paused ? '▶ Play the song' : '■ Stop the song';
    $('#voiceBtn').textContent = $('#voice').paused ? '▶ Hear it' : '■ Stop';
  };
  for (const id of ['#song', '#voice']) for (const ev of ['play', 'pause', 'ended']) $(id).addEventListener(ev, set);
  set();
}

let wired = false;
function wire() {
  if (wired) return; wired = true;
  $('#cnVessels').addEventListener('change', vesselEdit);
  $('#cnVessels').addEventListener('click', e => {
    const i = e.target.dataset.vdel; if (i === undefined) return;
    const v = S.parts.vessels[i];
    S.parts.vessels.splice(i, 1);
    S.chains = S.chains.map(c => ({ ...c, steps: c.steps.filter(s => !(s.to.kind === 'vessel' && s.to.key === v.key)) })).filter(c => !(c.start.kind === 'vessel' && c.start.key === v.key) && c.steps.length);
    syncFerm(); renderAll();
  });
  $('#cnAddVessel').onclick = () => {
    let n = S.parts.vessels.length + 1; while (S.parts.vessels.some(v => v.key === 'V' + n)) n++;
    S.parts.vessels.push({ key: 'V' + n, name: 'Vessel ' + n, side: 'hot' });
    renderAll();
  };
  $('#cnChains').addEventListener('change', chainChange);
  $('#cnChains').addEventListener('click', chainClick);
  $('#cnLoose').addEventListener('click', chainClick);
  $('#cnNewChain').onclick = () => {
    const v = S.parts.vessels.find(x => x.side === 'hot');
    S.chains.push({ start: v ? { kind: 'vessel', key: v.key, at: 'cBottomOutlet' } : { kind: 'tap' }, steps: [{ to: { kind: 'none' }, by: 'pipe', source: 'you' }] });
    renderChains();
  };
  $('#cnFerm').addEventListener('change', fermChange);
  $('#cnPicPick').onchange = e => usePicture(e.target.value);
  $('#cnPicFile').onchange = e => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { picSrc = r.result; pictureChoices(); $('#cnPicPick').value = 'file'; S.picTab = ''; renderPicture(); };
    r.readAsDataURL(f);
  };
  const chips = $('#cnChips');
  const lines = $('#cnLines');
  lines.addEventListener('click', lineClick); lines.addEventListener('contextmenu', lineRight);
  document.addEventListener('keydown', lineKey);
  chips.addEventListener('pointerdown', chipDown); chips.addEventListener('pointermove', chipMove); chips.addEventListener('pointerup', chipUp);
  $('#cnAiSite').innerHTML = AI_SITES.map(([u, n]) => `<option value="${esc(u)}">${esc(n)}</option>`).join('');
  $('#cnAskAi').onclick = askAi;
  $('#cnReadAi').onclick = readAi;
  $('#songBtn').onclick = () => playToggle('#song', '#voice');
  $('#voiceBtn').onclick = () => playToggle('#voice', '#song');
  soundButtons();
}
