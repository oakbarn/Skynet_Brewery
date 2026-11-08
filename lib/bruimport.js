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
import { parseXml } from './brucontrol.js';
import { assignIds, defaultCode, suggestName, uniqueName, oneWirePort, cloneName, suggestWidgetName, WIDGET_TYPE_IDS } from '../public/naming.js';
import { argbHex } from '../public/chart.js';
import { TYPE_METHOD, heatMethodWord } from '../public/heatmethod.js';

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
// the items that show a number, so they can show a gauge (an on / off output can't)
// a BruControl control port's settings and the Skynet keys they go to (public/heatmethod.js HEAT_SETTINGS)
const CONTROL_SETTINGS = [['Target', 'target'], ['Kp', 'kp'], ['Ki', 'ki'], ['Kd', 'kd'], ['MaxOutput', 'maxOutput'], ['MaxIntegral', 'maxIntegral'],
  ['CalcTime', 'calcTime'], ['OutTime', 'outTime'], ['OnOffset', 'onOffset'], ['OnDelay', 'onDelay'], ['DutyCycle', 'dutyCycle'], ['Interval', 'interval'],
  ['DeadbandOffset', 'deadbandOffset'], ['InnerBandOffset', 'innerBandOffset'], ['InitialOutput', 'initialOutput'], ['InnerBandDrive', 'innerBandDrive'], ['OuterBandDrive', 'outerBandDrive']];
// Pumps (Rule 5.27): found by their name, made Skynet Pump Devices with the standard drawing
const PUMP_WORD = /pump|chugger|riptide|march\b|whirlpool/i;
export const PUMP_PICTURE = 'Images/Skynet/Pumps/Pump_Red_Rip_Off.svg', PUMP_OVERLAY = 'Images/Skynet/On_Off/Overlay_Glow_Ring.svg';
const NUMBER_KINDS = new Set(['analogIn', 'temperature', 'pwmOut', 'dutyCycle', 'pid', 'deadband']);
export const PLACEHOLDER_MARK = '⬚';      // the dashed box at the start of a Placeholder's text

// Step 1: a BruControl board becomes an Interface
function readInterface(d) {
  const link = txt(d, 'Interface'), net = /tcp|network|ethernet|wifi/i.test(link), sp = txt(d, 'SerialPort');
  const type = txt(d, 'TypeName');
  return {
    name: txt(d, 'Name') || 'Interface',
    ...(net ? { type: 'esp32', host: txt(d, 'Address'), port: num(d, 'Port', 5000) }
      : { type: 'serial', port: /^\d+$/.test(sp) ? 'COM' + sp : sp, baud: num(d, 'BaudRate', 115200) }),
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
export function importBruControl(xml, { names = 'skynet', copy = false, media = () => true } = {}) {
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
  assignIds({ devices, workspaces });          // Interface IDs and Tab IDs, the same way the Panel gives them (Rule 3.2)
  const tabOf = new Map(workspaces.map(w => [w.name, w]));

  // ---- 3. items on a board port, 4. a Placeholder for everything else
  const elements = [], graphics = [], renames = [], taken = new Set(), byKind = {};
  const size = { w: 0, h: 0 }, gauges = {}, charts = [], pumpPics = new Map();
  let pumps = 0;
  wsNodes.forEach((w, wi) => {
    const tab = workspaces[wi];
    let maxX = 0, maxY = 0;
    for (const e of kids(kid(w, 'Elements'), 'Element')) {
      const place = { x: num(e, 'X', 0), y: num(e, 'Y', 0), w: num(e, 'Width', 100), h: num(e, 'Height', 60) };
      maxX = Math.max(maxX, place.x + place.w); maxY = Math.max(maxY, place.y + place.h);
      if (e.type === 'ChartElement') { charts.push({ e, tab, place }); continue; }      // made after every item has its Skynet name
      const pin = e.type === 'DeviceElement' ? pins.get(txt(e, 'PortID')) : null;
      const type = pin && PORT_KINDS[pin.kind];
      if (type) elements.push(portItem(e, pin, type, tab, place));
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
    if (/hidden/i.test(txt(e, 'Appearance/Visibility'))) el.visibility = 'hidden';
    const pics = picsOf(e);       // BruControl's 3 background pictures are .backpath, .backpath_2, .backpath_3; .background picks one
    ['backpath', 'backpath_2', 'backpath_3'].forEach((k, i) => { if (pics.bg[i]) el[k] = pics.bg[i]; });
    if (pics.bg.some(Boolean)) { el.background = Math.max(1, Math.min(3, pics.index)); el.backpathsImported = true; }
    if (type === 'temperature') { const i = num(p, 'SensorIndex'); if (i !== null) el.probeIndex = i + 1; }
    // a control port's own settings come over (Rule 6.19 keeps them on the one Heating Element), and its probe: BruControl's
    // InputPortID becomes .input once every item has its Skynet name (the SetPoint click, Rule 2.43, finds it by .input)
    for (const [tag, key] of CONTROL_SETTINGS) { const v = num(p, tag); if (v !== null) el[key] = v; }
    const inPort = txt(p, 'InputPortID'); if (inPort) el.inputPortId = inPort;
    // BruControl "not user controlled": a click does nothing (Rule 2.44 keeps the user's own choice). Only for things a click turns
    // On or Off or sets; a probe's click opens its SetPoint (Rule 2.43)
    if (/^false$/i.test(txt(e, 'UserControl')) && type !== 'temperature' && type !== 'analogIn') el.tap = 'none';
    const look = gaugeLook(e, type);
    if (look) { Object.assign(el, look.el); gauges[look.kind] = (gauges[look.kind] ?? 0) + 1; }
    // a pump is a Skynet Pump Device that follows the Pump Standard (Rule 5.27, OakBarn Brewery 2026-11-08: "if we import a BruControl
    // have it conform to the newest standard"): the Skynet pump drawing in the 300 x 300 box shown 150 x 150, so its inlet and outlet
    // IPs sit in the standard spots and any Skynet pump swaps in. BruControl's own pictures are kept in .bru.pictures.
    if (type === 'digitalOut' && PUMP_WORD.test(`${el.label} ${bruName}`)) {
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
    el.bru = { id: txt(e, 'ID'), name: bruName, portId: txt(p, 'ID'), portKind: kind, ...(look ? { gauge: look.bru } : {}), ...(pumpPics.has(el) ? { pictures: pumpPics.get(el) } : {}) };
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
    if (kind === 'DigitalGauge') out.look = 'lcd';
    else {
      out.look = 'dial';
      const lo = num(o, 'MinValue'), hi = num(o, 'MaxValue');
      if (lo !== null) out.dialMin = lo;
      if (hi !== null && (lo === null || hi > lo)) out.dialMax = hi;
    }
    return { kind: out.look, el: out, bru: { kind, style: txt(o, 'Style') } };
  }
  function safeBru(n) { return String(n).trim().replace(/[<>:"/\\|?*]/g, '~').replace(/\s+/g, '_'); }
  function isTaken(n) { return taken.has(String(n).toLowerCase()); }

  function placeholder(e, tab, place, pin) {
    const name = txt(e, 'Name') || '(no name)', kind = String(e.type || 'Element').replace(/Element$/, '') || 'Element';
    const why = e.type === 'DeviceElement' ? (pin ? `${pin.kind} pins come later` : 'its pin is not in the file') : 'not imported yet';
    const key = e.type === 'DeviceElement' ? `Device (${pin ? pin.kind : 'no pin'})` : kind;
    byKind[key] = (byKind[key] ?? 0) + 1;
    const pics = picsOf(e), list = [...pics.bg, pics.on, pics.off].filter(Boolean), snd = pics.sounds.filter(Boolean);
    return {
      id: `ph_${graphics.length + 1}`, kind: 'text', workspace: tab.name,
      x: place.x, y: place.y, w: Math.max(60, place.w), h: Math.max(30, place.h),
      text: `${PLACEHOLDER_MARK} ${name}`, fontSize: 12, color: '#555555', backColor: '#EDEDED',
      ...(/hidden/i.test(txt(e, 'Appearance/Visibility')) ? { visible: false } : {}),
      placeholder: { bruName: name, bruType: e.type || '', bruId: txt(e, 'ID'), why, ...(list.length ? { pictures: list } : {}), ...(snd.length ? { sounds: snd } : {}) },
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
  }
  if (chartMade.length) notes.push(`${chartMade.length} BruControl Chart(s) are now Skynet Chart Widgets (Rule 1.26), with the same span, refresh, grid lines, colors and channels.` +
    (recorded.size ? ` So their lines can be drawn, ${recorded.size} item(s) they draw are now sent to the database every Refresh interval: ${[...recorded].join(', ')}.` : '') +
    (notInSchema.size ? ` ${notInSchema.size} item(s) a Chart draws are not imported yet (their line stays empty until they are): ${[...notInSchema].join(', ')}.` : ''));
  function mergeHeaters() {
    const out = [], groups = new Map();
    for (const el of elements) {
      if (!(el.type in TYPE_METHOD)) continue;
      const k = `${el.device}|${el.channel}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(el);
    }
    for (const list of groups.values()) {
      if (list.length < 2 || !list.some(e => e.type !== 'digitalOut')) continue;      // two plain outputs on a port stay as they are (Rule 6.1)
      const first = list.find(e => e.type !== 'digitalOut'), dev = devices.find(d => d.name === first.device), tab = workspaces.find(w => w.name === first.workspace);
      const el = { ...first, type: 'digitalOut', subtype: 'element', heatMethod: TYPE_METHOD[first.type] };
      for (const e of list) for (const [, k] of [...CONTROL_SETTINGS, ['', 'inputPortId']]) if (el[k] === undefined && e[k] !== undefined) el[k] = e[k];
      if (list.some(e => e.tap !== 'none')) delete el.tap;
      el.typeCode = defaultCode(el);
      for (const e of list) taken.delete(e.name.toLowerCase());
      if (names === 'skynet') el.name = uniqueName(suggestName({ iface: dev?.id, port: String(el.channel), code: el.typeCode, label: el.label, tab: tab?.id }), isTaken, tab?.id);
      taken.add(el.name.toLowerCase());
      // each control by its BruControl name made safe (HLT PID -> HLT_PID), the name a Process from BruControl will say
      el.heatControls = list.map(e => ({ name: safeBru(e.bru.name), bruName: e.bru.name, method: heatMethodWord(TYPE_METHOD[e.type]) }))
        .filter(c => c.name.toLowerCase() !== el.name.toLowerCase());
      // a one-click spot on the Tab for each method it had in BruControl (shown since there are 2 or more, Rule 6.19)
      for (const e of list) el['methodSpot_' + TYPE_METHOD[e.type]] = true;
      el.bru = { ...first.bru, merged: list.map(e => ({ name: e.bru.name, kind: e.bru.portKind, id: e.bru.id })) };
      for (const r of renames) if (list.some(e => e.name === r.to)) r.to = el.name;
      if (!renames.some(r => r.from === first.bru.name)) renames.push({ from: first.bru.name, to: el.name });
      for (const e of list) {
        if (e !== first) {
          if (!renames.some(r => r.from === e.bru.name)) renames.push({ from: e.bru.name, to: el.name });
          // a Method Clone (Rule 4.4): the tile stands for this control's method, with its BruControl Label (HLT PID)
          const g = { id: `cl_${graphics.length + 1}`, kind: 'clone', of: el.name, workspace: e.workspace, x: e.x, y: e.y, w: e.w, h: e.h, method: heatMethodWord(TYPE_METHOD[e.type]), label: e.label };
          g.name = cloneName(el.name, n => isTaken(n));
          taken.add(g.name.toLowerCase());
          graphics.push(g);
        }
        elements.splice(elements.indexOf(e), 1, ...(e === first ? [el] : []));
      }
      out.push({ name: el.name, port: `${el.device} port ${el.channel}`, controls: el.heatControls.map(c => `${c.bruName} (${c.method})`) });
    }
    return out;
  }
  // One Interface Port, one Device (Rule 6.1): anything else still sharing a port (for example a pump's on/off and its PWM speed)
  // is listed, so the brewer can pick which one to keep
  const byPort = new Map();
  for (const e of elements) if (e.device && e.channel !== undefined && e.type !== 'temperature') { const k = `${e.device} port ${e.channel}`; byPort.set(k, [...(byPort.get(k) ?? []), e.bru.name]); }
  const shared = [...byPort].filter(([, l]) => l.length > 1);
  if (shared.length) notes.push(`In Skynet one Interface Port has one Device (Rule 6.1). These ports still have more than one: ${shared.map(([k, l]) => `${k} (${l.join(', ')})`).join('; ')}. They work as they did in BruControl (the one turned on last wins); keep one of each to follow the Rule.`);
  if (merged.length) notes.push(`${merged.length} heating element(s) had more than one BruControl control on the same port. Each is now ONE Heating Element whose heating method a Process or a click picks (Rule 6.19): ` +
    merged.map(m => `${m.name} (${m.port}: ${m.controls.join(' or ')})`).join('; ') + '.');

  if (pumps) notes.push(`${pumps} pump(s) are now Skynet Pump Devices that follow the Pump Standard (Rule 5.27): the Skynet pump drawing at 150 x 150 with its inlet and outlet in the standard spots, so any Skynet pump can be swapped in later (Properties > Picture). BruControl's own pump pictures are kept in the file for the record.`);
  if (gauges.dial || gauges.lcd) notes.push(`BruControl's gauges are drawings Skynet does not copy (Rule 2.40): ${[gauges.dial ? `${gauges.dial} round or bar gauge(s) are now the Skynet Dial (an arc with a needle and the reading under it, with BruControl's lowest and highest numbers; set its Setpoint in Properties to color the reading blue, green or red)` : '', gauges.lcd ? `${gauges.lcd} digit gauge(s) now show LCD digits` : ''].filter(Boolean).join(', and ')}.`);
  if (names === 'skynet' && renames.length) notes.push(`${renames.length} item(s) got their Skynet name (Rule 3.1), for example ${renames.slice(0, 3).map(r => `"${r.from}" is now ${r.to}`).join(', ')}.`);
  if (names === 'bru') notes.push('You kept your BruControl names (Rule 15.1). The Skynet names are the better choice: each one can still be changed in its Properties.');
  const probes = elements.filter(e => e.type === 'temperature').length;
  if (probes) notes.push(`${probes} OneWire temperature probe(s) need their probe picked on the Devices page.`);
  const holders = graphics.filter(g => g.kind !== 'clone').length;
  if (holders) notes.push(`${holders} item(s) are not imported yet and are a Placeholder on their Tab: ${Object.entries(byKind).map(([k, c]) => `${c} ${k}`).join(', ')}.`);

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
      interfaces: devices.map(d => ({ name: d.name, id: d.id, items: elements.filter(e => e.device === d.name).length })),
      // a Tab with items (or a Clone) is always imported; one with none is imported only when ticked (Fritz, 2026-11-08). globalsOnly:
      // every Placeholder on it is a BruControl Global (maybe Node-RED recipe Globals: the page asks)
      tabs: workspaces.map(w => {
        const holders = graphics.filter(g => g.workspace === w.name && g.kind !== 'clone');
        return { name: w.name, id: w.id, items: elements.filter(e => e.workspace === w.name).length, placeholders: holders.length,
          always: elements.some(e => e.workspace === w.name) || graphics.some(g => g.workspace === w.name && g.kind === 'clone'),
          globalsOnly: holders.length > 0 && holders.every(g => g.placeholder?.bruType === 'GlobalVariableElement') };
      }),
      items: elements.filter(e => e.type !== 'chart').length, charts: elements.filter(e => e.type === 'chart').length, placeholders: graphics.filter(g => g.kind !== 'clone').length, byKind, renames, heaters: merged,
      media: { copy, pictures: count('picture'), sounds: count('sound'), found: all.length - missing.length, missing: missing.map(f => ({ kind: f.kind, from: f.from, path: f.path })) },
    },
  };
}
