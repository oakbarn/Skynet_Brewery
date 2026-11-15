// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Brain's Flame Out watch (OakBarn Brewery, 2026-11-14, Rule 6.33, Help 197): about once a second, for every gas burner with its
// Flame Out On, it feeds the burner's probe reading to its FlameWatcher (public/flameout.js). When one trips, the gas valve is turned
// Off (and the burner's igniter), .flameout_tripped is set, a notice goes to every screen (with a sound until it is closed) and a line
// to the Output. Nothing is turned back on by the Brain (Rule 6.31): the brewer checks the flame, lights it and turns it On.
import { isGasBurner, FlameWatcher, flameSettings, TRIP_TEXT } from '../public/flameout.js';
import { isMethodDevice, heatMethodKey, PERCENT_METHODS } from '../public/heatmethod.js';

// Is the gas really flowing now? A Heating Element in Direct: while it is On. In a control method: while its pin is on (.output), or
// for a PWM pin while its % is above 0. A plain Solenoid Gas Valve: while it is On.
export function gasOpen(el, get) {
  if (!get('state')) return false;
  if (!isMethodDevice(el)) return true;
  const m = heatMethodKey(get('method')) ?? 'onoff';
  if (m === 'onoff') return true;
  if (el.pwm && PERCENT_METHODS.includes(m)) return Number(get('value')) > 0;
  return !!get('output');
}

const probeUnits = (store, el) => /c/i.test(String(store.get(el.input)?.units ?? '°F')) ? '°C' : '°F';

export class FlameWatch {
  constructor({ store, notify = () => { }, log = () => { } }) {
    this.store = store; this.notify = notify; this.log = log;
    this.w = new Map();            // name -> FlameWatcher
    this.until = new Map();        // name -> when its pause ends
    this.notices = [];             // [{ id, name, label, text, why, at }] on every screen until closed
    store.on('change', (name, prop, v, source) => {
      if (prop === 'flameout_paused' && source !== 'flamewatch') {
        const n = Number(v) || 0;
        if (n > 0) { this.until.set(name, (this.lastNow ?? Date.now()) + n * 60000); this.w.get(name)?.reset(); this.log(`${name}: Flame Out paused for ${n} minutes`); }
        else this.until.delete(name);
      }
    });
  }
  start(clockNow = () => Date.now()) { this.timer = setInterval(() => this.tick(clockNow()), 1000); }
  stop() { clearInterval(this.timer); }
  list() { return this.notices; }
  close(id) { this.notices = this.notices.filter(n => n.id !== id); this.notify(this.notices); }

  _get(name, prop) { try { return this.store.getProp(name, prop); } catch { return undefined; } }

  tick(now = Date.now()) {
    this.lastNow = now;
    const seen = new Set();
    for (const el of this.store.list()) {
      if (!isGasBurner(el)) continue;
      seen.add(el.name);
      const get = p => this._get(el.name, p);
      const probe = el.input ? this.store.get(el.input) : null;
      const s = flameSettings(el, probe?.units);
      let w = this.w.get(el.name); if (!w) { w = new FlameWatcher(); this.w.set(el.name, w); }
      // a pause counts down by itself (shown in whole minutes left), then the watch starts afresh
      const until = this.until.get(el.name);
      if (until) {
        const left = Math.max(0, Math.ceil((until - now) / 60000));
        if (left !== Number(get('flameout_paused'))) this.store.setProp(el.name, 'flameout_paused', left, 'flamewatch');
        if (now >= until) { this.until.delete(el.name); w.reset(); this.log(`${el.name}: Flame Out watching again`); }
        else continue;
      }
      if (String(get('flameout')).toLowerCase() !== 'on' || !probe) { w.reset(); continue; }
      const bad = this._get(probe.name, 'fault') === true;
      const reading = bad ? NaN : Number(this._get(probe.name, 'value'));
      const hit = w.step(now, reading, gasOpen(el, get), !!get('state'), s);
      if (hit) this.trip(el, hit, reading);
    }
    for (const n of this.w.keys()) if (!seen.has(n)) this.w.delete(n);
  }

  trip(el, hit, reading) {
    const set = (n, p, v) => { try { this.store.setProp(n, p, v, 'control'); } catch (e) { this.log(`${n}: ${e.message}`); } };
    set(el.name, 'state', false);
    if (el.flameIgniter && this.store.has?.(el.flameIgniter) !== false) set(el.flameIgniter, 'state', false);
    set(el.name, 'flameout_tripped', true);
    this.w.get(el.name)?.reset();
    const label = el.label || el.name, at = this.lastNow ?? Date.now();
    const why = `${hit.text} Reading ${Number.isFinite(reading) ? Math.round(reading * 10) / 10 : '?'} ${probeUnits(this.store, el)}.`;
    this.notices = [...this.notices.filter(n => n.name !== el.name), { id: `${el.name}@${at}`, name: el.name, label, text: `${label}: ${TRIP_TEXT}`, why, at }];
    this.log(`FLAME OUT ${el.name}: gas turned off. ${why}`);
    this.notify(this.notices);
  }
}
