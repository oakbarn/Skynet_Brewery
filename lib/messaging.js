// Sending sign-in codes by email or text message. No extra packages: a small SMTP client
// (works with Gmail, Outlook and most mail accounts) and the Twilio web API for texts.
// Settings live in data/messaging.json (not in the config file, because they hold passwords).
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import tls from 'node:tls';
import os from 'node:os';

// Free email-to-text addresses: the code is emailed to <number>@<gateway> and arrives as a text.
// Some carriers have stopped this service (AT&T in 2025); use Twilio for those.
export const CARRIERS = {
  verizon: { name: 'Verizon (also Visible, Xfinity Mobile)', domain: 'vtext.com' },
  tmobile: { name: 'T-Mobile (also Mint, Metro)', domain: 'tmomail.net' },
  uscellular: { name: 'UScellular', domain: 'email.uscc.net' },
  cricket: { name: 'Cricket', domain: 'mms.cricketwireless.net' },
  boost: { name: 'Boost Mobile', domain: 'sms.myboostmobile.com' },
  googlefi: { name: 'Google Fi', domain: 'msg.fi.google.com' },
  consumer: { name: 'Consumer Cellular', domain: 'mailmymobile.net' },
  rogers: { name: 'Rogers (Canada)', domain: 'pcs.rogers.com' },
  bell: { name: 'Bell (Canada)', domain: 'txt.bell.ca' },
  telus: { name: 'Telus (Canada)', domain: 'msg.telus.com' },
};

const SECRET_KEYS = ['smtpPass', 'twilioToken'];
const MASK = '********';

export class Messaging {
  constructor(dataDir) {
    this.file = path.join(dataDir, 'messaging.json');
    this.dataDir = dataDir;
    this.tlsOptions = {};          // tests only
    this.fetch = (...a) => fetch(...a);
    try { this.cfg = JSON.parse(fs.readFileSync(this.file, 'utf8')); } catch { this.cfg = {}; }
  }
  // What the Settings page sees: passwords are never sent back to the browser.
  publicSettings() {
    const c = { ...this.cfg };
    for (const k of SECRET_KEYS) if (c[k]) c[k] = MASK;
    return c;
  }
  save(body) {
    const keep = ['smtpHost', 'smtpPort', 'smtpSecurity', 'smtpUser', 'smtpPass', 'smtpFrom', 'twilioSid', 'twilioToken', 'twilioFrom'];
    for (const k of keep) {
      if (!(k in body)) continue;
      if (SECRET_KEYS.includes(k) && body[k] === MASK) continue;      // unchanged password
      this.cfg[k] = typeof body[k] === 'string' ? body[k].trim() : body[k];
    }
    fs.mkdirSync(this.dataDir, { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(this.cfg, null, 2), { mode: 0o600 });
  }
  emailReady() { const c = this.cfg; return !!(c.smtpHost && c.smtpFrom); }
  twilioReady() { const c = this.cfg; return !!(c.twilioSid && c.twilioToken && c.twilioFrom); }

  // Where a user's codes go: [{ kind: 'email'|'text', to, via }]
  targets(contact = {}) {
    const out = [];
    const email = String(contact.email ?? '').trim();
    const digits = String(contact.phone ?? '').replace(/\D/g, '');
    if (email && this.emailReady()) out.push({ kind: 'email', to: email, via: 'email' });
    if (digits && contact.textVia === 'twilio' && this.twilioReady()) out.push({ kind: 'text', to: '+' + (digits.length === 10 ? '1' + digits : digits), via: 'twilio' });
    else if (digits && CARRIERS[contact.textVia] && this.emailReady()) {
      const local = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
      out.push({ kind: 'text', to: `${local}@${CARRIERS[contact.textVia].domain}`, via: 'carrier' });
    }
    return out;
  }

  // Sends one short message to every target. Returns the targets that worked; throws if none did.
  async deliver(contact, subject, text) {
    const list = this.targets(contact);
    if (!list.length) throw new Error('No email or text is set up for this user');
    const sent = [], errors = [];
    for (const t of list) {
      try {
        if (t.via === 'twilio') await this.sendTwilio(t.to, text);
        else await this.sendEmail(t.to, t.kind === 'text' ? '' : subject, text);
        sent.push(t);
      } catch (e) { errors.push(`${t.kind}: ${e.message}`); }
    }
    if (!sent.length) throw new Error('Could not send: ' + errors.join('; '));
    return sent;
  }

  async sendTwilio(to, text) {
    const c = this.cfg;
    const r = await this.fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(c.twilioSid)}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: 'Basic ' + Buffer.from(`${c.twilioSid}:${c.twilioToken}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: to, From: c.twilioFrom, Body: text }).toString(),
    });
    if (!r.ok) { let m = r.statusText; try { m = (await r.json()).message || m; } catch { } throw new Error('Twilio: ' + m); }
  }

  sendEmail(to, subject, text) {
    const c = this.cfg;
    const port = Number(c.smtpPort) || (c.smtpSecurity === 'ssl' ? 465 : 587);
    const security = c.smtpSecurity || (port === 465 ? 'ssl' : 'starttls');
    const from = c.smtpFrom;
    const msg = [
      `From: Brew Panel <${from}>`, `To: <${to}>`, ...(subject ? [`Subject: ${subject}`] : []),
      `Date: ${new Date().toUTCString()}`, `Message-ID: <${Date.now()}.${Math.random().toString(36).slice(2)}@brewpanel>`,
      'MIME-Version: 1.0', 'Content-Type: text/plain; charset=utf-8', 'Content-Transfer-Encoding: 8bit', '', text,
    ].join('\r\n').replace(/\r?\n\./g, '\r\n..');
    return smtpSend({ host: c.smtpHost, port, security, user: c.smtpUser, pass: c.smtpPass, from, to, msg, tlsOptions: this.tlsOptions });
  }
}

// ---- a minimal SMTP client: EHLO, STARTTLS or SSL, AUTH PLAIN/LOGIN, one message
function smtpSend({ host, port, security, user, pass, from, to, msg, tlsOptions }) {
  return new Promise((resolve, reject) => {
    let sock, buf = '', waiter = null, done = false;
    const finish = err => { if (done) return; done = true; clearTimeout(timer); try { sock?.end(); } catch { } err ? reject(err) : resolve(); };
    const timer = setTimeout(() => finish(new Error('Mail server did not answer in time')), 20000);
    const attach = s => {
      sock = s;
      s.setEncoding('utf8');
      s.on('data', d => { buf += d; pump(); });
      s.on('error', e => finish(new Error('Mail server: ' + e.message)));
      s.on('close', () => finish(new Error('Mail server closed the connection')));
    };
    // a reply is complete when a line has "NNN " (space after the code)
    function pump() {
      const lines = buf.split('\r\n');
      for (let i = 0; i < lines.length - 1; i++) {
        if (/^\d{3} /.test(lines[i])) {
          const reply = lines.slice(0, i + 1); buf = lines.slice(i + 1).join('\r\n');
          const w = waiter; waiter = null; w?.(reply); return pump();
        }
      }
    }
    const read = () => new Promise(r => { waiter = r; pump(); });
    const cmd = async (line, ok = [250]) => {
      if (line !== null) sock.write(line + '\r\n');
      const reply = await read();
      const code = +reply.at(-1).slice(0, 3);
      if (!ok.includes(code)) throw new Error(`Mail server said: ${reply.at(-1).slice(4) || code}`);
      return reply;
    };
    const run = async () => {
      await cmd(null, [220]);
      const me = os.hostname().replace(/[^A-Za-z0-9.-]/g, '') || 'brewpanel';
      let ehlo = await cmd('EHLO ' + me);
      if (security === 'starttls') {
        if (!ehlo.some(l => /STARTTLS/i.test(l))) throw new Error('Mail server does not offer STARTTLS (try port 465 with SSL)');
        await cmd('STARTTLS', [220]);
        sock.removeAllListeners('data'); sock.removeAllListeners('close'); sock.removeAllListeners('error');
        await new Promise((res, rej) => { const t = tls.connect({ socket: sock, servername: host, ...tlsOptions }, res); t.once('error', rej); attach(t); });
        ehlo = await cmd('EHLO ' + me);
      }
      if (user) {
        const auth = ehlo.find(l => /AUTH/i.test(l)) || '';
        if (/PLAIN/i.test(auth) || !/LOGIN/i.test(auth)) await cmd('AUTH PLAIN ' + Buffer.from(`\0${user}\0${pass ?? ''}`).toString('base64'), [235]);
        else { await cmd('AUTH LOGIN', [334]); await cmd(Buffer.from(user).toString('base64'), [334]); await cmd(Buffer.from(pass ?? '').toString('base64'), [235]); }
      }
      await cmd(`MAIL FROM:<${from}>`);
      await cmd(`RCPT TO:<${to}>`, [250, 251]);
      await cmd('DATA', [354]);
      await cmd(msg + '\r\n.', [250]);
      sock.write('QUIT\r\n');
      finish();
    };
    try {
      if (security === 'ssl') attach(tls.connect({ host, port, servername: host, ...tlsOptions }));
      else attach(net.connect({ host, port }));
    } catch (e) { return finish(e); }
    run().catch(finish);
  });
}
