// Get Skynet pictures: what GitHub has in media/Images/Skynet against what this Brain has; only new and changed pictures
// are copied, a damaged download is never saved, paths can't leave Images/Skynet, and your own files are never touched.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SkynetPictures, blobSha } from '../lib/skynetpics.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpsky')), images = path.join(d, 'Images');
const put = (rel, text) => { const f = path.join(images, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
put('Skynet/Pumps/Same.svg', 'same'); put('Skynet/Pumps/Old.svg', 'old drawing'); put('Pumps/Mine.png', 'mine'); put('Skynet/Pumps/Extra.svg', 'not on GitHub');

const files = { 'media/Images/Skynet/Pumps/Same.svg': 'same', 'media/Images/Skynet/Pumps/Old.svg': 'new drawing', 'media/Images/Skynet/Valves/New Valve.svg': 'brand new',
  'media/Images/Skynet/Valves/Bad.svg': 'good bytes', 'media/Images/Skynet/notes.txt': 'not a picture', 'media/Images/Pumps/x.svg': 'not Skynet', 'media/Images/Skynet/../evil.svg': 'x' };
const tree = Object.entries(files).map(([p, t]) => ({ path: p, type: 'blob', size: t.length, sha: blobSha(Buffer.from(t)) }));
const asked = [];
const fetcher = async url => {
  asked.push(url);
  if (url.startsWith('https://api.github.com/repos/oakbarn/Skynet_Brewery/git/trees/HEAD')) return { ok: true, status: 200, json: async () => ({ sha: 'abc1234def', tree }) };
  const m = /^https:\/\/raw\.githubusercontent\.com\/oakbarn\/Skynet_Brewery\/abc1234def\/(.+)$/.exec(url);
  const p = m && decodeURIComponent(m[1]);
  if (p === 'media/Images/Skynet/Valves/Bad.svg') return { ok: true, status: 200, arrayBuffer: async () => Buffer.from('damaged') };
  if (p in files) return { ok: true, status: 200, arrayBuffer: async () => Buffer.from(files[p]) };
  return { ok: false, status: 404 };
};
const sp = new SkynetPictures(() => images, { fetcher });
const c = await sp.check();
assert.deepEqual(c.add.map(x => x.path).sort(), ['Valves/Bad.svg', 'Valves/New Valve.svg']);
assert.deepEqual(c.update.map(x => x.path), ['Pumps/Old.svg']);
assert.equal(c.same, 1); assert.equal(c.total, 4, 'only pictures inside media/Images/Skynet, never a path that climbs out');

const got = [];
const r = await sp.get([], f => got.push(f));
assert.deepEqual(r.saved.sort(), ['Pumps/Old.svg', 'Valves/New Valve.svg']);
assert.equal(r.failed.length, 1); assert.match(r.failed[0], /Bad\.svg: the download was damaged/);
assert.ok(!fs.existsSync(path.join(images, 'Skynet/Valves/Bad.svg')), 'a damaged download is never saved');
assert.equal(fs.readFileSync(path.join(images, 'Skynet/Pumps/Old.svg'), 'utf8'), 'new drawing');
assert.equal(fs.readFileSync(path.join(images, 'Skynet/Valves/New Valve.svg'), 'utf8'), 'brand new');
assert.equal(fs.readFileSync(path.join(images, 'Pumps/Mine.png'), 'utf8'), 'mine', 'your own pictures are never touched');
assert.ok(fs.existsSync(path.join(images, 'Skynet/Pumps/Extra.svg')), 'nothing is deleted');
assert.equal(got.length, 2);
assert.ok(!fs.readdirSync(path.join(images, 'Skynet/Valves')).some(n => n.startsWith('.')), 'no temporary files left behind');
assert.ok(asked.some(u => u.includes('/Valves/New%20Valve.svg')), 'names with spaces are asked for correctly');

// a second check finds only the damaged one still missing; picking just some works
const c2 = await sp.check();
assert.deepEqual([...c2.add, ...c2.update].map(x => x.path), ['Valves/Bad.svg']);
assert.deepEqual((await sp.get(['Pumps/Same.svg'])).saved, [], 'a picture already here is not in the list to get');

// GitHub problems come back as plain words
const down = new SkynetPictures(() => images, { fetcher: async () => { throw new TypeError('fetch failed'); } });
await assert.rejects(down.check(), /Is this Brain on the internet/);
const priv = new SkynetPictures(() => images, { fetcher: async () => ({ ok: false, status: 404 }) });
await assert.rejects(priv.check(), /private/);
assert.equal(new SkynetPictures(() => images, { source: { repo: 'someone/Copy', branch: 'main' } }).repo, 'someone/Copy');
assert.equal(new SkynetPictures(() => images, { source: { repo: 'bad repo' } }).repo, 'oakbarn/Skynet_Brewery');

fs.rmSync(d, { recursive: true, force: true });
console.log('skynet pictures tests passed');
