# Fermentor Control: heat and cool with Hysteresis

A **Fermentor Control** holds the beer at one **Setpoint** by heating it and cooling it (Skynet Rule 6.30). It is built into a
Fermentor Vessel Device with three Devices:

1. **Heat:** a heat mat, a heat wrap (belt), a ceramic heat emitter or a lamp: a Heating Element, a Light or a plain output.
2. **Cooling:** a freezer or fridge on a relay, a glycol pump, or a glycol Motorized valve.
3. **Temperature Probe:** the one that reads the beer (in a thermowell, or taped to the side under some insulation), not the air.

⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed
Electrician.

## How it works

- **Heat comes on** when the beer is the **Heat On offset** below the Setpoint. **Cooling comes on** when it is the **Cool On
  offset** above it. Both stop at the Setpoint, or a little before it when Predictive Hysteresis is on (Help 168).
- **Heat and Cooling are never On together.** One must have been Off for the **Changeover wait** (5 minutes to start) before the
  other may start, so they never fight. A small dip after cooling does not start the heat right away. (Just after
  the Fermentor Control is turned On nothing has run yet, so each side waits only its own On delay.)
- **Short-cycle protection on both sides.** A freezer must not start and stop often, and a lamp should not flash either.
  - **On delay:** the shortest time Off before it may start again (Heat 1 minute, Cool 5 minutes to start). When the Fermentor
    Control is turned On, each side waits its On delay before its first start.
  - **Shortest run:** once on, it stays on at least this long (Heat 1 minute, Cool 2 minutes to start).
- **Fermentation makes heat** at the start and needs heat at the end, so Heat and Cooling are equal.
- A **Heating Element** used as the Heat is run in **Direct** (the Fermentor Control turns it on and off), and its offset and On
  delay are kept to what its **Hardware Controller** allows (Help 181).
- **Mode:** **Heat & Cool**, **Heat only** or **Cool only**.
- **No reading** from the probe: both are turned Off until it reads again.

## Building one

**Vessel > 🔨 Build a Vessel Device**, question **14. Fermentor Control**: None, Heat & Cool, Heat only or Cool only. A Thermowell /
Probe must be chosen too. After 🔨 Build, the Vessel Builder panel has a row for the **Heat** and one for the **Cooling**: pick one
you have, or **➕ Add new** (Heat mat, Heat wrap, Ceramic heat emitter, a Heating Element or a Light; Freezer or fridge, Glycol pump,
Glycol valve). They are built into the vessel without a spot of their own. The Fermentor Control is then made beside the vessel,
named after the vessel's Label.

## Using it

- **One click** on it turns it On or Off. It shows what it is doing (Heating, Cooling, Waiting to heat, Waiting to cool, Idle,
  No reading) and the Setpoint.
- **One click on its probe** opens the Setpoint.
- **Properties** (double-click in Edit layout): the Probe, Heat, Cooling, Mode, Setpoint, both offsets, Changeover wait, the On
  delays and Shortest runs, and Predictive.

## In a Process

The Fermentor Control is used by its own name. Its Heat and Cooling are built into the vessel, so a Process calls them by the vessel's name and their own (Help 180), for example `FV1.MB_30_Light_Lamp_FR`. While the Fermentor Control is On it switches them itself.

| Line | What it does |
|---|---|
| `FV1 = on` / `FV1 = off` | Turns it On or Off |
| `FV1.setpoint = 66` | The Setpoint |
| `FV1.mode = "Cool only"` | Heat & Cool, Heat only or Cool only |
| `FV1.heatoffset = 1` / `FV1.cooloffset = 1` | The two offsets |
| `FV1.changeover = 300` | The Changeover wait, in seconds |
| `FV1.heatdelay`, `FV1.heatminrun`, `FV1.cooldelay`, `FV1.coolminrun` | The On delays and Shortest runs, in seconds |
| `x = FV1.doing` | What it is doing now (read only) |
