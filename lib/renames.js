// Renamed Devices and Widgets (Fritz, 2026-10-22): when a name changes, every Process that uses the old name is changed to the new
// one when the layout is saved. Whole names only: HLT_Temp changes, HLT_Temp.visible changes, HLT_Temp_2 and Old_HLT_Temp do not.
// Since 2026-10-27 the Brain finds the renames itself by each item's hidden key (lib/keys.js): old name -> new name, a chain
// A -> B -> C is one rename A -> C, and a swap (A -> B and B -> A in one save) works too: every name is changed in one pass.
const NAME_CHAR = 'A-Za-z0-9_~';
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// [{from, to}] or {from: to} -> Map, dropping empty, unchanged and doubled entries
export function renameMap(list) {
  const map = new Map();
  const pairs = Array.isArray(list) ? list.map(r => [r?.from, r?.to]) : Object.entries(list || {});
  for (let [from, to] of pairs) {
    from = String(from ?? '').trim(); to = String(to ?? '').trim();
    if (from && to && from !== to && !map.has(from)) map.set(from, to);
  }
  return map;
}

// The text of one Process with the names changed. A name after a dot is an attribute (Pump.visible), never a Device.
export function renameInProcess(text, map) {
  if (!map.size) return text;
  const alt = [...map.keys()].sort((a, b) => b.length - a.length).map(escRe).join('|');
  const re = new RegExp(`(?<![${NAME_CHAR}.])(${alt})(?![${NAME_CHAR}])`, 'g');
  return text.replace(re, n => map.get(n));
}

// Every name an element setting points to (follow, input, sound, ...), never the element's own name or display text
const OWN_TEXT = new Set(['name', 'displayName', 'label', 'text', 'description', 'units', 'unit']);
export function renameElementRefs(obj, map, top = true) {
  if (Array.isArray(obj)) return obj.map(v => renameElementRefs(v, map, false));
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) if (!(top && OWN_TEXT.has(k))) obj[k] = renameElementRefs(obj[k], map, false);
    return obj;
  }
  return typeof obj === 'string' && map.has(obj) ? map.get(obj) : obj;
}

// Changes every Process in the scripts/ folder (shared by every Schema). engine: lib/engine.js. Returns the Processes changed,
// with how many lines changed and whether it was running (a running Process keeps the old text until it is restarted).
export function renameInProcesses(engine, map) {
  const changed = [];
  if (!map.size) return changed;
  for (const name of engine.names()) {
    const text = engine.read(name), out = renameInProcess(text, map);
    if (out === text) continue;
    const a = text.split(/\r?\n/), b = out.split(/\r?\n/);
    engine.backup(name);
    engine.write(name, out);
    changed.push({ name, lines: a.filter((l, i) => l !== b[i]).length, running: engine.running.has(name) });
  }
  return changed;
}

// What a pipe, IP or vessel says about a Device by name: flowWhen, heater and pipe ends on a Device's own IPs (dev:<name>:<port>)
export function renameGraphicRefs(g, map) {
  if (!g || !map.size) return g;
  if (Array.isArray(g.flowWhen)) g.flowWhen = g.flowWhen.map(n => map.get(n) ?? n);
  if (typeof g.heater === 'string' && map.has(g.heater)) g.heater = map.get(g.heater);
  for (const k of ['from', 'to']) {
    const m = typeof g[k] === 'string' && /^dev:(.*):([^:]*)$/.exec(g[k]);
    if (m && map.has(m[1])) g[k] = `dev:${map.get(m[1])}:${m[2]}`;
  }
  return g;
}
