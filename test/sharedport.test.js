// Fritz, 2026-10-23: two heaters of different Device Types on one port (MB_05_Hys_... and MB_05_PID_...):
// the one enabled or turned on last wins
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Hardware } from '../lib/hardware.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'sharedport'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator' }], elements: [
  { name: 'Temp', type: 'temperature', sensor: 'simulated' },
  { name: 'MB_05_Hys_HLT', type: 'hysteresis', typeCode: 'Hys', device: 'MB', channel: 5, input: 'Temp' },
  { name: 'MB_05_PID_HLT', type: 'pid', typeCode: 'PID', device: 'MB', channel: 5, input: 'Temp' },
  { name: 'MB_06_Pump', type: 'digitalOut', typeCode: 'Pump', device: 'MB', channel: 6 },
  { name: 'MB_06_PWM', type: 'pwmOut', typeCode: 'P_Pump', device: 'MB', channel: 6 },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();

store.setProp('MB_05_Hys_HLT', 'enabled', true);
store.setProp('MB_05_PID_HLT', 'enabled', true);
assert.equal(store.getProp('MB_05_PID_HLT', 'enabled'), true);
assert.equal(store.getProp('MB_05_Hys_HLT', 'enabled'), false, 'enabling the PID turns the Hysteresis off');
store.setProp('MB_05_Hys_HLT', 'enabled', true);
assert.equal(store.getProp('MB_05_PID_HLT', 'enabled'), false, 'and back again');

store.setProp('MB_06_Pump', 'state', true);
store.setProp('MB_06_PWM', 'enabled', true);
store.setProp('MB_06_PWM', 'value', 40);
assert.equal(store.getProp('MB_06_Pump', 'state'), false, 'the PWM output took the port');

// the pin is not turned off by the one that lost
const hw = new Hardware(store), sent = [];
hw.devices.set('MB', { name: 'MB', send: l => sent.push(l) });
store.setProp('MB_06_Pump', 'state', true);
assert.equal(store.getProp('MB_06_PWM', 'value'), 0);
store.setProp('MB_05_PID_HLT', 'state', true, 'control');
store.setProp('MB_05_Hys_HLT', 'state', true, 'control');
sent.length = 0;
store.setProp('MB_05_PID_HLT', 'state', false, 'control');
assert.deepEqual(sent, ['DO 5 1'], 'the PID going off resends the Hysteresis, which is still on');
clearTimeout(store._persistTimer);
console.log('shared port tests passed');
process.exit(0);
