// Release samples in defaults/ fill in missing folders only; an existing folder is never touched.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { seedDefaults, renameOldProcessesFolder } from '../lib/seed.js';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'seed-'));
const put = (f, t) => { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), t); };
assert.deepEqual(seedDefaults(root), [], 'no defaults folder: nothing happens');

put('defaults/config/brewery.json', 'sample');
put('defaults/media/Images/Pump_On.png', 'sample');
put('defaults/processes/Demo.txt', 'sample');
assert.deepEqual(seedDefaults(root).sort(), ['config', 'media', 'processes'], 'first start copies every folder');
assert.equal(fs.readFileSync(path.join(root, 'media/Images/Pump_On.png'), 'utf8'), 'sample');

put('media/Images/Pump_On.png', 'mine');
fs.rmSync(path.join(root, 'processes/Demo.txt'));
put('processes/Mine.txt', 'mine');
put('config/brewery.json', 'mine');
assert.deepEqual(seedDefaults(root), [], 'existing folders are left alone');
put('defaults/media/Images/Valve_Open.png', 'sample');
put('defaults/media/sounds/beep.wav', 'sample');
assert.deepEqual(seedDefaults(root), ['media (2 sample files)'], 'sample pictures and sounds a media folder is missing are added');
assert.equal(fs.readFileSync(path.join(root, 'media/Images/Pump_On.png'), 'utf8'), 'mine', 'yours are never replaced');
assert.equal(fs.readFileSync(path.join(root, 'media/sounds/beep.wav'), 'utf8'), 'sample');
assert.deepEqual(seedDefaults(root), [], 'nothing more to add');
assert.equal(fs.readFileSync(path.join(root, 'media/Images/Pump_On.png'), 'utf8'), 'mine');
assert.equal(fs.existsSync(path.join(root, 'processes/Demo.txt')), false, 'a deleted sample stays deleted');

const TRACED = '<svg xmlns="http://www.w3.org/2000/svg" data-brewpanel-traced="Pump_On.png" data-score="0.8"></svg>';
put('media/Images/Pump_On.svg', TRACED);
put('media/Images/Mine.svg', '<svg>mine</svg>');
put('defaults/media/Images/Pump_On.svg', '<svg>drawn</svg>');
put('defaults/media/Images/Mine.svg', '<svg>sample</svg>');
assert.deepEqual(seedDefaults(root), ['media (1 sample file)'], 'a traced SVG is swapped for the hand-drawn Skynet one');
assert.equal(fs.readFileSync(path.join(root, 'media/Images/Pump_On.svg'), 'utf8'), '<svg>drawn</svg>');
assert.equal(fs.readFileSync(path.join(root, 'media/Images/Mine.svg'), 'utf8'), '<svg>mine</svg>', 'an SVG you made is never replaced');
put('defaults/media/Images/Pump_On.svg', TRACED);
put('media/Images/Pump_On.svg', '<svg>drawn</svg>');
assert.deepEqual(seedDefaults(root), [], 'a hand-drawn SVG is never swapped back for a traced one');

fs.rmSync(path.join(root, 'config/brewery.json'));
assert.deepEqual(seedDefaults(root), ['config/brewery.json'], 'a missing layout file is filled in');
fs.rmSync(path.join(root, 'media'), { recursive: true });
assert.deepEqual(seedDefaults(root), ['media'], 'a folder moved away comes back as samples');
// earlier trial versions kept Processes in scripts/: renamed once to processes/, never over an existing processes/
const r2 = fs.mkdtempSync(path.join(os.tmpdir(), 'seedren-'));
fs.mkdirSync(path.join(r2, 'scripts')); fs.writeFileSync(path.join(r2, 'scripts', 'Mash.txt'), 'wait 1');
assert.equal(renameOldProcessesFolder(path.join(r2, 'processes')), true, 'an old scripts folder becomes processes');
assert.equal(fs.readFileSync(path.join(r2, 'processes', 'Mash.txt'), 'utf8'), 'wait 1');
fs.mkdirSync(path.join(r2, 'scripts'));
assert.equal(renameOldProcessesFolder(path.join(r2, 'processes')), false, 'processes already there: nothing is moved');
assert.equal(fs.existsSync(path.join(r2, 'scripts')), true);
console.log('seed tests passed');
