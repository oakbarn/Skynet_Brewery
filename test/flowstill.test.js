// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Panel Update 7 (Rule 5.45): water that stands still up to a closed valve, no water splash on a loose end that sits on a Tee, an IP,
// a pipe or a widget, and the Manifold Valve's pipes on its right ends so no flow is drawn past it when it is closed.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(ROOT, 'public/app.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'public/style.css'), 'utf8');

// still water: computeFlow fills a still map from each Tap Water Valve that is On and each running pump's outlet
assert.match(app, /function computeFlow\(ws, src = new Map\(\), grav = null, spouts = null, still = null\)/, 'computeFlow takes a still map');
assert.match(app, /stubs\.push\(\{ key: \(a\.closed \? b : a\)\.key, p \}\)/, 'a pipe with a closed valve on one end is kept for still water');
assert.match(app, /'flow' \+ \(flowing \? '' : standing \? ' still' : ' off'\)/, 'a pipe with still water draws its dashes');
assert.match(css, /\.pipes \.flow\.still \{ animation: none; \}/, 'still dashes do not move');
// a loose end on something is not an open end
assert.match(app, /const LOOSE_JOIN = 25;/, 'a loose end within 25 px of an IP is in that IP (as Save layout, Rule 5.19)');
assert.match(app, /if \(n\?\.air\) return !n\.touch;/, 'no water splash on a loose end that touches a pipe or a widget');
assert.match(app, /on = looseEndIp\(pt, ws, p\[fixed\]\)/, 'a loose end in a Tab_Fitting or on an IP flows on as if joined');

// the Manifold Valve (Tap water flows Right to Left): the tap water pipe is on its right (out) end, the manifold pipe on its left (in) end
for (const [f, MV] of [['samples/configs/three-vessel-one-pump/config.json', 'BM_33_DO@Valve_E_Manifold~Valve_WA'], ['config/brewery.json', 'BM_33_DO@Valve_E_Manifold~Valve_WA']]) {
  const c = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
  assert.equal(c.elements.find(e => e.name === MV).tapwaterOut, 'in', `${f}: the Manifold Valve lets tap water out of its left end`);
  const on = (id, end) => c.graphics.find(g => g.id === id) && assert.ok(Object.values({ a: c.graphics.find(g => g.id === id).from, b: c.graphics.find(g => g.id === id).to }).some(x => x === end), `${f}: ${id} on ${end}`);
  on('p_fw_2', `dev:${MV}:out`); on('p_fw_4', `dev:${MV}:in`);
  on('p_bh_mv_2', `dev:${MV}_Clone_1:out`); on('p_bh_mv_1', `dev:${MV}_Clone_1:in`);
}
console.log('flowstill: ok');
