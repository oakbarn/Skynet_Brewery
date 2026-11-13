// Rule 19.6 (OakBarn Brewery, 2026-11-13): the Equipment Profile Interview, and the pumps and motorized valves an Equipment Profile keeps
// (their look and place, never Interface, Port or Name), so one layout can be picked in more than one Schema.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { IV_PLAIN, IV_BUILD, vesselChoices, firstPick, vesselLabel, ivStart, ivPump, ivResize, ivProblems, ivDevices, shortOf } from '../public/eqinterview.js';
import { toSlots, fromSlots } from '../lib/schemas.js';

// the answers start from the Default settings
const a = ivStart({ name: 'Hot Side', tab: 'Brew House', fields: [['boilOff', 'Boil off', 'gal/hr', 'L/hr', 1, 3.8]] });
assert.deepEqual(a.vessels.map(v => v.type), ['HLT', 'Mash Tun', 'Brew Kettle'], 'Hot Side: 3 vessels');
assert.equal(a.pumps.length, 1, 'and 1 pump');
assert.equal(a.numbers.boilOff, 1, 'US numbers');
assert.equal(ivStart({ fermentation: true }).vessels[0].type, 'Fermentor', 'Fermentation: 1 Fermentor');
assert.equal(ivStart({ units: 'Metric', fields: [['boilOff', '', '', '', 1, 3.8]] }).numbers.boilOff, 3.8, 'Metric numbers');
// counts grow and shrink
assert.deepEqual(ivResize([ivPump(0)], 3, ivPump).map(p => p.label), ['Pump 1', 'Pump 2', 'Pump 3']);
assert.equal(ivResize([ivPump(0), ivPump(1)], 1, ivPump).length, 1);
// vessel choices: that type's Templates first, then the plain Widget and Build, then the rest
const tpls = [{ name: 'Sky_HLT', vtype: 'HLT' }, { name: 'Sky_FV', vtype: 'Fermenter' }];
assert.deepEqual(vesselChoices('HLT', tpls).map(x => x[0]), ['Sky_HLT', IV_PLAIN, IV_BUILD, 'Sky_FV']);
assert.equal(firstPick('Fermentor', tpls), 'Sky_FV', 'a Fermentor fits a Fermenter Template');
assert.equal(firstPick('Whirlpool', tpls), IV_PLAIN);
assert.equal(vesselLabel(['Fermentor', 'Fermentor', 'HLT'], 1), 'Fermentor 2', 'two of a type are numbered');
assert.equal(shortOf('Fermentor', 1, ['Fermentor', 'Fermentor']), 'FV2');
// what is wrong
assert.match(ivProblems({ ...a, iface: '' }).join(), /Interface/, 'pumps need an Interface');
assert.match(ivProblems({ ...a, iface: 'BM', pumps: [ivPump(0), ivPump(0)] }).join(), /Two have the Label "Pump 1"/);
assert.deepEqual(ivProblems({ ...a, iface: 'BM' }), [], 'the defaults are ready');
// each pump and valve gets the next free Port, never one already used
const iface = { name: 'Brewery Mega', id: 'BM', board: 'mega' };
const look = k => ({ type: 'digitalOut', subtype: k });
const made = ivDevices({ pumps: [ivPump(0), ivPump(1)], valves: [] }, { iface, tabId: 'BH', elements: [], devices: [iface], look });
assert.equal(made.length, 2);
assert.notEqual(String(made[0].channel), String(made[1].channel), 'two pumps, two Ports');
assert.match(made[0].name, /^BM_\d+_DO@Pump_Pump~1_BH$/, 'named InterfaceID_Port_Type_Label_TabID (Rule 3.1)');

// slots: Schema A's pump becomes a slot of the profile, its pipe points at the slot
const A = { workspaces: [{ name: 'Brew House' }], elements: [{ name: 'BM_14_DO@Pump_Pump_BH', type: 'digitalOut', subtype: 'pump', device: 'Brewery Mega', channel: 14, workspace: 'Brew House', label: 'Pump', x: 40, y: 700, imageOff: 'P.svg' }],
  graphics: [{ id: 'p1', kind: 'pipe', workspace: 'Brew House', from: 'dev:BM_14_DO@Pump_Pump_BH:out', to: 'g1' }] };
const s = toSlots(A, 'Brew House');
const slot = A.elements[0].eqSlot;
assert.ok(slot && s.made, 'the pump got a slot key');
assert.equal(s.graphics[0].from, `dev:@${slot}:out`, 'the pipe points at the slot');
assert.deepEqual(Object.keys(s.devices[0].look).filter(k => ['name', 'device', 'channel', 'workspace', 'eqSlot'].includes(k)), [], 'never Interface, Port or Name');
const p = { graphics: s.graphics, devices: s.devices };
// Schema B has no Port for it yet: the slot stays in the profile, the pipe keeps its slot end
const B = { workspaces: [{ name: 'Hot' }], elements: [], graphics: structuredClone(p.graphics).map(g => ({ ...g, workspace: 'Hot' })) };
fromSlots(B, 'Hot', p);
assert.equal(B.graphics[0].from, `dev:@${slot}:out`);
assert.equal(toSlots(B, 'Hot', p.devices).devices.length, 1, 'a slot B has not got yet is kept (never take away)');
// B gives it a Port: the pipe points at B's own Device, and B's look changes follow the profile
B.elements.push({ ...p.devices[0].look, eqSlot: slot, name: 'XY_3_DO@Pump_Pump_HT', device: 'XY', channel: 3, workspace: 'Hot', x: 0 });
p.devices[0].look.x = 55;
fromSlots(B, 'Hot', p);
assert.equal(B.graphics[0].from, 'dev:XY_3_DO@Pump_Pump_HT:out');
assert.equal(B.elements[0].x, 55, 'its place comes from the profile');
assert.equal(B.elements[0].channel, 3, 'its Port is its own');
// B deletes it: the slot goes
const t = toSlots(B, 'Hot', p.devices); assert.deepEqual(B.workspaces[0].eqSlots, [slot]);
B.elements = [];
assert.equal(toSlots(B, 'Hot', p.devices).devices.length, 0, 'a deleted pump leaves the profile');
assert.ok(t);

// the app: Add new offers the Interview first, the Vessel tab is gone, Rule and Help
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
assert.match(app, /\['@interview', 'Answer a few questions \(the Interview\)'\]/, 'Add new starts with the Interview');
assert.match(app, /if \(w\.from === '@interview'\) return eqInterview\(/);
assert.match(app, /for \(const x of new Set\(onTab\)\) keepOnBuild\(x\);/, 'everything starts on the Build Tab (Rule 4.1)');
assert.match(app, /for \(const e of made\) keepOnBuild\(e\);/, 'pumps and valves given Ports too');
assert.doesNotMatch(app, /key: 'vessel', title: 'Vessel'/, 'the Vessel tab is replaced by the Interview');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
assert.match(rules, /19\.6 \*\*The Equipment Profile Interview/, 'Rule 19.6');
assert.ok(fs.existsSync(new URL('../help/196-equipment-profile-interview.md', import.meta.url)), 'Help 196');
assert.ok(fs.existsSync(new URL('../help/fr/196-equipment-profile-interview.md', import.meta.url)), 'Help 196 in French');
console.log('eqinterview ok');
