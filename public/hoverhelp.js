// Hover help (Skynet Rule 2.38, Fritz 2026-11-06: "Dialogs should be kept as clean as possible. Explanations of what it does
// need to be in a Hover Help. Hover over the Label of the dropdown or field and pop up Help as long as the hover is there").
// A field's name (a label with class tipLbl, or anything with data-help) keeps its explanation out of the dialog. Rest the mouse
// on the name and a small help box shows its explanation at once; it stays as long as the mouse is on the name and goes away
// when the mouse moves off. A tap (phones and tablets, Rule 2.35) or a click still opens the small pop-up with Close (Rule 18.16).
// One shared helper that watches the whole page, so every dialog of the Panel and of the BruControl Import gets it by itself.
export const HOVER_DELAY_MS = 250;      // a short rest, so the help does not flash while the mouse passes over a name
export const GAP = 6;                   // pixels between the name and the help box

// the help of an element: data-help, or the old title of a tip label (moved to data-help so the browser's own tooltip, which
// comes late and goes away by itself, does not show too)
export function helpOf(el) {
  if (!el) return '';
  if (el.dataset?.help) return el.dataset.help;
  if (el.classList?.contains('tipLbl') && el.getAttribute?.('title')) {
    el.dataset.help = el.getAttribute('title'); el.removeAttribute('title');
    return el.dataset.help;
  }
  return '';
}

// where the help box goes: just under the name, or above it when there is no room below; kept on the screen
export function placeBubble(r, box, view) {
  let top = r.bottom + GAP;
  if (top + box.h > view.h - 4 && r.top - GAP - box.h >= 4) top = r.top - GAP - box.h;
  const left = Math.max(4, Math.min(r.left, view.w - box.w - 4));
  return { left: Math.round(left), top: Math.round(Math.max(4, top)) };
}

const helpTarget = t => t?.closest?.('[data-help], .tipLbl') || null;

function start(doc = globalThis.document) {
  if (!doc || doc._hoverHelp) return;
  doc._hoverHelp = true;
  const tip = doc.createElement('div');
  tip.className = 'hoverHelp'; tip.setAttribute('role', 'tooltip');
  // a popover sits on top of every open dialog; an older browser gets it inside the open dialog instead
  const pop = typeof tip.showPopover === 'function';
  if (pop) tip.setAttribute('popover', 'manual');
  let timer = 0, on = null;
  const hide = () => {
    clearTimeout(timer); on = null;
    if (pop) { try { tip.hidePopover(); } catch { } } else tip.classList.remove('show');
    tip.remove();
  };
  const show = el => {
    const text = helpOf(el); if (!text || !el.isConnected) return;
    tip.textContent = text;
    (pop ? doc.body : el.closest('dialog[open]') || doc.body).append(tip);
    if (pop) { try { tip.showPopover(); } catch { } } else tip.classList.add('show');
    const r = el.getBoundingClientRect(), b = tip.getBoundingClientRect();
    const p = placeBubble(r, { w: b.width, h: b.height }, { w: innerWidth, h: innerHeight });
    tip.style.left = p.left + 'px'; tip.style.top = p.top + 'px';
  };
  doc.addEventListener('pointerover', ev => {
    if (ev.pointerType && ev.pointerType !== 'mouse') return;       // a finger gets the tap pop-up (Rule 18.16), not a hover
    const el = helpTarget(ev.target);
    if (el === on) return;
    hide();
    if (!el || !helpOf(el)) return;
    on = el; timer = setTimeout(() => { if (on === el) show(el); }, HOVER_DELAY_MS);
  });
  doc.addEventListener('pointerout', ev => {
    if (!on) return;
    if (ev.relatedTarget && on.contains(ev.relatedTarget)) return;    // still on the name
    hide();
  });
  // a click, a key, a scroll or a dialog closing puts it away
  for (const k of ['pointerdown', 'keydown', 'scroll', 'close']) doc.addEventListener(k, () => { if (on) hide(); }, true);
}

if (typeof document !== 'undefined') start(document);
