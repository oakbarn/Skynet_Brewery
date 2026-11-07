# Default settings

**☰ Menu > Default settings** is the one place to see **every default** in Skynet (Skynet Rule 2.42; Fritz, 2026-11-07: "create
that default settings tab (accessed by the Hamburger Menu Only) and let me look at all the Defaults"). It opens only from the
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
5.36). Since 2026-11-07 this covers **pumps** too (Fritz: "have all the devices with Ips conform to that size"). For example,
add a Blichmann pump to a Tab with 1" pipes: it is drawn for 1" pipes as soon as the pipes are on it, and for the Default pipe size
before that. A fitting sitting on a vessel opening with no pipe keeps its size. See
[Pipe fittings and Manual Valves](87-pipe-fittings-and-manual-valves).

## The other settings on this tab

New Recipes (Units, Batch size, Profiles, Boil time, efficiency ...), how amounts show on the Recipe tab, hop alerts, new Tabs and
valves (Tab Background Profile, Tab Style, Valve Profile), the Menu Bar, Sound, On startup (Zoom, Full screen), Text (the look of
every text box) and Phones and tablets. See [The Menu](33-menu).

## Defaults set somewhere else

Some defaults are changed in another place. They are listed here so you can see them all, with **what it is now**, **where it is
changed** and its **Rule**. Nothing is changed in this list. For example:

- the **Look** (Office Black) and a **new Tab's back and text colors**, from Settings > Panel settings > Look ([Panel Looks](151-panel-looks));
- the **Pump Standard** and **Valve Standard** (drawn 150 x 150 for a 1/2" pipe);
- the **On overlay** (the steady bolt), the **Green glow ring** on a new pump, **flow colors** (None);
- the **Skynet Dial** ranges and colors, **Pulse** (100 ms) and the **push button lockout** (3 seconds);
- the **Simulator** (a wait is counted as reached after 60 seconds; the bar opens at 25x with Auto skip);
- **Setup** and the **BruControl Import** (Skynet names; the Look closest to the BruControl theme).

Whenever a new default is added to Skynet, it is added to this tab too.

## The BruControl Import

The Import makes Schemas; when one is loaded in the Panel it uses these Default settings. The Import draws no pipes, so its pumps
and valves are drawn for the **Default pipe size** until you pipe them.

## Order of the Menu

At the bottom, as before: type a number to move a Menu tab.
