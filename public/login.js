// Sign-in page, and first-time setup of the admin account
const $ = s => document.querySelector(s);
let setup = false;

async function post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.ok === false) throw new Error(d.error || r.statusText);
  return d;
}

async function init() {
  const st = await (await fetch('/auth/status')).json();
  if (st.user) return location.replace('/');
  $('#lgTitle').textContent = st.title;
  document.title = 'Sign in - ' + st.title;
  setup = st.setup;
  if (setup) {
    $('#lgBtn').textContent = 'Create admin account';
    $('#lgPass').autocomplete = 'new-password';
    $('#lgPass2Row').classList.remove('hidden');
    $('#lgIntro').textContent = st.setupAllowed
      ? 'First time here: choose a user name and password for the admin account. The admin can add more users later in Settings.'
      : 'This panel has no accounts yet. Create the admin account from a computer or phone on your home network first.';
    if (!st.setupAllowed) $('#loginForm').querySelectorAll('input,button').forEach(e => e.disabled = true);
  }
  $('#lgName').focus();
}

$('#loginForm').addEventListener('submit', async ev => {
  ev.preventDefault();
  $('#lgError').textContent = '';
  const name = $('#lgName').value.trim(), password = $('#lgPass').value;
  try {
    if (setup) {
      if (password !== $('#lgPass2').value) throw new Error('The two passwords are not the same');
      await post('/auth/setup', { name, password });
    } else await post('/auth/login', { name, password });
    location.replace('/');
  } catch (e) { $('#lgError').textContent = e.message; }
});

init().catch(e => { $('#lgError').textContent = 'Cannot reach the panel: ' + e.message; });
