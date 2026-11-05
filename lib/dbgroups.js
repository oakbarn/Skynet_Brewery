// Database Groups (Fritz, 2026-11-05, Rule 6.14): "Send to the database: In a Group" puts an item in a Group, and the Process
// line `send_db_group Group_Name` sends every item in that Group to the database, each time it runs. A Group has a meaningless
// hidden key (its id, which the items point to) and a Name, which only ✏ Change name changes; every Process follows (Update All).
// It replaces the old "Once" choice: each Schema's Once items go into a Group named Once when the Schema loads (Rule 15.2).
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

// Older Schemas: every item whose database setting was "Once" goes into the Group named Once (made when needed). Returns how many.
export function onceToGroups(c) {
  let n = 0, g;
  for (const el of Array.isArray(c?.elements) ? c.elements : []) {
    if (el?.database?.frequency !== 'once') continue;
    g ??= groupByName(c, 'Once') || addGroup(c, 'Once');
    el.database = { ...el.database, frequency: 'group', group: g.id }; n++;
  }
  // an item pointing at a Group that is gone sends nothing; it stays as it is so a mistake is easy to see in its Properties
  return n;
}

// `send_db_group Old` -> `send_db_group New` in the text of one Process (the Group's Name, quoted or not; any case of the command)
export function renameGroupInText(text, from, to) {
  const esc = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`^(\\s*send_db_group\\s+)("?)${esc}\\2(?![A-Za-z0-9_])`, 'gim'), (m, a, q) => a + q + to + q);
}
