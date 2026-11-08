// ---- The Vessel Device Builder (OakBarn Brewery, 2026-11-08: "time to Build the Vessel Device Template. We will Build in the
// Skynet Panel First and bring it over to the Importer the same or with some items greyed out"; Rule 19.5, Help 166).
// A step-by-step dialog in the Pump drill-down look (Rule 18.31). Each page asks one thing; the last page shows what is on the
// vessel, and Build puts a Vessel Device (Rule 5.31) made from the Skynet_Vessel_Widget Template on the 🔨 Build Tab, with its
// parts built into their IPs and every spot it does not use Not Placed (Rule 19.4).
// This file only holds the questions and works out the answers (no screen code), so the BruControl Importer can ask the same
// pages later, with the items OakBarn Brewery picks greyed out.

export const VB_TEMPLATE = 'Skynet_Vessel_Widget';

export const VB_KINDS = [['HLT', 'HLT (Hot Liquor Tank)'], ['Mash Tun', 'Mash Tun'], ['Brew Kettle', 'Brew Kettle (Boil Kettle)'],
  ['All In One', 'All In One (heats, mashes and boils)'], ['Fermenter', 'Fermenter'], ['Other', 'Other']];

// the pages, in order: [key, title]
export const VB_STEPS = [['name', 'Name'], ['size', 'Size'], ['outlet', 'Outlet'], ['inlets', 'Inlets'], ['heat', 'Heating'],
  ['temp', 'Temperature'], ['herms', 'HERMS Coil'], ['check', 'Check and Build']];

export const VB_OUTLETS = [['none', 'None'], ['cOutlet', 'Center Outlet (low on the side)'], ['cBottomOutlet', 'Center Bottom Outlet (bottom drain)']];
export const VB_VALVES = [['none', 'None'], ['manualBall', 'Manual Ball Valve (a Manual Valve Widget on the outlet)'],
  ['manualButterfly', 'Manual Butterfly Valve (a Manual Valve Widget on the outlet)'], ['motor', 'Motorized Ball Valve (built into the outlet)']];
export const VB_MANUAL_PICS = { manualBall: 'Images/Skynet/Valves/Manual_Ball_Valve_Side_Closed.svg', manualButterfly: 'Images/Skynet/Valves/Valve_Manual_Butterfly_ClosedH.svg' };
export const VB_TANGENTIAL = [['none', 'None'], ['left', 'Left'], ['right', 'Right']];
export const VB_SPARGE = [['none', 'None'], ['left', 'Upper Left'], ['right', 'Upper Right']];
export const VB_HERMS = [['none', 'None'], ['left', 'Left (on Left HERMS In and Left HERMS Out)'], ['right', 'Right (on Right HERMS In and Right HERMS Out)']];
export const VB_PROBES = [['none', 'None'], ['thermowell', 'Thermowell with its probe (in from the side)'], ['front', 'Front probe (on the Center Probe spot)']];
// the spots a Heating Element or a Thermowell can go on (the IP names are general only, Rule 5.31)
export const VB_SIDE_SPOTS = [['rElement', 'Right Element'], ['lElement', 'Left Element'], ['rBackElement', 'Right Back Element'], ['lBackElement', 'Left Back Element']];
export const VB_MAX_HEATERS = 4;
const SIDE_IP = { left: 'l', right: 'r' };
const spotName = k => VB_SIDE_SPOTS.find(([x]) => x === k)?.[1] || { cProbe: 'Center Probe', cOutlet: 'Center Outlet', cBottomOutlet: 'Center Bottom Outlet' }[k] || k;

// the answers a new build starts with: a 10 gallon vessel with a bottom drain, one Heating Element on the Right Element and a
// Thermowell on the Left Element, like the Three Vessel sample's HLT
export function vbStart(over = {}) {
  return { label: '', vtype: 'HLT', units: 'US', volume: 10, sizeMethod: 'proportional', diameter: '', vheight: '',
    outlet: 'cBottomOutlet', outValve: 'none', outPin: '', tangential: 'none', sparge: 'none',
    heaters: '1', heat1Spot: 'rElement', heat1Pin: '', heat2Spot: 'lBackElement', heat2Pin: '', heat3Spot: 'rBackElement', heat3Pin: '', heat4Spot: 'lElement', heat4Pin: '',
    probe: 'thermowell', probeSpot: 'lElement', ptk: '', probePin: '', probeIdx: '', herms: 'none', vpIface: '', ...over };
}

// how many Heating Elements, 0 to 4
export const vbHeaters = w => Math.max(0, Math.min(VB_MAX_HEATERS, Math.floor(+w.heaters || 0)));

// the Vessel Device's parts as its Properties keep them (rSparge_part, rSparge_pin ...): what applyVParts in app.js makes
export function vbParts(w) {
  const vp = { vpIface: w.vpIface || '', vHerms: w.herms === 'left' || w.herms === 'right' ? w.herms : '' };
  const put = (k, kind, pin, more = {}) => { if (!vp[k + '_part']) Object.assign(vp, { [k + '_part']: kind, [k + '_pin']: pin ?? '', ...more }); };
  for (let i = 1; i <= vbHeaters(w); i++) put(w[`heat${i}Spot`], 'element', w[`heat${i}Pin`]);
  if (w.probe === 'thermowell' || w.probe === 'front') put(w.probe === 'front' ? 'cProbe' : w.probeSpot, w.probe === 'front' ? 'probe' : 'thermowell', w.probePin, { [(w.probe === 'front' ? 'cProbe' : w.probeSpot) + '_ptk']: w.ptk, [(w.probe === 'front' ? 'cProbe' : w.probeSpot) + '_pidx']: w.probeIdx });
  if (w.outlet !== 'none' && w.outValve === 'motor') put(w.outlet, 'valve', w.outPin);
  return vp;
}
// the IPs that are Placed (on the vessel); every other spot is Not Placed (Rule 19.4)
export function vbPlaced(w) {
  const on = new Set();
  if (w.outlet && w.outlet !== 'none') on.add(w.outlet);
  if (SIDE_IP[w.tangential]) on.add(SIDE_IP[w.tangential] + 'Tangential');
  if (SIDE_IP[w.sparge]) on.add(SIDE_IP[w.sparge] + 'Sparge');
  if (SIDE_IP[w.herms]) { on.add(SIDE_IP[w.herms] + 'HermsIn'); on.add(SIDE_IP[w.herms] + 'HermsOut'); }
  for (const k of Object.keys(vbParts(w))) if (k.endsWith('_part')) on.add(k.slice(0, -5));
  return [...on];
}
// the spot the Temperature probe uses, or ''
export const vbProbeSpot = w => w.probe === 'front' ? 'cProbe' : w.probe === 'thermowell' ? w.probeSpot : '';

// what is wrong on one page (plain words), or [] when it can go on. oneWire(ptk) says if a probe type is a OneWire probe.
export function vbProblems(w, step, { oneWire = () => false, metric = w.units === 'Metric' } = {}) {
  const out = [], blank = v => v === undefined || v === null || String(v).trim() === '';
  if (step === 'name') {
    if (blank(w.label)) out.push('Type its Label (for example HLT). The Label can not be blank.');
  }
  if (step === 'size') {
    if (!(+w.volume > 0)) out.push(`Type the ${metric ? 'Liters' : 'Gallons'} (more than 0).`);
    if (w.sizeMethod === 'diameter' && !(+w.diameter > 0 && +w.vheight > 0)) out.push('The Diameter method needs a Diameter and a Height (more than 0).');
  }
  const needIface = () => { if (blank(w.vpIface)) out.push('Pick the Interface (board) the parts built into this vessel are wired to (page 1).'); };
  if (step === 'outlet' && w.outlet !== 'none' && w.outValve === 'motor') {
    needIface();
    if (blank(w.outPin)) out.push('Pick the Port of the Motorized Ball Valve.');
  }
  if (step === 'heat') {
    const n = vbHeaters(w), seen = new Map();
    if (n) needIface();
    for (let i = 1; i <= n; i++) {
      const k = w[`heat${i}Spot`];
      if (seen.has(k)) out.push(`Heating Element ${i} and Heating Element ${seen.get(k)} are both on the ${spotName(k)}. Pick another spot.`); else seen.set(k, i);
      if (blank(w[`heat${i}Pin`])) out.push(`Pick the Port of Heating Element ${i}.`);
    }
    const pins = [...Array(n)].map((_, i) => String(w[`heat${i + 1}Pin`] ?? '').trim()).filter(Boolean);
    if (new Set(pins).size < pins.length) out.push('Two Heating Elements can not use the same Port.');
  }
  if (step === 'temp' && (w.probe === 'thermowell' || w.probe === 'front')) {
    needIface();
    const k = vbProbeSpot(w);
    for (let i = 1; i <= vbHeaters(w); i++) if (w[`heat${i}Spot`] === k) out.push(`Heating Element ${i} is on the ${spotName(k)}. Put the Thermowell on another spot.`);
    if (oneWire(w.ptk)) { if (blank(w.probeIdx)) out.push('Pick the OneWire probe number.'); }
    else if (blank(w.probePin)) out.push('Pick the Port of the Temperature probe.');
  }
  if (step === 'check') for (const [s] of VB_STEPS) if (s !== 'check') out.push(...vbProblems(w, s, { oneWire, metric }));
  return [...new Set(out)];
}

// the Check page: one line for each thing on the vessel
export function vbSummary(w, { metric = w.units === 'Metric', ptkName = k => k } = {}) {
  const L = [], sideW = s => s === 'left' ? 'Left' : 'Right';
  L.push(`${w.label || '(no Label)'}: ${VB_KINDS.find(([k]) => k === w.vtype)?.[0] || w.vtype}, ${+w.volume || 0} ${metric ? 'Liters' : 'Gallons'}` +
    (w.sizeMethod === 'diameter' ? `, ${w.diameter} x ${w.vheight} ${metric ? 'cm' : 'in'} (Diameter x Height)` : ', Proportional shape'));
  if (w.outlet === 'none') L.push('Outlet: none');
  else L.push(`Outlet: ${spotName(w.outlet)}` + (w.outValve === 'motor' ? `, a Motorized Ball Valve built in (Port ${w.outPin})` : w.outValve === 'none' ? ', no valve' : `, a ${VB_VALVES.find(([k]) => k === w.outValve)[1].replace(/ \(.*$/, '')} Widget on it`));
  if (w.tangential !== 'none') L.push(`Tangential Inlet: ${sideW(w.tangential)}`);
  if (w.sparge !== 'none') L.push(`Sparge Arm / Steam Slayer: Upper ${sideW(w.sparge)}`);
  const n = vbHeaters(w);
  if (!n) L.push('Heating Elements: none');
  for (let i = 1; i <= n; i++) L.push(`Heating Element ${i}: ${spotName(w[`heat${i}Spot`])} (Port ${w[`heat${i}Pin`]})`);
  if (w.probe === 'none') L.push('Temperature probe: none');
  else L.push(`${w.probe === 'front' ? 'Front probe' : 'Thermowell with its probe'}: ${spotName(vbProbeSpot(w))}, ${ptkName(w.ptk)}` +
    (w.probeIdx !== '' && w.probeIdx !== undefined && w.probeIdx !== null ? ` (OneWire probe #${w.probeIdx})` : ` (Port ${w.probePin})`));
  if (w.herms !== 'none') L.push(`HERMS Coil: ${sideW(w.herms)}`);
  return L;
}
