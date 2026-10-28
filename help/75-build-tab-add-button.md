# Build Tab Add button

Three tools on the **Edit layout** bar make building easier (Fritz, 2026-10-27): the turn and flip buttons, grab points on every side, and the X / Y / Width / Height read-out. The **Edit layout** button itself (the hammer and pick beside **☰ Menu**) is now **navy blue**.

## The Add button

The **➕ Add** box was replaced on 2026-10-28 by the Device and Widget type lists on the Edit layout bar: **Select Device Type**, **Add Device**, and the shortcuts **Pumps**, **Valves**, **Probe**, **Heating Element** and **PWM**. See [Edit layout bar](82-edit-layout-bar).

## The Add element list (Relay module / SSR ...)

The long **Add element** list is now **Select Device Type** + **Add Device** for Devices and **Select Widget Type** + **Add Widget** for Widgets. See [Edit layout bar](82-edit-layout-bar).

## Turn and flip a fitting or vessel

Click a Skynet fitting (an elbow, tee, U ...) or a Skynet vessel in Edit layout. Six buttons show up on the Edit layout bar:

| Button | What it does |
|---|---|
| **⇆ Flip H** | Flip Horizontal: mirror left and right |
| **⇅ Flip V** | Flip Vertical: mirror top and bottom |
| **⟲ 90** | Turn 90 degrees Left |
| **⟳ 90** | Turn 90 degrees Right |
| **⟲ 45** | Turn 45 degrees Left |
| **⟳ 45** | Turn 45 degrees Right |

The picture, its IPs and the fittings joined to it all follow. For an IP fitting (the small drawn tee, elbow, cross or manual valve) only the turn buttons work, because its shape looks the same flipped. The buttons don't show for a 🔒 locked item. The same settings are still in the item's Properties (Flip Horizontal, Flip Vertical, Rotate).

## Grab points to resize

In Edit layout, click an unlocked item: it gets **eight grab points**, one on each corner and one in the middle of each side. Drag one to make the item bigger or smaller:

- a **corner** changes the width and the height,
- a **side** changes only that side,
- the opposite corner or side stays where it is.

Items you have not clicked show only the bottom right corner, so a busy Tab stays readable. This works on the Build Tab and on every other Tab. 🔒 Locked items have no grab points (unlock them first), and phones and tablets don't resize unless the switch in ☰ Menu > Default allows it.

## X, Y, Width and Height

While you move or resize something, a small navy box beside the pointer shows its **X** and **Y** (pixels from the left and top of the Tab), its **Width** and its **Height**. To type exact numbers, double-click the item and set X, Y, Width and Height in its Properties.
