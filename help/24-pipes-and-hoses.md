# Pipes, hoses and reducers

In Skynet Brewery you can easily add interactive **Pipes**, **Hoses**, **Pumps** and **Valves**. If they are electro-mechanical (a pump or a powered valve), turning them on makes flow run from a source, through the inlet side of a pump, and out into the Pipe or Hose on its outlet side. The moving flow shows on the screen while it really runs.

## IPs only show in Edit layout

**IPs** (the round connection points on pumps, valves, vessels and plain IP widgets) only show while **Edit layout** is ticked. On brew day you see the pipes, hoses, fittings and pictures, not the dots. A label you set to show stays on screen.

## Pipes

1. Tick **Edit layout** and press **Draw pipe**.
2. Click the start IP, click the bends, then click the end IP. Pipes go straight and turn square corners (hold **Shift** for any angle).
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

**Custom** lets you type any size in the units you picked. A new pipe or hose starts at 1/2".

Sizes are drawn in proportion: a 1" pipe is twice as thick as a 1/2" one. **Tab… > Pipe size** sets how thick a 1/2" pipe is on that tab (default 10); every other size, and the fittings, grow or shrink with it.

## Reducers

Where pipes or hoses of different sizes meet on the same IP or fitting, a **reducer** appears by itself: a cone from the bigger size down to the smaller one, in proportion to both sides. There is nothing to add or set. A fitting (tee, elbow, cross, coupling, manual valve) takes the size of the biggest pipe joined to it.

## Showing only the flow

If the tab's background picture already shows your piping, switch off **Show when nothing flows** on that pipe or hose. Then only the moving flow appears on top of the picture.
