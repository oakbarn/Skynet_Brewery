// node --no-warnings test/backpath.test.js
// Background pictures (Fritz, 2026-11-02, Rule 7.10): .backpath, .backpath_2 and .backpath_3 (they were imagePath_1, _2, _3).
// .background = 1, 2 or 3 picks one; 0, any number over 3 or blank shows no background picture (blank is set to 0).
// name.image = "path" sets .backpath and .background = 1. Older configs and Processes are brought up to date (Rule 15.2).
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Store, attrsOf, toBackpaths, toBackpathText } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpimg'));
fs.mkdirSync(path.join(d, 'config')); fs.mkdirSync(path.join(d, 'scripts'));
fs.mkdirSync(path.join(d, 'media', 'Images'), { recursive: true });
for (const f of ['RedPump.png', 'a.png', 'b.png', 'c.png']) fs.writeFileSync(path.join(d, 'media', 'Images', f), 'x');
const cfg = path.join(d, 'config', 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ mediaRoots: ['./media'], elements: [
  { name: 'old_list', type: 'digitalOut', images: ['Images/a.png', 'Images/b.png', ''], background: 2 },   // an older BruControl import
  { name: 'old_one', type: 'picture', image: 'Images/c.png' },                                             // the old single "Image path"
  { name: 'old_paths', type: 'digitalOut', imagePath_1: 'Images/a.png', imagePath_2: 'Images/b.png', imagePathsLocked: true },   // before 2026-11-02
  { name: 'old_color', type: 'digitalOut', imagePath_1: 'Images/a.png', background: 'red' },
  { name: 'my_widget', type: 'gGlobal', kind: 'string', backpath: 'Images/a.png', backpath_2: 'Images/b.png', backpath_3: 'Images/c.png', background: 1 },
  { name: 'new_blank', type: 'digitalOut', backpath: 'Images/a.png' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();

// older configs move into backpath, backpath_2, backpath_3 (Rule 15.2: nothing old is kept)
const ol = store.get('old_list');
assert.equal(ol.images, undefined); assert.equal(ol.backpath, 'Images/a.png'); assert.equal(ol.backpath_2, 'Images/b.png'); assert.equal(ol.backpath_3, undefined);
assert.equal(ol.backpathsImported, true); assert.equal(String(ol.background), '2');
const oo = store.get('old_one');
assert.equal(oo.image, undefined); assert.equal(oo.backpath, 'Images/c.png'); assert.equal(oo.backpathsImported, undefined);
assert.equal(String(oo.background), '1', 'an older item showed its first picture with a blank background: it gets background = 1');
const op = store.get('old_paths');
assert.equal(op.imagePath_1, undefined); assert.equal(op.imagePath_2, undefined); assert.equal(op.imagePathsLocked, undefined);
assert.equal(op.backpath, 'Images/a.png'); assert.equal(op.backpath_2, 'Images/b.png'); assert.equal(op.backpathsImported, true); assert.equal(op.background, 1);
const oc = store.get('old_color');
assert.equal(oc.bgColor, 'red'); assert.equal(oc.background, 1, 'a color in background moves to Back Colour so the picture still shows');
assert.equal(store.getProp('new_blank', 'background'), '0', 'a new item with a blank background reads 0');
assert.equal(store.get('new_blank').background, undefined, 'and is not changed in the Schema');
assert.equal(store.getProp('old_one', 'image'), 'Images/c.png', '.image reads .backpath');
assert.equal(store.getProp('old_list', 'backpath_3'), '');
assert.equal(store.getProp('my_widget', 'backpath_2'), 'Images/b.png');
const at = attrsOf(store.get('my_widget'));
for (const a of ['backpath', 'backpath_2', 'backpath_3', 'background', 'image']) assert.ok(at.includes(a), 'predictive text offers ' + a);
assert.ok(!at.some(a => /imagepath/i.test(a)), 'imagePath_N is gone from predictive text');

const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const failed = () => [...eng.status].filter(([, st]) => st.state === 'error').map(([n, st]) => `${n}: ${st.error}`);
const run = async (name, text) => { fs.writeFileSync(path.join(d, 'scripts', name + '.txt'), text); eng.start(name); await new Promise(r => setTimeout(r, 250)); };

// .background = 1 to 3 picks the picture; 0 or over 3 shows none (the value is kept as given); blank becomes 0
await run('bg', 'my_widget.background = 3\n');
assert.equal(String(store.getProp('my_widget', 'background')), '3');
await run('bg4', 'my_widget.background = 4\n');
assert.equal(String(store.getProp('my_widget', 'background')), '4');
await run('bg0', 'my_widget.background = 0\n');
assert.equal(String(store.getProp('my_widget', 'background')), '0');
await run('bgb', 'my_widget.background = ""\n');
assert.equal(String(store.getProp('my_widget', 'background')), '0', 'blank sets background = 0');

// Skynet shortcut: .image sets .backpath and background = 1
await run('img', 'my_widget.image = "Images/RedPump.png"\n');
assert.equal(store.getProp('my_widget', 'backpath'), 'Images/RedPump.png');
assert.equal(store.getProp('my_widget', 'image'), 'Images/RedPump.png');
assert.equal(String(store.getProp('my_widget', 'background')), '1');
assert.equal(store.getProp('my_widget', 'backpath_2'), 'Images/b.png', '.backpath_2 is left alone');
// .backpath can be set directly (background stays as it is)
await run('p1', 'my_widget.background = 3\nmy_widget.backpath = "Images/a.png"\n');
assert.equal(store.getProp('my_widget', 'image'), 'Images/a.png'); assert.equal(String(store.getProp('my_widget', 'background')), '3');
// .backpath_2 and .backpath_3 too
await run('p2', 'my_widget.backpath_2 = "Images/a.png"\nmy_widget.Backpath_3 = "Images/c.png"\n');
assert.deepEqual(failed(), []);
assert.equal(store.getProp('my_widget', 'backpath_2'), 'Images/a.png');
assert.equal(store.getProp('my_widget', 'backpath_3'), 'Images/c.png');

// changes reach the screen
const seen = [];
store.on('change', (n, p, v) => seen.push(`${n}.${p}=${v}`));
store.setProp('my_widget', 'image', 'Images/b.png');
assert.deepEqual(seen, ['my_widget.backpath=Images/b.png', 'my_widget.image=Images/b.png', 'my_widget.background=1']);

// importer helper: the list becomes paths and is marked imported
const el = toBackpaths({ name: 'x', images: ['', 'Images/b.png'] }, true);
assert.deepEqual(el, { name: 'x', backpath_2: 'Images/b.png', backpathsImported: true, background: 1 });

// Processes written with the old names are brought up to date
assert.equal(toBackpathText('my_widget.imagePath_1 = "a.png"\nif my_widget.imagepath_2 == "" {\n"x" imagepath_3 = "c.png"\ny.ImagePath_5 = "e.png"'),
  'my_widget.backpath = "a.png"\nif my_widget.backpath_2 == "" {\n"x" backpath_3 = "c.png"\ny.backpath_5 = "e.png"');
eng.stopAll?.();
console.log('backpath tests passed');
process.exit(0);
