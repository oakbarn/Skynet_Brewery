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
- **Join a pipe partway along another pipe:** start or end the new pipe on the other pipe, away from its IPs. Skynet cuts that
  pipe in two there and puts in a tee.
- **Two loose pipe ends** that meet become one joint, so an elbow goes in (or a coupling, when they are in line).
- A pipe that only crosses another one in its middle does not join it.
- Two pipes in a straight line just join on one IP (a coupling). An open pipe end gets a coupling too.

## Adding one by hand

- **Edit layout bar > Elbows, Tees …**, under **TC Pipe Fittings**, or
- **Add Widget > TC Pipe Fittings**.

The new fitting goes on the Build Tab like every new item (Rule 4.1). Turn and flip it with the turn buttons on the Edit layout
bar (Rule 5.5), then join pipes to its IPs.

## Dropping a tee or a cross on a pipe

Drag a **Tee**, an **Instrument Tee** or a **Cross** onto a straight pipe and let go. Skynet puts it into the pipe:

- **Between the pipe's ends:** the pipe is cut in two. The tee moves across onto the pipe's line, and its two in-line ends (the
  run) each join one of the pieces. Its branch is left open, ready for the next pipe. The first piece keeps the pipe's Name and
  Flow Color; the other takes the next Pipe_N name.
- **Its run goes across the pipe?** Skynet turns it a quarter turn (or more) about its bend so the run goes along the pipe.
- **Over an open end of the pipe:** the pipe is made shorter and joins the tee.
- Nothing is cut when the tee is still joined to other pipes, is Locked, the pipe is a hose, or the pipe is shorter than the
  tee, or its end there is already joined to something. A message at the bottom of the screen says what was done (or why not).

Press **Save layout** to keep it, or **Exit** without saving to put everything back.

## Fittings with a Temperature Probe

A tee with a Temperature Probe in it is **not** a TC Pipe Fitting. It is a **Temperature Device** (subtype Probe Tee), because it
has a probe that is wired to a PLC (Rule 5.20). Add it from the Temperature Devices list.

## Older Schemas

An elbow, tee or cross made before TC Pipe Fittings (a plain IP fitting) becomes its TC Pipe Fitting the first time its Tab is
shown in Edit layout (Rule 15.2). Save layout keeps it.
