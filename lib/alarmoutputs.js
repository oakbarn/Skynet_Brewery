// Alarm Digital Outputs (OakBarn Brewery, 2026-11-09, Rule 7.19: "add 2 Items to control", "if blank those do nothing"). An Alarm can
// switch up to 2 Devices with an ON / OFF state (a light, a horn, a relay) together with it: ON while the Alarm is active, OFF when it
// stops. BruControl had one Digital Output; the Importer puts it in slot 1. A blank slot does nothing. Shared by the Brain (server.js)
// and the BruControl Importer.
import { onOffProp } from '../public/semi.js';

export const ALARM_OUTPUT_KEYS = ['digitalOutput1', 'digitalOutput2'];
const clean = n => { const t = String(n ?? '').trim(); return t && t.toLowerCase() !== 'none' ? t : ''; };
// slot 1 (an Alarm imported before 2026-11-09 kept BruControl's in .output) and slot 2; blanks left out
export const alarmOutputs = el => [...new Set([clean(el?.digitalOutput1 ?? el?.output), clean(el?.digitalOutput2)].filter(Boolean))];

export function watchAlarmOutputs(store, { log = () => {} } = {}) {
  store.on('change', (name, prop, v) => {
    if (prop !== 'active') return;
    const el = store.get(name);
    if (el?.type !== 'alarm') return;
    for (const n of alarmOutputs(el)) {
      const d = store.get(n), p = onOffProp(d);
      if (!p) { log(`Alarm ${name}: its Digital Output "${n}" is not a Device with an ON / OFF state, so nothing was switched`); continue; }
      try { store.setProp(n, p, v === true, 'alarm'); } catch (e) { log(`Alarm ${name}: could not switch ${n}: ${e.message}`); }
    }
  });
}
