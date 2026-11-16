// The Stove Top Vessel (OakBarn Brewery, 2026-11-15, Rule 19.7, Help 199): a Special Widget with IPs and no Devices, two of them (no
// outlets, and a Bottom Outlet with its IP Type like a pipe end, Rule 5.40), each with a hose hang top (Rules 5.28 and 5.34), Gallons,
// Height and Width, and a picture drawn for its box. The five older kinds next to Add equipment are gone.
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STOVE_SIDE, STOVE_TOP, STOVE_OUT, STOVE_SHAPE, STOVE_GALLONS, stoveAspect, stoveSvg, stovePic } from '../public/stovetop.js';
import { connectTarget, connectChoices } from '../lib/qdhose.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const app = read('public/app.js');

// its box: the pot body plus a handle on each side and the rim on top
const k = (1 - 2 * STOVE_SIDE) / (1 - STOVE_TOP);
assert.ok(Math.abs(stoveAspect(12, 12) - k) < 1e-9, 'a pot as tall as it is wide');
assert.ok(Math.abs(stoveAspect(8, 16) - 0.5 * k) < 1e-9, 'a wide short pot');
assert.ok(Math.abs(stoveAspect(20, 10) - 2 * k) < 1e-9, 'a tall stock pot');
assert.equal(stoveAspect('', 12), STOVE_SHAPE * k, 'no Height: the stock pot shape');
assert.equal(stoveAspect(12, 0), STOVE_SHAPE * k, 'no Width: the stock pot shape');
assert.ok(Math.abs(stoveAspect(12, 12, true) - (1 - 2 * STOVE_SIDE) / (1 - STOVE_TOP - STOVE_OUT)) < 1e-9, 'the Bottom Outlet is in the box too');
assert.equal(STOVE_GALLONS, 5);

// the picture is drawn for the box it has (dynamic): its viewBox is the box, nothing is stretched
for (const [w, h] of [[200, 200], [320, 140], [120, 300], [5, 5]]) {
  const svg = stoveSvg(w, h), W = Math.max(20, w), H = Math.max(20, h);
  assert.match(svg, new RegExp(`viewBox="0 0 ${W} ${H}"`), `${w} x ${h}: drawn for its box`);
  assert.equal((svg.match(/<rect /g) || []).length, 5, 'two handles, the body, a shine and the rim');
  assert.ok(!/<text/.test(svg), 'no text on it: the Label is its only text');
  assert.ok(!/NaN|undefined/.test(svg), 'every number is a number');
}
assert.notEqual(stoveSvg(300, 150), stoveSvg(150, 300), 'a new shape is a new drawing');
assert.match(stovePic(200, 200), /^data:image\/svg\+xml,/);
// the Bottom Outlet: its connector drawn as its IP Type, each one different
const outs = ['tc', 'npt', 'bsp', 'qd'].map(t => stoveSvg(200, 220, t));
assert.equal(new Set(outs).size, 4, 'Tri-Clamp, NPT, BSP and Quick Disconnect each look different');
for (const o of outs) { assert.ok(o.length > stoveSvg(200, 220).length, 'the outlet is drawn'); assert.ok(!/NaN|undefined/.test(o)); }
assert.match(outs[1], /<line /, 'NPT shows its thread');
assert.match(outs[2], /<polygon /, 'BSP shows its hex nut');

// the Panel (and the Importer's Build page, which is the Panel's): two Special Widgets with IPs only, in the Add equipment list
assert.match(app, /stoveTop: 'Stove Top Vessel', stoveTopOut: 'Stove Top Vessel, Bottom Outlet',\n/, 'next to Add equipment');
for (const old of ['electric', 'gas', 'mashTun', 'coil', 'plateChiller']) assert.ok(!new RegExp(`\\b${old}: '`).test(app.slice(app.indexOf('const VESSELS'), app.indexOf('const V_HIGH'))), `${old} is gone`);
assert.ok(!/v-electric|v-gas|v-coil|v-plateChiller/.test(read('public/style.css')), 'their drawings are gone');
assert.match(app, /stoveTop: \{ title: 'Stove Top Vessel', [^\n]*ports: \{\} \}/, 'no outlets');
assert.match(app, /stoveTopOut: \{ title: 'Stove Top Vessel Bottom Outlet'[^\n]*\n\s*ports: \{ outlet: pt\('Bottom Outlet', \[\['Center Bottom', 0\.5, 1\]\], \{ on: true \}\) \} \}/, 'one IP at the center of the bottom');
assert.match(app, /\['ipTypeOut', 'Bottom Outlet IP Type', 'sel', ipChoices\(it\.ipTypeOut\)/, 'its IP Type, like a pipe end');
assert.match(app, /if \(c === 'stoveTopOut'\) g\.ipTypeOut = defaultIpType\(/, 'it starts as the Default pipe IP Type');
assert.match(app, /const hasTop = g => isKettle\(g\) \|\| isStove\(g\)/, 'both have a hose hang top');
assert.match(app, /reverse\(\)\.find\(v => hasTop\(v\) && v\.workspace === ws/, 'a hose end dropped in the top third');
assert.match(app, /x\.id === vt && hasTop\(x\)/, 'a hose in its top is drawn there');
assert.match(app, /const isSized = g => isVW\(g\) \|\| isStove\(g\)/, 'it follows the Master Vessel Sizer');
assert.match(app, /if \(isStove\(g\)\) return stoveAspect\(g\.vheight, g\.diameter, g\.vesselType === 'stoveTopOut'\)/, 'its shape is its Height and Width');
assert.match(app, /stovePic\(g\.w, g\.h, stoveOutType\(g\)\)/, 'drawn for its own box, with its outlet');
assert.match(app, /\['vheight', `Height \(\$\{u\}; empty = a stock pot shape\)`, 'num'\], \['diameter', `Width \(\$\{u\}, across the pot/, 'Height and Width fields');
assert.match(app, /\|\| stoveOutIp\(g\)\); \};/, 'a pipe end on its outlet does not draw a second connector');
assert.match(app, /isSkyV\(v\) \|\| isStove\(v\) \|\| isIceCan\(v\)\) && v !== g\) return v;/, 'its IP is fixed: it moves with the pot');
assert.match(app, /!isStove\(item\) && !isIceCan\(item\) && \(placed\.length \|\| before\.isNew\)\) vesselPopup/, 'no "check where the IPs went" pop-up');
assert.match(app, /if \(isStove\(g\)\) \{        \/\/ a Stove Top Vessel's Bottom Outlet stays at the center of its bottom/, 'resized: its outlet stays at the center of the bottom');
assert.match(app, /isStove\(g\) \? `\$\{eqClass\(g\)\.ports\[k\]\.name\} \(\$\{stoveOutType\(g\)/, 'its IP is labelled with its IP Type');
assert.match(app, /\.includes\(k\)\)\.map\(\(\[k, t\]\) => \[t, \(\) => addEquipment\(k\)\]\);/, 'Add equipment rows show their plain names and work');
assert.match(app, /const base = C\.title\.replace\(\/\[\^A-Za-z0-9\]\+\/g, '_'\)/, 'a Name has no spaces');

// a Process line Hose_1.connect = Stove_Top_Vessel_1 (Rule 5.34)
const c = { graphics: [
  { id: 'h1', kind: 'pipe', name: 'Hose_1', hose: true, qd: true, workspace: 'Brew', from: 'dev:Pump_1:out', to: null, points: [[0, 0], [9, 9]] },
  { id: 's1', kind: 'vessel', vesselType: 'stoveTop', name: 'Stove_Top_Vessel_1', label: 'Brew Kettle', workspace: 'Brew' },
  { id: 'm1', kind: 'vessel', vesselType: 'stoveTopOut', name: 'Stove_Top_Vessel_Bottom_Outlet_1', label: 'HLT', workspace: 'Brew' },
  { id: 'c1', kind: 'vessel', vesselType: 'pchiller', name: 'Plate_chiller_1', workspace: 'Brew' }] };
const h = c.graphics[0];
assert.equal(connectTarget(c, h, 'Stove_Top_Vessel_1').to, 'vtop:s1', 'into the top of the Stove Top Vessel');
assert.equal(connectTarget(c, h, 'Stove_Top_Vessel_Bottom_Outlet_1').to, 'vtop:m1', 'into the top of the Bottom Outlet one too');
assert.match(connectTarget(c, h, 'Plate_chiller_1').error, /no top/, 'a chiller has no top');
assert.deepEqual(connectChoices(c, h).map(x => x[0]), ['Stove_Top_Vessel_1', 'Stove_Top_Vessel_Bottom_Outlet_1', 'none'], 'predictive text offers both');

console.log('stovetop tests passed');
