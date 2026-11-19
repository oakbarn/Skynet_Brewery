# Step by Step: Wire 1-Wire Probes (DS18B20)

**DS18B20** probes talk on **1-Wire** (OneWire): many probes share the same three wires and one Port, each with its own number. The **HLT**, **Mash** and **Kettle** probes of the 3 Vessel sample are DS18B20 probes. On a Mega the 1-Wire Port is **D40**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- The **1-Wire Port** (Mega: **D40**), shared by every DS18B20.
- One **4.7k ohm resistor** for the whole set (not one per probe).
- One or more **waterproof DS18B20 probes** (3 wires).
- A screw terminal block or a small board helps join the wires.

![Wiring DS18B20 probes on 1-Wire](help_pictures/Step_Wire_OneWire_01_Wiring.svg)

## Step 1. Run three wires

Run three wires from the Mega: **5V**, **D40** and **GND**. Every probe joins these same three.

## Step 2. The 4.7k ohm resistor

Wire the **4.7k ohm resistor** between **D40** and **5V**, once, near the Mega.

## Step 3. Join each probe

Wire each probe's **red** to 5V, **yellow** (or white) to D40, and **black** to GND. Some probes use other colors: check yours.

## Step 4. Add each probe in Skynet

Add a probe (Select Device Type: **Probe (temperature)** > **DS18B20 (OneWire, waterproof probe)**) for each one, as in [Step by Step: Add a Device](207-step-by-step-add-a-device). Skynet finds each probe by its own number.

## Step 5. Tell them apart

Warm one probe in your hand (or put it in warm water) and see which reading goes up. Label that probe, for example **HLT**. Do the next one.

## Step 6. Check it

In ice water each probe should read about 32 °F (0 °C). A probe that reads 185 °F (85 °C) or -196 °F (-127 °C) is not wired right: check its three wires and the resistor.

## Other boards

- **A 3.3 V board:** use **3.3V** in place of 5V for the probes and the resistor.
- Each board's 1-Wire Port is in [Skynet Boards](206-skynet-boards) (a Pi uses GPIO 4).
- **Arduino Opta:** keep DS18B20 probes on a Mega; see [Skynet Boards](206-skynet-boards).

## The technical side

- Long runs (over about 30 m in all) or many probes may need a stronger pull-up (a 2.2k ohm resistor) or shielded cable.
- Skynet sets each probe to its finest steps (0.0625 °C, about 0.11 °F).
- On the Mega program (`Mega_BrewPanel.ino`), `ONEWIRE_PIN` is 40.
