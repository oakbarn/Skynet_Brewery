// Boil temperature from the air pressure (Panel Updates entry 16, Rules 1.18 and 2.27).
// Water boils cooler when the air pressure is low (high up, or a storm coming), so a Process can't just wait for 212 °F.
// The Brain reads the airport's weather report (METAR) for the ICAO code in ☰ Menu > Default settings > Boil temperature and works out the
// Skynet internal Globals below. Used by the Brain (lib/boiltemp.js, lib/engine.js) and the browser (Settings, predictive
// text, colors). No imports. Data is kept metric (°C, hPa, metres); Units only change what is shown.

export const STD_HPA = 1013.25;          // standard air at sea level

// The Skynet internal Globals (skn_): set by Skynet, read only in a Process
export const SKN_GLOBALS = [
  ['skn_Boil_Temp', 'the temperature water boils at here and now, in the panel\'s Units (°F for US, °C for Metric)'],
  ['skn_Boil_Temp_C', 'the temperature water boils at here and now, in °C'],
  ['skn_Boil_Temp_F', 'the temperature water boils at here and now, in °F'],
  ['skn_Air_Pressure', 'the air pressure at the brewery now, in hPa'],
  // Rule 1.35 (OakBarn Brewery, 2026-11-26): which Process started this one, so a shared Process needs no code in a gGlobal
  ['skn_Started_By', 'the name of the Process that started this one with start (blank when a person, a button or the Brain started it)'],
];
const SKN = new Map(SKN_GLOBALS.map(([n]) => [n.toLowerCase(), n]));
export const isSknGlobal = name => SKN.has(String(name ?? '').toLowerCase());
export const sknName = name => SKN.get(String(name ?? '').toLowerCase());

export const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;
export const cToF = c => c * 9 / 5 + 32;

// The temperature water boils at for an air pressure in hPa (Antoine equation for water, good from 1 to 100 °C)
export function boilC(hpa) {
  const mmHg = hpa * 0.750061683;
  return 1730.63 / (8.07131 - Math.log10(mmHg)) - 233.426;
}
// An airport's altimeter setting (QNH: its pressure brought down to sea level) taken back up to a height in metres
// (the standard formula for station pressure from the altimeter setting)
export const stationPressure = (qnhHpa, elevM) => (qnhHpa ** 0.190263 - 8.417286e-5 * elevM) ** (1 / 0.190263);
// Standard air at a height in metres (no report: the fallback)
export const stdPressure = elevM => stationPressure(STD_HPA, elevM);
// Real air pressures only (OakBarn Brewery, 2026-11-19: "10.13 would never be a pressue"). A number is read as inches of
// mercury when it is in the inHg range and as hPa when it is in the hPa range; anything else is not an air pressure.
export const INHG_HPA = 33.8638866667;
// An airport's altimeter setting is at sea level: the records are about 870 hPa (25.69 inHg, Typhoon Tip, 1979) and
// 1083.8 hPa (32.01 inHg, Siberia, 1968), with a little room around them.
export const QNH_LIMITS = { hpa: [865, 1085], inHg: [25.5, 32.05] };
// The typed pressure is the air pressure at the brewery itself (station pressure): lower up high, about 600 hPa
// (17.7 inHg) at 4,000 m, so the low end allows a brewery up to about 5,000 m.
export const TYPED_LIMITS = { hpa: [540, 1085], inHg: [15.9, 32.05] };
const inside = (v, [lo, hi]) => v >= lo && v <= hi;
// hPa from a number in either unit, or null when it is not a real air pressure
export function pressureHpa(v, limits = TYPED_LIMITS) {
  const n = Number(v);
  if (v === null || v === '' || !Number.isFinite(n)) return null;
  if (inside(n, limits.inHg)) return n * INHG_HPA;
  if (inside(n, limits.hpa)) return n;
  return null;
}
// A METAR altimeter: hPa, or inches of mercury in older reports; null when it can't be a real pressure (a bad report)
export const toHpa = a => pressureHpa(a, QNH_LIMITS);

// The value of one Skynet internal Global from { boilC, hpa } and the panel's Units ('US' or 'Metric')
export function sknValue(name, now, units = 'US') {
  const c = now?.boilC ?? 100, n = sknName(name);
  if (n === 'skn_Boil_Temp') return round(units === 'Metric' ? c : cToF(c), 1);
  if (n === 'skn_Boil_Temp_C') return round(c, 1);
  if (n === 'skn_Boil_Temp_F') return round(cToF(c), 1);
  if (n === 'skn_Air_Pressure') return round(now?.hpa ?? STD_HPA, 1);
  return undefined;
}

// An ICAO airport code: 4 letters (or letters and digits), for example KORD or CYYZ
export const isIcao = s => /^[A-Z][A-Z0-9]{3}$/.test(String(s ?? '').trim().toUpperCase());

// The three plain messages (OakBarn Brewery, 2026-11-16; Postal Code dropped 2026-11-19: the ICAO code is the only way)
export const MSG = {
  badCode: 'Check your Airport code in Skynet Settings.',
  noReport: 'The Pressure is not available from your Airport code set in Skynet Settings.',
  noCode: 'No Airport code in Skynet Settings yet.',
  badPressure: 'That is not an air pressure. Type it in inHg (15.9 to 32.05) or hPa (540 to 1085).',
};
