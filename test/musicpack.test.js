// Get Music Pack (Rule 9.25): what the Skynet-Music-Pack Release has against what this Brain has in media/sounds/Skynet_Music;
// only new sounds are copied (a sound already here is never changed, Rule #1), a damaged download is never saved, odd names
// are skipped, and your own sounds are never touched.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { MusicPack, PACKS, sha256 } from '../lib/musicpack.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmusic')), sounds = path.join(d, 'sounds');
const put = (rel, text) => { const f = path.join(sounds, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
put('Skynet_Music/USMB_Taps.mp3', 'my old taps'); put('Mine.mp3', 'mine'); put('Skynet_Music/Extra.mp3', 'not on GitHub');

const files = { 'USMB_Taps.mp3': 'new taps', 'USMB_First_Call.mp3': 'first call', 'USMB_Mail_Call.mp3': 'mail call', 'Bad.mp3': 'good bytes',
  '..evil.mp3': 'x', 'notes.txt': 'not a sound', 'Has Space.mp3': 'x' };
const assets = Object.entries(files).map(([name, t]) => ({ name, size: t.length, state: 'uploaded', digest: 'sha256:' + sha256(Buffer.from(t)),
  browser_download_url: `https://github.com/oakbarn/Skynet_Brewery/releases/download/Skynet-Music-Pack/${encodeURIComponent(name)}` }));
assets.push({ name: 'Half.mp3', size: 9, state: 'open', browser_download_url: 'https://github.com/x/y/releases/download/t/Half.mp3' });
assets.push({ name: 'Elsewhere.mp3', size: 1, state: 'uploaded', browser_download_url: 'https://evil.example/Elsewhere.mp3' });
const asked = [];
const fetcher = async url => {
  asked.push(url);
  if (url === 'https://api.github.com/repos/oakbarn/Skynet_Brewery/releases/tags/Skynet-Music-Pack') return { ok: true, status: 200, json: async () => ({ assets }) };
  const m = /\/Skynet-Music-Pack\/(.+)$/.exec(url), n = m && decodeURIComponent(m[1]);
  if (n === 'Bad.mp3') return { ok: true, status: 200, arrayBuffer: async () => Buffer.from('damaged!!!') };
  if (n in files) return { ok: true, status: 200, arrayBuffer: async () => Buffer.from(files[n]) };
  return { ok: false, status: 404 };
};
assert.equal(PACKS[0].tag, 'Skynet-Music-Pack'); assert.equal(PACKS[0].folder, 'Skynet_Music');
const mp = new MusicPack(() => sounds, { fetcher });
const c = await mp.check();
assert.equal(c.folder, 'sounds/Skynet_Music');
assert.deepEqual(c.add.map(x => x.name).sort(), ['Bad.mp3', 'Elsewhere.mp3', 'USMB_First_Call.mp3', 'USMB_Mail_Call.mp3']);
assert.equal(c.total, 5, 'only finished .mp3 files with safe names'); assert.equal(c.same, 1);

const got = [];
const r = await mp.get(null, [], f => got.push(f));
assert.deepEqual(r.saved.sort(), ['USMB_First_Call.mp3', 'USMB_Mail_Call.mp3']);
assert.equal(r.failed.length, 2);
assert.ok(r.failed.some(f => /Bad\.mp3: the download was damaged/.test(f)));
assert.ok(r.failed.some(f => /Elsewhere\.mp3: not a GitHub download/.test(f)));
assert.ok(!asked.some(u => u.includes('evil.example')), 'only GitHub downloads are fetched');
assert.ok(!fs.existsSync(path.join(sounds, 'Skynet_Music/Bad.mp3')), 'a damaged download is never saved');
assert.equal(fs.readFileSync(path.join(sounds, 'Skynet_Music/USMB_Taps.mp3'), 'utf8'), 'my old taps', 'a sound already here is never changed');
assert.equal(fs.readFileSync(path.join(sounds, 'Skynet_Music/USMB_First_Call.mp3'), 'utf8'), 'first call');
assert.equal(fs.readFileSync(path.join(sounds, 'Mine.mp3'), 'utf8'), 'mine', 'your own sounds are never touched');
assert.ok(fs.existsSync(path.join(sounds, 'Skynet_Music/Extra.mp3')), 'nothing is deleted');
assert.equal(got.length, 2);
assert.ok(!fs.readdirSync(path.join(sounds, 'Skynet_Music')).some(n => n.startsWith('.')), 'no temporary files left behind');

// a second check finds only the ones that failed; picking a name not in the list gets nothing
assert.deepEqual((await mp.check()).add.map(x => x.name).sort(), ['Bad.mp3', 'Elsewhere.mp3']);
assert.deepEqual((await mp.get(null, ['USMB_Taps.mp3'])).saved, []);

// a second pack (for example a Patron Add-On) lands in its own subfolder
const two = new MusicPack(() => sounds, { fetcher: async u => u.endsWith('/Extra-Pack') ? { ok: true, status: 200, json: async () => ({ assets: [{ name: 'A.mp3', size: 1, digest: 'sha256:' + sha256(Buffer.from('a')), browser_download_url: 'https://github.com/o/r/releases/download/Extra-Pack/A.mp3' }] }) } : { ok: true, status: 200, arrayBuffer: async () => Buffer.from('a') },
  packs: [...PACKS, { key: 'extra', title: 'Extra', tag: 'Extra-Pack', folder: 'Skynet_Music/Patron' }] });
assert.deepEqual((await two.get('extra', [])).saved, ['A.mp3']);
assert.ok(fs.existsSync(path.join(sounds, 'Skynet_Music/Patron/A.mp3')));
await assert.rejects(two.check('nope'), /No such Music Pack/);

// GitHub problems come back as plain words
await assert.rejects(new MusicPack(() => sounds, { fetcher: async () => { throw new TypeError('fetch failed'); } }).check(), /Is this Brain on the internet/);
await assert.rejects(new MusicPack(() => sounds, { fetcher: async () => ({ ok: false, status: 404 }) }).check(), /not on GitHub yet/);
assert.equal(new MusicPack(() => sounds, { source: { repo: 'bad repo' } }).repo, 'oakbarn/Skynet_Brewery');

fs.rmSync(d, { recursive: true, force: true });
console.log('music pack tests passed');
