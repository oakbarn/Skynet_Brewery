// A valve's box is only as long as the valve (OakBarn Brewery, 2026-11-23: "we do not care if the Box is square for Valve ... could be
// taller on the top to accommodate Manual handles"; "Or you could make the height standard to the tallest needed"; Rule 5.29): a Skynet
// side-view valve picture is 150 long, end to end (the Motorized Ball Valve's length), and 300 across (the tallest valve, the Motorized
// Butterfly, needs nearly all of it), with its pipe through the middle. So its box is half as long as it is high: 75 x 150 on a Tab
// for a level valve, 150 x 75 for an upright one, and its two IPs are on the valve's own ends, the middle of the box's short sides.
// Front views (looking down the pipe) and a user's own valve picture keep their square box.

// 'h' (level) or 'v' (upright) for a Skynet side-view valve picture, else null
export function valveSide(path) {
  const s = String(path || '');
  const om = s.match(/(?:^|\/)Motorized_TC15_Ball_Valve_(Horizontal|Vertical(?:_Left)?)\.svg$/i);
  if (om) return om[1] === 'Horizontal' ? 'h' : 'v';
  const m = s.match(/(?:^|\/)Valve_(?:Motor_Ball|Manual|Manual_Butterfly|Gas_Solenoid|Motor_Butterfly)_(?:Open|Closed)(H|V_L|V_R)C?\.svg$/);
  return m ? (m[1] === 'H' ? 'h' : 'v') : null;
}
// fit one item's box to its valve picture, about its middle: across = the longer side, along the pipe = half of it. true = changed
export function fitValveBox(e) {
  const side = e && valveSide(e.imageOff || e.imageOn || e.image); if (!side) return false;
  const w = +e.w || 0, h = +e.h || 0; if (!w || !h) return false;
  const across = Math.max(w, h), along = Math.round(across / 2), [nw, nh] = side === 'h' ? [along, across] : [across, along];
  if (nw === w && nh === h) return false;
  e.x = Math.round((+e.x || 0) + (w - nw) / 2); e.y = Math.round((+e.y || 0) + (h - nh) / 2); e.w = nw; e.h = nh;
  return true;
}
// every valve on every Tab; how many changed
export function fitValveBoxes(c) { let n = 0; for (const e of c?.elements || []) if (fitValveBox(e)) n++; return n; }
