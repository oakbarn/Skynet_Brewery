# Step by Step: Wire a DAC (0-10 V)

A **DAC** turns a % from Skynet into a smooth 0-10 V signal, so a heater, a proportional valve or a pump speed control can be set to any % instead of only On or Off. On a Mega the DAC is a **PWM to 0-10 V Module** on a **True PWM Port**. This guide wires one to a **0-10 V Power Controller** for a heating element, on Port **D44**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **True PWM Port** (Mega: D2-D13 or D44-D46). This guide uses **D44**.
- One **PWM to 0-10 V Module** (see [DAC](13-glossary#dac)), set to give **0-10 V**.
- One **12 or 24 V DC Power Supply** for the module (the volts the module asks for).
- One **0-10 V Power Controller** (SCR or SSVR) on its Heat Sink, sized for the element (see [0-10V Controller](13-glossary#0-10v-controller)).
- Wire for the low voltage side (red, black, yellow, blue are the colors in the picture).

![Wiring a PWM to 0-10 V Module](help_pictures/Step_Wire_DAC_01_Wiring.svg)

## Step 1. Set the module

Set the module's jumper or screw for a **0-10 V** output, as its maker shows. Some modules also have an input setting: set it for the board's signal (5 V for a Mega).

## Step 2. Power the module

Wire the power supply's **+V** to the module's **VCC** and the supply's **-V** to the module's power **GND**. Do not plug the supply in yet.

## Step 3. Join the grounds

Wire the Mega's **GND** to the module's **GND**. The Mega GND, the module GND and the supply's -V must all be joined, or the signal has nothing to measure against.

## Step 4. Wire the signal in

Wire Mega Port **D44** to the module's **PWM in**.

## Step 5. Wire the signal out

Wire the module's **VOUT** to the power controller's **0-10 V +** and the module's output **GND** to the controller's **0-10 V -**.

## Step 6. The AC side

The power controller's AC side (GFCI power and the heating element) is mains power. **Have a Licensed Electrician wire it.** It is not drawn here.

## Step 7. Add the Device in Skynet

Add a **Heating Element: PWM (0 to 100%)** (Select Device Type: **Heating Element**) on Port **D44** of your Mega, as in [Step by Step: Add a Device](207-step-by-step-add-a-device). A True PWM Port sends the % as PWM, which is what the module needs.

For a proportional valve or a pump speed control, pick **Analog output 0-10 V** (Select Device Type: **PWM / Analog out**) instead.

## Step 8. Check it

With the element **unplugged or its breaker off**, set the Device to 0 %, 50 % and 100 % and measure the module's VOUT with a meter: about 0 V, 5 V and 10 V. A module seldom gives exactly 10 V at 100 %: set its trim screw if it has one. A PWM output or Analog output Device also has **Measured volts** in its Properties, so Skynet shows the real volts.

## Other boards

- **A 3.3 V board** (ESP32, Pi, Due ...) sends a 3.3 V PWM: pick a module that takes a 3.3 V signal.
- **4-20 mA:** a **PWM to 4-20 mA Module** is wired the same way; pick **Analog output 4-20 mA** in Skynet.
- **Arduino Opta:** it has no PWM Port or 0-10 V output of its own. The Opta Analog Expansion (A0602) has 0-10 V outputs, but Skynet's Opta program does not drive it yet (see [Skynet Boards](206-skynet-boards)).

## The technical side

- Do not wire a plain zero-cross SSR straight to a True PWM Port: the Port switches hundreds of times a second and a zero-cross SSR can follow only 120 a second, so the power comes out uneven. Use an SSR on a plain Port instead ([Step by Step: Wire an SSR](211-step-by-step-wire-an-ssr)).
- On the Mega program (`Mega_BrewPanel.ino`), D44-D46 are in `PWM_PINS` already. An **Analog output** Device needs its Port in `AO_PINS` instead (for example `{13}`); change the list and upload it again.
