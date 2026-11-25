// Touch friendly for running (Rule 2.35 note, Fritz 2026-11-25): a finger held on a Push Button, Dual Action or Push Button Hose Bib
// never opens Help, and text boxes and dropdowns get 16 px text on touch screens so iPhone Safari does not zoom in.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
const fn = app.match(/function fingerHeld\(target\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(fn, 'fingerHeld is there');
assert.match(fn, /mvHoldGfx/, 'a Push Button Hose Bib is held on purpose');
assert.match(fn, /\['hold', 'dual'\]\.includes\(tapAction\(e\)\)/, 'Push Button and Dual Action are held on purpose');
assert.match(fn, /\.mfValve\[data-dev\]/, 'Valve Tee and Supply Manifold valves count');
const press = app.slice(app.indexOf('helpPress = { x: ev.clientX') - 700, app.indexOf('helpPress = { x: ev.clientX'));
assert.match(press, /if \(fingerHeld\(ev\.target\)\) return;/, 'the finger Help long press skips held items');
assert.match(css, /@media \(pointer: coarse\) \{ input, select, textarea \{ font-size: 16px; \} \}/, '16 px boxes on touch screens');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
assert.match(rules, /\*\*Touch friendly for running\*\*/);
for (const f of ['../help/45-phones-and-tablets.md', '../help/fr/45-phones-and-tablets.md'])
  assert.match(fs.readFileSync(new URL(f, import.meta.url), 'utf8'), /Push Button/);
console.log('touchfriendly ok');
