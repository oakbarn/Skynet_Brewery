# Chiller Overlay: place_Chiller

Most brewers put an immersion chiller into the Brew Kettle by hand near the end of the boil, run tap water through it, and
let the water out down a drain or outside. Then they take it out again. A Process shows this on the Tab with two lines
(Skynet Rule 5.42):

    place_Chiller = Immersion_Chiller, BK_Vessel
    remove_Chiller = BK_Vessel

## place_Chiller = template, vessel

- **template** is a Chiller Template: a chiller that goes into a vessel (an immersion chiller with 2 IPs, In and Out). Skynet has
  **Immersion_Chiller** and **Immersion_Chiller_Same_Side**. Plate and counterflow chillers (4 IPs) sit outside
  the kettle on their own pipes, so they are not placed this way.
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
- A chiller you built yourself and moved into a vessel by hand is never taken off by a Process. `place_Chiller` says that vessel
  already has one.
- Nothing placed: nothing happens.

## Picking in the Process editor

Start typing `place_C` and pick **place_Chiller**: the list shows the Chiller Templates. Pick one and the list shows the
Vessels, with the **Brew Kettle first**. `remove_Chiller` shows the Vessels too.

## Moving an immersion chiller by hand

On a Tab (not in Edit layout) an immersion chiller can sit on its own, **free floating**, and be put into a vessel later, the same
way you move a Quick Disconnect hose end ([Quick Disconnect hoses](127-quick-disconnects-and-qd-hoses)):

1. Hold the **left mouse button** on the chiller a moment (on a phone or tablet, hold it with a finger), then drag. A quick click does not move it. No pop-up asks first.
2. Let go **over a vessel**: the chiller drops into it, in its lower middle, and flashes red and yellow for 2 seconds. A yellow
   dashed outline shows the vessel while you drag over it.
3. Let go **anywhere else**: it stays there, free floating.

An immersion chiller with its own supply can be saved as one **Chiller Bundle** Equipment Template ([Build Tab](55-build-tab)).
Its hoses stay on its In and Out and follow it: a hose from its own supply (an Ice Water Can with a Sump Pump) or a Quick
Disconnect hose from a supply on the Tab (a Tap Water Valve), and its waste hose. A chiller is the same as a pipe (Rule 5.41), so
moving it does not change what flows.

- **Water flowing through it:** a warning says so and it does not move. Turn Off what feeds it (the Tap Water Valve or the sump
  pump); the warning closes by itself once nothing flows.
- **Only an immersion chiller** (2 IPs, In and Out) moves this way. A plate or counterflow chiller (4 IPs) is part of
  the manifold and stays put, and so does a chiller joined by a rigid pipe or a locked one. A vessel takes one chiller.
- A right-click that does not move the chiller opens this Help, as before.
- Viewers can't move a chiller; Operators and Admins can.

## Good to know

- Only the drawing changes. The Process goes on at once and does not wait. To wait for the brewer, add an `ask` line after
  it: `ask "Put the chiller in the kettle and hook up its hoses, then press Done"`.
- The Process Check tells you before the Process runs if the Template or the Vessel is not there, or if the vessel's Tab has
  no Tap Water Valve or no drain IP.
- The 3 Vessel sample places the Immersion chiller in the Boil kettle 15 minutes before the end of the boil and takes it off
  after chilling.
