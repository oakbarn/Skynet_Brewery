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
  none: 'None', valve: 'Valve', tee: 'Tee', elbow90: '90 Degree Elbow', elbow45: '45 Degree Elbow', u: 'U', cipBallValve: 'CIP Ball Valve',
};
export const FITTING_SLOTS = ['First Fitting', 'Second Fitting', 'Third Fitting', 'Fourth Fitting'];
export const THERMOWELL_POS = { short: 'Short', long: 'Long' };
// the vessel ports that take a Bundled Fitting
export const FITTING_PORTS = { outlet: 'Outlet', tangential: 'Tangential Inlet', steamSlayer: 'Steam Slayer', cip: 'CIP Inlet' };

export const TEMPLATE_KINDS = { vessel: 'Vessel Template', fitting: 'Bundled Fitting Template' };
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
    return out;
  });
  return { std: cleanStd(b.std), fittings, image: text(b.image, 300) || undefined, notes: text(b.notes, 2000) || undefined };
}
// the IPs a Bundled Fitting has: the far end of the chain, plus the open side of every tee without a thermowell
export function fittingEnds(t) {
  const fs = (t.fittings || []).filter(f => f.kind !== 'none');
  if (!fs.length) return [];
  const ends = [{ key: 'end', name: 'End' }];
  fs.forEach((f, i) => { if (f.kind === 'tee' && !f.thermowell) ends.push({ key: 'branch' + (i + 1), name: `Tee ${i + 1} branch` }); });
  return ends;
}

// a Vessel Template: what today's Vessel tab holds, without the Devices of a Schema (those are picked on the Tab_Vessel),
// with a Connection Standard and, on each port, a Bundled Fitting
export const VESSEL_KINDS = { vessel: 'Vessel', pchiller: 'Plate chiller', ccoil: 'Chilling coil', herms: 'HERMS coil', trub: 'Trub filter' };
export function cleanVessel(b = {}) {
  const vesselType = VESSEL_KINDS[b.vesselType] ? b.vesselType : 'vessel';
  const t = { vesselType, units: b.units === 'Metric' ? 'Metric' : undefined, vtype: text(b.vtype, 80) || undefined, otherType: text(b.otherType, 80) || undefined, image: text(b.image, 300) || undefined,
    heatKind: text(b.heatKind, 20) || undefined, otherHeat: text(b.otherHeat, 80) || undefined, std: cleanStd(b.std), notes: text(b.notes, 2000) || undefined, ports: {} };
  for (const k of ['volume', 'deadspace', 'extraTrub', 'maxVolume', 'minVolume']) t[k] = num(b[k], k);
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
