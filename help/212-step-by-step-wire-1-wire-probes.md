# Step by Step: Wire 1-Wire Probes (DS18B20)

**DS18B20** probes talk on **1-Wire** (OneWire): many probes share the same three wires and one Port, each with its own number. The **HLT**, **Mash** and **Kettle** probes of the 3 Vessel sample are DS18B20 probes. On a Mega the 1-Wire Port is **D40**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- The **1-Wire Port** (Mega: **D40**), shared by every DS18B20.
- One **4.7k ohm resistor** (the **pull-up**) for the whole set, not one per probe.
- One or more **waterproof DS18B20 probes** with **3 wires**. Skynet never uses parasite mode (2 wires): every probe gets its own 5 V wire.
- **Power for the probes: best is its own 5 V DC power supply.** The Mega's 5V works too for a few probes on short wires.
- A screw terminal block or a small board helps join the wires.

![Wiring DS18B20 probes on 1-Wire](help_pictures/Step_Wire_OneWire_01_Wiring.svg)

## What the pull-up does

The data wire has no voltage of its own. The Mega and each probe talk by **pulling the data wire down to GND** for a moment; nothing pushes it back up. The **pull-up resistor**, from the data wire to 5 V, gently pulls it back up to 5 V between those moments, so every pulse has a clean edge the Mega can read.

- **Without it** the Mega finds no probes, or they read -196 °F (-127 °C).
- **4.7k ohm is the standard** and right for most breweries.
- **Long or busy wires need a stronger pull-up:** more than about 30 m (100 ft) of cable in all, or more than about 10 probes, make the edges slow. Use a **2.2k ohm** resistor instead. Do not go below 2.2k ohm: the probes can't pull a stronger one down.
- **One per set of probes**, at the Mega end, between **D40** and the **same 5 V that powers the probes**.

## Step 1. Power and ground

Wire the power supply's **+5 V** to a terminal for the probes' red wires, and its **-V** to the Mega's **GND**. Every GND must be joined: the supply's -V, the Mega's GND and every probe's black wire. (Using the Mega's own 5V instead: wire the Mega's **5V** to that terminal.)

## Step 2. The data wire and the pull-up

Wire Mega **D40** to a terminal for the probes' yellow wires. Wire the **4.7k ohm resistor** from that data terminal to the **+5 V** terminal, once, near the Mega.

## Step 3. Daisy chain the probes

Run **one cable from probe to probe** (a daisy chain), and join each probe to it with a short branch: **red** to 5 V, **yellow** (or white) to data, **black** to GND. Some probes use other colors: check yours. Avoid a star (many long cables from one point): it makes the pulses ring.

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

- Use twisted pair cable (network cable works: one pair for data and GND, one for 5 V and GND) for long runs.
- The Skynet program on the Mega reads **one** 1-Wire Port. For more probes than one Port carries well, put them on a second board (its own Interface).
- Its own supply is best because a long run drops volts on the 5 V wire, and the probes then read wrong while they convert.
- Skynet sets each probe to its finest steps (0.0625 °C, about 0.11 °F).
- On the Mega program (`Mega_BrewPanel.ino`), `ONEWIRE_PIN` is 40.
