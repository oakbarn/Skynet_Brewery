// Conversions for Devices (elements tied to a PLC port): analog signals, temperature probes, outputs.
// Pure functions so they can be tested without hardware.

// ---- temperature ----
export const TEMP_SENSORS = ['ds18b20', 'pt100', 'pt1000', 'thermocouple', 'ntc'];
export const isCelsius = units => /c/i.test(String(units ?? '')) && !/f/i.test(String(units ?? ''));
const cToUnits = (c, units) => isCelsius(units) ? c : c * 9 / 5 + 32;

// PT100 / PT1000 on a MAX31865 board: raw is the board's 15-bit ratio (0-32767), rref its reference resistor
const CVD_A = 3.9083e-3, CVD_B = -5.775e-7;
export function rtdCelsius(raw, r0, rref) {
  const r = raw / 32768 * rref;
  const x = 1 - r / r0;
  const c = (-CVD_A + Math.sqrt(CVD_A * CVD_A - 4 * CVD_B * x)) / (2 * CVD_B);   // Callendar-Van Dusen, good to about ±0.1 °C over brewing temps
  return Number.isFinite(c) ? c : NaN;
}

// NTC thermistor on an analog pin, series resistor to Vcc and thermistor to GND (Beta equation)
export function ntcCelsius(raw, { r0 = 10000, beta = 3950, series = 10000, adcMax = 1023, toVcc = false } = {}) {
  if (!(raw > 0 && raw < adcMax)) return NaN;                      // open or shorted probe
  const r = toVcc ? series * (adcMax - raw) / raw : series * raw / (adcMax - raw);
  return 1 / (1 / 298.15 + Math.log(r / r0) / beta) - 273.15;
}

// A temperature reading in the element's units with its calibration offset; NaN = probe fault
export function temperatureFrom(el, kind, reading) {
  let c;
  switch (kind) {
    case 'T': return Number(reading) + (Number(el.offset) || 0);                                  // DS18B20, already °F from the firmware
    case 'RTD': {
      const pt1000 = el.sensor === 'pt1000';
      c = rtdCelsius(Number(reading), Number(el.r0) || (pt1000 ? 1000 : 100), Number(el.rref) || (pt1000 ? 4300 : 430));
      break;
    }
    case 'TC': c = Number(reading); break;                                                       // MAX31855 / MAX31856 report °C
    case 'A': c = ntcCelsius(Number(reading), { r0: Number(el.r0) || 10000, beta: Number(el.beta) || 3950, series: Number(el.series) || 10000, adcMax: Number(el.adcMax) || 1023, toVcc: el.wiring === 'toVcc' }); break;
    default: return NaN;
  }
  if (!Number.isFinite(c) || c < -200 || c > 1800) return NaN;
  return cToUnits(c, el.units) + (Number(el.offset) || 0);
}

// ---- analog inputs ----
// signal: what the sensor sends. raw = old scale/offset behaviour.
export const ANALOG_SIGNALS = ['raw', '0-5V', '0.5-4.5V', '1-5V', '0-10V', '4-20mA', '0-20mA', 'twoPoint'];
const num = (v, d) => (v === undefined || v === null || v === '' || !Number.isFinite(+v)) ? d : +v;

// returns { value, fault }
export function analogFrom(el, raw) {
  raw = Number(raw);
  const sig = el.signal || 'raw';
  if (sig === 'raw') return { value: raw * num(el.scale, 1) + num(el.offset, 0), fault: false };
  if (sig === 'twoPoint') {          // two readings taken in known conditions, e.g. pH 4 and pH 7 buffers
    const r1 = num(el.cal1Raw, 0), v1 = num(el.cal1Value, 0), r2 = num(el.cal2Raw, 1023), v2 = num(el.cal2Value, 1023);
    const v = r2 === r1 ? v1 : v1 + (raw - r1) * (v2 - v1) / (r2 - r1);
    return { value: v + num(el.offset, 0), fault: false };
  }
  const ads = el.adc === 'ads1115';                        // ADS1115 board at gain 2/3: 0-32767 = 0-6.144 V
  const volts = raw / num(el.adcMax, ads ? 32767 : 1023) * num(el.vref, ads ? 6.144 : 5);
  let frac, fault = false;
  switch (sig) {
    case '0-5V': frac = volts / 5; break;
    case '0.5-4.5V': frac = (volts - 0.5) / 4; fault = volts < 0.25 || volts > 4.75; break;   // most pressure transducers
    case '1-5V': frac = (volts - 1) / 4; fault = volts < 0.8; break;
    case '0-10V': frac = volts * num(el.divider, 2) / 10; break;                              // divider brings 10 V down to the pin's 5 V
    case '4-20mA': case '0-20mA': {
      const mA = volts / num(el.shunt, 250) * 1000;                                            // 250 ohm resistor: 20 mA = 5 V
      frac = sig === '4-20mA' ? (mA - 4) / 16 : mA / 20;
      fault = sig === '4-20mA' && (mA < 3.6 || mA > 21);                                       // broken wire or shorted sensor
      break;
    }
    default: frac = volts / 5;
  }
  const lo = num(el.rangeLow, 0), hi = num(el.rangeHigh, 100);
  return { value: lo + frac * (hi - lo) + num(el.offset, 0), fault };
}

// ---- outputs ----
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// PWM output: value is percent 0-100, the pin gets 0-255
export const pwmDuty = pct => Math.round(clamp(Number(pct) || 0, 0, 100) * 255 / 100);
// Analog output (0-10 V / 4-20 mA module): value in the element's range, the device gets 0-1000 (per mille of full scale)
export function analogOutLevel(el, value) {
  const lo = num(el.rangeLow, 0), hi = num(el.rangeHigh, 100);
  return Math.round(clamp(hi === lo ? 0 : (Number(value) - lo) / (hi - lo), 0, 1) * 1000);
}

// ---- pulse flow meters ----
// The firmware sends a running pulse count; returns {total, rate} given the previous reading
export function flowFrom(el, count, prev, now) {
  const ppu = num(el.pulsesPerUnit, 450) || 450;
  if (!prev) return { delta: 0, rate: 0 };
  let d = count - prev.count;
  if (d < 0) d = count;                                  // the device restarted and its count went back to 0
  const dt = (now - prev.t) / 60000;                     // minutes
  return { delta: d / ppu, rate: dt > 0 ? d / ppu / dt : 0 };
}

// ---- scales (load cells on HX711 boards) ----
// Net weight from the summed raw counts of the vessel's cells, and the liquid volume it holds.
// volume = weight / (water density x specific gravity). Water: 8.3454 lb per US gallon, 0.9982 kg per liter (at about 68 °F).
export const LB_PER_KG = 2.20462;
const WATER = { gal: 8.3454 / LB_PER_KG, L: 0.9982 };   // kg per gallon / liter
export function scaleFrom(el, rawSum, sg = 1) {
  const cpu = num(el.countsPerUnit, 0) || 1;
  const weight = (rawSum - num(el.tareRaw, 0)) / cpu + num(el.offset, 0);      // in the element's weight units
  const kg = (el.weightUnits || 'lb') === 'kg' ? weight : weight / LB_PER_KG;
  const g = Number(sg) > 0.5 && Number(sg) < 2 ? Number(sg) : 1;                    // ignore nonsense (e.g. an unset Global)
  return { weight, volume: kg / (WATER[el.volumeUnits === 'L' ? 'L' : 'gal'] * g) };
}
// counts per weight unit, from a reading with a known weight on the scale
export function scaleCalibration(el, rawSum, knownWeight) {
  const w = Number(knownWeight);
  return w > 0 ? (rawSum - num(el.tareRaw, 0)) / w : undefined;
}
