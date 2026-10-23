// Dates in file and folder names follow ISO 8601 (Fritz, 2026-10-23)
import assert from 'node:assert/strict';
import { fileDay, fileMinute, fileStamp, fileMinuteUTC, STAMP_TAIL } from '../lib/filedate.js';

const d = new Date(2026, 9, 3, 7, 5, 9);
assert.equal(fileDay(d), '2026-10-03');
assert.equal(fileMinute(d), '20261003T0705');
assert.equal(fileStamp(d), '20261003T070509');
assert.equal(fileMinuteUTC(new Date(Date.UTC(2026, 9, 3, 7, 5))), '20261003T0705');
for (const s of [fileStamp(d), fileMinute(d), '2026-10-21-14-05-03', '20261003T070509-2']) assert.match('x.' + s, STAMP_TAIL);
assert.ok(!/[:\\/*?"<>|]/.test(fileStamp(d)), 'nothing Windows forbids in a file name');
console.log('filedate tests passed');
