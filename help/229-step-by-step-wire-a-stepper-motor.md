# Step by Step: Wire a Stepper Motor

A **stepper motor** turns in exact steps (a grain mill gate, a hop dropper). The Mega sends **STEP** and **DIR** to a **stepper driver**, which powers the motor from its own supply. This guide uses **D36** (STEP), **D37** (DIR) and **D38** (ENABLE).

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- Two or three free **Ports** (this guide: **D36**, **D37**, **D38**), plus one for a home switch if you use one.
- One **stepper driver** (A4988, DRV8825, TMC2209, TB6600 ...) (see [Stepper Driver](13-glossary#stepper-driver)).
- One **12-24 V DC power supply** for the motor: never the Mega's 5V.
- One **stepper motor**.

![Wiring: Wire a Stepper Motor](help_pictures/Step_Wire_Stepper_01_Wiring.svg)

## Step 1. Logic side

Wire the Mega's **5V** to the driver's **VDD**, and **GND** to its logic **GND**.

## Step 2. STEP, DIR, ENABLE

Wire **D36** to **STEP**, **D37** to **DIR** and **D38** to **EN**.

## Step 3. Motor power

Wire the supply's **+V** to **VMOT** and **-V** to the motor **GND**. A small driver board wants a 100 uF capacitor across VMOT and GND.

## Step 4. The motor

Wire coil 1 to **1A** and **1B**, coil 2 to **2A** and **2B** (a meter finds each pair: the two wires of one coil show a few ohms).

## Step 5. Set the current

Set the driver's current limit for your motor, as its maker shows, before the first run.

## Step 6. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Motors** > **Stepper motor on a STEP / DIR driver (A4988, DRV8825, TMC2209, TB6600, DM542)** with its Ports.

## Step 7. Check it

Move it a few steps each way. If it only buzzes, one coil is swapped or the current is too low.

## Other boards

- **A 28BYJ-48 motor on a ULN2003 board** uses 4 Ports and 5 V: pick its own row.
- **A 3.3 V board:** most drivers take a 3.3 V STEP; check yours.
- **Arduino Opta:** a relay can't give step pulses; use a driver with its own controller, or put the motor on a Mega.

## The technical side

- Never unplug a motor while the driver is powered: it can ruin the driver.
- On the Mega program (`Mega_BrewPanel.ino`), set `USE_STEPPER` to 1 and list every Port it uses in `STEPPER_PINS` (for example `{36, 37, 38}`), then upload it again.
