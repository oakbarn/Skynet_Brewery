// The Process editor never opens empty (OakBarn Brewery, 2026-11-21): opened from ☰ Menu > Processes or 📝 Processes on the
// Edit layout bar, it shows the Process this browser had open last (or the first one), ready to type in; Help 30.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
assert.match(app, /if \(v === 'scripts' && !curScript\) openLastProcess\(\);/, 'opening the Process editor with nothing open opens a Process');
assert.match(app, /function openLastProcess\(\) \{[\s\S]{0,500}S\.scripts\.some\(s => s\.name === last\) \? last : first\?\.name/, 'the last one used, or the first in the list');
assert.match(app, /localStorage\.setItem\(LAST_PROC, name\)/, 'each Process opened is remembered');
assert.match(html, /<textarea id="code" placeholder="Pick a Process on the left/, 'an empty editor says what to do');
for (const f of ['help/30-process-editor.md', 'help/fr/30-process-editor.md'])
  assert.match(fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8'), /(opens ready to edit|s'ouvre prêt à modifier)/, f + ' says it');
console.log('procopen ok');

// the Insert bar's test runs with this one (one less change to the one long test line in package.json, which every PR touches)
await import('./insertbar.test.js');
