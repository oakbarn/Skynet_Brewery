# Default settings

**☰ Menu > Default settings** has **every default** in Skynet (Skynet Rule 2.42): every default setting **must** be on this page, and it **may** also be in other places as well, such as a Device's Properties. Wherever else it shows, it is the same setting: change it in one place and every place shows it. It opens only from the
**☰ Menu**. It used to be called the **Default** tab. Since 2026-11-21 it also has the Boil temperature, the Panel settings and the
Order of the Menu, which were on the Settings page; that page is now **Admin Settings** (accounts, users, passwords, Approved Devices,
sending codes and Patron), and the **🔐 Admin Settings** button at the top of this tab opens it ([Admin Settings](09-settings)).

These settings belong to the **panel**, so they are the same in every Schema. **Admins** change them and press **Save**; everyone
else can look.

## Units and your brewery

| Setting | What it does |
|---|---|
| **Brewery Name** | A Patron perk: your brewery's name, shown on every Tab's Menu Bar and in the Process Editor, and the Copyright and Created by of every new Process. Not a Patron: greyed out, and the Menu Bar shows Skynet Panel. Empty: the name on your Patron code. See [Patron](198-patron). |
| **Units** | US (gallons, pounds, °F) or Metric (liters, kilograms, °C). Every amount and temperature shows in it. Skynet keeps every number in metric, so it only changes what you see and type (Skynet Rule 2.59). |
| *Boil temperature (air pressure)* | The two boxes below, under their own title. |
| **Airport (ICAO)** | The 4 letter code of your nearest airport with a weather report (its METAR station), for example `KDFW`. Skynet reads its air pressure to work out the temperature water boils at here (`skn_Boil_Temp`). |
| **Elevation** | Your brewery's height above sea level: feet for US Units, metres for Metric (kept in metres). |

Boxes are typed in the Units they show. Change **Units** and press **Save**, and the boxes then show in the new Units.
**Test** beside Airport (ICAO) keeps the Airport and Elevation as typed, fetches the airport's report now and shows the airport, the air pressure and the boil temperature under Elevation.
The **Typed air pressure** is not here: it is not a default. It is the air pressure on one Brew Day, to be asked in the Brew Day interview (not built yet; a pressure typed before is kept and used); left empty, Skynet uses the airport's report, or a standard day at your Elevation.
How to find your airport's code and your Elevation: [Boil temperature from the air pressure](238-boil-temperature).

## Pipes, hoses and sizes

### Default Pipe Size

Common size of the most Pipes to be placed on a new Tab. Pipe Fittings are added automatically and will auto size to the pipe joined. Individual pipe size can be changed when they are placed and any new pipe joined to that different size are auto sized to that pipe size. You can change a pipe size individually and the pipe size will cascade to auto size. You can create a manifold that looks like the real world one in your brewery to a large degree. The most common Pipes are 1/2". The end type IPs are set by the IP Type but can be changed individually on a Pipe IP.

IPs snap together and are locked.

IPs lock automatically and a Pipe's IPs need to be unlocked to move or resize a Pipe. That can only be done in a Build mode for Pipes.

Pipes have a flow simulation.

### IP Type (for Pipes)

The default connector a new pipe has on both ends: Tri-Clamp, NPT, BSP or Quick Disconnect. It is the size of the pipe. Pipes when placed keep connector type. The Individual IPs on a Pipe end can be changed. Set the Pipe Default IP type for the way most of your Pipes are set up. For Brewing Pipes, the most common are 1.5 Tri Clamp. (TC1.5) When Pipes are Joined, the IPs are auto typed to the join. Once locked, they stay until unlocked. Generally, it is done automatically after your first pipe join.

### Default Hose Size

Common size of the hoses to be placed on a new Tab. Individual hose size can be changed when they are placed. Hoses can join Pipes, Fittings and anything with IPs but retain their size unlike a Pipe. There is no auto sizing of Hoses. You can create a manifold that looks like the real world one in your brewery to a large degree. The most common Hoses are 1/2". The end type IPs are set by the IP Type but can be changed individually on a Hose IP.

IPs snap together and are locked.

Hoses connected with Quick Disconnect IPs can be quickly unlocked and moved even while brewing.

Vessel Devices and Widgets have a large area Quick Disconnect IP at the Top where a Hose can simulate being hooked over the top of the Vessel.

Hoses have a flow simulation.

### IP Type (for Hoses)

The default connector a new Hose has on both ends: Tri-Clamp, NPT, BSP or Quick Disconnect. It is the size of the hose. Hoses when placed keep connector type. The Individual IPs on a Hose end can be changed. Set the Hose Default IP type for the way most of your hoses are set up. When Hoses are Joined, the IPs are auto typed to the join. Once locked, they stay until unlocked. Generally, it is done automatically after your first hose join.

Each Tab can still change its own **Pipe Size** and **Hose Size** in **Tab Settings**. A Tab made before there was a Hose Size draws its hoses at its Pipe Size, as before. The Pixels boxes are in each **Tab Profile** (see **New Tabs** below).

The technical side: the sizes are 1/4" to 6", with the mm size beside each; Skynet starts at 1/2" for both, Tri-Clamp for pipes and Quick Disconnect for hoses ([Pipes, hoses and reducers](24-pipes-and-hoses), Skynet Rule 5.40). A new Device, Pipe Fitting or item with IPs (pumps, valves, flow meters, elbows, tees, Valve Tees, probe tees ...) is drawn for the Default Pipe Size until a pipe is on it. Items already made keep the size they had: changing it here only reaches new things (Skynet Rule 2.42). The Pixels box is from 2 to 100 (empty = 10).

### IP Types

A tick box for every IP Type and size: Tri-Clamp (TC1/2 to TC6), pipe thread (FPT female and MPT male, 1/8" to 6"), BSP, metric (DN6 to DN150), stainless Quick Disconnect (FMSSQD female and MSSQD male) and Camlock (CAMF female coupler and CAMM male adapter, 1/2" to 6"). Only the ticked ones show in the IP Type lists of pipes, hoses, pumps and Stove Top Vessels, with any already used in the Schema. None are ticked to start: tick the ones you use ([Pipes, hoses and reducers](24-pipes-and-hoses), Skynet Rule 5.40).

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
| **Default Tab** | The Tab a new Device or Widget goes to when the Build is done (✅ Finish Build ... > Move to Tab). Empty: the Tab the Build Tab came from. **➕ Add new Tab…** in an Add box sets it too. |

They are the same two dropdowns as on the 🔨 Build Tab's Edit layout bar. They are kept by the Interface ID and Tab ID, so a Schema
without that Interface or Tab starts the old way. (Skynet Rule 4.6)

## Brewer Type

What this brewery usually brews: **Extract Can Kit**, **Extract Partial Grain and Hops**, **All Grain** (to start) or **All Grain (own Grain Mill)**. When a Brew Day finds no Recipe, the **No Recipe Found** pop-up starts on it, and you can pick another there. See [No Recipe Found](100-brew-process#no-recipe-found).

## New User Recipes

What a new Recipe starts with when you press **NEW** on the Recipe tab. You can change each one in the Recipe. **Units** (US or Metric) is at the top of this tab (see **Units and your brewery**).

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

Not on Default settings any more: there are no Hop Stand defaults. A Recipe asks for the stand, its temperature and its time when a Whirlpool hop is added, with the common numbers in the Hover Help ([Mash, Boil and Water Profiles](35-mash-and-boil-profiles#the-three-hop-stands), Skynet Rule 17.14).

### Water to Grain Ratio

How much water goes in the mash for each pound (or kilogram) of grain (the grist ratio). Used to help work out the Strike Temperature on Brew Day.

A thick mash (less water, about 1.25 qt/lb or 2.6 L/kg) holds its heat well and is easy to stir. A thin mash (more water, 1.5 to 2 qt/lb or 3 to 4 L/kg) is easier for a pump to move and leaves more water for a batch sparge. Brew in a bag uses all the water at once. Anywhere in between makes good beer.

The technical side: a new Recipe starts with a 5 gallon (18.93 liter) batch, **Skynet Single Step, Batch Sparge** (152 °F for 60 minutes), **Skynet 60 Minute Boil** (its Boil Time comes from the Boil Profile) and Tap Water. The Batch Size is kept in liters and shown in Gallons or Liters as Units says. Brewhouse Efficiency (72 %) and the Strike Offset belong to the Equipment Profile, not the Recipe, and the Grain Temperature is 72 °F (22.2 °C) for planning. The label says Gallons for US and Liters for Metric.

## New Tabs

**Tab Profile for a new tab** is the only box here: the Tab Profile a new Tab starts with. The four boxes below are in each **Tab Profile** (☰ Menu > Tab Profile), with its background color and the look a new Device or Widget starts with ([Tab, Valve and Pump Profiles](36-tab-and-valve-profiles)). With **(none)** picked, a new Tab gets Skynet's own: 10, 6 and the size of the screen. What was set here before is kept in the Tab Profile.

### How many Pixels are Pipes to be drawn on a Tab?

This is simply how Pipes are drawn on your screen and do not affect anything other than the "Look". For normal Computer Screen resolutions (set on your computer by you but a default was set by the OS), 10 is a good starting point. It is for any new Pipes placed and does not affect any already placed, so it is a good idea to set it and forget it or your screen may look like it was drawn by a 3 year old.

### How many Pixels are Hoses to be drawn on a Tab?

This is simply how Hoses are drawn on your screen and do not affect anything other than the "Look". For normal Computer Screen resolutions (set on your computer by you but a default was set by the OS), 6 is a good starting point; Hoses are usually drawn thinner than Pipes. It is for any new Hoses placed and does not affect any already placed, so it is a good idea to set it and forget it or your screen may look like it was drawn by a 3 year old.

### Width of a New Tab (px)

This only affects new Tabs added to a Schema. This is how the Tab fits on the screen and if it needs Horizontal Scroll bars as part of your Tab is Off the screen if set too large. It is best to Not have any Scroll bars on a Tab. Changing your Computer Screen Resolution or using a Remote Computer can also affect how the screen is displayed with scroll bars or not. Phones and tablets will fit to size and you have little to no control if using one of those remotely. These should be set for the Computer that you use in your Brewery to follow the Skynet Panel. Or a Computer Screen Resolution set to 1920 x 1040, 1600 x 900 are good starting figures but may need slight adjustments for YOUR computer. The Width only affects a Horizontal Scroll Bar.

The screen sizing (the Skynet Zoom: Fit screen, Fit width, 50% to 150%) will affect if scroll bars are seen or not. Skynet starts at Fit screen, which draws the whole Tab smaller to fit your screen, so no scroll bars show. Your computer also decides how scroll bars look: Windows shows them; a Mac often hides them until you scroll (System Settings > Appearance); on Linux it depends on the desktop and the browser.

### Height of a New Tab (px)

This only affects new Tabs added to a Schema. This is how the Tab fits on the screen and if it needs Vertical Scroll bars as part of your Tab is Off the screen if set too large. It is best to Not have any Scroll bars on a Tab. Changing your Computer Screen Resolution or using a Remote Computer can also affect how the screen is displayed with scroll bars or not. Phones and tablets will fit to size and you have little to no control if using one of those remotely. These should be set for the Computer that you use in your Brewery to follow the Skynet Panel. Or a Computer Screen Resolution set to 1920 x 1040, 1600 x 900 are good starting figures but may need slight adjustments for YOUR computer. The Height only affects a Vertical Scroll Bar.

The screen sizing (the Skynet Zoom: Fit screen, Fit width, 50% to 150%) will affect if scroll bars are seen or not. Skynet starts at Fit screen, which draws the whole Tab smaller to fit your screen, so no scroll bars show. Your computer also decides how scroll bars look: Windows shows them; a Mac often hides them until you scroll (System Settings > Appearance); on Linux it depends on the desktop and the browser.

The technical side: from 200 to 20000 pixels. The boxes start filled in with the usable size of your screen (the screen less the taskbar: 1920 x 1040 on a 1920 x 1080 Windows screen). Left at that, a new Tab takes the size of the screen it is made on, so it fills the screen at Zoom Fit screen; a different number is kept for every new Tab. Each Tab changes its own in **Tab Settings**. The **Zoom** a screen starts with is in ☰ Menu > Default settings (On startup). The four boxes are in each Tab Profile.

## New User Templates and Schemas

These are used only by **new** things you make yourself. A Skynet Template keeps its own settings, and pumps and valves already made keep theirs.

| Setting | What it does |
|---|---|
| **Look of a New Schema** | The Look (theme) a new empty Schema starts with. The open Schema's own Look is changed in ☰ Menu > Default settings ([Panel Looks](151-panel-looks)). |

The **Pump Overlay** is now on each **Pump Profile** and the **Valve Overlay** on each **Valve Profile** ([Tab, Valve and Pump Profiles](36-tab-and-valve-profiles)). **Push Lockout (s)** is in **Panel settings (also in Settings)** below. What was set here is kept.

Some things have no box because they are always the same (for example the Pump and Valve Standards, and pipe fittings that size to their pipes). **Lost Comm** is set on each Interface ([Interfaces](76-interfaces)). The **Simulator** settings are only on the Simulator bar ([The Simulator bar](85-simulator-bar)).

## Default folders

**User Graphic** and **User Audio**: where your own pictures and sounds are (empty: `Images` and `sounds`). A Process can give only a
file name and Skynet looks here first ([Two-part paths](194-two-part-paths), Skynet Rule 7.23).

## Panel settings

How the whole panel works, so a change reaches things already made. They were on the Settings page until 2026-11-21:

- **Units** (US or Metric): every amount, temperature and Recipe shows in it. Skynet keeps every number in metric (°C, liters, kilograms, cm), so Units only changes what you see and type; switching it never changes a saved number (Skynet Rule 2.59). Mash, Boil and Equipment Profiles, Vessels and Vessel Templates show their numbers in it when they open; the Units box in each of them is greyed out and follows this one; on a running Tab every temperature shows in it too: a probe's reading (PV), its Setpoint (SV), its Dial, and the Setpoint and Offsets of a Heating Element or Fermentor Control, in their Properties and pop-ups as well. A probe kept in °C (the 3 Vessel Sample) shows 150.0 °F in US, and a probe kept in °F shows °C in Metric; what you type is saved in the probe's own units, and a number you did not change is saved exactly as it was. An Offset turns by 1.8 only (1 °C = 1.8 °F), never with the 32. Recipe items that come in their own unit keep it (an addition in grams, a yeast in Packs; hops are kept in kg and show in oz or g);
- **Tab Style** (the look of every Tab that has no Tab Style of its own);
- **Top Line**, **Sound**, **On startup** (Zoom, Full screen);
- **\L Rich Text Code Size**;
- **Hover Delay** ([Hover help in dialogs](147-hover-help));
- **Push Lockout (s)**: how long a new Pulse push button waits before another press counts;
- **Phones and tablets**;
- the **Grain weight label** and the gravity points label;
- **Brew Timers**: the Labels of the Skynet Boil Timer, Mash Timer and Whirlpool / Chilling Timer ([The Skynet Brew Timers](246-skynet-brew-timers));
- **Hop alerts**;
- **Title**, **Look (theme)** (saved at once), **Media folders**, **API key**, **BeerXML mapping**, the Processes that start with the server, and the restart limit and its Alarm.

**Order of the Menu**: type a number to move a Menu tab.

The Look (theme) is the open Schema's own ([Panel Looks](151-panel-looks)), and Pulse is always 100 ms.

## The other settings on this tab

**Defaults are for new things only.** Labels, Text Boxes, the Default pipe size and the IP Types are kept on each item when it is made, so changing them here never changes what is already on your Tabs.

New Tabs (Tab Profile), Labels and Text Boxes. (The New Schema from a Skynet Template answers are no longer here: each question starts with Skynet's own answer, and you change it in the Add new Schema box.) The Valve and Pump Profile a new one starts with is the one marked **Default** in its own list ([Tab, Valve and Pump Profiles](36-tab-and-valve-profiles)). See [The Menu](33-menu).

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

The technical side: Tap Water is a Water Profile (☰ Menu > Water Profile lists it) that is made when the Brain first starts and is never deleted. A Recipe or the Default settings with no Water Profile picked uses it. Bicarbonate = Alkalinity (as CaCO3) x 1.22. Hardness (as CaCO3) = 2.497 x Calcium + 4.118 x Magnesium. A Process reads it with the `skn_rcp_Water_...` Skynet_Fields (Help 99).

The section titles on this tab have a blue back, so each part is easy to find. The title and **Save** stay at the top while the rest scrolls (Skynet Rule 2.51).
