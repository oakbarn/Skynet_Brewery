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

**One click** on the Heating Element on its Tab opens its pop-up. It shows:

1. **Heating method**: one button for each. The one it uses now is marked. **One click on a method switches to it at once**
   (no Set needed); the pop-up stays open for its setting. Hysteresis, PID and Deadband are greyed out until the Element has a
   **Temperature Probe** (in its Properties).
2. The main setting of that method, with **−** and **+**: the **Duty cycle %**, or the **Target**.
3. **Set + ON** (or **ON** for On/Off), **OFF**, **Set** (change it, leave it on or off as it is) and **Cancel**.

It still asks before it turns on (Rule 2.33): nothing turns on until you click **Set + ON** or **ON**.

While it is ON, the Element shows what it is doing: **60 %** in Duty Cycle, **45 % ▸ 152** in PID or Deadband, **ON ▸ 152** or
**idle ▸ 152** in Hysteresis.

## One-click method spots

In its Properties, under **One-click method spots on the Tab**, switch on the methods you want a button for. When **two or more**
are on, a small button for each shows **under the Element** on its Tab, or under its picture on a **Vessel Device** when it is
built in. **One click** on one switches the Element to that method at once; the one in use is lit orange. With only one (or none)
switched on, no buttons show.

Example: Tartan's HLT Element on Main Panel port 42 shows **Duty Cycle** and **PID**: one click on Duty Cycle for the boil, one
click on PID to hold the strike temperature. The BruControl Import switches these on for you.

## Method Clones: one tile per method

To show one Element as separate tiles, like BruControl's *M_HLT Heat* and *HLT PID* side by side, add a **Method Clone** (Rule 4.4):
in Edit layout, open **⧉ Clone Device** and pick the Element under **Method Clone**. It can go on the Element's own Tab. In its
Properties pick the **Control Method** it stands for and, if you like, its own **Label**.

- **One click** on the tile switches the Element to that method at once and opens its pop-up.
- The tile shows **ON** only while the Element is ON **in that method**; otherwise it shows OFF.
- The Element itself still shows what it is doing in whatever method it is using.

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
- **`.method` is the word for every Device with more than one method of control** (today the Heating Element). In the Process
  editor, type `hE_HLT_1.method =` and the list shows its methods to pick from, in quotes. A Device with only one way of control
  has no `.method`.

## In its Properties

Under **Heating method**: the method it **starts with**, the **Temperature Probe** it reads (Hysteresis, PID and Deadband), and
that method's settings. Pick another method and its settings show; the others are kept. A PID or Deadband can also be
**Reversed** (cooling) and use a **PWM pin**. A Heating Element built into a Vessel Device, RIMS tube or Integrated kettle has the
same settings.

## Coming from BruControl

BruControl controls one element with two Devices on the same port, for example **M_HLT Heat** (Duty Cycle) and **HLT PID** on port
42. The BruControl Import makes them **one Heating Element**. It starts in the first one's method, and both old names still work
in a Process: `HLT_PID = true` switches it to PID and turns it ON; `M_HLT_Heat = true` switches it to Duty Cycle. Where the second
one was placed on a Tab, it becomes a **Method Clone** of the Heating Element standing for its method, with its BruControl Label
(*HLT PID*), so the Tab looks as it did in BruControl.

## One Interface Port, one Device

This is a big difference from BruControl (Rule 6.1): in Skynet **each port on an Interface has only one Device**. The Available
Ports list never offers a port that is in use, and a Device can't be saved on one. To control a heater another way, change its
heating method instead of adding a second Device.

Older Skynet Schemas that already have two Devices on one port keep working as before (the last one turned on wins), and those
two can still be saved; you just can't make new ones. Anything else BruControl had sharing a port (for example a pump's on/off
and its PWM speed) is listed in the Import notes so you can keep one.
