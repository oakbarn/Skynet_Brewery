// Hover help (Skynet Rule 2.38, Fritz 2026-11-06: "Dialogs should be kept as clean as possible. Explanations of what it does
// need to be in a Hover Help. Hover over the Label of the dropdown or field and pop up Help as long as the hover is there").
// A field's name (a label with class tipLbl, or anything with data-help) keeps its explanation out of the dialog. Rest the mouse
// on the name and a small help box shows its explanation at once; it stays as long as the mouse is on the name and goes away
// when the mouse moves off. A tap (phones and tablets, Rule 2.35) or a click still opens the small pop-up with Close (Rule 18.16).
// One shared helper that watches the whole page, so every dialog of the Panel and of the BruControl Import gets it by itself.
export const HOVER_DELAY_MS = 0;        // Fritz, 2026-11-06: "Help for any Choice is always available instantly"
export const GAP = 6;                   // pixels between the name and the help box

// the help of an element: data-help, or the old title of a tip label or of anything in a dialog (a button, an icon), moved to
// data-help so the browser's own tooltip, which comes late and goes away by itself, does not show too (Fritz, 2026-11-06: "add
// hover over the Buttons as well")
export function helpOf(el) {
  if (!el) return '';
  if (el.dataset?.help) return el.dataset.help;
  if ((el.classList?.contains('tipLbl') || el.closest?.('dialog, [data-hover-titles]')) && el.getAttribute?.('title')) {
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

// A box you type in or pick from never shows hover help over itself (OakBarn Brewery, 2026-11-08: "The Hover Help for Connection
// covers the DDLB so no Choice can be made"): its open list of choices would be covered. Its help is on its name (Rule 2.38: "Hover
// over the Label of the dropdown or field"), a column heading, or a tick box; a box with focus never shows one either.
export const FIELD = 'select, option, optgroup, datalist, textarea, input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=reset])';
export const helpTarget = t => t?.closest?.(FIELD) ? null : t?.closest?.('[data-help], .tipLbl, dialog [title], [data-hover-titles] [title]') || null;      // the BruControl Import's pages: data-hover-titles on its body

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

// A snippet of a Help page for a dialog's title (Fritz, 2026-11-06: "You can take a snippet of help and have it in the Hover
// Dialog", "maybe over the Dialog Title"): the first paragraph under the page's title, or under the section asked for, as plain
// words (no ** or links), its first sentences up to about 220 letters.
export function helpSnippet(md, section = '') {
  const lines = String(md ?? '').replace(/\r/g, '').split('\n');
  let i = 0;
  if (section) {
    const want = String(section).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const at = lines.findIndex(l => /^#{1,6}\s/.test(l) && l.replace(/^#+\s*/, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() === want);
    if (at >= 0) i = at + 1;
  }
  const para = [], list = [];
  for (; i < lines.length; i++) {
    const l = lines[i].trim(), into = para.length && /:$/.test(para.at(-1));      // a line ending with : goes on into its list
    if (into && /^[-*]\s+/.test(l)) { list.push(l.replace(/^[-*]\s+/, '')); continue; }
    if (into && /^\|/.test(l)) { const c = l.split('|')[1]?.trim(); if (c && !/^-+$/.test(c) && lines[i + 1]?.trim().match(/^\|\s*-/) == null) list.push(c); continue; }
    if (into && list.length && !l) break;
    if (/^#/.test(l) || /^!\[/.test(l) || /^\|/.test(l) || /^```/.test(l)) { if (para.length && !into) break; continue; }
    if (!l) { if (para.length && !into) break; continue; }
    if (into) break;
    para.push(l.replace(/^[-*]\s+/, ''));
  }
  if (list.length) para.push(list.join(', ') + '.');
  let t = para.join(' ').replace(/\s*\([^()]*\b(Rule|Fritz)\b[^()]*\)/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/(\*{1,3}|`)([^*`]+)\1/g, '$2').replace(/\s+/g, ' ').trim();
  // the first sentences, up to about 220 letters (a snippet, not the page)
  const sentences = t.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [];
  let out = '';
  for (const x of sentences) { if (out && (out + x).length > 220) break; out += x; }
  t = out.trim();
  if (t.length > 320) t = t.slice(0, 320).replace(/\s+\S*$/, '') + ' …';
  return t;
}
// the snippet for a Help topic ([page, section], as the yellow ? Help opens it), read once from the Brain's Help pages
const snipCache = new Map();
let pageList = null;
export async function loadSnippet(topic) {
  const [want, section] = Array.isArray(topic) ? topic : [topic];
  if (!want) return '';
  const key = want + '#' + (section || '');
  if (!snipCache.has(key)) snipCache.set(key, (async () => {
    pageList ??= fetch('/ui/help').then(r => r.json()).catch(() => []);
    const list = await pageList, w = String(want).toLowerCase();
    const page = (Array.isArray(list) ? list : list.pages || []).find(p => p.name === w || p.name.replace(/^\d+-/, '') === w);
    if (!page) return '';
    const md = await fetch('/ui/help/' + encodeURIComponent(page.name)).then(r => (r.ok ? r.text() : '')).catch(() => '');
    return helpSnippet(md, section);
  })());
  return snipCache.get(key);
}

if (typeof document !== 'undefined') start(document);
