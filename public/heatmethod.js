// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// One Heating Element, the heating method picked (Fritz, 2026-11-07: "The way I want to handle this is ONE device, but a to
// select the heating method via process or on the Device when clicked", Rule 6.19). A Heating Element (a Digital Out with the
// element subtype, on its own or built into a Vessel Device or RIMS tube) is ONE Device on its port. How it is controlled is
// its .method: On/Off, Duty Cycle, Hysteresis, PID or Deadband. A Process changes it (hE_PID_1.method = "PID") and so does a
// click on the Element while running. Used by the Brain (lib/store.js, lib/control.js, lib/hardware.js), the Panel and the
// BruControl Importer, so all three mean the same thing.

// [key, the word shown and read back, the short code used in Labels (Rule 18.24), what it does]
export const HEAT_METHODS = [
  ['onoff', 'On/Off', 'DO', 'full on or off, by a click or a Process'],
  ['dutyCycle', 'Duty Cycle', 'DutyC', 'on for a % of each cycle'],
  ['hysteresis', 'Hysteresis', 'HYS', 'on below the target, off at it'],
  ['pid', 'PID', 'PID', 'holds a target temperature'],
  ['deadband', 'Deadband', 'DeadB', 'steps its % toward the target'],
];
export const HEAT_KEYS = HEAT_METHODS.map(m => m[0]);
// Hysteresis, PID and Deadband read a temperature probe (the Element's Probe, .input)
export const NEEDS_PROBE = ['hysteresis', 'pid', 'deadband'];
// the methods that work out an output % (shown as "45 % ▸ 152")
export const PERCENT_METHODS = ['pid', 'deadband'];

export const isHeatElem = el => el?.type === 'digitalOut' && el.subtype === 'element';

// "PID", "pid", "Duty Cycle", "dutycycle", "DutyC", "HYS", "On/Off", "on off", "DO" ... -> the key (null when it is none of them)
const squash = s => String(s ?? '').toLowerCase().replace(/[\s_/\-]+/g, '');
export function heatMethodKey(v) {
  const s = squash(v);
  if (!s) return null;
  for (const [k, word, code] of HEAT_METHODS) if ([k, word, code].some(x => squash(x) === s)) return k;
  return { onoff: 'onoff', on: 'onoff', digital: 'onoff', digitalout: 'onoff', duty: 'dutyCycle', hyst: 'hysteresis', dband: 'deadband' }[s] ?? null;
}
export const heatMethodWord = k => HEAT_METHODS.find(m => m[0] === k)?.[1] ?? 'On/Off';
export const heatMethodCode = k => HEAT_METHODS.find(m => m[0] === k)?.[2] ?? 'DO';
// the method a Heating Element starts with (its Properties); On/Off when none is set
export const startMethod = el => heatMethodKey(el?.heatMethod) ?? 'onoff';
export const methodChoices = () => HEAT_METHODS.map(m => [m[0], `${m[1]} (${m[3]})`]);
export const methodWords = () => HEAT_METHODS.map(m => m[1]).join(', ');
// Every Device with more than one method of control (Fritz, 2026-11-07: "for things that have more than on method of control
// to choose the one you want to use"): a Process picks one with .method. Today that is the Heating Element; a new kind of Device
// with more than one way of control is added here, and .method, the Process editor's list and Help follow it.
// Returns the words .method takes, or null for a Device with only one way of control.
export const controlMethods = el => isHeatElem(el) ? HEAT_METHODS.map(m => m[1]) : null;

// The settings each method uses: [runtime name, Properties key, label, starting value]. The runtime names are the ones the
// separate Duty Cycle, Hysteresis, PID and Deadband Devices have, so a Process line reads the same (hE_1.target = 152).
export const HEAT_SETTINGS = {
  onoff: [],
  dutyCycle: [['dutycycle', 'dutyCycle', 'Duty cycle %', 0], ['interval', 'interval', 'Cycle time (ms)', 1000]],
  hysteresis: [['target', 'target', 'Target', 0], ['onoffset', 'onOffset', 'On offset (+ heats, - cools)', 1], ['ondelay', 'onDelay', 'On delay (s)', 0]],
  pid: [['target', 'target', 'Target', 0], ['kp', 'kp', 'Kp', 10], ['ki', 'ki', 'Ki', 0.1], ['kd', 'kd', 'Kd', 0], ['maxoutput', 'maxOutput', 'Max output %', 100],
    ['maxintegral', 'maxIntegral', 'Max integral', 100], ['calctime', 'calcTime', 'Calc time (s)', 1], ['outtime', 'outTime', 'Output window (s)', 1]],
  deadband: [['target', 'target', 'Target', 0], ['deadbandoffset', 'deadbandOffset', 'Deadband offset', 0.5], ['innerbandoffset', 'innerBandOffset', 'Inner band offset', 2],
    ['initialoutput', 'initialOutput', 'Initial output %', 0], ['innerbanddrive', 'innerBandDrive', 'Inner band drive %', 1], ['outerbanddrive', 'outerBandDrive', 'Outer band drive %', 5],
    ['maxoutput', 'maxOutput', 'Max output %', 100], ['calctime', 'calcTime', 'Calc time (s)', 10], ['outtime', 'outTime', 'Output window (s)', 2]],
};
// every setting once (the first starting value wins; PID's Calc time 1 s is overridden by Deadband's own when it runs)
export const ALL_HEAT_SETTINGS = (() => {
  const m = new Map();
  for (const list of Object.values(HEAT_SETTINGS)) for (const s of list) if (!m.has(s[0])) m.set(s[0], s);
  return [...m.values()];
})();
// The main setting of each method, shown on the click pop-up with + and -
export const HEAT_MAIN = { dutyCycle: ['dutycycle', 'Duty cycle %'], hysteresis: ['target', 'Target'], pid: ['target', 'Target'], deadband: ['target', 'Target'] };

// A setting's starting value for this method (Calc time and Output window differ between PID and Deadband)
export function heatDefault(method, prop) {
  const own = HEAT_SETTINGS[method]?.find(s => s[0] === prop);
  return own ? own[3] : ALL_HEAT_SETTINGS.find(s => s[0] === prop)?.[3] ?? 0;
}

// BruControl and the old Skynet Schemas had one Device per way of controlling (Rule 6.1's old exception): its type -> method
export const TYPE_METHOD = { digitalOut: 'onoff', dutyCycle: 'dutyCycle', hysteresis: 'hysteresis', pid: 'pid', deadband: 'deadband' };
