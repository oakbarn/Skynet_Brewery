# Step by Step: Wire a 4-20 mA Level Transmitter

A **4-20 mA level transmitter** sends a current: 4 mA = empty, 20 mA = full. A **250 ohm resistor** turns it into 1-5 V for an **Analog Port**. This guide uses **A3**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Analog Port** (this guide: **A3**).
- One **250 ohm resistor** (1 % if you can).
- One **24 V DC power supply** for the loop.
- One **2-wire 4-20 mA level transmitter**, rated for the liquid's temperature (see [Level Transmitter](13-glossary#level-transmitter)).

![Wiring: Wire a 4-20 mA Level Transmitter](help_pictures/Step_Wire_Level_01_Wiring.svg)

## Step 1. Power the loop

Wire the supply's **+V** to the transmitter's **+**.

## Step 2. Into the Mega

Wire the transmitter's **-** to **A3**.

## Step 3. The resistor

Wire the **250 ohm resistor** from **A3** to the Mega's **GND**.

## Step 4. Join the grounds

Wire the supply's **-V** to the Mega's **GND**.

## Step 5. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Sensors (pressure, level, pH, flow)** > **Level transmitter 4-20 mA** on Port **A3**, with **Resistor across the input** 250, and type its range.

## Step 6. Check it

Empty it should read 0 (4 mA = 1 V at A3). A reading near 0 V at A3 means the loop is open: check the wires.

## Other boards

- **A 3.3 V board:** 20 mA through 250 ohm is 5 V, too much: use a 150 ohm resistor (20 mA = 3 V) and type 150.
- **Arduino Opta:** use a 0-10 V transmitter on I1-I8.

## The technical side

- 20 mA x 250 ohm = 5 V, the top of a Mega's Analog Port. A small fault can go above it; a 5.1 V Zener diode from A3 to GND protects the Port.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `ANALOG_PINS`.
