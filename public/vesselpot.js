// ---- The Stainless Pot Vessel Builder (2026-11-27, Rule 19.13, Help 166). Every vessel, in the Setup Interview and in Add a Vessel on
// the 🔨 Build Tab, is built from one plain stainless pot ("build from a single stainless pot with graphic proportional to the H & D";
// "make it a plain vessel and we will add every IP and Other Devices. The real first question needs to be the Height and Diameter").
// Each part is placed by its height off the inside bottom, the heights measured on real kettles ("regardless of the size of kettle").
// No screen code here: the questions, where each part goes on the picture, and the picture itself.

export const POT_TEMPLATE = 'Skynet_Stainless_Pot';
const IN = 1, CM = 2.54;
// the measured heights, in inches off the inside bottom
export const POT_IN = {
  outletLow: 2,          // "Center Low: I measured several and regardless of the size of kettle generally about 2 in off Bottom"
  skirt: 6,              // "Center Bottom Drain: in a 6 in skirt with the drain centered in the skirt"
  probe: 5.5,            // "about 5.5 in off the bottom directly above the Outlet regardless of vessel size"
  tangential: 1.5,       // "Average about 1.5 inches off bottom on the left side"
  sightBottom: 1,        // "Bottom IP 1 in off Bottom"
  sightTop: 1,           // "Top IP directly above, 1 in off Top"
  volSensor: 1,          // "1 in off bottom"
  heater: 4,             // a Heater's Height above Bottom starts here; the user types the real one
  sparge: 2,             // Sparge Return and Steam Slayer: High, this far down from the top
  steamSlayer: 4,
  rim: 1, handle: 1.2,   // the picture: the rim above the pot and a handle out each side
  wallIn: 1.8,           // a port near a wall sits this far in from it on the picture
};
// the Valve on the Outlet and the Tangential (the same 6 for both, in this order)
export const POT_VALVES = [['mballElbow', 'Manual Ball Valve with Elbow'], ['motorElbow', 'Motorized Ball Valve with Elbow'], ['bflyElbow', 'Manual Butterfly Valve with Elbow'],
  ['mball', 'Manual Ball Valve'], ['motor', 'Motorized Ball Valve'], ['bfly', 'Manual Butterfly Valve']];
// a Mash Tun's False Bottom (2026-11-27 8:32 PM): its Height above the Bottom. The Outlet is below it, so the Outlet keeps its usual height
// ("the Outlet is below the false bottom so the standard height is probably correct"); blank = none
export const potIsMash = w => /mash/i.test(String(w.vtype || ''));
export const potFalseBottom = w => potIsMash(w) && +w.falseBottom > 0 ? +w.falseBottom : 0;
export const POT_OUTLET = [['low', 'Center Low (about 2 in off the bottom)'], ['bottom', 'Center Bottom Drain (in a 6 in skirt, the drain centered in it)'], ['none', 'None']];
// "Center above Outlet 1st as 99% correct", then all the other choices
export const POT_PROBE = [['centerOut', 'Center above the Outlet (about 5.5 in off the bottom)'], ['left', 'Left'], ['right', 'Right'], ['backLeft', 'Back Left'],
  ['backCenter', 'Back Center'], ['backRight', 'Back Right'], ['none', 'None']];
// Temperature (2026-11-27 8:29 PM): an Analog Gauge or an Electronic probe (its Probe Type from the drop down of every type), each in a
// Thermowell or Direct. The place is the list above.
export const POT_TEMP = [['electronic', 'Electronic'], ['analog', 'Analog Gauge'], ['none', 'None']];
export const POT_TEMP_MOUNT = [['thermowell', 'Thermowell'], ['direct', 'Direct']];
export const potHasTemp = w => w.tempKind !== 'none' && w.probe !== 'none';
// Level or Float 1 and 2 (2026-11-27 8:29 PM): its Location, its Height from the Bottom, Normally Closed or Normally Open
export const POT_FLOAT_LOC = [['none', 'None'], ['left', 'Left'], ['right', 'Right'], ['front', 'Front'], ['back', 'Back']];
export const POT_FLOAT_NC = [['nc', 'Normally Closed'], ['no', 'Normally Open']];
// "on the left side every one so make that first choice"
export const POT_TANGENTIAL = [['left', 'Left Low (about 1.5 in off the bottom)'], ['right', 'Right Low'], ['none', 'None']];
export const POT_SIGHT = [['left', 'Left'], ['right', 'Right'], ['none', 'None']];
export const POT_VOLSENSOR = [['right', 'Right Side'], ['left', 'Left Side'], ['back', 'Back Centered'], ['none', 'None']];
export const POT_HEAT = [['element', 'Electric Heating Element(s)'], ['gas', 'Gas Burner'], ['none', 'Not heated']];
export const POT_HEATER = [['backRight', 'Back Right, 2 in TC'], ['backLeft', 'Back Left, 2 in TC'], ['none', 'None']];
export const POT_GAS = [['ng', 'Natural Gas'], ['hplp', 'High Pressure Propane'], ['lplp', 'Low Pressure Propane']];
export const POT_IGNITER = [['none', '(none)'], ['flat', 'Flat Plate (no Safety)'], ['pilotValve', 'Pilot with Valve Control'], ['pilot', 'Pilot (no Safety)']];
// "Big Warning on Gas to follow all safety precautions. And they are responsible for all Safety when using Gas. It can Kill or cause a
// Fire" (2026-11-27, "I think that is good"), then the gas warning of 2026-11-14 (public/flameout.js)
export const POT_GAS_WARNING = '⚠ Gas can kill or cause a fire. Follow every gas safety precaution. You are responsible for all safety when using gas. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.';
export const POT_SPARGE = [['right', 'High Right'], ['left', 'High Left'], ['none', 'None']];
export const POT_SPARGE_SHUT = [['none', '(none)'], ['mball', 'Manual Ball Valve'], ['motor', 'Motorized Ball Valve']];
export const POT_SPARGE_TEE = [['none', '(none)'], ['instrument', 'Instrument Tee'], ['long', 'Long Tee']];
// HERMS Coil (Immersion) (2026-11-27): its metal, then where its Inlet and Outlet are; on one side, is the Inlet High or Low
export const POT_HERMS = [['none', 'None'], ['lr', 'Inlet Left, Outlet Right'], ['rl', 'Inlet Right, Outlet Left'], ['rr', 'Inlet Right, Outlet Right'], ['ll', 'Inlet Left, Outlet Left']];
export const POT_HERMS_MAT = [['copper', 'Copper'], ['stainless', 'Stainless']];
export const POT_HERMS_IN = [['high', 'Inlet High'], ['low', 'Inlet Low']];
// the coil's two IPs, from its Inlet and Outlet sides: [inlet key, outlet key] (the panel's HERMS_SIDES has the same)
export const potHermsKeys = v => v && v !== 'none' ? [v[0] + 'PotHermsIn', v[1] + 'PotHermsOut'] : [];
export const POT_STEAM = [['right', 'High Right'], ['left', 'High Left'], ['none', 'None']];
export const POT_REDUCER = [['none', '(None)'], ['reducer', '2 in to 1.5 in Reducer']];
// Additional IPs: "All Positions not already Occupied from above", each with its IP Type
export const POT_IP_TYPES = [['', '(none)'], ['TC 1.5', '1.5 TC'], ['TC 2', '2.0 TC'], ['TC 3/4', '3/4 TC'], ['TC 1/2', '1/2 TC'], ['BSP 1/2', '1/2 BSP'],
  ['NPT 1/2 MPT', '1/2 MPT'], ['NPT 1/2 FPT', '1/2 FPT']];
// the places of the Vessel Layout (the Front and the Back have the same ones): [key, words, across 0 left .. 1 right as you face it,
// height: 'high' | 'mid' | 'midLow' | 'low']
export const POT_PLACES = [['hl', 'High Left', 0, 'high'], ['hr', 'High Right', 1, 'high'], ['ml', 'Middle Left', 0, 'mid'], ['mr', 'Middle Right', 1, 'mid'],
  ['mll', 'Mid Low Left', 0.2, 'midLow'], ['mlc', 'Mid Low Center', 0.5, 'midLow'], ['mlr', 'Mid Low Right', 0.8, 'midLow'],
  ['ll', 'Low Left', 0, 'low'], ['lc', 'Low Center', 0.5, 'low'], ['lr', 'Low Right', 1, 'low']];
export const POT_SIDES = [['f', 'Front'], ['b', 'Back']];

// a new builder's answers: the first choice of each ("make that first choice")
export function potStart(over = {}) {
  return { label: '', vtype: 'Brew Kettle', units: 'US', vheight: '', diameter: '', outlet: 'low', outletValve: 'mballElbow', tempKind: 'electronic', probeType: '', tempMount: 'thermowell', probe: 'centerOut',
    tangential: 'left', tangentialValve: 'mballElbow', sight: 'none', volSensor: 'none', heat: 'none', heater: 'backRight', heaterHt: POT_IN.heater,
    heater2: 'none', heater2Ht: POT_IN.heater, gas: 'ng', igniter: 'none', sparge: 'none', spargeShut: 'none', spargeTee: 'none', steam: 'none',
    steamReducer: 'none', falseBottom: '', float1: 'none', float1Ht: '', float1Nc: 'nc', float2: 'none', float2Ht: '', float2Nc: 'nc', herms: 'none', hermsMat: 'copper', hermsIn: 'high', fctl: 'none', extras: {}, ...over };
}
const metricOf = w => w.units === 'Metric';
// a measured height in the vessel's own units
const len = (w, inches) => metricOf(w) ? inches * CM : inches * IN;
const skirtOf = w => w.outlet === 'bottom' ? len(w, POT_IN.skirt) : 0;
// the picture's box: the rim above, the pot, its skirt; a handle out each side. Width and height in the vessel's units.
export function potBox(w) {
  const H = +w.vheight, D = +w.diameter; if (!(H > 0 && D > 0)) return null;
  const rim = len(w, POT_IN.rim), hand = len(w, POT_IN.handle);
  return { H, D, rim, hand, skirt: skirtOf(w), W: D + 2 * hand, T: rim + H + skirtOf(w) };
}
// the shape of its box, Height / Width
export const potAspect = w => { const b = potBox(w); return b ? b.T / b.W : 1.2; };
// where a spot is on the picture (0..1 of its box): across (0 the left wall, 1 the right wall, as you face it) and inches off the bottom
function at(w, across, up) {
  const b = potBox(w), x = (b.hand + across * b.D) / b.W, y = (b.rim + b.H - up) / b.T;
  return { x: +x.toFixed(4), y: +y.toFixed(4) };
}
// a port near a wall sits a little in from it
const nearWall = (w, side) => { const b = potBox(w), d = Math.min(0.45, len(w, POT_IN.wallIn) / b.D); return side === 'left' ? d : 1 - d; };
const SIDE_OF = { left: 'left', right: 'right', backLeft: 'left', backRight: 'right' };
// the back spots sit a quarter in from each wall (behind the front ones)
const backAcross = k => ({ backLeft: 0.25, backCenter: 0.5, backRight: 0.75, back: 0.5 }[k]);
const heightOf = (w, h) => { const b = potBox(w); return { high: b.H - len(w, POT_IN.sparge), mid: b.H / 2, midLow: b.H / 4, low: len(w, POT_IN.outletLow) }[h]; };
// every spot the answers use: { key, name, part, x, y, std, back }. key is the IP key on the vessel.
export function potSpots(w) {
  const b = potBox(w); if (!b) return [];
  const out = [], add = (key, name, part, p, extra = {}) => out.push({ key, name, part, ...p, ...extra });
  if (w.outlet === 'low') add('outlet', 'Outlet', 'outlet', at(w, 0.5, len(w, POT_IN.outletLow)));
  if (w.outlet === 'bottom') add('outlet', 'Bottom Drain', 'outlet', { x: 0.5, y: +((b.rim + b.H + b.skirt / 2) / b.T).toFixed(4) });
  if (potHasTemp(w)) {
    const across = w.probe === 'centerOut' ? 0.5 : SIDE_OF[w.probe] && !w.probe.startsWith('back') ? nearWall(w, w.probe) : backAcross(w.probe);
    const name = w.tempKind === 'analog' ? 'Temperature Gauge' : 'Temperature Probe', part = w.tempKind === 'analog' ? 'gauge' : 'probe';
    add('probe', name, part, at(w, across, len(w, POT_IN.probe)), { back: w.probe.startsWith('back'), mount: w.tempMount === 'direct' ? 'direct' : 'thermowell' });
  }
  if (w.tangential !== 'none') add('tangential', 'Tangential Inlet', 'tangential', at(w, nearWall(w, w.tangential), len(w, POT_IN.tangential)));
  if (w.sight !== 'none') {
    const x = nearWall(w, w.sight) + (w.sight === 'left' ? 1 : -1) * Math.min(0.1, len(w, 2) / b.D);
    add('sightBottom', 'Sight Gauge Bottom', 'sight', at(w, x, len(w, POT_IN.sightBottom)));
    add('sightTop', 'Sight Gauge Top', 'sight', at(w, x, b.H - len(w, POT_IN.sightTop)));
  }
  if (w.volSensor !== 'none') add('volSensor', 'Volume Sensor', 'volSensor', at(w, w.volSensor === 'back' ? 0.5 : nearWall(w, w.volSensor), len(w, POT_IN.volSensor)), { back: w.volSensor === 'back', std: 'TC 1.5' });
  for (const n of [1, 2]) {
    const loc = w['float' + n]; if (!loc || loc === 'none' || !(+w[`float${n}Ht`] > 0)) continue;
    const across = loc === 'left' || loc === 'right' ? nearWall(w, loc) : 0.5;
    add('float' + n, `Level or Float ${n}`, 'float', at(w, across, +w[`float${n}Ht`]), { back: loc === 'back', nc: w[`float${n}Nc`] !== 'no' });
  }
  if (w.heat === 'element') for (const [k, ht, n] of [['heater', 'heaterHt', 1], ['heater2', 'heater2Ht', 2]]) {
    if (w[k] === 'none' || !w[k]) continue;
    add('element' + n, `Heater ${n}`, 'element', at(w, backAcross(w[k]), +w[ht] > 0 ? +w[ht] : len(w, POT_IN.heater)), { back: true, std: 'TC 2' });
  }
  if (w.herms && w.herms !== 'none') {      // the coil sits in the middle; across the vessel the Inlet is High
    const [ki, ko] = potHermsKeys(w.herms), hi = b.H * 0.55, lo = b.H * 0.3, same = w.herms[0] === w.herms[1], inHigh = !same || w.hermsIn !== 'low';
    add(ki, 'HERMS Inlet', 'herms', at(w, nearWall(w, w.herms[0] === 'l' ? 'left' : 'right'), inHigh ? hi : lo));
    add(ko, 'HERMS Outlet', 'herms', at(w, nearWall(w, w.herms[1] === 'l' ? 'left' : 'right'), inHigh ? lo : hi));
  }
  if (w.sparge !== 'none') add('sparge', 'Sparge Return', 'sparge', at(w, nearWall(w, w.sparge), b.H - len(w, POT_IN.sparge)));
  if (w.steam !== 'none') add('steamSlayer', 'Steam Slayer', 'steamSlayer', at(w, nearWall(w, w.steam), b.H - len(w, POT_IN.steamSlayer)), { std: 'TC 2' });
  // Additional IPs on the places not already taken
  for (const [key, std] of Object.entries(w.extras || {})) {
    if (!std) continue;
    const [side, place] = [key[0], key.slice(1)], p = POT_PLACES.find(([k]) => k === place); if (!p || !POT_SIDES.some(([s]) => s === side)) continue;
    const across = side === 'b' ? 0.25 + p[2] * 0.5 : p[2] === 0 || p[2] === 1 ? nearWall(w, p[2] ? 'right' : 'left') : p[2];
    add('x' + key, `${POT_SIDES.find(([s]) => s === side)[1]} ${p[1]}`, 'extra', at(w, across, heightOf(w, p[3])), { back: side === 'b', std });
  }
  return out;
}
// the places of the Vessel Layout a part already takes (so Additional IPs are only offered on the others)
export function potTaken(w) {
  const t = new Set();
  if (w.outlet === 'low') t.add('flc');
  if (!potHasTemp(w)) { /* no temperature spot */ } else if (w.probe === 'centerOut') t.add('fmlc'); else if (w.probe === 'left') t.add('fll'); else if (w.probe === 'right') t.add('flr');
  else if (w.probe === 'backLeft') t.add('bmll'); else if (w.probe === 'backCenter') t.add('bmlc'); else if (w.probe === 'backRight') t.add('bmlr');
  if (w.tangential === 'left') t.add('fll'); if (w.tangential === 'right') t.add('flr');
  if (w.volSensor === 'back') t.add('blc'); else if (w.volSensor === 'left') t.add('bll'); else if (w.volSensor === 'right') t.add('blr');
  if (w.heat === 'element') for (const k of [w.heater, w.heater2]) { if (k === 'backLeft') t.add('bmll'); if (k === 'backRight') t.add('bmlr'); }
  if (w.sparge === 'left') t.add('fhl'); if (w.sparge === 'right') t.add('fhr');
  if (w.herms && w.herms !== 'none') for (const c of w.herms.slice(0, 2)) t.add(c === 'l' ? 'fml' : 'fmr');
  if (w.steam === 'left') t.add('fhl'); if (w.steam === 'right') t.add('fhr');
  return t;
}
export const potFreePlaces = w => { const t = potTaken(w); return POT_SIDES.flatMap(([s, sw]) => POT_PLACES.map(([k, pw]) => [s + k, `${sw} ${pw}`])).filter(([k]) => !t.has(k)); };
// what is wrong (plain words), or [] when it can be built
export function potProblems(w) {
  const out = [], u = metricOf(w) ? 'cm' : 'inches', blank = v => v === undefined || v === null || String(v).trim() === '';
  if (!(+w.vheight > 0) || !(+w.diameter > 0)) out.push(`Type the Height and the Diameter (${u}, more than 0): they come first, and the vessel is drawn and sized from them.`);
  if (blank(w.label)) out.push('Type its Label (for example HLT). The Label can not be blank.');
  if (w.sparge !== 'none' && w.sparge === w.steam) out.push('The Sparge Return and the Steam Slayer are both High on the same side. Put one on the other side.');
  if (w.heat === 'element') {
    if (w.heater === 'none' && w.heater2 !== 'none') out.push('Pick Heater 1 before Heater 2.');
    if (w.heater !== 'none' && w.heater === w.heater2) out.push('Heater 1 and Heater 2 are on the same side. Put Heater 2 on the other side.');
    for (const [k, ht, n] of [['heater', 'heaterHt', 1], ['heater2', 'heater2Ht', 2]]) if (w[k] !== 'none' && !(+w[ht] > 0 && +w[ht] < +w.vheight)) out.push(`Type Heater ${n}'s Height above the Bottom (${u}, more than 0 and below the Height).`);
  }
  if (w.fctl && w.fctl !== 'none' && (!potHasTemp(w) || w.tempKind === 'analog')) out.push('A Fermentor Control needs an Electronic Temperature probe: pick it and where it is.');
  if (potIsMash(w) && String(w.falseBottom ?? '').trim() !== '' && !(+w.falseBottom >= 0 && +w.falseBottom < +w.vheight)) out.push(`The False Bottom's Height above the Bottom is ${u}, 0 or more and below the Height (blank: none).`);
  for (const n of [1, 2]) if (w['float' + n] && w['float' + n] !== 'none' && !(+w[`float${n}Ht`] > 0 && +w[`float${n}Ht`] < +w.vheight)) out.push(`Type Level or Float ${n}'s Height from the Bottom (${u}, more than 0 and below the Height).`);
  return out;
}
// the vessel's picture, drawn to its Height and Diameter (the Skynet way: flat grey #808080, black outline, Rule 7.4). The ports and
// the parts on them are drawn by the panel.
export function potSvg(w) {
  const b = potBox(w) || potBox({ ...w, vheight: 27, diameter: 22, units: 'US' }), s = 240 / b.W, W = 240, T = +(b.T * s).toFixed(1), f = n => +n.toFixed(1);
  const x0 = f(b.hand * s), x1 = f((b.hand + b.D) * s), y0 = f(b.rim * s), y1 = f(Math.min((b.rim + b.H) * s, T - (b.skirt ? 6 : 1.5))), r = f(Math.min(8, b.D * s * 0.04));
  const hy = f(y0 + Math.min(b.H * s * 0.12, 4 * (metricOf(w) ? CM : IN) * s)), hw = f(b.hand * s), hh = f(Math.max(6, hw * 0.55));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${T}" preserveAspectRatio="none">` +
    (b.skirt ? `<rect x="${f(x0 + 3)}" y="${f(y1 - 4)}" width="${f(x1 - x0 - 6)}" height="${f(T - y1 + 2.5)}" rx="3" fill="#808080" stroke="#111" stroke-width="3"/>` : '') +
    `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="${r}" fill="#808080" stroke="#111" stroke-width="3"/>` +
    (potFalseBottom(w) ? `<path d="M${f(x0 + 4)} ${f((b.rim + b.H - potFalseBottom(w)) * s)} H${f(x1 - 4)}" stroke="#111" stroke-width="2.5" stroke-dasharray="7 4"/>` : '') +
    `<path d="M${f(x0 + 9)} ${f(y0 + 12)} V${f(y0 + (y1 - y0) * 0.68)}" stroke="#9a9a9a" stroke-width="5" stroke-linecap="round"/>` +
    `<rect x="${f(x0 - 7)}" y="2" width="${f(x1 - x0 + 14)}" height="${f(Math.max(8, y0))}" rx="4" fill="#808080" stroke="#111" stroke-width="3"/>` +
    `<rect x="1.5" y="${hy}" width="${hw}" height="${hh}" rx="3" fill="#808080" stroke="#111" stroke-width="2.5"/>` +
    `<rect x="${x1}" y="${hy}" width="${f(hw - 1.5)}" height="${hh}" rx="3" fill="#808080" stroke="#111" stroke-width="2.5"/>` +
    '</svg>';
}
// one line for each thing chosen
export function potSummary(w) {
  const word = (list, k) => list.find(([x]) => x === k)?.[1] || k, u = metricOf(w) ? 'cm' : 'in', L = [];
  L.push(`${w.label || '(no Label)'}: ${w.vtype}, ${w.diameter || '?'} ${u} across and ${w.vheight || '?'} ${u} high`);
  if (w.outlet !== 'none') L.push(`Outlet: ${word(POT_OUTLET, w.outlet)}, ${word(POT_VALVES, w.outletValve)}`);
  if (potFalseBottom(w)) L.push(`False Bottom: ${potFalseBottom(w)} ${u} above the bottom`);
  if (potHasTemp(w)) L.push(`Temperature: ${word(POT_TEMP, w.tempKind)}${w.tempKind === 'electronic' && w.probeType ? ' ' + w.probeType : ''}, ${word(POT_TEMP_MOUNT, w.tempMount)}, ${word(POT_PROBE, w.probe)}`);
  for (const n of [1, 2]) if (w['float' + n] && w['float' + n] !== 'none') L.push(`Level or Float ${n}: ${word(POT_FLOAT_LOC, w['float' + n])}, ${w[`float${n}Ht`]} ${u} from the bottom, ${word(POT_FLOAT_NC, w[`float${n}Nc`])}`);
  if (w.tangential !== 'none') L.push(`Tangential Inlet: ${word(POT_TANGENTIAL, w.tangential)}, ${word(POT_VALVES, w.tangentialValve)}`);
  if (w.sight !== 'none') L.push(`Sight Gauge: ${word(POT_SIGHT, w.sight)}`);
  if (w.volSensor !== 'none') L.push(`Volume Pressure Sensor: ${word(POT_VOLSENSOR, w.volSensor)}`);
  if (w.heat === 'element') for (const [k, ht, n] of [['heater', 'heaterHt', 1], ['heater2', 'heater2Ht', 2]]) if (w[k] !== 'none') L.push(`Heater ${n}: ${word(POT_HEATER, w[k])}, ${w[ht]} ${u} above the bottom`);
  if (w.heat === 'gas') L.push(`Gas Burner: ${word(POT_GAS, w.gas)}, Igniter ${word(POT_IGNITER, w.igniter)}`);
  if (w.sparge !== 'none') L.push(`Sparge Return: ${word(POT_SPARGE, w.sparge)}; shutoff ${word(POT_SPARGE_SHUT, w.spargeShut)}; tee ${word(POT_SPARGE_TEE, w.spargeTee)}`);
  if (w.steam !== 'none') L.push(`Steam Slayer 2 in: ${word(POT_STEAM, w.steam)}${w.steamReducer === 'reducer' ? ', 2 in to 1.5 in Reducer' : ''}`);
  if (w.herms && w.herms !== 'none') L.push(`HERMS Coil: ${word(POT_HERMS_MAT, w.hermsMat)}, ${word(POT_HERMS, w.herms)}${w.herms[0] === w.herms[1] ? ', ' + word(POT_HERMS_IN, w.hermsIn) : ''}`);
  const x = Object.entries(w.extras || {}).filter(([, v]) => v); if (x.length) L.push(`Additional IPs: ${x.map(([k, v]) => `${potFreePlaces({}).find(([p]) => p === k)?.[1] || k} ${word(POT_IP_TYPES, v)}`).join(', ')}`);
  return L;
}
