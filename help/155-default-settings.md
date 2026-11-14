# Default settings

**☰ Menu > Default settings** is the one place to see **every default** in Skynet (Skynet Rule 2.42). It opens only from the
**☰ Menu**. It used to be called the **Default** tab.

These settings belong to the **panel**, so they are the same in every Schema. **Admins** change them and press **Save**; everyone
else can look.

## Pipes, hoses and sizes

| Setting | What it does |
|---|---|
| **Default pipe size** | 1/2" unless you change it (1/4" to 6", with the mm size beside each). A **new pipe** starts at this size. Every **Device, Pipe Fitting and item with IPs** (pumps, valves, flow meters, elbows, tees, Valve Tees, probe tees ...) that has **no pipe on it** is drawn for this size, so a new pump already matches your pipes. |
| **Default hose size** | The size a **new hose** starts at. |
| **How thick a 1/2" pipe is drawn on a new Tab** | In pixels; empty = 10. Each Tab can still change it in **Tab settings**. |
| **Width** and **Height of a new Tab** | In pixels; empty = 1600 x 900. |

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

## New User Templates and Schemas

These are used only by **new** things you make yourself. A Skynet Template keeps its own settings, and pumps and valves already made keep theirs.

| Setting | What it does |
|---|---|
| **Look of a New Schema** | The Look (theme) a new empty Schema starts with. The open Schema's own Look is changed in Settings > Panel settings ([Panel Looks](151-panel-looks)). |
| **Pump Overlay** | The On overlay a new pump starts with: what shows over it while it runs. Green glow ring unless you change it ([On overlay](58-on-overlay)). |
| **Valve Overlay** | The On overlay a new powered valve starts with. The steady lightning bolt unless you change it. |
| **Push Lockout (s)** | How long a new Pulse push button waits before another press counts, in seconds (0.1 to 60, 3 unless you change it). Each button changes its own in its Properties. |

Some things have no Default because they are always the same: pipe fittings always size to their pipes, a new pump's cover color is None, a new Alarm's Set Graphic (Layer 2) starts at None, and the flow color is Blue. **Lost Link** is set on each Interface ([Interfaces](76-interfaces)). The **Simulator** settings are only on the Simulator bar ([The Simulator bar](85-simulator-bar)).

## Hover Help

| Setting | What it does |
|---|---|
| **Hover Delay (ms)** | How long the mouse must rest on a name before its Hover Help shows, in milliseconds (1000 ms = 1 second). **0 or empty: it shows at once** (the default). Up to 5000. Try 300 to 500 if Hover Help pops up while you only move the mouse across a dialog. Phones and tablets have no mouse: a tap still opens the help at once. See [Hover help in dialogs](147-hover-help). |

## The other settings on this tab

New Recipes (Units, Batch size, Profiles, Boil time, efficiency ...), how amounts show on the Recipe tab, hop alerts, new Tabs and
valves (Tab Background Profile, Tab Style, Valve Profile), the Menu Bar, Sound, On startup (Zoom, Full screen), Text (the look of
every text box) and Phones and tablets. See [The Menu](33-menu).

## Tap Water

Your own tap water: the numbers that matter for brewing. Every Recipe starts with Tap Water on its Waters tab, on every Level, unless you pick another water. Fill them in, then press **Save** (the Default tab's one Save, at the top or the bottom).

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

## Defaults set somewhere else

A few defaults are changed in another place. They are listed here so you can see them all, with **what it is now**, **where it is
changed** and its **Rule**. Nothing is changed in this list:

- the **Look** of the open Schema, from Settings > Panel settings > Look ([Panel Looks](151-panel-looks));
- **Pulse** (100 ms): fixed, and used by every Pulse button, the ones already made too;
- **Setup**: keep the users;
- the **Import**: its names and its Look.

Whenever a new default is added to Skynet, it is added to this tab too.

## Order of the Menu

At the bottom, as before: type a number to move a Menu tab.
