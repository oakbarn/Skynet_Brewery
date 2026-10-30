# Edit layout bar

The **Edit layout** bar (press the navy blue Edit layout button beside **☰ Menu**) has three rows (Fritz, 2026-10-28). Everything new is made on the 🔨 [Build Tab](55-build-tab) first (Rule 4.1); **💾 Save Build ...** then puts it on a Tab.

| Row | What is on it |
|---|---|
| **1** | Devices on the left, Widgets on the right |
| **2** | Draw pipe, Draw hose, Elbows, Tees …, the turn buttons, 🔒 Lock, Lock All, Unlock All, ⚙ Tab settings, New tab, 🔨 Build Tab, 🔨 To Build Tab, 👁 Preview, 💾 Save Build ... |
| **3** | The hint, Update Version, Save layout, Exit |

## Devices: Select Device Type and Add Device

A **Device** is tied to a pin on a board (an Interface).

1. **Select Device Type** lists the major kinds:
   - **On/Off**: relay, SSR or contactor, and the Pumps, Valves and heating elements that are switched on and off
   - **Pumps**: on / off, speed by PWM, speed by 0-10 V (a VFD), sump pump
   - **Valves**: motorized valve, proportional valve 0-100 %
   - **Heating Element**: on / off, power by PWM, PID, Hysteresis, Duty cycle, RIMS tube, electric kettle
   - **PWM / Analog out**: PWM, 0-10 V, 4-20 mA
   - **Inputs**: switches, push, toggle and pulse buttons, latching inputs, counters, float, flow switch, interlock
   - **Probe**: DS18B20, PT100, PT1000, thermocouples, NTC, LM35, TMP36, and the Thermowells (Short, Medium, Long)
   - **Sensors**: analog inputs, pressure, level, pH, flow meter
   - **Motors**: stepper motors
   - **Weight**: vessel scale
2. **Add Device** then lists only the Devices of that kind. With no kind picked it lists every Device, grouped. Click one to add it.

## The shortcuts: Pumps, Valves, Probe, Heating Element, PWM

These are short cuts. Clicking **Pumps** shows only the pump list: the same as picking **Pumps** in Select Device Type and then opening Add Device. One click to open, one to pick.

## Add Device

Picking a Device opens the **Add Device** box. Fill it from the top:

1. **Interface** (the board). The last line, **➕ Add new Interface…**, adds a board.
2. **Available Ports / Pins**: only the free pins that fit this Device.
3. **Suggested Name**: made from the Interface, pin, type and Label. You may type your own (the panel warns you, see [Interfaces](76-interfaces)).
4. **Label**: the text shown on the Tab. Or switch **Show label** off for no Label.
5. **Width** and **Height**: 150 x 150 to start. Change them now or later.

When a kind has more than one Device Type (for example a low or high temperature valve), a **Device Type** line is asked after the Interface.

**➕ Add Device** (at the top and at the bottom) works once the Label is typed or Show label is off. **✖ Cancel** adds nothing. After Add Device the rest of its Properties open, and the Device sits in the middle of the Build Tab. If **☰ Menu > Default** sets where new things go (X and Y), it goes there instead.

## Widgets

A **Widget** lives only in the app, with no board pin.

- **Select Widget Type** and **Add Widget** work like the Device pair: Pictures and text, On-screen controls (switch, timer, alarm, sound player, shared variable), Vessels, Equipment, Fittings and IPs, gGlobal variables.
- **Picture ➕** and **Text ➕**: one click each.
- **Vessel**: a Vessel Widget (you add everything to it), an Integrated vessel (ready-made, see [Add a Vessel](66-add-a-vessel)) or a manual vessel (BrewZilla, DigiBoil).
- **Manual Valve ➕**: a valve turned by hand. Tap it on the Tab to show open or closed.
- **Add equipment ➕** (far right): chillers, coils, trub filter, RIMS tube and pipe fittings.

## Row 2: pipes, fittings, locks and Tabs

**Elbows, Tees …** sits beside **Draw pipe** and **Draw hose**: an IP point, a pipe, a tee, elbows, a cross, a manual valve, a coupling or a cap. The rest of the row is described in [Tabs](02-tabs) and [Build Tab Add button](75-build-tab-add-button) (turn and flip, grab points).

## ⧉ Clone Device

**⧉ Clone Device** (row 1, after the shortcuts) lists the Devices already on another Tab, grouped by kind. Pick one and its Clone appears on this Tab. See [Cloned Devices](71-cloned-devices).
