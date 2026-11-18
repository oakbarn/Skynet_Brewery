// Panel Update Final 2 (OakBarn Brewery, 2026-11-18, the Hose Bib Widget dialog against the Blichmann Model; Rule 18.48, Help 87, 141, 148)
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
const fr = JSON.parse(fs.readFileSync(new URL('../public/hoverhelp-fr.json', import.meta.url), 'utf8'));
// #3 the Tab on the Hose Bib and Manual Valve dialogs, Layer Order under it, then 3. Name
const top = app.slice(app.indexOf('const MV_TOP = '), app.indexOf('const MV_CONFIRM'));
const order = ["'labelVisible'", "['workspace', '2. Tab', 'ws'", "'layer'", "['name', '3. Name', 'namechg'"].map(k => top.indexOf(k));
assert.ok(order.every((x, i) => x > 0 && (i === 0 || x > order[i - 1])), 'Label Visible, 2. Tab, Layer Order, 3. Name');
assert.ok(!top.includes("'2. Name'"), 'the Name is 3 now');
// #5 and #8 no Picture box and no IP box on the Hose Bib
const hb = app.slice(app.indexOf('const hbWidgetFields = '), app.indexOf('const mvWidgetFields = '));
assert.ok(!hb.includes("['image', 'Picture'"), 'no Picture box');
assert.ok(!hb.includes("['tapSpot', 'IP'"), 'no IP box');
assert.match(app, /return hbWidgetFields\(it\); \}/);
// the Straight Manual Valve keeps its Picture list
const mv = app.slice(app.indexOf('const mvWidgetFields = '), app.indexOf('const mvWidgetFields = ') + 1800);
assert.match(mv, /\['image', 'Picture', 'sel', pics/);
// #8 the IP is set by the pipe or hose, as on a Pump
assert.match(app, /function hbSpotHit\(ws, p, r, inside = false\)/);
assert.match(app, /const hb = hbSpotHit\(ws, p, r, inside\);\n  return hb && \(!best \|\| hb\.d < best\.d\) \? hb : best;/, 'every place that finds a pump spot finds a Hose Bib spot too');
assert.match(app, /if \(pipesOn\(`eq:\$\{g\.id\}:out`, ws\)\.length\) continue;/, 'once joined, it stays');
assert.match(app, /g\.tapSpot = hs\.code; p\[k\] = `eq:\$\{g\.id\}:out`;/, 'put down: its own IP');
assert.match(app, /const hs = hbspotOf\(id\); if \(hs\)/, 'drawn: the spot has a point');
// #6 Orientation short, as on the Pump
assert.match(hb, /pairCls: 'orientPair'/);
assert.match(css, /\.fldPair\.orientPair > select \{ flex: none; width: auto;/);
// Hover Help in French
for (const t of ['MV_TAB_TIP = ', "graphic: '⟪img:help_pictures/Hose_Bib_8_IPs.png⟫"]) assert.ok(app.includes(t), t);
assert.ok(Object.keys(fr).some(k => k.startsWith('⟪img:help_pictures/Hose_Bib_8_IPs.png⟫The Skynet picture of the Hose Bib')), 'Graphic tip in French');
assert.ok(fr['The Tab this Widget is on. Pick another Tab to move it there; the pipes and hoses joined to it stay on the old Tab, so draw new ones on the new Tab.'], 'Tab tip in French');
// the Rule and the Help
assert.match(rules, /^18\.48 \*\*Panel Update Final 2/m);
for (const f of ['141-tap-water-valve.md', 'fr/141-tap-water-valve.md', '87-pipe-fittings-and-manual-valves.md', 'fr/87-pipe-fittings-and-manual-valves.md', '148-every-device-dialog.md', 'fr/148-every-device-dialog.md'])
  assert.match(fs.readFileSync(new URL('../help/' + f, import.meta.url), 'utf8'), /18\.48/, f);
console.log('panel update 2 tests passed');
