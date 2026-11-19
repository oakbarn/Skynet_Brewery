# Step by Step: Wire a Motorized Ball Valve

A **motorized ball valve** opens and closes by its own small motor. The common kind has **3 wires**: power +, a **control** wire, and GND. Power on the control wire opens it; power off closes it. This guide wires the **HLT out** valve of the 3 Vessel sample on Port **D24**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Port** (the sample's HLT out uses **D24**).
- One **relay module** channel ([Step by Step: Wire a Relay Board](215-step-by-step-wire-a-relay-board)).
- One **12 V or 24 V DC power supply**: the valve's volts (one supply runs many valves).
- One **motorized ball valve**, 3 wire, one control wire (its wiring is on its label) (see [Motorized Ball Valve](13-glossary#motorized-ball-valve)).

![Wiring: Wire a Motorized Ball Valve](help_pictures/Step_Wire_MBV_01_Wiring.svg)

## Step 1. The relay

Wire the relay board to the Mega, with its **IN** on Port **D24**.

## Step 2. Always-on power

Wire the supply's **+V** to the valve's **power +** wire, and also to the relay's **COM**.

## Step 3. The control wire

Wire the relay's **NO** to the valve's **control** wire.

## Step 4. Ground

Wire the valve's **GND** wire to the supply's **-V**.

## Step 5. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Valves** > **Motorized Ball Valve, open / closed (relay)** on Port **D24**.

## Step 6. Check it

Turn the Device On: after a few seconds the valve turns open. Off: it turns closed. If it does the opposite, your valve is a "power to close" kind: swap to its other wire as its label shows.

## Other boards

- **A valve with an Open wire and a Close wire** (2 control wires) needs two relays and two Ports: turn on **Dual Throw** in its Properties, so the two are never on together (see [Dual throw](167-dual-throw)).
- **An AC actuator** (120 V): wire it like a pump on an SSR or relay, by a Licensed Electrician.
- **Arduino Opta:** use one of its relays in place of the relay board.

## The technical side

- A valve draws most while it moves: size the supply for all the valves that may move at once.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `OUTPUT_PINS`.
