// Get new Skynet pictures (Fritz, 2026-10-22): the panel asks GitHub which pictures Skynet has in media/Images/Skynet
// and copies the ones this Brain is missing (or has an older copy of) into its own media/Images/Skynet.
// Works the same on a Pi, Windows, Mac or Linux, with nothing to install and no GitHub account: the repository is public.
// It only ever adds or refreshes Skynet pictures; it never deletes a file, and never touches your own pictures.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PICTURE } from './mediafiles.js';

export const SKYNET_REPO = 'oakbarn/Skynet_Brewery';     // where Skynet keeps its pictures (its default branch)
const PREFIX = 'media/Images/Skynet/';
const SAFE_REPO = /^[\w.-]+\/[\w.-]+$/;
const MAX_FILE = 20 * 1024 * 1024;

// The id GitHub gives a file (its "blob sha"): the same bytes give the same id, so a changed picture is easy to spot.
export const blobSha = buf => crypto.createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');

export class SkynetPictures {
  // imagesDir(): this Brain's media/Images; source: { repo, branch } (Settings key skynetPictures, for testing a copy)
  constructor(imagesDir, { source = {}, fetcher = globalThis.fetch } = {}) {
    this.imagesDir = imagesDir; this.fetch = fetcher;
    this.repo = SAFE_REPO.test(source.repo ?? '') ? source.repo : SKYNET_REPO;
    this.branch = String(source.branch ?? '') || 'HEAD';
    this.busy = false;
  }

  async _get(url, as = 'json') {
    let res;
    try { res = await this.fetch(url, { signal: AbortSignal.timeout(as === 'json' ? 15000 : 60000), headers: as === 'json' ? { Accept: 'application/vnd.github+json' } : {} }); }
    catch (e) { throw new Error(e.name === 'TimeoutError' ? 'GitHub did not answer. Is this Brain on the internet?' : `Could not reach GitHub (${e.message}). Is this Brain on the internet?`); }
    if (res.status === 404) throw new Error(`GitHub can't find ${this.repo}: it may be private, or renamed`);
    if (res.status === 403 || res.status === 429) throw new Error('GitHub says "too many requests" from this internet address. Try again in an hour.');
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    return as === 'json' ? res.json() : Buffer.from(await res.arrayBuffer());
  }

  // What GitHub has, and what this Brain needs: { commit, total, add: [..], update: [..], same }
  // add / update entries: { path (inside Images/Skynet), size }
  async check() {
    const t = await this._get(`https://api.github.com/repos/${this.repo}/git/trees/${encodeURIComponent(this.branch)}?recursive=1`);
    if (!Array.isArray(t.tree)) throw new Error('GitHub sent something unexpected');
    const want = t.tree.filter(e => e.type === 'blob' && e.path.startsWith(PREFIX) && PICTURE.test(e.path) && safeRel(e.path.slice(PREFIX.length)));
    const add = [], update = [];
    for (const e of want) {
      const rel = e.path.slice(PREFIX.length), full = this.full(rel);
      const item = { path: rel, size: e.size ?? 0, sha: e.sha };
      if (!fs.existsSync(full)) add.push(item);
      else if (blobSha(fs.readFileSync(full)) !== e.sha) update.push(item);
    }
    this.last = { commit: t.sha, items: new Map([...add, ...update].map(i => [i.path, i])) };
    return { repo: this.repo, commit: String(t.sha ?? '').slice(0, 7), total: want.length, add: add.map(strip), update: update.map(strip), same: want.length - add.length - update.length, truncated: !!t.truncated };
  }

  // Copies the pictures picked from the last check (all of them when paths is empty). Each one is checked against
  // GitHub's id before it is saved, and written to a temporary name first, so a broken download never lands.
  async get(paths, onFile) {
    if (this.busy) throw new Error('Already getting pictures');
    if (!this.last) await this.check();
    const items = paths?.length ? paths.map(p => this.last.items.get(p)).filter(Boolean) : [...this.last.items.values()];
    this.busy = true;
    const saved = [], failed = [];
    try {
      for (const it of items) {
        try {
          if (it.size > MAX_FILE) throw new Error('larger than 20 MB');
          const url = `https://raw.githubusercontent.com/${this.repo}/${this.last.commit}/${(PREFIX + it.path).split('/').map(encodeURIComponent).join('/')}`;
          const buf = await this._get(url, 'file');
          if (blobSha(buf) !== it.sha) throw new Error('the download was damaged');
          const full = this.full(it.path), tmp = path.join(path.dirname(full), `.skynet-${process.pid}-${Date.now()}`);
          fs.mkdirSync(path.dirname(full), { recursive: true });
          try { fs.writeFileSync(tmp, buf); fs.renameSync(tmp, full); } finally { fs.rmSync(tmp, { force: true }); }
          saved.push(it.path); onFile?.(full);
        } catch (e) { failed.push(`${it.path}: ${e.message}`); }
      }
    } finally { this.busy = false; this.last = null; }
    return { saved, failed };
  }

  full(rel) {
    const base = path.join(this.imagesDir(), 'Skynet'), full = path.join(base, ...rel.split('/'));
    if (!full.startsWith(base + path.sep)) throw new Error('Bad path');
    return full;
  }
}
const strip = ({ path: p, size }) => ({ path: p, size });
// a path inside Images/Skynet that stays there: no "..", no hidden names, no backslashes
const safeRel = rel => !!rel && !rel.includes('\\') && rel.split('/').every(p => p && p !== '..' && !p.startsWith('.'));
