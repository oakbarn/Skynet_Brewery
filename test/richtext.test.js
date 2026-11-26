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
// \t is an indent (OakBarn Brewery, 2026-11-12: "\t for indent!")
assert.equal(plainText('Mash in\\n\\tStir well'), 'Mash in\n\u2003\u2003Stir well');
assert.equal(plainText('C:\\\\temp'), 'C:\\temp', '\\\\ is still one backslash, so C:\\temp is not an indent');
assert.equal(compile('new string vT = "Hops\\tAdd"').stmts[1].expr.v, 'Hops\\tAdd', 'the Process keeps \\t for the screen');
// Rule 3.19 (OakBarn Brewery, 2026-11-15): the codes rebuilt from old PR #133, with \degF / \degC (no \F / \C) and \dFC
const { textColor, NAMED_COLORS, setTempUnitSource } = await import('../public/richtext.js');
const all = t => richRuns(t).map(r => [r.t, ...['b', 'i', 'u', 's', 'sm'].filter(k => r[k]), r.color].filter(Boolean).join(':'));
assert.deepEqual(all('\\iA\\i \\uB\\u \\sC\\s \\SD\\S'), ['A:i', ' ', 'B:u', ' ', 'C:s', ' ', 'D:sm']);
assert.deepEqual(all('\\c{Red}HOT\\c 212'), ['HOT:#e74c3c', ' 212']);
assert.deepEqual(all('\\c{steel Gray}x\\c{#f80}y'), ['x:#8a8f96', 'y:#f80']);
assert.equal(plainText('\\c{Nope}x'), '\\c{Nope}x', 'a name that is not a color stays as typed');
assert.equal(plainText('C:\\config'), 'C:\\config', 'a \\c with no color to end stays as typed');
assert.equal(plainText('C:\\Config and D:\\Fermenter'), 'C:\\Config and D:\\Fermenter', 'no \\C or \\F alone: a path stays as typed');
assert.equal(plainText('152\\degF 66\\degC 45\\deg 9.6\\ohm \\+-2'), '152°F 66°C 45° 9.6Ω ±2');
assert.equal(plainText('152\\dFC'), '152°F', '\\dFC is °F until told otherwise');
setTempUnitSource(() => 'C'); assert.equal(plainText('66\\dFC'), '66°C', 'Metric: °C');
setTempUnitSource(() => 'F'); assert.equal(plainText('152\\dFC'), '152°F', 'US: °F');
setTempUnitSource(() => { throw new Error('not ready'); }); assert.equal(plainText('\\dFC'), '°F');
setTempUnitSource(null);
assert.equal(textColor('White'), '#fafafa', 'White is RGB 250 250 250 (Rule 2.7)');
assert.equal(NAMED_COLORS.length, 13);
assert.equal(textColor('White (Opaque)'), '#fafafa');
assert.equal(textColor('White (Transparent)'), 'rgba(255,255,255,0)', 'White (Transparent) is 255 255 255 see-through (Rule 2.7)');
const app = (await import('node:fs')).readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
assert.match(app, /const COLORS = \[\['Default', ''\], \['None', 'transparent'\], \.\.\.NAMED_COLORS\];/, 'one list of color names');
assert.match(app, /setTempUnitSource\(\(\) => rcUnits\(\)\.tempUnit\);/, '\\dFC follows the Default Temperatures unit');
console.log('richtext tests passed');
