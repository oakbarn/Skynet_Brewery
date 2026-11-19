# Step by Step: Wire Switches and Float Switches

A **switch**, **float switch**, **push button**, **flow switch**, **leak sensor** or **lid interlock** needs nothing but two wires: one to the Port, one to **GND**. The board's own pull-up holds the Port up until the switch closes. This guide uses **D32**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Port** (this guide: **D32**).
- The switch (low voltage only) (see [Float Switch](13-glossary#float-switch)).

![Wiring: Wire Switches and Float Switches](help_pictures/Step_Wire_Switch_01_Wiring.svg)

## Step 1. Wire it

Wire one of the switch's wires to **D32** and the other to the Mega's **GND**. Either way round.

## Step 2. A float switch

Fit it so it closes at the level you want to know (most can be flipped over to close on rising or on falling).

## Step 3. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Inputs (switches, buttons)** > the row that fits: **Switch (on while closed)**, **Push button ...**, **Toggle button ...** or **Latching input ...**; a float is **Float / level switch**, on Port **D32**.

A **DIN push button** can also do one thing when pressed (run a Process, Advance, or cancel all alarms): see [DIN Button: On Press](235-din-button-on-press).

## Step 4. Check it

Close the switch: Skynet shows ON. Open it: OFF. Backwards? Set **Invert** On in its Properties.

## Other boards

- **A 3.3 V board:** the same; never wire 5 V to a 3.3 V Port.
- **Arduino Opta:** its inputs want 24 V: wire the switch between 24 V and the input.

## The technical side

- Closed = ON: the Mega reads the Port LOW and Skynet shows ON.
- Never wire a switch to AC.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `INPUT_PINS` (D30-D33 are there to start).
