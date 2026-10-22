// Picture groups (Fritz, 2026-10-22): ten Skynet folders in media/Images that can't be deleted, renamed or moved,
// the Skynet pictures moved into them once (with their SVG copies and Settings > Pictures choices), old paths still finding them,
// and the user's own pictures found after being moved into a group.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PICTURE_GROUPS, setupPictureGroups, listGroups, skynetGroupOf } from '../lib/picgroups.js';
import { MediaFiles } from '../lib/mediafiles.js';
import { Store, mediaAliases } from '../lib/store.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpgrp')), media = path.join(d, 'media'), images = path.join(media, 'Images');
const put = (rel, text) => { const f = path.join(media, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
put('Images/Pump_Red_Rip_On.png', 'red pump');
put('Images/Pump_Red_Rip_On.svg', '<svg data-brewpanel-traced="Pump_Red_Rip_On.png" data-score="0.9"></svg>');
put('Images/samples/kettle.svg', '<svg>kettle</svg>');
put('Images/samples/led_red.svg', 'mine, changed');
put('Images/Lights_LEDs/led_red.svg', 'the new one');            // a newer release already put it in its group
put('Images/MyPump.png', 'my own picture');

const choices = { 'Images/Pump_Red_Rip_On.png': 'original' };
const r = setupPictureGroups(images, choices);
assert.deepEqual(r.made.sort(), PICTURE_GROUPS.filter(g => g !== 'Lights_LEDs').sort(), 'the ten groups are made');
assert.equal(fs.readFileSync(path.join(images, 'Pumps/Pump_Red_Rip_On.png'), 'utf8'), 'red pump');
assert.ok(fs.existsSync(path.join(images, 'Pumps/Pump_Red_Rip_On.svg')), 'its SVG copy goes along');
assert.ok(!fs.existsSync(path.join(images, 'Pump_Red_Rip_On.png')));
assert.deepEqual(choices, { 'Images/Pumps/Pump_Red_Rip_On.png': 'original' }, 'the Settings > Pictures choice follows it');
assert.ok(fs.existsSync(path.join(images, 'Vessels/kettle.svg')));
assert.equal(fs.readFileSync(path.join(images, 'samples/led_red.svg'), 'utf8'), 'mine, changed', 'a changed copy is never thrown away');
assert.ok(fs.existsSync(path.join(images, 'MyPump.png')), 'the user\'s own pictures stay where they are');
assert.equal(skynetGroupOf('Images/samples/Valve_Manual_OpenH.svg'), 'Valves');
assert.equal(setupPictureGroups(images, choices).moved.length, 0, 'once only');

// samples/ is removed once it is empty
put('Images/samples/x.txt', ''); fs.rmSync(path.join(images, 'samples/x.txt')); fs.rmSync(path.join(images, 'samples/led_red.svg'));
setupPictureGroups(images, {}); assert.ok(!fs.existsSync(path.join(images, 'samples')));

// the groups list: Skynet first, then the user's own
fs.mkdirSync(path.join(images, 'Fermenters'));
const groups = listGroups(images);
assert.deepEqual(groups.slice(0, 10).map(g => g.name), PICTURE_GROUPS);
assert.deepEqual(groups.at(-1), { name: 'Fermenters', label: 'Fermenters', skynet: false });
assert.equal(groups.find(g => g.name === 'Lights_LEDs').label, 'Lights / LEDs');

// the Media screen can't delete, rename or move a Skynet group, Images or sounds; a user group it can
const mf = new MediaFiles(() => [media]);
assert.throws(() => mf.remove(0, 'Images/Motors'), /Skynet picture group/);
assert.throws(() => mf.rename(0, 'Images/Pumps', 'Images/Pumpz'), /Skynet picture group/);
assert.throws(() => mf.rename(0, 'images/motors', 'Images/Fermenters/motors'), /Skynet picture group/);
fs.mkdirSync(path.join(media, 'sounds'), { recursive: true });
assert.throws(() => mf.remove(0, 'sounds'), /can't be deleted/);
assert.throws(() => mf.remove(0, 'Images'), /can't be deleted/);
mf.rename(0, 'Images/Fermenters', 'Images/Conicals'); mf.remove(0, 'Images/Conicals');
assert.deepEqual(mf.list(0, 'Images').kept, PICTURE_GROUPS.slice().sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })));
mf.rename(0, 'Images/MyPump.png', 'Images/Pumps/MyPump.png');      // a user picture moved into a group

// old paths still find the pictures
assert.deepEqual(mediaAliases('Images/samples/kettle.svg'), ['oakbarn/samples/kettle.svg', 'Images/Vessels/kettle.svg']);
fs.mkdirSync(path.join(d, 'config'));
const cfg = path.join(d, 'config', 'brewery.json');
fs.writeFileSync(cfg, JSON.stringify({ workspaces: [{ name: 'Main' }], elements: [], graphics: [] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
assert.equal(store.findMedia('Images/samples/kettle.svg'), path.join(images, 'Vessels', 'kettle.svg'));
assert.equal(store.findMedia('samples/kettle.svg'), path.join(images, 'Vessels', 'kettle.svg'));
assert.equal(store.findMedia('Images/Pump_Red_Rip_On.png'), path.join(images, 'Pumps', 'Pump_Red_Rip_On.png'));
assert.equal(store.findMedia('oakbarn/Pump_Red_Rip_On.png'), path.join(images, 'Pumps', 'Pump_Red_Rip_On.png'));
assert.equal(store.findMedia('Images/MyPump.png'), path.join(images, 'Pumps', 'MyPump.png'), 'the user\'s own picture after moving it into a group');
assert.equal(store.findMedia('MyPump.png'), path.join(images, 'Pumps', 'MyPump.png'));
assert.equal(store.findMedia('Images/Nowhere.png'), path.join(images, 'Nowhere.png'), 'a missing picture keeps its own path');

fs.rmSync(d, { recursive: true, force: true });
console.log('picture groups tests passed');
