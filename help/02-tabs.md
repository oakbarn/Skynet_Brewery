# Tabs (your brewery screens)

A **Tab** is one screen of your brewery: a background picture with pumps, valves, temperatures, timers and pipes placed on it. The tab buttons sit at the top of the **Tabs** screen. On this screen the Menu Bar is hidden; pick **☰ Menu > Show Menu Bar** to bring it back (see [The Menu Bar](40-menu-bar)). Processes can switch every screen to a tab with `show tab "Brew Day"`.

**Zoom** and **Full screen** are in the **☰ Menu > Zoom** Menu tab. See [Zoom and Full screen](41-zoom-and-full-screen).

## Using a tab on brew day

- **Tap an output** (a pump or valve) to turn it on or off.
- **Tap a value** to get a large dialog with − / + buttons and a number pad.
- Items set to **Ask before changing** show large ON / OFF buttons first, so a bump on the screen does not start a pump.
- Pipes show **moving flow** when liquid is really moving through them.
- Alarms only make a sound after you press **Enable sound** in the Menu Bar (pick **☰ Menu > Show Menu Bar** first), once on each screen that should sound them (browsers insist on that).

## Changing the layout (admins)

Press the **red circle with the yellow hammer**, right next to **☰ Menu** on the Tabs bar (or press **☰ Menu** and pick **Edit layout**). A dashed bar appears with these buttons, and the hammer gets a yellow ring while Edit layout is on. Press the hammer again to leave Edit layout; if something changed it asks **Save** or **Exit without Saving**. Only admins see the hammer.

| Button | What it does |
|---|---|
| **Add element** | Pick from the list (outputs, inputs, probes, variables, timers, alarms...) and press it. It is made on the **Build Tab** first. |
| **Add graphic** | A picture from a media folder. |
| **Add text** | A label. |
| **Add equipment** | A vessel: electric or gas heated kettle, mash tun, cooling coil, plate chiller. It is made on the **Build Tab** first. |
| **Add IP** | A flow point or pipe fitting (see below). |
| **Draw pipe** | Click points on the tab; double-click or Enter to finish, Esc to cancel. On a phone use **Finish pipe**. |
| **Draw hose** | Like a pipe, but it bends in smooth curves. Loose ends get a coupling. See [Pipes, hoses and reducers](24-pipes-and-hoses). |
| **🔒 Lock** | Locks the selected item so it can't be dragged or resized. The button then says **🔓 Unlock**: press it to unlock. Every item's properties also have a **Lock position** switch. |
| **🔒 Lock All** | Locks every item on this tab in place in one press. It is an action, not a switch: afterwards you can unlock single items with **🔓 Unlock**. See [Locking items in place](56-locking). |
| **🔓 Unlock All** | Unlocks every item on this tab in one press. Also an action, not a switch. |
| **⚙ Tab settings** | Name, background color, background picture, size and **Pipe size** of this tab. Double-clicking an empty spot on the tab opens it too. |
| **New tab** | Adds a tab. |
| **🔨 Build Tab** / **💾 Save Build ...** | A clean Tab to build something new on, away from a busy screen. **Save Build ...** puts it on a Tab or saves it as a Template. See [Build Tab](55-build-tab). |
| **Save layout** / **Exit** | Save keeps your changes. Exit leaves Edit layout; if something changed it asks **Save** or **Exit without Saving** (**Keep editing** goes back). Picking **☰ Menu > Exit Edit layout** asks the same. Nothing is changed until you save. |

Drag unlocked items to move them (🔒 locked items stay where they are, also in Edit layout), drag a corner to resize, and **double-click** (or hold a finger on it) to open its properties.

**On a phone or tablet** nothing can be dragged or resized, so a finger can't move something by accident. Tap to pick an item, hold a finger on it for its properties (X, Y, Width and Height are there). See [Phones and tablets](45-phones-and-tablets).

## Background color and picture

Each tab has one background picture and a background color. Pick **☰ Menu > Edit layout**, then open **⚙ Tab settings** (the button, or double-click an empty spot; on a phone hold a finger on an empty spot). Step by step: [Tab background picture and color](26-tab-background).

## Timers

A timer shows hh:mm:ss with four buttons: **▶** start, **■** stop, **↺** reset to 00:00:00, and **Set**. **Set** opens a box for hours : minutes : seconds (for example 01:30:00). You can also type the whole time, like `1:30:00`, into the first box. A running timer keeps running from the new time; a countdown timer counts down from it.

> Every element can have a picture: **imagePath_1** to **imagePath_3**, and **Background picture** picks which one shows. A Process changes it with `my_widget.image = "Images/RedPump.png"`. See [Pictures on items](25-picture-paths). On/off items have a separate picture for on and for off.

## Pipes and flow

1. Put an **IP** (Initial Point) where a flow starts or ends: a pump outlet, a vessel port, a drain.
2. Press **Draw pipe**, click the start IP, click the bends, then click the end IP.
3. Pumps come with **IN** and **OUT** IPs; a valve has one IP at each end.

IPs only show while **Edit layout** is on.

The panel works out the flow itself: it starts at a running pump and follows pipes, fittings and open valves. A closed valve stops it. A pipe only shows flow when it is joined IP to IP; in Edit layout a **red ring** marks a pipe end that is not on an IP yet.

**Fittings** are IP types: straight pipe, tee, 90° and 45° elbow, cross, **manual valve** (tap it to open or close), **coupling** and **pipe cap**. Set **Turn (degrees)** to point them the right way.

Each pipe and hose has its own **Size** (1/2", 3/4", 1" ... or mm). **Pipe size** (in **⚙ Tab settings**) sets how thick a 1/2" pipe is drawn on that tab; other sizes and fittings scale from it, and a **reducer** appears where two sizes meet. See [Pipes, hoses and reducers](24-pipes-and-hoses).

## Vessels

**Add equipment** gives a drawn vessel, or your own picture with **Background picture path**. Give it a **Heater** (the element or burner output) and its heating strip or flames light up while that output is on. Drop an IP on a vessel and it becomes one of its ports: it moves with the vessel.
