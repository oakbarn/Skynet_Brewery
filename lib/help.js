// Help tab: the manual is a folder of Markdown text files on the Brew Panel computer (help/*.md).
// Each file is one page. Its first "# " line is the page title; the file name sets the order ("01-getting-started.md").
// Admins can edit pages in the app, or edit the files with any text editor. The old copy is kept in help/backups/ on every save.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileStamp } from './filedate.js';

const NAME = /^[a-z0-9][a-z0-9_-]{0,79}$/i;
const MAX = 1024 * 1024;

// Help in French (OakBarn Brewery, 2026-11-13: "French Help Only forever", Rule 11.11). Only the Help is translated: the screens,
// buttons and labels stay English. A translation lives in a folder of its own inside help/ (help/fr/), with the same file names as
// the English pages. help/fr/_source.json says which English text each French page was made from (a short fingerprint of it), so a
// French page whose English page changed since is shown as "may be out of date" and a test fails until it is brought up to date.
// A third choice, the User Language (Rule 11.16): one language the user brought in by AI translation (lib/helplang.js). It lives in
// the Brain's data folder (data/help_user/), not in help/, so a Setup never touches it; it is there only when one was imported.
export const HELP_LANGS = { en: 'English', fr: 'Français', user: 'User Language' };
export const SOURCE_FILE = '_source.json';
// The Importer's own Help pages (Rule 11.3, OakBarn Brewery 2026-11-21: "BruControl is a forbidden word in Skynet Panel and Only used
// in the Importer"): kept in help/ for the Importer, but never listed or searched in the Panel's Help.
export const IMPORTER_HELP = new Set(['143-brucontrol-importer', '165-importer-item-and-widget-pages']);
export const sourceStamp = text => crypto.createHash('sha256').update(String(text ?? '').replace(/\r\n?/g, '\n')).digest('hex').slice(0, 16);
// the id a heading gets in the Help window (public/help.js: its words without marks, lower case, - between words), or the English id
// a translated heading carries: "## Pour commencer {#getting-started}"
export function headingId(heading) {
  const h = String(heading ?? '').replace(/^#+\s+/, '').replace(/\s*#*\s*$/, ''), id = /\{#([\w-]+)\}$/.exec(h);
  if (id) return id[1];
  return h.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[&<>"]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export const langOf = l => (Object.hasOwn(HELP_LANGS, String(l ?? '')) ? String(l) : 'en');

export class Help {
  // english: the English Help, when this one is a translation of it
  // userDir: where the User Language is (data/help_user/, Rule 11.16)
  constructor(dir, english = null, lang = 'en', userDir = null) { this.dir = dir; this.english = english; this.lang = lang; this.userDir = userDir; }

  // the Help in another language: help/<lang>/, falling back to the English page where it has none yet
  translation(lang) {
    lang = langOf(lang);
    if (lang === 'en' || this.english) return this;
    if (lang === 'user' && !this.userDir) return this;
    return (this.langs ??= {})[lang] ??= new Help(lang === 'user' ? this.userDir : path.join(this.dir, lang), this, lang);
  }

  // { name: fingerprint of the English text it was made from }
  sources() { try { return JSON.parse(fs.readFileSync(path.join(this.dir, SOURCE_FILE), 'utf8')); } catch { return {}; } }
  // marks a translated page as made from the English page as it is now
  stamp(name) {
    if (!this.english) throw new Error('Only a translation has a source to stamp');
    if (!fs.existsSync(this.file(name))) throw new Error(`No ${HELP_LANGS[this.lang]} page "${name}" yet`);
    const all = this.sources(); all[name] = sourceStamp(this.english.read(name));
    const sorted = Object.fromEntries(Object.entries(all).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })));
    fs.mkdirSync(this.dir, { recursive: true });
    fs.writeFileSync(path.join(this.dir, SOURCE_FILE), JSON.stringify(sorted, null, 1) + '\n');
  }
  // a translated page whose English page changed after it was made (or that was never stamped)
  stale(name, src = this.sources()) {
    if (!this.english) return false;
    let en; try { en = this.english.read(name); } catch { return false; }      // a page only in this language
    return src[name] !== sourceStamp(en);
  }

  file(name) {
    if (!NAME.test(String(name))) throw new Error('A page name may use letters, numbers, - and _ only');
    return path.join(this.dir, name + '.md');
  }

  // [{ name, title, text }] in file name order. The pages are small, so the text comes too (the Help tab searches it).
  list() {
    if (this.english) return this.listTranslated();
    let names = [];
    try { names = fs.readdirSync(this.dir).filter(f => f.endsWith('.md') && NAME.test(f.slice(0, -3))); } catch { }
    return names.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map(f => {
      const name = f.slice(0, -3), text = fs.readFileSync(path.join(this.dir, f), 'utf8');
      return { name, title: titleOf(text, name), text };
    });
  }

  // the translated pages, in the English order: a page not translated yet is the English page (lang 'en', missing: true);
  // a translated page whose English page changed since has stale: true
  listTranslated() {
    const own = new Help(this.dir).list(), byName = new Map(own.map(p => [p.name, p])), src = this.sources();
    const out = this.english.list().map(e => {
      const p = byName.get(e.name);
      return p ? { ...p, lang: this.lang, stale: this.stale(p.name, src) } : { ...e, lang: 'en', missing: true };
    });
    for (const p of own) if (!out.some(o => o.name === p.name)) out.push({ ...p, lang: this.lang, stale: false });      // a page only in this language
    return out.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }

  read(name) {
    const f = this.file(name);
    if (!fs.existsSync(f) && this.english) return this.english.read(name);      // not translated yet: the English page
    if (!fs.existsSync(f)) throw Object.assign(new Error(`No help page "${name}"`), { code: 404 });
    return fs.readFileSync(f, 'utf8');
  }

  write(name, text) {
    text = String(text ?? '');
    if (Buffer.byteLength(text) > MAX) throw new Error('A help page can be at most 1 MB');
    const f = this.file(name);
    fs.mkdirSync(this.dir, { recursive: true });
    if (fs.existsSync(f)) this.backup(name);
    fs.writeFileSync(f + '.tmp', text);
    fs.renameSync(f + '.tmp', f);
  }

  // New page from a title: "Mash steps" -> "12-mash-steps.md", numbered after the last page so it lands at the end.
  create(title) {
    title = String(title ?? '').trim();
    if (!title) throw new Error('Give the page a title');
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'page';
    const pages = this.list();
    const last = Math.max(0, ...pages.map(p => parseInt(p.name, 10)).filter(n => n >= 0));
    let name = `${String(last + 1).padStart(2, '0')}-${slug}`;
    for (let i = 2; pages.some(p => p.name === name); i++) name = `${String(last + 1).padStart(2, '0')}-${slug}-${i}`;
    this.write(name, `# ${title}\n\nWrite this page here.\n`);
    return name;
  }

  remove(name) {
    const f = this.file(name);
    if (!fs.existsSync(f)) throw Object.assign(new Error(`No help page "${name}"`), { code: 404 });
    this.backup(name);
    fs.unlinkSync(f);
  }

  backup(name) {
    const dir = path.join(this.dir, 'backups');
    fs.mkdirSync(dir, { recursive: true });
    const stamp = fileStamp();
    fs.copyFileSync(this.file(name), path.join(dir, `${name}_${stamp}.md`));
  }
}

export function titleOf(text, fallback = '') {
  const m = /^#[ \t]+(.+)$/m.exec(text);
  return m ? m[1].replace(/\s*\{#[\w-]+\}\s*$/, '').trim() : fallback;      // a translated heading may carry its English id: {#getting-started}
}
