// Rule 2.38 (Fritz, 2026-11-06): explanations live in hover help. Pure parts here (the hover was checked in a browser)
import assert from 'node:assert/strict';
import { helpOf, placeBubble, HOVER_DELAY_MS, GAP } from '../public/hoverhelp.js';

assert.ok(HOVER_DELAY_MS > 0 && HOVER_DELAY_MS <= 400, 'shows almost at once');
// data-help first; a tip label's old title moves to data-help so the browser's own tooltip does not show too
const attrs = { title: 'The board this Device is wired to.' };
const old = { dataset: {}, classList: { contains: c => c === 'tipLbl' }, getAttribute: k => attrs[k], removeAttribute: k => delete attrs[k] };
assert.equal(helpOf(old), 'The board this Device is wired to.');
assert.equal(old.dataset.help, 'The board this Device is wired to.'); assert.equal(attrs.title, undefined);
assert.equal(helpOf({ dataset: { help: 'Its size on the Tab.' } }), 'Its size on the Tab.');
assert.equal(helpOf({ dataset: {}, classList: { contains: () => false }, getAttribute: () => 'a button title' }), '', 'a plain title is left alone');
assert.equal(helpOf(null), '');
// under the name; above it when there is no room below; never off the screen
const view = { w: 800, h: 600 }, box = { w: 300, h: 80 };
assert.deepEqual(placeBubble({ left: 100, top: 100, bottom: 120 }, box, view), { left: 100, top: 120 + GAP });
assert.deepEqual(placeBubble({ left: 100, top: 560, bottom: 580 }, box, view), { left: 100, top: 560 - GAP - 80 });
assert.equal(placeBubble({ left: 700, top: 100, bottom: 120 }, box, view).left, 800 - 300 - 4);
console.log('hoverhelp ok');
