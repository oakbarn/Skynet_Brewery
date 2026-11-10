// Move Brain (Rule 9.9, lib/brainmove.js): the Move file round trip, the lock, the start-up move and the USB port change
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { makeZip, readZip, lock, unlock, makeMoveFile, checkMoveFile, saveChecked, stageMove, applyPendingMove, usbInterfaces, remapConfig, remapSchemaFiles, suggestPorts, pendingFile } from '../lib/brainmove.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'brainmove-'));
const put = (f, t) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, t); };
const brain = (name) => {
  const root = path.join(tmp, name);
  return { root, dirs: { config: path.join(root, 'config'), data: path.join(root, 'data'), scripts: path.join(root, 'scripts'), media: path.join(root, 'media') } };
};

// the zip writer and reader
{
  const big = Buffer.alloc(5000, 'a'), bin = Buffer.from([0, 1, 2, 255]);
  const z = readZip(makeZip([{ name: 'a/b.txt', data: big }, { name: 'c.bin', data: bin }, { name: 'é.txt', data: Buffer.from('x') }]));
  assert.deepEqual(z.map(e => e.name), ['a/b.txt', 'c.bin', 'é.txt']);
  assert.ok(z[0].data.equals(big) && z[1].data.equals(bin));
}
// the Move password lock
{
  const f = lock(Buffer.from('hello'), 'secret1');
  assert.equal(unlock(f, 'secret1').toString(), 'hello');
  assert.throws(() => unlock(f, 'wrong12'), /Wrong Move password/);
  assert.throws(() => lock(Buffer.from('x'), 'abc'), /at least 6/);
  assert.throws(() => unlock(Buffer.from('PK not ours at all, long enough to pass the size check ...........'), 'x'), /not a Skynet Brain Move file/);
}

// the old Brain: a Windows computer with two Schemas, Mega on COM3 (one on the Simulator), ESP32 on Ethernet
const old = brain('old');
const cfg = { title: 'T', schema: { id: 'home', name: 'Home' }, mediaRoots: ['./media', 'D:\\Pictures'],
  devices: [{ name: 'Mega_1', connection: 'serial', port: 'COM3', _key: 'k1' }, { name: 'Esp', connection: 'ethernet', host: '10.0.0.5', port: 4100 }] };
put(path.join(old.dirs.config, 'brewery.json'), JSON.stringify(cfg));
put(path.join(old.dirs.config, 'schemas', 'home.json'), JSON.stringify({ name: 'Home', devices: cfg.devices }));
put(path.join(old.dirs.config, 'schemas', 'home.state.json'), '{"gG_X":5}');
put(path.join(old.dirs.config, 'schemas', 'test.json'), JSON.stringify({ name: 'Test', devices: [{ name: 'Mega_2', connection: 'simulator', realConnection: 'serial', port: 'COM3' }, { name: 'Nano', connection: 'serial', port: 'COM7' }] }));
put(path.join(old.dirs.data, 'users.json'), '{"users":[{"name":"fritz"}]}');
put(path.join(old.dirs.data, 'sessions.json'), '{"x":1}');
put(path.join(old.dirs.data, 'state.json'), '{"gG_Y":7}');
put(path.join(old.dirs.data, 'brewlog.db'), 'live db');
put(path.join(old.dirs.scripts, 'Mash.txt'), 'wait 1');
put(path.join(old.dirs.media, 'Images', 'mine.png'), 'png');
const copy = path.join(tmp, 'copy.db'); put(copy, 'clean db');

assert.deepEqual(usbInterfaces(old.dirs.config).map(x => `${x.schema}/${x.interface}/${x.port}`), ['Home/Mega_1/COM3', 'Test/Mega_2/COM3', 'Test/Nano/COM7']);

const made = makeMoveFile({ dirs: old.dirs, password: 'brewday', brewlogCopy: copy, from: 'OLDPC', version: 'PR1',
  ports: [{ path: 'COM3', manufacturer: 'Arduino', serialNumber: 'SN-MEGA' }, { path: 'COM7', manufacturer: 'wch', serialNumber: '' }], mediaRoots: cfg.mediaRoots });
assert.match(made.fileName, /^Skynet_Brain_Move_\d{8}T\d{6}\.skynetmove$/);
assert.equal(made.manifest.notMoved[0], 'D:\\Pictures');
assert.ok(!made.file.includes(Buffer.from('"_key"')) && !made.file.includes(Buffer.from('fritz')), 'locked: no hidden key or user name can be read');
const inside = checkMoveFile(unlock(made.file, 'brewday'));
const names = inside.entries.map(e => e.name);
assert.ok(names.includes('data/users.json') && names.includes('config/schemas/home.state.json') && names.includes('scripts/Mash.txt') && names.includes('media/Images/mine.png'));
assert.ok(!names.includes('data/sessions.json'), 'browser sign-ins stay on the old Brain');
assert.equal(inside.entries.find(e => e.name === 'data/brewlog.db').data.toString(), 'clean db', 'the brew log is the clean copy');

// a bad file is refused
assert.throws(() => checkMoveFile(makeZip([{ name: 'x.txt', data: Buffer.from('x') }])), /not a Skynet Brain Move file/);
assert.throws(() => checkMoveFile(makeZip([{ name: 'brain-move.json', data: Buffer.from('{"skynetBrainMove":1}') }, { name: '../evil', data: Buffer.from('x') }])), /won't copy/);
assert.throws(() => checkMoveFile(makeZip([{ name: 'brain-move.json', data: Buffer.from('{"skynetBrainMove":1}') }, { name: 'server.js', data: Buffer.from('x') }])), /won't copy/);

// the new Brain: a fresh Pi install
const pi = brain('pi');
put(path.join(pi.dirs.config, 'brewery.json'), '{"title":"sample"}');
put(path.join(pi.dirs.data, 'users.json'), '{"users":[{"name":"admin"}]}');
put(path.join(pi.dirs.media, 'Images', 'sample.png'), 'sample');
assert.equal(applyPendingMove(pi.root, pi.dirs), null, 'nothing waiting: nothing done');
assert.throws(() => stageMove(pi.root), /Bring in a Brain Move file first/);
saveChecked(pi.root, unlock(made.file, 'brewday'));
stageMove(pi.root);
assert.ok(fs.existsSync(pendingFile(pi.root)));
const r = applyPendingMove(pi.root, pi.dirs);
assert.match(r.lines[0], /Brain Move done: everything from OLDPC/);
assert.ok(r.lines.some(l => /D:\\Pictures/.test(l)));
assert.equal(fs.readFileSync(path.join(pi.dirs.data, 'users.json'), 'utf8'), '{"users":[{"name":"fritz"}]}', 'the old logins');
assert.equal(fs.readFileSync(path.join(pi.dirs.data, 'state.json'), 'utf8'), '{"gG_Y":7}');
assert.equal(fs.readFileSync(path.join(pi.dirs.scripts, 'Mash.txt'), 'utf8'), 'wait 1');
assert.ok(fs.existsSync(path.join(pi.dirs.media, 'Images', 'mine.png')));
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(pi.dirs.config, 'brewery.json'))).mediaRoots, ['./media'], 'a Windows media folder is not kept');
assert.equal(fs.readFileSync(path.join(r.backup, 'data', 'users.json'), 'utf8'), '{"users":[{"name":"admin"}]}', "the Pi's own files are kept");
assert.ok(fs.existsSync(path.join(r.backup, 'media', 'Images', 'sample.png')));
assert.ok(fs.existsSync(path.join(r.backup, 'Brain_Move_file.zip')));
assert.ok(!fs.existsSync(pendingFile(pi.root)), 'done once');
assert.equal(applyPendingMove(pi.root, pi.dirs), null);
const done = JSON.parse(fs.readFileSync(path.join(pi.dirs.data, 'brain-move.json')));
assert.equal(done.usbPorts[0].serialNumber, 'SN-MEGA');

// a damaged pending file changes nothing
put(pendingFile(pi.root), 'junk');
const bad = applyPendingMove(pi.root, pi.dirs);
assert.ok(bad.failed && /Nothing was changed/.test(bad.lines[0]));
assert.equal(fs.readFileSync(path.join(pi.dirs.data, 'users.json'), 'utf8'), '{"users":[{"name":"fritz"}]}');

// USB ports: suggestions, then the change in every Schema
const now = [{ path: '/dev/ttyACM0', serialNumber: 'SN-MEGA' }, { path: '/dev/ttyUSB0', serialNumber: '' }];
assert.deepEqual(suggestPorts(['COM3', 'COM7'], done.usbPorts, now), { COM3: '/dev/ttyACM0', COM7: '/dev/ttyUSB0' }, 'serial number, then the only port left');
assert.deepEqual(suggestPorts(['COM3', 'COM7'], [], now), { COM3: '', COM7: '' }, 'no guess when it could be either');
assert.deepEqual(suggestPorts(['/dev/ttyACM0'], [], now), { '/dev/ttyACM0': '/dev/ttyACM0' }, 'a port that is still here stays');
const live = JSON.parse(fs.readFileSync(path.join(pi.dirs.config, 'brewery.json')));
const map = { COM3: '/dev/ttyACM0', COM7: '/dev/ttyUSB0' };
assert.equal(remapConfig(live, map), 1);
assert.equal(live.devices[0].port, '/dev/ttyACM0');
assert.equal(live.devices[1].port, 4100, 'an Ethernet board is not touched');
assert.equal(remapSchemaFiles(pi.dirs.config, map, 'home'), 2);
const test = JSON.parse(fs.readFileSync(path.join(pi.dirs.config, 'schemas', 'test.json')));
assert.deepEqual(test.devices.map(d => d.port), ['/dev/ttyACM0', '/dev/ttyUSB0'], 'the Simulator board keeps its real port, changed too');
assert.equal(JSON.parse(fs.readFileSync(path.join(pi.dirs.config, 'schemas', 'home.json'))).devices[0].port, 'COM3', 'the loaded Schema is saved by the panel itself');

fs.rmSync(tmp, { recursive: true, force: true });
console.log('brainmove tests passed');
