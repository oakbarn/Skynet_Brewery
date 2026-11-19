// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// 🐞 Report a problem (Rule 2.61; OakBarn Brewery, 2026-11-19: "I will have other testers so an easy way for them to report bugs as
// well"): testers are not programmers, so one button opens a small box with two kinds of report, each on GitHub or by email:
//   🐞 A bug: GitHub's "Report a bug" form (.github/ISSUE_TEMPLATE/bug_report.yml)
//   🌐 The French Help: GitHub's French Help correction form (french_translation.yml), in English and French
// The Skynet version, the screen or Help page and the browser are filled in for the tester: GitHub fills a form's boxes from the
// address (the box ids version, where, page and browser). GitHub needs a free sign-in, so ✉ Email is always there too: the
// computer's own mail program opens with the same things filled in, to support@oakbarnbrewery.com. Nothing is sent by itself.
// GitHub opens in the default browser on the Brain's own computer (public/extlinks.js, loaded when pressed).
export const REPORT_REPO = 'oakbarn/Skynet_Brewery';
export const SUPPORT_EMAIL = 'support@oakbarnbrewery.com';
const NEW_ISSUE = `https://github.com/${REPORT_REPO}/issues/new`;

// the browser and computer, in plain words (Windows 11, Edge)
export function browserName(ua = navigator.userAgent) {
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows'
    : /Mac OS X|Macintosh/.test(ua) ? 'Mac' : /CrOS/.test(ua) ? 'Chromebook' : /Linux/.test(ua) ? 'Linux' : 'Other';
  const br = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\/|FxiOS/.test(ua) ? 'Firefox' : /Chrome\/|CriOS/.test(ua) ? 'Chrome'
    : /Safari\//.test(ua) ? 'Safari' : 'other browser';
  return `${os}, ${br}`;
}
// the address of a GitHub form with its boxes filled in. kind: 'bug' or 'fr'
export function reportUrl(kind, { version = '', where = '', page = '', browser = '' } = {}) {
  const q = new URLSearchParams(kind === 'fr' ? { template: 'french_translation.yml', page: page || where } : { template: 'bug_report.yml', where: where || page });
  if (version) q.set('version', version);
  if (browser) q.set('browser', browser);
  for (const [k, v] of [...q]) if (!v) q.delete(k);
  return `${NEW_ISSUE}?${q}`;
}
// the same report by email: the subject and the questions of the form, the known answers filled in
export function reportMail(kind, { version = '', where = '', page = '', browser = '' } = {}) {
  const fr = kind === 'fr';
  const subject = fr ? 'Skynet: French Help correction / Correction de l\'aide en français' : 'Skynet: a bug';
  const body = (fr ? [
    `Help page / Page d'aide: ${page || where}`, 'Part of the page / Partie de la page: ', '',
    'French text now / Texte français actuel:', '', '', 'Better French / Meilleur français:', '', '', 'Why / Pourquoi:', '', '',
    `Skynet version: ${version}`, `Computer and browser / Ordinateur et navigateur: ${browser}`]
    : ['What went wrong?', '', '', 'What were you doing?', '', '', 'What did you expect?', '', '',
      `Skynet version: ${version}`, `Screen or Help page: ${where || page}`, `Computer and browser: ${browser}`, '',
      '(A picture of the screen helps: attach it to this email.)']).join('\n');
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
// the Panel version (version.json), from the Brain
async function panelVersion() {
  try { const r = await fetch('/auth/status'); return (await r.json())?.version || ''; } catch { return ''; }
}

// the 🐞 Report a problem box. where: the screen or Help page it was opened from; page: the Help page (the Help window)
export async function reportDialog({ where = '', page = '', french = false } = {}) {
  const info = { version: await panelVersion(), where, page, browser: browserName() };
  const h = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); e.append(...kids); return e; };
  const d = h('dialog', { class: 'pumpPick reportDlg', 'data-nomenu': '' });
  const close = () => { d.close(); d.remove(); };
  const said = h('p', { class: 'muted' });
  const mail = kind => { location.href = reportMail(kind, info); said.textContent = `Your mail program opens with the details filled in. Write what happened, then press its Send to send it to ${SUPPORT_EMAIL}.`; };
  const row = (kind, title, text) => h('div', { class: 'reportRow' + (kind === 'fr' && french ? ' here' : '') },
    h('div', {}, h('b', {}, title), h('div', { class: 'muted' }, text)),
    h('div', { class: 'reportBtns' },
      h('button', { type: 'button', class: 'primary', title: 'Opens the form on GitHub, with the version, the page and the browser filled in. GitHub needs a free sign-in.', onclick: async () => (await import('./extlinks.js')).openLink(reportUrl(kind, info)) }, 'GitHub'),
      h('button', { type: 'button', title: `Opens your mail program with the details filled in, to ${SUPPORT_EMAIL}. No GitHub sign-in needed.`, onclick: () => mail(kind) }, '✉ Email')));
  const x = h('button', { type: 'button', class: 'boxX', title: 'Close', 'aria-label': 'Close', onclick: close }, '✕');
  d.append(
    h('div', { class: 'bar' }, h('h3', {}, '🐞 Report a problem'), h('span', { class: 'spacer' }),
      h('span', { class: 'dlgBtnGroup' }, h('button', { type: 'button', onclick: close }, 'Close'), x)),
    h('p', {}, 'Found something wrong? Tell OakBarn Brewery. Pick what it is, then GitHub or Email. The details below are filled in for you, and nothing is sent until you press Send.'),
    row('bug', '🐞 A bug', 'Something did not work, or did something you did not expect.'),
    row('fr', '🌐 The French Help / L\'aide en français', 'A better French wording for a Help page. / Une meilleure traduction pour une page d\'aide.'),
    h('pre', { class: 'brokenDetails' }, [`Skynet version: ${info.version || '(not stamped)'}`, `Screen or Help page: ${where || page || '(write it in the form)'}`, `Computer and browser: ${info.browser}`].join('\n')),
    h('p', { class: 'muted' }, 'GitHub needs a free GitHub sign-in. No sign-in? Press ✉ Email.'), said);
  d.oncancel = ev => { ev.preventDefault(); close(); };
  document.body.append(d); d.showModal();
}
