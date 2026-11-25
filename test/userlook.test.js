// Panel Updates 6 (OakBarn Brewery, 2026-11-19): a User Defined Motorized Ball Valve's one picture gives four looks (Rule 18.43)
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
assert.ok(app.includes("const USER_LOOK = { hd: { turn: 0, sx: 1, sy: -1 }, vl: { turn: -90, sx: 1, sy: 1 }, vr: { turn: -90, sx: -1, sy: 1 } };"), 'the looks: flipped, turned, turned and mirrored');
// the turn and mirror as the Tab draws them (CSS scale(sx, sy) rotate(turn)): the motor (top of the picture) and the In end (left)
const look = { hd: { turn: 0, sx: 1, sy: -1 }, vl: { turn: -90, sx: 1, sy: 1 }, vr: { turn: -90, sx: -1, sy: 1 } };
const move = (l, [x, y]) => { const r = l.turn * Math.PI / 180, c = Math.round(Math.cos(r)), s = Math.round(Math.sin(r)); return [(c * x - s * y) * l.sx + 0, (s * x + c * y) * l.sy + 0]; };
assert.deepStrictEqual(move(look.hd, [0, -1]), [0, 1], 'Horizontal Flipped: motor below');
assert.deepStrictEqual(move(look.vl, [0, -1]), [-1, 0], 'Vertical Left: motor left');
assert.deepStrictEqual(move(look.vr, [0, -1]), [1, 0], 'Vertical Right: motor right');
for (const k of ['vl', 'vr']) assert.deepStrictEqual(move(look[k], [-1, 0]), [0, 1], `${k}: the In end is at the bottom`);
assert.ok(app.includes("const USER_LOOK_ENDS = { h: VALVE_STD.h, v: [[0.5, 1], [0.5, 0]] };"), 'its IPs follow: In at the bottom when upright');
assert.ok(/VALVE_STD\[userLook\(e\) \? 'h' : userValveKind\(e\)\]/.test(app), 'its In and Out spots fit the picture as drawn, then it is turned');
// Panel Update 14 (Rule 18.43): the Orientation is Horizontal or Vertical, and Flip Horizontal / Flip Vertical give the other looks;
// a valve saved as Horizontal Flipped or Vertical Right becomes Horizontal + Flip Vertical or Vertical + Flip Horizontal (same look)
assert.ok(/\['h', 'Horizontal'\], \['vl', 'Vertical'\]/.test(app) && app.includes('function userOrientToFlips('), 'the Orientation offers Horizontal and Vertical, the Flips the rest');
assert.ok(/\['h', 'hd', 'vl', 'vr'\]\.includes\(k\)/.test(app), 'the Valve Profile offers them too');
const help = fs.readFileSync(path.join(ROOT, 'help', '128-motorized-ball-valve-device-properties.md'), 'utf8');
assert.ok(help.includes('## One picture, four looks (User Defined)') && help.includes('What picture works best'), 'Help 128 has the guide');
console.log('user valve looks ok');
