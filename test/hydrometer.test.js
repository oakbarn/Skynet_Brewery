// The Hydrometer Device (OakBarn Brewery, 2026-11-09, Rule 6.25): Templates (Tilt, Tilt Pro, iSpindel, RAPT Pill ...), settings greyed out
// when the Template does not use them, a Tilt's Color or every other type's Hardware ID mandatory and never shared, Wi-Fi reports,
// SG / °Plato / °Brix, Lost signal, the Simulator, the BruControl Import, and the Process command take_reading.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';
import { Hardware } from '../lib/hardware.js';
import { portType, tiltColorOf } from '../lib/bruimport.js';
import { TYPE_CODES, RESERVED_TYPE_IDS, defaultCode, suggestName, portKeys } from '../public/naming.js';
import { itemKind, guessPartDetails, cleanPartDetails } from '../public/importer/connect.js';
import {
  HYDRO_MODELS, HYDRO_MODEL_KEYS, TILT_COLOR_NAMES, hydroGrey, hydroMissing, hydroClash, hydroConnection, sgToPlato, platoToSg, abv, readSg,
  hydroReadings, parseWifiReport, hydroFor, simReport, gravitySeries, convertGravity, decodeTilt, decodeRapt, decodeBle, hydroForBle,
} from '../public/hydrometer.js';

// the Templates
for (const k of ['tilt', 'tiltPro', 'tiltProMini', 'ispindel', 'gravitymon', 'floaty', 'brewbrainFloat', 'raptPill', 'plaato']) assert.ok(HYDRO_MODELS[k], k);
assert.equal(TILT_COLOR_NAMES.length, 8);
assert.deepEqual(TYPE_CODES.hydrometer.map(c => c[0]), ['Hydro'], 'the Device Type ID Hydro');
assert.ok(!('Hydro' in RESERVED_TYPE_IDS), 'Hydro is no longer only kept for later');
assert.equal(defaultCode({ type: 'hydrometer' }), 'Hydro');
assert.equal(suggestName({ iface: 'PI', port: '200', code: 'Hydro', label: 'Red Tilt', tab: 'FE' }), 'PI_200_Hydro_Red~Tilt_FE');
assert.deepEqual(portKeys({ type: 'hydrometer', device: 'Pi', channel: '200' }), ['Pi|200'], 'one Hydrometer per virtual port');

// greyed out where its Template does not use a setting
const tilt = { type: 'hydrometer', model: 'tilt', color: 'Red' }, isp = { type: 'hydrometer', model: 'ispindel', hwId: 'iSpindel000' };
assert.equal(hydroGrey(tilt, 'color'), ''); assert.match(hydroGrey(tilt, 'hwId'), /Color/);
assert.match(hydroGrey(isp, 'color'), /Only a Tilt/); assert.equal(hydroGrey(isp, 'hwId'), '');
assert.match(hydroGrey(tilt, 'connection'), /only one Connection/); assert.equal(hydroGrey({ model: 'raptPill' }, 'connection'), '');
assert.match(hydroGrey(isp, 'cloudKey'), /cloud/); assert.equal(hydroGrey({ model: 'raptPill', connection: 'cloud' }, 'cloudKey'), '');
assert.equal(hydroConnection({ model: 'tilt', connection: 'wifi' }), 'bluetooth', 'a Connection its Template does not have becomes its first');
// mandatory (OakBarn Brewery: "for a Tilt Color and Id are mandatory")
assert.equal(hydroMissing(tilt), ''); assert.match(hydroMissing({ model: 'tiltPro' }), /Color/);
assert.equal(hydroMissing(isp), ''); assert.match(hydroMissing({ model: 'raptPill', hwId: ' ' }), /Hardware ID/);
// never shared: a color across every Tilt kind, a Hardware ID across the rest (any capitals)
const els = [{ name: 'A', ...tilt }, { name: 'B', ...isp }];
assert.equal(hydroClash({ name: 'C', type: 'hydrometer', model: 'tiltPro', color: 'Red' }, els), 'A');
assert.equal(hydroClash({ name: 'C', type: 'hydrometer', model: 'tilt', color: 'Blue' }, els), '');
assert.equal(hydroClash({ name: 'C', type: 'hydrometer', model: 'floaty', hwId: 'ISPINDEL000' }, els), 'B');
assert.equal(hydroClash(els[0], els), '', 'itself is not a clash');

// gravity
assert.ok(Math.abs(sgToPlato(1.05) - 12.39) < 0.05, 'SG 1.050 is about 12.4 °Plato');
assert.ok(Math.abs(platoToSg(sgToPlato(1.062)) - 1.062) < 0.0005);
assert.equal(Math.round(abv(1.05, 1.01) * 100) / 100, 5.25);
assert.equal(readSg('1.048'), 1.048); assert.equal(readSg('1048'), 1.048); assert.throws(() => readSg('12'), /SG/);
assert.ok(Math.abs(convertGravity(1.05, 'SG', 'Brix') - sgToPlato(1.05)) < 1e-9);
assert.deepEqual(gravitySeries([[1, 12]], 'Plato', 'Brix'), [[1, 12]], 'Plato and Brix are the same scale');
assert.ok(Math.abs(gravitySeries([[1, 1.05]], 'SG', 'Plato')[0][1] - sgToPlato(1.05)) < 1e-9);

// a report in its own units, offsets, smoothing
assert.deepEqual(hydroReadings({ model: 'tilt' }, { sg: 1.0504, tempF: 66 }), { value: 1.05, sg: 1.0504, temperature: 66 });
assert.deepEqual(hydroReadings({ model: 'tiltPro', tempUnits: '°C', gravityOffset: -0.002 }, { sg: 1.0504, tempF: 68 }), { value: 1.0484, sg: 1.0484, temperature: 20 });
assert.equal(hydroReadings({ model: 'ispindel', gravityUnits: 'Plato', precision: 1 }, { sg: 1.05 }).value, 12.4);
assert.equal(hydroReadings({ model: 'tilt', avgWeight: 50 }, { sg: 1.04 }, { value: 1.05 }).value, 1.045, 'Smoothing weight 50 %');

// Wi-Fi: an iSpindel's JSON, a GravityMon's in °Plato
const r1 = parseWifiReport({ name: 'iSpindel000', ID: 1234567, angle: 52.1, temperature: 20, temp_units: 'C', battery: 4.05, gravity: 1.048, interval: 900, RSSI: -61 });
assert.deepEqual(r1, { name: 'iSpindel000', id: '1234567', sg: 1.048, tempF: 68, battery: 4.05, rssi: -61, angle: 52.1 });
assert.ok(Math.abs(parseWifiReport({ name: 'gm', gravity: 12, 'gravity-unit': 'P', temperature: 68, temp_units: 'F' }).sg - platoToSg(12)) < 1e-9);
assert.throws(() => parseWifiReport({ gravity: 1.05 }), /no name or ID/);
assert.equal(hydroFor([{ name: 'X', type: 'hydrometer', model: 'ispindel', hwId: '1234567' }], r1)?.name, 'X', 'found by its ID');
assert.equal(hydroFor([{ name: 'X', type: 'hydrometer', model: 'raptPill', hwId: 'iSpindel000' }], r1), undefined, 'a Bluetooth one is not a Wi-Fi report');
// the Simulator ferments from its OG down
assert.ok(Math.abs(simReport({ og: 1.06, sim: { fg: 1.012 } }, 0).sg - 1.06) < 1e-9);
assert.ok(Math.abs(simReport({ og: 1.06, sim: { fg: 1.012, hours: 10 } }, 20).sg - 1.012) < 1e-9);

// the Importer: BruControl's Hydrometer Input is a Tilt with its color
assert.equal(portType('HydrometerPort'), 'hydrometer'); assert.equal(portType('TiltPort'), 'hydrometer'); assert.equal(portType('DigitalOutPort'), 'digitalOut');
assert.equal(tiltColorOf({ children: [{ tag: 'TiltColor', text: 'Purple' }] }), 'Purple');
assert.equal(tiltColorOf({ children: [{ tag: 'Color', text: '5' }] }), 'Blue', 'a color saved as its place in the list');
assert.equal(itemKind({ type: 'hydrometer', name: 'X' }), 'hydro');
assert.deepEqual(guessPartDetails({ type: 'analogIn', label: 'Red Tilt Pro' }, 'hydro'), { hydro: 'tiltPro', color: 'Red', hwId: '' });
assert.deepEqual(cleanPartDetails('hydro', { hydro: 'ispindel', color: '', hwId: ' iSpindel001 ' }), { hydro: 'ispindel', hwId: 'iSpindel001' });
assert.ok(HYDRO_MODEL_KEYS.every(k => cleanPartDetails('hydro', { hydro: k }).hydro === k), 'the Importer lists the Panel\'s Templates');

// the Brain: readings, SG / Plato / Brix all the time, ABV, Lost signal
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'hydro'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'Sim', connection: 'simulator' }], elements: [
  { name: 'PI_200_Hydro_Red_FE', type: 'hydrometer', device: 'Sim', channel: '200', model: 'tilt', color: 'Red', og: 1.05 },
  { name: 'PI_201_Hydro_Spin_FE', type: 'hydrometer', device: 'Sim', channel: '201', model: 'ispindel', hwId: 'iSpindel000', gravityUnits: 'Plato', lostMinutes: 30 },
  { name: 'OG_Value', type: 'valueWidget', label: 'OG' },
  { name: 'Step', type: 'gGlobal', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const hw = new Hardware(store);
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'lost'), true, 'no signal until its first reading');
const t0 = Date.parse('2026-11-09T12:00:00Z');
hw.hydroReport(store.get('PI_200_Hydro_Red_FE'), { sg: 1.02, tempF: 66, rssi: -70 }, t0);
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'value'), 1.02);
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'sg'), 1.02);
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'plato'), Math.round(sgToPlato(1.02) * 100) / 100);
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'brix'), store.getProp('PI_200_Hydro_Red_FE', 'plato'));
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'abv'), 3.94, 'ABV from its OG 1.050');
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'lost'), false);
store.setProp('PI_200_Hydro_Red_FE', 'og', 1.06);
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'abv'), 5.25, 'a Process sets .og and the ABV follows');
assert.throws(() => store.setProp('PI_200_Hydro_Red_FE', 'value', 1.01), /input/, 'a Process can\'t set its reading');
hw.hydroReport(store.get('PI_201_Hydro_Spin_FE'), parseWifiReport({ name: 'iSpindel000', gravity: 1.05, temperature: 20, temp_units: 'C' }), t0);
assert.equal(store.getProp('PI_201_Hydro_Spin_FE', 'value'), 12.4, 'shown in °Plato');
assert.equal(store.getProp('PI_201_Hydro_Spin_FE', 'sg'), 1.05, 'and its SG is still there');
hw.hydroLost(t0 + 20 * 60000);
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'lost'), true, 'a Tilt: lost after 15 minutes');
assert.equal(store.getProp('PI_201_Hydro_Spin_FE', 'lost'), false, 'its own Lost signal after: 30 minutes');
hw.hydroHeardAdd({ name: 'iSpindel007', id: '42' }, 'wifi'); hw.hydroHeardAdd({ name: 'iSpindel000' }, 'wifi');
assert.deepEqual(hw.hydroHeardList().map(x => x.id), ['42', 'iSpindel007'], 'heard, not claimed yet (iSpindel000 is claimed)');

// take_reading: a Refractometer, then a Glass sample with Pause; the Process waits until it is saved
const logged = [];
const eng = new Engine(store, path.join(d, 'scripts'), { logNow(n) { logged.push(n); } });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
const ask = () => eng.valveList().find(a => a.reading);
assert.deepEqual(compile('take_reading OG_Value\n').errors, []);
assert.ok(compile('take_reading\n').errors.length, 'take_reading needs a name');
eng.write('og', 'take_reading OG_Value\nStep = 1\ntake_reading PI_200_Hydro_Red_FE\nStep = 2\n');
eng.start('og');
assert.ok(await until(() => ask()), 'the pop-up asks');
assert.equal(ask().stage, 'pick');
await new Promise(r => setTimeout(r, 150));
assert.equal(store.getProp('Step', 'value'), 0, 'the Process waits');
eng.readingAction({ name: ask().name, action: 'refract' });
assert.equal(ask().stage, 'enter'); assert.equal(ask().by, 'Refractometer');
assert.throws(() => eng.readingAction({ name: ask().name, action: 'save', sg: 'abc' }), /gravity/);
eng.readingAction({ name: ask().name, action: 'save', sg: '1.056', db: true });
assert.ok(await until(() => store.getProp('Step', 'value') === 1));
assert.equal(store.getProp('OG_Value', 'value'), 1.056); assert.deepEqual(logged, ['OG_Value'], 'Send to Database now');
assert.ok(await until(() => ask()));
eng.readingAction({ name: ask().name, action: 'glass', minutes: 10 });
assert.equal(ask().stage, 'cooling'); assert.ok(ask().until - ask().now > 9 * 60000, 'a 10 minute countdown');
eng.readingAction({ name: ask().name, action: 'pause' });
assert.ok(ask().paused - ask().now > 4.9 * 60000, 'Pause hides it for 5 minutes');
eng.readingAction({ name: ask().name, action: 'readnow' });
assert.equal(ask().stage, 'enter'); assert.equal(ask().paused, 0);
eng.readingAction({ name: ask().name, action: 'save', sg: '1.012', db: false });
assert.ok(await until(() => store.getProp('Step', 'value') === 2));
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'value'), 1.012, 'a hand reading goes into a Hydrometer too');
assert.equal(store.getProp('PI_200_Hydro_Red_FE', 'abv'), 6.3);
assert.deepEqual(logged, ['OG_Value'], 'Exit (No Database)');

// ---- Bluetooth (PR 2): the adverts a listener (ESP32_Hydrometer or the Pi's Bluetooth) sends, read by the Brain
const h4 = n => n.toString(16).padStart(4, '0');
const tiltAd = (id, major, minor) => '0215' + id + h4(major) + h4(minor) + 'c5';
assert.deepEqual(decodeTilt(tiltAd('a495bb10c5b14b44b5121370f02d74de', 68, 1050)), { kind: 'tilt', color: 'Red', pro: false, sg: 1.05, tempF: 68 });
assert.deepEqual(decodeTilt(tiltAd('a495bb60c5b14b44b5121370f02d74de', 675, 10512)), { kind: 'tilt', color: 'Blue', pro: true, sg: 1.0512, tempF: 67.5 }, 'a Tilt Pro sends ten times more');
assert.equal(decodeTilt(tiltAd('a495bb10c5b14b44b5121370f02d74de', 999, 1050)), null, '999 = starting up, not a reading');
assert.equal(decodeTilt(tiltAd('0000bb10c5b14b44b5121370f02d74de', 68, 1050)), null, 'another iBeacon is not a Tilt');
{
  const b = new DataView(new ArrayBuffer(23)); b.setUint8(0, 0x50); b.setUint8(1, 0x54); b.setUint8(2, 1);
  [0x78, 0xe3, 0x6d, 0x01, 0x02, 0x03].forEach((x, i) => b.setUint8(3 + i, x));
  b.setUint16(9, Math.round((20 + 273.15) * 128)); b.setFloat32(11, 1048.5); b.setInt16(15, 0); b.setInt16(17, 0); b.setInt16(19, 16 * 16); b.setInt16(21, 87 * 256);
  const hex = [...new Uint8Array(b.buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
  const r = decodeRapt(hex);
  assert.equal(r.id, '78:e3:6d:01:02:03', 'version 1 carries its MAC'); assert.equal(r.sg, 1.0485); assert.equal(Math.round(r.tempF * 10) / 10, 68);
  assert.equal(r.battery, 87); assert.equal(r.angle, 0, 'standing straight up');
  assert.equal(decodeRapt(hex, 'AA:BB:CC:DD:EE:FF').id, 'aa:bb:cc:dd:ee:ff', 'the Bluetooth address the listener heard comes first');
  const both = decodeBle({ address: '78:E3:6D:01:02:03', rssi: -81, mfg: { 76: tiltAd('a495bb20c5b14b44b5121370f02d74de', 64, 1012), 16722: hex } });
  assert.deepEqual(both.map(x => x.kind + (x.color ?? '') + x.rssi), ['tiltGreen-81', 'rapt-81']);
  const els = [{ type: 'hydrometer', model: 'tiltPro', color: 'Green', name: 'G' }, { type: 'hydrometer', model: 'raptPill', connection: 'bluetooth', hwId: '78E36D010203', name: 'R' },
    { type: 'hydrometer', model: 'raptPill', connection: 'cloud', hwId: 'aa:bb:cc:dd:ee:ff', name: 'Cloud' }];
  assert.equal(hydroForBle(els, both[0]).name, 'G', 'any Tilt kind, by its Color');
  assert.equal(hydroForBle(els, both[1]).name, 'R', 'a RAPT Pill by its Hardware ID, with or without the colons');
  assert.equal(hydroForBle(els, { kind: 'rapt', id: 'aa:bb:cc:dd:ee:ff' }), undefined, 'only Hydrometers whose Connection is Bluetooth');
  // the Brain: a real reading, and the Simulator stops pretending for that Hydrometer
  const red = store.get('PI_200_Hydro_Red_FE'), t1 = Date.now();
  hw.hydroReport(red, decodeTilt(tiltAd('a495bb10c5b14b44b5121370f02d74de', 65, 1031)), t1, true);
  assert.equal(store.getProp(red.name, 'sg'), 1.031); assert.equal(store.getProp(red.name, 'lost'), false);
  assert.ok(hw.hydroReal.get(red.name) === t1, 'a real reading is remembered, so the Simulator leaves it alone for 10 minutes');
}
hw.stop?.();
clearTimeout(store._persistTimer);
console.log('hydrometer tests passed');
process.exit(0);
