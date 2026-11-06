# Connect a QD hose from a Process

On Brew Day the same hose is often moved from vessel to vessel. A Process can say where the **Quick Disconnect hose** (Help 127)
goes next, and then wait until a person has really put it there (Skynet Rule 5.34; Fritz, 2026-11-06).

## The line

```
Hose_1.connect = QD_1          // onto a Quick Disconnect (the red star) on the hose's Tab
Hose_1.connect = Mash_Tun      // into the top of a Vessel Widget or a Vessel Device
Hose_1.connect = none          // take it off: the end is loose, no flow
```

- **Hose_1** is the hose's Name (Skynet names hoses Hose_1, Hose_2 ...). Its Label works too when no other item has that Label.
- After the `=` comes the **Name** of a Quick Disconnect, a plain IP, or a Vessel (Vessel Widget or Vessel Device) on the
  **same Tab** as the hose. No quotes are needed.
- A Vessel works the same as dragging the hose end into the **top third of the vessel** by hand: the whole top third is the
  vessel's QD IP, and the hose is drawn hanging over the rim and down inside it.

## What happens

1. The hose is **drawn where it goes at once**, on every screen, so you can see where it should be.
2. A pop-up says **PUT Hose_1 in the top of Mash_Tun** (or *on QD_1*), and the hose **blinks** on its Tab. If you are on another
   Tab, **Go to** takes you there.
3. The Process **waits**, the same as for a Manual valve (Rule 5.13), until an operator or admin moves the real hose and presses
   **✔ Done: the hose is on**.

If the hose is already there, nothing is asked and the Process goes straight on. **Stop** on the Process takes the pop-up away.
The Override button does not pass it: the hose has to be placed.

## Moving it by hand asks too

When a person drags the hose end (right mouse button, or a finger, Help 127), Skynet asks **"Is the real hose there now?"**.
**OK** keeps it; **Cancel** puts the end back where it was. So the screen always shows where the real hose is.

## Predictive text and Check

- Type `Hose_1.` and the list shows **connect** and **flow_Color**. After `Hose_1.connect = ` the list shows the Quick
  Disconnects first, then the Vessels, then the IPs on the hose's Tab, and **none**.
- **🔍 Check** finds a hose that is not a Quick Disconnect hose, a name that is not on the hose's Tab, a vessel with no top
  (a chiller), and `+=` or an `if` on `.connect` (it is only set, with `=`).
