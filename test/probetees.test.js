// Probe tees and thermowells (Fritz, 2026-11-05, Rule 5.30): IPs on the same spots as the TC Pipe Fittings tees, turned with the
// picture; a tee on a hose cuts the hose.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path';
import { boxPoint, cutHose } from '../public/pipefit.js';

const ROOT = path.join(import.meta.dirname, '..');
const app = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
const tpl = n => JSON.parse(fs.readFileSync(path.join(ROOT, 'templates', 'fitting', n + '.json'), 'utf8'));
const frac = s => s.split(',').map(Number);
// each probe tee is the size of the Widget tee of its shape, with its IPs on the Widget tee's spots
for (const [kind, t] of [['Instrument_Branch', 'Instrument_Tee'], ['Instrument_Run', 'Instrument_Tee'], ['Long_Branch', 'Tee'], ['Long_Run', 'Tee']]) {
  const m = app.match(new RegExp(`  ${kind}: \\{[^\\n]*size: \\[(\\d+), (\\d+)\\], ends: \\[\\[([^\\]]+)\\], \\[([^\\]]+)\\]\\], bend: \\[([^\\]]+)\\]`));
  assert.ok(m, `${kind} found`);
  const T = tpl(t), ev = s => s.split(',').map(x => Function(`return ${x}`)());
  assert.deepEqual([+m[1], +m[2]], T.size, `${kind} is the size of the ${t} Widget`);
  const spots = Object.values(T.ipPos).map(frac);
  for (const e of [ev(m[3]), ev(m[4])]) assert.ok(spots.some(s => Math.abs(s[0] - e[0]) < 0.002 && Math.abs(s[1] - e[1]) < 0.002), `${kind} IP ${e} is on a ${t} IP spot`);
  const b = ev(m[5]), tb = frac(T.bend); assert.ok(Math.abs(b[0] - tb[0]) < 0.002 && Math.abs(b[1] - tb[1]) < 0.002, `${kind} has the ${t} bend`);
}
// turned and flipped with the picture: a Long Tee turned 90 (box 102 wide, 160 high) has its left end at the top
const r = (p) => p.map(v => Math.round(v));
assert.deepEqual(r(boxPoint({ x: 0, y: 0, w: 160, h: 102 }, 160, 102, 0, 29 / 134)), [0, 22]);
assert.deepEqual(r(boxPoint({ x: 0, y: 0, w: 102, h: 160 }, 160, 102, 0, 29 / 134, 90)), [80, 0]);
assert.deepEqual(r(boxPoint({ x: 0, y: 0, w: 102, h: 160 }, 160, 102, 0.5, 1, 90)), [0, 80], 'the branch turns to the left');
assert.deepEqual(r(boxPoint({ x: 0, y: 0, w: 160, h: 102 }, 160, 102, 0, 29 / 134, 0, true)), [160, 22], 'Flip Horizontal');
// a tee on a hose: the hose is cut where it passes the bend, each piece to the end on its side
const cut = cutHose([[0, 50], [100, 50], [200, 50]], [100, 45], [{ id: 'R', c: [120, 50] }, { id: 'L', c: [80, 50] }], { x: 75, y: 30, w: 50, h: 30 });
assert.deepEqual(cut, { pieces: [{ to: 'L', pts: [[0, 50], [80, 50]] }, { from: 'R', pts: [[120, 50], [200, 50]] }] });
assert.equal(cutHose([[0, 50], [200, 50]], [100, 120], [{ id: 'R', c: [120, 50] }, { id: 'L', c: [80, 50] }], { x: 75, y: 100, w: 50, h: 30 }), null, 'not near the hose');
assert.equal(cutHose([[0, 50], [200, 50]], [3, 50], [{ id: 'R', c: [23, 50] }, { id: 'L', c: [-17, 50] }], { x: -20, y: 35, w: 45, h: 30 }), null, 'not on its end');
// a thermowell: one IP, no flow; the front picture
assert.ok(app.includes("if (isThermowell(e)) return { closed: true };"), 'a thermowell fills its opening');
assert.ok(/if \(isThermowell\(e\)\)[^\n]*\n\s*return \[\{ id: `dev:\$\{e\.name\}:in`/.test(app), 'a thermowell has one IP');
assert.ok(fs.existsSync(path.join(ROOT, 'media', 'Images', 'Skynet', 'Other_Equipment', 'Skynet_TC15_Thermowell_Front.svg')), 'the front view picture');
assert.ok(app.includes('if (isProbeTee(it)) return probeTeeOnPipe(it) || teeOnHose(it);'), 'a probe tee cuts a pipe or a hose');
assert.ok(app.includes('if (isTcFit(it)) return tcFitOnPipe(it) || teeOnHose(it);'), 'a tee cuts a hose');
// the Three Vessel sample shows its probes: since Rule 5.31 each vessel is a Vessel Widget whose Placed Thermowell is drawn on it
const s3 = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples', 'configs', 'three-vessel-one-pump', 'config.json'), 'utf8'));
for (const n of ['HLT_Vessel', 'MLT_Vessel', 'BK_Vessel']) assert.ok(s3.graphics.some(g => g.name === n && g.vwidget && g.probeStyle === 'thermowell' && g.ports.thermowell.installed), `${n} shows its thermowell`);
assert.ok(app.includes("thermowell: 'Images/Skynet/Other_Equipment/Skynet_TC15_Thermowell_Short.svg'"), 'the short thermowell picture');
console.log('probe tees ok');
