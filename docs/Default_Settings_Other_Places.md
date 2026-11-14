# Defaults set somewhere else: review list

OakBarn Brewery, 2026-11-14 (Default tab markup, "Other Places"): "All of these need to be set here as well. Create an MD as
where the Other Place These might be set. If set in another place they are changed here and vice versus (only one true
Default). Create the MD First for me to review because I may delete the other choice than the Default Tab."

This lists every row of **☰ Menu > Default settings > Defaults set somewhere else (to look at)** (`otherDefaults()` in
`public/app.js`, Rule 2.42). For each one it gives the value now, the other place where it is set, and what that other place
really changes.

**Nothing is built yet.** Mark each row, then the Default tab work goes ahead.

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

## The list

| # | Default | Now | Other place | Kind | Your choice: box on the Default tab? Remove the other place? |
|---|---|---|---|---|---|
| 1 | Look (theme) | Office Black | Settings > Panel settings > Look (theme) | A | |
| 2 | A new Tab's back color and text colors | From the Look (Skynet Night blue gray) and the Tab Style | Settings > Panel settings > Look (theme); Tab Style on the Default tab | A (comes from row 1) | |
| 3 | Pump size | Pump Standard: 150 x 150 for a 1/2" pipe, then the size of its pipes | The pump's Width and Height | B | |
| 4 | Valve size | Valve Standard: 150 x 150 for a 1/2" pipe, then the size of its pipes | The valve's Width and Height | B | |
| 5 | Pipe fittings: Autosize to pipe | On | Each fitting's Properties | B | |
| 6 | On overlay (powered valves and pumps) | The steady red and yellow bolt | Each Device's Properties | B | |
| 7 | Glow ring on a new pump | Green | The pump's Properties | B | |
| 8 | Pump cover color | None | The pump's Properties | B | |
| 9 | Flow color (In and Out) | None | Each vessel, pipe and hose | B | |
| 10 | Skynet Dial | Cooler and Hotter range 2; Cold, OK, Hot = Blue, Green, Red | The item's Text attributes ⬢ | B | |
| 11 | Pulse button time | 100 ms | Fixed (Rule 1.9) | C | |
| 12 | Push button lockout | 3 seconds | The button's Properties | B | |
| 13 | Lost board link | Outputs turn off after 10 seconds | The Interface settings (each board) | B (one board) | |
| 14 | Simulator: a wait on a reading | Counted as reached after 60 clock seconds | Settings > Simulation | A | |
| 15 | Simulator bar | Opens at 25× speed with Auto skip on | The Simulator bar | A | |
| 16 | How a Tab shows | Fit screen (no up and down scrolling) | Zoom tab | A (Zoom on startup is already on the Default tab) | |
| 17 | Interface of a new Device | The Default Interface, else the one the last new Device went on, else the first | The Add Device box; the 🔨 Build Tab's Interface list | A (Default Interface is already on the Default tab and linked) | |
| 18 | A new Schema (not a copy) | One pretend Mega on the Simulator | Interface settings | A | |
| 19 | Setup: keep users when updating | Update and keep everything | Setup (the installer) | Setup only: the panel cannot change the installer's choice before it runs | |
| 20 | BruControl Import: names | Skynet names (keeping BruControl names takes two warnings) | The Importer, page 4 | Importer only | |
| 21 | BruControl Import: Look | The Skynet Look closest to the BruControl theme, else Office Black | Settings > Panel settings > Look (theme) | A (follows row 1) | |

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
