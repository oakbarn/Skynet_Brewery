// Quick Disconnect hoses (Fritz, 2026-11-05, Skynet Rule 5.28): the free end moves at any time, onto an IP or into a vessel top
import assert from 'node:assert/strict';
import { moveHoseEnd } from '../lib/qdhose.js';

const cfg = () => ({
  elements: [{ name: 'MB_01_Valve', workspace: 'Brew' }, { name: 'MB_02_Valve', workspace: 'Cellar' }],
  graphics: [
    { id: 'h1', kind: 'pipe', hose: true, qd: true, workspace: 'Brew', from: 'dev:Pump_1:out', to: 'c1', points: [[0, 0], [50, 50]] },
    { id: 'c1', kind: 'ip', fitting: 'coupling', workspace: 'Brew' },
    { id: 'h2', kind: 'pipe', hose: true, workspace: 'Brew', from: 'a', to: 'b', points: [[0, 0], [5, 5]] },
    { id: 'k1', kind: 'vessel', vesselType: 'vessel', workspace: 'Brew' },
    { id: 'ch', kind: 'vessel', vesselType: 'pchiller', workspace: 'Brew' },
    { id: 'q1', kind: 'ip', fitting: 'qd', qdOn: 'dev:MB_01_Valve:in', workspace: 'Brew' },
    { id: 'cap', kind: 'ip', fitting: 'cap', workspace: 'Brew' },
  ],
});
const pts = [[0, 0], [10, 20], [30, 40]];

{ const c = cfg(); const r = moveHoseEnd(c, { id: 'h1', to: 'vtop:k1', points: pts });
  assert.ok(r.ok); const h = c.graphics.find(g => g.id === 'h1');
  assert.equal(h.to, 'vtop:k1'); assert.deepEqual(h.points, pts);
  assert.ok(!c.graphics.some(g => g.id === 'c1'), 'its old loose-end coupling goes once nothing is on it'); }
{ const c = cfg(); assert.ok(moveHoseEnd(c, { id: 'h1', to: 'q1', points: pts }).ok, 'onto a Quick Disconnect'); }
{ const c = cfg(); assert.ok(moveHoseEnd(c, { id: 'h1', to: 'dev:MB_01_Valve:out', points: pts }).ok, 'onto a valve IP'); }
{ const c = cfg(); assert.ok(moveHoseEnd(c, { id: 'h1', to: null, points: pts }).ok, 'a loose end'); assert.equal(c.graphics.find(g => g.id === 'h1').to, null); }
assert.ok(moveHoseEnd(cfg(), { id: 'h2', to: null, points: pts }).error, 'a plain hose moves only in Edit layout');
assert.ok(moveHoseEnd(cfg(), { id: 'h1', to: 'vtop:ch', points: pts }).error, 'only a vessel (kettle, HLT, mash tun ...) has a top');
assert.ok(moveHoseEnd(cfg(), { id: 'h1', to: 'dev:MB_02_Valve:in', points: pts }).error, 'an IP on another Tab');
assert.ok(moveHoseEnd(cfg(), { id: 'h1', to: 'cap', points: pts }).error, 'an End Cap is no IP');
assert.ok(moveHoseEnd(cfg(), { id: 'h1', to: 'dev:Pump_1:out', points: pts }).error, 'not back onto its own fixed end');
assert.ok(moveHoseEnd(cfg(), { id: 'h1', to: null, points: [[0, 'x']] }).error, 'bad points');
{ const c = cfg(); c.graphics[0].locked = true; assert.ok(moveHoseEnd(c, { id: 'h1', to: null, points: pts }).error, 'a locked hose stays'); }

// ---- Hose_1.connect = QD_1 / = Kettle in a Process (Fritz, 2026-11-06, Rule 5.34) ----
{
  const { connectTarget, connectHose, connectChoices, findQdHose } = await import('../lib/qdhose.js');
  const c = cfg(); c.graphics.push({ id: 'q1n', kind: 'pipe', name: 'Hose_1', hose: true, qd: true, workspace: 'Brew', from: 'dev:Pump_1:out', to: null, points: [[0, 0], [9, 9]] });
  c.graphics.find(g => g.id === 'q1').name = 'QD_1';
  c.graphics.find(g => g.id === 'k1').name = 'Mash_Tun';
  c.graphics.find(g => g.id === 'ch').name = 'Chiller';
  c.graphics.push({ id: 'k2', kind: 'vessel', vesselType: 'vessel', vdevice: true, vwidget: true, name: 'HLT_Device', workspace: 'Brew' });
  c.graphics.push({ id: 'k3', kind: 'vessel', vesselType: 'vessel', name: 'BK', workspace: 'Cellar' });
  const h = findQdHose(c, 'hose_1');
  assert.equal(h?.id, 'q1n', 'found by name, any case');
  assert.deepEqual(connectTarget(c, h, 'QD_1'), { to: 'q1', where: 'on QD_1' });
  assert.equal(connectTarget(c, h, 'Mash_Tun').to, 'vtop:k1', 'a Vessel Widget: its top third, the same as a drag there');
  assert.equal(connectTarget(c, h, 'HLT_Device').to, 'vtop:k2', 'a Vessel Device too');
  assert.equal(connectTarget(c, h, 'none').to, null, 'none takes it off');
  assert.match(connectTarget(c, h, 'Chiller').error, /no top/);
  assert.match(connectTarget(c, h, 'BK').error, /Cellar Tab/);
  assert.match(connectTarget(c, h, 'Nope').error, /nothing named/);
  assert.match(connectTarget(c, h, 'Hose_1').error, /not a Quick Disconnect/);
  assert.deepEqual(connectChoices(c, h).map(x => x[0]), ['QD_1', 'Mash_Tun', 'HLT_Device', 'none']);
  assert.ok(connectHose(c, h, 'vtop:k1').ok); assert.equal(h.to, 'vtop:k1'); assert.equal(h.qdAuto, true, 'each screen hangs it with a sag');
  assert.ok(moveHoseEnd(c, { id: 'q1n', to: null, points: pts }).ok); assert.equal(h.qdAuto, undefined, 'dragged by hand: the drawn points');
}
{
  const fs = await import('node:fs'), os = await import('node:os'), path = await import('node:path');
  const { Store } = await import('../lib/store.js'), { Engine } = await import('../lib/engine.js');
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'qdconn')), file = path.join(d, 'c.json'), c = cfg();
  c.graphics.push({ id: 'q1n', kind: 'pipe', name: 'Hose_1', hose: true, qd: true, workspace: 'Brew', from: 'dev:Pump_1:out', to: null, points: [[0, 0], [9, 9]] });
  c.graphics.find(g => g.id === 'q1').name = 'QD_1'; c.graphics.find(g => g.id === 'k1').name = 'Mash_Tun';
  c.elements = [{ name: 'Done', type: 'gGlobal', kind: 'value' }];
  fs.writeFileSync(file, JSON.stringify(c));
  const store = new Store(file, path.join(d, 'data')); store.load();
  const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
  let moved = 0; eng.on('config', () => moved++);
  const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
  const ok = eng.check('Hose_1.connect = Mash_Tun\nHose_1.connect = QD_1\nHose_1.connect = none\n');
  assert.deepEqual(ok.errors, [], 'Check passes good lines');
  const bad = eng.check('Hose_1.connect = Nope\nHose_9.connect = QD_1\nHose_1.connect += QD_1\nif Hose_1.connect == QD_1\nendif\n');
  assert.deepEqual([...new Set(bad.errors.map(e => e.line))], [1, 2, 3, 4], 'Check finds a wrong place, a wrong hose, += and a read');
  eng.write('brew', 'Hose_1.connect = Mash_Tun\nDone = 1\nHose_1.connect = Mash_Tun\nDone = 2\n');
  eng.start('brew');
  assert.ok(await until(() => eng.valveList().length === 1), 'asks for the hose');
  const g = () => store.config.graphics.find(x => x.id === 'q1n');
  assert.equal(g().to, 'vtop:k1', 'drawn in the vessel top at once'); assert.equal(moved, 1);
  assert.deepEqual(eng.valveList().map(a => [a.name, a.hose, a.where, a.tab]), [['hose:Hose_1', true, 'in the top of Mash_Tun', 'Brew']]);
  await new Promise(r => setTimeout(r, 200));
  assert.equal(store.getProp('Done', 'value'), 0, 'the Process waits for Done');
  eng.confirmValve('hose:Hose_1');
  assert.ok(await until(() => store.getProp('Done', 'value') === 2), 'Done lets it go on; already there needs no second ask');
  assert.equal(moved, 1);
  clearTimeout(store._persistTimer);
}
console.log('qdhose tests passed');
process.exit(0);
