// Approved Devices (OakBarn Brewery, 2026-11-14: "Is there a Key that we can add so only an Official skynet Panel can access the
// brain", "Set that up and I will see how painful for a user but internet safety may trump that", Rule 8.6).
// Each browser (phone, tablet, computer) gets its own device cookie, a long random number that never leaves it. Signing in is not
// enough: the device must also be approved by an Admin (Settings > Approved Devices), so a stolen password alone gets nobody in.
// - The Brain's own computer is always approved (an Admin can always approve from there).
// - While no device is approved yet, the first Admin to sign in from your own network (home WiFi or Tailscale) is approved, so a
//   Brain with no screen (a Pi) never locks everyone out. The first Admin setup and the recovery code approve the device too.
// - Removing a device signs it out at once. Only a hash of each device cookie is kept, in data/devices.json.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { onBrainComputer } from './brainstate.js';

export const DEVICE_COOKIE = 'bp_device';
const sha = s => crypto.createHash('sha256').update(String(s)).digest('hex');
const YEARS10 = 10 * 365 * 86400;

// the Brain's own computer: a loopback address with no proxy in between (Rule 6.32's onBrainComputer)
export const isBrainItself = req => onBrainComputer(req.socket?.remoteAddress, req.headers || {});

// a plain name for a device from its browser: "iPhone, Safari", "Windows PC, Edge"
export function deviceName(ua = '') {
  const u = String(ua);
  const what = /iPhone/.test(u) ? 'iPhone' : /iPad/.test(u) ? 'iPad' : /Android/.test(u) ? (/Mobile/.test(u) ? 'Android phone' : 'Android tablet')
    : /Windows/.test(u) ? 'Windows PC' : /Macintosh|Mac OS X/.test(u) ? 'Mac' : /CrOS/.test(u) ? 'Chromebook' : /Linux/.test(u) ? 'Linux computer' : 'Device';
  const br = /Edg\//.test(u) ? 'Edge' : /OPR\//.test(u) ? 'Opera' : /Firefox\//.test(u) ? 'Firefox' : /Chrome\//.test(u) ? 'Chrome' : /Safari\//.test(u) ? 'Safari' : '';
  return br ? `${what}, ${br}` : what;
}

export class Devices {
  constructor(dataDir) {
    this.file = path.join(dataDir, 'devices.json');
    this.dataDir = dataDir;
    try { const j = JSON.parse(fs.readFileSync(this.file, 'utf8')); this.on = j.on !== false; this.list = Array.isArray(j.list) ? j.list : []; }
    catch { this.on = true; this.list = []; }
  }
  save() {
    fs.mkdirSync(this.dataDir, { recursive: true });
    const tmp = this.file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify({ on: this.on, list: this.list }, null, 2), { mode: 0o600 });
    fs.renameSync(tmp, this.file);
  }
  // the device cookie this browser has, or a new one (with the Set-Cookie line to give it)
  idOf(cookies, secure) {
    const have = cookies[DEVICE_COOKIE];
    if (have && /^[A-Za-z0-9_-]{30,100}$/.test(have)) return { token: have, set: null };
    const token = crypto.randomBytes(32).toString('base64url');
    return { token, set: `${DEVICE_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${YEARS10}${secure ? '; Secure' : ''}` };
  }
  find(token) { const h = sha(token); return this.list.find(d => d.id === h) ?? null; }
  approved(token) { return this.find(token)?.state === 'approved'; }
  anyApproved() { return this.list.some(d => d.state === 'approved'); }
  // may this device use the panel? (the switch Off, the Brain's own computer, or approved)
  allowed(req, token) { return !this.on || isBrainItself(req) || (!!token && this.approved(token)); }
  approve(token, user, ua, by) {
    const d = this.find(token);
    if (d) Object.assign(d, { state: 'approved', user: user || d.user, approvedBy: by, approved: new Date().toISOString() });
    else this.list.push({ id: sha(token), key: crypto.randomBytes(6).toString('hex'), name: deviceName(ua), user, state: 'approved', added: new Date().toISOString(), approvedBy: by, approved: new Date().toISOString() });
    this.save();
  }
  // a right password from a device not approved yet: it waits for an Admin (one entry per device; the newest user and time kept)
  ask(token, user, ua, ip) {
    let d = this.find(token);
    if (!d) { d = { id: sha(token), key: crypto.randomBytes(6).toString('hex'), name: deviceName(ua), state: 'waiting', added: new Date().toISOString() }; this.list.push(d); }
    Object.assign(d, { user, ip: String(ip || ''), asked: new Date().toISOString() });
    if (this.list.filter(x => x.state === 'waiting').length > 50) this.list.splice(this.list.findIndex(x => x.state === 'waiting'), 1);     // cap the waiting list
    this.save();
    return d;
  }
  seen(token) { const d = this.find(token); if (d && d.state === 'approved') { const now = Date.now(); if (!d.seenMs || now - d.seenMs > 3600e3) { d.seenMs = now; d.seen = new Date(now).toISOString(); this.save(); } } }
  // what Settings shows (never the hash)
  view(myToken) {
    const mine = myToken ? sha(myToken) : '';
    return { on: this.on, list: this.list.map(({ id, seenMs, ...d }) => ({ ...d, thisDevice: id === mine })) };
  }
  setState(key, state, by) {
    const d = this.list.find(x => x.key === key); if (!d) throw new Error('No such device');
    if (state === 'approved') Object.assign(d, { state, approvedBy: by, approved: new Date().toISOString() });
    else this.list.splice(this.list.indexOf(d), 1);      // Refuse or Remove: gone; it can ask again with the right password
    this.save();
  }
  rename(key, name) { const d = this.list.find(x => x.key === key); if (!d) throw new Error('No such device'); d.name = String(name || '').trim().slice(0, 60) || d.name; this.save(); }
  setOn(on) { this.on = !!on; this.save(); }
}
