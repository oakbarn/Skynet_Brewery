# Build a Vessel Device step by step

The **Vessel Device Builder** asks what your vessel has, then builds it for you as a **Vessel Device** (Skynet Rules 19.5 and 5.31).
Its Heating Elements and its Temperature probe are **built into it**, like the RIMS tube's, so they can't be lost or deleted on
their own.

## Where to find it

In **Edit layout**, open **Vessel** on the Edit layout bar and pick **🔨 Build a Vessel (a plain stainless pot, then its parts)**.
It is also under **Add Widget > Vessels**.

## 1. The questions

Every vessel starts as a **plain stainless pot**, drawn to its own Height and Diameter. Each part goes at its usual height off the
inside bottom, measured on real kettles, whatever their size. Left and Right are as you face the vessel.

| Question | Choices |
| --- | --- |
| Units | US (gallons, inches) or Metric (liters, cm) |
| 1. Height, 2. Diameter | inside, first. The pot is drawn to them and its volume comes from them. |
| Label | for example HLT (it can't be blank) |
| General Type | HLT, Mash Tun, Brew Kettle, All In One, Whirlpool, Fermentor, Bright Tank. **Other** asks you to type one. |
| Tab | the Tab it goes on when the Build is saved |
| 3. Outlet | Center Low (about 2 in off the bottom), Center Bottom Drain (in a 6 in skirt, the drain centered in it), None. Its valve: Manual Ball Valve with Elbow, Motorized Ball Valve with Elbow, Manual Butterfly Valve with Elbow, Manual Ball Valve, Motorized Ball Valve, Manual Butterfly Valve |
| 3b. False Bottom (Mash Tun only) | its Height above the Bottom, blank for none. It is drawn as a dashed line. The Outlet stays below it at its usual height. |
| 4. Temperature | Electronic (then its Probe Type) or Analog Gauge, None. Then Thermowell or Direct, then where: Center above the Outlet (about 5.5 in off the bottom), Left, Right, Back Left, Back Center, Back Right |
| 5. Tangential Inlet | Left Low (about 1.5 in off the bottom), Right Low, None. Its valve: the same 6 as the Outlet. |
| 6. Sight Gauge | Left, Right, None. Its Bottom IP is 1 in off the bottom, its Top IP directly above, 1 in off the top. |
| 7. Volume Pressure Sensor | Right Side, Left Side, Back Centered, None (1 in off the bottom) |
| 7a, 7b. Level or Float 1 and 2 | Left, Right, Front, Back, None; its Height from the Bottom; Normally Closed or Normally Open |
| 8. How is it heated | Electric Heating Element(s): Heater 1 and Heater 2, Back Right or Back Left (2 in TC), each with its Height above the Bottom. Gas Burner: Natural Gas, High Pressure Propane or Low Pressure Propane, and its Igniter: (none), Flat Plate (no Safety), Pilot with Valve Control, Pilot (no Safety). Not heated. |
| 9. Sparge Return | High Right, High Left, None. Its Shutoff: (none), Manual Ball Valve, Motorized Ball Valve. Its Tee with Temperature Probe: (none), Instrument Tee, Long Tee. |
| 10. Steam Slayer 2 in | High Right, High Left, None. Reducer: (None), 2 in to 1.5 in Reducer |
| 11. HERMS Coil (Immersion) | Inlet Left, Outlet Right; Inlet Right, Outlet Left; Inlet Right, Outlet Right; Inlet Left, Outlet Left (on one side: Inlet High or Inlet Low). Copper or Stainless. |
| 12. Fermentor Control | Heat and Cooling held by one Setpoint (it needs an Electronic Temperature probe) |
| 13. Additional IPs | up to 4, on any place of the Vessel Layout no part above has taken: 1.5 TC, 2.0 TC, 3/4 TC, 1/2 TC, 1/2 BSP, 1/2 MPT, 1/2 FPT |

When **Gas Burner** is picked, a big red warning shows:

> ⚠ Gas can kill or cause a fire. Follow every gas safety precaution. You are responsible for all safety when using gas. OakBarn
> Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.

Press **🔨 Build**. A Manual Valve on the Outlet, the Tangential Inlet or the Sparge Return is put on at once, and so is the
**Sight Glass**, standing between the two Sight Gauge IPs.

### 🔌 Interface, Ports and Names

Right after **🔨 Build**, a second pop-up asks for every part that needs a Port: the Temperature probe, the Heaters and the Level or
Float switches. Pick the **Interface** they are wired to, then each part's **Port** (or its 1-Wire Index). **💾 Save** makes them
all, built into the vessel, each with its **Suggested Name**. **✖ Close** leaves them to pick one at a time in the Vessel Builder
panel. With no Interface yet, the pop-up is not shown: add the parts later, once the Interface is set up.

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
- The **Sparge Arm** is drawn inside the vessel, from its opening toward the other side. The **Sparge Tee**, the **Steam Slayer** and the **Gas Burner** come in the next
  update.

Double-click a part's picture on the vessel to open its own Properties (a faint one opens its picker). The vessel's Properties
show a section for each Heating Element and the Thermowell / Probe (Help: Vessel Widget).

Press **✔ Done** to close the panel. Then press **✅ Finish Build ... > Move to Tab** to put the vessel on its Tab.

**Once it is on a Tab and the layout is saved, its openings and built in parts are locked for good.** Its Name, Labels, Volume,
Tab and place can still change.
