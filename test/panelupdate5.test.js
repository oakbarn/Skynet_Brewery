// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Panel Update 5 (Rules 2.58, 2.60, 19.9, 19.10): the New Schema Interview's Tabs page, Close on pages, Menu tabs close back,
// My Size, Material, the same-side Templates, and Import Vessels / Import Manifold (drawingPart)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { drawingPart } from '../lib/schemas.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(ROOT, 'public/app.js'), 'utf8');

// ---- Import Vessels / Import Manifold: the vessel side (vessels and what hangs on them) or the manifold side, never both
const G = [
  { id: 'v1', kind: 'vessel', vesselType: 'vessel' },
  { id: 'f1', kind: 'vessel', vesselType: 'bfit', attachTo: 'v1' },          // a bundled fitting on the kettle goes with it
  { id: 'c1', kind: 'vessel', vesselType: 'ccoil', onVessel: 'v1' },        // an immersion chiller in the kettle too
  { id: 'v2', kind: 'vessel', vesselType: 'vessel' },
  { id: 'tee', kind: 'vessel', vesselType: 'bfit' },                         // a fitting by itself: manifold
  { id: 'p1', kind: 'pipe', from: 'v1', to: 'v2' },                          // between two vessels: vessel side
  { id: 'p2', kind: 'pipe', from: 'f1', to: 'tee' },                         // vessel to manifold: neither alone
  { id: 'p3', kind: 'pipe', from: 'tee', to: 'dev:12' },                     // manifold to a Device's IP: manifold
];
assert.equal(drawingPart(G, 'all'), G, 'Import All takes the whole Default Layout');
assert.deepEqual(drawingPart(G, 'vessels').map(g => g.id), ['v1', 'f1', 'c1', 'v2', 'p1'], 'Import Vessels: vessels with their fittings and chillers, and pipes between them');
assert.deepEqual(drawingPart(G, 'manifold').map(g => g.id), ['tee', 'p3'], 'Import Manifold: the fittings and pipes between them, not the vessels');

// ---- the New Schema Interview (Rule 2.58): Boards, Tabs, Done; no Equipment page any more
assert.match(app, /const NSI_STEPS = \['About', 'Boards', 'Tabs', 'Done'\]/, 'four steps: Equipment is taken care of in Tabs');
for (const k of ['Brewing (Brew House)', 'Fermentation', 'Cleaning', 'Other (you name it)']) assert.ok(app.includes(`'${k}'`), `Tab kind ${k}`);
assert.match(app, /\['stove', 'Stove Top \(Extract\)'\][^\n]*\['mashtun', 'All Grain with Mash Tun \(3 Vessels\)'\]/, 'Level from Stove Top to All Grain with Mash Tun');
assert.ok(app.includes('➕ Add New Tab'), 'Add New Tab');
assert.ok(app.includes('newBoard:'), 'a way to add a New board');
assert.match(app, /brewDefaults/, 'the Skynet Brewer Level is kept');

// ---- Close on pages, Add Interface lands on Interfaces, Menu tabs close back (Rule 2.60)
assert.match(app, /const menuBack = \{\}/, 'a Menu tab remembers where it was opened from');
assert.match(app, /#sec-interfaces/, 'Add Interface goes to the Interfaces page');

// ---- My Size (Rule 19.9) and Material (Rule 19.10)
assert.ok(app.includes('📐 My Size'), 'My Size button');
assert.match(app, /const MATERIAL_CHOICES/, 'Material dropdown');
for (const n of ['HERMS_Coil_Same_Side', 'Immersion_Chiller_Same_Side']) {
  const t = JSON.parse(fs.readFileSync(path.join(ROOT, 'templates/vessel', n + '.json'), 'utf8'));
  assert.ok(t.ports, `${n} has ports`);
}
assert.ok(!fs.existsSync(path.join(ROOT, 'templates/vessel/Chillzilla.json')), 'no Chillzilla Template');
console.log('panelupdate5 tests passed');
