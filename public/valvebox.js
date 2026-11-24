// A valve's box is only as long as the valve (OakBarn Brewery, 2026-11-23: "we do not care if the Box is square for Valve ... could be
// taller on the top to accommodate Manual handles"; "Or you could make the height standard to the tallest needed"; Rule 5.29): a Skynet
// side-view valve picture is 150 long, end to end (the Motorized Ball Valve's length), and 300 across (the tallest valve, the Motorized
// Butterfly, needs nearly all of it), with its pipe through the middle. So its box is half as long as it is high: 75 x 150 on a Tab
// for a level valve, 150 x 75 for an upright one, and its two IPs are on the valve's own ends, the middle of the box's short sides.
// Front views (looking down the pipe) and a user's own valve picture keep their square box.

// Then the box hugs the valve (OakBarn Brewery, 2026-11-24: "Valve box more like this", with a picture of a box just round a level
// Motorized Ball Valve, its IPs low on its sides): a side-view picture is cut to the band every Skynet side-view valve uses, 186 across
// (from 4 to 190 in its 300: the Motorized Butterfly's motor on one side, the valve body on the other) and 150 long. So a level valve's
// box is 150 x 186 (75 x 93 on a Tab), its pipe 146 / 186 of the way down, and an upright one's box is 186 x 150, its pipe that far
// from the motor's side. All Skynet side-view valves keep one box and IP spots (Rule 5.29), so one still replaces another in place.
// A valve turned 45 degrees or mirrored keeps the old box (its picture is drawn turned, whole).
export const VCROP = { from: 4, across: 186, long: 150, full: 300 };
export const VCROP_PIPE = (150 - VCROP.from) / VCROP.across;
// 'h' (level), 'vl' (upright, motor or handle left) or 'vr' (upright, motor or handle right) for a Skynet side-view valve picture, else null
export function valveSide(path) {
  const s = String(path || '');
  const om = s.match(/(?:^|\/)Motorized_TC15_Ball_Valve_(Horizontal|Vertical(?:_Left)?)\.svg$/i);
  if (om) return om[1] === 'Horizontal' ? 'h' : /Left$/i.test(om[1]) ? 'vl' : 'vr';
  const m = s.match(/(?:^|\/)Valve_(?:Motor_Ball|Manual|Manual_Butterfly|Gas_Solenoid|Motor_Butterfly)_(?:Open|Closed)(H|V_L|V_R)C?\.svg$/);
  return m ? { H: 'h', V_L: 'vl', V_R: 'vr' }[m[1]] : null;
}
// the item's picture is cut to the valve band (not turned 45 degrees, not mirrored)
export const valveCropped = e => !!e && !['l45', 'r45'].includes(e.orientation) && !e.flipH && !e.flipV && !!valveSide(e.imageOff || e.imageOn || e.image);
// how far across the box the pipe runs (from the top for a level valve, from the left for an upright one)
const pipeAt = (side, crop) => !crop ? 0.5 : side === 'vr' ? 1 - VCROP_PIPE : VCROP_PIPE;
// fit one item's box to its valve picture, keeping its pipe line where it was. true = changed
export function fitValveBox(e) {
  const side = e && valveSide(e.imageOff || e.imageOn || e.image); if (!side) return false;
  const w = +e.w || 0, h = +e.h || 0; if (!w || !h) return false;
  const lvl = side === 'h', r = Math.max(w, h) / Math.min(w, h), crop = valveCropped(e);
  const along = r < 1.12 ? Math.max(w, h) / 2 : Math.min(w, h);          // a square box (before Rule 5.29's cut): half of it
  const across = crop ? Math.round(along * VCROP.across / VCROP.long) : Math.round(along * 2), [nw, nh] = lvl ? [along, across] : [across, along];
  if (nw === w && nh === h) return false;
  const turned = r >= 1.12 && lvl !== (h > w), curCrop = !turned && r >= 1.12 && r < 1.6;
  const curAt = turned || !curCrop ? 0.5 : pipeAt(side, true), newAt = pipeAt(side, crop);
  if (turned) { e.x = Math.round((+e.x || 0) + (w - nw) / 2); e.y = Math.round((+e.y || 0) + (h - nh) / 2); }
  else if (lvl) { const py = (+e.y || 0) + curAt * h; e.x = Math.round((+e.x || 0) + (w - nw) / 2); e.y = Math.round(py - newAt * nh); }
  else { const px = (+e.x || 0) + curAt * w; e.y = Math.round((+e.y || 0) + (h - nh) / 2); e.x = Math.round(px - newAt * nw); }
  e.w = nw; e.h = nh;
  return true;
}
// every valve on every Tab; how many changed
export function fitValveBoxes(c) { let n = 0; for (const e of c?.elements || []) if (fitValveBox(e)) n++; return n; }
