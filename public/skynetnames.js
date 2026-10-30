// Skynet's own names (Fritz, 2026-10-30): used by the Brain (lib/store.js, lib/engine.js, lib/boiltemp.js) and the browser.
//   skn_ = a Skynet internal Global: set by Skynet, read only in a Process (skn_Boil_Temp ...).
//   sk_  = a Skynet role: sk_Boil_Probe_1 stands for the temperature probe given that role on ☰ Menu > Default.
//          The probe is held by its hidden key behind the scenes, so a renamed probe keeps its role (Rule 3.10).
//          In a Process the role name works like the probe's own name: sk_Boil_Probe_1 > 200, sk_Boil_Probe_1.label

// Probe roles and how many of each (Option 2: one probe per role, set by the user)
export const PROBE_ROLES = [
  { role: 'Boil', count: 3, tip: 'the boil kettle' },
  { role: 'Mash', count: 3, tip: 'the mash tun' },
  { role: 'HLT', count: 3, tip: 'the hot liquor tank' },
  { role: 'Ferment', count: 10, tip: 'a fermenter' },
];
export const roleName = (role, n) => `sk_${role}_Probe_${n}`;
export const ROLE_NAMES = PROBE_ROLES.flatMap(r => Array.from({ length: r.count }, (_, i) => roleName(r.role, i + 1)));
const ROLE_SET = new Set(ROLE_NAMES);
export const isRoleName = n => ROLE_SET.has(String(n ?? '').trim());

// Skynet internal Globals: name -> what it holds (all read only)
export const SKN_GLOBALS = {
  skn_Boil_Temp: 'Water boils at this temperature here and now, in the panel\'s units (°F for US, °C for Metric)',
  skn_Boil_Temp_C: 'The same boil temperature in °C',
  skn_Boil_Temp_F: 'The same boil temperature in °F',
  skn_Air_Pressure: 'The air pressure here now, in hPa (millibar), used for the boil temperature',
};
export const isSkn = n => Object.hasOwn(SKN_GLOBALS, String(n ?? '').trim());

// ---- the boil temperature from the air pressure ----
export const STD_HPA = 1013.25;                    // sea level, standard day: water boils at 100 °C (212 °F)
const HPA_PER_INHG = 33.8639;
// Antoine equation for water (1-100 °C and a bit over): log10(P mmHg) = A - B / (C + T)
const A = 8.07131, B = 1730.63, C = 233.426;
export function boilC(hpa) {
  const mmHg = Number(hpa) * 0.750062;
  if (!(mmHg > 0)) return NaN;
  return B / (A - Math.log10(mmHg)) - C;
}
export const cToF = c => c * 9 / 5 + 32;
export const fToC = f => (f - 32) * 5 / 9;
// standard air pressure at a height (m) with no weather: what the panel uses when it can't reach the internet
export const stdPressure = elevM => STD_HPA * Math.pow(1 - 2.25577e-5 * (Number(elevM) || 0), 5.25588);
// An airport gives its altimeter setting (QNH: the pressure brought down to sea level). Taken back up to the
// brewery's own height it is the pressure the kettle feels (the same formula airports use for station pressure).
export const stationPressure = (qnhHpa, elevM) => qnhHpa * Math.pow(1 - 0.0065 * (Number(elevM) || 0) / 288.15, 5.2559);
// an altimeter setting in inches of mercury (USA: 29.92) or in hPa (1013)
export const toHpa = v => { const n = Number(v); return !(n > 0) ? NaN : n < 50 ? n * HPA_PER_INHG : n; };
export const hpaToInHg = hpa => hpa / HPA_PER_INHG;
export const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;
