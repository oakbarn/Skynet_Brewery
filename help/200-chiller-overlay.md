# Chiller Overlay: place_Chiller

Most brewers put an immersion chiller into the Brew Kettle by hand near the end of the boil, run tap water through it, and
let the water out down a drain or outside. Then they take it out again. A Process shows this on the Tab with two lines
(Skynet Rule 5.42):

    place_Chiller = Immersion_Chiller, BK_Vessel
    remove_Chiller = BK_Vessel

## place_Chiller = template, vessel

- **template** is a Chiller Template: a chiller that goes into a vessel (an immersion coil). Skynet has **Immersion_Chiller**
  and **Chillzilla**. Plate and counterflow chillers sit outside the kettle on their own pipes, so they are not placed this way.
- **vessel** is the Name of the vessel it goes into (a Label works too when only one vessel has it).

The chiller is drawn **over the vessel**, on top of it. Two hoses are drawn with it:

- **In:** from the **Tap Water Valve** on the vessel's Tab (one with "chill" in its Label first) to the chiller's In.
- **Out:** from the chiller's Out to the **drain IP** on that Tab (an IP with "Drain" or "outside" in its Label).

Water flows through the chiller only while that Tap Water Valve is open, the same as a pipe (Rule 5.41).

The chiller gets its Name and Label from its Template: `wgt_CHL_Immersion~chiller_BH`, Label **Immersion chiller**. Its hoses
get the next free Hose names (Hose_3, Label hose_3).

A chiller already placed on that vessel is taken off first, so the line can run again safely.

## remove_Chiller

- `remove_Chiller = BK_Vessel` takes the chiller, its IPs and its two hoses off that vessel.
- `remove_Chiller` alone takes off every chiller a Process placed.
- Nothing placed: nothing happens.

## Picking in the Process editor

Start typing `place_C` and pick **place_Chiller**: the list shows the Chiller Templates. Pick one and the list shows the
Vessels, with the **Brew Kettle first**. `remove_Chiller` shows the Vessels too.

## Good to know

- Only the drawing changes. The Process goes on at once and does not wait. To wait for the brewer, add an `ask` line after
  it: `ask "Put the chiller in the kettle and hook up its hoses, then press Done"`.
- The Process Check tells you before the Process runs if the Template or the Vessel is not there, or if the vessel's Tab has
  no Tap Water Valve or no drain IP.
- The 3 Vessel sample places the Immersion chiller in the Boil kettle 15 minutes before the end of the boil and takes it off
  after chilling.
