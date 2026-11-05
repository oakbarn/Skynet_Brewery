# Quick Disconnects and QD hoses

Many home brewers have a valve manifold and move one hose from source to source on Brew Day. Skynet does the same with a
**Quick Disconnect Widget** and a **Quick Disconnect hose** (QD hose) (Skynet Rule 5.28).

## The Quick Disconnect Widget

A Quick Disconnect sits on an **IP**, most often the IP on one end of a valve. It is drawn as Fritz's **bold red star with a
grey center** so it is easy to see on a Tab, never smaller than 40 pixels.

1. In **Edit layout**, open **Elbows, Tees …** (or **Add Widget**) and pick **Quick Disconnect** under *IPs, couplings and caps*.
   Like every new Widget it is made on the 🔨 Build Tab first (Rule 4.1); send it to its Tab.
2. Drag it onto the IP of a valve (or any other IP). Within about 30 pixels it **snaps onto the IP** and a message says so.
   From then on it stays on that IP: when the valve moves, the Quick Disconnect goes with it.
3. Drag it off again to take it off the IP.

With a hose on it, the Quick Disconnect passes flow to the IP it sits on, so the flow runs on through the valve when the
valve is open. With nothing on it, it is shut: no flow shows there.

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

- **Computer:** hold the **right mouse button** on the ring and drag (Rule 2.9: the right button drags).
- **Phone or tablet:** hold a **finger** on the ring and drag.

While you drag, a **green ring** shows where the end will go. Let go on:

- **a Quick Disconnect** (within 25 pixels, a bigger snap so it is easy to hit) **or an IP** (within the normal 10 pixel snap):
  the hose joins it. A Quick Disconnect wins over the valve IP under it, and over a plain IP that is closer.
- **anywhere in the top third of a vessel**: the whole top third is one big IP. It is the same as putting the hose in the
  top of the vessel. The hose is then drawn going up over the vessel's rim and hanging down inside it.
- **anywhere else**: the end is loose and no flow shows in the hose.

A message says where the end went. Every screen sees the move at once and it is kept (no Save layout needed).
Operators and admins can move it; a viewer can't. A **locked** hose (🔒) does not move.

## Flow and Flow Colors

Flow runs through the hose the same way as through any hose (Rule 5.10, Rule 5.21): from a running pump, through open valves.
A hose in the top of a vessel is a place where flow ends or begins, like a vessel port. Pump from a vessel with an **Out flow
color** and the hose takes that color. The order of Flow Colors is the same as for every pipe and hose (Rule 5.21).
