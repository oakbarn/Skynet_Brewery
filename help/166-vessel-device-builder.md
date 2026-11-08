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
| Bottom Drain | None, Center Low, Center Bottom Drain |
| Tangential Inlet | None, Left, Right |
| Sparge Arm / Steam Slayer | None, Right (High), Left (High) |
| Thermowell / Probe | None, Center, Left, Right, Back Left, Back Right |
| Heating Element | None, Left, Right, Back Left, Back Right (a second one can be added) |
| HERMS Coil | None, Left, Right |

A Thermowell, Probe or Heating Element has **no IP of its own**. On an opening it closes it, like an End Cap. Two of them can't go
on the same spot. Press **🔨 Build**.

## 2. Finish it on the Build Tab

The vessel is on the left of the **🔨 Build Tab**, showing its Heating Element, Thermowell and HERMS coil, and the openings of its
Drain, Tangential Inlet, Sparge Arm or Steam Slayer and HERMS coil. Every opening you didn't pick is hidden.

The **Vessel Builder** panel is on the right. It has a line for each thing you still need to pick:

- **Heating Element** or **Thermowell / Probe**: click the line (or the small hot spot on its faint picture) and pick an
  existing one from the list, or **➕ Add new …**, which opens the usual Add dialog. The one you pick is built into the vessel
  and keeps its name and Port. Its readout goes on the vessel, like the HLT's on the Three Vessel sample.
- **Drain, Tangential Inlet, Sparge Arm / Steam Slayer**: their valves and pieces come in the next update.

Press **✔ Done** to close the panel. Then press **💾 Save Build ... > To a Tab** to put the vessel on its Tab.

**Once it is on a Tab and the layout is saved, its openings and built in parts are locked for good.** Its Name, Labels, Volume,
Tab and place can still change.
