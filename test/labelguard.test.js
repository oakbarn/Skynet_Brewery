// Rule 18.28 (Fritz, 2026-11-05): the Label can't be blank. Pure parts here (the clicks were checked in a browser)
import assert from 'node:assert/strict';
import { isBlank, isCancelButton, guardingField, allowedWhileBlank, LABEL_WARN, LABEL_WARN_MS } from '../public/labelguard.js';

assert.equal(LABEL_WARN, 'The Label cannot be blank.');
assert.equal(LABEL_WARN_MS, 5000, 'the pop-up goes away by itself after 5 seconds');
for (const v of ['', '   ', null, undefined, '\t']) assert.ok(isBlank(v), `"${v}" is blank`);
for (const v of ['mBV_1', ' a ', '0']) assert.ok(!isBlank(v), `"${v}" is not blank`);
assert.ok(isCancelButton({ dataset: { close: 'cancel' }, textContent: 'Cancel' }), 'Properties Cancel');
assert.ok(isCancelButton({ dataset: {}, value: 'cancel', textContent: 'Cancel' }));
assert.ok(isCancelButton({ dataset: {}, textContent: '✖ Cancel' }), 'Rule 18 pop-up Cancel');
assert.ok(!isCancelButton({ dataset: { close: 'ok' }, textContent: '💾 Save' }));
assert.ok(!isCancelButton({ dataset: {}, textContent: '➕ Add Device' }));
assert.ok(!isCancelButton(null));
// Rule 18.33 (OakBarn Brewery, 2026-11-09): a box the program needs (data-guard-now) guards at once, before the user has been on it;
// a Tilt's Color (no guard-now) only once the user has been on it
const box = (ds, value = '') => ({ dataset: ds, value, disabled: false, readOnly: false, offsetParent: {} });
const dlg = fields => ({ querySelectorAll: q => q.includes('label') ? [] : fields });
const at = d => ({ closest: q => q === 'dialog[open]' ? d : null });
const pulses = box({ guard: 'Pulses per unit', guardNow: '1', guardAllow: 'label device channel' });
assert.equal(guardingField(at(dlg([pulses]))), pulses, 'a blank needed box guards at once');
pulses.value = '1703';
assert.equal(guardingField(at(dlg([pulses]))), null, 'filled in, it does not');
const color = box({ guard: 'Tilt Color' });
assert.equal(guardingField(at(dlg([color]))), null, 'a Tilt Color waits until the user has been on it');
color.dataset.visited = '1';
assert.equal(guardingField(at(dlg([color]))), color);
const portClick = { closest: q => q === '[data-k]' ? { dataset: { k: 'channel' } } : null };
assert.ok(allowedWhileBlank(portClick, { ...pulses, contains: () => false, closest: () => null }), 'the Port may still be used');
console.log('labelguard ok');
