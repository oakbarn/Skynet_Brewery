// Flow colors for Pipes and Hoses (Fritz, 2026-11-03, Rule 5.21): tab.flow_Color, Pipe_1.flow_Color, Vessel and Tap Water Valve
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';
import { flowKey, flowHex, flowName, pipeFlowColor, pipeWins, flowStandard, FLOW_DEFAULT, TAP_BLUE } from '../public/flowcolor.js';

// what can be written
assert.equal(flowKey('Mash'), 'mash');
assert.equal(flowKey('Mash (Brown)'), 'mash');
assert.equal(flowKey('Reddish Brown'), 'reddishbrown');
assert.equal(flowKey('Reddish_Brown'), 'reddishbrown');
assert.equal(flowKey('None'), '');
assert.equal(flowKey(''), '');
assert.equal(flowKey('#A0452A'), '#a0452a');
assert.equal(flowKey('RGB 160 69 42'), '#a0452a');
assert.equal(flowKey('rgb(160,69,42)'), '#a0452a');
assert.equal(flowKey('Plaid'), null);
assert.equal(flowName('reddishbrown'), 'Reddish Brown');
assert.equal(flowName('mash'), 'Mash');
assert.equal(flowName(''), 'None');

// the order: Vessel > Tap Water Valve > Tab (Tap, Strike, plain colors) > pipe > Tab (Mash, Boil, Whirlpool, Ferment) > standard
assert.equal(pipeFlowColor({}), FLOW_DEFAULT, 'everything None: the standard flow color');
assert.equal(pipeFlowColor({ pipe: 'orange' }), flowHex('orange'));
assert.equal(pipeFlowColor({ tab: 'mash' }), flowHex('mash'));
assert.equal(pipeFlowColor({ tab: 'mash', pipe: 'orange' }), flowHex('orange'), 'a pipe color overrides Mash');
assert.equal(pipeFlowColor({ tab: 'ferment', pipe: 'orange' }), flowHex('orange'));
assert.equal(pipeFlowColor({ tab: 'strike', pipe: 'orange' }), flowHex('strike'), 'Strike: every pipe');
assert.equal(pipeFlowColor({ tab: 'tap', pipe: 'orange' }), flowHex('tap'));
assert.equal(pipeFlowColor({ tab: 'mash', pipe: 'orange', tap: true }), TAP_BLUE, 'tap water is always Blue');
assert.equal(pipeFlowColor({ tab: 'strike', tap: true, vessel: 'red' }), flowHex('red'), 'a vessel color overrides all else');
assert.ok(pipeWins('') && pipeWins('boil') && !pipeWins('purple'));

// older Schemas: the old start color #4fb3ff becomes None, other colors are kept
const gs = [{ kind: 'pipe', flowColor: '#4fb3ff' }, { kind: 'pipe', flowColor: '#E74C3C' }, { kind: 'pipe', hose: true, flowColor: 'transparent' }, { kind: 'pipe' }];
assert.equal(flowStandard(gs), 3);
assert.ok(!('flowColor' in gs[0])); assert.equal(gs[1].flowColor, '#e74c3c'); assert.ok(!('flowColor' in gs[2]));

// Processes
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'flowcolor'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [{ name: 'Done', type: 'gKonstant', kind: 'value' }, { name: 'Seen', type: 'gKonstant', kind: 'string' }],
  graphics: [{ id: 'p1', kind: 'pipe', name: 'Pipe_1', workspace: 'Main', points: [[0, 0], [100, 0]], flowColor: '#4fb3ff' }, { id: 'h1', kind: 'pipe', hose: true, name: 'Hose_1', workspace: 'Main', points: [[0, 0], [50, 50]] }] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
assert.ok(!('flowColor' in store.config.graphics[0]), 'the old start color is None after loading');
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const sent = []; eng.on('flow', f => sent.push(f));
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
const src = 'tab.flow_Color = Mash\nPipe_1.flow_Color = Orange\nHose_1.flow = "RGB 160 69 42"\nSeen = tab.flow_Color\nDone = 1\n';
assert.deepEqual(eng.check(src).errors, [], 'the Check finds nothing wrong');
assert.ok(eng.check('tab.flow_Color = Plaid\n').errors.length, 'an unknown color is caught');
assert.ok(eng.check('tab.visible = false\n').errors.length, 'tab has only .flow_Color');
assert.ok(eng.check('Pipe_9.flow_Color = Red\n').errors.length, 'no such pipe');
eng.write('colors', src); eng.start('colors');
assert.ok(await until(() => store.getProp('Done', 'value') === 1), 'the Process runs to the end');
assert.deepEqual(eng.flowView(), { tab: 'mash', pipes: { Pipe_1: 'orange', Hose_1: '#a0452a' } });
assert.equal(store.getProp('Seen', 'value'), 'Mash');
assert.ok(sent.length >= 3, 'screens are told');
eng.write('none', 'Pipe_1.flow_Color = None\nDone = 2\n'); eng.start('none');
assert.ok(await until(() => store.getProp('Done', 'value') === 2));
assert.deepEqual(eng.flowView().pipes, { Hose_1: '#a0452a' });
eng.resetFlow(); assert.deepEqual(eng.flowView(), { tab: '', pipes: {} });
assert.ok(compile('tab.flow_Color = Reddish_Brown\n').errors.length === 0);
clearTimeout(store._persistTimer);
console.log('flow color tests passed');
process.exit(0);
