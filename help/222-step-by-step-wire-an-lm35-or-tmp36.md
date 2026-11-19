# Step by Step: Wire an LM35 or TMP36

An **LM35** or **TMP36** is a small 3-leg sensor for **air** temperature (in a control box or a room). It needs only 5V, GND and an **Analog Port**. This guide uses **A1**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Analog Port** (this guide: **A1**).
- One **LM35** or **TMP36**.

![Wiring: Wire an LM35 or TMP36](help_pictures/Step_Wire_LM35_01_Wiring.svg)

## Step 1. Find the legs

Look at its data sheet: with the flat face toward you, the legs are usually **+Vs**, **Vout**, **GND** from left to right. Check yours: a reversed sensor gets hot.

## Step 2. Wire it

Wire **+Vs** to the Mega's **5V**, **Vout** to **A1**, and **GND** to **GND**.

## Step 3. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Probe (temperature)** > **LM35 analog temperature sensor** or **TMP36 analog temperature sensor**, on Port **A1**.

## Step 4. Check it

It should read the room's temperature; a warm finger on it raises it.

## Other boards

- **A 3.3 V board:** a TMP36 runs on 3.3 V; an LM35 needs 4 V or more, so power it from 5 V (its output stays under 1.5 V).
- **Arduino Opta:** only a 5 V supply for the sensor; its output goes straight to I1-I8.

## The technical side

- A 10-bit Analog Port sees about 0.5 °C steps with these sensors: fine for air, too coarse for mash.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `ANALOG_PINS`.
