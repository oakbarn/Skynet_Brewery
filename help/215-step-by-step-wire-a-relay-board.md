# Step by Step: Wire a Relay Board

A **relay board** (relay module) lets a Port switch something bigger: a pump, a valve, a light, or a contactor's coil. The Port only moves a small magnet; the relay's own contacts carry the power. This guide wires the **Pump** of the 3 Vessel sample on Port **D22**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Port** (the sample's Pump uses **D22**).
- One **relay module** channel: 5 V coil for a Mega, **opto-isolated**, contacts rated for the load (10 A at 250 V AC is common) (see [Relay Module](13-glossary#relay-module)).
- The load and its own power (a DC supply, or AC for a pump plug).

![Wiring: Wire a Relay Board](help_pictures/Step_Wire_Relay_01_Wiring.svg)

## Step 1. Power the relay board

Wire the Mega's **5V** to the board's **VCC**, and **GND** to **GND**. A board with a **JD-VCC** jumper: leave the jumper on unless its maker says to power the coils from a separate 5 V supply.

## Step 2. The control wire

Wire Port **D22** to the board's **IN1**. The Skynet program turns a Port **On by pulling it LOW**, which is what most relay boards want: leave **Invert** Off.

## Step 3. The load side

The relay joins **COM** to **NO** while the Device is On. Put the load's + (or the AC Hot wire) through **COM** and **NO**. **NC** is joined while Off: leave it empty. Anything on AC: **have a Licensed Electrician wire it.**

## Step 4. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Pumps** > **Pump, on / off (relay or SSR)** on Port **D22**. For anything else, **On/Off** > **Relay module / SSR / contactor (on-off)**.

## Step 5. Check it

With the load's power **off**, turn the Device On: the relay clicks and its little light comes on. Off: it clicks back. If it works backwards, your board switches On with HIGH: set **Invert** On in the Port's attributes ⬢.

## Other boards

- **A 3.3 V board** may not switch a 5 V relay board every time: pick a board sold as **3.3 V trigger** or **High/Low trigger**, or use an SSR ([Step by Step: Wire an SSR](211-step-by-step-wire-an-ssr)).
- **Arduino Opta:** it has 4 relays of its own (Relay 1-4): no relay board needed.

## The technical side

- A relay coil draws about 70 mA; an opto-isolated board takes only a few mA from the Port. Never wire a bare relay coil straight to a Port.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `OUTPUT_PINS` (D22-D25 are there to start). `RELAY_ACTIVE_LOW` is `true`: On = LOW.
