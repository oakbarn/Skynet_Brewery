// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The Hydrometer Device (OakBarn Brewery, 2026-11-09, Rule 6.25, Help 170): "Add all the Hydrometer Types as Hydrometer Templates, Tilt,
// Tilt Pro, ISpindel ... Almost all have a Method so you can connect more than 1. Tilt has you purchase a difference color. There may be
// a need to add all the properties of the different Types to the General Hydrometer Properties but Grey it if not applicable to the type."
// One Device type (hydrometer, Device Type ID Hydro, a virtual port 200, 201 ... as BruControl numbers them). Its Template (.model)
// picks which settings it uses; the rest are shown greyed out. More than one can be connected: a Tilt is told apart by its Color, every
// other type by its Hardware ID, .hwId: its Name or chip ID, never its IP address, which a router may change (OakBarn Brewery,
// 2026-11-09: "for a Tilt Color and Id are mandatory"; "WE Night want to create a Hardware IP Field").
// Shared by the Brain (server.js, lib/hardware.js), the Panel (public/app.js) and the BruControl Importer (lib/bruimport.js).

// How a hydrometer sends its readings ("Connection"; not "Method", which is the Control Method of Rule 6.19)
export const HYDRO_CONNECTIONS = {
  bluetooth: 'Bluetooth (the Brain\'s own, or an ESP32 near the fermenter)',
  wifi: 'Wi-Fi: it sends its readings to Skynet',
  cloud: 'The maker\'s cloud (needs its Cloud key)',
};
// What a hydrometer can report (the Device's attributes besides its gravity, the main value)
export const HYDRO_READS = { temperature: 'Temperature', battery: 'Battery', rssi: 'Signal strength (RSSI)', angle: 'Tilt angle' };

// The Hydrometer Templates. idBy: color (a Tilt) or id (its Name or ID); decimals: its gravity decimals (SG); lostMin: no reading for
// this many minutes = Lost signal (each one reports at its own pace: a Tilt every few seconds, an iSpindel every 15 minutes or so);
// smooth: its starting Smoothing weight % (OakBarn Brewery, 2026-11-09: "smoothing of Readings"; a Tilt bounces with the bubbles).
export const HYDRO_MODELS = {
  tilt: { smooth: 20, label: 'Tilt', conns: ['bluetooth'], idBy: 'color', reads: ['temperature', 'rssi'], decimals: 3, lostMin: 15,
    about: 'Bluetooth. Told apart by its color, so you can have one of each of the 8 colors. Reads gravity to 0.001 and temperature to 1 °F.' },
  tiltPro: { smooth: 20, label: 'Tilt Pro', conns: ['bluetooth'], idBy: 'color', reads: ['temperature', 'rssi'], decimals: 4, lostMin: 15,
    about: 'Bluetooth, a stronger signal than the Tilt. Told apart by its color (8 colors). Reads gravity to 0.0001 and temperature to 0.1 °F.' },
  tiltProMini: { smooth: 20, label: 'Tilt Pro Mini', conns: ['bluetooth'], idBy: 'color', reads: ['temperature', 'rssi'], decimals: 4, lostMin: 15,
    about: 'The small Tilt Pro (fits a carboy neck). Bluetooth, told apart by its color (8 colors). Reads like the Tilt Pro.' },
  ispindel: { smooth: 100, label: 'iSpindel', conns: ['wifi'], idBy: 'id', reads: ['temperature', 'battery', 'rssi', 'angle'], decimals: 3, lostMin: 60,
    about: 'Wi-Fi. On its setup page pick HTTP and type Skynet\'s address (shown below). Told apart by its Hardware ID: its Name (iSpindel000 to start) or its ID number.' },
  gravitymon: { smooth: 100, label: 'GravityMon', conns: ['wifi', 'bluetooth'], idBy: 'id', reads: ['temperature', 'battery', 'rssi', 'angle'], decimals: 4, lostMin: 60,
    about: 'iSpindel hardware with the GravityMon program. Wi-Fi like an iSpindel (told apart by its Hardware ID: its Name or ID), or Bluetooth.' },
  floaty: { smooth: 100, label: 'Floaty', conns: ['wifi'], idBy: 'id', reads: ['temperature', 'battery', 'rssi', 'angle'], decimals: 3, lostMin: 60,
    about: 'An iSpindel-type hydrometer. Wi-Fi, set up like an iSpindel. Told apart by its Hardware ID (its Name or ID).' },
  brewbrainFloat: { smooth: 100, label: 'BrewBrain Float', conns: ['wifi', 'cloud'], idBy: 'id', reads: ['temperature', 'battery', 'rssi', 'angle'], decimals: 3, lostMin: 60,
    about: 'Wi-Fi to Skynet (its custom HTTP setting), or the BrewBrain cloud. Told apart by its Hardware ID (its Name or ID).' },
  raptPill: { smooth: 100, label: 'RAPT Pill', conns: ['bluetooth', 'cloud'], idBy: 'id', reads: ['temperature', 'battery', 'rssi', 'angle'], decimals: 4, lostMin: 60,
    about: 'KegLand RAPT Pill. Bluetooth (told apart by its ID, shown in the RAPT app), or the RAPT cloud with its Cloud key.' },
  plaato: { smooth: 100, label: 'PLAATO', conns: ['cloud'], idBy: 'id', reads: ['temperature'], decimals: 3, lostMin: 60,
    about: 'PLAATO Airlock: works out the gravity from the bubbles. Only through the PLAATO cloud (its Cloud key). The Airlock is no longer sold.' },
  other: { smooth: 100, label: 'Other hydrometer', conns: ['wifi', 'bluetooth', 'cloud'], idBy: 'id', reads: ['temperature', 'battery', 'rssi', 'angle'], decimals: 3, lostMin: 60,
    about: 'Any other hydrometer that sends iSpindel-style readings to Skynet over Wi-Fi. Told apart by its Hardware ID (its Name or ID).' },
};
export const HYDRO_MODEL_KEYS = Object.keys(HYDRO_MODELS);
export const hydroModel = el => HYDRO_MODELS[el?.model] ?? HYDRO_MODELS.tilt;

// The 8 Tilt colors; each has its own Bluetooth ID (an iBeacon ID: every Tilt of that color sends it)
export const TILT_COLORS = {
  Red: 'a495bb10c5b14b44b5121370f02d74de', Green: 'a495bb20c5b14b44b5121370f02d74de', Black: 'a495bb30c5b14b44b5121370f02d74de',
  Purple: 'a495bb40c5b14b44b5121370f02d74de', Orange: 'a495bb50c5b14b44b5121370f02d74de', Blue: 'a495bb60c5b14b44b5121370f02d74de',
  Yellow: 'a495bb70c5b14b44b5121370f02d74de', Pink: 'a495bb80c5b14b44b5121370f02d74de',
};
export const TILT_COLOR_NAMES = Object.keys(TILT_COLORS);
export const GRAVITY_UNITS = { SG: 'SG (Specific Gravity, 1.050)', Plato: '°Plato', Brix: '°Brix' };

// its Connection: the one picked, if the Template allows it, else the Template's first
export const hydroConnection = el => { const m = hydroModel(el); return m.conns.includes(el?.connection) ? el.connection : m.conns[0]; };

// Which settings the picked Template uses. A setting it does not use is shown greyed out (never hidden). Returns '' when it is used,
// or the reason it is greyed out.
export function hydroGrey(el, key) {
  const m = hydroModel(el), conn = hydroConnection(el);
  switch (key) {
    case 'connection': return m.conns.length > 1 ? '' : `A ${m.label} has only one Connection: ${HYDRO_CONNECTIONS[m.conns[0]].replace(/\s*\(.*\)$/, '').replace(/:.*$/, '')}`;
    case 'color': return m.idBy === 'color' ? '' : `Only a Tilt is told apart by its color. A ${m.label} uses its Hardware ID`;
    case 'hwId': return m.idBy === 'id' ? '' : `A ${m.label} is told apart by its Color`;
    case 'cloudKey': return conn === 'cloud' ? '' : 'Only for the Connection "The maker\'s cloud"';
    case 'battery': case 'angle': return m.reads.includes(key) ? '' : `A ${m.label} does not send its ${HYDRO_READS[key].toLowerCase()}`;
    default: return '';
  }
}
// Mandatory (OakBarn Brewery, 2026-11-09, Rule 18.33): a Tilt's Color, every other type's Name or ID. '' when it is filled in.
export function hydroMissing(el) {
  const m = hydroModel(el);
  if (m.idBy === 'color') return TILT_COLORS[el?.color] ? '' : `Pick the ${m.label}'s Color: it is how Skynet tells your ${m.label}s apart`;
  return String(el?.hwId ?? '').trim() ? '' : `Type or pick the ${m.label}'s Hardware ID (its Name or ID): it is how Skynet tells your hydrometers apart`;
}

// ---- gravity
// SG to °Plato and back (the usual brewing formulas). °Brix is read as °Plato: a hydrometer's Brix is the same scale.
export const sgToPlato = sg => -616.868 + 1111.14 * sg - 630.272 * sg ** 2 + 135.997 * sg ** 3;
export const platoToSg = p => 1 + p / (258.6 - (p / 258.2) * 227.1);
export const fromSg = (sg, units) => units === 'Plato' || units === 'Brix' ? sgToPlato(sg) : sg;
export const toSg = (v, units) => units === 'Plato' || units === 'Brix' ? platoToSg(v) : v;
// ABV from the Original Gravity and the gravity now (both SG)
export const abv = (og, sg) => (Number(og) > 0 && Number(sg) > 0 ? Math.max(0, (Number(og) - Number(sg)) * 131.25) : 0);
// a gravity a person typed: SG 0.980 to 1.200 (1050 is taken as 1.050)
export function readSg(text) {
  let v = Number(String(text ?? '').trim().replace(',', '.'));
  if (Number.isFinite(v) && v >= 980 && v <= 1200) v /= 1000;
  if (!Number.isFinite(v) || v < 0.98 || v > 1.2) throw new Error(`"${text}" is not a gravity: type the SG, for example 1.050`);
  return Math.round(v * 10000) / 10000;
}

const round = (v, d) => { const f = 10 ** Math.max(0, Math.min(6, d)); return Math.round(v * f) / f; };
const toF = (t, unit) => /^c/i.test(String(unit ?? 'F')) ? t * 9 / 5 + 32 : t;

// One report (from Wi-Fi, Bluetooth, the cloud or the Simulator), as { sg, tempF, battery, rssi, angle }, turned into the Device's
// readings in its own units: { value (the gravity), temperature, battery, rssi, angle }. Its offsets are added; old = the readings now,
// for Smoothing (Smoothing weight %: 100 = none, as an Analog Input's).
export function hydroReadings(el, rep, old = {}) {
  const units = GRAVITY_UNITS[el?.gravityUnits] ? el.gravityUnits : 'SG', m = hydroModel(el);
  const dec = el?.precision !== undefined && el?.precision !== '' && el?.precision !== null && Number.isFinite(+el.precision) ? +el.precision : units === 'SG' ? m.decimals : 1;
  const w = Number.isFinite(+el?.avgWeight) && el?.avgWeight !== '' && el?.avgWeight !== null ? Math.max(1, Math.min(100, +el.avgWeight)) / 100 : 1;
  const smooth = (v, o) => (Number.isFinite(+o) && o !== '' && o !== null && w < 1 ? +o + (v - +o) * w : v);
  const out = {};
  if (Number.isFinite(+rep?.sg) && rep.sg !== null && rep.sg !== '') {
    const v = smooth(fromSg(+rep.sg, units) + (Number(el?.gravityOffset) || 0), old.value);
    out.value = round(v, dec); out.sg = round(toSg(v, units), 4);      // its SG from the reading itself, not from the rounded value
  }
  if (Number.isFinite(+rep?.tempF) && rep.tempF !== null && rep.tempF !== '') {
    const t = /c/i.test(String(el?.tempUnits ?? '°F')) ? (+rep.tempF - 32) * 5 / 9 : +rep.tempF;
    out.temperature = round(smooth(t + (Number(el?.tempOffset) || 0), old.temperature), 1);
  }
  for (const k of ['battery', 'rssi', 'angle']) if (Number.isFinite(+rep?.[k]) && rep[k] !== null && rep[k] !== '') out[k] = round(+rep[k], k === 'rssi' ? 0 : 2);
  return out;
}

// A Wi-Fi report (iSpindel, GravityMon, Floaty, BrewBrain Float, or any that sends the iSpindel fields) as
// { name, id, sg, tempF, battery, rssi, angle }. Its gravity may be in °Plato (iSpindel "gravity_unit"/"gravity-unit": "P").
export function parseWifiReport(b) {
  if (!b || typeof b !== 'object') throw new Error('A hydrometer report is JSON, like an iSpindel sends');
  const pick = (...ks) => { for (const k of ks) if (b[k] !== undefined && b[k] !== null && b[k] !== '') return b[k]; return undefined; };
  const name = String(pick('name', 'Name', 'device', 'device_name') ?? '').trim(), id = String(pick('ID', 'id', 'chipId', 'chip_id', 'token') ?? '').trim();
  if (!name && !id) throw new Error('The report has no name or ID, so Skynet can\'t tell which hydrometer it is');
  let g = Number(pick('corr-gravity', 'corr_gravity', 'gravity', 'Gravity', 'sg', 'SG'));
  const gu = String(pick('gravity-unit', 'gravity_unit', 'gravity_units', 'gravityUnit') ?? '').toUpperCase();
  if (Number.isFinite(g) && (gu.startsWith('P') || gu.startsWith('B') || g > 2)) g = platoToSg(g);
  const t = Number(pick('temperature', 'temp', 'Temperature'));
  const tu = String(pick('temp_units', 'temp-units', 'temp_unit', 'temperature_unit') ?? 'C');
  const num = v => (v === undefined || !Number.isFinite(Number(v)) ? undefined : Number(v));
  return { name, id, sg: Number.isFinite(g) && g > 0 ? g : undefined, tempF: Number.isFinite(t) ? toF(t, tu) : undefined,
    battery: num(pick('battery', 'Battery')), rssi: num(pick('RSSI', 'rssi')), angle: num(pick('angle', 'tilt', 'Angle')) };
}
// the Hydrometer a report is for: Wi-Fi (or Other) ones by their Name or ID, any capitals
export function hydroFor(elements, rep, conn = 'wifi') {
  const keys = [rep?.name, rep?.id].filter(Boolean).map(s => String(s).trim().toLowerCase());
  return (elements ?? []).find(e => e.type === 'hydrometer' && hydroConnection(e) === conn && hydroModel(e).idBy === 'id' && keys.includes(String(e.hwId ?? '').trim().toLowerCase()));
}

// ---- Bluetooth (OakBarn Brewery, 2026-11-09: PR 2). A listener (an ESP32 near the fermenter, or the Raspberry Pi's own Bluetooth)
// hears the hydrometers' Bluetooth adverts and sends them as they are to POST /api/hydrometer/bluetooth:
//   { from: 'its name', ads: [{ address: 'aa:bb:cc:dd:ee:ff', rssi: -70, mfg: { '76': 'hex', '16722': 'hex' } }] }
// mfg = the advert's manufacturer data, by company number (decimal), its bytes after the company number in hex.
// The Brain reads them here, so the listeners stay simple and every kind is read the same way.
const TILT_BY_ID = Object.fromEntries(Object.entries(TILT_COLORS).map(([c, id]) => [id, c]));
const hexBytes = h => { const s = String(h ?? '').replace(/[^0-9a-f]/gi, ''); const b = new Uint8Array(s.length >> 1); for (let i = 0; i < b.length; i++) b[i] = parseInt(s.substr(i * 2, 2), 16); return b; };
// A Tilt is an Apple iBeacon (company 76 = 0x004C): 02 15, its 16 byte ID (its color), major (temperature °F) and minor (gravity x 1000).
// A Tilt Pro (and Pro Mini) sends ten times more: major = °F x 10, minor = gravity x 10000.
export function decodeTilt(hex) {
  const b = hexBytes(hex);
  if (b.length < 23 || b[0] !== 0x02 || b[1] !== 0x15) return null;
  const id = [...b.slice(2, 18)].map(x => x.toString(16).padStart(2, '0')).join(''), color = TILT_BY_ID[id];
  if (!color) return null;
  const major = (b[18] << 8) | b[19], minor = (b[20] << 8) | b[21], pro = minor > 5000;
  if (major === 999) return null;      // a Tilt says 999 while it starts up or is being set up: not a reading
  const sg = pro ? minor / 10000 : minor / 1000, tempF = pro ? major / 10 : major;
  if (!(sg > 0.98 && sg < 1.2)) return null;
  return { kind: 'tilt', color, pro, sg, tempF };
}
// A RAPT Pill (company 16722 = 0x4152, "RA"): "PT", version, 6 bytes (its MAC in version 1), temperature (uint16, / 128 - 273.15 °C),
// gravity (float32, / 1000), x, y, z (int16, / 16), battery (int16, / 256 %), all big-endian: 23 bytes with "PT" (as the rapt-ble
// project reads it). Its Hardware ID is its Bluetooth address (the MAC), shown in the RAPT app.
export function decodeRapt(hex, address = '') {
  const b = hexBytes(hex);
  if (b.length !== 23 || b[0] !== 0x50 || b[1] !== 0x54) return null;      // "PT"
  const v = new DataView(b.buffer), version = b[2];
  if (version !== 1 && version !== 2) return null;
  const mac = version === 1 ? [...b.slice(3, 9)].map(x => x.toString(16).padStart(2, '0')).join(':') : '';
  const tempC = v.getUint16(9) / 128 - 273.15, sg = v.getFloat32(11) / 1000;
  const x = v.getInt16(15) / 16, y = v.getInt16(17) / 16, z = v.getInt16(19) / 16, battery = Math.round(v.getInt16(21) / 256);
  const len = Math.hypot(x, y, z), angle = len ? Math.round(Math.acos(Math.min(1, Math.abs(z) / len)) * 1800 / Math.PI) / 10 : undefined;
  if (!(sg > 0.98 && sg < 1.2)) return null;
  const id = (String(address || '').trim() || mac).toLowerCase();
  if (!id) return null;
  return { kind: 'rapt', id, sg, tempF: tempC * 9 / 5 + 32, battery, angle };
}
// every hydrometer reading in one advert: [{ kind, color | id, sg, tempF, battery?, angle?, rssi }]
export function decodeBle(ad) {
  const out = [], mfg = ad?.mfg ?? {}, rssi = Number.isFinite(Number(ad?.rssi)) ? Number(ad.rssi) : undefined;
  if (mfg['76']) { const t = decodeTilt(mfg['76']); if (t) out.push({ ...t, rssi }); }
  if (mfg['16722']) { const r = decodeRapt(mfg['16722'], ad?.address); if (r) out.push({ ...r, rssi }); }
  return out;
}
// the Hydrometer a Bluetooth reading is for: a Tilt (any Tilt kind) by its Color, a RAPT Pill (or another) by its Hardware ID; only those
// whose Connection is Bluetooth
export function hydroForBle(elements, rep) {
  const bt = (elements ?? []).filter(e => e.type === 'hydrometer' && hydroConnection(e) === 'bluetooth');
  if (rep?.kind === 'tilt') return bt.find(e => hydroModel(e).idBy === 'color' && e.color === rep.color);
  const id = String(rep?.id ?? '').trim().toLowerCase(), bare = id.replace(/[^0-9a-f]/g, '');
  return bt.find(e => { const h = String(e.hwId ?? '').trim().toLowerCase(); return hydroModel(e).idBy === 'id' && h && (h === id || (bare.length === 12 && h.replace(/[^0-9a-f]/g, '') === bare)); });
}

// The Simulator: a pretend fermentation. sim: { og (SG, else the Device's Original Gravity, else 1.050), fg (1.010), hours (to go from
// og to fg, 96), tempF (66) }. t = hours since the Simulator started it.
export function simReport(el, hours) {
  const s = el?.sim ?? {}, og = Number(s.og) || Number(el?.og) || 1.05, fg = Number(s.fg) || 1.01, span = Math.max(1, Number(s.hours) || 96);
  const k = Math.min(1, Math.max(0, hours / span)), sg = fg + (og - fg) * (1 - (3 * k * k - 2 * k * k * k));      // slow, fast, then slow
  return { sg, tempF: Number(s.tempF) || 66, battery: 4.1, rssi: -60, angle: 25 + (sg - 1) * 600 };
}
// Two Hydrometers can't share a Color (every Tilt kind sends the same Bluetooth ID for a color) or a Name or ID: a report would not know
// which one it is for. The other Hydrometer's name, or ''.
export function hydroClash(el, elements) {
  const m = hydroModel(el), key = m.idBy === 'color' ? el?.color : String(el?.hwId ?? '').trim().toLowerCase();
  if (!key) return '';
  const o = (elements ?? []).find(x => x !== el && x.name !== el?.name && x.type === 'hydrometer' && hydroModel(x).idBy === m.idBy
    && (m.idBy === 'color' ? x.color === key : String(x.hwId ?? '').trim().toLowerCase() === key));
  return o ? o.name : '';
}

// ---- a Hydrometer's line on a Graph (OakBarn Brewery, 2026-11-09: "List SG, Brix, and Plato all The time and on a graph choose which
// to display but easy to switch right on the graph"). The database keeps its gravity in its own Gravity units; the Graph shows it in
// SG, °Plato or °Brix, switched by a click on the Graph.
export const GRAPH_GRAVITY = [['SG', 'SG'], ['Plato', '°P'], ['Brix', '°Bx']];
export const convertGravity = (v, from, to) => { const sg = toSg(Number(v), GRAVITY_UNITS[from] ? from : 'SG'); return fromSg(sg, GRAVITY_UNITS[to] ? to : 'SG'); };
export const gravitySeries = (pts, from, to) => (from || 'SG') === (to || 'SG') || ((from === 'Plato' || from === 'Brix') && (to === 'Plato' || to === 'Brix')) ? pts
  : (pts ?? []).map(([t, v]) => [t, convertGravity(v, from, to)]);
