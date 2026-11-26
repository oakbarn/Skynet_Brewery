// The back house Time to seconds converter (OakBarn Brewery, 2026-11-26: "Create a backhouse converter that can take a Time Value
// regardless of format, and change to seconds", Rule 1.34). Used by the Process command newSec (newSec vV_Secs = wgt_TMR_Boil_BH).
// It takes the value of a Timer, a Time Widget, a Time variable or gGlobal, a Date Time (its time of day), a number (already
// seconds) or a text written any of these ways:
//   01:02:03  1:02:03  -00:00:10  00:01:30.5     hh:mm:ss (a minus counts down, decimals are kept)
//   02:03                                         mm:ss (two parts, the same as everywhere else in Skynet)
//   1d 02:03:04  2 days                           days
//   1h 30m 15s  90 s  2 min  1.5 hours  45 sec    units, in any order
//   7:30 PM  7:30:15 am                           a clock time: seconds after midnight
//   90                                             a plain number is seconds
// It gives the number of seconds, or null when the value can't be read as a time.
import { TimeVal, DateVal, parseTime } from './values.js';

const UNIT = { d: 86400, day: 86400, days: 86400, h: 3600, hr: 3600, hrs: 3600, hour: 3600, hours: 3600,
  m: 60, min: 60, mins: 60, minute: 60, minutes: 60, s: 1, sec: 1, secs: 1, second: 1, seconds: 1 };

export function toSeconds(v) {
  if (v === null || v === undefined) return null;
  if (v instanceof TimeVal) return v.s;
  if (v instanceof DateVal) { const d = new Date(v.ms); return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds(); }
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'boolean') return null;
  if (typeof v === 'object' && 'time' in v) return Number(v.time);                 // a saved time ({ time: 90 })
  let t = String(v).trim().toLowerCase();
  if (!t) return null;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);                                  // 90
  const hms = parseTime(t); if (hms !== null) return hms;                           // 01:02:03, 02:03, -00:00:10
  let m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap])\.?m\.?$/.exec(t);                // 7:30 PM
  if (m) { let h = +m[1] % 12; if (m[4] === 'p') h += 12; if (+m[1] > 12 || +m[2] > 59) return null; return h * 3600 + +m[2] * 60 + +(m[3] ?? 0); }
  let neg = false; if (t.startsWith('-')) { neg = true; t = t.slice(1).trim(); }
  m = /^(\d+(?:\.\d+)?)\s*(?:d|days?)\s+(.+)$/.exec(t);                             // 1d 02:03:04
  if (m) { const rest = parseTime(m[2]); if (rest !== null) return (neg ? -1 : 1) * (+m[1] * 86400 + rest); }
  const parts = [...t.matchAll(/(\d+(?:\.\d+)?)\s*([a-z]+)/g)];                     // 1h 30m 15s, 2 min, 1.5 hours
  if (parts.length && parts.map(p => p[0]).join('').replace(/\s+/g, '') === t.replace(/[\s,]+|\band\b/g, '')) {
    let s = 0; for (const [, n, u] of parts) { if (!(u in UNIT)) return null; s += +n * UNIT[u]; }
    return Math.round((neg ? -s : s) * 1000) / 1000;
  }
  return null;
}
