// The Pump Standard (Fritz, 2026-11-05, Rule 5.27): every Skynet pump picture (the brew pump drawings, their Covers and the older
// Riptide-style pictures) is drawn in the same 300 x 300 box with the inlet IP at (285, 150) and the outlet IP at (243, 56), so one
// pump can replace another in the same place and stay joined to its pipes. The sump pump keeps its own box.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path';

const dir = path.join(import.meta.dirname, '..', 'media', 'Images', 'Skynet', 'Pumps');
const pumps = fs.readdirSync(dir).filter(f => /^Pump_.*\.svg$/.test(f) && !/Sump/.test(f)).map(f => path.join(dir, f));
const covers = fs.readdirSync(path.join(dir, 'Covers')).filter(f => f.endsWith('.svg')).map(f => path.join(dir, 'Covers', f));
assert.ok(pumps.length >= 25 && covers.length >= 24, 'found the pump pictures and covers');
for (const f of [...pumps, ...covers]) {
  const t = fs.readFileSync(f, 'utf8'), root = t.match(/<svg[^>]*>/)[0];
  assert.ok(root.includes('viewBox="0 0 300 300"') && root.includes('data-pump-standard="1"'), `${path.basename(f)} is in the 300 x 300 Pump Standard box`);
  assert.ok(!root.includes('data-brewpanel-traced'), `${path.basename(f)} is hand made, so it is never traced over again`);
}
for (const f of fs.readdirSync(dir).filter(f => /Sump/.test(f))) assert.ok(!fs.readFileSync(path.join(dir, f), 'utf8').includes('data-pump-standard'), 'the sump pump keeps its own box');
const app = fs.readFileSync(path.join(import.meta.dirname, '..', 'public', 'app.js'), 'utf8');
assert.ok(app.includes('const PUMP_STD = { w: 300, h: 300, ends: [[285 / 300, 150 / 300], [243 / 300, 56 / 300]], std: true };'), 'the panel knows where every Skynet pump drawing has its ports');
// Every pump has 8 IPs (OakBarn Brewery, 2026-11-11, Rule 5.27): the corners and the middle of each side of its box
assert.ok(app.includes("const PUMP_SPOTS = { TL: [0, 0], TM: [0.5, 0], TR: [1, 0], RM: [1, 0.5], BR: [1, 1], BM: [0.5, 1], BL: [0, 1], LM: [0, 0.5] };"), 'the 8 IP spots');
assert.ok(app.includes("isStdPump(e) ? [flipSpot('RM', e.flipH, e.flipV), flipSpot('TR', e.flipH, e.flipV)]"), 'a Skynet pump starts with its Inlet on the Right Middle and its Outlet on the Top Right');
assert.ok(/\['pumpIn', 'Inlet IP', 'sel'[^\n]*with: \['pumpOut', 'Outlet IP', 'sel'/.test(app) && app.includes("['pumpLink', 'Hose or Pipe', 'sel'"), 'its Properties pick the Inlet and Outlet spots and Hose or Pipe');
assert.ok(/pump: \{ type: 'digitalOut', subtype: 'pump',[^}]*w: 150, h: 150/.test(app), 'a new Pump starts 150 x 150');
console.log('pump standard ok');

// The Three Vessel sample (Fritz, 2026-11-08: a Blichmann Riptide put in place of its pump joined its center inlet to the outlet
// pipe): its pump's pipes end on its IP spots (Rule 5.27, 8 IPs since 2026-11-11), so any pump can be swapped in and stay joined. Its
// pump is shown Left (Flip Horizontal), so it starts with its Inlet on the Left Middle and its Outlet on the Top Left, at pipe size 10.
{
  const cfg = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '..', 'samples', 'configs', 'three-vessel-one-pump', 'config.json'), 'utf8'));
  const e = cfg.elements.find(x => x.name === 'BM_22_DO@Pump_Pump_BH');
  assert.ok(e.w === 150 && e.h === 150 && e.flipH, 'the sample pump is 150 x 150, shown Left');
  assert.ok(!e.pumpIn && !e.pumpOut, 'the sample pump keeps its start spots');
  const ips = { in: [e.x, e.y + 75], out: [e.x, e.y] };
  for (const k of ['in', 'out']) {
    const id = `dev:BM_22_DO@Pump_Pump_BH:${k}`, p = cfg.graphics.find(g => g.kind === 'pipe' && (g.from === id || g.to === id));
    assert.ok(p, `a pipe is on the pump ${k}`);
    const end = p.from === id ? p.points[0] : p.points[p.points.length - 1];
    assert.ok(Math.hypot(end[0] - ips[k][0], end[1] - ips[k][1]) <= 1.5, `the ${k} pipe ends on the pump's ${k} IP (${end} vs ${ips[k]})`);
  }
  console.log('three vessel sample pump pipes ok');
}
