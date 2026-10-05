// BruControl-style script engine.
// Scripts are plain text files in the scripts folder. A script is read and compiled
// from its file EVERY time it is started, so an edited script always runs its new version.
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import {
  TimeVal, DateVal, coerce, defaultFor, toNum, toStr, toBool, plain,
  add, sub, mul, div, compare,
} from './values.js';
import { cleanName } from './store.js';
import { classOf, renumber as renumberSteps, CLASSES } from './scaffold.js';

const VAR_TYPES = ['value', 'string', 'bool', 'time', 'datetime'];
const CONST_WORDS = { visible: 'visible', hidden: 'hidden', countdown: 'countdown', countup: 'countup', none: 'none', custom: 'custom', default: 'default',
  hiddenlocked: 'hidden', on: true, off: false };
export const KEYWORDS = new Set(['if', 'elseif', 'else', 'endif', 'goto', 'sleep', 'wait', 'start', 'stop', 'reset', 'print', 'clear', 'show', 'log', 'new', 'step']);
// words that join conditions: never an attribute name ("if a and b")
export const LOGIC_WORDS = new Set(['and', 'or', 'not']);
export { CONST_WORDS, VAR_TYPES };
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
    if (c === '/' && src[i + 1] === '/') break;          // rest of line is a comment
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
    // name.attribute: the dot splits a name from its attribute ("my Widget".visible works too)
    if ((m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest))) { push('id', m[0], m[0].length); continue; }
    if (c === '.' && /[A-Za-z_]/.test(src[i + 1] ?? '')) { push('op', '.', 1); continue; }
    if ((m = /^(==|!=|<>|<=|>=|\+=|-=|\*=|\/=|&&|\|\||[=<>+\-*/^()!,])/.exec(rest))) {
      push('op', m[0] === '<>' ? '!=' : m[0], m[0].length); continue;
    }
    throw new ScriptError(`Unexpected character "${c}"`, line);
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
  unary() { if (this.isOp('-')) { this.next(); return { k: 'neg', e: this.unary() }; } return this.primary(); }
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

// ---------------- statement compiler ----------------
// opts.declared: variable names made with "new" elsewhere (to check one line on its own)
export function compile(text, opts = {}) {
  const src = text.replace(/^﻿/, '').split(/\r?\n/);
  const stmts = [], errors = [], warnings = [];
  const labels = new Map();
  for (let n = 0; n < src.length; n++) {
    const line = n + 1, raw = src[n], s = raw.trim();
    try {
      if (!s || s.startsWith('//')) continue;
      const lab = /^\[(.*)\]$/.exec(s);
      if (lab) {
        const name = lab[1].trim();
        if (labels.has(name)) errors.push({ line, msg: `Label [${name}] is used twice (also line ${stmts[labels.get(name)].line})` });
        else labels.set(name, stmts.length);
        stmts.push({ line, op: 'label', name });
        continue;
      }
      // step "Mash in"  /  step 1.00003 "Mash in": a numbered section of the brew (scaffolding, lib/scaffold.js)
      const stp = STEP_RE.exec(s);
      if (stp) {
        const r = tokenize(stp[2], line);
        if (r.length > 1 || (r.length && r[0].t !== 'str')) throw new ScriptError('step needs its name in quotes: step "Mash in"', line);
        stmts.push({ line, op: 'step', num: stp[1] ?? '', name: r[0]?.v ?? '' });
        continue;
      }
      const toks = tokenize(s, line);
      if (!toks.length) continue;
      const first = toks[0], kw = first.t === 'id' ? first.v.toLowerCase() : null;
      const rest = toks.slice(1);
      const st = { line };
      if (kw === 'new' && rest.length >= 2 && VAR_TYPES.includes(rest[0].v?.toLowerCase())) {
        if (rest.length > 2) throw new ScriptError('Too many words after new', line);
        st.op = 'new'; st.type = rest[0].v.toLowerCase(); st.name = rest[1].v;
      } else if (kw === 'if' || kw === 'elseif') { st.op = kw; st.expr = parseExpr(rest, line); }
      else if (kw === 'else' && !rest.length) st.op = 'else';
      else if (kw === 'endif' && !rest.length) st.op = 'endif';
      else if (kw === 'goto') {
        if (rest.length !== 1) throw new ScriptError('goto needs one label name', line);
        st.op = 'goto'; st.label = String(rest[0].v).trim();
      } else if (kw === 'sleep' || kw === 'wait' || kw === 'print') { st.op = kw; st.expr = parseExpr(rest, line); }
      else if ((kw === 'start' || kw === 'stop' || kw === 'reset' || kw === 'log') && rest.length && !ASSIGN_OPS.has(rest[0].v)) {
        st.op = kw; st.expr = parseExpr(rest, line);
      } else if (kw === 'clear' && !rest.length) st.op = 'clear';
      else if (kw === 'show') {
        st.op = 'show';
        const r = rest[0]?.t === 'id' && ['workspace', 'tab'].includes(rest[0].v.toLowerCase()) ? rest.slice(1) : rest;
        st.expr = parseExpr(r, line);
      } else {
        // assignment:  var = expr | "var" = expr | "element" prop = expr | element prop = expr
        const ai = toks.findIndex(t => t.t === 'op' && ASSIGN_OPS.has(t.v));
        if (ai < 1) throw new ScriptError(`Do not understand: ${s}`, line);
        const tgt = toks.slice(0, ai);
        st.op = 'assign'; st.aop = toks[ai].v; st.expr = parseExpr(toks.slice(ai + 1), line);
        const named = tgt[0].t === 'str' || tgt[0].t === 'id';
        if (tgt.length === 1 && named) st.target = { kind: 'var', name: tgt[0].v, quoted: tgt[0].t === 'str' };
        else if (named && ((tgt.length === 2 && tgt[1].t === 'id') || (tgt.length === 3 && tgt[1].t === 'op' && tgt[1].v === '.' && tgt[2].t === 'id'))) {
          // name.attribute = ...  (or BruControl's  "name" attribute = ...)
          st.target = { kind: 'prop', name: tgt[0].v, prop: tgt[tgt.length - 1].v.toLowerCase(), quoted: tgt[0].t === 'str' };
        } else throw new ScriptError(`Cannot assign to: ${s.slice(0, s.indexOf(toks[ai].v)).trim()}`, line);
      }
      stmts.push(st);
    } catch (e) {
      errors.push({ line: e.line ?? line, msg: e.message });
    }
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
  const declared = new Set([...(opts.declared ?? []), ...stmts.filter(s => s.op === 'new').map(s => s.name)]);
  const refs = [];
  const walk = (e, line) => {
    if (!e) return;
    // a name that is not a variable is a Device or Widget, and on its own it means its main value:
    // alm_Hops == true, Kettle_SetPoint = 185.5, Pump_Red = true  (lib/store.js mainProp)
    if (e.k === 'var' && !declared.has(e.name) && !(e.name.toLowerCase() in CONST_WORDS)) { e.k = 'idprop'; e.prop = 'value'; e.bare = true; }
    if (e.k === 'prop' || (e.k === 'idprop' && !declared.has(e.name))) refs.push({ line, name: e.name, bare: e.bare });
    for (const k of ['l', 'r', 'e']) walk(e[k], line);
  };
  for (const st of stmts) {
    if (st.op === 'goto' && !labels.has(st.label)) errors.push({ line: st.line, msg: `goto: no label [${st.label}]` });
    walk(st.expr, st.line);
    if (st.op === 'assign') {
      if (st.target.kind === 'var' && !declared.has(st.target.name)) st.target = { kind: 'prop', name: st.target.name, prop: 'value', quoted: st.target.quoted, bare: true };
      if (st.target.kind === 'prop' && !(st.target.quoted === false && declared.has(st.target.name))) refs.push({ line: st.line, name: st.target.name, bare: st.target.bare });
    }
    if (['start', 'stop', 'reset', 'log'].includes(st.op) && st.expr.k === 'strvar' && !declared.has(st.expr.v)) refs.push({ line: st.line, name: st.expr.v, script: st.op !== 'log' });
  }
  return { stmts, labels, errors, warnings, refs };
}

// ---------------- runtime ----------------
const sleep = ms => new Promise(r => setTimeout(r, ms));

export class Engine extends EventEmitter {
  constructor(store, scriptsDir, logger) {
    super();
    this.store = store; this.dir = scriptsDir; this.logger = logger;
    this.running = new Map();    // name -> instance
    this.status = new Map();     // name -> last status {state, line, error, startedAt, endedAt}
    this.console = [];           // [{ts, script, text}]
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  // ---- files ----
  file(name) {
    name = cleanName(name);
    if (!name || BAD_NAME.test(name)) throw new Error(`Bad process name "${name}"`);
    return path.join(this.dir, name + '.txt');
  }
  exists(name) { try { return fs.existsSync(this.file(name)); } catch { return false; } }
  names() { return fs.readdirSync(this.dir).filter(f => f.endsWith('.txt')).map(f => f.slice(0, -4)).sort((a, b) => a.localeCompare(b)); }
  read(name) { return fs.readFileSync(this.file(name), 'utf8'); }
  write(name, text) {
    fs.writeFileSync(this.file(name), text);
    const inst = this.running.get(cleanName(name));
    if (inst) { inst.modified = true; this._status(inst); }
    this.emit('scripts');
  }
  backup(name) { fs.copyFileSync(this.file(name), this.file(name) + '.bak'); }
  remove(name) {
    if (this.running.has(cleanName(name))) throw new Error('Stop the process before deleting it');
    fs.unlinkSync(this.file(name)); this.status.delete(cleanName(name));
    const pc = this.store.config.processClasses;
    if (pc && cleanName(name) in pc) { delete pc[cleanName(name)]; this.store.writeConfig(); }
    this.renumber();
    this.emit('scripts');
  }
  rename(oldName, newName) {
    if (this.running.has(cleanName(oldName))) throw new Error('Stop the process before renaming it');
    if (this.exists(newName)) throw new Error(`A process named "${cleanName(newName)}" already exists`);
    fs.renameSync(this.file(oldName), this.file(newName)); this.status.delete(cleanName(oldName));
    const pc = this.store.config.processClasses;
    if (pc && cleanName(oldName) in pc) { pc[cleanName(newName)] = pc[cleanName(oldName)]; delete pc[cleanName(oldName)]; this.store.writeConfig(); }
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
  // Step widgets (vKonstant kind "step") show the step a Process of their class just reached
  _showStep(proc, num, name) {
    const cls = this.classOf(proc);
    for (const el of this.store.list('vKonstant')) {
      if (el.kind !== 'step' || ((el.stepClass ?? 'flow') !== cls && el.stepClass !== 'any')) continue;
      try { this.store.setProp(el.name, 'value', [num, name].filter(Boolean).join('  '), 'step'); } catch { /* not settable */ }
    }
  }

  // Syntax check plus checks against the current elements and scripts
  check(text) {
    const c = compile(text);
    const out = { errors: [...c.errors], warnings: [...c.warnings] };
    for (const r of c.refs) {
      if (r.script) {
        if (!this.exists(r.name) && !this.store.has(r.name)) out.errors.push({ line: r.line, msg: `No process or timer/alarm named "${r.name}"` });
      } else if (!this.store.has(r.name)) out.errors.push({ line: r.line, msg: r.bare ? `Unknown name ${r.name}: no variable made with new, and no Device or Widget by that name` : `No element named "${r.name}"` });
    }
    out.errors.sort((a, b) => a.line - b.line);
    return out;
  }

  list() {
    return this.names().map(n => {
      const st = this.status.get(n) ?? { state: 'stopped' };
      return { name: n, ...st, cls: this.classOf(n), autostart: (this.store.config.autostart ?? []).includes(n) };
    });
  }

  print(script, text) {
    const entry = { ts: Date.now(), script, text: toStr(text) };
    this.console.push(entry); if (this.console.length > 2000) this.console.splice(0, 500);
    this.emit('print', entry);
  }

  _status(inst, extra = {}) {
    const st = { state: inst.state, line: inst.line, step: inst.step ?? null, error: inst.error ?? null, startedAt: inst.startedAt, endedAt: inst.endedAt ?? null, modified: !!inst.modified, startedBy: inst.by, ...extra };
    this.status.set(inst.name, st);
    this.emit('scripts');
  }

  start(name, by = 'user') {
    name = cleanName(name);
    if (this.running.has(name)) { this.print(by, `start "${name}": already running (stop it first to restart)`); return { ok: false, msg: 'already running' }; }
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
    this.running.set(name, inst);
    this._status(inst);
    this.emit('started', name);           // vAPI "On demand only" logging
    this._run(inst);
    return { ok: true };
  }

  stop(name) {
    name = cleanName(name);
    const inst = this.running.get(name);
    if (inst) inst.stopFlag = true;
    return !!inst;
  }

  stopAll() { for (const n of this.running.keys()) this.stop(n); }

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
    this.running.delete(inst.name);
    this._status(inst);
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
      case 'now': return new DateVal(Date.now());
      case 'strvar': return inst.vars.has(e.v) ? inst.vars.get(e.v).val : e.v;
      case 'var': {
        if (inst.vars.has(e.name)) return inst.vars.get(e.name).val;
        const c = CONST_WORDS[e.name.toLowerCase()];
        if (c !== undefined) return c;
        throw new ScriptError(`Unknown variable ${e.name}`, line);
      }
      case 'prop': return this._get(e.name, e.prop, line);
      case 'idprop':
        if (inst.vars.has(e.name)) { if (e.prop === 'precision') return inst.vars.get(e.name).precision ?? -1; throw new ScriptError(`Variable ${e.name} has no property ${e.prop}`, line); }
        return this._get(e.name, e.prop, line);
      case 'neg': { const v = this.ev(inst, e.e, line); return v instanceof TimeVal ? new TimeVal(-v.s) : -toNum(v); }
      case 'not': return !toBool(this.ev(inst, e.e, line));
      case 'and': return toBool(this.ev(inst, e.l, line)) && toBool(this.ev(inst, e.r, line));
      case 'or': return toBool(this.ev(inst, e.l, line)) || toBool(this.ev(inst, e.r, line));
      case '+': return add(this.ev(inst, e.l, line), this.ev(inst, e.r, line));
      case '-': return sub(this.ev(inst, e.l, line), this.ev(inst, e.r, line));
      case '*': return mul(this.ev(inst, e.l, line), this.ev(inst, e.r, line));
      case '/': try { return div(this.ev(inst, e.l, line), this.ev(inst, e.r, line)); } catch (x) { throw new ScriptError(x.message, line); }
      case '^': return Math.pow(toNum(this.ev(inst, e.l, line)), toNum(this.ev(inst, e.r, line)));
      case 'cmp': {
        const c = compare(this.ev(inst, e.l, line), this.ev(inst, e.r, line));
        return { '==': c === 0, '!=': c !== 0, '<': c < 0, '>': c > 0, '<=': c <= 0, '>=': c >= 0 }[e.op];
      }
    }
    throw new ScriptError('Bad expression', line);
  }

  _get(name, prop, line) {
    try { return this.store.getProp(name, prop); } catch (x) { throw new ScriptError(x.message, line); }
  }
  _set(name, prop, v, line) {
    try { return this.store.setProp(name, prop, v, 'script'); } catch (x) { throw new ScriptError(x.message, line); }
  }

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
        if (!inst.vars.has(st.name)) inst.vars.set(st.name, { type: st.type, val: defaultFor(st.type), precision: null });
        return pc + 1;
      case 'assign': {
        const rhs = this.ev(inst, st.expr, L);
        const t = st.target;
        if (t.kind === 'var') {
          const v = this._var(inst, t.name, L);
          let nv; try { nv = this._applyOp(st.aop, v.val, rhs); } catch (x) { throw new ScriptError(x.message, L); }
          v.val = coerce(v.type, nv, v.precision ?? undefined);
        } else if (inst.vars.has(t.name) && !t.quoted || (t.quoted && inst.vars.has(t.name) && !this.store.has(t.name))) {
          const v = inst.vars.get(t.name);
          if (t.prop !== 'precision') throw new ScriptError(`Variable ${t.name} has no property ${t.prop}`, L);
          v.precision = toNum(rhs); v.val = coerce(v.type, v.val, v.precision);
        } else {
          const cur = st.aop === '=' ? undefined : this._get(t.name, t.prop, L);
          let nv; try { nv = this._applyOp(st.aop, cur, rhs); } catch (x) { throw new ScriptError(x.message, L); }
          this._set(t.name, t.prop, nv, L);
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
      case 'goto': return inst.prog.labels.get(st.label) + 1;
      case 'sleep': {
        let ms = toNum(this.ev(inst, st.expr, L));
        while (ms > 0 && !inst.stopFlag) { const d = Math.min(ms, 100); await sleep(d); ms -= d; }
        return pc + 1;
      }
      case 'wait': {
        inst.waiting = true; this._status(inst, { waiting: true });
        // Checked every 100 ms AND on every change, so a short pulse (a Momentary button) is not missed
        let hit = false, wake = null, err = null;
        const onChange = () => {
          if (hit) return;
          try { if (toBool(this.ev(inst, st.expr, L))) { hit = true; wake?.(); } } catch (x) { err = x; wake?.(); }
        };
        this.store.on('change', onChange);
        try {
          while (!inst.stopFlag && !hit) {
            if (err) throw err;
            if (toBool(this.ev(inst, st.expr, L))) break;
            await new Promise(r => { wake = r; setTimeout(r, 100); });
            wake = null;
          }
        } finally { this.store.off('change', onChange); }
        inst.waiting = false; this._status(inst);
        return pc + 1;
      }
      case 'print': this.print(inst.name, plain(this.ev(inst, st.expr, L))); return pc + 1;
      case 'clear': return pc + 1;
      case 'show': this.emit('show', toStr(this.ev(inst, st.expr, L))); return pc + 1;
      case 'log': {
        const n = toStr(this.ev(inst, st.expr, L));
        try { this.logger.logNow(n, 'script'); } catch (x) { throw new ScriptError(x.message, L); }
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
        } else if (el.type === 'alarm') this._set(n, 'active', st.op === 'start', L);
        else if (el.type === 'stepper' && st.op !== 'start') this._set(n, st.op, true, L);     // stop "Stepper" / reset "Stepper" (here = home)
        else throw new ScriptError(`${st.op} works on processes, timers, alarms and steppers (stop, reset), not ${el.type} "${n}"`, L);
        return pc + 1;
      }
    }
    throw new ScriptError(`Unknown statement`, L);
  }
}
