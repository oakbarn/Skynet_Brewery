// 1-Wire circuits and the 1-Wire Index (OakBarn Brewery, 2026-11-19, Rule 6.37): BM1w1_2 = Interface BM, circuit 1, probe 2
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store, cleanProbes } from '../lib/store.js';
import { Hardware } from '../lib/hardware.js';
import { oneWirePort, isOneWirePort, owCircuitOf, nextOneWireCircuit, oneWireCircuits, OW_LIMIT, suggestName } from '../public/naming.js';

assert.equal(oneWirePort(2, 1), '1w1_2');
assert.ok(isOneWirePort('1w2_5') && !isOneWirePort('700'));
assert.equal(owCircuitOf({}), 1, 'no circuit = circuit 1');
assert.deepEqual(OW_LIMIT, { board: 6, ext: 12 }, 'soft limits: 6 on Board 5V, 12 on an External supply');
assert.equal(suggestName({ iface: 'BM', port: '1w2_1', type: 'temperature', code: '1W', label: 'MLT', tab: 'BH' }), 'BM1w2_1_MLT_BH');
// a deleted circuit's number is never used again
assert.equal(nextOneWireCircuit({ oneWire: [{ n: 1 }], oneWireLast: 3 }), 4);
assert.equal(nextOneWireCircuit({}), 1);
assert.deepEqual(oneWireCircuits({ oneWire: [{ n: 1, pin: '40' }, { n: 2, pin: '41', gone: true }] }).map(c => c.n), [1]);

// the Index list: the same number on two circuits is two Indexes; one ROM id on two Indexes is refused
assert.equal(cleanProbes([{ device: 'BM', circuit: 1, index: 1, rom: '28AA000000000001' }, { device: 'BM', circuit: 2, index: 1 }]).length, 2);
assert.throws(() => cleanProbes([{ device: 'BM', circuit: 1, index: 1 }, { device: 'BM', circuit: 1, index: 1 }]), /BM|1w1_1/);
assert.throws(() => cleanProbes([{ device: 'BM', circuit: 1, index: 1, rom: '28AA000000000001' }, { device: 'BM', circuit: 2, index: 1, rom: '28AA000000000001' }]), /two 1-Wire Indexes/);

// an older Schema (old Probe #, names BM_700_TEMP@1W_HLT_BH): once, on load, circuit 1 and the new names; what uses them follows
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ow'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'Brewery Mega', connection: 'simulator' }], workspaces: [{ name: 'Brew House', id: 'BH' }],
  probes: [{ index: 1, name: 'HLT', rom: '28AA000000000001' }, { index: 2, name: 'MLT', rom: '28AA000000000002' }],
  elements: [
    { name: 'BM_700_TEMP@1W_HLT_BH', type: 'temperature', sensor: 'ds18b20', device: 'Brewery Mega', probeIndex: 1, label: 'HLT', workspace: 'Brew House' },
    { name: 'BM_701_TEMP@1W_Mash_BH', type: 'temperature', sensor: 'ds18b20', device: 'Brewery Mega', probeIndex: 2, label: 'Mash', workspace: 'Brew House' },
    { name: 'BM_8_DO@H_Element_HLT~element_BH', type: 'digitalOut', subtype: 'element', device: 'Brewery Mega', channel: 8, input: 'BM_700_TEMP@1W_HLT_BH', workspace: 'Brew House' },
  ] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const c = store.config, mega = c.devices[0];
assert.ok(c.oneWireCircuits, 'done once per Schema');
assert.deepEqual(mega.oneWire, [{ n: 1, pin: '40', power: 'board', bits: 12 }], 'the Interface gets circuit 1 on its usual pin');
assert.ok(store.get('BM1w1_1_HLT_BH') && store.get('BM1w1_2_Mash_BH'), 'BM_700_TEMP@1W_HLT_BH -> BM1w1_1_HLT_BH');
assert.equal(store.get('BM1w1_1_HLT_BH').owCircuit, 1);
assert.equal(store.get('BM_8_DO@H_Element_HLT~element_BH').input, 'BM1w1_1_HLT_BH', 'what reads the probe follows its new name');
assert.deepEqual(c.probes.map(p => [p.device, p.circuit, p.index]), [['Brewery Mega', 1, 1], ['Brewery Mega', 1, 2]]);

// the board: CFG OW <pin> <bits> for each circuit, and a probe is read by its ROM id on its Index
mega.oneWire.push({ n: 2, pin: '41', power: 'ext', bits: 10 });
const hw = new Hardware(store, { off: true }), sent = [];
const dev = { name: 'Brewery Mega', cfg: mega, send: l => sent.push(l) };
hw._resendOutputs(dev);
assert.ok(sent.includes('CFG OW 40 12') && sent.includes('CFG OW 41 10'), `CFG OW for every circuit (${sent.filter(l => l.startsWith('CFG OW')).join(', ')})`);
hw.probesSeen.set('Brewery Mega', {});
hw._onLine(dev, 'T 28AA000000000002 150.25 40');
assert.equal(hw.probePins.get('Brewery Mega')['28AA000000000002'], '40', 'the board says which circuit (pin) a probe is on');
assert.ok(Math.abs(store.getProp('BM1w1_2_Mash_BH', 'value') - 150.25) < 0.1 || Math.abs(store.getProp('BM1w1_2_Mash_BH', 'value') - 65.69) < 0.1, `read by its ROM id on Index BM1w1_2 (${store.getProp('BM1w1_2_Mash_BH', 'value')})`);
clearTimeout(store._persistTimer);

// the Mega sketch reads every circuit and takes CFG OW
const ino = fs.readFileSync('firmware/Mega_BrewPanel/Mega_BrewPanel.ino', 'utf8');
assert.match(ino, /const uint8_t ONEWIRE_PINS\[\] = \{40\};/);
assert.match(ino, /kind == "OW"/);
assert.doesNotMatch(ino, /ONEWIRE_PIN\b/, 'no single bus left');
console.log('1-Wire circuit tests passed');
