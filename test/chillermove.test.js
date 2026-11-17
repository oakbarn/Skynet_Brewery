// Moving an Immersion Chiller by hand on a live Tab (OakBarn Brewery, 2026-11-17, Rule 5.42, Help 200)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { placeChiller, removeChiller, placeError, moveChiller, chillerJoins, chillerDropVessels, isImmersion } from '../lib/chiller.js';
import { spotIn, takesChiller } from '../public/chillmove.js';

const cfg = JSON.parse(fs.readFileSync(new URL('../samples/configs/three-vessel-one-pump/config.json', import.meta.url)));
const n0 = cfg.graphics.length;
const bk = cfg.graphics.find(g => g.name === 'BK_Vessel');
const other = cfg.graphics.find(g => takesChiller(g) && g.workspace === bk.workspace && g !== bk);
assert.ok(other, 'the sample has a second vessel on the Brew House Tab');

// a Process places one; a person moves it out (free floating) and into the other vessel
const r = placeChiller(cfg, null, 'Immersion_Chiller', 'BK_Vessel'), c = r.chiller;
assert.ok(isImmersion(c) && c.byProcess);
const j = chillerJoins(cfg, c);
assert.equal(j.ips.length, 2); assert.equal(j.hoses.length, 2); assert.equal(j.pipes.length, 0);
const ip0 = [j.ips[0].x, j.ips[0].y];
let m = moveChiller(cfg, { id: c.id, x: c.x + 500, y: c.y - 40, into: null, hoses: [{ id: j.hoses[0].id, points: [[1, 2], [3, 4.4]] }] });
assert.ok(m.ok, m.error);
assert.equal(c.chillerOn, undefined, 'free floating');
assert.deepEqual([j.ips[0].x, j.ips[0].y], [ip0[0] + 500, ip0[1] - 40], 'its IPs go with it');
assert.deepEqual(j.hoses[0].points, [[1, 2], [3, 4]], 'its hoses take the drawn points');
assert.equal(j.hoses[0].to, j.ips.find(g => g.port === 'in').id, 'its hoses stay on its IPs');
const [sx, sy] = spotIn(other, c);
m = moveChiller(cfg, { id: c.id, x: sx, y: sy, into: other.id });
assert.ok(m.ok, m.error); assert.equal(c.chillerOn, other.id);
assert.ok(!chillerDropVessels(cfg, { id: 'x', workspace: bk.workspace }).includes(other), 'a vessel with a chiller in it takes no other');

// what stops a move
assert.match(moveChiller(cfg, { id: 'nope', x: 0, y: 0 }).error, /gone/);
assert.match(moveChiller(cfg, { id: c.id, x: 'a', y: 0 }).error, /Bad/);
assert.match(moveChiller(cfg, { id: c.id, x: 0, y: 0, into: 'nope' }).error, /cannot go there/);
assert.match(moveChiller(cfg, { id: c.id, x: 0, y: 0, hoses: [{ id: 'nope', points: [[0, 0], [1, 1]] }] }).error, /Bad hose/);
c.locked = true; assert.match(moveChiller(cfg, { id: c.id, x: 0, y: 0 }).error, /locked/); delete c.locked;
assert.ok(!isImmersion({ kind: 'vessel', vesselType: 'pchiller' }), 'a plate chiller never moves');
assert.ok(!isImmersion({ kind: 'vessel', vesselType: 'ccoil', vtype: 'Jacketed (glycol)' }), 'nor a jacketed coil');
assert.ok(!isImmersion({ kind: 'vessel', vesselType: 'ccoil', name: 'Chillzilla_1' }), 'nor a Chillzilla');
assert.ok(!isImmersion({ kind: 'vessel', vesselType: 'ccoil', liquidPorts: 4 }), 'nor a coil with 4 IPs');
{ const pipe = { id: 'rigid', kind: 'pipe', from: j.ips[0].id, to: 'x', workspace: c.workspace }; cfg.graphics.push(pipe);
  assert.match(moveChiller(cfg, { id: c.id, x: 0, y: 0 }).error, /joined by a pipe/); cfg.graphics.pop(); }

// remove_Chiller takes off only what a Process placed (the moved one was placed by a Process, so it goes, wherever it is)
assert.deepEqual(removeChiller(cfg, null).removed, ['wgt_CHL_Immersion~chiller_BH']);
assert.equal(cfg.graphics.length, n0);
// a chiller a person built and moved in by hand stays, and place_Chiller says the vessel is taken
const hand = { id: 'handchl', kind: 'vessel', vesselType: 'ccoil', liquidPorts: 2, name: 'wgt_CHL_Mine_BH', label: 'My chiller', workspace: bk.workspace, x: 10, y: 10, w: 100, h: 100 };
cfg.graphics.push(hand);
assert.ok(moveChiller(cfg, { id: 'handchl', x: 20, y: 20, into: bk.id }).ok);
assert.match(placeError(cfg, null, 'Immersion_Chiller', 'BK_Vessel'), /already in .* by hand/);
assert.deepEqual(removeChiller(cfg, 'BK_Vessel').removed, []);
assert.deepEqual(removeChiller(cfg, null).removed, []);
assert.ok(cfg.graphics.includes(hand));
console.log('chillermove ok');
