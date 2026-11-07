// Configuration + live element values.
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { coerce, defaultFor, plain, TimeVal, toStr } from './values.js';
import { assignIds, checkIds, portSharers, SHARED_PORT_TYPES } from '../public/naming.js';
import { TB_ATTRS, tbAlign, tbPixels, tbFont, FONTS } from '../public/textbox.js';
import { skynetGroupOf } from './picgroups.js';
import { addKeys, KEY } from './keys.js';
import { linkClones } from './clones.js';
import { toGStandard, sharedToGGlobal } from './gstandard.js';
import { onceToGroups } from './dbgroups.js';
import { toSafeNames } from './namechars.js';
import { straightenPipes } from './pipes.js';
import { flowStandard } from '../public/flowcolor.js';
import { SEMI_CONTROL_TYPES, hasDeviceControlled, onOffProp, controlledName, NONE as SEMI_NONE, PULSE_MS } from '../public/semi.js';
import { isHeatElem, heatMethodKey, heatMethodWord, startMethod, ALL_HEAT_SETTINGS, heatDefault, methodWords, allowedMethods, allowedWords } from '../public/heatmethod.js';
const PICTURE = /\.(png|jpe?g|gif|svg|webp|bmp|ico)$/i;

export const ELEMENT_TYPES = ['gGlobal', 'digitalOut', 'switch', 'digitalIn', 'temperature', 'analogIn', 'timer', 'alarm', 'label', 'picture',
  'pwmOut', 'dutyCycle', 'hysteresis', 'pid', 'deadband', 'analogOut', 'flowMeter', 'scale', 'manual', 'stepper', 'soundPlayer',
  // Semi_Widgets_Devices (Fritz, 2026-11-02, public/semi.js): switch (above) and these. The Manual Valve Widget is one too (below).
  'pushButton', 'pulseButton', 'led',
  // Value, Time and DateTime Widgets (Fritz, 2026-11-05, Rule 1.23): show one value on a Tab, typed in by a tap; database and .API
  'valueWidget', 'timeWidget', 'dateTimeWidget'];
// the data type each one holds
export const DATA_WIDGETS = { valueWidget: 'value', timeWidget: 'time', dateTimeWidget: 'datetime' };
export const isDataWidget = el => !!el && el.type in DATA_WIDGETS;

// Alarm kinds (Fritz, 2026-10-05). Only one sound plays at a time: the lowest priority number wins,
// the others wait (or pause) and play as soon as they are the highest one left.
export const ALARM_KINDS = {
  hop: { priority: 1, label: 'Hop Alarm (1: beats every other sound)' },
  brewflow: { priority: 2, label: 'Brew Flow Alarm (2: end of mash, start of boil ...)' },
  prehop: { priority: 3, label: 'Pre-Hop Alarm (3: a set time before its Hop Alarm)' },
  general: { priority: 4, label: 'General Alarm (4)' },
  sound: { priority: 5, label: 'Sound only (5: music, beeps; pauses for any alarm)' },
};
export const SOUND_TYPES = ['alarm', 'soundPlayer'];
export const SOUND_PLAYER = 'SoundPlayer';         // the built-in Sound Player every Process can use
export const soundPriority = el => el.type === 'soundPlayer' ? 5 : (ALARM_KINDS[el.kind] ?? ALARM_KINDS.general).priority;
// Devices whose readings come from the PLC: scripts cannot set these properties
export const INPUT_PROPS = { digitalIn: ['state', 'raw'], temperature: ['value', 'fault'], analogIn: ['value', 'raw', 'fault'], flowMeter: ['rate'], scale: ['value', 'raw'],
  stepper: ['position', 'steps', 'moving', 'homed'] };

// Variable class (Fritz, 2026-10-30): gGlobal, the one class for every global variable. It was two classes, gKonstant and
// gAPI (vKonstant / vAPI until 2026-10-28). Going to the database and being reached by outside programs are now attributes
// that every Device and Widget has (.database and .API), so gAPI had no job left. Older Schemas become gGlobal with gG names
// when they load (lib/gstandard.js). (The old BruControl Global class is gone too: lib/globals.js moves them.)
// kind -> data type, and the suggested name prefix (a hint only, never enforced)
export const G_KINDS = {
  graphic: { dataType: 'string', prefix: 'gG_', label: 'gG_Global_Graphic', variable: true },
  string: { dataType: 'string', prefix: 'gGS_', label: 'gS_Global_String', variable: true },
  longstring: { dataType: 'string', prefix: 'gGL_', label: 'Long String (text file)' },
  value: { dataType: 'value', prefix: 'gGV_', label: 'gV_Global_Value', variable: true },
  time: { dataType: 'time', prefix: 'gGT_', label: 'gT_Global_Time', variable: true },
  datetime: { dataType: 'datetime', prefix: 'gGDT_', label: 'gD_Global_DateTime', variable: true },
  bool: { dataType: 'bool', prefix: 'gGB_', label: 'gB_Global_Boolean', variable: true },
  switch: { dataType: 'bool', prefix: 'gGSW_', label: 'Switch (slider that toggles: tap ON, tap again OFF)' },
  pushbutton: { dataType: 'bool', prefix: 'gGPB_', label: 'Push Button (ON while held, OFF when released)' },
  momentary: { dataType: 'bool', prefix: 'gGMB_', label: 'Pulse Button (one 100 ms pulse per tap)' },
  // a dropdown: each choice has a Value (what Processes read and trigger on) and a Text (what the dropdown shows)
  list: { dataType: 'value', prefix: 'gGList_', label: 'List (dropdown: Value + Text)' },
  // shows the step ("1.00003  Mash in") a Process of its class (Flow unless set) just reached: lib/scaffold.js
  step: { dataType: 'string', prefix: 'gGStep_', label: 'Step (shows the Process step reached)' },
};
export const isVar = el => el && el.type === 'gGlobal';     // Shared Variables became gGlobals (2026-11-07, lib/gstandard.js)
// .API (Fritz, 2026-10-30): off, get (outside programs may read it) or getput (they may read and change it)
export const API_MODES = ['off', 'get', 'getput'];
export const apiOf = el => API_MODES.includes(el?.api) ? el.api : 'off';
const isButton = el => el.type === 'gGlobal' && (el.kind === 'pushbutton' || el.kind === 'momentary');
const isLong = el => el.type === 'gGlobal' && el.kind === 'longstring';
const isLongFile = el => isLong(el) && !!el.file;
// Elements that drive an output pin on/off (the control ones switch it themselves)
export const PIN_OUTPUTS = ['digitalOut', 'dutyCycle', 'hysteresis', 'pid', 'deadband'];
const STEPPER_COMMANDS = ['target', 'move', 'run', 'stop', 'home', 'reset'];
export const CONTROL_TYPES = ['pwmOut', 'dutyCycle', 'hysteresis', 'pid', 'deadband'];
// Valve type (Fritz, 2026-10-20): an Electro_Mechanical valve is switched by its board pin; a Manual one is turned by hand.
// A Process that opens or closes a Manual valve shows a pop-up and waits until someone confirms it was done (lib/engine.js).
// A Manual Valve Widget (Fritz, 2026-10-28) is one too: a valve drawn on a Tab (an IP of kind manualValve), no board pin.
// Its .state only changes with a click on it on its Tab (source 'ui'); a Process asks for it by hand and waits for that click.
export const MANUAL_VALVE_TYPE = 'manualValve';
export const isManualValveWidget = el => el?.type === MANUAL_VALVE_TYPE;
export const isManualValve = el => (el?.type === 'digitalOut' && el.subtype === 'valve' && el.valveType === 'manual') || isManualValveWidget(el);
export const isMvGraphic = g => g?.kind === 'ip' && g.fitting === 'manualValve';
// Tap water valve (Fritz, 2026-10-20): the valve sits on a tap water outlet, so opening it starts flow with no pump.
// my_Valve.tapwater (true / false) reads or changes it in a Process; the setting in the valve's properties is where it starts.
const isValve = el => el?.type === 'digitalOut' && el.subtype === 'valve';
// The Close all / Open all valve lists (Fritz, 2026-10-30, Rule 6.15): every valve a Process can switch (not a Manual one) is on
// both lists until its switch is turned off. A tap water valve is always on Close all and never on Open all.
const switchedValve = el => isValve(el) && el.valveType !== 'manual';
export const onCloseAll = el => switchedValve(el) && (!!el.tapwater || el.closeAll !== false);
export const onOpenAll = el => switchedValve(el) && !el.tapwater && el.openAll !== false;
// Pump covers (Fritz, 2026-11-02): my_Pump.cover = "Blue" puts a cover over a Skynet no-cover pump drawing, between its picture
// and its On overlay. None (the default), Red, Yellow, Blue, Green, Purple, Orange, White (RGB 250 250 250), or User, whose color is my_Pump.coverColor.
export const BOLT = 'Images/Skynet/On_Off/Overlay_Bolt.svg', BOLT_FLASH = 'Images/Skynet/On_Off/Overlay_Bolt_Flash.svg';
export const isPump = el => el?.type === 'digitalOut' && el.subtype === 'pump';
export const PUMP_COVER_CHOICES = ['None', 'Red', 'Yellow', 'Blue', 'Green', 'Purple', 'Orange', 'White', 'User'];
export function fixValveLists(el) {
  if (isValve(el) && el.tapwater) { delete el.closeAll; delete el.openAll; }      // fixed by onCloseAll / onOpenAll
}

// Typed runtime properties per element type (lower-case names)
const TYPE_PROPS = {
  gGlobal: { value: null, file: 'string' }, valueWidget: { value: null }, timeWidget: { value: null }, dateTimeWidget: { value: null },
  digitalOut: { state: 'bool' }, switch: { state: 'bool', device_controlled: 'string' },
  pushButton: { state: 'bool', device_controlled: 'string' }, pulseButton: { state: 'bool', device_controlled: 'string' }, led: { state: 'bool', device_controlled: 'string' }, digitalIn: { state: 'bool', raw: 'bool', count: 'value', reset: 'bool' },
  temperature: { value: 'value', fault: 'bool' }, analogIn: { value: 'value', raw: 'value', fault: 'bool' },
  analogOut: { value: 'value' }, flowMeter: { rate: 'value', total: 'value' },
  scale: { value: 'value', volume: 'value', raw: 'value', tare: 'bool', calibrate: 'value' },
  // Stepper motor: position / steps / moving / homed come from the board; a script sets target (go to), move (go by),
  // speed (for the next moves), run (keep turning at this speed, 0 = stop), stop, home (find the home switch), reset (here = home position)
  stepper: { position: 'value', steps: 'value', moving: 'bool', homed: 'bool', target: 'value', move: 'value', speed: 'value', run: 'value', stop: 'bool', home: 'bool', reset: 'bool' },
  timer: { value: 'time', running: 'bool', type: 'string', resetvalue: 'time' },
  // playing: this one's sound is the one playing now (set by the panel, never by a Process)
  // at: Hop Alarm sounds when its timer reaches this time; before: a Pre-Hop Alarm sounds this long before its Hop Alarm
  alarm: { active: 'bool', loop: 'bool', sound: 'string', fileindex: 'value', soundmode: 'string', playing: 'bool', at: 'time', before: 'time' },
  // Sound Player: path = the sound file, active = play / stop. It pauses while an alarm sounds and goes on after.
  soundPlayer: { path: 'string', active: 'bool', loop: 'bool', playing: 'bool' },
  label: {}, picture: {},
  // Manual vessel widget (BrewZilla, DigiBoil ...): app only. Scripts tell the brewer what to set by hand, the brewer confirms on screen
  manual: { setpoint: 'value', heat: 'bool', pump: 'bool', timer: 'time', volume: 'value', reading: 'value', message: 'string', waiting: 'bool', confirmed: 'bool' },
  pwmOut: { value: 'value' },
  dutyCycle: { dutycycle: 'value', interval: 'value', state: 'bool' },
  hysteresis: { target: 'value', onoffset: 'value', ondelay: 'value', state: 'bool' },
  pid: { target: 'value', kp: 'value', ki: 'value', kd: 'value', maxoutput: 'value', maxintegral: 'value', calctime: 'value', outtime: 'value', value: 'value', state: 'bool' },
  // Deadband (as in BruControl, Fritz 2026-11-05, Rule 6.17): output % steps up or down each Calc Time, never inside the deadband
  deadband: { target: 'value', deadbandoffset: 'value', innerbandoffset: 'value', initialoutput: 'value', innerbanddrive: 'value', outerbanddrive: 'value', maxoutput: 'value', calctime: 'value', outtime: 'value', value: 'value', state: 'bool' },
};
// One Heating Element, the heating method picked (Fritz, 2026-11-07, Rule 6.19, public/heatmethod.js). On a Heating Element
// .state (and .enabled, the same thing) is whether the heater is ON; .method says how it is controlled; .output is its pin right
// now (read only: a Duty Cycle, Hysteresis, PID or Deadband switches it); .value is the output % a PID or Deadband works out.
export const HEAT_PROPS = { method: 'string', output: 'bool', value: 'value', ...Object.fromEntries(ALL_HEAT_SETTINGS.map(s => [s[0], 'value'])) };
// the prop that drives a Heating Element's pin: .state when On/Off, .output when a control method runs it
export const pinProp = (el, r) => isHeatElem(el) && r && r.method && heatMethodKey(r.method) !== 'onoff' ? 'output' : 'state';
const COMMON_PROPS = {
  label: 'string', visibility: 'string', background: 'string', image: 'string',
  imageon: 'string', imageoff: 'string', imageoverlay: 'string', precision: 'value', enabled: 'bool', units: 'string',
  backpath: 'string', backpath_2: 'string', backpath_3: 'string',
};
// config key for each common runtime prop
const CFG_KEY = { imageon: 'imageOn', imageoff: 'imageOff', imageoverlay: 'imageOverlay', type: 'timerType' };

// Background pictures (Fritz, 2026-11-02, Rule 7.10): every Device and Widget has .backpath, .backpath_2 and .backpath_3
// (they were imagePath_1, _2, _3). .background picks which one shows: 1 = .backpath, 2 = .backpath_2, 3 = .backpath_3;
// 0 or any number over 3 shows no background picture; a blank .background is set to 0.
// A Process can also use the Skynet shortcut: my_widget.image = "Images/RedPump.png" sets .backpath and .background = 1.
// Every item has at most 3 (Fritz, 2026-11-02): a 4th path or more is dropped when the Schema loads.
// backpathsImported marks imported BruControl pictures (they fill the item).
export const BACKPATH = /^backpath(?:_(\d+))?$/i;
export const slotKey = n => n === 1 ? 'backpath' : 'backpath_' + n;       // the config key and the Process attribute are the same
export const slotOf = k => { const m = BACKPATH.exec(k); return m ? +(m[1] ?? 1) : 0; };
export const backpaths = el => Object.keys(el).filter(k => BACKPATH.test(k)).map(slotOf).filter(n => n >= 1).sort((a, b) => a - b);
// .background as a number: blank is 0 (Fritz, 2026-11-02). A color word stays a color (no picture).
export const bgValue = v => { const b = String(v ?? '').trim(); return b === '' ? '0' : b; };
const IS_NUM = /^-?\d+$/;
// Older configs (Rule 15.2, nothing old is kept): imagePath_N becomes backpath / backpath_N, a list "images" (BruControl
// import) and one "image" path become backpath, backpath_2 ...; a blank background becomes 1 when there is a picture (it
// showed the first picture before), else 0; a color in background with a picture moves to Back Colour so the picture still shows.
// A clock time in .database belongs only to At clock time and At a date and time (Fritz, 2026-11-04, Rule 6.14).
// Older settings (Rule 15.2): "Every 1 day at 12 AM" becomes At clock time 12 AM; on the other Every choices the clock
// time is dropped.
export function clockTimeOnly(d) {
  if (!d || typeof d !== 'object' || !d.at) return d;
  if (d.frequency === 'days' && (d.every === undefined || +d.every === 1)) { d.frequency = 'clock'; delete d.every; }
  if (!['clock', 'datetime'].includes(d.frequency)) delete d.at;
  return d;
}
export function toBackpaths(el, imported = false) {
  let old = false;
  for (const k of Object.keys(el)) {
    const m = /^imagepath_(\d+)$/i.exec(k);
    if (!m) continue;
    if (el[k] && +m[1] <= 3) el[slotKey(+m[1])] ??= el[k];
    delete el[k]; old = true;
  }
  if (Array.isArray(el.images)) {
    el.images.forEach((p, i) => { if (p && i < 3) el[slotKey(i + 1)] ??= p; });
    delete el.images; imported = true; old = true;
  }
  if (typeof el.image === 'string') { if (el.image) el.backpath ??= el.image; delete el.image; old = true; }
  if ('imagePathsLocked' in el) { if (el.imagePathsLocked) imported = true; delete el.imagePathsLocked; }
  if (imported) el.backpathsImported = true;
  for (const n of backpaths(el)) if (n > 3) delete el[slotKey(n)];      // only 3 background pictures (Fritz, 2026-11-02)
  // only an older item is changed here; on a new item a blank .background simply means 0
  if (old && backpaths(el).some(n => el[slotKey(n)])) {
    const b = String(el.background ?? '').trim();
    if (b === '') el.background = 1;
    else if (!IS_NUM.test(b)) { if (!el.bgColor) el.bgColor = b; el.background = 1; }
  }
  return el;
}
// Process text (Rule 15.2): .imagePath_1 -> .backpath, .imagePath_2 -> .backpath_2 ... (also the old "name" imagepath_1 spelling)
export const toBackpathText = text => String(text).replace(/(?<=[.\s"])imagepath_(\d+)\b/gi, (_, n) => slotKey(+n));
// Label (Fritz, 2026-10-27): the text shown on a Device or Widget is its "label" (it was "displayName"). Old configs
// move over on load. In a Process, label is the word; BruControl's displayname still works and means label.
export function toLabel(el) {
  if ('displayName' in el) { if (el.label === undefined || el.label === '') el.label = el.displayName; delete el.displayName; }
  return el;
}
// x_hPosition / y_vPosition (Fritz, 2026-10-28: x is horizontal, y is vertical, so nobody has to remember which):
// the names a Process uses for a place on the Tab. The old xPosition / yPosition still work, and so do the short
// .x / .xh and .y / .yv (Fritz, 2026-10-29, Text Widget Properties). .fore / .back are .foreColor / .backColor and
// .hiddenlock is .hidden.
const PROP_ALIAS = { displayname: 'label', x_hposition: 'xposition', y_vposition: 'yposition', x: 'xposition', xh: 'xposition', y: 'yposition', yv: 'yposition',
  fore: 'forecolor', back: 'backcolor', hiddenlock: 'hidden' };
const SHOWN_NAME = { xposition: 'x_hPosition', yposition: 'y_vPosition', covercolor: 'coverColor' };
const SOUND_MODES = ['custom', 'default', 'none'];
// The look of a device or widget (Fritz, 2026-10-20). It starts from the tab's Tab Background Profile and can be changed in its
// properties or by a Process, e.g. Pump_1.valueColor = "Red", Pump_1.nameAlign = "TopLeft", BK_Temp.valueType = "Gauge" (or "Dial", the Skynet Dial, Rule 2.40).
// "" puts back the look set in its properties.
const ALIGNS = ['TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight'];
const STATE_TYPES = ['digitalOut', 'switch', 'digitalIn', 'alarm', 'soundPlayer', 'pushButton', 'pulseButton', 'led'];
const hasState = el => STATE_TYPES.includes(el.type) || (isVar(el) && (el.dataType === 'bool' || el.kind === 'bool'));
const pick = (list, what) => (v, el) => {
  const t = toStr(v).trim(); if (!t) return '';
  const hit = list.find(x => x.toLowerCase() === t.toLowerCase());
  if (!hit) throw new Error(`"${el.name}": ${what} must be one of ${list.join(', ')}`);
  return hit;
};
// the BruControl names work too (Fritz: Name Fore Text Color, Value Background Text Color ...)
const LOOK_ALIAS = { nameforecolor: 'namecolor', namebackcolor: 'namebg', valueforecolor: 'valuecolor', valuebackcolor: 'valuebg' };
const LOOK_PROPS = {
  namecolor: v => toStr(v).trim().slice(0, 40), namebg: v => toStr(v).trim().slice(0, 40),
  valuecolor: v => toStr(v).trim().slice(0, 40), valuebg: v => toStr(v).trim().slice(0, 40),
  namealign: pick(ALIGNS, 'nameAlign'), valuealign: pick(ALIGNS, 'valueAlign'),
  valuetype: (v, el) => {
    const t = pick(['LED', 'Text', 'Gauge', 'Dial'], 'valueType')(v, el).toLowerCase();
    if ((t === 'gauge' || t === 'dial') && hasState(el)) throw new Error(`"${el.name}" has an ON / OFF state, so its valueType can only be LED or Text`);
    return t;
  },
  digits: (v, el) => { const d = toStr(v).trim() === '' ? '' : Math.round(Number(v)); if (d !== '' && !(d >= 1 && d <= 12)) throw new Error(`"${el.name}": digits must be 1 to 12`); return d; },
  // text box attributes (public/textbox.js): the whole item's text, its size and its place on the Tab
  forecolor: v => toStr(v).trim().slice(0, 40), backcolor: v => toStr(v).trim().slice(0, 40),
  alignment: (v, el) => { const a = tbAlign(v); if (a === null) throw new Error(`"${el.name}": alignment must be Left, Center or Right`); return a; },
  width: px('width', 1), height: px('height', 1), xposition: px('xPosition', 0), yposition: px('yPosition', 0),
};
function px(what, min) {
  return (v, el) => { const n = tbPixels(v); if (n === null || (n !== '' && n < min)) throw new Error(`"${el.name}": ${what} must be a number of pixels${min ? ' above 0' : ', 0 or more'}`); return n; };
}
// the text box attributes start empty: the item shows what its properties say until a Process changes one
const TB_START = { forecolor: '', backcolor: '', alignment: '', width: '', height: '', xposition: '', yposition: '' };
// an empty size or place reads as the one in its properties (Text_1.width is 220, not "")
const GEOM_KEY = { width: 'w', height: 'h', xposition: 'x', yposition: 'y' };
const GEOM_DFLT = { w: 120, h: 60, x: 0, y: 0 };
// Text added with "+ Text" in Edit layout is a Text Widget a Process can change too. A new one is named w_Text_1, w_Text_2 ...
// (Fritz, 2026-10-29); the name can be changed with ✏ Change name like any other (Rule 3.11). Older Schemas named them
// Text_1, Text_2 ...: under Rule 15.2 those become w_Text_1 ... once (old name -> new name is returned, so the Processes follow).
export const TEXT_TYPE = 'text';
export const TEXT_PREFIX = 'w_Text_';
export function nameTexts(graphics, taken = []) {
  const used = new Set([...taken, ...graphics.map(g => g.name)].filter(Boolean).map(n => String(n).toLowerCase()));
  const renames = new Map();
  for (const g of graphics) {
    if (g.kind !== 'text') continue;
    const old = /^Text_(\d+)$/.exec(g.name ?? '');
    if (g.name && !old) continue;
    let n = old && !used.has((TEXT_PREFIX + old[1]).toLowerCase()) ? +old[1] : 1;
    while (used.has((TEXT_PREFIX + n).toLowerCase())) n++;
    if (old) { renames.set(g.name, TEXT_PREFIX + n); used.delete(g.name.toLowerCase()); }
    g.name = TEXT_PREFIX + n; used.add(g.name.toLowerCase());
  }
  return renames;
}
// The Text Widget's attributes a Process can use (Fritz, 2026-10-29), besides .text (.value = .text) and the text box ones
// (TB_ATTRS). Each one starts empty (''), which reads as what its Properties say; "" in a Process puts that back.
// attribute -> [its key in the Properties, its kind]
export const TEXT_ATTRS = {
  label: ['label', 'string'], label_visible: ['labelVisible', 'bool'], font_label: ['labelFont', 'font'], size_label: ['labelSize', 'size'],
  fore_label: ['labelColor', 'color'], back_label: ['labelBg', 'color'], bold_label: ['labelBold', 'bool'], alignment_label: ['labelAlign', 'align'],
  font: ['font', 'font'], size: ['fontSize', 'size'], bold: ['bold', 'bool'], tab: ['workspace', 'tab'], lock: ['locked', 'bool'],
};
const TEXT_START = Object.fromEntries(Object.keys(TEXT_ATTRS).map(k => [k, '']));
const fontName = css => FONTS.find(([c]) => c && c === css)?.[1].replace(/\s*\(.*\)$/, '') ?? '';

// Manual Valve Widgets have fixed names too: ManualValve_1, ManualValve_2 ... for older ones; new ones are wgt_MV_Label_TabID or
// wgt_TWV_Label_TabID (Fritz, 2026-11-06, Rule 3.14), as the Edit layout gives them
export function nameManualValves(graphics, taken = []) {
  const used = new Set([...taken, ...graphics.map(g => g.name)].filter(Boolean).map(n => String(n).toLowerCase()));
  for (const g of graphics) {
    if (!isMvGraphic(g) || /^(ManualValve_|wgt_MV_|wgt_TWV_)/.test(g.name ?? '')) continue;      // wgt_MV_ / wgt_TWV_: the Widget names (Rule 3.14)
    let n = 1; while (used.has('manualvalve_' + n)) n++;
    g.name = 'ManualValve_' + n; used.add('manualvalve_' + n);
  }
}

export const cleanName = n => String(n ?? '').trim();
// Names have no spaces from now on (Fritz, 2026-10-05): "Test Timer" -> Test_Timer, "sw_Advance_ BrewStatus" -> sw_Advance_BrewStatus
export const noSpaces = n => { n = cleanName(n); return /\s/.test(n) ? n.replace(/_*\s+_*/g, '_') : n; };

// The main value of each type: what the name alone means in a Process (Pump_Red = true, alm_Hops == false, Kettle_SP = 185.5)
const MAIN_PROP = { digitalOut: 'state', switch: 'state', pushButton: 'state', pulseButton: 'state', led: 'state', digitalIn: 'state', dutyCycle: 'state', hysteresis: 'state', alarm: 'active', soundPlayer: 'active', flowMeter: 'rate' };
const NO_MAIN = ['label', 'picture', 'manual'];
MAIN_PROP[MANUAL_VALVE_TYPE] = 'state';
export const mainProp = el => !el || NO_MAIN.includes(el.type) ? null : (isVar(el) ? 'value' : MAIN_PROP[el.type] ?? 'value');
// Attributes written with a dot (name.visible), for autofill and Help. Two-choice ones are true/false.
export function attrsOf(el) {
  if (!el) return [];
  return attrKeys(el).map(a => SHOWN_NAME[a] ?? a);
}
function attrKeys(el) {
  const own = Object.keys(TYPE_PROPS[el.type] ?? {}).filter(p => !(isVar(el) && p === 'value') && p !== mainProp(el));
  if (el.type === 'timer') own.push('countdown');
  if (isValve(el)) own.push('tapwater');
  if (isPump(el)) own.push('cover', 'covercolor');
  if (isHeatElem(el)) own.push(...Object.keys(HEAT_PROPS));
  if (el.type === TEXT_TYPE) return ['text', ...TB_ATTRS, ...Object.keys(TEXT_ATTRS)].sort();
  if (isManualValveWidget(el)) return [];
  // a Heating Element is turned On or Off, never "Enabled" (Fritz, 2026-11-07: "I prefer on and Off rather than enabled"); an old
  // .enabled line (BruControl, older Processes) still works, but it is not offered
  return [...new Set([...own, ...TB_ATTRS, ...Object.keys(COMMON_PROPS).filter(p => p !== 'visibility' && !(p === 'enabled' && isHeatElem(el)))])].sort();
}
// Which attributes take true / false (and the main value, as ''), so predictive text can offer true and false after the =
export function boolAttrs(el) {
  if (!el) return [];
  if (isManualValveWidget(el)) return ['', 'state'];
  const kinds = isVar(el) ? G_KINDS : null;
  const out = [];
  const main = mainProp(el);
  if (main && (kinds ? (el.dataType ?? kinds[el.kind]?.dataType) === 'bool' : TYPE_PROPS[el.type]?.[main] === 'bool')) out.push('');
  for (const a of attrKeys(el)) if (['visible', 'hidden', 'countdown', 'tapwater'].includes(a) || (el.type === TEXT_TYPE ? TEXT_ATTRS[a]?.[1] : TYPE_PROPS[el.type]?.[a] ?? COMMON_PROPS[a]) === 'bool') out.push(a);
  return out;
}
// A Heating Element's runtime: the method it starts with and every method's settings (its Properties, or the starting values)
function heatRuntime(el, r) {
  const k = startMethod(el);
  r.method = heatMethodWord(k); r.output = false; r.value = 0; r.enabled = r.state;
  for (const [p, key] of ALL_HEAT_SETTINGS) { const v = el[key]; r[p] = v === undefined || v === null || v === '' || !Number.isFinite(Number(v)) ? heatDefault(k, p) : Number(v); }
}
const coverName = v => PUMP_COVER_CHOICES.find(x => x.toLowerCase() === String(v ?? '').trim().toLowerCase()) ?? 'None';
const yes = v => v === true || /^(true|1|on|yes|visible|countdown)$/i.test(String(v ?? '').trim());

// Other places an older path may point to: oakbarn/ is the old name of Images/, sounds imported from BruControl used to
// sit in Images/wave/ (now sounds/), and a bare picture name (like the old brewery_main.png) and the sample drawings (samples/) now live in Images/.
export function mediaAliases(p) {
  const s = String(p ?? '').trim().replace(/\\/g, '/').replace(/^\.?\//, ''), out = [];
  const m = /^(oakbarn|images)(\/.*)$/i.exec(s);
  if (m) out.push((/^oakbarn$/i.test(m[1]) ? 'Images' : 'oakbarn') + m[2]);
  const sound = /\.(wav|mp3|ogg|m4a)$/i.test(s), name = s.slice(s.lastIndexOf('/') + 1);
  if (sound && !/^sounds\//i.test(s) && (/^(oakbarn|images)\/wave\//i.test(s) || !s.includes('/'))) out.push('sounds/' + name);
  if (!sound && !s.includes('/') && s) out.push('Images/' + s);
  if (/^samples\/[^/]+$/i.test(s)) out.push('Images/' + s);           // the sample drawings moved into Images/samples/
  const g = !sound && skynetGroupOf(name);                             // and then into Images/Skynet/<group> (2026-10-22)
  if (g && /^((images|oakbarn)\/(samples\/|[^/]+\/)?|samples\/)?[^/]+$/i.test(s) && !/^images\/skynet\//i.test(s)) out.push(`Images/Skynet/${g}/${name}`);
  return out;
}

// ---- saved gGlobal values (Rule 1.22) ----
const PERSIST_MS = 300, PERSIST_MAX_MS = 1000;
// Written so a power cut can't leave a half-written file: the new values go to state.json.tmp, are flushed to the disk,
// the last good state.json becomes state.json.bak, then the new file takes its place.
export function writeSafely(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  const fd = fs.openSync(tmp, 'w');
  try { fs.writeSync(fd, text); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  if (fs.existsSync(file)) { try { fs.copyFileSync(file, file + '.bak'); } catch { /* keep going */ } }
  // Works on every Brain (Pi, Linux, Mac, Windows; Rule 1.7). On Windows a virus checker can hold the file for a moment and
  // refuse the swap, so then the new values are copied over it instead.
  try { fs.renameSync(tmp, file); } catch { fs.copyFileSync(tmp, file); try { fs.unlinkSync(tmp); } catch { /* left for next time */ } }
}
// The saved values: state.json, or state.json.bak when state.json is missing or broken. Nothing saved yet: {}.
export function readState(file) {
  for (const f of [file, file + '.bak']) {
    try { const o = JSON.parse(fs.readFileSync(f, 'utf8')); if (o && typeof o === 'object' && !Array.isArray(o)) return o; } catch { /* next */ }
  }
  return {};
}

export class Store extends EventEmitter {
  constructor(configPath, dataDir) {
    super();
    this.configPath = configPath;
    this.dataDir = dataDir;
    this.statePath = path.join(dataDir, 'state.json');
    this.config = null;
    this.els = new Map();     // name -> element definition (from config)
    this.rt = new Map();      // name -> runtime props
    this.texts = new Map();   // name -> { el, g }: text added with "+ Text" (its runtime props are in rt too)
    this.byKey = new Map();   // hidden key -> name now (lib/keys.js)
    this.former = new Map();  // a name given up by a rename -> the hidden key, so a running Process keeps finding it
    this.heatAlias = new Map();  // an old Duty Cycle / PID ... name merged into a Heating Element -> { to, method } (Rule 6.19)
    this.warned = new Set();
    this._persistTimer = null;
    this._pulses = new Map();  // momentary buttons waiting to turn off
    this._soundSeq = 0;        // order alarms / sound players were turned on (the newest wins a tie)
    this.setMaxListeners(0);   // every waiting script listens for changes
  }

  load() {
    this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    const c = this.config;
    c.workspaces ??= [{ name: 'Main' }];
    // vessels live on the Equipment tab (Fritz, 2026-10-04)
    if (!c.workspaces.some(w => w.name === 'Equipment')) c.workspaces.push({ name: 'Equipment', width: 1600, height: 900 });
    c.elements ??= []; c.graphics ??= []; c.devices ??= []; c.autostart ??= [];
    c.mediaRoots ??= ['./media'];
    c.probes ??= [];
    assignIds(c);            // every Interface gets its 1-4 letter ID and every tab its 2 letter ID (public/naming.js)
    migrateProbes(c);
    addSoundPlayer(c);
    const keyed = addKeys(c);  // every named item has its hidden key (old Schemas get theirs now)
    const onceN = onceToGroups(c);   // Rule 6.14 (2026-11-05/06): Once and In a Group items become On demand in their Group
    if (onceN) console.log(`Database: ${onceN} item(s) set to Once or In a Group are now On demand in their Group (send_db_group still sends them; start_db_group sends them by their own setting)`);
    const shared = (c.elements ?? []).filter(e => e?.type === 'shared').map(e => e.name);
    if (shared.length) console.log(`Shared Variables are gGlobals now (Rule 1.25): ${shared.join(', ')} (same Name, Database and .API Off)`);
    const gmap = toGStandard(c);   // Shared Variables, vKonstant / vAPI / gKonstant / gAPI and their vK_ / vA_ / gK_ / gA_ names -> gGlobal and gG_ (lib/gstandard.js)
    const smap = toSafeNames(c);   // < > : " / \ | ? * in a name -> ~ (lib/namechars.js)
    const was = JSON.stringify(c.graphics);
    linkClones(c.graphics, c.elements);      // Cloned Devices follow their parent by its key (a rename in the Config Editor too)
    // pipes run only Horizontal, Vertical or 45 and turn only at a fitting (Rule 5.19): older pipes with bends are cut at them
    const straightened = straightenPipes(c);
    if (straightened.length) console.log(`Pipes brought up to Rule 5.19 (Horizontal, Vertical or 45 only): ${straightened.join('; ')}`);
    const flowFirst = !c.pipeFlowNone;
    flowStandard(c.graphics, c);   // old start Flow colors (#4fb3ff, the samples' orange once) are None now (Rule 5.21, public/flowcolor.js)
    let saved = {};
    saved = readState(this.statePath);
    for (const [from, to] of [...gmap, ...smap]) if (from in saved && !(to in saved)) saved[to] = saved[from];
    this.els.clear(); this.rt.clear(); this.byKey.clear(); this.former.clear(); this.heatAlias.clear();
    for (const el of c.elements) this._addRuntime(el, saved[cleanName(el.name)]);
    this._syncControlled();
    for (const [from, to] of this._addTexts()) gmap.set(from, to);     // Text_1 -> w_Text_1 (Rule 15.2)
    // Tab Styles (Fritz, 2026-10-30): once per Schema, a Recipe Tab with no Tab Style of its own gets Tennyson (changeable later)
    let styled = false;
    if (!c.recipeTennyson) {
      for (const w of c.workspaces ?? []) if (/^recipe$/i.test(String(w.name).trim()) && !w.style) w.style = 'sky_tab_tennyson';
      c.recipeTennyson = true; styled = true;
    }
    // One click toggles a Pump (Fritz, 2026-11-04, Rule 2.33): once per Schema, a Pump Device (and a Picture Widget that follows one)
    // stops asking ON / OFF first. "Ask before changing" can still be switched back on in its Properties.
    if (!c.pumpOneClick) {
      for (const el of c.elements) if (el.confirm && (isPump(el) || (el.type === 'picture' && isPump(c.elements.find(x => x.name === el.follow))))) delete el.confirm;
      c.pumpOneClick = true; styled = true;
    }
    // The Pump Standard (Fritz, 2026-11-05, Rule 5.27): every Skynet pump picture is drawn in the same 300 x 300 box with its IPs in
    // the same spots, shown 150 x 150. Once per Schema, a Pump Device or Picture Widget showing one becomes 150 x 150 about its middle,
    // so a pump can be swapped for another in the same place and stay joined. A user's own pump picture and the sump pump are left as they are.
    if (!c.pumpStandard) {
      const std = p => /(?:^|\/)Images\/Skynet\/Pumps\/Pump_(?!Sump)[A-Za-z0-9_]+\.(?:svg|png)$/.test(String(p || ''));
      for (const el of c.elements) {
        if (!(isPump(el) || el.type === 'picture') || !(std(el.imageOff) || std(el.imageOn))) continue;
        const w = el.w || 120, h = el.h || 60;
        if (w === 150 && h === 150) continue;
        el.x = Math.round((el.x || 0) + (w - 150) / 2); el.y = Math.round((el.y || 0) + (h - 150) / 2); el.w = 150; el.h = 150;
      }
      c.pumpStandard = true; styled = true;
    }
    // The Valve Standard (Fritz, 2026-11-05, Rule 5.29): every valve picture is drawn in the same 300 x 300 box with its pipe through the
    // middle, so its IPs are always on the same spots. Once per Schema, a valve Device (on/off or Proportional) with a picture, or a
    // Picture Widget showing a Skynet valve picture, becomes square about its middle: 150 x 150, or smaller where a pipe joined to it
    // is too short for its IPs to move out that far (never smaller than it was across its IPs), so no pipe is turned round.
    if (!c.valveStandard) {
      const vpic = p => /(?:^|\/)Images\/Skynet\/Valves\/(?:Valve_(?!Check)|Motorized_TC15_Ball_Valve_)[A-Za-z0-9_]+\.svg$/.test(String(p || ''));
      const isV = el => ['valve', 'propValve'].includes(el.subtype) && el.type !== 'flowMeter' && !el.inline && (el.imageOff || el.imageOn);
      for (const el of c.elements) {
        if (!(isV(el) || (el.type === 'picture' && (vpic(el.imageOff) || vpic(el.imageOn) || vpic(el.image))))) continue;
        const w = el.w || 120, h = el.h || 60, cx = (el.x || 0) + w / 2, cy = (el.y || 0) + h / 2;
        let side = 150;
        for (const p of (c.graphics || []).filter(g => g.kind === 'pipe' && !g.hose && Array.isArray(g.points) && g.points.length >= 2)) {
          const on = id => id === `dev:${el.name}:in` || id === `dev:${el.name}:out`;
          const far = on(p.from) ? p.points[p.points.length - 1] : on(p.to) ? p.points[0] : null;
          if (far) side = Math.min(side, 2 * (Math.hypot(far[0] - cx, far[1] - cy) - 6));
        }
        side = Math.round(Math.max(side, Math.max(w, h), 40));
        if (side === w && side === h) continue;
        el.x = Math.round(cx - side / 2); el.y = Math.round(cy - side / 2); el.w = side; el.h = side;
      }
      c.valveStandard = true; styled = true;
    }
    // The bolt (Fritz, 2026-11-04, Rule 7.15): once per Schema, every valve a Process can switch, Proportional Valve and Pump with no
    // On overlay gets the red and yellow lightning bolt (steady). Picking (none) after that keeps none.
    const powered = el => (isValve(el) && el.valveType !== 'manual') || el.subtype === 'propValve' || isPump(el);
    if (!c.boltOverlay) {
      for (const el of c.elements) if (!el.imageOverlay && powered(el)) el.imageOverlay = BOLT;
      c.boltOverlay = true; styled = true;
    }
    // Fritz, 2026-11-04 later: the default is the steady bolt, the flashing one only a choice. Once per Schema, the flashing bolt
    // the first version gave out becomes the steady one.
    if (!c.boltSteady) {
      for (const el of c.elements) if (el.imageOverlay === BOLT_FLASH && powered(el)) el.imageOverlay = BOLT;
      c.boltSteady = true; styled = true;
    }
    if (flowFirst || onceN || styled || keyed || gmap.size || smap.size || JSON.stringify(c.graphics) !== was) this.writeConfig();
    this.loadRenames = gmap;                          // at start-up the server changes the Processes once its engine is up
    if (gmap.size) this.emit('gRenamed', gmap);     // the server changes the Processes (lib/renames.js)
    if (smap.size) this.emit('safeRenamed', smap);  // ... and the quoted names in them (lib/namechars.js)
  }

  // the "+ Text" text boxes: named (Text_1 ...) and given live attributes. Their names are saved with the next layout save.
  _addTexts() {
    for (const n of this.texts.keys()) this.rt.delete(n);
    this.texts.clear();
    const renamed = nameTexts(this.config.graphics, [...this.els.keys()]);
    for (const g of this.config.graphics) {
      if (g.kind !== 'text' || this.els.has(g.name)) continue;
      this.texts.set(g.name, { el: { name: g.name, type: TEXT_TYPE, workspace: g.workspace }, g });
      if (g[KEY]) this.byKey.set(g[KEY], g.name);
      this.rt.set(g.name, { text: toStr(g.text ?? ''), visibility: g.visible === false ? 'hidden' : 'visible', hidden: g.hidden === true, ...TB_START, ...TEXT_START });
    }
    // Manual Valve Widgets: a Process reads ManualValve_1.state (true = open) and asks for it to be turned by hand
    nameManualValves(this.config.graphics, [...this.els.keys(), ...this.texts.keys()]);
    for (const g of this.config.graphics) {
      if (!isMvGraphic(g) || this.els.has(g.name) || this.texts.has(g.name)) continue;
      this.texts.set(g.name, { el: { name: g.name, type: MANUAL_VALVE_TYPE, label: g.label || g.name, workspace: g.workspace }, g });
      if (g[KEY]) this.byKey.set(g[KEY], g.name);
      this.rt.set(g.name, { state: !!g.open });
    }
    return renamed;
  }

  // A Manual Valve Widget is opened or closed only by a click on its Tab (source 'ui'). It is kept in the layout (its .open),
  // so it is the same after a restart and on every screen.
  _setManualValve(name, el, prop, value, source) {
    if (!['state', 'value'].includes(prop)) throw new Error(`"${name}" is a Manual Valve: it has state (true = open)`);
    if (source !== 'ui') throw new Error(`"${name}" is a Manual Valve: only a click on it on its Tab opens or closes it`);
    const v = yes(value), r = this.rt.get(name), g = this.texts.get(name)?.g;
    if (r.state === v) return v;
    r.state = v; if (g) { if (v) g.open = true; else delete g.open; }
    this.writeConfig();
    this.emit('change', name, 'state', v, source);
    return v;
  }

  _addRuntime(el, savedValue) {
    el.name = cleanName(el.name);
    toBackpaths(el); toLabel(el); clockTimeOnly(el.database);
    if (!ELEMENT_TYPES.includes(el.type)) throw new Error(`Element "${el.name}": unknown type "${el.type}"`);
    if (this.els.has(el.name)) throw new Error(`Duplicate element name "${el.name}"`);
    if (isDataWidget(el)) el.dataType = DATA_WIDGETS[el.type];
    if (el.type === 'gGlobal') {
      const kinds = G_KINDS;
      el.kind ??= 'value';
      if (!kinds[el.kind]) throw new Error(`Element "${el.name}": unknown ${el.type} kind "${el.kind}"`);
      el.dataType = kinds[el.kind].dataType;
    }
    const r = {
      label: el.label || el.name,      // an empty Label shows the Name
      visibility: el.visibility ?? 'visible', hidden: el.hidden === true, ...TB_START,
      background: bgValue(el.background),
      image: el.backpath ?? '', imageon: el.imageOn ?? '', imageoff: el.imageOff ?? '', imageoverlay: el.imageOverlay ?? '',
      precision: el.precision ?? null, enabled: el.enabled ?? (el.type === 'pwmOut' || !CONTROL_TYPES.includes(el.type)), units: el.units ?? '',
    };
    for (const i of [1, 2, 3]) r[slotKey(i)] = el[slotKey(i)] ?? '';
    if (hasDeviceControlled(el)) r.device_controlled = controlledName(el) || SEMI_NONE;      // read only in a Process (set in its Properties)
    switch (el.type) {
      case 'gGlobal': case 'valueWidget': case 'timeWidget': case 'dateTimeWidget': {
        // Every gGlobal is non-volatile (Rule 1.22, Fritz 2026-11-03): its saved value always comes back, there is no
        // "Keep value on restart" switch any more. Only a button (always starts let go) and a Long String with a file
        // (its value is the file) start from their own source.
        delete el.retain;
        const keep = savedValue !== undefined && !isButton(el);
        const init = keep ? savedValue : (isButton(el) ? false : (el.initial ?? defaultFor(el.dataType)));
        r.value = coerce(el.dataType, revive(init), el.precision);
        if (isLong(el)) { r.file = el.file ?? ''; this._readLong(el, r, true); }
        break;
      }
      case 'digitalOut': case 'switch': r.state = !!el.initial; if (isValve(el)) r.tapwater = !!el.tapwater; if (isPump(el)) { r.cover = coverName(el.cover); r.covercolor = el.coverColor ?? ''; }
        if (isHeatElem(el)) heatRuntime(el, r);
        break;
      case 'led': r.state = !!el.initial; break;                         // Semi_Widgets_Devices
      case 'pushButton': case 'pulseButton': r.state = false; break;      // a button always starts let go
      case 'digitalIn': r.state = !!el.initial; r.raw = false; r.count = 0; r.reset = false; break;
      case 'temperature': r.value = Number(el.initial ?? 0); r.fault = false; break;
      case 'analogIn': r.value = Number(el.initial ?? 0); r.raw = 0; r.fault = false; break;
      case 'analogOut': r.value = Number(el.initial ?? 0); break;
      case 'flowMeter': r.rate = 0; r.total = 0; break;
      case 'scale': r.value = 0; r.volume = 0; r.raw = 0; r.tare = false; r.calibrate = 0; break;
      case 'stepper':
        r.position = 0; r.steps = 0; r.moving = false; r.homed = false; r.target = 0; r.move = 0;
        r.speed = Number(el.maxSpeed) || 1; r.run = 0; r.stop = false; r.home = false; r.reset = false; break;
      case 'timer':
        r.value = coerce('time', el.initial ?? 0); r.running = !!el.initRunning; r.type = el.timerType ?? 'countup';
        r.resetvalue = coerce('time', el.resetValue ?? 0); break;
      case 'alarm':
        r.active = false; r.loop = el.loop ?? false; r.sound = el.sound ?? '';
        r.fileindex = el.fileIndex ?? 1; r.soundmode = el.soundMode ?? (el.sounds ? 'custom' : 'default');
        r.playing = false; r.at = coerce('time', el.at ?? 0); r.before = coerce('time', el.before ?? '00:10:00'); break;
      case 'soundPlayer': r.path = el.path ?? ''; r.active = false; r.loop = el.loop ?? false; r.playing = false; break;
      case 'pwmOut': r.value = Number(el.initial ?? 0); break;
      case 'manual':
        r.setpoint = Number(el.setpoint ?? 0); r.heat = false; r.pump = false; r.timer = coerce('time', 0); r.volume = Number(el.volume ?? 0);
        r.reading = 0; r.message = ''; r.waiting = false; r.confirmed = false; break;
      case 'dutyCycle': r.dutycycle = Number(el.dutyCycle ?? 0); r.interval = Number(el.interval ?? 1000); r.state = false; break;
      case 'hysteresis': r.target = Number(el.target ?? 0); r.onoffset = Number(el.onOffset ?? 0); r.ondelay = Number(el.onDelay ?? 0); r.state = false; break;
      case 'pid':
        r.target = Number(el.target ?? 0); r.value = 0; r.state = false;
        for (const k of ['kp', 'ki', 'kd']) r[k] = Number(el[k] ?? 0);
        r.maxoutput = Number(el.maxOutput ?? 100); r.maxintegral = Number(el.maxIntegral ?? 100);
        r.calctime = Number(el.calcTime ?? 1); r.outtime = Number(el.outTime ?? 1); break;
      case 'deadband':
        r.target = Number(el.target ?? 0); r.value = 0; r.state = false;
        r.deadbandoffset = Number(el.deadbandOffset ?? 0.5); r.innerbandoffset = Number(el.innerBandOffset ?? 2);
        r.initialoutput = Number(el.initialOutput ?? 0); r.innerbanddrive = Number(el.innerBandDrive ?? 1); r.outerbanddrive = Number(el.outerBandDrive ?? 5);
        r.maxoutput = Number(el.maxOutput ?? 100); r.calctime = Number(el.calcTime ?? 10); r.outtime = Number(el.outTime ?? 2); break;
    }
    this.els.set(el.name, el);
    this.rt.set(el.name, r);
    // the old Devices merged into this Heating Element (Rule 6.19): a Process that still says "HLT_PID" finds it, in PID
    if (isHeatElem(el)) for (const a of el.heatControls ?? []) { const k = heatMethodKey(a?.method), n = cleanName(a?.name); if (k && n && n !== el.name) this.heatAlias.set(n, { to: el.name, method: k }); }
    if (el[KEY]) this.byKey.set(el[KEY], el.name);
  }

  // ---- media folders: images and text files are paths that must be inside one of them ----
  mediaRoots() { return (this.config?.mediaRoots ?? ['./media']).map(r => path.resolve(path.dirname(this.configPath), '..', r)); }
  resolveMedia(p) {
    if (!p) return null;
    const roots = this.mediaRoots();
    const full = path.isAbsolute(p) ? path.resolve(p) : path.resolve(roots[0], p);
    const norm = s => process.platform === 'win32' ? s.toLowerCase() : s;
    if (!roots.some(r => norm(full).startsWith(norm(r + path.sep)) || norm(full) === norm(r))) return null;
    return full;
  }

  // A media path that exists: upper/lower case is ignored (BruControl ran on Windows, so "Wave/X.WAV" finds "wave/x.wav"),
  // and the picture folder renamed from oakbarn to Images (2026-10-05) still answers to either name.
  findMedia(p) {
    const full = this._findMedia(p);
    if (!full || fs.existsSync(full)) return full;
    for (const a of mediaAliases(p)) {
      const alt = this._findMedia(a);
      if (alt && fs.existsSync(alt)) return alt;
    }
    // a picture moved into a picture group (a folder in Images) is still found by its old path, e.g. Images/MyPump.png
    const name = String(p).replace(/\\/g, '/').split('/').pop();
    if (/^(\.?\/)?((images|oakbarn)\/)?[^/]+$/i.test(String(p).replace(/\\/g, '/')) && PICTURE.test(name)) {
      const images = this._findMedia('Images');
      let groups = []; try { groups = fs.readdirSync(images, { withFileTypes: true }).filter(e => e.isDirectory() && !e.name.startsWith('.')); } catch { }
      for (const e of groups) { const alt = this._findMedia(`Images/${e.name}/${name}`); if (alt && fs.existsSync(alt)) return alt; }
      for (const e of groups.filter(e => /^skynet$/i.test(e.name))) {       // and the Skynet groups
        let sub = []; try { sub = fs.readdirSync(path.join(images, e.name), { withFileTypes: true }).filter(x => x.isDirectory()); } catch { }
        for (const x of sub) { const alt = this._findMedia(`Images/${e.name}/${x.name}/${name}`); if (alt && fs.existsSync(alt)) return alt; }
      }
    }
    return full;
  }
  _findMedia(p) {
    const full = this.resolveMedia(p);
    if (!full || fs.existsSync(full)) return full;
    const root = this.mediaRoots().find(r => full.startsWith(r + path.sep));
    if (!root) return full;
    let cur = root;
    for (const part of path.relative(root, full).split(path.sep)) {
      let names; try { names = fs.readdirSync(cur); } catch { return full; }
      const hit = names.find(n => n === part) ?? names.find(n => n.toLowerCase() === part.toLowerCase());
      if (!hit) return full;
      cur = path.join(cur, hit);
    }
    return cur;
  }

  // Long String gGlobals: the value is the text of a file. Re-read when the file changes (checked at most once a second).
  _readLong(el, r, quiet) {
    r._checked = Date.now();
    if (!r.file) return;
    const f = this.resolveMedia(r.file);
    if (!f) { if (!quiet) this.emit('warn', `"${el.name}": ${r.file} is not inside a media folder (Settings > Media folders)`); return; }
    try {
      const st = fs.statSync(f);
      if (st.mtimeMs === r._mtime) return;
      r._mtime = st.mtimeMs;
      const text = fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, '');
      if (text !== r.value) { r.value = text; if (!quiet) this.emit('change', el.name, 'value', text, 'file'); }
    } catch { r._mtime = undefined; }
  }
  _writeLong(el, r, text) {
    if (!r.file) return;
    const f = this.resolveMedia(r.file);
    if (!f) throw new Error(`"${el.name}": ${r.file} is not inside a media folder (Settings > Media folders)`);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, text);
    try { r._mtime = fs.statSync(f).mtimeMs; } catch { }
  }
  pollFiles() {
    for (const el of this.els.values()) if (isLong(el)) { const r = this.rt.get(el.name); if (Date.now() - (r._checked ?? 0) >= 1000) this._readLong(el, r); }
  }

  has(name) { return this.els.has(cleanName(name)) || this.texts.has(cleanName(name)) || this._alias(name) !== null; }
  // an old Device name merged into a Heating Element (Rule 6.19), when no Device has that name now
  _alias(name) { const n = cleanName(name); if (this.els.has(n) || this.texts.has(n)) return null; const a = this.heatAlias.get(n); return a && this.els.has(a.to) ? a : null; }
  // The name an item has now. A Process that was running when an item was renamed still says the old name: it is found
  // through the item's hidden key, so the Process keeps working (and uses the new name from its next start).
  // has() knows only the names of now, so a Process checked or started today must use the new name.
  now(name) {
    const n = cleanName(name);
    if (this.has(n)) return n;
    const k = this.former.get(n), cur = k && this.byKey.get(k);
    return cur && this.has(cur) ? cur : n;
  }
  get(name) { const n = this.now(name); return this.els.get(n) ?? this.texts.get(n)?.el ?? (this._alias(n) ? this.els.get(this._alias(n).to) : undefined); }
  list(type) { return [...this.els.values()].filter(e => !type || e.type === type); }
  manualValves() { return [...this.texts.values()].map(t => t.el).filter(isManualValveWidget); }
  textWidgets() { return [...this.texts.values()].map(t => t.el).filter(el => el.type === TEXT_TYPE); }

  propType(el, prop) {
    const tp = TYPE_PROPS[el.type] ?? {};
    if (BACKPATH.test(prop)) return 'string';
    if (prop === 'tapwater' && isValve(el)) return 'bool';
    if ((prop === 'cover' || prop === 'covercolor') && isPump(el)) return 'string';
    if (isHeatElem(el) && prop in HEAT_PROPS) return HEAT_PROPS[prop];
    if (prop in tp) return tp[prop] ?? el.dataType;
    if (prop in COMMON_PROPS) return COMMON_PROPS[prop];
    return undefined;
  }

  getProp(name, prop) {
    const alias = this._alias(name);
    if (alias) {            // "HLT_PID" (merged into hE_PID_1): ON only while hE_PID_1 is ON and controlled by PID
      const p = PROP_ALIAS[prop.toLowerCase()] || prop.toLowerCase();
      if (['state', 'enabled'].includes(p)) return !!this.getProp(alias.to, 'state') && heatMethodKey(this.getProp(alias.to, 'method')) === alias.method;
      return this.getProp(alias.to, prop);
    }
    name = this.now(name); prop = prop.toLowerCase(); prop = PROP_ALIAS[prop] || prop;
    const el = this.get(name);
    if (isHeatElem(el) && prop === 'enabled') prop = 'state';      // a Heating Element: Enabled = ON (Rule 7.9)
    if (!el) throw new Error(`Element not found: "${name}"`);
    const r = this.rt.get(name);
    if (GEOM_KEY[prop] && r[prop] === '') {                                // Text_1.width: its size in its properties
      const k = GEOM_KEY[prop], c = this.texts.get(name)?.g ?? el;
      return Number(c[k] ?? GEOM_DFLT[k]);
    }
    if (el.type === TEXT_TYPE && prop === 'value') prop = 'text';        // .value = .text (Fritz, 2026-10-29)
    if (el.type === TEXT_TYPE && !['visible', 'text', ...TB_ATTRS, ...Object.keys(TEXT_ATTRS)].includes(prop)) throw new Error(`"${name}" is a Text Widget: it has ${attrsOf(el).join(', ')}`);
    if (el.type === TEXT_TYPE && TEXT_ATTRS[prop] && r[prop] === '') {     // not set by a Process: what its Properties say
      const g = this.texts.get(name).g, [k, kind] = TEXT_ATTRS[prop], v = g[k];
      if (prop === 'label') return toStr(v || g.name);                      // an empty Label shows the Name (Rule 1.13)
      if (kind === 'bool') return v === true;
      if (kind === 'font') return fontName(v);
      if (kind === 'size') return Number(v) || (prop === 'size' ? 16 : 14);
      return v ?? '';
    }
    if (isManualValveWidget(el)) { if (!['state', 'value'].includes(prop)) throw new Error(`"${name}" is a Manual Valve: it has state (true = open)`); return r.state; }
    if ((prop === 'state' || prop === 'value') && !(prop in r) && 'active' in r) prop = 'active';   // an alarm: alm_Hops == true
    if (prop === 'state' && isVar(el) && el.dataType === 'bool') prop = 'value';
    if (prop === 'value' && el.type === 'stepper') prop = 'position';      // a stepper's value is where it is
    if (prop === 'value' && el.type === 'flowMeter') prop = 'rate';
    if (prop === 'visible') return r.visibility !== 'hidden';             // name.visible: true / false
    if (prop === 'hidden') return r.hidden === true;                       // name.hidden = true wins over name.visible = true
    if (prop === 'countdown' && el.type === 'timer') return r.type === 'countdown';
    if (prop === 'value' && isLong(el) && Date.now() - (r._checked ?? 0) >= 1000) this._readLong(el, r);
    if (!(prop in r)) {
      if (prop === 'value' && 'state' in r) return r.state;
      throw new Error(`"${name}" has no property "${prop}"`);
    }
    return r[prop];
  }

  setProp(name, prop, value, source = 'script') {
    const alias = this._alias(name);
    if (alias) {            // HLT_PID = true (merged into hE_PID_1): hE_PID_1 is switched to PID, then turned ON
      const p = PROP_ALIAS[prop.toLowerCase()] || prop.toLowerCase();
      if (p === 'state' || p === 'enabled' || (p === 'value' && typeof value === 'boolean')) {
        if (yes(value)) { this.setProp(alias.to, 'method', alias.method, source); return this.setProp(alias.to, 'state', true, source); }
        if (heatMethodKey(this.getProp(alias.to, 'method')) === alias.method) this.setProp(alias.to, 'state', false, source);
        return false;
      }
      return this.setProp(alias.to, prop, value, source);
    }
    name = this.now(name); prop = prop.toLowerCase(); prop = PROP_ALIAS[prop] || prop;
    const el = this.get(name);
    if (!el) throw new Error(`Element not found: "${name}"`);
    const r = this.rt.get(name);
    if (isHeatElem(el)) { const h = this._heatProp(name, el, r, prop, value, source); if (h) return h.v; if (prop === 'enabled') prop = 'state'; }
    if (el.type === TEXT_TYPE && !['visible', 'text', 'value', ...TB_ATTRS, ...Object.keys(TEXT_ATTRS)].includes(prop)) throw new Error(`"${name}" is a Text Widget: it has ${attrsOf(el).join(', ')}`);
    if (el.type === TEXT_TYPE && prop === 'value') prop = 'text';     // w_Text_1 = "Mashing" sets its text (.value = .text)
    if (el.type === TEXT_TYPE && prop === 'text') { const v = toStr(value), old = r.text; r.text = v; if (old !== v) this.emit('change', name, 'text', v, source); return v; }
    if (el.type === TEXT_TYPE && TEXT_ATTRS[prop]) {
      const v = this._textAttr(name, prop, value), old = r[prop];
      r[prop] = v;
      if (!sameValue(old, v)) this.emit('change', name, prop, v, source);
      return v;
    }
    if (isManualValveWidget(el)) return this._setManualValve(name, el, prop, value, source);
    if ((prop === 'state' || prop === 'value') && !(prop in r) && 'active' in r) prop = 'active';   // alm_Hops = true
    if (prop === 'value' && !('value' in r) && 'state' in r) prop = 'state';
    prop = LOOK_ALIAS[prop] || prop;
    if (LOOK_PROPS[prop]) {
      const v = LOOK_PROPS[prop](value, el), old = r[prop];
      r[prop] = v;
      if (!sameValue(old, v)) this.emit('change', name, prop, v, source);
      return;
    }
    if (prop === 'visible') { prop = 'visibility'; value = yes(value) ? 'visible' : 'hidden'; }        // name.visible = true (visible / hidden work too)
    // name.hidden = true keeps it hidden whatever .visible says (Fritz, 2026-10-23). Only true / false here: visible / hidden are .visible's words
    if (prop === 'hidden') {
      const w = toStr(value).trim().toLowerCase();
      if (!(typeof value === 'boolean' || ['true', 'false', 'on', 'off', '1', '0'].includes(w))) throw new Error(`"${name}".hidden is true or false (visible / hidden are only for .visible)`);
      const v = value === true || ['true', 'on', '1'].includes(w), old = r.hidden;
      r.hidden = v;
      if (old !== v) this.emit('change', name, 'hidden', v, source);
      return v;
    }
    // the old BruControl word: "name" visibility = hiddenlocked is .visible = false and .hidden = true
    if (prop === 'visibility' && toStr(value).trim().toLowerCase() === 'hiddenlocked') this.setProp(name, 'hidden', true, source);
    if (prop === 'countdown' && el.type === 'timer') { prop = 'type'; value = yes(value) ? 'countdown' : 'countup'; }
    if (prop === 'device_controlled') throw new Error(`"${name}".device_controlled is read only: pick the Device controlled in its Properties`);
    if (prop === 'tapwater' && !isValve(el)) throw new Error(`"${name}" has no property "tapwater" (only valves have it)`);
    if ((prop === 'cover' || prop === 'covercolor') && !isPump(el)) throw new Error(`"${name}" has no property "${prop}" (only pumps have it)`);
    if (prop === 'cover') {
      const c = PUMP_COVER_CHOICES.find(x => x.toLowerCase() === toStr(value).trim().toLowerCase());
      if (!c) throw new Error(`"${name}".cover is one of ${PUMP_COVER_CHOICES.join(', ')}`);
      value = c;
    }
    if (prop === 'state' && isVar(el) && el.dataType === 'bool') prop = 'value';
    if (prop === 'value' && el.type === 'stepper') prop = source === 'hw' ? 'position' : 'target';   // setting a stepper's value moves it there
    // Pictures: name.image = "path" is the Skynet way: it becomes .backpath and shows it (background = 1)
    if (BACKPATH.test(prop)) { prop = slotKey(slotOf(prop)); if (!(prop in r)) throw new Error(`"${name}" has no ${prop}`); }
    if (prop === 'image' || prop === 'backpath') {
      const p = toStr(value).trim();
      for (const [k, x] of [['backpath', p], ['image', p], ...(prop === 'image' ? [['background', '1']] : [])]) {
        const was = r[k]; r[k] = x;
        if (!sameValue(was, x)) this.emit('change', name, k, x, source);
      }
      if (p && !this.resolveMedia(p)) this.emit('warn', `"${name}": ${p} is not inside a media folder, so it cannot be shown`);
      return;
    }
    if (prop === 'background') value = bgValue(toStr(value));     // blank is 0: no background picture (Fritz, 2026-11-02)
    if (prop === 'file' && !isLong(el)) throw new Error(`"${name}" has no property "file" (only Long String gGlobals have one)`);
    const t = this.propType(el, prop);
    let v;
    if (t) v = coerce(t, value, prop === 'value' ? r.precision : undefined);
    else {
      v = value;
      const key = el.type + '.' + prop;
      if (!this.warned.has(key)) { this.warned.add(key); this.emit('warn', `"${name}": property "${prop}" is not used by ${el.type} elements (stored but ignored)`); }
    }
    if (prop === 'visibility') v = /^hidden(locked)?$/i.test(toStr(v).trim()) ? 'hidden' : 'visible';
    // BruControl: "alarm" sound = Custom / Default / None picks where the sound comes from
    if (el.type === 'alarm' && prop === 'sound' && SOUND_MODES.includes(toStr(v).trim().toLowerCase())) { prop = 'soundmode'; v = toStr(v).trim().toLowerCase(); }
    if (prop === 'soundmode') v = toStr(v).trim().toLowerCase();
    if (prop === 'playing' && source !== 'sound') throw new Error(`"${name}" playing is set by the panel (only one sound plays at a time); set "${name}" to true or false instead`);
    if (prop === 'path' && el.type === 'soundPlayer' && v && !this.resolveMedia(v)) this.emit('warn', `"${name}": ${v} is not inside a media folder, so it cannot be played`);
    if (INPUT_PROPS[el.type]?.includes(prop) && source === 'script' && el.device) {
      throw new Error(`"${name}" is an input from ${el.device} and cannot be set by a process`);
    }
    if (prop === 'value' && isLong(el) && v !== r.value) this._writeLong(el, r, v);
    if (prop === 'value' && el.type === 'gGlobal' && el.kind === 'graphic' && v && !this.resolveMedia(v)) this.emit('warn', `"${name}": ${v} is not inside a media folder, so it cannot be shown`);
    const old = r[prop];
    r[prop] = v;
    // a stepper command counts every time it is given ("go to 30" again after it was turned by hand or homed)
    if (!sameValue(old, v) || (el.type === 'stepper' && source !== 'hw' && STEPPER_COMMANDS.includes(prop))) {
      this.emit('change', name, prop, v, source);
      if ((isVar(el) || isDataWidget(el)) && prop === 'value' && !isButton(el)) this._schedulePersist();
    }
    if (prop === 'file' && !sameValue(old, v)) { r._mtime = undefined; this._readLong(el, r); }
    if (!sameValue(old, v) && source !== 'port') this._takePort(el, prop, v);
    if (SOUND_TYPES.includes(el.type) && !sameValue(old, v)) {
      if (prop === 'active') r._since = ++this._soundSeq;
      if (['active', 'soundmode', 'sound', 'path', 'fileindex'].includes(prop)) this.arbitrateSound();
      if (prop === 'at' || prop === 'before') r._left = undefined;
    }
    // Momentary button: true for a moment (100 ms unless set), then off again
    if (prop === 'value' && v === true && el.type === 'gGlobal' && el.kind === 'momentary') {
      clearTimeout(this._pulses.get(name));
      this._pulses.set(name, setTimeout(() => { this._pulses.delete(name); if (this.rt.get(name) === r) this.setProp(name, 'value', false, 'pulse'); }, Math.max(10, Number(el.pulseMs) || 100)));
    }
    // A Pulse Button (Semi_Widgets_Devices): a tap or a Process gives one 100 ms ON (its Device controlled gets the same pulse).
    // When it only follows its Device (source 'follow'), it shows ON as long as the Device is ON, and never turns it off itself.
    if (prop === 'state' && v === true && el.type === 'pulseButton' && source !== 'follow') {
      clearTimeout(this._pulses.get(name));
      this._pulses.set(name, setTimeout(() => { this._pulses.delete(name); if (this.rt.get(name) === r) this.setProp(name, 'state', false, 'pulse'); }, Math.max(10, Number(el.pulseMs) || PULSE_MS)));
    }
    if (!sameValue(old, v)) this._followControlled(el, prop, v);
    return v;
  }

  // A Heating Element's own props (Rule 6.19). Returns { v } when it was handled here, or nothing to go on as usual.
  _heatProp(name, el, r, prop, value, source) {
    const emit = (k, v) => { const old = r[k]; r[k] = v; if (!sameValue(old, v)) this.emit('change', name, k, v, source); };
    if (prop === 'method') {
      const k = heatMethodKey(value);
      if (!k) throw new Error(`"${name}".method is one of ${methodWords()}`);
      // only the methods its Build allows (Rule 6.19): its starting method and the ones ticked
      if (!allowedMethods(el).includes(k)) throw new Error(`"${name}" may only use ${allowedWords(el)} (tick ${heatMethodWord(k)} in its Properties to allow it)`);
      const was = heatMethodKey(r.method), word = heatMethodWord(k);
      if (was === k) return { v: word };
      // to On/Off from a control method: it is turned OFF first, so an Element never goes from 40 % to full on by itself
      if (k === 'onoff' && r.state) { emit('state', false); r.enabled = false; }
      if (k === 'onoff') { emit('output', false); emit('value', 0); }
      if (was === 'onoff' && r.state) emit('output', false);       // the control method switches the pin from here on
      emit('method', word);
      if (k === 'deadband' || k === 'pid') for (const p of ['calctime', 'outtime']) if (el[p === 'calctime' ? 'calcTime' : 'outTime'] === undefined) emit(p, heatDefault(k, p));
      if (r.state) this._takePort(el, 'state', true);
      return { v: word };
    }
    if (prop === 'output' && !['control', 'port', 'hw', 'schema'].includes(source)) throw new Error(`"${name}".output is its pin right now: the ${r.method} control switches it. Turn it on or off with "${name}" = true / false`);
    if (prop === 'enabled' || prop === 'state') {
      const on = typeof value === 'boolean' ? value : yes(value);
      r.enabled = on;
      if (!on && heatMethodKey(r.method) !== 'onoff') { emit('output', false); if (r.value) emit('value', 0); }
    }
    return null;
  }

  // device_controlled (Fritz, 2026-11-02): a Switch, Push Button, Pulse Button or LED and the Device it names follow each other,
  // like a Clone. Each one only changes what is different, so the two (and any other Semi_Widgets_Device on the same Device)
  // settle at once. Source 'follow', so the hardware still switches the pin (only 'hw' is skipped there).
  _followControlled(el, prop, v) {
    if (hasDeviceControlled(el) && prop === 'state') {
      const d = this.els.get(controlledName(el)), dp = onOffProp(d);
      if (dp && !sameValue(this.rt.get(d.name)?.[dp], v)) this.setProp(d.name, dp, v, 'follow');
      return;
    }
    if (onOffProp(el) !== prop) return;
    for (const s of this.els.values()) {
      if (!hasDeviceControlled(s) || controlledName(s) !== el.name) continue;
      if (!sameValue(this.rt.get(s.name)?.state, !!v)) this.setProp(s.name, 'state', !!v, 'follow');
    }
  }

  // At start and after a layout save: each Semi_Widgets_Device with a Device controlled shows what its Device is now
  _syncControlled() {
    for (const s of this.els.values()) {
      const d = hasDeviceControlled(s) && this.els.get(controlledName(s)), dp = onOffProp(d);
      if (dp) { const on = !!this.rt.get(d.name)?.[dp]; if (this.rt.get(s.name).state !== on) this.setProp(s.name, 'state', on, 'follow'); }
    }
  }

  // A Text Widget attribute from a Process, checked ('' puts back what its Properties say)
  _textAttr(name, prop, value) {
    const kind = TEXT_ATTRS[prop][1], t = toStr(value).trim(), bad = what => new Error(`"${name}".${prop} must be ${what}`);
    if (prop === 'lock') throw new Error(`"${name}".lock is read only: it is locked or unlocked in Edit layout`);
    if (t === '' && kind !== 'string') return '';
    switch (kind) {
      case 'bool': if (typeof value === 'boolean') return value; if (!/^(true|false|on|off|1|0)$/i.test(t)) throw bad('true or false'); return /^(true|on|1)$/i.test(t);
      case 'size': { const n = Number(t); if (!(n > 0 && n <= 400)) throw bad('a font size in pixels (1 to 400)'); return Math.round(n); }
      case 'font': { const f = tbFont(t); if (f === null) throw bad(`one of the fonts: ${FONTS.filter(([c]) => c).map(([, n]) => n.replace(/\s*\(.*\)$/, '')).join(', ')}`); return f; }
      case 'color': return t.slice(0, 40);
      case 'align': { const a = tbAlign(t); if (a === null) throw bad('Left, Center or Right'); return a; }
      case 'tab': { const w = (this.config.workspaces ?? []).find(x => String(x.name).toLowerCase() === t.toLowerCase()); if (!w) throw bad('the name of a Tab'); return w.name; }
      default: return toStr(value).slice(0, 500);
    }
  }

  // Fritz, 2026-10-23: outputs sharing a port (a Hysteresis and a PID on one heater): the one turned on or enabled last wins,
  // so the others on that port are turned off
  _takePort(el, prop, v) {
    if (!SHARED_PORT_TYPES.includes(el.type)) return;
    const control = ['dutyCycle', 'hysteresis', 'pid', 'deadband'].includes(el.type);
    if (isHeatElem(el) && prop === 'output') return;      // its control switching the pin is not "turned on"
    const on = control ? prop === 'enabled' && v === true : el.type === 'digitalOut' ? prop === 'state' && v === true : prop === 'value' && Number(v) > 0;
    if (!on) return;
    for (const o of portSharers(el, [...this.els.values()])) {
      if (!SHARED_PORT_TYPES.includes(o.type)) continue;
      if (['dutyCycle', 'hysteresis', 'pid', 'deadband'].includes(o.type)) { if (this.getProp(o.name, 'enabled')) this.setProp(o.name, 'enabled', false, 'port'); }
      else if (o.type === 'digitalOut') { if (this.getProp(o.name, 'state')) this.setProp(o.name, 'state', false, 'port'); }
      else if (Number(this.getProp(o.name, 'value')) > 0) this.setProp(o.name, 'value', 0, 'port');
    }
  }

  snapshotOne(name) {
    const r = this.rt.get(name); const o = {};
    for (const [k, v] of Object.entries(r)) if (k[0] !== '_') o[k] = plain(v);
    return o;
  }
  snapshot() { const o = {}; for (const n of [...this.els.keys(), ...this.texts.keys()]) o[n] = this.snapshotOne(n); return o; }

  // ---- timers ----
  tickTimers(dtSec) {
    for (const el of this.els.values()) {
      if (el.type !== 'timer') continue;
      const r = this.rt.get(el.name);
      if (!r.running) continue;
      if (r.type === 'countdown') {
        let s = r.value.s - dtSec;
        if (s <= 0) { s = 0; this.setProp(el.name, 'running', false, 'timer'); }
        this.setProp(el.name, 'value', new TimeVal(s), 'timer');
      } else this.setProp(el.name, 'value', new TimeVal(r.value.s + dtSec), 'timer');
    }
    this.tickHopAlarms();
  }

  // ---- alarms and sounds ----
  // A sound element makes a sound when it is on and has a sound file (an alarm set to Sound = None makes none).
  hasSound(el) {
    const r = this.rt.get(el.name);
    if (el.type === 'soundPlayer') return !!r.path;
    return r.soundmode !== 'none' && (r.soundmode === 'default' || !!(el.sounds?.[(r.fileindex || 1) - 1] || r.sound || el.sound));
  }
  // Only one sound at a time: the lowest priority number plays, the newest one wins a tie; the rest wait.
  arbitrateSound() {
    let best = null;
    for (const el of this.els.values()) {
      if (!SOUND_TYPES.includes(el.type)) continue;
      const r = this.rt.get(el.name);
      if (!r.active || !this.hasSound(el)) continue;
      const p = soundPriority(el);
      if (!best || p < best.p || (p === best.p && r._since > best.r._since)) best = { el, r, p };
    }
    for (const el of this.els.values()) {
      if (!SOUND_TYPES.includes(el.type)) continue;
      const play = best?.el === el;
      if (this.rt.get(el.name).playing !== play) this.setProp(el.name, 'playing', play, 'sound');
    }
    return best?.el.name ?? null;
  }
  // Time left until a Hop Alarm's timer reaches its "at" time (null when it has no timer)
  hopLeft(el) {
    const t = el.timer && this.els.get(cleanName(el.timer));
    if (!t || t.type !== 'timer') return null;
    const tr = this.rt.get(t.name), at = this.rt.get(el.name).at?.s ?? 0;
    return { left: tr.type === 'countdown' ? tr.value.s - at : at - tr.value.s, running: tr.running };
  }
  // Hop Alarms with a timer sound when it reaches their time; a Pre-Hop Alarm sounds "before" earlier (10 minutes unless set)
  tickHopAlarms() {
    for (const el of this.els.values()) {
      if (el.type !== 'alarm' || !['hop', 'prehop'].includes(el.kind)) continue;
      const r = this.rt.get(el.name);
      const hop = el.kind === 'hop' ? el : this.els.get(cleanName(el.hopAlarm ?? ''));
      const h = hop?.type === 'alarm' ? this.hopLeft(hop) : null;
      if (!h) { r._left = undefined; continue; }
      const left = h.left - (el.kind === 'prehop' ? (r.before?.s ?? 600) : 0);
      // fire once, when the time left goes from above zero to zero or less while the timer runs
      if (h.running && r._left !== undefined && r._left > 0 && left <= 0) this.setProp(el.name, 'active', true, 'timer');
      r._left = left;
    }
  }

  // ---- persistence of variable values ----
  // gGlobals are non-volatile (Rule 1.22): a change is on the Brain's disk within PERSIST_MS (several changes close together
  // are written once, but never later than PERSIST_MAX_MS after the first), and again when the panel is stopped.
  _schedulePersist() {
    const now = Date.now();
    this._persistFirst ??= now;
    clearTimeout(this._persistTimer);
    const wait = Math.max(0, Math.min(PERSIST_MS, this._persistFirst + PERSIST_MAX_MS - now));
    this._persistTimer = setTimeout(() => this.persistNow(), wait);
  }
  persistNow() {
    clearTimeout(this._persistTimer); this._persistTimer = null; this._persistFirst = undefined;
    const o = {};
    for (const el of this.els.values()) {
      if ((isVar(el) || isDataWidget(el)) && !isButton(el) && !isLongFile(el)) { const v = this.rt.get(el.name).value; o[el.name] = v?.toJSON ? v.toJSON() : v; }
    }
    writeSafely(this.statePath, JSON.stringify(o, null, 1));
  }

  // ---- layout / element edits from the browser ----
  saveLayout(update) {
    const c = this.config;
    if (update.workspaces) c.workspaces = checkIds(update.workspaces, 'tab');
    if (update.graphics) c.graphics = update.graphics;
    if (update.probes) c.probes = cleanProbes(update.probes);
    if (update.elements) {
      sharedToGGlobal(update);      // an older page or file may still send a Shared Variable: it is a gGlobal now
      // validate first, then rebuild runtime keeping current values where the element still exists
      const names = new Set();
      for (const el of update.elements) {
        const n = cleanName(el.name);
        if (!n) throw new Error('Element with empty name');
        if (names.has(n)) throw new Error(`Duplicate element name "${n}"`);
        if (!ELEMENT_TYPES.includes(el.type)) throw new Error(`Element "${n}": unknown type "${el.type}"`);
        names.add(n);
      }
      const keep = new Map();
      for (const [n, r] of this.rt) keep.set(n, r);
      // a renamed Device or Widget keeps its value (lib/renames.js): new name -> old name
      const was = new Map([...(update.renames ?? new Map())].map(([from, to]) => [to, from]));
      // a scale's tare is set by the scale itself (Tare button, auto tare), not by the layout editor
      for (const el of update.elements) { const old = this.els.get(cleanName(el.name)); if (el.type === 'scale' && old?.type === 'scale' && old.tareRaw !== undefined) el.tareRaw = old.tareRaw; }
      c.elements = update.elements;
      addSoundPlayer(c);
      addKeys(c);
      this.els.clear(); this.rt.clear(); this.byKey.clear(); this.heatAlias.clear();
      for (const el of c.elements) {
        this._addRuntime(el);
        const old = keep.get(was.get(el.name) ?? el.name);
        if (old) {
          const r = this.rt.get(el.name);
          for (const k of ['value', 'state', 'active', 'playing', 'path', 'running', 'total', 'count', 'raw', 'setpoint', 'heat', 'pump', 'timer', 'volume', 'reading', 'message', 'waiting', 'position', 'steps', 'homed', 'moving', 'target', 'method', 'output']) {
            if (!(k in old && k in r) || (k === 'value' && (isLongFile(el) || isButton(el)))) continue;
            r[k] = (k === 'value' && (isVar(el) || isDataWidget(el))) ? coerce(el.dataType, old[k], el.precision) : old[k];
          }
        }
      }
      for (const [from, to] of update.renames ?? []) { const k = this.els.get(to)?.[KEY]; if (k) this.former.set(from, k); }
      this._syncControlled();
      this.persistNow();
      for (const r of this.rt.values()) if ('playing' in r) r._since ??= 0;
      this.arbitrateSound();
    }
    if (update.graphics || update.elements) {
      const trn = this._addTexts();
      // a Text Widget renamed in its Properties: a running Process that still says the old name keeps finding it
      for (const [from, to] of update.renames ?? []) { const k = this.texts.get(to)?.g?.[KEY]; if (k) this.former.set(from, k); }
      if (trn.size) this.emit('gRenamed', trn);
    }
    migrateProbes(c);
    addKeys(c);
    linkClones(c.graphics, c.elements);      // Cloned Devices follow their parent by its key (lib/clones.js)
    this.writeConfig();
    this.emit('config');
  }

  // a gGlobal made by a Process line such as new gV gV_X = 10 (Rule 1.24): it is saved in the Schema like one made on the
  // Variables screen. first is its first value (none: 0, '' or false). A name already used is left as it is.
  addGlobal(name, kind, first) {
    const n = cleanName(name);
    if (this.has(n)) return this.get(n);
    if (!G_KINDS[kind]?.variable || kind === 'graphic') throw new Error(`A Process can't make a gGlobal of kind "${kind}"`);
    const el = { name: n, type: 'gGlobal', kind };
    if (first !== undefined) {
      const v = coerce(G_KINDS[kind].dataType, first);
      el.initial = kind === 'datetime' ? new Date(v.ms).toISOString() : plain(v);
    }
    this.config.elements.push(el);
    addKeys(this.config);
    this._addRuntime(el);
    this.writeConfig();
    this._schedulePersist();
    this.emit('config');
    return el;
  }

  writeConfig() {
    addKeys(this.config);          // a new item gets its hidden key before it is first written (lib/keys.js)
    if (fs.existsSync(this.configPath)) fs.copyFileSync(this.configPath, this.configPath + '.bak');
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    this.emit('written');          // lib/schemas.js copies it to the loaded Schema's own file
  }
}

// OneWire probe index: numbered slots that temperature elements point to (probeIndex).
// The probe's ROM id is set on the slot, so a probe is replaced by giving the slot the new ROM id.
function cleanProbes(list) {
  const out = [], idx = new Set(), roms = new Set();
  for (const p of list) {
    const index = Number(p.index);
    if (!Number.isInteger(index) || index < 1) throw new Error(`OneWire probe index must be a whole number from 1 up (got "${p.index}")`);
    if (idx.has(index)) throw new Error(`OneWire probe index ${index} is used twice`);
    const rom = String(p.rom ?? '').trim().toUpperCase();
    if (rom && !/^[0-9A-F]{16}$/.test(rom)) throw new Error(`OneWire probe ${index}: ROM id must be 16 hex digits`);
    if (rom && roms.has(rom)) throw new Error(`ROM id ${rom} is in two OneWire slots`);
    idx.add(index); if (rom) roms.add(rom);
    out.push({ index, name: String(p.name ?? '').trim(), rom, ...(p.device ? { device: p.device } : {}) });
  }
  return out.sort((a, b) => a.index - b.index);
}

// Older configs put the ROM id on the element: give each such probe a slot in the index
function migrateProbes(c) {
  for (const el of c.elements) {
    if (el.type !== 'temperature' || (el.sensor && el.sensor !== 'ds18b20') || !el.probe || el.probeIndex) continue;
    const rom = String(el.probe).toUpperCase();
    let slot = c.probes.find(p => p.rom === rom);
    if (!slot) { slot = { index: Math.max(0, ...c.probes.map(p => p.index)) + 1, name: el.name, rom }; c.probes.push(slot); }
    el.probeIndex = slot.index; delete el.probe;
  }
}

// Every panel has one Sound Player named SoundPlayer (not on any tab) that every Process can use
function addSoundPlayer(c) {
  if (!c.elements.some(e => cleanName(e.name) === SOUND_PLAYER)) c.elements.push({ name: SOUND_PLAYER, type: 'soundPlayer', builtIn: true });
}

function revive(v) {
  if (v && typeof v === 'object') {
    if ('time' in v) return new TimeVal(v.time);
    if ('datetime' in v) return new Date(v.datetime).toISOString();
  }
  return v;
}

function sameValue(a, b) {
  if (a === b) return true;
  if (a && b && typeof a === 'object' && typeof b === 'object') return a.toString() === b.toString();
  return false;
}

export { CFG_KEY };
