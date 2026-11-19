# Step by Step: Wire a DC Pump Speed Control

A **DC pump made for speed control** can run at any % when a **MOSFET module** switches its power very fast from a **True PWM Port**. This guide wires one on Port **D45**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **True PWM Port** (Mega: D2-D13, D44-D46). This guide uses **D45**.
- One **logic-level MOSFET module**, 10 A is plenty (see [MOSFET Module](13-glossary#mosfet-module)).
- One **12 or 24 V DC power supply**: the pump's volts, 1 A more than the pump draws.
- One **DC pump made for speed control**. An AC pump is On/Off only.

![Wiring: Wire a DC Pump Speed Control](help_pictures/Step_Wire_DCPump_01_Wiring.svg)

## Step 1. The signal

Wire Port **D45** to the module's **SIG** (or IN, PWM), and the Mega's **GND** to the module's **GND**.

## Step 2. Power in

Wire the supply's **+V** to the module's **V+ in** and **-V** to **V- in**. Join the supply's **-V** to the Mega's **GND** too.

## Step 3. The pump

Wire the module's **OUT +** to the pump's **+** and **OUT -** to the pump's **-**.

## Step 4. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Pumps** > **Pump speed 0-100 % (PWM output, e.g. a MOSFET module)** on Port **D45**.

## Step 5. Check it

Set 30 %, 60 %, 100 %: the pump runs faster each time. Never run a pump dry.

## Other boards

- **A pump with its own speed (PWM) wire** needs no MOSFET: its speed wire goes to **D45**, its GND joined to the Mega's GND, and its power straight from the supply.
- **A 3.3 V board:** pick a MOSFET module that switches fully from 3.3 V.
- **Arduino Opta:** it has no PWM Port for this.

## The technical side

- Use a **logic-level** MOSFET: a plain IRF520 board is only half on from 5 V and gets hot.
- D44-D46 are in `PWM_PINS` already.
