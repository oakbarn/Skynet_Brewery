# DC pumps, pump speed and pump facts

Every Pump can say what it runs on, what it is used for, how fast it runs and its facts (Skynet Rule 18.32). Any Pump can be
turned On and Off; a DC pump on a PWM Port can also run slower (PWM speed). The list of pumps is in the
DC Brewing Pumps document (docs/DC_Brewing_Pumps.md).

## The Pump's new settings

Double-click a Pump (or open it from the Build Tab). Below the **Overlay** are:

| Setting | What it does |
|---|---|
| **Model** | Which pump this is: Topsflo TD5, March 809 DC, DDMETER HB-MP20, BrewTaurus 24 V, bayite, a solar-style 12 V pump, the Penguin glycol pumps, the Grainfather GF30 cooling pump, a small submersible, or the AC ones (March 809 and 815, Chugger, RipTide, KegLand MKII, BrewZilla Gen 4). A Skynet pump drawing picks its model by itself. **Other** = a pump not on the list. |
| **⬢** beside Model | The **Pump facts**: Flow, Lift (how high it pushes), Hottest liquid and Ports. Each shows the model's fact; type your own to change it. |
| **Power** | AC 120 V or AC 240 V (house power), DC 12 V or DC 24 V (from a power brick). Empty = the model's. |
| **Use** | Hot (wort, water) or Cold (glycol, ice water). |
| **Speed control** | **On/Off only**, or **PWM speed**. An AC pump is On/Off only, so this is not shown for one. |
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
