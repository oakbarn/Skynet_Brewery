// The brew database: a SQLite file on the Brain (built into Node.js, nothing to install, free, SQL).
// Any Device or Widget can send readings to it (Fritz, 2026-10-30). Its .database setting (config "database":
// { frequency, every, interval, at, process, attribute }) says when:
//   none      never
//   ondemand  only by a Process "send_db" line, the API or the Log now button
//   change    every time the value changes (at most 10 times a second, the last change is never lost)
//   process   when the Process named in "process" starts, and never at any other time
//   once      one time after the server starts (or when armed again)
//   datetime  one time, at the date and time in "at" (2026-11-01T06:00)
//   ms | seconds | minutes | hours | days   every N (whole number "every") of that unit
//   hms       every "interval" given as 00:00:00
// The time modes can have a clock time "at" (like "12 AM" or "18:30"): the writes then line up with that
// time of day, e.g. every 1 day at 12 AM, or every 6 hours at 1 AM (1 AM, 7 AM, 1 PM, 7 PM).
// "attribute" picks what is sent (its main value when empty: .value, .state, .active ...).
//
// Each reading is kept with its time and the item's hidden key (Fritz, 2026-10-30), so a query with today's name finds the
// readings it had under an older name too. The name at the time is kept beside it. The key never leaves the Brain: lists and
// CSV files show the item's name now (Rule 3.10).
import { clock } from './simclock.js';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { toNum, toStr, plain, parseTime, parseClock } from './values.js';
import { cleanName, mainProp } from './store.js';
import { KEY } from './keys.js';

export const LOG_MODES = ['none', 'ondemand', 'change', 'process', 'once', 'datetime', 'ms', 'seconds', 'minutes', 'hours', 'days', 'hms'];
const UNIT_MS = { ms: 1, seconds: 1000, minutes: 60_000, hours: 3600_000, days: 86_400_000 };
const MIN_MS = 100;                    // fastest interval, and the fastest "On value change"
const DAY = 86_400_000;
const PASSIVE = ['none', 'ondemand', 'process', 'change'];

export const dbOf = el => (el?.database?.frequency && el.database.frequency !== 'none') ? el.database : null;
const attrOf = el => String(el?.database?.attribute || mainProp(el) || 'value').toLowerCase();

// Interval in ms for a database setting, or 0 when it is not a time mode / not valid
export function intervalMs(lg) {
  if (!lg) return 0;
  const f = lg.frequency;
  if (f === 'hms') { const s = parseTime(lg.interval ?? ''); return s > 0 ? Math.max(MIN_MS, s * 1000) : 0; }
  if (!(f in UNIT_MS)) return 0;
  const n = Math.max(1, Math.round(toNum(lg.every ?? 1)));
  return Math.max(MIN_MS, n * UNIT_MS[f]);
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

// "At a date and time": 2026-11-01T06:00 (local time) -> epoch ms, or null
export function dateTimeMs(at) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(String(at ?? '').trim());
  if (!m) return null;
  const t = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0)).getTime();
  return Number.isFinite(t) ? t : null;
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
        name TEXT NOT NULL,           -- the item's name at the time
        value TEXT,                   -- value as text (always filled)
        num REAL,                     -- value as number when it is numeric (for graphs)
        reason TEXT                   -- interval | once | ondemand | change | datetime | api | start:<process>
      );
      CREATE INDEX IF NOT EXISTS ix_samples_name_ts ON samples(name, ts);`);
    // the hidden key (Fritz, 2026-10-30) and the attribute sent: older databases get the columns once
    const cols = new Set(this.db.prepare('PRAGMA table_info(samples)').all().map(c => c.name));
    if (!cols.has('key')) this.db.exec('ALTER TABLE samples ADD COLUMN key TEXT');
    if (!cols.has('attr')) this.db.exec('ALTER TABLE samples ADD COLUMN attr TEXT');
    this.db.exec('CREATE INDEX IF NOT EXISTS ix_samples_key_ts ON samples(key, ts)');
    this.ins = this.db.prepare('INSERT INTO samples (ts, name, value, num, reason, key, attr) VALUES (?, ?, ?, ?, ?, ?, ?)');
    this.last = new Map();     // name -> last interval write time
    this.next = new Map();     // name -> next write time (clock-time "at" schedules)
    this.armed = new Set();    // "once" items waiting to be written
    this.done = new Set();     // "datetime" writes already made (name + time)
    this.started = Date.now();
    this.changeAt = new Map(); // name -> last "On value change" write time
    this.pending = new Map();  // name -> timer for a change that came too soon after the last one
    this.giveKeys();
    for (const el of this.logged()) if (el.database.frequency === 'once') this.armed.add(el.name);
    store.on('config', () => {
      this.next.clear(); this.giveKeys();
      for (const el of this.logged()) if (el.database.frequency === 'once' && !this.last.has(el.name)) this.armed.add(el.name);
    });
    store.on('change', (name, prop) => this.changed(name, prop));
    this.timer = setInterval(() => this.tick(), 50);
  }

  // readings written before keys were kept get their item's key (by the name they were written under)
  giveKeys() {
    try {
      const up = this.db.prepare('UPDATE samples SET key = ? WHERE key IS NULL AND name = ?');
      for (const el of this.store.list()) if (el[KEY]) up.run(el[KEY], el.name);
    } catch { /* closed */ }
  }

  logged() { return this.store.list().filter(dbOf); }

  write(name, reason) {
    const el = this.store.get(name), attr = attrOf(el);
    const v = plain(this.store.getProp(name, attr));
    const n = typeof v === 'number' ? v : typeof v === 'boolean' ? (v ? 1 : 0) : (Number.isFinite(+v) && String(v).trim() !== '' ? +v : null);
    this.ins.run(Date.now(), el.name, toStr(v), n, clock.active ? 'sim ' + reason : reason, el[KEY] ?? null, attr);   // simulated brews are marked in the log
  }

  // Send it now (a Process send_db line, the API, Log now): any Device or Widget with a value
  logNow(name, reason = 'ondemand') {
    name = cleanName(name);
    const el = this.store.get(name);
    if (!el) throw new Error(`send_db: there is no "${name}"`);
    if (!mainProp(el) && !el.database?.attribute) throw new Error(`send_db: "${name}" has no value to send`);
    this.write(el.name, reason);
  }

  arm(name) { this.armed.add(cleanName(name)); }

  // "When a Process starts": a Process just started -> write every item that names it
  scriptStarted(script) {
    script = cleanName(script);
    for (const el of this.logged()) {
      if (el.database.frequency === 'process' && cleanName(el.database.process) === script) {
        try { this.write(el.name, 'start:' + script); } catch { /* removed */ }
      }
    }
  }

  // "On value change": at most one write per 100 ms; a change that comes sooner is written when the 100 ms are up
  changed(name, prop) {
    const el = this.store.get(name);
    if (dbOf(el)?.frequency !== 'change' || String(prop).toLowerCase() !== attrOf(el)) return;
    const now = Date.now(), wait = MIN_MS - (now - (this.changeAt.get(name) ?? 0));
    if (wait <= 0) { this.changeAt.set(name, now); try { this.write(name, 'change'); } catch { /* removed */ } return; }
    if (this.pending.has(name)) return;
    this.pending.set(name, setTimeout(() => {
      this.pending.delete(name); this.changeAt.set(name, Date.now());
      try { this.write(name, 'change'); } catch { /* removed */ }
    }, wait));
  }

  tick() {
    const now = Date.now();
    for (const el of this.logged()) {
      const lg = el.database; if (PASSIVE.includes(lg.frequency)) continue;
      try {
        if (lg.frequency === 'once') {
          if (this.armed.has(el.name)) { this.write(el.name, 'once'); this.armed.delete(el.name); this.last.set(el.name, now); }
          continue;
        }
        if (lg.frequency === 'datetime') {       // once, at that date and time (one that was already past when the Brain started is skipped)
          const t = dateTimeMs(lg.at), id = el.name + '@' + lg.at;
          if (t !== null && now >= t && t >= this.started && !this.done.has(id)) { this.done.add(id); this.write(el.name, 'datetime'); }
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
      } catch (e) { /* item removed mid-tick */ }
    }
  }

  // The item a name stands for now: its key (readings under any older name) and, for readings from before keys, the name
  _who(name) {
    const el = this.store.get(cleanName(name));
    return el?.[KEY] ? { sql: '(key = ? OR (key IS NULL AND name = ?))', args: [el[KEY], el.name] } : { sql: 'name = ?', args: [cleanName(name)] };
  }
  // rows out: the name is the item's name now, and the key stays on the Brain
  _out(rows) {
    return rows.map(({ key, ...r }) => ({ ...r, name: (key && this.store.byKey.get(key)) || r.name }));
  }

  query({ name, from, to, limit = 1000 } = {}) {
    const where = [], args = [];
    if (name) { const w = this._who(name); where.push(w.sql); args.push(...w.args); }
    if (from) { where.push('ts >= ?'); args.push(Number(from)); }
    if (to) { where.push('ts <= ?'); args.push(Number(to)); }
    const sql = `SELECT ts, name, value, num, reason, key FROM samples ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ts DESC LIMIT ?`;
    args.push(Math.min(Number(limit) || 1000, 100000));
    return this._out(this.db.prepare(sql).all(...args));
  }

  // Everything for a CSV file: oldest first, any number of names (none = all), up to 500,000 readings
  exportRows({ names = [], from, to } = {}) {
    const where = [], args = [];
    if (names.length) { const ws = names.map(n => this._who(n)); where.push('(' + ws.map(w => w.sql).join(' OR ') + ')'); for (const w of ws) args.push(...w.args); }
    if (from) { where.push('ts >= ?'); args.push(Number(from)); }
    if (to) { where.push('ts <= ?'); args.push(Number(to)); }
    return this._out(this.db.prepare(`SELECT ts, name, value, num, reason, key FROM samples ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ts, id LIMIT 500000`).all(...args));
  }

  // One line per item (by key; readings from before keys by name), under its name now
  names() {
    const rows = this.db.prepare(`SELECT key, name, COUNT(*) AS count, MAX(ts) AS lastTs FROM samples GROUP BY COALESCE(key, 'name:' || name)`).all();
    const by = new Map();
    for (const r of rows) {
      const name = (r.key && this.store.byKey.get(r.key)) || r.name, o = by.get(name);
      if (o) { o.count += r.count; o.lastTs = Math.max(o.lastTs, r.lastTs); } else by.set(name, { name, count: r.count, lastTs: r.lastTs });
    }
    return [...by.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  close() { clearInterval(this.timer); for (const t of this.pending.values()) clearTimeout(t); this.db.close(); }
}
