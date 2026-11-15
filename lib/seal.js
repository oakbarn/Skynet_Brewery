// Locking (encrypting) the few things the Brain must be able to read back (OakBarn Brewery, 2026-11-14: "Can we encrypt all
// passwords, reset codes and e mails", Rule 8.5). Passwords, recovery codes, sign-in codes and sessions are never kept at all,
// only a one-way scramble (lib/auth.js). What Skynet has to read again to send a message is locked here instead: the email
// account's app password, the Twilio token, and each user's email address and mobile number.
// AES-256-GCM with a random key kept in data/seal.key (made once, readable by the Brain's own account only). A file or backup
// copied without that key cannot be read. A locked value reads "enc:v1:<iv>:<tag>:<data>" (base64). A plain value (from before
// this Rule) is read as it is and is locked the next time its file is saved; the Brain saves both files once on start.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const PREFIX = 'enc:v1:';
const keys = new Map();       // dataDir -> key

function keyFor(dataDir) {
  const dir = path.resolve(dataDir);
  if (keys.has(dir)) return keys.get(dir);
  const file = path.join(dir, 'seal.key');
  let key = null;
  try { const b = Buffer.from(fs.readFileSync(file, 'utf8').trim(), 'base64'); if (b.length === 32) key = b; } catch {}
  if (!key) {
    key = crypto.randomBytes(32);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, key.toString('base64') + '\n', { mode: 0o600 });
  }
  keys.set(dir, key);
  return key;
}

export const isSealed = v => typeof v === 'string' && v.startsWith(PREFIX);

// lock a string (an empty value stays empty, so "not set" still reads as not set)
export function seal(dataDir, value) {
  if (value === undefined || value === null || value === '' || isSealed(value)) return value;
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', keyFor(dataDir), iv);
  const data = Buffer.concat([c.update(String(value), 'utf8'), c.final()]);
  return `${PREFIX}${iv.toString('base64')}:${c.getAuthTag().toString('base64')}:${data.toString('base64')}`;
}

// read a locked string back; a plain one comes back as it is; one that cannot be opened (its key is gone) reads as empty
export function unseal(dataDir, value) {
  if (!isSealed(value)) return value;
  try {
    const [iv, tag, data] = value.slice(PREFIX.length).split(':').map(s => Buffer.from(s, 'base64'));
    const d = crypto.createDecipheriv('aes-256-gcm', keyFor(dataDir), iv);
    d.setAuthTag(tag);
    return Buffer.concat([d.update(data), d.final()]).toString('utf8');
  } catch { return ''; }
}

// for tests: forget the keys held in memory
export function _forgetKeys() { keys.clear(); }
