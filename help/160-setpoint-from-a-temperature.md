# Click a temperature to change its Setpoint

When the brewery is running (not in Edit layout), **one click** on a temperature opens the **SetPoint pop-up** of the Heating
Element that holds that temperature (Skynet Rule 2.43). This works on:

- a **Temperature Probe** on a Tab, and its reading (also when it is shown as a Skynet Dial),
- a **Thermowell** or a **probe tee**,
- a **Probe or Thermowell built into a Vessel Device**, and a Vessel's own Probe spot,
- a **Picture Widget** that shows a Temperature Probe.

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
