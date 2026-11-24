// A board added with no USB Port or Network address yet (OakBarn Brewery, 2026-11-24, Rule 18.39): nothing is opened, it shows as
// not connected, and the Add Interface pop-up offers None for now
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { noAddress } from '../lib/hardware.js';

assert.equal(noAddress({ name: 'A', connection: 'serial', port: '' }), true);
assert.equal(noAddress({ name: 'A', connection: 'serial' }), true);
assert.equal(noAddress({ name: 'A', connection: 'serial', port: 'COM3' }), false);
assert.equal(noAddress({ name: 'A', connection: 'ethernet', host: ' ' }), true);
assert.equal(noAddress({ name: 'A', connection: 'esp32', host: '192.168.1.60' }), false);
assert.equal(noAddress({ name: 'A', connection: 'simulator' }), false);

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
assert.ok(!app.includes("throw new Error('Type the USB Port number"), 'a blank USB Port no longer stops Add');
assert.ok(app.includes('usbPortChoices(ports, o.port, win, { none: true })'), 'the Add Interface USB Port list has None for now');
console.log('noport ok');
