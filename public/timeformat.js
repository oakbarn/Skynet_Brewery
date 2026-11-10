// Time and DateTime formats (OakBarn Brewery, 2026-11-09, Rule 2.45): how a Time Widget, a DateTime Widget or a Timer shows its time.
// Shared by the Panel (public/app.js) and the BruControl Importer (lib/bruimport.js), so a BruControl Format carries over.
//
// A format is a pattern of letters (the same letters BruControl and Windows use):
//   Time (hours, minutes, seconds): d days, hh / h hours, mm / m minutes, ss / s seconds, f tenths. The biggest one in the pattern holds
//     the whole time: "mm:ss" shows 1 hour 30 minutes as 90:00, and "mm" as 90.
//   DateTime: yyyy / yy year, MMMM (November) / MMM (Nov) / MM / M month, dddd (Monday) / ddd (Mon) / dd / d day, HH / H hours 0-23,
//     hh / h hours 1-12, mm / m minutes, ss / s seconds, tt AM / PM.
// Any other letters or signs show as typed; text in 'quotes' shows as typed; a \ before a sign shows it as typed (BruControl writes
// hh\:mm\:ss). Empty = the standard look (hh:mm:ss, or mm/dd/yyyy hh:mm:ss).

export const TIME_FORMATS = [['', 'hh:mm:ss (01:30:00)'], ['hh:mm', 'hh:mm (01:30)'], ['h:mm:ss', 'h:mm:ss (1:30:00)'], ['mm:ss', 'mm:ss, all minutes (90:00)'],
  ['mm', 'Minutes only (90)'], ['ss', 'Seconds only (5400)'], ['d.hh:mm:ss', 'Days too (0.01:30:00)']];
export const DATETIME_FORMATS = [['', 'mm/dd/yyyy hh:mm:ss (11/09/2026 14:30:00)'], ['MM/dd/yyyy h:mm:ss tt', '11/09/2026 2:30:00 PM'],
  ['MM/dd/yyyy h:mm tt', '11/09/2026 2:30 PM'], ['MM/dd/yyyy', 'Date only (11/09/2026)'], ['MMM d, yyyy', 'Nov 9, 2026'],
  ['dddd, MMMM d, yyyy', 'Monday, November 9, 2026'], ['h:mm:ss tt', 'Clock (2:30:00 PM)'], ['h:mm tt', 'Clock (2:30 PM)'],
  ['HH:mm', '24-hour clock (14:30)'], ['ddd h:mm tt', 'Day and clock (Mon 2:30 PM)'], ['yyyy-MM-dd HH:mm:ss', '2026-11-09 14:30:00']];
export const formatChoices = (list, cur) => (cur && !list.some(([k]) => k === cur) ? [...list, [cur, `${cur} (typed or from BruControl)`]] : list);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pad = (n, w) => String(Math.trunc(Math.abs(n))).padStart(w, '0');

// split a pattern into letter runs, 'quoted' text and \-signs
function tokens(p) {
  const out = [];
  for (let i = 0; i < p.length;) {
    const c = p[i];
    if (c === '\\') { out.push({ lit: p[i + 1] ?? '' }); i += 2; continue; }
    if (c === "'" || c === '"') { const j = p.indexOf(c, i + 1), end = j < 0 ? p.length : j; out.push({ lit: p.slice(i + 1, end) }); i = end + 1; continue; }
    let j = i; while (j < p.length && p[j] === c) j++;
    out.push(/[A-Za-z]/.test(c) ? { tok: p.slice(i, j) } : { lit: p.slice(i, j) }); i = j;
  }
  return out;
}

// seconds from "hh:mm:ss", "-hh:mm:ss", "mm:ss" or a number
export function timeSeconds(v) {
  if (typeof v === 'number') return v;
  const m = /^(-)?(\d+):(\d{1,2})(?::(\d{1,2}(?:\.\d+)?))?$/.exec(String(v ?? '').trim());
  if (!m) return null;
  const s = m[4] !== undefined ? (+m[2]) * 3600 + (+m[3]) * 60 + (+m[4]) : (+m[2]) * 60 + (+m[3]);
  return m[1] ? -s : s;
}

export function formatTime(v, pattern) {
  const p = String(pattern ?? '').trim(), secs = timeSeconds(v);
  if (secs === null) return String(v ?? '');
  const neg = secs < 0, a = Math.abs(secs), parts = tokens(p || 'hh:mm:ss');
  const top = ['d', 'h', 'm', 's'].find(u => parts.some(t => t.tok?.[0].toLowerCase() === u)) ?? 'h';
  const whole = Math.floor(a);
  const unit = { d: Math.floor(whole / 86400), h: top === 'h' ? Math.floor(whole / 3600) : Math.floor(whole / 3600) % 24,
    m: top === 'm' ? Math.floor(whole / 60) : Math.floor(whole / 60) % 60, s: top === 's' ? whole : whole % 60 };
  const s = parts.map(t => {
    if (t.lit !== undefined) return t.lit;
    const u = t.tok[0].toLowerCase(), n = t.tok.length;
    if (u === 'f') return pad(Math.floor((a - whole) * 10 ** n), n);
    return u in unit ? pad(unit[u], Math.min(n, 2)) : t.tok;
  }).join('');
  return (neg ? '-' : '') + s;
}

// a DateTime as the Brain sends it ("mm/dd/yyyy hh:mm:ss"), a Date, or ms
export function dateOf(v) {
  if (v instanceof Date) return v;
  if (typeof v === 'number') return new Date(v);
  const m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AP]M)?)?$/i.exec(String(v ?? '').trim());
  if (m) {
    let h = +(m[4] ?? 0); if (m[7]) h = (h % 12) + (/p/i.test(m[7]) ? 12 : 0);
    return new Date(+m[3], +m[1] - 1, +m[2], h, +(m[5] ?? 0), +(m[6] ?? 0));
  }
  const t = Date.parse(String(v ?? ''));
  return Number.isFinite(t) ? new Date(t) : null;
}

export function formatDateTime(v, pattern) {
  const p = String(pattern ?? '').trim(), d = dateOf(v);
  if (!p || !d) return String(v ?? '');
  const h = d.getHours(), h12 = h % 12 || 12;
  return tokens(p).map(t => {
    if (t.lit !== undefined) return t.lit;
    const k = t.tok, n = k.length;
    switch (k[0]) {
      case 'y': return n <= 2 ? pad(d.getFullYear() % 100, 2) : String(d.getFullYear());
      case 'M': return n >= 4 ? MONTHS[d.getMonth()] : n === 3 ? MONTHS[d.getMonth()].slice(0, 3) : pad(d.getMonth() + 1, n);
      case 'd': return n >= 4 ? DAYS[d.getDay()] : n === 3 ? DAYS[d.getDay()].slice(0, 3) : pad(d.getDate(), n);
      case 'H': return pad(h, Math.min(n, 2));
      case 'h': return pad(h12, Math.min(n, 2));
      case 'm': return pad(d.getMinutes(), Math.min(n, 2));
      case 's': return pad(d.getSeconds(), Math.min(n, 2));
      case 't': return n === 1 ? (h < 12 ? 'A' : 'P') : (h < 12 ? 'AM' : 'PM');
      default: return k;
    }
  }).join('');
}

// a BruControl Format as a Skynet one: its \ before signs are dropped; empty stays empty (the standard look)
export const bruTimeFormat = f => String(f ?? '').trim().replace(/\\(.)/g, '$1');

// the items with a Format (Shows as): a Timer (its Digits box, timerFormat) and a Time, DateTime or Code Value Widget (showAs).
// A Process sets any format with .showas = "h:mm tt"; "" puts back its Properties' pick.
export const hasShowAs = el => ['timer', 'timeWidget', 'dateTimeWidget', 'codeValueWidget'].includes(el?.type);
export const showAsKey = el => (el?.type === 'timer' ? 'timerFormat' : 'showAs');
