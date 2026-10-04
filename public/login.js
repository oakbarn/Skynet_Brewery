// Sign-in page, first-time setup of the admin account, and "Forgot password?" with the recovery code
import { addEyes } from './eye.js';
const $ = s => document.querySelector(s);
let mode = 'login';            // login | setup | forgot | code (sign in with a code sent by email or text)
let codeSent = false;
let st = {};

async function post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.ok === false) throw new Error(d.error || r.statusText);
  return d;
}

function setMode(m) {
  mode = m; codeSent = false;
  $('#lgError').textContent = '';
  const newPw = m === 'setup' || m === 'forgot';
  $('#lgPassRow').classList.toggle('hidden', m === 'code');
  $('#lgPass').required = m !== 'code';
  $('#lgOtpRow').classList.add('hidden');
  $('#lgCodeLink').classList.toggle('hidden', m !== 'login' || !st.codeSignIn);
  $('#lgCodeRow').classList.toggle('hidden', m !== 'forgot');
  $('#lgPass2Row').classList.toggle('hidden', !newPw);
  $('#lgPassLabel').textContent = m === 'forgot' ? 'New password' : 'Password';
  $('#lgPass').autocomplete = newPw ? 'new-password' : 'current-password';
  $('#lgForgot').classList.toggle('hidden', m !== 'login');
  $('#lgBack').classList.toggle('hidden', m !== 'forgot' && m !== 'code');
  $('#lgBtn').textContent = { login: 'Sign in', setup: 'Create admin account', forgot: 'Set new password', code: 'Send me a code' }[m];
  $('#lgIntro').textContent = {
    login: 'Sign in to use the panel.',
    setup: st.setupAllowed
      ? 'Step 1 of 2: choose a user name and password for the admin account. Next you get a recovery code to save, in case you forget the password.'
      : 'This panel has no accounts yet. Create the admin account from a computer or phone on your home network first.',
    forgot: st.setupAllowed
      ? 'Enter your user name, the recovery code you wrote down, and a new password. Not the admin? Your admin can also set a new password for you in Settings > Users.'
      : 'Password recovery only works from your home WiFi or through Tailscale. Connect to one of those and try again, or ask your admin to set a new password for you.',
    code: 'Type your user name. We send a 6-digit code to the email or mobile number saved for you in Settings > My account.',
  }[m];
  const locked = (m === 'setup' || m === 'forgot') && !st.setupAllowed;
  $('#loginForm').querySelectorAll('input,button').forEach(e => e.disabled = locked);
  $('#lgName').focus();
}

function showCode(code, name, isNew) {
  $('#loginForm').classList.add('hidden');
  $('#codeShow').textContent = code;
  $('#codeStep').classList.toggle('hidden', !!isNew);
  if (isNew) $('#codeTitle').textContent = 'Password changed. Save your NEW recovery code';
  codeText = `${st.title} recovery code\n\nUser: ${name}\nRecovery code: ${code}\nMade: ${new Date().toLocaleString()}\n\n` +
    'If you forget your password: on the sign-in page tap "Forgot password?", type your user name, this code and a new password.\n' +
    'Each code works once; you then get a new one. Works from your home WiFi or Tailscale.\n';
  $('#codeBox').classList.remove('hidden');
  window.scrollTo(0, 0);
}
let codeText = '';
$('#codeSaved').onchange = ev => { $('#codeDone').disabled = !ev.target.checked; };
$('#codeDone').onclick = () => location.replace('/');
$('#codeCopy').onclick = async () => {
  // select the code (works on plain http pages too), then copy
  const r = document.createRange(); r.selectNodeContents($('#codeShow'));
  const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
  let done = false;
  try { done = document.execCommand('copy'); } catch { /* old way not allowed */ }
  if (!done) try { await navigator.clipboard.writeText($('#codeShow').textContent); done = true; } catch { /* not allowed either */ }
  $('#codeCopy').textContent = done ? 'Copied' : 'Selected: copy it';
};
$('#codeSave').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([codeText], { type: 'text/plain' }));
  a.download = 'BrewPanel-recovery-code.txt'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
$('#codePrint').onclick = () => window.print();

async function init() {
  st = await (await fetch('/auth/status')).json();
  if (st.user) return location.replace('/');
  $('#lgTitle').textContent = st.title;
  document.title = 'Sign in - ' + st.title;
  setMode(st.setup ? 'setup' : 'login');
}

$('#lgForgot').onclick = ev => { ev.preventDefault(); setMode('forgot'); };
$('#lgCodeLink').onclick = ev => { ev.preventDefault(); setMode('code'); };
$('#lgBack').onclick = ev => { ev.preventDefault(); setMode('login'); };

$('#loginForm').addEventListener('submit', async ev => {
  ev.preventDefault();
  $('#lgError').textContent = '';
  const name = $('#lgName').value.trim(), password = $('#lgPass').value;
  try {
    if (mode !== 'login' && password !== $('#lgPass2').value) throw new Error('The two passwords are not the same');
    if (mode === 'code' && !codeSent) {
      const r = await post('/auth/code/send', { name });
      codeSent = true;
      $('#lgIntro').textContent = r.message;
      $('#lgOtpRow').classList.remove('hidden'); $('#lgOtp').focus();
      $('#lgBtn').textContent = 'Sign in';
      return;
    }
    if (mode === 'code') { await post('/auth/code/login', { name, code: $('#lgOtp').value }); return location.replace('/'); }
    if (mode === 'setup') return showCode((await post('/auth/setup', { name, password })).recoveryCode, name);
    if (mode === 'forgot') return showCode((await post('/auth/recover', { name, code: $('#lgCode').value, password })).recoveryCode, name, true);
    await post('/auth/login', { name, password });
    location.replace('/');
  } catch (e) { $('#lgError').textContent = e.message; }
});

addEyes();
init().catch(e => { $('#lgError').textContent = 'Cannot reach the panel: ' + e.message; });
