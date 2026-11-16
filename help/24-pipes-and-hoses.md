# Pipes, hoses and reducers

In Skynet Brewery you can easily add interactive **Pipes**, **Hoses**, **Pumps** and **Valves**. If they are electro-mechanical (a pump or a powered valve), turning them on makes flow run from a source, through the inlet side of a pump, and out into the Pipe or Hose on its outlet side. The moving flow shows on the screen while it really runs.

## IPs only show in Edit layout

**IPs** (the round connection points on pumps, valves, vessels and plain IP widgets) only show while **Edit layout** is on. On brew day you see the pipes, hoses, fittings and pictures, not the dots. A label you set to show stays on screen.

## Pipes

1. Pick **☰ Menu > Edit layout** and press **Draw pipe**.
2. Double-click (or tap) the start, then double-click (or tap) the end. A pipe is one straight piece that runs only **Horizontal, Vertical or at 45 degrees**; it turns only at a fitting (an elbow, tee or cross), which Skynet puts where two pipes meet. See [Pipe angles and upright kettles](105-pipe-angles-and-upright-kettles).
3. Double-click the pipe to open its settings.

## Hoses

A hose is a flexible pipe: it bends in smooth curves.

1. Press **Draw hose**.
2. Click the start IP (or any spot), click a few points for the hose to curve through, then click the end IP. Double-click or press Enter to finish.
3. A hose end that is not on an IP gets a **coupling**, so a hose always has an IP at both ends. Another pipe or hose can be joined to that coupling later.

A coupling with only one hose on it is an open end: when flow reaches it, it shows flowing (like a hose pouring into a fermenter). Drag a hose's points in Edit layout to change its curve.

## Sizes

Every pipe and hose has its own **Size** in its settings. First pick **Size units**: **Inch (SAE)** or **Metric (mm)**.

| Pipe (inch) | Pipe (metric) | Hose (inch) | Hose (metric) |
|---|---|---|---|
| 1/2" (most common) | 15 mm (DN15) | 1/2" (most common) | 13 mm |
| 1" | 25 mm (DN25) | 1" | 25 mm |
| 3/4" | 20 mm (DN20) | 3/4" | 19 mm |
| 1/4" | 8 mm (DN8) | 1/4" | 6 mm |
| 2" | 50 mm (DN50) | 2" | 50 mm |
| 3" | 80 mm (DN80) | | |
| 4" | 100 mm (DN100) | | |
| 5" | 125 mm (DN125) | | |
| 6" | 150 mm (DN150) | | |

**Custom** lets you type any size in the units you picked. A new pipe or hose starts at the **Default pipe size** or **Default hose size** on ☰ Menu > Default settings (1/2" unless you change it).

Sizes are drawn in proportion: a 1" pipe is twice as thick as a 1/2" one. **Tab… > Pipe size** sets how thick a 1/2" pipe is on that tab (default 10); every other size, and the fittings, grow or shrink with it.

## IP Type

Every pipe and hose has an **IP Type at start** and an **IP Type at end**: the connector on each end (Skynet Rule 5.40). The choices are:

- **Tri-Clamp**
- **NPT**
- **BSP**
- **Quick Disconnect**

The connector is always the size of the pipe or hose, so it has no size box of its own. Tri-Clamp is not made under 1/2", so a 1/4" pipe offers only the other three.

Each end is **drawn as its IP Type**, so you can see it on the Tab: a Tri-Clamp ferrule and clamp, an NPT thread, a BSP hex nut, or a Quick Disconnect cam lock with its two arms. It is not drawn where the end sits on a fitting, a Quick Disconnect or an End Cap, which are drawn already.

A **hose** end that is **Quick Disconnect** can be unhooked and moved at any time, not only in Edit layout, the same way as a QD hose (see Help 127). Grab one end at a time; the other stays. Pipes do not move this way.

A new pipe starts with the **Default pipe IP Type**, and a new hose with the **Default hose IP Type**, on both ends. Both are on ☰ Menu > Default settings, beside the sizes. A Quick Disconnect hose is always Quick Disconnect on both ends. Changing a Default never changes a pipe or hose already made.

## Reducers

Where pipes or hoses of different sizes meet on the same IP or fitting, a **reducer** appears by itself: a cone from the bigger size down to the smaller one, in proportion to both sides. There is nothing to add or set. A fitting (tee, elbow, cross, coupling, manual valve) takes the size of the biggest pipe joined to it.

## Deleting a pipe or hose

Delete a pipe or hose from its Properties (🗑 Delete), or grab it in Edit layout: the **Move** pop-up has a red **🗑 Delete Pipe**
(or **Delete Hose**) button. Its own IPs go with it: a coupling or IP point on one of its ends is deleted too when nothing else is on
it (no other pipe, Quick Disconnect or End Cap, and not an opening on a vessel). **↩ Put back** (Ctrl+Z) brings it back.

## Shortening a pipe

Grab a pipe in Edit layout and press **🔓 Unlock its ends**: its ends let go and get a coupling. Drag that coupling (or the handle on the end) along the pipe to make it shorter or longer. It stays on its own line.

## Pipes always show

A pipe or hose always shows on its Tab, flowing or not, because it is really there.
