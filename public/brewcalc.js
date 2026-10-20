// Brewing lists and sums shared by the browser and the Brain (lib/equipment.js and lib/profiles.js import this file too).

// Equipment Profile settings: [key, label, US unit, Metric unit, US default, Metric default]
// (Fritz, 2026-10-20: batch size and top up water belong to the Recipe, boil time and boil off to the Boil Profile,
//  sizes and dead space to each vessel, fermenter trub loss to the fermenter)
export const EQUIP_FIELDS = [
  ['trubChillerLoss', 'System Loss (Trub, Chiller Manifold and Hoses)', 'gal', 'L', 0.5, 2],
  ['coolingShrinkage', 'Cooling shrinkage', '%', '%', 4, 4],
  ['grainAbsorption', 'Grain absorption', 'gal/lb', 'L/kg', 0.12, 1],
  ['brewhouseEfficiency', 'Brewhouse efficiency', '%', '%', 72, 72],
  ['hopUtilization', 'Hop utilization', '%', '%', 100, 100],
];
export const UNIT_SYSTEMS = { US: 'US (gallons, pounds, °F)', Metric: 'Metric (liters, kilograms, °C)' };
export const volUnit = units => units === 'Metric' ? 'L' : 'gal';
export const tempUnit = units => units === 'Metric' ? '°C' : '°F';

// Vessel types and the heat sources each one can have (Fritz, 2026-10-20)
export const HEAT_KINDS = { gas: 'Gas', electric: 'Electric', rims: 'RIMS', herms: 'HERMS', other: 'Other', unheated: 'Unheated' };
export const VESSEL_TYPES = {
  HLT: ['gas', 'electric', 'other'],
  'Brew Kettle': ['gas', 'electric', 'other'],
  'Mash Tun': ['gas', 'electric', 'rims', 'herms', 'other', 'unheated'],
  RIMS: ['gas', 'electric', 'other'],
  HERMS: ['gas', 'electric', 'other'],
  Fermenter: [],
  Other: ['gas', 'electric', 'rims', 'other', 'unheated'],
  MLT: ['gas', 'electric', 'rims', 'herms', 'other', 'unheated'],        // older names, kept for vessels made before
  Whirlpool: ['gas', 'electric', 'other', 'unheated'],
};
export const heatKindsFor = vtype => VESSEL_TYPES[vtype] ?? VESSEL_TYPES.Other;
export const REPORT_UNITS = { min: 'Minutes', hr: 'Hours', day: 'Days' };
// what a valve carries (a gas valve can be a heat source)
export const VALVE_SERVICE = { gas: 'Gas', room: 'Room Temperature Liquid', hot: 'High Temperature Liquid (Stainless Steel)' };
export const SPARGE = { fly: 'Fly sparge', batch: 'Batch sparge (with a rest time)', none: 'No sparge (full volume)' };
export const MASH_STEPS = 4;

const n = v => Number.isFinite(+v) ? +v : 0;
const r2 = v => Math.round(v * 100) / 100;

// Brew day volumes, from the batch size back to the pre-boil volume (as BeerSmith does).
// b: { batchSize, topUpKettle, topUpFermenter, fermenterLoss } from the Recipe and fermenter, boilTime and boilOffRate from the
// Boil Profile, trubChillerLoss (System Loss) and coolingShrinkage from the Equipment Profile, kettleVolume from the kettle.
export function brewVolumes(b = {}) {
  const intoFermenter = n(b.batchSize) - n(b.topUpFermenter);
  const shrink = Math.min(Math.max(n(b.coolingShrinkage), 0), 50) / 100;
  const postBoil = (intoFermenter + n(b.trubChillerLoss)) / (1 - shrink);
  const boilOff = n(b.boilOffRate) * n(b.boilTime) / 60;
  const preBoil = postBoil + boilOff - n(b.topUpKettle);
  const bottling = n(b.batchSize) - n(b.fermenterLoss);
  const out = { intoFermenter: r2(intoFermenter), postBoil: r2(postBoil), boilOff: r2(boilOff), preBoil: r2(preBoil), bottling: r2(bottling) };
  const warnings = [];
  if (n(b.kettleVolume) && preBoil > n(b.kettleVolume)) warnings.push(`The pre-boil volume (${out.preBoil}) is more than the kettle holds (${n(b.kettleVolume)}).`);
  if (n(b.fermenterVolume) && n(b.batchSize) > n(b.fermenterVolume)) warnings.push(`The batch (${n(b.batchSize)}) is more than the fermenter holds (${n(b.fermenterVolume)}).`);
  if (intoFermenter <= 0) warnings.push('The batch size must be more than the fermenter top up water.');
  return { ...out, warnings };
}
// the old name, used before the Boil Profile and Recipe took their numbers
export const equipVolumes = brewVolumes;
// the kettle and fermenter of an Equipment Profile (their sizes go into the sums above)
export const firstOfType = (p, ...types) => (p?.equipment || []).find(e => types.includes(e.vtype));
