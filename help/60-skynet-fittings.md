# Skynet Fittings

A **Skynet Fitting** is a Tab_Fitting made from a Skynet Fitting Template: an elbow, a tee, a U bend, a reducer, an End Cap or a valve fitting. It is one unit, like the fitting you buy:

- **Every opening has an IP built in.** The IP sits on the opening of the picture. It is two-way: liquid can flow in or out of it.
- The IPs can't be moved, set or taken off, and the fitting can't be un-bundled. Draw your pipes to the IPs.
- Its **Properties** have no IP settings at all.

Fittings you build yourself (from a User Bundled Template) work as before: you add the IPs, place them and bundle them. See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).

## Opening its Properties

In **Edit layout**, double-click the fitting (on a phone, hold a finger on it). Double-clicking one of its IPs opens the fitting's Properties too. A Skynet Fitting joined to a vessel port opens its own Properties as well, even while the vessel is bundled.

## Orientation

Point a fitting the way you need with these settings. The picture turns, and its IPs go with their openings:

- **Flip Horizontal**: left becomes right.
- **Flip Vertical**: top becomes bottom.
- **Rotate**: 45, 90, 135, 180, 225, 270 or 315 degrees clockwise. Use 45 degree steps to run a fitting on a slant.

The flip happens first, then the rotation. A fitting put on a vessel port that points up or left is flipped for you, so its far end points away from the vessel.

You can also drag the corner of a Skynet Fitting to make it bigger or smaller. Its IPs stay on the openings.

## End Caps

An **End Cap** closes an opening that is not used, for example the spare side of a tee.

1. Put an **End_Cap** on the Tab from **☰ Menu > Fitting Templates**.
2. Drag it onto the opening. It snaps over the IP.

A capped opening has no IP showing, no pipe can join it and no liquid flows there. The End Cap is bundled with what it caps: when you move the fitting or the vessel, the cap goes along. To open it again, drag the End Cap off. Deleting a fitting deletes the End Caps on it.

An IP that already has a pipe on it can't be capped.

The End Cap is drawn from the side, like a real TC cap. On an opening it turns by itself to face it: standing up on an opening that points left or right, lying down on one that points up or down, and on a slant on a 45 degree opening.

## Older Tab_Fittings

Tab_Fittings that came from a Skynet Template before this change become Skynet Fittings by themselves. A **Turn** they had is kept as their **Rotate**. If one of their IPs was dragged away from its opening, open the fitting's Properties and press **Save**: the IPs go back onto the openings.
