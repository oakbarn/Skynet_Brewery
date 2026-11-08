// Connect your brewery (Rule 15.4, Fritz 2026-11-07): the parts, the guesses, the chains and reading an AI's answer
import assert from 'node:assert/strict';
import { findParts, guessChains, guessFermenters, chainLinks, chainsFromLinks, addLink, looseItems, endText, readAiAnswer, aiQuestion, connectReport, guessBy } from '../public/importer/connect.js';
import { readClues } from '../lib/importer.js';

const el = (name, label, type = 'digitalOut', extra = {}) => ({ name, label, type, workspace: 'Main', x: 0, y: 0, w: 100, h: 60, bru: { name: label }, ...extra });
const conv = { elements: [
  el('MP_42_HE_HLT_Heat_BH', 'M_HLT Heat', 'digitalOut', { subtype: 'element' }),
  el('MP_45_DO_M_HLT_Pump', 'M_HLT Pump'), el('MP_46_DO_M_Mash_Pump', 'M_Mash Pump'), el('MP_47_DO_M_Boil_Pump', 'M_Boil Pump'),
  el('MP_9_PWM_M_HLT_PV2', 'M_HLT PV2', 'pwmOut'), el('MP_8_PWM_M_Boil_PV1', 'M_Boil PV1', 'pwmOut'),
  el('MP_35_DO_M_V1', 'M_V1'), el('MP_36_DO_M_V12', 'M_V12'), el('MP_5_DO_Whirl', 'M_120VAC Blue Outlet #5 Chugger MAX Whirlpool'),
  el('BS_27_DO_FV_1', 'FV 1'), el('BS_28_DO_FV_2', 'FV 2'), el('BS_29_DO_Block', 'Switch 2-24VDC Block FV 1+2'),
  el('BS_25_Hys_Cool_Pump', 'Cool Pump', 'hysteresis'), el('BS_26_Hys_Warm_Pump', 'Warm Pump', 'hysteresis'),
  el('BS_62_AI_S_Ferm_Temp', 'S_Ferm Temp', 'analogIn'), el('BS_55_AI_PSI', 'S_Fermentation PSI', 'analogIn'),
] };
const scripts = [{ name: 'Fermentation Script', text: '"Cool Pump" Enabled = true  //glycol chiller pump\n"FV 1" Enabled = true  // return glycol\n"FV 2" Enabled = true  // feed glycol' }];

// the parts: vessels from the names and Scripts; a power switch for the valves is not a valve; a heating element is neither
const parts = findParts(conv, scripts);
assert.deepEqual(parts.vessels.map(v => v.name), ['HLT', 'Mash Tun', 'Boil Kettle', 'Fermenter']);
assert.equal(parts.vessels.find(v => v.key === 'FV').side, 'cold', 'a Fermenter is on the Cold Side');
assert.deepEqual(parts.pumps.map(p => p.label), ['M_HLT Pump', 'M_Mash Pump', 'M_Boil Pump', 'M_120VAC Blue Outlet #5 Chugger MAX Whirlpool', 'Cool Pump', 'Warm Pump']);
assert.ok(!parts.valves.some(v => /Block|Heat/.test(v.label)), 'no power switch or heater among the valves');
assert.ok(parts.valves.some(v => v.label === 'M_V1') && parts.valves.some(v => v.label === 'FV 2'));

// the Fermenter questions start with guesses from the Script comments
const [fv] = guessFermenters(parts, conv, scripts);
assert.equal(fv.cooling, 'coil', 'glycol in the Scripts: a glycol coil');
assert.equal(fv.feed, 'BS_28_DO_FV_2'); assert.equal(fv.ret, 'BS_27_DO_FV_1');
assert.equal(fv.coolPump, 'BS_25_Hys_Cool_Pump'); assert.equal(fv.warmPump, 'BS_26_Hys_Warm_Pump');
assert.equal(fv.probe, 'BS_62_AI_S_Ferm_Temp'); assert.equal(fv.pressure, 'BS_55_AI_PSI');

// the guesses from the names: outlet -> its valve -> its pump; the whirlpool pump back into the Boil Kettle
const chains = guessChains(parts, { fermenters: [fv] });
const say = c => [endText(c.start, parts), ...c.steps.map(s => endText(s.to, parts))].join(' > ');
assert.deepEqual(chains.map(say), [
  'HLT Center Bottom Outlet > M_HLT PV2 > M_HLT Pump In',
  'Mash Tun Center Bottom Outlet > M_Mash Pump In',
  'Boil Kettle Center Bottom Outlet > M_Boil PV1 > M_Boil Pump In',
  'M_120VAC Blue Outlet #5 Chugger MAX Whirlpool Out > Boil Kettle Right Tangential',
]);
assert.ok(chains.every(c => c.steps.every(s => s.source === 'name' && s.by === 'pipe')), 'each is a guess, by Pipe');
// the loose valves (no name says where they go) are listed, never guessed
assert.deepEqual(looseItems(parts, chains, [fv]).map(i => i.label), ['M_V1', 'M_V12']);

// the BruControl picture: only on a Tab with a background picture, a valve right next to a pump joins it
const near = { elements: [el('A', 'V9'), { ...el('B', 'Transfer Pump'), x: 105 }] };
const np = findParts(near, []);
assert.equal(guessChains(np).length, 0, 'no picture: no guess from the places');
const sayN = c => [endText(c.start, np), ...c.steps.map(s => endText(s.to, np))].join(' > ');
assert.equal(sayN(guessChains(np, { backgrounds: { Main: true } })[0]), 'V9 > Transfer Pump In');
assert.equal(guessChains(np, { backgrounds: { Main: true } })[0].steps[0].source, 'picture');

// a chain's links leave a pump from its Out
const links = chainLinks(chains[0]);
assert.equal(links.length, 2);
assert.deepEqual(links[1], { from: { kind: 'valve', id: 'MP_9_PWM_M_HLT_PV2' }, to: { kind: 'pump', id: 'MP_45_DO_M_HLT_Pump', side: 'in' }, by: 'pipe', source: 'name' });
const two = [...chains.slice(0, 1).map(c => structuredClone(c))];
addLink(two, { from: { kind: 'pump', id: 'MP_45_DO_M_HLT_Pump', side: 'out' }, to: { kind: 'vessel', key: 'MLT', at: 'lSparge' }, source: 'you' });
assert.equal(two.length, 1, 'a link from the end of a chain carries it on');
assert.equal(chainLinks(two[0])[2].from.side, 'out');
assert.equal(guessBy({ kind: 'qd' }, { kind: 'valve' }), 'hose', 'a QD end is a Hose');
// links that meet are joined into one chain, in any order
const joined = chainsFromLinks([
  { from: { kind: 'valve', id: 'MP_35_DO_M_V1' }, to: { kind: 'pump', id: 'MP_46_DO_M_Mash_Pump', side: 'in' } },
  { from: { kind: 'vessel', key: 'MLT', at: 'cBottomOutlet' }, to: { kind: 'valve', id: 'MP_35_DO_M_V1' } },
]);
assert.equal(joined.length, 1); assert.equal(say(joined[0]), 'Mash Tun Center Bottom Outlet > M_V1 > M_Mash Pump In');

// Ask an AI: the question lists the exact names; the answer is read back with plain matching, never guessed
const q = aiQuestion(parts);
assert.match(q, /From <name> To <name> by <Pipe or Hose>/);
assert.match(q, /- HLT Center Bottom Outlet/); assert.match(q, /- M_HLT Pump Out/); assert.match(q, /- Tap Water/);
assert.ok(!/Fermenter Center/.test(q), 'the AI is asked about the Hot Side only');
const a = readAiAnswer('Here you go:\nHot side vessels: 3\n1. **From HLT Center Bottom Outlet To M_V1 by Pipe**\n- from m_v1 to M_HLT Pump In by hose\nFrom M_HLT Pump Out to Tap Water\nFrom The Big Tank To M_V1 by Pipe', parts);
assert.equal(a.vessels, 3);
assert.equal(a.links.length, 3);
assert.deepEqual(a.links.map(l => l.by), ['pipe', 'hose', 'pipe']);
assert.ok(a.links.every(l => l.source === 'ai'));
assert.deepEqual(a.unread, ['From The Big Tank To M_V1 by Pipe'], 'a line it cannot read is listed');
assert.equal(say(chainsFromLinks(a.links)[0]), 'HLT Center Bottom Outlet > M_V1 > M_HLT Pump In > Tap Water');

// what goes in the Schema file
const rep = connectReport({ parts, chains, fermenters: [fv] });
assert.equal(rep.links.length, 6);
assert.equal(rep.links[0].fromText, 'HLT Center Bottom Outlet');
assert.deepEqual(rep.loose, ['MP_35_DO_M_V1', 'MP_36_DO_M_V12']);

// the clues read from the config file: the Scripts and each workspace's background picture
const xml = `<?xml version="1.0"?><Configuration><Processes><Process><Name>Mash</Name><Script>"M_V1" State = on</Script></Process></Processes>
<Workspaces><Workspace><Name>Brewhouse</Name><BackgroundImagePath>C:\\Pics\\brewery.jpg</BackgroundImagePath><BackgroundImageWidth>1800</BackgroundImageWidth><BackgroundImageHeight>900</BackgroundImageHeight><Elements/></Workspace>
<Workspace><Name>Empty</Name><BackgroundImagePath/><Elements/></Workspace></Workspaces></Configuration>`;
const clues = readClues(xml);
assert.deepEqual(clues.scripts, [{ name: 'Mash', text: '"M_V1" State = on' }]);
assert.deepEqual(clues.backgrounds, { Brewhouse: { path: 'C:\\Pics\\brewery.jpg', w: 1800, h: 900 } });
console.log('connect tests passed');

// the Chart Widget tests run here too, so package.json stays as it is (no clash with other open PRs)
await import('./chart.test.js');
