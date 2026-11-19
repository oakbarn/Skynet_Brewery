// Skynet Constants (Fritz, 2026-10-30): fixed numbers for common conversions, built into Skynet.
// A Process uses one like a number:  gGV_Grain_Lb = gGV_Grain_Kg * skc_Kg_To_Lb
// They are Skynet names (Skynet Rule 3.11): nobody can change them, and no Device, Widget or variable can take one.
// Every one is a multiplier: the amount in the first unit times the constant gives the amount in the second.
// Temperature is the only kind that needs more than one multiply (see the Help page Skynet Constants):
//   °F = °C * skc_F_Per_C + skc_F_Freeze      °C = (°F - skc_F_Freeze) * skc_C_Per_F
// Used by the Brain (lib/engine.js) and the browser (Process editor colors and predictive text). No imports.
//
// Short names (OakBarn Brewery, 2026-11-17, Panel Updates Sandbox entry 28, built 2026-11-19): every From_To_To constant also has a
// short name with no skc_ start, read as "this many A in one B": skc_Gal_To_L is also L_p_Gal (liters per gallon, 3.785).
// _p_ means "per". Imperial units have Im in them (L_p_ImGal = 4.546); a gallon without Im is always the US gallon.
// Capitals mean nothing ("If If IF iF"), so no two names differ only by capitals. The short names, toF and toC are reserved words:
// no Device, Widget, gGlobal or new variable can take one (public/names.js, lib/engine.js).
// New Skynet features add the constants they need here without asking (OakBarn Brewery, 2026-11-19, Rule 1.17).

const LB = 0.45359237;            // kg, exact
const GAL = 3.785411784;          // L (US gallon), exact
const PSI = 6.894757293168;       // kPa
const INHG = 3.386389;            // kPa (inch of mercury, 0 °C)
const MMHG = 0.1333224;           // kPa (mm of mercury, 0 °C)
const ATM = 101.325;              // kPa, exact (standard sea level pressure)
const IMGAL = 4.54609;            // L (Imperial gallon), exact
const FLOZ = GAL * 1000 / 128;    // mL (US fluid ounce)
const IMFLOZ = IMGAL * 1000 / 160; // mL (Imperial fluid ounce)
const HP = 745.69987158227;       // W (mechanical horsepower)

// [group, [[name, value, what it does], ...]]
export const SKYNET_CONSTANT_GROUPS = [
  ['Weight', [
    ['skc_Kg_To_G', 1000, 'kilograms to grams'],
    ['skc_Kg_To_Lb', 1 / LB, 'kilograms to pounds'],
    ['skc_Kg_To_Oz', 16 / LB, 'kilograms to ounces'],
    ['skc_G_To_Kg', 0.001, 'grams to kilograms'],
    ['skc_G_To_Lb', 0.001 / LB, 'grams to pounds'],
    ['skc_G_To_Oz', 0.016 / LB, 'grams to ounces'],
    ['skc_Lb_To_Kg', LB, 'pounds to kilograms'],
    ['skc_Lb_To_G', LB * 1000, 'pounds to grams'],
    ['skc_Lb_To_Oz', 16, 'pounds to ounces'],
    ['skc_Oz_To_Kg', LB / 16, 'ounces to kilograms'],
    ['skc_Oz_To_G', LB * 1000 / 16, 'ounces to grams'],
    ['skc_Oz_To_Lb', 1 / 16, 'ounces to pounds'],
    ['skc_G_To_Mg', 1000, 'grams to milligrams'],
    ['skc_Mg_To_G', 0.001, 'milligrams to grams'],
    ['skc_Oz_To_Mg', LB * 1e6 / 16, 'ounces to milligrams'],
    ['skc_Kg_To_Mg', 1e6, 'kilograms to milligrams'],
  ]],
  ['Fractions and water (weight in water)', [
    ['skc_Pct_To_Frac', 0.01, 'percent to a fraction (12.5 % is 0.125)'],
    ['skc_Frac_To_Pct', 100, 'a fraction to percent (0.125 is 12.5 %)'],
    ['skc_Ppm_To_MgL', 1, 'parts per million to milligrams per liter (the same in water)'],
    ['skc_MgL_To_Ppm', 1, 'milligrams per liter to parts per million (the same in water)'],
    ['skc_GL_To_Ppm', 1000, 'grams per liter to parts per million'],
    ['skc_Ppm_To_GL', 0.001, 'parts per million to grams per liter'],
    ['skc_GGal_To_Ppm', 1000 / GAL, 'water salts, grams per US gallon to parts per million'],
    ['skc_Ppm_To_GGal', GAL / 1000, 'water salts, parts per million to grams per US gallon'],
  ]],
  ['Volume (US gallons, quarts and fluid ounces)', [
    ['skc_Gal_To_L', GAL, 'gallons to liters'],
    ['skc_Gal_To_Qt', 4, 'gallons to quarts'],
    ['skc_Gal_To_FlOz', 128, 'gallons to fluid ounces'],
    ['skc_Qt_To_L', GAL / 4, 'quarts to liters'],
    ['skc_Qt_To_Gal', 0.25, 'quarts to gallons'],
    ['skc_FlOz_To_ML', GAL * 1000 / 128, 'fluid ounces to milliliters'],
    ['skc_L_To_Gal', 1 / GAL, 'liters to gallons'],
    ['skc_L_To_Qt', 4 / GAL, 'liters to quarts'],
    ['skc_L_To_ML', 1000, 'liters to milliliters'],
    ['skc_ML_To_L', 0.001, 'milliliters to liters'],
    ['skc_ML_To_FlOz', 0.128 / GAL, 'milliliters to fluid ounces'],
    ['skc_BBL_To_Gal', 31, 'US beer barrels to gallons'],
    ['skc_BBL_To_L', 31 * GAL, 'US beer barrels to liters'],
    ['skc_L_To_BBL', 1 / (31 * GAL), 'liters to US beer barrels'],
    ['skc_HL_To_L', 100, 'hectoliters to liters'],
    ['skc_L_To_HL', 0.01, 'liters to hectoliters'],
    ['skc_Gal_To_ML', GAL * 1000, 'gallons to milliliters'],
    ['skc_Gal_To_Pt', 8, 'gallons to pints'],
    ['skc_Qt_To_Pt', 2, 'quarts to pints'],
    ['skc_Qt_To_FlOz', 32, 'quarts to fluid ounces'],
    ['skc_Pt_To_FlOz', 16, 'pints to fluid ounces'],
    ['skc_Pt_To_ML', GAL * 1000 / 8, 'pints to milliliters'],
    ['skc_ML_To_Pt', 8 / (GAL * 1000), 'milliliters to pints'],
    ['skc_FlOz_To_L', FLOZ / 1000, 'fluid ounces to liters'],
    ['skc_L_To_FlOz', 1000 / FLOZ, 'liters to fluid ounces'],
    ['skc_Cup_To_FlOz', 8, 'cups to fluid ounces'],
    ['skc_Cup_To_ML', FLOZ * 8, 'cups to milliliters'],
    ['skc_FlOz_To_Tbsp', 2, 'fluid ounces to tablespoons'],
    ['skc_Tbsp_To_Tsp', 3, 'tablespoons to teaspoons'],
    ['skc_Tbsp_To_ML', FLOZ / 2, 'tablespoons to milliliters'],
    ['skc_Tsp_To_ML', FLOZ / 6, 'teaspoons to milliliters'],
    ['skc_ML_To_Tbsp', 2 / FLOZ, 'milliliters to tablespoons'],
    ['skc_ML_To_Tsp', 6 / FLOZ, 'milliliters to teaspoons'],
  ]],
  ['Volume (Imperial, used in the UK: Im in the name)', [
    ['skc_ImGal_To_L', IMGAL, 'Imperial gallons to liters'],
    ['skc_L_To_ImGal', 1 / IMGAL, 'liters to Imperial gallons'],
    ['skc_ImGal_To_Gal', IMGAL / GAL, 'Imperial gallons to US gallons'],
    ['skc_Gal_To_ImGal', GAL / IMGAL, 'US gallons to Imperial gallons'],
    ['skc_ImGal_To_ImPt', 8, 'Imperial gallons to Imperial pints'],
    ['skc_ImPt_To_ML', IMGAL * 1000 / 8, 'Imperial pints to milliliters'],
    ['skc_ML_To_ImPt', 8 / (IMGAL * 1000), 'milliliters to Imperial pints'],
    ['skc_ImPt_To_ImFlOz', 20, 'Imperial pints to Imperial fluid ounces'],
    ['skc_ImFlOz_To_ML', IMFLOZ, 'Imperial fluid ounces to milliliters'],
    ['skc_ML_To_ImFlOz', 1 / IMFLOZ, 'milliliters to Imperial fluid ounces'],
    ['skc_ImBBL_To_L', 36 * IMGAL, 'UK beer barrels (36 Imperial gallons) to liters'],
    ['skc_L_To_ImBBL', 1 / (36 * IMGAL), 'liters to UK beer barrels'],
  ]],
  ['Pressure', [
    ['skc_PSI_To_kPa', PSI, 'PSI to kilopascals'],
    ['skc_PSI_To_Bar', PSI / 100, 'PSI to bar'],
    ['skc_PSI_To_hPa', PSI * 10, 'PSI to hectopascals (millibar)'],
    ['skc_PSI_To_inHg', PSI / INHG, 'PSI to inches of mercury'],
    ['skc_kPa_To_PSI', 1 / PSI, 'kilopascals to PSI'],
    ['skc_kPa_To_Bar', 0.01, 'kilopascals to bar'],
    ['skc_kPa_To_hPa', 10, 'kilopascals to hectopascals (millibar)'],
    ['skc_Bar_To_PSI', 100 / PSI, 'bar to PSI'],
    ['skc_Bar_To_kPa', 100, 'bar to kilopascals'],
    ['skc_hPa_To_inHg', 0.1 / INHG, 'hectopascals (millibar) to inches of mercury'],
    ['skc_hPa_To_PSI', 0.1 / PSI, 'hectopascals (millibar) to PSI'],
    ['skc_hPa_To_kPa', 0.1, 'hectopascals (millibar) to kilopascals'],
    ['skc_hPa_To_Bar', 0.001, 'hectopascals (millibar) to bar'],
    ['skc_Bar_To_hPa', 1000, 'bar to hectopascals (millibar)'],
    ['skc_kPa_To_inHg', 1 / INHG, 'kilopascals to inches of mercury'],
    ['skc_hPa_To_mmHg', 0.1 / MMHG, 'hectopascals (millibar) to millimeters of mercury'],
    ['skc_inHg_To_hPa', INHG * 10, 'inches of mercury to hectopascals (millibar)'],
    ['skc_inHg_To_PSI', INHG / PSI, 'inches of mercury to PSI'],
    ['skc_inHg_To_kPa', INHG, 'inches of mercury to kilopascals'],
    ['skc_mmHg_To_hPa', MMHG * 10, 'millimeters of mercury to hectopascals (millibar)'],
    ['skc_Atm_PSI', ATM / PSI, 'standard sea level pressure in PSI'],
    ['skc_Atm_kPa', ATM, 'standard sea level pressure in kilopascals'],
    ['skc_Atm_hPa', ATM * 10, 'standard sea level pressure in hectopascals (millibar)'],
    ['skc_Atm_inHg', ATM / INHG, 'standard sea level pressure in inches of mercury'],
  ]],
  ['Temperature', [
    ['skc_F_Per_C', 1.8, '°F in one °C (also a temperature change in °C to °F)'],
    ['skc_C_Per_F', 1 / 1.8, '°C in one °F (also a temperature change in °F to °C)'],
    ['skc_F_Freeze', 32, 'water freezes, °F'],
    ['skc_C_Freeze', 0, 'water freezes, °C'],
    ['skc_F_Boil', 212, 'water boils at sea level, °F'],
    ['skc_C_Boil', 100, 'water boils at sea level, °C'],
  ]],
  ['Brewing ratios', [
    ['skc_QtLb_To_LKg', (GAL / 4) / LB, 'mash thickness, quarts per pound to liters per kilogram'],
    ['skc_LKg_To_QtLb', LB / (GAL / 4), 'mash thickness, liters per kilogram to quarts per pound'],
    ['skc_GalLb_To_LKg', GAL / LB, 'grain absorption, gallons per pound to liters per kilogram'],
    ['skc_LKg_To_GalLb', LB / GAL, 'grain absorption, liters per kilogram to gallons per pound'],
    ['skc_OzGal_To_GL', (LB * 1000 / 16) / GAL, 'hop or salt dose, ounces per gallon to grams per liter'],
    ['skc_GL_To_OzGal', GAL / (LB * 1000 / 16), 'hop or salt dose, grams per liter to ounces per gallon'],
    ['skc_GPM_To_LPM', GAL, 'flow, gallons per minute to liters per minute'],
    ['skc_LPM_To_GPM', 1 / GAL, 'flow, liters per minute to gallons per minute'],
  ]],
  ['Length', [
    ['skc_In_To_Cm', 2.54, 'inches to centimeters'],
    ['skc_In_To_Mm', 25.4, 'inches to millimeters'],
    ['skc_Cm_To_In', 1 / 2.54, 'centimeters to inches'],
    ['skc_Mm_To_In', 1 / 25.4, 'millimeters to inches'],
    ['skc_Ft_To_M', 0.3048, 'feet to meters'],
    ['skc_M_To_Ft', 1 / 0.3048, 'meters to feet'],
    ['skc_Ft_To_In', 12, 'feet to inches'],
    ['skc_In_To_Ft', 1 / 12, 'inches to feet'],
    ['skc_M_To_Cm', 100, 'meters to centimeters'],
    ['skc_Cm_To_Mm', 10, 'centimeters to millimeters'],
  ]],
  ['Power', [
    ['skc_W_To_BTUh', 3.412142, 'watts to BTU per hour'],
    ['skc_BTUh_To_W', 1 / 3.412142, 'BTU per hour to watts'],
    ['skc_KW_To_W', 1000, 'kilowatts to watts'],
    ['skc_W_To_KW', 0.001, 'watts to kilowatts'],
    ['skc_HP_To_W', HP, 'horsepower (a pump motor) to watts'],
    ['skc_W_To_HP', 1 / HP, 'watts to horsepower'],
  ]],
  ['Time (Processes count time in seconds)', [
    ['skc_Min_To_Sec', 60, 'minutes to seconds'],
    ['skc_Hr_To_Sec', 3600, 'hours to seconds'],
    ['skc_Hr_To_Min', 60, 'hours to minutes'],
    ['skc_Day_To_Hr', 24, 'days to hours'],
    ['skc_Day_To_Sec', 86400, 'days to seconds'],
    ['skc_Sec_To_Min', 1 / 60, 'seconds to minutes'],
    ['skc_Min_To_Hr', 1 / 60, 'minutes to hours'],
    ['skc_Sec_To_Ms', 1000, 'seconds to milliseconds (sleep counts in milliseconds)'],
    ['skc_Min_To_Ms', 60000, 'minutes to milliseconds (sleep counts in milliseconds)'],
  ]],
];

export const SKYNET_CONSTANT_PREFIX = 'skc_';

// The short name of a constant (Sandbox entry 28): skc_Gal_To_L -> L_p_Gal ("L per Gal"), skc_F_Per_C -> F_p_C,
// skc_Atm_PSI -> PSI_p_Atm. Gram and milliliter are written g and mL (g_p_Oz); capitals mean nothing when it is read.
// skc_F_Freeze, skc_C_Boil ... have none: toF() and toC() do temperatures.
const SHOW_UNIT = { G: 'g', ML: 'mL', Mg: 'mg', Mm: 'mm' };
const unit = u => SHOW_UNIT[u] ?? u;
export function shortNameOf(name) {
  let m;
  if ((m = /^skc_(.+)_Per_(.+)$/.exec(name))) return `${unit(m[1])}_p_${unit(m[2])}`;                                    // F_Per_C: F in one C
  if ((m = /^skc_(.+)_To_(.+)$/.exec(name))) return `${unit(m[2])}_p_${unit(m[1])}`;                                     // Gal_To_L: L in one Gal
  if ((m = /^skc_Atm_(.+)$/.exec(name))) return `${unit(m[1])}_p_Atm`;                                                   // Atm_PSI: PSI in one Atm
  return '';
}

// [name, value, what it does, group, short name] for every Skynet Constant
export const SKYNET_CONSTANTS = SKYNET_CONSTANT_GROUPS.flatMap(([group, list]) => list.map(([n, v, what]) => [n, v, what, group, shortNameOf(n)]));
const BY_NAME = new Map(SKYNET_CONSTANTS.map(c => [c[0].toLowerCase(), c]));
const BY_SHORT = new Map(SKYNET_CONSTANTS.filter(c => c[4]).map(c => [c[4].toLowerCase(), c]));

// toF() and toC() (OakBarn Brewery, 2026-11-17: "toF and toC look good"): a temperature in °C to °F, and °F to °C
export const SKYNET_FUNCTIONS = [
  ['toF', x => x * 1.8 + 32, '°C to °F: toF(x) is x × 1.8 + 32'],
  ['toC', x => (x - 32) / 1.8, '°F to °C: toC(x) is (x − 32) ÷ 1.8'],
];
const FN = new Map(SKYNET_FUNCTIONS.map(f => [f[0].toLowerCase(), f]));
export const skynetFunction = name => FN.get(String(name ?? '').toLowerCase())?.[1];
export const isSkynetFunction = name => FN.has(String(name ?? '').toLowerCase());

// every word Skynet keeps for its constants: the skc_ names, the short names, toF and toC (for colors, Notepad++ and the rewriter)
export const SKYNET_CONSTANT_WORDS = [...SKYNET_CONSTANTS.map(c => c[0]), ...SKYNET_CONSTANTS.filter(c => c[4]).map(c => c[4]), ...SKYNET_FUNCTIONS.map(f => f[0])];

const find = name => { const n = String(name ?? '').toLowerCase(); return BY_NAME.get(n) ?? BY_SHORT.get(n); };
// the value of a Skynet Constant by its skc_ name or its short name (any upper or lower case), or undefined
export const skynetConstant = name => find(name)?.[1];
export const isSkynetConstant = name => !!find(name);
// a short name (L_p_Gal), not an skc_ one
export const isShortConstant = name => BY_SHORT.has(String(name ?? '').toLowerCase());
// skc_ names are kept for Skynet Constants: a Device, Widget or variable can't start with it
export const isSkynetConstantName = name => String(name ?? '').toLowerCase().startsWith(SKYNET_CONSTANT_PREFIX);
// a reserved word of the Skynet Constants (a short name, toF or toC), any capitals: no item can be called that
export const isReservedConstantWord = name => isShortConstant(name) || isSkynetFunction(name);
// what a reserved word is, for a message: "L_p_Gal (liters in one gallon, 3.78541)"
export function reservedWordWhat(name) {
  const f = FN.get(String(name ?? '').toLowerCase()); if (f) return `${f[0]}(), ${f[2]}`;
  const c = BY_SHORT.get(String(name ?? '').toLowerCase()); return c ? `${c[4]}, the Skynet Constant ${c[0]} = ${showConstant(c[1])} (${c[2]})` : '';
}
// the names in a list that are reserved words (made before a constant was added, or brought in): each shown once, never renamed
export const reservedClashes = names => [...new Set([...names].map(String))].filter(isReservedConstantWord);
// how a constant shows in a list: 2.20462 (6 significant digits, no trailing zeros)
export const showConstant = v => String(Number(v.toPrecision(6)));
