// The flashing bolt (Fritz, 2026-11-04, Rule 7.15): once per Schema, every valve a Process can switch, Proportional Valve and Pump
// with no On overlay gets the red and yellow flashing lightning bolt. A Manual valve and other Devices are left alone, an overlay
// already picked is kept, and (none) picked afterwards stays none.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store, BOLT_FLASH } from '../lib/store.js';
import { skynetGroupOf } from '../lib/picgroups.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bolt'));
const cfg = path.join(d, 'c.json');
const RING = 'Images/Skynet/On_Off/Overlay_Glow_Ring.svg';
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'V_Out', type: 'digitalOut', subtype: 'valve', tap: 'toggle' },
  { name: 'V_Hand', type: 'digitalOut', subtype: 'valve', valveType: 'manual' },
  { name: 'Pump_Wort', type: 'digitalOut', subtype: 'pump', tap: 'toggle' },
  { name: 'Pump_Ring', type: 'digitalOut', subtype: 'pump', imageOverlay: RING },
  { name: 'Prop_1', type: 'gGlobal', kind: 'value', subtype: 'propValve' },
  { name: 'BK_Element', type: 'digitalOut', subtype: 'element', tap: 'toggle' },
] }));
let store = new Store(cfg, path.join(d, 'data')); store.load();
const el = n => store.config.elements.find(e => e.name === n);
assert.equal(el('V_Out').imageOverlay, BOLT_FLASH, 'a switched valve gets the bolt');
assert.equal(el('Pump_Wort').imageOverlay, BOLT_FLASH, 'a pump gets the bolt');
assert.equal(el('Prop_1').imageOverlay, BOLT_FLASH, 'a proportional valve gets the bolt');
assert.equal(el('Pump_Ring').imageOverlay, RING, 'an overlay already picked is kept');
assert.ok(!el('V_Hand').imageOverlay, 'a Manual valve has no power, so no bolt');
assert.ok(!el('BK_Element').imageOverlay, 'other Devices are left alone');
const saved = JSON.parse(fs.readFileSync(cfg, 'utf8'));
assert.equal(saved.boltOverlay, true, 'done once and written to the Schema');

// (none) picked afterwards stays none on the next start
delete saved.elements.find(e => e.name === 'V_Out').imageOverlay;
fs.writeFileSync(cfg, JSON.stringify(saved));
store = new Store(cfg, path.join(d, 'data')); store.load();
assert.ok(!store.config.elements.find(e => e.name === 'V_Out').imageOverlay, '(none) stays none');

// the bolt is a Skynet On_Off picture, and the Skynet valve Templates carry it
assert.equal(skynetGroupOf(BOLT_FLASH), 'On_Off');
assert.ok(fs.existsSync(path.join('media', BOLT_FLASH)), 'the bolt drawing is there');
for (const t of ['Skynet_Motorized_Ball_Valve_H', 'Skynet_Motorized_Butterfly_Valve_H', 'Skynet_KLD20T_Proportional_Valve_H'])
  assert.equal(JSON.parse(fs.readFileSync(`templates/device/${t}.json`, 'utf8')).props.imageOverlay, BOLT_FLASH, t);
console.log('boltoverlay ok');
