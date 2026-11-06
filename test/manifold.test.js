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
