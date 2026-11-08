// Hand-set appliance vessels (Fritz, 2026-11-07, Rule 5.39, Help 158): the DigiBoil and the 65 L Brewzilla. Each one heats
// itself and Skynet does not switch any of it: its switches, its set point and its screen are worked by hand. A Process says what
// to set, a pop-up asks the brewer to do it, and the Process waits for Done. Both screens go back to °C every time they are
// turned off, so when the panel works in °F the pop-up gives the set point in °C as well.
//
// Shared by the browser (public/app.js) and the Brain (lib/store.js, lib/engine.js, public/templates.js).
//
// switches: [prop, words on the real appliance]; valves: [key, words, the vessel IP it sits in]; screen: what its screen has
export const APPLIANCES = {
  digiboil: {
    name: 'DigiBoil',
    switches: [['power', 'Power switch'], ['heat', 'Heater switch']],
    valves: [['spigot', 'Spigot (the silver BSP outlet valve)', 'outlet']],
    screen: { onOff: false, run: false },
  },
  brewzilla65: {
    name: 'Brewzilla 65 L',
    switches: [['pump', 'Pump switch'], ['heat', 'Heater 1 switch'], ['heat2', 'Heater 2 switch'], ['heat3', 'Heater 3 switch']],
    valves: [['spigot', 'Spigot (the silver BSP outlet valve)', 'outlet'], ['pumpOut', 'Pump out valve (on the out side of its pump)', 'outlet2']],
    screen: { onOff: true, run: true },
  },
};
export const isAppliance = k => Object.prototype.hasOwnProperty.call(APPLIANCES, k ?? '');
// the things on it a Process can ask for by hand (the screen's On/Off button is .power on the Brewzilla)
export const HAND_PROPS = ['setpoint', 'power', 'heat', 'heat2', 'heat3', 'pump', 'run'];
export const isHandProp = (app, prop) => {
  const a = APPLIANCES[app], p = String(prop ?? '').toLowerCase();
  if (!a) return false;
  if (p === 'setpoint') return true;
  if (p === 'run') return !!a.screen.run;
  if (p === 'power') return a.switches.some(([k]) => k === 'power') || !!a.screen.onOff;
  return a.switches.some(([k]) => k === p);
};
// the words for one of its switches or buttons
export function handWords(app, prop) {
  const a = APPLIANCES[app]; if (!a) return prop;
  const s = a.switches.find(([k]) => k === prop);
  if (s) return s[1];
  if (prop === 'power' && a.screen.onOff) return 'screen On/Off button';
  if (prop === 'run') return 'Run button on its screen';
  return prop;
}
export const fToC = f => (f - 32) * 5 / 9;
export const cToF = c => c * 9 / 5 + 32;
const r1 = x => String(Math.round(x * 10) / 10);
const isF = units => !/c/i.test(String(units || '°F').replace(/[^A-Za-z]/g, ''));
// The set point in both units when the panel works in °F: its screen starts in °C every time it is turned on
// ("152 °F (that is 66.7 °C)"). In °C it is just the °C number.
export function setpointWords(value, units) {
  const v = Number(value);
  if (!Number.isFinite(v)) return String(value);
  return isF(units) ? `${r1(v)} °F (that is ${r1(fToC(v))} °C)` : `${r1(v)} °C`;
}
// what the pop-up says when a Process asks for something by hand. label: the vessel's name on the Tab.
export function handAsk(app, label, prop, value, units) {
  const a = APPLIANCES[app], who = label || a?.name || 'it';
  const p = String(prop).toLowerCase();
  if (p === 'setpoint') {
    const v = Number(value);
    const lines = [`Set the ${who} temperature set point to ${setpointWords(v, units)}.`];
    if (isF(units) && Number.isFinite(v)) lines.push(`Its screen goes back to °C every time it is turned off. Set ${r1(fToC(v))} °C, or switch its screen to °F first and set ${r1(v)} °F.`);
    return lines.join('\n');
  }
  if (p === 'run') return value ? `Press Run on the ${who} screen.` : `Stop the ${who}: press Run on its screen again.`;
  return `Turn the ${who} ${handWords(app, p)} ${value ? 'ON' : 'OFF'}.`;
}
