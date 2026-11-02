# The Recipe tab

Press **☰ Menu** and pick **Recipe**. This is the Recipe for brew day. Bring it in from BeerSmith, or start a new one and fill it in. There is no limit on how many grains, hops, yeasts or adjuncts it has.

Along the top:

- **IMPORT** brings in a recipe file (below).
- **NEW** clears the Recipe and starts one from the Defaults (☰ Menu > Default).
- **Library ...** opens a saved Recipe, saves this one (💾), or deletes a saved one. Saved Recipes are on the Brain in `config/recipes`.
- **Cancel** and **Save**.

## The boxes

Each box has a colored top that says what kind it is:

- **Black**: names (Beer Name, Style, Brew Length).
- **Grey**: times and choices (Sparge Type, Sparge Minutes, Boil Minutes, Whirlpool Minutes, Grain Ratio).
- **Blue**: volumes (Strike Volume, Sparge Volume, PreBoil Volume).
- **Red**: temperatures (Strike, Grain and Sparge Temperature, Pitch At).
- **Light grey**: worked out by Skynet, not typed: **Grain Wt.**, **1st Mash** and **IBU** come from the Grain, MASH and HOPs tabs.

Most boxes can be changed. **Style** is a dropdown; **Add new ...** adds a style to it.

Press **Calculate** to work out the Total Grain Weight, the Hop Drops, Warnings and Messages, the 1st Mash temperature, the IBU (from each hop's Actual AAU), and the Strike Volume and Temperature and the Sparge Volume and Temperature, from the Grain Temperature and Grain Ratio. Then press **Save**. An imported recipe comes in already worked out.

The Recipe is kept in kilograms, liters and °C. It shows in the units you pick on the Default tab (see **Recipe defaults** below).

## Skynet_Fields

Every box on the Recipe tab and its Daughter Tabs is a **Skynet_Field**: it has a fixed Skynet name that starts with `rcp_`, shown when the mouse rests on the box. A Process reads them (they are read only there), for example `rcp_Strike_Temp`, `rcp_Boil_Minutes` or `rcp_Pitch_Temp`. The names never change.

| Box | Skynet_Field |
|---|---|
| Beer Name | `rcp_Name` |
| Style | `rcp_Style` |
| Brew Length | `rcp_Batch_Volume` |
| Grain Wt. | `rcp_Total_Grain_Weight` |
| 1st Mash | `rcp_First_Mash_Temp` |
| IBU | `rcp_IBU` |
| Expected Gravity | `rcp_Expected_Gravity` |
| Strike Volume | `rcp_Strike_Volume` |
| Strike Temperature | `rcp_Strike_Temp` |
| Grain Temperature | `rcp_Grain_Temp` |
| Sparge Volume | `rcp_Sparge_Volume` |
| Sparge Type | `rcp_Sparge_Type` |
| Sparge Minutes | `rcp_Sparge_Minutes` |
| Sparge Temperature | `rcp_Sparge_Temp` |
| PreBoil Volume | `rcp_Boil_Volume` |
| Boil Minutes | `rcp_Boil_Minutes` |
| Whirlpool Minutes | `rcp_Whirlpool_Minutes` |
| Pitch At | `rcp_Pitch_Temp` |
| Grain Ratio | `rcp_Grain_Ratio` |
| Waters: Water Profile | `rcp_Water_Profile` |
| MASH: Mash Profile | `rcp_Mash_Profile` |
| Hops tab: how many hop lines | `rcp_Hop_Count` |

Each line on the Hops tab has its own Skynet_Fields, N = the line number (1, 2, 3 ... with no limit):

| Box on the Hops tab | Skynet_Field |
|---|---|
| Hop N (its name) | `rcp_Hop_N_Name` |
| Ounces (or Grams) | `rcp_Hop_N_Amount` |
| AAU % Recipe | `rcp_Hop_N_AA_Recipe` |
| AAU % Actual | `rcp_Hop_N_AA_Actual` |
| Calc oz | `rcp_Hop_N_Calc_Amount` |
| Boil, Mash, 1st Wort, Secondary, Dry Hop or Whirlpool | `rcp_Hop_N_Use` |
| Hop N Min | `rcp_Hop_N_Min` |
| Hop N Drop | `rcp_Hop_N_Drop` |
| Hop N IBU | `rcp_Hop_N_IBU` |
| Hop N Boil Group | `rcp_Hop_N_Boil_Group` |
| Secondary or Dry Hop Days | `rcp_Hop_N_Days` |
| Secondary or Dry Hop Date | `rcp_Hop_N_Date` |
| Whirlpool Temperature | `rcp_Hop_N_Whirlpool_Temp` |
| Hop Rocket | `rcp_Hop_N_Hop_Rocket` |

For example `rcp_Hop_1_Name` is the first hop. A line the Recipe does not have reads as empty (or 0).

The Grain and Fermentable tabs work the same way: `rcp_Grain_Count`, `rcp_Grain_N_Name`, `_Amount`, `_Potential`, `_SRM`, `_PPG_SG`, and `rcp_Fermentable_Count`, `rcp_Fermentable_N_Name`, `_Type`, `_Amount`, `_Potential`, `_SRM`, `_PPG_SG`, `_After_Boil`.

## The Daughter Tabs

The buttons under the boxes open the Daughter Tabs. **◀ Back to the Recipe tab** (or **Recipe** in the title) comes back.

- **HOPs**: add, edit or delete hops. The Actual AAU of the hops used in the brew MUST be updated; the amounts are adjusted from it to keep the IBUs.
- **Drops**: the hop drop groups, the pre warning times and the alert texts, worked out from the hops (see **Hop schedule and alerts**).
- **Grain**: add, edit or delete grains. Their total weight is the Grain Wt.
- **Fermentable**: add, edit or delete the other fermentables: adjuncts, extracts, sugars, fruit and juice.
- **Yeast**: add, edit or delete yeasts and yeast starters.
- **Adjuncts**: add, edit or delete adjuncts such as Whirlfloc, yeast nutrient or gypsum (BeerSmith calls them Misc).
- **Waters**: the Water Profile.
- **MASH**: the Mash Profile.

The Hops, Grain, Fermentable, Adjuncts, MASH and Waters tabs are built (below). The other tabs' own boxes come next. Until then each shows what the Recipe holds for it, and Waters and MASH have the profile dropdowns.

## The Hops tab

One line for each hop, with no limit. **Add Hop +** puts a new line at the bottom; **Delete** on a line takes it away.

- **Hop N**: the hop's name.
- **Ounces** (or Grams, as picked on the Default tab): the amount in the recipe.
- **AAU % Recipe** and **Actual** (red): the alpha acid of the hop in the recipe, and of the hops you have (on the package). **Type the Actual for every hop.** It starts at 0, for an imported hop and for a new one.
- **Calc oz**: the amount to use with the Actual AAU, so the beer gets the IBUs of the recipe.
- **Hop N Min**: boil minutes. Min = the Boil Time is a Start of Boil hop.
- **Hop N Drop**: minutes into the boil when it goes in. **Hop N IBU**: its bitterness. **Hop N Boil Group**: hops that go in at the same time are one group (the Drops tab).

**Outside of Boil Hops.** The square box on a line opens a dialog with switches: **Mash Hops, 1st WORT Hops, Secondary Hops, DRY Hops, Whirlpool**. Turn one on and press **Save**: the hop is no longer a Boil Hop, so the dialog stays on its line (in place of Min, Drop, IBU and Boil Group) until you turn the switch off and Save. With no switch on, **Cancel** or **Save** closes the dialog.

- **Secondary Hops** and **DRY Hops**: the date and the days.
- **Whirlpool**: the temperature, the minutes, and **Hop Rocket** when the whirlpool runs through a Hop Rocket.

**Order.** On **Calculate** and on **Save** the lines go in order: Boil Hops by drop time (a Start of Boil hop first, then by Minutes), then Mash, 1st WORT, Secondary, DRY and Whirlpool hops.

**Calculate needs every Actual AAU above 0.** The recipe is based on the Recipe AAU, but the real IBUs of a brew come from the Actual AAU, the AAU on the hop package. When any Actual AAU is 0, nothing is calculated: Skynet switches to the Hops tab, highlights each Actual AAU that is 0 and shows a warning. Press **READ** to close it, fix the Actual AAUs and press Calculate again.

## The Grain and Fermentable tabs

A recipe's fermentables are split over two tabs. **Grain** holds the ones of Type Grain (the Type is not shown). **Fermentable** holds every other Type, picked from the **Type** dropdown (the BeerXML list: Adjunct, Extract, Dry Extract, Sugar). Each Fermentable line also has a **Measurement** dropdown (Pounds, Ounces, Kilograms, Grams) for its own Amount. Both dropdowns are select only. **Add Grain +** or **Fermentable +** puts a new line at the bottom; **Delete** takes one away. There is no limit.

- **Name**, the weight, **Potential** (the yield, %), **SRM** (the color) and **PPG>SG**, its gravity points (worked out).
- The weight shows in the **grain weight standard** picked on ☰ Menu > Default (Pounds or Kg). An imported BeerSmith or BeerXML file is shown in it too. Its label, and the PPG>SG label, can be changed only on the Default tab.
- **Gravity points** = Potential × 46.214 × pounds × efficiency ÷ gallons in the batch. Grains and adjuncts use the brewhouse efficiency; extracts, sugars, fruit and juice give all their sugar. The points of every line add up to the **Expected Gravity** box on the Recipe tab (1 + points ÷ 1000), worked out whenever an amount changes, and by Calculate. It needs the Brew Length.
- **After Boil** (Fermentable tab only): a switch, shown only for the Types a brewer adds during or after the boil (Extract, Dry Extract, Sugar, Fruit, Juice). On means it goes in after the boil. Grain is never added after the boil, so the Grain tab has none.

Each tab shows its total weight. An import brings every grain field in (notes, protein, moisture and the rest too), ready for later.

## The Adjuncts tab

Whirlfloc, yeast nutrient, gypsum, spices: what BeerSmith and BeerXML call Misc. **Adjunct +** adds a line, **Delete** takes one away, no limit.

- **Adjunct N** (the name), **Amount** and **Measurement** (mg, g, oz, lb, kg, ml, tsp, tbsp, cup, pt, qt, l, gal or items).
- **Type**: Spice, Fining, Water Agent, Herb, Flavor or Other. **Use**: Boil, Mash, Primary, Secondary or Bottling.
- **Time** and **Time Unit** (min, hr, day, week). For a Boil adjunct the box says **Boil Min**: minutes left in the boil when it goes in. A Boil adjunct gets a warning and a drop alert like a hop (the Drops tab).

The dropdowns are select only, with the BeerXML lists. Flaked grains and other adjuncts that add sugar are on the Fermentable tab, so they count in the Expected Gravity. Skynet_Fields: `rcp_Adjunct_Count`, `rcp_Adjunct_N_Name`, `_Amount`, `_Measurement`, `_Type`, `_Use`, `_Time`, `_Time_Unit`.

## The MASH tab

Pick the **Mash Profile**: a Skynet Template, one of your own (☰ Menu > Mash Profile), or **the Recipe's own mash** (the mash from the recipe file, or one you type here).

- A picked profile shows read only: each **Step** with its **Temp** and **Time**, then the sparge (type, temperature, batch rest) and the mash out. **⧉ Copy into this Recipe** makes it the Recipe's own mash so you can change it here.
- The Recipe's own mash: **Mash Step +** adds a step, **Delete** takes one away, and the sparge boxes are the same as on the Recipe tab.
- Calculate on the Recipe tab uses the first step for the 1st Mash and the strike water.

Two Skynet Templates were made for Fritz: **Skynet Single Step, Batch Sparge** (152 °F for 60 minutes, mash out at 168 °F, batch sparge with a 10 minute rest) and **Skynet 3 Mash Steps, Fly Sparge** (122 °F for 15, 146 °F for 30, 158 °F for 20 minutes, mash out at 168 °F, fly sparge with 168 °F water).

Skynet_Fields: `rcp_Mash_Profile`, `rcp_Mash_Step_N_Name`, `rcp_Mash_Step_N_Temp`, `rcp_Mash_Step_N_Time`.

## The Waters tab

Pick the **Water Profile**. Its minerals show after the distilled or RO cut (Calcium, Magnesium, Sodium, Sulfate, Chloride, Bicarbonate, in ppm), with the **% Distilled / RO**, the **SO4 : Cl** ratio (above 2 crisp and hoppy, below 1 round and malty) and the **pH**. They are read only here; change the profile on ☰ Menu > Water Profile. Below them are the waters the recipe file listed.

Skynet_Fields: `rcp_Water_Profile`, `rcp_Water_Ca`, `rcp_Water_Mg`, `rcp_Water_Na`, `rcp_Water_SO4`, `rcp_Water_Cl`, `rcp_Water_HCO3`, `rcp_Water_Distilled_Pct`, `rcp_Water_SO4_Cl`, `rcp_Water_PH`.

## Importing a BeerSmith file

Two kinds of file come in, and both bring every grain, hop, yeast, misc item, water and mash step:

- **.bsmx**: the file BeerSmith 3 and BeerSmith 4 save recipes in. This is the better one to use. If the file holds many recipes (a whole folder), Skynet asks which one.
- **BeerXML .xml**: in BeerSmith use **File > Export > BeerXML**. Most other recipe programs can export it too.

Note: inside a .bsmx file BeerSmith keeps its own US units: weights in **ounces**, volumes in **fluid ounces**, temperatures in **°F**. A Misc item keeps the unit you gave it in BeerSmith (tsp, g, oz ...). Skynet turns them all into its own units as it reads the file. (BeerXML files use kilograms and liters.)

You can also import from the **Import** page, from Node-RED (POST the file to `/api/import/recipe?file=MyBeer.bsmx`), or from a Process (below).

## Mash Profile: Skynet or your own

The Mash Profile dropdown (MASH tab) lists your own Mash Profiles and the **Skynet** ones: Single Infusion (light, medium and full body, and no mash out), Step Mash with a Protein Rest, Step Mash Beta and Alpha, Hochkurz and BIAB. Skynet ones cannot be changed; on ☰ Menu > Mash Profile pick **Add new ...** and start from a copy of one to make your own.

## Water Profile

Press **☰ Menu** and pick **Water Profile**. Type your water report (calcium, magnesium, sodium, sulfate, chloride, bicarbonate in ppm, and pH), then how much of the water is **distilled or RO** (50% = half and half). Skynet shows the water you brew with and its sulfate to chloride ratio.

Skynet Water Profiles are there too (Distilled or RO, Balanced, Pale Ale Hoppy, Malty, Pilsen, Burton, Dublin, Munich, London). Like the Skynet Mash Profiles they cannot be changed, but can be copied.

## Hop schedule and alerts

Skynet puts the hops in brew day order, as the OakBarn Hop Warnings did: **Top of Mash, 1st Wort, Start of Boil, then the boil hops (Bitter, Flavor, Aroma), Whirlpool, Dry Hop**. Hops that go in at the same time make one **Hop Group**.

Each boil Hop Group (and each Boil Misc item) gets:

- a **warning** before it goes in (10 minutes unless changed on the Default tab), and
- a **drop** alert when it goes in.

When two alerts land at the same time, for example a drop and the next group's warning, Skynet makes **one alert that has both**. The Drops tab marks those with ⚠ and lists them under the alerts.

On brew day each alert shows as a bar at the top of every screen (green for a warning, red for a drop) and stays until it is closed. With sound on, it plays the alert sound (if one is set on the Default tab) and then says the alert out loud.

Start the alerts from a Process (below), or with **▶ Start hop alerts** on the Drops tab. They can run on Skynet's own clock from that moment, or follow a countdown **timer** such as the Boil timer, so a paused timer or the Simulator's time skips are followed too.

## Voice and audio files

Each alert can have its own voice file in `media/Audio/Hops`. The Drops tab shows its name. When the file is there, it plays; when not, the browser's own voice reads the alert (every common browser has one, on computers and phones, with no web site needed).

To make a voice file:

1. Press **1 Copy words**.
2. Press **2 Open voice site** (a free text to voice web site opens), paste the words, pick a voice and download the MP3.
3. Press **3 Put the file here** and pick the MP3. Skynet saves it under the right name.

Skynet does not fetch the voice from the web site by itself: free voice sites do not let programs in, so this is done by hand.

## Recipe defaults

On **☰ Menu > Default**:

- **Water Profile**, **Boil time**, **Brewhouse efficiency**, **Water to grain ratio**, **Grain temperature** and **Strike offset**: what a new Recipe starts with. Each can be changed in the Recipe.
- **How amounts show**: grains (lb, kg, oz, g), hops (oz, g), volumes (gal, L, qt), temperatures (°F, °C), water to grain (qt/lb, L/kg) and misc items (as the recipe gives them, metric, or US).
- **Hop alerts**: minutes of warning before each drop, how close two alerts must be to become one, a sound before each alert, saying them out loud, and which browser voice.

## In a Process

```
import_recipe "Recipes/Zombie Dust.bsmx"
import_recipe "Recipes/All My Recipes.bsmx", "Zombie Dust"
start_hop_alerts
start_hop_alerts "Boil_Timer"
stop_hop_alerts
```

- `import_recipe` reads a .bsmx or .xml file on the Brain (a path in the Brain's folder or a media folder) and makes it the Recipe. A second text picks one recipe from a file with many.
- `start_hop_alerts` starts the hop alerts on Skynet's clock from now; with a timer name it follows that timer instead.
- `stop_hop_alerts` stops them.
