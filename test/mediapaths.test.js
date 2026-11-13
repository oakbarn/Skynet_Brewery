// node --no-warnings test/mediapaths.test.js
// Skynet Picture ID numbers (Rule 7.22) and two-part paths, .path and .file (Rule 7.23), OakBarn Brewery 2026-11-13,
// ReadMe markup "Skynet Brew Panel 1 a" pages 16-17.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Store, attrsOf } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
import { skynetPicRows, skynetPicId, skynetPicPath, skynetPicByName, updateSkynetPicIds, IDS_FILE } from '../lib/skynetpicids.js';
import { splitPath, fileOf, folderOf, joinPath, pickLabel, mediaDefaults, userFolderError, isBareFile, isPicNumber, MEDIA_DEFAULTS } from '../public/mediapaths.js';
import { listMarkdown, LIST_MD } from '../tools/skynet-picture-ids.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKY = path.join(ROOT, 'media', 'Images', 'Skynet');

// ---- Rule 7.22: every Skynet picture has one fixed number ----
const rows = skynetPicRows();
const pics = [];
const walk = (dir, rel) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { if (e.name.startsWith('.')) continue; const r = rel ? `${rel}/${e.name}` : e.name; if (e.isDirectory()) walk(path.join(dir, e.name), r); else if (/\.(png|jpe?g|gif|svg|webp|bmp|ico)$/i.test(e.name)) pics.push(r); } };
walk(SKY, '');
const live = rows.filter(r => !r.retired);
assert.deepEqual(rows.map(r => r.id), rows.map((_, i) => i + 1), 'the numbers are 1, 2, 3 ... with none missing and none twice');
for (const p of pics) assert.ok(live.some(r => r.file === p), `${p} has a Skynet Picture number: run node tools/skynet-picture-ids.js`);
for (const r of live) assert.ok(pics.includes(r.file), `number ${r.id} (${r.file}): the picture is gone, so its row must be marked retired (never deleted or reused)`);
assert.equal(new Set(live.map(r => r.file.split('/').pop().toLowerCase())).size, live.length, 'no two Skynet pictures have the same file name');
assert.equal(fs.readFileSync(LIST_MD, 'utf8'), listMarkdown(rows), 'docs/Skynet_Picture_IDs.md is up to date (node tools/skynet-picture-ids.js)');
// the first numbers can never change (a Meaningless Key, Design Rule #2): these were given on 2026-11-13
const FIXED = { 1: 'Alarms/Alarm_Active_Red.svg', 5: 'Alarms/Alarm_Basic.svg', 24: 'On_Off/Overlay_Bolt.svg', 126: 'Pumps/Pump_Red_Rip_Off.svg', 194: 'Vessels/Vessel_Kettle_Tall.svg' };
for (const [id, f] of Object.entries(FIXED)) assert.equal(rows.find(r => r.id === +id)?.file, f, `Skynet Picture ${id} is still ${f}`);
assert.equal(skynetPicId('Images/Skynet/On_Off/Overlay_Bolt.svg'), 24);
assert.equal(skynetPicId('media\\images\\skynet\\on_off\\overlay_bolt.svg'), 24, 'any letter case and \\');
assert.equal(skynetPicId('Images/On_Off/Overlay_Bolt.svg'), null, 'a picture of your own has no number');
assert.equal(skynetPicPath(24), 'Images/Skynet/On_Off/Overlay_Bolt.svg'); assert.equal(skynetPicPath('#24'), 'Images/Skynet/On_Off/Overlay_Bolt.svg');
assert.equal(skynetPicPath(99999), null);
assert.equal(skynetPicByName('overlay_bolt.svg'), 'Images/Skynet/On_Off/Overlay_Bolt.svg');

// a new picture gets the next number; a gone one is retired and its number is never given again; a number never moves
{
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'picid')), f = path.join(d, 'ids.json');
  fs.mkdirSync(path.join(d, 'Sky', 'Pumps'), { recursive: true });
  for (const n of ['B.svg', 'A.svg']) fs.writeFileSync(path.join(d, 'Sky', 'Pumps', n), 'x');
  fs.writeFileSync(f, JSON.stringify({ pictures: [] }));
  assert.deepEqual(updateSkynetPicIds(path.join(d, 'Sky'), f).added.map(r => `${r.id} ${r.file}`), ['1 Pumps/A.svg', '2 Pumps/B.svg']);
  fs.rmSync(path.join(d, 'Sky', 'Pumps', 'A.svg')); fs.writeFileSync(path.join(d, 'Sky', 'Pumps', 'C.svg'), 'x');
  const u = updateSkynetPicIds(path.join(d, 'Sky'), f);
  assert.deepEqual(u.retired.map(r => r.id), [1]); assert.deepEqual(u.added.map(r => `${r.id} ${r.file}`), ['3 Pumps/C.svg']);
  assert.deepEqual(JSON.parse(fs.readFileSync(f, 'utf8')).pictures, [{ id: 1, file: 'Pumps/A.svg', retired: true }, { id: 2, file: 'Pumps/B.svg' }, { id: 3, file: 'Pumps/C.svg' }]);
}

// ---- Rule 7.23: the two fields ----
assert.deepEqual(splitPath('Images/Skynet/Pumps/Pump_Red_Rip_Off.svg'), { path: 'Images/Skynet/Pumps', file: 'Pump_Red_Rip_Off.svg' });
assert.deepEqual(splitPath('Bell.svg'), { path: '', file: 'Bell.svg' });
assert.deepEqual(splitPath('C:\\Brewing\\media\\sounds\\x.mp3'), { path: 'C:/Brewing/media/sounds', file: 'x.mp3' });
assert.equal(fileOf('https://github.com/oakbarn/x/releases/download/Skynet-Sounds/Song_A.mp3?x=1'), 'Song_A.mp3');
assert.equal(folderOf('Images/a.png'), 'Images'); assert.equal(joinPath('Images/', 'a.png'), 'Images/a.png'); assert.equal(joinPath('', 'a.png'), 'a.png');
assert.equal(pickLabel('Images/Skynet/On_Off/Overlay_Bolt.svg', 24), '24 · Overlay_Bolt.svg', 'the lists show the number and the file name only');
assert.equal(pickLabel('Images/Pumps/Mine.png'), 'Mine.png');
assert.deepEqual(MEDIA_DEFAULTS, { skynetGraphic: 'Images/Skynet', skynetAudio: 'sounds/Skynet', userGraphic: 'Images', userAudio: 'sounds' });
assert.deepEqual(mediaDefaults({ mediaDefaults: { userGraphic: 'Images/Mine/', userAudio: '', skynetGraphic: 'Nope' } }),
  { skynetGraphic: 'Images/Skynet', skynetAudio: 'sounds/Skynet', userGraphic: 'Images/Mine', userAudio: 'sounds' }, 'the Skynet folders can never be changed');
assert.ok(userFolderError('Images/Skynet/Pumps')); assert.ok(userFolderError('sounds/skynet')); assert.equal(userFolderError('Images/Mine'), '');
assert.ok(isBareFile('Bell.svg')); assert.ok(!isBareFile('Images/Bell.svg')); assert.ok(!isBareFile('none')); assert.ok(isBareFile('ding.mp3', true)); assert.ok(!isBareFile('ding.mp3'));
assert.ok(isPicNumber(17)); assert.ok(isPicNumber('#17')); assert.ok(!isPicNumber('1.5')); assert.ok(!isPicNumber(''));

// ---- In a Process ----
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mpaths'));
fs.mkdirSync(path.join(d, 'config')); fs.mkdirSync(path.join(d, 'scripts'));
const M = path.join(d, 'media');
for (const [f, x] of [['Images/Bell.svg', 'x'], ['Images/Pumps/MyPump.png', 'x'], ['Images/Skynet/Alarms/Alarm_Basic.svg', 'x'], ['Images/Skynet/On_Off/Overlay_Bolt.svg', 'x'],
  ['Images/Mine/Other.svg', 'x'], ['Images/Mine/Bell.svg', 'x'], ['sounds/ding.mp3', 'x'], ['sounds/Skynet/Alarm_Sound_Missing.mp3', 'x'], ['sounds/Hops/hop.wav', 'x']]) {
  fs.mkdirSync(path.dirname(path.join(M, f)), { recursive: true }); fs.writeFileSync(path.join(M, f), x);
}
const cfg = path.join(d, 'config', 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ mediaRoots: ['./media'], elements: [
  { name: 'alm_Brew', type: 'alarm', sound: 'sounds/ding.mp3', backpath: 'Images/Bell.svg' },
  { name: 'Snd_1', type: 'soundPlayer', path: 'sounds/ding.mp3' },
  { name: 'gG_Pic', type: 'gGlobal', kind: 'graphic', initial: 'Images/Bell.svg' },
  { name: 'Pump_1', type: 'digitalOut', imageOff: 'Images/Pumps/MyPump.png' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const failed = () => [...eng.status].filter(([, st]) => st.state === 'error').map(([n, st]) => `${n}: ${st.error}`);
const run = async (name, text) => { fs.writeFileSync(path.join(d, 'scripts', name + '.txt'), text); eng.start(name); await new Promise(r => setTimeout(r, 250)); };
const P = (n, p) => store.getProp(n, p);

// a file name alone is made whole from the default path: the User folder first, then its folders, then Skynet
await run('a', 'alm_Brew.backpath = "MyPump.png"\nalm_Brew.setgraphic = "Alarm_Basic.svg"\nalm_Brew.imageoverlay = 24\nalm_Brew.sound = "hop.wav"\n');
assert.deepEqual(failed(), []);
assert.equal(P('alm_Brew', 'backpath'), 'Images/Pumps/MyPump.png', 'found in a group of your own');
assert.equal(P('alm_Brew', 'setgraphic'), 'Images/Skynet/Alarms/Alarm_Basic.svg', 'a Skynet picture by its file name');
assert.equal(P('alm_Brew', 'imageoverlay'), 'Images/Skynet/On_Off/Overlay_Bolt.svg', 'a Skynet picture by its number');
assert.equal(P('alm_Brew', 'sound'), 'sounds/Hops/hop.wav', 'a sound in the User Audio folder');
await run('b', 'alm_Brew.backpath = "Bell.svg"\nalm_Brew.sound = "Alarm_Sound_Missing.mp3"\n');
assert.equal(P('alm_Brew', 'backpath'), 'Images/Bell.svg', 'the User Graphic folder itself before the folders in it');
assert.equal(P('alm_Brew', 'sound'), 'sounds/Skynet/Alarm_Sound_Missing.mp3', 'then the Skynet Audio folder');
await run('c', 'alm_Brew.image = "Nowhere.svg"\n');
assert.equal(P('alm_Brew', 'backpath'), 'Images/Nowhere.svg', 'not found: the User folder and the name');
assert.equal(String(P('alm_Brew', 'background')), '1');
// .path is the full path, .file only the file name
await run('d', 'alm_Brew.backpath.path = "Images/Mine/Other.svg"\n');
assert.deepEqual(failed(), []);
assert.equal(P('alm_Brew', 'backpath'), 'Images/Mine/Other.svg');
assert.equal(store.getProp('alm_Brew.backpath', 'path'), 'Images/Mine/Other.svg'); assert.equal(store.getProp('alm_Brew.backpath', 'file'), 'Other.svg');
await run('e', 'alm_Brew.backpath.file = "Bell.svg"\n');
assert.equal(P('alm_Brew', 'backpath'), 'Images/Mine/Bell.svg', '.file keeps the folder it is in when the file is there');
await run('f', 'alm_Brew.backpath.file = "MyPump.png"\n');
assert.equal(P('alm_Brew', 'backpath'), 'Images/Pumps/MyPump.png', 'and finds it when it is not');
await run('g', 'new string t\nt = alm_Brew.sound.file\nif alm_Brew.backpath.file == "MyPump.png"\n  alm_Brew.sound.file = "ding.mp3"\nendif\n');
assert.deepEqual(failed(), []);
assert.equal(P('alm_Brew', 'sound'), 'sounds/ding.mp3');
await run('h', 'alm_Brew.backpath.file = "Images/x.svg"\n');
assert.match(failed().join(), /only the file name/);
await run('i', 'alm_Brew.setgraphic = 99999\n');
assert.match(failed().join(), /no Skynet Picture number 99999/);
// a Graphic gGlobal and a Sound Player: their own value is the path
await run('j', 'gG_Pic = "Alarm_Basic.svg"\nSnd_1.file = "hop.wav"\n');
assert.equal(P('gG_Pic', 'value'), 'Images/Skynet/Alarms/Alarm_Basic.svg'); assert.equal(P('gG_Pic', 'file'), 'Alarm_Basic.svg'); assert.equal(P('gG_Pic', 'path'), 'Images/Skynet/Alarms/Alarm_Basic.svg');
assert.equal(P('Snd_1', 'path'), 'sounds/Hops/hop.wav'); assert.equal(P('Snd_1', 'file'), 'hop.wav');
await run('k', 'gG_Pic.path = "Images/Mine/Other.svg"\nSnd_1.path = "ding.mp3"\nPump_1.imageoff.file = "Bell.svg"\n');
assert.deepEqual(failed().filter(f => /^[jkl]:/.test(f)), []);
assert.equal(P('gG_Pic', 'value'), 'Images/Mine/Other.svg'); assert.equal(P('Snd_1', 'path'), 'sounds/ding.mp3');
assert.equal(P('Pump_1', 'imageoff'), 'Images/Bell.svg');
// the item's own .path / .file, _2 and _3 (OakBarn Brewery 2026-11-13): Image Path 1, 2 and 3; an Alarm's .path / .file is its sound
await run('m', 'Pump_1.file = "Bell.svg"\nPump_1.path_2 = "Images/Mine/Other.svg"\nPump_1.file_3 = "MyPump.png"\nalm_Brew.file = "hop.wav"\nalm_Brew.file_2 = "Bell.svg"\n');
assert.deepEqual(failed().filter(f => /^m:/.test(f)), []);
assert.equal(P('Pump_1', 'backpath'), 'Images/Bell.svg'); assert.equal(P('Pump_1', 'path'), 'Images/Bell.svg');
assert.equal(P('Pump_1', 'backpath_2'), 'Images/Mine/Other.svg'); assert.equal(P('Pump_1', 'file_2'), 'Other.svg');
assert.equal(P('Pump_1', 'backpath_3'), 'Images/Pumps/MyPump.png'); assert.equal(P('Pump_1', 'path_3'), 'Images/Pumps/MyPump.png');
assert.equal(P('alm_Brew', 'sound'), 'sounds/Hops/hop.wav'); assert.equal(P('alm_Brew', 'path'), 'sounds/Hops/hop.wav');
assert.equal(P('alm_Brew', 'backpath_2'), 'Images/Bell.svg');
for (const a of ['path', 'file', 'path_2', 'file_2', 'path_3', 'file_3']) assert.ok(attrsOf(store.get('Pump_1')).includes(a), 'predictive text offers .' + a);
// words and links are kept as they are
await run('l', 'alm_Brew.setgraphic = "none"\nSnd_1.path = "https://example.com/a.mp3"\n');
assert.equal(P('alm_Brew', 'setgraphic'), 'none'); assert.equal(P('Snd_1', 'path'), 'https://example.com/a.mp3');
// the User folders can be changed in Settings
store.config.mediaDefaults = { userGraphic: 'Images/Mine' };
store.setProp('alm_Brew', 'backpath', 'Bell.svg');
assert.equal(P('alm_Brew', 'backpath'), 'Images/Mine/Bell.svg');
delete store.config.mediaDefaults;
// the Process check knows .path and .file, and warns about a file name it can't find
const ck = eng.check('alm_Brew.backpath.file = "Bell.svg"\ngG_Pic.path = "Images/Bell.svg"\nalm_Brew.image = "Gone.svg"\n');
assert.deepEqual(ck.errors, []);
assert.deepEqual(ck.offBrain.map(o => o.path), ['Gone.svg']);
console.log('mediapaths ok');
