# DigiBoil and Brewzilla, set by hand

A **DigiBoil** and a **65 L Brewzilla** heat by themselves (the Brewzilla pumps too). Skynet can't switch any of it, so Skynet tells you what to set and waits for you (Skynet Rule 5.39).

Put one on a Tab from **☰ Menu > Vessel Templates**: **Kettle_DigiBoil** or **Kettle_Brewzilla_65L**. The OakBarn Schema Template has both.

## What each one has

| | DigiBoil | 65 L Brewzilla |
|---|---|---|
| Switches | Power, Heater | Pump (bottom drain), Heater 1, Heater 2, Heater 3 |
| Screen | Temperature set point and display | Temperature set point and display, an On/Off button and a Run spot |
| Manual valves | the Spigot (small, silver, BSP threads) on its outlet | the Spigot on its outlet, and the Pump out valve on the out side of its pump |

Its switches and screen are its **Controls**, the box beside it (for example **DigiBoil_Controls**). Its valves are built into its IPs (for example **DigiBoil_Spigot**). A closed valve stops the flow out of that IP.

## In a Process

| Line | What happens |
|---|---|
| `DigiBoil_Controls.setpoint = 152` | a pop-up: "Set the DigiBoil temperature set point to 152 °F (that is 66.7 °C)" |
| `DigiBoil_Controls.power = on` | a pop-up: "Turn the DigiBoil Power switch ON" |
| `DigiBoil_Controls.heat = on` | the Heater switch (on the Brewzilla, Heater 1; `.heat2` and `.heat3` are Heater 2 and 3) |
| `Brewzilla_Controls.pump = on` | the Brewzilla Pump switch |
| `Brewzilla_Controls.power = on` | the On/Off button on the Brewzilla screen |
| `Brewzilla_Controls.run = on` | "Press Run on the Brewzilla screen" |
| `open_valve DigiBoil_Spigot` | "OPEN DigiBoil Spigot by hand" |
| `close_valve Brewzilla_Pump_Out` | "CLOSE Brewzilla Pump out valve by hand" |

The Process waits until you press **✔ Done**. If it is already set that way, there is no pop-up.

`open_valve` and `close_valve` work for **any** valve: a Manual one asks you and waits, a motorized one is switched at once.

## °F and °C

Both screens go back to **°C** every time they are turned off. When your panel works in °F, the pop-up gives the set point in °C as well, so you can set it straight away, or switch the screen to °F first.

## By hand, with no Process

Click its Controls (not in Edit layout) to say what you did: a switch, a valve, a new set point, or what its screen reads. On the Brewzilla, the **▶ Run** spot on its Controls shows it is running.
