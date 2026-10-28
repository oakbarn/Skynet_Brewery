// Cloned Devices (Fritz, 2026-10-27): the same Device on more than one Tab. Clone names, and a parent rename on Save.
import assert from 'node:assert/strict';
import { cloneName, cloneNumber } from '../public/naming.js';

const used = new Set(['MB_06_Pump__HS_Clone_1']);
const taken = n => used.has(n);
assert.equal(cloneName('MB_06_Pump__HS', taken), 'MB_06_Pump__HS_Clone_2', 'the lowest free number');
assert.equal(cloneName('MB_06_Pump__CE', taken), 'MB_06_Pump__CE_Clone_1');
assert.equal(cloneName('MB_06_Pump_Mash__HS', taken, 3), 'MB_06_Pump_Mash__HS_Clone_3', 'a parent rename keeps the number');
assert.equal(cloneName('MB_06_Pump__HS', taken, 1), 'MB_06_Pump__HS_Clone_2', '... unless that name is taken');
assert.equal(cloneNumber('MB_06_Pump__HS_Clone_12'), 12);
assert.equal(cloneNumber('MB_06_Pump__HS'), undefined);
console.log('clones: all tests passed');
