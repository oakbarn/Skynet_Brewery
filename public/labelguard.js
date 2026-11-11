// The Label can't be blank (Skynet Rule 18.28, Fritz 2026-11-05): in any dialog with a Label field, when the Label is blank and
// the user clicks (or taps, or Tabs / Enters to) any other field or icon, except Cancel, a small pop-up says
// "The Label cannot be blank." and goes away by itself after 5 seconds. The click does nothing and the Label keeps the focus.
// The same for a Port, when the Device needs one (Fritz: "If the device needs a Port, the same Rule for a Port"): once the user is
// on a blank Port, every other field but the ones before it (the Label and the Interface) gets the pop-up "The Port cannot be blank."
// One shared helper for every Device and Widget dialog: it watches the whole page, so a dialog needs no code of its own for the
// Label. A Port is marked by its dialog with data-guard="Port" and data-guard-allow="label device" (the fields it may go back to).
export const LABEL_WARN = 'The Label cannot be blank.';
export const LABEL_WARN_MS = 5000;
export const blankWarn = what => `The ${what} cannot be blank.`;

export const isBlank = v => !String(v ?? '').trim();
import { LABEL_NO, labelNoMsg, cleanLabel } from './naming.js';
// a Cancel button: data-close="cancel" (Properties), value="cancel", or a button whose text is Cancel / ✖ Cancel (the Rule 18 pop-ups)
export const isCancelButton = b => !!b && (b.dataset?.close === 'cancel' || b.value === 'cancel' || /^[^\p{L}\p{N}]*cancel$/iu.test(String(b.textContent ?? '').trim()));

const showing = i => !i.disabled && !i.readOnly && i.offsetParent !== null;
// the field that guards this spot: the blank, editable, showing Label of the open dialog it is in; or else a blank Port the user is on
export function guardingField(t) {
  const d = t?.closest?.('dialog[open]'); if (!d) return null;
  const label = [...d.querySelectorAll('input[data-k="label"], textarea[data-k="label"]')].find(showing);
  if (label && isBlank(label.value)) return label;
  // a box the program needs (data-guard-now, Rule 18.33) guards at once; the others once the user has been on them
  return [...d.querySelectorAll('[data-guard]')].find(i => (i.dataset.visited || i.dataset.guardNow) && showing(i) && isBlank(i.value)) || null;
}

// may this be clicked while the field is blank? The field itself, its own ⬆ / ⬢ (they are for typing it), the fields it may go back
// to, Cancel, the warning, and the dialog's empty space (no field there)
export function allowedWhileBlank(t, field) {
  if (!t || !field) return true;
  if (t === field || field.contains?.(t)) return true;
  const icons = field.closest?.('.fldIcons'); if (icons && icons.contains(t)) return true;
  if (t.closest?.('.labelWarn')) return true;
  if (isCancelButton(t.closest?.('button'))) return true;
  const back = String(field.dataset?.guardAllow ?? '').split(/\s+/).filter(Boolean);
  if (back.length) {
    const k = t.closest?.('[data-k]')?.dataset?.k ?? t.closest?.('.fldIcons')?.querySelector('[data-k]')?.dataset?.k;
    if (back.includes(k)) return true;
  }
  const d = t.closest?.('dialog');
  if (t === d || t.tagName === 'FORM' || t.id === 'dlgBody' || t.classList?.contains('miniBody')) return true;
  return false;
}

const whatOf = f => f.dataset?.guard || 'Label';
function showWarn(field, msg) {
  const d = field.closest('dialog');
  let w = d.querySelector(':scope > .labelWarn');
  if (!w) {
    w = document.createElement('div');
    w.className = 'labelWarn'; w.setAttribute('role', 'alert');
    w.onclick = () => w.remove();
    d.append(w);
  }
  const what = whatOf(field);
  // a field may say it in its own words (data-guard-msg: a Tilt's Color, OakBarn Brewery 2026-11-09)
  w.replaceChildren(Object.assign(document.createElement('b'), { textContent: '⚠ ' + (msg || field.dataset?.guardMsg || blankWarn(what)) }),
    Object.assign(document.createElement('span'), { textContent: msg ? (/@/.test(msg) ? 'It was taken out (@ and ~ become a space).' : 'It was taken out.') : what === 'Tilt Color' ? 'Choose a Color, or press Cancel.' : field.dataset?.guardNow ? 'Type it in, or press Cancel.' : `${what === 'Label' ? 'Type' : 'Pick'} a ${what}, or press Cancel.` }));
  clearTimeout(w._t); w._t = setTimeout(() => w.remove(), LABEL_WARN_MS);      // it goes away by itself after 5 seconds
  if (msg) return;
  field.classList.add('labelBlank');
  field.focus();
}

export function installLabelGuard(doc = document) {
  const stop = ev => {
    const f = guardingField(ev.target);
    if (!f || allowedWhileBlank(ev.target, f)) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    showWarn(f);
  };
  for (const type of ['pointerdown', 'mousedown', 'touchstart', 'click', 'dblclick']) doc.addEventListener(type, stop, { capture: true, passive: false });
  // Tab, Shift+Tab or Enter from a blank Label (or Port): stay on it
  doc.addEventListener('keydown', ev => {
    const t = ev.target;
    if (!['Tab', 'Enter'].includes(ev.key) || !t?.dataset || guardingField(t) !== t) return;
    if (ev.shiftKey && ev.key === 'Tab' && t.dataset.guardAllow) return;      // a Port may go back to the Interface
    ev.preventDefault(); ev.stopImmediatePropagation();
    showWarn(t);
  }, true);
  doc.addEventListener('focusin', ev => { if (ev.target?.dataset?.guard) ev.target.dataset.visited = '1'; }, true);
  // © ® ™ @ ~ typed or pasted in a Label are taken out at once (@ ~ become a space), and the same small box says why (Rule 3.4)
  doc.addEventListener('input', ev => {
    const t = ev.target;
    if (t?.dataset?.k !== 'label' || !t.closest?.('dialog[open]')) return;
    if (!LABEL_NO.test(t.value)) return;
    const at = t.selectionStart, before = t.value.length, msg = labelNoMsg(t.value);
    t.value = cleanLabel(t.value);
    try { t.setSelectionRange(at - (before - t.value.length), at - (before - t.value.length)); } catch { }
    showWarn(t, msg);
  }, true);
  const clear = ev => { if (ev.target?.classList?.contains('labelBlank') && !isBlank(ev.target.value)) ev.target.classList.remove('labelBlank'); };
  doc.addEventListener('input', clear, true); doc.addEventListener('change', clear, true);
}

if (typeof document !== 'undefined') installLabelGuard(document);
