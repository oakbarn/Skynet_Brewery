// Pipes run only Horizontal, Vertical or at 45 degrees, and change direction only at a fitting (Fritz, 2026-11-02, Rule 5.19).
// The old way (one pipe with bends in it, or any angle) is retired. When a Schema is loaded, every pipe that is not one straight
// piece is cut at its bends into straight pipes, and each bend gets a joint that is drawn as the fitting it needs (a 90 or
// 45 elbow). A piece at some other angle is turned to the nearest allowed direction; if its far end then misses the IP it was
// on, that end lets go (it gets an open-end coupling, shown with a red ring in Edit layout). Hoses bend, so they are left alone.
// Backward compatibility is not kept (Rule 15.2).
import { dirOf, onAngle, angledEnd, fitFor } from '../public/pipefit.js';

const PREFIX = { coupling: 'Coupling', elbow90: 'Elbow', elbow45: 'Elbow45', tee: 'Tee', cross: 'Cross' };
const same = (a, b) => a[0] === b[0] && a[1] === b[1];

function nextName(prefix, used) {
  let n = 1; while (used.has(`${prefix}_${n}`.toLowerCase())) n++;
  const name = `${prefix}_${n}`; used.add(name.toLowerCase()); return name;
}

// Is this pipe already one straight piece at an allowed angle?
export const isStraightPipe = p => p?.kind === 'pipe' && !p.hose && Array.isArray(p.points) && p.points.length === 2 && onAngle(p.points[0], p.points[1], 0.5);

// Brings every pipe in c.graphics up to the rule. Returns a list of what changed (empty: nothing to do).
export function straightenPipes(c) {
  const gs = c.graphics ?? [], report = [];
  const used = new Set([...gs.map(g => g.name), ...(c.elements ?? []).map(e => e.name)].filter(Boolean).map(n => String(n).toLowerCase()));
  const out = [];
  for (const p of gs) {
    if (p.kind !== 'pipe' || p.hose) { out.push(p); continue; }
    if (isStraightPipe(p)) { if (!p.straight) p.straight = true; out.push(p); continue; }
    const raw = (p.points ?? []).map(q => [Math.round(+q[0] || 0), Math.round(+q[1] || 0)]).filter((q, i, all) => !i || !same(q, all[i - 1]));
    if (raw.length < 2) { out.push(p); continue; }
    // walk the old points: each piece keeps the nearest allowed direction; pieces running on in the same direction join up
    const pts = [raw[0]], dirs = [];
    for (let i = 1; i < raw.length; i++) {
      const a = pts[pts.length - 1], e = angledEnd(a, raw[i]);
      if (same(e.c, a)) continue;
      if (dirs.length && dirs[dirs.length - 1] === e.d) pts[pts.length - 1] = e.c;
      else { pts.push(e.c); dirs.push(e.d); }
    }
    if (pts.length < 2) { out.push(p); continue; }
    const missed = !same(pts[pts.length - 1], raw[raw.length - 1]);
    const ws = p.workspace, origTo = p.to, pieces = [], joints = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const piece = i === 0 ? p : { ...p, id: `${p.id}_${i + 1}`, label: '' };
      if (i) { delete piece.name; delete piece.key; delete piece.labelVisible; }
      piece.points = [pts[i], pts[i + 1]]; piece.straight = true;
      pieces.push(piece);
    }
    // a joint at every bend, drawn as the fitting the two pieces need
    for (let i = 1; i < pts.length - 1; i++) {
      const c0 = pts[i], back = dirOf(pts[i - 1][0] - c0[0], pts[i - 1][1] - c0[1]), on = dirOf(pts[i + 1][0] - c0[0], pts[i + 1][1] - c0[1]);
      const f = fitFor([back, on]);
      const j = { id: `${p.id}_j${i}`, kind: 'ip', fitting: f.fitting, autoFit: true, workspace: ws, x: c0[0] - 15, y: c0[1] - 15, w: 30, h: 30, label: '', color: '#9aa0a6', rotate: f.rotate };
      j.name = nextName(PREFIX[f.fitting] || 'Coupling', used);
      joints.push(j);
      pieces[i - 1].to = j.id; pieces[i].from = j.id;
    }
    const last = pieces[pieces.length - 1];
    if (origTo) last.to = origTo; else delete last.to;
    if (missed && origTo) {      // turned to the nearest allowed direction, the end no longer reaches its IP: it lets go
      const e = pts[pts.length - 1], d = dirOf(pts[pts.length - 2][0] - e[0], pts[pts.length - 2][1] - e[1]);
      const open = { id: `${p.id}_end`, kind: 'ip', fitting: 'coupling', autoFit: true, workspace: ws, x: e[0] - 15, y: e[1] - 15, w: 30, h: 30, label: '', color: '#9aa0a6', rotate: fitFor([d]).rotate };
      open.name = nextName('Coupling', used);
      joints.push(open); last.to = open.id;
    }
    for (const piece of pieces.slice(1)) piece.name = nextName('Pipe', used);
    out.push(...pieces, ...joints);
    report.push(`${p.name || p.id} (${ws}): ${pieces.length === 1 ? 'turned to the nearest allowed direction' : `cut into ${pieces.length} straight pipes with ${pts.length - 2} elbow${pts.length > 3 ? 's' : ''}`}${missed && origTo ? '; its end no longer reached its IP, so it lets go there' : ''}`);
  }
  if (report.length) c.graphics = out;
  return report;
}
