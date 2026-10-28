// Cloned Devices (Fritz, 2026-10-27): a Clone is a { kind: 'clone' } graphic that shows its parent Device on another Tab.
// Each Clone has its own hidden key, and holds on to its parent by the parent's key (_of, which never leaves the Brain like
// every key: lib/keys.js). `of` is the parent's name, for the browser. When the parent is renamed, by any route, `of` and the
// Clone's name (<Parent_Name>_Clone_N, the number kept) follow it. A Clone whose parent is gone is dropped.
import { KEY } from './keys.js';
import { cloneName, cloneNumber } from '../public/naming.js';

export const OF = '_of';
const isClone = g => g?.kind === 'clone';

// graphics: the Clones to link (changed in place); elements: the Devices now; before: the graphics as they were (an incoming
// Clone carries only its own key, so its parent's key comes from what was saved). Returns the graphics without lost Clones.
export function linkClones(graphics, elements, before = []) {
  if (!Array.isArray(graphics)) return graphics;
  const byKey = new Map((elements ?? []).filter(e => e?.[KEY]).map(e => [e[KEY], e]));
  const byName = new Map((elements ?? []).map(e => [e.name, e]));
  const was = new Map((before ?? []).filter(g => isClone(g) && g[KEY]).map(g => [g[KEY], g]));
  const moved = new Map();          // old Clone name -> new: the pipes on its IPs (dev:<name>:in / out) follow
  const names = new Set([...(elements ?? []).map(e => e.name), ...graphics.map(g => g?.name)].filter(Boolean).map(n => n.toLowerCase()));
  for (let i = graphics.length - 1; i >= 0; i--) {
    const g = graphics[i];
    if (!isClone(g)) continue;
    const ofKey = g[OF] ?? (g[KEY] && was.get(g[KEY])?.[OF]);
    const p = (ofKey && byKey.get(ofKey)) || byName.get(g.of);
    if (!p) { graphics.splice(i, 1); continue; }           // its parent was deleted: the Clone goes too
    if (p[KEY]) g[OF] = p[KEY];
    if (g.of !== p.name || !String(g.name ?? '').startsWith(p.name + '_Clone_')) {
      names.delete(String(g.name ?? '').toLowerCase());
      const old = g.name;
      g.of = p.name; g.name = cloneName(p.name, n => names.has(n.toLowerCase()), cloneNumber(g.name));
      names.add(g.name.toLowerCase());
      if (old && old !== g.name) moved.set(old, g.name);
    }
  }
  if (moved.size) for (const x of graphics) for (const k of ['from', 'to']) {
    const m = /^dev:(.*):(in|out)$/.exec(x?.[k] ?? '');
    if (m && moved.has(m[1])) x[k] = `dev:${moved.get(m[1])}:${m[2]}`;
  }
  return graphics;
}
