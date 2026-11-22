// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Skynet search box (Rule 2.65, changed 2026-11-22, Panel Update 9, item 8: "CTRL + F Have the search box come up in the middle
// top of the screen. Besides the Tab you are on, all searches include the Help"). Ctrl+F (⌘+F) anywhere in the panel, outside a big
// text editor (they keep their own Find and Replace bar), opens one box at the top middle. Typing lists what matches on the Tab you
// are on (its Devices, Widgets and Vessels, by Label or Name) and the Help pages (by title and text). Enter or a click opens the
// first or the clicked one; Esc or ✕ closes it. Nothing is changed by a search.
// tabItems(): [{ name, label, kind }] on the Tab shown; helpPages(): Promise<[{ name, title, text }]>; onItem(item), onHelp(page, words)

const mk = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k.startsWith('on')) e[k] = v; else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); }
  e.append(...kids); return e;
};
// every word must be there (any letter case); a Label or Name match comes before a match in the text
export function searchTab(items, q) {
  const words = String(q || '').toLowerCase().split(/\s+/).filter(Boolean); if (!words.length) return [];
  return items.filter(it => words.every(w => `${it.label || ''} ${it.name || ''}`.toLowerCase().includes(w)));
}
export function searchHelp(pages, q, max = 12) {
  const words = String(q || '').toLowerCase().split(/\s+/).filter(Boolean); if (!words.length) return [];
  const hit = pages.filter(p => words.every(w => `${p.title}\n${p.text}`.toLowerCase().includes(w)));
  const inTitle = p => words.every(w => String(p.title).toLowerCase().includes(w));
  return [...hit.filter(inTitle), ...hit.filter(p => !inTitle(p))].slice(0, max);
}
// a short piece of the page around the first word, so you can see why it matched
export function snippet(text, q, len = 90) {
  const t = String(text || '').replace(/[#*`>_|[\]()]+/g, ' ').replace(/\s+/g, ' '), w = String(q || '').toLowerCase().split(/\s+/).filter(Boolean)[0] || '';
  const i = w ? t.toLowerCase().indexOf(w) : 0; if (i < 0) return t.slice(0, len);
  const s = Math.max(0, i - 30); return (s ? '… ' : '') + t.slice(s, s + len).trim() + (s + len < t.length ? ' …' : '');
}

let box = null;
export function openSkySearch({ tabItems, helpPages, onItem, onHelp, tabName = '' }) {
  if (box?.isConnected) { box.querySelector('input').select(); box.querySelector('input').focus(); return; }
  const inp = mk('input', { type: 'search', placeholder: `🔍 Search ${tabName ? `the Tab ${tabName}` : 'this Tab'} and Help`, autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Search' });
  const list = mk('div', { class: 'skyList' });
  const close = () => { box?.remove(); box = null; };
  let pages = null, first = null;
  helpPages().then(p => { pages = p || []; draw(); }).catch(() => { pages = []; draw(); });
  const row = (title, sub, go) => mk('button', { type: 'button', class: 'skyHit', onclick: () => { close(); go(); } }, mk('b', {}, title), sub ? mk('span', { class: 'muted' }, sub) : '');
  function draw() {
    const q = inp.value.trim(); first = null; list.replaceChildren();
    if (!q) return;
    const t = searchTab(tabItems(), q), hp = pages ? searchHelp(pages, q) : [];
    list.append(mk('div', { class: 'skyGroup' }, `On this Tab (${t.length})`));
    if (!t.length) list.append(mk('div', { class: 'muted skyNone' }, 'Nothing on this Tab'));
    for (const it of t.slice(0, 12)) { const r = row(it.label || it.name, it.label && it.label !== it.name ? `${it.name} · ${it.kind}` : it.kind, () => onItem(it)); first ??= r; list.append(r); }
    list.append(mk('div', { class: 'skyGroup' }, pages ? `Help (${hp.length})` : 'Help (loading ...)'));
    if (pages && !hp.length) list.append(mk('div', { class: 'muted skyNone' }, 'No Help page'));
    for (const p of hp) { const r = row(`❓ ${p.title}`, snippet(String(p.text).replace(/^#[^\n]*\n/, ''), q), () => onHelp(p, q)); first ??= r; list.append(r); }
  }
  inp.oninput = draw;
  inp.onkeydown = ev => { ev.stopPropagation(); if (ev.key === 'Escape') { ev.preventDefault(); close(); } else if (ev.key === 'Enter') { ev.preventDefault(); first?.click(); } };
  box = mk('div', { id: 'skySearch', role: 'search' }, mk('div', { class: 'skyTop' }, inp, mk('button', { type: 'button', title: 'Close (Esc)', onclick: close }, '✕')), list);
  document.body.append(box);
  inp.focus();
}
export const skySearchOpen = () => !!box?.isConnected;
export function closeSkySearch() { box?.remove(); box = null; }
