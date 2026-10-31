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

## The Daughter Tabs

The buttons under the boxes open the Daughter Tabs. **◀ Back to the Recipe tab** (or **Recipe** in the title) comes back.

- **HOPs**: add, edit or delete hops. The Actual AAU of the hops used in the brew MUST be updated; the amounts are adjusted from it to keep the IBUs.
- **Drops**: the hop drop groups, the pre warning times and the alert texts, worked out from the hops (see **Hop schedule and alerts**).
- **Grain**: add, edit or delete grains and fermentables. Their total weight is the Grain Wt.
- **Yeast**: add, edit or delete yeasts and yeast starters.
- **Adjuncts**: add, edit or delete adjuncts such as Whirlfloc or yeast nutrient (BeerSmith calls them Misc).
- **Waters**: the Water Profile.
- **MASH**: the Mash Profile.

Their own boxes come next. Until then each shows what the Recipe holds for it, and Waters and MASH have the profile dropdowns.

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
