// Machine translation notice (Rule 11.14, OakBarn Brewery, 2026-11-13: "when a different Language other than English is Chosen for
// the Help pop a Dialog with the Caveat that the Translation was by Machine and not Human in English and the Language Chosen with an
// Aknowlegement Button"). Picking any Help language other than English shows it, every time, in English and in that language.
export const MT_NOTICE = {
  en: {
    title: 'Machine translation',
    text: 'The Help in this language was translated by a machine, not by a person. It may have mistakes. The buttons, menus and screens stay in English. When in doubt, the English page is the one to trust.',
  },
  fr: {
    title: 'Traduction automatique',
    text: 'L’aide dans cette langue a été traduite par une machine, pas par une personne. Elle peut contenir des erreurs. Les boutons, les menus et les écrans restent en anglais. En cas de doute, la page anglaise fait foi.',
  },
};
export const MT_BUTTON = 'Acknowledge';      // the screens stay English (Rule 11.11)

// lang: the Help language just picked. Nothing for English. Returns a Promise that ends when Acknowledge is pressed.
export function showMachineNotice(lang, doc = document) {
  const t = MT_NOTICE[lang];
  if (lang === 'en' || !t) return Promise.resolve(false);
  const mk = (tag, attrs = {}, text) => { const e = doc.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; };
  const d = mk('dialog', { class: 'mtNotice', 'aria-labelledby': 'mtNoticeTitle' });
  const f = mk('form', { method: 'dialog' });
  f.append(mk('h3', { id: 'mtNoticeTitle' }, `⚠ ${MT_NOTICE.en.title} / ${t.title}`),
    mk('p', { lang: 'en' }, MT_NOTICE.en.text), mk('p', { lang }, t.text));
  const bar = mk('div', { class: 'bar' }), ok = mk('button', { value: 'ok', class: 'primary', title: 'Close this notice' }, MT_BUTTON);
  bar.append(mk('span', { class: 'spacer' }), ok); f.append(bar); d.append(f);
  doc.body.append(d);
  return new Promise(res => {
    d.addEventListener('cancel', e => e.preventDefault());          // Esc does not close it: Acknowledge does
    d.addEventListener('close', () => { d.remove(); res(true); });
    d.showModal(); ok.focus();
  });
}
