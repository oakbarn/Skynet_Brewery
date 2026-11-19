// A pipe split in two always keeps everything (OakBarn Brewery, 2026-11-16: "the pipe is devided in two pipes and all the IPs and
// other properties are set and proties inheietrd"; "Good check that auto always works"): every way a pipe is cut, both pieces get
// their IPs, and every setting the pipe had; a new pipe drawn on to a pipe takes its size, IP Type and color.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { splitAt, fitOnPipe, cutPieces, takeNeighbour, PIECE_OWN } from '../public/pipefit.js';

const PIPE = () => ({ id: 'p1', _key: 'k1', kind: 'pipe', workspace: 'Brew House', name: 'Pipe_1', label: 'pipe_1', labelVisible: true, straight: true,
  from: 'ipA', to: 'ipB', points: [[0, 110], [400, 110]], size: '1.5', sizeUnits: 'in', color: '#123456', flowColor: 'Mash',
  ipTypeFrom: 'TC1.5', ipTypeTo: 'TC1.5', locked: false, layer: 7, newLook: { labelFore: '#fff' } });
let n = 0; const newId = () => 'new' + (++n);
const kept = (p, q) => { for (const k of Object.keys(p)) if (!PIECE_OWN.includes(k)) assert.deepEqual(q[k], p[k], `${k} is kept`); };
function check(plan, what, joints = []) {
  assert.equal(plan.ok, true, what);
  const p = PIPE(), was = JSON.parse(JSON.stringify(p));
  const idOf = k => k === 'A' ? 'ipA' : k === 'B' ? 'ipB' : /^J\d$/.test(k) ? 'joint' + k[1] : k;
  const pieces = cutPieces(p, plan.pieces, idOf, newId);
  assert.equal(pieces.length, plan.pieces.length, what);
  assert.equal(pieces[0], p, 'the first piece is the pipe itself');
  for (const [i, q] of pieces.entries()) {
    kept(was, q);                                                      // size, IP Types, color, Flow Color, lock, look ...
    assert.ok(q.from && q.to, `${what}: piece ${i} is on an IP at both ends`);
    assert.equal(q.points.length, 2); assert.notEqual(q.points, plan.pieces[i].pts, 'its own points');
    if (i) { for (const k of ['name', 'label', 'labelVisible', '_key']) assert.ok(!(k in q), `${what}: a new piece gets its own ${k}`); assert.ok(q.id.startsWith('new')); }
  }
  assert.equal(new Set(pieces.map(q => q.id)).size, pieces.length, 'no id twice');
  return pieces;
}
// a valve (Rule 5.26)
const BOX = { x: 100, y: 80, w: 100, h: 60 };
check(splitAt([0, 110], [400, 110], BOX, [{ id: 'l', c: [100, 112], f: [-1, 0] }, { id: 'r', c: [200, 112], f: [1, 0] }]), 'a valve');
// a pump, its outlet on top: round with elbows (Rule 5.26)
const pump = check(splitAt([0, 110], [400, 110], BOX, [{ id: 'in', c: [200, 112], f: [1, 0] }, { id: 'out', c: [180, 80], f: [0, -1] }]), 'a pump');
assert.ok(pump.length > 2, 'a pump makes more pieces, all alike');
// a pump over an open end: the pipe is made shorter
check(splitAt([0, 110], [150, 110], BOX, [{ id: 'l', c: [100, 112], f: [-1, 0] }, { id: 'r', c: [200, 112], f: [1, 0] }], { bOpen: true }), 'over an open end');
// a tee and a cross (Rule 5.25)
check(fitOnPipe([0, 200], [400, 200], [200, 203], [{ id: 'w', c: [170, 203], v: [-1, 0] }, { id: 'e', c: [230, 203], v: [1, 0] }, { id: 's', c: [200, 240], v: [0, 1] }]), 'a tee');
check(fitOnPipe([0, 200], [400, 200], [200, 203], [{ id: 'w', c: [170, 203], v: [-1, 0] }, { id: 'e', c: [230, 203], v: [1, 0] }, { id: 's', c: [200, 240], v: [0, 1] }, { id: 'n', c: [200, 166], v: [0, -1] }]), 'a cross');
// an elbow never cuts the middle of a pipe: none of its ends run along it
assert.equal(fitOnPipe([0, 200], [400, 200], [200, 203], [{ id: 'w', c: [170, 203], v: [-1, 0] }, { id: 's', c: [200, 240], v: [0, 1] }]).ok, false, 'an elbow');
console.log('pipe split: both pieces keep everything ok');

// a new pipe drawn on to a pipe (a corner, Rule 5.19) takes its size, IP Type at the joint and color
const nb = PIPE(), g = { size: '0.5', ipTypeFrom: 'MPT1/2', ipTypeTo: 'MPT1/2', color: '#8a8f96', from: 'ipB', to: 'x' };
takeNeighbour(g, nb, 'ipB');
assert.deepEqual([g.size, g.ipTypeFrom, g.ipTypeTo, g.color], ['1.5', 'TC1.5', 'TC1.5', '#123456']);
const cu = takeNeighbour({ size: '0.5' }, { size: 'custom', sizeCustom: 1.25, sizeUnits: 'in', from: 'j', ipTypeFrom: 'FPT1.25' }, 'j');
assert.deepEqual([cu.size, cu.sizeCustom, cu.sizeUnits, cu.ipTypeTo], ['custom', 1.25, 'in', 'FPT1.25']);
assert.deepEqual(takeNeighbour({ size: '1' }, null, 'x'), { size: '1' }, 'nothing joined: the Defaults stay');
console.log('a new joined pipe takes the size, IP Type and color: ok');

// the panel uses these for every cut and every joined pipe
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
assert.equal((app.match(/cutPieces\(p, plan\.pieces, idOf, newId\)/g) || []).length, 2, 'a pump, valve, probe tee, Manual Valve, tee and cross all cut with cutPieces');
assert.ok(!/Object\.assign\(clone\(p\), \{ id: newId\(\) \}\) : p/.test(app), 'no other way of cutting a pipe');
assert.ok(app.includes('takeNeighbour(g, draft.graphics.find('), 'a drawn pipe joined to a pipe takes after it');
console.log('panel uses them: ok');

// the size cascade and IP Types on a join (Panel Updates entry 12) run with these
await import('./pipecascade.test.js');
