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
assert.ok(app.includes('const PUMP_STD = { w: 300, h: 300, ends: [[285 / 300, 150 / 300], [243 / 300, 56 / 300]] };'), 'the panel puts the IPs on the standard spots');
assert.ok(/pump: \{ type: 'digitalOut', subtype: 'pump',[^}]*w: 150, h: 150/.test(app), 'a new Pump starts 150 x 150');
console.log('pump standard ok');
