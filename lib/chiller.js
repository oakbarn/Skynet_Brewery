// The Chiller Overlay (OakBarn Brewery, 2026-11-15, Skynet Rule 5.42, Help 200).
// A chiller is normally put in the Brew Kettle by hand near the end of the boil and taken out again after chilling, so a
// Process places it and takes it away:
//   place_Chiller = Immersion_Chiller, BK_Vessel     draw that Chiller Template over that vessel, with its two hoses
//   remove_Chiller = BK_Vessel                       take the chiller and its hoses off that vessel again
//   remove_Chiller                                   take every chiller a Process placed off again
// The chiller is drawn over the vessel (on top of it). Its In hose comes from the Tap Water Valve on the vessel's Tab and its
// Out hose goes to the drain IP ("Drain or outside"), so flow shows only while that tap is open: a Chiller is a pipe (Rule 5.41).
// Only the drawing changes: the Process does not wait. To wait for a person, put an ask line after it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isImmersion, takesChiller } from '../public/chillmove.js';

const SHIPPED = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'templates', 'vessel');
// where each named port spot is on the chiller's box (public/app.js CORNERS and SIDE4, which a chilling coil uses)
const SPOTS = { 'Top Left': [0, 0.15], 'Top Right': [1, 0.15], 'Bottom Left': [0, 0.85], 'Bottom Right': [1, 0.85], Left: [0, 0.5], Right: [1, 0.5], Top: [0.5, 0], Bottom: [0.5, 1] };
const COIL_PORTS = { in: ['In', 'Top Left'], out: ['Out', 'Top Right'] };      // an immersion chiller's 2 IPs
const COIL_SIZE = [180, 180];          // a chilling coil's own size (public/app.js EQ.ccoil)
const TAP_PIC = 'Images/Skynet/Valves/Tap_Water_Valve_Hose_Bib.svg';
const INCH = { 0.25: '1/4', 0.375: '3/8', 0.5: '1/2', 0.75: '3/4', 1: '1', 1.5: '1 1/2', 2: '2' };
const same = (a, b) => String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();
const stdText = s => s?.type ? `${s.type} ${INCH[s.size] ?? s.size ?? ''}`.trim() : '';

// a chiller that goes into a vessel: an immersion chiller, a chilling coil with 2 IPs, In and Out (Immersion_Chiller). Plate and
// counterflow chillers sit outside the kettle on their own pipes, so they are not placed this way; a Chillzilla is a counterflow
// chiller with 4 IPs (OakBarn Brewery, 2026-11-15), so it is not placed either.
const isCoil = t => t?.vesselType === 'ccoil' && Number(t.liquidPorts ?? 2) === 2 && !/chillzilla/i.test(t.name);
function shippedCoils() {
  try {
    return fs.readdirSync(SHIPPED).filter(f => f.endsWith('.json')).map(f => ({ name: f.slice(0, -5), cls: 'skynet', ...JSON.parse(fs.readFileSync(path.join(SHIPPED, f), 'utf8')) })).filter(isCoil);
  } catch { return []; }
}
// the Chiller Templates a Process can place: the Brain's Templates when it has them (Skynet and User), else the shipped ones
export function chillerTemplates(templates) {
  const list = templates?.list ? templates.list('vessel') : shippedCoils();
  return list.filter(isCoil);
}
const label = t => String(t.label || t.name).replace(/_/g, ' ').replace(/^(\w)(.*)$/, (m, a, b) => a.toUpperCase() + b.toLowerCase());

// the vessels a chiller can go in, the Brew Kettle first (OakBarn Brewery: "the brew Kettle as the Default")
const isVessel = takesChiller;
const kettleRank = g => /brew kettle|boil kettle/i.test(`${g.vtype} ${g.label}`) ? 0 : /kettle|\bBK\b|^BK_/i.test(`${g.vtype} ${g.label} ${g.name}`) ? 1 : 2;
export function chillerVessels(config) {
  return (config?.graphics ?? []).filter(g => isVessel(g) && g.name).sort((a, b) => kettleRank(a) - kettleRank(b));
}
// a vessel by its Name, else by its Label when only one has that Label
function vesselByName(config, name) {
  const vs = (config?.graphics ?? []).filter(isVessel);
  return vs.find(g => same(g.name, name)) || (vs.filter(g => same(g.label, name)).length === 1 ? vs.find(g => same(g.label, name)) : null);
}
// the Tap Water Valve that feeds it (one on the vessel's Tab; a Label with "chill" in it first) and the drain IP
const tapOn = (gs, ws) => { const t = gs.filter(g => g.kind === 'ip' && g.fitting === 'manualValve' && g.image === TAP_PIC && g.workspace === ws); return t.find(g => /chill/i.test(g.label)) || t[0] || null; };
const drainOn = (gs, ws) => gs.find(g => g.kind === 'ip' && (!g.fitting || g.fitting === 'point') && !g.attachTo && g.workspace === ws && /drain|outside/i.test(g.label)) || null;
// the chiller a Process placed on this vessel, with its IPs and hoses
const placedOn = (gs, v) => gs.filter(g => g.chillerOn === v.id);
// a chiller a Process placed (it carries its own hoses), not one a person built and moved in by hand (those stay on the Tab)
const byProcess = (gs, c) => !!c.byProcess || gs.some(g => g.kind === 'pipe' && g.chillerHose === c.id);
const partsOf = (gs, c) => { const ips = gs.filter(g => g.kind === 'ip' && g.attachTo === c.id), ids = new Set(ips.map(g => g.id)); return [c, ...ips, ...gs.filter(g => g.kind === 'pipe' && (g.chillerHose === c.id || ids.has(g.from) || ids.has(g.to)))]; };

// What is wrong with "place_Chiller = template, vessel" ('' = nothing). Used by the Process Check and when the line runs.
export function placeError(config, templates, tplName, vesselName) {
  const all = chillerTemplates(templates), t = all.find(x => same(x.name, tplName));
  if (!tplName) return 'place_Chiller needs a Chiller Template and a Vessel, for example place_Chiller = Immersion_Chiller, BK_Vessel';
  if (!t) return `place_Chiller: no Chiller Template named ${tplName} (${all.map(x => x.name).join(', ') || 'none'}). Only an immersion chiller with 2 IPs, In and Out, is placed this way (never a plate or counterflow chiller, a Chillzilla included)`;
  if (!vesselName) return `place_Chiller = ${tplName} needs a Vessel after the comma, for example place_Chiller = ${t.name}, ${chillerVessels(config)[0]?.name || 'BK_Vessel'}`;
  const v = vesselByName(config, vesselName);
  if (!v) return `place_Chiller: no Vessel named ${vesselName}`;
  const gs = config.graphics ?? [];
  if (!tapOn(gs, v.workspace)) return `place_Chiller: there is no Tap Water Valve on the ${v.workspace} Tab for the chiller water (add one: Add Widget > Manual Valve, Tap Water Valve picture)`;
  { const hand = placedOn(gs, v).find(c => !byProcess(gs, c));
    if (hand) return `place_Chiller: ${hand.label || hand.name} is already in ${v.label || v.name} (moved there by hand). Move it out first, or use another Vessel`; }
  if (!drainOn(gs, v.workspace)) return `place_Chiller: there is no drain IP on the ${v.workspace} Tab for the chiller's Out hose (add an IP with "Drain" or "outside" in its Label)`;
  return '';
}
export function removeError(config, vesselName) {
  if (!vesselName) return '';
  return vesselByName(config, vesselName) ? '' : `remove_Chiller: no Vessel named ${vesselName}`;
}

const freeName = (gs, base) => { const used = new Set(gs.map(g => String(g.name || '').toLowerCase())); let n = 1; while (used.has(`${base}_${n}`.toLowerCase())) n++; return `${base}_${n}`; };
const tabId = (config, ws) => (config.workspaces ?? []).find(w => w.name === ws)?.id || '';
let seq = 0;
const newId = p => `${p}_${Date.now().toString(36)}${(seq++).toString(36)}`;

// place_Chiller = template, vessel: draw it. A chiller already placed on that vessel is taken off first.
export function placeChiller(config, templates, tplName, vesselName) {
  const bad = placeError(config, templates, tplName, vesselName); if (bad) return { error: bad };
  const t = chillerTemplates(templates).find(x => same(x.name, tplName)), v = vesselByName(config, vesselName);
  removeChiller(config, v.name);
  const gs = config.graphics ?? (config.graphics = []), ws = v.workspace;
  const [tw, th] = t.size || COIL_SIZE, w = Math.round((v.w || 260) * 0.42), h = Math.round(w * th / tw);
  const lab = label(t), id = tabId(config, ws);
  let name = ['wgt', 'CHL', lab.replace(/\s+/g, '~'), id].filter(Boolean).join('_');
  if (gs.some(g => same(g.name, name))) { let i = 2; while (gs.some(g => same(g.name, `${name}_${i}`))) i++; name = `${name}_${i}`; }
  const c = { id: newId('chl'), kind: 'vessel', vesselType: 'ccoil', workspace: ws, x: Math.round((v.x || 0) + ((v.w || 260) - w) / 2), y: Math.round((v.y || 0) + (v.h || 320) * 0.62 - h / 2), w, h,      // in the lower middle of the vessel, under its readings
   
    name, label: lab, labelVisible: false, labelAlign: 'below', labelSize: 12, template: t.name, templateCls: t.cls || 'skynet', vtype: t.vtype || 'Immersion coil',
    image: t.image || 'Images/Skynet/Chillers/chill_coil.svg', liquidPorts: 2, bundled: true, chillerOn: v.id, byProcess: true, ports: {} };
  if (t.std) c.std = JSON.parse(JSON.stringify(t.std));
  const ips = {};
  for (const [k, [pn, def]] of Object.entries(COIL_PORTS)) {
    const q = t.ports?.[k]; if (!q?.installed) continue;
    const pos = SPOTS[q.position] ? q.position : def, std = stdText(q.std || t.std);
    c.ports[k] = { installed: true, position: pos, standard: std };
    const [fx, fy] = SPOTS[pos];
    ips[k] = { id: newId('chlip'), kind: 'ip', workspace: ws, w: 30, h: 30, color: '#e8a33a', attachTo: c.id, port: k, labelVisible: false, labelAlign: 'below', labelSize: 12,
      x: Math.round(c.x + fx * w - 15), y: Math.round(c.y + fy * h - 15), label: `${pn}${std ? ` (${std})` : ''}` };
  }
  gs.push(c, ...Object.values(ips));
  // its two hoses: the tap's hose outlet to In, Out to the drain. Each hangs in a curve over the vessel's rim.
  const tap = tapOn(gs, ws), drain = drainOn(gs, ws), mid = ip => [ip.x + ip.w / 2, ip.y + ip.h / 2];
  const tapAt = [Math.round((tap.x || 0) + (tap.w || 50) / 3), Math.round((tap.y || 0) + (tap.h || 50) * 0.987)];
  // over the vessel's rim, on the side of the tap and the drain; threaded ends (a garden hose thread), so a person can't drag them
  // off on Brew Day: the Process puts them there and takes them away (Rule 5.40 Quick Disconnect ends are the ones that move)
  const rimY = Math.max(8, Math.round((v.y || 0) - 10)), vx = v.x || 0, vw = v.w || 260;
  const rimAt = p => [p[0] > vx + vw ? vx + vw - 25 : p[0] < vx ? vx + 25 : p[0], rimY];
  const hose = (from, to, a, b, out) => {
    const nm = freeName(gs, 'Hose'), r = rimAt(out ? b : a);
    const g = { id: newId('chlh'), kind: 'pipe', workspace: ws, from, to, points: [a, r, b].map(p => p.map(Math.round)),
      width: 8, color: '#c9ced3', hose: true, ipTypeFrom: 'MPT1/2', ipTypeTo: 'MPT1/2', name: nm, label: nm.toLowerCase(), chillerHose: c.id };
    gs.push(g); return g;
  };
  const hoses = [];
  if (ips.in) hoses.push(hose(`eq:${tap.id}:out`, ips.in.id, tapAt, mid(ips.in), false));
  if (ips.out) hoses.push(hose(ips.out.id, drain.id, mid(ips.out), mid(drain), true));
  return { ok: true, chiller: c, hoses, where: `${lab} in ${v.label || v.name}, In hose from ${tap.label || tap.name}, Out hose to ${drain.label || drain.name || 'the drain'}` };
}

// remove_Chiller = vessel (or nothing: every one a Process placed): the chiller, its IPs and its hoses go
export function removeChiller(config, vesselName) {
  const bad = removeError(config, vesselName); if (bad) return { error: bad };
  const gs = config.graphics ?? [];
  // only the chillers a Process placed; a chiller a person moved in by hand stays (Rule 5.42)
  const chillers = (vesselName ? placedOn(gs, vesselByName(config, vesselName)) : gs.filter(g => g.kind === 'vessel' && g.vesselType === 'ccoil')).filter(c => byProcess(gs, c));
  const gone = new Set(chillers.flatMap(c => partsOf(gs, c)));
  if (gone.size) config.graphics = gs.filter(g => !gone.has(g));
  return { ok: true, removed: chillers.map(c => c.name) };
}

// ---- Moving an Immersion Chiller by hand on a live Tab (OakBarn Brewery, 2026-11-17: "Immersion Chillers on a Tab Can be Free Floating
// but later moved to a Vessel similar to hand a QD Hose on a Live Tab"; Rule 5.42, Help 200). The same as a Quick Disconnect hose end
// (Rule 5.40): a right-button hold (or a finger) picks it up with no pop-up, and let go over a vessel it drops into that vessel; let go
// anywhere else it stays there, free floating. Its own hoses stay on its In and Out IPs and follow it ("bundled item with their own flow
// supply or connected with a QD Hose ... and the waste hose"): a chiller is a pipe (Rule 5.41), so moving it changes no flow.
// Only an immersion chiller (a chilling coil with 2 IPs, In and Out) moves; a plate or counterflow chiller (a Chillzilla too) or a
// jacketed coil is part of the manifold and stays put. A chiller joined by a rigid pipe (not a hose) cannot move.
export { isImmersion };
// what the chiller is joined to: its IPs, the hoses on them and any rigid pipe (which stops a move)
export function chillerJoins(config, c) {
  const gs = config?.graphics ?? [], ips = gs.filter(g => g.kind === 'ip' && g.attachTo === c.id), ids = new Set(ips.map(g => g.id));
  const on = gs.filter(g => g.kind === 'pipe' && (ids.has(g.from) || ids.has(g.to)));
  return { ips, hoses: on.filter(g => g.hose), pipes: on.filter(g => !g.hose) };
}
// the vessels a chiller can be dropped into on its Tab: a kettle type vessel with no other chiller in it
export function chillerDropVessels(config, c) {
  const gs = config?.graphics ?? [];
  return gs.filter(g => isVessel(g) && g.workspace === c.workspace && !gs.some(o => o !== c && o.chillerOn === g.id));
}
const num = v => typeof v === 'number' && Number.isFinite(v);
// POST /ui/chiller { id, x, y, into, hoses: [{ id, points }] }: into = the vessel's id, or null (free floating)
export function moveChiller(config, { id, x, y, into = null, hoses = [] } = {}) {
  const gs = config?.graphics ?? [], c = gs.find(g => g?.id === id);
  if (!c) return { error: 'That chiller is gone (reload the page)' };
  if (!isImmersion(c)) return { error: `${c.label || c.name || 'That'} is not an immersion chiller: only an immersion chiller (2 IPs, In and Out) is moved by hand on a Tab` };
  if (c.locked) return { error: `${c.label || c.name} is locked` };
  if (!num(x) || !num(y)) return { error: 'Bad chiller spot' };
  const j = chillerJoins(config, c);
  if (j.pipes.length) return { error: `${c.label || c.name} is joined by a pipe (${j.pipes.map(p => p.name || p.id).join(', ')}), not a hose, so it cannot move` };
  let v = null;
  if (into !== null) {
    v = chillerDropVessels(config, c).find(g => g.id === into);
    if (!v) return { error: 'The chiller cannot go there: that vessel is not on this Tab, or another chiller is in it' };
  }
  if (!Array.isArray(hoses) || hoses.some(q => !j.hoses.some(p => p.id === q?.id) || !Array.isArray(q.points) || q.points.length < 2 || q.points.length > 50 || !q.points.every(pt => Array.isArray(pt) && pt.length === 2 && pt.every(num))))
    return { error: 'Bad hose points' };
  const dx = Math.round(x) - (c.x || 0), dy = Math.round(y) - (c.y || 0);
  c.x = Math.round(x); c.y = Math.round(y);
  for (const g of j.ips) { g.x = (g.x || 0) + dx; g.y = (g.y || 0) + dy; }
  for (const q of hoses) { const p = j.hoses.find(o => o.id === q.id); p.points = q.points.map(([a, b]) => [Math.round(a), Math.round(b)]); delete p.qdAuto; }
  if (v) c.chillerOn = v.id; else delete c.chillerOn;
  return { ok: true, chiller: c.id, into: v?.id ?? null, where: v ? `in ${v.label || v.name}` : 'free floating on the Tab' };
}
