// Motorized Ball Valve Add dialog (Fritz, 2026-11-05: "Create a Motorized Ball Valve Add Dialog using the Pump Drill Down Format.
// Valves do not have covers but every thing else the same.", Rule 18.23, Help 128).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { elementTopic } from '../public/helpmap.js';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
// one row in the Valves and On/Off lists, then step 2 picks the valve with its picture
assert.match(app, /const MBV = \['Motorized Ball Valve, open \/ closed \(relay\)', 'mbv', 'Valve'\]/);
assert.match(app, /\['onoff', 'On\/Off', \[[^\]]*MBV, \.\.\.SKY_DEV_ROWS\('digitalOut'\)/, 'On/Off has the Motorized Ball Valve row');
assert.match(app, /\['valves', 'Valves', \[MBV, \.\.\.SKY_DEV_ROWS\(\)/, 'Valves starts with the Motorized Ball Valve row');
assert.match(app, /\.filter\(t => !isMbvTpl\(t\.name\)\)/, 'the Skynet Motorized Ball Valve is not a row of its own any more');
assert.ok(!/const VALVE = \[/.test(app), 'the User Defined row is in the picker now');
assert.match(app, /const MBV_MODELS = \[\['Skynet Motorized Ball Valve', 'sky'.*\n\s*\['User Defined Motorized Ball Valve/, 'the picker has both valves');
assert.match(app, /function pickValve\(\) \{ return pickModel\('2\. Pick the valve', MBV_MODELS\); \}/);
assert.match(app, /if \(pick === 'mbv'\) \{[\s\S]{0,400}pickValve\(\)[\s\S]{0,300}extra = \{ template: MBV_TPL \}/, 'the Skynet pick makes a User version of its Template');
// the Pump's drill-down, no Cover
const add = app.slice(app.indexOf('async function newDeviceDialog('), app.indexOf('// ---- Thermowell'));
assert.match(add, /const dd = isDrillDev\(e\), mbv = isMbvDev\(e\)/);
assert.match(add, /\.\.\.\(mbv \? \[\.\.\.MBV_GRAPHIC_FIELDS\(e, after\), \.\.\.MBV_TOGGLE_OVERLAY\(e, after\), \.\.\.MBV_OWN\(\{ \.\.\.e, tapwater: false \}, after\)\] : \[\]\)/, 'Graphic, Path, Orientation + Toggle, Overlay, the three switches');
assert.match(add, /\.\.\.\(isPumpDev\(e\) \? \['cover'\] : \[\]\)/, 'only a pump saves a Cover');
assert.match(add, /mbv \? mbvTitle\(e\)/, 'the Add box is titled with the valve');
const own = app.slice(app.indexOf('const MBV_GRAPHIC_FIELDS'), app.indexOf("// a new Alarm's Name follows its Label"));
assert.ok(!/cover/i.test(own.replace(/\/\/.*$/gm, '')), 'no Cover on a valve (code, not comments)');
assert.match(own, /\['_orient', 'Orientation', 'vorient', skyOrientChoices\(it\), true/, 'a Skynet valve: Orientation picks its Template (Rule 5.17)');
assert.match(own, /\['tap', 'Toggle', 'sel', PUMP_TAP\(it\.tap\)/, 'Toggle works normally, Skynet valve too (Fritz, 2026-11-05)');
assert.match(own, /'vorient', skyOrientChoices\(it\), true, false, \{ tip: T\.vOrient, with: MBV_TOGGLE\(it\)/, 'Orientation and Toggle on one line, as the Pump\'s Cover and Toggle');
assert.match(own, /with: \[\['closeAll', 'On Close List', 'bool', true[^\]]*\], \['openAll', 'On Open List', 'bool', true/, 'Tap water, On Close List and On Open List on one line');
assert.match(own, /\['imageOverlay', 'Overlay', 'sel', OVERLAY_CHOICES\(it\.imageOverlay\), false, false, \{ tip: DEVICE_TIPS\.vOverlay, dbPop: true/, 'Overlay works normally, Database and .API on its line');
assert.ok(!/'ro'/.test(own.slice(own.indexOf('MBV_TOGGLE_OVERLAY'))) , 'nothing greyed out in Toggle / Overlay');
assert.match(own, /\['imageOff', 'Path \(closed\)', 'gpick', null, false, false, \{ tip: T\.vPath, attr: MBV_IP_POP/, 'a User Defined valve: its own pictures and IP spots (Rule 5.22)');
assert.match(own, /\['device', '2\. Interface \(board\)', 'dev', 'addnewid', false, false, \{ set: true/, 'Interface and Port greyed out with Change once added (Rule 18.13)');
assert.match(app, /if \(isMbvDev\(it\)\) return \[\.\.\.mbvDeviceFields\(it, item\), \['typeCode', 'Device Type', 'ro'/, 'Properties: the drill-down, Device Type last');
// which valves get it
const isMbvTpl = n => /^Skynet_Motorized_Ball_Valve_/.test(n || '');
assert.ok(isMbvTpl('Skynet_Motorized_Ball_Valve_VR') && !isMbvTpl('Skynet_Motorized_Butterfly_Valve_H'), 'not the butterfly valve (one dialog at a time, Rule 18.10)');
assert.match(app, /const isMbvDev = e => e\?\.type === 'digitalOut' && e\.subtype === 'valve' && !e\.kind && e\.valveType !== 'manual'/);
// Help 128
assert.deepEqual(elementTopic({ type: 'digitalOut', subtype: 'valve' }), ['motorized-ball-valve-device-properties']);
assert.deepEqual(elementTopic({ type: 'digitalOut', subtype: 'valve', template: 'Skynet_Motorized_Ball_Valve_H', templateCls: 'skynet' }), ['motorized-ball-valve-device-properties']);
assert.deepEqual(elementTopic({ type: 'digitalOut', subtype: 'valve', template: 'Skynet_Motorized_Butterfly_Valve_H', templateCls: 'skynet' }), ['skynet-device-templates']);
assert.ok(fs.existsSync(new URL('../help/128-motorized-ball-valve-device-properties.md', import.meta.url)));
console.log('mbvdialog tests passed');
// Fritz, 2026-11-05: the Interface and Port are the wiring: greyed out for good once added, no ✏ Change (Pumps too)
{
  const set = app.slice(app.indexOf("  if (x?.set && out[1]) {"), app.indexOf("  if (x && out[1]) {\n    const icons"));
  assert.ok(set.includes('i.disabled = true') && !set.includes("'✏ Change'") && !set.includes('i.disabled = false'), 'no ✏ Change beside the Interface and Port');
  console.log('fixed wiring tests passed');
}
// Fritz, 2026-11-05: in Edit layout a saved Orientation turns the picture on the Tab at once (not after Save layout)
{
  assert.match(app, /const v = editing \? \{ \.\.\.v0, image: e0\.backpath \?\? '', imageon: e0\.imageOn \?\? '', imageoff: e0\.imageOff \?\? '', imageoverlay: e0\.imageOverlay \?\? '' \} : v0/);
  console.log('edit layout picture tests passed');
}
