// Writes vAPI values to a SQLite database file (built into Node.js, nothing to install).
// Each one has a log trigger (config "log": { mode, every, interval, at, script }):
//   none      never
//   ondemand  only by a script "log" line, the API or the Log now button
//   script    "On demand only": when the script named in "script" starts, and never at any other time
//   once      one time after the server starts (or when armed again)
//   ms | seconds | minutes | hours | days   every N (whole number "every") of that unit
//   hms       every "interval" given as 00:00:00
// The time modes can have a clock time "at" (like "12 AM" or "18:30"): the writes then line up with that
// time of day, e.g. every 1 day at 12 AM, or every 6 hours at 1 AM (1 AM, 7 AM, 1 PM, 7 PM).
import { clock } from './simclock.js';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { toNum, toStr, plain, parseTime, parseClock } from './values.js';
import { cleanName, isApiVar } from './store.js';

export const LOG_MODES = ['none', 'ondemand', 'script', 'once', 'ms', 'seconds', 'minutes', 'hours', 'days', 'hms'];
const UNIT_MS = { ms: 1, seconds: 1000, minutes: 60_000, hours: 3600_000, days: 86_400_000 };
const MIN_MS = 100;                    // fastest interval
const DAY = 86_400_000;

// Interval in ms for a log setting, or 0 when it is not a time mode / not valid
export function intervalMs(lg) {
  if (!lg) return 0;
  if (lg.mode === 'hms') { const s = parseTime(lg.interval ?? ''); return s > 0 ? Math.max(MIN_MS, s * 1000) : 0; }
  if (!(lg.mode in UNIT_MS)) return 0;
  const n = Math.max(1, Math.round(toNum(lg.every ?? 1)));
  return Math.max(MIN_MS, n * UNIT_MS[lg.mode]);
}

// Next write time after "now" for a time mode with a clock time "at"
export function nextAt(lg, now = Date.now()) {
  const iv = intervalMs(lg), at = parseClock(lg.at);
  if (!iv || at === null) return null;
  const d = new Date(now); d.setHours(0, 0, 0, 0);
  const anchor = new Date(d.getTime() + at * 1000);
  if (iv % DAY === 0) {                                  // whole days: step by calendar days so daylight saving does not shift it
    const days = iv / DAY, t = new Date(anchor);
    while (t.getTime() <= now) t.setDate(t.getDate() + days);
    return t.getTime();
  }
  const k = Math.floor((now - anchor.getTime()) / iv) + 1;
  return anchor.getTime() + k * iv;
}

export class Logger {
  constructor(store, dbFile) {
    this.store = store;
    fs.mkdirSync(path.dirname(dbFile), { recursive: true });
    this.db = new DatabaseSync(dbFile);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS samples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts INTEGER NOT NULL,          -- epoch milliseconds
        name TEXT NOT NULL,
        value TEXT,                   -- value as text (always filled)
        num REAL,                     -- value as number when it is numeric (for graphs)
        reason TEXT                   -- interval | once | ondemand | script | api | start:<script>
      );
      CREATE INDEX IF NOT EXISTS ix_samples_name_ts ON samples(name, ts);`);
    this.ins = this.db.prepare('INSERT INTO samples (ts, name, value, num, reason) VALUES (?, ?, ?, ?, ?)');
    this.last = new Map();     // name -> last interval write time
    this.next = new Map();     // name -> next write time (clock-time "at" schedules)
    this.armed = new Set();    // "once" variables waiting to be written
    for (const el of this.logged()) if (el.log?.mode === 'once') this.armed.add(el.name);
    store.on('config', () => {
      this.next.clear();
      for (const el of this.logged()) if (el.log?.mode === 'once' && !this.last.has(el.name)) this.armed.add(el.name);
    });
    this.timer = setInterval(() => this.tick(), 50);
  }

  logged() { return this.store.list().filter(isApiVar); }

  write(name, reason) {
    const v = plain(this.store.getProp(name, 'value'));
    const n = typeof v === 'number' ? v : typeof v === 'boolean' ? (v ? 1 : 0) : (Number.isFinite(+v) && String(v).trim() !== '' ? +v : null);
    this.ins.run(Date.now(), name, toStr(v), n, clock.active ? 'sim ' + reason : reason);   // simulated brews are marked in the log
  }

  logNow(name, reason = 'ondemand') {
    name = cleanName(name);
    const el = this.store.get(name);
    if (!isApiVar(el)) throw new Error(`log: "${name}" is not a vAPI (only those go to the database)`);
    this.write(name, reason);
  }

  arm(name) { this.armed.add(cleanName(name)); }

  // "On demand only": a script just started -> write every variable that names it
  scriptStarted(script) {
    script = cleanName(script);
    for (const el of this.logged()) {
      if (el.log?.mode === 'script' && cleanName(el.log.script) === script) {
        try { this.write(el.name, 'start:' + script); } catch { /* removed */ }
      }
    }
  }

  tick() {
    const now = Date.now();
    for (const el of this.logged()) {
      const lg = el.log; if (!lg || !lg.mode || lg.mode === 'none' || lg.mode === 'ondemand' || lg.mode === 'script') continue;
      try {
        if (lg.mode === 'once') {
          if (this.armed.has(el.name)) { this.write(el.name, 'once'); this.armed.delete(el.name); this.last.set(el.name, now); }
          continue;
        }
        if (lg.at) {
          let due = this.next.get(el.name);
          if (due === undefined) { due = nextAt(lg, now); this.next.set(el.name, due); }
          if (due !== null && now >= due) { this.write(el.name, 'interval'); this.last.set(el.name, now); this.next.set(el.name, nextAt(lg, now)); }
          continue;
        }
        const every = intervalMs(lg); if (!every) continue;
        const last = this.last.get(el.name) ?? 0;
        if (now - last >= every) { this.write(el.name, 'interval'); this.last.set(el.name, last && now - last < every * 2 ? last + every : now); }
      } catch (e) { /* element removed mid-tick */ }
    }
  }

  query({ name, from, to, limit = 1000 } = {}) {
    const where = [], args = [];
    if (name) { where.push('name = ?'); args.push(name); }
    if (from) { where.push('ts >= ?'); args.push(Number(from)); }
    if (to) { where.push('ts <= ?'); args.push(Number(to)); }
    const sql = `SELECT ts, name, value, num, reason FROM samples ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ts DESC LIMIT ?`;
    args.push(Math.min(Number(limit) || 1000, 100000));
    return this.db.prepare(sql).all(...args);
  }

  names() { return this.db.prepare('SELECT name, COUNT(*) AS count, MAX(ts) AS lastTs FROM samples GROUP BY name ORDER BY name').all(); }

  close() { clearInterval(this.timer); this.db.close(); }
}
