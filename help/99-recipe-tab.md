# The Recipe tab

Press **☰ Menu** and pick **Recipe**. This is the Recipe for brew day. Bring it in from BeerSmith, or start a new one and fill it in. There is no limit on how many grains, hops, yeasts or adjuncts it has.

Along the top:

- **IMPORT** brings in a recipe file (below).
- **NEW** clears the Recipe and starts one from the Defaults (☰ Menu > Default).
- **Library ...** opens a saved Recipe, saves this one (💾 **Save this Recipe to the library**), or deletes a saved one (🗑). Saved Recipes are on the Brain in `config/recipes`. **Save this Recipe** saves it as it has been fixed, with the date at the end of its name (`Pale Ale 2026:11:25`; saved again on the same date: `Pale Ale 2026:11:25 (2)`). The Actual AAU of every hop is saved as 0, because it needs to be zero if used again. The Recipe you have open keeps its name and its Actual AAUs.
- **Cancel** and **Save**.

## Brew on: the Tab for the Brew

**Brew on** (beside Brew Length) picks the Tab this Recipe is brewed on. It lists the Tabs that have Equipment numbers, with each Tab's Brewhouse Efficiency. The Tab you pick becomes the Tab for the Brew.

A new or imported Recipe starts on the Tab whose equipment has a Mash Tun or an All In One, or else the first Tab with Equipment numbers. A Tab that is renamed stays picked.

The **Expected Gravity** and the gravity points use the **Brewhouse Efficiency of that Tab**. It is the only Efficiency in Skynet: there is no overall default, and a Recipe never keeps one of its own. A new Equipment Profile starts at 72 %, it is copied onto a Tab with the profile, and you change it on the Tab: **⚙ Numbers** on ☰ Menu > Equipment Profile, or Tab Settings ([Equipment Profiles](28-schemas-and-equipment-profiles)). With no Tab picked, grains and adjuncts have no gravity points, and the Expected Gravity stays empty.

## The Level

Pick the **Level** of the Recipe at the top of the Recipe tab, beside NEW. **NEW** asks for it too.

- **1 Can Kit**: an Extract Can Kit, for a beginner brewer. A can of hopped malt extract, often with sugar or dry malt extract, then the yeast. No grain and no hops to add.
- **2 Extract**: malt extract (liquid or dry) boiled with your own hops. No grain.
- **3 Partial Grain**: extract with partial grain and hops. Some grain is mashed or steeped in a small amount of water, then extract and your own hops.
- **4 All Grain**: all the sugar comes from mashed grain.

The Recipe tab shows only the boxes and tabs that Level uses. Level 1 shows the Fermentable, Yeast, Adjuncts and Waters tabs. Level 2 adds HOPs and Drops. Levels 3 and 4 show everything. Changing the Level never deletes anything: a box that is hidden keeps its value.

On Levels 1 and 2 the Fermentable tab offers **Extracts only** (Extract and Dry Extract). Levels 3 and 4 also offer Adjuncts and Sugars, and the Grain tab.

Every Level has the Waters tab, and it starts with **Tap Water**: your own water, filled in on ☰ Menu > Default settings > **Tap Water**.

A recipe file you IMPORT comes in at its own Level (an Extract recipe at Level 2, a Partial Mash at Level 3, an All Grain at Level 4). Change it if it is a Can Kit.

The technical side: the Level is the Skynet_Field `skn_rcp_Level` (1 to 4), so a Process can do the steps for its Level. It is saved with the Recipe, and its BeerXML type says the same thing (Levels 1 and 2 are Extract, 3 is Partial Mash, 4 is All Grain).

## The boxes

Each box has a colored top that says what kind it is:

- **Black**: names (Beer Name, Style, Brew Length).
- **Grey**: times and choices (Sparge Type, Sparge Minutes, Boil Minutes, Whirlpool Minutes, Grain Ratio).
- **Blue**: volumes (Strike Volume, Sparge Volume, PreBoil Volume).
- **Red**: temperatures (Strike, Grain and Sparge Temperature, Pitch At).
- **Light grey**: worked out by Skynet, not typed: **Grain Wt.**, **1st Mash** and **IBU** come from the Grain, MASH and HOPs tabs.

Most boxes can be changed. **Style** is a dropdown; **Add new ...** adds a style to it.

Press **Calculate** to work out the Total Grain Weight, the Hop Drops, Warnings and Messages, the 1st Mash temperature, the IBU (from each hop's Actual AAU), and the Strike Volume and Temperature and the Sparge Volume and Temperature, from the Grain Temperature and Grain Ratio. The Strike Temperature adds the **Brew on** Tab's **Strike offset** ([Equipment Profiles](28-schemas-and-equipment-profiles)). Then press **Save**. An imported recipe comes in already worked out.

The Recipe is kept in kilograms, liters and °C. It shows in the units you pick on the Default tab (see **Recipe defaults** below).

## Skynet_Fields

Every box on the Recipe tab and its Daughter Tabs is a **Skynet_Field**: it has a fixed Skynet name that starts with `skn_rcp_`, shown when the mouse rests on the box. A Process reads them (they are read only there), for example `skn_rcp_Strike_Temp`, `skn_rcp_Boil_Minutes` or `skn_rcp_Pitch_Temp`. The names never change.

| Box | Skynet_Field |
|---|---|
| Beer Name | `skn_rcp_Name` |
| Style | `skn_rcp_Style` |
| Level | `skn_rcp_Level` |
| Brew Length | `skn_rcp_Batch_Volume` |
| Grain Wt. | `skn_rcp_Total_Grain_Weight` |
| 1st Mash | `skn_rcp_First_Mash_Temp` |
| IBU | `skn_rcp_IBU` |
| Expected Gravity | `skn_rcp_Expected_Gravity` |
| Strike Volume | `skn_rcp_Strike_Volume` |
| Strike Temperature | `skn_rcp_Strike_Temp` |
| Grain Temperature | `skn_rcp_Grain_Temp` |
| Sparge Volume | `skn_rcp_Sparge_Volume` |
| Sparge Type | `skn_rcp_Sparge_Type` |
| Sparge Minutes | `skn_rcp_Sparge_Minutes` |
| Sparge Temperature | `skn_rcp_Sparge_Temp` |
| PreBoil Volume | `skn_rcp_Boil_Volume` |
| Boil Minutes | `skn_rcp_Boil_Minutes` |
| Whirlpool Minutes | `skn_rcp_Whirlpool_Minutes` |
| Pitch At | `skn_rcp_Pitch_Temp` |
| Grain Ratio | `skn_rcp_Grain_Ratio` |
| Waters: Water Profile | `skn_rcp_Water_Profile` |
| MASH: Mash Profile | `skn_rcp_Mash_Profile` |
| Hops tab: how many hop lines | `skn_rcp_Hop_Count` |

Each line on the Hops tab has its own Skynet_Fields, N = the line number (1, 2, 3 ... with no limit):

| Box on the Hops tab | Skynet_Field |
|---|---|
| Hop N (its name) | `skn_rcp_Hop_N_Name` |
| Ounces (or Grams) | `skn_rcp_Hop_N_Amount` |
| Unit (oz or g) | `skn_rcp_Hop_N_Measurement` |
| AAU % Recipe | `skn_rcp_Hop_N_AA_Recipe` |
| AAU % Actual | `skn_rcp_Hop_N_AA_Actual` |
| Calc oz | `skn_rcp_Hop_N_Calc_Amount` |
| Boil, Mash, 1st Wort, Secondary, Dry Hop or Whirlpool | `skn_rcp_Hop_N_Use` |
| Hop N Min | `skn_rcp_Hop_N_Min` |
| Hop N Drop | `skn_rcp_Hop_N_Drop` |
| Hop N IBU | `skn_rcp_Hop_N_IBU` |
| Hop N Boil Group | `skn_rcp_Hop_N_Boil_Group` |
| Secondary or Dry Hop Days | `skn_rcp_Hop_N_Days` |
| Secondary or Dry Hop Date | `skn_rcp_Hop_N_Date` |
| Whirlpool Temperature | `skn_rcp_Hop_N_Whirlpool_Temp` |
| Hop Rocket | `skn_rcp_Hop_N_Hop_Rocket` |

For example `skn_rcp_Hop_1_Name` is the first hop. A line the Recipe does not have reads as empty (or 0).

The Grain and Fermentable tabs work the same way: `skn_rcp_Grain_Count`, `skn_rcp_Grain_N_Name`, `_Amount`, `_Potential`, `_SRM`, `_PPG_SG`, and `skn_rcp_Fermentable_Count`, `skn_rcp_Fermentable_N_Name`, `_Type`, `_Amount`, `_Potential`, `_SRM`, `_PPG_SG`, `_After_Boil`.

The Yeast tab too: `skn_rcp_Yeast_Count`, `skn_rcp_Yeast_N_Name`, `_Form`, `_Amount`, `_Measurement` (Packs, g, oz or ml), `_Attenuation`, `_Min_Temp`, `_Max_Temp`, `_Lab`, `_Product_ID`, `_Type`, `_Flocculation`, `_Starter`, `_Starter_Size`, `_Times_Cultured`, `_Mfg_Date`, `_Notes`. `skn_rcp_Yeast_Name` is still the first yeast.

## The Daughter Tabs

The buttons under the boxes open the Daughter Tabs. **◀ Back to the Recipe tab** (or **Recipe** in the title) comes back.

- **HOPs**: add, edit or delete the Boil Hops. The Actual AAU of the hops used in the brew MUST be updated; the amounts are adjusted from it to keep the IBUs.
- **Pre and Post Boil Hops**: the hops that are not Boil Hops: Mash, 1st Wort, Secondary, Dry Hop and Whirlpool. Their Actual AAU must be updated too.
- **Drops**: the hop drop groups, the pre warning times and the alert texts, worked out from the hops (see **Hop schedule and alerts**).
- **Grain**: add, edit or delete grains. Their total weight is the Grain Wt.
- **Fermentable**: add, edit or delete the other fermentables: adjuncts, extracts, sugars, fruit and juice.
- **Yeast**: add, edit or delete yeasts and yeast starters.
- **Adjuncts**: add, edit or delete adjuncts such as Whirlfloc, yeast nutrient or gypsum (BeerSmith calls them Misc).
- **Waters**: the Water Profile.
- **MASH**: the Mash and Sparge Profile.

Every Daughter Tab button is the same size.

The Hops, Pre and Post Boil Hops, Grain, Fermentable, Yeast, Adjuncts, MASH and Waters tabs are built (below). The other tabs' own boxes come next. Until then each shows what the Recipe holds for it, and Waters and MASH have the profile dropdowns.

## The Hops tab

One line for each Boil Hop, with no limit. **Add Hop +** puts a new line at the bottom; **Delete** on a line takes it away. **Calculate** is at the top right of the Hops and Pre and Post Boil Hops tabs too.

- **The line's title** is its Hop Group, in color: **Bitter Hops** (orange) above 20 minutes, **Flavor Hops** (yellow) above 5 up to 20, **Aroma Hops** (green) 5 minutes or less. It changes as soon as Min changes.

- **Hop N**: the hop's name.
- **Ounces** (or Grams): the amount in the recipe, in the line's own **Unit**.
- **Unit**: **oz** or **g**, for this hop line only, whatever Settings > Units says. Changing it turns the amount (1 oz shows as 28.3 g). A new line starts in the Units; a BeerSmith .bsmx hop comes in as oz, a BeerXML hop as the file shows it (grams when it does not say).
- **AAU % Recipe** and **Actual** (red): the alpha acid of the hop in the recipe, and of the hops you have (on the package). **Type the Actual for every hop.** It starts at 0, for an imported hop and for a new one.
- **Calc oz** (or **Calc g**): the amount to use with the Actual AAU, so the beer gets the IBUs of the recipe, in the line's Unit.

**oz → g** (next to Add Hop +) turns every hop line in ounces into grams in one press. Grams are more accurate, and some scales start in grams. Only the unit changes; the amount of hops is the same. Press Save to keep it.
- **Hop N Min**: boil minutes. Min = the Boil Time is a Start of Boil hop.
- **Hop N Drop**: how far into the boil it goes in, as a time: 75 minutes shows **01:15:00**. **Hop N IBU**: its bitterness.

**The square box** on a line sends the hop to the **Pre and Post Boil Hops** tab.

## The Pre and Post Boil Hops tab

The hops that are not Boil Hops, each with its **Recipe** and **Actual** AAU like on the Hops tab, and a box of switches: **Mash Hops, 1st WORT Hops, Secondary Hops, DRY Hops, Whirlpool**. One click on a switch is kept at once: there is no Save or Cancel on a line. Turn its switch off and the hop is a Boil Hop again, back on the Hops tab. **Delete** is the same size as the line.

- **Secondary Hops** and **DRY Hops**: the date, the days, and the **Pull Date** (the date plus the days: the day to take the hops out).
- **Whirlpool**: the Whirlpool questions: **Hop Stand**, its **Temperature** and **Time** (they start empty; the Hover Help gives the common numbers, see [The three Hop Stands](35-mash-and-boil-profiles#the-three-hop-stands)), the hop's own **Min**, and **Hop Rocket** when the whirlpool runs through a Hop Rocket.

**Order.** On **Calculate** and on **Save** the lines go in order: Boil Hops by drop time (a Start of Boil hop first, then by Minutes), then Mash, 1st WORT, Secondary, DRY and Whirlpool hops.

A change to a Hop Stand's **Temperature** or **Time** on a Whirlpool hop is the Recipe's own Hop Stand: the Recipe tab shows it at once.

**Calculate needs every Actual AAU above 0**, on the Hops tab and the Pre and Post Boil Hops tab. The recipe is based on the Recipe AAU, but the real IBUs of a brew come from the Actual AAU, the AAU on the hop package. When any Actual AAU is 0, nothing is calculated: Skynet switches to the tab of the first one, highlights each Actual AAU that is 0 and shows a warning that names each hop (Hop 3 (Cascade)). Press **READ** to close it, fix the Actual AAUs and press Calculate again. A hop whose Recipe AAU is 0 is not asked about: an import gives it an Actual of 0.01.

**Calculate saves.** When it works out the Recipe, it saves it too.

## The Grain and Fermentable tabs

A recipe's fermentables are split over two tabs. **Grain** holds the ones of Type Grain (the Type is not shown). **Fermentable** holds every other Type, picked from the **Type** dropdown (the BeerXML list: Adjunct, Extract, Dry Extract, Sugar). Each Fermentable line also has a **Measurement** dropdown (Pounds, Ounces, Kilograms, Grams) for its own Amount. Both dropdowns are select only. **Add Grain +** or **Fermentable +** puts a new line at the bottom; **Delete** takes one away. There is no limit.

- **Name**, the weight, **Potential** (the yield, %), **SRM** (the color) and **PPG>SG**, its gravity points (worked out).
- The weight shows in the **grain weight standard** picked on ☰ Menu > Default (Pounds or Kg). An imported BeerSmith or BeerXML file is shown in it too. Its label, and the PPG>SG label, can be changed only in ☰ Menu > Default settings.
- **Gravity points** = Potential × 46.214 × pounds × efficiency ÷ gallons in the batch. Grains and adjuncts use the Brewhouse Efficiency of the **Brew on** Tab; extracts, sugars, fruit and juice give all their sugar. The points of every line add up to the **Expected Gravity** box on the Recipe tab (1 + points ÷ 1000), worked out whenever an amount changes, and by Calculate. It needs the Brew Length. An empty **PPG>SG** box says what it is waiting for: **Brew Length?**, **Potential?** or **Brew on Tab?** (a grain has no gravity points without the Brewhouse Efficiency of the Brew on Tab's Equipment Profile, Rule 17.13).
- The **Grain Wt.** box on the Recipe tab follows the Grain tab at once: the grains and the Adjunct type fermentables.
- Each line is on one line, every box the same height.
- **After Boil** (Fermentable tab only): a switch, shown only for the Types a brewer adds during or after the boil (Extract, Dry Extract, Sugar, Fruit, Juice). On means it goes in after the boil. Grain is never added after the boil, so the Grain tab has none.

Each tab shows its total weight. An import brings every grain field in (notes, protein, moisture and the rest too), ready for later.

## The Yeast tab

One line for each yeast, with no limit. **Yeast +** puts a new line at the bottom; **Delete** takes one away.

- **Yeast N** (the name), **Form** (Dry, Liquid, Slurry or Culture), **Amount** and its own **Unit**: **Packs**, **g**, **oz** or **ml**. Most yeasts come in Packs, some recipes give grams. The Unit is the line's own, whatever Settings > Units says.
- **Attenuation %**: how much of the sugar the yeast eats. **Min Temp** and **Max Temp**: the temperature range it ferments in, shown in the Units.
- **▸ More** opens the rest under the line: **Lab**, **Product ID** (for example US-05 from Fermentis), **Type** (Ale, Lager, Wheat, Wine, Champagne), **Flocculation** (Low, Medium, High, Very High), **Starter** (a switch, with an optional **Starter Size**), **Times Cultured**, **Mfg Date** (the manufacture date on the pack) and **Notes**.

An import fills in what the file has. A BeerSmith .bsmx yeast is a count of Packs. A BeerXML yeast is in grams (a weight) or milliliters (a volume), unless the file shows "pkg", which gives Packs.

## The Adjuncts tab

Whirlfloc, yeast nutrient, gypsum, spices: what BeerSmith and BeerXML call Misc. **Adjunct +** is a dropdown: click **Whirlfloc**, **Irish Moss**, **Yeast Nutrient**, **Gypsum**, **Calcium Chloride**, **Epsom Salt**, **Lactic Acid**, **Campden Tablet**, **Gelatin**, **Coriander Seed**, **Orange Peel** or **Priming Sugar** to add its line with its Type, Use, Measurement and Time filled in; type the Amount. **Other** adds an empty line for anything else. **Delete** takes one away, no limit.

- **Adjunct N** (the name), **Amount** and **Measurement** (mg, g, oz, lb, kg, ml, tsp, tbsp, cup, pt, qt, l, gal or items).
- **Type**: Spice, Fining, Water Agent, Herb, Flavor or Other. **Use**: Boil, Mash, Primary, Secondary or Bottling.
- **Time** and **Time Unit** (min, hr, day, week). For a Boil adjunct the box says **Boil Min**: minutes left in the boil when it goes in. A Boil adjunct gets a warning and a drop alert like a hop (the Drops tab).

The dropdowns are select only, with the BeerXML lists. Flaked grains and other adjuncts that add sugar are on the Fermentable tab, so they count in the Expected Gravity. Skynet_Fields: `skn_rcp_Adjunct_Count`, `skn_rcp_Adjunct_N_Name`, `_Amount`, `_Measurement`, `_Type`, `_Use`, `_Time`, `_Time_Unit`.

## The MASH tab

Pick the **Mash Profile**: a Skynet Template, one of your own (☰ Menu > Mash Profile), or **the Recipe's own mash** (the mash from the recipe file, or one you type here).

- A picked profile shows read only: each **Step** with its **Temp** and **Time**, then the sparge (type, temperature, batch rest) and the mash out. **⧉ Copy into this Recipe** makes it the Recipe's own mash so you can change it here.
- The Recipe's own mash: **Mash Step +** adds a step, **Delete** takes one away, and the sparge boxes are the same as on the Recipe tab.
- Calculate on the Recipe tab uses the first step for the 1st Mash and the strike water.

Skynet has two Templates: **Skynet Single Step, Batch Sparge** (152 °F for 60 minutes, mash out at 168 °F, batch sparge with a 10 minute rest) and **Skynet 3 Mash Steps, Fly Sparge** (122 °F for 15, 146 °F for 30, 158 °F for 20 minutes, mash out at 168 °F, fly sparge with 168 °F water).

Skynet_Fields: `skn_rcp_Mash_Profile`, `skn_rcp_Mash_Step_N_Name`, `skn_rcp_Mash_Step_N_Temp`, `skn_rcp_Mash_Step_N_Time`.

## The Waters tab

Pick the **Water Profile**. It starts with **Tap Water** (your own water, ☰ Menu > Default settings > Tap Water). Its minerals show after the distilled or RO cut (Calcium, Magnesium, Sodium, Sulfate, Chloride, Bicarbonate, in ppm), with the **% Distilled / RO**, the **SO4 : Cl** ratio (above 2 crisp and hoppy, below 1 round and malty) and the **pH**. They are read only here; change the profile on ☰ Menu > Water Profile. Below them are the waters the recipe file listed.

Skynet_Fields: `skn_rcp_Water_Profile`, `skn_rcp_Water_Ca`, `skn_rcp_Water_Mg`, `skn_rcp_Water_Na`, `skn_rcp_Water_SO4`, `skn_rcp_Water_Cl`, `skn_rcp_Water_HCO3`, `skn_rcp_Water_Distilled_Pct`, `skn_rcp_Water_SO4_Cl`, `skn_rcp_Water_PH`.

## Importing a BeerSmith file

Two kinds of file come in, and both bring every grain, hop, yeast, misc item, water and mash step:

- **.bsmx**: the file BeerSmith 3 and BeerSmith 4 save recipes in. This is the better one to use. If the file holds many recipes (a whole folder), Skynet asks which one.
- **BeerXML .xml**: in BeerSmith use **File > Export > BeerXML**. Most other recipe programs can export it too.

Note: inside a .bsmx file BeerSmith keeps its own US units: weights in **ounces**, volumes in **fluid ounces**, temperatures in **°F**. A Misc item keeps the unit you gave it in BeerSmith (tsp, g, oz ...). Skynet turns them all into its own units as it reads the file. (BeerXML files use kilograms and liters.)

**The file's Efficiency.** A BeerSmith or BeerXML file says what Brewhouse Efficiency its writer brewed at. That number may mean nothing (many brewers never set it), so after the import Skynet asks:

- **Ignore it** (picked to start): the Tab's Efficiency stays as it is.
- **Put on** the Brew on Tab: the file's number goes into that Tab's own Brewhouse Efficiency. Skynet shows the change first ("72 % → 75 %"), and **↩ Undo** puts the old number back for a few seconds after. It changes every Recipe brewed on that Tab.

**Hop Stands.** BeerSmith and BeerXML have no Skynet Hop Stands, so a recipe with Whirlpool hops asks one more box after the import (and after the Efficiency question):

- Each Whirlpool hop: its **Hop Stand** (High, Middle or Low), or **No Hop Stand** (it goes in at flame out).
- Each Hop Stand: its **Temperature** and **Time**.

What the file gave is already filled in: a .bsmx file's whirlpool temperature and the hop's minutes. A BeerXML file has none, so those boxes start empty. **Close** keeps the recipe as imported. A Hop Stand you pick with no Temperature or Time gives one warning ("The chill won't stop for this hop.") and still saves.

You can also import from the **Import** page, from Node-RED (POST the file to `/api/import/recipe?file=MyBeer.bsmx`), or from a Process (below).

## Mash Profile: Skynet or your own

The Mash Profile dropdown (MASH tab) lists your own Mash Profiles and the **Skynet** ones: Single Infusion (light, medium and full body, and no mash out), Step Mash with a Protein Rest, Step Mash Beta and Alpha, Hochkurz and BIAB. Skynet ones cannot be changed; on ☰ Menu > Mash Profile pick **Add new ...** and start from a copy of one to make your own.

## Water Profile

Press **☰ Menu** and pick **Water Profile**. Type your water report (calcium, magnesium, sodium, sulfate, chloride, bicarbonate in ppm, and pH), then how much of the water is **distilled or RO** (50% = half and half). Skynet shows the water you brew with and its sulfate to chloride ratio.

**Tap Water** is always on the list. It is the water a Recipe starts with. Fill in its numbers on ☰ Menu > Default settings > **Tap Water** (Help: Default settings). It can't be deleted.

Skynet Water Profiles are there too (Distilled or RO, Balanced, Pale Ale Hoppy, Malty, Pilsen, Burton, Dublin, Munich, London). Like the Skynet Mash Profiles they cannot be changed, but can be copied.

## Hop schedule and alerts

Skynet puts the hops in brew day order: **Top of Mash, 1st Wort, Start of Boil, then the boil hops (Bitter, Flavor, Aroma), Whirlpool, Dry Hop**. Hops that go in at the same time make one **Hop Group**.

Each boil Hop Group (and each Boil Misc item) gets:

- a **warning** before it goes in (10 minutes unless changed in ☰ Menu > Default settings), and
- a **drop** alert when it goes in.

When two alerts land at the same time, for example a drop and the next group's warning, Skynet makes **one alert that has both**. The Drops tab marks those with ⚠ and lists them under the alerts.

On brew day each alert shows as a bar at the top of every screen (green for a warning, red for a drop) and stays until it is closed. With sound on, it plays the alert sound (if one is set in ☰ Menu > Default settings) and then says the alert out loud.

Start the alerts from a Process (below), or with **▶ Start hop alerts** on the Drops tab. They can run on Skynet's own clock from that moment, or follow a countdown **timer** such as the Boil timer, so a paused timer or the Simulator's time skips are followed too.

### Before and after the boil

Some hops go in when the brew gets somewhere, not at a boil minute. The Process sends their alerts at that moment (`hop_alert`, below), and the Drops tab lists them under **Alerts the Process sends**:

| When | Alert |
| --- | --- |
| The Strike Water reaches Strike | **Pre Boil** warning: get the Mash and 1st Wort hops ready |
| Just after the Mash Timer starts | **Mash** drop: the Top of Mash hops |
| Just before the First Run starts | **1st Wort** drop: the 1st Wort hops go in the kettle |
| 10 minutes left in the boil | **Post Boil** warning: every Whirlpool, Hop Stand, Secondary and Dry Hop hop (a timed alert, with the others) |
| The wort reaches a Hop Stand's temperature | **Hop Stand** drop: that stand's hops. The cooling water is off for its time, on the Whirlpool / Chilling Timer |
| Every Fermenter is filled | **Fermenter** hops: the Secondary and Dry Hop hops, to set a reminder on your phone |

The Pre Boil, Mash and 1st Wort alerts are for **All Grain** recipes only. A Whirlpool hop with no Hop Stand temperature and time (a BeerXML file has none) still goes in at flame out.

## Voice and audio files

Each alert can have its own voice file in `media/Audio/Hops`. The Drops tab shows its name. When the file is there, it plays; when not, the browser's own voice reads the alert (every common browser has one, on computers and phones, with no web site needed).

To make a voice file:

1. Press **1 Copy words**.
2. Press **2 Open voice site** (a free text to voice web site opens), paste the words, pick a voice and download the MP3.
3. Press **3 Put the file here** and pick the MP3. Skynet saves it under the right name.

Skynet does not fetch the voice from the web site by itself: free voice sites do not let programs in, so this is done by hand.

## Recipe defaults

On **☰ Menu > Default**:

- **Water Profile** and **Water to grain ratio**: what a new Recipe starts with. Each can be changed in the Recipe. The Boil time comes from the Boil Profile, the Grain temperature is 72 °F for planning, and the **Strike offset** belongs to the **Brew on** Tab's equipment ([Equipment Profiles](28-schemas-and-equipment-profiles)).
- **How amounts show**: grains (lb, kg, oz, g), hops (oz, g), volumes (gal, L, qt), temperatures (°F, °C), water to grain (qt/lb, L/kg) and misc items (as the recipe gives them, metric, or US).

In **☰ Menu > Default settings**:

- **Hop alerts**: minutes of warning before each drop, how close two alerts must be to become one, a sound before each alert, saying them out loud, and which browser voice.

## In a Process

```
import_recipe "Recipes/Zombie Dust.bsmx"
import_recipe "Recipes/All My Recipes.bsmx", "Zombie Dust"
start_hop_alerts
start_hop_alerts "Boil_Timer"
start_hop_alerts "Boil_Timer", 1
stop_hop_alerts
hop_alert "Pre Boil"
hop_alert "Hop Stand High"
hop_alert "Fermenter"
```

- `import_recipe` reads a .bsmx or .xml file on the Brain (a path in the Brain's folder or a media folder) and makes it the Recipe. A second text picks one recipe from a file with many.
- `start_hop_alerts` starts the hop alerts on Skynet's clock from now; with a timer name it follows that timer instead. A number after the timer is how many timer seconds make one minute of the boil: 60 (real time) to start; 1 when a Testing switch runs each minute as one second.
- `stop_hop_alerts` stops them.
- `hop_alert` sends one of the alerts that come before or after the boil (see **Before and after the boil**): `"Pre Boil"`, `"Mash"`, `"1st Wort"`, `"Hop Stand High"`, `"Hop Stand Middle"`, `"Hop Stand Low"` or `"Fermenter"`. With no Recipe, or no such hops, nothing is sent and the Process goes on.
