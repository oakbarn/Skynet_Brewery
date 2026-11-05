// The "key" button in a new-password box: makes a strong password that follows the admin's password rules
// (Settings > Password rules), puts it in the box and in the "again" box, and shows it so it can be written down.
// Skynet has its own key because a browser's "Suggest strong password" key needs the browser signed in and syncing,
// and Skynet's clean window never syncs (Rule 9.8). It works the same in every browser and on phones.
const KEY = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="7.5" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M11.5 12H22M18 12v3.5M21 12v2.5"/></svg>';

// letters and numbers that are easy to read and copy by hand (no 0 O o 1 l I)
const LETNUM = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
const SYMBOLS = '!#$%&*+-=?@_';
const DIGITS = '0123456789';

function pick(list, n) {
  const chars = [...list];
  const out = [];
  const buf = new Uint32Array(1);
  const limit = Math.floor(2 ** 32 / chars.length) * chars.length;      // no bias toward the first characters
  while (out.length < n) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) out.push(chars[buf[0] % chars.length]);
  }
  return out;
}

// rules: { allowed: any|keyboard|letnum|digits|custom, custom, min, max }
export function makePassword(rules = {}) {
  const min = rules.min ?? 8, max = rules.max ?? 200;
  const allowed = rules.allowed || 'any';
  const len = Math.min(max, Math.max(min, allowed === 'digits' ? 10 : 16));
  if (allowed === 'digits') return pick(DIGITS, len).join('');
  if (allowed === 'letnum') return pick(LETNUM, len).join('');
  if (allowed === 'custom') return pick([...new Set([...(rules.custom || '')])].join('') || LETNUM, len).join('');
  // any / keyboard: mostly letters and numbers, with a couple of symbols
  for (;;) {
    const p = pick(LETNUM + SYMBOLS, len).join('');
    if (len < 6 || (/[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p))) return p;
  }
}

// input: the new-password box (already wrapped by addEyes); also: the "again" box(es); getRules: () => the rules;
// onFill(password): called after it is filled. Returns the key button.
export function addKey(input, { also = [], getRules = () => ({}), onFill } = {}) {
  const wrap = input.parentElement;
  if (!wrap?.classList.contains('pwWrap') || wrap.querySelector('.pwKey')) return wrap?.querySelector('.pwKey');
  wrap.classList.add('hasKey');
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'pwKey'; b.innerHTML = KEY;
  b.title = b.ariaLabel = 'Make a strong password for me';
  b.onclick = () => {
    const p = makePassword(getRules() || {});
    for (const i of [input, ...also]) {
      i.value = p;
      // shown, so it can be written down (the eye hides it again)
      const eye = i.parentElement.querySelector('.eye');
      if (i.type === 'password') { if (eye) eye.click(); else i.type = 'text'; }
      i.dispatchEvent(new Event('pwgen'));
      i.dispatchEvent(new Event('input', { bubbles: true }));
    }
    input.focus(); input.select();
    onFill?.(p);
  };
  wrap.insertBefore(b, wrap.querySelector('.eye'));
  return b;
}
