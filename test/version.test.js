// Panel version: version.json (stamped by GitHub on every merge) and the "up to date" check
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readVersion, VersionCheck } from '../lib/version.js';
import { codeFingerprint } from '../lib/auth.js';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bp-ver-'));
fs.mkdirSync(path.join(root, 'lib'));
fs.writeFileSync(path.join(root, 'server.js'), '// panel');
assert.deepEqual(readVersion(root), { version: '' }, 'no version.json: not stamped');

const stamp = (v, extra = {}) => fs.writeFileSync(path.join(root, 'version.json'), JSON.stringify({ version: v, merged: '2026-10-21T16:00:00Z', commit: 'abcdef1234', code: codeFingerprint(root), repo: 'oakbarn/Skynet_Brewery', branch: 'claude/project-thread-vzxi0a', ...extra }));
stamp('not a version');
assert.equal(readVersion(root).version, '', 'a wrong name is ignored');
stamp('Skynet-v.20261021_16_00');
const v = readVersion(root);
assert.equal(v.version, 'Skynet-v.20261021_16_00');
assert.equal(v.commit, 'abcdef1');
assert.equal(v.changed, false);

const gh = (version, status = 200) => async url => {
  assert.equal(url, 'https://raw.githubusercontent.com/oakbarn/Skynet_Brewery/claude/project-thread-vzxi0a/version.json');
  return { ok: status === 200, status, text: async () => JSON.stringify({ version }) };
};
assert.equal((await new VersionCheck(v, gh('Skynet-v.20261021_16_00')).latest()).state, 'current');
const old = await new VersionCheck(v, gh('Skynet-v.20261022_08_15')).latest();
assert.equal(old.state, 'old');
assert.match(old.text, /Skynet-v\.20261022_08_15/);
assert.equal((await new VersionCheck(v, gh('Skynet-v.20261021_16_00_2')).latest()).state, 'old', 'a second merge in the same minute is newer');
assert.equal((await new VersionCheck(v, gh('', 404)).latest()).state, 'unknown', 'private or missing: cannot check');
assert.equal((await new VersionCheck(v, async () => { throw new Error('offline'); }).latest()).state, 'unknown');
assert.equal((await new VersionCheck({ version: '' }, gh('x')).latest()).state, 'unknown', 'not stamped: nothing to compare');

// someone else's copy (a fork): their GitHub user name instead of Skynet
stamp('brewer-42-v.20261021_16_00');
const fork = readVersion(root);
assert.equal(fork.version, 'brewer-42-v.20261021_16_00');
assert.equal((await new VersionCheck(fork, gh('brewer-42-v.20261021_16_00')).latest()).state, 'current');
assert.equal((await new VersionCheck(fork, gh('brewer-42-v.20261101_09_00')).latest()).state, 'old', 'newer by date, whatever the name');
stamp('bad name!-v.20261021_16_00');
assert.equal(readVersion(root).version, '', 'only GitHub user name characters');
stamp('Skynet-v.20261021_16_00');

// the program files changed after the stamp (a copy of a pull request, or edited by hand)
fs.writeFileSync(path.join(root, 'lib', 'new.js'), 'export {}');
const ch = readVersion(root);
assert.equal(ch.changed, true);
assert.equal((await new VersionCheck(ch, gh('Skynet-v.20261021_16_00')).latest()).state, 'changed');

// asks GitHub at most every 10 minutes
let calls = 0;
const vc = new VersionCheck(v, async (...a) => { calls++; return gh('Skynet-v.20261021_16_00')(...a); });
await vc.latest(); await vc.latest();
assert.equal(calls, 1);
fs.rmSync(root, { recursive: true, force: true });
console.log('version tests passed');
