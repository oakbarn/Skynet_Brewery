// Writes Global values to a SQLite database file (built into Node.js, nothing to install).
// Each Global has a log trigger:  none | ondemand | once | seconds | hours | days  (+ "every" N)
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { toNum, toStr, plain } from './values.js';
import { cleanName } from './store.js';

export const LOG_MODES = ['none', 'ondemand', 'once', 'seconds', 'hours', 'days'];
const UNIT_MS = { seconds: 1000, hours: 3600_000, days: 86_400_000 };

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
        reason TEXT                   -- interval | once | ondemand | script | api
      );
      CREATE INDEX IF NOT EXISTS ix_samples_name_ts ON samples(name, ts);`);
    this.ins = this.db.prepare('INSERT INTO samples (ts, name, value, num, reason) VALUES (?, ?, ?, ?, ?)');
    this.last = new Map();     // name -> last interval write time
    this.armed = new Set();    // "once" globals waiting to be written
    for (const el of store.list('global')) if (el.log?.mode === 'once') this.armed.add(el.name);
    store.on('config', () => { for (const el of store.list('global')) if (el.log?.mode === 'once' && !this.last.has(el.name)) this.armed.add(el.name); });
    this.timer = setInterval(() => this.tick(), 1000);
  }

  write(name, reason) {
    const v = plain(this.store.getProp(name, 'value'));
    const n = typeof v === 'number' ? v : typeof v === 'boolean' ? (v ? 1 : 0) : (Number.isFinite(+v) && String(v).trim() !== '' ? +v : null);
    this.ins.run(Date.now(), name, toStr(v), n, reason);
  }

  logNow(name, reason = 'ondemand') {
    name = cleanName(name);
    const el = this.store.get(name);
    if (!el || el.type !== 'global') throw new Error(`log: "${name}" is not a Global (only Globals go to the database)`);
    this.write(name, reason);
  }

  arm(name) { this.armed.add(cleanName(name)); }

  tick() {
    const now = Date.now();
    for (const el of this.store.list('global')) {
      const lg = el.log; if (!lg || !lg.mode || lg.mode === 'none' || lg.mode === 'ondemand') continue;
      try {
        if (lg.mode === 'once') {
          if (this.armed.has(el.name)) { this.write(el.name, 'once'); this.armed.delete(el.name); this.last.set(el.name, now); }
          continue;
        }
        const every = Math.max(1, toNum(lg.every ?? 1)) * UNIT_MS[lg.mode];
        const last = this.last.get(el.name) ?? 0;
        if (now - last >= every) { this.write(el.name, 'interval'); this.last.set(el.name, now); }
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
