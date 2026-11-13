// Fresh Start and Modified Fresh Start (Rule 9.8, lib/freshstart.js)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { freshStart, applyKeptSettings, KEPT_FILE } from '../lib/freshstart.js';

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
const has = (root, f) => fs.existsSync(path.join(root, f));

// a real Fresh Start keeps nothing but the program: the media folder goes too (run the Media Setup next)
{
  const { root, imp } = panel();
  const r = freshStart('fresh', root, imp);
  assert.deepEqual(r.failed, []);
  for (const f of ['config', 'data', 'processes', 'backups', 'media']) assert.ok(!has(root, f), f);
  assert.ok(has(root, 'server.js'));
  assert.deepEqual(fs.readdirSync(imp), []);
}
// a Modified Fresh Start keeps Default settings, own Profiles, Equipment Profiles, Recipes, pictures, sounds, backups, Import
{
  const { root, imp } = panel();
  const r = freshStart('modified', root, imp);
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

console.log('fresh start tests passed');
