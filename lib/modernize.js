// Rewrites BruControl-style Process lines in the newer Skynet style (Fritz, 2026-10-05):
//   "alm_Hops" active = true             ->  alm_Hops = true
//   "Kettle_SP" value = 185.5            ->  Kettle_SP = 185.5
//   if "Pump_Red" state == true          ->  if Pump_Red == true
//   "my_Widget" visibility = visible     ->  my_Widget.visible = true
//   "my_Widget" visibility = hidden      ->  my_Widget.visible = false
//   "my_Widget" visibility = hiddenlocked -> my_Widget.visible = false; my_Widget.hidden = true
//   "tm_Mash" type = countdown           ->  tm_Mash.countdown = true
//   "tm_Mash" displayname = "Mash"       ->  tm_Mash.label = "Mash"   (Label, Fritz 2026-10-27; displayname still works)
//   "HLT_PID" target = 152              ->  HLT_PID.setpoint = 152   (Rule 6.19, 2026-11-09; target still works)
// The old style still runs. Each line is only changed when the new line means exactly the same
// (both are compiled and compared), so a line the rewriter does not understand stays as it was.
import { tokenize, compile, KEYWORDS, LOGIC_WORDS, CONST_WORDS, VAR_TYPES } from './engine.js';
import { SKYNET_CONSTANTS } from '../public/skconst.js';
import { maskBlockComments } from './comments.js';
import { noSpaces } from './store.js';
import { hasSetpoint } from '../public/heatmethod.js';

const IDENT = /^[A-Za-z_][A-Za-z0-9_~]*$/;
const RESERVED = new Set([...KEYWORDS, ...LOGIC_WORDS, ...Object.keys(CONST_WORDS), ...VAR_TYPES, 'now', 'true', 'false', 'tab', 'workspace',
  ...SKYNET_CONSTANTS.map(c => c[0].toLowerCase())]);
const STATE_MAIN = ['digitalOut', 'switch', 'pushButton', 'pulseButton', 'led', 'digitalIn', 'dutyCycle', 'hysteresis', 'alarm'];
const VAR_TYPES_EL = ['gGlobal'];

// Does "name" prop mean the same as the name alone (its main value)?
function isMain(info, prop) {
  if (prop === 'value') return true;            // the name alone reads and sets "value": always the same
  if (!info) return false;
  if (prop === 'state') return STATE_MAIN.includes(info.type) || (VAR_TYPES_EL.includes(info.type) && info.dataType === 'bool');
  if (prop === 'active') return info.type === 'alarm';
  return false;
}

const literalWord = (t, words) => t?.t === 'id' && words.includes(t.v.toLowerCase());
const endsCondition = t => !t || (t.t === 'op' && ['&&', '||', ')'].includes(t.v)) || (t.t === 'id' && LOGIC_WORDS.has(t.v.toLowerCase()));

function modernizeLine(line, declared, typeOf) {
  const s = line.trim();
  if (!s || s.startsWith('//') || /^\[.*\]$/.test(s)) return line;
  let toks;
  try { toks = tokenize(line, 0); } catch { return line; }
  if (!toks.length) return line;
  const first = toks[0].t === 'id' ? toks[0].v.toLowerCase() : '';
  if (['new', 'declare', 'show', 'goto', 'step'].includes(first)) return line;
  const locked = hiddenLocked(line, toks, declared);
  if (locked) return locked;
  const edits = [];
  for (let i = 0; i + 1 < toks.length; i++) {
    const S = toks[i], P = toks[i + 1];
    if (P.t !== 'id' || (S.t !== 'str' && S.t !== 'id')) continue;
    if (i > 0 && toks[i - 1].t === 'op' && toks[i - 1].v === '.') continue;
    const prop = P.v.toLowerCase(), name = S.v;
    if (LOGIC_WORDS.has(prop) || (S.t === 'id' && RESERVED.has(name.toLowerCase()))) continue;
    i++;                                               // the parser reads "name attribute" as one pair
    if (declared.has(name)) {
      if (prop === 'precision' && S.t === 'id') edits.push({ p: S.p, e: P.e, text: `${name}.precision` });
      continue;
    }
    const info = typeOf(name);
    const bare = IDENT.test(name) && !RESERVED.has(name.toLowerCase());
    const ref = bare ? name : `"${name}"`;
    const op = toks[i + 1], lit = toks[i + 2], litOk = op?.t === 'op' && ['=', '==', '!='].includes(op.v) && endsCondition(toks[i + 3]);
    let text;
    if (isMain(info, prop)) text = bare ? name : `${ref}.value`;
    else if (prop === 'visibility' && litOk && literalWord(lit, ['visible', 'hidden', 'hiddenlocked'])) {
      text = `${ref}.visible`; edits.push({ p: lit.p, e: lit.e, text: lit.v.toLowerCase() === 'visible' ? 'true' : 'false' });
    } else if (prop === 'type' && info?.type === 'timer' && litOk && literalWord(lit, ['countdown', 'countup'])) {
      text = `${ref}.countdown`; edits.push({ p: lit.p, e: lit.e, text: lit.v.toLowerCase() === 'countdown' ? 'true' : 'false' });
    } else text = `${ref}.${prop === 'displayname' ? 'label' : prop === 'target' && hasSetpoint(info) ? 'setpoint' : prop}`;
    edits.push({ p: S.p, e: P.e, text });
  }
  if (!edits.length) return line;
  let out = line;
  for (const ed of edits.sort((a, b) => b.p - a.p)) out = out.slice(0, ed.p) + ed.text + out.slice(ed.e);
  return sameMeaning(line, out, declared, typeOf) ? out : line;
}

// "my_Widget" visibility = hiddenlocked on a line of its own becomes two settings (Fritz, 2026-10-23):
// my_Widget.visible = false; my_Widget.hidden = true  (.hidden = true wins over .visible = true)
function hiddenLocked(line, toks, declared) {
  const [S, P, op, lit] = toks;
  if (toks.length !== 4 || (S.t !== 'str' && S.t !== 'id') || !(P.t === 'id' && P.v.toLowerCase() === 'visibility')) return null;
  if (!(op.t === 'op' && op.v === '=') || !literalWord(lit, ['hiddenlocked']) || declared.has(S.v)) return null;
  if (S.t === 'id' && RESERVED.has(S.v.toLowerCase())) return null;
  const ref = IDENT.test(S.v) && !RESERVED.has(S.v.toLowerCase()) ? S.v : `"${S.v}"`;
  const out = line.slice(0, S.p) + `${ref}.visible = false; ${ref}.hidden = true` + line.slice(lit.e);
  try {
    const st = compile(out, { declared }).stmts;
    const ok = st.length === 2 && st.every(x => x.target?.kind === 'prop' && x.target.name === S.v) && st[0].target.prop.toLowerCase() === 'visible' && st[1].target.prop.toLowerCase() === 'hidden';
    return ok ? out : null;
  } catch { return null; }
}

// ---- the safety check: both lines compiled, then compared with the old/new spellings made equal
function canonical(line, declared, typeOf) {
  const c = compile(line, { declared });
  // "if (...) {" on its own compiles with an endif for its open { : only the if counts
  if (c.stmts.length === 2 && c.stmts[1].op === 'endif' && /\{\s*$/.test(line)) c.stmts.pop();
  if (c.stmts.length !== 1) return null;
  const cp = (name, prop) => isMain(typeOf(name), prop) ? '@main' : prop.toLowerCase() === 'displayname' ? 'label'
    : ['target', 'setpoint'].includes(prop.toLowerCase()) && hasSetpoint(typeOf(name)) ? 'target' : prop;
  const word = e => e?.k === 'var' ? e.name.toLowerCase() : null;
  const ex = e => {
    if (!e) return e;
    switch (e.k) {
      case 'prop': case 'idprop': return { ref: e.name, p: cp(e.name, e.prop) };
      case 'cmp': {
        let l = ex(e.l), r = ex(e.r);
        const wl = word(e.l), wr = word(e.r);
        const swap = (ref, w) => {
          if (ref?.p === 'visibility' && ['visible', 'hidden', 'hiddenlocked'].includes(w)) return [{ ...ref, p: 'visible' }, { lit: w === 'visible' }];
          if (ref?.p === 'type' && ['countdown', 'countup'].includes(w)) return [{ ...ref, p: 'countdown' }, { lit: w === 'countdown' }];
          return null;
        };
        const a = swap(l, wr), b = !a && swap(r, wl);
        if (a) [l, r] = a; else if (b) [r, l] = b;
        return { k: 'cmp', op: e.op, l, r };
      }
      case 'lit': return { lit: e.v };
      default: { const o = { ...e }; for (const k of ['l', 'r', 'e']) if (o[k]) o[k] = ex(o[k]); return o; }
    }
  };
  const st = { ...c.stmts[0] }; delete st.line; delete st.next; delete st.end;
  if (st.expr) st.expr = ex(st.expr);
  if (st.target) {
    const t = st.target;
    st.target = t.kind === 'prop' ? { ref: t.name, p: cp(t.name, t.prop) } : { var: t.name };
    const w = word(c.stmts[0].expr);
    if (st.target.p === 'visibility' && ['visible', 'hidden', 'hiddenlocked'].includes(w) && st.aop === '=') { st.target.p = 'visible'; st.expr = { lit: w === 'visible' }; }
    if (st.target.p === 'type' && ['countdown', 'countup'].includes(w) && st.aop === '=') { st.target.p = 'countdown'; st.expr = { lit: w === 'countdown' }; }
  }
  return JSON.stringify(st);
}
function sameMeaning(a, b, declared, typeOf) {
  try { const x = canonical(a, declared, typeOf); return x !== null && x === canonical(b, declared, typeOf); } catch { return false; }
}

// text -> { text, changed (lines) }. typeOf(name) -> the element ({type, dataType}) or undefined.
export function modernize(text, typeOf = () => undefined) {
  const declared = new Set();
  try { for (const s of compile(text).stmts) if (s.op === 'new' && !s.global) declared.add(s.name); } catch { /* lines that do not compile stay */ }
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  let changed = 0;
  const lines = text.split(/\r?\n/), { touched } = maskBlockComments(lines);
  // a line with /* block comment */ text in it is left as it is
  const out = lines.map((l, i) => { if (touched.has(i)) return l; const n = modernizeLine(l, declared, typeOf); if (n !== l) changed++; return n; });
  return { text: out.join(eol), changed };
}

// ---- names without spaces ----
// Map old name -> new name for every name with a space (never onto a name that is already used)
export function spaceRenames(names) {
  const taken = new Set(names), map = new Map();
  for (const n of names) {
    if (!/\s/.test(n)) continue;
    let to = noSpaces(n), k = 2;
    while (taken.has(to)) to = noSpaces(n) + '_' + k++;
    taken.add(to); map.set(n, to);
  }
  return map;
}
// "old name" in quotes -> "new_name" in a Process
export function renameInText(text, map) {
  if (!map.size) return text;
  return text.replace(/"([^"\n]*)"/g, (m, n) => map.has(n) ? `"${map.get(n)}"` : m);
}
// Replaces every string in obj (deep) that is exactly an old name
export function renameDeep(obj, map) {
  if (Array.isArray(obj)) return obj.map(v => renameDeep(v, map));
  if (obj && typeof obj === 'object') { for (const k of Object.keys(obj)) obj[k] = renameDeep(obj[k], map); return obj; }
  return typeof obj === 'string' && map.has(obj) ? map.get(obj) : obj;
}
