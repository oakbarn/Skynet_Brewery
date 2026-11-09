// ---- The Vessel Device Builder (OakBarn Brewery, 2026-11-08, Rule 19.5, Help 166). It is the same interview in the Skynet Panel and
// in the BruControl Importer ("the end result will be the same look and feel Skynet Panel or Importer"), so the questions live here,
// with no screen code. First the Question Dialog; then the Build Tab shows the vessel with its Heating Element, Thermowell and HERMS
// coil, and the dialogs for what was chosen (the Heater and Probe pickers now; the Outlet, Tangential and Sparge pieces next).

export const VB_TEMPLATE = 'Skynet_Vessel_Widget';

// the General Type of the vessel; "Other" lets the user type one, kept in the list as "USER: Hop Pot Strainer"
export const VB_GENERAL = ['HLT', 'Mash Tun', 'Brew Kettle', 'All In One', 'Whirlpool', 'Fermentor', 'Bright Tank'];
export const vbUserType = t => { const s = String(t ?? '').trim().replace(/^user:\s*/i, ''); return s ? 'USER: ' + s : ''; };

export const VB_DRAIN = [['none', 'None'], ['cOutlet', 'Center Low'], ['cBottomOutlet', 'Center Bottom Drain']];
export const VB_TANGENTIAL = [['none', 'None'], ['left', 'Left'], ['right', 'Right']];
export const VB_SPARGE = [['none', 'None'], ['right', 'Right (High)'], ['left', 'Left (High)']];
// where the Thermowell / Probe and the Heating Element go. They make no IP of their own; on an IP they close it like an End Cap.
export const VB_PROBE_SPOTS = [['none', 'None'], ['center', 'Center'], ['left', 'Left'], ['right', 'Right'], ['backLeft', 'Back Left'], ['backRight', 'Back Right']];
export const VB_HEAT_SPOTS = VB_PROBE_SPOTS.filter(([k]) => k !== 'center');
export const VB_HERMS = [['none', 'None'], ['left', 'Left'], ['right', 'Right']];
const SPOT_IP = { center: 'cProbe', left: 'lElement', right: 'rElement', backLeft: 'lBackElement', backRight: 'rBackElement' };
const SIDE = { left: 'l', right: 'r' };
const spotWord = k => VB_PROBE_SPOTS.find(([x]) => x === k)?.[1] || k;

// a new interview's answers: a 10 gallon vessel (Rule 19.1) with nothing chosen yet but a Center Bottom Drain
export function vbStart(over = {}) {
  return { label: '', vtype: 'HLT', units: 'US', volume: 10, vheight: '', diameter: '', drain: 'cBottomOutlet', tangential: 'none', sparge: 'none',
    probe: 'none', heater: 'none', heater2: 'none', herms: 'none', ...over };
}
// the IP a spot is on
export const vbSpotIp = k => SPOT_IP[k] || '';
// Proportional unless both a Height and a Diameter are typed (Rule 19.2)
export const vbSizeMethod = w => +w.vheight > 0 && +w.diameter > 0 ? 'diameter' : 'proportional';
// what the Build Tab still needs picked for this vessel: { IP: 'element' | 'thermowell' | 'probe' }
export function vbWant(w) {
  const out = {};
  if (w.probe !== 'none' && SPOT_IP[w.probe]) out[SPOT_IP[w.probe]] = w.probe === 'center' ? 'probe' : 'thermowell';
  for (const k of [w.heater, w.heater2]) if (k && k !== 'none' && SPOT_IP[k] && !out[SPOT_IP[k]]) out[SPOT_IP[k]] = 'element';
  return out;
}
// the IPs that are Placed; every other spot is Not Placed (Rule 19.4)
export function vbPlaced(w) {
  const on = new Set(Object.keys(vbWant(w)));
  if (w.drain && w.drain !== 'none') on.add(w.drain);
  if (SIDE[w.tangential]) on.add(SIDE[w.tangential] + 'Tangential');
  if (SIDE[w.sparge]) on.add(SIDE[w.sparge] + 'Sparge');
  if (SIDE[w.herms]) { on.add(SIDE[w.herms] + 'HermsIn'); on.add(SIDE[w.herms] + 'HermsOut'); }
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
  return out;
}
// one line for each thing chosen
export function vbSummary(w, { metric = w.units === 'Metric' } = {}) {
  const word = (list, k) => list.find(([x]) => x === k)?.[1] || k, L = [];
  L.push(`${w.label || '(no Label)'}: ${w.vtype}, ${+w.volume || 0} ${metric ? 'Liters' : 'Gallons'}` +
    (vbSizeMethod(w) === 'diameter' ? `, ${w.diameter} ${metric ? 'cm' : 'in'} across and ${w.vheight} ${metric ? 'cm' : 'in'} high` : ', the plain vessel shape'));
  if (w.drain !== 'none') L.push(`Drain: ${word(VB_DRAIN, w.drain)}`);
  if (w.tangential !== 'none') L.push(`Tangential Inlet: ${word(VB_TANGENTIAL, w.tangential)}`);
  if (w.sparge !== 'none') L.push(`Sparge Arm / Steam Slayer: ${word(VB_SPARGE, w.sparge)}`);
  if (w.probe !== 'none') L.push(`${w.probe === 'center' ? 'Probe' : 'Thermowell'}: ${spotWord(w.probe)}`);
  for (const k of [w.heater, w.heater2]) if (k !== 'none') L.push(`Heating Element: ${spotWord(k)}`);
  if (w.herms !== 'none') L.push(`HERMS Coil: ${word(VB_HERMS, w.herms)}`);
  return L;
}
