// Quick Disconnect hoses (Fritz, 2026-11-05, Skynet Rule 5.28): the free end moves at any time, onto an IP or into a vessel top
import assert from 'node:assert/strict';
import { moveHoseEnd } from '../lib/qdhose.js';

const cfg = () => ({
  elements: [{ name: 'MB_01_Valve', workspace: 'Brew' }, { name: 'MB_02_Valve', workspace: 'Cellar' }],
  graphics: [
    { id: 'h1', kind: 'pipe', hose: true, qd: true, workspace: 'Brew', from: 'dev:Pump_1:out', to: 'c1', points: [[0, 0], [50, 50]] },
    { id: 'c1', kind: 'ip', fitting: 'coupling', workspace: 'Brew' },
    { id: 'h2', kind: 'pipe', hose: true, workspace: 'Brew', from: 'a', to: 'b', points: [[0, 0], [5, 5]] },
    { id: 'k1', kind: 'vessel', vesselType: 'vessel', workspace: 'Brew' },
    { id: 'ch', kind: 'vessel', vesselType: 'pchiller', workspace: 'Brew' },
    { id: 'q1', kind: 'ip', fitting: 'qd', qdOn: 'dev:MB_01_Valve:in', workspace: 'Brew' },
    { id: 'cap', kind: 'ip', fitting: 'cap', workspace: 'Brew' },
  ],
});
const pts = [[0, 0], [10, 20], [30, 40]];

{ const c = cfg(); const r = moveHoseEnd(c, { id: 'h1', to: 'vtop:k1', points: pts });
  assert.ok(r.ok); const h = c.graphics.find(g => g.id === 'h1');
  assert.equal(h.to, 'vtop:k1'); assert.deepEqual(h.points, pts);
  assert.ok(!c.graphics.some(g => g.id === 'c1'), 'its old loose-end coupling goes once nothing is on it'); }
{ const c = cfg(); assert.ok(moveHoseEnd(c, { id: 'h1', to: 'q1', points: pts }).ok, 'onto a Quick Disconnect'); }
{ const c = cfg(); assert.ok(moveHoseEnd(c, { id: 'h1', to: 'dev:MB_01_Valve:out', points: pts }).ok, 'onto a valve IP'); }
{ const c = cfg(); assert.ok(moveHoseEnd(c, { id: 'h1', to: null, points: pts }).ok, 'a loose end'); assert.equal(c.graphics.find(g => g.id === 'h1').to, null); }
assert.ok(moveHoseEnd(cfg(), { id: 'h2', to: null, points: pts }).error, 'a plain hose moves only in Edit layout');
assert.ok(moveHoseEnd(cfg(), { id: 'h1', to: 'vtop:ch', points: pts }).error, 'only a vessel (kettle, HLT, mash tun ...) has a top');
assert.ok(moveHoseEnd(cfg(), { id: 'h1', to: 'dev:MB_02_Valve:in', points: pts }).error, 'an IP on another Tab');
assert.ok(moveHoseEnd(cfg(), { id: 'h1', to: 'cap', points: pts }).error, 'an End Cap is no IP');
assert.ok(moveHoseEnd(cfg(), { id: 'h1', to: 'dev:Pump_1:out', points: pts }).error, 'not back onto its own fixed end');
assert.ok(moveHoseEnd(cfg(), { id: 'h1', to: null, points: [[0, 'x']] }).error, 'bad points');
{ const c = cfg(); c.graphics[0].locked = true; assert.ok(moveHoseEnd(c, { id: 'h1', to: null, points: pts }).error, 'a locked hose stays'); }
console.log('qdhose tests passed');
