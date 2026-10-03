// Hardware devices: Arduino Mega over USB ("serial"), ESP32 over WiFi ("esp32"), or "simulator".
// Mega and ESP32 speak the same line protocol (docs/DEVICE_PROTOCOL.md).
import net from 'node:net';
import { EventEmitter } from 'node:events';

const sleep = ms => new Promise(r => setTimeout(r, ms));

class LineDevice extends EventEmitter {
  constructor(cfg) {
    super();
    this.cfg = cfg; this.name = cfg.name; this.type = cfg.type;
    this.status = 'connecting'; this.info = ''; this.lastRx = 0;
    this.buf = ''; this.closed = false; this.conn = null;
  }
  async open() {
    while (!this.closed) {
      try {
        await this._connect();
        this.status = 'connected'; this.emit('status');
        this.send('HELLO');
        this.emit('connected');
        await new Promise(res => { this._onClose = res; });
      } catch (e) { this.info = e.message; }
      if (this.closed) break;
      this.status = 'disconnected'; this.emit('status');
      await sleep(5000);
    }
  }
  _data(chunk) {
    this.buf += chunk.toString();
    let i;
    while ((i = this.buf.indexOf('\n')) >= 0) {
      const line = this.buf.slice(0, i).trim(); this.buf = this.buf.slice(i + 1);
      if (line) { this.lastRx = Date.now(); this.emit('line', line); }
    }
  }
  _ended() { this.conn = null; this._onClose?.(); }
  close() { this.closed = true; try { this.conn?.destroy?.(); this.conn?.close?.(); } catch { } this._onClose?.(); }
}

class TcpDevice extends LineDevice {          // ESP32 over WiFi
  _connect() {
    return new Promise((res, rej) => {
      const s = net.createConnection({ host: this.cfg.host, port: this.cfg.port ?? 4100 }, () => { this.conn = s; s.setKeepAlive(true, 5000); res(); });
      s.setTimeout(8000, () => s.destroy(new Error('timeout')));
      s.on('data', d => this._data(d));
      s.on('error', e => { this.info = e.message; if (!this.conn) rej(e); });
      s.on('close', () => this._ended());
    });
  }
  send(line) { if (this.conn) this.conn.write(line + '\n'); }
}

let serialMod = null;
export async function loadSerial() {
  if (serialMod !== null) return serialMod;
  try { serialMod = await import('serialport'); } catch { serialMod = false; }
  return serialMod;
}

class SerialDevice extends LineDevice {       // Arduino Mega over USB
  async _connect() {
    const sp = await loadSerial();
    if (!sp) throw new Error('USB serial support not installed: run  npm install serialport');
    await new Promise((res, rej) => {
      const p = new sp.SerialPort({ path: this.cfg.port, baudRate: this.cfg.baud ?? 115200 }, err => err ? rej(err) : res());
      p.on('data', d => this._data(d));
      p.on('close', () => this._ended());
      p.on('error', e => { this.info = e.message; });
      this.conn = p;
    });
    await sleep(2000);                         // a Mega resets when the port opens
  }
  send(line) { if (this.conn?.isOpen) this.conn.write(line + '\n'); }
}

class SimDevice extends EventEmitter {        // no hardware: outputs echo, temperatures move with heaters/coolers
  constructor(cfg) { super(); this.cfg = cfg; this.name = cfg.name; this.type = 'simulator'; this.status = 'connected'; this.info = 'simulator'; }
  open() { this.emit('connected'); }
  send() { }
  close() { }
}

export class Hardware {
  constructor(store) {
    this.store = store; this.devices = new Map(); this.probesSeen = new Map(); // device -> {rom: temp}
    store.on('change', (name, prop, v, source) => this._onChange(name, prop, v, source));
  }

  start() {
    for (const d of this.store.config.devices ?? []) this.add(d);
    this.simTimer = setInterval(() => this._simulate(), 1000);
    this.pingTimer = setInterval(() => { for (const d of this.devices.values()) if (d.status === 'connected') d.send?.('PING'); }, 2000);
  }

  add(cfg) {
    const D = { serial: SerialDevice, esp32: TcpDevice, simulator: SimDevice }[cfg.type];
    if (!D) { console.error(`Device "${cfg.name}": unknown type "${cfg.type}"`); return; }
    const dev = new D(cfg);
    this.devices.set(cfg.name, dev);
    this.probesSeen.set(cfg.name, {});
    dev.on('line', l => this._onLine(dev, l));
    dev.on('connected', () => this._resendOutputs(dev));
    dev.on('status', () => this.store.emit('devices'));
    dev.open();
  }

  stop() { clearInterval(this.simTimer); clearInterval(this.pingTimer); for (const d of this.devices.values()) d.close(); this.devices.clear(); }
  restart() { this.stop(); this.start(); }

  list() {
    return [...this.devices.values()].map(d => ({
      name: d.name, type: d.type, status: d.status, info: d.info,
      port: d.cfg.port, host: d.cfg.host, probes: this.probesSeen.get(d.name),
    }));
  }

  async listPorts() {
    const sp = await loadSerial();
    if (!sp) return { installed: false, ports: [] };
    const ports = await sp.SerialPort.list();
    return { installed: true, ports: ports.map(p => ({ path: p.path, manufacturer: p.manufacturer ?? '', serialNumber: p.serialNumber ?? '' })) };
  }

  _elementsOn(devName) { return this.store.list().filter(e => e.device === devName); }

  _resendOutputs(dev) {
    for (const el of this._elementsOn(dev.name)) {
      if (el.type === 'digitalOut') dev.send?.(`DO ${el.channel} ${this.store.getProp(el.name, 'state') ? 1 : 0}`);
    }
  }

  _onChange(name, prop, v, source) {
    if (source === 'hw' || prop !== 'state') return;
    const el = this.store.get(name);
    if (!el || el.type !== 'digitalOut' || !el.device) return;
    const dev = this.devices.get(el.device);
    if (dev) dev.send?.(`DO ${el.channel} ${v ? 1 : 0}`);
  }

  _onLine(dev, line) {
    const [cmd, a, b] = line.split(/\s+/);
    const set = (match, prop, val) => {
      for (const el of this.store.list()) if (match(el)) this.store.setProp(el.name, prop, typeof val === 'function' ? val(el) : val, 'hw');
    };
    switch ((cmd || '').toUpperCase()) {
      case 'DI': set(e => e.type === 'digitalIn' && e.device === dev.name && String(e.channel) === a, 'state', b === '1'); break;
      case 'DO': set(e => e.type === 'digitalOut' && e.device === dev.name && String(e.channel) === a, 'state', b === '1'); break;
      case 'A': set(e => e.type === 'analogIn' && e.device === dev.name && String(e.channel) === a, 'value', e => scale(e, +b)); break;
      case 'T': {   // OneWire probe by ROM id - not by bus index, so probes can be swapped or moved
        const rom = (a || '').toUpperCase(), t = parseFloat(b);
        this.probesSeen.get(dev.name)[rom] = t;
        set(e => e.type === 'temperature' && String(e.probe || '').toUpperCase() === rom && (!e.device || e.device === dev.name), 'value', e => t + (Number(e.offset) || 0));
        break;
      }
      case 'HELLO': dev.info = line.slice(6); this.store.emit('devices'); break;
      case 'ERR': dev.info = line; this.store.emit('devices'); break;
    }
  }

  _simulate() {
    for (const dev of this.devices.values()) {
      if (dev.type !== 'simulator') continue;
      const amb = dev.cfg.ambient ?? 68;
      for (const el of this._elementsOn(dev.name)) {
        if (el.type !== 'temperature') continue;
        const s = el.sim ?? {};
        let t = this.store.getProp(el.name, 'value');
        if (!t && s.start !== undefined) t = s.start;
        const on = n => n && this.store.has(n) && !!this.store.getProp(n, 'state');
        if (on(s.heater)) t += s.heatRate ?? 1;
        else if (on(s.cooler)) t -= (s.coolRate ?? 1) * Math.max(0.1, (t - (s.coolTo ?? 55)) / 100);
        else t += ((s.ambient ?? amb) - t) * 0.002;
        this.store.setProp(el.name, 'value', Math.round(t * 10) / 10, 'hw');
      }
    }
  }
}

function scale(el, raw) {
  const k = el.scale ?? 1, o = el.offset ?? 0;
  return raw * k + o;
}
