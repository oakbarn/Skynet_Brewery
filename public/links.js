// Connection ranking (Fritz, 2026-10-26): how safe each link to the Brain is, by board.
// USB is safest. Ethernet and WiFi depend on the network.
// Heating Devices on a network link are allowed with a warning (Fritz, 2026-10-26); the board turns all outputs OFF
// when it hears nothing from the Brain for the Interface's "lost link" delay (user set, 3 to 600 s, default 10).

export const BOARDS = [['mega', 'Arduino Mega'], ['esp32', 'ESP32'], ['other', 'Other Arduino-type board']];
export const LINK_NAMES = { serial: 'USB', ethernet: 'Ethernet', esp32: 'WiFi', simulator: 'Simulator' };

// level: best, good, ok, poor (best first)
const RANKS = {
  mega: {
    serial: ['best', 'Best: safest, most reliable'],
    ethernet: ['ok', 'OK: depends on the network. If the network fails the board turns all outputs OFF after the lost link delay'],
    esp32: ['poor', 'Poor: WiFi (through an ESP32 bridge) can drop often'],
  },
  esp32: {
    serial: ['best', 'Best: safest, most reliable'],
    ethernet: ['good', 'Good: depends on the network. If the network fails the board turns all outputs OFF after the lost link delay'],
    esp32: ['good', 'Good, as long as no heating Device is on it'],
  },
};
RANKS.other = RANKS.mega;

// An Interface saved before boards were asked: guess from its name (an "ESP..." name is an ESP32, anything else a Mega)
export const boardOf = d => d?.board || (/esp/i.test(d?.name || '') ? 'esp32' : 'mega');
// The real link: a board in the simulator keeps the link it will have on real hardware
export const linkOf = d => d?.type === 'simulator' ? d.realType || '' : d?.type || '';

// Devices that heat: electric elements, burner gas valves and igniters, heat pads, and the outputs of PID, Hysteresis and Duty Cycle
const HEAT_CODES = new Set(['H_PWM', 'H_AO', 'HtPad', 'Ignit', 'G_Vlv']);
export const isHeating = el => !!el && (['pid', 'hysteresis', 'dutyCycle'].includes(el.type) || HEAT_CODES.has(el.typeCode) || el.subtype === 'element');

// { level, text } for an Interface; heating = it has a heating Device on it
export function rating(d, heating = false) {
  const r = RANKS[boardOf(d)]?.[linkOf(d)];
  if (!r) return { level: '', text: '' };
  if (heating && linkOf(d) === 'esp32') return { level: 'poor', text: 'Poor: a heating Device is on a WiFi link' };
  return { level: r[0], text: r[1] };
}

// A heating Device on a network Interface (Ethernet or WiFi) is allowed, with this warning ('' when it is on USB)
export function heatingLinkWarning(el, devices) {
  if (!isHeating(el) || !el.device) return '';
  const d = (devices || []).find(x => x.name === el.device);
  if (!d || !['ethernet', 'esp32'].includes(linkOf(d))) return '';
  return `Warning: ${el.name} heats and ${d.name} is on ${linkOf(d) === 'esp32' ? 'WiFi' : 'Ethernet'}. If the link is lost, the board turns all outputs OFF after ${lostLinkSec(d)} s (set on the Devices page). USB is safest.`;
}

// Lost link delay: seconds of silence from the Brain before the board turns all outputs OFF (the Brain pings every 2 s)
export const LOST_LINK = { min: 3, max: 600, def: 10 };
export function lostLinkSec(d) {
  const n = Math.round(Number(d?.lostLinkSec));
  return Number.isFinite(n) && n > 0 ? Math.min(LOST_LINK.max, Math.max(LOST_LINK.min, n)) : LOST_LINK.def;
}
