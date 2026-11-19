// Skynet Constants (Fritz, 2026-10-30; named again 2026-11-19, Panel Updates Sandbox entry 28): fixed numbers for common conversions,
// built into Skynet. A Process uses one like a number:  gGV_Batch_L = gGV_Batch_Gal * skn_const_L_p_Gal
// Names (OakBarn Brewery, 2026-11-19: "SK_CONST_L_p_G with a label Liters per Gallon"; "KISS make them the same"; "so skn_ as well"):
// skn_const_ (a Skynet name, like skn_Boil_Temp) and a short code read as "this many A in one B" (_p_ = per), with a plain Label.
// Gallon is Gal, not G: capitals mean nothing ("If If IF iF"), so G and g (gram) would be one letter. Imperial units have Im
// (skn_const_L_p_ImGal = 4.546); a gallon without Im is always US. No Device, Widget or variable can start skn_const_ (Rule 3.11).
// Temperatures use toF(x) and toC(x); a temperature change needs only skn_const_F_p_C.
// New Skynet features add the constants they need here without asking (OakBarn Brewery, 2026-11-19, Rule 1.17).
// Used by the Brain (lib/engine.js) and the browser (Process editor colors, predictive text, 📐 Constants list). No imports.

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

// [group, [[name, value, what it does, Label], ...]]
export const SKYNET_CONSTANT_GROUPS = [
  ['Weight', [
    ['skn_const_g_p_Kg', 1000, 'kilograms to grams', 'Grams per Kilogram'],
    ['skn_const_Lb_p_Kg', 1 / LB, 'kilograms to pounds', 'Pounds per Kilogram'],
    ['skn_const_Oz_p_Kg', 16 / LB, 'kilograms to ounces', 'Ounces per Kilogram'],
    ['skn_const_Kg_p_g', 0.001, 'grams to kilograms', 'Kilograms per Gram'],
    ['skn_const_Lb_p_g', 0.001 / LB, 'grams to pounds', 'Pounds per Gram'],
    ['skn_const_Oz_p_g', 0.016 / LB, 'grams to ounces', 'Ounces per Gram'],
    ['skn_const_Kg_p_Lb', LB, 'pounds to kilograms', 'Kilograms per Pound'],
    ['skn_const_g_p_Lb', LB * 1000, 'pounds to grams', 'Grams per Pound'],
    ['skn_const_Oz_p_Lb', 16, 'pounds to ounces', 'Ounces per Pound'],
    ['skn_const_Kg_p_Oz', LB / 16, 'ounces to kilograms', 'Kilograms per Ounce'],
    ['skn_const_g_p_Oz', LB * 1000 / 16, 'ounces to grams', 'Grams per Ounce'],
    ['skn_const_Lb_p_Oz', 1 / 16, 'ounces to pounds', 'Pounds per Ounce'],
    ['skn_const_mg_p_g', 1000, 'grams to milligrams', 'Milligrams per Gram'],
    ['skn_const_g_p_mg', 0.001, 'milligrams to grams', 'Grams per Milligram'],
    ['skn_const_mg_p_Oz', LB * 1e6 / 16, 'ounces to milligrams', 'Milligrams per Ounce'],
    ['skn_const_mg_p_Kg', 1e6, 'kilograms to milligrams', 'Milligrams per Kilogram'],
  ]],
  ['Fractions and water (weight in water)', [
    ['skn_const_Frac_p_Pct', 0.01, 'percent to a fraction (12.5 % is 0.125)', 'Fraction per Percent (12.5 % is 0.125)'],
    ['skn_const_Pct_p_Frac', 100, 'a fraction to percent (0.125 is 12.5 %)', 'Percent per Fraction (0.125 is 12.5 %)'],
    ['skn_const_MgL_p_Ppm', 1, 'parts per million to milligrams per liter (the same in water)', 'Water: mg/L per PPM (the same)'],
    ['skn_const_Ppm_p_MgL', 1, 'milligrams per liter to parts per million (the same in water)', 'Water: PPM per mg/L (the same)'],
    ['skn_const_Ppm_p_GL', 1000, 'grams per liter to parts per million', 'Water: PPM per g/L'],
    ['skn_const_GL_p_Ppm', 0.001, 'parts per million to grams per liter', 'Water: g/L per PPM'],
    ['skn_const_Ppm_p_GGal', 1000 / GAL, 'water salts, grams per US gallon to parts per million', 'Water salts: PPM per gram in a Gallon'],
    ['skn_const_GGal_p_Ppm', GAL / 1000, 'water salts, parts per million to grams per US gallon', 'Water salts: grams in a Gallon per PPM'],
  ]],
  ['Volume (US gallons, quarts and fluid ounces)', [
    ['skn_const_L_p_Gal', GAL, 'gallons to liters', 'Liters per Gallon'],
    ['skn_const_Qt_p_Gal', 4, 'gallons to quarts', 'Quarts per Gallon'],
    ['skn_const_FlOz_p_Gal', 128, 'gallons to fluid ounces', 'Fluid Ounces per Gallon'],
    ['skn_const_L_p_Qt', GAL / 4, 'quarts to liters', 'Liters per Quart'],
    ['skn_const_Gal_p_Qt', 0.25, 'quarts to gallons', 'Gallons per Quart'],
    ['skn_const_mL_p_FlOz', GAL * 1000 / 128, 'fluid ounces to milliliters', 'Milliliters per Fluid Ounce'],
    ['skn_const_Gal_p_L', 1 / GAL, 'liters to gallons', 'Gallons per Liter'],
    ['skn_const_Qt_p_L', 4 / GAL, 'liters to quarts', 'Quarts per Liter'],
    ['skn_const_mL_p_L', 1000, 'liters to milliliters', 'Milliliters per Liter'],
    ['skn_const_L_p_mL', 0.001, 'milliliters to liters', 'Liters per Milliliter'],
    ['skn_const_FlOz_p_mL', 0.128 / GAL, 'milliliters to fluid ounces', 'Fluid Ounces per Milliliter'],
    ['skn_const_Gal_p_BBL', 31, 'US beer barrels to gallons', 'Gallons per US Beer Barrel'],
    ['skn_const_L_p_BBL', 31 * GAL, 'US beer barrels to liters', 'Liters per US Beer Barrel'],
    ['skn_const_BBL_p_L', 1 / (31 * GAL), 'liters to US beer barrels', 'US Beer Barrels per Liter'],
    ['skn_const_L_p_HL', 100, 'hectoliters to liters', 'Liters per Hectoliter'],
    ['skn_const_HL_p_L', 0.01, 'liters to hectoliters', 'Hectoliters per Liter'],
    ['skn_const_mL_p_Gal', GAL * 1000, 'gallons to milliliters', 'Milliliters per Gallon'],
    ['skn_const_Pt_p_Gal', 8, 'gallons to pints', 'Pints per Gallon'],
    ['skn_const_Pt_p_Qt', 2, 'quarts to pints', 'Pints per Quart'],
    ['skn_const_FlOz_p_Qt', 32, 'quarts to fluid ounces', 'Fluid Ounces per Quart'],
    ['skn_const_FlOz_p_Pt', 16, 'pints to fluid ounces', 'Fluid Ounces per Pint'],
    ['skn_const_mL_p_Pt', GAL * 1000 / 8, 'pints to milliliters', 'Milliliters per Pint'],
    ['skn_const_Pt_p_mL', 8 / (GAL * 1000), 'milliliters to pints', 'Pints per Milliliter'],
    ['skn_const_L_p_FlOz', FLOZ / 1000, 'fluid ounces to liters', 'Liters per Fluid Ounce'],
    ['skn_const_FlOz_p_L', 1000 / FLOZ, 'liters to fluid ounces', 'Fluid Ounces per Liter'],
    ['skn_const_FlOz_p_Cup', 8, 'cups to fluid ounces', 'Fluid Ounces per Cup'],
    ['skn_const_mL_p_Cup', FLOZ * 8, 'cups to milliliters', 'Milliliters per Cup'],
    ['skn_const_Tbsp_p_FlOz', 2, 'fluid ounces to tablespoons', 'Tablespoons per Fluid Ounce'],
    ['skn_const_Tsp_p_Tbsp', 3, 'tablespoons to teaspoons', 'Teaspoons per Tablespoon'],
    ['skn_const_mL_p_Tbsp', FLOZ / 2, 'tablespoons to milliliters', 'Milliliters per Tablespoon'],
    ['skn_const_mL_p_Tsp', FLOZ / 6, 'teaspoons to milliliters', 'Milliliters per Teaspoon'],
    ['skn_const_Tbsp_p_mL', 2 / FLOZ, 'milliliters to tablespoons', 'Tablespoons per Milliliter'],
    ['skn_const_Tsp_p_mL', 6 / FLOZ, 'milliliters to teaspoons', 'Teaspoons per Milliliter'],
  ]],
  ['Volume (Imperial, used in the UK: Im in the name)', [
    ['skn_const_L_p_ImGal', IMGAL, 'Imperial gallons to liters', 'Liters per Imperial Gallon'],
    ['skn_const_ImGal_p_L', 1 / IMGAL, 'liters to Imperial gallons', 'Imperial Gallons per Liter'],
    ['skn_const_Gal_p_ImGal', IMGAL / GAL, 'Imperial gallons to US gallons', 'Gallons per Imperial Gallon'],
    ['skn_const_ImGal_p_Gal', GAL / IMGAL, 'US gallons to Imperial gallons', 'Imperial Gallons per Gallon'],
    ['skn_const_ImPt_p_ImGal', 8, 'Imperial gallons to Imperial pints', 'Imperial Pints per Imperial Gallon'],
    ['skn_const_mL_p_ImPt', IMGAL * 1000 / 8, 'Imperial pints to milliliters', 'Milliliters per Imperial Pint'],
    ['skn_const_ImPt_p_mL', 8 / (IMGAL * 1000), 'milliliters to Imperial pints', 'Imperial Pints per Milliliter'],
    ['skn_const_ImFlOz_p_ImPt', 20, 'Imperial pints to Imperial fluid ounces', 'Imperial Fluid Ounces per Imperial Pint'],
    ['skn_const_mL_p_ImFlOz', IMFLOZ, 'Imperial fluid ounces to milliliters', 'Milliliters per Imperial Fluid Ounce'],
    ['skn_const_ImFlOz_p_mL', 1 / IMFLOZ, 'milliliters to Imperial fluid ounces', 'Imperial Fluid Ounces per Milliliter'],
    ['skn_const_L_p_ImBBL', 36 * IMGAL, 'UK beer barrels (36 Imperial gallons) to liters', 'Liters per UK Beer Barrel'],
    ['skn_const_ImBBL_p_L', 1 / (36 * IMGAL), 'liters to UK beer barrels', 'UK Beer Barrels per Liter'],
  ]],
  ['Pressure', [
    ['skn_const_kPa_p_PSI', PSI, 'PSI to kilopascals', 'Kilopascals per PSI'],
    ['skn_const_Bar_p_PSI', PSI / 100, 'PSI to bar', 'Bar per PSI'],
    ['skn_const_hPa_p_PSI', PSI * 10, 'PSI to hectopascals (millibar)', 'Hectopascals per PSI'],
    ['skn_const_inHg_p_PSI', PSI / INHG, 'PSI to inches of mercury', 'Inches of Mercury per PSI'],
    ['skn_const_PSI_p_kPa', 1 / PSI, 'kilopascals to PSI', 'PSI per Kilopascal'],
    ['skn_const_Bar_p_kPa', 0.01, 'kilopascals to bar', 'Bar per Kilopascal'],
    ['skn_const_hPa_p_kPa', 10, 'kilopascals to hectopascals (millibar)', 'Hectopascals per Kilopascal'],
    ['skn_const_PSI_p_Bar', 100 / PSI, 'bar to PSI', 'PSI per Bar'],
    ['skn_const_kPa_p_Bar', 100, 'bar to kilopascals', 'Kilopascals per Bar'],
    ['skn_const_inHg_p_hPa', 0.1 / INHG, 'hectopascals (millibar) to inches of mercury', 'Inches of Mercury per Hectopascal'],
    ['skn_const_PSI_p_hPa', 0.1 / PSI, 'hectopascals (millibar) to PSI', 'PSI per Hectopascal'],
    ['skn_const_kPa_p_hPa', 0.1, 'hectopascals (millibar) to kilopascals', 'Kilopascals per Hectopascal'],
    ['skn_const_Bar_p_hPa', 0.001, 'hectopascals (millibar) to bar', 'Bar per Hectopascal'],
    ['skn_const_hPa_p_Bar', 1000, 'bar to hectopascals (millibar)', 'Hectopascals per Bar'],
    ['skn_const_inHg_p_kPa', 1 / INHG, 'kilopascals to inches of mercury', 'Inches of Mercury per Kilopascal'],
    ['skn_const_mmHg_p_hPa', 0.1 / MMHG, 'hectopascals (millibar) to millimeters of mercury', 'Millimeters of Mercury per Hectopascal'],
    ['skn_const_hPa_p_inHg', INHG * 10, 'inches of mercury to hectopascals (millibar)', 'Hectopascals per Inch of Mercury'],
    ['skn_const_PSI_p_inHg', INHG / PSI, 'inches of mercury to PSI', 'PSI per Inch of Mercury'],
    ['skn_const_kPa_p_inHg', INHG, 'inches of mercury to kilopascals', 'Kilopascals per Inch of Mercury'],
    ['skn_const_hPa_p_mmHg', MMHG * 10, 'millimeters of mercury to hectopascals (millibar)', 'Hectopascals per Millimeter of Mercury'],
    ['skn_const_PSI_p_Atm', ATM / PSI, 'standard sea level pressure in PSI', 'PSI at sea level (per standard Atmosphere)'],
    ['skn_const_kPa_p_Atm', ATM, 'standard sea level pressure in kilopascals', 'Kilopascals at sea level (per standard Atmosphere)'],
    ['skn_const_hPa_p_Atm', ATM * 10, 'standard sea level pressure in hectopascals (millibar)', 'Hectopascals at sea level (per standard Atmosphere)'],
    ['skn_const_inHg_p_Atm', ATM / INHG, 'standard sea level pressure in inches of mercury', 'Inches of Mercury at sea level (per standard Atmosphere)'],
  ]],
  ['Temperature', [
    ['skn_const_F_p_C', 1.8, '°F in one °C (also a temperature change in °C to °F)', '°F per °C (a temperature change)'],
    ['skn_const_C_p_F', 1 / 1.8, '°C in one °F (also a temperature change in °F to °C)', '°C per °F (a temperature change)'],
    ['skn_const_F_Freeze', 32, 'water freezes, °F', 'Water freezes, °F'],
    ['skn_const_C_Freeze', 0, 'water freezes, °C', 'Water freezes, °C'],
    ['skn_const_F_Boil', 212, 'water boils at sea level, °F', 'Water boils at sea level, °F'],
    ['skn_const_C_Boil', 100, 'water boils at sea level, °C', 'Water boils at sea level, °C'],
  ]],
  ['Brewing ratios', [
    ['skn_const_LKg_p_QtLb', (GAL / 4) / LB, 'mash thickness, quarts per pound to liters per kilogram', 'Mash thickness: L/kg per qt/lb'],
    ['skn_const_QtLb_p_LKg', LB / (GAL / 4), 'mash thickness, liters per kilogram to quarts per pound', 'Mash thickness: qt/lb per L/kg'],
    ['skn_const_LKg_p_GalLb', GAL / LB, 'grain absorption, gallons per pound to liters per kilogram', 'Grain absorption: L/kg per gal/lb'],
    ['skn_const_GalLb_p_LKg', LB / GAL, 'grain absorption, liters per kilogram to gallons per pound', 'Grain absorption: gal/lb per L/kg'],
    ['skn_const_GL_p_OzGal', (LB * 1000 / 16) / GAL, 'hop or salt dose, ounces per gallon to grams per liter', 'Hop or salt dose: g/L per oz/gal'],
    ['skn_const_OzGal_p_GL', GAL / (LB * 1000 / 16), 'hop or salt dose, grams per liter to ounces per gallon', 'Hop or salt dose: oz/gal per g/L'],
    ['skn_const_LPM_p_GPM', GAL, 'flow, gallons per minute to liters per minute', 'Flow: Liters per Minute per Gallon per Minute'],
    ['skn_const_GPM_p_LPM', 1 / GAL, 'flow, liters per minute to gallons per minute', 'Flow: Gallons per Minute per Liter per Minute'],
  ]],
  ['Length', [
    ['skn_const_Cm_p_In', 2.54, 'inches to centimeters', 'Centimeters per Inch'],
    ['skn_const_mm_p_In', 25.4, 'inches to millimeters', 'Millimeters per Inch'],
    ['skn_const_In_p_Cm', 1 / 2.54, 'centimeters to inches', 'Inches per Centimeter'],
    ['skn_const_In_p_mm', 1 / 25.4, 'millimeters to inches', 'Inches per Millimeter'],
    ['skn_const_M_p_Ft', 0.3048, 'feet to meters', 'Meters per Foot'],
    ['skn_const_Ft_p_M', 1 / 0.3048, 'meters to feet', 'Feet per Meter'],
    ['skn_const_In_p_Ft', 12, 'feet to inches', 'Inches per Foot'],
    ['skn_const_Ft_p_In', 1 / 12, 'inches to feet', 'Feet per Inch'],
    ['skn_const_Cm_p_M', 100, 'meters to centimeters', 'Centimeters per Meter'],
    ['skn_const_mm_p_Cm', 10, 'centimeters to millimeters', 'Millimeters per Centimeter'],
  ]],
  ['Power', [
    ['skn_const_BTUh_p_W', 3.412142, 'watts to BTU per hour', 'BTU per Hour per Watt'],
    ['skn_const_W_p_BTUh', 1 / 3.412142, 'BTU per hour to watts', 'Watts per BTU per Hour'],
    ['skn_const_W_p_KW', 1000, 'kilowatts to watts', 'Watts per Kilowatt'],
    ['skn_const_KW_p_W', 0.001, 'watts to kilowatts', 'Kilowatts per Watt'],
    ['skn_const_W_p_HP', HP, 'horsepower (a pump motor) to watts', 'Watts per Horsepower'],
    ['skn_const_HP_p_W', 1 / HP, 'watts to horsepower', 'Horsepower per Watt'],
  ]],
  ['Time (Processes count time in seconds)', [
    ['skn_const_Sec_p_Min', 60, 'minutes to seconds', 'Seconds per Minute'],
    ['skn_const_Sec_p_Hr', 3600, 'hours to seconds', 'Seconds per Hour'],
    ['skn_const_Min_p_Hr', 60, 'hours to minutes', 'Minutes per Hour'],
    ['skn_const_Hr_p_Day', 24, 'days to hours', 'Hours per Day'],
    ['skn_const_Sec_p_Day', 86400, 'days to seconds', 'Seconds per Day'],
    ['skn_const_Min_p_Sec', 1 / 60, 'seconds to minutes', 'Minutes per Second'],
    ['skn_const_Hr_p_Min', 1 / 60, 'minutes to hours', 'Hours per Minute'],
    ['skn_const_Ms_p_Sec', 1000, 'seconds to milliseconds (sleep counts in milliseconds)', 'Milliseconds per Second'],
    ['skn_const_Ms_p_Min', 60000, 'minutes to milliseconds (sleep counts in milliseconds)', 'Milliseconds per Minute'],
  ]],
];

export const SKYNET_CONSTANT_PREFIX = 'skn_const_';

// [name, value, what it does, group, Label] for every Skynet Constant
export const SKYNET_CONSTANTS = SKYNET_CONSTANT_GROUPS.flatMap(([group, list]) => list.map(([n, v, what, label]) => [n, v, what, group, label]));
const BY_NAME = new Map(SKYNET_CONSTANTS.map(c => [c[0].toLowerCase(), c]));

// toF() and toC() (OakBarn Brewery, 2026-11-17: "toF and toC look good"): a temperature in °C to °F, and °F to °C.
// Only with ( ) after them, so an item that happens to be called toF is still read by its name.
export const SKYNET_FUNCTIONS = [
  ['toF', x => x * 1.8 + 32, '°C to °F: toF(x) is x × 1.8 + 32'],
  ['toC', x => (x - 32) / 1.8, '°F to °C: toC(x) is (x − 32) ÷ 1.8'],
];
const FN = new Map(SKYNET_FUNCTIONS.map(f => [f[0].toLowerCase(), f]));
export const skynetFunction = name => FN.get(String(name ?? '').toLowerCase())?.[1];
export const isSkynetFunction = name => FN.has(String(name ?? '').toLowerCase());

// every Skynet Constant name, and toF and toC (for the editor colors and the Notepad++ file)
export const SKYNET_CONSTANT_WORDS = [...SKYNET_CONSTANTS.map(c => c[0]), ...SKYNET_FUNCTIONS.map(f => f[0])];

// the value of a Skynet Constant (any upper or lower case), or undefined
export const skynetConstant = name => BY_NAME.get(String(name ?? '').toLowerCase())?.[1];
export const isSkynetConstant = name => BY_NAME.has(String(name ?? '').toLowerCase());
// its Label: "Liters per Gallon"
export const constantLabel = name => BY_NAME.get(String(name ?? '').toLowerCase())?.[4] ?? '';
// skn_const_ names are kept for Skynet Constants: a Device, Widget or variable can't start with it
export const isSkynetConstantName = name => String(name ?? '').toLowerCase().startsWith(SKYNET_CONSTANT_PREFIX);
// how a constant shows in a list: 2.20462 (6 significant digits, no trailing zeros)
export const showConstant = v => String(Number(v.toPrecision(6)));
