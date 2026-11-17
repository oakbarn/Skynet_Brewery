// A Chiller Bundle Equipment Template (OakBarn Brewery, 2026-11-17, a Rule 4.1 exception): kept clean, and put on a Tab with its refs followed
import assert from 'node:assert/strict';
import { cleanVessel, cleanBundle } from '../public/templates.js';
import { unbundle, isImmersion } from '../public/chillmove.js';

// what the Build Tab gave: a chiller (old id c1) with its In and Out IPs, an Ice Water Can with an IP, a manual Sump Pump, a pump
// Device on a wall outlet, a supply hose from the can's IP to the chiller's In and a waste hose from Out back into the can's top
const bundle = {
  chiller: 'c1',
  graphics: [
    { id: 'ipIn', kind: 'ip', attachTo: 'c1', port: 'in', x: -15, y: 10 },
    { id: 'ipOut', kind: 'ip', attachTo: 'c1', port: 'out', x: 95, y: 10 },
    { id: 'can', kind: 'vessel', vesselType: 'iceCan', x: 200, y: 0, w: 160, h: 200 },
    { id: 'canIp', kind: 'ip', attachTo: 'can', x: 210, y: 150 },
    { id: 'h1', kind: 'pipe', hose: true, from: 'dev:Sump_1:out', to: 'ipIn', points: [[0, 0], [10, 10]], name: 'Hose_1' },
    { id: 'h2', kind: 'pipe', hose: true, from: 'ipOut', to: 'vtop:can', points: [[100, 20], [260, 0]], name: 'Hose_2' },
    { id: 'qd', kind: 'ip', fitting: 'qd', qdOn: 'canIp', x: 205, y: 145, _key: 'secret' },
  ],
  elements: [
    { name: 'wgt_MP_Sump~1', type: 'manualPump', x: 220, y: 120 },
    { name: 'Sump_1', type: 'digitalOut', subtype: 'pump', device: 'Mega', channel: '22', x: 240, y: 130 },
  ],
};
// the Template keeps no Port or hidden key (Rule 6.1)
const t = cleanVessel({ vesselType: 'ccoil', liquidPorts: 2, bundle });
assert.ok(t.bundle, 'an immersion chiller Template keeps its bundle');
const sump = t.bundle.elements.find(e => e.name === 'Sump_1');
assert.equal(sump.device, undefined); assert.equal(sump.channel, undefined);
assert.equal(t.bundle.graphics.find(g => g.id === 'qd')._key, undefined);
assert.equal(cleanVessel({ vesselType: 'ccoil', liquidPorts: 4, bundle }).bundle, undefined, 'never on a 4 IP coil (a Chillzilla)');
assert.equal(cleanVessel({ vesselType: 'pchiller', bundle }).bundle, undefined, 'never on a plate chiller');
assert.equal(cleanBundle({ chiller: 'c1', graphics: [bundle.graphics[0]], elements: [] }), null, 'only its own IPs: a plain Template');

// put on a Tab: the chiller is new (id N) at 500, 300, its own IPs are there already
let n = 0;
const ownIps = [{ id: 'newIn', port: 'in' }, { id: 'newOut', port: 'out' }];
const pc = unbundle(t.bundle, { chillerId: 'N', ownIps, taken: ['Sump_1', 'Hose_1', 'hose_2'], newId: () => 'n' + ++n, dx: 500, dy: 300 });
const by = id => pc.graphics.find(g => g.id === id);
assert.equal(pc.graphics.length, 5, 'the chiller\'s own IPs are not added again');
assert.ok(!pc.graphics.some(g => ['ipIn', 'ipOut', 'can', 'canIp', 'h1', 'h2', 'qd'].includes(g.id)), 'every piece has a new id');
const can = pc.graphics.find(g => g.vesselType === 'iceCan'), canIp = pc.graphics.find(g => g.kind === 'ip' && !g.fitting), qd = pc.graphics.find(g => g.fitting === 'qd');
assert.deepEqual([can.x, can.y], [700, 300], 'moved next to the chiller');
assert.equal(canIp.attachTo, can.id, 'the can\'s IP stays on the can');
assert.equal(qd.qdOn, canIp.id, 'the Quick Disconnect stays on its IP');
const [h1, h2] = pc.graphics.filter(g => g.kind === 'pipe');
assert.equal(h1.to, 'newIn', 'the supply hose goes to the new chiller\'s In');
assert.equal(h1.from, 'dev:Sump_1_2:out', 'from the renamed pump');
assert.equal(h2.from, 'newOut'); assert.equal(h2.to, `vtop:${can.id}`, 'the waste hose goes back into the can');
assert.deepEqual(h2.points[0], [600, 320]);
assert.deepEqual([h1.name, h2.name], ['Hose_3', 'Hose_4'], 'hoses get the next free Hose names');
assert.deepEqual(pc.elements.map(e => e.name), ['wgt_MP_Sump~1', 'Sump_1_2'], 'names already taken get a number');
assert.equal(by(can.id), can);

// which chillers are immersion chillers
assert.ok(isImmersion({ kind: 'vessel', vesselType: 'ccoil' }));
assert.ok(!isImmersion({ kind: 'vessel', vesselType: 'ccoil', ports: { in2: { installed: true } } }), 'a coil with 4 IPs is not');
console.log('chillerbundle ok');
