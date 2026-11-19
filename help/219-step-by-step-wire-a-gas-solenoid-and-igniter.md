# Step by Step: Wire a Gas Solenoid and Igniter

A **gas burner** is switched by a **24 V gas solenoid valve** and lit by an **igniter**, each on its own relay. This guide wires them on Ports **D26** (gas) and **D27** (igniter). Only the low voltage control side is shown: the gas side is for a professional.

> **⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.** (Rule 6.20)

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- Two free **Ports** (this guide: **D26** and **D27**).
- Two **relay module** channels ([Step by Step: Wire a Relay Board](215-step-by-step-wire-a-relay-board)).
- One **24 V supply** for the gas solenoid (24 V DC, or a true 24 V AC transformer for a 24 V AC valve).
- One **gas solenoid valve**: normally closed, listed for your gas, rated above the regulator's pressure (see [Gas Solenoid Valve](13-glossary#gas-solenoid-valve)).
- One **igniter** and its own supply (see [Igniter](13-glossary#igniter)).
- A **flame safety**: a listed thermocouple gas valve is recommended (see [Flame out safety](197-flame-out-safety)).

![Wiring: Wire a Gas Solenoid and Igniter](help_pictures/Step_Wire_Gas_01_Wiring.svg)

## Step 1. The relays

Wire a two-channel relay board to the Mega, with **IN1** on **D26** and **IN2** on **D27**.

## Step 2. The gas solenoid

Wire the 24 V supply's **+** through relay 1's **COM** and **NO** to the solenoid, and the solenoid's other wire to the supply's **-**.

## Step 3. The igniter

Wire the igniter's supply through relay 2's **COM** and **NO** the same way. A 120 V igniter is mains: a Licensed Electrician wires it.

## Step 4. The gas side

Tank, regulator, flame safety, solenoid and burner: **have a Licensed Plumber or HVAC professional install them**, and leak test every joint.

## Step 5. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): the gas solenoid as a **Heating Element** with **Gas burner** On (it then has Flame Out, see [Flame out safety](197-flame-out-safety)) on **D26**, and the igniter on **D27**.

## Step 6. Check it

With the **gas tank shut**, turn the burner On: the solenoid clicks and the igniter sparks. Off: both stop.

## Other boards

- **A 3.3 V board:** use a 3.3 V relay board.
- **Arduino Opta:** use two of its relays.

## The technical side

- Skynet's Flame Out is not a UL listed safety and should not be relied on. Always monitor the burner.
- On the Mega program (`Mega_BrewPanel.ino`), both Ports must be in `OUTPUT_PINS`.
