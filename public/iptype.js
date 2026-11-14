// IP Type (OakBarn Brewery, 2026-11-14, Skynet Rule 5.40): the connector at an IP. "4 Choices Triclamp, NPT, BSP, or
// QuickDisconnet"; "Pipe and Hose Attributes as to IP Type that are set by the selected Defaults"; "On Both End"; "Add
// Connection Type for the In and Out IPs as above on a Pump". The connector has no size of its own: it is the size of the
// pipe, hose or pump it is on. Used by the panel (public/app.js) and the Brain (lib/store.js).
export const IP_TYPES = [['tc', 'Tri-Clamp'], ['npt', 'NPT'], ['bsp', 'BSP'], ['qd', 'Quick Disconnect']];
// Tri-Clamp is not made under 1/2"
export const ipTypeSizeOk = (t, inch) => !(t === 'tc' && +inch > 0 && +inch < 0.5);
export const ipTypePick = inch => IP_TYPES.filter(([t]) => ipTypeSizeOk(t, inch));
// what a pipe or hose of this size starts with: the Default pipe or hose IP Type (Tri-Clamp and Quick Disconnect unless changed);
// a Quick Disconnect hose is always Quick Disconnect
export function defaultIpType(d = {}, { hose = false, qd = false, inch = 0.5 } = {}) {
  if (qd) return 'qd';
  const t = hose ? d.defHoseIp || 'qd' : d.defPipeIp || 'tc';
  return ipTypeSizeOk(t, inch) ? t : 'npt';
}
// a pump's In and Out IPs: from its Ports when they are known (TC1.5 is Tri-Clamp, FPT or MPT is NPT, BSP is BSP), else the
// Default pipe IP Type
export function pumpIpType(ports, d = {}) {
  const p = String(ports || '').trim().toUpperCase();
  if (p.startsWith('TC')) return 'tc';
  if (/^[FM]PT/.test(p) || p.includes('NPT')) return 'npt';
  if (p.startsWith('BSP')) return 'bsp';
  return defaultIpType(d);
}
