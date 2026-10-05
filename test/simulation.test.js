// Simulation mode: the faster clock, skipping ahead, the Time jumps table, the Process timeline,
// and that no real board is opened while it is on.  Run: node test/simulation.test.js
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';
import { Hardware } from '../lib/hardware.js';
import { clock } from '../lib/simclock.js';
import { Simulation, cleanSimulation } from '../lib/simulation.js';
import { timeline } from '../lib/timeline.js';

const wait = ms => new Promise(r => setTimeout(r, ms));
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpsim'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({
  devices: [{ name: 'MEGA1', type: 'ethernet', host: '127.0.0.1', port: 1 }],
  elements: [{ name: 'tm_Mash', type: 'timer', timerType: 'countup' }, { name: 'Pump', type: 'digitalOut', device: 'MEGA1', channel: 5 },
    { name: 'Mash_Temp', type: 'temperature', device: 'MEGA1' }, { name: 'msg', type: 'vKonstant', kind: 'string' }],
}));
const scripts = path.join(d, 'scripts'); fs.mkdirSync(scripts);
fs.writeFileSync(path.join(scripts, 'Mash.txt'), `"tm_Mash" value = 00:00:00
start "tm_Mash"
"Pump" state = true
wait "tm_Mash" value >= 00:10:00
"msg" value = "check pH"
sleep 600000
print "stir"
wait "Mash_Temp" value > 150
print "hot"
sleep 5000
print "done"
`);
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const engine = new Engine(store, scripts, { logNow() { } });
const hw = new Hardware(store);
const sim = new Simulation({ store, engine, hw });
const prints = []; engine.on('print', p => prints.push(p.text));
const tick = clock.stepper(); const timers = setInterval(() => store.tickTimers(tick() / 1000), 20);

// settings are cleaned
const c = cleanSimulation({ on: 1, speed: 99999, jumps: [{ when: 'timer', name: 'tm_Mash', after: -3, jump: '50:00' }, { name: '' }] });
assert.equal(c.speed, 1000); assert.equal(c.jumps.length, 1); assert.equal(c.jumps[0].jump, '00:50:00'); assert.equal(c.jumps[0].after, 0);

// the Process timeline: when each step happens, without running anything
const tl = timeline(engine, 'Mash');
const at = line => tl.rows.find(r => r.line === line);
assert.equal(at(5).at, 600, 'pH check 10 minutes in');
assert.equal(at(7).at, 1200, 'stir after the 10 minute sleep');
assert.equal(at(8).unknown, true, 'a wait on a temperature cannot be known ahead');
assert.equal(at(11).after, 8, 'steps after it are timed from the end of that wait');
assert.equal(at(11).at, 5);
assert.equal(store.getProp('Pump', 'state'), false, 'the timeline switched nothing');
assert.equal(store.getProp('msg', 'value'), '', 'the timeline changed nothing');

// simulation off: skipping is refused, real board type is kept
assert.throws(() => sim.skip(1000), /simulation mode/);

// simulation on: the board is replaced by the simulator
sim.save({ on: true, speed: 10, jumps: [{ when: 'timer', name: 'tm_Mash', after: 0.2, jump: '00:09:00' }] });
hw.start();
const dev = hw.list()[0];
assert.equal(dev.type, 'simulator'); assert.equal(dev.simMode, true); assert.equal(dev.realType, 'ethernet');
assert.ok(clock.active); assert.equal(clock.speed, 10);

// the clock runs 10x and a Process sleep follows it
let t0 = clock.now(); await wait(200);
const ran = clock.now() - t0;
assert.ok(ran > 1500 && ran < 3500, `10x speed: 200 ms real is about 2 s, got ${ran}`);

// Time jumps table: 0.2 s after tm_Mash starts, jump 9 minutes; then skip to next event
engine.start('Mash', 'test');
await wait(600);
assert.ok(store.getProp('tm_Mash', 'value').s >= 540, 'mash timer jumped ahead ' + store.getProp('tm_Mash', 'value'));
await wait(6500);    // the last 60 s at 10x
assert.equal(store.getProp('msg', 'value'), 'check pH', 'the wait on the timer passed');
const up = sim.upcoming();
assert.ok(up[0].what.includes('sleep ends'), 'next event is the 10 minute sleep: ' + JSON.stringify(up));
const r = sim.skipToNext();
assert.ok(r.skipped > 500000, 'skipped most of the 10 minute sleep');
await wait(1200);    // 5 s lead at 10x
assert.ok(prints.includes('stir'), 'the sleep ended: ' + prints.join(' | '));
store.setProp('Mash_Temp', 'value', 155, 'ui');
await wait(300);
assert.ok(prints.includes('hot'));
assert.ok(sim.upcoming()[0]?.what.includes('sleep'), 'the 5 s sleep is the next event');
assert.throws(() => sim.skipToNext(), /only/, 'too close to skip to');

// turning it off stops processes, turns outputs off and brings the real board back
sim.save({ on: false });
await wait(50);
assert.equal(engine.running.size, 0, 'processes stopped');
assert.equal(store.getProp('Pump', 'state'), false, 'outputs off');
assert.equal(clock.active, false); assert.equal(clock.speed, 1);
assert.notEqual(hw.list()[0].type, 'simulator', 'real board type again');
t0 = clock.now(); const real0 = Date.now(); await wait(100);
assert.ok(Math.abs((clock.now() - t0) - (Date.now() - real0)) < 30, 'clock back to real time');

clearInterval(timers); hw.stop(); for (const t of sim.pending) clearTimeout(t);
console.log('simulation tests passed');
process.exit(0);
