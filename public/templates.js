// Vessel Templates and Bundled Fitting Templates (Fritz, 2026-10-21): lists and checks shared by the browser and the Brain
// (lib/templates.js imports this file too).
// A Template is kept in a library, not on a Tab. Two classes: Skynet Templates (made by Skynet, shipped in templates/, read only
// once they are locked, never deleted, only cloned) and User Templates (config/templates, made, changed and deleted by Admins).
// Sending a Template to a Tab makes a copy there, a Tab_Vessel or Tab_Fitting, that is fully editable.

// Connection Standard (was "Outlet Standard"): the default for every port and Bundled Fitting of a Template; each one can set
// its own. It goes on the Equipment list and sets the default size of the SVG. DIN sizes are text, the others numbers.
export const CONNECTION_STANDARDS = {
  TC: 'TC (Tri-Clamp)', FPT: 'FPT (NPT female)', MPT: 'MPT (NPT male)',
  BSPFRp: 'BSP Female Rp', BSPFRc: 'BSP Female Rc', BSPMRp: 'BSP Male Rp', BSPMRc: 'BSP Male Rc',
  MMF: 'MM Female', MMM: 'MM Male', DIN: 'DIN',
};
export const textSize = std => std === 'DIN';
// short names for labels on a Tab ("Outlet (TC 1.5)")
const STD_SHORT = { BSPFRp: 'BSP F Rp', BSPFRc: 'BSP F Rc', BSPMRp: 'BSP M Rp', BSPMRc: 'BSP M Rc', MMF: 'MM F', MMM: 'MM M' };
export const stdShort = s => s?.type ? (STD_SHORT[s.type] || s.type) + (s.size !== undefined && s.size !== '' ? ' ' + s.size : '') : '';

// the fittings a Bundled Fitting is built from, up to four, from the vessel port outward. The list is set by Skynet:
// a new kind is added here, through GitHub.
export const FITTING_KINDS = {
  none: 'None', valve: 'Valve', tee: 'Tee', elbow90: '90 Degree Elbow', elbow45: '45 Degree Elbow', u: 'U', cipBallValve: 'CIP Ball Valve', reducer: 'Reducer', cap: 'End Cap',
  check: 'Check Valve', flowMeter: 'Flow Meter', flowMeterTemp: 'Flow Meter with Temperature',
};
export const FITTING_SLOTS = ['First Fitting', 'Second Fitting', 'Third Fitting', 'Fourth Fitting'];
export const THERMOWELL_POS = { short: 'Short', long: 'Long' };
// the vessel ports that take a Bundled Fitting
export const FITTING_PORTS = { outlet: 'Outlet', outlet2: 'Second Outlet', tangential: 'Tangential Inlet', steamSlayer: 'Steam Slayer', cip: 'CIP Inlet' };

export const TEMPLATE_KINDS = { vessel: 'Vessel Template', fitting: 'Bundled Fitting Template', device: 'Device Template' };
// a Template Name: letters, digits, _ and -, no spaces, unique (any letter case) across Skynet and User Templates
export const NAME_RE = /^[A-Za-z0-9_-]{1,60}$/;
export function nameProblem(name) {
  if (!name) return 'Give the Template a name';
  if (/\s/.test(name)) return 'A Template Name can\'t have spaces (use _ instead)';
  if (!NAME_RE.test(name)) return 'A Template Name can only have letters, digits, _ and - (60 at most)';
  return '';
}
// "Copy1_Name", "Copy2_Name", ... the first one not taken
export function copyName(name, taken) {
  const t = new Set([...taken].map(n => n.toLowerCase()));
  for (let i = 1; ; i++) { const n = `Copy${i}_${name}`.slice(0, 60); if (!t.has(n.toLowerCase())) return n; }
}
// the name a Template gets when it is put on a Tab: bndl1_Name_TabId, bndl2_ ...
export function bundleName(name, tabId, taken) {
  const t = new Set([...taken].map(n => String(n).toLowerCase()));
  for (let i = 1; ; i++) { const n = `bndl${i}_${name}_${tabId}`; if (!t.has(n.toLowerCase())) return n; }
}

const text = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const num = (v, what) => {
  if (v === '' || v === null || v === undefined) return undefined;
  if (!Number.isFinite(+v) || +v < 0) throw new Error(`${what} must be a number, 0 or more`);
  return +v;
};
export function cleanStd(s, what = 'Connection Standard') {
  if (!s || !s.type) return undefined;
  if (!CONNECTION_STANDARDS[s.type]) throw new Error(`${what}: unknown standard "${s.type}"`);
  const size = textSize(s.type) ? text(s.size, 30) : num(s.size, `${what} size`);
  return size === undefined || size === '' ? { type: s.type } : { type: s.type, size };
}
export const stdText = s => s?.type ? CONNECTION_STANDARDS[s.type] + (s.size !== undefined && s.size !== '' ? ' ' + s.size : '') : '';

// a Bundled Fitting Template: its name, standard, up to four fittings and its picture
export function cleanFitting(b = {}) {
  const fittings = FITTING_SLOTS.map((_, i) => {
    const f = (Array.isArray(b.fittings) ? b.fittings[i] : null) || {};
    const kind = FITTING_KINDS[f.kind] ? f.kind : 'none';
    const out = { kind };
    if (kind === 'tee' && f.thermowell) { out.thermowell = true; out.thermowellPos = THERMOWELL_POS[f.thermowellPos] ? f.thermowellPos : 'short'; }
    if (kind === 'reducer' && text(f.toSize, 30)) out.toSize = text(f.toSize, 30);       // the size of its other end, smaller or bigger (the type stays the same)
    return out;
  });
  // where each IP sits on the picture (port key -> position name, e.g. { start: 'Bottom', end: 'Right' }), for a Skynet picture
  // whose openings are not where a Tab_Fitting puts them by itself
  const ipPos = {};
  for (const [k, v] of Object.entries(b.ipPos && typeof b.ipPos === 'object' ? b.ipPos : {})) if (/^\w{1,20}$/.test(k) && text(v, 40)) ipPos[k] = text(v, 40);
  const out = { std: cleanStd(b.std), fittings, image: text(b.image, 300) || undefined, ipPos: Object.keys(ipPos).length ? ipPos : undefined, notes: text(b.notes, 2000) || undefined };
  const size = cleanSize(b.size); if (size) out.size = size;       // a picture that is not square (Instrument_Tee: 90 x 50)
  return out;
}
// the IPs a Bundled Fitting has: the far end of the chain (none when an End Cap closes it), plus the open side of every tee
// without a thermowell
export function fittingEnds(t) {
  const fs = (t.fittings || []).filter(f => f.kind !== 'none');
  if (!fs.length) return [];
  const ends = fs[fs.length - 1].kind === 'cap' ? [] : [{ key: 'end', name: 'End' }];
  fs.forEach((f, i) => { if (f.kind === 'tee' && !f.thermowell) ends.push({ key: 'branch' + (i + 1), name: `Tee ${i + 1} branch` }); });
  return ends;
}

// the Connection Standard of one of a Bundled Fitting's IPs: past a reducer the size is the reducer's small end
// (key 'start' sits before every fitting, 'branchN' at fitting N, 'end' after the last one)
// an End Cap by itself (Fritz, 2026-10-22): it has no IP; dropped on an opening it closes it
export const isCapOnly = t => { const fs = (t?.fittings || []).filter(f => f.kind !== 'none'); return fs.length === 1 && fs[0].kind === 'cap'; };

export function fittingPortStd(t, key) {
  const at = key === 'start' ? 0 : key === 'end' ? Infinity : +String(key).replace(/\D/g, '') || 0;
  let std = t.std ? { ...t.std } : undefined;
  (t.fittings || []).forEach((f, i) => { if (i + 1 < at && f.kind === 'reducer' && f.toSize && std) std = { type: std.type, size: textSize(std.type) ? f.toSize : (Number.isFinite(+f.toSize) ? +f.toSize : f.toSize) }; });
  return std;
}

// the size it is drawn on a Tab, [width, height] in pixels, so a picture keeps its shape (none = the kind's own size)
const cleanSize = v => Array.isArray(v) && v.length === 2 && v.every(x => Number.isFinite(+x) && +x >= 20 && +x <= 2000) ? v.map(x => Math.round(+x)) : undefined;
// Integrated items (Fritz, 2026-10-23): a Skynet_Integrated_Device has its Devices built in (a RIMS tube: its heating element and
// its temperature probe, each with its own Interface and Port); a Skynet_Integrated_Widget has its IPs built in (an elbow, a tee).
// It can be bundled with other things, but what is built into it can never be unbundled.
export const INTEGRATED = { device: 'Skynet_Integrated_Device', widget: 'Skynet_Integrated_Widget' };
// a Vessel Template: what today's Vessel tab holds, without the Devices of a Schema (those are picked on the Tab_Vessel),
// with a Connection Standard and, on each port, a Bundled Fitting
export const VESSEL_KINDS = { vessel: 'Vessel', pchiller: 'Plate chiller', ccoil: 'Chilling coil', herms: 'HERMS coil', trub: 'Trub filter', rims: 'RIMS tube' };
export function cleanVessel(b = {}) {
  const vesselType = VESSEL_KINDS[b.vesselType] ? b.vesselType : 'vessel';
  const t = { vesselType, units: b.units === 'Metric' ? 'Metric' : undefined, vtype: text(b.vtype, 80) || undefined, otherType: text(b.otherType, 80) || undefined, image: text(b.image, 300) || undefined,
    heatKind: text(b.heatKind, 20) || undefined, otherHeat: text(b.otherHeat, 80) || undefined, std: cleanStd(b.std), notes: text(b.notes, 2000) || undefined, ports: {} };
  for (const k of ['volume', 'deadspace', 'extraTrub', 'maxVolume', 'minVolume']) t[k] = num(b[k], k);
  // the size it is drawn on a Tab, [width, height] in pixels, so a picture keeps its shape (empty = the kind's own size)
  const size = cleanSize(b.size); if (size) t.size = size;
  if (INTEGRATED[b.integrated]) t.integrated = b.integrated;
  if (NAME_RE.test(text(b.base, 60))) t.base = text(b.base, 60);      // the Skynet Vessel Widget a User Bundled vessel Template is built on
  if (['ccoil', 'herms'].includes(vesselType)) t.liquidPorts = String(b.liquidPorts) === '4' ? 4 : 2;     // 2 or 4 liquid ports (Chillzilla: 4)
  for (const [k, q] of Object.entries(b.ports && typeof b.ports === 'object' ? b.ports : {})) {
    if (!/^\w{1,30}$/.test(k)) continue;
    const p = { installed: !!q?.installed, position: text(q?.position, 60) || undefined };
    if (p.installed && FITTING_PORTS[k] && text(q?.fitting, 60)) { p.fitting = text(q.fitting, 60); p.bundleName = text(q.bundleName, 80) || undefined; }
    const std = cleanStd(q?.std, `${k} Connection Standard`); if (std) p.std = std;
    for (const x of Object.keys(p)) if (p[x] === undefined) delete p[x];
    t.ports[k] = p;
  }
  return t;
}

// Add a Vessel (Fritz, 2026-10-23). A Skynet Vessel Widget is a vessel picture with its IPs built in and nothing else: no Device
// properties. A Skynet Integrated Vessel (Skynet_Integrated_Device) has its Devices built in. A User Bundled vessel Template is
// always built on a Skynet Vessel Widget: picked as a Widget, built and bundled on the Build Tab, then saved. base = that Widget.
const vesselOnly = t => (t?.vesselType || 'vessel') === 'vessel';
export const isVesselWidget = t => t?.cls === 'skynet' && vesselOnly(t) && !t.integrated;
export const isIntegratedVessel = t => t?.cls === 'skynet' && vesselOnly(t) && t.integrated === 'device';
// the Skynet Vessel Widget a vessel Template is built on (itself for a Widget), or nothing. all = every Vessel Template.
export function vesselBase(t, all = []) {
  if (!t || !vesselOnly(t)) return undefined;
  if (isVesselWidget(t)) return t.name;
  const b = t.base && all.find(x => x.name.toLowerCase() === String(t.base).toLowerCase());
  return isVesselWidget(b) ? b.name : undefined;
}
export const isUserBundledVessel = (t, all) => t?.cls === 'user' && !!vesselBase(t, all);

// Skynet Device Templates (Fritz, 2026-10-28, Rules 5.16 and 5.17). A Skynet Template and its Daughter Templates are set: a user
// makes a User version of it (a Device on a Tab with template = its name), which inherits everything. Only the attributes in
// the Template's userFields can be set on the User version and only those show in its Properties; the rest are fixed. Which
// ones depends on the type, so each Template lists its own (the Build Template Tab gives each attribute a "user can set" box).
// A Master Template can have Daughters for common orientations: a Daughter names its master and sets only what differs.
//   type      the Device type (digitalOut)
//   props     its attributes (subtype, valveType, service, orientation, size, look, tap ...)
//   pics      { h: [picture when on, picture when off], v: [...] }: the picture follows the orientation (45 degrees turns v)
//   userFields  the attributes a user can set
// Fixed always, even when a Template doesn't list them: the pictures, Kind, Valve type, Service, Look and tap behaviour.
export const DEVICE_FIXED = ['type', 'subtype', 'valveType', 'service', 'imageOn', 'imageOff', 'imageOverlay', 'background', 'imagePath_1', 'imagePath_2', 'imagePath_3',
  'look', 'digits', 'tap', 'tapTarget', 'confirm', 'hideValue', 'ipIn', 'ipOut'];
const KEY_RE = /^\w{1,40}$/;
const jsonSafe = v => v === undefined ? undefined : JSON.parse(JSON.stringify(v));
export function cleanDevice(b = {}) {
  const t = { master: NAME_RE.test(text(b.master, 60)) ? text(b.master, 60) : undefined, title: text(b.title, 120) || undefined, notes: text(b.notes, 2000) || undefined };
  if (['digitalOut'].includes(b.type)) t.type = b.type;
  const props = {};
  for (const [k, v] of Object.entries(b.props && typeof b.props === 'object' ? b.props : {})) if (KEY_RE.test(k) && v !== undefined) props[k] = jsonSafe(v);
  t.props = props;
  const pics = {};
  for (const o of ['h', 'v']) { const p = b.pics?.[o]; if (Array.isArray(p) && p.length === 2) pics[o] = p.map(x => text(x, 300)); }
  if (Object.keys(pics).length) t.pics = pics;
  if (Array.isArray(b.userFields)) t.userFields = [...new Set(b.userFields.filter(k => typeof k === 'string' && KEY_RE.test(k) && !DEVICE_FIXED.includes(k)))];
  for (const k of Object.keys(t)) if (t[k] === undefined) delete t[k];
  return t;
}
// a Daughter Template with its Master's attributes filled in (a Master is itself). all = every Device Template.
export function resolveDevice(t, all = []) {
  const m = t?.master && all.find(x => x.name.toLowerCase() === t.master.toLowerCase() && !x.master);
  if (!m) return t;
  return { ...t, type: t.type || m.type, props: { ...m.props, ...t.props }, ownProps: t.props, pics: t.pics || m.pics, userFields: t.userFields || m.userFields, ownUserFields: t.userFields };
}
// the attributes of a Template that are fixed on its User versions
export const deviceFixed = t => new Set([...DEVICE_FIXED, ...Object.keys(t?.props || {})].filter(k => !(t?.userFields || []).includes(k)));
// which end tap water leaves by, from the end it comes in at (tapSource, the tap side): unset = "Needs setting", no tap flow
export const tapOutFrom = src => ({ in: 'out', out: 'in' })[src] || 'none';
// put a User version back to its Template: every fixed attribute takes the Template's value (the Brain does this on every
// layout save, so no screen or request can change one), and its pictures follow its orientation
export function applyDeviceTemplate(el, t) {
  if (!t) return el;
  const fixed = deviceFixed(t);
  for (const k of fixed) { if (k in (t.props || {})) el[k] = jsonSafe(t.props[k]); else if (k !== 'type') delete el[k]; }
  if (t.type) el.type = t.type;
  const p = t.pics?.[el.orientation === 'h' ? 'h' : 'v'];
  if (p) { el.imageOn = p[0]; el.imageOff = p[1]; }
  if (el.subtype === 'valve') { if (el.tapwater) el.tapwaterOut = tapOutFrom(el.tapSource); else { delete el.tapwaterOut; delete el.tapSource; } }
  return el;
}
