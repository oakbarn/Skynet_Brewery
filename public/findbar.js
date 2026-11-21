// Find and Replace for a big text box (Rule 2.65): the Process Template editor and the Help text editor.
// The same bar as the Process Editor and Schema.json (public/app.js): Ctrl+F (⌘+F) opens Find, Ctrl+H opens the same bar with
// the cursor in Replace with. The keys are taken from the browser only while that text box or its bar has the focus.
// Aa = match case, Whole word, ▲ ▼ (Shift+Enter / Enter, F3), Replace, Replace all, ✕ (Esc). A read only box has no Replace row.
// Replacing types through the browser, so Ctrl+Z undoes it and the box's own input event runs (the Help preview updates).

export function findRegex(text, matchCase, word) {
  if (!text) return null;
  const esc = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(word ? `(?<![A-Za-z0-9_])${esc}(?![A-Za-z0-9_])` : esc, 'g' + (matchCase ? '' : 'i'));
}
export const findAll = (str, re) => re ? [...String(str).matchAll(re)].map(m => [m.index, m.index + m[0].length]) : [];
// the key a keydown is for: 'find', 'replace', 'next', 'prev' or null
export function findKeyOf(ev) {
  const k = String(ev.key || '').toLowerCase();
  if ((ev.ctrlKey || ev.metaKey) && !ev.altKey && !ev.shiftKey && k === 'f') return 'find';
  if (ev.ctrlKey && !ev.metaKey && !ev.altKey && !ev.shiftKey && k === 'h') return 'replace';      // ⌘+H hides the app on a Mac, so Ctrl+H only
  if (k === 'f3') return ev.shiftKey ? 'prev' : 'next';
  return null;
}

const mk = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  e.append(...kids); return e;
};

// Puts a Find bar above `ta` (or above `before`, an element that holds it) and hooks the keys up. Returns { open, close }.
export function attachFind(ta, { before = ta } = {}) {
  const text = mk('input', { type: 'search', placeholder: 'Find', autocomplete: 'off', spellcheck: 'false', enterkeyhint: 'search' });
  const count = mk('span', { class: 'muted findCount' });
  const prev = mk('button', { type: 'button', title: 'Previous match (Shift+Enter)' }, '▲');
  const next = mk('button', { type: 'button', title: 'Next match (Enter)' }, '▼');
  const mc = mk('input', { type: 'checkbox', class: 'swc' }), ww = mk('input', { type: 'checkbox', class: 'swc' });
  const close = mk('button', { type: 'button', title: 'Close (Esc)' }, '✕');
  const repl = mk('input', { placeholder: 'Replace with', autocomplete: 'off', spellcheck: 'false' });
  const one = mk('button', { type: 'button', title: 'Replace this match and go to the next' }, 'Replace');
  const all = mk('button', { type: 'button' }, 'Replace all');
  const replRow = mk('div', { class: 'findRow' }, repl, one, all);
  const bar = mk('div', { class: 'findBar hidden', 'data-findbar': '' },
    mk('div', { class: 'findRow' }, text, count, prev, next,
      mk('label', { class: 'toggle', title: 'Match upper and lower case exactly' }, mc, ' Aa'),
      mk('label', { class: 'toggle', title: 'Whole words only' }, ww, ' Whole word'), close),
    replRow);
  before.before(bar);
  // the matches, painted on a see-through layer over the box (a box shows no highlight while the Find box has the focus)
  const layer = mk('div', { class: 'findLayer', 'aria-hidden': 'true' });
  ta.after(layer);
  const esc = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

  let matches = [], idx = -1;
  const isOpen = () => !bar.classList.contains('hidden');
  const re = () => findRegex(text.value, mc.checked, ww.checked);
  function paintLayer() {
    if (!isOpen() || !matches.length || ta.offsetParent === null) { layer.hidden = true; return; }
    const cs = getComputedStyle(ta), wrapOff = ta.getAttribute('wrap') === 'off' || cs.whiteSpace === 'pre' || cs.whiteSpace === 'nowrap';
    for (const k of ['font', 'letterSpacing', 'lineHeight', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'tabSize', 'wordBreak', 'overflowWrap']) layer.style[k] = cs[k];
    const bl = parseFloat(cs.borderLeftWidth) || 0, bt = parseFloat(cs.borderTopWidth) || 0;
    Object.assign(layer.style, { left: ta.offsetLeft + bl + 'px', top: ta.offsetTop + bt + 'px', width: ta.clientWidth + 'px', height: ta.clientHeight + 'px', whiteSpace: wrapOff ? 'pre' : 'pre-wrap' });
    const v = ta.value; let out = '', last = 0;
    matches.forEach(([a, b], i) => { out += esc(v.slice(last, a)) + `<mark${i === idx ? ' class="cur"' : ''}>${esc(v.slice(a, b))}</mark>`; last = b; });
    layer.innerHTML = out + esc(v.slice(last)) + '\n ';
    layer.hidden = false; layer.scrollTop = ta.scrollTop; layer.scrollLeft = ta.scrollLeft;
  }
  ta.addEventListener('scroll', () => { layer.scrollTop = ta.scrollTop; layer.scrollLeft = ta.scrollLeft; });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => { if (isOpen()) paintLayer(); }).observe(ta);
  function paint() {
    paintLayer();
    const n = matches.length;
    count.textContent = !text.value ? '' : n ? `${idx + 1} of ${n}` : 'No matches';
    count.style.color = text.value && !n ? 'var(--bad)' : '';
    for (const b of [prev, next, one, all]) b.disabled = !n;
    one.disabled = all.disabled = !n || ta.readOnly;
  }
  // scroll the box so the match shows: a copy of the box measures where it is (wrapped lines too)
  function scrollTo(a) {
    const cs = getComputedStyle(ta), m = document.createElement('div');
    for (const p of ['font', 'letterSpacing', 'lineHeight', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'boxSizing', 'tabSize', 'whiteSpace', 'wordWrap', 'overflowWrap', 'wordBreak']) m.style[p] = cs[p];
    const wrapOff = ta.getAttribute('wrap') === 'off' || cs.whiteSpace === 'pre' || cs.whiteSpace === 'nowrap';
    Object.assign(m.style, { position: 'absolute', visibility: 'hidden', left: '-9999px', top: '0', width: ta.clientWidth + 'px', whiteSpace: wrapOff ? 'pre' : 'pre-wrap' });
    const mark = document.createElement('span'); mark.textContent = '​';
    m.append(document.createTextNode(ta.value.slice(0, a)), mark);
    document.body.append(m);
    const y = mark.offsetTop, x = mark.offsetLeft, lh = parseFloat(cs.lineHeight) || 18;
    m.remove();
    if (y < ta.scrollTop || y + lh > ta.scrollTop + ta.clientHeight) ta.scrollTop = Math.max(0, y - ta.clientHeight / 3);
    if (wrapOff && (x < ta.scrollLeft || x > ta.scrollLeft + ta.clientWidth - 40)) ta.scrollLeft = Math.max(0, x - ta.clientWidth / 3);
  }
  function show() { const m = matches[idx]; if (!m) return; ta.setSelectionRange(m[0], m[1]); scrollTo(m[0]); layer.scrollTop = ta.scrollTop; layer.scrollLeft = ta.scrollLeft; }
  function refresh(jump) {
    const at = matches[idx]?.[0] ?? ta.selectionStart;
    matches = isOpen() ? findAll(ta.value, re()) : [];
    idx = matches.length ? Math.max(0, matches.findIndex(m => m[0] >= at)) : -1;
    paint(); if (jump) show();
  }
  const step = d => { if (!matches.length) return; idx = (idx + d + matches.length) % matches.length; paint(); show(); };
  function open(replace) {
    const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    if (sel && !sel.includes('\n')) text.value = sel;
    replRow.classList.toggle('hidden', ta.readOnly);
    bar.classList.remove('hidden');
    const box = replace && !ta.readOnly ? repl : text;
    box.focus(); box.select();
    idx = -1; refresh(true);
  }
  function hide() {
    if (!isOpen()) return;
    bar.classList.add('hidden');
    const m = matches[idx]; ta.focus(); if (m) ta.setSelectionRange(m[0], m[1]);
    matches = []; idx = -1; layer.hidden = true;
  }
  // type into the box through the browser so Ctrl+Z can undo it, then give the focus back
  function type(start, end, s) {
    ta.focus(); ta.setSelectionRange(start, end);
    if (!document.execCommand('insertText', false, s)) { ta.setRangeText(s, start, end, 'end'); ta.dispatchEvent(new Event('input', { bubbles: true })); }
    repl.focus();
  }
  prev.onclick = () => step(-1);
  next.onclick = () => step(1);
  close.onclick = hide;
  text.addEventListener('input', () => { idx = -1; refresh(true); });
  for (const c of [mc, ww]) c.addEventListener('change', () => refresh(true));
  one.onclick = () => {
    const m = matches[idx]; if (!m || ta.readOnly) return;
    const at = m[0] + repl.value.length;
    type(m[0], m[1], repl.value);
    idx = -1; ta.setSelectionRange(at, at); refresh(true);
  };
  all.onclick = () => {
    if (!matches.length || ta.readOnly) return;
    const r = repl.value;
    type(0, ta.value.length, ta.value.replace(re(), () => r));
    refresh(false);
  };
  for (const box of [text, repl]) box.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') { ev.preventDefault(); ev.stopPropagation(); if (box === repl && !ev.shiftKey) one.click(); else step(ev.shiftKey ? -1 : 1); }
    else if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); hide(); }      // closes the bar, not the dialog
  });
  ta.addEventListener('input', () => { if (isOpen()) refresh(false); });
  // the keys, only while the text box or its bar has the focus
  const onKey = ev => {
    const kind = findKeyOf(ev); if (!kind) return;
    if ((kind === 'next' || kind === 'prev') && !isOpen()) return;
    ev.preventDefault(); ev.stopPropagation();
    if (kind === 'find' || kind === 'replace') open(kind === 'replace'); else step(kind === 'next' ? 1 : -1);
  };
  ta.addEventListener('keydown', onKey);
  bar.addEventListener('keydown', onKey);
  ta.addEventListener('keydown', ev => { if (ev.key === 'Escape' && isOpen()) { ev.preventDefault(); ev.stopPropagation(); hide(); } });
  return { open, close: hide, bar };
}
