// Stepper motors: conversions, protocol lines, the simulated board, and Process (script) commands.  Run: node test/steppers.test.js
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { StepperSim, clampPosition, goLine, homeLine, runLine, stepperCfgLines, stepsPerUnit, toSteps } from '../lib/steppers.js';
import { Store } from '../lib/store.js';
import { Hardware } from '../lib/hardware.js';

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} is not ${b} ±${tol}`);

// Steps per unit: 200-step motor, 16 microsteps, 8 mm lead screw = 400 steps per mm
assert.equal(stepsPerUnit({ stepsPerRev: 200, microsteps: 16, units: 'mm', unitsPerRev: 8 }), 400);
assert.equal(stepsPerUnit({ stepsPerRev: 200, microsteps: 8, units: 'deg' }), 1600 / 360, 'degrees default to 360 per turn');
assert.equal(stepsPerUnit({ stepsPerRev: 200, microsteps: 8, gearRatio: 5, units: 'rev' }), 8000, 'gear ratio');
assert.equal(stepsPerUnit({ stepsPerRev: 2048, microsteps: 2, units: '%', unitsPerRev: 25 }), 2048 * 2 / 25, 'quarter-turn valve: 25 % per turn = 0-100 % over 4 turns');
assert.equal(stepsPerUnit({ units: 'steps', stepsPerRev: 200, microsteps: 16 }), 1);
assert.equal(clampPosition({ minPos: 0, maxPos: 90 }, 120), 90); assert.equal(clampPosition({ minPos: 0, maxPos: 90 }, -5), 0); assert.equal(clampPosition({}, -5), -5);

// Lines to the board
const a4988 = { name: 'Mill', channel: 22, dirPin: 23, enablePin: 24, driver: 'A4988', stepsPerRev: 200, microsteps: 16, units: 'rev', maxSpeed: 2, accel: 4 };
assert.deepEqual(stepperCfgLines(a4988), ['CFG STEP 22 23 24 4 6400 12800 1']);
assert.deepEqual(stepperCfgLines({ ...a4988, invertDir: true, holdWhenIdle: false, enablePin: '', homePin: 'A8', homeSwitch: 'nc', homeDir: 'plus' }),
  ['CFG STEP 22 23 -1 1 6400 12800 1', 'CFG HOME 22 62 3'], 'invert, no hold, no enable pin, home switch on A8 = 62, NC at the high end');
assert.deepEqual(stepperCfgLines({ name: 'V', channel: 30, pin2: 31, pin3: 32, pin4: 33, driver: 'ULN2003 + 28BYJ-48', stepsPerRev: 2048, microsteps: 2, units: 'deg', maxSpeed: 45 }),
  ['CFG STEP4 30 31 32 33 28 512 1024'], 'ULN2003: 4 pins, half step, 28BYJ-48 coil order, 45 deg/s');
assert.equal(goLine(a4988, 1.5), 'GO 22 4800 6400'); assert.equal(goLine(a4988, -1, 0.5), 'GO 22 -3200 1600');
assert.equal(runLine(a4988, -1), 'RUN 22 -3200'); assert.equal(runLine(a4988, 0), 'RUN 22 0');
assert.equal(homeLine({ ...a4988, homePin: 30 }), 'HOME 22 -1600 32000 0', 'home backward at 1/4 top speed, give up after 10 turns');
assert.equal(homeLine({ ...a4988, homePin: 30, homeDir: 'plus', homeSpeed: 1, minPos: 0, maxPos: 3, homePosition: 3 }), 'HOME 22 3200 19200 9600');

// Simulated board
{
  const out = [], sim = new StepperSim(l => out.push(l), () => ({ start: 0, switchAt: -500 }));
  sim.line('CFG STEP 22 23 24 4 1000 2000 1'); sim.line('CFG HOME 22 30 0');
  sim.line('GO 22 1000 1000');
  for (let i = 0; i < 30; i++) sim.tick(0.1);
  assert.equal(out.at(-1), 'SP 22 1000 0 0', 'reached 1000 steps and stopped: ' + out.at(-1));
  sim.line('HOME 22 -1000 100000 0');
  for (let i = 0; i < 40; i++) sim.tick(0.1);
  assert.ok(out.includes('SH 22 1'), 'found the home switch'); assert.equal(out.at(-1), 'SP 22 0 0 1', 'homed at 0');
  out.length = 0; sim.line('RUN 22 500'); sim.tick(0.1); sim.tick(0.1); sim.line('STOP 22');
  for (let i = 0; i < 10; i++) sim.tick(0.1);
  assert.match(out.at(-1), /^SP 22 \d+ 0 1$/, 'run then stop');
  out.length = 0; sim.line('EN 22 0'); sim.line('GO 22 0 100'); assert.match(out.at(-1), /turned off/, 'no moves while off');
}

// Through the panel: a stepper on the simulator, driven the way a Process (script) drives it
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpstep'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ devices: [{ name: 'Sim', type: 'simulator' }], elements: [
  { name: 'Valve_M', type: 'stepper', device: 'Sim', channel: 22, dirPin: 23, driver: 'A4988', stepsPerRev: 200, microsteps: 1, units: '%', unitsPerRev: 100,
    maxSpeed: 50, accel: 200, minPos: 0, maxPos: 100, homePin: 30, sim: { start: 40, switchAt: -3 } },
  { name: 'Free_M', type: 'stepper', device: 'Sim', channel: 26, dirPin: 27, stepsPerRev: 200, microsteps: 1, units: 'rev', maxSpeed: 1 },
] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const hw = new Hardware(store);
const warns = []; store.on('warn', w => warns.push(w));
hw.start(); clearInterval(hw.stepTimer); hw.stepQuietMs = 0;     // the ticks below are faster than real time
const sim = hw.devices.get('Sim').steppers, run = s => { for (let i = 0; i < s * 10; i++) sim.tick(0.1); };
const P = p => store.getProp('Valve_M', p);
assert.equal(P('position'), 40, 'simulated motor starts where sim.start says'); assert.equal(P('homed'), false);
store.setProp('Valve_M', 'home', true); run(5);
assert.equal(P('homed'), true, 'homed'); assert.equal(P('position'), 0); assert.equal(P('home'), false, 'home resets itself');
store.setProp('Valve_M', 'target', 60); run(0.3); assert.equal(P('moving'), true, 'moving');
run(3); assert.equal(P('moving'), false); assert.equal(P('position'), 60, 'went to 60 %');
store.setProp('Valve_M', 'move', -20); run(3); assert.equal(P('position'), 40, 'moved by -20'); assert.equal(P('move'), 0);
store.setProp('Valve_M', 'value', 150); assert.equal(P('target'), 100, 'value = target, kept under the highest allowed'); run(4); assert.equal(store.getProp('Valve_M', 'value'), 100, 'value reads the position');
store.setProp('Valve_M', 'run', -25); run(5); assert.equal(P('position'), 0, 'run stops at the lowest allowed'); assert.equal(P('run'), 0);
store.setProp('Valve_M', 'target', 80); run(0.4); store.setProp('Valve_M', 'stop', true); run(1);
assert.equal(P('moving'), false); assert.ok(P('position') > 0 && P('position') < 80, 'stopped part way: ' + P('position')); assert.equal(P('target'), P('position'), 'target = where it stopped');
store.setProp('Valve_M', 'reset', true); assert.equal(P('position'), 0, 'reset: here is home'); assert.equal(P('homed'), true);
store.setProp('Valve_M', 'target', 30); run(3); store.setProp('Valve_M', 'home', true); run(0.5);
store.setProp('Valve_M', 'target', 30); run(3); assert.equal(P('position'), 30, 'the same target again (after homing started) still moves');
store.setProp('Free_M', 'home', true); assert.match(warns.at(-1), /no home switch/, 'no switch, no homing');
store.setProp('Free_M', 'run', 1); run(2); assert.ok(store.getProp('Free_M', 'position') > 1, 'run with no limits keeps turning');
store.setProp('Free_M', 'run', 0); run(2); assert.equal(store.getProp('Free_M', 'moving'), false, 'run 0 stops');
store.setProp('Free_M', 'enabled', false); store.setProp('Free_M', 'move', 1); run(1); assert.equal(store.getProp('Free_M', 'moving'), false, 'turned off: no moves');
// A Process (script) drives it in real time
{
  const { Engine } = await import('../lib/engine.js');
  const sd = path.join(d, 'scripts'); fs.mkdirSync(sd);
  fs.writeFileSync(path.join(sd, 'Valve_Test.txt'), [
    '"Valve_M" speed = 100', '"Valve_M" target = 30', 'wait "Valve_M" moving == false', 'print "Valve_M" position',
    '"Valve_M" move = 10', 'sleep 100', 'stop "Valve_M"', 'wait "Valve_M" moving == false', 'reset "Valve_M"', 'print "Valve_M" position'].join('\n'));
  const eng = new Engine(store, sd, { logNow() { } }), printed = [];
  eng.on('print', p => printed.push(p.text));
  hw.stepTimer = setInterval(() => sim.tick(0.1), 100); hw.stepQuietMs = 500;
  eng.start('Valve_Test');
  await new Promise(r => { const t = setInterval(() => { if (!eng.running.size) { clearInterval(t); r(); } }, 50); });
  assert.equal(eng.status.get('Valve_Test').state, 'stopped', 'process ran: ' + eng.status.get('Valve_Test').error);
  assert.deepEqual(printed, ['30', '0'], 'went to 30, then stop and reset worked');
}
hw.stop();

// A real board: what the panel sends, and position reports coming back
{
  const store2 = new Store(path.join(d, 'c.json'), path.join(d, 'data2')); store2.load();
  for (const e of store2.config.elements) e.device = 'M';
  const hw2 = new Hardware(store2); hw2.stepQuietMs = 0; const sent = [], dev = { name: 'M', send: l => sent.push(l), status: 'connected' };
  hw2.devices.set('M', dev);
  hw2._resendOutputs(dev);
  assert.deepEqual(sent, ['CFG STEP 22 23 -1 4 100 400 1', 'CFG HOME 22 30 0', 'CFG STEP 26 27 -1 4 200 400 2']);
  sent.length = 0;
  store2.setProp('Valve_M', 'target', 25); assert.deepEqual(sent, ['GO 22 50 100']);
  assert.throws(() => store2.setProp('Valve_M', 'position', 3), /cannot be set by a script/, 'position comes from the board');
  hw2._onLine(dev, 'SP 22 20 1 1'); assert.equal(store2.getProp('Valve_M', 'position'), 10); assert.equal(store2.getProp('Valve_M', 'moving'), true);
  hw2._onLine(dev, 'SP 22 50 0 1'); assert.equal(store2.getProp('Valve_M', 'position'), 25); assert.equal(store2.getProp('Valve_M', 'target'), 25);
  sent.length = 0; store2.setProp('Valve_M', 'home', true); assert.deepEqual(sent, ['HOME 22 -25 400 0']);
  hw2._onLine(dev, 'SH 22 0'); assert.equal(store2.getProp('Valve_M', 'homed'), false);
  hw2.stepQuietMs = 500; store2.setProp('Valve_M', 'target', 40);
  hw2._onLine(dev, 'SP 22 50 0 0'); assert.equal(store2.getProp('Valve_M', 'moving'), true, 'a "stopped" report sent before the board got GO is not believed');
  assert.equal(store2.getProp('Valve_M', 'target'), 40);
}
console.log('steppers test: all passed');
