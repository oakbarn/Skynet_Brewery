// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
import { HYDRO_MODELS, HYDRO_MODEL_KEYS, TILT_COLOR_NAMES } from '../hydrometer.js';
// Connect your brewery (Rule 15.4, Fritz 2026-11-07): how the valves and pumps join the vessels. Used by the Importer's page
// (public/importer/importer.js) and its server (importer.js), so both work the same way (one source). No AI is used here: the
// guesses come from the item names, the BruControl Scripts and where BruControl had each item; the brewer checks every one.
//
// "Build the manifold like the knee bone is connected to the leg bone" (Fritz): the manifold is a list of CHAINS. A chain starts
// at a Vessel opening (or a pump, a valve, Tap Water ...) and each step says what the last piece is connected to, and whether
// by Hose or Pipe, until it reaches an end (a Vessel opening, Tap Water, Drain, a QD or Not connected).

// The openings a Vessel's pipes join (the Vessel Device's IP spots, public/app.js VW_IPS, without the Element and Probe spots)
export const OPENINGS = [
  ['cBottomOutlet', 'Center Bottom Outlet'], ['cOutlet', 'Center Outlet'], ['lTangential', 'Left Tangential'], ['rTangential', 'Right Tangential'],
  ['lSparge', 'Left Sparge'], ['rSparge', 'Right Sparge'], ['lHermsIn', 'Left HERMS In'], ['lHermsOut', 'Left HERMS Out'],
  ['rHermsIn', 'Right HERMS In'], ['rHermsOut', 'Right HERMS Out'],
];
export const openingName = k => OPENINGS.find(([x]) => x === k)?.[1] ?? k;

// A word on its own: "M_HLT Pump" has HLT, "Ghlt" has not (an underscore counts as a gap, as BruControl names use it)
const word = w => new RegExp(`(?<![a-z0-9])(?:${w})(?![a-z0-9])`, 'i');
// The vessel kinds, Hot Side first. A Fermenter is on the Cold Side: it is asked, not pictured (Fritz, 2026-11-07).
export const VESSEL_KINDS = [
  { key: 'HLT', name: 'HLT', re: word('hlt|hot ?liquor(?: tank)?'), side: 'hot' },
  { key: 'MLT', name: 'Mash Tun', re: word('mlt|mash(?: ?tun)?'), side: 'hot' },
  { key: 'BK', name: 'Boil Kettle', re: word('bk|boil(?: ?kettle)?|kettle'), side: 'hot' },
  { key: 'FV', name: 'Fermenter', re: word('ferm\\w*|conical|unitank'), side: 'cold' },
];
const PUMP = /pump|chugger|riptide|march|whirlpool/i;
const VALVE = new RegExp([/valve|butterfly/.source, word('(?:m_)?v\\d+|pv ?\\d+|fv ?\\d+|bv ?\\d*|mbv ?\\d*').source].join('|'), 'i');
const PUMP_TYPES = new Set(['digitalOut', 'pwmOut', 'hysteresis', 'deadband', 'pid']);
const VALVE_TYPES = new Set(['digitalOut', 'pwmOut']);
const NOT_VALVE = /switch|block|ssr|outlet|relay|24 ?vdc|120 ?vac/i;     // a power switch for the valves is not a valve
const COOL = /cool|chill|glycol/i, WARM = /warm|heat/i;

const textOf = e => `${e.bru?.name ?? ''} ${e.label ?? ''}`;
// shown by its BruControl name during the interview (OakBarn Brewery, 2026-11-08: "use the Brucontrol names from the start until we
// get further in the interview"), so the brewer knows each one; the Skynet name is still its name in the Schema (Rule 15.1)
const itemOf = (e, kind) => ({ id: e.name, kind, label: e.bru?.name || e.label || e.name, bru: e.bru?.name || e.name, tab: e.workspace, x: e.x, y: e.y, w: e.w, h: e.h });

// The parts of the brewery this page joins: the vessels (guessed from the names and Scripts), the pumps and the valves.
// conv = the converted config (lib/bruimport.js); scripts = [{ name, text }] (read only as clues, Fritz 2026-11-06)
export function findParts(conv, scripts = []) {
  const els = conv?.elements ?? [];
  const pumps = [], valves = [];
  for (const e of els) {
    if (e.subtype === 'element' || e.integratedIn) continue;
    const t = textOf(e);
    if (PUMP.test(t) && PUMP_TYPES.has(e.type)) pumps.push(itemOf(e, 'pump'));
    else if (VALVE.test(t) && !NOT_VALVE.test(t) && VALVE_TYPES.has(e.type)) valves.push(itemOf(e, 'valve'));
  }
  const all = [...els.map(textOf), ...scripts.map(s => `${s.name} ${s.text}`)].join('\n');
  const vessels = VESSEL_KINDS.filter(k => k.re.test(all)).map(k => ({ key: k.key, name: k.name, side: k.side }));
  return { vessels, pumps, valves };
}
// ---- The item pages (OakBarn Brewery, 2026-11-08: "before the Vessels getting the Details of all The Elements that are an Interface
// Element and divide them in to pages: Pumps, Heaters, Probes, Valves, Flow ... Always begin with How Many and if you found 3, and the
// User Says 5, add two empty slots with the Name Pump 4, Pump 5"). Each item on a board port has one kind; each page asks a few details.
// No answer may stay "Not sure" (OakBarn Brewery, 2026-11-08): every list starts at "Pick one…" and must be picked, and every list
// of types ends with "User defined", which asks for its own words. Pump models: the AC pumps the Panel has pictures for, and the
// DC (12 V and 24 V) list in docs/DC_Brewing_Pumps.md.
export const PICK = ['', 'Pick one…'], USER = ['user', 'User defined (type it)'];
export const PUMP_MODELS = [PICK, ['march809', 'March 809 (AC)'], ['march815', 'March 815 (AC)'], ['chugger', 'Chugger (AC)'],
  ['riptide', 'Blichmann RipTide (AC)'], ['mkii', 'KegLand MKII (AC)'], ['td5', 'Topsflo TD5 (24 V DC)'], ['march809dc', 'March 809 DC (12 or 24 V DC)'],
  ['hbmp20', 'DDMETER HB-MP20 (12 V DC)'], ['jt1000', 'BrewTaurus JT-1000B-24 (24 V DC)'], ['bayite', 'bayite BYT-7A006 (12 V DC)'],
  ['solar12', 'Solar hot-water pump (12 V DC)'], ['penguin', 'Penguin Chillers glycol pump (12 or 24 V DC)'], ['gf30', 'Grainfather GF30 cooling pump (12 V DC)'],
  ['submersible', 'Small submersible pump (12 or 24 V DC)'], USER];
// a pump model made for one voltage only fills in its Power by itself (OakBarn Brewery, 2026-11-08: "If a Pump only has one voltage
// option, fill in the voltage automatically"); "12 or 24 V DC" and "(AC)" (120 or 240 V) are left for the brewer to pick
export const onePower = model => { const m = /\((12|24) V DC\)$/.exec(PUMP_MODELS.find(([k]) => k === model)?.[1] ?? ''); return m ? 'dc' + m[1] : ''; };
const VOLTS = [PICK, ['dc5', '5 V DC'], ['dc12', '12 V DC'], ['dc24', '24 V DC'], ['ac120', '120 V AC'], ['ac240', '240 V AC'], USER];
// the Skynet probe types (public/naming.js, Device Type IDs for a temperature probe)
const PROBES = [PICK, ['1W', 'OneWire (DS18B20)'], ['RTD', 'RTD (PT100 or PT1000)'], ['TC', 'Thermocouple (MAX31855 / MAX31856 board)'], ['10KNTC', '10K NTC thermistor (BCS-462 / BruControl type)'],
  ['5KNTC', '5K NTC thermistor'], ['50KNTC', '50K NTC thermistor'], ['100KNT', '100K NTC thermistor (3D printer type)'], ['NTC', 'Other NTC thermistor'], ['LM35', 'LM35 (analog)'], ['TMP36', 'TMP36 (analog)'], USER];
// the Skynet valves (docs/Device_Library.md 4.3 to 4.6a)
const VALVES = [PICK, ['mbv', 'Skynet Motorized Ball Valve'], ['mbfv', 'Skynet Motorized Butterfly Valve'], ['mbvUser', 'User Defined Motorized Ball Valve'],
  ['hot', 'High Temperature Electric Valve'], ['kld20t', 'Skynet KLD20T Proportional Valve (0-100 %)'], ['propUser', 'User Defined Proportional Valve (0-100 %)'],
  ['solenoid', 'Solenoid Valve (liquid)'], ['gas', 'Solenoid Gas Valve'], USER];
// how the valve is built into the manifold: its connection to the pipes, not the thread on the valve itself
const CONNECTIONS = [PICK, ['tc', 'TC (Tri-Clamp)'], ['npt', 'NPT (US tapered thread)'], ['bsp', 'BSP (British thread)'], USER];
// sizes up to 4 inch, in inches with millimeters, and the metric (DN) sizes, whatever units were picked (OakBarn Brewery, 2026-11-08)
const SIZES = [PICK, ...[['1/8', 0.125], ['1/4', 0.25], ['3/8', 0.375], ['1/2', 0.5], ['3/4', 0.75], ['1', 1], ['1 1/4', 1.25], ['1 1/2', 1.5], ['2', 2], ['2 1/2', 2.5], ['3', 3], ['4', 4]]
  .map(([t, n]) => [String(n), `${t} inch (${Math.round(n * 25.4 * 10) / 10} mm)`]),
  ...[6, 8, 10, 15, 20, 25, 32, 40, 50, 65, 80, 100].map(n => ['mm' + n, `${n} mm (DN${n})`]), USER];
const FLOW_METERS = [PICK, ['hall', 'Hall effect (paddle wheel, like the YF-S201)'], ['turbine', 'Turbine'], ['ovalGear', 'Oval gear (positive displacement)'],
  ['magnetic', 'Magnetic (mag meter)'], ['ultrasonic', 'Ultrasonic'], ['thermal', 'Thermal mass'], ['vortex', 'Vortex'], USER];
const PH_METERS = [PICK, ['ph4502', 'Analog pH board (PH-4502C or similar)'], ['gravity', 'DFRobot Gravity pH'], ['atlas', 'Atlas Scientific EZO pH (I2C or serial)'], ['handheld', 'Hand-held pH meter (read by hand)'], USER];
const SIGNALS = [PICK, ['v5', 'Analog 0-5 V'], ['v33', 'Analog 0-3.3 V'], ['v10', 'Analog 0-10 V'], ['ma', '4-20 mA'], ['i2c', 'I2C'], ['serial', 'Serial (UART)'], ['none', 'None (read by hand)'], USER];
const PRESSURE = [PICK, ['transducer', 'Pressure transducer (0.5-4.5 V)'], ['transmitter', 'Pressure transmitter (4-20 mA)'], ['i2c', 'I2C pressure sensor'], ['switch', 'Pressure switch (on / off)'], ['spunding', 'Spunding valve with a sensor'], USER];
// the Panel's Hydrometer Templates (Rule 6.25, public/hydrometer.js). A Glass hydrometer or a Refractometer is read by hand: in Skynet that
// is the Process command take_reading, not a Device (OakBarn Brewery, 2026-11-09: "Glass and Refractometer Readings are external")
// a Tilt, Tilt Pro or Tilt Pro Mini: told apart by its Color (Rule 6.25)
export const isTiltKind = k => HYDRO_MODELS[k]?.idBy === 'color';
const HYDROS = [PICK, ...HYDRO_MODEL_KEYS.map(k => [k, HYDRO_MODELS[k].label]), USER];
const TILT_COLORS = [PICK, ...TILT_COLOR_NAMES.map(c => [c, c])];
const VOLUMES = [PICK, ['scale', 'Load cells (a scale)'], ['ultrasonic', 'Ultrasonic level sensor'], ['pressureLevel', 'Pressure (liquid height) sensor'], ['float', 'Float level sensor (many steps)'], ['flowTotal', 'Flow meter total'], ['sight', 'Sight glass (read by hand)'], USER];
const FLOATS = [PICK, ['floatTop', 'Float switch, high level'], ['floatLow', 'Float switch, low level'], ['capacitive', 'Capacitive level switch'], ['optical', 'Optical level switch'], USER];
const CONTACT = [PICK, ['no', 'Normally Open (closes when it is made)'], ['nc', 'Normally Closed (opens when it is made)']];
const DIN_TYPES = [PICK, ['DI', 'Direct Input (plain)'], ['DIN', 'DIN momentary push button (one trigger per press)'], ['PB', 'Push button (ON only while held)'], ['Toggle', 'Toggle button (press ON, press again OFF)'],
  ['Latch', 'Latching input (ON until reset)'], ['FlowSw', 'Flow switch'], ['Intlk', 'Door / lid / safety interlock'], ['EStop', 'Emergency stop'], ['Leak', 'Leak sensor'], ['Count', 'Pulse counter'], USER];
// The Control Type columns (OakBarn Brewery, 2026-11-08: "Speed becomes Control Type"): one numbered column per control method,
// each with a tick box, and a last column that picks the Primary method by its number. A method that is not recommended for the
// kind of item unticks itself and says why, with a button to use it anyway. On/Off is always allowed (Rule 6.19).
export const METHOD_COLS = [['onoff', 'On/Off'], ['pwm', 'Speed (PWM)'], ['dutyCycle', 'Duty Cycle'], ['hysteresis', 'Hysteresis'], ['pid', 'PID'], ['deadband', 'Deadband'], ['precise', 'Precise']];
const PUMP_WHY = 'A pump is not run this way. This method switches the pump on and off many times a minute to hold a number: it wears out the motor and its relay, and a pump does not hold a temperature by itself. Use On/Off, Speed (PWM) or Hysteresis (a Cool / Warm Pump, Rule 6.21).';
// the On/Off column's name: a Heating Element always has its On/Off button (Rule 6.19), so for it the column is "On/Off Only", a heater
// controlled by nothing else (OakBarn Brewery, 2026-11-08: "On/Off column should be On/Off Only ... Every heater has on off as the means
// to turn it on")
export const methodName = (kind, k) => kind === 'heater' && k === 'onoff' ? 'On/Off Only' : METHOD_COLS.find(m => m[0] === k)?.[1] ?? k;
export const NOT_RECOMMENDED = {
  pump: { dutyCycle: PUMP_WHY, pid: PUMP_WHY, deadband: PUMP_WHY, precise: PUMP_WHY },
  heater: { pwm: 'A heating element has no speed. Speed (PWM) is for a pump, a fan or a motor. A heater on a PWM pin is run by Duty Cycle, PID, Deadband or Precise, which work out its % for you.' },
};
export const PART_PAGES = [
  { kind: 'pump', title: 'Pumps', one: 'Pump', methods: true, fields: [
    { k: 'model', name: 'Pump model', list: PUMP_MODELS },
    { k: 'power', name: 'Power', list: [PICK, ['ac120', '120 V AC'], ['ac240', '240 V AC'], ['dc12', '12 V DC'], ['dc24', '24 V DC'], USER] }] },
  { kind: 'heater', title: 'Heating Elements', one: 'Heating Element', methods: true, fields: [
    { k: 'watts', name: 'Watts', number: true, optional: true },      // may be left blank (OakBarn Brewery, 2026-11-08: "Wattage Optional No Red Boxes")
    { k: 'volts', name: 'Volts', list: [PICK, ['ac120', '120 V AC'], ['ac240', '240 V AC'], USER] }] },
  { kind: 'probe', title: 'Temperature Probes', one: 'Probe', fields: [
    { k: 'probe', name: 'Probe type', list: PROBES }] },
  // Only Connection Type and Size must be filled in on a valve: they change how it is drawn; Valve type and Voltage are good to know
  // (OakBarn Brewery, 2026-11-09: "Connection Type and size mandatory Other Fields not"). The top of the page sets all three on every
  // line at once (setAll).
  { kind: 'valve', title: 'Valves', one: 'Valve', setAll: ['connection', 'size', 'volts'], fields: [
    { k: 'valve', name: 'Valve type', list: VALVES, optional: true },
    { k: 'connection', name: 'Connection Type', list: CONNECTIONS, help: 'How the valve is built into your manifold: the connection it has to the pipes, not the thread on the valve itself. A BSP valve with a BSP to NPT adapter and a female TC on each end is a TC valve, because it joins the manifold with Tri-Clamps.' },
    { k: 'size', name: 'Size', list: SIZES },
    { k: 'volts', name: 'Voltage', list: VOLTS, optional: true }] },
  { kind: 'flow', title: 'Flow Meters', one: 'Flow Meter', fields: [
    { k: 'meter', name: 'Meter type', list: FLOW_METERS },
    { k: 'pulses', name: 'Pulses per Gallon or Liter', number: true }] },
  { kind: 'ph', title: 'pH Meters', one: 'pH Meter', fields: [
    { k: 'meter', name: 'pH meter type', list: PH_METERS },
    { k: 'signal', name: 'Signal to the board', list: SIGNALS }] },
  { kind: 'pressure', title: 'Pressure Sensors (PSI)', one: 'Pressure Sensor', fields: [
    { k: 'sensor', name: 'Sensor type', list: PRESSURE },
    { k: 'range', name: 'Highest pressure it reads (psi or bar)', number: true }] },
  { kind: 'hydro', title: 'Hydrometers', one: 'Hydrometer', fields: [
    { k: 'hydro', name: 'Hydrometer type', list: HYDROS },
    // Tilt Color and Hardware ID are mandatory (OakBarn Brewery, 2026-11-09): a Tilt must have its Color, every other kind its
    // Hardware ID; the one its type does not use is greyed out. need(row): true = mandatory, false = greyed, undefined = no type yet
    { k: 'color', name: 'Tilt Color (a Tilt only)', list: TILT_COLORS, optional: true, need: d => d.hydro ? isTiltKind(d.hydro) : undefined,
      blank: 'The Color for a Tilt cannot be left blank. Choose a Color.' },
    { k: 'hwId', name: 'Hardware ID (not a Tilt: its Name or ID)', text: true, optional: true, need: d => d.hydro ? !isTiltKind(d.hydro) : undefined }] },
  { kind: 'volume', title: 'Volume Meters', one: 'Volume Meter', fields: [
    { k: 'meter', name: 'How it measures', list: VOLUMES },
    { k: 'most', name: 'Most it reads (Gallons or Liters)', number: true }] },
  { kind: 'float', title: 'Floats', one: 'Float', fields: [
    { k: 'float', name: 'Float type', list: FLOATS },
    { k: 'contact', name: 'Contact', list: CONTACT }] },
  { kind: 'din', title: 'Digital Inputs (DIN)', one: 'Digital Input', fields: [
    { k: 'input', name: 'Input type', list: DIN_TYPES }] },
  { kind: 'other', title: 'Other items', one: 'Item', fields: [] }];
// the kind of an item on a board port, for the item pages
const PH = /(^|[^a-z])ph([^a-z]|$)/i, PRESS = /psi|pressure|press(^|[^a-z])|spund|\bbar\b/i, FLOWW = /flow|(^|[^a-z])fm ?\d/i, HYDRO = /tilt|hydrometer|ispindel|rapt|plaato|gravity/i;
const VOLW = /volume|level|(^|[^a-z])vol([^a-z]|$)|scale|load ?cell/i, FLOATW = /float/i;
export function itemKind(e) {
  if (!e) return 'other';
  const t = textOf(e);
  if (e.subtype === 'pump' || (e.subtype !== 'element' && PUMP.test(t) && PUMP_TYPES.has(e.type))) return 'pump';
  if (e.subtype === 'element' || HEAT_TYPES.has(e.type)) return 'heater';
  if (e.type === 'flowMeter' || (FLOWW.test(t) && /analogIn|digitalIn/.test(e.type) && !/temp/i.test(t))) return 'flow';
  if (isProbe(e)) return 'probe';
  if (VALVE.test(t) && !NOT_VALVE.test(t) && VALVE_TYPES.has(e.type)) return 'valve';
  if (e.type === 'analogIn' && PH.test(t)) return 'ph';
  if (e.type === 'analogIn' && PRESS.test(t)) return 'pressure';
  if (e.type === 'hydrometer' || (HYDRO.test(t) && /analogIn|digitalIn/.test(e.type))) return 'hydro';
  if ((e.type === 'analogIn' || e.type === 'scale') && VOLW.test(t)) return 'volume';
  if (e.type === 'digitalIn' && FLOATW.test(t)) return 'float';
  if (e.type === 'digitalIn') return 'din';
  return 'other';
}
// the first guesses for an item's details (each one can be changed)
export function guessPartDetails(e, kind) {
  const t = textOf(e);
  if (kind === 'pump') {
    const m = e.heatMethod === 'hysteresis' ? 'hysteresis' : e.type === 'pwmOut' ? 'pwm' : 'onoff';
    const model = /chu+g+er/i.test(t) ? 'chugger' : /riptide/i.test(t) ? 'riptide' : /march ?815/i.test(t) ? 'march815' : /march/i.test(t) ? 'march809' : /mkii|mk ?2/i.test(t) ? 'mkii' : /td5|topsflo/i.test(t) ? 'td5' : '';
    return { model,
      power: /240 ?v?ac/i.test(t) ? 'ac240' : /120 ?v?ac/i.test(t) ? 'ac120' : /24 ?v?dc/i.test(t) ? 'dc24' : /12 ?v?dc/i.test(t) ? 'dc12' : onePower(model),
      methods: [...new Set(['onoff', m])], primary: m };
  }
  if (kind === 'heater') {
    const w = /(\d{3,5}) ?w\b/i.exec(t), start = e.heatMethod || 'onoff';
    const ms = ['onoff', ...METHOD_COLS.map(([k]) => k).filter(k => k === start || e['methodSpot_' + k])];
    return { watts: w ? Number(w[1]) : '', volts: /240/.test(t) ? 'ac240' : /120/.test(t) ? 'ac120' : '', methods: [...new Set(ms)], primary: start };
  }
  if (kind === 'probe') return { probe: e.type === 'temperature' ? '1W' : /pt ?100|rtd/i.test(t) ? 'RTD' : /ntc|thermistor/i.test(t) ? '10KNTC' : '' };
  if (kind === 'valve') return { valve: /solenoid/i.test(t) ? 'solenoid' : /butterfly/i.test(t) ? 'mbfv' : e.type === 'pwmOut' || /(^|[^a-z])pv ?\d/i.test(t) ? 'propUser' : /mbv|motor|ball|(^|[^a-z])v\d/i.test(t) ? 'mbv' : '',
    connection: /npt/i.test(t) ? 'npt' : /bsp/i.test(t) ? 'bsp' : /(^|[^a-z])tc([^a-z]|$)|tri ?clamp/i.test(t) ? 'tc' : '', size: '', volts: /24 ?v/i.test(t) ? 'dc24' : /12 ?v/i.test(t) ? 'dc12' : '' };
  if (kind === 'flow') return { meter: /hall|yf-?s/i.test(t) ? 'hall' : '', pulses: '' };
  if (kind === 'ph') return { meter: /atlas|ezo/i.test(t) ? 'atlas' : '', signal: e.type === 'analogIn' ? 'v5' : '' };
  if (kind === 'pressure') return { sensor: e.type === 'analogIn' ? 'transducer' : e.type === 'digitalIn' ? 'switch' : '', range: '' };
  if (kind === 'hydro') return { hydro: e.model || (/tilt ?pro/i.test(t) ? 'tiltPro' : /tilt/i.test(t) ? 'tilt' : /ispindel/i.test(t) ? 'ispindel' : /gravitymon/i.test(t) ? 'gravitymon' : /rapt/i.test(t) ? 'raptPill' : /plaato/i.test(t) ? 'plaato' : ''),
    color: e.color || TILT_COLOR_NAMES.find(c => new RegExp(`\\b${c}\\b`, 'i').test(t)) || '', hwId: e.hwId || '' };
  if (kind === 'volume') return { meter: e.type === 'scale' || /scale|load/i.test(t) ? 'scale' : '', most: '' };
  if (kind === 'float') return { float: /low|bottom/i.test(t) ? 'floatLow' : /high|top/i.test(t) ? 'floatTop' : '', contact: '' };
  if (kind === 'din') return { input: { momentary: 'DIN', latch: 'Latch', toggle: 'Toggle', counter: 'Count' }[e.mode] ?? (FLOATW.test(t) ? '' : '') };
  return {};
}
// keep only known answers (for the saved Schema); a User defined answer keeps its words (<key>User)
export function cleanPartDetails(kind, d) {
  const page = PART_PAGES.find(x => x.kind === kind), out = {};
  for (const f of page?.fields ?? []) {
    const v = d?.[f.k];
    if (f.number) { const n = Number(v); if (v !== '' && v != null && Number.isFinite(n) && n >= 0 && n < 1e6) out[f.k] = n; }
    else if (f.text) { const w = String(v ?? '').trim().slice(0, 60); if (w) out[f.k] = w; }
    else if (v && f.list.some(([k]) => k === v)) {
      out[f.k] = v;
      if (v === 'user') { const w = String(d?.[f.k + 'User'] ?? '').trim().slice(0, 60); if (w) out[f.k + 'User'] = w; }
    }
  }
  if (page?.methods) {
    const keys = METHOD_COLS.map(([k]) => k);
    const ms = [...new Set(['onoff', ...(Array.isArray(d?.methods) ? d.methods : []).filter(k => keys.includes(k))])];
    out.methods = keys.filter(k => ms.includes(k));
    out.primary = ms.includes(d?.primary) ? d.primary : 'onoff';
    const ov = (Array.isArray(d?.override) ? d.override : []).filter(k => ms.includes(k) && NOT_RECOMMENDED[kind]?.[k]);
    if (ov.length) out.override = ov;
  }
  return out;
}
// ---- The Vessels page (OakBarn Brewery, 2026-11-08): each vessel found, with what the import could tell about it, from the names
// of its items and the Scripts: its heaters, its probe (a thermowell with a probe), a Tangential inlet (or a whirlpool), a Steam
// Slayer, a Sparge Arm, a HERMS Coil. Manual valves are never in BruControl, so they are asked: None, Manual Ball Valve or Manual
// Butterfly Valve, None to start. Every found answer is a guess the brewer can change.
export const MANUAL_VALVES = [['none', 'None'], ['ball', 'Manual Ball Valve'], ['butterfly', 'Manual Butterfly Valve']];
export const VESSEL_PARTS = [['tangential', 'Tangential Inlet', /tangent|whirl ?pool/i], ['steamSlayer', 'Steam Slayer', /steam ?slayer/i],
  ['spargeArm', 'Sparge Arm', /sparge/i], ['herms', 'HERMS Coil', /herms/i]];
const HEAT_TYPES = new Set(['hysteresis', 'pid', 'dutyCycle', 'deadband']);
// every BruControl probe found (a temperature item, or an analog input named like a probe), for the Thermowell dropdown
const isProbe = e => e.type === 'temperature' || (e.type === 'analogIn' && /temp|probe|rtd|ntc|pt ?100/i.test(textOf(e)));
export function findProbes(conv) {
  return (conv?.elements ?? []).filter(isProbe).map(e => ({ id: e.name, label: e.bru?.name || e.label || e.name }));
}
// every BruControl heating element found (a PID, Hysteresis, Duty Cycle or Deadband, or a Heating Element), for the Heater dropdown
export function findHeaters(conv) {
  return (conv?.elements ?? []).filter(e => e.subtype === 'element' || HEAT_TYPES.has(e.type)).map(e => ({ id: e.name, label: e.bru?.name || e.label || e.name }));
}
export function findVesselDetails(conv, scripts = [], vessels = []) {
  const els = conv?.elements ?? [];
  const out = {};
  for (const v of vessels) {
    const re = VESSEL_KINDS.find(k => k.key === v.key)?.re ?? word(v.name.replace(/[^\w ]/g, ''));
    const mine = els.filter(e => re.test(textOf(e)));
    const lines = [...mine.map(textOf), ...scripts.flatMap(s => `${s.name}\n${s.text}`.split(/\r?\n/)).filter(l => re.test(l))].join('\n');
    const lab = e => e.bru?.name || e.label || e.name;      // the BruControl name during the interview
    const heaters = mine.filter(e => e.subtype === 'element' || HEAT_TYPES.has(e.type)).map(e => ({ id: e.name, label: lab(e) }));
    const probe = mine.find(e => e.type === 'temperature') ?? mine.find(isProbe);
    // Motorized Ball Valve (OakBarn Brewery, 2026-11-08): picked from every motorized valve found; the guess is the vessel's own valve
    const valve = mine.find(e => VALVE.test(textOf(e)) && !NOT_VALVE.test(textOf(e)) && VALVE_TYPES.has(e.type) && !e.integratedIn);
    const d = { heaters, probe: probe ? { id: probe.name, label: lab(probe) } : null, manualValve: 'none', motorValve: valve?.name ?? '',
      heater: heaters[0] ?? null,
      found: { ...(valve ? { motorValve: true } : {}), ...(probe ? { probe: true } : {}), ...(heaters.length ? { heater: true } : {}) } };
    for (const [k, , rx] of VESSEL_PARTS) { d[k] = rx.test(lines) ? 'yes' : 'no'; if (d[k] === 'yes') d.found[k] = true; }
    // Sparge Arm and Steam Slayer are one answer, where it sits (OakBarn Brewery, 2026-11-08): None, Upper Left or Upper Right; a found one
    // starts at Upper Right (change it when it is on the left)
    d.sparge = d.spargeArm === 'yes' || d.steamSlayer === 'yes' ? 'right' : 'none';
    if (d.sparge !== 'none') d.found.sparge = true;
    delete d.spargeArm; delete d.steamSlayer; delete d.found.spargeArm; delete d.found.steamSlayer;
    // HERMS Coil is a tick box that starts unticked (OakBarn Brewery, 2026-11-08); a Script that mentions one only says so
    if (d.herms === 'yes') d.found.herms = true;
    d.herms = 'none';
    // Outlet (OakBarn Brewery, 2026-11-08): None, Center Low or Bottom Drain; a Hot Side vessel starts at Bottom Drain, the opening the
    // first guesses on Connect your brewery leave from
    d.outlet = v.side === 'cold' ? 'none' : 'bottom';
    // a whirlpool pump puts its wort back into the Boil Kettle through a tangential inlet
    if (v.key === 'BK' && d.tangential === 'no' && els.some(e => /whirl ?pool/i.test(textOf(e)))) { d.tangential = 'yes'; d.found.tangential = true; }
    out[v.key] = d;
  }
  return out;
}
// which vessel an item belongs to, by its name (M_HLT Pump -> HLT), or ''
export function vesselOf(item, vessels) {
  const t = `${item.bru} ${item.label}`;
  return vessels.find(v => VESSEL_KINDS.find(k => k.key === v.key)?.re.test(t))?.key ?? '';
}

// ---- the ends of a link. kind: vessel (key, at = an opening), pump (id, side in/out), valve (id), tap, drain,
// qd (sex male/female, shut true = Shut-off), manifold (n), tee (n: Tee 1, 2 ...), none
export const endKey = e => !e ? '' : e.kind === 'vessel' ? `vessel:${e.key}:${e.at}` : e.kind === 'pump' || e.kind === 'valve' ? `${e.kind}:${e.id}`
  : e.kind === 'qd' ? `qd:${e.sex || 'male'}:${e.shut ? 'shut' : 'open'}:${e.n ?? 1}` : e.kind === 'manifold' ? `manifold:${e.n ?? 1}` : e.kind === 'tee' ? `tee:${e.n ?? 1}` : e.kind;
export const isFinal = e => ['vessel', 'tap', 'drain', 'qd', 'none'].includes(e?.kind);
export function endText(e, parts) {
  if (!e) return '';
  const find = id => [...(parts?.pumps ?? []), ...(parts?.valves ?? [])].find(i => i.id === id);
  switch (e.kind) {
    case 'vessel': return `${parts?.vessels?.find(v => v.key === e.key)?.name ?? e.key} ${openingName(e.at)}`;
    case 'pump': return `${find(e.id)?.label ?? e.id}${e.side ? ` ${e.side === 'out' ? 'Out' : 'In'}` : ''}`;
    case 'valve': return find(e.id)?.label ?? e.id;
    case 'tap': return 'Tap Water';
    case 'drain': return 'Drain';
    case 'qd': return `QD ${e.n ?? 1} (${e.sex === 'female' ? 'Female' : 'Male'}, ${e.shut ? 'Shut-off' : 'Open'})`;
    case 'manifold': return `Supply Manifold ${e.n ?? 1}`;
    case 'tee': return `Tee ${e.n ?? 1}`;
    default: return 'Not connected';
  }
}

// ---- the guesses (each one marked as a guess until the brewer OKs or changes it)
// 1. names: a vessel's own valve and pump ("M_HLT PV2", "M_HLT Pump"): its Center Bottom Outlet -> its valve -> its pump's In,
//    by Pipe ("the outlet's connected to the valve, the valve's connected to the pump"). A whirlpool pump goes back into the
//    Boil Kettle's Right Tangential.
// 2. the picture: on a Tab with a background picture (a brewer who put the buttons on a picture of the brewery), a valve that
//    sits right next to a pump is joined to that pump's In.
// The fermenter's own valves and pumps are left to the Fermenter questions.
export function guessChains(parts, { backgrounds = {}, fermenters = [] } = {}) {
  const chains = [], used = new Set(fermenters.flatMap(f => [f.feed, f.ret, f.coolPump, f.warmPump]).filter(Boolean));
  const hot = parts.vessels.filter(v => v.side === 'hot');
  const mine = (list, v) => list.filter(i => !used.has(i.id) && vesselOf(i, parts.vessels) === v.key && !COOL.test(i.bru) && !/whirlpool/i.test(i.bru));
  for (const v of hot) {
    const valves = mine(parts.valves, v), pumps = mine(parts.pumps, v);
    if (!valves.length && !pumps.length) continue;
    const steps = [...valves.map(i => ({ to: { kind: 'valve', id: i.id }, by: 'pipe', source: 'name' })),
      ...pumps.slice(0, 1).map(i => ({ to: { kind: 'pump', id: i.id, side: 'in' }, by: 'pipe', source: 'name' }))];
    for (const s of steps) used.add(s.to.id);
    chains.push({ start: { kind: 'vessel', key: v.key, at: 'cBottomOutlet' }, steps });
  }
  const bk = hot.find(v => v.key === 'BK');
  for (const p of parts.pumps) if (!used.has(p.id) && bk && /whirlpool/i.test(p.bru)) {
    used.add(p.id);
    chains.push({ start: { kind: 'pump', id: p.id, side: 'out' }, steps: [{ to: { kind: 'vessel', key: 'BK', at: 'rTangential' }, by: 'pipe', source: 'name' }] });
  }
  // the picture: only on a Tab with a background picture
  for (const val of parts.valves) {
    if (used.has(val.id) || !backgrounds[val.tab]) continue;
    const near = parts.pumps.filter(p => p.tab === val.tab && !COOL.test(p.bru) && gap(val, p) <= Math.max(40, Math.min(val.w, val.h)))
      .sort((a, b) => gap(val, a) - gap(val, b))[0];
    if (!near) continue;
    used.add(val.id);
    chains.push({ start: { kind: 'valve', id: val.id }, steps: [{ to: { kind: 'pump', id: near.id, side: 'in' }, by: 'pipe', source: 'picture' }] });
  }
  return chains;
}
// the gap between two boxes on a Tab (0 when they touch or overlap)
function gap(a, b) {
  const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w)), dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h));
  return Math.hypot(dx, dy);
}

// The Fermenter questions (Fritz, 2026-11-07: "for Fermentors we ask questions as they are likely in a different Room").
// Each starts with a guess from the names and Scripts, for example Tartan's "FV 1 ... // return glycol", "FV 2 ... // feed glycol".
export const COOLING = [['coil', 'Glycol coil inside'], ['jacket', 'Glycol jacket'], ['chamber', 'Fermentation chamber (fridge)'], ['wrap', 'Cooling wrap'], ['none', 'Not cooled']];
export const HEATING = [['none', 'Not heated'], ['pump', 'Warm water pumped through it'], ['wrap', 'Heat wrap or belt'], ['chamber', 'Heater in the chamber']];
export function guessFermenters(parts, conv, scripts = []) {
  const els = conv?.elements ?? [], text = scripts.map(s => s.text).join('\n'), lines = text.split(/\r?\n/);
  const ferm = VESSEL_KINDS.find(k => k.key === 'FV').re;
  const said = (item, re) => lines.some(l => l.includes(`"${item.bru}"`) && re.test(l));
  return parts.vessels.filter(v => v.side === 'cold').map(v => {
    const valves = parts.valves, pumps = parts.pumps;
    const feed = valves.find(i => said(i, /feed|supply/i)), ret = valves.find(i => i !== feed && said(i, /return/i));
    const coolPump = pumps.find(i => COOL.test(i.bru)), warmPump = pumps.find(i => WARM.test(i.bru) && !COOL.test(i.bru));
    const probe = els.find(e => ['temperature', 'analogIn'].includes(e.type) && ferm.test(textOf(e)) && /temp/i.test(textOf(e)));
    const pressure = els.find(e => e.type === 'analogIn' && ferm.test(textOf(e)) && /psi|pressure/i.test(textOf(e)));
    const glycol = /glycol/i.test(text) || els.some(e => /glycol/i.test(textOf(e)));
    return { vessel: v.key, cooling: glycol ? 'coil' : coolPump ? 'jacket' : 'none', heating: warmPump ? 'pump' : 'none',
      feed: feed?.id ?? '', ret: ret?.id ?? '', coolPump: coolPump?.id ?? '', warmPump: warmPump?.id ?? '', probe: probe?.name ?? '', pressure: pressure?.name ?? '', source: 'guess' };
  });
}

// ---- chains <-> links
// The links of a chain, one per step: { from, to, by, source }. After a pump the next link leaves from its Out.
export function chainLinks(c) {
  const out = [];
  let at = c.start;
  for (const s of c.steps ?? []) {
    const from = at?.kind === 'pump' ? { ...at, side: at === c.start ? (at.side || 'out') : 'out' } : at;
    out.push({ from, to: s.to, by: s.by || 'pipe', source: s.source || 'you' });
    at = s.to;
  }
  return out;
}
export const allLinks = chains => chains.flatMap(chainLinks);
// Links (from the AI's answer, or the picture) made into chains: a link that starts where a chain ends carries that chain on
const sameItem = (a, b) => (a.kind === 'pump' || a.kind === 'valve') ? a.kind === b.kind && a.id === b.id : endKey(a) === endKey(b);
export function chainsFromLinks(links) {
  const chains = [];
  for (const l of links) addLink(chains, l);
  return chains;
}
// Hose or Pipe: the guess is Pipe, unless one end is a QD (then Hose) (Fritz, 2026-11-07)
export const guessBy = (a, b) => a?.kind === 'qd' || b?.kind === 'qd' ? 'hose' : 'pipe';
// One more link: it carries on the chain that ends where it starts, or starts a new chain; chains that now meet are joined
// How a piece is joined (OakBarn Brewery, 2026-11-08: "Join Left Right vertical or hose as choices"): a Pipe straight down (the
// next piece below), a Pipe to the left or to the right (the next piece beside it), or a Hose. Kept as by = pipe or hose, with
// dir = left or right for a Pipe that runs across (no dir = down), so older answers still read.
export const JOINS = [['pipe', 'Vertical pipe'], ['left', 'Pipe to the left'], ['right', 'Pipe to the right'], ['hose', 'Hose']];
export const joinOf = s => s?.by === 'hose' ? 'hose' : s?.dir === 'left' || s?.dir === 'right' ? s.dir : 'pipe';
export function setJoin(s, j) {
  if (j === 'hose') { s.by = 'hose'; delete s.dir; }
  else { s.by = 'pipe'; if (j === 'left' || j === 'right') s.dir = j; else delete s.dir; }
  return s;
}
// Add a tee after a piece (OakBarn Brewery, 2026-11-08: "the ability to add tees"): the line goes on through the tee, and a branch
// starts at the tee as its own chain (joined to nothing yet, to the right). Returns the tee.
export function addTee(chains, ci, si) {
  const c = chains[ci]; if (!c) return null;
  const ns = chains.flatMap(x => [x.start, ...x.steps.map(t => t.to)]).filter(e => e?.kind === 'tee').map(e => e.n || 1);
  const tee = { kind: 'tee', n: ns.length ? Math.max(...ns) + 1 : 1 };
  c.steps.splice(si + 1, 0, { to: tee, by: 'pipe', source: 'you' });
  chains.splice(ci + 1, 0, { start: { ...tee }, steps: [{ to: { kind: 'none' }, by: 'pipe', dir: 'right', source: 'you' }] });
  return tee;
}
// Left or Right needs a fitting (OakBarn Brewery, 2026-11-08: "Right or left add an elbow or Tee, need user input as to type"):
// an Elbow (fit = elbow, the usual) turns the pipe; a Tee puts a real Tee in the line there: the pipe runs left or right into the
// Tee, the Tee goes on down to the next piece, and its third opening starts a branch (its own chain). Back to Elbow takes the Tee
// out again, unless its branch is joined to something (then the answer is why not).
export function setFit(chains, ci, si, fit) {
  const c = chains[ci], s = c?.steps[si]; if (!s) return '';
  if (fit === 'tee' && s.to?.kind !== 'tee') {
    const old = s.to; addTee(chains, ci, si - 1 < 0 ? -1 : si - 1);
    const t = c.steps[si]; t.by = 'pipe'; if (s.dir) t.dir = s.dir; t.fit = 'tee';
    const next = c.steps[si + 1]; next.to = old; delete next.dir; next.by = s.by === 'hose' ? 'hose' : 'pipe'; next.source = s.source; delete next.fit;
    return '';
  }
  if (fit === 'elbow' && s.to?.kind === 'tee') {
    const n = s.to.n || 1, bi = chains.findIndex(x => x.start?.kind === 'tee' && (x.start.n || 1) === n);
    if (bi >= 0 && chains[bi].steps.some(t => t.to?.kind !== 'none')) return `Tee ${n} has a branch joined to something: remove the branch first.`;
    if (bi >= 0) chains.splice(bi, 1);
    const next = c.steps[si + 1];
    if (next) { c.steps.splice(si, 2, { ...next, dir: s.dir, by: 'pipe', fit: 'elbow' }); if (!s.dir) delete c.steps[si].dir; }
    else { c.steps[si] = { to: { kind: 'none' }, by: 'pipe', dir: s.dir, fit: 'elbow', source: 'you' }; }
    return '';
  }
  s.fit = fit === 'tee' ? 'tee' : 'elbow';
  return '';
}
// The vessel a chain belongs to, for the list one vessel at a time (OakBarn Brewery, 2026-11-08): the vessel it starts at; a branch
// from a tee belongs where its tee is; otherwise the first vessel it reaches; '' when none (the Other chains).
export function chainVessel(chains, ci, hot = null, seen = new Set()) {
  const c = chains[ci]; if (!c || seen.has(ci)) return ''; seen.add(ci);
  const ok = e => e?.kind === 'vessel' && (!hot || hot.includes(e.key));
  if (ok(c.start)) return c.start.key;
  if (c.start?.kind === 'tee') {
    const pi = chains.findIndex((x, i) => i !== ci && x.steps.some(t => t.to?.kind === 'tee' && (t.to.n || 1) === (c.start.n || 1)));
    if (pi >= 0) return chainVessel(chains, pi, hot, seen);
  }
  return c.steps.map(t => t.to).find(ok)?.key ?? '';
}
// remove one link (Fritz, 2026-11-08: a picked line and the Delete key); a link in the middle splits its chain in two
export function removeLink(chains, ci, si) {
  const c = chains[ci]; if (!c?.steps[si]) return;
  const before = c.steps.slice(0, si), after = c.steps.slice(si + 1), rest = after.length ? [{ start: c.steps[si].to, steps: after }] : [];
  chains.splice(ci, 1, ...(before.length ? [{ ...c, steps: before }] : []), ...rest);
}
export function addLink(chains, l) {
  const step = { to: l.to, by: l.by || guessBy(l.from, l.to), source: l.source || 'you' };
  const c = chains.find(x => { const last = x.steps.at(-1)?.to ?? x.start; return !isFinal(last) && sameItem(last, l.from); });
  if (c) c.steps.push(step);
  else chains.push({ start: l.from, steps: [step] });
  for (let again = true; again;) {
    again = false;
    for (const a of chains) {
      const last = a.steps.at(-1)?.to; if (!last || isFinal(last)) continue;
      const b = chains.find(x => x !== a && sameItem(x.start, last));
      if (b) { a.steps.push(...b.steps); chains.splice(chains.indexOf(b), 1); again = true; break; }
    }
  }
  return chains;
}
// is this pump or valve already in a chain or a Fermenter answer?
export function usedIds(chains, fermenters = []) {
  return new Set([...fermenters.flatMap(f => [f.feed, f.ret, f.coolPump, f.warmPump]).filter(Boolean),
    ...chains.flatMap(c => [c.start, ...c.steps.map(s => s.to)]).filter(e => e?.kind === 'pump' || e?.kind === 'valve').map(e => e.id)]);
}
// The pumps and valves no chain or Fermenter answer uses yet (each gets its own chain at the end, Fritz's plan)
export function looseItems(parts, chains, fermenters = []) {
  const used = usedIds(chains, fermenters);
  return [...parts.valves, ...parts.pumps].filter(i => !used.has(i.id));
}

// ---- Ask a free AI, outside the Importer (Fritz, 2026-11-07). The Importer stays AI-free: it only writes the question and reads
// the answer back with plain text matching.
export const AI_SITES = [['https://claude.ai/new', 'Claude'], ['https://chatgpt.com/', 'ChatGPT'], ['https://gemini.google.com/app', 'Gemini']];
// every name the AI may use, each with the end it stands for
export function endNames(parts) {
  const out = [];
  for (const v of parts.vessels.filter(x => x.side === 'hot')) for (const [k, n] of OPENINGS) out.push([`${v.name} ${n}`, { kind: 'vessel', key: v.key, at: k }]);
  for (const p of parts.pumps) for (const side of ['in', 'out']) out.push([`${p.label} ${side === 'in' ? 'In' : 'Out'}`, { kind: 'pump', id: p.id, side }]);
  for (const v of parts.valves) out.push([v.label, { kind: 'valve', id: v.id }]);
  out.push(['Tap Water', { kind: 'tap' }], ['Drain', { kind: 'drain' }], ['QD', { kind: 'qd', sex: 'male', shut: false, n: 1 }], ['Not connected', { kind: 'none' }]);
  return out;
}
export function aiQuestion(parts) {
  const names = endNames(parts).map(([n]) => n);
  return [
    'This is a picture of my home brewery (the Hot Side: the HLT, Mash Tun, Boil Kettle and so on). Please look at how the pipes and hoses join the vessels, valves and pumps.',
    '',
    'Answer ONLY in this form, one line for each connection, and nothing else:',
    'Hot side vessels: <how many>',
    'From <name> To <name> by <Pipe or Hose>',
    '',
    'Use only these names, exactly as written:',
    ...names.map(n => `- ${n}`),
    '',
    'For example:',
    `From ${parts.vessels[0] ? `${parts.vessels[0].name} Center Bottom Outlet` : 'Mash Tun Center Bottom Outlet'} To ${parts.valves[0]?.label ?? 'V1'} by Pipe`,
  ].join('\n');
}
const norm = s => String(s ?? '').toLowerCase().replace(/[_\s]+/g, ' ').replace(/[^\w #.+-]/g, '').trim();
// Read the AI's answer back: { vessels (the count, or null), links, unread (lines that could not be read; never guessed) }
export function readAiAnswer(text, parts) {
  const names = new Map(endNames(parts).map(([n, e]) => [norm(n), e]));
  const out = { vessels: null, links: [], unread: [] };
  for (const raw of String(text ?? '').split(/\r?\n/)) {
    const line = raw.replace(/^[\s>*\-•\d.)]+/, '').replace(/\*\*/g, '').trim();
    if (!line) continue;
    const m = /^hot side vessels\s*[:=]\s*(\d+)/i.exec(line);
    if (m) { out.vessels = Number(m[1]); continue; }
    const k = /^from\s+(.+?)\s+to\s+(.+?)(?:\s+(?:by|with|using)\s+(pipe|hose|tubing|tube))?\.?$/i.exec(line);
    const from = k && names.get(norm(k[1])), to = k && names.get(norm(k[2]));
    if (!from || !to) { if (k || /\bto\b/i.test(line)) out.unread.push(raw.trim()); continue; }
    out.links.push({ from, to, by: /hose|tub/i.test(k[3] ?? '') ? 'hose' : 'pipe', source: 'ai' });
  }
  return out;
}

// ---- Build each vessel into a Vessel Device (OakBarn Brewery, 2026-11-08: "Start with a dialog to build the imported vessels into a
// Vessel Device ... which template matches your vessel the best and have all our sample vessel formats"). The first guess comes
// from the vessel's name and side; the brewer picks the template that looks most like the real one. templates: [{ id, vtype }]
export function guessVesselTemplate(v, templates = []) {
  const has = id => templates.some(t => t.id === id) ? id : '';
  const n = `${v?.key ?? ''} ${v?.name ?? ''}`;
  if (v?.side === 'cold' || /ferm|fv\b|conical|unitank/i.test(n)) return has('Fermenter');
  if (/\bhlt\b|hot liquor/i.test(n)) return has('HLT');
  if (/mash|\bmlt\b|\bmt\b/i.test(n)) return has('Mash_Tun');
  if (/boil|kettle|\bbk\b/i.test(n)) return has('Brew_Kettle');
  if (/brewzilla|robobrew/i.test(n)) return has('Kettle_Brewzilla_Electric');
  if (/grainfather/i.test(n)) return has('Kettle_Grainfather_Electric');
  if (/foundry/i.test(n)) return has('Kettle_Foundry_Electric');
  if (/digiboil/i.test(n)) return has('Kettle_DigiBoil_Electric');
  return has('Generic_Brew_Vessel_Widget') || templates[0]?.id || '';
}

// ---- what is saved in the Schema file: the chains as they are, plus each link with the names spelled out
export function connectReport(state) {
  const { parts, chains = [], fermenters = [] } = state;
  return {
    vessels: parts.vessels,
    chains,
    links: allLinks(chains).map(l => ({ ...l, fromText: endText(l.from, parts), toText: endText(l.to, parts) })),
    fermenters,
    loose: looseItems(parts, chains, fermenters).map(i => i.id),
    places: state.places ?? {},
  };
}

// ---- The picture screen's tidy start (OakBarn Brewery, 2026-11-08): "When first starting create twice as many columns as there are
// vessels. Move the left most [vessel] to the leftmost Column, then the Right most to the last column. Place other vessel in Between.
// Have a Set Button and move Left Most 1 Column right and Right one Column left. Space others trying to leave a column between all
// vessels." Things joined by a Pipe stack down the same column, with room to grab a pipe between them; a Hose step moves one column
// over. Pieces joined to nothing go in rows at the bottom. pieces: [{ key, kind, end }] with the vessels in left-to-right order.
// Returns { [key]: { x, y } } as parts of the picture's width and height (0 to 1).
// the key of a piece on the picture: a vessel, a pump, a valve or a tee
export const pieceKey = e => e?.kind === 'vessel' ? 'vessel:' + e.key : e?.kind === 'tee' ? 'tee:' + (e.n || 1) : e?.id;
export function layoutPieces(pieces, chains = [], { set = false } = {}) {
  const vessels = pieces.filter(p => p.kind === 'vessel'), n = vessels.length, cols = Math.max(2, 2 * n);
  const colX = c => (Math.max(0, Math.min(cols - 1, c)) + 0.5) / cols;
  const out = {}, colOf = {}, rowOf = {}, ROW = 0.12, TOP = 0.1;
  const first = set ? 1 : 0, last = set ? cols - 2 : cols - 1;
  vessels.forEach((v, i) => { const c = n === 1 ? first : first + i * (last - first) / (n - 1); colOf[v.key] = c; rowOf[v.key] = 0; });
  const keyOf = pieceKey;
  const known = new Set(pieces.map(p => p.key));
  const used = new Map();                       // "col|row" taken
  const take = (c, r) => { while (used.has(`${Math.round(c * 2)}|${r}`)) r++; used.set(`${Math.round(c * 2)}|${r}`, true); return r; };
  for (const v of vessels) take(colOf[v.key], 0);
  // walk each chain from the first piece that has a place; pieces before it are put above it, after it below it
  for (let pass = 0; pass < 4; pass++) {
    for (const c of chains) {
      const ends = [c.start, ...c.steps.map(s => s.to)], by = [null, ...c.steps.map(joinOf)];
      let a = ends.findIndex(e => keyOf(e) in colOf);
      if (a < 0) continue;
      for (let i = a + 1; i < ends.length; i++) {
        const k = keyOf(ends[i]), pk = keyOf(ends[i - 1]); if (!known.has(k) || k in colOf || !(pk in colOf)) continue;
        // Left and Right: beside it on the same row; a Pipe down: under it; a Hose: one column over, under it
        const side = by[i] === 'left' ? -1 : by[i] === 'right' ? 1 : 0;
        if (side) { const c0 = Math.max(0, Math.min(cols - 1, colOf[pk] + side)); colOf[k] = c0; rowOf[k] = take(c0, rowOf[pk]); continue; }
        const c0 = colOf[pk] + (by[i] === 'hose' ? (colOf[pk] + 1 < cols ? 1 : -1) : 0);
        colOf[k] = c0; rowOf[k] = take(c0, rowOf[pk] + 1);
      }
      for (let i = a - 1; i >= 0; i--) {
        const k = keyOf(ends[i]), nk = keyOf(ends[i + 1]); if (!known.has(k) || k in colOf || !(nk in colOf)) continue;
        const side = by[i + 1] === 'left' ? 1 : by[i + 1] === 'right' ? -1 : 0;
        if (side) { const c0 = Math.max(0, Math.min(cols - 1, colOf[nk] + side)); colOf[k] = c0; rowOf[k] = take(c0, Math.max(1, rowOf[nk])); continue; }
        const c0 = colOf[nk] + (by[i + 1] === 'hose' ? (colOf[nk] + 1 < cols ? 1 : -1) : 0);
        colOf[k] = c0; rowOf[k] = take(c0, Math.max(1, rowOf[nk] + 1));
      }
    }
  }
  const maxRow = Math.max(0, ...Object.values(rowOf));
  const loose = pieces.filter(p => !(p.key in colOf)), perRow = Math.max(4, cols * 2), looseRows = Math.ceil(loose.length / perRow);
  const room = 0.95 - TOP - looseRows * 0.08, step = Math.min(ROW, maxRow ? room / maxRow : ROW);
  for (const k of Object.keys(colOf)) out[k] = { x: colX(colOf[k]), y: TOP + rowOf[k] * step };
  loose.forEach((p, i) => { out[p.key] = { x: ((i % perRow) + 0.5) / perRow, y: 0.95 - (looseRows - 1 - Math.floor(i / perRow)) * 0.08 }; });
  return out;
}

// A Pipe runs only across, up and down, or at 45 degrees (OakBarn Brewery, 2026-11-08): straight, then 45 degrees, then straight.
// Points in pixels; returns an SVG path.
export function pipePath(p, q) {
  const dx = q.x - p.x, dy = q.y - p.y, ax = Math.abs(dx), ay = Math.abs(dy), sx = Math.sign(dx), sy = Math.sign(dy);
  const f = n => n.toFixed(1);
  if (ay >= ax) { const s = (ay - ax) / 2; return `M${f(p.x)} ${f(p.y)} V${f(p.y + sy * s)} L${f(q.x)} ${f(p.y + sy * (s + ax))} V${f(q.y)}`; }
  const s = (ax - ay) / 2; return `M${f(p.x)} ${f(p.y)} H${f(p.x + sx * s)} L${f(p.x + sx * (s + ay))} ${f(q.y)} H${f(q.x)}`;
}
// A Hose hangs in a soft curve, like a hose
export function hosePath(p, q) {
  const d = Math.hypot(q.x - p.x, q.y - p.y), sag = Math.min(120, d * 0.35), f = n => n.toFixed(1);
  return `M${f(p.x)} ${f(p.y)} C${f(p.x)} ${f(p.y + sag)} ${f(q.x)} ${f(q.y + sag)} ${f(q.x)} ${f(q.y)}`;
}
