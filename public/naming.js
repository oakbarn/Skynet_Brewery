// Interface IDs, Tab IDs and suggested Device names. Used by the browser (app.js) and the server (lib/store.js).
//
// Interface ID: 1 to 4 letters, unique. A new Interface gets the first letter of its first two words ("Main Brewery Mega USB" = MB),
//   or MB_2, MB_3 ... when MB is taken. An Admin can change it. (Fritz, 2026-10-21)
// Tab ID: exactly 2 letters, unique ("Sparge" = SP). An Admin can change it.
// Device name (Fritz, 2026-10-23): InterfaceID_Port_DeviceTypeID_ParsedLabel__TabID, e.g. MB_25_E_L_Vlv_Fly~Sparge_In__SP
//   from the Label "Fly/Sparge In". The Label itself is left as typed; only the name uses the parsed Label.

// Device Type IDs (Fritz, 2026-10-23). Every ID means one thing; an ID can sit in more than one list (DO is a plain relay and
// a heating element on a relay). Fritz's own IDs are kept as he wrote them; the ones added for him are 6 characters or fewer.
const T = {
  // temperature
  '1W': 'DS18B20 (OneWire probe)', RTD: 'RTD: PT100 / PT1000 (MAX31865 board)', TC: 'Thermocouple (MAX31855 / MAX31856 board)',
  '10KNTC': '10K NTC thermistor (BCS-462 and BruControl type)', '5KNTC': '5K NTC thermistor', '50KNTC': '50K NTC thermistor',
  '100KNT': '100K NTC thermistor (3D printer type)', NTC: 'NTC thermistor, other size', LM35: 'LM35 analog temperature sensor',
  TMP36: 'TMP36 analog temperature sensor',
  // heating
  PID: 'PID', DutyCy: 'Duty Cycle', Hys: 'Hysteresis', DO: 'Direct On / Off (relay, SSR, contactor; also a heating element on one)',
  H_PWM: 'Heating PWM (element on a PWM output)', H_AO: 'Heating element on a 0-10 V power controller (SCR / SSVR)',
  // direct on / off
  Pump: 'Pump', M_L_Vlv: 'Low Temperature Manual Valve', E_L_Vlv: 'Low Temperature Electric Valve', M_H_Vlv: 'High Temperature Manual Valve',
  E_H_Vlv: 'High Temperature Electric Valve', G_Vlv: 'Solenoid Gas Valve', Mtr: 'Motor', LED: 'LED', Light: 'Light', E_Alm: 'Electric Alarm',
  Fan: 'Fan', Chill: 'Chiller / glycol / fridge compressor', HtPad: 'Fermenter heat wrap or pad', Ignit: 'Burner igniter',
  // direct input
  DI: 'Direct Input (plain)', Float: 'Float (true while made)', DIN: 'DIN momentary push button (one trigger per press, 3 s lockout)',
  PB: 'Push button (ON only while held)', Toggle: 'Toggle button (press ON, press again OFF)', Latch: 'Latching input (ON until reset)',
  FlowSw: 'Flow switch', Intlk: 'Door / lid / safety interlock', EStop: 'Emergency stop', Leak: 'Leak sensor', Count: 'Pulse counter',
  // PWM and analog outputs
  PWM: 'PWM (plain)', P_L_Vlv: 'Low Temperature Proportional Valve', P_H_Vlv: 'High Temperature Proportional Valve',
  P_Pump: 'Pump speed', P_Fan: 'Fan speed', P_Mtr: 'Motor speed', P_LED: 'LED / light dimmer', AO: 'Analog output 0-10 V / 4-20 mA (plain)',
  // analog inputs and the rest
  AI: 'Analog input (plain)', Pres: 'Pressure', Level: 'Level', Vol: 'Volume', PH_Met: 'pH meter', FlowM: 'Flow meter', Scale: 'Scale (load cells)',
  Step: 'Stepper motor',
};
// IDs kept for Devices Skynet can't read yet, so nothing else takes them: DHT11 and DHT22 need firmware first;
// Hydro is a Tilt or any other hydrometer (Fritz, 2026-10-23), not built yet (a Tilt is Bluetooth).
export const RESERVED_TYPE_IDS = { DHT11: 'DHT11 temperature / humidity', DHT22: 'DHT22 temperature / humidity', Hydro: 'Hydrometer (Tilt or any other)' };
export const TYPE_NAMES = { ...T, ...RESERVED_TYPE_IDS };
const list = ids => ids.split(' ').map(id => [id, T[id]]);
export const TYPE_CODES = {
  temperature: list('1W RTD TC 10KNTC 5KNTC 50KNTC 100KNT NTC LM35 TMP36'),
  digitalOut: list('DO Pump M_L_Vlv E_L_Vlv M_H_Vlv E_H_Vlv G_Vlv Mtr LED Light E_Alm Fan Chill HtPad Ignit'),
  pwmOut: list('PWM H_PWM P_L_Vlv P_H_Vlv P_Pump P_Fan P_Mtr P_LED'),
  analogOut: list('AO H_AO P_L_Vlv P_H_Vlv P_Pump P_Fan P_Mtr'),
  digitalIn: list('DI Float DIN PB Toggle Latch FlowSw Intlk EStop Leak Count'),
  analogIn: list('AI Pres Level Vol PH_Met'),
  flowMeter: list('FlowM'),
  scale: list('Scale'),
  stepper: list('Step'),
  dutyCycle: list('DutyCy'),
  hysteresis: list('Hys'),
  pid: list('PID'),
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
  else if (el.type === 'digitalOut') c = { pump: 'Pump', valve: el.valveType === 'manual' ? 'M_L_Vlv' : 'E_L_Vlv' }[el.subtype];
  else if (el.type === 'pwmOut' || el.type === 'analogOut') c = { element: el.type === 'pwmOut' ? 'H_PWM' : 'H_AO', propValve: 'P_L_Vlv', pump: 'P_Pump' }[el.subtype];
  else if (el.type === 'digitalIn') c = BY_HINT[hint] || { momentary: 'DIN', latch: 'Latch', toggle: 'Toggle', counter: 'Count' }[el.mode];
  else c = BY_HINT[hint];
  return c && has(c) ? c : codes[0][0];
}
// The type codes of PR #61 (PmP, VlV ...) -> the Device Type IDs. A code that no longer fits is worked out again.
const OLD_CODES = { PmP: 'Pump', VlV: 'E_L_Vlv', MtR: 'Mtr', FaN: 'Fan', LgT: 'Light', LeD: 'LED', ElM: 'DO', BrN: 'G_Vlv',
  PWM_PmP: 'P_Pump', PWM_VlV: 'P_L_Vlv', PWM_MtR: 'P_Mtr', PWM_FaN: 'P_Fan', PWM_LgT: 'P_LED', PWM_LeD: 'P_LED', PWM_ElM: 'H_PWM',
  AO_PmP: 'P_Pump', AO_VlV: 'P_L_Vlv', AO_MtR: 'P_Mtr', AO_FaN: 'P_Fan', AO_ElM: 'H_AO',
  DiN: 'DIN', FlT: 'Float', FlS: 'FlowSw', BtN: 'PB', SfT: 'Intlk', CnT: 'Count', PrS: 'Pres', LvL: 'Level', VoL: 'Vol', PhM: 'PH_Met',
  FlM: 'FlowM', ScL: 'Scale', StP: 'Step', DtY: 'DutyCy', HyS: 'Hys', PiD: 'PID' };
export function upgradeCode(el) {
  if (!el?.typeCode) return '';
  const codes = typeCodes(el), c = OLD_CODES[el.typeCode] ?? el.typeCode;
  return codes.some(x => x[0] === c) ? c : defaultCode(el);
}

// Label -> the part of a name (Fritz, 2026-10-23): control characters and emoji are dropped, spaces at the ends trimmed,
// < > : " / \ | ? * . , each become ~ and spaces become _
// Emoji as the name rules count them (public/names.js): the colour pictures, flags, skin tones and joiners; © ® ™ stay
const PICTO = /\p{Extended_Pictographic}/u, EMOJI_PART = /[\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u200D\uFE0E\uFE0F\u20E3]/u;
const isEmoji = ch => EMOJI_PART.test(ch) || (PICTO.test(ch) && ch.codePointAt(0) >= 0x2190);
export const parseLabel = s => [...String(s ?? '').replace(/\p{Cc}/gu, '')].filter(ch => !isEmoji(ch)).join('').trim()
  .replace(/[<>:"/\\|?*.,]/g, '~').replace(/\s+/g, '_');

// Virtual ports, as BruControl numbers them (Fritz, 2026-10-23): a hydrometer (Hydro: a Tilt or any other) has no pin,
// so the 1st one is port 200, the 2nd 201 ... (index from 1). Used in its name when Hydro Devices are built.
export const HYDRO_PORT_BASE = 200;
export const hydroPort = index => String(HYDRO_PORT_BASE + Math.max(1, Math.trunc(Number(index) || 1)) - 1);
// OneWire (DS18B20) probes share one wire, so each probe number is a virtual port 700-799: probe 1 = 700, probe 2 = 701 ...
// A probe number can be used by one Device only.
export const ONEWIRE_PORT_BASE = 700;
export const oneWirePort = index => Number(index) >= 1 && Number(index) <= 100 ? String(ONEWIRE_PORT_BASE + Math.trunc(Number(index)) - 1) : '';

export function suggestName({ iface, port, code, label, tab } = {}) {
  const head = [iface, port, code, parseLabel(label)].map(x => String(x ?? '').trim()).filter(Boolean).join('_');
  return tab ? (head ? `${head}__${tab}` : tab) : head;
}
// A suggested name that is already used (an old Device, or a Widget) gets _2, _3 ... after the Label: MB_25_Pump_Wort_2__BR
export function uniqueName(name, isTaken) {
  if (!name || !isTaken(name)) return name;
  const cut = name.lastIndexOf('__'), head = cut > 0 ? name.slice(0, cut) : name, tail = cut > 0 ? name.slice(cut) : '';
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

// ---- Interface IDs ----
export function cleanInterfaceId(id) {
  const s = String(id ?? '').trim().toUpperCase().replace(/_+$/, '');
  if (!/^[A-Z]{1,4}(_\d+)?$/.test(s)) throw new Error(`Interface ID "${String(id ?? '').trim()}": use 1 to 4 letters (A-Z), for example MB`);
  return s;
}
export function defaultInterfaceId(name, taken) {
  const t = takenSet(taken), base = initials(name) || 'IF';
  if (!t.has(base)) return base;
  let i = 2; while (t.has(`${base}_${i}`)) i++;
  return `${base}_${i}`;
}

// ---- Tab IDs ----
export function cleanTabId(id) {
  const s = String(id ?? '').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(s)) throw new Error(`Tab ID "${String(id ?? '').trim()}": use exactly 2 letters (A-Z), for example SP`);
  return s;
}
export function defaultTabId(name, taken) {
  const t = takenSet(taken), w = words(name).join('').toUpperCase(), first = initials(name)[0] || 'T';
  const tries = [initials(name), ...[...w.slice(1)].map(c => first + c), ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => first + c)];
  for (const x of tries) if (x.length === 2 && !t.has(x)) return x;
  for (const a of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') for (const b of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') if (!t.has(a + b)) return a + b;
  return '';
}

// Interfaces and tabs without a (good) ID get one, and old type codes are brought up to date; a second use of the same ID gets a new one. True when something changed.
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
  for (const e of c.elements ?? []) {          // Device Type IDs of PR #61 (PmP, VlV ...) -> the 2026-10-23 list (names are not changed)
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

// ---- one Device per Interface port ----
// Every board pin a Device uses, as "Interface|pin" (A5 and 59 are the same Mega pin). DS18B20 probes share one wire, so they use
// their probe number instead (virtual port 700 + number - 1), on any Interface: one Device per probe.
const pinKey = p => {
  const s = String(p ?? '').trim().toUpperCase(); if (!s) return '';
  let m = /^A(\d{1,2})$/.exec(s); if (m && +m[1] <= 15) return String(54 + +m[1]);
  m = /^D?(\d+)$/.exec(s); return m ? String(+m[1]) : s;
};
export function portKeys(el) {
  if (!isDevice(el)) return [];
  if (!el.device && !(el.type === 'temperature' && (!el.sensor || el.sensor === 'ds18b20'))) return [];
  if (el.type === 'temperature' && (!el.sensor || el.sensor === 'ds18b20')) return el.probeIndex ? [`OneWire|${oneWirePort(el.probeIndex) || el.probeIndex}`] : [];
  if (el.type === 'analogIn' && el.adc === 'ads1115') return el.channel === undefined || el.channel === '' ? [] : [`${el.device}|ADS${el.channel}`];
  const pins = el.type === 'scale' ? String(el.channel ?? '').split(',') : el.type === 'stepper' ? [el.channel, el.dirPin, el.enablePin, el.pin2, el.pin3, el.pin4, el.homePin] : [el.channel];
  return [...new Set(pins.map(pinKey).filter(Boolean))].map(p => `${el.device}|${p}`);
}
// Fritz, 2026-10-23: outputs of different Device Types may share a port, e.g. MB_05_Hys_HLT__BR and MB_05_PID_HLT__BR on one
// heater. The one turned on or enabled last wins: the others on that port are turned off (lib/store.js).
export const SHARED_PORT_TYPES = ['digitalOut', 'pwmOut', 'analogOut', 'dutyCycle', 'hysteresis', 'pid'];
const mayShare = (a, b) => SHARED_PORT_TYPES.includes(a.type) && SHARED_PORT_TYPES.includes(b.type) && (a.typeCode || a.type) !== (b.typeCode || b.type);
// Devices that share a port with this one (other names)
export function portSharers(el, elements) {
  const mine = new Set(portKeys(el)); if (!mine.size) return [];
  return (elements ?? []).filter(o => o !== el && o.name !== el.name && portKeys(o).some(k => mine.has(k)));
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
