// Brewing sums shared by the browser and the Brain (lib/equipment.js imports this file too).
// Equipment Profile volumes work the way BeerSmith does: from the batch size in the fermenter back to the pre-boil volume.

// Equipment Profile settings: [key, label, US unit, Metric unit, US default, Metric default]
export const EQUIP_FIELDS = [
  ['batchSize', 'Batch size (into the fermenter)', 'gal', 'L', 5.5, 21],
  ['boilTime', 'Boil time', 'min', 'min', 60, 60],
  ['boilOffRate', 'Boil off per hour', 'gal/hr', 'L/hr', 1, 4],
  ['trubChillerLoss', 'Kettle trub and chiller loss', 'gal', 'L', 0.5, 2],
  ['coolingShrinkage', 'Cooling shrinkage', '%', '%', 4, 4],
  ['topUpKettle', 'Top up water added to the kettle', 'gal', 'L', 0, 0],
  ['topUpFermenter', 'Top up water added to the fermenter', 'gal', 'L', 0, 0],
  ['fermenterLoss', 'Fermenter loss (trub left behind)', 'gal', 'L', 0.25, 1],
  ['hltVolume', 'HLT size', 'gal', 'L', 10, 40],
  ['mashTunVolume', 'Mash tun size', 'gal', 'L', 10, 40],
  ['mashTunDeadspace', 'Mash tun dead space', 'gal', 'L', 0.25, 1],
  ['grainAbsorption', 'Grain absorption', 'gal/lb', 'L/kg', 0.12, 1],
  ['kettleVolume', 'Kettle size', 'gal', 'L', 10, 40],
  ['fermenterVolume', 'Fermenter size', 'gal', 'L', 7, 27],
  ['brewhouseEfficiency', 'Brewhouse efficiency', '%', '%', 72, 72],
  ['hopUtilization', 'Hop utilization', '%', '%', 100, 100],
];
export const UNIT_SYSTEMS = { US: 'US (gallons, pounds, °F)', Metric: 'Metric (liters, kilograms, °C)' };

const n = v => Number.isFinite(+v) ? +v : 0;
const r2 = v => Math.round(v * 100) / 100;

// The volumes on brew day, from the profile's settings
export function equipVolumes(p = {}) {
  const intoFermenter = n(p.batchSize) - n(p.topUpFermenter);
  const shrink = Math.min(Math.max(n(p.coolingShrinkage), 0), 50) / 100;
  const postBoil = (intoFermenter + n(p.trubChillerLoss)) / (1 - shrink);
  const boilOff = n(p.boilOffRate) * n(p.boilTime) / 60;
  const preBoil = postBoil + boilOff - n(p.topUpKettle);
  const bottling = n(p.batchSize) - n(p.fermenterLoss);
  const out = { intoFermenter: r2(intoFermenter), postBoil: r2(postBoil), boilOff: r2(boilOff), preBoil: r2(preBoil), bottling: r2(bottling) };
  const warnings = [];
  if (n(p.kettleVolume) && preBoil > n(p.kettleVolume)) warnings.push(`The pre-boil volume (${out.preBoil}) is more than the kettle holds (${n(p.kettleVolume)}).`);
  if (n(p.fermenterVolume) && n(p.batchSize) > n(p.fermenterVolume)) warnings.push(`The batch (${n(p.batchSize)}) is more than the fermenter holds (${n(p.fermenterVolume)}).`);
  if (intoFermenter <= 0) warnings.push('The batch size must be more than the fermenter top up water.');
  return { ...out, warnings };
}
