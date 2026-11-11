// Hover help (Skynet Rule 2.38, Fritz 2026-11-06: "Dialogs should be kept as clean as possible. Explanations of what it does
// need to be in a Hover Help. Hover over the Label of the dropdown or field and pop up Help as long as the hover is there").
// A field's name (a label with class tipLbl, or anything with data-help) keeps its explanation out of the dialog. Rest the mouse
// on the name and a small help box shows its explanation at once; it stays as long as the mouse is on the name and goes away
// when the mouse moves off. A tap (phones and tablets, Rule 2.35) or a click still opens the small pop-up with Close (Rule 18.16).
// One shared helper that watches the whole page, so every dialog of the Panel and of the BruControl Import gets it by itself.
export const HOVER_DELAY_MS = 0;        // Fritz, 2026-11-06: "Help for any Choice is always available instantly"
export const GAP = 6;                   // pixels between the name and the help box
export const LINK_WAIT_MS = 400;        // a balloon with hot spots stays this long after the mouse leaves its name, to reach a link

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

// a balloon's words as page parts: ⟦ ⟧ marks a part in red (the Label part of a Suggested Name, OakBarn Brewery, 2026-11-09), and the
// ⬢ and ⬆ show red, as the buttons do
export function helpNodes(text, doc = globalThis.document) {
  const out = [];
  // a line that starts with ⚠ is a warning: a red triangle and red bold words (Rule 6.20, OakBarn Brewery, 2026-11-10: the Heat Method's balloon)
  const lines = String(text ?? '').split('\n');
  if (lines.some(l => l.startsWith('⚠'))) {
    lines.forEach((l, n) => {
      if (n && !lines[n - 1].startsWith('⚠')) out.push(doc.createTextNode('\n'));      // a warning is its own block
      if (!l.startsWith('⚠')) { out.push(...helpNodes(l, doc)); return; }
      const w = doc.createElement('span'); w.className = 'hhWarn';
      const tri = doc.createElement('span'); tri.className = 'hhTri'; tri.textContent = '!';
      w.append(tri, doc.createTextNode(l.replace(/^⚠\s*/, ''))); out.push(w);
    });
    return out;
  }
  // ⟪img:path⟫ is a picture (a path in a media folder, as in Help) and ⟪b:words⟫ a heading in bold (OakBarn Brewery, 2026-11-10: the
  // Pump Label's balloon has its pictures, the same as the Help page)
  const pics = String(text ?? '').split(/⟪(img|b):([^⟫]*)⟫/);
  if (pics.length > 1) {
    for (let i = 0; i < pics.length; i += 3) {
      let t = pics[i] ?? '';
      if (i > 0 && pics[i - 2] === 'img') t = t.replace(/^\n+/, '');      // a picture is its own block: no empty line beside it
      if (pics[i + 1] === 'img') t = t.replace(/\n+$/, '');
      if (t) out.push(...helpNodes(t, doc));
      if (i + 2 >= pics.length) break;
      if (pics[i + 1] === 'b') { const b = doc.createElement('b'); b.className = 'hhHead'; b.textContent = pics[i + 2]; out.push(b); continue; }
      const im = doc.createElement('img'); im.className = 'hhPic'; im.alt = ''; im.src = '/media?path=' + encodeURIComponent(pics[i + 2]); out.push(im);
    }
    return out;
  }
  for (const [i, part] of String(text ?? '').split(/⟦|⟧/).entries()) {
    if (i % 2) { const m = doc.createElement('b'); m.className = 'hhMark'; m.textContent = part; out.push(m); continue; }
    for (const [j, bit] of part.split(/([⬢⬆])/).entries()) {
      if (!bit) continue;
      if (j % 2) { const ic = doc.createElement('span'); ic.className = 'hhIcon'; ic.textContent = bit; out.push(ic); } else out.push(doc.createTextNode(bit));
    }
  }
  return out;
}
// Hot spots (OakBarn Brewery, 2026-11-11: "in Hover help, Hot spots that take you to the bigger help about an Item in the Hover
// Help"): words in a balloon that have their own Help page are links to it. The Panel gives the list (helpmap.js HOT_SPOTS) and
// how to open Help; a page that gives none (the BruControl Import, whose Help is on hold) keeps plain words.
let spots = [], spotRe = null, openTopic = null;
const esc = w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function setHelpLinks(list, open) {
  spots = [...(list || [])].sort((a, b) => b[0].length - a[0].length);      // longer words first: Interface ID before Interface
  spotRe = spots.length ? new RegExp(`(?<![\\w~.@])(${spots.map(x => esc(x[0])).join('|')})(?![\\w~@])`, 'g') : null;
  openTopic = open || null;
}
// a text cut into plain parts and hot spots ({ t, topic }); a topic is a link only the first time it shows (seen is shared by a balloon)
export function hotSpotParts(text, seen = new Set()) {
  const t = String(text ?? ''), out = [];
  if (!spotRe) return [{ t }];
  let at = 0;
  for (const m of t.matchAll(spotRe)) {
    // a topic once; a whole page (Interface) not again after a part of it (Interface ID)
    const topic = spots.find(x => x[0] === m[1])?.[1], key = topic?.join('#');
    if (!topic || seen.has(key) || (topic.length < 2 && [...seen].some(k => k.split('#')[0] === topic[0]))) continue;
    seen.add(key);
    if (m.index > at) out.push({ t: t.slice(at, m.index) });
    out.push({ t: m[1], topic }); at = m.index + m[1].length;
  }
  if (at < t.length || !out.length) out.push({ t: t.slice(at) });
  return out;
}
// turns the hot spots in a balloon (or the tap pop-up) into links; a warning, a red mark and a heading are left as they are
export function linkify(root, doc = globalThis.document) {
  if (!root || !spotRe || !openTopic) return 0;
  const seen = new Set(), texts = [], walk = doc.createTreeWalker(root, 4);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) if (!n.parentElement?.closest('.hhWarn, .hhMark, .hhHead, .hhLink')) texts.push(n);
  let made = 0;
  for (const n of texts) {
    const parts = hotSpotParts(n.nodeValue, seen);
    if (parts.length === 1 && !parts[0].topic) continue;
    n.replaceWith(...parts.map(p => {
      if (!p.topic) return doc.createTextNode(p.t);
      made++;
      const a = doc.createElement('a'); a.className = 'hhLink'; a.href = '#'; a.textContent = p.t;
      a.title = ''; a.dataset.topic = p.topic.join('#');
      a.addEventListener('click', ev => {
        ev.preventDefault();
        a.closest('dialog.tipDlg')?.close();      // the tap pop-up closes; the balloon is put away by its own click
        openTopic(p.topic);
      });
      return a;
    }));
  }
  return made;
}
function start(doc = globalThis.document) {
  if (!doc || doc._hoverHelp) return;
  doc._hoverHelp = true;
  const tip = doc.createElement('div');
  tip.className = 'hoverHelp'; tip.setAttribute('role', 'tooltip');
  // a popover sits on top of every open dialog; an older browser gets it inside the open dialog instead
  const pop = typeof tip.showPopover === 'function';
  if (pop) tip.setAttribute('popover', 'manual');
  let timer = 0, on = null, later = 0;
  const hide = () => {
    clearTimeout(timer); clearTimeout(later); on = null;
    if (pop) { try { tip.hidePopover(); } catch { } } else tip.classList.remove('show');
    tip.remove();
  };
  const show = el => {
    const text = helpOf(el); if (!text || !el.isConnected) return;
    tip.replaceChildren(...helpNodes(text, doc));
    tip.classList.toggle('hhWide', text.includes('⟪img:'));      // a balloon with pictures is wider, so it fits on the screen
    tip.classList.toggle('hhHasLinks', linkify(tip, doc) > 0);      // hot spots: the mouse may go into the balloon to click one
    // inside an open dialog it stays a part of it, so its links can be clicked over a dialog that blocks the rest of the page
    (el.closest('dialog[open]') || doc.body).append(tip);
    if (pop) { try { tip.showPopover(); } catch { } } else tip.classList.add('show');
    const r = el.getBoundingClientRect(), b = tip.getBoundingClientRect();
    const p = placeBubble(r, { w: b.width, h: b.height }, { w: innerWidth, h: innerHeight });
    tip.style.left = p.left + 'px'; tip.style.top = p.top + 'px';
    for (const im of tip.querySelectorAll('img')) if (!im.complete) im.addEventListener('load', () => {      // placed again once its pictures are in
      if (!tip.isConnected) return;
      const b2 = tip.getBoundingClientRect(), p2 = placeBubble(el.getBoundingClientRect(), { w: b2.width, h: b2.height }, { w: innerWidth, h: innerHeight });
      tip.style.left = p2.left + 'px'; tip.style.top = p2.top + 'px';
    }, { once: true });
  };
  doc.addEventListener('pointerover', ev => {
    if (ev.pointerType && ev.pointerType !== 'mouse') return;       // a finger gets the tap pop-up (Rule 18.16), not a hover
    if (on && tip.contains(ev.target)) { clearTimeout(later); return; }      // into the balloon, to click a hot spot
    const el = helpTarget(ev.target);
    if (el === on) { clearTimeout(later); return; }
    if (!el && on && tip.classList.contains('hhHasLinks')) return;      // on the way to the balloon: it waits a moment (below)
    hide();
    if (!el || !helpOf(el)) return;
    on = el; timer = setTimeout(() => { if (on === el) show(el); }, HOVER_DELAY_MS);
  });
  doc.addEventListener('pointerout', ev => {
    if (!on) return;
    if (ev.relatedTarget && (on.contains(ev.relatedTarget) || tip.contains(ev.relatedTarget))) return;    // still on the name or its balloon
    if (!tip.classList.contains('hhHasLinks')) { hide(); return; }
    clearTimeout(later); later = setTimeout(hide, LINK_WAIT_MS);      // a balloon with hot spots waits, so the mouse can reach it
  });
  // a click, a key, a scroll or a dialog closing puts it away (a click on a hot spot opens its Help first)
  for (const k of ['pointerdown', 'keydown', 'scroll', 'close']) doc.addEventListener(k, ev => {
    if (!on || (k === 'pointerdown' && tip.contains(ev.target))) return;
    hide();
  }, true);
  tip.addEventListener('click', ev => { if (ev.target.closest?.('.hhLink')) setTimeout(hide); });
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
