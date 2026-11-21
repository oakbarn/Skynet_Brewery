// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Every heater off (OakBarn Brewery, 2026-11-21: "new command heaters_off and turn off all heaters"; "yes match" = all_heaters_off,
// like all_pumps_off; Rule 6.15). Shared by the Process command all_heaters_off (lib/engine.js) and step 1 of Emergency Off
// (lib/hardware.js, Rule 6.41), so both turn off the same things:
//   - every Heating Element (on any method; a PWM or analog Element goes to 0), so its PID, Hysteresis, Duty Cycle or Deadband
//     control stops with it and can't switch it back on (.state is its ON, Rule 6.19);
//   - an older Duty Cycle, Hysteresis, PID or Deadband control is disabled;
//   - a gas burner: its Solenoid Gas Valve closed and its igniter off (as a Flame Out trip, Rule 6.33).
// Nothing else is touched. set(el, prop, value) does the switching; the caller counts or reports.
import { isSgasValve } from '../public/flameout.js';

export const OLD_CONTROLS = ['dutyCycle', 'hysteresis', 'pid', 'deadband'];
export const isHeaterElement = el => el?.subtype === 'element' && ['digitalOut', 'pwmOut', 'analogOut'].includes(el.type);
export const isHeater = el => isHeaterElement(el) || OLD_CONTROLS.includes(el?.type) || isSgasValve(el);

export function heatersOff(elements, set) {
  const done = [], names = new Set(elements.map(e => e.name));
  const hit = (el, prop, v) => { if (set(el, prop, v) !== false && !done.includes(el)) done.push(el); };
  for (const el of elements) {
    if (OLD_CONTROLS.includes(el.type)) hit(el, 'enabled', false);
    else if (isHeaterElement(el)) hit(el, el.type === 'digitalOut' ? 'state' : 'value', el.type === 'digitalOut' ? false : 0);
    else if (isSgasValve(el)) hit(el, 'state', false);
    if ((isHeaterElement(el) || isSgasValve(el)) && el.flameIgniter && names.has(el.flameIgniter)) {
      const ig = elements.find(e => e.name === el.flameIgniter); if (ig) hit(ig, 'state', false);
    }
  }
  return done;
}
