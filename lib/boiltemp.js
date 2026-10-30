// The boil temperature here and now (Fritz, 2026-10-30). Water boils cooler when the air pressure is low (up a mountain,
// or a storm coming), so a Process can't just wait for 212 °F. The User Profile (☰ Menu > User Profile) says where the
// brewery is: a zip or postal code, or a city. The Brain finds that place on the map, asks the nearest airport for its
// pressure (every airport reports one, its METAR), brings it to the brewery's height and works out skn_Boil_Temp.
//   1. Air pressure typed in the User Profile: used as it is (no internet needed)
//   2. The nearest airport's report (aviationweather.gov), or the airport the User Profile names
//   3. The weather service's pressure for that spot (open-meteo.com) when no airport answers
//   4. No internet: the standard pressure at the brewery's height (or at sea level), and the panel says so
// Every source is free and needs no sign-up. Refreshed every 30 minutes (airports report about once an hour).
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { boilC, stationPressure, stdPressure, toHpa, round, STD_HPA } from '../public/skynetnames.js';

const UA = 'SkynetBrewery/1.0 (home brewery control panel; https://github.com/oakbarn/skynet_brewery)';
const PROFILE_KEYS = ['name', 'country', 'postal', 'city', 'elevationM', 'airport', 'pressureHpa', 'refreshMin'];
const km = (a, b) => {          // distance on the earth between two { lat, lon }
  const r = x => x * Math.PI / 180, dLat = r(b.lat - a.lat), dLon = r(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};
const placeKey = p => [p.country, p.postal, p.city].map(s => String(s ?? '').trim().toLowerCase()).join('|');
const num = v => v === '' || v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Number(v);

export function cleanProfile(b = {}) {
  const s = (v, n = 80) => String(v ?? '').trim().slice(0, n);
  const p = { name: s(b.name), country: s(b.country, 60), postal: s(b.postal, 20), city: s(b.city), airport: s(b.airport, 4).toUpperCase() };
  if (p.airport && !/^[A-Z0-9]{3,4}$/.test(p.airport)) throw new Error('Airport code: the 4 letter ICAO code, for example KMKE or EGLL (empty = the nearest airport)');
  const e = num(b.elevationM), hp = num(b.pressureHpa), rm = num(b.refreshMin);
  if (e !== null && !(e >= -500 && e <= 9000)) throw new Error('Height above sea level must be from -500 to 9000 metres (-1640 to 29500 feet)');
  if (hp !== null && !(hp >= 300 && hp <= 1100)) throw new Error('Air pressure must be from 300 to 1100 hPa (8.9 to 32.5 inHg)');
  if (rm !== null && !(rm >= 5 && rm <= 1440)) throw new Error('Refresh every must be from 5 to 1440 minutes');
  if (e !== null) p.elevationM = e;
  if (hp !== null) p.pressureHpa = hp;
  p.refreshMin = rm ?? 30;
  return p;
}

export class BoilTemp extends EventEmitter {
  constructor(dataDir, { fetch = globalThis.fetch, store = null } = {}) {
    super();
    this.file = path.join(dataDir, 'user_profile.json');
    this.fetch = fetch; this.store = store;
    this.profile = { refreshMin: 30 };
    this.located = null;        // { key, lat, lon, place, elevM }: where the profile's place is (kept, so the map is asked once)
    this.now = { hpa: STD_HPA, boilC: 100, source: 'standard', note: 'No User Profile yet: sea level is used', at: null };
    this._timer = null; this._busy = null;
    try {
      const j = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      this.profile = { refreshMin: 30, ...j.profile }; this.located = j.located ?? null;
      if (j.last?.hpa) this._use(j.last);
    } catch { /* first start */ }
  }
  _save(last = this.now) {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify({ profile: this.profile, located: this.located, last }, null, 2));
  }
  _use(r) {
    this.now = { ...r, hpa: round(r.hpa, 1), boilC: round(boilC(r.hpa), 2) };
    this.store?.setSkynet?.({ hpa: this.now.hpa, boilC: this.now.boilC });
    this.emit('status', this.status());
  }
  status() { return { profile: this.profile, place: this.located?.place ?? '', elevM: this._elev(), ...this.now }; }
  _elev() { return this.profile.elevationM ?? this.located?.elevM ?? null; }

  start() { this.refresh().catch(() => { }); this._schedule(); }
  stop() { clearTimeout(this._timer); this._timer = null; }
  _schedule() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => { this.refresh().catch(() => { }); this._schedule(); }, (this.profile.refreshMin || 30) * 60000);
    this._timer.unref?.();
  }
  async setProfile(body) {
    const p = cleanProfile(body);
    if (placeKey(p) !== placeKey(this.profile)) this.located = null;      // a new place: find it on the map again
    this.profile = p; this._save(); this._schedule();
    return this.refresh();
  }

  async _get(url, headers = {}) {
    const r = await this.fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', ...headers }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error(`${new URL(url).host} answered ${r.status}`);
    return r.json();
  }
  // the place on the map, and its height above sea level
  async locate() {
    const p = this.profile, key = placeKey(p);
    if (this.located?.key === key) return this.located;
    if (!p.postal && !p.city) return null;
    const q = new URLSearchParams({ format: 'json', limit: '1' });
    if (p.postal) q.set('postalcode', p.postal); if (p.city) q.set('city', p.city); if (p.country) q.set('country', p.country);
    let hits = await this._get('https://nominatim.openstreetmap.org/search?' + q);
    if (!hits?.length && p.postal && p.city) {         // a postal code the map doesn't know: try the city alone
      q.delete('postalcode'); hits = await this._get('https://nominatim.openstreetmap.org/search?' + q);
    }
    const h = hits?.[0];
    if (!h) throw new Error(`The map could not find ${[p.postal, p.city, p.country].filter(Boolean).join(', ')}`);
    const at = { lat: +h.lat, lon: +h.lon };
    let elevM = null;
    try { const e = await this._get(`https://api.open-meteo.com/v1/elevation?latitude=${at.lat}&longitude=${at.lon}`); elevM = num(e?.elevation?.[0]); } catch { /* the height is asked for again next time */ }
    this.located = { key, ...at, place: String(h.display_name ?? '').split(',').slice(0, 3).join(',').trim(), elevM };
    if (elevM !== null) this._save();
    return this.located;
  }
  // the nearest airport that reported in the last 3 hours (or the one the profile names)
  async airport(at) {
    const fresh = m => num(m.altim) !== null && (!m.obsTime || Date.now() / 1000 - m.obsTime < 3 * 3600);
    if (this.profile.airport) {
      const list = await this._get(`https://aviationweather.gov/api/data/metar?ids=${this.profile.airport}&format=json`);
      const m = (list || []).find(fresh);
      if (!m) throw new Error(`Airport ${this.profile.airport} has no recent report`);
      return { m, distKm: at && m.lat !== undefined ? km(at, m) : null };
    }
    if (!at) return null;
    for (const d of [1, 2.5]) {
      const list = await this._get(`https://aviationweather.gov/api/data/metar?bbox=${[at.lat - d, at.lon - d, at.lat + d, at.lon + d].map(x => x.toFixed(3)).join(',')}&format=json`);
      const near = (list || []).filter(fresh).map(m => ({ m, distKm: km(at, m) })).sort((a, b) => a.distKm - b.distKm)[0];
      if (near) return near;
    }
    return null;
  }

  // Works out the pressure and boil temperature now. Never throws: the reason goes in the status (note).
  refresh() {
    this._busy ??= this._refresh().finally(() => { this._busy = null; });
    return this._busy;
  }
  async _refresh() {
    const p = this.profile, notes = [];
    const done = r => { this._use({ ...r, at: new Date().toISOString(), note: notes.join(' ') }); this._save(); return this.status(); };
    if (p.pressureHpa) return done({ hpa: p.pressureHpa, source: 'manual' });
    let at = null;
    try { at = await this.locate(); } catch (e) { notes.push(e.message + '.'); }
    const elev = this._elev();
    try {
      const a = await this.airport(at);
      if (a) {
        const qnh = toHpa(a.m.altim);
        return done({ hpa: stationPressure(qnh, elev ?? 0), source: 'airport', qnh: round(qnh, 1),
          station: { id: a.m.icaoId ?? p.airport, name: a.m.name ?? '', distKm: a.distKm === null ? null : round(a.distKm, 0), obs: a.m.obsTime ? new Date(a.m.obsTime * 1000).toISOString() : null } });
      }
      if (at) notes.push('No airport near enough reported.');
    } catch (e) { notes.push(`Airport: ${e.message}.`); }
    if (at) {
      try {
        const w = await this._get(`https://api.open-meteo.com/v1/forecast?latitude=${at.lat}&longitude=${at.lon}&current=surface_pressure,pressure_msl`);
        const msl = num(w?.current?.pressure_msl), sfc = num(w?.current?.surface_pressure);
        // brought to the brewery's own height when it is known, else the weather service's pressure for that spot
        const hpa = msl !== null && elev !== null ? stationPressure(msl, elev) : sfc;
        if (hpa) return done({ hpa, source: 'weather' });
      } catch (e) { notes.push(`Weather service: ${e.message}.`); }
    }
    if (!p.postal && !p.city && !p.airport) notes.push('No place in the User Profile yet.');
    notes.push(elev !== null ? `Standard air pressure at ${Math.round(elev)} m is used.` : 'Sea level is used.');
    return done({ hpa: stdPressure(elev ?? 0), source: 'standard' });
  }
}
