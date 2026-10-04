// Configuration + live element values.
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { coerce, defaultFor, plain, TimeVal, toStr } from './values.js';

export const ELEMENT_TYPES = ['global', 'shared', 'digitalOut', 'switch', 'digitalIn', 'temperature', 'analogIn', 'timer', 'alarm', 'label', 'picture',
  'pwmOut', 'analogOut', 'flowMeter', 'scale'];
// Devices whose readings come from the PLC: scripts cannot set these properties
export const INPUT_PROPS = { digitalIn: ['state'], temperature: ['value', 'fault'], analogIn: ['value', 'raw', 'fault'], flowMeter: ['rate'], scale: ['value', 'raw'] };

// Typed runtime properties per element type (lower-case names)
const TYPE_PROPS = {
  global: { value: null }, shared: { value: null },
  digitalOut: { state: 'bool' }, switch: { state: 'bool' }, digitalIn: { state: 'bool' },
  temperature: { value: 'value', fault: 'bool' }, analogIn: { value: 'value', raw: 'value', fault: 'bool' },
  pwmOut: { value: 'value' }, analogOut: { value: 'value' }, flowMeter: { rate: 'value', total: 'value' },
  scale: { value: 'value', volume: 'value', raw: 'value', tare: 'bool', calibrate: 'value' },
  timer: { value: 'time', running: 'bool', type: 'string' },
  alarm: { active: 'bool', loop: 'bool', sound: 'string' },
  label: {}, picture: {},
};
const COMMON_PROPS = {
  displayname: 'string', visibility: 'string', background: 'string', image: 'string',
  imageon: 'string', imageoff: 'string', precision: 'value', enabled: 'bool', units: 'string',
};
// config key for each common runtime prop
const CFG_KEY = { displayname: 'displayName', imageon: 'imageOn', imageoff: 'imageOff', type: 'timerType' };

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
  }

  load() {
    this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    const c = this.config;
    c.workspaces ??= [{ name: 'Main' }];
    c.elements ??= []; c.graphics ??= []; c.devices ??= []; c.autostart ??= [];
    c.mediaRoots ??= ['./media'];
    let saved = {};
    try { saved = JSON.parse(fs.readFileSync(this.statePath, 'utf8')); } catch { /* first run */ }
    this.els.clear(); this.rt.clear();
    for (const el of c.elements) this._addRuntime(el, saved[cleanName(el.name)]);
  }

  _addRuntime(el, savedValue) {
    el.name = cleanName(el.name);
    if (!ELEMENT_TYPES.includes(el.type)) throw new Error(`Element "${el.name}": unknown type "${el.type}"`);
    if (this.els.has(el.name)) throw new Error(`Duplicate element name "${el.name}"`);
    if (el.type === 'global' || el.type === 'shared') el.dataType ??= 'value';
    const r = {
      displayname: el.displayName ?? el.name,
      visibility: el.visibility ?? 'visible',
      background: el.background ?? '',
      image: el.image ?? '', imageon: el.imageOn ?? '', imageoff: el.imageOff ?? '',
      precision: el.precision ?? null, enabled: el.enabled ?? true, units: el.units ?? '',
    };
    switch (el.type) {
      case 'global': case 'shared': {
        const init = savedValue !== undefined && el.retain !== false ? savedValue : (el.initial ?? defaultFor(el.dataType));
        r.value = coerce(el.dataType, revive(init), el.precision);
        break;
      }
      case 'digitalOut': case 'switch': case 'digitalIn': r.state = !!el.initial; break;
      case 'temperature': r.value = Number(el.initial ?? 0); r.fault = false; break;
      case 'analogIn': r.value = Number(el.initial ?? 0); r.raw = 0; r.fault = false; break;
      case 'pwmOut': case 'analogOut': r.value = Number(el.initial ?? 0); break;
      case 'flowMeter': r.rate = 0; r.total = 0; break;
      case 'scale': r.value = 0; r.volume = 0; r.raw = 0; r.tare = false; r.calibrate = 0; break;
      case 'timer': r.value = new TimeVal(0); r.running = false; r.type = el.timerType ?? 'countup'; break;
      case 'alarm': r.active = false; r.loop = el.loop ?? false; r.sound = el.sound ?? ''; break;
    }
    this.els.set(el.name, el);
    this.rt.set(el.name, r);
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
    const t = this.propType(el, prop);
    let v;
    if (t) v = coerce(t, value, prop === 'value' ? r.precision : undefined);
    else {
      v = value;
      const key = el.type + '.' + prop;
      if (!this.warned.has(key)) { this.warned.add(key); this.emit('warn', `"${name}": property "${prop}" is not used by ${el.type} elements (stored but ignored)`); }
    }
    if (prop === 'visibility') v = toStr(v).trim().toLowerCase() === 'hidden' ? 'hidden' : 'visible';
    if (INPUT_PROPS[el.type]?.includes(prop) && source === 'script' && el.device) {
      throw new Error(`"${name}" is an input from ${el.device} and cannot be set by a script`);
    }
    const old = r[prop];
    r[prop] = v;
    if (!sameValue(old, v)) {
      this.emit('change', name, prop, v, source);
      if ((el.type === 'global' || el.type === 'shared') && prop === 'value') this._schedulePersist();
    }
    return v;
  }

  snapshotOne(name) {
    const r = this.rt.get(name); const o = {};
    for (const [k, v] of Object.entries(r)) o[k] = plain(v);
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
  }

  // ---- persistence of global/shared values ----
  _schedulePersist() {
    clearTimeout(this._persistTimer);
    this._persistTimer = setTimeout(() => this.persistNow(), 1500);
  }
  persistNow() {
    const o = {};
    for (const el of this.els.values()) {
      if (el.type === 'global' || el.type === 'shared') { const v = this.rt.get(el.name).value; o[el.name] = v?.toJSON ? v.toJSON() : v; }
    }
    fs.mkdirSync(this.dataDir, { recursive: true });
    fs.writeFileSync(this.statePath, JSON.stringify(o, null, 1));
  }

  // ---- layout / element edits from the browser ----
  saveLayout(update) {
    const c = this.config;
    if (update.workspaces) c.workspaces = update.workspaces;
    if (update.graphics) c.graphics = update.graphics;
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
      this.els.clear(); this.rt.clear();
      for (const el of c.elements) {
        this._addRuntime(el);
        const old = keep.get(el.name);
        if (old) {
          const r = this.rt.get(el.name);
          for (const k of ['value', 'state', 'active', 'running', 'total']) if (k in old && k in r) r[k] = (k === 'value' && (el.type === 'global' || el.type === 'shared')) ? coerce(el.dataType, old[k], el.precision) : old[k];
        }
      }
      this.persistNow();
    }
    this.writeConfig();
    this.emit('config');
  }

  writeConfig() {
    if (fs.existsSync(this.configPath)) fs.copyFileSync(this.configPath, this.configPath + '.bak');
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
  }
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
