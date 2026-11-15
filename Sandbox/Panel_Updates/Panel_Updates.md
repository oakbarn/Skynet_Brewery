# Panel Updates Sandbox: general Skynet Panel updates, parked for later

Kept here until the **Blichmann RipTide pump dialogs and their Help are done** (OakBarn Brewery, 2026-11-15: "Create a sandbox for
General SkyNet that will be used AFTER Blickmann Dialogs and Help are done. Call Panel Updates"). Rule 14.4.

The Blichmann RipTide pump dialogs are the model for every Device dialog, so they are finished first. Any general Skynet Panel update
or idea OakBarn Brewery gives in the meantime is written here, with where it goes, and is **not built yet**. When the Blichmann work is
done, OakBarn Brewery picks which entries to start, and each one is checked against the Rules (and both programs) before it is built.
An entry that is built is moved to the **Done** table with its PR.

Not for the Importer: Importer-only notes still go to the Importer Sandbox, `Sandbox/Importer/Importer_Notes.md` (Rule 11.3).

The panel does not use this folder, and it is left out of the release zip and the installer.

## Waiting

| # | Date | Where it goes | The update | Notes from Claude (what is there now, questions) | Asked in |
|---|---|---|---|---|---|
| 1 | 2026-11-15 | Edit layout bar: the **PWM**, **Valves** and **Heating Element** dropdowns (Select Device Type > PWM / Analog out, Valves, Heating Element) | OakBarn Brewery's words (his screenshot of the PWM dropdown): "A Heater or Valve could also be PWM so add those that can be on this ddlb as well as the valve DDLB and the Heater DDLB". The PWM dropdown shows only: PWM output (MOSFET module, pump speed, element %), Analog output 0-10 V (PWM-to-0-10V module, VFD speed), Analog output 4-20 mA (PWM-to-4-20mA module). | **What is there now (2026-11-15):** the **Heating Element** dropdown already has "Heating element power 0-100 % (PWM output)" (the PWM@H_Element kind); the **Pumps** dropdown already has the PWM and 0-10 V pump speed rows. The **Valves** dropdown has no PWM row, only the User Defined Proportional Valve (analog output). So the work is: the PWM dropdown gets the Heater PWM row and the Valve PWM / AO rows (PWM@Valve_L / _H, AO@Valve_L / _H, Rule 3.1 Types); the Valves dropdown gets the Valve PWM / AO rows. **To check before building:** (a) Rule 2.38: dropdown choices short and plain with unique first letters, so the long rows above may need shorter words; (b) which valves really take PWM (a proportional valve, through a PWM-to-0-10 V module) and what L / H (low / high temperature) means for each row; (c) the same rows in the Pump/Valve drill-down Add boxes so both places match. | project chat, 2026-11-15 |
| 2 | 2026-11-15 | The **Heating Element** method dropdown (Direct, Duty Cycle, Hysteresis, PID, Deadband, Precise; Rule 6.19, Help 150) and Rule 6.17 | OakBarn Brewery's words: "Is Deadband as a stand alone heating element of any value. Should Deadband be reserved for a Dead Band Device?" then "Ok. I think regardless of how BruControl does it, that would be an Import question to fix to the Skynet way. Upgrade Panel Deadband not a choice in the DDLB for Heaters". So: **Deadband is taken off the Heating Element's method choices**; Deadband stays only as its own Deadband Device (Rule 6.17). | **What Skynet's Deadband really does (lib/control.js, 2026-11-15):** it is **not** the same as Hysteresis. Hysteresis turns the element fully On or Off around the Setpoint. Deadband gives the element a **power %** (0-100) and, every Calc Time, steps that % up or down toward the Setpoint (Inner Band Drive close in, Outer Band Drive further out) and leaves it alone inside ± Deadband Offset. So on a lone heater it is closer to a slow **PID** than to Hysteresis, and PID and Precise already cover that need. It works one way only (heat, or cool with Reversed); it is not a heat-and-cool control (that is the Fermentor Control, Rule 6.30, which uses Hysteresis). **To check before building:** (a) Old Ways Policy (before Public Production): a heater saved with Deadband changes on load to which method, PID (closest) or Hysteresis? (b) whether the Deadband Device (Rule 6.17) itself stays in Select Device Type > Heating Element > control outputs, or moves; (c) open PR #416 (one settings dialog per heating method) has a Deadband dialog, so this waits until #416 is merged or closed; (d) Help 150, Rule 6.19 and the method list's unique first letters (Rule 2.38: Direct / Duty Cycle / Deadband clash, Deadband going helps). | project chat, 2026-11-15 |

## Done

| # | Built in | Date |
|---|---|---|
