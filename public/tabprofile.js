// Rule 2.62 #9 (OakBarn Brewery, 2026-11-19: "NO LINK NO Connect Nada 100% Links gone"): a Tab Profile is copied onto a Tab, never
// linked. Picking one copies its background color into the Tab's own Color and the look a new Device or Widget starts with into the
// Tab's own startLook. Changing or deleting the Tab Profile later never changes a Tab. Shared by the server and the browser.
export const TAB_LOOK_KEYS = ['nameColor', 'nameBg', 'nameAlign', 'valueColor', 'valueBg', 'valueAlign', 'valueType', 'ledMode', 'digits', 'precision'];
const set = v => v !== undefined && v !== null && v !== '';
export const lookOf = p => Object.fromEntries(TAB_LOOK_KEYS.filter(k => set(p?.[k])).map(k => [k, p[k]]));
// picked now: the Tab takes the profile's color (when it has one) and its look
export function copyTabProfile(w, p) {
  if (!w || !p) return w;
  if (set(p.bgColor)) w.color = p.bgColor;
  const look = lookOf(p);
  if (Object.keys(look).length) w.startLook = look; else delete w.startLook;
  delete w.tabProfile;
  return w;
}
// a Tab saved before (it still names a Tab Profile): copied once as it showed (its own Color won), then the link goes. find(id) gives
// the profile or nothing. Returns true when the Tab changed.
export function unlinkTabProfile(w, find) {
  if (!w || !('tabProfile' in w)) return false;
  const p = w.tabProfile ? find(w.tabProfile) : null;
  if (p) {
    if (!set(w.color) && set(p.bgColor)) w.color = p.bgColor;
    if (!w.startLook) { const look = lookOf(p); if (Object.keys(look).length) w.startLook = look; }
  }
  delete w.tabProfile;
  return true;
}
