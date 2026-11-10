// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// One Heating Element, the heating method picked (Fritz, 2026-11-07: "The way I want to handle this is ONE device, but a to
// select the heating method via process or on the Device when clicked", Rule 6.19). A Heating Element (a Digital Out with the
// element subtype, on its own or built into a Vessel Device or RIMS tube) is ONE Device on its port. How it is controlled is
// its .method: On/Off, Duty Cycle, Hysteresis, PID, Deadband or Precise (Fritz, 2026-11-07: "a method of precise control"). A Process changes it (hE_PID_1.method = "PID") and so does a
// click on the Element while running. Used by the Brain (lib/store.js, lib/control.js, lib/hardware.js), the Panel and the
// BruControl Importer, so all three mean the same thing.

// [key, the word shown and read back, the short code used in Labels (Rule 18.24) and on short method buttons, what it does]
// Direct is the old On/Off (OakBarn Brewery, 2026-11-09: "On/Off Change to Direct"): "On/Off" is still read as Direct (heatMethodKey).
export const HEAT_METHODS = [
  ['onoff', 'Direct', 'DO', 'full on or off, by a click or a Process'],
  ['dutyCycle', 'Duty Cycle', 'DutyC', 'on for a % of each cycle'],
  ['hysteresis', 'Hysteresis', 'HYS', 'on below the setpoint, off at it'],
  ['pid', 'PID', 'PID', 'holds a setpoint temperature'],
  ['deadband', 'Deadband', 'DeadB', 'steps its % toward the setpoint'],
  ['precise', 'Precise', 'PREC', 'holds a setpoint to 0.1 degree'],
];
export const HEAT_KEYS = HEAT_METHODS.map(m => m[0]);
// Hysteresis, PID, Deadband and Precise read a temperature probe (the Element's Probe, .input)
export const NEEDS_PROBE = ['hysteresis', 'pid', 'deadband', 'precise'];
// the methods that work out an output % (shown as "45 % ▸ 152")
export const PERCENT_METHODS = ['pid', 'deadband', 'precise'];

export const isHeatElem = el => el?.type === 'digitalOut' && el.subtype === 'element';
// Valves and Heating Elements always have a Toggle (OakBarn Brewery, 2026-11-09: "Valves and Heaters Toggle cannot have None, Default to
// Toggle", Rule 2.46): Toggle or Push Button, never None. A Manual valve has no power, so it is not one of them.
export const noNoneTap = el => isHeatElem(el) || (el?.type === 'digitalOut' && el.subtype === 'valve' && el.valveType !== 'manual');
// The Cool / Warm Pump (OakBarn Brewery, 2026-11-08, Rule 6.21): a pump that a temperature switches (a glycol pump that cools a
// fermenter, or a pump that brings warm water) is ONE Device on its port too (One Port, One Device), a Pump with a Method field,
// Type ID CPMP (MB_D5_CPMP_Cool~Pump_FR). Its methods are a pump's own: On/Off, or Hysteresis that cools (- On offset) or warms
// (+ On offset) to a Setpoint read by its Probe. The same .method, Setpoint and spots as a Heating Element, so a Process reads the same.
export const isCoolPump = el => el?.type === 'digitalOut' && el.subtype === 'pump' && (!!el.heatMethod || el.typeCode === 'CPMP');
export const PUMP_METHOD_KEYS = ['onoff', 'hysteresis'];
// a Device whose control is picked by .method: the Heating Element and the Cool / Warm Pump
export const isMethodDevice = el => isHeatElem(el) || isCoolPump(el);
// .setpoint is the preferred name of the temperature it holds (OakBarn Brewery, 2026-11-09, Rule 6.19): the same thing as the
// older .target, which still works for older Processes and BruControl. Read or set either one: both are the one Setpoint.
// It is on a Heating Element, a Cool / Warm Pump and the older Hysteresis, PID and Deadband Devices (a stepper's .target is
// where it moves to, not a Setpoint).
export const hasSetpoint = el => isMethodDevice(el) || ['hysteresis', 'pid', 'deadband', 'fermentor'].includes(el?.type);      // the Fermentor Control too (Rule 6.30)

// "PID", "pid", "Duty Cycle", "dutycycle", "DutyC", "HYS", "Direct", "On/Off" (the older word), "on off", "DO" ... -> the key (null when it is none of them)
const squash = s => String(s ?? '').toLowerCase().replace(/[\s_/\-]+/g, '');
export function heatMethodKey(v) {
  const s = squash(v);
  if (!s) return null;
  for (const [k, word, code] of HEAT_METHODS) if ([k, word, code].some(x => squash(x) === s)) return k;
  return { onoff: 'onoff', on: 'onoff', digital: 'onoff', digitalout: 'onoff', duty: 'dutyCycle', hyst: 'hysteresis', dband: 'deadband', prec: 'precise', precisepid: 'precise' }[s] ?? null;
}
export const heatMethodWord = k => HEAT_METHODS.find(m => m[0] === k)?.[1] ?? 'Direct';
// the word on a method button (OakBarn Brewery, 2026-11-09: "an Option to shorten the Names in the Ballon": Direct DO, Duty Cycle DutyC,
// PID, Hysteresis HYS, PWM; Deadband DeadB and Precise PREC as in their Labels). short = the Element's "Short method names" (methodShort).
export const methodButtonWord = (k, short) => short ? heatMethodCode(k) : heatMethodWord(k);
export const heatMethodCode = k => HEAT_METHODS.find(m => m[0] === k)?.[2] ?? 'DO';
// the method a Heating Element starts with (its Properties); Direct when none is set
export const startMethod = el => heatMethodKey(el?.heatMethod) ?? 'onoff';
export const methodChoices = () => HEAT_METHODS.map(m => [m[0], `${m[1]} (${m[3]})`]);
export const methodWords = () => HEAT_METHODS.map(m => m[1]).join(', ');
// Every Device with more than one method of control (Fritz, 2026-11-07: "for things that have more than on method of control
// to choose the one you want to use"): a Process picks one with .method. Today that is the Heating Element; a new kind of Device
// with more than one way of control is added here, and .method, the Process editor's list and Help follow it.
// Only the methods its Build allows (Fritz, 2026-11-07: "we ask the primary Control Method, and then have check boxes of other
// available Methods. Only Checked Methods are allowed. If a Method is Checked, it needs a Hot Spot or Icon on the Screen Display of
// the device to switch between methods"): its starting method (heatMethod) and every method ticked in its Build (methodSpot_<key>).
// Direct (full power, the old On/Off) is always allowed and always has its spot: it is not a choice (Fritz, 2026-11-08: "It should not be a choice.
// Always displayed").
export const allowedMethods = el => isMethodDevice(el) ? (isCoolPump(el) ? PUMP_METHOD_KEYS : HEAT_KEYS).filter(k => k === 'onoff' || k === startMethod(el) || el['methodSpot_' + k]) : [];
export const allowedWords = el => allowedMethods(el).map(heatMethodWord).join(', ');
// Returns the words .method takes, or null for a Device with only one way of control (one method allowed).
export const controlMethods = el => { const l = allowedMethods(el); return l.length > 1 ? l.map(heatMethodWord) : null; };

// The settings each method uses: [runtime name, Properties key, label, starting value]. The runtime names are the ones the
// separate Duty Cycle, Hysteresis, PID and Deadband Devices have, so a Process line reads the same (hE_1.setpoint = 152; the older hE_1.target is the same).
export const HEAT_SETTINGS = {
  onoff: [],
  dutyCycle: [['dutycycle', 'dutyCycle', 'Duty cycle %', 0], ['interval', 'interval', 'Cycle time (ms)', 1000]],
  hysteresis: [['target', 'target', 'Setpoint', 0], ['onoffset', 'onOffset', 'On offset', 1], ['ondelay', 'onDelay', 'On delay (s)', 0]],
  pid: [['target', 'target', 'Setpoint', 0], ['kp', 'kp', 'Kp', 10], ['ki', 'ki', 'Ki', 0.1], ['kd', 'kd', 'Kd', 0], ['maxoutput', 'maxOutput', 'Max output %', 100],
    ['maxintegral', 'maxIntegral', 'Max integral', 100], ['calctime', 'calcTime', 'Calc time (s)', 1], ['outtime', 'outTime', 'Output window (s)', 1]],
  deadband: [['target', 'target', 'Setpoint', 0], ['deadbandoffset', 'deadbandOffset', 'Deadband offset', 0.5], ['innerbandoffset', 'innerBandOffset', 'Inner band offset', 2],
    ['initialoutput', 'initialOutput', 'Initial output %', 0], ['innerbanddrive', 'innerBandDrive', 'Inner band drive %', 1], ['outerbanddrive', 'outerBandDrive', 'Outer band drive %', 5],
    ['maxoutput', 'maxOutput', 'Max output %', 100], ['calctime', 'calcTime', 'Calc time (s)', 10], ['outtime', 'outTime', 'Output window (s)', 2]],
  // Precise (Fritz, 2026-11-07: "a method of precise control built if possible using offsets to get to .1 F or .1 C", Rule 6.19): a
  // PID made calm for a still's column or anything that must hold to 0.1 degree. Setpoint, Kp, Ki, Kd and Max output are the PID's own
  // (switching between the two carries on with the same numbers); Hold output is the % it needs to just stay at the Setpoint (it starts
  // there, so it does not have to build it up), Smoothing the seconds it averages the probe over. See lib/control.js _precise.
  precise: [['target', 'target', 'Setpoint', 0], ['kp', 'kp', 'Kp', 10], ['ki', 'ki', 'Ki', 0.1], ['kd', 'kd', 'Kd', 0], ['maxoutput', 'maxOutput', 'Max output %', 100],
    ['holdoutput', 'holdOutput', 'Hold output % (what it needs to stay at the Setpoint)', 0], ['smoothing', 'smoothing', 'Smoothing (s, averages the probe)', 10],
    ['calctime', 'calcTime', 'Calc time (s)', 1], ['outtime', 'outTime', 'Output window (s)', 2]],
};
// every setting once (the first starting value wins; PID's Calc time 1 s is overridden by Deadband's own when it runs)
export const ALL_HEAT_SETTINGS = (() => {
  const m = new Map();
  for (const list of Object.values(HEAT_SETTINGS)) for (const s of list) if (!m.has(s[0])) m.set(s[0], s);
  return [...m.values()];
})();
// The main setting of each method, shown on the click pop-up with + and -
export const HEAT_MAIN = { dutyCycle: ['dutycycle', 'Duty cycle %'], hysteresis: ['target', 'Setpoint'], pid: ['target', 'Setpoint'], deadband: ['target', 'Setpoint'], precise: ['target', 'Setpoint'] };

// How fine a probe can see (Fritz, 2026-11-07: a precise method "to get to .1 F or .1 C"). Precise can only hold as close as its
// probe sees, so its Properties warn when the probe is too coarse. Returns { step (in the probe's own units), ok, text }.
// DS18B20: 0.0625 °C steps at its finest (12-bit) setting; PT100 / PT1000 on a MAX31865: about 0.03 °C; MAX31856 thermocouple
// board: about 0.01 °C (but a thermocouple drifts); MAX31855: 0.25 °C; a thermistor, LM35 or TMP36 on a 10-bit analog pin: about
// 0.1 to 0.5 °C (much finer on an ADS1115 16-bit board).
export function probeStep(probe) {
  if (!probe) return null;
  const s = probe.sensor || 'ds18b20', c = /c/i.test(String(probe.units ?? '')) && !/f/i.test(String(probe.units ?? ''));
  const stepC = s === 'ds18b20' ? 0.0625 : s === 'pt100' || s === 'pt1000' ? 0.03 : s === 'thermocouple' ? (probe.tcChip === 'max31855' ? 0.25 : 0.01)
    : probe.adc === 'ads1115' ? 0.02 : s === 'ntc' ? 0.2 : 0.5;
  const step = c ? stepC : stepC * 9 / 5, u = c ? '°C' : '°F', ok = step <= 0.1;
  const r = x => Math.round(x * 1000) / 1000;
  const text = ok ? `Its probe sees steps of ${r(step)} ${u}, fine enough to hold 0.1 ${u}.`
    : s === 'ds18b20' ? `Its probe (a DS18B20) sees steps of ${r(step)} ${u}: it holds about ±0.1 ${u}. For finer, use a PT100 probe on a MAX31865 board.`
    : `Its probe sees steps of about ${r(step)} ${u}, too coarse to hold 0.1 ${u}. Use a PT100 probe on a MAX31865 board (or a DS18B20).`;
  return { step, ok, text };
}

// A setting's starting value for this method (Calc time and Output window differ between PID and Deadband)
export function heatDefault(method, prop) {
  const own = HEAT_SETTINGS[method]?.find(s => s[0] === prop);
  return own ? own[3] : ALL_HEAT_SETTINGS.find(s => s[0] === prop)?.[3] ?? 0;
}

// BruControl and the old Skynet Schemas had one Device per way of controlling (Rule 6.1's old exception): its type -> method
export const TYPE_METHOD = { digitalOut: 'onoff', dutyCycle: 'dutyCycle', hysteresis: 'hysteresis', pid: 'pid', deadband: 'deadband' };

// Heat Hysteresis by what switches it (OakBarn Brewery, 2026-11-10: "Heat Only Hysteresis: Offset Range from .5 to 3 is allowed for
// heating elements with Optical SSRs"; a Contactor (and a mechanical relay) 2 to 5 with an On delay of at least 60 seconds, Rule 6.29).
// A Heating Element says what switches it (Hardware Controller, saved as switchedBy; empty = Optical SSR). Its Hysteresis that heats (a plus or 0 On
// offset) may only use an On offset inside that range, and on a Contactor or Relay an On delay of at least 60 s, so the contacts do not wear
// out. A minus On offset (cooling) is not a heat Hysteresis and has no range here. The numbers are °F; with a °C probe they are converted.
export const SWITCHED_BY = [
  ['ssr', 'Optical SSR', 0.5, 3, 0, 0.5],
  ['contactor', 'Contactor', 2, 5, 60, 3],
  ['relay', 'Mechanical relay', 2, 5, 60, 3],
];
// [key, word, lowest On offset, highest On offset, shortest On delay, the On offset it gets when picked] (°F)
// Picking a Hardware Controller sets its On offset (OakBarn Brewery, 2026-11-10: Optical SSR .5, Contactor 3, Mechanical relay 3)
export const switchedBy = el => SWITCHED_BY.some(s => s[0] === el?.switchedBy) ? el.switchedBy : 'ssr';
export const switchedByWord = k => SWITCHED_BY.find(s => s[0] === k)?.[1] ?? SWITCHED_BY[0][1];
export const switchedByChoices = () => SWITCHED_BY.map(s => [s[0], s[1]]);
const isCelsius = u => /c/i.test(String(u ?? '')) && !/f/i.test(String(u ?? ''));
// { min, max, delay, u } for this Heating Element; probe = its Temperature Probe (for °C), or null (°F)
export function heatHysRange(el, probe) {
  const s = SWITCHED_BY.find(x => x[0] === switchedBy(el)), c = isCelsius(probe?.units);
  const f = x => c ? Math.round(x * 5 / 9 * 10) / 10 : x;
  return { min: f(s[2]), max: f(s[3]), delay: s[4], u: c ? '°C' : '°F', word: s[1], start: f(s[5]) };
}
// The plain error when its heat Hysteresis On offset or On delay is outside the range, or null. Only a Heating Element that may use
// Hysteresis is checked; offset and delay default to the element's own saved ones.
export function heatHysProblem(el, probe, offset = el?.onOffset ?? 1, delay = el?.onDelay ?? 0) {
  if (!isHeatElem(el) || !allowedMethods(el).includes('hysteresis')) return null;
  const o = Number(offset), d = Number(delay) || 0, r = heatHysRange(el, probe), who = el.name || 'This Heating Element';
  if (Number.isFinite(o) && o >= 0 && (o < r.min || o > r.max))
    return `${who} (Hardware Controller: ${r.word}): its Hysteresis On offset must be ${r.min} to ${r.max} ${r.u} (Rule 6.29). It is ${o}.`;
  if (Number.isFinite(o) && o >= 0 && d < r.delay)
    return `${who} (Hardware Controller: ${r.word}): its Hysteresis On delay must be at least ${r.delay} seconds, so it does not wear out (Rule 6.29). It is ${d}.`;
  return null;
}
