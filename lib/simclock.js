// Simulation clock. Process sleeps, timers, PID / duty cycle and the simulator all read the time from here.
// Normal running: it is the real clock. In simulation mode it can run faster (speed 10 = ten minutes in one)
// and can jump ahead ("skip 50 minutes"), so a brew day can be tried out without waiting for it.
import { EventEmitter } from 'node:events';

const realSleep = ms => new Promise(r => setTimeout(r, ms));

export class SimClock extends EventEmitter {
  constructor() { super(); this.reset(); }

  reset() {                          // back to the real time, normal speed
    this.active = false; this.speed = 1; this.skipped = 0;
    this.anchorReal = Date.now(); this.anchorSim = this.anchorReal;
    this.emit('change');
  }

  now() { return this.anchorSim + (Date.now() - this.anchorReal) * this.speed; }

  setSpeed(x) {
    x = Math.max(1, Math.min(1000, Number(x) || 1));
    const n = this.now(); this.anchorReal = Date.now(); this.anchorSim = n; this.speed = x;
    this.emit('change');
  }

  // Move the clock ahead by ms. Sleeps that end before the new time finish at once, timers move on.
  jump(ms) {
    ms = Math.max(0, Number(ms) || 0);
    if (!ms) return;
    this.anchorSim += ms; this.skipped += ms;
    this.emit('jump', ms); this.emit('change');
  }

  // Wait ms of clock time (follows speed changes and jumps). stop() = give up early.
  // info.until is kept up to date with the clock time the wait ends, so "Skip to next event" can find it.
  async sleep(ms, stop, info = {}) {
    let left = ms; const step = this.stepper();
    try {
      while (left > 0 && !stop?.()) {
        info.until = this.now() + left;
        await realSleep(Math.max(1, Math.min(100, left / this.speed)));
        left -= step();
      }
    } finally { delete info.until; }
  }

  // A function that returns how much clock time (ms) passed since it was last called (never less than 0)
  stepper() {
    let last = this.now();
    return () => { const t = this.now(), d = t - last; last = t; return Math.max(0, d); };
  }

  status() { return { on: this.active, speed: this.speed, skipped: this.skipped, now: this.now() }; }
}

export const clock = new SimClock();
