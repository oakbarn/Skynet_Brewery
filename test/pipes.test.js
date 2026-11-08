// Rule 5.19 (Fritz, 2026-11-02): pipes run only Horizontal, Vertical or 45 and turn only at a fitting
import test from 'node:test';
import assert from 'node:assert/strict';
import { dirOf, onAngle, angledEnd, alongLine, fitFor } from '../public/pipefit.js';
import { straightenPipes } from '../lib/pipes.js';

test('only Horizontal, Vertical and 45 are allowed angles', () => {
  assert.equal(onAngle([0, 0], [100, 0]), true);
  assert.equal(onAngle([0, 0], [0, -50]), true);
  assert.equal(onAngle([0, 0], [40, 40]), true);
  assert.equal(onAngle([0, 0], [-40, 40]), true);
  assert.equal(onAngle([0, 0], [100, 30]), false);
  assert.equal(onAngle([5, 5], [5, 5]), false);
});

test('drawing snaps the end to the nearest allowed line', () => {
  assert.deepEqual(angledEnd([0, 0], [100, 10]).c, [100, 0]);
  assert.deepEqual(angledEnd([0, 0], [8, 100]).c, [0, 100]);
  assert.deepEqual(angledEnd([0, 0], [52, 48]).c, [50, 50]);
  assert.deepEqual(angledEnd([0, 0], [-52, 48]).c, [-50, 50]);
  assert.equal(dirOf(1, 1), 1); assert.equal(dirOf(0, -1), 6); assert.equal(dirOf(-1, 0), 4);
  assert.deepEqual(alongLine([0, 0], 0, [70, 25]), [70, 0]);
  assert.deepEqual(alongLine([0, 0], 1, [60, 40]), [50, 50]);
});

test('joints get the fitting the pipes need, turned the right way', () => {
  assert.deepEqual(fitFor([4, 2]), { fitting: 'elbow90', rotate: '0', ok: true });
  assert.deepEqual(fitFor([6, 0]), { fitting: 'elbow90', rotate: '180', ok: true });     // up and right
  assert.deepEqual(fitFor([4, 1]), { fitting: 'elbow45', rotate: '0', ok: true });
  assert.equal(fitFor([0, 3]).fitting, 'elbow45');
  assert.deepEqual(fitFor([0, 4]), { fitting: 'coupling', rotate: '0', ok: true });
  assert.deepEqual(fitFor([2, 6]), { fitting: 'coupling', rotate: '90', ok: true });
  assert.equal(fitFor([0, 4, 6]).fitting, 'tee');
  assert.equal(fitFor([0, 2, 4, 6]).fitting, 'cross');
  assert.equal(fitFor([0, 1]).ok, false);           // 45 degrees apart: no fitting does that
});

test('an older pipe with bends is cut into straight pipes joined by elbows', () => {
  const c = { elements: [], graphics: [
    { id: 'p1', kind: 'pipe', name: 'Pipe_1', workspace: 'T', from: 'a', to: 'b', points: [[0, 0], [0, 100], [200, 100]], color: '#111' },
    { id: 'h1', kind: 'pipe', hose: true, workspace: 'T', points: [[0, 0], [33, 70], [90, 10]] },
    { id: 'p2', kind: 'pipe', workspace: 'T', from: 'c', to: 'd', points: [[0, 0], [100, 0]] }] };
  const report = straightenPipes(c);
  assert.equal(report.length, 1);
  const pipes = c.graphics.filter(g => g.kind === 'pipe' && !g.hose);
  assert.equal(pipes.length, 3);
  assert.ok(pipes.every(p => p.straight && p.points.length === 2 && onAngle(p.points[0], p.points[1])));
  const [first, second] = pipes.filter(p => p.id.startsWith('p1'));
  const elbow = c.graphics.find(g => g.kind === 'ip');
  assert.equal(elbow.fitting, 'elbow90');
  assert.equal(elbow.rotate, '180');                 // arms up (N) and right (E)
  assert.equal(first.from, 'a'); assert.equal(first.to, elbow.id);
  assert.equal(second.from, elbow.id); assert.equal(second.to, 'b');
  assert.equal(first.name, 'Pipe_1'); assert.equal(second.name, 'Pipe_2'); assert.equal(second.color, '#111');
  assert.deepEqual(c.graphics.find(g => g.id === 'h1').points, [[0, 0], [33, 70], [90, 10]]);     // hoses bend: left alone
  assert.deepEqual(straightenPipes(c), []);          // once is enough
});

test('a piece at another angle is turned, and lets go of an IP it no longer reaches', () => {
  const c = { graphics: [{ id: 'p', kind: 'pipe', workspace: 'T', from: 'a', to: 'b', points: [[0, 0], [100, 30]] }] };
  straightenPipes(c);
  const p = c.graphics.find(g => g.id === 'p'), end = c.graphics.find(g => g.kind === 'ip');
  assert.deepEqual(p.points, [[0, 0], [100, 0]]);
  assert.equal(p.from, 'a'); assert.equal(p.to, end.id); assert.equal(end.fitting, 'coupling');
});

test('the shipped sample Schemas and the default Schema follow the rule', async () => {
  const fs = await import('node:fs');
  for (const f of ['config/brewery.json', 'samples/configs/two-vessel-one-pump/config.json', 'samples/configs/three-vessel-one-pump/config.json']) {
    const c = JSON.parse(fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8'));
    for (const p of (c.graphics || []).filter(g => g.kind === 'pipe' && !g.hose)) {
      assert.ok(p.straight && p.points.length === 2 && onAngle(p.points[0], p.points[1]), `${f}: ${p.id}`);
    }
    assert.deepEqual(straightenPipes(c), [], f);
  }
});

// Rule 5.26 (Fritz, 2026-11-04): a pump or valve put on a pipe cuts it
import { splitAt } from '../public/pipefit.js';
const BOX = { x: 100, y: 80, w: 100, h: 60 };
const PUMP = [{ id: 'in', c: [200, 112], f: [1, 0] }, { id: 'out', c: [180, 80], f: [0, -1] }];     // inlet faces right, outlet up
const VALVE = [{ id: 'l', c: [100, 112], f: [-1, 0] }, { id: 'r', c: [200, 112], f: [1, 0] }];

test('a valve between the ends cuts the pipe into two straight pipes', () => {
  const r = splitAt([0, 110], [400, 110], BOX, VALVE);
  assert.equal(r.ok, true); assert.deepEqual(r.shift, [0, -2]); assert.deepEqual(r.joints, []);
  assert.deepEqual(r.pieces, [{ from: 'A', to: 'l', pts: [[0, 110], [100, 110]] }, { from: 'r', to: 'B', pts: [[200, 110], [400, 110]] }]);
});

test('a pump between the ends: one piece straight in, the other round with elbows', () => {
  const r = splitAt([0, 110], [400, 110], BOX, PUMP);
  assert.equal(r.ok, true); assert.equal(r.mode, 'mid'); assert.equal(r.joints.length, 3);
  assert.deepEqual(r.pieces[0], { from: 'in', to: 'B', pts: [[200, 110], [400, 110]] });
  for (const p of r.pieces) assert.ok(onAngle(p.pts[0], p.pts[1]) && (p.pts[0][0] === p.pts[1][0] || p.pts[0][1] === p.pts[1][1]), 'every piece is level or up and down');
  assert.equal(r.pieces.at(-1).from, 'A'); assert.deepEqual(r.pieces.at(-1).pts[1], r.joints[2]);
  assert.equal(r.joints[2][1], 110);                     // back on the pipe's line
  assert.ok(r.joints[1][0] < BOX.x);                      // past the side of the pump
});

test('over an open end the pipe is made shorter; an end on a tee is left alone', () => {
  const box = { x: 300, y: 80, w: 100, h: 60 }, ports = [{ id: 'in', c: [300, 110], f: [-1, 0] }, { id: 'out', c: [380, 80], f: [0, -1] }];
  const r = splitAt([0, 110], [350, 110], box, ports, { bOpen: true });
  assert.equal(r.ok, true); assert.equal(r.mode, 'end'); assert.equal(r.drop, 'B');
  assert.deepEqual(r.pieces, [{ from: 'A', to: 'in', pts: [[0, 110], [300, 110]] }]);
});

test('over an end on a tee: it slides back clear of the tee and both IPs are joined (Fritz: "it needs both IPs")', () => {
  const box = { x: 300, y: 80, w: 100, h: 60 }, valve = [{ id: 'l', c: [300, 110], f: [-1, 0] }, { id: 'r', c: [400, 110], f: [1, 0] }];
  const r = splitAt([0, 110], [350, 110], box, valve, { bOpen: false });
  assert.equal(r.ok, true); assert.equal(r.mode, 'end'); assert.equal(r.drop, null);
  assert.deepEqual(r.shift, [-115, 0]);                   // its right IP is now 65 short of the tee
  assert.deepEqual(r.pieces, [{ from: 'A', to: 'l', pts: [[0, 110], [185, 110]] }, { from: 'r', to: 'B', pts: [[285, 110], [350, 110]] }]);
  const pump = splitAt([0, 110], [350, 110], box, [{ id: 'in', c: [300, 110], f: [-1, 0] }, { id: 'out', c: [380, 80], f: [0, -1] }], { bOpen: false });
  assert.equal(pump.ok, true); assert.equal(pump.pieces.at(-1).to, 'B'); assert.deepEqual(pump.pieces.at(-1).pts[1], [350, 110]);
  assert.equal(splitAt([250, 110], [350, 110], box, valve, { bOpen: false }).ok, false);     // too short to put it in
});

test('nothing is cut when the pipe passes by, is at 45, or there is no room to go round', () => {
  assert.equal(splitAt([0, 300], [400, 300], BOX, PUMP), null);
  assert.equal(splitAt([0, 0], [300, 300], BOX, PUMP), null);
  assert.equal(splitAt([90, 110], [400, 110], BOX, PUMP).ok, false);
});

// Rule 5.25 (Fritz, 2026-11-05): a tee or a cross dropped on a pipe cuts it there
import { fitOnPipe } from '../public/pipefit.js';
const TEE = [{ id: 'w', c: [170, 203], v: [-1, 0] }, { id: 'e', c: [230, 203], v: [1, 0] }, { id: 's', c: [200, 240], v: [0, 1] }];
const BEND = [200, 203];

test('a tee dropped between the ends of a level pipe cuts it in two on its run', () => {
  const r = fitOnPipe([0, 200], [400, 200], BEND, TEE);
  assert.equal(r.ok, true); assert.equal(r.mode, 'mid'); assert.deepEqual(r.shift, [0, -3]);
  assert.deepEqual(r.pieces, [{ from: 'A', to: 'w', pts: [[0, 200], [170, 200]] }, { from: 'e', to: 'B', pts: [[230, 200], [400, 200]] }]);
});

test('a tee whose run is across the pipe asks to be turned; a pipe that passes by is left alone', () => {
  assert.deepEqual(fitOnPipe([200, 0], [200, 400], BEND, TEE), { ok: false, turn: true });
  assert.equal(fitOnPipe([0, 260], [400, 260], BEND, TEE), null);
  assert.equal(fitOnPipe([300, 200], [400, 200], BEND, TEE), null);
});

test('a tee dropped over an open end makes the pipe shorter; over a joined end it says why', () => {
  const r = fitOnPipe([180, 200], [400, 200], BEND, TEE, { aOpen: true });
  assert.equal(r.ok, true); assert.equal(r.mode, 'end'); assert.equal(r.drop, 'A');
  assert.deepEqual(r.pieces, [{ from: 'e', to: 'B', pts: [[230, 200], [400, 200]] }]);
  assert.equal(fitOnPipe([180, 200], [400, 200], BEND, TEE).ok, false);
});
// A turned elbow or tee is drawn once (Fritz, 2026-11-08: "extra Gray parts that are not part of an elbow or a Tee"): its turned
// picture only, never a second unturned copy as the box's background behind it.
test('a Skynet pipe fitting is drawn once', async () => {
  const app = (await import('node:fs')).readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /else if \(g\.image && !isUnit\(\{ \.\.\.g, loose: false \}\)\) n\.style\.backgroundImage/);
});
