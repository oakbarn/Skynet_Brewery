// Temperature Probe Add dialogs (Fritz, 2026-11-05: "Build the Probe Add Dialog Boxes using the Pump Drill down as the Template",
// Rule 18.26, Help 138). The probe type is still picked first ("Chooseing the Probe Type First like it is is fine").
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { elementTopic } from '../public/helpmap.js';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
assert.match(app, /const isProbeDev = e => e\?\.type === 'temperature' && !e\.integratedIn && !e\.template && !e\.kind;/, 'every probe but one built into an Integrated Device');
assert.match(app, /const isDrillDev = e => isPumpDev\(e\) \|\| isMbvDev\(e\)[^\n]* \|\| isProbeDev\(e\)[^\n]*;/);
const add = app.slice(app.indexOf('async function newDeviceDialog('), app.indexOf('// ---- Thermowell'));
assert.match(add, /const port = pr \? probePort\(e\)/, 'the Port is on the Interface line');
assert.match(add, /\.\.\.\(pr \? \[\.\.\.PROBE_GRAPHIC_FIELDS\(e, after\), \.\.\.PROBE_OWN\(e, after\)\] : \[\]\)/, 'Graphic, Orientation, its own set');
assert.match(add, /pr \? probeTitle\(e\)/, 'the Add box is titled with the probe');
assert.match(add, /if \(pr && !String\(work\.label \?\? ''\)\.trim\(\)\) work\.label = autoLabel\(PROBE_AUTO_LABEL\);/, 'Label auto fill tP_n (Rule 18.15)');
assert.match(add, /tap: pr \? undefined/, 'a probe has no Toggle');
const own = app.slice(app.indexOf('// ---- Temperature Probe Device dialogs'), app.indexOf('// Value, Time and DateTime Widget Properties'));
assert.ok(!/cover|imageOverlay|'tap'/i.test(own.replace(/\/\/.*$/gm, '')), 'no Cover, Toggle or Overlay on a probe');
assert.match(own, /\['rot', 'Orientation', 'vorient', EL_ROTATE, false, false, \{ tip: DEVICE_TIPS\.pOrient, with: \['_flip', 'Flip'/, 'Orientation and Flip on one line');
assert.match(own, /\['units', 'Units', 'sel'[^\n]*with: \['precision', 'Decimals'/, 'Units and Decimals on one line');
assert.match(own, /\['offset', 'Calibration offset', 'num', null, false, false, \{ tip: DEVICE_TIPS\.pOffset, dbPop: true/, 'Database and .API on the offset line');
assert.match(own, /\['_ptype', 'Probe type', 'ro', probeKindName\(it\), false, false, \{ tip: DEVICE_TIPS\.pType, attr: PROBE_TYPE_POP/, 'Probe type greyed out, its settings in a pop-up');
assert.match(own, /\['device', '2\. Interface \(board\)', 'dev', 'addnewid', false, false, \{ set: true/, 'Interface and Port set for good once added (Rule 18.13)');
assert.match(app, /if \(isProbeDev\(it\)\) return \[\.\.\.probeDeviceFields\(it, item\), \['typeCode', 'Device Type', 'ro'/, 'Properties: the drill-down, Device Type last');
assert.equal((app.match(/if \(!\(await newDeviceDialog\(e, 'Temp', probeTitle\(e\)\)\)\) return;/g) || []).length, 2, 'Thermowell and probe tee: 2a picks the probe type, then the Add box');
// the Flip pick
const flipFrom = w => { if (w._flip === undefined) return; w.flipH = w._flip.includes('h'); w.flipV = w._flip.includes('v'); if (!w.flipH) delete w.flipH; if (!w.flipV) delete w.flipV; delete w._flip; };
const w = { _flip: 'v' }; flipFrom(w); assert.deepEqual(w, { flipV: true });
// Help 138
for (const e of [{ type: 'temperature', sensor: 'ds18b20' }, { type: 'temperature', subtype: 'thermowell' }, { type: 'temperature', subtype: 'probeTee' }]) assert.deepEqual(elementTopic(e), ['temperature-probe-device-properties']);
assert.deepEqual(elementTopic({ type: 'temperature', integratedIn: 'g1' }), ['skynet-integrated-devices']);
assert.ok(fs.existsSync(new URL('../help/138-temperature-probe-device-properties.md', import.meta.url)));
console.log('probedialog tests passed');
