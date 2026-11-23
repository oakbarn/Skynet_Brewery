// Rule 18.53: every pop-up is on top (OakBarn Brewery, 2026-11-19: "the Change Name Pop Up is at a lower layer than the Dialog and
// not on top so cannot read it. So Popups need to be temporary Layer 1"; "All pop ups should be on top").
//
// The browser puts an open dialog (showModal) in its "top layer", above every z-index, and makes the rest of the page unclickable
// while it is open. So a message box (the toast), a notice bar, a Manual Valve's "Done" bar and the like were drawn behind the
// dialog, or could be seen but not clicked. Here every such pop-up:
//   1. is a popover (popover="manual"), shown again each time a dialog opens, so it is above the newest dialog (Layer 1 while it shows);
//   2. while a dialog is open, is moved into a small holder inside the top dialog, so its buttons can be clicked; it goes back to
//      the page (or to the dialog under it) when that dialog closes or is taken away.
// The holder stops clicks and keys from reaching the dialog's own handlers, so a click on a pop-up is not a change to the dialog.
// The small ⚠ boxes of Rule 18.28 (.labelWarn) and the Color Picker already sit inside their own dialog, and Hover Help is its own
// popover (public/hoverhelp.js); they are not touched here.

// the pop-ups, lowest first: the one shown last is on top (the old z-index order: the message box is the very top)
export const ON_TOP = ['.vpop', '#buildBack', '#undoNote', '.alertBar', '.mvAskBar', '#brewTimers', '#ovrPop', '#brainNotices', '#flameOutBox', '.jobPickBar', '#skySearch', '#toast'];
const SEL = ON_TOP.join(', ');
const HOST = 'onTopHost';

const canPop = typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function';
const order = [];      // dialogs in the order they were opened (showModal), the newest last
const moved = new Set();      // pop-ups now inside a dialog's holder

const isModal = d => { try { return d.isConnected && d.open && d.matches(':modal'); } catch { return d.isConnected && d.open; } };
// the dialog on top: the newest one still open and modal
export function topDialog() {
  for (let i = order.length - 1; i >= 0; i--) { if (isModal(order[i])) return order[i]; order.splice(i, 1); }
  return null;
}
function hostIn(d) {
  let host = d.querySelector(`:scope > .${HOST}`);
  if (!host) {
    host = document.createElement('div'); host.className = HOST;
    for (const t of ['click', 'dblclick', 'mousedown', 'pointerdown', 'keydown', 'keyup', 'input', 'change', 'submit']) host.addEventListener(t, ev => ev.stopPropagation());
    d.append(host);
  }
  return host;
}
// show it again as a popover, so it goes above everything open now; the focus stays where it was
function lift(el) {
  if (!canPop || !el.isConnected) return;
  if (!el.hasAttribute('popover')) el.setAttribute('popover', 'manual');
  const had = document.activeElement;
  try { if (el.matches(':popover-open')) el.hidePopover(); el.showPopover(); } catch { }
  if (had && had !== document.activeElement && had.isConnected) { try { had.focus({ preventScroll: true }); } catch { } }
}
const rank = el => { const i = ON_TOP.findIndex(s => el.matches(s)); return i < 0 ? 0 : i; };
// every pop-up on the page (and the ones in a holder that was taken away with its dialog)
function all() {
  const set = new Set(document.querySelectorAll(SEL));
  for (const el of moved) { if (el.parentNode?.classList?.contains(HOST)) set.add(el); else if (!el.isConnected) moved.delete(el); }
  return [...set].filter(el => !el.closest('.' + HOST) || el.parentNode?.classList?.contains(HOST)).sort((a, b) => rank(a) - rank(b));
}
let busy = false;
// put every pop-up where it belongs now and show it on top
export function raiseAll() {
  if (busy || typeof document === 'undefined' || !document.body) return;
  busy = true;
  try {
    const d = topDialog(), host = d && hostIn(d);
    for (const el of all()) {
      const want = host || document.body;
      if (el.parentNode !== want) { want.append(el); }
      if (host) moved.add(el); else moved.delete(el);
      lift(el);
    }
  } finally { busy = false; }
}
// one pop-up was just shown or changed (the message box): bring it to the top
export function raise(el) {
  if (!el) return;
  const d = topDialog();
  if (d && el.parentNode !== hostIn(d)) return raiseAll();
  lift(el);
}

function start() {
  if (typeof HTMLDialogElement === 'undefined' || HTMLDialogElement.prototype._onTop) return;
  HTMLDialogElement.prototype._onTop = true;
  const show = HTMLDialogElement.prototype.showModal;
  HTMLDialogElement.prototype.showModal = function (...a) {
    const r = show.apply(this, a);
    const i = order.indexOf(this); if (i >= 0) order.splice(i, 1);
    order.push(this);
    raiseAll();
    return r;
  };
  // a dialog closed: its pop-ups go back to the page or to the dialog under it
  document.addEventListener('close', ev => { if (ev.target instanceof HTMLDialogElement) raiseAll(); }, true);
  // a new pop-up added to the page, or a dialog (with pop-ups in it) taken away or redrawn
  const pick = n => n.nodeType === 1 && (n.matches(SEL) || n.tagName === 'DIALOG' || n.classList.contains(HOST) || (moved.size && n.querySelector?.('.' + HOST)));
  new MutationObserver(recs => {
    if (busy) return;
    for (const r of recs) {
      if ([...r.addedNodes].some(n => n.nodeType === 1 && n.matches(SEL)) || (moved.size && [...r.removedNodes].some(pick))) { raiseAll(); return; }
    }
  }).observe(document.body, { childList: true, subtree: true });
  raiseAll();
}
if (typeof document !== 'undefined') {
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
}
