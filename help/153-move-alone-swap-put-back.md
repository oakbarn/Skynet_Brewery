# Moving something without its pipes, swapping a pump, and Put back

(Skynet Rule 5.37; Fritz, 2026-11-07: "when we grab a Device or Widget, maybe a Pop up to Unlock IPs so it moves independently of
its pipes".)

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
**🔓 Unlock its ends** (the pipe lets go of what it is joined to and moves alone) or Cancel.

## Putting a new pump in place of an old one

The quickest way is **🔁 Swap places with...**: grab the old pump, pick the new one in the list, and the new pump is on the old
pump's pipes at once. The old pump goes where the new one was.

Or by hand: grab the old pump, pick **🔓 Unlock its IPs**, drag it away, then drag the new pump onto the same spot. When you drop
it, each open pipe end that was on the old pump's **inlet** joins the new pump's inlet, and the **outlet** its outlet (the same end,
within 14 pixels of where the old IP was). Every Skynet pump has its IPs in the same spots (the Pump Standard, Rule 5.27), so two
pumps of the same size and place line up.

## ↩ Put back (Ctrl+Z)

**↩ Put back** on the Edit layout bar (or **Ctrl+Z**) undoes the last move, resize, unlock or swap, so pipes and fittings go back
where they were. Press it again to go back further (up to 30 steps). Rest the mouse on it to see what it will put back. It starts
fresh each time you open Edit layout. Changes made in a Properties dialog are not in it; **Exit** without saving still undoes
everything since the last Save layout.

## Checked with the BruControl Import

The BruControl Import makes Schemas and does not move things on a Tab, so it is not changed. Schemas it makes get the pop-up,
Swap and Put back in the Panel like any other.
