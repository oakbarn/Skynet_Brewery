// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Outside web links open in the person's own default browser (OakBarn Brewery, 2026-11-12: "The link in the Help On Who's On First
// used Edge to open the Wikipedia Page and not my default browser"). On Windows the panel runs in Skynet's clean window, which is
// Edge (or Chrome) in app mode (Rule 2.36, lib/appwindow.js), so a link it opened itself stayed in Edge. On the panel's own computer
// a click on an outside link asks the Brain to hand it to the default browser; anywhere else (a phone, another PC), or when the
// Brain can't, the page opens it as before.
// the BruControl Importer's own page asks the Importer (/api/openlink); the Panel's pages ask the Panel (/ui/openlink)
const IMPORTER = !!document.querySelector('script[src="/importer/importer.js"]');
const LOCAL = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(location.hostname);
const outside = href => { try { const u = new URL(href, location.href); return (u.protocol === 'http:' || u.protocol === 'https:') && u.origin !== location.origin ? u.href : null; } catch { return null; } };

export async function openLink(href) {
  const url = outside(href);
  if (!url) return void window.open(href, '_blank', 'noopener');
  if (LOCAL) {
    try {
      const r = await fetch(IMPORTER ? '/api/openlink' : '/ui/openlink', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(IMPORTER ? { 'x-skynet-importer': '1' } : {}) }, body: JSON.stringify({ url }) });
      if (r.ok && (await r.json())?.opened) return;
    } catch { /* the page opens it itself */ }
  }
  window.open(url, '_blank', 'noopener');
}

// every outside link on the page, the Help's too
document.addEventListener('click', e => {
  if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) return;
  const a = e.target?.closest?.('a[href]');
  if (!a || !outside(a.getAttribute('href'))) return;
  e.preventDefault();
  openLink(a.href);
}, true);
