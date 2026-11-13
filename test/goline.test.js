// goLine (OakBarn Brewery, 2026-11-13, Rule 16.10): go to a line number, and the number follows its line when lines are added above it
import assert from 'node:assert/strict';
import { compile } from '../lib/engine.js';
import { followGoLines } from '../lib/goline.js';

// compiles: goLine N jumps to the first thing on line N or after it
const p = compile(['new value v = 0', '[Top]', 'v += 1', 'if v < 3', 'goLine 3', 'endif', 'print "done"'].join('\n'));
assert.deepEqual(p.errors, []);
const g = p.stmts.find(s => s.op === 'goline');
assert.equal(g.n, 3); assert.equal(p.stmts[g.to].line, 3);
assert.match(compile('goLine 99').errors[0].msg, /only 1 lines/);
assert.match(compile('goLine').errors[0].msg, /needs one line number/);
assert.match(compile('goLine "x"').errors[0].msg, /needs one line number/);

// lines added above the target: the number follows
const old = ['// demo', 'a = 1', '[My New Section]', 'b = 2', 'goLine 3', 'c = 3'].join('\n');
let r = followGoLines(old, ['// demo', 'x = 1', 'y = 2', 'a = 1', '[My New Section]', 'b = 2', 'goLine 3', 'c = 3'].join('\n'));
assert.equal(r.text.split('\n')[6], 'goLine 5'); assert.equal(r.changed, 1);
// lines added below the target (even above the goLine): nothing changes
r = followGoLines(old, ['// demo', 'a = 1', '[My New Section]', 'b = 2', 'z = 9', 'goLine 3', 'c = 3'].join('\n'));
assert.equal(r.text.split('\n')[5], 'goLine 3'); assert.equal(r.changed, 0);
// a line taken out above: the number goes down
r = followGoLines(old, ['a = 1', '[My New Section]', 'b = 2', 'goLine 3', 'c = 3'].join('\n'));
assert.equal(r.text.split('\n')[3], 'goLine 2');
// a goLine typed in this edit is kept as typed
r = followGoLines(old, ['// demo', 'x = 1', 'a = 1', '[My New Section]', 'b = 2', 'goLine 7', 'c = 3'].join('\n'));
assert.equal(r.text.split('\n')[5], 'goLine 7');
// its line taken out: the next line still there; a comment is left alone
r = followGoLines(['a', 'gone', 'b', 'goLine 2 // goLine 2'].join('\n'), ['x', 'a', 'b', 'goLine 2 // goLine 2'].join('\n'));
assert.equal(r.text.split('\n')[3], 'goLine 3 // goLine 2');
console.log('goline ok');
