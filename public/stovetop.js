// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Stove Top Vessel (OakBarn Brewery, 2026-11-13: "We need stove top Vessel with the Hose hang top and size attributes H_w and
// Gallons and make the Graphic Dynamic"; 2026-11-15: "Stove Top is widget with IPs with Top IP to hang a hose. 2 different ones. 1 no
// Outlets, 2. Outlet at Bottom with the conector types like a Pipe"; "Center Bottom on Stove Top Widget and it gets IP"; Rule 19.7,
// Help 199). A pot that sits on a kitchen stove: a Special Widget with IPs and no Devices. Its picture is drawn by Skynet for the box
// it has, so a tall stock pot and a wide short pot both look right: the pot body, its rim, its two side handles and, on the Bottom
// Outlet one, a short outlet at the center of the bottom with its connector drawn as its IP Type (Rule 5.40). Shared by the Skynet
// Panel and the BruControl Importer's Build page.
//
// The picture box: a handle on each side takes STOVE_SIDE of the width, the rim takes STOVE_TOP of the height, and the Bottom Outlet
// takes STOVE_OUT of the height under the pot. The pot body is the rest, so a pot of Height H and Width W (across) has a box of
// Height / Width = (H / (1 - STOVE_TOP - out)) / (W / (1 - 2 * STOVE_SIDE)).
export const STOVE_SIDE = 0.09;
export const STOVE_TOP = 0.04;
export const STOVE_OUT = 0.1;
// with no Height and Width typed: a stock pot as tall as it is wide
export const STOVE_SHAPE = 1;
export const STOVE_GALLONS = 5;           // a new Stove Top Vessel starts at 5 gallons (a common stove top brew pot)

// its box's Height / Width, from the pot's Height and Width (inches or cm; empty or 0 = the stock pot shape)
export function stoveAspect(height, width, outlet = false) {
  const ph = +height > 0 && +width > 0 ? +height / +width : STOVE_SHAPE;
  return ph * (1 - 2 * STOVE_SIDE) / (1 - STOVE_TOP - (outlet ? STOVE_OUT : 0));
}

const r = n => Math.round(n * 10) / 10;
// the connector at the end of the outlet, pointing down, its tip at (cx, y): Tri-Clamp a ferrule and clamp band, NPT a tapered thread,
// BSP a hex nut on a thread, Quick Disconnect a cam lock with its two arms (as pipe ends are drawn, Rule 5.40)
function connector(type, cx, y, pw) {
  const steel = '#b9c0c7', edge = '#3b4148', hw = pw / 2;
  if (type === 'tc') return `<rect x="${r(cx - hw * 1.7)}" y="${r(y - pw * 0.45)}" width="${r(pw * 1.7)}" height="${r(pw * 0.45)}" rx="${r(pw * 0.1)}" fill="${steel}" stroke="${edge}" stroke-width="1"/>` +
    `<rect x="${r(cx - hw * 1.45)}" y="${r(y - pw * 0.9)}" width="${r(pw * 1.45)}" height="${r(pw * 0.42)}" rx="${r(pw * 0.15)}" fill="#8a9097" stroke="${edge}" stroke-width="1"/>`;
  if (type === 'npt') {
    let t = `<polygon points="${r(cx - hw * 1.15)},${r(y - pw)} ${r(cx + hw * 1.15)},${r(y - pw)} ${r(cx + hw * 0.85)},${r(y)} ${r(cx - hw * 0.85)},${r(y)}" fill="${steel}" stroke="${edge}" stroke-width="1"/>`;
    for (let i = 1; i < 4; i++) { const yy = y - pw + pw * i / 4, k = 1.15 - 0.3 * i / 4; t += `<line x1="${r(cx - hw * k)}" y1="${r(yy)}" x2="${r(cx + hw * k)}" y2="${r(yy)}" stroke="${edge}" stroke-width="0.8"/>`; }
    return t;
  }
  if (type === 'bsp') {
    const a = hw * 1.75, b = hw * 1.25, t0 = y - pw, t1 = y - pw * 0.25;
    return `<polygon points="${r(cx - b)},${r(t0)} ${r(cx + b)},${r(t0)} ${r(cx + a)},${r((t0 + t1) / 2)} ${r(cx + b)},${r(t1)} ${r(cx - b)},${r(t1)} ${r(cx - a)},${r((t0 + t1) / 2)}" fill="${steel}" stroke="${edge}" stroke-width="1"/>` +
      `<rect x="${r(cx - hw * 0.9)}" y="${r(t1)}" width="${r(pw * 0.9)}" height="${r(y - t1)}" fill="${steel}" stroke="${edge}" stroke-width="0.8"/>`;
  }
  if (type === 'qd') {
    return `<rect x="${r(cx - hw * 1.45)}" y="${r(y - pw * 0.9)}" width="${r(pw * 1.45)}" height="${r(pw * 0.9)}" rx="${r(pw * 0.15)}" fill="${steel}" stroke="${edge}" stroke-width="1"/>` +
      [-1, 1].map(s => `<path d="M${r(cx + s * hw * 1.45)},${r(y - pw * 0.6)} L${r(cx + s * hw * 2.1)},${r(y - pw * 1.3)}" stroke="${edge}" stroke-width="${r(Math.max(1.5, pw * 0.18))}" stroke-linecap="round" fill="none"/>`).join('');
  }
  return '';
}

// the picture, as SVG, for a box w x h pixels (drawn to that box, so nothing is stretched). outlet: the Bottom Outlet's IP Type
// (tc, npt, bsp, qd), or '' for none.
export function stoveSvg(w, h, outlet = '') {
  w = Math.max(20, +w || 200); h = Math.max(20, +h || 200);
  const side = w * STOVE_SIDE, x0 = side, x1 = w - side, bw = x1 - x0, top = Math.max(3, h * STOVE_TOP);
  const bottom = outlet ? h * (1 - STOVE_OUT) : h - 1.5;
  const rim = Math.max(4, Math.min(12, h * 0.035)), rx = Math.min(10, bw * 0.06);
  // the handles: a loop on each side, high on the pot
  const hy = top + h * 0.07, hh = Math.max(8, Math.min(h * 0.12, 40)), hw = side * 0.85 + 4, sw = Math.max(2.5, Math.min(5, side * 0.22));
  const handle = x => `<rect x="${r(x)}" y="${r(hy)}" width="${r(hw)}" height="${r(hh)}" rx="${r(hh / 2)}" fill="none" stroke="#404040" stroke-width="${r(sw)}"/>`;
  // the Bottom Outlet: a short pipe down from the middle of the bottom, its connector at the box's bottom edge (where its IP is)
  let out = '';
  if (outlet) {
    const pw = Math.max(6, Math.min(18, bw * 0.08)), cx = w / 2;
    out = `<rect x="${r(cx - pw / 2)}" y="${r(bottom - 2)}" width="${r(pw)}" height="${r(h - bottom + 2)}" fill="#a0a0a0" stroke="#000" stroke-width="1.5"/>` + connector(outlet, cx, h, pw);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(w)} ${r(h)}" width="${r(w)}" height="${r(h)}">` +
    handle(x0 - side * 0.85) + handle(x1 - 4) + out +
    `<rect x="${r(x0)}" y="${r(top)}" width="${r(bw)}" height="${r(bottom - top)}" rx="${r(rx)}" fill="#808080" stroke="#000" stroke-width="2"/>` +
    `<rect x="${r(x0 + bw * 0.16)}" y="${r(top + rim + 4)}" width="${r(Math.max(2, bw * 0.07))}" height="${r(Math.max(2, bottom - top - rim - 12))}" rx="${r(Math.max(1, bw * 0.035))}" fill="#fafafa" fill-opacity="0.22"/>` +
    `<rect x="${r(x0 - 4)}" y="${r(top - rim / 2)}" width="${r(bw + 8)}" height="${r(rim)}" rx="${r(rim / 2)}" fill="#9a9a9a" stroke="#000" stroke-width="2"/>` +
    '</svg>';
}
export const stovePic = (w, h, outlet = '') => 'data:image/svg+xml,' + encodeURIComponent(stoveSvg(w, h, outlet));
