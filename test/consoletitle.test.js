// The black window keeps its own name, not "Windows PowerShell" (Rule 2.36, lib/consoletitle.js)
import assert from 'node:assert/strict';
import { keepConsoleTitle, PANEL_TITLE, IMPORTER_TITLE } from '../lib/consoletitle.js';

// not Windows: nothing is named
let set = [];
keepConsoleTitle(PANEL_TITLE, { platform: 'linux', setTitle: t => set.push(t) })();
assert.deepEqual(set, []);
// Windows: named at once, and named again after a PowerShell helper renamed it
set = [];
const stop = keepConsoleTitle(PANEL_TITLE, { platform: 'win32', setTitle: t => set.push(t), every: 10 });
assert.deepEqual(set, [PANEL_TITLE]);
await new Promise(r => setTimeout(r, 45));
stop();
assert.ok(set.length >= 3 && set.every(t => t === PANEL_TITLE));
const n = set.length;
await new Promise(r => setTimeout(r, 30));
assert.equal(set.length, n, 'stops when told');
// a window that can't be named never stops the panel
keepConsoleTitle(IMPORTER_TITLE, { platform: 'win32', setTitle: () => { throw new Error('no console'); }, every: 1000 })();
// the names say what the window is and that it stays open, never "PowerShell"
for (const t of [PANEL_TITLE, IMPORTER_TITLE]) { assert.match(t, /^Skynet /); assert.match(t, /keep open/); assert.doesNotMatch(t, /powershell/i); }
console.log('consoletitle tests passed');
