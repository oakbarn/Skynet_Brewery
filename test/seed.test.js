// Release samples in defaults/ fill in missing folders only; an existing folder is never touched.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { seedDefaults } from '../lib/seed.js';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'seed-'));
const put = (f, t) => { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), t); };
assert.deepEqual(seedDefaults(root), [], 'no defaults folder: nothing happens');

put('defaults/config/brewery.json', 'sample');
put('defaults/media/Images/Pump_On.png', 'sample');
put('defaults/scripts/Demo.txt', 'sample');
assert.deepEqual(seedDefaults(root).sort(), ['config', 'media', 'scripts'], 'first start copies every folder');
assert.equal(fs.readFileSync(path.join(root, 'media/Images/Pump_On.png'), 'utf8'), 'sample');

put('media/Images/Pump_On.png', 'mine');
fs.rmSync(path.join(root, 'scripts/Demo.txt'));
put('scripts/Mine.txt', 'mine');
put('config/brewery.json', 'mine');
assert.deepEqual(seedDefaults(root), [], 'existing folders are left alone');
assert.equal(fs.readFileSync(path.join(root, 'media/Images/Pump_On.png'), 'utf8'), 'mine');
assert.equal(fs.existsSync(path.join(root, 'scripts/Demo.txt')), false, 'a deleted sample stays deleted');

fs.rmSync(path.join(root, 'config/brewery.json'));
assert.deepEqual(seedDefaults(root), ['config/brewery.json'], 'a missing layout file is filled in');
fs.rmSync(path.join(root, 'media'), { recursive: true });
assert.deepEqual(seedDefaults(root), ['media'], 'a folder moved away comes back as samples');
console.log('seed tests passed');
