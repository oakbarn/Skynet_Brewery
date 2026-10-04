// Adds an "eye" button to every password box so you can check what you typed.
const OPEN = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
const SHUT = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path stroke="currentColor" stroke-width="2" d="M3 3l18 18"/></svg>';

export function addEyes(root = document) {
  for (const input of root.querySelectorAll('input[type=password]')) {
    if (input.parentElement.classList.contains('pwWrap')) continue;
    const wrap = document.createElement('span'); wrap.className = 'pwWrap';
    input.replaceWith(wrap); wrap.append(input);
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'eye'; b.tabIndex = -1;
    const show = on => { input.type = on ? 'text' : 'password'; b.innerHTML = on ? SHUT : OPEN; b.title = b.ariaLabel = on ? 'Hide password' : 'Show password'; };
    b.onclick = () => { show(input.type === 'password'); input.focus(); };
    show(false);
    wrap.append(b);
    // hide the password again when the form is sent or the page is left
    input.form?.addEventListener('submit', () => show(false));
  }
}
