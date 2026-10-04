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
console.log('messaging tests passed');
