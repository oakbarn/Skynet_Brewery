// Paste an Equipment Profile onto a Tab (Rule 19.6 #2). OakBarn Brewery, 2026-11-17: "Equipment Profiles are a Thing that can be added
// to a Tab in a Schema but like copy and Paste. All of the Vessels Pipes Interfaces etc almost like copying the 3 Vessel Schema but only
// Physical Hardware ... Vessels Only, Manifold Only (Include Pipes and Valve and Widgets with Ips) or Both."
// The profile keeps all of its Tab's hardware (lib/schemas.js hardwareOf): the drawing (vessels, IPs, fittings, pipes, hoses), every
// Device on a board with its Name, Properties, Interface and Port, and the boards. These two functions work out what a paste brings
// (pastePieces) and what it does on the Tab it goes to (pastePlan); public/app.js shows the list, puts the pieces on the 🔨 Build Tab
// (Rule 4.1) and gives ↩ Undo. Nothing here changes the Schema.

export const PASTE_WHAT = [['both', 'Both'], ['vessels', 'Vessels Only'], ['manifold', 'Manifold Only']];
const SLOT_REF = /^dev:@([\w-]+):(\w+)$/;
const DEV_REF = /^dev:(.+):(\w+)$/;
const HOOKS = ['attachTo', 'onVessel', 'capOn', 'qdOn', 'chillerOn'];        // what a piece sits on (an immersion chiller sits in its vessel)
const REFS = ['attachTo', 'from', 'to', 'onVessel', 'capOn', 'qdOn', 'chillerOn'];
const clone = x => JSON.parse(JSON.stringify(x ?? null));
const low = s => String(s ?? '').toLowerCase();
export const isVesselPiece = g => g?.kind === 'vessel' && (g.vesselType === 'vessel' || !g.vesselType);
// a Device's Port on its board: the pin (channel) or the 1-Wire Index (circuit and number, Rule 6.37); none: it has no Port to clash
export const portOf = e => e?.device === undefined || e.device === '' ? null
  : e.channel !== undefined && e.channel !== '' ? `${e.device}|pin|${e.channel}` : e.probeIndex !== undefined && e.probeIndex !== '' ? `${e.device}|1w${Math.max(1, Math.trunc(+e.owCircuit) || 1)}|${e.probeIndex}` : null;

// What a paste brings. what: 'both', 'vessels' (each vessel with everything on it: its IPs, fittings, heaters and probes) or 'manifold'
// (all of the manifold, pumps and valves too, with its pipes and hoses: "All of the manifold. Just Not the Vessels"). A pipe end whose
// piece did not come stays OPEN, so a vessel can be joined to it (OakBarn Brewery, 2026-11-17: "Open so a Vessel could be attached").
export function pastePieces(p, what = 'both') {
  const hw = p?.hardware || {}, graphics = clone(p?.graphics || []), elements = clone(hw.elements || []);
  const bySlot = new Map(elements.filter(e => e.eqSlot).map(e => [e.eqSlot, e]));
  for (const g of graphics) if (g.kind === 'pipe') for (const k of ['from', 'to']) {
    const m = SLOT_REF.exec(g[k] ?? ''); if (!m) continue;
    if (bySlot.has(m[1])) g[k] = `dev:${bySlot.get(m[1]).name}:${m[2]}`; else delete g[k];     // a pump or valve the profile has no Port for (made before)
  }
  // the vessel side: each vessel and everything on it (and on that, and so on)
  const vIds = new Set(graphics.filter(isVesselPiece).map(g => g.id)), vEls = new Set();
  for (let grew = true; grew;) {
    grew = false;
    for (const g of graphics) if (g.kind !== 'pipe' && !vIds.has(g.id) && HOOKS.some(k => g[k] && (vIds.has(g[k]) || vEls.has(g[k])))) { vIds.add(g.id); grew = true; }
    for (const e of elements) if (!vEls.has(e.name) && e.integratedIn && (vIds.has(e.integratedIn) || vEls.has(e.integratedIn))) { vEls.add(e.name); grew = true; }
  }
  const keepG = g => what === 'both' || (what === 'vessels' ? g.kind !== 'pipe' && vIds.has(g.id) : !vIds.has(g.id));
  const keepE = e => what === 'both' || (what === 'vessels' ? vEls.has(e.name) : !vEls.has(e.name));
  const gs = graphics.filter(keepG), es = elements.filter(keepE);
  const ids = new Set(gs.map(g => g.id)), names = new Set(es.map(e => e.name));
  const there = v => ids.has(v) || names.has(v);
  let open = 0;
  for (const g of gs) {
    if (g.kind === 'pipe') {
      for (const k of ['from', 'to']) { if (!g[k]) continue; const m = DEV_REF.exec(g[k]); if (!(m ? names.has(m[1]) : ids.has(g[k]))) { delete g[k]; open++; } }
    }
  }
  const out = gs.filter(g => g.kind === 'pipe' || HOOKS.every(k => !g[k] || there(g[k])));     // a piece whose host did not come stays behind
  for (const e of es) if (e.integratedIn && !there(e.integratedIn)) { delete e.integratedIn; delete e.integratedAs; }
  const used = new Set(es.map(e => e.device).filter(Boolean));
  return { graphics: out, elements: es, boards: clone((hw.boards || []).filter(b => used.has(b.name))), open };
}

// What the paste does on the Tab `tab` of the Schema `c` (the Edit layout draft): the hardware already there that is the same as the
// profile's (the same board and Port, the same slot, or a vessel with the same Name) is replaced, with everything on it and the pipes
// joined to it (OakBarn Brewery, 2026-11-17: "the existing one one the Tab are deleted and replaced by the Equipment Profile"; "A Same
// Tab"). A board already used on another Tab stops the paste (blocked: why). `build`: the 🔨 Build Tab's name (its unfinished pieces
// keep their Ports). Pieces whose id or Name is taken by something that stays get a new one (renames: old -> new).
export function pastePlan(c, tab, pieces, build = '') {
  const els = c.elements || [], gfx = c.graphics || [], boards = c.devices || [];
  const onTab = x => x.workspace === tab || (build && x.workspace === build && x.buildTo === tab);
  // a board on another Tab: never split by a paste (Rule 19.6 #2; its ID never changes, Rule 3.2)
  for (const b of pieces.boards) {
    const other = els.find(e => e.device === b.name && !onTab(e) && e.workspace !== build);
    if (other) return { blocked: `The board "${b.name}" is already used on the Tab "${other.workspace}" (${other.label || other.name}). One board is never split between Tabs by a paste, so nothing was pasted. Paste onto the Tab "${other.workspace}", or start a new Schema from this profile.` };
    const twin = !boards.some(d => d.name === b.name) && b.id && boards.find(d => String(d.id ?? '').toUpperCase() === String(b.id).toUpperCase());
    if (twin) return { blocked: `The board "${b.name}" has the Interface ID ${b.id}, and the Interface "${twin.name}" of this Schema already has it. Interface IDs are unique and never change (Rule 3.2), so nothing was pasted.` };
  }
  const ports = new Map(pieces.elements.map(e => [portOf(e), e]).filter(([k]) => k)), slots = new Map(pieces.elements.filter(e => e.eqSlot).map(e => [e.eqSlot, e]));
  const vNames = new Map(pieces.graphics.filter(g => g.kind === 'vessel' && g.name).map(g => [low(g.name), g]));
  const gone = new Set(), stands = new Map();          // stands: the old Device each new one replaces (it keeps its hidden key)
  for (const e of els) {
    if (!onTab(e)) continue;
    const n = ports.get(portOf(e)) || (e.eqSlot && slots.get(e.eqSlot));
    if (n) { gone.add(e); if (!stands.has(n)) stands.set(n, e); }
  }
  for (const g of gfx) if (onTab(g) && g.kind === 'vessel' && g.name && vNames.has(low(g.name))) gone.add(g);
  // a Device on another Tab (or an unfinished Build) on a Port the paste brings: a Port is never given to two Devices (Rule 6.1)
  for (const e of els) {
    if (onTab(e) || gone.has(e)) continue;
    const n = ports.get(portOf(e));
    if (n) return { blocked: `${e.label || e.name} on ${e.workspace === build ? 'the 🔨 Build Tab' : `the Tab "${e.workspace}"`} already has the Port of ${n.label || n.name} (${n.device}). A Port is never given to two Devices (Rule 6.1), so nothing was pasted.` };
  }
  // everything on what goes, and the pipes joined to it
  const goneIds = () => new Set([...gone].map(x => x.id).filter(Boolean)), goneNames = () => new Set([...gone].map(x => x.name).filter(Boolean));
  for (let grew = true; grew;) {
    grew = false; const gi = goneIds(), gn = goneNames();
    for (const g of gfx) if (onTab(g) && !gone.has(g) && g.kind !== 'pipe' && HOOKS.some(k => g[k] && (gi.has(g[k]) || gn.has(g[k])))) { gone.add(g); grew = true; }
    for (const e of els) if (onTab(e) && !gone.has(e) && e.integratedIn && (gi.has(e.integratedIn) || gn.has(e.integratedIn))) { gone.add(e); grew = true; }
  }
  const gi = goneIds(), gn = goneNames(), touches = v => !!v && (gi.has(v) || gn.has(DEV_REF.exec(v)?.[1]));
  const bringsPipes = pieces.graphics.some(g => g.kind === 'pipe');
  const opened = [];                                   // a pipe that stays: its end on what goes is let go (left open)
  for (const g of gfx) if (onTab(g) && g.kind === 'pipe' && !gone.has(g) && (touches(g.from) || touches(g.to))) { if (bringsPipes) gone.add(g); else opened.push(g); }
  // new ids and Names where they are taken by something that stays
  const keepG = gfx.filter(g => !gone.has(g)), keepE = els.filter(e => !gone.has(e));
  const ids = new Set(keepG.map(g => g.id)), names = new Set([...keepE, ...keepG].map(x => low(x.name)).filter(Boolean));
  const renames = new Map(), idMap = new Map();
  for (const g of pieces.graphics) if (ids.has(g.id)) { let n; do n = 'g' + Math.random().toString(36).slice(2, 10); while (ids.has(n)); idMap.set(g.id, n); ids.add(n); } else ids.add(g.id);
  for (const x of [...pieces.elements, ...pieces.graphics]) {
    if (!x.name) continue;
    if (names.has(low(x.name))) { let i = 2; while (names.has(low(`${x.name}_${i}`))) i++; renames.set(x.name, `${x.name}_${i}`); }
    names.add(low(renames.get(x.name) ?? x.name));
  }
  return { blocked: null, gone: [...gone], opened, stands, renames, idMap, newBoards: pieces.boards.filter(b => !boards.some(d => d.name === b.name)) };
}

// put the new ids and Names into the pieces (every setting that points at one follows it)
export function applyRenames(pieces, { renames, idMap }) {
  const all = [...pieces.elements, ...pieces.graphics];
  const swap = v => { if (typeof v !== 'string') return v; if (idMap.has(v)) return idMap.get(v); if (renames.has(v)) return renames.get(v);
    const m = DEV_REF.exec(v); return m && renames.has(m[1]) ? `dev:${renames.get(m[1])}:${m[2]}` : v; };
  const walk = o => { for (const k of Object.keys(o)) { if (o[k] && typeof o[k] === 'object') walk(o[k]); else o[k] = swap(o[k]); } };
  for (const g of pieces.graphics) if (idMap.has(g.id)) g.id = idMap.get(g.id);
  for (const x of all) { const nm = x.name; walk(x); if (nm && renames.has(nm)) x.name = renames.get(nm); }
  return pieces;
}
// The profile's numbers that would change on the Tab's own profile ("Brewhouse efficiency 74 % → 72 %"), as [field, label, from, to]
export function numberChanges(fields, from, to) {
  if (!from || !to || from.id === to.id) return [];
  return fields.filter(f => to[f[0]] !== undefined && to[f[0]] !== null && +to[f[0]] !== +from[f[0]]).map(f => [f[0], f[1], from[f[0]], to[f[0]]]);
}
export { REFS };
