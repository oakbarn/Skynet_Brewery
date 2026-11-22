# One Heating Element, pick how it heats

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **What decides how close it holds:** the **probe** (a DS18B20 reads to about ±0.9 °F), **where it sits**, how well the liquid is
> **mixed** and its **calibration** matter far more than how the element is switched. Get those right first.

A heating element is **one Device**, however you control it. How it heats is its **heating method**, and you can change that
while brewing, with a click or from a Process (Skynet Rule 6.19).

| Heating method | What it does | Needs a Temperature Probe |
|---|---|---|
| **Direct** | Full on or off. | No |
| **PWM** | A % you or a Process set (for example 60 %), sent out on a PWM Port. | No |
| **Duty Cycle** | On for a % of each cycle (for example 60 % for a rolling boil). | No |
| **Hysteresis** | On below the Setpoint, off when it gets there. | Yes |
| **PID** | Holds a Setpoint temperature by working out its own %. | Yes |
| **Deadband** | Steps its % up or down toward the Setpoint. | Yes |
| **Precise** | A calm PID that holds a Setpoint to 0.1 degree, for a still's column or a water bath (see Precise heating). | Yes, a fine one |

## Adding one: pick its method

**Select Device Type > Heating Element** (or the Heating Element list on the Edit layout bar) has one row for each method:
**Heating Element: DO On/Off**, **PWM**, **DutyC**, **HYS**, **PID**, **Precise** and **Deadband**, then **RIMs Tube** and **Vessel Device
Template**. Every row makes the same **one** Heating Element; the row only picks the method it starts with. After the Add box, its
Properties open with that method's **Settings** on top, so you set it up first. It can still use the other methods later.

**The Hardware Controller and the Port decide how a % gets to the element** (only a DAC / 0-10 V on a PWM Port gets PWM, see [Which method and which wiring?](#which-method-and-which-wiring)).
The **PWM** row offers PWM Ports first and starts on Hardware Controller **DAC / 0-10 V**. Each method's Settings show a note saying which kind of Port it is on.

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

**Change the % or the Setpoint right on the Tab.** The Element's display shows what it is doing and, in a green box on the same
line, the number you set, like the **SV** on a panel controller:

- **Duty Cycle:** the green box is its **Duty cycle %**, for example **60 %** (Off: **idle 60 %**).
- **Hysteresis, PID, Deadband, Precise:** the green box is its **SV** (the Setpoint) with °F or °C, for example **idle SV 152.0 °F**,
  **HEAT SV 152.0 °F** or **45 % SV 152.0 °F**.
- **Direct** and **PWM** have no green box.

**One click on the green box** lets you type a new number in it. Press **Enter** to set it (or click somewhere else after changing it);
**Esc** puts it back. A new Setpoint never turns the Element On or Off and never changes its method. A new Duty cycle % follows the rule
above: **0 turns it Off**, **above 0 turns it On**. A click anywhere else on the Element still turns it On or Off. If a Process is
running, it may set the number again at its next step. The green box does not show in Edit layout, on the Dial or Bar look, or when its
**Data Display** picks one value.

## Hysteresis

Hysteresis keeps the water near the **Setpoint** by turning the heater On and Off.
The HLT element: **Setpoint** 150 °F, **Direction** Heating, **Offset (−)** −1.

- The heater begins to heat.
- The water reaches the Setpoint, 150 °F: the element turns Off.
- The water cools to Setpoint - Offset, 149 °F (150 −1): the element turns On again.
- The water reaches the Setpoint, 150 °F: the element turns Off again.
- The water cools again, and the On and Off Hysteresis cycle repeats.

**Delay** 0: it turns On as soon as the water reaches 149 °F.

**Hardware Controller** Optical SSR: the Offset may be −0.5 to −3 °F, and it starts at −0.5. A Contactor or Mechanical relay may use
−1 to −5 °F with a Delay of at least 10 seconds, and it starts at −1 and 10 seconds. That way it clicks less often and lasts longer.

**Predictive** On: the water keeps warming a little after Off. Skynet learns how much, and turns Off that much early, so the water
stops at 150 °F.

### The technical side

- **What it is.** Hysteresis is an On/Off controller (also called a two-point or "bang-bang" controller) with a gap between its two
  switch points. It turns On at Setpoint + Offset (150 + (−1) = 149 °F) and Off at the Setpoint (150 °F). The 1 °F gap is the
  **hysteresis band**. When Cooling, the Offset is (+): +1 turns On at 151 °F and Off at 150 °F.
- **Why the gap.** With no gap, the element would switch every time the probe reading moved by one small step. A DS18B20 probe
  reads in 0.0625 °C steps (0.11 °F), so the element would turn on and off many times a minute. This is called chattering, and it
  wears out relays and contactors. The band stops it.
- **Why it overshoots.** When the element turns Off, its metal sheath is still hotter than the water, and that heat keeps flowing
  in. Heat also takes time to travel from the element to the probe. So the water rises past the Setpoint after Off. This is called
  thermal lag or dead time.
- **What Predictive does.** Skynet measures how far the water rises after each Off (the coast), and moves both switch points down by
  that much. The shift is never more than half the size of the Offset (0.5 °F for −1). The gap stays the same, so the element does
  not switch more often. That makes it safe for a compressor.
- **How often it cycles.** Each cycle takes about the time to heat the water through the band. Water needs 1 BTU per pound per °F.
  For example, 15 gallons is about 125 lb, so 1 °F takes 125 BTU, or about 37 watt-hours. A 5500 W element supplies that in about
  24 seconds, plus whatever the vessel loses to the air. A wider band means longer, fewer cycles.
- **Why the Hardware Controller ranges.** An Optical SSR (solid state relay) has no moving parts and switches when the AC wave
  crosses zero, so it can switch often: −0.5 to −3 °F. A contactor or mechanical relay is rated for only so many closings, and each
  close makes a small arc. That is why it needs a wider band (−1 to −5 °F) and at least a 10 second Delay (Rule 6.29).

⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.

## Which method and which wiring?

### How Skynet sends the power

- **Direct** and **Hysteresis** are only full On or Off. Any Port does them the same way.
- **Duty Cycle** is On for its % of each cycle, a cycle seconds long, so a plain Port does it.
- **PWM**, **PID**, **Deadband** and **Precise** work with a %: PWM uses the % you or a Process set, the others work it out from the
  probe. **The Hardware Controller and the Port decide how that % goes out:**
  - **Hardware Controller DAC / 0-10 V on a PWM Port** sends it as PWM. Wire it to a **PWM-to-0-10 V module and a 0-10 V power controller**, not straight to a zero-cross
    SSR: the board switches hundreds of times a second and a zero-cross SSR can follow only 120 a second (60 Hz), so the power comes
    out uneven.
  - **Anything else** (an Optical SSR, Contactor or Mechanical relay, on any Port, or a DAC / 0-10 V on a plain Port) turns the
    element fully On for its % of each **Output window** (a "Pseudo PID"), so an SSR on a PWM Port is safe. With an SSR this is the right
    match. It switches On and Off many times a minute, so it **quickly wears out any mechanical switching device**: a mechanical
    relay, a relay module with mechanical relays (the common Arduino relay boards), a contactor, a motorized or mechanical timer
    switch. Use a **Solid State Relay (SSR)**.

### Which wiring

| Wired to | Port | Good methods | Note |
|---|---|---|---|
| **Zero-cross SSR** (solid state relay) | Any (Hardware Controller Optical SSR) | All of them | The usual choice. On a PWM Port it still gets the Pseudo PID, never fast PWM. |
| **Contactor** or mechanical relay (they click) | Plain | Direct, Hysteresis (or a long cycle time) | Wears out if switched often. |
| **0-10 V power controller** (through a PWM-to-0-10 V module) | PWM, Hardware Controller DAC / 0-10 V | PWM, PID, Deadband, Precise | Smooth power from 0 to 100 %. Costs more, runs hotter, makes electrical noise. |

### Where it makes a difference

- **A kettle or HLT:** water takes minutes to change a degree, so a zero-cross SSR on a plain Port holds it as well as smooth power.
- **A RIMS tube:** little water moves fast past the element, so smooth power (0-10 V) means less pulsing and less scorching.
- **A still's column or a water bath held to 0.1 degree:** use **Precise**, a fine probe (a PT100) and smooth power.

### PID or Precise

**The method matters more than the wiring.** Hysteresis overshoots: it heats at full power up to the Setpoint and the element keeps
heating a little after. PID and Precise ease off as they get close.

**Precise is a PID with extras.** It uses the same Kp, Ki and Kd, so it still needs tuning: bad numbers make Precise bad too. With
the same numbers it usually does better than PID: less overshoot after a warm-up (its I part does not pile up), a calmer output when
the probe reading jumps around (it smooths the reading), and exact power on a plain Port (time left over carries to the next window).
See Precise heating.

**Auto-tune (planned, not in the Panel yet):** one button for PID and Precise. With water over the element, Skynet will turn it fully
On and Off around the Setpoint for a few swings, measure how long and how big each swing is, and work out Kp, Ki and Kd; you then
see the new numbers next to the old ones and pick Use or Keep old.

## Its main method and the other methods allowed

When you build it (and later in its Properties), the **Heating method** part has these rows:

- **Current Method**: the method it is in. The list holds only the methods in use (see Use Method below). The dialog opens on the one
  it is in now. Beside it, **Short Label** switches its balloons to short names (DO, DutyC, HYS ...). The red **⬢** at the end of
  the line opens the **Current Method's own Settings** (for example Hysteresis Settings).
- **On / Off**: on the same line, a small picture of the Element. One click turns it On or Off at once, like one click on it on
  the Tab. On / Off is the Element itself; **Direct** is a method (simply On or Off), so a Direct Element that is On heats at 100 %.
- **Method Settings**: a **⬢** button for each method (Direct, PWM, Duty Cycle, Hysteresis, PID, Deadband, Precise), with **✔ Used** or
  **Not used** under it. **Each method has its own settings dialog**: click its ⬢ to open it. See [Each method's settings](#each-method-s-settings).
- **Control Method**: a balloon for each method in use, the Current Method **red**, the others **yellow**. These are the same
  balloons as under the Element on its Tab, and they work together: **click Duty Cycle here or on the Tab** and Duty Cycle becomes the
  Current Method in both places, red, and the one before turns yellow.

An Element **built into a Vessel Device or RIMS tube** works the same way: open its Properties (double-click it, or its ⚙) for
its Heating method and the other methods allowed. Older Schemas whose built in Element was a separate Hysteresis or PID Device
are changed to a Heating Element when they load, keeping its name and settings.

## Each method's settings

Each method keeps its own settings, so you can set up the next method before you switch to it. Example: the HLT element is in
Hysteresis. To boil in Duty Cycle, click **⬢ Duty Cycle**, switch **Use Method** On, set the **Duty cycle %** and click **💾 Keep**.
Then **💾 Save** the Properties. Now Duty Cycle is in the Current Method list, it has a balloon, and a Process may switch to it.

Its dialog has its title, **✖ Cancel** and **💾 Keep** frozen at the top while the rest scrolls (no buttons at the bottom). Keep puts
the settings in the Properties; they are saved when you Save the Properties.

- **Use Method** (a switch, at the top): **On** lets the method be picked: in the Current Method list, by its balloon here and on the
  Tab, by a Method Clone and by a Process. **Off**: it can't be picked, and **all its other settings are hidden** (they are kept for
  later). **Direct** and the **Current Method** are always On (greyed). When you pick a new Current Method, the one before stays in use.
- **Direct**: nothing to set; it is simply full On or Off.
- **PWM**: **Power %** and **Output window (s)** (used only on a plain Port).
- **Duty Cycle**: **Duty cycle %** and **Cycle time (ms)**.
- **Hysteresis**: the **Temperature Probe** and its **Setpoint** on one line. **Direction** is Heating, with the **Offset (-)** beside
  it (-1 turns it on 1 degree below the Setpoint), picked from a list (every half degree its Hardware Controller allows).
  **Predictive** has the **Delay** beside it. A small drawing beside each shows the temperature (red) going between the Setpoint (blue)
  and the Offset (yellow).
- **PID**, **Deadband** and **Precise**: the **Temperature Probe** and its **Setpoint**, then their own numbers (Kp, Ki, Kd, Max
  output ...) and **Reversed** (cooling). Precise also says whether its probe can see 0.1 degree. A note says whether its Port is a PWM
  Port or a plain Port (see [Adding one: pick its method](#adding-one-pick-its-method)).

The **Temperature Probe** and the **Setpoint** are shared: set them in one method's dialog and the others use the same ones.

Picking a method, or switching its Use Method On, **never turns the Element On** (Rule 6.19).

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

**Show or hide the method buttons.** The method buttons start **hidden**, so the Tab stays clean. A strip where the Element goes in,
from its **end plate out past the Vessel wall** (beside the picture of an Element on its own), shows them with **one click** and hides them
with the next. It works with any Vessel picture. Each screen remembers its own pick, and nothing turns On or Off.

**A display that does not jump.** A PID's output always shows two digits (05 %, 45 %, then 100 %), and idle, HEAT and COOL take
the same room, so the SV box beside them never moves.

## Ctrl + Click for a method's Settings

On a running Tab (not Edit layout), **Ctrl + Click a method button** (**⌘ + Click** on a Mac, where Ctrl + Click is the right-click and
opens Help) to open that method's Settings for that Element, for example **HLT Heater: Duty Cycle Settings**. Ctrl + Click the
**Element's picture** (on its own, on its Vessel Device, or a Picture Widget that follows it) to open the Settings of the method it is in
now; Ctrl + Click a **Method Clone** for its own method.

- **Nothing turns On or Off, and the method does not change.** A plain click still acts at once.
- It is the same dialog as the method's **⬢** in the Properties. **💾 Save** saves it at once. The Element stays On or Off in the
  same method; a new Offset, Delay or Kp works at once, and a new Setpoint is sent at once too.
- **Admins only.** Other accounts get a short note.
- Everyday changes stay one click: the **SetPoint** pop-up from the Temperature Probe, and the Heating Element pop-up (**Heating
  method…**) for the method and its Duty cycle %. Every other Property is changed in **Edit layout**, where Ctrl + Click opens Properties
  the same as a double-click.

Example: the HLT Heater is heating in **PID**. Ctrl + Click **Duty Cycle** under it: the **Duty Cycle Settings** open, and the HLT
Heater keeps heating in PID.

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
MB_25_DO@H_Element_HLT_BH.HYS
MB_25_DO@H_Element_HLT_BH.DutyC
```

The codes are **DO** (Direct), **PWM**, **DutyC** (Duty Cycle), **HYS** (Hysteresis), **PID**, **DeadB** (Deadband) and **PREC** (Precise). The Process editor offers them after the name.

**Only methods in use:** a Process may only switch to a method whose **Use Method** is On (Direct and the Current Method always are).
The Process editor offers only those, and its check shows a plain error before you brew, for example: *hE_HLT_1 may only use Direct,
Duty Cycle, Hysteresis: the Use Method of PID is Off*. If such a line still runs, the Brain refuses it with the same kind of message.

## Its name

A Heating Element's Device Type is **DO@H_Element**, so its name reads like `MB_25_DO@H_Element_HLT_BH` (Interface, Port, DO@H_Element, Label, Tab), whatever method it is using.
It is wired straight to its port, going to an SSR or contactor, or to a DAC. Elements named before keep DO in their names.

- `.method` is **Direct**, **PWM**, **Duty Cycle**, **Hysteresis**, **PID**, **Deadband** or **Precise** (the short codes DO, PWM, DutyC, HYS, PID, DeadB and PREC
  work too). Reading it gives the word, for example `if hE_HLT_1.method == "PID"`.
- `hE_HLT_1 = on` turns it **On** in its method; `hE_HLT_1 = off` turns it **Off**. Every method works this way, Hysteresis and PID too.
- **Picking a method never turns it On**: a method spot, the pop-up's method buttons or a Process only change the method. Turning
  it On or Off is its picture, a Clone, or a Duty cycle % (Skynet Rule 6.19).
- Changing the method **while it is ON** goes on at once in the new method, **except** to **Direct**: that turns it OFF first, so
  an Element never jumps from 40 % to full power by itself. Turn it ON again for full power.
- Every method keeps its own settings: `.power` (PWM, for example `hE_HLT_1.power = 60`); `.dutycycle`, `.interval` (Duty Cycle); `.setpoint`, `.onoffset` (with its minus: `-1`), `.ondelay` (Hysteresis);
  `.setpoint`, `.kp`, `.ki`, `.kd`, `.maxoutput`, `.maxintegral`, `.calctime`, `.outtime` (PID); `.setpoint`, `.deadbandoffset`,
  `.innerbandoffset`, `.initialoutput`, `.innerbanddrive`, `.outerbanddrive`, `.maxoutput`, `.calctime`, `.outtime` (Deadband); the PID's own plus `.holdoutput`, `.smoothing` (Precise).
  The same names the old separate Duty Cycle, Hysteresis, PID and Deadband Devices had.
- **`.setpoint` is the Setpoint** (the temperature it holds), read or set. Dialogs call it **Setpoint** (Skynet Rule 6.19).
- `.value` is the output % a PID, Deadband or Precise works out (in PWM it is the Power %) (`.pv` is the smoothed reading Precise holds). `.output` is its pin right now (read only).
- **`.method` is the word for every Device with more than one method of control** (today the Heating Element). In the Process
  editor, type `hE_HLT_1.method =` and the list shows its methods to pick from, in quotes. A Device with only one way of control
  has no `.method`.

## In its Properties

Under **Heating method**: the method it **starts with** and **Method Settings**, one ⬢ dialog for each method with its
**Use Method** switch, the **Temperature Probe** it reads (Hysteresis, PID, Deadband and Precise) and that method's settings
([Each method's settings](#each-method-s-settings)). A PID, Deadband or Precise can also be **Reversed** (cooling). The Hardware Controller and the Port decide PWM or the plain-Port way. A Heating Element built into a Vessel Device, RIMS tube or Integrated kettle has the
same settings.

## One Interface Port, one Device

Rule 6.1: in Skynet **each port on an Interface has only one Device**. The Available
Ports list never offers a port that is in use, and a Device can't be saved on one. To control a heater another way, change its
heating method instead of adding a second Device.

Older Skynet Schemas that already have two Devices on one port keep working as before (the last one turned on wins), and those
two can still be saved; you just can't make new ones.

See also: [Heat Hysteresis: what switches the element](181-heat-hysteresis-switched-by) (Rule 6.29).

> **What decides how close it holds:** the **probe** (a DS18B20 reads to about ±0.9 °F), **where it sits**, how well the liquid is
> **mixed** and its **calibration** matter far more than how the element is switched. Get those right first.
