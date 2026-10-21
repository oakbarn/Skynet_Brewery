// Panel version: version.json at the top of the panel, written by GitHub on every merge
// (.github/workflows/panel-version.yml), named <owner>-v.yyyymmdd_hh_mm: Skynet-v.... for oakbarn's own copy,
// the GitHub user name for someone else's copy (a fork). Never edit it by hand.
import fs from 'node:fs';
import path from 'node:path';
import { codeFingerprint } from './auth.js';

const NAME = /^[A-Za-z0-9-]+-v\.\d{8}_\d{2}_\d{2}(_\d+)?$/;
const when = v => v.slice(v.lastIndexOf('-v.') + 3);   // yyyymmdd_hh_mm[_n]: newer sorts later
const SAFE = /^[\w.-]+\/[\w.-]+$/;            // owner/repo
const CHECK_EVERY = 10 * 60 * 1000;           // ask GitHub at most every 10 minutes

// what this copy of the panel is; version '' when it was never stamped (copied by hand, or not merged yet).
// changed: the program files are not the ones GitHub stamped (a copy of a pull request not merged yet, or edited by hand)
export function readVersion(root) {
  try {
    const v = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8'));
    if (!NAME.test(v.version ?? '')) return { version: '' };
    return { version: v.version, merged: v.merged ?? '', commit: String(v.commit ?? '').slice(0, 7), owner: String(v.owner ?? ''), repo: SAFE.test(v.repo ?? '') ? v.repo : '', branch: String(v.branch ?? ''),
      changed: !!v.code && v.code !== codeFingerprint(root) };
  } catch { return { version: '' }; }
}

// the newest version on GitHub, from the same repository and branch this copy came from
export class VersionCheck {
  constructor(local, fetcher = globalThis.fetch) { this.local = local; this.fetch = fetcher; this.last = null; this.at = 0; }
  async latest() {
    const { version, repo, branch } = this.local;
    if (!version || !repo || !branch) return { state: 'unknown', text: 'This copy has no Panel version, so it cannot be compared with GitHub.' };
    if (this.last && Date.now() - this.at < CHECK_EVERY) return this.last;
    let r;
    try {
      const url = `https://raw.githubusercontent.com/${repo}/${branch.split('/').map(encodeURIComponent).join('/')}/version.json`;
      const res = await this.fetch(url, { signal: AbortSignal.timeout(6000), cache: 'no-store' });
      if (res.status === 404) throw new Error('GitHub has no Panel version yet, or the repository is private');
      if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
      const gh = JSON.parse(await res.text());
      if (!NAME.test(gh.version ?? '')) throw new Error('GitHub has no Panel version yet');
      r = this.local.changed ? { state: 'changed', latest: gh.version, text: `These files were changed after ${version} (a pull request not merged yet, or edited by hand). The latest merged version is ${gh.version}.` }
        : gh.version === version ? { state: 'current', latest: gh.version, text: 'Up to date: this is the latest merged version.' }
        : when(gh.version) > when(version) ? { state: 'old', latest: gh.version, merged: gh.merged ?? '', text: `A newer version is on GitHub: ${gh.version}.` }
          : { state: 'current', latest: gh.version, text: 'Up to date (GitHub has not caught up yet).' };
    } catch (e) {
      r = { state: 'unknown', text: `Could not check GitHub (${e.name === 'TimeoutError' ? 'no answer' : e.message}).` };
    }
    this.last = r; this.at = Date.now();
    return r;
  }
}
