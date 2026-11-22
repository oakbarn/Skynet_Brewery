// The Skynet Brew Timers (OakBarn Brewery, 2026-11-22, Panel Update 9 items 10d and 31, Rule 2.68): skn_Boil_Timer, skn_Mash_Timer and
// skn_Whirlpool_Timer. Skynet owns them (Rule 3.20): they always count down, a Process starts, stops, resets and waits on them, and a
// person sets nothing on them but their Label (☰ Menu > Default settings > Brew Timers). Each shows itself on every screen while it runs
// and hides when it is over. "start skn_Boil_Timer" with nothing set first starts it from the Brew Day value (the loaded Recipe, or the
// ☰ Menu > Default tab while none is): the boil time, the mash steps' times added up, the Whirlpool Minutes. The hop alerts run on the
// Boil Timer (item 31: "Skynet Boil Clock used for Hop Timer, Separate Whirlpool/Chilling Timer").
import { TimeVal } from './values.js';
import { BREW_TIMERS, brewTimerName, brewTimerText } from '../public/brewtimers.js';
export { BREW_TIMERS, isBrewTimer, brewTimerName, brewTimerDefaultLabel, brewTimerText } from '../public/brewtimers.js';

export class BrewTimers {
  // clock: () => ms (the Simulator's clock); brewDay: name -> seconds to start from; labels: () => { name: label }
  constructor({ clock = () => Date.now(), brewDay = () => 0, labels = () => ({}), emit = () => {} } = {}) {
    Object.assign(this, { clock, brewDay, labels, emit });
    this.t = Object.fromEntries(BREW_TIMERS.map(([n]) => [n, { left: 0, running: false, at: 0, set: false }]));
    this.tick = null;
  }
  _t(name) { const n = brewTimerName(name); if (!n) throw new Error(`No Skynet Brew Timer named "${name}"`); return this.t[n]; }
  // seconds left now; a running one that reaches 0 stops there (the boil is over)
  left(name) {
    const t = this._t(name);
    if (!t.running) return t.left;
    const l = t.left - (this.clock() - t.at) / 1000;
    if (l <= 0) { t.left = 0; t.running = false; t.set = false; this._changed(); return 0; }
    return l;
  }
  value(name) { return new TimeVal(Math.max(0, Math.round(this.left(name) * 1000) / 1000)); }
  running(name) { this.left(name); return this._t(name).running; }
  // a Process sets it before it starts (skn_Boil_Timer = 01:00:00); a running one goes on from the new time
  set(name, sec) {
    const t = this._t(name), s = Math.max(0, Number(sec) || 0);
    t.left = s; t.at = this.clock(); t.set = true; this._changed();
  }
  start(name) {
    const t = this._t(name); this.left(name);
    if (t.running) return;
    if (!t.set || !(t.left > 0)) t.left = Math.max(0, Number(this.brewDay(brewTimerName(name))) || 0);
    t.set = true; t.at = this.clock(); t.running = t.left > 0; this._changed();
  }
  stop(name) { const t = this._t(name); t.left = this.left(name); t.running = false; this._changed(); }
  // reset: stopped, and the next start takes the Brew Day value again
  reset(name) { const t = this._t(name); t.left = 0; t.running = false; t.set = false; this._changed(); }
  resetAll() { for (const [n] of BREW_TIMERS) this.reset(n); }
  view() {
    const lb = this.labels() || {};
    return BREW_TIMERS.map(([n, label]) => { const l = this.left(n), t = this.t[n]; return { name: n, label: String(lb[n] || '').trim() || label, running: t.running, left: Math.round(l), text: brewTimerText(l) }; });
  }
  _changed() {
    const any = Object.values(this.t).some(t => t.running);
    if (any && !this.tick) { this.tick = setInterval(() => this._changed(), 1000); this.tick.unref?.(); }
    if (!any && this.tick) { clearInterval(this.tick); this.tick = null; }
    this.emit(this.view());
  }
}
