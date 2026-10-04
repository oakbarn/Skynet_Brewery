// node test/auth.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Auth, isPrivateAddress, roleAtLeast, parseCookies } from '../lib/auth.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpa'));
let a = new Auth(d);
assert.equal(a.needsSetup(), true);
assert.throws(() => a.addUser('Fritz', 'short', 'admin'), /8 characters/);
a.addUser('Fritz', 'brewday123', 'admin');
assert.equal(a.needsSetup(), false);
assert.doesNotMatch(fs.readFileSync(path.join(d, 'users.json'), 'utf8'), /brewday123/);
const t = a.login('fritz', 'brewday123', '1.2.3.4');
assert.deepEqual(a.check(t), { name: 'Fritz', role: 'admin' });
a = new Auth(d);                                       // survives a restart
assert.deepEqual(a.check(t), { name: 'Fritz', role: 'admin' });
for (let i = 0; i < 5; i++) assert.throws(() => a.login('Fritz', 'nope', '9.9.9.9'), /Wrong/);
assert.throws(() => a.login('Fritz', 'brewday123', '9.9.9.9'), /Too many/);
assert.throws(() => a.setRole('Fritz', 'viewer'), /at least one admin/);
a.addUser('Helper', 'helper123', 'viewer');
const h = a.login('Helper', 'helper123', '1.2.3.4');
a.removeUser('Helper'); assert.equal(a.check(h), null);
a.logout(t); assert.equal(a.check(t), null);
assert.ok(roleAtLeast('admin', 'operator') && !roleAtLeast('viewer', 'operator'));
for (const ip of ['127.0.0.1', '::1', '192.168.1.5', '10.0.0.2', '172.20.1.1', '100.101.1.2', '::ffff:192.168.0.9', 'fd7a:115c:a1e0::1']) assert.ok(isPrivateAddress(ip), ip);
for (const ip of ['8.8.8.8', '100.200.1.1', '172.32.0.1', '2001:db8::1', '']) assert.ok(!isPrivateAddress(ip), ip);
assert.deepEqual(parseCookies('a=1; bp_session=xyz'), { a: '1', bp_session: 'xyz' });
console.log('auth tests passed');
