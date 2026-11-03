# Skynet Device Templates

A **Skynet Template** is set by Skynet and can't be changed by a user (Skynet Rule 5.16). When you make a Device from one, you get
your own **User version** of it. It inherits everything from the Template. You can set only some of its attributes, and only
those show in its Properties. Which ones depends on the kind of Device.

## The Skynet Motorized Ball Valve Device

It is **one entry**, **Skynet Motorized Ball Valve**, at the top of the **Valves** list (and the **On/Off** list) on the Edit
layout bar. Pick it and the **Add Device** box asks for the Interface, the pin and the Label, the same as for any Device. It
starts Horizontal. Its **Orientation** (in its Properties) picks how it stands:

| Orientation | What it looks like |
|---|---|
| **Horizontal** | lying in a horizontal pipe |
| **Vertical Left** | standing in a vertical pipe |
| **Vertical Right** | standing, with the motor on the other side (Flip Horizontal on) |
| **Front (looking down the pipe)** | seen from the front |
| **45 degrees** | the vertical picture turned 45 degrees |

The picture and its IPs follow the Orientation: each one has its own IP spots, so turning the valve moves its IPs too.
(Under the hood each Orientation is its own Skynet Template of the same valve, Skynet Rule 5.17; you never have to pick those.)

### What is set by the Template

The picture, the Kind (valve), the Valve type, the Service (Room Temperature Liquid), the Look and what a tap does (toggle) are
fixed, so they are not in its Properties. A High Temperature valve is a different Skynet Template, even if only the Service differs.
If anything tries to change one of these, the Brain puts it back when the layout is saved.

### What you can set

- **Name, Label, Show label, Tab, X, Y, Width, Height, Lock, Visible**, and the text box settings.
- **Interface and Pin**, Invert, One-shot.
- **Orientation**: Horizontal, Vertical Left, Vertical Right, Front or 45 degrees. The picture and its IPs follow.
- **Flip Horizontal** and **Flip Vertical**: switches that mirror the picture and its IPs.
- **Tap water valve**: off by default. Switched on, **Tap water flows out of** asks which end is the tap:
  - on a vertical valve: **Tap Water Source Top** or **Tap Water Source Bottom**
  - on a horizontal or 45 degree valve: **Tap Water Source Left** or **Tap Water Source Right**

  If you change the Orientation or a Flip while Tap water is on, it goes back to **Needs setting**. Until it is set again, no tap
  water flows from it.
- **Text On/Off**: switch it on to show the On or Off text on the Tab. Only then do **Text when on** and **Text when off** show in
  its Properties.

## Turning and flipping

Rotate 90 is retired (Rule 5.5). Use the Flips for left and right, and 45 degree steps to turn. A quarter turn is two 45 steps.

## Building Templates

During the building phase an Admin makes and changes Templates on the **Build Template Tab** (coming next), with a **user can set**
box on each attribute. They are locked when Fritz says.

## The User Defined Motorized Ball Valve

Under the Skynet valves in the **Valves** list is the **User Defined Motorized Ball Valve**, for a valve Skynet has no drawing of.
It works like a Skynet valve (open / closed by its pin, Tap water, the Close all and Open all lists), but you pick its picture and
say where its pipe ends are:

- **Picture when on / off** and **Image Path 1, 2, 3** (Skynet Rule 7.10), the same as any Device.
- **In IP across % / In IP down %** and **Out IP across % / Out IP down %**: where each IP sits on the item, in % of its Width
  (0 = the left edge, 100 = the right edge) and Height (0 = the top, 100 = the bottom). For example In 0 / 50 and Out 100 / 50 put
  them at the middle of the left and right edges. Leave them blank and Skynet places them for you as before.

The IPs follow the item when you move it, size it or flip it.

## Manual Valve in the Valves list

The last row of the **Valves** list is the **Manual Valve**. It makes the same Manual Valve Widget as the **Manual Valve ➕** button
on the Edit layout bar. It is still a Widget with no pin (Skynet Rule 1.2): only a click on the Tab opens or closes it.
