// File Move page: each kind of file has one home on the Brain; nothing can be written outside it.
// Also: old picture and sound paths still find the files after pictures moved into media/Images and sounds into media/sounds.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { FileMove, kindOf, missingMedia } from '../lib/filemove.js';
import { mediaAliases } from '../lib/store.js';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'filemove-'));
const dirs = { root, media: path.join(root, 'media'), scripts: path.join(root, 'scripts'), help: path.join(root, 'help') };
const fm = new FileMove(() => dirs);
const body = t => Readable.from([Buffer.from(t)]);

assert.equal(kindOf('Pump On.PNG'), 'pictures');
assert.equal(kindOf('bell.wav'), 'sounds');
assert.equal(kindOf('notes.txt'), null);

assert.deepEqual(fm.target('pictures', 'Pumps/a.png').use, 'Images/Pumps/a.png', 'picture folders are kept under Images');
assert.equal(fm.target('pictures', 'Pumps/a.png').folder, 'media/Images/Pumps/a.png');
assert.equal(fm.target('sounds', 'wave/bell.wav').use, 'sounds/bell.wav', 'sounds all go straight into media/sounds');
assert.equal(fm.target('processes', 'BruControl/Mash.txt').folder, 'scripts/Mash.txt');
assert.equal(fm.target('help', '40-my-page.md').folder, 'help/40-my-page.md');
assert.throws(() => fm.target('pictures', '../../server.js'), /dot|not one of/);
assert.throws(() => fm.target('pictures', '../x.png'), /dot/);
assert.throws(() => fm.target('pictures', 'a.exe'), /not one of/);
assert.throws(() => fm.target('sounds', 'a.png'), /not one of/);
assert.throws(() => fm.target('help', 'bad name.md'), /letters, numbers/);
assert.throws(() => fm.target('config', 'x.json'), /Pick where/);

let r = await fm.save(body('PNG1'), 'pictures', 'Pumps/a.png', false);
assert.equal(r.saved, 'media/Images/Pumps/a.png');
assert.equal(fs.readFileSync(path.join(root, 'media/Images/Pumps/a.png'), 'utf8'), 'PNG1');
await assert.rejects(fm.save(body('PNG2'), 'pictures', 'Pumps/a.png', false), e => e.code === 409, 'a file already there is not replaced');
assert.equal(fs.readFileSync(path.join(root, 'media/Images/Pumps/a.png'), 'utf8'), 'PNG1');
await fm.save(body('PNG2'), 'pictures', 'Pumps/a.png', true);
assert.equal(fs.readFileSync(path.join(root, 'media/Images/Pumps/a.png'), 'utf8'), 'PNG2', 'Replace copies over it');
await fm.save(body('WAV'), 'sounds', 'wave/bell.wav', false);
assert.ok(fs.existsSync(path.join(root, 'media/sounds/bell.wav')));
assert.deepEqual(fs.readdirSync(path.join(root, 'media/Images/Pumps')), ['a.png'], 'no temporary files left behind');

const chk = fm.check([{ kind: 'pictures', path: 'Pumps/a.png', size: 4 }, { kind: 'pictures', path: 'Pumps/a.png', size: 9 }, { kind: 'pictures', path: 'b.png', size: 1 }, { kind: 'sounds', path: 'x.png' }]);
assert.deepEqual(chk.map(c => [c.ok, c.exists, c.same]), [[true, true, true], [true, true, false], [true, false, false], [false, undefined, undefined]]);

// what the loaded Schema uses but the Brain does not have
const find = p => { const f = path.join(dirs.media, p); return fs.existsSync(f) ? f : f; };
const miss = missingMedia({ workspaces: [{ name: 'B1', background: 'Images/System_Back_1.png' }],
  elements: [{ name: 'p', imagePath_1: 'Images/Pumps/a.png', sounds: ['sounds/bell.wav', 'sounds/Hops.wav', ''], bru: { x: 'C:\\old.png' } }], graphics: [] }, find);
assert.deepEqual(miss.map(m => [m.path, m.kind]), [['Images/System_Back_1.png', 'pictures'], ['sounds/Hops.wav', 'sounds']]);

// old paths still work
assert.deepEqual(mediaAliases('brewery_main.png'), ['Images/brewery_main.png', 'Images/Miscellaneous/brewery_main.png']);
assert.deepEqual(mediaAliases('Images/wave/Done.wav'), ['oakbarn/wave/Done.wav', 'sounds/Done.wav']);
assert.deepEqual(mediaAliases('samples/kettle.svg'), ['Images/samples/kettle.svg', 'Images/Vessels/kettle.svg']);
assert.deepEqual(mediaAliases('sounds/a.wav'), []);
fs.rmSync(root, { recursive: true });
console.log('filemove tests passed');
