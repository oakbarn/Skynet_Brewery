# Quick Disconnects and QD hoses

Many home brewers have a valve manifold and move one hose from source to source on Brew Day. Skynet does the same with a
**Quick Disconnect Widget** and a **Quick Disconnect hose** (QD hose) (Skynet Rule 5.28).

## The Quick Disconnect Widget

A Quick Disconnect sits on an **IP**, most often the IP on one end of a valve. It is drawn as a **bold red star with a
grey center** so it is easy to see on a Tab, never smaller than 40 pixels.

1. In **Edit layout**, open **Elbows, Tees …** (or **Add Widget**) and pick **Quick Disconnect** under *IPs, couplings and caps*.
   Like every new Widget it is made on the 🔨 Build Tab first (Rule 4.1); send it to its Tab.
2. Drag it onto the IP of a valve (or any other IP). Within about 30 pixels it **snaps onto the IP** and a message says so.
   From then on it stays on that IP: when the valve moves, the Quick Disconnect goes with it.
3. Drag it off again to take it off the IP.

With a hose on it, the Quick Disconnect passes flow to the IP it sits on, so the flow runs on through the valve when the
valve is open. **With nothing on it, it is open**, like a real Quick Disconnect: water that is pushed into it sprays out of it, with
the water splash. A hose on it whose other end is loose sprays out of that end.

## The Quick Disconnect hose

1. In **Edit layout**, press **Draw QD hose** (row 2 of the Edit layout bar, beside Draw hose).
2. Click the **pump IP** the hose hangs from (its inlet or outlet). This end stays put.
3. Click a few points for the hose to bend through, then click where its other end goes: an IP, a Quick Disconnect, or
   the **top third of a vessel**. Double-click (or Enter) to leave the end loose.
4. **Save layout.**

The Properties title reads **Quick Disconnect Hose**. Its size, color, Label and Flow Color are set like any hose.

## Moving the hose end on Brew Day

The free end of a QD hose can be moved **at any time**, not only in Edit layout. Its end shows as a yellow dashed ring,
always on top of everything on the Tab.

- **Computer:** hold the **left mouse button** on the ring a moment (less than half a second), then drag. A quick click does not move it. The right button only opens Help.
- **Phone or tablet:** hold a **finger** on the ring and drag.
- **Left click:** it does not move the end. After a moment a small pop-up with the red ⛔ says **Hold the left button a moment, then drag**. It goes by itself after 3 seconds, or at your next click.
- **Double-click** the ring: the hose's **Properties** open (admins only; Edit layout opens with them). A double-click on an **IP** opens the Properties of the Device or Widget it belongs to.

Any hose end whose **IP Type** is **Quick Disconnect** moves the same way (Help 24), one end at a time.

That is all it takes: hold the ring and drag. Nothing pops up first.

**Safety:** if a pump on the hose is On (or liquid is flowing in it), a warning pops up instead and the end does not move. It says to turn the pump Off first, so the hose does not spray. It keeps checking, and closes by itself once nothing flows; then hold the ring again. **✖ Exit** closes it at any time.

While you drag, the hose **flexes**: it leaves the pump the way it did before and hangs in a curve through several bend points, sagging more the farther you pull the end. A **green ring** shows where the end will go. Let go on:

- **an IP or a Quick Disconnect**: the hose joins it. On the open end of a pipe, the hose goes in the way that end faces, as a
  real hose does: on an end that faces down, it droops below it and makes a **U** up into it. A Quick Disconnect wins over the valve IP under it. On the open end of a pipe,
  flow goes on from the hose into that pipe.
- **anywhere in the top third of a vessel**: the whole top third is one big IP. It is the same as putting the hose in the
  top of the vessel, and the hose end goes to the middle of the vessel's top.
- **anywhere else**: the end is loose, hanging in the air. If something pushes water into the hose (a Tap Water Valve that is On,
  or a running pump), it pours out of the open end, so the hose shows flow and a
  water splash in the color of the flow. An end left inside a Tee or Elbow, or very close to an IP, is in it: water goes on
  through it and there is no splash. An end lying on a pipe or a widget gets no splash either.

When the water has nowhere to go (every way ends at a closed valve), the hose and the pipes up to those valves are full but not
moving: their dashes show and **stand still**. Once a valve opens, they move.

When you let go, the end **stays where it is**: joined to the IP, Quick Disconnect or vessel top under it, or hanging loose.
Nothing is asked. When it locks onto an IP, a Quick Disconnect or a vessel top, its ring **flashes red and yellow for 2
seconds**; left in the air, the ring just stays yellow. To put it back, drag it back. A Process can move the hose too, with `Hose_1.connect = QD_1` (Help: *Connect a QD hose from a Process*).

A message says where the end went. Every screen sees the move at once and it is kept (no Save layout needed).
Operators and admins can move it; a viewer can't. A **locked** hose (🔒) does not move.

## Flow and Flow Colors

Flow runs through the hose the same way as through any hose (Rule 5.10, Rule 5.21): from a running pump, through open valves.
A hose in the top of a vessel is a place where flow ends or begins, like a vessel port. Pump from a vessel with an **Out flow
color** and the hose takes that color. The order of Flow Colors is the same as for every pipe and hose (Rule 5.21).
