// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// A Valve set to Tap water with a pipe on its tap side gets water only along that pipe (Rule 5.46, OakBarn Brewery, 2026-11-21:
// "Flow is wrong and spurts even when hose bib is turned off = bug"), as a Hose Bib's Inlet does (Rule 18.52 #7).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const app = read('public/app.js'), rules = read('docs/Skynet_Rules.md');

// the tap side of an open Tap water valve is a node of its own (not shut), so its pipe can bring it water
assert.match(app, /tapOut\(e\) === end \? \{ key: id, push: true, tapValve: dn \} : \{ key: id, tapValveIn: dn \}/);
// with a pipe on its tap side it pushes only once water is found along that pipe
assert.match(app, /const tvIns = \[\.\.\.nodes\]\.filter\(\(\[k, n\]\) => n\.tapValveIn && pipesOn\(k, ws\)\.length\);/);
assert.match(app, /for \(const \[k, n\] of tvIns\) \{ const o = outOf\(n\.tapValveIn\); if \(o\) o\.push = false; \}/, 'no water found: nothing comes out of it');
assert.match(app, /return !g\?\.attachTo && !g\?\.port; \};/, 'a vessel port is not a supply');
// the pipes that bring it water move while water goes out of it, and stand still when every way out is closed (Rule 5.45)
assert.match(app, /const moves = \(adj\.get\(out\) \|\| \[\]\)\.some\(\(\{ p \}\) => dir\.has\(p\.id\)\);/);
assert.match(app, /for \(const \[id, o\] of tvStill\) if \(!moving\(id\)\) still\.set\(id, o\);/);
// the pipes of the order this must run in: before the pumps' and sources' traces, after the Hose Bib Inlet
const iHb = app.indexOf('for (const [k, n] of nodes) if (n.tapIn) {'), iTv = app.indexOf('const tvIns = '), iPull = app.indexOf('for (const [k, n] of nodes) if (n.pull) trace(k, false);');
assert.ok(iHb > 0 && iHb < iTv && iTv < iPull, 'Hose Bib Inlet first, then Tap water valves, then the traces');

// the 3 Vessel 1 Pump sample: on the Brew House the Hose Bib feeds the Manifold Valve and Firehose valve Clones. They are
// plain Motorized valves, not Tap water valves (OakBarn Brewery, 2026-11-25: "They are downstream from the Hose Bib Supply and would
// have flow if the Hose Bib was open just like any other Motorized valve and No Flow on their own")
const cfg = JSON.parse(read('samples/configs/three-vessel-one-pump/config.json'));
for (const n of ['BM_31_DO@Valve_E_Firehose~Valve_WA', 'BM_33_DO@Valve_E_Manifold~Valve_WA']) assert.equal(cfg.elements.find(e => e.name === n).tapwater, false, `${n} is not a Tap water valve`);
assert.ok(cfg.graphics.some(g => g.kind === 'pipe' && g.workspace === 'Brew House' && g.from === 'eq:g_chill_tap:out'), 'the Hose Bib feeds them');
assert.ok(cfg.graphics.some(g => g.kind === 'pipe' && g.workspace === 'Brew House' && g.from === 'dev:BM_31_DO@Valve_E_Firehose~Valve_WA_Clone_1:in'), 'the Firehose Clone is piped on the Brew House');
// the Brew House Manifold Supply is a Clone of the Water Tab Manifold Valve (pin 33), as the Water Processes use (OakBarn Brewery, 2026-11-25)
assert.ok(cfg.graphics.some(g => g.kind === 'clone' && g.workspace === 'Brew House' && g.of === 'BM_33_DO@Valve_E_Manifold~Valve_WA'));
assert.ok(!cfg.elements.some(e => e.channel === 30), 'pin 30 is free');

assert.match(rules, /^5\.46 \*\*A Tap water valve with a pipe on its tap side gets its water along that pipe\*\*/m);
console.log('tapfed: ok');
