// Autofill in the Process editor (Fritz, 2026-10-05).
//  - Typing a name (2+ letters) lists matching names: ones already used above in this Process first,
//    then Devices, Widgets, Processes and Process words. Up / Down pick, Enter or Tab takes it, Esc closes.
//  - After a dot (my_Widget.) the list shows that item's attributes. As soon as the letters typed fit only one
//    attribute it is filled in by itself: my_Widget.b -> my_Widget.background =
//    (" = " only at the start of a line; in an if or wait just the attribute name).
//    Letters typed afterwards that spell the rest of the attribute are skipped, so typing it in full also works.
const WORDS = ['if', 'elseif', 'else', 'endif', 'goto', 'sleep', 'wait', 'start', 'stop', 'restart', 'reset', 'print', 'clear', 'show tab', 'log', 'step',
  'new value', 'new string', 'new bool', 'new time', 'new datetime', 'true', 'false', 'now', 'and', 'or', 'not'];
const IDENT = /[A-Za-z_][A-Za-z0-9_]*$/;

export function attachAutofill(ta, box, words) {
  let items = [], sel = 0, ctx = null, skip = null, busy = false;

  const close = () => { box.classList.add('hidden'); items = []; ctx = null; };
  const lineBefore = () => { const v = ta.value, p = ta.selectionStart; return v.slice(v.lastIndexOf('\n', p - 1) + 1, p); };
  const declared = () => new Set([...ta.value.matchAll(/^\s*new\s+\w+\s+([A-Za-z_]\w*)/gim)].map(m => m[1]));

  function insert(from, text) {
    const p = ta.selectionStart;
    ta.setSelectionRange(from, p);
    busy = true;
    try {
      if (!document.execCommand('insertText', false, text)) {      // keeps Undo working where the browser allows it
        ta.value = ta.value.slice(0, from) + text + ta.value.slice(p);
        ta.setSelectionRange(from + text.length, from + text.length);
        ta.dispatchEvent(new Event('input'));                      // the editor marks the Process as not saved
      }
    } finally { busy = false; }
  }

  function attrsFor(name) {
    if (declared().has(name)) return ['precision'];
    const el = words()?.elements?.find(e => e.name === name);
    return el ? el.attrs : null;
  }

  function place() {
    const cs = getComputedStyle(ta), lh = parseFloat(cs.lineHeight) || 19.5;
    const before = ta.value.slice(0, ta.selectionStart).split('\n');
    const col = before[before.length - 1].replace(/\t/g, '    ').length;
    const cw = (place.cw ??= (() => { const c = document.createElement('canvas').getContext('2d'); c.font = cs.font; return c.measureText('0000000000').width / 10; })());
    const top = ta.offsetTop + parseFloat(cs.paddingTop) + before.length * lh - ta.scrollTop + 2;
    const left = ta.offsetLeft + parseFloat(cs.paddingLeft) + col * cw - ta.scrollLeft;
    const hgt = box.offsetHeight || 120, bottom = ta.offsetTop + ta.clientHeight;
    box.style.top = (top + hgt > bottom ? Math.max(0, top - lh - hgt - 4) : top) + 'px';     // above the line when there is no room below
    box.style.left = Math.max(0, Math.min(left, ta.offsetLeft + ta.clientWidth - 220)) + 'px';
  }

  function show(list, from, kind) {
    items = list.slice(0, 40); sel = 0; ctx = { from, kind };
    if (!items.length) return close();
    box.innerHTML = '';
    items.forEach((it, i) => {
      const li = document.createElement('li');
      li.textContent = it.label ?? it.text;
      if (it.hint) { const s = document.createElement('span'); s.className = 'muted'; s.textContent = '  ' + it.hint; li.append(s); }
      if (i === sel) li.className = 'sel';
      li.onmousedown = ev => { ev.preventDefault(); sel = i; accept(); };
      box.append(li);
    });
    box.classList.remove('hidden');
    place();
  }

  function accept() {
    const it = items[sel]; if (!it || !ctx) return;
    const { from } = ctx; close();
    insert(from, it.text);
  }

  function update() {
    if (ta.readOnly) return close();
    const line = lineBefore(), p = ta.selectionStart;
    if (/^\s*\/\//.test(line)) return close();
    // after a dot: attributes
    const dot = /(?:"([^"\n]+)"|([A-Za-z_]\w*))\.([A-Za-z]*)$/.exec(line);
    if (dot) {
      const name = dot[1] ?? dot[2], typed = dot[3].toLowerCase(), attrs = attrsFor(name);
      if (!attrs) return close();
      const hits = attrs.filter(a => a.startsWith(typed));
      const atStart = /^\s*$/.test(line.slice(0, dot.index));
      if (typed && hits.length === 1) {                       // only one fits: fill it in now
        const tail = atStart ? ' = ' : '';
        close();
        insert(p - typed.length, hits[0] + tail);
        skip = { pos: ta.selectionStart, rest: hits[0].slice(typed.length) + tail };
        return;
      }
      return show(hits.map(a => ({ text: a + (atStart ? ' = ' : ''), label: a })), p - typed.length, 'attr');
    }
    // inside quotes: Process and element names (start "sub_..., "my Widget".)
    const q = (line.match(/"/g) || []).length % 2 === 1;
    const w = q ? /"([^"]*)$/.exec(line)[1] : (IDENT.exec(line)?.[0] ?? '');
    if (w.length < 2 || (!q && line.endsWith('.' + w))) return close();
    const lw = w.toLowerCase(), seen = new Set(), list = [];
    const add = (text, hint) => { if (seen.has(text) || text === w || !text.toLowerCase().startsWith(lw)) return; seen.add(text); list.push({ text, hint }); };
    if (!q) {
      // names used above in this Process come first
      for (const m of ta.value.slice(0, p - w.length).matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) add(m[0], 'used above');
      for (const k of WORDS) add(k, '');
    }
    const W = words() || {};
    for (const e of W.elements || []) add(e.name, e.type);
    for (const n of W.processes || []) add(n, 'Process');
    show(list, p - w.length, 'name');
  }

  ta.addEventListener('keydown', ev => {
    // letters that spell the rest of an attribute filled in by itself are skipped
    if (skip && ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey) {
      if (ta.selectionStart === skip.pos && ta.selectionEnd === skip.pos && skip.rest && ev.key.toLowerCase() === skip.rest[0].toLowerCase()) {
        ev.preventDefault();
        skip.rest = skip.rest.slice(1);
        if (!skip.rest) skip = null;
        return;
      }
      skip = null;
    }
    if (box.classList.contains('hidden')) return;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      sel = (sel + (ev.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length;
      [...box.children].forEach((li, i) => li.classList.toggle('sel', i === sel));
      box.children[sel]?.scrollIntoView({ block: 'nearest' });
    } else if (ev.key === 'Enter' || ev.key === 'Tab') { ev.preventDefault(); ev.stopImmediatePropagation(); accept(); }
    else if (ev.key === 'Escape') { ev.preventDefault(); close(); }
  }, true);
  ta.addEventListener('input', ev => { if (!busy && ev.inputType) update(); });   // typed or deleted (not our own inserts)
  ta.addEventListener('blur', () => setTimeout(close, 150));
  ta.addEventListener('scroll', close);
  ta.addEventListener('click', close);
}
