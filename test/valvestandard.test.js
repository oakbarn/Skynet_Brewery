// The Valve Standard (Fritz, 2026-11-05, Rule 5.29): every Skynet valve picture is drawn in the same 300 x 300 box with its pipe
// through the middle, so its IPs are on the same spots and one valve can replace another in the same place.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..'), dir = path.join(ROOT, 'media', 'Images', 'Skynet', 'Valves');
const valves = fs.readdirSync(dir).filter(f => /^(Valve_(Motor_Ball|Manual|Manual_Butterfly|Gas_Solenoid|Motor_Butterfly)_|Motorized_TC15_Ball_Valve_).*\.svg$/.test(f));
assert.ok(valves.length >= 20, 'found the valve pictures');
for (const f of valves) {
  const root = fs.readFileSync(path.join(dir, f), 'utf8').match(/<svg[^>]*>/)[0];
  assert.ok(root.includes('viewBox="0 0 300 300"') && root.includes('data-valve-standard="1"'), `${f} is in the 300 x 300 Valve Standard box`);
  assert.ok(!/\swidth=|\sheight=|preserveAspectRatio/.test(root), `${f} has no fixed size`);
}
for (const f of ['Valve_Check.svg', 'Quick_Disconnect.svg']) assert.ok(!fs.readFileSync(path.join(dir, f), 'utf8').includes('data-valve-standard'), `${f} is a fitting, not a valve`);
const app = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
assert.ok(app.includes("const VALVE_STD = { h: [[0, 0.5], [1, 0.5]], v: [[0.5, 0], [0.5, 1]], f: [[0.5, 0.5], [0.5, 0.5]], fe: [[0.5, 0.5], [0.5, 1]] };"), 'the IPs are on the standard spots');
assert.ok(/valve: \{ type: 'digitalOut', subtype: 'valve',[^}]*w: 150, h: 150/.test(app), 'a new valve starts 150 x 150');
assert.ok(/const userValveStd = e => isUserValvePic\(e\)/.test(app), "a user's own valve picture follows the standard too");
for (const f of fs.readdirSync(path.join(ROOT, 'templates', 'device'))) {
  const t = JSON.parse(fs.readFileSync(path.join(ROOT, 'templates', 'device', f), 'utf8')), p = t.props || {};
  if (p.w !== undefined || p.h !== undefined) assert.ok(p.w === 150 && p.h === 150, `${f} is 150 x 150`);
}
const store = fs.readFileSync(path.join(ROOT, 'lib', 'store.js'), 'utf8');
assert.ok(store.includes('if (!c.valveStandard) {'), 'older Schemas make their valves square once');
console.log('valve standard ok');
