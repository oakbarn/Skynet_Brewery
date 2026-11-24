// The Valve Standard (Fritz, 2026-11-05, Rule 5.29): every Skynet valve picture is drawn in the same 300 x 300 box with its pipe
// through the middle, so its IPs are on the same spots and one valve can replace another in the same place.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..'), dir = path.join(ROOT, 'media', 'Images', 'Skynet', 'Valves');
const valves = fs.readdirSync(dir).filter(f => /^(Valve_(Motor_Ball|Manual|Manual_Butterfly|Gas_Solenoid|Motor_Butterfly)_|Motorized_TC15_Ball_Valve_).*\.svg$/.test(f));
assert.ok(valves.length >= 15, 'found the valve pictures');      // 6 unused ones retired to Delete/ (2026-11-18, Rule 18.43)
for (const f of valves) {
  const root = fs.readFileSync(path.join(dir, f), 'utf8').match(/<svg[^>]*>/)[0];
  // a side view is cropped to the valve, 150 long and 300 across (OakBarn Brewery, 2026-11-23, Rule 5.29); a front view stays 300 x 300
  const vb = /_(Horizontal|ClosedHC?\.svg$)/.test(f) || /ClosedH\.svg$/.test(f) ? '75 0 150 300' : /_Vertical|ClosedV_[LR]C?\.svg$/.test(f) ? '0 75 300 150' : '0 0 300 300';
  assert.ok(root.includes(`viewBox="${vb}"`) && root.includes('data-valve-standard="1"'), `${f} is in its Valve Standard box (${vb})`);
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
// The 3 Vessel sample (the test bed, Rule 16.8) shows every valve at the full Valve Standard size, 150 x 150, in proportion with its
// pipes (OakBarn Brewery, 2026-11-09: "the entire Valve Picture is out of proportion to the Pipes"); each pipe joined to a valve is
// long enough that the once-per-Schema step never has to make it smaller.
{
  const smp = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples', 'configs', 'three-vessel-one-pump', 'config.json'), 'utf8'));
  const sv = smp.elements.filter(e => e.subtype === 'valve');
  assert.ok(sv.length >= 6, 'the sample has its valves');
  for (const e of sv) {
    assert.ok(Math.max(e.w, e.h) === 150 && [75, 150].includes(Math.min(e.w, e.h)), `${e.name} is 150 across (75 long for a side view)`);
    const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
    for (const p of smp.graphics.filter(g => g.kind === 'pipe' && [`dev:${e.name}:in`, `dev:${e.name}:out`].some(k => k === g.from || k === g.to))) {
      const far = [`dev:${e.name}:in`, `dev:${e.name}:out`].includes(p.from) ? p.points.at(-1) : p.points[0];
      assert.ok(Math.hypot(far[0] - cx, far[1] - cy) >= 81, `${p.id} is long enough for ${e.name} at full size`);
    }
  }
}
const { fitValveBox, valveSide } = await import('../public/valvebox.js');
assert.equal(valveSide('Images/Skynet/Valves/Valve_Manual_ClosedH.svg'), 'h'); assert.equal(valveSide('Images/Skynet/Valves/Motorized_TC15_Ball_Valve_Vertical_Left.svg'), 'vl');
assert.equal(valveSide('Images/Skynet/Valves/Motorized_TC15_Ball_Valve_Vertical.svg'), 'vr'); assert.equal(valveSide('Images/Skynet/Valves/Valve_Gas_Solenoid_ClosedV_R.svg'), 'vr');
assert.equal(valveSide('Images/Skynet/Valves/Valve_Motor_Butterfly_ClosedFront.svg'), null, 'a front view keeps its square box');
// the box hugs the valve (OakBarn Brewery, 2026-11-24: "Valve box more like this"): 75 long, 93 across, its pipe line kept where it was
{ const e = { imageOff: 'Images/Skynet/Valves/Valve_Manual_ClosedH.svg', x: 100, y: 100, w: 150, h: 150 }; assert.ok(fitValveBox(e)); assert.deepEqual([e.x, e.y, e.w, e.h], [138, 102, 75, 93], 'level: 75 long about its middle, the pipe line still at 175');
  e.imageOff = 'Images/Skynet/Valves/Valve_Manual_Butterfly_ClosedV_L.svg'; fitValveBox(e); assert.deepEqual([e.w, e.h], [93, 75], 'turned upright: the box turns too'); assert.ok(!fitValveBox(e), 'once fitted it stays'); }
{ const e = { imageOff: 'Images/Skynet/Valves/Motorized_TC15_Ball_Valve_Vertical.svg', x: 0, y: 0, w: 64, h: 32 }; assert.ok(fitValveBox(e)); assert.deepEqual([e.x, e.y, e.w, e.h], [23, 0, 40, 32], 'motor right: the pipe line stays at 32');
  const t = { imageOff: 'Images/Skynet/Valves/Motorized_TC15_Ball_Valve_Vertical.svg', orientation: 'l45', x: 0, y: 0, w: 64, h: 32 }; assert.ok(!fitValveBox(t), 'turned 45 degrees: the old box'); }
assert.ok(fs.readFileSync(path.join(ROOT, 'public', 'style.css'), 'utf8').includes('.el.vcrop-h { background-size: 100% auto; background-position: 50% 3.509%; }'), 'the picture is cut to the valve band');
console.log('valve standard sample ok');
