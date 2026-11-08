// The brew database: a SQLite file on the Brain (built into Node.js, nothing to install, free, SQL).
// Any Device or Widget can send readings to it (Fritz, 2026-10-30). Its .database setting (config "database":
// { frequency, every, interval, at, process, attribute }) says when:
//   none      never
//   ondemand  only by a Process "send_db" line, the API or the Log now button
//   change    every time the value changes (at most 10 times a second, the last change is never lost)
//   clicked   When Clicked: each time someone sets it on its Tab (a tap, then Set), even to the same value (Fritz, 2026-11-05)
//   process   when the Process named in "process" starts, and never at any other time
//   datetime  one time, at the date and time in "at" (2026-11-01T06:00)
//   clock     every day at the clock time in "at" (like "12 AM", "6:30 PM" or "18:30") (Fritz, 2026-11-04)
//   second | minute | hour   shortcuts: every 1 second / minute / hour (Fritz, 2026-11-06)
//   midnight  shortcut: every day at midnight (12 AM)
//   ms | seconds | minutes | hours | days   every N (whole number "every") of that unit
//   hms       every "interval" given as 00:00:00
// Only "clock" and "datetime" use "at"; the Every modes have no clock time (Fritz, 2026-11-04: the clock time
// box shows only for At clock time).
// "attribute" picks what is sent (its main value when empty: .value, .state, .active ...).
// "groups" (Database Groups, Rule 6.14, Fritz 2026-11-06): a list of Group keys. An item in one or more Groups is sent by its
// setting above ONLY while one of its Groups is started (start_db_group Mash ... stop_db_group Mash). Without Groups it is
// sent all the time. On demand (send_db Name, Log now, the API) always works; send_db_group Name sends the whole Group once.
// Every Group is stopped when the Brain starts.
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
import { groupByName, groupById, itemGroups } from './dbgroups.js';

export const LOG_MODES = ['none', 'ondemand', 'change', 'clicked', 'process', 'datetime', 'clock', 'second', 'minute', 'hour', 'midnight', 'ms', 'seconds', 'minutes', 'hours', 'days', 'hms'];
const UNIT_MS = { ms: 1, seconds: 1000, minutes: 60_000, hours: 3600_000, days: 86_400_000 };
const SHORTCUT_MS = { second: 1000, minute: 60_000, hour: 3600_000 };     // Every second / minute / hour (no N)
const MIN_MS = 100;                    // fastest interval, and the fastest "On value change"
const DAY = 86_400_000;
const PASSIVE = ['none', 'ondemand', 'process', 'change', 'clicked'];

export const dbOf = el => (el?.database?.frequency && el.database.frequency !== 'none') ? el.database : null;
const attrOf = el => String(el?.database?.attribute || mainProp(el) || 'value').toLowerCase();

// Interval in ms for a database setting, or 0 when it is not a time mode / not valid
export function intervalMs(lg) {
  if (!lg) return 0;
  const f = lg.frequency;
  if (f in SHORTCUT_MS) return SHORTCUT_MS[f];
  if (f === 'hms') { const s = parseTime(lg.interval ?? ''); return s > 0 ? Math.max(MIN_MS, s * 1000) : 0; }
  if (!(f in UNIT_MS)) return 0;
  const n = Math.max(1, Math.round(toNum(lg.every ?? 1)));
  return Math.max(MIN_MS, n * UNIT_MS[f]);
}

// Next write time after "now" for "At clock time" (every day at "at"), or an interval lined up with a clock time
export function nextAt(lg, now = Date.now()) {
  const daily = lg?.frequency === 'clock' || lg?.frequency === 'midnight';
  const iv = daily ? DAY : intervalMs(lg), at = lg?.frequency === 'midnight' ? 0 : parseClock(lg?.at);
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
        reason TEXT                   -- interval | group:<Group> | ondemand | change | datetime | api | start:<process>
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
    this.done = new Set();     // "datetime" writes already made (name + time)
    this.started = Date.now();
    this.live = new Set();     // the keys of the Database Groups started now (start_db_group); none when the Brain starts
    this.changeAt = new Map(); // name -> last "On value change" write time
    this.pending = new Map();  // name -> timer for a change that came too soon after the last one
    this.giveKeys();
    store.on('config', () => { this.next.clear(); this.giveKeys(); });
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

  // Database Groups (Rule 6.14). An item may be sent by its own setting now: it is in no Group, or one of its Groups is started.
  // A Group key that is gone does not hold an item back.
  mayWrite(el) {
    const gs = itemGroups(el?.database).filter(id => groupById(this.store.config, id));
    return !gs.length || gs.some(id => this.live.has(id));
  }
  _group(cmd, name) {
    const g = groupByName(this.store.config, cleanName(name));
    if (!g) throw new Error(`${cmd}: there is no Group named "${cleanName(name)}" (a Group is made in an item's Database and .API box)`);
    return g;
  }
  inGroup(g) { return this.logged().filter(el => itemGroups(el.database).includes(g.id)); }
  // start_db_group Mash: every item in Mash is sent by its own setting from now on, until stop_db_group Mash. Returns how many.
  startGroup(name) {
    const g = this._group('start_db_group', name);
    if (!this.live.has(g.id)) { this.live.add(g.id); for (const el of this.inGroup(g)) { this.last.delete(el.name); this.next.delete(el.name); } }
    return this.inGroup(g).length;
  }
  // stop_db_group Mash: its items stop being sent (an item also in another started Group keeps going)
  stopGroup(name) {
    const g = this._group('stop_db_group', name);
    this.live.delete(g.id);
    return this.inGroup(g).length;
  }
  liveGroups() { return [...this.live].map(id => groupById(this.store.config, id)?.name).filter(Boolean); }
  // send_db_group Group_Name: every item in that Group is sent now, once, started or not (it is On demand). Returns how many.
  sendGroup(name) {
    const g = this._group('send_db_group', name);
    let n = 0;
    for (const el of this.inGroup(g)) { try { this.write(el.name, 'group:' + g.name); n++; } catch { /* removed */ } }
    return n;
  }

  // "When a Process starts": a Process just started -> write every item that names it
  scriptStarted(script) {
    script = cleanName(script);
    for (const el of this.logged()) {
      if (el.database.frequency === 'process' && cleanName(el.database.process) === script && this.mayWrite(el)) {
        try { this.write(el.name, 'start:' + script); } catch { /* removed */ }
      }
    }
  }

  // "When Clicked": someone set it on its Tab (POST /ui/set). Sent each time, even when the value did not change.
  clicked(name, prop) {
    const el = this.store.get(cleanName(name));
    if (dbOf(el)?.frequency !== 'clicked' || String(prop).toLowerCase() !== attrOf(el) || !this.mayWrite(el)) return false;
    this.write(el.name, 'clicked'); return true;
  }

  // "On value change": at most one write per 100 ms; a change that comes sooner is written when the 100 ms are up
  changed(name, prop) {
    const el = this.store.get(name);
    if (dbOf(el)?.frequency !== 'change' || String(prop).toLowerCase() !== attrOf(el) || !this.mayWrite(el)) return;
    const now = Date.now(), wait = MIN_MS - (now - (this.changeAt.get(name) ?? 0));
    if (wait <= 0) { this.changeAt.set(name, now); try { this.write(name, 'change'); } catch { /* removed */ } return; }
    if (this.pending.has(name)) return;
    this.pending.set(name, setTimeout(() => {
      this.pending.delete(name); this.changeAt.set(name, Date.now());
      try { if (this.mayWrite(this.store.get(name))) this.write(name, 'change'); } catch { /* removed */ }
    }, wait));
  }

  tick() {
    const now = Date.now();
    for (const el of this.logged()) {
      const lg = el.database; if (PASSIVE.includes(lg.frequency)) continue;
      const may = this.mayWrite(el);         // in a Group that is not started: its times pass and nothing is sent
      try {
        if (lg.frequency === 'datetime') {       // once, at that date and time (one that was already past when the Brain started is skipped)
          const t = dateTimeMs(lg.at), id = el.name + '@' + lg.at;
          if (t !== null && now >= t && t >= this.started && !this.done.has(id)) { this.done.add(id); if (may) this.write(el.name, 'datetime'); }
          continue;
        }
        if (lg.frequency === 'clock' || lg.frequency === 'midnight') {          // every day at that clock time (midnight: 12 AM)
          let due = this.next.get(el.name);
          if (due === undefined) { due = nextAt(lg, now); this.next.set(el.name, due); }
          if (due !== null && now >= due) { if (may) this.write(el.name, 'interval'); this.last.set(el.name, now); this.next.set(el.name, nextAt(lg, now)); }
          continue;
        }
        const every = intervalMs(lg); if (!every || !may) continue;
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

  // A Chart Widget's lines (Rule 1.26): for each name, its number readings from..to averaged into at most `points` steps,
  // oldest first, as [[ms, value], ...]. A name with no readings gives an empty list.
  chartSeries({ names = [], from, to, points = 400 } = {}) {
    const out = {}, f = Number(from) || 0, t = Number(to) || Date.now();
    const step = Math.max(1, Math.ceil((t - f) / Math.max(10, Math.min(2000, Number(points) || 400))));
    for (const n of names) {
      const w = this._who(n);
      out[n] = this.db.prepare(`SELECT MIN(ts) + (MAX(ts) - MIN(ts)) / 2 AS ts, AVG(num) AS num FROM samples WHERE ${w.sql} AND ts >= ? AND ts <= ? AND num IS NOT NULL GROUP BY (ts - ?) / ? ORDER BY ts`)
        .all(...w.args, f, t, f, step).map(r => [Math.round(r.ts), r.num]);
    }
    return out;
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

  // a clean, whole copy of the brew log database (Move Brain, lib/brainmove.js): safe while readings keep coming in
  copyTo(file) { try { fs.rmSync(file, { force: true }); } catch { } this.db.exec(`VACUUM INTO '${String(file).replace(/'/g, "''")}'`); return file; }
  close() { clearInterval(this.timer); for (const t of this.pending.values()) clearTimeout(t); this.db.close(); }
}
