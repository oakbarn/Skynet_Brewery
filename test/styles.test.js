// Styles (Fritz, 2026-10-29): Skynet Styles can never be changed by a user; User Styles are cleaned on the Brain.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SKYNET_STYLES, styleOf, cleanUserStyles, isSkynetStyle, tabStyleOf } from '../public/styles.js';

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
// Tab Styles (Fritz, 2026-10-30): Tennyson, a Tab's own pick, else the Default tab's, else Skynet Default
const ten = SKYNET_STYLES.tab.find(s => s.name === 'Tennyson');
assert.equal(ten.labelBack, '#c3c3c3', 'Tennyson label back is RGB 195 195 195');
assert.equal(ten.labelFore, '#000000');
assert.match(ten.labelFont, /Comic Sans MS/);
assert.equal(ten.labelSize, '16');
assert.equal(ten.fore + ten.back + ten.font + ten.size, '', 'the Device or Widget itself stays as it is now');
assert.equal(tabStyleOf({}).id, 'sky_tab_default');
assert.equal(tabStyleOf({}, { tabStyle: 'sky_tab_tennyson' }).name, 'Tennyson');
assert.equal(tabStyleOf({ style: 'sky_tab_default' }, { tabStyle: 'sky_tab_tennyson' }).id, 'sky_tab_default', 'a Tab\'s own Style wins');
const t = cleanUserStyles({ tab: [{ id: 'u_t1', name: 'Mine', labelBack: '#eee', labelAlign: 'Center', align: 'Right', look: 'led' }, { id: 'u_t2', name: 'tennyson' }] });
assert.deepEqual(t.tab.map(s => s.name), ['Mine'], 'a User Style can not take a Skynet name');
assert.equal(t.tab[0].look, undefined, 'a Tab Style has no look');
assert.equal(t.tab[0].labelBack, '#eee');
assert.equal(t.tab[0].labelAlign + t.tab[0].align, 'CenterRight', 'Alignment for the Label and the item');
for (const id of ['two-vessel-one-pump', 'three-vessel-one-pump', 'brewzilla-brew-day']) {
  const c = JSON.parse(fs.readFileSync(new URL(`../samples/configs/${id}/config.json`, import.meta.url)));
  assert.equal(c.workspaces.find(w => w.name === 'Recipe').style, 'sky_tab_tennyson', `${id}: the Recipe Tab is Tennyson`);
}
console.log('styles tests passed');
