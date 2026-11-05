# Pipe Widgets from Fritz's drawings

Fritz, 2026-11-02: new Skynet drawings of the TC pipe fittings, the Manual Ball Valve and two motorized valves. They are drawn as SVG (Rule 7.1). Flow goes either way through all of them; none of them has a flow direction (a check valve is still the only one-way fitting).

## Where the IPs are

The rule for every Device and Widget (Rule 5.20):

- **On a TC pipe Widget** (elbows, tees, reducers ...) and on a valve with ferrules, each IP is at the **center of the ferrule's outer face**: the flat end where the clamp goes. Every open end has its own IP.
- **On a front view** (you are looking down the pipe), the IP is at the **center of the opening**. A straight item seen from the front has both of its IPs there: one for the pipe coming toward you, one for the pipe going away.

## Pipe Widgets

These are Skynet pipe fitting Templates. Like every pipe fitting they have only X, Y, Width, Height and **Autosize to pipe** ([Pipe fittings and Manual Valves](87-pipe-fittings-and-manual-valves)). Turn and flip them with the turn buttons on the Edit layout bar.

| Template | Picture | IPs |
|---|---|---|
| **Elbow_90** | 90 degree elbow | bottom and right ferrules |
| **Elbow_45** | 45 degree elbow | bottom left (at 45 degrees) and right ferrules |
| **Elbow_Front** | 90 degree elbow seen from the front: one end faces you, one goes down | center of the front opening, bottom ferrule |
| **Tee** (Long Tee) | tee with a long branch | left, right and the branch (bottom) |
| **Instrument_Tee** | tee with a short branch | left, right and the branch (bottom) |
| **Reducer_2_1_Concentric** | TC 2 to TC 1, both ends on one center line | big end (left), small end (right) |
| **Reducer_2_1_Eccentric** | TC 2 to TC 1, flat along the bottom so it drains | big end (left), small end (right, low) |
| **Reducer_2_1_Front** | a TC 2 to TC 1 reducer seen from the front | both at the center of the opening |
| **Reducer** | TC 2 to TC 1.5, drawn like the concentric one | big end (left), small end (right) |

Each fitting is drawn to Fritz's shape: a Long Tee is wider than it is tall. **Autosize to pipe** keeps that shape and makes the pipe on the picture as thick as the biggest pipe joined to it.

A Skynet pipe fitting already on a Tab takes its new picture the next time you open **Edit layout**, and its IPs move onto the new ferrules. **Save layout** keeps the change. A pipe on it follows its IP; check that it still runs straight.

## Manual Ball Valve pictures

The **Manual Valve Widget** is the same special Widget as before: its Open/Closed (.state) only changes when someone clicks it on its Tab, and a running Process waits for that click. Its Properties now have a **Picture**:

- **Plain**: the drawn valve, as before.
- **Manual Ball Valve, side view**: the pipe runs across the middle.
- **Manual Ball Valve, front view**: looking down the pipe.

The picture stays the same open or closed; while open the **open overlay** (a green ring and a tick) is drawn on top (Fritz, 2026-11-05: the Open pictures are retired).
- **Manual Ball Valve on a front elbow**: the same, with the elbow's leg going down.

The Tab swaps between the open and the closed picture by itself, and the green open overlay still shows while it is open. A Manual Valve has one IP, in the middle of its picture.

## Tees with a Temperature Probe

A tee with a Temperature Probe in it is a **Temperature Device**, not a pipe Widget. Add one with **Probe** on the Edit layout bar (or Select Device Type > Probe):

- **Instrument Tee** or **Long Tee**, **probe in the branch**: the probe (purple) fills the branch, so its IPs are the **left and right** ferrules.
- **Instrument Tee** or **Long Tee**, **probe in from the end**: the probe fills the left end, so its IPs are the **right ferrule and the branch**.

As with a Thermowell, you pick the type of probe in it (DS18B20, PT100 ...), then the Interface and its Port. Its Properties have **Flip Horizontal** and **Flip Vertical**, and the picture and its IPs follow. Flow passes through it either way.

## Motorized valve Devices

Two valves, one entry each in **Valves** on the Edit layout bar. Its **Orientation** (in its Properties) picks how it stands,
and the picture and its IPs follow.

| Valve | Orientations |
|---|---|
| **Skynet Motorized Butterfly Valve** | Fritz's grey actuator on a butterfly valve: Horizontal, Vertical Left, Vertical Right, 45 degrees, **Front** (looking down the pipe: both IPs at the center of the opening; the disc edge on means open, the disc facing you means closed) and **Front Elbow** (one IP at the center of the front opening, one at the bottom ferrule) |
| **Skynet Motorized Ball Valve** | drawn after Fritz's blue actuator: Horizontal, Vertical Left, Vertical Right, 45 degrees and **Front** (both IPs at the center of the opening) |

As before, a closed valve shows a ring on its body and an open one a bar and red bolts. A Front view has no Flip to set.
