// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Equipment Profile Interview (OakBarn Brewery, 2026-11-13, Rule 19.6): plain questions, one page at a time, that end with a
// finished Equipment Profile on its Tab: "1. Ask How many Vessels 2. Type of each 3. Then Chose an Vessel Device or Widget, and able
// to choose to build a new Vessel Device 4. How Many Pumps (Types, Covers, Overlays, Labels and Names, Normal attributes) 5. How many
// Motorized Valves (the same) 6. And so On". It replaces the Vessel tab. The pumps and valves are kept in the profile too ("I may have
// a 3 Vessel 3 Pump Layout that I want in more than a single Schema, but rather than having to rebuild it, just select from a DDLB").
//
// This file only works out WHAT to make (the answers and the plan), so the tests can check it. public/app.js asks the questions and
// puts the plan on the 🔨 Build Tab (Rule 4.1).
import { suggestName, uniqueName, defaultCode, freePins } from './naming.js';

// the kinds of vessel the interview asks for (the Vessel Device Builder's General Types, Rule 19.5)
export const IV_TYPES = ['HLT', 'Mash Tun', 'Brew Kettle', 'All In One', 'Whirlpool', 'Fermentor', 'Bright Tank', 'Other'];
export const IV_MAX = { vessels: 8, pumps: 8, valves: 12, manual: 12 };
// a vessel is a Vessel Template (a Vessel Device or Widget), the plain Skynet Vessel Widget, or 🔨 a new one built after the interview
export const IV_PLAIN = '@plain', IV_BUILD = '@build';
const SHORT = { HLT: 'HLT', 'Mash Tun': 'MLT', 'Brew Kettle': 'BK', 'All In One': 'AIO', Whirlpool: 'WP', Fermentor: 'FV', 'Bright Tank': 'BT', Other: 'V' };
// a Vessel Template fits a type when its own type says so (a Fermentor is a Fermenter there); the rest are listed after a line
const TPL_TYPE = { Fermentor: ['Fermenter', 'Fermentor'], 'Bright Tank': ['Fermenter', 'Bright Tank'] };
export const fitsType = (t, type) => (TPL_TYPE[type] ?? [type]).some(x => String(t.vtype ?? '').toLowerCase() === x.toLowerCase());
// the vessel choices for one type: the Vessel Templates of that type first, the plain Vessel Widget, 🔨 Build a new one, then the rest
export function vesselChoices(type, tpls) {
  const fit = tpls.filter(t => fitsType(t, type)), rest = tpls.filter(t => !fitsType(t, type));
  return [...fit.map(t => [t.name, `${t.title || t.name.replace(/_/g, ' ')}`]),
    [IV_PLAIN, `Skynet Vessel Widget (a plain ${type}: you add everything to it)`], [IV_BUILD, '🔨 Build a new Vessel Device (the Vessel Device Builder opens after the interview)'],
    ...rest.map(t => [t.name, `${t.title || t.name.replace(/_/g, ' ')}  (${t.vtype || 'Vessel'})`])];
}
// the first pick for a type: its first Template, else the plain Vessel Widget
export const firstPick = (type, tpls) => tpls.find(t => fitsType(t, type))?.name ?? IV_PLAIN;
// the Label a vessel starts with: its type, numbered when there are two of the same type
export function vesselLabel(types, i) {
  const t = types[i], same = types.filter(x => x === t).length;
  return same > 1 ? `${t} ${types.slice(0, i + 1).filter(x => x === t).length}` : t;
}

// The answers, from the Default settings (Rule 2.42): Hot Side 3 vessels and 1 pump, Fermentation 1 Fermentor
export function ivStart({ name = '', tab = '', fermentation = false, units = 'US', fields = [] } = {}) {
  const types = fermentation ? ['Fermentor'] : ['HLT', 'Mash Tun', 'Brew Kettle'];
  return {
    name, tab, units, iface: '',
    vessels: types.map((type, i) => ({ type, pick: '', label: vesselLabel(types, i), volume: '', deadspace: '', maxVolume: '', minVolume: '' })),
    pumps: fermentation ? [] : [ivPump(0)], valves: [], manual: [],
    recirc: 'none', chiller: 'none', manifold: 'none', manifoldKind: 'manual',
    numbers: Object.fromEntries(fields.map(f => [f[0], units === 'Metric' ? f[5] : f[4]])),
  };
}
export const ivPump = i => ({ model: 'Pump_Riptide_SS_Center_Inlet', cover: 'None', overlay: 'Images/Skynet/On_Off/Overlay_Glow_Ring.svg', label: `Pump ${i + 1}`, labelVisible: true, tap: 'toggle' });
export const ivValve = i => ({ template: 'Skynet_Motorized_Ball_Valve_H', overlay: 'Images/Skynet/On_Off/Overlay_Bolt.svg', label: `Valve ${i + 1}`, labelVisible: false, tap: 'toggle' });
export const ivManual = i => ({ image: '', label: `Manual valve ${i + 1}` });
// a count was changed: the lists grow (new rows numbered on) or shrink (the last ones go)
export function ivResize(list, n, make) { n = Math.max(0, +n || 0); const out = list.slice(0, n); while (out.length < n) out.push(make(out.length)); return out; }

// What the answers say is wrong (an empty list = ready)
export function ivProblems(a) {
  const out = [];
  if (!String(a.name ?? '').trim()) out.push('Give the Equipment Profile a name');
  if (!String(a.tab ?? '').trim()) out.push('Pick the Tab it is for');
  if (!a.vessels?.length) out.push('An Equipment Profile needs at least one vessel');
  const labels = [...(a.vessels ?? []), ...(a.pumps ?? []), ...(a.valves ?? []), ...(a.manual ?? [])].map(x => String(x.label ?? '').trim());
  if (labels.some(l => !l)) out.push('Every vessel, pump and valve needs a Label (Rule 3.1)');
  const dup = labels.find((l, i) => l && labels.findIndex(x => x.toLowerCase() === l.toLowerCase()) !== i);
  if (dup) out.push(`Two have the Label "${dup}": give each its own`);
  if (((a.pumps?.length ?? 0) || (a.valves?.length ?? 0)) && !a.iface) out.push('Pick the Interface (board) the pumps and valves are wired to');
  return out;
}

// The pumps and motorized valves: real Devices on the Interface, each on its next free Port (Rule 4.2), never two on one Port, named
// InterfaceID_Port_Type_Label_TabID (Rule 3.1). look(kind, answer) gives each one's look (its picture, size, IPs) from app.js.
export function ivDevices(a, { iface, tabId, elements = [], devices = [], taken = [], look }) {
  const made = [], used = new Set(taken.map(n => String(n).toLowerCase()));
  const add = (kind, x) => {
    const el = { ...look(kind, x), label: String(x.label).trim(), device: iface.name, hideName: !x.labelVisible, tap: x.tap || 'toggle' };
    const all = [...elements, ...made];
    const free = freePins(el, all, devices).filter(p => !all.some(o => o.device === el.device && String(o.channel ?? '') === String(p)));
    if (!free.length) throw new Error(`${iface.name} has no free Port for ${el.label}. Pick fewer pumps and valves, or another Interface.`);
    el.channel = free[0];
    el.name = uniqueName(suggestName({ iface: iface.id, port: el.channel, code: defaultCode(el), type: el.type, label: el.label, tab: tabId }), n => used.has(n.toLowerCase()), tabId);
    used.add(el.name.toLowerCase()); made.push(el);
    return el;
  };
  (a.pumps ?? []).forEach(p => add('pump', p));
  (a.valves ?? []).forEach(v => add('valve', v));
  return made;
}
// a short name for a vessel's bundle (HLT, MLT, BK ...)
export const shortOf = (type, i, types) => { const s = SHORT[type] ?? 'V', n = types.filter(t => t === type).length; return n > 1 ? s + types.slice(0, i + 1).filter(t => t === type).length : s; };
