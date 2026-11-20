// A pipe that crosses another pipe with no joint never looks joined (OakBarn Brewery, 2026-11-20: "When a Pipe crosses a
// different pipe with no connect"; "The red looks like a cross fitting", Rule 5.44): the up-and-down pipe passes in front
// and the level pipe goes behind it, with a thin dark edge either side, so it can never be taken for a cross or a tee.
// A joint (pipes sharing an IP, a tee, a cross) is never a crossing: only two pipe lines that cross in the middle of both.

const EDGE = 2;           // px left open from the end of a line: a pipe end on another pipe is a joint, not a crossing

function cut(a, b, c, d) {
  const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0];
  if (!den) return null;                                   // in line or side by side: they never cross
  const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den;
  const lr = Math.hypot(...r), ls = Math.hypot(...s);
  if (t * lr <= EDGE || (1 - t) * lr <= EDGE || u * ls <= EDGE || (1 - u) * ls <= EDGE) return null;
  return [a[0] + t * r[0], a[1] + t * r[1]];
}
const upright = (a, b) => Math.abs(b[1] - a[1]) - Math.abs(b[0] - a[0]);      // more up-and-down than level: above 0

// every place where two pipes on one Tab cross with no joint: front is the pipe drawn in front (the up-and-down one; when
// both lean the same, the one later in the list, which is the one higher in the Layer Order), back the one behind it.
// seg is the front pipe's piece of line through the crossing. Hoses bend and lie where they fall: they are left as drawn.
export function pipeCrossings(pipes) {
  const out = [], list = (pipes || []).filter(p => !p.hose && (p.points || []).length > 1);
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const p = list[i], q = list[j];
    if (p.workspace !== q.workspace) continue;
    for (let a = 1; a < p.points.length; a++) for (let b = 1; b < q.points.length; b++) {
      const sp = [p.points[a - 1], p.points[a]], sq = [q.points[b - 1], q.points[b]], at = cut(...sp, ...sq);
      if (!at) continue;
      const qFront = upright(...sq) >= upright(...sp);
      out.push(qFront ? { front: q, back: p, at, seg: sq, backSeg: sp } : { front: p, back: q, at, seg: sp, backSeg: sq });
    }
  }
  return out;
}

// the small box round a crossing that the front pipe is drawn again in: as long as the back pipe is wide (plus its dark edges)
// along the front pipe, and a little wider than the front pipe across it; more makes it longer along the front pipe (the copy
// of the front pipe reaches past the dark edges so no dark seam shows where the box ends)
export function crossBox({ at, seg }, frontW, backW, more = 0) {
  const [a, b] = seg, L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
  const along = backW / 2 + EDGE + 1 + more, across = frontW / 2 + EDGE + 1;
  return [[-along, -across], [along, -across], [along, across], [-along, across]].map(([s, t]) => [at[0] + ux * s - uy * t, at[1] + uy * s + ux * t]);
}
export const CROSS_EDGE = EDGE;
