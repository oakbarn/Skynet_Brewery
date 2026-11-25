// Panel Update Final 1 (OakBarn Brewery, 2026-11-18, the Manual Valve Widget and the Blichmann Model; Rule 18.45, Help 87, 141, 148)
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
// #1 State: a slider, mouse only, works the item at once (not a setting)
const st = app.slice(app.indexOf('function stateRow('), app.indexOf('function mvGraphic('));
assert.match(st, /tabindex: '-1', 'data-mouse-only': '1'/, 'mouse only');
assert.match(st, /await toggleManualValve\(obj\.id\)/, 'a Manual Valve: the same as a click on its Tab');
assert.match(st, /api\('POST', '\/ui\/set', \{ name: obj\.name, prop: 'state', value: want \}\)/, 'a Pump: On or Off at once');
assert.match(st, /const quiet = ev => ev\.stopPropagation\(\)/, 'not a change to the Properties');
assert.ok(app.includes("['_state', 'State', 'state', null, false, false, {}],      // On or Off now"), 'on the Pump');
// #2 and #3 the Change Name box and ✏ Change Name, mouse only; a Label change offers the Suggested Name on a blue pop-up
const nc = app.slice(app.indexOf('function nameChangeRows('), app.indexOf('function stateRow('));
assert.match(nc, /class: 'chgName', value: obj\[key\] \?\? '', tabindex: '-1', 'data-mouse-only': '1'/, 'starts with the Name now, mouse only');
assert.match(nc, /'✏ Change Name'/); assert.ok(!nc.includes('🏷 Update to Suggested Name'), 'no button (Rule 18.45 #2 changed 2026-11-25)'); assert.ok(nc.includes("undoNote(`The Label was changed. Change the Name to ${n}?`") && nc.includes("'✏ Change Name', 'blue')"), 'a blue pop-up offers ✏ Change Name');
assert.match(nc, /String\(lab\.value \?\? ''\) === label0/, 'pops up once the Label is changed');
assert.ok(app.includes("['name', '4. Name', 'namechg'"), 'the Pump (the Blichmann Model)');
assert.ok(app.includes("if (t.dataset.mouseOnly) return;") && app.includes('x.tabIndex >= 0);'), 'Enter never goes to a mouse-only box');
// #4 #5 the Graphic, Orientation and Left / Right
assert.match(app, /\['mvOrient', 'Orientation', 'sel'/); assert.match(app, /with: MV_FLIPS\(it, MV_TIPS\)/);      // Left / Right became the Flips (Panel Update 14)
assert.match(app, /const mvTransform = /);
assert.match(app, /if \(L\.flip\) ends = ends\.map\(\(\[fx, fy\]\) => \[1 - fx, fy\]\)/, 'its ends go with the mirror');
// #6 Straight and Hose Bib
assert.match(app, /isTapMv\(item\) \? 'Hose Bib Widget' : 'Manual Valve Widget'/);
assert.match(app, /const hbWidgetFields = /);
assert.match(app, /function hbLinkSvg\(g\)/, 'its own inside Hose or Pipe');
// #7 the ⛔ only on hover
assert.match(css, /background-size: var\(--dne, 0 0\)/);
assert.match(css, /dialog :is\(input, select, textarea\):disabled:hover[^{]*\{ --dne: 16px 16px; \}/);
for (const f of ['Manual_Valve_Orientation.png', 'Hose_Bib_IP_Spots.png']) assert.ok(fs.existsSync(new URL('../media/help_pictures/' + f, import.meta.url)), f);
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
assert.match(rules, /^18\.45 \*\*Panel Update Final 1/m);
// Follow-ups after testing PR #487 (2026-11-18)
// a Hose Bib may be Vertical (Left / Right); its IP on any of the 8 spots since Rule 18.49
assert.match(app, /const mvOrientOf = g => mvFront\(g\) \? 'h' : \['h', ?'v'\]\.includes\(g\.mvOrient\)/, 'a Hose Bib is not locked to Horizontal');
assert.match(app, /const hbSpotOk = \(g, k\) =>/);
// a left click on a QD hose end: the hold-then-drag pop-up (was Move with Held Right Click until 2026-11-24, Rule 2.9) (after a moment, so a double-click opens the hose instead)
assert.match(app, /'Hold the left button a moment, then drag'/);
assert.match(app, /qdHintWait = setTimeout\(\(\) => \{ qdHintWait = null; qdLeftHint\(at\); \}, 320\)/);
assert.match(css, /\.qdHint \{/);
// a double-click outside Edit layout: a hose end's ring opens the hose, an IP opens its Device or Widget
const dbl = app.slice(app.indexOf('function ipOwnerAt('), app.indexOf('function ipOwnerAt(') + 2200);
assert.match(dbl, /return openProps\('gfx', end\.dataset\.gid\)/, 'the yellow ring: the hose');
assert.match(dbl, /if \(best\.dataset\.eq\) return \['gfx', best\.dataset\.eq\]/); assert.match(dbl, /if \(best\.dataset\.dev\) return \['el', best\.dataset\.dev\]/);
assert.match(dbl, /g\.attachTo && L\(\)\.graphics\.some\(x => x\.id === g\.attachTo\) \? \['gfx', g\.attachTo\]/, 'a Vessel IP: the Vessel');
// State on every On / Off Device; Change Name on every saved Device and Widget (not the Add box)
assert.match(app, /kind === 'el' && item\.type === 'digitalOut' && fields1 \?/);
assert.match(app, /if \(key === 'name' && kind === 'text' && obj\._ref && obj\.type && \(S\.types \|\| \[\]\)\.includes\(obj\.type\) && hasSuggestion\(obj\)/);
assert.match(app, /if \(!isMv\(obj\) && !\(obj\._ref && String\(obj\[key\] \?\? ''\)\.trim\(\)\)\) return fieldOne\(\[key, label, 'text'\], obj\);/, 'a new Build: the Name typed as before');
// the Hose Bib and Manual Valve dialogs in the Blichmann Model's order
const mvTop = app.slice(app.indexOf('const MV_TOP = '), app.indexOf('const MV_CONFIRM'));
const order = ["'_state'", "'label'", "'labelVisible'", "'layer'", "'name'", 'mvSugNote(it)'].map(k => mvTop.indexOf(k));
assert.ok(order.every((x, i) => x > 0 && (i === 0 || x > order[i - 1])), 'State, Label, Label Visible, Layer Order, Name, Suggested Name');
assert.match(app, /const MV_HEAD = \[\['locked', '', 'lock', null, false, false, \{ inTitle: true \}\]/, 'the lock in the title line');
const hb = app.slice(app.indexOf('const hbWidgetFields = '), app.indexOf('const mvWidgetFields = '));
const hbo = ["'_mvpv'", "'mvOrient'", "'tapLink'", 'MV_CONFIRM', 'MV_XYWH', 'wgtType('].map(k => hb.indexOf(k));      // no Picture or IP box since Rule 18.48
assert.ok(hbo.every((x, i) => x > 0 && (i === 0 || x > hbo[i - 1])), 'Graphic, Orientation, Hose or Pipe, .confirmation, X Y W H, Widget Type');
assert.match(rules, /\*An IP and a hose end are part of their parent\* \(OakBarn Brewery, 2026-11-18: "double Clicking on an IP/);
console.log('panel update 1 tests passed');
