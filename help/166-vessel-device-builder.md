# Build a Vessel Device step by step

The **Vessel Device Builder** asks a few plain questions, one page at a time, and then builds the vessel for you as a **Vessel
Device** (Skynet Rules 19.5 and 5.31). Its Heating Elements, its Temperature probe and a Motorized Ball Valve are **built into it**,
like the RIMS tube's, so they can't be lost or deleted on their own.

## Where to find it

In **Edit layout**, open **Vessel** on the Edit layout bar and pick **🔨 Build a Vessel Device (step by step)**. It is also under
**Add Widget > Vessels**.

Each page has **◀ Back** and **Next ▶** at the top and **Next ▶** at the bottom. Back keeps what you typed. If something is missing,
Next tells you what, in plain words, and stays on the page. **Cancel** stops; nothing is built.

## The pages

1. **Name.** The Label (for example HLT; it can't be blank), what the vessel is (HLT, Mash Tun, Brew Kettle, All In One,
   Fermenter, Other), the **Tab** it goes on, and the **Interface** (board) its built in parts are wired to. If the board is not
   there yet, pick **➕ Add new Interface…**.
2. **Size.** Units (US or Metric), **Gallons** (Liters) and the shape: **Proportional** (the plain vessel shape) or **Diameter**
   (type its Diameter and Height). It starts at 10 gallons. See *Vessel sizing by gallons*.
3. **Outlet.** None, **Center Outlet** (low on the side) or **Center Bottom Outlet** (a bottom drain), and the valve on it:
   - **Motorized Ball Valve:** built into the outlet. Pick its Port.
   - **Manual Ball Valve** or **Manual Butterfly Valve:** a Manual Valve Widget of its own, put just below the vessel, ready for you
     to pipe to the outlet. Only a click opens or closes it, and a Process asks a person to do it (Skynet Rule 5.15).
   - **None:** the outlet is an open IP for a pipe or hose.
4. **Inlets.** A **Tangential Inlet** for a whirlpool (Left or Right) and a **Sparge Arm / Steam Slayer** (Upper Left or Upper
   Right).
5. **Heating.** How many **Heating Elements** (None to 4). For each one pick its spot (Right Element, Left Element, Right Back
   Element, Left Back Element) and its Port. Each is one Heating Element with a Method (On/Off, Hysteresis, PID, Duty Cycle ...),
   and one click on it turns it On or Off. Running more than one at a time is fine; ask a Licensed Electrician about your circuits.
6. **Temperature.** None, a **Thermowell with its probe** (in from the side; pick its spot) or a **Front probe** (on the Center
   Probe spot). Pick the probe type and its Port (or the OneWire probe number). The vessel's Heating Elements read this probe.
7. **HERMS Coil.** None, Left or Right. It goes on that side's HERMS In and HERMS Out; flow in one comes out the other.
8. **Check and Build.** A small picture shows a dot on every opening it uses (blue = a part built in) with a line for each thing on
   it. Press **🔨 Build**.

Two parts can't share a spot, and two parts can't share a Port.

## After Build

The vessel is on the **🔨 Build Tab**. Every opening you did not use is **Not Placed** (hidden; **👁 Show All** in its Properties
shows them). Join its pipes there, or double-click it to change anything in its Properties. Then press **💾 Save Build ... > To a
Tab** to put it on its Tab.

**Once it is on a Tab and the layout is saved, its openings and built in parts are locked for good.** Its Name, Labels, Gallons,
Tab and place can still change.

## BruControl Import

The BruControl Import program's Vessels page will ask these same pages later, with some items greyed out.
