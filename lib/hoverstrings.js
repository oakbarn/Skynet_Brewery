// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// French balloons (Hover Help) (Rule 11.11): finds every English balloon text in the Panel's and the BruControl Import's page code,
// so a test can tell which ones still need their French (public/hoverhelp-fr.json).
// A balloon text is a quoted text that is
//   - the title or Hover Help of something: title: '…', tip: '…', help: '…', 'data-help': '…', x.title = '…', x.dataset.help = '…',
//     title="…" or data-help="…" in a page; every quoted text of that value counts (a + b, a ? b : c, [a, b].join)
//   - or any quoted text in a constant whose name ends in TIP, TIPS or HELP (const LABEL_UP_TIP = …, const MF_TIPS = { … })
// A text with ${…} in it is kept with {0}, {1}… in their place; its French keeps the same {0}, {1}….
import fs from 'node:fs';
import path from 'node:path';

const HELP_KEYS = new Set(['title', 'tip', 'help', 'data-help', 'hint']);
const TIP_CONST = /^[A-Z][A-Z0-9_]*_(TIPS?|HELP)$|^(TIPS?|HELP)$/;
const OPEN = '([{', CLOSE = ')]}';
const STATEMENT = new Set(['const', 'let', 'var', 'function', 'export', 'import', 'if', 'for', 'while', 'return', 'class', 'async']);
const REGEX_BEFORE = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '+', '-', '*', '%', '<', '>', '~', '^', 'return', 'typeof', 'case', 'do', 'else', 'in', 'of', '=>', '&&', '||', '??', '==', '===', '!=', '!==']);

// a text worth translating: two letters or more in a row
export const wordy = s => /[A-Za-z]{2}/.test(s) && !/^[a-z][\w-]*$/.test(s) && !/^(\.|\/|#|[\w-]+\.(js|css|svg|png|mp3|wav|md)$)/.test(s);

// the quoted texts of one script, with where each sits
export function scriptTexts(src) {
  const out = [];
  let i = 0, depth = 0;
  const prev = [];                           // the last few things read (words, marks, quoted texts as {s})
  let helpAt = -1;                           // the depth at which a help value started (-1: not in one)
  let constAt = -1, constName = '';          // the depth of a TIP/TIPS/HELP constant's value
  const push = t => { prev.push(t); if (prev.length > 6) prev.shift(); };
  const last = (n = 1) => prev[prev.length - n];
  const isHelpStart = () => {
    const a = last(), b = last(2), c = last(3);
    if (a === ':' && (HELP_KEYS.has(b) || (b && b.s !== undefined && HELP_KEYS.has(b.s)))) return true;
    if (a === '=' && (b === 'title' || b === 'help') && c === '.' && last(4) !== 'document') return true;      // not the window's own title
    return false;
  };
  const take = (s, line) => {
    if (/\s(title|data-help)=["']/.test(s)) for (const t of pageTexts(s)) out.push({ ...t, line, where: 'page' });      // a page part written in the code
    if (!wordy(s)) return;
    if (helpAt >= 0 || constAt >= 0) out.push({ text: s, line, where: constAt >= 0 ? constName : 'help' });
  };
  const lineOf = k => src.slice(0, k).split('\n').length;
  const inner = q => { if ((helpAt >= 0 || constAt >= 0) && /[A-Za-z]{2}/.test(q.text) && !/^[\w-]+\.(js|css|svg|png|mp3|wav|md)$/.test(q.text)) out.push({ text: q.text, line: q.line, where: 'inner' }); };
  const readTemplate = () => {               // i at the opening `; returns its text with {0}… and reads what is inside each ${…}
    const start = i; i++;
    let text = '', n = 0;
    while (i < src.length && src[i] !== '`') {
      if (src[i] === '\\') { text += src[i + 1] === 'n' ? '\n' : src[i + 1]; i += 2; continue; }
      if (src[i] === '$' && src[i + 1] === '{') {
        i += 2; let d = 1;
        let pc = '(';      // the last mark read inside ${…}, to tell a regular expression from a divide
        while (i < src.length && d) {
          const ch = src[i];
          // a text inside ${…} of a balloon is turned on its own (One click ${on ? 'stops' : 'starts'} it)
          if (ch === '`') { const q = readTemplate(); inner(q); pc = 'x'; continue; }
          if (ch === "'" || ch === '"') { const q = readQuoted(); inner(q); pc = 'x'; continue; }
          if (ch === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
          if (ch === '/' && '(,=:[!&|?{};+'.includes(pc)) { skipRegex(); pc = 'x'; continue; }
          if (ch === '{') d++; else if (ch === '}') d--;
          if (!/\s/.test(ch)) pc = ch;
          i++;
        }
        text += `{${n++}}`; continue;
      }
      text += src[i++];
    }
    i++;
    return { text, line: lineOf(start) };
  };
  const skipRegex = () => {                  // i at the opening /: past the closing / and its letters
    i++; let cls = false;
    while (i < src.length && src[i] !== '\n') { if (src[i] === '\\') { i += 2; continue; } if (src[i] === '[') cls = true; else if (src[i] === ']') cls = false; else if (src[i] === '/' && !cls) break; i++; }
    i++; while (/[a-z]/.test(src[i] || '')) i++;
  };
  const readQuoted = () => {
    const q = src[i], start = i; i++;
    let text = '';
    while (i < src.length && src[i] !== q) {
      if (src[i] === '\\') {
        const e = src[i + 1];
        if (e === 'u') { const m = src.slice(i + 2).match(/^\{([0-9a-fA-F]+)\}|^([0-9a-fA-F]{4})/); text += String.fromCodePoint(parseInt(m[1] || m[2], 16)); i += 2 + m[0].length; continue; }
        text += e === 'n' ? '\n' : e === 't' ? '\t' : e; i += 2; continue;
      }
      if (src[i] === '\n') break;
      text += src[i++];
    }
    i++;
    return { text, line: lineOf(start) };
  };
  while (i < src.length) {
    const ch = src[i];
    if (ch === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (ch === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); i = e < 0 ? src.length : e + 2; continue; }
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === '/' && (prev.length === 0 || REGEX_BEFORE.has(last()))) { skipRegex(); push('re'); continue; }      // a regular expression
    if (ch === "'" || ch === '"' || ch === '`') {
      const startHelp = helpAt < 0 && isHelpStart();
      if (startHelp) helpAt = depth;
      const t = ch === '`' ? readTemplate() : readQuoted();
      take(t.text, t.line);
      push({ s: t.text }); continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      if (helpAt < 0 && isHelpStart()) helpAt = depth;      // title: ok ? 'a' : 'b'
      let w = ''; while (/[\w$]/.test(src[i] || '')) w += src[i++];
      if (STATEMENT.has(w)) { if (constAt >= depth) constAt = -1; if (helpAt >= depth) helpAt = -1; }      // a new statement: the last value ended (no ;)
      if ((last() === 'const' || last() === 'let' || last() === 'var') && TIP_CONST.test(w) && constAt < 0) { constAt = depth; constName = w; }
      push(w); continue;
    }
    if (/[0-9]/.test(ch)) { while (/[\w.]/.test(src[i] || '')) i++; push('0'); continue; }
    // marks
    let m = ch;
    for (const op of ['===', '!==', '=>', '&&', '||', '??', '==', '!=', '<=', '>=', '...', '?.']) if (src.startsWith(op, i)) { m = op; break; }
    i += m.length;
    if (OPEN.includes(m)) { if (helpAt < 0 && isHelpStart()) helpAt = depth; depth++; }
    else if (CLOSE.includes(m)) { depth--; if (helpAt > depth) helpAt = -1; if (constAt > depth) constAt = -1; }
    else if (m === ',' || m === ';') { if (helpAt === depth) helpAt = -1; if (constAt === depth) constAt = -1; }
    if (m === '=' && helpAt < 0 && constAt < 0) { /* title = … starts at the next quoted text */ }
    push(m);
  }
  return out;
}

// the title="…" and data-help="…" texts of a page
export function pageTexts(src) {
  const out = [];
  const lineOf = k => src.slice(0, k).split('\n').length;
  const ent = s => s.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#10;/g, '\n').replace(/&amp;/g, '&');
  for (const m of src.matchAll(/\s(?:title|data-help)=("([^"]*)"|'([^']*)')/g)) {
    const t = ent(m[2] ?? m[3]);
    if (wordy(t)) out.push({ text: t, line: lineOf(m.index), where: 'page' });
  }
  // a page's own script
  for (const m of src.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const base = lineOf(m.index) - 1;
    for (const t of scriptTexts(m[1])) out.push({ ...t, line: t.line + base });
  }
  return out;
}

// The BruControl Import's own pages keep English balloons for now: its Help is on hold, and the language is picked in the Panel's Help.
// The sign-in page has no balloons.
export const SKIP = ['public/importer', 'public/vendor', 'public/login.js', 'public/login.html'];
// every balloon text of the Panel: Map text → [file:line, …]
export function balloonTexts(root) {
  const found = new Map();
  const walk = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name), rel = path.relative(root, p).replace(/\\/g, '/');
      if (SKIP.includes(rel)) continue;
      if (e.isDirectory()) { walk(p); continue; }
      if (!/\.(js|html)$/.test(e.name) || /\.min\.js$/.test(e.name)) continue;
      const src = fs.readFileSync(p, 'utf8');
      const list = e.name.endsWith('.html') ? pageTexts(src) : scriptTexts(src);
      for (const t of list) {
        const at = rel + ':' + t.line;
        if (!found.has(t.text)) found.set(t.text, []);
        found.get(t.text).push(at);
      }
    }
  };
  walk(path.join(root, 'public'));
  return found;
}
