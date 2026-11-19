// A Hose Bib and the Manual Valves laid out like a Motorized Valve (OakBarn Brewery, 2026-11-19, Rule 18.52, Panel Updates entry 33):
// a Vertical Hose Bib has its Inlet (the wall side) at the Top or the Bottom and its handle Left or Right, all 4 looks; a Hose Bib saved
// before keeps its look; Manual Ball and Butterfly Valves grey Left / Right on Horizontal; a turned valve's Label stays upright.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const cut = (a, b) => app.slice(app.indexOf(a), app.indexOf(b));
// the look code itself, run here: Orientation, Left / Right and Inlet -> turn and mirror, and a spot on the Tab -> the picture's own box
const src = [app.match(/^const TAP_PIC = .*$/m)[0], app.match(/^const isTapMv = .*$/m)[0], cut('const MV_BFLY', '// the Skynet Manual Ball'), cut('const mvFront', 'const mvPic'),
  cut('function hbToPic', '// all 8 spots')].join('\n');
const T = new Function('isMv', `${src}\nreturn { mvLook, mvTransform, hbToPic, mvInletOf, TAP_PIC };`)(() => true);
const hb = (o, s, i) => ({ image: T.TAP_PIC, mvOrient: o, mvSide: s, ...(i ? { mvInlet: i } : {}) });
// the wall (Inlet) is on the picture's right edge as drawn, the handle on its top: turn and mirror both and see where they land
const where = (g, [x, y]) => {      // a point of the picture's own box -> where it is seen on the Tab
  const L = T.mvLook(g); let p = [L.flip ? 1 - x : x, L.flipY ? 1 - y : y];
  if (L.rot === 90) p = [1 - p[1], p[0]]; else if (L.rot === -90) p = [p[1], 1 - p[0]];
  return p.map(v => Math.round(v * 2) / 2);
};
const WALL = [1, 0.5], HANDLE = [0.5, 0];
const seen = g => ({ inlet: where(g, WALL), handle: where(g, HANDLE) });
assert.deepEqual(seen(hb('h', 'r')), { inlet: [1, 0.5], handle: [0.5, 0] }, 'Horizontal Right: as drawn');
assert.deepEqual(seen(hb('h', 'l')), { inlet: [0, 0.5], handle: [0.5, 0] }, 'Horizontal Left: mirrored');
assert.deepEqual(seen(hb('v', 'l', 't')), { inlet: [0.5, 0], handle: [0, 0.5] }, 'Vertical, Inlet Top, handle Left');
assert.deepEqual(seen(hb('v', 'r', 't')), { inlet: [0.5, 0], handle: [1, 0.5] }, 'Vertical, Inlet Top, handle Right');
assert.deepEqual(seen(hb('v', 'l', 'b')), { inlet: [0.5, 1], handle: [0, 0.5] }, 'Vertical, Inlet Bottom, handle Left');
assert.deepEqual(seen(hb('v', 'r', 'b')), { inlet: [0.5, 1], handle: [1, 0.5] }, 'Vertical, Inlet Bottom, handle Right');
assert.deepEqual(seen(hb('v', 'l')), seen(hb('v', 'l', 't')), 'a Hose Bib saved before: Vertical Left keeps the wall on top');
assert.deepEqual(seen(hb('v', 'r')), seen(hb('v', 'r', 'b')), 'a Hose Bib saved before: Vertical Right keeps the wall below');
assert.equal(T.mvTransform(hb('v', 'r', 't')), 'rotate(-90deg) scaleY(-1)', 'upside down, then turned');
// every spot on the Tab maps back to where it is seen (hbToPic is the undo of the look)
for (const g of [hb('h', 'r'), hb('h', 'l'), hb('v', 'l', 't'), hb('v', 'r', 't'), hb('v', 'l', 'b'), hb('v', 'r', 'b')])
  for (const s of [[0.5, 1], [0, 1], [1, 1], [0, 0.5], [0, 0], [0.5, 0], [1, 0], [1, 0.5]]) assert.deepEqual(where(g, T.hbToPic(g, s)), s, `spot ${s} on ${JSON.stringify(g)}`);
// the dialogs
assert.match(app, /\['mvInlet', 'Inlet', 'sel', MV_INLETS, true, false, \{ tip: HB_TIPS\.inletSide, \.\.\.\(mvOrientOf\(it\) === 'h' \? \{ disabled: true \} : \{\}\) \}\]/, 'the Hose Bib Inlet box, greyed on Horizontal');
assert.ok(app.includes("tip: MV_TIPS.side, ...(front || mvSameBothWays(it) ? { disabled: true } : {})"), 'Ball and Butterfly: Left / Right greyed on Horizontal');
assert.ok(app.includes("'image', 'mvOrient', 'mvSide', 'mvInlet', 'tapSpot'") && app.includes('mvGreyLive(q, w);'), 'the Graphic and the greyed boxes follow every change');
assert.ok(app.includes("n.append(mvLabelUpright(g, widgetLabel(g, 'below')))"), 'a turned valve\'s Label stays upright');
// the Inlet IP and tap flow (Rule 18.52 #6, #7; Panel Updates entry 35)
assert.ok(app.includes("const HB_INLET = [1, HB_PIC * 167 / 300];") && app.includes("id: `eq:${g.id}:in`, label: `${nm} wall inlet`"), 'a second IP on the wall thread');
assert.ok(app.includes("if (q?.tapIn) return { key: id, pull: true, tapIn: true };"), 'the Inlet is where house water comes in');
assert.ok(app.includes("if (!hit) { if (out) out.push = false; continue; }"), 'a closed valve on the Inlet side: no flow out of the hose either');
assert.ok(app.includes("dir.set(st.p.id, -st.d); src.set(st.p.id, better(src.get(st.p.id), { tap: true }))"), 'the Inlet pipe flows toward the Hose Bib, tap water Blue');
assert.ok(app.includes("if (mv && isTapMv(it)) return null;"), 'a Hose Bib never cuts a pipe');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
assert.ok(rules.includes('18.52 **A Hose Bib and the Manual Valves are laid out like a Motorized Valve**'), 'Rule 18.52');
console.log('hosebibvertical ok');
