# Build Tab Add button

Four tools on the **Edit layout** bar make building easier (Fritz, 2026-10-27): the **➕ Add** button, the turn and flip buttons, grab points on every side, and the X / Y / Width / Height read-out. The **Edit layout** button itself (the hammer and pick beside **☰ Menu**) is now **navy blue**.

## The Add button

Press the **navy blue Edit layout** button (or **☰ Menu > Edit layout**), then **➕ Add** at the start of the Edit layout bar. A box opens with the things you add most, one click each. Whatever you pick is made on the 🔨 [Build Tab](55-build-tab) and its Properties open, the same as every new thing (Rule 4.1). When it is ready, press **💾 Save Build ...** to put it on a Tab.

- **🚰 Valves**
  - **Motorized valve**: a Device. A board pin opens and closes it.
  - **Proportional valve 0-100 %**: a Device on an analog output.
  - **Manual valve**: a Widget. No board pin: you turn it by hand, and tap it on the Tab to show open or closed. (A Motorized valve can also be set to Valve type **Manual** in its Properties, see [Manual valves](29-manual-valves).)
- **⚙ Pumps**
  - **Pump, on / off**: a Device on a relay or SSR, with an inlet and an outlet IP for pipes.
  - **Pump speed 0-100 %**: a PWM output (for example a MOSFET module) that sets a pump's speed. Put it beside its Pump.
- **🔥 Elements**
  - **Heating element, on / off**: a Device on a relay, SSR or contactor.
  - **Heating element power 0-100 %**: a PWM output.
  - **PID**, **Hysteresis** and **Duty cycle**: control outputs that switch the element's pin by themselves.
  - **RIMS tube** and **Electric kettle, basic**: Skynet_Integrated_Devices with the element and the probe built in (see [Skynet Integrated Devices](64-skynet-integrated-devices)).
- **🌡 Probe ...** opens a second box, only when you press it:
  - **1-Wire**: DS18B20 probes. Many share one pin; each probe is its own Device.
  - **10K NTC**: a thermistor on an analog pin, Beta 3950 or Beta 3977 (the BCS-462 / BruControl type).
  - **RTD**: PT100 or PT1000 on a MAX31865 board.
  - **Thermowell**: a Skynet TC 1.5 thermowell (Short, Medium or Long) with its Temperature Device built in. The next box asks which kind of probe is in it.
- **🔌 Add an Interface ...**: a board (Mega, ESP32, Pi ...). Devices sit on an Interface's pins, so add the Interface first.

Every Device then asks the usual New Device questions: Interface, Device Type, Port (Rule 4.2).

## The Add element list (Relay module / SSR ...)

The long list beside **Add element** starts on **Relay module / SSR / contactor (on-off)** only because that is the first entry. It is **not a setting** and it is **not tied to any Device**: it is the menu of every kind of Device and Widget the panel can make. Pick a kind, press **Add element**, and a new one of that kind is made on the Build Tab. Nothing changes until you press Add element, and the list never changes a Device that is already built.

The **➕ Add** box holds the kinds used most. The list keeps all of them (digital inputs, analog sensors, steppers, scales, timers, alarms, variables and so on).

## Turn and flip a fitting or vessel

Click a Skynet fitting (an elbow, tee, U ...) or a Skynet vessel in Edit layout. Six buttons show up on the Edit layout bar:

| Button | What it does |
|---|---|
| **⇆ Flip H** | Flip Horizontal: mirror left and right |
| **⇅ Flip V** | Flip Vertical: mirror top and bottom |
| **⟲ 90** | Turn 90 degrees Left |
| **⟳ 90** | Turn 90 degrees Right |
| **⟲ 45** | Turn 45 degrees Left |
| **⟳ 45** | Turn 45 degrees Right |

The picture, its IPs and the fittings joined to it all follow. For an IP fitting (the small drawn tee, elbow, cross or manual valve) only the turn buttons work, because its shape looks the same flipped. The buttons don't show for a 🔒 locked item. The same settings are still in the item's Properties (Flip Horizontal, Flip Vertical, Rotate).

## Grab points to resize

In Edit layout, click an unlocked item: it gets **eight grab points**, one on each corner and one in the middle of each side. Drag one to make the item bigger or smaller:

- a **corner** changes the width and the height,
- a **side** changes only that side,
- the opposite corner or side stays where it is.

Items you have not clicked show only the bottom right corner, so a busy Tab stays readable. This works on the Build Tab and on every other Tab. 🔒 Locked items have no grab points (unlock them first), and phones and tablets don't resize unless the switch in ☰ Menu > Default allows it.

## X, Y, Width and Height

While you move or resize something, a small navy box beside the pointer shows its **X** and **Y** (pixels from the left and top of the Tab), its **Width** and its **Height**. To type exact numbers, double-click the item and set X, Y, Width and Height in its Properties.
