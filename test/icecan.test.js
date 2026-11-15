// The Sump Pump by hand and the Ice Water Can (OakBarn Brewery, 2026-11-15, Rules 5.15a and 19.8, Help 162 and 201)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ICECAN_SIZE, ICECAN_FLOW, iceCanSvg, iceCanPic } from '../public/icecan.js';
import { flowKey } from '../public/flowcolor.js';

// the picture is drawn for its own box, never stretched
for (const [w, h] of [[160, 200], [300, 120], [40, 400], [0, 0]]) {
  const svg = iceCanSvg(w, h);
  assert.match(svg, /^<svg [^>]*viewBox="0 0 [\d.]+ [\d.]+"/, 'an SVG with its own box');
  assert.ok(!/NaN|undefined/.test(svg), `nothing missing in a ${w} x ${h} can`);
  assert.ok(!/<text/.test(svg), 'no text in the picture: the Label is its only text');
}
assert.match(iceCanSvg(160, 200), /viewBox="0 0 160 200"/, 'drawn to the box it has');
assert.ok(iceCanPic(160, 200).startsWith('data:image/svg+xml,'), 'shown as a picture');
assert.deepEqual(ICECAN_SIZE, [240, 300], "a 150 x 150 Sump Pump fits inside");
assert.equal(flowKey(ICECAN_FLOW), 'blue', 'its water starts Blue (cold)');

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
// the Sump Pump by hand: its own row in the Widget list and the Pumps list, the Manual Pump with the Sump pump picture in one step
assert.match(app, /const SUMP_BY_HAND_ROW = \['Sump Pump by hand[^\]]*\(\) => addManualPump\('sump'\)\]/, 'Sump Pump by hand row');
assert.match(app, /SUMP, MANUAL_PUMP_ROW, SUMP_BY_HAND_ROW\]\]/, 'in Select Device Type > Pumps');
assert.match(app, /MANUAL_PUMP_ROW, SUMP_BY_HAND_ROW,\n/, 'in Select Widget Type > Semi_Widgets_Devices');
assert.match(app, /async function addManualPump\(pick\) \{\n  toBuild\(\);\n  const k = pick \|\| await pickModel\(/, 'a picked pump skips step 2');
assert.match(app, /const word = sump \? 'Sump ' : 'Pump '/, 'a Sump pump\'s Label starts Sump 1');
// the Ice Water Can
assert.match(app, /iceCan: 'Ice Water Can \(cold water for a Sump Pump and chiller\)'/, 'in Add equipment');
assert.match(app, /iceCan: \{ title: 'Ice Water Can', types: \['Ice Water', 'Other'\], image: '', size: ICECAN_SIZE, tab: 'Equipment', ports: \{\} \}/, 'no IPs of its own');
assert.match(app, /const hasTop = g => isKettle\(g\) \|\| isStove\(g\) \|\| isIceCan\(g\);/, 'a hose hang top');
assert.match(app, /if \(c === 'iceCan'\) \{ g\.flowColor = ICECAN_FLOW; g\.label = 'Ice Water'; \}/, 'Out flow color Blue, Label Ice Water');
assert.match(app, /!g\.image && isIceCan\(g\)\) \{[^\n]*iceCanPic\(g\.w, g\.h\)/, 'drawn by Skynet when Graphic is empty');
// a running pump with its inlet inside the can (nothing joined to it) draws the can's water
const flow = app.slice(app.indexOf('function computeFlow('), app.indexOf('// Keep pipe ends on their IPs.'));
assert.match(flow, /if \(!n\.pull \|\| pumpSrc\.get\(devOfIp\(k\)\) \|\| \(radj\.get\(k\) \|\| \[\]\)\.length\) continue;/, 'only an inlet with nothing joined');
assert.match(flow, /isIceCan\(g\) && c\[0\] >= g\.x && c\[0\] <= g\.x \+ \(g\.w \|\| 0\) && c\[1\] >= g\.y && c\[1\] <= g\.y \+ \(g\.h \|\| 0\)/, 'inside the can');
assert.match(flow, /pumpSrc\.set\(devOfIp\(k\), \{ vessel: col \}\)/, 'takes the can\'s Out flow color');
assert.ok(flow.indexOf('isIceCan(g)') < flow.indexOf('if (n.push) trace(k, true)'), 'before the outlets are traced');
// a Process can hang a hose in its top
assert.match(fs.readFileSync(new URL('../lib/qdhose.js', import.meta.url), 'utf8'), /\['stoveTop', 'stoveTopOut', 'iceCan'\]\.includes/, 'Hose_1.connect = Ice_Water_Can_1');
// Help, in English and French
for (const p of ['../help/201-ice-water-can.md', '../help/fr/201-ice-water-can.md']) {
  const t = fs.readFileSync(new URL(p, import.meta.url), 'utf8');
  assert.match(t, /Plate Chiller 2/, 'the OakBarn Brewery two plate chiller loop');
  assert.ok(!/Fritz/.test(t), 'no personal name in Help');
}
assert.match(fs.readFileSync(new URL('../help/162-confirmation-widgets.md', import.meta.url), 'utf8'), /## A Sump Pump you plug in/);
console.log('icecan ok');
