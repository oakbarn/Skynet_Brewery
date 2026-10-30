// Color coding of Processes (Fritz, 2026-10-19). Used by the Process editor, the XML file export and the Notepad++ colors file.
// Every character of a Process gets a class by what it does:
//   cmd   commands (if, wait, start, new value ...) and their words (true, false, now)   blue
//   dev   Devices (tied to a port on a PLC)                                            magenta
//   wid   Widgets (timers, alarms, labels ... app only)                                 teal
//   vk    gKonstants                                                                    purple
//   vapi  gAPI                                                                          red
//   var   variables made with "new value x" ...                                         black on white
//   proc  names of Processes (start my_Process)                                         olive
//   op    operators  = + - * / < > ! ^ ( ) , . ++ -- { } ;  and, or, not                 orange
//   str   "text in quotes"                                                              brown
//   num   numbers and times (185.5, 00:10:00)                                           gold
//   com   comments: //, #, ' and /* ... */ (C, C++, C#, JavaScript, Node.js, Python, VB)  green
//   lab   [labels] and the label after goto                                             slate
//   attr  the attribute after a dot (my_Widget.visible)                                 gray
// Skynet Constants (skc_Kg_To_Lb ...) are blue like true, false and now. Node loads it too (tests, tools/notepadpp.js).
import { SKYNET_CONSTANTS } from './skconst.js';

export const CLASSES = ['', 'cmd', 'dev', 'wid', 'vk', 'vapi', 'var', 'proc', 'op', 'str', 'num', 'com', 'lab', 'attr'];
const C = Object.fromEntries(CLASSES.map((c, i) => [c, i]));

export const COMMANDS = ['if', 'elseif', 'else', 'endif', 'goto', 'sleep', 'wait', 'start', 'stop', 'reset', 'print', 'clear', 'show', 'log', 'new', 'play',
  'step', 'restart', 'pause', 'tab', 'value', 'string', 'bool', 'time', 'datetime'];
export const CONSTANTS = ['true', 'false', 'now', 'on', 'off'];
export const LOGIC = ['and', 'or', 'not'];
// element types that sit on a PLC port: Devices. Every other type (but gKonstant and gAPI) is a Widget.
export const DEVICE_TYPES = ['digitalOut', 'digitalIn', 'temperature', 'analogIn', 'pwmOut', 'analogOut', 'flowMeter', 'scale', 'stepper', 'dutyCycle', 'hysteresis', 'pid'];
const CMD = new Set(COMMANDS), CONST = new Set([...CONSTANTS, ...SKYNET_CONSTANTS.map(c => c[0].toLowerCase())]), LOG = new Set(LOGIC);

// The colors, for a light page (the files) and for the panel's dark look. Notepad++ uses the light ones.
export const COLORS = {
  light: { cmd: '#0000FF', dev: '#D000D0', wid: '#00838F', vk: '#7B1FA2', vapi: '#E00000', var: '#000000', varBg: '#FFFFFF', proc: '#6B8E23', op: '#D35400',
    str: '#A0522D', num: '#9A6700', com: '#008000', lab: '#455A64', attr: '#607D8B', text: '#000000', bg: '#FFFFFF' },
};
export const LEGEND = [['cmd', 'Commands'], ['dev', 'Devices'], ['wid', 'Widgets'], ['vk', 'gKonstants'], ['vapi', 'gAPI'], ['var', 'Variables'], ['proc', 'Processes'],
  ['op', 'Operators'], ['str', 'Text in quotes'], ['num', 'Numbers and times'], ['com', 'Comments'], ['lab', 'Labels'], ['attr', 'Attributes']];

export function elementClass(type) {
  if (type === 'gKonstant') return 'vk';
  if (type === 'gAPI') return 'vapi';
  return DEVICE_TYPES.includes(type) ? 'dev' : 'wid';
}

// words: { elements: [{ name, type }], processes: [names] } (the panel's /ui/scripts/words)
function lookup(words) {
  const names = new Map();
  for (const p of words?.processes ?? []) names.set(p.toLowerCase(), 'proc');
  for (const e of words?.elements ?? []) names.set(e.name.toLowerCase(), elementClass(e.type));
  return names;
}
export const declaredVars = text => new Set([...String(text).matchAll(/^\s*new\s+\w+\s+([A-Za-z_]\w*)/gim)].map(m => m[1].toLowerCase()));

const OPS = /^(==|!=|<>|<=|>=|\+\+|--|\+=|-=|\*=|\/=|&&|\|\||[=<>+\-*/^()!,.{};])/;
// text -> Uint8Array, one class number (index in CLASSES) per character
export function classify(text, words) {
  text = String(text ?? '');
  const out = new Uint8Array(text.length), names = lookup(words), vars = declaredVars(text);
  const set = (a, b, c) => out.fill(C[c], a, b);
  let inBlock = false, at = 0;
  for (const line of text.split('\n')) {
    const L = line.length, base = at;
    at += L + 1;
    let i = 0, prev = null, first = true;      // prev: the last thing seen on this line ('.', 'goto' or a word)
    if (!inBlock && /^\s*\[.*\]\s*$/.test(line)) { set(base, base + L, 'lab'); continue; }
    while (i < L) {
      const c = line[i], p = base + i;
      if (inBlock) {
        const e = line.indexOf('*/', i);
        if (e < 0) { set(p, base + L, 'com'); i = L; break; }
        set(p, base + e + 2, 'com'); i = e + 2; inBlock = false; continue;
      }
      if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }
      if ((c === '/' && line[i + 1] === '/') || c === '#' || c === "'") { set(p, base + L, 'com'); break; }
      if (c === '/' && line[i + 1] === '*') { inBlock = true; set(p, p + 2, 'com'); i += 2; continue; }
      if (c === '"') {
        let j = line.indexOf('"', i + 1); j = j < 0 ? L : j + 1;
        const inner = line.slice(i + 1, j - 1).toLowerCase();
        set(p, base + j, names.get(inner) ?? (vars.has(inner) ? 'var' : 'str'));
        i = j; prev = 'name'; first = false; continue;
      }
      const rest = line.slice(i);
      let m;
      if (prev === 'step' && (m = /^[A-Za-z]\d+\.\d+/.exec(rest))) { set(p, p + m[0].length, 'num'); i += m[0].length; prev = 'num'; continue; }   // step S2.00001
      if ((m = /^\d+:\d{2}(?::\d{2}(?:\.\d+)?)?/.exec(rest)) || (m = /^(\d+\.?\d*|\.\d+)/.exec(rest))) {
        if (!(c === '.' && prev === 'name')) { set(p, p + m[0].length, 'num'); i += m[0].length; prev = 'num'; first = false; continue; }
      }
      if ((m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest))) {
        const w = m[0], lw = w.toLowerCase();
        let cls = '';
        if (prev === '.') cls = 'attr';
        else if (prev === 'goto') cls = 'lab';
        else if (vars.has(lw)) cls = 'var';
        else if (names.has(lw)) cls = names.get(lw);
        else if (LOG.has(lw)) cls = 'op';
        else if (CONST.has(lw) || CMD.has(lw)) cls = 'cmd';
        if (cls) set(p, p + w.length, cls);
        prev = first && (lw === 'goto' || lw === 'step') ? lw : 'name'; first = false;
        i += w.length; continue;
      }
      if ((m = OPS.exec(rest))) { set(p, p + m[0].length, 'op'); prev = m[0] === '.' ? '.' : 'op'; i += m[0].length; first = false; continue; }
      i++;
    }
  }
  return out;
}

const esc = t => t.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch]);
// HTML of text[a, b): one <span class="hl-..."> per run. marks: [[start, end], ...] (find matches), cur: the index of the current one.
export function toHtml(text, cls, a = 0, b = text.length, marks = [], cur = -1, prefix = 'hl-') {
  const mk = new Int32Array(b - a);       // 0 none, 1 match, 2 current match
  marks.forEach(([s, e], k) => { for (let i = Math.max(s, a); i < Math.min(e, b); i++) mk[i - a] = k === cur ? 2 : 1; });
  let html = '', i = a;
  while (i < b) {
    let j = i + 1;
    while (j < b && cls[j] === cls[i] && mk[j - a] === mk[i - a] && text[j] !== '\n' && text[i] !== '\n') j++;
    const part = esc(text.slice(i, j)), c = CLASSES[cls[i]], m = mk[i - a];
    let s = c && text[i] !== '\n' ? `<span class="${prefix}${c}">${part}</span>` : part;
    if (m) s = `<mark${m === 2 ? ' class="cur"' : ''}>${s}</mark>`;
    html += s; i = j;
  }
  return html;
}

// ---- files ----
const pad2 = n => String(n).padStart(2, '0');
const stamp = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
const xmlEsc = t => String(t).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
const cdata = t => '<![CDATA[' + String(t).replace(/]]>/g, ']]]]><![CDATA[>') + ']]>';
export const NS = 'https://github.com/oakbarn/Skynet_Brewery/process';

// An XML file of a Process, or of the highlighted part of it [a, b). Opened in a web browser it shows the Process in color with
// line numbers (it is XHTML); the <sk:process> element keeps the plain text for programs.
export function processXml(name, text, words, a = 0, b = text.length, when = new Date()) {
  const k = COLORS.light, cls = classify(text, words);
  const firstLine = text.slice(0, a).split('\n').length, part = text.slice(a, b), lines = part.split('\n');
  const lastLine = firstLine + lines.length - 1, whole = a === 0 && b === text.length;
  const width = String(lastLine).length;
  let at = a, body = '';
  lines.forEach((l, n) => {
    body += `<span class="ln">${String(firstLine + n).padStart(width)}</span>${toHtml(text, cls, at, at + l.length)}\n`;
    at += l.length + 1;
  });
  const css = [
    `@namespace sk url(${NS});`, 'sk|process { display: none; }',
    `body { background: ${k.bg}; color: ${k.text}; font-family: system-ui, sans-serif; margin: 16px; }`,
    'h1 { font-size: 20px; margin: 0 0 4px; } p { margin: 0 0 10px; color: #555; }',
    'pre { font: 14px/1.5 Consolas, Menlo, monospace; border: 1px solid #ccc; border-radius: 6px; padding: 8px; overflow-x: auto; tab-size: 4; }',
    '.ln { color: #999; padding-right: 12px; user-select: none; }',
    '.legend span { display: inline-block; margin: 0 10px 4px 0; font: 13px Consolas, Menlo, monospace; }',
    ...LEGEND.map(([c]) => `.hl-${c} { color: ${k[c]}; }`),
    `.hl-var { background: ${k.varBg}; box-shadow: 0 0 0 1px #bbb; }`,
  ].join('\n');
  const legend = LEGEND.map(([c, t]) => `<span class="hl-${c}">${xmlEsc(t)}</span>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:sk="${NS}">
<head><meta charset="UTF-8"/><title>${xmlEsc(name)}</title>
<style>
${css}
</style></head>
<body>
<h1>${xmlEsc(name)}</h1>
<p>Skynet Brewery Process, ${whole ? 'the whole Process' : `lines ${firstLine} to ${lastLine}`}, saved ${stamp(when)}.</p>
<div class="legend">${legend}</div>
<pre>${body}</pre>
<sk:process name="${xmlEsc(name)}" firstLine="${firstLine}" lastLine="${lastLine}" saved="${when.toISOString()}">${cdata(part)}</sk:process>
</body>
</html>
`;
}


// Notepad++ "User Defined Language" file: Language > User Defined Language > Define your language > Import.
// Made from this brewery's names (Devices, Widgets, gKonstants, gAPI, Processes) and the variables made in its Processes.
// Without words it is a general file: gKonstants by their gK prefix and gAPI by gA.
export function notepadPlusPlus(words, texts = []) {
  const k = COLORS.light, hex = c => c.replace('#', '');
  const ok = n => /^[A-Za-z_][A-Za-z0-9_]*$/.test(n);
  const group = c => [...new Set((words?.elements ?? []).filter(e => elementClass(e.type) === c && ok(e.name)).map(e => e.name))].sort().join(' ');
  const vars = [...new Set(texts.flatMap(t => [...String(t).matchAll(/^\s*new\s+\w+\s+([A-Za-z_]\w*)/gim)].map(m => m[1])))].sort().join(' ');
  const general = !words;
  const kw = [
    [...COMMANDS, ...CONSTANTS, ...SKYNET_CONSTANTS.map(c => c[0])].filter(w => !['if', 'elseif', 'else', 'endif'].includes(w)).join(' '),   // if ... endif are the fold words
    group('dev'),
    general ? 'gK' : group('vk'),
    general ? 'gA' : group('vapi'),
    vars,
    group('wid'),
    (words?.processes ?? []).filter(ok).join(' '),
    LOGIC.join(' '),
  ];
  const style = (name, fg, extra = '') => `            <WordsStyle name="${name}" fgColor="${hex(fg)}" bgColor="FFFFFF" colorStyle="1" fontName="" fontStyle="0" nesting="0"${extra} />`;
  const empty = n => `            <Keywords name="${n}"></Keywords>`;
  return `<?xml version="1.0" encoding="UTF-8" ?>
<!-- Skynet Brewery Process colors for Notepad++ (${general ? 'general' : 'made from this brewery'}).
     Notepad++: Language > User Defined Language > Define your language... > Import..., pick this file, then restart Notepad++.
     Processes (.txt files in the scripts folder) then open in color when you pick Language > Skynet Process. -->
<NotepadPlus>
    <UserLang name="Skynet Process" ext="sky" udlVersion="2.1">
        <Settings>
            <Global caseIgnored="yes" allowFoldOfComments="yes" foldCompact="no" forcePureLC="0" decimalSeparator="0" />
            <Prefix Keywords1="no" Keywords2="no" Keywords3="${general ? 'yes' : 'no'}" Keywords4="${general ? 'yes' : 'no'}" Keywords5="no" Keywords6="no" Keywords7="no" Keywords8="no" />
        </Settings>
        <KeywordLists>
            <Keywords name="Comments">00// 00# 00' 01 02 03/* 04*/</Keywords>
${['Numbers, prefix1', 'Numbers, prefix2', 'Numbers, extras1', 'Numbers, extras2', 'Numbers, suffix1', 'Numbers, suffix2', 'Numbers, range'].map(empty).join('\n')}
            <Keywords name="Operators1">= + - * / &lt; &gt; ! ^ ( ) , . &amp;&amp; || ++ -- ;</Keywords>
            <Keywords name="Operators2"></Keywords>
            <Keywords name="Folders in code1, open">if</Keywords>
            <Keywords name="Folders in code1, middle">elseif else</Keywords>
            <Keywords name="Folders in code1, close">endif</Keywords>
            <Keywords name="Folders in code2, open">{</Keywords>
            <Keywords name="Folders in code2, middle"></Keywords>
            <Keywords name="Folders in code2, close">}</Keywords>
${['Folders in comment, open', 'Folders in comment, middle', 'Folders in comment, close'].map(empty).join('\n')}
${kw.map((w, i) => `            <Keywords name="Keywords${i + 1}">${xmlEsc(w)}</Keywords>`).join('\n')}
            <Keywords name="Delimiters">00&quot; 01 02&quot; 03[ 04 05] 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23</Keywords>
        </KeywordLists>
        <Styles>
            <WordsStyle name="DEFAULT" fgColor="000000" bgColor="FFFFFF" colorStyle="0" fontName="" fontStyle="0" nesting="0" />
${style('COMMENTS', k.com)}
${style('LINE COMMENTS', k.com)}
${style('NUMBERS', k.num)}
${style('KEYWORDS1', k.cmd)}
${style('KEYWORDS2', k.dev)}
${style('KEYWORDS3', k.vk)}
${style('KEYWORDS4', k.vapi)}
            <WordsStyle name="KEYWORDS5" fgColor="000000" bgColor="FFFFFF" colorStyle="3" fontName="" fontStyle="0" nesting="0" />
${style('KEYWORDS6', k.wid)}
${style('KEYWORDS7', k.proc)}
${style('KEYWORDS8', k.op)}
${style('OPERATORS', k.op)}
${style('FOLDER IN CODE1', k.cmd)}
${style('FOLDER IN CODE2', k.cmd)}
${style('FOLDER IN COMMENT', k.com)}
${style('DELIMITERS1', k.str)}
${style('DELIMITERS2', k.lab)}
${[3, 4, 5, 6, 7, 8].map(n => style('DELIMITERS' + n, k.text)).join('\n')}
        </Styles>
    </UserLang>
</NotepadPlus>
`;
}
