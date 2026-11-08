// The Process editor has a Close button and a boxed ✕, always working (opened from 📝 Processes on the Edit layout bar,
// for example on the Build Tab of the 3 Vessel sample): both go back to the Tabs, and ask first if the Process is not saved.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const ed = html.slice(html.indexOf('<section id="view-scripts"'), html.indexOf('</section>', html.indexOf('<section id="view-scripts"')));
assert.match(ed, /<span id="procClose" style="margin-left: auto"><\/span>/, 'the Process editor has a place for Close and ✕');
assert.match(app, /\$\('#procClose'\)\.append\(paneClose\(\(\) => \{\n\s*if \(dirty && !confirm\([^\n]*\)\) return;\n\s*setView\('workspace'\);/, 'Close and ✕ go back to the Tabs, asking first when not saved');
console.log('procclose ok');
