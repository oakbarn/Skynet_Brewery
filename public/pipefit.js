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
