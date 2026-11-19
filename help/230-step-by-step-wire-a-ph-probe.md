# Step by Step: Wire a pH Probe

A **pH probe** gives a tiny signal that a **pH board** (amplifier) turns into 0-5 V for an **Analog Port**. This guide uses **A5**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Analog Port** (this guide: **A5**), or an ADS1115 channel for finer readings.
- One **pH board** (0-5 V out).
- One **pH probe** (BNC plug).
- pH 7 and pH 4 buffer solutions to calibrate.

![Wiring: Wire a pH Probe](help_pictures/Step_Wire_pH_01_Wiring.svg)

## Step 1. Wire the board

Wire the board's **V+** to the Mega's **5V**, **G** to **GND**, and **Po** (the pH out) to **A5**.

## Step 2. The probe

Screw the probe's BNC plug onto the board.

## Step 3. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Sensors (pressure, level, pH, flow)** > **pH probe board (two-point calibration)** on Port **A5**.

## Step 4. Check it

Calibrate with **pH 7** then **pH 4** buffer (two-point), rinsing the probe between them. Then a third buffer should read close.

## Other boards

- **A 3.3 V board:** its 5 V output can be too much: use an ADS1115 or a 3.3 V pH board.
- **Arduino Opta:** use a pH transmitter with a 0-10 V output.

## The technical side

- Read pH on a cooled sample: a hot probe reads wrong and wears out fast.
- Keep the probe wet in its storage liquid.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `ANALOG_PINS`.
