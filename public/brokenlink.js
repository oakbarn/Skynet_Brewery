// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Broken Help links (OakBarn Brewery, 2026-11-12, Rule 11.10): "None Links outside of Help unless it is directed By me. If the Help
// Link in a Hover Help is Broken or not set, it opens Bing and takes me to a Page on the WEB. Broken links will be sent to
// support@oakbarnbrewery.com with the details of the Broken link, and a Pop Up Dialog saying that and a button to Send."
// A Help link (a hot spot in a Hover Help, or a link between Help pages) is checked before it opens. If its page or its part is not
// there, nothing opens (never a page on the web): a pop-up says the link is broken, with ✉ Send and ✖ Close. Send asks the Brain to
// email the details to OakBarn Brewery support; with no email set up on the Brain, the computer's own mail program opens with them.
export const SUPPORT_EMAIL = 'support@oakbarnbrewery.com';
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&\w+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const bare = n => String(n ?? '').replace(/^\d+[-_]/, '');

// the Help pages and the parts (heading ids) of each, read once
let index = null;
export function helpIndex(pages) {
  const m = new Map();
  for (const p of pages || []) {
    const parts = new Set();
    for (const l of String(p.text ?? '').split('\n')) { const h = /^#{1,6}\s+(.*)$/.exec(l); if (h) parts.add(slug(h[1].trim())); }
    m.set(p.name, parts); if (!m.has(bare(p.name))) m.set(bare(p.name), parts);
  }
  return m;
}
let loading = null;
function loadIndex() {
  if (index) return Promise.resolve(index);
  return loading ||= (async () => {
    try { const r = await fetch('/ui/help'); if (!r.ok) throw new Error('Help could not be read'); index = helpIndex(await r.json()); return index; }
    finally { loading = null; }
  })();
}
// a Help page saved or added: read them again next time
export const forgetHelpIndex = () => { index = null; };
// what is wrong with a link to [page, section], or '' when it is fine
export function topicProblem(idx, topic) {
  const [page, section] = topic || [];
  if (!page) return 'The link has no Help page set';
  const parts = idx.get(page) || idx.get(bare(page));
  if (!parts) return `There is no Help page "${page}"`;
  if (section && !parts.has(section)) return `The Help page "${page}" has no part "${section}"`;
  return '';
}
// read the Help pages once, early, so a click can be checked at once (a Help window must open in the click itself, or the
// browser blocks it)
export const preloadHelpIndex = () => loadIndex().catch(() => null);
// true when the topic can open; false after the pop-up was shown. Until Help has been read, the link is let through.
export function helpLinkOk(topic, where) {
  if (!index) { preloadHelpIndex(); return true; }
  const why = topicProblem(index, topic);
  if (!why) return true;
  brokenLinkPop({ where, link: (topic || []).filter(Boolean).join('#') || '(none)', why });
  return false;
}
export function brokenLinkPop({ where = 'Help', link = '', why = '' }) {
  const h = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); e.append(...kids); return e; };
  const details = [`Where: ${where}`, `Link: ${link}`, `What is wrong: ${why}`, `Page: ${location.pathname}${location.search}`, `Browser: ${navigator.userAgent}`, `When: ${new Date().toISOString()}`].join('\n');
  const said = h('p', { class: 'muted' });
  const d = h('dialog', { class: 'pumpPick brokenLink', 'data-nomenu': '' });
  const close = () => { d.close(); d.remove(); };
  const send = h('button', { type: 'button', class: 'primary', onclick: async () => {
    send.disabled = true; said.textContent = 'Sending ...';
    let sent = false;
    try { const r = await fetch('/ui/brokenlink', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ details }) }); sent = r.ok && !!(await r.json())?.sent; } catch { }
    if (sent) { said.textContent = `Sent to ${SUPPORT_EMAIL}. Thank you!`; return; }
    // no email set up on the Brain: the computer's own mail program, with the details filled in
    location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Skynet: a broken Help link')}&body=${encodeURIComponent(details)}`;
    said.textContent = `Your mail program opens with the details. Press its Send to send them to ${SUPPORT_EMAIL}.`;
  } }, '✉ Send');
  d.append(h('h3', {}, 'This Help link is broken'),
    h('p', {}, `The link you clicked does not go to a Help page, so nothing was opened. Press Send to send the details below to OakBarn Brewery (${SUPPORT_EMAIL}) so it can be fixed.`),
    h('pre', { class: 'brokenDetails' }, details), said,
    h('div', { class: 'bar' }, h('button', { type: 'button', onclick: close }, '✖ Close'), h('span', { class: 'spacer' }), send));
  d.oncancel = ev => { ev.preventDefault(); close(); };
  document.body.append(d); d.showModal(); send.focus();
}
