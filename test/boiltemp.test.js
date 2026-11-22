// Boil temperature from the airport's air pressure (Panel Updates entry 16, Rules 1.18 and 2.27): the sums, the airport
// report with a pretend internet, the fallbacks and their plain messages, and skn_Boil_Temp in a Process.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { boilC, stationPressure, stdPressure, toHpa, pressureHpa, sknValue, isIcao, MSG, STD_HPA } from '../public/boilpoint.js';
import { BoilTemp, cleanSettings } from '../lib/boiltemp.js';
import { Store } from '../lib/store.js'; import { Engine } from '../lib/engine.js';
import { suggest } from '../public/autofill.js';
import { CLASSES, classify } from '../public/colorize.js';

const near = (a, b, d, msg) => assert.ok(Math.abs(a - b) <= d, `${msg}: ${a} vs ${b}`);

// ---- the sums
near(boilC(STD_HPA), 100, 0.05, 'sea level: 100 °C');
near(boilC(834), 94.8, 0.3, 'Denver: about 94.8 °C (202.6 °F)');
near(stdPressure(1609), 834, 2, 'standard air a mile up');
near(stationPressure(1013.25, 0), 1013.25, 0.01, 'at sea level the altimeter setting is the pressure');
near(toHpa(29.92), 1013.2, 0.1, 'inHg to hPa'); assert.equal(toHpa(1013), 1013);
// real air pressures only (OakBarn Brewery, 2026-11-19: "10.13 would never be a pressue")
assert.equal(toHpa(10.13), null, 'no airport ever reported 10.13'); assert.equal(toHpa(1200), null); assert.equal(toHpa(700), null, 'below the sea level record');
near(toHpa(25.7), 870.3, 0.1, 'Typhoon Tip'); near(toHpa(1083.8), 1083.8, 0.01, 'the highest record');
near(pressureHpa(17.7), 599.4, 0.1, 'a brewery at 4,000 m, typed in inHg'); assert.equal(pressureHpa(600), 600, 'or in hPa');
for (const bad of [10.13, 0, -5, 15, 33, 100, 539, 1086, 'abc']) assert.equal(pressureHpa(bad), null, `${bad} is not an air pressure`);
assert.throws(() => cleanSettings({ pressure: 10.13 }), e => e.message === MSG.badPressure, 'one plain message, not used');
near(cleanSettings({ pressure: 29.92 }).pressureHpa, 1013.2, 0.05, 'typed in inHg, kept in hPa');
assert.equal(sknValue('skn_Boil_Temp', { boilC: 100 }, 'US'), 212);
assert.equal(sknValue('SKN_BOIL_TEMP', { boilC: 100 }, 'Metric'), 100, 'any case; Metric shows °C');
assert.equal(sknValue('skn_Boil_Temp_F', { boilC: 95 }, 'Metric'), 203);
assert.equal(sknValue('skn_Air_Pressure', { hpa: 1001.26 }), 1001.3);
assert.ok(isIcao('kord') && isIcao('CYYZ') && !isIcao('ORD') && !isIcao('60601'));
assert.throws(() => cleanSettings({ elevationM: 10000 }), /Elevation/);
assert.throws(() => cleanSettings({ pressureHpa: 50 }), /not an air pressure/);

// ---- the airport report, with a pretend internet: only the airport code goes out
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'boil'));
let asked = [], answer;
const fetch = async url => { asked.push(url); return answer(url); };
const json = (body, status = 200) => ({ ok: status < 300, status, json: async () => body });
const nowS = Math.floor(Date.now() / 1000);
const bt = new BoilTemp(path.join(d, 'data'), { fetch });
assert.equal(bt.status().source, 'standard'); assert.equal(bt.status().note, MSG.noCode, 'no code yet: standard air, says so');

answer = () => json([{ icaoId: 'KDEN', name: 'Denver Intl', altim: 1020.3, elev: 1656, obsTime: nowS - 600 }]);
let st = await bt.save({ airport: 'kden', elevationM: null, pressureHpa: null });
assert.deepEqual(asked, ['https://aviationweather.gov/api/data/metar?ids=KDEN&format=json'], 'only the ICAO code is sent');
assert.equal(st.source, 'airport'); assert.equal(st.note, '');
assert.equal(st.settings.elevationM, 1656, 'the Elevation starts as the airport\'s own');
near(st.hpa, stationPressure(1020.3, 1656), 0.1, 'the report taken up to the Elevation');
near(st.boilC, 94.9, 0.5, 'Denver boils near 95 °C');

// a hand-typed Elevation is kept, and used
st = await bt.save({ airport: 'KDEN', elevationM: 1700 });
assert.equal(st.settings.elevationM, 1700); near(st.hpa, stationPressure(1020.3, 1700), 0.1, 'the brewery higher than the airport');
st = await bt.save({ airport: 'KDEN', elevationM: 1700 });
assert.equal(st.settings.elevationAuto, false, 'typed by hand: kept');

// the three plain messages, and the boil temperature is still there (standard air at the Elevation)
answer = () => json([]);
st = await bt.save({ airport: 'KXYZ', elevationM: 1700 });
assert.equal(st.note, MSG.badCode); assert.equal(st.source, 'standard'); assert.equal(st.settings.airport, 'KXYZ', 'saved anyway (never stop a user)');
near(st.hpa, stdPressure(1700), 0.1, 'standard air at the Elevation');
answer = () => { throw new Error('offline'); };
st = await bt.refresh(); assert.equal(st.note, MSG.noReport, 'no internet');
answer = () => json([{ icaoId: 'KXYZ', altim: 1010, obsTime: nowS - 5 * 3600 }]);
st = await bt.refresh(); assert.equal(st.note, MSG.noReport, 'a report older than 3 hours is not used');
answer = () => json([{ icaoId: 'KXYZ', altim: 10.13, obsTime: nowS }]);
st = await bt.refresh(); assert.equal(st.note, MSG.noReport, 'a report with a pressure no airport ever had is not used');
st = await bt.save({ airport: '12', elevationM: 1700 }); assert.equal(st.note, MSG.badCode, 'not an ICAO code');
// a typed pressure needs no internet
asked = [];
st = await bt.save({ airport: 'KDEN', elevationM: 1700, pressureHpa: 900 });
assert.equal(st.source, 'typed'); assert.equal(st.hpa, 900); assert.deepEqual(asked, []);
// kept on the Brain for the next start
const again = new BoilTemp(path.join(d, 'data'), { fetch });
assert.equal(again.status().settings.airport, 'KDEN'); assert.equal(again.status().hpa, 900);

// ---- skn_Boil_Temp in a Process: read only, the panel's Units, the check knows it
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [{ name: 'gGV_N', type: 'gGlobal', kind: 'value' }] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data2')); store.load();
const b2 = new BoilTemp(path.join(d, 'data2'), { fetch, store });
answer = () => json([{ icaoId: 'KDEN', altim: 1013.25, elev: 0, obsTime: nowS }]);
await b2.save({ airport: 'KDEN', elevationM: 0 });
assert.equal(store.sknValue('skn_Boil_Temp'), 212, 'US Units: °F');
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() {} });
assert.deepEqual(eng.check('gGV_N = skn_Boil_Temp - 1\nif skn_Boil_Temp_C > 90\nendif\nprint skn_Air_Pressure').errors, []);
const errs = eng.check('skn_Boil_Temp = 5\nprint skn_Boil_Temp.state').errors;
assert.deepEqual(errs.map(e => e.line), [1, 2]);
assert.match(errs[0].msg, /read only/); assert.match(errs[1].msg, /only its value/);
fs.writeFileSync(path.join(d, 'scripts', 'T.txt'), 'gGV_N = skn_Boil_Temp_C - 1');
eng.start('T');
await new Promise(r => setTimeout(r, 300));
assert.equal(store.getProp('gGV_N', 'value'), 99);
// editor colors and predictive text know them
assert.equal(CLASSES[classify('a = skn_Boil_Temp', {})[4]], 'cmd');
assert.ok(suggest('gGV_N = skn_B', { elements: [] }).list.some(p => p.text === 'skn_Boil_Temp'));

// ---- the Help page names skn_Boil_Temp, in English and French. The _C, _F and air pressure lines came out of its table
// (Panel Update 9, item 10c): they still work, the Help just does not list them
for (const f of ['../help/238-boil-temperature.md', '../help/fr/238-boil-temperature.md']) {
  const t = fs.readFileSync(new URL(f, import.meta.url), 'utf8');
  assert.ok(t.includes('`skn_Boil_Temp`'), `${f} names skn_Boil_Temp`);
}
fs.rmSync(d, { recursive: true, force: true });
console.log('boiltemp tests passed');
process.exit(0);
