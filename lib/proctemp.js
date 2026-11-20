// Processes work in °C (Rule 2.59, Panel Updates Sandbox entry 9; OakBarn Brewery, 2026-11-19: "Keep backend data metric, display to
// user by choice in Skynet Settings"). A Process reads and sets every temperature in °C, whatever its probe keeps its numbers in, the
// same as the Recipe Globals (gblV_Desired_Strike ...) already are. A number can be typed in °F with the degree sign: 152°F is
// 66.6667 °C; for an Offset (.onoffset = -1°F) it is a difference, -0.5556 °C. A probe kept in °F (an older Schema) is turned here,
// where a Process reads or sets it, so the Process never sees °F.
import { isHeatElem, isCoolPump } from '../public/heatmethod.js';
import { isFermentor } from '../public/fermentor.js';
import { needsTurn, tShow, dShow } from '../public/tempshow.js';
import { qtyOwn, qToMetric, qFromMetric, qtyFamily, qUnitsToMetric, qMetricShow, qMetricSign, qSignFor } from '../public/qtyshow.js';

// the attributes that hold a temperature ('abs') or a temperature difference ('diff')
export const PROBE_PROPS = { value: 'abs', setpoint: 'abs' };
export const HOLDER_PROPS = { target: 'abs', setpoint: 'abs', onoffset: 'diff', deadbandoffset: 'diff', innerbandoffset: 'diff', heatoffset: 'diff', cooloffset: 'diff' };
export const TEMP_DIFF_PROPS = new Set(Object.keys(HOLDER_PROPS).filter(k => HOLDER_PROPS[k] === 'diff'));
const HOLDER_TYPES = ['hysteresis', 'pid', 'deadband'];
const isHolder = el => isHeatElem(el) || HOLDER_TYPES.includes(el?.type) || isFermentor(el) || isCoolPump(el);

// 'abs' or 'diff' when this attribute of this item holds a temperature (in any units), else null
export function tempKind(el, prop) {
  const p = String(prop ?? '').toLowerCase();
  if (!el) return null;
  if (el.type === 'temperature') return PROBE_PROPS[p] ?? null;
  if (el.type === 'hydrometer') return p === 'temperature' ? 'abs' : null;
  if (el.type === 'manual') return p === 'setpoint' ? 'abs' : null;
  return isHolder(el) ? HOLDER_PROPS[p] ?? null : null;
}
// { kind, own } when this attribute of this item is a temperature kept in °F (so a Process sees it turned), else null.
// get(name) finds an item (a holder's probe is its .input).
export function procTemp(el, prop, get) {
  if (!el) return null;
  const p = String(prop ?? '').toLowerCase();
  let kind = null, own = null;
  if (el.type === 'temperature') { kind = PROBE_PROPS[p]; own = el.units || '°F'; }
  else if (el.type === 'hydrometer' && p === 'temperature') { kind = 'abs'; own = el.tempUnits || '°F'; }
  else if (el.type === 'manual' && p === 'setpoint') { kind = 'abs'; own = el.units || '°F'; }
  else if (isHolder(el) && HOLDER_PROPS[p]) { kind = HOLDER_PROPS[p]; own = get(el.input)?.units; }
  if (kind && own && needsTurn(own, 'Metric')) return { kind, own };
  return procQty(el, p);
}
// Live readings work in metric too (Rule 2.59 live side): a Pressure transducer in bar, a Level or a Scale's volume in L, a Flow
// meter's rate in L/min, a weight in kg, whatever units the sensor is calibrated in (public/qtyshow.js). { kind: 'q', own } or null
export function procQty(el, prop) {
  const own = qtyOwn(el, prop);
  return own && qToMetric(1, own) !== 1 ? { kind: 'q', own } : null;      // kPa, qt, oz ... turn too: a Process works in bar, L, L/min, kg
}
// 'q:press', 'q:vol', 'q:rate', 'q:wt' when this attribute of this item holds a live quantity (in any units), else null
export function qtyKind(el, prop) { const own = qtyOwn(el, prop); return own ? 'q:' + qtyFamily(own) : null; }
const r4 = v => Math.round(v * 10000) / 10000;
// kept (°F) to what a Process sees (°C), and back
export const toProc = (t, v) => !t || typeof v !== 'number' ? v : t.kind === 'q' ? qToMetric(v, t.own) : t.kind === 'diff' ? dShow(v, t.own, 'Metric') : tShow(v, t.own, 'Metric');
export function fromProc(t, v) {
  const n = typeof v === 'string' && v.trim() !== '' && Number.isFinite(+v) ? +v : v;
  if (!t || typeof n !== 'number') return v;
  if (t.kind === 'q') return r4(qFromMetric(n, t.own));
  return r4(t.kind === 'diff' ? n * 9 / 5 : n * 9 / 5 + 32);
}
// a typed 152°F or 66.7°C: the number in °C, as a temperature or (diff) a difference
export const degToC = (raw, deg, diff = false) => String(deg).toUpperCase() === 'F' ? (diff ? raw * 5 / 9 : (raw - 32) * 5 / 9) : raw;

// A BruControl script (and any Process written for a probe kept in °F) gives its temperatures in °F: when it is imported, a plain number
// set or compared on a °F probe or what holds it gets its degree sign (HLT_PID.setpoint = 155 -> 155°F), so it means the same in a
// Process that works in °C. A number reached through a variable is left as it is (the import says how many it could not mark).
const SET_OPS = new Set(['=', '+=', '-=', '==', '!=', '<', '>', '<=', '>=']);
export function degreeLiterals(text, typeOf, tokenize) {
  let marked = 0;
  const lines = String(text).split(/\r?\n/), eol = String(text).includes('\r\n') ? '\r\n' : '\n';
  const out = lines.map(line => {
    const s = line.trim();
    if (!s || s.startsWith('//')) return line;
    let toks; try { toks = tokenize(line, 0); } catch { return line; }
    const ins = [];
    for (let i = 0; i < toks.length; i++) {
      const a = toks[i]; if (a.t !== 'id' && a.t !== 'str') continue;
      let j = i + 1, prop = 'value';
      if (toks[j]?.t === 'op' && toks[j].v === '.' && toks[j + 1]?.t === 'id') { prop = toks[j + 1].v; j += 2; }
      const op = toks[j]; if (op?.t !== 'op' || !SET_OPS.has(op.v)) continue;
      let k = j + 1; if (toks[k]?.t === 'op' && toks[k].v === '-') k++;
      const n = toks[k]; if (n?.t !== 'num' || n.deg || n.unit) continue;
      const after = toks[k + 1]; if (after && !(after.t === 'op' && [')', '&&', '||', ';', '{'].includes(after.v)) && !(after.t === 'id' && /^(and|or|then)$/i.test(after.v))) continue;
      const t = procTemp(typeOf(a.v), prop, typeOf); if (!t) continue;
      const sign = t.kind === 'q' ? qSignFor(t.own) : '°F'; if (!sign) continue;      // a live reading gets its own sign: 12 on a psi sensor is 12psi
      ins.push({ e: n.e, sign });
    }
    if (!ins.length) return line;
    marked += ins.length;
    let o = line; for (const x of ins.sort((x, y) => y.e - x.e)) o = o.slice(0, x.e) + x.sign + o.slice(x.e);
    return o;
  });
  return { text: out.join(eol), marked };
}

// ---- A plain 152 in the Units (OakBarn Brewery, 2026-11-19: "we need the use to be able to type 152. This can be triggered by the
// settings in Skynet Defaults US?Metric as how it inturpeded by the backend"). When a Process is saved, a plain number set on or
// compared with a temperature is read in Settings > Units and kept in °C with its sign (US: 152 -> 66.6667°C; Metric: 66.7 ->
// 66.7°C), so the saved Process means the same after Units is switched. When it is opened, a kept °C number is shown back in the
// Units (66.6667°C -> 152 in US; a plain number in a Process saved before, or a Sample, is °C too). An Offset (.onoffset, .heatoffset ...) and a += or -= are differences: x 5/9 only, no 32. A number
// typed with its own sign (152°F, 66.7°C) is left as typed. A number in a formula with a temperature (HLT.setpoint = Strike + 2)
// cannot be sorted out: it is left as typed (in °C) and the save gives one warning.
const CMP_OPS = new Set(['==', '!=', '<', '>', '<=', '>=']);
const ASSIGN = new Set(['=', '+=', '-=']);
const CLAUSE_END = t => !t || (t.t === 'op' && ['&&', '||', ')', ';', '{', '}'].includes(t.v)) || (t.t === 'id' && /^(and|or|then)$/i.test(t.v));
const CLAUSE_START = t => !t || (t.t === 'op' && ['&&', '||', '(', '!'].includes(t.v)) || (t.t === 'id' && /^(if|elseif|wait|while|and|or|not)$/i.test(t.v));
const trim = (v, d) => { const x = Math.round(v * 10 ** d) / 10 ** d; return String(Object.is(x, -0) ? 0 : x); };

// the numbers of one line that hold a temperature: [{ from, to, value (signed), kind, deg }] and whether some could not be sorted out
function tempNumbers(toks, typeOf) {
  const out = []; let unsure = false;
  const refAt = i => {      // Name, Name.prop, "Name" prop at i: { el, prop, end }
    const a = toks[i]; if (!a || (a.t !== 'id' && a.t !== 'str')) return null;
    let j = i + 1, prop = 'value';
    if (toks[j]?.t === 'op' && toks[j].v === '.' && toks[j + 1]?.t === 'id') { prop = toks[j + 1].v; j += 2; }
    else if (a.t === 'str' && toks[j]?.t === 'id' && !/^(and|or|then)$/i.test(toks[j].v)) { prop = toks[j].v; j += 1; }
    const el = typeOf(a.v); return el ? { el, prop, end: j } : null;
  };
  const numAt = i => {      // -5 or 5 at i: { from, to, value, deg, next }
    let k = i, neg = false;
    if (toks[k]?.t === 'op' && toks[k].v === '-') { neg = true; k++; }
    const n = toks[k]; if (n?.t !== 'num') return null;
    return { from: toks[i].p, to: n.e, value: neg ? -(n.raw ?? n.v) : (n.raw ?? n.v), deg: n.deg ?? '', unit: n.unit ?? '', next: k + 1 };
  };
  for (let i = 0; i < toks.length; i++) {
    const r = refAt(i);
    if (r) {
      const op = toks[r.end];
      if (op?.t === 'op' && (ASSIGN.has(op.v) || CMP_OPS.has(op.v))) {
        const k0 = tempKind(r.el, r.prop) || qtyKind(r.el, r.prop);      // a temperature, or a live pressure, volume, rate or weight
        if (k0) {
          const kind = k0.startsWith('q:') ? k0 : op.v === '+=' || op.v === '-=' ? 'diff' : k0;
          const n = numAt(r.end + 1);
          if (n && CLAUSE_END(toks[n.next])) out.push({ ...n, kind });
          else if (!k0.startsWith('q:')) { let j = r.end + 1; while (j < toks.length && !CLAUSE_END(toks[j])) { if (toks[j].t === 'num' && !toks[j].deg) unsure = true; j++; } }
        }
      }
      i = r.end - 1; continue;
    }
    // 150 < HLT.value: the number first
    if (CLAUSE_START(toks[i - 1]) || i === 0) {
      const n = numAt(i);
      if (n && toks[n.next]?.t === 'op' && CMP_OPS.has(toks[n.next].v)) {
        const r2 = refAt(n.next + 1), k0 = r2 && (tempKind(r2.el, r2.prop) || qtyKind(r2.el, r2.prop));
        if (k0 && CLAUSE_END(toks[r2.end])) out.push({ ...n, kind: k0 });
      }
    }
  }
  return { nums: out, unsure };
}
function eachLine(text, fn) {
  const eol = String(text).includes('\r\n') ? '\r\n' : '\n';
  return String(text).split(/\r?\n/).map((line, i) => fn(line, i + 1)).join(eol);
}
const toC = (v, kind, units) => units === 'Metric' ? v : kind === 'diff' ? v * 5 / 9 : (v - 32) * 5 / 9;
const fromC = (v, kind, units) => units === 'Metric' ? v : kind === 'diff' ? v * 9 / 5 : v * 9 / 5 + 32;

// saving: a plain temperature in the Units -> °C with its sign. Returns { text, unsure: [line numbers] }
export function unitsOnSave(text, units, typeOf, tokenize) {
  const unsure = [];
  const out = eachLine(text, (line, n) => {
    const s = line.trim(); if (!s || s.startsWith('//')) return line;
    let toks; try { toks = tokenize(line, n); } catch { return line; }
    const { nums, unsure: u } = tempNumbers(toks, typeOf);
    if (u) unsure.push(n);
    let o = line;
    for (const x of nums.filter(x => !x.deg && !x.unit).sort((a, b) => b.from - a.from)) {
      const q = x.kind.startsWith('q:') ? x.kind.slice(2) : '';      // a live quantity: kept in metric with its sign (US 12 on a pressure -> 0.8274bar)
      o = o.slice(0, x.from) + (q ? trim(qUnitsToMetric(x.value, q, units), 4) + qMetricSign(q) : trim(toC(x.value, x.kind, units), 4) + '°C') + o.slice(x.to);
    }
    return o;
  });
  return { text: out, unsure };
}
// opening: a kept temperature (°C, with its sign or plain: a plain one in a saved Process is °C, as it runs) -> shown plain in the
// Units (a number typed with °F stays as typed)
export function unitsOnShow(text, units, typeOf, tokenize) {
  return eachLine(text, (line, n) => {
    const s = line.trim(); if (!s || s.startsWith('//')) return line;
    let toks; try { toks = tokenize(line, n); } catch { return line; }
    let o = line;
    for (const x of tempNumbers(toks, typeOf).nums.filter(x => x.deg !== 'F').sort((a, b) => b.from - a.from)) {
      const q = x.kind.startsWith('q:') ? x.kind.slice(2) : '';
      if (q) {      // a live quantity kept in metric (with its metric sign, or plain) shows plain in the Units; 12psi typed with a US sign stays
        if (x.unit && x.unit.toLowerCase() !== qMetricSign(q).toLowerCase()) continue;
        o = o.slice(0, x.from) + trim(qMetricShow(x.value, q, units), units === 'Metric' ? 4 : 2) + o.slice(x.to); continue;
      }
      o = o.slice(0, x.from) + trim(fromC(x.value, x.kind, units), units === 'Metric' ? 4 : 2) + o.slice(x.to);
    }
    return o;
  });
}
export const unsureWarning = lines => lines.length ? { line: lines[0], msg: `Line${lines.length > 1 ? 's' : ''} ${lines.join(', ')}: a number in a formula with a temperature is kept as typed, in °C. For °F, write it with its sign (2°F), or put the formula's numbers on their own line (Rule 2.59).` } : null;
