# Step by Step: Wire a 10K NTC Probe

A **10K NTC thermistor** is the cheapest temperature probe: its resistance changes with heat. The board reads it on an **Analog Port** with one extra resistor. This guide wires one to Port **A0**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Analog Port** (Mega: A0-A15). This guide uses **A0**.
- One **10K NTC Probe** (2 wires). Its **Beta** value is on its data sheet (often 3950, or 3977 for the BCS-462 type).
- One **10k ohm resistor**: the same size as the probe (a 50K probe needs a 50k ohm resistor).

![Wiring a 10K NTC probe](help_pictures/Step_Wire_NTC_01_Wiring.svg)

## Step 1. The resistor to 5V

Wire one leg of the **10k ohm resistor** to the Mega's **5V**.

## Step 2. The resistor to A0

Wire the other leg of the resistor to Port **A0**.

## Step 3. The probe to A0

Wire one of the probe's two wires to **A0** too (where the resistor joins it). A thermistor has no + or -: either wire.

## Step 4. The probe to GND

Wire the probe's other wire to the Mega's **GND**.

## Step 5. Add the Device in Skynet

Add a probe (Select Device Type: **Probe (temperature)**): pick **NTC thermistor 10K, Beta 3950 (analog pin)**, or the **BCS-462 type, Beta 3977** row if that is your probe, on Port **A0**, as in [Step by Step: Add a Device](207-step-by-step-add-a-device). In its Properties, **Series resistor** is 10000 and **Wiring** is **toGround** (the probe goes to GND, as in this guide).

## Step 6. Check it

Hold the probe in ice water: it should read about 32 °F (0 °C). Then in boiling water: about 212 °F (100 °C) at sea level. If it is a little off, set its Calibration in Properties. If it reads very wrong, check the Beta value and the resistor's size.

## Other boards

- **A 3.3 V board:** wire the resistor to **3.3V**, never 5V (Rule 6.35).
- **Arduino Opta:** a 10K NTC needs a **0-10 V transmitter** on the Opta; see [Skynet Boards](206-skynet-boards).

## The technical side

- The probe and the resistor share the 5 V, so the board reads their ratio; a small change in the 5 V does not change the reading.
- Skynet smooths a thermistor's reading (Smoothing 25 % to start), because a 10-bit Analog Port makes it jumpy.
- Long probe wires add a little resistance: keep them short, or calibrate.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `ANALOG_PINS` (A0 is there to start).
