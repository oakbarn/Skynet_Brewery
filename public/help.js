// Help tab: the manual. Pages are Markdown files in the help/ folder on the Brew Panel computer (see lib/help.js).
// Everyone can read them; admins can edit, add and delete pages here. Opening Help shows the page for the screen you came from.
const $ = s => document.querySelector(s);
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

// Which page belongs to which screen (matched on the page name without its number, e.g. "02-tabs" -> "tabs")
const FOR_VIEW = { workspace: 'tabs', scripts: 'scripts', globals: 'variables', log: 'log', devices: 'devices', media: 'media', import: 'import', settings: 'settings' };
let pages = [], cur = null, trail = [], cameFrom = null, editing = false;
const bare = n => n.replace(/^\d+[-_]/, '');
const find = n => n ? pages.find(p => p.name === n) || pages.find(p => bare(p.name) === bare(n)) : undefined;

// ---------------- Markdown to HTML (small and safe: every bit of text is escaped, links only go to http(s), mailto or other pages) ----------------
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&\w+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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
      const n = m[1].length, h = inline(m[2]);
      out.push(`<h${n} id="${slug(h)}">${h}</h${n}>`); i++; continue;
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (l.startsWith('>')) {
      const q = [];
      while (i < lines.length && lines[i].startsWith('>')) q.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${markdown(q.join('\n'))}</blockquote>`); continue;
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
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}

// ---------------- the Help tab ----------------
function renderList() {
  const q = $('#hpSearch').value.trim().toLowerCase();
  const nav = $('#hpList');
  $('#hpPick').replaceChildren(...pages.map(p => el('option', { value: p.name, selected: p.name === cur }, p.title)));
  $('#hpSide').classList.toggle('searching', !!q);
  if (!q) {
    nav.replaceChildren(...pages.map(p => el('a', { href: '#', class: p.name === cur ? 'here' : '', onclick: e => { e.preventDefault(); open(p.name); } }, p.title)));
    return;
  }
  const words = q.split(/\s+/);
  const hits = pages.filter(p => words.every(w => (p.title + '\n' + p.text).toLowerCase().includes(w)));
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

function open(name, mark, back = false) {
  const p = find(name);
  if (!p) { say(`No help page "${name}"`, true); return; }
  if (changed() && !confirm('Throw away your changes to this page?')) return;
  if (!back && cur && cur !== p.name) trail.push(cur);
  cur = p.name; stopEdit();
  show($('#hpPage'), p.text, mark);
  if (!mark) window.scrollTo(0, 0);
  $('#hpBack').disabled = !trail.length;
  renderList();
}

async function load(want) {
  pages = await call('GET', '/ui/help');
  if (!pages.length) {
    $('#hpPage').innerHTML = '<p class="muted">The manual is empty. Its pages are the <code>.md</code> files in the <code>help</code> folder of the Brew Panel.</p>';
    renderList(); return;
  }
  open(want && find(want) ? want : cur && find(cur) ? cur : pages[0].name, null, true);
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
  else if (a.dataset.anchor) { e.preventDefault(); box.querySelector('#' + CSS.escape(a.dataset.anchor))?.scrollIntoView(); }
});

let timer;
$('#hpText').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => show($('#hpPreview'), $('#hpText').value), 150); });
$('#hpSearch').addEventListener('input', renderList);
$('#hpPick').addEventListener('change', e => open(e.target.value));
$('#hpBack').onclick = () => { const n = trail.pop(); if (n) open(n, null, true); };
$('#hpPrint').onclick = () => window.print();
$('#hpEdit').onclick = startEdit;
$('#hpCancel').onclick = () => { if (changed() && !confirm('Throw away your changes to this page?')) return; stopEdit(); };
$('#hpSave').onclick = async () => {
  try { await call('PUT', '/ui/help/' + encodeURIComponent(cur), $('#hpText').value, true); say('Page saved'); await load(cur); }
  catch (e) { say(e.message, true); }
};
$('#hpDelete').onclick = async () => {
  if (!confirm(`Delete the page "${find(cur)?.title}"? A copy is kept in help/backups on the Brew Panel computer.`)) return;
  try { await call('DELETE', '/ui/help/' + encodeURIComponent(cur)); trail = trail.filter(n => n !== cur); cur = null; say('Page deleted'); await load(); }
  catch (e) { say(e.message, true); }
};
$('#hpNew').onclick = async () => {
  const title = prompt('Title of the new page'); if (!title?.trim()) return;
  try { const r = await call('POST', '/ui/help', { title }); await load(r.name); startEdit(); }
  catch (e) { say(e.message, true); }
};

// Opening Help: show the page for the screen you were on (once per visit), else the last page read
for (const b of document.querySelectorAll('#views button')) b.addEventListener('click', () => {
  const v = b.dataset.view;
  if (v !== 'help') { cameFrom = v; return; }
  if (changed()) return;
  load(FOR_VIEW[cameFrom]).catch(e => say(e.message, true));
  cameFrom = null;
});
window.addEventListener('beforeunload', e => { if (changed()) e.preventDefault(); });
