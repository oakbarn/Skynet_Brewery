// Media page file handling:  node test/mediafiles.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import zlib from 'node:zlib'; import assert from 'node:assert/strict';
import { MediaFiles, readZip } from '../lib/mediafiles.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpm')), other = fs.mkdtempSync(path.join(os.tmpdir(), 'bpm2'));
const mf = new MediaFiles(() => [d, other]);

// paths never leave the media folders
assert.throws(() => mf.resolve(0, '../x.png'));
assert.throws(() => mf.resolve(0, 'a/../../x.png'));
assert.throws(() => mf.resolve(0, '.hidden/x.png'));
assert.throws(() => mf.resolve(5, 'x.png'));
assert.equal(mf.resolve(0, 'a\\b.png'), path.join(d, 'a', 'b.png'));
assert.equal(mf.usePath(0, 'a/b.png'), 'a/b.png');
assert.equal(mf.usePath(1, 'b.png'), path.join(other, 'b.png'));

// a tiny zip: one stored and one deflated entry, plus a file that is not media
function zip(entries) {
  const loc = [], cen = []; let off = 0;
  for (const [name, data, deflate] of entries) {
    const n = Buffer.from(name), body = deflate ? zlib.deflateRawSync(data) : data, h = Buffer.alloc(30), c = Buffer.alloc(46);
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(deflate ? 8 : 0, 8); h.writeUInt32LE(body.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(n.length, 26);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(0x800, 8); c.writeUInt16LE(deflate ? 8 : 0, 10); c.writeUInt32LE(body.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(n.length, 28); c.writeUInt32LE(off, 42);
    loc.push(h, n, body); cen.push(c, n); off += 30 + n.length + body.length;
  }
  const cd = Buffer.concat(cen), e = Buffer.alloc(22);
  e.writeUInt32LE(0x06054b50, 0); e.writeUInt16LE(entries.length, 8); e.writeUInt16LE(entries.length, 10); e.writeUInt32LE(cd.length, 12); e.writeUInt32LE(off, 16);
  return Buffer.concat([...loc, cd, e]);
}
const png = Buffer.from('fake png bytes '.repeat(20));
const z = zip([['Pics/Pump.png', png, true], ['beep.wav', Buffer.from('RIFF'), false], ['notes.txt', Buffer.from('x'), false], ['../escape.png', png, false]]);
assert.deepEqual(readZip(z).map(e => e.name), ['Pics/Pump.png', 'beep.wav', 'notes.txt', '../escape.png']);
const r = mf.unzip(z, 0, 'bru', false);
assert.deepEqual(r.saved, ['bru/Pics/Pump.png', 'bru/beep.wav']);
assert.deepEqual(r.skipped, ['notes.txt (not a picture or sound)']);   // ../escape.png is ignored
assert.deepEqual(fs.readFileSync(path.join(d, 'bru/Pics/Pump.png')), png);
assert.ok(!fs.existsSync(path.join(d, 'escape.png')));
assert.equal(mf.unzip(z, 0, 'bru', false).saved.length, 0, 'existing files are kept unless replace is ticked');

// list, rename, delete
assert.deepEqual(mf.list(0, 'bru').files.map(f => f.name), ['beep.wav']);
mf.rename(0, 'bru/beep.wav', 'bru/alarm.wav');
assert.throws(() => mf.rename(0, 'bru/alarm.wav', 'bru/alarm.exe'));
assert.throws(() => mf.remove(0, 'bru/Pics'), /Empty the folder/);
mf.remove(0, 'bru/Pics/Pump.png'); mf.remove(0, 'bru/Pics');
assert.deepEqual(mf.list(0, 'bru'), { ...mf.list(0, 'bru'), folders: [] });
assert.throws(() => mf.remove(0, ''));
console.log('mediafiles tests passed');
