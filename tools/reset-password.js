// Forgot a password? Run this on the Pi (or whatever computer runs the panel), in the panel folder:
//   node tools/reset-password.js            lists the users
//   node tools/reset-password.js Fritz      sets a new password for Fritz (creates Fritz as an admin if there is no such user)
// Then restart the panel: sudo systemctl restart brewpanel
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { Auth } from '../lib/auth.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.resolve(process.env.BREWPANEL_DATA ?? path.join(ROOT, 'data'));
const auth = new Auth(DATA);
const name = process.argv[2];

if (!name) {
  console.log(auth.users.length ? auth.listUsers().map(u => `${u.name}  (${u.role})`).join('\n') : 'No users yet. Open the panel in a browser to create the admin account.');
  process.exit(0);
}
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const pw = await rl.question(`New password for ${name}: `);
rl.close();
try {
  if (auth.findUser(name)) auth.setPassword(name, pw);
  else auth.addUser(name, pw, 'admin');
  if (auth.needsSetup()) auth.setRole(name, 'admin');
  auth.endSessionsFor(name);
  console.log(`Done. ${name} can sign in with the new password after the panel restarts.`);
} catch (e) { console.error(e.message); process.exit(1); }
