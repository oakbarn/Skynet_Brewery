# Step by Step: Wire a Fan, Buzzer or LED

A **small LED** goes on a Port with a resistor. A **fan** or **buzzer** draws more than a Port gives, so it goes through a **relay** or **MOSFET module**. This guide uses **D41** (LED) and **D42** (fan or buzzer).

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- A free **Port** for each (this guide: **D41**, **D42**).
- For an LED: one **330 ohm resistor** (220 ohm for brighter).
- For a fan or buzzer: one **relay module** channel or **MOSFET module**, and a **12 V supply**.

![Wiring: Wire a Fan, Buzzer or LED](help_pictures/Step_Wire_FanLED_01_Wiring.svg)

## Step 1. The LED

Wire the Mega's **5V** to the **330 ohm** resistor, the resistor to the LED's **long** leg, and the LED's **short** leg to **D41**. The Mega turns a Port On by pulling it LOW, so the LED lights when the Device is On.

## Step 2. The fan or buzzer

Wire a relay (or MOSFET module) to **D42** as in [Step by Step: Wire a Relay Board](215-step-by-step-wire-a-relay-board), and switch the fan's or buzzer's 12 V through it.

## Step 3. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **On/Off** > **Relay module / SSR / contactor (on-off)** on **D41** or **D42**. A fan on a True PWM Port can have its speed set with a MOSFET module ([Step by Step: Wire a DC Pump Speed Control](220-step-by-step-wire-a-dc-pump-speed-control)).

## Step 4. Check it

Turn each Device On and Off.

## Other boards

- **A 3.3 V board:** wire the LED's resistor to **3.3V** and use 100 ohm.
- **Arduino Opta:** use its relays, or its own status lights.

## The technical side

- Never wire an LED without its resistor.
- A Mega Port gives at most 20 mA, and all Ports together about 200 mA.
- On the Mega program (`Mega_BrewPanel.ino`), the Ports must be in `OUTPUT_PINS`.
