// One click turns a Pump on or off (Fritz, 2026-11-04, Rule 2.33): once per Schema, Pumps (and Pictures that follow one) stop
// asking ON / OFF first. Other Devices keep theirs, and a Pump set back to ask afterwards keeps asking.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'pumpclick'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'Pump_Wort', type: 'digitalOut', subtype: 'pump', tap: 'toggle', confirm: true },
  { name: 'Pix_Pump', type: 'picture', follow: 'Pump_Wort', confirm: true },
  { name: 'BK_Element', type: 'digitalOut', subtype: 'element', tap: 'toggle', confirm: true },
  { name: 'Pix_Element', type: 'picture', follow: 'BK_Element', confirm: true },
] }));
let store = new Store(cfg, path.join(d, 'data')); store.load();
const el = n => store.config.elements.find(e => e.name === n);
assert.ok(!el('Pump_Wort').confirm, 'the Pump no longer asks');
assert.ok(!el('Pix_Pump').confirm, 'nor a Picture that follows it');
assert.equal(el('BK_Element').confirm, true, 'a heating element still asks');
assert.equal(el('Pix_Element').confirm, true);
const saved = JSON.parse(fs.readFileSync(cfg, 'utf8'));
assert.equal(saved.pumpOneClick, true, 'done once and written to the Schema');
assert.ok(!saved.elements.find(e => e.name === 'Pump_Wort').confirm);

// set back to ask by hand: kept on the next start
saved.elements.find(e => e.name === 'Pump_Wort').confirm = true;
fs.writeFileSync(cfg, JSON.stringify(saved));
store = new Store(cfg, path.join(d, 'data')); store.load();
assert.equal(store.config.elements.find(e => e.name === 'Pump_Wort').confirm, true, 'Ask before changing set by hand stays');

// the sample Schemas' Pumps are one click already
for (const s of fs.readdirSync('samples/configs')) {
  const f = path.join('samples/configs', s, 'config.json'); if (!fs.existsSync(f)) continue;
  for (const e of JSON.parse(fs.readFileSync(f, 'utf8')).elements ?? []) if (e.type === 'digitalOut' && e.subtype === 'pump') assert.ok(!e.confirm, `${s}: ${e.name} is one click`);
}
console.log('pumpclick ok');
