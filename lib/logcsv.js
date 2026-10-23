// CSV files from the brew database (Log page > Download CSV), ready for Excel or Google Sheets.
//   wide  one row per moment, one column per value (Time, Minutes, HLT_Temp, MLT_Temp ...): good for graphs
//   list  one row per reading (Time, Name, Value, Trigger): every reading exactly as written
// Times are the brewer's local time (tz = the browser's getTimezoneOffset, in minutes) as 2026-10-21 14:05:03,
// which Excel and Sheets read as a date and time.
import { fileMinuteUTC } from './filedate.js';
const pad = n => String(n).padStart(2, '0');
const q = s => { s = String(s ?? ''); return /[",\r\n]/.test(s) || /^\s|\s$/.test(s) ? `"${s.replaceAll('"', '""')}"` : s; };

export function localTime(ts, tz = 0) {
  const d = new Date(ts - tz * 60_000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

// rows: { ts, name, value, num, reason } oldest first
export function buildCsv(rows, { names = [], layout = 'wide', tz = 0 } = {}) {
  const BOM = '﻿';        // so Excel opens the file as UTF-8 (°, µ and the like)
  if (layout === 'list') {
    return BOM + 'Time,Name,Value,Trigger\r\n' + rows.map(r => [localTime(r.ts, tz), q(r.name), q(r.value), q(r.reason)].join(',')).join('\r\n') + (rows.length ? '\r\n' : '');
  }
  const cols = names.length ? names : [...new Set(rows.map(r => r.name))].sort();
  const at = new Map(cols.map((n, i) => [n, i]));
  const lines = [];
  let cur = null, sec = null;
  const t0 = rows.length ? rows[0].ts : 0;
  const flush = () => { if (cur) lines.push([localTime(cur.ts, tz), ((cur.ts - t0) / 60_000).toFixed(2), ...cur.vals.map(q)].join(',')); };
  for (const r of rows) {
    if (!at.has(r.name)) continue;
    const s = Math.floor(r.ts / 1000);            // readings written in the same second share one row
    if (s !== sec) { flush(); cur = { ts: r.ts, vals: cols.map(() => '') }; sec = s; }
    cur.vals[at.get(r.name)] = r.num ?? r.value;
  }
  flush();
  return BOM + ['Time', 'Minutes', ...cols].map(q).join(',') + '\r\n' + lines.join('\r\n') + (lines.length ? '\r\n' : '');
}

// Skynet_Log_Mash_Profile_20261021T1405.csv (ISO 8601): the label, then the local time of the first reading (or now)
export function csvFileName(label, rows, tz = 0, now = Date.now()) {
  const clean = String(label || 'All').replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'All';
  const d = new Date((rows.length ? rows[0].ts : now) - tz * 60_000);
  return `Skynet_Log_${clean}_${fileMinuteUTC(d)}.csv`;
}

// Saved CSV sets (e.g. "Mash Profile" = HLT_Temp, MLT_Temp, RIMS_Temp), kept in the Schema as logSets
export function cleanLogSets(list) {
  if (!Array.isArray(list)) throw new Error('CSV sets must be a list');
  const seen = new Set();
  return list.map(s => ({ name: String(s?.name ?? '').trim().slice(0, 60), names: [...new Set((Array.isArray(s?.names) ? s.names : []).map(n => String(n).trim()).filter(Boolean))] }))
    .filter(s => {
      if (!s.name || !s.names.length) throw new Error('Every CSV set needs a name and at least one value');
      const k = s.name.toLowerCase(); if (seen.has(k)) throw new Error(`Two CSV sets are called "${s.name}"`);
      seen.add(k); return true;
    });
}
