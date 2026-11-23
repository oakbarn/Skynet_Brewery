# Locking items in place

A locked item can't be dragged or resized, not even in **Edit layout**. Only unlocked items move. A locked item shows a 🔒 padlock in Edit layout.

This also covers **changing a pipe's length** and **redrawing a hose** (Skynet Rule 2.12): only an unlocked pipe or hose, with its end let go and that end's IP unlocked, can be made shorter or longer or redrawn (see [Move alone, Swap, Put back](153-move-alone-swap-put-back)).

You can still open a locked item's properties (double-click it) and change it there, including its **X**, **Y**, **Width** and **Height**.

## Lock or unlock one item

1. Pick **🛠 Build (Edit layout)**.
2. Click the item.
3. Press **🔒 Lock** on the Edit layout bar. The button then says **🔓 Unlock**: press it again to unlock.
4. Press **Save layout**.

Every item's properties also have a small **Lock position** icon: 🔓 means unlocked, 🔒 means locked. Click it to switch, then Save. This includes Skynet Fittings, Skynet vessels and bundled vessels (their bundled Properties have the icon too).

Locking or unlocking a vessel does the same to its ports (IPs) and the fittings joined to it, because they move with it.

## Moving a locked vessel by X and Y

A 🔒 locked vessel can't be moved with the mouse, but you can still move it by its **X** and **Y** (Skynet Rule 2.12). This is handy for a small touch-up: moving a vessel 1 pixel left can make the screen look much better.

1. In **Edit layout**, double-click the vessel to open its Properties.
2. Type the new **X** (left and right) and **Y** (up and down). One more is 1 pixel right (or down); one less is 1 pixel left (or up).
3. Press **Save**, then **Save layout**.

The vessel's IPs, joined fittings and End Caps move with it, the same as a drag, and the vessel stays locked. A bundled vessel's Properties have X and Y too: the whole bundle moves. A straight pipe whose end is left off a moved IP lets go of it, as after a drag (see [Pipe angles](105-pipe-angles-and-upright-kettles)).

## Lock All and Unlock All

**🔒 Lock All** locks every item on the tab you are looking at: devices, widgets, pictures, text, vessels, IPs, pipes and hoses. **🔓 Unlock All** unlocks every item on that tab.

They are actions, not switches. Pressing one sets every item once, and then you are in control again:

1. Press **🔒 Lock All**. Everything on the tab is locked.
2. Click the one item you want to move and press **🔓 Unlock**.
3. Move it, then press **🔒 Lock** again if you like.
4. Press **Save layout**.

Nothing is kept until you press **Save layout**. **Exit** without saving puts every lock back the way it was.

Other tabs are not changed.

## Why won't this unlocked item move?

An unlocked item also stays put when moving it would move or bend a locked one. The message at the bottom of the screen names the locked items. This happens when:

- a **pipe or hose** joined to the item is locked (moving the item would stretch the pipe),
- a **port (IP)** or **joined fitting** of a vessel is locked,
- the **open-end coupling** of a straight pipe is locked.

Unlock those items too (click each one and press **🔓 Unlock**), or press **🔓 Unlock All**.

## No Unlock: an IP or fitting that Unlock All passes by

An IP or a pipe fitting (a Quick Disconnect, a tee, an elbow, a Manual Valve ...) can be set to **No Unlock** (Skynet Rule 2.12).
**🔓 Unlock All** then passes it by, so it stays where it is while you move everything else.

1. In **Edit layout**, double-click the IP or fitting to open its Properties.
2. Switch on **No Unlock** and press **Save**. This also locks it.
3. Press **Save layout**.

To move it later, click it and press its own **🔓 Unlock**. Unlocking a vessel doesn't unlock a port IP that is set to No Unlock
either. Switch **No Unlock** off in its Properties to make it work like every other item again.

## Locked Equipment Profile

When the tab's **Equipment Profile** is locked, its equipment, IPs and pipes can't change at all, so their padlocks can't change either. **🔒 Lock All** and **🔓 Unlock All** then skip them and say how many they skipped. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

## Phones and tablets

On a phone or tablet nothing moves in Edit layout anyway, unless the **Default** tab switch allows it. See [Phones and tablets](45-phones-and-tablets).
