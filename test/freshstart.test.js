// Fresh Start and Modified Fresh Start (Rule 9.8, lib/freshstart.js)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { freshStart, applyKeptSettings, skynetMedia, KEPT_FILE } from '../lib/freshstart.js';

const put = (f, s = 'x') => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
function panel() {
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'fresh-')), root = path.join(top, 'BrewPanel'), imp = path.join(top, 'Import');
  put(path.join(root, 'config', 'brewery.json'), JSON.stringify({ brewDefaults: { units: 'metric', boilOff: 4 }, elements: [] }));
  for (const f of ['schemas/a.json', 'profiles/mash/My_Mash.json', 'recipes/IPA.json', 'equipment/Big_Rig.json', 'backups/b.json', 'templates/t.json']) put(path.join(root, 'config', f));
  put(path.join(root, 'data', 'users.json')); put(path.join(root, 'processes', 'Mash.txt')); put(path.join(root, 'backups', 'old.json'));
  put(path.join(root, 'media', 'Images', 'Skynet', 'S.svg')); put(path.join(root, 'media', 'Images', 'Pumps', 'Mine.png'));
  put(path.join(root, 'media', 'Images', 'User', 'Imported.png')); put(path.join(root, 'media', 'sounds', 'Skynet', 'Bell.mp3')); put(path.join(root, 'media', 'sounds', 'my.mp3'));
  put(path.join(imp, 'tartan.brucfg'));
  put(path.join(root, 'server.js'));
  return { root, imp };
}
const media = new Set(['images/skynet/s.svg', 'sounds/skynet/bell.mp3']);
const has = (root, f) => fs.existsSync(path.join(root, f));

// a real Fresh Start keeps nothing but the program and the Skynet pictures and sounds
{
  const { root, imp } = panel();
  const r = freshStart('fresh', root, imp, { media });
  assert.deepEqual(r.failed, []);
  for (const f of ['config', 'data', 'processes', 'backups', 'media/Images/Pumps/Mine.png', 'media/Images/User', 'media/sounds/my.mp3']) assert.ok(!has(root, f), f);
  for (const f of ['server.js', 'media/Images/Skynet/S.svg', 'media/sounds/Skynet/Bell.mp3']) assert.ok(has(root, f), f);
  assert.deepEqual(fs.readdirSync(imp), []);
}
// a Modified Fresh Start keeps Default settings, own Profiles, Equipment Profiles, Recipes, pictures, sounds, backups, Import
{
  const { root, imp } = panel();
  const r = freshStart('modified', root, imp, { media });
  assert.deepEqual(r.failed, []);
  for (const f of ['config/brewery.json', 'config/schemas', 'config/templates', 'data', 'processes']) assert.ok(!has(root, f), f);
  for (const f of ['config/profiles/mash/My_Mash.json', 'config/recipes/IPA.json', 'config/equipment/Big_Rig.json', 'config/backups/b.json', 'backups/old.json', 'media/Images/Pumps/Mine.png', 'media/sounds/my.mp3', 'config/' + KEPT_FILE]) assert.ok(has(root, f), f);
  assert.deepEqual(fs.readdirSync(imp), ['tartan.brucfg']);
  // the panel's next start puts the Default settings back into the new brewery.json, then deletes the kept file
  let wrote = 0;
  const store = { configPath: path.join(root, 'config', 'brewery.json'), config: { brewDefaults: { units: 'us', other: 1 } }, writeConfig: () => wrote++ };
  assert.equal(applyKeptSettings(store), true);
  assert.deepEqual(store.config.brewDefaults, { units: 'metric', other: 1, boilOff: 4 });
  assert.equal(wrote, 1);
  assert.ok(!has(root, 'config/' + KEPT_FILE));
  assert.equal(applyKeptSettings(store), false);
}
assert.throws(() => freshStart('everything', '/nowhere', null));

// lib/skynet_media.json lists every Skynet picture and sound in git (node tools/skynet-media-list.js)
{
  let inGit = null;
  try { inGit = execFileSync('git', ['ls-files', 'media'], { encoding: 'utf8' }).split('\n').filter(f => f && !f.endsWith('.gitkeep') && !f.startsWith('media/notes/')).map(f => f.slice(6).toLowerCase()); } catch { }
  if (inGit?.length) { const list = skynetMedia(); for (const f of inGit) assert.ok(list.has(f), `${f} missing from lib/skynet_media.json: run node tools/skynet-media-list.js`); }
}
console.log('fresh start tests passed');
