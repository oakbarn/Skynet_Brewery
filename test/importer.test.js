// Skynet BruControl Importer (Rule 15.4): finding BruControl config files and a quick look inside one
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { defaultFolders, startFolder, findConfigs, isConfigName, summarize, settingsFile, loadSettings, saveSettings, pickFolderScript, pickFileScript, isoLocal } from '../lib/importer.js';
import { importerProfileDir, profileDir, openAppWindow } from '../lib/appwindow.js';

// ONLY Documents\BruControl (the real Documents folder Windows reports); nowhere else (Fritz, 2026-11-06)
const env = { USERPROFILE: 'C:\\Users\\Fritz', OneDrive: 'C:\\Users\\Fritz\\OneDrive', SystemDrive: 'C:', LOCALAPPDATA: 'C:\\Users\\Fritz\\AppData\\Local' };
assert.deepEqual(defaultFolders(env, 'C:\\Users\\Fritz\\OneDrive\\Documents'), ['C:\\Users\\Fritz\\OneDrive\\Documents\\BruControl']);
assert.deepEqual(defaultFolders(env), ['C:\\Users\\Fritz\\Documents\\BruControl']);
assert.ok(isConfigName('Oakbarn.BRUCFG') && isConfigName('default.config') && isConfigName('Default.brucfg'));
assert.ok(!isConfigName('app.config') && !isConfigName('notes.txt'), 'only BruControl config files');
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
    <Workspace><Name>Fermentation</Name><Elements><Element/><Element i:type="GlobalVariableElement"/></Elements></Workspace>
  </Workspaces>
</Configuration>`;
fs.writeFileSync(path.join(dir, 'Oakbarn.brucfg'), xml);
fs.mkdirSync(path.join(dir, 'Backups'));
fs.writeFileSync(path.join(dir, 'Backups', 'Old.BRUCFG'), xml);
fs.writeFileSync(path.join(dir, 'notes.txt'), 'not a config');
const old = Date.now() / 1000 - 86400;
fs.utimesSync(path.join(dir, 'Backups', 'Old.BRUCFG'), old, old);
fs.writeFileSync(path.join(dir, 'default.config'), xml);
const found = findConfigs(dir);
assert.equal(found.exists, true);
assert.deepEqual(found.files.map(f => [f.name, f.isDefault]), [['Oakbarn.brucfg', false], ['default.config', true]], 'only this folder; the default one last');
assert.equal(found.own, 1);
assert.deepEqual(findConfigs(dir, { depth: 1 }).files.map(f => [f.name, f.sub]), [['Oakbarn.brucfg', ''], ['Old.BRUCFG', 'Backups'], ['default.config', '']], 'subfolders only when asked, newest first, any case');
fs.rmSync(path.join(dir, 'Oakbarn.brucfg'));
assert.equal(findConfigs(dir).own, 0, 'only the default config: the person is asked to point to their folder');
assert.match(found.files[0].modified, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, 'ISO 8601 date (Rule 3)');
assert.ok(found.files[0].size > 0);
assert.deepEqual(findConfigs(path.join(dir, 'nope')), { folder: path.join(dir, 'nope'), exists: false, own: 0, files: [] }, 'a missing folder');
assert.equal(isoLocal(new Date(2026, 10, 6, 4, 5).getTime()), '2026-11-06 04:05');

// a quick look inside
const s = summarize(xml);
assert.deepEqual(s.interfaces, [
  { name: 'Brewery (2560)', link: 'Serial', enabled: true, ports: 2 },
  { name: 'Interface 1', link: 'Serial', enabled: false, ports: 0 }]);
assert.deepEqual(s.tabs, [{ name: 'Brew', items: 2 }, { name: 'Fermentation', items: 2 }]);
assert.equal(s.items, 4); assert.equal(s.processes, 1); assert.equal(s.globals, 4, 'the Globals list and the Global Variable elements');
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
// Browse for the config file: Windows' Open box in Documents\BruControl, .brucfg files only (Fritz, 2026-11-06)
{
  const ps = pickFileScript("C:\\Users\\Fritz's\\Documents\\BruControl");
  assert.ok(ps.includes('OpenFileDialog') && ps.includes('*.brucfg') && ps.includes("$f.InitialDirectory = 'C:\\Users\\Fritz''s\\Documents\\BruControl'"));
}
// BruControl backups (.bak) are the same config file inside (Fritz, 2026-11-07)
{
  const { isBackupName, backupDate, configBase, isDefaultConfig, makeImportCopy } = await import('../lib/importer.js');
  assert.ok(isConfigName('default.brucfg.20260615.bak') && isConfigName('Oakbarn.BAK') && isBackupName('x.brucfg.20260615.bak'));
  assert.ok(!isDefaultConfig('default.brucfg.20260615.bak'), 'a backup is not BruControl\'s default config');
  assert.equal(backupDate('default.brucfg.20260615.bak'), '2026-06-15');
  assert.equal(backupDate('Oakbarn.bak'), '');
  assert.equal(configBase('default.brucfg.20260615.bak'), 'default_Backup_2026-06-15');
  assert.equal(configBase('Oakbarn.brucfg.bak'), 'Oakbarn_Backup');
  assert.equal(configBase('Oakbarn.brucfg'), 'Oakbarn');
  assert.equal(safeName('default.brucfg.20260615.bak'), 'default_Backup_2026-06-15');
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bak-'));
  fs.writeFileSync(path.join(d, 'Oakbarn.brucfg'), '<Configuration/>');
  fs.writeFileSync(path.join(d, 'Oakbarn.brucfg.20260615.bak'), '<Configuration/>');
  fs.writeFileSync(path.join(d, 'default.config'), '<Configuration/>');
  const f = findConfigs(d);
  assert.deepEqual(f.files.map(x => [x.name, x.isBackup, x.isDefault, x.backupDate, x.base]), [
    ['Oakbarn.brucfg.20260615.bak', true, false, '2026-06-15', 'Oakbarn_Backup_2026-06-15'], ['Oakbarn.brucfg', false, false, '', 'Oakbarn'],
    ['default.config', false, true, '', 'default']], 'backups first, then config files, then the default one');
  // BruControl's own "Config Backup" folder is listed too, backups only (Fritz, 2026-11-07)
  fs.mkdirSync(path.join(d, 'Config Backup'));
  fs.writeFileSync(path.join(d, 'Config Backup', 'Oakbarn.brucfg.20260601.bak'), '<Configuration/>');
  fs.writeFileSync(path.join(d, 'Config Backup', 'Other.brucfg'), '<Configuration/>');
  fs.utimesSync(path.join(d, 'Config Backup', 'Oakbarn.brucfg.20260601.bak'), Date.now() / 1000 - 999, Date.now() / 1000 - 999);
  fs.utimesSync(path.join(d, 'Config Backup', 'Other.brucfg'), Date.now() / 1000 - 999, Date.now() / 1000 - 999);
  assert.deepEqual(findConfigs(d).files.map(x => [x.sub, x.name]), [['', 'Oakbarn.brucfg.20260615.bak'], ['Config Backup', 'Oakbarn.brucfg.20260601.bak'],
    ['', 'Oakbarn.brucfg'], ['Config Backup', 'Other.brucfg'], ['', 'default.config']], 'the Config Backup folder: its backups and any config file put there');
  const copy = makeImportCopy(path.join(d, 'Oakbarn.brucfg.20260615.bak'), path.join(d, 'Import'), { ms: new Date(2026, 10, 7, 3, 4, 5).getTime() });
  assert.equal(path.basename(copy), 'Oakbarn_Backup_2026-06-15_2026-11-07T030405.brucfg', 'the Import Copy of a backup is a plain .brucfg');
  assert.ok(pickFileScript('').includes('*.brucfg;*.bak'), 'Browse shows config files and backups');
  fs.rmSync(d, { recursive: true, force: true });
}
// The buttons on page 3 (Fritz, 2026-11-07: "do not work"): the Windows boxes open in front; \downloads means the user's Downloads
{
  const { resolveFolder } = await import('../lib/importer.js');
  const there = new Set(['C:\\Users\\Fritz\\Downloads', 'C:\\Users\\Fritz\\Documents\\BruControl', 'D:\\Brew']);
  const o = { home: 'C:\\Users\\Fritz', exists: p => there.has(p), join: path.win32.join };
  assert.equal(resolveFolder('\\downloads', { ...o, exists: p => there.has(p.replace('downloads', 'Downloads')) }), 'C:\\Users\\Fritz\\downloads');
  assert.equal(resolveFolder('Downloads', o), 'C:\\Users\\Fritz\\Downloads');
  assert.equal(resolveFolder('Documents\\BruControl', o), 'C:\\Users\\Fritz\\Documents\\BruControl');
  assert.equal(resolveFolder('D:\\Brew', o), 'D:\\Brew', 'a full path is kept');
  assert.equal(resolveFolder('\\Nowhere', o), '\\Nowhere', 'not found: kept, and the page says it is not there');
  assert.equal(resolveFolder('  "D:\\Brew"  ', o), 'D:\\Brew', 'quotes from Copy as path are taken off');
  for (const ps of [pickFileScript(''), pickFolderScript('')]) assert.ok(ps.includes('$o.Show(); $o.Activate()') && ps.includes('$o.Close()'), 'the box opens in front');
}
console.log('importer tests passed');

// ---- the Schema file: Importer -> Brewing\Import -> Panel (Fritz, 2026-11-06)
import { brewingFolder, importFolder, importFileName, safeName, buildSchemaFile, readSchemaFile, listSchemaFiles, SCHEMA_FILE_KIND } from '../lib/importer.js';
import { Schemas } from '../lib/schemas.js';
assert.equal(brewingFolder(path.join('C:', 'Brewing', 'BrewPanel')), path.join('C:', 'Brewing'), 'the folder above BrewPanel');
assert.equal(importFolder(path.join('x', 'Brewing', 'BrewPanel'), {}), path.join('x', 'Brewing', 'Import'));
assert.equal(importFolder('/a', { SKYNET_IMPORT_DIR: '/b' }), '/b');
assert.equal(safeName('26-26-46 VGC UNI: MB Relay.brucfg'), '26-26-46_VGC_UNI~_MB_Relay');
assert.equal(importFileName('Oakbarn', new Date(2026, 10, 6, 18, 5, 9).getTime()), 'Oakbarn_2026-11-06T180509.json', 'ISO 8601 (Rule 3)');
{
  const conv = { devices: [{ name: 'Brewery' }], workspaces: [{ name: 'B1' }], elements: [{ name: 'Pump_1', workspace: 'B1' }], scripts: [{ name: 'Mash', text: 'sleep 1' }], autostart: [], warnings: ['w1'] };
  const f = buildSchemaFile(conv, { name: 'Oak barn', source: 'Oak.brucfg' });
  assert.equal(f.kind, SCHEMA_FILE_KIND); assert.equal(f.schema.name, 'Oak_barn'); assert.equal(f.draft, true);
  assert.deepEqual(f.processes, [{ name: 'Mash', text: 'sleep 1' }]);
  const back = readSchemaFile(JSON.parse(JSON.stringify(f)));
  assert.equal(back.fromImporter, true); assert.equal(back.processes.length, 1); assert.equal(back.schema.elements.length, 1);
  // a file from the Panel's own "Save as .json file" opens too (no Processes in it)
  const own = readSchemaFile({ name: 'Mine', workspaces: [], elements: [] });
  assert.equal(own.fromImporter, false); assert.deepEqual(own.processes, []);
  assert.throws(() => readSchemaFile({ hello: 1 }), /not a Skynet Schema file/);

  // the Panel adds it as a new Schema; a taken name gets _2
  const sdir = fs.mkdtempSync(path.join(os.tmpdir(), 'schimp-'));
  const fakeStore = { config: { schema: { id: 'main', name: 'Main' }, workspaces: [], elements: [], devices: [] } };
  const sch = Object.create(Schemas.prototype);
  sch.dir = sdir; sch.store = fakeStore;
  sch.file = id => path.join(sdir, id + '.json');
  sch.has = id => fs.existsSync(sch.file(id));
  sch.list = () => fs.readdirSync(sdir).filter(n => n.endsWith('.json')).map(n => ({ id: n.slice(0, -5), name: JSON.parse(fs.readFileSync(path.join(sdir, n), 'utf8')).name }));
  const a = sch.addFromFile(f.schema, { from: 'Oak.json' });
  assert.equal(a.name, 'Oak_barn');
  const saved = JSON.parse(fs.readFileSync(sch.file(a.id), 'utf8'));
  assert.equal(saved.importedFrom, 'Oak.json'); assert.equal(saved.elements[0].name, 'Pump_1'); assert.equal(saved.title, 'Oak_barn');
  assert.equal(sch.addFromFile(f.schema).name, 'Oak_barn_2', 'a taken name gets _2');
  // the Import folder list, newest first
  fs.writeFileSync(path.join(sdir, 'notes.txt'), 'x');
  assert.equal(listSchemaFiles(sdir).files.length, 2);
  assert.equal(listSchemaFiles(path.join(sdir, 'none')).exists, false);
  fs.rmSync(sdir, { recursive: true, force: true });
}
console.log('importer Schema file tests passed');

// Interfaces with no items come in only when ticked (Fritz, 2026-11-08)
{
  const { dropEmptyInterfaces } = await import('../lib/importer.js');
  const conv = { devices: [{ name: 'Main' }, { name: 'LV1' }, { name: 'Test' }], elements: [{ device: 'Main' }] };
  const r = dropEmptyInterfaces(conv, ['Test']);
  assert.deepEqual(r.conv.devices.map(d => d.name), ['Main', 'Test']);
  assert.deepEqual(r.dropped, ['LV1']);
  assert.equal(conv.devices.length, 3, 'the converted file is not changed');
  assert.deepEqual(dropEmptyInterfaces(conv).dropped, ['LV1', 'Test'], 'none ticked: every empty one left out');
}
