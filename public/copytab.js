// Copy a whole Tab on New tab (OakBarn Brewery, Panel Updates Sandbox entry 18: "Pipes cannot be moved individually to a different tab.
// It is an all or nothing buy making a copy to put on a differnt new tab as it is the entire tab that would be copied"). Rule 4.8, Help 236.
// Everything on the Tab is copied onto the new Tab, in the same places:
// - every Device becomes a Clone (Rule 4.4): the Clone and its parent are the same "who", only another picture on the screen, and a
//   Process still commands only the parent. A Clone already on the Tab becomes another Clone of the same parent.
// - every Widget becomes what the user picked: a Clone ('clone') or a new Widget of its own ('new', with a new Suggested Name, Rule 3.14).
// - pipes, hoses, IPs, fittings, vessels, pictures and text are new items with new ids and new names in the background (Pipe_N, Hose_N ...).
// Nothing here changes the Schema: public/app.js puts the pieces in the Edit layout draft, and Save layout keeps them.
const clone = x => JSON.parse(JSON.stringify(x ?? null));
const low = s => String(s ?? '').toLowerCase();
const DEV_END = /^(dev|pspot):(.+?):([^:]+)(?::([^:]+))?$/;      // a pipe end on a Device's (or Widget's) own IP: dev:<name>:in
const ID_END = /^(eq|vtop|hbspot|bend):([^:]+)(:.*)?$/;           // a pipe end on a drawn item's own IP: eq:<id>:out
// a setting that is the item's own words, never a pointer to another item
const OWN_TEXT = new Set(['name', 'displayName', 'label', 'text', 'description', 'units', 'unit', 'onText', 'offText', 'activeText', 'initial']);
// a name inside Process text (lib/renames.js uses the same letters)
const NAME_CHAR = 'A-Za-z0-9_~@°';
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// What is on Tab `tab` of the layout c (draft): its Devices, its Widgets, its Clones and its drawn items (graphics)
export function tabPieces(c, tab, isDevice) {
  const els = (c?.elements || []).filter(e => e.workspace === tab);
  const gfx = (c?.graphics || []).filter(g => g.workspace === tab);
  return {
    devices: els.filter(e => isDevice(e)),
    widgets: els.filter(e => !isDevice(e)),
    clones: gfx.filter(g => g.kind === 'clone'),
    graphics: gfx.filter(g => g.kind !== 'clone'),
  };
}

// The copy. c: the layout (draft, read only); from, to: the Tab names; mode(name) -> 'clone' or 'new' for each Widget;
// h: { newId(), cloneName(parent, taken), widgetName(copy, taken), graphicName(copy, taken, old) } (the Panel's own naming).
// Returns { elements, graphics, names (old -> new name of every item copied as a new item), clones (old -> its Clone's name) }.
export function copyTab(c, from, to, isDevice, mode, h) {
  const p = tabPieces(c, from, isDevice);
  const used = new Set([...(c.elements || []), ...(c.graphics || [])].map(x => low(x.name)).filter(Boolean));
  const taken = n => used.has(low(n));
  const take = n => { if (n) used.add(low(n)); return n; };
  const ids = new Set((c.graphics || []).map(g => g.id));
  const freshId = () => { let n; do n = h.newId(); while (ids.has(n)); ids.add(n); return n; };
  const idMap = new Map(), names = new Map(), clones = new Map();
  const outG = [], outE = [];
  // 1. Devices, Clones and the Widgets picked as Clones: a Clone of the same parent
  const cloneOf = (parent, src, own) => {
    const g = { id: freshId(), kind: 'clone', of: parent, workspace: to, x: src.x ?? 0, y: src.y ?? 0 };
    for (const k of ['visibility', 'layer', 'locked']) if (src[k] !== undefined) g[k] = clone(src[k]);
    if (own) for (const k of ['method', 'label']) if (own[k] !== undefined) g[k] = clone(own[k]);      // a Method Clone keeps its method (Rule 4.4)
    g.name = take(h.cloneName(parent, taken));
    outG.push(g);
    return g;
  };
  for (const e of p.devices) clones.set(e.name, cloneOf(e.name, e).name);
  for (const g of p.clones) clones.set(g.name, cloneOf(g.of, g, g).name);
  for (const e of p.widgets) if (mode(e.name) !== 'new') clones.set(e.name, cloneOf(e.name, e).name);
  // 2. the drawn items: new ids (and new names in the background)
  const drawn = p.graphics.map(g => { const n = clone(g); delete n._ref; delete n.buildTo; n.workspace = to; idMap.set(g.id, n.id = freshId()); return [g, n]; });
  // 3. the Widgets picked as new Widgets: a new Suggested Name for the new Tab
  const fresh = p.widgets.filter(e => mode(e.name) === 'new').map(e => { const n = clone(e); delete n._ref; delete n.buildTo; n.workspace = to; return [e, n]; });
  for (const [e, n] of fresh) { delete n.name; n.name = take(h.widgetName(n, taken, e.name) || nextFree(e.name, taken)); names.set(e.name, n.name); outE.push(n); }
  for (const [g, n] of drawn) {
    if (g.name) { delete n.name; const nm = h.graphicName(n, taken, g) || nextFree(g.name, taken); n.name = take(nm); if (nm !== g.name) names.set(g.name, nm); }
    if (n.label !== undefined && g.name && low(n.label) === low(g.name)) n.label = low(n.name);      // a pipe's Label that was its Name (pipe_14)
    outG.push(n);
  }
  // 4. every setting of the copies that points at another copied item points at the copy; a pointer at a Device (or a Widget made a
  //    Clone) stays on the parent: the Clone is the same "who", and a Process commands only the parent
  const ends = new Map([...clones, ...names]);
  const swap = v => {
    if (typeof v !== 'string') return v;
    if (idMap.has(v)) return idMap.get(v);
    if (names.has(v)) return names.get(v);
    let m = DEV_END.exec(v);
    if (m && ends.has(m[2])) return `${m[1]}:${ends.get(m[2])}:${m[3]}${m[4] !== undefined ? ':' + m[4] : ''}`;
    m = ID_END.exec(v);
    if (m && idMap.has(m[2])) return `${m[1]}:${idMap.get(m[2])}${m[3] ?? ''}`;
    return v;
  };
  const walk = (o, top) => { for (const k of Object.keys(o)) { if (top && OWN_TEXT.has(k)) continue; if (o[k] && typeof o[k] === 'object') walk(o[k], false); else o[k] = swap(o[k]); } };
  for (const [, n] of [...drawn, ...fresh]) walk(n, true);
  return { elements: outE, graphics: outG, names, clones };
}
// a name with _2, _3 ... when it is taken
export function nextFree(name, taken) {
  if (!taken(name)) return name;
  let i = 2; while (taken(`${name}_${i}`)) i++;
  return `${name}_${i}`;
}

// The Processes that use any of the names (whole names, as lib/renames.js finds them). texts: [[process name, text]]
export function processesUsing(texts, names) {
  const list = [...names].filter(Boolean);
  if (!list.length) return [];
  const alt = list.sort((a, b) => b.length - a.length).map(escRe).join('|');
  const re = new RegExp(`(?<![${NAME_CHAR}])(?:${alt})(?![${NAME_CHAR}])`);
  return texts.filter(([, t]) => re.test(String(t ?? ''))).map(([n]) => n);
}
// A copied Process's name: <name>_<new Tab ID>, and _2, _3 ... when it is taken
export function processCopyName(name, tabId, taken) {
  return nextFree(`${name}_${tabId}`, taken);
}
