# Precise heating: hold a temperature to 0.1 degree

**Precise** is a heating method of the Heating Element, next to On/Off, Duty Cycle, Hysteresis, PID and Deadband (Skynet Rule
6.19; Fritz, 2026-11-07: "a method of precise control built if possible using offsets to get to .1 F or .1 C"). It is for jobs
where a normal PID wanders: a still's column, a sous-vide water bath, a mash that must not drift.

## What decides how close it can hold

Nothing can hold a temperature closer than its **probe** can see. Precise is only as good as the probe and the way the element
is switched.

| Probe | Smallest step it sees | Good for 0.1 °F? | Good for 0.1 °C? |
|---|---|---|---|
| **PT100 / PT1000** on a MAX31865 board | about 0.03 °C (0.05 °F) | Yes, the best choice | Yes |
| **DS18B20** (One Wire) | 0.0625 °C (0.11 °F) | Just about (±0.1 °F) | Yes |
| **Thermocouple** on a MAX31856 board | about 0.01 °C, but it drifts | Not steady enough | Not steady enough |
| **Thermistor, LM35, TMP36** on an Arduino analog pin | about 0.2 to 0.5 °F | No | No |

Skynet sets every DS18B20 to its finest setting (12-bit) when it starts, because some come set coarser. When Precise is picked
or allowed, the Heating Element's Properties say whether its probe is fine enough.

| Wired to | Good for Precise? |
|---|---|
| **SSR** (solid state relay) | Yes. An Output window of 1 to 2 seconds is good. |
| **DAC** (0-10 V signal to a power controller), on a PWM pin | Yes, the smoothest. |
| **Contactor** (a switch that clicks) | No: it wears out when switched that often. |

Where the probe sits matters too: in the vapor or liquid you want to hold, not touching the element, in a thermowell with
thermal paste so it sees a change quickly.

## What Precise does that PID does not

1. **Smoothing**: it averages the probe over the **Smoothing** seconds (10 to start), so the probe's tiny steps don't make
   the heater twitch.
2. **Hold output**: the % the element needs **just to stay** at the Setpoint. It starts there, so it doesn't swing far to find it.
   Watch the % once it has settled at the Setpoint and put that number in. Leave it at 0 and it finds it by itself, more slowly.
3. **Less overshoot after a warm-up**: the part that builds up over time (the I part) is held while the element is at 0 % or
   at its Max output, and while the temperature is already on its way to the Setpoint. That stored-up push is what makes a
   plain PID overshoot when it arrives.
4. **Exact power**: the element is on for its % of each **Output window**. The bit too short to switch is carried to the next
   window, so over a minute it gets exactly the % asked for, even 12.34 %.
5. **Max output %**: a big element on a small column overshoots. Limit it, for example to 40 %.

Setpoint, Kp, Ki, Kd and Max output are the **same numbers as its PID**, so switching between PID and Precise carries on.

## Calibrate the probe: two points

A **Calibration offset** moves every reading by the same amount. That is fine when the probe is off by the same amount
everywhere. Many probes are right at one end and a little off at the other, so the probe's Properties also have a
**Two-point calibration** (the ⬢ on its line):

1. Put the probe in **ice water** (lots of ice, a little water, stirred). The truth is **32 °F (0 °C)**. Write what it read.
2. Put it in **boiling water**. Water boils about **1 °F lower for every 500 ft** above sea level: 212 °F at sea level, 207 °F
   at 2,500 ft, 202 °F at 5,000 ft (100 °C, 97.2 °C, 94.4 °C). Write what it read and the true boiling point.

Skynet then corrects every reading in between. The Calibration offset is still added after it, for a last small tweak. With
only one point filled in, it works like an offset.

## Use it

- In the Heating Element's Properties, pick **Precise** as the main method, or tick it under **Other methods allowed**.
- One click on its **Precise** spot, or on the Precise button in its pop-up, switches to it.
- A Process: `hE_1.method = "Precise"` or the short `hE_1.PREC`. Its settings by name: `.setpoint`, `.kp`, `.ki`, `.kd`,
  `.maxoutput`, `.holdoutput`, `.smoothing`, `.calctime`, `.outtime`. `.value` is its output %, `.pv` the smoothed reading.

## Tuning, plainly

Start with Kp 10, Ki 0.1, Kd 0, Smoothing 10 s, Output window 2 s.
- It swings up and down around the Setpoint: lower **Kp**, or raise **Smoothing**.
- It sits a little below the Setpoint: raise **Ki** a little, or set the **Hold output**.
- It overshoots on arrival: lower **Max output %**, or set the **Hold output**.

## Coming from BruControl

BruControl has no Precise method, so the BruControl Import brings a PID in as **PID**, as it was. Precise and the two-point
calibration are Skynet's own: after the Import, tick **Precise** in the Heating Element's Properties and calibrate its probe.
