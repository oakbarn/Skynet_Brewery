// Picture groups (Fritz, 2026-10-22): the eleven standard groups in media/Images (your pictures) and in media/Images/Skynet
// (the pictures that come with Skynet, read only). Your own pictures are found after a move too.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PICTURE_GROUPS, setupPictureGroups, listGroups, skynetGroupOf, inSkynet } from '../lib/picgroups.js';
import { MediaFiles } from '../lib/mediafiles.js';
import { FileMove } from '../lib/filemove.js';
import { Store } from '../lib/store.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpgrp')), media = path.join(d, 'media'), images = path.join(media, 'Images');
const put = (rel, text) => { const f = path.join(media, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
const has = rel => fs.existsSync(path.join(images, rel));
put('Images/Skynet/Lights_LEDs/led_red.svg', 'the new one');
put('Images/Valves/MyValve.svg', '<svg>valve</svg>');
put('Images/MyPump.png', 'my own picture');

const r = setupPictureGroups(images);
assert.deepEqual(r.made.filter(g => !g.startsWith('Skynet/')).sort(), PICTURE_GROUPS.filter(g => g !== 'Valves').sort(), 'the eleven groups of your own');
assert.deepEqual(r.made.filter(g => g.startsWith('Skynet/')).sort(), PICTURE_GROUPS.filter(g => g !== 'Lights_LEDs').map(g => 'Skynet/' + g).sort(), 'and the eleven Skynet groups');
assert.ok(has('MyPump.png') && has('Valves/MyValve.svg'), 'your own pictures stay where they are');
assert.equal(setupPictureGroups(images).made.length, 0, 'made once only');
assert.equal(skynetGroupOf('Images/Skynet/Valves/Valve_Manual_ClosedH.svg'), 'Valves');
assert.ok(inSkynet('Images/Skynet') && inSkynet('images/skynet/Pumps/a.png') && !inSkynet('Images/SkynetX') && !inSkynet('Images/Pumps'));

// the groups list: the eleven standard ones first, then your own (Skynet is not one)
fs.mkdirSync(path.join(images, 'Fermenters'));
const groups = listGroups(images);
assert.deepEqual(groups.slice(0, PICTURE_GROUPS.length).map(g => g.name), PICTURE_GROUPS);
assert.equal(groups.length, PICTURE_GROUPS.length + 1);
assert.deepEqual(groups.at(-1), { name: 'Fermenters', label: 'Fermenters', standard: false });
assert.equal(groups.find(g => g.name === 'Lights_LEDs').label, 'Lights / LEDs');

// the Media screen: the standard group folders, Images, sounds and Skynet stay; nothing in Skynet changes; your pictures move freely
const mf = new MediaFiles(() => [media]);
assert.throws(() => mf.remove(0, 'Images/Motors'), /standard picture groups/);
assert.throws(() => mf.rename(0, 'Images/Pumps', 'Images/Pumpz'), /standard picture groups/);
assert.throws(() => mf.rename(0, 'images/motors', 'Images/Fermenters/motors'), /standard picture groups/);
fs.mkdirSync(path.join(media, 'sounds'), { recursive: true });
assert.throws(() => mf.remove(0, 'sounds'), /can't be deleted/);
assert.throws(() => mf.remove(0, 'Images'), /can't be deleted/);
assert.throws(() => mf.remove(0, 'Images/Skynet'), /Skynet/);
assert.throws(() => mf.remove(0, 'Images/Skynet/Pumps/Pump_Red_Rip_On.png'), /Skynet/);
assert.throws(() => mf.rename(0, 'Images/Skynet/Pumps/Pump_Red_Rip_On.png', 'Images/Pumps/Pump_Red_Rip_On.png'), /Skynet/, 'nothing comes out');
assert.throws(() => mf.rename(0, 'Images/MyPump.png', 'Images/Skynet/Pumps/MyPump.png'), /Skynet/, 'nothing goes in');
assert.throws(() => mf.mkdir(0, 'Images/Skynet/Mine'), /Skynet/);
assert.equal(mf.unzip(zip1('a.png'), 0, 'Images/Skynet/Pumps').saved.length, 0, 'a zip can\'t unpack into Skynet');
assert.equal(mf.list(0, 'Images/Skynet/Pumps').readOnly, true);
assert.equal(mf.list(0, 'Images/Pumps').readOnly, false);
assert.throws(() => new FileMove(() => ({ root: d, media, processes: d, help: d })).target('pictures', 'Skynet/Pumps/x.png'), /Skynet/, 'File Move can\'t put pictures in Skynet');
mf.rename(0, 'Images/Fermenters', 'Images/Conicals'); mf.remove(0, 'Images/Conicals');
assert.deepEqual(mf.list(0, 'Images').kept, [...PICTURE_GROUPS, 'Skynet'].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })));
mf.rename(0, 'Images/MyPump.png', 'Images/Pumps/MyPump.png');      // your picture moved into a group

fs.mkdirSync(path.join(d, 'config'));
const cfg = path.join(d, 'config', 'brewery.json');
fs.writeFileSync(cfg, JSON.stringify({ workspaces: [{ name: 'Main' }], elements: [], graphics: [] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
assert.equal(store.findMedia('Images/MyPump.png'), path.join(images, 'Pumps', 'MyPump.png'), 'your own picture after moving it into a group');
assert.equal(store.findMedia('MyPump.png'), path.join(images, 'Pumps', 'MyPump.png'));
assert.equal(store.findMedia('Images/Nowhere.png'), path.join(images, 'Nowhere.png'), 'a missing picture keeps its own path');

fs.rmSync(d, { recursive: true, force: true });
console.log('picture groups tests passed');

// a zip holding one stored file
function zip1(name) {
  const data = Buffer.from('x'), n = Buffer.from(name);
  const local = Buffer.alloc(30); local.writeUInt32LE(0x04034b50, 0); local.writeUInt32LE(1, 18); local.writeUInt32LE(1, 22); local.writeUInt16LE(n.length, 26);
  const cen = Buffer.alloc(46); cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt32LE(1, 20); cen.writeUInt32LE(1, 24); cen.writeUInt16LE(n.length, 28);
  const body = Buffer.concat([local, n, data]), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(1, 8); end.writeUInt16LE(1, 10); end.writeUInt32LE(46 + n.length, 12); end.writeUInt32LE(body.length, 16);
  return Buffer.concat([body, cen, n, end]);
}
