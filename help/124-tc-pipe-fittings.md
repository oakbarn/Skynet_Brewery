# TC Pipe Fittings

**TC Pipe Fittings** is a kind (subclass) of Widget: every elbow, tee and cross on a Tab (Skynet Rule 5.25). Each one is a Skynet
drawing with an **IP on the outer face of every ferrule** (the flat end the clamp goes on, Rule 5.20), and it takes the size of
the pipes joined to it (**Autosize to pipe**). A TC Pipe Fitting has no flow direction (Rule 5.20) and no Clone (Rule 5.14).

| TC Pipe Fitting | Its open ends |
| --- | --- |
| Elbow 90 | 2 (one down, one to the right, before it is turned) |
| Elbow 45 | 2 (one to the right, one down and to the left at 45 degrees) |
| Tee (the normal, long tee) | 3 (left, right and the branch) |
| Instrument Tee (a short branch) | 3 |
| Cross | 4 |
| U Bend, Reducers, Check Valve, End Cap, Front views | as drawn |

## Skynet puts them in for you

Pipes run only Horizontal, Vertical or at 45 degrees (Rule 5.19). Where you join two pipes at a corner, or three or four pipes at
one point, Skynet puts in the TC Pipe Fitting that the pipes need, turned the right way. Its bend sits where the pipes met, and
each pipe ends on one of its IPs.

- **Make a tee from an elbow:** draw a new pipe starting (or ending) on the **bend** of the elbow, where the two pipes' center
  lines meet. The elbow becomes a tee. Do the same on a tee to make it a cross.
- Two pipes in a straight line just join on one IP (a coupling). An open pipe end gets a coupling too.

## Adding one by hand

- **Edit layout bar > Elbows, Tees …**, under **TC Pipe Fittings**, or
- **Add Widget > TC Pipe Fittings**.

The new fitting goes on the Build Tab like every new item (Rule 4.1). Turn and flip it with the turn buttons on the Edit layout
bar (Rule 5.5), then join pipes to its IPs.

## Fittings with a Temperature Probe

A tee with a Temperature Probe in it is **not** a TC Pipe Fitting. It is a **Temperature Device** (subtype Probe Tee), because it
has a probe that is wired to a PLC (Rule 5.20). Add it from the Temperature Devices list.

## Older Schemas

An elbow, tee or cross made before TC Pipe Fittings (a plain IP fitting) becomes its TC Pipe Fitting the first time its Tab is
shown in Edit layout (Rule 15.2). Save layout keeps it.
