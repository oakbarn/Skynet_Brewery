// Removing an Interface safely (Panel Updates entry 29, OakBarn Brewery, 2026-11-18: "I clicked remove on the Interface for BM
// Brewery Mega. It is the host asking if I want to delete. I know I should not do this as it would mess up almost every Thing so a
// Remove needs lots of steps to do so"; approved 2026-11-20: "29 ... yes"). Rule 2.63, Help 76 "Removing an Interface".
// The browser's own OK box is gone. Remove opens one Skynet box that shows what uses the Interface, offers to move it all to another
// Interface, and (one warning only) asks for the Interface ID to be typed before an Interface still in use is removed. Nothing that
// used it is deleted (Design Rule #1): its Devices keep every setting and show "No Interface" until they are moved.
// Pure functions here (used by public/app.js and test/ifaceremove.test.js); the box itself is in public/app.js (ifaceRemoveDialog).
import { portKeys, oneWireCircuits, owCircuitOf, isOneWirePort, pinProfile } from './naming.js';
import { analogPins } from './boards.js';

const isOneWire = e => e?.type === 'temperature' && (!e.sensor || e.sensor === 'ds18b20');
// the Port names of a Device, without the Interface part (22, A5, 1w1_2 ...)
export const pinsShown = e => portKeys(e).map(k => k.split('|')[1]);

// what uses Interface `name` in a Schema's config: its Devices, the Widgets and pictures tied to them, its 1-Wire Index slots,
// and any other item (a Vessel's parts, a Manifold) that names the Interface itself
export function ifaceUse(cfg, name) {
  const els = cfg?.elements || [], gfx = cfg?.graphics || [];
  const devices = els.filter(e => e?.device === name);
  const devNames = new Set(devices.map(e => e.name).filter(Boolean));
  const refs = o => Object.entries(o || {}).some(([k, v]) => k !== 'name' && typeof v === 'string' && devNames.has(v));
  const names = o => Object.entries(o || {}).some(([k, v]) => k !== 'name' && k !== 'device' && typeof v === 'string' && v === name);
  // a picture of a Device on a Tab carries its name; a Clone names it in .of; a Widget (or a control loop) names it in a setting
  const widgets = [
    ...gfx.filter(g => devNames.has(g?.name) || devNames.has(g?.of) || refs(g)),
    ...els.filter(e => e?.device !== name && refs(e)),
  ];
  const probes = (cfg?.probes || []).filter(p => p?.device === name);
  const others = [...gfx, ...els].filter(o => !widgets.includes(o) && names(o));
  return { devices, devNames, widgets, probes, others };
}
// the names a Process may use for them (the Devices, their pictures and Clones, and the Interface itself)
export const useNames = (use, name) => [name, ...use.devNames, ...use.widgets.map(w => w.name)].filter(Boolean);
export const inUse = (use, procs = []) => !!(use.devices.length || use.widgets.length || use.probes.length || use.others.length || procs.length);

// Move every Device (and its 1-Wire slots, and items naming the Interface) from Interface `from` to `to`. A Device whose Port is
// taken on `to`, or whose 1-Wire circuit `to` does not have, stays where it is and is listed in `stay` with the reason; nothing
// else changes. Returns a new { elements, graphics, probes } to save, and what moved.
export function moveIface(cfg, from, to) {
  const target = (cfg?.devices || []).find(d => d.name === to);
  if (!target) throw new Error(`There is no Interface called ${to}`);
  const elements = (cfg.elements || []).map(e => ({ ...e })), graphics = (cfg.graphics || []).map(g => ({ ...g }));
  const taken = new Set(elements.filter(e => e.device === to).flatMap(portKeys));
  const circuits = new Set(oneWireCircuits(target).map(c => +c.n));
  if (!circuits.size) circuits.add(1);      // an Interface with no 1-Wire circuit yet gets circuit 1 on its first probe (lib/store.js)
  const moved = [], stay = [];
  for (const e of elements) {
    if (e.device !== from) continue;
    if (isOneWire(e) && e.probeIndex && !circuits.has(owCircuitOf(e))) { stay.push({ name: e.name, why: `1-Wire circuit ${owCircuitOf(e)} is not on ${to} yet` }); continue; }
    const keys = portKeys({ ...e, device: to }), clash = keys.find(k => taken.has(k));
    if (clash) { const p = clash.split('|')[1]; stay.push({ name: e.name, why: `${isOneWirePort(p) ? '1-Wire Index' : 'Port'} ${p} is taken on ${to}` }); continue; }
    e.device = to; keys.forEach(k => taken.add(k)); moved.push(e.name);
  }
  const stays = new Set(stay.map(s => s.name));
  const probes = (cfg.probes || []).map(p => {
    if (p?.device !== from) return p;
    const users = elements.filter(e => isOneWire(e) && e.probeIndex && owCircuitOf(e) === owCircuitOf(p) && +e.probeIndex === +p.index);
    return users.some(e => stays.has(e.name)) ? p : { ...p, device: to };
  });
  // a Vessel's parts or a Manifold that name the Interface itself follow it only when all its Devices moved
  if (!stay.length) for (const o of [...graphics, ...elements]) for (const [k, v] of Object.entries(o)) if (k !== 'name' && k !== 'device' && v === from) o[k] = to;
  return { elements, graphics, probes, moved, stay };
}

// the large Hover Help on the Remove button (entry 29 Part 5, OakBarn Brewery: "When you Hover the Remove Button Large Warning Pop Up").
// The French is in public/hoverhelp-fr.json, as {0} patterns.
export function removeTip(id, ifName, n) {
  const who = `${id ? id + ': ' : ''}${ifName}`;
  // one line per text, so each line has its own French
  if (!n.devices && !n.widgets && !n.procs && !n.others) return [`⟪b:Remove ${who}⟫`, 'Nothing uses this Interface, so it can be removed safely. A backup of the Schema is made first.'].join('\n');
  return ['⚠ Removing an Interface can break your whole brewery',
    `${who} is in use by: Devices ${n.devices}, Widgets ${n.widgets}, Processes ${n.procs}.`,
    'If it is removed, every one of them stops working: nothing on this board can be switched or read until each Device is moved to another Interface.',
    'Did you mean ⚙ Change? Use Change to pick another board, USB Port or Network address. The Devices stay on it.',
    `Remove shows what uses it, offers to move it all to another Interface, and asks you to type ${id || ifName} before anything is removed. A backup of the Schema is made first.`].join('\n');
}

// Changing an Interface's Board (Panel Updates entry 29, question (c); OakBarn Brewery, 2026-11-20: "I'd make it simpler: show the counts
// and save, with no typed confirmation. KISS"): the Devices on it whose Ports the new board does not have. They keep their Ports
// (nothing is taken away, Design Rule #1); the brewer gives each a new Port. 1-Wire Index slots and parts on an add-on (ADS) are not
// board pins and always fit.
const pinNorm = p => {
  const s = String(p ?? '').trim().toUpperCase(); if (!s) return '';
  let m = /^A(\d{1,2})$/.exec(s); if (m && +m[1] <= 15) return String(54 + +m[1]);
  m = /^(?:GPIO|BCM)(\d+)$/.exec(s); if (m) return String(+m[1]);
  m = /^D?(\d+)$/.exec(s); return m ? String(+m[1]) : s;
};
export function devicesOffBoard(cfg, name, board) {
  const P = pinProfile(board), fits = new Set([...P.pins, ...analogPins(P)].map(pinNorm));
  const out = [];
  for (const e of ifaceUse(cfg, name).devices) {
    const off = pinsShown(e).filter(p => /^\d+$/.test(p) && !fits.has(pinNorm(p)));
    if (off.length) out.push({ name: e.name, ports: off });
  }
  return out;
}
