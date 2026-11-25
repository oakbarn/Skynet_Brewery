// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Error Log's 🧪 Check (Rule 10.13; OakBarn Brewery, 2026-11-23: "the Check button could be used to check it in a simulation mode
// just for the checking"; he picked "Error line to next wait or step" and "use the Pop up Override to run from just above the error").
//
// A Check runs the Process as it is saved now, in its own Engine on a check-only copy of the Brain: every Device, Widget and gGlobal is
// read as it is now, but nothing it sets reaches a board, the database, the screens or the saved Schema (the sets are kept in the
// copy and listed in the result). It starts just above the error (the statement before it, unless that is a wait or step), with the
// variables the Process had when the error happened, and stops at the next wait, sleep, step or ask after it (CHECK_STOPS), at the
// end, or at the error. ▶ Override goes on past that wait, like the Override pop-up does in a real run: the next Check starts just
// after it with the variables the last one ended with. A real brew that is running is never touched: it is another Engine.
import { Engine, compile } from './engine.js';
import { cleanName } from './store.js';
import { plain } from './values.js';
import { lineNow } from './errorlog.js';

export const CHECK_MS = 5000;      // a Check that takes longer (a Process it started that loops) is stopped
const NO_LOGGER = { logNow() { }, sendGroup() { }, startGroup() { }, stopGroup() { }, scriptStarted() { } };
const STOPS_AT_START = new Set(['wait', 'waitboil', 'sleep', 'step', 'ask', 'valves', 'onevalve', 'reading', 'askrecipe', 'lock', 'label']);

// the check-only copy of the Brain's store: reads go to the real one, sets and saves stay in the copy
export function checkStore(real) {
  const sets = new Map(), made = new Map();
  const key = (n, p) => cleanName(String(n)).toLowerCase() + '.' + String(p ?? 'value').toLowerCase();
  let config = null;
  const self = new Proxy(real, {
    get(t, k) {
      if (k === 'setProp') return (n, p, v) => { sets.set(key(n, p), { name: String(n), prop: String(p ?? 'value'), value: plain(v) }); return true; };
      if (k === 'getProp') return (n, p) => { const s = sets.get(key(n, p)); if (s) return s.value; if (made.has(cleanName(String(n)).toLowerCase())) return null; return t.getProp(n, p); };
      if (k === 'has') return n => made.has(cleanName(String(n)).toLowerCase()) || t.has(n);
      if (k === 'get') return n => t.get(n) ?? made.get(cleanName(String(n)).toLowerCase());
      if (k === 'addGlobal') return (n, kind) => { made.set(cleanName(String(n)).toLowerCase(), { name: cleanName(String(n)), type: 'gGlobal', kind }); return true; };
      if (k === 'writeConfig') return () => { };
      if (k === 'on' || k === 'off') return () => self;
      if (k === 'config') return config ??= structuredClone(t.config);      // a Process that changes the config changes only the copy
      if (k === 'checkSets') return [...sets.values()];
      const v = Reflect.get(t, k, t);
      return typeof v === 'function' ? v.bind(t) : v;
    },
  });
  return self;
}

// the statement to start from: just above the error line (the statement before it), unless that one is a wait, step or label
export function checkFrom(stmts, line) {
  let i = stmts.findIndex(st => st.line >= line && st.op !== 'endif');
  if (i < 0) return -1;
  const j = i - 1;
  if (j >= 0 && !STOPS_AT_START.has(stmts[j].op) && stmts[j].op !== 'endif' && stmts[j].line < stmts[i].line) i = j;
  return i;
}

// { store, dir, name, line, lineText, vars, after } -> { ok, error?: { line, msg }, from, reached?: { line, op }, prints, sets, vars }
// after: true starts just after line (▶ Override past the wait the last Check stopped at)
export async function runCheck({ store, dir, name, line, lineText = '', vars = [], after = false, ms = CHECK_MS }) {
  const proc = cleanName(String(name ?? ''));
  const eng = new Engine(checkStore(store), dir, NO_LOGGER);
  if (!eng.exists(proc)) return { ok: false, error: { line: 0, msg: `There is no Process named "${proc}" now` }, prints: [], sets: [] };
  const text = eng.read(proc), lines = text.split(/\r?\n/), prog = compile(text);
  const chk = eng.check(text);
  if (chk.errors.length) { const e = chk.errors[0]; return { ok: false, error: { line: e.line, msg: e.msg }, from: e.line, prints: [], sets: [], notStarted: true }; }
  const at = lineNow(lines, line, lineText);
  let i = after ? prog.stmts.findIndex(st => st.line > at && st.op !== 'endif') : checkFrom(prog.stmts, at);
  if (i < 0) return { ok: true, from: at, end: true, prints: [], sets: [], vars };
  const from = prog.stmts[i].line;
  const r = eng.start(proc, 'check', { line: from, vars }, { check: true });
  if (!r?.ok) return { ok: false, error: { line: r?.line ?? from, msg: r?.msg ?? 'did not start' }, from, prints: [], sets: [] };
  const inst = eng.running.get(proc);
  let timedOut = false;
  await Promise.race([inst.done, new Promise(res => setTimeout(() => { timedOut = true; res(); }, ms))]);
  eng.stopAll();
  if (timedOut) { inst.stopFlag = true; await Promise.race([inst.done, new Promise(res => setTimeout(res, 500))]); }
  const out = {
    from, prints: eng.console.filter(c => !/^Resumed at /.test(c.text)).map(c => `${c.script}: ${c.text}`).slice(-50), sets: eng.store.checkSets,
    vars: [...inst.vars].map(([n, v]) => [n, { type: v.type, val: plain(v.val), precision: v.precision ?? null }]),
  };
  if (inst.state === 'error') {
    const m = /^line (\d+): ([\s\S]*)$/.exec(inst.error ?? '');
    return { ...out, ok: false, error: { line: m ? Number(m[1]) : inst.line, msg: m ? m[2] : inst.error } };
  }
  if (timedOut) return { ...out, ok: false, error: { line: inst.line, msg: `still running after ${ms / 1000} seconds with no wait: a loop with no wait in it?` } };
  if (inst.check?.reached) return { ...out, ok: true, reached: { line: inst.check.reached.line, op: inst.check.reached.op } };
  return { ...out, ok: true, end: true };
}
