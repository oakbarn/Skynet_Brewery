// The boil temperature here and now (Panel Updates entry 16; Rules 1.18 and 2.27).
// Settings > Boil temperature has the airport's ICAO code (the one and only way to pick the weather station, OakBarn Brewery
// 2026-11-19), the brewery's Elevation and an optional typed air pressure. Every 30 minutes the Brain asks
// aviationweather.gov for that airport's report (METAR: free, no sign-up, no key), takes its pressure up to the brewery's
// Elevation and works out skn_Boil_Temp. Only the 4 letter airport code leaves the Brain.
//   1. Air pressure typed in Settings: used as it is (no internet needed)
//   2. The airport's report, taken to the Elevation (the Elevation starts as the airport's own; it can always be changed)
//   3. No report (no internet, the station is down, a wrong code): standard air at the Elevation, with one plain message
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { boilC, stationPressure, stdPressure, toHpa, round, isIcao, STD_HPA, MSG } from '../public/boilpoint.js';

const UA = 'SkynetBrewery/1.0';
const REPORT = id => `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(id)}&format=json`;
const MAX_AGE_S = 3 * 3600;          // airports report about once an hour: older than 3 hours = no report
const num = v => v === '' || v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Number(v);

// What Settings sends, checked. Data is metric: Elevation in metres, pressure in hPa (the browser converts from feet / inHg).
export function cleanSettings(b = {}) {
  const airport = String(b.airport ?? '').trim().toUpperCase().slice(0, 4);
  const e = num(b.elevationM), hp = num(b.pressureHpa);
  if (e !== null && !(e >= -500 && e <= 9000)) throw new Error('Elevation must be from -500 to 9000 metres (-1640 to 29500 feet)');
  if (hp !== null && !(hp >= 300 && hp <= 1100)) throw new Error('Air pressure must be from 300 to 1100 hPa (8.9 to 32.5 inHg)');
  return { airport, elevationM: e === null ? null : round(e, 1), pressureHpa: hp === null ? null : round(hp, 1), elevationAuto: !!b.elevationAuto };
}

export class BoilTemp extends EventEmitter {
  constructor(dataDir, { fetch = globalThis.fetch, store = null, everyMin = 30 } = {}) {
    super();
    this.file = path.join(dataDir, 'boil_temperature.json');
    this.fetch = fetch; this.store = store; this.everyMin = everyMin;
    this.settings = { airport: '', elevationM: null, pressureHpa: null, elevationAuto: false };
    this.now = { hpa: STD_HPA, boilC: round(boilC(STD_HPA), 2), source: 'standard', note: MSG.noCode, at: null };
    this._timer = null; this._busy = null;
    try {
      const j = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      this.settings = { ...this.settings, ...cleanSettings(j.settings) };
      if (j.last?.hpa) this._use(j.last);
    } catch { /* first start */ }
    this._use(this.now);
  }
  _save() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify({ settings: this.settings, last: this.now }, null, 2));
  }
  _use(r) {
    this.now = { ...r, hpa: round(r.hpa, 1), boilC: round(boilC(r.hpa), 2) };
    if (this.store) this.store.skn = { hpa: this.now.hpa, boilC: this.now.boilC };
    this.emit('status', this.status());
  }
  status() { return { settings: { ...this.settings }, ...this.now }; }

  start() { this.refresh().catch(() => { }); this._schedule(); }
  stop() { clearTimeout(this._timer); this._timer = null; }
  _schedule() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => { this.refresh().catch(() => { }); this._schedule(); }, this.everyMin * 60000);
    this._timer.unref?.();
  }
  // Save in Settings: kept even when the code gets no report (never stop a user), the message says what is wrong
  async save(body) {
    const was = this.settings, next = cleanSettings(body);
    // the Elevation the airport filled in follows a new airport, unless it was changed by hand
    next.elevationAuto = !!was.elevationAuto && (next.elevationM === null || next.elevationM === was.elevationM);
    if (next.airport !== was.airport && next.elevationAuto) next.elevationM = null;
    this.settings = next;
    this._save(); this._schedule();
    return this.refresh();
  }

  // The airport's newest report, or a plain message (MSG.badCode: no such airport or it never reports; MSG.noReport: no answer)
  async report(id) {
    let list;
    try {
      const r = await this.fetch(REPORT(id), { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
      if (r.status === 204) list = [];          // aviationweather.gov: no report for that code
      else if (!r.ok) throw new Error(`aviationweather.gov answered ${r.status}`);
      else list = await r.json();
    } catch { return { error: MSG.noReport }; }
    const all = (Array.isArray(list) ? list : []).filter(m => num(m.altim) !== null);
    if (!all.length) return { error: MSG.badCode };
    const m = all.sort((a, b) => (b.obsTime ?? 0) - (a.obsTime ?? 0))[0];
    if (m.obsTime && Date.now() / 1000 - m.obsTime > MAX_AGE_S) return { error: MSG.noReport };
    return { m };
  }

  // Works out the pressure and boil temperature now. Never throws: what went wrong is in the status (note).
  refresh() {
    this._busy ??= this._refresh().finally(() => { this._busy = null; });
    return this._busy;
  }
  async _refresh() {
    const s = this.settings;
    const done = r => { this._use({ note: '', ...r, at: new Date().toISOString() }); this._save(); return this.status(); };
    if (s.pressureHpa) return done({ hpa: s.pressureHpa, source: 'typed' });
    let note = MSG.noCode;
    if (s.airport && !isIcao(s.airport)) note = MSG.badCode;
    else if (s.airport) {
      const a = await this.report(s.airport);
      if (a.m) {
        const stationElev = num(a.m.elev);
        if (s.elevationM === null && stationElev !== null) { s.elevationM = round(stationElev, 1); s.elevationAuto = true; }   // to start: the airport's own
        const qnh = toHpa(Number(a.m.altim));
        return done({ hpa: stationPressure(qnh, s.elevationM ?? stationElev ?? 0), source: 'airport', qnh: round(qnh, 1),
          station: { id: a.m.icaoId ?? s.airport, name: a.m.name ?? '', elevM: stationElev, obs: a.m.obsTime ? new Date(a.m.obsTime * 1000).toISOString() : null } });
      }
      note = a.error;
    }
    return done({ hpa: stdPressure(s.elevationM ?? 0), source: 'standard', note });
  }
}
