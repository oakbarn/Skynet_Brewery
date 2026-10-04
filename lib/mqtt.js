// MQTT link: shares Globals and Devices with an MQTT broker (for example Mosquitto on the Pi),
// and announces them to Home Assistant so Google Home, Alexa and Apple Home (Siri) can use them.
// Built-in MQTT 3.1.1 client: nothing extra to install.
import net from 'node:net';
import tls from 'node:tls';
import { EventEmitter } from 'node:events';
import { plain, toBool, toStr } from './values.js';

// ---------------------------------------------------------------- tiny MQTT 3.1.1 client
const enc = s => { const b = Buffer.from(String(s), 'utf8'); const l = Buffer.alloc(2); l.writeUInt16BE(b.length); return Buffer.concat([l, b]); };
function varLen(n) { const out = []; do { let d = n % 128; n = Math.floor(n / 128); if (n > 0) d |= 128; out.push(d); } while (n > 0); return Buffer.from(out); }
const packet = (type, flags, body) => Buffer.concat([Buffer.from([(type << 4) | flags]), varLen(body.length), body]);

export class MqttClient extends EventEmitter {
  // opts: host, port, tls, username, password, clientId, keepalive (s), will {topic, payload, retain}
  constructor(opts) {
    super();
    this.o = { port: opts.tls ? 8883 : 1883, keepalive: 30, ...opts };
    this.sock = null; this.connected = false; this.closed = false;
    this.buf = Buffer.alloc(0); this.nextId = 1; this.subs = new Set(); this.timer = null; this.retryMs = 2000;
  }
  start() { this.closed = false; this._open(); return this; }
  _open() {
    if (this.closed) return;
    const { host, port } = this.o;
    const s = this.o.tls ? tls.connect({ host, port, servername: host, rejectUnauthorized: this.o.tlsVerify !== false }) : net.createConnection({ host, port });
    this.sock = s;
    s.setTimeout(10000, () => s.destroy(new Error('No answer from the broker at ' + host + ':' + port)));
    s.once(this.o.tls ? 'secureConnect' : 'connect', () => s.write(this._connectPacket()));
    s.on('data', d => this._data(d));
    s.on('error', e => { this.error = e.message; });
    s.on('close', () => {
      const was = this.connected; this.connected = false; this.sock = null; clearInterval(this.timer);
      if (was) this.emit('offline'); this.emit('status');
      if (!this.closed) { setTimeout(() => this._open(), this.retryMs); this.retryMs = Math.min(this.retryMs * 2, 30000); }
    });
  }
  _connectPacket() {
    const o = this.o; let flags = 0x02;                      // clean session
    const payload = [enc(o.clientId)];
    if (o.will) { flags |= 0x04 | (o.will.retain ? 0x20 : 0) | ((o.will.qos ?? 0) << 3); payload.push(enc(o.will.topic), enc(o.will.payload)); }
    if (o.username) { flags |= 0x80; payload.push(enc(o.username)); }
    if (o.username && o.password) { flags |= 0x40; payload.push(enc(o.password)); }
    const ka = Buffer.alloc(2); ka.writeUInt16BE(o.keepalive);
    return packet(1, 0, Buffer.concat([enc('MQTT'), Buffer.from([4, flags]), ka, ...payload]));
  }
  _data(d) {
    this.buf = Buffer.concat([this.buf, d]);
    for (;;) {
      if (this.buf.length < 2) return;
      let len = 0, mul = 1, i = 1, b;
      do { if (i >= this.buf.length) return; b = this.buf[i++]; len += (b & 127) * mul; mul *= 128; } while (b & 128);
      if (this.buf.length < i + len) return;
      const head = this.buf[0], body = this.buf.subarray(i, i + len);
      this.buf = this.buf.subarray(i + len);
      this._packet(head >> 4, head & 15, body);
    }
  }
  _packet(type, flags, body) {
    if (type === 2) {                                         // CONNACK
      const rc = body[1];
      if (rc !== 0) {
        this.error = ['', 'broker does not support MQTT 3.1.1', 'client id refused', 'broker unavailable', 'wrong user name or password', 'not authorised'][rc] ?? 'refused (' + rc + ')';
        this.emit('status'); this.sock?.destroy(); return;
      }
      this.sock.setTimeout(0);
      this.connected = true; this.error = ''; this.retryMs = 2000; this.emit('status');
      this.timer = setInterval(() => this.sock?.write(Buffer.from([0xc0, 0])), this.o.keepalive * 500);
      if (this.subs.size) this._subscribe([...this.subs]);
      this.emit('connect');
    } else if (type === 3) {                                  // PUBLISH
      const tl = body.readUInt16BE(0), topic = body.subarray(2, 2 + tl).toString('utf8');
      let p = 2 + tl; const qos = (flags >> 1) & 3;
      if (qos > 0) { const id = body.readUInt16BE(p); p += 2; this.sock?.write(packet(4, 0, Buffer.from([id >> 8, id & 255]))); }
      this.emit('message', topic, body.subarray(p).toString('utf8'), { retain: !!(flags & 1) });
    }
  }
  _subscribe(topics) {
    const id = this.nextId = (this.nextId % 65535) + 1;
    const parts = [Buffer.from([id >> 8, id & 255])];
    for (const t of topics) parts.push(enc(t), Buffer.from([0]));
    this.sock?.write(packet(8, 2, Buffer.concat(parts)));
  }
  subscribe(topic) { this.subs.add(topic); if (this.connected) this._subscribe([topic]); }
  unsubscribe(topic) {
    this.subs.delete(topic); if (!this.connected) return;
    const id = this.nextId = (this.nextId % 65535) + 1;
    this.sock.write(packet(10, 2, Buffer.concat([Buffer.from([id >> 8, id & 255]), enc(topic)])));
  }
  publish(topic, payload, { retain = false } = {}) {
    if (!this.connected) return false;
    this.sock.write(packet(3, retain ? 1 : 0, Buffer.concat([enc(topic), Buffer.from(String(payload), 'utf8')])));
    return true;
  }
  end() {
    this.closed = true; clearInterval(this.timer);
    if (this.sock) { try { if (this.connected) this.sock.write(Buffer.from([0xe0, 0])); } catch { } this.sock.end(); }
    this.connected = false;
  }
}

// ---------------------------------------------------------------- what is shared and what may be changed
export const SHARED_TYPES = ['global', 'digitalOut', 'switch', 'digitalIn', 'temperature', 'analogIn', 'timer', 'alarm'];
const READ_ONLY_TYPES = ['digitalIn', 'temperature', 'analogIn'];

// Defaults when an element has no entry in config.mqtt.items:
//  - Voice assistants see temperatures, inputs, outputs (as on/off status), timers, alarms and read-only Globals (message panels, step status).
//  - Over MQTT, Globals can be changed (same as the web API). Outputs, switches and timers cannot until "Can change" is ticked.
//  - Shared variables are never shared.
export function itemDefaults(el) {
  return { voice: el.type !== 'global' || !!el.readOnly, control: el.type === 'global' && !el.readOnly };
}
export function itemRule(store, el) {
  const set = store.config.mqtt?.items?.[el.name] ?? {}, d = itemDefaults(el);
  return {
    voice: set.voice ?? d.voice,
    control: READ_ONLY_TYPES.includes(el.type) ? false : (set.control ?? d.control),
  };
}

// Keep only the ticks that differ from the defaults, so config stays short and new elements get the safe defaults.
export function cleanItems(store, items) {
  const out = {};
  for (const [name, set] of Object.entries(items ?? {})) {
    const el = store.get(name); if (!el || !SHARED_TYPES.includes(el.type)) continue;
    const d = itemDefaults(el), keep = {};
    for (const k of ['voice', 'control']) if (typeof set?.[k] === 'boolean' && set[k] !== d[k]) keep[k] = set[k];
    if (Object.keys(keep).length) out[name] = keep;
  }
  return out;
}

const slug = s => String(s).trim().replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'x';
const topicName = s => String(s).replace(/[/+#]/g, '_');

export class MqttBridge extends EventEmitter {
  constructor(store, engine, opts = {}) {
    super();
    this.store = store; this.engine = engine; this.hw = opts.hw;
    this.client = null; this.pending = new Map(); this.flushTimer = null;
    this.byTopic = new Map(); this.lastError = ''; this.discovery = new Set();
    store.on('change', (name, prop) => this._changed(name, prop));
    store.on('config', () => this.restart());
    engine.on('scripts', () => { clearTimeout(this._st); this._st = setTimeout(() => this._publishScripts(), 200); });
  }

  get cfg() { return this.store.config.mqtt ?? {}; }
  get base() { return slug(this.cfg.baseTopic || 'brewpanel'); }
  status() {
    const c = this.cfg;
    if (!c.enabled) return { state: 'off', text: 'MQTT is off' };
    if (this.client?.connected) return { state: 'on', text: `Connected to ${c.host}:${this.client.o.port}` };
    return { state: 'error', text: `Not connected to ${c.host || '(no broker set)'}` + (this.client?.error ? ': ' + this.client.error : '') };
  }

  start() {
    const c = this.cfg;
    if (!c.enabled || !c.host) { this.emit('status'); return; }
    this.client = new MqttClient({
      host: c.host, port: c.port || undefined, tls: !!c.tls, username: c.username || '', password: c.password || '',
      clientId: c.clientId || `brewpanel_${this.base}_${Math.random().toString(16).slice(2, 8)}`,
      will: { topic: `${this.base}/status`, payload: 'offline', retain: true },
    });
    this.client.on('status', () => this.emit('status'));
    this.client.on('connect', () => this._online());
    this.client.on('message', (t, p, f) => this._message(t, p, f).catch(e => this._say(`MQTT: ${e.message}`)));
    this.client.subscribe(`${this.base}/set/+`);
    this.client.subscribe(`${this.base}/cmd/#`);
    this.client.start();
  }
  stop() {
    if (this.client) { this.client.publish(`${this.base}/status`, 'offline', { retain: true }); this.client.end(); }
    this.client = null; this.emit('status');
  }
  restart() {
    const key = JSON.stringify(this.cfg) + JSON.stringify(this.store.list().map(e => [e.name, e.type, e.displayName, e.readOnly, e.units]));
    if (key === this._key && this.client) return this._online();   // layout edit: re-announce, keep the connection
    this._key = key; this.stop(); this.start();
  }
  _say(m) { this.engine.print?.('system', m); }

  shared() { return this.store.list().filter(e => SHARED_TYPES.includes(e.type)); }

  _online() {
    const c = this.client;
    this.byTopic.clear();
    for (const el of this.shared()) this.byTopic.set(topicName(el.name), el.name);
    c.publish(`${this.base}/status`, 'online', { retain: true });
    for (const el of this.shared()) this._publishEl(el.name);
    this._publishScripts();
    this._announce();
  }

  // ---- outgoing values ----
  payload(name) {
    const el = this.store.get(name), r = this.store.snapshotOne(name);
    switch (el.type) {
      case 'digitalOut': case 'switch': case 'digitalIn': return r.state ? 'ON' : 'OFF';
      case 'alarm': return r.active ? 'ON' : 'OFF';
      case 'timer': return toStr(r.value);
      default: {
        const v = this.store.getProp(name, 'value');
        if (typeof v === 'boolean') return v ? 'ON' : 'OFF';
        if (typeof v === 'number') return toStr(v, el.precision ?? r.precision ?? undefined);
        return toStr(plain(v));
      }
    }
  }
  _publishEl(name) {
    if (!this.client?.connected) return;
    const el = this.store.get(name); if (!el || !SHARED_TYPES.includes(el.type)) return;
    this.client.publish(`${this.base}/state/${topicName(name)}`, this.payload(name), { retain: true });
    if (el.type === 'timer') this.client.publish(`${this.base}/state/${topicName(name)}/running`, this.store.getProp(name, 'running') ? 'ON' : 'OFF', { retain: true });
  }
  _changed(name, prop) {
    if (!this.client?.connected) return;
    const el = this.store.get(name);
    if (!el || !SHARED_TYPES.includes(el.type) || !['value', 'state', 'active', 'running'].includes(prop)) return;
    this.pending.set(name, true);
    this.flushTimer ??= setTimeout(() => { this.flushTimer = null; for (const n of this.pending.keys()) this._publishEl(n); this.pending.clear(); }, 500);
  }
  _publishScripts() {
    if (!this.client?.connected) return;
    const running = [...this.engine.running.keys()].sort();
    this.client.publish(`${this.base}/scripts/running`, running.length ? running.join(', ') : 'none', { retain: true });
  }

  // ---- incoming commands ----
  async _message(topic, text) {
    const pre = this.base + '/';
    if (!topic.startsWith(pre)) { this._discoverySeen?.(topic, text); return; }
    const rest = topic.slice(pre.length);
    if (rest.startsWith('set/')) return this.setFromMqtt(this.byTopic.get(rest.slice(4)) ?? rest.slice(4), text);
    if (rest === 'cmd/stopall') { this.engine.stopAll(); this._say('MQTT: stopped all scripts'); return; }
    let m = /^cmd\/script\/(.+)\/(start|stop)$/.exec(rest);
    if (m) {
      const name = m[1];
      if (!this.engine.exists(name)) return this._say(`MQTT: no script "${name}"`);
      if (m[2] === 'stop') { this.engine.stop(name); return; }
      if (!(this.cfg.scripts ?? []).includes(name)) return this._say(`MQTT: starting "${name}" is not allowed (Settings > MQTT and voice)`);
      this.engine.start(name, 'mqtt'); return;
    }
    m = /^cmd\/timer\/(.+)\/(start|stop|reset)$/.exec(rest);
    if (m) {
      const name = this.byTopic.get(m[1]) ?? m[1], el = this.store.get(name);
      if (!el || el.type !== 'timer') return this._say(`MQTT: no timer "${name}"`);
      if (!itemRule(this.store, el).control) return this._say(`MQTT: "${name}" cannot be changed from MQTT`);
      if (m[2] === 'reset') { this.store.setProp(name, 'running', false, 'mqtt'); this.store.setProp(name, 'value', 0, 'mqtt'); }
      else this.store.setProp(name, 'running', m[2] === 'start', 'mqtt');
    }
  }

  // Returns an error text, or '' when the value was set.
  setFromMqtt(name, text) {
    const el = this.store.get(name);
    const refuse = msg => { this._say('MQTT: ' + msg); this._publishEl(name); return msg; };
    if (!el || !SHARED_TYPES.includes(el.type)) return refuse(`no shared element "${name}"`);
    let v = text.trim();
    try { const j = JSON.parse(v); v = (j && typeof j === 'object' && 'value' in j) ? j.value : j; } catch { }
    // Silencing an alarm is always allowed: it can only make things quieter.
    if (el.type === 'alarm' && !toBool(v)) { this.store.setProp(name, 'active', false, 'mqtt'); return ''; }
    if (!itemRule(this.store, el).control) return refuse(`"${name}" cannot be changed from MQTT or voice (tick "Can change" in Settings > MQTT and voice)`);
    const prop = { digitalOut: 'state', switch: 'state', alarm: 'active', timer: 'value' }[el.type] ?? 'value';
    if (prop === 'state' || prop === 'active') v = toBool(v);
    this.store.setProp(name, prop, v, 'mqtt');
    return '';
  }

  // ---- Home Assistant discovery (voice assistants) ----
  _announce() {
    const c = this.client, ha = this.cfg.homeAssistant ?? {};
    const prefix = slug(ha.prefix || 'homeassistant'), node = this.base;
    const want = new Map();
    if (ha.enabled !== false) for (const [t, body] of this.discoveryConfigs()) want.set(`${prefix}/${t}/${node}/${body.unique_id}/config`, body);
    // Clear entities announced earlier that are no longer wanted. The broker keeps them (retained), so ask it what is there.
    const old = new Set(this.discovery);
    this._discoverySeen = (topic, text) => { if (text && topic.startsWith(prefix + '/')) old.add(topic); };
    const wild = `${prefix}/+/${node}/+/config`;
    c.subscribe(wild);
    clearTimeout(this._annTimer);
    this._annTimer = setTimeout(() => {
      c.unsubscribe(wild); this._discoverySeen = null;
      for (const t of old) if (!want.has(t)) c.publish(t, '', { retain: true });
      for (const [t, body] of want) c.publish(t, JSON.stringify(body), { retain: true });
      this.discovery = new Set(want.keys());
    }, 1500);
  }

  discoveryConfigs() {
    const b = this.base, title = this.store.config.title || 'Brew Panel';
    const device = { identifiers: [`brewpanel_${b}`], name: title, manufacturer: 'OakBarn', model: 'Brew Panel' };
    const common = id => ({ unique_id: `${b}_${slug(id)}`, availability_topic: `${b}/status`, device });
    const out = [];
    for (const el of this.shared()) {
      const rule = itemRule(this.store, el);
      if (!rule.voice) continue;
      const name = el.displayName || el.name, t = topicName(el.name);
      const base = { ...common(el.name), name, state_topic: `${b}/state/${t}` };
      const cmd = `${b}/set/${t}`;
      switch (el.type) {
        case 'temperature': case 'analogIn': {
          const u = el.units ?? '';
          const temp = el.type === 'temperature' || /°|deg|^[CF]$/i.test(u);
          out.push(['sensor', { ...base, unit_of_measurement: temp ? (/C/i.test(u) ? '°C' : '°F') : (u || undefined), device_class: temp ? 'temperature' : undefined, state_class: 'measurement' }]);
          break;
        }
        case 'digitalIn': out.push(['binary_sensor', { ...base }]); break;
        case 'digitalOut': case 'switch':
          out.push(rule.control ? ['switch', { ...base, command_topic: cmd }] : ['binary_sensor', { ...base, device_class: 'running' }]);
          break;
        case 'alarm':
          out.push(['binary_sensor', { ...base, device_class: 'problem' }]);
          out.push(['button', { ...common(el.name + '_silence'), name: `Silence ${name}`, command_topic: cmd, payload_press: 'OFF' }]);
          break;
        case 'timer':
          out.push(['sensor', { ...base, icon: 'mdi:timer-outline' }]);
          if (rule.control) for (const a of ['start', 'stop', 'reset']) out.push(['button', { ...common(`${el.name}_${a}`), name: `${a[0].toUpperCase() + a.slice(1)} ${name}`, command_topic: `${b}/cmd/timer/${t}/${a}` }]);
          break;
        case 'global': {
          const dt = el.dataType;
          if (!rule.control || dt === 'time' || dt === 'datetime') out.push(['sensor', { ...base, unit_of_measurement: dt === 'value' && el.units ? el.units : undefined }]);
          else if (dt === 'bool') out.push(['switch', { ...base, command_topic: cmd }]);
          else if (dt === 'value') out.push(['number', { ...base, command_topic: cmd, min: el.min ?? -100000, max: el.max ?? 100000, step: el.step ?? (el.precision ? 10 ** -el.precision : 1), mode: 'box', unit_of_measurement: el.units || undefined }]);
          else out.push(['text', { ...base, command_topic: cmd, max: 255 }]);
          break;
        }
      }
    }
    out.push(['sensor', { ...common('running_scripts'), name: 'Running scripts', state_topic: `${b}/scripts/running`, icon: 'mdi:script-text-play' }]);
    out.push(['button', { ...common('stop_all_scripts'), name: 'Stop all scripts', command_topic: `${b}/cmd/stopall`, icon: 'mdi:stop-circle' }]);
    for (const s of this.cfg.scripts ?? []) if (this.engine.exists(s)) out.push(['button', { ...common('start_' + s), name: `Start ${s}`, command_topic: `${b}/cmd/script/${s}/start`, icon: 'mdi:play' }]);
    for (const [comp, body] of out) {
      for (const k of Object.keys(body)) if (body[k] === undefined) delete body[k];
      body.default_entity_id = `${comp}.${body.unique_id.toLowerCase()}`;    // suggested Home Assistant entity id
    }
    return out;
  }
}
