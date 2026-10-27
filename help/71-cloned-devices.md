# Cloned Devices

In BruControl a Device could sit on only one worksheet, so showing the same pump on two screens took extra code and globals. In Skynet a Device can be shown on more than one Tab with a **Clone**.

A Clone is **the same Device**, not a copy. It shows what its parent (the Device it was cloned from) shows, and anything done to the Clone is done to the parent. Turn a pump Clone on and the pump turns on, on every Tab. Turn the parent off and every Clone shows it off.

## Make a Clone

There are two ways. Both are in **Edit layout** (Admins).

1. **⧉ Clone Device** on the Edit layout bar. Go to the Tab the Clone should be on and press **⧉ Clone Device**. The list holds only Devices already placed on a Tab (not the Build Tab, and not the ones already on this Tab). Pick one and press **Save**. The Clone appears on this Tab; drag it into place.
2. **Give a Device another Tab.** In a Device's Properties, pick another **Tab** for a Device that is already on a Tab. A box asks *"Make a Clone of it on that Tab?"*
   - **Yes, make a Clone**: the Device stays where it is and a Clone goes on the other Tab, at the same spot. That Tab is shown.
   - **No**: back to the Device's Properties.
   - **Move it**: the Device itself moves to the other Tab (no Clone).

## The Clone's name

Skynet makes the name, and it can't be typed over: the parent's name without its Tab ID, then `_C1` (or `_C2` ...), then the Tab ID of the Clone's Tab.

`MB_06_Pump_Wort__HS` cloned onto the Tab `CE` is `MB_06_Pump_Wort_C1__CE`.

If the parent is renamed, its Clones follow, and Processes that use a Clone's name are changed too when you Save.

## A Clone's Properties

Double-click a Clone in Edit layout. Only these are its own:

- **Visible**: off hides the Clone on its Tab only. The parent and other Clones keep showing.
- **X** and **Y**: where it sits on its Tab.
- **Lock position**, like any other item.

Everything else (pictures, look, size, Interface, port, value, on and off) belongs to the parent. Change it in the parent's Properties and every Clone follows. In Edit layout a Clone has a dashed outline and a ⧉ mark; it can be dragged but not resized (its size is its parent's).

A pump or valve Clone has its own IPs, so pipes on its Tab can be drawn to it. Flow on that Tab follows the pump or valve, the same as the parent.

## Clones in a Process

A Clone's name works in a Process like the parent's name:

```
MB_06_Pump_Wort_C1__CE = true        // turns the pump on (the parent and every Clone show ON)
MB_06_Pump_Wort_C1__CE.visible = false   // hides only this Clone
MB_06_Pump_Wort_C1__CE.x = 400       // moves only this Clone (.xPosition works too)
MB_06_Pump_Wort_C1__CE.y = 120       // .yPosition works too
```

`.visible`, `.hidden`, `.x` and `.y` belong to the Clone. Every other attribute is the parent's.

## Deleting

- Deleting a Clone deletes only the Clone.
- Deleting the parent Device deletes its Clones too (the box names them first).
- Deleting a Tab deletes the Clones on it, and the Clones of Devices that were on it.
