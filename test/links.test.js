// Connection ratings by board (public/links.js): node test/links.test.js
import assert from 'node:assert/strict';
import { boardOf, linkOf, isHeating, rating, heatingLinkWarning, lostLinkSec } from '../public/links.js';

assert.equal(boardOf({ name: 'Main Brewery Mega USB' }), 'mega', 'an older Interface with no board: a Mega');
assert.equal(boardOf({ name: 'Garage ESP32' }), 'esp32', 'an "ESP" name is an ESP32');
assert.equal(boardOf({ name: 'x', board: 'other' }), 'other');
assert.equal(linkOf({ connection: 'simulator', realConnection: 'esp32' }), 'esp32', 'a simulated board keeps its real Connection');
assert.equal(linkOf({ connection: 'serial' }), 'serial');

assert.equal(rating({ board: 'mega', connection: 'serial' }).level, 'best');
assert.equal(rating({ board: 'mega', connection: 'ethernet' }).level, 'ok');
assert.equal(rating({ board: 'mega', connection: 'esp32' }).level, 'poor');
assert.equal(rating({ board: 'esp32', connection: 'ethernet' }).level, 'good');
assert.equal(rating({ board: 'esp32', connection: 'esp32' }).level, 'good');
assert.equal(rating({ board: 'esp32', connection: 'esp32' }, true).level, 'poor', 'heating on WiFi is poor');
assert.equal(rating({ board: 'esp32', connection: 'ethernet' }, true).level, 'good', 'heating on Ethernet keeps its rating');
assert.equal(rating({ connection: 'simulator' }).level, '');

assert.ok(isHeating({ type: 'pid' }) && isHeating({ type: 'pwmOut', typeCode: 'H_PWM' }) && isHeating({ type: 'digitalOut', subtype: 'element' }) && isHeating({ type: 'digitalOut', typeCode: 'G_Vlv' }));
assert.ok(!isHeating({ type: 'digitalOut', typeCode: 'Pump' }));

const devs = [{ name: 'MEGA', connection: 'serial' }, { name: 'WIFI', connection: 'esp32', board: 'esp32' }, { name: 'ETH', connection: 'ethernet' }];
assert.match(heatingLinkWarning({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_PWM', device: 'WIFI' }, devs), /on WiFi.*after 10 s/, 'heating on WiFi: allowed, with a warning');
assert.match(heatingLinkWarning({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_PWM', device: 'ETH' }, [{ name: 'ETH', connection: 'ethernet', lostLinkSec: 5 }]), /on Ethernet.*after 5 s/);
assert.equal(heatingLinkWarning({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_PWM', device: 'MEGA' }, devs), '', 'no warning on USB');
assert.equal(heatingLinkWarning({ name: 'Pump1', type: 'digitalOut', typeCode: 'Pump', device: 'WIFI' }, devs), '');
assert.equal(lostLinkSec(undefined), 10); assert.equal(lostLinkSec({ lostLinkSec: 1 }), 3); assert.equal(lostLinkSec({ lostLinkSec: 9999 }), 600); assert.equal(lostLinkSec({ lostLinkSec: 30 }), 30);
console.log('links tests passed');
