// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Help in any language by AI translation (Rule 11.16, Help 242; OakBarn Brewery, 2026-11-20: "So there would be 3 choices of Help.
// English, French, User Language."). The User Language is the one an Admin brought in on this Brain: it shows as a third choice in
// 🌐 Help language, with its own Override and Stop words (Rule 11.11) and machine translation notice (Rule 11.14).
// 🌐 Languages (Admins, in the Help page bar) holds the rest: Export the Help for an AI, Import the translation back, the Keep English
// words, and Add Font to Brain (one warning first, with ▶ Next and Abandon: "Before a Font is added in the Add Font prompts").
import { SAFETY_WORDS } from './screenwords.js';
import { MT_NOTICE } from './mtnotice.js';
import { LANG_KEY, refreshBalloonLang } from './hoverhelp.js';

export const USER = 'user';
let info = null, infoLoading = null;
// the User Language from the Brain (null when none was imported); fills in its words for the screens that use them
export function loadUserLang(again = false) {
  if (again) infoLoading = null;
  infoLoading ??= fetch('/ui/helplang/info').then(r => (r.ok ? r.json() : {})).then(d => {
    info = d?.user || null;
    if (info) {
      SAFETY_WORDS.user = info.words || {};
      const en = MT_NOTICE.en;      // its notice in the User Language's own words (Rule 11.14), English where the AI gave none
      MT_NOTICE.user = Object.fromEntries([['title', info.notes?.['notice-title'] || en['title']], ['text', info.notes?.['notice-text'] || en['text']]]);
    } else { delete SAFETY_WORDS.user; delete MT_NOTICE.user; }
    for (const sel of document.querySelectorAll('select#hpLang')) addOption(sel);
    if (!info) { try { if (localStorage.getItem(LANG_KEY) === USER) localStorage.setItem(LANG_KEY, 'en'); } catch { } }
    globalThis.dispatchEvent?.(new CustomEvent('skynet-userlang', { detail: info }));
    return info;
  }).catch(() => { infoLoading = null; return null; });
  return infoLoading;
}
export const userLang = () => info;
// the third choice in a 🌐 Help language list
function addOption(sel) {
  let o = sel.querySelector('option[value="user"]');
  if (!info) { o?.remove(); return; }
  if (!o) { o = document.createElement('option'); o.value = USER; sel.append(o); }
  o.textContent = '🌐 ' + info.name;
  try { if (localStorage.getItem(LANG_KEY) === USER) sel.value = USER; } catch { }
}

// ---------------- 🌐 Languages (Admins) ----------------
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); }
  e.append(...kids.filter(k => k != null)); return e;
};
async function call(method, url, body, raw) {
  const r = await fetch(url, { method, headers: { 'Content-Type': raw ? 'application/octet-stream' : 'application/json' }, body: body === undefined ? undefined : raw ? body : JSON.stringify(body) });
  const d = await r.json(); if (!r.ok || d.ok === false) throw new Error(d.error || r.statusText); return d;
}
const pad = n => String(n).padStart(2, '0');
function download(name, text) {
  const a = h('a', { href: URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' })), download: name });
  document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

// the one warning of Add Font to Brain, its first screen (OakBarn Brewery, 2026-11-20: "Go ahead and add the Right to left will not
// work in the same waring. Just one"; "first thing that comes up in the Font Add to Brain. Warning witch Next and Abandon")
export const FONT_WARNING = 'Fonts added here are not tested and may not work. Right-to-left languages (such as Arabic or Hebrew) will not work.';
export function addFontDialog(done) {
  const d = h('dialog', { class: 'pumpPick langDlg', 'data-nomenu': '' });
  const close = () => { d.close(); d.remove(); };
  const pick = h('input', { type: 'file', accept: '.woff2,.woff,.ttf,.otf', hidden: true });
  pick.onchange = async () => {
    const f = pick.files?.[0]; if (!f) return;
    try { const r = await call('PUT', '/ui/helplang/font?name=' + encodeURIComponent(f.name), await f.arrayBuffer(), true); close(); done?.(r); }
    catch (e) { d.querySelector('.langSaid').textContent = e.message; }
  };
  d.append(
    h('div', { class: 'bar' }, h('h3', {}, '🔤 Add Font to Brain'), h('span', { class: 'spacer' }),
      h('span', { class: 'dlgBtnGroup' }, h('button', { type: 'button', class: 'primary', title: 'Go on: pick the font file (.woff2, .woff, .ttf or .otf) on this computer', onclick: () => pick.click() }, '▶ Next'),
        h('button', { type: 'button', title: 'Close: nothing is added', onclick: close }, 'Abandon'))),
    h('div', { class: 'helpWarn' }, h('span', { class: 'hhTri' }), FONT_WARNING),
    h('p', { class: 'langSaid muted' }), pick);
  d.oncancel = ev => { ev.preventDefault(); close(); };
  document.body.append(d); d.showModal();
}

const FONT_NAMES = { 'noto-sans-sc': 'Chinese (Simplified)', 'noto-sans-jp': 'Japanese', 'noto-sans-kr': 'Korean', 'noto-sans-thai': 'Thai', 'noto-sans-devanagari': 'Hindi' };
export async function languagesDialog() {
  const d = h('dialog', { class: 'pumpPick langDlg', 'data-nomenu': '' });
  const close = () => { d.close(); d.remove(); };
  const body = h('div');
  const said = h('p', { class: 'muted', 'aria-live': 'polite' });
  const keepBox = h('textarea', { rows: 5, class: 'langKeep', placeholder: 'One word or phrase per line', title: 'Your own Keep English words on this Brain, one per line. They are added to the Skynet list above.' });
  const saveKeep = async () => {
    try { await call('PUT', '/ui/helplang/keep', keepBox.value, true); said.textContent = '✔ Saved'; setTimeout(() => { if (said.textContent === '✔ Saved') said.textContent = ''; }, 2000); await fill(); }
    catch (e) { said.textContent = e.message; }
  };
  d.append(h('div', { class: 'bar' }, h('h3', {}, '🌐 Help languages'), h('span', { class: 'spacer' }),
    h('span', { class: 'dlgBtnGroup' },
      h('button', { type: 'button', title: 'Save your own Keep English words', onclick: saveKeep }, 'Save'),
      h('button', { type: 'button', onclick: close }, 'Close'),
      h('button', { type: 'button', class: 'boxX', title: 'Close', 'aria-label': 'Close', onclick: close }, '✕'))), body, said);
  d.oncancel = ev => { ev.preventDefault(); close(); };

  async function fill() {
    const st = await call('GET', '/ui/helplang');
    const u = st.user;
    // 1. what this Brain has
    const now = u ? h('p', {}, h('b', {}, `🌐 ${u.name}`), u.english && u.english !== u.name ? ` (${u.english})` : '',
      `: ${u.pages} of ${u.total} pages${u.stale ? ` (${u.stale} out of date)` : ''}, ${u.balloons} of ${u.balloonsTotal} balloons.`)
      : h('p', { class: 'muted' }, 'No User Language yet. English and Français come with Skynet; one more language can be added here.');
    // 2. Export
    const onlyNew = h('input', { type: 'checkbox', checked: !!u, disabled: !u });
    const kb = h('input', { type: 'number', min: 4, max: 2000, step: 1, value: st.partKB, style: 'width:6em', title: 'How much English goes in each part. An AI chat takes about 40 KB at a time; make it smaller if the AI stops part way.' });
    const parts = h('div', { class: 'langParts' });
    const exp = async () => {
      try {
        const r = await call('POST', '/ui/helplang/export', { onlyNew: onlyNew.checked, partKB: Number(kb.value) });
        if (!r.parts.length) { parts.replaceChildren(h('p', { class: 'muted' }, 'Nothing new to translate.')); return; }
        const n = r.parts.length;
        parts.replaceChildren(...r.parts.map((t, i) => h('button', { type: 'button', title: 'Save this part as a text file', onclick: () => download(`Skynet_Help_Translate_Part_${pad(i + 1)}_of_${pad(n)}.txt`, t) }, `⬇ Part ${i + 1} of ${n}`)));
      } catch (e) { said.textContent = e.message; }
    };
    // 3. Import
    const files = h('input', { type: 'file', accept: '.txt,text/plain', multiple: true, hidden: true });
    const result = h('div');
    files.onchange = async () => {
      const list = [...files.files]; files.value = '';
      if (!list.length) return;
      try {
        said.textContent = 'Importing ...';
        const r = await call('POST', '/ui/helplang/import', { files: await Promise.all(list.map(f => f.text())) });
        said.textContent = '';
        const t = r.taken;
        const lines = [h('p', {}, h('b', {}, `✔ ${r.name}: `), t ? `${t.pages} pages, ${t.balloons} balloons, ${t.pictures} picture words, ${t.words} buttons and ${t.notes} notes taken.` : 'nothing taken.')];
        if (r.backup) lines.push(h('p', { class: 'muted' }, `The language that was here before is kept in data/help_user_backups/${r.backup}.`));
        if (r.fontsMissing?.length) lines.push(h('p', {}, `This language uses ${r.fontsMissing.join(', ')} letters. Phones and PCs show them; a screen plugged into the Brain may need the Skynet Language Fonts Setup (Releases page, next to Skynet Brewer Setup).`));
        // ONE warning with every problem (the good pieces were kept)
        if (r.problems?.length) lines.push(h('div', { class: 'helpWarn' }, h('span', { class: 'hhTri' }),
          h('div', {}, `${r.problems.length} piece${r.problems.length === 1 ? '' : 's'} stayed English:`, h('ul', { class: 'langProblems' }, ...r.problems.map(p => h('li', {}, p))))));
        result.replaceChildren(...lines);
        await loadUserLang(true); refreshBalloonLang(true);
        globalThis.dispatchEvent?.(new CustomEvent('skynet-help-reload'));
        await fill(); body.append(result);
      } catch (e) { said.textContent = e.message; }
    };
    // 4. Keep English
    keepBox.value = st.ownKeep;
    // 5. Fonts
    const fontRows = st.fonts.map(f => h('li', {}, `${f.file} (${Math.round(f.size / 1024)} KB) `,
      h('button', { type: 'button', class: 'danger', title: 'Take this font off the Brain (it is moved to data/help_user_backups/fonts, not deleted)', onclick: async () => {
        if (!confirm(`Delete the font ${f.file}?`)) return;
        try { await call('DELETE', '/ui/helplang/font/' + encodeURIComponent(f.file)); await fill(); } catch (e) { said.textContent = e.message; }
      } }, 'Delete')));
    body.replaceChildren(...[
      now,
      h('h4', {}, '1. Export'),
      h('p', { class: 'muted' }, 'Saves the Help as text files, in parts. Paste one part at a time into any AI (Claude, ChatGPT ...), ask it to translate it into your language, and save its answer as a text file.'),
      h('div', { class: 'bar' }, h('label', { title: 'Only the pages, balloons and words this User Language does not have yet, or that changed since it was translated' }, onlyNew, ' Only new and changed'),
        h('label', {}, 'Part size (KB) ', kb), h('button', { type: 'button', class: 'primary', onclick: exp }, '⬇ Export')), parts,
      h('h4', {}, '2. Import'),
      h('p', { class: 'muted' }, 'Pick every translated part (you can pick them all at once). After you supply Skynet the files, no other user input is needed. A different language replaces the one here; the old one is kept as a backup.'),
      h('div', { class: 'bar' }, h('button', { type: 'button', class: 'primary', onclick: () => files.click() }, '⬆ Import'), files),
      h('h4', {}, 'Keep English'),
      h('p', { class: 'muted' }, 'Brewing words that are never translated. A translated page shows each one in English with its meaning next to it: Mash (Maische).'),
      h('p', { class: 'langKeepList' }, st.keep.join(', ') || '(none)'),
      h('label', {}, 'Your own words on this Brain'), keepBox,
      h('h4', {}, 'Fonts'),
      h('p', { class: 'muted' }, st.packageFonts.length ? `Skynet Language Fonts: ${st.packageFonts.map(f => FONT_NAMES[f] || f).join(', ')}.` : 'Skynet Language Fonts: not installed (the Skynet Language Fonts Setup on the Releases page adds them).'),
      st.fonts.length ? h('ul', {}, ...fontRows) : null,
      h('div', { class: 'bar' }, h('button', { type: 'button', onclick: () => addFontDialog(fill) }, '🔤 Add Font to Brain'))].filter(Boolean));
  }
  document.body.append(d); d.showModal();
  try { await fill(); } catch (e) { said.textContent = e.message; }
}

if (typeof document !== 'undefined') loadUserLang();
