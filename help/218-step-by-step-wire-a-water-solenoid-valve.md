# Step by Step: Wire a Water Solenoid Valve

A **solenoid valve** snaps open when its coil gets power and shuts when the power goes. Most need water pressure, so they suit tap water or cooling water. This guide wires a 12 V **normally closed** valve on Port **D25**, with a **diode** across its coil.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Port** (this guide: **D25**).
- One **relay module** channel ([Step by Step: Wire a Relay Board](215-step-by-step-wire-a-relay-board)).
- One **12 V or 24 V DC power supply**: the valve's volts.
- One **normally closed solenoid valve**: food grade (stainless) for wort, brass is fine for cooling water (see [Solenoid Valve](13-glossary#solenoid-valve)).
- One **1N4007 diode**, if the valve has none (see [Diode](13-glossary#diode)).

![Wiring: Wire a Water Solenoid Valve](help_pictures/Step_Wire_Solenoid_01_Wiring.svg)

## Step 1. The relay

Wire the relay board to the Mega, with its **IN** on Port **D25**.

## Step 2. Coil power

Wire the supply's **+V** to the relay's **COM**, the relay's **NO** to the coil's **+**, and the coil's **-** to the supply's **-V**.

## Step 3. The diode

Put the **1N4007 diode** across the coil's two wires, its **stripe toward the +** side. It soaks up the kick when the coil turns off, so it does not burn the relay's contacts. Backwards, it shorts the supply.

## Step 4. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Valves** > a valve row, or **On/Off** > **Relay module / SSR / contactor (on-off)**, on Port **D25**. A tap water valve: turn on **Tap water valve** in its Properties.

## Step 5. Check it

With the water off, turn the Device On: the valve clicks open. Off: it clicks shut. Then turn the water on and check for leaks.

## Other boards

- **A 3.3 V board:** use a 3.3 V relay board, or a DC SSR ("DD" type) in place of the relay.
- **Arduino Opta:** use one of its relays; keep the diode.

## The technical side

- A solenoid gets warm while it is open: that is normal.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `OUTPUT_PINS`.
