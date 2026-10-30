// Skynet Constants (Fritz, 2026-10-30): fixed numbers for common conversions, built into Skynet.
// A Process uses one like a number:  gGV_Grain_Lb = gGV_Grain_Kg * skc_Kg_To_Lb
// They are Skynet names (Skynet Rule 3.11): nobody can change them, and no Device, Widget or variable can take one.
// Every one is a multiplier: the amount in the first unit times the constant gives the amount in the second.
// Temperature is the only kind that needs more than one multiply (see the Help page Skynet Constants):
//   °F = °C * skc_F_Per_C + skc_F_Freeze      °C = (°F - skc_F_Freeze) * skc_C_Per_F
// Used by the Brain (lib/engine.js) and the browser (Process editor colors and predictive text). No imports.

const LB = 0.45359237;            // kg, exact
const GAL = 3.785411784;          // L (US gallon), exact
const PSI = 6.894757293168;       // kPa
const INHG = 3.386389;            // kPa (inch of mercury, 0 °C)
const MMHG = 0.1333224;           // kPa (mm of mercury, 0 °C)
const ATM = 101.325;              // kPa, exact (standard sea level pressure)

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
  ]],
  ['Power', [
    ['skc_W_To_BTUh', 3.412142, 'watts to BTU per hour'],
    ['skc_BTUh_To_W', 1 / 3.412142, 'BTU per hour to watts'],
    ['skc_KW_To_W', 1000, 'kilowatts to watts'],
  ]],
  ['Time (Processes count time in seconds)', [
    ['skc_Min_To_Sec', 60, 'minutes to seconds'],
    ['skc_Hr_To_Sec', 3600, 'hours to seconds'],
    ['skc_Hr_To_Min', 60, 'hours to minutes'],
    ['skc_Day_To_Hr', 24, 'days to hours'],
    ['skc_Day_To_Sec', 86400, 'days to seconds'],
  ]],
];

export const SKYNET_CONSTANT_PREFIX = 'skc_';
// [name, value, what it does, group] for every Skynet Constant
export const SKYNET_CONSTANTS = SKYNET_CONSTANT_GROUPS.flatMap(([group, list]) => list.map(([n, v, what]) => [n, v, what, group]));
const BY_NAME = new Map(SKYNET_CONSTANTS.map(c => [c[0].toLowerCase(), c]));

// the value of a Skynet Constant (any upper or lower case), or undefined
export const skynetConstant = name => BY_NAME.get(String(name ?? '').toLowerCase())?.[1];
export const isSkynetConstant = name => BY_NAME.has(String(name ?? '').toLowerCase());
// skc_ names are kept for Skynet Constants: a Device, Widget or variable can't start with it
export const isSkynetConstantName = name => String(name ?? '').toLowerCase().startsWith(SKYNET_CONSTANT_PREFIX);
// how a constant shows in a list: 2.20462 (6 significant digits, no trailing zeros)
export const showConstant = v => String(Number(v.toPrecision(6)));
