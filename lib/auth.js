// User accounts, password login and sessions.
// Users live in data/users.json (passwords are salted scrypt hashes, never plain text).
// Sessions live in data/sessions.json (only a hash of each session token is stored).
// The recovery code (for a forgotten password) is stored the same way as a password: hashed, never plain.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const ROLES = ['viewer', 'operator', 'admin'];
export const ROLE_INFO = {
  viewer: 'View only: sees every screen, cannot change anything',
  operator: 'Brew day: switches outputs, sets values, starts and stops scripts',
  admin: 'Everything, including layout, scripts, devices, settings and users',
};
const rank = r => ROLES.indexOf(r);
export const roleAtLeast = (role, need) => rank(role) >= rank(need);

export const COOKIE = 'bp_session';
const SESSION_DAYS = 30;                 // stay signed in this long without use
const MIN_PASSWORD = 8;
const sha = s => crypto.createHash('sha256').update(s).digest('hex');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(String(password), salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
  return { salt, hash };
}
function checkPassword(password, user) {
  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(user.hash, 'hex'));
}
// Recovery code: 16 characters in 4 groups, no look-alike letters (no 0/O, 1/I/L), e.g. K7QM-3XPD-9RTA-WF2H
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function newRecoveryCode() {
  const b = crypto.randomBytes(16);
  const s = Array.from(b, x => CODE_CHARS[x % CODE_CHARS.length]).join('');
  return s.match(/.{4}/g).join('-');
}
const normCode = c => String(c ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');

function cleanUser(name) {
  const n = String(name ?? '').trim();
  if (!/^[A-Za-z0-9 ._@-]{1,40}$/.test(n)) throw new Error('User names use letters, numbers, spaces and . _ @ - (up to 40)');
  return n;
}
function checkNewPassword(p) {
  if (typeof p !== 'string' || p.length < MIN_PASSWORD) throw new Error(`Passwords need at least ${MIN_PASSWORD} characters`);
  if (p.length > 200) throw new Error('That password is too long');
}

// Addresses that are on your own network: this computer, home LAN, or Tailscale (100.64.0.0/10).
export function isPrivateAddress(addr) {
  let a = String(addr ?? '').toLowerCase();
  if (a.startsWith('::ffff:')) a = a.slice(7);
  if (a === '::1') return true;
  if (a.includes(':')) return /^f[cd]/.test(a) || /^fe[89ab]/.test(a);
  const p = a.split('.').map(Number);
  if (p.length !== 4 || p.some(n => !(n >= 0 && n <= 255))) return false;
  return p[0] === 127 || p[0] === 10 || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168)
    || (p[0] === 169 && p[1] === 254) || (p[0] === 100 && p[1] >= 64 && p[1] <= 127);
}

export function parseCookies(header) {
  const out = {};
  for (const part of String(header ?? '').split(';')) {
    const i = part.indexOf('='); if (i < 0) continue;
    const k = part.slice(0, i).trim(); if (!k) continue;
    try { out[k] = decodeURIComponent(part.slice(i + 1).trim()); } catch { /* ignore bad cookie */ }
  }
  return out;
}

// A fingerprint of the panel's program files. It changes whenever a new version is installed.
export function codeFingerprint(root) {
  const h = crypto.createHash('sha256');
  const walk = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) walk(f);
      else { h.update(path.relative(root, f)); h.update(fs.readFileSync(f)); }
    }
  };
  for (const f of ['server.js', 'package.json']) if (fs.existsSync(path.join(root, f))) { h.update(f); h.update(fs.readFileSync(path.join(root, f))); }
  for (const d of ['lib', 'public']) if (fs.existsSync(path.join(root, d))) walk(path.join(root, d));
  return h.digest('hex').slice(0, 16);
}

export class Auth {
  constructor(dataDir) {
    this.usersPath = path.join(dataDir, 'users.json');
    this.sessionsPath = path.join(dataDir, 'sessions.json');
    this.dataDir = dataDir;
    this.users = [];
    this.recovery = null;            // { salt, hash, created } of the recovery code
    this.sessions = new Map();       // sha256(token) -> { user, created, seen }
    this.fails = new Map();          // ip -> { n, until }
    this._saveT = null;
    this.load();
  }

  load() {
    try { const j = JSON.parse(fs.readFileSync(this.usersPath, 'utf8')); this.users = j.users ?? []; this.recovery = j.recovery ?? null; } catch { this.users = []; this.recovery = null; }
    try { this.sessions = new Map(Object.entries(JSON.parse(fs.readFileSync(this.sessionsPath, 'utf8')))); } catch { this.sessions = new Map(); }
    this.prune();
  }
  _write(file, obj) {
    fs.mkdirSync(this.dataDir, { recursive: true });
    const tmp = file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), { mode: 0o600 });
    fs.renameSync(tmp, file);
  }
  saveUsers() { this._write(this.usersPath, { users: this.users, recovery: this.recovery }); }
  saveSessions(now) {
    clearTimeout(this._saveT);
    if (now) { this._saveT = null; this._write(this.sessionsPath, Object.fromEntries(this.sessions)); }
    else this._saveT = setTimeout(() => this.saveSessions(true), 5000);
  }
  flush() { if (this._saveT) this.saveSessions(true); }

  // Testing mode: when a new version of the panel is installed, forget every user, session and recovery code
  // so setup starts fresh. Brew data, logs and config are not touched. Returns true when logins were cleared.
  resetIfNewVersion(fingerprint, enabled) {
    const file = path.join(this.dataDir, 'login-version.txt');
    let last = null; try { last = fs.readFileSync(file, 'utf8').trim(); } catch { /* first start */ }
    let cleared = false;
    if (enabled && last !== fingerprint && (this.users.length || this.sessions.size || this.recovery)) {
      for (const f of [this.usersPath, this.sessionsPath]) fs.rmSync(f, { force: true });
      this.users = []; this.recovery = null; this.sessions = new Map();
      cleared = true;
    }
    if (last !== fingerprint) { fs.mkdirSync(this.dataDir, { recursive: true }); fs.writeFileSync(file, fingerprint + '\n'); }
    return cleared;
  }

  needsSetup() { return !this.users.some(u => u.role === 'admin'); }
  findUser(name) { const n = String(name ?? '').trim().toLowerCase(); return this.users.find(u => u.name.toLowerCase() === n); }
  listUsers() { return this.users.map(u => ({ name: u.name, role: u.role, created: u.created })); }

  addUser(name, password, role) {
    name = cleanUser(name);
    if (!ROLES.includes(role)) throw new Error('Unknown role ' + role);
    if (this.findUser(name)) throw new Error(`There is already a user named "${name}"`);
    checkNewPassword(password);
    this.users.push({ name, role, ...hashPassword(password), created: new Date().toISOString() });
    this.saveUsers();
  }
  setPassword(name, password) {
    const u = this.findUser(name); if (!u) throw new Error('No such user');
    checkNewPassword(password);
    Object.assign(u, hashPassword(password));
    this.saveUsers();
  }
  setRole(name, role) {
    const u = this.findUser(name); if (!u) throw new Error('No such user');
    if (!ROLES.includes(role)) throw new Error('Unknown role ' + role);
    if (u.role === 'admin' && role !== 'admin' && this.users.filter(x => x.role === 'admin').length === 1) throw new Error('Keep at least one admin');
    u.role = role; this.saveUsers();
  }
  removeUser(name) {
    const u = this.findUser(name); if (!u) throw new Error('No such user');
    if (u.role === 'admin' && this.users.filter(x => x.role === 'admin').length === 1) throw new Error('Keep at least one admin');
    this.users = this.users.filter(x => x !== u); this.saveUsers();
    this.endSessionsFor(u.name);
  }

  // ---- recovery code: lets someone at home set a new password when it is forgotten
  recoveryInfo() { return { exists: !!this.recovery, created: this.recovery?.created ?? null }; }
  // Makes a new code (the old one stops working) and returns it. It is shown once; only its hash is kept.
  makeRecoveryCode() {
    const code = newRecoveryCode();
    this.recovery = { ...hashPassword(normCode(code)), created: new Date().toISOString() };
    this.saveUsers();
    return code;
  }
  // Checks the code, sets the new password, signs that user out everywhere, and returns a fresh code
  // (each code works once). Wrong codes count as wrong tries for the throttle.
  recover(name, code, password, ip) {
    const wait = this.blockedFor(ip);
    if (wait) throw new Error(`Too many wrong tries. Wait ${wait} seconds and try again.`);
    if (!this.recovery) throw new Error('This panel has no recovery code yet. Use tools/reset-password.js on the Pi.');
    const u = this.findUser(name);
    const good = checkPassword(normCode(code), this.recovery);
    if (!good || !u) { this._failed(ip); throw new Error('Wrong user name or recovery code'); }
    checkNewPassword(password);
    this.fails.delete(ip);
    this.setPassword(u.name, password);
    this.endSessionsFor(u.name);
    return { name: u.name, code: this.makeRecoveryCode() };
  }

  // ---- login throttling: after 5 wrong tries an address waits, doubling each time (max 15 minutes)
  blockedFor(ip) { const f = this.fails.get(ip); return f && f.until > Date.now() ? Math.ceil((f.until - Date.now()) / 1000) : 0; }
  _failed(ip) {
    const f = this.fails.get(ip) ?? { n: 0, until: 0 }; f.n++;
    if (f.n >= 5) f.until = Date.now() + Math.min(15 * 60e3, 30e3 * 2 ** (f.n - 5));
    this.fails.set(ip, f);
  }

  login(name, password, ip) {
    const wait = this.blockedFor(ip);
    if (wait) throw new Error(`Too many wrong tries. Wait ${wait} seconds and try again.`);
    const u = this.findUser(name);
    // check a dummy hash for unknown users so a wrong name takes as long as a wrong password
    const good = u ? checkPassword(password ?? '', u) : (checkPassword(password ?? '', { salt: 'x', hash: '00'.repeat(64) }), false);
    if (!good) { this._failed(ip); throw new Error('Wrong user name or password'); }
    this.fails.delete(ip);
    return this.newSession(u.name);
  }
  newSession(user) {
    const token = crypto.randomBytes(32).toString('base64url');
    this.sessions.set(sha(token), { user, created: Date.now(), seen: Date.now() });
    this.saveSessions(true);
    return token;
  }
  // Returns { name, role } for a valid session token, or null.
  check(token) {
    if (!token) return null;
    const key = sha(token), s = this.sessions.get(key);
    if (!s) return null;
    const u = this.findUser(s.user);
    if (!u || Date.now() - s.seen > SESSION_DAYS * 864e5) { this.sessions.delete(key); this.saveSessions(); return null; }
    if (Date.now() - s.seen > 60e3) { s.seen = Date.now(); this.saveSessions(); }
    return { name: u.name, role: u.role };
  }
  logout(token) { if (token && this.sessions.delete(sha(token))) this.saveSessions(true); }
  endSessionsFor(name) {
    const n = name.toLowerCase();
    for (const [k, s] of this.sessions) if (s.user.toLowerCase() === n) this.sessions.delete(k);
    this.saveSessions(true);
  }
  prune() { const cut = Date.now() - SESSION_DAYS * 864e5; for (const [k, s] of this.sessions) if (s.seen < cut) this.sessions.delete(k); }

  cookie(token, secure) {
    return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure ? '; Secure' : ''}`;
  }
  clearCookie() { return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`; }
}
