// Sign-in page, first-time setup of the admin account, and "Forgot password?" with the recovery code
const $ = s => document.querySelector(s);
let mode = 'login';            // login | setup | forgot
let st = {};

async function post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.ok === false) throw new Error(d.error || r.statusText);
  return d;
}

function setMode(m) {
  mode = m;
  $('#lgError').textContent = '';
  const newPw = m !== 'login';
  $('#lgCodeRow').classList.toggle('hidden', m !== 'forgot');
  $('#lgPass2Row').classList.toggle('hidden', !newPw);
  $('#lgPassLabel').textContent = m === 'forgot' ? 'New password' : 'Password';
  $('#lgPass').autocomplete = newPw ? 'new-password' : 'current-password';
  $('#lgForgot').classList.toggle('hidden', m !== 'login');
  $('#lgBack').classList.toggle('hidden', m !== 'forgot');
  $('#lgBtn').textContent = { login: 'Sign in', setup: 'Create admin account', forgot: 'Set new password' }[m];
  $('#lgIntro').textContent = {
    login: 'Sign in to use the panel.',
    setup: st.setupAllowed
      ? 'First time here: choose a user name and password for the admin account. The admin can add more users later in Settings.'
      : 'This panel has no accounts yet. Create the admin account from a computer or phone on your home network first.',
    forgot: st.setupAllowed
      ? 'Enter your user name, the recovery code you wrote down, and a new password. Not the admin? Your admin can also set a new password for you in Settings > Users.'
      : 'Password recovery only works from your home WiFi or through Tailscale. Connect to one of those and try again, or ask your admin to set a new password for you.',
  }[m];
  const locked = (m === 'setup' || m === 'forgot') && !st.setupAllowed;
  $('#loginForm').querySelectorAll('input,button').forEach(e => e.disabled = locked);
  $('#lgName').focus();
}

function showCode(code) {
  $('#loginForm').classList.add('hidden');
  $('#codeShow').textContent = code;
  $('#codeBox').classList.remove('hidden');
}
$('#codeDone').onclick = () => location.replace('/');

async function init() {
  st = await (await fetch('/auth/status')).json();
  if (st.user) return location.replace('/');
  $('#lgTitle').textContent = st.title;
  document.title = 'Sign in - ' + st.title;
  setMode(st.setup ? 'setup' : 'login');
}

$('#lgForgot').onclick = ev => { ev.preventDefault(); setMode('forgot'); };
$('#lgBack').onclick = ev => { ev.preventDefault(); setMode('login'); };

$('#loginForm').addEventListener('submit', async ev => {
  ev.preventDefault();
  $('#lgError').textContent = '';
  const name = $('#lgName').value.trim(), password = $('#lgPass').value;
  try {
    if (mode !== 'login' && password !== $('#lgPass2').value) throw new Error('The two passwords are not the same');
    if (mode === 'setup') return showCode((await post('/auth/setup', { name, password })).recoveryCode);
    if (mode === 'forgot') return showCode((await post('/auth/recover', { name, code: $('#lgCode').value, password })).recoveryCode);
    await post('/auth/login', { name, password });
    location.replace('/');
  } catch (e) { $('#lgError').textContent = e.message; }
});

init().catch(e => { $('#lgError').textContent = 'Cannot reach the panel: ' + e.message; });
