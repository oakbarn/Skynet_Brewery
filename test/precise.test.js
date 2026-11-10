// Precise heating (Fritz, 2026-11-07: "a method of precise control built if possible using offsets to get to .1 F or .1 C",
// Rule 6.19, Help 156): a calm PID on the Heating Element, two-point probe calibration, and the probe step warning.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Control } from '../lib/control.js';
import { temperatureFrom, twoPoint, boilAt } from '../lib/sensors.js';
import { heatMethodKey, heatMethodWord, probeStep, NEEDS_PROBE, PERCENT_METHODS, HEAT_SETTINGS } from '../public/heatmethod.js';

assert.equal(heatMethodKey('Precise'), 'precise');
assert.equal(heatMethodKey('PREC'), 'precise');
assert.equal(heatMethodWord('precise'), 'Precise');
assert.ok(NEEDS_PROBE.includes('precise') && PERCENT_METHODS.includes('precise'));
assert.ok(HEAT_SETTINGS.precise.some(s => s[0] === 'holdoutput') && HEAT_SETTINGS.precise.some(s => s[0] === 'smoothing'));

// how fine a probe sees
assert.equal(probeStep({ sensor: 'pt100', units: '°F' }).ok, true, 'PT100 holds 0.1 °F');
assert.equal(probeStep({ sensor: 'ds18b20', units: '°C' }).ok, true, 'DS18B20 holds 0.1 °C');
assert.equal(probeStep({ sensor: 'ds18b20', units: '°F' }).ok, false, 'DS18B20 is just short of 0.1 °F');
assert.match(probeStep({ sensor: 'ds18b20', units: '°F' }).text, /±0.1 °F/);
assert.equal(probeStep({ sensor: 'ntc', units: '°F' }).ok, false, 'a thermistor on a 10-bit pin is too coarse');
assert.equal(probeStep(null), null);

// two-point calibration: reads 33 in ice water (truth 32) and 210 at the boil (truth 211 at 500 ft)
const cal = { calLowRead: 33, calLowTrue: 32, calHighRead: 210, calHighTrue: 211 };
assert.equal(twoPoint(cal, 33), 32);
assert.equal(twoPoint(cal, 210), 211);
assert.ok(Math.abs(twoPoint(cal, 121.5) - 121.5) < 1e-9, 'the middle: both errors cancel');
assert.equal(twoPoint({ calLowRead: 33, calLowTrue: 32 }, 150), 149, 'one point = an offset');
assert.equal(twoPoint({}, 150), 150);
assert.equal(boilAt(5000), 202);
assert.ok(Math.abs(boilAt(0, '°C') - 100) < 1e-9);
assert.equal(temperatureFrom({ ...cal, offset: 0.5 }, 'T', 210), 211.5, 'DS18B20: two points, then the offset');
assert.ok(Math.abs(temperatureFrom({ units: '°C' }, 'T', 212) - 100) < 1e-9, 'a DS18B20 set to °C reads in °C');
assert.ok(Number.isNaN(temperatureFrom({}, 'T', 'NAN')));

// the Precise method on a Heating Element, holding a small water bath
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'precise'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
  { name: 'Temp', type: 'temperature', sensor: 'simulated' },
  { name: 'hE_1', type: 'digitalOut', subtype: 'element', device: 'MB', channel: 42, input: 'Temp', heatMethod: 'precise', target: 173,
    kp: 20, ki: 0.5, kd: 0, maxOutput: 100, holdOutput: 0, smoothing: 4, calcTime: 1, outTime: 2, methodSpot_pid: true },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const ctl = new Control(store);
const g = p => store.getProp('hE_1', p);
assert.equal(g('method'), 'Precise');
assert.equal(g('outtime'), 2);
assert.equal(g('smoothing'), 4);

// exact power: 12.34 % of each 1 s window comes out right over time, though the control only looks every 0.1 s
store.setProp('hE_1', 'outtime', 1); store.setProp('hE_1', 'kp', 0); store.setProp('hE_1', 'ki', 0); store.setProp('hE_1', 'holdoutput', 12.34);
store.setProp('Temp', 'value', 150); store.setProp('hE_1', 'state', true);
let on = 0; const N = 10000;
for (let i = 0; i < N; i++) { ctl.tick(i * 100); if (g('output')) on++; }
assert.equal(g('value'), 12.34);
assert.ok(Math.abs(on / N * 100 - 12.34) < 0.15, `exact power (${on / N * 100} %)`);
store.setProp('hE_1', 'state', false); ctl.tick(N * 100);
assert.equal(g('output'), false); assert.equal(g('value'), 0);

// a bath: 100 % heats it 3 °F a minute; it loses heat to the 70 °F room and needs about 62 % to stay at 173. The DS18B20 sees
// 0.1125 °F steps.
function run(method, secs, opts = {}) {
  store.setProp('hE_1', 'method', method);
  store.setProp('hE_1', 'outtime', 2); store.setProp('hE_1', 'kp', opts.kp ?? 20); store.setProp('hE_1', 'ki', opts.ki ?? 0.5); store.setProp('hE_1', 'kd', opts.kd ?? 0);
  store.setProp('hE_1', 'holdoutput', opts.hold ?? 0); store.setProp('hE_1', 'maxintegral', 100);
  let T = opts.start ?? 165, P = T, t = 1e6, max = -Infinity, late = [], jumps = 0, lastV = null;
  store.setProp('hE_1', 'state', true);
  for (let i = 0; i < secs * 10; i++) {
    store.setProp('Temp', 'value', Math.round(P / 0.1125) * 0.1125);
    ctl.tick(t += 100);
    T += ((g('output') ? 0.05 : 0) - (T - 70) * 0.0003) * 0.1;
    P += (T - P) * 0.1 / 10;                    // the probe in its thermowell lags about 10 s
    max = Math.max(max, T);
    if (i > secs * 10 * 0.6) { late.push(T); const v = g('value'); if (lastV !== null) jumps = Math.max(jumps, Math.abs(v - lastV)); lastV = v; }
  }
  store.setProp('hE_1', 'state', false); ctl.tick(t += 100);
  return { max, lo: Math.min(...late), hi: Math.max(...late), jumps };
}
const pid = run('PID', 4000), prec = run('Precise', 4000);
assert.ok(prec.hi - 173 < 0.15 && 173 - prec.lo < 0.15, `Precise holds 173 to about ±0.1 °F (${prec.lo.toFixed(3)} - ${prec.hi.toFixed(3)})`);
assert.ok(prec.jumps < pid.jumps / 2, `the heater twitches less than with PID (${prec.jumps} % against ${pid.jumps} % a step)`);
assert.ok(prec.max <= pid.max, `no more overshoot than PID (${prec.max.toFixed(2)} against ${pid.max.toFixed(2)})`);
// with a D part, a plain PID jumps at every probe step; Precise works on the smoothed reading
const pidD = run('PID', 4000, { kd: 100 }), precD = run('Precise', 4000, { kd: 100 });
assert.ok(precD.jumps < pidD.jumps / 4, `with Kd: ${precD.jumps} % against ${pidD.jumps} % a step`);
// from 53 °F below, with the Hold output about right: the I part does not build up on the way, so it overshoots less
const cold = run('Precise', 4000, { start: 120, hold: 60 });
const pidCold = run('PID', 4000, { start: 120 });
assert.ok(cold.max - 173 < 0.6 && cold.max < pidCold.max - 0.2, `cold start: less overshoot than PID (${cold.max.toFixed(2)} against ${pidCold.max.toFixed(2)})`);
assert.ok(cold.hi - 173 < 0.15 && 173 - cold.lo < 0.15, `and holds (${cold.lo.toFixed(3)} - ${cold.hi.toFixed(3)})`);
assert.ok(Number.isFinite(g('pv')), '.pv is the smoothed reading');
console.log(`precise ok: holds ${prec.lo.toFixed(2)} - ${prec.hi.toFixed(2)} °F; heater steps ${prec.jumps} % (PID ${pid.jumps} %); cold start peak ${cold.max.toFixed(2)} (PID ${pidCold.max.toFixed(2)})`);
