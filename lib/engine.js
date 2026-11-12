// BruControl-style script engine.
// Scripts are plain text files in the scripts folder. A script is read and compiled
// from its file EVERY time it is started, so an edited script always runs its new version.
import fs from 'node:fs';
import path from 'node:path';
import { fileStamp, STAMP_TAIL } from './filedate.js';
import { EventEmitter } from 'node:events';
import {
  TimeVal, DateVal, coerce, coerceOrNull, defaultFor, toNum, toStr, toBool, plain,
  add, sub, mul, div, compare, NULL_MATH,
} from './values.js';
import { cleanName, SOUND_TYPES, isManualValve as isManualValveEl, isManualValveWidget, isConfirmation, onCloseAll, onOpenAll } from './store.js';
// done by hand, so a Process asks a person and waits: a Manual valve, or any Confirmation Widget (Rule 1.28: a Manual Pump, or a
// Switch or LED with .confirmation ticked)
const isManualValve = el => isManualValveEl(el) || isConfirmation(el);
import { isRecipeName, isKnownRecipeName, recipeNames, recipeValue, recipeValues } from './brewprocess.js';
import { checkFileName } from '../public/names.js';
import { byHandWords } from '../public/confirm.js';
import { clock } from './simclock.js';
import { classOf, renumber as renumberSteps, CLASSES } from './scaffold.js';
import { maskBlockComments } from './comments.js';
import { newKey } from './keys.js';
import { skynetConstant, isSkynetConstant, isSkynetConstantName } from '../public/skconst.js';
import { versionName } from '../public/vername.js';
import { flowKey, flowName } from '../public/flowcolor.js';
import { findQdHose, isQdHose, connectTarget, connectHose } from './qdhose.js';
import { groupByName } from './dbgroups.js';
import { hasCode, widgetCodeText } from '../public/codevalue.js';
import { declareCheck, VAR_KINDS, kindValueError, TIME_PARTS, timePartError } from '../public/gkinds.js';
import { heatMethodKey, heatMethodWord, isMethodDevice } from '../public/heatmethod.js';
import { isAppliance, isHandProp, handAsk } from '../public/appliance.js';
import { readSg, fromSg } from '../public/hydrometer.js';
// take_reading's Pause (OakBarn Brewery, 2026-11-09): "During Pause it is Hidden and Pops up Again in 5 minutes"
export const READING_PAUSE_MS = 5 * 60000;
// Flow colors (Fritz, 2026-11-03, Rule 5.21): tab.flow_Color (the Tab each screen shows) and Pipe_1.flow_Color (a pipe or hose;
// .flow is the same). They are kept by the Brain until set to None, a Schema is loaded or the panel restarts.
const FLOW_PROPS = new Set(['flow_color', 'flow']);

const VAR_TYPES = ['value', 'string', 'bool', 'time', 'datetime'];
const CONST_WORDS = { visible: 'visible', hidden: 'hidden', countdown: 'countdown', countup: 'countup', none: 'none', custom: 'custom', default: 'default',
  hiddenlocked: 'hiddenlocked', on: true, off: false, null: null };     // NULL: the empty value (Rule 1.32)
export const KEYWORDS = new Set(['if', 'elseif', 'else', 'endif', 'goto', 'sleep', 'wait', 'start', 'stop', 'reset', 'print', 'clear', 'show', 'send_db', 'send_db_group', 'start_db_group', 'stop_db_group', 'new', 'play', 'step', 'restart', 'lock_equipment', 'unlock_equipment', 'ask', 'close_all_valves', 'open_all_valves', 'open_valve', 'close_valve', 'all_pumps_off', 'import_recipe', 'start_hop_alerts', 'stop_hop_alerts', 'take_reading']);
// words that join conditions: never an attribute name ("if a and b")
export const LOGIC_WORDS = new Set(['and', 'or', 'not']);
export { CONST_WORDS, VAR_TYPES };
KEYWORDS.add('declare');     // the same as new (Fritz, 2026-11-06, Rule 1.24)
const ASSIGN_OPS = new Set(['=', '+=', '-=', '*=', '/=']);
const BAD_NAME = /[\\/:*?"<>|]/;

// "step" followed by a number and/or a quoted name (not "step = 5", an element called step)
const STEP_RE = /^step(?=\s|$)(?!\s*(?:[-+*/]?=(?!=)|\.))(?:\s+([A-Za-z]?\d+\.\d+))?(?:\s+(.*))?$/i;

class ScriptError extends Error {
  constructor(msg, line) { super(msg); this.line = line; }
}

// ---------------- tokenizer ----------------
// Every token keeps where it starts (p) and ends (e) in the line, so lines can be rewritten (lib/modernize.js).
export function tokenize(src, line) {
  const toks = []; let i = 0;
  const push = (t, v, len) => { toks.push({ t, v, p: i, e: i + len }); i += len; };
  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }
    if ((c === '/' && src[i + 1] === '/') || c === '#' || c === "'") break;    // rest of line is a comment (// C and JavaScript, # Python, ' Visual Basic)
    if (c === '"') {
      let j = i + 1, s = '';
      while (j < src.length && src[j] !== '"') {
        if (src[j] === '\\' && src[j + 1] === 'n') { s += '\n'; j += 2; continue; }
        s += src[j++];
      }
      if (j >= src.length) throw new ScriptError('Missing closing quote', line);
      push('str', s, j + 1 - i); continue;
    }
    let m;
    const rest = src.slice(i);
    if ((m = /^\d+:\d{2}(?::\d{2}(?:\.\d+)?)?/.exec(rest))) {
      const p = m[0].split(':').map(Number);
      push('time', p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1], m[0].length); continue;
    }
    if ((m = /^(\d+\.?\d*|\.\d+)/.exec(rest))) { push('num', parseFloat(m[0]), m[0].length); continue; }
    // name.attribute: the dot splits a name from its attribute ("my Widget".visible works too).
    // A ~ inside a name is part of it: a suggested Device name has one for each < > : " / \ | ? * . , in its Label (Fritz, 2026-10-23)
    // and so is an @: the General Type in front of the Device Type ID, BM_22_DO@Pump_Pump_BH (OakBarn Brewery, 2026-11-11)
    if ((m = /^[A-Za-z_][A-Za-z0-9_~@°]*/.exec(rest))) { push('id', m[0], m[0].length); continue; }
    if (c === '.' && /[A-Za-z_]/.test(src[i + 1] ?? '')) { push('op', '.', 1); continue; }
    if ((m = /^(==|!=|<>|<=|>=|\+\+|--|\+=|-=|\*=|\/=|&&|\|\||[=<>+\-*/^()!,{};])/.exec(rest))) {
      push('op', m[0] === '<>' ? '!=' : m[0], m[0].length); continue;
    }
    throw new ScriptError(`Unexpected character "${c}"`, line);
  }
  // An Integrated Instance (Rule 6.1 exception, OakBarn Brewery, 2026-11-09): VesselName.DeviceName.setpoint is the attribute of the
  // Device named VesselName.DeviceName, so the first two words are one name
  for (let k = 0; k + 4 < toks.length; k++) {
    const [a, d1, b, d2, c] = toks.slice(k, k + 5);
    if (a.t === 'id' && d1.t === 'op' && d1.v === '.' && b.t === 'id' && d2.t === 'op' && d2.v === '.' && c.t === 'id' && b.p === d1.e && d1.p === a.e)
      toks.splice(k, 3, { t: 'id', v: `${a.v}.${b.v}`, p: a.p, e: b.e });
  }
  return toks;
}

// ---------------- expression parser ----------------
class Parser {
  constructor(toks, line) { this.t = toks; this.i = 0; this.line = line; }
  peek(o = 0) { return this.t[this.i + o]; }
  next() { return this.t[this.i++]; }
  isOp(v) { const k = this.peek(); return k && k.t === 'op' && k.v === v; }
  isWord(v) { const k = this.peek(); return k && k.t === 'id' && k.v.toLowerCase() === v; }
  err(msg) { throw new ScriptError(msg, this.line); }
  // the attribute after a name: name.attribute (new) or name attribute (BruControl)
  attr() {
    if (this.isOp('.') && this.peek(1)?.t === 'id') { this.next(); return this.next().v.toLowerCase(); }
    const k = this.peek();
    if (k?.t === 'id' && !LOGIC_WORDS.has(k.v.toLowerCase())) return this.next().v.toLowerCase();
    return null;
  }
  parse() { const e = this.or(); if (this.i < this.t.length) this.err(`Unexpected "${this.peek().v}"`); return e; }
  or() { let l = this.and(); while (this.isOp('||') || this.isWord('or')) { this.next(); l = { k: 'or', l, r: this.and() }; } return l; }
  and() { let l = this.not(); while (this.isOp('&&') || this.isWord('and')) { this.next(); l = { k: 'and', l, r: this.not() }; } return l; }
  not() { if (this.isOp('!') || this.isWord('not')) { this.next(); return { k: 'not', e: this.not() }; } return this.cmp(); }
  cmp() {
    let l = this.addsub();
    while (this.peek()?.t === 'op' && ['==', '!=', '<', '>', '<=', '>='].includes(this.peek().v)) {
      const op = this.next().v; l = { k: 'cmp', op, l, r: this.addsub() };
    }
    return l;
  }
  addsub() { let l = this.muldiv(); while (this.isOp('+') || this.isOp('-')) { const op = this.next().v; l = { k: op, l, r: this.muldiv() }; } return l; }
  muldiv() { let l = this.pow(); while (this.isOp('*') || this.isOp('/')) { const op = this.next().v; l = { k: op, l, r: this.pow() }; } return l; }
  pow() { const l = this.unary(); if (this.isOp('^')) { this.next(); return { k: '^', l, r: this.pow() }; } return l; }
  unary() { if (this.isOp('-')) { this.next(); return { k: 'neg', e: this.unary() }; } if (this.isOp('+')) { this.next(); return this.unary(); } return this.primary(); }
  primary() {
    const k = this.next();
    if (!k) this.err('Expression is incomplete');
    if (k.t === 'num') return { k: 'lit', v: k.v };
    if (k.t === 'time') return { k: 'lit', v: new TimeVal(k.v) };
    if (k.t === 'str') {
      const a = this.attr();
      if (a) return { k: 'prop', name: k.v, prop: a };
      return { k: 'strvar', v: k.v };
    }
    if (k.t === 'id') {
      const w = k.v.toLowerCase();
      if (w === 'now') return { k: 'now' };
      if (w === 'true' || w === 'false') return { k: 'lit', v: w === 'true' };
      const a = this.attr();
      if (a) return { k: 'idprop', name: k.v, prop: a };
      return { k: 'var', name: k.v };
    }
    if (k.t === 'op' && k.v === '(') { const e = this.or(); if (!this.isOp(')')) this.err('Missing )'); this.next(); return e; }
    this.err(`Unexpected "${k.v}"`);
  }
}

function parseExpr(toks, line) {
  if (!toks.length) throw new ScriptError('Missing expression', line);
  return new Parser(toks, line).parse();
}

// if (X > 3) Pump = true: the tokens after the ( condition ) when a whole line follows on the same line, or null.
// Only when the condition is in ( ) and the rest does not read as part of it (if (a + b) > 3 stays one condition).
function oneLineBody(rest) {
  if (!(rest[0]?.t === 'op' && rest[0].v === '(')) return null;
  let d = 0, k = 0;
  for (; k < rest.length; k++) { const t = rest[k]; if (t.t === 'op' && t.v === '(') d++; else if (t.t === 'op' && t.v === ')' && --d === 0) break; }
  const body = rest.slice(k + 1), b = body[0];
  if (!body.length || !(b.t === 'id' || b.t === 'str') || LOGIC_WORDS.has(String(b.v).toLowerCase())) return null;
  try { new Parser(rest).parse(); return null; } catch { return body; }
}

// ---------------- statement compiler ----------------
// opts.declared: variable names made with "new" elsewhere (to check one line on its own)
export function compile(text, opts = {}) {
  const src = maskBlockComments(text.replace(/^﻿/, '').split(/\r?\n/)).lines;    // /* block comments */ become spaces
  const stmts = [], errors = [], warnings = [];
  const labels = new Map();
  // C, C# and JavaScript spellings (Fritz, 2026-10-21): ; ends a line, X++ / X--, else if, and { } around the
  // lines of an if / else if / else. A } becomes endif, unless an else follows it.
  const braces = [];          // line of each { still open
  let closed = null;          // line of a } (or of a one-line if) that waits to see whether an else follows
  let header = false;         // the last line was an if / else if / else, so a { may follow on the next line
  let lineText = '';          // the line being read, for messages
  const closeChain = () => { if (closed !== null) { stmts.push({ line: closed, op: 'endif' }); closed = null; } };
  for (let n = 0; n < src.length; n++) {
    const line = n + 1, raw = src[n], s = raw.trim();
    try {
      if (!s || s.startsWith('//')) continue;
      const lab = /^\[(.*)\]$/.exec(s);
      if (lab) {
        closeChain(); header = false;
        const name = lab[1].trim();
        if (labels.has(name)) errors.push({ line, msg: `Label [${name}] is used twice (also line ${stmts[labels.get(name)].line})` });
        else labels.set(name, stmts.length);
        stmts.push({ line, op: 'label', name });
        continue;
      }
      // step "Mash in"  /  step 1.00003 "Mash in": a numbered section of the brew (scaffolding, lib/scaffold.js)
      const stp = STEP_RE.exec(s);
      if (stp) {
        const r = tokenize(stp[2] ?? '', line).filter(t => !(t.t === 'op' && t.v === ';'));
        if (r.length > 1 || (r.length && r[0].t !== 'str')) throw new ScriptError('step needs its name in quotes: step "Mash in"', line);
        closeChain(); header = false;
        stmts.push({ line, op: 'step', num: stp[1] ?? '', name: r[0]?.v ?? '' });
        continue;
      }
      let seg = [];
      lineText = s;
      const flush = () => { if (seg.length) statement(seg, line); seg = []; };
      for (const t of tokenize(s, line)) {
        if (t.t !== 'op' || !['{', '}', ';'].includes(t.v)) { seg.push(t); continue; }
        if (t.v === ';') { flush(); continue; }
        if (t.v === '{') {
          flush();
          if (!header) throw new ScriptError('{ needs an if, else if or else in front of it', line);
          braces.push(line); header = false;
          continue;
        }
        flush();                                         // }
        if (!braces.length) throw new ScriptError('} without {', line);
        closeChain(); braces.pop(); closed = line; header = false;
      }
      flush();
    } catch (e) {
      errors.push({ line: e.line ?? line, msg: e.message });
    }
  }
  closeChain();
  for (const l of braces) { errors.push({ line: l, msg: '{ has no }' }); stmts.push({ line: l, op: 'endif' }); }

  // one statement (the tokens between ; { and })
  function statement(toks, line) {
    const s = lineText.slice(toks[0].p, toks[toks.length - 1].e).trim();
    let first = toks[0], kw = first.t === 'id' ? first.v.toLowerCase() : null;
    let rest = toks.slice(1);
    // else if = elseif
    if (kw === 'else' && rest[0]?.t === 'id' && rest[0].v.toLowerCase() === 'if') { kw = 'elseif'; rest = rest.slice(1); }
    if (closed !== null && (kw === 'else' || kw === 'elseif')) closed = null;    // the chain goes on
    else closeChain();
    header = false;
    // X++ and X-- (also ++X and --X) are X += 1 and X -= 1. Anywhere else ++ is + + and -- is - - (5--3 is 8)
    const step = t => t?.t === 'op' && (t.v === '++' || t.v === '--');
    if (toks.length >= 2 && (step(toks[toks.length - 1]) || step(toks[0])) && !(kw && KEYWORDS.has(kw) && !step(toks[0]))) {
      const at = step(toks[0]) ? 0 : toks.length - 1, op = toks[at];
      toks = [...toks.filter((_, i) => i !== at), { t: 'op', v: op.v === '++' ? '+=' : '-=' }, { t: 'num', v: 1 }];
      first = toks[0]; kw = null; rest = toks.slice(1);
    }
    const split = list => list.flatMap(t => step(t) ? [{ ...t, v: t.v[0] }, { ...t, v: t.v[0] }] : [t]);
    toks = split(toks); rest = split(rest);
    const st = { line };
    // declare is the same word as new (Fritz, 2026-11-06, Rule 1.24)
    const dc = (kw === 'new' || kw === 'declare') && rest.length >= 2 ? declareCheck(rest[0].v, rest[1].v) : null;
    if (dc?.error) throw new ScriptError(dc.error, line);
    if (dc?.global) {
      // a gGlobal made in a Process (Rule 1.24): new gGlobalValue gV_X = 10, new gV gV_X = 10 and new value gV_X = 10 are the same.
      // It is a gGlobal, not a Process variable: made once (in the Schema), and the = 10 is only its first value (Rule 1.22).
      st.op = 'new'; st.type = dc.kind; st.name = rest[1].v; st.global = true;
      if (rest.length > 2) {
        if (!(rest[2].t === 'op' && rest[2].v === '=')) throw new ScriptError('Too many words after new', line);
        if (rest.length < 4) throw new ScriptError(`new ${rest[0].v} ${st.name} = needs a value after the =`, line);
        st.expr = parseExpr(rest.slice(3), line);
      }
      stmts.push(st);
      return;
    }
    if (dc) {
      st.op = 'new'; st.type = dc.kind; st.name = rest[1].v;
      // new value vV_Hop1F = 10: make it and set it on one line (Fritz, 2026-10-21), the same as two lines
      if (rest.length > 2) {
        if (!(rest[2].t === 'op' && rest[2].v === '=')) throw new ScriptError('Too many words after new', line);
        if (rest.length < 4) throw new ScriptError(`new ${st.type} ${st.name} = needs a value after the =`, line);
        stmts.push(st);
        statement(rest.slice(1), line);
        return;
      }
    } else if (kw === 'if' || kw === 'elseif') {
      // if (X > 3) Pump = true   on one line: the if, its one line, then endif (unless an else follows)
      const body = oneLineBody(rest);
      // if my_Process_Mash.running = true: in a condition a single = asks, the same as == (Fritz, 2026-10-21)
      const cond = (body ? rest.slice(0, rest.length - body.length) : rest).map(t => t.t === 'op' && t.v === '=' ? { ...t, v: '==' } : t);
      st.op = kw; st.expr = parseExpr(cond, line);
      stmts.push(st);
      if (body) { statement(body, line); closeChain(); closed = line; } else header = true;
      return;
    }
    else if (kw === 'else' && (!rest.length || !ASSIGN_OPS.has(rest[0].v))) {
      stmts.push({ line, op: 'else' });
      if (rest.length) { statement(rest, line); closeChain(); closed = line; } else header = true;
      return;
    }
    else if (kw === 'endif' && !rest.length) st.op = 'endif';
    else if (kw === 'goto') {
      if (rest.length !== 1) throw new ScriptError('goto needs one label name', line);
      st.op = 'goto'; st.label = String(rest[0].v).trim();
    } else if (kw === 'sleep' || kw === 'wait' || kw === 'print') { st.op = kw; st.expr = parseExpr(rest, line); }
    else if (kw === 'log' && rest.length && !ASSIGN_OPS.has(rest[0].v)) throw new ScriptError('log is now send_db (Fritz, 2026-10-30): send_db Name sends its reading to the database now', line);
    else if ((kw === 'start' || kw === 'stop' || kw === 'reset' || kw === 'send_db' || kw === 'send_db_group' || kw === 'start_db_group' || kw === 'stop_db_group' || kw === 'play') && rest.length && !ASSIGN_OPS.has(rest[0].v)) {
      st.op = kw; st.expr = parseExpr(rest, line);
    } else if (kw === 'restart' && !(rest.length && ASSIGN_OPS.has(rest[0].v))) {
      // restart = this Process; restart Looper_Temps = another one. Stopped, its memory cleared, started again from its file
      st.op = 'restart'; st.expr = rest.length ? parseExpr(rest, line) : null;
    } else if (kw === 'pause' && rest.length && !ASSIGN_OPS.has(rest[0].v)) {
      throw new ScriptError('pause is automatic: a sound pauses by itself while a higher alarm sounds. Use stop to stop it', line);
    } else if (kw === 'clear' && !rest.length) st.op = 'clear';
    // lock_Equipment / unlock_Equipment: lock or unlock the loaded Schema's Equipment Profile (lib/schemas.js)
    else if ((kw === 'lock_equipment' || kw === 'unlock_equipment') && !(rest.length && ASSIGN_OPS.has(rest[0].v))) {
      if (rest.length) throw new ScriptError(`${first.v} takes nothing after it`, line);
      st.op = 'lock'; st.what = 'equipment'; st.on = kw === 'lock_equipment';
    }
    // The Brew Process (lib/brewprocess.js): ask "text" waits for Done; the Close all / Open all valve lists; every pump off
    else if (kw === 'ask' && rest.length && !ASSIGN_OPS.has(rest[0].v)) { st.op = 'ask'; st.expr = parseExpr(rest, line); }
    else if (['close_all_valves', 'open_all_valves', 'all_pumps_off'].includes(kw) && !(rest.length && ASSIGN_OPS.has(rest[0].v))) {
      if (rest.length) throw new ScriptError(`${first.v} takes nothing after it`, line);
      st.op = 'valves'; st.what = kw;
    }
    // take_reading Name (OakBarn Brewery, 2026-11-09, Rule 6.25): a gravity read by hand with a Refractometer or a Glass hydrometer.
    // A pop-up asks which; the Process waits, like a wait, until the reading is saved. Name: a Hydrometer, a Value Widget or a gGlobal.
    else if (kw === 'take_reading' && !(rest.length && ASSIGN_OPS.has(rest[0].v))) {
      if (rest.length !== 1 || !['id', 'str'].includes(rest[0].t)) throw new ScriptError('take_reading needs one name after it: where the reading goes, for example take_reading Hydro_Red~Tilt_FE', line);
      st.op = 'reading'; st.name = rest[0].v;
    }
    // open_valve Name / close_valve Name (Fritz, 2026-11-07, Rule 5.39): any one valve. A Manual one (a Manual valve, a Manual Valve
    // Widget, the Spigot of a DigiBoil or Brewzilla, a Supply Manifold's Manual valve) asks a person and waits; a motorized one is switched.
    else if ((kw === 'open_valve' || kw === 'close_valve') && !(rest.length && ASSIGN_OPS.has(rest[0].v))) {
      if (rest.length !== 1 || !['id', 'str'].includes(rest[0].t)) throw new ScriptError(`${first.v} needs one valve name after it, for example ${kw} DigiBoil_Spigot`, line);
      st.op = 'onevalve'; st.name = rest[0].v; st.open = kw === 'open_valve';
    }
    // the Recipe (lib/recipe.js): import_recipe "Recipes/My IPA.bsmx" (a second text picks one recipe of a file with many),
    // start_hop_alerts (Skynet's own clock from now) or start_hop_alerts "Boil_Timer" (follows that timer), stop_hop_alerts
    else if ((kw === 'import_recipe' || kw === 'start_hop_alerts' || kw === 'stop_hop_alerts') && !(rest.length && ASSIGN_OPS.has(rest[0].v))) {
      st.op = 'recipe'; st.cmd = { import_recipe: 'import', start_hop_alerts: 'start', stop_hop_alerts: 'stop' }[kw];
      const parts = []; let cur = [];
      for (const tk of rest) { if (tk.t === 'op' && tk.v === ',') { parts.push(cur); cur = []; } else cur.push(tk); }
      if (cur.length) parts.push(cur);
      if (st.cmd === 'import' && !parts.length) throw new ScriptError('import_recipe needs the file, for example import_recipe "Recipes/My IPA.bsmx"', line);
      if (st.cmd === 'stop' && parts.length) throw new ScriptError('stop_hop_alerts takes nothing after it', line);
      if (parts.length > (st.cmd === 'import' ? 2 : 1)) throw new ScriptError(`${first.v}: too many things after it`, line);
      st.args = parts.map(x => parseExpr(x, line));
    }
    else if (kw === 'show') {
      st.op = 'show';
      const r = rest[0]?.t === 'id' && ['workspace', 'tab'].includes(rest[0].v.toLowerCase()) ? rest.slice(1) : rest;
      st.expr = parseExpr(r, line);
    } else {
      // assignment:  var = expr | "var" = expr | "element" prop = expr | element prop = expr
      const ai = toks.findIndex(t => t.t === 'op' && ASSIGN_OPS.has(t.v));
      // the short way to switch a heating method (Fritz, 2026-11-07: "MB_25_DO@H_Element_HLT_BR.HYS or MB_25_DO@H_Element_HLT_BR.DutyC", Rule 6.19):
      // name.HYS on its own line is name.method = "Hysteresis" (also .DO, .DutyC, .PID, .DeadB and the whole words)
      const mk = ai < 0 && toks.length === 3 && (toks[0].t === 'id' || toks[0].t === 'str') && toks[1].t === 'op' && toks[1].v === '.' && toks[2].t === 'id' ? heatMethodKey(toks[2].v) : null;
      if (mk) {
        st.op = 'assign'; st.aop = '='; st.expr = parseExpr([{ t: 'str', v: heatMethodWord(mk) }], line);
        st.target = { kind: 'prop', name: toks[0].v, prop: 'method', quoted: toks[0].t === 'str' };
        stmts.push(st); return;
      }
      if (ai < 1) throw new ScriptError(`Do not understand: ${s}`, line);
      const tgt = toks.slice(0, ai);
      // a flow color written plainly (Rule 5.21): tab.flow_Color = Mash is the same as = "Mash"
      let rhs = toks.slice(ai + 1);
      if (FLOW_PROPS.has(String(tgt[tgt.length - 1]?.v).toLowerCase()) && rhs.length === 1 && rhs[0].t === 'id' && flowKey(rhs[0].v) !== null) rhs = [{ ...rhs[0], t: 'str' }];
      // Hose_1.connect = QD_1 / = Mash_Tun / = none (Rule 5.34): the name after = is where the hose goes, not a value
      if (String(tgt[tgt.length - 1]?.v).toLowerCase() === 'connect' && rhs.length === 1 && rhs[0].t === 'id') rhs = [{ ...rhs[0], t: 'str' }];
      st.op = 'assign'; st.aop = toks[ai].v; st.expr = parseExpr(rhs, line);
      const named = tgt[0].t === 'str' || tgt[0].t === 'id';
      if (tgt.length === 1 && named) st.target = { kind: 'var', name: tgt[0].v, quoted: tgt[0].t === 'str' };
      else if (named && ((tgt.length === 2 && tgt[1].t === 'id') || (tgt.length === 3 && tgt[1].t === 'op' && tgt[1].v === '.' && tgt[2].t === 'id'))) {
        // name.attribute = ...  (or BruControl's  "name" attribute = ...)
        st.target = { kind: 'prop', name: tgt[0].v, prop: tgt[tgt.length - 1].v.toLowerCase(), quoted: tgt[0].t === 'str' };
      } else throw new ScriptError(`Cannot assign to: ${s.slice(0, s.indexOf(String(toks[ai].v))).trim()}`, line);
    }
    stmts.push(st);
  }

  // ---- match if / elseif / else / endif ----
  const stack = [];
  for (let i = 0; i < stmts.length; i++) {
    const st = stmts[i];
    if (st.op === 'if') stack.push({ chain: [i] });
    else if (st.op === 'elseif' || st.op === 'else') {
      const f = stack[stack.length - 1];
      if (!f) { errors.push({ line: st.line, msg: `${st.op} without if` }); continue; }
      if (stmts[f.chain[f.chain.length - 1]].op === 'else') errors.push({ line: st.line, msg: `${st.op} after else` });
      f.chain.push(i);
    } else if (st.op === 'endif') {
      const f = stack.pop();
      if (!f) { errors.push({ line: st.line, msg: 'endif without if' }); continue; }
      f.chain.push(i);
      for (let k = 0; k < f.chain.length - 1; k++) { stmts[f.chain[k]].next = f.chain[k + 1]; stmts[f.chain[k]].end = i; }
    }
  }
  for (const f of stack) errors.push({ line: stmts[f.chain[0]].line, msg: 'if has no endif' });

  // ---- labels / variables / references ----
  const declared = new Set([...(opts.declared ?? []), ...stmts.filter(s => s.op === 'new' && !s.global).map(s => s.name)]);
  // gGlobals this Process makes (Rule 1.24): they are named items like a Device, not Process variables
  const globals = stmts.filter(s => s.op === 'new' && s.global).map(s => ({ line: s.line, name: s.name, kind: s.type }));
  for (const g of globals) if (declared.has(g.name)) errors.push({ line: g.line, msg: `${g.name} is already a Process variable made with new: a name is either a variable or a gGlobal` });
  const refs = [];
  // Rule 1.30: a gGlobal takes only its own Kind of value. A value typed right on the line (a number, "text", true, 00:15:00)
  // is checked here, so the Process editor shows the error before the Process runs; anything else is checked when it runs.
  const litOf = e => !e ? undefined : e.k === 'lit' ? { v: e.v } : e.k === 'neg' && e.e?.k === 'lit' && typeof e.e.v === 'number' ? { v: -e.e.v }
    : e.k === 'strvar' && !declared.has(e.v) ? { v: e.v } : undefined;
  const lits = new Map();      // statement -> its typed value (kept off the statement, so lib/modernize.js compares lines as before)
  const madeKind = new Map(globals.map(g => [cleanName(g.name).toLowerCase(), g.kind]));
  for (const st of stmts) {
    const lit = litOf(st.expr);
    if (!lit) continue;
    if (st.op === 'new' && st.global) { const bad = kindValueError(cleanName(st.name), st.type, lit.v); if (bad) errors.push({ line: st.line, msg: bad }); }
    if (st.op === 'assign' && st.aop === '=' && st.target.kind !== 'sound' && !declared.has(st.target.name)) {
      const k = madeKind.get(cleanName(st.target.name).toLowerCase());
      const p = st.target.prop ?? 'value';
      const bad = !k ? '' : k === 'time' && TIME_PARTS[p] ? timePartError(cleanName(st.target.name), p, lit.v)
        : ['value', 'state'].includes(p) ? kindValueError(cleanName(st.target.name), k, lit.v) : '';
      if (bad) errors.push({ line: st.line, msg: bad });
      else if (!k) lits.set(st, lit);
    }
  }
  // Skynet Constants (skc_Kg_To_Lb ...) are fixed numbers: read only, and no variable can take an skc_ name
  const isConst = n => (n.toLowerCase() in CONST_WORDS) || (!declared.has(n) && isSkynetConstant(n));
  for (const st of stmts) {
    if (st.op === 'new' && isSkynetConstantName(st.name)) errors.push({ line: st.line, msg: `new ${st.type} ${st.name}: names starting skc_ are kept for Skynet Constants` });
    const t = st.op === 'assign' ? st.target : null;
    if (t && !t.quoted && isSkynetConstant(t.name)) errors.push({ line: st.line, msg: `${t.name} is a Skynet Constant: it can't be changed` });
  }
  const walk = (e, line) => {
    if (!e) return;
    if (e.k === 'idprop' && isSkynetConstant(e.name) && !declared.has(e.name)) { errors.push({ line, msg: `${e.name} is a Skynet Constant: it has no .${e.prop}` }); return; }
    // a name that is not a variable is a Device or Widget, and on its own it means its main value:
    // alm_Hops == true, Kettle_SetPoint = 185.5, Pump_Red = true  (lib/store.js mainProp)
    if (e.k === 'var' && !declared.has(e.name) && !isConst(e.name)) { e.k = 'idprop'; e.prop = 'value'; e.bare = true; }
    if (e.k === 'prop' || (e.k === 'idprop' && !declared.has(e.name))) refs.push({ line, name: e.name, bare: e.bare, prop: e.prop });
    for (const k of ['l', 'r', 'e']) walk(e[k], line);
  };
  for (const st of stmts) {
    // play SoundPlayer / stop alm_Hops: a plain name after these words is the element's name
    if (['start', 'stop', 'reset', 'play', 'restart', 'send_db', 'send_db_group', 'start_db_group', 'stop_db_group'].includes(st.op) && st.expr?.k === 'var' && !declared.has(st.expr.name) && !isConst(st.expr.name)) st.expr = { k: 'strvar', v: st.expr.name };
    if (st.op === 'goto' && !labels.has(st.label)) errors.push({ line: st.line, msg: `goto: no label [${st.label}]` });
    walk(st.expr, st.line);
    if (st.op === 'assign') {
      if (st.target.kind === 'var' && !declared.has(st.target.name)) st.target = { kind: 'prop', name: st.target.name, prop: 'value', quoted: st.target.quoted, bare: true };
      if (st.target.kind === 'prop' && !(st.target.quoted === false && declared.has(st.target.name)) && !(!st.target.quoted && isSkynetConstant(st.target.name))) refs.push({ line: st.line, name: st.target.name, bare: st.target.bare, prop: st.target.prop, write: true, ...(lits.has(st) ? { lit: lits.get(st) } : {}), ...(st.target.prop === 'connect' ? { aop: st.aop, ...(st.expr.k === 'strvar' && !declared.has(st.expr.v) ? { connectTo: st.expr.v } : {}) } : {}) });
    }
    if (['start', 'stop', 'reset', 'send_db'].includes(st.op) && st.expr.k === 'strvar' && !declared.has(st.expr.v)) refs.push({ line: st.line, name: st.expr.v, script: st.op !== 'send_db' });
    if (['send_db_group', 'start_db_group', 'stop_db_group'].includes(st.op) && st.expr.k === 'strvar' && !declared.has(st.expr.v)) refs.push({ line: st.line, name: st.expr.v, group: st.op });
    if (st.op === 'restart' && st.expr?.k === 'strvar' && !declared.has(st.expr.v)) refs.push({ line: st.line, name: st.expr.v, proc: true });
    if (st.op === 'play' && st.expr.k === 'strvar' && !declared.has(st.expr.v)) refs.push({ line: st.line, name: st.expr.v, sound: true, msg: `play: no alarm or sound player named "${st.expr.v}"` });
  }
  return { stmts, labels, errors, warnings, refs, globals };
}

// Override button: a held Process moves on this long after the press (Fritz, 2026-10-30: "just a delay in 100ms")
export const OVERRIDE_MS = 100;
const OVERRIDE_KEEP_MS = 1000;

// my_Process_Mash.running is read only (Fritz, 2026-10-21): start and stop change it
const readOnlyRecipe = name => `${name} is a Recipe value and read only: change it in the Recipe (☰ Menu > Recipe)`;
const readOnlyRunning = name => `${name}.running is read only: use start ${name} or stop ${name}`;

// ---------------- runtime ----------------
export class Engine extends EventEmitter {
  constructor(store, scriptsDir, logger) {
    super();
    this.store = store; this.dir = scriptsDir; this.logger = logger;
    this.recipe = () => recipeValues(this.store.config);      // the server adds the Mash and Boil Profiles (lib/brewprocess.js)
    this.valveAsks = new Map();      // Manual valves a Process is waiting on (name -> ask)
    this.flow = { tab: '', pipes: {}, ips: {} };   // flow colors set by a Process (Rule 5.21)
    this.running = new Map();    // name -> instance
    this.status = new Map();     // name -> last status {state, line, error, startedAt, endedAt}
    this.console = [];           // [{ts, script, text}]
    this.restarts = new Map();   // name -> times (ms) it was restarted by a Process or by "Restart if it fails"
    this.pending = new Map();    // name -> timer of a restart that is about to happen
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  // ---- hidden keys (Fritz, 2026-10-27, lib/keys.js): each Process has one, kept in scripts/.keys.json (name -> key) ----
  // It stays with the Process through a rename and a trip to the Recycle Bin, and is never shown or sent out.
  _keys() {
    if (!this.keyMap) { try { this.keyMap = JSON.parse(fs.readFileSync(path.join(this.dir, '.keys.json'), 'utf8')); } catch { this.keyMap = {}; } }
    return this.keyMap;
  }
  _saveKeys() { try { fs.writeFileSync(path.join(this.dir, '.keys.json'), JSON.stringify(this.keyMap ?? {}, null, 1)); } catch { /* read-only folder */ } }
  keyOf(name) {
    const k = this._keys(), n = cleanName(name);
    if (!k[n] && this.exists(n)) { k[n] = newKey(); this._saveKeys(); }
    return k[n];
  }
  giveKeys() {
    const k = this._keys(); let added = false;
    for (const n of this.names()) if (!k[n]) { k[n] = newKey(); added = true; }
    if (added) this._saveKeys();
  }

  // ---- files ----
  file(name) {
    name = cleanName(name);
    if (!name || BAD_NAME.test(name)) throw new Error(`Bad process name "${name}"`);
    return path.join(this.dir, name + '.txt');
  }
  exists(name) { try { return fs.existsSync(this.file(name)); } catch { return false; } }
  // a Process name that is not also a Device or Widget (a timer has its own .running)
  isProcess(name) { return !this.store.has(name) && this.exists(name); }
  names() { return fs.readdirSync(this.dir).filter(f => f.endsWith('.txt')).map(f => f.slice(0, -4)).sort((a, b) => a.localeCompare(b)); }
  read(name) { return fs.readFileSync(this.file(name), 'utf8'); }
  write(name, text) {
    fs.writeFileSync(this.file(name), text);
    this.keyOf(name);                // a new Process gets its hidden key
    const inst = this.running.get(cleanName(name));
    if (inst) { inst.modified = true; this._status(inst); }
    this.emit('scripts');
  }
  backup(name) { fs.copyFileSync(this.file(name), this.file(name) + '.bak'); }
  remove(name) {
    if (this.running.has(cleanName(name))) throw new Error('Stop the process before deleting it');
    this._cancelPending(cleanName(name));
    const cls = this.classOf(name), autorestart = this.autoRestart(name), key = this.keyOf(name);
    this._toBin(name, { cls, autorestart, key });
    delete this._keys()[cleanName(name)]; this._saveKeys();
    this.status.delete(cleanName(name));
    if (autorestart) this.setAutoRestart(name, false);
    const pc = this.store.config.processClasses;
    if (pc && cleanName(name) in pc) { delete pc[cleanName(name)]; this.store.writeConfig(); }
    this._dropOrder(name);
    this.renumber();
    this.emit('scripts');
  }
  // ---- Recycle Bin (Fritz, 2026-10-19): a deleted Process is moved to scripts/Recycle_Bin, never erased.
  // Each one is <id>.txt (the Process) and <id>.json ({ name, deletedAt, cls, autorestart }). Restoring asks the person first (in the browser).
  binDir() { return path.join(this.dir, 'Recycle_Bin'); }
  _binFile(id, ext) {
    if (!/^[\w.-]+$/.test(String(id)) || String(id).startsWith('.')) throw new Error('Bad Recycle Bin item');
    return path.join(this.binDir(), id + ext);
  }
  _toBin(name, meta) {
    fs.mkdirSync(this.binDir(), { recursive: true });
    const stamp = fileStamp();
    let id = `${cleanName(name)}.${stamp}`;
    for (let i = 2; fs.existsSync(this._binFile(id, '.txt')); i++) id = `${cleanName(name)}.${stamp}-${i}`;
    fs.renameSync(this.file(name), this._binFile(id, '.txt'));
    fs.writeFileSync(this._binFile(id, '.json'), JSON.stringify({ name: cleanName(name), deletedAt: Date.now(), ...meta }, null, 2));
    return id;
  }
  binList() {
    if (!fs.existsSync(this.binDir())) return [];
    return fs.readdirSync(this.binDir()).filter(f => f.endsWith('.txt')).map(f => {
      const id = f.slice(0, -4), st = fs.statSync(this._binFile(id, '.txt'));
      let meta = {};
      try { meta = JSON.parse(fs.readFileSync(this._binFile(id, '.json'), 'utf8')); } catch { /* only the text file: guess from the file name */ }
      return { id, name: meta.name ?? id.replace(new RegExp('\\.' + STAMP_TAIL.source), ''), deletedAt: meta.deletedAt ?? st.mtimeMs, size: st.size, lines: fs.readFileSync(this._binFile(id, '.txt'), 'utf8').split('\n').length };
    }).sort((a, b) => b.deletedAt - a.deletedAt);
  }
  binRead(id) {
    const f = this._binFile(id, '.txt');
    if (!fs.existsSync(f)) throw new Error('That Process is not in the Recycle Bin');
    return fs.readFileSync(f, 'utf8');
  }
  // put it back as `as` (its old name when left out); never over a Process that exists now
  binRestore(id, as) {
    const item = this.binList().find(x => x.id === id);
    if (!item) throw new Error('That Process is not in the Recycle Bin');
    const name = cleanName(as || item.name);
    if (name !== item.name) checkFileName(name, { ext: false, what: 'Process' });   // a new name follows the file name rules (public/names.js)
    if (this.exists(name)) { const e = new Error(`A Process named "${name}" exists. Pick another name to restore it as.`); e.code = 409; throw e; }
    let meta = {};
    try { meta = JSON.parse(fs.readFileSync(this._binFile(id, '.json'), 'utf8')); } catch { }
    fs.renameSync(this._binFile(id, '.txt'), this.file(name));
    fs.rmSync(this._binFile(id, '.json'), { force: true });
    if (meta.cls && CLASSES[meta.cls] && meta.cls !== this.classOf(name)) this.setClass(name, meta.cls);
    if (meta.autorestart) this.setAutoRestart(name, true);
    this._keys()[name] = meta.key || newKey(); this._saveKeys();
    this.renumber();
    this.emit('scripts');
    return { name };
  }
  // erase it for good (the browser asks first)
  binPurge(id) {
    const f = this._binFile(id, '.txt');
    if (!fs.existsSync(f)) throw new Error('That Process is not in the Recycle Bin');
    fs.rmSync(f); fs.rmSync(this._binFile(id, '.json'), { force: true });
  }
  rename(oldName, newName) {
    if (this.running.has(cleanName(oldName))) throw new Error('Stop the process before renaming it');
    checkFileName(String(newName ?? ''), { ext: false, what: 'Process' });
    if (this.exists(newName)) throw new Error(`A process named "${cleanName(newName)}" already exists`);
    this._cancelPending(cleanName(oldName));
    const key = this.keyOf(oldName);
    fs.renameSync(this.file(oldName), this.file(newName)); this.status.delete(cleanName(oldName));
    const keys = this._keys(); delete keys[cleanName(oldName)]; keys[cleanName(newName)] = key; this._saveKeys();
    if (this.autoRestart(oldName)) { this.setAutoRestart(oldName, false); this.setAutoRestart(newName, true); }
    const pc = this.store.config.processClasses;
    if (pc && cleanName(oldName) in pc) { pc[cleanName(newName)] = pc[cleanName(oldName)]; delete pc[cleanName(oldName)]; this.store.writeConfig(); }
    const pv = this.store.config.processVersions;
    if (pv && cleanName(oldName) in pv) { pv[cleanName(newName)] = pv[cleanName(oldName)]; delete pv[cleanName(oldName)]; this.store.writeConfig(); }
    const po = this.store.config.processOrder;
    if (po && cleanName(oldName) in po) { po[cleanName(newName)] = po[cleanName(oldName)]; delete po[cleanName(oldName)]; this.store.writeConfig(); }
    this.renumber();
    this.emit('scripts');
  }

  // ---- Process classes and step numbers (lib/scaffold.js) ----
  classOf(name) { return classOf(this.store.config, cleanName(name)); }
  setClass(name, cls) {
    name = cleanName(name);
    if (!this.exists(name)) throw new Error(`Process not found: "${name}"`);
    if (!CLASSES[cls]) throw new Error(`Unknown Process class "${cls}"`);
    this.store.config.processClasses ??= {};
    if (this.classOf(name) !== cls) this._dropOrder(name, false);   // it goes to the end of its new group
    this.store.config.processClasses[name] = cls;
    this.store.writeConfig();
    this.renumber();
    this.emit('scripts');
  }
  // Renumber every step in every Process. A running Process keeps the numbers it started with.
  renumber() {
    const texts = new Map(this.names().map(n => [n, this.read(n)]));
    const changed = renumberSteps(texts, n => this.classOf(n));
    for (const [n, t] of changed) fs.writeFileSync(this.file(n), t);
    if (changed.size) this.emit('scripts');
    return [...changed.keys()];
  }
  // Step widgets (gGlobal kind "step") show the step a Process of their class just reached
  _showStep(proc, num, name) {
    const cls = this.classOf(proc);
    for (const el of this.store.list('gGlobal')) {
      if (el.kind !== 'step' || ((el.stepClass ?? 'flow') !== cls && el.stepClass !== 'any')) continue;
      try { this.store.setProp(el.name, 'value', [num, name].filter(Boolean).join('  '), 'step'); } catch { /* not settable */ }
    }
  }

  // Syntax check plus checks against the current elements and scripts
  check(text) {
    const c = compile(text);
    const out = { errors: [...c.errors], warnings: [...c.warnings] };
    // gGlobals this Process makes (Rule 1.24): their name can't be another item's, or a gGlobal of another Kind
    const made = new Set();
    for (const g of c.globals) { const clash = this._globalClash(g.name, g.kind); if (clash) out.errors.push({ line: g.line, msg: clash }); made.add(cleanName(g.name)); }
    for (const r of c.refs) {
      if (made.has(cleanName(r.name)) && !this.store.has(r.name) && !r.group && !r.sound && !r.proc && !r.script) continue;   // made when its new line runs
      if (r.group) {
        if (!groupByName(this.store.config, r.name)) out.errors.push({ line: r.line, msg: `${r.group}: no Group named "${r.name}" (a Group is made in an item's Database and .API box)` });
      } else if (r.sound) {
        if (!SOUND_TYPES.includes(this.store.get(r.name)?.type)) out.errors.push({ line: r.line, msg: r.msg });
      } else if (r.proc) {
        if (!this.exists(r.name)) out.errors.push({ line: r.line, msg: `restart: no process named "${r.name}"` });
      } else if (r.script) {
        if (!this.exists(r.name) && !this.store.has(r.name)) out.errors.push({ line: r.line, msg: `No process or timer/alarm named "${r.name}"` });
      } else if (r.prop === 'connect' && !this.store.has(r.name)) {
        // Hose_1.connect = QD_1 (Rule 5.34): a Quick Disconnect hose, and a Quick Disconnect, IP or Vessel on its Tab
        const h = findQdHose(this.store.config, r.name);
        if (!h) out.errors.push({ line: r.line, msg: `No hose named "${r.name}" (.connect is for a Quick Disconnect hose, such as Hose_1)` });
        else if (!isQdHose(h)) out.errors.push({ line: r.line, msg: `${r.name} is not a Quick Disconnect hose: only those have .connect (Rule 5.34)` });
        else if (!r.write) out.errors.push({ line: r.line, msg: `${r.name}.connect is only set, for example ${r.name}.connect = QD_1` });
        else if (r.aop !== '=') out.errors.push({ line: r.line, msg: `${r.name}.connect is set with =, for example ${r.name}.connect = QD_1` });
        else if (r.connectTo !== undefined) { const t = connectTarget(this.store.config, h, r.connectTo); if (t.error) out.errors.push({ line: r.line, msg: t.error }); }
      } else if (this.store.has(r.name) && this.store.builtInVessel(r.name) && !cleanName(r.name).includes('.')) {
        const v = this.store.builtInVessel(r.name);      // Rule 5.31: a built in Device is VesselName.DeviceName in a Process
        out.errors.push({ line: r.line, msg: `${r.name} is built into ${v}: a Process calls it ${v}.${r.name} (Rule 5.31)` });
      } else if (this.store.instanceRef(r.name, r.prop)) {
        // VesselName.DeviceName: an Integrated Instance alone (Rule 6.1 exception)
      } else if (r.lit && this._gKindError(this.store.get(r.name), r.prop, r.lit.v)) {
        out.errors.push({ line: r.line, msg: this._gKindError(this.store.get(r.name), r.prop, r.lit.v) });      // Rule 1.30
      } else if (this._flowTarget(r.name, r.prop)) {
        // tab.flow_Color, Pipe_1.flow_Color: fine
      } else if (String(r.name).toLowerCase() === 'tab' && !this.store.has(r.name)) {
        out.errors.push({ line: r.line, msg: `tab has only .flow_Color (the Flow Color of the Tab on the screen, Rule 5.21)` });
      } else if (r.prop === 'running' && this.isProcess(r.name)) {
        if (r.write) out.errors.push({ line: r.line, msg: readOnlyRunning(r.name) });
      } else if (isRecipeName(r.name) && !this.store.has(r.name)) {
        if (r.write) out.errors.push({ line: r.line, msg: readOnlyRecipe(r.name) });
        else if (!isKnownRecipeName(r.name)) out.errors.push({ line: r.line, msg: `${r.name} is not a Recipe value (they are: ${recipeNames().join(', ')} ...)` });
      } else if (!this.store.has(r.name)) out.errors.push({ line: r.line, msg: r.bare && isSkynetConstantName(r.name) ? `Unknown name ${r.name}: there is no Skynet Constant by that name (Help: Skynet Constants lists them)` : r.bare ? `Unknown name ${r.name}: no variable made with new, and no Device or Widget by that name` : `No element named "${r.name}"` });
    }
    out.errors.sort((a, b) => a.line - b.line);
    out.offBrain = this.offBrainPaths(text);
    return out;
  }

  // File paths in a process that are not on the Brain (this Pi): a Windows path like "C:\BruControl\Media\x.wav", a network
  // share, or a path that is not inside a media folder here. Phones and other computers cannot reach those files.
  offBrainPaths(text) {
    const out = [], seen = new Set();
    String(text ?? '').split(/\r?\n/).forEach((ln, i) => {
      const code = ln.replace(/^\s*\/\/.*$/, '');
      for (const m of code.matchAll(/"([^"]*)"/g)) {
        const p = m[1].trim();
        const drive = /^[a-z]:[\\/]/i.test(p), share = /^\\\\/.test(p) || /^file:/i.test(p);
        const looksLikeFile = drive || share || (/[\\/]/.test(p) && /\.[a-z0-9]{2,5}$/i.test(p) && !/^https?:/i.test(p));
        if (!looksLikeFile || seen.has(p)) continue;
        let why = '';
        // a drive letter is only on the Brain when the panel itself runs on Windows (then it must be inside a media folder)
        if (share || (drive && process.platform !== 'win32')) why = 'is on another computer, not on the Brain';
        else if (!this.store.resolveMedia(p)) why = 'is outside the media folders on the Brain';
        else { const f = this.store.findMedia(p); if (!f || !fs.existsSync(f)) why = 'was not found in the media folders on the Brain'; }
        if (why) { seen.add(p); out.push({ line: i + 1, path: p, why }); }
      }
    });
    return out;
  }

  list() {
    const order = new Map();
    for (const c of Object.keys(CLASSES)) this.ordered(c).forEach((n, i) => order.set(n, i + 1));
    return this.names().map(n => {
      const st = this.status.get(n) ?? { state: 'stopped' };
      return { name: n, ...st, cls: this.classOf(n), order: order.get(n), autostart: (this.store.config.autostart ?? []).includes(n), autorestart: this.autoRestart(n), version: this.versionOf(n) };
    });
  }

  // ---- Process Version (Fritz, 2026-10-30): Update Version in the Process editor gives it a new YYMMDD_HH_MM_n (public/vername.js)
  versionOf(name) { return this.store.config.processVersions?.[cleanName(name)] ?? ''; }
  newVersion(name) {
    name = cleanName(name);
    if (!this.exists(name)) throw new Error(`Process not found: "${name}"`);
    const v = versionName(this.versionOf(name));
    (this.store.config.processVersions ??= {})[name] = v;
    this.store.writeConfig();
    this.emit('scripts');
    return v;
  }

  // ---- Order in the Processes list (Fritz, 2026-10-21). Each class group (Flow, Sub, Repeat, Looper) counts 1, 2, 3 ...
  // config.processOrder { name: n }. Numbered Processes come first, the rest after them by name (a new one lands at the end).
  ordered(cls) {
    const o = this.store.config.processOrder ?? {};
    const at = n => Number.isFinite(+o[n]) && o[n] !== null ? +o[n] : 1e9;
    return this.names().filter(n => this.classOf(n) === cls)
      .sort((a, b) => at(a) - at(b) || a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }
  // move one Process to place n in its group; the others in the group are numbered again 1, 2, 3 ... around it
  setOrder(name, n) {
    name = cleanName(name);
    if (!this.exists(name)) throw new Error(`Process not found: "${name}"`);
    const list = this.ordered(this.classOf(name)).filter(x => x !== name);
    list.splice(Math.min(Math.max(Math.round(+n) || 1, 1), list.length + 1) - 1, 0, name);
    const o = this.store.config.processOrder ??= {};
    list.forEach((x, i) => { o[x] = i + 1; });
    this.store.writeConfig();
    this.emit('scripts');
    return list;
  }
  _dropOrder(name, write = true) {
    const po = this.store.config.processOrder;
    if (po && cleanName(name) in po) { delete po[cleanName(name)]; if (write) this.store.writeConfig(); }
  }

  // new gV gV_X (Rule 1.24): '' when the name is free or already this Kind of gGlobal, else the reason it can't be made
  _globalClash(name, kind) {
    const el = this.store.get(name);
    if (!el) return '';
    if (el.type === 'gGlobal' && (el.kind ?? 'value') === kind) return '';
    if (el.type === 'gGlobal') return `${el.name} is already a ${VAR_KINDS[el.kind ?? 'value'] ?? 'gGlobal'}. A gGlobal's Kind can't be changed (Rule 1.19): use the word for its Kind, or delete it on the Variables screen and make it again`;
    return `${el.name} is already the name of a Device or Widget: give the gGlobal another name`;
  }

  print(script, text) {
    const entry = { ts: Date.now(), script, text: toStr(text) };
    this.console.push(entry); if (this.console.length > 1000) this.console.splice(0, 200);     // the Output keeps the last 800-1000 lines (less memory)
    this.emit('print', entry);
  }

  _status(inst, extra = {}) {
    const st = { state: inst.state, line: inst.line, step: inst.step ?? null, error: inst.error ?? null, startedAt: inst.startedAt, endedAt: inst.endedAt ?? null, modified: !!inst.modified, startedBy: inst.by, ...extra };
    this.status.set(inst.name, st);
    this.emit('scripts');
  }

  start(name, by = 'user') {
    name = cleanName(name);
    if (this.running.has(name)) { this.print(by, `start "${name}": already running (use restart to start it over)`); return { ok: false, msg: 'already running' }; }
    this._cancelPending(name);
    if (by === 'user') this.restarts.delete(name);       // a person starting it by hand begins a new count
    if (!this.exists(name)) throw new Error(`Process not found: "${name}"`);
    const text = this.read(name);                       // always the saved file -> never a stale copy
    const prog = compile(text);
    const chk = this.check(text);
    if (chk.errors.length) {
      const e = chk.errors[0];
      this.status.set(name, { state: 'error', line: e.line, error: `Not started: line ${e.line}: ${e.msg}` + (chk.errors.length > 1 ? ` (+${chk.errors.length - 1} more)` : ''), startedAt: Date.now() });
      this.emit('scripts');
      this.print(name, `NOT STARTED - line ${e.line}: ${e.msg}`);
      return { ok: false, msg: e.msg, line: e.line };
    }
    const inst = { name, prog, vars: new Map(), state: 'running', line: 0, startedAt: Date.now(), by, stopFlag: false };
    inst.done = new Promise(r => { inst.finished = r; });
    this.running.set(name, inst);
    this._status(inst);
    this.emit('started', name);           // .database "When a Process starts"
    this._run(inst);
    return { ok: true };
  }

  // ---- Code Value Widget (OakBarn Brewery, 2026-11-08, Rule 1.27, public/codevalue.js) ----
  // Each time a person sets its Value (a tap and Set on its Tab, or the .API), its Code runs once, like a short Process, with
  // {value} standing for the Value. It is not a Process file, so it is not on the Processes list; it prints and stops on an
  // error in the Console as "<Name> (code)". A new Value while the code still runs (a sleep or wait in it) stops the old run.
  runWidgetCode(name, by = 'user') {
    const el = this.store.get(name);
    if (!hasCode(el)) return { ok: false, msg: 'no Code' };
    const key = `${el.name} (code)`, text = widgetCodeText(el);
    const chk = this.check(text);
    if (chk.errors.length) { const e = chk.errors[0]; this.print(key, `NOT RUN - line ${e.line}: ${e.msg}`); return { ok: false, msg: e.msg, line: e.line }; }
    const old = this.running.get(key);
    if (old) old.stopFlag = true;
    const inst = { name: key, prog: compile(text), vars: new Map(), state: 'running', line: 0, startedAt: Date.now(), by, stopFlag: false, widget: el.name };
    inst.done = new Promise(r => { inst.finished = r; });
    this.running.set(key, inst);
    this._run(inst);
    return { ok: true, done: inst.done };
  }

  stop(name) {
    name = cleanName(name);
    const waiting = this._cancelPending(name);
    const inst = this.running.get(name);
    if (inst) inst.stopFlag = true;
    return !!inst || waiting;
  }

  stopAll() { for (const n of [...this.running.keys(), ...this.pending.keys()]) this.stop(n); }

  // ---- restart (Fritz, 2026-10-05) ----
  // A restart stops the Process, throws away its memory (its variables and the line it was on) and starts it again
  // from its saved file. BruControl threads could go bad and needed this; here it also cures a Process that stopped
  // on an error. Endless loops are guarded: restarts made by a Process (the restart command) or by "Restart if it
  // fails" are counted, and after config.restartLimit of them (5 unless changed) in one minute the Process is left
  // stopped, a message goes to every screen and the alarm picked in Settings sounds. Restart pressed by a person is not counted.
  restartLimit() { const n = Math.floor(Number(this.store.config.restartLimit)); return n >= 1 ? n : 5; }
  autoRestart(name) { return (this.store.config.autorestart ?? []).includes(cleanName(name)); }
  setAutoRestart(name, on) {
    name = cleanName(name);
    if (on && !this.exists(name)) throw new Error(`Process not found: "${name}"`);
    const list = (this.store.config.autorestart ?? []).filter(n => n !== name);
    if (on) list.push(name);
    this.store.config.autorestart = list;
    this.store.writeConfig();
    this.emit('scripts');
  }

  async restart(name, by = 'user') {
    name = cleanName(name);
    if (!this.exists(name)) throw new Error(`Process not found: "${name}"`);
    this._cancelPending(name);
    const why = by === 'user' ? '' : `restart command in ${by}`;
    const allowed = by === 'user' || this._count(name);
    await this._stopAndWait(name);
    if (!allowed) { this._giveUp(name, why); return { ok: false, msg: 'restarted too many times' }; }
    if (by !== 'user') this.print(by, `restart "${name}"`);
    return this.start(name, by);
  }

  _cancelPending(name) {
    const t = this.pending.get(name);
    if (!t) return false;
    clearTimeout(t); this.pending.delete(name);
    return true;
  }
  // true when one more restart fits inside the limit (and counts it)
  _count(name) {
    const now = Date.now(), list = (this.restarts.get(name) ?? []).filter(t => now - t < 60_000);
    const ok = list.length < this.restartLimit();
    if (ok) list.push(now);
    this.restarts.set(name, list);
    return ok;
  }
  async _stopAndWait(name, ms = 10_000) {
    const inst = this.running.get(name);
    if (!inst) return;
    inst.stopFlag = true;
    let t;
    await Promise.race([inst.done, new Promise(r => { t = setTimeout(r, ms); })]);
    clearTimeout(t);
    if (this.running.get(name) === inst) throw new Error(`"${name}" did not stop within ${ms / 1000} seconds`);
  }
  _scheduleRestart(name, why, delay) {
    if (!this._count(name)) return this._giveUp(name, why);
    this.print(name, delay ? `Restarting in ${delay / 1000} seconds (${why})` : `Restarting (${why})`);
    this.pending.set(name, setTimeout(() => {
      this.pending.delete(name);
      if (this.running.has(name)) return;
      try { this.start(name, 'restart'); } catch (e) { this.print(name, 'NOT RESTARTED - ' + e.message); }
    }, delay));
  }
  _giveUp(name, why) {
    const n = this.restartLimit();
    const text = `Not restarted again: it was restarted ${n} time${n === 1 ? '' : 's'} in one minute${why ? ` (${why})` : ''}. Fix the problem, then start it by hand.`;
    const old = this.status.get(name) ?? {};
    this.status.set(name, { ...old, state: 'error', error: (old.state === 'error' && old.error ? old.error + ' - ' : '') + text, endedAt: Date.now(), gaveUp: true });
    this.print(name, 'STOPPED - ' + text);
    this.emit('alert', { process: name, text: `Process ${name}: ${text}` });
    const alarm = this.store.config.restartAlarm;
    if (alarm && this._isSound(alarm)) { try { this.store.setProp(alarm, 'active', true, 'script'); } catch { /* alarm removed */ } }
    this.emit('scripts');
  }

  // Simulation: clock times (ms) when running processes will move on by themselves:
  // the end of a sleep, or a wait on a timer reaching a time ("tm_Mash" value >= 00:10:00, "tm_Boil" value <= 00:00:00)
  upcoming(now) {
    const out = [];
    for (const inst of this.running.values()) {
      if (inst.until) out.push({ at: inst.until, what: `${inst.name}: sleep ends (line ${inst.line})` });
      const ms = inst.waitExpr && this._timerWaitMs(inst.waitExpr);
      if (ms > 0) out.push({ at: now + ms, what: `${inst.name}: wait on line ${inst.line}` });
      if (inst.reachAt) out.push({ at: inst.reachAt, what: `${inst.name}: reading on line ${inst.line} pretended reached` });
    }
    return out;
  }
  // Simulation mode (Fritz, 2026-10-27): a wait on a reading (a temperature reaching strike temperature, a boil start, a
  // level, a weight, a flow total) is pretended reached after Settings > Simulation "reached after" clock seconds, so a
  // pretend brew day never hangs on a heater it can't really heat. Waits on timers keep their own time; waits on a
  // button, a switch or anything else are never pretended.
  _readingWaitMs(e) {
    const c = this.store.config.simulation || {};
    if (!clock.active || c.reachWaits === false || this._timerWaitMs(e)) return 0;
    const READINGS = ['temperature', 'analogIn', 'scale', 'flowMeter'];
    const reads = x => !x || typeof x !== 'object' ? false
      : (x.k === 'prop' || x.k === 'idprop' || x.k === 'var') && READINGS.includes(this.store.get(x.name)?.type) ? true
        : ['l', 'r', 'e'].some(k => reads(x[k]));
    return reads(e) ? Math.max(1, Math.min(7200, Number(c.reachAfter) || 60)) * 1000 : 0;
  }
  _timerWaitMs(e) {
    if (e.k === 'and') return Math.max(this._timerWaitMs(e.l) || 0, this._timerWaitMs(e.r) || 0) || null;
    if (e.k === 'or') { const a = [this._timerWaitMs(e.l), this._timerWaitMs(e.r)].filter(x => x > 0); return a.length ? Math.min(...a) : null; }
    if (e.k !== 'cmp') return null;
    let { l, r, op } = e;
    const isTimer = x => (x.k === 'prop' || x.k === 'idprop') && x.prop === 'value' && this.store.get(x.name)?.type === 'timer';
    if (!isTimer(l) && isTimer(r)) { [l, r] = [r, l]; op = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' }[op] ?? op; }
    if (!isTimer(l) || r.k !== 'lit' || !(r.v instanceof TimeVal)) return null;
    let rt; try { rt = this.store.rt?.get(l.name); } catch { return null; }
    if (!rt?.running) return null;
    const cur = rt.value?.s ?? 0, target = r.v.s;
    const down = rt.type === 'countdown';
    if (down && ['<=', '<', '=='].includes(op) && cur > target) return (cur - target) * 1000;
    if (!down && ['>=', '>', '=='].includes(op) && cur < target) return (target - cur) * 1000;
    return null;
  }

  async _run(inst) {
    const { stmts } = inst.prog;
    let pc = 0, steps = 0;
    try {
      while (pc < stmts.length && !inst.stopFlag) {
        const st = stmts[pc];
        inst.line = st.line;
        pc = await this._exec(inst, st, pc);
        if (++steps % 300 === 0) { await new Promise(r => setImmediate(r)); if (steps % 3000 === 0) this._status(inst); }
      }
      inst.state = 'stopped';
    } catch (e) {
      inst.state = 'error';
      inst.error = `line ${e.line ?? inst.line}: ${e.message}`;
      this.print(inst.name, 'ERROR ' + inst.error);
    }
    inst.endedAt = Date.now();
    if (this.running.get(inst.name) === inst) this.running.delete(inst.name);      // a Code Value Widget's newer run may have taken its place
    this._status(inst);
    inst.finished();
    if (inst.restartSelf) this._scheduleRestart(inst.name, 'restart command', 0);
    else if (inst.state === 'error' && !inst.stopFlag && this.autoRestart(inst.name)) this._scheduleRestart(inst.name, 'Restart if it fails', 2000);
  }

  // ---- expression evaluation ----
  _var(inst, name, line) {
    const v = inst.vars.get(name);
    if (!v) throw new ScriptError(`Variable ${name} used before "new"`, line);
    return v;
  }

  ev(inst, e, line) {
    switch (e.k) {
      case 'lit': return e.v;
      case 'now': return new DateVal(clock.now());
      case 'strvar': return inst.vars.has(e.v) ? inst.vars.get(e.v).val : e.v;
      case 'var': {
        if (inst.vars.has(e.name)) return inst.vars.get(e.name).val;
        const c = CONST_WORDS[e.name.toLowerCase()];
        if (c !== undefined) return c;
        const k = skynetConstant(e.name);                                         // skc_Kg_To_Lb
        if (k !== undefined) return k;
        if (this._isSound(e.name)) return this._get(e.name, 'active', line);       // alm_Hops == true
        throw new ScriptError(`Unknown variable ${e.name}`, line);
      }
      case 'prop':
        if (e.prop === 'running' && this.isProcess(e.name)) return this.running.has(cleanName(e.name));
        if (isRecipeName(e.name) && !this.store.has(e.name)) return this._recipe(e.name, e.prop, line);
        return this._get(e.name, e.prop, line);
      case 'idprop':
        if (inst.vars.has(e.name)) { if (e.prop === 'precision') return inst.vars.get(e.name).precision ?? -1; throw new ScriptError(`Variable ${e.name} has no property ${e.prop}`, line); }
        if (e.prop === 'running' && this.isProcess(e.name)) return this.running.has(cleanName(e.name));   // my_Process_Mash.running
        if (isRecipeName(e.name) && !this.store.has(e.name)) return this._recipe(e.name, e.prop, line);     // rcp_Strike_Temp
        { const f = this._flowTarget(e.name, e.prop); if (f) return flowName(f.tab ? this.flow.tab : f.ip ? this.flow.ips[f.ip] : this.flow.pipes[f.pipe]); }
        return this._get(e.name, e.bare && isMethodDevice(this.store.get(e.name)) ? 'state' : e.prop, line);     // a Heating Element alone is On or Off
      case 'neg': { const v = this._notNull(this.ev(inst, e.e, line), e.e, line); return v instanceof TimeVal ? new TimeVal(-v.s) : -toNum(v); }
      case 'not': return !toBool(this.ev(inst, e.e, line));
      case 'and': return toBool(this.ev(inst, e.l, line)) && toBool(this.ev(inst, e.r, line));
      case 'or': return toBool(this.ev(inst, e.l, line)) || toBool(this.ev(inst, e.r, line));
      case '+': return add(...this._pair(inst, e, line));
      case '-': return sub(...this._pair(inst, e, line));
      case '*': return mul(...this._pair(inst, e, line));
      case '/': { const [a, b] = this._pair(inst, e, line); try { return div(a, b); } catch (x) { throw new ScriptError(x.message, line); } }
      case '^': { const [a, b] = this._pair(inst, e, line); return Math.pow(toNum(a), toNum(b)); }
      case 'cmp': {
        const a = this.ev(inst, e.l, line), b = this.ev(inst, e.r, line);
        // NULL (Rule 1.32): == and != ask if a value is empty; < > <= >= need a value on both sides
        if (a === null || b === null) {
          if (e.op === '==') return a === b;
          if (e.op === '!=') return a !== b;
          this._notNull(a, e.l, line); this._notNull(b, e.r, line);
        }
        const c = compare(a, b);
        return { '==': c === 0, '!=': c !== 0, '<': c < 0, '>': c > 0, '<=': c <= 0, '>=': c >= 0 }[e.op];
      }
    }
    throw new ScriptError('Bad expression', line);
  }

  // both sides of + - * / ^, stopping the Process when one is NULL (Rule 1.32): NULL + 5 has no answer
  _pair(inst, e, line) { return [this._notNull(this.ev(inst, e.l, line), e.l, line), this._notNull(this.ev(inst, e.r, line), e.r, line)]; }
  _notNull(v, e, line) {
    if (v !== null) return v;
    const n = e?.name ? cleanName(e.name) : '', what = !n ? 'A value' : n.toLowerCase() === 'null' ? 'NULL' : e.prop && !e.bare ? `${n}.${e.prop}` : n;
    throw new ScriptError(`${what} ${NULL_MATH}`, line);
  }

  // rcp_ Recipe values (lib/brewprocess.js): read only, from the loaded Recipe (or the ☰ Menu > Default tab while none is)
  _recipe(name, prop, line) {
    if (prop !== 'value') throw new ScriptError(`${name} is a Recipe value: it has no .${prop}`, line);
    try { return recipeValue(this.recipe(), name); } catch (x) { throw new ScriptError(x.message, line); }
  }
  // ---- flow colors (Rule 5.21) ----
  // tab.flow_Color: the word tab means the Tab with the focus (the one each screen shows). Pipe_1.flow_Color: that pipe or hose.
  _flowTarget(name, prop) {
    if (!FLOW_PROPS.has(String(prop ?? '').toLowerCase())) return null;
    const n = cleanName(name);
    if (n.toLowerCase() === 'tab' && !this.store.has(n)) return prop.toLowerCase() === 'flow_color' ? { tab: true } : null;
    const p = (this.store.config.graphics ?? []).find(g => (g.kind === 'pipe' || (g.kind === 'ip' && (!g.fitting || g.fitting === 'point'))) && g.name && g.name.toLowerCase() === n.toLowerCase());
    return p ? (p.kind === 'ip' ? { ip: p.name } : { pipe: p.name }) : null;
  }
  setFlow(name, v, line) {
    const f = this._flowTarget(name, 'flow_color'), k = flowKey(v);
    if (!f) throw new ScriptError(`No pipe, hose or IP named "${name}"`, line);
    if (k === null) throw new ScriptError(`"${v}" is not a flow color: use None, Tap, Strike, Mash, Boil, Whirlpool, Ferment, Red, Yellow, Blue, Green, Brown, Orange, Purple, Reddish_Brown, Golden, or "RGB 160 69 42"`, line);
    const m = f.ip ? this.flow.ips : this.flow.pipes, n = f.ip ?? f.pipe;
    if (f.tab) this.flow.tab = k; else if (k) m[n] = k; else delete m[n];
    this.emit('flow', this.flowView());
  }
  flowView() { return { tab: this.flow.tab, pipes: { ...this.flow.pipes }, ips: { ...this.flow.ips } }; }
  resetFlow() { this.flow = { tab: '', pipes: {}, ips: {} }; this.emit('flow', this.flowView()); }
  _get(name, prop, line) {
    try { return this.store.getProp(name, prop); } catch (x) { throw new ScriptError(x.message, line); }
  }
  // Rule 1.30: '' when the value fits, or the error. Only a gGlobal's .value (a Boolean's .state is its .value too) is checked.
  _gKindError(el, prop, v) {
    if (el?.type === 'gGlobal' && el.kind === 'time' && TIME_PARTS[prop]) return timePartError(el.name, prop, v);    // gT_X.minute = 5
    if (el?.type !== 'gGlobal' || !(prop === 'value' || (prop === 'state' && el.kind === 'bool'))) return '';
    return kindValueError(el.name, el.kind ?? 'value', v);
  }
  _isSound(name) { return SOUND_TYPES.includes(this.store.get(name)?.type); }
  _set(name, prop, v, line) {
    try { return this.store.setProp(name, prop, v, 'script'); } catch (x) { throw new ScriptError(x.message, line); }
  }

  // A Manual valve (Valve type Manual): the panel asks a person to open or close it by hand, and this Process waits
  // until someone presses Done (confirmValve). A valve already in that position needs nothing.
  // A Manual Valve Widget (Fritz, 2026-10-28): the Process never changes it. The Tab shows "open it by hand" and the
  // Process waits until someone clicks the valve on its Tab, so it shows what the Process asked for.
  // A Confirmation Widget (OakBarn Brewery, 2026-11-08, Rule 1.28): the pop-up asks the person to do it by hand and press Done, and
  // only then does it show On or Off (a click on it on its Tab, with the same pop-up, does it too).
  async _manualValve(inst, el, open, L) {
    if (!!this.store.getProp(el.name, 'state') === open) return;
    const confirm = isConfirmation(el), widget = isManualValveWidget(el) && !confirm, { say, is } = byHandWords(el, open);
    const ask = { name: el.name, label: el.label || el.name, open, process: inst.name, since: Date.now(), ...(widget ? { widget: true, tab: el.workspace } : {}),
      ...(confirm ? { confirm: true, say, is, tab: el.workspace } : {}) };
    this.valveAsks.set(el.name, ask);
    this.emit('valves', this.valveList());
    inst.waiting = true; this._status(inst, { waiting: true });
    try {
      while (!inst.stopFlag && this.valveAsks.get(el.name) === ask && !ask.done && !((widget || confirm) && !!this.store.getProp(el.name, 'state') === open)) await new Promise(r => setTimeout(r, 100));
    } finally {
      if (this.valveAsks.get(el.name) === ask) this.valveAsks.delete(el.name);
      inst.waiting = false; this._status(inst);
      this.emit('valves', this.valveList());
    }
    if (ask.done && confirm) { try { this.store.setProp(el.name, 'state', open, 'confirm'); } catch (x) { throw new ScriptError(x.message, L); } }
    else if (ask.done && !widget) this._set(el.name, 'state', open, L);
  }
  // Hose_1.connect = QD_1 / = Mash_Tun (Fritz, 2026-11-06, Rule 5.34): the hose is drawn where it goes at once, the same as when a
  // person drags its end there, and the Process waits until someone puts the real hose there and presses Done (like a Manual
  // valve). A hose already there needs nothing.
  async _connectHose(inst, name, to, L) {
    const cfg = this.store.config, h = findQdHose(cfg, name);
    if (!h) throw new ScriptError(`No hose named "${name}" (.connect is for a Quick Disconnect hose, such as Hose_1)`, L);
    if (!isQdHose(h)) throw new ScriptError(`${name} is not a Quick Disconnect hose: only those have .connect (Rule 5.34)`, L);
    const t = connectTarget(cfg, h, to);
    if (t.error) throw new ScriptError(t.error, L);
    if ((h.to ?? null) === t.to) return;
    const r = connectHose(cfg, h, t.to);
    if (r.error) throw new ScriptError(`${h.name || name}.connect: ${r.error}`, L);
    this.emit('config');
    const label = h.label || h.name || name;
    const ask = { name: 'hose:' + (h.name || h.id), label, hose: true, where: t.where, tab: h.workspace, process: inst.name, since: Date.now() };
    this.valveAsks.set(ask.name, ask);
    this.emit('valves', this.valveList());
    inst.waiting = true; this._status(inst, { waiting: true });
    try { while (!inst.stopFlag && this.valveAsks.get(ask.name) === ask && !ask.done) await new Promise(r => setTimeout(r, 100)); }
    finally {
      if (this.valveAsks.get(ask.name) === ask) this.valveAsks.delete(ask.name);
      inst.waiting = false; this._status(inst);
      this.emit('valves', this.valveList());
    }
  }
  // ask "Add the grain, then press Done" (the Brew Process): a pop-up on every screen, and the Process waits for Done
  async _ask(inst, text) {
    const ask = { name: 'ask:' + inst.name, label: String(text), ask: true, process: inst.name, since: Date.now() };
    this.valveAsks.set(ask.name, ask);
    this.emit('valves', this.valveList());
    inst.waiting = true; this._status(inst, { waiting: true });
    try { while (!inst.stopFlag && this.valveAsks.get(ask.name) === ask && !ask.done) await new Promise(r => setTimeout(r, 100)); }
    finally {
      if (this.valveAsks.get(ask.name) === ask) this.valveAsks.delete(ask.name);
      inst.waiting = false; this._status(inst);
      this.emit('valves', this.valveList());
    }
  }
  // A DigiBoil or 65 L Brewzilla (Fritz, 2026-11-07, Rule 5.39): DigiBoil_Controls.setpoint = 152, .heat = on ... Skynet can't
  // switch it, so its Widget shows what was asked, a pop-up tells a person what to set by hand (a set point in °F is given in °C
  // too: its screen starts in °C every time it is turned on) and the Process waits for Done. Already set that way: nothing to ask.
  async _handSet(inst, el, prop, v, L) {
    const p = String(prop).toLowerCase(), want = p === 'setpoint' ? toNum(v) : toBool(v);
    const cur = this.store.getProp(el.name, p);
    this._set(el.name, p, want, L);
    if (p === 'setpoint' ? Number(cur) === want : !!cur === want) return;
    await this._ask(inst, handAsk(el.appliance, el.label || el.name, p, want, el.units || '°F'));
  }
  // take_reading Name (OakBarn Brewery, 2026-11-09, Rule 6.25): "Glass and Refractometer Readings are external to the Program, but there
  // could be a command to Take a Reading that acts like a Wait until a Reading Question is answered." A pop-up asks Refractometer or Glass.
  // Refractometer: the SG box and Save at once. Glass: a wait in minutes for the sample to cool, counted down here, then the same SG box.
  // Pause (only a person) hides it for 5 minutes. Save keeps the SG in Name (a Hydrometer: in its gravity units), and with "Send to
  // Database now" ticked sends it to the database; unticked it is Exit (No Database). The Process goes on after Save.
  async _takeReading(inst, name, L) {
    const el = this.store.get(cleanName(name));
    if (!el) throw new ScriptError(`take_reading: nothing is named "${name}"`, L);
    if (!['hydrometer', 'valueWidget', 'gGlobal'].includes(el.type)) throw new ScriptError(`take_reading ${name}: the reading goes into a Hydrometer, a Value Widget or a gGlobal`, L);
    const ask = { name: 'reading:' + inst.name, label: el.label || el.name, target: el.name, reading: true, stage: 'pick', until: 0, paused: 0, process: inst.name, since: Date.now() };
    this.valveAsks.set(ask.name, ask);
    this.emit('valves', this.valveList());
    inst.waiting = true; this._status(inst, { waiting: true });
    try { while (!inst.stopFlag && this.valveAsks.get(ask.name) === ask && !ask.done) await new Promise(r => setTimeout(r, 100)); }
    finally {
      if (this.valveAsks.get(ask.name) === ask) this.valveAsks.delete(ask.name);
      inst.waiting = false; this._status(inst);
      this.emit('valves', this.valveList());
    }
    if (ask.done && ask.sg !== undefined) this.print(inst.name, `Reading ${ask.sg.toFixed(3)} SG (${ask.by}) saved in ${el.name}${ask.db ? ', sent to the database' : ', not sent to the database'}`);
  }
  // a person's answer on the take_reading pop-up: { name, action: refract | glass (minutes) | readnow | pause | save (sg, db) }
  readingAction(b, by = 'someone') {
    const ask = this.valveAsks.get(String(b?.name ?? ''));
    if (!ask?.reading) throw new Error('Nothing is waiting for that reading');
    const now = Date.now();
    switch (b.action) {
      case 'refract': ask.stage = 'enter'; ask.by = 'Refractometer'; ask.paused = 0; break;
      case 'glass': {
        const min = Number(b.minutes);
        if (!Number.isFinite(min) || min < 0 || min > 240) throw new Error('Type the minutes the sample needs to cool (0 to 240)');
        ask.stage = min > 0 ? 'cooling' : 'enter'; ask.by = 'Glass hydrometer'; ask.until = now + min * 60000; ask.paused = 0; break;
      }
      case 'readnow': ask.stage = 'enter'; ask.paused = 0; break;
      case 'pause': ask.paused = now + READING_PAUSE_MS; break;      // only a person pauses it; it comes back in 5 minutes
      case 'back': ask.stage = 'pick'; ask.paused = 0; break;
      case 'save': {
        const sg = readSg(b.sg), el = this.store.get(ask.target);
        if (!el) throw new Error(`${ask.target} is gone`);
        const v = el.type === 'hydrometer' ? Math.round(fromSg(sg, el.gravityUnits) * 10000) / 10000 : sg;
        this.store.setProp(el.name, 'value', v, el.type === 'hydrometer' ? 'hw' : 'user');
        if (el.type === 'hydrometer') this.store.setProp(el.name, 'lastseen', new Date().toISOString(), 'hw');
        ask.sg = sg; ask.db = !!b.db; ask.by = ask.by || 'by hand';
        if (ask.db) { try { this.logger.logNow(el.name, 'user'); } catch (x) { this.print(ask.process, `The reading was saved, but not sent to the database: ${x.message}`); } }
        ask.done = true; return;
      }
      default: throw new Error('Unknown answer');
    }
    this.emit('valves', this.valveList());
  }
  // open_valve / close_valve Name: one valve, any kind
  async _oneValve(inst, name, open, L) {
    const el = this.store.get(cleanName(name));
    if (!el) throw new ScriptError(`No valve named "${name}"`, L);
    if (isManualValve(el)) return this._manualValve(inst, el, open, L);
    if (!(el.type === 'digitalOut' && el.subtype === 'valve')) throw new ScriptError(`${name} is not a valve: open_valve and close_valve are for valves`, L);
    this._set(el.name, 'state', open, L);
  }
  // close_all_valves / open_all_valves (Rule 6.15): every valve on that list; all_pumps_off: every pump
  async _valveList(inst, what, L) {
    const els = this.store.config.elements ?? [];
    const list = what === 'all_pumps_off' ? els.filter(e => e.type === 'digitalOut' && e.subtype === 'pump')
      : els.filter(what === 'close_all_valves' ? onCloseAll : onOpenAll);
    const on = what === 'open_all_valves';
    for (const el of list) this._set(el.name, 'state', on, L);
    this.print(inst.name, `${what === 'all_pumps_off' ? 'Pumps off' : on ? 'Valves opened' : 'Valves closed'}: ${list.map(e => e.label || e.name).join(', ') || 'none on the list'}`);
  }
  valveList() { return [...this.valveAsks.values()].map(({ name, label, open, process, since, widget, tab, ask, hose, where, confirm, say, is, reading, target, stage, until, paused, by }) => ({ name, label, open, process, since, ...(widget ? { widget, tab } : {}), ...(ask ? { ask } : {}), ...(hose ? { hose, where, tab } : {}), ...(confirm ? { confirm, say, is, tab } : {}),
    ...(reading ? { reading, target, stage, until, paused, by, now: Date.now() } : {}) })); }
  // someone opened or closed the valve by hand and pressed Done
  confirmValve(name) {
    const ask = this.valveAsks.get(cleanName(name));
    if (!ask) throw new Error(`Nothing is waiting on the valve "${name}"`);
    if (ask.widget) throw new Error(`${ask.label} is a Manual Valve: click it on its Tab once it is ${ask.open ? 'open' : 'closed'}`);
    ask.done = true;
  }

  // ---- Override button (Fritz, 2026-10-30) ----
  // One press lets every running Process move on, like the Simulator's skip but on the real clock: 100 ms after the press a
  // wait or sleep it is held in ends, and the next goto that jumps back up (a loop, often inside an if) is passed, so the
  // Process goes on below it. A press is spent once it has ended a wait and then left a loop, or when the Process reaches
  // its next wait or sleep (that one runs as normal). A press nothing used within a second is dropped. Manual valves still
  // wait for their click or Done, and Looper Processes (background loops like looper_LogTemps) are left alone.
  override(by = 'user') {
    const at = Date.now() + OVERRIDE_MS, names = [];
    for (const inst of this.running.values()) {
      if (this.classOf(inst.name) === 'looper') continue;          // a Looper runs in the background on its own: Override leaves it alone
      inst.override = { at, used: false }; names.push(inst.name);
    }
    for (const n of names) this.print(n, `Override pressed${by && by !== 'user' ? ` by ${by}` : ''}: moving on`);
    return names;
  }
  // true when a fresh press is due now (a wait or sleep ends); an old unused press is dropped
  _overrideDue(inst) {
    const o = inst.override; if (!o || o.used) return false;
    const now = Date.now();
    if (now > o.at + OVERRIDE_KEEP_MS) { delete inst.override; return false; }
    return now >= o.at;
  }
  // a wait or sleep starts: a press already spent on an earlier wait ends here (this one runs as normal)
  _overrideStart(inst) { if (inst.override?.used) delete inst.override; }
  // a wait or sleep ended by a press: the next loop back up is passed
  _overrideUsed(inst, what, L) { inst.override.used = true; this.print(inst.name, `Override: the ${what} on line ${L} was passed`); }

  _applyOp(aop, cur, rhs) {
    switch (aop) { case '+=': return add(cur, rhs); case '-=': return sub(cur, rhs); case '*=': return mul(cur, rhs); case '/=': return div(cur, rhs); default: return rhs; }
  }

  // ---- statements ----
  async _exec(inst, st, pc) {
    const L = st.line, stmts = inst.prog.stmts;
    switch (st.op) {
      case 'label': case 'endif': return pc + 1;
      case 'step':
        inst.step = { num: st.num, name: st.name };
        this._status(inst);
        this.emit('step', { process: inst.name, cls: this.classOf(inst.name), num: st.num, name: st.name });
        this._showStep(inst.name, st.num, st.name);
        return pc + 1;
      case 'new':
        if (st.global) {
          // a gGlobal (Rule 1.24): made the first time this line runs, with the = value as its first value. After that it is
          // already there and keeps its own value (Rule 1.22), so the line does nothing.
          const clash = this._globalClash(st.name, st.type);
          if (clash) throw new ScriptError(clash, L);
          if (!this.store.has(st.name)) {
            const first = st.expr ? this.ev(inst, st.expr, L) : undefined;
            const bad = first === undefined ? '' : kindValueError(cleanName(st.name), st.type, first);      // Rule 1.30
            if (bad) throw new ScriptError(bad, L);
            this.store.addGlobal(st.name, st.type, first);
            this.print(inst.name, `Made the gGlobal ${cleanName(st.name)} (${VAR_KINDS[st.type]})`);
          }
          return pc + 1;
        }
        if (!inst.vars.has(st.name)) inst.vars.set(st.name, { type: st.type, val: defaultFor(st.type), precision: null });
        return pc + 1;
      case 'assign': {
        const rhs = this.ev(inst, st.expr, L);
        const t = st.target;
        if (t.kind === 'sound' && !inst.vars.has(t.name)) {         // alm_Hops = true / SoundPlayer = false
          if (!this._isSound(t.name)) throw new ScriptError(`Unknown variable ${t.name}`, L);
          if (st.aop !== '=') throw new ScriptError(`${t.name} is an alarm or sound: set it with = true or = false`, L);
          this._set(t.name, 'active', toBool(rhs), L);
        } else if (t.kind === 'var' || t.kind === 'sound') {
          const v = this._var(inst, t.name, L);
          if (st.aop !== '=') { this._notNull(v.val, { name: t.name }, L); this._notNull(rhs, st.expr, L); }     // X += 1 on an empty X
          let nv; try { nv = this._applyOp(st.aop, v.val, rhs); } catch (x) { throw new ScriptError(x.message, L); }
          v.val = coerceOrNull(v.type, nv, v.precision ?? undefined);
        } else if (inst.vars.has(t.name) && !t.quoted || (t.quoted && inst.vars.has(t.name) && !this.store.has(t.name))) {
          const v = inst.vars.get(t.name);
          if (t.prop !== 'precision') throw new ScriptError(`Variable ${t.name} has no property ${t.prop}`, L);
          v.precision = toNum(rhs); v.val = coerceOrNull(v.type, v.val, v.precision);
        } else if (t.prop === 'connect' && !this.store.has(t.name)) {
          if (st.aop !== '=') throw new ScriptError(`${t.name}.connect is set with =, for example ${t.name}.connect = QD_1`, L);
          await this._connectHose(inst, t.name, rhs, L);
        } else if (this._flowTarget(t.name, t.prop)) {
          if (st.aop !== '=') throw new ScriptError(`${t.name}.flow_Color is set with =, for example ${t.name}.flow_Color = Mash`, L);
          this.setFlow(t.name, rhs, L);
        } else {
          if (t.prop === 'running' && this.isProcess(t.name)) throw new ScriptError(readOnlyRunning(t.name), L);
          if (isRecipeName(t.name) && !this.store.has(t.name)) throw new ScriptError(readOnlyRecipe(t.name), L);
          const cur = st.aop === '=' ? undefined : this._get(t.name, t.prop, L);
          if (st.aop !== '=') { this._notNull(cur, { name: t.name }, L); this._notNull(rhs, st.expr, L); }
          let nv; try { nv = this._applyOp(st.aop, cur, rhs); } catch (x) { throw new ScriptError(x.message, L); }
          const el = this.store.get(t.name);
          // a Heating Element alone (HLT_Heat = on) is turned On or Off (Fritz, 2026-11-07: "I prefer on and Off rather than
          // enabled"), not its PID % (.value)
          if (t.bare && isMethodDevice(el)) { this._set(t.name, 'state', nv, L); return pc + 1; }
          if (isManualValve(el) && ['state', 'value'].includes(t.prop)) await this._manualValve(inst, el, toBool(nv), L);
          else if (el?.type === 'manual' && isAppliance(el.appliance) && isHandProp(el.appliance, t.prop)) await this._handSet(inst, el, t.prop, nv, L);
          else {
            // a gGlobal takes only its own Kind of value (Rule 1.30): gT_HopDrop_1 = "My Hop Drop" is an error
            const bad = this._gKindError(el, t.prop, nv);
            if (bad) throw new ScriptError(bad, L);
            this._set(t.name, t.prop, nv, L);
          }
        }
        return pc + 1;
      }
      case 'if': {
        if (toBool(this.ev(inst, st.expr, L))) return pc + 1;
        let j = st.next;
        while (stmts[j].op === 'elseif') {
          if (toBool(this.ev(inst, stmts[j].expr, stmts[j].line))) return j + 1;
          j = stmts[j].next;
        }
        return j + 1;                                    // else -> run its body; endif -> continue after
      }
      case 'elseif': case 'else': return st.end + 1;     // reached by finishing the previous branch
      case 'goto': {
        const to = inst.prog.labels.get(st.label);
        if (to <= pc && inst.override && (inst.override.used || this._overrideDue(inst))) {     // Override: leave the loop
          delete inst.override; this.print(inst.name, `Override: the loop back to [${st.label}] on line ${L} was passed`);
          return pc + 1;
        }
        return to + 1;
      }
      case 'sleep': {
        this._overrideStart(inst);
        await clock.sleep(toNum(this.ev(inst, st.expr, L)), () => inst.stopFlag || this._overrideDue(inst), inst);   // simulation mode: faster, and skips ahead
        if (!inst.stopFlag && this._overrideDue(inst)) this._overrideUsed(inst, 'sleep', L);
        return pc + 1;
      }
      case 'wait': {
        inst.waiting = true; inst.waitExpr = st.expr; this._status(inst, { waiting: true });
        // Checked every 100 ms AND on every change, so a short pulse (a Momentary button) is not missed
        let hit = false, wake = null, err = null;
        const onChange = () => {
          if (hit) return;
          try { if (toBool(this.ev(inst, st.expr, L))) { hit = true; wake?.(); } } catch (x) { err = x; wake?.(); }
        };
        this.store.on('change', onChange);
        this._overrideStart(inst);
        const reach = this._readingWaitMs(st.expr);
        if (reach) inst.reachAt = clock.now() + reach;
        try {
          while (!inst.stopFlag && !hit) {
            if (err) throw err;
            if (toBool(this.ev(inst, st.expr, L))) break;
            if (this._overrideDue(inst)) { this._overrideUsed(inst, 'wait', L); break; }
            if (inst.reachAt && clock.now() >= inst.reachAt) { this.print(inst.name, `Simulation: the wait on line ${L} is pretended reached after ${reach / 1000} s`); break; }
            await new Promise(r => { wake = r; setTimeout(r, 100); });
            wake = null;
          }
        } finally { this.store.off('change', onChange); inst.waitExpr = null; delete inst.reachAt; }
        inst.waiting = false; this._status(inst);
        return pc + 1;
      }
      case 'print': this.print(inst.name, plain(this.ev(inst, st.expr, L))); return pc + 1;
      case 'clear': return pc + 1;
      case 'lock': {
        if (!this.onLock) throw new ScriptError('Locking is not available here', L);
        try { this.print(inst.name, this.onLock(st.what, st.on, inst.name)); } catch (x) { throw new ScriptError(x.message, L); }
        return pc + 1;
      }
      case 'recipe': {
        if (!this.onRecipe) throw new ScriptError('The Recipe is not available here', L);
        const args = st.args.map(a => toStr(this.ev(inst, a, L)));
        if (st.cmd === 'start' && args[0]) args[0] = cleanName(args[0]);
        try { this.print(inst.name, this.onRecipe(st.cmd, args, inst.name)); } catch (x) { throw new ScriptError(x.message, L); }
        return pc + 1;
      }
      case 'show': this.emit('show', toStr(this.ev(inst, st.expr, L))); return pc + 1;
      case 'ask': await this._ask(inst, plain(this.ev(inst, st.expr, L))); return pc + 1;
      case 'valves': await this._valveList(inst, st.what, L); return pc + 1;
      case 'onevalve': await this._oneValve(inst, st.name, st.open, L); return pc + 1;
      case 'reading': await this._takeReading(inst, st.name, L); return pc + 1;
      case 'send_db': {          // send its reading to the database now, whatever its .database frequency
        const n = toStr(this.ev(inst, st.expr, L));
        try { this.logger.logNow(n, 'script'); } catch (x) { throw new ScriptError(x.message, L); }
        return pc + 1;
      }
      case 'send_db_group': {    // send every item in that Group to the database now, once (Rule 6.14)
        const n = toStr(this.ev(inst, st.expr, L));
        try { this.logger.sendGroup(n); } catch (x) { throw new ScriptError(x.message, L); }
        return pc + 1;
      }
      case 'start_db_group':     // Database Groups (Rule 6.14, Fritz 2026-11-06): its items are sent by their own setting until stopped
      case 'stop_db_group': {
        const n = toStr(this.ev(inst, st.expr, L)), go = st.op === 'start_db_group';
        let k; try { k = go ? this.logger.startGroup(n) : this.logger.stopGroup(n); } catch (x) { throw new ScriptError(x.message, L); }
        this.print(inst.name, `Database Group ${cleanName(n)} ${go ? 'started' : 'stopped'} (${k} item${k === 1 ? '' : 's'})`);
        return pc + 1;
      }
      case 'play': {
        const n = cleanName(toStr(this.ev(inst, st.expr, L)));
        if (!this._isSound(n)) throw new ScriptError(`play: no alarm or sound player named "${n}"`, L);
        this._set(n, 'active', true, L);
        return pc + 1;
      }
      case 'restart': {
        const n = st.expr ? cleanName(toStr(this.ev(inst, st.expr, L))) : inst.name;
        if (n === inst.name) { inst.restartSelf = true; inst.stopFlag = true; return stmts.length; }
        if (!this.exists(n)) throw new ScriptError(`restart: no process named "${n}"`, L);
        try { await this.restart(n, inst.name); } catch (x) { throw new ScriptError(x.message, L); }
        return pc + 1;
      }
      case 'start': case 'stop': case 'reset': {
        const n = cleanName(toStr(this.ev(inst, st.expr, L)));
        if (st.op !== 'reset' && this.exists(n)) {
          if (st.op === 'start') {
            try { this.start(n, inst.name); } catch (x) { throw new ScriptError(x.message, L); }
            return pc + 1;
          }
          if (n === inst.name) { inst.stopFlag = true; return stmts.length; }
          this.stop(n); return pc + 1;
        }
        const el = this.store.get(n);
        if (!el) throw new ScriptError(`${st.op}: no process or element named "${n}"`, L);
        if (el.type === 'timer') {
          if (st.op === 'reset') this._set(n, 'value', this.store.getProp(n, 'resetvalue') ?? new TimeVal(0), L);
          else this._set(n, 'running', st.op === 'start', L);
        } else if (SOUND_TYPES.includes(el.type) && st.op !== 'reset') this._set(n, 'active', st.op === 'start', L);
        else if (el.type === 'stepper' && st.op !== 'start') this._set(n, st.op, true, L);     // stop "Stepper" / reset "Stepper" (here = home)
        else throw new ScriptError(`${st.op} works on processes, timers, alarms, sound players and steppers (stop, reset), not ${el.type} "${n}"`, L);
        return pc + 1;
      }
    }
    throw new ScriptError(`Unknown statement`, L);
  }
}
