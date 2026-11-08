// The Skynet Dial (Fritz, 2026-11-07, Rule 2.40): Skynet's own temperature gauge, drawn from scratch as a picture made of
// lines (SVG). It never copies BruControl's (DevExpress) gauges. Fritz's pick was his "top left #1": an arc with a needle and
// the reading in digits under it. The reading shows 0, 1 or 2 decimals. With a Setpoint the reading is colored:
//   more than Cooler range below the Setpoint = the Cold color (Blue), more than Hotter range above = the Hot color (Red),
//   in between = the OK color (Green). With no Setpoint the arc runs from blue through green and yellow to red.
// No imports, so node can load it too (test/dial.test.js).

export const DIAL_DEFAULTS = { cool: 2, hot: 2, coldColor: '#1e6fd9', okColor: '#1f9d55', hotColor: '#d93a26' };
const START = -120, END = 120;               // the arc's ends, in degrees from straight up

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
  const [lo, hi] = dialRange(e), dec = dialDecimals(e), col = dialColors(e);
  const cx = 100, cy = 98, R = 78, W = 13;
  const frac = v => (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo);
  const ang = v => START + (END - START) * frac(v);
  const pt = (r, a) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
  const arc = (r, a0, a1) => { const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1); return `M${f(x0)} ${f(y0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`; };
  const v = num(value), s = num(sp), zone = dialZone(v, s, e.dialCool, e.dialHot);
  const out = [];
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
  // 6 numbers round the arc, with a short tick at each
  for (let i = 0; i <= 5; i++) {
    const a = START + (END - START) * i / 5, n = lo + (hi - lo) * i / 5;
    const [t0x, t0y] = pt(R - W / 2, a), [t1x, t1y] = pt(R + W / 2, a), [nx, ny] = pt(R + W / 2 + 12, a);
    out.push(`<line x1="${f(t0x)}" y1="${f(t0y)}" x2="${f(t1x)}" y2="${f(t1y)}" stroke="#ffffff" stroke-opacity=".85" stroke-width="2"/>`);
    out.push(`<text x="${f(nx)}" y="${f(ny + 4)}" text-anchor="middle" font-size="12" fill="currentColor" fill-opacity=".8">${esc(round(n))}</text>`);
  }
  // the needle
  if (v !== null) {
    const a = ang(v), [nx, ny] = pt(R - 10, a), [bx0, by0] = pt(6, a - 90), [bx1, by1] = pt(6, a + 90);
    out.push(`<path d="M${f(bx0)} ${f(by0)}L${f(nx)} ${f(ny)}L${f(bx1)} ${f(by1)}Z" fill="currentColor"/>`);
  }
  out.push(`<circle cx="${cx}" cy="${cy}" r="9" fill="currentColor"/><circle cx="${cx}" cy="${cy}" r="3.5" fill="#ffffff" fill-opacity=".85"/>`);
  // the reading, colored by its zone
  const shown = text ?? (v === null ? '--' : v.toFixed(dec)) + (e.units ? String(e.units) : '');
  out.push(`<text x="${cx}" y="${cy + 52}" text-anchor="middle" font-size="${shown.length > 7 ? Math.round(30 * 7 / shown.length) : 30}" font-weight="700" class="dialVal"${zone ? ` fill="${col[zone]}"` : ' fill="currentColor"'}>${esc(shown)}</text>`);
  // the picture is cut close round the drawing (Fritz, 2026-11-08: the Dial takes up most of its box): the side numbers reach
  // past 0 and 200 and the reading ends near 152, so nothing is cut off and no empty edge is kept
  return `<svg class="dial" viewBox="-8 3 216 151" preserveAspectRatio="xMidYMid meet" data-zone="${zone}" role="img" aria-label="${esc(shown)}">${out.join('')}</svg>`;
}

function num(x) { if (x === null || x === undefined || x === '' || typeof x === 'boolean') return null; const n = Number(x); return Number.isFinite(n) ? n : null; }
const f = n => Math.round(n * 100) / 100;
const round = n => Math.abs(n - Math.round(n)) < 1e-9 ? String(Math.round(n)) : String(Math.round(n * 10) / 10);
const esc = s => String(s).replace(/[<&"]/g, c => ({ '<': '&lt;', '&': '&amp;', '"': '&quot;' })[c]);
