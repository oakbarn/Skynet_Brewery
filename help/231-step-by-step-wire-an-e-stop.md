# Step by Step: Wire an E-Stop

An **E-Stop** (emergency stop) must **cut the power by its own wiring**, not only tell Skynet. A mushroom button with two contacts: **contact 1** drops the **Main Contactor** that feeds every heater and pump; **contact 2** tells Skynet on Port **D31**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Port** (this guide: **D31**).
- One **E-Stop mushroom button** with two **normally closed** contacts (see [E-Stop](13-glossary#e-stop)).
- One **Main Contactor** feeding every heater and pump circuit.

![Wiring: Wire an E-Stop](help_pictures/Step_Wire_EStop_01_Wiring.svg)

## Step 1. Contact 1 cuts the power

Contact 1 sits in the Main Contactor's **coil** wire: pressed, the coil loses power and every heater and pump stops, even if the computer has crashed. This is mains wiring: **have a Licensed Electrician do it.**

## Step 2. Contact 2 tells Skynet

Wire contact 2 between Port **D31** and the Mega's **GND**. Not pressed, it is closed.

## Step 3. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Inputs (switches, buttons)** > **Latching input (stays on until reset: leak, E-stop, alarm)** on Port **D31**, and set **Invert** On in its Properties, so pressed (contact open) reads ON.

## Step 4. Check it

Press it: the Main Contactor drops and Skynet shows it tripped. Twist to release, then reset it in Skynet.

## Other boards

- **A 3.3 V board:** contact 2 still goes to GND (the board's own pull-up). Never 5 V.
- **Arduino Opta:** wire contact 2 to an input with 24 V, as its maker shows.

## The technical side

- A normally closed contact is safer: a broken wire reads as pressed.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `INPUT_PINS` (D30-D33 are there to start).
