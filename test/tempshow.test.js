// Tab temperatures in the Units (Rule 2.59, Panel Updates Sandbox entry 9): shown in Settings > Units, saved in the probe's own units
import assert from 'node:assert/strict';
import { needsTurn, unitShown, tShow, dShow, tBack, dBack, boxShow, boxBack, isTempUnit } from '../public/tempshow.js';
import { heatHysRange, heatHysProblem } from '../public/heatmethod.js';

const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-3, `${msg}: ${a} vs ${b}`);
// which units turn
assert.equal(needsTurn('°C', 'US'), true); assert.equal(needsTurn('C', 'US'), true); assert.equal(needsTurn('°F', 'US'), false);
assert.equal(needsTurn('°F', 'Metric'), true); assert.equal(needsTurn('°C', 'Metric'), false);
assert.equal(needsTurn('%', 'US'), false); assert.equal(needsTurn('gal', 'Metric'), false); assert.equal(isTempUnit('pH'), false);
assert.equal(unitShown('°C', 'US'), '°F'); assert.equal(unitShown('F', 'Metric'), '°C'); assert.equal(unitShown('%', 'US'), '%');
// a temperature: the full formula; the 3 Vessel Sample's HLT 65.5556 °C shows 150 °F
near(tShow(65.5556, '°C', 'US'), 150, 'HLT Setpoint in US'); near(tShow(152, '°F', 'Metric'), 66.6667, '152 °F in Metric');
assert.equal(tShow(20, '°C', 'Metric'), 20, 'same units: untouched');
// a difference: 9/5 only, no 32 (the HLT Offset -0.5556 °C shows -1 °F)
near(dShow(-0.5556, '°C', 'US'), -1, 'Offset in US'); near(dShow(1, '°F', 'Metric'), 0.5556, '1 °F step in °C');
// typed back into the probe's units
near(tBack(150, '°C', 'US'), 65.5556, '150 °F typed, kept °C'); near(dBack(-1, '°C', 'US'), -0.5556, '-1 °F typed, kept °C');
near(tBack(66.7, '°F', 'Metric'), 152.06, '66.7 °C typed, kept °F');
// a dialog box: 1 decimal shown; left as shown, the kept number comes back exactly (no drift)
assert.equal(boxShow('abs', 65.5556, '°C', 'US'), 150); assert.equal(boxShow('diff', -0.5556, '°C', 'US'), -1);
assert.equal(boxBack('abs', 150, '150', 65.5556, '°C', 'US'), 65.5556, 'unchanged box saves the kept number');
near(boxBack('abs', 152, '150', 65.5556, '°C', 'US'), 66.6667, 'changed box is turned back');
assert.equal(boxBack('abs', 70, '', '', '°F', 'US'), 70, 'no turn: as typed');
for (let i = 0, v = 65.5556; i < 5; i++) v = boxBack('abs', boxShow('abs', v, '°C', 'US'), String(boxShow('abs', v, '°C', 'US')), v, '°C', 'US'), assert.equal(v, 65.5556, 'open and save 5 times: no drift');
// an Optical SSR's -0.5 °F typed for a probe kept in °C (-0.2778 °C) is in range, though the °C list starts at 0.3
const he = { type: 'digitalOut', subtype: 'element', name: 'hE', heatMethod: 'hysteresis', switchedBy: 'ssr' };
assert.equal(heatHysProblem(he, { units: '°C' }, dBack(-0.5, '°C', 'US'), 0), null, '-0.5 °F on a °C probe');
assert.ok(heatHysProblem(he, { units: '°C' }, -0.2, 0), '-0.2 °C (0.36 °F) still too close');
near(heatHysRange(he, { units: '°C' }).minX, 0.2778, 'exact low end');
console.log('tempshow: OK');
