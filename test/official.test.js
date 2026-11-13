// Official Skynet (Rule 9.14, lib/official.js): the core program files are checked against OakBarn Brewery's list on every start
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkOfficial, repair, makeList, coreFiles, fingerprint, setReadOnly, canLock, LIST_FILE, OFFICIAL_REPO } from '../lib/official.js';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bp-official-'));
// a test writing over a core file plays the brewer editing it: after Repair the file is Read-only, so it is made writable first
// (root ignores Read-only, a normal user such as the GitHub test runner does not)
const put = (f, t) => { const full = path.join(root, f); fs.mkdirSync(path.dirname(full), { recursive: true }); try { fs.chmodSync(full, fs.statSync(full).mode | 0o200); } catch { /* new file */ } fs.writeFileSync(full, t); };
const OFFICIAL = { 'server.js': '// panel\n', 'lib/a.js': 'export const a = 1;\n', 'public/app.js': 'app();\n', 'templates/t.json': '{}\n' };
for (const [f, t] of Object.entries(OFFICIAL)) put(f, t);
put('config/brewery.json', '{"mine":true}');            // yours: never checked
put('help/01-start.md', '# Mine');                      // Help pages: edited by Admins, never checked
put('node_modules/x/index.js', 'x');                    // made by npm on the Brain
const version = 'PR363_Skynet-v.20261112_17_00';
const stamp = (extra = {}) => fs.writeFileSync(path.join(root, 'version.json'), JSON.stringify({ version, owner: 'oakbarn', repo: OFFICIAL_REPO, ...extra }));
stamp();
const list = makeList(root);
assert.deepEqual(Object.keys(list).sort(), Object.keys(OFFICIAL).sort(), 'only the core files are listed');
assert.deepEqual(coreFiles(root), Object.keys(OFFICIAL).sort());
fs.writeFileSync(path.join(root, LIST_FILE), JSON.stringify({ files: list }));

// a fake GitHub: the official list and files of this version
let ghList = list, calls = [];
const gh = async url => {
  calls.push(url);
  const base = `https://raw.githubusercontent.com/${OFFICIAL_REPO}/${version}/`;
  assert.ok(url.startsWith(base), 'always asks OakBarn Brewery\'s own GitHub: ' + url);
  const f = decodeURIComponent(url.slice(base.length));
  const body = f === LIST_FILE ? JSON.stringify({ files: ghList }) : OFFICIAL[f];
  return body == null ? { ok: false, status: 404, text: async () => '' } : { ok: true, status: 200, text: async () => body, arrayBuffer: async () => new TextEncoder().encode(body).buffer };
};
const offline = async () => { throw new Error('offline'); };

let r = await checkOfficial(root, { fetcher: gh });
assert.equal(r.state, 'official'); assert.equal(r.confirmed, true);
r = await checkOfficial(root, { fetcher: offline });
assert.equal(r.state, 'official', 'offline: the list that came with it'); assert.equal(r.confirmed, false);
assert.match(r.text, /Could not ask OakBarn Brewery's GitHub/);

// Windows line ends still match
put('lib/a.js', 'export const a = 1;\r\n');
assert.equal((await checkOfficial(root, { fetcher: gh })).state, 'official', 'CRLF is the same file');
assert.equal(fingerprint(Buffer.from('a\r\nb')), fingerprint(Buffer.from('a\nb')));
assert.notEqual(fingerprint(Buffer.from([0, 13, 10])), fingerprint(Buffer.from([0, 10])), 'binary files are compared byte for byte');

// your own files never count
put('config/brewery.json', '{"changed":true}'); put('help/01-start.md', '# Changed');
assert.equal((await checkOfficial(root, { fetcher: gh })).state, 'official');

// changed, missing and added core files
put('lib/a.js', 'export const a = 2;\n');
fs.rmSync(path.join(root, 'templates/t.json'));
put('public/evil.js', 'steal();\n');
r = await checkOfficial(root, { fetcher: gh });
assert.equal(r.state, 'changed');
assert.deepEqual([r.changed, r.missing, r.added], [['lib/a.js'], ['templates/t.json'], ['public/evil.js']]);
assert.match(r.text, /1 changed, 1 missing, 1 added/);

// an edited list on the Brain can't hide a change: GitHub's list wins
fs.writeFileSync(path.join(root, LIST_FILE), JSON.stringify({ files: makeList(root) }));
assert.equal((await checkOfficial(root, { fetcher: offline })).state, 'official', 'offline, the edited list fools it (said in the text)');
assert.equal((await checkOfficial(root, { fetcher: gh })).state, 'changed', 'online, OakBarn Brewery\'s list catches it');

// Repair: official files back, the old and added ones moved to backups (never deleted); your files untouched
const fix = await repair(root, { fetcher: gh });
assert.deepEqual(fix.fixed.sort(), ['lib/a.js', 'templates/t.json']);
assert.deepEqual(fix.moved, ['public/evil.js']);
assert.deepEqual(fix.failed, []);
assert.equal(fs.readFileSync(path.join(root, 'lib/a.js'), 'utf8'), OFFICIAL['lib/a.js']);
assert.equal(fs.readFileSync(path.join(root, fix.backup, 'lib/a.js'), 'utf8'), 'export const a = 2;\n', 'the changed file is kept in backups');
assert.equal(fs.readFileSync(path.join(root, fix.backup, 'public/evil.js'), 'utf8'), 'steal();\n', 'the added file is kept in backups');
assert.ok(!fs.existsSync(path.join(root, 'public/evil.js')));
assert.equal(fs.readFileSync(path.join(root, 'config/brewery.json'), 'utf8'), '{"changed":true}');
assert.equal((await checkOfficial(root, { fetcher: gh })).state, 'official', 'official again after Repair');
// Repair refuses a download that is not the official file
put('lib/a.js', 'changed again');
ghList = { ...list, 'lib/a.js': 'f'.repeat(64) };
const bad = await repair(root, { fetcher: gh });
assert.equal(bad.fixed.length, 0); assert.match(bad.failed[0], /did not match/);
ghList = list;
await assert.rejects(repair(root, { fetcher: offline }), /needs OakBarn Brewery's GitHub/);

// Read-only: core files only; not in a developer's copy
assert.equal(canLock(root), true);
setReadOnly(root, coreFiles(root));
if (process.platform !== 'win32') assert.equal(fs.statSync(path.join(root, 'server.js')).mode & 0o222, 0, 'read-only');
setReadOnly(root, coreFiles(root), false);
assert.notEqual(fs.statSync(path.join(root, 'server.js')).mode & 0o200, 0);
fs.mkdirSync(path.join(root, '.git'));
assert.equal(canLock(root), false, 'a git copy is never made Read-only');
fs.rmSync(path.join(root, '.git'), { recursive: true });

// not OakBarn Brewery's: someone else's copy, or no version at all
stamp({ owner: 'brewer42', repo: 'brewer42/Skynet_Brewery', version: 'brewer42-v.20261112_17_00' });
calls = [];
r = await checkOfficial(root, { fetcher: gh });
assert.equal(r.state, 'unofficial'); assert.match(r.text, /brewer42's copy/); assert.equal(calls.length, 0);
await assert.rejects(repair(root, { fetcher: gh }), /Only an Official Skynet version/);
fs.rmSync(path.join(root, 'version.json'));
assert.equal((await checkOfficial(root, { fetcher: gh })).state, 'unofficial');
// no list anywhere
stamp(); fs.rmSync(path.join(root, LIST_FILE));
assert.equal((await checkOfficial(root, { fetcher: offline })).state, 'unknown');

fs.rmSync(root, { recursive: true, force: true });
console.log('official tests passed');
