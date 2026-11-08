// The Skynet Chart Widget (Fritz, 2026-11-08, Rule 1.26): a line graph over time of readings kept in the brew database
// (lib/logger.js). Its attributes closely match a BruControl Chart's properties (Fritz: "Closely match BruControl Chart properties
// as attributes"), so a BruControl Chart imports one to one:
//   BruControl                         Skynet Chart Widget (Properties name, then the Process attribute)
//   SpanSeconds                        spanSeconds        .spanseconds      how far back the graph goes, in seconds
//   RefreshInterval                    refreshInterval    .refreshinterval  how often it is drawn again, in seconds
//   ChartAppearance/HGridLines         hGridLines         .hgridlines       grid lines across (0 = none)
//   ChartAppearance/VGridLines         vGridLines         .vgridlines       grid lines up and down (0 = none)
//   ChartAppearance/XAxisColor         xAxisColor         .xaxiscolor       the time axis and its numbers
//   Channels[1] and [2]: ChannelID     ch1Element         .ch1element       the Device or Widget drawn (Channel 1 = left axis,
//                                                                             Channel 2 = right axis)
//                        AutoScale     ch1AutoScale       .ch1autoscale     the axis fits the readings
//                        AxisYMin/Max  ch1YMin, ch1YMax   .ch1ymin .ch1ymax the axis when Auto scale is off
//                        LineColor     ch1LineColor       .ch1linecolor
//                        AxisColor     ch1AxisColor       .ch1axiscolor
// No imports, so node can load it too (test/chart.test.js). The picture is made of lines (SVG); nothing is copied from BruControl.

export const CHART_CHANNELS = [1, 2];
export const CHART_DEFAULTS = { spanSeconds: 3600, refreshInterval: 60, hGridLines: 4, vGridLines: 0, xAxisColor: '#8a8a8a',
  lineColors: ['#00B050', '#E8A317'], axisColor: '#8a8a8a' };
export const CHART_MIN_REFRESH = 1;            // seconds
export const CHART_POINTS = 400;               // the most points one line is drawn with (the Brain averages the readings into these)

const num = v => { if (v === '' || v === null || v === undefined || typeof v === 'boolean') return null; const n = Number(v); return Number.isFinite(n) ? n : null; };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// BruControl keeps a color as one signed number (Alpha, Red, Green, Blue): -16732080 is #00B050. '' when it has none.
export function argbHex(v) {
  const n = num(v); if (n === null) return '';
  const u = n >>> 0;
  return '#' + (u & 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
}

// the settings in use: a Process's attribute (the Brain's value v) wins over the Properties (e)
export function chartSettings(e = {}, v = {}) {
  const pick = (attr, key) => (v[attr] !== undefined && v[attr] !== '' && v[attr] !== null ? v[attr] : e[key]);
  const pos = (x, d, lo = 0) => { const n = num(x); return n === null ? d : Math.max(lo, n); };
  const ch = CHART_CHANNELS.map((i, k) => ({
    n: i,
    element: String(pick(`ch${i}element`, `ch${i}Element`) ?? ''),
    autoScale: pick(`ch${i}autoscale`, `ch${i}AutoScale`) !== false && pick(`ch${i}autoscale`, `ch${i}AutoScale`) !== 'false',
    yMin: num(pick(`ch${i}ymin`, `ch${i}YMin`)), yMax: num(pick(`ch${i}ymax`, `ch${i}YMax`)),
    lineColor: pick(`ch${i}linecolor`, `ch${i}LineColor`) || CHART_DEFAULTS.lineColors[k],
    axisColor: pick(`ch${i}axiscolor`, `ch${i}AxisColor`) || CHART_DEFAULTS.axisColor,
  }));
  return {
    spanSeconds: pos(pick('spanseconds', 'spanSeconds'), CHART_DEFAULTS.spanSeconds, 1),
    refreshInterval: pos(pick('refreshinterval', 'refreshInterval'), CHART_DEFAULTS.refreshInterval, CHART_MIN_REFRESH),
    hGridLines: Math.round(pos(pick('hgridlines', 'hGridLines'), CHART_DEFAULTS.hGridLines)),
    vGridLines: Math.round(pos(pick('vgridlines', 'vGridLines'), CHART_DEFAULTS.vGridLines)),
    xAxisColor: pick('xaxiscolor', 'xAxisColor') || CHART_DEFAULTS.xAxisColor,
    channels: ch,
  };
}

// a span in plain words: 86400 is "1 day", 5400 is "1 h 30 min"
export function spanText(sec) {
  const s = Math.max(0, Math.round(num(sec) ?? 0));
  const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), r = s % 60;
  const parts = [d && `${d} day${d === 1 ? '' : 's'}`, h && `${h} h`, m && `${m} min`, r && !d && `${r} s`].filter(Boolean);
  return parts.length ? parts.join(' ') : '0 s';
}

// the low and high of one axis: its own numbers, or (Auto scale) the readings with a little room
export function axisRange(c, points) {
  if (!c.autoScale && c.yMin !== null && c.yMax !== null && c.yMax > c.yMin) return [c.yMin, c.yMax];
  const ys = (points ?? []).map(p => p[1]).filter(Number.isFinite);
  if (!ys.length) return c.yMin !== null && c.yMax !== null && c.yMax > c.yMin ? [c.yMin, c.yMax] : [0, 1];
  let lo = Math.min(...ys), hi = Math.max(...ys);
  if (hi === lo) { lo -= 0.5; hi += 0.5; }
  const pad = (hi - lo) * 0.05;
  return [lo - pad, hi + pad];
}

// nice numbers for an axis
function ticks(lo, hi, n) {
  if (n <= 0) return [];
  return Array.from({ length: n + 1 }, (_, i) => lo + (hi - lo) * i / n);
}
const tickText = (v, lo, hi) => { const r = Math.abs(hi - lo); const d = r >= 50 ? 0 : r >= 2 ? 1 : r >= 0.2 ? 2 : 3; return v.toFixed(d); };
function timeText(ms, span) {
  const t = new Date(ms), two = x => String(x).padStart(2, '0');
  const clock = `${two(t.getHours())}:${two(t.getMinutes())}`;
  if (span <= 600) return `${clock}:${two(t.getSeconds())}`;
  return span > 7 * 86400 ? `${t.getMonth() + 1}/${t.getDate()}` : span > 86400 ? `${t.getMonth() + 1}/${t.getDate()} ${clock}` : clock;
}

// The picture: series = { [element name]: [[ms, value], ...] } oldest first. now = the right edge (ms).
// Each channel with an element draws its line against its own axis: Channel 1 on the left, Channel 2 on the right.
export function chartSvg(e = {}, v = {}, series = {}, { now = Date.now(), w = 400, h = 200, note = '' } = {}) {
  const s = chartSettings(e, v), from = now - s.spanSeconds * 1000;
  const used = s.channels.filter(c => c.element);
  const L = 42, R = used.some(c => c.n === 2) ? 42 : 10, T = 8, B = 22;
  const pw = Math.max(10, w - L - R), ph = Math.max(10, h - T - B);
  const X = ms => L + (ms - from) / (now - from) * pw;
  const out = [`<svg class="chartSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="none" font-family="sans-serif" font-size="10">`];
  // grid lines
  for (const y of ticks(T, T + ph, s.hGridLines).slice(1, -1)) out.push(`<line x1="${L}" x2="${L + pw}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#888" stroke-opacity=".25"/>`);
  for (const x of ticks(L, L + pw, s.vGridLines).slice(1, -1)) out.push(`<line y1="${T}" y2="${T + ph}" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" stroke="#888" stroke-opacity=".25"/>`);
  // the time axis
  out.push(`<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" stroke="${esc(s.xAxisColor)}"/>`);
  const nx = Math.max(2, Math.min(6, Math.floor(pw / 80)));
  ticks(from, now, nx).forEach((ms, i) => out.push(`<text x="${X(ms).toFixed(1)}" y="${h - 6}" fill="${esc(s.xAxisColor)}" text-anchor="${i === 0 ? 'start' : i === nx ? 'end' : 'middle'}">${esc(timeText(ms, s.spanSeconds))}</text>`));
  // each channel: its axis, then its line
  for (const c of used) {
    const pts = (series[c.element] ?? []).filter(p => p[0] >= from && p[0] <= now && Number.isFinite(p[1]));
    const [lo, hi] = axisRange(c, pts), Y = val => T + ph - (val - lo) / (hi - lo) * ph;
    const ax = c.n === 1 ? L : L + pw, anchor = c.n === 1 ? 'end' : 'start', dx = c.n === 1 ? -4 : 4;
    out.push(`<line x1="${ax}" x2="${ax}" y1="${T}" y2="${T + ph}" stroke="${esc(c.axisColor)}"/>`);
    for (const t of ticks(lo, hi, 4)) out.push(`<text x="${ax + dx}" y="${(Y(t) + 3).toFixed(1)}" fill="${esc(c.axisColor)}" text-anchor="${anchor}">${tickText(t, lo, hi)}</text>`);
    if (pts.length) {
      const clip = val => Math.max(T, Math.min(T + ph, Y(val)));
      out.push(`<polyline fill="none" stroke="${esc(c.lineColor)}" stroke-width="1.6" stroke-linejoin="round" points="${pts.map(p => `${X(p[0]).toFixed(1)},${clip(p[1]).toFixed(1)}`).join(' ')}"/>`);
    }
  }
  if (!used.length || note) out.push(`<text x="${L + pw / 2}" y="${T + ph / 2}" fill="#999" text-anchor="middle">${esc(note || 'No Device or Widget picked: open its Properties')}</text>`);
  out.push('</svg>');
  return out.join('');
}
