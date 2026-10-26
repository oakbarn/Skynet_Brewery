// Connection ratings by board (public/links.js): node test/links.test.js
import assert from 'node:assert/strict';
import { boardOf, linkOf, isHeating, rating, heatingLinkError } from '../public/links.js';

assert.equal(boardOf({ name: 'Main Brewery Mega USB' }), 'mega', 'an older Interface with no board: a Mega');
assert.equal(boardOf({ name: 'Garage ESP32' }), 'esp32', 'an "ESP" name is an ESP32');
assert.equal(boardOf({ name: 'x', board: 'other' }), 'other');
assert.equal(linkOf({ type: 'simulator', realType: 'ethernet' }), 'ethernet', 'a simulated board keeps its real link');

assert.equal(rating({ board: 'mega', type: 'serial' }).level, 'best');
assert.equal(rating({ board: 'mega', type: 'ethernet' }).level, 'ok');
assert.equal(rating({ board: 'mega', type: 'esp32' }).level, 'poor');
assert.equal(rating({ board: 'esp32', type: 'ethernet' }).level, 'good');
assert.equal(rating({ board: 'esp32', type: 'esp32' }).level, 'good');
assert.equal(rating({ board: 'esp32', type: 'esp32' }, true).level, 'poor', 'heating on WiFi is poor');
assert.equal(rating({ board: 'esp32', type: 'ethernet' }, true).level, 'good', 'heating on Ethernet keeps its rating');
assert.equal(rating({ type: 'simulator' }).level, '');

assert.ok(isHeating({ type: 'pid' }) && isHeating({ type: 'pwmOut', typeCode: 'H_PWM' }) && isHeating({ type: 'digitalOut', subtype: 'element' }) && isHeating({ type: 'digitalOut', typeCode: 'G_Vlv' }));
assert.ok(!isHeating({ type: 'digitalOut', typeCode: 'Pump' }));

const devs = [{ name: 'MEGA', type: 'serial' }, { name: 'WIFI', type: 'esp32', board: 'esp32' }, { name: 'ETH', type: 'ethernet' }];
assert.match(heatingLinkError({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_PWM', device: 'WIFI' }, devs), /not allowed on a WiFi link/);
assert.equal(heatingLinkError({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_PWM', device: 'ETH' }, devs), '');
assert.equal(heatingLinkError({ name: 'Pump1', type: 'digitalOut', typeCode: 'Pump', device: 'WIFI' }, devs), '');
console.log('links tests passed');
