// Calibrations on every reading (OakBarn Brewery, 2026-11-09, Rule 6.24: "adding those calibrations are good as they are similar to
// other programs and not proprietary to BruControl"). A reading goes through its calibrations in order, each one working on the result
// of the one before (as BruControl's layered calibrations). Shared by the Brain (lib/control.js, lib/hardware.js), the Panel's
// Properties and the BruControl Importer.

// type -> [the words shown, its settings: [key, label, starting value]]
export const CAL_KINDS = {
  offset: ['Linear Offset (adds a number)', [['offset', 'Offset (+ or -)', 0]]],
  multiplier: ['Linear Multiplier (times a number)', [['multiplier', 'Multiplier', 1]]],
  divider: ['Linear Divider (divided by a number)', [['divider', 'Divider', 1]]],
  floor: ['Floor (never lower than)', [['floor', 'Lowest', 0]]],
  ceiling: ['Ceiling (never higher than)', [['ceiling', 'Highest', 100]]],
  steinhartHart: ['Thermistor (Steinhart-Hart, gives Kelvin)', [['resistor', 'Pad resistor (ohm)', 10000], ['a', 'A', 0.001129148], ['b', 'B', 0.000234125], ['c', 'C', 0.0000000876741]]],
  celsiusToFahrenheit: ['Celsius to Fahrenheit', []],
  fahrenheitToCelsius: ['Fahrenheit to Celsius', []],
  kelvinToFahrenheit: ['Kelvin to Fahrenheit', []],
  fahrenheitToKelvin: ['Fahrenheit to Kelvin', []],
  kelvinToCelsius: ['Kelvin to Celsius', []],
  celsiusToKelvin: ['Celsius to Kelvin', []],
  lookupTable: ['Lookup Table (reading, value pairs)', []],
};
export const CAL_TYPES = Object.keys(CAL_KINDS);

// Straight lines between the pairs [[x, y] ...], sorted by x; outside them the end values. null = no pairs
export function lookup(rows, x) {
  const r = (rows ?? []).filter(p => Array.isArray(p) && Number.isFinite(+p[0]) && Number.isFinite(+p[1])).map(p => [+p[0], +p[1]]).sort((a, b) => a[0] - b[0]);
  if (!r.length) return null;
  if (x <= r[0][0]) return r[0][1];
  for (let i = 1; i < r.length; i++) if (x <= r[i][0]) { const [x0, y0] = r[i - 1], [x1, y1] = r[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0 || 1); }
  return r[r.length - 1][1];
}
// the other way round: the x that gives y (the pairs' y must rise or fall steadily). null = no pairs
export const lookupBack = (rows, y) => lookup((rows ?? []).map(p => [p[1], p[0]]), y);

// raw -> value, each calibration on the result of the one before (a switched-off one is skipped)
export function applyCalibrations(cals, raw) {
  let x = raw;
  for (const c of cals ?? []) {
    if (!c || c.enabled === false) continue;
    const n = (k, d) => Number.isFinite(+c[k]) && c[k] !== '' && c[k] !== null ? +c[k] : d;
    switch (c.type) {
      case 'steinhartHart': {               // thermistor to ground, pad resistor to Vcc, 10-bit ADC (0-1023)
        if (x <= 0 || x >= 1023) return NaN;
        const r = n('resistor', 10000) * x / (1023 - x), ln = Math.log(r);
        x = 1 / (n('a', 0) + n('b', 0) * ln + n('c', 0) * ln ** 3);   // Kelvin
        break;
      }
      case 'kelvinToFahrenheit': x = (x - 273.15) * 9 / 5 + 32; break;
      case 'fahrenheitToKelvin': x = (x - 32) * 5 / 9 + 273.15; break;
      case 'kelvinToCelsius': x = x - 273.15; break;
      case 'celsiusToKelvin': x = x + 273.15; break;
      case 'celsiusToFahrenheit': x = x * 9 / 5 + 32; break;
      case 'fahrenheitToCelsius': x = (x - 32) * 5 / 9; break;
      case 'multiplier': x *= n('multiplier', 1); break;
      case 'divider': { const d = n('divider', 1); if (d) x /= d; break; }
      case 'offset': x += n('offset', 0); break;
      case 'floor': x = Math.max(x, n('floor', n('value', -Infinity))); break;
      case 'ceiling': x = Math.min(x, n('ceiling', n('value', Infinity))); break;
      case 'lookupTable': { const y = lookup(c.rows, x); if (y !== null) x = y; break; }
      default: break;                       // a kind Skynet does not know (kept, not applied)
    }
  }
  return x;
}

// one line of plain words for a calibration, e.g. "Linear Offset: -11"
export function calText(c) {
  const k = CAL_KINDS[c?.type];
  if (!k) return String(c?.type ?? '?');
  const word = k[0].replace(/\s*\(.*\)$/, '');
  const parts = c.type === 'lookupTable' ? [`${(c.rows ?? []).length} pairs`] : k[1].map(([key, label]) => `${k[1].length > 1 ? label.replace(/\s*\(.*\)$/, '') + ' ' : ''}${c[key] ?? '-'}`);
  return `${word}${parts.length ? ': ' + parts.join(', ') : ''}${c.enabled === false ? ' (off)' : ''}`;
}
export const calSummary = cals => cals?.length ? cals.map(calText).join(' → ') : 'none';

// "x, y" pairs, one per line (a Lookup Table or a PWM output's measured volts) <-> [[x, y] ...]
export function pairsFrom(text) {
  const out = [];
  for (const line of String(text ?? '').split(/\r?\n|;/)) {
    const t = line.trim(); if (!t) continue;
    const m = t.split(/[,\t ]+/).filter(Boolean);
    if (m.length !== 2 || !m.every(v => Number.isFinite(+v))) throw new Error(`"${t}": write two numbers, a reading and its value, e.g. 50, 4.6`);
    out.push([+m[0], +m[1]]);
  }
  return out;
}
export const pairsText = rows => (rows ?? []).map(([x, y]) => `${x}, ${y}`).join('\n');

// A PWM or Analog output's measured volts (OakBarn Brewery, 2026-11-09: "a Calibration with Measured Voltage vs PWM % ... the Voltage
// at 255 PWM was not always able to get to 10 Volts on the Output of a DAC"): pairs [its setting (a PWM output: %), volts measured].
// null = none
export const pwmVolts = (el, pct) => el?.voltTable?.length ? lookup(el.voltTable, Number(pct) || 0) : null;
// the setting that gives these volts (a PWM output: 0 to 100 %), or null
export const pwmForVolts = (el, v) => {
  if (!el?.voltTable?.length) return null;
  const p = lookupBack(el.voltTable, Number(v) || 0);
  return p === null ? null : el.type === 'pwmOut' ? Math.max(0, Math.min(100, p)) : p;
};
