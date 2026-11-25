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
assert.match(app, /const MBV_MODELS = \[\['Skynet Motorized Ball Valve', 'sky'.*\n(?:\s*\/\/.*\n)*\s*\['➕ New User Defined Motorized Ball Valve/, 'the picker has both valves; the User Defined row says ➕ New (it makes one, OakBarn Brewery 2026-11-18)');
assert.match(app, /function pickValve\(\) \{ return pickModel\('2\. Pick the valve', MBV_MODELS\); \}/);
assert.match(app, /if \(pick === 'mbv'\) \{[\s\S]{0,400}pickValve\(\)[\s\S]{0,300}extra = \{ template: MBV_TPL \}/, 'the Skynet pick makes a User version of its Template');
// the Pump's drill-down, no Cover
const add = app.slice(app.indexOf('async function newDeviceDialog('), app.indexOf('// ---- Thermowell'));
assert.match(add, /const dd = isDrillDev\(e\), mbv = isMbvDev\(e\)/);
assert.match(add, /\.\.\.\(mbv \? \[\.\.\.MBV_GRAPHIC_FIELDS\(e, after\), \.\.\.MBV_TOGGLE_OVERLAY\(e, after\), \.\.\.MBV_OWN\(\{ \.\.\.e, tapwater: false \}, after\)\] : \[\]\)/, 'Graphic, Path, Orientation + Toggle, Overlay, the three switches');
assert.match(add, /\.\.\.\(isPumpDev\(e\) \? \['cover'(, 'coverColor')?(, '\w+')*(, \.\.\.PUMP_TYPE_KEYS)?\] : \[\]\)/, 'only a pump saves a Cover (and its Model, Power, Speed: Rule 18.32)');
assert.match(add, /mbv \? mbvTitle\(e\)/, 'the Add box is titled with the valve');
const own = app.slice(app.indexOf('const MBV_GRAPHIC_FIELDS'), app.indexOf("// a new Alarm's Name follows its Label"));
assert.ok(!/cover/i.test(own.replace(/\/\/.*$/gm, '')), 'no Cover on a valve (code, not comments)');
assert.match(own, /\['_orient', 'Orientation', 'vorient', skyOrientChoices\(it\), true/, 'a Skynet valve: Orientation picks its Template (Rule 5.17)');
assert.match(own, /\['tap', 'Toggle', 'sel', ONE_CLICK_TAP\(it\.tap\)/, 'Toggle works normally, Skynet valve too (Fritz, 2026-11-05); Toggle or Push Button, no None (Rule 2.46)');
assert.match(own, /'vorient', skyOrientChoices\(it\), true, false, \{ tip: T\.vOrient, with: MBV_FLIPS\(it\)/, 'Orientation with Flip Horizontal and Flip Vertical on one line (Panel Update 14)');
assert.match(own, /with: \[\['closeAll', 'On Close List', 'bool', true[^\]]*\], \['openAll', 'On Open List', 'bool', true/, 'Tap water, On Close List and On Open List on one line');
assert.match(own, /\['imageOverlay', 'Overlay', 'sel', OVERLAY_CHOICES\(it\.imageOverlay, it\), false, false, \{ tip: DEVICE_TIPS\.vOverlay, dbPop: true/, 'Overlay works normally, Database and .API on its line');
assert.ok(!/'ro'/.test(own.slice(own.indexOf('MBV_TOGGLE_OVERLAY'))) , 'nothing greyed out in Toggle / Overlay');
assert.match(own, /\['imageOff', 'Path', 'gpick', null, false, false, \{ tip: T\.vPath, attr: MBV_IP_POP/, 'a User Defined valve: its own picture and IP spots (Rule 5.22)');
// Rule 18.43 (OakBarn Brewery, 2026-11-18): the 3 Vessel valve pictures first; one picture (the On Overlay shows open); Horizontal,
// Vertical Left or Right. An old valve keeps its open picture, Front or 45 degrees (Never Take Away).
assert.match(own, /\.\.\.\(it\.imageOn \? \[\['imageOn', 'Path \(open\)'/, 'Path (open) only on a valve that already has an open picture');
assert.match(app, /const MBV_ORIENT = v => \[[^\n]*\['h', 'Horizontal'\], \['vl', 'Vertical'\],\n  \.\.\.\(v === 'v' \? \[\['v', 'Vertical \(as drawn\)'\]\] : \[\]\),\n  \.\.\.\(v === 'l45'/, 'User Defined: Horizontal or Vertical with the Flips (Panel Update 14); plain Vertical and the 45s only when already set');
assert.match(app, /const ORIENT_MAIN = \['H', 'VL'\];/, 'Skynet valve: Horizontal and Vertical, the Flips do the rest (Panel Update 14)');
assert.ok(app.includes("function skyVrToV(it)"), 'a valve saved as Vertical Right shows as Vertical with Flip Horizontal');
assert.match(app, /filter\(x => ORIENT_MAIN\.includes\(end\(x\)\) \|\| now\.has\(x\.name\)\)/, 'Front and Front Elbow only when the valve already sits that way');
assert.match(app, /const MBV_MODELS = \[\['Skynet Motorized Ball Valve', 'sky', 'Images\/Skynet\/Valves\/Motorized_TC15_Ball_Valve_Horizontal\.svg'\]/, 'the 3 Vessel picture in the Add list');
assert.match(app, /'➕ New User Defined Motorized Ball Valve[^']*', 'user', 'Images\/Skynet\/Valves\/Motorized_TC15_Ball_Valve_Vertical\.svg'\]/);
assert.match(app, /valve: \{ type: 'digitalOut', subtype: 'valve', [^\n]*imageOff: 'Images\/Skynet\/Valves\/Motorized_TC15_Ball_Valve_Vertical\.svg'/, 'a new valve starts with the 3 Vessel picture');
assert.match(app, /F\.propValve\.filter\(x => x\[0\] !== 'imageOn' \|\| it\.imageOn\)/, 'proportional valve: one picture');
assert.match(own, /\['device', '2\. Interface', 'dev', 'addnewid', false, false, \{ set: true/, 'Interface and Port greyed out with Change once added (Rule 18.13)');
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
  assert.match(app, /const v = editing \? \{ \.\.\.v0, image: e0\.backpath \?\? '', imageon: e0\.imageOn \?\? '', imageoff: e0\.imageOff \?\? '', imageoverlay: e0\.imageOverlay \?\? '', setgraphic: '' \} : v0/);
  console.log('edit layout picture tests passed');
}
// Fritz, 2026-11-05 (Rule 18.15 changed): a new valve's Label starts as mBV_n; Pumps don't auto fill
{
  assert.match(app, /if \(mbv && !String\(work\.label \?\? ''\)\.trim\(\)\) work\.label = autoLabel\('mBV'\);/);
  assert.ok(!/isPumpDev\(e\)[^\n]*autoLabel/.test(app), 'no Label auto fill on a Pump');
  console.log('valve label auto fill tests passed');
}
// The Motorized Ball Valve brought to the Blichmann Model (OakBarn Brewery, 2026-11-18: "fix all dialogs Now (exception) to the
// Blickmann Model Standard", Rule 18.41)
{
  const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
  const profiles = fs.readFileSync(new URL('../lib/profiles.js', import.meta.url), 'utf8');
  const server = fs.readFileSync(new URL('../server.js', import.meta.url), 'utf8');
  assert.match(app, /\['_pv', 'Graphic', 'devpic', null, false, false, \{ tip: T\.vGraphic, cls: 'mbvModel'/, 'the valve\'s Graphic marks the Model dialog');
  for (const part of ['', ' .dlgHead', ' .dlgBottomBar']) assert.ok(css.includes(`dialog#dlg:has(#dlgBody .mbvModel)${part}`), 'frozen top, no bottom row: ' + (part || 'dialog'));
  assert.match(css, /dialog#dlg:has\(#dlgBody \[data-k="pumpModel"\]\), dialog#dlg:has\(#dlgBody \.mbvModel\) \{ width: min\(680px, 94vw\); \}/, 'as wide as the pump dialog');
  assert.match(app, /const onModelDialog = \(\) => !!document\.querySelector\('dialog#dlg\[open\]'\)/, 'its ⬢ and ⬆ pop-ups: frozen top with Keep (every dialog now, Rule 18.44)');
  assert.match(app, /const pumpFocus = dd && \(isPumpDev\(e\) \|\| mbv\)/, 'the Rule 18.38 focus order');
  assert.match(app, /if \(pumpFocus && mbv && filled && ps && !ps\.disabled && ps\.offsetParent !== null\) ps\.focus\(\)/, 'its Label starts filled in, so the focus starts on the Port');
  assert.match(app, /\.\.\.\(isPumpDev\(e\) \|\| mbv \? PUMP_XYWH\(after\)/, 'Add box: X, Y, Width, Height on one line');
  assert.match(app.slice(app.indexOf('function mbvDeviceFields('), app.indexOf('// ---- PWM / Analog out Device Properties')), /\.\.\.PUMP_XYWH\(\)\]/, 'Properties: X, Y, Width, Height on one line');
  assert.match(profiles, /valve: \{ title: 'Valve Profile'[^\n]*alwaysDefault: true, defaultName: 'Default Valve Profile'/, 'always one Default Valve Profile');
  assert.match(server, /brewProfiles\.valve\.ensureDefault\(\)/);
  assert.match(app, /\['pump', 'valve'\]\.includes\(kind\) && \(S\[kind \+ 'Profiles'\] \|\| \[\]\)\.length \? \[\] : \[\['', '\(none\)'\]\]/, 'no (none) Valve Profile');
  console.log('valve blichmann model tests passed');
}
// Rule 18.42 (OakBarn Brewery, 2026-11-18: "Adapt it"; "Adapt from Blickmann for any Hover Help not found"): the valve's balloons
// are the Pump's, with the valve in the examples and its own pictures
{
  for (const k of ['LABEL_VALVE_TIP', 'IFACE_VALVE_TIP', 'TAB_VALVE_TIP', 'DEVTYPE_VALVE_TIP', 'NAME_VALVE_TIP', 'NAME_STANDARD_VALVE']) assert.match(app, new RegExp(`const ${k} = `), k);
  const blk = app.slice(app.indexOf('const NAME_STANDARD_VALVE = '), app.indexOf('const portTip = e =>'));
  assert.ok(!/Red Pump|DO@Pump|Red~Pump/.test(blk), 'no pump left in the valve balloons');
  assert.match(blk, /BM_15_DO@Valve_E_Mash~Valve_BH/); assert.match(blk, /help_pictures\/Valve_Daisy_Chain\.png/); assert.match(blk, /help_pictures\/Mash_Valve_Label\.png/);
  assert.match(app, /const ifaceTip = e => isPumpDev\(e\) \? IFACE_PUMP_TIP : isMbvDev\(e\) \? IFACE_VALVE_TIP/);
  assert.match(app, /if \(dev && isMbvDev\(o\)\) return LABEL_VALVE_TIP;/);
  assert.match(app, /\{ set: true, tip: ifaceTip\(it\), with: \['channel', 'Available Ports', 'pinsel', 'digital', false, false, \{ tip: portTip\(it\) \}\], attr: DEV_PORT_POP \}/, 'Properties use them too');
  for (const f of ['Valve_Daisy_Chain.png', 'Mash_Valve_Label.png', 'Mash_Valve_Label.svg']) assert.ok(fs.existsSync(new URL('../media/help_pictures/' + f, import.meta.url)), f);
  const lic = fs.readFileSync(new URL('../docs/Media_Licenses.csv', import.meta.url), 'utf8');
  assert.ok(lic.includes('Valve_Daisy_Chain.png') && lic.includes('Mash_Valve_Label.png'), 'Media_Licenses rows (Rule 9.12)');
  assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /^18\.42 \*\*Hover Help not written yet is adapted/m);
  console.log('valve balloons (Rule 18.42) ok');
}

// one picture, four looks (Panel Updates 6, Rule 18.43): its own file, run from here so package.json's one-line test list is not touched
await import('./userlook.test.js');
