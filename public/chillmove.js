// Moving an Immersion Chiller by hand on a live Tab (OakBarn Brewery, 2026-11-17: "Immersion Chillers on a Tab Can be Free Floating
// but later moved to a Vessel similar to hand a QD Hose on a Live Tab"; Rule 5.42, Help 200). Shared by the Panel (public/app.js)
// and the Brain (lib/chiller.js).
// Only an immersion chiller moves: a chilling coil with 2 IPs, In and Out. A plate or counterflow chiller (a Chillzilla too) or a
// jacketed coil is part of the manifold and stays put.
export const isImmersion = g => g?.kind === 'vessel' && g.vesselType === 'ccoil' && Number(g.liquidPorts ?? 2) === 2 &&
  !/jacket/i.test(g.vtype || '') && !/chillzilla/i.test(`${g.name ?? ''} ${g.template ?? ''} ${g.label ?? ''}`);
// a vessel a chiller can go into: a kettle type vessel or a Stove Top Vessel (never another chiller or a fitting)
export const takesChiller = g => g?.kind === 'vessel' && ['vessel', 'stoveTop', 'stoveTopOut', undefined].includes(g.vesselType) && !g.chillerOn;
// where a chiller sits in a vessel: in the lower middle, under its readings (the same spot place_Chiller uses)
export function spotIn(v, c) {
  const vw = v.w || 260, vh = v.h || 320, w = c.w || 120, h = c.h || 120;
  return [Math.round((v.x || 0) + (vw - w) / 2), Math.round((v.y || 0) + vh * 0.62 - h / 2)];
}
