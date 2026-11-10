# One Heating Element, pick how it heats

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

A heating element is **one Device**, however you control it. How it heats is its **heating method**, and you can change that
while brewing, with a click or from a Process (Skynet Rule 6.19).

| Heating method | What it does | Needs a Temperature Probe |
|---|---|---|
| **Direct** | Full on or off. | No |
| **Duty Cycle** | On for a % of each cycle (for example 60 % for a rolling boil). | No |
| **Hysteresis** | On below the Setpoint, off when it gets there. | Yes |
| **PID** | Holds a Setpoint temperature by working out its own %. | Yes |
| **Deadband** | Steps its % up or down toward the Setpoint. | Yes |
| **Precise** | A calm PID that holds a Setpoint to 0.1 degree, for a still's column or a water bath (see Precise heating). | Yes, a fine one |

## Click it while brewing

**One click** on the Heating Element on its Tab turns it **ON or OFF** at once, in the method it is in, like a Pump (Skynet Rule
2.33). Its pop-up opens from a **method spot** (below), or **Heating method…** in its Temperature Probe's SetPoint pop-up. The pop-up shows:

1. **Heating method**: one button for each. The one it uses now is marked. **One click on a method switches to it at once**
   (no Set needed); the pop-up stays open for its setting. Hysteresis, PID, Deadband and Precise are greyed out until the Element has a
   **Temperature Probe** (in its Properties).
2. The main setting of that method, with **−** and **+**: the **Duty cycle %**, or the **Setpoint**.
3. **Set + ON** (or **ON** for Direct), **OFF**, **Set** (change it, leave it on or off as it is) and **Cancel**.

Nothing in the pop-up turns on until you click **Set + ON** or **ON**, with one exception: in **Duty Cycle** the % is its On and
Off too. A Duty cycle % of **0 turns the Element Off**, and **above 0 turns it On** if it was Off, whether you set it here or a
Process sets it (Skynet Rule 6.19).

While it is ON, the Element shows what it is doing: **60 %** in Duty Cycle, **45 % ▸ 152** in PID, Deadband or Precise, **ON ▸ 152** or
**idle ▸ 152** in Hysteresis.

## Which methods suit your wiring

How the element is wired decides which methods make sense (the hover help on the Heating method field says this too):

| Wired to | What it does | Good methods |
|---|---|---|
| **SSR** (solid state relay) | Switches the element fully on or off, as fast as needed | All of them |
| **Contactor** (a switch that clicks) | Switches it on or off, but wears out if switched quickly | Direct, Hysteresis (or a long cycle time) |
| **DAC** (0-10 V signal to a power controller) | Sets the power anywhere from 0 to 100 % | PID, Deadband, Precise |

## Its main method and the other methods allowed

When you build it (and later in its Properties), the **Heating method** part has three rows:

- **Current Method**: the method it is in. The dialog opens on the one it is in now. Beside it, **Short Label** switches its
  balloons to short names (DO, DutyC, HYS ...).
- **On / Off**: on the same line, a small picture of the Element. One click turns it On or Off at once, like one click on it on
  the Tab. On / Off is the Element itself; **Direct** is a method (simply On or Off), so a Direct Element that is On heats at 100 %.
- **Enabled**: a switch under each method's name. **A method must be enabled to be used.** The Current Method and **Direct**
  (full power) are always on. The pop-up, the balloons, Method Clones and Processes offer only the enabled ones, and a Process asking
  for another one stops with a plain message.
- **Control Method**: a balloon for each enabled method, the Current Method **red**, the others **yellow**. These are the same
  balloons as under the Element on its Tab, and they work together: **click Duty Cycle here or on the Tab** and Duty Cycle becomes the
  Current Method in both places, red, and the one before turns yellow.

An Element **built into a Vessel Device or RIMS tube** works the same way: open its Properties (double-click it, or its ⚙) for
its Heating method and the other methods allowed. Older Schemas whose built in Element was a separate Hysteresis or PID Device
are changed to a Heating Element when they load, keeping its name and settings.

## One-click method spots

When **two or more** methods are allowed, a small button for each shows **under the Element** on its Tab, or under its picture on
a **Vessel Device** when it is built in. **One click** on one switches the Element to that method at once; the one in use is **red**, the others
**yellow**. There is no Turn Off button: one click on the picture turns it Off. The buttons sit in an invisible box only as wide as the methods allowed, centred under the picture, and can show short names ([Heating Elements and Valves on the screen](179-heating-element-look)).
**One click on the Element's picture** on its Vessel Device turns it **On or Off** at once, in the method it is in, like a Pump.
A click on its **box** (the tile with its reading) opens its pop-up, with **ON**, **OFF** and its method.
When the Element is **Off**, a click on a method spot only switches its method; it stays Off until you turn it On.
Several Elements can be On at the same time (for example on different AC circuits). With only the main method, no buttons show.

Example: Tartan's HLT Element on Main Panel port 42 shows **Duty Cycle** and **PID**: one click on Duty Cycle for the boil, one
click on PID to hold the strike temperature.

## Method Clones: one tile per method

To show one Element as separate tiles, one for each method side by side, add a **Method Clone** (Rule 4.4):
in Edit layout, open **⧉ Clone Device** and pick the Element under **Method Clone**. It can go on the Element's own Tab. In its
Properties pick the **Control Method** it stands for and, if you like, its own **Label**.

- **One click** on the tile acts just as a click on the Element, all in unison, with no pop-up: showing ON, it turns the Element
  Off; showing OFF, it switches the Element to that method and turns it On.
- The tile shows **ON** only while the Element is ON **in that method**; otherwise it shows OFF.
- The Element itself still shows what it is doing in whatever method it is using.

## From a Process

```
hE_HLT_1.method = "PID"
hE_HLT_1.setpoint = 152
hE_HLT_1 = true
...
hE_HLT_1.method = "Duty Cycle"
hE_HLT_1.dutycycle = 70
```

**The short way:** the method's short code after a dot, on a line of its own, switches it, the same as `.method =`:

```
MB_25_HE_HLT_BR.HYS
MB_25_HE_HLT_BR.DutyC
```

The codes are **DO** (Direct), **DutyC** (Duty Cycle), **HYS** (Hysteresis), **PID** and **DeadB** (Deadband). The Process editor offers them after the name.

## Its name

A Heating Element's Device Type is **HE**, so its name reads like `MB_25_HE_HLT_BR` (Interface, Port, HE, Label, Tab), whatever method it is using.
It is wired straight to its port, going to an SSR or contactor, or to a DAC. Elements named before keep DO in their names.

- `.method` is **Direct**, **Duty Cycle**, **Hysteresis**, **PID** or **Deadband** (the short codes DO, DutyC, HYS, PID and DeadB
  work too). Reading it gives the word, for example `if hE_HLT_1.method == "PID"`.
- `hE_HLT_1 = on` turns it **On** in its method; `hE_HLT_1 = off` turns it **Off**. Every method works this way, Hysteresis and PID too.
- **Picking a method never turns it On**: a method spot, the pop-up's method buttons or a Process only change the method. Turning
  it On or Off is its picture, a Clone, or a Duty cycle % (Skynet Rule 6.19).
- Changing the method **while it is ON** goes on at once in the new method, **except** to **Direct**: that turns it OFF first, so
  an Element never jumps from 40 % to full power by itself. Turn it ON again for full power.
- Every method keeps its own settings: `.dutycycle`, `.interval` (Duty Cycle); `.setpoint`, `.onoffset`, `.ondelay` (Hysteresis);
  `.setpoint`, `.kp`, `.ki`, `.kd`, `.maxoutput`, `.maxintegral`, `.calctime`, `.outtime` (PID); `.setpoint`, `.deadbandoffset`,
  `.innerbandoffset`, `.initialoutput`, `.innerbanddrive`, `.outerbanddrive`, `.maxoutput`, `.calctime`, `.outtime` (Deadband); the PID's own plus `.holdoutput`, `.smoothing` (Precise).
  The same names the old separate Duty Cycle, Hysteresis, PID and Deadband Devices had.
- **`.setpoint` is the Setpoint** (the temperature it holds). The older name **`.target`** still works and is exactly the same
  thing, read or set, so older Processes keep working. New Processes, Templates and Help use `.setpoint`.
  Dialogs call it **Setpoint** (Skynet Rule 6.19).
- `.value` is the output % a PID, Deadband or Precise works out (`.pv` is the smoothed reading Precise holds). `.output` is its pin right now (read only).
- **`.method` is the word for every Device with more than one method of control** (today the Heating Element). In the Process
  editor, type `hE_HLT_1.method =` and the list shows its methods to pick from, in quotes. A Device with only one way of control
  has no `.method`.

## In its Properties

Under **Heating method**: the method it **starts with**, the **Temperature Probe** it reads (Hysteresis, PID, Deadband and Precise), and
that method's settings. Pick another method and its settings show; the others are kept. A PID or Deadband can also be
**Reversed** (cooling) and use a **PWM pin**. A Heating Element built into a Vessel Device, RIMS tube or Integrated kettle has the
same settings.

## One Interface Port, one Device

Rule 6.1: in Skynet **each port on an Interface has only one Device**. The Available
Ports list never offers a port that is in use, and a Device can't be saved on one. To control a heater another way, change its
heating method instead of adding a second Device.

Older Skynet Schemas that already have two Devices on one port keep working as before (the last one turned on wins), and those
two can still be saved; you just can't make new ones.

See also: [Heat Hysteresis: what switches the element](181-heat-hysteresis-switched-by) (Rule 6.29).
