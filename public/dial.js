// The Skynet Dial (Fritz, 2026-11-07, Rule 2.40): Skynet's own temperature gauge, drawn from scratch as a picture made of
// lines (SVG). It never copies BruControl's (DevExpress) gauges. Fritz's pick was his "top left #1": an arc with a needle and
// the reading in digits under it. The reading shows 0, 1 or 2 decimals. With a Setpoint the reading is colored:
//   more than Cooler range below the Setpoint = the Cold color (Blue), more than Hotter range above = the Hot color (Red),
//   in between = the OK color (Green). With no Setpoint the arc runs from blue through green and yellow to red.
// No imports, so node can load it too (test/dial.test.js).

export const DIAL_DEFAULTS = { cool: 2, hot: 2, coldColor: '#1e6fd9', okColor: '#1f9d55', hotColor: '#d93a26' };
const START = -120, END = 120;               // the arc's ends, in degrees from straight up (the Standard shape)
// Gauge settings (Rule 2.40 point 4, OakBarn Brewery 2026-11-09): the kinds of settings every gauge program has, drawn by Skynet.
// Shape of the Dial: Standard (two thirds round, as before), Full round (most of a circle), Half round (the top half)
export const DIAL_SHAPES = [['', 'Standard (two thirds round)'], ['full', 'Full round'], ['half', 'Half round']];
const SHAPE_ENDS = { full: 150, half: 90 };
export const dialEnds = e => { const a = SHAPE_ENDS[e?.dialShape] ?? END; return [-a, a]; };
// Large tick marks (each with its number; 2 to 21, empty = 6) and Small tick marks between two large ones (0 to 10, empty = 0)
export const dialMajor = e => { const n = num(e?.dialMajor); return n === null ? 6 : Math.max(2, Math.min(21, Math.round(n))); };
export const dialMinor = e => { const n = num(e?.dialMinor); return n === null ? 0 : Math.max(0, Math.min(10, Math.round(n))); };
// Skynet's own color styles for a gauge (the Dial, the Bar, LCD and LED digits): face = behind it, ink = its numbers and needle.
// '' = the look it has always had. These are Skynet's own picks of colors, never a copy of anyone's style.
export const GAUGE_STYLES = [['', 'Skynet Classic'], ['dark', 'Skynet Dark', '#1b1f27', '#e8ecf2'], ['steel', 'Skynet Steel', '#d9dde3', '#1d232c'],
  ['night', 'Skynet Night Green', '#050805', '#5cff7a'], ['amber', 'Skynet Amber', '#1a1205', '#ffb238'], ['ice', 'Skynet Ice Blue', '#0b1a33', '#8fd0ff'],
  ['fire', 'Skynet Fire Red', '#140504', '#ff4a2a'], ['paper', 'Skynet Paper', '#f6f1e3', '#2a2418']];
export const gaugeStyle = e => { const g = GAUGE_STYLES.find(x => x[0] && x[0] === e?.gaugeStyle); return g ? { face: g[2], ink: g[3] } : null; };
// The Skynet Bar: a straight gauge, up and down or side to side
export const BAR_ORIENTS = [['', 'Up and down'], ['horizontal', 'Side to side']];

// the range of the dial: its own Lowest and Highest, else one that fits its units
export function dialRange(e = {}) {
  const u = String(e.units ?? '').trim();
  const def = /^°?F$/i.test(u) ? [0, 220] : /^°?C$/i.test(u) ? [-20, 110] : [0, 100];
  let lo = num(e.dialMin), hi = num(e.dialMax);
  if (lo === null) lo = def[0];
  if (hi === null) hi = def[1];
  if (!(hi > lo)) hi = lo + 1;
  return [lo, hi];
}
// 0, 1 or 2 decimals (Fritz: "Have a # decimals for the digital display of up to 2")
export const dialDecimals = e => { const d = num(e?.precision); return d === null ? 0 : Math.max(0, Math.min(2, Math.round(d))); };
// cold / ok / hot from the Setpoint and the Cooler and Hotter ranges; '' with no Setpoint or no reading
export function dialZone(value, sp, cool = DIAL_DEFAULTS.cool, hot = DIAL_DEFAULTS.hot) {
  const v = num(value), s = num(sp);
  if (v === null || s === null) return '';
  const c = Math.max(0, num(cool) ?? DIAL_DEFAULTS.cool), h = Math.max(0, num(hot) ?? DIAL_DEFAULTS.hot);
  return v < s - c ? 'cold' : v > s + h ? 'hot' : 'ok';
}
export const dialColors = e => ({ cold: e?.dialColdColor || DIAL_DEFAULTS.coldColor, ok: e?.dialOkColor || DIAL_DEFAULTS.okColor, hot: e?.dialHotColor || DIAL_DEFAULTS.hotColor });

// The picture. value: the reading (null = none yet); sp: the Setpoint (null = none); text: what the digits say (FAULT ...)
export function dialSvg(e = {}, value, sp = null, text = null) {
  if (e.look === 'bar') return barSvg(e, value, sp, text);      // the Skynet Bar (Rule 2.40 point 4) draws with the same settings
  const [lo, hi] = dialRange(e), dec = dialDecimals(e), col = dialColors(e), [START, END] = dialEnds(e), gs = gaugeStyle(e);
  const cx = 100, cy = 98, R = 78, W = 13;
  const frac = v => (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo);
  const ang = v => START + (END - START) * frac(v);
  const pt = (r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
  const arc = (r, a0, a1) => { const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1); return `M${f(x0)} ${f(y0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`; };
  const v = num(value), s = num(sp), zone = dialZone(v, s, e.dialCool, e.dialHot);
  const out = [];
  if (gs) out.push(`<rect x="-6" y="5" width="212" height="${e.dialShape === 'full' ? 186 : 147}" rx="14" fill="${gs.face}"/>`);      // its color style's face
  if (s !== null) {           // the three zones round the Setpoint
    const c = Math.max(0, num(e.dialCool) ?? DIAL_DEFAULTS.cool), h = Math.max(0, num(e.dialHot) ?? DIAL_DEFAULTS.hot);
    const a1 = ang(s - c), a2 = ang(s + h);
    if (a1 > START) out.push(`<path d="${arc(R, START, a1)}" stroke="${col.cold}" stroke-width="${W}" fill="none"/>`);
    out.push(`<path d="${arc(R, a1, Math.max(a2, a1 + 0.5))}" stroke="${col.ok}" stroke-width="${W}" fill="none"/>`);
    if (a2 < END) out.push(`<path d="${arc(R, a2, END)}" stroke="${col.hot}" stroke-width="${W}" fill="none"/>`);
    const [mx0, my0] = pt(R + W / 2 + 4, ang(s)), [mx1, my1] = pt(R - W / 2 - 3, ang(s));
    out.push(`<line x1="${f(mx0)}" y1="${f(my0)}" x2="${f(mx1)}" y2="${f(my1)}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`);
  } else {                    // no Setpoint: blue, green, yellow, red along the arc
    const steps = ['#1e6fd9', '#16a3c4', '#1f9d55', '#e8b81c', '#ef7d1a', '#d93a26'];
    steps.forEach((c, i) => out.push(`<path d="${arc(R, START + (END - START) * i / steps.length, START + (END - START) * (i + 1) / steps.length + (i < steps.length - 1 ? 0.6 : 0))}" stroke="${c}" stroke-width="${W}" fill="none"/>`));
  }
  // the Large tick marks with their numbers (6 unless set), and the Small ones between
  const major = dialMajor(e) - 1, minor = dialMinor(e);
  for (let i = 0; i < major; i++) for (let j = 1; j <= minor; j++) {
    const a = START + (END - START) * (i + j / (minor + 1)) / major, [m0x, m0y] = pt(R - W / 2, a), [m1x, m1y] = pt(R - W / 2 + 5, a);
    out.push(`<line x1="${f(m0x)}" y1="${f(m0y)}" x2="${f(m1x)}" y2="${f(m1y)}" stroke="#ffffff" stroke-opacity=".7" stroke-width="1"/>`);
  }
  for (let i = 0; i <= major; i++) {
    const a = START + (END - START) * i / major, n = lo + (hi - lo) * i / major;
    const [t0x, t0y] = pt(R - W / 2, a), [t1x, t1y] = pt(R + W / 2, a), [nx, ny] = pt(R + W / 2 + 12, a);
    out.push(`<line x1="${f(t0x)}" y1="${f(t0y)}" x2="${f(t1x)}" y2="${f(t1y)}" stroke="#ffffff" stroke-opacity=".85" stroke-width="2"/>`);
    out.push(`<text x="${f(nx)}" y="${f(ny + 4)}" text-anchor="middle" font-size="${major > 10 ? 9 : 12}" fill="currentColor" fill-opacity=".8">${esc(round(n))}</text>`);
  }
  // the needle
  if (v !== null) {
    const a = ang(v), [nx, ny] = pt(R - 10, a), [bx0, by0] = pt(6, a - 90), [bx1, by1] = pt(6, a + 90);
    out.push(`<path d="M${f(bx0)} ${f(by0)}L${f(nx)} ${f(ny)}L${f(bx1)} ${f(by1)}Z" fill="currentColor"/>`);
  }
  out.push(`<circle cx="${cx}" cy="${cy}" r="9" fill="currentColor"/><circle cx="${cx}" cy="${cy}" r="3.5" fill="#ffffff" fill-opacity=".85"/>`);
  // the reading, colored by its zone
  const shown = text ?? (v === null ? '--' : v.toFixed(dec)) + (e.units ? String(e.units) : '');
  const full = e.dialShape === 'full', big = full ? 24 : 30;      // Full round: the reading sits inside the ring, a little smaller
  out.push(`<text x="${cx}" y="${cy + (full ? 48 : 52)}" text-anchor="middle" font-size="${shown.length > 7 ? Math.round(big * 7 / shown.length) : big}" font-weight="700" class="dialVal"${zone ? ` fill="${col[zone]}"` : ' fill="currentColor"'}>${esc(shown)}</text>`);
  // the picture is cut close round the drawing (Fritz, 2026-11-08: the Dial takes up most of its box): the side numbers reach
  // past 0 and 200 and the reading ends near 152, so nothing is cut off and no empty edge is kept
  return `<svg class="dial"${gs ? ` style="color:${gs.ink}"` : ''} viewBox="${full ? '-8 3 216 190' : '-8 3 216 151'}" preserveAspectRatio="xMidYMid meet" data-zone="${zone}" role="img" aria-label="${esc(shown)}">${out.join('')}</svg>`;
}

// The Skynet Bar (Rule 2.40 point 4): the same Lowest, Highest, ticks, Setpoint zones and colors as the Dial, as a straight bar
// that fills up to the reading
export function barSvg(e = {}, value, sp = null, text = null) {
  const [lo, hi] = dialRange(e), dec = dialDecimals(e), col = dialColors(e), gs = gaugeStyle(e), side = e.barOrient === 'horizontal';
  const v = num(value), s = num(sp), zone = dialZone(v, s, e.dialCool, e.dialHot);
  const frac = x => (Math.min(hi, Math.max(lo, x)) - lo) / (hi - lo);
  // a straight line from 0 (lowest) to 1 (highest): up and down = bottom to top, side to side = left to right
  const W = side ? 240 : 120, H = side ? 110 : 230, L = side ? 200 : 170;
  const at = t => side ? [20 + L * t, 52] : [44, 190 - L * t];
  const out = [];
  if (gs) out.push(`<rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="${gs.face}"/>`);
  const [x0, y0] = at(0), [x1, y1] = at(1), T = 16;
  out.push(side ? `<rect x="${x0}" y="${y0 - T / 2}" width="${L}" height="${T}" rx="4" fill="currentColor" fill-opacity=".15"/>` : `<rect x="${x0 - T / 2}" y="${y1}" width="${T}" height="${L}" rx="4" fill="currentColor" fill-opacity=".15"/>`);
  if (v !== null) {
    const t = frac(v), fill = zone ? col[zone] : ['#1e6fd9', '#16a3c4', '#1f9d55', '#e8b81c', '#ef7d1a', '#d93a26'][Math.min(5, Math.floor(t * 6))];
    out.push(side ? `<rect x="${x0}" y="${y0 - T / 2}" width="${f(L * t)}" height="${T}" rx="4" fill="${fill}"/>` : `<rect x="${x0 - T / 2}" y="${f(y0 - L * t)}" width="${T}" height="${f(L * t)}" rx="4" fill="${fill}"/>`);
  }
  if (s !== null) { const [sx, sy] = at(frac(s)); out.push(side ? `<line x1="${f(sx)}" y1="${sy - T / 2 - 5}" x2="${f(sx)}" y2="${sy + T / 2 + 5}" stroke="currentColor" stroke-width="3"/>` : `<line x1="${sx - T / 2 - 5}" y1="${f(sy)}" x2="${sx + T / 2 + 5}" y2="${f(sy)}" stroke="currentColor" stroke-width="3"/>`); }
  const major = dialMajor(e) - 1, minor = dialMinor(e);
  for (let i = 0; i <= major; i++) {
    const [tx, ty] = at(i / major), n = lo + (hi - lo) * i / major;
    out.push(side ? `<line x1="${f(tx)}" y1="${ty + T / 2 + 1}" x2="${f(tx)}" y2="${ty + T / 2 + 8}" stroke="currentColor" stroke-width="2"/><text x="${f(tx)}" y="${ty + T / 2 + 21}" text-anchor="middle" font-size="${major > 10 ? 9 : 11}" fill="currentColor" fill-opacity=".8">${esc(round(n))}</text>`
      : `<line x1="${tx + T / 2 + 1}" y1="${f(ty)}" x2="${tx + T / 2 + 8}" y2="${f(ty)}" stroke="currentColor" stroke-width="2"/><text x="${tx + T / 2 + 11}" y="${f(ty + 4)}" font-size="${major > 10 ? 9 : 11}" fill="currentColor" fill-opacity=".8">${esc(round(n))}</text>`);
    if (i < major) for (let j = 1; j <= minor; j++) {
      const [mx, my] = at((i + j / (minor + 1)) / major);
      out.push(side ? `<line x1="${f(mx)}" y1="${my + T / 2 + 1}" x2="${f(mx)}" y2="${my + T / 2 + 5}" stroke="currentColor" stroke-opacity=".7" stroke-width="1"/>` : `<line x1="${mx + T / 2 + 1}" y1="${f(my)}" x2="${mx + T / 2 + 5}" y2="${f(my)}" stroke="currentColor" stroke-opacity=".7" stroke-width="1"/>`);
    }
  }
  const shown = text ?? (v === null ? '--' : v.toFixed(dec)) + (e.units ? String(e.units) : '');
  out.push(`<text x="${side ? W / 2 : W / 2}" y="${side ? 30 : 222}" text-anchor="middle" font-size="${side ? 24 : 20}" font-weight="700" class="dialVal"${zone ? ` fill="${col[zone]}"` : ' fill="currentColor"'}>${esc(shown)}</text>`);
  return `<svg class="dial bar"${gs ? ` style="color:${gs.ink}"` : ''} viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" data-zone="${zone}" role="img" aria-label="${esc(shown)}">${out.join('')}</svg>`;
}

// The BruControl Import (Rule 2.40 points 3 and 4): a BruControl gauge's settings as the closest Skynet ones. kind is its DisplayKind
// (CircularGauge, LinearGauge, DigitalGauge), o its Options as { minValue, maxValue, majorTickCount, minorTickCount, layout,
// orientation, style }. The style name only picks the nearest Skynet color style by its colors; the name is never shown.
const STYLE_NEAR = { shiningdark: 'dark', darknight: 'night', deepfire: 'fire', africasunset: 'amber', icecoldzone: 'ice', gothicmat: 'steel',
  smart: 'dark', ignis: 'fire', mangrove: 'night', blueice: 'ice', yellowsubmarine: 'amber', flatlight: 'paper', flatdark: 'dark', iceland: 'ice',
  redclock: 'fire', classic: 'steel', cosmic: 'night', eco: 'night', future: 'ice', haiti: 'amber', magma: 'fire', militaryclock: 'night', silversun: 'steel', sportcar: 'dark', whiteclock: 'paper' };
export function bruGauge(kind, o = {}) {
  const n = k => { const x = num(o[k]); return x; }, out = {};
  const st = STYLE_NEAR[String(o.style ?? '').toLowerCase()]; if (st) out.gaugeStyle = st;
  if (/^Digital/.test(kind)) return { look: 'lcd', ...out };
  out.look = /^Linear/.test(kind) ? 'bar' : 'dial';
  const lo = n('minValue'), hi = n('maxValue');
  if (lo !== null) out.dialMin = lo;
  if (hi !== null && (lo === null || hi > lo)) out.dialMax = hi;
  const ma = n('majorTickCount'), mi = n('minorTickCount');
  if (ma !== null && ma >= 2) out.dialMajor = Math.min(21, Math.round(ma));
  if (mi !== null && mi >= 0) out.dialMinor = Math.min(10, Math.round(mi));
  if (out.look === 'bar') { if (/horiz/i.test(o.orientation ?? '')) out.barOrient = 'horizontal'; }
  else { const l = String(o.layout ?? '').toLowerCase(); if (/half/.test(l)) out.dialShape = 'half'; else if (l === 'full' || /circ/.test(l)) out.dialShape = 'full'; }
  return out;
}

function num(x) { if (x === null || x === undefined || x === '' || typeof x === 'boolean') return null; const n = Number(x); return Number.isFinite(n) ? n : null; }
const f = n => Math.round(n * 100) / 100;
const round = n => Math.abs(n - Math.round(n)) < 1e-9 ? String(Math.round(n)) : String(Math.round(n * 10) / 10);
const esc = s => String(s).replace(/[<&"]/g, c => ({ '<': '&lt;', '&': '&amp;', '"': '&quot;' })[c]);
