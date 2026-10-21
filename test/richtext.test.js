// Codes inside text: \n \b \L \_ \^ \deg (public/richtext.js)
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
assert.equal(plainText('\\b\\L'), '');
assert.equal(plainText('no codes'), 'no codes');

// in a Process, "\n" is already a new line and the other codes reach the screen as they are typed
const st = compile('new string vS = "Mash\\n\\b152\\degF\\b"').stmts[1];
assert.equal(st.expr.v, 'Mash\n\\b152\\degF\\b');
assert.equal(plainText(st.expr.v), 'Mash\n152°F');
console.log('richtext tests passed');
