// Pump Cover Overlays (Fritz, 2026-11-02): my_Pump.cover = None (the default), Red, Yellow, Blue, Green, Purple, Orange, White or User;
// my_Pump.coverColor is the User cover's color. Only pumps have them. Every Skynet no-cover pump drawing has all its covers.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store, attrsOf, PUMP_COVER_CHOICES } from '../lib/store.js';
import { Engine } from '../lib/engine.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'pumpcover'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'Pump_Wort', type: 'digitalOut', subtype: 'pump' },
  { name: 'Pump_Hot', type: 'digitalOut', subtype: 'pump', cover: 'blue', coverColor: '#20b2aa' },
  { name: 'VGC_1', type: 'digitalOut', subtype: 'valve' },
  { name: 'Done', type: 'gKonstant', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
assert.equal(store.getProp('Pump_Wort', 'cover'), 'None', 'None is the default');
assert.equal(store.getProp('Pump_Hot', 'cover'), 'Blue', 'starts from its Properties, spelled the Skynet way');
assert.equal(store.getProp('Pump_Hot', 'coverColor'), '#20b2aa');
assert.ok(attrsOf(store.get('Pump_Wort')).includes('cover') && attrsOf(store.get('Pump_Wort')).includes('coverColor'), 'autofill offers .cover and .coverColor on pumps');
assert.ok(!attrsOf(store.get('VGC_1')).includes('cover'), 'but not on valves');
assert.throws(() => store.setProp('VGC_1', 'cover', 'Red'), /only pumps/);
assert.throws(() => store.setProp('Pump_Wort', 'cover', 'Pink'), /cover is one of None, Red/);
store.setProp('Pump_Wort', 'cover', 'orange'); assert.equal(store.getProp('Pump_Wort', 'cover'), 'Orange');

const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
eng.write('dress', 'Pump_Wort.cover = "User"\nPump_Wort.coverColor = "Teal"\nDone = 1\n');
eng.start('dress');
assert.ok(await until(() => store.getProp('Done', 'value') === 1), 'the Process runs to the end');
assert.equal(store.getProp('Pump_Wort', 'cover'), 'User');
assert.equal(store.getProp('Pump_Wort', 'coverColor'), 'Teal');
eng.stopAll?.();

// every no-cover pump drawing has its seven Skynet covers (White since 2026-11-05) and the User cover, in the same box as the pump
const pumps = new URL('../media/Images/Skynet/Pumps/', import.meta.url), covers = new URL('Covers/', pumps);
const vb = f => /viewBox="([^"]+)"/.exec(fs.readFileSync(f, 'utf8'))[1];
const drawn = fs.readdirSync(pumps).filter(f => /^Pump_.+_Inlet\.svg$/.test(f));
assert.equal(drawn.length, 12);
for (const f of drawn) for (const c of PUMP_COVER_CHOICES.filter(c => c !== 'None')) {
  const cf = new URL(f.replace('.svg', `_Cover_${c}.svg`), covers);
  assert.ok(fs.existsSync(cf), `${f} has a ${c} cover`);
  assert.equal(vb(cf), vb(new URL(f, pumps)), `${f} ${c} cover lies exactly over the pump`);
}
console.log('pump cover tests passed');
process.exit(0);
