# Mash, Boil and Water Profiles

Mash, Boil and Water Profiles are kept on their own, so any Recipe can use any of them. They are saved on the Brain in `config/profiles/mash`, `config/profiles/boil` and `config/profiles/water`. **☰ Menu > Default settings** says which ones a new Recipe starts with.

**Skynet Profiles** come with Skynet. They are read only: they never change, so a Recipe that uses one brews the same every time. To change one, make your own copy of it (below). Starting from a Skynet Profile and changing what you need is easier than writing one from scratch.

## Add new ...

Every Mash, Boil and Water Profile list ends with **Add new ...**: on the profile's own ☰ Menu tab, in **Default settings**, and on the Recipe's **Mash**, **Recipe** (Boil Profile) and **Waters** tabs. Pick it, give the new profile a **Name**, and pick what it **Starts from**: an empty one, or **a copy of** any profile (a Skynet one too). Its ☰ Menu tab opens so you can fill it in. Press **Save**.

Temperatures and volumes follow the profile's **Units**: US (°F, gallons) or Metric (°C, liters).

## Mash Profile

Press **☰ Menu** and pick **Mash Profile**.

- Up to **4 steps**, each with a **Name**, **Temperature** and **Time** in minutes. Leave a step empty if you don't need it.
- **Mash out temperature**. Empty: no mash out.
- **Sparge**: **Fly sparge** (water runs in as the wort runs out), **Batch sparge** (all the water in at once, with a **rest time** in minutes), or **No sparge** (full volume, as in Brew in a Bag).
- **Sparge water temperature**.

What the steps do: a **Protein Rest** (about 122 °F / 50 °C) helps wheat and under-modified malts. **Beta Amylase** (about 146 °F / 63 °C) makes sugars the yeast can eat: a drier, thinner beer. **Alpha Amylase** (about 158 °F / 70 °C) leaves more sugars the yeast cannot eat: a sweeter, fuller beer. One **Saccharification** rest between them (148 to 156 °F, 64 to 69 °C) does a bit of both: lower is drier, higher is fuller. **Mash out** (about 168 °F / 76 °C) stops the change and makes the wort run easier.

| Skynet Mash Profile | Steps (°F / °C, minutes) | Mash out | Sparge | What it is for |
|---|---|---|---|---|
| Single Step, Batch Sparge | Saccharification 152 °F / 67 °C, 60 min | 168 °F / 76 °C | Batch, 10 min rest | One rest at 152 °F, mash out at 168 °F, then a batch sparge with a 10 minute rest. |
| 3 Mash Steps, Fly Sparge | Protein Rest 122 °F / 50 °C, 15 min; Beta Amylase 146 °F / 63 °C, 30 min; Alpha Amylase 158 °F / 70 °C, 20 min | 168 °F / 76 °C | Fly | Protein, beta and alpha rests, mash out at 168 °F, then a fly (continuous) sparge with 168 °F water. |
| Single Infusion, Light Body | Saccharification 148 °F / 64 °C, 75 min | 168 °F / 76 °C | Batch, 10 min rest | A dry, crisp beer: a long, low rest. |
| Single Infusion, Medium Body | Saccharification 152 °F / 67 °C, 60 min | 168 °F / 76 °C | Batch, 10 min rest | Most ales. |
| Single Infusion, Full Body | Saccharification 156 °F / 69 °C, 45 min | 168 °F / 76 °C | Batch, 10 min rest | A sweet, full beer: stouts, Scottish ales. |
| Single Infusion, No Mash Out | Saccharification 152 °F / 67 °C, 60 min | none | Batch, 10 min rest | Medium body, straight to the sparge. |
| Step Mash, Protein Rest | Protein Rest 122 °F / 50 °C, 20 min; Saccharification 152 °F / 67 °C, 45 min | 168 °F / 76 °C | Batch, 10 min rest | Wheat beers and under-modified malts. |
| Step Mash, Beta and Alpha | Beta Amylase 146 °F / 63 °C, 30 min; Alpha Amylase 158 °F / 70 °C, 30 min | 168 °F / 76 °C | Batch, 10 min rest | Lagers and Belgian ales: dry, with good head. |
| Hochkurz | Maltose Rest 145 °F / 63 °C, 35 min; Dextrin Rest 162 °F / 72 °C, 25 min | 172 °F / 78 °C | Batch, 10 min rest | The German two step. |
| BIAB, Full Volume | Saccharification 152 °F / 67 °C, 60 min | 168 °F / 76 °C | Batch, 10 min rest | Brew in a bag: no sparge. |

## Boil Profile

Press **☰ Menu** and pick **Boil Profile**.

- **Total boil time** in minutes. **0** = No Boil.
- **Boil off**: how much boils away each hour, in gallons or liters. **Empty** uses the **Equipment Profile's** Boil Off (each brewery boils off differently: a small all-in-one boils off less than a big kettle on a burner). When a Boil Profile has its own Boil Off, picking it in a Recipe asks which one to use: **the Equipment Profile's**, or **the profile's own**. It asks each time.
- **Ask the kettle volume at the start and end of the boil**: on brew day you are asked how much wort is in the kettle when the boil starts and when it ends. That is how you learn your real Boil Off. It is on in every Skynet Boil Profile.
- **Hop Stands**: the three Hop Stands (below). Empty: the ones in Default settings.

| Skynet Boil Profile | Minutes | What it is for |
|---|---|---|
| 60 Minute Boil | 60 | The usual boil for most beers: enough to use the hops and drive off DMS from pale malts. |
| 90 Minute Boil | 90 | For beers with a lot of Pilsner malt (more DMS to drive off), big beers that need to boil down, and a darker, richer wort. |
| 30 Minute Boil | 30 | A quick boil: extract and partial grain beers, or when only late hops are used. |
| No Boil | 0 | No boil at all: no-boil sours (Berliner Weisse), raw ales and some kit beers. The wort only needs to be hot enough to be safe, or is already sanitized. |

The **Check the volumes** box on the Equipment Profile tab can use any Boil Profile.

## The three Hop Stands

After the boil the chill stops at each **Hop Stand** that has Whirlpool hops, highest first. The cooling water goes off for the stand's time while the hops steep, then the chill goes on.

| Hop Stand | Temperature | Time | What it gives |
|---|---|---|---|
| **High** | 180 °F (82 °C) | 10 min | More bitterness and flavor; some aroma is lost. |
| **Middle** | 154 °F (68 °C) | 20 min | Flavor and aroma, little bitterness. |
| **Low** | the Recipe's pitch temperature (68 °F / 20 °C when it has none) | 30 min | The most aroma, almost no bitterness. |

The temperature and time of each are set in **☰ Menu > Default settings**, in your own **Boil Profiles**, and in each **Recipe** (the Recipe tab). The Recipe's own come first, then its Boil Profile's, then Default settings. Each Whirlpool hop on the **Hops** tab picks its **Hop Stand**. A recipe file (BeerSmith or BeerXML) that gives a whirlpool temperature puts that hop in the nearest stand, with the file's temperature and time.

A Process reads them as `rcp_Hop_Stand_High`, `rcp_Hop_Stand_High_Temp` and `rcp_Hop_Stand_High_Minutes` (and the same for Middle and Low). The Skynet **Chill** and **Whirlpool and Chill** Process Templates stop at each one.

## Water Profile

Press **☰ Menu** and pick **Water Profile**. Your water as the water report gives it (ppm), and how much of it is cut with **distilled or RO water** (50 = half and half). Skynet works out the water you brew with. **Tap Water** is always there: fill in its numbers on **☰ Menu > Default settings > Tap Water**.

What the minerals do: **Calcium** helps the mash and the yeast. **Sulfate** makes hops taste crisper and more bitter. **Chloride** makes malt taste rounder and fuller. More sulfate than chloride is a hoppy water; more chloride is a malty water. **Bicarbonate** softens the acid of dark malts: high in waters for dark beers, low for pale ones. **Sodium** and **Magnesium** are best kept low.

| Skynet Water Profile | Calcium | Magnesium | Sodium | Sulfate | Chloride | Bicarbonate | What it is for |
|---|---|---|---|---|---|---|---|
| Distilled or RO | 0 | 0 | 0 | 0 | 0 | 0 | Nothing in it: the base to build any water from. |
| Balanced | 60 | 10 | 15 | 75 | 75 | 40 | Even sulfate and chloride: most beers. |
| Pale Ale, Hoppy | 110 | 18 | 15 | 250 | 50 | 40 | High sulfate: crisp, dry bitterness (IPA, Pale Ale). |
| Malty | 60 | 10 | 25 | 50 | 100 | 60 | More chloride: round, full malt (Brown, Scottish, NEIPA). |
| Pilsen | 7 | 2 | 2 | 5 | 5 | 15 | Very soft: Pilsner and pale lagers. |
| Burton on Trent | 295 | 45 | 55 | 725 | 25 | 300 | Very hard: English pale ales. |
| Dublin | 118 | 4 | 12 | 55 | 19 | 160 | Hard with bicarbonate: stouts and porters. |
| Munich | 76 | 18 | 2 | 6 | 2 | 152 | Bicarbonate: dark lagers, Dunkel, Bock. |
| London | 52 | 32 | 86 | 32 | 34 | 104 | Bitters, porters, milds. |

All the numbers are ppm (parts per million, the same as mg per liter).
