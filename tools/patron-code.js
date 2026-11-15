// Patron codes (Rule 12.4): for OakBarn Brewery only. Needs the Patron private key, which is never put on GitHub or on a Brain.
//   node tools/patron-code.js --new-key <folder>                     makes a new key pair: the private key goes in <folder>,
//                                                                     the public key is printed (paste it into lib/patron.js)
//   node tools/patron-code.js --key <private.pem> "Name" 2027-05-15   prints a Patron code for "Name", good until that day
//   node tools/patron-code.js --check <code>                          says what a code holds
// A Patron code holds only the name to show, the level and the end date (never an email address).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { makeCode, readCode } from '../lib/patron.js';

const a = process.argv.slice(2);
if (a[0] === '--new-key') {
  const dir = a[1]; if (!dir) { console.error('Give a folder for the private key, away from the Skynet folder.'); process.exit(1); }
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, 'patron_private_key.pem');
  if (fs.existsSync(f)) { console.error(`${f} is already there. Move it first: it signs every Patron code already sent.`); process.exit(1); }
  fs.writeFileSync(f, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
  console.log(`Private key: ${f}\nKeep it safe and never put it on GitHub.\nPublic key for lib/patron.js PATRON_PUBLIC_KEY:\n${publicKey.export({ type: 'spki', format: 'der' }).toString('base64')}`);
} else if (a[0] === '--key') {
  const [, keyFile, name, expires, level = 'patron'] = a;
  console.log(makeCode({ name, expires, level, privateKeyPem: fs.readFileSync(keyFile, 'utf8') }));
} else if (a[0] === '--check') {
  console.log(readCode(a[1]));
} else {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter(l => l.startsWith('//')).join('\n'));
}
