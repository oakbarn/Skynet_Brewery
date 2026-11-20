# Skynet Constants

Skynet Constants are fixed numbers built into Skynet for the conversions brewers use most: weight, fractions and water, volume (US and Imperial), pressure, temperature, brewing ratios, length, power and time. They are part of Skynet, so nobody can change them (Skynet Rule 3.11), and they are the same on every Brain.

Each one has a **name** and a **Label**:

- The name starts with **`skn_const_`**, like every Skynet name (`skn_`), and ends in a short code read as "this many A in one B". `_p_` means **per**: `skn_const_L_p_Gal` is the liters in one gallon (3.785).
- The Label says it in plain words: **Liters per Gallon**.

Upper and lower case do not matter: `SKN_CONST_L_P_GAL` is the same constant.

A gallon, quart, pint or fluid ounce is always the **US** one. An **Imperial** (UK) unit has **Im** in its name: `skn_const_L_p_ImGal` is 4.546. A gallon is written `Gal`, never `G`, because `g` is a gram and capitals do not count.

## The list in the Process editor

In the Process editor, **📐 Constants** shows every Skynet Constant with its Label, value and name. Type in its Find box to narrow it (`gallon`, `ounce`, `psi`, `water`). Click a line to put that constant at the cursor.

## Using one in a Process

Use a Skynet Constant anywhere a number can go. Multiply the amount by the constant:

```
gGV_Batch_L = gGV_Batch_Gal * skn_const_L_p_Gal     // 5 gal -> 18.93 L
gGV_Grain_Lb = gGV_Grain_Kg * skn_const_Lb_p_Kg     // 5 kg -> 11.02 lb
gGV_Hops_G = gGV_Hops_Oz * skn_const_g_p_Oz
gGV_Salt_Ppm = gGV_Salt_G_per_Gal * skn_const_Ppm_p_GGal
if Kettle_Pressure * skn_const_kPa_p_PSI > 70
sleep 5 * skn_const_Ms_p_Min                        // sleep counts in milliseconds
```

Skynet keeps its data in metric (Rule 2.59), so a Process seldom needs a constant to read a value. They are for numbers you type or show.

## Temperature

A temperature needs more than a multiply, because 0 °C is not 0 °F. Use **`toF( )`** and **`toC( )`**:

```
gGV_Temp_F = toF(gGV_Temp_C)                   // °C to °F: x × 1.8 + 32
gGV_Temp_C = toC(gGV_Temp_F)                   // °F to °C: (x − 32) ÷ 1.8
vSMsg = "Strike " + toF(gGV_Strike_C) + " °F"
```

A temperature **change** (a 2 degree rise, a 10 degree drop) only needs the multiply: `gGV_Rise_F = gGV_Rise_C * skn_const_F_p_C`.

`toF` and `toC` work only with ( ) after them, so an item that happens to be called `toF` is still read by its name.

## Predictive text

Where a value can go, start typing and the matching Skynet Constants are listed with their value and Label. Typing a unit finds every constant that uses it: `Gal` lists `skn_const_L_p_Gal`, `skn_const_Gal_p_L` and the rest. Typing `to` offers `toF(` and `toC(`. See [Predictive text](79-predictive-text).

## What you can't do

- A Skynet Constant can't be changed: `skn_const_L_p_Gal = 2` is an error when the Process is checked or saved.
- A Skynet Constant has no attributes: `skn_const_L_p_Gal.value` is an error. Use the name alone.
- Names starting `skn_const_` are kept for Skynet Constants. No Device, Widget, gGlobal or `new` variable can have one.
- A name that starts `skn_const_` but is not in the lists below is an error, so a typing mistake is found when you check the Process.

## New constants

When a new Skynet feature needs a conversion that is not here, it is added to this list with the feature (Rule 1.17).

## The Skynet Constants

Volumes are US units unless the name has Im (Imperial). Values are shown here to 6 figures; Skynet uses them to full accuracy.

### Weight

| Label | Name | Value |
|---|---|---|
| Grams per Kilogram | `skn_const_g_p_Kg` | 1000 |
| Pounds per Kilogram | `skn_const_Lb_p_Kg` | 2.20462 |
| Ounces per Kilogram | `skn_const_Oz_p_Kg` | 35.274 |
| Kilograms per Gram | `skn_const_Kg_p_g` | 0.001 |
| Pounds per Gram | `skn_const_Lb_p_g` | 0.00220462 |
| Ounces per Gram | `skn_const_Oz_p_g` | 0.035274 |
| Kilograms per Pound | `skn_const_Kg_p_Lb` | 0.453592 |
| Grams per Pound | `skn_const_g_p_Lb` | 453.592 |
| Ounces per Pound | `skn_const_Oz_p_Lb` | 16 |
| Kilograms per Ounce | `skn_const_Kg_p_Oz` | 0.0283495 |
| Grams per Ounce | `skn_const_g_p_Oz` | 28.3495 |
| Pounds per Ounce | `skn_const_Lb_p_Oz` | 0.0625 |
| Milligrams per Gram | `skn_const_mg_p_g` | 1000 |
| Grams per Milligram | `skn_const_g_p_mg` | 0.001 |
| Milligrams per Ounce | `skn_const_mg_p_Oz` | 28349.5 |
| Milligrams per Kilogram | `skn_const_mg_p_Kg` | 1000000 |

### Fractions and water (weight in water)

| Label | Name | Value |
|---|---|---|
| Fraction per Percent (12.5 % is 0.125) | `skn_const_Frac_p_Pct` | 0.01 |
| Percent per Fraction (0.125 is 12.5 %) | `skn_const_Pct_p_Frac` | 100 |
| Water: mg/L per PPM (the same) | `skn_const_MgL_p_Ppm` | 1 |
| Water: PPM per mg/L (the same) | `skn_const_Ppm_p_MgL` | 1 |
| Water: PPM per g/L | `skn_const_Ppm_p_GL` | 1000 |
| Water: g/L per PPM | `skn_const_GL_p_Ppm` | 0.001 |
| Water salts: PPM per gram in a Gallon | `skn_const_Ppm_p_GGal` | 264.172 |
| Water salts: grams in a Gallon per PPM | `skn_const_GGal_p_Ppm` | 0.00378541 |

### Volume (US gallons, quarts and fluid ounces)

| Label | Name | Value |
|---|---|---|
| Liters per Gallon | `skn_const_L_p_Gal` | 3.78541 |
| Quarts per Gallon | `skn_const_Qt_p_Gal` | 4 |
| Fluid Ounces per Gallon | `skn_const_FlOz_p_Gal` | 128 |
| Liters per Quart | `skn_const_L_p_Qt` | 0.946353 |
| Gallons per Quart | `skn_const_Gal_p_Qt` | 0.25 |
| Milliliters per Fluid Ounce | `skn_const_mL_p_FlOz` | 29.5735 |
| Gallons per Liter | `skn_const_Gal_p_L` | 0.264172 |
| Quarts per Liter | `skn_const_Qt_p_L` | 1.05669 |
| Milliliters per Liter | `skn_const_mL_p_L` | 1000 |
| Liters per Milliliter | `skn_const_L_p_mL` | 0.001 |
| Fluid Ounces per Milliliter | `skn_const_FlOz_p_mL` | 0.033814 |
| Gallons per US Beer Barrel | `skn_const_Gal_p_BBL` | 31 |
| Liters per US Beer Barrel | `skn_const_L_p_BBL` | 117.348 |
| US Beer Barrels per Liter | `skn_const_BBL_p_L` | 0.00852168 |
| Liters per Hectoliter | `skn_const_L_p_HL` | 100 |
| Hectoliters per Liter | `skn_const_HL_p_L` | 0.01 |
| Milliliters per Gallon | `skn_const_mL_p_Gal` | 3785.41 |
| Pints per Gallon | `skn_const_Pt_p_Gal` | 8 |
| Pints per Quart | `skn_const_Pt_p_Qt` | 2 |
| Fluid Ounces per Quart | `skn_const_FlOz_p_Qt` | 32 |
| Fluid Ounces per Pint | `skn_const_FlOz_p_Pt` | 16 |
| Milliliters per Pint | `skn_const_mL_p_Pt` | 473.176 |
| Pints per Milliliter | `skn_const_Pt_p_mL` | 0.00211338 |
| Liters per Fluid Ounce | `skn_const_L_p_FlOz` | 0.0295735 |
| Fluid Ounces per Liter | `skn_const_FlOz_p_L` | 33.814 |
| Fluid Ounces per Cup | `skn_const_FlOz_p_Cup` | 8 |
| Milliliters per Cup | `skn_const_mL_p_Cup` | 236.588 |
| Tablespoons per Fluid Ounce | `skn_const_Tbsp_p_FlOz` | 2 |
| Teaspoons per Tablespoon | `skn_const_Tsp_p_Tbsp` | 3 |
| Milliliters per Tablespoon | `skn_const_mL_p_Tbsp` | 14.7868 |
| Milliliters per Teaspoon | `skn_const_mL_p_Tsp` | 4.92892 |
| Tablespoons per Milliliter | `skn_const_Tbsp_p_mL` | 0.067628 |
| Teaspoons per Milliliter | `skn_const_Tsp_p_mL` | 0.202884 |

### Volume (Imperial, used in the UK: Im in the name)

| Label | Name | Value |
|---|---|---|
| Liters per Imperial Gallon | `skn_const_L_p_ImGal` | 4.54609 |
| Imperial Gallons per Liter | `skn_const_ImGal_p_L` | 0.219969 |
| Gallons per Imperial Gallon | `skn_const_Gal_p_ImGal` | 1.20095 |
| Imperial Gallons per Gallon | `skn_const_ImGal_p_Gal` | 0.832674 |
| Imperial Pints per Imperial Gallon | `skn_const_ImPt_p_ImGal` | 8 |
| Milliliters per Imperial Pint | `skn_const_mL_p_ImPt` | 568.261 |
| Imperial Pints per Milliliter | `skn_const_ImPt_p_mL` | 0.00175975 |
| Imperial Fluid Ounces per Imperial Pint | `skn_const_ImFlOz_p_ImPt` | 20 |
| Milliliters per Imperial Fluid Ounce | `skn_const_mL_p_ImFlOz` | 28.4131 |
| Imperial Fluid Ounces per Milliliter | `skn_const_ImFlOz_p_mL` | 0.0351951 |
| Liters per UK Beer Barrel | `skn_const_L_p_ImBBL` | 163.659 |
| UK Beer Barrels per Liter | `skn_const_ImBBL_p_L` | 0.00611026 |

### Pressure

| Label | Name | Value |
|---|---|---|
| Kilopascals per PSI | `skn_const_kPa_p_PSI` | 6.89476 |
| Bar per PSI | `skn_const_Bar_p_PSI` | 0.0689476 |
| Hectopascals per PSI | `skn_const_hPa_p_PSI` | 68.9476 |
| Inches of Mercury per PSI | `skn_const_inHg_p_PSI` | 2.03602 |
| PSI per Kilopascal | `skn_const_PSI_p_kPa` | 0.145038 |
| Bar per Kilopascal | `skn_const_Bar_p_kPa` | 0.01 |
| Hectopascals per Kilopascal | `skn_const_hPa_p_kPa` | 10 |
| PSI per Bar | `skn_const_PSI_p_Bar` | 14.5038 |
| Kilopascals per Bar | `skn_const_kPa_p_Bar` | 100 |
| Inches of Mercury per Hectopascal | `skn_const_inHg_p_hPa` | 0.02953 |
| PSI per Hectopascal | `skn_const_PSI_p_hPa` | 0.0145038 |
| Kilopascals per Hectopascal | `skn_const_kPa_p_hPa` | 0.1 |
| Bar per Hectopascal | `skn_const_Bar_p_hPa` | 0.001 |
| Hectopascals per Bar | `skn_const_hPa_p_Bar` | 1000 |
| Inches of Mercury per Kilopascal | `skn_const_inHg_p_kPa` | 0.2953 |
| Millimeters of Mercury per Hectopascal | `skn_const_mmHg_p_hPa` | 0.750062 |
| Hectopascals per Inch of Mercury | `skn_const_hPa_p_inHg` | 33.8639 |
| PSI per Inch of Mercury | `skn_const_PSI_p_inHg` | 0.491154 |
| Kilopascals per Inch of Mercury | `skn_const_kPa_p_inHg` | 3.38639 |
| Hectopascals per Millimeter of Mercury | `skn_const_hPa_p_mmHg` | 1.33322 |
| PSI at sea level (per standard Atmosphere) | `skn_const_PSI_p_Atm` | 14.6959 |
| Kilopascals at sea level (per standard Atmosphere) | `skn_const_kPa_p_Atm` | 101.325 |
| Hectopascals at sea level (per standard Atmosphere) | `skn_const_hPa_p_Atm` | 1013.25 |
| Inches of Mercury at sea level (per standard Atmosphere) | `skn_const_inHg_p_Atm` | 29.9213 |

### Temperature

| Label | Name | Value |
|---|---|---|
| °F per °C (a temperature change) | `skn_const_F_p_C` | 1.8 |
| °C per °F (a temperature change) | `skn_const_C_p_F` | 0.555556 |
| Water freezes, °F | `skn_const_F_Freeze` | 32 |
| Water freezes, °C | `skn_const_C_Freeze` | 0 |
| Water boils at sea level, °F | `skn_const_F_Boil` | 212 |
| Water boils at sea level, °C | `skn_const_C_Boil` | 100 |

### Brewing ratios

| Label | Name | Value |
|---|---|---|
| Mash thickness: L/kg per qt/lb | `skn_const_LKg_p_QtLb` | 2.08635 |
| Mash thickness: qt/lb per L/kg | `skn_const_QtLb_p_LKg` | 0.479306 |
| Grain absorption: L/kg per gal/lb | `skn_const_LKg_p_GalLb` | 8.3454 |
| Grain absorption: gal/lb per L/kg | `skn_const_GalLb_p_LKg` | 0.119826 |
| Hop or salt dose: g/L per oz/gal | `skn_const_GL_p_OzGal` | 7.48915 |
| Hop or salt dose: oz/gal per g/L | `skn_const_OzGal_p_GL` | 0.133526 |
| Flow: Liters per Minute per Gallon per Minute | `skn_const_LPM_p_GPM` | 3.78541 |
| Flow: Gallons per Minute per Liter per Minute | `skn_const_GPM_p_LPM` | 0.264172 |

### Length

| Label | Name | Value |
|---|---|---|
| Centimeters per Inch | `skn_const_Cm_p_In` | 2.54 |
| Millimeters per Inch | `skn_const_mm_p_In` | 25.4 |
| Inches per Centimeter | `skn_const_In_p_Cm` | 0.393701 |
| Inches per Millimeter | `skn_const_In_p_mm` | 0.0393701 |
| Meters per Foot | `skn_const_M_p_Ft` | 0.3048 |
| Feet per Meter | `skn_const_Ft_p_M` | 3.28084 |
| Inches per Foot | `skn_const_In_p_Ft` | 12 |
| Feet per Inch | `skn_const_Ft_p_In` | 0.0833333 |
| Centimeters per Meter | `skn_const_Cm_p_M` | 100 |
| Millimeters per Centimeter | `skn_const_mm_p_Cm` | 10 |

### Power

| Label | Name | Value |
|---|---|---|
| BTU per Hour per Watt | `skn_const_BTUh_p_W` | 3.41214 |
| Watts per BTU per Hour | `skn_const_W_p_BTUh` | 0.293071 |
| Watts per Kilowatt | `skn_const_W_p_KW` | 1000 |
| Kilowatts per Watt | `skn_const_KW_p_W` | 0.001 |
| Watts per Horsepower | `skn_const_W_p_HP` | 745.7 |
| Horsepower per Watt | `skn_const_HP_p_W` | 0.00134102 |

### Time (Processes count time in seconds)

| Label | Name | Value |
|---|---|---|
| Seconds per Minute | `skn_const_Sec_p_Min` | 60 |
| Seconds per Hour | `skn_const_Sec_p_Hr` | 3600 |
| Minutes per Hour | `skn_const_Min_p_Hr` | 60 |
| Hours per Day | `skn_const_Hr_p_Day` | 24 |
| Seconds per Day | `skn_const_Sec_p_Day` | 86400 |
| Minutes per Second | `skn_const_Min_p_Sec` | 0.0166667 |
| Hours per Minute | `skn_const_Hr_p_Min` | 0.0166667 |
| Milliseconds per Second | `skn_const_Ms_p_Sec` | 1000 |
| Milliseconds per Minute | `skn_const_Ms_p_Min` | 60000 |
