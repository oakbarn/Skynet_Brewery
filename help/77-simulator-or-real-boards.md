# Simulator or Real boards

One press switches the **whole panel**, every Interface at once, between the **Simulator** and the **Real boards**. It is for testing: try a whole brew day with nothing real switched, then switch back.

## Where the switch is (Admins)

- The round button beside **☰ Menu** on the Tabs bar: **🔌 Real** (green) while the real boards are used, **🧪 Simulator** (yellow stripes) in Simulator mode. Press it to switch.
- **☰ Menu > 🧪 Switch to Simulator** or **🔌 Switch to Real boards**.
- **Settings > Simulation (test mode) > Simulation mode** switch.

All three do the same. The panel asks first. Every Process stops and every output turns off before the switch, so nothing a pretend brew turned on is ever sent to a real board. A yellow striped **SIMULATION** bar shows for everyone while it is on.

An Interface whose Connection is **Simulator** (like the New_Mega_2560_1 a new Schema starts with) stays pretend even on Real boards. Change its Connection with **⚙ Change** on the Devices page once the board is wired (Help: [Interfaces](76-interfaces)).

## What the Simulator does

- **Timers** run as now, faster if you set a Speed, and **+1 min**, **Skip to next event** and **Auto skip** work as before (Help: [Simulation mode](20-simulation)).
- **Waits on a reading are pretended reached.** A Process line that waits on a reading, for example `wait "Temp_HLT" value >= 152` or a wait for the boil to start, moves on by itself after **60 clock seconds**, as if the reading got there. The Process output says so: *Simulation: the wait on line 12 is pretended reached after 60 s*.
  - The time is set in **Settings > Simulation > Pretend readings are reached ... after (clock seconds)**. At a Speed of 10×, 60 clock seconds go by in 6 real seconds.
  - **Skip to next event** and **Auto skip** count it as an event, so they jump straight to it.
  - Switch **Pretend readings are reached** off to wait for the simulator's own pretend heating instead.
  - Readings are temperatures, analog inputs (level, pressure, pH), scales and flow meters. A wait on a **button** or a **switch** is never pretended: press it as on brew day.
