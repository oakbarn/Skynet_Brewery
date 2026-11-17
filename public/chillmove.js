// Moving an Immersion Chiller by hand on a live Tab (OakBarn Brewery, 2026-11-17: "Immersion Chillers on a Tab Can be Free Floating
// but later moved to a Vessel similar to hand a QD Hose on a Live Tab"; Rule 5.42, Help 200). Shared by the Panel (public/app.js)
// and the Brain (lib/chiller.js).
// Only an immersion chiller moves: a chilling coil with 2 IPs, In and Out. A plate or counterflow chiller (a Chillzilla too) or a
// jacketed coil is part of the manifold and stays put.
export const isImmersion = g => g?.kind === 'vessel' && g.vesselType === 'ccoil' && Number(g.liquidPorts ?? 2) === 2 && !g.ports?.in2?.installed &&
  !/jacket/i.test(g.vtype || '') && !/chillzilla/i.test(`${g.name ?? ''} ${g.template ?? ''} ${g.label ?? ''}`);
// a vessel a chiller can go into: a kettle type vessel or a Stove Top Vessel (never another chiller or a fitting)
export const takesChiller = g => g?.kind === 'vessel' && ['vessel', 'stoveTop', 'stoveTopOut', undefined].includes(g.vesselType) && !g.chillerOn;
// where a chiller sits in a vessel: in the lower middle, under its readings (the same spot place_Chiller uses)
export function spotIn(v, c) {
  const vw = v.w || 260, vh = v.h || 320, w = c.w || 120, h = c.h || 120;
  return [Math.round((v.x || 0) + (vw - w) / 2), Math.round((v.y || 0) + vh * 0.62 - h / 2)];
}

// A Chiller Bundle Equipment Template put on a Tab (OakBarn Brewery, 2026-11-17, a Rule 4.1 exception): its pieces get new ids and
// names, every reference between them is followed (a hose's ends, an IP on the Ice Water Can, a Quick Disconnect on its IP ...), and
// they are moved next to the chiller, which is at dx, dy. The chiller's own IPs (In and Out) are already there (ownIps).
//   b: the Template's bundle { chiller, graphics, elements }; chillerId: the new chiller's id; taken: names already used (any case)
export function unbundle(b, { chillerId, ownIps = [], taken = [], newId, dx = 0, dy = 0 }) {
  const map = { [b.chiller]: chillerId };
  for (const q of b.graphics) if (q.attachTo === b.chiller && q.port) { const n = ownIps.find(x => x.port === q.port); if (n) map[q.id] = n.id; }
  for (const q of b.graphics) if (!map[q.id]) map[q.id] = newId();
  const used = new Set(taken.map(n => String(n).toLowerCase())), names = {};
  const free = base => { let n = base, i = 2; while (used.has(n.toLowerCase())) n = `${base}_${i++}`; used.add(n.toLowerCase()); return n; };
  for (const e of b.elements) names[e.name] = free(e.name);
  const ref = v => {
    if (typeof v !== 'string') return v;
    if (map[v]) return map[v];
    let m = /^(eq|vtop):([^:]+)(.*)$/.exec(v); if (m && map[m[2]]) return `${m[1]}:${map[m[2]]}${m[3]}`;
    m = /^(dev|pspot):([^:]+)(:.*)$/.exec(v); if (m && names[m[2]]) return `${m[1]}:${names[m[2]]}${m[3]}`;
    return v;
  };
  const own = new Set(ownIps.map(x => x.id)), copy = x => JSON.parse(JSON.stringify(x));
  const graphics = b.graphics.filter(q => !own.has(map[q.id])).map(q => {
    const g = copy(q); g.id = map[q.id];
    for (const k of ['attachTo', 'from', 'to', 'onVessel', 'capOn', 'qdOn', 'chillerOn', 'chillerHose']) if (g[k] !== undefined) g[k] = ref(g[k]);
    if (g.x !== undefined) g.x += dx; if (g.y !== undefined) g.y += dy;
    if (Array.isArray(g.points)) g.points = g.points.map(([a, z]) => [a + dx, z + dy]);
    if (g.kind === 'pipe' && g.hose) { let i = 1; while (used.has(`hose_${i}`)) i++; g.name = `Hose_${i}`; g.label = g.name.toLowerCase(); used.add(g.name.toLowerCase()); }
    return g;
  });
  const elements = b.elements.map(q => { const e = copy(q); e.name = names[q.name]; e.x = (e.x || 0) + dx; e.y = (e.y || 0) + dy; return e; });
  return { graphics, elements };
}
