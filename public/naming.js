// Interface IDs, Tab IDs and suggested Device names (Fritz, 2026-10-21). Used by the browser (app.js) and the server (lib/store.js).
//
// Interface ID: 1 to 4 letters, unique. A new Interface gets the first letter of its first two words ("Main Brewery Mega USB" = MB),
//   or MB_2, MB_3 ... when MB is taken. An Admin can change it. It is written with an underscore after it: MB_
// Tab ID: exactly 2 letters, unique ("Sparge" = SP). An Admin can change it.
// Device name: InterfaceID_Port_Type_DisplayName_TabID, e.g. MB_25_PWM_VlV_Fly_Sparge_SP. No spaces in Device names.

// Type codes for the name. Fritz's list: PmP VlV MtR FaN LgT LeD (outputs), DiN VoL (inputs), DO and DI as the plain ones,
// PWM_ before an output code for PWM. The rest follow his NnN / NnnN pattern.
const OUT = [['DO', 'Direct output (plain on / off)'], ['PmP', 'Pump'], ['VlV', 'Valve'], ['MtR', 'Motor'], ['FaN', 'Fan'], ['LgT', 'Light'], ['LeD', 'LED'],
  ['ElM', 'Heating element (electric)'], ['BrN', 'Burner (gas)']];
export const TYPE_CODES = {
  digitalOut: OUT,
  pwmOut: [['PWM', 'PWM output (plain)'], ...OUT.slice(1).map(([c, l]) => ['PWM_' + c, 'PWM ' + l])],
  analogOut: [['AO', 'Analog output (plain 0-10 V / 4-20 mA)'], ...OUT.slice(1).map(([c, l]) => ['AO_' + c, 'Analog ' + l])],
  digitalIn: [['DI', 'Direct input (plain)'], ['DiN', 'DIN'], ['VoL', 'Volume'], ['FlT', 'Float / level switch'], ['FlS', 'Flow switch'], ['BtN', 'Button (push, toggle or pulse)'],
    ['SfT', 'Safety interlock (door, lid, E-stop)'], ['CnT', 'Pulse counter']],
  analogIn: [['AI', 'Analog input (plain)'], ['PrS', 'Pressure'], ['LvL', 'Level'], ['VoL', 'Volume'], ['PhM', 'pH meter']],
  temperature: [['TmP', 'Temperature probe']],
  flowMeter: [['FlM', 'Flow meter']],
  scale: [['ScL', 'Scale (load cells)']],
  stepper: [['StP', 'Stepper motor']],
  dutyCycle: [['DtY', 'Duty cycle']],
  hysteresis: [['HyS', 'Hysteresis']],
  pid: [['PiD', 'PID']],
};
export const isDevice = el => !!el && Object.hasOwn(TYPE_CODES, el.type);
export const typeCodes = el => TYPE_CODES[el?.type] ?? [];

// The type code a new Device starts with: from its kind (pump, valve ...) or the Add menu entry it came from
const BY_HINT = { Float: 'FlT', FlowSw: 'FlS', PB: 'BtN', Toggle: 'BtN', Pulse: 'BtN', Interlock: 'SfT', Count: 'CnT', Pressure: 'PrS', Level: 'LvL', pH: 'PhM' };
export function defaultCode(el, hint) {
  const list = typeCodes(el); if (!list.length) return '';
  const out = { pump: 'PmP', valve: 'VlV', element: 'ElM', propValve: 'VlV' }[el.subtype];
  if (out) { const c = el.type === 'pwmOut' ? 'PWM_' + out : el.type === 'analogOut' ? 'AO_' + out : out; if (list.some(x => x[0] === c)) return c; }
  if (BY_HINT[hint] && list.some(x => x[0] === BY_HINT[hint])) return BY_HINT[hint];
  return list[0][0];
}

// Display name -> the part of a name: spaces (and anything that is not a letter, digit or _) become _
export const namePart = s => String(s ?? '').trim().replace(/[^A-Za-z0-9_]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

export function suggestName({ iface, port, code, displayName, tab } = {}) {
  return [iface, port, code, namePart(displayName), tab].map(x => namePart(x)).filter(Boolean).join('_');
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

// Interfaces and tabs without a (good) ID get one; a second use of the same ID gets a new one. True when something changed.
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
// Every board pin a Device uses, as "Interface|pin" (A5 and 59 are the same Mega pin). DS18B20 probes share one wire, so they have none.
const pinKey = p => {
  const s = String(p ?? '').trim().toUpperCase(); if (!s) return '';
  let m = /^A(\d{1,2})$/.exec(s); if (m && +m[1] <= 15) return String(54 + +m[1]);
  m = /^D?(\d+)$/.exec(s); return m ? String(+m[1]) : s;
};
export function portKeys(el) {
  if (!isDevice(el) || !el.device) return [];
  if (el.type === 'temperature' && (!el.sensor || el.sensor === 'ds18b20')) return [];
  if (el.type === 'analogIn' && el.adc === 'ads1115') return el.channel === undefined || el.channel === '' ? [] : [`${el.device}|ADS${el.channel}`];
  const pins = el.type === 'scale' ? String(el.channel ?? '').split(',') : el.type === 'stepper' ? [el.channel, el.dirPin, el.enablePin, el.pin2, el.pin3, el.pin4, el.homePin] : [el.channel];
  return [...new Set(pins.map(pinKey).filter(Boolean))].map(p => `${el.device}|${p}`);
}
// The other Device already on one of this Device's ports, or null
export function portClash(el, elements) {
  const mine = new Set(portKeys(el)); if (!mine.size) return null;
  for (const o of elements ?? []) {
    if (o === el || o.name === el.name) continue;
    const k = portKeys(o).find(x => mine.has(x));
    if (k) return { other: o.name, device: el.device, pin: k.split('|')[1] };
  }
  return null;
}
