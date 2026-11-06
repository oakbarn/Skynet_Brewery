// Database Groups (Fritz, 2026-11-05, rewritten 2026-11-06, Rule 6.14). A Group says WHEN an item may be sent to the database:
// an item keeps its own Send to the database setting (Every 1 minute, On value change ...), and when it is in one or more Groups
// (database.groups: a list of Group keys) it is sent at that rate ONLY while one of its Groups is started. A Process starts a
// Group with `start_db_group Mash` and stops it with `stop_db_group Mash`. `send_db Name` (On demand) always works, and
// `send_db_group Name` sends every item of the Group once, now. A Device or Widget can be in more than one Group.
// A Group has a meaningless hidden key (its id, which the items point to) and a Name, which only ✏ Change name changes; every
// Process follows (Update All). Older Schemas (Rule 15.2): "Once" items and "In a Group" items become On demand in their Group.
import crypto from 'node:crypto';

export const GROUP_NAME = /^[A-Za-z][A-Za-z0-9_]{0,39}$/;
export const newGroupId = () => 'grp_' + crypto.randomBytes(6).toString('hex');
export const groupsOf = c => (Array.isArray(c?.dbGroups) ? c.dbGroups : []);
export const groupByName = (c, name) => groupsOf(c).find(g => g.name.toLowerCase() === String(name ?? '').trim().toLowerCase());
export const groupById = (c, id) => groupsOf(c).find(g => g.id === id);

// a new Group's Name: letters, digits and _, starting with a letter, and not the Name of another Group (any case)
export function checkGroupName(c, name, id) {
  name = String(name ?? '').trim();
  if (!GROUP_NAME.test(name)) throw new Error('A Group Name is a letter, then letters, digits or _ (no spaces), at most 40');
  const other = groupByName(c, name);
  if (other && other.id !== id) throw new Error(`There is already a Group named ${other.name}`);
  return name;
}

export function addGroup(c, name) {
  name = checkGroupName(c, name);
  const g = { id: newGroupId(), name };
  c.dbGroups = [...groupsOf(c), g];
  return g;
}

// The Groups an item is in (a list of Group keys; an older single "group" counts too)
export const itemGroups = d => [...new Set([...(Array.isArray(d?.groups) ? d.groups : []), ...(typeof d?.group === 'string' && d.group ? [d.group] : [])])];

// Older Schemas (Rule 15.2), when a Schema loads. Returns how many items changed.
//  - "Once" (2026-11-05): the item goes On demand into the Group named Once (made when needed)
//  - "In a Group" with one "group" (2026-11-05 to 2026-11-06): the item goes On demand with that Group in its list, so
//    send_db_group still sends it exactly as before
export function onceToGroups(c) {
  let n = 0, g;
  for (const el of Array.isArray(c?.elements) ? c.elements : []) {
    const d = el?.database; if (!d) continue;
    if (d.frequency === 'once') {
      g ??= groupByName(c, 'Once') || addGroup(c, 'Once');
      const { group, ...rest } = d; el.database = { ...rest, frequency: 'ondemand', groups: [...new Set([...itemGroups(d), g.id])] }; n++;
    } else if (d.frequency === 'group' || d.group !== undefined) {
      const { group, ...rest } = d; el.database = { ...rest, ...(d.frequency === 'group' ? { frequency: 'ondemand' } : {}), groups: itemGroups(d) }; n++;
      if (!el.database.groups.length) delete el.database.groups;
    }
  }
  // an item pointing at a Group that is gone is never gated by it; its Properties drop it on the next save
  return n;
}

// `send_db_group Old`, `start_db_group Old` and `stop_db_group Old` -> New in the text of one Process (the Group's Name,
// quoted or not; any case of the command)
export function renameGroupInText(text, from, to) {
  const esc = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`^(\\s*(?:send|start|stop)_db_group\\s+)("?)${esc}\\2(?![A-Za-z0-9_])`, 'gim'), (m, a, q) => a + q + to + q);
}
