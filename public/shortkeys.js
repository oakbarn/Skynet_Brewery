// Shortcut keys for typing text (Fritz, 2026-11-02). They work in every text and string box of the panel: Properties
// dialogs, Labels, Texts, the String Entry Dialogs (Rule 18.1), the Process editor and Schema.json.
//   Shift+Enter            types \n          (a new line code, Rich Text Embedded Code)
//   Ctrl+B     / ⌘+B       types \b ... \b   (bold): around the picked text, or a pair with the cursor in between
//   Ctrl+Shift+D / ⌘+Shift+D  types °F or °C (the ☰ Menu > Default tab Temperatures unit)
//   Ctrl+Y     / ⌘+Y       Redo (Ctrl+Shift+Z / ⌘+Shift+Z already redo in every browser)
// Copy, Cut, Paste, Paste as plain text and Undo are the browser's own and are left alone: every Skynet text box is plain
// text, so a paste is always plain. Safari has no ⌘+Shift+V of its own, so the panel pastes the plain text there.
// What is typed goes in through the browser's own typing, so Ctrl+Z / ⌘+Z undoes it like any other typing.
// No imports, so node can load it too (test/shortkeys.test.js).

export const BOLD = '\\b';
export const NEW_LINE = '\\n';

// the degree text for the panel's Temperatures unit ('F' or 'C'; anything else = °F, the US default)
export const degreeText = unit => String(unit ?? '').toUpperCase().startsWith('C') ? '°C' : '°F';

// which shortcut a key press is, or '' when it is none of ours
export function shortcutOf(ev) {
  const mod = !!(ev.ctrlKey || ev.metaKey), k = String(ev.key || '').toLowerCase();
  if (ev.altKey) return '';
  if (k === 'enter' && ev.shiftKey && !mod) return 'newline';
  if (!mod) return '';
  if (k === 'b' && !ev.shiftKey) return 'bold';
  if ((k === 'd' || ev.code === 'KeyD') && ev.shiftKey) return 'degree';
  if (k === 'y' && !ev.shiftKey) return 'redo';
  if (k === 'v' && ev.shiftKey) return 'plainpaste';
  return '';
}

// text, picked part [a, b) and shortcut -> { insert, selA, selB }: what replaces the picked part, and where the cursor or
// selection ends up afterwards (counted from the start of the text)
export function editFor(text, a, b, kind, unit) {
  const sel = String(text).slice(a, b);
  if (kind === 'newline') return { insert: NEW_LINE, selA: a + 2, selB: a + 2 };
  if (kind === 'degree') { const d = degreeText(unit); return { insert: d, selA: a + d.length, selB: a + d.length }; }
  if (kind === 'bold') {
    if (!sel) return { insert: BOLD + BOLD, selA: a + 2, selB: a + 2 };       // the cursor sits between the two codes
    return { insert: BOLD + sel + BOLD, selA: a + 2, selB: a + 2 + sel.length };  // the same words stay picked
  }
  return null;
}

// a box that takes typed text (not a password, number, date, tick box ...; not read-only or switched off)
const TEXT_TYPES = new Set(['text', 'search', 'url', 'email', 'tel', '']);
export function isTextBox(el) {
  if (!el || el.readOnly || el.disabled) return false;
  if (el.tagName === 'TEXTAREA') return true;
  return el.tagName === 'INPUT' && TEXT_TYPES.has(String(el.getAttribute('type') || '').toLowerCase());
}

// type text into a box the way the keyboard would (keeps Undo working), with a fallback for browsers without insertText
function typeInto(el, text) {
  el.focus();
  let ok = false;
  try { ok = document.execCommand('insertText', false, text); } catch { ok = false; }
  if (!ok) {
    el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

const isSafari = () => typeof navigator !== 'undefined' && /^((?!chrome|chromium|crios|fxios|android|edg).)*safari/i.test(navigator.userAgent);

// Hooks the keys up for the whole page. tempUnit() gives the Default tab's Temperatures unit ('F' or 'C').
export function installShortcutKeys(tempUnit = () => 'F') {
  document.addEventListener('keydown', ev => {
    if (ev.defaultPrevented || ev.isComposing) return;
    const el = ev.target;
    if (!isTextBox(el)) return;
    const kind = shortcutOf(ev);
    if (!kind) return;
    if (kind === 'plainpaste') {                    // the browser's own, except Safari, which has none
      if (!isSafari() || !navigator.clipboard?.readText) return;
      ev.preventDefault();
      navigator.clipboard.readText().then(t => typeInto(el, t)).catch(() => {});
      return;
    }
    ev.preventDefault();
    ev.stopImmediatePropagation();                  // so a box's own Enter (Save, OK) does not run on Shift+Enter
    if (kind === 'redo') { try { document.execCommand('redo'); } catch { /* nothing to redo */ } return; }
    let unit = 'F';
    try { unit = tempUnit(); } catch { unit = 'F'; }
    const a = el.selectionStart ?? el.value.length, b = el.selectionEnd ?? a;
    const ed = editFor(el.value, a, b, kind, unit);
    if (!ed) return;
    typeInto(el, ed.insert);
    el.setSelectionRange(ed.selA, ed.selB);
  }, true);
}
