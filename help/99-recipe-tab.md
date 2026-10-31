# The Recipe tab

Press **☰ Menu** and pick **Recipe**. This is the Recipe for brew day. Bring it in from BeerSmith, or fill it in by hand. There is no limit on how many grains, hops, yeasts or misc items it has.

Along the top:

- **New** clears the Recipe and starts one from the Defaults (☰ Menu > Default).
- **⬆ Import .bsmx / .xml** brings in a recipe file (below).
- **Recipe library** opens a saved Recipe, saves this one (💾), or deletes a saved one. Saved Recipes are on the Brain in `config/recipes`.
- **Cancel** and **Save** are at the top and the bottom.

The box under the buttons shows the **Total grain weight**, all fermentables, the hops, and the **strike water** and its temperature. They change as you type.

The Recipe is kept in kilograms, liters and °C. It shows in the units you pick on the Default tab (see **Recipe defaults** below).

## Importing a BeerSmith file

Two kinds of file come in, and both bring every grain, hop, yeast, misc item, water and mash step:

- **.bsmx**: the file BeerSmith 3 and BeerSmith 4 save recipes in. This is the better one to use. If the file holds many recipes (a whole folder), Skynet asks which one.
- **BeerXML .xml**: in BeerSmith use **File > Export > BeerXML**. Most other recipe programs can export it too.

Note: inside a .bsmx file BeerSmith keeps its own US units: weights in **ounces**, volumes in **fluid ounces**, temperatures in **°F**. A Misc item keeps the unit you gave it in BeerSmith (tsp, g, oz ...). Skynet turns them all into its own units as it reads the file. (BeerXML files use kilograms and liters.)

You can also import from the **Import** page, from Node-RED (POST the file to `/api/import/recipe?file=MyBeer.bsmx`), or from a Process (below).

## The daughter tabs

- **Recipe**: name, style, type, brewer and assistant, batch and boil size, boil time, efficiency, OG, FG, IBU and color, the **Mash Profile**, **Boil Profile** and **Water Profile**, the water to grain ratio, the grain temperature and notes.
- **Grains**: every grain and other fermentable with its type, amount, color and yield. Grains and Adjuncts make the Total grain weight.
- **Hops**: every hop with its use (Top of Mash, 1st Wort, Boil, Whirlpool / Aroma, Dry Hop), time, amount and alpha acid. Set **Alpha % (Actual)** to the alpha acid on the bag you brew with, and Skynet shows the **Amount to use** for the same bitterness (as the AAU columns did on the OakBarn Batch Tab).
- **Misc**: Irish Moss, Whirlfloc, salts, spices ... each with its own unit. A Boil item gets its own alert.
- **Yeast**: name, lab, product, packages, starter, attenuation and temperatures.
- **Water**: the water in the recipe file, and the Water Profile you picked.
- **Mash**: the mash steps from the recipe file, to review. When a Mash Profile is picked on the Recipe tab, brew day uses it.
- **Hop Schedule**: the results Skynet works out (you cannot change them here).

## Mash Profile: Skynet or your own

The Mash Profile dropdown lists your own Mash Profiles and the **Skynet** ones: Single Infusion (light, medium and full body, and no mash out), Step Mash with a Protein Rest, Step Mash Beta and Alpha, Hochkurz and BIAB. Skynet ones cannot be changed; on ☰ Menu > Mash Profile pick **Add new ...** and start from a copy of one to make your own.

## Water Profile

Press **☰ Menu** and pick **Water Profile**. Type your water report (calcium, magnesium, sodium, sulfate, chloride, bicarbonate in ppm, and pH), then how much of the water is **distilled or RO** (50% = half and half). Skynet shows the water you brew with and its sulfate to chloride ratio.

Skynet Water Profiles are there too (Distilled or RO, Balanced, Pale Ale Hoppy, Malty, Pilsen, Burton, Dublin, Munich, London). Like the Skynet Mash Profiles they cannot be changed, but can be copied.

## Hop schedule and alerts

Skynet puts the hops in brew day order, as the OakBarn Hop Warnings did: **Top of Mash, 1st Wort, Start of Boil, then the boil hops (Bitter, Flavor, Aroma), Whirlpool, Dry Hop**. Hops that go in at the same time make one **Hop Group**.

Each boil Hop Group (and each Boil Misc item) gets:

- a **warning** before it goes in (10 minutes unless changed on the Default tab), and
- a **drop** alert when it goes in.

When two alerts land at the same time, for example a drop and the next group's warning, Skynet makes **one alert that has both**. The Hop Schedule tab marks those with ⚠ and lists them under the alerts.

On brew day each alert shows as a bar at the top of every screen (green for a warning, red for a drop) and stays until it is closed. With sound on, it plays the alert sound (if one is set on the Default tab) and then says the alert out loud.

Start the alerts from a Process (below), or with **▶ Start hop alerts** on the Hop Schedule tab. They can run on Skynet's own clock from that moment, or follow a countdown **timer** such as the Boil timer, so a paused timer or the Simulator's time skips are followed too.

## Voice and audio files

Each alert can have its own voice file in `media/Audio/Hops`. The Hop Schedule tab shows its name. When the file is there, it plays; when not, the browser's own voice reads the alert (every common browser has one, on computers and phones, with no web site needed).

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
