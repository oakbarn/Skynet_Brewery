// Resume after an error (Rule 10.14; OakBarn Brewery, 2026-11-25: "leave up to the User to Resume"): a Process that stopped on an
// error keeps where it stopped; ▶ Resume runs that line again, ⏭ Skip goes on at the next line, its variables as they were
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ers')), dir = path.join(d, 'scripts'); fs.mkdirSync(dir);
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [{ name: 'gV_Fixed', type: 'gGlobal', kind: 'value', value: 0 }, { name: 'gV_Done', type: 'gGlobal', kind: 'value', value: 0 }] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const engine = new Engine(store, dir, { logNow() { } });
const lists = []; engine.on('errorStops', l => lists.push(l));
// line 4 fails while Y is empty (a pump that will not start); line 5 sets the answer
engine.write('Brew', ['// Brew', 'new value X = 5', 'new value Y = NULL', 'X = Y + 1', 'gV_Done = X'].join('\n'));
const run = async () => { await engine.running.get('Brew')?.done; await new Promise(r => setTimeout(r, 20)); };
engine.start('Brew', 'user'); await run();
assert.equal(engine.list().find(x => x.name === 'Brew').state, 'error');
assert.deepEqual(engine.errorStopList().map(e => [e.process, e.line, e.lineText]), [['Brew', 4, 'X = Y + 1']], 'it keeps where it stopped');
assert.equal(lists.at(-1).length, 1, 'every screen is told');
// ▶ Resume: line 4 again; it stops on the same line again and can be resumed again
assert.equal(engine.resumeAfterError('Brew').ok, true); await run();
assert.deepEqual(engine.errorStopList().map(e => e.line), [4], 'the same error again: Resume again');
// ⏭ Skip: goes on at line 5 with X as it was (5)
assert.equal(engine.resumeAfterError('Brew', { skip: true }).ok, true); await run();
assert.equal(store.getProp('gV_Done', 'value'), 5);
assert.deepEqual(engine.errorStopList(), [], 'used up');
assert.throws(() => engine.resumeAfterError('Brew'), /nothing to resume/);
// ✕ leaves it stopped; a fresh Start lets the old one go
engine.start('Brew', 'user'); await run();
assert.equal(engine.errorStopList().length, 1);
engine.closeErrorStop('Brew'); assert.deepEqual(engine.errorStopList(), []);
engine.start('Brew', 'user'); await run(); engine.write('Brew', ['// Brew', 'new value X = 5', 'new value Y = 2', 'X = Y + 1', 'gV_Done = X'].join('\n'));
// fixed in the Process Editor (same lines), then ▶ Resume runs the fixed line with the variables it had (Y was empty)
engine.resumeAfterError('Brew'); await run();
assert.deepEqual(engine.errorStopList().map(e => e.line), [4], 'variables come back as they were, so Y is still empty');
engine.start('Brew', 'user'); await run();
assert.equal(store.getProp('gV_Done', 'value'), 3); assert.deepEqual(engine.errorStopList(), []);
engine.stopAll(); clearTimeout(store._persistTimer);
console.log('error resume tests passed');
