# Skynet Constants

Skynet Constants are fixed numbers built into Skynet for the conversions brewers use most: weight, volume, pressure, temperature, brewing ratios, length, power and time. Every name starts with **`skc_`**. They are part of Skynet, so nobody can change them (Skynet Rule 3.11), and they are the same on every Brain.

## Using one in a Process

Use a Skynet Constant anywhere a number can go. Multiply the amount by the constant whose name says **from**\_To\_**to**:

```
gGV_Grain_Lb = gGV_Grain_Kg * skc_Kg_To_Lb        // 5 kg -> 11.02 lb
gGV_Strike_L = gGV_Strike_Gal * skc_Gal_To_L
gGV_Hops_G = gGV_Hops_Oz * skc_Oz_To_G
if Kettle_Pressure * skc_PSI_To_kPa > 70
sleep 5 * skc_Min_To_Sec * 1000                  // sleep counts in milliseconds
```

Upper and lower case do not matter: `SKC_KG_TO_LB` is the same constant. The Process editor shows them in blue, like `true`, `false` and `now`.

## Temperature

A temperature needs one more step than the others, because 0 °C is not 0 °F:

```
gGV_Temp_F = gGV_Temp_C * skc_F_Per_C + skc_F_Freeze
gGV_Temp_C = (gGV_Temp_F - skc_F_Freeze) * skc_C_Per_F
```

A temperature **change** (a 2 degree rise, a 10 degree drop) only needs the multiply: `gGV_Rise_F = gGV_Rise_C * skc_F_Per_C`.

## Predictive text

Where a value can go, start typing and the matching Skynet Constants are listed with their value and what they do. Typing `skc_` lists them all, and typing a unit finds every constant that uses it: `Kg` lists `skc_Kg_To_Lb`, `skc_Lb_To_Kg`, `skc_G_To_Kg` and the rest. See [Predictive text](79-predictive-text).

## What you can't do

- A Skynet Constant can't be changed: `skc_Kg_To_Lb = 2` is an error when the Process is checked or saved.
- A Skynet Constant has no attributes: `skc_Kg_To_Lb.value` is an error. Use the name alone.
- Names starting `skc_` are kept for Skynet Constants. No Device, Widget, gGlobal or `new` variable can have one.
- A name that starts `skc_` but is not in the lists below is an error, so a typing mistake is found when you check the Process.

## The Skynet Constants

Volumes are US gallons, quarts and fluid ounces. Values are shown here to 6 figures; Skynet uses them to full accuracy.

### Weight

| Name | Value | What it does |
|---|---|---|
| `skc_Kg_To_G` | 1000 | kilograms to grams |
| `skc_Kg_To_Lb` | 2.20462 | kilograms to pounds |
| `skc_Kg_To_Oz` | 35.274 | kilograms to ounces |
| `skc_G_To_Kg` | 0.001 | grams to kilograms |
| `skc_G_To_Lb` | 0.00220462 | grams to pounds |
| `skc_G_To_Oz` | 0.035274 | grams to ounces |
| `skc_Lb_To_Kg` | 0.453592 | pounds to kilograms |
| `skc_Lb_To_G` | 453.592 | pounds to grams |
| `skc_Lb_To_Oz` | 16 | pounds to ounces |
| `skc_Oz_To_Kg` | 0.0283495 | ounces to kilograms |
| `skc_Oz_To_G` | 28.3495 | ounces to grams |
| `skc_Oz_To_Lb` | 0.0625 | ounces to pounds |

### Volume (US gallons, quarts and fluid ounces)

| Name | Value | What it does |
|---|---|---|
| `skc_Gal_To_L` | 3.78541 | gallons to liters |
| `skc_Gal_To_Qt` | 4 | gallons to quarts |
| `skc_Gal_To_FlOz` | 128 | gallons to fluid ounces |
| `skc_Qt_To_L` | 0.946353 | quarts to liters |
| `skc_Qt_To_Gal` | 0.25 | quarts to gallons |
| `skc_FlOz_To_ML` | 29.5735 | fluid ounces to milliliters |
| `skc_L_To_Gal` | 0.264172 | liters to gallons |
| `skc_L_To_Qt` | 1.05669 | liters to quarts |
| `skc_L_To_ML` | 1000 | liters to milliliters |
| `skc_ML_To_L` | 0.001 | milliliters to liters |
| `skc_ML_To_FlOz` | 0.033814 | milliliters to fluid ounces |
| `skc_BBL_To_Gal` | 31 | US beer barrels to gallons |
| `skc_BBL_To_L` | 117.348 | US beer barrels to liters |
| `skc_L_To_BBL` | 0.00852168 | liters to US beer barrels |
| `skc_HL_To_L` | 100 | hectoliters to liters |

### Pressure

| Name | Value | What it does |
|---|---|---|
| `skc_PSI_To_kPa` | 6.89476 | PSI to kilopascals |
| `skc_PSI_To_Bar` | 0.0689476 | PSI to bar |
| `skc_PSI_To_hPa` | 68.9476 | PSI to hectopascals (millibar) |
| `skc_PSI_To_inHg` | 2.03602 | PSI to inches of mercury |
| `skc_kPa_To_PSI` | 0.145038 | kilopascals to PSI |
| `skc_kPa_To_Bar` | 0.01 | kilopascals to bar |
| `skc_kPa_To_hPa` | 10 | kilopascals to hectopascals (millibar) |
| `skc_Bar_To_PSI` | 14.5038 | bar to PSI |
| `skc_Bar_To_kPa` | 100 | bar to kilopascals |
| `skc_hPa_To_inHg` | 0.02953 | hectopascals (millibar) to inches of mercury |
| `skc_hPa_To_PSI` | 0.0145038 | hectopascals (millibar) to PSI |
| `skc_hPa_To_kPa` | 0.1 | hectopascals (millibar) to kilopascals |
| `skc_inHg_To_hPa` | 33.8639 | inches of mercury to hectopascals (millibar) |
| `skc_inHg_To_PSI` | 0.491154 | inches of mercury to PSI |
| `skc_inHg_To_kPa` | 3.38639 | inches of mercury to kilopascals |
| `skc_mmHg_To_hPa` | 1.33322 | millimeters of mercury to hectopascals (millibar) |
| `skc_Atm_PSI` | 14.6959 | standard sea level pressure in PSI |
| `skc_Atm_kPa` | 101.325 | standard sea level pressure in kilopascals |
| `skc_Atm_hPa` | 1013.25 | standard sea level pressure in hectopascals (millibar) |
| `skc_Atm_inHg` | 29.9213 | standard sea level pressure in inches of mercury |

### Temperature

| Name | Value | What it does |
|---|---|---|
| `skc_F_Per_C` | 1.8 | °F in one °C (also a temperature change in °C to °F) |
| `skc_C_Per_F` | 0.555556 | °C in one °F (also a temperature change in °F to °C) |
| `skc_F_Freeze` | 32 | water freezes, °F |
| `skc_C_Freeze` | 0 | water freezes, °C |
| `skc_F_Boil` | 212 | water boils at sea level, °F |
| `skc_C_Boil` | 100 | water boils at sea level, °C |

### Brewing ratios

| Name | Value | What it does |
|---|---|---|
| `skc_QtLb_To_LKg` | 2.08635 | mash thickness, quarts per pound to liters per kilogram |
| `skc_LKg_To_QtLb` | 0.479306 | mash thickness, liters per kilogram to quarts per pound |
| `skc_GalLb_To_LKg` | 8.3454 | grain absorption, gallons per pound to liters per kilogram |
| `skc_LKg_To_GalLb` | 0.119826 | grain absorption, liters per kilogram to gallons per pound |
| `skc_OzGal_To_GL` | 7.48915 | hop or salt dose, ounces per gallon to grams per liter |
| `skc_GL_To_OzGal` | 0.133526 | hop or salt dose, grams per liter to ounces per gallon |
| `skc_GPM_To_LPM` | 3.78541 | flow, gallons per minute to liters per minute |
| `skc_LPM_To_GPM` | 0.264172 | flow, liters per minute to gallons per minute |

### Length

| Name | Value | What it does |
|---|---|---|
| `skc_In_To_Cm` | 2.54 | inches to centimeters |
| `skc_In_To_Mm` | 25.4 | inches to millimeters |
| `skc_Cm_To_In` | 0.393701 | centimeters to inches |
| `skc_Mm_To_In` | 0.0393701 | millimeters to inches |
| `skc_Ft_To_M` | 0.3048 | feet to meters |
| `skc_M_To_Ft` | 3.28084 | meters to feet |

### Power

| Name | Value | What it does |
|---|---|---|
| `skc_W_To_BTUh` | 3.41214 | watts to BTU per hour |
| `skc_BTUh_To_W` | 0.293071 | BTU per hour to watts |
| `skc_KW_To_W` | 1000 | kilowatts to watts |

### Time (Processes count time in seconds)

| Name | Value | What it does |
|---|---|---|
| `skc_Min_To_Sec` | 60 | minutes to seconds |
| `skc_Hr_To_Sec` | 3600 | hours to seconds |
| `skc_Hr_To_Min` | 60 | hours to minutes |
| `skc_Day_To_Hr` | 24 | days to hours |
| `skc_Day_To_Sec` | 86400 | days to seconds |
