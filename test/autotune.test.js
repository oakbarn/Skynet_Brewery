// PID Auto-tune (Rule 6.39, Help 237, public/autotune.js): a simulated kettle is tuned, and the safety stops work.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { RelayTune, tuneGains, tuneHighestDefault, tuneBand } from '../public/autotune.js';
import { Store } from '../lib/store.js';
import { Control } from '../lib/control.js';

// a pot of water: full power heats 2 °F a minute, it loses heat to a 70 °F room, and the probe sees it 20 s late
function kettle({ start = 70, rate = 2 / 60, loss = 1 / 3000, dead = 20 } = {}) {
  let T = start; const q = [];
  return { step(u, dt) { q.push(u); const uu = q.length > dead / dt ? q.shift() : 0; T += (rate * uu / 100 - loss * (T - 70)) * dt; return T; } };
}
function run(tune, k, limitS = 4 * 3600) {
  let pv = 70;
  for (let t = 0; t < limitS && !tune.done; t++) { tune.step(t * 1000, pv); pv = k.step(tune.out, 1); }
  return pv;
}
{
  const t = new RelayTune({ setpoint: 152, highest: 162, band: tuneBand(false) });
  assert.equal(t.text, 'Warming up to the Setpoint');
  assert.equal(t.out, 100, 'the first push is full power');
  run(t, kettle());
  assert.ok(t.done && !t.fail, `it finishes: ${t.text}`);
  assert.equal(t.text, 'Done');
  const { kp, ki, kd, hold, tu } = t.result;
  assert.ok(kp > 0 && ki > 0 && kd >= 0, JSON.stringify(t.result));
  // what holds 152 °F: losses (152 - 70) / 3000 per second = rate * hold / 100 -> about 82 %
  assert.ok(hold > 60 && hold <= 80, `Hold output near what holds the Setpoint: ${hold}`);
  assert.ok(tu > 30 && tu < 3000, `a swing takes ${tu} s`);
  // a PID with these numbers holds 152 °F (the form lib/control.js uses)
  const k = kettle({ start: 140 }); let pv = 140, I = 0, last = pv, peak = 0, settle = [];
  for (let s = 0; s < 3 * 3600; s++) {
    const e = 152 - pv; I = Math.max(-100, Math.min(100, I + ki * e)); const u = Math.max(0, Math.min(100, kp * e + I - kd * (pv - last)));
    last = pv; pv = k.step(u, 1); peak = Math.max(peak, pv); if (s > 2 * 3600) settle.push(pv);
  }
  assert.ok(peak < 156, `little overshoot: ${peak}`);
  assert.ok(settle.every(x => Math.abs(x - 152) < 1), 'it holds the Setpoint');
}
// Highest temperature stops it
{
  const t = new RelayTune({ setpoint: 152, highest: 155, band: 0.5 });
  t.step(0, 150); t.step(1000, 156);
  assert.ok(t.done && /above the Highest temperature 155/.test(t.text), t.text);
  assert.equal(t.out, 0);
}
// a lost probe for 30 s stops it; a short gap does not
{
  const t = new RelayTune({ setpoint: 152, highest: 162 });
  t.step(0, 100); t.step(10000, NaN); assert.ok(!t.done);
  t.step(41000, NaN); assert.ok(t.done && /no reading/.test(t.text), t.text);
}
// the time limit
{
  const t = new RelayTune({ setpoint: 152, highest: 162, maxMin: 1 });
  t.step(0, 100); t.step(61000, 100); assert.ok(t.done && /longer than 1 minutes/.test(t.text), t.text);
}
// Max output caps the push
assert.equal(new RelayTune({ setpoint: 100, highest: 110, maxOut: 40 }).out, 40);
assert.deepEqual(tuneGains(22, 100), { kp: 10, ki: 0.0455, kd: 158.7 });
assert.equal(tuneHighestDefault(152, false), 162);
assert.equal(tuneHighestDefault(66.7, true), 71.7);

// on the Brain: a Heating Element on Precise (the 3 Vessel sample's probes are °C) tuned through lib/control.js
{
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'autotune'));
  const cfg = path.join(d, 'c.json');
  fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', connection: 'simulator' }], elements: [
    { name: 'Temp', type: 'temperature', sensor: 'simulated', units: '°C' },
    { name: 'hE_1', type: 'digitalOut', subtype: 'element', device: 'MB', channel: 42, input: 'Temp', heatMethod: 'precise', target: 66.7, kp: 10, ki: 0.1, kd: 0, outTime: 2 },
    { name: 'Pump', type: 'digitalOut', device: 'MB', channel: 43 },
  ] }));
  const store = new Store(cfg, path.join(d, 'data')); store.load();
  const ctl = new Control(store), g = p => store.getProp('hE_1', p);
  assert.equal(g('autotune'), ''); assert.equal(g('autotune_kp'), 0);
  assert.throws(() => store.setProp('hE_1', 'autotune_kp', 5), /read only/, 'only the Brain sets the results');
  assert.throws(() => store.getProp('Pump', 'autotune'), 'only a Heating Element has them');
  assert.match(ctl.startTune('Pump', { highest: 80 }), /not a Heating Element/);
  store.setProp('Temp', 'value', 50);
  assert.match(ctl.startTune('hE_1', { highest: 60 }), /above the Setpoint/);
  assert.equal(ctl.startTune('hE_1', { highest: 72 }), null);
  assert.equal(g('state'), true, 'it turns the element On');
  assert.equal(g('autotune'), 'Warming up to the Setpoint');
  // 30 L of water: full power heats about 1 °C a minute, it loses heat to a 21 °C room, the probe lags 15 s
  let T = 50, P = 50, t = 0, outs = 0;
  for (let i = 0; i < 4 * 3600 * 10 && ctl.tuning('hE_1'); i++) {
    store.setProp('Temp', 'value', Math.round(P / 0.0625) * 0.0625);
    ctl.tick(t += 100);
    if (g('output')) outs++;
    T += ((g('output') ? 1 / 60 : 0) - (T - 21) * 0.0002) * 0.1;
    P += (T - P) * 0.1 / 15;
  }
  assert.equal(g('autotune'), 'Done', g('autotune'));
  assert.ok(outs > 0, 'the element was switched');
  assert.equal(g('state'), false, 'done: the element is Off'); assert.equal(g('output'), false); assert.equal(g('value'), 0);
  assert.ok(g('autotune_kp') > 0 && g('autotune_ki') > 0, `${g('autotune_kp')} ${g('autotune_ki')} ${g('autotune_kd')} ${g('autotune_hold')}`);
  assert.equal(g('kp'), 10, 'nothing is changed until Use');
  assert.equal(g('method'), 'Precise', 'its method is kept');
  // Stop, and turning it Off, stop it
  store.setProp('Temp', 'value', 60);
  assert.equal(ctl.startTune('hE_1', { highest: 72 }), null);
  ctl.tick(t += 100); ctl.stopTune('hE_1');
  assert.equal(g('autotune'), 'Stopped: Stop was pressed.'); assert.equal(g('state'), false);
  assert.equal(ctl.startTune('hE_1', { highest: 72 }), null);
  store.setProp('hE_1', 'state', false); ctl.tick(t += 100);
  assert.equal(g('autotune'), 'Stopped: the element was turned Off.'); assert.ok(!ctl.tuning('hE_1'));
  // the Highest temperature
  assert.equal(ctl.startTune('hE_1', { highest: 72 }), null);
  store.setProp('Temp', 'value', 72.5); ctl.tick(t += 100);
  assert.match(g('autotune'), /^Stopped: the probe read 72.5, above the Highest temperature 72/); assert.equal(g('state'), false);
}
console.log('autotune tests passed');
