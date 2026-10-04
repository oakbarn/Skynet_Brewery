// Help tab: the manual is a folder of Markdown text files on the Brew Panel computer (help/*.md).
// Each file is one page. Its first "# " line is the page title; the file name sets the order ("01-getting-started.md").
// Admins can edit pages in the app, or edit the files with any text editor. The old copy is kept in help/backups/ on every save.
import fs from 'node:fs';
import path from 'node:path';

const NAME = /^[a-z0-9][a-z0-9_-]{0,79}$/i;
const MAX = 1024 * 1024;

export class Help {
  constructor(dir) { this.dir = dir; }

  file(name) {
    if (!NAME.test(String(name))) throw new Error('A page name may use letters, numbers, - and _ only');
    return path.join(this.dir, name + '.md');
  }

  // [{ name, title, text }] in file name order. The pages are small, so the text comes too (the Help tab searches it).
  list() {
    let names = [];
    try { names = fs.readdirSync(this.dir).filter(f => f.endsWith('.md') && NAME.test(f.slice(0, -3))); } catch { }
    return names.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map(f => {
      const name = f.slice(0, -3), text = fs.readFileSync(path.join(this.dir, f), 'utf8');
      return { name, title: titleOf(text, name), text };
    });
  }

  read(name) {
    const f = this.file(name);
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
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync(this.file(name), path.join(dir, `${name}_${stamp}.md`));
  }
}

export function titleOf(text, fallback = '') {
  const m = /^#[ \t]+(.+)$/m.exec(text);
  return m ? m[1].trim() : fallback;
}
