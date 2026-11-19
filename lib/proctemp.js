// Processes work in °C (Rule 2.59, Panel Updates Sandbox entry 9; OakBarn Brewery, 2026-11-19: "Keep backend data metric, display to
// user by choice in Skynet Settings"). A Process reads and sets every temperature in °C, whatever its probe keeps its numbers in, the
// same as the Recipe Globals (gblV_Desired_Strike ...) already are. A number can be typed in °F with the degree sign: 152°F is
// 66.6667 °C; for an Offset (.onoffset = -1°F) it is a difference, -0.5556 °C. A probe kept in °F (an older Schema) is turned here,
// where a Process reads or sets it, so the Process never sees °F.
import { isHeatElem, isCoolPump } from '../public/heatmethod.js';
import { isFermentor } from '../public/fermentor.js';
import { needsTurn, tShow, dShow } from '../public/tempshow.js';

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
  return kind && own && needsTurn(own, 'Metric') ? { kind, own } : null;
}
const r4 = v => Math.round(v * 10000) / 10000;
// kept (°F) to what a Process sees (°C), and back
export const toProc = (t, v) => !t || typeof v !== 'number' ? v : t.kind === 'diff' ? dShow(v, t.own, 'Metric') : tShow(v, t.own, 'Metric');
export function fromProc(t, v) {
  const n = typeof v === 'string' && v.trim() !== '' && Number.isFinite(+v) ? +v : v;
  if (!t || typeof n !== 'number') return v;
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
      const n = toks[k]; if (n?.t !== 'num' || n.deg) continue;
      const after = toks[k + 1]; if (after && !(after.t === 'op' && [')', '&&', '||', ';', '{'].includes(after.v)) && !(after.t === 'id' && /^(and|or|then)$/i.test(after.v))) continue;
      if (!procTemp(typeOf(a.v), prop, typeOf)) continue;
      ins.push(n.e);
    }
    if (!ins.length) return line;
    marked += ins.length;
    let o = line; for (const e of ins.sort((x, y) => y - x)) o = o.slice(0, e) + '°F' + o.slice(e);
    return o;
  });
  return { text: out.join(eol), marked };
}
