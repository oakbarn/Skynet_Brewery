// Get Music Pack (OakBarn Brewery, 2026-11-18: "a Get Music Pack"; Skynet Rule 9.25): the optional Skynet Music Pack
// (public domain marches and bugle calls) is NOT in the Setups or in media/ of the code. Each pack is its own GitHub Release
// of the Skynet project; this asks GitHub which MP3s the Release has and copies the ones this Brain is missing into the
// pack's folder in media/sounds. Works the same on a Pi, Windows, Mac or Linux, with nothing to install and no GitHub account.
// It only ever adds (Rule #1 Never Take Away): a sound already on this Brain is never changed or deleted, and your own sounds
// are never touched.
// More packs later (OakBarn Brewery, 2026-11-20: "an Add On music pack", "subfolders on images and audio of Patron in Addition"):
// a pack is one row in PACKS (its Release tag and its folder). Patron packs land in a Patron subfolder; who may get one
// is Panel Updates sandbox entry 27 (parked), so no Patron pack is listed yet.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { SKYNET_REPO } from './skynetpics.js';

export const PACKS = [
  { key: 'music', title: 'Skynet Music Pack', tag: 'Skynet-Music-Pack', folder: 'Skynet_Music' },
  // { key: 'patron-music', title: 'Patron Music Pack', tag: 'Skynet-Patron-Music-Pack', folder: 'Skynet_Music/Patron', patron: true },  (entry 27)
];
const SAFE_REPO = /^[\w.-]+\/[\w.-]+$/;
const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9_-]*\.mp3$/;        // a Release file name: letters, digits, _ and -, an .mp3 (docs/Upload_Sounds_to_GitHub.md)
const MAX_FILE = 50 * 1024 * 1024;

export const sha256 = buf => crypto.createHash('sha256').update(buf).digest('hex');

export class MusicPack {
  // soundsDir(): this Brain's media/sounds; source: { repo } (Settings key musicPack, for testing a copy)
  constructor(soundsDir, { source = {}, fetcher = globalThis.fetch, packs = PACKS } = {}) {
    this.soundsDir = soundsDir; this.fetch = fetcher; this.packs = packs;
    this.repo = SAFE_REPO.test(source.repo ?? '') ? source.repo : SKYNET_REPO;
    this.busy = false; this.last = null;
  }

  pack(key) { const p = this.packs.find(x => x.key === (key || this.packs[0].key)); if (!p) throw new Error('No such Music Pack'); return p; }

  async _get(url, as = 'json') {
    let res;
    try { res = await this.fetch(url, { signal: AbortSignal.timeout(as === 'json' ? 15000 : 120000), headers: as === 'json' ? { Accept: 'application/vnd.github+json' } : {} }); }
    catch (e) { throw new Error(e.name === 'TimeoutError' ? 'GitHub did not answer. Is this Brain on the internet?' : `Could not reach GitHub (${e.message}). Is this Brain on the internet?`); }
    if (res.status === 404) throw Object.assign(new Error('The Music Pack is not on GitHub yet'), { code: 404 });
    if (res.status === 403 || res.status === 429) throw new Error('GitHub says "too many requests" from this internet address. Try again in an hour.');
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    return as === 'json' ? res.json() : Buffer.from(await res.arrayBuffer());
  }

  // What the pack's Release has, and what this Brain is missing: { title, folder, total, same, add: [{ name, size }] }
  async check(key) {
    const p = this.pack(key);
    const rel = await this._get(`https://api.github.com/repos/${this.repo}/releases/tags/${encodeURIComponent(p.tag)}`);
    if (!Array.isArray(rel.assets)) throw new Error('GitHub sent something unexpected');
    const want = rel.assets.filter(a => SAFE_NAME.test(a.name ?? '') && (a.state ?? 'uploaded') === 'uploaded');
    const add = want.filter(a => !this.have(p, a.name)).map(a => ({ name: a.name, size: a.size ?? 0, url: a.browser_download_url, digest: a.digest }));
    this.last = { key: p.key, items: new Map(add.map(a => [a.name, a])) };
    return { pack: p.key, title: p.title, folder: `sounds/${p.folder}`, total: want.length, same: want.length - add.length, add: add.map(({ name, size }) => ({ name, size })) };
  }

  // Copies the sounds picked from the last check (all of them when names is empty). A download is checked against GitHub's
  // size and fingerprint (sha256) and written to a temporary name first, so a broken download never lands.
  async get(key, names, onFile) {
    if (this.busy) throw new Error('Already getting the Music Pack');
    const p = this.pack(key);
    if (!this.last || this.last.key !== p.key) await this.check(p.key);
    const items = names?.length ? names.map(n => this.last.items.get(n)).filter(Boolean) : [...this.last.items.values()];
    this.busy = true;
    const saved = [], failed = [];
    try {
      for (const it of items) {
        try {
          if (it.size > MAX_FILE) throw new Error('larger than 50 MB');
          if (!/^https:\/\/github\.com\//.test(it.url ?? '')) throw new Error('not a GitHub download');
          const buf = await this._get(it.url, 'file');
          if (it.size && buf.length !== it.size) throw new Error('the download was damaged');
          const d = /^sha256:([0-9a-f]{64})$/.exec(it.digest ?? '');
          if (d && sha256(buf) !== d[1]) throw new Error('the download was damaged');
          if (this.have(p, it.name)) continue;            // never replace a sound this Brain already has
          const full = this.full(p, it.name), tmp = path.join(path.dirname(full), `.skynet-${process.pid}-${Date.now()}`);
          fs.mkdirSync(path.dirname(full), { recursive: true });
          try { fs.writeFileSync(tmp, buf); fs.renameSync(tmp, full); } finally { fs.rmSync(tmp, { force: true }); }
          saved.push(it.name); onFile?.(full);
        } catch (e) { failed.push(`${it.name}: ${e.message}`); }
      }
    } finally { this.busy = false; this.last = null; }
    return { saved, failed, folder: `sounds/${p.folder}` };
  }

  // this Brain already has the sound (any letter case counts: Windows does not tell them apart)
  have(p, name) {
    const full = this.full(p, name);
    if (fs.existsSync(full)) return true;
    try { return fs.readdirSync(path.dirname(full)).some(n => n.toLowerCase() === name.toLowerCase()); } catch { return false; }
  }

  full(p, name) {
    if (!SAFE_NAME.test(name)) throw new Error('Bad name');
    const base = path.join(this.soundsDir(), ...p.folder.split('/')), full = path.join(base, name);
    if (!full.startsWith(base + path.sep)) throw new Error('Bad path');
    return full;
  }
}
