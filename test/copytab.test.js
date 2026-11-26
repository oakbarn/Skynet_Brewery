// Copy a whole Tab on New tab (Rule 4.8, Panel Updates Sandbox entry 18), checked on the 3 Vessel 1 Pump sample
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { tabPieces, copyTab, processesUsing, processCopyName, nextFree } from '../public/copytab.js';
import { isDevice, cloneName } from '../public/naming.js';

const c = JSON.parse(fs.readFileSync(new URL('../samples/configs/three-vessel-one-pump/config.json', import.meta.url)));
let n = 0;
const h = { newId: () => 'gnew' + (++n), cloneName, widgetName: (x, taken, old) => '', graphicName: (x, taken, g) => '' };
const p = tabPieces(c, 'Brew House', isDevice);
assert.ok(p.devices.length >= 10 && p.widgets.length > 0 && p.graphics.length > 0, 'the sample Tab has Devices, Widgets and drawn items');

// i) every Widget a Clone
const a = copyTab(c, 'Brew House', 'Brew House 2', isDevice, () => 'clone', h);
assert.equal(a.elements.length, 0, 'no new Devices or Widgets: only Clones');
const cl = a.graphics.filter(g => g.kind === 'clone');
assert.equal(cl.length, p.devices.length + p.widgets.length + p.clones.length, 'one Clone for every Device and Widget');
for (const g of cl) { assert.ok(g.name.startsWith(g.of + '_Clone_'), g.name); assert.equal(g.workspace, 'Brew House 2'); }
const pump = cl.find(g => g.of === 'BM_22_DO@Pump_Pump_BH');
assert.equal(pump.name, 'BM_22_DO@Pump_Pump_BH_Clone_1');
assert.deepEqual([pump.x, pump.y], [1176, 838], 'in the same place');
// pipes, IPs and vessels: new ids, pipe ends on the copies, Device ends on the Clones
const drawn = a.graphics.filter(g => g.kind !== 'clone');
assert.equal(drawn.length, p.graphics.length);
const ids = new Set(drawn.map(g => g.id)), oldIds = new Set(p.graphics.map(g => g.id)), cloneNames = new Set(cl.map(g => g.name));
for (const g of drawn) assert.ok(!oldIds.has(g.id), 'a new id');
for (const g of drawn.filter(g => g.kind === 'pipe')) for (const k of ['from', 'to']) {
  if (!g[k]) continue;
  const m = /^dev:(.+):\w+$/.exec(g[k]);
  assert.ok(m ? cloneNames.has(m[1]) : ids.has(g[k]) || /^(eq|vtop):/.test(g[k]), `${g.name} ${k} = ${g[k]} is on the copy`);
}
const pipe = drawn.find(g => g.kind === 'pipe' && g.to === 'dev:BM_24_DO@Valve_E_HLT~out_BH_Clone_1:in');
assert.ok(pipe, 'the HLT out pipe ends on the valve\'s Clone');
for (const g of drawn.filter(g => g.attachTo)) assert.ok(ids.has(g.attachTo), 'an IP sits on the copied vessel');
assert.ok(!c.graphics.some(g => g.workspace === 'Brew House 2'), 'the Schema itself is not changed');

// ii) new Widgets: a new name, refs to other new Widgets follow, refs to Devices stay on the parent
let m = 0;
const h2 = { ...h, newId: () => 'gnw' + (++m), widgetName: (x, taken, old) => nextFree(old.replace(/_BH$/, '_B2'), taken) };
const b = copyTab(c, 'Brew House', 'Brew House 2', isDevice, () => 'new', h2);
assert.equal(b.elements.length, p.widgets.length);
assert.equal(b.names.get('wgt_SW_Testing_BH'), 'wgt_SW_Testing_B2');
assert.equal(nextFree('wgt_SW_Testing_BH', n => n === 'wgt_SW_Testing_BH'), 'wgt_SW_Testing_BH_2', 'a taken name gets _2');
assert.ok(b.elements.every(e => e.workspace === 'Brew House 2' && !('_ref' in e)));
assert.equal(b.graphics.filter(g => g.kind === 'clone').length, p.devices.length + p.clones.length, 'Devices (and the Tab\'s own Clones) are still Clones');

// the Processes that use the Widgets, and their copies' names
const texts = [['BrewDay_Flow', 'wgt_SW_Testing_BH = true\nwgt_SW_Testing_BH_2 = 1'], ['Other', 'wgt_SW_Testing_BH_2 = 1'], ['Pump_only', 'BM_22_DO@Pump_Pump_BH = On']];
assert.deepEqual(processesUsing(texts, ['wgt_SW_Testing_BH']), ['BrewDay_Flow'], 'whole names only');
assert.deepEqual(processesUsing(texts, []), []);
assert.equal(processCopyName('BrewDay_Flow', 'B2', x => x === 'BrewDay_Flow_B2'), 'BrewDay_Flow_B2_2');
console.log('copytab ok');
