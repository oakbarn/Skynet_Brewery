// Motorized Ball Valve Add dialog (Fritz, 2026-11-05: "Create a Motorized Ball Valve Add Dialog using the Pump Drill Down Format.
// Valves do not have covers but every thing else the same.", Rule 18.23, Help 126).
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
assert.match(add, /\.\.\.\(mbv \? \[\.\.\.MBV_GRAPHIC_FIELDS\(e, after\), \.\.\.MBV_TOGGLE_OVERLAY\(e, after\)\] : \[\]\)/, 'Graphic, Path, Orientation, Toggle, Overlay');
assert.match(add, /\.\.\.\(isPumpDev\(e\) \? \['cover'\] : \[\]\)/, 'only a pump saves a Cover');
assert.match(add, /mbv \? mbvTitle\(e\)/, 'the Add box is titled with the valve');
const own = app.slice(app.indexOf('const MBV_GRAPHIC_FIELDS'), app.indexOf("// a new Alarm's Name follows its Label"));
assert.ok(!/cover/i.test(own.replace(/Cover\)|a Cover|no Cover/g, '')), 'no Cover on a valve');
assert.match(own, /\['_orient', 'Orientation', 'vorient', skyOrientChoices\(it\), true/, 'a Skynet valve: Orientation picks its Template (Rule 5.17)');
assert.match(own, /\['_tap', 'Toggle', 'ro'/, 'a Skynet valve: Toggle set by the Template (Rules 5.16, 5.18)');
assert.match(own, /\['_ovl', 'Overlay', 'ro', ovl, false, false, \{ tip: T\.vOverlaySet, dbPop: true/, 'a Skynet valve: Overlay set, Database and .API on its line');
assert.match(own, /\['imageOff', 'Path \(closed\)', 'gpick', null, false, false, \{ tip: T\.vPath, attr: MBV_IP_POP/, 'a User Defined valve: its own pictures and IP spots (Rule 5.22)');
assert.match(own, /\['device', '2\. Interface \(board\)', 'dev', 'addnewid', false, false, \{ set: true/, 'Interface and Port greyed out with Change once added (Rule 18.13)');
assert.match(app, /if \(isMbvDev\(it\)\) return \[\.\.\.mbvDeviceFields\(it, item\), \['typeCode', 'Device Type', 'ro'/, 'Properties: the drill-down, Device Type last');
// which valves get it
const isMbvTpl = n => /^Skynet_Motorized_Ball_Valve_/.test(n || '');
assert.ok(isMbvTpl('Skynet_Motorized_Ball_Valve_VR') && !isMbvTpl('Skynet_Motorized_Butterfly_Valve_H'), 'not the butterfly valve (one dialog at a time, Rule 18.10)');
assert.match(app, /const isMbvDev = e => e\?\.type === 'digitalOut' && e\.subtype === 'valve' && !e\.kind && e\.valveType !== 'manual'/);
// Help 126
assert.deepEqual(elementTopic({ type: 'digitalOut', subtype: 'valve' }), ['motorized-ball-valve-device-properties']);
assert.deepEqual(elementTopic({ type: 'digitalOut', subtype: 'valve', template: 'Skynet_Motorized_Ball_Valve_H', templateCls: 'skynet' }), ['motorized-ball-valve-device-properties']);
assert.deepEqual(elementTopic({ type: 'digitalOut', subtype: 'valve', template: 'Skynet_Motorized_Butterfly_Valve_H', templateCls: 'skynet' }), ['skynet-device-templates']);
assert.ok(fs.existsSync(new URL('../help/126-motorized-ball-valve-device-properties.md', import.meta.url)));
console.log('mbvdialog tests passed');
