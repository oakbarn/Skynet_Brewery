// Data Display (OakBarn Brewery, 2026-11-09, Rule 6.26: "Just have a DataDisplay and able to pick which one"): a Device that has more
// than one value picks which one it shows on the Tab. BruControl had a Primary Value and a Show Secondary Value switch; Skynet lists
// every value the Device has. A Process changes it: Flow_1.display = "Total". Shared by the Panel, the Brain and the BruControl Importer.
import { isHeatElem } from './heatmethod.js';

// [key, the words shown]; the first is the default (what it showed before)
const CTL = [['both', 'Output % and Setpoint'], ['output', 'Output %'], ['reading', 'Reading (its probe)'], ['setpoint', 'Setpoint']];
export const DISPLAY_CHOICES = {
  pid: CTL, deadband: CTL,
  hysteresis: [['both', 'ON / OFF and Setpoint'], ['state', 'ON / OFF'], ['reading', 'Reading (its probe)'], ['setpoint', 'Setpoint']],
  dutyCycle: [['both', 'Duty cycle %'], ['state', 'ON / OFF now']],
  flowMeter: [['both', 'Rate and Total'], ['rate', 'Rate'], ['total', 'Total']],
  scale: [['both', 'Volume and Weight'], ['volume', 'Volume'], ['weight', 'Weight']],
  pwmOut: [['both', 'Value and Volts'], ['value', 'Value'], ['volts', 'Volts (Measured volts)']],
  heat: [['both', 'What it is doing and its Setpoint'], ['output', 'Output % or ON / OFF'], ['reading', 'Reading (its probe)'], ['setpoint', 'Setpoint']],
};
DISPLAY_CHOICES.analogOut = DISPLAY_CHOICES.pwmOut;
const kindOf = el => isHeatElem(el) ? 'heat' : el?.type;
// the choices for this Device, or null when it has only one value to show (an output's Volts only with a Measured volts table)
export function displayChoices(el) {
  const k = kindOf(el), c = DISPLAY_CHOICES[k];
  if (!c) return null;
  if ((k === 'pwmOut' || k === 'analogOut') && !el.voltTable?.length) return null;
  return c;
}
// the key a Process or the Properties gave, by key or by its words (any capitals); throws on a word it doesn't have
export function displayKey(el, v) {
  let t = String(v ?? '').trim().toLowerCase(); if (!t) return '';
  if (t === 'target') t = 'setpoint';      // the old word (Setpoint is the word now)
  const c = displayChoices(el) ?? DISPLAY_CHOICES[kindOf(el)] ?? [];
  const hit = c.find(([k, w]) => k === t ||  w.toLowerCase() === t || w.toLowerCase().replace(/\s*\(.*\)$/, '') === t);
  if (!hit) throw new Error(`"${el?.name}": display must be one of ${c.map(([, w]) => w.replace(/\s*\(.*\)$/, '')).join(', ') || '(nothing: it has one value)'}`);
  return hit[0];
}
// BruControl's Primary Value (a Process's "Flow" value): the value the Data Display shows, for a flow meter its rate or its total
export const primaryFlow = (el, r, display) => (display || el.display) === 'total' ? r.total : r.rate;

// the words for a pick (for the Properties and the notes)
export const displayWord = (el, k) => (displayChoices(el) ?? DISPLAY_CHOICES[kindOf(el)] ?? []).find(([key]) => key === k)?.[1] ?? '';
