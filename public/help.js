// Help tab: the manual. Pages are Markdown files in the help/ folder on the Brew Panel computer (see lib/help.js).
// Everyone can read them; admins can edit, add and delete pages here. Help shows the page for the screen you came from
// (helpmap.js says which); it runs in the Help window (help.html) and, when a browser blocks that window, on the panel's Help page.
import { watchButtons } from './buttons.js';
import { LANG_KEY, refreshBalloonLang } from './hoverhelp.js';      // also the buttons' tips of this window in French (Rule 11.11)
import { brokenLinkPop, forgetHelpIndex } from './brokenlink.js';
import { showMachineNotice } from './mtnotice.js';         // machine translation notice (Rule 11.14)
const $ = s => document.querySelector(s);
if (!document.getElementById('dlg')) watchButtons();       // the Help window: one look for Cancel, Save, Close ... (public/buttons.js)
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); }
  e.append(...kids.filter(k => k != null)); return e;
};
const say = (m, bad) => { const t = $('#toast'); t.textContent = m; t.className = 'show' + (bad ? ' bad' : ''); clearTimeout(t._t); t._t = setTimeout(() => t.className = '', bad ? 5000 : 2500); };
async function call(method, url, body, raw) {
  const r = await fetch(url, { method, headers: { 'Content-Type': raw ? 'text/plain; charset=utf-8' : 'application/json' }, body: body === undefined ? undefined : raw ? body : JSON.stringify(body) });
  const d = await r.json(); if (!r.ok || d.ok === false) throw new Error(d.error || r.statusText); return d;
}

let pages = [], cur = null, trail = [], editing = false;
// The language of the Help pages (Rule 11.11, OakBarn Brewery, 2026-11-13: "French Help Only forever"): English or French. Only the
// Help is translated; the screens, buttons and labels stay English. Kept in this browser (the Help window and the panel share it).
// the language picked (Rule 11.11): kept under one key with the balloons, which follow it (public/hoverhelp.js)
export { LANG_KEY };
export const helpLang = () => { try { return localStorage.getItem(LANG_KEY) === 'fr' ? 'fr' : 'en'; } catch { return 'en'; } };
let lang = helpLang();
const lq = () => lang === 'en' ? '' : '?lang=' + lang;
// the words shown above and below a French page (the page itself is French, so these are too)
const FR = {
  missing: 'Cette page n’est pas encore traduite en français : voici la page anglaise.',
  stale: 'La page anglaise a changé depuis la traduction de cette page : elle n’est peut-être plus à jour.',
  english: 'Voir la page anglaise',
  machine: 'Traduction automatique de la page anglaise. Les boutons, les menus et les écrans restent en anglais, comme dans le programme. En cas de doute, la page anglaise fait foi.',
};
const bare = n => n.replace(/^\d+[-_]/, '');
// a Step by Step guide: its title starts "Step by Step:" (Rule 11.9)
export const isStep = p => /^step by step\s*:/i.test(p.title || '');
const find = n => n ? pages.find(p => p.name === n) || pages.find(p => bare(p.name) === bare(n)) : undefined;

// ---------------- Markdown to HTML (small and safe: every bit of text is escaped, links only go to http(s), mailto or other pages) ----------------
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// take out the tags again until none are left (a tag hidden inside another, like <<b>b>, can't come back)
const noTags = s => { let p; do { p = s; s = s.replace(/<[^>]*>/g, ''); } while (s !== p); return s; };
export const slug = s => noTags(s.toLowerCase()).replace(/&\w+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function href(url) {
  url = url.trim();
  if (/^(https?:|mailto:)/i.test(url)) return { url, ext: true };
  if (url.startsWith('#')) return { url, anchor: true };
  if (/^[\w-]+(\.md)?(#[\w-]*)?$/.test(url)) return { url: url.replace(/\.md/, ''), page: true };
  return null;
}
function src(url) {
  url = url.trim();
  if (/^https?:/i.test(url)) return url;
  if (/^(javascript|data|vbscript):/i.test(url)) return '';
  return '/media?path=' + encodeURIComponent(url);      // a path inside a media folder, like everywhere else in the panel
}

function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, u) => { const v = src(u.replace(/&amp;/g, '&')); return v ? `<img src="${esc(v)}" alt="${alt}" loading="lazy">` : alt; });
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    const h = href(u.replace(/&amp;/g, '&'));
    if (!h) return t;
    if (h.ext) return `<a href="${esc(h.url)}" target="_blank" rel="noopener noreferrer">${t}</a>`;
    if (h.anchor) return `<a href="${esc(h.url)}" data-anchor="${esc(h.url.slice(1))}">${t}</a>`;
    return `<a href="#" data-page="${esc(h.url)}">${t}</a>`;
  });
  s = s.replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g, (_, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/__(.+?)__/g, '<b>$1</b>');
  s = s.replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, '$1<i>$2</i>').replace(/(^|[^\w])_(?!\s)(.+?)_(?!\w)/g, '$1<i>$2</i>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}

// A paragraph that starts with "⚠ Electricity can kill" (in French Help "⚠ L'électricité peut tuer", Rule 11.11) is the electrical warning (Rule 6.20): red bold words under a red triangle,
// as in the hover help balloons (OakBarn Brewery, 2026-11-10: "in any Help use the Red Text and the Icon for any Electricity Can Kill")
export function warnText(s) {
  const m = /^(\*\*)?\s*⚠\s*(.*)$/s.exec(String(s).trim());
  return m && /^(\*\*)?\s*(Electricity can kill|L['’]électricité peut tuer)/i.test(m[2]) ? m[2].replace(/^\*\*\s*/, '').replace(/\*\*(\s*\(Rule [\d.]+\))?\s*$/, '$1').replace(/\*\*/g, '').trim() : '';
}
export function markdown(text) {
  const lines = String(text).replace(/\r\n?/g, '\n').split('\n'), out = [];
  let i = 0;
  const isBlock = l => /^(#{1,6}\s|```|>|\s*([-*+]|\d+[.)])\s|\s*\|.*\|\s*$|(-{3,}|\*{3,})\s*$)/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if (l.startsWith('```')) {
      const code = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      i++; out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`); continue;
    }
    if ((m = /^(#{1,6})\s+(.*?)\s*#*$/.exec(l))) {
      // a translated heading keeps the id of its English heading, so links to a part of a page work in every language (Rule 11.11):
      // "## Pour commencer {#getting-started}"
      const id = /\s*\{#([\w-]+)\}$/.exec(m[2]), n = m[1].length, h = inline(id ? m[2].slice(0, id.index) : m[2]);
      out.push(`<h${n} id="${id ? esc(id[1]) : slug(h)}">${h}</h${n}>`); i++; continue;
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (l.startsWith('>')) {
      const q = [];
      while (i < lines.length && lines[i].startsWith('>')) q.push(lines[i++].replace(/^>\s?/, ''));
      const inner = markdown(q.join('\n'));
      out.push(inner.startsWith('<div class="helpWarn">') ? inner : `<blockquote>${inner}</blockquote>`); continue;      // a warning stands alone
    }
    if (/^\s*\|.*\|\s*$/.test(l) && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1] ?? '') && lines[i + 1].includes('-')) {
      const cells = r => r.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => inline(c.trim().replace(/\\\|/g, '|')));
      const head = cells(l); i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push(`<div class="hpTable"><table><thead><tr>${head.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if ((m = /^(\s*)([-*+]|\d+[.)])\s+/.exec(l))) {
      const ordered = /\d/.test(m[2]), items = [];
      while (i < lines.length && (m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i])) && /\d/.test(m[2]) === ordered) {
        const item = [m[3]]; i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*+]|\d+[.)])\s/.test(lines[i])) item.push(lines[i++].trim());
        const sub = [];       // an indented list inside this item
        while (i < lines.length && /^\s{2,}([-*+]|\d+[.)])\s/.test(lines[i])) sub.push(lines[i++].replace(/^\s{2,4}/, ''));
        items.push(inline(item.join(' ')) + (sub.length ? markdown(sub.join('\n')) : ''));
      }
      out.push(`<${ordered ? 'ol' : 'ul'}>${items.map(t => `<li>${t}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`); continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !isBlock(lines[i])) para.push(lines[i++].trim());
    if (!para.length) para.push(lines[i++].trim());
    const w = warnText(para.join(' '));
    out.push(w ? `<div class="helpWarn"><span class="hhTri"></span>${inline(w)}</div>` : `<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}

// ---------------- the Help tab ----------------
function renderList() {
  const q = $('#hpSearch').value.trim().toLowerCase();
  const nav = $('#hpList');
  // the Step by Step guides come first, in a section of their own (OakBarn Brewery, 2026-11-11: "a Section in Help that is a Step By Step
  // with Pictures on How to do something"); every other page follows in its usual order
  const steps = pages.filter(isStep), rest = pages.filter(p => !isStep(p));
  const opt = p => el('option', { value: p.name, selected: p.name === cur }, p.title);
  $('#hpPick').replaceChildren(...(steps.length ? [el('optgroup', { label: 'Step by Step' }, ...steps.map(opt)), el('optgroup', { label: 'Every page' }, ...rest.map(opt))] : pages.map(opt)));
  $('#hpSide').classList.toggle('searching', !!q);
  if (!q) {
    const link = p => el('a', { href: '#', class: p.name === cur ? 'here' : '', onclick: e => { e.preventDefault(); open(p.name); } }, p.title);
    nav.replaceChildren(...(steps.length ? [el('div', { class: 'hpGroup' }, '👣 Step by Step'), ...steps.map(link), el('div', { class: 'hpGroup' }, 'Every page')] : []), ...rest.map(link));
    return;
  }
  const words = q.split(/\s+/);
  const hits = pages.filter(p => words.every(w => (p.title + '\n' + p.text).toLowerCase().includes(w)));
  const inTitle = p => words.every(w => p.title.toLowerCase().includes(w));
  hits.sort((a, b) => inTitle(b) - inTitle(a));     // pages with the words in their title come first
  nav.replaceChildren(...hits.map(p => {
    const plainText = p.text.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#*`|>]|^-{3,}$/gm, ' ').replace(/\s+/g, ' ');
    const at = plainText.toLowerCase().indexOf(words[0]);
    const snip = at < 0 ? '' : (at > 40 ? '…' : '') + plainText.slice(Math.max(0, at - 40), at + 80).trim() + '…';
    return el('a', { href: '#', class: p.name === cur ? 'here' : '', onclick: e => { e.preventDefault(); open(p.name, words[0]); } }, el('b', {}, p.title), el('small', { class: 'muted' }, snip));
  }), ...(hits.length ? [] : [el('p', { class: 'muted' }, 'Nothing found.')]));
}

function show(box, text, mark) {
  box.innerHTML = markdown(text);
  for (const img of box.querySelectorAll('img')) img.onerror = () => img.replaceWith(el('span', { class: 'muted' }, `[picture not found: ${img.alt || 'no name'}]`));
  if (mark) {          // light up the search word
    const walk = document.createTreeWalker(box, NodeFilter.SHOW_TEXT), hits = [];
    while (walk.nextNode()) if (walk.currentNode.nodeValue.toLowerCase().includes(mark)) hits.push(walk.currentNode);
    for (const n of hits) {
      const frag = document.createDocumentFragment(), parts = n.nodeValue.split(new RegExp(`(${mark.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'));
      parts.forEach((t, k) => frag.append(k % 2 ? el('mark', {}, t) : t));
      n.replaceWith(frag);
    }
    box.querySelector('mark')?.scrollIntoView({ block: 'center' });
  }
}

function open(name, mark, back = false, section) {
  const p = find(name);
  if (!p) { brokenLinkPop({ where: cur ? `Help page "${cur}"` : 'Help', link: name || '(none)', why: name ? `There is no Help page "${name}"` : 'The link has no Help page set' }); return; }      // Rule 11.10
  if (changed() && !confirm('Throw away your changes to this page?')) return;
  if (!back && cur && cur !== p.name) trail.push(cur);
  cur = p.name; stopEdit();
  show($('#hpPage'), p.text, mark);
  if (lang !== 'en') langNotes($('#hpPage'), p);
  const at = section && $('#hpPage').querySelector('#' + CSS.escape(section));
  if (at) at.scrollIntoView(); else if (!mark) window.scrollTo(0, 0);
  $('#hpBack').disabled = !trail.length;
  renderList();
}

// a French page: a note on top when it is not translated yet or may be out of date, and the machine translation note at the end
function langNotes(box, p) {
  const english = el('a', { href: '#', onclick: async e => { e.preventDefault(); const r = await fetch('/ui/help/' + encodeURIComponent(p.name)); if (r.ok) { show(box, await r.text()); box.prepend(el('p', { class: 'hpLangNote' }, el('a', { href: '#', onclick: ev => { ev.preventDefault(); open(p.name, null, true); } }, '🌐 Retour à la page française'))); } } }, FR.english);
  if (p.missing) box.prepend(el('p', { class: 'hpLangNote' }, '🌐 ' + FR.missing));
  else {
    if (p.stale) box.prepend(el('p', { class: 'hpLangNote' }, '⚠ ' + FR.stale + ' ', english));
    box.append(el('p', { class: 'muted hpMachine' }, '🌐 ' + FR.machine + ' ', p.stale ? null : english));
  }
}

async function load(want, section) {
  pages = await call('GET', '/ui/help' + lq());
  if (!pages.length) {
    $('#hpPage').innerHTML = '<p class="muted">The manual is empty. Its pages are the <code>.md</code> files in the <code>help</code> folder of the Brew Panel.</p>';
    renderList(); return;
  }
  // a link to a page that is not there: the broken link pop-up (Rule 11.10), and the page you were on (or the first) stays
  if (want && !find(want)) brokenLinkPop({ where: 'Help link', link: [want, section].filter(Boolean).join('#'), why: `There is no Help page "${want}"` });
  open(want && find(want) ? want : cur && find(cur) ? cur : pages[0].name, null, true, want && find(want) ? section : undefined);
  if (want && find(want) && section && !$('#hpPage').querySelector('#' + CSS.escape(section))) brokenLinkPop({ where: 'Help link', link: `${want}#${section}`, why: `The Help page "${want}" has no part "${section}"` });
}

function startEdit() {
  const p = find(cur); if (!p) return;
  editing = true;
  $('#hpText').value = p.text; show($('#hpPreview'), p.text);
  $('#hpPage').hidden = true; $('#hpEditor').hidden = false; $('#hpEdit').hidden = true;
  $('#hpText').focus();
}
function stopEdit() { editing = false; $('#hpPage').hidden = false; $('#hpEditor').hidden = true; $('#hpEdit').hidden = false; }
const changed = () => editing && !!find(cur) && $('#hpText').value !== find(cur).text;

// links inside a page
for (const box of [$('#hpPage'), $('#hpPreview')]) box.addEventListener('click', e => {
  const a = e.target.closest('a'); if (!a) return;
  if (a.dataset.page) { e.preventDefault(); if (box === $('#hpPreview')) return say('Save the page first, then follow the link'); open(a.dataset.page.split('#')[0]); }
  else if (a.dataset.anchor) {
    e.preventDefault();
    const at = box.querySelector('#' + CSS.escape(a.dataset.anchor));
    if (at) at.scrollIntoView(); else if (box !== $('#hpPreview')) brokenLinkPop({ where: `Help page "${cur}"`, link: '#' + a.dataset.anchor, why: `This page has no part "${a.dataset.anchor}"` });      // Rule 11.10
  }
});

let timer;
$('#hpText').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => show($('#hpPreview'), $('#hpText').value), 150); });
$('#hpSearch').addEventListener('input', renderList);
$('#hpLang').value = lang;
$('#hpLang').addEventListener('change', e => {
  if (changed() && !confirm('Throw away your changes to this page?')) { e.target.value = lang; return; }
  lang = e.target.value === 'fr' ? 'fr' : 'en';
  try { localStorage.setItem(LANG_KEY, lang); } catch { }
  refreshBalloonLang();
  stopEdit(); load(cur).catch(err => say(err.message, true));
  showMachineNotice(lang);
});
$('#hpPick').addEventListener('change', e => open(e.target.value));
$('#hpBack').onclick = () => { const n = trail.pop(); if (n) open(n, null, true); };
$('#hpPrint').onclick = () => window.print();
$('#hpEdit').onclick = startEdit;
$('#hpCancel').onclick = () => { if (changed() && !confirm('Throw away your changes to this page?')) return; stopEdit(); };
$('#hpSave').onclick = async () => {
  try { await call('PUT', '/ui/help/' + encodeURIComponent(cur) + lq(), $('#hpText').value, true); forgetHelpIndex(); say('Page saved'); await load(cur); }
  catch (e) { say(e.message, true); }
};
$('#hpDelete').onclick = async () => {
  if (!confirm(`Delete the page "${find(cur)?.title}"? A copy is kept in help/backups on the Brew Panel computer.`)) return;
  try { await call('DELETE', '/ui/help/' + encodeURIComponent(cur) + lq()); trail = trail.filter(n => n !== cur); cur = null; say('Page deleted'); await load(); }
  catch (e) { say(e.message, true); }
};
$('#hpNew').onclick = async () => {
  const title = prompt('Title of the new page'); if (!title?.trim()) return;
  try { const r = await call('POST', '/ui/help' + lq(), { title }); await load(r.name); startEdit(); }
  catch (e) { say(e.message, true); }
};

// Fritz, 2026-10-22: Help opens in a window of its own (help.html), so it can sit beside the panel while you follow it.
// The panel (app.js) opens or reuses that one window. Only when the browser blocks it does the panel show Help on its own
// Help page, asking for a page and part with the 'skynet-help' event (see helpmap.js).
const ALONE = !document.getElementById('views');
if (ALONE) {
  const q = new URLSearchParams(location.search);
  // the panel calls this to show another page in this window when it is already open
  window.skynetHelp = (want, section) => {
    if (changed() && !confirm('Throw away your changes to this page?')) return;
    stopEdit(); load(want, section).catch(e => say(e.message, true));
  };
  // the panel reopens this window on top to show it again: it keeps its place and its ◀ Back list, and leaves it alone while a page is edited
  window.skynetHelpKeep = () => ({ busy: changed(), trail: [...trail, cur].filter(Boolean).slice(-30),
    place: { w: window.innerWidth, h: window.innerHeight, x: window.screenX, y: window.screenY } });
  trail = (q.get('trail') || '').split(',').filter(Boolean);
  if (trail.length && bare(trail.at(-1)) === bare(q.get('page') || '')) trail.pop();      // the same page again: not a step back
  fetch('/auth/status').then(r => r.json()).then(st => {
    if (!st.user) return location.replace('/login.html');
    document.body.classList.add('role-' + st.user.role);
    document.title = (st.title || 'Skynet Brew Panel') + ' Help';
  }).catch(() => { });
  $('#hpClose').onclick = () => window.close();
  load(q.get('page'), q.get('section')).catch(e => say(e.message, true));
} else {
  window.addEventListener('skynet-help', e => {
    if (changed()) return;
    const [want, section] = e.detail || [];
    load(want, section).catch(e => say(e.message, true));
  });
}
window.addEventListener('beforeunload', e => { if (changed()) e.preventDefault(); });
