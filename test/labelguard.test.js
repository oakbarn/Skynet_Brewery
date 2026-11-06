// Rule 18.28 (Fritz, 2026-11-05): the Label can't be blank. Pure parts here (the clicks were checked in a browser)
import assert from 'node:assert/strict';
import { isBlank, isCancelButton, LABEL_WARN, LABEL_WARN_MS } from '../public/labelguard.js';

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
console.log('labelguard ok');
