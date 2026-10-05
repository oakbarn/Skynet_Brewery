// Configuration + live element values.
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { coerce, defaultFor, plain, TimeVal, toStr } from './values.js';

export const ELEMENT_TYPES = ['shared', 'vKonstant', 'vAPI', 'digitalOut', 'switch', 'digitalIn', 'temperature', 'analogIn', 'timer', 'alarm', 'label', 'picture',
  'pwmOut', 'dutyCycle', 'hysteresis', 'pid', 'analogOut', 'flowMeter', 'scale', 'manual', 'stepper', 'soundPlayer'];

// Alarm kinds (Fritz, 2026-10-05). Only one sound plays at a time: the lowest priority number wins,
// the others wait (or pause) and play as soon as they are the highest one left.
export const ALARM_KINDS = {
  hop: { priority: 1, label: 'Hop Alarm (1: beats every other sound)' },
  brewflow: { priority: 2, label: 'Brew Flow Alarm (2: end of mash, start of boil ...)' },
  prehop: { priority: 3, label: 'Pre-Hop Alarm (3: a set time before its Hop Alarm)' },
  general: { priority: 4, label: 'General Alarm (4)' },
  sound: { priority: 5, label: 'Sound only (5: music, beeps; pauses for any alarm)' },
};
export const SOUND_TYPES = ['alarm', 'soundPlayer'];
export const SOUND_PLAYER = 'SoundPlayer';         // the built-in Sound Player every Process can use
export const soundPriority = el => el.type === 'soundPlayer' ? 5 : (ALARM_KINDS[el.kind] ?? ALARM_KINDS.general).priority;
// Devices whose readings come from the PLC: scripts cannot set these properties
export const INPUT_PROPS = { digitalIn: ['state', 'raw'], temperature: ['value', 'fault'], analogIn: ['value', 'raw', 'fault'], flowMeter: ['rate'], scale: ['value', 'raw'],
  stepper: ['position', 'steps', 'moving', 'homed'] };

// Variable classes.  vKonstant: every script, set on screen or by script, never API or database.
// vAPI: scripts + API + database, with database triggers. (The old Global class is gone: lib/globals.js moves them.)
// kind -> data type, and the suggested name prefix (a hint only, never enforced)
export const VK_KINDS = {
  graphic: { dataType: 'string', prefix: 'vK_', label: 'Graphic (image file path)' },
  string: { dataType: 'string', prefix: 'vKS_', label: 'String' },
  longstring: { dataType: 'string', prefix: 'vKL_', label: 'Long String (text file)' },
  value: { dataType: 'value', prefix: 'vKV_', label: 'Value' },
  time: { dataType: 'time', prefix: 'vKT_', label: 'Time' },
  datetime: { dataType: 'datetime', prefix: 'vKDT_', label: 'Date Time' },
  bool: { dataType: 'bool', prefix: 'vKB_', label: 'Boolean' },
  switch: { dataType: 'bool', prefix: 'vKSW_', label: 'Switch (slider)' },
  pushbutton: { dataType: 'bool', prefix: 'vKPB_', label: 'Push Button (push and hold)' },
  momentary: { dataType: 'bool', prefix: 'vKMB_', label: 'Momentary Button (100 ms pulse)' },
  // a dropdown: each choice has a Value (what Processes read and trigger on) and a Text (what the dropdown shows)
  list: { dataType: 'value', prefix: 'vKList_', label: 'List (dropdown: Value + Text)' },
};
export const VAPI_KINDS = {
  string: { dataType: 'string', prefix: 'vAS_', label: 'String' },
  value: { dataType: 'value', prefix: 'vAV_', label: 'Value' },
  time: { dataType: 'time', prefix: 'vAT_', label: 'Time' },
  datetime: { dataType: 'datetime', prefix: 'vADT_', label: 'Date Time' },
  bool: { dataType: 'bool', prefix: 'vAB_', label: 'Boolean' },
};
export const isVar = el => el && (el.type === 'shared' || el.type === 'vKonstant' || el.type === 'vAPI');
export const isApiVar = el => el && el.type === 'vAPI';      // in the API and the database
const isButton = el => el.type === 'vKonstant' && (el.kind === 'pushbutton' || el.kind === 'momentary');
const isLong = el => el.type === 'vKonstant' && el.kind === 'longstring';
const isLongFile = el => isLong(el) && !!el.file;
// Elements that drive an output pin on/off (the control ones switch it themselves)
export const PIN_OUTPUTS = ['digitalOut', 'dutyCycle', 'hysteresis', 'pid'];
const STEPPER_COMMANDS = ['target', 'move', 'run', 'stop', 'home', 'reset'];
export const CONTROL_TYPES = ['pwmOut', 'dutyCycle', 'hysteresis', 'pid'];

// Typed runtime properties per element type (lower-case names)
const TYPE_PROPS = {
  shared: { value: null }, vKonstant: { value: null, file: 'string' }, vAPI: { value: null },
  digitalOut: { state: 'bool' }, switch: { state: 'bool' }, digitalIn: { state: 'bool', raw: 'bool', count: 'value', reset: 'bool' },
  temperature: { value: 'value', fault: 'bool' }, analogIn: { value: 'value', raw: 'value', fault: 'bool' },
  analogOut: { value: 'value' }, flowMeter: { rate: 'value', total: 'value' },
  scale: { value: 'value', volume: 'value', raw: 'value', tare: 'bool', calibrate: 'value' },
  // Stepper motor: position / steps / moving / homed come from the board; a script sets target (go to), move (go by),
  // speed (for the next moves), run (keep turning at this speed, 0 = stop), stop, home (find the home switch), reset (here = home position)
  stepper: { position: 'value', steps: 'value', moving: 'bool', homed: 'bool', target: 'value', move: 'value', speed: 'value', run: 'value', stop: 'bool', home: 'bool', reset: 'bool' },
  timer: { value: 'time', running: 'bool', type: 'string', resetvalue: 'time' },
  // playing: this one's sound is the one playing now (set by the panel, never by a Process)
  // at: Hop Alarm sounds when its timer reaches this time; before: a Pre-Hop Alarm sounds this long before its Hop Alarm
  alarm: { active: 'bool', loop: 'bool', sound: 'string', fileindex: 'value', soundmode: 'string', playing: 'bool', at: 'time', before: 'time' },
  // Sound Player: path = the sound file, active = play / stop. It pauses while an alarm sounds and goes on after.
  soundPlayer: { path: 'string', active: 'bool', loop: 'bool', playing: 'bool' },
  label: {}, picture: {},
  // Manual vessel widget (BrewZilla, DigiBoil ...): app only. Scripts tell the brewer what to set by hand, the brewer confirms on screen
  manual: { setpoint: 'value', heat: 'bool', pump: 'bool', timer: 'time', volume: 'value', reading: 'value', message: 'string', waiting: 'bool', confirmed: 'bool' },
  pwmOut: { value: 'value' },
  dutyCycle: { dutycycle: 'value', interval: 'value', state: 'bool' },
  hysteresis: { target: 'value', onoffset: 'value', ondelay: 'value', state: 'bool' },
  pid: { target: 'value', kp: 'value', ki: 'value', kd: 'value', maxoutput: 'value', maxintegral: 'value', calctime: 'value', outtime: 'value', value: 'value', state: 'bool' },
};
const COMMON_PROPS = {
  displayname: 'string', visibility: 'string', background: 'string', image: 'string',
  imageon: 'string', imageoff: 'string', precision: 'value', enabled: 'bool', units: 'string',
};
// config key for each common runtime prop
const CFG_KEY = { displayname: 'displayName', imageon: 'imageOn', imageoff: 'imageOff', type: 'timerType' };
const SOUND_MODES = ['custom', 'default', 'none'];

export const cleanName = n => String(n ?? '').trim();

export class Store extends EventEmitter {
  constructor(configPath, dataDir) {
    super();
    this.configPath = configPath;
    this.dataDir = dataDir;
    this.statePath = path.join(dataDir, 'state.json');
    this.config = null;
    this.els = new Map();     // name -> element definition (from config)
    this.rt = new Map();      // name -> runtime props
    this.warned = new Set();
    this._persistTimer = null;
    this._pulses = new Map();  // momentary buttons waiting to turn off
    this._soundSeq = 0;        // order alarms / sound players were turned on (the newest wins a tie)
    this.setMaxListeners(0);   // every waiting script listens for changes
  }

  load() {
    this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    const c = this.config;
    c.workspaces ??= [{ name: 'Main' }];
    // vessels live on the Equipment tab (Fritz, 2026-10-04)
    if (!c.workspaces.some(w => w.name === 'Equipment')) c.workspaces.push({ name: 'Equipment', width: 1600, height: 900 });
    c.elements ??= []; c.graphics ??= []; c.devices ??= []; c.autostart ??= [];
    c.mediaRoots ??= ['./media'];
    c.probes ??= [];
    migrateProbes(c);
    addSoundPlayer(c);
    let saved = {};
    try { saved = JSON.parse(fs.readFileSync(this.statePath, 'utf8')); } catch { /* first run */ }
    this.els.clear(); this.rt.clear();
    for (const el of c.elements) this._addRuntime(el, saved[cleanName(el.name)]);
  }

  _addRuntime(el, savedValue) {
    el.name = cleanName(el.name);
    if (!ELEMENT_TYPES.includes(el.type)) throw new Error(`Element "${el.name}": unknown type "${el.type}"`);
    if (this.els.has(el.name)) throw new Error(`Duplicate element name "${el.name}"`);
    if (el.type === 'shared') el.dataType ??= 'value';
    if (el.type === 'vKonstant' || el.type === 'vAPI') {
      const kinds = el.type === 'vKonstant' ? VK_KINDS : VAPI_KINDS;
      el.kind ??= 'value';
      if (!kinds[el.kind]) throw new Error(`Element "${el.name}": unknown ${el.type} kind "${el.kind}"`);
      el.dataType = kinds[el.kind].dataType;
    }
    const r = {
      displayname: el.displayName ?? el.name,
      visibility: el.visibility ?? 'visible',
      background: el.background ?? '',
      image: el.image ?? '', imageon: el.imageOn ?? '', imageoff: el.imageOff ?? '',
      precision: el.precision ?? null, enabled: el.enabled ?? (el.type === 'pwmOut' || !CONTROL_TYPES.includes(el.type)), units: el.units ?? '',
    };
    switch (el.type) {
      case 'shared': case 'vAPI': case 'vKonstant': {
        const keep = savedValue !== undefined && el.retain !== false && !isButton(el);
        const init = keep ? savedValue : (isButton(el) ? false : (el.initial ?? defaultFor(el.dataType)));
        r.value = coerce(el.dataType, revive(init), el.precision);
        if (isLong(el)) { r.file = el.file ?? ''; this._readLong(el, r, true); }
        break;
      }
      case 'digitalOut': case 'switch': r.state = !!el.initial; break;
      case 'digitalIn': r.state = !!el.initial; r.raw = false; r.count = 0; r.reset = false; break;
      case 'temperature': r.value = Number(el.initial ?? 0); r.fault = false; break;
      case 'analogIn': r.value = Number(el.initial ?? 0); r.raw = 0; r.fault = false; break;
      case 'analogOut': r.value = Number(el.initial ?? 0); break;
      case 'flowMeter': r.rate = 0; r.total = 0; break;
      case 'scale': r.value = 0; r.volume = 0; r.raw = 0; r.tare = false; r.calibrate = 0; break;
      case 'stepper':
        r.position = 0; r.steps = 0; r.moving = false; r.homed = false; r.target = 0; r.move = 0;
        r.speed = Number(el.maxSpeed) || 1; r.run = 0; r.stop = false; r.home = false; r.reset = false; break;
      case 'timer':
        r.value = coerce('time', el.initial ?? 0); r.running = !!el.initRunning; r.type = el.timerType ?? 'countup';
        r.resetvalue = coerce('time', el.resetValue ?? 0); break;
      case 'alarm':
        r.active = false; r.loop = el.loop ?? false; r.sound = el.sound ?? '';
        r.fileindex = el.fileIndex ?? 1; r.soundmode = el.soundMode ?? (el.sounds ? 'custom' : 'default');
        r.playing = false; r.at = coerce('time', el.at ?? 0); r.before = coerce('time', el.before ?? '00:10:00'); break;
      case 'soundPlayer': r.path = el.path ?? ''; r.active = false; r.loop = el.loop ?? false; r.playing = false; break;
      case 'pwmOut': r.value = Number(el.initial ?? 0); break;
      case 'manual':
        r.setpoint = Number(el.setpoint ?? 0); r.heat = false; r.pump = false; r.timer = coerce('time', 0); r.volume = Number(el.volume ?? 0);
        r.reading = 0; r.message = ''; r.waiting = false; r.confirmed = false; break;
      case 'dutyCycle': r.dutycycle = Number(el.dutyCycle ?? 0); r.interval = Number(el.interval ?? 1000); r.state = false; break;
      case 'hysteresis': r.target = Number(el.target ?? 0); r.onoffset = Number(el.onOffset ?? 0); r.ondelay = Number(el.onDelay ?? 0); r.state = false; break;
      case 'pid':
        r.target = Number(el.target ?? 0); r.value = 0; r.state = false;
        for (const k of ['kp', 'ki', 'kd']) r[k] = Number(el[k] ?? 0);
        r.maxoutput = Number(el.maxOutput ?? 100); r.maxintegral = Number(el.maxIntegral ?? 100);
        r.calctime = Number(el.calcTime ?? 1); r.outtime = Number(el.outTime ?? 1); break;
    }
    this.els.set(el.name, el);
    this.rt.set(el.name, r);
  }

  // ---- media folders: images and text files are paths that must be inside one of them ----
  mediaRoots() { return (this.config?.mediaRoots ?? ['./media']).map(r => path.resolve(path.dirname(this.configPath), '..', r)); }
  resolveMedia(p) {
    if (!p) return null;
    const roots = this.mediaRoots();
    const full = path.isAbsolute(p) ? path.resolve(p) : path.resolve(roots[0], p);
    const norm = s => process.platform === 'win32' ? s.toLowerCase() : s;
    if (!roots.some(r => norm(full).startsWith(norm(r + path.sep)) || norm(full) === norm(r))) return null;
    return full;
  }

  // A media path that exists: upper/lower case is ignored (BruControl ran on Windows, so "Wave/X.WAV" finds "wave/x.wav"),
  // and the picture folder renamed from oakbarn to Images (2026-10-05) still answers to either name.
  findMedia(p) {
    const full = this._findMedia(p);
    if (!full || fs.existsSync(full)) return full;
    const m = /^(\.?[\\/])?(oakbarn|images)([\\/].*)$/i.exec(String(p).trim());
    if (m) {
      const alt = this._findMedia((/^oakbarn$/i.test(m[2]) ? 'Images' : 'oakbarn') + m[3]);
      if (alt && fs.existsSync(alt)) return alt;
    }
    return full;
  }
  _findMedia(p) {
    const full = this.resolveMedia(p);
    if (!full || fs.existsSync(full)) return full;
    const root = this.mediaRoots().find(r => full.startsWith(r + path.sep));
    if (!root) return full;
    let cur = root;
    for (const part of path.relative(root, full).split(path.sep)) {
      let names; try { names = fs.readdirSync(cur); } catch { return full; }
      const hit = names.find(n => n === part) ?? names.find(n => n.toLowerCase() === part.toLowerCase());
      if (!hit) return full;
      cur = path.join(cur, hit);
    }
    return cur;
  }

  // Long String vKonstants: the value is the text of a file. Re-read when the file changes (checked at most once a second).
  _readLong(el, r, quiet) {
    r._checked = Date.now();
    if (!r.file) return;
    const f = this.resolveMedia(r.file);
    if (!f) { if (!quiet) this.emit('warn', `"${el.name}": ${r.file} is not inside a media folder (Settings > Media folders)`); return; }
    try {
      const st = fs.statSync(f);
      if (st.mtimeMs === r._mtime) return;
      r._mtime = st.mtimeMs;
      const text = fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, '');
      if (text !== r.value) { r.value = text; if (!quiet) this.emit('change', el.name, 'value', text, 'file'); }
    } catch { r._mtime = undefined; }
  }
  _writeLong(el, r, text) {
    if (!r.file) return;
    const f = this.resolveMedia(r.file);
    if (!f) throw new Error(`"${el.name}": ${r.file} is not inside a media folder (Settings > Media folders)`);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, text);
    try { r._mtime = fs.statSync(f).mtimeMs; } catch { }
  }
  pollFiles() {
    for (const el of this.els.values()) if (isLong(el)) { const r = this.rt.get(el.name); if (Date.now() - (r._checked ?? 0) >= 1000) this._readLong(el, r); }
  }

  has(name) { return this.els.has(cleanName(name)); }
  get(name) { return this.els.get(cleanName(name)); }
  list(type) { return [...this.els.values()].filter(e => !type || e.type === type); }

  propType(el, prop) {
    const tp = TYPE_PROPS[el.type] ?? {};
    if (prop in tp) return tp[prop] ?? el.dataType;
    if (prop in COMMON_PROPS) return COMMON_PROPS[prop];
    return undefined;
  }

  getProp(name, prop) {
    name = cleanName(name); prop = prop.toLowerCase();
    const el = this.els.get(name);
    if (!el) throw new Error(`Element not found: "${name}"`);
    const r = this.rt.get(name);
    if (prop === 'state' && !('state' in r) && 'active' in r) prop = 'active';
    if (prop === 'state' && isVar(el) && el.dataType === 'bool') prop = 'value';
    if (prop === 'value' && el.type === 'stepper') prop = 'position';      // a stepper's value is where it is
    if (prop === 'value' && isLong(el) && Date.now() - (r._checked ?? 0) >= 1000) this._readLong(el, r);
    if (!(prop in r)) {
      if (prop === 'value' && 'state' in r) return r.state;
      throw new Error(`"${name}" has no property "${prop}"`);
    }
    return r[prop];
  }

  setProp(name, prop, value, source = 'script') {
    name = cleanName(name); prop = prop.toLowerCase();
    const el = this.els.get(name);
    if (!el) throw new Error(`Element not found: "${name}"`);
    const r = this.rt.get(name);
    if (prop === 'state' && !('state' in r) && 'active' in r) prop = 'active';
    if (prop === 'value' && !('value' in r) && 'state' in r) prop = 'state';
    if (prop === 'state' && isVar(el) && el.dataType === 'bool') prop = 'value';
    if (prop === 'value' && el.type === 'stepper') prop = source === 'hw' ? 'position' : 'target';   // setting a stepper's value moves it there
    if (prop === 'file' && !isLong(el)) throw new Error(`"${name}" has no property "file" (only Long String vKonstants have one)`);
    const t = this.propType(el, prop);
    let v;
    if (t) v = coerce(t, value, prop === 'value' ? r.precision : undefined);
    else {
      v = value;
      const key = el.type + '.' + prop;
      if (!this.warned.has(key)) { this.warned.add(key); this.emit('warn', `"${name}": property "${prop}" is not used by ${el.type} elements (stored but ignored)`); }
    }
    if (prop === 'visibility') v = toStr(v).trim().toLowerCase() === 'hidden' ? 'hidden' : 'visible';
    // BruControl: "alarm" sound = Custom / Default / None picks where the sound comes from
    if (el.type === 'alarm' && prop === 'sound' && SOUND_MODES.includes(toStr(v).trim().toLowerCase())) { prop = 'soundmode'; v = toStr(v).trim().toLowerCase(); }
    if (prop === 'soundmode') v = toStr(v).trim().toLowerCase();
    if (prop === 'playing' && source !== 'sound') throw new Error(`"${name}" playing is set by the panel (only one sound plays at a time); set "${name}" to true or false instead`);
    if (prop === 'path' && el.type === 'soundPlayer' && v && !this.resolveMedia(v)) this.emit('warn', `"${name}": ${v} is not inside a media folder, so it cannot be played`);
    if (INPUT_PROPS[el.type]?.includes(prop) && source === 'script' && el.device) {
      throw new Error(`"${name}" is an input from ${el.device} and cannot be set by a process`);
    }
    if (prop === 'value' && isLong(el) && v !== r.value) this._writeLong(el, r, v);
    if (prop === 'value' && el.type === 'vKonstant' && el.kind === 'graphic' && v && !this.resolveMedia(v)) this.emit('warn', `"${name}": ${v} is not inside a media folder, so it cannot be shown`);
    const old = r[prop];
    r[prop] = v;
    // a stepper command counts every time it is given ("go to 30" again after it was turned by hand or homed)
    if (!sameValue(old, v) || (el.type === 'stepper' && source !== 'hw' && STEPPER_COMMANDS.includes(prop))) {
      this.emit('change', name, prop, v, source);
      if (isVar(el) && prop === 'value' && !isButton(el)) this._schedulePersist();
    }
    if (prop === 'file' && !sameValue(old, v)) { r._mtime = undefined; this._readLong(el, r); }
    if (SOUND_TYPES.includes(el.type) && !sameValue(old, v)) {
      if (prop === 'active') r._since = ++this._soundSeq;
      if (['active', 'soundmode', 'sound', 'path', 'fileindex'].includes(prop)) this.arbitrateSound();
      if (prop === 'at' || prop === 'before') r._left = undefined;
    }
    // Momentary button: true for a moment (100 ms unless set), then off again
    if (prop === 'value' && v === true && el.type === 'vKonstant' && el.kind === 'momentary') {
      clearTimeout(this._pulses.get(name));
      this._pulses.set(name, setTimeout(() => { this._pulses.delete(name); if (this.rt.get(name) === r) this.setProp(name, 'value', false, 'pulse'); }, Math.max(10, Number(el.pulseMs) || 100)));
    }
    return v;
  }

  snapshotOne(name) {
    const r = this.rt.get(name); const o = {};
    for (const [k, v] of Object.entries(r)) if (k[0] !== '_') o[k] = plain(v);
    return o;
  }
  snapshot() { const o = {}; for (const n of this.els.keys()) o[n] = this.snapshotOne(n); return o; }

  // ---- timers ----
  tickTimers(dtSec) {
    for (const el of this.els.values()) {
      if (el.type !== 'timer') continue;
      const r = this.rt.get(el.name);
      if (!r.running) continue;
      if (r.type === 'countdown') {
        let s = r.value.s - dtSec;
        if (s <= 0) { s = 0; this.setProp(el.name, 'running', false, 'timer'); }
        this.setProp(el.name, 'value', new TimeVal(s), 'timer');
      } else this.setProp(el.name, 'value', new TimeVal(r.value.s + dtSec), 'timer');
    }
    this.tickHopAlarms();
  }

  // ---- alarms and sounds ----
  // A sound element makes a sound when it is on and has a sound file (an alarm set to Sound = None makes none).
  hasSound(el) {
    const r = this.rt.get(el.name);
    if (el.type === 'soundPlayer') return !!r.path;
    return r.soundmode !== 'none' && (r.soundmode === 'default' || !!(el.sounds?.[(r.fileindex || 1) - 1] || r.sound || el.sound));
  }
  // Only one sound at a time: the lowest priority number plays, the newest one wins a tie; the rest wait.
  arbitrateSound() {
    let best = null;
    for (const el of this.els.values()) {
      if (!SOUND_TYPES.includes(el.type)) continue;
      const r = this.rt.get(el.name);
      if (!r.active || !this.hasSound(el)) continue;
      const p = soundPriority(el);
      if (!best || p < best.p || (p === best.p && r._since > best.r._since)) best = { el, r, p };
    }
    for (const el of this.els.values()) {
      if (!SOUND_TYPES.includes(el.type)) continue;
      const play = best?.el === el;
      if (this.rt.get(el.name).playing !== play) this.setProp(el.name, 'playing', play, 'sound');
    }
    return best?.el.name ?? null;
  }
  // Time left until a Hop Alarm's timer reaches its "at" time (null when it has no timer)
  hopLeft(el) {
    const t = el.timer && this.els.get(cleanName(el.timer));
    if (!t || t.type !== 'timer') return null;
    const tr = this.rt.get(t.name), at = this.rt.get(el.name).at?.s ?? 0;
    return { left: tr.type === 'countdown' ? tr.value.s - at : at - tr.value.s, running: tr.running };
  }
  // Hop Alarms with a timer sound when it reaches their time; a Pre-Hop Alarm sounds "before" earlier (10 minutes unless set)
  tickHopAlarms() {
    for (const el of this.els.values()) {
      if (el.type !== 'alarm' || !['hop', 'prehop'].includes(el.kind)) continue;
      const r = this.rt.get(el.name);
      const hop = el.kind === 'hop' ? el : this.els.get(cleanName(el.hopAlarm ?? ''));
      const h = hop?.type === 'alarm' ? this.hopLeft(hop) : null;
      if (!h) { r._left = undefined; continue; }
      const left = h.left - (el.kind === 'prehop' ? (r.before?.s ?? 600) : 0);
      // fire once, when the time left goes from above zero to zero or less while the timer runs
      if (h.running && r._left !== undefined && r._left > 0 && left <= 0) this.setProp(el.name, 'active', true, 'timer');
      r._left = left;
    }
  }

  // ---- persistence of variable values ----
  _schedulePersist() {
    clearTimeout(this._persistTimer);
    this._persistTimer = setTimeout(() => this.persistNow(), 1500);
  }
  persistNow() {
    const o = {};
    for (const el of this.els.values()) {
      if (isVar(el) && !isButton(el) && !isLongFile(el)) { const v = this.rt.get(el.name).value; o[el.name] = v?.toJSON ? v.toJSON() : v; }
    }
    fs.mkdirSync(this.dataDir, { recursive: true });
    fs.writeFileSync(this.statePath, JSON.stringify(o, null, 1));
  }

  // ---- layout / element edits from the browser ----
  saveLayout(update) {
    const c = this.config;
    if (update.workspaces) c.workspaces = update.workspaces;
    if (update.graphics) c.graphics = update.graphics;
    if (update.probes) c.probes = cleanProbes(update.probes);
    if (update.elements) {
      // validate first, then rebuild runtime keeping current values where the element still exists
      const names = new Set();
      for (const el of update.elements) {
        const n = cleanName(el.name);
        if (!n) throw new Error('Element with empty name');
        if (names.has(n)) throw new Error(`Duplicate element name "${n}"`);
        if (!ELEMENT_TYPES.includes(el.type)) throw new Error(`Element "${n}": unknown type "${el.type}"`);
        names.add(n);
      }
      const keep = new Map();
      for (const [n, r] of this.rt) keep.set(n, r);
      // a scale's tare is set by the scale itself (Tare button, auto tare), not by the layout editor
      for (const el of update.elements) { const old = this.els.get(cleanName(el.name)); if (el.type === 'scale' && old?.type === 'scale' && old.tareRaw !== undefined) el.tareRaw = old.tareRaw; }
      c.elements = update.elements;
      addSoundPlayer(c);
      this.els.clear(); this.rt.clear();
      for (const el of c.elements) {
        this._addRuntime(el);
        const old = keep.get(el.name);
        if (old) {
          const r = this.rt.get(el.name);
          for (const k of ['value', 'state', 'active', 'playing', 'path', 'running', 'total', 'count', 'raw', 'setpoint', 'heat', 'pump', 'timer', 'volume', 'reading', 'message', 'waiting', 'position', 'steps', 'homed', 'moving', 'target']) {
            if (!(k in old && k in r) || (k === 'value' && (isLongFile(el) || isButton(el)))) continue;
            r[k] = (k === 'value' && isVar(el)) ? coerce(el.dataType, old[k], el.precision) : old[k];
          }
        }
      }
      this.persistNow();
      for (const r of this.rt.values()) if ('playing' in r) r._since ??= 0;
      this.arbitrateSound();
    }
    migrateProbes(c);
    this.writeConfig();
    this.emit('config');
  }

  writeConfig() {
    if (fs.existsSync(this.configPath)) fs.copyFileSync(this.configPath, this.configPath + '.bak');
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
  }
}

// OneWire probe index: numbered slots that temperature elements point to (probeIndex).
// The probe's ROM id is set on the slot, so a probe is replaced by giving the slot the new ROM id.
function cleanProbes(list) {
  const out = [], idx = new Set(), roms = new Set();
  for (const p of list) {
    const index = Number(p.index);
    if (!Number.isInteger(index) || index < 1) throw new Error(`OneWire probe index must be a whole number from 1 up (got "${p.index}")`);
    if (idx.has(index)) throw new Error(`OneWire probe index ${index} is used twice`);
    const rom = String(p.rom ?? '').trim().toUpperCase();
    if (rom && !/^[0-9A-F]{16}$/.test(rom)) throw new Error(`OneWire probe ${index}: ROM id must be 16 hex digits`);
    if (rom && roms.has(rom)) throw new Error(`ROM id ${rom} is in two OneWire slots`);
    idx.add(index); if (rom) roms.add(rom);
    out.push({ index, name: String(p.name ?? '').trim(), rom, ...(p.device ? { device: p.device } : {}) });
  }
  return out.sort((a, b) => a.index - b.index);
}

// Older configs put the ROM id on the element: give each such probe a slot in the index
function migrateProbes(c) {
  for (const el of c.elements) {
    if (el.type !== 'temperature' || (el.sensor && el.sensor !== 'ds18b20') || !el.probe || el.probeIndex) continue;
    const rom = String(el.probe).toUpperCase();
    let slot = c.probes.find(p => p.rom === rom);
    if (!slot) { slot = { index: Math.max(0, ...c.probes.map(p => p.index)) + 1, name: el.name, rom }; c.probes.push(slot); }
    el.probeIndex = slot.index; delete el.probe;
  }
}

// Every panel has one Sound Player named SoundPlayer (not on any tab) that every Process can use
function addSoundPlayer(c) {
  if (!c.elements.some(e => cleanName(e.name) === SOUND_PLAYER)) c.elements.push({ name: SOUND_PLAYER, type: 'soundPlayer', builtIn: true });
}

function revive(v) {
  if (v && typeof v === 'object') {
    if ('time' in v) return new TimeVal(v.time);
    if ('datetime' in v) return new Date(v.datetime).toISOString();
  }
  return v;
}

function sameValue(a, b) {
  if (a === b) return true;
  if (a && b && typeof a === 'object' && typeof b === 'object') return a.toString() === b.toString();
  return false;
}

export { CFG_KEY };
