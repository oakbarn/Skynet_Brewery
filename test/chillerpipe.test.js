// Rule 5.41 (OakBarn Brewery, 2026-11-15): a Chiller is the same as a pipe, no more, no less. IPs at its inlets and outlets,
// no On / Off, flow passes through each path from a source upstream; no Size, Units, Dead space or built-in Thermowell.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const block = k => { const i = app.indexOf(`  ${k}: { title:`); assert.ok(i > 0, k + ' is in EQ'); return app.slice(i, app.indexOf('} },', i)); };
const pch = block('pchiller'), coil = block('ccoil');
// IPs at the inlets and outlets, nothing else
for (const p of ['wortIn', 'wortOut', 'waterIn', 'waterOut']) assert.match(pch, new RegExp(p + ": pt\\("), 'Plate chiller has ' + p);
assert.doesNotMatch(pch, /thermowell/i, 'no built-in Thermowell on a Plate chiller');
assert.doesNotMatch(pch + coil, /ip: false/, 'every Chiller port is an IP');
// two paths that never mix on a plate chiller, one (or two) on a coil
assert.match(pch, /circuit: 'wort'/); assert.match(pch, /circuit: 'water'/);
// no Size, Units or Dead space in a Chiller Template
assert.match(app, /const isChillerKind = k => k === 'pchiller' \|\| k === 'ccoil';/);
const NO = app.match(/const CHILLER_NO_SIZE = \[([^\]]*)\]/)[1];
for (const k of ['units', 'volume', 'deadspace']) assert.ok(NO.includes(`'${k}'`), 'a Chiller has no ' + k);
assert.match(app, /return chiller \? out\.filter\(f => !CHILLER_NO_SIZE\.includes\(f\[0\]\)\) : out;/, 'the Template dialog leaves them out');
assert.match(app, /if \(isChillerKind\(w\.vesselType\)\) for \(const k of CHILLER_NO_SIZE\) delete w\[k\];/, 'and saving drops them');
// the Rule and the Help say so
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /^5\.41 \*\*A Chiller is the same as a pipe, no more, no less\*\*/m);
assert.match(fs.readFileSync(new URL('../help/14-equipment.md', import.meta.url), 'utf8'), /## A Chiller is a pipe/);
console.log('chillerpipe: ok');
