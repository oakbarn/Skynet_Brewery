// Simulation mode (Settings > Simulation).
// While it is on, every board is replaced by the simulator, so nothing real is switched: the panel, the
// processes, timers and alarms run exactly as on brew day, but heaters, pumps and valves are only pretend.
// Time can run faster (speed), skip ahead by hand, skip to the next thing a process waits for, or
// skip ahead by itself from the Time jumps table ("5 seconds after tm_Mash starts, jump 50 minutes").
import { EventEmitter } from 'node:events';
import { clock } from './simclock.js';
import { cleanName, PIN_OUTPUTS } from './store.js';
import { parseTime, fmtTime } from './values.js';

export const SPEEDS = [1, 2, 5, 10, 20, 30, 60, 120];
export const JUMP_WHEN = { process: 'A Process starts', timer: 'A timer starts' };

const num = (v, def, lo, hi) => { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : def; };
const secs = v => { const t = parseTime(String(v ?? '').trim()); return t !== null ? Math.max(0, t) : num(v, 0, 0, 7 * 86400); };

export function cleanSimulation(s = {}) {
  return {
    on: !!s.on,
    speed: num(s.speed, 1, 1, 1000),
    lead: num(s.lead, 5, 0, 600),               // "Skip to next event" stops this many seconds before it
    jumps: (Array.isArray(s.jumps) ? s.jumps : []).slice(0, 200).map(j => ({
      on: j.on !== false,
      when: j.when in JUMP_WHEN ? j.when : 'process',
      name: cleanName(String(j.name ?? '')),
      after: num(j.after, 5, 0, 3600),          // real seconds to wait first
      jump: fmtTime(secs(j.jump)),              // how far to jump, hh:mm:ss
      note: String(j.note ?? '').slice(0, 200),
    })).filter(j => j.name),
  };
}

export class Simulation extends EventEmitter {
  constructor({ store, engine, hw }) {
    super();
    this.store = store; this.engine = engine; this.hw = hw;
    this.pending = new Set();       // time jumps waiting for their "after" seconds
    engine.on('started', n => this._trigger('process', n));
    store.on('change', (name, prop, v) => { if (prop === 'running' && v === true && store.get(name)?.type === 'timer') this._trigger('timer', name); });
    clock.on('change', () => this.emit('status'));
  }

  get cfg() { return cleanSimulation(this.store.config.simulation); }

  // Set the clock from the saved settings (at start-up, before the boards are opened)
  apply() {
    const c = this.cfg;
    if (c.on) { clock.active = true; clock.setSpeed(c.speed); }
    else { this._cancel(); if (clock.active || clock.speed !== 1) clock.reset(); }
  }

  status() { return { ...clock.status(), lead: this.cfg.lead }; }

  // Save new settings. Turning simulation on or off stops every process and turns every output off
  // first, so nothing a pretend brew switched on is ever sent to a real board.
  save(body) {
    const was = this.cfg.on, c = cleanSimulation({ ...this.cfg, ...body });
    this.store.config.simulation = c;
    this.store.writeConfig();
    if (c.on !== was) {
      this.engine.stopAll();
      this.allOff();
      this.apply();
      this.hw.restart();
      this.engine.print('simulation', c.on ? 'Simulation mode ON: no real board is switched. Every process was stopped and every output turned off.'
        : 'Simulation mode OFF: real boards are back. Every process was stopped and every output turned off.');
    } else this.apply();
    this.emit('status');
    return c;
  }

  allOff() {
    for (const el of this.store.list()) {
      try {
        if (el.type === 'digitalOut') this.store.setProp(el.name, 'state', false, 'sim');
        else if (['pwmOut', 'analogOut'].includes(el.type)) this.store.setProp(el.name, 'value', 0, 'sim');
        else if (PIN_OUTPUTS.includes(el.type)) this.store.setProp(el.name, 'enabled', false, 'sim');
      } catch { /* an element without that property */ }
    }
  }

  // Jump the clock ahead (simulation mode only)
  skip(ms, why = '') {
    if (!clock.active) throw new Error('Turn on simulation mode first (Settings > Simulation)');
    ms = Math.round(Number(ms) || 0);
    if (ms <= 0) throw new Error('Nothing to skip');
    clock.jump(ms);
    this.engine.print('simulation', `Skipped ahead ${fmtTime(ms / 1000)}${why ? ' - ' + why : ''}`);
    return ms;
  }

  // What happens next by itself: a process sleep ending, a process waiting on a timer, a countdown timer running out
  upcoming() {
    const now = clock.now(), out = this.engine.upcoming(now);
    for (const el of this.store.list('timer')) {
      const r = this.store.rt.get(el.name);
      if (r?.running && r.type === 'countdown' && r.value?.s > 0) out.push({ at: now + r.value.s * 1000, what: `timer "${el.name}" reaches 00:00:00` });
    }
    return out.filter(e => e.at > now).sort((a, b) => a.at - b.at).map(e => ({ ...e, in: Math.round((e.at - now) / 1000) }));
  }

  // Skip to a few seconds ("lead") before the next thing that happens by itself
  skipToNext() {
    const lead = this.cfg.lead * 1000, now = clock.now();
    const next = this.upcoming().find(e => e.at - lead > now + 500);
    if (!next) {
      const soon = this.upcoming()[0];
      throw new Error(soon ? `The next event (${soon.what}) is only ${soon.in} seconds away` : 'Nothing is counting down: no process is sleeping or waiting on a timer, and no countdown timer is running');
    }
    return { skipped: this.skip(next.at - lead - now, 'to just before ' + next.what), next: next.what };
  }

  _trigger(kind, name) {
    if (!clock.active) return;
    for (const j of this.cfg.jumps) {
      if (!j.on || j.when !== kind || j.name.toLowerCase() !== cleanName(name).toLowerCase()) continue;
      const ms = secs(j.jump) * 1000;
      if (!ms) continue;
      const t = setTimeout(() => {
        this.pending.delete(t);
        if (clock.active) try { this.skip(ms, `${JUMP_WHEN[kind].toLowerCase().replace('a ', '')} "${j.name}" + ${j.after} s (Time jumps table)`); } catch { }
      }, j.after * 1000);
      this.pending.add(t);
    }
  }

  _cancel() { for (const t of this.pending) clearTimeout(t); this.pending.clear(); }
}
