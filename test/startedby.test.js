// skn_Started_By (OakBarn Brewery, 2026-11-26, Rule 1.35): the Process that started this one, so the Water buttons need no code gGlobal.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
import { isSknGlobal } from '../public/boilpoint.js';

assert.ok(isSknGlobal('skn_Started_By'), 'a Skynet value');
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
for (const cfg of ['config/brewery.json', 'samples/configs/three-vessel-one-pump/config.json']) {
  const c = JSON.parse(fs.readFileSync(path.join(ROOT, cfg), 'utf8'));
  for (const n of ['gblV_Water_Switch_Status_Water', 'gblV_Valve_Status']) assert.ok(!c.elements.some(e => e.name === n), `${cfg}: ${n} is gone`);
  const bs = c.elements.find(e => e.name === 'gblV_Brew_Status');
  assert.ok(bs && bs.type === 'gGlobal' && bs.kind === 'value' && !bs.workspace && bs.x === undefined, `${cfg}: Brew Status is a Value gGlobal, off the Tab`);
}
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'skb-'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() {} });
fs.mkdirSync(path.join(d, 'scripts'), { recursive: true });
const out = [];
eng.on('print', p => out.push(String(p.text)));
fs.writeFileSync(path.join(d, 'scripts', 'Button_A.txt'), 'start "Shared"\n');
fs.writeFileSync(path.join(d, 'scripts', 'Shared.txt'), 'print "by [" + skn_Started_By + "]"\n');
eng.start('Button_A', 'user');
setTimeout(() => {
  eng.start('Shared', 'user');
  setTimeout(() => {
    assert.deepEqual(out, ['by [Button_A]', 'by []'], JSON.stringify(out));
    assert.ok(eng.check('skn_Started_By = "x"').errors.length, 'read only');
    console.log('skn_Started_By tests passed');
    process.exit(0);
  }, 300);
}, 300);
