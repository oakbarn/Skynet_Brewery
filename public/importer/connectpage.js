// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Importer's page 6, Connect your brewery (Rule 15.4, Fritz 2026-11-07). The rules of the chains, the guesses and reading an
// AI's answer are in connect.js (shared with the Importer's server); this file only draws the page and keeps the brewer's answers.
import { OPENINGS, COOLING, HEATING, AI_SITES, endKey, endText, isFinal, addLink, guessBy, usedIds, looseItems, aiQuestion, readAiAnswer, removeLink, layoutPieces, pipePath, hosePath, JOINS, joinOf, setJoin, setFit, addTee, chainVessel, pieceKey, guessVesselTemplate } from './connect.js';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let S = null, say = () => {}, picked = null, picSrc = '', lineSel = null;      // lineSel: [chain, step] of the clicked line

// What the page sends to Save: the vessels, the chains, the Fermenter answers and where each piece sits on the guide picture
export function connectState() {
  return S ? { vessels: S.parts.vessels, chains: S.chains, fermenters: S.fermenters, places: S.places } : null;
}

// Clear Page and Restart Fresh (OakBarn Brewery, 2026-11-09): the connections go back to the first guesses (none for a Restart)
export function resetConnect(data, opts = {}) { S = null; if (data) startConnect(data, opts); }
export function startConnect(data, { toast, saved = null } = {}) {
  say = toast || say;
  if (!data) return;
  // a new conversion starts again from its guesses; Back and Next keep the brewer's answers
  // the vessels were changed on the Vessels step (renamed, Side, added or removed): take them again, keeping the templates picked here
  if (S && S.from === data && S.vv !== data.vv) {
    const tpl = new Map(S.parts.vessels.map(v => [v.key, v.template]));
    S.parts.vessels = structuredClone(data.parts.vessels).map(v => ({ ...v, ...(tpl.get(v.key) ? { template: tpl.get(v.key) } : {}) }));
    S.vv = data.vv; syncFerm();
  }
  if (!S || S.from !== data) S = { vv: data.vv, from: data, parts: structuredClone(data.parts), chains: structuredClone(data.chains), fermenters: structuredClone(data.fermenters), places: {}, pictures: data.pictures ?? {}, tabs: data.tabs ?? [] };
  // the answers kept from last time (OakBarn Brewery, 2026-11-08: come back later): the chains, fermenters, places and templates picked
  if (saved && S.from === data && !S.restored) {
    S.restored = true;
    if (Array.isArray(saved.chains)) S.chains = structuredClone(saved.chains);
    if (Array.isArray(saved.fermenters)) S.fermenters = structuredClone(saved.fermenters);
    if (saved.places && typeof saved.places === 'object') S.places = structuredClone(saved.places);
    const tpl = new Map((saved.vessels ?? []).map(v => [v.key, v.template]));
    for (const v of S.parts.vessels) if (tpl.get(v.key)) v.template = tpl.get(v.key);
  }
  wire();
  pictureChoices();
  renderAll();
  loadTemplates();
}
// the Skynet vessel formats (the Panel's own Vessel Templates and drawings, shared on this computer)
let VT = null;
async function loadTemplates() {
  if (!VT) { try { VT = await (await fetch('/api/vessel-templates', { headers: { 'X-Skynet-Importer': '1' } })).json(); if (!Array.isArray(VT)) VT = []; } catch { VT = []; } }
  for (const v of S.parts.vessels) if (!v.template) { v.template = guessVesselTemplate(v, VT); v.templateGuess = true; }
  renderVessels(); renderPicture();
}
const tplOf = v => VT?.find(t => t.id === v?.template);

function renderAll() { renderVessels(); renderChains(); renderFerm(); renderPicture(); }

// ---- the vessels
// Build your vessels, one at a time (OakBarn Brewery, 2026-11-08): "which template matches your vessel the best", with every Skynet
// vessel format as a picture to click. The answer is saved with the vessel; the Vessel Device is built from it.
function renderVessels() {
  const vs = S.parts.vessels; if (S.vi >= vs.length || !(S.vi >= 0)) S.vi = 0;
  const cur = vs[S.vi], ct = tplOf(cur);
  const build = !cur ? '' : `<div class="cnBuild"><h3>Build your vessels: Vessel ${S.vi + 1} of ${vs.length}, <b>${esc(cur.name)}</b></h3>
    <p class="small">Which template matches your vessel the best? Click the one that looks most like it.${cur.templateGuess ? ' <span class="cnTag">guess from the name</span>' : ''}</p>
    ${VT ? `<div class="cnTpls">${VT.map(t => `<button class="cnTpl${t.id === cur.template ? ' on' : ''}" data-tpl="${esc(t.id)}" title="${esc(t.name)}${t.integrated ? ' (heater built in)' : ''}"><img src="${esc(t.image)}" alt="" loading="lazy"><span>${esc(t.name)}</span></button>`).join('')}</div>` : '<p class="muted">Loading the vessel templates…</p>'}
    <div class="buttons"><button data-vstep="-1"${S.vi ? '' : ' disabled'}>◀ Previous vessel</button><span class="spacer"></span>
      ${S.vi + 1 < vs.length ? `<button class="primary" data-vstep="1" title="Keep this template and go on to the next vessel">Save, next vessel ▶ (${esc(vs[S.vi + 1].name)})</button>` : `<span class="small">${ct ? '✅ ' + esc(cur.name) + ': ' + esc(ct.name) : ''}</span>`}</div></div>`;
  $('#cnVessels').innerHTML = `<table class="cnTable"><tr><th>Vessel</th><th>Side</th><th>Template</th><th></th></tr>${vs.map((v, i) => `<tr${i === S.vi ? ' class="on"' : ''}>
    <td><input data-v="${i}" data-f="name" value="${esc(v.name)}" maxlength="40" title="The vessel's name"></td>
    <td><select data-v="${i}" data-f="side" title="Hot Side vessels are joined here; a Fermenter (Cold Side) has its own questions">
      <option value="hot"${v.side === 'hot' ? ' selected' : ''}>Hot Side</option><option value="cold"${v.side === 'cold' ? ' selected' : ''}>Cold Side (Fermenter)</option></select></td>
    <td><button class="cnTplPick" data-vpick="${i}" title="Pick this vessel's template">${tplOf(v) ? `<img src="${esc(tplOf(v).image)}" alt="">${esc(tplOf(v).name)}` : 'Pick…'}</button></td>
    <td><button data-vdel="${i}" title="Remove this vessel (the guess was wrong)">✖</button></td></tr>`).join('')}</table>${build}`;
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
  const tees = [...new Set(S.chains.flatMap(c => [c.start, ...c.steps.map(s => s.to)]).filter(e => e?.kind === 'tee').map(e => e.n || 1))].sort((a, b) => a - b);
  const te = tees.length ? `<optgroup label="Tees">${tees.map(n => opt({ kind: 'tee', n }, `Tee ${n}`)).join('')}</optgroup>` : '';
  const qd = sel?.kind === 'qd' ? sel : { kind: 'qd' }, mf = sel?.kind === 'manifold' ? sel : { kind: 'manifold' };
  const ends = `<optgroup label="Ends">${opt({ kind: 'tap' }, 'Tap Water')}${opt({ kind: 'drain' }, 'Drain')}${opt(qd, 'Quick Disconnect (QD)')}${opt(mf, 'Supply Manifold')}${start ? '' : opt({ kind: 'none' }, 'Not connected')}</optgroup>`;
  return v + p + va + te + ends;
}
function endFromKey(k, old) {
  const [kind, a, b] = k.split(':');
  if (kind === 'vessel') return { kind, key: a, at: b };
  if (kind === 'pump') return { kind, id: k.slice(5), side: old?.side };
  if (kind === 'valve') return { kind, id: k.slice(6) };
  if (kind === 'qd') return { kind, sex: old?.kind === 'qd' ? old.sex : 'male', shut: old?.kind === 'qd' ? old.shut : false, n: old?.kind === 'qd' ? old.n : nextN('qd') };
  if (kind === 'manifold') return { kind, n: old?.kind === 'manifold' ? old.n : nextN('manifold') };
  if (kind === 'tee') return { kind, n: Number(a) || 1 };
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
// One vessel at a time (OakBarn Brewery, 2026-11-08): a button for each Hot Side vessel, Other chains (no vessel) and All. The chains
// of the vessel picked are shown; "Save, next vessel" marks it done (✓) and goes on to the next one. Every answer is kept as you go.
function hotKeys() { return S.parts.vessels.filter(v => v.side === 'hot').map(v => v.key); }
function listPage() {
  const pages = [...hotKeys(), 'other', 'all'];
  if (!pages.includes(S.listV)) S.listV = pages[0];
  return pages;
}
function pagerHtml(pages) {
  const name = k => k === 'other' ? 'Other chains' : k === 'all' ? 'All' : S.parts.vessels.find(v => v.key === k)?.name ?? k;
  return `<div class="cnPager">${pages.map(k => `<button data-page="${esc(k)}" class="${k === S.listV ? 'primary' : ''}" title="${k === 'all' ? 'Every chain at once' : k === 'other' ? 'Chains that reach no vessel' : 'Only what is joined to this vessel'}">${S.doneV?.[k] ? '✓ ' : ''}${esc(name(k))}</button>`).join('')}</div>`;
}
const FIT_TIP = 'A pipe that turns left or right needs a fitting: an Elbow, or a Tee (the Tee goes on down, and its third opening starts a branch)';
function renderChains() {
  const box = $('#cnChains'), pages = listPage(), hot = hotKeys(), page = S.listV;
  const show = S.chains.map((c, ci) => page === 'all' || chainVessel(S.chains, ci, hot) === (page === 'other' ? '' : page));
  const vi = hot.indexOf(page), nextV = vi >= 0 ? (hot[vi + 1] ?? 'other') : '';
  const nextName = nextV === 'other' ? 'Other chains' : S.parts.vessels.find(v => v.key === nextV)?.name;
  const foot = nextV ? `<div class="buttons"><span class="spacer"></span><button class="primary" data-nextv="${esc(nextV)}" title="Keep these answers, mark this vessel done and go on to the next one">Save, next vessel ▶ (${esc(nextName)})</button></div>` : '';
  if (!S.chains.length) box.innerHTML = pagerHtml(pages) + '<p class="muted">Nothing is joined yet. Start a new chain, join pieces on the picture, or read an AI answer.</p>';
  else box.innerHTML = pagerHtml(pages) + (show.some(Boolean) ? '' : `<p class="muted">Nothing is joined to ${page === 'other' ? 'no vessel' : 'this vessel'} yet. Start a new chain below.</p>`) + S.chains.map((c, ci) => {
    if (!show[ci]) return '';
    const rows = c.steps.map((s, si) => {
      const prev = si ? c.steps[si - 1].to : c.start;
      const lead = prev?.kind === 'pump' ? `<span class="muted small">${esc(endText({ ...prev, side: 'out' }, S.parts))}</span> ` : '';
      const tag = s.source && s.source !== 'you' && !s.ok ? `<span class="cnTag" title="Click ✓ when it is right">${esc(SOURCE[s.source] ?? 'guess')}</span><button data-ok="${ci}:${si}" title="It is right">✓</button>` : '';
      return `<div class="cnStep">${lead}<span class="cnArrow">connected to</span>
        <select data-to="${ci}:${si}" title="What the piece above is connected to">${endOptions(s.to)}</select>${extras(s.to, `${ci}:${si}`)}
        <select data-by="${ci}:${si}" title="How it is joined: a Pipe straight down, a Pipe to the left or right (with an Elbow or a Tee), or a Hose">${JOINS.map(([k, n]) => `<option value="${k}"${joinOf(s) === k ? ' selected' : ''}>${n}</option>`).join('')}</select>
        ${['left', 'right'].includes(joinOf(s)) ? `<select data-fit="${ci}:${si}" title="${FIT_TIP}"><option value="elbow"${s.to?.kind !== 'tee' ? ' selected' : ''}>with an Elbow</option><option value="tee"${s.to?.kind === 'tee' ? ' selected' : ''}>with a Tee</option></select>` : ''}
        ${tag}<button data-tee="${ci}:${si}" title="Add a Tee after this piece: the line goes on through it, and a branch starts at it">⊤ Tee</button><button data-del="${ci}:${si}" title="Remove this piece and the ones after it">✖</button></div>`;
    }).join('');
    const last = c.steps.at(-1)?.to ?? c.start;
    return `<div class="cnChain"><div class="cnStep"><b>Start</b> <select data-start="${ci}" title="Where this chain starts">${endOptions(c.start, { start: true })}</select>${extras(c.start, `${ci}:s`)}</div>${rows}
      ${isFinal(last) ? `<p class="small muted">Ends at ${esc(endText(last, S.parts))}.</p>` : `<button data-more="${ci}" title="Add the next piece">➕ What is connected to that?</button>`}</div>`;
  }).join('') + foot;
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
  else if (d.by) { const [ci, si] = at(d.by), s = S.chains[ci].steps[si]; setJoin(s, t.value); s.source = 'you'; }
  else if (d.fit) { const [ci, si] = at(d.fit), why = setFit(S.chains, ci, si, t.value); if (why) say(why); }
  else if (d.x) {
    const [ci, si] = at(d.x), c = S.chains[ci], end = si === 's' ? c.start : c.steps[si].to;
    if (d.f === 'sex') end.sex = t.value; else if (d.f === 'shut') end.shut = t.value === 'shut'; else end.n = Math.max(1, Math.min(99, Number(t.value) || 1));
  } else return;
  if (!Object.keys(S.places).length) S.layout = null;      // nothing dragged yet: the picture follows the answers
  renderChains(); renderPicture();
}
function chainClick(e) {
  const d = e.target.dataset;
  if (d.more !== undefined) { const c = S.chains[d.more], last = c.steps.at(-1)?.to ?? c.start; c.steps.push({ to: { kind: 'none' }, by: guessBy(last, null), source: 'you' }); }
  else if (d.del) { const [ci, si] = at(d.del); S.chains[ci].steps.splice(si); if (!S.chains[ci].steps.length) S.chains.splice(ci, 1); }
  else if (d.ok) { const [ci, si] = at(d.ok); S.chains[ci].steps[si].ok = true; }
  else if (d.tee) { const [ci, si] = at(d.tee), t = addTee(S.chains, ci, si); say(`Tee ${t.n} added: the line goes on through it, and its branch is the new chain under it.`); if (!Object.keys(S.places).length) S.layout = null; }
  else if (d.page) { S.listV = d.page; }
  else if (d.nextv) { S.doneV = { ...S.doneV, [S.listV]: true }; S.listV = d.nextv; $('#cnChainCard').scrollTop = 0; }
  else if (d.loose) { const i = items().find(x => x.id === d.loose); S.chains.push({ start: i.kind === 'pump' ? { kind: 'pump', id: i.id, side: 'out' } : { kind: 'valve', id: i.id }, steps: [{ to: { kind: 'none' }, by: 'pipe', source: 'you' }] }); S.listV = 'other'; }
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
// what the brewer dragged, or where BruControl had it on that Tab's picture, or the tidy columns (layoutPieces, OakBarn Brewery
// 2026-11-08: twice as many columns as vessels, joined pieces stacked down a column)
function placeOf(key, item) {
  if (S.places[key]) return S.places[key];
  const tab = S.tabs.find(t => t.name === S.picTab), pic = S.pictures[S.picTab];
  if (item && tab && item.tab === S.picTab) { const W = pic?.w || tab.width, H = pic?.h || tab.height; return { x: Math.min(0.97, (item.x + item.w / 2) / W), y: Math.min(0.97, (item.y + item.h / 2) / H) }; }
  return S.layout?.[key] ?? { x: 0.5, y: 0.5 };
}
function basePieces() {
  const hot = S.parts.vessels.filter(v => v.side === 'hot');
  const ferm = new Set(S.fermenters.flatMap(f => [f.feed, f.ret, f.coolPump, f.warmPump]));
  const pumps = S.parts.pumps.filter(i => !ferm.has(i.id)), valves = S.parts.valves.filter(i => !ferm.has(i.id));
  return [...hot.map(v => ({ key: 'vessel:' + v.key, kind: 'vessel', label: v.name, end: { kind: 'vessel', key: v.key } })),
    ...pumps.map(p => ({ key: p.id, kind: 'pump', label: p.label, end: { kind: 'pump', id: p.id }, item: p })),
    ...valves.map(p => ({ key: p.id, kind: 'valve', label: p.label, end: { kind: 'valve', id: p.id }, item: p })),
    ...[...new Set(S.chains.flatMap(c => [c.start, ...c.steps.map(s => s.to)]).filter(e => e?.kind === 'tee').map(e => e.n || 1))]
      .map(n => ({ key: 'tee:' + n, kind: 'tee', label: 'Tee ' + n, end: { kind: 'tee', n } }))];
}
function pieces() {
  const base = basePieces();
  if (!S.layout || base.some(p => !S.layout[p.key])) S.layout = layoutPieces(base, S.chains, { set: !!S.layoutSet });
  return base.map(p => ({ ...p, at: placeOf(p.key, p.item) }));
}
// Set (OakBarn Brewery): the left most vessel one column right, the right most one column left, a column between all vessels;
// Start: the first tidy columns again. Either one puts every piece back in its column (what was dragged is forgotten).
function tidy(set) { S.layoutSet = set; S.layout = null; S.places = {}; renderPicture(); say(set ? 'Set: the vessels are one column in from each side, with a column between them.' : 'Every piece is back in its first column.'); }
function renderPicture() {
  const img = $('#cnPicImg'), box = $('#cnPic');
  if (picSrc) { if (img.getAttribute('src') !== picSrc) img.src = picSrc; img.classList.remove('hidden'); box.classList.add('hasPic'); }
  else { img.removeAttribute('src'); img.classList.add('hidden'); box.classList.remove('hasPic'); }
  const used = usedIds(S.chains, S.fermenters);
  // a vessel looks like a vessel, a pump like a pump (the Skynet drawings), a valve like a valve
  $('#cnChips').innerHTML = pieces().map(p => `<div class="cnChip ${p.kind}${picked === p.key ? ' picked' : ''}${p.kind !== 'vessel' && !used.has(p.key) ? ' loose' : ''}" data-chip="${esc(p.key)}"
    style="left:${(p.at.x * 100).toFixed(2)}%;top:${(p.at.y * 100).toFixed(2)}%" title="${esc(p.label)}: drag it to its place; click it, then click another piece to join them"><img src="${esc(p.kind === 'vessel' && tplOf(S.parts.vessels.find(v => 'vessel:' + v.key === p.key))?.image || CHIP_PICS[p.kind])}" alt="" draggable="false"><span>${esc(p.label)}</span></div>`).join('');
  drawLines();
}
const CHIP_PICS = { vessel: '/media/Images/Skynet/Vessels/Skynet_Generic_Brew_Vessel_Widget.svg', pump: '/media/Images/Skynet/Pumps/Pump_Red_Rip_Off.svg',
  valve: '/media/Images/Skynet/Valves/Motorized_TC15_Ball_Valve_Vertical.svg', tee: '/media/Images/Skynet/Other_Equipment/Skynet_TC15_EqualTee.svg' };
// a line for each connection between two pieces on the picture
function drawLines() {
  const svg = $('#cnLines'); if (!svg || !S) return;
  const r = $('#cnPic').getBoundingClientRect(), W = r.width || 800, H = r.height || 600;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const pos = new Map(pieces().map(p => [p.key, { x: p.at.x * W, y: p.at.y * H }]));
  const key = pieceKey;
  const lines = [];
  // blue = a Pipe (and its fittings), yellow = a Hose (Fritz, 2026-11-08); each has a wide see-through line on top to click
  S.chains.forEach((c, ci) => { let a = c.start; c.steps.forEach((s, si) => {
    const p = pos.get(key(a)), q = pos.get(key(s.to));
    if (p && q) {
      // a Pipe only across, up and down or at 45 degrees; a Hose hangs in a curve (OakBarn Brewery, 2026-11-08)
      const d = s.by === 'hose' ? hosePath(p, q) : pipePath(p, q), on = lineSel?.[0] === ci && lineSel?.[1] === si;
      lines.push(`<path d="${d}" class="${s.by === 'hose' ? 'hose' : 'pipe'}${on ? ' sel' : ''}"/><path d="${d}" class="hit" data-ci="${ci}" data-si="${si}"><title>${s.by === 'hose' ? 'Hose' : 'Pipe'}: click to pick it (Delete removes it); right-click turns a Pipe into a Hose and back</title></path>`);
    }
    a = s.to;
  }); });
  svg.innerHTML = lines.join('');
}
// a line on the picture (Fritz, 2026-11-08): a click picks it, the Delete key removes it, a right-click turns a Pipe into a Hose
// and back. Removing a link in the middle of a chain splits it in two.
function lineAt(e) { const l = e.target.closest?.('.hit'); return l ? [Number(l.dataset.ci), Number(l.dataset.si)] : null; }
function lineClick(e) {
  const at = lineAt(e); if (!at) return;
  lineSel = lineSel && lineSel[0] === at[0] && lineSel[1] === at[1] ? null : at; picked = null;
  if (lineSel) { const c = S.chains[at[0]], a = at[1] ? c.steps[at[1] - 1].to : c.start; say(`Picked: ${endText(a, S.parts)} to ${endText(c.steps[at[1]].to, S.parts)}. Press Delete to remove it.`); }
  renderPicture();
}
function lineRight(e) {
  const at = lineAt(e); if (!at) return;
  e.preventDefault();
  const s = S.chains[at[0]].steps[at[1]]; setJoin(s, s.by === 'hose' ? 'pipe' : 'hose'); s.source = 'you';
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
    const b = e.target.closest('button'), d = b?.dataset ?? {};
    if (d.tpl) { const v = S.parts.vessels[S.vi]; v.template = d.tpl; v.templateGuess = false; renderVessels(); renderPicture(); return; }
    if (d.vstep) { S.vi += Number(d.vstep); renderVessels(); $('#cnVessels').scrollIntoView({ block: 'start' }); return; }
    if (d.vpick) { S.vi = Number(d.vpick); renderVessels(); return; }
    const i = d.vdel; if (i === undefined) return;
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
    const v = S.parts.vessels.find(x => x.side === 'hot' && x.key === S.listV) ?? S.parts.vessels.find(x => x.side === 'hot');
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
  // the picture on its own screen, so it is larger (OakBarn Brewery, 2026-11-08)
  // the list on its own screen too; Next and Back move between the picture and the list (OakBarn Brewery, 2026-11-08)
  const stage = $('#cnStage'), listCard = $('#cnChainCard');
  const show = which => {   // which: 'pic', 'list' or '' (the page)
    stage.classList.toggle('full', which === 'pic'); listCard.classList.toggle('full', which === 'list');
    document.body.classList.toggle('cnFullOpen', !!which);
    if (which === 'pic') renderPicture(); else renderChains();
    if (which === 'list') listCard.scrollTop = 0;
  };
  $('#cnOpenPic').onclick = () => show('pic');
  $('#cnClosePic').onclick = () => show('');
  $('#cnPicNext').onclick = () => show('list');
  $('#cnOpenList').onclick = () => show('list');
  $('#cnListBack').onclick = () => show('pic');
  $('#cnListNext').onclick = () => { show(''); $('#cnFermCard').scrollIntoView({ block: 'start' }); };
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && (stage.classList.contains('full') || listCard.classList.contains('full'))) show('');
  });
  $('#cnSet').onclick = () => tidy(true);
  $('#cnStart').onclick = () => tidy(false);
  window.addEventListener('resize', () => { if (S) drawLines(); });
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
