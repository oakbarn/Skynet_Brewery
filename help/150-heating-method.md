# One Heating Element, pick how it heats

A heating element is **one Device**, however you control it. How it heats is its **heating method**, and you can change that
while brewing, with a click or from a Process (Skynet Rule 6.19; Fritz, 2026-11-07: "ONE device, but select the heating method
via process or on the Device when clicked").

| Heating method | What it does | Needs a Temperature Probe |
|---|---|---|
| **On/Off** | Full on or off. | No |
| **Duty Cycle** | On for a % of each cycle (for example 60 % for a rolling boil). | No |
| **Hysteresis** | On below the Target, off when it gets there. | Yes |
| **PID** | Holds a Target temperature by working out its own %. | Yes |
| **Deadband** | Steps its % up or down toward the Target. | Yes |

## Click it while brewing

Click the Heating Element on its Tab. The pop-up shows:

1. **Heating method**: one button for each. The one it uses now is marked. Hysteresis, PID and Deadband are greyed out until the
   Element has a **Temperature Probe** (in its Properties).
2. The main setting of that method, with **−** and **+**: the **Duty cycle %**, or the **Target**.
3. **Set + ON** (or **ON** for On/Off), **OFF**, **Set** (change it, leave it on or off as it is) and **Cancel**.

It still asks before it turns on (Rule 2.33): nothing turns on until you click **Set + ON** or **ON**.

While it is ON, the Element shows what it is doing: **60 %** in Duty Cycle, **45 % ▸ 152** in PID or Deadband, **ON ▸ 152** or
**idle ▸ 152** in Hysteresis.

## From a Process

```
hE_HLT_1.method = "PID"
hE_HLT_1.target = 152
hE_HLT_1 = true
...
hE_HLT_1.method = "Duty Cycle"
hE_HLT_1.dutycycle = 70
```

- `.method` is **On/Off**, **Duty Cycle**, **Hysteresis**, **PID** or **Deadband** (the short codes DO, DutyC, HYS, PID and DeadB
  work too). Reading it gives the word, for example `if hE_HLT_1.method == "PID"`.
- `hE_HLT_1 = true` (or `.enabled = true`, the same thing) turns it ON in its method; `= false` turns it OFF.
- Changing the method **while it is ON** goes on at once in the new method, **except** to **On/Off**: that turns it OFF first, so
  an Element never jumps from 40 % to full power by itself. Turn it ON again for full power.
- Every method keeps its own settings: `.dutycycle`, `.interval` (Duty Cycle); `.target`, `.onoffset`, `.ondelay` (Hysteresis);
  `.target`, `.kp`, `.ki`, `.kd`, `.maxoutput`, `.maxintegral`, `.calctime`, `.outtime` (PID); `.target`, `.deadbandoffset`,
  `.innerbandoffset`, `.initialoutput`, `.innerbanddrive`, `.outerbanddrive`, `.maxoutput`, `.calctime`, `.outtime` (Deadband).
  The same names the old separate Duty Cycle, Hysteresis, PID and Deadband Devices had.
- `.value` is the output % a PID or Deadband works out. `.output` is its pin right now (read only).

## In its Properties

Under **Heating method**: the method it **starts with**, the **Temperature Probe** it reads (Hysteresis, PID and Deadband), and
that method's settings. Pick another method and its settings show; the others are kept. A PID or Deadband can also be
**Reversed** (cooling) and use a **PWM pin**. A Heating Element built into a Vessel Device, RIMS tube or Integrated kettle has the
same settings.

## Coming from BruControl

BruControl controls one element with two Devices on the same port, for example **M_HLT Heat** (Duty Cycle) and **HLT PID** on port
42. The BruControl Import makes them **one Heating Element**. It starts in the first one's method, and both old names still work
in a Process: `HLT_PID = true` switches it to PID and turns it ON; `M_HLT_Heat = true` switches it to Duty Cycle. Where the second
one was placed on a Tab, it becomes a **Clone** of the Heating Element.

Older Skynet Schemas that have two heaters on one port keep working as before (the last one turned on wins, Rule 6.1).
