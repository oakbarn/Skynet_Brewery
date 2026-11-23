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
   is, as an open end.
3. Close or Save, then drag the open end where you want it. **↩ Put back** (Ctrl+Z) joins it again.

Beside it, **↔ Move with pipes** is the pop-up's other choice: press it, close or Save, then grab the item and it moves **with** its
pipes, without the pop-up. It is not on a Pipe or Hose, and it is grey when a 🔒 locked pipe or fitting would have to move with it.

The buttons are grey when nothing is joined to it, when the item is 🔒 locked (unlock it first) or when the equipment on its Tab is
locked (lock_Equipment). Rest the mouse on it to see why.

## Making a pipe shorter or longer, and redrawing a hose

A pipe or hose can change after it is saved, once its ends are let go:

1. In **Edit layout**, grab the pipe or hose and pick **🔓 Unlock its ends** (or grab what it is joined to and pick **🔓 Unlock its
   IPs**).
2. Each end that let go has a small round handle. Drag it:
   - a **pipe** end slides along the pipe's own line, so the pipe gets **shorter or longer** and stays Horizontal, Vertical or 45
     (Rule 5.19). It is never shorter than 10 pixels.
   - a **hose** end goes **anywhere**, and the hose bends to follow. The round handles in the middle of a hose change its bends.
3. Drop the end on an IP (within 14 pixels) and it joins that IP. Dropped anywhere else, it stays an open end.

A let-go end can be grabbed even where it sits on a pump, valve or vessel IP. An end that is still joined, a 🔒 locked pipe or hose,
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

**↩ Put back** on the Edit layout bar (or **Ctrl+Z**) undoes the last move, resize, unlock or swap, so pipes and fittings go back
where they were. Press it again to go back further (up to 30 steps). Rest the mouse on it to see what it will put back. It starts
fresh each time you open Edit layout. Changes made in a Properties dialog are not in it; **Exit** without saving still undoes
everything since the last Save layout.
