// IP Type (Skynet Rule 5.40): the connector on each end of a pipe or hose and on a pump's In and Out IPs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { IP_TYPES, ipTypeSizeOk, ipTypePick, defaultIpType, pumpIpType } from '../public/iptype.js';

assert.deepEqual(IP_TYPES.map(t => t[1]), ['Tri-Clamp', 'NPT', 'BSP', 'Quick Disconnect'], 'the 4 choices');
assert.equal(new Set(IP_TYPES.map(t => t[1][0])).size, 4, 'unique first letters (Rule 2.38)');
assert.ok(!ipTypeSizeOk('tc', 0.25) && ipTypeSizeOk('tc', 0.5) && ipTypeSizeOk('npt', 0.25), 'Tri-Clamp is not made under 1/2"');
assert.deepEqual(ipTypePick(0.25).map(t => t[0]), ['npt', 'bsp', 'qd']);
assert.equal(defaultIpType({}), 'tc', 'a new pipe: Tri-Clamp unless changed');
assert.equal(defaultIpType({}, { hose: true }), 'qd', 'a new hose: Quick Disconnect unless changed');
assert.equal(defaultIpType({ defPipeIp: 'bsp' }), 'bsp', 'the Default pipe IP Type');
assert.equal(defaultIpType({ defHoseIp: 'tc' }, { hose: true, qd: true }), 'qd', 'a QD hose is always Quick Disconnect');
assert.equal(defaultIpType({}, { inch: 0.25 }), 'npt', 'a 1/4" pipe never starts Tri-Clamp');
assert.equal(pumpIpType('TC1.5'), 'tc'); assert.equal(pumpIpType('FPT1/2'), 'npt'); assert.equal(pumpIpType('MPT1'), 'npt');
assert.equal(pumpIpType('BSP1/2'), 'bsp'); assert.equal(pumpIpType('', { defPipeIp: 'npt' }), 'npt', 'no Ports: the Default pipe IP Type');
const store = fs.readFileSync(new URL('../lib/store.js', import.meta.url), 'utf8');
assert.ok(store.includes('if (!c.ipTypeKept)'), 'once per Schema, pipes, hoses and pumps already made get it');
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
for (const k of ['ipTypeFrom', 'ipTypeTo', 'ipTypeIn', 'ipTypeOut', 'defPipeIp', 'defHoseIp', 'pumpInDir', 'pumpOutDir']) assert.ok(app.includes(`'${k}'`), k + ' is a box');
assert.ok(app.includes('stampIpType(g)') && app.includes('stampIpType(p)'), 'a new pipe or hose takes the Default');
console.log('iptype ok');

// a hose end with a Quick Disconnect moves outside Edit layout, one end at a time; pipes never (Rules 5.28, 5.40)
const { moveHoseEnd, qdEndMoves } = await import('../lib/qdhose.js');
const cfg = { elements: [], graphics: [
  { id: 'a', kind: 'ip', workspace: 'T', fitting: 'point' }, { id: 'b', kind: 'ip', workspace: 'T', fitting: 'point' }, { id: 'c', kind: 'ip', workspace: 'T', fitting: 'point' },
  { id: 'h', kind: 'pipe', hose: true, workspace: 'T', from: 'a', to: 'b', ipTypeFrom: 'qd', ipTypeTo: 'npt', points: [[0, 0], [10, 10]] },
  { id: 'p', kind: 'pipe', workspace: 'T', from: 'a', to: 'b', ipTypeFrom: 'qd', ipTypeTo: 'qd', points: [[0, 0], [10, 0]] }] };
assert.ok(qdEndMoves(cfg.graphics[3], 'from') && !qdEndMoves(cfg.graphics[3], 'to'), 'only its Quick Disconnect end');
assert.ok(!qdEndMoves(cfg.graphics[4], 'from'), 'a pipe never moves outside Edit layout');
assert.ok(moveHoseEnd(cfg, { id: 'h', end: 'from', to: 'c', points: [[5, 5], [10, 10]] }).ok);
assert.equal(cfg.graphics[3].from, 'c'); assert.equal(cfg.graphics[3].to, 'b', 'the other end stays');
assert.ok(moveHoseEnd(cfg, { id: 'h', end: 'to', to: 'a', points: [[5, 5], [0, 0]] }).error, 'its NPT end does not move');
assert.ok(moveHoseEnd(cfg, { id: 'p', end: 'from', to: 'c', points: [[5, 5], [10, 0]] }).error, 'a pipe does not move');
console.log('qd ends ok');
