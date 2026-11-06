// API_Name (Fritz, 2026-11-06, Rule 6.18): a String on the Database and .API pop-up of every Device and Widget with a value.
// It is the name a Voice Command uses (Alexa, Google Home, Siri through Home Assistant), and outside programs may use it in
// /api/items in place of the item's Name. It may be left blank. When it is filled in it must be Unique in the Schema:
// two items can't have the same API_Name, whatever the capitals or extra spaces ("Mash Temp" and "mash  temp" are the same).
// Shared by the browser (public/app.js) and the Brain (lib/itemapi.js, server.js), so both check it the same way.

export const API_NAME_MAX = 60;
const BAD = /[<>:"/\\|?*\u0000-\u001f]/;

// The API_Name as it is kept: spaces at the ends dropped, runs of spaces made one
export const cleanApiName = v => typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '';
// How two API_Names are compared: capitals and spaces don't count
export const apiNameKey = v => cleanApiName(v).toLowerCase();

// A message when the API_Name can't be used on its own, or '' when it is fine (blank is fine)
export function apiNameProblem(v) {
  const n = cleanApiName(v);
  if (!n) return '';
  if (n.length > API_NAME_MAX) return `API_Name: at most ${API_NAME_MAX} characters`;
  if (BAD.test(n)) return 'API_Name: these characters are not allowed: < > : " / \\ | ? *';
  return '';
}

// The other item that already has this API_Name, or null. self is the item being saved (it never clashes with itself).
export function apiNameOwner(list, v, self) {
  const k = apiNameKey(v);
  if (!k) return null;
  for (const x of list ?? []) {
    if (!x || x === self) continue;
    if (self && ((self._ref && x._ref === self._ref) || (self._key && x._key === self._key))) continue;
    if (apiNameKey(x.apiName) === k) return x;
  }
  return null;
}

// Every problem in a whole list of items (the Brain checks a layout save with it): the first message, or ''
export function apiNameListError(list) {
  const seen = new Map();
  for (const x of list ?? []) {
    if (!x?.apiName) continue;
    const bad = apiNameProblem(x.apiName); if (bad) return `${x.name}: ${bad}`;
    const k = apiNameKey(x.apiName);
    if (seen.has(k)) return `API_Name "${cleanApiName(x.apiName)}" is used by both ${seen.get(k)} and ${x.name}: an API_Name must be Unique`;
    seen.set(k, x.name);
  }
  return '';
}
