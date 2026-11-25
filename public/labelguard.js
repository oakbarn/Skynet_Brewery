// The Label can't be blank (Skynet Rule 18.28, OakBarn Brewery 2026-11-15, Blichmann RipTide Dialog 1): in any dialog with a Label
// field, while the Label is blank the Tab key and the mouse still reach every other field and icon of the dialog (a user may want
// the ⬆ two-line box, the ⬢, the Interface or the Tab first). Only Save / ➕ Add (and a box that gets no focus: greyed out or read
// only) wait for it: a small pop-up says "The Label cannot be blank." and goes away by itself after 5 seconds, and the Label gets
// the focus back. Enter on a blank Label stays on it, and leaving it for nothing (a click on empty space) gives it the focus back.
// The same for a Port, when the Device needs one, except that a blank Port never keeps the focus.
// One shared helper for every Device and Widget dialog: it watches the whole page, so a dialog needs no code of its own for the
// Label. A Port is marked by its dialog with data-guard="Port" and data-guard-allow="label device" (the fields it may go back to).
export const LABEL_WARN = 'The Label cannot be blank.';
export const LABEL_WARN_MS = 2000;      // 2 seconds, like every note (Rule 2.74; was 5)
export const blankWarn = what => `The ${what} cannot be blank.`;

export const isBlank = v => !String(v ?? '').trim();
import { LABEL_NO, labelNoMsg, cleanLabel } from './naming.js';
const isLabelField = t => t?.dataset?.k === 'label' && !!t.closest?.('dialog[open]');
// a Cancel button: data-close="cancel" (Properties), value="cancel", or a button whose text is Cancel / ✖ Cancel (the Rule 18 pop-ups)
// a Delete button: data-close="delete" (Properties, top and bottom), value="delete", or a button whose text starts with Delete / 🗑 Delete
// (Delete Pipe, Delete Hose ...). Delete never asks for a Label or a Port first (OakBarn Brewery, 2026-11-14: "I also tried to delete a
// Hose that had no label but the Delete button warned it needed one. Have Delete Delete without those types of issues"); its own
// "are you sure" still comes up
export const isDeleteButton = b => !!b && (b.dataset?.close === 'delete' || b.value === 'delete' || /^[^\p{L}\p{N}]*delete\b/iu.test(String(b.textContent ?? '').trim()));
// Cancel is called Close on every dialog now, with a boxed ✕ beside it (Rule 2.54, OakBarn Brewery 2026-11-18): all three let the user out
export const isCancelButton = b => !!b && (b.dataset?.close === 'cancel' || b.value === 'cancel' || b.classList?.contains?.('boxX') || /^[^\p{L}\p{N}]*(cancel|close)$/iu.test(String(b.textContent ?? '').trim()));

// Save, ➕ Add Device, ➕ Add Widget ...: the button that keeps what is in the dialog
export const isSaveButton = b => !!b && (b.value === 'ok' || b.dataset?.close === 'ok' || /^[^\p{L}\p{N}]*(save|add)\b/iu.test(String(b.textContent ?? '').trim()));
// the Label and the Port follow Rule 18.28; a box the program needs (Rule 18.33, data-guard-now) still holds the focus
export const isOpenGuard = f => !f?.dataset?.guardNow && (f?.dataset?.k === 'label' || f?.dataset?.guard === 'Port');
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
  if (isDeleteButton(t.closest?.('button'))) return true;      // Delete just deletes (it asks first, on its own)
  if (isOpenGuard(field)) {
    const b = t.closest?.('button');
    if (b) return !isSaveButton(b);       // ⬆ ⬢ ? and the rest; Save / ➕ Add wait
    const c = t.closest?.('input, select, textarea, label.sw');
    if (c) { const i = c.matches?.('label.sw') ? c.querySelector?.('input') : c; return !!i && !i.disabled && !i.readOnly; }
    // a field's name (its balloon; a double-click on it opens what it picked, like the Tab's settings) and anything else in the
    // dialog that is not a box: only Save / ➕ Add wait (OakBarn Brewery, 2026-11-15: a double-click on the Tab, Label blank, gave the warning)
    if (t.closest?.('dialog')) return true;
  }
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
  clearTimeout(w._t); w._t = setTimeout(() => w.remove(), LABEL_WARN_MS);      // it goes away by itself after 2 seconds
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
    if (isOpenGuard(t) && (ev.key === 'Tab' || t.dataset.k !== 'label')) return;      // Tab goes on; Enter stays only on a blank Label
    ev.preventDefault(); ev.stopImmediatePropagation();
    showWarn(t);
  }, true);
  doc.addEventListener('focusin', ev => { if (ev.target?.dataset?.guard) ev.target.dataset.visited = '1'; }, true);
  // a blank Label left for nothing (a click on empty space, a title, a greyed out box) gets the focus back
  doc.addEventListener('focusout', ev => {
    const t = ev.target, to = ev.relatedTarget, d = t?.closest?.('dialog[open]');
    if (!d || t.dataset?.k !== 'label' || guardingField(t) !== t || (to && (!d.contains(to) || to.matches?.('input, select, textarea, button')))) return;
    setTimeout(() => { const a = doc.activeElement; if (d.open && t.isConnected && (!a || a === doc.body || (d.contains(a) && !a.matches('input, select, textarea, button')))) t.focus(); }, 0);
  }, true);
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
  // no space at the start or end of a Label (OakBarn Brewery, 2026-11-11): trimmed as soon as the user leaves the box
  doc.addEventListener('change', ev => { const t = ev.target; if (isLabelField(t) && t.value !== t.value.trim()) t.value = t.value.trim(); }, true);
  const clear = ev => { if (ev.target?.classList?.contains('labelBlank') && !isBlank(ev.target.value)) ev.target.classList.remove('labelBlank'); };
  doc.addEventListener('input', clear, true); doc.addEventListener('change', clear, true);
}

if (typeof document !== 'undefined') installLabelGuard(document);
