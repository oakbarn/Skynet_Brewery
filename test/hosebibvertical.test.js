// A Hose Bib and the Manual Valves laid out like a Motorized Valve (OakBarn Brewery, 2026-11-19, Rule 18.52, Panel Updates entry 33):
// a Vertical Hose Bib has its Inlet (the wall side) at the Top or the Bottom and its handle Left or Right, all 4 looks; a Hose Bib saved
// before keeps its look; Manual Ball and Butterfly Valves grey Left / Right on Horizontal; a turned valve's Label stays upright.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const cut = (a, b) => app.slice(app.indexOf(a), app.indexOf(b));
// the look code itself, run here: Orientation, Left / Right and Inlet -> turn and mirror, and a spot on the Tab -> the picture's own box
const src = [app.match(/^const TAP_PIC = .*$/m)[0], app.match(/^const isTapMv = .*$/m)[0], cut('const MV_BFLY', '// the Skynet Manual Ball'), cut('const mvFront', 'const mvPic'),
  cut('function hbToPic', '// all 8 spots'), app.match(/^const mMul = .*$/m)[0]].join('\n');
const T = new Function('isMv', `${src}\nreturn { mvLook, mvTransform, hbToPic, mvInletOf, mvFlips, TAP_PIC };`)(() => true);
const hb = (o, s, i) => ({ image: T.TAP_PIC, mvOrient: o, mvSide: s, ...(i ? { mvInlet: i } : {}) });
// the wall (Inlet) is on the picture's right edge as drawn, the handle on its top: turn and mirror both and see where they land
const where = (g, [x, y]) => {      // a point of the picture's own box -> where it is seen on the Tab (its look, a turn or a mirror)
  const m = T.mvLook(g).m, a = x - 0.5, b = y - 0.5;
  return [0.5 + m[0] * a + m[1] * b, 0.5 + m[2] * a + m[3] * b].map(v => Math.round(v * 2) / 2 + 0);
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
assert.equal(T.mvTransform(hb('v', 'r', 't')), 'rotate(90deg) scaleX(-1)', 'mirrored, then turned (the same look as upside down, then turned the other way)');
// Panel Update 14 (Rules 18.43, 18.52): Orientation with Flip Horizontal and Flip Vertical; a new Hose Bib starts Left to Right (Inlet left)
// and Bottom to Top on Vertical (Inlet at the bottom, handle left); a Hose Bib saved with Left / Right and Inlet keeps its look
const nb = (o, fh, fv) => ({ image: T.TAP_PIC, mvOrient: o, mvFlipH: fh, mvFlipV: fv });
assert.deepEqual(seen(nb('h', false, false)), { inlet: [0, 0.5], handle: [0.5, 0] }, 'Horizontal: the Inlet (TAP) on the left, Left to Right');
assert.deepEqual(seen(nb('h', true, false)), { inlet: [1, 0.5], handle: [0.5, 0] }, 'Flip Horizontal: the Inlet on the right');
assert.deepEqual(seen(nb('h', false, true)), { inlet: [0, 0.5], handle: [0.5, 1] }, 'Flip Vertical: the handle below');
assert.deepEqual(seen(nb('v', false, false)), { inlet: [0.5, 1], handle: [0, 0.5] }, 'Vertical: the Inlet at the bottom, Bottom to Top, handle left');
assert.deepEqual(seen(nb('v', true, false)), { inlet: [0.5, 1], handle: [1, 0.5] }, 'Vertical + Flip Horizontal: handle right');
assert.deepEqual(seen(nb('v', false, true)), { inlet: [0.5, 0], handle: [0, 0.5] }, 'Vertical + Flip Vertical: the Inlet on top');
for (const [o, s, i] of [['h', 'r'], ['h', 'l'], ['v', 'l', 't'], ['v', 'r', 't'], ['v', 'l', 'b'], ['v', 'r', 'b']]) {
  const old = hb(o, s, i), [fh, fv] = T.mvFlips(old);
  assert.deepEqual(seen(nb(o, fh, fv)), seen(old), `saved before as ${o} ${s} ${i || ''}: the Flips give the same look`);
}
const mv = (o, s, fl) => ({ image: 'Images/Skynet/Valves/Manual_Ball_Valve_Side_Closed.svg', mvOrient: o, ...(s ? { mvSide: s } : {}), ...(fl ? { mvFlipH: fl[0], mvFlipV: fl[1] } : {}) });
for (const [o, s] of [['h', 'r'], ['h', 'l'], ['v', 'l'], ['v', 'r']]) {
  const old = mv(o, s), fl = T.mvFlips(old);
  for (const pt of [[0, 0.5], [1, 0.5], [0.5, 0]]) assert.deepEqual(where(mv(o, null, fl), pt), where(old, pt), `a Manual Valve saved as ${o} ${s} keeps its look and ends`);
}
assert.deepEqual(where(mv('v', null, [false, false]), [0.5, 0]), [0, 0.5], 'a Manual Valve Vertical: handle left');
assert.deepEqual(where(mv('v', null, [false, false]), [0, 0.5]), [0.5, 1], 'its drawn left end at the bottom (Bottom to Top)');
// every spot on the Tab maps back to where it is seen (hbToPic is the undo of the look)
for (const g of [hb('h', 'r'), hb('h', 'l'), hb('v', 'l', 't'), hb('v', 'r', 't'), hb('v', 'l', 'b'), hb('v', 'r', 'b'), nb('h', false, false), nb('v', false, false), nb('v', true, true), nb('h', true, true)])
  for (const s of [[0.5, 1], [0, 1], [1, 1], [0, 0.5], [0, 0], [0.5, 0], [1, 0], [1, 0.5]]) assert.deepEqual(where(g, T.hbToPic(g, s)), s, `spot ${s} on ${JSON.stringify(g)}`);
// the dialogs
assert.ok(app.includes("with: MV_FLIPS(it, HB_TIPS)") && app.includes("with: MV_FLIPS(it, MV_TIPS)"), 'Hose Bib and Manual Valve: Flip Horizontal and Flip Vertical beside the Orientation (Panel Update 14)');
assert.ok(app.includes("for (const k of ['mvFlipH', 'mvFlipV']) grey(k, mvFront(w));"), 'a front view has no Flips');
assert.ok(app.includes("for (const k of ['mvFlipH', 'mvFlipV']) if (q(k)) w[k] = q(k).checked;") && app.includes('mvGreyLive(q, w);'), 'the Graphic follows every change');
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
