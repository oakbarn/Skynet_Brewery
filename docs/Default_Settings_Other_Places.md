# Defaults set somewhere else: review list

OakBarn Brewery, 2026-11-14 (Default tab markup, "Other Places"): "All of these need to be set here as well. Create an MD as
where the Other Place These might be set. If set in another place they are changed here and vice versus (only one true
Default). Create the MD First for me to review because I may delete the other choice than the Default Tab."

This lists every row of **☰ Menu > Default settings > Defaults set somewhere else (to look at)** (`otherDefaults()` in
`public/app.js`, Rule 2.42). For each one it gives the value now, the other place where it is set, and what that other place
really changes.

**Reviewed 2026-11-14.** OakBarn Brewery's choices are below, and they are built (see *Your choices*).

## Your choices (2026-11-14)

| Row | Choice (OakBarn Brewery) | Built as |
|---|---|---|
| 1, 2 | Recommendations good | Default tab: **Look of a New Schema**. A new Tab keeps taking its colors from the Look. |
| 3, 4 | "Rule is the default so no need for defaults; remove default choice everywhere" | Off the list. The Pump and Valve Standards (Rules) set the size. |
| 5 | "Always Resize pipes (no user Option); remove default choice everywhere" | The **Autosize to pipe** switch is gone: every pipe fitting always sizes to its pipes (Rules 5.14, 5.36). |
| 6a | Default Overlay for a New User Pump Template | Default tab: **Pump Overlay** (Green glow ring). |
| 6b | Default Overlay for a New User Valve Template | Default tab: **Valve Overlay** (the steady bolt). |
| 7 | "7 use the 6a only" | Folded into 6a. |
| 8 | Delete; None on a new User Template; remove default choice everywhere | A new pump's cover color is None. Off the list. |
| 9 | Set default to Blue, remove default choice everywhere | The flow color is Blue (it already was, #4fb3ff). Off the list. |
| 10 | Defaults good; set as default, no user option | The Skynet Dial keeps its ranges and colors. Off the list. |
| 11 | No need for Grey; add a Note that it is applied to every existing Pulse Button | Stays on the list with that note. |
| 12 | Recommendation good | Default tab: **Push Lockout (s)** (3 s, for new buttons; Rule 6.7). |
| 13 | Mandatory field on a new Interface, edited on the Interface dialog; set all Interfaces and Templates to the recommended setting | **Lost Link (s)** is a must-fill box on the Interface dialog (3 to 600, 10 to start); the sample and config are set to 10 (Rule 6.3). |
| 14, 15 | On the Simulator Bar, a user can change; remove the idea of defaults for the Bar. Then: "All Simulator Bar settings should be ONLY!!! on the Simulator Bar" | Settings > Simulation is gone; every Simulator setting is on the bar (⚙ Settings). Off the list (Rule 10.10). |
| 16, 17 | Recommendations good | Already on the Default tab (16); Default Interface stays (17, Rule 4.6). |
| 18 | "A Schema does not need an interface default. Users can add devices. Those devices have the Interface on them" | A new empty Schema starts with no Interface (Rule 10.5). Off the list. |
| 19, 20, 21 | Recommendations good | Stay on the list. |
| Also | "Default Layer 2 on a new Alarm Template is None" | A new Alarm's Set Graphic (Layer 2) starts at None (Rule 7.12). |
| Also | "An Exist pump or valve ... have no defaults interaction (only the Pulse Buttton and Theme effect existing. These are for new User Created only" | The Default tab's new part is named **New User Templates and Schemas** and only touches new things (Rule 2.42). |

**Later the same day (OakBarn Brewery):** anything that changes things already made (the Look, Pulse, Tab Style, Menu Bar, Sound, On startup, \L size, Hover Delay, Phones and tablets, the grain labels, Hop alerts, Order of the Menu) is a Setting: it moved to Settings > Panel settings: screen, Tabs and alerts, and the Default tab does not name it. The list at the bottom of the Default tab is now **Skynet Defaults for New User Created Items** ("These defaults are set and cannot be changed, but can be Changed in a New User Template"), and the section titles have a blue back.

The text below is the list as it was reviewed.

## Two kinds of "other place"

- **A. The same default, set in a second place.** Here "only one true Default" works as asked: the Default tab gets a box, and
  changing either place changes the other. You may remove the other place.
- **B. One item's own setting.** The other place (for example a pump's Properties) changes **that one item**, not the default.
  The Default tab gets a box for what a **new** item starts with. The item's own box stays, or nothing could be changed on one
  item. Changing one item does **not** change the default, and changing the default does **not** change items already made
  (Rule 1 of the Old Ways Policy: never force old items to a new standard).
- **C. Fixed.** It is set nowhere today. It can get a box on the Default tab, or stay fixed.

## Defaults are for new things

OakBarn Brewery, 2026-11-14: "Generally Defaults are used for New Things. Existing Templates might have their Properties already
set. For an Example, the Blickmann Riptide Template might have it's label attributes set, and the defaults for a New Blickmann
would follow the Template settings, not the Default Tab. A new Pump Template (User Created) would use the Defaults when it is
built."

- A **new** item starts with the Default tab's values.
- A new item made **from a Template** starts with the Template's own settings. The Default tab only fills in what the Template
  leaves unset.
- A **new User Template** takes the Default tab's values when it is built, and keeps them from then on.
- Items and Templates that already exist keep their own settings.

## The list, with recommendations

Recommendations follow "Defaults are for new things" (above): a box on the Default tab sets what a **new** item, Template or Schema
starts with, and an item's own box stays so one item can still be changed. **Bold** words are the recommendation; the last column
is yours.

| # | Default | Now | Other place | Kind | Recommendation | Your choice |
|---|---|---|---|---|---|---|
| 1 | Look (theme) | Office Black | Settings > Panel settings > Look (theme) (the Look of this Schema) | A | **Add** "Look of a new Schema" to the Default tab. **Keep** Settings > Look: it changes the Schema that is open, not new ones. | |
| 2 | A new Tab's back color and text colors | From the Look and the Tab Style | Look (theme); Tab Style on the Default tab | A | **Already on the Default tab** (Tab Style for a new Tab). **Take it off this list.** | |
| 3 | Pump size | Pump Standard: 150 x 150 for a 1/2" pipe, then the size of its pipes | The pump's Width and Height | B | **Show it greyed** on the Default tab (a known value, Rule 5.27). It is a Standard the drawings and IPs are made for, so not changed there. Templates keep their own. **Keep** the pump's own Width and Height. | |
| 4 | Valve size | Valve Standard: 150 x 150 for a 1/2" pipe, then the size of its pipes | The valve's Width and Height | B | Same as row 3 (Rule 5.29). | |
| 5 | Pipe fittings: Autosize to pipe | On | Each fitting's Properties | B | **Add** an "Autosize" switch for new fittings. **Keep** each fitting's own switch. | |
| 6 | On overlay (powered valves and pumps) | The steady red and yellow bolt | Each Device's Properties | B | **Add** "On Overlay" for new powered valves and pumps. Templates keep their own. **Keep** each Device's own. | |
| 7 | Glow ring on a new pump | Green | The pump's Properties | B | **Add** "Glow Ring" for a new pump (a new User Pump Template takes it when built). The RipTide and other Templates keep their own. **Keep** the pump's own. | |
| 8 | Pump cover color | None | The pump's Properties | B | Same as row 7: **add** "Cover Color" for new pumps, **keep** the pump's own. | |
| 9 | Flow color (In and Out) | None | Each vessel, pipe and hose | B | **Add** "Flow Color" for new pipes, hoses and vessels. **Keep** each one's own. | |
| 10 | Skynet Dial | Cooler and Hotter range 2; Cold, OK, Hot = Blue, Green, Red | The item's Text attributes ⬢ | B | **Add** the Dial's range and three colors for new items. **Keep** each item's own. | |
| 11 | Pulse button time | 100 ms | Fixed (Rule 1.9) | C | **Show it greyed** (a known value). Changing it would change what Pulse means everywhere. | |
| 12 | Push button lockout | 3 seconds | The button's Properties | B | **Add** "Push Lockout (s)" for new buttons. **Keep** each button's own. | |
| 13 | Lost board link | Outputs turn off after 10 seconds | The Interface settings (each board) | B | **Add** "Lost Link (s)" for a new Interface. **Keep** each board's own: a slow radio board may need longer. | |
| 14 | Simulator: a wait on a reading | Reached after 60 clock seconds | Settings > Simulation | A | **Move** it to the Default tab and **remove** it from Settings > Simulation (one true Default). | |
| 15 | Simulator bar | Opens at 25× speed with Auto skip on | The Simulator bar | A | **Add** "Simulator Speed" and "Auto Skip" (what the bar opens with). **Keep** the bar's own buttons: they change the run going on now. | |
| 16 | How a Tab shows | Fit screen | Zoom tab | A | **Already on the Default tab** (On startup > Zoom). The Zoom tab changes the screen now, not the default. **Take it off this list.** | |
| 17 | Interface of a new Device | The Default Interface, else the last one used | The Add Device box; the 🔨 Build Tab's list | A | **Already on the Default tab** and linked (Rule 4.6). **Take it off this list.** | |
| 18 | A new Schema (not a copy) | One pretend Mega on the Simulator | Interface settings | B | **Add** "Interface of a New Schema" (Simulator Mega, or a board you pick). **Keep** Interface settings: they change the open Schema's boards. | |
| 19 | Setup: keep users when updating | Update and keep everything | Setup (the installer) | Setup only | **Leave it on this list** (to look at). The Setup runs before the panel, so the panel cannot set it. | |
| 20 | BruControl Import: names | Skynet names | The Importer, page 4 | Importer only | **Leave it on this list.** It is the Importer's choice, made for each import. | |
| 21 | BruControl Import: Look | The Skynet Look closest to the BruControl theme, else Office Black | Settings > Panel settings > Look (theme) | A | **Leave it on this list**; when nothing fits, it uses row 1's "Look of a new Schema". | |

**In short:** add 11 boxes (rows 1, 5, 6, 7, 8, 9, 10, 12, 13, 15, 18), move 1 (row 14), show 3 greyed (rows 3, 4, 11), take 3 off the
list because they are already on the Default tab (rows 2, 16, 17), and leave 3 on the list (rows 19, 20, 21).

## Notes

- Rows 19 to 21 belong to the Setup and the BruControl Import. The Default tab can **show** them, but the Setup runs before the
  panel and the Importer is its own program, so a box on the Default tab could only set what they start with next time.
- Rows already linked today: **Default Interface** and **Default Tab** (Rule 4.6) are the same setting as the 🔨 Build Tab's two
  lists, so they are already "one true Default".
- The **Hover Delay** (PR #381) is set only on the Default tab.

## What happens after your review

For each row you mark:
1. A box is added to the Default tab, in the right section, with its Hover Help.
2. Kind A: the other place and the Default tab read and write the same setting, or the other place is removed if you say so.
3. Kind B: the box sets what a new item starts with; the item's own box stays unless you say otherwise.
4. The row leaves the "Defaults set somewhere else" list once it has a box.
