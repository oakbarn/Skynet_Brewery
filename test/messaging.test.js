// node test/messaging.test.js  -  sign-in codes, a fake mail server, a fake Twilio
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import net from 'node:net'; import tls from 'node:tls';
import assert from 'node:assert/strict'; import { execFileSync } from 'node:child_process';
import { Messaging, CARRIERS } from '../lib/messaging.js';
import { Auth } from '../lib/auth.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpm'));

// ---- a tiny SMTP server that records what it receives. mode: 'none' | 'starttls' | 'ssl'
function fakeSmtp(mode, cert) {
  const got = [];
  const handle = (sock, secured) => {
    let buf = '', inData = false, mail = { lines: [] };
    sock.setEncoding('utf8');
    const say = l => sock.write(l + '\r\n');
    if (!secured || mode === 'ssl') say('220 fake ESMTP');
    sock.on('data', chunk => {
      buf += chunk;
      let i;
      while ((i = buf.indexOf('\r\n')) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 2);
        if (inData) { if (line === '.') { inData = false; got.push(mail); say('250 queued'); } else mail.lines.push(line); continue; }
        if (/^EHLO/.test(line)) { sock.write('250-fake\r\n' + (mode === 'starttls' && !secured ? '250-STARTTLS\r\n' : '') + '250 AUTH PLAIN LOGIN\r\n'); }
        else if (line === 'STARTTLS') {
          say('220 go ahead'); sock.removeAllListeners('data');
          const t = new tls.TLSSocket(sock, { isServer: true, ...cert }); handle(t, true); return;
        }
        else if (/^AUTH PLAIN /.test(line)) { mail.auth = Buffer.from(line.slice(11), 'base64').toString(); say(mail.auth === '\0me@x.com\0secret' ? '235 ok' : '535 bad login'); }
        else if (/^MAIL FROM:/.test(line)) { mail.from = line; say('250 ok'); }
        else if (/^RCPT TO:/.test(line)) { mail.to = line; say('250 ok'); }
        else if (line === 'DATA') { inData = true; say('354 go'); }
        else if (line === 'QUIT') { say('221 bye'); sock.end(); }
        else say('500 what');
      }
    });
    sock.on('error', () => { });
  };
  const server = mode === 'ssl' ? tls.createServer(cert, s => handle(s, true)) : net.createServer(s => handle(s, false));
  return new Promise(r => server.listen(0, '127.0.0.1', () => r({ server, port: server.address().port, got })));
}

// plain SMTP with AUTH
{
  const s = await fakeSmtp('none');
  const m = new Messaging(d);
  m.save({ smtpHost: '127.0.0.1', smtpPort: s.port, smtpSecurity: 'none', smtpUser: 'me@x.com', smtpPass: 'secret', smtpFrom: 'me@x.com' });
  assert.equal(m.publicSettings().smtpPass, '********');
  m.save({ smtpPass: '********' }); assert.equal(m.cfg.smtpPass, 'secret');                  // masked value keeps the password
  const sent = await m.deliver({ email: 'fritz@example.com', phone: '(555) 123-4567', textVia: 'verizon' }, 'Brew Panel sign-in code', '123456 is your code');
  assert.deepEqual(sent.map(t => t.to), ['fritz@example.com', '5551234567@vtext.com']);
  assert.equal(s.got.length, 2);
  assert.match(s.got[0].to, /fritz@example.com/); assert.ok(s.got[0].lines.includes('Subject: Brew Panel sign-in code'));
  assert.ok(s.got[1].lines.includes('123456 is your code')); assert.ok(!s.got[1].lines.some(l => l.startsWith('Subject:')));
  m.save({ smtpPass: 'wrong' });
  await assert.rejects(m.sendEmail('a@b.com', 's', 't'), /bad login/);
  s.server.close();
}

// STARTTLS and SSL (needs openssl to make a test certificate)
let cert = null;
try {
  execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1', '-subj', '/CN=localhost',
    '-keyout', path.join(d, 'k.pem'), '-out', path.join(d, 'c.pem')], { stdio: 'ignore' });
  cert = { key: fs.readFileSync(path.join(d, 'k.pem')), cert: fs.readFileSync(path.join(d, 'c.pem')) };
} catch { console.log('openssl not found: skipping the TLS mail tests'); }
if (cert) {
  for (const mode of ['starttls', 'ssl']) {
    const s = await fakeSmtp(mode, cert);
    const m = new Messaging(d);
    m.tlsOptions = { ca: cert.cert, servername: 'localhost' };
    m.save({ smtpHost: '127.0.0.1', smtpPort: s.port, smtpSecurity: mode, smtpUser: 'me@x.com', smtpPass: 'secret', smtpFrom: 'me@x.com' });
    await m.sendEmail('fritz@example.com', 'Hi', 'line one\n.dot line');
    assert.equal(s.got.length, 1, mode); assert.ok(s.got[0].lines.includes('..dot line'), 'dot stuffing');
    // a certificate we do not trust is refused
    m.tlsOptions = { servername: 'localhost' };
    await assert.rejects(m.sendEmail('fritz@example.com', 'Hi', 'x'), /certificate/i);
    s.server.close();
  }
}

// Twilio (fake web API)
{
  const m = new Messaging(d); let call;
  m.fetch = async (url, opt) => { call = { url, opt }; return { ok: true, json: async () => ({}) }; };
  m.save({ twilioSid: 'AC123', twilioToken: 'tok', twilioFrom: '+15550001111' });
  const sent = await m.deliver({ phone: '555 123 4567', textVia: 'twilio' }, 'x', '654321 is your code');
  assert.equal(sent[0].to, '+15551234567');
  assert.match(call.url, /Accounts\/AC123\/Messages\.json$/);
  assert.equal(new URLSearchParams(call.opt.body).get('Body'), '654321 is your code');
  m.fetch = async () => ({ ok: false, statusText: 'Bad', json: async () => ({ message: 'invalid number' }) });
  await assert.rejects(m.deliver({ phone: '5551234567', textVia: 'twilio' }, 'x', 'y'), /invalid number/);
  assert.equal(new Messaging(fs.mkdtempSync(path.join(os.tmpdir(), 'bpm'))).targets({ email: 'a@b.com' }).length, 0);   // nothing set up
}

// sign-in codes and contact details
{
  const a = new Auth(fs.mkdtempSync(path.join(os.tmpdir(), 'bpc')));
  a.addUser('Fritz', 'brewday123', 'admin');
  assert.throws(() => a.setContact('Fritz', { email: 'not an email' }, CARRIERS), /does not look right/);
  assert.throws(() => a.setContact('Fritz', { email: 'x@y.com\r\nBcc: z@q.com' }, CARRIERS), /does not look right/);
  assert.throws(() => a.setContact('Fritz', { phone: '555-1234', textVia: 'verizon' }, CARRIERS), /area code/);
  assert.throws(() => a.setContact('Fritz', { phone: '5551234567' }, CARRIERS), /Pick how texts/);
  a.setContact('Fritz', { email: 'fritz@example.com', phone: '555-123-4567', textVia: 'tmobile' }, CARRIERS);
  assert.equal(a.listUsers()[0].contact.textVia, 'tmobile');
  assert.equal(a.makeSignInCode('nobody'), null);
  const c = a.makeSignInCode('fritz');
  assert.match(c.code, /^\d{6}$/);
  assert.throws(() => a.makeSignInCode('Fritz'), /just sent/);                      // one a minute
  assert.throws(() => a.loginWithCode('Fritz', '000000' === c.code ? '111111' : '000000', '1.1.1.1'), /Wrong/);
  const tok = a.loginWithCode('Fritz', c.code.slice(0, 3) + ' ' + c.code.slice(3), '1.1.1.1');
  assert.equal(a.check(tok).name, 'Fritz');
  assert.throws(() => a.loginWithCode('Fritz', c.code, '1.1.1.2'), /Wrong/);         // used up
  // expiry and the 5-try limit
  a.codes.get('fritz').sent = []; const c2 = a.makeSignInCode('Fritz');
  a.codes.get('fritz').expires = Date.now() - 1;
  assert.throws(() => a.loginWithCode('Fritz', c2.code, '1.1.1.3'), /expired/);
  a.codes.get('fritz').sent = []; const c3 = a.makeSignInCode('Fritz');
  for (let i = 0; i < 5; i++) assert.throws(() => a.loginWithCode('Fritz', c3.code === '999999' ? '999998' : '999999', `2.2.2.${i}`));
  assert.throws(() => a.loginWithCode('Fritz', c3.code, '2.2.2.9'), /Wrong/);         // locked after 5 tries
  // at most 5 codes an hour
  const e = a.codes.get('fritz'); e.sent = [1, 2, 3, 4, 5].map(i => Date.now() - 600e3 - i);
  assert.throws(() => a.makeSignInCode('Fritz'), /Too many codes/);
}
// ---- Rule 8.5: the app password, the Twilio token and each user's email and mobile number are locked on disk
{
  const { seal, unseal, isSealed, _forgetKeys } = await import('../lib/seal.js');
  const sd = fs.mkdtempSync(path.join(os.tmpdir(), 'bps'));
  // a plain file from before the Rule is read, then locked
  fs.writeFileSync(path.join(sd, 'messaging.json'), JSON.stringify({ smtpHost: 'smtp.x', smtpPass: 'app-pass-1', twilioToken: 'tok-9' }));
  fs.writeFileSync(path.join(sd, 'users.json'), JSON.stringify({ users: [{ name: 'Brewer', role: 'admin', contact: { email: 'b@x.com', phone: '555-123-4567', textVia: 'tmobile' } }] }));
  const m = new Messaging(sd), a = new Auth(sd);
  assert.equal(m.cfg.smtpPass, 'app-pass-1'); assert.equal(m.cfg.twilioToken, 'tok-9');
  assert.equal(a.getContact('Brewer').email, 'b@x.com'); assert.equal(a.getContact('Brewer').phone, '555-123-4567');
  const mj = fs.readFileSync(path.join(sd, 'messaging.json'), 'utf8'), uj = fs.readFileSync(path.join(sd, 'users.json'), 'utf8');
  for (const plain of ['app-pass-1', 'tok-9']) assert.ok(!mj.includes(plain), 'locked on disk: ' + plain);
  for (const plain of ['b@x.com', '555-123-4567']) assert.ok(!uj.includes(plain), 'locked on disk: ' + plain);
  assert.ok(isSealed(JSON.parse(mj).smtpPass) && isSealed(JSON.parse(uj).users[0].contact.email));
  assert.equal(JSON.parse(mj).smtpHost, 'smtp.x');      // not a secret: stays plain
  // saving and reading again keeps them
  m.save({ smtpPass: 'app-pass-2' }); a.setContact('Brewer', { email: 'c@x.com' });
  _forgetKeys();
  assert.equal(new Messaging(sd).cfg.smtpPass, 'app-pass-2'); assert.equal(new Auth(sd).getContact('Brewer').email, 'c@x.com');
  assert.equal(new Messaging(sd).publicSettings().smtpPass, '********');
  // a copy without its key cannot be read
  const other = fs.mkdtempSync(path.join(os.tmpdir(), 'bpo'));
  assert.equal(unseal(other, JSON.parse(fs.readFileSync(path.join(sd, 'messaging.json'), 'utf8')).smtpPass), '');
  assert.equal(seal(sd, ''), ''); assert.equal(unseal(sd, 'plain'), 'plain');
}
// ---- Rule 8.6: Approved Devices
{
  const { Devices, deviceName } = await import('../lib/devices.js');
  const dd = fs.mkdtempSync(path.join(os.tmpdir(), 'bpd'));
  assert.equal(deviceName('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1'), 'iPhone, Safari');
  assert.equal(deviceName('Mozilla/5.0 (Windows NT 10.0) Chrome/120 Edg/120'), 'Windows PC, Edge');
  const dv = new Devices(dd), far = { socket: { remoteAddress: '192.168.1.9' }, headers: {} }, here = { socket: { remoteAddress: '127.0.0.1' }, headers: {} };
  const proxied = { socket: { remoteAddress: '127.0.0.1' }, headers: { 'x-forwarded-for': '100.64.1.2' } };
  const { token, set } = dv.idOf({}, false);
  assert.ok(set.includes('HttpOnly') && token.length > 30);
  assert.equal(dv.idOf({ bp_device: token }).set, null);
  assert.ok(dv.on, 'On by default');
  assert.ok(!dv.allowed(far, token) && dv.allowed(here, token) && !dv.allowed(proxied, token), 'the Brain\'s own computer only, not through a proxy');
  const d = dv.ask(token, 'Dana', 'iPhone Safari/1', '192.168.1.9');
  assert.equal(d.state, 'waiting'); assert.ok(!dv.allowed(far, token));
  dv.setState(d.key, 'approved', 'Admin');
  assert.ok(new Devices(dd).allowed(far, token), 'kept on disk');
  assert.ok(!fs.readFileSync(path.join(dd, 'devices.json'), 'utf8').includes(token), 'only a hash of the device cookie is kept');
  dv.setState(d.key, 'removed', 'Admin'); assert.ok(!dv.allowed(far, token));
  dv.setOn(false); assert.ok(dv.allowed(far, token), 'switch Off: a password alone');
}
// ---- Rule 12.4: the Patron Level (a code signed by OakBarn Brewery unlocks the perks; no email address in it)
{
  const crypto = await import('node:crypto');
  const { readCode, makeCode, Patron, PATRON_PUBLIC_KEY } = await import('../lib/patron.js');
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  const pub = publicKey.export({ type: 'spki', format: 'der' }).toString('base64'), pem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const code = makeCode({ name: 'Dana', expires: '2027-05-15', privateKeyPem: pem });
  const r = readCode(code, Date.parse('2027-01-01'), pub);
  assert.ok(r.ok && r.active && r.name === 'Dana' && r.level === 'patron');
  assert.ok(!/@/.test(Buffer.from(code.split('.')[1], 'base64url').toString()), 'no email address in a Patron code');
  assert.ok(!readCode(code, Date.parse('2027-05-16T12:00:00'), pub).active, 'ended after its end date');
  assert.ok(!readCode(code.slice(0, -2) + 'AA', Date.now(), pub).ok, 'a changed letter fails');
  assert.ok(!readCode(code, Date.now(), PATRON_PUBLIC_KEY).ok, 'a code signed with another key fails');
  assert.ok(!readCode('hello').ok);
  const pd = fs.mkdtempSync(path.join(os.tmpdir(), 'bpp')), pt = new Patron(pd);
  assert.ok(!pt.has('feature'));
  assert.throws(() => pt.set('nope'), /not a Patron code/);
}
console.log('messaging tests passed');
