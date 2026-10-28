// Predictive text in the Process editor (Fritz, 2026-10-05; more on 2026-10-28).
//  - Typing a name lists matching names: ones already used above in this Process first, then Devices, Widgets,
//    Processes and Process words. A name also matches on any part of it after a _ (typing Pump finds MB_06_Pump_Wort__HS).
//    Up / Down pick, Enter or Tab takes it, Esc closes. The best match is also shown in gray after the cursor
//    (at the end of a line), and the Right arrow takes it too.
//  - At the start of a line the commands come first, each with a short note of what it does.
//  - After a dot (my_Widget.) the list shows that item's attributes. As soon as the letters typed fit only one
//    attribute it is filled in by itself: my_Widget.b -> my_Widget.background =
//    (" = " only at the start of a line; in an if or wait just the attribute name).
//    Letters typed afterwards that spell the rest of the attribute are skipped, so typing it in full also works.
//  - After the word that comes first, the list fits it: start / stop / restart -> Processes (and timers, alarms ...),
//    play -> alarms and sound players, show tab -> Tab names, goto -> labels in this Process, new -> the kinds of variable.
//  - After = or == on something that is on/off (Pump_Red =, tm_Mash.visible ==) it offers true, false, on and off.
//  - Ctrl+Space (or the 💡 Suggest button, for phones) opens the list even before a letter is typed, with only what can
//    stand there: after if, wait, = or and, the variables, timers, vAPI, vKonstants, Devices, Widgets and Processes.
//  - Picking a command or a name opens the list of what can come next, so a whole line can be made by picking:
//    if -> MB_06_Pump_Wort__HS -> == (or .state, .visible ...) -> true. The line ends there, so Enter makes a new line;
//    Ctrl+Space then offers and / or to go on.
//  - Only names are ever offered: never a hidden key (Rule 3.10), and never a Clone, which is not used in Processes (Rule 4.4).
import { DEVICE_TYPES } from './colorize.js';

const COMMANDS = [
  ['if', 'test something'], ['elseif', 'another test'], ['else if', 'another test'], ['else', 'when no test fit'], ['endif', 'end of the if'],
  ['wait', 'until true, or a time'], ['sleep', 'pause, in ms'], ['goto', 'jump to a [label]'], ['step', 'start a step'],
  ['start', 'a Process or timer'], ['stop', 'a Process, timer or alarm'], ['restart', 'a Process from the top'], ['reset', 'a timer'],
  ['play', 'an alarm or sound'], ['print', 'to the console'], ['clear', 'the console'], ['show tab', 'go to a Tab'], ['log', 'write to the log'],
  ['new value', 'make a number'], ['new string', 'make a text'], ['new bool', 'make a true/false'], ['new time', 'make a time'], ['new datetime', 'make a date and time'],
  ['lock_Equipment', 'lock the Equipment Profile'], ['unlock_Equipment', 'unlock the Equipment Profile'],
];
// words that fit anywhere on a line, not only at its start
const ANYWHERE = [['true', ''], ['false', ''], ['now', 'date and time'], ['and', ''], ['or', ''], ['not', '']];
const NEW_KINDS = [['value', 'a number'], ['string', 'a text'], ['bool', 'true or false'], ['time', '00:10:00'], ['datetime', 'date and time']];
const ON_OFF = [['true', 'on'], ['false', 'off'], ['on', ''], ['off', '']];
const IDENT = /[A-Za-z_][A-Za-z0-9_~]*$/;
const IS_IDENT = /^[A-Za-z_][A-Za-z0-9_~]*$/;
// my_Process_Mash.running: true while it runs (read only)
const PROCESS_ATTRS = ['running'];
// which kinds of item each command works on (lib/engine.js)
const TARGETS = { start: ['timer', 'alarm', 'soundPlayer'], stop: ['timer', 'alarm', 'soundPlayer', 'stepper'], reset: ['timer', 'stepper'], restart: [] };

// the kind of each item, in the order a value list shows them
const GROUP = e => e.type === 'shared' ? [0, 'variable'] : e.type === 'timer' ? [1, 'Timer'] : e.type === 'vAPI' ? [2, 'vAPI']
  : e.type === 'vKonstant' ? [3, 'vKonstant'] : DEVICE_TYPES.includes(e.type) ? [4, 'Device'] : [5, 'Widget'];

// how well a name fits the letters typed: 0 = it starts with them, 1 = a part of it after a _ does, -1 = not at all
export function fit(name, typed) {
  const n = name.toLowerCase(), t = typed.toLowerCase();
  if (n.startsWith(t)) return 0;
  return t.length >= 2 && n.split(/_+/).slice(1).some(part => part.startsWith(t)) ? 1 : -1;
}

// commands that take something after them: the pick ends in a space and the next list opens by itself
const TAKES = new Set(['if', 'elseif', 'else if', 'wait', 'sleep', 'goto', 'step', 'start', 'stop', 'reset', 'play', 'print', 'show tab', 'log',
  'new value', 'new string', 'new bool', 'new time', 'new datetime']);
const COMPARE = [['= ', 'is equal to'], ['== ', 'is equal to (the same as =)'], ['!= ', 'is not'], ['> ', 'more than'], ['< ', 'less than'], ['>= ', 'at least'], ['<= ', 'at most']];
const SET = [['= ', 'set it to'], ['+= ', 'add to it'], ['-= ', 'take from it'], ['++', 'add 1']];
const MATH = [['+ ', ''], ['- ', ''], ['* ', ''], ['/ ', '']];
const JOIN = [['and ', 'both must be true'], ['or ', 'one must be true']];
const NEW_RE = /^\s*new\s+(\w+)\s+([A-Za-z_]\w*)/gim;

// what to offer for the line before the cursor (no DOM, so test/autofill.test.js can check it)
//   words = { elements: [{ name, type, main, attrs, bools }], processes: [...], tabs: [...] }, above = the text above the cursor,
//   all = the whole Process, forced = Ctrl+Space or the Suggest button (a list even with nothing typed).
//   Returns { list: [{ text, label?, hint, back? }], typed } (typed = the letters the picks replace; back = also the space
//   before them, for .value after "if Pump "), or null. A pick that ends in a space opens the next list.
export function suggest(line, words = {}, above = '', all = above, forced = false) {
  const W = words || {}, els = W.elements || [];
  const elOf = n => els.find(e => e.name === n);
  const isProc = n => (W.processes || []).includes(n);
  const declared = new Map([...all.matchAll(NEW_RE)].map(m => [m[2], m[1].toLowerCase()]));
  const quote = n => IS_IDENT.test(n) ? n : `"${n}"`;
  const q = (line.match(/"/g) || []).length % 2 === 1;
  const w = q ? /"([^"]*)$/.exec(line)[1] : (IDENT.exec(line)?.[0] ?? '');
  const pre = line.slice(0, line.length - w.length - (q ? 1 : 0));
  const inCond = /^\s*(if|elseif|else\s+if|wait)\b/i.test(pre);
  const seen = new Set(), first = [], second = [];
  const add = (text, hint, label, back) => {
    const l = label ?? text.trim();
    if (seen.has(text) || (w && l === w)) return;
    const f = fit(l, w); if (f < 0) return;
    seen.add(text); (f ? second : first).push({ text, hint, label: l === text ? undefined : l, ...(back ? { back } : {}) });
  };
  const done = () => { const list = [...first, ...second]; return list.length ? { list, typed: q ? w.length + 1 : w.length } : null; };
  // in quotes the pick keeps its quotes; a name that needs quotes gets them
  const named = (n, hint) => q ? add(`"${n}"`, hint, n) : add(quote(n), hint, n);
  const command = (k, h) => add(TAKES.has(k) ? k + ' ' : k, h, k);

  // what can come after a whole name: "if Pump " -> == != > < and .state .visible ...; "Pump " -> = += and .visible = ...
  function after(name, attr, before) {
    const el = elOf(name), proc = isProc(name);
    if (!el && !proc && !declared.has(name)) return null;
    const props = attr ? [] : el ? [...new Set([el.main, ...el.attrs].filter(Boolean))] : proc ? PROCESS_ATTRS : [];
    const pHint = p => p === el?.main ? 'the same as the name alone' : el?.bools?.includes(p) ? 'true or false' : '';
    const out = [];
    const isValue = /\S/.test(before) && /(==|!=|<=|>=|<|>|=|\+|-|\*|\/|\bnot)\s*$/i.test(before);
    const lineStart = !/\S/.test(before);
    if (isValue) {
      if (!forced) return null;          // a space after a value: maybe the line is done, so no list until Ctrl+Space
      for (const [k, h] of inCond ? JOIN : MATH) out.push({ text: k, hint: h });
      for (const p of props) out.push({ text: '.' + p, hint: pHint(p), back: 1 });
    } else if (inCond) {
      for (const [k, h] of COMPARE) out.push({ text: k, hint: h });
      for (const p of props) out.push({ text: '.' + p + ' ', hint: pHint(p), back: 1 });
    } else if (lineStart) {
      if (!proc) for (const [k, h] of SET) out.push({ text: k, hint: h });
      if (!proc) for (const p of props) out.push({ text: '.' + p + ' = ', label: '.' + p, hint: pHint(p), back: 1 });
    } else return null;
    return out;
  }
  // Ctrl+Space right after a value in an if or a wait (if Pump == true): and / or
  if (forced && inCond && !q && /(==|!=|<=|>=|<|>|=)\s*(\S+)$/.test(line) && (!w || /^(true|false|on|off|now)$/i.test(w) || elOf(w) || declared.has(w)))
    return { list: JOIN.map(([text, hint]) => ({ text: ' ' + text, hint })), typed: 0 };
  // Ctrl+Space right after a whole name ("if Pump" with no space yet): the same list, a space put in front where needed
  if (forced && w && !q) {
    const nx = after(w, null, pre);
    if (nx) return { list: nx.map(i => i.back ? { ...i, back: 0 } : { ...i, text: ' ' + i.text }), typed: 0 };
  }
  if (!w && !q) {
    const prev = /(?:"([^"\n]+)"|([A-Za-z_][\w~]*))(?:\.([A-Za-z_]\w*))?\s+$/.exec(pre);
    const nx = prev && !/^\s*(start|stop|restart|reset|play|show|goto|new|print|log|sleep|step)\b/i.test(pre) && after(prev[1] ?? prev[2], prev[3], pre.slice(0, prev.index));
    if (nx) return { list: nx, typed: 0 };
    // after true / false / a number / a text in an if or a wait: and, or
    if (forced && inCond && /(\btrue|\bfalse|\bon|\boff|\bnow|\d|")\s+$/i.test(pre) && !/(==|!=|<=|>=|<|>|=)\s*$/.test(pre)) return { list: JOIN.map(([text, hint]) => ({ text, hint })), typed: 0 };
  }

  // after the word that comes first
  const cmd = /^\s*(start|stop|restart|reset|play|show(?:\s+tab|\s+workspace)?|goto|new)\s+$/i.exec(pre)?.[1].toLowerCase().replace(/\s+/g, ' ');
  if (cmd === 'new') { if (!q) for (const [k, h] of NEW_KINDS) add(k + ' ', h, k); return done(); }
  if (cmd === 'goto') { for (const m of all.matchAll(/^\s*\[([^\]\n]+)\]/gm)) add(m[1], 'label'); return done(); }
  if (cmd?.startsWith('show')) { for (const t of W.tabs || []) named(t, 'Tab'); return done(); }
  if (cmd === 'play') { for (const e of els) if (e.type === 'alarm' || e.type === 'soundPlayer') named(e.name, e.type); return done(); }
  if (cmd) {
    if (cmd !== 'reset') for (const n of W.processes || []) named(n, 'Process');
    for (const e of els) if (TARGETS[cmd].includes(e.type)) named(e.name, e.type);
    return done();
  }
  if (q) {
    for (const e of els) add(e.name, e.type);
    for (const n of W.processes || []) add(n, 'Process');
    return w || forced ? done() : null;
  }

  // after = or == : true / false for something that is on or off
  const op = /(?:"([^"\n]+)"|([A-Za-z_][\w~]*))(?:\.([A-Za-z_]\w*))?\s*(?:==|!=|=)\s*$/.exec(pre);
  if (op) {
    const el = elOf(op[1] ?? op[2]); let attr = (op[3] ?? '').toLowerCase();
    if (el && attr === el.main) attr = '';
    if (el?.bools?.includes(attr) || declared.get(op[1] ?? op[2]) === 'bool') for (const [k, h] of ON_OFF) add(k, h);
    if (el?.type === 'timer' && attr === 'type') { add('countdown', ''); add('countup', ''); }
    if (!w && !forced) return done();
  }
  if (!w && !forced) return null;

  const atStart = /^\s*$/.test(pre);
  if (atStart) {
    for (const [k, h] of COMMANDS) command(k, h);
    // names used above in this Process come next (the ones nearest the cursor first)
    for (const m of [...above.slice(0, above.length - w.length).matchAll(/[A-Za-z_][A-Za-z0-9_~]*/g)].reverse()) {
      if (COMMANDS.some(([k]) => k.toLowerCase() === m[0].toLowerCase()) || ANYWHERE.some(([k]) => k === m[0].toLowerCase())) continue;
      if (elOf(m[0]) || declared.has(m[0]) || isProc(m[0])) add(m[0] + ' ', 'used above', m[0]);
    }
  } else {
    // a value: in an if, a wait, after = or an operator. Only what can stand there, in this order (Fritz, 2026-10-28):
    // variables made in this Process, timers, vAPI, vKonstants, Devices, Widgets, Processes, then true / false / now / not
    for (const [n, k] of declared) add(n + (/(==|!=|<=|>=|<|>|=|\+|-|\*|\/)\s*$/.test(pre) ? '' : ' '), `variable (${k})`, n);
  }
  // a name the line goes on after (if Pump ...) ends in a space and opens the next list; a value after = or == ends the line
  const isRhs = /(==|!=|<=|>=|<|>|=|\+|-|\*|\/)\s*$/.test(pre);
  const nsp = isRhs ? '' : ' ';
  const ranked = [...els].sort((a, b) => GROUP(a)[0] - GROUP(b)[0] || a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));     // each kind A to Z
  for (const e of ranked) add(e.name + nsp, GROUP(e)[0] < 4 ? GROUP(e)[1] : `${GROUP(e)[1]} (${e.type})`, e.name);     // vAPI, not vAPI (vAPI)
  for (const n of W.processes || []) add(n + nsp, 'Process', n);
  // and / or only after a value (if Pump == true an...)
  const afterValue = /\S\s+$/.test(pre) && !/(==|!=|<=|>=|<|>|=|\+|-|\*|\/|\(|\bif|\belseif|\bwait|\bnot|\band|\bor)\s*$/i.test(pre);
  if (!atStart) for (const [k, h] of ANYWHERE) if (afterValue || !['and', 'or'].includes(k)) add(['and', 'or', 'not'].includes(k) ? k + ' ' : k, h, k);
  // a one-line if: if (X > 3) Pump = true. After the ) a command can come
  if (!atStart && /\)\s*$/.test(pre)) for (const [k, h] of COMMANDS) if (!k.includes(' ')) command(k, h);
  return done();
}

// the attributes offered after a dot (Pump.st -> state): the main value first, then the others A to Z.
// Typing after the dot narrows them by their first letters (.h -> hidden, height; .he -> height).
export function attrsAfterDot(name, words, declared = new Set()) {
  if (declared.has(name)) return ['precision'];
  const el = words?.elements?.find(e => e.name === name);
  if (el) return [...new Set([el.main, ...(el.attrs || [])].filter(Boolean))];
  return words?.processes?.includes(name) ? PROCESS_ATTRS : null;
}

// on() = the Predictive text switch: when it is off nothing pops up by itself, but Ctrl+Space and 💡 Suggest still work
export function attachAutofill(ta, box, words, on = () => true) {
  let items = [], sel = 0, ctx = null, skip = null, busy = false;
  const ghost = document.createElement('div');
  ghost.className = 'afGhost hidden'; ghost.setAttribute('aria-hidden', 'true');
  box.after(ghost);

  const close = () => { box.classList.add('hidden'); ghost.classList.add('hidden'); items = []; ctx = null; };
  const lineBefore = () => { const v = ta.value, p = ta.selectionStart; return v.slice(v.lastIndexOf('\n', p - 1) + 1, p); };
  const atLineEnd = () => { const c = ta.value[ta.selectionEnd]; return ta.selectionStart === ta.selectionEnd && (c === undefined || c === '\n' || c === '\r'); };
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

  const attrsFor = name => attrsAfterDot(name, words(), declared());

  // where the cursor is, in pixels inside the editor
  function caret() {
    const cs = getComputedStyle(ta), lh = parseFloat(cs.lineHeight) || 19.5;
    const before = ta.value.slice(0, ta.selectionStart).split('\n');
    const col = before[before.length - 1].replace(/\t/g, '    ').length;
    const cw = (caret.cw ??= (() => { const c = document.createElement('canvas').getContext('2d'); c.font = cs.font; return c.measureText('0000000000').width / 10; })());
    // the editor box, measured from the list's own frame (the line numbers sit to its left)
    const r = ta.getBoundingClientRect(), f = box.offsetParent?.getBoundingClientRect() ?? { top: 0, left: 0 };
    const x0 = r.left - f.left + ta.clientLeft, y0 = r.top - f.top + ta.clientTop;
    const top = y0 + parseFloat(cs.paddingTop) + (before.length - 1) * lh - ta.scrollTop;
    const left = x0 + parseFloat(cs.paddingLeft) + col * cw - ta.scrollLeft;
    return { top, left, lh, font: cs.font, x0, y0 };
  }

  function place() {
    const { top: t, left, lh, x0, y0 } = caret(), top = t + lh + 2;
    const hgt = box.offsetHeight || 120, bottom = y0 + ta.clientHeight;
    box.style.top = (top + hgt > bottom ? Math.max(0, top - lh - hgt - 4) : top) + 'px';     // above the line when there is no room below
    box.style.left = Math.max(0, Math.min(left, x0 + ta.clientWidth - 220)) + 'px';
  }

  // the rest of the best pick, in gray after the cursor (only at the end of a line, so it covers nothing)
  function paintGhost() {
    const it = items[sel], typed = ctx?.typed ?? '';
    const rest = it && !it.back && atLineEnd() && it.text.toLowerCase().startsWith(typed.toLowerCase()) ? it.text.slice(typed.length) : '';
    if (!rest) { ghost.classList.add('hidden'); return; }
    const { top, left, font } = caret();
    ghost.textContent = rest; ghost.style.font = font;
    ghost.style.top = top + 'px'; ghost.style.left = left + 'px';
    ghost.classList.remove('hidden');
  }

  function show(list, from, kind) {
    items = list.slice(0, 40); sel = 0; ctx = { from, kind, typed: ta.value.slice(from, ta.selectionStart) };
    if (!items.length) return close();
    box.innerHTML = '';
    items.forEach((it, i) => {
      const li = document.createElement('li');
      li.textContent = (it.label ?? it.text).trim();
      if (it.hint) { const s = document.createElement('span'); s.className = 'muted'; s.textContent = '  ' + it.hint; li.append(s); }
      if (i === sel) li.className = 'sel';
      li.onmousedown = ev => { ev.preventDefault(); sel = i; accept(); };
      box.append(li);
    });
    box.classList.remove('hidden');
    place(); paintGhost();
  }

  function accept() {
    const it = items[sel]; if (!it || !ctx) return;
    const { from } = ctx; close();
    insert(from - (it.back ?? 0), it.text);
    // a pick that ends in a space: the list of what can come next opens by itself
    if (it.text.endsWith(' ')) update(true);
  }

  function update(forced = false) {
    if (ta.readOnly) return close();
    const line = lineBefore(), p = ta.selectionStart;
    if (/^\s*(\/\/|#|')/.test(line)) return close();
    // after a dot: attributes
    const dot = /(?:"([^"\n]+)"|([A-Za-z_][\w~]*))\.([A-Za-z_]*)$/.exec(line);
    // with Predictive text off only .x and .y are filled in (x_hPosition, y_vPosition: Fritz, 2026-10-28)
    const live = forced || on();
    if (!live && !(dot && /^[xy]$/i.test(dot[3]))) return close();
    if (dot) {
      const name = dot[1] ?? dot[2], typed = dot[3].toLowerCase(), attrs = attrsFor(name);
      if (!attrs) return close();
      const hits = attrs.filter(a => a.toLowerCase().startsWith(typed));
      if (!live && !(typed && hits.length === 1)) return close();
      const atStart = attrs !== PROCESS_ATTRS && /^\s*$/.test(line.slice(0, dot.index));     // a Process's attributes are read only: no " = "
      // in an if or a wait the line goes on: if vK_Tulip.visible -> = == != ... -> true (lib/engine.js reads a single = there as ==)
      const inCond = /^\s*(if|elseif|else\s+if|wait)\b/i.test(line);
      const tail = atStart ? ' = ' : inCond ? ' ' : '';
      if (typed && hits.length === 1) {                       // only one fits: fill it in now
        close();
        insert(p - typed.length, hits[0] + tail);
        skip = { pos: ta.selectionStart, rest: hits[0].slice(typed.length) + tail };
        if (inCond && live) update(true);                     // and show what can come next
        return;
      }
      const el = words()?.elements?.find(e => e.name === name);
      const hint = a => a === el?.main ? 'the same as the name alone' : el?.bools?.includes(a) ? 'true or false' : '';
      return show(hits.map(a => ({ text: a + tail, label: a, hint: hint(a) })), p - typed.length, 'attr');
    }
    const s = suggest(line, words(), ta.value.slice(0, p), ta.value, forced);
    if (!s) return close();
    show(s.list, p - s.typed, 'name');
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
    // Ctrl+Space: show what can go here, even with nothing typed yet
    if (ev.ctrlKey && (ev.code === 'Space' || ev.key === ' ')) { ev.preventDefault(); ev.stopImmediatePropagation(); update(true); return; }
    if (box.classList.contains('hidden')) return;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      sel = (sel + (ev.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length;
      [...box.children].forEach((li, i) => li.classList.toggle('sel', i === sel));
      box.children[sel]?.scrollIntoView({ block: 'nearest' });
      paintGhost();
    } else if (ev.key === 'Enter' || ev.key === 'Tab') { ev.preventDefault(); ev.stopImmediatePropagation(); accept(); }
    else if (ev.key === 'ArrowRight' && !ghost.classList.contains('hidden') && !ev.shiftKey) { ev.preventDefault(); ev.stopImmediatePropagation(); accept(); }
    else if (ev.key === 'Escape') { ev.preventDefault(); close(); }
  }, true);
  ta.addEventListener('input', ev => { if (!busy && ev.inputType) update(); });   // typed or deleted (not our own inserts)
  ta.addEventListener('blur', () => setTimeout(close, 150));
  ta.addEventListener('scroll', close);
  ta.addEventListener('click', close);
  return { open: () => { ta.focus(); update(true); } };
}
