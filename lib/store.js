// Configuration + live element values.
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { coerce, defaultFor, plain, TimeVal, toStr } from './values.js';
import { assignIds, checkIds, portSharers, SHARED_PORT_TYPES } from '../public/naming.js';
import { TB_ATTRS, tbAlign, tbPixels } from '../public/textbox.js';
import { skynetGroupOf } from './picgroups.js';
import { addKeys, KEY } from './keys.js';
import { linkClones } from './clones.js';
import { toGStandard } from './gstandard.js';
const PICTURE = /\.(png|jpe?g|gif|svg|webp|bmp|ico)$/i;

export const ELEMENT_TYPES = ['shared', 'gKonstant', 'gAPI', 'digitalOut', 'switch', 'digitalIn', 'temperature', 'analogIn', 'timer', 'alarm', 'label', 'picture',
  'pwmOut', 'dutyCycle', 'hysteresis', 'pid', 'analogOut', 'flowMeter', 'scale', 'manual', 'stepper', 'soundPlayer'];

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

// Variable classes.  gKonstant: every script, set on screen or by script, never API or database.
// gAPI: scripts + API + database, with database triggers. (The old Global class is gone: lib/globals.js moves them.)
// They were vKonstant / vAPI until 2026-10-28 (Fritz): older Schemas are brought up to gKonstant / gAPI and gK / gA names
// when they load (lib/gstandard.js).
// kind -> data type, and the suggested name prefix (a hint only, never enforced)
export const VK_KINDS = {
  graphic: { dataType: 'string', prefix: 'gK_', label: 'Graphic (image file path)' },
  string: { dataType: 'string', prefix: 'gKS_', label: 'String' },
  longstring: { dataType: 'string', prefix: 'gKL_', label: 'Long String (text file)' },
  value: { dataType: 'value', prefix: 'gKV_', label: 'Value' },
  time: { dataType: 'time', prefix: 'gKT_', label: 'Time' },
  datetime: { dataType: 'datetime', prefix: 'gKDT_', label: 'Date Time' },
  bool: { dataType: 'bool', prefix: 'gKB_', label: 'Boolean' },
  switch: { dataType: 'bool', prefix: 'gKSW_', label: 'Switch (slider that toggles: tap ON, tap again OFF)' },
  pushbutton: { dataType: 'bool', prefix: 'gKPB_', label: 'Push Button (ON while held, OFF when released)' },
  momentary: { dataType: 'bool', prefix: 'gKMB_', label: 'Pulse Button (one 100 ms pulse per tap)' },
  // a dropdown: each choice has a Value (what Processes read and trigger on) and a Text (what the dropdown shows)
  list: { dataType: 'value', prefix: 'gKList_', label: 'List (dropdown: Value + Text)' },
  // shows the step ("1.00003  Mash in") a Process of its class (Flow unless set) just reached: lib/scaffold.js
  step: { dataType: 'string', prefix: 'gKStep_', label: 'Step (shows the Process step reached)' },
};
export const VAPI_KINDS = {
  string: { dataType: 'string', prefix: 'gAS_', label: 'String' },
  value: { dataType: 'value', prefix: 'gAV_', label: 'Value' },
  time: { dataType: 'time', prefix: 'gAT_', label: 'Time' },
  datetime: { dataType: 'datetime', prefix: 'gADT_', label: 'Date Time' },
  bool: { dataType: 'bool', prefix: 'gAB_', label: 'Boolean' },
};
export const isVar = el => el && (el.type === 'shared' || el.type === 'gKonstant' || el.type === 'gAPI');
export const isApiVar = el => el && el.type === 'gAPI';      // in the API and the database
const isButton = el => el.type === 'gKonstant' && (el.kind === 'pushbutton' || el.kind === 'momentary');
const isLong = el => el.type === 'gKonstant' && el.kind === 'longstring';
const isLongFile = el => isLong(el) && !!el.file;
// Elements that drive an output pin on/off (the control ones switch it themselves)
export const PIN_OUTPUTS = ['digitalOut', 'dutyCycle', 'hysteresis', 'pid'];
const STEPPER_COMMANDS = ['target', 'move', 'run', 'stop', 'home', 'reset'];
export const CONTROL_TYPES = ['pwmOut', 'dutyCycle', 'hysteresis', 'pid'];
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

// Typed runtime properties per element type (lower-case names)
const TYPE_PROPS = {
  shared: { value: null }, gKonstant: { value: null, file: 'string' }, gAPI: { value: null },
  digitalOut: { state: 'bool' }, switch: { state: 'bool' }, digitalIn: { state: 'bool', raw: 'bool', count: 'value', reset: 'bool' },
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
};
const COMMON_PROPS = {
  label: 'string', visibility: 'string', background: 'string', image: 'string',
  imageon: 'string', imageoff: 'string', imageoverlay: 'string', precision: 'value', enabled: 'bool', units: 'string',
  imagepath_1: 'string', imagepath_2: 'string', imagepath_3: 'string',
};
// config key for each common runtime prop
const CFG_KEY = { imageon: 'imageOn', imageoff: 'imageOff', imageoverlay: 'imageOverlay', type: 'timerType', imagepath_1: 'imagePath_1', imagepath_2: 'imagePath_2', imagepath_3: 'imagePath_3' };

// Picture paths (Fritz, 2026-10-05): every item has imagePath_1, imagePath_2 and imagePath_3 (BruControl's 3 background
// pictures). "background" = 1, 2 or 3 picks one; any other whole number shows no picture (as in BruControl).
// A Process changes the picture the Skynet way: my_widget.image = "Images/RedPump.png" sets imagePath_1 and background = 1.
// imagePath_2 and _3 work as in BruControl again (Fritz, 2026-10-27): editable in Properties, and a Process may set them.
// Items folded from stacked BruControl copies keep more paths (imagePath_4, _5 ...): see lib/fold.js.
// imagePathsLocked only marks imported BruControl pictures now (they fill the item); it no longer locks imagePath_2 and _3.
export const IMAGE_PATH = /^imagepath_(\d+)$/i;
export const imagePaths = el => Object.keys(el).filter(k => IMAGE_PATH.test(k)).map(k => +IMAGE_PATH.exec(k)[1]).sort((a, b) => a - b);
// Old configs: a list "images" (BruControl import) and one "image" path become imagePath_1, _2, _3 ...
export function toImagePaths(el, imported = false) {
  if (Array.isArray(el.images)) {
    el.images.forEach((p, i) => { if (p) el['imagePath_' + (i + 1)] ??= p; });
    delete el.images; imported = true;
  }
  if (typeof el.image === 'string') { if (el.image) el.imagePath_1 ??= el.image; delete el.image; }
  if (imported) el.imagePathsLocked = true;
  return el;
}
// Label (Fritz, 2026-10-27): the text shown on a Device or Widget is its "label" (it was "displayName"). Old configs
// move over on load. In a Process, label is the word; BruControl's displayname still works and means label.
export function toLabel(el) {
  if ('displayName' in el) { if (el.label === undefined || el.label === '') el.label = el.displayName; delete el.displayName; }
  return el;
}
// x_hPosition / y_vPosition (Fritz, 2026-10-28: x is horizontal, y is vertical, so nobody has to remember which):
// the names a Process uses for a place on the Tab. The old xPosition / yPosition still work.
const PROP_ALIAS = { displayname: 'label', x_hposition: 'xposition', y_vposition: 'yposition' };
const SHOWN_NAME = { xposition: 'x_hPosition', yposition: 'y_vPosition' };
const SOUND_MODES = ['custom', 'default', 'none'];
// The look of a device or widget (Fritz, 2026-10-20). It starts from the tab's Tab Background Profile and can be changed in its
// properties or by a Process, e.g. Pump_1.valueColor = "Red", Pump_1.nameAlign = "TopLeft", BK_Temp.valueType = "Gauge".
// "" puts back the look set in its properties.
const ALIGNS = ['TopLeft', 'TopCenter', 'TopRight', 'MiddleLeft', 'MiddleCenter', 'MiddleRight', 'BottomLeft', 'BottomCenter', 'BottomRight'];
const STATE_TYPES = ['digitalOut', 'switch', 'digitalIn', 'alarm', 'soundPlayer'];
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
    const t = pick(['LED', 'Text', 'Gauge'], 'valueType')(v, el).toLowerCase();
    if (t === 'gauge' && hasState(el)) throw new Error(`"${el.name}" has an ON / OFF state, so its valueType can only be LED or Text`);
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
// Text added with "+ Text" in Edit layout is a text box a Process can change too. Each one has a fixed name: Text_1, Text_2 ...
export const TEXT_TYPE = 'text';
export function nameTexts(graphics, taken = []) {
  const used = new Set([...taken, ...graphics.map(g => g.name)].filter(Boolean).map(n => String(n).toLowerCase()));
  for (const g of graphics) {
    if (g.kind !== 'text' || /^Text_/.test(g.name ?? '')) continue;
    let n = 1; while (used.has('text_' + n)) n++;
    g.name = 'Text_' + n; used.add('text_' + n);
  }
}

// Manual Valve Widgets have fixed names too: ManualValve_1, ManualValve_2 ... (the same as the Edit layout gives them)
export function nameManualValves(graphics, taken = []) {
  const used = new Set([...taken, ...graphics.map(g => g.name)].filter(Boolean).map(n => String(n).toLowerCase()));
  for (const g of graphics) {
    if (!isMvGraphic(g) || /^ManualValve_/.test(g.name ?? '')) continue;
    let n = 1; while (used.has('manualvalve_' + n)) n++;
    g.name = 'ManualValve_' + n; used.add('manualvalve_' + n);
  }
}

export const cleanName = n => String(n ?? '').trim();
// Names have no spaces from now on (Fritz, 2026-10-05): "Test Timer" -> Test_Timer, "sw_Advance_ BrewStatus" -> sw_Advance_BrewStatus
export const noSpaces = n => { n = cleanName(n); return /\s/.test(n) ? n.replace(/_*\s+_*/g, '_') : n; };

// The main value of each type: what the name alone means in a Process (Pump_Red = true, alm_Hops == false, Kettle_SP = 185.5)
const MAIN_PROP = { digitalOut: 'state', switch: 'state', digitalIn: 'state', dutyCycle: 'state', hysteresis: 'state', alarm: 'active', soundPlayer: 'active', flowMeter: 'rate' };
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
  if (el.type === TEXT_TYPE) return ['text', ...TB_ATTRS].sort();
  if (isManualValveWidget(el)) return [];
  return [...new Set([...own, ...TB_ATTRS, ...Object.keys(COMMON_PROPS).filter(p => p !== 'visibility')])].sort();
}
// Which attributes take true / false (and the main value, as ''), so predictive text can offer true and false after the =
export function boolAttrs(el) {
  if (!el) return [];
  if (isManualValveWidget(el)) return ['', 'state'];
  const kinds = isVar(el) ? (el.type === 'gAPI' ? VAPI_KINDS : VK_KINDS) : null;
  const out = [];
  const main = mainProp(el);
  if (main && (kinds ? (el.dataType ?? kinds[el.kind]?.dataType) === 'bool' : TYPE_PROPS[el.type]?.[main] === 'bool')) out.push('');
  for (const a of attrKeys(el)) if (['visible', 'hidden', 'countdown', 'tapwater'].includes(a) || (TYPE_PROPS[el.type]?.[a] ?? COMMON_PROPS[a]) === 'bool') out.push(a);
  return out;
}
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
    const gmap = toGStandard(c);   // vKonstant / vAPI and vK_ / vA_ names -> gKonstant / gAPI and gK_ / gA_ (lib/gstandard.js)
    const was = JSON.stringify(c.graphics);
    linkClones(c.graphics, c.elements);      // Cloned Devices follow their parent by its key (a rename in the Config Editor too)
    let saved = {};
    try { saved = JSON.parse(fs.readFileSync(this.statePath, 'utf8')); } catch { /* first run */ }
    for (const [from, to] of gmap) if (from in saved && !(to in saved)) saved[to] = saved[from];
    this.els.clear(); this.rt.clear(); this.byKey.clear(); this.former.clear();
    for (const el of c.elements) this._addRuntime(el, saved[cleanName(el.name)]);
    this._addTexts();
    if (keyed || gmap.size || JSON.stringify(c.graphics) !== was) this.writeConfig();
    if (gmap.size) this.emit('gRenamed', gmap);     // the server changes the Processes (lib/renames.js)
  }

  // the "+ Text" text boxes: named (Text_1 ...) and given live attributes. Their names are saved with the next layout save.
  _addTexts() {
    for (const n of this.texts.keys()) this.rt.delete(n);
    this.texts.clear();
    nameTexts(this.config.graphics, [...this.els.keys()]);
    for (const g of this.config.graphics) {
      if (g.kind !== 'text' || this.els.has(g.name)) continue;
      this.texts.set(g.name, { el: { name: g.name, type: TEXT_TYPE, workspace: g.workspace }, g });
      if (g[KEY]) this.byKey.set(g[KEY], g.name);
      this.rt.set(g.name, { text: toStr(g.text ?? ''), visibility: g.visible === false ? 'hidden' : 'visible', hidden: g.hidden === true, ...TB_START });
    }
    // Manual Valve Widgets: a Process reads ManualValve_1.state (true = open) and asks for it to be turned by hand
    nameManualValves(this.config.graphics, [...this.els.keys(), ...this.texts.keys()]);
    for (const g of this.config.graphics) {
      if (!isMvGraphic(g) || this.els.has(g.name) || this.texts.has(g.name)) continue;
      this.texts.set(g.name, { el: { name: g.name, type: MANUAL_VALVE_TYPE, label: g.label || g.name, workspace: g.workspace }, g });
      if (g[KEY]) this.byKey.set(g[KEY], g.name);
      this.rt.set(g.name, { state: !!g.open });
    }
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
    toImagePaths(el); toLabel(el);
    if (!ELEMENT_TYPES.includes(el.type)) throw new Error(`Element "${el.name}": unknown type "${el.type}"`);
    if (this.els.has(el.name)) throw new Error(`Duplicate element name "${el.name}"`);
    if (el.type === 'shared') el.dataType ??= 'value';
    if (el.type === 'gKonstant' || el.type === 'gAPI') {
      const kinds = el.type === 'gKonstant' ? VK_KINDS : VAPI_KINDS;
      el.kind ??= 'value';
      if (!kinds[el.kind]) throw new Error(`Element "${el.name}": unknown ${el.type} kind "${el.kind}"`);
      el.dataType = kinds[el.kind].dataType;
    }
    const r = {
      label: el.label || el.name,      // an empty Label shows the Name
      visibility: el.visibility ?? 'visible', hidden: el.hidden === true, ...TB_START,
      background: el.background ?? '',
      image: el.imagePath_1 ?? '', imageon: el.imageOn ?? '', imageoff: el.imageOff ?? '', imageoverlay: el.imageOverlay ?? '',
      precision: el.precision ?? null, enabled: el.enabled ?? (el.type === 'pwmOut' || !CONTROL_TYPES.includes(el.type)), units: el.units ?? '',
    };
    for (const i of [1, 2, 3, ...imagePaths(el)]) r['imagepath_' + i] = el['imagePath_' + i] ?? '';
    switch (el.type) {
      case 'shared': case 'gAPI': case 'gKonstant': {
        const keep = savedValue !== undefined && el.retain !== false && !isButton(el);
        const init = keep ? savedValue : (isButton(el) ? false : (el.initial ?? defaultFor(el.dataType)));
        r.value = coerce(el.dataType, revive(init), el.precision);
        if (isLong(el)) { r.file = el.file ?? ''; this._readLong(el, r, true); }
        break;
      }
      case 'digitalOut': case 'switch': r.state = !!el.initial; if (isValve(el)) r.tapwater = !!el.tapwater; break;
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
    }
    this.els.set(el.name, el);
    this.rt.set(el.name, r);
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

  // Long String gKonstants: the value is the text of a file. Re-read when the file changes (checked at most once a second).
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

  has(name) { return this.els.has(cleanName(name)) || this.texts.has(cleanName(name)); }
  // The name an item has now. A Process that was running when an item was renamed still says the old name: it is found
  // through the item's hidden key, so the Process keeps working (and uses the new name from its next start).
  // has() knows only the names of now, so a Process checked or started today must use the new name.
  now(name) {
    const n = cleanName(name);
    if (this.has(n)) return n;
    const k = this.former.get(n), cur = k && this.byKey.get(k);
    return cur && this.has(cur) ? cur : n;
  }
  get(name) { const n = this.now(name); return this.els.get(n) ?? this.texts.get(n)?.el; }
  list(type) { return [...this.els.values()].filter(e => !type || e.type === type); }
  manualValves() { return [...this.texts.values()].map(t => t.el).filter(isManualValveWidget); }

  propType(el, prop) {
    const tp = TYPE_PROPS[el.type] ?? {};
    if (IMAGE_PATH.test(prop)) return 'string';
    if (prop === 'tapwater' && isValve(el)) return 'bool';
    if (prop in tp) return tp[prop] ?? el.dataType;
    if (prop in COMMON_PROPS) return COMMON_PROPS[prop];
    return undefined;
  }

  getProp(name, prop) {
    name = this.now(name); prop = prop.toLowerCase(); prop = PROP_ALIAS[prop] || prop;
    const el = this.get(name);
    if (!el) throw new Error(`Element not found: "${name}"`);
    const r = this.rt.get(name);
    if (GEOM_KEY[prop] && r[prop] === '') {                                // Text_1.width: its size in its properties
      const k = GEOM_KEY[prop], c = this.texts.get(name)?.g ?? el;
      return Number(c[k] ?? GEOM_DFLT[k]);
    }
    if (el.type === TEXT_TYPE && (prop === 'value' || prop === 'label')) prop = 'text';
    if (el.type === TEXT_TYPE && !['visible', 'text', ...TB_ATTRS].includes(prop)) throw new Error(`"${name}" is a Text: it has ${['text', ...TB_ATTRS].join(', ')}`);
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
    name = this.now(name); prop = prop.toLowerCase(); prop = PROP_ALIAS[prop] || prop;
    const el = this.get(name);
    if (!el) throw new Error(`Element not found: "${name}"`);
    const r = this.rt.get(name);
    if (el.type === TEXT_TYPE && !['visible', 'text', 'value', 'label', ...TB_ATTRS].includes(prop)) throw new Error(`"${name}" is a Text: it has ${['text', ...TB_ATTRS].join(', ')}`);
    if (el.type === TEXT_TYPE && (prop === 'value' || prop === 'label')) prop = 'text';     // Text_1 = "Mashing" sets its text
    if (el.type === TEXT_TYPE && prop === 'text') { const v = toStr(value), old = r.text; r.text = v; if (old !== v) this.emit('change', name, 'text', v, source); return v; }
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
    if (prop === 'tapwater' && !isValve(el)) throw new Error(`"${name}" has no property "tapwater" (only valves have it)`);
    if (prop === 'state' && isVar(el) && el.dataType === 'bool') prop = 'value';
    if (prop === 'value' && el.type === 'stepper') prop = source === 'hw' ? 'position' : 'target';   // setting a stepper's value moves it there
    // Pictures: name.image = "path" is the Skynet way: it becomes imagePath_1 and shows it (background = 1)
    const slot = IMAGE_PATH.exec(prop);
    if (slot && !(prop in r)) throw new Error(`"${name}" has no ${prop}`);
    if (prop === 'image' || prop === 'imagepath_1') {
      const p = toStr(value).trim();
      for (const [k, x] of [['imagepath_1', p], ['image', p], ...(prop === 'image' ? [['background', '1']] : [])]) {
        const was = r[k]; r[k] = x;
        if (!sameValue(was, x)) this.emit('change', name, k, x, source);
      }
      if (p && !this.resolveMedia(p)) this.emit('warn', `"${name}": ${p} is not inside a media folder, so it cannot be shown`);
      return;
    }
    if (prop === 'file' && !isLong(el)) throw new Error(`"${name}" has no property "file" (only Long String gKonstants have one)`);
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
    if (prop === 'value' && el.type === 'gKonstant' && el.kind === 'graphic' && v && !this.resolveMedia(v)) this.emit('warn', `"${name}": ${v} is not inside a media folder, so it cannot be shown`);
    const old = r[prop];
    r[prop] = v;
    // a stepper command counts every time it is given ("go to 30" again after it was turned by hand or homed)
    if (!sameValue(old, v) || (el.type === 'stepper' && source !== 'hw' && STEPPER_COMMANDS.includes(prop))) {
      this.emit('change', name, prop, v, source);
      if (isVar(el) && prop === 'value' && !isButton(el)) this._schedulePersist();
    }
    if (prop === 'file' && !sameValue(old, v)) { r._mtime = undefined; this._readLong(el, r); }
    if (!sameValue(old, v) && source !== 'port') this._takePort(el, prop, v);
    if (SOUND_TYPES.includes(el.type) && !sameValue(old, v)) {
      if (prop === 'active') r._since = ++this._soundSeq;
      if (['active', 'soundmode', 'sound', 'path', 'fileindex'].includes(prop)) this.arbitrateSound();
      if (prop === 'at' || prop === 'before') r._left = undefined;
    }
    // Momentary button: true for a moment (100 ms unless set), then off again
    if (prop === 'value' && v === true && el.type === 'gKonstant' && el.kind === 'momentary') {
      clearTimeout(this._pulses.get(name));
      this._pulses.set(name, setTimeout(() => { this._pulses.delete(name); if (this.rt.get(name) === r) this.setProp(name, 'value', false, 'pulse'); }, Math.max(10, Number(el.pulseMs) || 100)));
    }
    return v;
  }

  // Fritz, 2026-10-23: outputs sharing a port (a Hysteresis and a PID on one heater): the one turned on or enabled last wins,
  // so the others on that port are turned off
  _takePort(el, prop, v) {
    if (!SHARED_PORT_TYPES.includes(el.type)) return;
    const control = ['dutyCycle', 'hysteresis', 'pid'].includes(el.type);
    const on = control ? prop === 'enabled' && v === true : el.type === 'digitalOut' ? prop === 'state' && v === true : prop === 'value' && Number(v) > 0;
    if (!on) return;
    for (const o of portSharers(el, [...this.els.values()])) {
      if (!SHARED_PORT_TYPES.includes(o.type)) continue;
      if (['dutyCycle', 'hysteresis', 'pid'].includes(o.type)) { if (this.getProp(o.name, 'enabled')) this.setProp(o.name, 'enabled', false, 'port'); }
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
  _schedulePersist() {
    clearTimeout(this._persistTimer);
    this._persistTimer = setTimeout(() => this.persistNow(), 1500);
  }
  persistNow() {
    const o = {};
    for (const el of this.els.values()) {
      if (isVar(el) && !isButton(el) && !isLongFile(el)) { const v = this.rt.get(el.name).value; o[el.name] = v?.toJSON ? v.toJSON() : v; }
    }
    fs.mkdirSync(this.dataDir, { recursive: true });
    fs.writeFileSync(this.statePath, JSON.stringify(o, null, 1));
  }

  // ---- layout / element edits from the browser ----
  saveLayout(update) {
    const c = this.config;
    if (update.workspaces) c.workspaces = checkIds(update.workspaces, 'tab');
    if (update.graphics) c.graphics = update.graphics;
    if (update.probes) c.probes = cleanProbes(update.probes);
    if (update.elements) {
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
      this.els.clear(); this.rt.clear(); this.byKey.clear();
      for (const el of c.elements) {
        this._addRuntime(el);
        const old = keep.get(was.get(el.name) ?? el.name);
        if (old) {
          const r = this.rt.get(el.name);
          for (const k of ['value', 'state', 'active', 'playing', 'path', 'running', 'total', 'count', 'raw', 'setpoint', 'heat', 'pump', 'timer', 'volume', 'reading', 'message', 'waiting', 'position', 'steps', 'homed', 'moving', 'target']) {
            if (!(k in old && k in r) || (k === 'value' && (isLongFile(el) || isButton(el)))) continue;
            r[k] = (k === 'value' && isVar(el)) ? coerce(el.dataType, old[k], el.precision) : old[k];
          }
        }
      }
      for (const [from, to] of update.renames ?? []) { const k = this.els.get(to)?.[KEY]; if (k) this.former.set(from, k); }
      this.persistNow();
      for (const r of this.rt.values()) if ('playing' in r) r._since ??= 0;
      this.arbitrateSound();
    }
    if (update.graphics || update.elements) this._addTexts();
    migrateProbes(c);
    addKeys(c);
    linkClones(c.graphics, c.elements);      // Cloned Devices follow their parent by its key (lib/clones.js)
    this.writeConfig();
    this.emit('config');
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
