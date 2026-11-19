// Panel Updates entry 12 (OakBarn Brewery, 2026-11-16): "You can change a pipe size individually and the pipe size will cascade to
// auto size" and "When Pipes are Joined, the IPs are auto typed to the join. Once locked, they stay until unlocked." (Rules 5.36, 5.40)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pipeLine, sameSize } from '../public/pipefit.js';
import { joinIpType } from '../public/iptype.js';

const ws = 'Brew House';
const P = (id, from, to, x = {}) => ({ id, kind: 'pipe', workspace: ws, from, to, size: '0.5', ipTypeFrom: 'TC1.5', ipTypeTo: 'TC1.5', ...x });
// A - elbow(e1,e2) - B - shared IP j - C - reducer(r1,r2) - D ; B also on valve dev IP to E ; hose H on j ; locked L on j2
const g = [P('A', 'v1', 'e1'), P('B', 'e2', 'j'), P('C', 'j', 'r1'), P('D', 'r2', 'x'), P('E', 'dev:V:out', 'y'), P('B2', 'e2b', 'dev:V:in'),
  P('H', 'j', 'z', { hose: true }), P('L', 'j', 'j2', { locked: true }), P('M', 'j2', 'w'), P('O', 'e1', 'q', { workspace: 'Other' })];
const through = id => ({ e1: ['e2', 'e2b'], e2: ['e1', 'e2b'], e2b: ['e1', 'e2'] })[id] || [];      // an elbow passes; a reducer and a valve do not
const names = l => l.map(p => p.id).sort().join();
const A = g.find(p => p.id === 'A');
assert.equal(names(pipeLine(A, g, through)), 'B,B2,C', 'through the elbow and the shared IP; stops at the reducer, the valve, a hose, a locked pipe, another Tab');
assert.equal(names(pipeLine(g.find(p => p.id === 'D'), g, through)), '', 'a Reducer stops it');
assert.equal(names(pipeLine(A, g)), '', 'with no fitting to pass through, only pipes on the same IP');
A.size = 'custom'; A.sizeCustom = 38; A.sizeUnits = 'mm';
const C = sameSize(g.find(p => p.id === 'C'), A);
assert.deepEqual([C.size, C.sizeCustom, C.sizeUnits], ['custom', 38, 'mm']);
assert.equal(names(pipeLine(g.find(p => p.id === 'B'), g, through, id => id === 'j')), 'A,B2', 'a Manual Valve IP holds');
const B = sameSize(g.find(p => p.id === 'B'), { size: '1', sizeUnits: 'in' }); assert.equal(B.sizeCustom, undefined);

// IP Types: the end just joined takes the type already at the joint
const cfg = { graphics: [P('X', 'a', 'j', { ipTypeTo: 'TC2' }), P('Y', 'j', 'b'), P('Z', 'j', 'c', { locked: true }), P('Hq', 'q', 'd', { hose: true, ipTypeFrom: 'FMSSQD1/2' }),
  P('Hn', 'j', 'e', { hose: true, ipTypeFrom: 'MPT1/2' }), P('Hm', 'k', 'f', { hose: true, ipTypeFrom: 'FPT1/2' }), P('Hk', 'k', 'g', { hose: true, ipTypeFrom: 'MPT1/2' })] };
const get = id => cfg.graphics.find(p => p.id === id);
assert.equal(joinIpType(cfg, get('Y'), 'from'), true); assert.equal(get('Y').ipTypeFrom, 'TC2', 'a pipe end takes the pipe end already there');
assert.equal(get('Y').ipTypeTo, 'TC1.5', 'its other end stays');
assert.equal(joinIpType(cfg, get('Z'), 'from'), false, 'a locked pipe keeps its own'); assert.equal(get('Z').ipTypeFrom, 'TC1.5');
assert.equal(joinIpType(cfg, get('Hq'), 'from'), false, 'a hose Quick Disconnect end is fitted by fitOwnedEnds');
assert.equal(joinIpType(cfg, get('Hn'), 'from'), false, 'a hose on a pipe does not change (adapter note, OakBarn Brewery 2026-11-19)');
assert.equal(get('X').ipTypeTo, 'TC2', 'the pipe is not changed by a hose');
assert.equal(joinIpType(cfg, get('Hk'), 'from'), true); assert.equal(get('Hk').ipTypeFrom, 'FPT1/2', 'a hose joined to a hose takes its type');
assert.equal(joinIpType(cfg, get('Y'), 'from'), false, 'already the same: nothing changes');

// wired in: Properties Save cascades, a join types the end
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
assert.match(app, /if \(sizeWas !== null && sizeInches\(item\) !== sizeWas\) cascadePipeSize\(item\)/);
assert.equal((app.match(/joinIpType\(draft, /g) || []).length, 2, 'both ways an end joins (Save layout rejoin and a moved pipe)');
console.log('pipecascade tests passed');
