// Log page > Download CSV: layouts, local times, file names and CSV sets
import assert from 'node:assert/strict';
import { buildCsv, csvFileName, cleanLogSets, localTime } from '../lib/logcsv.js';

const t = Date.UTC(2026, 9, 21, 14, 5, 3);
const rows = [
  { ts: t, name: 'HLT_Temp', value: '152.5', num: 152.5, reason: 'interval' },
  { ts: t + 20, name: 'MLT_Temp', value: '150', num: 150, reason: 'interval' },
  { ts: t + 60_000, name: 'HLT_Temp', value: '153', num: 153, reason: 'interval' },
  { ts: t + 60_000, name: 'Note', value: 'dough in, "thick"', num: null, reason: 'sim ondemand' },
];
assert.equal(localTime(t, 0), '2026-10-21 14:05:03');
assert.equal(localTime(t, 300), '2026-10-21 09:05:03', 'tz is minutes behind UTC, like getTimezoneOffset');

const wide = buildCsv(rows, { names: ['HLT_Temp', 'MLT_Temp'], layout: 'wide' });
assert.ok(wide.startsWith('﻿'), 'UTF-8 mark for Excel');
assert.deepEqual(wide.slice(1).trim().split('\r\n'), [
  'Time,Minutes,HLT_Temp,MLT_Temp',
  '2026-10-21 14:05:03,0.00,152.5,150',
  '2026-10-21 14:06:03,1.00,153,',
], 'same second shares a row, unticked names left out');

const list = buildCsv(rows, { layout: 'list' }).slice(1).trim().split('\r\n');
assert.equal(list[0], 'Time,Name,Value,Trigger');
assert.equal(list[4], '2026-10-21 14:06:03,Note,"dough in, ""thick""",sim ondemand');
assert.equal(buildCsv([], { names: ['A'] }), '﻿Time,Minutes,A\r\n');

assert.equal(csvFileName('Mash Profile', rows, 0), 'Skynet_Log_Mash_Profile_20261021T1405.csv');
assert.equal(csvFileName('', [], 0, t), 'Skynet_Log_All_20261021T1405.csv');
assert.equal(csvFileName('../x?', rows, 0), 'Skynet_Log_x_20261021T1405.csv');

assert.deepEqual(cleanLogSets([{ name: ' Mash Profile ', names: ['MLT_Temp', 'MLT_Temp', ' HLT_Temp'] }]), [{ name: 'Mash Profile', names: ['MLT_Temp', 'HLT_Temp'] }]);
assert.throws(() => cleanLogSets([{ name: 'A', names: ['x'] }, { name: 'a', names: ['y'] }]), /Two CSV sets/);
assert.throws(() => cleanLogSets([{ name: 'A', names: [] }]), /at least one value/);
console.log('logcsv tests passed');
