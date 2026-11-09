// New Schema from a Skynet Schema Template (Fritz, 2026-11-06/07, Rule 16.6): pick a Brewhouse Tab Template (1 Vessel, 1 Vessel +
// 1 Pump, 2 Vessel + 1 Pump, 2 Vessel + 2 Pumps, 3 Vessel) or the Fermentor Template on its own, answer a few questions, and Skynet makes the Schema: its Tab, its vessels (from Vessel Templates), the Devices on the brewer's real
// Interface and free Ports, the chiller, a Supply Manifold if asked, the timers, and the Brew Process with every job picked, so
// Build the Brew Day is all that is left. The panel goes to Simulator Mode, so nothing real is switched until the brewer says.
// Pipes are not drawn: the brewer pipes the equipment the way it really is.
//
// This file only works out WHAT to make (plan), so the server and the tests can check it. public/app.js puts it on the Tab.
import { suggestName, suggestWidgetName, uniqueName, defaultCode, freePins, oneWirePort, defaultTabId } from './naming.js';

// the general vessel types, at the bottom of each vessel's list (Fritz, 2026-11-07: "just General Type as a Choice (HLT, Brew
// Kettle, All In One etc.) but at the Bottom of the DDLB List"). Each one is a Skynet Vessel Widget with that type.
export const GENERAL_TYPES = ['HLT', 'Mash Tun', 'Brew Kettle', 'All In One'];
export const GENERAL_TEMPLATE = 'Skynet_Vessel_Widget';
// what each kind of vessel does on brew day: the Brew Process jobs its heater and probe fill
const ROLE_JOBS = {
  HLT: { heater: ['HLT_Heater'], probe: ['HLT_Probe'] },
  'Mash Tun': { heater: ['Mash_Heater'], probe: ['Mash_Probe'] },
  'Brew Kettle': { heater: ['Boil_Heater'], probe: ['Boil_Probe'] },
  'All In One': { heater: ['HLT_Heater', 'Mash_Heater', 'Boil_Heater'], probe: ['HLT_Probe', 'Mash_Probe', 'Boil_Probe'] },
};
const SHORT = { HLT: 'HLT', 'Mash Tun': 'MLT', 'Brew Kettle': 'BK', 'All In One': 'AIO' };
export const HEATS = { electric: 'Electric (Heating Element)', gas: 'Gas (burner on a gas valve)', own: 'Its own, set by hand (DigiBoil, Brewzilla: Skynet does not switch it)', none: 'None' };
export const RECIRCS = { none: 'None', rims: 'RIMS tube', herms: 'HERMS coil (in the HLT)' };
export const CHILLERS = { immersion: 'Immersion coil', plate: 'Plate chiller', counterflow: 'Counterflow chiller' };
export const VALVES = { hand: 'Hand valves (Skynet asks you to turn them)', motorized: 'Motorized valves (one on each vessel outlet)' };
export const MANIFOLDS = { none: 'None', Valve_Tee: 'Long Tee with a Valve', Supply_Manifold_2: 'Double Supply Manifold', Supply_Manifold_3: 'Triple Supply Manifold' };
export const MANIFOLD_KINDS = { manual: 'Manual valves', motorized: 'Motorized valves' };
export const SIM_IFACE = '';
// the Brew Process steps a Fermentor-only Schema skips (it only ferments)
const HOT_STEPS = ['PreBrew', 'Heat_Strike', 'Strike', 'Mash', 'Boil', 'Whirlpool_and_Chill', 'Chill', 'Transfer_to_Fermentor', 'Clean'];         // no real Interface yet: a pretend Mega on the Simulator

// The defaults of the questions (☰ Menu > Default settings > New Schema from a Skynet Template). brewDefaults keeps them as ns_...
export const NS_DEFAULTS = { ns_template: 'Skynet_3_Vessel', ns_fermentors: '1', ns_recirc: 'none', ns_chiller: 'immersion', ns_whirlpool: false,
  ns_valves: 'hand', ns_manifold: 'none', ns_manifoldKind: 'manual', ns_heat_HLT: 'electric', 'ns_heat_Mash Tun': 'none', 'ns_heat_Brew Kettle': 'electric',
  'ns_heat_All In One': 'electric', ns_tab: 'Brewhouse' };
export const nsDefault = (b, k) => b?.[k] !== undefined && b[k] !== '' ? b[k] : NS_DEFAULTS[k];
// a general type is picked as '@HLT' ... (a Vessel Template can have the same name, like HLT)
export const generalPick = t => '@' + t;
export const isGeneral = pick => String(pick ?? '').startsWith('@') && GENERAL_TYPES.includes(pick.slice(1));
export const roleOf = (pick, slotRole) => isGeneral(pick) ? pick.slice(1) : slotRole;

// The answers, started from a Schema Template and the Default settings
export function startAnswers(st, b = {}) {
  return {
    name: '', template: st.name, tab: nsDefault(b, 'ns_tab'),
    // a vessel can come with its own Vessel Template, label, short name and heat (the OakBarn Template)
    vessels: (st.vessels ?? []).map(v => ({ pick: v.template || generalPick(v.role), role: v.role, label: v.label, short: v.short, heat: v.heat ?? nsDefault(b, 'ns_heat_' + v.role) ?? 'none' })),
    // its own pump names and which pump does which Brew Process job, and the Process Templates made for it (1, 2 or 3 Vessel)
    pumpLabels: st.pumpLabels, pumpJobs: st.pumpJobs, process: st.process ?? {},
    // the Template's own number of pumps (and its recirculation, like the 3 Vessel's HERMS coil); each can be changed in the questions
    pumps: +(st.pumps ?? 0), recirc: (st.vessels ?? []).some(v => v.role === 'Mash Tun') ? st.recirc ?? nsDefault(b, 'ns_recirc') : 'none',
    fermentors: st.kind === 'fermentor' ? Math.max(1, +(st.fermentors ?? 1)) : +(st.fermentors ?? nsDefault(b, 'ns_fermentors')) || 0,
    chiller: st.chiller ?? nsDefault(b, 'ns_chiller'), whirlpool: !!(st.whirlpool ?? nsDefault(b, 'ns_whirlpool')), valves: st.valves ?? nsDefault(b, 'ns_valves'),
    manifold: nsDefault(b, 'ns_manifold'), manifoldKind: nsDefault(b, 'ns_manifoldKind'), iface: undefined,
  };
}

// Each Device and Widget has place: where it goes on the Tab (under vessel i, under equipment i, the pumps row, the timers row),
// worked out on the Tab once the vessels have their sizes (app.js layoutSchema), then dropped.
// The plan: { tab, tabId, vessels: [{ template, role, label, x, y, vtype }], equipment: [{ kind, template?, label, x, y }],
// manifold, elements: [Devices and Widgets], fields: { Brew Process job: name }, templates: { step: Template or '' }, notes }
// iface: the Interface (a copy of the brewer's real one), or null for a pretend Mega. taken: names already used.
export function planSchema(a, { iface, taken = [] } = {}) {
  if (!String(a.name ?? '').trim()) throw new Error('Give the new Schema a name');
  const hot = (a.vessels ?? []).length > 0, nF = Math.max(0, Math.min(8, +a.fermentors || 0));
  if (!hot && !nF) throw new Error('A Schema needs at least one vessel or fermentor');
  a = { ...a, vessels: a.vessels ?? [] };
  // the hot side goes on its Tab (Brewhouse); the fermentors on their own Fermentor Tab (Fritz: "Fermentor Template is on its own")
  const fTab = hot ? (String(a.tab || '').trim().toLowerCase() === 'fermentor' ? 'Fermentors' : 'Fermentor') : 'Fermentor';
  const tab = hot ? String(a.tab || 'Brewhouse').trim() : fTab, tabId = defaultTabId(tab, []);
  const fTabId = hot ? defaultTabId(fTab, [tabId]) : tabId;
  const dev = iface ?? { name: 'New_Mega_2560_1', id: 'NM', type: 'simulator', board: 'mega' };
  const devices = [dev], elements = [], used = new Set(taken.map(n => String(n).toLowerCase()));
  const isTaken = n => used.has(String(n).toLowerCase());
  let probeN = 0;
  // a Device on the Interface: its first free Port that fits (Rule 4.2), and its name InterfaceID_Port_Type_Label_Tab (Rule 3.1)
  const add = (el, ws = tab, wsId = tabId) => {
    el.workspace = ws;
    if (el.type === 'temperature') { el.probeIndex = ++probeN; el.device = dev.name; }
    else if (el.device !== undefined) {
      el.device = dev.name;
      // a new Schema never puts two Devices on one Port, not even the ones that may share one (Rule 6.19)
      const free = freePins(el, elements, devices).filter(p => !elements.some(o => o.device === el.device && String(o.channel ?? '') === String(p)));
      if (!free.length) throw new Error(`${dev.name} has no free Port for ${el.label}. Pick fewer Devices or another Interface.`);
      el.channel = free[0];
    }
    const port = el.type === 'temperature' ? oneWirePort(el.probeIndex) : el.channel ?? '';
    const code = el.device !== undefined ? defaultCode(el) : '';
    let name = el.device !== undefined ? suggestName({ iface: dev.id, port, code, label: el.label, tab: wsId }) : el.name;
    name = uniqueName(name, isTaken, wsId);
    el.name = name; used.add(name.toLowerCase()); elements.push(el);
    return el;
  };
  const fields = {}, job = (list, n) => { for (const j of list) if (!fields[j]) fields[j] = n; };
  const vessels = [], W = 300;
  let x = 60;
  a.vessels.forEach((v, i) => {
    const role = roleOf(v.pick, v.role), s = v.short || SHORT[role] || 'V' + (i + 1), general = isGeneral(v.pick);
    const label = v.label || { HLT: 'Hot Liquor Tank', 'Mash Tun': 'Mash Tun', 'Brew Kettle': 'Brew Kettle', 'All In One': 'All In One' }[role] || `Vessel ${i + 1}`;
    vessels.push({ template: general ? GENERAL_TEMPLATE : v.pick, role, vtype: role, label, x, y: 80, short: s });
    const cx = x;
    // its own heat, set by hand (a DigiBoil or a 65 L Brewzilla, Rule 5.39): no probe and no heater of Skynet's. Its Controls and its
    // valves come built into its Vessel Template; it does no Brew Process heating job.
    if (v.heat === 'own') { x += W; return; }
    // its probe (DS18B20 on the OneWire bus), shown under the vessel
    const probe = add({ place: { at: 'v', i, row: 0, col: 0 }, type: 'temperature', sensor: 'ds18b20', label: `${s} temp`, x: cx, y: 420, w: 170, h: 74, units: '°F', precision: 1, look: 'lcd', device: '' });
    job(ROLE_JOBS[role]?.probe ?? [], probe.name);
    // its heat: one Heating Element on one Port (Hysteresis to start, Rule 6.19), an electric element or a burner on a gas valve.
    // It is turned On or Off, never "Enabled" (Rule 6.19), and starts Off.
    const heat = role === 'Mash Tun' && a.recirc !== 'none' ? 'none' : v.heat;
    if (heat === 'electric' || heat === 'gas') {
      const el = heat === 'electric'
        ? { label: `${s} element`, onText: 'HEAT', offText: 'idle' }
        : { label: `${s} burner`, onText: 'FLAME', offText: 'off' };
      const h = add({ type: 'digitalOut', subtype: 'element', heatMethod: 'hysteresis', ...el, look: 'dark', place: { at: 'v', i, row: 1, col: 0 }, device: '', input: probe.name, target: 150, onOffset: 1, x: cx, y: 500, w: 170, h: 60 });
      probe.sim = { start: 62, heater: h.name, heatRate: 1.2, maxTemp: 212 };
      job((ROLE_JOBS[role]?.heater ?? []).filter(j => !(role === 'All In One' && j === 'Mash_Heater' && a.recirc !== 'none')), h.name);
    }
    if (a.valves === 'motorized') add({ place: { at: 'v', i, row: 0, col: 1 }, type: 'digitalOut', subtype: 'valve', label: `${s} out`, device: '', x: cx + 180, y: 420, w: 64, h: 55, ipIn: 'top', ipOut: 'bottom',
      imageOff: 'Images/Skynet/Valves/Motorized_TC15_Ball_Valve_Vertical.svg', hideName: true, hideValue: true, tap: 'toggle', onText: 'OPEN', offText: 'CLOSED', imageOverlay: 'Images/Skynet/On_Off/Overlay_Bolt.svg' });
    x += W;
  });
  const roles = vessels.map(v => v.role);
  // a 2 vessel brewery heats its strike and sparge water in the kettle: the kettle does the HLT's jobs too
  if (!roles.includes('HLT')) { if (fields.Boil_Heater && !fields.HLT_Heater) fields.HLT_Heater = fields.Boil_Heater; if (fields.Boil_Probe && !fields.HLT_Probe) fields.HLT_Probe = fields.Boil_Probe; }
  const equipment = [];
  // recirculation: a RIMS tube (its own element and probe) or a HERMS coil in the HLT (the HLT element heats the mash)
  if (a.recirc === 'rims') {
    equipment.push({ kind: 'rims', template: 'RIMS_Tube', label: 'RIMS tube', x, y: 120 });
    const p = add({ place: { at: 'e', i: equipment.length - 1, row: 0, col: 0 }, type: 'temperature', sensor: 'ds18b20', label: 'RIMS temp', x, y: 420, w: 170, h: 74, units: '°F', precision: 1, look: 'lcd', device: '' });
    const h = add({ place: { at: 'e', i: equipment.length - 1, row: 1, col: 0 }, type: 'digitalOut', subtype: 'element', heatMethod: 'pid', label: 'RIMS element', device: '', input: p.name, target: 152, onText: 'HEAT', offText: 'idle', look: 'dark', x, y: 500, w: 170, h: 60 });
    p.sim = { start: 62, heater: h.name, heatRate: 2, maxTemp: 212 };
    fields.Mash_Heater = h.name; fields.Mash_Probe ||= p.name;
    x += 240;
  } else if (a.recirc === 'herms') {
    const hlt = vessels.find(v => v.role === 'HLT');
    equipment.push({ kind: 'herms', label: 'HERMS coil', x: hlt ? hlt.x + 40 : x, y: hlt ? 120 : 120, in: hlt?.label });
    if (fields.HLT_Heater) fields.Mash_Heater = fields.HLT_Heater;
    if (!hlt) x += 240;
  }
  // pumps: Pump 1 recirculates the mash (and does the rest when it is the only one); Pump 2 runs the kettle side
  const pumps = [];
  for (let i = 1; i <= Math.max(0, Math.min(8, +a.pumps || 0)); i++)
    pumps.push(add({ place: { at: 'pumps', i: i - 1 }, type: 'digitalOut', subtype: 'pump', label: a.pumpLabels?.[i - 1] || (a.pumps > 1 ? ['Mash pump', 'Kettle pump'][i - 1] ?? `Pump ${i}` : 'Pump'), device: '', x: 60 + (i - 1) * 180, y: 600, w: 150, h: 150, ipIn: 'left', ipOut: 'right',
      imageOff: 'Images/Skynet/Pumps/Pump_Red_Rip_Off.svg', hideValue: true, tap: 'toggle', onText: 'ON', offText: 'OFF', imageOverlay: 'Images/Skynet/On_Off/Overlay_Bolt.svg' }));
  if (pumps.length) {
    const p1 = pumps[0].name, p2 = (pumps[1] ?? pumps[0]).name;
    if (roles.includes('Mash Tun') || roles.includes('All In One') || a.recirc !== 'none') fields.Mash_Pump = p1;
    Object.assign(fields, { Whirlpool_Pump: p2, Chill_Pump: p2, Transfer_Pump: p2, Clean_Pump: p1 });
    for (const [j, l] of Object.entries(a.pumpJobs ?? {})) { const p = pumps.find(x => x.label === l); if (p) fields[j] = p.name; }
  }
  // the chiller, and its cooling water (a valve when the valves are motorized). One click turns it on, no pop-up (Rule 2.44).
  const ch = { immersion: { kind: 'ccoil', template: 'Immersion_Chiller', label: 'Immersion chiller' }, plate: { kind: 'pchiller', template: 'Plate_Chiller', label: 'Plate chiller' },
    counterflow: { kind: 'pchiller', template: 'Counterflow_Chiller', label: 'Counterflow chiller' } }[hot ? a.chiller : ''] ?? null;
  if (ch) equipment.push({ ...ch, x, y: 160 });
  // the wort out of the chiller has its own probe (OakBarn: "WORT OUT"), so the chill steps know when to stop
  if (ch) fields.Wort_Probe = add({ place: { at: 'e', i: equipment.length - 1, row: 0, col: 0 }, type: 'temperature', sensor: 'ds18b20', label: 'Wort out temp', x, y: 420, w: 170, h: 74, units: '°F', precision: 1, look: 'lcd', device: '' }).name;
  if (ch && a.valves === 'motorized') fields.Chill_Water = add({ place: { at: 'e', i: equipment.length - 1, row: 1, col: 0 }, type: 'digitalOut', label: 'Chiller water', device: '', x, y: 420, w: 170, h: 60, look: 'dark', onText: 'COOLING', offText: 'off' }).name;
  // the timers the Brew Process runs on (Widgets: no Port), named wgt_TMR_Label_TabID (Rule 3.14)
  const timer = (label, xx) => add({ place: { at: 'timers', i: xx > 100 ? 1 : 0 }, type: 'timer', name: suggestWidgetName({ code: 'TMR', label, tab: tabId }), label, timerType: 'countdown', look: 'led', x: xx, y: 780, w: 250, h: 104 });
  if (hot) {
    fields.Mash_Timer = timer('Mash timer', 60).name;
    fields.Boil_Timer = timer('Boil timer', 330).name;
  }
  // the fermentors, on their own Tab: each one's probe and its glycol (cooling) valve, one Heating Element on one Port in Hysteresis
  // that turns on above the Setpoint (a minus On offset cools, Rule 6.19). Fermentor 1 does the Ferment step's jobs.
  for (let i = 0; i < nF; i++) {
    const s = `FV${i + 1}`;
    vessels.push({ template: 'Fermenter', role: 'Fermentor', vtype: 'Fermenter', label: `Fermentor ${i + 1}`, short: s, tab: fTab, x: 60 + i * 260, y: 80 });
    const vi = vessels.length - 1;
    const probe = add({ place: { at: 'v', i: vi, row: 0, col: 0 }, type: 'temperature', sensor: 'ds18b20', label: `${s} temp`, x: 60, y: 420, w: 170, h: 74, units: '°F', precision: 1, look: 'lcd', device: '' }, fTab, fTabId);
    const g = add({ place: { at: 'v', i: vi, row: 1, col: 0 }, type: 'digitalOut', subtype: 'element', heatMethod: 'hysteresis', label: `${s} glycol`, device: '', input: probe.name, target: 66, onOffset: -1, onText: 'COOL', offText: 'idle', look: 'dark', x: 60, y: 500, w: 170, h: 60 }, fTab, fTabId);
    if (i === 0) { fields.Ferment_Probe = probe.name; fields.Ferment_Heater = g.name; }
  }
  const manifold = hot && a.manifold && a.manifold !== 'none' ? { template: a.manifold, kind: a.manifoldKind === 'motorized' ? 'motorized' : 'manual', x: Math.max(60, x - 120), y: 600 } : null;
  // the Brew Process: Whirlpool and Chill or Chill (Rule 16.1)
  // (only the Ferment step when there is no hot side)
  const templates = !hot ? Object.fromEntries(HOT_STEPS.map(k => [k, ''])) : { ...(a.process ?? {}), ...(a.whirlpool ? { Whirlpool_and_Chill: 'Skynet_Whirlpool_and_Chill', Chill: '' } : { Whirlpool_and_Chill: '', Chill: 'Skynet_Chill' }) };
  return { tab, tabId, fTab: nF ? fTab : null, fTabId: nF ? fTabId : null, devices, vessels, equipment, manifold, elements, fields, templates, width: Math.max(1600, x + 300), height: 900 };
}
