// BruControl import: node test/brucontrol.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { convertBruControl, applyBruControl, isoSeconds, argb, mediaPath } from '../lib/brucontrol.js';
import { calibrate, Control } from '../lib/control.js';
import { Store } from '../lib/store.js'; import { Engine } from '../lib/engine.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const xml = fs.readFileSync(path.join(here, '..', 'samples', 'sample_brucontrol.brucfg'), 'utf8');

assert.equal(isoSeconds('PT1M30S'), 90); assert.equal(isoSeconds('-PT0.5S'), -0.5); assert.equal(isoSeconds('P1DT1H'), 90000);
assert.equal(argb(-16777216), '#000000'); assert.equal(argb(-1), '#ffffff'); assert.equal(argb(''), undefined);
assert.equal(mediaPath('C:\\Brucontrol\\Media\\wave\\a b.wav'), 'oakbarn/wave/a b.wav');

const conv = convertBruControl(xml, { simulate: true });
const el = n => conv.elements.find(e => e.name === n);
assert.deepEqual(conv.summary.byType, { digitalOut: 2, analogIn: 2, hysteresis: 1, pid: 1, pwmOut: 1, dutyCycle: 1, temperature: 1, vKonstant: 3, switch: 2, timer: 1, alarm: 1, picture: 1 });
assert.equal(conv.devices[0].type, 'simulator'); assert.equal(conv.devices[0].realType, 'serial'); assert.equal(conv.devices[0].port, 'COM3');
assert.equal(conv.devices[1].realType, 'esp32'); assert.equal(conv.devices[1].host, '192.168.1.60'); assert.equal(conv.devices[1].enabled, false);
assert.deepEqual(conv.autostart, ['looper_Sample']);
assert.match(conv.scripts[0].text, /^\/\/ sample & "quoted"\nnew value vV\n/);
assert.ok(conv.warnings.some(w => w.includes('sw_Testing_2')));

const valve = el('VGC_22_Valve');
assert.deepEqual(valve.images, ['oakbarn/Valve_Ball_OpenV-1x1.png', 'oakbarn/Valve_Ball_ClosedV-1x1.png', '']);
assert.equal(valve.background, 1); assert.equal(valve.hideName, true); assert.equal(valve.border, 'hidden');
assert.equal(valve.onText, 'Open'); assert.equal(valve.offText, 'Closed'); assert.equal(valve.channel, 22);
const kettle = el('MB_57_Kettle');
assert.equal(kettle.look, 'led'); assert.equal(kettle.nameColor, '#ffffff'); assert.equal(kettle.nameBg, '#000000');
assert.deepEqual(kettle.nameFont, { size: 14.25, family: 'Microsoft Sans Serif', bold: true }); assert.equal(kettle.tap, 'none'); assert.equal(kettle.units, '°F');
assert.equal(valve.subtype, 'valve'); assert.equal(el('VGC_23_Pulse').subtype, 'valve'); assert.equal(el('MB_57_Kettle').subtype, undefined);
assert.equal(el('VGC_23_Pulse').activeLow, true); assert.equal(el('VGC_23_Pulse').oneShot, 500);
assert.equal(el('MB_05_Hys').input, 'MB_57_Kettle'); assert.equal(el('MB_05_Hys').look, 'indicator');
assert.equal(el('MB_07_PID').kp, 30); assert.equal(el('MB_07_PID').pwm, true);
assert.equal(el('gblS_Msg').initial, 'Hello & welcome'); assert.equal(el('gblS_Msg').visibility, 'hidden'); assert.equal(el('gblS_Msg').valueAlign, 'MiddleCenter');
assert.equal(el('gblT_Delay').type, 'vKonstant'); assert.equal(el('gblT_Delay').kind, 'time'); assert.equal(el('gblT_Delay').initial, '00:01:30');
assert.equal(el('tm_Boil').timerType, 'countdown'); assert.equal(el('tm_Boil').resetValue, '01:00:00');
assert.deepEqual(el('alm_Done').sounds, ['oakbarn/wave/Done.wav', 'oakbarn/Wave/Hops.wav', '']);
assert.equal(el('insp_Start').tap, 'script'); assert.equal(el('insp_Start').tapTarget, 'looper_Sample');
assert.equal(conv.workspaces[0].bgW, 1900); assert.equal(conv.workspaces[0].width, 1920);

// calibrations: 10k thermistor at mid scale is about 77 °F; multiplier, offset, then lookup table
assert.ok(Math.abs(calibrate(kettle, 511.5) - 76.9) < 1, calibrate(kettle, 511.5));
assert.equal(calibrate(el('MB_62_Volume'), 100), 8);     // 100*0.5-10 = 40 -> lookup 0..100 => 0..20 -> 8

// apply to a store + engine, then run the control loop
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bru'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [{ name: 'old', type: 'switch' }], graphics: [] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const engine = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const res = applyBruControl(conv, { store, engine, mode: 'replace' });
assert.deepEqual(res.problems, []);
assert.equal(store.has('old'), false); assert.equal(store.list().length, 18);        // 17 imported + the built-in SoundPlayer
assert.equal(String(store.getProp('tm_Boil', 'resetvalue')), '01:00:00');
assert.equal(store.getProp('MB_05_Hys', 'enabled'), false);
assert.equal(store.getProp('VGC_22_Valve', 'enabled'), true);

store.setProp('alm_Done', 'sound', 'None');
assert.equal(store.getProp('alm_Done', 'soundmode'), 'none');

const ctl = new Control(store);
const t0 = 1_000_000;
store.setProp('MB_57_Kettle', 'value', 140, 'hw');
store.setProp('MB_05_Hys', 'enabled', true);
ctl.tick(t0); assert.equal(store.getProp('MB_05_Hys', 'state'), true);          // 140 <= 150 - 2
store.setProp('MB_57_Kettle', 'value', 149, 'hw');
ctl.tick(t0 + 100); assert.equal(store.getProp('MB_05_Hys', 'state'), true);    // still heating up to target
store.setProp('MB_57_Kettle', 'value', 150, 'hw');
ctl.tick(t0 + 200); assert.equal(store.getProp('MB_05_Hys', 'state'), false);   // reached target
store.setProp('MB_57_Kettle', 'value', 149, 'hw');
ctl.tick(t0 + 300); assert.equal(store.getProp('MB_05_Hys', 'state'), false);   // within the band: stays off

store.setProp('MB_08_Duty', 'enabled', true);
ctl.tick(2_000_100); assert.equal(store.getProp('MB_08_Duty', 'state'), true);  // 100 ms into 1 s cycle, 80 %
ctl.tick(2_000_900); assert.equal(store.getProp('MB_08_Duty', 'state'), false);

store.setProp('MB_07_PID', 'enabled', true);
store.setProp('MB_57_Kettle', 'value', 140, 'hw');
ctl.tick(3_000_000); assert.equal(store.getProp('MB_07_PID', 'value'), 100);    // far below target: full output
store.setProp('MB_07_PID', 'enabled', false);
ctl.tick(3_000_100); assert.equal(store.getProp('MB_07_PID', 'value'), 0);

// one-shot: an ON pulse turns itself off
store.setProp('VGC_23_Pulse', 'state', true, 'ui');
await new Promise(r => setTimeout(r, 650));
assert.equal(store.getProp('VGC_23_Pulse', 'state'), false);
ctl.stop();

// the imported script runs: picks sound 2, background image 2, hiddenlocked, timer reset value
const started = engine.start('looper_Sample');
assert.equal(started.ok, true, JSON.stringify(started));
await new Promise(r => setTimeout(r, 300));
assert.equal(store.getProp('gblV_Kettle', 'value'), 140);
assert.equal(store.getProp('alm_Done', 'fileindex'), 2); assert.equal(store.getProp('alm_Done', 'soundmode'), 'custom');
assert.equal(store.getProp('VGC_22_Valve', 'background'), '2');
assert.equal(store.getProp('gblS_Msg', 'visibility'), 'hidden');
assert.equal(store.getProp('MB_07_PID', 'target'), 155);
assert.equal(String(store.getProp('tm_Boil', 'value')), '01:00:00');
console.log('brucontrol tests passed');
process.exit(0);
