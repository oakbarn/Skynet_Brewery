// Rule 18.28 (Fritz, 2026-11-05): the Label can't be blank. Pure parts here (the clicks were checked in a browser)
import assert from 'node:assert/strict';
import { isBlank, isCancelButton, isDeleteButton, guardingField, allowedWhileBlank, LABEL_WARN, LABEL_WARN_MS } from '../public/labelguard.js';

assert.equal(LABEL_WARN, 'The Label cannot be blank.');
assert.equal(LABEL_WARN_MS, 2000, 'the pop-up goes away by itself after 2 seconds (Rule 2.74; was 5)');
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
// Delete just deletes (OakBarn Brewery, 2026-11-14: "Have Delete Delete without those types of issues"): a blank Label, Port or needed box
// never stops a Delete button, top or bottom, in any dialog (its own "are you sure" still comes up)
assert.ok(isDeleteButton({ dataset: { close: 'delete' }, textContent: 'Delete' }), 'Properties Delete, top and bottom');
assert.ok(isDeleteButton({ dataset: {}, value: 'delete', textContent: 'Delete' }), 'the Importer dialog Delete');
for (const t of ['🗑 Delete', '🗑 Delete Hose', '🗑 Delete Pipe', 'Delete']) assert.ok(isDeleteButton({ dataset: {}, textContent: t }), t);
for (const t of ['💾 Save', 'Cancel', 'Deleted Processes', 'Undelete']) assert.ok(!isDeleteButton({ dataset: {}, textContent: t }), t);
assert.ok(!isDeleteButton(null));
const blankLabel = { dataset: { k: 'label' }, value: '', contains: () => false, closest: () => null };
const delBtn = { dataset: { close: 'delete' }, textContent: 'Delete' };
assert.ok(allowedWhileBlank({ closest: q => q === 'button' ? delBtn : null }, blankLabel), 'Delete works with a blank Label');
assert.ok(allowedWhileBlank({ closest: q => q === 'button' ? { dataset: {}, textContent: '🗑 Delete Hose' } : null }, pulses), 'Delete works with a blank needed box');
assert.ok(!allowedWhileBlank({ closest: q => q === 'button' ? { dataset: {}, value: 'ok', textContent: 'Save' } : null }, blankLabel), 'Save still waits for the Label');
console.log('labelguard ok');
// Rule 18.28 (OakBarn Brewery, 2026-11-15, Blichmann RipTide Dialog 1): a blank Label or Port lets the Tab key and the mouse reach
// every other field and icon; only Save / ➕ Add and a greyed out box wait. A needed box (Rule 18.33) still holds the focus.
const { isSaveButton, isOpenGuard } = await import('../public/labelguard.js');
const ctl = (tag, extra = {}) => ({ closest: q => (q === 'button' ? (tag === 'button' ? extra : null) : q.includes(tag) && tag !== 'button' ? { matches: () => false, ...extra } : null) });
assert.ok(allowedWhileBlank(ctl('select', { disabled: false, readOnly: false }), blankLabel), 'the Interface or Tab with a blank Label');
assert.ok(allowedWhileBlank(ctl('button', { dataset: {}, textContent: '⬆' }), blankLabel), 'the ⬆ with a blank Label');
assert.ok(!allowedWhileBlank(ctl('select', { disabled: true, readOnly: false }), blankLabel), 'a greyed out box gets no focus');
assert.ok(!allowedWhileBlank(ctl('button', { dataset: {}, textContent: '➕ Add Device' }), blankLabel), 'Add Device waits for the Label');
assert.ok(isSaveButton({ dataset: {}, textContent: '💾 Save' }) && !isSaveButton({ dataset: {}, textContent: '⬢' }));
assert.ok(isOpenGuard({ dataset: { guard: 'Port' } }) && !isOpenGuard(pulses), 'a needed box still holds the focus');
console.log('labelguard Rule 18.28 open fields ok');
// a field's name (a double-click on the Tab's name opens its settings) with a blank Label (OakBarn Brewery, 2026-11-15)
const fieldName = { closest: q => q === 'dialog' ? {} : null };
assert.ok(allowedWhileBlank(fieldName, blankLabel), 'the Tab\'s name may be double-clicked with a blank Label');
console.log('labelguard field names ok');
