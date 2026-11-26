// Process Sample 1, the Fire Hose and Manifold Supply Valve (OakBarn Brewery, 2026-11-20): node --no-warnings test/firehose.test.js
// The 3 Vessel 1 Pump sample's Water Tab: each button is a Process Widget whose Process sets the code and starts
// utility_FireHose_Manifold_Supply_Water. Runs the timed Fire Hose, Override shutting it off early, the Set Time, the Float and FireHose Off.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Store } from '../lib/store.js'; import { Engine, compile } from '../lib/engine.js'; import { Hardware } from '../lib/hardware.js';
import { loadSample } from '../lib/samples.js';
import { processPicture } from '../public/processwidget.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAMPLES = path.join(ROOT, 'samples', 'configs');
const WATER = ['FireHose_1_Minute', 'FireHose_2_Minutes', 'FireHose_20_Seconds', 'FireHose_Set_Time', 'FireHose_Float', 'FireHose_Off',
  'Manifold_1_Minute', 'Manifold_2_Minutes', 'Manifold_3_Minutes', 'Manifold_Set_Time', 'Manifold_Float', 'utility_FireHose_Manifold_Supply_Water'];

// the sample and the default Schema both have the Water Tab, the same items and the same Processes (Rule 15.3)
for (const f of [path.join(SAMPLES, 'three-vessel-one-pump', 'config.json'), path.join(ROOT, 'config', 'brewery.json')]) {
  const c = JSON.parse(fs.readFileSync(f, 'utf8'));
  const tab = c.workspaces.find(w => w.name === 'Water');
  assert.equal(tab?.id, 'WA', `${f}: the Water Tab`);
  const btns = c.elements.filter(e => e.workspace === 'Water' && e.type === 'processWidget');
  assert.equal(btns.length, 11, 'eleven buttons');
  for (const b of btns) {
    assert.equal(b.name, `wgt_PSW_${b.label.replaceAll(' ', '~')}_WA`, `${b.label}: wgt_PSW_Label_TabID (Rule 3.14)`);
    assert.ok(WATER.includes(b.process), `${b.label} shows a Water Process`);
  }
  assert.deepEqual(btns.slice(0, 5).map(b => b.label), ['FireHose 1 Minute', 'FireHose 2 Minutes', 'FireHose 20 Seconds', 'Firehose Set Time', 'Use FireHose Float'], 'his Fire Hose Labels');
  assert.deepEqual(btns.slice(6).map(b => b.label), ['Manifold 1 Minute', 'Manifold 2 Minutes', 'Manifold 3 Minutes', 'Set Time', 'Use Manifold Float'], 'his Manifold Labels');
  const BH = c.elements.filter(e => e.workspace === 'Brew House').length;
  assert.ok(BH > 10 && !c.elements.some(e => e.workspace === 'Brew House' && /_WA$/.test(e.name)), 'nothing on the Brew House carries the Water Tab ID');
  // the Water Tab is for picking only (OakBarn Brewery, 2026-11-25): the fill is watched on the Brew House, the Tab with the manifold
  for (const n of ['wgt_TXT_Water~message_BH', 'wgt_TMR_Water~timer_BH', 'wgt_TMR_Water~delay_BH', 'wgt_ALM_Fire~Hose~warning_BH', 'wgt_ALM_Manifold~warning_BH', 'BM_32_DI@Float_Force~floats_BH', 'wgt_TMR_Water~elapsed_BH'])
    assert.equal((c.elements.find(e => e.name === n) ?? c.graphics.find(g => g.name === n))?.workspace, 'Brew House', `${f}: ${n} is on the Brew House`);
  assert.equal(c.graphics.find(g => g.kind === 'override' && g.process === 'utility_FireHose_Manifold_Supply_Water')?.workspace, 'Brew House', 'the Water Override is on the Brew House');
  assert.equal(c.elements.find(e => e.name === 'BM_32_DI@Float_Force~floats_BH').visibility, 'hidden', 'the Float shows only when a Float button is used');
}
for (const dir of [path.join(ROOT, 'processes'), path.join(SAMPLES, 'three-vessel-one-pump', 'processes')])
  for (const p of WATER) {
    const src = fs.readFileSync(path.join(dir, p + '.txt'), 'utf8');
    assert.doesNotThrow(() => compile(src), `${p} compiles`);
    assert.equal(src, fs.readFileSync(path.join(ROOT, 'processes', p + '.txt'), 'utf8'), `${p}: the sample and the default are the same`);
  }

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'fhose'));
fs.mkdirSync(path.join(d, 'config')); fs.mkdirSync(path.join(d, 'scripts'));
fs.writeFileSync(path.join(d, 'config', 'brewery.json'), JSON.stringify({ title: 'x', mediaRoots: [path.join(ROOT, 'media')], chooseSample: true, elements: [] }));
const store = new Store(path.join(d, 'config', 'brewery.json'), path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { }, scriptStarted() { } });
const hw = new Hardware(store);
loadSample(SAMPLES, 'three-vessel-one-pump', { store, engine: eng, hw });
const tick = setInterval(() => store.tickTimers(0.5), 50);           // ten times as fast: a 20 second warning takes 2 seconds
const until = async (f, ms = 15000) => { for (let i = 0; i < ms / 25 && !f(); i++) await new Promise(r => setTimeout(r, 25)); return f(); };
const st = n => eng.list().find(x => x.name === n)?.state;
// the 3 Vessel sample's Suggested Names (OakBarn Brewery, 2026-11-25)
const FH = 'BM_31_DO@Valve_E_Firehose~Valve_WA', MSV = 'BM_33_DO@Valve_E_Manifold~Valve_WA', FLOAT = 'BM_32_DI@Float_Force~floats_BH', U = 'utility_FireHose_Manifold_Supply_Water';
const on = n => !!store.getProp(n, 'state');
const asked = () => eng.valveList().find(a => a.ask && a.process === U);
const shown = []; eng.on('show', t => shown.push(t));
const done = () => eng.confirmValve(asked().name);
const pops = () => eng.overrideList().filter(a => a.process === U);
const text = () => store.getProp('wgt_TXT_Water~message_BH', 'value');
const quiet = () => st(U) !== 'running';

const secs = n => String(store.getProp(n, 'value') ?? '').split(':').reduce((a, x) => a * 60 + (+x || 0), 0);
// FireHose 20 Seconds: the button sets 1003 and starts the Fire Hose Process; Manifold Set? then the 20 second warning then 20 s open
eng.start('FireHose_20_Seconds', 'user');
assert.ok(await until(() => !!asked()), 'Manifold Set? is asked');
assert.equal(asked().label, 'Manifold Set? Set the manifold, then click Done when ready.');
assert.ok(asked().free, 'ask_Tab: a bar on top, the Tab can still be run (Rule 16.5)');
assert.deepEqual(shown, ['Brew House'], 'every screen goes to the Brew House, the Tab with the manifold');
assert.equal(store.getProp(FLOAT, 'visibility'), 'hidden', 'no Float for a timed fill');
assert.equal(store.getProp('gblV_Valve_Status', 'value'), -1);
done();
assert.ok(await until(() => store.getProp('wgt_ALM_Fire~Hose~warning_BH', 'active')), 'the warning sound');
assert.match(text(), /FireHose ON in 20 Seconds! Fire Hose ON for  Twenty Seconds/);
assert.ok(!on(FH), 'not open during the warning');
assert.ok(await until(() => on(FH)), 'the Fire Hose opens');
assert.ok(!store.getProp('wgt_ALM_Fire~Hose~warning_BH', 'active'), 'the warning sound stops');
assert.ok(await until(() => !on(FH) && quiet()), 'it closes when the timer reaches 00:00:00');
assert.equal(store.getProp('gblV_Water_Switch_Status_Water', 'value'), -9999);
// the hidden count-up timer kept the true run time (about 20 s) in its stopped timer (newSec turns it into seconds, Rule 1.34)
assert.equal(store.getProp('wgt_TMR_Water~elapsed_BH', 'visibility'), 'hidden');
assert.ok(secs('wgt_TMR_Water~elapsed_BH') >= 19 && secs('wgt_TMR_Water~elapsed_BH') <= 22, 'true run time ' + store.getProp('wgt_TMR_Water~elapsed_BH', 'value'));

// Manifold 3 Minutes: the Water Override button on the Brew House (Rule 16.11: every Tap Water Fill gets one) shuts the valve off early;
// with a button set to it, no Override pop-up comes by itself (Rule 2.26)
const ovrBtn = store.config.graphics.find(g => g.kind === 'override' && g.workspace === 'Brew House');
assert.equal(ovrBtn?.process, U, 'the Water Override button is set to the Fire Hose and Manifold Process');
assert.equal(ovrBtn.label, 'Water Override');
assert.equal(ovrBtn.showWhen, 'water', 'it shows only once the water flows: no Override during the 20 second warning (Rule 16.11)');
eng.start('Manifold_3_Minutes', 'user');
assert.ok(await until(() => !!asked())); done();
assert.ok(await until(() => on(MSV)), 'the Manifold Supply Valve opens');
// the Brain lists the valves a Process opened: the Water Override (Only while tap water flows) comes up once one is open (Rule 16.11)
assert.ok(eng.list().find(x => x.name === U).opened?.includes(MSV), 'the Process lists the valve it opened');
await new Promise(r => setTimeout(r, 4000));
assert.ok(!pops().some(p => p.how === 'auto'), 'no pop-up by itself: the button is there');
eng.override('Fritz', ovrBtn.process);
assert.ok(await until(() => !on(MSV) && quiet()), 'Override shuts it off');
assert.ok(secs('wgt_TMR_Water~elapsed_BH') > 0 && secs('wgt_TMR_Water~elapsed_BH') < 180, 'true run time to the Override ' + store.getProp('wgt_TMR_Water~elapsed_BH', 'value'));
assert.ok(!store.getProp('wgt_TMR_Water~elapsed_BH', 'running'));

// Firehose Set Time: waits for a time in Set Timer
eng.start('FireHose_Set_Time', 'user');
assert.ok(await until(() => !!asked())); done();
// a pop-up asks for the time into the Time Widget wgt_TM_Set~Timer_BH (ask "text" Name, Rule 16.5); no box on the Tab
assert.ok(await until(() => asked()?.input), 'the pop-up asks for the time');
assert.deepEqual([asked().input.name, asked().input.kind, asked().input.label], ['wgt_TM_Set~Timer_BH', 'time', 'Set Timer']);
assert.equal(store.getProp('wgt_TM_Set~Timer_BH', 'visibility'), 'hidden', 'no Set Timer box on the Tab');
assert.throws(() => eng.confirmValve(asked().name, ''), /Type the answer/);
assert.throws(() => eng.confirmValve(asked().name, '10 seconds'), /hh:mm:ss/);
eng.confirmValve(asked().name, '00:00:00');                                  // no time: asked again
assert.ok(await until(() => asked()?.input), 'asked again for 00:00:00');
eng.confirmValve(asked().name, '00:00:10');
assert.equal(String(store.getProp('wgt_TM_Set~Timer_BH', 'value')), '00:00:10', 'the answer is in the Time Widget');
assert.ok(await until(() => on(FH)), 'opens after the warning');
assert.ok(await until(() => !on(FH) && quiet()), 'closes after the time set');

// Use Manifold Float: open until the float is made
eng.start('Manifold_Float', 'user');
assert.ok(await until(() => !!asked()));
assert.equal(store.getProp(FLOAT, 'visibility'), 'visible', 'a Float button: the Float shows on the Brew House');
done();
assert.ok(await until(() => on(MSV)));
assert.equal(store.getProp('wgt_TMR_Water~timer_BH', 'type'), 'countup');
store.setProp(FLOAT, 'value', true, 'hw');
assert.ok(await until(() => !on(MSV) && quiet()), 'the float shuts it off');
assert.equal(store.getProp(FLOAT, 'visibility'), 'hidden', 'the Float hides again');
store.setProp(FLOAT, 'value', false, 'hw');

// FireHose Off: stops the Process at any point and closes both valves
eng.start('FireHose_1_Minute', 'user');
assert.ok(await until(() => !!asked())); done();
assert.ok(await until(() => on(FH)));
eng.start('FireHose_Off', 'user');
assert.ok(await until(() => !on(FH) && !on(MSV) && quiet()), 'FireHose Off');
assert.ok(!store.getProp('wgt_TMR_Water~timer_BH', 'running'));

// The Float buttons and the Water float show OakBarn Brewery's float switch pictures (Rule 1.31 Picture, 2026-11-20)
{
  const F = 'Images/Skynet/Other_Equipment/';
  for (const [f, FL] of [['config/brewery.json', FLOAT], ['samples/configs/three-vessel-one-pump/config.json', FLOAT]]) {
    const c = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
    for (const n of ['wgt_PSW_Use~FireHose~Float_WA', 'wgt_PSW_Use~Manifold~Float_WA', FL]) {
      const e = c.elements.find(x => x.name === n);
      assert.equal(e.imageOff, F + 'Skynet_Float_NO_Open.svg', `${f} ${n}`); assert.equal(e.imageOn, F + 'Skynet_Float_NO_Closed.svg', `${f} ${n}`);
      if (n !== FL) {
        assert.equal(e.follow, FL);
        assert.equal(processPicture(e, () => false), e.imageOff, 'dry: the float hangs');
        assert.equal(processPicture(e, x => x === FL), e.imageOn, 'made: the float is lifted');
      }
    }
  }
  for (const s of ['NO_Open', 'NO_Closed', 'NC_Closed', 'NC_Open']) assert.match(fs.readFileSync(path.join(ROOT, 'media', F, `Skynet_Float_${s}.svg`), 'utf8'), /^<svg [^>]*viewBox="0 0 640 500"/);
  assert.equal(processPicture({}, () => true), '', 'no Picture: none, as before');
  assert.equal(processPicture({ imageOff: 'a.svg', imageOn: 'b.svg' }, () => true), 'a.svg', 'no Turns on with: the Picture when off');
}
clearInterval(tick); eng.stopAll(); hw.stop(); clearTimeout(store._persistTimer);
fs.rmSync(d, { recursive: true, force: true });
console.log('firehose tests passed');
process.exit(0);
