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
// Processes, and everything else BruControl has, come in later steps.
import { parseXml } from './brucontrol.js';
import { assignIds, defaultCode, suggestName, uniqueName, oneWirePort } from '../public/naming.js';

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

// names: 'skynet' (the default) or 'bru' (keep the BruControl names: only after the two warnings, Rule 15.1)
export function importBruControl(xml, { names = 'skynet' } = {}) {
  const doc = parseXml(String(xml).replace(/^﻿/, ''));
  const cfg = kid(doc, 'Configuration');
  if (!cfg) throw new Error('This is not a BruControl config file (it has no <Configuration>).');
  const notes = [];

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
  const size = { w: 0, h: 0 };
  wsNodes.forEach((w, wi) => {
    const tab = workspaces[wi];
    let maxX = 0, maxY = 0;
    for (const e of kids(kid(w, 'Elements'), 'Element')) {
      const place = { x: num(e, 'X', 0), y: num(e, 'Y', 0), w: num(e, 'Width', 100), h: num(e, 'Height', 60) };
      maxX = Math.max(maxX, place.x + place.w); maxY = Math.max(maxY, place.y + place.h);
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
    if (type === 'temperature') { const i = num(p, 'SensorIndex'); if (i !== null) el.probeIndex = i + 1; }
    el.typeCode = defaultCode(el);
    if (names === 'skynet') {
      const port = type === 'temperature' && el.probeIndex ? oneWirePort(el.probeIndex) : String(el.channel);
      el.name = uniqueName(suggestName({ iface: dev.id, port, code: el.typeCode, label: el.label, tab: tab.id }), isTaken, tab.id);
    } else el.name = uniqueName(bruName.replace(/[<>:"/\\|?*]/g, '~').replace(/\s+/g, '_'), isTaken);     // Rule 3.4 and spaces still change
    taken.add(el.name.toLowerCase());
    if (el.name !== bruName) renames.push({ from: bruName, to: el.name });
    el.bru = { id: txt(e, 'ID'), name: bruName, portId: txt(p, 'ID'), portKind: kind };
    return el;
  }
  function isTaken(n) { return taken.has(String(n).toLowerCase()); }

  function placeholder(e, tab, place, pin) {
    const name = txt(e, 'Name') || '(no name)', kind = String(e.type || 'Element').replace(/Element$/, '') || 'Element';
    const why = e.type === 'DeviceElement' ? (pin ? `${pin.kind} pins come later` : 'its pin is not in the file') : 'not imported yet';
    const key = e.type === 'DeviceElement' ? `Device (${pin ? pin.kind : 'no pin'})` : kind;
    byKind[key] = (byKind[key] ?? 0) + 1;
    return {
      id: `ph_${graphics.length + 1}`, kind: 'text', workspace: tab.name,
      x: place.x, y: place.y, w: Math.max(60, place.w), h: Math.max(30, place.h),
      text: `${PLACEHOLDER_MARK} ${name}`, fontSize: 12, color: '#555555', backColor: '#EDEDED',
      ...(/hidden/i.test(txt(e, 'Appearance/Visibility')) ? { visible: false } : {}),
      placeholder: { bruName: name, bruType: e.type || '', bruId: txt(e, 'ID'), why },
    };
  }

  if (names === 'skynet' && renames.length) notes.push(`${renames.length} item(s) got their Skynet name (Rule 3.1), for example ${renames.slice(0, 3).map(r => `"${r.from}" is now ${r.to}`).join(', ')}.`);
  if (names === 'bru') notes.push('You kept your BruControl names (Rule 15.1). The Skynet names are the better choice: each one can still be changed in its Properties.');
  const probes = elements.filter(e => e.type === 'temperature').length;
  if (probes) notes.push(`${probes} OneWire temperature probe(s) need their probe picked on the Devices page.`);
  if (graphics.length) notes.push(`${graphics.length} item(s) are not imported yet and are a Placeholder on their Tab: ${Object.entries(byKind).map(([k, c]) => `${c} ${k}`).join(', ')}.`);

  return {
    conv: { devices, workspaces, elements, graphics, probes: [], autostart: [], scripts: [], media: [], warnings: notes },
    report: {
      names,
      interfaces: devices.map(d => ({ name: d.name, id: d.id, items: elements.filter(e => e.device === d.name).length })),
      tabs: workspaces.map(w => ({ name: w.name, id: w.id, items: elements.filter(e => e.workspace === w.name).length, placeholders: graphics.filter(g => g.workspace === w.name).length })),
      items: elements.length, placeholders: graphics.length, byKind, renames,
    },
  };
}
