# Moving something without its pipes, swapping a pump, and Put back

(Skynet Rule 5.37.)

## The pop-up when you grab something with pipes on it

In **Edit layout**, the first time you drag a Device, Widget, Fitting or Pipe that has pipes joined to it, it stays where it is and
a small pop-up asks what you want:

- **🔓 Unlock its IPs** (connection points): every pipe end on it lets go and stays where it is, with an open end. Grab it again
  and it moves **alone**; the pipes and fittings stay put. This also works when a **locked** pipe or fitting is joined to it (before,
  it could not move at all).
- **Move it with its pipes**: as before (Rule 5.19). A pipe with an open end moves along, a pipe end slides along its own line, and a
  pipe pulled off to the side lets go. Grab it again to move it.
- **🔁 Swap places with...** (pumps, valves and Manual Valves): pick another one of the same kind, on this Tab or another (the 🔨
  Build Tab too). The one you pick takes this one's **place, size, flips and pipes**, and this one goes where the other was.
- **Cancel**: nothing changes.

**Don't ask again** moves things with their pipes without asking until you leave Edit layout. On a Pipe the pop-up offers
**🔓 Unlock its ends** (the pipe lets go of what it is joined to and moves alone), **🗑 Delete Pipe** or Cancel.

## Unlock its IPs from Properties

An IP has no Properties of its own: it is part of the item it belongs to (Rule 2.9). So the **title line** of the Properties of
anything with IPs (a Device, Widget, Manual Valve, Hose Bib, fitting or vessel) has a **🔓 Unlock its IPs** button and a **↔ Move with pipes** button, and a Pipe or
Hose has **🔓 Unlock its ends**. Use it when a pipe or hose joined something you did not want, for example a hose that snapped onto a
Tee's IP:

1. In **Edit layout**, double-click the Tee (or the hose) to open its Properties.
2. Press **🔓 Unlock its IPs** (on the hose: **🔓 Unlock its ends**). Every pipe or hose end on it lets go at once and stays where it
   is, as an open end, and Properties saves and closes by itself (one click).
3. Drag the open end where you want it. **↩ Put back** (Ctrl+Z) joins it again.

Beside it, **↔ Move with pipes** is the pop-up's other choice: press it (Properties saves and closes by itself), then grab the item and it moves **with** its
pipes, without the pop-up. It is not on a Pipe or Hose, and it is grey when a 🔒 locked pipe or fitting would have to move with it.

**🔓 Unlock one IP ▾** (on a Pipe or Hose: **🔓 Unlock one end ▾**) is there when 2 or more pipe ends are joined to it. Pick one IP
in the list and only that pipe end lets go; the others stay joined. Properties saves and closes by itself, and **↩ Put back**
(Ctrl+Z) joins it again.

The buttons are grey when nothing is joined to it, when the item is 🔒 locked (unlock it first) or when the equipment on its Tab is
locked (lock_Equipment). Rest the mouse on it to see why.

## Zoom in on a join (Z)

In **Edit layout**, point at a pipe or fitting and press **Z** (not while typing in a box). A box opens over the whole work area.
It shows what you pointed at **2.5 times bigger**. When the whole manifold you pointed at (the pipes, fittings, valves and pumps
joined to it, with 50 pixels all round) fits at 2.5x, the box is centered on it; when it doesn't, on the mouse.
It stays where it opened. A click or double-click on an empty spot in the box never opens Tab settings.

**Work right in the box:** drag a pipe end, an IP or an item in it with the left mouse button, the same as on the Tab, and it
moves on the Tab too, more finely, so you can put an end exactly on an IP. Clicks and double-clicks in it work too (a
double-click opens Properties, except on a red IP).

**Move around in the box:** hold the mouse button down and go near an edge of the box: the view moves that way across the
manifold, and anything you are dragging goes along. Move away from the edge, or let go, and it stops. When the Tab is bigger than
the box, it has **scroll bars** on its right and bottom edges: drag one, or click along it to jump there. The mouse wheel scrolls
up and down, and **Shift + wheel** scrolls sideways.

Press **Esc** or the red **✕** in its upper right corner to close it.

**Join two IPs with a trace (only in the Zoom box):** double-click a red IP to start a red trace line, then click the IP to join it
to. Press **🔧 Auto configure**: the first IP moves onto the second and they join, and what is joined behind it follows so no join
breaks. Two open ends (red dots) that meet at a corner get an elbow there (a tee where three pipes meet, and so on). A straight pipe gets longer or shorter for the part of the move along its own line, and only the part across it is passed
on to what is on its other end (a tee slides along its level pipes, the pipe up to an elbow gets shorter), and so on back; a pipe with a bend
in it takes the whole move at the bend, and a hose just bends. If that would break a join, the second IP is tried onto the first instead. If neither works, nothing moves and a
message says it can't be done automatically: do it by hand, deleting or adding pipes, fittings or joins. Two IPs already
joined by a pipe, even a very short one, are already joined: flow goes through that pipe, so nothing changes. **Cancel trace** or
**Esc** takes the trace away, and ↩ Put back (Ctrl+Z) undoes an Auto configure.

## Making a pipe shorter or longer, and redrawing a hose

A pipe or hose can change after it is saved, once its ends are let go:

1. In **Edit layout**, grab the pipe or hose and pick **🔓 Unlock its ends** (or grab what it is joined to and pick **🔓 Unlock its
   IPs**).
2. Each end that let go has a small round handle. Drag it:
   - a **pipe** end slides along the pipe's own line, so the pipe gets **shorter or longer** and stays Horizontal, Vertical or 45
     (Rule 5.19). It is never shorter than 10 pixels.
   - a **hose** end goes **anywhere**, and the hose bends to follow. The round handles in the middle of a hose change its bends.
3. Drop the end on an IP (within 14 pixels) and it joins that IP. Dropped anywhere else, it stays an open end.

A let-go end can be grabbed even where it sits on a pump, valve or vessel IP. On a fitting (a tee, an elbow, any fitting) the
fitting wins: pressing on it grabs the fitting, not a coupling or let-go end lying on top of it. Grab the coupling or end off
the fitting instead. An end whose elbow, tee or Device was deleted becomes an open end at once: a small **red dot** like any open IP, which can be grabbed, joined or traced (🔗) in the Zoom box. To get rid of a red dot you don't want, press it and then the **Delete** key: the dot goes, its pipe stays, and that pipe end is left plain (no dot comes back). Two quick clicks on a red dot open its Properties, which have 🗑 Delete too (in the Zoom box a double-click starts a trace instead). An end that is still joined, a 🔒 locked pipe or hose,
and an end on a 🔒 locked IP (one set to No Unlock too) do not move. **↩ Put back** (Ctrl+Z) undoes each drag, and **Save layout**
keeps the new length or shape.

## Putting a new pump in place of an old one

The quickest way is **🔁 Swap places with...**: grab the old pump, pick the new one in the list, and the new pump is on the old
pump's pipes at once. The old pump goes where the new one was.

Or by hand: grab the old pump, pick **🔓 Unlock its IPs**, drag it away, then drag the new pump onto the same spot. A pump with no
pipes on it always has free IPs. When you drop it close to the open pipe ends (within about 30 pixels), it slides the last bit into
place, its **inlet** goes on the spot where the old pump's inlet was and its **outlet** where the old outlet was (any of its 8 IPs,
whichever side the old pump faced), and the pipes join it. Every Skynet pump has its IPs in the same spots (the Pump Standard,
Rule 5.27), so two pumps of the same size line up. A valve or Manual Valve with no pipes slides onto its open ends the same way.

## ↩ Put back (Ctrl+Z)

**↩ Put back** on the Edit layout bar (or **Ctrl+Z**) undoes the last move, resize, unlock, swap or **delete** (a Device, Widget, pipe or anything deleted from its Properties: no "Delete this item?" box asks first), so pipes and fittings go back
where they were. Press it again to go back further (up to 30 steps). Rest the mouse on it to see what it will put back. It starts
fresh each time you open Edit layout. Other changes made in a Properties dialog are not in it; **Exit** without saving still undoes
everything since the last Save layout.

**Delete key:** click an item in Edit layout and press **Delete** (or **Backspace**; on a Mac, the **delete** key) to delete it, the
same as Delete in its Properties. Ctrl+Z (Cmd+Z on a Mac) brings it back. It does nothing while you are typing in a box or a dialog is open, and a locked item stays where it is.
