// Paste an Equipment Profile onto a Tab, and New Schema from a profile (Rule 19.6 #2): all of the profile's hardware, boards, Ports and
// wiring, with Names and Properties; Vessels Only / Manifold Only / Both; open pipe ends; the same hardware on the Tab replaced; a board
// on another Tab stops it.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pastePieces, pastePlan, applyRenames, numberChanges, portOf } from '../public/eqpaste.js';
import { EQUIP_FIELDS } from '../public/brewcalc.js';
import { Store } from '../lib/store.js';
import { Schemas, hardwareOf } from '../lib/schemas.js';
import { EquipmentProfiles } from '../lib/equipment.js';

// a small brewery Tab: an HLT with a probe and a heater on it, a pump and a valve, pipes HLT -> valve -> pump
const tab = { name: 'Hot', id: 'HT', width: 1600, height: 900 };
const c = {
  devices: [{ name: 'Mega', id: 'MG', connection: 'simulator', _key: 'k1' }, { name: 'Other', id: 'OT', connection: 'simulator' }],
  workspaces: [tab, { name: 'Ferm', id: 'FR' }],
  graphics: [
    { id: 'v1', kind: 'vessel', vesselType: 'vessel', name: 'HLT_Vessel', label: 'HLT', workspace: 'Hot', _key: 'kv' },
    { id: 'ipo', kind: 'ip', attachTo: 'v1', port: 'out', workspace: 'Hot' },
    { id: 'f1', kind: 'vessel', vesselType: 'bfit', name: 'Tee_1', workspace: 'Hot' },
    { id: 'p1', kind: 'pipe', from: 'ipo', to: 'dev:Valve_1:in', workspace: 'Hot' },
    { id: 'p2', kind: 'pipe', from: 'dev:Valve_1:out', to: 'dev:Pump_1:in', workspace: 'Hot' },
    { id: 'p3', kind: 'pipe', from: 'dev:Pump_1:out', to: 'f1', workspace: 'Hot' },
    { id: 't1', kind: 'text', name: 'wgt_TXT_Hello_HT', workspace: 'Hot' },
  ],
  elements: [
    { name: 'Probe_1', type: 'temperature', device: 'Mega', probeIndex: 1, integratedIn: 'v1', workspace: 'Hot', label: 'HLT temp', _key: 'kp' },
    { name: 'Heat_1', type: 'digitalOut', subtype: 'element', device: 'Mega', channel: 8, integratedIn: 'v1', input: 'Probe_1', workspace: 'Hot', _key: 'kh' },
    { name: 'Valve_1', type: 'digitalOut', subtype: 'valve', device: 'Mega', channel: 24, eqSlot: 'sV', workspace: 'Hot', _key: 'kva' },
    { name: 'Pump_1', type: 'digitalOut', subtype: 'pump', device: 'Mega', channel: 22, eqSlot: 'sP', workspace: 'Hot', _key: 'kpu' },
    { name: 'gGV_X', type: 'gGlobal', workspace: 'Hot' },
    { name: 'Timer_1', type: 'timer', workspace: 'Hot' },
  ],
};
// what the profile keeps: every Device on a board, with its Port and Name, and the board; never a hidden key, never a Widget or Timer
const hw = hardwareOf(c, tab);
assert.deepEqual(hw.elements.map(e => e.name), ['Probe_1', 'Heat_1', 'Valve_1', 'Pump_1']);
assert.deepEqual(hw.boards.map(b => b.name), ['Mega'], 'only the boards its Devices use');
assert.equal(JSON.stringify(hw).includes('_key'), false, 'no hidden key in the profile');
assert.equal(hw.tabId, 'HT');
// a Widget with IPs is real world hardware even with no board (a manual pump); a Switch or Text Box never is ("No Switches")
{ const c2 = { ...c, elements: [...c.elements, { name: 'MPump_1', type: 'manualPump', workspace: 'Hot' }, { name: 'Sw_1', type: 'digitalOut', workspace: 'Hot' }, { name: 'wgt_TXT_A_HT', type: 'text', workspace: 'Hot' }] };
  assert.deepEqual(hardwareOf(c2, tab).elements.map(e => e.name), ['Probe_1', 'Heat_1', 'Valve_1', 'Pump_1', 'MPump_1']); }
// the profile's drawing points at slots for the pumps and valves (lib/schemas.js toSlots); the paste puts the Names back
const graphics = c.graphics.filter(g => g.kind !== 'text').map(g => ({ ...g, from: g.from?.replace('dev:Valve_1', 'dev:@sV').replace('dev:Pump_1', 'dev:@sP'), to: g.to?.replace('dev:Valve_1', 'dev:@sV').replace('dev:Pump_1', 'dev:@sP') }))
  .map(g => Object.fromEntries(Object.entries(g).filter(([, v]) => v !== undefined)));
const prof = { id: 'hot', name: 'Hot Side', graphics, hardware: hw, brewhouseEfficiency: 72 };

// Both: everything, pipes joined to the Devices by Name
const both = pastePieces(prof, 'both');
assert.equal(both.elements.length, 4); assert.equal(both.graphics.length, 6); assert.equal(both.open, 0);
assert.equal(both.graphics.find(g => g.id === 'p2').from, 'dev:Valve_1:out', 'the slot is a Device Name again');
// Vessels Only: the HLT with its IP, probe and heater; no pipes, no pump or valve
const ves = pastePieces(prof, 'vessels');
assert.deepEqual(ves.graphics.map(g => g.id).sort(), ['ipo', 'v1']);
assert.deepEqual(ves.elements.map(e => e.name), ['Probe_1', 'Heat_1']);
// an immersion chiller sits in its vessel: it goes with Vessels Only and with its vessel, never alone
{ const pc = { ...prof, graphics: [...prof.graphics, { id: 'chl1', kind: 'vessel', vesselType: 'ccoil', name: 'wgt_CHL_Coil_HT', chillerOn: 'v1', workspace: 'Hot' }] };
  assert.ok(pastePieces(pc, 'vessels').graphics.some(g => g.id === 'chl1'), 'immersion chiller comes with its vessel');
  assert.ok(!pastePieces(pc, 'manifold').graphics.some(g => g.id === 'chl1'), 'not with the manifold, without its vessel'); }
// Manifold Only: pump, valve, tee and pipes; the pipe from the HLT's IP is left OPEN at that end ("Open so a Vessel could be attached")
const man = pastePieces(prof, 'manifold');
assert.deepEqual(man.elements.map(e => e.name), ['Valve_1', 'Pump_1']);
assert.deepEqual(man.graphics.map(g => g.id).sort(), ['f1', 'p1', 'p2', 'p3']);
assert.equal(man.graphics.find(g => g.id === 'p1').from, undefined, 'open end'); assert.equal(man.graphics.find(g => g.id === 'p1').to, 'dev:Valve_1:in');
assert.equal(man.open, 1); assert.deepEqual(man.boards.map(b => b.name), ['Mega']);
assert.equal(portOf({ device: 'Mega', channel: 8 }), 'Mega|pin|8'); assert.equal(portOf({ device: 'Mega', probeIndex: 2 }), 'Mega|1w1|2'); assert.equal(portOf({ type: 'timer' }), null);

// onto its own Tab: the same hardware is replaced (each new Device stands for the old one, so it keeps its hidden key); Widgets stay
const browser = JSON.parse(JSON.stringify(c));
const plan = pastePlan(browser, 'Hot', pastePieces(prof, 'both'), 'Build Tab');
assert.equal(plan.blocked, null);
assert.deepEqual(plan.gone.filter(x => x.type).map(x => x.name).sort(), ['Heat_1', 'Probe_1', 'Pump_1', 'Valve_1']);
assert.ok(plan.gone.some(x => x.id === 'v1') && plan.gone.some(x => x.id === 'ipo') && plan.gone.some(x => x.id === 'p2'), 'the vessel, what is on it and the pipes');
assert.ok(!plan.gone.some(x => x.id === 't1' || x.name === 'gGV_X' || x.name === 'Timer_1'), 'Widgets, gGlobals and Timers stay');
assert.equal(plan.stands.size, 4); assert.equal(plan.renames.size, 0, 'nothing that stays has its Names'); assert.equal(plan.newBoards.length, 0);
// onto another Tab of the same Schema: the board is on "Hot", so the paste stops
const other = pastePlan(browser, 'Ferm', pastePieces(prof, 'manifold'));
assert.match(other.blocked, /board "Mega" is already used on the Tab "Hot"/);
// a Schema without that board: it comes with the paste; a Device on another board keeps its Name only if free
const empty = { devices: [{ name: 'Uno', id: 'UN' }], workspaces: [{ name: 'Main' }], elements: [{ name: 'Pump_1', type: 'digitalOut', device: 'Uno', channel: 3, workspace: 'Main' }], graphics: [{ id: 'f1', kind: 'ip', workspace: 'Main' }] };
const pcs = pastePieces(prof, 'manifold'), pl = pastePlan(empty, 'Main', pcs);
assert.equal(pl.blocked, null); assert.deepEqual(pl.newBoards.map(b => b.name), ['Mega']);
assert.equal(pl.renames.get('Pump_1'), 'Pump_1_2', 'a Name already used gets _2'); assert.ok(pl.idMap.has('f1'), 'an id already used gets a new one');
applyRenames(pcs, pl);
assert.ok(pcs.elements.some(e => e.name === 'Pump_1_2')); assert.equal(pcs.graphics.find(g => g.id === 'p2').to, 'dev:Pump_1_2:in', 'the pipes follow the new Name');
assert.equal(pcs.graphics.find(g => g.id === 'p3').to, pl.idMap.get('f1'), 'and the new id');
// a board whose Interface ID another board here has: stopped (IDs are unique and never change, Rule 3.2)
assert.match(pastePlan({ devices: [{ name: 'X', id: 'MG' }], workspaces: [{ name: 'Main' }], elements: [], graphics: [] }, 'Main', pastePieces(prof, 'both')).blocked, /Interface ID MG/);
// a Device on another Tab on the same Port of a board the paste brings: stopped (Rule 6.1)
assert.match(pastePlan({ devices: [], workspaces: [{ name: 'Main' }, { name: 'Two' }], elements: [{ name: 'Z', device: 'Mega', channel: 22, workspace: 'Build Tab' }], graphics: [] }, 'Main', pastePieces(prof, 'manifold'), 'Build Tab').blocked, /already has the Port/);
// the Tab's own profile numbers that change ("Brewhouse efficiency 74 % → 72 %")
assert.deepEqual(numberChanges(EQUIP_FIELDS, { id: 'a', brewhouseEfficiency: 74, hopUtilization: 100 }, { id: 'b', brewhouseEfficiency: 72, hopUtilization: 100 }).map(n => [n[0], n[2], n[3]]), [['brewhouseEfficiency', 74, 72]]);
assert.deepEqual(numberChanges(EQUIP_FIELDS, prof, prof), [], 'the same profile: nothing');

// New Schema from a profile (the Keg Cleaning Schema: "use the already wired Arduino and assigned Ports and Pins")
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eqpaste-'));
const cfgPath = path.join(dir, 'config', 'brewery.json');
fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
fs.writeFileSync(cfgPath, JSON.stringify({ title: 'Brewery', workspaces: [{ ...tab, equipmentProfile: 'hot-side' }, { name: 'Ferm', id: 'FR' }], elements: c.elements.map(e => { const { _key, ...x } = e; return x; }),
  graphics: c.graphics.map(g => { const { _key, ...x } = g; return x; }), devices: [{ name: 'Mega', id: 'MG', connection: 'simulator' }] }));
const store = new Store(cfgPath, path.join(dir, 'data')); store.load();
const profiles = new EquipmentProfiles(path.join(dir, 'config', 'equipment'));
fs.mkdirSync(profiles.dir, { recursive: true });
fs.writeFileSync(path.join(profiles.dir, 'hot-side.json'), JSON.stringify({ name: 'Hot Side', brewhouseEfficiency: 75 }));
const schemas = new Schemas(store, { engine: { stopAll() { }, start() { } }, hw: { restart() { } }, profiles });
schemas.ensure(); store.writeConfig();
const kept = profiles.get('hot-side');
assert.deepEqual(kept.hardware.elements.map(e => e.name), ['Probe_1', 'Heat_1', 'Valve_1', 'Pump_1'], 'the profile keeps the Tab\'s hardware on every save');
assert.ok(kept.graphics.some(g => g.kind === 'pipe' && g.to === 'dev:@sP:in'), 'its pipes point at the slots');
schemas.fromProfile('Keg Cleaning', 'hot-side');
const k = store.config;
assert.equal(k.schema.name, 'Keg Cleaning');
assert.deepEqual(k.workspaces.filter(w => w.equipmentProfile).map(w => [w.name, w.id, w.equipmentProfile]), [['Hot', 'HT', 'hot-side']], 'its Tab uses the profile (its numbers come too)');
assert.deepEqual(k.devices.map(d => d.name), ['Mega'], 'the wired board');
assert.deepEqual(k.elements.filter(e => e.device).map(e => `${e.name}:${e.channel ?? e.probeIndex}`), ['Probe_1:1', 'Heat_1:8', 'Valve_1:24', 'Pump_1:22'], 'every Device with its Name and Port');
assert.ok(!k.elements.some(e => e.name === 'gGV_X' || e.name === 'Timer_1'), 'no gGlobals or Timers');
assert.ok(!k.graphics.some(g => g.kind === 'text'), 'no Text Widgets: the new Schema gets its own');
assert.equal(k.graphics.find(g => g.kind === 'pipe' && g.id === 'p3')?.from, 'dev:Pump_1:out', 'the pipes are joined to its Devices');
assert.throws(() => schemas.fromProfile('Keg Cleaning', 'hot-side'), /already a Schema/);
assert.throws(() => schemas.fromProfile('X', 'nope'), /No such Equipment Profile/);
fs.rmSync(dir, { recursive: true, force: true });
console.log('eqpaste ok');
