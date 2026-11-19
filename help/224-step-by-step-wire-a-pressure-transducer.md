# Step by Step: Wire a Pressure Transducer

A **pressure transducer** reads pressure, or the depth of liquid by the pressure at the bottom of a vessel. The 5 V kind gives **0.5-4.5 V** to an **Analog Port**. This guide uses **A2**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Analog Port** (this guide: **A2**).
- One **5 V pressure transducer, 0.5-4.5 V out**, stainless, rated for the liquid's temperature (see [Pressure Transducer](13-glossary#pressure-transducer)).

![Wiring: Wire a Pressure Transducer](help_pictures/Step_Wire_Pressure_01_Wiring.svg)

## Step 1. Wire it

Wire its **red** to the Mega's **5V**, **black** to **GND**, and its **signal** wire (often yellow, green or white: check its label) to **A2**.

## Step 2. Fit it

Fit it low on the vessel (or in a tee below it), where it always sits under the liquid.

## Step 3. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Sensors (pressure, level, pH, flow)** > **Pressure transducer 0.5-4.5 V (5 V hobby type)** on Port **A2**, and type its range (for example 0-5 psi).

## Step 4. Check it

Empty, it should read about 0. Add a known depth of water and compare.

## Other boards

- **A 3.3 V board:** its 4.5 V is too much for the Port: use a voltage divider, or an ADS1115 ([Step by Step: Wire an ADS1115](227-step-by-step-wire-an-ads1115)).
- **Arduino Opta:** use a 0-10 V transducer straight on I1-I8.

## The technical side

- An ADS1115 reads it much more finely than a 10-bit Analog Port.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `ANALOG_PINS`.
