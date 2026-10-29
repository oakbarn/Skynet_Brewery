// Codes inside text: \n \b \L \_ \^ \deg \F \C \ohm (public/richtext.js)
import assert from 'node:assert/strict';
import { richRuns, plainText } from '../public/richtext.js';
import { compile } from '../lib/engine.js';

const look = t => richRuns(t).map(r => [r.t, ...['b', 'L', 'sub', 'sup'].filter(k => r[k])].join(':'));
assert.deepEqual(look('Mash \\bnow\\b please'), ['Mash ', 'now:b', ' please']);
assert.deepEqual(look('\\L\\bBIG\\b\\L small'), ['BIG:b:L', ' small']);
assert.deepEqual(look('H\\_2\\_O and m\\^3\\^'), ['H', '2:sub', 'O and m', '3:sup']);
assert.deepEqual(look('a\\_1\\^2'), ['a', '1:sub', '2:sup']);           // up turns down off
assert.equal(plainText('Strike 165\\degF\\nMash 152\\DEGF'), 'Strike 165°F\nMash 152°F');
assert.equal(plainText('C:\\\\Brewing and \\x stays'), 'C:\\Brewing and \\x stays');
assert.equal(plainText('Strike 165\\F, Mash 66\\C, element 9.6\\ohm or 10 \\OHM'), 'Strike 165°F, Mash 66°C, element 9.6Ω or 10 Ω');
assert.equal(plainText('\\f stays'), '\\f stays');                     // only capital F and C
assert.equal(plainText('\\b\\L'), '');
assert.equal(plainText('no codes'), 'no codes');

// in a Process, "\n" is already a new line and the other codes reach the screen as they are typed
const st = compile('new string vS = "Mash\\n\\b152\\degF\\b"').stmts[1];
assert.equal(st.expr.v, 'Mash\n\\b152\\degF\\b');
assert.equal(plainText(st.expr.v), 'Mash\n152°F');

// italic, underline, strikethrough, small, color, indent, plus-minus (Fritz, 2026-10-29)
const all = t => richRuns(t).map(r => [r.t, ...['i', 'u', 's', 'sm'].filter(k => r[k]), r.color].filter(Boolean).join(':'));
assert.deepEqual(all('\\iA\\i \\uB\\u \\sC\\s \\SD\\S'), ['A:i', ' ', 'B:u', ' ', 'C:s', ' ', 'D:sm']);
assert.deepEqual(all('\\c{Red}HOT\\c ok \\c{steel grey}x\\c{#ff8800}y'), ['HOT:#e74c3c', ' ok ', 'x:#8a8f96', 'y:#ff8800']);
assert.equal(plainText('\\c{Pink}x'), '\\c{Pink}x');                   // not a color name: stays as typed
assert.equal(plainText('\\tStep 1 152\\F \\+-2'), '    Step 1 152°F ±2');
console.log('richtext tests passed');
