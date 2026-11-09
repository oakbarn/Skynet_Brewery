// ---- The Vessel Device Builder (OakBarn Brewery, 2026-11-08, Rule 19.5, Help 166). It is the same interview in the Skynet Panel and
// in the BruControl Importer ("the end result will be the same look and feel Skynet Panel or Importer"), so the questions live here,
// with no screen code. First the Question Dialog; then the Build Tab shows the vessel with its Heating Element, Thermowell and HERMS
// coil, and the dialogs for what was chosen (the Heater and Probe pickers now; the Outlet, Tangential and Sparge pieces next).

export const VB_TEMPLATE = 'Skynet_Vessel_Widget';

// the General Type of the vessel; "Other" lets the user type one, kept in the list as "USER: Hop Pot Strainer"
export const VB_GENERAL = ['HLT', 'Mash Tun', 'Brew Kettle', 'All In One', 'Whirlpool', 'Fermentor', 'Bright Tank'];
export const vbUserType = t => { const s = String(t ?? '').trim().replace(/^user:\s*/i, ''); return s ? 'USER: ' + s : ''; };

// Pick (OakBarn Brewery, 2026-11-09, Rule 5.31 changed, only during the initial build): double-click the spot on a blank vessel. Near a
// preset IP it takes that IP; anywhere else it makes a User IP on this vessel. A picked spot is kept as 'ip:<its IP key>'.
export const VB_PICK = ['pick', 'Pick (double-click the spot on the vessel)'];
export const VB_DRAIN = [['none', 'None'], ['cOutlet', 'Center Low'], ['cBottomOutlet', 'Center Bottom Drain'], VB_PICK];
export const VB_TANGENTIAL = [['none', 'None'], ['left', 'Left'], ['right', 'Right'], VB_PICK];
export const VB_SPARGE = [['none', 'None'], ['right', 'Right (High)'], ['left', 'Left (High)'], VB_PICK];
// where the Thermowell / Probe and the Heating Element go. They make no IP of their own; on an IP they close it like an End Cap.
export const VB_PROBE_SPOTS = [['none', 'None'], ['center', 'Center'], ['left', 'Left'], ['right', 'Right'], ['backLeft', 'Back Left'], ['backCenter', 'Back Center'], ['backRight', 'Back Right'], VB_PICK];
export const VB_HEAT_SPOTS = VB_PROBE_SPOTS.filter(([k]) => k !== 'center');
// HERMS Coil (no Pick); a crossed coil goes in on one side and out the other (OakBarn Brewery, 2026-11-09, Rule 5.31 changed)
export const VB_HERMS = [['none', 'None'], ['left', 'Left'], ['right', 'Right'], ['crossRL', 'Outlet Right & Inlet Left'], ['crossLR', 'Outlet Left & Inlet Right']];
const HERMS_IPS = { left: ['lHermsIn', 'lHermsOut'], right: ['rHermsIn', 'rHermsOut'], crossRL: ['lHermsIn', 'rHermsOut'], crossLR: ['rHermsIn', 'lHermsOut'] };
// the questions that can be Picked, with the name a new User IP gets
export const VB_PICKABLE = { drain: 'Picked Drain', tangential: 'Picked Tangential Inlet', sparge: 'Picked Sparge', probe: 'Picked Probe spot', heater: 'Picked Element spot', heater2: 'Picked Element spot 2' };
export const vbPicked = v => typeof v === 'string' && v.startsWith('ip:') ? v.slice(3) : '';
const SPOT_IP = { center: 'cProbe', left: 'lElement', right: 'rElement', backLeft: 'lBackElement', backCenter: 'cBackElement', backRight: 'rBackElement' };
const SIDE = { left: 'l', right: 'r' };
const spotWord = k => vbPicked(k) ? 'picked spot' : VB_PROBE_SPOTS.find(([x]) => x === k)?.[1] || k;

// a new interview's answers: a 10 gallon vessel (Rule 19.1) with nothing chosen yet but a Center Bottom Drain
export function vbStart(over = {}) {
  return { label: '', vtype: 'HLT', units: 'US', volume: 10, vheight: '', diameter: '', drain: 'cBottomOutlet', tangential: 'none', sparge: 'none',
    probe: 'none', heater: 'none', heater2: 'none', herms: 'none', ...over };
}
// the IP a spot is on
export const vbSpotIp = k => SPOT_IP[k] || vbPicked(k);
// Proportional unless both a Height and a Diameter are typed (Rule 19.2)
export const vbSizeMethod = w => +w.vheight > 0 && +w.diameter > 0 ? 'diameter' : 'proportional';
// what the Build Tab still needs picked for this vessel: { IP: 'element' | 'thermowell' | 'probe' }
export function vbWant(w) {
  const out = {};
  if (w.probe !== 'none' && vbSpotIp(w.probe)) out[vbSpotIp(w.probe)] = w.probe === 'center' || vbSpotIp(w.probe) === 'cProbe' ? 'probe' : 'thermowell';
  for (const k of [w.heater, w.heater2]) if (k && k !== 'none' && vbSpotIp(k) && !out[vbSpotIp(k)]) out[vbSpotIp(k)] = 'element';
  return out;
}
// the IPs that are Placed; every other spot is Not Placed (Rule 19.4)
export function vbPlaced(w) {
  const on = new Set(Object.keys(vbWant(w)));
  if (w.drain && w.drain !== 'none' && w.drain !== 'pick') on.add(vbPicked(w.drain) || w.drain);
  for (const [q, word] of [['tangential', 'Tangential'], ['sparge', 'Sparge']]) { const v = w[q]; if (SIDE[v]) on.add(SIDE[v] + word); else if (vbPicked(v)) on.add(vbPicked(v)); }
  for (const k of HERMS_IPS[w.herms] || []) on.add(k);
  return [...on];
}
// what is wrong (plain words), or [] when it can be built
export function vbProblems(w, { metric = w.units === 'Metric' } = {}) {
  const out = [], blank = v => v === undefined || v === null || String(v).trim() === '';
  if (blank(w.label)) out.push('Type its Label (for example HLT). The Label can not be blank.');
  if (blank(w.vtype) || w.vtype === '__add__') out.push('Pick its General Type.');
  if (!(+w.volume > 0)) out.push(`Type the Volume in ${metric ? 'Liters' : 'Gallons'} (more than 0).`);
  if ((+w.vheight > 0) !== (+w.diameter > 0)) out.push('Type both the Height and the Diameter, or leave both empty for the plain vessel shape.');
  if (w.probe !== 'none' && (w.probe === w.heater || w.probe === w.heater2)) out.push(`The Thermowell / Probe and a Heating Element are both on the ${spotWord(w.probe)}. Pick another spot for one of them.`);
  if (w.heater !== 'none' && w.heater === w.heater2) out.push(`Both Heating Elements are on the ${spotWord(w.heater)}. Pick another spot for the second one.`);
  if (w.heater === 'none' && w.heater2 !== 'none') out.push('Pick the first Heating Element before a second one.');
  for (const k of Object.keys(VB_PICKABLE)) if (w[k] === 'pick') out.push('Double-click the spot for each Pick (choose Pick again to open the vessel).');
  const ipOf = k => { const v = w[k]; if (!v || v === 'none' || v === 'pick') return ''; if (vbPicked(v)) return vbPicked(v);
    return k === 'drain' ? v : k === 'tangential' || k === 'sparge' ? (SIDE[v] || '') + (k === 'sparge' ? 'Sparge' : 'Tangential') : vbSpotIp(v); };
  const used = Object.keys(VB_PICKABLE).map(ipOf).filter(Boolean);
  if (new Set(used).size < used.length && !out.some(t => /both on/i.test(t))) out.push('Two things are on the same spot. Pick another spot for one of them.');
  return out;
}
// one line for each thing chosen
export function vbSummary(w, { metric = w.units === 'Metric' } = {}) {
  const word = (list, k) => list.find(([x]) => x === k)?.[1] || k, L = [];
  L.push(`${w.label || '(no Label)'}: ${w.vtype}, ${+w.volume || 0} ${metric ? 'Liters' : 'Gallons'}` +
    (vbSizeMethod(w) === 'diameter' ? `, ${w.diameter} ${metric ? 'cm' : 'in'} across and ${w.vheight} ${metric ? 'cm' : 'in'} high` : ', the plain vessel shape'));
  const say = (list, k) => vbPicked(k) ? 'a picked spot' : word(list, k);
  if (w.drain !== 'none') L.push(`Drain: ${say(VB_DRAIN, w.drain)}`);
  if (w.tangential !== 'none') L.push(`Tangential Inlet: ${say(VB_TANGENTIAL, w.tangential)}`);
  if (w.sparge !== 'none') L.push(`Sparge Arm / Steam Slayer: ${say(VB_SPARGE, w.sparge)}`);
  if (w.probe !== 'none') L.push(`${w.probe === 'center' ? 'Probe' : 'Thermowell'}: ${spotWord(w.probe)}`);
  for (const k of [w.heater, w.heater2]) if (k !== 'none') L.push(`Heating Element: ${spotWord(k)}`);
  if (w.herms !== 'none') L.push(`HERMS Coil: ${word(VB_HERMS, w.herms)}`);
  return L;
}

// ---- Step 2: the pieces on each opening (OakBarn Brewery, 2026-11-08, Rule 19.5). Drain and Tangential: up to 3 pieces running out
// from the vessel, None, Valve, Elbow, Tee or Priming Tee (a Tangential has no Priming Tee); None ends the chain, so the next choice is
// greyed out. Sparge Arm: drawn inside the vessel, opposite its IP, with its own chain outside (no Priming Tee).
export const VB_PIECES = [['none', 'None'], ['valve', 'Valve'], ['elbow', 'Elbow'], ['tee', 'Tee'], ['primingTee', 'Priming Tee']];
export const VB_PIECE_TPL = { elbow: 'Elbow_90', tee: 'Tee', primingTee: 'Priming_Tee' };
export const VB_OPENING_WORD = { drain: 'Drain', tangential: 'Tangential Inlet', sparge: 'Sparge Arm' };
export const vbPieceList = opening => opening === 'drain' ? VB_PIECES : VB_PIECES.filter(([k]) => k !== 'primingTee');
// the openings that get pieces: { IP: 'drain' | 'tangential' | 'sparge' }
export function vbOpenings(w) {
  const out = {}, ipOf = (q, word) => { const v = w[q]; return vbPicked(v) || (q === 'drain' ? v : SIDE[v] ? SIDE[v] + word : ''); };
  for (const [q, word] of [['drain', ''], ['tangential', 'Tangential'], ['sparge', 'Sparge']]) { const k = w[q] && w[q] !== 'none' && w[q] !== 'pick' ? ipOf(q, word) : ''; if (k) out[k] = q; }
  return out;
}
// the pieces kept: up to 3, ending at the first None
export function vbChainClean(list) {
  const out = [];
  for (const p of (list || []).slice(0, 3)) { if (!p || p === 'none') break; out.push(p); }
  return out;
}
// which way each piece runs: 'v' (up and down) or 'h' (level); an Elbow turns it. The Priming Tee always points up, so its run is level.
export function vbChainProblems(pieces, start, opening) {
  const out = []; let dir = start;
  for (const [i, p] of vbChainClean(pieces).entries()) {
    if (!vbPieceList(opening).some(([k]) => k === p)) out.push(`Piece ${i + 1}: a ${VB_OPENING_WORD[opening]} can not have a ${p === 'primingTee' ? 'Priming Tee' : p}.`);
    if (p === 'primingTee' && dir !== 'h') out.push(`Piece ${i + 1}: the Priming Tee always points up, so it only goes in a level run. Put an Elbow before it.`);
    if (p === 'elbow') dir = dir === 'v' ? 'h' : 'v';
  }
  return out;
}
