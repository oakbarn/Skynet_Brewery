// Version names (Fritz, 2026-10-30): YYMMDD_HH_MM_n
import assert from 'node:assert/strict';
import { versionName, VERSION_RE } from '../public/vername.js';

const t = new Date(2026, 9, 30, 11, 58);
assert.equal(versionName('', t), '261030_11_58_1');
assert.equal(versionName('261030_11_58_1', t), '261030_11_58_2', 'the same minute counts up');
assert.equal(versionName('261030_11_58_2', new Date(2026, 9, 30, 12, 2)), '261030_12_02_1', 'a new minute starts at 1 again');
assert.ok(VERSION_RE.test('261030_12_02_1') && !VERSION_RE.test('Skynet-v.20261030_12_02'));
console.log('vername tests passed');
