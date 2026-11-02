// Shortcut keys for typing text (Fritz, 2026-11-02): Shift+Enter \n, Ctrl/⌘+B \b, Ctrl/⌘+Shift+D °F/°C, Ctrl/⌘+Y redo.
import assert from 'node:assert/strict';
import { shortcutOf, editFor, degreeText, isTextBox } from '../public/shortkeys.js';

const k = (key, o = {}) => shortcutOf({ key, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, ...o });
assert.equal(k('Enter', { shiftKey: true }), 'newline');
assert.equal(k('Enter'), '', 'plain Enter is left alone');
assert.equal(k('Enter', { shiftKey: true, ctrlKey: true }), '');
assert.equal(k('b', { ctrlKey: true }), 'bold');
assert.equal(k('B', { metaKey: true }), 'bold', 'Mac ⌘+B');
assert.equal(k('b'), '');
assert.equal(k('D', { ctrlKey: true, shiftKey: true }), 'degree');
assert.equal(k('D', { metaKey: true, shiftKey: true }), 'degree', 'Mac ⌘+Shift+D');
assert.equal(k('d', { ctrlKey: true }), '', 'Ctrl+D without Shift is not ours');
assert.equal(k('y', { ctrlKey: true }), 'redo');
assert.equal(k('y', { metaKey: true }), 'redo');
assert.equal(k('V', { ctrlKey: true, shiftKey: true }), 'plainpaste');
for (const c of ['c', 'x', 'v', 'z']) assert.equal(k(c, { ctrlKey: true }), '', `Ctrl+${c} stays the browser's`);
assert.equal(k('Z', { ctrlKey: true, shiftKey: true }), '', 'Ctrl+Shift+Z stays the browser\'s redo');
assert.equal(k('b', { ctrlKey: true, altKey: true }), '');

assert.equal(degreeText('F'), '°F');
assert.equal(degreeText('C'), '°C');
assert.equal(degreeText(undefined), '°F', 'US default');

assert.deepEqual(editFor('Mash at 152', 11, 11, 'degree', 'F'), { insert: '°F', selA: 13, selB: 13 });
assert.deepEqual(editFor('Mash at 67', 10, 10, 'degree', 'C'), { insert: '°C', selA: 12, selB: 12 });
assert.deepEqual(editFor('Line 1', 6, 6, 'newline'), { insert: '\\n', selA: 8, selB: 8 });
assert.deepEqual(editFor('Hot water', 0, 3, 'bold'), { insert: '\\bHot\\b', selA: 2, selB: 5 }, 'picked text is wrapped and stays picked');
assert.deepEqual(editFor('abc', 3, 3, 'bold'), { insert: '\\b\\b', selA: 5, selB: 5 }, 'nothing picked: a pair with the cursor between');
assert.equal(editFor('abc', 0, 0, 'redo'), null);

const box = (tagName, type, o = {}) => ({ tagName, readOnly: false, disabled: false, getAttribute: () => type, ...o });
assert.ok(isTextBox(box('TEXTAREA', null)));
assert.ok(isTextBox(box('INPUT', null)), 'an input with no type is text');
assert.ok(isTextBox(box('INPUT', 'text')));
assert.ok(!isTextBox(box('INPUT', 'password')));
assert.ok(!isTextBox(box('INPUT', 'number')));
assert.ok(!isTextBox(box('INPUT', 'checkbox')));
assert.ok(!isTextBox(box('TEXTAREA', null, { readOnly: true })));
assert.ok(!isTextBox(box('SELECT', null)));
assert.ok(!isTextBox(null));
console.log('shortkeys ok');
