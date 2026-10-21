// node test/auth.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Auth, cleanPasswordRules, describePasswordRules, codeFingerprint, isPrivateAddress, roleAtLeast, parseCookies } from '../lib/auth.js';
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
// recovery code
assert.throws(() => a.recover('Fritz', 'AAAA-AAAA-AAAA-AAAA', 'newpass123', '5.5.5.5'), /no recovery code/);
const code = a.makeRecoveryCode();
assert.match(code, /^[A-Z2-9]{4}(-[A-Z2-9]{4}){3}$/);
assert.doesNotMatch(fs.readFileSync(path.join(d, 'users.json'), 'utf8'), new RegExp(code.replaceAll('-', '')));
assert.equal(a.recoveryInfo().exists, true);
const t2 = a.login('Fritz', 'brewday123', '1.2.3.4');
assert.throws(() => a.recover('Fritz', 'WRNG-WRNG-WRNG-WRNG', 'newpass123', '5.5.5.5'), /Wrong user name or recovery code/);
assert.throws(() => a.recover('Nobody', code, 'newpass123', '5.5.5.5'), /Wrong user name or recovery code/);
assert.throws(() => a.recover('Fritz', code, 'short', '5.5.5.5'), /8 characters/);
const r = a.recover('fritz', code.toLowerCase().replaceAll('-', ' '), 'newpass123', '5.5.5.5');   // typed loosely still works
assert.equal(r.name, 'Fritz'); assert.notEqual(r.code, code);
assert.equal(a.check(t2), null);                                  // signed out everywhere
assert.ok(a.login('Fritz', 'newpass123', '1.2.3.4'));
assert.throws(() => a.recover('Fritz', code, 'another123', '6.6.6.6'), /Wrong/);   // old code used up
a = new Auth(d); assert.ok(a.recover('Fritz', r.code, 'third1234', '7.7.7.7'));   // new code survives a restart
for (let i = 0; i < 5; i++) assert.throws(() => a.recover('Fritz', 'XXXX', 'third1234', '8.8.8.8'), /Wrong/);
assert.throws(() => a.recover('Fritz', 'XXXX', 'third1234', '8.8.8.8'), /Too many/);
assert.ok(roleAtLeast('admin', 'operator') && !roleAtLeast('viewer', 'operator'));
for (const ip of ['127.0.0.1', '::1', '192.168.1.5', '10.0.0.2', '172.20.1.1', '100.101.1.2', '::ffff:192.168.0.9', 'fd7a:115c:a1e0::1']) assert.ok(isPrivateAddress(ip), ip);
for (const ip of ['8.8.8.8', '100.200.1.1', '172.32.0.1', '2001:db8::1', '']) assert.ok(!isPrivateAddress(ip), ip);
assert.deepEqual(parseCookies('a=1; bp_session=xyz'), { a: '1', bp_session: 'xyz' });
// testing mode: a new version clears logins, the same version keeps them, off keeps them
const d2 = fs.mkdtempSync(path.join(os.tmpdir(), 'bpb'));
let b = new Auth(d2); b.addUser('Fritz', 'brewday123', 'admin'); b.makeRecoveryCode();
assert.equal(b.resetIfNewVersion('v1', true), true);              // first start of this version (users from before)
assert.equal(b.needsSetup(), true); assert.equal(b.recoveryInfo().exists, false);
b.addUser('Fritz', 'brewday123', 'admin');
b = new Auth(d2); assert.equal(b.resetIfNewVersion('v1', true), false); assert.equal(b.needsSetup(), false);   // restart, same version
b = new Auth(d2); assert.equal(b.resetIfNewVersion('v2', false), false); assert.equal(b.needsSetup(), false);  // turned off
b = new Auth(d2); assert.equal(b.resetIfNewVersion('v3', true), true); assert.equal(new Auth(d2).needsSetup(), true);
assert.match(codeFingerprint(path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')), /^[0-9a-f]{16}$/);
// password rules (Settings > Password rules)
const d3 = fs.mkdtempSync(path.join(os.tmpdir(), 'bpc'));
const c = new Auth(d3); let rules = {};
c.passwordRules = () => rules;
c.addUser('Fritz', 'any thing ok!', 'admin');                       // defaults: any characters, at least 8
rules = { allowed: 'letnum', min: 6, max: 10 };
assert.throws(() => c.setPassword('Fritz', 'abc12'), /at least 6/);
assert.throws(() => c.setPassword('Fritz', 'abcdef123456'), /at most 10/);
assert.throws(() => c.setPassword('Fritz', 'abc 12!x'), /letters and numbers only.*Not allowed: space !/);
c.setPassword('Fritz', 'abc123');
assert.ok(c.login('Fritz', 'abc123', '1.2.3.4'));
rules = { allowed: 'digits', min: 4, max: 4 };
assert.throws(() => c.addUser('Helper', '12a4', 'viewer'), /Not allowed: a/);
c.addUser('Helper', '1234', 'viewer');
assert.ok(c.login('Fritz', 'abc123', '1.2.3.4'));                   // old passwords still work under new rules
rules = { allowed: 'custom', custom: 'ab', min: 4, max: 200 };
c.setPassword('Helper', 'abba'); assert.throws(() => c.setPassword('Helper', 'abbc'), /Not allowed: c/);
rules = { allowed: 'keyboard', min: 4, max: 200 };
assert.throws(() => c.setPassword('Helper', 'pass word'), /Not allowed: space/); c.setPassword('Helper', 'p@ss~W0rd');
assert.deepEqual(cleanPasswordRules({ allowed: 'nope', min: 1, max: 999 }), { allowed: 'any', custom: '', min: 4, max: 200 });
assert.deepEqual(cleanPasswordRules({ allowed: 'letnum', min: 12, max: 6 }), { allowed: 'letnum', custom: '', min: 12, max: 12 });
assert.deepEqual(cleanPasswordRules(undefined), { allowed: 'any', custom: '', min: 8, max: 200 });
assert.throws(() => cleanPasswordRules({ allowed: 'custom', custom: '' }), /Type the characters/);
assert.equal(describePasswordRules(cleanPasswordRules({})), 'Password: at least 8 characters, any characters.');
assert.equal(describePasswordRules(cleanPasswordRules({ allowed: 'digits', min: 4, max: 6 })), 'Password: 4 to 6 characters, numbers only.');
console.log('auth tests passed');
