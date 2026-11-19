# Click a temperature to change its Setpoint

When the brewery is running (not in Edit layout), **one click** on a temperature opens the **SetPoint pop-up** of the Heating
Element that holds that temperature (Skynet Rule 2.43). This works on:

- a **Temperature Probe** on a Tab, and its reading (also when it is shown as a Skynet Dial),
- a **Thermowell** or a **probe tee**,
- a **Probe or Thermowell built into a Vessel Device**, and a Vessel's own Probe spot,
- a **Picture Widget** that shows a Temperature Probe.

## PV and SV on the probe's display

Every Temperature Probe's display on a running Tab shows two lines, like a panel controller (Panel Updates 41):

- **PV** on top: what the probe reads now, for example **152.3 °F**. Its color tells you where it is against the Setpoint
  of what uses the probe:
  - **Hysteresis:** **Green** while the reading is within its Offset of the Setpoint. **PID** and **Precise:** Green within half a
    degree C (one degree F). **Deadband:** Green inside the Deadband. **Fermentor Control:** Green between its Heat and Cool Offsets.
    Outside: **Blue** below the Setpoint (too cold), **Red** above it (too hot).
  - **Duty Cycle**, **Direct** and **PWM:** **Red** while a heater is ON, **Blue** while a cooler is ON, **Grey** while it is OFF.
  - A probe nothing uses keeps its own Display color.
- **SV** under it, in a **green box**: its **Setpoint**, for example **152.0 °F**.

Both lines show in **Settings > Panel settings > Units** (Skynet Rule 2.59): **°F** in US, **°C** in Metric, whatever the probe keeps its
numbers in. A probe kept in °C (the 3 Vessel Sample) shows **150.0 °F** in US; a Setpoint typed in °F is saved in °C. Each line keeps all its digits and its °F or °C together on one line, inside the display; a long number makes both lines smaller
to fit. There is no Visible switch: PV and SV are part of the display.

**One click on the green SV box** lets you type a new Setpoint right in it (no pop-up, Rule 2.44). Press **Enter** to set it (or
click somewhere else after changing it); **Esc** puts it back. A new Setpoint never turns anything On or Off. A click anywhere else
on the probe still opens the SetPoint pop-up below.

There is only **one Setpoint**:

- A probe that a **Heating Element** (or a Fermentor Control, or an older Hysteresis, PID or Deadband Device) uses as its
  Temperature Probe shows **that one's Setpoint**. Changing it on the probe changes it on the Heating Element, and the other way
  round. When two or more use the same probe, the SV is the one that is ON (else the first).
- A probe that **nothing heats or cools to** keeps **its own Setpoint**. It starts from **Setpoint** in the probe's Properties
  (empty shows **---**), and a Process reads or sets it with **.setpoint** (for example `Mash_Probe.setpoint = 152`), so a Process
  or an Alarm can compare the reading with it.

A Setpoint typed on a Tab or set by a Process lasts until the Brain restarts; then it starts again from Properties, the same as a
Heating Element's. The SV box does not show in Edit layout, on the Dial or Bar look, or when the probe's value is hidden.

## Which Heating Element

The pop-up belongs to the Heating Element whose **Temperature Probe** (in its Properties) is the probe you clicked. A Vessel's
own Probe goes to the Vessel's Heater first. When **two or more** Heating Elements read the same probe, a short list asks which
one. When **none** does, a short note says so: pick the probe as the Temperature Probe in a Heating Element's Properties. On the
Simulator, a probe with no Heating Element still opens its **Simulated reading** pop-up, as before.

## The SetPoint pop-up

- At the top: the probe's name and what it reads now.
- Under it: whose Setpoint it is, whether it is ON or OFF, and its heating method.
- The **Setpoint** with **−** and **+** (or type a number; Enter sets it).
- **Set + ON** sets the Setpoint and turns it on, **OFF** sets it and turns it off, **Set** only sets it (ON or OFF stays as it
  was). Nothing turns on unless you click **Set + ON** (Rule 2.33).
- **Heating method…** opens the Heating Element pop-up (Help 150) for its method, Duty cycle and ON / OFF.
- **Cancel** closes it and changes nothing.

Only **Hysteresis**, **PID**, **Deadband** and **Precise** use a Setpoint (On/Off and Duty Cycle do not). When the Element is on
On/Off or Duty Cycle now, the pop-up says so, and **Set** switches it to the first of its allowed methods that holds a Setpoint.
When none of its allowed methods holds one, the pop-up says to tick one in its Properties.

Operators and admins can change a Setpoint; a view only account cannot. Double-click still opens Properties in Edit layout
(Rule 2.9).
