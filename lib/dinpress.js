// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// On Press (Rule 6.38, Help 235): a physical DIN push button does one thing (OakBarn Brewery, 2026-11-19, Panel Updates 7, sandbox entry 31: "A Physical DIN
// push button that triggers a Process similar to a Process Widget without writing code ... This would only do One Thing"; "I had a Blue
// LED Push Button Din that Advanced like an Override button can ... If not, push ignored. I had a Red one That canceled all alarms. I
// had a yellow one that did a 20 second firehose."). A Digital Input Device picks one of:
//   process  - Run a Process: starts it in the background, as a Process Widget's Start does, and lets it run to its end. A press while
//              it runs is ignored (it never stops it).
//   advance  - Advance: an Override button on the wall (Rule 2.26), set to Any or one Process. It works only when a Process it is set to
//              is held in a wait or sleep; otherwise the press is ignored.
//   alarms   - Cancel all alarms: every Alarm sounding now is turned Off, as a tap on it does.
// Blank (None, the usual) does nothing more than the input already does. A press is the input's count going up from the board (or the
// simulator's tap), so the input type's own lockout, debounce and on delay all apply first. Shared by the Brain (server.js), the panel
// (public/app.js, its Properties) and the BruControl Import (an imported DIN has none).
import { cleanName } from './store.js';
import { onPressOf, pressProcessOf } from '../public/onpress.js';
export { followPressRename } from '../public/onpress.js';

// What one press does now. Returns the words for the Console.
export function pressAction(el, { store, engine }) {
  const what = onPressOf(el), proc = pressProcessOf(el), by = el.name;
  if (what === 'process') {
    if (!proc) return 'pressed: no Process is picked, so nothing was started';
    if (!engine.exists(proc)) return `pressed: the Process "${proc}" is not in the Processes list, so nothing was started`;
    if (engine.running.has(cleanName(proc))) return `pressed: ${proc} is already running, so the press was ignored`;
    const r = engine.start(proc, by);
    return r?.ok === false ? `pressed: ${proc} was not started (${r.msg})` : `pressed: ${proc} started`;
  }
  if (what === 'advance') {
    const names = engine.override(by, proc, { heldOnly: true });
    return names.length ? `pressed: Advance moved on ${names.join(', ')}` : `pressed: no ${proc || 'Process'} is waiting for an Override, so the press was ignored`;
  }
  if (what === 'alarms') {
    const on = (store.config.elements ?? []).filter(a => a?.type === 'alarm' && store.getProp(a.name, 'active') === true).map(a => a.name);
    for (const n of on) { try { store.setProp(n, 'active', false, 'din'); } catch { } }
    return on.length ? `pressed: Cancel all alarms turned Off ${on.join(', ')}` : 'pressed: Cancel all alarms: none was sounding';
  }
  return '';
}

// The Brain: a press of an input with On Press set does its one thing
export function watchDinPresses(store, engine, { log = () => {} } = {}) {
  const last = new Map();
  store.on('change', (name, prop, v, source) => {
    if (prop !== 'count') return;
    const el = store.get(name);
    if (el?.type !== 'digitalIn') return;
    const was = last.get(name) ?? 0, now = Number(v) || 0; last.set(name, now);
    if (source !== 'hw' || now <= was || !onPressOf(el)) return;      // a reset to 0, or a Process setting the count, is not a press
    try { const text = pressAction(el, { store, engine }); if (text) log(`${name} ${text}`); }
    catch (e) { log(`${name} pressed: ${e.message}`); }
  });
}
