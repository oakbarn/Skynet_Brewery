# Default settings

**☰ Menu > Default settings** is the one place for **every default** in Skynet: what a **new** thing starts with (Skynet Rule 2.42). What changes things already made is in **Settings > Panel settings: screen, Tabs and alerts** ([Settings](09-settings)). It opens only from the
**☰ Menu**. It used to be called the **Default** tab.

These settings belong to the **panel**, so they are the same in every Schema. **Admins** change them and press **Save**; everyone
else can look.

## Pipes, hoses and sizes

### Default Pipe Size

Common size of the most Pipes to be placed on a new Tab. Pipe Fittings are added automatically and will auto size to the pipe joined. You can create a manifold that looks like the real world one in your brewery to a large degree. The most common Pipes are 1/2". The end type IPs are set by the IP Type but can be changed individually on a Pipe IP.

IPs snap together and are locked.

IPs lock automatically and a Pipe's IPs need to be unlocked to move or resize a Pipe. That can only be done in a Build mode for Pipes.

Pipes have a flow simulation.

### IP Type (for Pipes)

The default connector a new pipe has on both ends: Tri-Clamp, NPT, BSP or Quick Disconnect. It is the size of the pipe. Pipes when placed keep connector type. The Individual IPs on a Pipe end can be changed. Set the Pipe Default IP type for the way most of your Pipes are set up. For Brewing Pipes, the most common are 1.5 Tri Clamp. (TC1.5)

### Default Hose Size

Common size of the hoses to be placed on a new Tab. Individual hose size can be changed when they are placed. Hoses can join Pipes, Fittings and anything with IPs but retain their size unlike a Pipe. There is no auto sizing of Hoses. You can create a manifold that looks like the real world one in your brewery to a large degree. The most common Hoses are 1/2". The end type IPs are set by the IP Type but can be changed individually on a Hose IP.

IPs snap together and are locked.

Hoses connected with Quick Disconnect IPs can be quickly unlocked and moved even while brewing.

Hoses have a flow simulation.

### IP Type (for Hoses)

The default connector a new Hose has on both ends: Tri-Clamp, NPT, BSP or Quick Disconnect. It is the size of the hose. Hoses when placed keep connector type. The Individual IPs on a Hose end can be changed. Set the Hose Default IP type for the way most of your hoses are set up.

### How many Pixels are Pipes and Hoses to be drawn on a Tab?

This is simply how Pipes and Hoses are drawn on your screen and do not affect anything other than the "Look". For normal Computer Screen resolutions (set on your computer by you but a default was set by the OS), 10 is a good starting point. It is for any new Pipes or Hoses placed and does not affect any already placed, so it is a good idea to set it and forget it or your screen may look like it was drawn by a 3 year old.

This box is in two places, here and in **New Tabs**. It is one setting: typing in one changes the other. Each Tab can still change its own in **Tab Settings**.

The technical side: the sizes are 1/4" to 6", with the mm size beside each; Skynet starts at 1/2" for both, Tri-Clamp for pipes and Quick Disconnect for hoses ([Pipes, hoses and reducers](24-pipes-and-hoses), Skynet Rule 5.40). A new Device, Pipe Fitting or item with IPs (pumps, valves, flow meters, elbows, tees, Valve Tees, probe tees ...) is drawn for the Default Pipe Size until a pipe is on it. Items already made keep the size they had: changing it here only reaches new things (Skynet Rule 2.42). The Pixels box is from 2 to 100 (empty = 10).

### How things size to their pipes

Once pipes are joined to it, an item takes the size **most of its pipes and hoses** have (a tie takes the bigger; Skynet Rule
5.36). Since 2026-11-07 this covers **pumps** too. For example,
add a Blichmann pump to a Tab with 1" pipes: it is drawn for 1" pipes as soon as the pipes are on it, and for the Default pipe size
before that. A fitting sitting on a vessel opening with no pipe keeps its size. See
[Pipe fittings and Manual Valves](87-pipe-fittings-and-manual-valves).

## New Devices and Widgets (the Build)

| Setting | What it does |
|---|---|
| **Default Interface** | The Interface a new Device's Add box starts on. Empty: the one the last new Device went on. |
| **Default Tab** | The Tab a new Device or Widget goes to when the Build is done (💾 Save Build ... > Move to Tab). Empty: the Tab the Build Tab came from. **➕ Add new Tab…** in an Add box sets it too. |

They are the same two dropdowns as on the 🔨 Build Tab's Edit layout bar. They are kept by the Interface ID and Tab ID, so a Schema
without that Interface or Tab starts the old way. (Skynet Rule 4.6)

## New User Recipes

What a new Recipe starts with when you press **NEW** on the Recipe tab. You can change each one in the Recipe. **Units** (US or Metric) is not here: it is a Skynet Panel Setting, in **Settings > Panel settings** ([Settings](09-settings)).

### Batch Size (Gallons) or Batch Size (Liters)

This only affects new User Recipes. This is your normal Batch size when Manually creating a Recipe in Skynet. Skynet does not pretend to be a Recipe Builder and can import a standard Beer.xml file from the popular Recipe builders with no coding on your part in Skynet. Simply create the recipe in your favorite Recipe Builder or get one from a forum or a friend and import it. As long as the import is in the beer.xml agreed standard, Skynet should import it. If you never plan to build a Recipe here you can ignore this entire Section as it has some defaults set to what is most common regardless.

### Mash Profile

The Mash Profile a new Recipe starts with. Skynet Single Step, Batch Sparge: one rest at 152 °F (67 °C) for 60 minutes, the usual mash for most beers.

**Strike Temperature**
The water is heated hotter than the mash temperature (the Strike Temperature), because the grain cools it down when it goes in. The mash tun soaks up some heat too: that is the Offset for Equipment. Cold grain cools the water more: if your grain is colder on Brew Day than the recipe planned for (72 °F), you will land under the mash temperature.

**Adding the grain**
Add the grain slowly while stirring, so no dry clumps (dough balls) form, until you reach the mash temperature. Heat the water (the Pre Strike) a bit higher than the Strike Temperature and let it cool to Strike before the grain goes in: cooling is easy, heating a full mash tun back up is hard.

**Mash length and temperature**
A lower mash temperature (148 to 150 °F) makes a drier, lighter beer; a higher one (154 to 158 °F) a sweeter, fuller one. 60 minutes is enough for most malts today. Best practice: keep the mash at its temperature for the whole mash, with a lid on or the heat on.

**Sparge**
After the mash, the sugar is rinsed out of the grain (the sparge). Batch Sparge: drain, add hot water, stir, rest, drain again. Fly Sparge: hot water is sprinkled on top while the wort drains slowly from the bottom; slower, often a little more sugar. Brewzilla type (brew in a bag or a basket): lift the grain out and pour hot water over it. Each one changes how much sugar you get out of the grain (the efficiency).

### Boil Profile

The Boil Profile a new Recipe starts with. Mostly it is the Boil Time: how long the wort boils (Skynet 60 Minute Boil is 60 minutes). It can also have its own Boil Off, and every Skynet Boil Profile asks the kettle volume at the start and the end of the boil.

### Water Profile

The water a new Recipe starts with. Tap Water unless you pick another.

What is in your water changes the beer: Calcium and Magnesium (the hardness) help the mash and the yeast, Sulfate makes hops taste crisper and more bitter, Chloride makes malt taste fuller and rounder, and Bicarbonate (alkalinity) suits dark beers but can make pale ones dull. Chlorine gives a medicine taste.

Your Water Department's water quality report gives the numbers, or use a Water Test Kit. You can also make your own "water" to match a famous brewing region: start with RO (reverse osmosis) or distilled water and add brewing salts.

And if you have been Brewing with your tap water and making Good beer, why rock the apple cart?

### Hop Stands

The temperature and time of the three Hop Stands (High, Middle, Low) a new Recipe starts with ([Mash, Boil and Water Profiles](35-mash-and-boil-profiles), Skynet Rule 17.14).

### Water to Grain Ratio

How much water goes in the mash for each pound (or kilogram) of grain (the grist ratio). Used to help work out the Strike Temperature on Brew Day.

A thick mash (less water, about 1.25 qt/lb or 2.6 L/kg) holds its heat well and is easy to stir. A thin mash (more water, 1.5 to 2 qt/lb or 3 to 4 L/kg) is easier for a pump to move and leaves more water for a batch sparge. Brew in a bag uses all the water at once. Anywhere in between makes good beer.

The technical side: a new Recipe starts with a 5 gallon (18.93 liter) batch, **Skynet Single Step, Batch Sparge** (152 °F for 60 minutes), **Skynet 60 Minute Boil** (its Boil Time comes from the Boil Profile) and Tap Water. The Batch Size is kept in liters and shown in Gallons or Liters as Units says. Brewhouse Efficiency (72 %) and the Strike Offset belong to the Equipment Profile, not the Recipe, and the Grain Temperature is 72 °F (22.2 °C) for planning. The label says Gallons for US and Liters for Metric.

## New Tabs

### Width of a New Tab (px)

How wide this Tab is, in pixels. A new Tab starts at 1600.

### Height of a New Tab (px)

How tall this Tab is, in pixels. A new Tab starts at 900.

The technical side: from 200 to 20000 pixels; empty = 1600 x 900. Each Tab changes its own in **Tab Settings**. The **Zoom** a screen starts with is in Settings > Panel settings (On startup). The **How many Pixels are Pipes and Hoses to be drawn on a Tab?** box is here too (see above).

## New User Templates and Schemas

These are used only by **new** things you make yourself. A Skynet Template keeps its own settings, and pumps and valves already made keep theirs.

| Setting | What it does |
|---|---|
| **Look of a New Schema** | The Look (theme) a new empty Schema starts with. The open Schema's own Look is changed in Settings > Panel settings ([Panel Looks](151-panel-looks)). |
| **Pump Overlay** | The Default Pump Overlay: the On overlay, what shows over a pump while it runs. Green glow ring unless you change it ([On overlay](58-on-overlay)). It only applies to new Pump Profiles: a new Pump Profile starts with it, and a new pump takes the Overlay of its Pump Profile ([Tab Background, Valve and Pump Profiles](36-tab-and-valve-profiles)). |
| **Valve Overlay** | The On overlay a new powered valve starts with. The steady lightning bolt unless you change it. |
| **Push Lockout (s)** | How long a new Pulse push button waits before another press counts, in seconds (0.1 to 60, 3 unless you change it). Each button changes its own in its Properties. |

Some things have no box because they are always the same: see **Skynet Defaults for New User Created Items** below. **Lost Comm** is set on each Interface ([Interfaces](76-interfaces)). The **Simulator** settings are only on the Simulator bar ([The Simulator bar](85-simulator-bar)).

## Moved to Settings

These change things already made, or how the whole panel works, so they are Settings, not Defaults. They are in **Settings > Panel settings: screen, Tabs and alerts**:

- **Units** (US or Metric): every amount, temperature and Recipe shows in it;
- **Tab Style** (the look of every Tab that has no Tab Style of its own);
- **Menu Bar**, **Sound**, **On startup** (Zoom, Full screen);
- **\L Rich Text Code Size**;
- **Hover Delay** ([Hover help in dialogs](147-hover-help));
- **Phones and tablets**;
- the **Grain weight label** and the gravity points label;
- **Hop alerts**;
- the **Order of the Menu**.

The Look (theme) of the open Schema is in Settings > Panel settings ([Panel Looks](151-panel-looks)), and Pulse is always 100 ms.

## The other settings on this tab

**Defaults are for new things only.** Labels, Text Boxes, the Default pipe size and the IP Types are kept on each item when it is made, so changing them here never changes what is already on your Tabs.

New Schema from a Skynet Template, new Tabs (Tab Background Profile), Labels and Text Boxes. The Valve and Pump Profile a new one starts with is the one marked **Default** in its own list ([Tab Background, Valve and Pump Profiles](36-tab-and-valve-profiles)). See [The Menu](33-menu).

## Tap Water

Your own tap water: the numbers that matter for brewing. Every Recipe starts with Tap Water on its Waters tab, on every Level, unless you pick another water. Fill them in, then press **Save** (the Default tab's one Save, at the top).

**Where to find the numbers:**

- **Your Water Department.** Most cities and water companies put a water report on their web site. Search for your town's name and "water quality report". If you can't find it, call them and ask for the latest report. Look for Calcium, Magnesium, Sodium, Sulfate, Chloride, Bicarbonate or Alkalinity, pH, and whether they add chlorine or chloramine.
- **A Water Test Kit.** Brewing and aquarium stores sell them, and so do pool supply stores. Most kits give Total Hardness, Total Alkalinity, pH and chlorine. A water testing lab can test a mailed sample for all of the numbers.
- **Well water** has no Water Department report: use a Test Kit or a lab.

Water changes with the seasons, so check again now and then and change the **Date**.

The boxes:

- **From**: Water Department or Test Kit.
- **Date**: when the report or the test was done.
- **Calcium**, **Magnesium**, **Sodium**, **Sulfate**, **Chloride**, **Bicarbonate**: in ppm (the same as mg/L).
- **Alkalinity**: what most Test Kits give. It is the same thing as Bicarbonate, so type either one and the other follows.
- **Hardness**: worked out from Calcium and Magnesium (greyed). A Test Kit gives it too, so you can check your numbers.
- **pH**: 7 is neutral; tap water is often 7 to 8.5.
- **Chlorine**: None, Chlorine, Ammonia + chlorine (Chloramine) or Unknown. Either one gives a medicine taste to beer. One Campden tablet in 20 gallons takes out both.

Rest the mouse on a box (or tap its name) to see what it does for the beer.

The technical side: Tap Water is a Water Profile (☰ Menu > Water Profile lists it) that is made when the Brain first starts and is never deleted. A Recipe or the Default settings with no Water Profile picked uses it. Bicarbonate = Alkalinity (as CaCO3) x 1.22. Hardness (as CaCO3) = 2.497 x Calcium + 4.118 x Magnesium. A Process reads it with the `rcp_Water_...` Skynet_Fields (Help 99).

## Skynet Defaults for New User Created Items

These defaults are set and cannot be changed, but can be Changed in a New User Template.

- **Pump size**: the Pump Standard, 150 x 150 for a 1/2" pipe, then the size of its pipes.
- **Valve size**: the Valve Standard, 150 x 150 for a 1/2" pipe, then the size of its pipes.
- **Pipe fittings**: always size to their pipes.
- **Pump cover color**: None.
- **Flow color** (In and Out): Blue.
- **Skynet Dial**: Cooler and Hotter range 2; Cold, OK, Hot = Blue, Green, Red.
- **Alarm Set Graphic (Layer 2)**: None.

The section titles on this tab have a blue back, so each part is easy to find. The title and **Save** stay at the top while the rest scrolls (Skynet Rule 2.51).
