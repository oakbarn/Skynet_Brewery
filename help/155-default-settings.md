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

## The other settings on this tab

New Recipes (Units, Batch size, Profiles, Boil time, efficiency ...), how amounts show on the Recipe tab, hop alerts, new Tabs and
valves (Tab Background Profile, Tab Style, Valve Profile), the Menu Bar, Sound, On startup (Zoom, Full screen), Text (the look of
every text box) and Phones and tablets. See [The Menu](33-menu).

## Tap Water

Your own tap water: the numbers that matter for brewing. Every Recipe starts with Tap Water on its Waters tab, on every Level, unless you pick another water. Fill them in, then press **Save Tap Water**.

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

Some defaults are changed in another place. They are listed here so you can see them all, with **what it is now**, **where it is
changed** and its **Rule**. Nothing is changed in this list. For example:

- the **Look** (Office Black) and a **new Tab's back and text colors**, from Settings > Panel settings > Look ([Panel Looks](151-panel-looks));
- the **Pump Standard** and **Valve Standard** (drawn 150 x 150 for a 1/2" pipe);
- the **On overlay** (the steady bolt), the **Green glow ring** on a new pump, **flow colors** (None);
- the **Skynet Dial** ranges and colors, **Pulse** (100 ms) and the **push button lockout** (3 seconds);
- the **Simulator** (a wait is counted as reached after 60 seconds; the bar opens at 25x with Auto skip);
- **Setup** and the **Import** (Skynet names, and its Look).

Whenever a new default is added to Skynet, it is added to this tab too.

## Order of the Menu

At the bottom, as before: type a number to move a Menu tab.
