// Styles (Fritz, 2026-10-29): Skynet Styles can never be changed by a user; User Styles are cleaned on the Brain.
import assert from 'node:assert/strict';
import { SKYNET_STYLES, styleOf, cleanUserStyles, isSkynetStyle } from '../public/styles.js';

assert.equal(styleOf('timer', {}).id, 'sky_timer_orange', 'a new Timer gets the first Skynet Style');
assert.equal(styleOf('timer', { look: 'led' }).look, 'led', 'an older LED Timer keeps its look');
assert.equal(styleOf('timer', { look: 'normal' }).look, 'normal');
const mine = { timer: [{ id: 'u_abc', name: 'Purple', look: 'timer', panel: '#5b1a8a' }] };
assert.equal(styleOf('timer', { style: 'u_abc' }, mine).name, 'Purple');
assert.ok(isSkynetStyle('sky_timer_green') && !isSkynetStyle('u_abc'));
const c = cleanUserStyles({ timer: [
  { id: 'u_1', name: 'Mine', look: 'timer', digits: '#fff', extra: 'x' },
  { id: 'sky_timer_orange', name: 'Hack', look: 'timer' },          // a Skynet id: refused
  { id: 'u_2', name: 'Skynet Orange Timer', look: 'timer' },       // a Skynet name: refused
  { id: 'u_3', name: 'mine', look: 'timer' },                      // the same name twice: refused
  { id: 'bad id', name: 'Other' },
], other: [{ id: 'u_4', name: 'X' }] });
assert.deepEqual(c.timer.map(s => s.name), ['Mine']);
assert.equal(c.timer[0].extra, undefined);
assert.equal(c.other, undefined, 'only known kinds');
assert.equal(SKYNET_STYLES.timer.length, 5);
console.log('styles tests passed');
