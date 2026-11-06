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
  delete p.qdAuto;          // a person moved it: the points are the ones drawn
  // the coupling Skynet put on the hose's loose end when it was drawn goes once nothing is on it any more
  const removed = [];
  const old = was && gs.find(g => g?.id === was && g.kind === 'ip' && g.fitting === 'coupling');
  if (old && !gs.some(g => g?.kind === 'pipe' && (g.from === was || g.to === was))) { config.graphics = gs.filter(g => g !== old); removed.push(old.id); }
  return { ok: true, removed };
}

// ---- A Process connects a Quick Disconnect hose (Fritz, 2026-11-06, Skynet Rule 5.34, Help 142) ----
//   Hose_1.connect = QD_1          onto a Quick Disconnect (or a plain IP) on the hose's Tab
//   Hose_1.connect = Mash_Tun      into the top of a Vessel Widget or Vessel Device on the hose's Tab (the top third is its QD IP)
//   Hose_1.connect = none          the end is taken off and left loose (no flow)
// The drawing moves at once to show where the hose goes; the Process then waits until a person presses Done (lib/engine.js).
export const isQdHose = g => g?.kind === 'pipe' && !!g.hose && !!g.qd;
const isKettle = g => g?.kind === 'vessel' && (g.vesselType || 'vessel') === 'vessel';
const same = (a, b) => typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase();
// a graphic by its Name (Hose_1, QD_1, Mash_Tun), else by its Label when only one has that Label
function byName(gs, name, ok) {
  const n = gs.filter(g => ok(g) && same(g.name, name));
  if (n.length) return n[0];
  const l = gs.filter(g => ok(g) && same(g.label, name));
  return l.length === 1 ? l[0] : null;
}
export function findQdHose(config, name) {
  return byName(config.graphics ?? [], String(name ?? ''), g => g?.kind === 'pipe');
}
// what the name after "connect =" is: { to, where } (to = an IP id, 'vtop:<vessel id>', or null for none), or { error }
export function connectTarget(config, hose, name) {
  const gs = config.graphics ?? [], ws = hose.workspace, n = String(name ?? '').trim(), hn = hose.name || hose.label || 'The hose';
  if (!n) return { error: `${hn}.connect needs the name of a Quick Disconnect or a Vessel, for example ${hn}.connect = QD_1` };
  if (['none', 'loose', 'off'].includes(n.toLowerCase())) return { to: null, where: 'taken off (loose, no flow)' };
  const canJoin = g => g?.kind === 'ip' && !['cap', 'manualValve', 'coupling'].includes(g.fitting) && !g.port;
  const any = byName(gs, n, g => g?.kind === 'vessel' || canJoin(g));
  if (!any) {
    const other = byName(gs, n, g => !!g);
    if (other) return { error: `${hn}.connect: ${n} is not a Quick Disconnect, an IP or a Vessel (a Quick Disconnect hose connects only to those)` };
    return { error: `${hn}.connect: nothing named ${n} (use a Quick Disconnect such as QD_1, or a Vessel's name)` };
  }
  if (any.workspace !== ws) return { error: `${hn}.connect: ${n} is on the ${any.workspace || 'other'} Tab, and ${hn} is on the ${ws} Tab` };
  if (any.kind === 'vessel') {
    if (!isKettle(any)) return { error: `${hn}.connect: ${n} has no top to put a hose in (only a kettle, HLT, mash tun or other vessel has)` };
    return { to: 'vtop:' + any.id, where: `in the top of ${any.label || any.name}` };
  }
  if (any.id === hose.from) return { error: `${hn}.connect: ${n} is the end the hose hangs from` };
  return { to: any.id, where: `on ${any.label || any.name}` };
}
// the names a Process can put after "Hose_1.connect =" (predictive text): Quick Disconnects first, then Vessels, then IPs
export function connectChoices(config, hose) {
  const gs = (config.graphics ?? []).filter(g => g?.workspace === hose.workspace && g.name && g.id !== hose.from);
  return [...gs.filter(g => g.kind === 'ip' && g.fitting === 'qd').map(g => [g.name, 'Quick Disconnect']),
    ...gs.filter(isKettle).map(g => [g.name, g.vdevice ? 'Vessel Device' : 'Vessel']),
    ...gs.filter(g => g.kind === 'ip' && (!g.fitting || g.fitting === 'point') && !g.port).map(g => [g.name, 'IP']),
    ['none', 'take the hose off (loose)']];
}
// put the hose's free end there. The points are only its two ends: each screen hangs it with a sag (public/app.js qdAuto).
export function connectHose(config, hose, to) {
  const pts = hose.points?.length >= 2 ? [hose.points[0], hose.points[hose.points.length - 1]] : [[0, 0], [0, 0]];
  const r = moveHoseEnd(config, { id: hose.id, to, points: pts });
  if (r.ok) hose.qdAuto = true;
  return r;
}
