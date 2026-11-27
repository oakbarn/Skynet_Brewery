// Interface IDs, Tab IDs and suggested Device names. Used by the browser (app.js) and the server (lib/store.js).
//
// Interface ID and Tab ID (Rule 3.2, OakBarn Brewery, 2026-11-15): 1 to 4 characters (A to Z and 0 to 9, starting with a letter), unique,
//   always a unique suggestion on a new one, and once saved NEVER changed, not even by an Admin (lockedIdError). A new Interface gets the
//   first letter of its first two words ("Main Brewery Mega USB" = MB), or MB2, MB3 ... when MB is taken. A new Tab: "Sparge" = SP.
// Device name (Fritz, 2026-10-23; single _ 2026-11-05; General Type@ 2026-11-11): InterfaceID_Port_GeneralType@TypeID_ParsedLabel_TabID,
//   e.g. MB_25_DO@Valve_E_Fly~Sparge~In_SP from the Label "Fly/Sparge In". The Label itself is left as typed; only the name uses the parsed Label.
import { boardOf, linkOf } from './links.js';
import { BOARD_INFO, analogPins, analogLabel } from './boards.js';
import { TYPE_METHOD } from './heatmethod.js';
import { plainLetters } from './letters.js';

// Device Type IDs (Fritz, 2026-10-23). Every ID means one thing; an ID can sit in more than one list. A Heating Element is H_Element
// (Fritz, 2026-11-07: "they are added from a DDLB so we know it is a Heating Element. So we could Use MB_25_HE_HLT_BR"). Fritz's own IDs are kept as he wrote them; the ones added for him are 6 characters or fewer.
const T = {
  // temperature
  '1W': 'DS18B20 (OneWire probe)', RTD: 'RTD: PT100 / PT1000 (MAX31865 board)', TC: 'Thermocouple (MAX31855 / MAX31856 board)',
  '10KNTC': '10K NTC thermistor (BCS-462 type)', '5KNTC': '5K NTC thermistor', '50KNTC': '50K NTC thermistor',
  '100KNT': '100K NTC thermistor (3D printer type)', NTC: 'NTC thermistor, other size', LM35: 'LM35 analog temperature sensor',
  TMP36: 'TMP36 analog temperature sensor',
  // heating
  PID: 'PID', DutyCy: 'Duty Cycle', Hys: 'Hysteresis', DBand: 'Deadband', DO: 'Direct On / Off (relay, SSR, contactor)',
  H_Element: 'Heating Element (on a relay, SSR or contactor; its heating method is picked by a click or a Process)',
  H_PWM: 'Heating PWM (element on a PWM output)', H_AO: 'Heating element on a 0-10 V power controller (SCR / SSVR)',
  // direct on / off
  Pump: 'Pump', CPMP: 'Cool / Warm Pump (one pump that a temperature switches; its method is picked: On/Off or Hysteresis)', M_L_Vlv: 'Low Temperature Manual Valve', Valve_E: 'Electric Valve (motorized ball or butterfly valve, open / closed)', M_H_Vlv: 'High Temperature Manual Valve',
  Valve_E_H: 'High Temperature Electric Valve', Valve_Sgas: 'Solenoid Gas Valve', Mtr: 'Motor', LED: 'LED', Light: 'Light', E_Alm: 'Electric Alarm',
  Fan: 'Fan', Chill: 'Chiller / glycol / fridge compressor', HtPad: 'Fermenter heat wrap or pad', Ignit: 'Burner igniter',
  // direct input
  DI: 'Direct Input (plain)', Float: 'Float (true while made)', DIN: 'DIN momentary push button (one trigger per press, 3 s lockout)',
  PB: 'Push button (ON only while held)', Toggle: 'Toggle button (press ON, press again OFF)', Latch: 'Latching input (ON until reset)',
  FlowSw: 'Flow switch', Intlk: 'Door / lid / safety interlock', EStop: 'Emergency stop', Leak: 'Leak sensor', Count: 'Pulse counter',
  // PWM and analog outputs
  PWM: 'PWM (plain)', Valve_L: 'Low Temperature Proportional Valve', Valve_H: 'High Temperature Proportional Valve',
  P_Pump: 'Pump speed', P_Fan: 'Fan speed', P_Mtr: 'Motor speed', P_LED: 'LED / light dimmer', AO: 'Analog output 0-10 V / 4-20 mA (plain)',
  // analog inputs and the rest
  AI: 'Analog input (plain)', Pres: 'Pressure', Level: 'Level', Vol: 'Volume', PH_Met: 'pH meter', FlowM: 'Flow meter', Scale: 'Scale (load cells)',
  Step: 'Stepper motor',
  // the Hydrometer Device (OakBarn Brewery, 2026-11-09, Rule 6.25): a Tilt or any other hydrometer, on a virtual port 200, 201 ...
  Hydro: 'Hydrometer (Tilt, Tilt Pro, iSpindel, RAPT Pill or any other)',
};
// IDs kept for Devices Skynet can't read yet, so nothing else takes them: DHT11 and DHT22 need firmware first.
// (Hydro was kept here from 2026-10-23 until the Hydrometer Device was built, Rule 6.25.)
export const RESERVED_TYPE_IDS = { DHT11: 'DHT11 temperature / humidity', DHT22: 'DHT22 temperature / humidity' };
export const TYPE_NAMES = { ...T, ...RESERVED_TYPE_IDS };
// own: a description that is this General Type's own (a Pump on a PWM port is a Pump speed)
const list = (ids, own = {}) => ids.split(' ').map(id => [id, own[id] ?? T[id]]);
// The General Type in front says what kind of port it is (OakBarn Brewery, 2026-11-11: "PWM@Pump"), so a Pump, Fan, Motor, LED or
// Heating Element on a PWM or 0-10 V port has the same Type ID as on an On/Off port: PWM@Pump, AO@Fan, PWM@H_Element (were P_Pump, H_PWM ...).
// A Proportional Valve is Valve_L (low temperature) or Valve_H (high temperature): PWM@Valve_L, AO@Valve_H (were P_L_Vlv, P_H_Vlv).
const PWM_OWN = { H_Element: 'Heating PWM (element on a PWM output)', Pump: 'Pump speed', Fan: 'Fan speed', Mtr: 'Motor speed', LED: 'LED / light dimmer' };
const AO_OWN = { H_Element: 'Heating element on a 0-10 V power controller (SCR / SSVR)', Pump: 'Pump speed', Fan: 'Fan speed', Mtr: 'Motor speed' };
export const TYPE_CODES = {
  temperature: list('1W RTD TC 10KNTC 5KNTC 50KNTC 100KNT NTC LM35 TMP36'),
  digitalOut: list('DO H_Element Pump CPMP M_L_Vlv Valve_E M_H_Vlv Valve_E_H Valve_Sgas Mtr LED Light E_Alm Fan Chill HtPad Ignit'),
  pwmOut: list('PWM H_Element Valve_L Valve_H Pump Fan Mtr LED', PWM_OWN),
  analogOut: list('AO H_Element Valve_L Valve_H Pump Fan Mtr', AO_OWN),
  digitalIn: list('DI Float DIN PB Toggle Latch FlowSw Intlk EStop Leak Count'),
  analogIn: list('AI Pres Level Vol PH_Met'),
  flowMeter: list('FlowM'),
  scale: list('Scale'),
  stepper: list('Step'),
  dutyCycle: list('DutyCy'),
  hysteresis: list('Hys'),
  pid: list('PID'),
  deadband: list('DBand'),
  hydrometer: list('Hydro'),
};
export const isDevice = el => !!el && Object.hasOwn(TYPE_CODES, el.type);
export const typeCodes = el => TYPE_CODES[el?.type] ?? [];

// The Device Type ID a new Device starts with: from its kind (pump, valve ...), its probe, or the Add menu entry it came from
const BY_HINT = { Float: 'Float', FlowSw: 'FlowSw', PB: 'PB', Toggle: 'Toggle', Pulse: 'DIN', Interlock: 'Intlk', Count: 'Count', Pressure: 'Pres', Level: 'Level', pH: 'PH_Met' };
const NTC_BY_OHM = { 5000: '5KNTC', 10000: '10KNTC', 50000: '50KNTC', 100000: '100KNT' };
function tempCode(el) {
  const s = el.sensor || 'ds18b20';
  if (s === 'ntc') return NTC_BY_OHM[Number(el.r0) || 10000] || 'NTC';
  return { ds18b20: '1W', pt100: 'RTD', pt1000: 'RTD', thermocouple: 'TC', lm35: 'LM35', tmp36: 'TMP36' }[s] || '1W';
}
export function defaultCode(el, hint) {
  const codes = typeCodes(el); if (!codes.length) return '';
  const has = c => codes.some(x => x[0] === c);
  let c = '';
  if (el.type === 'temperature') c = tempCode(el);
  else if (el.type === 'digitalOut') c = { pump: el.heatMethod ? 'CPMP' : 'Pump', valve: el.valveType === 'manual' ? 'M_L_Vlv' : 'Valve_E', element: 'H_Element' }[el.subtype];
  else if (el.type === 'pwmOut' || el.type === 'analogOut') c = { element: 'H_Element', propValve: 'Valve_L', pump: 'Pump' }[el.subtype];
  else if (el.type === 'digitalIn') c = BY_HINT[hint] || { momentary: 'DIN', latch: 'Latch', toggle: 'Toggle', counter: 'Count' }[el.mode];
  else c = BY_HINT[hint];
  return c && has(c) ? c : codes[0][0];
}
// The type codes of PR #61 (PmP, VlV ...) -> the Device Type IDs. A code that no longer fits is worked out again.
// E_L_Vlv -> eVlv (Fritz, 2026-11-05: "_E_L_Vlv_ change to _eVlv_"); names already made keep it (Rule 3.5)
const OLD_CODES = { PmP: 'Pump', VlV: 'Valve_E', E_L_Vlv: 'Valve_E', eVlv: 'Valve_E',      // eVlv -> Valve_E: OakBarn Brewery, 2026-11-11 ("Change ON Off Motorized Valves to DO@Valve_E")
  MtR: 'Mtr', FaN: 'Fan', LgT: 'Light', LeD: 'LED', ElM: 'DO', BrN: 'Valve_Sgas',
  PWM_PmP: 'Pump', PWM_VlV: 'Valve_L', PWM_MtR: 'Mtr', PWM_FaN: 'Fan', PWM_LgT: 'LED', PWM_LeD: 'LED', PWM_ElM: 'H_Element',
  AO_PmP: 'Pump', AO_VlV: 'Valve_L', AO_MtR: 'Mtr', AO_FaN: 'Fan', AO_ElM: 'H_Element',
  // 2026-11-11 (OakBarn Brewery: "PWM@Pump"): the General Type says PWM or 0-10 V, so the P_ and H_ ones are the plain IDs
  P_Pump: 'Pump', P_Fan: 'Fan', P_Mtr: 'Mtr', P_LED: 'LED', H_PWM: 'H_Element', H_AO: 'H_Element',
  // OakBarn Brewery, 2026-11-11: "Valve_E_H and Valve_Sgas" (were E_H_Vlv, G_Vlv)
  E_H_Vlv: 'Valve_E_H', G_Vlv: 'Valve_Sgas',
  // OakBarn Brewery, 2026-11-11: "Heating Element: DO@H_Element" (was HE)
  HE: 'H_Element',
  // OakBarn Brewery, 2026-11-11: "PWM@Valve_L or PWM@Valve_H and AO to follow" (PWM already says the P)
  P_L_Vlv: 'Valve_L', P_H_Vlv: 'Valve_H',
  DiN: 'DIN', FlT: 'Float', FlS: 'FlowSw', BtN: 'PB', SfT: 'Intlk', CnT: 'Count', PrS: 'Pres', LvL: 'Level', VoL: 'Vol', PhM: 'PH_Met',
  FlM: 'FlowM', ScL: 'Scale', StP: 'Step', DtY: 'DutyCy', HyS: 'Hys', PiD: 'PID' };
export function upgradeCode(el) {
  if (!el?.typeCode) return '';
  const codes = typeCodes(el), c = OLD_CODES[el.typeCode] ?? el.typeCode;
  return codes.some(x => x[0] === c) ? c : defaultCode(el);
}

// Label -> the part of a name (Fritz, 2026-10-23): control characters and emoji are dropped, spaces at the ends trimmed,
// < > : " / \ | ? * . , each become ~, and so do spaces (OakBarn Brewery, 2026-11-07: "I like the ~ instead of a _ in the label
// part of the name"): the _ only ever separates the parts of a name
// Emoji as the name rules count them (public/names.js): the colour pictures, flags, skin tones and joiners
const PICTO = /\p{Extended_Pictographic}/u, EMOJI_PART = /[\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u200D\uFE0E\uFE0F\u20E3]/u;
const isEmoji = ch => EMOJI_PART.test(ch) || (PICTO.test(ch) && ch.codePointAt(0) >= 0x2190);
// Every other mark that isn't a letter, number, _, @ or ° becomes ~ too (° is fine in a name: OakBarn Brewery, 2026-11-11), and an accent is dropped (OakBarn Brewery, 2026-11-11: they are
// "No No" in a name): Fly/Sparge-In becomes Fly~Sparge~In, Würze becomes Wurze.
// Marks a Label can't have (OakBarn Brewery, 2026-11-11, Rule 3.4): © ® ™ are kept for copyright and trademark notices ("No Circle C or R
// in Labels", it "interferes with the MIT License"), and @ ~ are kept for the Suggested Name ("reserved for Suggested Name Use Only").
// © ® ™ are taken out and @ ~ become a space: public/labelguard.js does it while typing (and says why), lib/store.js on load.
export const LABEL_NO = /[©®™@~]/;
export const cleanLabel = s => String(s ?? '').replace(/[©®™]/g, '').replace(/[@~]/g, ' ');
// a Label never starts or ends with a space either (OakBarn Brewery, 2026-11-11: "Hunt for Beginning or trailing spaces in a label or
// name and not allow. This is an issue in BruControl I want to remove from Skynet"): trimmed when it is saved and when a Schema loads
export const tidyLabel = s => cleanLabel(s).trim();
// the words in the small box and the Label Hover Help (OakBarn Brewery, 2026-11-11, word for word for © ® ™)
export const COPYRIGHT_MSG = '© ® ™: Reserved for copyright and trademark notices of the Skynet MIT License. Skynet is Open Source. Not Allowed in a name or a Label to avoid confusion with the Skynet MIT License.';
export const SUGGESTED_MSG = '@ ~: Kept for the Suggested Name. Not typed in a name or a Label.';
export const labelNoMsg = s => [/[©®™]/.test(s) ? COPYRIGHT_MSG : '', /[@~]/.test(s) ? SUGGESTED_MSG : ''].filter(Boolean).join(' ');
export const parseLabel = s => [...cleanLabel(s).replace(/\p{Cc}/gu, '')].filter(ch => !isEmoji(ch)).join('').trim()
  .replace(/\S+/g, plainLetters).replace(/\s+/g, '~').replace(/[^A-Za-z0-9_~@°]/g, '~');      // ß ss, æ ae, ø o (public/letters.js)

// Virtual ports, as BruControl numbers them (Fritz, 2026-10-23): a hydrometer (Hydro: a Tilt or any other) has no pin,
// so the 1st one is port 200, the 2nd 201 ... (index from 1). It is the Hydrometer's Port, and in its name (Rule 6.25).
export const HYDRO_PORT_BASE = 200;
export const hydroPort = index => String(HYDRO_PORT_BASE + Math.max(1, Math.trunc(Number(index) || 1)) - 1);
// 1-Wire circuits (OakBarn Brewery, 2026-11-19, Rule 6.37: "A One wire circuit is Board and Pin Related. You could have two different One
// Wire circuits on the same Board"; "an 1 wire Index IP like BM1w1_1 would be for the first 1 wire hooked up to the First created On wire
// using An Interface and Port. The second one on the same circuit would be BM1w1_2. If a Second 1 wire was created on the same board it
// would have probe index as BM1w2_n"). A circuit is an Interface's 1-Wire pin, numbered 1, 2 ... on that Interface (a number is never used
// again); each DS18B20 probe on it has its own Index 1, 2 ... The Index ID is the Interface ID, 1w, the circuit and _ the probe: BM1w1_2.
// oneWirePort is the part after the Interface ID ('1w1_2'); '' when no probe Index is picked yet.
export const oneWirePort = (index, circuit = 1) => Number.isInteger(+index) && +index >= 1 && Number.isInteger(+circuit || 1) && (+circuit || 1) >= 1 ? `1w${+circuit || 1}_${+index}` : '';
export const isOneWirePort = p => /^1w\d+_\d+$/.test(String(p ?? ''));
export const owCircuitOf = el => Math.max(1, Math.trunc(+(el?.owCircuit ?? el?.circuit)) || 1);      // a Device's owCircuit, or a 1-Wire Index slot's circuit
// an Interface's 1-Wire circuits: [{ n, pin, power: 'board' | 'ext', bits: 9-12 }]
export const OW_POWER = [['board', 'Board 5V'], ['ext', 'External supply']];
export const OW_LIMIT = { board: 6, ext: 12 };      // a soft limit: past it, one warning, never a block (OakBarn Brewery, 2026-11-19: "We do not restrict the excess, but give a warning once exceeded")
export const OW_BITS = [12, 11, 10];
export const oneWireCircuits = d => (Array.isArray(d?.oneWire) ? d.oneWire : []).filter(c => c && !c.gone && +c.n >= 1);
// the next circuit number on an Interface: never one used before, even if that circuit was removed (Rule 3.2)
export const nextOneWireCircuit = d => Math.max(0, +d?.oneWireLast || 0, ...(Array.isArray(d?.oneWire) ? d.oneWire : []).map(c => +c?.n || 0)) + 1;

// Fritz, 2026-11-05 (Rule 3.1 changed): "Single Underscores between parts of name": InterfaceID_Port_Type_Label_TabID.
// Names made before keep their double __ before the Tab ID (Rule 3.5).
// The Type part has the Device's General Type in front with an @ (OakBarn Brewery, 2026-11-11: "use @ symbol"): an On/Off Pump,
// is DO@Pump in its name (BM_22_DO@Pump_Pump_BH) and wherever its Device Type is shown. A colon can't be in a name (Rule 3.4), so @ stands for it.
// type: the Device's type (digitalOut ...). With no type the Type part is the Device Type ID alone.
export function suggestName({ iface, port, code, type, label, tab } = {}) {
  // a 1-Wire probe (Rule 6.37): its Index ID, the Label and the Tab: BM1w1_1_HLT_BH (no Port or Type part: the 1w says what it is)
  if (isOneWirePort(port)) return [`${String(iface ?? '').trim()}${port}`, parseLabel(label), tab].map(x => String(x ?? '').trim()).filter(Boolean).join('_');
  return [iface, port, nameType(type, code), parseLabel(label), tab].map(x => String(x ?? '').trim()).filter(Boolean).join('_');
}
// Device General Type (Fritz, 2026-11-04, Rule 18.18): shown at the start of a Device Type, e.g. DO@Pump. The Device keeps its type
// (digitalOut ...) and Device Type ID (Pump) as they are saved.
export const GENERAL_TYPE = { digitalOut: 'DO', pwmOut: 'PWM', analogOut: 'AO', digitalIn: 'DI', analogIn: 'AI', temperature: 'TEMP', flowMeter: 'FLOW', scale: 'SCALE', stepper: 'STEP', dutyCycle: 'DUTY', hysteresis: 'HYS', pid: 'PID', deadband: 'DBAND', hydrometer: 'HYDRO' };
// The Type part of a Device name: General Type @ Device Type ID (DO@Pump). When the two are the same word (PID, HYS ...) it is written once.
export function nameType(type, code) {
  const g = GENERAL_TYPE[type], c = String(code ?? '').trim();
  return !g ? c : !c ? g : c.toUpperCase() === g ? c : `${g}@${c}`;
}
// An older Device name in the Suggested Name form with no General Type yet (BM_22_Pump_Pump_BH) -> with it (BM_22_DO@Pump_Pump_BH);
// '' when it has one, is not in that form, or needs none. Used once per Schema when it loads (Rule 15.2, lib/store.js).
export function typeAtName(el) {
  const name = String(el?.name ?? '');
  if (!isDevice(el) || !name || name.includes('@')) return '';
  // its own Device Type ID first; an older Device with none saved is matched by any ID of its type (BM_30_Chill_Chiller~water_BH)
  // and any older ID that became it (P_Pump -> Pump, eVlv -> Valve_E), so BM_5_P_Pump_Wort_BH is BM_5_PWM@Pump_Wort_BH
  const own = String(el.typeCode || '').trim(), ids = el.typeCode ? [own] : typeCodes(el).map(x => x[0]);
  const codes = [...ids, ...Object.keys(OLD_CODES).filter(o => ids.includes(OLD_CODES[o]))].sort((a, b) => b.length - a.length);
  for (const code of codes) {
    const t = nameType(el.type, OLD_CODES[code] && !ids.includes(code) ? OLD_CODES[code] : code);
    if (!code || t === code) continue;
    const m = new RegExp(`^(.+?_[^_]+)_${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=_|$)`).exec(name);
    if (m) return `${m[1]}_${t}${name.slice(m[0].length)}`;
  }
  return '';
}
// A suggested name that is already used (an old Device, or a Widget) gets _2, _3 ... after the Label: MB_25_DO@Pump_Wort_2_BR.
// tab: the Tab ID at its end, so the number goes before it (an older name's __ before the Tab ID works too).
export function uniqueName(name, isTaken, tab) {
  if (!name || !isTaken(name)) return name;
  const t = String(tab ?? '').trim(), old = name.lastIndexOf('__');
  const cut = old > 0 ? old : t && name.endsWith('_' + t) && name.length > t.length + 1 ? name.length - t.length - 1 : -1;
  const head = cut > 0 ? name.slice(0, cut) : name, tail = cut > 0 ? name.slice(cut) : '';
  let i = 2; while (isTaken(`${head}_${i}${tail}`)) i++;
  return `${head}_${i}${tail}`;
}

const words = name => String(name ?? '').split(/[^A-Za-z]+/).filter(Boolean);
// first letter of the first two words; one word: its first two letters
function initials(name) {
  const w = words(name);
  if (!w.length) return '';
  return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
}
const takenSet = taken => new Set([...(taken ?? [])].filter(Boolean).map(t => String(t).toUpperCase()));

// ---- Interface IDs and Tab IDs (Rule 3.2) ----
// The one pattern for every user-set ID: 1 to 4 characters, A to Z and 0 to 9, starting with a letter.
export const ID_RE = /^[A-Z][A-Z0-9]{0,3}$/;
export const ID_RULE = '1 to 4 letters or numbers (A to Z, 0 to 9), starting with a letter';
const cleanId = (what, ex) => id => {
  const s = String(id ?? '').trim().toUpperCase().replace(/_+$/, '');
  if (!ID_RE.test(s)) throw new Error(`${what} ID "${String(id ?? '').trim()}": use ${ID_RULE}, for example ${ex}`);
  return s;
};
// a unique ID that fits in 4: the base, then base + 2, 3 ... 9, then base + a letter, then any free one
function freeId(base, taken) {
  const t = takenSet(taken), b = String(base || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^[0-9]+/, '').slice(0, 4);
  if (b && !t.has(b)) return b;
  const stem = (b || 'X').slice(0, 3);
  for (let i = 2; i <= 9; i++) if (!t.has(stem + i)) return stem + i;
  for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') if (!t.has(stem + c)) return stem + c;
  for (const a of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') if (!t.has(a + c)) return a + c;
  return '';
}
export const cleanInterfaceId = cleanId('Interface', 'MB');
// An Interface's suggestion (OakBarn Brewery, 2026-11-15, Add Interface markup: "Suggested Unique Id Based on Name. Try 2 Char and then
// 3 and then 4 char if needed to make unique"): from the Name, 2 characters (the first letters of its first two words, or a one-word
// Name's first two), then 3, then 4, each time the next letters of the Name; only if every one is taken, one that fits in 4 (MB2).
export function defaultInterfaceId(name, taken) {
  const t = takenSet(taken), ws = words(name).map(w => w.toUpperCase()), two = initials(name);
  if (!two) return freeId('IF', taken);
  const ok = x => x && ID_RE.test(x) && !t.has(x);
  if (ok(two)) return two;
  // the letters that come after the first two: the second word's own letters, then the words after it (one word: the rest of it)
  const rest = ws.length > 1 ? ws[1].slice(1) + ws.slice(2).join('') : ws[0].slice(2);
  const three = [...(ws.length > 2 ? [ws[0][0] + ws[1][0] + ws[2][0]] : []), ...[...rest].map(c => two + c)];
  for (const x of three) if (ok(x)) return x;
  for (const b of three) { const i = rest.indexOf(b[2]); for (const c of rest.slice(i + 1)) if (ok(b + c)) return b + c; }
  return freeId(two, taken);
}
export const cleanTabId = cleanId('Tab', 'BH');
// a Tab's suggestion: 2 letters when one is free (Sparge = SP, then SA ...), else one that fits in 4
export function defaultTabId(name, taken) {
  const t = takenSet(taken), w = words(name).join('').toUpperCase(), first = initials(name)[0] || 'T';
  const tries = [initials(name), ...[...w.slice(1)].map(c => first + c), ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => first + c)];
  for (const x of tries) if (x.length === 2 && !t.has(x)) return x;
  return freeId(initials(name) || 'T', taken);
}
// Once saved, an ID is never changed, not even by an Admin (Rule 3.2). before / after: the saved list and the one being saved;
// an item is the same item when its hidden key matches (names only when neither has a key). A message, or ''.
export function lockedIdError(before, after, what) {
  const keyOf = x => x?._key || x?._ref || '';
  for (const b of after ?? []) {
    const a = keyOf(b) ? (before ?? []).find(x => x.id && keyOf(x) === keyOf(b)) : (before ?? []).find(x => x.id && !keyOf(x) && x.name === b.name);
    if (a && String(b.id ?? '').toUpperCase() !== String(a.id).toUpperCase())
      return `The ${what} ID ${a.id} of ${a.name} can never be changed, not even by an Admin (Rule 3.2). To use another ID, make a new ${what}.`;
  }
  return '';
}

// Interfaces and tabs without a (good) ID get one (a saved good ID is never touched, Rule 3.2), and old type codes are brought up to date; a second use of the same ID gets a new one. True when something changed.
export function assignIds(c) {
  let changed = false;
  const fill = (list, clean, def) => {
    const used = new Set();
    for (const x of list ?? []) {
      let id = null;
      try { id = x.id ? clean(x.id) : null; } catch { id = null; }
      if (!id || used.has(id)) id = def(x.name, used);
      if (x.id !== id) { x.id = id; changed = true; }
      used.add(id);
    }
  };
  fill(c.devices, cleanInterfaceId, defaultInterfaceId);
  fill(c.workspaces, cleanTabId, defaultTabId);
  for (const e of c.elements ?? []) {
    // A heating element built into a Vessel Device, RIMS tube or kettle that is still an old separate control Device (Hysteresis,
    // PID, Duty Cycle, Deadband, like the Three Vessel sample's HLT_Heat) is one Heating Element (Rule 6.19), starting with that
    // method, so it has the Heating method field and the method spots (Fritz, 2026-11-07: "The only thing that seems to be missing
    // is the Element Method Field and the Hotspots"). Its name, settings and Processes stay (Rule 3.5).
    if (e.integratedIn && ['dutyCycle', 'hysteresis', 'pid', 'deadband'].includes(e.type) && (e.vpKind === 'element' || e.integratedAs === 'heat')) {
      e.heatMethod ??= TYPE_METHOD[e.type]; e.type = 'digitalOut'; e.subtype = 'element'; changed = true;
    }
    // a Heating Element saved sending PWM (before 2026-11-19, when the Port alone decided) is switched by a DAC / 0-10 V (Rule 6.19)
    if (e.type === 'digitalOut' && e.subtype === 'element' && e.pwm === true && !e.switchedBy) { e.switchedBy = 'dac'; changed = true; }
    // Device Type IDs of PR #61 (PmP, VlV ...) -> the 2026-10-23 list (names are not changed)
    const code = upgradeCode(e);
    if (code && code !== e.typeCode) { e.typeCode = code; changed = true; }
  }
  return changed;
}
// The IDs a list has to be saved with: each one checked, none used twice. Missing ones are given.
export function checkIds(list, what) {
  const clean = what === 'tab' ? cleanTabId : cleanInterfaceId, def = what === 'tab' ? defaultTabId : defaultInterfaceId, used = new Set();
  for (const x of list ?? []) {
    if (!x.id) continue;
    x.id = clean(x.id);
    if (used.has(x.id)) throw new Error(`${what === 'tab' ? 'Tab' : 'Interface'} ID ${x.id} is used twice. Each one must be unique.`);
    used.add(x.id);
  }
  for (const x of list ?? []) if (!x.id) { x.id = def(x.name, used); used.add(x.id); }
  return list;
}

// ---- Dual Throw (OakBarn Brewery, 2026-11-09, Rule 6.22, as BruControl's Dual Throw output) ----
// A Digital Out can drive a second Port on the same Interface as its opposite: ON = its own Port on and the second Port off, OFF = its
// own Port off and the second Port on. For a valve with an Open wire and a Close wire, or a motor that turns forward and backward.
// The Dual Throw delay (ms) is how long both Ports stay off before the other one turns on, so the two are never on together.
export const hasDualThrow = el => el?.type === 'digitalOut' && el.subtype !== 'element' && el.dualThrowChannel !== undefined && el.dualThrowChannel !== null && String(el.dualThrowChannel).trim() !== '';
export const dualThrowDelay = el => Math.max(0, Math.round(Number(el?.dualThrowDelay) || 0));
export const samePin = (a, b) => pinKey(a) !== '' && pinKey(a) === pinKey(b);

// ---- one Device per Interface port ----
// Every board pin a Device uses, as "Interface|pin" (A5 and 59 are the same Mega pin). DS18B20 probes share one wire, so they use
// their probe number instead (virtual port 700 + number - 1), on any Interface: one Device per probe.
const pinKey = p => {
  const s = String(p ?? '').trim().toUpperCase(); if (!s) return '';
  let m = /^A(\d{1,2})$/.exec(s); if (m && +m[1] <= 15) return String(54 + +m[1]);
  m = /^(?:GPIO|BCM)(\d+)$/.exec(s); if (m) return String(+m[1]);      // Raspberry Pi: GPIO17 = 17
  m = /^D?(\d+)$/.exec(s); return m ? String(+m[1]) : s;
};
export function portKeys(el) {
  if (!isDevice(el)) return [];
  if (!el.device && !(el.type === 'temperature' && (!el.sensor || el.sensor === 'ds18b20'))) return [];
  if (el.type === 'temperature' && (!el.sensor || el.sensor === 'ds18b20')) return el.probeIndex ? [`${el.device ?? ''}|${oneWirePort(el.probeIndex, owCircuitOf(el)) || el.probeIndex}`] : [];      // one Device per 1-Wire Index (Rule 6.37)
  if (el.type === 'analogIn' && el.adc === 'ads1115') return el.channel === undefined || el.channel === '' ? [] : [`${el.device}|ADS${el.channel}`];
  const pins = el.type === 'scale' ? String(el.channel ?? '').split(',') : el.type === 'stepper' ? [el.channel, el.dirPin, el.enablePin, el.pin2, el.pin3, el.pin4, el.homePin]
    : hasDualThrow(el) ? [el.channel, el.dualThrowChannel] : [el.channel];      // Dual Throw (Rule 6.22): its second Port is taken too
  return [...new Set(pins.map(pinKey).filter(Boolean))].map(p => `${el.device}|${p}`);
}
// One Interface Port, one Device (Fritz, 2026-11-07, Rule 6.1: "a Limit of One Interface Port to one Device. Another Major
// difference from BruControl"). A heater's ways of control are one Heating Element's methods (Rule 6.19), not more Devices.
// Older Schemas made before that may still have outputs of different Device Types on one port (Fritz, 2026-10-23, e.g.
// MB_05_Hys_HLT__BR and MB_05_PID_HLT__BR): they keep working (the one turned on last wins, lib/store.js), but a NEW Device
// (named '\0new' while it is being picked) never shares a port, so the Available Ports lists never offer a used port.
export const SHARED_PORT_TYPES = ['digitalOut', 'pwmOut', 'analogOut', 'dutyCycle', 'hysteresis', 'pid', 'deadband'];
const NEW = '\0new';
const mayShare = (a, b) => instanceFamily(a, b) || (a.name !== NEW && b.name !== NEW && SHARED_PORT_TYPES.includes(a.type) && SHARED_PORT_TYPES.includes(b.type) && (a.typeCode || a.type) !== (b.typeCode || b.type));
// Integrated Instances (OakBarn Brewery, 2026-11-09: "It is not a Clone but an Instance ... An Integrated Device Inherits its Properties
// and then becomes independent"; "change the Rule to allow an Integrated Instance", Rule 6.1 exception): a Heating Element built into a
// Vessel Device from one already on a Tab is a copy of it with its own On / Off, methods and settings, on the same Interface Port
// (instanceOf names the Device it came from; its Port can't be changed). Two Heating Elements may share a Port when either is an Instance.
const heaterEl = e => e?.type === 'digitalOut' && e.subtype === 'element';
export const isInstance = e => heaterEl(e) && !!e.instanceOf;
export const instanceFamily = (a, b) => heaterEl(a) && heaterEl(b) && (!!a.instanceOf || !!b.instanceOf);
// Devices that share a port with this one (other names)
export function portSharers(el, elements) {
  const mine = new Set(portKeys(el)); if (!mine.size) return [];
  return (elements ?? []).filter(o => o !== el && o.name !== el.name && portKeys(o).some(k => mine.has(k)));
}
// Fritz, 2026-10-23: bus pins. All RTD (MAX31865) and thermocouple boards on an Interface share the SPI pins 50, 51, 52
// (each board has its own chip-select pin), and all DS18B20 probes share one OneWire data pin (D40 in the Skynet sketch).
// While a bus is in use those pins are blocked for anything else; using one for something else first gets a heads-up.
export const SPI_PINS = ['50', '51', '52'];
export const ONEWIRE_PIN = '40';
// Fritz, 2026-10-27 (Skynet Rule 6.9): on an Arduino Mega an RTD (MAX31865 board, PT100 / PT1000) may only have its chip-select
// (CS) pin on D14-D17, D22-D39, D41-D43, D47-D49 or D53: no PWM, counter, SPI (50-52), OneWire (40) or Ethernet shield (4, 10) pins.
export const RTD_CS_PINS = ['14', '15', '16', '17', ...Array.from({ length: 18 }, (_, i) => String(22 + i)), '41', '42', '43', '47', '48', '49', '53'];
export const RTD_CS_TEXT = 'D14-D17, D22-D39, D41-D43, D47-D49 or D53';
export const isRtd = e => e?.type === 'temperature' && ['pt100', 'pt1000'].includes(e.sensor);
const onMega = (el, devices) => boardOf((devices ?? []).find(d => d.name === el.device)) === 'mega';
// A plain message when an RTD on a Mega has a CS pin outside RTD_CS_PINS, or null
export function rtdPinError(el, devices) {
  if (!isRtd(el) || !el.device || !onMega(el, devices)) return null;
  const cs = pinKey(el.channel); if (!cs) return null;
  return RTD_CS_PINS.includes(cs) ? null : `${el.name && el.name !== '\0new' ? el.name + ': p' : 'P'}in ${/^\d+$/.test(cs) ? 'D' + cs : cs} can't be the chip-select (CS) pin of an RTD board on an Arduino Mega. Use ${RTD_CS_TEXT} (Skynet Rule 6.9).`;
}
// Fritz, 2026-10-27 (Skynet Rule 6.10): the Ethernet shield on a Mega uses pin D10. A Device on an Ethernet Mega can't use D10, and a
// Mega Interface can't be changed to Ethernet while a Device is on D10: that Device and its wiring move to another free pin first.
export const ETHERNET_PIN = '10';
export const SD_PIN = '4';
export const SD_WARNING = 'Pin D4 is the SD card pin of the Ethernet shield. SD Card Not Supported. Never insert an SD Card! (Skynet Rule 6.11)';
// the boards that take an Ethernet shield with an SD card slot (a board with its own Ethernet module words, eth, has no SD card)
const sdBoard = P => !!P.shield && !P.eth;
// Nano ESP32: A4-A7 are on the chip's second ADC, which can't read while WiFi is on (OakBarn Brewery, 2026-11-19: yes, one warning)
export const ADC2_WARNING = '{0} on a Nano ESP32 can\'t read while its WiFi is on (the chip\'s second ADC is shared with WiFi). On WiFi, use A0-A3 for analog sensors, or connect this board by USB.';
// Leonardo, Micro: the D pin an analog Port is (A6 = D4), else the pin itself
const onPinOf = (p, P) => { const n = +p - 54; return /^\d+$/.test(p) && n >= 0 && P.aOn?.['A' + n] ? P.aOn['A' + n] : p; };
// Every board on an Ethernet shield or module uses D10 for it (2026-11-19, Rule 6.35: Rule 6.10 on every such board, not only the Mega)
// OakBarn Brewery, 2026-11-19: "On a Mega, we want to reserve pin 10 on USB Connection until it is the last one available and if picked
// Give warning about Ethernet no longer Available as an Option because of PIN 10 being used. The reservation is not a fixed thing but a
// warning to the User"; then "It can be in order but can it be a Different color on the DDLB?" (Rule 6.10): a Mega not on Ethernet keeps D10
// in its place in the Port list, in another color with "Reserved for Ethernet: see Help" beside it, and picking it gives one warning.
export const ETHERNET_PIN_WARNING = 'Pin D10 is the pin an Ethernet shield needs. While a Device uses D10, this Mega can\'t be changed to Ethernet (Skynet Rule 6.10). Pick another pin to keep Ethernet as a choice.';
export const pinKept = (p, d) => String(p) === ETHERNET_PIN && usbMega(d);
export const KEPT_FOR_ETHERNET = 'Reserved for Ethernet: see Help';      // OakBarn Brewery, 2026-11-19: "Only pin 10 gets ethernet warning and Reserved for Ethernet: see Help"
const usbMega = d => !!d && boardOf(d) === 'mega' && linkOf(d) !== 'ethernet';
const ethernetMega = d => !!d && !!BOARD_INFO[boardOf(d)]?.shield && linkOf(d) === 'ethernet';
// A plain message when Interface d is (or is being changed to) an Ethernet Mega and a Device on it uses pin 10, or null
export function ethernetPinError(d, elements) {
  if (!ethernetMega(d)) return null;
  const on10 = (elements ?? []).filter(e => e.device === d.name && pinsOn(e).includes(ETHERNET_PIN)).map(e => e.name);
  return on10.length ? `${d.name} can't be on Ethernet while pin D10 is in use: the Ethernet shield needs pin 10. Move ${on10.join(', ')} (and the wiring) to another free pin first, then change ${d.name} to Ethernet (Skynet Rule 6.10).` : null;
}
const usesSpi = e => e.type === 'temperature' && ['pt100', 'pt1000', 'thermocouple'].includes(e.sensor);
const isProbe = e => e.type === 'temperature' && (!e.sensor || e.sensor === 'ds18b20');
// the data pins of an Interface's 1-Wire circuits (Rule 6.37): its circuits' pins, or the board's usual 1-Wire pin when it has none yet
export const oneWirePins = (d, P) => { const l = oneWireCircuits(d).map(c => String(c.pin)); return l.length ? l : [String(d?.oneWirePin ?? P?.onewire ?? ONEWIRE_PIN)]; };
// the data pin of a probe's own circuit
export const owPinOf = (el, d, P) => String(oneWireCircuits(d).find(c => +c.n === owCircuitOf(el))?.pin ?? d?.oneWirePin ?? P?.onewire ?? ONEWIRE_PIN);
const pinsOn = e => portKeys(e).filter(k => !isOneWirePort(k.split('|')[1])).map(k => k.split('|')[1]);
// { error } when this Device takes a pin a bus on its Interface needs, { warn } when it takes a free bus pin, or null
export function busCheck(el, elements, devices) {
  const others = (elements ?? []).filter(o => o !== el && o.name !== el.name);
  const P = profileOf(el, devices), SPI_PINS = P.spi, bus = SPI_PINS.join(', ');
  const dv = (devices ?? []).find(d => d.name === el.device), owPins = oneWirePins(dv, P), owPin = isProbe(el) ? owPinOf(el, dv, P) : owPins[0];
  const mine = el.device ? pinsOn(el) : [], iface = el.device;
  if (P.board === 'pi' && el.device) {
    const bad = piDeviceError(el, mine); if (bad) return { error: bad };
  }
  if (P.board !== 'pi' && P.board !== 'mega' && el.device) {
    const bad = boardDeviceError(el, mine, P); if (bad) return { error: bad };
  }
  if (mine.includes(ETHERNET_PIN) && ethernetMega((devices ?? []).find(d => d.name === iface))) return { error: `Pin D10 on ${iface} is used by its Ethernet shield. Pick another pin (Skynet Rule 6.10).` };
  if (P.aOn && iface) {      // Leonardo, Micro: A6-A11 are D4, D6, D8, D9, D10, D12, one pin under two names
    const phys = new Set(mine.map(p => onPinOf(p, P)));
    const o = others.find(o => o.device === iface && pinsOn(o).some(p => phys.has(onPinOf(p, P)) && !mine.includes(p)));
    if (o) return { error: `${o.name} already uses this pin on ${iface} under its other name (A6-A11 are the pins D4, D6, D8, D9, D10, D12). Pick another pin.` };
  }
  const spiUsers = others.filter(o => usesSpi(o) && o.device === iface), owUsers = others.filter(o => isProbe(o) && (!o.device || o.device === iface));
  const onPin = pins => others.find(o => o.device === iface && !usesSpi(o) && pinsOn(o).some(p => pins.includes(p)));
  if (usesSpi(el)) {
    const rtd = rtdPinError(el, devices); if (rtd) return { error: rtd };
    const cs = mine.find(p => SPI_PINS.includes(p));
    if (cs) return { error: `Pin ${cs} is part of the SPI bus (${bus}) that every RTD and thermocouple board uses. Pick another pin for the board's chip-select (CS).` };
    const o = onPin(SPI_PINS);
    if (o) return { error: `RTD and thermocouple boards need pins ${bus} on ${iface}, but ${o.name} uses pin ${pinsOn(o).find(p => SPI_PINS.includes(p))}. Move ${o.name} to another pin first.` };
  } else if (isProbe(el)) {
    const o = others.find(o => (!el.device || o.device === el.device) && pinsOn(o).includes(owPin));
    if (o) return { error: `DS18B20 probes need pin ${owPin} (the OneWire data pin) on ${o.device}, but ${o.name} uses it. Move ${o.name} to another pin first.` };
  } else {
    const spi = mine.find(p => SPI_PINS.includes(p));
    if (spi && spiUsers.length) return { error: `Pin ${spi} on ${iface} is blocked: pins ${bus} carry the RTD and thermocouple boards (${spiUsers.map(o => o.name).join(', ')}).` };
    const owHit = owPins.find(q => mine.includes(q) && owUsers.some(o => owPinOf(o, dv, P) === q));
    if (owHit) return { error: `Pin ${owHit} on ${iface} is blocked: it is a 1-Wire circuit's data pin for the DS18B20 probes (${owUsers.filter(o => owPinOf(o, dv, P) === owHit).map(o => o.name).join(', ')}).` };
  }
  const adv = pinAdvice(el, mine, others, owPin, ethernetMega((devices ?? []).find(d => d.name === iface)), P);
  // Fritz, 2026-10-27 (Skynet Rule 6.11): D4 is the SD card pin of the Ethernet shield. Allowed, with a warning. On every board that
  // takes an Ethernet shield, not only the Mega (OakBarn Brewery, 2026-11-19: yes)
  const dev = (devices ?? []).find(d => d.name === iface);
  if (mine.includes(SD_PIN) && iface && sdBoard(P)) return { warn: SD_WARNING + (adv ? '\n\n' + adv.warn : ''), pin: adv?.pin };
  const pw = P.pinWarn && mine.map(p => P.pinWarn[p]).find(Boolean);      // ESP32 GPIO16 and GPIO17 (WROVER boards)
  if (pw) return { warn: pw + (adv ? '\n\n' + adv.warn : ''), pin: adv?.pin };
  if (P.opta && iface) {      // Rule 6.36: one warning when a Device is put on an Opta (what has to be added, see Help 206)
    const r = mine.find(p => !P.inputOnly.includes(p)), a = el.type === 'analogIn' && mine.find(p => P.inputOnly.includes(p)), at = P.label(mine[0] ?? 'I1');
    const k = el.type === 'temperature' ? 'temperature' : el.type === 'stepper' ? 'stepper' : el.type === 'analogIn' && el.adc === 'ads1115' ? 'ads1115'
      : r && (needsPwm(el) || el.pseudoPwm || (['pid', 'deadband'].includes(el.type) && el.pwm)) ? 'pwm' : '';
    if (k) { const [what, add] = OPTA_PROBE_CIRCUITS[el.sensor || 'ds18b20'] || OPTA_PROBE_CIRCUITS.ntc;
      const w = OPTA_WARNINGS[k].replace('{0}', k === 'temperature' && !mine.length ? iface : at).replace('{1}', what).replace('{2}', add);
      return { warn: k === 'temperature' && ['lm35', 'tmp36'].includes(el.sensor) ? w.replace(/can't be wired straight to an Opta input\. Add: /, 'reads on an Opta input with ') : w }; }
    if (r) return { warn: OPTA_RELAY_WARNING.replace('{0}', P.label(r)) };
    if (a) return { warn: OPTA_ANALOG_WARNING.replace('{0}', a) };
  }
  const a2 = P.wifiAdc2 && linkOf(dev) === 'esp32' && mine.find(p => P.wifiAdc2.some(a => String(54 + +a.slice(1)) === p));
  if (a2) return { warn: ADC2_WARNING.replace('{0}', 'A' + (+a2 - 54)) + (adv ? '\n\n' + adv.warn : ''), pin: adv?.pin };
  if (mine.includes(ETHERNET_PIN) && usbMega((devices ?? []).find(d => d.name === iface))) return { warn: ETHERNET_PIN_WARNING + (adv ? '\n\n' + adv.warn : ''), pin: adv?.pin };
  return adv;
}
// Fritz, 2026-10-23: PWM and counter (interrupt) pins are few. A Device that doesn't need what its pin is kept for gets a heads-up
// naming a free pin that fits it better; when no such pin is left there is no heads-up.
export const PWM_PINS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '44', '45', '46'];
export const COUNTER_PINS = ['2', '3', '18', '19', '20', '21'];
const MEGA_PINS = [...Array(54).keys()].slice(2).map(String);      // D2-D53 (D0 and D1 are the USB link)
// Pseudo PWM (Fritz, 2026-11-05): a PWM Device on a plain pin, switched fully on and off by the Brain (lib/hardware.js), needs no PWM pin.
// An analog output can't: its 0-10 V module needs a real PWM signal.
export const canPseudoPwm = e => e?.type === 'pwmOut' || (['pid', 'deadband'].includes(e?.type) && !!e.pwm);
export const PSEUDO_PWM_PERIOD = 1000;      // ms: one on and off cycle
export const pseudoPwmOn = (pct, now, period = PSEUDO_PWM_PERIOD) => { const p = Math.max(0, Math.min(100, Number(pct) || 0)); return p >= 100 || (p > 0 && (now % period) < period * p / 100); };
// a Pump with Speed control PWM (Fritz, 2026-11-08) needs a true PWM pin too
const needsPwm = e => !(e.pseudoPwm && canPseudoPwm(e)) && (['pwmOut', 'analogOut'].includes(e.type) || (['pid', 'deadband'].includes(e.type) && e.pwm) || (e.type === 'digitalOut' && e.subtype === 'pump' && !!e.pwm)
  || (e.type === 'digitalOut' && e.subtype === 'element' && e.heatMethod === 'pwm'));      // a Heating Element added on the PWM Method (Rule 6.19)
const needsCounter = e => e.type === 'flowMeter' || e.typeCode === 'Count';
const KEPT = { pwm: 'a PWM pin', counter: 'a counter (interrupt) pin', spi: 'one of the SPI pins that RTD and thermocouple boards need', onewire: 'the OneWire data pin for DS18B20 probes' };

// Pin rules by board (public/boards.js, OakBarn Brewery, 2026-11-19: every standard Arduino board, Rule 6.35). The Mega is the board
// Skynet plans and wires for ("Plan Skynet for a Mega and the warnings if you use a 3.3v board instead"); its lists are the ones above.
// Raspberry Pi (firmware/Pi_GPIO, 2026-10-27): GPIO 2-27 by their GPIO (BCM) numbers. The Pi program makes PWM and counts pulses
// on any pin, so no pin is kept for those. SPI (RTD and thermocouple boards) uses GPIO 7-11, DS18B20 probes GPIO 4, I2C (ADS1115)
// GPIO 2 and 3. A Pi has no analog pins (use an ADS1115) and can't time stepper motors.
const PI_PINS = Array.from({ length: 26 }, (_, i) => String(i + 2));
const PROFILES = Object.fromEntries(Object.entries(BOARD_INFO).map(([k, b]) => [k, { ...b, board: k, inputOnly: b.inputOnly || [], avoid: b.avoid || [], usb: b.usb || [] }]));
Object.assign(PROFILES.mega, { pins: MEGA_PINS, pwm: PWM_PINS, counter: COUNTER_PINS, spi: SPI_PINS, onewire: ONEWIRE_PIN });
// a list of Ports a board keeps for something (PWM, counters) only when not every Port that can drive an output is in it (on a Pi, an ESP32
// or a Due every pin counts pulses, so none is kept for that)
const keepsFew = (P, list) => !(P.pwmAll && list === P.pwm) && !P.pins.filter(p => !P.inputOnly.includes(p)).every(p => list.includes(p));
// a true PWM pin of a board that has few of them (shown in its own color in the Port lists; OakBarn Brewery, 2026-11-19: "Different color
// for PWM Pins"). On a Pi or an ESP32 every pin does PWM, so none is colored.
// A Pi makes PWM on every pin, but GPIO 12, 13, 18 and 19 have the hardware PWM (OakBarn Brewery, 2026-11-19: mark them too).
export const isPwmPin = (p, board) => { const P = pinProfile(board); return (keepsFew(P, P.pwm) && P.pwm.includes(String(p))) || !!P.truePwm?.includes(String(p)); };
export const pinProfile = board => PROFILES[board] || PROFILES.mega;
const profileOf = (el, devices) => pinProfile(boardOf((devices ?? []).find(d => d.name === el.device)));
// can this Device's Port make true PWM? (a Mega: D2-D13, D44-D46; a Pi: every pin). A PWM Pump on another pin runs On/Off only.
export const canTruePwm = (el, devices) => profileOf(el, devices).pwm.includes(String(el?.channel ?? ''));
// How a pin is shown in the pin picker: D5 (PWM) on a Mega, GPIO17 on a Pi, A3 = pin 57 (BruControl) for Mega analog pins.
// el (the Device being given a Port) is optional: every PWM pin reads "D5 (Best for True PWM: see Help)" (Rule 4.2).
export function pinLabel(p, board, el) {
  p = String(p);
  if (/^A\d+$/.test(p)) return analogLabel(p, pinProfile(board));
  const t = pinTag(p, board, el);
  return pinProfile(board).label(p) + (t ? `  (${t})` : '');
}
// The board of the Interface a Device is on ('mega', 'esp32', 'pi', 'other')
export const boardOfDevice = (el, devices) => boardOf((devices ?? []).find(d => d.name === el?.device));
// A plain message when a Device can't go on a Raspberry Pi's own pins, or null
function piDeviceError(el, mine) {
  if (el.type === 'stepper') return 'A Raspberry Pi can\'t time the steps of a stepper motor. Put the motor on a Mega or ESP32 Interface.';
  if ((el.type === 'analogIn' && el.adc !== 'ads1115') || (el.type === 'temperature' && ['ntc', 'lm35', 'tmp36'].includes(el.sensor))) return 'A Raspberry Pi has no analog pins. Use an ADS1115 board on its I2C pins (GPIO 2 and 3), or put this sensor on a Mega.';
  const off = mine.find(p => !PI_PINS.includes(p) && !/^ADS\d$/.test(p));      // ADS1115 channels are not pins
  if (off !== undefined) return `GPIO${/^\d+$/.test(off) ? off : ' ' + off} is not a pin you can use on a Raspberry Pi. Use GPIO 2 to GPIO 27.`;
  return null;
}
// A plain message when a Device can't go on one of these Ports of a board other than the Mega and the Pi, or null (2026-11-19, Rule 6.35):
// a Port the board doesn't have, or (ESP32) an input-only Port given an output
export const OUTPUT_TYPES = ['digitalOut', 'pwmOut', 'analogOut', 'dutyCycle', 'hysteresis', 'pid', 'deadband', 'stepper'];
function boardDeviceError(el, mine, P) {
  const name = BOARD_INFO[P.board]?.name || P.board, an = analogPins(P);
  const off = mine.find(p => !/^ADS\d$/.test(p) && !P.pins.includes(p) && !an.some(a => a === p || String(54 + +a.slice(1)) === p));
  if (off !== undefined) return `${/^\d+$/.test(off) ? P.label(off).replace(/ \(.*$/, '') : off} is not a Port you can use on an ${name}. Pick one from the Port list.`;
  const ro = OUTPUT_TYPES.includes(el.type) && mine.find(p => P.inputOnly.includes(p));
  if (ro) return `${P.label(ro)} on an ${name} can only read (an input). Put this output on another Port.`;
  if (P.opta) return optaDeviceError(el, mine, P);
  return null;
}
// Arduino Opta (Rule 6.36, Panel Updates entry 34 step 1). Like a Mega (OakBarn Brewery, 2026-11-19: "Make the Temperature Probes or other
// Things like heater control just like how a mega does it as you cannot directly attach a probe to any pin and it will work. You need
// something besides the Mega ... If it requires an expansion Module, then add that in the Help"): every Device can go on it. Only what the
// Port can't do at all is refused: a relay can't read, an input can't switch (the inputOnly check above). The rest is one warning
// (OPTA_WARNINGS) saying what has to be added, and Help 206 names the modules.
function optaDeviceError(el, mine, P) {
  const relay = mine.find(p => !P.inputOnly.includes(p));
  if (relay && !OUTPUT_TYPES.includes(el.type)) return `${P.label(relay)} on an Arduino Opta is a relay: it switches, it can't read. Put this Device on an input I1-I8.`;
  return null;
}
const OPTA_ELECTRIC = '\n\n⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.';
// The added circuit for each Skynet probe type on an Opta (OakBarn Brewery, 2026-11-19: "Do the best for 10KNTC Probes ( and support for all
// th eprobes on our Skynet Probes. JUst add the addition Cu=ircuits."). The Opta's inputs read 0-10 V, so most probes need a temperature
// transmitter with a 0-10 V output; its range (for example 0-150 °C) is set on the transmitter.
export const OPTA_PROBE_CIRCUITS = {
  ntc: ['10K NTC (or other NTC) probe', 'an NTC temperature transmitter with a 0-10 V output (set it to your NTC: 10K, B 3950), wired to I1-I8.'],
  pt100: ['PT100 RTD', 'an Opta Analog Expansion (A0602), which reads PT100 probes itself; or a PT100 temperature transmitter with a 0-10 V output, wired to I1-I8.'],
  pt1000: ['PT1000 RTD', 'a PT1000 temperature transmitter with a 0-10 V output, wired to I1-I8.'],
  thermocouple: ['thermocouple', 'a thermocouple transmitter for your type (K, J, T ...) with a 0-10 V output, wired to I1-I8.'],
  lm35: ['LM35', 'nothing but a 5 V supply for the sensor: its output (10 mV per °C) goes straight to I1-I8 (about 0.25 °C per step).'],
  tmp36: ['TMP36', 'nothing but a 5 V supply for the sensor: its output (10 mV per °C) goes straight to I1-I8 (about 0.25 °C per step).'],
  ds18b20: ['DS18B20 (OneWire) probe', 'the Opta has no OneWire. Put DS18B20 probes on a Mega (or another board in the list), or swap them for 10K NTC or PT100 probes with a transmitter. A DS18B20-to-RS485 module will work once Skynet has RS485.'],
};
export const OPTA_WARNINGS = {
  temperature: '{0} on an Arduino Opta: a {1} can\'t be wired straight to an Opta input. Add: {2} See Help 206.',
  pwm: '{0} on an Arduino Opta is a relay: fast PWM or Pseudo PWM wears a relay out. For heater control by PWM, use an SSR driven by an Opta Digital Expansion with solid-state outputs (D1608S), or Duty Cycle / Hysteresis On/Off. See Help 206.' + OPTA_ELECTRIC,
  stepper: '{0} on an Arduino Opta: a stepper motor needs fast step pulses that a relay can\'t give. Use a stepper driver with its own controller, or put the motor on a Mega. See Help 206.',
  ads1115: '{0} on an Arduino Opta: the Opta has no I2C pins for an ADS1115. Wire a 0-10 V sensor straight to I1-I8, or use an Opta Analog Expansion (A0602). See Help 206.',
};
export const OPTA_ANALOG_WARNING = '{0} on an Arduino Opta reads 0-10 V, not 0-5 V: a 0-5 V sensor reads only half its range. Set the sensor\'s range in this Device to match.';
export const OPTA_RELAY_WARNING = '{0} on an Arduino Opta is a relay (Normally Open, at most 250 V AC and 10 A). It switches a contactor coil, an SSR, a 24 V valve or a light.\n\n⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.';
// The 3.3 V warnings (OakBarn Brewery, 2026-11-19: "Plan Skynet for a Mega and the warnings if you use a 3.3v board instead", "Make
// those Warnings", Rule 6.35). The Mega (5 V) is the board Skynet plans and wires for. A brewery may mix 5 V and 3.3 V boards ("you
// could have a mixed system of 3.3 and 5v"), so the warning goes by the board this Device is on. One warning, when the Device is put on
// a Port of a 3.3 V board (Fritz, 2026-11-18: one warning is enough), then the brewer decides.
export const LOW_VOLT_WARNINGS = {
  input: '⚠ {0} is a 3.3 V board. Wire this input to 3.3 V, never to 5 V: 5 V on a 3.3 V pin can ruin the board. A switch or float switch goes between the pin and GND (the board\'s own pull-up), or use a level shifter.',
  analog: '⚠ {0} is a 3.3 V board. A 0-5 V sensor (for example a pressure transducer) puts more than 3.3 V on the pin and can ruin the board. Use a voltage divider, a 3.3 V sensor, or an ADS1115 board.',
  output: '⚠ {0} is a 3.3 V board. Many 5 V relay modules do not switch from a 3.3 V pin. Use a relay module made for a 3.3 V signal, or an SSR (most switch from 3 to 32 V).\n\n⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.',      // Rule 6.20: it talks about wiring an SSR
};
const ANALOG_SENSORS = ['ntc', 'lm35', 'tmp36'];
export function lowVoltWarning(el, devices) {
  const d = (devices ?? []).find(x => x.name === el?.device), b = d && BOARD_INFO[boardOf(d)];
  if (!b || b.volts >= 5) return '';
  const kind = el.type === 'digitalIn' ? 'input' : (el.type === 'analogIn' && el.adc !== 'ads1115') || (el.type === 'temperature' && ANALOG_SENSORS.includes(el.sensor)) ? 'analog'
    : ['digitalOut', 'pwmOut'].includes(el.type) ? 'output' : '';
  return kind ? LOW_VOLT_WARNINGS[kind].replace('{0}', `${d.name} (${b.name})`) : '';
}
// what a Mega pin is kept for, shown beside it in the pin picker (Fritz, 2026-10-23): "PWM", "Counter", "PWM + Counter" ...
// For a Device that doesn't need PWM (an On/Off DO, a probe, a pseudo PWM ...) a PWM pin reads "Save for PWM" (OakBarn Brewery,
// 2026-11-12: "Mark the PWM as Save for PWM for DO that dont need PWM", Rule 4.2), so it is kept for a Device that needs it.
export const SAVE_FOR_PWM = 'Best for True PWM';
// OakBarn Brewery, 2026-11-19: "And on PWM Pins "best for True PWM: See Help"": every PWM pin (for any Device) reads "Best for True PWM:
// see Help" in place of "PWM" and "Save for PWM" (Rule 4.2 still offers PWM pins to a Device that doesn't need PWM only when no plain pin is free)
export const PWM_TAG = SAVE_FOR_PWM;
export function pinTag(p, board, el) {
  p = String(p);
  if (board === 'pi') { const P = PROFILES.pi; return [P.truePwm.includes(p) && PWM_TAG + ': see Help', P.spi.includes(p) ? 'SPI, for RTD boards' : p === P.onewire ? 'OneWire probes' : P.i2c.includes(p) ? 'I2C, for an ADS1115' : ''].filter(Boolean).join(', '); }
  const P = pinProfile(board);
  if (P.opta) return P.inputOnly.includes(p) ? 'input: digital or 0-10 V' : 'relay';      // Rule 6.36
  const t = [keepsFew(P, P.pwm) && P.pwm.includes(p) && PWM_TAG, keepsFew(P, P.counter) && P.counter.includes(p) && 'Counter', P.inputOnly.includes(p) && 'input only'].filter(Boolean).join(' + ')
    + (keepsFew(P, P.pwm) && P.pwm.includes(p) ? ': see Help' : '');
  if (p === SD_PIN && sdBoard(P)) return [t, 'SD card pin'].filter(Boolean).join(', ');      // Skynet Rule 6.11, every board that takes an Ethernet shield
  const weak = P.weakOut?.includes(p) && 'low current, use last for outputs';      // Nano ESP32 D1 (a 499 ohm resistor in its line)
  return [t, weak].filter(Boolean).join(', ') || (P.spi.includes(p) ? 'SPI, for RTD boards' : p === P.onewire ? 'OneWire probes' : P.i2c.includes(p) ? 'I2C' : P.usb.includes(p) ? 'USB link' : P.avoid.includes(p) ? `${P.avoidWhy?.[p] || 'start-up pin'}, use last` : '');
}
// Fritz, 2026-10-23: the free pins a new Device can take on its Interface, best fit first (a relay gets plain pins before PWM or
// counter pins, a PWM output PWM pins, a flow meter counter pins, analog inputs A0-A15)
export function freePins(el, elements, devices, analog) {
  const need = [needsPwm(el) && 'pwm', needsCounter(el) && 'counter'].filter(Boolean), P = profileOf(el, devices);
  const pool = analog ? analogPins(P) : isRtd(el) && onMega(el, devices) ? RTD_CS_PINS : need.includes('pwm') ? P.pwm : need.includes('counter') ? P.counter : P.pins;
  const owPins = oneWirePins((devices ?? []).find(d => d.name === el.device), P);
  const special = (list, p) => keepsFew(P, list) && list.includes(p);      // on a Pi every pin can do PWM and count, so none is kept for it
  const extras = p => [special(P.pwm, p) && 'pwm', special(P.counter, p) && 'counter', (P.spi.includes(p) || owPins.includes(p) || P.i2c.includes(p)) && 'bus'].filter(k => k && !need.includes(k)).length;
  const free = pool.filter(p => !(OUTPUT_TYPES.includes(el.type) && P.inputOnly.includes(p))).filter(p => { const t = { ...el, channel: p }; return !portClash(t, elements) && !busCheck(t, elements, devices)?.error; })
    .map((p, i) => [p, extras(p) + (P.avoid.includes(p) || (OUTPUT_TYPES.includes(el.type) && P.weakOut?.includes(p)) ? 5 : 0) , i]).sort((a, b) => a[1] - b[1] || a[2] - b[2]).map(x => x[0]);
  // Fritz, 2026-11-05: "If The Device works best with true PWM, select only those Ports That are PWM. If works with Pseudo PWM fine,
  // select NON PWM Ports." A Device that needs no true PWM is offered only the pins that can't do it (Rule 4.2); only when none of
  // those is free are the PWM pins offered. (On a Pi every pin does PWM, so nothing is held back.)
  if (pool !== P.pins || !special(P.pwm, P.pwm[0])) return free;
  const plain = free.filter(p => !P.pwm.includes(p));
  return plain.length ? plain : free;
}
function pinAdvice(el, mine, others, owPin, eth, P = PROFILES.mega) {
  const special = (list, p) => keepsFew(P, list) && list.includes(p);
  const kept = p => [special(P.pwm, p) && 'pwm', special(P.counter, p) && 'counter', P.spi.includes(p) && 'spi', p === owPin && 'onewire'].filter(Boolean);
  const need = [needsPwm(el) && 'pwm', needsCounter(el) && 'counter', usesSpi(el) && 'spi', isProbe(el) && 'onewire'].filter(Boolean);
  const used = new Set(others.filter(o => o.device === el.device).flatMap(pinsOn));
  for (const p of mine) {
    const extra = kept(p).filter(k => !need.includes(k)); if (!extra.length) continue;
    const xs = q => kept(q).filter(k => !need.includes(k));
    const better = P.pins.filter(q => !used.has(q) && !(eth && q === ETHERNET_PIN) && !mine.includes(q) && need.every(k => kept(q).includes(k)) && xs(q).length < extra.length && !xs(q).some(k => k === 'spi' || k === 'onewire'))
      .sort((a, b) => xs(a).length - xs(b).length)[0];
    if (!better) continue;
    const lose = extra.map(k => KEPT[k]).join(' and ');
    return { warn: `Heads up: pin ${p} is ${lose}. Those are few, and this Device doesn't need that. Pin ${better} is free and fits it.` + (extra.includes('spi') ? ` While this Device is on pin ${p} you can't add RTD or thermocouple probes to ${el.device}.` : '') + (extra.includes('onewire') ? ` While this Device is on pin ${p} you can't add DS18B20 probes to ${el.device}.` : ''), pin: better };
  }
  return null;
}
// The other Device already on one of this Device's ports, or null
export function portClash(el, elements) {
  const mine = new Set(portKeys(el)); if (!mine.size) return null;
  for (const o of elements ?? []) {
    if (o === el || o.name === el.name || mayShare(el, o)) continue;
    const k = portKeys(o).find(x => mine.has(x));
    if (k) return { other: o.name, device: el.device, pin: k.split('|')[1] };
  }
  return null;
}

// Cloned Devices (Fritz, 2026-10-27): a Clone's name is its parent's name, _Clone_ and the lowest free number:
// MB_06_DO@Pump_Wort__HS -> MB_06_DO@Pump_Wort__HS_Clone_1. Skynet makes it; nobody types it. taken(name) says a name is used.
export function cloneName(parent, taken, keep) {
  if (keep && !taken(`${parent}_Clone_${keep}`)) return `${parent}_Clone_${keep}`;      // a parent rename keeps the Clone's number
  let n = 1; while (taken(`${parent}_Clone_${n}`)) n++;
  return `${parent}_Clone_${n}`;
}
export const cloneNumber = name => +(/_Clone_(\d+)$/.exec(name ?? '')?.[1] ?? 0) || undefined;

// Widget names (Fritz, 2026-11-06, Rule 3.14): wgt_Type_Label_TabID, one underscore between the parts, e.g. wgt_DT_DateTime_1_BR.
// The Type is a few letters for the kind of Widget, as gGlobals have gV_, gS_ ... (Fritz picked them; Picture is PIX).
// Vessels, pipes, fittings and Clones keep their own names; names already made never change by themselves (Rule 3.5).
export const WIDGET_TYPE_IDS = {
  picture: 'PIX', text: 'TXT', label: 'LBL', valueWidget: 'VAL', timeWidget: 'TM', dateTimeWidget: 'DT', timer: 'TMR',
  soundPlayer: 'AUD', switch: 'SW', pushButton: 'PB', pulseButton: 'PL', led: 'LED', manualValve: 'MV', tapValve: 'TWV',
  alarm: 'ALM', override: 'OVR', chart: 'GPH',      // the Graph Widget (was Chart, CHT; Rule 1.26)
};
// the Type of a Widget: by its type (an element) or its kind (a Text, an Override); a Manual Valve is an IP fitting (tap: a Tap
// Water Valve, TWV)
export function widgetTypeId(e, tap = false) {
  if (!e) return '';
  if (e.fitting === 'manualValve') return tap ? WIDGET_TYPE_IDS.tapValve : WIDGET_TYPE_IDS.manualValve;
  if (e.cloneId || e.cloneOf) return '';
  if (e.type === 'codeValueWidget') return 'CV';
  if (e.type === 'switch' && BOOL_STYLE_IDS[e.boolStyle]) return BOOL_STYLE_IDS[e.boolStyle];      // a Slider, Checkbox or Lighted Button (Rule 1.20)      // the Code Value Widget (OakBarn Brewery, 2026-11-08, Rule 1.27)
  return WIDGET_TYPE_IDS[e.type] || WIDGET_TYPE_IDS[e.kind] || '';
}
// the Manual Pump Widget (Rule 5.15a, public/confirm.js): wgt_MP_Pump~7_BR. Added on its own line (not listed with the others, so
// the Widget Type count the other open changes check stays as it is); it works the same as the codes above.
Object.defineProperty(WIDGET_TYPE_IDS, 'manualPump', { value: 'MP', enumerable: false });
// the Process Widget (OakBarn Brewery, 2026-11-09, Rule 1.31, public/processwidget.js): wgt_PSW_Mash~Steps_BR. On its own line too.
Object.defineProperty(WIDGET_TYPE_IDS, 'processWidget', { value: 'PSW', enumerable: false });
// the Boolean sub-Widgets that are a Switch inside (OakBarn Brewery, 2026-11-09, Rule 1.20, public/semi.js): wgt_SLD_Stir_BR
export const BOOL_STYLE_IDS = { slider: 'SLD', checkbox: 'CHK', lighted: 'LTB' };
export function suggestWidgetName({ code, label, tab } = {}) {
  return ['wgt', code, parseLabel(label), tab].map(x => String(x ?? '').trim()).filter(Boolean).join('_');
}
