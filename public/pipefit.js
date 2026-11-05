// Pipes run only Horizontal, Vertical or at 45 degrees (Fritz, 2026-11-02, Rule 5.19). A pipe is one straight piece; it changes
// direction only at a fitting (a 90 or 45 elbow, a tee, a cross). Used by the browser (public/app.js) and by the Brain when it
// brings an older Schema up to the rule (lib/pipes.js).
//
// The 8 directions, clockwise on the screen (y grows downwards): 0 E, 1 SE, 2 S, 3 SW, 4 W, 5 NW, 6 N, 7 NE.
export const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

// the nearest of the 8 directions for a step dx, dy
export const dirOf = (dx, dy) => ((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 8) + 8) % 8;

// is the step from a to b Horizontal, Vertical or exactly 45 degrees (within tol pixels)?
export function onAngle(a, b, tol = 1) {
  const dx = Math.abs(b[0] - a[0]), dy = Math.abs(b[1] - a[1]);
  if (dx <= tol && dy <= tol) return false;           // no length: no direction
  return dx <= tol || dy <= tol || Math.abs(dx - dy) <= tol;
}

// The end of a pipe from a towards c, kept on the nearest allowed direction. Horizontal and Vertical take c's x or y as it is;
// a 45 takes the distance along the 45 line. Returns the end and its direction.
export function angledEnd(a, c) {
  const d = dirOf(c[0] - a[0], c[1] - a[1]), [ux, uy] = DIRS[d];
  if (!ux) return { c: [a[0], c[1]], d };
  if (!uy) return { c: [c[0], a[1]], d };
  const t = Math.round(((c[0] - a[0]) * ux + (c[1] - a[1]) * uy) / 2);
  return { c: [a[0] + ux * t, a[1] + uy * t], d };
}

// Slide point c onto the line through a in direction d (the part of a pipe that is not on its line is dropped)
export function alongLine(a, d, c) {
  const [ux, uy] = DIRS[d], n = ux && uy ? 2 : 1, t = ((c[0] - a[0]) * ux + (c[1] - a[1]) * uy) / n;
  return [Math.round(a[0] + ux * t), Math.round(a[1] + uy * t)];
}

// The fitting drawn at a joint, from the directions the pipes leave it in. The fitting pictures (FIT_SVG in app.js) are drawn
// with these arms when not turned: elbow90 W + S, elbow45 W + SE, tee W + E + S, cross all four. Turning by k * 45 degrees
// (clockwise) moves every arm k steps round. Two pipes in line = a coupling (its collar is turned across the pipe). Anything no
// fitting fits (two pipes 45 degrees apart, odd tees) stays a coupling and is listed as a problem (ok: false).
export const ARMS = { elbow90: [4, 2], elbow45: [4, 1], tee: [4, 0, 2], cross: [0, 2, 4, 6] };
export function fitFor(dirs) {
  const want = [...new Set(dirs)].sort((x, y) => x - y);
  if (want.length === 1) return { fitting: 'coupling', rotate: String((want[0] * 45) % 180), ok: true };
  if (want.length === 2 && want[1] - want[0] === 4) return { fitting: 'coupling', rotate: String((want[0] * 45) % 180), ok: true };
  for (const [fitting, arms] of Object.entries(ARMS)) {
    if (arms.length !== want.length) continue;
    for (let k = 0; k < 8; k++) if (arms.map(a => (a + k) % 8).sort((x, y) => x - y).join() === want.join()) return { fitting, rotate: String(k * 45), ok: true };
  }
  return { fitting: 'coupling', rotate: '0', ok: false };
}

// A pump or valve put on a straight pipe cuts it (Fritz, 2026-11-04, Rule 5.26). a, b: the pipe's two ends. box: the item's
// { x, y, w, h }. ports: its two IPs { id, c: [x, y], f: [ux, uy] } where f is the way the opening faces (out of the item).
// Two ways it can sit on the pipe:
//  - between the ends (both ends outside the item): the pipe is cut in two. Each piece runs on in line into an IP that faces
//    along the pipe towards it. A port that faces across the pipe (a pump's outlet on top) gets its piece taken round with
//    elbows: out of the port, across past the side of the item, and back onto the pipe's line (Rule 5.19: turns only at fittings).
//  - over one end: the pipe is made shorter. An open end (its own coupling) goes away and the pipe joins one IP; an end on a
//    tee, an elbow or another IP stays there: the item slides back along the pipe, clear of it, and is joined to both sides
//    (Fritz, 2026-11-04: "it needs both IPs").
// The item moves across the pipe (not along it) so the IP sits on the pipe's line (Rule 5.23).
// Returns null when the pipe does not run through the item, { ok: false, why } when it does but can't be cut, else
// { ok: true, mode, shift: [dx, dy], joints: [[x, y] ...], pieces: [{ from, to, pts }], drop } where from / to are 'A' or 'B'
// (the pipe's old ends), a port id, or 'J0', 'J1' ... (the joints), and drop is the end ('A' or 'B') whose coupling goes away.
export function splitAt(a, b, box, ports, { gap = 30, aOpen = false, bOpen = false, slid = false } = {}) {
  const ax = a[1] === b[1] && a[0] !== b[0] ? 0 : a[0] === b[0] && a[1] !== b[1] ? 1 : -1;
  if (ax < 0 || ports.length !== 2) return null;                        // only a Horizontal or Vertical pipe
  const pp = 1 - ax, line = a[pp], T = 3;
  const lo = [box.x, box.y], hi = [box.x + box.w, box.y + box.h];
  if (line < lo[pp] - T || line > hi[pp] + T) return null;            // the pipe passes by
  const inside = q => q[ax] >= lo[ax] - T && q[ax] <= hi[ax] + T;
  const aIn = inside(a), bIn = inside(b);
  const along = q => q.f && !q.f[pp] && q.f[ax];
  const faces = (q, end) => along(q) && (end[ax] - q.c[ax]) * q.f[ax] > 0;
  const shiftFor = q => { const s = [0, 0]; s[pp] = Math.round(line - q.c[pp]); return s; };
  const at = (q, s) => [Math.round(q.c[0] + s[0]), Math.round(q.c[1] + s[1])];
  if (aIn && bIn) return null;                                          // the whole pipe is under it
  if ((aIn || bIn) && slid) return { ok: false, why: 'the pipe is too short to put it in' };
  if (aIn || bIn) {                                                     // over one end: make the pipe shorter
    const [cov, open, far] = aIn ? ['A', aOpen, b] : ['B', bOpen, a];
    if (!open) {         // that end is on a tee, an elbow or another IP: slide it back along the pipe, clear of that end, and cut
      const E = aIn ? a : b, sg = Math.sign(E[ax] - far[ax]), d = [0, 0];
      d[ax] = Math.round(E[ax] - sg * (2 * gap + 5) - (sg > 0 ? hi[ax] : lo[ax]));
      const nb = { ...box, x: box.x + d[0], y: box.y + d[1] }, np = ports.map(q => ({ ...q, c: [q.c[0] + d[0], q.c[1] + d[1]] }));
      const r = splitAt(a, b, nb, np, { gap, aOpen, bOpen, slid: true });
      if (!r) return { ok: false, why: 'the pipe is too short to put it in' };
      return r.ok ? { ...r, mode: 'end', shift: [r.shift[0] + d[0], r.shift[1] + d[1]] } : r;
    }
    const q = ports.find(p => faces(p, far));
    if (q) {
      const s = shiftFor(q), c = at(q, s);
      return { ok: true, mode: 'end', shift: s, joints: [], drop: cov, pieces: [cov === 'B' ? { from: 'A', to: q.id, pts: [[...a], c] } : { from: q.id, to: 'B', pts: [c, [...b]] }] };
    }
    // no IP faces the pipe: the one that opens across it is taken round with elbows to the shorter pipe (it does not move)
    const p2 = ports.find(p => p.f && !p.f[ax] && p.f[pp]);
    if (!p2) return { ok: false, why: 'none of its IPs faces along the pipe' };
    const r = roundTo(p2, p2.c.map(Math.round), far, [0, 0]);
    if (!r) return { ok: false, why: 'there is not enough pipe to go round it' };
    const keep = cov === 'B' ? 'A' : 'B';
    return { ok: true, mode: 'end', shift: [0, 0], joints: r.joints, drop: cov, pieces: [...r.pieces, keep === 'B' ? { from: 'J2', to: 'B', pts: [r.joints[2], [...b]] } : { from: 'A', to: 'J2', pts: [[...a], r.joints[2]] }] };
  }
  if (!(Math.min(a[ax], b[ax]) < lo[ax] && Math.max(a[ax], b[ax]) > hi[ax])) return null;
  const qa = ports.find(p => faces(p, a)), qb = ports.find(p => p !== qa && faces(p, b));
  if (qa && qb) {                                                       // both IPs on the pipe's line (a valve): two straight pieces
    const s = shiftFor(qa), ca = at(qa, s), cb = at(qb, s);
    if (Math.abs(cb[pp] - line) > 1.5) return { ok: false, why: 'its two IPs are not in line' };
    return { ok: true, mode: 'mid', shift: s, joints: [], drop: null, pieces: [{ from: 'A', to: qa.id, pts: [[...a], ca] }, { from: qb.id, to: 'B', pts: [cb, [...b]] }] };
  }
  const p1 = qa || qb;
  if (!p1) return { ok: false, why: 'none of its IPs faces along the pipe' };
  const p2 = ports.find(p => p !== p1);
  if (!p2.f || p2.f[ax] || !p2.f[pp]) return { ok: false, why: 'its other IP faces the wrong way' };
  const s = shiftFor(p1), c1 = at(p1, s), X = qa ? 'A' : 'B', y = qa ? b : a;
  const r = roundTo(p2, at(p2, s), y, s);
  if (!r) return { ok: false, why: 'there is not enough pipe on that side to go round it' };
  const J = r.joints[2];
  const first = X === 'A' ? { from: 'A', to: p1.id, pts: [[...a], c1] } : { from: p1.id, to: 'B', pts: [c1, [...b]] };
  return { ok: true, mode: 'mid', shift: s, joints: r.joints, drop: null, pieces: [first, ...r.pieces,
    X === 'A' ? { from: 'J2', to: 'B', pts: [J, [...b]] } : { from: 'A', to: 'J2', pts: [[...a], J] }] };
  // the way round for a port opening across the pipe: out of it (past the item), across past the item's side towards end y,
  // and back onto the pipe's line. Three joints (they become 90 degree elbows) and three pipes; null when y is too close.
  function roundTo(q, c2, y, s) {
    const sg = Math.sign(y[ax] - c2[ax]), u = q.f[pp], slo = lo[pp] + s[pp], shi = hi[pp] + s[pp];
    const E = [0, 0], K = [0, 0], J = [0, 0];
    E[ax] = c2[ax]; E[pp] = Math.round(u < 0 ? Math.min(c2[pp] - gap, slo - gap / 2) : Math.max(c2[pp] + gap, shi + gap / 2));
    K[pp] = E[pp]; K[ax] = Math.round((sg > 0 ? hi[ax] : lo[ax]) + sg * gap);
    J[ax] = K[ax]; J[pp] = line;
    if (!sg || (y[ax] - J[ax]) * sg <= T) return null;
    return { joints: [E, K, J], pieces: [{ from: q.id, to: 'J0', pts: [c2, E] }, { from: 'J0', to: 'J1', pts: [E, K] }, { from: 'J1', to: 'J2', pts: [K, J] }] };
  }
}
