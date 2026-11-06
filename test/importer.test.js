// Skynet BruControl Importer (Rule 15.4): finding BruControl config files and a quick look inside one
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { defaultFolders, startFolder, findConfigs, summarize, settingsFile, loadSettings, saveSettings, pickFolderScript, isoLocal } from '../lib/importer.js';
import { importerProfileDir, profileDir, openAppWindow } from '../lib/appwindow.js';

// Documents\BruControl first (the real Documents folder Windows reports), then the usual places, each once
const env = { USERPROFILE: 'C:\\Users\\Fritz', OneDrive: 'C:\\Users\\Fritz\\OneDrive', SystemDrive: 'C:', LOCALAPPDATA: 'C:\\Users\\Fritz\\AppData\\Local' };
assert.deepEqual(defaultFolders(env, 'C:\\Users\\Fritz\\Documents'), [
  'C:\\Users\\Fritz\\Documents\\BruControl', 'C:\\Users\\Fritz\\OneDrive\\Documents\\BruControl', 'C:\\BruControl']);
assert.equal(defaultFolders(env, 'D:\\Docs')[0], 'D:\\Docs\\BruControl', 'a moved Documents folder comes first');
assert.equal(startFolder(['a', 'b', 'c'], p => p === 'b'), 'b', 'the first folder that is there');
assert.equal(startFolder(['a', 'b'], () => false), 'a', 'none there: the usual one, shown as not found');

// a folder with config files in it and in a Backups subfolder; other files are left out
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bruimp-'));
const xml = `\uFEFF<?xml version="1.0" encoding="utf-8"?>
<Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <Devices>
    <Device><Enabled>true</Enabled><Interface>Serial</Interface><Name>Brewery (2560)</Name>
      <Ports><DevicePort i:type="DigitalOutPort"/><DevicePort i:type="DigitalInPort"/></Ports></Device>
    <Device><Enabled>false</Enabled><Interface>Serial</Interface><Name>Interface 1</Name><Ports/></Device>
  </Devices>
  <Globals><Global/><Global/><Global/></Globals>
  <Processes><Process/></Processes>
  <Workspaces>
    <Workspace><Name>Brew</Name><Elements><Element/><Element/></Elements></Workspace>
    <Workspace><Name>Fermentation</Name><Elements><Element/></Elements></Workspace>
  </Workspaces>
</Configuration>`;
fs.writeFileSync(path.join(dir, 'Oakbarn.brucfg'), xml);
fs.mkdirSync(path.join(dir, 'Backups'));
fs.writeFileSync(path.join(dir, 'Backups', 'Old.BRUCFG'), xml);
fs.writeFileSync(path.join(dir, 'notes.txt'), 'not a config');
const old = Date.now() / 1000 - 86400;
fs.utimesSync(path.join(dir, 'Backups', 'Old.BRUCFG'), old, old);
const found = findConfigs(dir);
assert.equal(found.exists, true);
assert.deepEqual(found.files.map(f => [f.name, f.sub]), [['Oakbarn.brucfg', ''], ['Old.BRUCFG', 'Backups']], 'newest first, subfolders too, any case');
assert.match(found.files[0].modified, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, 'ISO 8601 date (Rule 3)');
assert.ok(found.files[0].size > 0);
assert.deepEqual(findConfigs(path.join(dir, 'nope')), { folder: path.join(dir, 'nope'), exists: false, files: [] }, 'a missing folder');
assert.equal(findConfigs(dir, { depth: 0 }).files.length, 1, 'depth 0 stays in the folder');
assert.equal(isoLocal(new Date(2026, 10, 6, 4, 5).getTime()), '2026-11-06 04:05');

// a quick look inside
const s = summarize(xml);
assert.deepEqual(s.interfaces, [
  { name: 'Brewery (2560)', link: 'Serial', enabled: true, ports: 2 },
  { name: 'Interface 1', link: 'Serial', enabled: false, ports: 0 }]);
assert.deepEqual(s.tabs, [{ name: 'Brew', items: 2 }, { name: 'Fermentation', items: 1 }]);
assert.equal(s.items, 3); assert.equal(s.processes, 1); assert.equal(s.globals, 3);
assert.throws(() => summarize('<x/>'), /not a BruControl config file/);

// the Importer keeps only its own small settings (last folder and file), never Schemas (Rule 1.7)
assert.equal(settingsFile(env, 'win32'), 'C:\\Users\\Fritz\\AppData\\Local\\SkynetBrewer\\Importer\\settings.json');
const sf = path.join(dir, 'set', 'settings.json');
assert.deepEqual(loadSettings(sf), {}, 'no file yet');
saveSettings(sf, { folder: dir });
assert.deepEqual(loadSettings(sf), { folder: dir });

// Windows' Browse For Folder box; a quote in the folder cannot break out of the PowerShell text
const ps = pickFolderScript("C:\\Users\\O'Brien");
assert.match(ps, /FolderBrowserDialog/);
assert.ok(ps.includes("'C:\\Users\\O''Brien'"));

// its own clean window, with its own profile, so closing one window never closes the other
assert.equal(importerProfileDir(env), 'C:\\Users\\Fritz\\AppData\\Local\\SkynetBrewer\\ImporterWindow');
assert.ok(!importerProfileDir(env).includes(profileDir(env)), 'the Panel window close never matches the Importer window');
{
  const ran = [];
  const how = openAppWindow('http://localhost:8095', { platform: 'win32', env, port: 8095, find: () => 'edge.exe', run: (e, a) => ran.push(a), list: () => [], profile: importerProfileDir(env) });
  assert.equal(how, 'app');
  assert.ok(ran[0].includes('--user-data-dir=C:\\Users\\Fritz\\AppData\\Local\\SkynetBrewer\\ImporterWindow'));
}

fs.rmSync(dir, { recursive: true, force: true });
console.log('importer tests passed');
