# Step by Step: Wire a 0-10 V Sensor

A **0-10 V sensor** gives more volts than a Mega's Analog Port takes (5 V). Two equal resistors (a **voltage divider**) halve it. This guide uses **A4**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Analog Port** (this guide: **A4**).
- Two **10k ohm resistors** (1 % if you can).
- One **0-10 V sensor** and its own supply.

![Wiring: Wire a 0-10 V Sensor](help_pictures/Step_Wire_ZeroTen_01_Wiring.svg)

## Step 1. The top resistor

Wire one **10k ohm** resistor from the sensor's **OUT** to **A4**.

## Step 2. The bottom resistor

Wire the other **10k ohm** resistor from **A4** to the Mega's **GND**.

## Step 3. Join the grounds

Wire the sensor's **GND** (and its supply's -) to the Mega's **GND**.

## Step 4. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Sensors (pressure, level, pH, flow)** > **Analog input 0-10 V (with voltage divider)** on Port **A4**, with **Input divider** 2.

## Step 5. Check it

Measure the sensor's OUT and A4 with a meter: A4 should be half.

## Other boards

- **A 3.3 V board:** use 22k ohm on top and 10k ohm below (10 V = about 3.1 V), and Input divider 3.2.
- **Arduino Opta:** its inputs read 0-10 V: no divider.

## The technical side

- Never put 10 V straight on a Mega Port: it can ruin the board.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `ANALOG_PINS`.
