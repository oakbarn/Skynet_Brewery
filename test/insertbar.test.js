// The Process Editor's Insert bar (OakBarn Brewery, 2026-11-21): its dropdowns list only what is already in the Schema (never an Add),
// one Heating Element dropdown, every button in the bar's one font, a light-blue box under Audio, Graphic, Value, Time, DateTime and SV,
// and Audio_1.play = true / false is the Audio Widget's .active
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { insertGroup, attrsOf, boolAttrs } from '../lib/store.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
const bar = html.slice(html.indexOf('<div id="insBar"'), html.indexOf('<div class="split">'));
const css = fs.readFileSync(path.join(root, 'public', 'style.css'), 'utf8');

// the groups
assert.equal(insertGroup({ type: 'digitalOut', subtype: 'pump' }), 'pumps');
assert.equal(insertGroup({ type: 'digitalOut', subtype: 'valve' }), 'valves');
assert.equal(insertGroup({ type: 'digitalOut', subtype: 'element' }), 'heat');
assert.equal(insertGroup({ type: 'pwmOut' }), 'pwm');
assert.equal(insertGroup({ type: 'text' }), 'text');
assert.equal(insertGroup({ type: 'soundPlayer' }), 'audio');
assert.equal(insertGroup({ type: 'picture' }), 'graphic');
assert.equal(insertGroup({ type: 'valueWidget' }), 'value');
assert.equal(insertGroup({ type: 'timeWidget' }), 'time');
assert.equal(insertGroup({ type: 'dateTimeWidget' }), 'datetime');
assert.equal(insertGroup({ type: 'temperature' }), 'probe');
assert.equal(insertGroup({ type: 'timer' }), null);

// the bar: one Heating Element dropdown, no Add in any dropdown, Hysteresis spelled right, one font, the light-blue boxes
assert.equal((bar.match(/data-g="heat"/g) || []).length, 1, 'one Heating Element dropdown');
assert.doesNotMatch(bar, /hystersis/i);
assert.doesNotMatch(bar, /Add|➕/, 'the dropdowns pick only what is there');
assert.deepEqual([...bar.matchAll(/class="insBox" data-for="(\w+)"/g)].map(m => m[1]), ['audio', 'graphic', 'value', 'time', 'datetime', 'probe']);
assert.match(css, /\.insBar button, \.insBar select, \.insBar input \{ font: inherit;/);
for (const m of bar.matchAll(/<(?:button|select|input)\b[^>]*>/g)) assert.match(m[0], /title="[^"]+"/, 'every one has its Hover Help: ' + m[0]);

// .play on the Audio Widget
assert.ok(attrsOf({ type: 'soundPlayer' }).includes('play'));
assert.ok(boolAttrs({ type: 'soundPlayer' }).includes('play'));
console.log('Insert bar ok');
