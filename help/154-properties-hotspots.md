# Properties hotspots on a Vessel Device

A **Vessel Device** (a vessel built from a Vessel Widget Template, Skynet Rule 5.31) has small **⚙ hotspots** in **Edit layout**.
**One click** on a hotspot opens a Properties dialog (Skynet Rule 5.38).

| Where the ⚙ sits | What one click opens |
|---|---|
| The **top right corner** of the vessel | The **Vessel Device's own Properties** (its Name, Labels, Gallons, Interface, the Ports of its parts and so on) |
| The middle of the top edge of a built in **Heating Element** | That **Heating Element's** own Properties (its heating method, Port, and so on) |
| The middle of the top edge of a built in **Temperature Probe** or **Thermowell** | That **Temperature Probe's** own Properties |
| The middle of the top edge of a built in **Valve** | That **Valve's** own Properties |
| A **🎨** where a pipe begins at a vessel opening | A small pop-up with the vessel's **Out flow color** |

## Flow Color hotspot 🎨

Every open opening (IP) of a Vessel Device that has a pipe or hose on it, or a pipe fitting joined to it, has a small 🎨 where
the pipe begins:

- on the opening itself, when the pipe joins it there;
- at the **far end of the fitting** joined to it (an elbow, a valve fitting ...), when one is there;
- at the **outer end of a Valve built into** the opening.

One click shows a small pop-up with the vessel's **Out flow color**. Pick a color (Mash, Boil, Red, your own RGB ...) and press
**Save**: the flow that begins at this vessel takes that color, through the pump and on to wherever it goes
([Pipe and Hose Flow Colors](116-pipe-and-hose-flow-colors)). A ring round the 🎨 shows the color picked. Press **Save layout** to
keep it.

It is the **same setting** as **Out flow color** in the vessel's own Properties (double-click the vessel, or click its ⚙, and look
under Flip Horizontal). The 🎨 just puts it one click away, right where the pipe starts.

## On Overlay on built in parts

A Heating Element or Valve built into a Vessel Device shows the **On Overlay** (the red and yellow lightning bolt, Skynet Rule 7.8)
while it is on. A Heating Element is on while it is Enabled (Skynet Rule 7.9), and it still glows orange as well.

## Why hotspots

Why: the parts are built into the vessel and sit on top of it, so a double-click on the vessel often lands on a part and opens the
part instead of the vessel. The ⚙ in the corner always opens the vessel itself, and each part has its own ⚙ so it is clear which
one will open.

- **Double-click still works** the same as before (Skynet Rule 2.9): on the vessel for the vessel, on a part for that part.
- A click on a ⚙ **never moves anything**: it does not start a drag of the vessel or its pipes.
- Hold the mouse over a ⚙ to see what it will open.
- The hotspots show **only in Edit layout**, where Properties are changed. While brewing, the vessel looks as it always does.
- Phones and tablets are for running the brewery (Skynet Rule 2.35), so they do not get them.
