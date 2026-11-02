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
