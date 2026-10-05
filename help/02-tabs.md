# Tabs (your brewery screens)

A **Tab** is one screen of your brewery: a background picture with pumps, valves, temperatures, timers and pipes placed on it. The tab buttons sit at the top of the **Tabs** screen. Processes can switch every screen to a tab with `show tab "Brew Day"`.

**Zoom** sets the size: **Fit** fills the width of your screen; 50 % to 125 % are fixed sizes.

## Using a tab on brew day

- **Tap an output** (a pump or valve) to turn it on or off.
- **Tap a value** to get a large dialog with − / + buttons and a number pad.
- Items set to **Ask before changing** show large ON / OFF buttons first, so a bump on the screen does not start a pump.
- Pipes show **moving flow** when liquid is really moving through them.
- Alarms only make a sound after you press **Enable sound** at the top, once on each screen that should sound them (browsers insist on that).

## Changing the layout (admins)

Tick **Edit layout**. A dashed bar appears with these buttons:

| Button | What it does |
|---|---|
| **Add element** | Pick from the list (outputs, inputs, probes, variables, timers, alarms...) and press it. |
| **Add graphic** | A picture from a media folder. |
| **Add text** | A label. |
| **Add equipment** | A vessel: electric or gas heated kettle, mash tun, cooling coil, plate chiller. |
| **Add IP** | A flow point or pipe fitting (see below). |
| **Draw pipe** | Click points on the tab; double-click or Enter to finish, Esc to cancel. On a phone use **Finish pipe**. |
| **Draw hose** | Like a pipe, but it bends in smooth curves. Loose ends get a coupling. See [Pipes, hoses and reducers](24-pipes-and-hoses). |
| **🔒 Lock** | Locks the selected item so it can't be dragged or resized. Press again to unlock. |
| **⚙ Tab settings** | Name, background color, background picture, size and **Pipe size** of this tab. Double-clicking an empty spot on the tab opens it too. |
| **New tab** | Adds a tab. |
| **Save layout** / **Exit** | Save keeps your changes. Exit leaves Edit layout; if something changed it asks **Save** or **Exit without Saving** (**Keep editing** goes back). Unticking **Edit layout** asks the same. Nothing is changed until you save. |

Drag items to move them, drag a corner to resize, and **double-click** (or hold a finger on it) to open its properties.

## Background color and picture

Each tab has its own background color and picture.

1. Tick **Edit layout**.
2. Open **⚙ Tab settings**: press the button in the dashed bar, **double-click an empty spot** on the tab, or double-click the tab's name. On a phone, **hold a finger on an empty spot**.
3. Under **Background**:
   - **Background color**: **Default** (the panel's normal color), **None** (no color), a color by name (the swatch shows it), or **Custom (add new) ...** for any color.
   - **Background picture**: one picture path per tab. Pick a picture from your media folders (the panel's `media` folder and its `Images` folder are listed). A preview shows under the list. **Add new ...** takes any picture path, for example one in another media folder. Put new pictures in with the **Media** page first.
4. Leave **Picture left / top / width / height** empty to stretch the picture over the whole tab. Fill them in to place the picture at a spot and size; the background color shows around it.
5. Press **Save**, then **Save layout**.

To remove the picture pick **(none)**. The color shows wherever the picture does not cover (or everywhere when there is no picture).

## Timers

A timer shows hh:mm:ss with four buttons: **▶** start, **■** stop, **↺** reset to 00:00:00, and **Set**. **Set** opens a box for hours : minutes : seconds (for example 01:30:00). You can also type the whole time, like `1:30:00`, into the first box. A running timer keeps running from the new time; a countdown timer counts down from it.

> Every element can have a background picture. On/off items have a separate picture for on and for off.

## Pipes and flow

1. Put an **IP** (Initial Point) where a flow starts or ends: a pump outlet, a vessel port, a drain.
2. Press **Draw pipe**, click the start IP, click the bends, then click the end IP.
3. Pumps come with **IN** and **OUT** IPs; a valve has one IP at each end.

IPs only show while **Edit layout** is ticked.

The panel works out the flow itself: it starts at a running pump and follows pipes, fittings and open valves. A closed valve stops it. A pipe only shows flow when it is joined IP to IP; in Edit layout a **red ring** marks a pipe end that is not on an IP yet.

**Fittings** are IP types: straight pipe, tee, 90° and 45° elbow, cross, **manual valve** (tap it to open or close), **coupling** and **pipe cap**. Set **Turn (degrees)** to point them the right way.

Each pipe and hose has its own **Size** (1/2", 3/4", 1" ... or mm). **Pipe size** (in **⚙ Tab settings**) sets how thick a 1/2" pipe is drawn on that tab; other sizes and fittings scale from it, and a **reducer** appears where two sizes meet. See [Pipes, hoses and reducers](24-pipes-and-hoses).

## Vessels

**Add equipment** gives a drawn vessel, or your own picture with **Background picture path**. Give it a **Heater** (the element or burner output) and its heating strip or flames light up while that output is on. Drop an IP on a vessel and it becomes one of its ports: it moves with the vessel.
