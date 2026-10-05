// node --no-warnings test/imagepaths.test.js
// Picture paths (Fritz, 2026-10-05): imagePath_1, _2, _3 instead of a list of background pictures.
// background = 1, 2 or 3 picks one (any other number: no picture), name.image = "path" sets imagePath_1 and background = 1,
// a Process changes only imagePath_1, and after a BruControl import imagePath_2 and _3 are locked.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { Store, attrsOf, toImagePaths } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpimg'));
fs.mkdirSync(path.join(d, 'config')); fs.mkdirSync(path.join(d, 'scripts'));
fs.mkdirSync(path.join(d, 'media', 'Images'), { recursive: true });
for (const f of ['RedPump.png', 'a.png', 'b.png', 'c.png']) fs.writeFileSync(path.join(d, 'media', 'Images', f), 'x');
const cfg = path.join(d, 'config', 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ mediaRoots: ['./media'], elements: [
  { name: 'old_list', type: 'digitalOut', images: ['Images/a.png', 'Images/b.png', ''], background: 2 },   // an older BruControl import
  { name: 'old_one', type: 'picture', image: 'Images/c.png' },                                             // the old single "Image path"
  { name: 'my_widget', type: 'vKonstant', kind: 'string', imagePath_1: 'Images/a.png', imagePath_2: 'Images/b.png', imagePath_3: 'Images/c.png', background: 1 },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();

// old configs move into imagePath_1, _2, _3 (an old import list is locked like a new import)
const ol = store.get('old_list');
assert.equal(ol.images, undefined); assert.equal(ol.imagePath_1, 'Images/a.png'); assert.equal(ol.imagePath_2, 'Images/b.png'); assert.equal(ol.imagePath_3, undefined);
assert.equal(ol.imagePathsLocked, true);
const oo = store.get('old_one');
assert.equal(oo.image, undefined); assert.equal(oo.imagePath_1, 'Images/c.png'); assert.equal(oo.imagePathsLocked, undefined);
assert.equal(store.getProp('old_one', 'image'), 'Images/c.png', '.image reads imagePath_1');
assert.equal(store.getProp('old_list', 'imagepath_3'), '');
assert.equal(store.getProp('my_widget', 'imagePath_2'), 'Images/b.png');
assert.ok(attrsOf(store.get('my_widget')).includes('imagepath_1'), 'autofill offers imagepath_1');
assert.ok(attrsOf(store.get('my_widget')).includes('image'));

const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const failed = () => [...eng.status].filter(([, st]) => st.state === 'error').map(([n, st]) => `${n}: ${st.error}`);
const run = async (name, text) => { fs.writeFileSync(path.join(d, 'scripts', name + '.txt'), text); eng.start(name); await new Promise(r => setTimeout(r, 250)); };

// BruControl style: background = 1 to 3 picks the picture, any other number shows none (the value is kept as given)
await run('bg', 'my_widget.background = 3\n');
assert.equal(String(store.getProp('my_widget', 'background')), '3');
await run('bg4', '"my_widget" background = 4\n');
assert.equal(String(store.getProp('my_widget', 'background')), '4');

// Skynet style: .image sets imagePath_1 and background = 1
await run('img', 'my_widget.image = "Images/RedPump.png"\n');
assert.equal(store.getProp('my_widget', 'imagepath_1'), 'Images/RedPump.png');
assert.equal(store.getProp('my_widget', 'image'), 'Images/RedPump.png');
assert.equal(String(store.getProp('my_widget', 'background')), '1');
assert.equal(store.getProp('my_widget', 'imagepath_2'), 'Images/b.png', 'imagePath_2 is left alone');
// the old BruControl spelling does the same
await run('img2', '"my_widget" background = 2\n"my_widget" image = "Images/c.png"\n');
assert.equal(store.getProp('my_widget', 'imagepath_1'), 'Images/c.png'); assert.equal(String(store.getProp('my_widget', 'background')), '1');
// imagePath_1 can be set directly too (background stays as it is)
await run('p1', 'my_widget.background = 3\nmy_widget.imagePath_1 = "Images/a.png"\n');
assert.equal(store.getProp('my_widget', 'image'), 'Images/a.png'); assert.equal(String(store.getProp('my_widget', 'background')), '3');
assert.deepEqual(failed(), []);

// a Process cannot change imagePath_2 or _3: it is told the Skynet way
await run('p2', 'my_widget.imagePath_2 = "Images/a.png"\n');
assert.equal(failed().length, 1); assert.match(failed()[0], /^p2: .*only imagePath_1.*my_widget\.image = "path"/);
assert.equal(store.getProp('my_widget', 'imagepath_2'), 'Images/b.png');

// changes reach the screen
const seen = [];
store.on('change', (n, p, v) => seen.push(`${n}.${p}=${v}`));
store.setProp('my_widget', 'image', 'Images/b.png');
assert.deepEqual(seen, ['my_widget.imagepath_1=Images/b.png', 'my_widget.image=Images/b.png', 'my_widget.background=1']);

// importer helper: the list becomes paths and is locked
const el = toImagePaths({ name: 'x', images: ['', 'Images/b.png'] }, true);
assert.deepEqual(el, { name: 'x', imagePath_2: 'Images/b.png', imagePathsLocked: true });
eng.stopAll?.();
console.log('image path tests passed');
process.exit(0);
