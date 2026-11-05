// Quick Disconnect hoses (Fritz, 2026-11-05, Skynet Rule 5.28, Help 127).
// The free end of a Quick Disconnect hose can be moved at any time, not only in Edit layout: on Brew Day an operator moves the
// hose from source to source. The browser sends where the end went; this checks it and changes only that hose in the layout.
// `to` is one of:
//   - null: a loose end (no flow);
//   - 'vtop:<vessel id>': in the top of a vessel on the same Tab (dropped anywhere on the vessel's top third);
//   - an IP on the same Tab: an IP widget or Quick Disconnect ('<id>'), a pump or valve IP ('dev:<name>:in|out'), or an
//     equipment port ('eq:<id>:<port>').
const num = v => typeof v === 'number' && Number.isFinite(v) && Math.abs(v) < 1e6;

export function moveHoseEnd(config, { id, to = null, points } = {}) {
  const gs = config.graphics ?? [];
  const p = gs.find(g => g?.id === id && g.kind === 'pipe');
  if (!p) return { error: 'That hose is gone (reload the page)' };
  if (!p.hose || !p.qd) return { error: `${p.name || 'That pipe'} is not a Quick Disconnect hose: only those move outside Edit layout (Rule 5.28)` };
  if (p.locked) return { error: `${p.name || 'That hose'} is locked` };
  if (!Array.isArray(points) || points.length < 2 || points.length > 50 || !points.every(q => Array.isArray(q) && q.length === 2 && q.every(num)))
    return { error: 'Bad hose points' };
  const ws = p.workspace;
  if (to !== null) {
    if (typeof to !== 'string' || to === p.from) return { error: 'The hose cannot go there' };
    let found = false;
    if (to.startsWith('vtop:')) {
      const v = gs.find(g => g?.id === to.slice(5));
      found = v?.kind === 'vessel' && v.workspace === ws && (v.vesselType || 'vessel') === 'vessel';
    } else if (to.startsWith('dev:')) {
      const name = to.slice(4, to.lastIndexOf(':')), end = to.slice(to.lastIndexOf(':') + 1);
      found = ['in', 'out'].includes(end) && (config.elements ?? []).some(e => e?.name === name && e.workspace === ws);
    } else if (to.startsWith('eq:')) {
      found = gs.some(g => g?.id === to.slice(3, to.lastIndexOf(':')) && g.workspace === ws);
    } else found = gs.some(g => g?.id === to && g.kind === 'ip' && g.workspace === ws && g.fitting !== 'cap');
    if (!found) return { error: 'The hose cannot go there: that IP or vessel is not on this Tab' };
  }
  const was = p.to;
  p.to = to;
  p.points = points.map(([x, y]) => [Math.round(x), Math.round(y)]);
  // the coupling Skynet put on the hose's loose end when it was drawn goes once nothing is on it any more
  const removed = [];
  const old = was && gs.find(g => g?.id === was && g.kind === 'ip' && g.fitting === 'coupling');
  if (old && !gs.some(g => g?.kind === 'pipe' && (g.from === was || g.to === was))) { config.graphics = gs.filter(g => g !== old); removed.push(old.id); }
  return { ok: true, removed };
}
