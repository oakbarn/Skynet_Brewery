// Valve Tees and Supply Manifolds (Fritz, 2026-11-06, Rule 5.35): Long Tees joined end to end with a valve Device built into each
// branch; IPs only on the two open ends and on the far end of each valve; each valve Manual or Motorized on its own.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path';
import { cleanFitting, fittingEnds, FITTING_KINDS } from '../public/templates.js';
import { graphicTopic } from '../public/helpmap.js';
import { skynetGroupOf } from '../lib/picgroups.js';

const ROOT = path.join(import.meta.dirname, '..');
const tpl = n => cleanFitting(JSON.parse(fs.readFileSync(path.join(ROOT, 'templates', 'fitting', n + '.json'), 'utf8')));
assert.ok(FITTING_KINDS.valveTee, 'a Long Tee with a Valve is a fitting kind');
for (const [n, tees] of [['Valve_Tee', 1], ['Supply_Manifold_2', 2], ['Supply_Manifold_3', 3]]) {
  const t = tpl(n);
  assert.equal(t.fittings.filter(f => f.kind === 'valveTee').length, tees, `${n}: ${tees} valve tees`);
  // IPs only on the two open ends of the joined tees and on the far end of each valve
  const ends = fittingEnds(t).map(e => e.key);
  assert.deepEqual(ends, ['end', ...Array.from({ length: tees }, (_, i) => 'branch' + (i + 1))], `${n}: its ends`);
  assert.deepEqual(Object.keys(t.ipPos).sort(), ['start', ...ends].sort(), `${n}: a spot for every IP`);
  assert.equal(t.ipPos.start.split(',')[0], '0'); assert.equal(t.ipPos.end.split(',')[0], '1');
  for (let i = 0; i < tees; i++) {
    const [x, y] = t.ipPos['branch' + (i + 1)].split(',').map(Number);
    assert.ok(Math.abs(x - (i + 0.5) / tees) < 0.001 && y === 1, `${n}: valve ${i + 1} end under the middle of its tee`);
  }
  assert.equal(t.bend, '0.5,' + t.ipPos.start.split(',')[1], `${n}: its run is on the tees' center line`);
  assert.deepEqual(t.size, [160 * tees, 262], `${n}: each tee 160 wide (the Long Tee), its valve in the square under it`);
  const pic = path.join(ROOT, 'media', t.image);
  assert.ok(fs.existsSync(pic), `${n} picture exists`);
  assert.ok(fs.readFileSync(pic, 'utf8').includes(`viewBox="0 0 ${210 * tees} 344"`), `${n}: tees 210 x 134, valves 210 x 210`);
  assert.equal(skynetGroupOf(t.image), 'Other_Equipment');
  assert.deepEqual(graphicTopic({ kind: 'vessel', vesselType: 'bfit', templateCls: 'skynet', fittings: t.fittings }), ['valve-tees-and-supply-manifolds']);
}
const app = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
assert.ok(app.includes("['Valve Tees and Supply Manifolds (Rule 5.35)', MF_ROWS()]"), 'on the Elbows, Tees … list');
assert.ok(/\.\.\.MF_ROWS\(\)\]\]/.test(app), 'on the Valves list');
assert.ok(app.includes("valveType: motor ? 'electric' : 'manual'"), 'each valve is a valve Device, Manual or Motorized');
assert.ok(app.includes("if (isMf(v)) { const r = mfFlow(v, g.port); if (r) return r; }"), 'a closed valve shuts its IP');
assert.ok(app.includes('!isVPart(e) && !isMfPart(e)'), 'its valves have no IPs of their own');
assert.ok(fs.existsSync(path.join(ROOT, 'help', '146-valve-tees-and-supply-manifolds.md')), 'Help 146');
console.log('manifold ok');
// Fritz, 2026-11-06 (Rule 18.29): the Pump's drill-down Add box and Properties; valve ends that match the tee ends; valve numbers;
// no Flip, only Horizontal, Left Vertical 90, Right Vertical 90
assert.ok(app.includes("dialog(I.what, it => mfDrillFields(it, null, true)"), 'the Add box is the drill-down');
assert.ok(app.includes('if (isMf(it)) return mfDrillFields(it, '), 'the Properties are the drill-down');
for (const f of ["'1. Label'", "'2. Interface (board)'", "'4. Tab'", "'5. Name'", "'Device Type'"]) assert.ok(app.includes(f), f);
assert.ok(app.includes("const MF_ORIENT = [['0', 'Horizontal'], ['90', 'Left Vertical 90'], ['270', 'Right Vertical 90']]"), 'three Orientations');
assert.ok(app.includes('const MF_ROTS = [0, 90, 270]'), 'the turn buttons and a pipe drop keep to them');
assert.ok(app.includes("class: 'mfNum'"), 'valve numbers');
assert.ok(app.includes('<rect x="77" y="0.8" width="56" height="16.5" rx="5"') && app.includes('<rect x="77" y="192.7" width="56" height="16.5" rx="5"'), 'each valve has the tee\'s 56 x 16.5 ferrule at both ends');
for (const n of ['Valve_Tee', 'Supply_Manifold_2', 'Supply_Manifold_3']) {
  const t = tpl(n), svg = fs.readFileSync(path.join(ROOT, 'media', t.image), 'utf8');
  assert.equal((svg.match(/<rect x="70" y="122" width="70" height="12"/g) || []).length, t.fittings.filter(f => f.kind === 'valveTee').length, `${n}: half a clamp on each branch ferrule`);
}
console.log('manifold drill-down ok');
// Fritz, 2026-11-07: "We need supply Manifolds to Flip Vertically Horizomtaly. Vaves on Top or Valves on Bottom"
assert.ok(app.includes("['rot', 'Orientation', 'vorient', MF_ORIENT, false, false, { tip: T.orient, with: ['_flip', 'Flip', 'sel', PROBE_FLIP]"), 'Flip on the Orientation line');
assert.ok(app.includes("flipFrom(work); if (work.flipH) g.flipH = true; if (work.flipV) g.flipV = true;"), 'the Add box keeps the Flip');
assert.ok(app.includes("flipFrom(work); if (!MF_ROTS.includes(+work.rot || 0)) work.rot = '0';"), 'the Properties keep the Flip');
assert.ok(!app.includes('has no Flip: it turns Horizontal'), 'the Flip buttons on the Edit layout bar work');
console.log('manifold flip ok');
