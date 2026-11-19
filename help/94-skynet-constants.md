# Skynet Constants

Skynet Constants are fixed numbers built into Skynet for the conversions brewers use most: weight, fractions and water, volume (US and Imperial), pressure, temperature, brewing ratios, length, power and time. They are part of Skynet, so nobody can change them (Skynet Rule 3.11), and they are the same on every Brain.

Each one has two names that mean the same number:

- a **short name**, read as "this many A in one B": `L_p_Gal` is the liters in one gallon (3.785). `_p_` means **per**.
- a **long name** that starts with **`skc_`** and says from\_To\_to: `skc_Gal_To_L`. The long names came first and keep working.

Upper and lower case do not matter: `l_p_gal`, `L_P_GAL` and `L_p_Gal` are the same constant, so no two constants differ only by capitals.

A gallon, quart, pint or fluid ounce is always the **US** one. An **Imperial** (UK) unit has **Im** in its name: `L_p_ImGal` is 4.546.

## The list in the Process editor

In the Process editor, **📐 Constants** shows every Skynet Constant with its short name, value and what it does. Type in its Find box to narrow it (`gal`, `oz`, `psi`, `water`). Click a line to put that constant at the cursor.

## Using one in a Process

Use a Skynet Constant anywhere a number can go. Multiply the amount by the constant:

```
gGV_Batch_L = gGV_Batch_Gal * L_p_Gal          // 5 gal -> 18.93 L
gGV_Grain_Lb = gGV_Grain_Kg * Lb_p_Kg          // 5 kg -> 11.02 lb
gGV_Hops_G = gGV_Hops_Oz * g_p_Oz
gGV_Salt_Ppm = gGV_Salt_G_per_Gal * Ppm_p_GGal
if Kettle_Pressure * kPa_p_PSI > 70
sleep 5 * Ms_p_Min                             // sleep counts in milliseconds
gGV_Grain_Lb = gGV_Grain_Kg * skc_Kg_To_Lb     // the long name works too
```

Skynet keeps its data in metric (Rule 2.59), so a Process seldom needs a constant to read a value. They are for numbers you type or show.

## Temperature

A temperature needs more than a multiply, because 0 °C is not 0 °F. Use **`toF( )`** and **`toC( )`**:

```
gGV_Temp_F = toF(gGV_Temp_C)                   // °C to °F: x × 1.8 + 32
gGV_Temp_C = toC(gGV_Temp_F)                   // °F to °C: (x − 32) ÷ 1.8
vSMsg = "Strike " + toF(gGV_Strike_C) + " °F"
```

A temperature **change** (a 2 degree rise, a 10 degree drop) only needs the multiply: `gGV_Rise_F = gGV_Rise_C * F_p_C`.

The long way still works: `gGV_Temp_F = gGV_Temp_C * skc_F_Per_C + skc_F_Freeze`.

## Predictive text

Where a value can go, start typing and the matching Skynet Constants are listed with their value and what they do, short names and long names both. Typing a unit finds every constant that uses it: `Gal` lists `L_p_Gal`, `Gal_p_L`, `skc_Gal_To_L` and the rest. Typing `to` offers `toF(` and `toC(`. See [Predictive text](79-predictive-text).

## Reserved words

The short names, `toF` and `toC` are **reserved words**, in any capitals. No Device, Widget, gGlobal or `new` variable can be called one: the name box says so when you type it, and gives a name to use instead (`L_p_Gal_1`).

Names starting `skc_` are kept for Skynet Constants too.

An item that already had such a name (made before that constant was added to Skynet) **keeps its name** (Rule 3.2). Skynet shows one notice when it starts, and the Process check gives a warning on each line that reads that name on its own, because the name alone reads the constant. Use `L_p_Gal.value` for your item.

## What you can't do

- A Skynet Constant can't be changed: `L_p_Gal = 2` or `skc_Kg_To_Lb = 2` is an error when the Process is checked or saved.
- A long `skc_` name has no attributes: `skc_Kg_To_Lb.value` is an error. Use the name alone.
- `toF` and `toC` need a value in ( ): `toF(x)`.
- A name that starts `skc_` but is not in the lists below is an error, so a typing mistake is found when you check the Process.

## New constants

When a new Skynet feature needs a conversion that is not here, it is added to this list with the feature (Rule 1.17).

## The Skynet Constants

Volumes are US units unless the name has Im (Imperial). Values are shown here to 6 figures; Skynet uses them to full accuracy. A constant with no short name (-) is a fixed point, such as where water freezes; use `toF( )` and `toC( )` for temperatures.

### Weight

| Short name | Name | Value | What it does |
|---|---|---|---|
| `g_p_Kg` | `skc_Kg_To_G` | 1000 | kilograms to grams |
| `Lb_p_Kg` | `skc_Kg_To_Lb` | 2.20462 | kilograms to pounds |
| `Oz_p_Kg` | `skc_Kg_To_Oz` | 35.274 | kilograms to ounces |
| `Kg_p_g` | `skc_G_To_Kg` | 0.001 | grams to kilograms |
| `Lb_p_g` | `skc_G_To_Lb` | 0.00220462 | grams to pounds |
| `Oz_p_g` | `skc_G_To_Oz` | 0.035274 | grams to ounces |
| `Kg_p_Lb` | `skc_Lb_To_Kg` | 0.453592 | pounds to kilograms |
| `g_p_Lb` | `skc_Lb_To_G` | 453.592 | pounds to grams |
| `Oz_p_Lb` | `skc_Lb_To_Oz` | 16 | pounds to ounces |
| `Kg_p_Oz` | `skc_Oz_To_Kg` | 0.0283495 | ounces to kilograms |
| `g_p_Oz` | `skc_Oz_To_G` | 28.3495 | ounces to grams |
| `Lb_p_Oz` | `skc_Oz_To_Lb` | 0.0625 | ounces to pounds |
| `mg_p_g` | `skc_G_To_Mg` | 1000 | grams to milligrams |
| `g_p_mg` | `skc_Mg_To_G` | 0.001 | milligrams to grams |
| `mg_p_Oz` | `skc_Oz_To_Mg` | 28349.5 | ounces to milligrams |
| `mg_p_Kg` | `skc_Kg_To_Mg` | 1000000 | kilograms to milligrams |

### Fractions and water (weight in water)

| Short name | Name | Value | What it does |
|---|---|---|---|
| `Frac_p_Pct` | `skc_Pct_To_Frac` | 0.01 | percent to a fraction (12.5 % is 0.125) |
| `Pct_p_Frac` | `skc_Frac_To_Pct` | 100 | a fraction to percent (0.125 is 12.5 %) |
| `MgL_p_Ppm` | `skc_Ppm_To_MgL` | 1 | parts per million to milligrams per liter (the same in water) |
| `Ppm_p_MgL` | `skc_MgL_To_Ppm` | 1 | milligrams per liter to parts per million (the same in water) |
| `Ppm_p_GL` | `skc_GL_To_Ppm` | 1000 | grams per liter to parts per million |
| `GL_p_Ppm` | `skc_Ppm_To_GL` | 0.001 | parts per million to grams per liter |
| `Ppm_p_GGal` | `skc_GGal_To_Ppm` | 264.172 | water salts, grams per US gallon to parts per million |
| `GGal_p_Ppm` | `skc_Ppm_To_GGal` | 0.00378541 | water salts, parts per million to grams per US gallon |

### Volume (US gallons, quarts and fluid ounces)

| Short name | Name | Value | What it does |
|---|---|---|---|
| `L_p_Gal` | `skc_Gal_To_L` | 3.78541 | gallons to liters |
| `Qt_p_Gal` | `skc_Gal_To_Qt` | 4 | gallons to quarts |
| `FlOz_p_Gal` | `skc_Gal_To_FlOz` | 128 | gallons to fluid ounces |
| `L_p_Qt` | `skc_Qt_To_L` | 0.946353 | quarts to liters |
| `Gal_p_Qt` | `skc_Qt_To_Gal` | 0.25 | quarts to gallons |
| `mL_p_FlOz` | `skc_FlOz_To_ML` | 29.5735 | fluid ounces to milliliters |
| `Gal_p_L` | `skc_L_To_Gal` | 0.264172 | liters to gallons |
| `Qt_p_L` | `skc_L_To_Qt` | 1.05669 | liters to quarts |
| `mL_p_L` | `skc_L_To_ML` | 1000 | liters to milliliters |
| `L_p_mL` | `skc_ML_To_L` | 0.001 | milliliters to liters |
| `FlOz_p_mL` | `skc_ML_To_FlOz` | 0.033814 | milliliters to fluid ounces |
| `Gal_p_BBL` | `skc_BBL_To_Gal` | 31 | US beer barrels to gallons |
| `L_p_BBL` | `skc_BBL_To_L` | 117.348 | US beer barrels to liters |
| `BBL_p_L` | `skc_L_To_BBL` | 0.00852168 | liters to US beer barrels |
| `L_p_HL` | `skc_HL_To_L` | 100 | hectoliters to liters |
| `HL_p_L` | `skc_L_To_HL` | 0.01 | liters to hectoliters |
| `mL_p_Gal` | `skc_Gal_To_ML` | 3785.41 | gallons to milliliters |
| `Pt_p_Gal` | `skc_Gal_To_Pt` | 8 | gallons to pints |
| `Pt_p_Qt` | `skc_Qt_To_Pt` | 2 | quarts to pints |
| `FlOz_p_Qt` | `skc_Qt_To_FlOz` | 32 | quarts to fluid ounces |
| `FlOz_p_Pt` | `skc_Pt_To_FlOz` | 16 | pints to fluid ounces |
| `mL_p_Pt` | `skc_Pt_To_ML` | 473.176 | pints to milliliters |
| `Pt_p_mL` | `skc_ML_To_Pt` | 0.00211338 | milliliters to pints |
| `L_p_FlOz` | `skc_FlOz_To_L` | 0.0295735 | fluid ounces to liters |
| `FlOz_p_L` | `skc_L_To_FlOz` | 33.814 | liters to fluid ounces |
| `FlOz_p_Cup` | `skc_Cup_To_FlOz` | 8 | cups to fluid ounces |
| `mL_p_Cup` | `skc_Cup_To_ML` | 236.588 | cups to milliliters |
| `Tbsp_p_FlOz` | `skc_FlOz_To_Tbsp` | 2 | fluid ounces to tablespoons |
| `Tsp_p_Tbsp` | `skc_Tbsp_To_Tsp` | 3 | tablespoons to teaspoons |
| `mL_p_Tbsp` | `skc_Tbsp_To_ML` | 14.7868 | tablespoons to milliliters |
| `mL_p_Tsp` | `skc_Tsp_To_ML` | 4.92892 | teaspoons to milliliters |
| `Tbsp_p_mL` | `skc_ML_To_Tbsp` | 0.067628 | milliliters to tablespoons |
| `Tsp_p_mL` | `skc_ML_To_Tsp` | 0.202884 | milliliters to teaspoons |

### Volume (Imperial, used in the UK: Im in the name)

| Short name | Name | Value | What it does |
|---|---|---|---|
| `L_p_ImGal` | `skc_ImGal_To_L` | 4.54609 | Imperial gallons to liters |
| `ImGal_p_L` | `skc_L_To_ImGal` | 0.219969 | liters to Imperial gallons |
| `Gal_p_ImGal` | `skc_ImGal_To_Gal` | 1.20095 | Imperial gallons to US gallons |
| `ImGal_p_Gal` | `skc_Gal_To_ImGal` | 0.832674 | US gallons to Imperial gallons |
| `ImPt_p_ImGal` | `skc_ImGal_To_ImPt` | 8 | Imperial gallons to Imperial pints |
| `mL_p_ImPt` | `skc_ImPt_To_ML` | 568.261 | Imperial pints to milliliters |
| `ImPt_p_mL` | `skc_ML_To_ImPt` | 0.00175975 | milliliters to Imperial pints |
| `ImFlOz_p_ImPt` | `skc_ImPt_To_ImFlOz` | 20 | Imperial pints to Imperial fluid ounces |
| `mL_p_ImFlOz` | `skc_ImFlOz_To_ML` | 28.4131 | Imperial fluid ounces to milliliters |
| `ImFlOz_p_mL` | `skc_ML_To_ImFlOz` | 0.0351951 | milliliters to Imperial fluid ounces |
| `L_p_ImBBL` | `skc_ImBBL_To_L` | 163.659 | UK beer barrels (36 Imperial gallons) to liters |
| `ImBBL_p_L` | `skc_L_To_ImBBL` | 0.00611026 | liters to UK beer barrels |

### Pressure

| Short name | Name | Value | What it does |
|---|---|---|---|
| `kPa_p_PSI` | `skc_PSI_To_kPa` | 6.89476 | PSI to kilopascals |
| `Bar_p_PSI` | `skc_PSI_To_Bar` | 0.0689476 | PSI to bar |
| `hPa_p_PSI` | `skc_PSI_To_hPa` | 68.9476 | PSI to hectopascals (millibar) |
| `inHg_p_PSI` | `skc_PSI_To_inHg` | 2.03602 | PSI to inches of mercury |
| `PSI_p_kPa` | `skc_kPa_To_PSI` | 0.145038 | kilopascals to PSI |
| `Bar_p_kPa` | `skc_kPa_To_Bar` | 0.01 | kilopascals to bar |
| `hPa_p_kPa` | `skc_kPa_To_hPa` | 10 | kilopascals to hectopascals (millibar) |
| `PSI_p_Bar` | `skc_Bar_To_PSI` | 14.5038 | bar to PSI |
| `kPa_p_Bar` | `skc_Bar_To_kPa` | 100 | bar to kilopascals |
| `inHg_p_hPa` | `skc_hPa_To_inHg` | 0.02953 | hectopascals (millibar) to inches of mercury |
| `PSI_p_hPa` | `skc_hPa_To_PSI` | 0.0145038 | hectopascals (millibar) to PSI |
| `kPa_p_hPa` | `skc_hPa_To_kPa` | 0.1 | hectopascals (millibar) to kilopascals |
| `Bar_p_hPa` | `skc_hPa_To_Bar` | 0.001 | hectopascals (millibar) to bar |
| `hPa_p_Bar` | `skc_Bar_To_hPa` | 1000 | bar to hectopascals (millibar) |
| `inHg_p_kPa` | `skc_kPa_To_inHg` | 0.2953 | kilopascals to inches of mercury |
| `mmHg_p_hPa` | `skc_hPa_To_mmHg` | 0.750062 | hectopascals (millibar) to millimeters of mercury |
| `hPa_p_inHg` | `skc_inHg_To_hPa` | 33.8639 | inches of mercury to hectopascals (millibar) |
| `PSI_p_inHg` | `skc_inHg_To_PSI` | 0.491154 | inches of mercury to PSI |
| `kPa_p_inHg` | `skc_inHg_To_kPa` | 3.38639 | inches of mercury to kilopascals |
| `hPa_p_mmHg` | `skc_mmHg_To_hPa` | 1.33322 | millimeters of mercury to hectopascals (millibar) |
| `PSI_p_Atm` | `skc_Atm_PSI` | 14.6959 | standard sea level pressure in PSI |
| `kPa_p_Atm` | `skc_Atm_kPa` | 101.325 | standard sea level pressure in kilopascals |
| `hPa_p_Atm` | `skc_Atm_hPa` | 1013.25 | standard sea level pressure in hectopascals (millibar) |
| `inHg_p_Atm` | `skc_Atm_inHg` | 29.9213 | standard sea level pressure in inches of mercury |

### Temperature

| Short name | Name | Value | What it does |
|---|---|---|---|
| `F_p_C` | `skc_F_Per_C` | 1.8 | °F in one °C (also a temperature change in °C to °F) |
| `C_p_F` | `skc_C_Per_F` | 0.555556 | °C in one °F (also a temperature change in °F to °C) |
| - | `skc_F_Freeze` | 32 | water freezes, °F |
| - | `skc_C_Freeze` | 0 | water freezes, °C |
| - | `skc_F_Boil` | 212 | water boils at sea level, °F |
| - | `skc_C_Boil` | 100 | water boils at sea level, °C |

### Brewing ratios

| Short name | Name | Value | What it does |
|---|---|---|---|
| `LKg_p_QtLb` | `skc_QtLb_To_LKg` | 2.08635 | mash thickness, quarts per pound to liters per kilogram |
| `QtLb_p_LKg` | `skc_LKg_To_QtLb` | 0.479306 | mash thickness, liters per kilogram to quarts per pound |
| `LKg_p_GalLb` | `skc_GalLb_To_LKg` | 8.3454 | grain absorption, gallons per pound to liters per kilogram |
| `GalLb_p_LKg` | `skc_LKg_To_GalLb` | 0.119826 | grain absorption, liters per kilogram to gallons per pound |
| `GL_p_OzGal` | `skc_OzGal_To_GL` | 7.48915 | hop or salt dose, ounces per gallon to grams per liter |
| `OzGal_p_GL` | `skc_GL_To_OzGal` | 0.133526 | hop or salt dose, grams per liter to ounces per gallon |
| `LPM_p_GPM` | `skc_GPM_To_LPM` | 3.78541 | flow, gallons per minute to liters per minute |
| `GPM_p_LPM` | `skc_LPM_To_GPM` | 0.264172 | flow, liters per minute to gallons per minute |

### Length

| Short name | Name | Value | What it does |
|---|---|---|---|
| `Cm_p_In` | `skc_In_To_Cm` | 2.54 | inches to centimeters |
| `mm_p_In` | `skc_In_To_Mm` | 25.4 | inches to millimeters |
| `In_p_Cm` | `skc_Cm_To_In` | 0.393701 | centimeters to inches |
| `In_p_mm` | `skc_Mm_To_In` | 0.0393701 | millimeters to inches |
| `M_p_Ft` | `skc_Ft_To_M` | 0.3048 | feet to meters |
| `Ft_p_M` | `skc_M_To_Ft` | 3.28084 | meters to feet |
| `In_p_Ft` | `skc_Ft_To_In` | 12 | feet to inches |
| `Ft_p_In` | `skc_In_To_Ft` | 0.0833333 | inches to feet |
| `Cm_p_M` | `skc_M_To_Cm` | 100 | meters to centimeters |
| `mm_p_Cm` | `skc_Cm_To_Mm` | 10 | centimeters to millimeters |

### Power

| Short name | Name | Value | What it does |
|---|---|---|---|
| `BTUh_p_W` | `skc_W_To_BTUh` | 3.41214 | watts to BTU per hour |
| `W_p_BTUh` | `skc_BTUh_To_W` | 0.293071 | BTU per hour to watts |
| `W_p_KW` | `skc_KW_To_W` | 1000 | kilowatts to watts |
| `KW_p_W` | `skc_W_To_KW` | 0.001 | watts to kilowatts |
| `W_p_HP` | `skc_HP_To_W` | 745.7 | horsepower (a pump motor) to watts |
| `HP_p_W` | `skc_W_To_HP` | 0.00134102 | watts to horsepower |

### Time (Processes count time in seconds)

| Short name | Name | Value | What it does |
|---|---|---|---|
| `Sec_p_Min` | `skc_Min_To_Sec` | 60 | minutes to seconds |
| `Sec_p_Hr` | `skc_Hr_To_Sec` | 3600 | hours to seconds |
| `Min_p_Hr` | `skc_Hr_To_Min` | 60 | hours to minutes |
| `Hr_p_Day` | `skc_Day_To_Hr` | 24 | days to hours |
| `Sec_p_Day` | `skc_Day_To_Sec` | 86400 | days to seconds |
| `Min_p_Sec` | `skc_Sec_To_Min` | 0.0166667 | seconds to minutes |
| `Hr_p_Min` | `skc_Min_To_Hr` | 0.0166667 | minutes to hours |
| `Ms_p_Sec` | `skc_Sec_To_Ms` | 1000 | seconds to milliseconds (sleep counts in milliseconds) |
| `Ms_p_Min` | `skc_Min_To_Ms` | 60000 | minutes to milliseconds (sleep counts in milliseconds) |
