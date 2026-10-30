// The boil temperature from the local air pressure, skn_ Globals, sk_ probe roles and wait_boil (Fritz, 2026-10-30)
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';
import { BoilTemp, cleanProfile } from '../lib/boiltemp.js';
import { boilC, stationPressure, stdPressure, toHpa, ROLE_NAMES, isRoleName, isSkn } from '../public/skynetnames.js';
import { suggest } from '../public/autofill.js';

// ---- the sums
assert.ok(Math.abs(boilC(1013.25) - 100) < 0.05, 'sea level: 100 °C');
assert.ok(Math.abs(boilC(stdPressure(1609)) - 94.9) < 0.3, 'Denver (1609 m): about 95 °C');
assert.ok(boilC(990) < boilC(1030), 'a storm (low pressure) boils cooler');
assert.ok(Math.abs(stationPressure(1013.25, 0) - 1013.25) < 1e-9);
assert.ok(Math.abs(stationPressure(1013.25, 1609) - stdPressure(1609)) < 2, 'the airport sum and the standard air agree');
assert.ok(Math.abs(toHpa(29.92) - 1013.2) < 0.1, 'inches of mercury');
assert.equal(toHpa(1013), 1013);
assert.equal(ROLE_NAMES.length, 3 + 3 + 3 + 10);
assert.ok(isRoleName('sk_Boil_Probe_3') && isRoleName('sk_Ferment_Probe_10') && !isRoleName('sk_Boil_Probe_4') && !isRoleName('sk_Ferment_Probe_11'));
assert.ok(isSkn('skn_Boil_Temp') && !isSkn('skn_Nope'));
assert.throws(() => cleanProfile({ airport: 'K!' }), /ICAO/);
assert.throws(() => cleanProfile({ pressureHpa: 50 }), /300 to 1100/);
assert.equal(cleanProfile({ airport: 'kmke', refreshMin: '' }).airport, 'KMKE');

// ---- the Brain's lookups, with a pretend internet
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'boil'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ brewDefaults: { units: 'US' }, elements: [
  { name: 'MB_700_DS18B20_Kettle__HS', type: 'temperature', units: '°F', probeRole: 'sk_Boil_Probe_1' },
  { name: 'MB_701_DS18B20_Mash__HS', type: 'temperature', units: '°C' },
  { name: 'Done', type: 'gKonstant', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const asked = [];
const reply = j => ({ ok: true, status: 200, json: async () => j });
let airportUp = true;
const fakeFetch = async url => {
  asked.push(url); const u = new URL(url);
  if (u.host === 'nominatim.openstreetmap.org') return reply(u.searchParams.get('postalcode') === '80202' ? [{ lat: '39.75', lon: '-104.99', display_name: 'Denver, Colorado, USA' }] : []);
  if (u.pathname === '/v1/elevation') return reply({ elevation: [1609] });
  if (u.host === 'aviationweather.gov') {
    if (!airportUp) return { ok: false, status: 503, json: async () => ({}) };
    return reply([{ icaoId: 'KBKF', name: 'Buckley', lat: 39.7, lon: -104.75, altim: 1020.0, obsTime: Date.now() / 1000 - 600 },
      { icaoId: 'KDEN', name: 'Denver Intl', lat: 39.85, lon: -104.66, altim: 1013.25, obsTime: Date.now() / 1000 - 600 },
      { icaoId: 'KOLD', name: 'Stale', lat: 39.75, lon: -104.99, altim: 900, obsTime: Date.now() / 1000 - 5 * 3600 }]);
  }
  if (u.pathname === '/v1/forecast') return reply({ current: { pressure_msl: 1013.25, surface_pressure: 835 } });
  throw new Error('not online');
};
const bt = new BoilTemp(path.join(d, 'data'), { fetch: fakeFetch, store });
let st = await bt.refresh();
assert.equal(st.source, 'standard', 'no place yet: sea level');
assert.equal(st.boilC, 100);
assert.equal(store.getProp('skn_Boil_Temp', 'value'), 212);

st = await bt.setProfile({ country: 'USA', postal: '80202' });
assert.equal(st.source, 'airport');
assert.equal(st.station.id, 'KBKF', 'the nearest airport with a fresh report (the stale one is skipped)');
assert.equal(st.elevM, 1609);
assert.ok(st.boilC > 94.5 && st.boilC < 95.5, `Denver boils near 95 °C (${st.boilC})`);
assert.equal(store.getProp('skn_Boil_Temp_C', 'value'), Math.round(st.boilC * 10) / 10);
assert.equal(store.getProp('skn_Boil_Temp', 'value'), store.getProp('skn_Boil_Temp_F', 'value'), 'US units: °F');
assert.ok(store.getProp('skn_Air_Pressure', 'value') < 900);
const n = asked.length; await bt.refresh();
assert.ok(!asked.slice(n).some(u => u.includes('nominatim')), 'the place is found on the map once');

airportUp = false;
st = await bt.refresh();
assert.equal(st.source, 'weather', 'no airport: the weather service');
assert.match(st.note, /Airport/);
st = await bt.setProfile({ country: 'USA', postal: '80202', pressureHpa: 1013.25 });
assert.equal(st.source, 'manual'); assert.equal(st.boilC, 100);
st = await bt.setProfile({ country: 'USA', postal: '99999' });
assert.equal(st.source, 'standard'); assert.match(st.note, /could not find/);
assert.equal(JSON.parse(fs.readFileSync(path.join(d, 'data', 'user_profile.json'), 'utf8')).profile.postal, '99999', 'kept on the Brain');
const again = new BoilTemp(path.join(d, 'data'), { fetch: fakeFetch });
assert.equal(again.profile.postal, '99999', 'read back after a restart');

// ---- skn_ is read only; a role stands for its probe
assert.throws(() => store.setProp('skn_Boil_Temp', 'value', 1), /read only/);
assert.throws(() => store.getProp('skn_Boil_Temp', 'label'), /only its value/);
assert.equal(store.get('sk_Boil_Probe_1').name, 'MB_700_DS18B20_Kettle__HS');
assert.equal(store.has('sk_Mash_Probe_1'), false, 'no probe has that role');
assert.throws(() => store.getProp('sk_Mash_Probe_1', 'value'), /No temperature probe has the role sk_Mash_Probe_1/);

// ---- wait_boil
for (const t of ['wait_boil', 'wait_boil = 99.8', 'wait_boil 211', 'wait_boil = skn_Boil_Temp - 1']) assert.deepEqual(compile(t).errors, [], t);
assert.equal(compile('wait_boil').stmts[0].op, 'wait');
assert.match(compile('wait_boil =').errors[0].msg, /needs a temperature/);
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
assert.deepEqual(eng.check('wait_boil\nDone = 1').errors, []);
assert.deepEqual(eng.check('if sk_Boil_Probe_1 > skn_Boil_Temp - 2\nendif').errors, []);
assert.match(eng.check('if sk_HLT_Probe_2 > 150\nendif').errors[0].msg, /role sk_HLT_Probe_2 yet/);
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
await bt.setProfile({ pressureHpa: 1013.25 });             // boils at 212 °F
eng.write('Boil_Wait', 'wait_boil\nDone = 1\n');
store.setProp('MB_700_DS18B20_Kettle__HS', 'value', 200, 'hw');
eng.start('Boil_Wait');
await new Promise(r => setTimeout(r, 300));
assert.equal(store.getProp('Done', 'value'), 0, 'still heating');
store.setProp('MB_700_DS18B20_Kettle__HS', 'value', 212, 'hw');
assert.ok(await until(() => store.getProp('Done', 'value') === 1), 'reached the boil');
// the number after = is in the probe's own units; the probe can be renamed and keep its role
store.els.get('MB_701_DS18B20_Mash__HS').probeRole = 'sk_Boil_Probe_2';
eng.write('Given', 'wait_boil = 99.8\nDone = 2\n');
store.setProp('MB_700_DS18B20_Kettle__HS', 'value', 99.9, 'hw');
eng.start('Given');
assert.ok(await until(() => store.getProp('Done', 'value') === 2));
assert.equal(store.get('sk_Boil_Probe_2').name, 'MB_701_DS18B20_Mash__HS');

// ---- predictive text offers them
const words = { elements: [], skynet: [{ name: 'skn_Boil_Temp', type: 'skynet', main: 'value', attrs: ['value'], bools: [] }] };
assert.ok(suggest('wait_b', words, '', '', true)?.list.some(x => x.text.startsWith('wait_boil')), 'wait_boil is a command');
assert.ok(suggest('if skn_B', words, '', '', true)?.list.some(x => x.text.startsWith('skn_Boil_Temp')), 'skn_Boil_Temp is offered');

bt.stop();
console.log('boiltemp tests passed');
