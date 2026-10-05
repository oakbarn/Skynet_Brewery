// Process timeline (Settings > Simulation): a dry run of a Process that works out WHEN each step happens,
// e.g. "00:10:00 into the Process: print "Check the mash pH"". Nothing is switched and nothing is changed:
// values the Process sets are kept in a scratch copy, everything else is read from the panel as it is now.
// Sleeps and waits on a timer reaching a time are counted. A wait on anything else (a temperature, a button)
// cannot be known ahead, so the steps after it are timed from the end of that wait.
import { compile } from './engine.js';
import { TimeVal, toNum, toBool, toStr, plain, fmtTime } from './values.js';
import { cleanName } from './store.js';

const MAX_STEPS = 20000, MAX_ROWS = 300, MAX_LOOPS = 3;

export function timeline(engine, name) {
  const text = engine.read(name);
  const prog = compile(text), src = text.replace(/^﻿/, '').split(/\r?\n/);
  if (prog.errors.length) return { name, rows: [], note: `The Process has errors (line ${prog.errors[0].line}: ${prog.errors[0].msg}). Fix them first.` };
  const store = engine.store, stmts = prog.stmts;
  const shadow = new Map();          // "name.prop" -> value set by this Process
  const timers = new Map();          // timer name -> {type, base, running, startT, anchor}
  let t = 0, anchor = null;          // seconds since the start, or since the end of the wait on line `anchor`
  let maybe = 0;                     // inside an "if" whose answer is not known ahead
  const rows = [], loops = new Map();
  const key = (n, p) => cleanName(n).toLowerCase() + '.' + String(p).toLowerCase();
  const isTimer = n => store.get(n)?.type === 'timer';
  const timer = n => {
    const k = cleanName(n).toLowerCase();
    if (!timers.has(k)) {
      const r = store.rt.get(store.get(n).name);
      timers.set(k, { type: r?.type ?? 'countup', base: r?.value?.s ?? 0, running: !!r?.running, startT: 0, anchor: null });
    }
    return timers.get(k);
  };
  const timerNow = tm => {
    if (!tm.running) return tm.base;
    if (tm.anchor !== anchor) return null;                 // started before a wait of unknown length
    const d = t - tm.startT;
    return tm.type === 'countdown' ? Math.max(0, tm.base - d) : tm.base + d;
  };
  const freeze = tm => { const v = timerNow(tm); tm.base = v ?? tm.base; tm.startT = t; tm.anchor = anchor; };

  // the engine's own expression code, reading the scratch copy first
  const dry = Object.create(engine);
  dry._get = (n, p) => {
    p = String(p).toLowerCase();
    if (isTimer(n) && (p === 'value' || p === 'running' || p === 'type')) {
      const tm = timer(n);
      if (p === 'running') return tm.running;
      if (p === 'type') return tm.type;
      const v = timerNow(tm); if (v === null) throw new Error('unknown');
      return new TimeVal(v);
    }
    if (shadow.has(key(n, p))) { const v = shadow.get(key(n, p)); if (v === undefined) throw new Error('unknown'); return v; }
    return store.getProp(n, p);
  };
  const inst = { name, vars: new Map() };
  const ev = e => dry.ev(inst, e, 0);
  const tryEv = e => { try { return { ok: true, v: ev(e) }; } catch { return { ok: false }; } };
  const add = (st, what, extra = {}) => {
    if (rows.length >= MAX_ROWS) return;
    rows.push({ line: st.line, at: Math.round(t), after: anchor, maybe: maybe > 0, text: src[st.line - 1].trim(), what, ...extra });
  };

  // How long until a wait on a timer is true ("tm_Mash" value >= 00:10:00, "tm_Boil" value <= 00:00:00), in seconds
  const timerWait = e => {
    if (e.k === 'and') { const a = timerWait(e.l), b = timerWait(e.r); return a === null || b === null ? null : Math.max(a, b); }
    if (e.k === 'or') { const a = [timerWait(e.l), timerWait(e.r)].filter(x => x !== null); return a.length ? Math.min(...a) : null; }
    if (e.k !== 'cmp') return null;
    let { l, r, op } = e;
    const tmRef = x => (x.k === 'prop' || x.k === 'idprop') && x.prop === 'value' && isTimer(x.name);
    if (!tmRef(l) && tmRef(r)) { [l, r] = [r, l]; op = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' }[op] ?? op; }
    if (!tmRef(l)) return null;
    const tm = timer(l.name), cur = timerNow(tm), want = tryEv(r);
    if (cur === null || !want.ok || !tm.running) return null;
    const target = want.v instanceof TimeVal ? want.v.s : toNum(want.v);
    if (tm.type === 'countdown' && ['<=', '<', '=='].includes(op)) return cur <= target ? 0 : Math.min(cur - target, tm.base);
    if (tm.type !== 'countdown' && ['>=', '>', '=='].includes(op)) return Math.max(0, target - cur);
    return null;
  };

  let pc = 0, steps = 0, stopped = '';
  const ifStack = [];      // end index of each unknown "if" we went into
  while (pc < stmts.length) {
    if (++steps > MAX_STEPS) { stopped = 'The Process runs too many steps to follow to the end.'; break; }
    while (ifStack.length && pc > ifStack[ifStack.length - 1]) { ifStack.pop(); maybe--; }
    const st = stmts[pc];
    switch (st.op) {
      case 'label': case 'endif': case 'clear': pc++; break;
      case 'new': inst.vars.set(st.name, { type: st.type, val: st.type === 'time' ? new TimeVal(0) : st.type === 'string' ? '' : st.type === 'bool' ? false : 0, precision: null }); pc++; break;
      case 'assign': {
        const r = tryEv(st.expr), tg = st.target;
        const opv = cur => { if (st.aop === '=') return r.v; return engine._applyOp(st.aop, cur, r.v); };
        if (tg.kind === 'var' || (inst.vars.has(tg.name) && !tg.quoted)) {
          const v = inst.vars.get(tg.name);
          if (v && tg.kind === 'var') { try { if (!r.ok) throw 0; v.val = opv(v.val); } catch { inst.vars.delete(tg.name); } }
        } else if (isTimer(tg.name) && ['value', 'type', 'running'].includes(tg.prop)) {
          const tm = timer(tg.name);
          if (tg.prop === 'type') { freeze(tm); tm.type = r.ok && String(r.v).toLowerCase() === 'countdown' ? 'countdown' : 'countup'; }
          if (tg.prop === 'value' && r.ok) { tm.base = r.v instanceof TimeVal ? r.v.s : toNum(r.v); tm.startT = t; tm.anchor = anchor; }
          if (tg.prop === 'running') { freeze(tm); tm.running = r.ok && toBool(r.v); if (tm.running) add(st, 'timer'); }
        } else {
          let v; try { if (!r.ok) throw 0; v = st.aop === '=' ? r.v : opv(dry._get(tg.name, tg.prop)); } catch { v = undefined; }
          shadow.set(key(tg.name, tg.prop), v);
          const el = store.get(tg.name);
          if (el && (tg.prop === 'state' || typeof v === 'string' || typeof v === 'boolean')) add(st, 'set', { value: v === undefined ? null : toStr(plain(v)) });
        }
        pc++; break;
      }
      case 'if': {
        const unknown = () => { maybe++; ifStack.push(st.end); };     // not known ahead: follow that part, marked "maybe"
        const r = tryEv(st.expr);
        if (!r.ok) { unknown(); pc++; break; }
        if (toBool(r.v)) { pc++; break; }
        let j = st.next;
        while (stmts[j].op === 'elseif') {
          const q = tryEv(stmts[j].expr);
          if (!q.ok) { unknown(); break; }
          if (toBool(q.v)) break;
          j = stmts[j].next;
        }
        pc = j + 1; break;
      }
      case 'elseif': case 'else': pc = st.end + 1; break;
      case 'goto': {
        const to = prog.labels.get(st.label) + 1;
        if (to <= pc) {
          const n = (loops.get(pc) ?? 0) + 1; loops.set(pc, n);
          if (n > MAX_LOOPS) { stopped = `Line ${st.line} goes back to [${st.label}] again and again, so only the first ${MAX_LOOPS} times round are shown.`; pc = stmts.length; break; }
        }
        pc = to; break;
      }
      case 'sleep': {
        const r = tryEv(st.expr);
        if (r.ok) { const s = toNum(r.v) / 1000; add(st, 'sleep', { secs: s }); t += s; }
        else { add(st, 'wait', { unknown: true }); anchor = st.line; t = 0; }
        pc++; break;
      }
      case 'wait': {
        const d = timerWait(st.expr);
        if (d !== null) { add(st, 'wait', { secs: d }); t += d; }
        else {
          const now = tryEv(st.expr);
          if (!(now.ok && toBool(now.v))) { add(st, 'wait', { unknown: true }); anchor = st.line; t = 0; }
        }
        pc++; break;
      }
      case 'print': case 'show': case 'log': { const r = tryEv(st.expr); add(st, st.op, { value: r.ok ? toStr(plain(r.v)) : null }); pc++; break; }
      case 'start': case 'stop': case 'reset': {
        const r = tryEv(st.expr), n = r.ok ? cleanName(toStr(r.v)) : '';
        if (n && isTimer(n)) {
          const tm = timer(n);
          if (st.op === 'reset') { const rv = store.getProp(n, 'resetvalue'); tm.base = rv?.s ?? 0; tm.startT = t; tm.anchor = anchor; }
          else { freeze(tm); tm.running = st.op === 'start'; }
        }
        if (n && cleanName(n).toLowerCase() === cleanName(name).toLowerCase() && st.op === 'stop') { add(st, 'stop'); pc = stmts.length; break; }
        add(st, st.op); pc++; break;
      }
      default: pc++;
    }
  }
  return {
    name, rows, note: stopped,
    end: { at: Math.round(t), after: anchor },
  };
}

export const fmtAt = (s, after) => fmtTime(s) + (after ? ` after line ${after}` : '');
