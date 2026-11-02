// Semi_Widgets_Devices (Fritz, 2026-11-02, Skynet Rule 1.20): a class between a Widget and a Device. It lives only in the app
// like a Widget (no PLC port, Rule 1.2), but it has an on / off .state like a Device:
//   Manual Valve Widget   .state true = open; only a click on it changes it (Rule 5.15), so it never has a Device controlled
//   Switch                slides ON, slides OFF (a tap)
//   Push Button           ON only while held, OFF when let go (Rule 1.9)
//   Pulse Button          one 100 ms ON per tap (Rule 1.9)
//   LED                   a light that shows its .state; set by a Process or by its Device controlled (a tap does nothing)
// Switch, Push Button, Pulse Button and LED have device_controlled (None to start). When it names a Device, the two follow each
// other like a Clone: the Switch slid ON turns the Device ON, and the Device turned OFF (on its own Tab, by a Process, by the
// Brain) slides the Switch OFF. Only a Device with an ON / OFF state can be picked: a digital output, pump or valve a Process can
// switch, or a heater control (Duty Cycle, Hysteresis, PID), which is ON while Enabled (Rule 7.9). Used by lib/store.js and the
// browser (public/app.js).
export const SEMI_CLASS = 'Semi_Widgets_Devices';
// element type -> what it is called, and how a tap works
export const SEMI_KINDS = {
  switch: { title: 'Switch', tap: 'toggle', look: 'switch', w: 110, h: 70, prefix: 'sw_' },
  pushButton: { title: 'Push Button', tap: 'hold', look: 'pushbutton', w: 100, h: 100, prefix: 'pb_' },
  pulseButton: { title: 'Pulse Button', tap: 'pulse', look: 'momentary', w: 100, h: 100, prefix: 'pl_' },
  led: { title: 'LED', tap: 'none', look: 'led', w: 80, h: 80, prefix: 'led_' },
};
export const SEMI_CONTROL_TYPES = Object.keys(SEMI_KINDS);       // the ones with device_controlled
export const SEMI_TYPES = [...SEMI_CONTROL_TYPES, 'manualValve'];
export const isSemi = el => SEMI_TYPES.includes(el?.type);
export const hasDeviceControlled = el => SEMI_CONTROL_TYPES.includes(el?.type);
export const NONE = 'None';
export const PULSE_MS = 100;

const HEATER_CONTROLS = ['dutyCycle', 'hysteresis', 'pid'];
const manualDevice = el => el?.type === 'digitalOut' && el.subtype === 'valve' && el.valveType === 'manual';
// The attribute that is a Device's ON / OFF, or null when it has none a Semi_Widgets_Device may switch. A Manual valve Device is
// turned by hand (a Process waits for its Done, Rule 5.13), and an input is read from its board, so neither can be picked.
export function onOffProp(el) {
  if (!el) return null;
  if (el.type === 'digitalOut') return manualDevice(el) ? null : 'state';
  if (HEATER_CONTROLS.includes(el.type)) return 'enabled';
  return null;
}
export const canControl = el => !!onOffProp(el);
// The Devices a device_controlled dropdown offers, by name (None comes first in the dropdown)
export const controllableNames = elements => (elements ?? []).filter(canControl).map(e => e.name).sort((a, b) => a.localeCompare(b));
// "" / "None" / missing = None
export const controlledName = el => { const n = String(el?.deviceControlled ?? '').trim(); return n && n.toLowerCase() !== 'none' ? n : ''; };

// Checks the device_controlled of every Semi_Widgets_Device in a layout: a name that is not a Device with an ON / OFF state
// is an error (a Device deleted since is put back to None, with a note). Returns { errors, cleared }.
export function checkControlled(elements) {
  const byName = new Map((elements ?? []).map(e => [e?.name, e]));
  const errors = [], cleared = [];
  for (const el of elements ?? []) {
    if (!el || !('deviceControlled' in el)) continue;
    const n = controlledName(el);
    if (!hasDeviceControlled(el)) { delete el.deviceControlled; continue; }
    if (!n) { delete el.deviceControlled; continue; }
    const d = byName.get(n);
    if (!d) { cleared.push([el.name, n]); delete el.deviceControlled; continue; }
    if (!canControl(d)) errors.push(`"${el.name}": Device controlled "${n}" has no ON / OFF state a ${SEMI_KINDS[el.type].title} can switch`);
  }
  return { errors, cleared };
}
