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
assert.match(add, /if \(pr && !String\(work\.label \?\? ''\)\.trim\(\)\) work\.label = probeAutoLabel\(work\.typeCode \|\| defaultCode\(e\)\);/, 'Label auto fill by kind (Rule 18.15)');
// Fritz, 2026-11-05: 10K NTC = _10KNTC_, One Wire = _1W_, RTD = _RTD_; other thermistors follow 10KNTC
{
  const { defaultCode } = await import('../public/naming.js');
  assert.match(app, /const PROBE_LABEL_CODE = \{ '100KNT': '100KNTC' \};/);
  assert.match(app, /const probeAutoLabel = code => autoLabel\(`\$\{PROBE_AUTO_LABEL\}_\$\{PROBE_LABEL_CODE\[code\] \|\| code \|\| 'NTC'\}`\);/);
  const lab = e => { const c = defaultCode({ type: 'temperature', ...e }); return `tP_${{ '100KNT': '100KNTC' }[c] || c}_1`; };
  assert.equal(lab({ sensor: 'ds18b20' }), 'tP_1W_1'); assert.equal(lab({ sensor: 'pt100' }), 'tP_RTD_1'); assert.equal(lab({ sensor: 'pt1000' }), 'tP_RTD_1');
  assert.equal(lab({ sensor: 'ntc', r0: 10000 }), 'tP_10KNTC_1'); assert.equal(lab({ sensor: 'ntc', r0: 50000 }), 'tP_50KNTC_1'); assert.equal(lab({ sensor: 'ntc', r0: 100000 }), 'tP_100KNTC_1');
  assert.equal(lab({ sensor: 'thermocouple' }), 'tP_TC_1'); assert.equal(lab({ sensor: 'lm35' }), 'tP_LM35_1'); assert.equal(lab({ sensor: 'tmp36' }), 'tP_TMP36_1');
}
assert.match(add, /tap: pr \? undefined/, 'a probe has no Toggle');
const ownAt = app.indexOf('// ---- Temperature Probe Device dialogs'), own = app.slice(ownAt, Math.min(...['// ---- Picture Widget', '// Value, Time and DateTime Widget Properties'].map(m => app.indexOf(m, ownAt)).filter(i => i > 0)));
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
// Fritz, 2026-11-05 (PR #231): the Add Device order for every Device. True PWM Devices get only PWM pins, the others only the
// pins that can't do PWM (the PWM pins only when none of those is free); the Interface has a default; a blank Label gets the focus.
{
  const { freePins } = await import('../public/naming.js');
  const devs = [{ name: 'Brewery Mega', id: 'BM' }], PWM = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '44', '45', '46'];
  const relay = freePins({ type: 'digitalOut', device: 'Brewery Mega', name: 'x' }, [], devs);
  assert.ok(relay.length && relay.every(p => !PWM.includes(p)), 'a relay: no PWM pins');
  const pwm = freePins({ type: 'pwmOut', device: 'Brewery Mega', name: 'x' }, [], devs);
  assert.ok(pwm.length && pwm.every(p => PWM.includes(p)), 'a PWM output: only PWM pins');
  assert.match(app, /work = \{ label: '', device: e\.device \?\? defaultIface\(devs\)/, 'the Interface has a default');
  assert.match(app, /\(lab && !String\(lab\.value \?\? ''\)\.trim\(\) \? lab : dv && !dv\.disabled/, 'blank Label first, else the Interface');
  console.log('add order tests passed');
}
// Fritz, 2026-11-05: no free PWM pin for a true PWM Device: 1. Add Interface, 2. Pseudo PWM (with what it loses)
{
  const { freePins, pseudoPwmOn, canPseudoPwm } = await import('../public/naming.js');
  const devs = [{ name: 'Brewery Mega', id: 'BM' }], PWM = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '44', '45', '46'];
  const ps = freePins({ type: 'pwmOut', pseudoPwm: true, device: 'Brewery Mega', name: 'x' }, [], devs);
  assert.ok(ps.length && ps.every(p => !PWM.includes(p)), 'Pseudo PWM: plain pins');
  assert.ok(canPseudoPwm({ type: 'pwmOut' }) && !canPseudoPwm({ type: 'analogOut' }), 'an analog output needs real PWM');
  assert.ok(pseudoPwmOn(50, 200) && !pseudoPwmOn(50, 700) && !pseudoPwmOn(0, 0) && pseudoPwmOn(100, 999), '50 % = on for half of each second');
  assert.match(app, /function pickNoPwm\(iface, pseudo\)/);
  assert.match(app, /1\. ➕ Add an Interface/); assert.match(app, /2\. Use Pseudo PWM on a plain pin/); assert.match(app, /What you lose:/);
  const hw = fs.readFileSync(new URL('../lib/hardware.js', import.meta.url), 'utf8');
  assert.match(hw, /if \(el\.pseudoPwm && canPseudoPwm\(el\)\) return `DO \$\{pinOf\(el\.channel\)\}/, 'the Brain switches the plain pin');
  assert.match(hw, /this\.pseudoTimer = setInterval\(\(\) => this\._pseudoTick\(\), 50\);/);
  console.log('pseudo pwm tests passed');
}
