// What Devices, Widgets, files and folders may be called (public/names.js, Fritz 2026-10-23)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { elementNameError, fileNameError, hasEmoji } from '../public/names.js';
import { MediaFiles } from '../lib/mediafiles.js';
import { FileMove } from '../lib/filemove.js';

// ---- Device and Widget names ----
for (const ok of ['MB_25_PWM_VlV_Fly_Sparge_SP', 'Kettle_SP', 'Temp_°F', 'Hot~Cold', 'CON_2', 'COM10', 'Brü_Kessel', 'a.b'])
  assert.equal(elementNameError(ok), '', ok + ' is fine');
for (const [bad, why] of [['', 'name'], [' Pump', 'space'], ['Pump ', 'space'], ['.Pump', 'dot'], ['Pump\u0007', 'control'], ['Pump\t1', 'control'],
  ['Beer🍺', 'emoji'], ['Hot✅', 'emoji'], ['Flag🇺🇸', 'emoji'], ['CON', 'Windows'], ['nul', 'Windows'], ['COM1', 'Windows'], ['LPT9', 'Windows']])
  assert.match(elementNameError(bad), new RegExp(why, 'i'), JSON.stringify(bad));
assert.match(elementNameError('AUX', 'Device'), /Device name/, 'the message says what kind of name');
// < > : " / \ | ? * are refused in Device, Widget and Interface names too (Fritz, 2026-10-29)
for (const c of '<>:"/\\|?*') assert.match(elementNameError(`a${c}b`, 'Device'), /Device name .* can't have/, c + ' is not allowed');
assert.match(elementNameError('Hot/Cold:1'), /can't have \/ : in it/, 'every bad character is named once');
assert.ok(!hasEmoji('Copyright © ® ™'), 'old typewriter signs are not emoji');

// ---- file and folder names ----
for (const ok of ['Mash.txt', 'Burner No Flame.png', 'Valve_Ball_ClosedV-1x1.png', 'README'])
  assert.equal(fileNameError(ok), '', ok + ' is fine');
for (const c of '<>:"/\\|?*') assert.match(fileNameError(`a${c}b.png`), /can't have/, c + ' is not allowed');
assert.match(fileNameError('my.pic.png'), /only before its file ending/);
assert.match(fileNameError('pic.'), /only before its file ending/, 'a trailing dot');
assert.match(fileNameError('.hidden.png'), /dot/);
assert.match(fileNameError('CON.txt'), /Windows/, 'CON.txt is as bad as CON on Windows');
assert.match(fileNameError('Mash 🍺.txt'), /emoji/);
assert.match(fileNameError(' Mash.txt'), /space/);
assert.match(fileNameError('Mash_v1.2', { ext: false, what: 'Process' }), /Process name .* period/, 'a Process name has no period');
assert.equal(fileNameError('Mash_Steps', { ext: false, what: 'Process' }), '');

// ---- the media folder: upload, new folder, rename, zip ----
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'names-'));
const media = path.join(dir, 'media'); fs.mkdirSync(path.join(media, 'Images', 'old.folder'), { recursive: true });
fs.writeFileSync(path.join(media, 'Images', 'old.name.png'), 'x');
const mf = new MediaFiles(() => [media]);
assert.throws(() => mf.mkdir(0, 'Images/New.Folder'), /period/, 'a new folder has no period');
mf.mkdir(0, 'Images/old.folder/Mine');                       // a folder that was there already is left alone
assert.ok(fs.existsSync(path.join(media, 'Images', 'old.folder', 'Mine')));
assert.throws(() => mf.rename(0, 'Images/old.name.png', 'Images/new|name.png'), /\|/);
mf.rename(0, 'Images/old.name.png', 'Images/new_name.png');
assert.ok(fs.existsSync(path.join(media, 'Images', 'new_name.png')), 'an old name can be renamed to a good one');
const fakeReq = () => ({ resume() {}, on() {}, pipe() {} });
await assert.rejects(mf.upload(fakeReq(), 0, 'Images', 'beer🍺.png'), /emoji/);

// ---- File Move ----
const scripts = path.join(dir, 'scripts'); fs.mkdirSync(scripts);
const fm = new FileMove(() => ({ root: dir, media, scripts, help: path.join(dir, 'help') }));
assert.throws(() => fm.target('processes', 'Folder/My.Mash.txt'), /file ending/);
assert.throws(() => fm.target('pictures', 'Bad:Folder/pic.png'), /folder name/);
assert.equal(fm.target('pictures', 'old.folder/pic.png').use, 'Images/old.folder/pic.png', 'a folder that is on the Brain already is fine');
assert.equal(fm.target('processes', 'Mash_Steps.txt').use, 'Mash_Steps');

fs.rmSync(dir, { recursive: true, force: true });
console.log('names tests passed');
