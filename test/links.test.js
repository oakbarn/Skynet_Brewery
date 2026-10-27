// Connection ratings by board (public/links.js): node test/links.test.js
import assert from 'node:assert/strict';
import { boardOf, linkOf, isHeating, rating, heatingLinkWarning, lostLinkSec } from '../public/links.js';

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
assert.match(heatingLinkWarning({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_PWM', device: 'WIFI' }, devs), /on WiFi.*after 10 s/, 'heating on WiFi: allowed, with a warning');
assert.match(heatingLinkWarning({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_PWM', device: 'ETH' }, [{ name: 'ETH', type: 'ethernet', lostLinkSec: 5 }]), /on Ethernet.*after 5 s/);
assert.equal(heatingLinkWarning({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_PWM', device: 'MEGA' }, devs), '', 'no warning on USB');
assert.equal(heatingLinkWarning({ name: 'Pump1', type: 'digitalOut', typeCode: 'Pump', device: 'WIFI' }, devs), '');
assert.equal(lostLinkSec(undefined), 10); assert.equal(lostLinkSec({ lostLinkSec: 1 }), 3); assert.equal(lostLinkSec({ lostLinkSec: 9999 }), 600); assert.equal(lostLinkSec({ lostLinkSec: 30 }), 30);
console.log('links tests passed');
