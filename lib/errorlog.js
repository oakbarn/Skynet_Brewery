// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Process Error Log and the Fix before next Brew Day list (Rule 10.13, Panel Updates entry 55). OakBarn Brewery, 2026-11-23:
// "Maybe a Log with exact location in a Process with Line mumbers and a way for a user to keep a log of issue that need to be fixed
// before the next bre day"; "I think just and error log with the line # of the error, what the error was and a way to fix it if
// evident"; "Do a combination of A and C.  Log it, and if it was fixed, the fix."
//
// Every Process error is written here by itself: the time, the Process, the line number, the line's own text, what the error was and,
// when the fix is evident, how to fix it (public/errorfix.js). The same error again on the same line (a loop) is one entry with a
// count. A person can add an issue of their own. Each entry stays open (it is on the Fix before next Brew Day list) until it is fixed:
// a Check with no error (lib/checkrun.js) or a person's ✔ Fixed. The fix is kept with it: the line as it was and as it is now when
// the Process was saved with that line changed, and the person's note. Kept in data/errorlog.json on the Brain, so a restart keeps it.
// Open entries stay until fixed or deleted; fixed ones are kept 90 days. At most 500 entries (the oldest fixed ones go first).
import fs from 'node:fs';
import path from 'node:path';
import { fixHint } from '../public/errorfix.js';

export const ERRORLOG_FILE = 'errorlog.json';
export const KEEP_FIXED_DAYS = 90;
export const MAX_ENTRIES = 500;
const MAX_VARS = 200;

export class ErrorLog {
  constructor(dir, now = () => Date.now()) {
    this.file = dir ? path.join(dir, ERRORLOG_FILE) : null; this.now = now;
    this.items = [];
    if (this.file) try { const j = JSON.parse(fs.readFileSync(this.file, 'utf8')); if (Array.isArray(j.items)) this.items = j.items; } catch { /* none yet */ }
    this.next = this.items.reduce((m, e) => Math.max(m, Number(e.id) || 0), 0) + 1;
  }
  _save() {
    const cut = this.now() - KEEP_FIXED_DAYS * 86400000;
    this.items = this.items.filter(e => e.status !== 'fixed' || (e.fixedAt ?? 0) >= cut);
    while (this.items.length > MAX_ENTRIES) {
      const i = this.items.findIndex(e => e.status === 'fixed');
      this.items.splice(i >= 0 ? i : 0, 1);
    }
    if (this.file) try { fs.mkdirSync(path.dirname(this.file), { recursive: true }); fs.writeFileSync(this.file, JSON.stringify({ items: this.items }, null, 1)); } catch { /* read-only folder */ }
  }
  list() { return [...this.items].sort((a, b) => (a.status === 'open' ? 0 : 1) - (b.status === 'open' ? 0 : 1) || (b.lastAt ?? b.at) - (a.lastAt ?? a.at)); }
  get(id) { return this.items.find(e => e.id === Number(id)); }
  openCount() { return this.items.filter(e => e.status === 'open').length; }

  // a Process error: { process, line, msg, lineText, vars: [[name, {type,val,precision}]], changed, notStarted }
  addError(e) {
    const process = String(e.process ?? ''), line = Number(e.line) || 0, msg = String(e.msg ?? '').slice(0, 500);
    const t = this.now(), lineText = String(e.lineText ?? '').slice(0, 300);
    const same = this.items.find(x => x.kind === 'error' && x.status === 'open' && x.process === process && x.line === line && x.msg === msg);
    if (same) {
      same.count = (same.count ?? 1) + 1; same.lastAt = t; same.lineText = lineText || same.lineText;
      if (e.vars) same.vars = e.vars.slice(0, MAX_VARS);
      same.changed = !!e.changed;
      this._save(); return same;
    }
    const item = { id: this.next++, kind: 'error', status: 'open', at: t, lastAt: t, count: 1, process, line, lineText, msg,
      fix: fixHint(msg), notStarted: !!e.notStarted, widget: !!e.widget, changed: !!e.changed, vars: (e.vars ?? []).slice(0, MAX_VARS) };
    this.items.push(item); this._save(); return item;
  }
  // a person's own issue for the Fix before next Brew Day list
  addIssue({ text, by = '', tab = '', process = '', line = 0 } = {}) {
    const words = String(text ?? '').trim().slice(0, 1000);
    if (!words) throw new Error('Type the issue first');
    const t = this.now();
    const item = { id: this.next++, kind: 'issue', status: 'open', at: t, lastAt: t, count: 1, text: words, by: String(by), tab: String(tab ?? ''),
      process: String(process ?? ''), line: Number(line) || 0 };
    this.items.push(item); this._save(); return item;
  }
  fixed(id, { by = '', note = '', check = null } = {}) {
    const e = this.get(id); if (!e) throw new Error('That entry is gone');
    e.status = 'fixed'; e.fixedAt = this.now(); e.fixedBy = String(by); if (note) e.note = String(note).slice(0, 1000);
    if (check) e.check = check;
    this._save(); return e;
  }
  reopen(id) { const e = this.get(id); if (!e) throw new Error('That entry is gone'); e.status = 'open'; delete e.fixedAt; delete e.fixedBy; this._save(); return e; }
  remove(id) { const n = this.items.length; this.items = this.items.filter(e => e.id !== Number(id)); if (this.items.length !== n) this._save(); return this.items.length !== n; }
  setCheck(id, check) { const e = this.get(id); if (e) { e.check = check; this._save(); } return e; }

  // a Process was saved: an open error whose line now reads differently keeps the change (the fix): before and after
  saved(process, text) {
    const lines = String(text ?? '').replace(/^﻿/, '').split(/\r?\n/);
    let any = false;
    for (const e of this.items) {
      if (e.kind !== 'error' || e.status !== 'open' || e.process !== process || !e.line) continue;
      const now = (lines[e.line - 1] ?? '').trim(), was = String(e.lineText ?? '').trim();
      if (now === was) continue;
      e.change = { at: this.now(), before: e.change?.before ?? was, after: now };
      any = true;
    }
    if (any) this._save();
    return any;
  }
}

// the line an error points at, in the Process as it is now: the line with the same text nearest to where it was (lines above may
// have been added or taken out), else the same line number
export function lineNow(lines, line, text) {
  const want = String(text ?? '').trim();
  if (want && (lines[line - 1] ?? '').trim() !== want) {
    let best = -1;
    for (let i = 0; i < lines.length; i++) if (lines[i].trim() === want && (best < 0 || Math.abs(i + 1 - line) < Math.abs(best - line))) best = i + 1;
    if (best > 0) return best;
  }
  return Math.min(Math.max(1, line || 1), Math.max(1, lines.length));
}
