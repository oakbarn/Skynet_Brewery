// 🔍 Check (Fritz, 2026-10-28): run a Process in a checking mode to find its mistakes before Brew Day.
// First every line is read for spelling and names (Engine.check). Then the Process is really run, line by line, by the
// engine's own code, but on a scratch copy of every value: nothing is switched, no board is told anything, nothing is
// saved, and the Process is not started. Every sleep and every wait takes no time at all (a pretend clock moves on
// instead), so a three hour brew is checked in a moment. Each problem comes back with where it is, the code on that
// line and a suggested fix, which the Process editor shows in its Error dialog (public/app.js).
import { Engine, compile, KEYWORDS } from './engine.js';
import { DateVal, toBool, toNum, toStr, plain } from './values.js';
import { cleanName, attrsOf, mainProp } from './store.js';

const MAX_STEPS = 20000, MAX_ROUNDS = 3, MAX_PROBLEMS = 30, MAX_MS = 3000;
const READINGS = ['temperature', 'analogIn', 'scale', 'flowMeter'];

// ---------------- the scratch copy of the panel ----------------
// It reads the panel's Devices, Widgets and Schema, but has its own values. It tells nobody about a change (the boards,
// MQTT, the screens and the log listen for changes on the real panel only) and never writes a file.
function sandboxOf(store, warns, at) {
  const sb = Object.create(store);
  sb.rt = new Map([...store.rt].map(([k, r]) => [k, { ...r }]));
  sb.warned = new Set(); sb._pulses = new Map(); sb._soundSeq = store._soundSeq ?? 0;
  sb.emit = (ev, msg) => { if (ev === 'warn') warns.push({ line: at.line, text: String(msg) }); return true; };
  sb.on = sb.off = sb.once = () => sb;
  sb._schedulePersist = sb.persistNow = sb.writeConfig = () => { };
  sb._writeLong = () => { };
  return sb;
}

class Done extends Error { }

// The engine, running on the scratch copy, with every wait and every start of another Process turned into a note
class CheckEngine extends Engine {
  constructor(real, store, out) {
    super(store, real.dir, { logNow() { } });
    this.real = real; this.out = out; this.vt = 0; this.t0 = Date.now();
    this.running = new Map(real.running);      // what runs now on the panel (my_Process.running reads it)
  }
  print(script, text) { if (this.out.printed.length < 200) this.out.printed.push(toStr(text)); }
  note(line, text) { if (this.out.notes.length < 100) this.out.notes.push({ line, text }); }
  ev(inst, e, line) { return e.k === 'now' ? new DateVal(this.t0 + this.vt) : super.ev(inst, e, line); }
  // the pretend clock moves on: timers count, Hop Alarms go off
  pass(ms) { if (ms > 0) { this.vt += ms; this.store.tickTimers(ms / 1000); } }
  async _manualValve(inst, el, open, L) {
    if (!!this.store.getProp(el.name, 'state') === open) return;
    this.note(L, `${el.name} is a Manual valve: the Process would wait here until someone ${open ? 'opens' : 'closes'} it and presses Done. The check pretends it was done.`);
    this._set(el.name, 'state', open, L);
  }
  _timerRefs(e, acc = []) {
    if (!e || typeof e !== 'object') return acc;
    if ((e.k === 'prop' || e.k === 'idprop') && this.store.get(e.name)?.type === 'timer') acc.push(e.name);
    for (const k of ['l', 'r', 'e']) this._timerRefs(e[k], acc);
    return acc;
  }
  async _exec(inst, st, pc) {
    const L = st.line;
    switch (st.op) {
      case 'sleep': {
        const ms = toNum(this.ev(inst, st.expr, L));
        if (!(ms >= 0)) throw Object.assign(new Error(`sleep needs a number of milliseconds of 0 or more (this one is ${toStr(plain(this.ev(inst, st.expr, L)))})`), { line: L });
        this.pass(ms);
        return pc + 1;
      }
      case 'wait': {
        if (toBool(this.ev(inst, st.expr, L))) return pc + 1;
        const ms = this._timerWaitMs(st.expr);
        if (ms > 0) { this.pass(ms); if (toBool(this.ev(inst, st.expr, L))) return pc + 1; }
        const stopped = [...new Set(this._timerRefs(st.expr))].filter(n => !this.store.getProp(n, 'running'));
        if (stopped.length) {
          this.out.problem({ line: L, kind: 'warning', msg: `This wait may never end: the timer ${stopped.join(' and ')} is not running when the Process gets here, so its time does not change.`,
            fix: { text: `Start the timer first. Put "start ${stopped[0]}" on the line above (or check that it was started earlier).`, code: `start ${stopped[0]}`, mode: 'insert', at: L } });
          return pc + 1;
        }
        const names = []; const walk = x => { if (!x || typeof x !== 'object') return; if (x.name) names.push(x.name); ['l', 'r', 'e'].forEach(k => walk(x[k])); }; walk(st.expr);
        const reading = names.some(n => READINGS.includes(this.store.get(n)?.type));
        this.note(L, reading ? 'Waits on a reading (a temperature, level, weight or flow). The check pretends it was reached.'
          : 'Waits on a button, a switch or a value that a person or another Process changes. The check pretends it happened.');
        return pc + 1;
      }
      case 'start': case 'stop': case 'reset': {
        const n = cleanName(toStr(this.ev(inst, st.expr, L)));
        if (st.op === 'stop' && n === inst.name) throw new Done();
        if (st.op !== 'reset' && this.exists(n) && !this.store.has(n)) {
          this.note(L, `${st.op === 'start' ? 'Starts' : 'Stops'} the Process ${n} (not done in a check; check ${n} on its own).`);
          return pc + 1;
        }
        return super._exec(inst, st, pc);
      }
      case 'restart': {
        const n = st.expr ? cleanName(toStr(this.ev(inst, st.expr, L))) : inst.name;
        if (n === inst.name) { this.note(L, 'Starts this Process over: the check ends here.'); throw new Done(); }
        if (!this.exists(n)) throw Object.assign(new Error(`restart: no process named "${n}"`), { line: L });
        this.note(L, `Restarts the Process ${n} (not done in a check).`);
        return pc + 1;
      }
      case 'lock': this.note(L, `${st.on ? 'Locks' : 'Unlocks'} the Equipment Profile (not done in a check).`); return pc + 1;
      case 'log': {
        const n = toStr(this.ev(inst, st.expr, L));
        if (!this.store.has(n)) throw Object.assign(new Error(`log: no vAPI or variable named "${n}"`), { line: L });
        return pc + 1;
      }
      case 'show': {
        const tab = toStr(this.ev(inst, st.expr, L));
        const tabs = (this.store.config?.workspaces ?? []).map(w => w.name);
        if (tabs.length && !tabs.some(t => t.toLowerCase() === tab.trim().toLowerCase())) throw Object.assign(new Error(`show: no Tab named "${tab}"`), { line: L });
        return pc + 1;
      }
    }
    return super._exec(inst, st, pc);
  }
}

// ---------------- suggested fixes ----------------
function dist(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]; d[0] = i;
    for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t; }
  }
  return d[b.length];
}
// the name in the list closest to what was typed, when it is close enough to be a typing slip
export function closest(word, list) {
  let best = null, bd = Infinity;
  for (const c of list) {
    if (!c || c === word) continue;
    const k = dist(word, c);
    if (k < bd) { bd = k; best = c; }
  }
  const most = word.length <= 3 ? 1 : word.length <= 6 ? 2 : Math.floor(word.length / 3);
  return best && bd <= most && bd < word.length ? best : null;
}
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// replace a whole word in a line (not inside a longer name or a "string")
function swapWord(line, from, to) {
  const re = new RegExp(`(^|[^A-Za-z0-9_~])${esc(from)}(?![A-Za-z0-9_~])`);
  return re.test(line) ? line.replace(re, (m, a) => a + to) : null;
}

// Fill in problem.fix: { text (what to do, in plain words), code (the line rewritten, or null), mode, at }
export function suggest(p, ctx) {
  const { src, names, procs, labels, declared, store } = ctx;
  const code = src[p.line - 1] ?? '', t = code.trim(), indent = /^\s*/.exec(code)[0];
  const keep = (text) => ({ text, code, mode: 'replace', at: p.line });
  const swap = (from, to, why) => { const c = swapWord(code, from, to); return c ? { text: why, code: c, mode: 'replace', at: p.line } : null; };
  let m;
  if ((m = /^Unknown name (\S+): no variable/.exec(p.msg)) || (m = /^Unknown variable (\S+)/.exec(p.msg)) || (m = /^No element named "(.+)"$/.exec(p.msg)) || (m = /^Element not found: "(.+)"$/.exec(p.msg))) {
    const w = m[1], near = closest(w, [...names, ...declared]);
    if (near) return swap(w, near, `"${w}" is not a name the panel knows. Did you mean ${near}? (Names must be spelled exactly, with _ instead of spaces.)`) ?? keep(`Did you mean ${near}?`);
    if (/^v[VSBT]_/i.test(w) || /^[a-z]/.test(w)) return { text: `"${w}" is not a Device, a Widget or a variable. If it is meant to be a variable of this Process, make it first with new on a line above (value, string, bool or time).`, code: `${indent}new value ${w}`, mode: 'insert', at: p.line };
    return keep(`"${w}" is not a Device, a Widget or a variable. Check the spelling against the Devices page, or make it on the 🔨 Build Tab first.`);
  }
  if ((m = /^Variable (\S+) used before "new"/.exec(p.msg))) return { text: `Make the variable ${m[1]} with new before it is used. Put this on the line above (use string, bool or time instead of value if it holds words, true/false or a time).`, code: `${indent}new value ${m[1]}`, mode: 'insert', at: p.line };
  if ((m = /^"(.+)" has no property "(.+)"$/.exec(p.msg))) {
    const el = store.get(m[1]), list = [...attrsOf(el), ...(mainProp(el) ? [mainProp(el)] : [])];
    const near = closest(m[2], list);
    if (near) return swap(m[2], near, `${m[1]} has no attribute .${m[2]}. Did you mean .${near}?`) ?? keep(`Did you mean .${near}?`);
    return keep(`${m[1]} has no attribute .${m[2]}. It has: ${list.join(', ')}.`);
  }
  if ((m = /^goto: no label \[(.+)\]$/.exec(p.msg))) {
    const near = closest(m[1], labels);
    if (near) return { text: `There is no label [${m[1]}]. Did you mean [${near}]?`, code: code.replace(m[1], near), mode: 'replace', at: p.line };
    return { text: `There is no label [${m[1]}] for goto to go to. Put the label on its own line where the Process should carry on.`, code: `[${m[1]}]`, mode: 'insert', at: p.line + 1 };
  }
  if ((m = /^(?:restart: no process named|No process or timer\/alarm named) "(.+)"$/.exec(p.msg))) {
    const near = closest(m[1], [...procs, ...names]);
    if (near) return swap(m[1], near, `There is no Process or timer called ${m[1]}. Did you mean ${near}?`) ?? keep(`Did you mean ${near}?`);
    return keep(`There is no Process or timer called ${m[1]}. Check the name in the Process list.`);
  }
  if ((m = /^play: no alarm or sound player named "(.+)"$/.exec(p.msg))) {
    const near = closest(m[1], names.filter(n => ['alarm', 'soundPlayer'].includes(store.get(n)?.type)));
    return near ? swap(m[1], near, `There is no alarm or sound player called ${m[1]}. Did you mean ${near}?`) ?? keep(`Did you mean ${near}?`) : keep(`play needs an alarm or the SoundPlayer. Make the alarm first, or use SoundPlayer.`);
  }
  if (/^Missing closing quote/.test(p.msg)) return { text: 'A piece of text in " " has no closing ". Add one where the text ends.', code: code.replace(/\s*$/, '"'), mode: 'replace', at: p.line };
  if (/^Missing \)/.test(p.msg)) return { text: 'There is a ( with no ). Add the ) where it belongs.', code: code.replace(/\s*$/, ')'), mode: 'replace', at: p.line };
  if ((m = /^Unexpected character "(.)"/.exec(p.msg))) {
    if (/[“”„″]/.test(m[1])) return { text: 'This line has curly quotes (“ ”), from a word processor or a phone. Processes need plain straight quotes (").', code: code.replace(/[“”„″]/g, '"'), mode: 'replace', at: p.line };
    if (/[‘’]/.test(m[1])) return { text: 'This line has a curly apostrophe (’). Use a plain one, or none.', code: code.replace(/[‘’]/g, "'"), mode: 'replace', at: p.line };
    return { text: `The character ${m[1]} can't be used here. Take it out (or put the text in " ").`, code: code.split(m[1]).join(''), mode: 'replace', at: p.line };
  }
  if (p.msg === 'if has no endif') {
    const last = src.length;
    return { text: 'Every if needs an endif where its lines end. Put endif after the last line that belongs to this if. The suggestion puts it at the end of the Process; change the line number if it belongs higher up.', code: `${indent}endif`, mode: 'insert', at: last + 1 };
  }
  if (/^(endif|elseif|else) without if$/.test(p.msg) || p.msg === '} without {') return { text: `This line has no if to belong to. Delete it (leave the box empty and press Replace line), or add the missing if above.`, code: '', mode: 'replace', at: p.line };
  if (/after else$/.test(p.msg)) return keep('An else must be the last part of an if. Move this line above the else, or make it a new if.');
  if (p.msg === '{ has no }') return { text: 'This { is never closed. Put } after the last line that belongs to it (the suggestion puts it at the end).', code: '}', mode: 'insert', at: src.length + 1 };
  if ((m = /^Label \[(.+)\] is used twice/.exec(p.msg))) return { text: `Two lines are called [${m[1]}]; goto would not know which one. Give this one another name.`, code: code.replace(`[${m[1]}]`, `[${m[1]}_2]`), mode: 'replace', at: p.line };
  if ((m = /^Do not understand: /.exec(p.msg))) {
    const w = /^[A-Za-z_]+/.exec(t)?.[0];
    const near = w && closest(w.toLowerCase(), [...KEYWORDS]);
    if (near && w.toLowerCase() !== near) return swap(w, near, `"${w}" is not a command. Did you mean ${near}?`);
    if (w && closest(w, names)) return swap(w, closest(w, names), `"${w}" is not a name the panel knows. Did you mean ${closest(w, names)}? A line must set something (name = value) or start with a command (if, wait, sleep, start ...).`);
    return keep('A line must set something (name = value) or start with a command such as if, wait, sleep, start, stop, print or goto. Try 💡 Suggest (Ctrl+Space) to pick what can come next.');
  }
  if ((m = /^(.+)\.running is read only/.exec(p.msg))) {
    const on = /=\s*(true|on|1)\b/i.test(t);
    return { text: `A Process's .running only tells whether it runs. Start or stop it with start / stop instead.`, code: `${indent}${on ? 'start' : 'stop'} ${m[1]}`, mode: 'replace', at: p.line };
  }
  if (/is an input from .* and cannot be set/.test(p.msg)) return { text: 'This Device is an input (a sensor or a button on a board): the board sets it, a Process can only read it. Delete the line, or set an output or a variable instead.', code: '', mode: 'replace', at: p.line };
  if (/Division by zero|divide by zero/i.test(p.msg)) return keep('Something is divided by 0 here. Check the value after the /; an if around the line can skip it when that value is 0.');
  if (/is read only|cannot be set/.test(p.msg)) return keep('This attribute can only be read. Delete the line or set something else.');
  if (/^sleep needs a number/.test(p.msg)) return { text: 'sleep takes milliseconds: 1000 is one second, 60000 is one minute.', code: code.replace(/sleep\s+.*/i, 'sleep 1000'), mode: 'replace', at: p.line };
  if (/^(Expression is incomplete|Missing expression)/.test(p.msg)) return keep('Something is missing at the end of this line (a value after = or after a compare sign like >=). Finish the line.');
  if ((m = /^Unexpected "(.+)"$/.exec(p.msg))) return keep(`"${m[1]}" does not fit here. Check for a missing space, a missing compare sign (==, >=) or a missing " around text.`);
  if ((m = /^show: no Tab named "(.+)"$/.exec(p.msg))) {
    const tabs = (store.config?.workspaces ?? []).map(w => w.name), near = closest(m[1], tabs);
    return near ? { text: `There is no Tab called ${m[1]}. Did you mean ${near}?`, code: code.replace(m[1], near), mode: 'replace', at: p.line } : keep(`There is no Tab called ${m[1]}. The Tabs are: ${tabs.join(', ')}.`);
  }
  return keep('Read the message above, then change the line in the box below.');
}

// ---------------- the check ----------------
export async function checkRun(engine, name, text) {
  name = cleanName(name) || 'Process';
  text = String(text ?? '').replace(/^﻿/, '');
  const src = text.split(/\r?\n/), store = engine.store;
  const prog = compile(text);
  const declared = [...new Set(prog.stmts.filter(s => s.op === 'new').map(s => s.name))];
  const ctx = { src, store, declared, labels: [...prog.labels.keys()], procs: engine.names(), names: [...store.els.keys(), ...store.texts.keys()] };
  const problems = [], notes = [], printed = [], warns = [];
  const seen = new Set();
  const out = {
    notes, printed,
    problem(p) {
      const k = p.line + '|' + p.msg;
      if (seen.has(k) || problems.length >= MAX_PROBLEMS) return;
      seen.add(k);
      problems.push({ kind: 'error', when: 'run', ...p, code: src[p.line - 1] ?? '', fix: p.fix ?? suggest(p, ctx) });
    },
  };
  // 1. every line, for spelling and names
  const chk = engine.check(text);
  // a Process that stops or restarts itself before it is first saved: its own name is not a file yet
  chk.errors = chk.errors.filter(e => !(/^(restart: no process named|No process or timer\/alarm named) "/.test(e.msg) && e.msg.endsWith(`"${name}"`)));
  for (const e of chk.errors) out.problem({ line: e.line, msg: e.msg, when: 'spelling' });
  for (const w of chk.offBrain ?? []) out.problem({ line: w.line, kind: 'warning', when: 'spelling', msg: `The file ${w.path} ${w.why}, so phones and other computers can't reach it.`,
    fix: { text: 'Copy the file to the Brain with ☰ Menu > File Move, then use its path in media/ here (the 🖼 Picture button puts a path in for you).', code: src[w.line - 1], mode: 'replace', at: w.line } });
  const result = { name, problems, notes, printed, ran: false, lines: 0, reached: [], unreached: [], time: 0, stopped: '' };
  const codeLines = [...new Set(prog.stmts.filter(s => !['label', 'endif', 'else'].includes(s.op)).map(s => s.line))];
  result.lines = codeLines.length;
  if (chk.errors.length) { result.stopped = 'The Process was not run in the check: fix the spelling and name problems first, then press 🔍 Check again.'; return finish(); }

  // 2. run it on the scratch copy, with no waiting
  const at = { line: 0 };
  const sb = sandboxOf(store, warns, at);
  const ce = new CheckEngine(engine, sb, out);
  const inst = { name, prog, vars: new Map(), state: 'running', line: 0, startedAt: Date.now(), by: 'check', stopFlag: false };
  const stmts = prog.stmts, rounds = new Map(), reached = new Set();
  let pc = 0, steps = 0; const t0 = Date.now();
  result.ran = true;
  while (pc < stmts.length) {
    if (++steps > MAX_STEPS || Date.now() - t0 > MAX_MS) { result.stopped = `The check stopped after ${steps - 1} steps: the Process keeps going round. That is fine for a Looper.`; break; }
    const st = stmts[pc];
    if (st.op === 'goto') {
      const to = prog.labels.get(st.label) + 1;
      if (to <= pc) {
        const n = (rounds.get(pc) ?? 0) + 1; rounds.set(pc, n);
        if (n > MAX_ROUNDS) { result.stopped = `Line ${st.line} goes back to [${st.label}] again and again; the check went round ${MAX_ROUNDS} times and stopped there. That is fine for a Process that is meant to loop.`; break; }
      }
    }
    reached.add(st.line); inst.line = at.line = st.line;
    try { pc = await ce._exec(inst, st, pc); }
    catch (e) {
      if (e instanceof Done) break;
      out.problem({ line: e.line ?? st.line, msg: e.message, when: 'run' });
      pc++;                                    // carry on with the next line, to find more problems in one check
    }
  }
  // name.colr = 3 is kept but does nothing: a slip worth a warning in a check
  const told = new Set();
  for (const w of warns) {
    if (told.has(w.line + w.text)) continue; told.add(w.line + w.text);
    const m = /^"(.+)": property "(.+)" is not used by/.exec(w.text);
    if (m) out.problem({ line: w.line, kind: 'warning', msg: `${m[1]} has no attribute .${m[2]}: setting it does nothing.`, fix: suggest({ line: w.line, msg: `"${m[1]}" has no property "${m[2]}"` }, ctx) });
    else notes.push(w);
  }
  result.time = Math.round(ce.vt / 1000);
  result.reached = codeLines.filter(l => reached.has(l));
  result.unreached = codeLines.filter(l => !reached.has(l));
  return finish();

  function finish() {
    problems.sort((a, b) => a.line - b.line || (a.kind === 'error' ? -1 : 1));
    result.unreachedText = ranges(result.unreached);
    return result;
  }
}

// [3,4,5,9] -> "3-5, 9"
function ranges(list) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    let j = i; while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
    out.push(i === j ? `${list[i]}` : `${list[i]}-${list[j]}`); i = j;
  }
  return out.join(', ');
}

