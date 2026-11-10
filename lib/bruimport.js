// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The NEW BruControl import function (Rule 15.4, Fritz 2026-11-06): "I want to build the import step by step ... start a new
// import function and we will build it." It does not use the old import method (lib/brucontrol.js, described in
// docs/BruControl_Old_Import_Method.md). It only shares the XML reader and the Panel's own naming Rules (public/naming.js),
// so what it makes matches the Panel.
//
// Built so far (Fritz, 2026-11-06):
//  1. Interfaces: the BruControl boards (Devices).
//  2. Tabs: the BruControl workspaces, without their backgrounds ("Do not worry about the Background of a workspace").
//  3. Items on a board port: "At first only import Elements that have an Interface and Port." Named the Skynet way (Rule 3.1),
//     or keeping the BruControl name after two warnings (Rule 15.1). DisplayName is the Label; a blank one: Label = Name, not
//     shown on the Tab.
//  4. Placeholders: "for anything on a Workspace that has not yet been imported, just place a Place Holder", where BruControl
//     had it, at its size. A hidden one stays hidden.
//  5. Pictures and Sounds (Fritz, 2026-11-06): "The Picture Paths and Sounds are imported. The files stay where they were so
//     BruControl continues to work normally. You do have the option of copying those files to a new folder that consolidates
//     all the picture files and sound files ... They are never deleted in their original spot, just copies made."
//     By default each item keeps the path BruControl saved (any folder: BruControl had a Browse box). With opts.copy, each file
//     is COPIED (never moved) to media/Images/User (pictures) or media/sounds/User (sounds) and the item points to the copy.
//     The caller checks and copies the files (opts.media); a file that is not on the computer is listed, its path kept.
// Processes, and everything else BruControl has, come in later steps.
import { parseXml, isoSeconds, calibrations } from './brucontrol.js';
import { bruTimeFormat } from '../public/timeformat.js';
import { bruGauge } from '../public/dial.js';
import { assignIds, defaultCode, suggestName, uniqueName, oneWirePort, cloneName, suggestWidgetName, WIDGET_TYPE_IDS, widgetTypeId } from '../public/naming.js';
import { PROCESS_WIDGET_TYPE, PROCESS_WIDGET_WORD, PROCESS_WIDGET_CODE } from '../public/processwidget.js';
import { argbHex } from '../public/chart.js';
import { TYPE_METHOD, heatMethodWord, heatHysProblem, heatHysRange } from '../public/heatmethod.js';
import { canControl, setBoolStyle, isBoolStyle, boolStyleOf } from '../public/semi.js';
import { TILT_COLOR_NAMES } from '../public/hydrometer.js';
import { connOf } from '../public/links.js';

// Show Secondary Value off -> the Data Display pick (Rule 6.26): BruControl's Primary Value of each kind
const SECONDARY_OFF = { pid: 'output', deadband: 'output', hysteresis: 'state', flowMeter: 'rate', pwmOut: 'value', analogOut: 'value' };

// ---- reading the XML
const kid = (n, t) => n?.children.find(c => c.tag === t);
const kids = (n, t) => n?.children.filter(c => c.tag === t) ?? [];
const txt = (n, p) => { const k = p.split('/').reduce((x, t) => kid(x, t), n); return k && !k.nil ? k.text.trim() : ''; };
const num = (n, p, d = null) => { const v = parseFloat(txt(n, p)); return Number.isFinite(v) ? v : d; };
const yes = (n, p) => txt(n, p).toLowerCase() === 'true';

// The BruControl pin kinds this step brings in, and the Skynet Device type each one becomes. A pin kind not listed here
// (for now SPISensorPort and CounterInPort) is a Placeholder until we decide it.
export const PORT_KINDS = {
  DigitalOutPort: 'digitalOut', DigitalInPort: 'digitalIn', AnalogInPort: 'analogIn', PWMOutPort: 'pwmOut', OWTempPort: 'temperature',
  DutyCyclePort: 'dutyCycle', HysteresisPort: 'hysteresis', PIDPort: 'pid', DeadbandPort: 'deadband',
};
// BruControl's Hydrometer Input (a Tilt, its TILT Color) becomes a Skynet Hydrometer Device (OakBarn Brewery, 2026-11-09, Rule 6.25),
// a Tilt with the same color, on the same virtual port (200, 201 ...). Its pin kind is found by its name (HydrometerPort, TiltPort ...).
export const portType = kind => PORT_KINDS[kind] ?? (/hydro|tilt/i.test(String(kind ?? '')) ? 'hydrometer' : undefined);
// a Tilt color as BruControl saves it: its name (Red) or its place in the list (0 = Red)
export function tiltColorOf(p) {
  const c = p?.children?.find(k => /colou?r/i.test(k.tag) && !k.nil)?.text?.trim() ?? '';
  if (/^\d+$/.test(c)) return TILT_COLOR_NAMES[+c] ?? '';
  return TILT_COLOR_NAMES.find(n => n.toLowerCase() === c.toLowerCase()) ?? '';
}
// the items that show a number, so they can show a gauge (an on / off output can't)
// a BruControl control port's settings and the Skynet keys they go to (public/heatmethod.js HEAT_SETTINGS)
const CONTROL_SETTINGS = [['Target', 'target'], ['Kp', 'kp'], ['Ki', 'ki'], ['Kd', 'kd'], ['MaxOutput', 'maxOutput'], ['MaxIntegral', 'maxIntegral'],
  ['CalcTime', 'calcTime'], ['OutTime', 'outTime'], ['OnOffset', 'onOffset'], ['OnDelay', 'onDelay'], ['DutyCycle', 'dutyCycle'], ['Interval', 'interval'],
  ['DeadbandOffset', 'deadbandOffset'], ['InnerBandOffset', 'innerBandOffset'], ['InitialOutput', 'initialOutput'], ['InnerBandDrive', 'innerBandDrive'], ['OuterBandDrive', 'outerBandDrive']];
// Pumps (Rule 5.27): found by their name, made Skynet Pump Devices with the standard drawing
const PUMP_WORD = /pump|chugger|riptide|march\b|whirlpool/i;
export const PUMP_PICTURE = 'Images/Skynet/Pumps/Pump_Red_Rip_Off.svg', PUMP_OVERLAY = 'Images/Skynet/On_Off/Overlay_Glow_Ring.svg';
const NUMBER_KINDS = new Set(['analogIn', 'temperature', 'pwmOut', 'dutyCycle', 'pid', 'deadband']);
export const PLACEHOLDER_MARK = '⬚';
// BruControl's Application Elements (the items not tied to an Interface) and the Skynet Widget each one becomes (OakBarn Brewery,
// 2026-11-08: "Import all BruControl Application Elements ... as Skynet equivalent Widgets"). [Skynet type, the page they are on,
// the Widget's name in words]. A BruControl Inspector has no Skynet Widget: it stays a Placeholder. Globals are only listed.
export const APP_WIDGETS = {
  TimerElement: ['timer', 'Timers', 'Timer Widget'], AlarmElement: ['alarm', 'Alarms', 'Alarm Widget'],
  ToggleSwitchElement: ['switch', 'Switches', 'Boolean Widget'], ScriptElement: [PROCESS_WIDGET_TYPE, 'Scripts', PROCESS_WIDGET_WORD],      // a Process Widget (OakBarn Brewery, 2026-11-09, Rule 1.31)
};
// a BruControl Time (TimeSpan) or DateTime Global keeps its Format for the Time or DateTime Widget it becomes (Rule 2.45); Globals are
// listed only for now, so this rides along in the list until they are imported
const globalFormat = e => { const k = txt(e, 'VariableType'), f = bruTimeFormat(txt(e, 'Format'));
  return /^(TimeSpan|DateTime)$/i.test(k) ? { kind: /date/i.test(k) ? 'datetime' : 'time', widget: /date/i.test(k) ? 'dateTimeWidget' : 'timeWidget', ...(f ? { showAs: f } : {}) } : {}; };
const hms = s => { s = Math.max(0, Math.round(s)); return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(n => String(n).padStart(2, '0')).join(':'); };      // the dashed box at the start of a Placeholder's text

// Step 1: a BruControl board becomes an Interface
function readInterface(d) {
  const link = txt(d, 'Interface'), net = /tcp|network|ethernet|wifi/i.test(link), sp = txt(d, 'SerialPort');
  const type = txt(d, 'TypeName');
  return {
    name: txt(d, 'Name') || 'Interface',
    ...(net ? { connection: 'esp32', host: txt(d, 'Address'), port: num(d, 'Port', 5000) }
      : { connection: 'serial', port: /^\d+$/.test(sp) ? 'COM' + sp : sp, baud: num(d, 'BaudRate', 115200) }),
    board: /esp/i.test(type) ? 'esp32' : /mega/i.test(type) ? 'mega' : 'other',
    enabled: !/^false$/i.test(txt(d, 'Enabled')),
    bru: { id: txt(d, 'ID'), interface: link, typeName: type },
  };
}

// The consolidated folders (the option): media/Images/User for pictures, media/sounds/User for sounds. Two different files
// with the same file name get _2, _3 ...; the same file (any capitals) is copied once.
export const USER_PICTURES = 'Images/User';
export const USER_SOUNDS = 'sounds/User';
export function pictureNamer(folder = USER_PICTURES) {
  const byFrom = new Map(), used = new Set();
  return from => {
    const key = String(from).trim().toLowerCase();
    if (byFrom.has(key)) return byFrom.get(key);
    const file = String(from).trim().split(/[\\/]/).pop() || 'file';
    const dot = file.lastIndexOf('.'), stem = dot > 0 ? file.slice(0, dot) : file, ext = dot > 0 ? file.slice(dot) : '';
    let name = file, i = 2;
    while (used.has(name.toLowerCase())) name = `${stem}_${i++}${ext}`;
    used.add(name.toLowerCase());
    const to = `${folder}/${name}`;
    byFrom.set(key, to);
    return to;
  };
}

// names: 'skynet' (the default) or 'bru' (keep the BruControl names: only after the two warnings, Rule 15.1)
// copy: also copy every picture and sound into the consolidated folders (the option; off by default)
// media(from, to): to is null when not copying: say whether the file is there (true/false). With a to: copy it there.
export function importBruControl(xml, { names = 'skynet', copy = false, media = () => true, ids = {}, labels = {}, shows = {}, styles = {}, links = {} } = {}) {
  const doc = parseXml(String(xml).replace(/^\uFEFF/, ''));
  const cfg = kid(doc, 'Configuration');
  if (!cfg) throw new Error('This is not a BruControl config file (it has no <Configuration>).');
  const notes = [];
  // ---- 5. pictures and sounds: each one checked (and, with copy, copied) once, by the caller
  const files = new Map(), namers = { picture: pictureNamer(USER_PICTURES), sound: pictureNamer(USER_SOUNDS) };
  const use = (kind, from) => {
    from = String(from ?? '').trim(); if (!from) return '';
    const key = kind + '|' + from.toLowerCase();
    if (!files.has(key)) {
      const to = copy ? namers[kind](from) : null;
      files.set(key, { kind, from, path: to ?? from, found: media(from, to) !== false });
    }
    return files.get(key).path;
  };
  const picsOf = e => {
    const ap = kid(e, 'Appearance');
    const bg = kids(kid(ap, 'BackgroundImages'), 'string').map(x => (x.nil ? '' : x.text.trim())).map(f => use('picture', f));
    const more = ['OnImagePath', 'OffImagePath'].map(t => use('picture', txt(e, t)));
    const sounds = ['SoundFile', 'SoundFile2', 'SoundFile3'].map(t => use('sound', txt(e, t)));
    return { bg, on: more[0], off: more[1], sounds, index: num(ap, 'BackgroundImageIndex', 0) };
  };

  // ---- 1. Interfaces, and every pin by its BruControl ID
  const devices = [], pins = new Map();
  for (const d of kids(kid(cfg, 'Devices'), 'Device')) {
    const dev = readInterface(d);
    devices.push(dev);
    for (const p of kids(kid(d, 'Ports'), 'DevicePort')) pins.set(txt(p, 'ID'), { dev, p, kind: p.type });
  }

  // ---- 2. Tabs (no backgrounds)
  const wsNodes = kids(kid(cfg, 'Workspaces'), 'Workspace');
  const workspaces = wsNodes.map(w => ({ name: txt(w, 'Name') || 'Tab', ...(yes(w, 'Hidden') ? { hidden: true } : {}) }));
  // the brewer's own Interface IDs, typed on the Importer's ID page (OakBarn Brewery, 2026-11-08); a bad or taken one gets the usual ID
  for (const d of devices) if (typeof ids?.[d.name] === 'string' && ids[d.name].trim()) d.id = ids[d.name].trim().toUpperCase();
  assignIds({ devices, workspaces });          // Interface IDs and Tab IDs, the same way the Panel gives them (Rule 3.2)
  const tabOf = new Map(workspaces.map(w => [w.name, w]));

  // ---- 3. items on a board port, 4. a Placeholder for everything else
  const elements = [], graphics = [], renames = [], taken = new Set(), byKind = {}, globals = [], widgets = [];
  const size = { w: 0, h: 0 }, gauges = {}, charts = [], pumpPics = new Map();
  let pumps = 0;
  const primaryOnly = [];  // Show Secondary Value off: Data Display shows only the Primary Value (Rule 6.26)
  const emailed = [];      // Alarms with BruControl's Email Notification on (Rule 7.17)
  const pwmCals = [];      // PWM outputs whose BruControl calibrations were not copied (Rule 6.24)
  const smoothed = [];     // readings that kept BruControl's Avg Weight as their Smoothing (Rule 6.24)
  const coolPumps = [];
  wsNodes.forEach((w, wi) => {
    const tab = workspaces[wi];
    let maxX = 0, maxY = 0, z = 0;
    for (const e of kids(kid(w, 'Elements'), 'Element')) {
      // Layer Order (Rule 1.29, OakBarn Brewery 2026-11-09: "Have Skynet work the same as BruControl"): BruControl's Z Order is the
      // order of its Elements list (its file has no Z Order field), the first one on top: Layer Order 1, the next 2 ...
      const place = { x: num(e, 'X', 0), y: num(e, 'Y', 0), w: num(e, 'Width', 100), h: num(e, 'Height', 60), layer: ++z };
      maxX = Math.max(maxX, place.x + place.w); maxY = Math.max(maxY, place.y + place.h);
      if (e.type === 'ChartElement') { charts.push({ e, tab, place }); continue; }
      // Globals are only LISTED for now (OakBarn Brewery, 2026-11-08: "Globals will be dealt with later. For now, only list them"):
      // no Placeholder, no question; the list is on the Boards and Tabs summary and in the Schema's import report
      if (e.type === 'GlobalVariableElement') { globals.push({ name: txt(e, 'Name') || '(no name)', tab: tab.name, id: txt(e, 'ID'), ...globalFormat(e) }); continue; }      // made after every item has its Skynet name
      const pin = e.type === 'DeviceElement' ? pins.get(txt(e, 'PortID')) : null;
      const type = pin && portType(pin.kind);
      if (type) elements.push(portItem(e, pin, type, tab, place));
      else if (APP_WIDGETS[e.type]) widgets.push({ e, tab, place });       // made once every item has its Skynet name
      else graphics.push(placeholder(e, tab, place, pin));
    }
    tab.width = Math.max(800, Math.ceil(maxX / 10) * 10 + 20);
    tab.height = Math.max(600, Math.ceil(maxY / 10) * 10 + 20);
    size.w = Math.max(size.w, tab.width); size.h = Math.max(size.h, tab.height);
  });

  function portItem(e, { dev, p, kind }, type, tab, place) {
    const bruName = txt(e, 'Name') || '(no name)', display = txt(e, 'DisplayName');
    const el = { name: bruName, type, workspace: tab.name, ...place, device: dev.name, channel: num(p, 'Number', 0) };
    if (/^false$/i.test(txt(p, 'Enabled'))) el.enabled = false;
    // DisplayName is the Label; a blank one: the Label is the Name and it is not shown on the Tab (Fritz, 2026-11-06)
    if (display) el.label = display; else { el.label = bruName; el.hideName = true; }
    if (/^hidden$/i.test(txt(e, 'Appearance/NameVisibility'))) el.hideName = true;      // BruControl did not show its name on the Tab
    // the user's own Label from the items page (OakBarn Brewery, 2026-11-08), by the BruControl element ID: it is the Label part of the
    // suggested Skynet name; a space becomes ~ in the name
    const own = labels?.[txt(e, 'ID')];
    if (typeof own === 'string' && own.trim()) el.label = own.trim().slice(0, 40);
    showLabel(el, txt(e, 'ID'));
    if (/hidden/i.test(txt(e, 'Appearance/Visibility'))) el.visibility = 'hidden';
    // Data Display (Rule 6.26): BruControl's Show Secondary Value switched off shows only its Primary Value
    if (/^false$/i.test(txt(e, 'Appearance/ShowSecondaryValue') || txt(e, 'ShowSecondaryValue')) && SECONDARY_OFF[type]) { el.display = SECONDARY_OFF[type]; primaryOnly.push(bruName); }
    const pics = picsOf(e);       // BruControl's 3 background pictures are .backpath, .backpath_2, .backpath_3; .background picks one
    ['backpath', 'backpath_2', 'backpath_3'].forEach((k, i) => { if (pics.bg[i]) el[k] = pics.bg[i]; });
    if (pics.bg.some(Boolean)) { el.background = Math.max(1, Math.min(3, pics.index)); el.backpathsImported = true; }
    if (type === 'temperature') { const i = num(p, 'SensorIndex'); if (i !== null) el.probeIndex = i + 1; }
    if (type === 'hydrometer') {      // Rule 6.25: a Tilt (a Tilt Pro when BruControl says so), told apart by its color
      const pro = /pro/i.test(`${kind} ${txt(p, 'Type')} ${txt(p, 'HydrometerType')}`);
      Object.assign(el, { model: pro ? 'tiltPro' : 'tilt', connection: 'bluetooth', gravityUnits: 'SG', tempUnits: '°F', precision: pro ? 4 : 3, w: 190 });
      const c = tiltColorOf(p); if (c) el.color = c;
      if (el.channel < 200) el.channel = 200 + Math.max(0, el.channel);      // a virtual port as BruControl numbers them (Rule 6.2)
    }
    // a control port's own settings come over (Rule 6.19 keeps them on the one Heating Element), and its probe: BruControl's
    // InputPortID becomes .input once every item has its Skynet name (the SetPoint click, Rule 2.43, finds it by .input)
    for (const [tag, key] of CONTROL_SETTINGS) { const v = num(p, tag); if (v !== null) el[key] = v; }
    // Calibrations and their Text Format (OakBarn Brewery, 2026-11-09, Rule 6.24: "similar to other programs and not proprietary to
    // BruControl"): a reading's layered calibrations come over as they are (an Analog In from its raw reading, a probe after its
    // temperature), with Decimal Places, Prefix and Suffix (Skynet's Units). A PWM output's are not copied: BruControl counts it 0-255,
    // Skynet in % (listed in the notes). Both programs: the Panel's Properties show the same list in plain boxes
    {
      const cv = kid(p, 'CalValue') ?? kid(p, 'Temperature');
      if (cv && (type === 'analogIn' || type === 'temperature')) {
        const cals = calibrations(cv); if (cals.length) el.calibrations = cals;
        const dec = num(cv, 'Precision'); if (dec !== null && dec >= 0) el.precision = Math.min(6, Math.round(dec));
        if (txt(cv, 'Prefix')) el.prefix = txt(cv, 'Prefix');
        if (txt(cv, 'Suffix')) el.units = txt(cv, 'Suffix');
      } else if (cv && type === 'pwmOut' && calibrations(cv).length) pwmCals.push(bruName);
      // Smoothing (Rule 6.24): BruControl's Avg Weight is Skynet's Smoothing %, on every reading that has it
      const aw = num(p, 'AvgWeight');
      if (aw !== null && aw > 0 && (type === 'analogIn' || type === 'temperature')) { el.avgWeight = Math.min(100, aw); if (aw < 100) smoothed.push(bruName); }
    }
    // Dual Throw (OakBarn Brewery, 2026-11-09, Rule 6.22): BruControl's DualThrowPortNum (-1 = none) is the second Port, the opposite of
    // this one; DualThrowDelay (ms) the wait between them. Both programs: the Panel's ⬢ Pin attributes hold the same two settings
    if (type === 'digitalOut') {
      const dt = num(p, 'DualThrowPortNum', -1);
      if (dt >= 0 && dt !== el.channel) { el.dualThrowChannel = dt; el.dualThrowDelay = Math.max(0, num(p, 'DualThrowDelay', 0)); }
    }
    const inPort = txt(p, 'InputPortID'); if (inPort) el.inputPortId = inPort;
    // BruControl "not user controlled": a click does nothing (Rule 2.44 keeps the user's own choice). Only for things a click turns
    // On or Off or sets; a probe's click opens its SetPoint (Rule 2.43)
    if (/^false$/i.test(txt(e, 'UserControl')) && type !== 'temperature' && type !== 'analogIn') el.tap = 'none';
    const look = gaugeLook(e, type);
    if (look) { Object.assign(el, look.el); gauges[look.kind] = (gauges[look.kind] ?? 0) + 1; }
    // a pump is a Skynet Pump Device that follows the Pump Standard (Rule 5.27, OakBarn Brewery 2026-11-08: "if we import a BruControl
    // have it conform to the newest standard"): the Skynet pump drawing in the 300 x 300 box shown 150 x 150, so its inlet and outlet
    // IPs sit in the standard spots and any Skynet pump swaps in. BruControl's own pictures are kept in .bru.pictures.
    // a Cool / Warm Pump (OakBarn Brewery, 2026-11-08, Rule 6.21): a pump that BruControl ran by a Hysteresis (or another control) on
    // its port is ONE Pump with a Method (One Port, One Device), Type ID CPMP; its settings and probe come with it
    if (type in TYPE_METHOD && type !== 'digitalOut' && PUMP_WORD.test(`${el.label} ${bruName}`)) { el.type = 'digitalOut'; el.heatMethod = TYPE_METHOD[type]; coolPumps.push(el); }
    if (el.type === 'digitalOut' && PUMP_WORD.test(`${el.label} ${bruName}`)) {
      const kept = ['backpath', 'backpath_2', 'backpath_3'].map(k => el[k]).filter(Boolean);
      for (const k of ['backpath', 'backpath_2', 'backpath_3', 'background', 'backpathsImported']) delete el[k];
      Object.assign(el, { subtype: 'pump', w: 150, h: 150, imageOff: PUMP_PICTURE, imageOverlay: PUMP_OVERLAY, cover: 'None', hideValue: true, onText: 'ON', offText: 'OFF' });
      if (!el.tap) el.tap = 'toggle';
      if (kept.length) pumpPics.set(el, kept);
      pumps++;
    }
    el.typeCode = defaultCode(el);
    if (names === 'skynet') {
      const port = type === 'temperature' && el.probeIndex ? oneWirePort(el.probeIndex) : String(el.channel);
      el.name = uniqueName(suggestName({ iface: dev.id, port, code: el.typeCode, label: el.label, tab: tab.id }), isTaken, tab.id);
    } else el.name = uniqueName(bruName.replace(/[<>:"/\\|?*]/g, '~').replace(/\s+/g, '_'), isTaken);     // Rule 3.4 and spaces still change
    taken.add(el.name.toLowerCase());
    if (el.name !== bruName) renames.push({ from: bruName, to: el.name });
    el.bru = { id: txt(e, 'ID'), name: bruName, ...(display ? { display } : {}), portId: txt(p, 'ID'), portKind: kind, ...(look ? { gauge: look.bru } : {}), ...(pumpPics.has(el) ? { pictures: pumpPics.get(el) } : {}) };
    return el;
  }
  // BruControl's gauges are DevExpress drawings Skynet never copies (Fritz, 2026-11-07, Rule 2.40). Each one comes over as the
  // closest Skynet look: a round or bar gauge as the Skynet Dial, with its lowest and highest numbers; digits as LCD digits.
  // Its decimals come too. The DevExpress style name is only kept in .bru, for the record.
  function gaugeLook(e, type) {
    const ap = kid(e, 'Appearance'), kind = txt(ap, 'DisplayKind');
    if (!/Gauge$/.test(kind) || !NUMBER_KINDS.has(type)) return null;
    const o = kid(ap, kind + 'Options'), out = {};
    const dec = num(ap, 'TextDisplayOptions/Precision');
    if (dec !== null) out.precision = Math.max(0, Math.min(2, Math.round(dec)));
    // its lowest and highest numbers, tick marks, shape or direction, and the nearest Skynet color style (Rule 2.40 point 4)
    Object.assign(out, bruGauge(kind, gaugeOpts(o)));
    return { kind: out.look, el: out, bru: { kind, style: txt(o, 'Style') } };
  }
  function gaugeOpts(o) { return Object.fromEntries((o?.children ?? []).map(c => [c.tag[0].toLowerCase() + c.tag.slice(1), c.text.trim()])); }
  function safeBru(n) { return String(n).trim().replace(/[<>:"/\\|?*]/g, '~').replace(/\s+/g, '_'); }
  function isTaken(n) { return taken.has(String(n).toLowerCase()); }
  // the Show box on the items and Widget pages (OakBarn Brewery, 2026-11-08): ticked = the Label is shown on the Tab
  function showLabel(el, id) { const v = shows?.[id]; if (v === true) delete el.hideName; else if (v === false) el.hideName = true; }

  function placeholder(e, tab, place, pin) {
    const name = txt(e, 'Name') || '(no name)', kind = String(e.type || 'Element').replace(/Element$/, '') || 'Element';
    const why = e.type === 'DeviceElement' ? (pin ? `${pin.kind} pins come later` : 'its pin is not in the file') : 'not imported yet';
    const key = e.type === 'DeviceElement' ? `Device (${pin ? pin.kind : 'no pin'})` : kind;
    byKind[key] = (byKind[key] ?? 0) + 1;
    const pics = picsOf(e), list = [...pics.bg, pics.on, pics.off].filter(Boolean), snd = pics.sounds.filter(Boolean);
    return {
      id: `ph_${graphics.length + 1}`, kind: 'text', workspace: tab.name,
      x: place.x, y: place.y, w: Math.max(60, place.w), h: Math.max(30, place.h), layer: place.layer,
      text: `${PLACEHOLDER_MARK} ${name}`, fontSize: 12, color: '#555555', backColor: '#EDEDED',
      ...(/hidden/i.test(txt(e, 'Appearance/Visibility')) ? { visible: false } : {}),
      placeholder: { bruName: name, bruType: e.type || '', bruKind: key, bruId: txt(e, 'ID'), why, ...(list.length ? { pictures: list } : {}), ...(snd.length ? { sounds: snd } : {}) },
    };
  }

  // ---- One Heating Element, the heating method picked (Fritz, 2026-11-07, Rule 6.19). BruControl controls one physical element
  // with two Devices on the same port (Tartan.brucfg: "M_HLT Heat" Duty Cycle and "HLT PID" on port 42). In Skynet that is ONE
  // Heating Element: its heating method is picked by a Process or a click. The first one becomes the Heating Element, starting in
  // its method; every one of them is listed in .heatControls, so a Process that still says "HLT_PID" switches it to PID. A second
  // one placed on a Tab becomes a Clone of the Heating Element there.
  const merged = mergeHeaters();

  // ---- each control's probe by its Skynet name (BruControl InputPortID, a port ID)
  {
    const byPort = new Map(elements.filter(x => x.bru?.portId).map(x => [x.bru.portId, x.name]));
    for (const el of elements) if (el.inputPortId) { const n = byPort.get(el.inputPortId); if (n) el.input = n; delete el.inputPortId; }
  }

  // ---- 5b. BruControl Application Elements become Skynet Widgets (OakBarn Brewery, 2026-11-08), named the Skynet way (Rule 3.14,
  // wgt_TMR_Mash~Timer_BR). Like the items on a board port: the DisplayName is the Label (the user's own Label from the Widget pages
  // wins), the Show box says whether the Label is shown, and what BruControl had is kept in .bru.
  const portByIdName = new Map(elements.filter(x => x.bru?.portId).map(x => [x.bru.portId, x.name]));
  // BruControl's Scripts by their ID, for the Process Widgets (Rule 1.31)
  const scriptNames = new Map(kids(kid(cfg, 'Processes'), 'Process').map(p => [txt(p, 'ID'), txt(p, 'Name')]).filter(([id, n]) => id && n));
  const appMade = [];
  const timerAlarms = [];
  for (const { e, tab, place } of widgets) {
    const [type, page, what] = APP_WIDGETS[e.type];
    const bruName = txt(e, 'Name') || '(no name)', display = txt(e, 'DisplayName');
    const el = { name: bruName, type, workspace: tab.name, ...place, label: display || bruName };
    if (!display || /^hidden$/i.test(txt(e, 'Appearance/NameVisibility'))) el.hideName = true;
    const own = labels?.[txt(e, 'ID')];
    if (typeof own === 'string' && own.trim()) el.label = own.trim().slice(0, 40);
    showLabel(el, txt(e, 'ID'));
    if (/hidden/i.test(txt(e, 'Appearance/Visibility'))) el.visibility = 'hidden';
    const bru = { id: txt(e, 'ID'), name: bruName, ...(display ? { display } : {}), elementType: e.type };
    if (type === 'timer') {
      el.timerType = /down/i.test(txt(e, 'Type')) ? 'countdown' : 'countup';
      const rv = isoSeconds(txt(e, 'ResetValue')); if (rv) el.resetValue = hms(rv);
      const v = isoSeconds(txt(e, 'Value')); if (v) el.initial = hms(v);
      if (yes(e, 'InitRunning')) el.initRunning = true;
      { const f = bruTimeFormat(txt(e, 'Format')); if (f) el.timerFormat = f === 'hh:mm' ? 'hm' : f; }      // its Format (Rule 2.45)
      timerAlarms.push({ el, e });      // its 2 TimerAlarms are joined to their Alarms below (Timer Alarm Chain, Rule 7.16)
    } else if (type === 'alarm') {
      el.loop = yes(e, 'Loop');
      if (yes(e, 'EmailNotification')) { el.emailNotify = true; emailed.push(el.name); }      // Alarm Email (Rule 7.17): the mail server is picked in Skynet's Settings
      el.sounds = ['SoundFile', 'SoundFile2', 'SoundFile3'].map(k => use('sound', txt(e, k)));
      el.fileIndex = Math.max(1, Math.min(3, num(e, 'FileIndex', 1)));
      el.sound = el.sounds[el.fileIndex - 1] || el.sounds.find(Boolean) || '';
      const out = portByIdName.get(txt(e, 'DigitalOutputID')); if (out) el.output = out;
    } else if (type === PROCESS_WIDGET_TYPE) {
      // the Process Widget (Rule 1.31): the BruControl Script it shows and starts, by its name in the file. The Script itself becomes a
      // Process of that name when the Processes come in; until then the Widget says "No such Process". BruControl's variable is kept.
      bru.script = txt(e, 'ProcessID'); bru.variable = txt(e, 'VariableName');
      el.process = scriptNames.get(bru.script) ?? '';
    } else if (type === 'switch') {
      // a Toggle Switch is a Boolean Widget (Rule 1.20, OakBarn Brewery 2026-11-09): its Style from the Switches page (Switch to
      // start), and its Linked Device, an imported Device with an ON / OFF state, which it then acts like a Clone of
      const st = styles?.[txt(e, 'ID')]; if (isBoolStyle(st)) setBoolStyle(el, st);
      const ln = links?.[txt(e, 'ID')], d = ln && elements.find(x => x.bru?.id === ln);
      if (d && canControl(d)) el.deviceControlled = d.name;
    }
    if (/^false$/i.test(txt(e, 'UserControl'))) el.tap = 'none';
    if (names === 'skynet') el.name = uniqueName(suggestWidgetName({ code: widgetTypeId(el) || (type === PROCESS_WIDGET_TYPE ? PROCESS_WIDGET_CODE : ''), label: el.label, tab: tab.id }), isTaken, tab.id);
    else el.name = uniqueName(safeBru(bruName), isTaken);
    taken.add(el.name.toLowerCase());
    if (el.name !== bruName) renames.push({ from: bruName, to: el.name });
    el.bru = bru;
    elements.push(el);
    appMade.push({ bruId: bru.id, bru: bruName, display, noDisplay: !display, show: !el.hideName, label: el.label, name: el.name, tab: tab.name, page, widget: what, type: el.type,
      ...(type === 'switch' ? { style: boolStyleOf(el), link: links?.[bru.id] && el.deviceControlled ? links[bru.id] : '' } : {}),
      pre: 'wgt_' + widgetTypeId(el), tabId: tab.id });
  }
  if (appMade.length) notes.push(`${appMade.length} BruControl Application Element(s) (not on a board) are now Skynet Widgets: ${Object.entries(appMade.reduce((m, x) => ({ ...m, [x.widget]: (m[x.widget] ?? 0) + 1 }), {})).map(([k, n]) => `${n} ${k}(s)`).join(', ')}.`);
  // The Timer Alarm Chain (Rule 7.16; OakBarn Brewery, 2026-11-09): a BruControl Timer has 2 TimerAlarms, each naming an Alarm and
  // the time (Threshold) it goes off. Skynet puts the time on the Alarm instead: the Alarm becomes a Hop Alarm on that Timer, the first
  // time is its own time, and each other time is a step on its Alarm Chain (no limit on how many a Timer has in Skynet).
  const timerJoined = [], timerSkipped = [];
  for (const { el: t, e } of timerAlarms) {
    for (const ta of kids(kid(e, 'Alarms'), 'TimerAlarm')) {
      const id = txt(ta, 'AlarmID');
      if (!id || /^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(id) || !yes(ta, 'Enabled')) continue;
      const a = elements.find(x => x.type === 'alarm' && x.bru?.id === id), at = hms(isoSeconds(txt(ta, 'Threshold')) ?? 0);
      if (!a) { timerSkipped.push(`${t.name} (its Alarm is not in this file)`); continue; }
      if (a.timer && a.timer !== t.name) { timerSkipped.push(`${t.name} at ${at} -> ${a.name} (already on ${a.timer}; join it by hand)`); continue; }
      if (!a.timer) { a.kind = 'hop'; a.timer = t.name; a.at = at; }
      else if (a.at !== at && !(a.chain ?? []).some(s => s.at === at)) (a.chain ??= []).push({ label: `At ${at}`, at });
      else continue;
      timerJoined.push(`${t.name} at ${at} -> ${a.name}`);
    }
  }
  if (timerJoined.length) notes.push(`${timerJoined.length} BruControl Timer alarm(s) joined to their Alarms (the Alarm is now a Hop Alarm on that Timer; a second time is a step on its Alarm Chain, Rule 7.16): ${timerJoined.join('; ')}.`);
  if (timerSkipped.length) notes.push(`BruControl Timer alarm(s) not joined: ${timerSkipped.join('; ')}.`);

  // ---- 6. Charts (Fritz, 2026-11-08: "build a chart method so we can import BruControl charts"; "Closely match BruControl Chart
  // properties as attributes", Rule 1.26). Each BruControl Chart becomes a Skynet Chart Widget with the same Span, Refresh interval,
  // grid lines, time axis color and its two Channels (the item drawn, Auto scale, axis lowest and highest, line and axis colors).
  // A Channel names a BruControl element or port by its ID; it becomes that item's Skynet name. An item a Chart draws must be sent to
  // the database, so one with no Database setting is set to send its reading every Refresh interval.
  const byId = new Map();
  for (const el of elements) {
    for (const id of [el.bru?.id, el.bru?.portId, ...(el.bru?.merged ?? []).map(m => m.id)]) if (id) byId.set(id, el);
  }
  const holderName = new Map(graphics.filter(g => g.placeholder).map(g => [g.placeholder.bruId, g.placeholder.bruName]));
  const chartMade = [], recorded = new Set(), notInSchema = new Set();
  for (const { e, tab, place } of charts) {
    const bruName = txt(e, 'Name') || 'Chart', display = txt(e, 'DisplayName');
    const el = { name: bruName, type: 'chart', workspace: tab.name, ...place, label: display || bruName };
    // the Widget pages (OakBarn Brewery, 2026-11-08): its Label and Show box, like every other Widget
    if (!display || /^hidden$/i.test(txt(e, 'Appearance/NameVisibility'))) el.hideName = true;
    { const own = labels?.[txt(e, 'ID')]; if (typeof own === 'string' && own.trim()) el.label = own.trim().slice(0, 40); }
    showLabel(el, txt(e, 'ID'));
    if (/hidden/i.test(txt(e, 'Appearance/Visibility'))) el.visibility = 'hidden';
    const span = num(e, 'SpanSeconds'), refresh = num(e, 'RefreshInterval');
    el.spanSeconds = span !== null && span > 0 ? span : 3600;
    el.refreshInterval = refresh !== null && refresh > 0 ? refresh : 60;
    el.hGridLines = Math.max(0, Math.round(num(e, 'ChartAppearance/HGridLines', 0)));
    el.vGridLines = Math.max(0, Math.round(num(e, 'ChartAppearance/VGridLines', 0)));
    const xc = argbHex(txt(e, 'ChartAppearance/XAxisColor')); if (xc) el.xAxisColor = xc;
    const bruCh = [];
    kids(kid(e, 'Channels'), 'ChartChannelOptions').slice(0, 2).forEach((c, k) => {
      const i = k + 1, id = txt(c, 'ChannelID/ElementID');
      el[`ch${i}AutoScale`] = !/^false$/i.test(txt(c, 'AutoScale'));
      const lo = num(c, 'AxisYMin'), hi = num(c, 'AxisYMax');
      if (lo !== null && hi !== null && hi > lo) { el[`ch${i}YMin`] = lo; el[`ch${i}YMax`] = hi; }
      const lc = argbHex(txt(c, 'Appearance/LineColor')), ac = argbHex(txt(c, 'Appearance/AxisColor'));
      if (lc) el[`ch${i}LineColor`] = lc;
      if (ac) el[`ch${i}AxisColor`] = ac;
      if (!id) return;
      const item = byId.get(id);
      if (item) {
        el[`ch${i}Element`] = item.name;
        if (!item.database?.frequency || item.database.frequency === 'none') {
          const r = el.refreshInterval;
          item.database = r >= 60 && r % 60 === 0 ? { frequency: 'minutes', every: r / 60 } : { frequency: 'seconds', every: Math.max(1, Math.round(r)) };
          recorded.add(item.name);
        }
      } else {
        const n = holderName.get(id) || id;      // not imported yet (a Global): the BruControl name, so it joins up when it comes in
        el[`ch${i}Element`] = safeBru(n); notInSchema.add(n);
      }
      bruCh.push({ id, index: num(c, 'ChannelID/Index', 0) });
    });
    if (names === 'skynet') el.name = uniqueName(suggestWidgetName({ code: WIDGET_TYPE_IDS.chart, label: el.label, tab: tab.id }), isTaken, tab.id);
    else el.name = uniqueName(safeBru(bruName), isTaken);
    taken.add(el.name.toLowerCase());
    if (el.name !== bruName) renames.push({ from: bruName, to: el.name });
    el.bru = { id: txt(e, 'ID'), name: bruName, chart: { channels: bruCh } };
    elements.push(el); chartMade.push(el.name);
    appMade.push({ bruId: el.bru.id, bru: bruName, display, noDisplay: !display, show: !el.hideName, label: el.label, name: el.name, tab: tab.name, page: 'Graphs', widget: 'Graph Widget', type: 'chart', pre: 'wgt_' + WIDGET_TYPE_IDS.chart, tabId: tab.id });
  }
  if (chartMade.length) notes.push(`${chartMade.length} BruControl Chart(s) are now Skynet Graph Widgets (Rule 1.26), with the same span, refresh, grid lines, colors and channels.` +
    (recorded.size ? ` So their lines can be drawn, ${recorded.size} item(s) they draw are now sent to the database every Refresh interval: ${[...recorded].join(', ')}.` : '') +
    (notInSchema.size ? ` ${notInSchema.size} item(s) a Graph draws are not imported yet (their line stays empty until they are): ${[...notInSchema].join(', ')}.` : ''));
  function mergeHeaters() {
    const mOf = e => e.heatMethod ?? TYPE_METHOD[e.type];
    const out = [], groups = new Map();
    for (const el of elements) {
      if (!(el.type in TYPE_METHOD)) continue;
      const k = `${el.device}|${el.channel}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(el);
    }
    for (const list of groups.values()) {
      if (list.length < 2 || !list.some(e => e.type !== 'digitalOut' || e.heatMethod)) continue;      // two plain outputs on a port stay as they are (Rule 6.1)
      const first = list.find(e => e.type !== 'digitalOut' || e.heatMethod), dev = devices.find(d => d.name === first.device), tab = workspaces.find(w => w.name === first.workspace);
      // a pump on the port (a Cool / Warm Pump, Rule 6.21) stays a Pump, with a Method; anything else is a Heating Element
      const pump = list.find(e => e.subtype === 'pump') ?? (list.some(e => PUMP_WORD.test(`${e.label} ${e.bru?.name ?? ''}`)) ? list[0] : null);
      const el = pump ? { ...(list.find(e => e.subtype === 'pump') ?? first), type: 'digitalOut', subtype: 'pump', heatMethod: mOf(first) }
        : { ...first, type: 'digitalOut', subtype: 'element', heatMethod: mOf(first) };
      if (pump) { for (const e of list) { const i = coolPumps.indexOf(e); if (i >= 0) coolPumps.splice(i, 1); } coolPumps.push(el); }
      for (const e of list) for (const [, k] of [...CONTROL_SETTINGS, ['', 'inputPortId']]) if (el[k] === undefined && e[k] !== undefined) el[k] = e[k];
      // a Heating Element is Toggle or Push Button, never None (OakBarn Brewery, 2026-11-09, Rule 2.46): BruControl's "not user
      // controlled" can not stop its click; the Toggle starts it
      if (list.some(e => e.tap !== 'none')) delete el.tap; else el.tap = 'toggle';
      el.typeCode = defaultCode(el);
      for (const e of list) taken.delete(e.name.toLowerCase());
      if (names === 'skynet') el.name = uniqueName(suggestName({ iface: dev?.id, port: String(el.channel), code: el.typeCode, label: el.label, tab: tab?.id }), isTaken, tab?.id);
      taken.add(el.name.toLowerCase());
      // each control by its BruControl name made safe (HLT PID -> HLT_PID), the name a Process from BruControl will say
      el.heatControls = list.map(e => ({ name: safeBru(e.bru.name), bruName: e.bru.name, method: heatMethodWord(mOf(e)) }))
        .filter(c => c.name.toLowerCase() !== el.name.toLowerCase());
      // a one-click spot on the Tab for each method it had in BruControl (shown since there are 2 or more, Rule 6.19)
      for (const e of list) el['methodSpot_' + mOf(e)] = true;
      el.bru = { ...first.bru, merged: list.map(e => ({ name: e.bru.name, kind: e.bru.portKind, id: e.bru.id })) };
      for (const r of renames) if (list.some(e => e.name === r.to)) r.to = el.name;
      if (!renames.some(r => r.from === first.bru.name)) renames.push({ from: first.bru.name, to: el.name });
      for (const e of list) {
        if (e !== first) {
          if (!renames.some(r => r.from === e.bru.name)) renames.push({ from: e.bru.name, to: el.name });
          // a Method Clone (Rule 4.4): the tile stands for this control's method, with its BruControl Label (HLT PID)
          const g = { id: `cl_${graphics.length + 1}`, kind: 'clone', of: el.name, workspace: e.workspace, x: e.x, y: e.y, w: e.w, h: e.h, method: heatMethodWord(mOf(e)), label: e.label };
          g.name = cloneName(el.name, n => isTaken(n));
          taken.add(g.name.toLowerCase());
          graphics.push(g);
        }
        elements.splice(elements.indexOf(e), 1, ...(e === first ? [el] : []));
      }
      out.push({ name: el.name, pump: !!pump, port: `${el.device} port ${el.channel}`, controls: el.heatControls.map(c => `${c.bruName} (${c.method})`) });
    }
    return out;
  }
  // One Interface Port, one Device (Rule 6.1): anything else still sharing a port (for example a pump's on/off and its PWM speed)
  // is listed, so the brewer can pick which one to keep
  const byPort = new Map();
  for (const e of elements) if (e.device && e.channel !== undefined && e.type !== 'temperature') { const k = `${e.device} port ${e.channel}`; byPort.set(k, [...(byPort.get(k) ?? []), e.bru.name]); }
  // a Dual Throw second Port is taken by its Device too (Rule 6.22)
  for (const e of elements) if (e.device && e.dualThrowChannel !== undefined) { const k = `${e.device} port ${e.dualThrowChannel}`; byPort.set(k, [...(byPort.get(k) ?? []), `${e.bru.name} (Dual Throw)`]); }
  // Heat Hysteresis by what switches it (Rule 6.29): BruControl does not say what switches a heater, so each one starts as an Optical SSR,
  // and a heating Hysteresis On offset outside 0.5 to 3 °F is brought to the nearest end of that range and listed
  const hysFixed = [];
  for (const e of elements) {
    if (!heatHysProblem(e, elements.find(p => p.name === e.input))) continue;
    const r = heatHysRange(e, elements.find(p => p.name === e.input)), was = Number(e.onOffset);
    e.onOffset = Math.min(r.max, Math.max(r.min, was));
    hysFixed.push(`${e.name} (${was} is now ${e.onOffset} ${r.u})`);
  }
  if (hysFixed.length) notes.push(`${hysFixed.length} heating element(s) had a Hysteresis On offset outside what an Optical SSR (solid state relay) may use, 0.5 to 3 °F (Rule 6.29): ${hysFixed.join(', ')}. If a Contactor or Mechanical relay switches it, pick that in its Properties > Switched by (On offset 2 to 5 °F, On delay at least 60 seconds).`);
  const calMade = elements.filter(e => e.calibrations?.length);
  if (calMade.length) notes.push(`${calMade.length} reading(s) kept their BruControl calibrations (Rule 6.24), in the same order: ${calMade.map(e => e.name).join(', ')}. Check them in each one's Properties > Calibrations.`);
  if (smoothed.length) notes.push(`${smoothed.length} reading(s) kept BruControl's Avg Weight as their Smoothing % (Rule 6.24): ${smoothed.join(', ')}.`);
  if (primaryOnly.length) notes.push(`${primaryOnly.length} item(s) had BruControl's Show Secondary Value off, so their Data Display shows only the main value (Rule 6.26): ${primaryOnly.join(', ')}.`);
  if (emailed.length) notes.push(`${emailed.length} Alarm(s) had BruControl's Email Notification on and keep it (Rule 7.17): ${emailed.join(', ')}. Pick your mail server (Gmail, Outlook.com or any other) in Skynet's Settings > Sending codes; BruControl's own email settings are not copied.`);
  if (pwmCals.length) notes.push(`${pwmCals.length} PWM output(s) had BruControl calibrations that were not copied, because BruControl counts a PWM output 0-255 and Skynet counts it in %: ${pwmCals.join(', ')}. Use Measured volts in its Properties if it drives a DAC.`);
  const dual = elements.filter(e => e.dualThrowChannel !== undefined);
  if (dual.length) notes.push(`${dual.length} Digital Out(s) have a BruControl Dual Throw second Port, kept as Dual Throw (Rule 6.22): ${dual.map(e => `${e.name} (port ${e.channel}, second Port ${e.dualThrowChannel}, delay ${e.dualThrowDelay} ms)`).join('; ')}.`);
  const shared = [...byPort].filter(([, l]) => l.length > 1);
  if (shared.length) notes.push(`In Skynet one Interface Port has one Device (Rule 6.1). These ports still have more than one: ${shared.map(([k, l]) => `${k} (${l.join(', ')})`).join('; ')}. They work as they did in BruControl (the one turned on last wins); keep one of each to follow the Rule.`);
  if (coolPumps.length) notes.push(`${coolPumps.length} pump(s) that BruControl ran by a temperature control are now ONE Cool / Warm Pump each (One Port, One Device, Rule 6.21), Type ID CPMP, with a Method (On/Off or Hysteresis) a Process or a click picks: ${coolPumps.map(e => e.name).join(', ')}.`);
  if (merged.some(m => !m.pump)) notes.push(`${merged.filter(m => !m.pump).length} heating element(s) had more than one BruControl control on the same port. Each is now ONE Heating Element whose heating method a Process or a click picks (Rule 6.19): ` +
    merged.filter(m => !m.pump).map(m => `${m.name} (${m.port}: ${m.controls.join(' or ')})`).join('; ') + '.');

  if (pumps) notes.push(`${pumps} pump(s) are now Skynet Pump Devices that follow the Pump Standard (Rule 5.27): the Skynet pump drawing at 150 x 150 with its inlet and outlet in the standard spots, so any Skynet pump can be swapped in later (Properties > Picture). BruControl's own pump pictures are kept in the file for the record.`);
  if (gauges.dial || gauges.lcd || gauges.bar) notes.push(`BruControl's gauges are drawings Skynet does not copy (Rule 2.40): ${[gauges.dial ? `${gauges.dial} round gauge(s) are now the Skynet Dial (an arc with a needle and the reading under it, with BruControl's lowest and highest numbers; set its Setpoint in Properties to color the reading blue, green or red)` : '', gauges.bar ? `${gauges.bar} bar gauge(s) are now the Skynet Bar (a straight bar that fills up to the reading)` : '', gauges.lcd ? `${gauges.lcd} digit gauge(s) now show LCD digits` : '', 'each keeps its lowest and highest numbers and tick marks, and gets the nearest Skynet color style (Rule 2.40 point 4)'].filter(Boolean).join(', and ')}.`);
  if (names === 'skynet' && renames.length) notes.push(`${renames.length} item(s) got their Skynet name (Rule 3.1), for example ${renames.slice(0, 3).map(r => `"${r.from}" is now ${r.to}`).join(', ')}.`);
  if (names === 'bru') notes.push('You kept your BruControl names (Rule 15.1). The Skynet names are the better choice: each one can still be changed in its Properties.');
  const probes = elements.filter(e => e.type === 'temperature').length;
  if (probes) notes.push(`${probes} OneWire temperature probe(s) need their probe picked on the Devices page.`);
  const holders = graphics.filter(g => g.kind !== 'clone').length;
  if (globals.length) notes.push(`${globals.length} BruControl Global(s) are listed only, not imported: Globals will be dealt with in a later step.`);
  if (holders) notes.push(`${holders} item(s) are not imported yet and are a Placeholder on their Tab: ${Object.entries(byKind).map(([k, c]) => `${c} ${k}`).join(', ')}.`);

  // Label examples for the items page (OakBarn Brewery, 2026-11-08): a Heater, a Probe and a Valve all with the Label HLT, so three
  // different suggested names share one Label. Built from the user's own items (an HLT one first), or made-up samples when none is found.
  function labelExamples() {
    const hlt = e => /(^|[^a-z])hlt([^a-z]|$)|hot\s*liquor/i.test(`${e.label} ${e.bru?.name ?? ''}`);
    const pick = test => { const l = elements.filter(e => e.device && test(e)); return l.find(hlt) ?? l[0]; };
    const kinds = [
      ['Heater', e => e.subtype === 'element', { iface: 'MB', port: '25', code: 'HE' }],
      ['Temperature Probe', e => e.type === 'temperature' || (e.type === 'analogIn' && /temp|probe/i.test(`${e.label} ${e.bru?.name ?? ''}`)), { iface: 'MB', port: 'A0', code: '10KNTC' }],
      ['Outlet Valve', e => /valve|vlv|mbv/i.test(`${e.label} ${e.bru?.name ?? ''}`), { iface: 'MB', port: '30', code: 'MBV' }]];
    const devId = n => devices.find(d => d.name === n)?.id, tabId = n => workspaces.find(w => w.name === n)?.id;
    return kinds.map(([what, test, sample]) => {
      const e = pick(test);
      if (!e) return { what, sample: true, name: suggestName({ ...sample, label: 'HLT', tab: 'BR' }) };
      const port = e.type === 'temperature' && e.probeIndex ? oneWirePort(e.probeIndex) : String(e.channel);
      return { what, sample: false, from: e.bru?.name || e.label, name: suggestName({ iface: devId(e.device), port, code: e.typeCode, label: 'HLT', tab: tabId(e.workspace) }) };
    });
  }
  const all = [...files.values()], missing = all.filter(f => !f.found);
  const count = k => all.filter(f => f.kind === k).length;
  if (all.length) notes.push(`${count('picture')} picture(s) and ${count('sound')} sound(s) are imported by their path. ` + (copy
    ? `They were copied (not moved) to media/${USER_PICTURES} and media/${USER_SOUNDS}; the originals stay where they were.`
    : 'The files stay where they were, so BruControl keeps working.') +
    (missing.length ? ` ${missing.length} are not on this computer (their path is kept): ${missing.slice(0, 5).map(f => f.from).join('; ')}${missing.length > 5 ? ' ...' : ''}` : ''));
  return {
    conv: { devices, workspaces, elements, graphics, probes: [], autostart: [], scripts: [], media: all.map(f => f.path), warnings: notes },
    report: {
      names,
      // every item on a board port, for the page that lists them by Interface (OakBarn Brewery, 2026-11-08)
      portItems: elements.filter(e => e.device && e.type !== 'chart').map(e => ({ device: e.device, port: e.channel, type: e.type, subtype: e.subtype || '', bru: e.bru?.name || e.label || e.name,
        bruId: e.bru?.id || '', display: e.bru?.display ?? '', label: e.label || '', noDisplay: !e.bru?.display, show: !e.hideName, name: e.name, tab: e.workspace,
        // the parts of its suggested name around the Label, so the Importer page shows the name with any Label live
        pre: [devices.find(d => d.name === e.device)?.id, e.type === 'temperature' && e.probeIndex ? oneWirePort(e.probeIndex) : String(e.channel), e.typeCode].join('_'), tabId: workspaces.find(w => w.name === e.workspace)?.id ?? '' })),
      labelExamples: labelExamples(),
      // the BruControl Application Elements made Skynet Widgets, for the Widget pages (OakBarn Brewery, 2026-11-08); and what stays a
      // Placeholder because Skynet has no such Widget (an Inspector)
      appItems: appMade,
      // the imported Devices a Boolean Widget may be linked to (an ON / OFF state, Rule 1.20), by BruControl element ID
      linkable: elements.filter(x => x.bru?.id && canControl(x)).map(x => ({ key: x.bru.id, bru: x.bru?.name || x.label || x.name, label: x.label || '', name: x.name, tab: x.workspace })),
      appHolders: graphics.filter(g => g.placeholder && g.placeholder.bruType !== 'DeviceElement').map(g => ({ bru: g.placeholder.bruName, kind: g.placeholder.bruKind, tab: g.workspace, bruId: g.placeholder.bruId })),
      interfaces: devices.map(d => ({ name: d.name, id: d.id, items: elements.filter(e => e.device === d.name).length,
        typeName: d.bru?.typeName || (d.board === 'esp32' ? 'ESP32' : d.board === 'mega' ? 'Arduino Mega 2560' : ''), enabled: d.enabled !== false,
        connection: connOf(d) === 'esp32' ? `TCP: ${d.host || '?'} Port: ${d.port}` : `Serial: ${d.port || '?'} at ${d.baud} baud` })),
      // a Tab with items (or a Clone) is always imported; one with none is imported only when ticked (Fritz, 2026-11-08). globals: how
      // many BruControl Globals were on it (listed only)
      tabs: workspaces.map(w => {
        const holders = graphics.filter(g => g.workspace === w.name && g.kind !== 'clone');
        const kinds = {};
        for (const g of holders) if (g.placeholder?.bruKind) kinds[g.placeholder.bruKind] = (kinds[g.placeholder.bruKind] ?? 0) + 1;
        return { name: w.name, id: w.id, items: elements.filter(e => e.workspace === w.name).length, placeholders: holders.length, kinds,
          always: elements.some(e => e.workspace === w.name) || graphics.some(g => g.workspace === w.name && g.kind === 'clone'),
          globals: globals.filter(g => g.tab === w.name).length };
      }),
      items: elements.filter(e => e.device).length, widgets: appMade.length, charts: elements.filter(e => e.type === 'chart').length, placeholders: graphics.filter(g => g.kind !== 'clone').length, byKind, renames, heaters: merged, globals,
      media: { copy, pictures: count('picture'), sounds: count('sound'), found: all.length - missing.length, missing: missing.map(f => ({ kind: f.kind, from: f.from, path: f.path })) },
    },
  };
}
