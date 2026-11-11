# DC pumps, pump speed and pump facts

Every Pump can say what it runs on, what it is used for, how fast it runs and its facts (Skynet Rule 18.32). Any Pump can be
turned On and Off; a DC pump on a PWM Port can also run slower (PWM speed). The list of pumps is in the
DC Brewing Pumps document (docs/DC_Brewing_Pumps.md).

## The Pump's new settings

Double-click a Pump (or open it from the Build Tab). Below the **Overlay** are:

| Setting | What it does |
|---|---|
| **Model** | Which pump this is: Topsflo TD5, March 809 DC, DDMETER HB-MP20, BrewTaurus 24 V, bayite, a solar-style 12 V pump, the Penguin glycol pumps, the Grainfather GF30 cooling pump, a small submersible, or the AC ones (March 809 and 815, Chugger, RipTide, KegLand MKII, BrewZilla Gen 4). A Skynet pump drawing picks its model by itself, and then it is greyed out. **Other** = a pump not on the list. |
| **⬢** beside Model | The **Pump Facts**: Flow, Lift (how high it pushes), Hottest Liquid and Ports. A fact the model knows is filled in and greyed out; a fact it doesn't know, and every fact of a User Defined pump, is a box to type in. **Ports** is a list: TC1.5, TC2, TC3/4, TC1/2, FPT1/2, FPT3/4, FPT1, MPT1/2, MPT3/4, MPT1, BSP1/4, BSP3/8, BSP1/2, BSP3/4, BSP1, DN8, DN10, DN15, DN20, DN25. A fitting changes a port, so it can always be picked: OakBarn Brewery's pumps came with FPT1/2 or FPT1 ports and each was made TC1.5 by adding a Tri-Clamp fitting. Only a Tri-Clamp port the model is known to have is greyed out. |
| **Power** | AC 120 V or AC 240 V (house power), DC 12 V or DC 24 V (from a power brick). A Skynet pump drawing shows its model's, for example AC 120 V (house power). Its Hover Help starts with the electrical warning below. Known from the model, it is greyed out. |
| **Use** | Greyed out: **Hot & Cool**, or Cold (glycol, ice water) for a glycol pump. It comes from the model. |
| **Speed Control** | **On/Off only**, or **PWM speed**. Shown for PWM pumps only (a DC pump, or one set to PWM); an AC pump is On/Off only. |
| **Speed %** | With PWM speed: how fast it runs while it is On, 0 to 100 (empty = 100). |

The Add box has them too, so a new pump can be set to **PWM speed** before its Port is picked: then only PWM Ports are listed
(a Mega: D2-D13 and D44-D46; a Raspberry Pi: any pin). If a PWM pump is on a Port that cannot do true PWM, its Properties say so,
and the pump only runs full speed or off.

## Using it

- **One click** on the pump still turns it On or Off (Skynet Rule 2.33). A PWM pump runs at its **Speed %** while it is On.
- **Hold the mouse on a pump** to see its facts: model, power, use, speed, flow, lift, hottest liquid, ports.
- A **Process** can change the speed: `Pump_Name.speed = 60` (and read it: `if Pump_Name.speed < 50`).

## Wiring

A pump is never wired straight to a board pin. The pin switches a **relay** (On/Off) or a **switch module (MOSFET)** (On/Off or
PWM speed) that carries the pump's own 12 V or 24 V. An AC pump needs a relay or an SSR (solid state relay) rated for it.
A brushless DC pump with its own driver (most of the newer ones) may not like PWM: try it at a slow speed first, and go back to
On/Off only if it stutters or hums.

**⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed
Electrician.**
