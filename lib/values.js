// Value types used by scripts and elements.
// value = number, string, bool, time = TimeVal (seconds), datetime = DateVal (epoch ms)

export class TimeVal {
  constructor(seconds) { this.s = Math.round(Number(seconds) * 1000) / 1000 || 0; }
  toString() { return fmtTime(this.s); }
  toJSON() { return { time: this.s }; }
}

export class DateVal {
  constructor(ms) { this.ms = Number(ms) || 0; }
  toString() { return fmtDate(this.ms); }
  toJSON() { return { datetime: this.ms }; }
}

const pad = (n, w = 2) => String(Math.trunc(Math.abs(n))).padStart(w, '0');

export function fmtTime(s) {
  const neg = s < 0; s = Math.abs(Math.round(s));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return (neg ? '-' : '') + pad(h) + ':' + pad(m) + ':' + pad(sec);
}

export function fmtDate(ms) {
  const d = new Date(ms);
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// "hh:mm:ss", "mm:ss" or "-hh:mm:ss"
export function parseTime(str) {
  const m = /^(-)?(\d+):(\d{1,2})(?::(\d{1,2}(?:\.\d+)?))?$/.exec(String(str).trim());
  if (!m) return null;
  const s = m[4] !== undefined ? (+m[2]) * 3600 + (+m[3]) * 60 + (+m[4]) : (+m[2]) * 60 + (+m[3]);
  return m[1] ? -s : s;
}

export const isTime = v => v instanceof TimeVal;
export const isDate = v => v instanceof DateVal;

export function toNum(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (isTime(v)) return v.s;
  if (isDate(v)) return v.ms;
  if (v === null || v === undefined) return 0;
  const t = parseTime(v); if (t !== null) return t;
  const n = parseFloat(v); return Number.isFinite(n) ? n : 0;
}

export function fmtNum(n, precision) {
  if (!Number.isFinite(n)) return '0';
  if (precision !== undefined && precision !== null && precision >= 0) return n.toFixed(precision);
  return String(Math.round(n * 10000) / 10000);
}

export function toStr(v, precision) {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return fmtNum(v, precision);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (v === null || v === undefined) return '';
  return v.toString();
}

export function toBool(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return ['true', 'on', '1', 'yes', 'visible'].includes(v.trim().toLowerCase());
  return toNum(v) !== 0;
}

export function coerce(type, v, precision) {
  switch (type) {
    case 'value': { const n = toNum(v); return (precision !== undefined && precision !== null && precision >= 0) ? +n.toFixed(precision) : n; }
    case 'string': return toStr(v, precision);
    case 'bool': return toBool(v);
    case 'time': return isTime(v) ? v : (typeof v === 'string' && parseTime(v) === null && isNaN(+v)) ? new TimeVal(0) : new TimeVal(toNum(v));
    case 'datetime': {
      if (isDate(v)) return v;
      if (typeof v === 'string') { const t = Date.parse(v); return new DateVal(Number.isFinite(t) ? t : 0); }
      return new DateVal(toNum(v));
    }
    default: return v;
  }
}

export function defaultFor(type) {
  return { value: 0, string: '', bool: false, time: new TimeVal(0), datetime: new DateVal(0) }[type] ?? 0;
}

// JSON-safe form for the browser / API
export function plain(v) {
  if (isTime(v)) return v.toString();
  if (isDate(v)) return v.toString();
  return v;
}

// ---- operators ----
export function add(a, b) {
  if (typeof a === 'string' || typeof b === 'string') return toStr(a) + toStr(b);
  if (isDate(a) && (isTime(b) || typeof b === 'number')) return new DateVal(a.ms + toNum(b) * 1000);
  if (isTime(a) && isDate(b)) return new DateVal(b.ms + a.s * 1000);
  if (isTime(a) || isTime(b)) return new TimeVal(toNum(a) + toNum(b));
  return toNum(a) + toNum(b);
}

export function sub(a, b) {
  if (isDate(a) && isDate(b)) return new TimeVal((a.ms - b.ms) / 1000);
  if (isDate(a)) return new DateVal(a.ms - toNum(b) * 1000);
  if (isTime(a) || isTime(b)) return new TimeVal(toNum(a) - toNum(b));
  return toNum(a) - toNum(b);
}

export function mul(a, b) {
  if (isTime(a) && !isTime(b)) return new TimeVal(a.s * toNum(b));
  if (isTime(b) && !isTime(a)) return new TimeVal(b.s * toNum(a));
  return toNum(a) * toNum(b);
}

export function div(a, b) {
  const d = toNum(b);
  if (d === 0) throw new Error('Divide by zero');
  if (isTime(a) && !isTime(b)) return new TimeVal(a.s / d);
  return toNum(a) / d;
}

export function compare(a, b) {
  // strings compare as text only when both are text that is not a number/time
  if (typeof a === 'string' && typeof b === 'string') return a < b ? -1 : a > b ? 1 : 0;
  if (typeof a === 'boolean' || typeof b === 'boolean') { const x = toBool(a), y = toBool(b); return x === y ? 0 : (x ? 1 : -1); }
  const x = toNum(a), y = toNum(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

// Clock time of day -> seconds after midnight.  "12 AM", "6:30 PM", "18:30", "06:00:00"
export function parseClock(str) {
  const m = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*([ap])?\.?\s*m?\.?$/i.exec(String(str ?? '').trim());
  if (!m) return null;
  let h = +m[1]; const min = +(m[2] ?? 0), sec = +(m[3] ?? 0), ap = m[4]?.toLowerCase();
  if (ap) { if (h < 1 || h > 12) return null; h = (h % 12) + (ap === 'p' ? 12 : 0); }
  else if (m[2] === undefined) return null;            // a bare number needs AM/PM
  if (h > 23 || min > 59 || sec > 59) return null;
  return h * 3600 + min * 60 + sec;
}
