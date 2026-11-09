# Build a Vessel Device step by step

The **Vessel Device Builder** asks what your vessel has, then builds it for you as a **Vessel Device** (Skynet Rules 19.5 and 5.31).
Its Heating Elements and its Temperature probe are **built into it**, like the RIMS tube's, so they can't be lost or deleted on
their own. The BruControl Import program will ask the same questions, with the same look.

## Where to find it

In **Edit layout**, open **Vessel** on the Edit layout bar and pick **🔨 Build a Vessel Device (step by step)**. It is also under
**Add Widget > Vessels**.

## 1. The questions

| Question | Choices |
| --- | --- |
| Label | for example HLT (it can't be blank) |
| General Type | HLT, Mash Tun, Brew Kettle, All In One, Whirlpool, Fermentor, Bright Tank. **Other** asks you to type one, and it is kept in the list as **USER: Hop Pot Strainer**. |
| Tab | the Tab it goes on when the Build is saved |
| Units, Volume | Gallons (Liters when Metric). It starts at 10. |
| Height, Diameter | type both for its shape, or leave both empty for the plain vessel shape |
| Bottom Drain | None, Center Low, Center Bottom Drain, Pick |
| Tangential Inlet | None, Left, Right, Pick |
| Sparge Arm / Steam Slayer | None, Right (High), Left (High), Pick |
| Thermowell / Probe | None, Center, Left, Right, Back Left, Back Center, Back Right, Pick |
| Heating Element | None, Left, Right, Back Left, Back Center, Back Right, Pick (a second one can be added) |
| HERMS Coil | None, Left, Right, Outlet Right & Inlet Left, Outlet Left & Inlet Right (a crossed coil, drawn across the vessel). No Pick. |

A Thermowell, Probe or Heating Element has **no IP of its own**. On an opening it closes it, like an End Cap. Two of them can't go
on the same spot. Press **🔨 Build**.

### Pick (double-click the spot)

When your vessel has a part where none of the choices are, pick **Pick (double-click the spot on the vessel)**. A blank vessel
opens with small dots on the usual spots (preset IPs). **Double-click** where the part is on your vessel:

- Near a small dot, it takes that usual spot.
- Anywhere else, it makes a new opening (a **User IP**) on this one vessel, for example **Picked Drain**.

**↶ Undo** takes the mark off, **💾 Save** keeps it, **✖ Cancel** leaves the question as it was. Pick works **only while you first
build the vessel**. Once it is built and saved, no opening can be added or moved.

## 2. Finish it on the Build Tab

The vessel is on the left of the **🔨 Build Tab**, showing its Heating Element, Thermowell and HERMS coil, and the openings of its
Drain, Tangential Inlet, Sparge Arm or Steam Slayer and HERMS coil. Every opening you didn't pick is hidden.

The **Vessel Builder** panel is on the right. It has a line for each thing you still need to pick:

- **Heating Element** or **Thermowell / Probe**: click the line (or the small hot spot on its faint picture) and pick an
  existing one from the list, or **➕ Add new …**, which opens the usual Add dialog. The one you pick is built into the vessel
  and keeps its name and Port. Its readout goes on the vessel, like the HLT's on the Three Vessel sample.
  One already built into a vessel (the Three Vessel sample's Probes and Heating Elements too) is not listed: it stays in its own
  vessel, so the sample is never changed by what you build.
- **Drain, Tangential Inlet, Sparge Arm**: click its line and pick **up to 3 pieces**, from the vessel out: **None, Valve,
  Elbow, Tee** or **Priming Tee** (only on the Drain). None ends the list, so the pieces after it are greyed out. An Elbow turns
  the run. The Priming Tee (an Instrument Tee with a Manual Valve on its short side) always points up, so it only goes where the
  run is level: on a Drain, put an Elbow before it. Each piece is joined to the one before by a short pipe.
- **Which Valve:** a Motorized valve you already have (one not on a pipe yet), **➕ Add New Motorized Ball Valve** (the usual Add
  dialogs), or **➕ Add Manual Valve Widget**: Plain, Manual Ball Valve (side view) or Manual Butterfly Valve. A Manual Valve is
  turned to fit an up and down run, and you confirm it by hand (Confirmation Widget).
- The **Sparge Arm** is drawn inside the vessel, from its opening toward the other side. The **Steam Slayer** comes in the next
  update.

Double-click a part's picture on the vessel to open its own Properties (a faint one opens its picker). The vessel's Properties
show a section for each Heating Element and the Thermowell / Probe (Help: Vessel Widget).

Press **✔ Done** to close the panel. Then press **💾 Save Build ... > To a Tab** to put the vessel on its Tab.

**Once it is on a Tab and the layout is saved, its openings and built in parts are locked for good.** Its Name, Labels, Volume,
Tab and place can still change.
