// The Patron Level (OakBarn Brewery, 2026-11-14: "Set up Patron Level and we will adjust after seeing it in action"; "WE will be
// building the Patron e mail system external to skynet. Patron level might unlock something on Skynet, but those brains would not
// have any patron e mails on them", Rule 12.4, Help 198).
// A Patron gets a Patron code from OakBarn Brewery and an Admin pastes it in Settings > Patron. The Brain checks OakBarn Brewery's
// signature on it (the public half of the key is below; the private half never leaves OakBarn Brewery, tools/patron-code.js) and
// then unlocks the Patron perks until the code's end date. A Patron code holds only a name to show, the level and the end date:
// never an email address. Patron emails (New Releases and the like) are sent by OakBarn Brewery from outside Skynet.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// OakBarn Brewery's Patron key, public half (ed25519). A new key pair: node tools/patron-code.js --new-key
export const PATRON_PUBLIC_KEY = 'MCowBQYDK2VwAyEAr6MOe+7ccXb2jTQlLQAg3VIi2jfgN8o59Cji3VDF2Fw=';
const PREFIX = 'SKYPATRON1';

// The Patron levels and what each unlocks. To be adjusted once OakBarn Brewery has seen it in action.
// perks: done = works in Skynet now; outside = done by OakBarn Brewery outside Skynet; coming = not built yet.
export const PATRON_LEVELS = [
  { key: 'patron', name: 'Patron', price: '$10 every 6 months', perks: [
    { key: 'feature', name: 'Request a Feature', text: 'Ask the OakBarn Brewery team for a new feature, straight from ☰ Menu > Request a Feature.', state: 'done' },
    { key: 'releases', name: 'Email alert for new Releases', text: 'An email when a new Skynet comes out. Sign up on oakbarnbrewery.com; it is sent by OakBarn Brewery, never by your Brain.', state: 'outside' },
    // Panel Update 10, items 4, 5g, 5h (OakBarn Brewery, 2026-11-23: "Brewery Name Becomes a Patron Perk. If Not a Patron Put in Skynet
    // Panel"; picked on a card: build it now, and a non-Patron's new Process gets a Copyright with no name)
    { key: 'breweryname', name: 'Your Brewery Name', text: 'Your Brewery Name on every Tab\'s Menu Bar and the Process Editor, and as the Copyright and "Created by" of every new Process. Not a Patron: the Menu Bar shows Skynet Panel.', state: 'done' },
    { key: 'sendpump', name: 'Send your pump to OakBarn Brewery', text: 'Send a pump you made to become a Skynet pump that every brewer gets (coming with My Pumps).', state: 'coming' },
  ] },
];
export const levelOf = key => PATRON_LEVELS.find(l => l.key === key) ?? null;

// read a Patron code: { ok, name, level, expires, active, error }
export function readCode(code, now = Date.now(), publicKey = PATRON_PUBLIC_KEY) {
  const bad = error => ({ ok: false, active: false, error });
  const parts = String(code ?? '').replace(/\s+/g, '').split('.');
  if (parts.length !== 3 || parts[0] !== PREFIX) return bad('That is not a Patron code. Copy the whole code from the email OakBarn Brewery sent you.');
  let p;
  try {
    const key = crypto.createPublicKey({ key: Buffer.from(publicKey, 'base64'), format: 'der', type: 'spki' });
    if (!crypto.verify(null, Buffer.from(`${parts[0]}.${parts[1]}`), key, Buffer.from(parts[2], 'base64url'))) return bad('That Patron code is not from OakBarn Brewery, or a letter of it was changed.');
    p = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch { return bad('That Patron code is not from OakBarn Brewery, or a letter of it was changed.'); }
  const level = levelOf(p.lvl);
  if (!level || !/^\d{4}-\d{2}-\d{2}$/.test(p.exp || '')) return bad('That Patron code is not for this Skynet. Please ask OakBarn Brewery for a new one.');
  const end = Date.parse(p.exp + 'T23:59:59');
  return { ok: true, name: String(p.n || '').slice(0, 60), level: level.key, levelName: level.name, expires: p.exp, active: now <= end, id: String(p.id || '') };
}

// make a Patron code (OakBarn Brewery only: it needs the private key)
export function makeCode({ name, level = 'patron', expires, privateKeyPem }) {
  if (!levelOf(level)) throw new Error('Unknown level: ' + level);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expires || '')) throw new Error('The end date must look like 2027-05-15');
  const body = Buffer.from(JSON.stringify({ n: String(name || '').slice(0, 60), lvl: level, exp: expires, id: crypto.randomBytes(6).toString('hex') })).toString('base64url');
  const sig = crypto.sign(null, Buffer.from(`${PREFIX}.${body}`), crypto.createPrivateKey(privateKeyPem)).toString('base64url');
  return `${PREFIX}.${body}.${sig}`;
}

// The Patron code this Brain has (data/patron.json)
export class Patron {
  constructor(dataDir) {
    this.file = path.join(dataDir, 'patron.json');
    this.dataDir = dataDir;
    try { this.code = JSON.parse(fs.readFileSync(this.file, 'utf8')).code || ''; } catch { this.code = ''; }
  }
  status(now = Date.now()) {
    const r = this.code ? readCode(this.code, now) : { ok: false, active: false };
    return { ...r, hasCode: !!this.code, levels: PATRON_LEVELS };
  }
  // what the code unlocks now
  has(perk, now = Date.now()) { const s = this.status(now); return !!(s.active && levelOf(s.level)?.perks.some(p => p.key === perk)); }
  set(code) {
    const r = readCode(code);
    if (!r.ok) throw new Error(r.error);
    this.code = String(code).replace(/\s+/g, '');
    this._write();
    return r;
  }
  clear() { this.code = ''; this._write(); }
  _write() {
    fs.mkdirSync(this.dataDir, { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify({ code: this.code }, null, 2), { mode: 0o600 });
  }
}
