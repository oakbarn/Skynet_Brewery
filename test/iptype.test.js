// IP Type (Skynet Rule 5.40): the connector on each end of a pipe or hose and on a pump's In and Out IPs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { IP_TYPES, IP_SIZES, ipTypeSizeOk, ipTypePick, defaultIpType, pumpIpType, ipFamily, ipFits, ipMate, ipTypeChoices, isIpCode, sizedIp, toSized, fitOwnedEnds, usedIpTypes, hoseEndJoined } from '../public/iptype.js';

assert.deepEqual(IP_TYPES.map(t => t[1]), ['Tri-Clamp', 'NPT', 'BSP', 'Quick Disconnect'], 'the 4 Default IP Types');
assert.equal(new Set(IP_TYPES.map(t => t[1][0])).size, 4, 'unique first letters (Rule 2.38)');
assert.ok(!ipTypeSizeOk('tc', 0.25) && ipTypeSizeOk('tc', 0.5) && ipTypeSizeOk('npt', 0.25), 'Tri-Clamp is not made under 1/2"');
assert.deepEqual(ipTypePick(0.25).map(t => t[0]), ['npt', 'bsp', 'qd']);
// Sized IP Types (OakBarn Brewery, 2026-11-16): a type and a size in one code, real sizes only, 1/8" to 6" and metric
const all = IP_SIZES.flatMap(f => f.codes);
for (const c of ['TC1.5', 'TC3/4', 'TC2', 'FPT1', 'FPT1/8', 'MPT6', 'MPT1/2', 'BSP3/4', 'DN15', 'DN150', 'FMSSQD1/2', 'MSSQD1/2']) assert.ok(all.includes(c), c);
assert.ok(!all.includes('TC1/8') && !all.includes('TC1'), 'no Tri-Clamp that is not made');
assert.equal(new Set(all).size, all.length, 'no code twice');
// Camlocks (OakBarn Brewery, 2026-11-17): tick boxes from 1/2" up, female coupler CAMF fits male adapter CAMM of the same size
for (const c of ['CAMF1/2', 'CAMM1/2', 'CAMF6', 'CAMM2']) assert.ok(all.includes(c), c);
assert.equal(ipFamily('CAMF1/2'), 'cam'); assert.equal(ipMate('CAMF1/2'), 'CAMM1/2'); assert.equal(ipMate('CAMM3/4'), 'CAMF3/4');
assert.ok(ipFits('CAMF1/2', 'CAMM1/2') && !ipFits('CAMF1/2', 'CAMF1/2') && !ipFits('CAMF1/2', 'CAMM1') && !ipFits('CAMF1/2', 'FMSSQD1/2'));
assert.deepEqual(['TC1.5', 'FPT1/2', 'MPT1', 'BSP1', 'DN15', 'FMSSQD1/2', 'tc', 'npt'].map(ipFamily), ['tc', 'npt', 'npt', 'bsp', 'dn', 'qd', 'tc', 'npt']);
assert.equal(ipMate('FPT1/2'), 'MPT1/2'); assert.equal(ipMate('MSSQD1/2'), 'FMSSQD1/2'); assert.equal(ipMate('FMSSQD3/4'), 'MSSQD3/4'); assert.equal(ipMate('TC1.5'), 'TC1.5');
assert.ok(ipFits('MPT1/2', 'FPT1/2') && !ipFits('MPT1/2', 'MPT1/2') && !ipFits('FPT1/2', 'FPT3/4') && !ipFits('TC1.5', 'MPT1/2') && !ipFits('MPT1/2', 'BSP1/2'));
assert.ok(ipFits('TC1.5', 'TC2', { sameSize: false }) && !ipFits('TC1.5', 'TC2'), 'two sizes of one type meet at a reducer');
// none ticked to start: a list holds only what is used and its own
assert.deepEqual(ipTypeChoices(undefined, [], []), []);
assert.deepEqual(ipTypeChoices(['TC2', 'TC1.5'], ['FPT1/2'], ['MPT1/2', 'junk']).map(c => c[0]), ['TC1.5', 'TC2', 'FPT1/2', 'MPT1/2'], 'ticked + used + its own, in list order');
assert.equal(sizedIp('tc', 0.5), 'TC1.5'); assert.equal(sizedIp('tc', 2), 'TC2'); assert.equal(sizedIp('npt', 0.75), 'MPT3/4'); assert.equal(sizedIp('npt', 0.5, { female: true }), 'FPT1/2');
assert.equal(toSized('bsp', 1), 'BSP1'); assert.equal(toSized('FPT1', 3), 'FPT1', 'a code stays as it is');
assert.equal(defaultIpType({}), 'TC1.5', 'a new pipe: Tri-Clamp in its size');
assert.equal(defaultIpType({}, { hose: true }), 'MSSQD1/2', 'a new hose: Quick Disconnect');
assert.equal(defaultIpType({ defPipeIp: 'bsp' }), 'BSP1/2', 'the Default pipe IP Type');
assert.equal(defaultIpType({ defHoseIp: 'tc' }, { hose: true, qd: true }), 'MSSQD1/2', 'a QD hose is always Quick Disconnect');
assert.equal(defaultIpType({}, { inch: 0.25 }), 'MPT1/4', 'a 1/4" pipe never starts Tri-Clamp');
assert.equal(pumpIpType('TC1.5'), 'TC1.5'); assert.equal(pumpIpType('FPT1/2'), 'FPT1/2'); assert.equal(pumpIpType('1/2" NPT in and out'), 'FPT1/2');
assert.equal(pumpIpType('BSP1/2'), 'BSP1/2'); assert.equal(pumpIpType('', { defPipeIp: 'npt' }), 'FPT1/2', 'no Ports: the Default pipe IP Type, female');
// ends that fit by themselves: a pipe end on a pump takes its mate; a hose's QD end is female on a pipe or pump, male elsewhere
const fc = { elements: [{ name: 'P', subtype: 'pump', ipTypeIn: 'FPT1/2', ipTypeOut: 'TC1.5' }], graphics: [
  { id: 'a', kind: 'pipe', from: 'dev:P:in', to: 'x', ipTypeFrom: 'TC1.5', ipTypeTo: 'TC1.5' },
  { id: 'b', kind: 'pipe', from: 'dev:P:out', to: 'y', ipTypeFrom: 'MPT1/2', ipTypeTo: 'TC1.5' },
  { id: 'h', kind: 'pipe', hose: true, from: 'y', to: 'z', ipTypeFrom: 'MSSQD1/2', ipTypeTo: 'FMSSQD1/2' }] };
assert.equal(fitOwnedEnds(fc), 4);
assert.deepEqual(fc.graphics.map(g => [g.ipTypeFrom, g.ipTypeTo]), [['MPT1/2', 'TC1.5'], ['TC1.5', 'TC1.5'], ['FMSSQD1/2', 'MSSQD1/2']]);
assert.ok(hoseEndJoined(fc, fc.graphics[2], 'from') && !hoseEndJoined(fc, fc.graphics[2], 'to'));
assert.deepEqual(usedIpTypes(fc).sort(), ['FMSSQD1/2', 'FPT1/2', 'MPT1/2', 'MSSQD1/2', 'TC1.5']);
assert.equal(fitOwnedEnds(fc), 0, 'nothing more to fit');
const store = fs.readFileSync(new URL('../lib/store.js', import.meta.url), 'utf8');
assert.ok(store.includes('if (!c.ipTypeKept)') && store.includes('if (!c.ipSizesKept)'), 'once per Schema, pipes, hoses and pumps already made get it, then their sizes');
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
for (const k of ['ipTypeFrom', 'ipTypeTo', 'ipTypeIn', 'ipTypeOut', 'defPipeIp', 'defHoseIp']) assert.ok(app.includes(`'${k}'`), k + ' is a box');
assert.ok(app.includes('stampIpType(g)') && app.includes('stampIpType(p)'), 'a new pipe or hose takes the Default');
assert.ok(app.includes("'ipTicks', 'Sizes to show in the IP Type lists', 'ticks'"), 'the tick boxes in Default settings');
assert.ok(app.includes("if (editing && draft) fitOwnedEnds(draft);") && app.includes("class: 'ipMis'"), 'ends fit by themselves; the warning ring');
console.log('iptype ok');

// a hose end with a Quick Disconnect moves outside Edit layout, one end at a time; pipes never (Rules 5.28, 5.40)
const { moveHoseEnd, qdEndMoves } = await import('../lib/qdhose.js');
const cfg = { elements: [], graphics: [
  { id: 'a', kind: 'ip', workspace: 'T', fitting: 'point' }, { id: 'b', kind: 'ip', workspace: 'T', fitting: 'point' }, { id: 'c', kind: 'ip', workspace: 'T', fitting: 'point' },
  { id: 'h', kind: 'pipe', hose: true, workspace: 'T', from: 'a', to: 'b', ipTypeFrom: 'MSSQD1/2', ipTypeTo: 'MPT1/2', points: [[0, 0], [10, 10]] },
  { id: 'p', kind: 'pipe', workspace: 'T', from: 'a', to: 'b', ipTypeFrom: 'MSSQD1/2', ipTypeTo: 'MSSQD1/2', points: [[0, 0], [10, 0]] }] };
assert.ok(qdEndMoves(cfg.graphics[3], 'from') && !qdEndMoves(cfg.graphics[3], 'to'), 'only its Quick Disconnect end');
assert.ok(!qdEndMoves(cfg.graphics[4], 'from'), 'a pipe never moves outside Edit layout');
assert.ok(moveHoseEnd(cfg, { id: 'h', end: 'from', to: 'c', points: [[5, 5], [10, 10]] }).ok);
assert.equal(cfg.graphics[3].from, 'c'); assert.equal(cfg.graphics[3].to, 'b', 'the other end stays');
assert.ok(moveHoseEnd(cfg, { id: 'h', end: 'to', to: 'a', points: [[5, 5], [0, 0]] }).error, 'its NPT end does not move');
assert.ok(moveHoseEnd(cfg, { id: 'p', end: 'from', to: 'c', points: [[5, 5], [10, 0]] }).error, 'a pipe does not move');
console.log('qd ends ok');

// Corner IPs (OakBarn Brewery, 2026-11-15): no Inlet from / Outlet from box; the joined pipe or hose sets the side
assert.ok(!/pumpInDir|pumpOutDir|PUMP_DIR_|'Outlet from'|'Inlet from'/.test(app), 'no Inlet from / Outlet from box');
assert.match(app, /function pumpEndAxis\(e, end, spot\) \{\n  if \(!isCornerSpot\(spot\)\) return null;\n  const p = pumpJoined\(e, end\); if \(!p\) return 'h';/, 'the joined pipe sets the side, else the Side');
console.log('corner IP side set by the joined pipe: ok');

// Rule 18.37 item 2 (changed 2026-11-15): a Left/Right switch leaves the Inlet IP and Outlet IP where they are; only the inside Hose or Pipe is drawn again
assert.ok(!app.includes('mirrorPumpSpots') && app.includes('keepPumpSpots('), 'the IPs stay put on a flip');
assert.match(app, /const was = pumpSpots\(\{ \.\.\.obj, flipH: !flipH, flipV, pumpIn: ins\[0\]\.value, pumpOut: ins\[1\]\.value \}\)/, 'a (start) spot is pinned where it was');
assert.ok(app.includes("root?.querySelector(`input[data-k=\"${k}\"]`)") && app.includes("h('input', { type: 'hidden', 'data-k': k, 'data-kind': 'text', value: obj[k] || '' })"), 'the spots ride hidden in the Orientation');
console.log('pump IPs stay put on a flip: ok');
