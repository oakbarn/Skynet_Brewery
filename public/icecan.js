// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Ice Water Can (OakBarn Brewery, 2026-11-15: "we have a sump pump in chilled water that recycles back to a large trash can with
// Ice and Water"; Rule 19.8, Help 201). A big trash can full of ice and water: a Special Widget with no Devices and no IPs of its own.
// It is a source of cold water. A Sump Pump (a Manual Pump Widget, Rule 5.15a) put inside it draws its water, and a hose dropped in its
// top (the hose hang top, Rules 5.28 and 5.34) brings the water back. Its Out flow color starts Blue. Skynet draws its picture for
// the box it has, so a tall can and a short tub both look right. Shared by the Skynet Panel and the BruControl Importer's Build page.

export const ICECAN_SIZE = [240, 300];        // a new Ice Water Can's box (Width, Height), in pixels: a 150 x 150 Sump Pump fits inside
export const ICECAN_FLOW = 'blue';            // its Out flow color to start (Rule 5.21): cold water is Blue

const r = n => Math.round(n * 10) / 10;

// the picture, as SVG, for a box w x h pixels (drawn to that box, so nothing is stretched): a grey plastic can a little wider at
// the top, its rim and two side handles, the water near the top, and ice cubes floating in it
export function iceCanSvg(w, h) {
  w = Math.max(30, +w || ICECAN_SIZE[0]); h = Math.max(30, +h || ICECAN_SIZE[1]);
  const rim = Math.max(5, Math.min(14, h * 0.05)), top = rim * 0.6, bottom = h - 1.5;
  const lip = w * 0.04, inset = w * 0.1;                     // the can is narrower at the bottom
  const tl = lip, tr = w - lip, bl = lip + inset, br = w - lip - inset;
  const water = top + rim + (bottom - top - rim) * 0.12;     // the water line, a little under the rim
  const at = y => { const t = (y - top) / (bottom - top); return [tl + (bl - tl) * t, tr + (br - tr) * t]; };
  const [wl, wr] = at(water);
  // ice cubes floating at the water line (they stay inside the can's sides)
  const cube = Math.max(6, Math.min(22, (wr - wl) * 0.14));
  let ice = '';
  for (let i = 0, n = Math.max(2, Math.floor((wr - wl - cube) / (cube * 1.35))); i < n; i++) {
    const x = wl + cube * 0.4 + i * (wr - wl - cube * 1.2) / Math.max(1, n - 1) * 0.98, y = water - cube * (i % 2 ? 0.55 : 0.35);
    ice += `<rect x="${r(x)}" y="${r(y)}" width="${r(cube)}" height="${r(cube)}" rx="${r(cube * 0.18)}" transform="rotate(${i % 2 ? 12 : -9} ${r(x + cube / 2)} ${r(y + cube / 2)})" fill="#eaf6ff" stroke="#7fb8de" stroke-width="1.2"/>`;
  }
  // the side handles: a short bar on each side, high on the can
  const hy = top + rim + (bottom - top) * 0.06, hh = Math.max(4, Math.min(10, h * 0.035)), hw = Math.max(6, w * 0.07);
  const handles = `<rect x="${r(0)}" y="${r(hy)}" width="${r(hw)}" height="${r(hh)}" rx="${r(hh / 2)}" fill="#5c636a" stroke="#000" stroke-width="1"/>` +
    `<rect x="${r(w - hw)}" y="${r(hy)}" width="${r(hw)}" height="${r(hh)}" rx="${r(hh / 2)}" fill="#5c636a" stroke="#000" stroke-width="1"/>`;
  // ribs down the side of the can
  let ribs = '';
  for (const f of [0.3, 0.5, 0.7]) {
    const [a] = at(water + 4), [b] = at(bottom - 6), [, c] = at(water + 4), [, d] = at(bottom - 6);
    ribs += `<line x1="${r(a + (c - a) * f)}" y1="${r(water + 6)}" x2="${r(b + (d - b) * f)}" y2="${r(bottom - 6)}" stroke="#fafafa" stroke-opacity="0.18" stroke-width="${r(Math.max(2, w * 0.02))}" stroke-linecap="round"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(w)} ${r(h)}" width="${r(w)}" height="${r(h)}">` +
    `<polygon points="${r(tl)},${r(top)} ${r(tr)},${r(top)} ${r(br)},${r(bottom)} ${r(bl)},${r(bottom)}" fill="#6b7279" stroke="#000" stroke-width="2"/>` +
    `<polygon points="${r(wl + 2)},${r(water)} ${r(wr - 2)},${r(water)} ${r(br - 2)},${r(bottom - 2)} ${r(bl + 2)},${r(bottom - 2)}" fill="#2f80ed" fill-opacity="0.55"/>` +
    ribs + ice + handles +
    `<rect x="${r(1)}" y="${r(top - rim / 2)}" width="${r(w - 2)}" height="${r(rim)}" rx="${r(rim / 2)}" fill="#7d858c" stroke="#000" stroke-width="2"/>` +
    '</svg>';
}
export const iceCanPic = (w, h) => 'data:image/svg+xml,' + encodeURIComponent(iceCanSvg(w, h));
