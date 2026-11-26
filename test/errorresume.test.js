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
// Auto next time (OakBarn Brewery, 2026-11-25: "it is not the First Fail, but subsequent failures"; "They have to set to auto resume as
// an Option. User Choice"): the first stop waits; picked with Skip, the same line failing again goes on by itself after 5 seconds
engine.write('Loop', ['// Loop', 'new value N = 0', 'new value Y = NULL', 'new value X = 0', '[Top]', 'N = N + 1', 'X = Y + 1', 'gV_Done = N', 'if N < 3', '\tgoto "Top"', 'endif'].join('\n'));
const runL = async (ms = 20) => { await engine.running.get('Loop')?.done; await new Promise(r => setTimeout(r, ms)); };
engine.start('Loop', 'user'); await runL();
assert.equal(engine.errorStopList()[0].auto, undefined, 'the first stop always waits for a brewer');
engine.resumeAfterError('Loop', { skip: true, auto: true }); await runL();
const st = engine.errorStopList()[0];
assert.equal(st.line, 7); assert.equal(st.auto.skip, true, 'the same line again: Auto Skip counting down');
assert.ok(st.auto.at - Date.now() > 4000 && st.auto.at - Date.now() <= 5000);
// ⏸ Hold: it waits again, and the Auto pick for that line is let go
assert.equal(engine.holdErrorStop('Loop'), true); assert.equal(engine.errorStopList()[0].auto, undefined);
engine.resumeAfterError('Loop', { skip: true, auto: true }); await runL();
await new Promise(r => setTimeout(r, 5300)); await runL();      // it went on by itself
assert.equal(store.getProp('gV_Done', 'value'), 3, 'Auto Skip carried it to the end');
assert.deepEqual(engine.errorStopList(), []);
engine.start('Loop', 'user'); await runL();
assert.equal(engine.errorStopList()[0].auto, undefined, 'starting over lets the Auto pick go');
engine.closeErrorStop('Loop');
engine.start('Loop', 'user'); await runL();
// Auto, no pop-up ("Auto Resume with no Popup for something like the Hop Name error, but again, the User selects the fix"): the same line
// again goes on after a second with nothing on the screens (still printed and on the Error Log)
engine.resumeAfterError('Loop', { skip: true, auto: 'quiet' }); await runL();
assert.deepEqual(engine.errorStopList(), [], 'no pop-up');
await new Promise(r => setTimeout(r, 2600)); await runL();      // fails at N = 2 and N = 3, a second each
assert.equal(store.getProp('gV_Done', 'value'), 3, 'Auto Skip, no pop-up, carried it to the end');
// Ignore this error in any Process (OakBarn Brewery, 2026-11-26: "Ignore same Error in any Process, Skip this Line and Proceed"): the
// line is left out, and the same error in any Process (on any line) is left out too with no pop-up
engine.write('Two', ['// Two', 'new value Q = NULL', 'new value R = 0', 'R = Q + 1', 'gV_Fixed = 7'].join('\n'));
engine.write('Loop2', ['// Loop2', 'new value Q = NULL', 'new value N = 0', 'new value R = 0', 'N = 1', 'R = Q + 1', 'N = 2', 'R = Q + 1', 'gV_Done = 22'].join('\n'));
const runN = async n => { await engine.running.get(n)?.done; await new Promise(r => setTimeout(r, 20)); };
engine.start('Loop2', 'user'); await runN('Loop2');
assert.equal(engine.errorStopList()[0].line, 6, 'the first time it waits');
engine.resumeAfterError('Loop2', { ignore: true }); await runN('Loop2');
assert.deepEqual(engine.errorStopList(), [], 'line 8, the same error: no pop-up');
await new Promise(r => setTimeout(r, 1300)); await runN('Loop2');
assert.equal(store.getProp('gV_Done', 'value'), 22, 'left out and went on');
engine.start('Two', 'user'); await runN('Two');
assert.deepEqual(engine.errorStopList(), [], 'another Process, the same error: no pop-up');
await new Promise(r => setTimeout(r, 1300)); await runN('Two');
assert.equal(store.getProp('gV_Fixed', 'value'), 7);
engine.stopAll(); clearTimeout(store._persistTimer);
console.log('error resume tests passed');

// the Error Log entry's words (OakBarn Brewery, Error Text PDF 2026-11-25): the error, then the allowed names after a light blue line
{
  const { errSplit } = await import('../public/errorfix.js');
  assert.deepEqual(errSplit('skn_rcp_Bad is not a Recipe value (they are: skn_rcp_Loaded, skn_rcp_Name ...)'), { what: 'skn_rcp_Bad is not a Recipe value', list: 'skn_rcp_Loaded, skn_rcp_Name ...' });
  assert.deepEqual(errSplit('Y is NULL (empty), so it has no value'), { what: 'Y is NULL (empty), so it has no value', list: '' });
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /Possible Suggested Replacement at Line \$\{e\.line\}:/);
  console.log('error words tests passed');
}
{
  const { errSplit } = await import('../public/errorfix.js');
  assert.deepEqual(errSplit('skn_rcp_X is not a Recipe value (they are: skn_rcp_Loaded, skn_rcp_Hop_Stand_Middle_Mi'), { what: 'skn_rcp_X is not a Recipe value', list: 'skn_rcp_Loaded, skn_rcp_Hop_Stand_Middle_Mi' }, 'an old entry cut short');
}
