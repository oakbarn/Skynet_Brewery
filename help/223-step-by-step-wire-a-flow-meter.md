# Step by Step: Wire a Flow Meter

A **hall flow meter** sends a pulse for each bit of liquid that passes. The board counts the pulses on a **Counter Port**. This guide uses **D18**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Counter Port** (Mega: D2, D3, D18-D21, up to 6). This guide uses **D18** (see [Counter Port](13-glossary#counter-port)).
- One **hall flow meter**: stainless and food grade for hot wort; a plastic YF-S201 for cold water only (see [Flow Meter](13-glossary#flow-meter)).

![Wiring: Wire a Flow Meter](help_pictures/Step_Wire_FlowMeter_01_Wiring.svg)

## Step 1. Wire it

Wire the meter's **red** to the Mega's **5V**, **black** to **GND**, and **yellow** (the pulse) to **D18**. Check your meter's colors.

## Step 2. Fit it

Fit it with the arrow on its body pointing the way the liquid flows.

## Step 3. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Sensors (pressure, level, pH, flow)** > **Flow meter (hall sensor, e.g. YF-S201)** on Port **D18**, and type its pulses per liter (on its data sheet).

## Step 4. Check it

Run a measured 10 liters (or 2 gallons) through it and compare; adjust its pulses per liter until it matches.

## Other boards

- **A 3.3 V board:** most meters send 5 V pulses. Power it from 5 V and put a voltage divider (or a level shifter) on the pulse wire, or use a meter that runs on 3.3 V.
- **Arduino Opta:** its inputs count only slow pulses; see [Skynet Boards](206-skynet-boards).

## The technical side

- The board's own pull-up is On for a Counter Port, so no resistor is needed on a Mega.
- D20 and D21 are also the I2C Ports: an ADS1115 takes them.
- On the Mega program (`Mega_BrewPanel.ino`), list the Port in `FLOW_PINS` (for example `{18}`), then upload it again.
