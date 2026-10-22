// Picture groups (Fritz, 2026-10-22): the eleven standard groups in media/Images (your pictures) and in media/Images/Skynet
// (the pictures that come with Skynet, read only). The Skynet pictures are moved into Skynet/<group> once (with their SVG
// copies and Settings > Pictures choices), old paths still find them, and your own pictures are found after a move too.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PICTURE_GROUPS, setupPictureGroups, listGroups, skynetGroupOf, inSkynet } from '../lib/picgroups.js';
import { MediaFiles } from '../lib/mediafiles.js';
import { FileMove } from '../lib/filemove.js';
import { Store, mediaAliases } from '../lib/store.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpgrp')), media = path.join(d, 'media'), images = path.join(media, 'Images');
const put = (rel, text) => { const f = path.join(media, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
const has = rel => fs.existsSync(path.join(images, rel));
put('Images/Pump_Red_Rip_On.png', 'red pump');
put('Images/Pump_Red_Rip_On.svg', '<svg data-brewpanel-traced="Pump_Red_Rip_On.png" data-score="0.9"></svg>');
put('Images/samples/kettle.svg', '<svg>kettle</svg>');
put('Images/samples/led_red.svg', 'mine, changed');
put('Images/Skynet/Lights_LEDs/led_red.svg', 'the new one');            // a newer release already put it there
put('Images/Valves/Valve_Manual_OpenH.svg', '<svg>valve</svg>');        // where the first try of picture groups put it
put('Images/MyPump.png', 'my own picture');
put('Images/Pump_Blue_Rip_Off.png', 'blue pump');                // the new release already put the pump and its hand-drawn SVG in Skynet/Pumps
put('Images/Pump_Blue_Rip_Off.svg', '<svg data-brewpanel-traced="Pump_Blue_Rip_Off.png" data-score="0.9"></svg>');
put('Images/Skynet/Pumps/Pump_Blue_Rip_Off.png', 'blue pump');
put('Images/Skynet/Pumps/Pump_Blue_Rip_Off.svg', '<svg>drawn</svg>');

const choices = { 'Images/Pump_Red_Rip_On.png': 'original' };
const r = setupPictureGroups(images, choices);
assert.deepEqual(r.made.filter(g => !g.startsWith('Skynet/')).sort(), PICTURE_GROUPS.filter(g => g !== 'Valves').sort(), 'the eleven groups of your own');
assert.deepEqual(r.made.filter(g => g.startsWith('Skynet/')).sort(), PICTURE_GROUPS.filter(g => g !== 'Lights_LEDs' && g !== 'Pumps').map(g => 'Skynet/' + g).sort(), 'and the eleven Skynet groups');
assert.equal(fs.readFileSync(path.join(images, 'Skynet/Pumps/Pump_Red_Rip_On.png'), 'utf8'), 'red pump');
assert.ok(has('Skynet/Pumps/Pump_Red_Rip_On.svg'), 'its SVG copy goes along');
assert.ok(!has('Pump_Red_Rip_On.png'));
assert.deepEqual(choices, { 'Images/Skynet/Pumps/Pump_Red_Rip_On.png': 'original' }, 'the Settings > Pictures choice follows it');
assert.ok(has('Skynet/Vessels/kettle.svg'));
assert.ok(has('Skynet/Valves/Valve_Manual_OpenH.svg') && !has('Valves/Valve_Manual_OpenH.svg'), 'moved out of a standard group of your own');
assert.equal(fs.readFileSync(path.join(images, 'Skynet/Pumps/Pump_Blue_Rip_Off.svg'), 'utf8'), '<svg>drawn</svg>', 'the hand-drawn SVG wins');
assert.ok(!has('Pump_Blue_Rip_Off.svg') && !has('Pump_Blue_Rip_Off.png'), 'the old traced copy is cleared away');
assert.equal(fs.readFileSync(path.join(images, 'samples/led_red.svg'), 'utf8'), 'mine, changed', 'a changed copy is never thrown away');
assert.ok(has('MyPump.png'), 'your own pictures stay where they are');
assert.equal(skynetGroupOf('Images/samples/Valve_Manual_OpenH.svg'), 'Valves');
assert.equal(setupPictureGroups(images, choices).moved.length, 0, 'once only');
assert.ok(inSkynet('Images/Skynet') && inSkynet('images/skynet/Pumps/a.png') && !inSkynet('Images/SkynetX') && !inSkynet('Images/Pumps'));

// samples/ is removed once it is empty
fs.rmSync(path.join(images, 'samples/led_red.svg'));
setupPictureGroups(images, {}); assert.ok(!has('samples'));

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
assert.throws(() => new FileMove(() => ({ root: d, media, scripts: d, help: d })).target('pictures', 'Skynet/Pumps/x.png'), /Skynet/, 'File Move can\'t put pictures in Skynet');
mf.rename(0, 'Images/Fermenters', 'Images/Conicals'); mf.remove(0, 'Images/Conicals');
assert.deepEqual(mf.list(0, 'Images').kept, [...PICTURE_GROUPS, 'Skynet'].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })));
mf.rename(0, 'Images/MyPump.png', 'Images/Pumps/MyPump.png');      // your picture moved into a group

// old paths still find the pictures
assert.deepEqual(mediaAliases('Images/samples/kettle.svg'), ['oakbarn/samples/kettle.svg', 'Images/Skynet/Vessels/kettle.svg']);
assert.deepEqual(mediaAliases('Images/Vessels/kettle.svg'), ['oakbarn/Vessels/kettle.svg', 'Images/Skynet/Vessels/kettle.svg']);
fs.mkdirSync(path.join(d, 'config'));
const cfg = path.join(d, 'config', 'brewery.json');
fs.writeFileSync(cfg, JSON.stringify({ workspaces: [{ name: 'Main' }], elements: [], graphics: [] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const kettle = path.join(images, 'Skynet', 'Vessels', 'kettle.svg'), pump = path.join(images, 'Skynet', 'Pumps', 'Pump_Red_Rip_On.png');
assert.equal(store.findMedia('Images/samples/kettle.svg'), kettle);
assert.equal(store.findMedia('samples/kettle.svg'), kettle);
assert.equal(store.findMedia('Images/Vessels/kettle.svg'), kettle);
assert.equal(store.findMedia('Images/Pump_Red_Rip_On.png'), pump);
assert.equal(store.findMedia('oakbarn/Pump_Red_Rip_On.png'), pump);
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
